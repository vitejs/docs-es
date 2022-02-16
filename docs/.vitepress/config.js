// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Vite',
  description: 'Herramientas Frontend de próxima generación',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: {
    repo: 'vitejs/vite',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Sugiere cambios para esta página',

    algolia: {
      apiKey: 'b573aa848fd57fb47d693b531297403c',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:es']
      }
    },

    carbonAds: {
      carbon: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    nav: [
      { text: 'Guía', link: '/guide/' },
      { text: 'Configuración', link: '/config/' },
      { text: 'Complementos', link: '/plugins/' },
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
        text: 'Idiomas',
        items: [
          {
            text: 'English',
            link: 'https://vitejs.dev'
          },
          {
            text: 'Español',
            link: 'https://es.vitejs.dev'
          },
          {
            text: '简体中文',
            link: 'https://cn.vitejs.dev'
          },
          {
            text: '日本語',
            link: 'https://ja.vitejs.dev'
          }
        ]
      }
    ],

    sidebar: {
      '/config/': 'auto',
      '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Guía',
          children: [
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
              text: 'Preempaquetado de dependencia',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: 'Manejo de recursos estáticos',
              link: '/guide/assets'
            },
            {
              text: 'Compilación en producción',
              link: '/guide/build'
            },
            {
              text: 'Implementación de un sitio estático',
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
              text: 'Migración desde v1',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'APIs',
          children: [
            {
              text: 'Plugin API',
              link: '/guide/api-plugin'
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr'
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript'
            },
            {
              text: 'Config Reference',
              link: '/config/'
            }
          ]
        }
      ]
    }
  }
}
