# Opciones para Worker

A menos que se indique lo contrario, las opciones en esta sección se aplican a desarrollo, compilación y vista previa.

## worker.format

- **Tipo:** `'es' | 'iife'`
- **Por defecto:** `'iife'`

  Formato de salida para el paquete de worker.

## worker.plugins

- **Tipo:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

  Plugins de Vite que se aplican al paquete de worker. Ten en cuenta que [config.plugins](./shared-options#plugins) sólo aplica a los workers en desarrollo, debe configurarse aquí para compilación en su lugar.

  La función debería devolver nuevas instancias de plugins a medida que se utilizan en compilaciones paralelas de un worker de Rollup. Como tal, se ignorará la modificación de las opciones de `config.worker` en el hook `config`.


## worker.rolldownOptions

- **Tipo:** [`RolldownOptions`](https://rolldown.rs/reference/)

Opciones de Rolldown para crear un paquete de worker de compilación.

## worker.rollupOptions

- **Tipo:** `RolldownOptions`
- **Obsoleto**

Esta opción es un alias de la opción `worker.rolldownOptions`. Usa la opción `worker.rolldownOptions` en su lugar.
