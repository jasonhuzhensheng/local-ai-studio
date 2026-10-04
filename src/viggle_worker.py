#!/usr/bin/env python3
"""Run the pinned 4-step Viggle Qwen Image 2.1 adapter on Apple MPS."""
import json
import math
import os
import sys
import time
from pathlib import Path
from local_model_files import require_resident_tree

ROOT = Path(__file__).resolve().parents[1]
MODELS = ROOT / ".local" / "image-models"
BASE = Path(os.environ.get("LOCAL_VIGGLE_BASE", str(MODELS / "Qwen-Image-2.1-diffusers")))
require_resident_tree(BASE)

dependency_started = time.monotonic()
print('[viggle] DEPENDENCIES_START 正在加载Python依赖', flush=True)
from PIL import Image
import torch
from diffusers import FlowMatchEulerDiscreteScheduler, QwenImage21Pipeline
print(f'[viggle] DEPENDENCIES_READY 依赖加载完成，用时 {time.monotonic() - dependency_started:.1f}s', flush=True)


ADAPTER = MODELS / "viggle-qwen-turbo"
V01_LORA = "Qwen-Image-2.1-viggle-turbo-4step-lora-r64.safetensors"
V021_LORA = "Qwen-Image-2.1-viggle-turbo-v0.2.1-6step-lora-r256.safetensors"
V021_SIGMAS = [1.0, 0.9375, 0.875, 0.75, 0.5, 0.25]


def main(status_path: str, output_path: str) -> None:
    job = json.loads(Path(status_path).read_text())
    if not torch.backends.mps.is_available():
        raise RuntimeError("PyTorch 无法访问 Apple Metal GPU（MPS）")
    is_v021 = job.get("model_id") == "viggle-qwen-image-2.1-v0.2.1"
    steps = 6 if is_v021 else 4
    adapter_dir = MODELS / ("viggle-qwen-turbo-v021" if is_v021 else "viggle-qwen-turbo")
    if is_v021:
        adapter_dir = Path(os.environ.get("LOCAL_VIGGLE_V021", str(adapter_dir)))
    require_resident_tree(adapter_dir)
    lora = V021_LORA if is_v021 else V01_LORA
    print(f"加载 Qwen-Image-2.1 BF16 与 Viggle {'v0.2.1 6步' if is_v021 else 'v0.1 4步'} LoRA 到 Metal…", flush=True)
    started = time.monotonic()
    pipe = QwenImage21Pipeline.from_pretrained(
        BASE, dtype=torch.bfloat16, local_files_only=True, use_safetensors=True
    )
    pipe.scheduler = FlowMatchEulerDiscreteScheduler.from_pretrained(
        adapter_dir, subfolder="scheduler", local_files_only=True
    )
    pipe.load_lora_weights(adapter_dir, weight_name=lora, adapter_name="viggle-turbo")
    width, height = int(job["width"]), int(job["height"])
    large_mode = job.get("large_mode", "balanced")
    if large_mode == "faster":
        # The shared UI value means Qwen acceleration for Qwen, but explicitly
        # means smaller VAE tiles for Viggle to cap peak memory on this backend.
        pipe.vae.enable_tiling(
            tile_sample_min_height=512,
            tile_sample_min_width=512,
            tile_sample_stride_height=384,
            tile_sample_stride_width=384,
        )
        print("Viggle低内存模式：启用512/384 VAE分块（可能增加解码耗时）", flush=True)
    elif width * height > 2_097_152:
        # Keep diffusion at the requested native size and tile only VAE I/O.
        pipe.vae.enable_tiling(
            tile_sample_min_height=1024,
            tile_sample_min_width=1024,
            tile_sample_stride_height=768,
            tile_sample_stride_width=768,
        )
        print("Viggle大图自动模式：VAE使用1024/768重叠分块", flush=True)
    pipe.to("mps")
    print(f"模型加载完成，用时 {time.monotonic() - started:.1f}s", flush=True)

    refs = job.get("referenceImages") or []
    images = [Image.open(name).convert("RGB") for name in refs]
    generator = torch.Generator(device="mps").manual_seed(int(job["seed"]))
    call = {
        "prompt": job["prompt"],
        "num_inference_steps": steps,
        "true_cfg_scale": 1.0,
        "generator": generator,
    }
    if is_v021:
        call["sigmas"] = V021_SIGMAS
    call["width"] = width
    call["height"] = height
    if images:
        # Explicit width/height retain native output size. Limit the separate
        # reference encoding budget: enlarging it with output size caused artifacts.
        call["image"] = images
        call["output_resolution"] = min(896, int(round(math.sqrt(width * height))))
        print(f"[viggle] REFERENCE_BUDGET {call['output_resolution']} 输出尺寸保持{width}×{height}", flush=True)

    print(f"generating image: 1/{steps}", flush=True)
    prior = time.monotonic()

    def on_step_end(_pipe, step, _timestep, callback_kwargs):
        nonlocal prior
        now = time.monotonic()
        print(f"{step + 1}/{steps} - {now - prior:.2f}s/it", flush=True)
        if step + 1 == steps:
            print("[viggle] VAE_DECODE", flush=True)
        prior = now
        return callback_kwargs

    result = pipe(**call, callback_on_step_end=on_step_end).images[0]
    result.save(output_path, format="PNG")
    print(f"Viggle output saved: {output_path}", flush=True)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: viggle_worker.py JOB_STATUS.json OUTPUT.png")
    main(sys.argv[1], sys.argv[2])
