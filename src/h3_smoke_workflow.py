"""Write an API workflow for a tiny diagnostic H3 video, not quality validation."""
import json
from pathlib import Path

def node(kind, **inputs):
    return {"class_type": kind, "inputs": inputs}

workflow = {
    "1": node("UNETLoader", unet_name="minimax_h3_fl2va_pruned_bf16.safetensors", weight_dtype="default"),
    "2": node("ClipProjLoader", clip_name="qwen3vl_4b_bf16.safetensors", type="auto",
              projection="mmh3-4b-ClipProj-v3.1.safetensors", device="mps", mode="streaming"),
    "3": node("VAELoader", vae_name="minimax_h3_video_vae_fp16.safetensors"),
    "4": node("MiniMaxH3ImageToVideo", clip=["2", 0], vae=["3", 0],
              prompt="A red ball slowly rolls across a plain wooden table. Locked camera, soft daylight, no text.",
              width=256, height=256, length=22),
    "11": node("ClipProjFree", scope="all models", after=["4", 0]),
    "5": node("ConditioningZeroOut", conditioning=["11", 0]),
    "6": node("MiniMaxH3SigmaShift", model=["1", 0], shift_video=12.0, shift_audio=3.0),
    "7": node("KSampler", model=["6", 0], seed=42, steps=4, cfg=1.0,
              sampler_name="euler", scheduler="simple", positive=["11", 0], negative=["5", 0],
              latent_image=["4", 1], denoise=1.0),
    "8": node("VAEDecode", samples=["7", 0], vae=["3", 0]),
    "9": node("CreateVideo", images=["8", 0], fps=24.0),
    "10": node("SaveVideo", video=["9", 0], filename_prefix="h3-apple/smoke",
               **{"format": "mp4", "format.codec": "h264"}),
}
Path(__file__).with_name("h3_smoke_api.json").write_text(json.dumps(workflow, indent=2))
print("Prepared 256x256, 22-frame diagnostic; validate against live object_info before submission.")
