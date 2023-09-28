# Compilación en producción

Cuando sea el momento de implementar tu aplicación en producción, simplemente ejecuta el comando `vite build`. De forma predeterminada, este utiliza `<raíz>/index.html` como punto de entrada de compilación y produce un empaquetado de aplicación que es adecuado para ser servido a través de un servicio de alojamiento estático. Consulta [Despliegue de un sitio estático](./static-deploy) para obtener guías sobre servicios populares.

## Compatibilidad de navegadores

El empaquetado de producción asume soporte para código JavaScript moderno. De forma predeterminada, Vite apunta a los navegadores que admiten [modulos ES nativo](https://caniuse.com/es6-module), la [importación dinámica ESM nativa](https://caniuse.com/es6-module-dynamic-import) e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

Puedes especificar objetivos personalizados a través de la [opción de configuración `build.target`](/config/build-options#build-target), donde el objetivo más bajo es `es2015`.

Ten en cuenta que, de forma predeterminada, Vite solo maneja las transformaciones de sintaxis y **no cubre los polyfills**. Puedes consultar [Polyfill.io](https://polyfill.io/v3/), que es un servicio que genera automáticamente paquetes de polyfill en función de la cadena UserAgent del navegador del usuario.

Los navegadores obsoletos pueden ser soportados a través de [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), que generará automáticamente fragmentos y las correspondientes polyfills con características en lenguaje ES. Los fragmentos se cargan condicionalmente solo en navegadores que no tienen soporte ESM nativo.

## Ruta base pública

- Relacionado: [Gestión de recursos estáticos](./assets)

Si estás implementando tu proyecto bajo una ruta pública anidada, simplemente especifica la [opción de configuración `base`](/config/shared-options#base) y todas las rutas de recursos se reescribirán en consecuencia. Esta opción también se puede especificar como un indicador de línea de comando, por ejemplo, `vite build --base=/my/public/path/`.

Las URL de recursos importados por JS, las referencias de CSS `url()` y las referencias de recursos en sus archivos `.html` se ajustan automáticamente para respetar esta opción durante la compilación.

La excepción es cuando se necesita concatenar dinámicamente URL sobre la marcha. En este caso, puedes usar la variable `import.meta.env.BASE_URL` inyectada globalmente, que será la ruta base pública. Ten en cuenta que esta variable se reemplaza estáticamente durante la compilación, por lo que debe aparecer exactamente como está (es decir, `import.meta.env['BASE_URL']` no funcionará).

Para obtener un control avanzado de la ruta base, consulta [Opciones avanzadas de base](#opciones-avanzadas-para-base).

## Personalizando la compilación

La compilación se puede personalizar a través de varias [opciones de configuración de build](/config/build-options). Específicamente, puedes ajustar directamente las [opciones de Rollup](https://rollupjs.org/configuration-options/) fundamentales a través de `build.rollupOptions`:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

Por ejemplo, puedes especificar varias salidas de Rollup con complementos que solo son aplicados durante la compilación.

## Estrategia de división

Puedes configurar cómo se dividen los fragmentos utilizando `build.rollupOptions.output.manualChunks` (consulta la [documentación de Rollup](https://rollupjs.org/configuration-options/#outputmanualchunks)). Hasta Vite 2.8, la estrategia de fragmentación predeterminada dividía los fragmentos en "index" y "vendor". Es una buena estrategia para algunos SPA, pero es difícil proporcionar una solución general para cada caso de uso de destino de Vite. A partir de Vite 2.9, `manualChunks` ya no se modifica de forma predeterminada. Puedes continuar usando la estrategia Split Vendor Chunk agregando `splitVendorChunkPlugin` en el archivo de configuración:

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
})
```

Esta estrategia también se proporciona como una factoría `splitVendorChunk({cache: SplitVendorChunkCache})`, en caso de que se necesite una composición con lógica personalizada. Es necesario llamar a `cache.reset()` en `buildStart` para que el modo de visualización de compilación funcione correctamente en este caso.

::: advertencia
Debes utilizar la función `build.rollupOptions.output.manualChunks` cuando utilices este plugin. Si se utiliza la forma de objeto, el plugin no tendrá ningún efecto.
:::

## Recompilar en cambios de archivos

Puedes habilitar el observador de Rollup con `vite build --watch`. O bien, puedes ajustar directamente las [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch-options) a través de `build.watch`:

```js
// vite.config.js
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch-options
    },
  },
})
```

Con el indicador `--watch` habilitado, los cambios en `vite.config.js`, así como cualquier archivo que se empaquete, desencadenarán una recompilación.

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

Durante el desarrollo, simplemente navega o enlaza a `/nested/` - funcionará como se esperaba, al igual que para un servidor de archivos estático normal.

Durante la compilación, todo lo que necesitas hacer es especificar varios archivos `.html` como puntos de entrada:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

Si especificas una raíz diferente, recuerda que `__dirname` seguirá siendo la carpeta de tu archivo vite.config.js cuando resuelva las rutas de entrada. Por lo tanto, debes agregar tu entrada `raíz` a los argumentos para `resolve`.

Ten en cuenta que para los archivos HTML, Vite ignora el nombre dado a la entrada en el objeto `rollupOptions.input` y en su lugar respeta el id resuelto del archivo al generar el recurso HTML en la carpeta dist. Esto asegura una estructura coherente con la forma en que funciona el servidor dev.

## Modo Librería

Cuando estás desarrollando una librería orientada al navegador, es probable que pases la mayor parte del tiempo en una página de prueba/demostración que importa tu librería actual. Con Vite, puedes usar tu `index.html` para ese propósito y así obtener una experiencia de desarrollo fluida.

Cuando sea el momento de empaquetar tu biblioteca para su distribución, usa la [opción de configuración `build.lib`](/config/build-options#build-lib). Asegúrate de externalizar también cualquier dependencia que no desees incluir en tu librería, por ejemplo, `vue` o `react`:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // También podría ser un diccionario o un array de múltiples puntos de entrada
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // Se agregará la extension apropiada.
      fileName: 'my-lib',
    },
    rollupOptions: {
      // Asegúrate de externalizar las dependencias que no deberían estar empaquetadas
      // en tu librería
      external: ['vue'],
      output: {
        // Proporciona variables globales para usar en la compilación UMD
        // para dependencias externalizadas
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

El archivo de entrada contendría exportaciones que los usuarios de su paquete pueden importar:

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

Ejecutar `vite build` con esta configuración utiliza un ajuste preestablecido de Rollup que está orientado a la distribución de librerías y produce dos formatos de empaquetado: `es` y `umd` (configurable a través de `build.lib`):

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

`package.json` recomendado para tu librería

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

O, si expones múltiples puntos de entrada:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::tip Extensiones de archivo
Si `package.json` no contiene `"type": "module"`, Vite generará diferentes extensiones de archivo para compatibilidad con Node.js. `.js` se convertirá en `.mjs` y `.cjs` se convertirá en `.js`.
:::

:::tip Variables de entorno
En el modo librería, todo uso de `import.meta.env.*` se reemplaza estáticamente cuando se compila para producción. Sin embargo, esto no ocurre para `process.env.*`, por lo que los usuarios que usan la librería pueden cambiarlo dinámicamente. Si esto no es lo que deseas, puedes usar `define: { 'process.env.NODE_ENV': '"production"' }` por ejemplo para reemplazarlos estáticamente.
:::

:::warning Uso avanzado
El modo librería incluye una configuración simple y pragmática para librerías de frameworks Javascript y orientadas al navegador. Si estás creando librerías que no son de navegador o necesitas flujos de compilación avanzados, puedes usar [Rollup](https://rollupjs.org) o [esbuild](https://esbuild.github.io) directamente.
:::

## Opciones avanzadas para Base

:::warning Nota
Esta característica es experimental. [Hacer Comentarios](https://github.com/vitejs/vite/discussions/13834).
:::

Para casos de uso avanzado, los recursos estaticos y los archivos públicos desplegados pueden estar en diferentes rutas, por ejemplo, para usar diferentes estrategias de caché.
Un usuario puede elegir desplegar en tres rutas diferentes:

- Los archivos HTML de entrada generados (que pueden procesarse durante SSR).
- Los hash de recursos generados (JS, CSS y otros tipos de archivos como imágenes).
- Los [archivos públicos](./assets#la-carpeta-public) copiados.

Una sola [base](#ruta-base-publica) estática no es suficiente en estos escenarios. Vite brinda soporte experimental para opciones avanzadas para Base durante la compilación, usando `experimental.renderBuiltUrl`.

```ts
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' })
      if (hostType === 'js') {
        return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
      } else {
        return { relative: true }
      }
    }
  }
```

Si los recursos con hash y los archivos públicos no se despliegan juntos, las opciones para cada grupo se pueden definir de forma independiente utilizando el `type` de recurso incluido en el segundo parámetro de `context` proporcionado a la función.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    }
    else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    }
    else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  }
}
```

Cualquier opción que no esté definida en la entrada `public` o `assets` se heredará de la configuración principal `buildAdvancedBaseOptions`.
