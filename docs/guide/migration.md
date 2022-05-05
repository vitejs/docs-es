# Migración desde v1

## Cambio de opciones de configuración

- Las siguientes opciones se han eliminado y deben implementarse a través de [complementos] (./api-plugin):

  - `resolvers`
  - `transforms`
  - `indexHtmlTransforms`

- Se han eliminado `jsx` y `enableEsbuild`; utiliza la nueva opción [`esbuild`](/config/#esbuild) en su lugar.

- [Opciones relacionadas con CSS](/config/#css-modules) ahora están anidadas bajo `css`.

- Todas las [opciones específicas de compilación] (/config/#build-options) ahora están anidadas en `compilación`.

  - `rollupInputOptions` y `rollupOutputOptions` se reemplazan por [`build.rollupOptions`](/config/#build-rollupoptions).
  - `esbuildTarget` ahora es [`build.target`](/config/#build-target).
  - `emitManifest` ahora es [`build.manifest`](/config/#build-manifest).
  - Se han eliminado las siguientes opciones de compilación, ya que se pueden lograr a través de hooks de complemento u otras opciones:
    - `entry`
    - `rollupDedupe`
    - `emitAssets`
    - `emitIndex`
    - `shouldPreload`
    - `configureBuild`

- Todas las [opciones específicas del servidor](/config/#server-options) ahora están anidadas bajo
  `server`.

  - `hostname` ahora es [`server.host`](/config/#server-host).
  - Se ha eliminado `httpsOptions`. [`server.https`](/config/#server-https) puede aceptar directamente el objeto de opciones.
  - `chokidarWatchOptions` ahora es [`server.watch`](/config/#server-watch).

- [`assetsInclude`](/config/#assetsinclude) ahora espera `string | RegExp | (string | RegExp)[]` en lugar de una función.

- Se eliminan todas las opciones específicas de Vue; pasa las opciones al complemento Vue en su lugar.

## Cambio de comportamiento de alias

[`alias`](/config/#resolve-alias) ahora se pasa a `@rollup/plugin-alias` y ya no requiere barras inclinadas de inicio/final. El comportamiento ahora es un reemplazo directo, por lo que la clave de alias de directorio de estilo 1.0 debería eliminar la barra inclinada final:

```diff
- alias: { '/@foo/': path.resolve(__dirname, 'some-special-dir') }
+ alias: { '/@foo': path.resolve(__dirname, 'some-special-dir') }
```

Alternativamente, puedes usar el formato de opción `[{ find: RegExp, replace: string }]` para un control más preciso.

## Soporte de Vue

El núcleo de Vite 2.0 ahora es independiente del marco de trabajo. El soporte de Vue ahora se proporciona a través de [`@vitejs/plugin-vue`](https://github.com/vitejs/vite/tree/main/packages/plugin-vue). Simplemente instálalo y agrégalo en la configuración de Vite:

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()]
})
```

### Transformaciones de bloques personalizados

Se puede usar un complemento personalizado para transformar bloques personalizados de Vue como el siguiente:

```ts
// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const vueI18nPlugin = {
  name: 'vue-i18n',
  transform(code, id) {
    if (!/vue&type=i18n/.test(id)) {
      return
    }
    if (/\.ya?ml$/.test(id)) {
      code = JSON.stringify(require('js-yaml').load(code.trim()))
    }
    return `export default Comp => {
      Comp.i18n = ${code}
    }`
  }
}

export default defineConfig({
  plugins: [vue(), vueI18nPlugin]
})
```

## Soporte de React

La compatibilidad con React Fast Refresh ahora se proporciona a través de [`@vitejs/plugin-react`](https://github.com/vitejs/vite/tree/main/packages/plugin-react).

## Cambio de API de HMR

`import.meta.hot.acceptDeps()` ha quedado en desuso. [`import.meta.hot.accept()`](./api-hmr#hot-accept-deps-cb) ahora puede aceptar dependencias únicas o múltiples.

## Cambio de formato de manifiesto

El manifiesto de compilación ahora usa el siguiente formato:

```json
{
  "index.js": {
    "file": "assets/index.acaf2b48.js",
    "imports": [...]
  },
  "index.css": {
    "file": "assets/index.7b7dbd85.css"
  }
  "asset.png": {
    "file": "assets/asset.0ab0f9cd.png"
  }
}
```

Para los fragmentos JS de entrada, también lista sus fragmentos importados útiles para representar directivas de precarga.

## Para autores de complementos

Vite 2 utiliza una interfaz de complemento completamente rediseñada que amplía los complementos de Rollup. Lee la nueva [Guía de desarrollo de complementos](./api-plugin).

Algunos consejos generales sobre la migración de un complemento v1 a v2:

- `resolvers` -> usa el hook [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
- `transforms` -> usa el hook [`transform`](https://rollupjs.org/guide/en/#transform)
- `indexHtmlTransforms` -> usa el hook [`transformIndexHtml`](./api-plugin#transformindexhtml)
- Serving virtual files -> use los hooks [`resolveId`](https://rollupjs.org/guide/en/#resolveid) + [`load`](https://rollupjs.org/guide/en/#load)
- Agregar `alias`, `define` u otras opciones de configuración -> usa el hook [`config`](./api-plugin#config)

Dado que la mayor parte de la lógica debe realizarse a través de enlaces de complementos en lugar de middlewares, la necesidad de middlewares se reduce considerablemente. La aplicación del servidor interno ahora es una buena instancia antigua de [connect] (https://github.com/senchalabs/connect) en lugar de Koa.
