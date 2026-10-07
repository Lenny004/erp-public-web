---
name: code-documentation
description: Documenta módulos React, TSX y Node.js del sitio público en español sin alterar su lógica. Úsala al crear o completar comentarios de componentes, hooks, validaciones, clientes HTTP y configuración.
---

# Documentación de código

## Alcance

Documenta el código de `erp-public-web` en español y conserva los identificadores técnicos tal como aparecen. La documentación debe explicar responsabilidades, contratos, flujo de datos, efectos externos y decisiones no evidentes; no debe describir sintaxis obvia ni inventar comportamiento.

## Referencias locales

Aplica el prompt que corresponda al tipo de archivo:

- React/TSX/JSX: [prompt-documentacion-react.md](references/prompt-documentacion-react.md)
- TSX: [prompt-documentacion-tsx.txt](references/prompt-documentacion-tsx.txt)
- Node.js/JS/MJS/CJS y TS de runtime: [prompt-documentacion-nodejs.md](references/prompt-documentacion-nodejs.md)

Si los prompts se contradicen, usa el más específico para el archivo y conserva las reglas del proyecto en `AGENTS.md`.

## Flujo

1. Lee `AGENTS.md`, `README.md`, el archivo completo y sus consumidores antes de editar.
2. Ordena el trabajo por módulos: tipos/validaciones/utilidades, cliente y hooks, componentes, páginas y configuración.
3. Conserva comentarios correctos, directivas de herramientas y TODO/FIXME existentes.
4. Usa TSDoc/JSDoc antes de componentes, funciones, hooks, interfaces y handlers cuando expliquen algo no evidente. En JSX usa comentarios `{/* ... */}` dentro del árbol.
5. Documenta validaciones, estados de carga/error/vacío, callbacks, efectos, endpoints, variables de entorno y salidas solo cuando existan en el código.
6. No cambies imports, nombres, firmas, tipos, orden, formato, dependencias ni lógica.
7. Revisa `git diff`: las líneas nuevas deben ser comentarios o líneas en blanco asociadas a ellos.
8. Ejecuta las verificaciones disponibles y reporta por archivo qué se documentó, qué quedó sin cambios y cualquier punto que requiera confirmación.

## Exclusiones

No edites `node_modules`, builds, cobertura, declaraciones, historias de Storybook, pruebas ni archivos generados salvo petición explícita. No copies secretos, tokens, credenciales, hosts internos ni datos personales a los comentarios.
