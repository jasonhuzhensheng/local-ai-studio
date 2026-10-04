"""Resume the pinned WAI download, verify, then enqueue a benign acceptance job."""
import json
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
m=json.loads((root/'src/wai_model.json').read_text())
final=root/'.local/image-models'/m['file']
if not final.exists():
    url=f"https://huggingface.co/{m['repository']}/resolve/{m['revision']}/{m['file']}"
    subprocess.run(['curl','-L','--fail','--retry','5','-C','-',url,'-o',str(final)+'.part'],check=True,cwd=root)
subprocess.run(['python3',str(root/'src/verify_wai_model.py')],check=True,cwd=root)
if not (root/'.local/wai-acceptance.json').exists():
    subprocess.run(['/opt/homebrew/bin/node',str(root/'src/accept_wai_model.mjs')],check=True,cwd=root)
