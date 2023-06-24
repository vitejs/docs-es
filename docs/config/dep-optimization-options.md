# Opciones para optimización de dependencias

- **Relacionado:** [Preempaquetado de dependencias](/guide/dep-pre-bundling)

## optimizeDeps.entries

- **Tipo:** `string | string[]`

  De forma predeterminada, Vite rastreará todos sus archivos `.html` para detectar las dependencias que deben empaquetarse previamente (ignorando `node_modules`, `build.outDir`, `__tests__` y `coverage`). Si se especifica `build.rollupOptions.input`, Vite rastreará esos puntos de entrada en su lugar.

  Si ninguno de estos se ajusta a tus necesidades, puedes especificar entradas personalizadas con esta opción; el valor debe ser un [patrón fast-glob](https://github.com/mrmlnc/fast-glob#basic-syntax) o un array de patrones que son relativos a la raíz del proyecto Vite. Esto sobrescribirá la inferencia de entradas predeterminadas. Solo las carpetas `node_modules` y `build.outDir` se ignorarán de forma predeterminada cuando se defina explícitamente `optimizeDeps.entries`. Si es necesario ignorar otras carpetas, puedes usar un patrón de ignorado como parte de la lista de entradas, marcado con un '!' inicial.

## optimizeDeps.exclude

- **Tipo:** `string[]`

  Dependencias a excluir del preempaquetado.

  :::warning CommonJS
  Las dependencias CommonJS no deben excluirse de la optimización. Si una dependencia de ESM se excluye de la optimización, pero tiene una dependencia CommonJS anidada, la dependencia CommonJS debe agregarse a `optimizeDeps.include`. Ejemplo:

  ```js
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

**Experimental:** Si utilizas una biblioteca con muchas importaciones profundas, también puede especificar un patrón glob para preagrupar todas las importaciones profundas a la vez. De este modo, se evitará la precarga constante cada vez que se utilice una nueva importación profunda. Por ejemplo:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

  Opciones para pasar a esbuild durante el escaneo y optimización de la dependencia.

  Se omiten ciertas opciones ya que cambiarlas no sería compatible con la optimización de la dependencia de Vite.

  - También se omite `external`, usa la opción `optimizeDeps.exclude` de Vite
  - `plugins` se fusionan con el complemento de dependencia de Vite

## optimizeDeps.force

- **Tipo:** `boolean`

  Configurar en `true` para forzar el empaquetado previo de dependencias, ignorando las dependencias previamente optimizadas y almacenadas en caché.

## optimizeDeps.disabled

- **Experimental**
- **Tipo:** `boolean | 'build' | 'dev'`
- **Por defecto:** `'build'`

Deshabilita las optimizaciones de dependencias, `true` deshabilita el optimizador durante la compilación y el desarrollo. Pasa `'build'` o `'dev'` para deshabilitar el optimizador solo en uno de los modos. La optimización de dependencias está habilitada de forma predeterminada solo en desarrollo.

:::warning
La optimización de las dependencias en el modo de compilación es **experimental**. Si está habilitado, elimina una de las diferencias más significativas entre desarrollo y producción. [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) ya no es necesario en este caso, ya que esbuild convierte las dependencias solo de CJS en ESM.

Si deseas probar esta estrategia de compilación, puedes usar `optimizeDeps.disabled: false`. `@rollup/plugin-commonjs` se puede eliminar pasando `build.commonjsOptions: { include: [] }`.
:::

## optimizeDeps.needsInterop

- **Experimental**
- **Tipo:** `string[]`

Obliga a la interoperabilidad de ESM al importar estas dependencias. Vite es capaz de detectar correctamente cuándo se necesita la interoperabilidad de una dependencia, por lo que esta opción generalmente no es necesaria. Sin embargo, diferentes combinaciones de dependencias podrían hacer que algunas de ellas se preempaqueten de manera diferente. Agregar estos paquetes a `needsInterop` puede acelerar el inicio en frío evitando recargas completas de página. Recibirás una advertencia si este es el caso para una de tus dependencias, sugiriendo agregar el nombre del paquete a este array en tu configuración.
