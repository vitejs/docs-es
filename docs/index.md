---
home: true
heroImage: /logo.svg
# actionText: Get Started
actionText: Introducción
actionLink: /guide/

# altActionText: Learn More
altActionText: Aprende más
altActionLink: /guide/why

# features:
#   - title: 💡 Instant Server Start
#     details: On demand file serving over native ESM, no bundling required!
#   - title: ⚡️ Lightning Fast HMR
#     details: Hot Module Replacement (HMR) that stays fast regardless of app size.
#   - title: 🛠️ Rich Features
#     details: Out-of-the-box support for TypeScript, JSX, CSS and more.
#   - title: 📦 Optimized Build
#     details: Pre-configured Rollup build with multi-page and library mode support.
#   - title: 🔩 Universal Plugins
#     details: Rollup-superset plugin interface shared between dev and build.
#   - title: 🔑 Fully Typed APIs
#     details: Flexible programmatic APIs with full TypeScript typing.
# footer: MIT Licensed | Copyright © 2019-present Evan You & Vite Contributors
features:
  - title: 💡 Inicio de servidor al instante
    details: Servidor de archivo bajo demanda sobre ESM nativo, no se requiere empaquetado!
  - title: ⚡️ HMR ultra rápido
    details: Hot Module Replacement (HMR) que se mantiene rápido sin importar el tamaño de la aplicación.
  - title: 🛠️ Funcionalidades enriquecidas
    details: Soporte para TypeScript, JSX, CSS y más, listos para usar.
  - title: 📦 Compilación optimizada
    details: Compilación de Rollup preconfigurada con soporte de modo multi-página y librería.
  - title: 🔩 Complementos universales
    details: Interfaz de complemento para superconjuntos de Rollup compartida entre dev y build.
  - title: 🔑 APIs completamente tipadas
    details: APIs programáticas flexibles con tipado completo en TypeScript.
footer: Licenciado con MIT | Derechos Reservados © 2019 - presente Evan You & colaboradores de Vite
---

<div class="frontpage sponsors">
  <h2>Patrocinadores</h2>
  <div class="platinum-sponsors">
    <a v-for="{ href, src, name, id } of sponsors.filter(s => s.tier === 'platinum')" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
      <img :src="src" :alt="name" :id="`sponsor-${id}`">
    </a>
  </div>
  <div class="gold-sponsors">
    <a v-for="{ href, src, name, id } of sponsors.filter(s => s.tier !== 'platinum')" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
      <img :src="src" :alt="name" :id="`sponsor-${id}`">
    </a>
  </div>
  <a href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">Conviértete en patrocinador en GitHub</a>
</div>

<script setup>
import sponsors from './.vitepress/theme/sponsors.json'
</script>
