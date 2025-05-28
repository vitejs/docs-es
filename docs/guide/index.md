# Introducción

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Descripción General

Vite (palabra en francés para "rápido", pronunciado como `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, como "veet") es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y ágil para proyectos web modernos. Consta de dos partes principales:

- Un servidor de desarrollo que proporciona [mejoras enriquecidas de funcionalidades](./features) sobre [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por ejemplo [Hot Module Replacement (HMR)](./features#hot-module-replacement) extremadamente rápido.

- Un comando de compilación que empaqueta tu código con [Rollup](https://rollupjs.org), preconfigurado para generar recursos estáticos altamente optimizados para producción.

Vite es dogmático y viene con configuraciones predeterminadas listas para usar. Lee sobre lo que es posible en la [Guía de funcionalidades](./features). El soporte para frameworks o la integración con otras herramientas es posible a través de [Plugins](./using-plugins). La [Sección de Configuración](../config/) explica cómo adaptar Vite a tu proyecto si es necesario.

Vite también es altamente extensible a través de su [API de Plugin](./api-plugin) y [API de JavaScript](./api-javascript) con soporte completo de tipos.

Puedes obtener más información sobre la razón de ser del proyecto en la sección [¿Por qué Vite?](./why).

## Compatibilidad con navegadores

Durante el desarrollo, Vite configura [`esnext` como el objetivo de transformación](https://esbuild.github.io/api/#target), porque asumimos que se está utilizando un navegador moderno que admite todas las características más recientes de JavaScript y CSS. Esto evita la reducción de sintaxis, permitiendo que Vite sirva módulos lo más cercanos posible al código fuente original.

Para compilaciones de producción, Vite apunta por defecto a navegadores [Baseline](https://web-platform-dx.github.io/web-features/) Ampliamente Disponibles. Estos son navegadores que se lanzaron al menos hace 2.5 años. El objetivo puede ser reducido mediante configuración. Además, los navegadores obsoletos pueden ser soportados mediante el plugin oficial [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). Consulta la sección [Compilación para producción](./build) para obtener más detalles.

## Probar Vite online

Puedes probar Vite online en [StackBlitz](https://vite.new/). Este ejecuta la configuración de compilación basada en Vite directamente en el navegador, por lo que es casi idéntica a la configuración local pero con la diferencia que no requiere que instales nada en tu máquina. Puedes navegar a `vite.new/{template}` para seleccionar qué marco de trabajo utilizar.

Los ajustes preestablecidos de plantilla admitidos son:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## Inicia tu primer proyecto Vite

::: tip Nota de compatibilidad
Vite requiere [Node.js](https://nodejs.org/en/) version 20.19+, 22.12+. Sin embargo, algunas plantillas requieren una versión superior de Node.js para funcionar, por favor actualiza si tu gestor de paquetes te advierte sobre ello.
:::

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

¡Entonces sigue las instrucciones!

También puedes especificar directamente el nombre del proyecto y la plantilla que deseas usar a través de las opciones de línea de comandos adicionales. Por ejemplo, para montar un proyecto de Vite + Vue, ejecuta:

::: code-group

```bash [npm]
# npm 7+, se requiere guión doble extra:
npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [PNPM]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

Consulta [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) para más detalles sobre cada plantilla admitida: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

Puedes usar `.` como nombre del proyecto para generar la estructura en el directorio actual.

## Plantillas de la comunidad

`create-vite` es una herramienta para iniciar rápidamente un proyecto desde una plantilla básica para frameworks populares. Echa un vistazo a Awesome Vite para [plantillas soportadas por la comunidad](https://github.com/vitejs/awesome-vite#templates) que incluyen otras herramientas o se dirigen a diferentes frameworks.

Para una plantilla en `https://github.com/user/project`, puedes probarla en línea usando `https://github.stackblitz.com/user/project` (agregando `.stackblitz` después de `github` en la URL del proyecto).

También puedes usar una herramienta como [degit](https://github.com/Rich-Harris/degit) para estructurar tu proyecto con una de las plantillas. Suponiendo que el proyecto está en GitHub y usa `main` como rama predeterminada, puedes crear una copia local usando:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## Instalación Manual

En tu proyecto, puedes instalar la CLI de `vite` utilizando:

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [PNPM]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

Y crea un archivo `index.html` como este:

```html
<p>Hello Vite!</p>
```

Luego, ejecuta el comando CLI apropiado en tu terminal:

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [PNPM]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

El archivo `index.html` se servirá en `http://localhost:5173`.

## `index.html` y raíz del proyecto

Una cosa que puedes haber notado es que en un proyecto de Vite, `index.html` es frontal y central en lugar de estar escondido dentro de `public`. Esto es intencional: durante el desarrollo, Vite es un servidor e `index.html` es el punto de entrada a tu aplicación.

Vite trata a `index.html` como código fuente y como parte del grafo de módulos. Esto resuelve a `<script type="module" src="...">` que hace referencia a tu código JavaScript. Incluso `<script type="module">` inline y el CSS referenciado a través de `<link href>` también disfrutan de características específicas de Vite. Además, las URLs dentro de `index.html` se reorganizan automáticamente, por lo que no se necesitan marcadores de posición especiales para `%PUBLIC_URL%`.

Similar a los servidores http estáticos, Vite tiene el concepto de un "directorio raíz" desde el cual se sirven tus archivos. Lo verás referenciado como `<root>` en el resto de la documentación. Las URL absolutas en el código se resolverán utilizando la raíz del proyecto como base, por lo que puedes escribir código como si estuvieras trabajando con un servidor de archivos estático normal (¡excepto que es mucho más poderoso!). Vite también es capaz de manejar dependencias que se resuelven en ubicaciones del sistema de archivos fuera de la raíz, lo que lo hace utilizable incluso en una configuración basada en monorepos.

Vite también admite [aplicaciones de múltiples páginas](./build#aplicacion-multipaginas) con múltiples puntos de entrada `.html`.

#### Especificar una raíz alternativa

Ejecutar `vite` inicia el servidor de desarrollo utilizando el directorio de trabajo actual como raíz. Puedes especificar una raíz alternativa con `vite serve some/sub/dir`.
Ten en cuenta que Vite también resolverá [su archivo de configuración (`vite.config.js`)](/config/#configuring-vite) dentro de la raíz del proyecto, por lo que tendrás que moverlo si se cambia la raíz.

## Interfaz de línea de comandos

En un proyecto donde está instalado Vite, puedes usar el binario `vite` en tus scripts npm, o ejecutarlo directamente con `npx vite`. Estos son los scripts npm predeterminados en un proyecto de Vite ya montado:

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // inicia el servidor de desarrollo, alias: `vite dev`, `vite serve`
    "build": "vite build", // compila para producción
    "preview": "vite preview" // vista previa local de compilación para producción
  }
}
```

Puedes especificar opciones CLI adicionales como `--port` o `--open`. Para obtener una lista completa de las opciones de la CLI, ejecuta `npx vite --help` en tu proyecto.

Aprende más sobre la [interfaz de línea de comnando](./cli.md)

## Uso de confirmaciones no publicadas

Si no puedes esperar a una nueva versión para probar las últimas funciones, puedes instalar un commit específico de Vite usando [pkg.pr.new](https://pkg.pr.new):

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

:::

Sustituye `SHA` por cualquier [SHA de commit de Vite](https://github.com/vitejs/vite/commits/main). Ten en cuenta que solo funcionarán los commits del último mes, ya que las versiones más antiguas se eliminan.

Como alternativa, también puedes clonar el [repositorio de Vite](https://github.com/vitejs/vite) en tu máquina local, compilarlo y enlazarlo manualmente (es necesario [pnpm](https://pnpm.io/)):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # utiliza el gestor de paquetes de tu preferencia para este paso
```

Luego ve a tu proyecto basado en Vite y ejecuta `pnpm link --global vite` (o el gestor de paquetes que usaste para vincular `vite` globalmente). ¡Ahora reinicia el servidor de desarrollo para hacerlo funcionar!

::: tip Dependencias que usan Vite  
Para reemplazar la versión de Vite utilizada por las dependencias de forma transitiva, debes usar [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) o [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides).  
:::

## Comunidad

Si tienes preguntas o necesitas ayuda, comunícate con la comunidad en [Discord](https://chat.vite.dev) y en [Discusiones de Github](https://github.com/vitejs/vite/discussions).
