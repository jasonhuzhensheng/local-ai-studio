"""Isolate large tiled VAE round-trip using a synthetic RGBA test pattern."""
import json
import os
from pathlib import Path
import threading
import time
from urllib.request import urlopen

HOME = Path.home() / 'Library/Application Support/LocalImageStudio'
OUT = HOME / 'validation/vae-large'
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
record(phase='loading_vae')
import torch
from PIL import Image
from diffusers import AutoencoderKLQwenImage21

started = time.monotonic()
vae = AutoencoderKLQwenImage21.from_pretrained(
    HOME / 'models/Qwen-Image-2.1-diffusers', subfolder='vae',
    dtype=torch.bfloat16, local_files_only=True,
).to('mps')
vae.enable_tiling(tile_sample_min_height=1024, tile_sample_min_width=1024,
                  tile_sample_stride_height=768, tile_sample_stride_width=768)
# Opaque pale background, blue rectangle, red rectangle; no user media.
x = torch.ones((1, 4, 1, 2272, 1440), dtype=torch.float32) * 0.8
x[:, 3] = 1
x[:, :3, :, 400:1500, 250:900] = torch.tensor([-0.8, -0.3, 0.8]).view(1, 3, 1, 1, 1)
x[:, :3, :, 1600:1900, 700:1200] = torch.tensor([0.8, -0.7, -0.7]).view(1, 3, 1, 1, 1)
with torch.inference_mode():
    record(phase='encoding', width=1440, height=2272)
    latent = vae.encode(x.to('mps', torch.bfloat16)).latent_dist.mode()
    record(phase='decoding', latentFinite=bool(torch.isfinite(latent).all().item()),
           latentMin=float(latent.min().item()), latentMax=float(latent.max().item()))
    result = vae.decode(latent).sample.float().cpu()
    pixels = ((result[0, :, 0].clamp(-1, 1) + 1) * 127.5).permute(1, 2, 0).to(torch.uint8).numpy()
    Image.fromarray(pixels, 'RGBA').save(OUT / 'roundtrip.png')
    record(success=True, phase='complete', elapsedSeconds=round(time.monotonic()-started, 1),
           outputFinite=bool(torch.isfinite(result).all()), meanAbsoluteError=float((result-x).abs().mean()),
           outputMin=float(result.min()), outputMax=float(result.max()))
print(json.dumps(state), flush=True)
