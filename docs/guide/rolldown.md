# Integración con Rolldown

Vite planea integrar [Rolldown](https://rolldown.rs), un empaquetador de JavaScript impulsado por Rust, para mejorar el rendimiento y las capacidades de compilación.

<YouTubeVideo videoId="RRjfm8cMveQ" />

## ¿Qué es Rolldown?

Rolldown es un empaquetador moderno y de alto rendimiento para JavaScript, escrito en Rust. Está diseñado como un reemplazo directo de Rollup, con el objetivo de ofrecer mejoras significativas en rendimiento sin perder compatibilidad con el ecosistema actual.

Rolldown se basa en tres principios clave:

- **Velocidad**: Construido con Rust para obtener el máximo rendimiento.
- **Compatibilidad**: Funciona con los plugins existentes de Rollup.
- **Optimización**: Viene con características que van más allá de lo que implementan esbuild y Rollup.

## ¿Por qué Vite está migrando a Rolldown?

1. **Unificación**: Vite actualmente utiliza esbuild para el preempaquetado de dependencias y Rollup para las compilaciones de producción. Rolldown busca unificar estos procesos en un único empaquetador de alto rendimiento, reduciendo la complejidad.

2. **Rendimiento**: La implementación en Rust de Rolldown ofrece mejoras de rendimiento significativas en comparación con los empaquetadores basados en JavaScript. Aunque los benchmarks específicos pueden variar, las pruebas iniciales muestran aumentos de velocidad prometedores frente a Rollup.

Para más información sobre las motivaciones detrás de Rolldown, visita [por qué se construye Rolldown](https://rolldown.rs/guide/introduction#why-rolldown).

3. **Funciones Adicionales**: Rolldown introduce características que no están disponibles en Rollup ni en esbuild, como un control avanzado de la división en fragmentos, HMR incorporado y Module Federation.

## Beneficios de probar `rolldown-vite`

- Experimentar tiempos de compilación mucho más rápidos, especialmente en proyectos grandes.
- Proporcionar retroalimentación valiosa para ayudar a moldear el futuro de Vite.
- Preparar tus proyectos para la futura integración oficial de Rolldown.

## Cómo probar Rolldown

La versión de Vite impulsada por Rolldown está disponible actualmente como un paquete separado llamado `rolldown-vite`. Si tienes `vite` como una dependencia directa, puedes hacer un alias del paquete `vite` a `rolldown-vite` en tu proyecto en el `package.json`, lo que debería resultar en un reemplazo directo.

```json
{
  "devDependencies": {
    "vite": "^7.0.0" // [!code --]
    "vite": "npm:rolldown-vite@latest" // [!code ++]
  }
}
```

::: tip ¡Fija la versión!

Aunque en los ejemplos se use `@latest`, se recomienda utilizar un número de versión específico para evitar cambios inesperados, ya que [`rolldown-vite` se considera experimental](#politica-de-versionado).

:::

Si usas Vitepress o un meta framework que tiene `vite` como dependencia par, deberás sobrescribir la dependencia `vite` en tu `package.json`, el cual funciona ligeramente diferente dependiendo de tu gestor de paquetes.

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

Si estás comenzando un proyecto nuevo, también puedes usar `create-vite` con `rolldown-vite` con normalidad. La versión más reciente te preguntará si deseas usar `rolldown-vite` o no.

## Limitaciones conocidas

Aunque Rolldown busca ser un reemplazo directo de Rollup, todavía hay funciones en desarrollo y algunas diferencias intencionales de comportamiento. Para una lista completa y actualizada, consulta [esta solicitud de cambios en GitHub](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667), el cual se actualiza de forma constante.

### Advertencias de Validación de Opciones

Rolldown lanza una advertencia cuando se pasan opciones desconocidas o no válidas. Dado que algunas opciones disponibles en Rollup no son compatibles con Rolldown, es posible que encuentres advertencias según las opciones que tú o el meta framework que uses hayan configurado. A continuación, se muestra un ejemplo de uno de estos mensajes de advertencia:

> Warning validate output options.
>
> - For the "generatedCode". Invalid key: Expected never but received "generatedCode".

Si tú no estás pasando esa opción directamente, esto debe ser corregido por el framework que estés utilizando.

### Diferencias en la API

#### `manualChunks` a `codeSplitting`

Aunque Rolldown tiene soporte para la opción `manualChunks` expuesta por Rollup, esta se encuentra marcada como obsoleta. En su lugar, Rolldown ofrece una configuración más detallada a través de la [opción `codeSplitting`](https://rolldown.rs/in-depth/manual-code-splitting#code-splitting), que es más similar a `splitChunk` de webpack:

```js
// Configuración antigua (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// Nueva configuración (Rolldown)
export default {
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]
        }
      }
    }
  }
}
```

## Rendimiento

`rolldown-vite` se centra en garantizar la compatibilidad con el ecosistema existente, por lo que los valores predeterminados están orientados a una transición fluida. Puedes obtener mejoras de rendimiento adicionales al cambiar a complementos internos basados en Rust más rápidos y otras personalizaciones.

### Habilitar Plugins Nativos

Gracias a Rolldown y Oxc, varios plugins internos de Vite han sido convertidos a Rust. Ahora, los plugins nativos están habilitados por defecto, con el valor predeterminado establecido en `'v1'`.

Si experimentas algún problema, puedes cambiar la opción `experimental.enableNativePlugin` en tu configuración de Vite a `'resolver'` o `false` como una solución alternativa. Ten en cuenta que esta opción será removida en el futuro.

### Utilizando transformación de React refresh de Oxc

`@vitejs/plugin-react` v5.0.0+ utiliza la transformación de React refresh de Oxc. Si no estás utilizando ningún plugin de Babel (incluyendo el compilador de React), la transformación completa ahora se realizará por Oxc y mejorará el rendimiento de la compilación sin ningún cambio adicional que no sea actualizar `@vitejs/plugin-react`.

Si estás utilizando `@vitejs/plugin-react-swc` sin plugins de SWC y opciones personalizadas de SWC, puedes cambiar a `@vitejs/plugin-react` para utilizar Oxc.

::: details `@vitejs/plugin-react-oxc` plugin es obsoleto

Anteriormente, recomendábamos usar `@vitejs/plugin-react-oxc` para utilizar la transformación de React refresh de Oxc. Sin embargo, hemos fusionado la implementación en `@vitejs/plugin-react` para que sea más fácil cambiar a `rolldown-vite`. `@vitejs/plugin-react-oxc` ya no se actualiza y ya no se actualizará.

:::

### Envoltorio de `withFilter`

Los autores de plugins tienen la opción de usar la [característica de filtro de hooks](#caracteristica-de-filtro-de-hooks) para reducir la sobrecarga de comunicación entre los entornos de ejecución de Rust y JavaScript. Pero en caso de que algunos de los plugins que uses no soporten esta característica (aún) pero aún desees aprovecharla, puedes usar el envoltorio `withFilter` para envolver el complemento con un filtro por ti mismo.

```js
// En tu vite.config.ts
import { withFilter, defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // Cargar el complemento `svgr` solo para archivos que terminen en `.svg?react`
    withFilter(
      svgr({
        /*...*/
      }),
      { load: { id: /\.svg\?react$/ } },
    ),
  ],
})
```

## Reporta problemas

Como se trata de una integración experimental, podrías encontrarte con errores. Si es así, repórtalos en el repositorio [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite), **no en el repositorio principal de Vite**.

Al [reportar problemas](https://github.com/vitejs/rolldown-vite/issues/new), por favor sigue la plantilla de issues correspondiente y proporciona lo que se solicita allí, que comúnmente incluye:

- Una reproducción mínima del problema.
- Detalles de tu entorno (SO, versión de Node, gestor de paquetes).
- Mensajes de error o registros relevantes.

Para discusiones en tiempo real y ayuda, únete al [Discord de Rolldown](https://chat.rolldown.rs/).

## Política de Versionado

La política de versionado de `rolldown-vite` alinea sus versiones mayores y menores con las del paquete normal de Vite. Esta sincronización garantiza que las funcionalidades presentes en una versión menor específica de Vite también estén incluidas en la versión menor correspondiente de `rolldown-vite`. Sin embargo, es importante tener en cuenta que las versiones patch no están sincronizadas entre ambos proyectos. Si tienes dudas sobre si un cambio específico de Vite normal está incluido en `rolldown-vite`, puedes consultar la [lista de cambios independiente de `rolldown-vite`](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md) para confirmarlo.

Además, ten en cuenta que `rolldown-vite` se considera un proyecto experimental. Debido a esta naturaleza, podrían introducirse cambios importantes incluso dentro de versiones patch. También es importante mencionar que `rolldown-vite` solo recibe actualizaciones para su versión menor más reciente. Incluso en casos de correcciones importantes de seguridad o bugs, no se crean parches para versiones mayores o menores anteriores.

## Planes a futuro

El paquete `rolldown-vite` es una solución temporal para recopilar feedback y estabilizar la integración. En el futuro, esta funcionalidad se incorporará al repositorio principal de Vite.

Te animamos a probar `rolldown-vite` y contribuir a su desarrollo con tu retroalimentación y reportes.

En el futuro, también se introducirá un "Modo de Empaquetado Completo" para Vite, el cual servirá archivos empaquetados tanto en modo producción _como en modo desarrollo_.

### ¿Por qué introducir un Modo de Empaquetado Completo?

Vite es conocido por su enfoque de servidor de desarrollo sin empaquetado, lo cual ha sido una de las principales razones de su velocidad y popularidad desde su lanzamiento. Este enfoque fue, inicialmente, un experimento para ver hasta dónde podíamos llevar los límites del rendimiento del servidor de desarrollo sin usar un empaquetador tradicional.

Sin embargo, a medida que los proyectos crecen en tamaño y complejidad, han surgido dos desafíos principales:

1. **Inconsistencias entre desarrollo y producción**: El JavaScript sin empaquetar que se sirve en desarrollo frente al paquete generado para producción crea comportamientos diferentes en tiempo de ejecución. Esto puede provocar errores que solo se manifiestan en producción, lo que dificulta la depuración.

2. **Degradación del rendimiento durante el desarrollo**: El enfoque sin empaquetado implica que cada módulo se solicita por separado, lo que genera una gran cantidad de solicitudes de red. Si bien esto _no afecta en producción_, sí provoca una sobrecarga significativa durante el inicio del servidor de desarrollo y al recargar la página en desarrollo. El impacto es especialmente notorio en aplicaciones grandes donde se deben procesar cientos o miles de solicitudes individuales. Estos cuellos de botella se agravan aún más cuando los desarrolladores utilizan proxies de red, lo que resulta en tiempos de recarga más lentos y una experiencia de desarrollo degradada.

Con la integración de Rolldown, tenemos la oportunidad de unificar las experiencias de desarrollo y producción, manteniendo al mismo tiempo el rendimiento característico de Vite. Un Modo de Empaquetado Completo permitiría servir archivos empaquetados no solo en producción, sino también durante el desarrollo, combinando lo mejor de ambos mundos:

- Tiempos de inicio rápidos incluso para aplicaciones grandes
- Comportamiento consistente entre desarrollo y producción
- Menor sobrecarga de red al recargar la página
- Mantenimiento de un HMR eficiente sobre la salida ESM

Cuando se introduzca el Modo de Empaquetado Completo, será una funcionalidad opcional al principio. Al igual que con la integración de Rolldown, el objetivo es convertirlo en el comportamiento predeterminado una vez que se haya recopilado suficiente retroalimentación y se haya garantizado su estabilidad.

## Guía para Autores de Plugins / Frameworks

::: tip
Esta sección es principalmente relevante para autores de plugins y frameworks. Si eres un usuario, puedes omitirla.
:::

### Resumen de los principales cambios

- **Rolldown** se usa para la compilación (anteriormente se usaba Rollup).
- **Rolldown** se usa para el optimizador (anteriormente se usaba esbuild).
- El soporte de **CommonJS** es manejado por **Rolldown** (anteriormente se usaba `@rollup/plugin-commonjs`).
- **Oxc** se usa para la reducción de sintaxis (anteriormente se usaba esbuild).
- **Lightning CSS** se usa para la minificación de CSS por defecto (anteriormente se usaba esbuild).
- El minificador de **Oxc** se usa para la minificación de JS por defecto (anteriormente se usaba esbuild).
- **Rolldown** se usa para empaquetar la configuración (anteriormente se usaba esbuild).

### Detectando `rolldown-vite`

::: warning
En la mayoría de los casos, no necesitas detectar si tu plugin se ejecuta con `rolldown-vite` o con `vite`, y deberías procurar un comportamiento consistente entre ambos, sin ramificaciones condicionales.
:::

En caso de que necesites un comportamiento diferente con `rolldown-vite`, tienes dos formas de detectar si se está usando `rolldown-vite`:

- Comprobando la existencia de `this.meta.rolldownVersion`:

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // lógica para rolldown-vite
    } else {
      // lógica para rollup-vite
    }
  },
}
```

::: tip

A partir de Vite 7.0.0, `this.meta` está disponible en todos los hooks. En versiones anteriores, `this.meta` no estaba disponible en hooks específicos de Vite, como el hook `config`.

:::

<br>

- Comprobando la existencia de la exportación `rolldownVersion`:

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // lógica para rolldown-vite
} else {
  // lógica para rollup-vite
}
```

Si tienes `vite` como dependencia (no como dependencia par), la exportación `rolldownVersion` es útil y puede ser utilizada en cualquier parte de tu código.

### Ignorar la validación de opciones en Rolldown

Como se [mencionó anteriormente](#advertencias-de-validacion-de-opciones), Rolldown lanza una advertencia cuando se pasan opciones desconocidas o inválidas.

Esto se puede solucionar pasando la opción condicionalmente, verificando si se está ejecutando con `rolldown-vite` como se muestra [aquí arriba](#detectando-rolldown-vite).

### `transformWithEsbuild` requiere que `esbuild` esté instalado por separado

Como Vite ya no usa `esbuild` por sí mismo, `esbuild` ahora es un peer-dependency opcional. Si tu plugin usa `transformWithEsbuild`, el plugin necesita agregar `esbuild` a sus dependencias o el usuario necesitará instalarlo manualmente.

La migración recomendada es usar la nueva función exportada `transformWithOxc`, que utiliza Oxc en lugar de `esbuild`.

### Capa de Compatibilidad para Opciones de `esbuild`

Rolldown-Vite tiene una capa de compatibilidad para convertir las opciones de `esbuild` a las correspondientes de Oxc o `rolldown`. Según las pruebas realizadas en [el ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md), esto funciona en muchos casos, incluidos los plugins simples de `esbuild`. Dicho esto, **el soporte para las opciones de `esbuild` será eliminado en el futuro** y se recomienda probar las opciones correspondientes de Oxc o `rolldown`.

Puedes obtener las opciones configuradas por la capa de compatibilidad desde el hook `configResolved`:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
}
```

### Característica de Filtro de Hooks

Rolldown introdujo una [característica de filtro de hooks](https://rolldown.rs/apis/plugins-hook-filters) para reducir la sobrecarga de comunicación entre los entornos de ejecución de Rust y JavaScript. Esta característica permite que los plugins especifiquen patrones que determinan cuándo deben llamarse los hooks, mejorando el rendimiento al evitar invocaciones innecesarias.

Consulta también la [guía de filtros de hooks de la API de plugins](/guide/api-plugin#filtros-de-hooks) para más información.

### Convertir Contenido a JavaScript en los Hooks `load` o `transform`

Si estás convirtiendo el contenido a JavaScript desde otros tipos en los hooks `load` o `transform`, es posible que debas agregar `moduleType: 'js'` al valor devuelto.

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!código ++]
      }
    }
  },
}
```

Esto se debe a que [Rolldown soporta módulos de no JavaScript](https://rolldown.rs/in-depth/module-types) e infiere el tipo de módulo a partir de las extensiones, a menos que se especifique lo contrario.
