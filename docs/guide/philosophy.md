# Filosofía del Proyecto

## Núcleo extensible y liviano

Vite no tiene la intención de cubrir todos los casos de uso para todos los usuarios. Vite tiene como objetivo soportar los patrones más comunes para construir aplicaciones web fuera de la caja, pero [el núcleo de Vite](https://github.com/vitejs/vite) debe mantenerse liviano con una API reducida para mantener el proyecto de manera sostenible a largo plazo. Este objetivo es posible gracias al [sistema de plugins de Vite basado en Rollup](./api-plugin.md). Las funcionalidades que se pueden implementar como plugins externos generalmente no se agregarán al núcleo de Vite. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) es un excelente ejemplo de lo que se puede lograr fuera del núcleo de Vite, y hay muchos [plugins bien mantenidos](https://github.com/vitejs/awesome-vite#plugins) para cubrir tus necesidades. Vite trabaja en estrecha colaboración con el proyecto Rollup para garantizar que los plugins se puedan utilizar tanto en proyectos de Vite como en proyectos estándar de Rollup, tratando de llevar las extensiones necesarias a la API de plugins cuando sea posible.

## Impulsando la Web Moderna

Vite ofrece funcionalidades con opiniones que promueven la escritura de código moderno. Por ejemplo:

- El código fuente solo puede escribirse en ESM, donde las dependencias que no son ESM deben ser [precompiladas como ESM](./dep-pre-bundling) para funcionar.
- Se fomenta el uso de los web workers escritos con la sintaxis [`new Worker`](./features#web-workers) para seguir los estándares modernos.
- Los módulos de Node.js no se pueden utilizar en el navegador.

Al agregar nuevas funcionalidades, se siguen estos patrones para crear una API a prueba de futuro, que no siempre es compatible con otras herramientas de compilación.

## Enfoque pragmático hacia el rendimiento

Vite se ha centrado en el rendimiento desde sus [orígenes](./why.md). Su arquitectura de servidor de desarrollo permite una actualización en caliente (HMR) que se mantiene rápida a medida que los proyectos crecen. Vite utiliza herramientas nativas como [esbuild](https://esbuild.github.io/) y [SWC](https://github.com/vitejs/vite-plugin-react-swc) para implementar tareas intensivas, pero mantiene el resto del código en JavaScript para equilibrar velocidad y flexibilidad. Cuando es necesario, los frameworks utilizarán [Babel](https://babeljs.io/) para compilar el código del usuario. Durante el tiempo de compilación, Vite actualmente utiliza [Rollup](https://rollupjs.org/), donde el tamaño del paquete y el acceso a un amplio ecosistema de plugins son más importantes que la velocidad bruta. Vite continuará evolucionando internamente, utilizando nuevas bibliotecas a medida que aparezcan para mejorar la experiencia de desarrollo (DX) y mantener su API estable.

## Construyendo Frameworks de Trabajo sobre Vite

Aunque Vite se puede utilizar directamente por los usuarios, brilla como una herramienta para crear frameworks. El núcleo de Vite es independiente del framework, pero existen plugins pulidos para cada framework de interfaz de usuario (IU). Su [API en JavaScript](./api-javascript.md) permite a los autores de frameworks de aplicaciones utilizar las funcionalidades de Vite para crear experiencias personalizadas para sus usuarios. Vite incluye soporte para [primitivos de SSR](./ssr.md), que generalmente están presentes en herramientas de nivel superior pero que son fundamentales para construir web frameworks modernos. Y los plugins de Vite completan el panorama al ofrecer una forma de compartir entre diferentes frameworks. Vite también es una excelente opción cuando se combina con [frameworks de backend](./backend-integration.md) como [Ruby](https://vite-ruby.netlify.app/) y [Laravel](https://laravel.com/docs/10.x/vite).

## Un ecosistema activo

La evolución de Vite es una cooperación entre los mantenedores de frameworks y plugins, los usuarios y el equipo de Vite. Fomentamos la participación activa en el desarrollo del núcleo de Vite una vez que un proyecto adopta Vite. Trabajamos en estrecha colaboración con los proyectos principales del ecosistema para minimizar las regresiones en cada lanzamiento, ayudados por herramientas como [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Esto nos permite ejecutar la integración continua (CI) de los proyectos principales que utilizan Vite en las solicitudes de cambios seleccionadas y nos brinda un estado claro de cómo reaccionaría el ecosistema ante un lanzamiento. Nos esforzamos por solucionar las regresiones antes de que afecten a los usuarios y permitir que los proyectos se actualicen a las versiones siguientes tan pronto como se publiquen. Si estás trabajando con Vite, te invitamos a unirte al [Discord de Vite](https://chat.vite.dev) y participar en el proyecto también.
