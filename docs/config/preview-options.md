# Opciones para preview

A menos que se indique lo contrario, las opciones en esta sección solo se aplican a la vista previa.

## preview.host

- **Tipo:** `string | boolean`
- **Por defecto:** [`server.host`](#server_host)

  Especifica en qué direcciones IP debe escuchar el servidor.
  Configurar en `0.0.0.0` o `true` para escuchar en todas las direcciones, incluidas las LAN y las direcciones públicas.

  Esto se puede configurar a través de la CLI usando `--host 0.0.0.0` o `--host`.

  :::tip NOTA

  Hay casos en los que otros servidores pueden responder en lugar de Vite.
  Consulta [`server.host`](./server-options#server-host) para obtener más detalles.

  :::

## preview.port

- **Tipo:** `number`
- **Por defecto:** `4173`

  Especifica el puerto del servidor. Ten en cuenta que si el puerto ya se está utilizando, Vite probará automáticamente el siguiente puerto disponible, por lo que es posible que este no sea el puerto real en el que el servidor termina escuchando.

**Ejemplo:**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort

- **Tipo:** `boolean`
- **Por defecto:** [`server.strictPort`](#server_strictport)

  Configurar en `true` para salir si el puerto ya está en uso, en lugar de probar automáticamente el siguiente puerto disponible.

## preview.https

- **Tipo:** `https.ServerOptions`
- **Por defecto:** [`server.https`](#server_https)

  Habilita TLS + HTTP/2. Ten en cuenta que esto cambia a TLS solo cuando también se usa la opción [`server.proxy`](#server-proxy).

  El valor también puede ser un [objeto de opciones](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) pasado a `https.createServer()`.

## preview.open

- **Tipo:** `boolean | string`
- **Por defecto:** [`server.open`](#server-open)

  Abre automáticamente la aplicación en el navegador al iniciar el servidor. Cuando el valor es una cadena, se utilizará como nombre de ruta de la URL. Si deseas abrir el servidor en un navegador específico, puedes configurar `process.env.BROWSER` (por ejemplo, `firefox`). También puedes configurar `process.env.BROWSER_ARGS` para pasar argumentos adicionales (por ejemplo, `--incognito`).

  `BROWSER` y `BROWSER_ARGS` también son variables de entorno especiales que puedes colocar en el archivo `.env` para configurarlo. Consulta [el paquete `open`](https://github.com/sindresorhus/open#app) para obtener más detalles.

## preview.proxy

- **Tipo:** `Record<string, string | ProxyOptions>`
- **Por defecto:** [`server.proxy`](#server-proxy)

  Configura reglas de proxy personalizadas para el servidor de vista previa. Espera un objeto de pares `{ key: options }`. Si la clave comienza con `^`, se interpretará como `RegExp`. La opción `configure` se puede utilizar para acceder a la instancia del proxy.

  Usa [`http-proxy`](https://github.com/http-party/node-http-proxy). Todas las opciones [aquí](https://github.com/http-party/node-http-proxy#options).

## preview.cors

- **Tipo:** `boolean | CorsOptions`
- **Por defecto:** [`server.cors`](#server-proxy)

  Configura las CORS para el servidor de vista previa. Esto está habilitado por defecto y permite cualquier origen. Pasa un [objeto de opciones](https://github.com/expressjs/cors#configuration-options) para ajustar el comportamiento o `false` para deshabilitarlo.

## preview.headers

- **Tipo:** `OutgoingHttpHeaders`

Especifica las cabeceras de las respuestas provenientes del servidor.
