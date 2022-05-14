<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://vitejs.dev/logo.svg" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  <a href="https://github.com/vitejs/vite/actions/workflows/ci.yml"><img src="https://github.com/vitejs/vite/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
</p>
<br/>

# Vite ⚡

> Herramientas frontend de próxima generación

- 💡 Inicio de servidor al instante
- ⚡️ HMR ultra rápido
- 🛠️ Funcionalidades enriquecidas
- 📦 Compilación optimizada
- 🔩 Interfaz universal para complementos
- 🔑 APIs completamente tipadas

Vite (palabra en francés para "rápido", pronunciado como [`/vit/`](https://cdn.jsdelivr.net/gh/vitejs/vite@main/docs/public/vite.mp3), como "veet") es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y ágil para proyectos web modernos. Consta de dos partes principales:

- Un servidor de desarrollo que proporciona [mejoras enriquecidas de funcionalidades](./features) sobre [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por ejemplo [Hot Module Replacement (HMR)](./features#hot-module-replacement) extremadamente rápido.

- Un comando de compilación que empaqueta tu código con [Rollup](https://rollupjs.org), preconfigurado para generar activos estáticos altamente optimizados para producción.

Además, Vite es altamente extensible a través de sus [API de complementos](./api-plugin) y [API de JavaScript](./api-javascript) con soporte completo de tipado.

[Lee la documentación para saber más](https://vitejs.dev).

## Migración desde 1.x

Revisa la [Guía de Migración](https://vitejs.dev/guide/migration.html) si estás actualizando desde 1.x.

## Paquetes

| Paquete                                           | Version (click para lista de cambios)                                                                                                |
| ------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [vite](packages/vite)                             | [![vite version](https://img.shields.io/npm/v/vite.svg?label=%20)](packages/vite/CHANGELOG.md)                                       |
| [@vitejs/plugin-vue](packages/plugin-vue)         | [![plugin-vue version](https://img.shields.io/npm/v/@vitejs/plugin-vue.svg?label=%20)](packages/plugin-vue/CHANGELOG.md)             |
| [@vitejs/plugin-vue-jsx](packages/plugin-vue-jsx) | [![plugin-vue-jsx version](https://img.shields.io/npm/v/@vitejs/plugin-vue-jsx.svg?label=%20)](packages/plugin-vue-jsx/CHANGELOG.md) |
| [@vitejs/plugin-react](packages/plugin-react)     | [![plugin-react version](https://img.shields.io/npm/v/@vitejs/plugin-react.svg?label=%20)](packages/plugin-react/CHANGELOG.md)       |
| [@vitejs/plugin-legacy](packages/plugin-legacy)   | [![plugin-legacy version](https://img.shields.io/npm/v/@vitejs/plugin-legacy.svg?label=%20)](packages/plugin-legacy/CHANGELOG.md)    |
| [create-vite](packages/create-vite)               | [![create-vite version](https://img.shields.io/npm/v/create-vite.svg?label=%20)](packages/create-vite/CHANGELOG.md)                  |

## Contribución

Ver la [Guía de Contribución](./CONTRIBUTING.md).

## Licencia

MIT
