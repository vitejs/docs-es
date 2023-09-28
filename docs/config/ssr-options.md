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
