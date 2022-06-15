---
title: Configurando Vite
---

# Configurando Vite


Al ejecutar `vite` desde la línea de comandos, Vite intentará automáticamente resolver un archivo de configuración llamado `vite.config.js` dentro de la [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto).

El archivo de configuración más básico se ve así:

```js
// vite.config.js
export default {
  // opciones de configuración
}
```

Ten en cuenta que Vite admite el uso de la sintaxis de los módulos ES en el archivo de configuración, incluso si el proyecto no utiliza ESM de nodo nativo a través de `type: "module"`. En este caso, el archivo de configuración se preprocesa automáticamente antes de cargarlo.

También puedes especificar explícitamente un archivo de configuración para usar con la opción CLI `--config` (resuelta relativa a `cwd`):

```bash
vite --config my-config.js
```

::: tip NOTA
Vite inyectará `__filename`, `__dirname` en los archivos de configuración y sus dependencias. Declarar estas variables en un nivel superior dará como resultado un error:

```js
const __filename = 'value' // SyntaxError: Identifier '__filename' has already been declared
const func = () => {
  const __filename = 'value' // no error
}
```

:::

## Configuración de Intellisense

Dado que Vite se distribuye con tipados de TypeScript, puedes aprovechar el intellisense de tu IDE con sugerencias de tipo jsdoc:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternativamente, puedes usar el helper `defineConfig` que debería proporcionar intellisense sin necesidad de anotaciones jsdoc:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite también es compatible directamente con los archivos de configuración de TypeScript. También puedes usar `vite.config.ts` con el helper `defineConfig`.

## Configuración condicional

Si la configuración necesita determinar condicionalmente las opciones según el comando (`dev`/`serve` o `build`) o el [modo](/guide/env-and-mode) que se está utilizando, puedes exportar una función en su lugar:

```js
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // configuración de desarrollo específico
    }
  } else {
    // command === 'build'
    return {
      // configuración de compilación específico
    }
  }
})
```

Es importante tener en cuenta que en la API de Vite, el valor de `command` es `serve` durante el desarrollo (en el cli `vite`, `vite dev` y `vite serve` son alias) y `build` cuando se compila para producción (`vite build`).

## Configuración de funciones asíncronas

Si la configuración necesita llamar a una función asíncrona, puedes exportar una función asíncrona en su lugar:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuración de vite
  }
})
```

## Variables de entorno

Las variables de ambiente se pueden obtener de `process.env` como de costumbre.

Ten en cuenta que Vite no carga archivos `.env` de forma predeterminada, ya que los archivos que se cargarán solo se pueden determinar después de evaluar la configuración de Vite, por ejemplo, las opciones `root` y `envDir` afectan el comportamiento de carga. Sin embargo, puedes usar el helper `loadEnv` exportado para cargar el archivo `.env` específico si es necesario.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // Carga el archivo env basado en el `modo` en el directorio de trabajo actual.
  // Coloca el tercer parámetro en '' para cargar todos los env independientemente del prefijo `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // configuración de vite
    define: {
      __APP_ENV__: env.APP_ENV
    }
  }
})
```
