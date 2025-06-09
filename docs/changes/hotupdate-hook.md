# Hook de Plugin `hotUpdate` para HMR

::: tip Feedback
Danos tu opinión en la [discusión de feedback sobre la API de Entorno](https://github.com/vitejs/vite/discussions/16358).
:::

Estamos planeando colocar en desuso el hook de plugin `handleHotUpdate` a favor del [hook `hotUpdate`](/guide/api-environment#the-hotupdate-hook) para que sea compatible con la [API de Entorno](/guide/api-environment.md) y maneje eventos adicionales de observación con `create` y `delete`.

Ámbito afectado: **`Autores de Plugins para Vite`**

::: warning Obsolencia Futura
El hook `hotUpdate` se introdujo por primera vez en la versión `v6.0`. La declaración de desuso de `handleHotUpdate` está planificada para una versión importante posteriormente. Aún no recomendamos abandonar `handleHotUpdate`. Si deseas experimentar y darnos tu opinión, puedes usar `future.removePluginHookHandleHotUpdate` con el valor `"warn"` en tu configuración de Vite.
:::

## Motivación

El [hook `handleHotUpdate`](/guide/api-plugin.md#handlehotupdate) permite manejar actualizaciones personalizadas para HMR. Se pasa una lista de módulos para actualizar en el contexto `HmrContext`:

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Este hook se llama una vez para todos los entornos, y los módulos pasados tienen información mixta de los entornos Cliente y SSR únicamente. Una vez que los frameworks se mueven a entornos personalizados, se necesita un nuevo hook que se llame para cada uno de ellos.

El nuevo hook `hotUpdate` funciona de la misma manera que `handleHotUpdate`, pero se llama para cada entorno y recibe una nueva instancia de `HotUpdateContext`:

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

El entorno de desarrollo actual se puede acceder como en otros hooks de plugin usando `this.environment`. La lista de `modules` ahora tendrá nodos de módulo solo del entorno actual. Cada actualización de entorno puede definir diferentes estrategias de actualización.

Este hook también se llama ahora para eventos de observación adicionales y no solo para `'update'`. Usa `type` para diferenciarlos.

## Guía de Migración

Filtra y reduce la lista de módulos afectados para que el HMR sea más preciso:

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// Migrar a:

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

Devuelve un arreglo vacío y realiza una recarga completa:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // Invalidar módulos manualmente
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// Migrar a:

hotUpdate({ modules, timestamp }) {
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

Devuelve un arreglo vacío y realiza un manejo HMR completamente personalizado enviando eventos personalizados al cliente:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// Migrar a...

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
