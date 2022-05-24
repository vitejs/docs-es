# Opciones de optimización de dependencias

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
      include: ['esm-dep > cjs-dep']
    }
  })
  ```

  :::

## optimizeDeps.include

- **Tipo:** `string[]`

  De forma predeterminada, los paquetes vinculados que no están dentro de `node_modules` no están preempaquetados. Usa esta opción para forzar que un paquete vinculado se empaquete previamente.

## optimizeDeps.esbuildOptions

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

  Opciones para pasar a esbuild durante el escaneo y optimización de la dependencia.

  Se omiten ciertas opciones ya que cambiarlas no sería compatible con la optimización de la dependencia de Vite.

  - También se omite `external`, usa la opción `optimizeDeps.exclude` de Vite
  - `plugins` se fusionan con el complemento de dependencia de Vite