# Viggle v0.3 installation and modes

**English** | [简体中文](viggle-v03.md)

Official source: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Pinned revision, sizes and hashes: `src/viggle_turbo_v03_model.json`. Installer: `src/install_viggle_turbo_v03.py`. Uses a separate `models/viggle-qwen-turbo-v03` directory while sharing the installed base model and existing Python environment. It does not upgrade dependencies or overwrite v0.1/v0.2.1.

The image-model menu offers:

- **Viggle v0.3 · 6 steps, cleaner images**: official six-node sigma schedule, CFG1.
- **Viggle v0.3 · 9 steps, enhanced detail**: seven Turbo steps, then disable the LoRA, switch the next cached KV pass to extraction and use the base model for the final two steps. LoRA and forward behavior are restored afterward. Merely setting a regular step count to nine is not equivalent.

v0.3 supports up to three references, no negative prompt and a 1024px square default when selected. The previous v0.2.1 default and iPhone dimensions remain; the original model still supports ten references. Native large sizes, VAE tiling and existing 8K post-processing remain selectable, but not every combination has been tested.

The LoRA is not fused into BF16 weights; strength is 1. Scheduler `shift_terminal` must be null. v0.3 can be less grainy but slightly softer; it is not guaranteed to outperform older versions in every case. Official nine-step timing ratios are not local benchmarks.

## Validation

`tests/viggle_model.mjs` uses isolated sparse model fixtures to verify step counts, reference limits, large-size routing and readiness markers. `tests/viggle_schedule.py` verifies disabling the LoRA after step seven, one KV re-extraction and restoration.

A six-step 512×512, seed-42 blue-cup sample completed in 52.98s including process/model loading. Dimensions and the actual image were checked. The first nine-step attempt stopped when a new text connection triggered resource protection; this was not an inference error.

The nine-step retry completed in 65.42s at 512×512, seed 42. It switched to the base model after step seven, completed nine steps and produced the correct dimensions. Visual inspection found no green/magenta noise. One sample per mode is not a stable performance benchmark. Multiple references, large images and 8K post-processing were not validated by those runs.
