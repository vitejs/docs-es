# Opciones para build

## build.target

- **Tipo:** `string | string[]`
- **Por defecto:** `'modules'`
- **Relacionado:** [Compatibilidad de navegadores](/guide/build#compatibilidad-de-navegadores)

El objetivo de compatibilidad del navegador para el paquete final. El valor predeterminado es un valor especial de Vite, `'modules'`, que apunta a navegadores con [soporte de módulos ES nativo](https://caniuse.com/es6-module), [soporte de importación ESM nativo](https://caniuse.com/es6-module-dynamic-import) y soporte para [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Vite reemplazará `'modules'` con `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']`

Otro valor especial es `'esnext'`, el cual asume el soporte nativo de importaciones dinámicas y transpilará lo menos posible:

- Si la opción [`build.minify`](#build-minify) es `'terser'` y la versión de Terser instalada es inferior a la 5.16.0, `'esnext'` se verá obligado a bajar a `'es2021'`.
- En otros casos, no realizará ninguna transpilación.

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
    importer: string
  },
) => string[]
```

Se llamará a la función `resolveDependencies` para cada importación dinámica con una lista de los fragmentos de los que depende, y también se llamará para cada fragmento importado en los archivos de entrada HTML. Se puede devolver un nuevo array de dependencias con estas dependencias filtradas, u otras más inyectadas, y sus rutas modificadas. Las rutas de `deps` son relativas a `build.outDir`. Se permite tambien retornar una ruta relativa al `hostId` para `hostType === 'js'`, en cuyo caso se usa `new URL(dep, import.meta.url)` para obtener una ruta absoluta al inyectar la precarga de este módulo en el encabezado HTML.

<!-- prettier-ignore-start -->
```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
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
<!-- prettier-ignore-end -->

````

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
- **Por defecto:** lo mismo que [`build.minify`](#build-minify)

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

- **Tipo:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string) }`
- **Relacionado:** [Modo Librería](/guide/build#modo-libreria)

Compilar como una librería. Se requiere `entry` ya que la librería no puede usar HTML como archivo de entrada. `name` es la variable global expuesta y se requiere cuando `formats` incluye `'umd'` o `'iife'`. Por defecto `formats` es `['es', 'umd']`, o `['es', 'cjs']`, si se usan multiples archivos de entrada. `fileName` es el nombre de la salida del archivo del paquete, por defecto `fileName` es la opción de nombre del package.json, también se puede definir como una función que toma el `format` y `entryAlias` como argumentos.

## build.manifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Integración del backend](/guide/backend-integration)

Cuando se coloca en `true`, la compilación también generará un archivo `.vite/manifest.json` que contiene una asignación de nombres de archivo de recursos sin hash a sus versiones hash, que luego puede ser utilizado por un marco de trabajo orientado a servidor para representar los enlaces de recursos correctos.

## build.ssrManifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

Cuando se coloca en `true`, la compilación también generará un manifiesto SSR para determinar los enlaces de estilo y las directivas de precarga de recursos en producción.

## build.ssr

- **Tipo:** `boolean | string`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

Produce la compilación orientada a SSR. El valor puede ser una cadena para especificar directamente la entrada SSR, o `true`, que requiere especificar la entrada SSR a través de `rollupOptions.input`.

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
````

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

Configurar en `{}` para habilitar el observador de Rollup. Esto se usa principalmente en casos que involucran complementos de solo compilación o procesos de integración.

::: warning Uso de Vite en el Subsistema de Windows para Linux (WSL) 2

Hay casos en los que la observación del sistema de archivos no funciona con WSL2.
Ver [`server.watch`](./server-options.md#server-watch) para más detalles.

:::
