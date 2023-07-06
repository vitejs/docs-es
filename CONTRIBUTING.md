# Guía de contribución de Vite

¡Hola! Estamos muy emocionados de que estés interesado en contribuir con Vite. Antes de enviar tu contribución, tómate un momento para leer la siguiente guía. También te sugerimos que leas la [Filosofía del Proyecto](https://es.vitejs.dev/guide/filosofia) en nuestra documentación.

## Configuración del repositorio

El repositorio de Vite es un monorepo que utiliza espacios de trabajo pnpm. El administrador de paquetes utilizado para instalar y vincular las dependencias debe ser [pnpm](https://pnpm.io/).

Para desarrollar y probar el paquete central `vite`:

1. Ejecuta `pnpm i` en la carpeta raíz de Vite

2. Ejecuta `pnpm run build` en la carpeta raíz de Vite.

3. Si estás desarrollando con Vite mismo, puedes ir a `packages/vite` y ejecutar `pnpm run dev` para recompilar automáticamente Vite siempre que cambie el código.

También puedes usar [Vite.js Docker Dev](https://github.com/nystudio107/vitejs-docker-dev) para una configuración de Docker en contenedores para el desarrollo de Vite.js.

## Depuración

Si deseas usar el punto de interrupción y explorar la ejecución del código, puede usar la funcionalidad ["Ejecutar y depurar"](https://code.visualstudio.com/docs/editor/debugging) de Visual Studio Code.

1. Agrega una declaración `debugger` donde desees detener la ejecución del código.

2. Has clic en el icono "Ejecutar y depurar" en la barra de actividad del editor.

3. Has clic en el botón "Terminal de depuración de JavaScript".

4. Abrirás una terminal, luego irás a `playground/xxx` y ejecutarás `pnpm run dev`.

5. La ejecución se detendrá y usarás la [barra de herramientas de depuración](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) para continuar, pasar por alto, reiniciar el proceso...

### Errores de depuración en las pruebas de Jest usando Playwright (Chromium)

Algunos errores están enmascarados y ocultos debido a las capas de abstracción y la naturaleza de espacio aislado agregadas por Jest, Playwright y Chromium. Para ver lo que realmente está fallando y el contenido de la consola de devtools en esos casos, sigue esta configuración:

1. Agrega una declaración `debugger` al hook `scripts/jestPerTestSetup.ts` -> `afterAll`. Esto detendrá la ejecución antes de que finalicen las pruebas y se cierre la instancia del navegador Playwright.

2. Ejecuta las pruebas con el comando de script `debug-serve` que habilitará la depuración remota: `pnpm run debug-serve -- --runInBand resolve`.

3. Espera a que se abran las herramientas de desarrollo del inspector en el navegador y que se adjunte el depurador.

4. En el panel de fuentes en la columna de la derecha, has clic en el botón de reproducción para reanudar la ejecución y permitir que se ejecuten las pruebas que abrirán una instancia de Chromium.

5. Centrándose en la instancia de Chromium, puedes abrir las herramientas de desarrollo del navegador e inspeccionar la consola allí para encontrar los problemas relacionados.

6. Para cerrar todo, simplemente deten el proceso de prueba en el terminal.

## Probando Vite contra paquetes externos

Es posible que desees probar tu copia modificada localmente de Vite con otro paquete creado con Vite. Para pnpm, después de compilar Vite, puede usar [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides). Ten en cuenta que `pnpm.overrides` debe especificarse en la raíz `package.json` y primero debes enumerar el paquete como una dependencia en la raíz `package.json`:

```json
{
  "dependencies": {
    "vite": "^2.0.0"
  },
  "pnpm": {
    "overrides": {
      "vite": "link:../path/to/vite/packages/vite"
    }
  }
}
```

Y vuelve a ejecutar `pnpm install` para vincular el paquete.

## Ejecución de pruebas

### Pruebas de integración

Cada paquete en `playground/` contiene un directorio `__tests__`. Las pruebas se ejecutan usando [Jest](https://jestjs.io/) + [Playwright](https://playwright.dev/) con integraciones personalizadas para simplificar las pruebas de escritura. La configuración detallada se encuentra dentro de los archivos `jest.config.js` y `scripts/jest*`.

Antes de ejecutar las pruebas, asegúrate de que [Vite haya compilado](#repo-setup). En Windows, es posible que desees [activar el modo de desarrollador](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) para resolver [problemas con creación de enlaces simbólicos para no administradores](https://github.com/vitejs/vite/issues/7390). También es posible que desees [configurar `core.symlinks` de git en `true` para resolver problemas con enlaces simbólicos](https://github.com/vitejs/vite/issues/5242).

Cada prueba de integración se puede ejecutar en el modo servidor de desarrollo o en el modo de compilación.

- `pnpm test` por defecto ejecuta todas las pruebas de integración tanto en modo serve como build, y también pruebas unitarias.

- `pnpm run test-serve` ejecuta pruebas solo en modo serve. Esto es simplemente llamar a `jest` para que pueda pasar cualquier bandera de Jest a este comando. Dado que Jest intentará ejecutar pruebas en paralelo, si tu máquina tiene muchos núcleos, esto puede causar fallas de prueba irregulares con varias instancias de Playwright ejecutándose al mismo tiempo. Puedes forzar que las pruebas se ejecuten en serie con `pnpm run test-serve --runInBand`.

- `pnpm run test-build` ejecuta pruebas solo en modo build.

- También puede usar `pnpm run test-serve -- [match]` o `pnpm run test-build -- [match]` para ejecutar pruebas en un playground específico, por ejemplo, `pnpm run test-serve -- asset` ejecutará pruebas para `playground/asset` y `vite/src/node/__tests__/asset` en modo serve y `vite/src/node/__tests__/**/*` simplemente lo ejecuta en modo serve.

  Ten en cuenta que la coincidencia de paquetes no está disponible para el script `pnpm test`, que siempre ejecuta todas las pruebas.

### Pruebas unitarias

Además de las pruebas en `playground/` para las pruebas de integración, los paquetes pueden contener pruebas unitarias en su directorio `__tests__`. Las pruebas unitarias funcionan con [Vitest](https://vitest.dev/). La configuración detallada está dentro de los archivos `vitest.config.ts`.

- `pnpm run test-unit` ejecuta pruebas unitarias en cada paquete.

- También puede usar `pnpm run test-unit -- [match]` para ejecutar pruebas relacionadas.

### Entorno de prueba y helpers

Dentro de los playground de pruebas, un objeto `page` global está disponible automáticamente, que es una instancia de Playwright [`Page`](https://playwright.dev/docs/api/class-page) que ya ha navegado a la página servida de playground actual. Así que escribir una prueba es tan simple como:

```js
test('should work', async () => {
  expect(await page.textContent('.foo')).toMatch('foo')
})
```

Algunos helpers de prueba comunes, como `testDir`, `isBuild` o `editFile` están disponibles en `playground/testUtils.ts`.

Nota: El entorno de compilación de prueba utiliza un [set predeterminado de configuración de Vite](https://github.com/vitejs/vite/blob/9c6501d9c363eaa3c1e7708d531fb2a92b633db6/scripts/jestPerTestSetup.ts#L102-L122) diferente para omitir la transpilación durante las pruebas para hacerlo más rápido. Esto puede producir un resultado diferente en comparación con la compilación de producción predeterminada.

### Ampliación de la suite de pruebas

Para agregar nuevas pruebas, debes encontrar un playground relacionado con la corrección o función (o crear una nueva). Como ejemplo, la carga de recursos estáticos se prueba en el [playground de recursos](https://github.com/vitejs/vite/tree/main/playground/assets). En esta aplicación de Vite, hay una prueba para las importaciones `?raw`, con [una sección definida en `index.html`](https://github.com/vitejs/vite/blob/71215533ac60e8ff566dc3467feabfc2c71a01e2/playground/assets/index.html#L121) para ello:

```html
<h2>?raw import</h2>
<code class="raw"></code>
```

Esto se modificará [con el resultado de la importación de un archivo](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L151):

```js
import rawSvg from './nested/fragment.svg?raw'
text('.raw', rawSvg)
```

Donde la utilidad `text` se define como:

```js
function text(el, text) {
  document.querySelector(el).textContent = text
}
```

En las [pruebas de especificaciones](https://github.com/vitejs/vite/blob/main/playground/assets/__tests__/assets.spec.ts#L180), las modificaciones al DOM enumeradas anteriormente se usan para probar esta funcionalidad:

```js
test('?raw import', async () => {
  expect(await page.textContent('.raw')).toMatch('SVG')
})
```

## Nota sobre las pruebas de dependencias

En muchos casos de prueba, necesitamos simular dependencias usando los protocolos `link:` y `file:` (que son compatibles con gestores de paquetes como `yarn` y `pnpm`). Sin embargo, `pnpm` trata `link:` y `file:` de la misma manera y siempre usa enlaces simbólicos. Esto puede no ser deseable en los casos en los que queremos que la dependencia se copie realmente en `node_modules`.

Para evitar esto, los playground de paquetes que usan el protocolo `file:` también deben incluir el siguiente script `postinstall`:

```jsonc
"scripts": {
  //...
  "postinstall": "ts-node ../../scripts/patchFileDeps.ts"
}
```

Este script parchea las dependencias usando el protocolo `file:` para que coincida con el comportamiento de copia en lugar de vincularlo.

## Registro de depuración

Puedes configurar la variable de entorno `DEBUG` para activar los registros de depuración. Por ejemplo, `DEBUG="invitar:resolver"`. Para ver todos los registros de depuración, puedes configurar `DEBUG="vite:*"`, pero ten en cuenta que será bastante "ruidoso". Puedes ejecutar `grep -r "createDebugger('vite:" packages/vite/src/` para ver una lista de los ámbitos de depuración disponibles.

## Directrices de solicitudes de cambios

- Has checkout de una rama temporal desde una rama base, por ejemplo, `main`, y has merge de nuevo a esa rama.

- Si agregas una nueva funcionalidad:

  - Agrega el caso de prueba adjunto.
  - Proporciona una razón convincente para agregar esta función. Idealmente, primero debes abrir una sugerencia de problema y haberlo aprobado antes de trabajar en él.

- Si corriges un error:

  - Si estás resolviendo un problema especial, agrega `(fix #xxxx[,#xxxx])` (#xxxx es la identificación del problema) en el título de la solicitud de cambio para obtener un mejor registro de publicación, por ejemplo `fix: update entities encoding/decoding (fix #3899)`.
  - Proporciona una descripción detallada del error en la solicitud de cambio. Es preferible una demostración en vivo.
  - Agrega la cobertura de prueba adecuada si corresponde.

- Está bien tener varios commits pequeños mientras trabajas en la solicitud de cambio - GitHub puede combinarlos automáticamente antes de fusionarlos.

- ¡Asegúrate de pasar las pruebas!

- Los mensajes de confirmación deben seguir la [convención de mensajes de confirmación](./.github/commit-convention.md) para que los registros de cambios se puedan generar automáticamente. Los mensajes de confirmación se validan automáticamente antes de la confirmación (invocando [Git Hooks](https://git-scm.com/docs/githooks) a través de [yorkie](https://github.com/yyx990803/yorkie)).

- No es necesario que te preocupes por el estilo del código siempre que hayas instalado las dependencias de desarrollo: los archivos modificados se formatean automáticamente con Prettier al hacer commit (invocando [Git Hooks](https://git-scm.com/docs/githooks) a través de [yorkie](https://github.com/yyx990803/yorkie)).

## Directrices de mantenimiento

> La siguiente sección es principalmente para los mantenedores que tienen acceso de commits, pero es útil revisarla si tienes la intención de hacer contribuciones no triviales al código base.

### Flujo de trabajo de evaluación de errores

![issue-workflow](https://github.com/vitejs/vite/raw/main/.github/issue-workflow.png)

### Flujo de trabajo de revisión de pull requests

![issue-workflow](https://github.com/vitejs/vite/raw/main/.github/pr-workflow.png)

## Notas sobre las dependencias

Vite pretende ser ligero, y esto incluye conocer la cantidad de dependencias npm y su tamaño.

¡Usamos rollup para preempaquetar la mayoría de las dependencias antes de publicar! Por lo tanto, la mayoría de las dependencias, incluso las que se usan en el código src, deben agregarse en `devDependencies` de forma predeterminada. Esto también crea una serie de restricciones que debemos tener en cuenta en el código base:

### Uso de `require()`

En algunos casos, intencionalmente requerimos algunas dependencias para mejorar el rendimiento de inicio. Sin embargo, ten en cuenta que no podemos usar llamadas `require('somedep')` simples, ya que se ignoran en los archivos ESM, por lo que la dependencia no se incluirá en el paquete, y la dependencia real ni siquiera estará allí cuando se publique, ya que están en `devDependencies`.

En su lugar, usa `(await import('somedep')).default`.

### Piensa antes de agregar una dependencia

La mayoría de las dependencias deben agregarse a `devDependencies` incluso si se necesitan en tiempo de ejecución. Algunas excepciones son:

- Paquetes de tipos. Ejemplo: `@types/*`.
- Dependencias que no se pueden empaquetar correctamente debido a archivos binarios. Ejemplo: `esbuild`.
- Dependencias que traen sus propios tipos, y su tipo se usa en los tipos públicos propios de vite. Ejemplo: `rollup`.

Evita las dependencias que tengan dependencias transitivas grandes que resulten en un tamaño demasiado grande en comparación con la funcionalidad que proporcionas. Por ejemplo, `http-proxy` en sí mismo más `@types/http-proxy` tiene un tamaño de poco más de 1 MB, pero `http-proxy-middleware` trae un montón de dependencias que lo convierte en 7MB (!) El middleware personalizado sobre `http-proxy` solo requiere un par de líneas de código.

### Asegurate del soporte de tipos

Vite tiene como objetivo ser totalmente utilizable como una dependencia en un proyecto de TypeScript (por ejemplo, debe proporcionar tipos adecuados para VitePress), y también en `vite.config.ts`. Esto significa técnicamente que una dependencia cuyos tipos están expuestos debe ser parte de `dependencies` en lugar de `devDependencies`. Sin embargo, esto significa que no podremos empaquetarlo.

Para evitar esto, integramos algunos de estos tipos de dependencias en `packages/vite/src/types`. De esta manera, aún podemos exponer el tipo al empaquetar el código fuente de la dependencia.

Utiliza `pnpm run check-dist-types` para verificar que los tipos empaquetados no dependan de los tipos en `devDependencies`. Si agregas `dependencies`, asegúrate de configurar `tsconfig.check.json`.

Para los tipos compartidos entre el cliente y node, estos deben agregarse en `packages/vite/types`. Estos tipos no están empaquetados y se publican tal cual (aunque todavía se consideran internos). Los tipos de dependencia dentro de este directorio (por ejemplo, `packages/vite/types/chokidar.d.ts`) están en desuso y deben agregarse a `packages/vite/src/types` en su lugar.

### Piensa antes de agregar otra opción más

Ya tenemos muchas opciones de configuración, y debemos evitar solucionar un problema agregando otro más. Antes de agregar una opción, trata de pensar en:

- Si realmente vale la pena abordar el problema
- Si el problema se puede solucionar con un valor predeterminado más inteligente
- Si el problema tiene una solución utilizando las opciones existentes
- Si el problema se puede abordar con un complemento en su lugar

## Contribución de traducción de documentación

Si deseas comenzar una traducción en tu idioma, ¡puede contribuir! Únete al [canal de #traducciones en Vite Land](https://chat.vitejs.dev) para discutir y coordinar con otros.

Las documentaciones en inglés están integradas en el repositorio principal de Vite, para permitir que los contribuyentes trabajen en documentaciones, pruebas y despliegue en la misma solicitud de cambio. Las traducciones se realizan clonando el repositorio principal.

### Cómo iniciar un repositorio de traducción

1. Para obtener todos los archivos de documentación, primero debes clonar este repositorio en tu cuenta personal.
2. Guarda todos los archivos en `docs/` y elimina todo lo demás.

   - Debes configurar tu sitio de traducción en función de todos los archivos en la carpeta `docs/` como un proyecto de VitePress.
     (Dicho esto, `package.json` es necesario).

   - Actualiza el historial de git eliminando `.git` y luego `git init`

3. Traduce la documentación.

   - Durante esta etapa, puedes estar traduciendo documentación y sincronizando actualizaciones al mismo tiempo, pero no te preocupe por eso, es muy común en la contribución de traducciones.

4. Envía tus commits a tu repositorio de GitHub. También puedes configurar una vista previa de netlify.
5. Usa la herramienta [Ryu-cho](https://github.com/vuejs-translations/ryu-cho) para configurar una acción de GitHub, rastrear automáticamente la actualización de documentación en inglés más adelante.

Recomendamos hablar con otros usuarios en Vite Land para que encuentres más colaboradores para tu idioma y así compartir el trabajo de mantenimiento. Una vez que se haya realizado la traducción, comunícalo al equipo de Vite para que el repositorio se pueda mover a la organización oficial de vitejs en GitHub.
