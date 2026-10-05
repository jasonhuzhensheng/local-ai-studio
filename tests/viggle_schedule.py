import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'src'))
from viggle_schedule import install_base_tail,SIGMAS_6,SIGMAS_9
class Transformer:
 def forward(self,**kwargs):return kwargs['kv_cache_mode']
class Pipe:
 def __init__(self):self.transformer=Transformer();self.enabled=True
 def disable_lora(self):self.enabled=False
 def enable_lora(self):self.enabled=True
p=Pipe();original=p.transformer.forward;step,restore=install_base_tail(p)
for i in range(6):step(i);assert p.enabled
step(6);assert not p.enabled
assert p.transformer.forward(kv_cache_mode='cached')=='extract'
assert p.transformer.forward(kv_cache_mode='cached')=='cached'
restore();assert p.enabled and p.transformer.forward==original
assert len(SIGMAS_9)==9 and SIGMAS_9[-2:]==[1/6,1/12] and len(SIGMAS_6)==6
print('PASS: seven turbo steps, base tail, KV re-extract exactly once, restoration')
