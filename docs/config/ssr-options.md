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

## ssr.resolve.conditions

- **Experimental** [El soporte CJS se eliminará en Vite 5](https://github.com/vitejs/vite/discussions/13816)
- **Tipo:** `'esm' | 'cjs'`
- **Por defecto:** `esm`
- **Tipo:** `string[]`
- **Relacionado:** [resolve.conditions](./shared-options.md#resolve-conditions)

  El valor predeterminado es la raíz [`resolve.conditions`](./shared-options.md#resolve-conditions).

  Estas condiciones se utilizan en la canalización del complemento y solo afectan a las dependencias no externalizadas durante la compilación de SSR. Utiliza `ssr.resolve.externalConditions` para afectar las importaciones externalizadas.

## ssr.resolve.externalConditions

- **Tipo:** `string[]`
- **Por defecto:** `[]`

  Condiciones que se utilizan durante la importación ssr (incluido `ssrLoadModule`) de dependencias externalizadas.
