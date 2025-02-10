# Interfaz de Línea de Comandos

## Servidor de desarrollo

### `vite`

Inicia el servidor de desarrollo de Vite en el directorio actual. `vite dev` y `vite serve` son alias de `vite`.

#### Uso

```bash
vite [root]
```

#### Opciones

| Opción                    | Descripción                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | Especificar el nombre de host (`string`)                                                                                              |
| `--port <port>`           | Especificar el puerto (`number`)                                                                                                      |
| `--open [path]`           | Abrir el navegador al iniciar (`boolean \| string`)                                                                                   |
| `--cors`                  | Habilitar CORS (`boolean`)                                                                                                            |
| `--strictPort`            | Salir si el puerto especificado ya está en uso (`boolean`)                                                                            |
| `--force`                 | Forzar al optimizador a ignorar la caché y volver a compilar (`boolean`)                                                              |
| `-c, --config <file>`     | Usar el archivo de configuración especificado (`string`)                                                                              |
| `--base <path>`           | Ruta base pública (predeterminado: `/`) (`string`)                                                                                    |
| `-l, --logLevel <level>`  | Nivel de log: info \| warn \| error \| silent (`string`)                                                                              |
| `--clearScreen`           | Permitir/deshabilitar la limpieza de pantalla al registrar logs (`boolean`)                                                           |
| `--configLoader <loader>` | Usar `bundle` para compilar la configuración con `esbuild` o `runner` (experimental) para procesarla en tiempo real                   |
| `--profile`               | Iniciar el inspector de Node.js incorporado (ver [cuellos de botella de rendimiento](/guide/troubleshooting#performance-bottlenecks)) |
| `-d, --debug [feat]`      | Mostrar logs de depuración (`string \| boolean`)                                                                                      |
| `-f, --filter <filter>`   | Filtrar logs de depuración (`string`)                                                                                                 |
| `-m, --mode <mode>`       | Definir el modo de entorno (`string`)                                                                                                 |
| `-h, --help`              | Mostrar opciones disponibles en CLI                                                                                                   |
| `-v, --version`           | Mostrar número de versión                                                                                                             |

## Compilación

### `vite build`

Compila para producción.

#### Uso

```bash
vite build [root]
```

#### Opciones

| Opción                         | Descripción                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | Objetivo de la transpilación (predeterminado: `"modules"`) (`string`)                                                                 |
| `--outDir <dir>`               | Directorio de salida (predeterminado: `dist`) (`string`)                                                                              |
| `--assetsDir <dir>`            | Carpeta para colocar los assets dentro de `outDir` (predeterminado: `"assets"`) (`string`)                                            |
| `--assetsInlineLimit <number>` | Límite en bytes para incrustar assets como base64 (predeterminado: `4096`) (`number`)                                                 |
| `--ssr [entry]`                | Construcción del SSR para la entrada especificada (`string`)                                                                          |
| `--sourcemap [output]`         | Generar mapas de origen (`boolean \| "inline" \| "hidden"`)                                                                           |
| `--minify [minifier]`          | Habilitar/deshabilitar minificación o especificar minificador (predeterminado: `"esbuild"`) (`boolean \| "terser" \| "esbuild"`)      |
| `--manifest [name]`            | Generar un manifiesto JSON de compilación (`boolean \| string`)                                                                       |
| `--ssrManifest [name]`         | Generar un manifiesto JSON para SSR (`boolean \| string`)                                                                             |
| `--emptyOutDir`                | Vaciar `outDir` si está fuera del directorio raíz (`boolean`)                                                                         |
| `-w, --watch`                  | Reconstrucción automática al detectar cambios en los archivos (`boolean`)                                                             |
| `-c, --config <file>`          | Usar el archivo de configuración especificado (`string`)                                                                              |
| `--base <path>`                | Ruta base pública (predeterminado: `/`) (`string`)                                                                                    |
| `-l, --logLevel <level>`       | Nivel de log: info \| warn \| error \| silent (`string`)                                                                              |
| `--clearScreen`                | Permitir/deshabilitar la limpieza de pantalla al registrar logs (`boolean`)                                                           |
| `--configLoader <loader>`      | Usar `bundle` para compilar la configuración con `esbuild` o `runner` (experimental) para procesarla en tiempo real                   |
| `--profile`                    | Iniciar el inspector de Node.js incorporado (ver [cuellos de botella de rendimiento](/guide/troubleshooting#performance-bottlenecks)) |
| `-d, --debug [feat]`           | Mostrar logs de depuración (`string \| boolean`)                                                                                      |
| `-f, --filter <filter>`        | Filtrar logs de depuración (`string`)                                                                                                 |
| `-m, --mode <mode>`            | Definir el modo de entorno (`string`)                                                                                                 |
| `-h, --help`                   | Mostrar opciones disponibles en CLI                                                                                                   |
| `--app`                        | Compilar todos los entornos, equivalente a `builder: {}` (`boolean`, experimental)                                                    |

## Otros

### `vite optimize`

Precompila las dependencias.

#### Uso

```bash
vite optimize [root]
```

#### Opciones

| Opción                    | Descripción                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--force`                 | Forzar al optimizador a ignorar la caché y volver a compilar (`boolean`)                                            |
| `-c, --config <file>`     | Usar el archivo de configuración especificado (`string`)                                                            |
| `--base <path>`           | Ruta base pública (predeterminado: `/`) (`string`)                                                                  |
| `-l, --logLevel <level>`  | Nivel de log: info \| warn \| error \| silent (`string`)                                                            |
| `--clearScreen`           | Permitir/deshabilitar la limpieza de pantalla al registrar logs (`boolean`)                                         |
| `--configLoader <loader>` | Usar `bundle` para compilar la configuración con `esbuild` o `runner` (experimental) para procesarla en tiempo real |
| `-d, --debug [feat]`      | Mostrar logs de depuración (`string \| boolean`)                                                                    |
| `-f, --filter <filter>`   | Filtrar logs de depuración (`string`)                                                                               |
| `-m, --mode <mode>`       | Definir el modo de entorno (`string`)                                                                               |
| `-h, --help`              | Mostrar opciones disponibles en CLI                                                                                 |

### `vite preview`

Previsualiza localmente la compilación de producción. No se recomienda como servidor de producción.

#### Uso

```bash
vite preview [root]
```

#### Opciones

| Opción                    | Descripción                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | Especificar el nombre de host (`string`)                                                                            |
| `--port <port>`           | Especificar el puerto (`number`)                                                                                    |
| `--strictPort`            | Salir si el puerto especificado ya está en uso (`boolean`)                                                          |
| `--open [path]`           | Abrir el navegador al iniciar (`boolean \| string`)                                                                 |
| `--outDir <dir>`          | Directorio de salida (predeterminado: `dist`) (`string`)                                                            |
| `-c, --config <file>`     | Usar el archivo de configuración especificado (`string`)                                                            |
| `--base <path>`           | Ruta base pública (predeterminado: `/`) (`string`)                                                                  |
| `-l, --logLevel <level>`  | Nivel de log: info \| warn \| error \| silent (`string`)                                                            |
| `--clearScreen`           | Permitir/deshabilitar la limpieza de pantalla al registrar logs (`boolean`)                                         |
| `--configLoader <loader>` | Usar `bundle` para compilar la configuración con `esbuild` o `runner` (experimental) para procesarla en tiempo real |
| `-d, --debug [feat]`      | Mostrar logs de depuración (`string \| boolean`)                                                                    |
| `-f, --filter <filter>`   | Filtrar logs de depuración (`string`)                                                                               |
| `-m, --mode <mode>`       | Definir el modo de entorno (`string`)                                                                               |
| `-h, --help`              | Mostrar opciones disponibles en CLI                                                                                 |
