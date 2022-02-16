<!-- # Static Asset Handling

- Related: [Public Base Path](./build#public-base-path)
- Related: [`assetsInclude` config option](/config/#assetsinclude) -->

# Manejo de recursos estáticos

- Relacionado: [Ruta base pública](./build#public-base-path)
- Relacionado: [Opción de configuración `assetsInclude`](/config/#assetsinclude)

<!-- ## Importing Asset as URL

Importing a static asset will return the resolved public URL when it is served: -->

## Importar recursos como URL

Importar un recurso estático retornará la URL pública que es resuelta al servirla:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

<!-- For example, `imgUrl` will be `/img.png` during development, and become `/assets/img.2d8efhg.png` in the production build.

The behavior is similar to webpack's `file-loader`. The difference is that the import can be either using absolute public paths (based on project root during dev) or relative paths.

- `url()` references in CSS are handled the same way.

- If using the Vue plugin, asset references in Vue SFC templates are automatically converted into imports.

- Common image, media, and font filetypes are detected as assets automatically. You can extend the internal list using the [`assetsInclude` option](/config/#assetsinclude).

- Referenced assets are included as part of the build assets graph, will get hashed file names, and can be processed by plugins for optimization.

- Assets smaller in bytes than the [`assetsInlineLimit` option](/config/#build-assetsinlinelimit) will be inlined as base64 data URLs. -->

Por ejemplo, `imgUrl` será `/img.png` durante el desarrollo y se convertirá en `/assets/img.2d8efhg.png` en la compilación de producción.

El comportamiento es similar al `file-loader` de webpack. La diferencia es que la importación puede ser usando rutas públicas absolutas (basadas en la raíz del proyecto durante el desarrollo) o rutas relativas.

- Las referencias `url()` en CSS se manejan de la misma manera.

- Si usa el complemento de Vue, las referencias de recursos en las plantillas de Vue SFC se convierten automáticamente en importaciones.

- Los tipos de archivos comunes de imágenes, medios y fuentes se detectan como recursos automáticamente. Puedes ampliar la lista interna utilizando la opción [`assetsInclude`](/config/#assetsinclude).

- Los recursos referenciados se incluyen como parte del gráfico de compilación de recursos, obtendrán nombres de archivo con hash y los complementos pueden procesarlos para su optimización.

- Los recursos más pequeños en bytes que la opción [`assetsInlineLimit`](/config/#build-assetsinlinelimit) se insertarán como URL de datos en base64.

<!-- ### Explicit URL Imports

Assets that are not included in the internal list or in `assetsInclude`, can be explicitly imported as an URL using the `?url` suffix. This is useful, for example, to import [Houdini Paint Worklets](https://houdini.how/usage). -->

### Importaciones de URL explícita

Los recursos que no están incluidos en la lista interna o en `assetsInclude`, se pueden importar explícitamente como una URL usando el sufijo `?url`. Esto es útil, por ejemplo, para importar los [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

<!-- ### Importing Asset as String

Assets can be imported as strings using the `?raw` suffix. -->

### Importar recursos como cadenas de texto

Los recursos pueden ser importados como cadenas de texto usando el sufijo `?raw`.

```js
import shaderString from './shader.glsl?raw'
```

<!-- ### Importing Script as a Worker

Scripts can be imported as web workers with the `?worker` or `?sharedworker` suffix. -->

### Importar scripts como Worker

Los scripts pueden ser importados como workers web con los sufijos `?worker` o `?sharedworker`.

```js
// Fragmento separado en la compilación de producción
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// En línea como cadena base64
import InlineWorker from './shader.js?worker&inline'
```

<!-- Check out the [Web Worker section](./features.md#web-workers) for more details. -->

Consulta la [sección Web Worker](./features.md#web-workers) para obtener más detalles.

<!-- ## The `public` Directory

If you have assets that are:

- Never referenced in source code (e.g. `robots.txt`)
- Must retain the exact same file name (without hashing)
- ...or you simply don't want to have to import an asset first just to get its URL

Then you can place the asset in a special `public` directory under your project root. Assets in this directory will be served at root path `/` during dev, and copied to the root of the dist directory as-is.

The directory defaults to `<root>/public`, but can be configured via the [`publicDir` option](/config/#publicdir).

Note that:

- You should always reference `public` assets using root absolute path - for example, `public/icon.png` should be referenced in source code as `/icon.png`.
- Assets in `public` cannot be imported from JavaScript. -->

## La carpeta `public`

Si tienes recursos que:

- No han sido referenciados en el código fuente (por ejemplo, `robots.txt`)
- Deban conservar exactamente el mismo nombre de archivo (sin hash)
- ...o simplemente no quieres tener que importar un recurso primero solo para obtener su URL

Entonces puedes colocar el recurso en una carpeta `public` especial en la raíz de tu proyecto. Los recursos en ella se servirán en la ruta raíz `/` durante el desarrollo y se copiarán en la raíz de la carpeta dist tal como están.

El directorio predeterminado es `<root>/public`, pero esto se puede configurar a través de la opción [`publicDir`](/config/#publicdir).

Ten en cuenta que:

- Siempre debes hacer referencia a los recursos de `public` utilizando la ruta raíz absoluta; por ejemplo, `public/icon.png` debe estar referenciado en el código fuente como `/icon.png`.
- Los recursos en `public` no se pueden importar desde JavaScript.

<!-- ## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) is a native ESM feature that exposes the current module's URL. Combining it with the native [URL constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL), we can obtain the full, resolved URL of a static asset using relative path from a JavaScript module: -->

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) es una característica nativa de ESM que expone la URL del módulo actual. Combinándolo con el [constructor de URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) nativo, podemos obtener la URL completa y resuelta de un recurso estático utilizando la ruta relativa de un Módulo JavaScript:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

<!-- This works natively in modern browsers - in fact, Vite doesn't need to process this code at all during development!

This pattern also supports dynamic URLs via template literals: -->

Esto funciona de forma nativa en los navegadores modernos; de hecho, Vite no necesita procesar este código durante el desarrollo.

Este patrón también admite direcciones URL dinámicas a través de literales de plantilla:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

<!-- During the production build, Vite will perform necessary transforms so that the URLs still point to the correct location even after bundling and asset hashing.

::: warning Note: Does not work with SSR
This pattern does not work if you are using Vite for Server-Side Rendering, because `import.meta.url` have different semantics in browsers vs. Node.js. The server bundle also cannot determine the client host URL ahead of time.
::: -->

Durante la compilación en producción, Vite realizará las transformaciones necesarias para que las URL sigan apuntando a la ubicación correcta incluso después del empaquetado y el hashing de recursos.

::: warning Nota: No funciona con SSR
Este patrón no funciona si estás utilizando Vite para Server-Side Rendering, porque `import.meta.url` tiene una semántica diferente en navegadores con respecto a Node.js. El empaquetado del servidor tampoco puede determinar la URL del host del cliente con anticipación.
:::
