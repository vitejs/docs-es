import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { buildEnd } from './buildEnd.config'

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
    case 'release':
      return [
        {
          text: 'Documentación de Vite 2',
          link: 'https://v2.vitejs.dev',
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
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
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
    en: { label: 'English', link: 'https://vitejs.dev' },
    zh: { label: '简体中文', link: 'https://cn.vitejs.dev' },
    ja: { label: '日本語', link: 'https://ja.vitejs.dev' },
    pt: { label: 'Português', link: 'https://pt.vitejs.dev' },
    ko: { label: '한국어', link: 'https://ko.vitejs.dev' },
    de: { label: 'Deutsch', link: 'https://de.vitejs.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/vitejs/docs-es/edit/main/docs/:path',
      text: 'Sugerir cambios para esta página',
    },
    socialLinks: [
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],
    darkModeSwitchLabel: 'Apariencia',
    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
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
      placement: 'vitejsdev',
    },

    outlineTitle: 'En esta página',
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página',
    },

    footer: {
      message: `Publicado bajo licencia MIT. (${commitRef})`,
      copyright:
        'Copyright © 2019-actualidad Evan You & colaboradores de Vite',
    },

    nav: [
      { text: 'Guía', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Configuración', link: '/config/', activeMatch: '/config/' },
      { text: 'Complementos', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Recursos',
        items: [
          { text: 'Equipo', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Lanzamientos', link: '/releases' },
          {
            items: [
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js',
              },
              {
                text: 'Chat de Discord',
                link: 'https://chat.vitejs.dev',
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
          text: 'Guía',
          items: [
            {
              text: '¿Por qué Vite?',
              link: '/guide/why',
            },
            {
              text: 'Introducción',
              link: '/guide/',
            },
            {
              text: 'Funcionalidades',
              link: '/guide/features',
            },
            {
              text: 'Interfaz de línea de comandos',
              link: '/guide/cli',
            },
            {
              text: 'Uso de complementos',
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
            {
              text: 'Comparaciones',
              link: '/guide/comparisons',
            },
            {
              text: 'Solución de problemas',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Rendimiento',
              link: '/guide/performance',
            },
            {
              text: 'Filosofía',
              link: '/guide/philosophy',
            },
            // {
            //   text: 'Migración desde v2',
            //   link: '/guide/migration-v2-to-v3',
            // },
            // {
            //   text: 'Migración desde v3',
            //   link: '/guide/migration-v3-to-v4',
            // },
            {
              text: 'Migración desde v4',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API de complementos',
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
              text: 'API de tiempo de ejecución de Vite',
              link: '/guide/api-vite-runtime',
            },
            {
              text: 'Referencia de Configuración',
              link: '/config/',
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
    },
    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '/')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
  buildEnd,
})
