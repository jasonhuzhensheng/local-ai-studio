本地 AI 工作室：全新 Apple Silicon Mac 迁移代码包

这是当前生产 app/src、tests 的源码快照，附带模型下载清单、依赖锁、原生引擎当前源码和视频 Apple 适配补丁。
不含模型权重、虚拟环境、历史任务、参考图、聊天记录、账号配置和密钥。不是双击即用应用。

请将本目录整体交给新机器上的编程助手，发送 INSTALL-PROMPT.txt 全文。
源机：M2 Max / 96GB；目标机型号、内存和系统未知，必须先检查。低内存机器不能照搬视频参数。

目录：
 src/ 现用网页、后端、下载/验证工具、模型清单
 tests/ 生产测试（部分需已安装模型/服务；不可不加区分全跑）
 requirements/viggle-pinned.txt 图像环境固定版本
 src/h3_requirements.lock 视频独立环境固定版本
 vendor/ 当前原生引擎源码（未带编译产物）；保留各项目许可证
 patches/ 当前 ComfyUI、ClipProj commit 与已部署 Python 改动
 SHA256SUMS.txt 包内逐文件校验

模型入口：image_models.json（Qwen GGUF）、viggle_turbo_model.json / viggle_turbo_v021_model.json（底模/加速适配器）、wai_model.json、upscale_model.json、h3_apple_models.json（视频）。下载前核对每份清单及对应安装脚本。
文字模型：huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF，文件 Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf。文字模型完整固定revision/哈希未随本包提供，应先从可信仓库确定并记录，不声称与旧机器逐字节一致。

新机验收尚未执行；源码中仍可能有原机路径/模型别名/系统工具路径，必须按目标用户修正配置。历史补丁不要在 vendor 已改源码上重复应用。不能将下载成功当作推理或画质成功。
