# API de JavaScript

Las APIs de JavaScript de Vite están totalmente tipificadas, y se recomienda utilizar TypeScript o habilitar la comprobación de tipos JS en Visual Studio Code para aprovechar el intellisense y la validación.

## `createServer`

**Firma de Tipo:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Ejemplo de Uso:**

```ts twoslash
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // cualquier opción válida de configuración del usuario, además de `mode` y `configFile`.
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

:::tip NOTA
Al usar `createServer` y `build` en el mismo proceso de Node.js, ambas funciones se basan en `process.env.NODE_ENV` para funcionar correctamente, lo que también depende de la opción de configuración `mode`. Para evitar un comportamiento conflictivo, configura `process.env.NODE_ENV` o el `mode` de las dos APIs en `development`. De lo contrario, puedes generar un proceso secundario para ejecutar las APIs por separado.
:::

::: tip NOTA
Al utilizar el [modo de middleware](/config/server-options.html#server-middlewaremode) combinado con [configuración de proxy para WebSocket](/config/server-options.html#server-proxy), el servidor HTTP principal debe proporcionarse en `middlewareMode` para vincular correctamente el proxy.

<details>
<summary>Ejemplo</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'
const parentServer = http.createServer() // o express, koa, etc.
const vite = await createServer({
  server: {
    // Habilita el modo middleware
    middlewareMode: {
      // Proporciona el servidor HTTP principal para el proxy WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Proxying WebSocket
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig`

La interfaz `InlineConfig` extiende a `UserConfig` con propiedades adicionales:

- `configFile`: Especifica el archivo de configuración a utilizar. Si no se establece, Vite tratará de resolver automáticamente uno de la raíz del proyecto. Establezca `false` para desactivar la resolución automática.
- `envFile`: Establece a `false` para desactivar los archivos `.env`.

## `ResolvedConfig`

La interfaz `ResolvedConfig` tiene todas las mismas propiedades que `UserConfig`, excepto que la mayoría de las propiedades están resueltas y no indefinidas. También contiene utilidades como:

- `config.assetsInclude`: una función para comprobar si un `id` se considera un recurso.
- `config.logger`: objeto registrador interno de Vite.

## `ViteDevServer`

```ts
interface ViteDevServer {
  /**
   * El objeto de configuración de Vite resultante.
   */
  config: ResolvedConfig
  /**
   * Una instancia de aplicación de conexión
   * - Puede utilizarse para adjuntar middlewares personalizados al servidor de desarrollo.
   * - También se puede utilizar como la función manejadora de un servidor http personalizado
   * o como un middleware en cualquier framework Node.js de estilo connect.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Instancia del servidor http de Node nativo.
   * Será nulo en modo middleware.
   */
  httpServer: http.Server | null
  /**
   * Instancia de observador de Chokidar. Si `config.server.watch` está configurado como `null`,
   * devuelve un emisor de eventos sin referencia.
   */
  watcher: FSWatcher
  /**
   * Servidor web socket con el método `send(payload)`.
   */
  ws: WebSocketServer
  /**
   * Contenedor de plugins de Rollup que puede ejecutar hooks de plugins en un archivo dado.
   */
  pluginContainer: PluginContainer
  /**
   * Gráfico de módulo que rastrea las relaciones de importación, mapeo de url a archivo
   * y el estado hmr.
   */
  moduleGraph: ModuleGraph
  /**
   * Las urls resueltas que Vite imprime en la CLI. null en modo middleware o
   * antes de llamar a `server.listen`.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Resuelve, carga y transforma programáticamente una URL y obtiene el resultado
   * sin pasar por el pipeline de peticiones http.
   */
  transformRequest(
    url: string,
    options?: TransformOptions
  ): Promise<TransformResult | null>
  /**
   * Aplica las transformaciones HTML integradas en Vite y las transformaciones HTML de cualquier plugin.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string
  ): Promise<string>
  /**
   * Carga una URL dada como un módulo instanciado para SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean }
  ): Promise<Record<string, any>>
  /**
   * Corrige la pila de seguimiento de errores de ssr.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Activa HMR para un módulo en el gráfico de módulos. Puedes usar `server.moduleGraph`
   * API para recuperar el módulo a recargar. Si `hmr` es false, se deshabilitará.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Inicia el servidor.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Reinicia el servidor.
   *
   * @param forceOptimize - Fuerza al optimizador a recomponer el paquete, igual que la bandera --force cli
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Detiene el servidor.
   */
  close(): Promise<void>
  /**
   * Vincula atajos de línea de comando
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Llamar a `await server.waitForRequestsIdle(id)` esperará hasta que todas las importaciones estáticas
   * sean procesadas. Si se llama desde un hook de plugin de carga o transformación, el id debe ser
   * pasado como parámetro para evitar bloqueos. Llamar a esta función después de la primera
   * sección de importaciones estáticas del grafo de módulos ha sido procesada resolverá inmediatamente.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle` está destinado a ser utilizado como una vía de escape para mejorar la experiencia de desarrollo para características que no pueden ser implementadas siguiendo la naturaleza bajo demanda del servidor de desarrollo de Vite. Puede ser utilizado durante el inicio por herramientas como Tailwind para retrasar la generación de las clases CSS de la aplicación hasta que el código de la aplicación haya sido visto, evitando "destellos" de cambios de estilo. Cuando esta función se utiliza en un hook de carga o transformación, y se utiliza el servidor HTTP1 por defecto, uno de los seis canales HTTP será bloqueado hasta que el servidor procese todas las importaciones estáticas. El optimizador de dependencias de Vite actualmente utiliza esta función para evitar recargas completas de la página en caso de dependencias faltantes, retrasando la carga de dependencias precompiladas hasta que todas las dependencias importadas hayan sido recolectadas de fuentes importadas estáticamente. Vite puede cambiar a una estrategia diferente en una versión principal futura, estableciendo `optimizeDeps.crawlUntilStaticImports: false` por defecto para evitar el impacto en el rendimiento en aplicaciones grandes durante el inicio en frío.
:::

## `build`

**Firma de Tipo:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**Ejemplo de Uso:**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview`

**Firma de Tipo:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Ejemplo de Uso:**

```js twoslash
import { preview } from 'vite'
const previewServer = await preview({
  // cualquier opción válida de configuración del usuario, además de `mode` y `configFile`.
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `PreviewServer`

```ts
interface PreviewServer
  /**
   * El objeto de configuración de vite resuelto
   */
  config: ResolvedConfig
  /**
   * Una instancia de aplicación de conexión.
   * - Se puede usar para adjuntar middleware personalizado al servidor de vista previa.
   * - También se puede utilizar como función de controlador de un servidor http personalizado
   *   o como un middleware en cualquier marco Node.js de estilo de conexión
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * instancia de servidor http de Node nativo
   */
  httpServer: http.Server
  /**
   * Las URL resueltas que Vite imprime en la CLI.
   * null antes de que el servidor esté escuchando.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Imprime las URL del servidor
   */
  printUrls(): void
  /**
   * Vincula atajos de línea de comando
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig`

**Firma de Tipo:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false
): Promise<ResolvedConfig>
```

El valor de `command` es `serve` en desarrollo y vista previa, y `build` en compilación.

## `mergeConfig`

**Firma de Tipo:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true
): Record<string, any>
```

Fusiona profundamente dos configuraciones de Vite. `isRoot` representa el nivel dentro de la configuración de Vite que se está fusionando. Por ejemplo, configura `false` si estás fusionando dos opciones de `build`.

::: Nota
`mergeConfig` solo acepta configuraciones en forma de objeto. Si tiene una configuración en forma de callback, deberías de llamarla antes de pasarla a `mergeConfig`.

Puedes utilizar el helper `defineConfig` para juntar una configuración en forma de callback con otra configuración:

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject)
)
```

:::

## `searchForWorkspaceRoot`

**Firma de Tipo:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current)
): string
```

**Relacionado:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Busca la raíz del espacio de trabajo potencial si cumple las siguientes condiciones; de lo contrario, recurriría a `root` si:

- contiene el campo `workspaces` en `package.json`
- contiene uno de los siguientes archivos
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**Firma de Tipo:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_'
): Record<string, string>
```

**Relacionado:** [Archivos `.env`](./env-and-mode.md#archivos-env)

Carga archivos `.env` dentro de `envDir`. De forma predeterminada, solo se cargan las variables env con el prefijo `VITE_`, a menos que se cambie `prefixes`.

## `normalizePath`

**Firma de Tipo:**

```ts
function normalizePath(id: string): string
```

**Relacionado:** [Normalización de rutas](./api-plugin.md#normalizacion-de-rutas)

Normaliza una ruta para interoperar entre plugins de Vite.

## `transformWithEsbuild`

**Firma de Tipo:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>
```

Transforma JavaScript o TypeScript con esbuild. Útil para plugins que prefieren hacer coincidir la transformación interna de esbuild de Vite.

## `loadConfigFromFile`

**Firma de Tipo:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Carga un archivo de configuración de Vite manualmente con esbuild.

## `preprocessCSS`

- **Experimental:** [Hacer Comentarios](https://github.com/vite/vite/discussions/13815)

**Firma de Tipo:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig
): Promise<PreprocessCSSResult>
interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

Preprocesa archivos `.css`, `.scss`, `.sass`, `.less`, `.styl` y `.stylus` a CSS plano para que puedan ser utilizados en navegadores o analizados por otras herramientas. Similar al [soporte de preprocesamiento CSS incorporado](/guide/features#preprocesadores-css), se debe instalar el preprocesador correspondiente si se quiere usar.

El preprocesador utilizado se infiere de la extensión del `filename`. Si el `filename` termina con `.module.{ext}`, se infiere como un [módulo CSS](https://github.com/css-modules/css-modules) y el resultado devuelto incluirá un objeto `modules` que mapea los nombres de clases originales a los transformados.

Ten en cuenta que el preprocesamiento no resolverá URLs en `url()` o `image-set()`.
