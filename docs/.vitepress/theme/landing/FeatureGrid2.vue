<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import flexiblePluginAnimation from '@assets/vite/animations/640_x_300_flexible_plugin.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5 class="text-balance sm:text-pretty text-white">
        Sistema Flexible de Plugins
      </h5>
      <p class="sm:max-w-md text-pretty">
        Los plugins de Vite extienden la interfaz de plugins bien diseñada de
        Rollup con algunas opciones específicas de Vite.
      </p>
      <RiveAnimation
        :desktop-src="flexiblePluginAnimation"
        :desktop-width="640"
        :desktop-height="300"
        canvas-class="w-[calc(100%_+_2.5rem)] mt-5 -mx-5"
      />
    </div>

    <div class="flex flex-col gap-3 border-r-0 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">API Totalmente Tipada</h5>
        <p class="max-w-104 text-pretty">Diseñado para construir sobre él.</p>
      </div>
      <div class="relative p-5 sm:p-10 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-typed-api.svg"
          width="454"
          height="252"
          inert
          loading="lazy"
          alt="typed api"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">Soporte SSR de primera clase</h5>
      <p class="sm:max-w-md text-pretty mb-12 sm:mb-16">
        Nunca ha sido tan fácil configurar SSR (Server-Side Rendering)
        personalizado o construir tu propio framework SSR.
      </p>
      <img
        src="@assets/vite/vite-ssr-support.png"
        width="1008"
        height="466"
        alt="Soporte SSR"
        loading="lazy"
        class="w-full px-5"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">Integración Continua con el Ecosistema</h5>
        <p class="max-w-100 text-pretty">
          Nuestra CI prueba continuamente los cambios de Vite contra proyectos
          derivados, permitiéndonos mejorar Vite con estabilidad y confianza.
        </p>
      </div>
      <div class="px-5 sm:px-10 flex justify-center">
        <img
          src="@assets/vite/vite-ci.svg"
          width="476"
          height="272"
          inert
          loading="lazy"
          alt="integración continua con el ecosistema"
        />
      </div>
    </div>
  </section>
</template>
