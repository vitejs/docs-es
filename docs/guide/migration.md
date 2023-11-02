# Migración desde v4

## Soporte de Node.js

Vite ya no es compatible con Node.js 14/16/17/19, versiones que alcanzaron su final de soporte. Ahora se requiere Node.js 18/20+.

## Rollup 4

Vite ahora está usando Rollup 4, que también trae consigo sus cambios importantes, en particular:

- Se ha cambiado el nombre de importar aserciones (propiedad `assertions`) a importar atributos (propiedad `attributes`).
- Los complementos de Acorn ya no son compatibles.
- Para los complementos de Vite, la opción `this.resolve` `skipSelf` ahora es `true` por defecto.
- Para los complementos de Vite, `this.parse` ahora solo soporta la opción `allowReturnOutsideFunction` por ahora.

Lee los cambios importantes completos en las [notas de la versión de Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0) para conocer los cambios relacionados con la compilación en `build.rollupOptions`.

## API de Node para la compilación CJS de Vite, ahora obsoleta

La API de Node para la compilación CJS de Vite ahora está en desuso. Al llamar a `require('vite')`, ahora se registra una advertencia de obsolescencia. En su lugar, debes actualizar tus archivos o frameworks para importar la compilación ESM de Vite.

En un proyecto básico de Vite, asegúrate que:

1. El contenido del archivo `vite.config.js` utiliza la sintaxis ESM.
2. El archivo `package.json` más cercano tiene `"type": "module"`, o usa la extensión `.mjs`, por ejemplo, `vite.config.mjs`.

Para otros proyectos, existen algunos enfoques generales:

- **Configura ESM como predeterminado, optar por CJS si es necesario:** Agrega `"type": "module"` en el
  `package.json` del proyecto. Todos los archivos `*.js` ahora se interpretan como ESM y deben utilizar la sintaxis de ESM. Puedes cambiar el nombre de un archivo con la extensión `.cjs` para seguir usando CJS.
- **Mantén CJS como predeterminado, optar por ESM si es necesario:** Si el `package.json` del proyecto no tiene `"type": "module"`, todos los archivos `*.js` se interpretan como CJS. Puedes cambiar el nombre de un archivo con la extensión `.mjs` para usar ESM en su lugar.
- **Importar Vite dinámicamente:** Si necesitas seguir usando CJS, puedes importar Vite dinámicamente usando `import('vite')` en su lugar. Esto requiere que tu código esté escrito en un contexto "asíncrono", pero aún así debería ser manejable ya que la API de Vite es en su mayoría asíncrona.

Consulta la [guía de solución de problemas](/guide/troubleshooting.html#api-de-node-para-la-compilacion-cjs-de-vite-ahora-obsoleto) para obtener más información.

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

En Vite 4, `worker.plugins` aceptaba una serie de complementos (`(Plugin | Plugin[])[]`). Desde Vite 5, debe configurarse como una función que devuelve una serie de complementos (`() => (Plugin | Plugin[])[]`). Este cambio es necesario para que las compilaciones paralelas de workers se ejecuten de manera más consistente y predecible.

### Permitir que las rutas que contienen `.` recurran a index.html

En Vite 4, acceder a una ruta que contenía `.` no recurría a index.html incluso si `appType` estaba configurado en `'SPA'` (predeterminado).
Desde Vite 5, recurrirá a index.html.

Ten en cuenta que el navegador ya no mostrará el mensaje de error 404 en la consola si señala la ruta de la imagen a un archivo inexistente (por ejemplo, `<img src="./file-does-not-exist.png">`) .

### Los archivos de manifiesto ahora se generan en el directorio `.vite` de forma predeterminada

En Vite 4, los archivos de manifiesto (`build.manifest`, `build.ssrManifest`) se generaban en la raíz de `build.outDir` de forma predeterminada. A partir de Vite 5, se generarán en el directorio `.vite` en `build.outDir` de forma predeterminada.

### Los accesos directos de CLI requieren una pulsación adicional de "Intro"

Los atajos del CLI, como `r` para reiniciar el servidor de desarrollo, ahora requieren presionar un `Enter` adicional para activar el atajo. Por ejemplo, `r + Enter` para reiniciar el servidor de desarrollo.

Este cambio evita que Vite absorba y controle accesos directos específicos del sistema operativo, lo que permite una mejor compatibilidad al combinar el servidor de desarrollo de Vite con otros procesos y evita las [advertencias anteriores](https://github.com/vitejs/vite/pull/14342).

### Eliminada la bandera `--https` y `https: true`

La bandera `--https` configura `https: true`. Esta opción estaba destinada a usarse junto con la función de generación automática de certificación https que [se eliminó en Vite 3](/guide/migration-v2-to-v3.html#generacion-automatica-de-certificados-https). Esta configuración ya no tiene sentido ya que hará que Vite inicie un servidor HTTPS sin un certificado.

Tanto [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) como [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) establece la configuración `https` independientemente del valor `https`, por lo que puedes simplemente eliminar `--https` y `https: true`.

### Eliminadas las APIs `resolvePackageEntry` y `resolvePackageData`

Las APIs `resolvePackageEntry` y `resolvePackageData` se eliminan ya que exponían componentes internos de Vite y bloqueaban posibles optimizaciones de Vite 4.3 en el pasado. Estas APIs se pueden reemplazar con paquetes de terceros, por ejemplo:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) o el paquete [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: igual que arriba, rastreando el directorio del paquete para obtener la ruta raíz de `package.json`. O utiliza el paquete de la comunidad [`vitefu`](https://github.com/svitejs/vitefu).

```js
import { resolve } from 'import-meta-env'
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

## Avanzado

Hay algunos cambios que solo afectan a los creadores de complementos/herramientas.

- [[#14119] refactor!: fusionar `PreviewServerForHook` en el tipo `PreviewServer`](https://github.com/vitejs/vite/pull/14119)

También hay otros cambios importantes que sólo afectan a unos pocos usuarios.

- [[#14098] fix!: evita reescribir esto (revierte #5312)](https://github.com/vitejs/vite/pull/14098)
  - El nivel superior "this" se reescribía a "globalThis" por defecto durante la compilación. Este comportamiento ahora se elimina.
- [[#14231] feat!: agregar extensión a los módulos virtuales internos](https://github.com/vitejs/vite/pull/14231)
  - La identificación de los módulos virtuales internos ahora tiene una extensión (`.js`).
- [[#14583] refactor!: elimina APIs internas de exportación](https://github.com/vitejs/vite/pull/14583)
  - Se eliminaron las APIs internas exportadas accidentalmente: `isDepsOptimizerEnabled` y `getDepOptimizationConfig`
  - Se eliminaron los tipos internos exportados: `DepOptimizationResult`, `DepOptimizationProcessing` y `DepsOptimizer`.
  - Se cambió el nombre del tipo `ResolveWorkerOptions` a `ResolvedWorkerOptions`
- [[#5657] fix: devuelve 404 para solicitudes de recursos fuera de la ruta base](https://github.com/vitejs/vite/pull/5657)
  - En el pasado, Vite respondía a solicitudes fuera de la ruta base sin `Accept: text/html`, como si fueran solicitadas con la ruta base. Vite ya no hace eso y responde con 404.
- [[#14723] fix(resolve)!: elimina el manejo especial de .mjs](https://github.com/vitejs/vite/pull/14723)
  - En el pasado, cuando un campo`"export"` de librería se asignaba a un archivo `.mjs`, Vite aún intentaba hacer coincidir los campos `"browser"` y `"module"` para corregir la compatibilidad con ciertas librerías. Este comportamiento ahora se elimina para alinearse con el algoritmo de resolución de exportaciones.

## Migración desde v3

Consulta primero la [Guía de migración desde v3](./migration-v3-to-v4.html) para ver los cambios necesarios para migrar tu aplicación a Vite v4, y luego continúa con los cambios en esta página.
