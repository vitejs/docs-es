# Solución de problemas

Consulta la [guía de solución de problemas de Rollup](https://rollupjs.org/guide/en/#troubleshooting) para obtener más información también.

Si estas sugerencias no funcionan, prueba colocando tus preguntas en [las discusiones de GitHub](https://github.com/vitejs/vite/discussions) o en el canal `#help` de [ViteLand Discord](https://chat.vitejs.dev).

## CLI

### `Error: No se puede encontrar el módulo 'C:\foo\bar&baz\vite\bin\vite.js'`

La ruta a la carpeta de tu proyecto puede incluir `&`, que no funciona con `npm` en Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Necesitarás:

- Cambiar a otro gestor de paquetes (por ejemplo, `pnpm`, `yarn`)
- Eliminar `&` de la ruta a tu proyecto

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

### Ocurre un refresco completo en lugar de HMR

Si Vite o un complemento no maneja HMR, se producirá un refresco completo.

Además, si hay un bucle de dependencia, se producirá un refresco completo. Para resolver esto, intenta eliminar el bucle.

### Gran cantidad de actualizaciones de HMR en la consola

Esto puede deberse a una dependencia circular. Para resolver esto, intenta romper el bucle.

## Compilación

### El archivo integrado no funciona debido a un error de CORS

Si la salida del archivo HTML se abrió con el protocolo `file`, los scripts no se ejecutarán con el siguiente error.

> El acceso a la secuencia de comandos en 'file:///foo/bar.js' desde el origen 'null' ha sido bloqueado por la política de CORS: las solicitudes de origen cruzado solo se admiten para esquemas de protocolo: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Solicitud de origen cruzado bloqueada: la política del mismo origen no permite leer el recurso remoto en file:///foo/bar.js. (Razón: solicitud CORS no http).

Consulta [Motivo: la solicitud CORS no es HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) para obtener más información sobre por qué sucede esto.

Debes acceder al archivo con el protocolo `http`. La forma más fácil de lograr esto es ejecutar `npx vite preview`.

## Otros

### Se produce un error de sintaxis/error de tipo

Vite no puede manejar y no admite código que solo se ejecuta en modo no estricto (modo desapercibido). Esto se debe a que Vite usa ESM y siempre está en [modo estricto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) dentro de ESM.

Por ejemplo, es posible que veas estos errores.

> [ERROR] Las declaraciones With no se pueden usar con el formato de salida "esm" debido al modo estricto

> TypeError: no se puede crear la propiedad 'foo' en booleano 'false'

Si este código se usa dentro de las dependencias, podrías usar [`patch-package`](https://github.com/ds300/patch-package) (o [`yarn patch`](https://yarnpkg.com/cli/patch) o [`pnpm patch`](https://pnpm.io/cli/patch)) para una trampilla de escape.
