# Prompt: Documentación de código React (TSX/JSX)

## Contexto

Analiza el proyecto indicado y documenta sus archivos `.tsx` y `.jsx` sin modificar la lógica, el comportamiento ni la arquitectura existente.

La documentación debe ayudar a comprender la responsabilidad de cada componente, sus propiedades, el flujo de datos y las decisiones no evidentes del código.

## Objetivo

Recorrer los archivos `.tsx` y `.jsx` del proyecto y agregar o completar documentación clara, técnica y consistente en español.

No se debe refactorizar, corregir ni rediseñar el código. La única finalidad es documentarlo.

## Reglas generales

1. No modificar la lógica de negocio ni el comportamiento existente.
2. No cambiar nombres, firmas, tipos, imports ni estructura del código. No reformatear, reordenar ni reindentar código existente.
3. No agregar dependencias, configuración ni herramientas (linters, formateadores, generadores de documentación).
4. No convertir entre paradigmas o estilos: clases y funciones, callbacks y promesas, código síncrono y asíncrono.
5. Conservar la documentación existente si es correcta. Si contradice el código, corregirla y reportarlo en la entrega.
6. Escribir los comentarios en español. Mantener sin traducir los identificadores, nombres de API y términos técnicos tal como aparecen en el código.
7. Mantener el estilo de documentación usado en el proyecto. Si el proyecto no define uno, usar TSDoc en `.tsx` y JSDoc en `.jsx`.
8. Explicar el propósito y las decisiones importantes, no describir cada línea.
9. No documentar como hecho una funcionalidad que todavía no existe, que está comentada o que no se usa.
10. No inventar reglas, flujos, estados, motivos ni efectos secundarios. Si algo no se puede determinar con certeza a partir del código, las pruebas o la documentación del proyecto, no lo supongas: omítelo y regístralo en "Puntos que requieren confirmación".
11. No afirmar que el código cumple un estándar, patrón o principio (por ejemplo "aplica Clean Architecture" o "es seguro frente a inyección SQL") salvo que el propio proyecto lo declare. Describir el comportamiento observable.
12. No copiar a la documentación secretos, credenciales, tokens, claves, hosts o IPs internos ni datos personales que aparezcan en el código. Si encuentras alguno, no reproduzcas su valor y repórtalo en la entrega.
13. Conservar intactas las directivas para herramientas (por ejemplo `eslint-disable`, `@ts-ignore`, `noqa`, `type: ignore`, `phpcs:ignore`, `@phpstan-ignore`, `istanbul ignore`, `pragma`) y los TODO/FIXME existentes. No son documentación.
14. No agregar comentarios redundantes que repitan literalmente el nombre del elemento.
15. No modificar archivos fuera del alcance indicado salvo que se solicite expresamente.

## Alcance de archivos

Incluir: `.tsx` y `.jsx`.

Excluir por defecto:

- `node_modules/`, `.next/`, `dist/`, `build/`, `out/` y `coverage/`;
- archivos de declaración (`*.d.ts`) y de Storybook (`*.stories.*`);
- archivos generados automáticamente (con encabezados como "auto-generated" o "DO NOT EDIT");
- archivos de prueba: usarlos como fuente de contexto sobre el comportamiento esperado, pero no documentarlos salvo que se pida;
- archivos de otros lenguajes o formatos.

## Componentes React

Documentar cada componente no trivial con una descripción breve de:

- su responsabilidad principal;
- el contexto en el que se utiliza;
- los datos que recibe;
- los efectos relevantes que produce;
- su relación con otros componentes cuando no sea evidente.

Usar comentarios JSDoc o TSDoc antes de la declaración del componente cuando aporten información útil.

Ejemplo:

```tsx
/**
 * Muestra el estado actual del proceso y permite al usuario
 * ejecutar la acción disponible según el estado recibido.
 */
export function StatusPanel({ status, onRetry }: StatusPanelProps) {
  // ...
}
```

## Props e interfaces

Documentar las props cuando su propósito, restricciones o efectos no sean evidentes por el nombre.

Documentar especialmente:

- callbacks;
- valores opcionales;
- estados permitidos;
- identificadores;
- configuraciones visuales;
- propiedades que controlan renderizado condicional;
- propiedades cuyos valores tengan unidades o formatos específicos.

No repetir tipos que ya estén claros en la declaración.

```tsx
interface SearchFormProps {
  /** Texto inicial mostrado en el campo de búsqueda. */
  initialValue?: string;

  /** Ejecuta la búsqueda con el valor validado. */
  onSubmit: (value: string) => void;

  /** Deshabilita la interacción mientras se procesa la solicitud. */
  disabled?: boolean;
}
```

En archivos `.jsx` las props no tienen tipos declarados. Documentarlas con JSDoc (`@param {string} props.status`, o un `@typedef` para la forma completa) o conservar los `PropTypes` existentes. No agregar `PropTypes` nuevos: son código.

## Hooks y estado

Documentar hooks personalizados y estados complejos cuando sea necesario explicar:

- qué problema resuelven;
- qué estado administran;
- cuándo ejecutan efectos;
- qué condiciones provocan cambios;
- qué datos exponen;
- qué acciones pueden ejecutar.

Explicar el motivo de dependencias no evidentes en `useEffect`, `useMemo` o `useCallback`.

No documentar condiciones, asignaciones o actualizaciones de estado que sean completamente obvias.

## Eventos y callbacks

Documentar handlers cuando:

- transformen datos;
- validen información;
- coordinen varias acciones;
- dependan de una condición importante;
- actualicen estado de forma no evidente;
- realicen una operación asíncrona.

Explicar qué evento inicia el flujo y cuál es el resultado esperado.

## Renderizado condicional

Agregar comentarios únicamente cuando la condición represente una regla funcional o una decisión visual importante.

Ejemplos válidos:

- mostrar un estado de carga mientras se consulta información;
- ocultar una acción cuando el usuario no tiene permisos;
- mostrar una vista alternativa cuando no existen resultados;
- preservar una interfaz específica durante una operación asíncrona.

No comentar expresiones condicionales simples cuyo significado sea evidente.

## Formularios

Documentar:

- validaciones relevantes;
- valores iniciales;
- transformaciones antes del envío;
- manejo de errores;
- estados de carga;
- comportamiento después de guardar o cancelar.

No inventar reglas de validación que no existan en el código.

## Datos y efectos externos

Cuando un componente consulte una API, almacenamiento, navegador, WebSocket u otro servicio, explicar:

- qué información obtiene o envía;
- en qué momento ocurre;
- cómo se manejan estados de carga y error;
- qué sucede si la operación falla;
- si el efecto puede repetirse o cancelarse.

No documentar detalles de infraestructura que no estén presentes en el código.

## Accesibilidad y UI

Documentar decisiones de accesibilidad o interacción cuando no sean obvias, por ejemplo:

- navegación mediante teclado;
- roles y etiquetas ARIA;
- foco automático;
- mensajes para lectores de pantalla;
- interacción táctil;
- estados visuales asociados a errores o carga.

No agregar atributos ni modificar la interfaz; únicamente documentar lo existente.

## Next.js (solo si el proyecto lo usa)

- Documentar el motivo de las directivas `"use client"` y `"use server"` cuando delimiten la frontera entre servidor y cliente. No agregarlas, quitarlas ni moverlas.
- En Server Actions y Route Handlers: qué reciben, qué validan, qué devuelven y qué rutas o cachés revalidan.
- Documentar la estrategia de obtención de datos y caché (`revalidate`, `cache`, `generateStaticParams`) cuando condicione lo que ve el usuario.
- En rutas dinámicas y metadatos: qué parámetros esperan y de dónde provienen.

## Riesgos específicos de React

- Un comentario dentro de JSX debe escribirse como `{/* ... */}`. Un `//` dentro del JSX se renderiza como texto visible. Nunca insertar comentarios en posiciones que cambien el árbol renderizado (entre operadores `&&`, dentro de ternarias o entre atributos).
- Si el proyecto usa Storybook con autodocs o `react-docgen`, los comentarios de las props se publican como documentación del componente: redactarlos pensando en quien lo consume.
- Si existe una directiva como `eslint-disable-next-line react-hooks/exhaustive-deps`, dejarla intacta. Explicar el motivo en un comentario aparte solo si se puede determinar con certeza.

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
4. Revisar props, hooks, eventos, efectos y renderizado.
5. Conservar la documentación correcta y agregar únicamente la que falta.
6. En proyectos grandes, trabajar por lotes pequeños (una carpeta o módulo a la vez) y verificar entre lotes.
7. Verificar que no haya cambios funcionales revisando el diff (`git diff`): toda línea agregada debe ser un comentario o una línea en blanco que lo acompañe, y toda línea eliminada debe ser un comentario anterior que se reemplazó o corrigió. Cualquier otra diferencia es un error y debe revertirse.
8. Ejecutar las verificaciones disponibles del proyecto sin modificar su configuración: los scripts definidos en `package.json` (`lint`, `type-check` o `tsc --noEmit`, `test`). En proyectos solo `.jsx`, ejecutar únicamente `lint` y `test`. No ejecutar comandos que modifiquen datos, bases de datos o servicios externos.
9. Releer los comentarios: deben ser claros, breves, coherentes con el código y sin información inventada.

## Formato de entrega

Por cada archivo modificado, informar:

1. Ruta del archivo.
2. Resumen de una línea sobre lo documentado.
3. Secciones o componentes documentados.
4. Confirmación de que no se modificó la lógica.
5. Resultado de las verificaciones ejecutadas.

Al final del informe, agregar:

- **Puntos que requieren confirmación:** lo que no se pudo determinar con certeza y se omitió.
- **Hallazgos:** documentación existente corregida por contradecir el código, código sin uso y posibles secretos expuestos (sin reproducir su valor).
- **Sin cambios:** archivos que no requerían documentación, con una nota breve.

Si una verificación no se pudo ejecutar, indicar cuál y por qué.
