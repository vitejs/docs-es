import fs from 'node:fs'
import path from 'node:path'

// Dependencias notables para resaltar (por nombre de paquete)
const notableDependencies = [
    'rolldown',
    'postcss',
    'lightningcss',
    'chokidar',
    'magic-string',
]

// Herramientas de desarrollo utilizadas
const devToolNames = [
    'eslint',
    'prettier',
    'typescript',
    'vitest',
    'playwright-chromium',
]

// Dependencias notables pasadas que Vite utilizó anteriormente
const pastNotableDependencies: PastDependency[] = [
    {
        name: 'esbuild',
        description:
            'Bundler y minificador de JavaScript/TypeScript (ahora utiliza Rolldown, Oxc y LightningCSS)',
        repository: 'https://github.com/evanw/esbuild',
    },
    {
        name: 'rollup',
        description: 'Bundler de módulos ES (ahora utiliza Rolldown)',
        repository: 'https://github.com/rollup/rollup',
    },
    {
        name: 'http-proxy',
        description: 'Proxy HTTP (ahora utiliza http-proxy-3)',
        repository: 'https://github.com/http-party/node-http-proxy',
    },
    {
        name: 'acorn',
        description: 'Analizador (parser) de JavaScript',
        repository: 'https://github.com/acornjs/acorn',
    },
    {
        name: 'fast-glob',
        description: 'Coincidencia de glob rápida (ahora utiliza tinyglobby/fdir)',
        repository: 'https://github.com/mrmlnc/fast-glob',
    },
    {
        name: 'debug',
        description: 'Registro (logging) de depuración (ahora utiliza obug)',
        repository: 'https://github.com/debug-js/debug',
    },
]

const vitePackageDir = path.resolve(import.meta.dirname, '../../node_modules/vite')

interface PackageJson {
    name: string
    version: string
    description?: string
    author?: string | { name: string; email?: string; url?: string }
    repository?: string | { type?: string; url?: string }
    funding?:
    | string
    | { url: string; type?: string }
    | Array<string | { url: string; type?: string }>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
}

export interface Dependency {
    name: string
    version: string
    description?: string
    author?: string
    authorUrl?: string
    repository?: string
    funding?: string
}

export interface PastDependency {
    name: string
    description: string
    repository: string
}

export interface AuthorPackage {
    name: string
    funding?: string
}

export interface Author {
    name: string
    url?: string
    funding?: string
    packages: AuthorPackage[]
}

export interface AcknowledgementsData {
    bundledDependencies: Dependency[]
    notableDependencies: Dependency[]
    devTools: Dependency[]
    pastNotableDependencies: PastDependency[]
    authors: Author[]
}

/**
 * Analiza el archivo LICENSE.md para extraer los nombres de las dependencias empaquetadas.
 */
function parseBundledDependenciesFromLicense(licensePath: string): string[] {
    const content = fs.readFileSync(licensePath, 'utf-8')

    // Encuentra la sección "# Bundled dependencies:" y analiza los nombres de los paquetes de las cabeceras ##
    const bundledSection = content.split('# Bundled dependencies:\n')[1]
    if (!bundledSection) return []

    // Coincide con todas las cabeceras ## que contienen nombres de paquetes (separados por comas para paquetes agrupados)
    const deps = [...bundledSection.matchAll(/^## (.+)$/gm)].flatMap((m) =>
        // Los nombres de los paquetes pueden estar separados por comas (ej. "## pkg1, pkg2, pkg3")
        m[1].split(',').map((n) => n.trim()),
    )
    return [...new Set(deps)]
}

function normalizeRepository(
    repo: PackageJson['repository'],
): string | undefined {
    if (!repo) return undefined

    let url: string
    if (typeof repo === 'string') {
        url = repo
    } else if (repo.url) {
        url = repo.url
    } else {
        return undefined
    }
    url = url
        .replace(/^git\+/, '')
        .replace(/\.git$/, '')
        .replace(/(^|\/)[^/]+?@/, '$1') // elimina "user@" de "ssh://user@host.com:..."
        .replace(/(\.[^.]+?):/, '$1/') // cambia ".com:" a ".com/" de "ssh://user@host.com:..."
        .replace(/^git:\/\//, 'https://')
        .replace(/^ssh:\/\//, 'https://')
    if (url.startsWith('github:')) {
        return `https://github.com/${url.slice(7)}`
    } else if (url.startsWith('gitlab:')) {
        return `https://gitlab.com/${url.slice(7)}`
    } else if (url.startsWith('bitbucket:')) {
        return `https://bitbucket.org/${url.slice(10)}`
    } else if (!url.includes(':') && url.split('/').length === 2) {
        return `https://github.com/${url}`
    } else {
        return url.includes('://') ? url : `https://${url}`
    }
}

function normalizeFunding(funding: PackageJson['funding']): string | undefined {
    if (!funding) return undefined
    if (typeof funding === 'string') return funding
    if (Array.isArray(funding)) {
        const first = funding[0]
        if (typeof first === 'string') return first
        return first?.url
    }
    return funding.url
}

function parseAuthor(author: PackageJson['author']): {
    name?: string
    url?: string
} {
    if (!author) return {}
    if (typeof author === 'object') {
        return { name: author.name, url: author.url }
    }
    // Analiza el formato de cadena: "Nombre <email> (url)" o "Nombre (url)" o "Nombre <email>" o "Nombre"
    let str = author
    let url: string | undefined
    const urlMatch = str.match(/\(([^)]+)\)$/)
    if (urlMatch) {
        url = urlMatch[1]
        str = str.slice(0, urlMatch.index).trim()
    }
    const emailIndex = str.indexOf('<')
    if (emailIndex !== -1) {
        str = str.slice(0, emailIndex).trim()
    }
    return { name: str || author, url }
}

function readPackageInfo(
    packageName: string,
    nodeModulesDir: string,
): Dependency | null {
    const packagePath = path.join(nodeModulesDir, packageName, 'package.json')

    try {
        const content = fs.readFileSync(packagePath, 'utf-8')
        const pkg: PackageJson = JSON.parse(content)
        const authorInfo = parseAuthor(pkg.author)

        return {
            name: pkg.name,
            version: pkg.version,
            description: pkg.description,
            author: authorInfo.name,
            authorUrl: authorInfo.url,
            repository: normalizeRepository(pkg.repository),
            funding: normalizeFunding(pkg.funding),
        }
    } catch {
        // Es posible que el paquete no exista en node_modules (dependencia de par opcional, etc.)
        return null
    }
}

function groupByAuthor(dependencies: Dependency[]): Author[] {
    const authorMap = new Map<
        string,
        { url?: string; packages: AuthorPackage[] }
    >()

    for (const dep of dependencies) {
        if (dep.author) {
            const existing = authorMap.get(dep.author)
            if (existing) {
                existing.packages.push({ name: dep.name, funding: dep.funding })
                if (!existing.url && dep.authorUrl) {
                    existing.url = dep.authorUrl
                }
            } else {
                authorMap.set(dep.author, {
                    url: dep.authorUrl,
                    packages: [{ name: dep.name, funding: dep.funding }],
                })
            }
        }
    }

    return Array.from(authorMap.entries())
        .map(([name, info]) => {
            const sortedPackages = info.packages.sort((a, b) =>
                a.name.localeCompare(b.name),
            )
            const fundingUrls = new Set(
                sortedPackages.map((p) => p.funding).filter(Boolean),
            )
            const sharedFunding =
                fundingUrls.size === 1 ? [...fundingUrls][0] : undefined
            return {
                name,
                url: info.url,
                funding: sharedFunding,
                packages: sharedFunding
                    ? sortedPackages.map((p) => ({ name: p.name }))
                    : sortedPackages,
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
}

function loadData(): AcknowledgementsData {
    const licensePath = path.join(vitePackageDir, 'LICENSE.md')
    const nodeModulesDir = path.join(vitePackageDir, 'node_modules')
    const rootNodeModulesDir = path.resolve(
        import.meta.dirname,
        '../../node_modules',
    )

    const bundledDepNames = parseBundledDependenciesFromLicense(licensePath)
    const bundledDependencies = bundledDepNames
        .map(
            (name) =>
                readPackageInfo(name, nodeModulesDir) ||
                readPackageInfo(name, rootNodeModulesDir),
        )
        .filter((dep) => dep != null)
        .sort((a, b) => a.name.localeCompare(b.name))

    const devTools = devToolNames
        .map((name) => readPackageInfo(name, rootNodeModulesDir))
        .filter((dep) => dep != null)
        .sort((a, b) => a.name.localeCompare(b.name))

    const notableDeps = notableDependencies
        .map(
            (name) =>
                readPackageInfo(name, nodeModulesDir) ||
                readPackageInfo(name, rootNodeModulesDir),
        )
        .filter((dep) => dep != null)

    const nonNotableDeps = bundledDependencies.filter(
        (d) => !notableDependencies.includes(d.name),
    )

    return {
        bundledDependencies,
        notableDependencies: notableDeps,
        devTools,
        pastNotableDependencies,
        authors: groupByAuthor(nonNotableDeps),
    }
}

// Exportación de datos para VitePress
declare const data: AcknowledgementsData
export { data }

export default {
    watch: [path.join(vitePackageDir, 'LICENSE.md')],
    load(): AcknowledgementsData {
        return loadData()
    },
}
