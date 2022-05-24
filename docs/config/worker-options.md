# Opciones de Worker

## worker.format

- **Tipo:** `'es' | 'iife'`
- **Por defecto:** `iife`

  Formato de salida para el paquete de worker.

## worker.plugins

- **Tipo:** [`(Plugin | Plugin[])[]`](#plugins)

  Complementos de Vite que se aplican al paquete de worker

## worker.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Opciones de Rollup para crear un paquete de worker de compilación.