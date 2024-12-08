# Plugins

:::tip NOTA
Vite está pensado para proveer un soporte listo para usar para los patrones de desarrollo web comunes. Antes de buscar algún plugin para Vite o de Rollup , dale un vistazo a la [Guía de funcionalidades](../guide/features.md). Muchos de los casos en los que se necesita un plugin de Rollup ya están cubiertos en Vite.
:::

Revisa [Uso de plugins](../guide/using-plugins.md) para más información sobre cómo utilizarlos.

## Plugins Oficiales

### [@vite/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Provee soporte para componentes de un único (o simple) archivo en Vue 3.

### [@vite/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Provee soporte de JSX en Vue 3 (por medio de la [transformación dedicada de Babel](https://github.com/vuejs/jsx-next)).

### [@vite/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- Proporciona compatibilidad con componentes de archivo único de Vue 2.7.

### [@vite/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

- Brinda compatibilidad con Vue 2.7 JSX (a través de la [transformación de Babel dedicada](https://github.com/vuejs/jsx-vue2/)).

### [@vite/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

- Provides Vue 2.7 JSX support (via [dedicated Babel transform](https://github.com/vuejs/jsx-vue2/)).

### [@vite/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Utiliza esbuild y Babel, logrando HMR rápido con un tamaño de paquete pequeño y la flexibilidad de poder usar la canalización de transformación de Babel. Sin plugins adicionales de Babel, solo se usa esbuild durante las compilaciones.

### [@vite/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Reemplaza Babel con SWC durante el desarrollo. Durante las compilaciones de producción, SWC+esbuild se usan con plugins, y esbuild sino no hay uso de ellos. Para grandes proyectos que no requieren extensiones no estándar de React, el arranque en frío y el Hot Module Replacement (HMR) pueden ser significativamente más rápidos.

### [@vite/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Provee soporte para los navegadores obsoletos en el compilado para producción.

## Plugins de la Comunidad

Dale un vistazo a [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). También puedes enviar una solicitud de cambio para enlistar tus plugins ahí.

## Plugins de Rollup

Los [Plugins de Vite](../guide/api-plugin) son una extensión a la interfaz de los Plugins de Rollup. Dale un vistazo a la [Sección de compatibilidad para plugins de Rollup](../guide/api-plugin#compatibilidad-de-plugins-rollup) para más información.
