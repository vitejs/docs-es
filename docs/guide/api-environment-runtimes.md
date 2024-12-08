# API de Entorno para Runtimes

:::warning Experimental
El trabajo inicial para esta API se introdujo en Vite 5.1 con el nombre "API de Runtime de Vite". Esta guía describe una API revisada, renombrada a API de Entorno. Esta API se lanzará en Vite 6 como experimental. Ya puedes probarla en la última versión `vite@6.0.0-beta.x`.

**Recursos:**

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde recopilamos opiniones sobre las nuevas APIs.
- [PR de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementaron y revisaron las nuevas APIs.

Por favor, comparte tus comentarios mientras pruebas esta propuesta.
:::

## Fábricas de Entornos

Las fábricas de entornos están destinadas a ser implementadas por proveedores de entornos, como Cloudflare, y no por usuarios finales. Las fábricas de entornos devuelven una instancia de `EnvironmentOptions` para el caso común de usar el runtime objetivo tanto en desarrollo como en entornos de compilación. También se pueden establecer opciones predeterminadas para que el usuario no necesite configurarlas manualmente.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions
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
            hot: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig
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

## Crear una nueva fábrica de entornos

Un servidor de desarrollo Vite expone dos entornos por defecto: un entorno `client` y un entorno `ssr`. El entorno `client` es un entorno de navegador por defecto, y el ejecutor de módulos se implementa importando el módulo virtual `/@vite/client` en las aplicaciones cliente. El entorno `ssr` se ejecuta en el mismo runtime Node que el servidor Vite por defecto y permite que los servidores de aplicaciones procesen solicitudes con soporte completo de HMR durante el desarrollo.

El código fuente transformado se denomina módulo, y las relaciones entre los módulos procesados en cada entorno se mantienen en un grafo de módulos. El código transformado de estos módulos se envía a los runtimes asociados con cada entorno para su ejecución. Cuando se evalúa un módulo en el runtime, sus módulos importados serán solicitados, activando el procesamiento de una sección del grafo de módulos.

Un ejecutor de módulos de Vite permite ejecutar cualquier código procesándolo primero con los plugins de Vite. Esto es diferente de `server.ssrLoadModule` porque la implementación del ejecutor está desacoplada del servidor. Esto permite que autores de bibliotecas y frameworks implementen su propia capa de comunicación entre el servidor Vite y el ejecutor.

El navegador se comunica con su entorno correspondiente usando el WebSocket del servidor y mediante solicitudes HTTP. El ejecutor de módulos Node puede realizar llamadas directas a funciones para procesar módulos, ya que se ejecuta en el mismo proceso. Otros entornos podrían ejecutar módulos conectándose a un runtime JS como Workerd o un Worker Thread como lo hace Vitest.

Uno de los objetivos de esta funcionalidad es proporcionar una API personalizable para procesar y ejecutar código. Los usuarios pueden crear nuevas fábricas de entornos usando las primitivas expuestas.

```ts
import { DevEnvironment, RemoteEnvironmentTransport } from 'vite';

function createWorkerdDevEnvironment(name: string, config: ResolvedConfig, context: DevEnvironmentContext) {
  const hot = /* ... */;
  const connection = /* ... */;
  const transport = new RemoteEnvironmentTransport({
    send: (data) => connection.send(data),
    onMessage: (listener) => connection.on('message', listener),
  });

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot,
    remoteRunner: {
      transport,
    },
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
    private debug?: ModuleRunnerDebugger
  ) {}
  /**
   * URL a ejecutar. Acepta ruta de archivo, ruta del servidor o ID relativo a la raíz.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Limpia todas las cachés, incluyendo los listeners de HMR.
   */
  public clearCache(): void
  /**
   * Limpia todas las cachés, elimina todos los listeners de HMR y reinicia el soporte para mapas de origen.
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
import { root, fetchModule } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    root,
    fetchModule,
    // También puedes proporcionar hmr.connection para soportar HMR.
  },
  new ESModulesEvaluator()
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts
export interface ModuleRunnerOptions {
  /**
   * Raíz del proyecto.
   */
  root: string
  /**
   * Conjunto de métodos para comunicarse con el servidor.
   */
  transport: RunnerTransport
  /**
   * Configura cómo se resuelven los mapas de origen. Prefiere `node` si `process.setSourceMapsEnabled` está disponible.
   * De lo contrario, usará `prepareStackTrace` por defecto, que sobrescribe el método `Error.prepareStackTrace`.
   * Puedes proporcionar un objeto para configurar cómo se resuelven los contenidos de archivos y mapas de origen para archivos que no fueron procesados por Vite.
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
         * Configura cómo se comunica HMR entre el cliente y el servidor.
         */
        connection: ModuleRunnerHMRConnection
        /**
         * Configura el registrador de HMR.
         */
        logger?: false | HMRLogger
      }
  /**
   * Caché de módulos personalizado. Si no se proporciona, crea un caché separado para cada instancia de ejecutor de módulos.
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
    id: string
  ): Promise<any>
  /**
   * Evalúa un módulo externalizado.
   * @param file URL del archivo al módulo externo.
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exporta `ESModulesEvaluator` que implementa esta interfaz por defecto. Utiliza `new AsyncFunction` para evaluar código, por lo que si el código tiene un mapa de origen en línea, debe contener un [desplazamiento de 2 líneas](https://tc39.es/ecma262/#sec-createdynamicfunction) para acomodar las nuevas líneas añadidas. Esto se hace automáticamente en el caso de `ESModulesEvaluator`. Los evaluadores personalizados no agregarán líneas adicionales.

## `RunnerTransport`

**Firma de Tipo:**

```ts
interface RunnerTransport {
  /**
   * Método para obtener la información del módulo.
   */
  fetchModule: FetchFunction
}
```

El objeto de transporte se comunica con el entorno a través de un RPC o llamando directamente a la función. Por defecto, necesitas pasar un objeto con el método `fetchModule`, que puede usar cualquier tipo de RPC. Sin embargo, Vite también expone una interfaz de transporte bidireccional mediante la clase `RemoteRunnerTransport` para facilitar la configuración. Debes combinarlo con la instancia `RemoteEnvironmentTransport` en el servidor, como en este ejemplo donde se crea un ejecutor de módulos en un _worker thread_:

::: code-group

```ts [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  RemoteRunnerTransport,
} from 'vite/module-runner'

const runner = new ModuleRunner(
  {
    root: fileURLToPath(new URL('./', import.meta.url)),
    transport: new RemoteRunnerTransport({
      send: (data) => parentPort.postMessage(data),
      onMessage: (listener) => parentPort.on('message', listener),
      timeout: 5000,
    }),
  },
  new ESModulesEvaluator()
)
```

```ts [server.js]
import { BroadcastChannel } from 'node:worker_threads';
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite';

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js');
  return new DevEnvironment(name, config, {
    hot: /* canal caliente personalizado */,
    remoteRunner: {
      transport: new RemoteEnvironmentTransport({
        send: (data) => worker.postMessage(data),
        onMessage: (listener) => worker.on('message', listener),
      }),
    },
  });
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
});
```

:::

`RemoteRunnerTransport` y `RemoteEnvironmentTransport` están diseñados para usarse juntos, pero no es obligatorio. Puedes definir tu propia función para comunicarte entre el ejecutor y el servidor. Por ejemplo, si te conectas al entorno a través de una solicitud HTTP, puedes llamar a `fetch().json()` en la función `fetchModule`:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    root: fileURLToPath(new URL('./', import.meta.url)),
    transport: {
      async fetchModule(id, importer) {
        const response = await fetch(
          `http://my-vite-server/fetch?id=${id}&importer=${importer}`
        )
        return response.json()
      },
    },
  },
  new ESModulesEvaluator()
)

await runner.import('/entry.js')
```

## `ModuleRunnerHMRConnection`

**Firma de Tipo:**

```ts
export interface ModuleRunnerHMRConnection {
  /**
   * Se verifica antes de enviar mensajes al servidor.
   */
  isReady(): boolean
  /**
   * Envía un mensaje al servidor.
   */
  send(payload: HotPayload): void
  /**
   * Configura cómo se maneja HMR cuando esta conexión desencadena una actualización.
   * Este método espera que la conexión comience a escuchar actualizaciones HMR y llame a este callback cuando reciba una.
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}
```

Esta interfaz define cómo se establece la comunicación HMR. Vite exporta `ServerHMRConnector` desde el punto de entrada principal para admitir HMR durante el SSR de Vite. Los métodos `isReady` y `send` suelen ser llamados cuando se desencadena un evento personalizado (como `import.meta.hot.send("my-event")`).

El método `onUpdate` se llama solo una vez cuando se inicia el nuevo ejecutor de módulos. Se pasa un método que debe ser llamado cuando la conexión desencadene el evento HMR. La implementación depende del tipo de conexión (como, por ejemplo, puede ser `WebSocket`, `EventEmitter`, `MessageChannel`), pero usualmente se ve algo como esto:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

El callback se pone en cola y esperará a que se resuelva la actualización actual antes de procesar la siguiente. A diferencia de la implementación en el navegador, las actualizaciones de HMR en un ejecutor de módulos esperarán a que todos los oyentes (como `vite:beforeUpdate`/`vite:beforeFullReload`) terminen antes de actualizar los módulos.
