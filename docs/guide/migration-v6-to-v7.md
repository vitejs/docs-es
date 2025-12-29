# Migración desde v6

## Soporte de Node.js

Vite ya no admite Node.js 18, que alcanzó su fin de vida útil. Ahora se requiere Node.js 20.19+ / 22.12+.

## Cambio en el objetivo predeterminado del navegador

El valor predeterminado de `build.target` se ha actualizado a un navegador más reciente.

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

Estas versiones de navegador se alinean con los conjuntos de características "Baseline" ("Widely Available") [Web Platform DX](https://web-platform-dx.github.io/web-features/) configurados hasta 2025-05-01. En otras palabras, todas se lanzaron antes del 2022-11-01.

En Vite 5, el objetivo predeterminado se llamaba `'modules'`, pero ya no está disponible. En su lugar, se introduce un nuevo objetivo predeterminado `'baseline-widely-available'`.

## Cambios generales

### Eliminación del soporte para la API heredada de Sass

Tal como se planeó, se eliminó el soporte para la API heredada de Sass. Vite ahora solo admite la API moderna. Puedes eliminar la opción `css.preprocessorOptions.sass.api` / `css.preprocessorOptions.scss.api`.

## Características obsoletas eliminadas

- `splitVendorChunkPlugin` (obsoleto en v5.2.7)
  - Este plugin se proporcionó originalmente para facilitar la migración a Vite v2.9.
  - La opción `build.rollupOptions.output.manualChunks` se puede usar para controlar el comportamiento de los fragmentos si es necesario.
- Hook-level `enforce` / `transform` para `transformIndexHtml` (obsoleto en v4.0.0)
  - Se cambió para alinear la interfaz con [los hooks de objeto de Rollup](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.).
  - Debe usarse `order` en lugar de `enforce`, y `handler` en lugar de `transform`.

## Avanzado

Existen otros cambios que solo afectan a pocos usuarios.

- [[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - Se especificó el rango de versiones de las dependencias de pares para los preprocesadores de CSS.
- [[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - La propiedad `legacy.proxySsrExternalModules` no tenía efecto desde Vite 6. Ahora se ha eliminado.
- [[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - Las siguientes propiedades inutilizadas se han eliminado: `ModuleRunnerOptions.root`, `ViteDevServer._importGlobMap`, `ResolvePluginOptions.isFromTsImporter`, `ResolvePluginOptions.getDepsOptimizer`, `ResolvePluginOptions.shouldExternalize`, `ResolvePluginOptions.ssrConfig`
- [[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - Estas propiedades estaban obsoletas desde el principio. Ahora se han eliminado.
- [[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - Estos tipos se introdujeron como parte de la ahora obsoleta API de Runtime. Ahora se han eliminado: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`
- [[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - Ahora se requiere `__vite_ssr_exportName__` para el contexto de ejecución de la capa de runtime.
- [[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - Ahora `optimizeDeps.entries` no recibe rutas literales. En su lugar, siempre recibe patrones globales.
- [[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - Ahora se aplican algunos middlewares antes del hook `configureServer` / `configurePreviewServer`. Ten en cuenta que si no espera que una ruta determinada aplique la opción `server.cors` / `preview.cors`, asegúrate de eliminar los encabezados relacionados de la respuesta.

## Migración desde v5

Primero, asegúrate de leer la [guía de migración desde v5](/guide/migration-v5-to-v6.md) en la documentación de Vite v6 para ver los cambios necesarios para portar tu aplicación a Vite 6, y luego realiza los cambios de esta página.
