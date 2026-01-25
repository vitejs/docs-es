# Gestión de recursos estáticos

- Relacionado: [Ruta base pública](./build#ruta-base-publica)
- Relacionado: [Opción de configuración `assetsInclude`](/config/shared-options#assetsinclude)

## Importar recursos como URL

Importar un recurso estático retornará la URL pública que es resuelta al servirla:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Por ejemplo, `imgUrl` será `/src/img.png` durante el desarrollo y se convertirá en `/assets/img.2d8efhg.png` en la compilación de producción.

El comportamiento es similar al `file-loader` de webpack. La diferencia es que la importación puede ser usando rutas públicas absolutas (basadas en la raíz del proyecto durante el desarrollo) o rutas relativas.

- Las referencias `url()` en CSS se manejan de la misma manera.

- Si usa el plugin de Vue, las referencias de recursos en las plantillas de Vue SFC se convierten automáticamente en importaciones.

- Los tipos de archivos comunes de imágenes, medios y fuentes se detectan como recursos automáticamente. Puedes ampliar la lista interna utilizando la opción [`assetsInclude`](/config/shared-options#assetsinclude).

- Los recursos referenciados se incluyen como parte del gráfico de compilación de recursos, obtendrán nombres de archivo con hash y los plugins pueden procesarlos para su optimización.

- Los recursos más pequeños en bytes que la opción [`assetsInlineLimit`](/config/build-options#build-assetsinlinelimit) se insertarán como URL de datos en base64.

- Los marcadores de posición de Git LFS se excluyen automáticamente de la inserción porque no contienen el contenido del archivo que representan. Para obtener la inserción, asegúrate de descargar el contenido del archivo a través de Git LFS antes de compilar.

- TypeScript, de forma predeterminada, no reconoce las importaciones de recursos estáticos como módulos válidos. Para solucionar esto, incluye [`vite/client`](./features#tipos-de-clientes).

::: tip Incrustación de SVG a través de `url()`
Cuando se pasa una URL de SVG a una compilación manual de `url()` mediante JS, la variable debe estar colocada entre comillas dobles.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.svg'
document.getElementById('hero-img').style.background = `url("${imgUrl}")`
```

:::

### Importaciones de URL explícita

Los recursos que no están incluidos en la lista interna o en `assetsInclude` se pueden importar explícitamente como una URL usando el sufijo `?url`. Esto es útil, por ejemplo, para importar los [Houdini Paint Worklets](https://developer.mozilla.org/en-US/docs/Web/API/CSS/paintWorklet_static).

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Manejo explícito de elementos en línea

Los recursos pueden ser importados explícitamente con o sin inlining utilizando los sufijos `?inline` o `?no-inline`, respectivamente.

```js twoslash
import 'vite/client'
// ---corte---
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

### Importar recursos como cadenas de texto

Los recursos pueden ser importados como cadenas de texto usando el sufijo `?raw`.

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### Importar scripts como Worker

Los scripts pueden ser importados como workers web con los sufijos `?worker` o `?sharedworker`.

```ts twoslash
import 'vite/client'
// ---cut---
// Fragmento separado en la compilación de producción
import Worker from './shader.js?worker'
const worker = new Worker()
```

```ts twoslash
import 'vite/client'
// ---cut---
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```ts twoslash
import 'vite/client'
// ---cut---
// En línea como cadena base64
import InlineWorker from './shader.js?worker&inline'
```

Consulta la [sección Web Worker](./features#web-workers) para obtener más detalles.

## La carpeta `public`

Si tienes recursos que:

- No han sido referenciados en el código fuente (por ejemplo, `robots.txt`)
- Deban conservar exactamente el mismo nombre de archivo (sin hash)
- ...o simplemente no quieres tener que importar un recurso primero solo para obtener su URL

Entonces puedes colocar el recurso en una carpeta `public` especial en la raíz de tu proyecto. Los recursos en ella se servirán en la ruta raíz `/` durante el desarrollo y se copiarán en la raíz de la carpeta dist tal como están.

El directorio predeterminado es `<root>/public`, pero esto se puede configurar a través de la opción [`publicDir`](/config/shared-options#publicdir).

Ten en cuenta que siempre debes hacer referencia a los recursos de `public` utilizando una ruta absoluta desde la raíz. Por ejemplo, `public/icon.png` debería ser referenciado en el código fuente como `/icon.png`.

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) es una característica nativa de ESM que expone la URL del módulo actual. Combinándolo con el [constructor de URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) nativo, podemos obtener la URL completa y resuelta de un recurso estático utilizando la ruta relativa de un Módulo JavaScript:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Esto funciona de forma nativa en los navegadores modernos; de hecho, Vite no necesita procesar este código durante el desarrollo.

Este patrón también admite direcciones URL dinámicas a través de literales de plantilla:

```js
function getImageUrl(name) {
  // ten en cuenta que esto no incluye archivos en subdirectorios
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Durante la compilación en producción, Vite realizará las transformaciones necesarias para que las URL sigan apuntando a la ubicación correcta incluso después del empaquetado y el hashing de recursos. Sin embargo, la cadena de texto de URL debe ser estática la cual permita ser analizada, de otro modo el codigo permanecerá como está, causando errores en tiempo de ejecución si `build.target` no soporta `import.meta.url`.

```js
// Vite will not transform this
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: detalles Cómo funciona  
Vite transformará la función `getImageUrl` a:

```js
import __img0png from './dir/img0.png'
import __img1png from './dir/img1.png'
function getImageUrl(name) {
  const modules = {
    './dir/img0.png': __img0png,
    './dir/img1.png': __img1png,
  }
  return new URL(modules[`./dir/${name}.png`], import.meta.url).href
}
```

:::

::: warning Nota: No funciona con SSR
Este patrón no funciona si estás utilizando Vite para Server-Side Rendering, porque `import.meta.url` tiene una semántica diferente en navegadores con respecto a Node.js. El empaquetado del servidor tampoco puede determinar la URL del host del cliente con anticipación.
:::
