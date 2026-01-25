# Preempaquetado de dependencias

Cuando ejecutas `vite` por primera vez, Vite preempaqueta las dependencias de tu proyecto antes de cargar tu sitio localmente. Se realiza de forma automática y transparente por defecto.

## El por qué

Este es Vite realizando lo que llamamos "preempaquetado de dependencias". Este proceso tiene dos propósitos:

1. **Compatibilidad con CommonJS y UMD:** Durante el desarrollo, el desarrollador de Vite sirve todo el código como ESM nativo. Por lo tanto, Vite primero debe convertir las dependencias que se envían como CommonJS o UMD en ESM.

   Al convertir las dependencias de CommonJS, Vite realiza un análisis de importación inteligente para que las importaciones con nombre a los módulos de CommonJS funcionen como se espera, incluso si las exportaciones se asignan dinámicamente (por ejemplo, React):

   ```js
   // funciona como se esperaba
   import React, { useState } from 'react'
   ```

2. **Rendimiento:** Vite convierte las dependencias ESM con muchos módulos internos en un solo módulo para mejorar el rendimiento de carga de la página posterior.

   Algunos paquetes envían sus compilaciones de módulos ES como muchos archivos separados que se importan entre sí. Por ejemplo, [`lodash-es` tiene más de 600 módulos internos](https://unpkg.com/browse/lodash-es/)! Cuando hacemos`import { debounce } from 'lodash-es'`, ¡el navegador activa más de 600 solicitudes HTTP al mismo tiempo! Aunque el servidor no tiene problemas para manejarlos, la gran cantidad de solicitudes crea una congestión en la red en el lado del navegador, lo que hace que la página se cargue notablemente más lento.

   Al hacer preempaquetar `lodash-es` en un solo módulo, ¡ahora solo necesitamos una solicitud HTTP en su lugar!

::: tip NOTA
El preempaquetado de dependencias solo se aplica en el modo de desarrollo.
:::

## Detección automática de dependencias

Si no se encuentra un caché existente, Vite rastreará su código fuente y descubrirá automáticamente las importaciones de dependencia (es decir, "importaciones básicas" que esperan ser resueltas desde `node_modules`) y usará estas importaciones encontradas como puntos de entrada para el preempaquetado. Este se realiza con [Rolldown](https://rolldown.rs/), por lo que suele ser muy rápido.

Después de que el servidor ya se haya iniciado, si se encuentra una nueva importación de dependencia que aún no está en el caché, Vite volverá a ejecutar el proceso de preempaquetado y recargará la página si es necesario.

## Monorepos y Dependencias Vinculadas

En una configuración monorepo, una dependencia puede ser un paquete vinculado desde el mismo repositorio. Vite detecta automáticamente las dependencias que no se resuelven desde `node_modules` y trata la dependencia vinculada como código fuente. Este no intentará empaquetar la dependencia vinculada y, en su lugar, analizará la lista de dependencias de la dependencia vinculada.

Sin embargo, esto requiere que la dependencia vinculada se exporte como ESM. De lo contrario, puede agregar la dependencia a [`optimizeDeps.include`](/config/dep-optimization-options#optimizedeps-include) en tu configuración.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
})
```

Al realizar cambios en la dependencia vinculada, reinicia el servidor de desarrollo con la opción de línea de comando `--force` para que los cambios surtan efecto.

## Personalizando el Comportamiento

La heurística de descubrimiento de dependencia predeterminada puede no ser siempre deseable. En los casos en los que desees incluir/excluir dependencias explícitamente de la lista, utiliza las [opciones de configuración de `optimizeDeps`](/config/dep-optimization-options).

Un caso de uso típico para `optimizeDeps.include` o `optimizeDeps.exclude` es cuando tienes una importación que no se puede descubrir directamente en el código fuente. Por ejemplo, tal vez la importación se cree como resultado de una transformación de plugin. Esto significa que Vite no podrá descubrir la importación en el escaneo inicial; solo podrá descubrirla después de que el navegador solicite el archivo y lo transforme. Esto hará que el servidor se vuelva a empaquetar inmediatamente después del inicio del servidor.

Tanto `include` como `exclude` se pueden utilizar para solucionar este problema. Si la dependencia es grande (con muchos módulos internos) o es CommonJS, debes incluirla; Si la dependencia es pequeña y ya es un ESM válido, puedes excluirla y dejar que el navegador la cargue directamente.

También puedes personalizar aún más esbuild con la [opción `optimizeDeps.rolldownOptions`](/config/dep-optimization-options.md#optimizedeps-rolldownoptions). Por ejemplo, agregar un plugin Rolldown para manejar archivos especiales en dependencias o cambiando el [objetivo de compilación (`target`)](https://esbuild.github.io/api/#target).

<!-- TODO: update the link above to Rolldown's documentation -->

## Almacenamiento en caché

### Caché del sistema de archivos

Vite almacena en caché las dependencias preempaquetadas en `node_modules/.vite`. Esto determina si necesita volver a ejecutar el preempaquetado en función de algunas fuentes:

- Contenido del archivo de bloqueo del administrador de paquetes, por ejemplo, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` o `bun.lock`.
- Tiempo de modificación de la carpeta de parches.
- Campos relevantes en el `vite.config.js`, si está presente.
- Valor de `NODE_ENV`.

Solo será necesario volver a ejecutar el preempaquetado cuando uno de los anteriores haya cambiado.

Si por alguna razón deseas forzar a Vite a volver a empaquetar las dependencias, puedes iniciar el servidor de desarrollo con la opción de línea de comando `--force` o eliminar manualmente el directorio de caché `node_modules/.vite`.

### Caché de navegador

Las solicitudes de dependencia resueltas se almacenan fuertemente en caché con encabezados HTTP `max-age=31536000,immutable` para mejorar el rendimiento de recarga de la página durante el desarrollo. Una vez almacenadas en caché, estas solicitudes nunca volverán a llegar al servidor de desarrollo. La consulta de versión adjunta los invalida automáticamente si se instala una versión diferente (como se refleja en el archivo de bloqueo del administrador de paquetes). Si deseas depurar tus dependencias mediante ediciones locales, puedes:

1. Deshabilitar temporalmente el caché a través de la pestaña Red de las herramientas de desarrollo del navegador.
2. Reiniciar el servidor de desarrollo de Vite con el indicador `--force` para volver a empaquetar las dependencias.
3. Volver a cargar la página.
