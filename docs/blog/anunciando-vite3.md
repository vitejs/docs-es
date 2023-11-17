---
sidebar: false
date: 2022-07-23
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando Vite 3
  - - meta
    - property: og:image
      content: https://es.vitejs.dev/og-image-announcing-vite3.png
  - - meta
    - property: og:url
      content: https://es.vitejs.dev/blog/anunciando-vite3
  - - meta
    - property: og:description
      content: Anuncio de lanzamiento de Vite 3
  - - meta
    - property: twitter:title
      content: Anunciando Vite 3
  - - meta
    - property: twitter:card
      content: summary_large_image
---

# ¡Vite 3.0 ya está disponible!

_23 de julio de 2022_: mira el [anuncio de Vite 4.0](./anunciando-vite4.md)

En febrero del año pasado, [Evan You](https://twitter.com/youyuxi) lanzó Vite 2. Desde entonces, su adopción ha crecido sin parar, alcanzando más de 1 millón de descargas vía npm por semana. Un ecosistema en expansión se formó rápidamente después de la liberación. Vite está impulsando una renovada carrera de innovación en marcos de desarrollo web. [Nuxt 3](https://v3.nuxtjs.org/) usa Vite de forma predeterminada. [SvelteKit](https://kit.svelte.dev/), [Astro](https://astro.build/), [Hydrogen](https://hydrogen.shopify.dev/) y [SolidStart](https://docs.solidjs.com/start) están construidos con Vite. [Laravel ahora ha decidido usar Vite de forma predeterminada](https://laravel.com/docs/9.x/vite). [Vite Ruby](https://vite-ruby.netlify.app/) muestra cómo Vite puede mejorar la experiencia de desarrollo en Rails. [Vitest](https://vitest.dev) está avanzando como una alternativa nativa de Vite a Jest. Vite está detrás de [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) y [Playwright](https://playwright.dev/docs/est-components), Storybook tiene [Vite como el builder oficial](https://github.com/storybookjs/builder-vite). Y [la lista continúa](https://patak.dev/vite/ecosystem). Los mantenedores de la mayoría de estos proyectos se involucraron en la mejora del núcleo de Vite, trabajando en estrecha colaboración con el [equipo de Vite](https://es.vitejs.dev/team) y otros colaboradores.

![Vite 3 Announcement Cover Image](./../public/og-image-announcing-vite3.png)

Hoy, 16 meses después del [lanzamiento de la v2](anunciando-vite2.md), nos complace anunciar el lanzamiento de Vite 3. Decidimos lanzar una nueva versión importante de Vite al menos cada año para alinearnos con el [tiempo establecido de soporte de Node.js](https://nodejs.org/en/about/releases/), y aprovechar la oportunidad de revisar la API de Vite regularmente con una ruta de migración corta para proyectos en el ecosistema.

Enlaces rápidos:

- [Documentación](/)
- [Guía de migración](/guide/migration)
- [Registro de cambios](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-beta9-2022-07-13)

Si eres nuevo en Vite, te recomendamos que leas la [Guía de por qué Vite](../guide/why). Luego consulta [Introducción](../guide/) y [Guía de funcionalidades](../guide/features) para ver lo que Vite proporciona de manera inmediata. Como de costumbre, las contribuciones son bienvenidas en [GitHub](https://github.com/vitejs/vite). Más de [600 colaboradores](https://github.com/vitejs/vite/graphs/contributors) han ayudado a mejorar Vite hasta ahora. Sigue las actualizaciones en [Twitter](https://twitter.com/vite_js), o únete a debatir con otros usuarios de Vite en nuestro [servidor de chat de Discord](http://chat.vitejs.dev/).

## Nueva Documentación

Ve a [vitejs.dev](https://vitejs.dev) para disfrutar de la nueva documentacion para la v3. Vite ahora usa el nuevo tema predeterminado para [VitePress](https://vitepress.vuejs.org), con un impresionante modo oscuro entre otras características.

[![Vite documentation frontpage](../images/v3-docs.png)](https://vitejs.dev)

Varios proyectos en el ecosistema ya han migrado (ver [Vitest](https://vitest.dev), [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/), y [VitePress](https://vitepress.vuejs.org/) mismo).

Si necesitas acceder a la documentación de Vite 2, permanecerán en línea en [v2.vitejs.dev](https://v2.vitejs.dev). También hay un nuevo subdominio [main.vitejs.dev](https://main.vitejs.dev), donde cada cambio en la rama principal de Vite se implementa automáticamente. Esto es útil cuando se prueban versiones beta o se contribuye al desarrollo del core.

Ahora también hay una traducción oficial al español, que se ha agregado a las traducciones al chino y japonés:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

## Plantillas de Inicio para Create Vite

Las plantillas de [create-vite](/guide/#probar-vite-online) han sido una gran herramienta para probar rápidamente Vite con el marco de trabajo favorito de tu preferencia. En Vite 3, todas las plantillas obtuvieron un nuevo tema alineado con la nueva documentación. Ábrelos en línea y comienza a jugar con Vite 3 ahora:

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite logo"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue logo"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte logo"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React logo"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact logo"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit logo"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

El tema ahora es compartido por todas las plantillas. Esto debería ayudar a transmitir mejor el alcance de estos como plantillas mínimas para comenzar con Vite. Para obtener soluciones más completas que incluyen linting, configuración de prueba y otras funciones, existen plantillas oficiales con tecnología de Vite para algunos marcos de trabajo como [create-vue](https://github.com/vuejs/create-vue) y [create-svelte](https://github.com/sveltejs/kit). Hay una lista de plantillas mantenidas por la comunidad en [Awesome Vite](https://github.com/vitejs/awesome-vite#templates).

## Mejoras de desarrollo

### Vite CLI

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width: 100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">ready in <b>320</b> ms</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>Local</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>Network</b>: use --host to expose</span>
</pre>

Además de las mejoras estéticas de la CLI, notarás que el puerto del servidor de desarrollo predeterminado ahora es 5173 y el servidor de vista previa escucha en 4173. Este cambio garantiza que Vite evitará colisiones con otras herramientas.

### Estrategia de conexión WebSocket mejorada

Uno de los puntos débiles de Vite 2 fue configurar el servidor cuando se ejecuta detrás de un proxy. Vite 3 cambia el esquema de conexión predeterminado para que funcione de manera inmediata en la mayoría de los escenarios. Todas estas configuraciones ahora se prueban como parte de Vite Ecosystem CI a través de [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue).

### Mejoras en el arranque en frío

Vite ahora evita la recarga completa durante el arranque en frío cuando los complementos inyectan las importaciones mientras se rastrean los módulos previamente importados estáticamente ([#8869](https://github.com/vitejs/vite/issues/8869)).

<details>
  <summary><b>Haz click para más información</b></summary>

En Vite 2.9, tanto el escáner como el optimizador se ejecutaban en segundo plano. En el mejor escenario, donde el escáner encontraría todas las dependencias, no se necesitaba refrescar en el arranque en frío. Pero si el escáner pasaba por alto una dependencia, se necesitaba una nueva fase de optimización y luego un refresco. Vite pudo evitar algunas de estas recargas en v2.9, ya que detectamos si los nuevos fragmentos optimizados eran compatibles con los que tenía el navegador. Pero si había una dependencia común, los subfragmentos podían cambiar y se requería un refresco para evitar el estado duplicado. En Vite 3, las dependencias optimizadas no se entregan al navegador hasta que se realiza el rastreo de las importaciones estáticas. Se emite una fase de optimización rápida si falta una dependencia (por ejemplo, inyectada por un complemento), y solo entonces se envían las dependencias empaquetadas. Por lo tanto, ya no es necesario un refresco de página para estos casos.

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="Two graphs comparing Vite 2.9 and Vite 3 optimization strategy">

### import.meta.glob

Se reescribió el soporte de `import.meta.glob`. Lee acerca de las nuevas funciones en la [Guía de importaciones Glob](/guide/features#importaciones-glob):

Se pueden pasar [patrones múltiples](/guide/features#patrones-multiples) como un array.

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

Los [patrones negativos](/guide/features#patrones-negativos) ahora son compatibles (con el prefijo `!`) para ignorar algunos archivos específicos.

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

Las [importaciones nombradas](/guide/features#importaciones-nombradas) se pueden especificar para mejorar el tree-shaking.

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

Se pueden pasar [consultas personalizadas](/guide/features#consultas-personalizadas) para adjuntar metadatos

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

Las [importaciones diferidas](/guide/features#importaciones-glob) ahora se pasan como un indicador

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### Alineación de importación WASM con estándares futuros

La API de importación de WebAssembly se ha revisado para evitar conflictos con estándares futuros y para que sea más flexible:

```js
import init from './example.wasm?init'
init().then((instance) => {
  instance.exports.test()
})
```

Obtén más información en la [guía de WebAssembly](/guide/features#webassembly)

## Mejoras en compilación

### SSR compilado en ESM de forma predeterminada

La mayoría de los marcos de trabajo SSR en el ecosistema ya usaban compilaciones de ESM. Entonces, Vite 3 hace que ESM sea el formato predeterminado para las compilaciones de SSR. Esto nos permite simplificar las [heurísticas de externalización de SSR anteriores](../guide/ssr#ssr-externos), externalizando las dependencias de forma predeterminada.

### Soporte de base relativo mejorado

Vite 3 ahora admite correctamente la base relativa (usando `base: ''`), lo que permite que los recursos compilados se desplieguen en diferentes bases sin reconstruir. Esto es útil cuando la base no se conoce en el momento de la compilación, por ejemplo, cuando se implementa en redes direccionables por contenido como [IPFS](https://ipfs.io/).

## Funcionalidades experimentales

### Control detallado de rutas de recursos compilados (experimental)

Hay otros escenarios de despliegue en los que esto no es suficiente. Por ejemplo, si los recursos con hash generados deben desplegarse en una CDN diferente de los archivos públicos, entonces se requiere un control más detallado sobre la generación de rutas en el momento de la compilación. Vite 3 proporciona una API experimental para modificar las rutas de archivo compilado. Consulta las [opciones avanzadas de compilación para base](../guide/build#opciones-avanzadas-para-base) para obtener más información.

### Optimización de dependencias en tiempo de compilación con esbuild (experimental)

Una de las principales diferencias entre el tiempo de desarrollo y el de compilación es cómo Vite maneja las dependencias. Durante el tiempo de compilación, [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) se usa para permitir la importación de dependencias de solo CJS (como React). Cuando se usa el servidor de desarrollo, se usa esbuild para preempaquetar y optimizar las dependencias, y se aplica un esquema de interoperabilidad mientras se transforma el código cliente importando dependencias CJS. Durante el desarrollo de Vite 3, presentamos los cambios necesarios para permitir también el uso de [esbuild para optimizar las dependencias durante el tiempo de compilación](/guide/migration#uso-de-la-optimizacion-de-dependencias-de-esbuild-en-la-compilacion). Entonces se puede evitar [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs), haciendo que el tiempo de desarrollo y compilación funcione de la misma manera.

Dado que Rollup v3 estará disponible en los próximos meses, y vamos a seguir con otra versión importante de Vite, hemos decidido hacer que este modo sea opcional para reducir el alcance de v3 y darle a Vite y al ecosistema más tiempo para trabajar en posibles problemas con el nuevo enfoque de interoperabilidad de CJS durante el tiempo de compilación. Los marcos de trabajo pueden cambiar al uso de la optimización de dependencias de esbuild durante el tiempo de compilación de forma predeterminada a su propio ritmo antes de Vite 4.

### Aceptación parcial de HMR (experimental)

Hay soporte opcional para [Aceptación parcial de HMR](https://github.com/vitejs/vite/pull/7324). Esta funcionalidad podría desbloquear un HMR más robusto para los componentes del marco que exportan varios enlaces en el mismo módulo. Puedes obtener más información en [la discusión de esta propuesta](https://github.com/vitejs/vite/discussions/7309).

## Reducción de tamaño de paquete

Vite se preocupa por su huella de publicación e instalación; una instalación rápida de una nueva aplicación es una funcionalidad. Vite empaqueta la mayoría de sus dependencias e intenta utilizar alternativas ligeras y modernas siempre que sea posible. Continuando con este objetivo, el tamaño de publicación de Vite 3 es un 30% más pequeño que el de v2.

|             | Tamaño de publicación | Tamaño de instalación |
| ----------- | :-------------------: | :-------------------: |
| Vite 2.9.14 |        4.38MB         |        19.1MB         |
| Vite 3.0.0  |        3.05MB         |        17.8MB         |
| Reducción   |         -30%          |          -7%          |

En parte, esta reducción fue posible al hacer que algunas dependencias que la mayoría de los usuarios no necesitaban fueran opcionales. Primero, [Terser](https://github.com/terser/terser) ya no está instalado de manera predeterminada. Esta dependencia ya no era necesaria porque ya hicimos que esbuild fuera el minificador predeterminado para JS y CSS en Vite 2. Si usas `build.minify: 'terser'`, deberás instalarlo (`npm add -D terser `). También sacamos [node-forge](https://github.com/digitalbazaar/forge) del monorepo, implementando soporte para la generación automática de certificados https como nuevo complemento: [`@vitejs/plugin-basic-ssl`](/guide/migration#generacion-automatica-de-certificados-https). Dado que esta función solo crea certificados que no son de confianza y que no se agregan al almacén local, no justificaba el tamaño agregado.

## Corrección de errores

Un maratón de selección de incidencias fue encabezado por [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), que recientemente se unió al equipo de Vite. Durante los últimos tres meses, las incidencias abiertas de Vite se redujeron de 770 a 400. Todo esto se logró mientras las solicitudes de cambios recién abiertas estaban en su punto más alto. Al mismo tiempo, [@haoqunjiang](https://twitter.com/haoqunjiang) también preparó una [descripción general de los problemas de Vite](https://github.com/vitejs/vite/discussions/8232).

[![Graph of open issues and pull requests in Vite](../images/v3-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

[![Graph of new issues and pull requests in Vite](../images/v3-new-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

## Notas de compatibilidad

- Vite ya no es compatible con Node.js 12/13/15, que alcanzaron su final de soporte. Ahora se requiere Node.js 14.18+/16+.
- Vite ahora se publica como ESM, con un proxy CJS a la entrada de ESM para compatibilidad.
- Los lineamientos básicos para navegadores modernos ahora está dirigido a navegadores que admiten los [módulos ES nativos](https://caniuse.com/es6-module), [importación dinámica ESM nativa](https://caniuse.com/es6-module-dynamic-import) e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta).
- Las extensiones de archivo JS en modo SSR y librería ahora usan una extensión válida (`js`, `mjs` o `cjs`) para generar entradas y fragmentos JS en función de su formato y el tipo de paquete.

Obtén más información en la [Guía de migración](/guide/migration).

## Actualizaciones al Core de Vite

Mientras trabajábamos en Vite 3, también mejoramos la experiencia de contribución para los colaboradores de [Vite Core](https://github.com/vitejs/vite).

- Las pruebas unitarias y E2E se han migrado a [Vitest](https://vitest.dev), proporcionando una experiencia de desarrollo más rápida y estable. Este movimiento también funciona como trabajo interno para un importante proyecto de infraestructura en el ecosistema.
- La compilación de VitePress ahora se prueba como parte de la integración continua.
- Vite se ha actualizado a [pnpm 7](https://pnpm.io/), siguiendo al resto del ecosistema.
- Playgrounds se ha movido a [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground) fuera del directorio de paquetes.
- Los paquetes y playgrounds ahora son `"type": "module"`,
- Los complementos ahora se empaquetan usando [unbuild](https://github.com/unjs/unbuild), y [plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) y [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) se reescribieron en TypeScript.

## El ecosistema está listo para v3

Hemos trabajado de cerca con proyectos en el ecosistema para garantizar que los marcos impulsados ​​por Vite estén listos para Vite 3. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) nos permite ejecutar las integraciones continuas de los actores principales en el ecosistema en contraste con la rama principal de Vite y recibir informes oportunos antes de introducir una regresión. El lanzamiento de hoy pronto debería ser compatible con la mayoría de los proyectos que usan Vite.

## Agradecimientos

Vite 3 es el resultado del esfuerzo conjunto de los miembros del [Equipo de Vite](/team) que trabajan junto con los mantenedores del proyecto del ecosistema y otros colaboradores del núcleo de Vite.

Queremos agradecer a todos los que han implementado funciones y correcciones, han brindado comentarios y han estado involucrados en Vite 3:

- Miembros del equipo de Vite [@youyuxi](https://twitter.com/youyuxi), [@patak_dev](https://twitter.com/patak_dev), [@antfu7](https://twitter.com/antfu7), [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), [@haoqunjiang](https://twitter.com/haoqunjiang), [@poyoho](https://github.com/poyoho), [@Shini_92](https://twitter.com/Shini_92), y [@retropragma](https://twitter.com/retropragma).
- [@benmccann](https://github.com/benmccann), [@danielcroe](https://twitter.com/danielcroe), [@brillout](https://twitter.com/brillout), [@sheremet_va](https://twitter.com/sheremet_va), [@userquin](https://twitter.com/userquin), [@enzoinnocenzi](https://twitter.com/enzoinnocenzi), [@maximomussini](https://twitter.com/maximomussini), [@IanVanSchooten](https://twitter.com/IanVanSchooten), el [equipo de Astro](https://astro.build/), y todos los demás mantenedores de marcos y complementos en el ecosistema que ayudaron a dar forma a v3.
- [@dominikg](https://github.com/dominikg) por su trabajo en vite-ecosystem-ci.
- [@ZoltanKochan](https://twitter.com/ZoltanKochan) por su trabajo en [pnpm](https://pnpm.io/), y por su capacidad de respuesta cuando necesitábamos apoyo.
- [@rixo](https://github.com/rixo) por el soporte de aceptación parcial de HMR.
- [@KiaKing85](https://twitter.com/KiaKing85) por preparar el tema para el lanzamiento de Vite 3, y [@\_brc_dd](https://twitter.com/_brc_dd) por trabajar en las partes internas de VitePress.
- [@CodingWithCego](https://twitter.com/CodingWithCego) por la nueva traduccion al español, y [@ShenQingchuan](https://twitter.com/ShenQingchuan), [@hiro-lapis](https://github.com/hiro-lapis) y a otros en los equipos de traducción de chino y japonés por mantener actualizados los documentos traducidos.

También queremos agradecer a las personas y empresas que patrocinan el equipo de Vite, y a las empresas que invierten en el desarrollo de Vite: parte del trabajo de [@antfu7](https://twitter.com/antfu7) en Vite y el ecosistema es parte de su trabajo en [Nuxt Labs](https://nuxtlabs.com/), y [StackBlitz](https://stackblitz.com/) contrató a [@patak_dev](https://twitter.com/patak_dev) para trabajar a tiempo completo en Vite.

## ¿Qué se viene?

Nos tomaremos los siguientes meses para asegurar una transición fluida para todos los proyectos construidos sobre Vite. Por lo tanto, las primeras versiones menores se centrarán en continuar con nuestros esfuerzos de clasificación con un enfoque en los problemas recién abiertos.

El equipo de Rollup está [trabajando en su próxima gran versión](https://twitter.com/lukastaegert/status/1544186847399743488), que se lanzará en los próximos meses. Una vez que el ecosistema de complementos de Rollup tenga tiempo de actualizarse, haremos un seguimiento con una nueva versión importante de Vite. Esto nos dará otra oportunidad de introducir cambios más significativos este año, que podríamos aprovechar para estabilizar algunas de las funcionalidades experimentales introducidas en esta versión.

Si estás interesado en ayudar a mejorar Vite, la mejor manera de unirse es ayudar con las incidencias ya clasificadas. Únete a [nuestro Discord](https://chat.vitejs.dev) y busca el canal `#contributing`. O participa en nuestros `#docs`, `#help` , o crea complementos. Recién estamos comenzando. Hay muchas ideas abiertas para seguir mejorando la experiencia de desarrollo de Vite.
