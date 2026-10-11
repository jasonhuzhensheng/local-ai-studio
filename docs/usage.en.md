# User guide

[English](usage.en.md) · [简体中文](usage.zh-CN.md) · [Docs](README.md) / [目录](README.zh-CN.md)

## Sign in and choose a workspace

Create the first administrator locally at `/setup`; sign in at `/login`. Open `/edit`, `/chat`, `/video` or `/account` as needed. Signed-in users share studio tasks and media; read [Accounts](accounts.en.md) before adding users.

Use the upper-right language selector. English and Chinese are maintained documentation defaults, while the app keeps its existing browser-based language choice and 33 options. Switching languages preserves your input. Use ⌘ K / Ctrl K to navigate workspaces.

## Images

Choose an installed, ready model. Enter a prompt; attach references only when the selected workflow supports them. Check dimensions, ratio, steps and seed before submitting. Start small for a new setup and inspect the result before increasing resolution. Keep experimental cache and enhancement settings explicit when comparing results.

⌘ Enter / Ctrl Enter submits supported forms through normal validation; disabled controls remain disabled. Let the queue complete and use the product's stop/delete controls rather than deleting runtime files manually.

## Chat and video

Start the LM Studio API and load the documented alias before chatting. Response settings affect the request, not whether the model is installed. Browser history and server-side tasks are different stores; do not assume account deletion removes shared tasks.

Video requires its independent backend. Choose only supported reference counts, frame counts and resolutions. A successful short clip does not establish long-video, high-resolution or audio support. Never bypass memory protection to force a job through.

## Share a project or artwork

The header's share action shares the public GitHub project. The artwork share action opens a preview: images/video frames can be exported as PNG with a project QR code/link, and share text can be copied. Native sharing depends on browser/device support; otherwise download and copy manually. A video-frame share card is not an export of the entire video.

Inspect the preview and the text before sending. Generated content is not automatically public. Local-only additions such as a redesigned promotional footer or an X-specific model-page button can arrive in a later code release; do not infer their presence from another machine's screenshots.

## Keep your work safe

Back up the runtime data you intend to retain separately from source updates. Never replace live data with an old task snapshot or publish an account database. Do not restart a service while work is active. See [Troubleshooting](troubleshooting.en.md) for common checks.
