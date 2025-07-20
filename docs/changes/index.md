# Cambios Importantes

Lista de cambios importantes en Vite, incluyendo declaraciones de desuso, eliminaciones y modificaciones de la API. La mayoría de los cambios a continuación pueden activarse opcionalmente utilizando la [opción `future`](/config/shared-options.html#future) en tu configuración de Vite.

## Planificados

Estos cambios están planificados para la próxima versión principal de Vite. Las advertencias de obsolencia o uso te guiarán donde sea posible, y estamos contactando a autores de frameworks, plugins y usuarios para aplicar estos cambios.

- [`this.environment` en Hooks](/changes/this-environment-in-hooks)
- [Hooks de Plugin `hotUpdate` para HMR](/changes/hotupdate-hook)
- [SSR Usando la API `ModuleRunner`](/changes/ssr-using-modulerunner)

## En Evaluación

Estos cambios están siendo considerados y a menudo son APIs experimentales que pretenden mejorar los patrones de uso actuales. Como no todos los cambios están listados aquí, por favor consulta la [Etiqueta Experimental en las discusiones de GitHub de Vite](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=label%3Aexperimental+category%3AFeedback) para la lista completa.

No recomendamos cambiar a estas APIs aún. Están incluidas en Vite para ayudarnos a recopilar feedback. Consulta estas propuestas y háznos saber cómo funcionan en tu caso de uso en las discusiones de GitHub enlazadas.

- [Migración a las APIs por Entorno](/changes/per-environment-apis)
- [Plugins Compartidos Durante la Compilación](/changes/shared-plugins-during-build)

## Pasados

Los cambios a continuación ya se han realizado o revertido. Ya no son relevantes en la versión principal actual.
