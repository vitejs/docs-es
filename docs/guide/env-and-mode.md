# Variables y modos de entorno

## Variables de Entorno

Vite expone variables de entorno en el objeto especial **`import.meta.env`**. Algunas variables integradas están disponibles en todos los casos:

- **`import.meta.env.MODE`**: {string} el [modo](#modos) en el que se ejecuta la aplicación.

- **`import.meta.env.BASE_URL`**: {string} la URL base desde la que se sirve la aplicación. Esto está determinado por la [opción de configuración `base`](/config/shared-options#base).

- **`import.meta.env.PROD`**: {boolean} si la aplicación se ejecuta en producción.

- **`import.meta.env.DEV`**: {boolean} si la aplicación se está ejecutando en desarrollo (siempre lo contrario de `import.meta.env.PROD`)

- **`import.meta.env.SSR`**: {boolean} si la aplicación se ejecuta en el [servidor](./ssr.md#conditional-logic).

### Reemplazo en producción

En producción, estas variables de entorno se **reemplazan estáticamente**. Por lo tanto, es necesario referenciarlas siempre utilizando la cadena estática completa. Por ejemplo, el acceso a claves dinámicas como `import.meta.env[key]` no funcionará.

También se reemplazará estas cadenas que aparecen en las cadenas de JavaScript y las plantillas de Vue. Este debería ser un caso raro, pero puede ser involuntario. Es posible que veas errores como `Missing Semicolon` o `Unexpected token` en este caso, por ejemplo, cuando `"process.env.`<wbr>`NODE_ENV"` se transforma en `""development": "`. Hay formas de evitar este comportamiento:

- Para las cadenas de JavaScript, puedes dividir la cadena con un espacio Unicode de ancho cero, p. `'import.meta\u200b.env.MODE'`.

- Para las plantillas de Vue u otro HTML que se compila en cadenas de JavaScript, puedes usar la etiqueta [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr), por ejemplo, `import.meta.<wbr>env.MODE`.

## Archivos `.env`

Vite usa [dotenv](https://github.com/motdotla/dotenv) para cargar variables de entorno adicionales desde los siguientes archivos en su [directorio de entorno](/config/shared-options#envdir):

```
.env                # cargado en todos los casos
.env.local          # cargado en todos los casos, ignorado por git
.env.[mode]         # solo se carga en el modo especificado
.env.[mode].local   # solo se carga en el modo especificado, ignorado por git
```

:::tip Prioridades de carga

Un archivo env para un modo específico (por ejemplo, `.env.production`) tendrá mayor prioridad que uno genérico (por ejemplo, `.env`).

Además, las variables de entorno que ya existen cuando se ejecuta Vite tienen la prioridad más alta y no serán sobrescritas por los archivos `.env`. Por ejemplo, al ejecutar `VITE_SOME_KEY=123 vite build`.

Los archivos `.env` se cargan al inicio de Vite. Reinicia el servidor después de realizar cambios.
:::

Las variables de entorno cargadas también se exponen al código fuente del cliente a través de `import.meta.env` como cadenas.

Para evitar la filtración accidental de variables de entorno al cliente, solo las variables con el prefijo `VITE_` se exponen a su código procesado por Vite, por ejemplo, las siguientes variables de entorno:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Solo `VITE_SOME_KEY` se expondrá como `import.meta.env.VITE_SOME_KEY` en el código fuente del cliente, pero `DB_PASSWORD` no.

```js
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

Si deseas personalizar el prefijo de las variables env, consulta la opción [envPrefix](/config/shared-options#envprefix).

:::warning NOTAS DE SEGURIDAD

- Los archivos `.env.*.local` son solo locales y pueden contener variables confidenciales. Debes agregar `*.local` al `.gitignore` para evitar que se registren en git.

- Dado que cualquier variable expuesta al código fuente de Vite terminará en el paquete de cliente, las variables `VITE_*` _no_ deberían contener información confidencial.
:::

### IntelliSense para TypeScript

De forma predeterminada, Vite proporciona definiciones de tipo para `import.meta.env` en [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Si bien puedes definir más variables de entorno personalizadas en los archivos `.env.[mode]`, es posible que desees que IntelliSense funcione para las variables de entorno definidas por el usuario que tienen el prefijo `VITE_`.

Para hacerlo, puedes crear un `env.d.ts` en el directorio `src`, luego extender `ImportMetaEnv` de esta manera:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Si tu código se basa en tipos de entornos de navegador como [DOM](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts) y [WebWorker](https://github.com/microsoft/TypeScript/blob/main/lib/lib.webworker.d.ts), puedes actualizar el campo
[lib](https://www.typescriptlang.org/tsconfig#lib) en el `tsconfig.json`.

```json
{
  "lib": ["WebWorker"]
}
```

## Modos

De forma predeterminada, el servidor de desarrollo (comando `dev`) se ejecuta en modo `development` y los comandos `build` y `serve` se ejecutan en modo `production`.

Esto significa que al ejecutar `vite build`, cargará las variables de entorno de `.env.production` si hay una:

```
# .env.production
VITE_APP_TITLE=My App
```

En tu aplicación, puedes representar el título usando `import.meta.env.VITE_APP_TITLE`.

Sin embargo, es importante comprender que **mode** es un concepto más amplio que solo desarrollo frente a producción. Un ejemplo típico es que puedes querer tener un modo "staging" en el que se debería tener un comportamiento similar al de producción, pero con variables de entorno ligeramente diferentes a las de producción.

Puedes sobrescribir el modo predeterminado utilizado para un comando pasando el indicador de opción `--mode`. Por ejemplo, si deseas crear tu aplicación para nuestro modo staging hipotético:

```bash
vite build --mode staging
```

Y para obtener el comportamiento que queremos, necesitamos un archivo `.env.staging`:

```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)
```

Ahora tu aplicación de pruebas debería tener un comportamiento similar al de producción, pero mostrando un título diferente al de producción.
