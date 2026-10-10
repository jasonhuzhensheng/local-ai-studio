# Viggle v0.3 安装与模式

[English](viggle-v03.en.md) | **简体中文**

官方来源：https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo
固定revision和权重大小/哈希见src/viggle_turbo_v03_model.json；安装脚本src/install_viggle_turbo_v03.py。独立models/viggle-qwen-turbo-v03目录，共用已安装底模、原Python环境，未升级依赖，不覆盖v0.1/v0.2.1。

网页模型菜单增加两项：
- Viggle v0.3 · 6步干净画面：官方6节点sigma，CFG1。
- Viggle v0.3 · 9步细节增强：前7步Turbo，随后停用LoRA，下一次cached KV改为extract，底模完成最后2步。调用结束恢复LoRA和forward；不能仅把普通步数改为9。

新版本最多3张参考图，无反向提示词，默认选新版时1024方图。保留现有默认v0.2.1及iPhone尺寸，原版10参考图行为不变。新版仍可选原生大尺寸、VAE分块与既有8K后处理；这些不是本轮全部实测的组合。

LoRA不融合到BF16权重，强度1；scheduler shift_terminal必须null。v0.3更少颗粒但略柔，不承诺全面超过旧版。官方9步耗时比6步高，不把官方倍数当本机实测。

验证：tests/viggle_model.mjs（隔离稀疏模型夹具）验证6/9步/参考数量/大尺寸路由和就绪标记；tests/viggle_schedule.py验证第7步后停LoRA、KV仅重提取一次和恢复。真实样图结果将在完成后补充。

实际验收：6步512×512/seed42蓝杯生成52.98秒（含进程与模型加载），PNG尺寸及实际画面通过。第一次9步验收因新的文字连接被保护器终止，非推理错误；等待空闲重试，尚未完成时不得宣称通过。

九步重试验收通过：512×512/seed42蓝杯65.42秒（含加载），实际完成第7步后底模切换和9步采样，PNG尺寸正确，已查看蓝杯画面无绿/洋红噪声。两模式各一次，不构成稳定性能基准；多参考、大图及8K后处理本轮未实际出图验证。
