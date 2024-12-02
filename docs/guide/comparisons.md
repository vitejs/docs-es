# Comparaciones

## WMR

[WMR](https://github.com/preactjs/wmr) del equipo de Preact intentaba proporcionar un conjunto de características similares. La API universal de plugins de Rollup de Vite para desarrollo y compilación se inspiró en ella.

WMR ya no se mantiene. El equipo de Preact ahora recomienda Vite con [@preactjs/preset-vite](https://github.com/preactjs/preset-vite).

## Snowpack

[Snowpack](https://www.snowpack.dev/) también era un servidor de desarrollo de ESM nativo sin empaquetado, muy similar en alcance a Vite. El proyecto ya no se mantiene. El equipo de Snowpack ahora está trabajando en [Astro](https://astro.build/), un creador de sitios estáticos impulsado por Vite. El equipo de Astro ahora es un actor importante en el ecosistema y está ayudando a mejorar Vite.

Aparte de los diferentes detalles de implementación, los dos proyectos compartieron mucho en términos de ventajas técnicas sobre las herramientas tradicionales. El preempaquetado de dependencias de Vite también está inspirado en Snowpack v1 (ahora [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Algunas de las principales diferencias entre los dos proyectos se enumeran en [la Guía de comparaciones de la v2](https://v2.vite.dev/guide/comparisons).

## @web/servidor-dev

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (anteriormente `es-dev-server`) es un gran proyecto y la configuración del servidor de Koa en Vite 1.0 fue inspirada de él.

`@web/dev-server` es un nivel un poco más bajo en términos de alcance. No proporciona integraciones de marco de desarrollo oficiales y requiere configuración manual de Rollup para la compilación en producción.

En general, Vite es una herramienta más destinada/de alto nivel que tiene como objetivo proporcionar un flujo de trabajo más listo para usar. Dicho esto, el proyecto general `@web` contiene muchas otras herramientas excelentes que también pueden beneficiar a los usuarios de Vite.
