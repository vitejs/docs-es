# Integración con Rolldown

Vite planea integrar [Rolldown](https://rolldown.rs), un empaquetador de JavaScript impulsado por Rust, para mejorar el rendimiento y las capacidades de compilación.

## ¿Qué es Rolldown?

Rolldown es un empaquetador moderno y de alto rendimiento para JavaScript, escrito en Rust. Está diseñado como un reemplazo directo de Rollup, con el objetivo de ofrecer mejoras significativas en rendimiento sin perder compatibilidad con el ecosistema actual.

Rolldown se basa en tres principios clave:

- **Velocidad**: Construido con Rust para obtener el máximo rendimiento.
- **Compatibilidad**: Funciona con los plugins existentes de Rollup.
- **Experiencia de desarrollo**: API familiar para usuarios de Rollup.

## ¿Por qué Vite está migrando a Rolldown?

1. **Unificación**: Vite actualmente utiliza esbuild para el preempaquetado de dependencias y Rollup para las compilaciones de producción. Rolldown busca unificar estos procesos en un único empaquetador de alto rendimiento, reduciendo la complejidad.

2. **Rendimiento**: La implementación en Rust de Rolldown ofrece mejoras de rendimiento significativas en comparación con los empaquetadores basados en JavaScript. Aunque los benchmarks específicos pueden variar, las pruebas iniciales muestran aumentos de velocidad prometedores frente a Rollup.

Para más información sobre las motivaciones detrás de Rolldown, visita [por qué se construye Rolldown](https://rolldown.rs/guide/#why-rolldown).

## Beneficios de probar `rolldown-vite`

- Experimentar tiempos de compilación mucho más rápidos, especialmente en proyectos grandes.
- Proporcionar retroalimentación valiosa para ayudar a moldear el futuro de Vite.
- Preparar tus proyectos para la futura integración oficial de Rolldown.

## Cómo probar Rolldown

La versión de Vite con Rolldown está disponible actualmente como un paquete separado llamado `rolldown-vite`. Puedes probarlo agregando `overrides` a tu `package.json`:

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

:::

Luego de agregar estos `overrides`, reinstala tus dependencias y ejecuta tu servidor de desarrollo o compila tu proyecto como de costumbre. No se requieren más cambios de configuración.

## Limitaciones conocidas

Aunque Rolldown busca ser un reemplazo directo de Rollup, todavía hay funciones en desarrollo y algunas diferencias intencionales de comportamiento. Para una lista completa y actualizada, consulta [esta solicitud de cambios en GitHub](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667).

## Reporta problemas

Como se trata de una integración experimental, podrías encontrarte con errores. Si es así, repórtalos en el repositorio [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite), **no en el repositorio principal de Vite**.

Al [reportar problemas](https://github.com/vitejs/rolldown-vite/issues/new), sigue la plantilla del issue e incluye:

- Una reproducción mínima del problema.
- Detalles de tu entorno (SO, versión de Node, gestor de paquetes).
- Mensajes de error o registros relevantes.

Para discusiones en tiempo real y ayuda, únete al [Discord de Rolldown](https://chat.rolldown.rs/).

## Planes a futuro

El paquete `rolldown-vite` es una solución temporal para recopilar feedback y estabilizar la integración. En el futuro, esta funcionalidad se incorporará al repositorio principal de Vite.

Te animamos a probar `rolldown-vite` y contribuir a su desarrollo con tu retroalimentación y reportes.
