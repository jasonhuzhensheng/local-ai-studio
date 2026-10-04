"""Verify the pinned download before making it available to the local worker."""
import hashlib
import json
from pathlib import Path
root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'src/wai_model.json').read_text())
final = root / '.local/image-models' / manifest['file']
part = final.with_name(final.name + '.part')
source = part if part.exists() else final
if source.stat().st_size != manifest['bytes']:
    raise SystemExit('Model download incomplete; final model was not enabled')
digest = hashlib.sha256()
with source.open('rb') as stream:
    for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b''):
        digest.update(chunk)
if digest.hexdigest() != manifest['sha256']:
    raise SystemExit('SHA-256 mismatch; final model was not enabled')
if source == part:
    part.rename(final)
print('PASS: WAI v17 file size and SHA-256; model enabled')
