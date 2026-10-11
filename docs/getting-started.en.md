# Installation and first run

[English](getting-started.en.md) · [简体中文](getting-started.zh-CN.md) · [Docs](README.md) / [目录](README.zh-CN.md)

## Before downloading

Use an Apple Silicon Mac and review its memory, free disk and macOS version. The reference setup uses M2 Max / 96 GB; no universal minimum has been validated. Windows, Linux and Intel Macs require separate adaptation and are not claimed as ready-to-run targets.

You need Git, Node.js, Python 3.11, native build tools and CMake; install LM Studio for chat. The source setup used Node 25. Consult pinned dependencies and runtime scripts before choosing versions. There is no root-level `npm install` or single project build that installs every model.

## Deployment sequence

1. Read [the migration package guide](../README-FIRST.en.txt) and [the installation checklist](../INSTALL-PROMPT.en.txt).
2. Keep source, mutable data and weights separate:

   ```text
   ~/Library/Application Support/LocalImageStudio/
     app/       source checkout
     runtime/   environments, engines, accounts and tasks
     models/    model weights
   ```

   The documented deployment uses `app/.local -> ../runtime` and `runtime/image-models -> ../models`. Review actual paths and environment overrides; do not copy another machine's private configuration.
3. Install dependencies per module. `requirements/viggle-pinned.txt` covers its image environment; `src/h3_requirements.lock` is for video only. Download the chosen weights using their manifests, verify available hashes and record missing metadata rather than inventing it.
4. Build the native engine only when your selected model requires it. Follow the installation checklist; vendored source already contains recorded changes, so do not apply historical patches twice.
5. After runtimes and paths are ready, run `node src/image_gallery.mjs` from the deployed `app/` directory. Keep port `1235` free. This command starts the web service; it does not install dependencies or models. Review binding and host rules before granting network access.
6. On that Mac, open `http://127.0.0.1:1235/setup`, create the first administrator, then sign in. Business APIs returning `401` before sign-in is expected.
7. Generate one small, non-sensitive sample with one ready model; inspect the actual output. Add chat/video only after their independent checks pass.

## Service boundaries

| Service | Default port | Purpose |
| --- | ---: | --- |
| MYAI | 1235 | Browser workspace and authenticated APIs |
| LM Studio | 1234 | Local text model API |
| Video backend | 8191 | Experimental video runtime |

Load the configured text model with alias `qwen3.8-27b-local`. The migration guide identifies the source model and notes missing pinned hash metadata. Do not substitute a different model silently.

`src/start_local_services.mjs` is a recovery helper for an already configured machine: this release can start Tailscale, LM Studio and load a text model. It is not a clean-install command or a read-only health check. Configure login startup only after manual operation works; a LaunchAgent does not run before user login.

## Verify before calling the installation complete

Use relevant isolated tests first. For example, from the repository root:

```sh
node tests/image_dimensions.mjs
node tests/start_local_services.mjs
python3 tests/viggle_schedule.py
```

These do not prove real model quality. Record one real image, complete chat response and playable short video only for modules actually installed. Include dimensions, steps, duration, elapsed time and hardware. Preserve queue and memory protections. Back up replaced source files and wait for tasks to finish before restarting.
