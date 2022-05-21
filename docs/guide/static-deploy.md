# Despliegue de un sitio estático

Las siguientes guías se basan en algunas suposiciones compartidas:

- Estás utilizando la ubicación de salida de compilación predeterminada (`dist`). Esta ubicación [se puede cambiar usando `build.outDir`](https://vitejs.dev/config/#build-outdir), y puedes extrapolar las instrucciones de estas guías en ese caso.
- Estás usando npm. Puedes usar comandos equivalentes para ejecutar los scripts si estás usando Yarn u otros gestores de paquetes.
- Vite está instalado como una dependencia de desarrollo local en tu proyecto y has configurado los siguientes scripts de npm:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Es importante tener en cuenta que `vite preview` está diseñada para obtener una vista previa de la compilación localmente y no como un servidor de producción.

:::tip NOTA
Estas guías brindan instrucciones para realizar un despliegue de tu sitio estatico con Vite. Vite también tiene soporte experimental para Server Side Rendering. SSR se refiere a marcos front-end que admiten la ejecución de la misma aplicación en Node.js, renderizándola previamente en HTML y finalmente hidratándola en el cliente. Consulta la [Guía de SSR](./ssr) para obtener información sobre esta función. Por otro lado, si estás buscando una integración con marcos de trabajo tradicionales del lado del servidor, consulta la [Guía de integración de backend](./backend-integration) en su lugar.
:::

## Compilación de la aplicación

Puedes ejecutar el comando `npm run build` para compilar la aplicación.

```bash
$ npm run build
```

De forma predeterminada, la salida de compilación se colocará en `dist`. Puedes desplegar esta carpeta `dist` en cualquiera de tus plataformas preferidas.

### Prueba local de la aplicación

Una vez que hayas creado la aplicación, puedes probarla localmente ejecutando el comando `npm run preview`.

```bash
$ npm run build
$ npm run preview
```

El comando `vite preview` arrancará el servidor web estático local que sirve los archivos desde `dist` en http://localhost:5000. Es una manera fácil de verificar si la compilación de producción se ve bien en el entorno local.

Puedes configurar el puerto del servidor pasando el indicador `--port` como argumento.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Ahora el método `preview` lanzará el servidor en http://localhost:8080.

## GitHub Pages

1. Configura la `base` correcta en `vite.config.js`.

   Si estás desplegando en `https://<USERNAME>.github.io/`, puedes omitir `base` ya que el valor predeterminado es `'/'`.

   Si está desplegando en `https://<NOMBRE DE USUARIO>.github.io/<REPO>/`, por ejemplo, tu repositorio está en `https://github.com/<NOMBRE DE USUARIO>/<REPO>`, configura `base` a `'/<REPO>/'`.

2. Dentro de tu proyecto, crea un `deploy.sh` con el siguiente contenido (con las líneas resaltadas sin comentar adecuadamente) y ejecútalo para desplegar:

   ```bash{13,20,23}
   #!/usr/bin/envsh

   # abortar en caso de errores
   set -e

   # compilado
   npm run build

   # navega al directorio de salida de compilación
   dist cd

   # si estás desplegando en un dominio personalizado
   # echo 'www.ejemplo.com' > CNAME

   git init
   git add -A
   git commit -m 'deploy'

   # si estás desplegando en https://<NOMBRE DE USUARIO>.github.io
   # git push -f git@github.com:<NOMBRE DE USUARIO>/<NOMBRE DE USUARIO>.github.io.git main

   # si estás desplegando en https://<NOMBRE DE USUARIO>.github.io/<REPO>
   # git push -f git@github.com:<NOMBRE DE USUARIO>/<REPO>.git main:gh-pages

   cd -
   ```

::: tip
También puedes ejecutar el script anterior en tu configuración de CI para habilitar el despliegue automatico en cada push.
:::

### Github Pages y Travis CI

1. Configura la `base` correcta en `vite.config.js`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/`, puedes omitir `base` ya que el valor predeterminado es `'/'`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/<REPO>/`, por ejemplo, tu repositorio está en `https://github.com/<NOMBRE DE USUARIO>/<REPO>`, configura `base` en `'/<REPO>/'`.

2. Crea un archivo llamado `.travis.yml` en la raíz de tu proyecto.

3. Ejecuta `npm install` y confirma el archivo de bloqueo generado (`package-lock.json`).

4. Usa la plantilla de proveedor de despliegue de Github Pages y sigue la [documentación de Travis CI](https://docs.travis-ci.com/user/deployment/pages/).

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # Un token generado en GitHub que le permite a Travis insertar código en tu repositorio.
     # Configurar en la página de configuración de Travis de tu repositorio, como una variable segura.
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: main
   ```

## GitLab Pages y GitLab CI

1. Configura la `base` correcta en `vite.config.js`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/`, puedes omitir `base` ya que el valor predeterminado es `'/'`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/<REPO>/`, por ejemplo, tu repositorio está en `https://github.com/<NOMBRE DE USUARIO>/<REPO>`, configura `base` en `'/<REPO>/'`.

2. Crea un archivo llamado `.gitlab-ci.yml` en la raíz de tu proyecto con el contenido a continuación. Esto creará y desplegará tu sitio cada vez que realices cambios en el contenido:

   ```yaml
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

1. En [Netlify](https://netlify.com), configura un nuevo proyecto desde GitHub con la siguiente configuración:

   - **Build Command:** `vite build` or `npm run build`
   - **Publish directory:** `dist`

2. Pulsa el botón de despliegue.

## Google Firebase

1. Asegúrate de tener [firebase-tools](https://www.npmjs.com/package/firebase-tools) instalado.

2. Crea `firebase.json` y `.firebaserc` en la raíz de tu proyecto con el siguiente contenido:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   `.firebaserc`:

   ```js
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. Despues de ejecutar `npm run build`, despliega usando el comando `firebase deploy`.

## Surge

1. Primero instala [surge](https://www.npmjs.com/package/surge), si aún no lo has hecho.

2. Ejecuta `npm run build`.

3. Despliega en Surge escribiendo `surge dist`.

También puedes desplegar en un [dominio personalizado](http://surge.sh/help/adding-a-custom-domain) agregando `surge dist yourdomain.com`.

## Heroku

1. Instala el [CLI de Heroku](https://devcenter.heroku.com/articles/heroku-cli).

2. Crea una cuenta de Heroku [registrándote](https://signup.heroku.com).

3. Ejecuta `heroku login` y completa con tus credenciales de Heroku:

   ```bash
   $ heroku login
   ```

4. Crea un archivo llamado `static.json` en la raíz de tu proyecto con el siguiente contenido:

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

Esta es la configuración de tu sitio; lee más en [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

5. Configura tu control de git remoto para Heroku:

   ```bash
   # cambio de versión
   $ git init
   $ git add .
   $ git commit -m "Mi sitio listo para su despliegue"

   # crea una nueva aplicación con un nombre específico
   $ heroku apps:create example

   # configura buildpack para sitios estático
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. Despliega tu sitio:

   ```bash
   # publica el sitio
   $ git push heroku main

   # abre un navegador para ver la versión Dashboard de Heroku CI
   $ heroku open
   ```

## Vercel

Para desplegar tu aplicación Vite con [Vercel para Git](https://vercel.com/docs/git), asegúrate de que se haya enviado a un repositorio de Git.

Ve a https://vercel.com/import/git e importa el proyecto a Vercel usando tu Git de elección (GitHub, GitLab o Bitbucket). Sigue las instrucciones del asistente para seleccionar la raíz del proyecto con el `package.json` del proyecto y sobreescribe el paso de compilación usando `npm run build` y el directorio de salida para que sea `./dist`

![Configuración de Vercel personalizada](../images/vercel-configuration.png)

Una vez que se haya importado el proyecto, todos los push subsiguientes a las ramas generarán despliegues de prueba, y todos los cambios realizados en la rama de producción (comúnmente "main") darán como resultado un despliegue de producción.

Una vez desplegada, obtendrás una URL para ver la aplicación en vivo, como la siguiente: https://vite.vercel.app

## Azure Static Web Apps

Puedes desplegar rápidamente una aplicación Vite con el servicio Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps). Necesitas:

- Una cuenta de Azure y una clave de suscripción. Puedes crear una [cuenta gratuita de Azure aquí](https://azure.microsoft.com/free).
- El código de tu aplicación enviado a [GitHub](https://github.com).
- La [Extensión SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) en [Visual Studio Code](https://code.visualstudio.com).

Instala la extensión en Visual Studio Code y navega hasta la raíz de la aplicación. Abre la extensión Static Web Apps, inicia sesión en Azure y has clic en el signo "+" para crear una nueva aplicación web estática. Se te pedirá que designes qué clave de suscripción usar.

Sigue el asistente iniciado por la extensión para darle un nombre a la aplicación, elige uno de los marco de trabajo preestablecidos y designa la raíz de la aplicación (generalmente `/`) y la ubicación del archivo creado `/dist`. El asistente se ejecutará y creará una acción de GitHub en el repositorio en una carpeta `.github`.

La acción funcionará para desplegar tu aplicación (ve el progreso en la pestaña Acciones del repositorio) y, cuando se complete con éxito, puedes ver tu aplicación en la dirección provista en la ventana de progreso de la extensión haciendo clic en el botón 'Examinar sitio web' que aparece cuando la acción de GitHub se haya ejecutado.
