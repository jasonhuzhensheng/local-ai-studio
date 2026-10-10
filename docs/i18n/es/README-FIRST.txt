Español | ../README.md
Estos documentos son traducciones automáticas de textos de proyectos públicos y no todos han sido revisados por hablantes nativos. Consulte la fuente en inglés o chino para ver si hay ambigüedades técnicas. No se incluyen datos privados del usuario.

Local AI Studio: paquete fuente de migración para una nueva Mac Apple Silicon

Esta versión revisada incluye fuente frontend/backend, pruebas, manifiestos de descarga de modelos, dependencias fijadas, fuente de motor nativa y parches de video experimentales de Apple. Puede estar a la zaga del desarrollo o la producción local.
Excluye pesas, entornos virtuales, tareas previas, imágenes de referencia, registros de chat, configuración de cuenta y secretos. No es un app de un solo clic.

Entregue esta carpeta completa a un asistente de codificación en la Mac de destino, junto con INSTALL-PROMPT.en.txt.
La máquina de validación original era una M2 Max con memoria 96GB. Primero verifique el modelo de destino, la memoria y el sistema operativo. No reutilice la configuración de video a ciegas en Mac con poca memoria.

Contenido:
 src/ Frontend, backend, herramientas download/validation, manifiestos de modelo
 Pruebas tests/; algunos requieren models/services. instalado. No ejecutar todos indiscriminadamente
 requirements/viggle-pinned.txt Entorno de imagen fijada
 src/h3_requirements.lock Entorno de vídeo anclado separado
 vendor/ Fuente nativa sin binarios compilados; conservar las licencias upstream
 patches/ ComfyUI/ClipProj confirma e implementa cambios de Python
 SHA256SUMS.txt Sumas de comprobación por archivo

Puntos de entrada del modelo: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json y h3_apple_models.json (video), en src/. Verifique cada manifiesto y su instalador antes de descargar.
Modelo de texto: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, archivo Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Este paquete no incluye un revision/hash con clavijas completo para ese modelo. Obtenga y registre primero metadatos ascendentes confiables; no pretenda equivalencia byte por byte con la máquina original.

No se ha validado una instalación de máquina nueva. Revise las rutas de la máquina original, los alias de modelos y las rutas de herramientas del sistema para el usuario de destino. No vuelva a aplicar parches históricos a fuentes de proveedores ya modificadas. Una descarga exitosa no es evidencia de una inferencia exitosa o de una calidad aceptable.

Utilice el menú de idiomas en la parte superior derecha para elegir entre los idiomas 33. El navegador recuerda su selección. Los paquetes de idiomas se sirven localmente; Cambiar de idioma no envía contenido a un servicio de traducción en línea. Las indicaciones del usuario, las conversaciones y el contenido guardado mantienen su idioma original.
