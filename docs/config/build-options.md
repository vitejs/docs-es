# Opciones para build

A menos que se indique lo contrario, las opciones en esta sección solo se aplican a la compilación.

## build.target

- **Tipo:** `string | string[]`
- **Por defecto:** `'baseline-widely-available'`
- **Relacionado:** [Compatibilidad de navegadores](/guide/build#compatibilidad-de-navegadores)

El objetivo de compatibilidad del navegador para el paquete final. El valor predeterminado es un valor especial de Vite, `'baseline-widely-available'`, que apunta a los navegadores que se encuentran en la [Línea de base](https://web-platform-dx.github.io/web-features/) de 2025-05-01. En particular, es `['chrome107', 'edge107', 'firefox104', 'safari16']`.

Otro valor especial es `'esnext'`, que asume soporte nativo para importaciones dinámicas y solo realiza una transpilación mínima.

La transformación se realiza con esbuild y el valor debe ser una [opción de destino de esbuild](https://esbuild.github.io/api/#target) válida. Los objetivos personalizados pueden ser una versión ES (por ejemplo, `es2015`), un navegador con versión (por ejemplo, `chrome58`) o un array de varias cadenas de destino.

Ten en cuenta que la compilación fallará si el código contiene funciones que esbuild no puede transpilar de manera segura. Consulta la [documentación de esbuild](https://esbuild.github.io/content-types/#javascript) para obtener más detalles.

## build.modulePreload

- **Tipo:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **Por defecto:** `{ polyfill: true }`

Por defecto, se inyecta automáticamente un [polyfill de precarga de módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill). El polyfill se inyecta automáticamente en el módulo proxy de cada archivo de entrada `index.html`. Si la compilación está configurada para usar una entrada personalizada que no sea HTML a través de `build.rollupOptions.input`, entonces es necesario importar manualmente el polyfill en la entrada personalizada:

```js
import 'vite/modulepreload-polyfill'
```

Nota: el polyfill **no** se aplica al [Modo Librería](/guide/build#modo-libreria). Si necesitas que se soporten navegadores sin importación dinámica nativa, probablemente deberías evitar usarlo en tu librería.

El polyfill se puede deshabilitar usando `{ polyfill: false }`.

Vite calcula la lista de fragmentos a precargar para cada importación dinámica. De forma predeterminada, se utilizará una ruta absoluta que incluya la `base` al cargar estas dependencias. Si la `base` es relativa (`''` o `'./''`), se usa `import.meta.url` en tiempo de ejecución para evitar rutas absolutas que dependen de la base final implementada.

Existe soporte experimental para un control detallado sobre la lista de dependencias y sus rutas usando la función `resolveDependencies`. [Hacer Comentarios](https://github.com/vitejs/vite/discussions/13841). Esto espera una función de tipo `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  }
) => string[]
```

Se llamará a la función `resolveDependencies` para cada importación dinámica con una lista de los fragmentos de los que depende, y también se llamará para cada fragmento importado en los archivos de entrada HTML. Se puede devolver un nuevo array de dependencias con estas dependencias filtradas, u otras más inyectadas, y sus rutas modificadas. Las rutas de `deps` son relativas a `build.outDir`. El valor de retorno debe ser una ruta relativa a `build.outDir`.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

Las rutas de dependencia resueltas se pueden modificar aún más usando [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options)

## build.polyfillModulePreload

- **Tipo:** `boolean`
- **Por defecto:** `true`
- **Obsoleto** usa `build.modulePreload.polyfill` en su lugar

Permite inyectar automáticamente un [polyfill de precarga de módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

## build.outDir

- **Tipo:** `string`
- **Por defecto:** `dist`

Especifica el directorio de salida (relativo a [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto)).

## build.assetsDir

- **Tipo:** `string`
- **Por defecto:** `assets`

Especifica el directorio en el que se alojarán los recursos generados (en relación con `build.outDir`). Esto no se usa en el [modo librería](/guide/build#modo-libreria).

## build.assetsInlineLimit

- **Tipo:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **Por defecto:** `4096` (4KiB)

Los recursos importados o a los que se hace referencia que son más pequeños que este umbral se insertarán como URL base64 para evitar solicitudes http adicionales. Configurar en `0` para deshabilitar la inserción por completo.

Si se pasa un callback, se puede devolver un valor booleano para optar por usarlo o no. Si no se devuelve nada, se aplica la lógica predeterminada.

Los marcadores de posición de Git LFS se excluyen automáticamente de la inserción porque no contienen el contenido del archivo que representan.

::: tip Nota
Si especificas `build.lib`, `build.assetsInlineLimit` se ignorará y los recursos siempre serán insertados, independientemente del tamaño del archivo o de ser un marcador de posición Git LFS.
:::

## build.cssCodeSplit

- **Tipo:** `boolean`
- **Por defecto:** `true`

Habilita/deshabilita la división de código CSS. Cuando está habilitado, el CSS importado en fragmentos de Javascript asíncronos se incluirá en el fragmento asíncrono mismo y se insertará cuando se haya cargado.

Si está deshabilitado, todo el CSS de todo el proyecto se extraerá en un único archivo CSS.

::: tip Nota
Si especificas `build.lib`, `build.cssCodeSplit` será `false` por defecto.
:::

## build.cssTarget

- **Tipo:** `string | string[]`
- **Por defecto:** Igual que [`build.target`](#build-target)

Esta opción permite a los usuarios configurar un destino de navegador diferente para la minificación de CSS del que se usa normalmente para la transpilación de JavaScript.

Solo debe usarse cuando se dirige a un navegador no convencional.
Un ejemplo es WeChat WebView de Android, que es compatible con la mayoría de las funciones modernas de JavaScript, pero no con la [notación de color hexadecimal `#RGBA` en CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#colores_rgb).
En este caso, debes configurar `build.cssTarget` en `chrome61` para evitar que vite transforme los colores `rgba()` en notaciones hexadecimales `#RGBA`.

## build.cssMinify

- **Tipo:** `boolean | 'esbuild' | 'lightningcss'`
- **Por defecto:** lo mismo que [`build.minify`](#build-minify) para cliente, `'esbuild'` para SSR

Esta opción permite a los usuarios configurar la minificación de CSS específicamente en vez de usar por defecto `build.minify`, así se podrá trabajar la minificación para JS y CSS por separado. Vite usa `esbuild` por defecto para minimizar CSS. Establece la opción ' `'lightningcss'` para usar [Lightning CSS](https://lightningcss.dev/minification.html) en su lugar. Si se selecciona, se puede configurar utilizando [`css.lightningcss`](./shared-options.md#css-lightningcss).

## build.sourcemap

- **Tipo:** `boolean | 'inline' | 'hidden'`
- **Por defecto:** `false`

Genera mapas de fuentes de producción. Si es `true`, se creará un archivo de mapa fuente independiente. Si es `'inline'`, el mapa fuente se agregará al archivo de salida resultante como un URI de datos. `'hidden'` funciona como `true` excepto que se suprimen los comentarios del mapa fuente correspondiente en los archivos incluidos.

## build.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Personaliza directamente el paquete Rollup relacionado. Esto es lo mismo que las opciones que se pueden exportar desde un archivo de configuración de Rollup y se fusionarán con las opciones de Rollup internas de Vite. Consulta la [documentación de opciones de Rollup](https://rollupjs.org/configuration-options/) para obtener más detalles.

## build.commonjsOptions

- **Tipo:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Opciones para [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions

- **Tipo:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Relacionado:** [Importado dinámico](/guide/features#importacion-dinamica)

Opciones para [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib

- **Tipo:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **Relacionado:** [Modo Librería](/guide/build#modo-libreria)

Compilar como una librería. `entry` es obligatorio ya que la librería no puede usar HTML como punto de entrada. `name` es la variable global expuesta y es obligatoria cuando `formats` incluye `'umd'` o `'iife'`. Los valores predeterminados de `formats` son `['es', 'umd']`, o `['es', 'cjs']`, si se usan múltiples entradas.

`fileName` es el nombre del archivo de salida del paquete, que por defecto es el `"name"` en `package.json`. También puede definirse como una función que toma `format` y `entryName` como argumentos y devuelve el nombre del archivo.
Si tu paquete importa CSS, se puede usar `cssFileName` para especificar el nombre del archivo CSS de salida. Por defecto, toma el mismo valor que `fileName` si se establece como una cadena, de lo contrario también recae en el `"name"` en `package.json`.

```js
import { defineConfig } from 'vite'
export default defineConfig({
  compilar: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.license

- **Tipo:** `boolean | { fileName?: string }`
- **Por defecto:** `false`
 - **Relacionado:** [Licencia](/guide/features#licencia)

Cuando se configura en `true`, la compilación generará un archivo `.vite/license.md` que incluye las licencias de todas las dependencias empaquetadas. 

```json
[
  {
    "name": "dep-1",
    "version": "1.2.3",
    "identifier": "CC0-1.0",
    "text": "CC0 1.0 Universal\n\n..."
  },
  {
    "name": "dep-2",
    "version": "4.5.6",
    "identifier": "MIT",
    "text": "MIT License\n\n..."
  }
]
```

## build.manifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Integración del backend](/guide/backend-integration)

Indica si se debe generar un archivo de manifiesto que contenga un mapeo de nombres de archivos de recursos sin hash a sus versiones con hash, que luego puede ser utilizado por un framework de servidor para renderizar los enlaces correctos a los recursos.

Cuando el valor es una cadena, se usará como la ruta del archivo de manifiesto relativa a `build.outDir`. Cuando se establece en `true`, la ruta será `.vite/manifest.json`.

## build.ssrManifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

Indica si se debe generar un archivo de manifiesto para SSR (renderizado del lado del servidor) con el fin de determinar los enlaces a estilos y las directivas de precarga de recursos en producción.

Cuando el valor es una cadena, se usará como la ruta del archivo de manifiesto relativa a `build.outDir`. Cuando se establece en `true`, la ruta será `.vite/ssr-manifest.json`.

## build.ssr

- **Tipo:** `boolean | string`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

Produce la compilación orientada a SSR. El valor puede ser una cadena para especificar directamente la entrada SSR, o `true`, que requiere especificar la entrada SSR a través de `rollupOptions.input`.

## build.emitAssets

- **Tipo:** `boolean`
- **Por defecto:** `false`

Durante compilaciones que no son del cliente, los recursos estáticos no se emiten, ya que se asume que serán emitidos como parte de la compilación del cliente. Esta opción permite a los frameworks forzar su emisión en compilaciones de otros entornos. Es responsabilidad del framework combinar los recursos en un paso posterior a la compilación. Esta opción será reemplazada por `build.emitAssets` una vez que la API de Entorno sea estable.

## build.ssrEmitAssets

- **Tipo:** `boolean`
- **Por defecto:** `false`

Durante la compilación de SSR, los recursos estáticos no se emiten, ya que se supone que se emitirán como parte de la compilación del cliente. Esta opción permite que los frameworks fuercen su emisión tanto en el cliente como en la compilación SSR. Es responsabilidad del framework fusionar los recursos con un paso posterior a la compilación.

## build.minify

- **Tipo:** `boolean | 'terser' | 'esbuild'`
- **Por defecto:** `'esbuild'` para la compilación del cliente, `false` para el servidor de compilación SSR.

Configurar en `false` para deshabilitar la minificación, o especificar el minificador que se usará. El valor predeterminado es [esbuild](https://github.com/evanw/esbuild), que es 20 ~ 40 veces más rápido que terser y solo 1 ~ 2 % peor en compresión. [Pruebas de rendimiento](https://github.com/privatenumber/minification-benchmarks)

Ten en cuenta que la opción `build.minify` no minimiza los espacios en blanco cuando se usa el formato `'es'` en el modo librería, ya que elimina las anotaciones puras y rompe el tree-shaking.

Se debe instalar Terser cuando se configura como `'terser'`.

```sh
npm add -D terser
```

## build.terserOptions

- **Tipo:** `TerserOptions`

[Opciones de minimización](https://terser.org/docs/api-reference#minify-options) adicionales para pasar a Terser.

Además, también puedes pasar una opción `maxWorkers: number` para especificar el número máximo de workers que se generarán. El valor predeterminado es el número de CPU menos 1.

## build.write

- **Tipo:** `boolean`
- **Por defecto:** `true`

Configurar en `false` para deshabilitar la escritura del paquete en el disco. Esto se usa principalmente en [llamadas `build()` programáticas](/guide/api-javascript#build) donde se necesita más procesamiento posterior del paquete antes de escribir en el disco.

## build.emptyOutDir

- **Tipo:** `boolean`
- **Por defecto:** `true` si `outDir` está en `root`

De forma predeterminada, Vite vaciará `outDir` en la compilación si está dentro de la raíz del proyecto. Emitirá una advertencia si `outDir` está fuera de la raíz para evitar la eliminación accidental de archivos importantes. Puedes establecer explícitamente esta opción para suprimir la advertencia. Esto también está disponible a través de la línea de comandos como `--emptyOutDir`.

## build.copyPublicDir

- **Experimental** [Hacer Comentarios](https://github.com/vitejs/vite/discussions/13807)
- **Tipo:** `boolean`
- **Por defecto:** `true`

Por defecto, Vite copiará los archivos que están en `publicDir` dentro de `outDir` en la compilación. Configurar `false` para deshabilitar este comportamiento.

## build.reportCompressedSize

- **Tipo:** `boolean`
- **Por defecto:** `true`

Habilita/deshabilita los informes de tamaño comprimido con gzip. La compresión de archivos de salida grandes puede ser lenta, por lo que deshabilitarla puede aumentar el rendimiento de la compilación para proyectos grandes.

## build.chunkSizeWarningLimit

- **Tipo:** `number`
- **Por defecto:** `500`

Límite para advertencias de tamaño de fragmento (en kB). Se compara con el tamaño del fragmento sin comprimir, ya que [el tamaño de JavaScript en sí está relacionado con el tiempo de ejecución](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **Tipo:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **Por defecto:** `null`

Configurar en `{}` para habilitar el observador de Rollup. Esto se usa principalmente en casos que involucran plugins de solo compilación o procesos de integración.

::: warning Uso de Vite en el Subsistema de Windows para Linux (WSL) 2

Hay casos en los que la observación del sistema de archivos no funciona con WSL2.
Ver [`server.watch`](./server-options.md#server-watch) para más detalles.

:::
