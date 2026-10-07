# Prompt: Documentación de código Node.js

## Contexto

Analiza el proyecto indicado y documenta sus archivos `.js`, `.mjs` y `.cjs` (y `.ts` si el proyecto Node usa TypeScript sin NestJS) sin modificar la lógica, el comportamiento ni la arquitectura existente.

La documentación debe ayudar a comprender el ciclo de vida de la aplicación, los flujos de solicitud y respuesta, el acceso a datos y servicios externos, y las decisiones no evidentes del código.

## Objetivo

Recorrer los archivos `.js`, `.mjs` y `.cjs` (y `.ts` si el proyecto Node usa TypeScript sin NestJS) del proyecto y agregar o completar documentación clara, técnica y consistente en español.

No se debe refactorizar, corregir ni rediseñar el código. La única finalidad es documentarlo.

## Reglas generales

1. No modificar la lógica de negocio ni el comportamiento existente.
2. No cambiar nombres, firmas, tipos, imports ni estructura del código. No reformatear, reordenar ni reindentar código existente.
3. No agregar dependencias, configuración ni herramientas (linters, formateadores, generadores de documentación).
4. No convertir entre paradigmas o estilos: clases y funciones, callbacks y promesas, código síncrono y asíncrono.
5. Conservar la documentación existente si es correcta. Si contradice el código, corregirla y reportarlo en la entrega.
6. Escribir los comentarios en español. Mantener sin traducir los identificadores, nombres de API y términos técnicos tal como aparecen en el código.
7. Mantener el estilo de documentación usado en el proyecto. Si el proyecto no define uno, usar JSDoc (TSDoc en archivos `.ts`).
8. Explicar el propósito y las decisiones importantes, no describir cada línea.
9. No documentar como hecho una funcionalidad que todavía no existe, que está comentada o que no se usa.
10. No inventar reglas, flujos, estados, motivos ni efectos secundarios. Si algo no se puede determinar con certeza a partir del código, las pruebas o la documentación del proyecto, no lo supongas: omítelo y regístralo en "Puntos que requieren confirmación".
11. No afirmar que el código cumple un estándar, patrón o principio (por ejemplo "aplica Clean Architecture" o "es seguro frente a inyección SQL") salvo que el propio proyecto lo declare. Describir el comportamiento observable.
12. No copiar a la documentación secretos, credenciales, tokens, claves, hosts o IPs internos ni datos personales que aparezcan en el código. Si encuentras alguno, no reproduzcas su valor y repórtalo en la entrega.
13. Conservar intactas las directivas para herramientas (por ejemplo `eslint-disable`, `@ts-ignore`, `noqa`, `type: ignore`, `phpcs:ignore`, `@phpstan-ignore`, `istanbul ignore`, `pragma`) y los TODO/FIXME existentes. No son documentación.
14. No agregar comentarios redundantes que repitan literalmente el nombre del elemento.
15. No modificar archivos fuera del alcance indicado salvo que se solicite expresamente.

## Alcance de archivos

Incluir: `.js`, `.mjs` y `.cjs` (y `.ts` si el proyecto Node usa TypeScript sin NestJS).

Excluir por defecto:

- `node_modules/`, `dist/`, `build/` y `coverage/`;
- archivos de declaración (`*.d.ts`);
- migraciones y semillas generadas automáticamente;
- archivos generados automáticamente (con encabezados como "auto-generated" o "DO NOT EDIT");
- archivos de prueba: usarlos como fuente de contexto sobre el comportamiento esperado, pero no documentarlos salvo que se pida;
- archivos de otros lenguajes o formatos.

## Formato de documentación

Usar JSDoc (`/** */`). En archivos `.js`, `.mjs` y `.cjs` no hay tipos declarados: incluir los tipos en `@param {tipo} nombre - descripción`, `@returns {tipo}` y `@throws` cuando no sean evidentes. En archivos `.ts` usar TSDoc sin repetir los tipos ya declarados.

## Punto de entrada y ciclo de vida

- Qué hace el arranque: configuración que carga, conexiones que abre, puerto o transporte en el que escucha.
- Manejo de señales y eventos del proceso (`SIGTERM`, `SIGINT`, `uncaughtException`, `unhandledRejection`): qué hace el código al recibirlos y si hay cierre ordenado.
- Orden de inicialización cuando importa (por ejemplo, que la base de datos esté disponible antes de aceptar solicitudes).

## Configuración y entorno

- Qué variables de `process.env` lee, para qué se usan y cuáles son obligatorias. Nunca escribir sus valores reales.
- Valores por defecto y validaciones de configuración existentes.
- Diferencias de comportamiento entre entornos (`NODE_ENV`) cuando el código las implemente.

## Rutas, controladores y middlewares

Si el proyecto usa Express, Fastify, Koa u otro servidor HTTP, documentar:

- método y ruta de cada endpoint y su propósito;
- qué lee de `params`, `query`, `body` y encabezados, y qué valida;
- qué responde: códigos de estado, forma de la respuesta y casos de error;
- el orden de los middlewares cuando importa y por qué;
- cómo llegan los errores al manejador centralizado.

En Express, un middleware de errores se reconoce por sus cuatro parámetros `(err, req, res, next)`: documentarlo como tal y no alterar su firma.

Ejemplo:

```js
/**
 * Crea un pedido a partir del carrito del usuario autenticado.
 *
 * Responde 201 con el pedido creado, 400 si el cuerpo no supera la validación
 * y 409 si algún producto ya no tiene existencias.
 *
 * @param {import('express').Request} req - Requiere `req.user`, asignado por el middleware de autenticación.
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next - Recibe los errores no controlados.
 */
async function crearPedido(req, res, next) {
  // ...
}
```

## Servicios y acceso a datos

- Qué operación de negocio realiza cada servicio y qué recibe y devuelve.
- Qué consulta o modifica en la base de datos (tablas, colecciones, índices relevantes) y si usa consultas parametrizadas, un ORM o un query builder.
- Dónde empieza y termina una transacción y qué se revierte si falla.
- Uso de pools de conexiones: cuándo se obtienen y se liberan.

## Entrada y salida

- Archivos (`fs`), flujos (`stream`), buffers, procesos hijos (`child_process`) y solicitudes de red: qué leen o escriben, en qué formato y codificación.
- Cierre de recursos: cuándo se liberan y qué ocurre si la operación falla a mitad de camino.
- Contrapresión (backpressure) en flujos cuando el código la maneja de forma explícita.

## Asincronía y eventos

- Qué valor resuelve cada promesa y cuándo se rechaza.
- Eventos de `EventEmitter`: qué emite el código, con qué argumentos y quién los escucha.
- Colas, temporizadores, trabajadores (`worker_threads`) y tareas programadas: frecuencia, concurrencia y qué ocurre si la ejecución anterior no terminó.
- Reintentos, tiempos límite y cancelación, solo si el código los implementa.

## Scripts y herramientas de línea de comandos

- Argumentos y opciones que acepta, con su formato y valores por defecto.
- Códigos de salida y efectos sobre archivos, datos o servicios.
- Si es seguro ejecutarlo más de una vez, solo cuando el código lo garantice.

## Seguridad visible en el código

Describir, sin evaluar, los mecanismos que existan: autenticación (JWT, sesiones, API keys), autorización por rol, sanitización de entradas, limitación de tasa (`rate limiting`), CORS y manejo de cookies. Indicar dónde se aplican.

## Riesgos específicos de Node.js

- No cambiar el sistema de módulos (CommonJS o ESM) ni agregar `"use strict"`.
- Conservar la línea `#!/usr/bin/env node` en la primera posición de los scripts ejecutables.
- No agregar `// @ts-check`: activa la verificación de tipos y cambia el resultado de las herramientas del proyecto.
- No copiar a la documentación valores de `.env`, cadenas de conexión ni claves, aunque estén escritos en el código.
- Conservar `//# sourceMappingURL=...` y comentarios `/*! ... */`.

## Aspectos transversales

Cuando el código los implemente, documentar los siguientes aspectos. Describir lo que el código hace, sin evaluarlo y sin agregar lo que no hace. No es una lista para completar: solo se documenta lo que existe.

- **Entradas y validaciones:** qué se valida, con qué formato, rango o unidad, y qué ocurre cuando la validación falla.
- **Salidas:** qué se devuelve o emite, incluidos los casos vacíos, nulos o de error.
- **Acceso:** autenticación, roles o permisos que se exigen antes de ejecutar.
- **Efectos secundarios:** escrituras en base de datos, archivos, red, caché, sesión, estado compartido o eventos emitidos.
- **Transacciones y consistencia:** dónde empieza y termina una transacción y qué se revierte si falla.
- **Idempotencia y concurrencia:** si repetir la operación es seguro y qué mecanismo lo garantiza (bloqueo, clave única, versión), solo si existe.
- **Errores y recuperación:** qué errores se lanzan, se capturan o se propagan; reintentos, tiempos límite y valores de respaldo.
- **Observabilidad:** registros, métricas, identificadores de correlación o auditoría que el código genera.
- **Configuración:** variables de entorno o ajustes que lee y qué cambian (nunca valores reales).

## Comentarios inline

- Usar comentarios inline solo cuando expliquen el motivo de una decisión.
- Preferir un comentario por bloque lógico.
- No comentar sintaxis evidente ni describir literalmente un `if`, un bucle, una asignación o un `return`.
- Indicar unidades, formatos o restricciones cuando no sean evidentes.
- No dejar comentarios sobre el propio proceso de documentación (por ejemplo "documentado por IA") ni código comentado.

## Proceso

1. Identificar los archivos del alcance y ordenarlos de lo básico a lo general: utilidades y tipos, luego lógica y servicios, al final los puntos de entrada. Así el contexto ya está documentado cuando se llega a las piezas que dependen de él.
2. Leer el contexto antes de documentar: el archivo completo, dónde se usa, sus pruebas y la documentación del proyecto (README, `docs/`).
3. Detectar el estilo de documentación existente y adoptarlo. Comprobar si el proyecto consume los comentarios como parte de su funcionamiento o de su documentación generada (ver "Riesgos específicos"); en ese caso, redactarlos pensando en ese lector y reportarlo.
4. Revisar el punto de entrada, rutas y middlewares, acceso a datos, entrada y salida, y configuración.
5. Conservar la documentación correcta y agregar únicamente la que falta.
6. En proyectos grandes, trabajar por lotes pequeños (una carpeta o módulo a la vez) y verificar entre lotes.
7. Verificar que no haya cambios funcionales revisando el diff (`git diff`): toda línea agregada debe ser un comentario o una línea en blanco que lo acompañe, y toda línea eliminada debe ser un comentario anterior que se reemplazó o corrigió. Cualquier otra diferencia es un error y debe revertirse.
8. Ejecutar las verificaciones disponibles del proyecto sin modificar su configuración: `node --check <archivo>` en cada archivo `.js`, `.mjs` o `.cjs` modificado, `npx tsc --noEmit` si el proyecto usa TypeScript, y los scripts de `package.json` (`lint`, `test`) si existen. No ejecutar comandos que modifiquen datos, bases de datos o servicios externos.
9. Releer los comentarios: deben ser claros, breves, coherentes con el código y sin información inventada.

## Formato de entrega

Por cada archivo modificado, informar:

1. Ruta del archivo.
2. Resumen de una línea sobre lo documentado.
3. Rutas, funciones o módulos documentados.
4. Confirmación de que no se modificó la lógica.
5. Resultado de las verificaciones ejecutadas.

Al final del informe, agregar:

- **Puntos que requieren confirmación:** lo que no se pudo determinar con certeza y se omitió.
- **Hallazgos:** documentación existente corregida por contradecir el código, código sin uso y posibles secretos expuestos (sin reproducir su valor).
- **Sin cambios:** archivos que no requerían documentación, con una nota breve.

Si una verificación no se pudo ejecutar, indicar cuál y por qué.
