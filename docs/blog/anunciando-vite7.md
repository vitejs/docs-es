---
title: ¡Vite 7.0 ya está disponible!
author:
  name: El Equipo de Vite
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 7
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite7.png
  - - meta
    - property: og:url
      content: https://es.vite.dev/blog/anunciando-vite7
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 7
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 7.0 ya está disponible!

_24 de junio de 2025_

![Imagen de Portada del Anuncio de Vite 7](/og-image-announcing-vite7.png)

Estamos felices de compartir el lanzamiento de Vite 7! Han pasado 5 años desde que Evan You envió el primer commit al repositorio de Vite, y nadie podría haber predicho cuánto cambiaría el ecosistema del frontend desde entonces. La mayoría de los frameworks y herramientas de frontend modernos ahora trabajan juntos, construyendo sobre la infraestructura compartida de Vite. Y pueden innovar a un ritmo más rápido al compartir a un nivel más alto. Vite ahora se descarga 31 millones de veces a la semana, con un aumento de 14 millones en los últimos siete meses desde el lanzamiento anterior.

Este año, estamos dando varios pasos importantes. Para empezar, ¡[ViteConf](https://viteconf.org) será en persona! ¡La comunidad de Vite se reunirá en Ámsterdam el 9 y 10 de octubre! Organizado por [JSWorld](https://jsworldconference.com/) en asociación con [Bolt](https://bolt.new), [VoidZero](https://voidzero.dev) y el equipo principal de Vite. Hemos tenido tres increíbles ediciones en línea de [ViteConf](https://www.youtube.com/@viteconf/playlists), y no podemos esperar para reunirnos en persona. Consulta a los oradores y obtén tu boleto en el sitio web de [ViteConf](https://viteconf.org)!

Y [VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc) sigue avanzando en su misión de construir una herramienta de desarrollo unificada de código abierto para el ecosistema de JavaScript. Durante el último año, el equipo de VoidZero ha estado trabajando en [Rolldown](https://rolldown.rs/), un empaquetador de próxima generación escrito en Rust, como parte de un esfuerzo más amplio para modernizar el núcleo de Vite. Puedes probar Vite con Rolldown hoy mismo utilizando el paquete `rolldown-vite` en lugar del `vite` predeterminado. Es un reemplazo _drop-in_, ya que Rolldown se convertirá en el empaquetador predeterminado para Vite en el futuro. Migrar debería reducir tu tiempo de compilación, especialmente para proyectos más grandes. Lee más en el anuncio de [Rolldown-vite](https://voidzero.dev/posts/announcing-rolldown-vite) y nuestra [guía de migración](https://vite.dev/rolldown).

A través de una asociación entre VoidZero y [NuxtLabs](https://nuxtlabs.com/), Anthony Fu está trabajando en la creación de Vite DevTools. Ofrecerán una depuración y análisis más profundos y precisos para todos los proyectos y frameworks basados en Vite. Puedes leer más sobre el anuncio de [VoidZero y NuxtLabs se unen para las herramientas de desarrollo de Vite](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools).

Enlaces rápidos:

- [Documentación](/)
- Nueva traducción: [فارسی](https://fa.vite.dev/)
- Otras traducciones: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Guía de migración](/guide/migration)
- [Registro de cambios de GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Juega en línea con Vite 7 utilizando [vite.new](https://vite.new) o crea un proyecto de Vite local con tu framework preferido ejecutando `pnpm create vite`. Consulta la [Guía de inicio](/guide/) para obtener más información.

Te invitamos a ayudarnos a mejorar Vite (uniendote a los más de [1.1K contribuidores a Vite Core](https://github.com/vitejs/vite/graphs/contributors)), nuestras dependencias o plugins y proyectos en el ecosistema. Aprende más en nuestra [Guía de contribución](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Un buen lugar para empezar es [haciendo triage de problemas](https://github.com/vitejs/vite/issues), [revisando solicitudes de integración](https://github.com/vitejs/vite/pulls), enviandolos basadas en problemas abiertos y apoyando a otros en [Discusiones](https://github.com/vitejs/vite/discussions) o en el foro de ayuda de Vite Land. Si tienes preguntas, únete a nuestra [comunidad de Discord](http://chat.vite.dev/) y habla con nosotros en el [canal #contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Mantén la actualización y conecta con otros que trabajan con Vite siguiéndonos en [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) o [Mastodon](https://webtoo.ls/@vite).

## Soporte de Node.js

Vite ahora requiere Node.js 20.19+, 22.12+. Hemos quitado el soporte para Node.js 18, ya que ha alcanzado su [final de vida](https://endoflife.date/nodejs) a finales de abril de 2025.

Requerimos estos nuevos rangos para que Node.js admita `require(esm)` sin un indicador. Esto nos permite distribuir Vite 7.0 como ESM solo sin impedir que la API de JavaScript de Vite sea requerida por módulos CJS. Consulta la publicación de blog de Anthony Fu ["Move on to ESM-only"](https://antfu.me/posts/move-on-to-esm-only) para obtener un análisis detallado del estado actual de ESM en el ecosistema.

## Cambio predeterminado del target del navegador a Baseline Ampliamente Disponible

[Baseline](https://web-platform-dx.github.io/web-features/) nos brinda información clara sobre qué características de la plataforma web funcionan en el conjunto de navegadores principal hoy en día. Baseline Ampliamente Disponible indica que la característica es ampliamente compatible y funciona en muchos dispositivos y versiones de navegadores, estando disponible en al menos 30 meses.

En Vite 7, el target del navegador predeterminado cambia de `'modules'` a un nuevo predeterminado: `'baseline-widely-available'`. El conjunto de navegadores se actualizará en cada lanzamiento principal para coincidir con la lista de versiones mínimas de navegadores compatibles con las características de Baseline Ampliamente Disponible. El valor predeterminado de `build.target` está cambiando en Vite 7.0:

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

Este cambio agrega previsibilidad al target del navegador predeterminado para futuras versiones.

## Vitest

Para los usuarios de Vitest, Vite 7.0 es compatible con Vitest 3.2. Puedes leer más sobre cómo el equipo de Vitest sigue mejorando la historia de pruebas de Vite en la [publicación de blog de Vitest 3.2](https://vitest.dev/blog/vitest-3-2.html).

## API de entorno

Vite 6 fue la versión más significativa desde Vite 2, agregando nuevas capacidades con la [nueva API experimental de entorno](https://vite.dev/blog/announcing-vite6.html#experimental-environment-api). Mantenemos las nuevas APIs como experimentales mientras el ecosistema revisa cómo las nuevas APIs se ajustan a sus proyectos y proporciona comentarios. Si estás construyendo sobre Vite, te animamos a probar las nuevas APIs y ponerte en contacto con nosotros en el [debate abierto de comentarios aquí](https://github.com/vitejs/vite/discussions/16358).

En Vite 7, agregamos un nuevo hook `buildApp` para que los plugins coordinen la compilación de entornos. Lee más en la [Guía de API de entorno para frameworks](/guide/api-environment-frameworks.html#entornos-durante-la-compilacion).

Queremos agradecer a los equipos que han estado probando las nuevas APIs y ayudando a estabilizar las nuevas características. Por ejemplo, el equipo de Cloudflare anunció el lanzamiento 1.0 de su plugin Vite de Cloudflare, así como el soporte oficial para React Router v7. Su plugin muestra el potencial de la API de entorno para proveedores de tiempo de ejecución. Aprende más sobre su enfoque y pasos futuros en ["Just use Vite”… con el runtime de Workers](https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/).

## Migración a Vite 7

Vite 7 es una actualización suave desde Vite 6. Eliminamos las características ya desaparecidas, como el soporte de la API heredada de Sass y el `splitVendorChunkPlugin` que no debería afectar tus proyectos. Te sugerimos que revises la [guía detallada de migración](/guide/migration) antes de actualizar.

La lista completa de cambios está en los [cambios de Vite 7](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Agradecimientos

Vite 7 fue creado por el [Equipo de Vite](/team) con el apoyo de la comunidad de contribuidores, mantenedores downstream y autores de plugins. Un agradecimiento especial a [sapphi-red](https://github.com/sapphi-red) por su trabajo maravilloso en `rolldown-vite` y esta lanzamiento. Vite es traído a ti por [VoidZero](https://voidzero.dev), en asociación con [Bolt](https://bolt.new/) y [Nuxt Labs](https://nuxtlabs.com/). También queremos agradecer a nuestros patrocinadores en [Sponsors de GitHub de Vite](https://github.com/sponsors/vitejs) y [Open Collective de Vite](https://opencollective.com/vite).
