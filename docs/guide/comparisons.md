# Comparaciones con otras soluciones de no compilación

## Snowpack

[Snowpack](https://www.snowpack.dev/) también es un servidor de desarrollo ESM nativo sin empaquetado que es muy similar en alcance a Vite. Aparte de los diferentes detalles de implementación, los dos proyectos comparten mucho en términos de ventajas técnicas sobre las herramientas tradicionales. El preempaquetado de dependencias de Vite también está inspirado en Snowpack v1 (ahora [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Algunas de las principales diferencias entre los dos proyectos son:

**Compilación en producción**

La salida de compilación predeterminada de Snowpack es desempaquetada: se transforma cada archivo en módulos compilados separados, que luego se pueden alimentar a diferentes "optimizadores" que realizan el empaquetado real. El beneficio de esto es que se puede elegir entre diferentes empaquetadores finales para satisfacer necesidades específicas (por ejemplo, webpack, Rollup o incluso esbuild), la desventaja es que es una experiencia un poco fragmentada; por ejemplo, el optimizador de esbuild aún es inestable, el optimizador de Rollup no se mantiene oficialmente y los diferentes optimizadores tienen diferentes resultados y configuraciones.

Vite opta por tener una integración más profunda con un solo empaquetador (Rollup) para brindar una experiencia más optimizada. Esto también permite que Vite admita una [API de complementos universal](./api-plugin) que funciona tanto para desarrollo como para compilación.

Debido a un proceso de compilación más integrado, Vite admite una amplia variedad de funciones que actualmente no están disponibles en los optimizadores de compilación de Snowpack:

- [Soporte multipáginas](./build#aplicacion-multipaginas)
- [Modo Librería](./build#modo-libreria)
- [División automática de código CSS](./features#division-de-codigo-css)
- [Carga optimizada de fragmentos asíncronos](./features#optimizacion-de-carga-de-fragmentos-asincronos)
- [Plugin de modo legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial que genera paquetes duales modernos/heredados y entrega automáticamente el paquete correcto según la compatibilidad del navegador.

**Preempaquetado de dependencias más rápido**

Vite usa [esbuild](https://esbuild.github.io/) en lugar de Rollup para el preempaquetado de dependencias. Esto da como resultado mejoras significativas en el rendimiento en términos de inicio en frío del servidor y reempaquetado en invalidaciones de dependencias.

**Soporte Monorepo**

Vite está diseñado para manejar configuraciones de monorepos y tenemos usuarios que lo usan con éxito con monorepos basados ​​en Yarn, Yarn 2 y PNPM.

**Soporte de preprocesadores CSS**

Vite proporciona un soporte más refinado para Sass y Less, incluida una resolución `@import` mejorada (aliases y dependencias npm) y [reajuste automático de `url()` para archivos incrustados](./features#incrustacion-y-rebase-de-import).

**Soporte de primera clase Vue**

Vite se creó inicialmente para servir como la base futura de las herramientas [Vue.js](https://vuejs.org/). Aunque a partir de 2.0 Vite ahora es completamente independiente del marco de desarrollo, el complemento oficial de Vue aún brinda soporte de primera clase para el formato de componente de archivo único de Vue, cubriendo todas las funciones avanzadas como resolución de referencias de plantilla de recursos, `<script setup>`, `<style module>`, bloques personalizados y más. Además, Vite proporciona HMR optimizado para el formato de componente de archivo único de Vue. Por ejemplo, modificar el `<template>` o `<style>` de un componente de archivo único de Vue realizará actualizaciones en caliente sin restablecer su estado.

## WMR

[WMR](https://github.com/preactjs/wmr) del equipo de Preact proporciona un conjunto de funciones similar, y el soporte de Vite 2.0 para la interfaz de complemento de Rollup está inspirado en él.

WMR está diseñado principalmente para proyectos [Preact](https://preactjs.com/) y ofrece funciones más integradas, como prerenderizado. En términos de alcance, está más cerca de un marco meta de Preact, con el mismo énfasis en el tamaño compacto que el mismo Preact. Si estás utilizando Preact, es probable que WMR ofrezca una experiencia más afinada.

## @web/servidor-dev

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (anteriormente `es-dev-server`) es un gran proyecto y la configuración del servidor de Koa en Vite 1.0 fue inspirada de él.

`@web/dev-server` es un nivel un poco más bajo en términos de alcance. No proporciona integraciones de marco de desarrollo oficiales y requiere configuración manual de Rollup para la compilación en producción.

En general, Vite es una herramienta más destinada/de alto nivel que tiene como objetivo proporcionar un flujo de trabajo más listo para usar. Dicho esto, el proyecto general `@web` contiene muchas otras herramientas excelentes que también pueden beneficiar a los usuarios de Vite.
