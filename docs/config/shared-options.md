# Opciones compartidas

A menos que se indique lo contrario, las opciones en esta sección se aplican a desarrollo, compilación y vista previa.

## root

- **Tipo:** `string`
- **Por defecto:** `process.cwd()`

Directorio raíz del proyecto (donde se encuentra `index.html`). Puede ser una ruta absoluta o una ruta relativa a la ubicación al directorio de trabajo actual.

Consulta [Raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto) para obtener más detalles.

## base

- **Tipo:** `string`
- **Por defecto:** `/`
- **Relacionado:** [`server.origin`](/config/server-options.md#server-origin)

Ruta pública base cuando se sirve en desarrollo o producción. Los valores válidos incluyen:

- Nombre de ruta absoluta URL, ejemplo, `/foo/`
- URL completa, por ejemplo, `https://bar.com/foo/` (La parte del origen no se utilizará en el desarrollo asi que el valor es el mismo que `/foo/`)
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

Vite usa [esbuild define](https://esbuild.github.io/api/#define) para realizar reemplazos, por lo que las expresiones de valor deben ser una cadena que contenga un valor serializable JSON (null, boolean, number, string, array, u object) o un único identificador. Para valores que no son cadenas, Vite los convertirá automáticamente en una cadena con `JSON.stringify`.

**Ejemplo:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip NOTA
Para usuarios de TypeScript, asegúrense de agregar las declaraciones de tipo en el archivo `env.d.ts` o `vite-env.d.ts` para obtener comprobaciones de tipos e Intellisense.
:::

## plugins

- **Tipo:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Array de plugins a usar. Los plugins falsos se ignoran y los arrays de plugins se simplifican.
Si se devuelve una promesa, se resolvería antes de ejecutarse. Consulta la [API de plugins](/guide/api-plugin) para obtener más detalles sobre los plugins de Vite.

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

Se puede lograr una resolución personalizada más avanzada a través de [plugins](/guide/api-plugin).

:::warning Uso con SSR
Si has configurado alias para [dependencias externalizadas de SSR](/guide/ssr.md#ssr-externals), es posible que desees crear un alias para los paquetes `node_modules` reales. Tanto [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) como [pnpm](https://pnpm.io/aliases/) admiten la creación de alias a través del prefijo `npm:`.

## resolve.dedupe

- **Tipo:** `string[]`

Si tienes copias duplicadas de la misma dependencia en tu aplicación (probablemente debido a hoisting o paquetes vinculados en monorepos), usa esta opción para obligar a Vite a resolver siempre las dependencias enumeradas en la misma copia (desde la raíz del proyecto).

:::warning SSR + ESM
Para compilaciones de SSR, la deduplicación no funciona para las salidas de compilación de ESM configuradas desde `build.rollupOptions.output`. Una solución consiste en utilizar las salidas de compilación de CJS hasta que ESM tenga una mejor compatibilidad con plugins para la carga de módulos.
:::

## resolve.conditions

- **Tipo:** `string[]`
- **Por defecto:** `['module', 'browser', 'development|production']` (`defaultClientConditions`)

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

`development|production` es un valor especial que se reemplaza con `production` o `development` dependiendo del valor de `process.env.NODE_ENV`. Se reemplaza con `production` cuando `process.env.NODE_ENV === 'production'` y con `development` en caso contrario.

Ten en cuenta que las condiciones `import`, `require`, `default` siempre se aplican si se cumplen los requisitos.

:::warning Resolviendo exportaciones de rutas secundarias
Las claves de exportación que terminan en "/" están obsoletas en Node y es posible que no funcionen bien. Comunícate con el autor del paquete para usar [patrones de subruta `*`](https://nodejs.org/api/packages.html#package-entry-points) en su lugar.
:::

## resolve.mainFields

- **Tipo:** `string[]`
- **Por defecto:** `['browser', 'module', 'jsnext:main', 'jsnext']` (`defaultClientMainFields`)

Lista de campos en `package.json` para probar al resolver el punto de entrada de un paquete. Ten en cuenta que esto tiene menos prioridad que las exportaciones condicionales resueltas desde el campo `exports`: si un punto de entrada se resuelve con éxito desde `exports`, el campo principal se ignorará.

## resolve.extensions

- **Tipo:** `string[]`
- **Por defecto:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

Lista de extensiones de archivo para probar las importaciones que omiten extensiones. Ten en cuenta que **NO** se recomienda omitir extensiones para tipos de importación personalizados (p. ej., `.vue`), ya que puede interferir con el IDE y la compatibilidad de tipos.

## resolve.preserveSymlinks

- **Tipo:** `boolean`
- **Por defecto:** `false`

Habilitar esta configuración hace que vite determine la identidad del archivo por la ruta del archivo original (es decir, la ruta sin seguir los enlaces simbólicos) en lugar de la ruta real del archivo (es decir, la ruta después de seguir los enlaces simbólicos).

- **Relacionado:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **Tipo:** `string`
- **Relacionado:** [Política de seguridad de contenido (CSP)](/guide/features#content-security-policy-csp)

Un placeholder de valor de nonce que se utilizará al generar etiquetas de script/style. Establecer este valor también generará una etiqueta meta con el valor de nonce.

## css.modules

- **Tipo:**

```ts
interface CSSModulesOptions {
  getJSON?: (
    cssFileName: string,
    json: Record<string, string>,
    outputFileName: string
  ) => void
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: RegExp[]
  exportGlobals?: boolean
  generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
  hashPrefix?: string
  /**
   * default: undefined
   */
  localsConvention?:
    | 'camelCase'
    | 'camelCaseOnly'
    | 'dashes'
    | 'dashesOnly'
    | ((
        originalClassName: string,
        generatedClassName: string,
        inputFile: string
      ) => string)
}
```

Configura el comportamiento de los módulos CSS. Las opciones se pasan a [postcss-modules](https://github.com/css-modules/postcss-modules).

Esta opción no tiene ningún efecto cuando se utiliza [Lightning CSS](../guide/features.md#lightning-css). Si está habilitada, se debe usar [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) en su lugar.

## css.postcss

- **Tipo:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Configuración de PostCSS inline o un directorio personalizado para buscar la configuración de PostCSS (el valor predeterminado es la raíz del proyecto).

Para la configuración de PostCSS inline, espera el mismo formato que `postcss.config.js`. Pero para la propiedad `plugins`, solo se puede usar [formato de array](https://github.com/postcss/postcss-load-config/blob/main/README.md#array).

La búsqueda se realiza mediante [postcss-load-config](https://github.com/postcss/postcss-load-config) y solo se cargan los nombres de archivos de configuración admitidos. Los archivos de configuración fuera de la raíz del espacio de trabajo (o de la [raíz del proyecto](/guide/#index-html-and-project-root) si no se encuentra un espacio de trabajo) no se buscan por defecto. Puedes especificar una ruta personalizada fuera de la raíz para cargar el archivo de configuración específico si es necesario.

Ten en cuenta que si se proporciona una configuración inline, Vite no buscará otras fuentes de configuración de PostCSS.

## css.preprocessorOptions

- **Tipo:** `Record<string, object>`

Especifica las opciones a pasar a los preprocesadores de CSS. Las extensiones de archivo se utilizan como claves para las opciones. Las opciones admitidas para cada preprocesador se pueden encontrar en su documentación respectiva:

- `sass`/`scss`:
  - Selecciona la API de Sass a usar con `api: "modern-compiler" | "modern" | "legacy"` (por defecto `"modern-compiler"` si se tiene instalado `sass-embedded`, de lo contrario `"modern"`). Para obtener el mejor rendimiento, se recomienda usar `api: "modern-compiler"` con el paquete `sass-embedded`. La API `"legacy"` está obsoleta y se eliminará en Vite 7.
  - [Opciones (moderna)](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
  - [Opciones (legacy)](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less`: [Opciones](https://lesscss.org/usage/#less-options).
- `styl`/`stylus`: Solo se soporta [`define`](https://stylus-lang.com/docs/js.html#define-name-node), el cual puede ser pasado como un objeto.

**Ejemplo**:

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
    scss: {
      api: 'modern', // o "legacy"
      importers: [
        // ...
      ],
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **Tipo:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

Esta opción se puede utilizar para inyectar código adicional para cada contenido de estilo. Ten en cuenta que si incluyes estilos reales y no solo variables, esos estilos se duplicarán en el paquete final.

**Ejemplo:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers

- **Experimental:** [Hacer comentarios](https://github.com/vitejs/vite/discussions/15835)
- **Tipo:** `number | true`
- **Por defecto:** `0` (no crea ningún worker y se ejecuta en el hilo principal)

Si se configura esta opción, los preprocesadores CSS se ejecutarán en los workers cuando sea posible. `true` significa el número de CPU menos 1.

## css.devSourcemap

- **Experimental** [Hacer comentarios](https://github.com/vitejs/vite/discussions/13845)
- **Tipo:** `boolean`
- **Por defecto:** `false`

Habilita los mapas de origen durante el desarrollo.

## css.transformer

- **Experimental** [Hacer Comentarios](https://github.com/vitejs/vite/discussions/13835)
- **Tipo:** `'postcss' | 'lightningcss'`
- **Por defecto:** `'postcss'`

Selecciona el motor utilizado para el procesamiento de CSS. Consulta [Lightning CSS](../guide/features.md#lightning-css) para obtener más información.

:::info Duplicados de `@import`
Ten en cuenta que postcss (postcss-import) tiene un comportamiento diferente con los `@import` duplicados en comparación con los navegadores. Consulta [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462).
:::

## css.lightningcss

- **Experimental** [Hacer Comentarios](https://github.com/vitejs/vite/discussions/13835)
- **Type:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
targets?: Targets
include?: Features
exclude?: Features
drafts?: Drafts
nonStandard?: NonStandard
pseudoClasses?: PseudoClasses
unusedSymbols?: string[]
cssModules?: CSSModulesConfig,
// ...
}
```

Configura Lightning CSS. Todas las opciones de transformación completas se pueden encontrar en [el repositorio de Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Tipo:** `boolean`
- **Por defecto:** `true`

Admite importaciones con nombre desde archivos `.json`.

## json.stringify

- **Tipo:** `boolean | 'auto'`
- **Por defecto:** `'auto'`

Si se coloca en `true`, el JSON importado se transformará en `export default JSON.parse("...")`, que tiene un rendimiento significativamente mayor que los objetos literales, especialmente cuando el archivo JSON es grande.

Si se configura en `'auto'`, los datos se convertirán en una cadena solo si [los datos son mayores de 10 kB](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **Tipo:** `ESBuildOptions | false`

`ESBuildOptions` amplía [las opciones de transformación propias de esbuild](https://esbuild.github.io/api/#transform). El caso de uso más común es personalizar JSX:

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

- Sean excluidos de la canalización de transformación del plugin cuando se haga referencia a ellos desde HTML o se soliciten directamente a través de `fetch` o XHR.

- Importarlos desde JS devolverá su cadena de URL resuelta (esto se puede sobrescribir si tiene un plugin `enforce: 'pre'` para manejar el tipo de recursos de manera diferente).

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

## customLogger

- **Tipo:**

```ts
interface Logger {
  info(msg: string, options?: LogOptions): void
  warn(msg: string, options?: LogOptions): void
  warnOnce(msg: string, options?: LogOptions): void
  error(msg: string, options?: LogErrorOptions): void
  clearScreen(type: LogType): void
  hasErrorLogged(error: Error | RollupError): boolean
  hasWarned: boolean
}
```

Usa un registrador personalizado para registrar mensajes. Puedes usar la API `createLogger` de Vite para obtener el registrador predeterminado y personalizarlo para, por ejemplo, cambiar el mensaje o filtrar ciertas advertencias.

```js
import { createLogger, defineConfig } from 'vite'
const logger = createLogger()
const loggerWarn = logger.warn
logger.warn = (msg, options) => {
  // Ignorar la advertencia de archivos CSS vacíos
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}
export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **Tipo:** `boolean`
- **Por defecto:** `true`

Colocalo en `false` para evitar que Vite borre la pantalla del terminal al registrar ciertos mensajes. A través de la línea de comandos, usa `--clearScreen false`.

## envDir

- **Tipo:** `string | false`
- **Por defecto:** `root`

El directorio desde el que se cargan los archivos `.env`. Puede ser una ruta absoluta o una ruta relativa a la raíz del proyecto. `false` desactivará la carga del archivo `.env`.

Entra [aquí](/guide/env-and-mode#archivos-env) para obtener más información sobre los archivos de entorno.

## envPrefix

- **Tipo:** `string | string[]`
- **Por defecto:** `VITE_`

Las variables de entorno que comienzan con `envPrefix` se expondrán al código fuente de tu cliente a través de import.meta.env.

:::warning NOTAS DE SEGURIDAD
`envPrefix` no debe configurarse como `''`, esto expondrá todas tus variables env y provocará una filtración inesperada de información confidencial. De todas formas, Vite arrojará un error al detectar `''`.
:::

Si deseas exponer una variable sin prefijo, puede usar [define](#define):

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

## appType

- **Tipo:** `'spa' | 'mpa' | 'custom'`
- **Por defecto:** `'spa'`

Si tu aplicación es una aplicación de página única (SPA), una [aplicación multipáginas (MPA)](../guide/build#multi-page-app) o una aplicación personalizada (SSR y marcos con manejo de HTML personalizado):

- `'spa'`: incluye el middleware de reserva de SPA y configura [sirv](https://github.com/lukeed/sirv) con `single: true` en la vista previa
- `'mpa'`: solo incluye middleware HTML no SPA
- `'custom'`: no incluye middleware HTML

Obtén más información en la [guía SSR](/guide/ssr#vite-cli) de Vite. Relacionado: [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **Tipo:** `Record<string, 'warn' | undefined>`
- **Relacionado:** [Cambios importantes](/changes/)

Habilita cambios importantes futuros para prepararse para una migración fluida a la próxima versión principal de Vite. La lista puede actualizarse, ampliarse o eliminarse en cualquier momento a medida que se desarrollen nuevas características.

Consulta la página de [Cambios importantes](/changes/) para obtener detalles sobre las opciones posibles.
