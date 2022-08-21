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

### 431 Campos de la Cabecera de la Petición Demasiado Grandes

Cuando el servidor / el servidor WebSocket recibe una cabecera HTTP grande, la petición será descartada y se mostrará la siguiente advertencia.

> El servidor ha respondido con el código de estado 431. Ver https://es.vitejs.dev/guide/troubleshooting.html#431-campos-de-la-cabecera-de-la-petición-demasiado-grandes.

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

## Otros

### Se produce un error de sintaxis/error de tipo

Vite no puede manejar y no admite código que solo se ejecuta en modo no estricto (modo desapercibido). Esto se debe a que Vite usa ESM y siempre está en [modo estricto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) dentro de ESM.

Por ejemplo, es posible que veas estos errores.

> [ERROR] Las declaraciones With no se pueden usar con el formato de salida "esm" debido al modo estricto

> TypeError: no se puede crear la propiedad 'foo' en booleano 'false'

Si este código se usa dentro de las dependencias, podrías usar [`patch-package`](https://github.com/ds300/patch-package) (o [`yarn patch`](https://yarnpkg.com/cli/patch) o [`pnpm patch`](https://pnpm.io/cli/patch)) para una trampilla de escape.