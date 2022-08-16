import { defineConfig, DefaultTheme } from 'vitepress'

const ogDescription = 'Herramienta frontend de próxima generación'
const ogImage = 'https://es.vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://es.vitejs.dev'

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
      return [
        {
          text: 'Documentación de Vite 3 (producción)',
          link: 'https://es.vitejs.dev'
        },
        {
          text: 'Documentación de Vite 2',
          link: 'https://v2.vitejs.dev'
        }
      ]
    case 'release':
      return [
        {
          text: 'Documentación de Vite 2',
          link: 'https://v2.vitejs.dev'
        }
      ]
  }
})()

export default defineConfig({
  lang: 'es',
  title: `Vite${additionalTitle}`,
  description: 'Herramienta frontend de próxima generación',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }]
  ],
  vue: {
    reactivityTransform: true
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/vitejs/docs-es/edit/main/docs/:path',
      text: 'Sugerir cambios para esta página'
    },
    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],
    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:es']
      }
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    localeLinks: {
      text: 'Español',
      items: [
        { text: 'English', link: 'https://main.vitejs.dev' },
        { text: '简体中文', link: 'https://cn.vitejs.dev' },
        { text: '日本語', link: 'https://ja.vitejs.dev' }
      ]
    },

    outlineTitle: 'En esta página',
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página'
    },

    footer: {
      message: `Publicado bajo licencia MIT. (${commitRef})`,
      copyright: 'Copyright © 2019-actualidad Evan You & colaboradores de Vite'
    },

    nav: [
      { text: 'Guía', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Configuración', link: '/config/', activeMatch: '/config/' },
      { text: 'Complementos', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Recursos',
        items: [
          { text: 'Equipo', link: '/team' },
          {
            items: [
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js'
              },
              {
                text: 'Chat de Discord',
                link: 'https://chat.vitejs.dev'
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite'
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite'
              },
              {
                text: 'Complementos de Rollup compatibles',
                link: 'https://vite-rollup-plugins.patak.dev/'
              },
              {
                text: 'Lista de Cambios',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
              }
            ]
          }
        ]
      },
      {
        text: 'Versión',
        items: versionLinks
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [
            {
              text: '¿Por qué Vite?',
              link: '/guide/why'
            },
            {
              text: 'Introducción',
              link: '/guide/'
            },
            {
              text: 'Funcionalidades',
              link: '/guide/features'
            },
            {
              text: 'Uso de complementos',
              link: '/guide/using-plugins'
            },
            {
              text: 'Preempaquetado de dependencias',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: 'Gestión de recursos estáticos',
              link: '/guide/assets'
            },
            {
              text: 'Compilación en producción',
              link: '/guide/build'
            },
            {
              text: 'Despliegue de un sitio estático',
              link: '/guide/static-deploy'
            },
            {
              text: 'Variables y modos de entorno',
              link: '/guide/env-and-mode'
            },
            {
              text: 'Server-side Rendering (SSR)',
              link: '/guide/ssr'
            },
            {
              text: 'Integración al Backend',
              link: '/guide/backend-integration'
            },
            {
              text: 'Comparaciones',
              link: '/guide/comparisons'
            },
            {
              text: 'Solución de problemas',
              link: '/guide/troubleshooting'
            },
            {
              text: 'Migración desde v2',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API de complementos',
              link: '/guide/api-plugin'
            },
            {
              text: 'API de HMR',
              link: '/guide/api-hmr'
            },
            {
              text: 'API de JavaScript',
              link: '/guide/api-javascript'
            },
            {
              text: 'Referencia de Configuración',
              link: '/config/'
            }
          ]
        }
      ],
      '/config/': [
        {
          text: 'Configuración',
          items: [
            {
              text: 'Configurando Vite',
              link: '/config/'
            },
            {
              text: 'Opciones compartidas',
              link: '/config/shared-options'
            },
            {
              text: 'Opciones para server',
              link: '/config/server-options'
            },
            {
              text: 'Opciones para build',
              link: '/config/build-options'
            },
            {
              text: 'Opciones para preview',
              link: '/config/preview-options'
            },
            {
              text: 'Opciones para optimización de dependencias',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'Opciones para SSR',
              link: '/config/ssr-options'
            },
            {
              text: 'Opciones para Worker',
              link: '/config/worker-options'
            }
          ]
        }
      ]
    }
  }
})
