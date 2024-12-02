# API de Entorno

::: warning API de bajo nivel
El trabajo inicial para esta API se introdujo en Vite 5.1 con el nombre "API de Entorno en Tiempo de Ejecución". Esta guía describe una API revisada, renombrada como API de Entorno. Esta API será lanzada en Vite 6. Puedes probarla ya en la última versión `vite@6.0.0-alpha.x`.

Recursos:

- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementa y revisa la nueva API.
- [Discusión de retroalimentación](https://github.com/vitejs/vite/discussions/16358) donde estamos recopilando comentarios sobre las nuevas APIs.

No dudes en enviar solicitudes de cambios en la rama `v6/environment-api` para corregir los problemas que descubras. Comparte tus comentarios mientras pruebas la propuesta.  
:::

Vite 6 formaliza el concepto de Entornos, introduciendo nuevas APIs para crear y configurar estos entornos, así como acceder a las opciones y utilidades de contexto con una API consistente. Desde Vite 2, existían dos entornos implícitos (`client` y `ssr`). Los hooks de plugins recibían un parámetro `ssr` boolean en el último parámetro de opciones para identificar el entorno de destino para cada módulo procesado. Varias APIs esperaban un parámetro opcional `ssr` para asociar adecuadamente los módulos al entorno correcto (por ejemplo, `server.moduleGraph.getModuleByUrl(url, { ssr })`). El entorno `ssr` se configuraba mediante `config.ssr`, que tenía un conjunto parcial de las opciones presentes en el entorno cliente. Durante el desarrollo, tanto el entorno `client` como el `ssr` se ejecutaban simultáneamente con una única canalización compartida de plugins. Durante la compilación, cada compilación obtenía una nueva instancia de configuración resuelta con un nuevo conjunto de plugins.

La nueva API de Entornos no solo hace explícitos estos dos entornos predeterminados, sino que también permite a los usuarios crear tantos entornos con nombre como sea necesario. Hay una forma uniforme de configurar los entornos (usando `config.environments`), y las opciones del entorno y las utilidades de contexto asociadas con un módulo procesado están accesibles en los hooks de los plugins mediante `this.environment`. Las APIs que antes esperaban un parámetro `ssr` ahora están limitadas al entorno adecuado (por ejemplo, `environment.moduleGraph.getModuleByUrl(url)`). Durante el desarrollo, todos los entornos se ejecutan simultáneamente como antes. Durante la compilación, por compatibilidad, cada compilación obtiene su propia instancia de configuración resuelta. Sin embargo, los plugins o usuarios pueden optar por una canalización de compilación compartida.

Aunque hay grandes cambios internamente y nuevas APIs opcionales, no hay cambios importantes desde Vite 5. El objetivo inicial de Vite 6 será mover el ecosistema a la nueva versión principal de la manera más fluida posible, retrasando la promoción de la adopción de nuevas APIs en los plugins hasta que haya suficientes usuarios listos para consumir las nuevas versiones de estos plugins.

## Usando entornos en el servidor de Vite

Un solo servidor de desarrollo de Vite puede usarse para interactuar con diferentes entornos de ejecución de módulos de manera simultánea. Usaremos la palabra "entorno" para referirnos a una canalización de procesamiento de Vite configurada que puede resolver identificadores, cargar y procesar el código fuente, y está conectada a un entorno de ejecución donde se ejecuta el código. El código transformado se llama un módulo, y las relaciones entre los módulos procesados en cada entorno se mantienen en un gráfico de módulos. El código de estos módulos se envía a los entornos asociados para ser ejecutado. Cuando se evalúa un módulo, el entorno de ejecución solicita sus módulos importados, lo que desencadena el procesamiento de una sección del gráfico de módulos.

En una aplicación típica de Vite, los entornos se usarán para los módulos ES servidos al cliente y para el servidor de aplicaciones que realiza SSR. Una aplicación puede hacer SSR en un servidor Node, pero también en otros entornos JS como [Cloudflare's workerd](https://github.com/cloudflare/workerd). Por lo tanto, podemos tener diferentes tipos de entornos en el mismo servidor Vite: entornos de navegador, de Node y de workerd, por nombrar algunos.

Un _Module Runner de Vite_ permite ejecutar cualquier código procesándolo primero con los plugins de Vite. Es diferente de `server.ssrLoadModule` porque la implementación del _runner_ está desacoplada del servidor. Esto permite a los autores de bibliotecas y frameworks implementar su capa de comunicación entre el servidor de Vite y el _runner_. El navegador se comunica con su entorno correspondiente usando el WebSocket del servidor y a través de solicitudes HTTP. El _Module Runner de Node_ puede hacer llamadas a funciones directamente para procesar módulos ya que se ejecuta en el mismo proceso. Otros entornos podrían ejecutar módulos conectándose a un entorno de ejecución JS como workerd, o un Worker Thread como lo hace Vitest.

Todos estos entornos comparten el servidor HTTP de Vite, los middlewares y el WebSocket. La configuración resuelta y la canalización de plugins también se comparten, pero los plugins pueden usar `apply` para que sus hooks solo se llamen para ciertos entornos. El entorno también puede ser accesible dentro de los hooks para un control más detallado.

![Vite Environments](../images/vite-environments.svg)

Un servidor Vite expone dos entornos por defecto: un entorno `client` y un entorno `ssr`. El entorno cliente es un entorno de navegador por defecto, y el _module runner_ está implementado importando el módulo virtual `/@vite/client` en las aplicaciones cliente. El entorno SSR se ejecuta en el mismo entorno Node que el servidor Vite por defecto y permite que los servidores de aplicaciones se usen para renderizar solicitudes durante el desarrollo con soporte completo de HMR. Más adelante discutiremos cómo los frameworks y los usuarios pueden cambiar los tipos de entorno para los entornos predeterminados `client` y `ssr`, o registrar nuevos entornos (por ejemplo, para tener un gráfico de módulos separado para [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)).

Los entornos disponibles pueden ser accedidos usando `server.environments`:

```js
const environment = server.environments.client

environment.transformRequest(url)

console.log(server.environments.ssr.moduleGraph)
```

La mayoría de las veces, la instancia de `environment` actual estará disponible como parte del contexto del código que se ejecuta, por lo que la necesidad de acceder a ellos a través de `server.environments` debería ser rara. Por ejemplo, dentro de los hooks de plugins, el entorno se expone como parte del `PluginContext`, por lo que se puede acceder a él usando `this.environment`.

Un entorno de desarrollo es una instancia de la clase `DevEnvironment`:

```ts
class DevEnvironment {
  /**
   * Identificador único para el entorno en un servidor Vite.
   * Por defecto, Vite expone los entornos 'client' y 'ssr'.
   */
  name: string
  /**
   * Canal de comunicación para enviar y recibir mensajes del
   * *module runner* asociado en el entorno de ejecución objetivo.
   */
  hot: HotChannel | null
  /**
   * Gráfico de nodos de módulo, con las relaciones de importación
   * entre módulos procesados y el resultado en caché del código procesado.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * Plugins resueltos para este entorno, incluidos los que
   * se crean usando el hook `create` por entorno
   */
  plugins: Plugin[]
  /**
   * Permite resolver, cargar y transformar el código a través de la
   * canalización de plugins del entorno
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * Opciones de configuración resueltas para este entorno. Las opciones a nivel
   * global del servidor se toman como predeterminadas para todos los entornos y
   * pueden ser sobrescritas (condiciones de resolución, dependencias externas, optimizedDeps)
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(name, config, { hot, options }: DevEnvironmentSetup)

  /**
   * Resuelve la URL a un id, carga y procesa el código usando la
   * canalización de plugins. El gráfico de módulos también se actualiza.
   */
  async transformRequest(url: string): TransformResult

  /**
   * Registra una solicitud para ser procesada con baja prioridad. Esto es útil
   * para evitar cuellos de botella. El servidor Vite tiene información sobre los módulos importados
   * por otras solicitudes, por lo que puede "calentar" el gráfico de módulos para que los
   * módulos ya estén procesados cuando se soliciten.
   */
  async warmupRequest(url: string): void
}
```

Con `TransformResult` siendo:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Una instancia de entorno en el servidor de Vite permite procesar una URL utilizando el método `environment.transformRequest(url)`. Esta función utilizará el pipeline de plugins para resolver la `url` a un `id` de módulo, cargarlo (leyendo el archivo desde el sistema de archivos o a través de un plugin que implemente un módulo virtual) y luego transformar el código. Mientras se transforma el módulo, las importaciones y otros metadatos se registrarán en el gráfico de módulos del entorno creando o actualizando el nodo de módulo correspondiente. Cuando se termine el procesamiento, el resultado de la transformación también se almacenará en el módulo.

Pero la instancia del entorno no puede ejecutar el código en sí misma, ya que el entorno donde se ejecutará el módulo podría ser diferente del que está utilizando el servidor de Vite. Este es el caso para el entorno del navegador. Cuando un HTML se carga en el navegador, sus scripts se ejecutan, lo que activa la evaluación de todo el gráfico estático de módulos. Cada URL importada genera una solicitud al servidor de Vite para obtener el código del módulo, lo que finalmente es manejado por el Middleware de Transformación llamando a `server.environments.client.transformRequest(url)`. La conexión entre la instancia de entorno en el servidor y el ejecutor del módulo en el navegador se realiza a través de HTTP en este caso.

:::info Nombres de `transformRequest`
Estamos utilizando `transformRequest(url)` y `warmupRequest(url)` en la versión actual de esta propuesta para que sea más fácil de discutir y entender para los usuarios acostumbrados a la API actual de Vite. Antes de lanzar, podemos aprovechar para revisar estos nombres también. Por ejemplo, podrían llamarse `environment.processModule(url)` o `environment.loadModule(url)` tomando como referencia el método `context.load(id)` de los plugins de Rollup. Por el momento, creemos que es mejor mantener los nombres actuales y posponer esta discusión.
:::

:::info Ejecución de un módulo
La propuesta inicial tenía un método `run` que permitiría a los consumidores invocar una importación en el lado del ejecutor utilizando la opción `transport`. Durante nuestras pruebas, descubrimos que la API no era lo suficientemente universal como para recomendarla. Estamos abiertos a implementar una capa integrada para la implementación remota de SSR basada en los comentarios de los frameworks. Mientras tanto, Vite aún expone una API [`RunnerTransport`](#runnertransport) para ocultar la complejidad del RPC del ejecutor.
:::

Para el entorno `ssr` que se ejecuta por defecto en Node, Vite crea un ejecutor de módulos que implementa la evaluación utilizando `new AsyncFunction` ejecutándose en el mismo entorno JS que el servidor de desarrollo. Este ejecutor es una instancia de `ModuleRunner` que expone:

```ts
class ModuleRunner {
  /**
   * URL a ejecutar. Acepta rutas de archivo, rutas de servidor o id relativo a la raíz.
   * Devuelve un módulo instanciado (igual que en ssrLoadModule)
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * Otros métodos de ModuleRunner...
   */
```

:::info
En la API de v5.1 de Entorno en Tiempo de Ejecución, existían los métodos `executeUrl` y `executeEntryPoint` - ahora se han fusionado en un solo método `import`. Si deseas deshabilitar el soporte de HMR, crea un ejecutor con la bandera `hmr: false`.
:::

El ejecutor de módulos SSR predeterminado para Node no está expuesto. Puedes usar la API `createNodeEnvironment` con `createServerModuleRunner` juntos para crear un runner que ejecute el código en el mismo hilo, admita HMR y no entre en conflicto con la implementación SSR (en caso de que se haya anulado en la configuración). Dado un servidor Vite configurado en modo middleware como se describe en la [guía de configuración SSR](/guide/ssr#setting-up-the-dev-server), implementemos el middleware SSR usando la API de entorno. Se omite el manejo de errores.

```js
import {
  createServer,
  createServerHotChannel,
  createServerModuleRunner,
  createNodeDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    node: {
      dev: {
        // El entorno SSR predeterminado de Vite puede ser anulado en la configuración, así que
        // asegúrate de tener un entorno Node antes de que se reciba la solicitud.
        createEnvironment(name, config) {
          return createNodeDevEnvironment(name, config, {
            hot: createServerHotChannel(),
          })
        },
      },
    },
  },
})

const runner = createServerModuleRunner(server.environments.node)

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Leer index.html
  let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

  // 2. Aplicar transformaciones de Vite en HTML. Esto inyecta el cliente HMR,
  //    y también aplica transformaciones de HTML de los plugins de Vite, como preámbulos globales
  //    de @vitejs/plugin-react.
  template = await server.transformIndexHtml(url, template)

  // 3. Cargar la entrada del servidor. import(url) transforma automáticamente
  //    el código fuente ESM para ser usable en Node.js. ¡No se requiere empaquetado
  //    y ofrece soporte completo para HMR!
  const { render } = await runner.import('/src/entry-server.js')

  // 4. Renderizar el HTML de la aplicación. Esto supone que la función `render` exportada de entry-server.js
  //     llama a las API SSR correspondientes del marco,
  //    como ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. Inyectar el HTML renderizado por la aplicación en la plantilla.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Enviar el HTML renderizado de vuelta.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

## SSR Agnóstico del Entorno

:::info
Aún no está claro qué APIs debería proporcionar Vite para cubrir los casos de uso más comunes de SSR. Estamos pensando en lanzar la API de Entorno sin una manera oficial de hacer SSR agnóstico del entorno para dejar que el ecosistema explore patrones comunes primero.
:::

## Gráficos de Módulos Separados

Cada entorno tiene un gráfico de módulos aislado. Todos los gráficos de módulos tienen la misma firma, por lo que los algoritmos genéricos se pueden implementar para explorar o consultar el gráfico sin depender del entorno. `hotUpdate` es un buen ejemplo. Cuando se modifica un archivo, se usará el gráfico de módulos de cada entorno para descubrir los módulos afectados y realizar HMR para cada entorno de manera independiente.

:::info
Vite v5 tenía un gráfico de módulos mixto entre el Cliente y SSR. Dado un nodo no procesado o invalidado, no es posible saber si corresponde al Cliente, SSR o a ambos entornos. Los nodos de módulo tienen algunas propiedades prefijadas, como `clientImportedModules` y `ssrImportedModules` (y `importedModules` que devuelve la unión de ambos). `importers` contiene todos los importadores de ambos entornos, Cliente y SSR, para cada nodo de módulo. Un nodo de módulo también tiene `transformResult` y `ssrTransformResult`. Una capa de retrocompatibilidad permite que el ecosistema migre desde el obsoleto `server.moduleGraph`.
:::

Cada módulo está representado por una instancia de `EnvironmentModuleNode`. Los módulos pueden registrarse en el gráfico sin haber sido procesados aún (`transformResult` sería `null` en ese caso). Los `importers` y `importedModules` también se actualizan después de procesar el módulo.

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` es una instancia de `EnvironmentModuleGraph`:

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>
  )

  async getModuleByUrl(
    rawUrl: string
  ): Promise<EnvironmentModuleNode | undefined>

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```

## Creación de nuevos entornos

Uno de los objetivos de esta función es proporcionar una API personalizable para procesar y ejecutar código. Los usuarios pueden crear nuevos tipos de entorno utilizando las primitivas expuestas.

```ts
import { DevEnvironment, RemoteEnvironmentTransport } from 'vite'

function createWorkerdDevEnvironment(name: string, config: ResolvedConfig, context: DevEnvironmentContext) {
  const hot = /* ... */
  const connection = /* ... */
  const transport = new RemoteEnvironmentTransport({
    send: (data) => connection.send(data),
    onMessage: (listener) => connection.on('message', listener),
  })

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot,
    runner: {
      transport,
    },
  })
  return workerdDevEnvironment
}
```

Luego, los usuarios pueden crear un entorno workerd para hacer SSR usando:

```js
const ssrEnvironment = createWorkerdEnvironment('ssr', config)
```

## Configuración del Entorno

Los entornos se configuran explícitamente con la opción `environments` en la configuración.

```js
export default {
  environments: {
    client: {
      resolve: {
        conditions: [], // configurar el entorno Client
      },
    },
    ssr: {
      dev: {
        optimizeDeps: {}, // configurar el entorno SSR
      },
    },
    rsc: {
      resolve: {
        noExternal: true, // configurar un entorno personalizado
      },
    },
  },
}
```

Todas las configuraciones de entornos se extienden desde la configuración raíz del usuario, lo que permite agregar valores predeterminados para todos los entornos a nivel raíz. Esto es útil para el caso común de configurar una aplicación solo para el cliente con Vite, lo cual se puede hacer sin pasar por `environments.client`.

```js
export default {
  resolve: {
    conditions: [], // configurar un valor predeterminado para todos los entornos
  },
}
```

La interfaz `EnvironmentOptions` expone todas las opciones específicas por entorno. Existen `SharedEnvironmentOptions` que se aplican tanto a `build` como a `dev`, como `resolve`. Y también existen `DevEnvironmentOptions` y `BuildEnvironmentOptions` para opciones específicas de desarrollo y compilación (como `dev.optimizeDeps` o `build.outDir`).

```ts
interface EnvironmentOptions extends SharedEnvironmentOptions {
  dev: DevOptions
  build: BuildOptions
}
```

Como se explicó, las opciones específicas de entorno definidas en el nivel raíz de la configuración del usuario se usan para el entorno predeterminado del cliente (la interfaz `UserConfig` extiende de la interfaz `EnvironmentOptions`). Y los entornos se pueden configurar explícitamente usando el registro `environments`. Los entornos `client` y `ssr` siempre están presentes durante el desarrollo, incluso si se establece un objeto vacío en `environments`. Esto permite la retrocompatibilidad con `server.ssrLoadModule(url)` y `server.moduleGraph`. Durante la compilación, el entorno `client` siempre está presente, y el entorno `ssr` solo está presente si se configura explícitamente (usando `environments.ssr` o para compatibilidad hacia atrás `build.ssr`).

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // otras opciones
}
```

::: info

La propiedad de nivel superior `ssr` tiene muchas opciones comunes con `EnvironmentOptions`. Esta opción fue creada para el mismo caso de uso que `environments`, pero solo permitía la configuración de una pequeña cantidad de opciones. Vamos a descontinuarla a favor de una forma unificada de definir la configuración del entorno.

:::

## Instancias de entorno personalizadas

Para crear instancias personalizadas de entorno de desarrollo o compilación, se pueden usar las funciones `dev.createEnvironment` o `build.createEnvironment`.

```js
export default {
  environments: {
    rsc: {
      dev: {
        createEnvironment(name, config, { watcher }) {
          // Se llama con 'rsc' y la configuración resuelta durante el desarrollo
          return createNodeDevEnvironment(name, config, {
            hot: customHotChannel(),
            watcher
          })
        }
      },
      build: {
        createEnvironment(name, config) {
          // Se llama con 'rsc' y la configuración resuelta durante la compilación
          return createNodeBuildEnvironment(name, config)
        }
        outDir: '/dist/rsc',
      },
    },
  },
}
```

El entorno será accesible en los middlewares o hooks de los plugins a través de `server.environments`. En los hooks de los plugins, la instancia del entorno se pasa en las opciones, por lo que pueden aplicar condiciones dependiendo de cómo estén configurados.

Los proveedores de entornos como Workerd pueden exponer un proveedor de entorno para el caso más común de usar el mismo entorno para los entornos de desarrollo y compilación. También se pueden establecer las opciones predeterminadas del entorno para que el usuario no tenga que hacerlo.

```js
function createWorkedEnvironment(userConfig) {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config, { watcher }) {
          return createWorkerdDevEnvironment(name, config, {
            hot: customHotChannel(),
            watcher,
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

Luego, el archivo de configuración puede escribirse como

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
  ],
}
```

En este caso, vemos cómo el entorno `ssr` puede configurarse para usar workerd como su entorno de ejecución. Además, también se define un nuevo entorno personalizado RSC, respaldado por una instancia separada del entorno de ejecución workerd.

## Plugins y entornos

### Accediendo al entorno actual en los hooks

El servidor de Vite tiene un pipeline de plugins compartida, pero cuando se procesa un módulo, siempre se hace en el contexto de un entorno determinado. La instancia de `environment` está disponible en el contexto del plugin de `resolveId`, `load` y `transform`.

Un plugin podría usar la instancia `environment` para:

- Aplicar lógica solo para ciertos entornos.
- Cambiar la forma en que funcionan dependiendo de la configuración del entorno, que se puede acceder utilizando `environment.config`. Por ejemplo, el plugin de resolución central de Vite modifica la forma en que resuelve los identificadores basados en `environment.config.resolve.conditions`.

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

### Registrando nuevos entornos usando hooks

Los plugins pueden agregar nuevos entornos en el hook `config`:

```ts
  config(config: UserConfig) {
    config.environments.rsc ??= {}
  }
```

Un objeto vacío es suficiente para registrar el entorno, con los valores predeterminados de la configuración del entorno a nivel raíz.

### Configuración del entorno usando ganchos

Mientras se ejecuta el hook `config`, la lista completa de entornos aún no se conoce, y los entornos pueden verse afectados tanto por los valores predeterminados de la configuración del entorno a nivel raíz como explícitamente a través del registro `config.environments`.
Los plugins deben establecer valores predeterminados utilizando el hook `config`. Para configurar cada entorno, puedes usar el nuevo hook `configEnvironment`. Este hook se llama para cada entorno con su configuración parcialmente resuelta, incluida la resolución de los valores predeterminados finales.

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    if (name === 'rsc') {
      options.resolve.conditions = // ...
    }
  }
```

### El hook `hotUpdate`

- **Tipo:** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **Ver también:** [API HMR](./api-hmr)

El hook `hotUpdate` permite que los plugins realicen un manejo personalizado de las actualizaciones HMR para un entorno determinado. Cuando un archivo cambia, el algoritmo HMR se ejecuta para cada entorno en serie según el orden en `server.environments`, por lo que el hook `hotUpdate` se llamará varias veces. El hook recibe un objeto de contexto con la siguiente firma:

```ts
interface HotUpdateContext {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- `this.environment` es el entorno de ejecución del módulo donde se está procesando actualmente la actualización de un archivo.

- `modules` es un array de módulos en este entorno que se ven afectados por el archivo cambiado. Es un array porque un solo archivo puede mapearse a múltiples módulos servidos (por ejemplo, Vue SFCs).

- `read` es una función de lectura asincrónica que devuelve el contenido del archivo. Esto se proporciona porque, en algunos sistemas, el callback de cambio de archivo puede dispararse demasiado rápido antes de que el editor termine de actualizar el archivo, y una lectura directa con `fs.readFile` devolvería contenido vacío. La función `read` normaliza este comportamiento.

El hook puede optar por:

- Filtrar y reducir la lista de módulos afectados para que el HMR sea más preciso.

- Devolver un array vacío y realizar una recarga completa:

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

    // Invalidar módulos manualmente
    const invalidatedModules = new Set()
    for (const mod of modules) {
      this.environment.moduleGraph.invalidateModule(
        mod,
        invalidatedModules,
        timestamp,
        true
      )
    }
    this.environment.hot.send({ type: 'full-reload' })
    return []
  }
  ```

- Devolver un array vacío y realizar un manejo completo personalizado de HMR enviando eventos personalizados al cliente:

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  El código del cliente debe registrar el manejador correspondiente usando la [API HMR](./api-hmr) (esto podría ser inyectado por el mismo hook `transform` del plugin):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // realizar actualización personalizada
    })
  }
  ```

### Plugins por entorno

Un plugin puede definir a qué entornos debe aplicarse utilizando la función `applyToEnvironment`.

```js
const UnoCssPlugin = () => {
  // estado global compartido
  return {
    buildStart() {
      // inicializar el estado por entorno con WeakMap<Environment,Data>, this.environment
    },
    configureServer() {
      // usar ganchos globales normalmente
    },
    applyToEnvironment(environment) {
      // devolver true si este plugin debe estar activo en este entorno
      // si no se proporciona la función, el plugin está activo en todos los entornos
    },
    resolveId(id, importer) {
      // solo se llama para los entornos a los que este plugin se aplica
    },
  }
}
```

### `ModuleRunner`

Un _module runner_ se instancia en el entorno de ejecución objetivo. Todas las API en la siguiente sección se importan desde `vite/module-runner`, a menos que se indique lo contrario. Este punto de entrada de exportación se mantiene lo más liviano posible, exportando solo lo mínimo necesario para crear los _module runners_.

**Firma de tipo:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator,
    private debug?: ModuleRunnerDebugger
  ) {}

  /**
   * URL a ejecutar. Acepta una ruta de archivo, ruta del servidor o ID relativo a la raíz.
   */
  public async import<T = any>(url: string): Promise<T>

  /**
   * Elimina todas las cachés, incluidos los oyentes HMR.
   */
  public clearCache(): void

  /**
   * Elimina todas las cachés, elimina todos los oyentes HMR y restablece el soporte para mapas de fuente.
   * Este método no detiene la conexión HMR.
   */
  public async destroy(): Promise<void>

  /**
   * Devuelve `true` si el runner ha sido destruido al llamar al método `destroy()`.
   */
  public isDestroyed(): boolean
}
```

El evaluador de módulos en `ModuleRunner` es responsable de ejecutar el código. Vite exporta `ESModulesEvaluator` por defecto, que usa `new AsyncFunction` para evaluar el código. Si tu entorno de ejecución de JavaScript no admite evaluaciones inseguras, puedes proporcionar tu propia implementación.

El _module runner_ expone el método `import`. Cuando el servidor Vite activa el evento `full-reload` de HMR, todos los módulos afectados se volverán a ejecutar. Ten en cuenta que `ModuleRunner` no actualiza el objeto `exports` cuando esto sucede (lo sobrescribe), por lo que necesitarías ejecutar `import` nuevamente o obtener el módulo desde `moduleCache` si dependes de tener el objeto `exports` más actualizado.

**Ejemplo de uso:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { root, fetchModule } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    root,
    fetchModule,
    // también puedes proporcionar hmr.connection para soportar HMR
  },
  new ESModulesEvaluator()
)

await moduleRunner.import('/src/entry-point.js')
```

---

### `ModuleRunnerOptions`

```ts
export interface ModuleRunnerOptions {
  /**
   * Raíz del proyecto
   */
  root: string

  /**
   * Conjunto de métodos para comunicarse con el servidor.
   */
  transport: RunnerTransport

  /**
   * Configura cómo se resuelven los mapas de fuente. Prefiere `node` si `process.setSourceMapsEnabled` está disponible.
   * De lo contrario, usará por defecto `prepareStackTrace`, que sobrescribe el método `Error.prepareStackTrace`.
   * Puedes proporcionar un objeto para configurar cómo se resuelven los contenidos de archivos y mapas de fuente para archivos no procesados por Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions

  /**
   * Desactiva HMR o configura las opciones de HMR.
   */
  hmr?:
    | false
    | {
        /**
         * Configura cómo se comunica HMR entre el cliente y el servidor.
         */
        connection: ModuleRunnerHMRConnection

        /**
         * Configura el logger de HMR.
         */
        logger?: false | HMRLogger
      }

  /**
   * Caché de módulos personalizada. Si no se proporciona, se crea una caché de módulos separada para cada instancia de *module runner*.
   */
  moduleCache?: ModuleCacheMap
}
```

---

### `ModuleEvaluator`

**Firma de tipo:**

```ts
export interface ModuleEvaluator {
  /**
   * Evalúa el código que fue transformado por Vite.
   * @param context Contexto de la función
   * @param code Código transformado
   * @param id ID que se usó para obtener el módulo
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string
  ): Promise<any>

  /**
   * Evalúa el módulo externalizado.
   * @param file URL del archivo del módulo externo
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exporta `ESModulesEvaluator` que implementa esta interfaz por defecto. Este utiliza `new AsyncFunction` para evaluar el código, por lo que si el código tiene un mapa de fuente en línea, debe contener una [separación de 2 líneas](https://tc39.es/ecma262/#sec-createdynamicfunction) para acomodar las nuevas líneas agregadas. Esto se hace automáticamente en el entorno del servidor de Node. Si la implementación de tu runner no tiene esta restricción, deberías usar `fetchModule` (exportado desde `vite`) directamente.

## RunnerTransport

**Firma de tipo:**

```ts
interface RunnerTransport {
  /**
   * Un método para obtener información sobre el módulo.
   */
  fetchModule: FetchFunction
}
```

Objeto de transporte que se comunica con el entorno a través de RPC o llamando directamente a la función. Por defecto, se necesita pasar un objeto con el método `fetchModule` - puedes usar cualquier tipo de RPC dentro de él, pero Vite también expone una interfaz de transporte bidireccional a través de la clase `RemoteRunnerTransport` para facilitar la configuración. Necesitas combinarlo con la instancia `RemoteEnvironmentTransport` en el servidor, como en este ejemplo donde el ejecutor de módulos se crea en el hilo de trabajo:

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
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  return new DevEnvironment(name, config, {
    hot: /* canal hot personalizado */,
    runner: {
      transport: new RemoteEnvironmentTransport({
        send: (data) => worker.postMessage(data),
        onMessage: (listener) => worker.on('message', listener),
      }),
    },
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

`RemoteRunnerTransport` y `RemoteEnvironmentTransport` están destinados a ser usados juntos, pero no es necesario utilizarlos en absoluto. Puedes definir tu propia función para comunicarte entre el ejecutor y el servidor. Por ejemplo, si te conectas al entorno a través de una solicitud HTTP, puedes llamar a `fetch().json()` en la función `fetchModule`:

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

::: warning Acceso al módulo en el servidor
No queremos fomentar la comunicación entre el servidor y el ejecutor. Uno de los problemas que surgió con `vite.ssrLoadModule` es la dependencia excesiva del estado del servidor dentro de los módulos procesados. Esto dificulta la implementación de SSR independiente del entorno, ya que el entorno del usuario podría no tener acceso a las API del servidor. Por ejemplo, este código asume que el servidor de Vite y el código del usuario pueden ejecutarse en el mismo contexto:

```ts
const vite = createServer()
const routes = collectRoutes()

const { processRoutes } = await vite.ssrLoadModule('internal:routes-processor')
processRoutes(routes)
```

Esto hace imposible ejecutar el código del usuario de la misma manera en que podría ejecutarse en producción (por ejemplo, en el borde) porque el estado del servidor y el estado del usuario están acoplados. Por lo tanto, recomendamos usar módulos virtuales para importar el estado y procesarlo dentro del módulo del usuario:

```ts
// este código se ejecuta en otra máquina o en otro hilo

import { runner } from './ssr-module-runner.js'
import { processRoutes } from './routes-processor.js'

const { routes } = await runner.import('virtual:ssr-routes')
processRoutes(routes)
```

Las configuraciones simples como las de la [Guía de SSR](/guide/ssr) aún pueden usar `server.transformIndexHtml` directamente si no se espera que el servidor se ejecute en un proceso diferente en producción. Sin embargo, si el servidor se ejecutará en un entorno borde o un proceso separado, recomendamos crear un módulo virtual para cargar HTML:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = await fs.promises.readFile('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = await fs.promises.readFile('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

Luego, en el punto de entrada de SSR, puedes llamar a `import('virtual:index-html')` para recuperar el HTML procesado:

```ts
import { render } from 'framework'

// este ejemplo usa la sintaxis de cloudflare
export default {
  async fetch() {
    // durante el desarrollo, devolverá el HTML transformado
    // durante la compilación, empaquetará el HTML básico de index.html en una cadena
    const { default: html } = await import('virtual:index-html')
    return new Response(render(html), {
      headers: { 'content-type': 'text/html' },
    })
  },
}
```

Esto mantiene el procesamiento de HTML independiente del servidor.

:::

## ModuleRunnerHMRConnection

**Firma del tipo:**

```ts
export interface ModuleRunnerHMRConnection {
  /**
   * Verificado antes de enviar mensajes al cliente.
   */
  isReady(): boolean
  /**
   * Envía un mensaje al cliente.
   */
  send(message: string): void
  /**
   * Configura cómo se maneja HMR cuando esta conexión activa una actualización.
   * Este método espera que la conexión comience a escuchar las actualizaciones de HMR y llame a este callback cuando se reciba.
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}
```

Esta interfaz define cómo se establece la comunicación HMR. Vite exporta `ServerHMRConnector` desde el punto de entrada principal para admitir HMR durante Vite SSR. Los métodos `isReady` y `send` generalmente se llaman cuando se activa un evento personalizado (como, `import.meta.hot.send("my-event")`).

`onUpdate` se llama solo una vez cuando se inicia el nuevo ejecutor de módulos. Se pasa un método que debe ser llamado cuando la conexión active el evento HMR. La implementación depende del tipo de conexión (por ejemplo, puede ser `WebSocket`/`EventEmitter`/`MessageChannel`), pero generalmente se ve algo así:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

El callback se pone en cola y esperará a que se resuelva la actualización actual antes de procesar la siguiente. A diferencia de la implementación en el navegador, las actualizaciones HMR en un ejecutor de módulos esperarán hasta que todos los oyentes (como, `vite:beforeUpdate`/`vite:beforeFullReload`) terminen antes de actualizar los módulos.

## Entornos durante la compilación

En la interfaz de línea de comando, al ejecutar `vite build` y `vite build --ssr`, todavía se compilan solo los entornos de cliente y SSR por compatibilidad con versiones anteriores.

Cuando `builder.entireApp` es `true` (o al ejecutar `vite build --app`), `vite build` opta por construir toda la aplicación. Esto se convertirá en el valor predeterminado en una futura versión importante. Se creará una instancia de `ViteBuilder` (equivalente a `ViteDevServer` en tiempo de compilación) para compilar todos los entornos configurados para producción. Por defecto, la compilación de los entornos se ejecuta en serie respetando el orden del registro `environments`. Un framework o usuario puede configurar más cómo se compilan los entornos usando:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment))
      )
    },
  },
}
```

### Entorno en los hooks de compilación

De la misma manera que durante el desarrollo, los hooks de los plugins también reciben la instancia de entorno durante la compilación, reemplazando el valor booleano `ssr`.
Esto también funciona para `renderChunk`, `generateBundle` y otros hooks solo para compilación.

### Plugins compartidos durante la compilación

Antes de Vite 6, las canalizaciones de plugins funcionaban de manera diferente durante el desarrollo y la compilación:

- **Durante el desarrollo:** los plugins se comparten.
- **Durante la compilación:** los plugins están aislados para cada entorno (en diferentes procesos: `vite build` y luego `vite build --ssr`).

Esto obligaba a los frameworks a compartir el estado entre la compilación de `client` y la compilación del `ssr` mediante archivos de manifiesto escritos en el sistema de archivos. En Vite 6, ahora estamos compilando todos los entornos en un solo proceso, por lo que la canalización de plugins y la comunicación entre entornos pueden alinearse con el desarrollo.

En una futura versión importante (Vite 7 o 8), nuestro objetivo es tener una alineación completa:

- **Durante el desarrollo y la compilación:** los plugins se comparten, con [filtrado por entorno](#per-environment-plugins).

También habrá una única instancia de `ResolvedConfig` compartida durante la compilación, lo que permitirá el almacenamiento en caché a nivel de todo el proceso de compilación de la aplicación, de la misma manera que hemos estado haciendo con `WeakMap<ResolvedConfig, CachedData>` durante el desarrollo.

Para Vite 6, necesitamos dar un paso más pequeño para mantener la compatibilidad con versiones anteriores. Los plugins del ecosistema actualmente están utilizando `config.build` en lugar de `environment.config.build` para acceder a la configuración, por lo que necesitamos crear una nueva `ResolvedConfig` por entorno de manera predeterminada. Un proyecto puede optar por compartir toda la configuración y la canalización de plugins configurando `builder.sharedConfigBuild` en `true`.

Esta opción funcionará solo para un pequeño subconjunto de proyectos al principio, por lo que los autores de plugins pueden optar por compartir un plugin en particular configurando la opción `sharedDuringBuild` en `true`. Esto permite compartir fácilmente el estado tanto para plugins regulares:

```js
function myPlugin() {
  // Compartir estado entre todos los entornos en desarrollo y compilación
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // Optar por una sola instancia para todos los entornos
    sharedDuringBuild: true,
  }
}
```

## Compatibilidad con versiones anteriores

La API actual del servidor de Vite aún no está obsoleta y es compatible con versiones anteriores con Vite 5. La nueva API de Entorno es experimental.

El `server.moduleGraph` devuelve una vista combinada de los gráficos de módulos del cliente y del SSR. Los nodos de módulos compatibles con versiones anteriores se devolverán desde todos sus métodos. El mismo esquema se utiliza para los nodos de módulos pasados a `handleHotUpdate`.

No recomendamos cambiar a la API de Entorno aún. Nuestro objetivo es que una buena parte de la base de usuarios adopte Vite 6 antes de que los plugins tengan que mantener dos versiones. Consulta la sección de cambios futuros para obtener información sobre futuras obsolescencias y rutas de actualización:

- [`this.environment` en Hooks](/changes/this-environment-in-hooks)
- [Hook `hotUpdate` de HMR](/changes/hotupdate-hook)
- [Migración a APIs por entorno](/changes/per-environment-apis)
- [SSR usando la API `ModuleRunner`](/changes/ssr-using-modulerunner)
- [Plugins compartidos durante la compilación](/changes/shared-plugins-during-build)
