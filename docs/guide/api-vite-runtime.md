# API de tiempo de ejecución de Vite

:::warning API de bajo nivel
Esta API se introdujo en Vite 5.1 como una característica experimental. Se agregó para [recopilar comentarios](https://github.com/vitejs/vite/discussions/15774). Es probable que haya cambios importantes en ella en Vite 5.2, así que asegúrate de fijar la versión de Vite en `~5.1.0` al usarla. Esta es una API de bajo nivel destinada a autores de librerías y frameworks. Si tu objetivo es crear una aplicación, asegúrate de consultar primero los complementos y herramientas de SSR de nivel superior en la [sección Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr).
:::

El "Tiempo de ejecución de Vite" es una herramienta que permite ejecutar cualquier código procesándolo primero con los complementos de Vite. Es diferente de `server.ssrLoadModule` porque la implementación del tiempo de ejecución está desacoplada del servidor. Esto permite a los autores de librerías y frameworks implementar su propia capa de comunicación entre el servidor y el tiempo de ejecución.

Uno de los objetivos de esta característica es proporcionar una API personalizable para procesar y ejecutar el código. Vite proporciona suficientes herramientas para usar el Tiempo de ejecución de Vite directamente, pero los usuarios pueden compilar sobre él si sus necesidades no se alinean con la implementación integrada de Vite.

Todas las API se pueden importar desde `vite/runtime` a menos que se indique lo contrario.

## `ViteRuntime`

**Firma de tipo:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * URL a ejecutar. Acepta la ruta del archivo, la ruta del servidor o el id relativo a la raíz.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * URL del punto de entrada a ejecutar. Acepta la ruta del archivo, la ruta del servidor o el id relativo a la raíz.
   * En caso de una recarga completa desencadenada por HMR, este es el módulo que se recargará.
   * Si se llama a este método varias veces, todos los puntos de entrada se recargarán uno a la vez.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Borrar todas las cachés, incluidos los listeners de HMR.
   */
  public clearCache(): void
  /**
   * Borra todas las cachés, elimina todos los listeners de HMR y restablece el soporte para mapas de origen.
   * Este método no detiene la conexión HMR.
   */
  public async destroy(): Promise<void>
  /**
   * Devuelve `true` si el tiempo de ejecución ha sido destruido llamando al método `destroy()`.
   */
  public isDestroyed(): boolean
}
```

::: tip Uso avanzado
Si estás migrando desde `server.ssrLoadModule` y deseas admitir HMR, considera usar [`createViteRuntime`](#createviteruntime) en su lugar.
:::

La clase `ViteRuntime` requiere las opciones `root` y `fetchModule` al iniciarse. Vite expone `ssrFetchModule` en la instancia de [`server`](/guide/api-javascript) para una integración más fácil con Vite SSR. Vite también exporta `fetchModule` desde su punto de entrada principal - no hace asunciones sobre cómo se está ejecutando el código a diferencia de `ssrFetchModule` que espera que el código se ejecute usando `new Function`. Esto se puede ver en los mapas de origen que estas funciones devuelven.

El ejecutador en `ViteRuntime` es el responsable de ejecutar el código. Vite exporta `ESModulesRunner` por defecto, utiliza `new AsyncFunction` para ejecutar el código. Puedes proporcionar tu propia implementación si tu tiempo de ejecución de JavaScript no admite evaluaciones inseguras.

Los dos métodos principales que expone el tiempo de ejecución son `executeUrl` y `executeEntrypoint`. La única diferencia entre ellos es que todos los módulos ejecutados por `executeEntrypoint` se reejecutarán si HMR desencadena el evento `full-reload`. Ten en cuenta que el Tiempo de ejecución de Vite no actualiza el objeto `exports` cuando esto sucede (lo sobrescribe), necesitarías ejecutar `executeUrl` u obtener el módulo desde `moduleCache` nuevamente si dependes de tener el más reciente objeto `exports`.

**Ejemplo de uso:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // también puedes proporcionar hmr.connection para admitir HMR
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions`

```ts
export interface ViteRuntimeOptions {
  /**
   * Raíz del proyecto
   */
  root: string
  /**
   * Un método para obtener la información sobre el módulo.
   * Para SSR, Vite expone la función `server.ssrFetchModule` que puedes usar aquí.
   * Para otros casos de uso de tiempo de ejecución, Vite también expone `fetchModule` desde su punto de entrada principal.
   */
  fetchModule: FetchFunction
  /**
   * Configura cómo se resuelven los mapas de origen. Prefiere `node` si `process.setSourceMapsEnabled` está disponible.
   * De lo contrario, utilizará `prepareStackTrace` de forma predeterminada, que sobrescribe el método `Error.prepareStackTrace`.
   * Puedes proporcionar un objeto para configurar cómo se resuelven los contenidos de los archivos y los mapas de origen para archivos que no fueron procesados por Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Deshabilita HMR o configura las opciones de HMR.
   */
  hmr?:
    | false
    | {
        /**
         * Configura cómo HMR se comunica entre el cliente y el servidor.
         */
        connection: HMRRuntimeConnection
        /**
         * Configura el registrador de HMR.
         */
        logger?: false | HMRLogger
      }
  /**
   * Caché de módulos personalizada. Si no se proporciona, crea una caché de módulos separada para cada instancia de ViteRuntime.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner`

**Firma de tipo:**

```ts
export interface ViteModuleRunner {
  /**
   * Ejecuta el código que fue transformado por Vite.
   * @param context Contexto de la función
   * @param code Código transformado
   * @param id ID que se usó para obtener el módulo
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Ejecuta el módulo externalizado.
   * @param file URL del archivo al módulo externo
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exporta `ESModulesRunner` que implementa esta interfaz por defecto. Utiliza `new AsyncFunction` para ejecutar código, por lo que si el código tiene un mapa de origen en línea, debe contener un [desplazamiento de 2 líneas](https://tc39.es/ecma262/#sec-createdynamicfunction) para acomodar las nuevas líneas agregadas. Esto se hace automáticamente por `server.ssrFetchModule`. Si tu implementación del ejecutador no tiene esta restricción, deberías usar `fetchModule` (exportado de `vite`) directamente.

## HMRRuntimeConnection

**Firma de tipo:**

```ts
export interface HMRRuntimeConnection {
  /**
   * Comprobado antes de enviar mensajes al cliente.
   */
  isReady(): boolean
  /**
   * Envía mensaje al cliente.
   */
  send(message: string): void
  /**
   * Configura cómo se debe manejar HMR cuando esta conexión desencadena una actualización.
   * Este método espera que la conexión comience a escuchar las actualizaciones de HMR e invoque al callback cuando las reciba.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

Esta interfaz define cómo se establece la comunicación de HMR. Vite exporta `ServerHMRConnector` desde el punto de entrada principal para admitir HMR durante Vite SSR. Los métodos `isReady` y `send` generalmente se llaman cuando se desencadena el evento personalizado (como `import.meta.hot.send("my-event")`).

`onUpdate` se llama solo una vez cuando se inicia el nuevo tiempo de ejecución. Se pasa un método que debe llamarse cuando la conexión desencadena el evento HMR. La implementación depende del tipo de conexión (como ejemplo, puede ser `WebSocket`/`EventEmitter`/`MessageChannel`), pero generalmente se parece a esto:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

El callback se encola y esperará a que se resuelva la actualización actual antes de procesar la siguiente actualización. A diferencia de la implementación del navegador, las actualizaciones de HMR en el Tiempo de ejecución de Vite esperan a que todos los listeners (como `vite:beforeUpdate`/`vite:beforeFullReload`) finalicen antes de actualizar los módulos.

## `createViteRuntime`

**Firma de tipo:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Ejemplo de uso:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

Este método sirve como un reemplazo sencillo para `server.ssrLoadModule`. A diferencia de `ssrLoadModule`, `createViteRuntime` proporciona soporte para HMR de forma nativa. Puedes pasar [`options`](#mainthreadruntimeoptions) para personalizar cómo se comporta el tiempo de ejecución de SSR para adaptarlo a tus necesidades.

## `MainThreadRuntimeOptions`

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Deshabilita HMR o configura el registrador de HMR.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Proporciona un ejecutador de módulos personalizado. Esto controla cómo se ejecuta el código.
   */
  runner?: ViteModuleRunner
}
```
