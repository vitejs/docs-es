# Variables de Entorno y Modos

Vite expone ciertas constantes bajo el objeto especial `import.meta.env`. Estas constantes se definen como variables globales durante el desarrollo y se reemplazan estáticamente en el momento de la compilación para que el tree-shaking sea efectivo.

:::details Example

```js
if (import.meta.env.DEV) {
  // El código aquí dentro se someterá a tree-shaking en las compilaciones de producción.
  console.log('Dev mode')
}
```

:::

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05an?via=vite" title="Variables de Entorno en Vite">Ver una lección interactiva en Scrimba</ScrimbaLink>

## Constantes Incorporadas

Algunas constantes incorporadas están disponibles en todos los casos:

- **`import.meta.env.MODE`**: {string} el [modo](#modes) en el que se está ejecutando la aplicación.

- **`import.meta.env.BASE_URL`**: {string} la URL base desde la que se sirve la aplicación. Esto está determinado por la [opción de configuración `base`](/config/shared-options.md#base).

- **`import.meta.env.PROD`**: {boolean} si la aplicación se está ejecutando en producción (ejecutando el servidor de desarrollo con `NODE_ENV='production'` o ejecutando una aplicación compilada con `NODE_ENV='production'`).

- **`import.meta.env.DEV`**: {boolean} si la aplicación se está ejecutando en desarrollo (siempre es lo opuesto a `import.meta.env.PROD`).

- **`import.meta.env.SSR`**: {boolean} si la aplicación se está ejecutando en el [servidor](./ssr.md#conditional-logic).

## Variables de Entorno

Vite expone las variables de entorno bajo el objeto `import.meta.env` como cadenas automáticamente.

Para evitar la filtración accidental de variables de entorno al cliente, solo las variables prefijadas con `VITE_` se exponen en el código procesado por Vite. Por ejemplo, para las siguientes variables de entorno:

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Solo `VITE_SOME_KEY` se expondrá como `import.meta.env.VITE_SOME_KEY` en el código fuente del cliente, pero `DB_PASSWORD` no.

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

Si deseas personalizar el prefijo de las variables de entorno, consulta la opción [envPrefix](/config/shared-options.html#envprefix).

:::tip Análisis de variables de entorno
Como se muestra arriba, `VITE_SOME_KEY` es un número pero devuelve una cadena cuando se analiza. Lo mismo ocurriría con las variables de entorno booleanas. Asegúrate de convertir al tipo deseado cuando las uses en tu código.
:::

### Archivos `.env`

Vite utiliza [dotenv](https://github.com/motdotla/dotenv) para cargar variables de entorno adicionales desde los siguientes archivos en tu [directorio de entorno](/config/shared-options.md#envdir):

```
.env                # se carga en todos los casos
.env.local          # se carga en todos los casos, ignorado por git
.env.[mode]         # solo se carga en el modo especificado
.env.[mode].local   # solo se carga en el modo especificado, ignorado por git
```

:::tip Prioridades de carga de variables de entorno

Un archivo de entorno para un modo específico (por ejemplo, `.env.production`) tendrá mayor prioridad que uno genérico (por ejemplo, `.env`).

Vite siempre cargará `.env` y `.env.local` además del archivo específico del modo `.env.[mode]`. Las variables declaradas en archivos específicos del modo tendrán prioridad sobre las de archivos genéricos, pero las variables definidas solo en `.env` o `.env.local` seguirán estando disponibles en el entorno.

Además, las variables de entorno que ya existen cuando se ejecuta Vite tienen la mayor prioridad y no serán sobrescritas por archivos `.env`. Por ejemplo, al ejecutar `VITE_SOME_KEY=123 vite build`.

Los archivos `.env` se cargan al inicio de Vite. Reinicia el servidor después de realizar cambios.

:::

:::warning Usuarios de Bun

Cuando uses [Bun](https://bun.sh), ten en cuenta que Bun carga automáticamente los archivos `.env` antes de que se ejecute tu script. Este comportamiento incorporado carga las variables de entorno directamente en `process.env` y puede interferir con la funcionalidad de Vite, que respeta los valores existentes en `process.env`. Consulta [oven-sh/bun#5515](https://github.com/oven-sh/bun/issues/5515) para obtener soluciones alternativas.

:::

Además, Vite utiliza [dotenv-expand](https://github.com/motdotla/dotenv-expand) para expandir variables escritas en archivos de entorno de forma predeterminada. Para obtener más información sobre la sintaxis, consulta [su documentación](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow).

Ten en cuenta que si deseas usar `$` dentro del valor de tu entorno, debes escaparlo con `\`.

```[.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

:::warning NOTAS DE SEGURIDAD

- Los archivos `.env.*.local` son solo locales y pueden contener variables sensibles. Debes agregar `*.local` a tu `.gitignore` para evitar que se suban a git.

- Dado que cualquier variable expuesta en tu código fuente de Vite terminará en tu paquete de cliente, las variables `VITE_*` no deben contener información sensible.

:::

::: details Expansión de variables en orden inverso

Vite admite la expansión de variables en orden inverso.
Por ejemplo, el archivo `.env` a continuación se evaluará como `VITE_FOO=foobar`, `VITE_BAR=bar`.

```[.env]
VITE_FOO=foo${VITE_BAR}
VITE_BAR=bar
```

Esto no funciona en scripts de shell y otras herramientas como `docker compose`.
Dicho esto, Vite admite este comportamiento ya que ha sido soportado por `dotenv-expand` durante mucho tiempo y otras herramientas en el ecosistema de JavaScript utilizan versiones antiguas que soportan este comportamiento.

Para evitar problemas de interoperabilidad, se recomienda evitar depender de este comportamiento. Vite podría comenzar a emitir advertencias por este comportamiento en el futuro.

:::

## IntelliSense para TypeScript

Por defecto, Vite proporciona definiciones de tipo para `import.meta.env` en [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Si bien puedes definir más variables de entorno personalizadas en archivos `.env.[mode]`, es posible que desees obtener IntelliSense de TypeScript para las variables de entorno definidas por el usuario que tienen el prefijo `VITE_`.

Para lograr esto, puedes crear un archivo `vite-env.d.ts` en el directorio `src`, y luego ampliar `ImportMetaEnv` de la siguiente manera:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Si tu código depende de tipos de entornos de navegador como [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) y [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts), puedes actualizar el campo [lib](https://www.typescriptlang.org/tsconfig#lib) en `tsconfig.json`.

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning Las importaciones romperán la ampliación de tipos

Si la ampliación de `ImportMetaEnv` no funciona, asegúrate de no tener ninguna declaración `import` en `vite-env.d.ts`. Consulta la [documentación de TypeScript](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined) para obtener más información.

:::

## Reemplazo de Constantes en HTML

Vite también admite el reemplazo de constantes en archivos HTML. Cualquier propiedad en `import.meta.env` puede usarse en archivos HTML con una sintaxis especial `%CONST_NAME%`:

```html
<h1>Vite se está ejecutando en %MODE%</h1>
<p>Usando datos de %VITE_API_URL%</p>
```

Si la variable de entorno no existe en `import.meta.env`, por ejemplo, `%NON_EXISTENT%`, se ignorará y no se reemplazará, a diferencia de `import.meta.env.NON_EXISTENT` en JS, donde se reemplaza como `undefined`.

Dado que Vite es utilizado por muchos frameworks, es intencionalmente no opinado sobre reemplazos complejos como condicionales. Vite puede extenderse utilizando [un plugin existente de la comunidad](https://github.com/vitejs/awesome-vite#transformers) o un plugin personalizado que implemente el hook [`transformIndexHtml`](./api-plugin#transformindexhtml).

## Modos

Por defecto, el servidor de desarrollo (`dev` command) se ejecuta en modo `development` y el comando `build` se ejecuta en modo `production`.

Esto significa que al ejecutar `vite build`, cargará las variables de entorno desde `.env.production` si existe:

```[.env.production]
VITE_APP_TITLE=Mi Aplicación
```

En tu aplicación, puedes renderizar el título usando `import.meta.env.VITE_APP_TITLE`.

En algunos casos, es posible que desees ejecutar `vite build` con un modo diferente para renderizar un título diferente. Puedes sobrescribir el modo predeterminado utilizado para un comando pasando la opción `--mode`. Por ejemplo, si deseas compilar tu aplicación para un modo de staging:

```bash
vite build --mode staging
```

Y crear un archivo `.env.staging`:

```[.env.staging]
VITE_APP_TITLE=Mi Aplicación (staging)
```

Como `vite build` ejecuta una compilación de producción por defecto, también puedes cambiar esto y ejecutar una compilación de desarrollo utilizando un modo diferente y una configuración de archivo `.env`:

```[.env.testing]
NODE_ENV=development
```

### NODE_ENV y Modos

Es importante tener en cuenta que `NODE_ENV` (`process.env.NODE_ENV`) y los modos son dos conceptos diferentes. Aquí se muestra cómo diferentes comandos afectan a `NODE_ENV` y al modo:

| Comando                                              | NODE_ENV        | Modo            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

Los diferentes valores de `NODE_ENV` y modo también se reflejan en sus propiedades correspondientes de `import.meta.env`:

| Comando                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| Comando              | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `NODE_ENV` en archivos `.env`

`NODE_ENV=...` se puede establecer en el comando, y también en tu archivo `.env`. Si `NODE_ENV` se especifica en un archivo `.env.[mode]`, el modo puede usarse para controlar su valor. Sin embargo, tanto `NODE_ENV` como los modos siguen siendo dos conceptos diferentes.

El principal beneficio de `NODE_ENV=...` en el comando es que permite a Vite detectar el valor temprano. También te permite leer `process.env.NODE_ENV` en tu configuración de Vite, ya que Vite solo puede cargar los archivos de entorno una vez que se evalúa la configuración.
:::
