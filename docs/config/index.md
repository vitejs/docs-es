---
title: Configurando Vite
---

# Configurando Vite

Al ejecutar `vite` desde la línea de comandos, Vite intentará automáticamente resolver un archivo de configuración llamado `vite.config.js` dentro de la [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto) (también se admiten otras extensiones de JS y TS).

El archivo de configuración más básico se ve así:

```js [vite.config.js]
export default {
  // opciones de configuración
}
```

Ten en cuenta que Vite admite el uso de la sintaxis de los módulos ES en el archivo de configuración, incluso si el proyecto no utiliza ESM de nodo nativo, por ejemplo `type: "module"` en el `package.json`. En este caso, el archivo de configuración se preprocesa automáticamente antes de cargarlo.

También puedes especificar explícitamente un archivo de configuración para usar con la opción CLI `--config` (resuelta relativa a `cwd`):

```bash
vite --config my-config.js
```

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

Vite también es compatible con archivos de configuración de TypeScript. Puedes usar `vite.config.ts` con la función auxiliar `defineConfig` mencionada anteriormente, o con el operador `satisfies`:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Configuración condicional

Si la configuración necesita determinar condicionalmente las opciones basadas en el comando (`dev`/`serve` o `build`), el [modo](/guide/env-and-mode) que se está utilizando, si es una compilación SSR (`isSsrBuild`), o está previsualizando una compilación (`isPreview`), puedes exportar una función en su lugar:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
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

Es importante tener en cuenta que en la API de Vite, el valor de `command` es `serve` durante el desarrollo (en el cli [`vite`](/guide/cli#vite), `vite dev` y `vite serve` son alias) y `build` cuando se compila para producción ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` y `isPreview` son indicadores opcionales adicionales para diferenciar el tipo de comandos `build` y `serve` respectivamente. Es posible que algunas herramientas que cargan la configuración de Vite no admitan estos indicadores y en su lugar pasen `undefined`. Por lo tanto, se recomienda utilizar una comparación explícita con `true` o `false`.

## Configuración de funciones asíncronas

Si la configuración necesita llamar a funciones asíncronas, puedes exportar una función asíncrona en su lugar. Y esta función asíncrona puede ser pasada como `defineConfig` para mejorar el soporte intellisense.

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuración de vite
  }
})
```

## Utilizando variables de entorno en Configuración

Las variables de entorno se pueden obtener de `process.env` como de costumbre.

Ten en cuenta que Vite no carga archivos `.env` de forma predeterminada, ya que los archivos que se cargarán solo se pueden determinar después de evaluar la configuración de Vite, por ejemplo, las opciones `root` y `envDir` afectan el comportamiento de carga. Sin embargo, puedes usar el helper `loadEnv` exportado para cargar el archivo `.env` específico si es necesario.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Carga el archivo env basado en el `modo` en el directorio de trabajo actual.
  // Establece el tercer parámetro como '' para cargar todas las variables de entorno sin importar el prefijo
  // `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // configuración de vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```
