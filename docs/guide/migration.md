# Migración desde v5

## API de Entorno

Como parte de la nueva [API de Entorno](/guide/api-environment.md) experimental, se necesitó una gran reestructuración interna. Vite 6 se esfuerza por evitar cambios incompatibles para asegurar que la mayoría de los proyectos puedan actualizarse rápidamente a la nueva versión mayor. Esperaremos hasta que una gran parte del ecosistema se haya trasladado para estabilizar y comenzar a recomendar el uso de las nuevas API. Pueden haber algunos casos extremos, pero estos solo deberían afectar el uso de bajo nivel por parte de frameworks y herramientas. Hemos trabajado con los mantenedores del ecosistema para mitigar estas diferencias antes del lanzamiento. Por favor, [inicia un reporte](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) si encuentras una regresión.

Algunas API internas han sido eliminadas debido a cambios en la implementación de Vite. Si dependías de alguna de ellas, por favor crea una [solicitud de función](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## API de Ejecución de Vite

La API experimental de Ejecución de Vite evolucionó a la API de Ejecutores de Módulos, lanzada en Vite 6 como parte de la nueva [API de Entorno](/guide/api-environment) experimental. Dado que la característica era experimental, la eliminación de la API anterior introducida en Vite 5.1 no es un cambio incompatible, pero los usuarios necesitarán actualizar su uso al equivalente de Ejecutores de Módulos como parte de la migración a Vite 6.

## Cambios Generales

### JSON stringify

En Vite 5, cuando se establece [`json.stringify: true`](/config/shared-options#json-stringify), se desactivaba [`json.namedExports`](/config/shared-options#json-namedexports).

En Vite 6, incluso cuando se establece `json.stringify: true`, `json.namedExports` no se desactiva y su valor es respetado. Si deseas obtener el comportamiento anterior, puedes establecer `json.namedExports: false`.

Vite 6 también introduce un nuevo valor predeterminado para `json.stringify`, que es `'auto'`, y solo convertirá a cadena los archivos JSON grandes. Para desactivar este comportamiento, establece `json.stringify: false`.

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) se ha actualizado a la versión 6 desde la v4. Ahora se requiere [`tsx`](https://www.npmjs.com/package/tsx) o [`jiti`](https://www.npmjs.com/package/jiti) para cargar archivos de configuración de postcss en TypeScript en lugar de [`ts-node`](https://www.npmjs.com/package/ts-node). Además, ahora se requiere [`yaml`](https://www.npmjs.com/package/yaml) para cargar archivos de configuración de postcss en YAML.

### Sass ahora utiliza la API moderna por defecto

En Vite 5, la API legada se usaba por defecto para Sass. Vite 5.4 añadió soporte para la API moderna.

A partir de Vite 6, la API moderna se usa por defecto para Sass. Si aún deseas usar la API legacy, puedes configurar [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions). Sin embargo, ten en cuenta que el soporte para la API legacy será eliminado en Vite 7.

Para migrar a la API moderna, consulta [la documentación de Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

## Avanzado

Existen otros cambios incompatibles que solo afectan a algunos usuarios.

- [[#15637] fix!: establece `build.cssMinify` a `'esbuild'` por defecto para SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) ahora está habilitado por defecto incluso para compilaciones SSR.
- [[#18209] refactor!: aumenta la versión mínima de terser a 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - La versión mínima soportada de terser para [`build.minify: 'terser'`](/config/build-options#build-minify) se aumentó a 5.16.0 desde 5.4.0.
- [[#18231] chore(deps): actualiza la dependencia @rollup/plugin-commonjs a v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) ahora es `true` por defecto (antes era `'auto'`).
- [[#18243] chore(deps)!: migra `fast-glob` a `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Ya no se soportan los corchetes de rango (`{01..03}` ⇒ `['01', '02', '03']`) ni los corchetes incrementales (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) en los globs.

## Migración desde v4

Consulta primero la [Guía de migración desde v4](./migration-v4-to-v5.html) para ver los cambios necesarios para migrar tu aplicación a Vite 5, y luego continúa con los cambios en esta página.
