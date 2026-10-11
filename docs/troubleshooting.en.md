# Troubleshooting

[English](troubleshooting.en.md) · [简体中文](troubleshooting.zh-CN.md) · [Docs](README.md) / [目录](README.zh-CN.md)

| Symptom | Check first |
| --- | --- |
| Page unavailable | Is the configured web service running, is port 1235 free, and is the address allowed? Inspect a sanitized local service log. |
| API returns 401 | Sign in; authentication is expected. Do not disable it as a fix. |
| Cannot create the first administrator | Open `/setup` on the serving Mac using `127.0.0.1`; remote setup is restricted. An existing account database must not be overwritten. |
| Model disabled or missing | Check the matching manifest, completed downloads, runtime paths and dependencies. Listing a model does not install it. |
| Chat fails or stalls | Verify LM Studio's local API on 1234 and the `qwen3.8-27b-local` alias; inspect active tasks before restarting. |
| Video is unavailable | Check the separate backend, port 8191, supported parameters and resource protection. Do not weaken guards. |
| Output is blurry or changed | Inspect native-size output, dimensions, prompts and enhancement settings. A larger exported image is not proof of recovered detail. |
| Language appears mixed | The first visit follows browser language; choose English or Chinese explicitly. Upstream errors and operating-system dialogs may retain their original language. |
| Share action is unavailable | Browser/device sharing varies. Use the offered download/copy fallback. Review this release's [user guide](usage.en.md). |

Before reporting: include the commit/version, model ID, Mac chip/memory, macOS, dimensions/steps, reproduction steps and sanitized error. Remove personal images, prompts, chats, credentials and private addresses. Do not run every test indiscriminately: some invoke real models, download files or require services.

Do not fix a missing pinned dependency by silently upgrading the whole environment. Do not kill user jobs or restore old runtime snapshots to make a check pass. A fresh-machine installation remains unverified until that machine's actual inference and outputs have been checked.
