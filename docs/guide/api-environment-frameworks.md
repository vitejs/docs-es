# API de Entorno para Frameworks

:::warning Experimental  
La API de Entorno es experimental. Mantendremos las API estables durante Vite 6 para permitir que el ecosistema experimente y construya sobre ella. Planeamos estabilizar estas nuevas API con posibles cambios incompatibles en Vite 7.

**Recursos:**

- [Discusión sobre comentarios](https://github.com/vitejs/vite/discussions/16358) donde estamos recopilando opiniones sobre las nuevas APIs.
- [PR de la API de Entorno](https://github.com/vitejs/vite/pull/16471) donde se implementaron y revisaron las nuevas APIs.

Por favor, comparte tus comentarios con nosotros.  
:::

## Entornos y frameworks

El entorno implícito `ssr` y otros entornos no cliente usan por defecto un `RunnableDevEnvironment` durante el desarrollo. Aunque esto requiere que el tiempo de ejecución sea el mismo que el del servidor Vite, funciona de manera similar a `ssrLoadModule` y permite que los frameworks migren y habiliten HMR (Hot Module Replacement) para su desarrollo SSR. Puedes proteger cualquier entorno ejecutable con la función `isRunnableDevEnvironment`.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}
class ModuleRunner {
  /**
   * URL para ejecutar.
   * Acepta la ruta del archivo, la ruta del servidor o el ID relativo a la raíz.
   * Devuelve un módulo instanciado (igual que en ssrLoadModule).
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
El `runner` se evalúa de forma prioritaria cuando se accede por primera vez. Ten en cuenta que Vite habilita el soporte para mapas de origen cuando el `runner` se crea llamando a `process.setSourceMapsEnabled` o sobrescribiendo `Error.prepareStackTrace` si no está disponible.  
:::

## `RunnableDevEnvironment` predeterminado

Dado un servidor Vite configurado en modo middleware como se describe en la [guía de configuración SSR](/guide/ssr#setting-up-the-dev-server), implementemos el middleware SSR usando la API de entorno. El manejo de errores se omite.

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // por defecto, los módulos se ejecutan en el mismo proceso que el servidor de Vite
    },
  },
})
// Podrías necesitar convertir esto a RunnableDevEnvironment en TypeScript o
// utilizar isRunnableDevEnvironment para proteger el acceso al runner.
const environment = server.environments.node
app.use('*', async (req, res, next) => {
  const url = req.originalUrl
  // 1. Leer index.html
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')
  // 2. Aplicar las transformaciones de HTML de Vite. Esto inyecta el cliente de HMR de Vite,
  //    y también aplica transformaciones HTML de los plugins de Vite, e.g., preámbulos
  //    globales de @vitejs/plugin-react.
  template = await server.transformIndexHtml(url, template)
  // 3. Cargar la entrada del servidor. import(url) transforma automáticamente
  //    el código fuente ESM para ser usable en Node.js. ¡No se requiere empaquetado
  //    y se proporciona soporte completo para HMR!
  const { render } = await environment.runner.import('/src/entry-server.js')
  // 4. Renderizar el HTML de la aplicación. Esto asume que la función `render`
  //     exportada en entry-server.js llama a las APIs SSR del framework correspondiente,
  //    e.g., ReactDOMServer.renderToString().
  const appHtml = await render(url)
  // 5. Inyectar el HTML renderizado en la plantilla.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)
  // 6. Enviar el HTML renderizado de vuelta.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

## SSR Agnóstico al tiempo de ejecución

Dado que el `RunnableDevEnvironment` solo se puede usar para ejecutar código en el mismo tiempo de ejecución que el servidor Vite, requiere un entorno compatible con Node.js. Esto significa que necesitarás usar el `DevEnvironment` sin modificar para hacerlo agnóstico al tiempo de ejecución.

:::info Propuesta `FetchableDevEnvironment`  
La propuesta inicial tenía un método `run` en la clase `DevEnvironment` que permitía a los consumidores invocar una importación del lado del ejecutor usando la opción `transport`. Durante nuestras pruebas, descubrimos que la API no era lo suficientemente universal para recomendarla. Actualmente, estamos buscando comentarios sobre [la propuesta `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191).  
:::

`RunnableDevEnvironment` tiene una función `runner.import` que devuelve el valor del módulo. Pero esta función no está disponible en el `DevEnvironment` sin modificar, lo que requiere desacoplar el código que usa las APIs de Vite de los módulos del usuario.

Por ejemplo, el siguiente ejemplo usa el valor del módulo del usuario desde el código que usa las APIs de Vite:

```ts
// Código que usa las APIs de Vite
import { createServer } from 'vite'

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entry.js')
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

Si tu código puede ejecutarse en el mismo entorno que los módulos del usuario (es decir, no depende de APIs específicas de Node.js), puedes usar un módulo virtual. Este enfoque elimina la necesidad de acceder al valor desde el código que utiliza las APIs de Vite.

```ts
// Código que utiliza las APIs de Vite
import { createServer } from 'vite'
const server = createServer({
  plugins: [
    // Un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}
// Usa funciones expuestas por cada entorno que ejecuta el código.
// Verifica para cada entorno qué funciones proporcionan.
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(
    `Tiempo de ejecución no compatible para ${ssrEnvironment.name}`
  )
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

Si tu código requiere APIs de Node.js, puedes usar `hot.send` para comunicarte entre el código que utiliza las APIs de Vite y los módulos del usuario. Sin embargo, ten en cuenta que este enfoque puede no funcionar de la misma manera después del proceso de compilación.

```ts
// Código que utiliza las APIs de Vite
import { createServer } from 'vite'
const server = createServer({
  plugins: [
    // Un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}
// Usa funciones expuestas por cada entorno que ejecuta el código.
// Verifica para cada entorno qué funciones proporcionan.
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(
    `Tiempo de ejecución no compatible para ${ssrEnvironment.name}`
  )
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

Si tu código puede ejecutarse en el mismo entorno que los módulos del usuario (es decir, no depende de APIs específicas de Node.js), puedes usar un módulo virtual. Este enfoque elimina la necesidad de acceder al valor desde el código que utiliza las APIs de Vite.

```ts
// Código que utiliza las APIs de Vite
import { createServer } from 'vite'
const server = createServer({
  plugins: [
    // Un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}
// Usa funciones expuestas por cada entorno que ejecuta el código.
// Verifica para cada entorno qué funciones proporcionan.
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(
    `Tiempo de ejecución no compatible para ${ssrEnvironment.name}`
  )
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
          html = await fs.promises.readFile('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = await fs.promises.readFile('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

Si tu código requiere APIs de Node.js, puedes usar `hot.send` para comunicarte entre el código que utiliza las APIs de Vite y los módulos del usuario. Sin embargo, ten en cuenta que este enfoque puede no funcionar de la misma manera después del proceso de compilación.

```ts
// Código que utiliza las APIs de Vite
import { createServer } from 'vite'
const server = createServer({
  plugins: [
    // Un plugin que maneja `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* implementación del plugin */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}
// Usa funciones expuestas por cada entorno que ejecuta el código.
// Verifica para cada entorno qué funciones proporcionan.
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(
    `Tiempo de ejecución no compatible para ${ssrEnvironment.name}`
  )
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

En la interfaz de línea de comandos, al ejecutar `vite build` y `vite build --ssr`, se seguirán compilando únicamente los entornos de cliente y SSR para mantener la retrocompatibilidad.

Cuando `builder` no es `undefined` (o al llamar `vite build --app`), `vite build` optará por compilar toda la aplicación en su lugar. Esto se convertirá en el valor por defecto en una futura versión principal. Se creará una instancia de `ViteBuilder` (equivalente en tiempo de compilación a un `ViteDevServer`) para construir todos los entornos configurados para producción. De forma predeterminada, la compilación de los entornos se ejecuta en serie, respetando el orden del registro `environments`. Un marco o usuario puede configurar aún más cómo se construyen los entornos utilizando:

Por defecto, la compilación de los entornos se ejecuta en serie, respetando el orden definido en el registro de `environments`. Sin embargo, los usuarios o frameworks pueden configurar adicionalmente cómo se compulan los entornos usando un bloque de código como el siguiente:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment))
      )
    },
  },
}
```

## Código Agnóstico del entorno

La mayor parte del tiempo, la instancia actual de `environment` estará disponible como parte del contexto del código que se está ejecutando, por lo que la necesidad de acceder a ella a través de `server.environments` será poco común.

Por ejemplo, dentro de los hooks de los plugins, el entorno está expuesto como parte de `PluginContext`, por lo que puede accederse mediante `this.environment`. Consulta la [API de Entornos para Plugins](./api-environment-plugins.md) para aprender cómo construir plugins conscientes de los entornos.
