---
title: Configurando Vite
---

# Configurando Vite

## Archivo de configuración

### Resolución del archivo de configuración

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
Vite reemplazará `__filename`, `__dirname` y `import.meta.url` en los archivos de configuración y sus dependencias. El uso de estos como nombres de variables o pasar un string con comillas dobles como parámetro de una función (por ejemplo, `console.log()`) dará como resultado un error:

```js
const __filename = "value"
// será tranformado a
const "path/vite.config.js" = "value"

console.log("import.meta.url") // ocurre un error en compilación.
```

:::

### Configuración de Intellisense

Dado que Vite se distribuye con tipados de TypeScript, puedes aprovechar el intellisense de tu IDE con sugerencias de tipo jsdoc:

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

Alternativamente, puedes usar el helper `defineConfig` que debería proporcionar intellisense sin necesidad de anotaciones jsdoc:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite también es compatible directamente con los archivos de configuración de TypeScript. También puedes usar `vite.config.ts` con el helper `defineConfig`.

### Configuración condicional

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

### Configuración de funciones asíncronas

Si la configuración necesita llamar a una función asíncrona, puedes exportar una función asíncrona en su lugar:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuración de vite
  }
})
```

### Variables de entorno

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

## Opciones compartidas

### root

- **Tipo:** `string`
- **Por defecto:** `process.cwd()`

  Directorio raíz del proyecto (donde se encuentra `index.html`). Puede ser una ruta absoluta o una ruta relativa a la ubicación del propio archivo de configuración.

  Consulta [Raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto) para obtener más detalles.

### base

- **Tipo:** `string`
- **Por defecto:** `/`

  Ruta pública base cuando se sirve en desarrollo o producción. Los valores válidos incluyen:

  - Nombre de ruta absoluta URL, ejemplo, `/foo/`
  - URL completa, ejemplo, `https://foo.com/`
  - Cadena vacía o `./` (para implementación incrustada)

  Consulta [Ruta base pública](/guide/build#ruta-base-publica) para obtener más detalles.

### mode

- **Tipo:** `string`
- **Por defecto:** `'development'` para serve, `'production'` para build

  Especificar esto en la configuración sobreescribe el modo predeterminado para **serve y build**. Este valor también se puede sobreescribir a través de la opción `--mode` de la línea de comando.

  Consulta [Modos y variables de entorno](/guide/env-and-mode) para obtener más detalles.

### define

- **Tipo:** `Record<string, string>`

  Define constantes globales de reemplazo. Las entradas se definirán como globales durante el desarrollo y se reemplazarán estáticamente durante la compilación.

  - A partir de `2.0.0-beta.70`, los valores de cadena se utilizarán como expresiones sin procesar, por lo que si se define una constante de cadena, debe citarse explícitamente (por ejemplo, con `JSON.stringify`).

  - Para ser coherente con el [comportamiento de esbuild](https://esbuild.github.io/api/#define), las expresiones deben ser un objeto JSON (nulo, booleano, número, cadena, array u object) o un solo identificador.

  - Los reemplazos se realizan solo cuando la coincidencia no está rodeada por otras letras, números, `_` o `$`

  ::: warning
  Debido a que esto se implementa como reemplazos de texto sencillos sin ningún análisis de sintaxis, recomendamos usar `define` solo para CONSTANTES.

  Por ejemplo, `process.env.FOO` y `__APP_VERSION__` encajan bien. Pero `process` o `global` no se debe poner en esta opción. En su lugar, las variables se pueden ajustar o polyfill-arse.
  :::

  ::: tip NOTA
  Para los usuarios de TypeScript, asegúrense de agregar las declaraciones de tipo en el archivo `env.d.ts` o `vite-env.d.ts` para obtener comprobaciones de tipos e Intellisense.

  Ejemplo:

  ```ts
  // vite-env.d.ts
  declare const __APP_VERSION__: string
  ```

  :::

  ::: tip NOTA
  Dado que dev y build implementan `define` de manera diferente, debemos evitar algunos casos de uso para evitar inconsistencias.

  Ejemplo:

  ```js
  const obj = {
    __NAME__, // No definir nombres de propiedades de objetos abreviadas
    __KEY__: value // No definir clave de objeto
  }
  ```

  :::

### plugins

- **Tipo:** `(Plugin | Plugin[])[]`

  Array de complementos a usar. Los complementos falsos se ignoran y los arrays de complementos se simplifican. Consulta la [API de complementos](/guide/api-plugin) para obtener más detalles sobre los complementos de Vite.

### publicDir

- **Tipo:** `string | false`
- **Por defecto:** `"public"`

  Directorio para servir recursos estáticos simples. Los archivos en este directorio se sirven en `/` durante el desarrollo y se copian en la raíz de `outDir` durante la compilación, y siempre se sirven o copian tal cual sin transformación. El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto.

  Definir `publicDir` como `false` deshabilita esta característica.

  Consulta [La carpeta `public`](/guide/assets#la-carpeta-public) para obtener más detalles.

### cacheDir

- **Tipo:** `string`
- **Por defecto:** `"node_modules/.vite"`

  Directorio para guardar archivos de caché. Los archivos en este directorio son dependencias preempaquetadas o algunos otros archivos de caché generados por vite, que pueden mejorar el rendimiento. Puedes usar el indicador `--force` o eliminar manualmente el directorio para regenerar los archivos de caché. El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto. Por defecto a `.vite` cuando no se detecta ningún package.json.

### resolve.alias

- **Tipo:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

  Se pasará a `@rollup/plugin-alias` como su [opción de entradas](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Puede ser un objeto o un array de pares `{find, replacement, customResolver}`.

  Cuando crees alias en las rutas del sistema de archivos, utiliza siempre rutas absolutas. Los valores de alias relativos se utilizarán tal cual y no se resolverán en rutas del sistema de archivos.

  Se puede lograr una resolución personalizada más avanzada a través de [complementos](/guide/api-plugin).

### resolve.dedupe

- **Tipo:** `string[]`

  Si tienes copias duplicadas de la misma dependencia en tu aplicación (probablemente debido a hoisting o paquetes vinculados en monorepos), usa esta opción para obligar a Vite a resolver siempre las dependencias enumeradas en la misma copia (desde la raíz del proyecto).

  :::warning SSR + ESM
  Para compilaciones de SSR, la deduplicación no funciona para las salidas de compilación de ESM configuradas desde `build.rollupOptions.output`. Una solución consiste en utilizar las salidas de compilación de CJS hasta que ESM tenga una mejor compatibilidad con complementos para la carga de módulos.
  :::

### resolve.conditions

- **Tipo:** `string[]`

  Condiciones adicionales permitidas al resolver las [exportaciones condicionales](https://nodejs.org/api/packages.html#packages_conditional_exports) desde un paquete.

  Un paquete con exportaciones condicionales puede tener el siguiente campo `exports` en su `package.json`:

  ```json
  {
    "exports": {
      ".": {
        "import": "./index.esm.js",
        "require": "./index.cjs.js"
      }
    }
  }
  ```

  Aquí, `import` y `require` son "condiciones". Las condiciones se pueden anidar y deben especificarse de la más a la menos específica.

  Vite tiene una lista de "condiciones permitidas" y coincidirá con la primera condición que está en la lista permitida. Las condiciones permitidas por defecto son: `import`, `module`, `browser`, `default` y `production/development` dependiendo del modo actual. La opción de configuración `resolve.conditions` permite especificar condiciones adicionales permitidas.

  :::warning Resolviendo exportaciones de rutas secundarias
  Las claves de exportación que terminan en "/" están obsoletas en Node y es posible que no funcionen bien. Comunícate con el autor del paquete para usar [patrones de subruta `*`](https://nodejs.org/api/packages.html#package-entry-points) en su lugar.
  :::

### resolve.mainFields

- **Tipo:** `string[]`
- **Por defecto:** `['module', 'jsnext:main', 'jsnext']`

  Lista de campos en `package.json` para probar al resolver el punto de entrada de un paquete. Ten en cuenta que esto tiene menos prioridad que las exportaciones condicionales resueltas desde el campo `exports`: si un punto de entrada se resuelve con éxito desde `exports`, el campo principal se ignorará.

### resolve.extensions

- **Tipo:** `string[]`
- **Por defecto:** `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

  Lista de extensiones de archivo para probar las importaciones que omiten extensiones. Ten en cuenta que **NO** se recomienda omitir extensiones para tipos de importación personalizados (p. ej., `.vue`), ya que puede interferir con el IDE y la compatibilidad de tipos.

### resolve.preserveSymlinks

- **Tipo:** `boolean`
- **Por defecto:** `false`

  Habilitar esta configuración hace que vite determine la identidad del archivo por la ruta del archivo original (es decir, la ruta sin seguir los enlaces simbólicos) en lugar de la ruta real del archivo (es decir, la ruta después de seguir los enlaces simbólicos).

- **Relacionado:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

### css.modules

- **Tipo:**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: null
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | null
  }
  ```

  Configura el comportamiento de los módulos CSS. Las opciones se pasan a [postcss-modules](https://github.com/css-modules/postcss-modules).

### css.postcss

- **Tipo:** `string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })`

  Configuración de PostCSS inline o un directorio personalizado para buscar la configuración de PostCSS (el valor predeterminado es la raíz del proyecto).

  Para la configuración de PostCSS inline, espera el mismo formato que `postcss.config.js`. Pero para la propiedad `plugins`, solo se puede usar [formato de array](https://github.com/postcss/postcss-load-config/blob/main/README.md#array).

  La búsqueda se realiza mediante [postcss-load-config](https://github.com/postcss/postcss-load-config) y solo se cargan los nombres de archivos de configuración admitidos.

  Ten en cuenta que si se proporciona una configuración inline, Vite no buscará otras fuentes de configuración de PostCSS.

### css.preprocessorOptions

- **Tipo:** `Record<string, object>`

  Especifica las opciones a pasar a los preprocesadores de CSS. Las extensiones de archivo se utilizan como claves para las opciones. Ejemplo:

  ```js
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        },
        styl: {
          additionalData: `$injectedColor ?= orange`
        }
      }
    }
  })
  ```

### css.devSourcemap

- **Experimental**
- **Tipo:** `boolean`
- **Por defecto:** `false`

  Habilita los mapas de origen durante el desarrollo.

### json.namedExports

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Admite importaciones con nombre desde archivos `.json`.

### json.stringify

- **Tipo:** `boolean`
- **Por defecto:** `false`

  Si se coloca en `true`, el JSON importado se transformará en `export default JSON.parse("...")`, que tiene un rendimiento significativamente mayor que los objetos literales, especialmente cuando el archivo JSON es grande.

  Habilitar esto deshabilita las importaciones con nombre.

### esbuild

- **Tipo:** `ESBuildOptions | false`

  `ESBuildOptions` amplía [las opciones de transformación propias de esbuild](https://esbuild.github.io/api/#transform-api). El caso de uso más común es personalizar JSX:

  ```js
  export default defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  })
  ```

  De forma predeterminada, esbuild se aplica a los archivos `ts`, `jsx` y `tsx`. Puedes personalizar esto con `esbuild.include` y `esbuild.exclude`, que pueden ser una expresión regular, un patrón [picomatch](https://github.com/micromatch/picomatch#globbing-features) o una array de cualquier valor.

  Además, también puedes usar `esbuild.jsxInject` para inyectar automáticamente importaciones auxiliares de JSX para cada archivo transformado por esbuild:

  ```js
  export default defineConfig({
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
  ```

  Colocarlo en `false` deshabilita las transformaciones de esbuild.

### assetsInclude

- **Tipo:** `string | RegExp | (string | RegExp)[]`
- **Relacionado:** [Gestión de recursos estáticos](/guide/assets)

  Especifica [patrones de picomatch](https://github.com/micromatch/picomatch#globbing-features) adicionales para ser tratados como recursos estáticos para que:

  - Sean excluidos de la canalización de transformación del complemento cuando se haga referencia a ellos desde HTML o se soliciten directamente a través de `fetch` o XHR.

  - Importarlos desde JS devolverá su cadena de URL resuelta (esto se puede sobrescribir si tiene un complemento `enforce: 'pre'` para manejar el tipo de recursos de manera diferente).

  La lista de tipos de recursos integrados se puede encontrar [aquí](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

  **Ejemplo:**

  ```js
  export default defineConfig({
    assetsInclude: ['**/*.gltf']
  })
  ```

### logLevel

- **Tipo:** `'info' | 'warn' | 'error' | 'silent'`

  Ajusta la verbosidad de salida de la consola. Por defecto es `'info'`.

### clearScreen

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Colocalo en `false` para evitar que Vite borre la pantalla del terminal al registrar ciertos mensajes. A través de la línea de comandos, usa `--clearScreen false`.

### envDir

- **Tipo:** `string`
- **Por defecto:** `root`

  El directorio desde el que se cargan los archivos `.env`. Puede ser una ruta absoluta o una ruta relativa a la raíz del proyecto.

  Entra [aquí](/guide/env-and-mode#archivos-env) para obtener más información sobre los archivos de entorno.

### envPrefix

- **Tipo:** `string | string[]`
- **Por defecto:** `VITE_`

  Las variables de entorno que comienzan con `envPrefix` se expondrán al código fuente de tu cliente a través de import.meta.env.

  :::warning NOTAS DE SEGURIDAD
  `envPrefix` no debe establecerse como `''`, lo que expondrá todas tus variables env y provocará una filtración inesperada de información confidencial. Vite arrojará un error al detectar `''`.
  :::

## Opciones de server

### server.host

- **Tipo:** `string | boolean`
- **Por defecto:** `'127.0.0.1'`

  Especifica en qué direcciones IP debe escuchar el servidor.
  Configuralo en `0.0.0.0` o `true` para escuchar en todas las direcciones, incluidas las LAN y las direcciones públicas.

  Esto se puede configurar a través de la CLI usando `--host 0.0.0.0` o `--host`.

### server.port

- **Tipo:** `number`
- **Por defecto:** `5173`

  Especifica el puerto del servidor. Ten en cuenta que si el puerto ya se está utilizando, Vite probará automáticamente el siguiente puerto disponible, por lo que es posible que este no sea el puerto real en el que el servidor terminará escuchando.

### server.strictPort

- **Tipo:** `boolean`

  Colocalo en `true` para finalizar si el puerto ya está en uso, en lugar de probar automáticamente el siguiente puerto disponible.

### server.https

- **Tipo:** `boolean | https.ServerOptions`

  Habilita TLS + HTTP/2. Ten en cuenta que esto cambia a TLS solo cuando también se usa la opción [`server.proxy`](#server-proxy).

  El valor también puede ser un [objeto de opciones](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) pasado a `https.createServer()`.

### server.open

- **Tipo:** `boolean | string`

  Abre automáticamente la aplicación en el navegador al iniciar el servidor. Cuando el valor es una cadena, se utilizará como nombre de ruta de la URL. Si deseas abrir el servidor en un navegador específico, puedes configurar `process.env.BROWSER` (por ejemplo, `firefox`). Consulta [el paquete `open`](https://github.com/sindresorhus/open#app) para obtener más detalles.

  **Ejemplo:**

  ```js
  export default defineConfig({
    server: {
      open: '/docs/index.html'
    }
  })
  ```

### server.proxy

- **Tipo:** `Record<string, string | ProxyOptions>`

  Configura reglas de proxy personalizadas para el servidor de desarrollo. Espera un objeto de `{ key: options }` pares. Si la clave comienza con `^`, se interpretará como `RegExp`. La opción `configure` se puede utilizar para acceder a la instancia del proxy.

  Usa [`http-proxy`](https://github.com/http-party/node-http-proxy). Todas las opciones [aquí](https://github.com/http-party/node-http-proxy#options).

  En algunos casos, es posible que también desees configurar el servidor de desarrollo relacionado (por ejemplo, para agregar middlewares personalizados a la aplicación interna [connect](https://github.com/senchalabs/connect)). Para hacerlo, debes escribir tu propio [complemento](/guide/using-plugins.html) y usar la función [configureServer](/guide/api-plugin.html#configureserver).

  **Ejemplo:**

  ```js
  export default defineConfig({
    server: {
      proxy: {
        // string shorthand
        '/foo': 'http://localhost:4567',
        // con opciones
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // con RegEx
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, '')
        },
        // Usando la instancia de proxy
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy será una instancia de 'http-proxy'
          }
        },
        // Haciendo proxy de websockets o socket.io
        '/socket.io': {
          target: 'ws://localhost:5173',
          ws: true
        }
      }
    }
  })
  ```

### server.cors

- **Tipo:** `boolean | CorsOptions`

  Configura las CORS para el servidor de desarrollo. Esto está habilitado por defecto y permite cualquier origen. Pase un [objeto de opciones](https://github.com/expressjs/cors) para ajustar el comportamiento o `false` para deshabilitarlo.

### server.headers

- **Tipo:** `OutgoingHttpHeaders`

  Especifica los encabezados de respuesta del servidor.

### server.force

- **Tipo:** `boolean`
- **Relacionado:** [Preempaquetado de dependencias](/guide/dep-pre-bundling)

  Colocalo en `true` para forzar el preempaquetado de dependencias.

### server.hmr

- **Tipo:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

  Deshabilita o configura la conexión HMR (en los casos en que el websocket HMR deba usar una dirección diferente del servidor http).

  Coloca `server.hmr.overlay` en `false` para deshabilitar la superposición de errores del servidor.

  `clientPort` es una opción avanzada que sobreescribe el puerto solo en el lado del cliente, lo que le permite servir el websocket en un puerto diferente al que busca el código del cliente. Es útil si estás utilizando un proxy SSL frente a tu servidor de desarrollo.

  Si configuras `server.hmr.server`, Vite procesará las solicitudes de conexión HMR a través del servidor provisto. Si no está en modo middleware, Vite intentará procesar las solicitudes de conexión HMR a través del servidor existente. Esto puede ser útil cuando se usan certificados autofirmados o cuando deseas exponer Vite a través de una red en un solo puerto.

### server.watch

- **Tipo:** `object`

  Opciones para el observador del sistema de archivos que serán pasados a [chokidar](https://github.com/paulmillr/chokidar#api).

  Al ejecutar Vite en el subsistema de Windows para Linux (WSL) 2, si la carpeta del proyecto reside en un sistema de archivos de Windows, deberá configurar esta opción en `{ usePolling: true }`. Esto se debe a [una limitación de WSL2](https://github.com/microsoft/WSL/issues/4739) con el sistema de archivos de Windows.

  El observador del servidor Vite omite los directorios `.git/` y `node_modules/` de forma predeterminada. Si deseas ver un paquete dentro de `node_modules/`, puede pasar un patrón global negado a `server.watch.ignored`. Es decir:

  ```js
  export default defineConfig({
    server: {
      watch: {
        ignored: ['!**/node_modules/your-package-name/**']
      }
    },
    // El paquete observado debe excluirse de la optimización,
    // para que pueda aparecer en el gráfico de dependencia y activar hot reload.
    optimizeDeps: {
      exclude: ['your-package-name']
    }
  })
  ```

### server.middlewareMode

- **Tipo:** `'ssr' | 'html'`

  Crea un servidor Vite en modo middleware (sin un servidor HTTP)

  - `'ssr'` deshabilitará la propia lógica de servicio de HTML de Vite para que sirvas `index.html` manualmente.
  - `'html'` habilitará la propia lógica de servicio HTML de Vite.

- **Relacionado:** [SSR - Configuración del servidor de desarrollo](/guide/ssr#configuracion-del-servidor-de-desarrollo)

- **Ejemplo:**

```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // Crea servidor Vite en modo middleware
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // Usa la instancia de conexión de vite como middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Si `middlewareMode` es `'ssr'`, debería servir `index.html` aquí.
    // Si `middlewareMode` es `'html'`, no hay necesidad de servir `index.html`
    // porque Vite lo hará.
  })
}

createServer()
```

### server.base

- **Tipo:** `string | undefined`

  Antepone esta carpeta a las solicitudes http, para usar cuando se haga proxy de vite como una subcarpeta. Debe comenzar y terminar con el carácter `/`.

### server.fs.strict

- **Tipo:** `boolean`
- **Por defecto:** `true` (habilitado por defecto desde Vite 2.7)

  Restringe el servicio de archivos fuera de la raíz del espacio de trabajo.

### server.fs.allow

- **Tipo:** `string[]`

  Restringe los archivos que podrían servirse a través de `/@fs/`. Cuando `server.fs.strict` se coloca en `true`, el acceso a archivos fuera de esta lista de directorios que no se importaron de un archivo permitido resultará en un 403.

  Vite buscará la raíz del potencial espacio de trabajo y la usará por defecto. Un espacio de trabajo válido cumple con las siguientes condiciones; de lo contrario, se recurrirá a la [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto).

  - contiene el campo `workspaces` en `package.json`
  - contiene uno de los siguientes archivos
    - `pnpm-workspace.yaml`

  Acepta una ruta para especificar la raíz del espacio de trabajo personalizado. Podría ser una ruta absoluta o una ruta relativa a la [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto). Por ejemplo:

  ```js
  export default defineConfig({
    server: {
      fs: {
        // Permitir servir archivos desde un nivel hasta la raíz del proyecto
        allow: ['..']
      }
    }
  })
  ```

  Cuando se especifica `server.fs.allow`, la detección automática de la raíz del espacio de trabajo se desactivará. Para ampliar el comportamiento original, se expone una utilidad `searchForWorkspaceRoot`:

  ```js
  import { defineConfig, searchForWorkspaceRoot } from 'vite'

  export default defineConfig({
    server: {
      fs: {
        allow: [
          // busca la raíz del espacio de trabajo
          searchForWorkspaceRoot(process.cwd()),
          // tus reglas personalizadas
          '/path/to/custom/allow'
        ]
      }
    }
  })
  ```

### server.fs.deny

- **Tipo:** `string[]`

  Lista de bloqueo para archivos sensibles que están restringidos para ser servidos por el servidor de desarrollo de Vite.

  Por defecto a `['.env', '.env.*', '*.{pem,crt}']`.

### server.origin

- **Tipo:** `string`

Define el origen de las URL de recursos generadas durante el desarrollo.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```

## Opciones de build

### build.target

- **Tipo:** `string | string[]`
- **Por defecto:** `'modules'`
- **Relacionado:** [Compatibilidad de navegadores](/guide/build#compatibilidad-de-navegadores)

  El objetivo de compatibilidad del navegador para el paquete final. El valor predeterminado es un valor especial de Vite, `'modules'`, que apunta a navegadores con [soporte de módulos ES nativo](https://caniuse.com/es6-module) y [soporte de importación ESM nativo](https://caniuse.com/es6-module-dynamic-import).

  Otro valor especial es `'esnext'`, el cual asume el soporte nativo de importaciones dinámicas y transpilará lo menos posible:

  - Si la opción [`build.minify`](#build-minify) es `'terser'`, `'esnext'` se verá obligado a bajar a `'es2021'`.
  - En otros casos, no realizará ninguna transpilación.

  La transformación se realiza con esbuild y el valor debe ser una [opción de destino de esbuild](https://esbuild.github.io/api/#target) válida. Los objetivos personalizados pueden ser una versión ES (por ejemplo, `es2015`), un navegador con versión (por ejemplo, `chrome58`) o un array de varias cadenas de destino.

  Ten en cuenta que la compilación fallará si el código contiene funciones que esbuild no puede transpilar de manera segura. Consulta la [documentación de esbuild](https://esbuild.github.io/content-types/#javascript) para obtener más detalles.

### build.polyfillModulePreload

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Inyecta automáticamente el [polyfill de precarga del módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

  Si se coloca en `true`, el polyfill se inyecta automáticamente en el módulo proxy de cada entrada `index.html`. Si la compilación está configurada para usar una entrada personalizada que no sea html a través de `build.rollupOptions.input`, entonces es necesario importar manualmente el polyfill en su entrada personalizada:

  ```js
  import 'vite/modulepreload-polyfill'
  ```

  Nota: el polyfill **no** se aplica al [Modo Librería](/guide/build#modo-libreria). Si necesitas que se soporten navegadores sin importación dinámica nativa, probablemente deberías evitar usarlo en tu librería.

### build.outDir

- **Tipo:** `string`
- **Por defecto:** `dist`

  Especifica el directorio de salida (relativo a [raíz del proyecto](/guide/#index-html-y-raiz-del-proyecto)).

### build.assetsDir

- **Tipo:** `string`
- **Por defecto:** `assets`

  Especifica el directorio en el que se alojarán los recursos generados (en relación con `build.outDir`).

### build.assetsInlineLimit

- **Tipo:** `number`
- **Por defecto:** `4096` (4kb)

  Los recursos importados o a los que se hace referencia que son más pequeños que este umbral se insertarán como URL base64 para evitar solicitudes http adicionales. Configurar en `0` para deshabilitar la inserción por completo.

  ::: tip Nota
  Si especificas `build.lib`, `build.assetsInlineLimit` se ignorará y los recursos siempre serán insertados, independientemente del tamaño del archivo.
  :::

### build.cssCodeSplit

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Habilita/deshabilita la división de código CSS. Cuando está habilitado, el CSS importado en fragmentos asíncronos se insertará en el propio fragmento asíncrono y cuando se cargue el fragmento.

  Si está deshabilitado, todo el CSS de todo el proyecto se extraerá en un único archivo CSS.

  ::: tip Nota
  Si especificas `build.lib`, `build.cssCodeSplit` será `false` por defecto.
  :::

### build.cssTarget

- **Tipo:** `string | string[]`
- **Por defecto:** Igual que [`build.target`](/config/#build-target)

  Esta opción permite a los usuarios configurar un destino de navegador diferente para la minificación de CSS del que se usa normalmente para la transpilación de JavaScript.

  Solo debe usarse cuando se dirige a un navegador no convencional.
  Un ejemplo es WeChat WebView de Android, que es compatible con la mayoría de las funciones modernas de JavaScript, pero no con la [notación de color hexadecimal `#RGBA` en CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#colores_rgb).
  En este caso, debes configurar `build.cssTarget` en `chrome61` para evitar que vite transforme los colores `rgba()` en notaciones hexadecimales `#RGBA`.

### build.sourcemap

- **Tipo:** `boolean | 'inline' | 'hidden'`
- **Por defecto:** `false`

  Genera mapas de fuentes de producción. Si es `true`, se creará un archivo de mapa fuente independiente. Si es `'inline'`, el mapa fuente se agregará al archivo de salida resultante como un URI de datos. `'hidden'` funciona como `true` excepto que se suprimen los comentarios del mapa fuente correspondiente en los archivos incluidos.

### build.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Personaliza directamente el paquete Rollup relacionado. Esto es lo mismo que las opciones que se pueden exportar desde un archivo de configuración de Rollup y se fusionarán con las opciones de Rollup internas de Vite. Consulta la [documentación de opciones de Rollup](https://rollupjs.org/guide/en/#big-list-of-options) para obtener más detalles.

### build.commonjsOptions

- **Tipo:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  Opciones para [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

### build.dynamicImportVarsOptions

- **Tipo:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Relacionado:** [Importado dinámico](/guide/features#importacion-dinamica)

  Opciones para [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

### build.lib

- **Tipo:** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat) => string) }`
- **Relacionado:** [Modo Librería](/guide/build#modo-libreria)

  Compilar como una librería. Se requiere `entry` ya que la librería no puede usar HTML como entrada. `name` es la variable global expuesta y se requiere cuando `formats` incluye `'umd'` o `'iife'`. Por defecto los `formats` son `['es', 'umd']`. `fileName` es el nombre de la salida del archivo del paquete, por defecto `fileName` es la opción de nombre del package.json, también se puede definir como una función que toma el `format` como argumento.

### build.manifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Integración del backend](/guide/backend-integration)

  Cuando se coloca en `true`, la compilación también generará un archivo `manifest.json` que contiene una asignación de nombres de archivo de recursos sin hash a sus versiones hash, que luego puede ser utilizado por un marco de trabajo orientado a servidor para representar los enlaces de recursos correctos.

### build.ssrManifest

- **Tipo:** `boolean`
- **Por defecto:** `false`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

  Cuando se coloca en `true`, la compilación también generará un manifiesto SSR para determinar los enlaces de estilo y las directivas de precarga de recursos en producción.

### build.ssr

- **Tipo:** `boolean | string`
- **Por defecto:** `undefined`
- **Relacionado:** [Server-Side Rendering](/guide/ssr)

  Produce la compilación orientada a SSR. El valor puede ser una cadena para especificar directamente la entrada SSR, o `true`, que requiere especificar la entrada SSR a través de `rollupOptions.input`.

### build.minify

- **Tipo:** `boolean | 'terser' | 'esbuild'`
- **Por defecto:** `'esbuild'`

  Configurar en `false` para deshabilitar la minificación, o especificar el minificador que se usará. El valor predeterminado es [esbuild](https://github.com/evanw/esbuild), que es 20 ~ 40 veces más rápido que terser y solo 1 ~ 2 % peor en compresión. [Pruebas de rendimiento](https://github.com/privatenumber/minification-benchmarks)

  Ten en cuenta que la opción `build.minify` no está disponible cuando se usa el formato `'es'` en modo lib.

### build.terserOptions

- **Tipo:** `TerserOptions`

  [Opciones de minimización](https://terser.org/docs/api-reference#minify-options) adicionales para pasar a Terser.

### build.write

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Configurar en `false` para deshabilitar la escritura del paquete en el disco. Esto se usa principalmente en [llamadas `build()` programáticas](/guide/api-javascript#build) donde se necesita más procesamiento posterior del paquete antes de escribir en el disco.

### build.emptyOutDir

- **Tipo:** `boolean`
- **Por defecto:** `true` si `outDir` está en `root`

  De forma predeterminada, Vite vaciará `outDir` en la compilación si está dentro de la raíz del proyecto. Emitirá una advertencia si `outDir` está fuera de la raíz para evitar la eliminación accidental de archivos importantes. Puedes establecer explícitamente esta opción para suprimir la advertencia. Esto también está disponible a través de la línea de comandos como `--emptyOutDir`.

### build.reportCompressedSize

- **Tipo:** `boolean`
- **Por defecto:** `true`

  Habilita/deshabilita los informes de tamaño comprimido con gzip. La compresión de archivos de salida grandes puede ser lenta, por lo que deshabilitarla puede aumentar el rendimiento de la compilación para proyectos grandes.

### build.chunkSizeWarningLimit

- **Tipo:** `number`
- **Por defecto:** `500`

  Límite para advertencias de tamaño de fragmento (en kbs).

### build.watch

- **Tipo:** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **Por defecto:** `null`

  Configurar en `{}` para habilitar el observador de Rollup. Esto se usa principalmente en casos que involucran complementos de solo compilación o procesos de integración.

## Opciones de preview

### preview.host

- **Tipo:** `string | boolean`
- **Por defecto:** [`server.host`](#server_host)

  Especifica en qué direcciones IP debe escuchar el servidor.
  Configurar en `0.0.0.0` o `true` para escuchar en todas las direcciones, incluidas las LAN y las direcciones públicas.

  Esto se puede configurar a través de la CLI usando `--host 0.0.0.0` o `--host`.

### preview.port

- **Tipo:** `number`
- **Por defecto:** `4173`

  Especifica el puerto del servidor. Ten en cuenta que si el puerto ya se está utilizando, Vite probará automáticamente el siguiente puerto disponible, por lo que es posible que este no sea el puerto real en el que el servidor termina escuchando.

**Ejemplo:**

```js
export default defineConfig({
  server: {
    port: 3030
  },
  preview: {
    port: 8080
  }
})
```

### preview.strictPort

- **Tipo:** `boolean`
- **Por defecto:** [`server.strictPort`](#server_strictport)

  Configurar en `true` para salir si el puerto ya está en uso, en lugar de probar automáticamente el siguiente puerto disponible.

### preview.https

- **Tipo:** `boolean | https.ServerOptions`
- **Por defecto:** [`server.https`](#server_https)

  Habilita TLS + HTTP/2. Ten en cuenta que esto cambia a TLS solo cuando también se usa la opción [`server.proxy`](#server-proxy).

  El valor también puede ser un [objeto de opciones](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) pasado a `https.createServer()`.

### preview.open

- **Tipo:** `boolean | string`
- **Por defecto:** [`server.open`](#server_open)

  Abre automáticamente la aplicación en el navegador al iniciar el servidor. Cuando el valor es una cadena, se utilizará como nombre de ruta de la URL. Si deseas abrir el servidor en un navegador específico, puedes configurar `process.env.BROWSER` (por ejemplo, `firefox`). Consulta [el paquete `open`](https://github.com/sindresorhus/open#app) para obtener más detalles.

### preview.proxy

- **Tipo:** `Record<string, string | ProxyOptions>`
- **Por defecto:** [`server.proxy`](#server_proxy)

  Configura reglas de proxy personalizadas para el servidor de desarrollo. Espera un objeto de `{ key: options }` pares. Si la clave comienza con `^`, se interpretará como `RegExp`. La opción `configure` se puede utilizar para acceder a la instancia del proxy.

  Usa [`http-proxy`](https://github.com/http-party/node-http-proxy). Todas las opciones [aquí](https://github.com/http-party/node-http-proxy#options).

### preview.cors

- **Tipo:** `boolean | CorsOptions`
- **Por defecto:** [`server.cors`](#server_proxy)

  Configura las CORS para el servidor de desarrollo. Esto está habilitado por defecto y permite cualquier origen. Pase un [objeto de opciones](https://github.com/expressjs/cors) para ajustar el comportamiento o `false` para deshabilitarlo.

## Opciones de optimizeDeps

- **Relacionado:** [Preempaquetado de dependencias](/guide/dep-pre-bundling)

### optimizeDeps.entries

- **Tipo:** `string | string[]`

  De forma predeterminada, Vite rastreará todos sus archivos `.html` para detectar las dependencias que deben empaquetarse previamente (ignorando `node_modules`, `build.outDir`, `__tests__` y `coverage`). Si se especifica `build.rollupOptions.input`, Vite rastreará esos puntos de entrada en su lugar.

  Si ninguno de estos se ajusta a tus necesidades, puedes especificar entradas personalizadas con esta opción; el valor debe ser un [patrón fast-glob](https://github.com/mrmlnc/fast-glob#basic-syntax) o un array de patrones que son relativos a la raíz del proyecto Vite. Esto sobrescribirá la inferencia de entradas predeterminadas. Solo las carpetas `node_modules` y `build.outDir` se ignorarán de forma predeterminada cuando se defina explícitamente `optimizeDeps.entries`. Si es necesario ignorar otras carpetas, puedes usar un patrón de ignorado como parte de la lista de entradas, marcado con un '!' inicial.

### optimizeDeps.exclude

- **Tipo:** `string[]`

  Dependencias a excluir del preempaquetado.

  :::warning CommonJS
  Las dependencias CommonJS no deben excluirse de la optimización. Si una dependencia de ESM se excluye de la optimización, pero tiene una dependencia CommonJS anidada, la dependencia CommonJS debe agregarse a `optimizeDeps.include`. Ejemplo:

  ```js
  export default defineConfig({
    optimizeDeps: {
      include: ['esm-dep > cjs-dep']
    }
  })
  ```

  :::

### optimizeDeps.include

- **Tipo:** `string[]`

  De forma predeterminada, los paquetes vinculados que no están dentro de `node_modules` no están preempaquetados. Usa esta opción para forzar que un paquete vinculado se empaquete previamente.

### optimizeDeps.esbuildOptions

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

  Opciones para pasar a esbuild durante el escaneo y optimización de la dependencia.

  Se omiten ciertas opciones ya que cambiarlas no sería compatible con la optimización de la dependencia de Vite.

  - También se omite `external`, usa la opción `optimizeDeps.exclude` de Vite
  - `plugins` se fusionan con el complemento de dependencia de Vite

## SSR Options

:::warning Experimental
Las opciones de SSR pueden ajustarse en versiones menores.
:::

- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

### ssr.external

- **Tipo:** `string[]`

  Fuerza la externalización de dependencias para SSR.

### ssr.noExternal

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`

  Evita que las dependencias enumeradas se externalicen para SSR. Si es `true`, no se externalizan dependencias.

### ssr.target

- **Tipo:** `'node' | 'webworker'`
- **Por defecto:** `node`

  Destino de compilación para el servidor SSR.

## Opciones de Worker

### worker.format

- **Tipo:** `'es' | 'iife'`
- **Por defecto:** `iife`

  Formato de salida para el paquete de worker.

### worker.plugins

- **Tipo:** [`(Plugin | Plugin[])[]`](#plugins)

  Complementos de Vite que se aplican al paquete de worker

### worker.rollupOptions

- **Tipo:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Opciones de Rollup para crear un paquete de worker de compilación.
