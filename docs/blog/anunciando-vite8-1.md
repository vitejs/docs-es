---
title: ¡Vite 8.1 ya está disponible!
author:
  name: El Equipo de Vite
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 8.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Anuncio de la versión Vite 8.1
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 8.1 ya está disponible!

_23 de junio de 2026_

![Vite 8 Announcement Cover Image](/og-image-announcing-vite8-1.webp)

Vite 8 [fue lanzado](./anunciando-vite8.md) en marzo con un único empaquetador unificado impulsado por [Rolldown](https://rolldown.rs/), abriendo la puerta a más mejoras. Ahora registra 41.6 millones de descargas semanales, casi alcanzando las descargas totales de Vite 7. Además de resolver las regresiones de actualización, hemos estado trabajando en nuevas características y nos emociona anunciar el lanzamiento de Vite 8.1.

Enlaces rápidos:

- [Documentación](/)
- Traducciones: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [English](https://vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [Historial de Cambios en GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Juega en línea con Vite 8.1 usando [vite.new](https://vite.new) o crea una aplicación Vite localmente con tu framework preferido ejecutando `pnpm create vite`. Revisa la [Guía de Introducción](/guide/) para más información.

Te invitamos a ayudarnos a mejorar Vite (uniéndote a los más de [1.2K colaboradores de Vite Core](https://github.com/vitejs/vite/graphs/contributors)), nuestras dependencias, o proyectos en nuestro ecosistema. Descubre más en nuestra [Guía de Contribución](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Una buena forma de comenzar es haciendo triaje en las [incidencias](https://github.com/vitejs/vite/issues), [revisando PRs](https://github.com/vitejs/vite/pulls), mandando PRs para pruebas basándose en las incidencias abiertas, y apoyando a otros en [Discusiones](https://github.com/vitejs/vite/discussions) or en el foro de ayuda de [Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Si tienes inquietudes generales, únete a nuestra [comunidad de Discord](https://chat.vite.dev) y habla con nosotros en el canal de [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Mantente actualizado y conéctate con otros creadores utilizando Vite siguiéndonos en [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), o [Mastodon](https://webtoo.ls/@vite).

## Características

### Modo de Desarrollo Empaquetado Experimental (Bundled Dev Mode)

El soporte experimental para el modo de desarrollo empaquetado (Bundled Dev Mode) ya está disponible. Esto anteriormente se conocía como "Full Bundle Mode". Este modo está diseñado para mejorar el rendimiento de aplicaciones de gran tamaño que sufren por la gran cantidad de módulos.

En nuestras pruebas iniciales con una aplicación que carga 10,000 componentes de React, el modo de desarrollo empaquetado logró un inicio alrededor de 15 veces más rápido y recargas de página completas 10 veces más rápidas en comparación con el servidor de desarrollo no empaquetado, al mismo tiempo que mantuvo HMR instantáneo independientemente del tamaño de la aplicación. Las pruebas preliminares en aplicaciones reales muestran ganancias similares: el equipo de Linear vio un renderizado de inicio en frío hasta 3 veces más rápido, recargas completas aproximadamente un 40% más rápidas y 10 Vector menos solicitudes de red.

::: details ¿Por qué un modo de desarrollo empaquetado?

Vite es conocido por su enfoque de servidor de desarrollo no empaquetado, que es la razón principal de la velocidad y popularidad de Vite cuando se presentó por primera vez. Este enfoque fue inicialmente un experimento para ver qué tan lejos podíamos llevar los límites del rendimiento del servidor de desarrollo sin el empaquetado tradicional.

Sin embargo, a medida que los proyectos escalan en tamaño y complejidad, se ha vuelto claro que el enfoque no empaquetado de Vite puede degradar el rendimiento durante el desarrollo. Debido a que cada módulo se obtiene por separado, el navegador debe procesar una gran cantidad de solicitudes, lo que aumenta la sobrecarga de inicio y actualización. Este impacto es especialmente notable en aplicaciones grandes y se vuelve más severo cuando los desarrolladores están detrás de un proxy de red, lo que resulta en tiempos de actualización más lentos y una peor experiencia de desarrollo.

El modo de desarrollo empaquetado permitiría servir archivos empaquetados no solo en producción sino también durante el desarrollo, combinando lo mejor de ambos mundos:

- Tiempos de inicio rápidos incluso para aplicaciones grandes
- Sobrecarga de red reducida en las recargas de página
- Mantenimiento de un HMR eficiente sobre la salida ESM

:::

Actualmente, se enfoca en la parte del navegador, los plugins básicos y las características principales. Si estás utilizando un plugin de terceros, es posible que no funcione con este modo. Si utilizas una característica secundaria, también es posible que no funcione de la misma manera. Estamos trabajando para ampliar el soporte y preparando un documento que aclare los cambios que puedan ser necesarios del lado del plugin. Consulta el [documento de diseño](https://github.com/vitejs/vite/discussions/22746) para obtener más detalles sobre la hoja de ruta.

Para habilitar este modo, puedes pasar `--experimental-bundle` o añadir `experimental.bundledDev: true` a tu `vite.config.js`:

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

Comparte tus comentarios en [la discusión](https://github.com/vitejs/vite/discussions/22747).

### Mapa de Importación de Fragmentos Experimental (Chunk Import Map)

En el paquete de salida (bundle), la sentencia de importación de un fragmento (chunk) incluye el hash de ese fragmento. Esto garantiza que el nuevo fragmento se cargue si su contenido ha cambiado. Sin embargo, esto también provoca que cambie el hash del fragmento que importa al fragmento modificado, lo que propaga el cambio en cascada a todos los fragmentos que importan al fragmento modificado de forma transitiva.

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 ? 88xx].js\ncontenido editado" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 ? 77yy].js\nrecalculado por cascada" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 ? 99zz].js\nrecalculado por cascada" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  importa (incrusta hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  importa (incrusta hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

La característica experimental de mapas de importación de fragmentos (chunk import map) resuelve este problema utilizando mapas de importación y mejorando la eficiencia de la caché. Esta característica está construida sobre la [funcionalidad de Rolldown](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap), pero añade soporte para características específicas de Vite. ¡Muchas gracias a [Taisei Mima](https://github.com/bhbs) por su investigación e implementación inicial de esta característica!

Ten en cuenta que `experimental.renderBuiltUrl` actualmente no funciona con esta option.

Consulta la [guía](/guide/features#chunk-import-map-optimization) y la [documentación de la opción](/config/build-options#build-chunkimportmap) para más detalles. Comparte tus comentarios en [la discusión](https://github.com/vitejs/vite/discussions/22703).

### Soporte de Integración Wasm ESM

La [propuesta de integración de Wasm ESM](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md) ahora es compatible con Vite. Ahora puedes importar archivos wasm y utilizar las funciones exportadas directamente:

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

¡Muchas gracias a [Menci](https://github.com/Menci) por su creación y mantenimiento de `vite-plugin-wasm` mientras la propuesta estaba en etapas tempranas, y también por incorporar la implementación al núcleo de Vite!

Consulta la [guía](/guide/features#esm-integration) para más detalles.

### Un paso más cerca de usar Lightning CSS por defecto

Hemos trabajado con el equipo de Lightning CSS para añadir características que eran compatibles con PostCSS pero de las que carecía Lightning CSS. Vite 8.1 ahora incluye estas dos características:

- Permitir archivos CSS externos importados en archivos CSS ([lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479))
- Registrar dependencias de archivos mediante plugins ([lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877))

Estamos considerando cambiar el preprocesador CSS por defecto a Lightning CSS en la próxima versión principal (major release). Pruébalo mediante [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) y comparte tus comentarios en [la discusión](https://github.com/vitejs/vite/discussions/13835).

### Coincidencia Insensible a Mayúsculas y Minúsculas para `import.meta.glob`

`import.meta.glob` ahora admite la opción `caseSensitive` para buscar archivos sin distinguir entre mayúsculas y minúsculas.

```ts
// coincide con ./dir/Module1.js
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### Descubrimiento de Recursos para Elementos y Atributos HTML Personalizados

Anteriormente, Vite solo descubría recursos (assets) para los elementos y atributos predefinidos. Ahora puedes usar la opción [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources) para añadir más elementos y atributos.

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: 'src',
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## Otros Cambios

Consulta el [Historial de cambios](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md) para ver otras características y correcciones de errores.

## Agradecimientos

Vite 8.1 es posible gracias a nuestra comunidad de colaboradores, mantenedores del ecosistema y al [Equipo de Vite](/team). Vite llega a ti de la mano de [VoidZero](https://voidzero.dev), en asociación con [Bolt](https://bolt.new/) y [Nuxt Labs](https://nuxtlabs.com/). También queremos agradecer a nuestros patrocinadores en [Vite's GitHub Sponsors](https://github.com/sponsors/vitejs) y [Vite's Open Collective](https://opencollective.com/vite).
