# Opciones para optimización de dependencias

- **Relacionado:** [Preempaquetado de dependencias](/guide/dep-pre-bundling)

A menos que se indique lo contrario, las opciones en esta sección solo se aplican al optimizador de dependencias, que solo se usa en desarrollo.

## optimizeDeps.entries

- **Tipo:** `string | string[]`

  De forma predeterminada, Vite rastreará todos sus archivos `.html` para detectar las dependencias que deben empaquetarse previamente (ignorando `node_modules`, `build.outDir`, `__tests__` y `coverage`). Si se especifica `build.rollupOptions.input`, Vite rastreará esos puntos de entrada en su lugar.

  Si ninguno de estos se ajusta a tus necesidades, puedes especificar entradas personalizadas con esta opción; el valor debe ser un [patrón `tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) o un array de patrones que son relativos a la raíz del proyecto Vite. Esto sobrescribirá la inferencia de entradas predeterminadas. Solo las carpetas `node_modules` y `build.outDir` se ignorarán de forma predeterminada cuando se defina explícitamente `optimizeDeps.entries`. Si es necesario ignorar otras carpetas, puedes usar un patrón de ignorado como parte de la lista de entradas, marcado con un '!' inicial. Si no deseas ignorar `node_modules` y `build.outDir`, puedes especificarlo utilizando rutas de cadena literal (sin patrones de `tinyglobby`).

## optimizeDeps.exclude

- **Tipo:** `string[]`

  Dependencias a excluir del preempaquetado.

  :::warning CommonJS
  Las dependencias CommonJS no deben excluirse de la optimización. Si una dependencia de ESM se excluye de la optimización, pero tiene una dependencia CommonJS anidada, la dependencia CommonJS debe agregarse a `optimizeDeps.include`. Ejemplo:

  ```js twoslash
  import { defineConfig } from 'vite'
  // ---cut---
  export default defineConfig({
    optimizeDeps: {
      include: ['esm-dep > cjs-dep'],
    },
  })
  ```

  :::

## optimizeDeps.include

- **Tipo:** `string[]`

  De forma predeterminada, los paquetes vinculados que no están dentro de `node_modules` no están preempaquetados. Usa esta opción para forzar que un paquete vinculado se empaquete previamente.

**Experimental:** Si utilizas una biblioteca con muchas importaciones profundas, también puede especificar un patrón glob para preagrupar todas las importaciones profundas a la vez. De este modo, se evitará la precarga constante cada vez que se utilice una nueva importación profunda. [Hacer c](https://github.com/vitejs/vite/discussions/15833) Por ejemplo:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions

- **Tipo:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#general-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
| 'outfile'
| 'outbase'
| 'outExtension'
| 'metafile'>`

Opciones para pasar a esbuild durante el escaneo y optimización de la dependencia.

Se omiten ciertas opciones ya que cambiarlas no sería compatible con la optimización de la dependencia de Vite.

- También se omite `external`, usa la opción `optimizeDeps.exclude` de Vite
- `plugins` se fusionan con el plugin de dependencia de Vite

## optimizeDeps.force

- **Tipo:** `boolean`

Configurar en `true` para forzar el empaquetado previo de dependencias, ignorando las dependencias previamente optimizadas y almacenadas en caché.

## optimizeDeps.holdUntilCrawlEnd

- **Experimental:** [Hacer comentarios](https://github.com/vitejs/vite/discussions/15834)
- **Tipo:** `boolean`
- **Por defecto:** `true`

Cuando está habilitado, retendrá los primeros resultados de las dependencias optimizadas hasta que todas las importaciones estáticas se rastreen en el arranque en frío. Esto evita la necesidad de recargar la página completa cuando se descubren nuevas dependencias y desencadenan la generación de nuevos fragmentos comunes. Si el escáner encuentra todas las dependencias más las definidas explícitamente en `include`, es mejor deshabilitar esta opción para permitir que el navegador procese más solicitudes en paralelo.

## optimizeDeps.disabled

- **Obsoleto**
- **Experimental** [Hacer comentarios](https://github.com/vitejs/vite/discussions/13839)
- **Tipo:** `boolean | 'build' | 'dev'`
- **Por defecto:** `'build'`

Esta opción está en desuso. A partir de Vite 5.1, se eliminó el paquete previo de dependencias durante la compilación. Configurar `optimizeDeps.disabled` en `true` o `'dev'` deshabilita el optimizador, y configurarlo en `false` o `'build'` deja el optimizador habilitado durante el desarrollo.

Para deshabilitar el optimizador por completo, usa `optimizeDeps.noDiscovery: true` para no permitir el descubrimiento automático de dependencias y deja `optimizeDeps.include` sin definir o vacío.

:::warning
La optimización de las dependencias durante el tiempo de compilación fue una característica **experimental**. Los proyectos que probaron esta estrategia también eliminaron `@rollup/plugin-commonjs` usando `build.commonjsOptions: { include: [] }`. Si lo hiciste en algún momento, una advertencia te guiará a volver a habilitarlo y así darle soporte a paquetes CJS únicamente mientras se realiza el empaquetado.
:::

## optimizeDeps.needsInterop

- **Experimental**
- **Tipo:** `string[]`

Obliga a la interoperabilidad de ESM al importar estas dependencias. Vite es capaz de detectar correctamente cuándo se necesita la interoperabilidad de una dependencia, por lo que esta opción generalmente no es necesaria. Sin embargo, diferentes combinaciones de dependencias podrían hacer que algunas de ellas se preempaqueten de manera diferente. Agregar estos paquetes a `needsInterop` puede acelerar el inicio en frío evitando recargas completas de página. Recibirás una advertencia si este es el caso para una de tus dependencias, sugiriendo agregar el nombre del paquete a este array en tu configuración.
