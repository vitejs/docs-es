# API de Plugins

Los plugins de Vite amplían la interfaz de plugins bien diseñada de Rollup con algunas opciones adicionales específicas de Vite. Como resultado, puedes escribir un plugin de Vite una vez y hacer que funcione tanto para desarrollo como para compilación.

**Se recomienda revisar primero la [documentación de plugins de Rollup](https://rollupjs.org/plugin-development/) antes de leer las secciones a continuación.**

## Creación de un Plugin

Vite se esfuerza por ofrecer patrones establecidos listos para usar, así que antes de crear un nuevo plugin, asegúrate de consultar la [Guía de funcionalidades](/guide/features) para ver si tu necesidad está cubierta. Revisa también los plugins de la comunidad disponibles, tanto en forma de [plugins de Rollup compatible](https://github.com/rollup/awesome) como [plugins específicos de Vite](https://github.com/vitejs/awesome-vite#plugins)

Al crear un plugin, puedes colocarlo en tu `vite.config.js`. No hay necesidad de crear un nuevo paquete para ello. Una vez que veas que un plugin fue útil en tus proyectos, considera compartirlo para ayudar a otros [en el ecosistema](https://chat.vite.dev).

::: tip
Al aprender, depurar o crear plugins, sugerimos incluir [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) en tu proyecto. Este te permite inspeccionar el estado intermedio de los plugins de Vite. Después de la instalación, puedes visitar `localhost:5173/__inspect/` para inspeccionar los módulos y la pila de transformación de tu proyecto. Consulta las instrucciones de instalación en los [documentos de vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect).
![vite-plugin-inspect](../images/vite-plugin-inspect.webp)

:::

## Convenciones

Si el plugin no usa hooks específicos de Vite y se puede implementar como un [Plugin de Rollup compatible](./api-plugin.md#compatibilidad-de-plugins-rollup), entonces se recomienda usar las [Convenciones de nomenclatura de plugin de Rollup](https://rollupjs.org/plugin-development/#conventions).

- Los plugins de Rollup deben tener un nombre claro con el prefijo `rollup-plugin-`.
- Incluye las palabras clave `rollup-plugin` y `vite-plugin` en package.json.

Esto expone el plugin para que también se use en proyectos basados ​​en Rollup o WMR puros.

Solo para plugins de Vite

- Los plugins de Vite deben tener un nombre claro con el prefijo `vite-plugin-`.
- Incluye la palabra clave `vite-plugin` en package.json.
- Incluye una sección en los documentos del plugin que detalle por qué es un plugin exclusivo de Vite (por ejemplo, utiliza hooks de plugin específicos de Vite).

Si tu plugin solo funcionará para un marco de trabajo en particular, su nombre debe incluirse como parte del prefijo

- Prefijo `vite-plugin-vue-` para Vue
- Prefijo `vite-plugin-react-` para React
- Prefijo `vite-plugin-svelte-` para plugins Svelte

Puedes ver también la [Convención de Módulos Virtuales](./api-plugin.md#convencion-de-modulos-virtuales).

## Configuración de Plugins

Los usuarios agregarán plugins al proyecto `devDependencies` y los configurarán usando la opción de array `plugins`.

```js [vite.config.js]
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()],
})
```

Se ignorarán los plugins falsos, que se pueden usar para activar o desactivar plugins fácilmente.

`plugins` también acepta ajustes predefinidos que incluyen varios plugins como un solo elemento. Esto es útil para funciones complejas (como la integración de marcos) que se implementan mediante varios plugins. El array se aplanará internamente.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()],
})
```

## Ejemplos Simples

:::tip
Es una convención común crear un plugin Vite/Rollup como una función de factoría que devuelve el objeto del plugin real. La función puede aceptar opciones que permiten a los usuarios personalizar el comportamiento del plugin.
:::

### Transformación de Tipos de Archivos Personalizados

```js
export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null, // provee un mapa de fuentes si es necesario
        }
      }
    },
  }
}
```

### Importación de un Archivo Virtual

Mira el ejemplo en [la siguente sección](./api-plugin.md#convencion-de-modulos-virtuales).

## Convención de módulos virtuales

Los módulos virtuales son un esquema útil que le permite pasar información de tiempo de compilación a los archivos de origen utilizando la sintaxis de importación de ESM normal.

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // requerido, aparecerá en advertencias y errores
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    },
  }
}
```

Lo que permite importar el módulo en JavaScript:

```js
import { msg } from 'virtual:my-module'

console.log(msg)
```

Los módulos virtuales en Vite (y Rollup) tienen el prefijo `virtual:` para la ruta orientada al usuario por convención. Si es posible, el nombre del plugin debe usarse como un espacio de nombre para evitar colisiones con otros plugins en el ecosistema. Por ejemplo, `vite-plugin-posts` podría pedirles a los usuarios que importe módulo virtuales `virtual:posts` o `virtual:posts/helpers` para obtener información sobre el tiempo de compilación. Internamente, los plugins que usan módulos virtuales deben prefijar la ID del módulo con `\0` mientras resuelven la ID, una convención del ecosistema de Rollup. Esto evita que otros plugins intenten procesar el id (como la resolución de node), y las funciones principales, como los mapas de origen, puedan usar esta información para diferenciar entre módulos virtuales y archivos normales. `\0` no es un carácter permitido en las URL de importación, por lo que debemos reemplazarlo durante el análisis de importación. Una identificación virtual `\0{id}` termina codificada como `/@id/__x00__{id}` durante el desarrollo en el navegador. El id se decodificará antes de ingresar a la canalización de plugins, por lo que el código de hooks de plugins no lo ve.

Ten en cuenta que los módulos derivados directamente de un archivo real, como en el caso de un módulo de secuencia de comandos en un componente de archivo único (como .vue o .svelte SFC) no necesitan seguir esta convención. Los SFC generalmente generan un conjunto de submódulos cuando se procesan, pero el código en estos se puede mapear de nuevo al sistema de archivos. El uso de `\0` para estos submódulos evitaría que los mapas de origen funcionen correctamente.

## Hooks Universales

Durante el desarrollo, el servidor de desarrollo de Vite crea un contenedor de plugins que invoca [Hooks de compilación de Rollup](https://rollupjs.org/plugin-development/#build-hooks) de la misma manera que lo hace Rollup.

Los siguientes hooks se llaman una vez en el inicio del servidor:

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

Los siguientes hooks se llaman en cada solicitud de módulo entrante:

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

Estos hooks también tienen un parámetro `options` extendido con propiedades adicionales específicas de Vite. Puedes leer más en la [documentación de SSR](/guide/ssr.html#logica-de-plugin-especifica-de-ssr).

Algunas llamadas `resolveId` al valor `importer` pueden ser una ruta absoluta para un `index.html` genérico en la raíz, ya que no siempre es posible derivar el importador real debido al patrón de servidor de desarrollo desagregado de Vite. Para las importaciones manejadas dentro de la canalización de resolución de Vite, se puede rastrear al importador durante la fase de análisis de importación, proporcionando el valor `importer` correcto.

Los siguientes hooks se llaman cuando el servidor está cerrado:

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

Ten en cuenta que el hook [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) **no** se llama durante el desarrollo, porque Vite evita los análisis AST completos para un mejor rendimiento.

[Los hooks de generación de salida](https://rollupjs.org/plugin-development/#output-generation-hooks) (excepto `closeBundle`) **no** se llaman durante el desarrollo. Puedes pensar esto como que el servidor de desarrollo de Vite solo llama a `rollup.rollup()` sin llamar a `bundle.generate()`.

## Hooks Específicos de Vite

Los plugins de Vite también pueden proporcionar hooks que sirven para propósitos específicos de Vite. Estos hooks son ignorados por Rollup.

### `config`

- **Tipo:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Clase:** `async`, `sequential`

  Modifica la configuración de Vite antes de que se resuelva. El enlace recibe la configuración de usuario sin procesar (las opciones de CLI se fusionaron con el archivo de configuración) y el entorno de configuración actual que expone el `mode` y el `command` que se están utilizando. Puede devolver un objeto de configuración parcial que se fusionará profundamente con la configuración existente, o mutar directamente la configuración (si la fusión predeterminada no puede lograr el resultado deseado).

  **Ejemplo:**

  ```js
  // devuelve la configuración parcial (recomendado)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      resolve: {
        alias: {
          foo: 'bar',
        },
      },
    }),
  })

  // muta la configuración directamente (usar solo cuando la fusión no funciona)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    },
  })
  ```

  ::: warning Nota
  Los plugins de usuario se resuelven antes de ejecutar este hook, por lo que inyectar otros plugins dentro del hook `config` no tendrá ningún efecto.
  :::

### `configResolved`

- **Tipo:** `(config: ResolvedConfig) => void | Promise<void>`
- **Clase:** `async`, `parallel`

  Se llama después de que se resuelve la configuración de Vite. Use este hook para leer y almacenar la configuración final resuelta. También es útil cuando el plugin necesita hacer algo diferente según el comando que se está ejecutando.

  **Ejemplo:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // store the resolved config
        config = resolvedConfig
      },

      // use stored config in other hooks
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: plugin invoked by dev server
        } else {
          // build: plugin invoked by Rollup
        }
      },
    }
  }
  ```

  Ten en cuenta que el valor de `command` es `serve` en dev (en el CLI `vite`, `vite dev` y `vite serve` son alias).

### `configureServer`

- **Tipo:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Clase:** `async`, `sequential`
- **Ver además:** [ViteDevServer](./api-javascript#vitedevserver)

  Hook para configurar el servidor dev. El caso de uso más común es agregar middlewares personalizados a la aplicación interna [connect](https://github.com/senchalabs/connect):

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // custom handle request...
      })
    },
  })
  ```

  **Inyección de middleware posterior**

  El enlace `configureServer` se llama antes de que se instalen los middlewares internos, por lo que los middlewares personalizados se ejecutarán antes que los middlewares internos de forma predeterminada. Si desea inyectar un middleware **después** de middlewares internos, puede devolver una función desde `configureServer`, que se llamará después de que se instalen los middlewares internos:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // devuelve un hook que se llama después de que los middlewares internos sean
      // instalados
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        })
      }
    },
  })
  ```

  **Acceso de almacenamiento del servidor**

  En algunos casos, otros hooks de plugins pueden necesitar acceso a la instancia del servidor de desarrollo (por ejemplo, acceder al servidor de socket web, al observador del sistema de archivos o el gráfico del módulo). Este hook también se puede usar para almacenar la instancia del servidor para acceder a otros ganchos:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // use server...
        }
      },
    }
  }
  ```

  Ten en cuenta que `configureServer` no se llama cuando se ejecuta la compilación de producción, por lo que sus otros hooks deben protegerse contra su ausencia.

### `configurePreviewServer`

- **Tipo:** `(server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>`
- **Clase:** `async`, `sequential`
- **Ver también:** [PreviewServer](./api-javascript#previewserver)

  Tal como [`configureServer`](/guide/api-plugin.html#configureserver) pero para el servidor de vista previa. De manera similar a `configureServer`, el hook `configurePreviewServer` se llama antes de que se instalen otros middlewares. Si deseas inyectar un middleware **después** de otros middlewares, puede devolver una función desde `configurePreviewServer`, que se llamará después de que se instalen los middlewares internos:

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // return a post hook that is called after other middlewares are
      // installed
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        })
      }
    },
  })
  ```

### `transformIndexHtml`

- **Tipo:** `IndexHtmlTransformHook | { order?: 'pre' | 'post', handler: IndexHtmlTransformHook }`
- **Clase:** `async`, `sequential`

Hook dedicado para transformar archivos de punto de entrada HTML como `index.html`. El hook recibe la cadena HTML actual y un contexto de transformación. El contexto expone la instancia de [`ViteDevServer`](./api-javascript#vitedevserver) durante el desarrollo y expone el paquete de salida de Rollup durante la compilación.

El hook puede ser asíncrono y puede devolver uno de los siguientes:

- Cadena HTML transformada
- Un array de objetos de descriptores de etiquetas (`{ tag, attrs, children }`) para inyectarlos en el HTML existente. Cada etiqueta también puede especificar dónde debe inyectarse (por defecto se antepone a `<head>`)
- Un objeto que contiene ambos como `{ html, tags }`

Por defecto, `order` es `undefined`, con este hook aplicado después de transformar el HTML. Para poder inyectar un script que debería de pasar por el pipeline de los plugins de Vite, `order: 'pre'` aplicará el hook antes de procesar el HTML. `order: 'post'` Aplica el hook después de que se hayan aplicado todos los hooks con `order` undefined.

**Ejemplo básico:**

```js
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>Title replaced!</title>`,
      )
    },
  }
}
```

**Firma de hook completa:**

```ts
type IndexHtmlTransformHook = (
  html: string,
  ctx: {
    path: string
    filename: string
    server?: ViteDevServer
    bundle?: import('rollup').OutputBundle
    chunk?: import('rollup').OutputChunk
  },
) => IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>

type IndexHtmlTransformResult =
  | string
  | HtmlTagDescriptor[]
  | {
      html: string
      tags: HtmlTagDescriptor[]
    }

interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean>
  children?: string | HtmlTagDescriptor[]
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}
```

:::warning Nota
Este hook no se invocará si estás utilizando un framework que tenga un manejo personalizado de los archivos de entrada (por ejemplo, [SvelteKit](https://github.com/sveltejs/kit/discussions/8269#discussioncomment-4509145)).
:::

### `handleHotUpdate`

- **Tipo:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`
  **Ver tambien:** [HMR API](./api-hmr)

  Realiza el manejo personalizado de actualizaciones de HMR. El hook recibe un objeto de contexto con la siguiente firma:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` es un array de módulos que se ven afectados por el archivo modificado. Es un array porque un solo archivo puede asignarse a múltiples módulos servidos (por ejemplo, Vue SFC).

  - `read` es una función de lectura asíncrona que devuelve el contenido del archivo. Esto se proporciona porque en algunos sistemas, la devolución de llamada de cambio de archivo puede activarse demasiado rápido antes de que el editor termine de actualizar el archivo y `fs.readFile` directo devolverá contenido vacío. La función de lectura pasada normaliza este comportamiento.

  El hook puede optar por:
  - Filtrar y reducir la lista de módulos afectados para que el HMR sea más preciso.

  - Devolver un array vacío y realizar una recarga completa:

  ```js
    handleHotUpdate({ server, modules, timestamp }) {
      const invalidatedModules = new Set()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(
          mod,
          invalidatedModules,
          timestamp,
          true
        )
      }
      server.ws.send({ type: 'full-reload' })
      return []
    }
  ```

  - Devolver un array vacío y realizar un manejo personalizado completo de HMR enviando eventos personalizados al cliente:

  ```js
  handleHotUpdate({ server }) {
    server.ws.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  El código del cliente debe registrar el controlador correspondiente utilizando la [API HMR](./api-hmr) (esto podría inyectarse mediante el hook `transform` del mismo plugin):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // perform custom update
    })
  }
  ```

## Orden de Plugins

Un plugin de Vite también puede especificar una propiedad `enforce` (similar a los cargadores de paquetes web) para ajustar su orden de aplicación. El valor de `enforce` puede ser `"pre"` o `"post"`. Los plugins resueltos estarán en el siguiente orden:

- Alias
- Plugins de usuario con `enforce: 'pre'`
- Plugins principales de Vite
- Plugins de usuario sin valor enforce
- Plugins de compilación de Vite
- Plugins de usuario con `enforce: 'post'`
- Plugins de compilación de publicaciones de Vite (minify, manifest, reporting)

Es importante tener en cuenta que esto es independiente del ordenamiento de los hooks, los cuales siguen estando sujetos por separado a su atributo `order` [como es habitual en los hooks de Rollup](https://rollupjs.org/plugin-development/#build-hooks).

## Solicitud Condicional

Por defecto, los plugins se invocan tanto para servir como para compilar. En los casos en que un plugin deba aplicarse condicionalmente solo durante el servicio o la construcción, use la propiedad `apply` para invocarlos solo durante la `'build'` o `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build', // or 'serve'
  }
}
```

También se puede utilizar una función para un control más preciso:

```js
apply(config, { command }) {
  // apply only on build but not for SSR
  return command === 'build' && !config.build.ssr
}
```

## Compatibilidad de Plugins Rollup

Una buena cantidad de plugins de Rollup funcionarán directamente como un plugin de Vite (por ejemplo, `@rollup/plugin-alias` o `@rollup/plugin-json`), pero no todos, ya que algunos hooks de plugin no tienen sentido en un contexto de servidor de desarrollo desacoplado.

En general, siempre que un plugin de Rollup cumpla con los siguientes criterios, debería funcionar como un plugin de Vite:

- No utiliza el hook [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed).
- No tiene un fuerte acoplamiento entre los hooks de fase de entrada y los hooks de fase de salida.

Si un plugin de Rollup solo tiene sentido para la fase de compilación, entonces se puede especificar en `build.rollupOptions.plugins`. Funcionará igual que un plugin de Vite con `enforce: 'post'` y `apply: 'build'`.

También puede aumentar un plugin de Rollup existente con propiedades exclusivas de Vite:

```js [vite.config.js]
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build',
    },
  ],
})
```

## Normalización de Rutas

Vite normaliza las rutas mientras resuelve las identificaciones para usar los separadores POSIX (/) mientras conserva el volumen en Windows. Por otro lado, Rollup mantiene intactas las rutas resueltas de manera predeterminada, por lo que las identificaciones resueltas tienen separadores win32 ( \\ ) en Windows. Sin embargo, los plugins de Rollup utilizan una [función de utilidad `normalizePath`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) de `@rollup/pluginutils` internamente, que convierte los separadores en POSIX antes de realizar comparaciones. Esto significa que cuando estos plugins se usan en Vite, el patrón de configuración `include` y `exclude` y otras rutas similares contra las comparaciones de identificadores resueltos funcionan correctamente.

Por lo tanto, para los plugins de Vite, al comparar rutas con identificadores resueltos, es importante normalizar primero las rutas para usar separadores POSIX. Una función de utilidad `normalizePath` equivalente se exporta desde el módulo `vite`.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## Filtrado, Patrón include/exclude

Vite expone la función `createFilter` de [`@rollup/pluginutils`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) para alentar a los plugins e integraciones específicos de Vite a usar el patrón de filtrado estándar include/exclude, que también se utiliza en el propio núcleo de Vite.

## Comunicación Cliente-Servidor

Desde Vite 2.9, proporcionamos algunas utilidades para plugins que ayudan a manejar la comunicación con los clientes.

### Servidor a Cliente

En el lado del plugin, podríamos usar `server.ws.send` para transmitir eventos al cliente:

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('connection', () => {
          server.ws.send('my:greetings', { msg: 'hello' })
        })
      },
    },
  ],
})
```

::: tip NOTA
Recomendamos **siempre prefijar** los nombres de tus eventos para evitar colisiones con otros plugins.
:::

En el lado del cliente, usa [`hot.on`](/guide/api-hmr.html#hot-on-event-cb) para escuchar los eventos:

```ts twoslash
import 'vite/client'
// ---cut---
// client side
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
  })
}
```

### Cliente a Servidor

Para enviar eventos del cliente al servidor, podemos usar [`hot.send`](/guide/api-hmr.html#hot-send-event-payload):

```ts
// client side
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

Luego usa `server.ws.on` y así escuchar los eventos en el lado del servidor:

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          // reply only to the client (if needed)
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      },
    },
  ],
})
```

### TypeScript para Eventos Personalizados

Internamente, Vite infiere el tipo de un payload a partir de la interfaz `CustomEventMap`, por lo que es posible tipar eventos personalizados mediante la extensión de la interfaz:

:::tip Nota
Asegúrate de incluir la extensión `.d.ts` al especificar archivos de declaración TypeScript. De lo contrario, TypeScript puede que no sepa qué archivo está intentando extender el módulo.
:::

```ts [events.d.ts]
import 'vite/types/customEvent.d.ts'

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'event-key': payload
  }
}
```

Esta extensión de interfaz es utilizada por `InferCustomEventPayload<T>` para inferir el tipo de payload para el evento `T`. Para obtener más información sobre cómo se utiliza esta interfaz, consulta la [Documentación de la API de HMR](./api-hmr#hmr-api).

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // El tipo de payload será { msg: string }
})
import.meta.hot?.on('unknown:event', (payload) => {
  // El tipo de payload será any
})
```
