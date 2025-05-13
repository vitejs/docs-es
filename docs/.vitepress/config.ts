import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import type { PluginOption } from 'vite'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Herramienta frontend de próxima generación'
const ogImage = 'https://es.vite.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://es.vite.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-es.netlify.app':
      return 'release'
    case '':
      return 'local'
    default:
      return 'main'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (rama principal)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  switch (deployType) {
    case 'main':
    case 'local':
    case 'release':
      return [
        {
          text: 'Documentación de Vite 2',
          link: 'https://v2.vite.dev',
        },
      ]
  }
})()

export default defineConfig({
  lang: 'es',
  title: `Vite${additionalTitle}`,
  description: 'Herramienta frontend de próxima generación',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vite' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],
  locales: {
    root: { label: 'Español' },
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/vitejs/docs-es/edit/main/docs/:path',
      text: 'Sugerir cambios para esta página',
    },
    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],
    darkModeSwitchLabel: 'Apariencia',
    algolia: {
      appId: '7H67QR5P0A',
      apiKey: '208bb9c14574939326032b937431014b',
      indexName: 'vite',
      searchParameters: {
        facetFilters: ['tags:es'],
      },
      placeholder: 'Buscar',
      translations: {
        button: {
          buttonText: 'Buscar',
        },

        modal: {
          searchBox: {
            resetButtonTitle: 'Limpiar criterios de búsqueda',
            resetButtonAriaLabel: 'Limpiar criterios de búsqueda',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Cancelar',
          },
          startScreen: {
            recentSearchesTitle: 'Búsquedas recientes',
            noRecentSearchesText: 'No hay búsquedas recientes',
            saveRecentSearchButtonTitle: 'Guardar en búsquedas recientes',
            removeRecentSearchButtonTitle: 'Eliminar de búsquedas recientes',
            favoriteSearchesTitle: 'Favoritos',
            removeFavoriteSearchButtonTitle: 'Eliminar de favoritos',
          },
          errorScreen: {
            titleText: 'No se pueden obtener resultados',
            helpText: 'Es posible que debas revisar tu conexión de red',
          },
          footer: {
            selectText: 'Seleccionar',
            navigateText: 'Cambiar',
            closeText: 'Cerrar',
            searchByText: 'Buscado por',
          },
          noResultsScreen: {
            noResultsText: 'No se encontraron resultados relacionados',
            suggestedQueryText: 'Puedes intentar buscar',
            reportMissingResultsText:
              '¿Crees que esta búsqueda debería tener resultados?',
            reportMissingResultsLinkText: 'Informar de un problema',
          },
        },
      },
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitedev',
    },

    outlineTitle: 'En esta página',
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página',
    },

    footer: {
      message: `Publicado bajo licencia MIT. (${commitRef})`,
      copyright:
        'Copyright © 2019-actualidad VoidZero Inc. & colaboradores de Vite',
    },

    nav: [
      { text: 'Guía', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Configuración', link: '/config/', activeMatch: '/config/' },
      { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Recursos',
        items: [
          { text: 'Equipo', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Lanzamientos', link: '/releases' },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Chat de Discord',
                link: 'https://chat.vite.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'Lista de Cambios',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: 'Contribución',
                link: 'https://github.com/vitejs/docs-es/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Versión',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introducción',
          items: [
            {
              text: 'Introducción',
              link: '/guide/',
            },
            {
              text: 'Filosofía',
              link: '/guide/philosophy',
            },
            {
              text: '¿Por qué Vite?',
              link: '/guide/why',
            },
          ],
        },
        {
          text: 'Guía',
          items: [
            {
              text: 'Funcionalidades',
              link: '/guide/features',
            },
            {
              text: 'Interfaz de línea de comandos',
              link: '/guide/cli',
            },
            {
              text: 'Uso de plugins',
              link: '/guide/using-plugins',
            },
            {
              text: 'Preempaquetado de dependencias',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Gestión de recursos estáticos',
              link: '/guide/assets',
            },
            {
              text: 'Compilación en producción',
              link: '/guide/build',
            },
            {
              text: 'Despliegue de un sitio estático',
              link: '/guide/static-deploy',
            },
            {
              text: 'Variables y modos de entorno',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Server-side Rendering (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Integración al Backend',
              link: '/guide/backend-integration',
            },
            // {
            //   text: 'Comparaciones',
            //   link: '/guide/comparisons',
            // },
            {
              text: 'Solución de problemas',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Rendimiento',
              link: '/guide/performance',
            },
            // {
            //   text: 'Migración desde v2',
            //   link: '/guide/migration-v2-to-v3',
            // },
            // {
            //   text: 'Migración desde v3',
            //   link: '/guide/migration-v3-to-v4',
            // },
            // {
            //   text: 'Migración desde v4',
            //   link: '/guide/migration-v4-to-v5',
            // },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'Migración desde v5',
              link: '/guide/migration',
            },
            {
              text: 'Cambios importantes',
              link: '/changes/',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API de plugins',
              link: '/guide/api-plugin',
            },
            {
              text: 'API de HMR',
              link: '/guide/api-hmr',
            },
            {
              text: 'API de JavaScript',
              link: '/guide/api-javascript',
            },
            {
              text: 'Referencia de Configuración',
              link: '/config/',
            },
          ],
        },
        {
          text: 'API de Entorno',
          items: [
            {
              text: 'Introducción',
              link: '/guide/api-environment',
            },
            {
              text: 'Instancias de Entorno',
              link: '/guide/api-environment-instances',
            },
            {
              text: 'Plugins',
              link: '/guide/api-environment-plugins',
            },
            {
              text: 'Frameworks',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: 'Runtimes',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Configuración',
          items: [
            {
              text: 'Configurando Vite',
              link: '/config/',
            },
            {
              text: 'Opciones compartidas',
              link: '/config/shared-options',
            },
            {
              text: 'Opciones para server',
              link: '/config/server-options',
            },
            {
              text: 'Opciones para build',
              link: '/config/build-options',
            },
            {
              text: 'Opciones para preview',
              link: '/config/preview-options',
            },
            {
              text: 'Opciones para optimización de dependencias',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'Opciones para SSR',
              link: '/config/ssr-options',
            },
            {
              text: 'Opciones para Worker',
              link: '/config/worker-options',
            },
          ],
        },
      ],
      '/changes/': [
        {
          text: 'Cambios importantes',
          link: '/changes/',
        },
        {
          text: 'Actual',
          items: [],
        },
        {
          text: 'Futuro',
          items: [
            {
              text: 'this.environment en Hooks',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'Hooks de Plugin HotUpdate para HMR',
              link: '/changes/hotupdate-hook',
            },
            {
              text: 'Migración a APIs por Entorno',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'SSR Usando la API ModuleRunner',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: 'Plugins Compartidos Durante la Compilación',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: 'Pasado',
          items: [],
        },
      ],
    },
    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }]
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: 'La herramienta de compilación para la Web',
        details: `\
- 💡 Inicio instantáneo del servidor  
- ⚡️ HMR ultrarrápido  
- 🛠️ Funcionalidades avanzadas  
- 📦 Build optimizado  
- 🔩 Interfaz universal de plugins  
- 🔑 APIs totalmente tipadas  

Vite es una nueva generación de herramientas de compilación para frontend que mejora significativamente la experiencia de desarrollo. Consta de dos partes principales:

- Un servidor de desarrollo que sirve tus archivos fuente usando [módulos ES nativos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), con [funciones integradas](https://es.vite.dev/guide/features.md) y un [Hot Module Replacement (HMR)](https://es.vite.dev/guide/features.md#hot-module-replacement) increíblemente rápido.

- Un [comando de compilación](https://es.vite.dev/guide/build.md)) que empaqueta tu código con [Rollup](https://rollupjs.org), preconfigurado para generar archivos estáticos altamente optimizados para producción.

Además, Vite es altamente extensible gracias a su [API de plugins](https://es.vite.dev/guide/api-plugin.md) y su [API de JavaScript](https://es.vite.dev/guide/api-javascript.md), ambas con soporte completo para tipado.`,
      }) as PluginOption,
    ],
  },
  optimizeDeps: {
    include: [
      '@shikijs/vitepress-twoslash/client',
      'gsap',
      'gsap/dist/ScrollTrigger',
      'gsap/dist/MotionPathPlugin',
    ],
  },
  buildEnd,
})
