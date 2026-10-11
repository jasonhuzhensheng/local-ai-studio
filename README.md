# MYAI — Local AI Studio

![MYAI](src/myai_logo.svg)

**English** · [简体中文](README.zh-CN.md) · [Documentation](docs/README.md) · [Other languages](docs/i18n/README.md)

Create images, edit reference photos and chat with local models from one browser workspace on an Apple Silicon Mac. Explore video generation through a separate experimental backend.

**Local inference · Image creation and editing · LM Studio chat · Private-device access**

MYAI is a source and migration package for people comfortable with local model setup. Model weights and Python environments are installed separately. A complete fresh-Mac installation has not yet been validated; this is not a one-click installer.

## What you can do

| Workspace | Use it for | Requirements and limits |
| --- | --- | --- |
| Images `/edit` | Text-to-image, reference-image editing, illustration and optional upscaling | Install the matching model and runtime; options depend on model readiness. |
| Chat `/chat` | Local conversations, response settings and background replies | LM Studio with the configured model alias and local API. |
| Video `/video` | Short experimental video generation | Separate H3/ComfyUI/ClipProj setup, supported settings and available memory. |
| Accounts `/account` | Sign-in, password changes and administrator controls | No default password. Signed-in users share studio tasks and media. |

A shared dark interface supports desktop and mobile layouts, keyboard navigation, a supported-model directory, and project/artwork sharing. Image share exports include a QR code and project link. See the [user guide](docs/usage.en.md) for the release's behavior.

## See the workspace

These interface illustrations use fictional tasks and manually prepared demo content. They are **not model benchmarks** and contain no real user records.

![Image workspace](docs/images/image-studio-demo.en.png)

![Local chat workspace](docs/images/chat-studio-demo.en.png)

## Start here

1. Read [Getting started](docs/getting-started.en.md) and check the hardware and installation scope.
2. Clone the repository:

   ```sh
   git clone https://github.com/jasonhuzhensheng/local-ai-studio.git
   cd local-ai-studio
   ```

3. Follow the [migration guide](README-FIRST.en.txt). The [installation prompt](INSTALL-PROMPT.en.txt) provides a structured checklist for a coding assistant on your target Mac.
4. Install one suitable model/runtime first, create the local administrator, then verify real output before adding more modules.

The reference machine is an **Apple M2 Max with 96 GB unified memory**. This is a reference configuration, not a minimum requirement or a promise that every workflow fits smaller machines. Review disk, memory and pinned dependencies before downloads.

## Documentation — English / 中文

| Topic | English | 简体中文 |
| --- | --- | --- |
| Documentation home | [Index](docs/README.md) | [目录](docs/README.zh-CN.md) |
| Installation and first run | [Getting started](docs/getting-started.en.md) | [安装与首次运行](docs/getting-started.zh-CN.md) |
| Everyday workflows and sharing | [User guide](docs/usage.en.md) | [使用指南](docs/usage.zh-CN.md) |
| Model families and boundaries | [Models](docs/models.en.md) | [模型说明](docs/models.zh-CN.md) |
| Sign-in and shared access | [Accounts](docs/accounts.en.md) | [账号](docs/accounts.md) |
| Viggle six/nine-step setup | [Viggle v0.3](docs/viggle-v03.en.md) | [Viggle v0.3](docs/viggle-v03.md) |
| Common issues | [Troubleshooting](docs/troubleshooting.en.md) | [故障排查](docs/troubleshooting.zh-CN.md) |

English is the default GitHub documentation entry; Simplified Chinese is maintained alongside it. The app retains its **33-language selector**, follows the browser language on first visit and remembers your selection. User prompts and chat content are not translated. Other-language manuals are machine translations and may lag behind the maintained English/Chinese editions.

## Privacy, status and licensing

- Inference uses locally configured engines. Model downloads, GitHub links, external sharing and optional private-network services require their own network connections; “local” does not mean every operation is offline.
- This is a **shared studio**, not an isolated multi-tenant service. Accounts do not create separate model queues or private media libraries. Use the [account guide](docs/accounts.en.md) before inviting others.
- Do not commit weights, environments, user prompts/images/chats, account databases, tokens or private machine configuration. This repository excludes them.
- The public release can lag behind a development machine. Local sample galleries, additional models and newer controls are not automatically included in this checkout. Read the [model scope](docs/models.en.md) rather than assuming parity.
- Models and vendored components retain their upstream licenses. A model being downloadable or listed here does not grant unrestricted commercial rights. Check the selected component's license before distributing it or its outputs.

## Repository map

`src/` contains the application and model manifests; `tests/` contains targeted checks; `requirements/` holds dependency pins; `vendor/` holds native source; `patches/` records experimental adaptations. [SHA256SUMS.txt](SHA256SUMS.txt) covers the release files.

When reporting a problem, include the model ID, Mac chip/memory, macOS version, dimensions/steps and a sanitized error. Remove private prompts, images, account data and local network details.
