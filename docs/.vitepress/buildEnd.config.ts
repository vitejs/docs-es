import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'

const siteUrl = 'https://es.vitejs.dev'
const blogUrl = `${siteUrl}/blog`

export const buildEnd = async (config: SiteConfig): Promise<void> => {
  const feed = new Feed({
    title: 'Vite',
    description: 'Herramienta frontend de próxima generación',
    id: blogUrl,
    link: blogUrl,
    language: 'es',
    image: 'https://es.vitejs.dev/og-image.png',
    favicon: 'https://es.vitejs.dev/logo.svg',
    copyright:
      'Derechos reservados © 2019-actualidad Evan You & los colaboradores de Vite',
  })
  const posts = await createContentLoader('blog/*.md', {
    excerpt: true,
    render: true,
  }).load()
  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string),
  )
  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${siteUrl}${url}`,
      link: `${siteUrl}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: frontmatter.author.name,
        },
      ],
      date: frontmatter.date,
    })
  }
  writeFileSync(path.join(config.outDir, 'blog.rss'), feed.rss2())
}
