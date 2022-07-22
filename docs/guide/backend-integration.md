# Integración de Backend

:::tip Nota
Si quieres servir el HTML utilizando herramientas backend tradicionales (como Rails, Laravel) pero usando Vite para servir los recursos, revisa la lista de integraciones existentes en [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Si necesitas una integración personalizada, puedes seguir los pasos de esta guía para configuración manual.
:::

1. En tu configuración de Vite, configura el archivo de entrada y habilita el manifest de compilación:

   ```js
   // vite.config.js
   export default defineConfig({
     build: {
       // genera el archivo manifest.json en outDir
       manifest: true,
       rollupOptions: {
         // sobreescribe la entrada por defecto .html
         input: '/path/to/main.js'
       }
     }
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

   Ten en cuenta que si estas usando React con `@vitejs/plugin-react`, tambien necesitarás agregar esto antes del script de arriba, esto porque el plugin no podrá modificar el HTML que estás sirviendo:

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Para producción: despues de ejecutar `vite build`, se generará un archivo `manifest.json` junto a otros archivos de recursos. Un ejemplo de un archivo manifest sería algo como esto:

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js"
     }
   }
   ```

   - El manifest tiene una estructura `Record<name, chunk>`.
   - Para fragmentos de entrada fija o dinámica, la key es la ruta src relativa de la raíz del proyecto.
   - Los fragmentos contendrán información en sus importaciones estaticas y dinamicas (ambos son keys que mapean al correspondiente fragmento en el manifest), y tambien su correspondiente css y archivo de recurso estatico (si los hay).

   Tambien puedes usar este archivo para renderizar links o precargar directivas con archivos con hash (nota: la sintaxis aquí es meramente explicativa, reemplazalo con el lenguage de plantilla del servidor.)

   ```html
   <!-- if production -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
   ```
