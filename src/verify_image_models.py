"""Verify pinned image weights before making partial downloads usable."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for model in json.loads((ROOT / 'src/image_models.json').read_text()):
    final = ROOT / '.local/image-models' / Path(model['file']).name
    source = final if final.exists() else final.with_name(final.name + '.part')
    if source.stat().st_size != model['size']:
        raise SystemExit(f'Incomplete: {source.name}: {source.stat().st_size}/{model["size"]}')
    with source.open('rb') as stream:
        digest = hashlib.file_digest(stream, 'sha256').hexdigest()
    if digest != model['sha256']:
        raise SystemExit(f'SHA256 mismatch: {source.name}')
    if source != final:
        source.rename(final)
    print(f'Verified: {final.name}', flush=True)
