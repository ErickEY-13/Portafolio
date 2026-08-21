import { motion } from 'framer-motion'

/**
 * Envoltorio de aparición al hacer scroll.
 * Desplazamiento + desenfoque suave: la microinteracción base de todo el sitio.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className = '',
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
