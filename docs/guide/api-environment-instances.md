# Uso de Instancias de `Environment`

:::info Lanzamiento Candidato
La API de Entorno se encuentra en la fase de lanzamiento candidato. Seguiremos manteniendo la estabilidad en las API entre lanzamientos principales para permitir que el ecosistema experimente y construya sobre ellas. Sin embargo, ten en cuenta que [algunas API específicas](/changes/#en-evaluacion) siguen considerándose experimentales.

Planeamos estabilizar estas nuevas API (con posibles cambios importantes) en un lanzamiento principal futuro una vez que los proyectos downstream hayan tenido tiempo de experimentar con las nuevas características y validarlas.

**Recursos:**

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358), donde estamos recopilando opiniones sobre las nuevas APIs.
- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471), donde se implementó y revisó las nuevas APIs.

Por favor, comparte tus comentarios con nosotros.
:::

## Acceso a los Entornos

Durante el desarrollo, los entornos disponibles en un servidor de desarrollo se pueden acceder utilizando `server.environments`:

```js
// Crear el servidor o obtenerlo desde el hook configureServer
const server = await createServer(/* opciones */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

También puedes acceder al entorno actual desde plugins. Consulta la [API de Entorno para Plugins](./api-environment-plugins.md#accessing-the-current-environment-in-hooks) para más detalles.

## Clase `DevEnvironment`

Durante el desarrollo, cada entorno es una instancia de la clase `DevEnvironment`:

```ts
class DevEnvironment {
  /**
   * Identificador único para el entorno en un servidor Vite.
   * De forma predeterminada, Vite expone los entornos 'client' y 'ssr'.
   */
  name: string
  /**
   * Canal de comunicación para enviar y recibir mensajes del
   * ejecutor de módulos asociado en el entorno de destino.
   */
  hot: NormalizedHotChannel
  /**
   * Grafo de nodos de módulos, con la relación de importación entre
   * módulos procesados y el resultado almacenado en caché del código procesado.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * Plugins resueltos para este entorno, incluidos los creados usando el
   * hook `create` por entorno.
   */
  plugins: Plugin[]
  /**
   * Permite resolver, cargar y transformar el código a través del
   * pipeline de plugins del entorno.
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * Opciones de configuración resueltas para este entorno. Las opciones en el ámbito global del servidor
   * se toman como valores predeterminados para todos los entornos y pueden
   * ser sobrescritas (condiciones de resolución, external, optimizedDeps).
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * Resuelve la URL a un id, la carga y procesa el código utilizando el
   * pipeline de plugins. El grafo de módulos también se actualiza.
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * Registra una solicitud para ser procesada con baja prioridad. Esto es útil
   * para evitar cascadas. El servidor Vite tiene información sobre los
   * módulos importados por otras solicitudes, por lo que puede preparar el grafo de módulos
   * para que los módulos ya estén procesados cuando sean solicitados.
   */
  async warmupRequest(url: string): Promise<void>
}
```

Con `DevEnvironmentContext` siendo:

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

y con `TransformResult` siendo:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Una instancia de entorno en el servidor Vite permite procesar una URL utilizando el método `environment.transformRequest(url)`. Esta función utilizará el pipeline de plugins para resolver la `url` a un `id` de módulo, cargarlo (leyendo el archivo desde el sistema de archivos o mediante un plugin que implemente un módulo virtual), y luego transformar el código. Mientras se transforma el módulo, las importaciones y otros metadatos se registrarán en el grafo de módulos del entorno creando o actualizando el nodo de módulo correspondiente. Cuando el procesamiento esté completo, el resultado de la transformación también se almacenará en el módulo.

:::info nombrando transformRequest
Estamos usando `transformRequest(url)` y `warmupRequest(url)` en la versión actual de esta propuesta para que sea más fácil de discutir y entender para los usuarios acostumbrados a la API actual de Vite. Antes de liberar, podemos aprovechar la oportunidad para revisar estos nombres también. Por ejemplo, podría llamarse `environment.processModule(url)` o `environment.loadModule(url)` tomando como referencia el `context.load(id)` de los hooks de Rollup. Por el momento, creemos que mantener los nombres actuales y posponer esta discusión es lo mejor.
:::

## Grafos de Módulos Separados

Cada entorno tiene un grafo de módulos aislado. Todos los grafos de módulos tienen la misma firma, por lo que se pueden implementar algoritmos genéricos para recorrer o consultar el grafo sin depender del entorno. `hotUpdate` es un buen ejemplo. Cuando un archivo se modifica, el grafo de módulos de cada entorno se utilizará para descubrir los módulos afectados y realizar HMR para cada entorno de forma independiente.

::: info
Vite v5 tenía un grafo de módulos mixto de Cliente y SSR. Dado un nodo no procesado o invalidado, no es posible saber si corresponde al entorno del cliente, SSR o ambos. Los nodos de módulo tienen algunas propiedades con prefijo, como `clientImportedModules` y `ssrImportedModules` (y `importedModules` que devuelve la unión de ambos). `importers` contiene todos los importadores de ambos entornos del cliente y SSR para cada nodo de módulo. Un nodo de módulo también tiene `transformResult` y `ssrTransformResult`. Una capa de compatibilidad con versiones anteriores permite al ecosistema migrar desde la API de `server.moduleGraph` obsoleta.
:::

Cada módulo se representa con una instancia de `EnvironmentModuleNode`. Los módulos pueden registrarse en el grafo sin haber sido procesados aún (`transformResult` sería `null` en ese caso). `importers` y `importedModules` también se actualizan después de procesar el módulo.

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
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
