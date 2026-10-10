[Español](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estos documentos son traducciones automáticas de textos de proyectos públicos y no todos han sido revisados por hablantes nativos. Consulte la fuente en inglés o chino para ver si hay ambigüedades técnicas. No se incluyen datos privados del usuario.

# Cuentas de sitios web

## Uso

En la Mac que ejecuta el servicio, abra `http://127.0.0.1:1235/setup` para crear el primer administrador. Los nombres de usuario contienen letras, dígitos, guiones bajos o guiones 3–32 y están normalizados a minúsculas. Las contraseñas contienen caracteres 12–128. No hay credenciales predeterminadas. Los dispositivos remotos no pueden reclamar la cuenta de administrador inicial.

Después de la configuración, los dispositivos no autenticados ven la página de inicio de sesión. Abra **Cuenta/Cerrar sesión** (`/account`) para cambiar su contraseña o cerrar sesión. Los administradores pueden crear users/administrators, restablecer contraseñas, cuentas disable/enable, cambiar roles y eliminar cuentas. La eliminación y los cambios de permisos requieren confirmación. El servidor evita eliminar, deshabilitar o degradar al último administrador habilitado. Eliminar una cuenta no elimina las tareas compartidas.

Utilice el menú de idiomas en la parte superior derecha para elegir entre los idiomas 33. El navegador recuerda su selección. Los paquetes de idiomas se sirven localmente; Cambiar de idioma no envía contenido a un servicio de traducción en línea. Las indicaciones del usuario, las conversaciones y el contenido guardado mantienen su idioma original.

Este es un estudio compartido. Los usuarios que han iniciado sesión comparten el acceso a imágenes, vídeos y tareas de chat del lado del servidor. El historial de chat del navegador permanece en localStorage. No hay aislamiento multiinquilino, almacenamiento de tareas por usuario ni facturación. Se mantiene la restricción de video local existente.

## Almacenamiento y protección

- `src/studio_auth.mjs` se ejecuta antes de las rutas comerciales, incluidas las API y los archivos image/reference/video. Las páginas no autenticadas se redireccionan con 303; Las API y los medios devuelven 401. Los activos de la cuenta, los activos del idioma y el estado setup/sign-in no secreto son públicos.
- Archivo de cuenta: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, predeterminado `app/.local/auth/users.json`; la implementación dedicada utiliza `runtime/auth/users.json`. Modo de directorio: 0700; Modo de archivo: 0600. Las contraseñas utilizan scrypt N32768/r8/p1, sales aleatorias y comparación de hash de tiempo constante. Las escrituras son atómicas y los cambios de cuenta se serializan. Una base de datos existente corrupta impide el inicio en lugar de reabrir el registro.
- Las sesiones utilizan bytes aleatorios 32; el servidor almacena sólo el resumen. Las cookies son HttpOnly, SameSite=Strict, válidas para horas 12. Para reiniciar es necesario iniciar sesión nuevamente. Los cambios, restablecimientos, deshabilitaciones y eliminaciones de Password/role revocan las sesiones afectadas. Cerrar sesión no elimina ni vuelve a ejecutar tareas ya iniciadas.
- Las escrituras requieren Origin y JSON del mismo origen. X-Forwarded-For no es de confianza. Cada IP de origen recibe como máximo intentos de 15 sign-in/setup/self-password-change por minuto de 15. Límites: derivaciones de contraseñas simultáneas de 4 y cuentas de 100. Al reiniciar se borran los límites de intentos.
- La implementación existente utiliza HTTP sobre Tailscale privado. Tailscale cifra el transporte de dispositivo a dispositivo; El HTTP LAN ordinario en sí no lo hace. Este paquete no configura el acceso público ni TLS. Las cookies Secure se configuran solo para solicitudes TLS nativas. No lo exponga directamente a través de HTTP público.
- Nunca cargar la base de datos de autenticación, sesiones o contraseñas. Inicialice nuevas cuentas al migrar. Los permisos de archivos stdio MCP, LM Studio local y OS están fuera de la autenticación del sitio web.

## Validación

Ejecute `node tests/studio_auth.mjs` con su base de datos de cuenta temporal y sin models real. Cubre el bloqueo de API/media no autenticado, restricciones de origen de configuración inicial, roles, modos de contraseña hashing/file, protección del último administrador, revocación de sesión, persistencia, rechazo de archivos corruptos y límites de velocidad.

Las pruebas local_chat, chat_background, image_studio y video_web inician sesión con administradores de pruebas aislados; no existe ninguna omisión de autenticación de producción. Las contraseñas reales las ingresa el usuario y no deben guardarse en pruebas o documentación.
