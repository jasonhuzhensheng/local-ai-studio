Local AI Studio: migration source package for a fresh Apple Silicon Mac
Documentation: docs/README.md | Chinese: docs/README.zh-CN.md
Language: English | 中文: README-先读我.txt

This reviewed release includes frontend/backend source, tests, model download manifests, pinned dependencies, native engine source and experimental Apple video patches. It may lag behind local development or production.
It excludes weights, virtual environments, previous tasks, reference images, chat records, account configuration and secrets. It is not a one-click app.

Give this entire folder to a coding assistant on the target Mac, together with INSTALL-PROMPT.en.txt.
The original validation machine was an M2 Max with 96GB memory. Check the target model, memory and OS first. Do not reuse video settings blindly on lower-memory Macs.

Contents:
 src/                          Frontend, backend, download/validation tools, model manifests
 tests/                        Tests; some require installed models/services. Do not run all indiscriminately
 requirements/viggle-pinned.txt Pinned image environment
 src/h3_requirements.lock      Separate pinned video environment
 vendor/                       Native source without compiled binaries; retain upstream licenses
 patches/                      ComfyUI/ClipProj commits and deployed Python changes
 SHA256SUMS.txt                Per-file checksums

Model entry points: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json and h3_apple_models.json (video), under src/. Check each manifest and its installer before downloading.
Text model: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, file Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. This package does not include a complete pinned revision/hash for that model. Obtain and record trusted upstream metadata first; do not claim byte-for-byte equivalence to the original machine.

A fresh-machine installation has not been validated. Review original-machine paths, model aliases and system tool paths for the target user. Do not reapply historical patches to already-modified vendor source. A successful download is not evidence of successful inference or acceptable quality.

The upper-right language menu offers 33 languages on image, chat, video and account pages. Language documentation: docs/i18n/README.md. The browser remembers the selection. User prompts and conversation content are not translated.
