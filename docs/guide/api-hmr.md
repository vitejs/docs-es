# API de HMR

:::tip Nota
Esta es la API cliente de HMR. Para manejar actualizaciones HMR en los complementos, dale un vistazo a [handleHotUpdate](./api-plugin#handlehotupdate).

La API HMR está pensada para autores de marco de trabajo y autores de herramientas. Como usuario final, HMR ya está siendo manejado para ti en las plantillas de inicio del marco de trabajo específico.
:::

Vite expone su API HMR a través del objeto especial `import.meta.hot`:

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'

// ---cut---
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
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
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

## IntelliSense para TypeScript

Vite proporciona definiciones de tipos para `import.meta.hot` en [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Puedes crear un `env.d.ts` en el directorio `src` para que TypeScript tome las definiciones de tipo:

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)`

Para que un módulo pueda ser actualizado, debes utilizar `import.meta.hot.accept()` con un callback que recibe el módulo actualizado:

```js twoslash
import 'vite/client'
// ---cut---
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

Ten en cuenta que el HMR de Vite en realidad no intercambia el módulo importado originalmente: si los límites de un módulo HMR reexportan las importaciones desde un dep, entonces es responsable de actualizar esas reexportaciones (y estas exportaciones deben usar `let`). Además, los importadores relacionados con los límites del modulo no serán notificados de este cambio. Esta implementación simplificada de HMR es suficiente para la mayoría de los casos de uso de desarrollo, al tiempo que nos permite omitir el costoso trabajo de generar módulos proxy.

Vite requiere que la llamada a esta función aparezca como `import.meta.hot.accept(` (sensible a los espacios en blanco) en el código fuente para que el módulo acepte la actualización. Este es un requisito del análisis estático que hace Vite para habilitar el soporte de HMR para un módulo.

## `hot.accept(deps, cb)`

Un módulo también puede aceptar actualizaciones de dependencias directas sin tener que recargarse:

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
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
      // El callback recibe un array donde solo el módulo actualizado
      // no es nulo. Si la actualización no fue exitosa
      // (por ejemplo, error de sintaxis), el array estará vacío
    },
  )
}
```

## `hot.dispose(cb)`

Un módulo de autoaceptación o un módulo que espera ser aceptado por otros puede usar `hot.dispose` para eliminar cualquier efecto secundario persistente creado por su copia actualizada:

```js twoslash
import 'vite/client'
// ---cut---
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

```js twoslash
import 'vite/client'
// ---cut---
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

Ten en cuenta que no se soporta la reasignación de `data` en sí. En su lugar, debes mutar las propiedades del objeto `data` para que se preserve la información agregada por otros manejadores.

```js twoslash
import 'vite/client'
// ---cut---
// ok
import.meta.hot.data.someValue = 'hello'

// no soportado
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

Esto es actualmente un noop y está ahí para compatibilidad con versiones anteriores. Esto podría cambiar en el futuro si hay un nuevo uso para él. Para indicar que el módulo no se puede actualizar en caliente, utiliza `hot.invalidate()`.

## `hot.invalidate(message?: string)`

Un módulo de autoaceptación puede detectar durante el tiempo de ejecución de que no puede manejar una actualización de HMR y, por lo tanto, la actualización debe propagarse forzosamente a los importadores. Al llamar a `import.meta.hot.invalidate()`, el servidor HMR invalidará los importadores del invocador, como si no se aceptara a sí misma. Esto registrará un mensaje tanto en la consola del navegador como en la terminal. Puede pasar un mensaje para dar algo de contexto sobre por qué ocurrió la invalidación.

Ten en cuenta que siempre debes llamar a `import.meta.hot.accept` incluso si planeas invocar a `invalidate` inmediatamente después, o de lo contrario, el cliente HMR no escuchará los cambios futuros en el módulo de autoaceptación. Para comunicar la intención claramente, recomendamos llamar a `invalidate` dentro de la devolución de llamada `accept` así:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // Puedes usar la nueva instancia del módulo para decidir si invalidar.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.off(event, cb)`

Elimina el callback de los listeners de eventos.

## `hot.on(event, cb)`

Escucha un evento HMR.

Los siguientes eventos HMR son enviados por Vite automáticamente:

- `'vite:beforeUpdate'` cuando se va a aplicar una actualización (por ejemplo, se reemplazará un módulo).
- `'vite:afterUpdate'` cuando se aplicó una actualización (por ejemplo, se reemplazó un módulo).
- `'vite:beforeFullReload'` cuando una recarga completa está a punto de ser ejecutada.
- `'vite:beforePrune'` cuando los módulos que ya no se necesitan están a punto de ser eliminados.
- `'vite:invalidate'` cuando un módulo es invalidado con `import.meta.hot.invalidate()`
- `'vite:error'` cuando un error ocurre (Por ejemplo error de sintaxis).
- `'vite:ws:disconnect'` cuando la conexión WebSocket se pierde
- `'vite:ws:connect'` cuando la conexión WebScocket se (re)establece

Los eventos HMR personalizados también se pueden enviar desde complementos. Dale un vistazo a [handleHotUpdate](./api-plugin#handlehotupdate) para más detalles.

## `hot.send(event, data)`

Envía eventos personalizados al servidor de desarrollo de Vite.

Si se llama antes de conectarse, los datos se almacenarán en búfer y se enviarán una vez que se establezca la conexión.

Consulta [Comunicación cliente-servidor](/guide/api-plugin.html#comunicacion-cliente-servidor) para obtener más detalles, incluyendo una sección sobre [Typing Custom Events](/guide/api-plugin.html#typescript-for-custom-events).

## Lecturas adicionales

Si deseas aprender más sobre cómo utilizar la API de HMR y cómo funciona internamente, consulta estos recursos:

- [Hot Module Replacement es fácil](https://bjornlu.com/blog/hot-module-replacement-is-easy)
