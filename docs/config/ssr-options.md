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
