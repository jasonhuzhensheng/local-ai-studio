import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace
import stat

spec = importlib.util.spec_from_file_location('migration', Path(__file__).resolve().parents[1] / 'src/prepare_local_storage.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class LocalStorageTests(unittest.TestCase):
    def report(self):
        return {'pending': [], 'blockedLinks': [], 'copied': 0, 'unchanged': 0}

    def test_copy_and_resume_preserve_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            source, target = Path(directory) / 'source', Path(directory) / 'out' / 'target'
            source.write_bytes(b'local migration test')
            report = self.report()
            m.copy_resident(source, target, report)
            m.copy_resident(source, target, report)
            self.assertEqual(target.read_bytes(), source.read_bytes())
            self.assertEqual((report['copied'], report['unchanged']), (1, 1))
            self.assertFalse(target.stat().st_flags & m.DATALESS)

    def test_placeholder_is_reported_without_opening(self):
        report = self.report()
        source = Path('/not-a-real-placeholder')
        info = SimpleNamespace(st_mode=stat.S_IFREG, st_flags=m.DATALESS, st_size=500)
        with patch.object(Path, 'is_symlink', return_value=False), patch.object(Path, 'stat', return_value=info):
            m.copy_resident(source, Path('/not-a-real-target'), report)
        self.assertEqual(len(report['pending']), 1)
        self.assertEqual(report['copied'], 0)

    def test_refuse_writing_through_destination_symlink(self):
        with tempfile.TemporaryDirectory() as directory:
            source, real, target = [Path(directory) / n for n in ['source', 'real', 'target']]
            source.write_bytes(b'new')
            real.write_bytes(b'keep')
            target.symlink_to(real)
            with self.assertRaises(RuntimeError):
                m.copy_resident(source, target, self.report())
            self.assertEqual(real.read_bytes(), b'keep')


if __name__ == '__main__':
    unittest.main()
