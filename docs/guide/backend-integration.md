# Integración de Backend

:::tip Nota
Si quieres servir el HTML utilizando herramientas backend tradicionales (como Rails, Laravel) pero usando Vite para servir los recursos, revisa la lista de integraciones existentes en [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Si necesitas una integración personalizada, puedes seguir los pasos de esta guía para configuración manual.
:::

1. En tu configuración de Vite, configura el archivo de entrada y habilita el manifest de compilación:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   // vite.config.js
   export default defineConfig({
     server: {
       cors: {
         // el origin al que accederás a través del navegador
         origin: 'http://my-backend.example.com',
       },
     },
     build: {
       // genera el archivo .vite/manifest.json en outDir
       manifest: true,
       rollupOptions: {
         // sobreescribe la entrada por defecto .html
         input: '/path/to/main.js',
       },
     },
   })
   ```

   Si no has desactivado el [polyfill de precarga de modulos](/config/build-options#build-polyfillmodulepreload), tambien necesitarás importarlo en tu entrada.

   ```js
   // agrega esto en el archivo de entrada de tu app
   import 'vite/modulepreload-polyfill'
   ```

2. Para desarrollo: coloca lo siguiente en la plantilla de servidor HTML (reemplaza `http://localhost:5173` con la URL local donde Vite se está ejecutando):

   ```html
   <!-- si es desarrollo -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   Para servir correctamente los recursos, tienes dos opciones:
   - Asegúrarse de que el servidor esté configurado para enviar solicitudes de recursos estáticos al servidor de Vite.
   - Configurar [`server.origin`](/config/server-options#server-origin) para que las URL de recursos generados resuelvan en la URL del servidor backend en lugar de una ruta relativa.

   Esto es necesario para que los recursos, como imágenes, se carguen correctamente.

   Ten en cuenta que si estas usando React con `@vite/plugin-react`, tambien necesitarás agregar esto antes del script de arriba, esto porque el plugin no podrá modificar el HTML que estás sirviendo (reemplaza `http://localhost:5173` con la URL local donde Vite se está ejecutando):

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Para producción: despues de ejecutar `vite build`, se generará un archivo `.vite/manifest.json` junto a otros archivos de recursos. Un ejemplo de un archivo manifest sería algo como esto:

   ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "logo.svg": {
       "file": "assets/logo-BuPIv-2h.svg",
       "src": "logo.svg"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   El manifiesto tiene una estructura `Record<name, chunk>` donde cada chunk sigue la interfaz `ManifestChunk`:

   ```ts
   interface ManifestChunk {
     src?: string
     file: string
     css?: string[]
     assets?: string[]
     isEntry?: boolean
     name?: string
     names?: string[]
     isDynamicEntry?: boolean
     imports?: string[]
     dynamicImports?: string[]
   }
   ```

   Cada entrada en el manifiesto representa uno de los siguientes:
   - **Fragmentos de entrada**: Generados a partir de archivos especificados en [`build.rollupOptions.input`](https://rollupjs.org/configuration-options/#input). Estos fragmentos tienen `isEntry: true` y su clave es la ruta src relativa desde la raíz del proyecto.
   - **Fragmentos de entrada dinámica**: Generados a partir de importaciones dinámicas. Estos fragmentos tienen `isDynamicEntry: true` y su clave es la ruta src relativa desde la raíz del proyecto.
   - **Fragmentos no de entrada**: Su clave es el nombre base del archivo generado con `_` como prefijo.
   - **Fragmentos de activos**: Generados a partir de activos importados como imágenes, fuentes. Su clave es la ruta src relativa desde la raíz del proyecto.
   - **Archivos CSS**: Cuando [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) es `false`, se genera un solo archivo CSS con la clave `style.css`. Cuando `build.cssCodeSplit` no es `false`, la clave se genera similar a los fragmentos de JavaScript (es decir, los fragmentos de entrada no tendrán prefijo `_` y los fragmentos no de entrada tendrán prefijo `_`).

   Los fragmentos contendrán información sobre sus importaciones estáticas y dinámicas (ambos son claves que mapean al correspondiente fragmento en el manifiesto), y también su correspondiente CSS y archivo de recurso estatico (si los hay).

4. Tambien puedes usar este archivo para renderizar links o precargar directivas con archivos con hash.

Aquí tienes un ejemplo de plantilla HTML para renderizar los enlaces adecuados. La sintaxis aquí es solo para explicación, sustitúyela con tu lenguaje de plantillas de servidor. La función `importedChunks` es solo para fines ilustrativos y no es proporcionada por Vite.

````html
<!-- si es producción -->

```html
<!-- para cssFile de manifest[name].css -->
<link rel="stylesheet" href="/{{ cssFile }}" />

<!-- para fragmentos de importedChunks(manifest, name) -->
<!-- para cssFile de chunk.css -->
<link rel="stylesheet" href="/{{ cssFile }}" />

<script type="module" src="/{{ manifest[name].file }}"></script>

<!-- para fragmentos de importedChunks(manifest, name) -->
<link rel="modulepreload" href="/{{ chunk.file }}" />
````

Especificamente, un backend que genera HTML debería incluir las siguientes etiquetas dados un archivo de manifiesto y un punto de entrada. Ten en cuenta que seguir este orden es recomendado para el rendimiento óptimo:

1.  Una etiqueta `<link rel="stylesheet">` para cada archivo en la lista `css` del fragmento del punto de entrada (si existe)
2.  Recursivamente seguir todos los fragmentos en la lista `imports` del punto de entrada y agregar una etiqueta `<link rel="stylesheet">` para cada archivo CSS de la lista `css` de cada fragmento importado (si existe).
3.  Una etiqueta para la clave `file` del fragmento del punto de entrada. Esto puede ser `<script type="module">` para JavaScript, `<link rel="stylesheet">` para CSS.
4.  Opcionalmente, `<link rel="modulepreload">` para el `file` de cada fragmento de JavaScript importado, siguiendo recursivamente las importaciones a partir del fragmento del punto de entrada.

Siguiendo el ejemplo del manifiesto anterior, para el punto de entrada `views/foo.js`, los siguientes tags deberían incluirse en producción:

```html
<link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
<link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
<script type="module" src="assets/foo-BRBmoGS9.js"></script>
<!-- opcional -->
<link rel="modulepreload" href="assets/shared-B7PI925R.js" />
```

Mientras que lo siguiente debería incluirse para el punto de entrada `views/bar.js`:

```html
<link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
<script type="module" src="assets/bar-gkvgaI9m.js"></script>
<!-- opcional -->
<link rel="modulepreload" href="assets/shared-B7PI925R.js" />
```

::: details Pseudo implementación de `importedChunks`
Un ejemplo de pseudo implementación de `importedChunks` en TypeScript (esto necesitará ser adaptado para tu lenguaje de programación y lenguaje de plantillas):

```ts
import type { Manifest, ManifestChunk } from 'vite'

export default function importedChunks(
  manifest: Manifest,
  name: string,
): ManifestChunk[] {
  const seen = new Set<string>()

  function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = []
    for (const file of chunk.imports ?? []) {
      const importee = manifest[file]
      if (seen.has(file)) {
        continue
      }
      seen.add(file)
      chunks.push(...getImportedChunks(importee))
      chunks.push(importee)
    }
    return chunks
  }

  return getImportedChunks(manifest[name])
}
```

:::
