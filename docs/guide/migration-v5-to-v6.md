# Migración desde Vite 5

## API de Entorno

Como parte de la nueva y experimental [API de Entorno](/guide/api-environment.md), se ha realizado una gran reestructuración interna. Vite 6 busca evitar cambios disruptivos para facilitar la actualización de la mayoría de los proyectos a esta nueva versión principal. Esperaremos hasta que una gran parte del ecosistema haya migrado antes de estabilizar y recomendar el uso de las nuevas API. Pueden existir algunos casos extremos, pero solo deberían afectar a un uso de bajo nivel por parte de frameworks y herramientas. Hemos trabajado con los mantenedores del ecosistema para mitigar estas diferencias antes del lanzamiento. Si detectas una regresión, por favor [abre un problema](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml).

Algunas API internas han sido eliminadas debido a cambios en la implementación de Vite. Si dependías de alguna de ellas, por favor crea una [solicitud de función](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## API de Ejecución en Vite

La API experimental de Ejecución en Vite ha evolucionado hacia la API de Ejecutor de Módulos (Module Runner API), que se lanza en Vite 6 como parte de la nueva y experimental [API de Entorno](/guide/api-environment). Dado que la función era experimental, la eliminación de la API anterior introducida en Vite 5.1 no se considera un cambio disruptivo, pero los usuarios deberán actualizar su uso al equivalente en la API de Ejecutor de Módulos al migrar a Vite 6.

## Cambios Generales

### Valor predeterminado de `resolve.conditions`

Este cambio no afecta a los usuarios que no hayan configurado [`resolve.conditions`](/config/shared-options#resolve-conditions), [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) o [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions).

En Vite 5, el valor predeterminado de `resolve.conditions` era `[]`, y algunas condiciones se añadían internamente. El valor predeterminado de `ssr.resolve.conditions` era el mismo que `resolve.conditions`.

A partir de Vite 6, algunas de estas condiciones ya no se añaden automáticamente y deben incluirse manualmente en la configuración:

- `resolve.conditions` ya no incluye `['module', 'browser', 'development|production']`.
- `ssr.resolve.conditions` ya no incluye `['module', 'node', 'development|production']`.

Los valores predeterminados para estas opciones se han actualizado en consecuencia, y `ssr.resolve.conditions` ya no usa `resolve.conditions` como valor predeterminado. La variable `development|production` se reemplaza dinámicamente por `production` o `development` según el valor de `process.env.NODE_ENV`. Estos valores predeterminados están disponibles en Vite como `defaultClientConditions` y `defaultServerConditions`.

Si especificaste un valor personalizado para `resolve.conditions` o `ssr.resolve.conditions`, deberás actualizarlo para incluir las nuevas condiciones. Por ejemplo, si antes usabas `['custom']`, ahora deberías usar `['custom', ...defaultClientConditions]`.

### Serialización de JSON (`json.stringify`)

En Vite 5, cuando se establecía [`json.stringify: true`](/config/shared-options#json-stringify), la opción [`json.namedExports`](/config/shared-options#json-namedexports) se deshabilitaba automáticamente.

Desde Vite 6, `json.namedExports` ya no se deshabilita automáticamente cuando `json.stringify` está activado. Si deseas mantener el comportamiento anterior, debes configurar `json.namedExports: false`.

Vite 6 también introduce un nuevo valor predeterminado para `json.stringify`: `'auto'`, que solo serializa archivos JSON grandes. Para desactivar este comportamiento, usa `json.stringify: false`.

### Soporte extendido para referencias de recursos en elementos HTML

En Vite 5, solo algunos elementos HTML admitían referencias a archivos que Vite procesaba y empaquetaba (por ejemplo, `<link href>` y `<img src>`).

Vite 6 amplía este soporte a más elementos HTML. La lista completa está disponible en la [documentación de características HTML](/guide/features.html#html).

Para evitar que ciertos elementos sean procesados, puedes agregar el atributo `vite-ignore`.

### `postcss-load-config`

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) se ha actualizado de la versión 4 a la 6. Ahora se requiere [`tsx`](https://www.npmjs.com/package/tsx) o [`jiti`](https://www.npmjs.com/package/jiti) para cargar archivos de configuración de PostCSS escritos en TypeScript en lugar de [`ts-node`](https://www.npmjs.com/package/ts-node). También se necesita [`yaml`](https://www.npmjs.com/package/yaml) para cargar configuraciones en YAML.

### Sass ahora utiliza la API moderna por defecto

En Vite 5, la API heredada era la predeterminada para Sass. Vite 5.4 agregó soporte para la API moderna.

Desde Vite 6, la API moderna es la opción predeterminada para Sass. Si prefieres seguir usando la API heredada, puedes configurarla con [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions). Sin embargo, el soporte para la API heredada se eliminará en Vite 7.

Para migrar a la API moderna, consulta la [documentación de Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

### Personalización del nombre del archivo CSS en modo librería

En Vite 5, el nombre del archivo CSS en modo librería siempre era `style.css` y no se podía cambiar fácilmente.

Desde Vite 6, el nombre predeterminado del archivo CSS ahora usa el `"name"` del `package.json`, similar a los archivos de salida JS. Si [`build.lib.fileName`](/config/build-options.md#build-lib) se define como una cadena, este valor también se usará para el archivo CSS. Para configurar un nombre de archivo CSS diferente, puedes usar la nueva opción [`build.lib.cssFileName`](/config/build-options.md#build-lib).

Si dependías del nombre `style.css`, debes actualizar las referencias a él. Por ejemplo:

```json
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css", // Vite 5
    "./style.css": "./dist/my-lib.css" // Vite 6
  }
}
```

Si prefieres mantener `style.css`, configura `build.lib.cssFileName: 'style'`.

## Cambios avanzados

Varios cambios avanzados afectan solo a ciertos usuarios:

- [[#17922] fix(css)!: eliminar la importación por defecto en el desarrollo SSR](https://github.com/vitejs/vite/pull/17922)

  - La importación por defecto de archivos CSS fue [deprecada en Vite 4](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) y eliminada en Vite 5, pero aún era soportada accidentalmente en el modo de desarrollo SSR. Este soporte ha sido eliminado ahora.

- [[#15637] fix!: el valor predeterminado de `build.cssMinify` ahora es `'esbuild'` para SSR](https://github.com/vitejs/vite/pull/15637)

  - [`build.cssMinify`](/config/build-options#build-cssminify) ahora está habilitado por defecto incluso para compilaciones SSR.

- [[#18070] feat!: omisión de proxy con WebSocket](https://github.com/vitejs/vite/pull/18070)

  - `server.proxy[path].bypass` ahora se llama para solicitudes de actualización de WebSocket y, en ese caso, el parámetro `res` será `undefined`.

- [[#18209] refactor!: actualizar la versión mínima de terser a 5.16.0](https://github.com/vitejs/vite/pull/18209)

  - La versión mínima soportada de terser para [`build.minify: 'terser'`](/config/build-options#build-minify) ha sido actualizada de 5.4.0 a 5.16.0.

- [[#18231] chore(deps): actualizar la dependencia @rollup/plugin-commonjs a v28](https://github.com/vitejs/vite/pull/18231)

  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) ahora tiene el valor `true` por defecto (antes era `'auto'`).
    - Esto puede generar paquetes más grandes, pero resultará en compilaciones más deterministas.
    - Si estás usando un archivo CommonJS como punto de entrada, puede que necesites pasos adicionales. Consulta [la documentación del plugin commonjs](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) para más detalles.

- [[#18243] chore(deps)!: migrar `fast-glob` a `tinyglobby`](https://github.com/vitejs/vite/pull/18243)

  - Los corchetes de rango (`{01..03}` ⇒ `['01', '02', '03']`) y los corchetes incrementales (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) ya no son compatibles en globs.

- [[#18395] feat(resolve)!: permitir eliminar condiciones](https://github.com/vitejs/vite/pull/18395)

  - Este PR no solo introduce el cambio importante mencionado anteriormente como "Valor predeterminado para `resolve.conditions`", sino que también hace que `resolve.mainFields` no se use para dependencias no externalizadas en SSR.
    - Si estabas usando `resolve.mainFields` y deseas aplicarlo a dependencias no externalizadas en SSR, puedes usar [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields).

- [[#18493] refactor!: eliminar la opción `fs.cachedChecks`](https://github.com/vitejs/vite/pull/18493)

  - Esta optimización opcional fue eliminada debido a casos límite al escribir un archivo en una carpeta en caché e importarlo inmediatamente.

- ~~[[#18697] fix(deps)!: actualizar la dependencia dotenv-expand a v12](https://github.com/vitejs/vite/pull/18697)~~

  - ~~Las variables usadas en interpolaciones ahora deben declararse antes de la interpolación. Para más detalles, consulta [el changelog de `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16).~~ Este cambio importante fue revertido en la versión 6.1.0.

- [[#16471] feat: v6 - API de Entorno](https://github.com/vitejs/vite/pull/16471)

  - Las actualizaciones de un módulo exclusivo de SSR ya no activan una recarga completa de la página en el cliente. Para volver al comportamiento anterior, se puede utilizar un plugin personalizado de Vite:

    <details>
    <summary>Haz clic para expandir el ejemplo</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## Migración desde v4

Consulta primero la [Guía de migración desde v4](./migration-v4-to-v5.html) para ver los cambios necesarios para migrar tu aplicación a Vite 5, y luego continúa con los cambios en esta página.
