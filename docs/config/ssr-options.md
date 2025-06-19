# Opciones para SSR

A menos que se indique lo contrario, las opciones en esta sección se aplican tanto a desarrollo como a compilación.

## ssr.external

- **Tipo:** `string[] | true`
- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

Externaliza las dependencias dadas y sus dependencias transitivas para SSR. Por defecto, todas las dependencias se externalizan excepto las dependencias vinculadas (para HMR). Si prefieres externalizar la dependencia vinculada, puedes pasar su nombre a esta opción.

Si es `true`, todas las dependencias, incluidas las vinculadas, se externalizan.

Ten en cuenta que las dependencias enumeradas explícitamente (que usan el tipo `string[]`) siempre tendrán prioridad si también se enumeran en `ssr.noExternal` (usando cualquier tipo).

## ssr.noExternal

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado:** [SSR Externos](/guide/ssr#ssr-externos)

Previene que las dependencias enumeradas se externalicen para SSR, las cuales se incluirán después en la compilación. Por defecto, sólo las dependencias vinculadas no se externalizan (para HMR). Si prefieres externalizar la dependencia vinculada, puede pasar su nombre a la opción `ssr.external`.

Si es `true`, no se externalizan dependencias. Sin embargo, las dependencias enumeradas explícitamente en `ssr.external` (usando el tipo `string[]`) pueden tener prioridad y aún así externalizarse. Si se configura `ssr.target: 'node'`, los módulos integrados de Node.js también se externalizarán de forma predeterminada.

Ten en cuenta que si tanto `ssr.noExternal: true` como `ssr.external: true` están configurados, `ssr.noExternal` tiene prioridad y no se externalizan dependencias.

## ssr.target

- **Tipo:** `'node' | 'webworker'`
- **Por defecto:** `node`

  Destino de compilación para el servidor SSR.

## ssr.resolve.conditions

- **Tipo:** `string[]`
- **Por defecto:** `['module', 'node', 'development|production']` (`defaultServerConditions`) (`['module', 'browser', 'development|production']` (`defaultClientConditions`) for `ssr.target === 'webworker'`)
- **Relacionado:** [Condiciones de resolución](./shared-options.md#resolve-conditions)

  El valor predeterminado es la raíz [`resolve.conditions`](./shared-options.md#resolve-conditions).

  Estas condiciones se utilizan en la canalización del plugin y solo afectan a las dependencias no externalizadas durante la compilación de SSR. Utiliza `ssr.resolve.externalConditions` para afectar las importaciones externalizadas.

## ssr.resolve.externalConditions

- **Tipo:** `string[]`
- **Por defecto:** `['node']`

  Condiciones que se utilizan durante la importación en SSR (incluyendo `ssrLoadModule`) de dependencias directas externalizadas (dependencias externas importadas por Vite).

  :::tip

  Al usar esta opción, asegúrate de ejecutar Node con la [opción `--conditions`](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) y los mismos valores tanto en desarrollo como en compilación para obtener un comportamiento coherente.

  Por ejemplo, al establecer `['node', 'custom']`, deberías ejecutar `NODE_OPTIONS='--conditions custom' vite` en desarrollo y `NODE_OPTIONS="--conditions custom" node ./dist/server.js` después de compilar.

## ssr.resolve.mainFields

- **Tipo:** `string[]`
- **Por defecto:** `['module', 'jsnext:main', 'jsnext']`

Lista de campos en `package.json` que se intentarán al resolver el punto de entrada de un paquete. Ten en cuenta que esta configuración tiene menor precedencia que las exportaciones condicionales resueltas desde el campo `exports`: si se resuelve con éxito un punto de entrada desde `exports`, se ignorará el campo `main`. Esta configuración solo afecta a las dependencias no externalizadas.
