# API de Entorno para Plugins

:::warning Experimental
El trabajo inicial para esta API se introdujo en Vite 5.1 con el nombre "API de Runtime de Vite". Esta guía describe una API revisada, renombrada a API de Entorno. Esta API se lanzará en Vite 6 como experimental. Ya puedes probarla en la última versión `vite@6.0.0-beta.x`.

Recursos:

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde estamos recopilando comentarios sobre las nuevas APIs.
- [PR de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementaron y revisaron las nuevas APIs.

Por favor, comparte con nosotros tus comentarios mientras pruebas la propuesta.
:::

## Accediendo al entorno actual en hooks

Dado que solo había dos entornos hasta Vite 6 (`client` y `ssr`), un booleano `ssr` era suficiente para identificar el entorno actual en las APIs de Vite. Los hooks de plugins recibían un booleano `ssr` en el último parámetro de opciones, y varias APIs esperaban un parámetro `ssr` opcional para asociar correctamente los módulos con el entorno adecuado (por ejemplo, `server.moduleGraph.getModuleByUrl(url, { ssr })`).

Con la llegada de entornos configurables, ahora tenemos una forma uniforme de acceder a sus opciones e instancia en los plugins. Los hooks de plugins ahora exponen `this.environment` en su contexto, y las APIs que anteriormente esperaban un booleano `ssr` ahora están vinculadas al entorno adecuado (por ejemplo, `environment.moduleGraph.getModuleByUrl(url)`).

El servidor de Vite tiene un pipeline de plugins compartido, pero cuando se procesa un módulo siempre se hace en el contexto de un entorno dado. La instancia del `environment` está disponible en el contexto del plugin.

Un plugin puede usar la instancia de `environment` para cambiar cómo se procesa un módulo dependiendo de la configuración para el entorno (que se puede acceder usando `environment.config`).

```ts
transform(code, id) {
  console.log(this.environment.config.resolve.conditions)
}
```

## Registrar nuevos entornos usando hooks

Los plugins pueden agregar nuevos entornos en el hook `config` (por ejemplo, para tener un grafo de módulos separado para [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)):

```ts
config(config: UserConfig) {
  config.environments.rsc ??= {}
}
```

Un objeto vacío es suficiente para registrar el entorno, con valores predeterminados desde la configuración de entorno a nivel raíz.

## Configuración del entorno usando hooks

Mientras el hook `config` se está ejecutando, la lista completa de entornos aún no es conocida y los entornos pueden verse afectados tanto por los valores predeterminados desde la configuración de entorno a nivel raíz como explícitamente a través del registro `config.environments`.

Los plugins deben establecer valores predeterminados usando el hook `config`. Para configurar cada entorno, pueden usar el nuevo hook `configEnvironment`. Este hook se llama para cada entorno con su configuración parcialmente resuelta, incluyendo la resolución de valores predeterminados finales.

```ts
configEnvironment(name: string, options: EnvironmentOptions) {
  if (name === 'rsc') {
    options.resolve.conditions = // ...
  }
}
```

## El hook `hotUpdate`

- **Tipo:** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **Ver también:** [API de HMR](./api-hmr)

El hook `hotUpdate` permite a los plugins realizar un manejo personalizado de actualizaciones HMR para un entorno dado. Cuando un archivo cambia, el algoritmo HMR se ejecuta para cada entorno en serie según el orden en `server.environments`, por lo que el hook `hotUpdate` se llamará múltiples veces. El hook recibe un objeto de contexto con la siguiente firma:

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

- `this.environment` es el entorno de ejecución del módulo donde actualmente se está procesando una actualización de archivo.
- `modules` es un array de módulos en este entorno que son afectados por el archivo modificado. Es un array porque un solo archivo puede mapearse a múltiples módulos servidos (por ejemplo, SFCs de Vue).
- `read` es una función de lectura asíncrona que devuelve el contenido del archivo. Esto se proporciona porque, en algunos sistemas, la devolución de llamada de cambio de archivo puede dispararse demasiado rápido antes de que el editor termine de actualizar el archivo, y un `fs.readFile` directo devolverá contenido vacío. La función de lectura pasada normaliza este comportamiento.

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

- Devolver un array vacío y realizar un manejo HMR completamente personalizado enviando eventos personalizados al cliente:

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

  El código del cliente debe registrar el manejador correspondiente usando la [API de HMR](./api-hmr) (esto podría ser inyectado por el mismo hook `transform` del plugin):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // realizar actualización personalizada
    })
  }
  ```

## Plugins por entorno

Un plugin puede definir cuáles son los entornos a los que debe aplicarse con la función `applyToEnvironment`.

```js
const UnoCssPlugin = () => {
  // estado global compartido
  return {
    buildStart() {
      // inicializar estado por entorno con WeakMap<Environment,Data>, this.environment
    },
    configureServer() {
      // usar hooks globales normalmente
    },
    applyToEnvironment(environment) {
      // devolver true si este plugin debe estar activo en este entorno
      // si no se proporciona la función, el plugin está activo en todos los entornos
    },
    resolveId(id, importer) {
      // solo llamado para entornos a los que este plugin aplica
    },
  }
}
```

## Entorno en hooks de compilación

De la misma manera que durante el desarrollo, los hooks de plugins también reciben la instancia del entorno durante la compilación, reemplazando el booleano `ssr`.

Esto también funciona para `renderChunk`, `generateBundle` y otros hooks solo de compilación.

## Plugins compartidos durante la compilación

Antes de Vite 6, los pipelines de plugins funcionaban de manera diferente durante el desarrollo y la compilación:

- **Durante el desarrollo:** los plugins son compartidos.
- **Durante la compilación:** los plugins están aislados para cada entorno (en diferentes procesos: `vite build` y luego `vite build --ssr`).

Esto obligaba a los frameworks a compartir estado entre la compilación `client` y la compilación `ssr` a través de archivos de manifiesto escritos en el sistema de archivos. En Vite 6, ahora estamos compilando todos los entornos en un solo proceso, por lo que la forma en que el pipeline de plugins y la comunicación entre entornos puede alinearse con el desarrollo.

En una futura versión principal (Vite 7 o 8), nuestro objetivo es tener una alineación completa:

- **Tanto durante el desarrollo como la compilación:** los plugins son compartidos, con [filtrado por entorno](#per-environment-plugins).

También habrá una única instancia de `ResolvedConfig` compartida durante la compilación, permitiendo almacenamiento en caché a nivel de proceso de compilación de toda la aplicación de la misma manera que lo hemos estado haciendo con `WeakMap<ResolvedConfig, CachedData>` durante el desarrollo.

Para Vite 6, necesitamos dar un paso más pequeño para mantener la retrocompatibilidad. Los plugins del ecosistema están utilizando actualmente `config.build` en lugar de `environment.config.build` para acceder a la configuración, por lo que necesitamos crear un nuevo `ResolvedConfig` por entorno de manera predeterminada. Un proyecto puede optar por compartir la configuración completa y el pipeline de plugins configurando `builder.sharedConfigBuild` como `true`.

Esta opción solo funcionaría para un pequeño subconjunto de proyectos al principio, por lo que los autores de plugins pueden optar por un plugin en particular para ser compartido estableciendo la bandera `sharedDuringBuild` como `true`. Esto permite compartir fácilmente el estado tanto para los plugins regulares:

```js
function myPlugin() {
  // Compartir estado entre todos los entornos en desarrollo y compilación
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },
    // Optar por una única instancia para todos los entornos
    sharedDuringBuild: true,
  }
}
```
