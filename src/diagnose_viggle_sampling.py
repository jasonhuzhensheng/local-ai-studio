"""Reproduce large editing with synthetic geometry, recording latent diagnostics."""
import json
import os
from pathlib import Path
import threading
import time
from urllib.request import urlopen

HOME = Path.home() / 'Library/Application Support/LocalImageStudio'
OUT = HOME / 'validation/sampling-large'
OUT.mkdir(parents=True, exist_ok=True)
REPORT = OUT / 'result.json'
state = {'success': False, 'phase': 'checking_queue', 'steps': []}


def record(**values):
    state.update(values)
    REPORT.write_text(json.dumps(state, indent=2))


def busy():
    with urlopen('http://127.0.0.1:1235/api/jobs', timeout=3) as r:
        d = json.load(r)
    return any(j.get('status') in {'queued', 'starting', 'running'}
               for j in (d if isinstance(d, list) else d.get('jobs', [])))


def watch():
    while True:
        time.sleep(2)
        try:
            stop = busy()
        except Exception:
            stop = True
        if stop:
            os._exit(75)


if busy():
    record(phase='deferred_user_queue')
    raise SystemExit(75)
threading.Thread(target=watch, daemon=True).start()
os.environ['LOCAL_VIGGLE_BASE'] = str(HOME / 'models/Qwen-Image-2.1-diffusers')
record(phase='loading')
import torch
import viggle_worker as worker

# All input is the independent geometric VAE test, never a user reference.
worker.MODELS = HOME / 'models'
job = {'model_id': 'viggle-qwen-image-2.1-4step', 'width': 1440, 'height': 2272,
       'seed': 42, 'large_mode': 'balanced',
       'prompt': 'Change the large blue rectangle to green. Keep the red rectangle and pale background unchanged.',
       'referenceImages': [str(HOME / 'validation/vae-large/roundtrip.png')]}
(OUT / 'job.json').write_text(json.dumps(job))
original_call = worker.QwenImage21Pipeline.__call__


def diagnosed_call(pipe, *args, **kwargs):
    callback = kwargs.get('callback_on_step_end')

    def step(p, index, timestep, values):
        z = values['latents'].detach().float()
        stats = {'step': index + 1, 'finite': bool(torch.isfinite(z).all().item()),
                 'min': float(z.min().item()), 'max': float(z.max().item()),
                 'rms': float(z.square().mean().sqrt().item())}
        state['steps'].append(stats)
        record(phase='sampling')
        if index == 3:
            torch.save(z.cpu(), OUT / 'final-packed-latents.pt')
        return callback(p, index, timestep, values) if callback else values

    kwargs['callback_on_step_end'] = step
    return original_call(pipe, *args, **kwargs)


worker.QwenImage21Pipeline.__call__ = diagnosed_call
started = time.monotonic()
try:
    worker.main(str(OUT / 'job.json'), str(OUT / 'image.png'))
    record(success=True, phase='saved_pending_visual_review', elapsedSeconds=round(time.monotonic()-started, 1))
except Exception as error:
    record(phase='failed', error=type(error).__name__ + ': ' + str(error))
    raise
