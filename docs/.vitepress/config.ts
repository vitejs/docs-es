import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vite',
  description: 'Herramientas frontend de próxima generación',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  vue: {
    reactivityTransform: true
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      repo: 'vitejs/vite',
      branch: 'main',
      dir: 'docs',
      text: 'Sugerir cambios para esta página'
    },
    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],
    algolia: {
      apiKey: 'b573aa848fd57fb47d693b531297403c',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en']
      }
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    localeLinks: {
      text: 'Español',
      items: [
        { text: 'English', link: 'https://vitejs.dev' },
        { text: '简体中文', link: 'https://cn.vitejs.dev' },
        { text: '日本語', link: 'https://ja.vitejs.dev' }
      ]
    },

    footer: {
      message: 'Publicado bajo licencia MIT',
      copyright: 'Copyright © 2019-actualidad Evan You & colaboradores de Vite'
    },

    nav: [
      { text: 'Guía', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Configuración', link: '/config/', activeMatch: '/config/' },
      { text: 'Complementos', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Enlaces',
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
      },
      {
        text: 'v3 (desarrollo)',
        items: [
          {
            text: 'v2.x (estable)',
            link: 'https://v2.vitejs.dev'
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [
            {
              text: 'Por qué Vite',
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
              text: 'Opciones de servidor',
              link: '/config/server-options'
            },
            {
              text: 'Opciones de compilación',
              link: '/config/build-options'
            },
            {
              text: 'Opciones de vista previa',
              link: '/config/preview-options'
            },
            {
              text: 'Opciones de optimización de dependencias',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'Opciones SSR',
              link: '/config/ssr-options'
            },
            {
              text: 'Opciones de Worker',
              link: '/config/worker-options'
            }
          ]
        }
      ]
    }
  }
})
