# Migración a APIs por entorno

::: tip Feedback  
Danos tu opinión en la [discusión de feedback sobre la API de Entorno](https://github.com/vitejs/vite/discussions/16358).  
:::

Varias APIs de `ViteDevServer` relacionadas con el grafo de módulos han sido reemplazadas por APIs de Entorno más aisladas:

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest` -> `environment.transformRequest`
- `server.warmupRequest` -> `environment.warmupRequest`

Ámbito afectado: **`Autores de Plugins para Vite`**

::: warning Obsolencia Futura  
La instancia de Entorno se introdujo por primera vez en `v6.0`. La declaración de obsolencia de `server.moduleGraph` y otros métodos que ahora están en los entornos está planificada para `v7.0`. Aún no recomendamos abandonar los métodos del servidor. Para identificar tu uso, configura estas opciones en tu archivo de configuración de Vite:

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## Motivación

// TODO:

## Guía de Migración

// TODO:
