# Migración desde v4

## Soporte de Node.js

Vite ya no es compatible con Node.js 14/16/17/19, versiones que alcanzaron su final de soporte. Ahora se requiere Node.js 18/20+.

## Rollup 4

Vite ahora está usando Rollup 4, que también trae consigo sus cambios importantes, en particular:

- Se ha cambiado el nombre de importar aserciones (propiedad `assertions`) a importar atributos (propiedad `attributes`).
- Los plugins de Acorn ya no son compatibles.
- Para los plugins de Vite, la opción `this.resolve` `skipSelf` ahora es `true` por defecto.
- Para los plugins de Vite, `this.parse` ahora solo soporta la opción `allowReturnOutsideFunction` por ahora.

Lee los cambios importantes completos en las [notas de la versión de Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0) para conocer los cambios relacionados con la compilación en [`build.rollupOptions`](/config/build-options.md#build-rollupoptions).

Si estás utilizando TypeScript, asegúrate de configurar `moduleResolution: 'bundler'` (o `node16`/`nodenext`) ya que Rollup 4 lo requiere. O puedes configurar `skipLibCheck: true` en su lugar.

## API de Node para la compilación CJS de Vite, ahora obsoleta

La API de Node para la compilación CJS de Vite ahora está en desuso. Al llamar a `require('vite')`, ahora se registra una advertencia de obsolescencia. En su lugar, debes actualizar tus archivos o frameworks para importar la compilación ESM de Vite.

En un proyecto básico de Vite, asegúrate que:

1. El contenido del archivo `vite.config.js` utiliza la sintaxis ESM.
2. El archivo `package.json` más cercano tiene `"type": "module"`, o usa la extensión `.mjs`/`.mts`, por ejemplo, `vite.config.mjs` o `vite.config.mts`.

Para otros proyectos, existen algunos enfoques generales:

- **Configura ESM como predeterminado, optar por CJS si es necesario:** Agrega `"type": "module"` en el
  `package.json` del proyecto. Todos los archivos `*.js` ahora se interpretan como ESM y deben utilizar la sintaxis de ESM. Puedes cambiar el nombre de un archivo con la extensión `.cjs` para seguir usando CJS.
- **Mantén CJS como predeterminado, optar por ESM si es necesario:** Si el `package.json` del proyecto no tiene `"type": "module"`, todos los archivos `*.js` se interpretan como CJS. Puedes cambiar el nombre de un archivo con la extensión `.mjs` para usar ESM en su lugar.
- **Importar Vite dinámicamente:** Si necesitas seguir usando CJS, puedes importar Vite dinámicamente usando `import('vite')` en su lugar. Esto requiere que tu código esté escrito en un contexto "asíncrono", pero aún así debería ser manejable ya que la API de Vite es en su mayoría asíncrona.

Consulta la [guía de solución de problemas](/guide/troubleshooting.html#api-de-node-para-la-compilacion-cjs-de-vite-ahora-obsoleto) para obtener más información.

## Reelaborada la estrategia de reemplazo de `define` e `import.meta.env.*`

En Vite 4, las funciones [`define`](/config/shared-options.md#define) e [`import.meta.env.*`](/config/build-options.md#build-rollupoptions) utilizan diferentes estrategias de reemplazo en desarrollo y compilación:

- En desarrollo, ambas funciones se inyectan como variables globales en `globalThis` e `import.meta` respectivamente.
- En la compilación, ambas funciones se reemplazan estáticamente con una expresión regular.

Esto da como resultado una inconsistencia en el desarrollo y la compilación al intentar acceder a las variables y, a veces, incluso provoca compilaciones fallidas. Por ejemplo:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// dev: { __APP_VERSION__: "1.0.0" } ✅
// build: { "1.0.0" } ❌

const docs = 'Me gusta import.meta.env.MODE'
// dev: "Me gusta import.meta.env.MODE" ✅
// build: "Me gusta "production"" ❌
```

Vite 5 soluciona este problema usando `esbuild` para manejar los reemplazos en las compilaciones, alineándose con el comportamiento de desarrollo.

Este cambio no debería afectar a la mayoría de las configuraciones, de hecho ya está documentado que los valores `define` deben seguir la sintaxis de esbuild:

> Para ser coherente con el comportamiento de esbuild, las expresiones deben ser un objeto JSON (null, Boolean, number, string, array, o object) o un único identificador.

Sin embargo, si prefieres que se sigan reemplazado valores estáticamente de forma directa, puedes usar [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace).

## Cambios generales

### El valor de los módulos externalizados SSR ahora coincide con producción

En Vite 4, los módulos externalizados de SSR están empaquetados con el manejo `.default` y `.__esModule` para una mejor interoperabilidad, pero no coinciden con el comportamiento en producción cuando se cargan mediante el entorno de ejecución (por ejemplo, Node.js), lo que genera dificultades para depurar inconsistencias. Por defecto, todas las dependencias directas del proyecto están externalizadas por SSR.

Vite 5 ahora elimina el manejo de `.default` y `.__esModule` para que coincida con el comportamiento de producción. En la práctica, esto no debería afectar las dependencias empaquetadas correctamente, pero si encuentras nuevos problemas al cargar módulos, puedes probar estas reescrituras:

```js
// Antes:
import { foo } from 'bar'

// Después:
import _bar from 'bar'
const { foo } = _bar
```

```js
// Antes:
import foo from 'bar'

// Después:
import * as _foo from 'bar'
const foo = _foo.default
```

Ten en cuenta que estos cambios coinciden con el comportamiento de Node.js, por lo que también puedes ejecutar las importaciones en Node.js para probarlo. Si prefieres seguir con el comportamiento anterior, puedes configurar `legacy.proxySsrExternalModules` en `true`.

### `worker.plugins` ahora es una función

En Vite 4, [`worker.plugins`](/config/worker-options.md#worker-plugins) aceptaba una serie de plugins (`(Plugin | Plugin[])[]`). Desde Vite 5, debe configurarse como una función que devuelve una serie de plugins (`() => (Plugin | Plugin[])[]`). Este cambio es necesario para que las compilaciones paralelas de workers se ejecuten de manera más consistente y predecible.

### Habilitado que las rutas que contienen `.` recurran a index.html

En Vite 4, acceder a una ruta en dev que contenía `.` no recurría a index.html incluso si [`appType`](/config/shared-options.md#apptype) estaba configurado en `'spa'` (predeterminado). Desde Vite 5, recurrirá a index.html.

Ten en cuenta que el navegador ya no mostrará un mensaje de error 404 en la consola si apuntas la ruta de la imagen a un archivo inexistente (por ejemplo, `<img src="./file-does-not-exist.png">`).

### Alineado el comportamiento de servido HTML para desarrollo y vista previa

En Vite 4, los servidores de desarrollo y vista previa sirven HTML según su estructura de directorio y barra diagonal de manera diferente. Esto provoca inconsistencias al probar la aplicación creada. Vite 5 se refactoriza en un solo comportamiento como se muestra a continuación, dada la siguiente estructura de archivos:

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| Solicitud         | Antes (desarrollo)              | Después (vista previa) | Después (desarrollo y vista previa) |
| ----------------- | ------------------------------- | ---------------------- | ----------------------------------- |
| `/dir/index.html` | `/dir/index.html`               | `/dir/index.html`      | `/dir/index.html`                   |
| `/dir`            | `/index.html` (redirección SPA) | `/dir/index.html`      | `/index.html` (redirección SPA)     |
| `/dir/`           | `/dir/index.html`               | `/dir/index.html`      | `/dir/index.html`                   |
| `/file.html`      | `/file.html`                    | `/file.html`           | `/file.html`                        |
| `/file`           | `/index.html` (redirección SPA) | `/file.html`           | `/file.html`                        |
| `/file/`          | `/index.html` (redirección SPA) | `/file.html`           | `/index.html` (redirección SPA)     |

### Los archivos de manifiesto ahora se generan en el directorio `.vite` por defecto

En Vite 4, los archivos de manifiesto ([`build.manifest`](/config/build-options.md#build-manifest) y [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)) se generaban en la raíz de [`build.outDir`](/config/build-options.md#build-outdir) por defecto.

A partir de Vite 5, se generarán en el directorio `.vite` en `build.outDir` por defecto. Este cambio ayuda a eliminar el conflicto de archivos públicos con los mismos nombres de los archivos de manifiesto cuando se copian en `build.outDir`.

### Los archivos CSS correspondientes no se listan como entrada de nivel superior en el archivo manifest.json

En Vite 4, el archivo CSS correspondiente a un punto de entrada de JavaScript también se listaba como una entrada de nivel superior en el archivo de manifiesto ([`build.manifest`](/config/build-options.md#build-manifest)). Estas entradas se agregaban involuntariamente y solo funcionaban para casos simples.

En Vite 5, los archivos CSS correspondientes solo se pueden encontrar dentro de la sección del archivo JavaScript de entrada.
Cuando se inyecta el archivo JS, los archivos CSS correspondientes [deben ser inyectados](/guide/backend-integration.md#:~:text=%3C!%2D%2D%20if%20production%20%2D%2D%3E%0A%3Clink%20rel%3D%22stylesheet%22%20href%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.css%20%7D%7D%22%20/%3E%0A%3Cscript%20type%3D%22module%22%20src%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.file%20%7D%7D%22%3E%3C/script%3E).
Cuando el CSS debe ser inyectado por separado, debe agregarse como una entrada separada.

### Los accesos directos de CLI requieren una pulsación adicional de "Intro"

Los atajos del CLI, como `r` para reiniciar el servidor de desarrollo, ahora requieren presionar un `Enter` adicional para activar el atajo. Por ejemplo, `r + Enter` para reiniciar el servidor de desarrollo.

Este cambio evita que Vite absorba y controle accesos directos específicos del sistema operativo, lo que permite una mejor compatibilidad al combinar el servidor de desarrollo de Vite con otros procesos y evita las [advertencias anteriores](https://github.com/vitejs/vite/pull/14342).

### Actualizado el comportamiento de TypeScript `experimentalDecorators` y `useDefineForClassFields`

Vite 5 usa esbuild 0.19 y elimina la capa de compatibilidad para esbuild 0.18, lo que cambia la forma en que se manejan [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) y [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields).

- **`experimentalDecorators` no está habilitado por defecto**

  Debes configurar `compilerOptions.experimentalDecorators` en `true` en `tsconfig.json` para usar los decoradores.

- **Los valores por defecto de `useDefineForClassFields` dependen del valor `target` de TypeScript**

  Si `target` no es `ESNext` o `ES2022` o más reciente, o si no hay un archivo `tsconfig.json`, `useDefineForClassFields` por defecto será `false`, lo que puede ser problemático con el valor por defecto de `esbuild.target` de `ESNext`. Puede transpilarse a [bloques de inicialización estáticos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) que pueden no ser compatibles con tu navegador.

  Como tal, se recomienda configurar `target` en `ESNext` o `ES2022` o más reciente, o configurar `useDefineForClassFields` en `true` explícitamente en el `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // Configurar en true si deseas usar decoradores
    "experimentalDecorators": true,
    // Configurar en true si ves errores de análisis en tu navegador
    "useDefineForClassFields": true
  }
}
```

### Eliminada los indicadores `--https` y `https: true`

El indicador `--https` configura `server.https: true` y `preview.https: true` internamente. Esta configuración estaba destinada a usarse junto con la función de generación automática de certificación https que [se eliminó en Vite 3](/guide/migration-v2-to-v3.html#generacion-automatica-de-certificados-https). Esto indica que dicha configuración ya no es útil, ya que iniciará un servidor HTTPS de Vite sin un certificado.

Si usas [`@vite/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) o [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert), estas configurarán `https` internamente, por lo que puedes eliminar `--https`, `server.https: true` y `preview.https: true`.

### Eliminadas las APIs `resolvePackageEntry` y `resolvePackageData`

Las APIs `resolvePackageEntry` y `resolvePackageData` se eliminan ya que exponían componentes internos de Vite y bloqueaban posibles optimizaciones de Vite 4.3 en el pasado. Estas APIs se pueden reemplazar con paquetes de terceros, por ejemplo:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) o el paquete [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: igual que arriba, rastreando el directorio del paquete para obtener la ruta raíz de `package.json`. O utiliza el paquete de la comunidad [`vitefu`](https://github.com/svite/vitefu).

```js
import { resolve } from 'import-meta-resolve'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## APIs obsoletas eliminadas

- Exportaciones predeterminadas de archivos CSS (por ejemplo, `import style from './foo.css'`): usa la consulta `?inline` en su lugar
- `import.meta.globEager`: usa `import.meta.glob('*', { eager: true })` en su lugar
- `ssr.format: 'cjs`' y `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` y `server.middlewareMode: 'html'`: Usa [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) en su lugar ([#8452](https://github.com/vitejs/vite/pull/8452))

## Avanzado

Hay algunos cambios que solo afectan a los creadores de plugins/herramientas.

- [[#14119] refactor!: fusiona `PreviewServerForHook` en el tipo `PreviewServer`](https://github.com/vitejs/vite/pull/14119)
  - El hook `configurePreviewServer` ahora acepta el tipo `PreviewServer` en lugar del tipo `PreviewServerForHook`.
- [[#14818] refactor(preview)!: usa middleware base](https://github.com/vitejs/vite/pull/14818)
  - Los middlewares agregados desde la función devuelta en `configurePreviewServer` ahora no tienen acceso a `base` al comparar el valor `req.url`. Esto alinea el comportamiento con el del servidor de desarrollo. Puedes verificar `base` desde el hook `configResolved` si es necesario.
- [[#14834] fix(types)!: expone httpServer con la unión Http2SecureServer](https://github.com/vitejs/vite/pull/14834)
  - Ahora se utiliza `http.Server | http2.Http2SecureServer` en lugar de `http.Server` cuando sea apropiado.

También hay otros cambios importantes que sólo afectan a unos pocos usuarios.

- [[#14098] fix!: evita reescribir esto (revierte #5312)](https://github.com/vitejs/vite/pull/14098)
  - El nivel superior "this" se reescribía a "globalThis" por defecto durante la compilación. Este comportamiento ahora se elimina.
- [[#14231] feat!: agrega extensión a los módulos virtuales internos](https://github.com/vitejs/vite/pull/14231)
  - La identificación de los módulos virtuales internos ahora tiene una extensión (`.js`).
- [[#14583] refactor!: elimina APIs internas de exportación](https://github.com/vitejs/vite/pull/14583)
  - Se eliminaron las APIs internas exportadas accidentalmente: `isDepsOptimizerEnabled` y `getDepOptimizationConfig`
  - Se eliminaron los tipos internos exportados: `DepOptimizationResult`, `DepOptimizationProcessing` y `DepsOptimizer`.
  - Se cambió el nombre del tipo `ResolveWorkerOptions` a `ResolvedWorkerOptions`
- [[#5657] fix: devuelve 404 para solicitudes de recursos fuera de la ruta base](https://github.com/vitejs/vite/pull/5657)
  - En el pasado, Vite respondía a solicitudes fuera de la ruta base sin `Accept: text/html`, como si fueran solicitadas con la ruta base. Vite ya no hace eso y responde con 404.
- [[#14723] fix(resolve)!: elimina el manejo especial de .mjs](https://github.com/vitejs/vite/pull/14723)
  - En el pasado, cuando un campo`"export"` de librería se asignaba a un archivo `.mjs`, Vite aún intentaba hacer coincidir los campos `"browser"` y `"module"` para corregir la compatibilidad con ciertas librerías. Este comportamiento ahora se elimina para alinearse con el algoritmo de resolución de exportaciones.
- [[#14733] feat(resolve)!: elimina `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` ha sido marcado como obsoleto desde Vite 3 en favor de una actualización de valores por defecto de `['browser', 'module', 'jsnext:main', 'jsnext']` para [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields).
- [[#14855] feat!: agrega isPreview a ConfigEnv y resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - Se cambió el nombre de `ssrBuild` a `isSsrBuild` en el objeto `ConfigEnv`.
- [[#14945] fix(css): Configura correctamente el nombre fuente del manifiesto y emite el archivo CSS](https://github.com/vitejs/vite/pull/14945)
  - Los nombres de los archivos CSS ahora se generan en función del nombre del fragmento (chunk).
    ​

## Migración desde v3

Consulta primero la [Guía de migración desde v3](./migration-v3-to-v4.html) para ver los cambios necesarios para migrar tu aplicación a Vite v4, y luego continúa con los cambios en esta página.
