---
title: Anunciando Vite 2.0
author:
  - name: El equipo de Vite
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 2.0
  - - meta
    - property: og:url
      content: https://es.vite.dev/blog/anunciando-vite2
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 2
---

# Anunciando Vite 2.0

_16 de febrero de 2021_: mira el [anuncio de Vite 3.0](./anunciando-vite3.md)

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

¡Hoy estamos emocionados de anunciar el lanzamiento oficial de Vite 2.0!

Vite (palabra francesa que significa "rápido", pronunciado como `/vit/`) es un nuevo tipo de herramienta de compilación para el desarrollo web frontend. Piensa en un conjunto pre configurado de servidor web + empaquetador, pero más ligero y rapido. Este aprovecha el soporte de los navegadores para los [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) y herramientas escritas en lenguajes para compilar-a-nativo como [esbuild](https://esbuild.github.io/) para entregar una rápida y moderna experiencia de desarrollo.

Para tener una idea de cuan rápido es Vite, revisa este [video de comparaciones](https://twitter.com/amasad/status/1355379680275128321) arrancando una aplicacián de React en Repl.it usando Vite vs. `create-react-app` (CRA).

Si nunca antes habías escuchado de Vite y quieres aprender más sobre este, revisa la [razón detrás del proyecto](/guide/why.html). Si estás interesado en como Vite se diferencia de otras herramientas similares, revisa las [comparaciones](/guide/comparisons.html).

## Que hay de nuevo en la versión 2.0

Desde que decidimos refactorizar completamente los archivos internos antes que la versión 1.0 salga de RC, esta es la primera publicación estable de Vite. Dicho esto, Vite 2.0 viene con muchas grandes mejoras sobre su versión anterior.

### Núcleo independiente del marco de trabajo

La idea original de Vite comenzó como un [prototipo trucado que entregaba componentes de una pagina de Vue sobre ESM nativo](https://github.com/vuejs/vue-dev-server). Vite 1 fue la continuación de esa idea con HMR implementado en base a esta.

Vite 2.0 toma lo que aprendimos durante este recorrido y es rediseñado desde cero con una arquitectura interna más robusta. Ahora es completamente independiente del marco de trabajo, y todos lo que es específico para cada marco de trabajos es delegado a los plugins. Ahora hay [plantillas oficiales para Vue, React, Preact, Lit Element](https://github.com/vitejs/vite/tree/main/packages/create-vite), y esfuerzos en curso hechos por la comunidad para la integración con Svelte.

### Nuevo formato de Plugin y API

Inspirado por [WMR](https://github.com/preactjs/wmr), el nuevo sistema de plugins extiende la interfaz de plugins de Rollup y es [compatible con varios plugins de Rollup](https://vite-rollup-plugins.patak.dev/) por defecto. Los plugins pueden usar hooks de Rollup compatibles, adicionalmente con hooks específicos de Vite y propiedades para ajustar el comportamiento específico de Vite (ej. diferenciar desarrollo vs compilación o manejo personalizado del HMR).

La [API programable](https://vite.dev/guide/api-javascript.html) también fue mejorada para facilitar herramientas de alto nivel / marcos de trabajos construidos con base en Vite.

### Preempaquetado de dependencias impulsado por esbuild

Ya que Vite un servidor de desarrollo nativo de ESM, este pre-empaqueta dependencias para reducir el número de llamadas del navegador y manejar la conversión de CommonJS hacia ESM. Previamente, Vite hacia esto usando Rollup, y en la versión 2.0 ahora usa `esbuild` el cual resulta en un preempaquetado de dependencias 10-100x veces más rápido. Como referencia, arrancando en frío una aplicación de prueba con dependencias grandes como React Material UI anteriormente tomaba 28 segundos en una MacBook Pro con M1 y ahora toma ~1.5 segundos. Puedes esperar mejoras similares si estás cambiando desde una configuración basada en un empaquetador tradicional.

### Soporte de primera clase para CSS

Vite trata el CSS como un elemento de primera clase en el gráfico de módulos y soporta las siguientes características listas para usar:

- **Mejora del resolvedor de rutas**: El manejo de rutas con `@import` y `url()` es mejorado con el resolvedor de Vite para respetar los alias y las dependencias de npm.
- **Rebasado de URL**: Las rutas con `url()` son automáticamente resueltas independientemente de donde sean importadas.
- **División de código CSS**: Un fragmento de código JS dividido, también emite un archivo CSS correspondiente, el cual es automáticamente cargado en paralelo junto al fragmento de JS cuando es requerido.

### Soporte para renderizado del lado del servidor (SSR)

Vite 2.0 viene con [soporte experimental para SSR](https://vite.dev/guide/ssr.html). Vite proporciona APIs para de manera eficiente, cargar y actualizar código basado en ESM durante el desarrollo (casi como HMR del lado del servidor), y automáticamente externaliza dependencias compatibles con CommonJS para mejorar la velocidad de desarrollo y compilación SSR. El servidor de producción puede ser completamente desacoplado de Vite, y la misma configuración puede ser fácilmente adaptada para realizar pre-renderizado / SSG.

El SSR de Vite es proporcionado como una caracteristica de bajo nivel y estamos esperando ver marcos de trabajo de alto nivel implementarlo como base.

### Soporte para buscadores antiguos opcional

Vite apunta a buscadores modernos con el soporte nativo de ESM por defecto, pero también puedes optar por el soporte para buscadores antiguos por medio del plugin oficial [@vite/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). El plugin genera automáticamente doble empaquetado para la versión moderna/antigua respectivamente, y entrega el paquete correcto basado en la característica de detección de buscador, asegurando código más eficiente en buscadores modernos que lo soportan.

## ¡Pruebalo Ya!

Esas fueron varias características, pero empezar con Vite es simple. Puedes iniciar una aplicación manejada por Vite en literalmente un minuto, empezando con los siguientes comandos (asegurate de tener Node.js >= 12):

```bash
npm init @vite/app
```

Después, revisa [la guía](https://vite.dev/guide/) para ver lo que ofrece Vite listo para usar. También puedes revisar el código fuente en [GitHub](https://github.com/vitejs/vite), seguir las actualizaciones en [Twitter](https://twitter.com/vite_js), o únete a la discusión con otros usuarios de Vite en nuestro [servidor de chat de Discord](https://chat.vite.dev/).
