import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/** Lee el tema efectivo que dejó el script anti-parpadeo de index.html. */
function readInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Tema claro/oscuro con persistencia.
 * Mientras el usuario no elija explícitamente, se sigue la preferencia del
 * sistema y se reacciona a sus cambios en vivo.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => {
      if (localStorage.getItem(STORAGE_KEY)) return // el usuario ya decidió
      setTheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* modo privado: el tema simplemente no persiste */
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
