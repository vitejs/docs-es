# Opciones para SSR

## ssr.external

- **Tipo:** `string[]`
- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

  Fuerza la externalización de dependencias para SSR.

## ssr.noExternal

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

  Evita que las dependencias enumeradas se externalicen para SSR. Si es `true`, no se externalizan dependencias.

## ssr.target

- **Tipo:** `'node' | 'webworker'`
- **Por defecto:** `node`

  Destino de compilación para el servidor SSR.

## ssr.format

- **Experimental** [El soporte CJS se eliminará en Vite 5](https://github.com/vitejs/vite/discussions/13816)
- **Tipo:** `'esm' | 'cjs'`
- **Por defecto:** `esm`

Formato de compilación para el servidor SSR. Desde Vite v3, la compilación SSR genera ESM de forma predeterminada. Se puede seleccionar `'cjs'` para generar una compilación CJS, pero no se recomienda. La opción se deja marcada como experimental para dar a los usuarios más tiempo para actualizar a ESM. Las compilaciones de CJS requieren heurísticas de externalización complejas que no están presentes en el formato ESM.
