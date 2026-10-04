"""Isolate large tiled VAE round-trip using a synthetic RGBA test pattern."""
import json
import os
from pathlib import Path
import threading
import time
from urllib.request import urlopen

HOME = Path.home() / 'Library/Application Support/LocalImageStudio'
OUT = HOME / 'validation/decode-comparison'
OUT.mkdir(parents=True, exist_ok=True)
REPORT = OUT / 'result.json'
state = {'success': False, 'phase': 'checking_queue'}


def record(**values):
    state.update(values)
    temporary = REPORT.with_suffix('.partial')
    temporary.write_text(json.dumps(state, indent=2))
    temporary.replace(REPORT)


def busy():
    with urlopen('http://127.0.0.1:1235/api/jobs', timeout=3) as response:
        data = json.load(response)
    jobs = data if isinstance(data, list) else data.get('jobs', [])
    return any(j.get('status') in {'queued', 'starting', 'running'} for j in jobs)


def watch():
    while True:
        time.sleep(2)
        try:
            stop = busy()
        except Exception:
            stop = True
        if stop:
            # Exit only this isolated diagnostic, releasing its GPU resources.
            os._exit(75)


if busy():
    record(phase='deferred_user_queue')
    raise SystemExit(75)
threading.Thread(target=watch, daemon=True).start()
record(phase='loading')
import torch
from PIL import Image
from diffusers import AutoencoderKLQwenImage21, QwenImage21Pipeline
started = time.monotonic()
packed = torch.load(HOME / 'validation/sampling-large/final-packed-latents.pt', weights_only=True)
outputs = {}
with torch.inference_mode():
    for name, dtype in [('bf16', torch.bfloat16), ('fp32', torch.float32)]:
        vae = AutoencoderKLQwenImage21.from_pretrained(HOME / 'models/Qwen-Image-2.1-diffusers', subfolder='vae', dtype=dtype, local_files_only=True).to('mps')
        vae.enable_tiling(tile_sample_min_height=1024, tile_sample_min_width=1024, tile_sample_stride_height=768, tile_sample_stride_width=768)
        z = QwenImage21Pipeline._unpack_latents(packed, 2272, 1440, 16).to('mps', dtype)
        mean = torch.tensor(vae.config.latents_mean, device='mps', dtype=dtype).view(1,-1,1,1,1)
        std = torch.tensor(vae.config.latents_std, device='mps', dtype=dtype).view(1,-1,1,1,1)
        record(phase='decoding_' + name)
        result = vae.decode(z*std+mean).sample.float().cpu()
        outputs[name] = result
        pixels = ((result[0,:,0].clamp(-1,1)+1)*127.5).permute(1,2,0).to(torch.uint8).numpy()
        Image.fromarray(pixels, 'RGBA').save(OUT / (name+'.png'))
        del vae, z, mean, std
        torch.mps.empty_cache()
record(success=True, phase='awaiting_visual_review', elapsedSeconds=round(time.monotonic()-started,1), mae=float((outputs['bf16']-outputs['fp32']).abs().mean()), finite=all(bool(torch.isfinite(v).all()) for v in outputs.values()))
