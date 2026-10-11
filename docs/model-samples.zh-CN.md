# 真实模型样张

[English](model-samples.en.md) · [简体中文](model-samples.zh-CN.md)

以下为本地参考机器实际生成结果，不是界面模拟图。虚构成年人物参考图已获公开授权。页面使用缩小的JPEG预览，不代表原始像素文件。

![MYAI model samples](images/model-samples/overview.jpg)

**生成机器：** Apple M2 Max，12核CPU，96 GB统一内存，macOS 27.0.1。

耗时为单次任务开始至结束，包括任务内加载及后处理，不含排队与失败尝试。尺寸、步数及输入条件不同，不属于同条件性能对比。

![Input and result](images/model-samples/reference-comparison.jpg)

## viggle-qwen-image-2.1-4step

67.0 s · 512 × 768 · 4 steps · seed 42

输入：[Reference 1](images/model-samples/reference-2.jpg)

![viggle-qwen-image-2.1-4step](images/model-samples/viggle-qwen-image-2.1-4step.jpg)

### 提示词（实际原文）

```text
Create a neutral fashion catalog portrait of the same fictional adult woman in the reference image. She is standing upright, wearing an opaque green long-sleeved buttoned shirt and black trousers. Waist-up composition, simple beige room, warm natural window light, relaxed neutral expression. Preserve her face and long dark hair. Fully clothed, no lingerie, no text, no watermark.
```

### 负面提示词

未提供。

## qwen-image-2.1

1149.1 s · 512 × 768 · 20 steps · seed 42

输入：[Reference 1](images/model-samples/reference-1.jpg), [Reference 2](images/model-samples/reference-2.jpg)

![qwen-image-2.1](images/model-samples/qwen-image-2.1.jpg)

### 提示词（实际原文）

```text
使用图二的人物外观，参考图一的窗边构图和自然侧光，生成绿色长袖衬衫、黑色长裤的普通着装人像。保持自然比例与一致光照，背景简洁。不添加文字、水印或无关物体。
```

### 负面提示词

未提供。

## wai-illustrious-v17

78.2 s · 768 × 1024 · 20 steps · seed 42

输入：仅文字，无图像输入。

![wai-illustrious-v17](images/model-samples/wai-illustrious-v17.jpg)

### 提示词（实际原文）

```text
masterpiece, best quality, anime illustration, adult woman, green long-sleeved buttoned shirt, black trousers, standing by a window, waist-up, warm natural side lighting, beige room, detailed hair, fully clothed
```

### 负面提示词

low quality, blurry, bad anatomy, text, watermark, lingerie, nudity

## 结果解读与范围

Viggle展示着装与场景编辑，不保证身份像素级一致；Qwen融合两张参考，细节仍偏柔；WAI展示插画，不是照片重建。这三项通过本轮目视检查，不代表模型整体画质或所有能力。完整本地测试也包含效果有限和未通过样例，本页没有把它们当成成功结果。

发布样张不等于更新仓库运行代码或安装模型。参见[模型范围](models.zh-CN.md)。可读取的参数、尺寸与原始输出哈希见 [samples.json](images/model-samples/samples.json)。
