import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import AsideSponsors from './components/AsideSponsors.vue'
import HomeSponsors from './components/HomeSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import './styles/vars.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme
