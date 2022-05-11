# Introducción

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Descripción General

Vite (palabra en francés para "rápido", pronunciado como `/vit/`<button style="border:none;padding:3px;border-radius:4px" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><img src="/voice.svg" height="15"></button>, como "veet") es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y ágil para proyectos web modernos. Consta de dos partes principales:

- Un servidor de desarrollo que proporciona [mejoras enriquecidas de funcionalidades](./features) sobre [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por ejemplo [Hot Module Replacement (HMR)](./features#hot-module-replacement) extremadamente rápido.

- Un comando de compilación que empaqueta tu código con [Rollup](https://rollupjs.org), preconfigurado para generar activos estáticos altamente optimizados para producción.

Vite es dogmático y viene con configuraciones predeterminadas listas para usar, pero también es altamente extensible a través de sus [API de complementos](./api-plugin) y [API de JavaScript](./api-javascript) con soporte completo de tipado.

Puedes obtener más información sobre la razón de ser del proyecto en la sección [Por qué Vite](./why).

## Compatibilidad con navegadores

- La configuración de compilación predeterminada va dirigida a navegadores que admiten tanto [ESM nativo a través de etiquetas script](https://caniuse.com/es6-module) como [importación dinámica de ESM nativo](https://caniuse.com/es6-module-dynamic-import). Los navegadores obsoletos pueden ser sorportados a través del [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial; consulta [Compilar en producción](./build) para más detalles.

## Probar Vite en línea

Puedes probar Vite en línea en [StackBlitz](https://vite.new/). Éste ejecuta la configuración de compilación basada en Vite directamente en el navegador, por lo que es casi idéntica a la configuración local pero con la diferencia que no requiere que instales nada en tu máquina. Puedes navegar a `vite.new/{template}` para seleccionar qué marco de trabajo utilizar.

Los ajustes preestablecidos de plantilla admitidos son:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |

## Monta tu primer proyecto Vite

::: tip Nota de compatibilidad
Vite requiere [Node.js](https://nodejs.org/en/) versión >=14.6.0 o superior. Sin embargo, algunas plantillas requieren una versión superior de Node.js para funcionar, por favor actualiza si tu gestor de paquetes te advierte sobre ello.
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

¡Entonces sigue las instrucciones!

También puedes especificar directamente el nombre del proyecto y la plantilla que deseas usar a través de las opciones de línea de comandos adicionales. Por ejemplo, para montar un proyecto de Vite + Vue, ejecuta:

```bash
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, se requiere guión doble extra:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

Consulta [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) para más detalles sobre cada plantilla admitida: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`.

## Plantillas de la comunidad

create-vite es una herramienta para crear rápidamente un proyecto a partir de una plantilla básica para marcos de trabajo populares. Consulta Awesome Vite para [plantillas mantenidas por la comunidad](https://github.com/vitejs/awesome-vite#templates) que incluyen otras herramientas o apuntan a diferentes marcos de trabajo. Puedes usar una herramienta como [degit](https://github.com/Rich-Harris/degit) para montar tu proyecto con una de las plantillas.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

Si el proyecto usa `main` como la rama por defecto, agrega el sufijo `#main` al repositorio del proyecto.

```bash
npx degit user/project#main my-project
```

## `index.html` y raíz del proyecto

Una cosa que puedes haber notado es que en un proyecto de Vite, `index.html` es frontal y central en lugar de estar escondido dentro de `public`. Esto es intencional: durante el desarrollo, Vite es un servidor e `index.html` es el punto de entrada a tu aplicación.

Vite trata a `index.html` como código fuente y como parte del grafo de módulos. Esto resuelve a `<script type="module" src="...">` que hace referencia a tu código JavaScript. Incluso `<script type="module">` inline y el CSS referenciado a través de `<link href>` también disfrutan de características específicas de Vite. Además, las URLs dentro de `index.html` se reorganizan automáticamente, por lo que no se necesitan marcadores de posición especiales para `%PUBLIC_URL%`.

Similar a los servidores http estáticos, Vite tiene el concepto de un "directorio raíz" desde el cual se sirven tus archivos. Lo verás referenciado como `<root>` en el resto de la documentación. Las URL absolutas en el código se resolverán utilizando la raíz del proyecto como base, por lo que puedes escribir código como si estuvieras trabajando con un servidor de archivos estático normal (¡excepto que es mucho más poderoso!). Vite también es capaz de manejar dependencias que se resuelven en ubicaciones del sistema de archivos fuera de la raíz, lo que lo hace utilizable incluso en una configuración basada en monorepos.

Vite también admite [aplicaciones de múltiples páginas](./build#multi-page-app) con múltiples puntos de entrada `.html`.

#### Especificar una raíz alternativa

Ejecutar `vite` inicia el servidor de desarrollo utilizando el directorio de trabajo actual como raíz. Puedes especificar una raíz alternativa con `vite serve some/sub/dir`.

## Interfaz de línea de comandos

En un proyecto donde está instalado Vite, puedes usar el binario `vite` en tus scripts npm, o ejecutarlo directamente con `npx vite`. Estos son los scripts npm predeterminados en un proyecto de Vite ya montado:

<!-- prettier-ignore -->
```json5
{
  "scripts": {
    "dev": "vite", // inicia el servidor de desarrollo, alias: `vite dev`, `vite serve`
    "build": "vite build", // compila para producción
    "preview": "vite preview" // vista previa local de compilación para producción
  }
}
```

Puedes especificar opciones CLI adicionales como `--port` o `--https`. Para obtener una lista completa de las opciones de la CLI, ejecuta `npx vite --help` en tu proyecto.

## Uso de confirmaciones no publicadas

Si no puedes esperar a una nueva versión para probar las funciones más recientes, deberás clonar el [repo de vite](https://github.com/vitejs/vite) en tu máquina local y luego compilarlo y vincularlo tu mismo. ([pnpm](https://pnpm.io/) es obligatorio):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # podrás utilizar el gestor de paquetes de tu preferencia
```

Luego ve a tu proyecto basado en Vite y ejecuta `pnpm link --global vite` (o el gestor de paquetes que usaste para vincular `vite` globalmente). ¡Ahora reinicia el servidor de desarrollo para hacerlo funcionar!

## Comunidad

Si tienes preguntas o necesitas ayuda, comunícate con la comunidad en [Discord](https://discord.gg/4cmKdMfpU5) y en [Discusiones de Github](https://github.com/vitejs/vite/discussions).
