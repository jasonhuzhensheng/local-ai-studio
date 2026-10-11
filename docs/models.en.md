# Supported models and scope

[English](models.en.md) · [简体中文](models.zh-CN.md) · [Docs](README.md) / [目录](README.zh-CN.md)

The public image selector currently exposes the following families. A menu entry is not evidence that weights are installed, and readiness depends on the actual runtime.

| Model / component | Intended use | Notes |
| --- | --- | --- |
| Qwen-Image-2.1 | Text-to-image and reference-image editing | Check the configured weights and reference/size limits. |
| WAI-Illustrious SDXL v17 | Illustration text-to-image | Not a photo-identity preservation benchmark. |
| Viggle Turbo Qwen v0.1 | Four-step image workflow | Requires its adapter/base combination. |
| Viggle v0.2.1 preview | Six-step image workflow | Preview release; install and validate separately. |
| Viggle v0.3 | Six-step and nine-step image workflows | More steps do not guarantee better quality. |
| Real-ESRGAN x4plus | Optional upscaling component | Export size does not establish native detail or faithful restoration. |
| Qwen3.8 27B through LM Studio | Text conversation | Requires the documented model alias; weights are separate. |
| H3 FL2VA / Ref2VA | Experimental video | Separate backend, memory protection and supported parameter combinations. |

For pinned revisions, inspect the applicable JSON manifests under `src/`: `image_models.json`, `wai_model.json`, the `viggle_turbo*_model.json` files, `upscale_model.json` and `h3_apple_models.json`. See [Viggle installation](viggle-v03.en.md) and [the migration guide](../README-FIRST.en.txt).

## Release versus development

A developer machine may contain Iris, additional Turbo variants, BFS/outfit editing, contextual enhancement or newer model-sample dialogs. They are not promised by this public selector simply because they were tested locally. Verify a feature against the checkout and its installer before planning around it. This documentation update does not synchronize private runtime data or add those models.

## How to compare results

Record the full prompt/negative prompt, input images, seed, dimensions, steps, sampler, model revision, machine and elapsed-time boundaries. Compare the original with the actual output and inspect details at a consistent scale. For video, record frames, frame rate, duration, audio and reference count. Separate file-generation success from visual acceptance.

Do not compare timings across different resolutions, loading conditions or workflows as if they were a controlled benchmark. No general speed guarantee or full fresh-install validation is claimed here. Each model and upstream component has its own license.
