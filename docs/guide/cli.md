# Interfaz de línea de comando

## Servidor de desarrollo

### `vite`

Inicia el servidor de desarrollo de Vite en el directorio actual.

#### Uso

```bash
vite [root]
```

#### Opciones

| Opciones                 |                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`          | Especifica un nombre de host (`string`)                                                                                                                  |
| `--port <port>`          | Especifica puerto (`number`)                                                                                                                             |
| `--open [path]`          | Abre el navegador al iniciar (`boolean \| string`)                                                                                                       |
| `--cors`                 | Habilita CORS (`boolean`)                                                                                                                                |
| `--strictPort`           | Finaliza si el puerto configurado ya está en uso (`boolean`)                                                                                             |
| `--force`                | Fuerza al optimizador a ignorar el caché y vuelve a empaquetar (`boolean`)                                                                               |
| `-c, --config <file>`    | Usa el archivo de configuración especificado (`string`)                                                                                                  |
| `--base <path>`          | Ruta base pública (por defecto: `/`) (`string`)                                                                                                          |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`)                                                                                                               |
| `--clearScreen`          | Habilita/deshabilita limpiar pantalla al registrar nuevos logs (`boolean`)                                                                               |
| `--profile`              | Inicia el inspector de Node.js incorporado (ver los [cuellos de botella en el rendimiento](/guide/troubleshooting#cuellos-de-botella-en-el-rendimiento)) |
| `-d, --debug [feat]`     | Muestra registros de depuración (`string \| boolean`)                                                                                                    |
| `-f, --filter <filter>`  | Filtra registros de depuración (`string`)                                                                                                                |
| `-m, --mode <mode>`      | Configura el modo de ambiente (`string`)                                                                                                                 |
| `-h, --help`             | Muestra las opciones de CLI disponibles                                                                                                                  |
| `-v, --version`          | Muestra número de versión                                                                                                                                |

## Compilación

### `vite build`

Compilación en producción.

#### Uso

```bash
vite build [root]
```

#### Opciones

| Opciones                       |                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | Transpilar objetivo (por defecto: `"modules"`) (`string`)                                                                                                |
| `--outDir <dir>`               | Directorio de salida (por defecto: `dist`) (`string`)                                                                                                    |
| `--assetsDir <dir>`            | Directorio bajo outDir para colocar recursos dentro (por defecto: `"assets"`) (`string`)                                                                 |
| `--assetsInlineLimit <number>` | Umbral en línea base64 de recursos estáticos en bytes (por defecto: `4096`) (`number`)                                                                   |
| `--ssr [entry]`                | Compila la entrada específicada para server-side rendering (`string`)                                                                                    |
| `--sourcemap [output]`         | Mapas de origen de salida para compilación (por defecto: `false`) (`boolean \| "inline" \| "hidden"`)                                                    |
| `--minify [minifier]`          | Habilita/deshabilita la minificación, o especifica el minificador a usar (por defecto: `"esbuild"`) (`boolean \| "terser" \| "esbuild"`)                 |
| `--manifest [name]`            | Emite el json de manifiesto de compilación (`boolean \| string`)                                                                                         |
| `--ssrManifest [name]`         | Emite el json de manifiesto ssr (`boolean \| string`)                                                                                                    |
| `--emptyOutDir`                | Fuerza el vaciado de outDir cuando está por fuera de la raíz(`boolean`)                                                                                  |
| `-w, --watch`                  | Recompila cuando los módulos han cambiado en el disco(`boolean`)                                                                                         |
| `-c, --config <file>`          | Usa el archivo de configuración especificado(`string`)                                                                                                   |
| `--base <path>`                | Ruta base pública (por defecto: `/`) (`string`)                                                                                                          |
| `-l, --logLevel <level>`       | info \| warn \| error \| silent (`string`)                                                                                                               |
| `--clearScreen`                | Habilita/deshabilita limpiar pantalla al registrar nuevos logs (`boolean`)                                                                               |
| `--profile`                    | Inicia el inspector de Node.js incorporado (ver los [cuellos de botella en el rendimiento](/guide/troubleshooting#cuellos-de-botella-en-el-rendimiento)) |
| `-d, --debug [feat]`           | Muestra registros de depuración (`string \| boolean`)                                                                                                    |
| `-f, --filter <filter>`        | Filtra registros de depuración(`string`)                                                                                                                 |
| `-m, --mode <mode>`            | Configura el modo de ambiente(`string`)                                                                                                                  |
| `-h, --help`                   | Muestra las opciones de CLI disponibles options                                                                                                          |

## Otros

### `vite optimize`

Preempaqueta dependencias.

#### Uso

```bash
vite optimize [root]
```

#### Opciones

| Opciones                 |                                                                            |
| ------------------------ | -------------------------------------------------------------------------- |
| `--force`                | Fuerza al optimizador a ignorar el caché y vuelve a empaquetar (`boolean`) |
| `-c, --config <file>`    | Usa el archivo de configuración especificado (`string`)                    |
| `--base <path>`          | Ruta base pública (por defecto: `/`) (`string`)                            |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`)                                 |
| `--clearScreen`          | Habilita/deshabilita limpiar pantalla al registrar nuevos logs (`boolean`) |
| `-d, --debug [feat]`     | Muestra registros de depuración (`string \| boolean`)                      |
| `-f, --filter <filter>`  | Filtra registros de depuración (`string`)                                  |
| `-m, --mode <mode>`      | Configura el modo de ambiente (`string`)                                   |
| `-h, --help`             | Muestra las opciones de CLI disponibles                                    |

### `vite preview`

Vista previa local de la compilación en producción. No utilices esto como un servidor de producción, ya que no está diseñado para ello.

#### Uso

```bash
vite preview [root]
```

#### Opciones

| Opciones                 |                                                                            |
| ------------------------ | -------------------------------------------------------------------------- |
| `--host [host]`          | Especifica un nombre de host (`string`)                                    |
| `--port <port>`          | Especifica puerto (`number`)                                               |
| `--strictPort`           | Finaliza si el puerto configurado ya está en uso (`boolean`)               |
| `--open [path]`          | Abre el navegador al iniciar (`boolean \| string`)                         |
| `--outDir <dir>`         | Directorio de salida (por defecto: `dist`)(`string`)                       |
| `-c, --config <file>`    | Usa el archivo de configuración especificado (`string`)                    |
| `--base <path>`          | Ruta base pública (por defecto: `/`) (`string`)                            |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`)                                 |
| `--clearScreen`          | Habilita/deshabilita limpiar pantalla al registrar nuevos logs (`boolean`) |
| `-d, --debug [feat]`     | Muestra registros de depuración (`string \| boolean`)                      |
| `-f, --filter <filter>`  | Filtra registros de depuración (`string`)                                  |
| `-m, --mode <mode>`      | Configura el modo de ambiente (`string`)                                   |
| `-h, --help`             | Muestra las opciones de CLI disponibles                                    |
