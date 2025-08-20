# Compilación en producción

Cuando sea el momento de implementar tu aplicación en producción, simplemente ejecuta el comando `vite build`. De forma predeterminada, este utiliza `<raíz>/index.html` como punto de entrada de compilación y produce un empaquetado de aplicación que es adecuado para ser servido a través de un servicio de alojamiento estático. Consulta [Despliegue de un sitio estático](./static-deploy) para obtener guías sobre servicios populares. En este caso, asegúrate de establecer `Cache-Control: no-cache` en el archivo HTML, de lo contrario, los recursos antiguos aún se referirán.

## Compatibilidad de navegadores

Por defecto, el paquete de producción asume un navegador moderno que se incluye en los [Baseline](https://web-platform-dx.github.io/web-features/) objetivos de disponibilidad amplia. El rango de soporte de navegadores predeterminado es:

<!-- Busca la constante `ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET` para más información -->

- Chrome >=107
- Edge >=107
- Firefox >=104
- Safari >=16

Puedes especificar objetivos personalizados a través de la [opción de configuración `build.target`](/config/build-options.md#build-target), donde el objetivo más bajo es `es2015`. Si se configura un objetivo inferior, Vite seguirá requiriendo estos rangos mínimos de compatibilidad con navegadores, ya que depende de [la importación dinámica ESM nativa](https://caniuse.com/es6-module-dynamic-import) y [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

<!-- Busca la constante `defaultEsbuildSupported` para más información -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

Ten en cuenta que, por defecto, Vite solo maneja las transformaciones de sintaxis y **no cubre los polyfills**. Puedes consultar https://cdnjs.cloudflare.com/polyfill/ el cual genera automáticamente paquetes de polyfill en función de la cadena UserAgent del navegador del usuario.

Los navegadores obsoletos pueden ser soportados a través de [@vite/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), que generará automáticamente fragmentos y las correspondientes polyfills con características en lenguaje ES. Los fragmentos se cargan condicionalmente solo en navegadores que no tienen soporte ESM nativo.

## Ruta base pública

- Relacionado: [Gestión de recursos estáticos](./assets)

Si estás implementando tu proyecto bajo una ruta pública anidada, simplemente especifica la [opción de configuración `base`](/config/shared-options#base) y todas las rutas de recursos se reescribirán en consecuencia. Esta opción también se puede especificar como un indicador de línea de comando, por ejemplo, `vite build --base=/my/public/path/`.

Las URL de recursos importados por JS, las referencias de CSS `url()` y las referencias de recursos en sus archivos `.html` se ajustan automáticamente para respetar esta opción durante la compilación.

La excepción es cuando se necesita concatenar dinámicamente URL sobre la marcha. En este caso, puedes usar la variable `import.meta.env.BASE_URL` inyectada globalmente, que será la ruta base pública. Ten en cuenta que esta variable se reemplaza estáticamente durante la compilación, por lo que debe aparecer exactamente como está (es decir, `import.meta.env['BASE_URL']` no funcionará).

Para obtener un control avanzado de la ruta base, consulta [Opciones avanzadas de base](#opciones-avanzadas-para-base).

### Base relativo

Si no conoces la ruta base de antemano, puedes configurar una ruta base relativa con `"base": "./"` o `"base": ""`. Esto hará que todas las URL generadas sean relativas a cada archivo.

:::warning Soporte para navegadores antiguos al usar bases relativas
Se requiere soporte para `import.meta` para las bases relativas. Si necesitas soportar [navegadores que no soportan `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), puedes usar [el plugin `legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).
:::

## Personalizando la compilación

La compilación se puede personalizar a través de varias [opciones de configuración de build](/config/build-options). Específicamente, puedes ajustar directamente las [opciones de Rollup](https://rollupjs.org/configuration-options/) fundamentales a través de `build.rollupOptions`:

```js [vite.config.js]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

Por ejemplo, puedes especificar varias salidas de Rollup con plugins que solo son aplicados durante la compilación.

## Estrategia de división

Puedes configurar cómo se dividen los fragmentos utilizando `build.rollupOptions.output.manualChunks` (consulta la [documentación de Rollup](https://rollupjs.org/configuration-options/#outputmanualchunks)). Si usas un framework, consulta su documentación para configurar cómo se dividen los fragmentos.

## Manejo de Errores de Carga

Vite emite el evento `vite:preloadError` cuando no puede cargar importaciones dinámicas. `event.payload` contiene el error de importación original. Si llamas a `event.preventDefault()`, el error no se lanzará.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // por ejemplo, refrescar la página
})
```

Cuando ocurre un nuevo despliegue, el servicio de alojamiento puede eliminar los recursos de despliegues anteriores. Como resultado, un usuario que visitó tu sitio antes del nuevo despliegue podría encontrarse con un error de importación. Este error ocurre porque los recursos que se ejecutan en el dispositivo de ese usuario están desactualizados e intenta importar el fragmento antiguo correspondiente, que se ha eliminado. Este evento es útil para abordar esta situación.

## Recompilar en Cambios de Archivos

Puedes habilitar el observador de Rollup con `vite build --watch`. O bien, puedes ajustar directamente las [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch-options) a través de `build.watch`:

```js [vite.config.js]
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

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

::: code-group

```js twoslash [vite.config.js (entrada única)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
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

```js twoslash [vite.config.js (multiples entradas)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
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

:::

El archivo de entrada contendría exportaciones que los usuarios de su paquete pueden importar:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

Al ejecutar `vite build` con esta configuración, se utiliza un ajuste predeterminado de Rollup orientado a la distribución de librerías y se producen dos formatos de paquete:

- `es` y `umd` (para una sola entrada)
- `es` y `cjs` (para múltiples entradas)

Los formatos se pueden configurar con la opción [`build.lib.formats`](/config/build-options.md#build-lib).

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

`package.json` recomendado para tu librería

::: code-group

```json [package.json (entrada única)]
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

```json twoslash [package.json (múltiples entradas)]
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

:::

### Soporte para CSS

Si tu biblioteca importa algún archivo CSS, este será empaquetado como un archivo CSS único además de los archivos JS generados, por ejemplo, `dist/my-lib.css`. El nombre por defecto es `build.lib.fileName`, pero también puede cambiarse con [`build.lib.cssFileName`](/config/build-options.md#build-lib).

Puedes exportar el archivo CSS en tu `package.json` para que los usuarios lo importen:

```json {12}
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
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

:::tip Extensiones de archivo
Si `package.json` no contiene `"type": "module"`, Vite generará diferentes extensiones de archivo para compatibilidad con Node.js. `.js` se convertirá en `.mjs` y `.cjs` se convertirá en `.js`.
:::

:::tip Variables de entorno
En el modo librería, todo uso de [`import.meta.env.*`](./env-and-mode.md) se reemplaza estáticamente cuando se compila para producción. Sin embargo, esto no ocurre para `process.env.*`, por lo que los usuarios que usan la librería pueden cambiarlo dinámicamente. Si esto no es lo que deseas, puedes usar `define: { 'process.env.NODE_ENV': '"production"' }` por ejemplo para reemplazarlos estáticamente, o utiliza [`esm-env`](https://github.com/benmccann/esm-env) para una mejor compatibilidad con empaquetadores y entornos de ejecución.
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

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

Si los recursos con hash y los archivos públicos no se despliegan juntos, las opciones para cada grupo se pueden definir de forma independiente utilizando el `type` de recurso incluido en el segundo parámetro de `context` proporcionado a la función.

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
  // ---cut-before---
  experimental: {
    renderBuiltUrl(filename, { hostId, hostType, type }) {
      if (type === 'public') {
        return 'https://www.domain.com/' + filename
      } else if (path.extname(hostId) === '.js') {
        return {
          runtime: `window.__assetsPath(${JSON.stringify(filename)})`
        }
      } else {
        return 'https://cdn.domain.com/assets/' + filename
      }
    },
  },
  // ---cut-after---
}
```

Ten en cuenta que el `filename` que se pasa es una URL decodificada, y si la función devuelve una cadena de URL, también debería estar decodificada. Vite manejará automáticamente la codificación al renderizar las URLs. Si se devuelve un objeto con `runtime`, debes manejar la codificación tú mismo donde sea necesario, ya que el código de ejecución se renderizará tal como está.
