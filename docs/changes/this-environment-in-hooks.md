# `this.environment` en Hooks

::: tip Feedback  
Danos tu opinión en la [discusión de feedback sobre la API de Entorno](https://github.com/vite/vite/discussions/16358).  
:::

Antes de Vite 6, solo estaban disponibles dos entornos: `client` y `ssr`. Un único argumento `options.ssr` en los hooks de plugins como `resolveId`, `load` y `transform` permitía a los autores de plugins diferenciar entre estos dos entornos al procesar módulos. En Vite 6, una aplicación de Vite puede definir cualquier cantidad de entornos nombrados según sea necesario. Se introduce `this.environment` en el contexto del plugin para interactuar con el entorno del módulo actual en los hooks.

Ámbito afectado: **`Autores de Plugins para Vite`**

::: warning Obsolencia Futura  
`this.environment` fue introducido en `v6.0`. La declaración de desuso de `options.ssr` está planificada para `v7.0`. En ese momento, recomendaremos migrar tus plugins para usar la nueva API. Para identificar tu uso, configura `future.removePluginHookSsrArgument` como `"warn"` en tu archivo de configuración de Vite.  
:::

## Motivación

`this.environment` no solo permite que la implementación de un hook de plugin conozca el nombre del entorno actual, sino que también da acceso a las opciones de configuración del entorno, información del grafo de módulos y la canalización de transformación (`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`). Tener la instancia del entorno disponible en el contexto permite a los autores de plugins evitar depender de todo el servidor de desarrollo (generalmente en caché al iniciar mediante el hook `configureServer`).

## Guía de Migración

Para realizar una migración rápida en un plugin existente, reemplaza el argumento `options.ssr` por `this.environment.name !== 'client'` en los hooks `resolveId`, `load` y `transform`:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.name !== 'client' // [!code ++]
      if (isSSR) {
        // Lógica específica de SSR
      } else {
        // Lógica específica del cliente
      }
    },
  }
}
```

Para una implementación más robusta a largo plazo, el hook del plugin debería manejar [múltiples entornos](/guide/api-environment.html#accessing-the-current-environment-in-hooks) usando opciones detalladas del entorno en lugar de depender del nombre del entorno.
