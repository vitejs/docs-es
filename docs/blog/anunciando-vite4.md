---
title: ¡Vite 4.0 ya está disponible!
author:
  - name: El equipo de Vite
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 4
  - - meta
    - property: og:image
      content: https://es.vite.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://es.vite.dev/blog/anunciando-vite4
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 4
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 4.0 ya está disponible!

_9 de diciembre de 2022_ - Echa un vistazo al [anuncio de Vite 5.0](./anunciando-vite5.md)

Vite 3 [fue lanzado](./anunciando-vite3.md) hace 5 meses. Las descargas de npm por semana han pasado de 1 millón a 2.5 millones desde entonces. El ecosistema también ha madurado y sigue creciendo. En la [encuesta Jamstack Conf de este año](https://twitter.com/vite_js/status/1589665610119585793), el uso entre la comunidad saltó del 14% al 32%, manteniendo un alto puntaje de satisfacción de 9.7. Vimos los lanzamientos estables de [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/) y otros marcos impulsados ​​por Vite que están innovando y colaborando: [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). Storybook anunció soporte de primera clase para Vite como una de sus características principales para [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/). Deno ahora [ofrece soporte para Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY). La adopción de [Vitest](https://vitest.dev) se está disparando, pronto representará la mitad de las descargas de Vite en npm. Nx también está invirtiendo en el ecosistema y [oficialmente es compatible con Vite](https://nx.dev/packages/vite).

[![Ecosistema de Vite 4](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Como muestra del crecimiento que han experimentado Vite y los proyectos relacionados, el ecosistema de Vite se reunió el 11 de octubre en el [ViteConf 2022](https://viteconf.org/2022/replay). Vimos a representantes del principal marco web y herramientas contar historias de innovación y colaboración. Y en un movimiento simbólico, el equipo de Rollup elige ese día exacto para lanzar [Rollup 3](https://rollupjs.org).

Hoy, el [equipo de desarrollo principal de Vite](https://es.vite.dev/team) con la ayuda de nuestros socios del ecosistema, se complace en anunciar el lanzamiento de Vite 4, impulsado durante el tiempo de compilación por Rollup 3. Hemos trabajado con el ecosistema para garantizar una ruta de actualización sin problemas para esta nueva especialidad. Vite ahora usa [Rollup 3](https://github.com/vitejs/vite/issues/9870), lo que nos permitió simplificar el manejo interno de recursos de Vite y tiene muchas mejoras. Consulta las [notas de la versión de Rollup 3 aquí](https://github.com/rollup/rollup/releases/tag/v3.0.0).

![Imagen de portada del anuncio de Vite 4](/og-image-announcing-vite4.png)

Enlaces rápidos:

- [Documentación](/)
- [Guía de migración](/guide/migration)
- [Lista de cambios](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

Documentación en otros idiomas:

- [Inglés](https://vite.dev/)
- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)

Si recientemente comenzaste a usar Vite, te sugerimos leer la [Guía de por qué Vite](https://es.vite.dev/guide/why.html) y consultar [Cómo comenzar](https://es.vite.dev/guide/) y la [Guía de funcionalidades](https://es.vite.dev/guide/features). Si deseas participar, las contribuciones son bienvenidas en [GitHub](https://github.com/vitejs/vite). Casi [700 colaboradores](https://github.com/vitejs/vite/graphs/contributors) han contribuido a Vite. Sigue las actualizaciones en [Twitter](https://twitter.com/vite_js) y [Mastodon](https://webtoo.ls/@vite), o únete y colabora con otros en nuestra [comunidad Discord](http://chat.vite.dev/).

## Empezar a jugar con Vite 4

Usa `pnpm create vite` para montar un proyecto de Vite con tu marco de trabajo preferido, o abre una plantilla iniciada en línea para jugar con Vite 4 usando [vite.new](https://vite.new).

También puedes ejecutar `pnpm create vite-extra` para obtener acceso a plantillas de otros marcos y tiempos de ejecución (Solid, Deno, SSR y bibliotecas de inicio). Las plantillas `create vite-extra` también están disponibles cuando ejecutas `create vite` en la opción `Others`.

Ten en cuenta que las plantillas de inicio de Vite están diseñadas para usarse como un campo de juego para probar Vite con diferentes marcos. Cuando empieces a trabajar en tu próximo proyecto, te recomendamos utilizar los iniciadores sugeridos por cada marco. Algunos de ellos ahora también redirigen `create vite` a sus iniciadores (`create-vue` y `Nuxt 3` para Vue, y `SvelteKit` para Svelte).

## Nuevo plugin React usando SWC durante el desarrollo

[SWC](https://swc.rs/) ahora es un reemplazo maduro para [Babel](https://babeljs.io/), especialmente en el contexto de los proyectos React. La implementación de React Fast Refresh de SWC es mucho más rápida que Babel y, para algunos proyectos, ahora es una mejor alternativa. Desde Vite 4, hay dos plugins disponibles para proyectos React con diferentes compensaciones. Creemos que vale la pena soportar ambos enfoques en este momento, y continuaremos explorando mejoras para ambos plugins en el futuro.

### @vite/plugin-react

[@vite/plugin-react](https://github.com/vitejs/vite-plugin-react) es un plugin que usa esbuild y Babel, logrando HMR rápido con un tamaño de paquete pequeño y la flexibilidad de poder usar el pipeline de transformación de Babel.

### @vite/plugin-react-swc (nuevo)

[@vite/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) es un nuevo plugin que usa esbuild durante la compilación, pero reemplaza Babel con SWC durante el desarrollo. Para grandes proyectos que no requieren extensiones de React no estándar, el arranque en frío y Hot Module Replacement (HMR) pueden ser significativamente más rápidos.

## Compatibilidad de navegador

La compilación para navegadores modernos ahora apunta a `safari14` de forma predeterminada para una mayor compatibilidad con ES2020. Esto significa que las compilaciones para navegadores modernos ahora pueden usar [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) y que el [operador coalescente nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) ya no se transpile. Si necesitas soportar navegadores más antiguos, puedes agregar [`@vite/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) como de costumbre.

## Importando CSS como String

En Vite 3, importar la exportación predeterminada de un archivo `.css` podría generar una doble carga de CSS.

```ts
import cssString from './global.css'
```

Esta carga doble podría ocurrir ya que se emitirá un archivo `.css` y es probable que el código de la aplicación también use la cadena CSS, por ejemplo, inyectada por el tiempo de ejecución del marco. A partir de Vite 4, la exportación predeterminada `.css` [ha quedado obsoleta](https://github.com/vitejs/vite/issues/11094). El modificador de sufijo de consulta `?inline` debe usarse en este caso, ya que no emite los estilos `.css` importados.

```ts
import stuff from './global.css?inline'
```

Aprende más sobre ello en la [Guía de migración](/guide/migration).

### Variables de entorno

Vite ahora usa `dotenv` 16 y `dotenv-expand` 9 (anteriormente `dotenv` 14 y `dotenv-expand` 5). Si tienes un valor que incluye `#` o `` ` ``, deberás incluirlos entre comillas.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Para obtener más detalles, consulta [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) y [la lista de cambios de `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Otras funcionalidades

- Atajos para la interfaz de línea de comando (presiona `h` durante el desarrollo para verlos todos) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Compatibilidad con paquete de parches cuando se preempaquetan las dependencias ([#10286](https://github.com/vitejs/vite/issues/10286))
- Salida de registros de compilación más limpia ([#10895](https://github.com/vitejs/vite/issues/10895)) y cambiado a `kB` para alinearse con las herramientas de desarrollo del navegador ([#10982](https://github.com/vitejs/vite/issues/10982))
- Mensajes de error mejorados durante SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Tamaño de paquete reducido

Vite se preocupa por su huella, para agilizar la instalación, especialmente en el caso de uso de playgrounds para documentación y reproducciones. Y una vez más, esta especialidad trae mejoras en el tamaño del paquete de Vite. El tamaño de instalación de Vite 4 es un 23% más pequeño en comparación con vite 3.2.5 (14,1 MB frente a 18,3 MB).

## Actualizaciones al Core de Vite

[Vite Core](https://github.com/vitejs/vite) y [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) continúan evolucionando para brindar una mejor experiencia a los mantenedores y colaboradores y para garantizar que el desarrollo se escale para hacer frente al crecimiento en el ecosistema.

### Plugins de frameworks fuera del core

[`@vite/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) y [`@vite/plugin-vue`](https://github.com/vitejs/vite-plugin-react) han sido parte del monorepo del core de Vite desde las primeras versiones de Vite. Esto nos ayudó a obtener un ciclo de retroalimentación cercano al realizar cambios, ya que estábamos probando y lanzando tanto Core como los plugins juntos. Con [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) podemos obtener estos comentarios con estos plugins desarrollados en repositorios independientes, por lo que desde Vite 4, [se han sacado del monorepo del núcleo de Vite](https://github.com/vitejs/vite/pull/11158). Esto es significativo para la historia del marco de trabajo agnóstico de Vite y nos permitirá crear equipos independientes para mantener cada uno de los plugins. Si tienes errores a informar o funciones a solicitar, crea propuestas en los nuevos repositorios en el futuro: [`vite/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) y [`vite/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### Mejoras para vite-ecosystem-ci

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) amplía la integración continua de Vite proporcionando informes de estado bajo demanda sobre el estado de los CI de [la mayoría de los principales proyectos](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests). Ejecutamos vite-ecosystem-ci tres veces por semana en la rama principal de Vite y recibimos informes oportunos antes de introducir una regresión. Vite 4 pronto será compatible con la mayoría de los proyectos que usan Vite, que ya preparó ramas con los cambios necesarios y los lanzará en los próximos días. También podemos ejecutar vite-ecosystem-ci a pedido en una solicitud de cambios usando `/ecosystem-ci run` en un comentario, lo que nos permite conocer [el efecto de los cambios](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064) antes de que lleguen a main.

## Agradecimientos

Vite 4 no sería posible sin las incontables horas de trabajo de los colaboradores de Vite, muchos de ellos mantenedores de proyectos y plugins posteriores, y los esfuerzos del [Equipo de Vite](/team). Todos hemos trabajado juntos para mejorar la experiencia de desarrollo de Vite una vez más, para cada marco y aplicación que lo usa. Estamos agradecidos de poder mejorar una base común para un ecosistema tan vibrante.

También estamos agradecidos con las personas y empresas que patrocinan el equipo de Vite y las empresas que invierten directamente en el futuro de Vite: el trabajo de [@antfu7](https://twitter.com/antfu7) en Vite y el ecosistema es parte de su trabajo; en [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) está financiando el trabajo realizado por [@bluwyoo](https://twitter.com/bluwyoo) en el core de Vite, y [StackBlitz](https://stackblitz.com/) contrata a [@patak_dev](https://twitter.com/patak_dev) para trabajar a tiempo completo en Vite.

## Próximos pasos

Nuestro enfoque inmediato estaría en clasificar las propuestas recién abiertas para evitar interrupciones por posibles regresiones. Si deseas involucrarte y ayudarnos a mejorar Vite, te sugerimos comenzar con la clasificación de las propuestas. Únete a [nuestro Discord](https://chat.vite.dev) y comunícate en el canal `#contributing`. Mejora nuestra historia en `#docs`, y ayuda a otros en `#help`. Necesitamos continuar construyendo una comunidad útil y acogedora para la próxima ola de usuarios, a medida que la adopción de Vite continúa creciendo.

Hay muchos frentes abiertos para seguir mejorando la experiencia de usuario de todos los que han elegido Vite para potenciar sus marcos y desarrollar sus aplicaciones. ¡Vamos!
