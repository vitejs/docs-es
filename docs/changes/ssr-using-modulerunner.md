# SSR Utilizando la API `ModuleRunner`

::: tip Feedback
Danos tus opiniones en [Discusión de la API de entorno](https://github.com/vitejs/vite/discussions/16358)
:::

`server.ssrLoadModule` ha sido reemplazado por la importación desde un [Ejecutor de Módulos](/guide/api-environment#modulerunner).

Ámbito afectado: `Autor de Plugins de Vite`

::: warning Futura eliminación
`ModuleRunner` fue introducido en `v6.0`. El retiro de `server.ssrLoadModule` está planeado para una versión principal futura. Para identificar tu uso, configura `future.removeSsrLoadModule` en `"warn"` en tu configuración de Vite.
:::

## Motivación

El `server.ssrLoadModule(url)` solo permite importar módulos en el entorno `ssr` y puede ejecutar los módulos en el mismo proceso del servidor de desarrollo de Vite. Para aplicaciones con entornos personalizados, cada uno está asociado con un `ModuleRunner` que puede estar ejecutándose en un hilo o proceso diferente. Para importar módulos, ahora tenemos `moduleRunner.import(url)`.

## Guía de migración

Revisa la [Guía de la API de entorno para Frameworks](/guide/api-environment-frameworks.md).

`server.ssrFixStacktrace` y `server.ssrRewriteStacktrace` no tienen que ser llamados cuando se usan las API del Ejecutor de Módulos. Los seguimientos de pila se actualizarán a menos que `sourcemapInterceptor` esté configurado en `false`.
