---
layout: page
title: Conoce al Equipo
description: El desarrollo de Vite está guiado por un equipo de talla internacional.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Conoce al Equipo</template>
    <template #lead>
      El desarrollo de Vite está guiado por un equipo de talla internacional, algunos de los cuales han sido elegidos para aparecer a continuación.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Team Emeriti</template>
    <template #lead>
      Aquí destacamos a algunos miembros del equipo que ya no están activos y que han hecho valiosas
      contribuciones en el pasado.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
