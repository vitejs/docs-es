import { onMounted, ref } from 'vue'
import type { Sponsor, SponsorTier } from '@voidzero-dev/vitepress-theme'

interface Sponsors {
  main: Sponsor[]
  partnership: Sponsor[]
  platinum: Sponsor[]
  gold: Sponsor[]
}

// shared data across instances so we load only once.
const data = ref<SponsorTier[]>()

export function useSponsor() {
  onMounted(async () => {
    if (data.value) return

    const result = await fetch('https://sponsors.vite.dev/sponsors.json')
    const sponsors: Sponsors = await result.json()

    data.value = [
      {
        tier: 'Presentado por',
        size: 'big',
        items: sponsors.main,
      },
      {
        tier: 'En asociación con',
        size: 'big',
        items: sponsors.partnership,
      },
      {
        tier: 'Patrocinadores Platino',
        size: 'big',
        items: sponsors.platinum,
      },
      {
        tier: 'Patrocinadores Oro',
        size: 'medium',
        items: sponsors.gold,
      },
    ]
  })

  return data
}
