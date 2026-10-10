[Español](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estos documentos son traducciones automáticas de textos de proyectos públicos y no todos han sido revisados por hablantes nativos. Consulte la fuente en inglés o chino para ver si hay ambigüedades técnicas. No se incluyen datos privados del usuario.

# MacBook Pro Studio

Un estudio local de imagen, chat y vídeo experimental para Mac Apple Silicon.

## Idioma de la interfaz

Utilice el menú de idiomas en la parte superior derecha para elegir entre los idiomas 33. El navegador recuerda su selección. Los paquetes de idiomas se sirven localmente; Cambiar de idioma no envía contenido a un servicio de traducción en línea. Las indicaciones del usuario, las conversaciones y el contenido guardado mantienen su idioma original.

## Vistas previas de la interfaz

Estas vistas previas utilizan los estilos de página publicados. Todas las indicaciones, ID de tareas, marcas de tiempo, ilustraciones y conversaciones son contenido de demostración ficticio creado para este README. No contienen cuentas reales, imágenes de usuarios ni registros de chat. Las ilustraciones se dibujan mediante programación, no son puntos de referencia de modelos ni afirmaciones de calidad.

### Estudio de imagen

Elija un modelo, ingrese un mensaje y explore tareas y resultados de imágenes.

![Estudio de imágenes con tareas ficticias e ilustraciones de paisajes dibujadas mediante programación](../../images/image-studio-demo.en.png)

### Chat local

Chatea en el mismo estudio y selecciona un modo y duración de respuesta.

![Chat local con una conversación ficticia y escrita manualmente sobre planificación de ilustraciones](../../images/chat-studio-demo.en.png)

## Configurar una nueva Mac

1. Clona este repositorio.
2. Lea la [guía de implementación](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Proporcione el [indicador de instalación](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) a un asistente de codificación en la Mac de destino para instalar las dependencias y descargar models apropiado para ese hardware.

Páginas: `/edit` para imágenes, `/chat` para chat, `/video` para video. El puerto web predeterminado es `1235`.

Este repositorio es una copia revisada de la versión y la migración. Puede estar a la zaga del desarrollo o la producción local. Excluye pesos de modelos, entornos virtuales, tareas de usuario, registros de chat, imágenes de referencia y configuración de cuenta. No se ha validado una instalación completa en una máquina nueva. Esta no es una aplicación de un solo clic.

## Contenidos del repositorio

- `src/`: frontend, backend, manifiestos de modelo, herramientas de instalación y validación.
- `tests/`: pruebas; algunos requieren models instalado o servicios en ejecución.
- `requirements/`: dependencias ancladas.
- `vendor/`: fuente del motor nativo, con licencias upstream retenidas.
- `patches/`: versiones fijadas y adaptaciones de Apple.

Los modelos y fuentes de terceros conservan sus licencias ascendentes. H3/ClipProj El soporte de Apple es experimental. Una muestra corta exitosa no establece soporte para cada resolución o duración.

## Iniciar sesión y cuentas

En la Mac que ejecuta el servicio, abra `http://127.0.0.1:1235/setup` para crear el primer administrador y luego inicie sesión desde otros dispositivos. Los administradores pueden crear, deshabilitar y eliminar cuentas y restablecer contraseñas. Consulte la [documentación de la cuenta](accounts.md) ([中文](../../accounts.md)). No existe una contraseña predeterminada. Los archivos de la cuenta permanecen en el directorio de datos runtime y no se deben cargar. Las tareas siguen siendo datos de estudio compartidos.

## Viggle v0.3

Están disponibles modos de detalle separados de seis y nueve pasos, manteniéndose el valor predeterminado anterior. Consulte [instalación y validación](viggle-v03.md) ([中文](../../viggle-v03.md)). Descargue los pesos de los modelos por separado en la Mac de destino.
