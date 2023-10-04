# Lanzamientos

Los lanzamientos de Vite siguen el [versionamiento semántico](https://semver.org/). Puedes ver la última versión estable de Vite en la [página de Vite en npm](https://www.npmjs.com/package/vite).

Existe un registro de cambios completo de versiones anteriores en [disponible en GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

::: tip Nota
El próximo lanzamiento principal de Vite ocurrirá después del final del soporte para Node 16 en septiembre.

Consulta la [discusión de Vite 5](https://github.com/vitejs/vite/discussions/12466) para obtener más información.
:::

## Ciclo de lanzamientos

Vite no tiene un ciclo de liberación fijo.

- Los lanzamientos de **parches** se publican según sea necesario.
- Las versiones **menores** siempre contienen nuevas funciones y también se publican según sea necesario. Los lanzamientos menores siempre pasan por una fase de prelanzamiento beta.
- Los lanzamientos **principales** generalmente se alinean con el [programa de finalización de soporte de Node.js](https://endoflife.date/nodejs) y se anunciarán con anticipación. Estos lanzamientos pasarán por una fase de discusión temprana y por fases previas al lanzamiento tanto alfa como beta.

La versión principal anterior de Vite seguirá recibiendo correcciones importantes y parches de seguridad. Después de eso, solo recibirá actualizaciones si hay problemas de seguridad. Recomendamos actualizar Vite regularmente. Consulta las [Guías de migración](https://es.vitejs.dev/guide/migration.html) cuando actualices a cada versión principal.

El equipo de Vite se asocia con los principales proyectos del ecosistema para probar nuevas versiones de Vite antes de su lanzamiento a través del [proyecto vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). La mayoría de los proyectos que usan Vite deberían poder ofrecer soporte rápidamente o migrar a nuevas versiones tan pronto como se publiquen.

## Casos especiales de versiones semánticas

### Definiciones de Typescript

Podemos enviar cambios incompatibles a las definiciones de TypeScript entre versiones secundarias. Esto es porque:

- A veces, TypeScript en sí incluye cambios incompatibles entre versiones secundarias, y es posible que tengamos que ajustar los tipos para admitir versiones más nuevas de TypeScript.
- Ocasionalmente, es posible que necesitemos adoptar funciones que solo están disponibles en una versión más nueva de TypeScript, elevando la versión mínima requerida de TypeScript.
- Si usas TypeScript, puedes usar un rango de versiones semanticas que bloquee la versión secundaria actual y actualizar manualmente cuando se lanza una nueva versión secundaria de Vite.

### esbuild

[esbuild](https://esbuild.github.io/) es pre-1.0.0 y, a veces, puede traer un cambio importante que es posible que debamos incluir para tener acceso a funciones más nuevas y mejoras de rendimiento. Es posible que superemos la versión de esbuild en una versión menor de Vite.

### Versiones no LTS de Node.js

Las versiones de Node.js que no son LTS (con números impares) no se prueban como parte del CI de Vite, pero aún deberían funcionar antes de su [final de soporte](https://endoflife.date/nodejs).

## Prelanzamientos​

Las versiones menores generalmente pasan por un número no fijo de versiones beta. Los principales lanzamientos pasarán por una fase alfa y una fase beta.

Los lanzamientos preliminares permiten a los primeros usuarios y mantenedores del ecosistema realizar pruebas de integración y estabilidad, y proporcionar comentarios. No utilices versiones preliminares en producción. Todos los lanzamientos preliminares se consideran inestables y pueden que se hagan cambios importantes en el medio. Fija siempre las versiones exactas cuando utilices prelanzamientos.

## Obsolencias

Periódicamente descartamos características que han sido reemplazadas por mejores alternativas en versiones menores. Las funciones obsoletas seguirán funcionando con un advertencia de tipo o registrada. Se eliminarán en la próxima versión principal después de entrar en estado obsoleto. La [Guía de migración](/guide/migration.html) para cada versión principal enumerará estas eliminaciones y documentará una ruta de actualización para ellas.

## Características experimentales

Algunas funciones se marcan como experimentales cuando se lanzan en una versión estable de Vite. Las características experimentales nos permiten recopilar experiencias del mundo real para influir en su diseño final. El objetivo es permitir que los usuarios proporcionen comentarios probándolos en producción. Las características experimentales en sí mismas se consideran inestables y solo deben usarse de manera controlada. Estas funciones pueden cambiar entre versiones menores, por lo que los usuarios deben anclar su versión de Vite cuando se confían en ellas.
