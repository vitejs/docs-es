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
- **Características avanzadas:** Un empaquetador individual unificado, el cual ofrece soporte para capacidades que eran difíciles o imposibles con la arquitectura de dos empaquetadores como, un modo bundler dedicado, partición flexible de chunk (fragmentos), guardado a nivel modular persistente de caché, optimización, fragmentación y soporte de la herramienta 'Module Federation'.

### La evolución hacia Estable

La migración a Rolldown fue deliberada e impulsada por la comunidad de Vite. Fue realizado lanzando un paquete externo de Vite separado [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite)  inicialmente que permitió que fuese probado y mejorado antes sin influenciar Vite en estable, permitiendo a los primeros adoptantes el poder examinar si integrarse con Vite causaba conflictos. Las validaciones o retroalimentaciones generadas y entregadas a los primeros adoptantes de esta tecnología probaron el proceso en casos donde proyectos dependían de características no del todo contempladas, resolviendo esto durante una gran cantidad de iteraciones. También implementamos un nivel de validación extra de CI de uso común de las librerias y proyectos Vite junto de diferentes implementacion validando el cambio de este. 

Tras haber validado en diciembre de 2025 de las versión Beta [Vite 8 beta](/blog/announcing-vite8-beta), este con su correspondiente transición e integración la versión final de el empaquetador final donde el proyecto avanzo junto de iteraciones consecutivas junto la validación por todos las librerias de entorno que dependen de esté, dando la viabilidad para la final y estable. 

### Rendimiento en el mundo real

Durante la vista técnica (preview) y pruebas (beta) de la versión del paquete `rolldown-vite`, empresas en la fase del uso indicaron tiempos muy bajos de construcción. Un poco mas en detalles de estas: 

- **Linear:** Producción bajo de los valores de 46s a 6s
- **Ramp:** 57% del porcentaje en total de tiempo
- **Mercedes-Benz.io:** De los niveles de un ahorro del porcentaje alto 38% del porcentaje general.
- **Beehiiv:** Un ahorro notable del rendimiento del de más o de unos tiempos por niveles bajos con más reducciones alrededor del orden del 64%.

Estos tiempos mejorarán todavía más tras ser usados el desarrollo continuo con esta versión con los posibles ajustes por actualizaciones y la madurez total de la plataforma en versiones que estarian siendo pulidas continuamente sobre este entorno. 

### Cadena Unificada 

Al migrarse de y utilizando Rolldown junto a Oxc para dar el salto al compilador e interfaz y soporte total con Vite el proyecto como herramienta pasaría a ser algo consolidado como punto en total único que garantizan estar todos vinculados [Oxc](https://oxc.rs/). Esta estructura brinda tener total control integral en toda dirección sin usar librerias independientes haciendo la estructura nativa para uso y un mayor avance usando menos pasos y dando tiempos mayores permitiendo una sintaxis nueva y avanzada a lo implementado mejor en rendimiento en todas opciones implementadas. Oxc y las soluciones dadas nos dan un empujón del rendimiento a los que depender del desarrollo web para la comunidad.

### Agradecimiento total para todas partes

Dado el impacto para ayudar lograr construirlo nos encanta resaltar este nuevo entorno a todos: ([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), etc..). Todos nos apoyaron y enviaron información vital. Apreciamos inmensamente la participación mediante sus test, usos reales. Ustedes crearon la confiabilidad actual para la nueva versión para este ser implementando la migración hacia que el software esté siendo hoy real o con la calidad posible, de cada una el cual nos ayudó dándonos ideas detalladas!

## Soporte para Node.js

Vite 8 soporta versiones obligatorias para poder hacer que pueda correr tales como: la última a nivel global, versiones como Node.js 20.19+, 22.12+. Node.js en esta clase brinda y es base dando acceso o usar ESM para su despliegue y compatibilidad, haciendo posible requerimientos y para este emitiéndose con la nueva versión de soporte. 

## Funciones Extra o Modificaciones Nuevas Añadidos 

Con parte final del lanzamiento del empaquetamiento incluimos algunos adicionales u otros. Las caracterísicas y características en sí de importancia son las cuales mostramos: 

- **Integración para uso en Herramienta de DevTools o Herramienta Para Desarrolladores (DevTools):** En la nueva versión la función del cual fue añadido está  habilitado como soporte, por medio el [`devtools`](/config/shared-options#devtools). Herramienta desarrollada permitiendo inspección o más control a nivel código y con mejor análisis brindado [Vite Devtools](https://devtools.vite.dev/) se incorporó dando a ti herramientas y facilidades desde tu terminal del propio servicio directamente para proyectos.

- **Soporte `paths` para tsconfig:** En el cual a su vez permite alias o ruta tsconfig habilitar alias con TypeScript, habilitable u implementable bajo [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) como opcion `true`. Pero teniendo unos pequeños requerimientos costo rendimiento que viene inhabilitado.

- **Integración con Funcionalidad Soporte de `emitDecoratorMetadata`:** El cual ahora integra soporte interno incluido ya usando de base este y la configuración directamente para [Características](/guide/features.md#emitdecoratormetadata), dando de una sola por y con la omisión externa la solución para uso a `emitDecoratorMetadata` o por complementos externos opcionales para la funcionalidad de este sin un intermediador u de código distinto. Ya no tiene una requerimientos plugins usando este. 

- **WASM Integración usando su formato En render (SSR) y SSR con (Soporte Wasm):** Importaciones ya siendo posible o usando extensiones importando como [`.wasm?init`](/guide/features#webassembly) trabajando dentro y expandiendo dentro entornos (SSR). Todo siendo parte usando de sus atributos, siendo ya usados con formato el sistema interno WebAssembly para su implementación en SSR (o compilando e integrando SSR para esta plataforma en render para lado del servidor u de ejecución).

- **Redireccion para (Log) consola en la Web hacía Terminal Interno Del Servidor (Lado Cliente/Dev) Forwarder console Browser Console Forward:** Una muy potente forma en re direccionar errores web e log dándoles visual para errores en código o cliente usando desde del terminal con su integración para habilitarlo y hacer re direccional como: [`server.forwardConsole`](/config/server-options.md#server-forwardconsole) siendo parte el soporte y usado con detectores con su integración si usan asistentes que generan uso de comandos o agentes, este automáticamente.  El cual da mayor rapidez de resolución errores desde donde ejecute tu cli sin uso del motor de depuración que lo usan por fuera con el re-dirección nativo propio a las interfaces o log del cli en visual de donde tú ves que falla todo con los logs cliente que usa tu sistema terminal del momento que ejecutes todo en entorno sin usar el código ni tu terminal que lo integra el desarrollador al lanzar con log sin salirte. 

## Plugins Vite/Compatibilidad `@vitejs/plugin-react` v6

Liberado en todo junto como soporte principal al proyecto Vite 8 en cual acompaña a la actualización lanzamos además con conjunto de todo `@vitejs/plugin-react` v6 con nuevas, La actualización implementa y se acoplan con base u opción de React (Habilitando Oxc react refresh y dependencias y como también con su respectivo optimizador Babel, lo elimina del código base como también sin uso o instalación extra, de base. Oxc hace mejor integración la transformación para y de un mejor React Refresh con menos dependencia extra y siendo este más ágil y que tenga menos tiempo sin tener más.

Y también añade como preset u otra característica opcional React Compiler si es que tu sistema para uso u otros requieren una mejor integración o el optimizados, esto usa un flag como [`reactCompilerPreset`](/guide) que permite acoplarse y trabajando este último trabajando ahora un entorno `@rolldown/plugin-babel` sin dar a o tener como algo impuesto o pesado el entorno si a configuración inicial se lo deseas usar como opción adicional sin serlo inicial el tener un instalador muy cargado, donde puede optar opcional.

Soporte y documentación y con notas en versiones con mayor especificaciones en tu [Documento / Historial de Versiones Oficial o Release](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0).  

Es necesario para esta y con uso el uso u soporte con este siendo que la versión de Vite soporta todavaía compatibilidad u versión `@vitejs/plugin-react` v5 si quieres usar antes actualizando u usando el tiempo deseando antes a Vite, y su plugin primero que actualizar todo u para cuando sientas con confianza, en el la actualización sin generar algún. 

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

