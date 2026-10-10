# MacBook Pro Studio

**English** | [简体中文](README.zh-CN.md)

A local image, chat and experimental video studio for Apple Silicon Macs.

## Interface language

Choose **中文 / English** at the top of the image, chat, video or account page. The preference is stored in this browser and survives refreshes. Switching does not reload the page or rewrite prompts, chat messages or history titles. The first visit follows the browser language; switching still works for the current page if preference storage is unavailable.

## Interface previews

These previews use the released page styles. All prompts, task IDs, timestamps, illustrations and conversations are fictional demo content created for this README. They contain no real accounts, user images or chat records. The illustrations are programmatically drawn, not model benchmarks or quality claims.

### Image studio

Choose a model, enter a prompt and browse tasks and image results.

![Image studio with fictional tasks and programmatically drawn landscape illustrations](docs/images/image-studio-demo.en.png)

### Local chat

Chat in the same studio and select a response mode and length.

![Local chat with a fictional, manually written illustration-planning conversation](docs/images/chat-studio-demo.en.png)

## Set up a new Mac

1. Clone this repository.
2. Read the [deployment guide](README-FIRST.en.txt) ([中文](README-先读我.txt)).
3. Give the [installation prompt](INSTALL-PROMPT.en.txt) ([中文](INSTALL-PROMPT.txt)) to a coding assistant on the target Mac to install dependencies and download models appropriate for that hardware.

Pages: `/edit` for images, `/chat` for chat, `/video` for video. The default web port is `1235`.

This repository is a reviewed release and migration copy. It may lag behind local development or production. It excludes model weights, virtual environments, user tasks, chat records, reference images and account configuration. A complete installation on a fresh machine has not been validated. This is not a one-click application.

## Repository contents

- `src/`: frontend, backend, model manifests, installation and validation tools.
- `tests/`: tests; some require installed models or running services.
- `requirements/`: pinned dependencies.
- `vendor/`: native engine source, with upstream licenses retained.
- `patches/`: pinned versions and Apple adaptations.

Models and third-party source retain their upstream licenses. H3/ClipProj Apple support is experimental. A successful short sample does not establish support for every resolution or duration.

## Sign-in and accounts

On the Mac running the service, open `http://127.0.0.1:1235/setup` to create the first administrator, then sign in from other devices. Administrators can create, disable and delete accounts and reset passwords. See [account documentation](docs/accounts.en.md) ([中文](docs/accounts.md)). There is no default password. Account files stay in the runtime data directory and must not be uploaded. Tasks remain shared studio data.

## Viggle v0.3

Separate six-step and nine-step detail modes are available, with the previous default retained. See [installation and validation](docs/viggle-v03.en.md) ([中文](docs/viggle-v03.md)). Download model weights separately on the target Mac.
