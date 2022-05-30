# Opciones de SSR

- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

:::warning Experimental
Las opciones de SSR pueden ser ajustadas en versiones menores.
:::


## ssr.external

- **Tipo:** `string[]`

  Fuerza la externalización de dependencias para SSR.

## ssr.noExternal

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`

  Evita que las dependencias enumeradas se externalicen para SSR. Si es `true`, no se externalizan dependencias.

## ssr.target

- **Tipo:** `'node' | 'webworker'`
- **Por defecto:** `node`

  Destino de compilación para el servidor SSR.

## ssr.format

- **Tipo:** `'esm' | 'cjs'`
- **Por defecto:** `esm`
- **Experimental**

Formato de compilación para el servidor SSR. Desde Vite v3, la compilación SSR genera ESM de forma predeterminada. Se puede seleccionar `'cjs'` para generar una compilación CJS, pero no se recomienda. La opción se deja marcada como experimental para dar a los usuarios más tiempo para actualizar a ESM. Las compilaciones de CJS requieren heurísticas de externalización complejas que no están presentes en el formato ESM.
