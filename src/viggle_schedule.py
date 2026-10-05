"""Viggle v0.3 official schedules and seven-turbo/two-base handoff."""
SIGMAS_6=[1.0,0.9375,0.875,0.75,0.5,0.25]
SIGMAS_9=[1.0,0.9583,0.9167,0.875,0.75,0.5,0.25,1/6,1/12]
def install_base_tail(pipe):
    original=pipe.transformer.forward
    reextract=[False]
    def forward(*args,kv_cache_mode=None,**kwargs):
        if reextract[0] and kv_cache_mode=='cached':
            kv_cache_mode='extract';reextract[0]=False
        return original(*args,kv_cache_mode=kv_cache_mode,**kwargs)
    pipe.transformer.forward=forward
    def step(index):
        if index==6:
            pipe.disable_lora();reextract[0]=True
    def restore():
        pipe.transformer.forward=original
        pipe.enable_lora()
    return step,restore
