# API de Entorno

::: warning Experimental
El trabajo inicial para esta API se introdujo en Vite 5.1 con el nombre "API de Entorno en Tiempo de Ejecución". Esta guía describe una API revisada, renombrada como API de Entorno. Esta API será lanzada en Vite 6 como experimental. Puedes probarla ya en la última versión `vite@6.0.0-beta.x`.

Recursos:

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde estamos recopilando comentarios sobre las nuevas APIs.
- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementa y revisa la nueva API.

Por favor, compártenos tus comentarios a medida que pruebas la propuesta.
:::

## Formalizando entornos

Vite 6 formaliza el concepto de Entornos. Hasta Vite 5, existían dos entornos implícitos (`client` y `ssr`). La nueva API de Entornos permite a los usuarios crear tantos entornos como sea necesario para mapear la forma en que sus aplicaciones funcionan en producción. Estas nuevas capacidades requirieron una gran reestructuración interna, pero se ha puesto un gran esfuerzo en mantener la retrocompatibilidad. El objetivo inicial de Vite 6 es trasladar el ecosistema a esta nueva versión principal de la manera más fluida posible, retrasando la adopción de estas nuevas APIs experimentales hasta que suficientes usuarios hayan migrado y los autores de frameworks y plugins hayan validado el nuevo diseño.

## Cerrando la brecha entre la compilación y el desarrollo

Para una SPA simple, hay un solo entorno. La aplicación se ejecutará en el navegador del usuario. Durante el desarrollo, salvo por el requisito de Vite de usar un navegador moderno, el entorno coincide estrechamente con el entorno de producción. En Vite 6, seguiría siendo posible usar Vite sin que los usuarios tengan que conocer los entornos. La configuración habitual de Vite funciona para el entorno predeterminado de cliente en este caso.

En una típica aplicación renderizada en el servidor con Vite, hay dos entornos. El entorno de cliente ejecuta la aplicación en el navegador, y el entorno de Node ejecuta el servidor que realiza el SSR. Al ejecutar Vite en modo de desarrollo, el código del servidor se ejecuta en el mismo proceso de Node que el servidor de desarrollo de Vite, lo que da una aproximación cercana al entorno de producción. Sin embargo, una aplicación puede ejecutar servidores en otros entornos JS, como [workerd de Cloudflare](https://github.com/cloudflare/workerd). También es común que las aplicaciones modernas tengan más de dos entornos (por ejemplo, una aplicación podría ejecutarse en un navegador, un servidor Node y un servidor en el edge). Vite 5 no permitía representar adecuadamente estos casos.

Vite 6 permite a los usuarios configurar su aplicación durante la compilación y el desarrollo para mapear todos sus entornos. Durante el desarrollo, ahora se puede usar un único servidor de desarrollo Vite para ejecutar código en varios entornos diferentes de manera concurrente. El código fuente de la aplicación sigue siendo transformado por el servidor de desarrollo Vite. Sobre el servidor HTTP compartido, los middlewares, la configuración resuelta y el pipeline de plugins, el servidor Vite ahora tiene un conjunto de entornos de desarrollo independientes. Cada uno de ellos está configurado para coincidir lo más posible con el entorno de producción y está conectado a un entorno de ejecución de desarrollo donde el código se ejecuta (para workerd, el código del servidor ahora puede ejecutarse localmente en miniflare). En el cliente, el navegador importa y ejecuta el código. En otros entornos, un ejecutor de módulos obtiene y evalúa el código transformado.

![Entornos de Vite](../images/vite-environments.svg)

## Configuración del Entorno

Los entornos se configuran explícitamente con la opción de configuración `environments`.´

```js
export default {
  environments: {
    client: {
      resolve: {
        conditions: [], // configurar el entorno Cliente
      },
    },
    ssr: {
      optimizeDeps: {}, // configurar el entorno SSR
    },
    rsc: {
      resolve: {
        noExternal: true, // configurar un entorno personalizado
      },
    },
  },
}
```

Todos los archivos de configuración de entornos se extienden desde la configuración raíz del usuario, lo que permite a los usuarios agregar valores predeterminados para todos los entornos a nivel raíz. Esto es muy útil para el caso común de configurar una aplicación solo para cliente en Vite, lo cual se puede hacer sin pasar por `environments.client`.

```js
export default {
  resolve: {
    conditions: [], // configurar un valor predeterminado para todos los entornos
  },
}
```

La interfaz `EnvironmentOptions` expone todas las opciones por entorno. Existen `SharedEnvironmentOptions` que se aplican tanto a `build` como a `dev`, como `resolve`. Y también existen `DevEnvironmentOptions` y `BuildEnvironmentOptions` para las opciones específicas de `dev` y `build` (como `optimizeDeps` o `build.outDir`).

```ts
interface EnvironmentOptions extends SharedEnvironmentOptions {
  dev: DevOptions
  build: BuildOptions
}
```

Como se explicó, las opciones específicas de entorno definidas a nivel raíz en la configuración del usuario son usadas para el entorno predeterminado `client` (la interfaz `UserConfig` extiende de la interfaz `EnvironmentOptions`). Los entornos pueden configurarse explícitamente usando el registro `environments`. Los entornos `client` y `ssr` siempre están presentes durante el desarrollo, incluso si se asigna un objeto vacío a `environments`. Esto permite la compatibilidad con `server.ssrLoadModule(url)` y `server.moduleGraph`. Durante la compilación, el entorno `client` siempre está presente, y el entorno `ssr` solo está presente si se configura explícitamente (usando `environments.ssr` o, por compatibilidad, `build.ssr`).

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // otras opciones
}
```

::: info

La propiedad de nivel superior `ssr` tiene muchas opciones en común con `EnvironmentOptions`. Esta opción fue creada para el mismo caso de uso que `environments`, pero solo permitía la configuración de un número reducido de opciones. Vamos a descontinuarla a favor de una forma unificada de definir la configuración del entorno.

:::

## Instancias personalizadas de entorno

Están disponibles APIs de configuración de bajo nivel para que los proveedores de entornos proporcionen entornos para sus entornos de ejecución.

```js
import { createCustomEnvironment } from 'vite-environment-provider'

export default {
  environments: {
    client: {
      build: {
        outDir: '/dist/client',
      },
    }
    ssr: createCustomEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

## Retrocompatibilidad

La API actual del servidor Vite aún no está obsoleta y es compatible con versiones anteriores a Vite 5. La nueva API de entornos es experimental.

- [Migración a las APIs por entorno](/changes/per-environment-apis)
- [SSR usando la API `ModuleRunner`](/changes/ssr-using-modulerunner)
- [Plugins compartidos durante la compilación](/changes/shared-plugins-during-build)

## Usuarios objetivo

Esta guía proporciona los conceptos básicos sobre entornos para usuarios finales.

Los autores de plugins tienen disponible una API más consistente para interactuar con la configuración actual de entornos. Si estás desarrollando sobre Vite, la guía [API de Plugins de Entornos](./api-environment-plugins.md) describe cómo utilizar las APIs extendidas de plugins para soportar múltiples entornos personalizados.

Los frameworks pueden decidir exponer los entornos a diferentes niveles. Si eres autor de un framework, sigue leyendo la [Guía de Frameworks de la API de Entornos](./api-environment-frameworks) para conocer el lado programático de la API de entornos.

Para los proveedores de runtimes, la [Guía de Runtimes de la API de Entornos](./api-environment-runtimes.md) explica cómo ofrecer entornos personalizados para ser consumidos por frameworks y usuarios.
