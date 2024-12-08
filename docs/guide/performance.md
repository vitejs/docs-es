# Rendimiento

Si bien Vite es rápido por defecto, los problemas de rendimiento pueden aparecer a medida que crecen los requisitos del proyecto. Esta guía tiene como objetivo ayudarte a identificar y solucionar problemas de rendimiento comunes, como:

- El servidor se inicia lentamente
- Cargas de página lentas
- compilaciones lentas

## Revisa las configuraciones en tu navegador

Algunas extensiones del navegador pueden interferir con las solicitudes y ralentizar los tiempos de inicio y recarga de aplicaciones grandes, especialmente cuando se utilizan herramientas de desarrollo del navegador. Recomendamos crear un perfil solo para desarrolladores sin extensiones, o cambiar al modo incógnito, mientras usa el servidor de desarrollo de Vite en estos casos. El modo incógnito también debería ser más rápido que un perfil normal sin extensiones.

El servidor de desarrollo de Vite realiza un almacenamiento en caché de las dependencias preempaquetadas e implementa respuestas 304 rápidas para el código fuente. Deshabilitar la caché mientras las Herramientas de desarrollo del navegador están abiertas puede tener un gran impacto en los tiempos de inicio y recarga de la página completa. Asegúrate de que "Desactivar caché" no esté habilitado mientras trabajas con el servidor de Vite.

## Auditar plugins de Vite configurados

Los plugins internos y oficiales de Vite están optimizados para realizar la menor cantidad de trabajo posible y al mismo tiempo brindar compatibilidad con el ecosistema más amplio. Por ejemplo, las transformaciones de código usan expresiones regulares en desarrollo, pero realizan un análisis completo en compilación para garantizar exactitud.

Sin embargo, el rendimiento de los plugins de la comunidad está fuera del control de Vite, lo que puede afectar la experiencia del desarrollador. Aquí hay algunas cosas que puedes tener en cuenta al usar plugins adicionales de Vite:

1. Las dependencias grandes que solo se usan en ciertos casos deben importarse dinámicamente para reducir el tiempo de inicio de Node.js. Ejemplos de reescrituras: [vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) y [vite-plugin-pwa#224](https://github.es/vite-pwa/vite-plugin-pwa/pull/244).

2. Los hooks `buildStart`, `config` y `configResolved` no deben ejecutar operaciones largas y extensas. Estos hooks son asíncronos durante el inicio del servidor de desarrollo, lo que retrasa el acceso al sitio en el navegador.

3. Los hooks `resolveId`, `load` y `transform` pueden hacer que algunos archivos se carguen más lento que otros. Aunque a veces es inevitable, vale la pena comprobar posibles áreas de optimización. Por ejemplo, verificar si `code` contiene una palabra clave específica, o si `id` coincide con una extensión específica, antes de realizar la transformación completa.

Cuanto más se tarde en transformar un archivo, más significativa será la cascada de solicitudes al cargar el sitio en el navegador.

Puedes inspeccionar el tiempo que lleva transformar un archivo usando `vite --debug plugin-transform` o [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect). Ten en cuenta que, dado que las operaciones asincrónicas tienden a proporcionar tiempos inexactos, debes tratar los números como una estimación aproximada, pero aún así debería revelar las operaciones más costosas.

:::tip Perfilamiento
Puede ejecutar `vite --profile`, visitar el sitio y presionar `p + enter` en el terminal para registrar un `.cpuprofile`. Luego se puede utilizar una herramienta como [speedscope](https://www.speedscope.app) para inspeccionar el perfil e identificar los cuellos de botella. También puedes [compartir los perfiles](https://chat.vite.dev) con el equipo de Vite para ayudarnos a identificar problemas de rendimiento.
:::

## Reducir operaciones de resolución

Resolver rutas de importación puede ser una operación costosa cuando se llega con frecuencia al peor de los casos. Por ejemplo, Vite admite "adivinar" rutas de importación con la opción [`resolve.extensions`](/config/shared-options.md#resolve-extensions), que por defecto es `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`.

Cuando intentas importar `./Component.jsx` con `import './Component'`, Vite ejecutará estos pasos para resolverlo:

1. Comprueba si existe `./Component`, no.
2. Comprueba si existe `./Component.mjs`, no.
3. Comprueba si existe `./Component.js`, no.
4. Comprueba si existe `./Component.mts`, no.
5. Comprueba si existe `./Component.ts`, no.
6. Comprueba si existe `./Component.jsx`, ¡sí!

Como se muestra, se requiere un total de 6 comprobaciones del sistema de archivos para resolver una ruta de importación. Cuantas más importaciones implícitas tenga, más tiempo se usará para resolver las rutas.

Por lo tanto, normalmente es mejor ser explícito con las rutas de importación, por ejemplo, `import './Component.jsx'`. También puedes reducir la lista de `resolve.extensions` para reducir las comprobaciones generales del sistema de archivos, pero debes asegurarte de que también funcione para los archivos en `node_modules`.

Si eres creador de un plugin, asegúrate de invocar a [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) solo cuando sea necesario para reducir la cantidad de comprobaciones anteriores.

:::tip TypeScript
Si estás utilizando TypeScript, activa `"moduleResolution": "Bundler"` y `"allowImportingTsExtensions": true` en las ``compilerOptions` de `tsconfig.json` para usar las extensiones `.ts` y `.tsx` directamente en tu codigo.
:::

## Evita los archivos Barril

Los archivos Barril son archivos que reexportan las API de otros archivos en el mismo directorio. Por ejemplo:

```js [src/utils/index.js]
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

Cuando solo importas una API individual, por ejemplo, `import { slash } from './utils'`, todos los archivos en ese archivo barril deben recuperarse y transformarse, ya que pueden contener la API `slash` y también pueden contener efectos secundarios que se ejecutan durante la inicialización. Esto significa que está cargando más archivos de los necesarios en la carga inicial de la página, lo que resulta en una carga de página más lenta.

Si es posible, evita los archivos barril e importa las API individuales directamente, ejemplo, `import { slash } from './utils/slash.js'`. Puedes leer el [issue #8237](https://github.com/vitejs/vite/issues/8237) para más información.

## Preparación de archivos de uso frecuente

El servidor de desarrollo de Vite solo transforma los archivos según lo solicita el navegador, lo que le permite iniciarse rápidamente y solo aplicar transformaciones a los archivos usados. También puede pretransformar archivos si prevé que ciertos archivos se solicitarán en breve. Sin embargo, es posible que se produzcan cascadas de solicitudes si algunos archivos tardan más en transformarse que otros. Por ejemplo:

Dado un gráfico de importación donde el archivo de la izquierda importa el archivo de la derecha:

```
main.js -> BigComponent.vue -> big-utils.js -> big-data.json
```

La relación de importación solo se puede conocer después de transformar el archivo. Si `BigComponent.vue` tarda algún tiempo en transformarse, `big-utils.js` tiene que esperar su turno, y así sucesivamente. Esto provoca una cascada interna incluso con la transformación previa incorporada.

Vite permite preparar archivos se sabe se utilizan con frecuencia, por ejemplo, `big-utils.js`, usando la opción [`server.warmup`](/config/server-options.md#server-warmup). De esta manera, `big-utils.js` estará listo y almacenado en caché para ser entregado inmediatamente cuando se solicite.

Puedes encontrar archivos que se utilizan con frecuencia ejecutando `vite --debug transform` e inspeccionando los registros:

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js [vite.config.js]
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

Ten en cuenta que solo debes preparar los archivos que se utilizan con frecuencia para no sobrecargar el servidor de desarrollo de Vite al iniciar. Revisa la opción [`server.warmup`](/config/server-options.md#server-warmup) para obtener más información.

El uso de [`--open` o `server.open`](/config/server-options.html#server-open) también proporciona un aumento de rendimiento, ya que Vite preparará automáticamente el punto de entrada de tu aplicación o la URL proporcionada a abrir.

## Utilizar herramientas nativas o menos potentes

Mantener Vite rápido con un código en crecimiento se trata de reducir la cantidad de trabajo para los archivos fuente (JS/TS/CSS).

Ejemplos de hacer menos trabajo:

- Usa CSS en lugar de Sass/Less/Stylus cuando sea posible (el anidamiento puede ser manejado por PostCSS).
- No transformes los SVG en componentes de frameworks visuales (React, Vue, etc.). Impórtalos como cadenas o URL en su lugar.
- Al usar `@vite/plugin-react`, evita configurar las opciones de Babel, para que omita la transformación durante la construcción (solo se utilizará esbuild).

Ejemplos de utilizar herramientas nativas:

El uso de herramientas nativas a menudo implica un mayor tamaño de instalación y, por lo tanto, no es la configuración predeterminada al iniciar un nuevo proyecto Vite. Pero puede valer la pena el costo para aplicaciones más grandes.

- Prueba el soporte experimental para [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
- Utiliza [`@vite/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) en lugar de `@vite/plugin-react`.
