import { ArrowUpRight, Github } from 'lucide-react'
import { featuredProjects } from '../data/site'
import ProjectMedia from './ui/ProjectMedia'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import SpotlightCard from './ui/SpotlightCard'
import TechIcon from './ui/TechIcon'

function ProjectCard({ project, index }) {
  const flipped = index % 2 === 1

  return (
    <Reveal delay={0.04 * index}>
      <SpotlightCard as="article" className="p-2.5 md:p-3">
        <div className="grid items-stretch gap-2.5 md:grid-cols-12 md:gap-3">
          {/* Preview */}
          {/* `self-center`: la caja toma la proporción del vídeo (ver
              ProjectMedia), así que no debe estirarse a la altura de la fila
              — al hacerlo, `object-cover` recortaba medio vídeo. */}
          <div
            className={`relative overflow-hidden rounded-xl border border-line bg-surface-2 md:col-span-7 md:self-center ${
              flipped ? 'md:order-2' : ''
            }`}
          >
            <ProjectMedia
              media={project.media}
              poster={project.poster}
              title={project.title}
            />
            {/* Velo que se disipa al pasar el cursor */}
            <div className="pointer-events-none absolute inset-0 bg-canvas/25 opacity-100 transition-opacity duration-700 group-hover:opacity-0" />
          </div>

          {/* Contenido */}
          <div
            className={`flex flex-col justify-between gap-8 p-6 md:col-span-5 md:p-8 ${
              flipped ? 'md:order-1' : ''
            }`}
          >
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-medium tracking-tight text-ink md:text-3xl">
                  {project.title}
                </h3>
                <span className="font-mono text-xs text-ink-faint">{project.year}</span>
              </div>

              {project.subtitle && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-ink">
                  {project.subtitle}
                </p>
              )}

              <p className="mt-4 text-pretty text-sm leading-relaxed text-ink-soft">
                {project.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-1.5 pr-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft"
                  >
                    <TechIcon name={tag} size="h-3.5" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 rounded-full bg-invert px-4 py-2.5 text-xs font-medium text-on-invert transition-opacity hover:opacity-90"
                >
                  Live demo
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <Github className="h-3.5 w-3.5" />
                  Ver código
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Reveal>
  )
}

export default function FeaturedProjects() {
  return (
    <section id="proyectos" className="scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <SectionHeading
          index="01 / Proyectos"
          title="Trabajo seleccionado"
          description="Tres proyectos completos: qué resuelven, con qué están construidos y dónde está el código."
        />

        <div className="flex flex-col gap-4 md:gap-6">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
