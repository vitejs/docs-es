---
title: 'Vite 8 Beta: El Vite impulsado por Rolldown'
author:
  name: El equipo de Vite
date: 2025-12-03
sidebar: false
head:
  - - meta
    - property: og:type
    - content: website
  - - meta
    - property: og:title
    - content: Anunciando Vite 8 Beta
  - - meta
    - property: og:image
    - content: https://vite.dev/og-image-announcing-vite8-beta.webp
  - - meta
    - property: og:url
    - content: https://vite.dev/blog/announcing-vite8-beta
  - - meta
    - property: og:description
    - content: Anuncio de Lanzamiento de Vite 8 Beta
  - - meta
    - name: twitter:card
    - content: summary_large_image
---

# Vite 8 Beta: El Vite impulsado por Rolldown

_Diciembre 3, 2025_

![Imagen de portada del anuncio de Vite 8 Beta](/og-image-announcing-vite8-beta.webp)

TL;DR: La primera beta de Vite 8, con la tecnología [Rolldown](https://rolldown.rs/), ya está disponible. Vite 8 ofrece compilaciones de producción significativamente más rápidas y desbloquea posibilidades de mejora futuras. Puedes probar la nueva versión actualizando `vite` a la versión `8.0.0-beta.0` y leyendo la [guía de migración](/guide/migration).

---

Estamos emocionados de lanzar la primera beta de Vite 8. Esta versión unifica la herramienta subyacente y ofrece mejores comportamientos consistentes, junto con mejoras significativas en el rendimiento de compilación. Vite ahora usa [Rolldown](https://rolldown.rs/) como su bundler, reemplazando la combinación anterior de esbuild y Rollup.

## Un nuevo bundler para la web

Vite previamente se basaba en dos bundlers para cumplir con requisitos diferentes para el desarrollo y compilaciones de producción:

1. esbuild para compilación rápida durante el desarrollo
2. Rollup para empaquetado, división de fragmentos y optimización de compilaciones de producción

Este enfoque permitió a Vite centrarse en la experiencia del desarrollador y orquestación en lugar de reinventar el análisis y empaquetado. Sin embargo, mantener dos canalizaciones de empaquetado separadas introdujo inconsistencias: canalizaciones de transformación separadas, diferentes sistemas de plugins y una cantidad creciente de código pegamento para mantener el comportamiento de empaquetado alineado entre desarrollo y producción.

Para resolver esto, el equipo [VoidZero](https://voidzero.dev) ha construido **Rolldown**, el bundler de próxima generación con el objetivo de ser usado en Vite. Está diseñado para:

- **Rendimiento**: Rolldown está escrito en Rust y opera a velocidad nativa. Coincide con el nivel de rendimiento de esbuild y es **10-30× más rápido que Rollup**.
- **Compatibilidad**: Rolldown soporta la misma API de plugins que Rollup y Vite. La mayoría de los plugins de Vite funcionan sin cambios con Vite 8.
- **Más Características**: Rolldown desbloquea características más avanzadas para Vite, incluyendo modo de paquete completo, control de división de fragmentos más flexible, caché persistente a nivel de módulo, Module Federation y más.

## Unificando la herramienta

El impacto del cambio de bundler de Vite va más allá del rendimiento. Los bundlers aprovechan analizadores, resolutores, transformadores y minificadores. Rolldown usa Oxc, otro proyecto liderado por VoidZero, para estos propósitos.

**Eso hace a Vite el punto de entrada a una herramienta end-to-end mantenida por el mismo equipo: La herramienta de compilación (Vite), el bundler (Rolldown) y el compilador (Oxc).**

Esta alineación asegura consistencia de comportamiento en toda la pila, y nos permite adoptar rápidamente y alinear con nuevas especificaciones de lenguaje a medida que JavaScript continúa evolucionando. También desbloquea una amplia gama de mejoras que previamente no podían ser hechas por Vite solo. Por ejemplo, podemos aprovechar el análisis semántico de Oxc para realizar mejor tree-shaking en Rolldown.

## Cómo Vite migró a Rolldown

La migración a un Vite con tecnología Rolldown es un cambio fundamental. Por lo tanto, nuestro equipo tomó pasos deliberados para implementarlo sin sacrificar estabilidad o compatibilidad del ecosistema.

Primero, un paquete separado `rolldown-vite` fue [lanzado como vista técnica](https://voidzero.dev/posts/announcing-rolldown-vite). Esto nos permitió trabajar con adoptantes tempranos sin afectar la versión estable de Vite. Los adoptantes tempranos se beneficiaron de las ganancias de rendimiento de Rolldown mientras proporcionaban retroalimentación valiosa. Aspectos destacados:

- Los tiempos de compilación de producción de Linear se redujeron de 46s a 6s
- Ramp redujo su tiempo de compilación en un 57%
- Mercedes-Benz.io redujo su tiempo de compilación hasta en un 38%
- Beehiiv redujo su tiempo de compilación en un 64%

A continuación, configuramos una suite de pruebas para validar plugins clave de Vite contra `rolldown-vite`. Este trabajo de CI nos ayudó a capturar regresiones y problemas de compatibilidad temprano, especialmente para frameworks y meta-frameworks como SvelteKit, react-router y Storybook.

Finalmente, construimos una capa de compatibilidad para ayudar a migrar desarrolladores desde opciones de Rollup y esbuild a las opciones correspondientes de Rolldown.

Como resultado, hay una ruta de migración suave a Vite 8 para todos.

## Migrando a Vite 8 Beta

Dado que Vite 8 toca el comportamiento de compilación central, nos centramos en mantener la API de configuración y hooks de plugins sin cambios. Creamos una [guía de migración](/guide/migration) para ayudarte a actualizar.

Hay dos rutas de actualización disponibles:

1. **Actualización Directa:** Actualiza `vite` en `package.json` y ejecuta los comandos habituales de dev y build.
2. **Migración Gradual:** Migra desde Vite 7 al paquete `rolldown-vite`, y luego a Vite 8. Esto te permite identificar incompatibilidades o problemas aislados de Rolldown sin otros cambios a Vite. (Recomendado para proyectos grandes o complejos)

> [!IMPORTANT]
> Si estás dependiendo de opciones específicas de Rollup o esbuild, podrías necesitar hacer algunos ajustes a tu configuración de Vite. Por favor consulta la [guía de migración](/guide/migration) para instrucciones detalladas y ejemplos.
> 
> Como con todas las versiones mayores no estables, se recomienda pruebas exhaustivas después de actualizar para asegurar que todo funcione como se espera. Por favor asegúrate de reportar cualquier [problema](https://github.com/vitejs/rolldown-vite/issues).

Si usas un framework o herramienta que usa Vite como dependencia, por ejemplo Astro, Nuxt, o Vitest, tienes que sobreescribir la dependencia `vite` en tu `package.json`, lo que funciona ligeramente diferente dependiendo de tu gestor de paquetes:

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "8.0.0-beta.0"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

:::

Después de agregar estas overrides, reinstala tus dependencias e inicia tu servidor de desarrollo o compila tu proyecto como de costumbre.

## Características adicionales en Vite 8

Además de incluir Rolldown, Vite 8 viene con:

- **Soporte integrado de `paths` de tsconfig:** Los desarrolladores pueden habilitarlo configurando [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) a `true`. Esta característica tiene un pequeño costo de rendimiento y no está habilitada por defecto.
- **Soporte de `emitDecoratorMetadata`:** Vite 8 ahora tiene soporte automático integrado para la opción [`emitDecoratorMetadata` de TypeScript](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata). Consulta la página de [Características](/guide/features.md#emitdecoratormetadata) para más detalles.

## Mirando hacia adelante

La velocidad siempre ha sido una característica definitoria para Vite. La integración con Rolldown y, por extensión, Oxc significa que los desarrolladores de JavaScript se benefician de la velocidad de Rust. Actualizar a Vite 8 debería resultar en ganancias de rendimiento simplemente por usar Rust.

También estamos emocionados de lanzar pronto el Modo de Paquete Completo de Vite, que mejora drásticamente la velocidad del servidor dev para proyectos grandes. Resultados preliminares muestran 3× más rápido en el inicio del servidor dev, 40% más rápido en recargas completas, y 10× menos solicitudes de red.

Otra característica definitoria de Vite es el ecosistema de plugins. Queremos que los desarrolladores de JavaScript continúen extendiendo y personalizando Vite en JavaScript, el lenguaje con el que están familiarizados, mientras se benefician de las ganancias de rendimiento de Rust. Nuestro equipo está colaborando con el equipo VoidZero para acelerar el uso de plugins JavaScript en estos sistemas basados en Rust.

Optimizaciones próximas que actualmente son experimentales:

- [**Transferencia de AST cruda**](https://github.com/oxc-project/oxc/issues/2409). Permitir que los plugins JavaScript accedan al AST producido por Rust con sobrecarga mínima.
- [**Transformaciones MagicString nativas**](https://rolldown.rs/in-depth/native-magicstring#native-magicstring). Transformaciones personalizadas simples con lógica en JavaScript pero computación en Rust.

## **Conéctate con nosotros**

Si has probado la beta de Vite 8, ¡nos encantaría escuchar tu retroalimentación! Por favor reporta cualquier problema o comparte tu experiencia:

- **Discord**: Únete a nuestro [servidor comunitario](https://chat.vite.dev/) para discusiones en tiempo real
- **GitHub**: Comparte retroalimentación en [GitHub discussions](https://github.com/vitejs/vite/discussions)
- **Problemas**: Reporta problemas en el [repositorio rolldown-vite](https://github.com/vitejs/rolldown-vite/issues) para bugs y regresiones
- **Logros**: Comparte tus tiempos de compilación mejorados en el [repositorio rolldown-vite-perf-wins](https://github.com/vitejs/rolldown-vite-perf-wins)

Apreciamos todos los reportes y casos de reproducción. Nos ayudan a guiarnos hacia el lanzamiento de una versión estable 8.0.0.
