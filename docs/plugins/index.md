# Plugins

:::tip NOTA
Vite está pensado para proveer un soporte listo para usar para los patrones de desarrollo web comunes. Antes de buscar algún plugin para Vite o de Rollup , dale un vistazo a la [Guía de funcionalidades](../guide/features.md). Muchos de los casos en los que se necesita un plugin de Rollup ya están cubiertos en Vite.
:::

Revisa [Uso de plugins](../guide/using-plugins.md) para más información sobre cómo utilizarlos.

## Plugins Oficiales

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Provee soporte para componentes de un único (o simple) archivo en Vue 3.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

Provee soporte de JSX en Vue 3 (por medio de la [transformación dedicada de Babel](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

Utiliza esbuild y Babel, logrando HMR rápido con un tamaño de paquete pequeño y la flexibilidad de poder usar la canalización de transformación de Babel. Sin plugins adicionales de Babel, solo se usa esbuild durante las compilaciones.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

Reemplaza Babel con SWC durante el desarrollo. Durante las compilaciones de producción, SWC+esbuild se usan con plugins, y esbuild sino no hay uso de ellos. Para grandes proyectos que no requieren extensiones no estándar de React, el arranque en frío y el Hot Module Replacement (HMR) pueden ser significativamente más rápidos.

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite soporta [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) a través del plugin. Utiliza la [API de Entorno](/guide/api-environment) para proporcionar primitivas de bajo nivel que los frameworks de React pueden usar para integrar las características de RSC. Puedes probar una aplicación RSC minimalista con:

```bash
npm create vite@latest -- --template rsc
```

Lee la [documentación del plugin](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) para obtener más información.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

Provee soporte para los navegadores obsoletos en el compilado para producción.

## Plugins de la Comunidad

Dale un vistazo a [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). También puedes enviar una solicitud de cambio para enlistar tus plugins ahí.

## Plugins de Rollup

Los [Plugins de Vite](../guide/api-plugin) son una extensión a la interfaz de los Plugins de Rollup. Dale un vistazo a la [Sección de compatibilidad para plugins de Rollup](../guide/api-plugin#compatibilidad-de-plugins-rollup) para más información.
