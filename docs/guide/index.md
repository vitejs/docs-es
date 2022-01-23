<!-- # Getting Started -->

# Introducción

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

<!-- ## Overview -->

## Descripción General

<!-- Vite (French word for "quick", pronounced `/vit/`<button style="border:none;padding:3px;border-radius:4px" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><img src="/voice.svg" height="15"></button>, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts: -->

Vite (palabra en francés para "rápido", pronunciado como `/vit/`<button style="border:none;padding:3px;border-radius:4px" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><img src="/voice.svg" height="15"></button>, como "vit") es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y ágil para proyectos web modernos. Consta de dos partes principales:

<!-- - A dev server that provides [rich feature enhancements](./features) over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), for example extremely fast [Hot Module Replacement (HMR)](./features#hot-module-replacement).

- A build command that bundles your code with [Rollup](https://rollupjs.org), pre-configured to output highly optimized static assets for production.

Vite is opinionated and comes with sensible defaults out of the box, but is also highly extensible via its [Plugin API](./api-plugin) and [JavaScript API](./api-javascript) with full typing support.

You can learn more about the rationale behind the project in the [Why Vite](./why) section. -->

- Un servidor de desarrollo que proporciona [mejoras enriquecidas de funcionalidades](./features) sobre [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por ejemplo [Hot Module Replacement (HMR)](./features#hot-module-replacement) extremadamente rápido.

- Un comando de compilación que empaqueta tu código con [Rollup](https://rollupjs.org), preconfigurado para generar activos estáticos altamente optimizados para producción.

Vite es dogmático y viene con configuraciones predeterminadas listas para usar, pero también es altamente extensible a través de sus [API de complementos](./api-plugin) y [API de JavaScript](./api-javascript) con soporte completo de tipado.

Puedes obtener más información sobre la razón de ser del proyecto en la sección [Por qué Vite](./why).

<!-- ## Browser Support

- The default build targets browsers that support both [native ESM via script tags](https://caniuse.com/es6-module) and [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import). Legacy browsers can be supported via the official [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) - see the [Building for Production](./build) section for more details. -->

## Compatibilidad con navegadores

- La configuración de compilación predeterminada va dirigida a navegadores que admiten tanto [ESM nativo a través de etiquetas script](https://caniuse.com/es6-module) como [importación dinámica de ESM nativo](https://caniuse.com/es6-module-dynamic-import). Los navegadores obsoletos pueden ser sorportados a través del [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial; consulta [Compilar en producción](./build) para más detalles.

<!-- ## Trying Vite Online

You can try Vite online on [StackBlitz](https://vite.new/). It runs the Vite-based build setup directly in the browser, so it is almost identical to the local setup but doesn't require installing anything on your machine. You can navigate to `vite.new/{template}` to select which framework to use.

The supported template presets are: -->

## Probar Vite en línea

Puedes probar Vite en línea en [StackBlitz](https://vite.new/). Este ejecuta la configuración de compilación basada en Vite directamente en el navegador, por lo que es casi idéntica a la configuración local pero con la diferencia que no requieres instalar nada en tu máquina. Puedes navegar a `vite.new/{template}` para seleccionar qué marco de trabajo utilizar.

Los ajustes preestablecidos de plantilla admitidos son:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |

<!-- ## Scaffolding Your First Vite Project -->

## Monta tu primer proyecto Vite

<!-- ::: tip Compatibility Note
Vite requires [Node.js](https://nodejs.org/en/) version >=12.2.0. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
::: -->

::: tip Nota de compatibilidad
Vite requiere [Node.js](https://nodejs.org/en/) versión >=12.2.0 o superior. Sin embargo, algunas plantillas requieren una versión superior de Node.js para funcionar, por favor actualiza si tu gestor de paquetes te advierte sobre ello.
:::

Con NPM:

```bash
$ npm create vite@latest
```

Con Yarn:

```bash
$ yarn create vite
```

Con PNPM:

```bash
$ pnpm create vite
```

<!-- Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + Vue project, run: -->

¡Entonces sigue las instrucciones!

También puedes especificar directamente el nombre del proyecto y la plantilla que deseas usar a través de las opciones de línea de comandos adicionales. Por ejemplo, para montar un proyecto de Vite + Vue, ejecuta:

```bash
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

<!-- See [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) for more details on each supported template: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`. -->

Consulta [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) para más detalles sobre cada plantilla admitida: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`.

<!-- ## Community Templates -->

## Plantillas de la comunidad

<!-- create-vite is a tool to quickly start a project from a basic template for popular frameworks. Check out Awesome Vite for [community maintained templates](https://github.com/vitejs/awesome-vite#templates) that include other tools or target different frameworks. You can use a tool like [degit](https://github.com/Rich-Harris/degit) to scaffold your project with one of the templates. -->

create-vite es una herramienta para crear rápidamente un proyecto a partir de una plantilla básica para marcos de trabajo populares. Consulta Awesome Vite para [plantillas mantenidas por la comunidad](https://github.com/vitejs/awesome-vite#templates) que incluyen otras herramientas o apuntan a diferentes marcos de trabajo. Puedes usar una herramienta como [degit](https://github.com/Rich-Harris/degit) para montar tu proyecto con una de las plantillas.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

<!-- If the project uses `main` as the default branch, suffix the project repo with `#main` -->

Si el proyecto usa `main` como la rama por defecto, agrega el sufijo `#main` al repositorio del proyecto.

```bash
npx degit user/project#main my-project
```

<!-- ## `index.html` and Project Root

One thing you may have noticed is that in a Vite project, `index.html` is front-and-central instead of being tucked away inside `public`. This is intentional: during development Vite is a server, and `index.html` is the entry point to your application.

Vite treats `index.html` as source code and part of the module graph. It resolves `<script type="module" src="...">` that references your JavaScript source code. Even inline `<script type="module">` and CSS referenced via `<link href>` also enjoy Vite-specific features. In addition, URLs inside `index.html` are automatically rebased so there's no need for special `%PUBLIC_URL%` placeholders. -->

## `index.html` y raíz del proyecto

Una cosa que puedes haber notado es que en un proyecto de Vite, `index.html` es frontal y central en lugar de estar escondido dentro de `public`. Esto es intencional: durante el desarrollo, Vite es un servidor e `index.html` es el punto de entrada a tu aplicación.

Vite trata a `index.html` como código fuente y parte del gráfico de módulo. Esto resuelve a `<script type="module" src="...">` que hace referencia a tu código JavaScript. Incluso `<script type="module">` inline y el CSS referenciado a través de `<link href>` también disfrutan de características específicas de Vite. Además, las URLs dentro de `index.html` se reorganizan automáticamente, por lo que no se necesitan marcadores de posición especiales para `%PUBLIC_URL%`.

<!-- Similar to static http servers, Vite has the concept of a "root directory" which your files are served from. You will see it referenced as `<root>` throughout the rest of the docs. Absolute URLs in your source code will be resolved using the project root as base, so you can write code as if you are working with a normal static file server (except way more powerful!). Vite is also capable of handling dependencies that resolve to out-of-root file system locations, which makes it usable even in a monorepo-based setup.

Vite also supports [multi-page apps](./build#multi-page-app) with multiple `.html` entry points. -->

Similar a los servidores http estáticos, Vite tiene el concepto de un "directorio raíz" desde el cual se sirven tus archivos. Lo verás referenciado como `<root>` en el resto de la documentación. Las URL absolutas en el código se resolverán utilizando la raíz del proyecto como base, por lo que puedes escribir código como si estuvieras trabajando con un servidor de archivos estático normal (¡excepto que es mucho más poderoso!). Vite también es capaz de manejar dependencias que se resuelven en ubicaciones del sistema de archivos fuera de la raíz, lo que lo hace utilizable incluso en una configuración basada en monorepos.

Vite también admite [aplicaciones de múltiples páginas](./build#multi-page-app) con múltiples puntos de entrada `.html`.

<!-- #### Specifying Alternative Root

Running `vite` starts the dev server using the current working directory as root. You can specify an alternative root with `vite serve some/sub/dir`. -->

#### Especificar una raíz alternativa

Ejecutar `vite` inicia el servidor de desarrollo utilizando el directorio de trabajo actual como raíz. Puedes especificar una raíz alternativa con `vite serve some/sub/dir`.

<!-- ## Command Line Interface

In a project where Vite is installed, you can use the `vite` binary in your npm scripts, or run it directly with `npx vite`. Here is the default npm scripts in a scaffolded Vite project: -->

## Interfaz de línea de comandos

En un proyecto donde está instalado Vite, puedes usar el binario `vite` en tus scripts npm, o ejecutarlo directamente con `npx vite`. Estos son los scripts npm predeterminados en un proyecto de Vite ya montado:

<!-- prettier-ignore -->
```json5
{
  "scripts": {
    "dev": "vite", // inicia el servidor de desarrollo, aliases: `vite dev`, `vite serve`
    "build": "vite build", // compila en producción
    "preview": "vite preview" // vista previa local de compilación en producción
  }
}
```

<!-- You can specify additional CLI options like `--port` or `--https`. For a full list of CLI options, run `npx vite --help` in your project. -->

Puedes especificar opciones CLI adicionales como `--port` o `--https`. Para obtener una lista completa de las opciones de la CLI, ejecuta `npx vite --help` en tu proyecto.

<!-- ## Using Unreleased Commits

If you can't wait for a new release to test the latest features, you will need to clone the [vite repo](https://github.com/vitejs/vite) to your local machine and then build and link it yourself ([pnpm](https://pnpm.io/) is required): -->

## Uso de confirmaciones no publicadas

Si no puedes esperar una nueva versión para probar las funciones más recientes, deberás clonar el [repo de vite](https://github.com/vitejs/vite) en tu máquina local y luego compilarlo y vincularlo tu mismo. ([pnpm](https://pnpm.io/) es obligatorio):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # podrás utilizar el gestor de paquetes de tu preferencia
```

<!-- Then go to your Vite based project and run `pnpm link --global vite` (or the package manager that you used to link `vite` globally). Now restart the development server to ride on the bleeding edge! -->

Luego ve a tu proyecto basado en Vite y ejecuta `pnpm link --global vite` (o el gestor de paquetes que usaste para vincular `vite` globalmente). ¡Ahora reinicia el servidor de desarrollo para hacerlo funcionar!

<!-- ## Community

If you have questions or need help, reach out to the community at [Discord](https://discord.gg/4cmKdMfpU5) and [GitHub Discussions](https://github.com/vitejs/vite/discussions). -->

## Comunidad

Si tienes preguntas o necesitas ayuda, comunícate con la comunidad en [Discord](https://discord.gg/4cmKdMfpU5) y en [Discusiones de Github](https://github.com/vitejs/vite/discussions).
