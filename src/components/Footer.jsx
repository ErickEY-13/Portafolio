import { motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Phone } from 'lucide-react'
import { site } from '../data/site'
import Reveal from './ui/Reveal'

const socials = [
  { icon: Github, label: 'GitHub', href: site.socials.github },
  { icon: Linkedin, label: 'LinkedIn', href: site.socials.linkedin },
  { icon: Mail, label: 'Email', href: `mailto:${site.socials.email}` },
]

export default function Footer() {
  return (
    <footer id="contacto" className="relative scroll-mt-24 overflow-hidden border-t border-line">
      {/* Halo tenue del color de resalte anclado al pie */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent blur-[110px]"
        style={{ opacity: 'var(--t-glow)' }}
      />

      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">Contacto</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl">
            Cuéntame qué estás construyendo.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4">
            <a
              href={`mailto:${site.socials.email}`}
              className="group inline-flex w-fit items-center gap-3 text-lg text-ink-soft transition-colors hover:text-ink md:text-2xl"
            >
              <span className="relative">
                {site.socials.email}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </span>
              <ArrowUpRight className="h-5 w-5 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-ink" />
            </a>

            <a
              href={`tel:+51${site.socials.phone.replace(/\s/g, '')}`}
              className="inline-flex w-fit items-center gap-2.5 font-mono text-sm text-ink-faint transition-colors hover:text-ink"
            >
              <Phone className="h-3.5 w-3.5" />
              {site.socials.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-20 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              © {new Date().getFullYear()} {site.fullName} — {site.location}
            </p>

            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-faint transition-colors duration-300 hover:border-line-strong hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}

              <a
                href="#inicio"
                aria-label="Volver arriba"
                className="group ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint transition-colors duration-300 hover:border-line-strong hover:text-ink"
              >
                Arriba
                <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
