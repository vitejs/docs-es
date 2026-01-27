# Uso de plugins

Vite se puede extender mediante plugins, que se basan en la interfaz de plugins bien diseñada de Rollup con algunas opciones adicionales específicas de Vite. Esto significa que los usuarios de Vite pueden confiar en el ecosistema maduro de plugins de Rollup, al tiempo que pueden extender el servidor de desarrollo y la funcionalidad SSR según sea necesario.

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~0y4g?via=vite" title="Uso de plugins en Vite">Ver una lección interactiva en Scrimba</ScrimbaLink>

## Agregar un plugin

Para usar un plugin, este debe agregarse a `devDependencies` del proyecto e incluirse en el array `plugins` en el archivo de configuración `vite.config.js`. Por ejemplo, para brindar soporte para navegadores obsoletos, se puede usar el [@vite/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial:

```
$ npm add -D @vite/plugin-legacy
```

```js twoslash [vite.config.js]
import legacy from '@vite/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

`plugins` también acepta ajustes preestablecidos que incluyen varios plugins como un solo elemento. Esto es útil para funciones complejas (como la integración de marcos de trabajo) que son implementados mediante varios plugins. El array se simplificará internamente.

Se ignorarán los plugins falsos, los cuales pueden ser usar para activar o desactivar plugins fácilmente.

## Encontrar plugins

:::tip NOTA
Vite tiene como objetivo proporcionar soporte listo para usar para patrones comunes de desarrollo web. Antes de buscar un plugin de Vite o Rollup compatible, consulta la [Guía de funcionalidades](../guide/features.md). Muchos de los casos en los que se necesitaría un plugin en un proyecto de Rollup ya están cubiertos en Vite.
:::

Consulta la [sección Plugins](../plugins/) para obtener información sobre los plugins oficiales. Los plugins de la comunidad se enumeran en [awesome-vite](https://github.com/vitejs/awesome-vite#plugins).

También puedes encontrar plugins que sigan las [convenciones recomendadas](./api-plugin.md#convenciones) mediante una [búsqueda de npm](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) para plugins de Vite o una [búsqueda de npm](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) para plugins de Rollup.

## Forzar la aplicación de un plugin

Para la compatibilidad con algunos plugins de Rollup, es posible que sea necesario forzar la aplicación de un plugin o solo aplicarlo en el momento de la compilación. Este debería ser un detalle de implementación para los plugins de Vite. Puedes forzar la posición de un plugin con el modificador `enforce`:

- `pre`: invoca el plugin antes de los plugins básicos de Vite
- predeterminado: invocar el plugin después de los plugins principales de Vite
- `post`: invocar el plugin después de los plugins de compilación de Vite

```js twoslash [vite.config.js]
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

Consulta la [Guía de API de plugins](./api-plugin.md#orden-de-plugins) para obtener información detallada.

## Aplicación condicional

De forma predeterminada, los plugins se invocan tanto para servir como para compilar. En los casos en que un plugin deba aplicarse condicionalmente solo durante el servicio o la compilación, usa la propiedad `apply` para invocarlos solo durante `'build'` o `'serve'`:

```js twoslash [vite.config.js]
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## Creación de plugins

Consulta la [Guía de API de plugins](./api-plugin.md) para obtener documentación sobre la creación de plugins.
