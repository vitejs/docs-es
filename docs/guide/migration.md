# Migración desde v5

## API de Entorno

Como parte de la nueva [API de Entorno](/guide/api-environment.md) experimental, se necesitó una gran reestructuración interna. Vite 6 se esfuerza por evitar cambios incompatibles para asegurar que la mayoría de los proyectos puedan actualizarse rápidamente a la nueva versión mayor. Esperaremos hasta que una gran parte del ecosistema se haya trasladado para estabilizar y comenzar a recomendar el uso de las nuevas API. Pueden haber algunos casos extremos, pero estos solo deberían afectar el uso de bajo nivel por parte de frameworks y herramientas. Hemos trabajado con los mantenedores del ecosistema para mitigar estas diferencias antes del lanzamiento. Por favor, [inicia un reporte](https://github.com/vite/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) si encuentras una regresión.

Algunas API internas han sido eliminadas debido a cambios en la implementación de Vite. Si dependías de alguna de ellas, por favor crea una [solicitud de función](https://github.com/vite/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## API de Ejecución de Vite

La API experimental de Ejecución de Vite evolucionó a la API de Ejecutores de Módulos, lanzada en Vite 6 como parte de la nueva [API de Entorno](/guide/api-environment) experimental. Dado que la característica era experimental, la eliminación de la API anterior introducida en Vite 5.1 no es un cambio incompatible, pero los usuarios necesitarán actualizar su uso al equivalente de Ejecutores de Módulos como parte de la migración a Vite 6.

## Migración desde v4

Consulta primero la [Guía de migración desde v4](./migration-v4-to-v5.html) para ver los cambios necesarios para migrar tu aplicación a Vite 5, y luego continúa con los cambios en esta página.
