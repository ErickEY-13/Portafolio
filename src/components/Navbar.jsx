import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, Menu, X } from 'lucide-react'
import { navLinks, site } from '../data/site'
import ThemeToggle from './ui/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#inicio')

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24))

  // Sección activa: se marca la que ocupa el tercio superior del viewport.
  useEffect(() => {
    const sections = navLinks.map(({ href }) => document.querySelector(href)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Bloquea el scroll del documento mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'border-b border-line bg-canvas/70 backdrop-blur-md'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav className="shell flex h-16 items-center justify-between md:h-20">
            {/* Marca */}
            <a
              href="#inicio"
              className="group flex items-center gap-2.5 text-sm font-medium tracking-tight text-ink"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-soft transition-colors duration-300 group-hover:border-line-strong group-hover:text-accent-ink">
                <LayoutGrid className="h-3.5 w-3.5" />
              </span>
              Portafolio
            </a>

            {/* Enlaces (desktop) */}
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative block px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {active === link.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-line bg-surface-2"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <a
                href={`mailto:${site.socials.email}`}
                className="group hidden items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-ink transition-colors duration-300 hover:border-transparent hover:bg-invert hover:text-on-invert md:inline-flex"
              >
                Contacto
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={open}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink md:hidden"
              >
                {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Barra de progreso de lectura */}
        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-accent" />
      </motion.header>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <div className="shell flex h-full flex-col justify-center gap-2 pb-24">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index + 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline justify-between border-b border-line py-5 text-3xl font-medium tracking-tight text-ink"
                >
                  {link.label}
                  <span className="font-mono text-xs text-ink-faint">0{index + 1}</span>
                </motion.a>
              ))}

              <motion.a
                href={`mailto:${site.socials.email}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-invert px-6 py-3.5 text-sm font-medium text-on-invert"
              >
                Escríbeme
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
