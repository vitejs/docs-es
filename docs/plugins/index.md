# Complementos

:::tip NOTA
Vite está pensado para proveer un soporte listo para usar para los patrones de desarrollo web comunes. Antes de buscar algún complemento para Vite o de Rollup , dale un vistazo a la [Guía de funcionalidades](../guide/features.md). Muchos de los casos en los que se necesita un complemento de Rollup ya están cubiertos en Vite.
:::

Revisa [Uso de complementos](../guide/using-plugins.md) para más información sobre cómo utilizarlos.

## Complementos Oficiales

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Provee soporte para Componentes de un único (o simple) archivo en Vue3.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Provee soporte de JSX en Vue 3 (por medio de la [transformación dedicada de Babel](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Utiliza esbuild y Babel, logrando HMR rápido con un tamaño de paquete pequeño y la flexibilidad de poder usar la canalización de transformación de Babel.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Utiliza esbuild durante la compilación, pero reemplaza Babel con SWC durante el desarrollo. Para grandes proyectos que no requieren extensiones no estándar de React, el arranque en frío y el Hot Module Replacement (HMR) pueden ser significativamente más rápidos.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Provee soporte para los navegadores obsoletos en el compilado para producción.

## Complementos de la Comunidad

Dale un vistazo a [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). También puedes enviar una solicitud de cambio para enlistar tus complementos ahí.

## Complementos de Rollup

Los [Complementos de Vite](../guide/api-plugin) son una extensión a la interfaz de los Complementos de Rollup. Dale un vistazo a la [Sección de compatibilidad para complementos de Rollup](../guide/api-plugin#compatibilidad-de-complementos-rollup) para más información.
