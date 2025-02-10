# Opciones para server

A menos que se indique lo contrario, las opciones en esta sección solo se aplican a desarrollo.

## server.host

- **Tipo:** `string | boolean`
- **Por defecto:** `'localhost'`

  Especifica en qué direcciones IP debe escuchar el servidor.
  Configuralo en `0.0.0.0` o `true` para escuchar en todas las direcciones, incluidas las LAN y las direcciones públicas.

  Esto se puede configurar a través de la CLI usando `--host 0.0.0.0` o `--host`.

  :::tip NOTA

  Hay casos en los que otros servidores pueden responder en lugar de Vite.

  El primer caso es cuando se usa `localhost`. Node.js bajo v17 reordena el resultado de la dirección resuelta por DNS de forma predeterminada. Al acceder a `localhost`, los navegadores usan DNS para resolver la dirección y esa dirección puede diferir de la dirección que está escuchando Vite. Vite imprime en consola la dirección resuelta cuando difiere.

  Puedes configurar [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) para deshabilitar el comportamiento de reordenación. Vite luego imprimirá la dirección como `localhost`.

  ```js twoslash [vite.config.js]
  import { defineConfig } from 'vite'
  import dns from 'node:dns'
  dns.setDefaultResultOrder('verbatim')
  export default defineConfig({
    // omitido
  })
  ```

  El segundo caso es cuando se utilizan hosts comodín (por ejemplo, `0.0.0.0`). Esto se debe a que los servidores que escuchan en hosts que no son comodín tienen prioridad sobre los que escuchan en hosts comodín.

  :::

  ::: Consejo: Acceder al servidor en WSL2 desde tu LAN

Cuando ejecutas Vite en WSL2, no es suficiente configurar `host: true` para acceder al servidor desde tu LAN.
Consulta [el documento de WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) para más detalles.

:::

## server.allowedHosts

- **Tipo:** `string[] | true`
- **Por defecto:** `[]`

Los nombres de host a los que Vite tiene permitido responder.

Por defecto, `localhost`, los dominios bajo `.localhost` y todas las direcciones IP están permitidos.  
Cuando se usa HTTPS, esta verificación se omite.

Si una cadena comienza con `.`, permitirá ese nombre de host sin el `.` y todos los subdominios bajo él.  
Por ejemplo, `.example.com` permitirá `example.com`, `foo.example.com` y `foo.bar.example.com`.

Si se configura en `true`, el servidor podrá responder a solicitudes de cualquier host.  
Esto **no es recomendable**, ya que lo hace vulnerable a ataques de _DNS rebinding_.

## server.port

- **Tipo:** `number`
- **Por defecto:** `5173`

  Especifica el puerto del servidor. Ten en cuenta que si el puerto ya se está utilizando, Vite probará automáticamente el siguiente puerto disponible, por lo que es posible que este no sea el puerto real en el que el servidor terminará escuchando.

## server.strictPort

- **Tipo:** `boolean`

  Colocalo en `true` para finalizar si el puerto ya está en uso, en lugar de probar automáticamente el siguiente puerto disponible.

## server.https

- **Tipo:** `https.ServerOptions`

  Habilita TLS + HTTP/2. Ten en cuenta que esto cambia a TLS solo cuando también se usa la opción [`server.proxy`](#server-proxy).

  El valor también puede ser un [objeto de opciones](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) pasado a `https.createServer()`.

  Se necesita un certificado válido. Para una configuración básica, puedes agregar [@vite/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) a los plugins del proyecto, que crearán y almacenarán automáticamente un certificado autofirmado. Pero recomendamos crear tus propios certificados.

## server.open

- **Tipo:** `boolean | string`

  Abre automáticamente la aplicación en el navegador al iniciar el servidor. Cuando el valor es una cadena, se utilizará como nombre de ruta de la URL. Si deseas abrir el servidor en un navegador específico, puedes configurar `process.env.BROWSER` (por ejemplo, `firefox`). También puedes configurar `process.env.BROWSER_ARGS` para pasar argumentos adicionales (por ejemplo, `--incognito`).

  `BROWSER` y `BROWSER_ARGS` también son variables de entorno especiales que puedes colocar en el archivo `.env` para configurarlo. Consulta [el paquete `open`](https://github.com/sindresorhus/open#app) para obtener más detalles.

  **Ejemplo:**

  ```js
  export default defineConfig({
    server: {
      open: '/docs/index.html',
    },
  })
  ```

## server.proxy

- **Tipo:** `Record<string, string | ProxyOptions>`

  Configura reglas de proxy personalizadas para el servidor de desarrollo. Espera un objeto de pares `{ key: options }`. Cualquier solicitud cuya ruta de solicitud comience con esa clave se enviará a ese destino especificado. Si la clave comienza con `^`, se interpretará como `RegExp`. La opción `configure` se puede utilizar para acceder a la instancia del proxy. Si una solicitud coincide con alguna de las reglas de proxy configuradas, la solicitud no será transformada por Vite.

  Ten en cuenta que si estás utilizando una [`base`](/config/shared-options.md#base) no relativa, debes prefijar cada clave con esa `base`.

  Extiende [`http-proxy`](https://github.com/http-party/node-http-proxy#options). Las opciones adicionales están [aquí](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L12).

  En algunos casos, es posible que también desees configurar el servidor de desarrollo relacionado (por ejemplo, para agregar middlewares personalizados a la aplicación interna [connect](https://github.com/senchalabs/connect)). Para hacerlo, debes escribir tu propio [plugin](/guide/using-plugins.html) y usar la función [configureServer](/guide/api-plugin.html#configureserver).

  **Ejemplo:**

  ```js
  export default defineConfig({
    server: {
      proxy: {
        // abreviatura de cadena:
        // http://localhost:5173/foo
        //   -> http://localhost:4567/foo
        '/foo': 'http://localhost:4567',
        // con opciones:
        // http://localhost:5173/api/bar
        //   -> http://jsonplaceholder.typicode.com/bar

        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // con RegExp:

        // http://localhost:5173/fallback/
        //   -> http://jsonplaceholder.typicode.com/
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, ''),
        },
        // Usando la instancia de proxy
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy será una instancia de 'http-proxy'
          },
        },
        // Proxy de websockets o socket.io:

        // ws://localhost:5173/socket.io

        //   -> ws://localhost:5174/socket.io
        // Ten cuidado al usar `rewriteWsOrigin`, ya que puede dejar
        // el proxy abierto a ataques CSRF.
        '/socket.io': {
          target: 'ws://localhost:5173',
          ws: true,
          rewriteWsOrigin: true,
        },
      },
    },
  })
  ```

## server.cors

- **Tipo:** `boolean | CorsOptions`
- **Por defecto:** `{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }` (permite localhost, `127.0.0.1` y `::1`)

Configura CORS para el servidor de desarrollo. Pasa un [objeto de opciones](https://github.com/expressjs/cors#configuration-options) para ajustar el comportamiento o usa `true` para permitir cualquier origen.

:::warning  
Se recomienda establecer un valor específico en lugar de `true` para evitar exponer el código fuente a orígenes no confiables.  
:::

## server.headers

- **Tipo:** `OutgoingHttpHeaders`

  Especifica los encabezados de respuesta del servidor.

## server.hmr

- **Tipo:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Deshabilita o configura la conexión HMR (en los casos en que el websocket HMR deba usar una dirección diferente del servidor http).

Coloca `server.hmr.overlay` en `false` para deshabilitar la superposición de errores del servidor.

`protocol` establece el protocolo WebSocket utilizado para la conexión HMR: `ws` (WebSocket) o `wss` (WebSocket Seguro).

`clientPort` es una opción avanzada que sobreescribe el puerto solo en el lado del cliente, lo que le permite servir el websocket en un puerto diferente al que busca el código del cliente.

Cuando se define `server.hmr.server`, Vite procesará las solicitudes de conexión HMR a través del servidor provisto. Si no está en modo middleware, Vite intentará procesar las solicitudes de conexión HMR a través del servidor existente. Esto puede ser útil cuando se usan certificados autofirmados o cuando desea exponer a Vite a través de una red en un solo puerto.

Consulta [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) para ver algunos ejemplos.

:::tip NOTA

Con la configuración predeterminada, se espera que los proxies inversos frente a Vite admitan WebSocket de proxy. Si el cliente de Vite HMR no logra conectar WebSocket, el cliente recurrirá a conectar WebSocket directamente al servidor de Vite HMR sin pasar por los proxies inversos:

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
```

Se puede ignorar el error que aparece en el navegador cuando ocurre el fallback. Para evitar el error al omitir directamente los proxies inversos, podrías:

- configurar el proxy inverso para el proxy de WebSocket también
- configurar [`server.strictPort = true`](#server-strictport) y configurar `server.hmr.clientPort` con el mismo valor que `server.port`
- configurar `server.hmr.port` en un valor diferente de [`server.port`](#server-port)
  :::

## server.warmup

- **Tipo:** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **Relacionado:** [Preparación de archivos de uso frecuente](/guide/performance.html#preparacion-de-archivos-de-uso-frecuente)

Prepara archivos para transformarlos y almacenar en caché los resultados por adelantado. Esto mejora la carga de la página inicial durante el inicio del servidor y evita transformaciones en cascada.

`clientFiles` son archivos que se usan solo en el cliente, mientras que `ssrFiles` son archivos que se usan solo en SSR. Aceptan una variedad de rutas de archivos o patrones [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) relativos a `root`.

Asegúrate de agregar solo archivos que se usan con frecuencia para no sobrecargar el servidor de desarrollo de Vite al iniciar.

```js
export defineConfig default ({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **Tipo:** `object | null`

Opciones del observador del sistema de archivos que se pasan a [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api).

El observador del servidor Vite observa el `root` y omite los directorios `.git/`, `node_modules/`, y las carpetas de Vite `cacheDir` y `build.outDir` de forma predeterminada. Al actualizar un archivo observado, Vite aplicará HMR y actualizará la página solo si es necesario.

Si se configura en `null`, no se vigilarán archivos. `server.watcher` proporcionará un emisor de eventos compatible, pero llamar a `add` o `unwatch` no tendrá efecto.

::: warning Observando archivos en `node_modules`
Actualmente no es posible ver archivos y paquetes en `node_modules`. Para obtener más avances y soluciones alternativas, puede seguir la [propuesta #8619](https://github.com/vitejs/vite/issues/8619).
:::

::: warning Uso de Vite en el Subsistema de Windows para Linux (WSL) 2

Al ejecutar Vite en WSL2, la observación del sistema de archivos no funciona cuando un archivo es editado por aplicaciones de Windows (procesos no-WSL2). Esto se debe a [una limitación de WSL2](https://github.com/microsoft/WSL/issues/4739). Esto también se aplica a la ejecución en Docker con un backend de WSL2.

Para solucionarlo, podrías:

- **Recomendado**: Utilizar las aplicaciones WSL2 para editar tus archivos.
  - También se recomienda mover la carpeta del proyecto fuera del sistema de archivos de Windows. El acceso al sistema de archivos de Windows desde WSL2 es lento. Eliminar esa sobrecarga mejorará el rendimiento.
- Configura `{ usePolling: true }`.
  - Ten en cuenta que [`usePolling` conduce a un uso elevado de la CPU](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode

- **Tipo:** `boolean`
- **Por defecto:** `false`

  Crea un servidor Vite en modo middleware.

- **Relacionado:** [appType](./shared-options#apptype), [SSR - Configuración del servidor de desarrollo](/guide/ssr#configuracion-del-servidor-de-desarrollo)

- **Ejemplo:**

```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Crea servidor Vite en modo middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    // no incluir middlewares de manejo de HTML predeterminado de Vite
    appType: 'custom',
  })
  // Usa la instancia de conexión de vite como middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Dado que `appType` es `'custom'`, debería servir la respuesta aquí.
    // Nota: si `appType` es `'spa'` o `'mpa'`, Vite incluye middlewares
    // para manejar solicitudes HTML y 404, por lo que se deben agregar middlewares de usuario
    // antes de que los middlewares de Vite surtan efecto en su lugar
  })
}

createServer()
```

## server.fs.strict

- **Tipo:** `boolean`
- **Por defecto:** `true` (habilitado por defecto desde Vite 2.7)

  Restringe el servicio de archivos fuera de la raíz del espacio de trabajo.

## server.fs.allow

- **Tipo:** `string[]`

  Restringe los archivos que podrían servirse a través de `/@fs/`. Cuando `server.fs.strict` se coloca en `true`, el acceso a archivos fuera de esta lista de directorios que no se importaron de un archivo permitido resultará en un 403.

  Se pueden proporcionar tanto directorios como archivos.

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
        allow: ['..'],
      },
    },
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
          '/path/to/custom/allow_directory',
          '/path/to/custom/allow_file.demo',
        ],
      },
    },
  })
  ```

## server.fs.deny

- **Tipo:** `string[]`
- **Por defecto:** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

  Lista de bloqueo para archivos sensibles que están restringidos para ser servidos por el servidor de desarrollo de Vite. Esto tendrá mayor prioridad que [`server.fs.allow`](#server-fs-allow). Se admiten [patrones de picomatch](https://github.com/micromatch/picomatch#globbing-features).

## server.origin

- **Tipo:** `string`

  Define el origen de las URL de recursos generadas durante el desarrollo.

  ```js
  export default defineConfig({
    server: {
      origin: 'http://127.0.0.1:8080',
    },
  })
  ```

## server.sourcemapIgnoreList

- **Tipo:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **Por defecto:** `(sourcePath) => sourcePath.includes('node_modules')`

Permite configurar si se ignoran o no los archivos de origen en el mapa de origen del servidor, que se usan para completar la [extensión del mapa de origen de `x_google_ignoreList`](https://developer.chrome.com/articles/x-google-ignore-list/).

`server.sourcemapIgnoreList` es el equivalente de [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) para el servidor de desarrollo. Una diferencia entre las dos opciones de configuración es que la función de Rollup se invoca con una ruta relativa para `sourcePath` mientras que `server.sourcemapIgnoreList` lo hace con una ruta absoluta. Durante el desarrollo, la mayoría de los módulos tienen el mapa y la fuente en la misma carpeta, por lo que la ruta relativa para `sourcePath` es el nombre del archivo en sí. En estos casos, las rutas absolutas se hacen convenientes para su uso.

Por defecto, se excluyen todas las rutas que contienen `node_modules`. Puedes pasar `false` para deshabilitar este comportamiento o, para un control total, una función que toma la ruta de origen y la ruta del mapa de origen y devuelve si se ignora la ruta de origen.

```js twoslash
export default defineConfig({
  server: {
    // Este es el valor predeterminado y agregará todos los archivos
    // con node_modules en sus rutas a la lista de ignorados.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip Nota
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) y [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) necesitan ser configurados independientemente. `server.sourcemapIgnoreList` es únicamente una configuración de servidor y no obtiene su valor por defecto de las opciones definidas de Rollup.
:::
