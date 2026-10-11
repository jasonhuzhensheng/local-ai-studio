# 安装与首次运行

[English](getting-started.en.md) · [简体中文](getting-started.zh-CN.md) · [Docs](README.md) / [目录](README.zh-CN.md)

## 下载前确认

使用 Apple Silicon Mac，先核对内存、可用磁盘与 macOS 版本。参考环境是 M2 Max / 96 GB，尚未验证通用最低配置。Windows、Linux 和 Intel Mac 需要单独适配，不宣称开箱即用。

需要 Git、Node.js、Python 3.11、原生构建工具和 CMake；文字对话另需 LM Studio。源环境使用 Node 25，选择版本前请核对依赖锁与运行脚本。根目录没有能安装全部模型的 `npm install` 或统一构建命令。

## 部署顺序

1. 阅读[迁移部署说明](../README-先读我.txt)和[安装检查清单](../INSTALL-PROMPT.txt)。
2. 分开保存源码、运行数据与权重：

   ```text
   ~/Library/Application Support/LocalImageStudio/
     app/       源码
     runtime/   环境、引擎、账号和任务
     models/    模型权重
   ```

   文档中的部署使用 `app/.local -> ../runtime` 和 `runtime/image-models -> ../models`。核对实际路径与环境变量，不复制其他机器的私有配置。
3. 按模块安装依赖。`requirements/viggle-pinned.txt` 属于对应图像环境，`src/h3_requirements.lock` 仅用于视频。按模型清单下载，核对已有哈希；缺失的元数据应记录待补，不可编造。
4. 所选模型需要原生引擎时再构建。遵循安装清单；vendor 已含记录中的修改，不要重复应用历史补丁。
5. 环境和路径准备好后，在部署的 `app/` 目录运行 `node src/image_gallery.mjs`，保持 `1235` 端口空闲。此命令启动网页，不安装模型或依赖。开放访问前先核对监听与 Host 规则。
6. 在这台 Mac 打开 `http://127.0.0.1:1235/setup` 创建首个管理员，再登录。未登录业务接口返回 `401` 属于正常行为。
7. 用一个已就绪模型生成小尺寸、非敏感样张，实际查看结果；文字和视频分别验证后再启用。

## 服务边界

| 服务 | 默认端口 | 用途 |
| --- | ---: | --- |
| MYAI | 1235 | 浏览器界面与受鉴权接口 |
| LM Studio | 1234 | 本地文字模型 API |
| 视频后端 | 8191 | 实验视频运行环境 |

文字模型需按配置以 `qwen3.8-27b-local` 别名加载。迁移说明列明源模型及未固定的哈希信息，不要静默替换其他模型。

`src/start_local_services.mjs` 是已配置机器的恢复工具：本发布版可能启动 Tailscale、LM Studio 并加载文字模型。它不是全新安装命令，也不是只读检查。手动运行正常后再配置登录启动；LaunchAgent 不等于用户登录前启动。

## 安装验收

先运行与所装模块相符的隔离测试，例如在仓库根目录：

```sh
node tests/image_dimensions.mjs
node tests/start_local_services.mjs
python3 tests/viggle_schedule.py
```

这些测试不能证明真实模型画质。仅对实际安装模块记录真实图片、完整文字回答、可播放短视频，附尺寸、步数、时长、耗时和硬件。保留队列与内存保护；替换源码前备份，重启前等待任务完成。
