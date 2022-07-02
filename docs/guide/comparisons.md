# Comparaciones

## WMR

[WMR](https://github.com/preactjs/wmr) del equipo de Preact proporciona un conjunto de funciones similar, y el soporte de Vite 2.0 para la interfaz de complemento de Rollup está inspirado en él.

WMR está diseñado principalmente para proyectos [Preact](https://preactjs.com/) y ofrece funciones más integradas, como prerenderizado. En términos de alcance, está más cerca de un marco meta de Preact, con el mismo énfasis en el tamaño compacto que el mismo Preact. Si estás utilizando Preact, es probable que WMR ofrezca una experiencia más afinada.

## Snowpack

[Snowpack](https://www.snowpack.dev/) también era un servidor de desarrollo de ESM nativo sin empaquetado, muy similar en alcance a Vite. El proyecto ya no se mantiene. El equipo de Snowpack ahora está trabajando en [Astro](https://astro.build/), un creador de sitios estáticos impulsado por Vite. El equipo de Astro ahora es un actor importante en el ecosistema y está ayudando a mejorar Vite.

Aparte de los diferentes detalles de implementación, los dos proyectos compartieron mucho en términos de ventajas técnicas sobre las herramientas tradicionales. El preempaquetado de dependencias de Vite también está inspirado en Snowpack v1 (ahora [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Algunas de las principales diferencias entre los dos proyectos se enumeran en [la Guía de comparaciones de la v2](https://v2.vitejs.dev/guide/comparisons).

## @web/servidor-dev

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (anteriormente `es-dev-server`) es un gran proyecto y la configuración del servidor de Koa en Vite 1.0 fue inspirada de él.

`@web/dev-server` es un nivel un poco más bajo en términos de alcance. No proporciona integraciones de marco de desarrollo oficiales y requiere configuración manual de Rollup para la compilación en producción.

En general, Vite es una herramienta más destinada/de alto nivel que tiene como objetivo proporcionar un flujo de trabajo más listo para usar. Dicho esto, el proyecto general `@web` contiene muchas otras herramientas excelentes que también pueden beneficiar a los usuarios de Vite.
