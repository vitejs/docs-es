# Opciones para Worker

Opciones relacionadas con Web Workers.

## worker.format

- **Tipo:** `'es' | 'iife'`
- **Por defecto:** `'iife'`

  Formato de salida para el paquete de worker.

## worker.plugins

- **Tipo:** [`(Plugin | Plugin[])[]`](#plugins)

  Complementos de Vite que se aplican al paquete de worker. Ten en cuenta que [config.plugins](./shared-options#plugins) sólo aplica a los workers en desarrollo, debe configurarse aquí para compilación en su lugar.

## worker.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

  Opciones de Rollup para crear un paquete de worker de compilación.
