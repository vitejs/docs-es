# Plugins compartidos durante la compilación

::: tip Comentarios
Danos tu opinión en [Discusión sobre la API del entorno](https://github.com/vitejs/vite/discussions/16358)
:::

Consulta [Plugins compartidos durante la compilación](/guide/api-environment.md#shared-plugins-during-build).

Ámbito afectado: `Autores de plugins de Vite`

::: warning Cambio futuro por defecto
`builder.sharedConfigBuild` se introdujo por primera vez en `v6.0`. Puedes configurarlo como `true` para comprobar cómo funcionan tus plugins con una configuración compartida. Estamos buscando comentarios sobre la posibilidad de cambiar el valor por defecto en una futura versión importante una vez que el ecosistema de plugins esté listo.
:::

## Motivación

Alinear los pipelines de plugins de desarrollo y compilación.

## Guía de migración

Para poder compartir plugins entre entornos, el estado del plugin debe estar asociado al entorno actual. Un plugin de la siguiente forma contará el número de módulos transformados en todos los entornos.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

Si en cambio queremos contar el número de módulos transformados para cada entorno, necesitamos mantener un mapa:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

Para simplificar este patrón, Vite exporta un helper `perEnvironmentState`:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
