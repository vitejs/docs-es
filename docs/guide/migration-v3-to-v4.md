# Migración desde v3

## Rollup 3

Vite ahora usa [Rollup 3](https://github.com/vite/vite/issues/9870), lo que nos permitió simplificar el manejo interno de recursos de Vite y tiene muchas mejoras. Consulta las [notas de la versión de Rollup 3 aquí](https://github.com/rollup/rollup/releases/tag/v3.0.0).

Rollup 3 es mayormente compatible con Rollup 2. Si usas opciones de [`rollupOptions`](../config/build-options.md#rollup-options) personalizadas en tu proyecto y encuentras problemas, consulta la [guía de migración de Rollup](https://rollupjs.org/migration/) para actualizar la configuración.

## Cambio de línea de base en navegadores modernos

La compilación para navegadores modernos ahora apunta a `safari14` de forma predeterminada para una mayor compatibilidad con ES2020. Esto significa que las compilaciones para navegadores modernos ahora pueden usar [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) y que el [operador coalescente nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) ya no se transpile. Si necesitas soportar navegadores más antiguos, puedes agregar [`@vite/plugin-legacy`](https://github.com/vite/vite/tree/main/packages/plugin-legacy) como de costumbre.

## Cambios generales

### Codificación

El juego de caracteres predeterminado de compilación ahora es utf8 (consulta [#10753](https://github.com/vite/vite/issues/10753) para obtener más detalles).

## Importando CSS como String

En Vite 3, importar la exportación predeterminada de un archivo `.css` podría generar una doble carga de CSS.

```ts
import cssString from './global.css'
```

Esta carga doble podría ocurrir ya que se emitirá un archivo `.css` y es probable que el código de la aplicación también use la cadena CSS, por ejemplo, inyectada por el tiempo de ejecución del marco. A partir de Vite 4, la exportación predeterminada `.css` [ha quedado obsoleta](https://github.com/vite/vite/issues/11094). El modificador de sufijo de consulta `?inline` debe usarse en este caso, ya que no emite los estilos `.css` importados.

```ts
import stuff from './global.css?inline'
```

### Compilaciones para producción por defecto

`vite build` ahora siempre compilará para producción independientemente del `--mode` invocado. Anteriormente, cambiar el `mode` a otro que no sea `production` daría como resultado una compilación de desarrollo. Si aún deseas compilar para desarrollo, puedes configurar `NODE_ENV=development` en el archivo `.env.{mode}`.

Como parte de este cambio, `vite dev` y `vite build` ya no se sobrepondrán a `process.env.NODE_ENV` si ya está definido. Luego, si se configuró `process.env.NODE_ENV = 'development'` antes de compilar, también compilará para desarrollo. Esto brinda más control cuando se ejecutan múltiples compilaciones o servidores de desarrollo en paralelo.

Consulta la [documentación actualizada de `mode`](https://vite.dev/guide/env-and-mode.html#modes) para obtener más detalles.

### Variables de entorno

Vite ahora usa `dotenv` 16 y `dotenv-expand` 9 (anteriormente `dotenv` 14 y `dotenv-expand` 5). Si tienes un valor que incluye `#` o `` ` ``, deberás incluirlos entre comillas.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Para obtener más detalles, consulta [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) y [`dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Avanzado

Hay algunos cambios que solo afectan a los creadores de plugins/herramientas.

- [[#11036] feat(client)!: remove never implemented hot.decline](https://github.com/vite/vite/issues/11036)
  - Usa `hot.invalidate` su lugar
- [[#9669] feat: align object interface for `transformIndexHtml` hook](https://github.com/vite/vite/issues/9669)
  - Usa `order` en vez de `enforce`

También hay otros cambios importantes que solo afectan a unos pocos usuarios.

- [[#11101] feat(ssr)!: remove dedupe and mode support for CJS](https://github.com/vite/vite/pull/11101)
  - Debes migrar al modo ESM predeterminado en SSR, la compatibilidad con CJS en SSR puede eliminarse en la próxima versión mayor de Vite.
- [[#10475] feat: handle static assets in case-sensitive manner](https://github.com/vite/vite/pull/10475)
  - Tu proyecto no debe depender de un sistema operativo que ignore las mayúsculas y minúsculas de los nombres de archivo.
- [[#10996] fix!: make `NODE_ENV` more predictable](https://github.com/vite/vite/pull/10996)
  - Consulta esta solicitud para obtener una explicación sobre este cambio.
- [[#10903] refactor(types)!: remove facade type files](https://github.com/vite/vite/pull/10903)

## Migración desde v2

Consulta la [Guía de migración desde v2](./migration-v2-to-v3) en la documentación de Vite v3 primero para ver los cambios necesarios para migrar tu aplicación a Vite v3 y luego continuar con los cambios descritos en esta página.
