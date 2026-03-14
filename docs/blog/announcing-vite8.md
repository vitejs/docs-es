---
title: ¡Vite 8.0 ya está aquí!
author:
  name: El Equipo de Vite
date: 2026-03-12
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anuncio de Vite 8
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Anuncio de la versión Vite 8
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 8.0 ya está aquí!

_12 de marzo de 2026_

![Vite 8 Announcement Cover Image](/og-image-announcing-vite8.webp)

¡Estamos encantados de anunciar la versión estable de Vite 8! Cuando Vite se lanzó por primera vez, hicimos una apuesta pragmática por dos empaquetadores (bundlers): esbuild para la velocidad durante el desarrollo, y Rollup para la construcción optimizada en producción. Esa apuesta nos ha servido bien durante años. Estamos muy agradecidos a los mantenedores de Rollup y esbuild. Vite no habría tenido éxito sin ellos. Hoy, se resuelven en uno solo: Vite 8 se distribuye con [Rolldown](https://rolldown.rs/) como su único y unificado empaquetador basado en Rust, ofreciendo construcciones hasta 10-30x más rápidas manteniendo compatibilidad total con los plugins. Este es el cambio arquitectónico más significativo desde Vite 2.

Vite se descarga ahora 65 millones de veces a la semana, y el ecosistema continúa creciendo con cada versión. Para ayudar a los desarrolladores a navegar por el paisaje en constante expansión de los plugins, también hemos lanzado [registry.vite.dev](https://registry.vite.dev), un directorio de plugins de búsqueda para Vite, Rolldown y Rollup que recopila datos de los plugins de npm todos los días.

Enlaces rápidos:

- [Documentación](/)
- Traducciones: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [Guía de Migración](/guide/migration)
- [Historial de Cambios en GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Juega en línea con Vite 8 usando [vite.new](https://vite.new) o crea una aplicación Vite localmente con tu framework preferido ejecutando `pnpm create vite`. Revisa la [Guía de Introducción](/guide/) para más información.

Te invitamos a ayudarnos a mejorar Vite (uniéndote a los más de [1.2K colaboradores de Vite Core](https://github.com/vitejs/vite/graphs/contributors)), nuestras dependencias, o proyectos en nuestro ecosistema. Descubre más en nuestra [Guía de Contribución](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Una buena forma de comenzar es haciendo triaje en las [incidencias](https://github.com/vitejs/vite/issues), [revisando PRs](https://github.com/vitejs/vite/pulls), mandando PRs para pruebas basándose en las incidencias abiertas, y apoyando a otros en [Discusiones](https://github.com/vitejs/vite/discussions) o en el foro de ayuda de [Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Si tienes inquietudes generales, únete a nuestra [comunidad de Discord](https://chat.vite.dev) y habla con nosotros en el canal de [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Mantente actualizado y conéctate con otros creadores utilizando Vite siguiéndonos en [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), o [Mastodon](https://webtoo.ls/@vite).

## El Vite impulsado por Rolldown

### El problema

Desde sus primeras versiones, Vite confió en dos empaquetadores separados para servir diferentes necesidades. [esbuild](https://esbuild.github.io/) manejaba la compilación rápida durante el desarrollo (preempaquetado de dependencias y las transformaciones de TypeScript/JSX) que hacían que la experiencia de desarrollo se sintiera instantánea. [Rollup](https://rollupjs.org/) manejaba el empaquetado para producción, la división en fragmentos (chunking), y la optimización, y su rica API impulsaba toda el ecosistema de los plugins de Vite.

Este enfoque de doble empaquetador sirvió bien a Vite durante años. Nos permitió centrarnos en la experiencia de desarrollador y la orquestación en lugar de reinventar el análisis sintáctico y de empaquetado desde cero. Pero vino con contrapartidas. Dos diferentes procesos (pipelines) de transformación significaron dos sistemas de plugins separados, y una cantidad cada vez mayor de código pegamento para mantener ambos pipelines sincronizados. Los casos atípicos alrededor del manejo inconsistente de módulos se acumularon con el tiempo, y cualquier arreglo o alineación en los dos pipelines conllevaba el riesgo de introducir diferencias no intencionales.

### La solución

[Rolldown](https://rolldown.rs/) es un empaquetador basado en Rust creado por el equipo de [VoidZero](https://voidzero.dev) para afrontar exactamente estos retos. Fue diseñado con tres objetivos:

- **Rendimiento:** Escrito en Rust, Rolldown opera a nivel nativo. En pruebas de rendimiento benchmark, es [10-30x más rápido que Rollup](https://github.com/rolldown/benchmarks) igualando al nivel de rendimiento de esbuild.
- **Compatibilidad:** Rolldown soporta la misma API de plugins que Rollup y Vite. La mayoría de los plugins de Vite funcionan con Vite 8 sin necesidad de un cambio adicional.
- **Características avanzadas:** Un empaquetador individual unificado abre capacidades que eran difíciles o imposibles con la arquitectura de dos empaquetadores, incluyendo el modo de empaquetado completo (full bundle mode), división de fragmentos (chunk splitting) más flexible, caché persistente a nivel de módulo, y soporte para Module Federation.

### La evolución hacia Estable

La migración a Rolldown fue deliberada e impulsada por la comunidad. Primero, un paquete separado [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) fue publicado como una vista previa técnica, permitiendo a los primeros adoptadores probar la integración de Rolldown sin afectar a la versión estable de Vite. Los comentarios de esos primeros adoptadores fueron invaluables. Impulsaron la integración a través de bases de código del mundo real de todas las formas y tamaños, haciendo aflorar casos límite y problemas de compatibilidad que pudimos abordar antes de un lanzamiento más amplio. También configuramos un entorno de pruebas continuas (CI) dedicado para validar los plugins clave y frameworks de Vite mediante el nuevo bundler, detectando regresiones de forma temprana y construyendo confianza en el camino hacia la migración.

En diciembre de 2025, publicamos la [beta de Vite 8](/blog/anunciando-vite8-beta) con Rolldown ya completamente integrado. Durante el período beta, Rolldown progresó desde beta a una "release candidate", con continuas mejoras impulsadas por las pruebas y los comentarios de la comunidad de Vite.

### Rendimiento en el mundo real

Durante las fases de vista previa técnica y beta de `rolldown-vite`, varias empresas reportaron reducciones medibles en los tiempos de construcción de producción:

- **Linear:** Tiempos de construcción cayeron de 46s a 6s
- **Ramp:** 57% de reducción en el tiempo de construcción
- **Mercedes-Benz.io:** Hasta 38% de reducción en el tiempo de construcción
- **Beehiiv:** 64% de reducción en el tiempo de construcción

Para proyectos grandes, el impacto puede ser especialmente notable, y esperamos aún mayores mejoras a medida que Rolldown continúe evolucionando.

### Una cadena de herramientas unificada

Con Vite 8, Vite se convierte en el punto de entrada a una cadena de herramientas completa con equipos que colaboran estrechamente: la herramienta de compilación (Vite), el empaquetador (Rolldown) y el compilador ([Oxc](https://oxc.rs/)). Esta alineación asegura un comportamiento consistente a lo largo de toda la pila técnica, desde el análisis sintáctico (parsing) y resolución, hasta la transformación y minificación. También significa que podemos adoptar rápidamente nuevas especificaciones del lenguaje a medida que JavaScript evoluciona. Y al integrarnos profundamente entre capas, podemos buscar optimizaciones que antes estaban fuera de alcance, como aprovechar el análisis semántico de Oxc para un mejor tree-shaking en Rolldown.

### Gracias a la comunidad

Nada de esto habría sido posible sin la comunidad en general. Queremos extender nuestro profundo agradecimiento a los equipos de frameworks ([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), y muchos más) quienes probaron `rolldown-vite` tempranamente, reportaron errores detallados y trabajaron con nosotros para resolver problemas de compatibilidad. Estamos igualmente agradecidos a cada desarrollador que probó la beta, compartió sus mejoras en tiempos de construcción y reportó las asperezas que nos ayudaron a pulir esta versión. Su disposición para probar la migración en proyectos reales ayudó a hacer la transición a Rolldown más fluida y confiable.

## Soporte para Node.js

Vite 8 requiere Node.js 20.19+ o 22.12+, los mismos requerimientos que Vite 7. Estos rangos aseguran que Node.js soporte `require(esm)` sin necesidad de un flag, permitiendo que Vite se distribuya exclusivamente como ESM.

## Funciones adicionales

Además de la integración de Rolldown, Vite 8 incluye varias características notables:

- **Devtools integradas:** Vite 8 incluye la opción [`devtools`](/config/shared-options#devtools) para habilitar [Vite Devtools](https://devtools.vite.dev/), herramientas de desarrollo para depuración y análisis. Vite Devtools proporciona información más profunda sobre tus proyectos impulsados por Vite directamente desde el servidor de desarrollo.

- **Soporte nativo de `paths` en tsconfig:** Los desarrolladores pueden habilitar la resolución de alias de rutas de TypeScript configurando [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) a `true`. Esto tiene un pequeño costo de rendimiento y no está habilitado por defecto.

- **Soporte para `emitDecoratorMetadata`:** Vite 8 ahora tiene soporte automático integrado para la opción `emitDecoratorMetadata` de TypeScript, eliminando la necesidad de plugins externos. Consulta la página de [Características](/guide/features.md#emitdecoratormetadata) para más detalles.

- **Soporte Wasm en SSR:** Las importaciones [`.wasm?init`](/guide/features#webassembly) ahora funcionan en entornos SSR, expandiendo la funcionalidad de WebAssembly de Vite al renderizado del lado del servidor.

- **Reenvío de consola del navegador:** Vite 8 puede reenviar los logs y errores de la consola del navegador a la terminal del servidor de desarrollo. Esto es especialmente útil al trabajar con agentes de codificación (coding agents), ya que los errores de ejecución del cliente se hacen visibles en la salida del CLI. Habilítalo con [`server.forwardConsole`](/config/server-options.md#server-forwardconsole), que se activa automáticamente cuando se detecta un agente de codificación.

## `@vitejs/plugin-react` v6

Junto con Vite 8, estamos lanzando `@vitejs/plugin-react` v6. El plugin usa Oxc para la transformación de React Refresh. Babel ya no es una dependencia y el tamaño de instalación es menor.

Para proyectos que necesitan el [React Compiler](https://react.dev/learn/react-compiler), la v6 proporciona un helper `reactCompilerPreset` que funciona con `@rolldown/plugin-babel`, dándote una vía de activación explícita sin sobrecargar la configuración por defecto.

Consulta las [notas de la versión](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0) para más detalles.

Ten en cuenta que la v5 sigue funcionando con Vite 8, por lo que puedes actualizar el plugin después de actualizar Vite.

## Mirando hacia el futuro

La integración de Rolldown abre la puerta a mejoras y optimizaciones. Esto es en lo que estamos trabajando ahora:

- **Modo "Full Bundle"** (experimental): Este modo empaqueta módulos durante el desarrollo, de forma similar a las construcciones de producción. Los resultados preliminares muestran un inicio del dev server 3 veces más rápido, recargas completas un 40% más rápidas, y 10 veces menos solicitudes de red. Esto tiene un impacto especialmente notable en proyectos grandes donde el enfoque de desarrollo no empaquetado alcanza límites de escalabilidad.

- [**Transferencia AST sin procesar (Raw AST transfer)**](https://github.com/oxc-project/oxc/issues/2409): Permite que los plugins de JavaScript accedan al AST producido en Rust con un costo mínimo de serialización, acortando la brecha de rendimiento entre las partes internas de Rust y el código del plugin JS.

- [**Transformaciones nativas MagicString**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): Permite transformaciones personalizadas donde la lógica reside en JavaScript pero el cálculo del string manipulation se ejecuta en Rust.

- **Estabilizando la API Environment**: Estamos trabajando para que la API de Entorno sea estable. El ecosistema ha comenzado reuniones regulares para colaborar mejor de forma conjunta.

## Tamaño de Instalación

Queremos ser transparentes sobre los cambios en el tamaño de instalación de Vite. Vite 8 es aproximadamente 15 MB más grande que Vite 7 por sí solo. Esto proviene de dos fuentes principales:

- **~10 MB de lightningcss**: Anteriormente una peer dependency opcional, lightningcss ahora es una dependencia normal para proporcionar una mejor minificación de CSS por defecto.
- **~5 MB de Rolldown**: El binario de Rolldown es más grande que esbuild + Rollup principalmente debido a optimizaciones de rendimiento que favorecen la velocidad sobre el tamaño del binario.

Continuaremos monitoreando y trabajando para reducir el tamaño de la instalación a medida que Rolldown madure.

## Migrando a Vite 8

Para la mayoría de los proyectos, actualizar a Vite 8 debería ser un proceso sin inconvenientes. Hemos construido una capa de compatibilidad que convierte automáticamente la configuración existente de `esbuild` y `rollupOptions` a sus equivalentes de Rolldown y Oxc, por lo que muchos proyectos funcionarán sin cambios de configuración.

Para proyectos más grandes o complejos, recomendamos un proceso de migración progresiva: cambiar primero de `vite` al paquete `rolldown-vite` usando Vite 7 para aislar cualquier problema de compatibilidad específico a Rolldown, y luego hacer la actualización a Vite 8. Este acercamiento en dos pasos ayuda a que identificar errores u incompatibilidades de Rolldown sea independiente de las otras adiciones al ecosistema o a configuraciones en versiones de las actualizaciones.

Por favor, revisa detalladamente la [Guía de Migración](/guide/migration) antes de actualizar. La lista completa de todos los cambios de Vite está adjunta en el [Registro de Cambios de Vite 8](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Gracias, Rollup y esbuild

A medida que Vite avanza hacia Rolldown, queremos tomarnos un momento para expresar nuestra profunda gratitud a los dos proyectos que hicieron posible a Vite.

Rollup ha sido el empaquetador de producción de Vite desde el principio. Su elegante diseño de API de plugins demostró estar tan bien concebido que Rolldown lo adoptó como propio, y todo el ecosistema de plugins de Vite existe gracias a los cimientos que construyó Rollup. La calidad de la arquitectura de Rollup moldeó la forma en que Vite piensa sobre la extensibilidad. Gracias, [Rich Harris](https://github.com/Rich-Harris) por crear Rollup, y a [Lukas Taegert-Atkinson](https://github.com/lukastaegert) y al equipo de Rollup por mantenerlo y evolucionarlo hasta convertirlo en algo que ha tenido un impacto tan duradero en el ecosistema de herramientas web.

esbuild potenció la experiencia de desarrollo increíblemente rápida de Vite desde sus primeros días: el preempaquetado de dependencias, las transformaciones de TypeScript y JSX que se completaban en milisegundos. esbuild demostró que las herramientas de construcción podrían ser increíblemente más rápidas, y su velocidad estableció el estándar que inspiró a toda una generación de herramientas basadas en Rust y Go. Gracias, [Evan Wallace](https://github.com/evanw), por mostrarnos a todos lo que era posible.

Sin estos dos proyectos, Vite no existiría como lo hace hoy. Incluso a medida que avanzamos con Rolldown, la influencia de Rollup y esbuild está profundamente arraigada en el ADN de Vite, y estamos agradecidos por todo lo que le han dado al ecosistema. Puedes obtener más información sobre todos los proyectos y personas de los que depende Vite en la [página de Agradecimientos](/acknowledgements).

## Agradecimientos

Vite 8 fue liderado por [sapphi-red](https://github.com/sapphi-red) y el [Equipo de Vite](/team) con la ayuda de la amplia comunidad de contribuyentes, mantenedores derivados y autores de plugins. Queremos agradecer al [equipo de Rolldown](https://rolldown.rs/team) por su estrecha colaboración. También estamos especialmente agradecidos a todos los que participaron en la vista previa técnica de `rolldown-vite` y el período beta de Vite 8. Sus pruebas, informes de errores y comentarios hicieron posible la migración a Rolldown y dieron forma a nuestro avance sobre esta versión.

Vite es traído a ti por [VoidZero](https://voidzero.dev), en asociación con [Bolt](https://bolt.new/) y [NuxtLabs](https://nuxtlabs.com/). También queremos agradecer a nuestros patrocinadores en [los Sponsors en GitHub](https://github.com/sponsors/vitejs) y [Vite's Open Collective](https://opencollective.com/vite).

