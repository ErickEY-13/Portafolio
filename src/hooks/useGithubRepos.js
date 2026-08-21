import { useCallback, useEffect, useState } from 'react'

const CACHE_KEY = (user) => `gh:repos:${user}`
const CACHE_TTL = 1000 * 60 * 60 // 1 hora — evita agotar el límite de la API pública (60 req/h por IP)

function readCache(user) {
  try {
    const raw = localStorage.getItem(CACHE_KEY(user))
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(user, data) {
  try {
    localStorage.setItem(CACHE_KEY(user), JSON.stringify({ ts: Date.now(), data }))
  } catch {
    /* modo privado / cuota llena: la caché es opcional */
  }
}

/**
 * Consume la API pública de GitHub y devuelve los repositorios del usuario.
 *
 * @param {string} username           Usuario de GitHub.
 * @param {object} options
 * @param {boolean} options.includeForks  Incluir repos bifurcados (por defecto: no).
 * @param {number}  options.perPage       Máximo 100 (límite de la API).
 */
export function useGithubRepos(username, { includeForks = false, perPage = 100 } = {}) {
  const [repos, setRepos] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  const normalize = useCallback(
    (list) =>
      list
        .filter((repo) => !repo.archived && (includeForks || !repo.fork))
        .map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics ?? [],
          updatedAt: repo.pushed_at,
        }))
        // Primero los que tienen estrellas; a igualdad, los actualizados más recientemente.
        .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt) - new Date(a.updatedAt)),
    [includeForks],
  )

  useEffect(() => {
    if (!username) return
    const controller = new AbortController()

    const cached = readCache(username)
    if (cached) {
      setRepos(normalize(cached))
      setStatus('success')
      return () => controller.abort()
    }

    async function fetchRepos() {
      try {
        setStatus('loading')
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`,
          { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } },
        )

        if (res.status === 403 || res.status === 429) {
          throw new Error('Límite de peticiones de la API de GitHub alcanzado. Inténtalo en unos minutos.')
        }
        if (res.status === 404) {
          throw new Error(`El usuario "${username}" no existe en GitHub.`)
        }
        if (!res.ok) {
          throw new Error(`GitHub respondió ${res.status}.`)
        }

        const data = await res.json()
        writeCache(username, data)
        setRepos(normalize(data))
        setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar los repositorios.')
        setStatus('error')
      }
    }

    fetchRepos()
    return () => controller.abort()
  }, [username, perPage, normalize])

  return { repos, status, error }
}
