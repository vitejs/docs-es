# Opciones de servidor

## server.host

- **Tipo:** `string | boolean`
- **Por defecto:** `'localhost'`

  Especifica en qué direcciones IP debe escuchar el servidor.
  Configuralo en `0.0.0.0` o `true` para escuchar en todas las direcciones, incluidas las LAN y las direcciones públicas.

  Esto se puede configurar a través de la CLI usando `--host 0.0.0.0` o `--host`.

## server.port

- **Tipo:** `number`
- **Por defecto:** `5173`

  Especifica el puerto del servidor. Ten en cuenta que si el puerto ya se está utilizando, Vite probará automáticamente el siguiente puerto disponible, por lo que es posible que este no sea el puerto real en el que el servidor terminará escuchando.

## server.strictPort

- **Tipo:** `boolean`

  Colocalo en `true` para finalizar si el puerto ya está en uso, en lugar de probar automáticamente el siguiente puerto disponible.

## server.https

- **Tipo:** `boolean | https.ServerOptions`

  Habilita TLS + HTTP/2. Ten en cuenta que esto cambia a TLS solo cuando también se usa la opción [`server.proxy`](#server-proxy).

  El valor también puede ser un [objeto de opciones](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) pasado a `https.createServer()`.

## server.open

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

## server.proxy

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

## server.cors

- **Tipo:** `boolean | CorsOptions`

  Configura las CORS para el servidor de desarrollo. Esto está habilitado por defecto y permite cualquier origen. Pase un [objeto de opciones](https://github.com/expressjs/cors) para ajustar el comportamiento o `false` para deshabilitarlo.

## server.headers

- **Tipo:** `OutgoingHttpHeaders`

  Especifica los encabezados de respuesta del servidor.

## server.force

- **Tipo:** `boolean`
- **Relacionado:** [Preempaquetado de dependencias](/guide/dep-pre-bundling)

  Colocalo en `true` para forzar el preempaquetado de dependencias.

## server.hmr

- **Tipo:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

  Deshabilita o configura la conexión HMR (en los casos en que el websocket HMR deba usar una dirección diferente del servidor http).

  Coloca `server.hmr.overlay` en `false` para deshabilitar la superposición de errores del servidor.

  `clientPort` es una opción avanzada que sobreescribe el puerto solo en el lado del cliente, lo que le permite servir el websocket en un puerto diferente al que busca el código del cliente. Es útil si estás utilizando un proxy SSL frente a tu servidor de desarrollo.

  Si configuras `server.hmr.server`, Vite procesará las solicitudes de conexión HMR a través del servidor provisto. Si no está en modo middleware, Vite intentará procesar las solicitudes de conexión HMR a través del servidor existente. Esto puede ser útil cuando se usan certificados autofirmados o cuando deseas exponer Vite a través de una red en un solo puerto.

## server.watch

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

## server.middlewareMode

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

## server.base

- **Tipo:** `string | undefined`

  Antepone esta carpeta a las solicitudes http, para usar cuando se haga proxy de vite como una subcarpeta. Debe comenzar y terminar con el carácter `/`.

## server.fs.strict

- **Tipo:** `boolean`
- **Por defecto:** `true` (habilitado por defecto desde Vite 2.7)

  Restringe el servicio de archivos fuera de la raíz del espacio de trabajo.

## server.fs.allow

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

## server.fs.deny

- **Tipo:** `string[]`

  Lista de bloqueo para archivos sensibles que están restringidos para ser servidos por el servidor de desarrollo de Vite.

  Por defecto a `['.env', '.env.*', '*.{pem,crt}']`.

## server.origin

- **Tipo:** `string`

Define el origen de las URL de recursos generadas durante el desarrollo.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```