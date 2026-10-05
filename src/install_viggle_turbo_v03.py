"""Pinned v0.3 adapter; reuse installed base and environment. curl uses system TLS trust."""
import fcntl,hashlib,json,os,subprocess
from pathlib import Path
M=json.loads((Path(__file__).parent/'viggle_turbo_v03_model.json').read_text())
D=Path(os.environ.get('LOCAL_VIGGLE_V03',str(Path.home()/'Library/Application Support/LocalImageStudio/models/viggle-qwen-turbo-v03')))
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for c in iter(lambda:f.read(8*1024*1024),b''):h.update(c)
 return h.hexdigest()
def main():
 D.mkdir(parents=True,exist_ok=True)
 with (D/'.install.lock').open('w') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  for name in [M['file'],'scheduler/scheduler_config.json','README.md','LICENSE','NOTICE']:
   dest=D/name;dest.parent.mkdir(parents=True,exist_ok=True)
   if name==M['file'] and dest.exists() and dest.stat().st_size==M['bytes'] and digest(dest)==M['sha256']:continue
   part=dest.with_suffix(dest.suffix+'.part')
   subprocess.run(['curl','--fail','--location','--retry','4','--connect-timeout','30','--max-time','1800','--continue-at','-','--output',str(part),f"https://huggingface.co/{M['repository']}/resolve/{M['revision']}/{name}"],check=True)
   if name==M['file'] and (part.stat().st_size!=M['bytes'] or digest(part)!=M['sha256']):raise RuntimeError('Weight verification failed')
   part.replace(dest)
  if json.loads((D/'scheduler/scheduler_config.json').read_text()).get('shift_terminal','missing') is not None:raise RuntimeError('Invalid scheduler')
  tmp=D/'verified.json.tmp';tmp.write_text(json.dumps(M,indent=2));tmp.replace(D/'verified.json')
  print('VERIFIED',M['revision'],M['sha256'],flush=True)
if __name__=='__main__':main()
