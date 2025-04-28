# Server Side Rendering (SSR)

:::tip Nota
SSR se refiere específicamente a los marcos front-end (por ejemplo, React, Preact, Vue y Svelte) que admiten la ejecución de la misma aplicación en Node.js, renderizándola previamente en HTML y finalmente hidratándola en el cliente. Si estás buscando una integración con marcos tradicionales del lado del servidor, consulta la [Guía de integración de backend](./backend-integration) en su lugar.

La siguiente guía también asume experiencia previa trabajando con SSR en tu marco de trabajo preferido, y solo se centrará en los detalles de integración específicos de Vite.
:::

:::warning API de bajo nivel
Esta es una API de bajo nivel destinada a autores de bibliotecas y marcos de trabajo. Si tu objetivo es crear una aplicación, asegúrate de consultar primero los plugins y las herramientas de SSR de nivel superior en la [sección SSR de Awesome Vite](https://github.com/vitejs/awesome-vite#ssr). Dicho esto, muchas aplicaciones se construyen con éxito directamente sobre la API nativa de bajo nivel de Vite.
:::

## Proyectos de ejemplo

Vite proporciona soporte integrado para la representación del lado del servidor (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) contiene configuraciones de ejemplo para SSR que puedes utilizar como referencias para esta guía:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

También puedes generar proyectos nuevos localmente [ejecutando `create-vite`](./index.md#inicia-tu-primer-proyecto-vite) y seleccionando `Otros > create-vite-extra` en la opciones del framework.

## Estructura del código fuente

Una aplicación SSR típica tendrá la siguiente estructura de archivo fuente:

```
- index.html
- server.js # servidor de aplicaciones principal
- src/
  - main.js          # exporta código de aplicación independiente del entorno (universal)
  - entry-client.js  # monta la aplicación en un elemento DOM
  - entry-server.js  # renderiza la aplicación utilizando la API de SSR del marco
```

`index.html` deberá hacer referencia a `entry-client.js` e incluir un placeholder donde se debe inyectar el markup generado por el servidor:

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Puedes usar cualquier placeholder que prefieras en lugar de `<!--ssr-outlet-->`, siempre que se pueda reemplazar con precisión.

## Lógica condicional

Si necesitas realizar una lógica condicional basada en SSR vs cliente, puedes usar

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... logica de solo servidor
}
```

Esto se reemplaza estáticamente durante la compilación, por lo que permitirá que las ramas no utilizadas se eliminen.

## Configuración del servidor de desarrollo

Al crear una aplicación SSR, es probable que desees tener control total sobre tu servidor principal y desacoplar Vite del entorno de producción. Por lo tanto, se recomienda utilizar Vite en modo middleware. Aquí hay un ejemplo con [express](https://expressjs.com/):

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Crea servidor Vite en modo middleware y configura el tipo de aplicación como
  // 'custom', deshabilitando la propia lógica de servicio HTML de Vite para que el servidor principal
  // puede tomar el control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Usa la instancia de Connect de Vite como middleware. Si usas tu propio
  // router de Express (express.Router()), debes usar router.use
  // Cuando el servidor se reinicia (por ejemplo, después de que el usuario modifica
  // vite.config.js), `vite.middlewares` seguirá siendo la misma
  // referencia (con una nueva cola interna de middlewares de Vite e inyectados por plugins).
  // Lo siguiente es válido incluso después de reinicios.
  app.use(vite.middlewares)

  app.use('*all', async (req, res) => {
    // serve index.html - Se modificará despues
  })

  app.listen(5173)
}

createServer()
```

Aquí `vite` es una instancia de [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares` es una instancia de [Connect](https://github.com/senchalabs/connect) que se puede usar como middleware en cualquier marco Node.js compatible con connect.

El siguiente paso es implementar el controlador `*` para servir el HTML generado por el servidor:

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*all', async (req, res) => {
  const url = req.originalUrl

  try {
    // 1. Lee index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    )

    // 2. Aplica transformaciones Vite HTML. Esto inyecta el cliente Vite HMR
    // y también aplica transformaciones HTML de los plugins de Vite, por ejemplo,
    // preámbulos globales de @vite/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3a. Carga la entrada del servidor. vite.ssrLoadModule se transforma automáticamente
    //    ¡tu código fuente de ESM se puede usar en Node.js! No hay empaquetado
    //    requerido, y proporciona una invalidación eficiente similar a HMR.
    // 3b. Desde Vite 5.1, puedes utilizar la API createViteRuntime
    //    en su lugar.
    //    Soporta completamente HMR y funciona de manera similar a ssrLoadModule
    //    Un caso de uso más avanzado sería crear un tiempo de ejecución en un hilo separado
    //    o incluso en una máquina diferente utilizando la clase ViteRuntime
    const runtime = await vite.createViteRuntime(server)
    const { render } = await runtime.executeEntrypoint('/src/entry-server.js')

    // 4. renderiza el HTML de la aplicación. Esto asume que la función `render`
    // exportada desde entry-server.js llama a las API de SSR del marco apropiado,
    // por ejemplo, ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. Inyecta el HTML generado por la aplicación en la plantilla.
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

    // 6. Devuelve el HTML renderizado.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // Si se detecta un error, permite que Vite fije el trazado de pila
    // para que se asigne de nuevo a tu código fuente real.
    vite.ssrFixStacktrace(e)
    console.error(e)
    res.status(500).end(e.message)
  }
})
```

El script `dev` en `package.json` también debe cambiarse para usar el script del servidor en su lugar:

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Compilando para Producción

Para enviar un proyecto de SSR a producción, necesitamos:

1. Producir una compilación de cliente como de costumbre;
2. Producir una compilación SSR, que se puede cargar directamente a través de `import()` para que no tengamos que pasar por `ssrLoadModule` de Vite o `runtime.executeEntrypoint`;

Nuestros scripts en `package.json` se verán así:

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Ten en cuenta el indicador `--ssr` que indica que se trata de una compilación SSR. También debes especificar la entrada SSR.

Luego, en `server.js` necesitamos agregar algo de lógica específica de producción al verificar ``process.env.NODE_ENV`:

- En lugar de leer la raíz `index.html`, usa `dist/client/index.html` como plantilla, ya que contiene los enlaces de recursos correctos a la compilación del cliente.

- En lugar de `await vite.ssrLoadModule('/src/entry-server.js')` o `await runtime.executeEntrypoint('/src/entry-server.js')`, usa `import('./dist/server/entry-server.js')` (este archivo es el resultado de la compilación SSR).

- Mueve la creación y todo el uso del servidor de desarrollo `vite` detrás de ramas condicionales solo para desarrollo, luego agrega middlewares de servicio de archivos estáticos para servir archivos desde `dist/client`.

Consulta los [proyectos de ejemplo](#proyectos-de-ejemplo) para una configuración funcional.

## Generación de directivas de precargado

`vite build` admite el indicador `--ssrManifest` que generará `.vite/ssr-manifest.json` en el directorio de salida de compilación:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

La secuencia de comandos anterior ahora generará `dist/client/.vite/ssr-manifest.json` para la compilación del cliente (Sí, el manifiesto SSR se genera a partir de la compilación del cliente porque queremos asignar ID de módulo a los archivos del cliente. El manifiesto contiene asignaciones de ID de módulos a sus fragmentos y archivos de recursos asociados.

Para aprovechar el manifiesto, los marcos de trabajo deben proporcionar una forma de recopilar los ID de módulo de los componentes que se usaron durante una llamada de procesamiento del servidor.

`@vite/plugin-vue` admite esto desde el primer momento y registra automáticamente los ID de módulos de componentes usados ​​en el contexto Vue SSR asociado:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules is now a Set of module IDs that were used during the render
```

En la rama de producción de `server.js` necesitamos leer y pasar el manifiesto a la función `render` exportada por `src/entry-server.js`. ¡Esto nos proporcionaría suficiente información para generar directivas de precarga para archivos utilizados por rutas asíncronas! Consulta el [código fuente de demostración](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) para ver un ejemplo completo. También puedes utilizar esta información para [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).

## Renderizado previo / SSG

Si las rutas y los datos necesarios para ciertas rutas se conocen con anticipación, podemos renderizar previamente estas rutas en HTML estático usando la misma lógica que SSR de producción. Esto también puede considerarse una forma de generación de sitios estáticos (SSG). Consulta el [demo del script de pre-renderizado](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) para ver un ejemplo práctico.

## SSR Externos

Las dependencias se "externalizan" del sistema del módulo de transformación SSR de Vite de forma predeterminada cuando se ejecuta SSR. Esto acelera tanto el desarrollo como la compilación.
Si una dependencia necesita ser transformada por la canalización de Vite, por ejemplo, porque las características de Vite se usan sin transpilar en ellas, se pueden agregar a [`ssr.noExternal`](../config/ssr-options.html#ssr-noexternal).

En el caso de las dependencias vinculadas, no se externalizan por defecto para aprovechar el HMR de Vite. Si no se desea esto, por ejemplo, para probar las dependencias como si no estuvieran vinculadas, se pueden añadir a [`ssr.external`](../config/ssr-options.md#ssr-external).

:::warning Trabajando con Alias
Si has configurado aliases que redirigen un paquete a otro, es posible que desees crear un alias para los paquetes `node_modules` reales para que funcione para las dependencias externalizadas de SSR. Tanto [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) como [pnpm](https://pnpm.io/aliases/) admiten la creación de alias a través del prefijo `npm:`.
:::

## Lógica de plugin específica de SSR

Algunos marcos, como Vue o Svelte, compilan componentes en diferentes formatos en función del cliente frente a SSR. Para admitir transformaciones condicionales, Vite pasa una propiedad `ssr` adicional en el objeto `options` de los siguientes hooks de plugins:

- `resolveId`
- `load`
- `transform`

**Ejemplo:**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // realizar transformaciones especificas a ssr...
      }
    },
  }
}
```

El objeto de opciones en `load` y `transform` es opcional, Rollup no está usando este objeto actualmente, pero puedes ampliar estos hooks con metadatos adicionales en el futuro.

:::tip Nota
Antes de Vite 2.7, esto se informaba a plugins con un parámetro posicional `ssr` en lugar de usar el objeto `options`. Todos los marcos y plugins principales están actualizados, pero es posible que encuentre publicaciones obsoletas utilizando la API anterior.
:::

## Destino de SSR

El destino predeterminado para la compilación de SSR es un entorno de node, pero también puedes ejecutar el servidor en un Web Worker. La resolución de entrada de paquetes es diferente para cada plataforma. Puedes configurar el objetivo para que sea Web Worker utilizando `ssr.target` establecido en `'webworker'`.

## Paquete de SSR

En algunos casos, como los tiempos de ejecución de `webworker`, es posible que desees empaquetar tu compilación SSR en un solo archivo JavaScript. Puedes habilitar este comportamiento configurando `ssr.noExternal` en `true`. Esto hará dos cosas:

- Tratar todas las dependencias como `noExternal`
- Lanzar un error si se importan elementos integrados de Node.js

## Condiciones de resolución de SSR

De forma predeterminada, la resolución de entrada de paquetes utilizará las condiciones establecidas en [`resolve.conditions`](/config/shared-options.md#resolve-conditions) para la compilación SSR. Puedes utilizar [`ssr.resolve.conditions`](/config/ssr-options.md#ssr-resolve-conditions) y [`ssr.resolve.externalConditions`](/config/ssr-options.md#ssr-resolve-externalconditions) para personalizar este comportamiento.

## Vite CLI

Los comandos del CLI `$ vite dev` y `$ vite preview` también se pueden usar para aplicaciones SSR. Puedes agregar tu middleware SSR al servidor de desarrollo con [`configureServer`](/guide/api-plugin#configureserver) y al servidor de vista previa con [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip Nota
Usa un post hook para que tu middleware SSR se ejecute _después_ de los middlewares de Vite.
:::
