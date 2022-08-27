# API de JavaScript

Las APIs de JavaScript de Vite están totalmente tipificadas, y se recomienda utilizar TypeScript o habilitar la comprobación de tipos JS en Visual Studio Code para aprovechar el intellisense y la validación.

## `createServer`

**Firma de Tipo:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Ejemplo de Uso:**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // cualquier opción válida de configuración del usuario, además de `mode` y `configFile`.
    configFile: false,
    root: __dirname,
    server: {
      port: 1337
    }
  })
  await server.listen()

  server.printUrls()
})()
```

:::tip NOTA
Al usar `createServer` y `build` en el mismo proceso de Node.js, ambas funciones se basan en `process.env.`<wbr>`NODE_ENV` para funcionar correctamente, lo que también depende de la opción de configuración `mode`. Para evitar un comportamiento conflictivo, configura `process.env.`<wbr>`NODE_ENV` o el `mode` de las dos APIs en `development`. De lo contrario, puedes generar un proceso secundario para ejecutar las APIs por separado.
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
   * Instancia de observador Chokidar.
   * https://github.com/paulmillr/chokidar#api
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
  transformIndexHtml(url: string, html: string): Promise<string>
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
}
```

## `build`

**Firma de Tipo:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**Ejemplo de Uso:**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

## `preview`

**Firma de Tipo:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Ejemplo de Uso:**

```js
import { preview } from 'vite'

;(async () => {
  const previewServer = await preview({
    // cualquier opción válida de configuración del usuario, además de `mode` y `configFile`.
    preview: {
      port: 8080,
      open: true
    }
  })

  previewServer.printUrls()
})()
```

## `resolveConfig`

**Firma de Tipo:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig>
```

El valor de `command` es `serve` en dev (en el cli `vite`, `vite dev`, y `vite serve` son alias).

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

Normaliza una ruta para interoperar entre complementos de Vite.

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

Transforma JavaScript o TypeScript con esbuild. Útil para complementos que prefieren hacer coincidir la transformación interna de esbuild de Vite.

## `loadConfigFromFile`

**Firma de Tipo:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Carga un archivo de configuración de Vite manualmente con esbuild.
