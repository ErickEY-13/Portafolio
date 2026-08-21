import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

/**
 * Tarjeta con un halo que sigue al cursor.
 * Dos capas independientes: un anillo nítido sobre el borde de 1px y un
 * resplandor difuso en el interior. Ambas aparecen solo en hover.
 * Los colores salen de tokens `--t-*`, así que se adaptan al tema.
 */
export default function SpotlightCard({ children, className = '', radius = 320, as = 'div' }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)

  const handleMouseMove = (event) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    mouseX.set(event.clientX - bounds.left)
    mouseY.set(event.clientY - bounds.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  const ring = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--t-ring-core), var(--t-ring-halo) 35%, transparent 70%)`
  const glow = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--t-inner-glow), transparent 65%)`

  const Tag = as === 'article' ? motion.article : motion.div

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl border border-line bg-surface transition-colors duration-500 hover:border-line-strong ${className}`}
    >
      {/* Anillo luminoso justo encima del borde del contenedor */}
      <motion.span
        aria-hidden="true"
        style={{ background: ring }}
        className="ring-mask pointer-events-none absolute -inset-px z-20 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Resplandor interior, por debajo del contenido */}
      <motion.span
        aria-hidden="true"
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  )
}
