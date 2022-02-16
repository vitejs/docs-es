# Uso de complementos

Vite se puede extender mediante complementos, que se basan en la interfaz de complementos bien diseñada de Rollup con algunas opciones adicionales específicas de Vite. Esto significa que los usuarios de Vite pueden confiar en el ecosistema maduro de complementos de Rollup, al tiempo que pueden èxtender el servidor de desarrollo y la funcionalidad SSR según sea necesario.

## Agregar un complemento

Para usar un complemento, este debe agregarse a `devDependencies` del proyecto e incluirse en el array `plugins` en el archivo de configuración `vite.config.js`. Por ejemplo, para brindar soporte para navegadores obsoletos, se puede usar el [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial:

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

`plugins` también acepta ajustes preestablecidos que incluyen varios complementos como un solo elemento. Esto es útil para funciones complejas (como la integración de marcos de trabajo) que son implementados mediante varios complementos. El array se simplificará internamente.

Se ignorarán los complementos falsos, los cuales pueden ser usar para activar o desactivar complementos fácilmente.

## Encontrar complementos

:::tip NOTA
Vite tiene como objetivo proporcionar soporte listo para usar para patrones comunes de desarrollo web. Antes de buscar un complemento de Vite o Rollup compatible, consulta la [Guía de funciones](../guide/features.md). Muchos de los casos en los que se necesitaría un complemento en un proyecto de Rollup ya están cubiertos en Vite.
:::

Consulta la [sección Complementos](../plugins/) para obtener información sobre los complementos oficiales. Los complementos de la comunidad se enumeran en [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). Para conocer los complementos de Rollup compatibles, consulta [Complementos de Vite Rollup](https://vite-rollup-plugins.patak.dev) para obtener una lista de complementos oficiales de Rollup compatibles con instrucciones de uso o la [sección Compatibilidad de complementos de Rollup](../guide/api-plugin#rollup-plugin-compatibility) en caso de que no aparezcan en la lista.

También puedes encontrar complementos que sigan las [convenciones recomendadas](./api-plugin.md#conventions) mediante una [búsqueda de npm](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) para complementos de Vite o una [búsqueda de npm](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) para complementos de Rollup.

## Forzar la aplicación de un complemento

Para la compatibilidad con algunos complementos de Rollup, es posible que sea necesario forzar la aplicación de un complemento o solo aplicarlo en el momento de la compilación. Este debería ser un detalle de implementación para los complementos de Vite. Puedes forzar la posición de un complemento con el modificador `enforce`:

- `pre`: invoca el complemento antes de los complementos básicos de Vite
- predeterminado: invocar el complemento después de los complementos principales de Vite
- `post`: invocar el complemento después de los complementos de compilación de Vite

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre'
    }
  ]
})
```

Consulta la [Guía de API de complementos](./api-plugin.md#plugin-ordering) para obtener información detallada, y tener en cuenta la etiqueta `enforce` y las instrucciones de uso para complementos populares en lista de compatibilidad de [Complementos Vite Rollup](https://vite-rollup-plugins.patak.dev).

## Aplicación condicional

De forma predeterminada, los complementos se invocan tanto para servir como para compilar. En los casos en que un complemento deba aplicarse condicionalmente solo durante el servicio o la compilación, usa la propiedad `apply` para invocarlos solo durante `'build'` o `'serve'`:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
})
```

## Creación de complementos

Consulta la [Guía de API de complementos](./api-plugin.md) para obtener documentación sobre la creación de complementos.
