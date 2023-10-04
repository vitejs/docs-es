# Migración desde v4

## Soporte de Node.js

Vite ya no es compatible con Node.js 14/16/17/19, versiones que alcanzaron su final de soporte. Ahora se requiere Node.js 18/20+.

## API de Node para la compilación CJS de Vite, ahora obsoleta

La API de Node para la compilación CJS de Vite ahora está en desuso. Al llamar a `require('vite')`, ahora se registra una advertencia de obsolescencia. En su lugar, debes actualizar tus archivos o frameworks para importar la compilación ESM de Vite.

En un proyecto básico de Vite, asegúrate que:

1. El contenido del archivo `vite.config.js` utiliza la sintaxis ESM.
2. El archivo `package.json` más cercano tiene `"type": "module"`, o usa la extensión `.mjs`, por ejemplo, `vite.config.mjs`.

Para otros proyectos, existen algunos enfoques generales:

- **Configura ESM como predeterminado, optar por CJS si es necesario:** Agrega `"type": "module"` en el
  `package.json` del proyecto. Todos los archivos `*.js` ahora se interpretan como ESM y deben utilizar la sintaxis de ESM. Puedes cambiar el nombre de un archivo con la extensión `.cjs` para seguir usando CJS.
- **Mantén CJS como predeterminado, optar por ESM si es necesario:** Si el `package.json` del proyecto no tiene `"type": "module"`, todos los archivos `*.js` se interpretan como CJS. Puedes cambiar el nombre de un archivo con la extensión `.mjs` para usar ESM en su lugar.
- **Importar Vite dinámicamente:** Si necesitas seguir usando CJS, puedes importar Vite dinámicamente usando `import('vite')` en su lugar. Esto requiere que tu código esté escrito en un contexto "asíncrono", pero aún así debería ser manejable ya que la API de Vite es en su mayoría asíncrona.

Consulta la [guía de solución de problemas](/guide/troubleshooting.html#api-de-node-para-la-compilacion-cjs-de-vite-ahora-obsoleto) para obtener más información.

## Cambios generales

### Permitir que las rutas que contienen `.` recurran a index.html

En Vite 4, acceder a una ruta que contenía `.` no recurría a index.html incluso si `appType` estaba configurado en `'SPA'` (predeterminado).
Desde Vite 5, recurrirá a index.html.

Ten en cuenta que el navegador ya no mostrará el mensaje de error 404 en la consola si señala la ruta de la imagen a un archivo inexistente (por ejemplo, `<img src="./file-does-not-exist.png">`) .

### Los archivos de manifiesto ahora se generan en el directorio `.vite` de forma predeterminada

En Vite 4, los archivos de manifiesto (`build.manifest`, `build.ssrManifest`) se generaban en la raíz de `build.outDir` de forma predeterminada. A partir de Vite 5, se generarán en el directorio `.vite` en `build.outDir` de forma predeterminada.

### Los accesos directos de CLI requieren una pulsación adicional de "Intro"

Los atajos del CLI, como `r` para reiniciar el servidor de desarrollo, ahora requieren presionar un `Enter` adicional para activar el atajo. Por ejemplo, `r + Enter` para reiniciar el servidor de desarrollo.

Este cambio evita que Vite absorba y controle accesos directos específicos del sistema operativo, lo que permite una mejor compatibilidad al combinar el servidor de desarrollo de Vite con otros procesos y evita las [advertencias anteriores](https://github.com/vitejs/vite/pull/14342) .

## APIs obsoletas eliminadas

- Exportaciones predeterminadas de archivos CSS (por ejemplo, `import style from './foo.css'`): usa la consulta `?inline` en su lugar
- `import.meta.globEager`: usa `import.meta.glob('*', { eager: true })` en su lugar
- `ssr.format: 'cjs`' y `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))

## Avanzado

Hay algunos cambios que solo afectan a los creadores de complementos/herramientas.

- [[#14119] refactor!: fusionar `PreviewServerForHook` en el tipo `PreviewServer`](https://github.com/vitejs/vite/pull/14119)

También hay otros cambios importantes que sólo afectan a unos pocos usuarios.

- [[#14098] fix!: evita reescribir esto (revierte #5312)](https://github.com/vitejs/vite/pull/14098)
  - El nivel superior "this" se reescribía a "globalThis" de forma predeterminada durante la compilación. Este comportamiento ahora se elimina.
- [[#14231] feat!: agregar extensión a los módulos virtuales internos](https://github.com/vitejs/vite/pull/14231)
  - La identificación de los módulos virtuales internos ahora tiene una extensión (`.js`).

## Migración desde v3

Consulta primero la [Guía de migración desde v3](./migration-v3-to-v4.html) para ver los cambios necesarios para migrar tu aplicación a Vite v4, y luego continúa con los cambios en esta página.
