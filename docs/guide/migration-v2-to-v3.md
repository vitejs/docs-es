# Migración desde v2

## Compatibilidad de Node.js

Vite ya no es compatible con Node.js 12 / 13 / 15, los cuales ya se finalizó sus soportes oficiales. Ahora se requiere Node.js 14.18+ / 16+.

## Principales cambios para navegadores modernos

El paquete de producción asume soporte para JavaScript moderno. De forma predeterminada, Vite apunta a navegadores que admiten los [módulos ES nativos](https://caniuse.com/es6-module) e [importación dinámica nativa de ESM](https://caniuse.com/es6-module-dynamic-import) e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

Una pequeña fracción de usuarios ahora requerirán el uso de [@vite/plugin-legacy](https://github.com/vite/vite/tree/main/packages/plugin-legacy), que generará automáticamente fragmentos heredados y el correspondiente polyfills de características de lenguaje ES.

## Cambios en las opciones de configuración

Se han eliminado las siguientes opciones que ya estaban en desuso en v2:

- `alias` (cambialo por [`resolve.alias`](../config/shared-options.md#resolve-alias))
- `dedupe` (cambialo por [`resolve.dedupe`](../config/shared-options.md#resolve-dedupe))
- `build.base` (cambialo por [`base`](../config/shared-options.md#base))
- `build.brotliSize` (cambialo por [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize))
- `build.cleanCssOptions` (Vite ahora usa esbuild para la minificación de CSS)
- `build.polyfillDynamicImport` (usa [`@vite/plugin-legacy`](https://github.com/vite/vite/tree/main/packages/plugin-legacy) para navegadores sin soporte de importación dinámica).
- `optimizeDeps.keepNames` (cambialo por [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions))

## Cambios de Arquitectura y Opciones Heredadas

Esta sección describe los mayores cambios de arquitectura en Vite v3. Para permitir que los proyectos migren desde v2 en caso de un problema de compatibilidad, se agregaron opciones heredadas para volver a las estrategias de Vite v2.

### Cambios en el servidor de desarrollo

El puerto del servidor de desarrollo predeterminado de Vite ahora es 5173. Puedes usar [`server.port`](../config/server-options.md#server-port) para configurarlo en 3000.

El host del servidor de desarrollo predeterminado de Vite ahora es `localhost`. En Vite v2, Vite escuchaba `127.0.0.1` de forma predeterminada. Node.js bajo v17 normalmente resuelve `localhost` como `127.0.0.1`, por lo que para esas versiones, el host no cambiará. Para Node.js 17+, puedes usar [`server.host`](../config/server-options.md#server-host) para configurarlo en `127.0.0.1` y mantener el mismo host que Vite v2 .

Ten en cuenta que Vite v3 ahora imprime el host correcto. Esto significa que Vite puede imprimir `127.0.0.1` como host de escucha cuando se usa `localhost`. Puedes configurar [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) para evitar esto. Consulta [`server.host`](../config/server-options.md#server-host) para obtener más detalles.

### Cambios en SSR

Vite v3 usa ESM para la compilación de SSR de manera predeterminada. Cuando se usa ESM, ya no se necesitan las [heurísticas de externalización de SSR](../guide/ssr.html#ssr-externos). De forma predeterminada, todas las dependencias se externalizan. Puedes usar [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) para controlar qué dependencias incluir en el paquete SSR.

Si no es posible usar ESM para SSR en tu proyecto, puedes configurar `legacy.buildSsrCjsExternalHeuristics` para generar un paquete CJS utilizando la misma estrategia de externalización de Vite v2.

Además, [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) ahora tiene el valor predeterminado `false` cuando `ssr.target` es `'node'`. `inlineDynamicImports` cambia el orden de ejecución y no es necesario empaquetar en un solo archivo para compilaciones de node.

## Cambios generales

- Las extensiones de archivo JS en modo SSR y lib ahora usan una extensión válida (`js`, `mjs` o `cjs`) para generar archivos y fragmentos JS según su formato y el tipo de paquete.

- Terser ahora es una dependencia opcional. Si estás utilizando `build.minify: 'terser'`, debes instalarlo.

  ```shell
  npm add -D terser
  ```

### `import.meta.glob`

- [Raw `import.meta.glob`](features.md#glob-import-as) cambió de `{afirm: { type: 'raw' }}` a `{ as: 'raw' }`

- Las claves de `import.meta.glob` ahora son relativas al módulo actual.

```diff
  // archivo: /foo/index.js
  const modules = import.meta.glob('../foo/*.js')
  // transformado:
  const modules = {
  -  '../foo/bar.js': () => {}
  +  './bar.js': () => {}
  }
```

- Al usar un alias con `import.meta.glob`, las claves siempre son absolutas.
- `import.meta.globEager` ahora está en desuso. Utiliza `import.meta.glob('*', { eager: true })` en su lugar.

### Compatibilidad de WebAssembly

La sintaxis `import init from 'example.wasm'` se descarta para evitar futuras colisiones con ["Integración ESM para Wasm"](https://github.com/WebAssembly/esm-integration).
Puedes usar `?init`, que es similar al comportamiento anterior.

```diff
-import init from 'example.wasm'
+import init from 'example.wasm?init'
-init().then((exports) => {
+init().then(({ exports }) => {
  exports.test()
})
```

### Generación Automática de Certificados https

Se necesita un certificado válido cuando se usa `https`. En Vite v2, si no se configuraba ningún certificado, se creaba y almacenaba automáticamente un certificado autofirmado.
Desde Vite v3, recomendamos crear manualmente tus certificados. Si aún deseas utilizar la generación automática de la v2, esta función se puede volver a habilitar agregando [@vite/plugin-basic-ssl](https://github.com/vite/vite-plugin-basic-ssl) a los plugins del proyecto.

```js
import basicSsl from '@vite/plugin-basic-ssl'
export default {
  plugins: [basicSsl()],
}
```

## Experimental

### Uso de optimización de dependencias de esbuild en compilación

En la v3, Vite permite el uso de esbuild para optimizar las dependencias de forma predeterminada. Al hacerlo, elimina una de las diferencias más significativas entre desarrollo y producción presentes en la v2. Debido a que esbuild convierte las dependencias de solo CJS a ESM, [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) ya no se usa.

Si deseas probar esta estrategia de compilación, puedes usar `optimizeDeps.disabled: false` (el valor predeterminado en la v3 es `disabled: 'build'`). `@rollup/plugin-commonjs` se puede eliminar pasando `build.commonjsOptions: { include: [] }`

## Avanzado

Hay algunos cambios que solo afectan a los creadores de plugins/herramientas.

- [[#5868] refactor: eliminada API en desuso para 3.0](https://github.com/vite/vite/pull/5868)
  - Se elimina `printHttpServerUrls`
  - Se eliminan `server.app`, `server.transformWithEsbuild`
  - Se elimina `import.meta.hot.acceptDeps`
- [[#6901] fix: inyección secuencial de etiquetas en transformIndexHtml](https://github.com/vite/vite/pull/6901)
  - `transformIndexHtml` ahora obtiene el contenido correcto modificado por plugins anteriores, por lo que el orden de las etiquetas inyectadas ahora funciona como se esperaba.
- [[#7995] chore: no fixStacktrace](https://github.com/vite/vite/pull/7995)
  - El valor predeterminado de la opción `fixStacktrace` de `ssrLoadModule` ahora es `false`
- [[#8178] feat!: migración a ESM](https://github.com/vite/vite/pull/8178)
  - `formatPostcssSourceMap` ahora es asíncrono
  - `resolvePackageEntry`, `resolvePackageData` ya no están disponibles desde la compilación de CJS (se necesita una importación dinámica para usar en CJS)
- [[#8626] refactor: mapeo de tipo client](https://github.com/vite/vite/pull/8626)
  - El tipo del callback para `import.meta.hot.accept` ahora es más estricto. Ahora es `(mod: (Record<string, any> & { [Symbol.toStringTag]: 'Module' }) | undefined) => void` (antes `(mod: any) => void`).

También hay otros cambios importantes que solo afectan a unos pocos usuarios.

- [[#5018] feat: habilita `generatedCode: 'es2015'` para compilación de Rollup](https://github.com/vite/vite/pull/5018)
  - Transpilar a ES5 ahora es necesario incluso si el código de usuario solo incluye ES5.
- [[#7877] fix: tipos de clientes vite](https://github.com/vite/vite/pull/7877)
  - `/// <reference lib="dom" />` se elimina de `vite/client.d.ts`. `{ "lib": ["dom"] }` o `{ "lib": ["webworker"] }` es necesario en el `tsconfig.json`.
- [[#8090] feat: conservar variables de entorno en el proceso de compilación de librería](https://github.com/vite/vite/pull/8090)
  - `process.env.*` ahora se conserva en modo biblioteca
- [[#8280] feat: optimización de esbuild sin bloqueos en el momento de la compilación](https://github.com/vite/vite/pull/8280)
  - La opción `server.force` se eliminó en favor de la opción `optimizeDeps.force`.
- [[#8550] fix: no manejar sigterm en modo middleware](https://github.com/vite/vite/pull/8550)
  - Cuando se ejecuta en modo middleware, Vite ya no elimina el proceso en `SIGTERM`.

## Migración desde v1

Consulta la [Guía de migración desde v1](https://v2.vite.dev/guide/migration.html) en la documentación de Vite v2 primero para ver los cambios necesarios para migrar tu aplicación a Vite v2 y luego continuar con los cambios descritos en esta página.
