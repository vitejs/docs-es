<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Hero from './Hero.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import ViteCommunity from './Community.vue'
import TrustedBy from '@components/oss/TrustedBy.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import Spacer from '@components/shared/Spacer.vue'
import Footer from '@components/oss/Footer.vue'
import { useSponsor } from '../composables/sponsor'

const { data: sponsors } = useSponsor()
</script>

<template>
  <Hero />
  <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']"
  />
  <HeadingSection
    heading="Redefiniendo la experiencia del desarrollador"
    subheading="Vite hace que el desarrollo web vuelva a ser placentero"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="Una base compartida sobre la cual construir" />
  <ViteFeatureGrid2 />
  <HeadingSection
    heading="Impulsando tus frameworks y herramientas favoritas"
  />
  <ViteFrameworks />
  <ViteCommunity />
  <Sponsors :sponsors="sponsors" />
  <Spacer />
  <Footer
    heading="Empieza a construir con Vite"
    subheading="Prepárate para un entorno de desarrollo que finalmente pueda seguir el ritmo de tu mente."
    button-text="Empezar"
    button-link="/guide/"
  />
</template>
