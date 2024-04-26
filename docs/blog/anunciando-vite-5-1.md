---
title: ¡Vite 5.1 está aquí!
author:
  name: El Equipo de Vite
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 5.1
  - - meta
    - property: og:image
      content: https://es.vitejs.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://es.vitejs.dev/blog/anunciando-vite-5-1
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 5.1
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 5.1 está aquí!

_8 de febrero de 2024_

![Imagen de Portada del Anuncio de Vite 5.1](/og-image-announcing-vite5-1.png)

Vite 5 [fue lanzado](./anunciando-vite5.md) en noviembre pasado, y representó otro gran avance para Vite y el ecosistema. Hace unas semanas celebramos 10 millones de descargas semanales de npm y 900 colaboradores en el repositorio de Vite. Hoy, nos complace anunciar el lanzamiento de Vite 5.1.

Enlaces rápidos: [Documentación](/), [Registro de cambios](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Documentación en otros idiomas: [Inglés](https://vitejs.dev/), [简体中文](https://cn.vitejs.dev/), [日本語](https://ja.vitejs.dev/), [Português](https://pt.vitejs.dev/), [한국어](https://ko.vitejs.dev/), [Deutsch](https://de.vitejs.dev/)

Prueba Vite 5.1 en línea en StackBlitz: [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Si eres nuevo en Vite, te sugerimos leer primero las guías de [Introducción](/guide/) y [Características](/guide/features).

Para mantenerte actualizado, síguenos en [X](https://x.com/vite_js) o [Mastodon](https://webtoo.ls/@vite).

## API de tiempo de ejecución de Vite

Vite 5.1 agrega soporte experimental para una nueva API de tiempo de ejecución de Vite. Permite ejecutar cualquier código procesándolo primero con los complementos de Vite. Es diferente de `server.ssrLoadModule` porque la implementación del tiempo de ejecución está desacoplada del servidor. Esto permite a los autores de librerías y frameworks implementar su propia capa de comunicación entre el servidor y el tiempo de ejecución. Esta nueva API está destinada a reemplazar las primitivas SSR actuales de Vite una vez que sea estable.

La nueva API trae muchos beneficios:

- Soporte para HMR durante SSR.
- Está desacoplado del servidor, por lo que no hay límite en cuántos clientes pueden usar un solo servidor: cada cliente tiene su propia caché de módulos (incluso puede comunicarse como desee, utilizando canal de mensajes/llamada fetch/ llamada de función directa/websocket).
- No depende de ninguna API integrada de node/bun/deno, por lo que puede ejecutarse en cualquier entorno.
- Es fácil de integrar con herramientas que tienen su propio mecanismo para ejecutar código (puede proporcionar un ejecutador para usar `eval` en lugar de `new AsyncFunction`, por ejemplo).

La idea inicial [fue propuesta por Pooya Parsa](https://github.com/nuxt/vite/pull/201) e implementada por [Anthony Fu](https://github.com/antfu) como el paquete [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) para [alimentar el SSR Dev de Nuxt 3](https://antfu.me/posts/dev-ssr-on-nuxt) y posteriormente también se usó como base para [Vitest](https://vitest.dev). Entonces, la idea general de vite-node ha sido probada extensivamente durante bastante tiempo. Esta es una nueva iteración de la API por [Vladimir Sheremet](https://github.com/sheremet-va), quien ya había implementado vite-node en Vitest y tomó los conocimientos para hacer la API aún más poderosa y flexible al agregarla al núcleo de Vite. La solicitud de cambio tardó un año en realizarse, puedes ver la evolución y las discusiones con los mantenedores del ecosistema [aquí](https://github.com/vitejs/vite/issues/12165).

Lee más en la [guía de la API de tiempo de ejecución de Vite](/guide/api-vite-runtime) y [danos tu opinión](https://github.com/vitejs/vite/discussions/15774).

## Características

### Mejora del soporte para `.css?url`

Importar archivos CSS como URLs ahora funciona de manera confiable y correcta. Este era el último obstáculo restante en el movimiento de Remix a Vite. Ver ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` ahora admite un callback

Los usuarios ahora pueden [proporcionar un callback](/config/build-options.html#build-assetsinlinelimit) que devuelve un booleano para optar por la inclusión o exclusión de la inserción de recursos específicos. Si se devuelve `undefined`, se aplica la lógica predeterminada. Ver ([#15366](https://github.com/vitejs/vite/issues/15366)).

### Mejora del HMR para importaciones circulares

En Vite 5.0, los módulos aceptados dentro de las importaciones circulares siempre desencadenaban una recarga completa de la página incluso si podían manejarse bien en el cliente. Esto ahora se hace flexible para permitir que el HMR se aplique sin una recarga completa de la página, pero si ocurre algún error durante el HMR, se recargará la página. Ver ([#15118](https://github.com/vitejs

/vite/issues/15118)).

### Soporte `ssr.external: true` para externalizar todos los paquetes SSR

Históricamente, Vite externalizaba todos los paquetes excepto los vinculados. Esta nueva opción se puede utilizar para forzar la externalización de todos los paquetes, incluidos los vinculados también. Esto es útil en pruebas dentro de monorepos donde queremos emular el caso habitual de todos los paquetes externalizados, o al usar `ssrLoadModule` para cargar un archivo arbitrario y siempre queremos externalizar paquetes ya que no nos importa el HMR. Ver ([#10939](https://github.com/vitejs/vite/issues/10939)).

### Exponer el método `close` en el servidor de vista previa

El servidor de vista previa ahora expone un método `close`, que desmontará adecuadamente el servidor, incluidas todas las conexiones de socket abiertas. Ver ([#15630](https://github.com/vitejs/vite/issues/15630)).

## Mejoras de rendimiento

Vite sigue mejorando con cada lanzamiento, y Vite 5.1 está repleto de mejoras de rendimiento. Medimos el tiempo de carga para 10K módulos (árbol de 25 niveles de profundidad) usando [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) para todas las versiones menores desde Vite 4.0. Este es un buen punto de referencia para medir el efecto del enfoque sin bundle de Vite. Cada módulo es un pequeño archivo TypeScript con un contador e importaciones a otros archivos en el árbol, por lo que esto mayormente mide el tiempo que lleva realizar las solicitudes de módulos separados. En Vite 4.0, cargar 10K módulos llevó 8 segundos en un M1 MAX. Tuvimos un avance en [Vite 4.3 donde nos enfocamos en el rendimiento](./anunciando-vite-4-3.md), y pudimos cargarlos en 6.35 segundos. En Vite 5.1, logramos otro salto de rendimiento. Vite ahora sirve los 10K módulos en 5.35 segundos.

![Progresión del tiempo de carga de 10K módulos de Vite](/vite5-1-10K-modules-loading-time.png)

Los resultados de esta prueba de referencia se ejecutan en Headless Puppeteer y son una buena manera de comparar versiones. Sin embargo, no representan el tiempo tal como lo experimentan los usuarios. Cuando ejecutamos los mismos 10K módulos en una ventana de incógnito en Chrome, tenemos:

| 10K Módulos                 | Vite 5.0 | Vite 5.1 |
| --------------------------- | :------: | :------: |
| Tiempo de carga             |  2892ms  |  2765ms  |
| Tiempo de carga (en caché)  |  2778ms  |  2477ms  |
| Recarga completa            |  2003ms  |  1878ms  |
| Recarga completa (en caché) |  1682ms  |  1604ms  |

### Ejecutar preprocesadores CSS en hilos

Vite ahora tiene soporte opcional para ejecutar preprocesadores CSS en hilos. Puedes habilitarlo usando [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers). Para un proyecto de Vuetify 2, el tiempo de inicio de dev se redujo en un 40% con esta función habilitada. Hay una [comparación de rendimiento para otras configuraciones en la solicitud de cambios](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). Ver ([#13584](https://github.com/vitejs/vite/issues/13584)). [Hacer comentarios](https://github.com/vitejs/vite/discussions/15835).

### Nuevas opciones para mejorar los inicios en frío del servidor

Puedes establecer `optimizeDeps.holdUntilCrawlEnd: false` para cambiar a una nueva estrategia de optimización de dependencias que puede ayudar en proyectos grandes. Estamos considerando cambiar a esta estrategia de forma predeterminada en el futuro. [Hacer comentarios](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### Resolución más rápida con comprobaciones en caché

La optimización `fs.cachedChecks` ahora está habilitada de forma predeterminada. En Windows, `tryFsResolve` fue ~14 veces más rápido con ella, y la resolución de ids en general obtuvo un aumento de velocidad de ~5 veces en el benchmark de triángulo. ([#15704](https://github.com/vitejs/vite/issues/15704))

### Mejoras de rendimiento internas

El servidor de desarrollo tuvo varias ganancias incrementales de rendimiento. Se añadió un nuevo middleware para cortocircuitar en 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). Evitamos `parseRequest` en caminos críticos ([#15617](https://github.com/vitejs/vite/issues/15617)). Ahora Rollup se carga de forma diferida de manera adecuada ([#15621](https://github.com/vitejs/vite/issues/15621)).

## Deprecaciones

Continuamos reduciendo la superficie de la API de Vite siempre que sea posible para hacer que el proyecto sea sostenible a largo plazo.

### Opción `as` en `import.meta.glob` es obsoleta

El estándar se trasladó a [Atributos de importación](https://github.com/tc39/proposal-import-attributes), pero no planeamos reemplazar `as` con una nueva opción en este momento. En su lugar, se recomienda que el usuario cambie a `query`. Ver ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Se eliminó el preempaquetado experimental en tiempo de compilación

El preempaquetado en tiempo de compilación, una característica experimental agregada en Vite 3, ha sido eliminada. Con Rollup 4 cambiando su analizador a nativo, y con Rolldown en desarrollo, tanto el rendimiento como la inconsistencia entre desarrollo y producción para esta característica ya no son válidos. Queremos seguir mejorando la consistencia entre desarrollo y producción, y hemos concluido que usar Rolldown para "preempaquetado durante el desarrollo" y "compilaciones de producción" es la mejor opción para el futuro. Rolldown también puede implementar el almacenamiento en caché de una manera mucho más eficiente durante la compilación que el preempaquetado de dependencias. Ver ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Involúcrate

Estamos agradecidos con los [900 colaboradores de Vite Core](https://github.com/vitejs/vite/graphs/contributors) y los mantenedores de complementos, integraciones, herramientas y traducciones que siguen impulsando el ecosistema hacia adelante. Si estás disfrutando de Vite, te invitamos a participar y ayudarnos. Consulta nuestra [Guía de Contribución](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md), y únete a [triage de problemas](https://github.com/vitejs/vite/issues), [revisión de solicitud de cambios](https://github.com/vitejs/vite/pulls), responder preguntas en las[Discusiones de GitHub](https://github.com/vitejs/vite/discussions) y ayudar a otros en la comunidad en [Vite Land](https://chat.vitejs.dev).

## Reconocimientos

Vite 5.1 es posible gracias a nuestra comunidad de colaboradores, mantenedores en el ecosistema y el [Equipo de Vite](/team). Un agradecimiento a las personas y empresas que patrocinan el desarrollo de Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), y [Astro](https://astro.build) por contratar miembros del equipo de Vite. Y también a los patrocinadores en [GitHub Sponsors de Vite](https://github.com/sponsors/vitejs), [Vite's Open Collective](https://opencollective.com/vite), y [GitHub Sponsors de Evan You](https://github.com/sponsors/yyx990803).
