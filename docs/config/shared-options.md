# Opciones compartidas

## root

- **Tipo:** `string`
- **Por defecto:** `process.cwd()`

  Directorio raíz del proyecto (donde se encuentra `index.html`). Puede ser una ruta absoluta o una ruta relativa a la ubicación al directorio de trabajo actual.

  Consulta [Raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto) para obtener más detalles.

## base

- **Tipo:** `string`
- **Por defecto:** `/`

  Ruta pública base cuando se sirve en desarrollo o producción. Los valores válidos incluyen:

  - Nombre de ruta absoluta URL, ejemplo, `/foo/`
  - URL completa, ejemplo, `https://foo.com/`
  - Cadena vacía o `./` (para implementación incrustada)

  Consulta [Ruta base pública](/guide/build#ruta-base-publica) para obtener más detalles.

## mode

- **Tipo:** `string`
- **Por defecto:** `'development'` para serve, `'production'` para build

  Especificar esto en la configuración sobreescribe el modo predeterminado para **serve y build**. Este valor también se puede sobreescribir a través de la opción `--mode` de la línea de comando.

  Consulta [Modos y variables de entorno](/guide/env-and-mode) para obtener más detalles.

## define

- **Tipo:** `Record<string, any>`

  Define constantes globales de reemplazo. Las entradas se definirán como globales durante el desarrollo y se reemplazarán estáticamente durante la compilación.

  - A partir de `2.0.0-beta.70`, los valores de cadena se utilizarán como expresiones sin procesar, por lo que si se define una constante de cadena, debe citarse explícitamente (por ejemplo, con `JSON.stringify`).

  - Para ser coherente con el [comportamiento de esbuild](https://esbuild.github.io/api/#define), las expresiones deben ser un objeto JSON (nulo, booleano, número, cadena, array u object) o un solo identificador.

  - Los reemplazos se realizan solo cuando la coincidencia no está rodeada por otras letras, números, `_` o `$`

  ::: warning
  Debido a que esto se implementa como reemplazos de texto sencillos sin ningún análisis de sintaxis, recomendamos usar `define` solo para CONSTANTES.

  Por ejemplo, `process.env.FOO` y `__APP_VERSION__` encajan bien. Pero `process` o `global` no se debe poner en esta opción. En su lugar, las variables se pueden ajustar o polyfill-arse.
  :::

  ::: tip NOTA
  Para los usuarios de TypeScript, asegúrense de agregar las declaraciones de tipo en el archivo `env.d.ts` o `vite-env.d.ts` para obtener comprobaciones de tipos e Intellisense.

  Ejemplo:

  ```ts
  // vite-env.d.ts
  declare const __APP_VERSION__: string
  ```

  :::

  ::: tip NOTA
  Dado que dev y build implementan `define` de manera diferente, debemos evitar algunos casos de uso para evitar inconsistencias.

  Ejemplo:

  ```js
  const obj = {
    __NAME__, // No definir nombres de propiedades de objetos abreviadas
    __KEY__: value, // No definir clave de objeto
  }
  ```

  :::

## plugins

- **Tipo:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

  Array de complementos a usar. Los complementos falsos se ignoran y los arrays de complementos se simplifican.
  Si se devuelve una promesa, se resolvería antes de ejecutarse. Consulta la [API de complementos](/guide/api-plugin) para obtener más detalles sobre los complementos de Vite.

## publicDir

- **Tipo:** `string | false`
- **Por defecto:** `"public"`

  Directorio para servir recursos estáticos simples. Los archivos en este directorio se sirven en `/` durante el desarrollo y se copian en la raíz de `outDir` durante la compilación, y siempre se sirven o copian tal cual sin transformación. El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto.

  Definir `publicDir` como `false` deshabilita esta característica.

  Consulta [La carpeta `public`](/guide/assets#la-carpeta-public) para obtener más detalles.

## cacheDir

- **Tipo:** `string`
- **Por defecto:** `"node_modules/.vite"`

  Directorio para guardar archivos de caché. Los archivos en este directorio son dependencias preempaquetadas o algunos otros archivos de caché generados por vite, que pueden mejorar el rendimiento. Puedes usar el indicador `--force` o eliminar manualmente el directorio para regenerar los archivos de caché. El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto. Por defecto a `.vite` cuando no se detecta ningún package.json.

## resolve.alias

- **Tipo:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

  Se pasará a `@rollup/plugin-alias` como su [opción de entradas](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Puede ser un objeto o un array de pares `{find, replacement, customResolver}`.

  Cuando crees alias en las rutas del sistema de archivos, utiliza siempre rutas absolutas. Los valores de alias relativos se utilizarán tal cual y no se resolverán en rutas del sistema de archivos.

  Se puede lograr una resolución personalizada más avanzada a través de [complementos](/guide/api-plugin).

  :::warning Uso con SSR
  Si has configurado alias para [dependencias externalizadas de SSR](/guide/ssr.md#ssr-externals), es posible que desees crear un alias para los paquetes `node_modules` reales. Tanto [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) como [pnpm](https://pnpm.js.org/en/aliases) admiten la creación de alias a través del prefijo `npm:`.

## resolve.dedupe

- **Tipo:** `string[]`

  Si tienes copias duplicadas de la misma dependencia en tu aplicación (probablemente debido a hoisting o paquetes vinculados en monorepos), usa esta opción para obligar a Vite a resolver siempre las dependencias enumeradas en la misma copia (desde la raíz del proyecto).

  :::warning SSR + ESM
  Para compilaciones de SSR, la deduplicación no funciona para las salidas de compilación de ESM configuradas desde `build.rollupOptions.output`. Una solución consiste en utilizar las salidas de compilación de CJS hasta que ESM tenga una mejor compatibilidad con complementos para la carga de módulos.
  :::

## resolve.conditions

- **Tipo:** `string[]`

  Condiciones adicionales permitidas al resolver las [exportaciones condicionales](https://nodejs.org/api/packages.html#packages_conditional_exports) desde un paquete.

  Un paquete con exportaciones condicionales puede tener el siguiente campo `exports` en su `package.json`:

  ```json
  {
    "exports": {
      ".": {
        "import": "./index.esm.js",
        "require": "./index.cjs.js"
      }
    }
  }
  ```

  Aquí, `import` y `require` son "condiciones". Las condiciones se pueden anidar y deben especificarse de la más a la menos específica.

  Vite tiene una lista de "condiciones permitidas" y coincidirá con la primera condición que está en la lista permitida. Las condiciones permitidas por defecto son: `import`, `module`, `browser`, `default` y `production/development` dependiendo del modo actual. La opción de configuración `resolve.conditions` permite especificar condiciones adicionales permitidas.

  :::warning Resolviendo exportaciones de rutas secundarias
  Las claves de exportación que terminan en "/" están obsoletas en Node y es posible que no funcionen bien. Comunícate con el autor del paquete para usar [patrones de subruta `*`](https://nodejs.org/api/packages.html#package-entry-points) en su lugar.
  :::

## resolve.mainFields

- **Tipo:** `string[]`
- **Por defecto:** `['module', 'jsnext:main', 'jsnext']`

  Lista de campos en `package.json` para probar al resolver el punto de entrada de un paquete. Ten en cuenta que esto tiene menos prioridad que las exportaciones condicionales resueltas desde el campo `exports`: si un punto de entrada se resuelve con éxito desde `exports`, el campo principal se ignorará.

## resolve.browserField

- **Tipo:** `boolean`
- **Por defecto:** `true`
- **Obsoleto**

  Permite habilitar la resolución en el campo `browser`.

  En el futuro, el valor predeterminado de `resolve.mainFields` será `['browser', 'module', 'jsnext:main', 'jsnext']` y esta opción se eliminará.

## resolve.extensions

- **Tipo:** `string[]`
- **Por defecto:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

  Lista de extensiones de archivo para probar las importaciones que omiten extensiones. Ten en cuenta que **NO** se recomienda omitir extensiones para tipos de importación personalizados (p. ej., `.vue`), ya que puede interferir con el IDE y la compatibilidad de tipos.

## resolve.preserveSymlinks

- **Tipo:** `boolean`
- **Por defecto:** `false`

  Habilitar esta configuración hace que vite determine la identidad del archivo por la ruta del archivo original (es decir, la ruta sin seguir los enlaces simbólicos) en lugar de la ruta real del archivo (es decir, la ruta después de seguir los enlaces simbólicos).

- **Relacionado:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## css.modules

- **Tipo:**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: null
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | null
  }
  ```

  Configura el comportamiento de los módulos CSS. Las opciones se pasan a [postcss-modules](https://github.com/css-modules/postcss-modules).

## css.postcss

- **Tipo:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

  Configuración de PostCSS inline o un directorio personalizado para buscar la configuración de PostCSS (el valor predeterminado es la raíz del proyecto).

  Para la configuración de PostCSS inline, espera el mismo formato que `postcss.config.js`. Pero para la propiedad `plugins`, solo se puede usar [formato de array](https://github.com/postcss/postcss-load-config/blob/main/README.md#array).

  La búsqueda se realiza mediante [postcss-load-config](https://github.com/postcss/postcss-load-config) y solo se cargan los nombres de archivos de configuración admitidos.

  Ten en cuenta que si se proporciona una configuración inline, Vite no buscará otras fuentes de configuración de PostCSS.

## css.preprocessorOptions

- **Tipo:** `Record<string, object>`

  Especifica las opciones a pasar a los preprocesadores de CSS. Las extensiones de archivo se utilizan como claves para las opciones. Ejemplo:

  ```js
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`,
        },
        styl: {
          additionalData: `$injectedColor ?= orange`,
        },
      },
    },
  })
  ```

## css.devSourcemap

- **Experimental**
- **Tipo:** `boolean`
- **Por defecto:** `false`

  Habilita los mapas de origen durante el desarrollo.

## json.namedExports

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Admite importaciones con nombre desde archivos `.json`.

## json.stringify

- **Tipo:** `boolean`
- **Por defecto:** `false`

  Si se coloca en `true`, el JSON importado se transformará en `export default JSON.parse("...")`, que tiene un rendimiento significativamente mayor que los objetos literales, especialmente cuando el archivo JSON es grande.

  Habilitar esto deshabilita las importaciones con nombre.

## esbuild

- **Tipo:** `ESBuildOptions | false`

  `ESBuildOptions` amplía [las opciones de transformación propias de esbuild](https://esbuild.github.io/api/#transform-api). El caso de uso más común es personalizar JSX:

  ```js
  export default defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  })
  ```

  De forma predeterminada, esbuild se aplica a los archivos `ts`, `jsx` y `tsx`. Puedes personalizar esto con `esbuild.include` y `esbuild.exclude`, que pueden ser una expresión regular, un patrón [picomatch](https://github.com/micromatch/picomatch#globbing-features) o una array de cualquier valor.

  Además, también puedes usar `esbuild.jsxInject` para inyectar automáticamente importaciones auxiliares de JSX para cada archivo transformado por esbuild:

  ```js
  export default defineConfig({
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
  })
  ```

  Cuando [`build.minify`](./build-options.md#build-minify) es `true`, todas las optimizaciones de minify se aplican de manera predeterminada. Para deshabilitar [ciertos aspectos](https://esbuild.github.io/api/#minify), configura cualquiera de las opciones `esbuild.minifyIdentifiers`, `esbuild.minifySyntax` o `esbuild.minifyWhitespace` en `false `. Ten en cuenta que la opción `esbuild.minify` no se puede usar para anular `build.minify`.

  Colocarlo en `false` deshabilita las transformaciones de esbuild.

## assetsInclude

- **Tipo:** `string | RegExp | (string | RegExp)[]`
- **Relacionado:** [Gestión de recursos estáticos](/guide/assets)

  Especifica [patrones de picomatch](https://github.com/micromatch/picomatch#globbing-features) adicionales para ser tratados como recursos estáticos para que:

  - Sean excluidos de la canalización de transformación del complemento cuando se haga referencia a ellos desde HTML o se soliciten directamente a través de `fetch` o XHR.

  - Importarlos desde JS devolverá su cadena de URL resuelta (esto se puede sobrescribir si tiene un complemento `enforce: 'pre'` para manejar el tipo de recursos de manera diferente).

  La lista de tipos de recursos integrados se puede encontrar [aquí](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

  **Ejemplo:**

  ```js
  export default defineConfig({
    assetsInclude: ['**/*.gltf'],
  })
  ```

## logLevel

- **Tipo:** `'info' | 'warn' | 'error' | 'silent'`

  Ajusta la verbosidad de salida de la consola. Por defecto es `'info'`.

## clearScreen

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Colocalo en `false` para evitar que Vite borre la pantalla del terminal al registrar ciertos mensajes. A través de la línea de comandos, usa `--clearScreen false`.

## envDir

- **Tipo:** `string`
- **Por defecto:** `root`

  El directorio desde el que se cargan los archivos `.env`. Puede ser una ruta absoluta o una ruta relativa a la raíz del proyecto.

  Entra [aquí](/guide/env-and-mode#archivos-env) para obtener más información sobre los archivos de entorno.

## envPrefix

- **Tipo:** `string | string[]`
- **Por defecto:** `VITE_`

  Las variables de entorno que comienzan con `envPrefix` se expondrán al código fuente de tu cliente a través de import.meta.env.

  :::warning NOTAS DE SEGURIDAD
  `envPrefix` no debe configurarse como `''`, esto expondrá todas tus variables env y provocará una filtración inesperada de información confidencial. De todas formas, Vite arrojará un error al detectar `''`.
  :::

## appType

- **Tipo:** `'spa' | 'mpa' | 'custom'`
- **Por defecto:** `'spa'`

  Si tu aplicación es una aplicación de página única (SPA), una [aplicación multipáginas (MPA)](../guide/build#multi-page-app) o una aplicación personalizada (SSR y marcos con manejo de HTML personalizado):

  - `'spa'`: incluye el middleware de reserva de SPA y configura [sirv](https://github.com/lukeed/sirv) con `single: true` en la vista previa
  - `'mpa'`: solo incluye middleware HTML no SPA
  - `'custom'`: no incluye middleware HTML

Obtén más información en la [guía SSR](/guide/ssr#vite-cli) de Vite. Relacionado: [`server.middlewareMode`](./server-options#server-middlewaremode).
