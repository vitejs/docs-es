---
title: ¡Vite 4.3 ya está disponible!
author:
  - name: El equipo de Vite
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 4.3
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://es.vite.dev/blog/anunciando-vite-4-3
  - - meta
    - property: og:description
      content: Vite 4.3 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ¡Vite 4.3 ya está disponible!

_April 20, 2023_

![Imagen de portada de lanzamiento de Vite 4.3](/og-image-announcing-vite4-3.png)

Enlaces rápidos:

- Documentaciones: [English](/), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/)
- [Lista de cambios de Vite 4.3 (en inglés)](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## Mejoras de rendimiento

En esta versión menor, nos enfocamos en mejorar el rendimiento del servidor de desarrollo. La lógica de resolución se simplificó, mejorando las rutas activas e implementando un almacenamiento en caché más inteligente para encontrar el `package.json`, archivos de configuración de Typescript, y URLs resueltas en general.

Puedes leer un recorrido detallado del trabajo de rendimiento realizado en esta publicación de blog por uno de los Colaboradores de Vite: [How we made Vite 4.3 faaaaster 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

Este sprint resultó en mejoras de velocidad en todos los ámbitos en comparación con Vite 4.2.

Estas son las mejoras de rendimiento medidas por [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare), que prueba una aplicación con 1000 componentes de React desde el tiempo de inicio del servidor de desarrollo en frío y en caliente, así como tiempos de HMR para un componente padre e hijo:

| **Vite (babel)**       |  Vite 4.2 | Vite 4.3 | Mejora |
| :--------------------- | --------: | -------: | -----: |
| **Inicio en frío**     | 17249.0ms | 5132.4ms | -70.2% |
| **Inicio en caliente** |  6027.8ms | 4536.1ms | -24.7% |
| **HMR Padre**          |    46.8ms |   26.7ms | -42.9% |
| **HMR Hijo**           |    27.0ms |   12.9ms | -52.2% |

| **Vite (swc)**         |  Vite 4.2 | Vite 4.3 | Mejora |
| :--------------------- | --------: | -------: | -----: |
| **Inicio en frío**     | 13552.5ms | 3201.0ms | -76.4% |
| **Inicio en caliente** |  4625.5ms | 2834.4ms | -38.7% |
| **HMR Padre**          |    30.5ms |   24.0ms | -21.3% |
| **Leaf HMR**           |    16.9ms |   10.0ms | -40.8% |

![Comparación de tiempo Vite 4.3 vs 4.2](/vite4-3-startup-time.png)

![Comparación del HMR de Vite 4.3 vs 4.2](/vite4-3-hmr-time.png)

Puedes leer más información sobre las pruebas de rendimiento [aquí](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e). Especificaciones y versiones para esta ejecución de rendimiento:

- CPU: Ryzen 9 5900X, Memory: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Versiones de Vite y el plugin de React:
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

Los primeros usuarios en usar Vite 4.3 también informaron de una mejora del tiempo de inicio de desarrollo de un rango 1.5x-2x en aplicaciones reales mientras probaban la versión beta. Nos encantaría conocer los resultados de tus aplicaciones.

## Perfilado

Seguiremos trabajando en el rendimiento de Vite. Estamos trabajando en una [herramienta comparativa oficial](https://github.com/vitejs/vite-benchmark) para Vite que nos permite obtener métricas de rendimiento para cada solicitud de cambio de código.

Y [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) ahora tiene más funciones relacionadas con el rendimiento para ayudar a identificar qué plugins o middlewares son el cuello de botella para tus aplicaciones.

Usando `vite --profile` (y luego presionando `p`) una vez que se carga la página, se guardará un perfil de CPU del inicio del servidor de desarrollo. Puedes abrirlos en una aplicación como [speedscope](https://www.speedscope.app/) para identificar problemas de rendimiento. Y puedes compartir tus hallazgos con el equipo de Vite en una [Discusión](https://github.com/vitejs/vite/discussions) o en el [Discord de Vite](https://chat.vite.dev).

## Próximos pasos

Decidimos hacer una sola versión importante de Vite este año alineándonos con el [final de soporte de Node.js 16](https://endoflife.date/nodejs) en septiembre, eliminando el soporte para Node.js 14 y 16 en él. Si deseas participar, abrimos una [Discusión de Vite 5](https://github.com/vitejs/vite/discussions/12466) para recopilar comentarios desde ahora.
