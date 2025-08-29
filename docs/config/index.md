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

Ten en cuenta que Vite admite el uso de la sintaxis de los módulos ES en el archivo de configuración, incluso si el proyecto no utiliza ESM de nodo nativo, por ejemplo `"type": "module"` en el `package.json`. En este caso, el archivo de configuración se preprocesa automáticamente antes de cargarlo.

También puedes especificar explícitamente un archivo de configuración para usar con la opción CLI `--config` (resuelta relativa a `cwd`):

```bash
vite --config my-config.js
```

::: tip CARGA DE CONFIGURACIÓN
Por defecto, Vite utiliza `esbuild` para empaquetar la configuración en un archivo temporal y cargarlo. Esto puede causar problemas al importar archivos TypeScript en un monorepo. Si encuentras inconvenientes con este enfoque, puedes especificar `--configLoader runner` para usar el [módulo runner](/guide/api-environment-runtimes.html#modulerunner) en su lugar, el cual no creará un archivo de configuración temporal y transformará los archivos sobre la marcha. Ten en cuenta que el módulo runner no admite CJS en archivos de configuración, pero los paquetes CJS externos deberían funcionar con normalidad.

Alternativamente, si utilizas un entorno que admite TypeScript (por ejemplo, `node --experimental-strip-types`), o si solo escribes JavaScript puro, puedes especificar `--configLoader native` para usar el runtime nativo del entorno para cargar el archivo de configuración. Sin embargo, las actualizaciones de los módulos importados por el archivo de configuración no se detectarán y, por lo tanto, no reiniciarán automáticamente el servidor de Vite.
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

Vite también es compatible con archivos de configuración de TypeScript. Puedes usar `vite.config.ts` con la función auxiliar `defineConfig` mencionada anteriormente, o con el operador `satisfies`:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Configuración condicional

Si la configuración necesita determinar condicionalmente las opciones basadas en el comando (`dev`/`serve` o `build`), el [modo](/guide/env-and-mode#modes) que se está utilizando, si es una compilación SSR (`isSsrBuild`), o está previsualizando una compilación (`isPreview`), puedes exportar una función en su lugar:

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

## Utilizando Variables de Entorno en Configuración

Las variables de entorno disponibles mientras la configuración se está evaluando son solo aquellas que ya existen en el entorno de proceso actual (`process.env`). Vite deliberadamente posterga la carga de cualquier archivo `.env*` hasta después de que la configuración del usuario se haya resuelto porque el conjunto de archivos a cargar depende de opciones como [`root`](/guide/#index-html-y-directorio-raiz-del-proyecto) y [`envDir`](/config/shared-options.md#envdir), y también finalmente, el `mode`.

Esto significa: las variables definidas en `.env`, `.env.local`, `.env.[mode]` y `.env.[mode].local` **no** se inyectan automáticamente en `process.env` mientras la configuración de `vite.config.*` se está ejecutando. Se cargan automáticamente más tarde y se exponen a través de `import.meta.env` (con el filtro de prefijo `VITE_` predeterminado) exactamente como se documenta en [Variables de Entorno y Modos](/guide/env-and-mode.html). Por lo tanto, si solo necesitas pasar valores de los archivos `.env*` a la aplicación, no necesitas llamar a nada en la configuración.

Si, sin embargo, los valores de los archivos `.env*` deben influir en la configuración en sí (por ejemplo, para configurar `server.port`, habilitar plugins de forma condicional o calcular reemplazos `define`), puedes cargarlos manualmente utilizando el ayudante exportado [`loadEnv`](/guide/api-javascript.html#loadenv).

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Carga el archivo env basado en el `mode` en el directorio de trabajo actual.
  // Configura el tercer parámetro como '' para cargar todas las variables de entorno sin importar el prefijo
  // `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // Proporciona una constante de nivel de aplicación explícita derivada de una variable de entorno.
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // Ejemplo: configura el puerto del servidor de desarrollo condicionalmente.
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```

## Depuración del Archivo de Configuración en VS Code

Con el comportamiento por defecto `--configLoader bundle`, Vite escribe el archivo de configuración temporal generado en la carpeta `node_modules/.vite-temp`, y se producirá un error de archivo no encontrado al establecer un punto de interrupción para depurar el archivo de configuración de Vite. Para solucionar este problema, agrega la siguiente configuración en `.vscode/settings.json`:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
