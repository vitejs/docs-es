# API de Entorno

:::info Lanzamiento Candidato
La API de Entorno se encuentra en la fase de lanzamiento candidato. Seguiremos manteniendo la estabilidad en las API entre lanzamientos principales para permitir que el ecosistema experimente y construya sobre ellas. Sin embargo, ten en cuenta que [algunas API específicas](/changes/#en-evaluacion) siguen considerándose experimentales.

Planeamos estabilizar estas nuevas API (con posibles cambios importantes) en un lanzamiento principal futuro una vez que los proyectos downstream hayan tenido tiempo de experimentar con las nuevas características y validarlas.

Recursos:

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde estamos recopilando comentarios sobre las nuevas APIs.
- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementa y revisa la nueva API.

Por favor, comparte tus comentarios con nosotros.
:::

## Formalizando entornos

Vite 6 formaliza el concepto de Entornos. Hasta Vite 5, había dos entornos implícitos (`client` y opcionalmente `ssr`). La nueva API de Entornos permite a los usuarios y autores de frameworks crear tantos entornos como sea necesario para mapear la forma en que sus aplicaciones funcionan en producción. Esta nueva capacidad requirió una gran reestructuración interna, pero se ha puesto mucho esfuerzo en mantener la retrocompatibilidad. El objetivo inicial de Vite 6 es migrar el ecosistema a la nueva versión principal de la manera más fluida posible, retrasando la adopción de las APIs hasta que un número suficiente de usuarios haya migrado y los autores de frameworks y plugins hayan validado el nuevo diseño.

## Cerrando la Brecha entre la Compilación y el Desarrollo

Para una SPA/MPA simple, no se exponen nuevas APIs sobre los entornos en la configuración. Internamente, Vite aplicará las opciones a un entorno `client`, pero no es necesario conocer este concepto al configurar Vite. La configuración y el comportamiento de Vite 5 deberían funcionar de manera fluida aquí.

Cuando pasamos a una aplicación típica renderizada del lado del servidor (SSR), tendremos dos entornos:

- `client`: ejecuta la aplicación en el navegador.
- `ssr`: ejecuta la aplicación en Node (u otros entornos de servidor) que renderiza las páginas antes de enviarlas al navegador.

En desarrollo, Vite ejecuta el código del servidor en el mismo proceso de Node que el servidor de desarrollo de Vite, lo que proporciona una aproximación cercana al entorno de producción. Sin embargo, también es posible que los servidores se ejecuten en otros entornos de ejecución de JavaScript, como [workerd de Cloudflare](https://github.com/cloudflare/workerd), que tienen restricciones diferentes. Las aplicaciones modernas también pueden ejecutarse en más de dos entornos, por ejemplo, en un navegador, un servidor Node y un servidor de borde. Vite 5 no permitía representar correctamente estos entornos.

Vite 6 permite a los usuarios configurar su aplicación durante la compilación y el desarrollo para mapear todos sus entornos. Durante el desarrollo, un solo servidor de desarrollo de Vite ahora puede usarse para ejecutar código en múltiples entornos diferentes simultáneamente. El código fuente de la aplicación aún es transformado por el servidor de desarrollo de Vite. Sobre el servidor HTTP compartido, los middleware, la configuración resuelta y la canalización de plugins, el servidor de desarrollo de Vite ahora tiene un conjunto de entornos de desarrollo independientes. Cada uno de ellos se configura para coincidir con el entorno de producción lo más posible y está conectado a un entorno de ejecución en desarrollo donde se ejecuta el código (para workerd, el código del servidor ahora puede ejecutarse localmente en miniflare). En el cliente, el navegador importa y ejecuta el código. En otros entornos, un ejecutor de módulos obtiene y evalúa el código transformado.

![Entornos de Vite](../images/vite-environments.svg)

## Configuración de Entornos

Para una SPA/MPA, la configuración será similar a la de Vite 5. Internamente, estas opciones se utilizan para configurar el entorno `client`.

```js
export default defineConfig({
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
})
```

Esto es importante porque queremos mantener Vite accesible y evitar exponer nuevos conceptos hasta que sean necesarios. Si la aplicación está compuesta por varios entornos, estos pueden configurarse explícitamente con la opción de configuración `environments`.

```js
export default {
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
  },
}
```

Cuando no está documentado explícitamente, los entornos heredan las opciones de configuración del nivel superior (por ejemplo, los nuevos entornos `server` y `edge` heredarán la opción `build.sourcemap: false`). Un pequeño número de opciones de nivel superior, como `optimizeDeps`, solo se aplican al entorno `client`, ya que no funcionan bien cuando se aplican como predeterminadas a los entornos de servidor. Esas opciones tienen el badge <NonInheritBadge /> en [la referencia](/config/). El entorno `client` también puede configurarse explícitamente a través de `environments.client`, pero se recomienda hacerlo con las opciones de nivel superior para que la configuración del cliente permanezca sin cambios al agregar nuevos entornos.

La interfaz `EnvironmentOptions` expone todas las opciones por entorno. Existen opciones de entorno que se aplican tanto a `build` como a `dev`, como `resolve`. Y hay `DevEnvironmentOptions` y `BuildEnvironmentOptions` para opciones específicas de dev y compilación (como `dev.warmup` o `build.outDir`). Algunas opciones como `optimizeDeps` solo se aplican a dev, pero se mantienen como nivel superior en lugar de anidarse en `dev` para mantener la compatibilidad con versiones anteriores.

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
  build: BuildOptions
}
```

La interfaz `UserConfig` extiende de la interfaz `EnvironmentOptions`, lo que permite configurar el cliente y los valores predeterminados para otros entornos, configurados a través de la opción `environments`. El entorno `client` y un entorno de servidor llamado `ssr` siempre están presentes durante el desarrollo. Esto permite la compatibilidad con versiones anteriores con `server.ssrLoadModule(url)` y `server.moduleGraph`. Durante la compilación, el entorno `client` siempre está presente, y el entorno `ssr` solo está presente si se configura explícitamente (utilizando `environments.ssr` o, para compatibilidad con versiones anteriores, `build.ssr`). Una aplicación no necesita usar el nombre `ssr` para su entorno SSR; podría llamarlo `server`, por ejemplo.

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // otras opciones
}
```

Ten en cuenta que la propiedad de nivel superior `ssr` se va a declarar obsoleta una vez que la API de Entornos sea estable. Esta opción tiene el mismo rol que `environments`, pero para el entorno predeterminado `ssr` y solo permitía configurar un pequeño conjunto de opciones.

## Instancias de Entornos Personalizados

Están disponibles APIs de configuración de bajo nivel para que los proveedores de entornos en tiempo de ejecución puedan proporcionar entornos con valores predeterminados adecuados para sus entornos de ejecución. Estos entornos también pueden generar otros procesos o hilos para ejecutar los módulos durante el desarrollo en un entorno de ejecución más cercano al entorno de producción.

Por ejemplo, el [plugin de Cloudflare Vite](https://developers.cloudflare.com/workers/vite-plugin/) utiliza la API de Entornos para ejecutar código en el entorno de ejecución de Cloudflare Workers (`workerd`) durante el desarrollo.

```js
import { customEnvironment } from 'vite-environment-provider'

export default {
  build: {
    outDir: '/dist/client',
  },
  environments: {
    ssr: customEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

## Retrocompatibilidad

La API actual del servidor Vite no está obsoleta y es compatible con versiones anteriores a Vite 6. La nueva API de entornos es experimental.

- [Migración a las APIs por Entorno](/changes/per-environment-apis)
- [SSR Usando la API `ModuleRunner`](/changes/ssr-using-modulerunner)
- [Plugins Compartidos Durante la Compilación](/changes/shared-plugins-during-build)

## Usuarios Objetivo

Esta guía proporciona los conceptos básicos sobre entornos para usuarios finales.

Los autores de plugins tienen disponible una API más consistente para interactuar con la configuración actual de entornos. Si estás desarrollando sobre Vite, la guía [API de Plugins de Entornos](./api-environment-plugins.md) describe cómo utilizar las APIs extendidas de plugins para soportar múltiples entornos personalizados.

Los frameworks pueden decidir exponer los entornos a diferentes niveles. Si eres autor de un framework, sigue leyendo la [Guía de Frameworks de la API de Entornos](./api-environment-frameworks) para conocer el lado programático de la API de entornos.

Para los proveedores de runtimes, la [Guía de Runtimes de la API de Entornos](./api-environment-runtimes.md) explica cómo ofrecer entornos personalizados para ser consumidos por frameworks y usuarios.
