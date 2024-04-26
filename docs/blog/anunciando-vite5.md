---
title: ¡Vite 5.0 ya está disponible!
author:
  - name: El equipo de Vite
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 5
  - - meta
    - property: og:image
      content: https://es.vitejs.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://es.vitejs.dev/blog/anunciando-vite5
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 5
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 5.0 ya está aquí!

_16 de noviembre de 2023_

![Imagen de portada del anuncio de Vite 5](/og-image-announcing-vite5.png)

Vite 4 [fue lanzado](./anunciando-vite4.md) hace casi un año, y sirvió como una base sólida para el ecosistema. Las descargas de npm por semana aumentaron de 2.5 millones a 7.5 millones, ya que los proyectos se siguen construyendo sobre una infraestructura compartida. Los frameworks continuaron innovando, y sobre [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), entre otros, vimos nuevos frameworks unirse y fortalecer el ecosistema. [RedwoodJS](https://redwoodjs.com/) y [Remix](https://remix.run/) cambiaron a Vite, allanando el camino para una mayor adopción en el ecosistema React. [Vitest](https://vitest.dev) siguió creciendo a un ritmo aún más rápido que Vite. Su equipo ha estado trabajando arduamente y pronto [lanzarán Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596). La historia de Vite cuando se usa con otras herramientas como [Storybook](https://storybook.js.org), [Nx](https://nx.dev) y [Playwright](https://playwright.dev) siguió mejorando, al igual que los entornos, con Vite dev funcionando tanto en [Deno](https://deno.com) como en [Bun](https://bun.sh).

Tuvimos la segunda edición de [ViteConf](https://viteconf.org/23/replay) hace un mes, organizada por [StackBlitz](https://stackblitz.com). Como el año pasado, la mayoría de los proyectos en el ecosistema se unieron para compartir ideas y conectarse para seguir expandiendo lo común. También estamos viendo nuevas piezas complementar la caja de herramientas de la meta-framework como [Volar](https://volarjs.dev/) y [Nitro](https://nitro.unjs.io/). El equipo de Rollup lanzó [Rollup 4](https://rollupjs.org) ese mismo día, una tradición que Lukas comenzó el año pasado.

Hace seis meses, se [lanzó Vite 4.3](./anunciando-vite-4-3.md). Esta versión mejoró significativamente el rendimiento del servidor de desarrollo. Sin embargo, todavía hay mucho espacio para mejoras. En ViteConf, [Evan You reveló el plan a largo plazo de Vite para trabajar en Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M), un port en Rust de Rollup con APIs compatibles. Una vez que esté listo, planeamos usarlo en el core de Vite para asumir las tareas tanto de Rollup como de esbuild. Esto significará un impulso en el rendimiento de la compilación (y más adelante en el rendimiento de desarrollo también a medida que traslademos partes sensibles al rendimiento de Vite mismo a Rust) y una gran reducción de las inconsistencias entre el desarrollo y la compilación. Rolldown está actualmente en las primeras etapas y el equipo se está preparando para abrir el código fuente antes de fin de año. ¡Estén atentos!

Hoy, marcamos otro hito importante en el camino de Vite. El equipo de Vite, los [contribuyentes](https://github.com/vitejs/vite/graphs/contributors) y los socios del ecosistema, se complacen en anunciar el lanzamiento de Vite 5. Vite ahora utiliza [Rollup 4](https://github.com/vitejs/vite/pull/14508), lo que ya representa un gran impulso en el rendimiento de compilación. Y también hay nuevas opciones para mejorar el perfil de rendimiento de su servidor de desarrollo.

Vite 5 se centra en limpiar la API (eliminando características obsoletas) y simplifica varias características cerrando problemas de larga data, por ejemplo, cambiando `define` para usar reemplazos AST adecuados en lugar de expresiones regulares. También continuamos dando pasos para futurizar Vite (ahora se requiere Node.js 18+ y [se ha deprecado la API CJS de Node](/guide/migration#api-de-node-para-la-compilacion-cjs-de-vite-ahora-obsoleta)).

Enlaces rápidos:

- [Documentación](/)
- [Guía de migración](/guide/migration)
- [Registro de cambios](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Documentación en otros idiomas:

- [English](https://vitejs.dev/)
- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Português](https://pt.vitejs.dev/)
- [한국어](https://ko.vitejs.dev/)
- [Deutsch](https://de.vitejs.dev/) (nueva traducción)

Si eres nuevo en Vite, te recomendamos leer primero las guías [introductorias](/guide/) y [funcionalidades](/guide/features).

Agradecemos a los más de [850 contribuyentes a Vite Core](https://github.com/vitejs/vite/graphs/contributors) y a los mantenedores y contribuyentes de complementos Vite, integraciones, herramientas y traducciones que nos han ayudado a llegar hasta aquí. Te animamos a involucrarte y seguir mejorando Vite con nosotros. Puedes obtener más información en nuestra [Guía de Contribución](https://github.com/vitejs/docs-es/blob/main/CONTRIBUTING.md). Para comenzar, recomendamos [triage de problemas](https://github.com/vitejs)
