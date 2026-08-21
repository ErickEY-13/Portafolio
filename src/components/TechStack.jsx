import { motion } from 'framer-motion'
import { Code2, Database, Server, Wrench } from 'lucide-react'
import { techStack } from '../data/site'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import TechIcon from './ui/TechIcon'

// Un icono por grupo; si añades un grupo nuevo cae al icono por defecto.
const groupIcons = {
  Backend: Server,
  'Frontend & Mobile': Code2,
  'Bases de datos': Database,
  'Herramientas & SO': Wrench,
}

function StackGroup({ group, items, index }) {
  const Icon = groupIcons[group] ?? Code2

  return (
    <Reveal delay={0.06 * index} className="h-full">
      <div className="group flex h-full flex-col gap-6 border-t border-line pt-6 transition-colors duration-500 hover:border-line-strong">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-soft transition-colors duration-500 group-hover:text-accent-ink">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-medium tracking-tight text-ink">{group}</h3>
          <span className="ml-auto font-mono text-[11px] text-ink-faint">
            {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {items.map((item, itemIndex) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.45,
                delay: 0.03 * itemIndex + 0.06 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -2 }}
              className="flex cursor-default items-center gap-2 rounded-lg border border-line bg-surface-2 py-1.5 pl-2 pr-3 text-xs text-ink-soft transition-colors duration-300 hover:border-line-strong hover:text-ink"
            >
              <TechIcon name={item} size="h-4" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function TechStack() {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeading
          index="04 / Stack"
          title="Herramientas del oficio"
          description="Lo que uso a diario. Sin listas infladas: solo aquello con lo que he puesto algo en producción."
        />

        <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-x-8">
          {techStack.map((group, index) => (
            <StackGroup key={group.group} group={group.group} items={group.items} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
