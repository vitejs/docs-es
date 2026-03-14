# Por qué usar Vite

A medida que las aplicaciones web han crecido en tamaño y complejidad, las herramientas utilizadas para construirlas han batallado por mantenerse al día. Los desarrolladores que trabajan en proyectos grandes han experimentado inicios muy lentos del servidor de desarrollo, actualizaciones en caliente lentas y largos tiempos de compilación para producción. Cada generación de herramientas de compilación ha mejorado con respecto a la anterior, pero estos problemas han persistido.

Vite fue creado para abordar esto. En lugar de mejorar de forma incremental los enfoques existentes, replanteó cómo debería servirse el código durante el desarrollo. Desde entonces, Vite ha evolucionado a través de múltiples versiones mayores, adaptándose cada vez a las nuevas capacidades del ecosistema: desde aprovechar los módulos ES nativos en el navegador, hasta adoptar una cadena de herramientas completamente impulsada por Rust.

Hoy en día, Vite impulsa a muchos frameworks y herramientas. Su arquitectura está diseñada para evolucionar con la plataforma web en lugar de encerrarse en un solo enfoque, convirtiéndolo en una base sobre la que puedes construir a largo plazo.

## Los Orígenes

Cuando Vite se creó por primera vez, los navegadores acababan de obtener un amplio soporte para [módulos ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (ESM), una forma de cargar archivos JavaScript directamente, sin necesidad de una herramienta para agruparlos en un solo archivo primero. Las herramientas de compilación tradicionales (a menudo llamadas _bundlers_) procesarían tu aplicación completa por adelantado antes de que se pudiera mostrar algo en el navegador. Cuanto más grande era la aplicación, más tiempo tenías que esperar.

Vite tomó un enfoque diferente. Dividió el trabajo en dos partes:

- **Dependencias** (bibliotecas que rara vez cambian) son [preempaquetadas](./dep-pre-bundling.md) una vez usando herramientas nativas rápidas, por lo que están listas al instante.
- **Código fuente** (el código de tu aplicación que cambia con frecuencia) se sirve bajo demanda sobre ESM nativo. El navegador carga solo lo que necesita para la página actual, y Vite transforma cada archivo a medida que se solicita.

Esto significaba que el inicio del servidor de desarrollo era casi instantáneo, independientemente del tamaño de la aplicación. Cuando editabas un archivo, Vite usaba el [Reemplazo de Módulos en Caliente](./features.md#hot-module-replacement) (HMR) sobre ESM nativo para actualizar solo ese módulo en el navegador, sin recargar toda la página y sin esperar a una reconstrucción completa.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_En un servidor de desarrollo basado en un bundler, toda la aplicación se empaqueta antes de poder servirla._

<svg-image :svg="esmSvg" />

_En un servidor de desarrollo basado en ESM, los módulos se sirven bajo demanda a medida que el navegador los solicita._

Vite no fue la primera herramienta en explorar este enfoque. [Snowpack](https://www.snowpack.dev/) fue pionero en el desarrollo sin empaquetar e inspiró el preempaquetado de dependencias de Vite. [WMR](https://github.com/preactjs/wmr) del equipo de Preact inspiró la API de plugins universal que funciona tanto en desarrollo como en compilación. [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) influyó en la arquitectura del servidor de Vite 1.0. Vite se basó en estas ideas y las llevó hacia adelante.

Aunque el ESM sin empaquetar funciona bien durante el desarrollo, publicarlo en producción sigue siendo ineficiente debido a los viajes de ida y vuelta de red adicionales de las importaciones anidadas. Esa es [la razón por la cual el empaquetado sigue siendo necesario](https://rolldown.rs/in-depth/why-bundlers) para configuraciones óptimas de producción.

## Creciendo con el ecosistema

A medida que Vite maduró, los frameworks comenzaron a adoptarlo como su capa de compilación. Su [API de plugins](./api-plugin.md), basada en las convenciones de Rollup, hizo que la integración fuera natural sin requerir que los frameworks sortearan los componentes internos de Vite. [Nuxt](https://nuxt.com/), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build/), [React Router](https://reactrouter.com/), [Analog](https://analogjs.org/), [SolidStart](https://start.solidjs.com/) y otros eligieron a Vite como su base. Herramientas como [Vitest](https://vitest.dev/) y [Storybook](https://storybook.js.org/) también se basaron en él, extendiendo el alcance de Vite más allá del empaquetado de aplicaciones. Los frameworks de backend como [Laravel](https://laravel.com/docs/vite) y [Ruby on Rails](https://vite-ruby.netlify.app/) integraron Vite para sus recolecciones de activos frontend.

Este crecimiento no fue unidireccional. El ecosistema formó a Vite tanto como Vite formó al ecosistema. El equipo de Vite ejecuta [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci), que prueba los principales proyectos del ecosistema contra cada cambio de Vite. La salud del ecosistema no es una idea de último momento. Es parte del proceso de lanzamiento.

## Una cadena de herramientas unificada

Vite originalmente dependía de dos herramientas separadas tras bastidores: [esbuild](https://esbuild.github.io/) para una compilación rápida durante el desarrollo, y [Rollup](https://rollupjs.org/) para una optimización exhaustiva en compilaciones de producción. Esto funcionaba, pero mantener dos canales introdujo inconsistencias: diferentes comportamientos de transformación, sistemas de plugins separados y un creciente código utilizado para mantenerlos alineados.

[Rolldown](https://rolldown.rs/) se creó para unificar ambos en un solo empaquetador: escrito en Rust para lograr una velocidad nativa, y compatible con la misma API de plugins en la que ya confiaba el ecosistema. Utiliza [Oxc](https://oxc.rs/) para el análisis lexicográfico, la transformación y la minificación. Esto le da a Vite una cadena de herramientas de extremo a extremo donde la herramienta de análisis, el empaquetador y el compilador se mantienen juntos y evolucionan como una unidad.

El resultado es un canal de integración consistente desde el desarrollo hasta la [producción](./build.md). La migración se realizó con cuidado: primero se publicó una [vista previa técnica](https://voidzero.dev/posts/announcing-rolldown-vite) para que los primeros usuarios pudieran validar el cambio, el CI del ecosistema detectó problemas de compatibilidad en etapas tempranas, y una capa de compatibilidad preservó las configuraciones existentes.

## Hacia dónde se dirige Vite

La arquitectura de Vite sigue evolucionando. Varios esfuerzos están moldeando su futuro:

- **Modo de empaquetador completo (Full bundle mode)**: El ESM sin empaquetar era el compromiso correcto cuando Vite fue creado porque ninguna herramienta era lo suficientemente rápida como para contar con HMR y con las capacidades de plugins requeridas para empaquetar de forma óptima durante el desarrollo. Rolldown cambia esto. Ya que bases de código excepcionalmente extensas pueden experimentar cargas de página lentas debido a la alta cantidad de peticiones de red sin empaquetar, el equipo está explorando un modo en el que el servidor de desarrollo empaqueta el código de manera similar a la producción, reduciendo la sobrecarga de la red.

- **API del Entorno**: En lugar de tratar "cliente" y "SSR" como los únicos dos objetivos de compilación, la [API de Entornos](./api-environment-instances.md) permite a los frameworks definir entornos personalizados (runtimes de edge, service workers, y otros destinos de despliegue), cada uno con sus propias reglas de resolución modular y ejecución. A medida que dónde y cómo se ejecuta el código sigue diversificándose, el modelo de Vite se expande junto con él.

- **Evolucionando con JavaScript**: Ya que Oxc y Rolldown colaboran estrechamente con Vite, las nuevas características del lenguaje y los estándares se pueden adoptar rápidamente en toda la cadena de herramientas, sin esperar a dependencias de terceros.

El objetivo de Vite no es ser la herramienta definitiva, sino ser una que continúe evolucionando con la plataforma web y con los desarrolladores que construyen sobre ella.
