#!/usr/bin/env python3
"""Stage resident application files outside Documents without changing production.

Skips cloud placeholders, reports every omission, and is safe to resume.
Production cutover requires a separate idle-queue check and validation.
"""
import ctypes
import json
import os
from pathlib import Path
import shutil
import stat

ROOT = Path(__file__).resolve().parents[1]
HOME = Path.home() / 'Library/Application Support/LocalImageStudio'
APP = HOME / 'app'
RUNTIME = HOME / 'runtime'
REPORT = ROOT / '.local/storage-migration.json'
DATALESS = 0x40000000
libc = ctypes.CDLL(None, use_errno=True)
libc.clonefile.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]


def copy_resident(source, target, report):
    if source.is_symlink():
        link = os.readlink(source)
        if link.startswith(str(ROOT)):
            report['blockedLinks'].append(str(source))
            return
        target.parent.mkdir(parents=True, exist_ok=True)
        if not os.path.lexists(target):
            target.symlink_to(link)
        elif target.resolve() == source.resolve():
            return
        elif not target.is_symlink() or os.readlink(target) != link:
            raise RuntimeError(f'Conflicting target link: {target}')
        return
    info = source.stat()
    if not stat.S_ISREG(info.st_mode):
        return
    if info.st_flags & DATALESS:
        report['pending'].append({'source': str(source), 'target': str(target), 'bytes': info.st_size})
        return
    if target.is_symlink():
        raise RuntimeError(f'Refusing file target symlink: {target}')
    if target.exists():
        dst = target.stat()
        if dst.st_size == info.st_size and dst.st_mtime_ns == info.st_mtime_ns and not dst.st_flags & DATALESS:
            report['unchanged'] += 1
            return
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + '.migration-partial')
    if temporary.exists():
        temporary.unlink()
    if libc.clonefile(os.fsencode(source), os.fsencode(temporary), 0):
        shutil.copyfile(source, temporary)
    if temporary.stat().st_flags & DATALESS or temporary.stat().st_size != info.st_size:
        temporary.unlink()
        raise RuntimeError(f'Copy not resident or size mismatch: {source}')
    os.chflags(temporary, 0)
    os.chmod(temporary, stat.S_IMODE(info.st_mode))
    os.utime(temporary, ns=(info.st_atime_ns, info.st_mtime_ns))
    temporary.replace(target)
    report['copied'] += 1


def tree(source, target, report):
    if not source.exists():
        return
    for directory, dirs, files in os.walk(source):
        dirs[:] = [d for d in dirs if d not in {'.git', '__pycache__', '.cache'} and '.cloud-backup-' not in d and d != 'hf-cache']
        relative = Path(directory).relative_to(source)
        for name in list(dirs):
            p = Path(directory) / name
            if p.is_symlink():
                copy_resident(p, target / relative / name, report)
                dirs.remove(name)
        for name in files:
            if name in {'.DS_Store', '.gitkeep'} or name.endswith('.pyc'):
                continue
            copy_resident(Path(directory) / name, target / relative / name, report)


def main():
    report = {'root': str(HOME), 'state': 'staging-only', 'copied': 0, 'unchanged': 0, 'pending': [], 'blockedLinks': [], 'rebuiltEnvironments': []}
    for name in ['src', 'tests', 'docs']:
        tree(ROOT / name, APP / name, report)
    for name in ['AGENTS.md', 'handoff.md']:
        copy_resident(ROOT / name, APP / name, report)
    for name in ['viggle-env', 'cline-runtime', 'stable-diffusion.cpp', 'sd-native-profile', 'sd-qwen-cache', 'qevi-model']:
        if name in {'viggle-env', 'cline-runtime'} and (RUNTIME / name / 'migration-ready.json').exists():
            report['rebuiltEnvironments'].append(name)
            continue
        tree(ROOT / '.local' / name, RUNTIME / name, report)
    # New data is staged separately and must be reconciled while idle before activation.
    for name in ['image-jobs', 'image-references']:
        tree(ROOT / '.local' / name, RUNTIME / name, report)
    tree(ROOT / '.local/image-models', HOME / 'models', report)
    for source, target in [(RUNTIME, APP / '.local'), (HOME / 'models', RUNTIME / 'image-models')]:
        if not os.path.lexists(target):
            target.symlink_to(source, target_is_directory=True)
        elif not target.is_symlink() or target.resolve() != source:
            raise RuntimeError(f'Conflicting runtime directory: {target}')
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: (len(v) if isinstance(v, list) else v) for k, v in report.items()}, ensure_ascii=False))


if __name__ == '__main__':
    main()
