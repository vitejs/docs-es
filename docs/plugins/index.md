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

Usa [el transformador Oxc](https://oxc.rs/docs/guide/usage/transformer) y [Babel](https://babeljs.io/), logrando un HMR rápido con un tamaño de paquete pequeño y la flexibilidad de poder usar la canalización de transformación de Babel. Sin plugins adicionales de Babel, solo se utiliza el transformador Oxc.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

Reemplaza Babel con [SWC](https://swc.rs/) durante el desarrollo. En las compilaciones de producción, se utilizan SWC+Oxc Transformer cuando se usan plugins, y solo Oxc Transformer en caso contrario. Para proyectos grandes que requieren plugins personalizados, el inicio en frío y la sustitución de módulos en caliente (HMR) pueden ser significativamente más rápidos, si el plugin también está disponible para SWC.

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite soporta [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) a través del plugin. Utiliza la [API de Entorno](/guide/api-environment) para proporcionar primitivas de bajo nivel que los frameworks de React pueden usar para integrar las características de RSC. Puedes probar una aplicación RSC minimalista con:

```bash
npm create vite@latest -- --template rsc
```

Lee la [documentación del plugin](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) para obtener más información.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

Provee soporte para los navegadores obsoletos en el compilado para producción.

## Plugins de la Comunidad

Consulta el [Registro de Plugins de Vite](https://registry.vite.dev/plugins) para obtener la lista de los plugins publicados en npm.

## Plugins de Rolldown

Vite utiliza [Rolldown](https://rolldown.rs/) por debajo y proporciona algunos plugins integrados para casos de uso comunes.

Lee la [sección de plugins integrados de Rolldown](https://rolldown.rs/builtin-plugins/) para obtener más información.

## Plugins de Rolldown / Rollup

Los [plugins de Vite](../guide/api-plugin) son una extensión de la interfaz de plugins de Rollup. Consulta la [sección de compatibilidad de plugins de Rolldown](../guide/api-plugin#rolldown-plugin-compatibility) para obtener más información.
