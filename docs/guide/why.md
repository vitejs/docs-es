# Por qué Vite

## Problemas

<!-- Before ES modules were available in browsers, developers had no native mechanism for authoring JavaScript in a modularized fashion. This is why we are all familiar with the concept of "bundling": using tools that crawl, process and concatenate our source modules into files that can run in the browser. -->

Antes de los que módulos ES estuvieran disponibles para navegadores web, los desarrolladores no tenían un mecanismo nativo para crear código Javascript en forma modular. Este es el por qué estamos familizariados con el concepto de "empaquetado": el uso de herramientas que analizan, procesan y concatenan nuestros módulos en archivos que puedan ser ejecutados en el navegador.

<!-- Over time we have seen tools like [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) and [Parcel](https://parceljs.org/), which greatly improved the development experience for frontend developers. -->

Con el tiempo hemos visto herramienta como [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) y [Parcel](https://parceljs.org/), las cuales han mejorado considerablemente la experiencia de desarrollo de los desarrolladores frontend.

<!-- However, as we start to build more and more ambitious applications, the amount of JavaScript we are dealing with also increased exponentially. It is not uncommon for large scale projects to contain thousands of modules. We are starting to hit a performance bottleneck for JavaScript based tooling: it can often take an unreasonably long wait (sometimes up to minutes!) to spin up a dev server, and even with HMR, file edits can take a couple seconds to be reflected in the browser. The slow feedback loop can greatly affect developers' productivity and happiness. -->

Sin embargo, a medida que comenzamos a crear aplicaciones cada vez más ambiciosas, la cantidad de código JavaScript con la que estamos trabajando tambien crecerá exponencialmente. No es raro que los proyectos a gran escala contengan miles de módulos. En este punto empezamos a encontrarnos con un cuello de botella en el rendimiento de las herramientas basadas en JavaScript: a menudo puede llevar a una espera excesivamente larga (¡a veces hasta de minutos!) poner en marcha un servidor de desarrollo, e incluso con HMR, las ediciones de archivos pueden tardar un par de segundos en reflejarse en el navegador. El ciclo lento de retroalimentación puede afectar en gran medida la productividad y felicidad de los desarrolladores.

<!-- Vite aims to address these issues by leveraging new advancements in the ecosystem: the availability of native ES modules in the browser, and the rise of JavaScript tools written in compile-to-native languages. -->

Vite viene a corregir estos problemas aprovechando los nuevos avances en el ecosistema: la disponibilidad de módulos ES nativos en el navegador, y el surgimiento de herramientas JavaScript escritas en lenguajes de compilación a nativo.

<!-- ### Slow Server Start -->

### Inicio lento de servidor

<!-- When cold-starting the dev server, a bundler-based build setup has to eagerly crawl and build your entire application before it can be served. -->

Cuando se inicia desde cero el servidor de desarrollo, la configuración de compilación basada en empaquetadores tiene que analizar y compilar de forma estricta toda la aplicación antes que pueda ser servido.

<!-- Vite improves the dev server start time by first dividing the modules in an application into two categories: **dependencies** and **source code**. -->

Vite mejora el tiempo de inicio del servidor de desarrollo dividiendo primero los módulos de una aplicación en dos categorías: **dependencias** y **código fuente**.

<!-- - **Dependencies** are mostly plain JavaScript that do not change often during development. Some large dependencies (e.g. component libraries with hundreds of modules) are also quite expensive to process. Dependencies may also be shipped in various module formats (e.g. ESM or CommonJS). -->

- Las **dependencias** son en su mayoría código JavaScript plano que no cambia con frecuencia durante el desarrollo. Algunas dependencias grandes (por ejemplo, librerías de componentes con cientos de módulos) también son bastante complejas de procesar. Las dependencias también pueden estar disponibles en varios formatos de módulos (por ejemplo, ESM o CommonJS).

  <!-- Vite [pre-bundles dependencies](./dep-pre-bundling) using [esbuild](https://esbuild.github.io/). Esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers. -->

  Vite [preempaqueta dependencias](./dep-pre-bundling) usando [esbuild](https://esbuild.github.io/). Esbuild está escrito en Go y preempaqueta dependencias 10 a 100 veces más rápido que los empaquetadores basados ​​en JavaScript.

<!-- - **Source code** often contains non-plain JavaScript that needs transforming (e.g. JSX, CSS or Vue/Svelte components), and will be edited very often. Also, not all source code needs to be loaded at the same time (e.g. with route-based code-splitting). -->

- **El código fuente** a menudo contiene código JavaScript no plano que necesita transformación (por ejemplo, JSX, CSS o componentes Vue/Svelte) y que se editará con mucha frecuencia. Además, no es necesario cargar todo el código fuente al mismo tiempo (por ejemplo, con división de código basado en rutas).

<!-- Vite serves source code over [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This is essentially letting the browser take over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests it. Code behind conditional dynamic imports is only processed if actually used on the current screen. -->

Vite sirve código fuente sobre [ESM nativo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Básicamente, esto permitirá que el navegador se haga cargo de parte del trabajo de un empaquetador: Vite solo necesita transformar y servir código fuente a petición, según como lo solicite el navegador. El código detrás de las importaciones dinámicas condicionales sólo es procesado si realmente es usado en la pantalla actual.

![Servidor de desarrollo basado en empaquetador](/images/bundler.png)

![Servidor de desarrollo basado en esm](/images/esm.png)

<!-- ### Slow Updates -->

### Actualizaciones lentas

<!-- When a file is edited in a bundler-based build setup, it is inefficient to rebuild the whole bundle for obvious reasons: the update speed will degrade linearly with the size of the app.

Some bundler dev server runs the bundling in memory so that it only needs to invalidate part of its module graph when a file changes, but it still needs to re-construct the entire bundle and reload the web page. Reconstructing the bundle can be expensive, and reloading the page blows away the current state of the application. This is why some bundlers support Hot Module Replacement (HMR): allowing a module to "hot replace" itself without affecting the rest of the page. This greatly improves DX - however, in practice we've found that even HMR update speed deteriorates significantly as the size of the application grows. -->

Cuando se edita un archivo con una configuración de compilación basada en empaquetadores, es ineficiente recompilar todo el paquete por razones obvias: la velocidad de actualización se degradará linealmente con el tamaño de la aplicación.

Algunos servidores de desarrollo de empaquetado ejecutan el paquete en memoria, por lo que solo necesita invalidar parte de su gráfico de módulo cuando cambia un archivo, pero aún así necesita recompilar todo el paquete y recargar la página web. Recompilar el paquete puede ser costoso y recargar la página arruina el estado actual de la aplicación. Esta es la razón por la que algunos empaquetadores tienen soporte para Hot Module Replacement (HMR): permite que un módulo se "reemplace en caliente" a sí mismo sin afectar el resto de la página. Esto mejora enormemente la experiencia de desarrollo; sin embargo, en la práctica hemos descubierto que incluso con la actualización vía HMR la velocidad se deteriora significativamente a medida que crece el tamaño de la aplicación.

<!-- In Vite, HMR is performed over native ESM. When a file is edited, Vite only needs to precisely invalidate the chain between the edited module and its closest HMR boundary (most of the time only the module itself), making HMR updates consistently fast regardless of the size of your application.

Vite also leverages HTTP headers to speed up full page reloads (again, let the browser do more work for us): source code module requests are made conditional via `304 Not Modified`, and dependency module requests are strongly cached via `Cache-Control: max-age=31536000,immutable` so they don't hit the server again once cached. -->

En Vite, el HMR es realizado sobre ESM nativo. Cuando se edita un archivo, Vite solo necesita invalidar precisamente la relación entre el módulo editado y su límite HMR más cercano (la mayoría de las veces solo el módulo en sí), lo que hace que las actualizaciones vía HMR sean consistentemente rápidas, independientemente del tamaño de tu aplicación.

Vite también aprovecha los encabezados HTTP para acelerar los refrescos completos de páginas (nuevamente, permitiendo que el navegador haga más trabajo por nosotros): las solicitudes de módulos de código fuente se hacen de forma condicional vía `304 Not Modified`, y las solicitudes de módulos de dependencia son almacenanados fuertemente en caché vía `Cache-Control: max-age=31536000,immutable` para que no lleguen al servidor nuevamente una vez almacenados en caché.

<!-- Once you experience how fast Vite is, we highly doubt you'd be willing to put up with bundled development again. -->

Una vez experimentes lo rápido que es Vite, dudamos mucho que estés dispuesto a trabajar nuevamente con el desarrollo en empaquetados.

<!-- ## Why Bundle for Production -->

## ¿Por qué empaquetar en producción?

<!-- Even though native ESM is now widely supported, shipping unbundled ESM in production is still inefficient (even with HTTP/2) due to the additional network round trips caused by nested imports. To get the optimal loading performance in production, it is still better to bundle your code with tree-shaking, lazy-loading and common chunk splitting (for better caching).

Ensuring optimal output and behavioral consistency between the dev server and the production build isn't easy. This is why Vite ships with a pre-configured [build command](./build) that bakes in many [performance optimizations](./features#build-optimizations) out of the box. -->

Aunque el ESM nativo ahora es ampliamente compatible, distribuir ESM desempaquetado en producción sigue siendo ineficiente (incluso con HTTP/2) debido a las rondas de peticiones adicionales causadas ​​por importaciones anidadas. Para obtener el rendimiento óptimo de carga en producción, aún sigue siendo mejor empaquetar tu código con tree-shaking, lazy-loading y división de fragmentos comunes (para un mejor almacenamiento en caché).

Garantizar un resultado óptimo y una coherencia de comportamiento entre el servidor de desarrollo y la compilación en producción no es fácil. Esta es la razón por la que Vite tiene disponible un [comando de compilación](./build) preconfigurado que incorpora muchas [optimizaciones de rendimiento](./features#build-optimizations) listas para usar.

<!-- ## Why Not Bundle with esbuild? -->

## ¿Por qué no empaquetar con esbuild?

<!-- While `esbuild` is blazing fast and is already a very capable bundler for libraries, some of the important features needed for bundling _applications_ are still work in progress - in particular code-splitting and CSS handling. For the time being, Rollup is more mature and flexible in these regards. That said, we won't rule out the possibility of using `esbuild` for production build when it stabilizes these features in the future. -->

Si bien `esbuild` es increíblemente rápido y ya es un empaquetador para bibliotecas muy optimizado, algunas de las características importantes necesarias para agrupar _aplicaciones_ aún están en constante desarrollo, en particular, la división de código y el manejo de CSS. Por el momento, Rollup es más maduro y flexible en estos aspectos. Dicho esto, no descartaremos la posibilidad de usar `esbuild` para la compilación en producción cuando estabilice estas funcionalidades en el futuro.

<!-- ## How is Vite Different from X? -->

## ¿En qué se diferencia Vite de X?

<!-- You can check out the [Comparisons](./comparisons) section for more details on how Vite differs from other similar tools. -->

Puedes consultar la sección [Comparaciones](./comparaciones) para obtener más detalles sobre cómo Vite difiere de otras herramientas similares.
