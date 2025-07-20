# API de Entorno para Frameworks

:::info Lanzamiento Candidato
La API de Entorno está generalmente en la fase de candidato a lanzamiento. Mantendremos la estabilidad en las APIs entre las versiones principales para permitir que el ecosistema experimente y construya sobre ellas. Sin embargo, ten en cuenta que [algunas APIs específicas](/changes/#considering) aún se consideran experimentales.

Planeamos estabilizar estas nuevas APIs (con cambios potencialmente importantes) en una versión mayor futura una vez que los proyectos _downstream_ hayan tenido tiempo de experimentar con las nuevas características y validarlas.

Recursos:

- [Discusión de feedback](https://github.com/vitejs/vite/discussions/16358) donde recopilamos feedback sobre las nuevas APIs.
- [Solicitud de cambios de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde las nuevas API fueron implementadas y revisadas.

Por favor comparte tu feedback con nosotros.
:::

## Niveles de Comunicación de DevEnvironment

Dado que los entornos pueden ejecutarse en diferentes runtimes, la comunicación con el entorno puede tener restricciones dependiendo del runtime. Para permitir que los frameworks escriban código agnóstico de runtime fácilmente, la API de Entorno proporciona tres tipos de niveles de comunicación.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` es un entorno que puede comunicar valores arbitrarios. El entorno implícito `ssr` y otros entornos no cliente usan `RunnableDevEnvironment` por defecto durante el desarrollo. Mientras que esto requiere que el runtime sea el mismo con el que se está ejecutando el servidor Vite, esto funciona de manera similar con `ssrLoadModule` y permite a los frameworks migrar y habilitar HMR para su historia de desarrollo SSR. Puedes proteger cualquier entorno ejecutable con una función `isRunnableDevEnvironment`.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * URL a ejecutar.
   * Acepta ruta de archivo, ruta del servidor o id relativo a la raíz.
   * Devuelve un módulo instanciado (igual que en ssrLoadModule)
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * Otros métodos de ModuleRunner...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
El `runner` se evalúa de forma diferida solo cuando se accede por primera vez. Ten en cuenta que Vite habilita el soporte a mapas de fuente cuando el `runner` se crea llamando a `process.setSourceMapsEnabled` o sobrescribiendo `Error.prepareStackTrace` si no está disponible.
:::

Dado un servidor Vite configurado en modo middleware como está descrito en la [guía de configuración de SSR](/guide/ssr#configuracion-del-servidor-de-desarrollo), implementemos el middleware SSR usando la API de Entorno. Recuerda que no tiene que ser llamado `ssr`, por lo que lo llamaremos `server` en este ejemplo. La gestión de errores se omite.

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // por defecto, los módulos se ejecutan en el mismo proceso que el servidor Vite
    },
  },
})

// Puedes necesitar castear esto a RunnableDevEnvironment en TypeScript o
// usar isRunnableDevEnvironment para proteger el acceso al runner
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Leer index.html
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Aplicar transformaciones HTML de Vite. Esto inyecta el cliente HMR de Vite,
  //    y también aplica transformaciones HTML de los plugins de Vite, por ejemplo,
  //    preambulos globales de @vitejs/plugin-react
  template = await viteServer.transformIndexHtml(url, template)

  // 3. Cargar la entrada del servidor. import(url) transforma automáticamente
  //    el código fuente ESM para que sea usable en Node.js! No se requiere empaquetado
  //    y proporciona soporte completo de HMR.
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. Renderizar la app HTML. Esto asume que entry-server.js exporta
  //    `render` función llama a las APIs de SSR apropiadas del framework,
  //    por ejemplo, ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. Injectar la app-rendered HTML en el template.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Enviar el HTML renderizado de vuelta.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

Cuando se usan entornos que soportan HMR (como `RunnableDevEnvironment`), debes agregar `import.meta.hot.accept()` en tu archivo de entrada del servidor para un comportamiento óptimo. Sin esto, los cambios en los archivos del servidor invalidarán el gráfico completo del módulo del servidor:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info
Estamos buscando feedback sobre [la propuesta `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191).
:::

`FetchableDevEnvironment` es un entorno que puede comunicarse con su runtime a través de la [API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Dado que el `RunnableDevEnvironment` solo es posible implementar en un conjunto limitado de runtimes, recomendamos usar el `FetchableDevEnvironment` en lugar del `RunnableDevEnvironment`.

Este entorno proporciona una forma estándar de manejar solicitudes a través del método `handleRequest`:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // manejar la solicitud y devolver una respuesta
            },
          })
        },
      },
    },
  },
})

// Cualquier consumidor de la API de entorno ahora puede llamar a `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.customo)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

:::warning
Vite valida la entrada y salida del método `dispatchFetch`: la solicitud debe ser una instancia de la clase global `Request` y la respuesta debe ser la instancia de la clase global `Response`. Vite lanzará un `TypeError` si esto no es el caso.

Nota que aunque el `FetchableDevEnvironment` se implementa como una clase, se considera un detalle de implementación por parte del equipo de Vite y puede cambiar en cualquier momento.
:::

### raw `DevEnvironment`

Si el entorno no implementa las interfaces `RunnableDevEnvironment` o `FetchableDevEnvironment`, necesitas configurar la comunicación manualmente.

Si tu código puede ejecutarse en el mismo runtime que los módulos del usuario (es decir, no depende de APIs específicas de Node.js), puedes usar un módulo virtual. Este enfoque elimina la necesidad de acceder al valor desde el código utilizando las APIs de Vite.

```ts
// código que utiliza las APIs de Vite
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// usar las funciones expuestas por cada factoría de entorno que ejecuta el código
// verificar para cada factoría de entorno lo que proporcionan
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Entorno no soportado para ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

Por ejemplo, para llamar a `transformIndexHtml` en el módulo del usuario, se puede usar el siguiente plugin:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

Si tu código requiere APIs de Node.js, puedes usar `hot.send` para comunicarte con el código que utiliza las APIs de Vite desde los módulos del usuario. Sin embargo, ten en cuenta que esta enfoque puede no funcionar de la misma manera después del proceso de compilación.

```ts
// código que utiliza las APIs de Vite
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// usar las funciones expuestas por cada factoría de entorno que ejecuta el código
// verificar para cada factoría de entorno lo que proporcionan
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Entorno no soportado para ${ssrEnvironment.name}`)
}

const req = new Request('/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## Entornos Durante la Compilación

En el CLI, llamar a `vite build` y `vite build --ssr` todavía compilará los entornos del cliente solo y ssr solo para retrocompatibilidad.

Cuando `builder` no es `undefined` (o cuando se llama a `vite build --app`), `vite build` opta por compilar la aplicación completa en su lugar. En el futuro, esta será la opción predeterminada. Se creará una instancia de `ViteBuilder` (equivalente de tiempo de compilación a `ViteDevServer`) para compilar todos los entornos configurados para producción. Por defecto, la compilación de entornos se ejecuta en serie, respetando el orden de la `environments` record. Un framework o usuario puede configurar adicionalmente cómo se compilan los entornos usando:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

Los plugins también pueden definir un hook `buildApp`. Las ordenes `'pre'` y `null` se ejecutan antes que `builder.buildApp`, y la orden `'post'` se ejecuta después de ella. `environment.isBuilt` se puede usar para verificar si un entorno ya ha sido compilado.

## Código Agnóstico de Entorno

La mayoría del tiempo, la instancia actual del `environment` estará disponible como parte del contexto del código que se está ejecutando, por lo que la necesidad de acceder a ellos a través de `server.environments` debería ser rara. Por ejemplo, dentro de los hooks de plugin, el entorno se expone como parte del `PluginContext`, por lo que se puede acceder usando `this.environment`. Consulta [API de entorno para plugins](./api-environment-plugins.md) para aprender sobre cómo construir plugins conscientes de entorno.
