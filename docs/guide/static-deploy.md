# Despliegue de un sitio estático

Las siguientes guías se basan en algunas suposiciones compartidas:

- Estás utilizando la ubicación de salida de compilación predeterminada (`dist`). Esta ubicación [se puede cambiar usando `build.outDir`](/config/build-options#build-outdir), y puedes extrapolar las instrucciones de estas guías en ese caso.
- Estás usando npm. Puedes usar comandos equivalentes para ejecutar los scripts si estás usando Yarn u otros gestores de paquetes.
- Vite está instalado como una dependencia de desarrollo local en tu proyecto y has configurado los siguientes scripts de npm:

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Es importante tener en cuenta que `vite preview` está diseñada para obtener una vista previa de la compilación localmente y no como un servidor de producción.

:::tip NOTA
Estas guías brindan instrucciones para realizar un despliegue de tu sitio estatico con Vite. Vite también tiene soporte para Server-Side Rendering. SSR se refiere a marcos front-end que admiten la ejecución de la misma aplicación en Node.js, renderizándola previamente en HTML y finalmente hidratándola en el cliente. Consulta la [Guía de SSR](./ssr) para obtener información sobre esta función. Por otro lado, si estás buscando una integración con marcos de trabajo tradicionales del lado del servidor, consulta la [Guía de integración de backend](./backend-integration) en su lugar.
:::

## Compilación de la aplicación

Puedes ejecutar el comando `npm run build` para compilar la aplicación.

```bash
npm run build
```

De forma predeterminada, la salida de compilación se colocará en `dist`. Puedes desplegar esta carpeta `dist` en cualquiera de tus plataformas preferidas.

### Prueba local de la aplicación

Una vez que hayas creado la aplicación, puedes probarla localmente ejecutando el comando `npm run preview`.

```bash
npm run preview
```

El comando `vite preview` arrancará el servidor web estático local que sirve los archivos desde `dist` en `http://localhost:5000`. Es una manera fácil de verificar si la compilación de producción se ve bien en el entorno local.

Puedes configurar el puerto del servidor pasando el indicador `--port` como argumento.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Ahora el comando `preview` iniciará el servidor en `http://localhost:8080`.

## GitHub Pages

1. **Actualizar la configuración de Vite**

   Configura la `base` correcta en `vite.config.js`.

   Si estás desplegando en `https://<USERNAME>.github.io/` o en un dominio personalizado a través de GitHub Pages (por ejemplo, `www.example.com`), configura `base` como `'/'`. Alternativamente, puedes eliminar `base` de la configuración, ya que por defecto es `'/'`.

   Si estás desplegando en `https://<USERNAME>.github.io/<REPO>/` (por ejemplo, tu repositorio está en `https://github.com/<USERNAME>/<REPO>`), entonces configura `base` como `'/<REPO>/'`.

2. **Habilitar GitHub Pages**

   En tu repositorio, ve a **Configuración → Pages**. En **Build and deployment**, abre el desplegable **Source** y selecciona **GitHub Actions**.

   GitHub ahora desplegará tu sitio usando un [workflow](https://docs.github.com/es/actions/concepts/workflows/workflows) de GitHub Actions, que es necesario ya que Vite requiere un paso de compilación para el despliegue.

3. **Crear un workflow**

   Crea un archivo nuevo en tu repositorio en la ruta `.github/workflows/deploy.yml`. También puedes hacer clic en **"create your own"** en el paso anterior, lo que generará un archivo de workflow inicial.

   Aquí tienes un workflow de ejemplo que instala dependencias con npm, compila el sitio y lo despliega cada vez que haces push de cambios a la rama `main`:

   <<< ./static-deploy-github-pages.yaml#content [.github/workflows/deploy.yml]

## GitLab Pages y GitLab CI

1. Configura la `base` correcta en `vite.config.js`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/`, puedes omitir `base` ya que el valor predeterminado es `'/'`.

   Si estás desplegando en `https://<NOMBRE DE USUARIO o GRUPO>.github.io/<REPO>/`, por ejemplo, tu repositorio está en `https://github.com/<NOMBRE DE USUARIO>/<REPO>`, configura `base` en `'/<REPO>/'`.

2. Crea un archivo llamado `.gitlab-ci.yml` en la raíz de tu proyecto con el contenido a continuación. Esto creará y desplegará tu sitio cada vez que realices cambios en el contenido:

   ```yaml [.gitlab-ci.yml]
   image: node:lts
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

### CLI de Netlify

1. Instala la [CLI de Netlify](https://cli.netlify.com/).
2. Crea un nuevo sitio usando `ntl init`.
3. Despliega usando `ntl deployment`.

```bash
# Instala el CLI de Netlify
$ npm install -g netlify-cli
# Crea un nuevo sitio en Netlify
$ ntl init
# Despliega en una URL de vista previa única
$ ntl deploy
```

La CLI de Netlify te compartirá una URL de vista previa para inspeccionar. Cuando esté listo para entrar a producción, usa el indicador `prod`:

```bash
# Despliega el sitio en producción
$ ntl deploy --prod
```

### Netlify con Git

1. Haz un push de tu código en tu repositorio de git (GitHub, GitLab, BitBucket, Azure DevOps).
2. [Importa el proyecto](https://app.netlify.com/start) a Netlify.
3. Elige la rama, el directorio de salida y configura las variables de entorno, si es necesario.
4. Haz clic en **Deploy**.
5. ¡Tu aplicación Vite estará desplegada!

Después de que tu proyecto haya sido importado y desplegado, todos los pushs subsiguientes a ramas que no sean la de producción junto con las solicitudes de cambios generarán una [vista previa de despliegue](https://docs.netlify.com/site-deploys/deploy-previews/), y todos los cambios realizados en la rama de producción (comúnmente "main") darán como resultado un [despliegue en producción](https://docs.netlify.com/site-deploys/overview/#definitions).

## Vercel

### CLI de Vercel

1. Instala el [CLI de Vercel](https://vercel.com/cli) y ejecuta `vercel` para desplegar.
2. Vercel detectará que estás utilizando Vite y habilitará la configuración correcta para su despliegue.
3. ¡Tu aplicación está desplegada! (por ejemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel para Git

1. Haz un push de tu código en tu repositorio de git (GitHub, GitLab, Bitbucket).
2. [Importa tu proyecto Vite](https://vercel.com/new) a Vercel.
3. Vercel detectará que estás utilizando Vite y habilitará la configuración correcta para su despliegue.
4. ¡Tu aplicación está desplegada! (por ejemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Después de que tu proyecto haya sido importado y desplegado, todos los push subsiguientes a las ramas generarán [Vistas previas de despliegues](https://vercel.com/docs/concepts/deployments/environments#preview), y todos los cambios realizados en la rama de producción (comúnmente "main") dará como resultado un [Despliegue en producción](https://vercel.com/docs/concepts/deployments/environments#production).

Obtén más información sobre [Integración Git](https://vercel.com/docs/concepts/git) de Vercel.

## Cloudflare Pages

### Cloudflare Pages via Wrangler

1. Instala la [CLI de Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Autenticate a Wrangler con tu cuenta de Cloudflare usando `wrangler login`.
3. Ejecuta tu comando de compilación.
4. Despliega usando `npx wrangler pages deploy dist`.

```bash
# Instala la CLI de Wrangler
$ npm install -g wrangler

# Inicia sesión en la cuenta de Cloudflare desde la CLI
$ wrangler login

# Ejecuta tu comando de compilación.
$ npm run build

# Crea un nuevo despliegue
$ npx wrangler pages deploy dist
```

Después de cargar tus recursos, Wrangler le dará una URL de vista previa para inspeccionar el sitio. Cuando inicies sesión en el panel de control de Cloudflare Pages, verás tu nuevo proyecto.

### Cloudflare Pages con Git

1. Haz push del código a tu repositorio git (GitHub, GitLab).
2. Inicia sesión en el panel de control de Cloudflare y selecciona tu cuenta en **Inicio de cuenta** > **Páginas**.
3. Selecciona **Crear un nuevo proyecto** y la opción **Conectar Git**.
4. Selecciona el proyecto de git que deseas desplegar y has clic en **Comenzar configuración**
5. Selecciona el marco preestablecido correspondiente en la configuración de compilación según el marco Vite que hayas escogido.
6. ¡Luego guarda y despliega!
7. ¡Tu aplicación está desplegada! (por ejemplo, `https://<NOMBRE DEL PROYECTO>.pages.dev/`)

Después de que tu proyecto haya sido importado y desplegado, todos los push subsiguientes a las ramas generarán [Vistas previas de despliegues](https://developers.cloudflare.com/pages/platform/preview-deployments/) a menos que se especifique lo contrario en los [controles de compilación de ramas](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Todos los cambios en la rama de producción (comúnmente "main") darán como resultado un despliegue de producción.

También puedes agregar dominios personalizados y manejar la configuración de compilación personalizada en las páginas. Obtén más información sobre la [Integración de Cloudflare Pages con Git](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Asegúrate de tener [firebase-tools](https://www.npmjs.com/package/firebase-tools) instalado.

2. Crea `firebase.json` y `.firebaserc` en la raíz de tu proyecto con el siguiente contenido:

   ```json [firebase.json]
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

   ```js [.firebaserc]
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

## Azure Static Web Apps

Puedes desplegar rápidamente una aplicación Vite con el servicio Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps). Necesitas:

- Una cuenta de Azure y una clave de suscripción. Puedes crear una [cuenta gratuita de Azure aquí](https://azure.microsoft.com/free).
- El código de tu aplicación enviado a [GitHub](https://github.com).
- La [Extensión SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) en [Visual Studio Code](https://code.visualstudio.com).

Instala la extensión en Visual Studio Code y navega hasta la raíz de la aplicación. Abre la extensión Static Web Apps, inicia sesión en Azure y has clic en el signo "+" para crear una nueva aplicación web estática. Se te pedirá que designes qué clave de suscripción usar.

Sigue el asistente iniciado por la extensión para darle un nombre a la aplicación, elige uno de los marco de trabajo preestablecidos y designa la raíz de la aplicación (generalmente `/`) y la ubicación del archivo creado `/dist`. El asistente se ejecutará y creará una acción de GitHub en el repositorio en una carpeta `.github`.

La acción funcionará para desplegar tu aplicación (ve el progreso en la pestaña Acciones del repositorio) y, cuando se complete con éxito, puedes ver tu aplicación en la dirección provista en la ventana de progreso de la extensión haciendo clic en el botón 'Examinar sitio web' que aparece cuando la acción de GitHub se haya ejecutado.

## Render

Puedes desplegar tu aplicación Vite como un sitio estático en [Render](https://render.com/).

1. Crea una [cuenta de Render](https://dashboard.render.com/register).

2. En el [Panel](https://dashboard.render.com/), has clic en el botón **Nuevo** y selecciona **Sitio estático**.

3. Conecta tu cuenta de GitHub/GitLab o usa un repositorio público.

4. Especifica un nombre para el proyecto y una rama.

   - **Comando de compilación**: `npm install && npm run build`
   - **Directorio público**: `dist`

5. Has clic en **Crear sitio estático**.

   Tu aplicación debe desplegarse en `https://<PROJECTNAME>.onrender.com/`.

De forma predeterminada, cualquier nueva confirmación enviada a la rama especificada activará automáticamente un nuevo despliegue. El [autodespliegue](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) se puede configurar en la configuración del proyecto.

También puedes agregar un [dominio personalizado](https://render.com/docs/custom-domains) a tu proyecto.

<!--
  NOTA: Las secciones a continuación están reservadas para más plataformas de implementación no enumeradas anteriormente.
  Siéntete libre de enviar una solicitud de cambios que agregue una nueva sección con un enlace a la guía de implementación de tu plataforma, siempre y cuando cumpla con estos criterios:
  1. Los usuarios deben poder implementar su sitio de forma gratuita.
  2. Las ofertas de nivel gratuito deben alojar el sitio indefinidamente y no estar limitadas en el tiempo.
     Ofrecer un número limitado de recursos computacionales o cuentas de sitios a cambio está bien.
  3. Las guías enlazadas no deben contener contenido malicioso.
  El equipo de Vite puede cambiar los criterios y auditar la lista actual de vez en cuando.
  Si se elimina una sección, se notificará a los autores originales de la solicitud de cambios antes de hacerlo.
-->
## Flightcontrol

Despliega tu sitio estático usando [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite), siguiendo estas [instrucciones](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## Alojamiento de sitios estáticos en Kinsta

Puedes desplegar tu aplicación Vite como un sitio estático en [Kinsta](https://kinsta.com/static-site-hosting/) siguiendo estas [instrucciones](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite).

## Alojamiento de sitio estático en xmit

Despliega tu sitio estático utilizando [xmit](https://xmit.co) siguiendo esta [guía](https://xmit.dev/posts/vite-quickstart/).

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) es una plataforma de despliegue que se integra directamente en tu proceso de compilación y proporciona distribución global en el borde para module federation y otros tipos de aplicaciones.

Zephyr sigue un enfoque diferente al de otros proveedores en la nube. Se integra directamente con el proceso de compilación de Vite, por lo que cada vez que compilas o ejecutas el servidor de desarrollo de tu aplicación, esta se desplegará automáticamente con Zephyr Cloud.

Sigue los pasos de [la guía de despliegue de Vite](https://docs.zephyr-cloud.io/bundlers/vite) para comenzar.
