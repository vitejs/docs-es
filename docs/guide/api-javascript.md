# JavaScript API

Las APIs de JavaScript de Vite están totalmente tipificadas, y se recomienda utilizar TypeScript o habilitar la comprobación de tipos JS en Visual Studio Code para aprovechar el intellisense y la validación.

## `createServer`

**Firma de Tipo:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Ejemplo de Uso:**

```js
const { createServer } = require('vite')

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

::tip NOTA
Al usar `createServer` y `build` en el mismo proceso de Node.js, ambas funciones se basan en `process.env.`<wbr>`NODE_ENV` para funcionar correctamente, lo que también depende de la opción de configuración `mode`. Para evitar un comportamiento conflictivo, configura `process.env.`<wbr>`NODE_ENV` o el `mode` de las dos APIs en `development`. De lo contrario, puedes generar un proceso secundario para ejecutar las APIs por separado.
:::

## `InlineConfig`

La interfaz `InlineConfig` extiende a `UserConfig` con propiedades adicionales:

- `configFile`: Especifica el archivo de configuración a utilizar. Si no se establece, Vite tratará de resolver automáticamente uno de la raíz del proyecto. Establezca `false` para desactivar la resolución automática.
- `envFile`: Establece a `false` para desactivar los archivos `.env`.

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
   * Resolver, cargar y transformar programáticamente una URL y obtener el resultado
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
const path = require('path')
const { build } = require('vite')

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
const { preview } = require('vite')

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
  defaultMode?: string
): Promise<ResolvedConfig>
```

El valor de `command` es `serve` en dev (en el cli `vite`, `vite dev`, y `vite serve` son alias).

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
