/**
 * Resuelve rutas de /public respetando el `base` de Vite.
 * En producción GitHub Pages sirve todo bajo /<repo>/, así que las rutas
 * absolutas ("/cv.pdf") romperían. Siempre usa asset('cv.pdf').
 */
export function asset(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\//, '')}`
}

/** Fecha relativa en español: "hace 3 días". */
export function timeAgo(isoDate) {
  const date = new Date(isoDate)
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)

  const units = [
    ['año', 31536000],
    ['mes', 2592000],
    ['semana', 604800],
    ['día', 86400],
    ['hora', 3600],
    ['minuto', 60],
  ]

  for (const [label, amount] of units) {
    const value = Math.floor(seconds / amount)
    if (value >= 1) {
      const plural = label === 'mes' ? 'meses' : `${label}s`
      return `hace ${value} ${value === 1 ? label : plural}`
    }
  }
  return 'hace instantes'
}
