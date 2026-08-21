import { getTechIcon } from '../../data/tech'
import { asset } from '../../lib/utils'

/**
 * Logo de una tecnología con resplandor de su propio color al pasar el cursor.
 *
 * El truco: se pinta una segunda copia del mismo SVG, desenfocada y detrás,
 * que se enciende en hover. Así el brillo toma el color exacto de la marca sin
 * declararlo en ninguna parte.
 *
 * El cambio de variante clara/oscura es puro CSS (`dark:hidden`), no JS: así
 * no hace falta suscribir cada icono al estado del tema.
 */
export default function TechIcon({ name, size = 'h-5' }) {
  const entry = getTechIcon(name)
  if (!entry) return null

  const layers = entry.dark
    ? [
        { src: entry.src, cls: 'dark:hidden' },
        { src: entry.dark, cls: 'hidden dark:block' },
      ]
    : [{ src: entry.src, cls: '' }]

  return (
    <span className="group/icon relative inline-flex shrink-0 items-center justify-center">
      {layers.map(({ src, cls }) => (
        <img
          key={src}
          src={asset(src)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`tech-glow pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover/icon:opacity-100 ${cls}`}
        />
      ))}

      {layers.map(({ src, cls }) => (
        <img
          key={`main-${src}`}
          src={asset(src)}
          alt={name}
          title={name}
          loading="lazy"
          decoding="async"
          className={`relative z-10 ${size} w-auto object-contain transition-transform duration-300 group-hover/icon:scale-110 ${cls}`}
        />
      ))}
    </span>
  )
}
