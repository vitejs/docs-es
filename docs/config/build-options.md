# Opciones para build

## build.target

- **Tipo:** `string | string[]`
- **Por defecto:** `'modules'`
- **Relacionado:** [Compatibilidad de navegadores](/guide/build#compatibilidad-de-navegadores)

  El objetivo de compatibilidad del navegador para el paquete final. El valor predeterminado es un valor especial de Vite, `'modules'`, que apunta a navegadores con [soporte de módulos ES nativo](https://caniuse.com/es6-module) y [soporte de importación ESM nativo](https://caniuse.com/es6-module-dynamic-import).

  Otro valor especial es `'esnext'`, el cual asume el soporte nativo de importaciones dinámicas y transpilará lo menos posible:

  - Si la opción [`build.minify`](#build-minify) es `'terser'`, `'esnext'` se verá obligado a bajar a `'es2021'`.
  - En otros casos, no realizará ninguna transpilación.

  La transformación se realiza con esbuild y el valor debe ser una [opción de destino de esbuild](https://esbuild.github.io/api/#target) válida. Los objetivos personalizados pueden ser una versión ES (por ejemplo, `es2015`), un navegador con versión (por ejemplo, `chrome58`) o un array de varias cadenas de destino.

  Ten en cuenta que la compilación fallará si el código contiene funciones que esbuild no puede transpilar de manera segura. Consulta la [documentación de esbuild](https://esbuild.github.io/content-types/#javascript) para obtener más detalles.

## build.polyfillModulePreload

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Inyecta automáticamente el [polyfill de precarga del módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

  Si se coloca en `true`, el polyfill se inyecta automáticamente en el módulo proxy de cada entrada `index.html`. Si la compilación está configurada para usar una entrada personalizada que no sea html a través de `build.rollupOptions.input`, entonces es necesario importar manualmente el polyfill en su entrada personalizada:

  ```js
  import 'vite/modulepreload-polyfill'
  ```

  Nota: el polyfill **no** se aplica al [Modo Librería](/guide/build#modo-libreria). Si necesitas que se soporten navegadores sin importación dinámica nativa, probablemente deberías evitar usarlo en tu librería.

## build.outDir

- **Tipo:** `string`
- **Por defecto:** `dist`

  Especifica el directorio de salida (relativo a [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto)).

## build.assetsDir

- **Tipo:** `string`
- **Por defecto:** `assets`

  Especifica el directorio en el que se alojarán los recursos generados (en relación con `build.outDir`).

## build.assetsInlineLimit

- **Tipo:** `number`
- **Por defecto:** `4096` (4kb)

  Los recursos importados o a los que se hace referencia que son más pequeños que este umbral se insertarán como URL base64 para evitar solicitudes http adicionales. Configurar en `0` para deshabilitar la inserción por completo.

  ::: tip Nota
  Si especificas `build.lib`, `build.assetsInlineLimit` se ignorará y los recursos siempre serán insertados, independientemente del tamaño del archivo.
  :::

## build.cssCodeSplit

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Habilita/deshabilita la división de código CSS. Cuando está habilitado, el CSS importado en fragmentos asíncronos se insertará en el propio fragmento asíncrono y cuando se cargue el fragmento.

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

## build.sourcemap

- **Tipo:** `boolean | 'inline' | 'hidden'`
- **Por defecto:** `false`

  Genera mapas de fuentes de producción. Si es `true`, se creará un archivo de mapa fuente independiente. Si es `'inline'`, el mapa fuente se agregará al archivo de salida resultante como un URI de datos. `'hidden'` funciona como `true` excepto que se suprimen los comentarios del mapa fuente correspondiente en los archivos incluidos.

## build.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Personaliza directamente el paquete Rollup relacionado. Esto es lo mismo que las opciones que se pueden exportar desde un archivo de configuración de Rollup y se fusionarán con las opciones de Rollup internas de Vite. Consulta la [documentación de opciones de Rollup](https://rollupjs.org/guide/en/#big-list-of-options) para obtener más detalles.

## build.commonjsOptions

- **Tipo:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  Opciones para [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions

- **Tipo:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Relacionado:** [Importado dinámico](/guide/features#importacion-dinamica)

  Opciones para [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib

- **Tipo:** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat) => string) }`
- **Relacionado:** [Modo Librería](/guide/build#modo-libreria)

  Compilar como una librería. Se requiere `entry` ya que la librería no puede usar HTML como entrada. `name` es la variable global expuesta y se requiere cuando `formats` incluye `'umd'` o `'iife'`. Por defecto los `formats` son `['es', 'umd']`. `fileName` es el nombre de la salida del archivo del paquete, por defecto `fileName` es la opción de nombre del package.json, también se puede definir como una función que toma el `format` como argumento.

## build.manifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Integración del backend](/guide/backend-integration)

  Cuando se coloca en `true`, la compilación también generará un archivo `manifest.json` que contiene una asignación de nombres de archivo de recursos sin hash a sus versiones hash, que luego puede ser utilizado por un marco de trabajo orientado a servidor para representar los enlaces de recursos correctos.

## build.ssrManifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

  Cuando se coloca en `true`, la compilación también generará un manifiesto SSR para determinar los enlaces de estilo y las directivas de precarga de recursos en producción.

## build.ssr

- **Tipo:** `boolean | string`
- **Por defecto:** `undefined`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

  Produce la compilación orientada a SSR. El valor puede ser una cadena para especificar directamente la entrada SSR, o `true`, que requiere especificar la entrada SSR a través de `rollupOptions.input`.

## build.minify

- **Tipo:** `boolean | 'terser' | 'esbuild'`
- **Por defecto:** `'esbuild'`

  Configurar en `false` para deshabilitar la minificación, o especificar el minificador que se usará. El valor predeterminado es [esbuild](https://github.com/evanw/esbuild), que es 20 ~ 40 veces más rápido que terser y solo 1 ~ 2 % peor en compresión. [Pruebas de rendimiento](https://github.com/privatenumber/minification-benchmarks)

  Ten en cuenta que la opción `build.minify` no está disponible cuando se usa el formato `'es'` en modo lib.

  Se debe instalar Terser cuando se configura como `'terser'`.

  ```sh
  npm add -D terser
  ```

## build.terserOptions

- **Tipo:** `TerserOptions`

  [Opciones de minimización](https://terser.org/docs/api-reference#minify-options) adicionales para pasar a Terser.

## build.write

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Configurar en `false` para deshabilitar la escritura del paquete en el disco. Esto se usa principalmente en [llamadas `build()` programáticas](/guide/api-javascript#build) donde se necesita más procesamiento posterior del paquete antes de escribir en el disco.

## build.emptyOutDir

- **Tipo:** `boolean`
- **Por defecto:** `true` si `outDir` está en `root`

  De forma predeterminada, Vite vaciará `outDir` en la compilación si está dentro de la raíz del proyecto. Emitirá una advertencia si `outDir` está fuera de la raíz para evitar la eliminación accidental de archivos importantes. Puedes establecer explícitamente esta opción para suprimir la advertencia. Esto también está disponible a través de la línea de comandos como `--emptyOutDir`.

## build.reportCompressedSize

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Habilita/deshabilita los informes de tamaño comprimido con gzip. La compresión de archivos de salida grandes puede ser lenta, por lo que deshabilitarla puede aumentar el rendimiento de la compilación para proyectos grandes.

## build.chunkSizeWarningLimit

- **Tipo:** `number`
- **Por defecto:** `500`

  Límite para advertencias de tamaño de fragmento (en kbs).

## build.watch

- **Tipo:** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **Por defecto:** `null`

  Configurar en `{}` para habilitar el observador de Rollup. Esto se usa principalmente en casos que involucran complementos de solo compilación o procesos de integración.