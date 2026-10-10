[Español](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estos documentos son traducciones automáticas de textos de proyectos públicos y no todos han sido revisados por hablantes nativos. Consulte la fuente en inglés o chino para ver si hay ambigüedades técnicas. No se incluyen datos privados del usuario.

# Instalación y modos de Viggle v0.3

Fuente oficial: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Revisión fijada, tamaños y hashes: `src/viggle_turbo_v03_model.json`. Instalador: `src/install_viggle_turbo_v03.py`. Utiliza un directorio `models/viggle-qwen-turbo-v03` separado mientras comparte el modelo base instalado y el entorno Python existente. No actualiza las dependencias ni sobrescribe v0.1/v0.2.1..

El menú de modelo de imagen ofrece:

- **Viggle v0.3 · Pasos de 6, imágenes más limpias**: programa oficial de sigma de seis node, CFG1.
- **Viggle v0.3 · Pasos de 9, detalle mejorado**: siete pasos Turbo, luego deshabilite el LoRA, cambie el siguiente paso de KV almacenado en caché a extracción y use el modelo base para los dos últimos pasos. LoRA y el comportamiento de avance se restablecen posteriormente. Simplemente establecer un recuento de pasos normal en nueve no es equivalente.

v0.3 admite hasta tres referencias, ningún mensaje negativo y un cuadrado 1024px predeterminado cuando se selecciona. Las dimensiones predeterminadas y del iPhone anteriores v0.2.1 se mantienen; el modelo original todavía admite diez referencias. Los tamaños grandes nativos, el mosaico VAE y el posprocesamiento 8K existente siguen siendo seleccionables, pero no se han probado todas las combinaciones.

El LoRA no está fusionado con las pesas BF16; La fuerza es 1. El programador `shift_terminal` debe ser null. v0.3 puede ser menos granulado pero ligeramente más suave; No se garantiza que supere a las versiones anteriores en todos los casos. Los índices oficiales de sincronización de nueve pasos no son puntos de referencia locales.

## Validación

`tests/viggle_model.mjs` utiliza accesorios de modelos dispersos aislados para verificar recuentos de pasos, límites de referencia, enrutamiento de gran tamaño y marcadores de preparación. `tests/viggle_schedule.py` verifica la desactivación del LoRA después del paso siete, una reextracción y restauración de KV.

Una muestra de copa azul 512×512, semilla-42 de seis pasos completada en 52.98, incluida la carga de process/model. Se comprobaron las dimensiones y la imagen real. El primer intento de nueve pasos se detuvo cuando una nueva conexión de texto activó la protección de recursos; Esto no fue un error de inferencia.

El reintento de nueve pasos se completó en 65.42 en 512×512, semilla 42. Cambió al modelo base después del paso siete, completó nueve pasos y produjo las dimensiones correctas. La inspección visual no encontró ruido green/magenta. Una muestra por modo no es un punto de referencia de rendimiento estable. Esas ejecuciones no validaron las referencias múltiples, las imágenes grandes y el posprocesamiento de 8K.
