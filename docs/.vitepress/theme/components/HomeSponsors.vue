<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'
const { data } = useSponsor()
</script>

<template>
  <VPHomeSponsors
    v-if="data"
    message="Vite es gratuito y de código abierto, hecho posible gracias a nuestros maravillosos patrocinadores."
    action-text="Conviertete en un patrocinador"
    action-link="https://github.com/sponsors/yyx990803"
    :data="data"
  />
</template>
