# API de HMR

:::tip Nota
Esta es la API cliente de HMR. Para manejar actualizaciones HMR en los complementos, dale un vistazo a [handleHotUpdate](./api-plugin#handlehotupdate).

La API HMR está pensada para autores de marco de trabajo y autores de herramientas. Como usuario final, HMR ya está siendo manejado para ti en las plantillas de inicio del marco de trabajo específico.
:::

Vite expone su API HMR a través del objeto especial `import.meta.hot`:

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  decline(): void
  invalidate(message?: string): void

  // `InferCustomEventPayload` provides types for built-in Vite events
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## Encapsulamiento Condicional Requerido

Primero que nada, debes asegurarte de tener todos los llamados a la API HMR en un bloque condicional, para que el código pueda ser descartado en producción:

```js
if (import.meta.hot) {
  // Código HMR
}
```

## `hot.accept(cb)`

Para que un módulo pueda ser actualizado, debes utilizar `import.meta.hot.accept()` con un callback que recibe el módulo actualizado:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule no está definido cuando ocurrió el SyntaxError
      console.log('actualizado: count ahora es ', newModule.count)
    }
  })
}
```

Un módulo que "acepta" actualizaciones instantáneas es considerado un **Límite HMR**.

Ten en cuenta que el HMR de Vite en realidad no intercambia el módulo importado originalmente: si los límites de un módulo HMR reexportan las importaciones desde un dep, entonces es responsable de actualizar esas reexportaciones (y estas exportaciones deben usar `let`). Además, los importadores relacionados con los límites del modulo no serán notificados de este cambio.

Esta implementación simplificada de HMR es suficiente para la mayoría de casos de uso de desarrollo, ya que nos permiten evitar el costoso trabajo de generar módulos proxy.

## `hot.accept(deps, cb)`

Un módulo también puede aceptar actualizaciones de dependencias directas sin tener que recargarse:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // el callback recibe el módulo './foo.js' actualizado
    newFoo?.foo()
  })

  // Puede aceptar un array de módulos de dependencia:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // El callback recibe un array donde solo el módulo actualizado no es nulo
      // Si la actualización no fue exitosa (por ejemplo, error de sintaxis), el array estará vacío
    }
  )
}
```

## `hot.dispose(cb)`

Un módulo de autoaceptación o un módulo que espera ser aceptado por otros puede usar `hot.dispose` para eliminar cualquier efecto secundario persistente creado por su copia actualizada:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // eliminar los efectos secundarios
  })
}
```

## `hot.prune(cb)`

Registra una callback que se invoca cuando el módulo ya no se importe en la página. En comparación con `hot.dispose`, esto se puede usar si el código fuente limpia los efectos secundarios por sí mismo en las actualizaciones y solo necesitas limpiar cuando se elimina de la página. Vite actualmente usa esto para importaciones `.css`.

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // eliminar los efectos secundarios
  })
}
```

## `hot.data`

El objeto `import.meta.hot.data` se mantiene en diferentes instancias del mismo módulo actualizado. Se puede utilizar para pasar información de una versión anterior del módulo a la siguiente.

## `hot.decline()`

Llamar a `import.meta.hot.decline()` indica que este módulo no se puede actualizar en instantáneo, y el navegador debe realizar una recarga completa si se encuentra este módulo mientras se propagan las actualizaciones de HMR.

## `hot.invalidate(message?: string)`

Un módulo de autoaceptación puede detectar durante el tiempo de ejecución de que no puede manejar una actualización de HMR y, por lo tanto, la actualización debe propagarse forzosamente a los importadores. Al llamar a `import.meta.hot.invalidate()`, el servidor HMR invalidará los importadores del invocador, como si no se aceptara a sí misma. Esto registrará un mensaje tanto en la consola del navegador como en la terminal. Puede pasar un mensaje para dar algo de contexto sobre por qué ocurrió la invalidación.

Ten en cuenta que siempre debes llamar a `import.meta.hot.accept` incluso si planeas invocar a `invalidate` inmediatamente después, o de lo contrario, el cliente HMR no escuchará los cambios futuros en el módulo de autoaceptación. Para comunicar la intención claramente, recomendamos llamar a `invalidate` dentro de la devolución de llamada `accept` así:

```js
import.meta.hot.accept((module) => {
  // Puedes usar la nueva instancia del módulo para decidir si invalidar.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```
## `hot.on(event, cb)`

Escucha un evento HMR.

Los siguientes eventos HMR son enviados por Vite automáticamente:

- `'vite:beforeUpdate'` cuando se va a aplicar una actualización (por ejemplo, se reemplazará un módulo).
- `'vite:afterUpdate'` cuando se aplicó una actualización (por ejemplo, se reemplazó un módulo).
- `'vite:beforeFullReload'` cuando una recarga completa está a punto de ser ejecutada.
- `'vite:beforePrune'` cuando los módulos que ya no se necesitan están a punto de ser eliminados.
- `'vite:invalidate'` cuando un módulo es invalidado con `import.meta.hot.invalidate()`
- `'vite:error'` cuando un error ocurre (Por ejemplo error de sintaxis).

Los eventos HMR personalizados también se pueden enviar desde complementos. Dale un vistazo a [handleHotUpdate](./api-plugin#handlehotupdate) para más detalles.

## `hot.send(event, data)`

Envía eventos personalizados al servidor de desarrollo de Vite.
Si se llama antes de conectarse, los datos se almacenarán en búfer y se enviarán una vez que se establezca la conexión.
Consulta [Comunicación cliente-servidor](/guide/api-plugin.html#comunicacion-cliente-servidor) para obtener más detalles.
