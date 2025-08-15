---
title: Vite
titleTemplate: Herramienta frontend de próxima generación
# add `dark` here to apply dark mode on initial load,
# since `onMounted` doesn't run during SSR
pageClass: landing dark

layout: home
aside: false
editLink: false
markdownStyles: false
---

<script setup>
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import Hero from './.vitepress/theme/components/landing/1. hero-section/HeroSection.vue'
import FeatureSection from './.vitepress/theme/components/landing/2. feature-section/FeatureSection.vue'
import FrameworksSection from './.vitepress/theme/components/landing/3. frameworks-section/FrameworksSection.vue'
import CommunitySection from './.vitepress/theme/components/landing/4. community-section/CommunitySection.vue'
import SponsorSection from './.vitepress/theme/components/landing/5. sponsor-section/SponsorSection.vue'
import GetStartedSection from './.vitepress/theme/components/landing/6. get-started-section/GetStartedSection.vue'
import FeatureInstantServerStart from './.vitepress/theme/components/landing/2. feature-section/FeatureInstantServerStart.vue'
import FeatureHMR from './.vitepress/theme/components/landing/2. feature-section/FeatureHMR.vue'
import FeatureRichFeatures from './.vitepress/theme/components/landing/2. feature-section/FeatureRichFeatures.vue'
import FeatureOptimizedBuild from './.vitepress/theme/components/landing/2. feature-section/FeatureOptimizedBuild.vue'
import FeatureFlexiblePlugins from './.vitepress/theme/components/landing/2. feature-section/FeatureFlexiblePlugins.vue'
import FeatureTypedAPI from './.vitepress/theme/components/landing/2. feature-section/FeatureTypedAPI.vue'
import FeatureSSRSupport from './.vitepress/theme/components/landing/2. feature-section/FeatureSSRSupport.vue'
import FeatureCI from './.vitepress/theme/components/landing/2. feature-section/FeatureCI.vue'

const { isDark } = useData()

onMounted(() => {
  document.documentElement.classList.add('dark')
})

onBeforeUnmount(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

</script>

 <div class="VPHome">
  <Hero/>
  <FeatureSection title="Redefiniendo la experiencia del desarrollador" description="Vite hace que el desarrollo web vuelva a ser simple" type="blue">
    <FeatureInstantServerStart />
    <FeatureHMR />
    <FeatureRichFeatures />
    <FeatureOptimizedBuild />
  </FeatureSection>
  <FeatureSection title="Una fundación compartida sobre la cual construir." type="pink" class="feature-section--flip">
    <FeatureFlexiblePlugins />
    <FeatureTypedAPI />
    <FeatureSSRSupport />
    <FeatureCI />
  </FeatureSection>
  <FrameworksSection />
  <CommunitySection />
  <SponsorSection />
  <GetStartedSection />
</div>
