# Migración a APIs por Entorno

::: tip Feedback  
Danos tu opinión en la [discusión de feedback sobre la API de Entorno](https://github.com/vitejs/vite/discussions/16358).  
:::

Múltiples APIs de `ViteDevServer` relacionadas con el grafo de módulos han sido reemplazadas por APIs de Entorno más aisladas:

Ámbito afectado: **`Autores de Plugins para Vite`**

::: warning Futura eliminación
La instancia de Entorno se introdujo por primera vez en `v6.0`. La declaración de obsolencia de `server.moduleGraph` y otros métodos que ahora están en los entornos está planificada para una versión importante posteriormente. Aún no recomendamos abandonar los métodos del servidor. Para identificar tu uso, configura estas opciones en tu archivo de configuración de Vite:

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerReloadModule: 'warn',
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
  removeServerTransformRequest: 'warn',
  removeServerWarmupRequest: 'warn',
}
```

:::

## Motivación

En Vite v5 y versiones anteriores, un servidor de desarrollo Vite siempre tenía dos entornos (`client` y `ssr`). El grafo de módulos del servidor (`server.moduleGraph`) tenía módulos mezclados de ambos entornos. Los nodos se conectaban a través de las listas `clientImportedModules` y `ssrImportedModules` (pero se mantenía una sola lista de `importers` para cada). Un módulo transformado se representaba mediante un `id` y un booleano `ssr`. Este booleano debía pasarse a las APIs, por ejemplo `server.moduleGraph.getModuleByUrl(url, ssr)` y `server.transformRequest(url, { ssr })`.

En Vite v6, ahora es posible crear cualquier número de entornos personalizados (`client`, `ssr`, `edge`, etc.). Un solo booleano `ssr` ya no es suficiente. En lugar de cambiar las APIs para que tengan la forma `server.transformRequest(url, { environment })`, movimos estos métodos a la instancia de entorno, lo que les permite llamarse sin un servidor de desarrollo Vite.

## Guía de Migración

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#grafos-de-modulos-separados)
- `server.reloadModule(module)` -> `environment.reloadModule(module)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.transformRequest` -> `environment.transformRequest`
- `server.warmupRequest` -> `environment.warmupRequest`
- `server.hot` -> `server.client.environment.hot`
