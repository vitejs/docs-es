---
title: Agradecimientos
description: Vite se construye sobre los hombros de gigantes. Gracias a todos los proyectos y colaboradores que hacen posible Vite.
---

<script setup>
import { computed } from 'vue'
import { data } from './_data/acknowledgements.data'
import { useSponsor, voidZero } from './.vitepress/theme/composables/sponsor'
import VPSponsors from '@components/vitepress-default/VPSponsors.vue'

const { data: sponsorData } = useSponsor()

const allSponsors = computed(() => {
  if (!sponsorData.value) return []
  return [
    {
      tier: 'Presentado por',
      size: 'big',
      items: [voidZero],
    },
    ...sponsorData.value,
  ]
})

function npmUrl(name) {
  return `https://www.npmjs.com/package/${name}`
}
</script>

# Agradecimientos

Vite se construye sobre los hombros de gigantes. Nos gustaría expresar nuestra gratitud a todos los proyectos, colaboradores y patrocinadores que hacen posible Vite.

## Colaboradores

Vite es desarrollado por un equipo internacional de colaboradores. Consulta la [página del Equipo](/team) para conocer a los miembros principales del equipo.

También agradecemos a todos los [colaboradores en GitHub](https://github.com/vitejs/vite/graphs/contributors) que han ayudado a mejorar Vite a través de contribuciones de código, informes de errores, documentación y traducción de la misma.

## Patrocinadores

El desarrollo de Vite es apoyado por generosos patrocinadores. Puedes apoyar a Vite a través de [GitHub Sponsors](https://github.com/sponsors/vitejs) u [Open Collective](https://opencollective.com/vite).

<div class="sponsors-container">
  <VPSponsors :data="allSponsors" />
</div>

## Dependencias

Vite depende de estos increíbles proyectos de código abierto:

### Dependencias notables

<div class="deps-list notable">
  <div v-for="dep in data.notableDependencies" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Repo</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Patrocinar</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      por <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

### Autores de dependencias empaquetadas

<table class="authors-table">
  <thead>
    <tr>
      <th>Autor</th>
      <th>Paquetes</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="author in data.authors" :key="author.name">
      <td>
        <a v-if="author.url" :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a>
        <template v-else>{{ author.name }}</template>
        <a v-if="author.funding" :href="author.funding" target="_blank" rel="noopener" class="sponsor-link">Patrocinar</a>
      </td>
      <td>
        <template v-for="(pkg, index) in author.packages" :key="pkg.name">
          <span class="pkg-item"><a :href="npmUrl(pkg.name)" target="_blank" rel="noopener"><code>{{ pkg.name }}</code></a><a v-if="pkg.funding" :href="pkg.funding" target="_blank" rel="noopener" class="sponsor-link">Patrocinar</a></span><template v-if="index < author.packages.length - 1">, </template>
        </template>
      </td>
    </tr>
  </tbody>
</table>

::: tip Para autores de paquetes
Esta sección se genera automáticamente a partir de los campos `author` y `funding` en el `package.json` de cada paquete. Si deseas actualizar cómo aparece tu paquete aquí, puedes actualizar estos campos en tu paquete.
:::

## Herramientas de desarrollo

El flujo de trabajo de desarrollo de Vite es impulsado por estas herramientas:

<div class="deps-list notable">
  <div v-for="dep in data.devTools" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">Repo</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">Patrocinar</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      por <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

## Dependencias notables pasadas

También agradecemos a los mantenedores de estos proyectos que Vite utilizó en versiones anteriores:

<table>
  <thead>
    <tr>
      <th>Paquete</th>
      <th>Descripción</th>
      <th>Enlaces</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="dep in data.pastNotableDependencies" :key="dep.name">
      <td><a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a></td>
      <td>{{ dep.description }}</td>
      <td><a :href="dep.repository" target="_blank" rel="noopener">Repo</a></td>
    </tr>
  </tbody>
</table>

<style scoped>
.deps-list {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.deps-list.notable {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.dep-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.dep-item .dep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dep-item a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.dep-item a:hover {
  text-decoration: underline;
}

.dep-item .dep-links {
  display: flex;
  gap: 0.5rem;
}

.dep-item .dep-link {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
}

.dep-item .dep-author {
  margin: 0.25rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.dep-item .dep-link.sponsor {
  background: var(--vp-c-brand-soft);
}

.dep-item p {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.authors-table .sponsor-link {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.authors-table .sponsor-link:hover {
  text-decoration: underline;
}
</style>
