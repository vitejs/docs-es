# Gestión de recursos estáticos

- Relacionado: [Ruta base pública](./build#ruta-base-publica)
- Relacionado: [Opción de configuración `assetsInclude`](/config/#assetsinclude)

## Importar recursos como URL

Importar un recurso estático retornará la URL pública que es resuelta al servirla:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Por ejemplo, `imgUrl` será `/img.png` durante el desarrollo y se convertirá en `/assets/img.2d8efhg.png` en la compilación de producción.

El comportamiento es similar al `file-loader` de webpack. La diferencia es que la importación puede ser usando rutas públicas absolutas (basadas en la raíz del proyecto durante el desarrollo) o rutas relativas.

- Las referencias `url()` en CSS se manejan de la misma manera.

- Si usa el complemento de Vue, las referencias de recursos en las plantillas de Vue SFC se convierten automáticamente en importaciones.

- Los tipos de archivos comunes de imágenes, medios y fuentes se detectan como recursos automáticamente. Puedes ampliar la lista interna utilizando la opción [`assetsInclude`](/config/#assetsinclude).

- Los recursos referenciados se incluyen como parte del gráfico de compilación de recursos, obtendrán nombres de archivo con hash y los complementos pueden procesarlos para su optimización.

- Los recursos más pequeños en bytes que la opción [`assetsInlineLimit`](/config/#build-assetsinlinelimit) se insertarán como URL de datos en base64.

### Importaciones de URL explícita

Los recursos que no están incluidos en la lista interna o en `assetsInclude`, se pueden importar explícitamente como una URL usando el sufijo `?url`. Esto es útil, por ejemplo, para importar los [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Importar recursos como cadenas de texto

Los recursos pueden ser importados como cadenas de texto usando el sufijo `?raw`.

```js
import shaderString from './shader.glsl?raw'
```

### Importar scripts como Worker

Los scripts pueden ser importados como workers web con los sufijos `?worker` o `?sharedworker`.

```js
// Fragmento separado en la compilación de producción
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// En línea como cadena base64
import InlineWorker from './shader.js?worker&inline'
```

<!-- Check out the [Web Worker section](./features.md#web-workers) for more details. -->

Consulta la [sección Web Worker](./features.md#web-workers) para obtener más detalles.

## La carpeta `public`

Si tienes recursos que:

- No han sido referenciados en el código fuente (por ejemplo, `robots.txt`)
- Deban conservar exactamente el mismo nombre de archivo (sin hash)
- ...o simplemente no quieres tener que importar un recurso primero solo para obtener su URL

Entonces puedes colocar el recurso en una carpeta `public` especial en la raíz de tu proyecto. Los recursos en ella se servirán en la ruta raíz `/` durante el desarrollo y se copiarán en la raíz de la carpeta dist tal como están.

El directorio predeterminado es `<root>/public`, pero esto se puede configurar a través de la opción [`publicDir`](/config/#publicdir).

Ten en cuenta que:

- Siempre debes hacer referencia a los recursos de `public` utilizando la ruta raíz absoluta; por ejemplo, `public/icon.png` debe estar referenciado en el código fuente como `/icon.png`.
- Los recursos en `public` no se pueden importar desde JavaScript.

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
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Durante la compilación en producción, Vite realizará las transformaciones necesarias para que las URL sigan apuntando a la ubicación correcta incluso después del empaquetado y el hashing de recursos. Sin embargo, la cadena de texto de URL debe ser estática la cual permita ser analizada, de otro modo el codigo permanecerá como está, causando errores en tiempo de ejecución si `build.target` no soporta `import.meta.url`.

```js
// Vite will not transform this
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: warning Nota: No funciona con SSR
Este patrón no funciona si estás utilizando Vite para Server-Side Rendering, porque `import.meta.url` tiene una semántica diferente en navegadores con respecto a Node.js. El empaquetado del servidor tampoco puede determinar la URL del host del cliente con anticipación.
:::

::: warning `target` debe ser `es2020` o superior
Este patrón no funcionará si [build-target](https://vitejs.dev/config/#build-target) o [optimizedeps.esbuildoptions.target](https://vitejs.dev/config/#optimizedeps-esbuildoptions) se configura en un valor inferior a `es2020`.
