---
layout: home

title: Vite
titleTemplate: Herramienta frontend de próxima generación

hero:
  name: Vite
  text: Herramienta frontend de próxima generación
  tagline: Prepárate para un entorno de desarrollo que finalmente está hecho para tí.
  image:
    src: /logo-with-shadow.png
    alt: Vite
  actions:
    - theme: brand
      text: Introducción
      link: /guide/
    - theme: alt
      text: ¿Por qué Vite?
      link: /guide/why
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/vitejs/vite
    - theme: brand
      text: ⚡ ViteConf 24!
      link: https://viteconf.org/?utm=vite-homepage

features:
  - icon: 💡
    title: Inicio de servidor al instante
    details: Servidor de archivo bajo demanda sobre ESM nativo, no requiere empaquetado!
  - icon: ⚡️
    title: HMR ultra rápido
    details: Hot Module Replacement (HMR) que se mantiene rápido sin importar el tamaño de la aplicación.
  - icon: 🛠️
    title: Funcionalidades enriquecidas
    details: Soporte para TypeScript, JSX, CSS y más, listos para usar.
  - icon: 📦
    title: Compilación optimizada
    details: Compilado de Rollup preconfigurado con soporte de multi-página y modo librería.
  - icon: 🔩
    title: Plugins universales
    details: Interfaz de plugins basados en Rollup compartidos entre desarrollo y compilación.
  - icon: 🔑
    title: APIs completamente tipadas
    details: APIs programáticamente flexibles con tipado completo en TypeScript.
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('uwu') != null) {
    const img = document.querySelector('.VPHero .VPImage.image-src')
    img.src = '/logo-uwu.png'
    img.alt = 'Vite Kawaii Logo by @icarusgkx'
  }
})
</script>
