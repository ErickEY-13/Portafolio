import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowUpRight, GitFork, Github, Search, Star, X } from 'lucide-react'
import { GITHUB_USERNAME, languageColors, site } from '../data/site'
import { useGithubRepos } from '../hooks/useGithubRepos'
import { timeAgo } from '../lib/utils'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import SpotlightCard from './ui/SpotlightCard'

const PAGE_SIZE = 6

function RepoSkeleton() {
  return <div className="skeleton h-44 rounded-2xl border border-line bg-surface" />
}

function RepoCard({ repo }) {
  const color = languageColors[repo.language] ?? 'var(--t-ink-faint)'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard className="h-full" radius={260}>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="flex h-full flex-col justify-between gap-6 p-6"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-sm text-ink transition-colors group-hover:text-accent-ink">
                {repo.name}
              </h3>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
              {repo.description || 'Sin descripción.'}
            </p>

            {repo.topics.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 3).map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 font-mono text-[11px] text-ink-faint">
            {repo.language && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {repo.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3 w-3" />
              {repo.stars}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitFork className="h-3 w-3" />
              {repo.forks}
            </span>
            <span className="ml-auto">{timeAgo(repo.updatedAt)}</span>
          </div>
        </a>
      </SpotlightCard>
    </motion.div>
  )
}

export default function GithubRepos() {
  const { repos, status, error } = useGithubRepos(GITHUB_USERNAME)
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('Todos')
  const [visible, setVisible] = useState(PAGE_SIZE)

  // Lenguajes presentes en los repos, ordenados por cantidad.
  const languages = useMemo(() => {
    const counts = new Map()
    repos.forEach((repo) => {
      if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    })
    return ['Todos', ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)]
  }, [repos])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return repos.filter((repo) => {
      const matchesLanguage = language === 'Todos' || repo.language === language
      if (!matchesLanguage) return false
      if (!needle) return true
      const haystack = [repo.name, repo.description, repo.language, ...repo.topics]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [repos, query, language])

  const shown = filtered.slice(0, visible)

  // Cualquier cambio de filtro reinicia la paginación.
  const resetPagination = (updater) => {
    updater()
    setVisible(PAGE_SIZE)
  }

  return (
    <section id="repositorios" className="scroll-mt-24 border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeading
          index="02 / Open source"
          title="Todos los repositorios"
          description={`Directo desde la API pública de GitHub — ${
            status === 'success' ? `${repos.length} repos públicos` : 'sincronizando…'
          }.`}
          action={
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs text-ink transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              <Github className="h-3.5 w-3.5" />@{GITHUB_USERNAME}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
        />

        {/* Controles: buscador + filtro por lenguaje */}
        <Reveal className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => resetPagination(() => setQuery(event.target.value))}
              placeholder="Buscar por nombre o tecnología…"
              aria-label="Buscar repositorios"
              className="w-full rounded-full border border-line bg-surface-2 py-3 pl-11 pr-10 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-line-strong focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => resetPagination(() => setQuery(''))}
                aria-label="Limpiar búsqueda"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {languages.length > 1 && (
            <div className="mask-fade-x -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
              {languages.slice(0, 7).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => resetPagination(() => setLanguage(name))}
                  className={`relative shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                    language === name ? 'text-on-invert' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {language === name && (
                    <motion.span
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-full bg-invert"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{name}</span>
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {status === 'loading' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <RepoSkeleton key={index} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-8">
            <div className="flex items-center gap-3 text-ink">
              <AlertCircle className="h-5 w-5 text-accent-ink" />
              <p className="text-sm">{error}</p>
            </div>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs text-ink transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              <Github className="h-3.5 w-3.5" />
              Ver el perfil en GitHub
            </a>
          </div>
        )}

        {status === 'success' && (
          <>
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-line p-12 text-center">
                <p className="text-sm text-ink-faint">
                  Ningún repositorio coincide con{' '}
                  <span className="font-mono text-ink">{query || language}</span>.
                </p>
              </div>
            )}

            {visible < filtered.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((value) => value + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
                >
                  Cargar más
                  <span className="font-mono text-xs text-ink-faint">
                    {filtered.length - visible}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
