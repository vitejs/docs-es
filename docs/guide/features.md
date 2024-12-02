# Funcionalidades

En el nivel más básico, desarrollar con Vite no es muy diferente de usar un servidor de archivos estáticos. Sin embargo, Vite ofrece muchas mejoras sobre las importaciones nativas de ESM para soportar diversas funcionalidades que se suelen ver en configuraciones basadas en empaquetadores.

## Resolución de dependencias de NPM y preempaquetado

Las importaciones nativas de ES no admiten importaciones de módulos descubiertos como las siguientes:

```js
import { someMethod } from 'my-dep'
```

Lo anterior arrojará un error en el navegador. Vite detectará tales importaciones de módulos descubiertos en todos los archivos fuente servidos y realizará lo siguiente:

1. [Preempaquetado](./dep-pre-bundling) para mejorar la velocidad de carga de la página y convertir los módulos CommonJS/UMD a ESM. El paso previo al empaquetado se realiza con [esbuild](http://esbuild.github.io/) y hace que el tiempo de inicio en frío de Vite sea significativamente más rápido que cualquier empaquetador basado en JavaScript.

2. Vuelve a escribir las importaciones en direcciones URL válidas como `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` para que el navegador pueda importarlas correctamente.

**Las dependencias están fuertemente almacenadas en caché**

Vite almacena en caché las solicitudes de dependencias a través de encabezados HTTP, por lo que si deseas editar/depurar localmente una dependencia, sigue los pasos [aquí](./dep-pre-bundling#cache-de-navegador).

## Hot Module Replacement

Vite proporciona una [API de HMR](./api-hmr) sobre ESM nativo. Los marcos de trabajo con capacidades HMR pueden aprovechar la API para proporcionar actualizaciones instantáneas y precisas sin recargar la página o eliminar el estado de la aplicación. Vite proporciona integraciones HMR propias para [Componentes de único archivo de Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) y [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). También hay integraciones oficiales para Preact a través de [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Ten en cuenta que no necesitas configurarlos manualmente: cuando [creas una aplicación a través de `create-vite`](./), las plantillas seleccionadas ya las tendrán preconfiguradas.

## TypeScript

Vite admite la importación de archivos `.ts` desde su primer uso.

### Solo transpilado

Ten en cuenta que Vite solo realiza transpilaciones en archivos `.ts` y **NO** realiza verificación de tipos. Supone que el IDE y el proceso de compilación se encargan de la verificación de tipos.

La razón por la que Vite no realiza la verificación de tipos como parte del proceso de transformación es porque los dos trabajos funcionan de manera fundamentalmente diferente. La transpilación puede funcionar por archivo y se alinea perfectamente con el modelo de compilación bajo demanda de Vite. En comparación, la verificación de tipos requiere el conocimiento de todo el gráfico del módulo. La verificación de tipo en la canalización de transformación de Vite comprometerá inevitablemente los beneficios de velocidad de Vite.

El trabajo de Vite es hacer que tus módulos fuentes tengan un formato que pueda ejecutarse en el navegador lo más rápido posible. Con ese fin, recomendamos separar las comprobaciones de análisis estático de la canalización de transformación de Vite. Este principio se aplica a otras comprobaciones de análisis estático como ESLint.

- Para compilaciones de producción, puedes ejecutar `tsc --noEmit` además del comando de compilación de Vite.

- Durante el desarrollo, si necesitas más sugerencias de IDE, te recomendamos ejecutar `tsc --noEmit --watch` en un proceso separado o usar [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) si prefieres que los errores tipográficos se notifiquen directamente en el navegador.

Vite usa [esbuild](https://github.com/evanw/esbuild) para transpilar TypeScript en JavaScript, que es entre 20 y 30 veces más rápido que `tsc` puro, y las actualizaciones de HMR pueden reflejarse en el navegador en menos de 50 ms.

Usa la sintaxis de [importaciones y exportaciones de solo tipo](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) para evitar problemas potenciales como las importaciones de solo tipo que se agrupan incorrectamente, por ejemplo:

```ts
import type { T } from 'only/types'
export type { T }
```

### Opciones del compilador de TypeScript

Algunos campos de configuración en `compilerOptions` en `tsconfig.json` requieren atención especial.

#### `isolatedModules`

- [Documentación de TypeScript](https://www.typescriptlang.org/tsconfig#isolatedModules)

Debes configurarse en `true`.

Esto se debe a que `esbuild` solo realiza la transpilación sin información de tipo, no admite ciertas características como const enum e importaciones implícitas de solo tipo.

Debes configurar `"isolatedModules": true` en el `tsconfig.json` en `compilerOptions`, para que TS te advierta sobre las funcionalidades omitidas con la transpilación aislada.

Si una dependencia no funciona bien con `"isolatedModules": true`, puedes usar `"skipLibCheck": true` para suprimir temporalmente los errores hasta que se solucione.

#### `useDefineForClassFields`

- [Documentación de TypeScript](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

A partir de Vite 2.5.0, el valor predeterminado será `true` si el destino de TypeScript es `ESNext` o `ES2022` o superiores. Esto es consistente con el [comportamiento de `tsc` 4.3.2 y versiones posteriores](https://github.com/microsoft/TypeScript/pull/42663). También es el comportamiento esperado en tiempo de ejecución de ECMAScript.

Otros destinos de TypeScript tendrán el valor predeterminado `false`.

Pero esto puede ser contrario para aquellos que provienen de otros lenguajes de programación o versiones anteriores de TypeScript. Puedes leer más sobre la transición en las [notas de la versión de TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-el-declare-property-modifier).

Si estás utilizando una biblioteca que depende en gran medida de los campos de clase, ten cuidado con el uso previsto de la biblioteca.

La mayoría de las bibliotecas esperan `"useDefineForClassFields": true`, como [MobX](https://mobx.js.org/installation.html#use-spec-obediente-transpilation-for-class-properties).

Pero algunas bibliotecas aún no han hecho la transición a este nuevo valor por defecto, incluido [`lit-element`](https://github.com/lit/lit-element/issues/1030). Configura explícitamente `useDefineForClassFields` en `false` en estos casos.

#### `target`

- [Documentación de TypeScript](https://www.typescriptlang.org/tsconfig#target)

Vite no transpila TypeScript con el valor `target` configurado por defecto, siguiendo el mismo comportamiento que `esbuild`.

En su lugar, se puede usar la opción [`esbuild.target`](/config/shared-options.html#esbuild), cuyo valor por defecto es `esnext` para una transpilación mínima. En las compilaciones, la opción [`build.target`](/config/build-options.html#build-target) tiene mayor prioridad y también se puede configurar si es necesario.

::: warning `useDefineForClassFields`
Si `target` no es `ESNext` o `ES2022` o más reciente, o si no hay un archivo `tsconfig.json`, `useDefineForClassFields` por defecto será `false`, lo que puede ser problemático con el valor por defecto de `esbuild.target` de `es siguiente`. Puede transpilarse a [bloques de inicialización estáticos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) que pueden no ser compatibles con tu navegador.

Como tal, se recomienda configurar `target` en `ESNext` o `ES2022` o más reciente, o configurar `useDefineForClassFields` en `true` explícitamente en el `tsconfig.json`.
:::

#### Otras opciones del compilador que afectan el resultado de la compilación

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
Las plantillas de inicio de Vite tienen `"skipLibCheck": "true"` por defecto para evitar la comprobación de tipos en las dependencias, ya que estas pueden optar por admitir solo versiones y configuraciones específicas de TypeScript. Puedes obtener más información en [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Tipos de clientes

Los tipos predeterminados de Vite son para su API de Node.js. Para ajustar el entorno del código del lado del cliente en una aplicación Vite, agrega un archivo de declaración `d.ts`:

```typescript
/// <reference types="vite/client" />
```

Como altenativa, puedes agregar `vite/client` a `compilerOptions.types` en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Esto proporcionará los siguientes tipos de librerías:

- Importaciones de recursos (por ejemplo, importar un archivo `.svg`)
- Tipos para las [variables de entorno](./env-and-mode#variables-de-entorno) inyectadas por Vite en `import.meta.env`
- Tipos para la [API de HMR](./api-hmr) en `import.meta.hot`

:::tip
Para anular la escritura predeterminada, agrega un archivo de definición de tipo que contenga sus tipos. Luego, agrega la referencia de tipo antes de `vite/client`.

Por ejemplo, para hacer que la importación predeterminada de `*.svg` a un componente de React:

- `vite-env-override.d.ts` (el archivo que contiene tus tipos):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- El archivo que contiene la referencia a `vite/client`:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue

Vite proporciona soporte Vue de primera clase:

- Compatibilidad con Vue 3 SFC a través de [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Compatibilidad con Vue 3 JSX a través de [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Compatibilidad con Vue 2.7 SFC a través de [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Compatibilidad con Vue 2.7 JSX a través de [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

## JSX

Los archivos `.jsx` y `.tsx` también son compatibles de fábrica. La transpilación JSX también se maneja a través de [esbuild](https://esbuild.github.io).

Los usuarios de Vue deben usar el plugin oficial [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx), que proporciona características específicas de Vue 3, incluidas HMR, resolución de componentes globales, directivas y slots.

Si estás utilizando JSX sin React o Vue, puedes configurar las opciones `jsxFactory` y `jsxFragment` personalizadas utilizando la opción [`esbuild`](/config/shared-options.md#esbuild). Por ejemplo, para Preact:

```js twoslash
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Más detalles en la [documentación de esbuild](https://esbuild.github.io/content-types/#jsx).

Puedes inyectar los helpers de JSX usando `jsxInject` (que es una opción exclusiva de Vite) para evitar las importaciones manuales:

```js twoslash
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

La importación de archivos `.css` inyectará su contenido en la página a través de una etiqueta `<style>` con soporte HMR.

### Incrustación y rebase de `@import`

Vite está preconfigurado para admitir incrustaciones CSS de `@import` través de `postcss-import`. Los alias de Vite también se respetan para CSS `@import`. Además, todas las referencias de CSS `url()`, incluso si los archivos importados están en directorios diferentes, siempre se reorganizan automáticamente para garantizar la corrección.

Los alias `@import` y el cambio de base de URL también son compatibles con los archivos Sass y Less (consulta los [preprocesadores CSS](#preprocesadores-css)).

### PostCSS

Si el proyecto contiene una configuración de PostCSS válida (cualquier formato compatible con [postcss-load-config](https://github.com/postcss/postcss-load-config), por ejemplo, `postcss.config.js`), se aplicará automáticamente a todo el CSS importado.

Ten en cuenta que la minificación de CSS se ejecutará después de PostCSS y utilizará la opción [`build.cssTarget`](/config/build-options.md#build-csstarget).

### Módulos CSS

Cualquier archivo CSS que termine con `.module.css` se considera un [archivo de módulos CSS](https://github.com/css-modules/css-modules). La importación de dicho archivo devolverá el objeto de módulo correspondiente:

```css
/* example.module.css */
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

El comportamiento de los módulos CSS se puede configurar mediante la [opción `css.modules`](/config/shared-options#css-modules).

Si `css.modules.localsConvention` está configurado para habilitar camelCase locales (por ejemplo, `localsConvention: 'camelCaseOnly'`), también podrá usar importaciones con nombre:

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### Preprocesadores CSS

Debido a que Vite solo se dirige a los navegadores modernos, se recomienda usar variables CSS nativas con plugins de PostCSS que implementen borradores de CSSWG (por ejemplo, [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) y CSS simple y compatible con estándares futuros.

Dicho esto, Vite proporciona soporte integrado para archivos `.scss`, `.sass`, `.less`, `.styl` y `.stylus`. No es necesario instalar plugins específicos de Vite para ellos, pero se debe instalar el preprocesador correspondiente:

```bash
# .scss and .sass
npm add -D sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

Si usas componentes de archivo único de Vue (SFC), esto también habilita automáticamente `<style lang="sass">` et al.

Vite mejora la resolución de `@import` para Sass y Less para que también se respeten los alias de Vite. Además, las referencias `url()` relativas dentro de los archivos Sass/Less importados que se encuentran en directorios diferentes del archivo raíz también se reorganizan automáticamente para garantizar la corrección.

El alias `@import` y el cambio de base de URL no son compatibles con Stylus debido a las limitaciones de su API.

También puedes usar módulos CSS combinados con preprocesadores anteponiendo `.module` a la extensión del archivo, por ejemplo `style.module.scss`.

### Deshabilitando la inyección de CSS en la página

La inyección automática de contenido CSS se puede desactivar a través del parámetro de consulta `?inline`. En este caso, la cadena CSS procesada se devuelve como la exportación predeterminada del módulo como de costumbre, pero los estilos no se inyectan en la página.

```js twoslash
import 'vite/client'
// ---cut--
import './foo.css' // se inyectará en la página
import otherStyles from './bar.css?inline' // no se inyectará
```

::: tip NOTA
Las importaciones predeterminadas y nombradas de archivos CSS (por ejemplo, `import style from './foo.css'`) se eliminaron desde Vite 5. Utiliza la línea `?inline` en su lugar.
:::

### Lightning CSS

A partir de la versión 4.4 de Vite, existe soporte experimental para [Lightning CSS](https://lightningcss.dev/). Puedes utilizarlo añadiendo [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) a tu archivo de configuración y luego instalando la dependencia opcional [`lightningcss`](https://www.npmjs.com/package/lightningcss):

```bash
npm add -D lightningcss
```

Si se habilita, los archivos CSS se procesarán con Lightning CSS en lugar de PostCSS. Para configurarlo, puedes pasar las opciones Lightning CSS a la opción de configuración [`css.lightningcss`](../config/shared-options.md#css-lightningcss).

Para configurar CSS Modules, debes utilizar [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) en lugar de [`css.modules`](../config/shared-options.md#css-modules) (que configura la forma en que PostCSS maneja los módulos de CSS).

Por defecto, Vite utiliza esbuild para minificar CSS. Lightning CSS también se puede utilizar como minificador de CSS mediante [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify).

::: tip NOTA
Los [preprocesadores de CSS](#css-pre-processors) no son compatibles cuando se utiliza Lightning CSS.
:::

## Recursos estáticos

La importación de un recurso estático devolverá la URL pública resuelta cuando se sirva:

```js twoslash
import 'vite/client'
// ---cut--
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Las consultas especiales pueden modificar cómo se cargan los recursos:

```js twoslash
import 'vite/client'
// ---cut--
// carga recursos explícitamente como URL
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut--
// carga recursos como string
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut--
// cargar Web Workers
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut--
// incrustado de Web Workers como cadenas base64 en tiempo de compilado.
import InlineWorker from './worker.js?worker&inline'
```

Más detalles en [Gestión de recursos estáticos](./assets).

## JSON

Los archivos JSON se pueden importar directamente; también se admiten las importaciones con nombre:

```js twoslash
import 'vite/client'
// ---cut--
// importar todo el objeto
import json from './example.json'
// importe un campo raíz como exportaciones con nombre: ¡ayuda al hacer tree-shaking!
import { field } from './example.json'
```

## Importaciones Glob

Vite admite la importación de múltiples módulos desde el sistema de archivos a través de la función especial `import.meta.glob`:

```js twoslash
import 'vite/client'
// ---cut--
const modules = import.meta.glob('./dir/*.js')
```

Lo anterior se transformará en lo siguiente:

```js
// código producido por vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

A continuación, puedes iterar sobre las claves del objeto `modules` para acceder a los módulos correspondientes:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Los archivos coincidentes se cargan de forma diferida de forma predeterminada a través de la importación dinámica y se dividirán en partes separadas durante la compilación. Si prefieres importar todos los módulos directamente (por ejemplo, confiando en que los efectos secundarios de estos módulos se apliquen primero), puedes pasar `{ eager: true }` como segundo argumento:

```js twoslash
import 'vite/client'
// ---cut--
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

Lo anterior se transformará en lo siguiente:

```js
// código producido por vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

### Patrones múltiples

El primer argumento puede ser una array de globs, por ejemplo

```js twoslash
import 'vite/client'
// ---cut--
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Patrones negativos

También se admiten patrones glob negativos (con el prefijo `!`). Para ignorar algunos archivos del resultado, puedes agregar exclusiones de patrones glob en el primer argumento:

```js twoslash
import 'vite/client'
// ---cut--
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// código producido por vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### Importaciones nombradas

Es posible importar solo partes de los módulos con las opciones de `import`.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// código producido por vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}
```

Cuando se combina con `eager`, incluso es posible tener habilitado el tree-shaking para esos módulos.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// código producido por vite:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

Configura `import` a `default` para importar la exportación predeterminada.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// código producido por vite:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

#### Consultas personalizadas

También puedes utilizar la opción `query` para realizar consultas sobre importaciones, por ejemplo, para importar recursos [como una cadena](./assets.html#importar-recursos-como-cadenas-de-texto) o [como URL](./assets.html#importar-recursos-como-url):

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// código producido por vite:
const moduleStrings = {
  './dir/foo.svg': () => import('./dir/foo.js?raw').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/foo.svg': () => import('./dir/foo.js?url').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?url').then((m) => m['default']),
}
```

También puedes proporcionar consultas personalizadas para que las consuman otros plugins:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

### Advertencias de importación glob

Ten en cuenta que:

- Esta es una característica exclusiva de Vite y no es un estándar web o ES.
- Los patrones glob se tratan como especificadores de importación: deben ser relativos (comenzar con `./`) o absolutos (comenzar con `/`, resueltos en relación con la raíz del proyecto) o una ruta de alias (ver [opción `resolve.alias`](/config/shared-options#resolve-alias)).
- La coincidencia de glob se realiza a través de [`fast-glob`](https://github.com/mrmlnc/fast-glob) - Consulta la documentación de los [patrones de glob compatibles](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- También debes tener en cuenta que todos los argumentos en `import.meta.glob` deben **pasarse como literales**. NO puede usar variables o expresiones en ellos.

## Importación dinámica

Similar a [importación de glob](#importaciones-glob), Vite también admite la importación dinámica con variables.

```ts
const module = await import(`./dir/${file}.js`)
```

Ten en cuenta que las variables solo representan nombres de archivo de un nivel de profundidad. Si `file` es `'foo/bar'`, la importación fallaría. Para un uso más avanzado, puede utilizar la función [importación de glob](#importaciones-glob)

## WebAssembly

Los archivos `.wasm` precompilados se pueden importar con `?init`.

La exportación por defecto será una función de inicialización que devuelve una Promesa de [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'
init().then((instance) => {
  instance.exports.test()
})
```

La función init también puede tomar un importObject que se pasa a [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) como su segundo argumento:

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

En la compilación de producción, los archivos `.wasm` más pequeños que `assetInlineLimit` se insertarán como cadenas base64. De lo contrario, se tratarán como un [recurso estático](./assets) y se obtendrán a pedido.

::: tip NOTA
La [propuesta de integración de módulos ES para WebAssembly](https://github.com/WebAssembly/esm-integration) no es compatible actualmente.
Usa [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) u otros plugins de la comunidad para darle el manejo apropiado.
:::

### Acceso al módulo en WebAssembly

Si necesitas acceder al objeto `Module`, por ejemplo, para instanciarlo varias veces, utiliza una [importación de URL explícita](./assets#importar-recursos-como-url) para resolver el recurso y luego realice la instanciación:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } = await WebAssembly.instantiateStreaming(
    responsePromise
  )
  /* ... */
}

main()
```

### Obteniendo el módulo en Node.js

En SSR, el `fetch()` que ocurre como parte de la importación `?init`, puede fallar con `TypeError: URL no válida`.
Consulta el problema en el debate de [Soporte wasm en SSR](https://github.com/vitejs/vite/issues/8882).

Aquí hay una alternativa, asumiendo que la base del proyecto es el directorio actual:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Web Workers

### Importar con Worker

Se puede importar un script de web worker usando [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) y [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). En comparación con los sufijos de worker, esta sintaxis se acerca más a los estándares y es la forma **recomendada** de crear workers.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

El constructor de worker también acepta opciones, que se pueden usar para crear workers de "módulo":

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

La detección de workers solo funcionará si el constructor `new URL()` se usa directamente dentro de la declaración `new Worker()`. Además, todos los parámetros de opciones deben ser valores estáticos (es decir, cadenas literales).

### Importar con sufijos de consulta

Se puede importar directamente un script de web worker agregando `?worker` o `?sharedworker` a la solicitud de importación. La exportación predeterminada será un constructor de worker personalizado:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

El script del worker también puede usar sentencias ESM `import` en lugar de `importScripts()`; **Nota**: ten en cuenta que durante el desarrollo esto depende del [soporte nativo del navegador](https://caniuse.com/?search=module%20worker), pero para la compilación de producción está compilado.

De forma predeterminada, el script del worker se emitirá como un fragmento separado en la compilación de producción. Si deseas listar el worker como cadenas base64, agrega el parámetro `inline`:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

Si deseas listar el worker como una URL, agrega el parámetro `url`:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

Revisa las [opciones de Worker](/config/worker-options) para obtener detalles sobre cómo configurar el empaquetado de todos los workers.

## Política de Seguridad de Contenido (CSP)

Para implementar CSP, se deben establecer ciertas directivas o configuraciones debido a las partes internas de Vite.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

Cuando se establece [`html.cspNonce`](/config/shared-options#html-cspnonce), Vite agrega un atributo nonce con el valor especificado a cualquier etiqueta `<script>` y `<style>`, así como a las etiquetas `<link>` para hojas de estilo y precarga de módulos. Además, cuando se establece esta opción, Vite inyectará una etiqueta meta (`<meta property="csp-nonce" nonce="PLACEHOLDER" />`).

El valor de nonce de una etiqueta meta con `property="csp-nonce"` será utilizado por Vite cuando sea necesario tanto durante el desarrollo como después de la compilación.

:::warning
Asegúrate de reemplazar el placeholder con un valor único para cada solicitud. Esto es importante para evitar eludir la política de recursos, lo cual de lo contrario podría hacerse fácilmente.
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

Por defecto, durante la compilación, Vite incrusta activos pequeños como URIs de datos. Es necesario permitir `data:` para directivas relacionadas (por ejemplo, [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src), [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)), o deshabilitarlo estableciendo [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit).

:::warning
No le des permisos a `data:` para [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). Esto permitirá la inyección de scripts arbitrarios.
:::

## Optimizaciones de compilación

> Las funcionalidades que se enumeran a continuación se aplican automáticamente como parte del proceso de compilación y no hay necesidad de una configuración explícita a menos que desees deshabilitarlas.

### División de código CSS

Vite extrae automáticamente el CSS utilizado por los módulos en un fragmento asíncrono y genera un archivo separado para él. El archivo CSS se carga automáticamente a través de una etiqueta `<link>` cuando se carga el fragmento asíncrono asociado, y se garantiza que el fragmento asíncrono solo se evaluará después de cargar el CSS para evitar [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retriever.).

Si prefieres que se extraiga todo el CSS en un solo archivo, puedes desactivar la división del código CSS configurando [`build.cssCodeSplit`](/config/build-options#build-csscodesplit) en `false`.

### Generación de directivas de precarga

Vite genera automáticamente directivas `<link rel="modulepreload">` para fragmentos de entrada y sus importaciones directas en el HTML creado.

### Optimización de carga de fragmentos asíncronos

En las aplicaciones del mundo real, Rollup a menudo genera fragmentos "comunes": código que se comparte entre dos o más fragmentos. Combinado con importaciones dinámicas, es bastante común tener el siguiente escenario:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

En escenarios no optimizados, cuando se importa el fragmento asíncrono `A`, el navegador tendrá que solicitar y analizar `A` antes de darse cuenta de que también necesita el fragmento común `C`. Esto da como resultado consultas de ida y vuelta adicionales a la red:

```
Entrada ---> A ---> C
```

Vite reescribe automáticamente las llamadas de importación dinámicas de código dividido con un paso de precarga para que cuando se solicite `A`, `C` se obtengan **en paralelo**:

```
Entrada ---> (A + C)
```

Es posible que `C` tenga más importaciones, lo que dará como resultado aún más consultas de ida y vuelta en el escenario no optimizado. La optimización de Vite rastreará todas las importaciones directas para eliminar por completo esas consultas, independientemente de la profundidad de la importación.
