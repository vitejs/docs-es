# Solución de problemas

Consulta la [guía de solución de problemas de Rollup](https://rollupjs.org/troubleshooting/) para obtener más información también.

Si estas sugerencias no funcionan, prueba colocando tus preguntas en [las discusiones de GitHub](https://github.com/vitejs/vite/discussions) o en el canal `#help` de [ViteLand Discord](https://chat.vitejs.dev).

## CJS

### API de Node para la compilación CJS de Vite, ahora obsoleto

La compilación CJS de la API de Node de Vite está obsoleta y se eliminará en Vite 6. Consulta la [discusión de GitHub](https://github.com/vitejs/vite/discussions/13928) correspondiente para obtener más contexto. En su lugar, debes actualizar tus archivos o frameworks para importar la compilación ESM de Vite.

En un proyecto básico de Vite, asegúrate que:

1. El contenido del archivo `vite.config.js` utiliza la sintaxis ESM.
2. El archivo `package.json` más cercano tiene `"type": "module"`, o usa la extensión `.mjs`/`.mts`, por ejemplo, `vite.config.mjs` o `vite.config.mts`.

Para otros proyectos, existen algunos enfoques generales:

- **Configura ESM como predeterminado, optar por CJS si es necesario:** Agrega `"type": "module"` en el
  `package.json` del proyecto. Todos los archivos `*.js` ahora se interpretan como ESM y deben utilizar la sintaxis de ESM. Puedes cambiar el nombre de un archivo con la extensión `.cjs` para seguir usando CJS.
- **Mantén CJS como predeterminado, optar por ESM si es necesario:** Si el `package.json` del proyecto no tiene `"type": "module"`, todos los archivos `*.js` se interpretan como CJS. Puedes cambiar el nombre de un archivo con la extensión `.mjs` para usar ESM en su lugar.
- **Importar Vite dinámicamente:** Si necesitas seguir usando CJS, puedes importar Vite dinámicamente usando `import('vite')` en su lugar. Esto requiere que tu código esté escrito en un contexto "asíncrono", pero aún así debería ser manejable ya que la API de Vite es en su mayoría asíncrona.

Si no estás seguro de dónde proviene la advertencia, puedes ejecutar el script con el indicador `VITE_CJS_TRACE=true` para registrar el seguimiento de la pila:

```bash
VITE_CJS_TRACE=true vite dev
```

Si deseas ignorar temporalmente la advertencia, puedes ejecutar el script con el indicador `VITE_CJS_IGNORE_WARNING=true`:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Ten en cuenta que los archivos de configuración postcss aún no soportan ESM + TypeScript (`.mts` o `.ts` en `"type": "module"`). Si tienes configuraciones postcss con `.ts` y agregaste `"type": "module"` al `package.json`, también debes cambiar el nombre de la configuración postcss para usar `.cts`.

## CLI

### `Error: No se puede encontrar el módulo 'C:\foo\bar&baz\vite\bin\vite.js'`

La ruta a la carpeta de tu proyecto puede incluir `&`, que no funciona con `npm` en Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Necesitarás:

- Cambiar a otro gestor de paquetes (por ejemplo, `pnpm`, `yarn`)
- Eliminar `&` de la ruta a tu proyecto

## Configuración

### Este paquete es solo ESM

Cuando se importa un paquete solo ESM con `require`, ocurre el siguiente error:

> No se pudo resolver "foo". Este paquete es solo ESM pero se intentó cargar con `require`.

> "foo" se resolvió como un archivo ESM. Los archivos ESM no se pueden cargar con require.

Los archivos ESM no se pueden cargar mediante [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>).

Recomendamos convertir tu configuración a ESM siguiendo una de estas opciones:

- Añade `"type": "module"` al archivo `package.json` más cercano.
- Renombra `vite.config.js`/`vite.config.ts` a `vite.config.mjs`/`vite.config.mts`

## Servidor de desarrollo

### Las solicitudes se congelan para siempre

Si estás utilizando Linux, los límites del descriptor de archivo y los límites de inotify pueden estar causando el problema. Como Vite no empaqueta la mayoría de los archivos, los navegadores pueden solicitar muchos archivos que requieren muchos descriptores de archivo, superando el límite.

Para resolver esto:

- Aumenta el límite del descriptor de archivo con `ulimit`

  ```shell
  # Verifica el límite actual
  $ ulimit -Sn
  # Cambia el límite (temporal)
  $ ulimit -Sn 10000 # Es posible que también debas cambiar el límite estricto
  # Reinicia tu navegador
  ```

- Aumenta los siguientes límites relacionados con inotify con `sysctl`

  ```shell
  # Verifica el límite actual
  $ sysctl fs.inotify
  # Cambia el límite (temporal)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

  Si los pasos anteriores no funcionan, puedes intentar agregar `DefaultLimitNOFILE=65536` como una configuración sin comentarios a los siguientes archivos:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Para Linux Ubuntu, es posible que debas agregar la línea `* - nofile 65536` al archivo `/etc/security/limits.conf` en lugar de actualizar los archivos de configuración de systemd.

Ten en cuenta que estas configuraciones persisten pero **se requiere un reinicio**.

### Las solicitudes de red dejan de cargarse

Al usar un certificado SSL autofirmado, Chrome ignora todas las directivas de almacenamiento en caché y vuelve a cargar el contenido. Vite se basa en estas directivas de almacenamiento en caché.

Para resolver el problema, utiliza un certificado SSL de confianza.

Consulta: [Problemas de caché](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Problemas de Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### MacOS

Puedes instalar un certificado de confianza a través de la CLI con este comando:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

O importándolo a la aplicación Acceso a Llaveros y actualizando la configuración de confianza del certificado a "Confiar siempre".

### 431 Campos de la Cabecera de la Petición Demasiado Grandes

Cuando el servidor / el servidor WebSocket recibe una cabecera HTTP grande, la petición será descartada y se mostrará la siguiente advertencia.

> El servidor ha respondido con el código de estado 431. Ver https://es.vitejs.dev/guide/troubleshooting.html#_431-campos-de-la-cabecera-de-la-peticion-demasiado-grandes.

Esto se debe a que Node.js limita el tamaño del encabezado de la solicitud para mitigar [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121).

Para evitar esto, intenta reducir el tamaño del encabezado de la solicitud. Por ejemplo, si la cookie es larga, elimínala. O puedes usar [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) para cambiar el tamaño máximo de la cabecera.

## HMR

### Vite detecta un cambio de archivo pero el HMR no funciona

Es posible que estés importando un archivo con un caso diferente. Por ejemplo, `src/foo.js` existe y `src/bar.js` contiene:

```js
import './Foo.js' // debe ser './foo.js'
```

Problema relacionado: [#964](https://github.com/vitejs/vite/issues/964)

### Vite no detecta un cambio de archivo

Si estás ejecutando Vite con WSL2, Vite no puede ver los cambios de archivos en algunas condiciones. Ver [opción `server.watch`](/config/server-options.md#server-watch).

### Ocurre una recarga completa en lugar de HMR

Si Vite o un plugin no manejan HMR, se producirá una recarga completa, ya que es la única forma de actualizar el estado.

Si se maneja HMR pero está dentro de una dependencia circular, también se realizará una recarga completa para recuperar la orden de ejecución. Para resolver esto, intenta romper el ciclo. Puedes ejecutar `vite --debug hmr` para registrar la ruta de dependencia circular si un cambio de archivo la activó.

### Gran cantidad de actualizaciones de HMR en la consola

Esto puede deberse a una dependencia circular. Para resolver esto, intenta romper el bucle.

## Compilación

### El archivo integrado no funciona debido a un error de CORS

Si la salida del archivo HTML se abrió con el protocolo `file`, los scripts no se ejecutarán con el siguiente error.

> El acceso a la secuencia de comandos en 'file:///foo/bar.js' desde el origen 'null' ha sido bloqueado por la política de CORS: las solicitudes de origen cruzado solo se admiten para esquemas de protocolo: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Solicitud de origen cruzado bloqueada: la política del mismo origen no permite leer el recurso remoto en file:///foo/bar.js. (Razón: solicitud CORS no http).

Consulta [Motivo: la solicitud CORS no es HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) para obtener más información sobre por qué sucede esto.

Debes acceder al archivo con el protocolo `http`. La forma más fácil de lograr esto es ejecutar `npx vite preview`.

## Dependencias optimizadas

### Dependencias preempaquetadas desactualizadas al vincularlas a un paquete local

La clave hash utilizada para invalidar las dependencias optimizadas depende del contenido del package lock, los parches aplicados a las dependencias y las opciones en el archivo de configuración de Vite que afecta el empaquetado de módulos de Node. Esto significa que Vite detectará cuándo se invalida una dependencia mediante una característica como [invalidaciones de npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), y volverá a empaquetar las dependencias en el próximo inicio del servidor. Vite no invalidará las dependencias cuando utilices una función como [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link). En caso de que vincules o desvincules una dependencia, deberás forzar la reoptimización en el próximo inicio del servidor usando `vite --force`. En su lugar, recomendamos usar invalidaciones, que ahora son compatibles con todos los gestores de paquetes (consulta también [invalidaciones de pnpm](https://pnpm.io/package_json#pnpmoverrides) y [resoluciones de yarn](https://yarnpkg.com/configuration/manifest/#resolutions)).

## Cuellos de botella en el rendimiento

Si sufres cuellos de botella en el rendimiento de la aplicación que resultan en tiempos de carga lentos, puedes iniciar el inspector integrado de Node.js con tu servidor de desarrollo de Vite o al compilar tu aplicación para crear el perfil de la CPU:

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Servidor de desarrollo de Vite
Una vez que la aplicación se abra en el navegador, simplemente espera a que termine de cargar y luego regresa a la terminal y presiona la tecla `p` (detendrá el inspector de Node.js), luego presiona la tecla `q` para detener el servidor de desarrollo.
:::

El inspector de Node.js generará `vite-profile-0.cpuprofile` en la carpeta raíz, ve a https://www.speedscope.app/ y sube el perfil de la CPU usando el botón `BROWSE` para inspeccionar el resultado.

Puedes instalar [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect), que te permite inspeccionar el estado intermedio de los plugins de Vite y también puede ayudarte a identificar qué plugins o middlewares están generando el cuello de botella en tus aplicaciones. El plugin se puede usar tanto en modo de desarrollo como compilado. Consulta el archivo readme para obtener más detalles.

## Otros

### Módulo externalizado para compatibilidad con navegadores

Cuando usas un módulo de Node.js en el navegador, Vite mostrará la siguiente advertencia.

> El módulo "fs" se ha externalizado para compatibilidad con el navegador. No se puede acceder a "fs.readFile" en el código del cliente.

Esto se debe a que Vite no reinserta automáticamente los módulos de Node.js.

Recomendamos evitar el uso de módulos de Node.js para código del navegador para reducir el tamaño del paquete, aunque puedes agregar polyfills manualmente. Si el módulo se importa desde una biblioteca de terceros (que está destinado a ser utilizado en el navegador), se recomienda informar el problema a la biblioteca respectiva.

### Se produce un error de sintaxis/error de tipo

Vite no puede manejar y no admite código que solo se ejecuta en modo no estricto (modo desapercibido). Esto se debe a que Vite usa ESM y siempre está en [modo estricto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) dentro de ESM.

Por ejemplo, es posible que veas estos errores.

> [ERROR] Las declaraciones With no se pueden usar con el formato de salida "esm" debido al modo estricto

> TypeError: no se puede crear la propiedad 'foo' en booleano 'false'

Si este código se usa dentro de las dependencias, podrías usar [`patch-package`](https://github.com/ds300/patch-package) (o [`yarn patch`](https://yarnpkg.com/cli/patch) o [`pnpm patch`](https://pnpm.io/cli/patch)) para una trampilla de escape.

### Extensiones del navegador

Algunas extensiones del navegador (como los bloqueadores de anuncios) pueden evitar que el cliente de Vite envíe solicitudes al servidor de desarrollo de Vite. Es posible que veas una pantalla blanca sin errores en este caso. Intenta deshabilitar las extensiones si tienes este problema.

### Enlaces cruzados entre unidades en Windows

Si hay enlaces cruzados entre unidades en tu proyecto en Windows, es posible que Vite no funcione.

Un ejemplo de enlaces cruzados entre unidades son:

- una unidad virtual enlazada a una carpeta mediante el comando `subst`
- un enlace simbólico/junción a una unidad diferente mediante el comando `mklink` (por ejemplo, la caché global de Yarn)

Issue relacionada: [#10802](https://github.com/vitejs/vite/issues/10802)
