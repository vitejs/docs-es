<script setup lang="ts">
import CommunityCard, { Testimonial } from './CommunityCard.vue'

const testimonials: Testimonial[] = [
  {
    name: 'Ryan Carniato',
    handle: '@RyanCarniato',
    avatar:
      'https://pbs.twimg.com/profile_images/1810837163447308292/8Piov0f6_400x400.jpg',
    comment: [
      `Estoy encantado con lo que Vite permite. Hemos descubierto al construir SolidStart que no es tanto un metaframework, sino un sistema de plugins Vite simbióticos. Aunque fue construido con SolidJS en mente, debería escalar desde nuestra plantilla más simple hasta un inicio con opiniones. Estamos construyendo un ecosistema sobre Vite`,
    ],
  },
  {
    name: 'Rich Harris',
    handle: '@Rich_Harris',
    avatar:
      'https://pbs.twimg.com/profile_images/557940120184041473/bFyXy8Pu_400x400.jpeg',
    comment: [
      `Vite es básicamente las Naciones Unidas de JavaScript en este momento. Estaré allí como representante de Sveltelandia.`,
    ],
  },
  {
    name: 'David East',
    handle: '@_davideast',
    avatar:
      'https://pbs.twimg.com/profile_images/1691627325794725888/voQFcYjY_400x400.jpg',
    comment: [
      'Cada vez que uso Vite, siento una verdadera sensación de pura y desenfrenada alegría',
    ],
  },
  {
    name: 'Mark Dalgleish',
    handle: '@markdalgleish',
    avatar:
      'https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_400x400.jpg',
    comment: [
      `También es una gran plataforma para construir un framework, ya que proporciona un entorno de desarrollo modular.`,
      `La comunidad también es increíble.`,
    ],
  },
  {
    name: 'Jason Miller',
    handle: '@_developit',
    avatar:
      'https://pbs.twimg.com/profile_images/1374778373239681025/Sc9ehtAr_400x400.jpg',
    comment: [
      `Cada vez que sospecho que he llegado a los límites de lo que Vite puede hacer, termino equivocándome.`,
    ],
  },
  {
    name: 'David Cramer',
    handle: '@zeeg',
    avatar:
      'https://pbs.twimg.com/profile_images/1911613315765133312/HVkULegC_400x400.jpg',
    comment: ['Vite ha sido un cambio de juego para la industria.'],
  },
  {
    name: 'Dion Almaer',
    handle: '@dalmaer',
    avatar:
      'https://pbs.twimg.com/profile_images/3380865881/f73b3687ff39b795db05fcaf35972270_400x400.jpeg',
    comment: [
      'Estoy muy emocionado de ver tantos grandes frameworks colaborando sobre Vite. Muchísimos se beneficiarán. ❤️ al equipo de Vite.',
    ],
  },
  {
    name: 'Christoph Nakazawa',
    handle: '@cpojer',
    avatar:
      'https://pbs.twimg.com/profile_images/1910252462126313472/gXgT-jxL_400x400.jpg',
    comment: ['Vite va a conquistar el mundo (de JavaScript).'],
  },
  {
    name: 'Nikolaj',
    handle: '@lopugit',
    avatar: 'https://avatars.githubusercontent.com/u/13629190?v=4',
    comment: [
      'Wow, wow, wow, wow, wow, wow, Vite es..... Vite es.... Wow 🤤🤯🙏',
    ],
  },
]
</script>

<template>
  <section class="community-section">
    <h2>Amado por la comunidad</h2>
    <h3>
      No tomes nuestra palabra, escucha lo que los miembros de la comunidad de
      Vite tienen que decir.
    </h3>
    <div class="community-grid-container">
      <div class="community-grid">
        <CommunityCard
          :testimonial="testimonial"
          v-for="testimonial in testimonials"
          :key="testimonial.name"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.community-section {
  margin-top: 140px;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }

  h2 {
    background: linear-gradient(0deg, #fff 0%, rgba(255, 255, 255, 0.76) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 auto 10px;
    text-align: center;
  }

  h3 {
    width: 455px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .community-grid-container {
    position: relative;
  }

  .community-grid {
    column-count: 2;
    column-gap: 25px;
    width: calc(100% - 50px);
    margin: 40px auto 0;

    @media (min-width: 1150px) {
      column-count: 3;
      width: 1100px;
    }
  }
}
</style>
