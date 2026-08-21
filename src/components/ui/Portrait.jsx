import { useState } from 'react'
import { motion } from 'framer-motion'
import { asset } from '../../lib/utils'

/**
 * Retrato del hero.
 * Si `public/foto.jpg` todavía no existe, cae al marcador SVG en lugar de
 * mostrar una imagen rota: el sitio nunca queda a medias.
 */
export default function Portrait({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  const source = failed ? asset('avatar-placeholder.svg') : asset(src)

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface-2 ${className}`}
    >
      <div className="aspect-4/5 w-full overflow-hidden">
        <motion.img
          src={source}
          alt={alt}
          onError={() => setFailed(true)}
          decoding="async"
          className="h-full w-full object-cover transition-[filter] duration-700 [filter:grayscale(1)_contrast(1.05)] group-hover:[filter:grayscale(0)_contrast(1)]"
          initial={{ scale: 1.04 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Degradado inferior para que el borde no corte en seco */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas/60 to-transparent"
      />
    </div>
  )
}
