# API de Entorno para Runtimes

:::info Lanzamiento Candidato
La API de Entorno se encuentra en la fase de lanzamiento candidato. Seguiremos manteniendo la estabilidad en las API entre lanzamientos principales para permitir que el ecosistema experimente y construya sobre ellas. Sin embargo, ten en cuenta que [algunas API específicas](/changes/#en-evaluacion) siguen considerándose experimentales.

Planeamos estabilizar estas nuevas API (con posibles cambios importantes) en un lanzamiento principal futuro una vez que los proyectos downstream hayan tenido tiempo de experimentar con las nuevas características y validarlas.

**Recursos:**

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde recopilamos opiniones sobre las nuevas APIs.
- [PR de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementaron y revisaron las nuevas APIs.

Por favor, comparte tus comentarios con nosotros.
:::

## Fábricas de Entornos

Las fábricas de entornos están destinadas a ser implementadas por proveedores de entornos, como Cloudflare, y no por usuarios finales. Las fábricas de entornos devuelven una instancia de `EnvironmentOptions` para el caso común de usar el runtime objetivo tanto en desarrollo como en entornos de compilación. También se pueden establecer opciones predeterminadas para que el usuario no necesite configurarlas manualmente.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

El archivo de configuración podría escribirse así:

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

Los frameworks pueden usar un entorno con el runtime Workerd para hacer SSR mediante:

```js
const ssrEnvironment = server.environments.ssr
```

## Crear una nueva Fábrica de Entornos

Un servidor de desarrollo Vite expone dos entornos por defecto: un entorno `client` y un entorno `ssr`. El entorno `client` es un entorno de navegador por defecto, y el ejecutor de módulos se implementa importando el módulo virtual `/@vite/client` en las aplicaciones cliente. El entorno `ssr` se ejecuta en el mismo runtime Node que el servidor Vite por defecto y permite que los servidores de aplicaciones procesen solicitudes con soporte completo de HMR durante el desarrollo.

El código fuente transformado se denomina módulo, y las relaciones entre los módulos procesados en cada entorno se mantienen en un grafo de módulos. El código transformado de estos módulos se envía a los runtimes asociados con cada entorno para su ejecución. Cuando se evalúa un módulo en el runtime, sus módulos importados serán solicitados, activando el procesamiento de una sección del grafo de módulos.

Un ejecutor de módulos de Vite permite ejecutar cualquier código procesándolo primero con los plugins de Vite. Esto es diferente de `server.ssrLoadModule` porque la implementación del ejecutor está desacoplada del servidor. Esto permite que autores de bibliotecas y frameworks implementen su propia capa de comunicación entre el servidor Vite y el ejecutor.

El navegador se comunica con su entorno correspondiente usando el WebSocket del servidor y mediante solicitudes HTTP. El ejecutor de módulos Node puede realizar llamadas directas a funciones para procesar módulos, ya que se ejecuta en el mismo proceso. Otros entornos podrían ejecutar módulos conectándose a un runtime JS como Workerd o un Worker Thread como lo hace Vitest.

Uno de los objetivos de esta funcionalidad es proporcionar una API personalizable para procesar y ejecutar código. Los usuarios pueden crear nuevas fábricas de entornos usando las primitivas expuestas.

```ts
import { DevEnvironment, HotChannel } from 'vite';

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */;
  const transport = HotChannel({
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  });

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  });

  return workerdDevEnvironment;
}
```

## `ModuleRunner`

Un ejecutor de módulos se instancia en el runtime objetivo. Todas las APIs en la siguiente sección se importan desde `vite/module-runner` a menos que se indique lo contrario. Este punto de entrada exporta únicamente lo necesario para crear ejecutores de módulos.

**Firma de Tipo:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator,
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * URL a ejecutar.
   * Acepta ruta de archivo, ruta del servidor o ID relativo a la raíz.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Limpia todas las cachés, incluyendo los listeners de HMR.
   */
  public clearCache(): void
  /**
   * Limpia todas las cachés, elimina todos los listeners de HMR, reinicia el soporte para mapas de origen.
   * Este método no detiene la conexión HMR.
   */
  public async close(): Promise<void>
  /**
   * Devuelve `true` si el ejecutor ha sido cerrado llamando al método `close()`.
   */
  public isClosed(): boolean
}
```

El evaluador de módulos en `ModuleRunner` es responsable de ejecutar el código. Vite exporta `ESModulesEvaluator` por defecto, que utiliza `new AsyncFunction` para evaluar el código. Puedes proporcionar tu propia implementación si tu runtime JavaScript no soporta evaluaciones inseguras.

El ejecutor de módulos expone el método `import`. Cuando el servidor Vite activa el evento HMR `full-reload`, todos los módulos afectados serán reejecutados. Ten en cuenta que el ejecutor de módulos no actualiza el objeto `exports` cuando esto ocurre (lo sobrescribe); deberías ejecutar `import` nuevamente o recuperar el módulo desde `evaluatedModules` si necesitas tener el último objeto `exports`.

**Ejemplo de uso:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    // También puedes proporcionar hmr.connection para soportar HMR.
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts
export interface ModuleRunnerOptions {
  /**
   * Conjunto de métodos para comunicarse con el servidor.
   */
  transport: ModuleRunnerTransport
  /**
   * Configura cómo se resuelven los mapas de origen. 
   
   * Prefiere `node` si `process.setSourceMapsEnabled` está disponible.
   
   * De lo contrario, usará `prepareStackTrace` por defecto, que sobrescribe 
   
   * el método `Error.prepareStackTrace`.
   * Puedes proporcionar un objeto para configurar cómo se resuelven los contenidos de archivos y 
   * mapas de origen para archivos que no fueron procesados por Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Desactiva HMR o configura opciones de HMR.
   */
  hmr?:
    | false
    | {
        /**
         * Configura el logger de HMR.
         */
        logger?: false | HMRLogger
      }
  /**
   * Caché de módulos personalizado. Si no se proporciona, crea un caché separado
   
   * para cada instancia de ejecutor de módulos.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**Firma de Tipo:**

```ts
export interface ModuleEvaluator {
  /**
   * Número de líneas prefijadas en el código transformado.
   */
  startOffset?: number
  /**
   * Evalúa el código que fue transformado por Vite.
   * @param context Contexto de la función.
   * @param code Código transformado.
   * @param id ID utilizado para obtener el módulo.
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Evalúa un módulo externalizado.
   * @param file URL del archivo al módulo externo.
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exporta `ESModulesEvaluator` que implementa esta interfaz por defecto. Utiliza `new AsyncFunction` para evaluar código, por lo que si el código tiene un mapa de origen en línea, debe contener un [desplazamiento de 2 líneas](https://tc39.es/ecma262/#sec-createdynamicfunction) para acomodar las nuevas líneas añadidas. Esto se hace automáticamente en el caso de `ESModulesEvaluator`. Los evaluadores personalizados no agregarán líneas adicionales.

## `ModuleRunnerTransport`

**Firma de Tipo:**

```ts
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

Objeto de transporte que se comunica con el entorno mediante un RPC o llamando directamente a la función. Cuando el método `invoke` no está implementado, es necesario implementar los métodos `send` y `connect`. Vite construirá internamente el método `invoke`.

Debes combinarlo con la instancia de `HotChannel` en el servidor, como en este ejemplo donde el ejecutor del módulo se crea en el subproceso del trabajador:

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'
/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
  },
  new ESModulesEvaluator(),
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              worker.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

Un ejemplo diferente utilizando una solicitud HTTP para comunicarse entre el ejecutor y el servidor:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

En este caso, se puede utilizar el método `handleInvoke` en el `NormalizedHotChannel`:

```ts
const customEnvironment = new DevEnvironment(name, config, context)
server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})

Pero ten en cuenta que para el soporte de HMR, se requieren los métodos `send` y `connect`. El método `send` generalmente se llama cuando se activa un evento personalizado (como, `import.meta.hot.send("my-event")`).

Vite exporta `createServerHotChannel` desde el punto de entrada principal para soportar HMR durante Vite SSR.
```
