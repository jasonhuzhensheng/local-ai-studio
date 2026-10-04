"""Download pinned H3 experiment weights, resume partials, verify before activation."""
import concurrent.futures, fcntl, hashlib, json, os, subprocess
from pathlib import Path
BASE=Path.home()/'Library/Application Support/LocalImageStudio/video-experimental'
MODELS=BASE/'ComfyUI/models'

def download(item):
    target=MODELS/item['destination'];target.parent.mkdir(parents=True,exist_ok=True)
    partial=target.with_suffix(target.suffix+'.partial')
    url=f"https://huggingface.co/{item['repo']}/resolve/{item['revision']}/{item['file']}"
    source=target if target.exists() else partial
    if not target.exists():
        print('Downloading '+item['destination'],flush=True)
        subprocess.run(['curl','--fail','--location','--silent','--show-error','--retry','5','--retry-delay','5','--connect-timeout','30','--speed-limit','1024','--speed-time','120','--continue-at','-','--output',str(partial),url],check=True)
    if source.stat().st_size!=item['bytes']:raise RuntimeError('size mismatch: '+str(source))
    h=hashlib.sha256()
    with source.open('rb') as f:
        for chunk in iter(lambda:f.read(8*1024*1024),b''):h.update(chunk)
    if h.hexdigest()!=item['sha256']:raise RuntimeError('hash mismatch: '+str(source))
    if source==partial:partial.replace(target)
    print('Verified '+item['destination'],flush=True)
    return item['destination']

if __name__=='__main__':
    BASE.mkdir(parents=True,exist_ok=True)
    with (BASE/'download.lock').open('w') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        items=json.loads(Path(__file__).with_name('h3_apple_models.json').read_text())
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:done=list(pool.map(download,items))
        (BASE/'download-verified.json').write_text(json.dumps(done,indent=2))
