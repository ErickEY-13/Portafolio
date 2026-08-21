import { GraduationCap } from 'lucide-react'
import { education, experience } from '../data/site'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import TechIcon from './ui/TechIcon'

function Role({ job, index }) {
  return (
    <Reveal delay={0.05 * index}>
      <article className="group grid gap-6 border-t border-line py-9 transition-colors duration-500 hover:border-line-strong md:grid-cols-12 md:gap-10">
        {/* Índice + empresa */}
        <div className="md:col-span-4">
          <span className="font-mono text-[11px] text-ink-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-3 text-lg font-medium tracking-tight text-ink">{job.role}</h3>
          <p className="mt-1 text-sm text-accent-ink">{job.company}</p>
        </div>

        {/* Detalle */}
        <div className="md:col-span-8">
          <ul className="flex flex-col gap-3">
            {job.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                <span className="text-pretty">{highlight}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {job.stack.map((tech) => (
              <li
                key={tech}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-1.5 pr-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint"
              >
                {/* Sin logo registrado (p. ej. "REST API") solo se ve el texto. */}
                <TechIcon name={tech} size="h-3.5" />
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

export default function Experience() {
  return (
    <section id="trayectoria" className="scroll-mt-24 border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeading
          index="03 / Trayectoria"
          title="Dónde he trabajado"
          description="Proyectos corporativos y de gestión pública, del backend al despliegue."
        />

        <div>
          {experience.map((job, index) => (
            <Role key={job.company} job={job} index={index} />
          ))}
        </div>

        {/* Educación */}
        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-col gap-6 border-t border-line pt-9 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-soft">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-medium tracking-tight text-ink">
                  {education.degree}
                </h3>
                <p className="mt-0.5 text-sm text-ink-faint">{education.school}</p>
              </div>
            </div>

            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              {education.extra}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
