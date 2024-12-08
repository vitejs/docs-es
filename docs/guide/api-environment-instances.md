# Uso de instancias de `Environment`

:::warning Experimental  
El trabajo inicial para esta API se introdujo en Vite 5.1 bajo el nombre "API de Runtime de Vite". Esta guía describe una API revisada, renombrada a API de Entorno (Environment API). Esta API será lanzada en Vite 6 como experimental. Puedes probarla en la última versión beta `vite@6.0.0-beta.x`.

**Recursos:**

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358), donde estamos recopilando opiniones sobre las nuevas APIs.
- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471), donde se implementó y revisó la nueva API.

Por favor, compártenos tus comentarios mientras pruebas esta propuesta.  
:::

## Acceso a los entornos

Durante el desarrollo, los entornos disponibles en un servidor de desarrollo se pueden acceder utilizando `server.environments`:

```js
// Crear el servidor o obtenerlo desde el hook configureServer
const server = await createServer(/* opciones */)
const environment = server.environments.client
environment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

También puedes acceder al entorno actual desde plugins. Consulta la [API de Entorno para Plugins](./api-environment-plugins.md#accessing-the-current-environment-in-hooks) para más detalles.

## Clase `DevEnvironment`

Durante el desarrollo, cada entorno es una instancia de la clase `DevEnvironment`:

```ts
class DevEnvironment {
  name: string // Identificador único del entorno.
  hot: HotChannel | null // Canal de comunicación con el runner del módulo asociado.
  moduleGraph: EnvironmentModuleGraph // Gráfico de módulos.
  plugins: Plugin[] // Plugins resueltos para este entorno.
  pluginContainer: EnvironmentPluginContainer // Contenedor de plugins para el entorno.
  config: ResolvedConfig & ResolvedDevEnvironmentOptions // Configuración resuelta.

  constructor(name, config, { hot, options }: DevEnvironmentSetup)

  async transformRequest(url: string): TransformResult // Procesa un URL.
  async warmupRequest(url: string): void // Prepara un request.
}
```

El resultado de la transformación (`TransformResult`) incluye:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

## Grafos de módulos separados

Cada entorno tiene un grafo de módulos aislado. Estos grafos tienen la misma estructura, lo que permite implementar algoritmos genéricos para recorrer o consultar los nodos sin depender del entorno. Por ejemplo, cuando un archivo es modificado, el grafo de módulos de cada entorno se usa para descubrir los módulos afectados y ejecutar HMR independientemente.

### Representación de un módulo en el grafo

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

### Clase `EnvironmentModuleGraph`

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
    seen?: Set<EnvironmentModuleNode>,
    timestamp?: number,
    isHmr?: boolean
  ): void
  invalidateAll(): void
  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting?: boolean
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
