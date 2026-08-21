import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
} from 'lucide-react'
import { site } from '../data/site'
import { asset } from '../lib/utils'
import Portrait from './ui/Portrait'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const socials = [
  { icon: Github, label: 'GitHub', href: site.socials.github },
  { icon: Linkedin, label: 'LinkedIn', href: site.socials.linkedin },
  { icon: Mail, label: 'Correo', href: `mailto:${site.socials.email}` },
]

export default function Hero() {
  const [first, second, ...rest] = site.fullName.split(' ')

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28"
    >
      {/* Fondo: rejilla + halo del color de resalte */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div
          className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent blur-[120px]"
          style={{ opacity: 'var(--t-glow)' }}
        />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="shell w-full">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Columna de texto */}
          <div className="lg:col-span-7">
            {/* Grado académico */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-2 py-1.5 pl-3 pr-4 backdrop-blur-sm">
                <GraduationCap className="h-3.5 w-3.5 text-accent-ink" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                  {site.degree}
                </span>
              </span>
            </motion.div>

            {/* Nombre */}
            <motion.h1
              variants={item}
              className="mt-8 text-balance text-[clamp(2.5rem,7.5vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.04em] text-ink"
            >
              {first} {second}
              <br />
              <span className="text-ink-faint">{rest.join(' ')}</span>
            </motion.h1>

            {/* Rol + ubicación */}
            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-6"
            >
              <span className="text-lg tracking-tight text-ink md:text-xl">{site.role}</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                {site.location}
              </span>
            </motion.div>

            {/* Resumen */}
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-soft"
            >
              {site.summary}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-2 rounded-full bg-invert px-6 py-3.5 text-sm font-medium text-on-invert transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                Ver proyectos
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={asset(site.resumeUrl)}
                download
                className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
              >
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Descargar CV
              </a>

              <div className="ml-1 flex items-center gap-1.5">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Retrato */}
          <motion.div
            variants={item}
            className="order-first w-36 sm:w-44 lg:order-none lg:col-span-5 lg:w-full lg:max-w-[22rem] lg:justify-self-end"
          >
            <Portrait src={site.photo} alt={`Retrato de ${site.fullName}`} />
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.a
        href="#proyectos"
        aria-label="Ir a proyectos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-faint transition-colors hover:border-line-strong hover:text-ink"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
