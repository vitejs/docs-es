<!-- # Building for Production

When it is time to deploy your app for production, simply run the `vite build` command. By default, it uses `<root>/index.html` as the build entry point, and produces an application bundle that is suitable to be served over a static hosting service. Check out the [Deploying a Static Site](./static-deploy) for guides about popular services.

## Browser Compatibility

The production bundle assumes support for modern JavaScript. By default, Vite targets browsers which support the [native ESM script tag](https://caniuse.com/es6-module) and [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import). As a reference, Vite uses this [browserslist](https://github.com/browserslist/browserslist) query:

```
defaults and supports es6-module and supports es6-module-dynamic-import, not opera > 0, not samsung > 0, not and_qq > 0
```

You can specify custom targets via the [`build.target` config option](/config/#build-target), where the lowest target is `es2015`.

Note that by default, Vite only handles syntax transforms and **does not cover polyfills by default**. You can check out [Polyfill.io](https://polyfill.io/v3/) which is a service that automatically generates polyfill bundles based on the user's browser UserAgent string.

Legacy browsers can be supported via [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), which will automatically generate legacy chunks and corresponding ES language feature polyfills. The legacy chunks are conditionally loaded only in browsers that do not have native ESM support. -->

# Compilación en producción

Cuando sea el momento de implementar tu aplicación en producción, simplemente ejecuta el comando `vite build`. De forma predeterminada, este utiliza `<raíz>/index.html` como punto de entrada de compilación y produce un empaquetado de aplicación que es adecuado para ser servido a través de un servicio de alojamiento estático. Consulta [Implementación de un sitio estático](./static-deploy) para obtener guías sobre servicios populares.

## Compatibilidad de navegadores

El empaquetado de producción asume soporte para código JavaScript moderno. De forma predeterminada, Vite apunta a los navegadores que admiten la [etiqueta script de ESM nativo](https://caniuse.com/es6-module) y la [importación dinámica ESM nativa](https://caniuse.com/es6-module-dynamic-import). Como referencia, Vite usa esta consulta [browserslist](https://github.com/browserslist/browserslist):

```
defaults and supports es6-module and supports es6-module-dynamic-import, not opera > 0, not samsung > 0, not and_qq > 0
```

Puedes especificar objetivos personalizados a través de la [opción de configuración `build.target`](/config/#build-target), donde el objetivo más bajo es `es2015`.

Ten en cuenta que, de forma predeterminada, Vite solo maneja las transformaciones de sintaxis y **no cubre los polyfills de forma predeterminada**. Puedes consultar [Polyfill.io](https://polyfill.io/v3/), que es un servicio que genera automáticamente paquetes de polyfill en función de la cadena UserAgent del navegador del usuario.

Los navegadores obsoletos pueden ser soportados a través de [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), que generará automáticamente fragmentos y las correspondientes polyfills con características en lenguaje ES. Los fragmentos se cargan condicionalmente solo en navegadores que no tienen soporte ESM nativo.

<!-- ## Public Base Path

- Related: [Asset Handling](./assets)

If you are deploying your project under a nested public path, simply specify the [`base` config option](/config/#base) and all asset paths will be rewritten accordingly. This option can also be specified as a command line flag, e.g. `vite build --base=/my/public/path/`.

JS-imported asset URLs, CSS `url()` references, and asset references in your `.html` files are all automatically adjusted to respect this option during build.

The exception is when you need to dynamically concatenate URLs on the fly. In this case, you can use the globally injected `import.meta.env.BASE_URL` variable which will be the public base path. Note this variable is statically replaced during build so it must appear exactly as-is (i.e. `import.meta.env['BASE_URL']` won't work).

## Customizing the Build

The build can be customized via various [build config options](/config/#build-options). Specifically, you can directly adjust the underlying [Rollup options](https://rollupjs.org/guide/en/#big-list-of-options) via `build.rollupOptions`: -->

## Ruta base pública

- Relacionado: [Manejo de recursos estáticos](./assets)

Si estás implementando tu proyecto bajo una ruta pública anidada, simplemente especifica la [opción de configuración `base`](/config/#base) y todas las rutas de recursos se reescribirán en consecuencia. Esta opción también se puede especificar como un indicador de línea de comando, por ejemplo, `vite build --base=/my/public/path/`.

Las URL de recursos importados por JS, las referencias de CSS `url()` y las referencias de recursos en sus archivos `.html` se ajustan automáticamente para respetar esta opción durante la compilación.

La excepción es cuando se necesita concatenar dinámicamente URL sobre la marcha. En este caso, puedes usar la variable `import.meta.env.BASE_URL` inyectada globalmente, que será la ruta base pública. Ten en cuenta que esta variable se reemplaza estáticamente durante la compilación, por lo que debe aparecer exactamente como está (es decir, `import.meta.env['BASE_URL']` no funcionará).

## Personalizar la compilación

La compilación se puede personalizar a través de varias [opciones de configuración de compilación](/config/#build-options). Específicamente, puedes ajustar directamente las [opciones de Rollup](https://rollupjs.org/guide/en/#big-list-of-options) fundamentales a través de `build.rollupOptions`:

```js
// vite.config.js
module.exports = defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    }
  }
})
```

<!-- For example, you can specify multiple Rollup outputs with plugins that are only applied during build. -->

Por ejemplo, puedes especificar varias salidas de Rollup con complementos que solo son aplicados durante la compilación.

<!-- ## Rebuild on files changes

You can enable rollup watcher with `vite build --watch`. Or, you can directly adjust the underlying [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options) via `build.watch`: -->

## Recompilar en cambios de archivos

Puedes habilitar el observador de Rollup con `vite build --watch`. O bien, puedes ajustar directamente las [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options) a través de `build.watch`:

```js
// vite.config.js
module.exports = defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/guide/en/#watch-options
    }
  }
})
```

<!-- ## Multi-Page App

Suppose you have the following source code structure: -->

## Aplicación multipáginas

Supongamos que tienes la siguiente estructura de código:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

<!-- During dev, simply navigate or link to `/nested/` - it works as expected, just like for a normal static file server.

During build, all you need to do is to specify multiple `.html` files as entry points: -->

Durante el desarrollo, simplemente navega o enlaza a `/nested/` - funcionará como se esperaba, al igual que para un servidor de archivos estático normal.

Durante la compilación, todo lo que necesitas hacer es especificar varios archivos `.html` como puntos de entrada:

```js
// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

<!-- If you specify a different root, remember that `__dirname` will still be the folder of your vite.config.js file when resolving the input paths. Therefore, you will need to add your `root` entry to the arguments for `resolve`. -->

Si especificas una raíz diferente, recuerda que `__dirname` seguirá siendo la carpeta de tu archivo vite.config.js cuando resuelva las rutas de entrada. Por lo tanto, debes agregar tu entrada `raíz` a los argumentos para `resolve`.

<!-- ## Library Mode

When you are developing a browser-oriented library, you are likely spending most of the time on a test/demo page that imports your actual library. With Vite, you can use your `index.html` for that purpose to get the smooth development experience.

When it is time to bundle your library for distribution, use the [`build.lib` config option](/config/#build-lib). Make sure to also externalize any dependencies that you do not want to bundle into your library, e.g. `vue` or `react`: -->

## Modo Librería

Cuando estás desarrollando una librería orientada al navegador, es probable que pases la mayor parte del tiempo en una página de prueba/demostración que importa tu librería actual. Con Vite, puedes usar tu `index.html` para ese propósito y así obtener una experiencia de desarrollo fluida.

Cuando sea el momento de empaquetar tu biblioteca para su distribución, usa la [opción de configuración `build.lib`](/config/#build-lib). Asegúrate de externalizar también cualquier dependencia que no desees incluir en tu librería, por ejemplo, `vue` o `react`:

```js
// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      // Asegúrate de externalizar las dependencias que no deberían estar empaquetadas
      // en tu librería
      external: ['vue'],
      output: {
        // Proporciona variables globales para usar en la compilación UMD
        // para dependencias externalizadas
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

<!-- Running `vite build` with this config uses a Rollup preset that is oriented towards shipping libraries and produces two bundle formats: `es` and `umd` (configurable via `build.lib`): -->

Ejecutar `vite build` con esta configuración utiliza un ajuste preestablecido de Rollup que está orientado a la distribución de librerías y produce dos formatos de empaquetado: `es` y `umd` (configurable a través de `build.lib`):

```
$ vite build
building for production...
[write] my-lib.es.js 0.08kb, brotli: 0.07kb
[write] my-lib.umd.js 0.30kb, brotli: 0.16kb
```

<!-- Recommended `package.json` for your lib: -->

`package.json` recomendado para tu librería

```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```
