# Migración de v7

Si estás migrando desde `rolldown-vite`, la versión de vista técnica para Vite integrado con Rolldown para v6 & v7, solo las secciones con <Badge text="NRV" type="warning" /> en el título son aplicables.

## Cambio en los Navegadores de Destino Predeterminados [<Badge text="NRV" type="warning" />](#migration-from-v7)

El valor de los navegadores predeterminados de `build.target` y `'baseline-widely-available'` se actualiza a versiones más recientes del navegador:

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

Estas versiones de navegador se alinean con los conjuntos de características [Baseline Widely Available](https://web-platform-dx.github.io/web-features/) a partir de 2026-01-01. En otras palabras, fueron lanzadas hace aproximadamente dos años y medio.

## Rolldown

Vite 8 utiliza Rolldown y herramientas basadas en Oxc en lugar de esbuild y Rollup.

### Migración Gradual

El paquete `rolldown-vite` implementa Vite 7 con Rolldown, sin otros cambios de Vite 8. Esto puede ser utilizado como un paso intermedio para migrar a Vite 8. Véase [la guía de integración de Rolldown](./rolldown.md) en los documentos de Vite 7 para cambiar a `rolldown-vite` desde Vite 7.

Para los usuarios que migran de `rolldown-vite` a Vite 8, puedes deshacer los cambios de dependencia en `package.json` y actualizar a Vite 8:

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### El optimizador de dependencias ahora usa Rolldown

Rolldown ahora se utiliza para la optimización de dependencias en lugar de esbuild. Vite todavía soporta [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions) para compatibilidad con versiones anteriores, convirtiéndolo automáticamente a [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions). `optimizeDeps.esbuildOptions` ahora está obsoleto y se eliminará en el futuro, y te animamos a migrar a `optimizeDeps.rolldownOptions`.

Las siguientes opciones se convierten automáticamente:

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> `rolldownOptions.output.minify`
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> `rolldownOptions.treeshake`
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> `rolldownOptions.transform.define`
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> `rolldownOptions.moduleTypes`
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> `!rolldownOptions.resolve.symlinks`
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> `rolldownOptions.resolve.extensions`
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> `rolldownOptions.resolve.mainFields`
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> `rolldownOptions.resolve.conditionNames`
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> `rolldownOptions.output.keepNames`
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> `rolldownOptions.platform`
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> `rolldownOptions.plugins` (soporte parcial)

<!-- TODO: add link to rolldownOptions.* -->

Puedes obtener las opciones establecidas por la capa de compatibilidad desde el hook `configResolved`:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### Transformaciones de JavaScript por Oxc

Oxc ahora se utiliza para la transformación de JavaScript en lugar de esbuild. Vite todavía soporta la opción [`esbuild`](/config/shared-options#esbuild) para compatibilidad con versiones anteriores, convirtiéndola automáticamente a [`oxc`](/config/shared-options#oxc). `esbuild` ahora está obsoleto y se eliminará en el futuro, por lo que te animamos a migrar a `oxc`.

Las siguientes opciones se convierten automáticamente:

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> plugin personalizado usando el hook transform
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> plugin personalizado usando el hook transform

La opción [`esbuild.supported`](https://esbuild.github.io/api/#supported) no es soportada por Oxc. Si necesitas esta opción, por favor consulta [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373).

Puedes obtener las opciones establecidas por la capa de compatibilidad desde el hook `configResolved`:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

<!-- TODO: add link to rolldownOptions.output.minify -->

Actualmente, el transformador Oxc no admite la reducción de decoradores nativos mientras esperamos que la especificación avance, vea ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170)).

:::: details Solución alternativa para reducir decoradores nativos

Puedes usar [Babel](https://babeljs.io/) o [SWC](https://swc.rs/) para reducir decoradores nativos por el momento. Aunque SWC es más rápido que Babel, **no soporta la última especificación de decoradores** que esbuild admite.

La especificación de decoradores se ha actualizado varias veces desde que alcanzó la etapa 3. Las versiones admitidas por cada herramienta son:

- `"2023-11"` (esbuild, TypeScript 5.4+ y Babel soportan esta versión)
- `"2023-05"` (TypeScript 5.2+ admite esta versión)
- `"2023-01"` (TypeScript 5.0+ admite esta versión)
- `"2022-03"` (SWC admite esta versión)

Ve a [la guía de versiones de decoradores de Babel](https://babeljs.io/docs/babel-plugin-proposal-decorators#version) para ver las diferencias entre cada versión.

**Usando Babel:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig, withFilter } from 'vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [
    withFilter(
      babel({
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
      // Ejecuta esta transformación solo si el archivo contiene un decorador.
      { transform: { code: '@' } },
    ),
  ],
})
```

**Usando SWC:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            // NOTA: SWC no soporta la versión '2023-11' todavía.
            transform: { decoratorVersion: '2022-03' },
          },
        },
      }),
      // Ejecuta esta transformación solo si el archivo contiene un decorador.
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### Alternativas a esbuild

`esbuild` ya no es utilizado directamente por Vite y ahora es una dependencia opcional. Si estás usando un plugin que utiliza la función `transformWithEsbuild`, necesitas instalar `esbuild` como una `devDependency`. La función `transformWithEsbuild` está obsoleta y será eliminada en el futuro. Recomendamos migrar a la nueva función `transformWithOxc`.

### Minificación de JavaScript por Oxc

El Minificador de Oxc ahora se utiliza para la minificación de JavaScript en lugar de esbuild. Puedes usar la opción obsoleta [`build.minify: 'esbuild'`](/config/build-options#build-minify) para volver a esbuild. Esta opción de configuración será eliminada en el futuro y necesitas instalar `esbuild` como una `devDependency` ya que Vite ya no depende directamente de esbuild.

Si estabas usando las opciones `esbuild.minify*` para controlar el comportamiento de la minificación, ahora puedes usar `build.rolldownOptions.output.minify` en su lugar. Si estabas usando la opción `esbuild.drop`, ahora puedes usar las opciones [`build.rolldownOptions.output.minify.compress.drop*`](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination).

El obfuscado de propiedades y sus opciones relacionadas ([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props)) no son compatibles con Oxc. Si necesitas estas opciones, consulta [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375).

esbuild y el Minificador de Oxc hacen suposiciones ligeramente diferentes sobre el código fuente. En caso de que sospeches que el minificador está causando problemas en tu código, puedes comparar estas suposiciones aquí:

- [Suposiciones de minificación de esbuild](https://esbuild.github.io/api/#minify-considerations)
- [Suposiciones del Minificador de Oxc](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

Por favor, informa cualquier problema que encuentres relacionado con la minificación en tus aplicaciones JavaScript.

### Minificación de CSS con Lightning CSS

[Lightning CSS](https://lightningcss.dev/) ahora se utiliza para la minificación de CSS por defecto. Puedes usar la opción [`build.cssMinify: 'esbuild'`](/config/build-options#build-cssminify) para volver a esbuild. Ten en cuenta que necesitas instalar `esbuild` como una `devDependency`.

Lightning CSS admite una mejor sintaxis de lowering y el tamaño de tu paquete CSS podría aumentar ligeramente.

### Interoperabilidad consistente de CommonJS

La importación `default` de un módulo CommonJS (CJS) ahora se maneja de manera consistente.

Si coincide con una de las siguientes condiciones, la importación `default` es el valor `module.exports` del módulo CJS importado. De lo contrario, la importación `default` es el valor `module.exports.default` del módulo CJS importado:

- El importador es `.mjs` o `.mts`.
- El `package.json` más cercano para el importador tiene un campo `type` establecido en `module`.
- El valor `module.exports.__esModule` del módulo CJS importado no está establecido en true.

::: details El comportamiento anterior

En desarrollo, si coincidía con una de las siguientes condiciones, la importación `default` era el valor `module.exports` del módulo CJS importado. De lo contrario, la importación `default` era el valor `module.exports.default` del módulo CJS importado:

- _El importador está incluido en la optimización de dependencias_ y `.mjs` o `.mts`.
- _El importador está incluido en la optimización de dependencias_ y el `package.json` más cercano para el importador tiene un campo `type` establecido en `module`.
- El valor `module.exports.__esModule` del módulo CJS importado no está establecido en true.

En build, las condiciones eran:

- El valor `module.exports.__esModule` del módulo CJS importado no está establecido en true.
- _La propiedad `default` de `module.exports` no existe_.

(asumiendo que [`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports) no se ha cambiado del valor predeterminado `'auto'`)

:::

Consulta la documentación de Rolldown sobre este problema para obtener más detalles: [Importación `default` ambigua de módulos CJS - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules).

Este cambio puede romper algún código existente que importe módulos CJS. Puedes usar la opción obsoleta `legacy.inconsistentCjsInterop: true` para restaurar temporalmente el comportamiento anterior. Si encuentras un paquete que se ve afectado por este cambio, por favor infórmalo al autor del paquete o envíale un pull request. Asegúrate de enlazar al documento de Rolldown anterior para que el autor pueda entender el contexto.

### Eliminación de la Resolución de Módulos Utilizando la Inferencia de Formato

Cuando tanto los campos `browser` como `module` están presentes en `package.json`, Vite solía resolver el campo basándose en el contenido del archivo y solía elegir el archivo ESM para los navegadores. Esto se introdujo porque algunos paquetes estaban usando el campo `module` para apuntar a archivos ESM para Node.js y otros paquetes estaban usando el campo `browser` para apuntar a archivos UMD para navegadores. Dado que el campo moderno `exports` solucionó este problema y ahora es adoptado por muchos paquetes, Vite ya no usa esta heurística y siempre respeta el orden de la opción [`resolve.mainFields`](/config/shared-options#resolve-mainfields). Si estabas confiando en este comportamiento, puedes usar la opción [`resolve.alias`](/config/shared-options#resolve-alias) para mapear el campo al archivo deseado o aplicar un parche con tu gestor de paquetes (ej. `patch-package`, `pnpm patch`).

### Llamadas Require Para Módulos Externalizados

Las llamadas `require` para módulos externalizados ahora se preservan como llamadas `require` y no se convierten en declaraciones `import`. Esto es para preservar la semántica de las llamadas `require`. Si quieres convertirlas en declaraciones `import`, puedes usar el plugin incorporado de Rolldown `esmExternalRequirePlugin`, que se reexporta desde `vite`.

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

Consulta la documentación de Rolldown para obtener más detalles: [`require` módulos externos - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).

### `import.meta.url` en UMD / IIFE

`import.meta.url` ya no se polifiliza en los formatos de salida UMD / IIFE. Se reemplazará con `undefined` por defecto. Si prefieres el comportamiento anterior, puedes usar la opción `define` con la opción `build.rolldownOptions.output.intro`. Consulta la documentación de Rolldown para más detalles: [Propiedades `import.meta` conocidas - Formatos de salida no ESM | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).

### Eliminación de la opción `build.rollupOptions.watch.chokidar`

La opción `build.rollupOptions.watch.chokidar` se eliminó. Por favor, migra a la opción `build.rolldownOptions.watch.notify`.

<!-- TODO: add link to rolldownOptions.watch.notify -->

### Deprecación de `build.rollupOptions.output.manualChunks`

La opción `build.rollupOptions.output.manualChunks` se ha desechado. Rolldown tiene la opción `advancedChunks` más flexible. Consulta la documentación de Rolldown para más detalles sobre `advancedChunks`: [Advanced Chunks - Rolldown](https://rolldown.rs/in-depth/advanced-chunks).

<!-- TODO: add link to rolldownOptions.output.advancedChunks -->

### Soporte y Detección Automática de Tipos de Módulo

_Este cambio solo afecta a los autores de plugins._

Rolldown tiene soporte experimental para [Tipos de módulo](https://rolldown.rs/guide/notable-features#module-types), similar a la [opción `loader` de esbuild](https://esbuild.github.io/api/#loader). Debido a esto, Rolldown establece automáticamente un tipo de módulo basado en la extensión del id resuelto. Si estás convirtiendo contenido de otros tipos de módulo a JavaScript en los hooks `load` o `transform`, es posible que necesites agregar `moduleType: 'js'` al valor devuelto:

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

### Otras Deprecaciones Relacionadas

Las siguientes opciones están obsoletas y se eliminarán en el futuro:

- `build.rollupOptions`: renombrado a `build.rolldownOptions`
- `worker.rollupOptions`: renombrado a `worker.rolldownOptions`
- `build.commonjsOptions`: ahora es una operación no operativa

## Cambios Generales [<Badge text="NRV" type="warning" />](#migration-from-v7)

## Características obsoletas eliminadas [<Badge text="NRV" type="warning" />](#migration-from-v7)

**_POR HACER: Este cambio aún no está implementado, pero se implementará antes de la versión estable._**

## Avanzado

Estos cambios rotóricos se espera que afecten solo a una minoría de casos de uso:

- **[POR HACER: esto se corregirá antes de la versión estable]** https://github.com/rolldown/rolldown/issues/5726 (afecta a nuxt, qwik)
- **[POR HACER: esto se corregirá antes de la versión estable]** https://github.com/rolldown/rolldown/issues/3403 (afecta a sveltekit)
- **[POR HACER: esto se corregirá antes de la versión estable]** Los fragmentos heredados se emiten como un archivo de activo en lugar de un archivo de fragmento debido a la falta de la función de emisión de fragmento preconstruido ([rolldown#4304](https://github.com/rolldown/rolldown/issues/4034)). Esto significa que las opciones relacionadas con los fragmentos no se aplican a los fragmentos heredados y el archivo de manifiesto no incluirá los fragmentos heredados como un archivo de fragmento.
- **[POR HACER: esto se corregirá antes de la versión estable]** La memoria caché del resolutor rompe casos menores en Vitest ([rolldown-vite#466](https://github.com/vitejs/rolldown-vite/issues/466), [vitest#8754](https://github.com/vitest-dev/vitest/issues/8754#issuecomment-3441115032))
- **[POR HACER: esto se corregirá antes de la versión estable]** El resolutor no funciona con yarn pnp ([rolldown-vite#324](https://github.com/vitejs/rolldown-vite/issues/324), [rolldown-vite#392](https://github.com/vitejs/rolldown-vite/issues/392))
- **[POR HACER: esto se corregirá antes de la versión estable]** Problema de ordenamiento de plugins nativos ([rolldown-vite#373](https://github.com/vitejs/rolldown-vite/issues/373))
- **[POR HACER: esto se corregirá antes de la versión estable]** Caso límite del comentario `@vite-ignore` ([rolldown-vite#426](https://github.com/vitejs/rolldown-vite/issues/426))
- **[POR HACER: esto se corregirá antes de la versión estable]** https://github.com/rolldown/rolldown/issues/3403
- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) aún no son compatibles ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- `define` no comparte referencias para objetos: Cuando pasas un objeto como valor a `define`, cada variable tendrá una copia separada del objeto. Consulta el [documento del Transformador Oxc](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define) para más detalles.
- Cambios en el objeto `bundle` (`bundle` es un objeto pasado en los hooks `generateBundle` / `writeBundle`, devuelto por la función `build`):
  - Asignar a `bundle[foo]` no es compatible. Rollup tampoco recomienda esto. Por favor, usa `this.emitFile()` en su lugar.
  - La referencia no se comparte entre los hooks ([rolldown-vite#410](https://github.com/vitejs/rolldown-vite/issues/410))
  - `structuredClone(bundle)` produce errores con `DataCloneError: #<Object> no se pudo clonar`. Esto ya no es compatible. Por favor, clónalo con `structuredClone({ ...bundle })`. ([rolldown-vite#128](https://github.com/vitejs/rolldown-vite/issues/128))
- Todos los hooks paralelos en Rollup funcionan como hooks secuenciales. Consulta la [documentación de Rolldown](https://rolldown.rs/apis/plugin-api#sequential-hook-execution) para más detalles.
- `"use strict";` no se inyecta a veces. Consulta la [documentación de Rolldown](https://rolldown.rs/in-depth/directives) para más detalles.
- La transformación a ES5 inferior con plugin-legacy no es compatible ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- Pasar el mismo navegador con múltiples versiones a la opción `build.target` ahora produce un error: esbuild selecciona la última versión de este, lo que probablemente no era lo que pretendías.
- Falta de compatibilidad por parte de Rolldown: Las siguientes características no son compatibles con Rolldown y ya no son compatibles con Vite.
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - Compatibilidad completa con el espacio de nombres heredado de TypeScript ([oxc-project/oxc#14227](https://github.com/oxc-project/oxc/issues/14227))
  - Hook `shouldTransformCachedModule` ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - Hook `resolveImportMeta` ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - Hook `renderDynamicImport` ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - Hook `resolveFileUrl`
- Las funciones `parseAst` / `parseAstAsync` ahora están obsoletas en favor de las funciones `parseSync` / `parse` que tienen más características.

## Migración desde v6

Ver el [Guía de Migración desde v6](/guide/migration-v6-to-v7) para ver los cambios necesarios para portar tu aplicación a Vite 7, y luego proceder con los cambios en esta página.