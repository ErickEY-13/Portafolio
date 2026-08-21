import Reveal from './Reveal'

/**
 * Encabezado de sección: índice mono + título + descripción opcional,
 * separados por una línea fina de 1px (lenguaje visual del sitio).
 */
export default function SectionHeading({ index, title, description, action }) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className="flex items-baseline gap-4 border-b border-line pb-5">
          <span className="eyebrow">{index}</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal delay={0.05}>
          <h2 className="max-w-xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl">
            {title}
          </h2>
        </Reveal>

        {(description || action) && (
          <Reveal delay={0.12}>
            <div className="flex max-w-sm flex-col items-start gap-4 md:items-end">
              {description && (
                <p className="text-pretty text-sm leading-relaxed text-ink-faint md:text-right">
                  {description}
                </p>
              )}
              {action}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}
