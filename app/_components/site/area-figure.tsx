import type { Project } from '@/app/_domain/entities/project'

/**
 * The project's floor area as a large brass figure, labelled after the kind of work.
 * Renders nothing without an area.
 */
export function AreaFigure({ project }: { project: Project }) {
  if (!project.areaSqm) return null
  const [label, detail] = project.category === 'ristrutturazione' ? ['M² RIPENSATI', 'DA ZERO'] : ['M²', 'DI PROGETTO']

  return (
    // The figure is trimmed to its cap height, then lowered to the cap line of the first labels.
    <p className="mt-2 flex items-end gap-4">
      <span className="bg-[linear-gradient(135deg,#ECE5DA_10%,var(--ottone)_55%,#D8CDBF_90%)] inline-block bg-clip-text pt-[.06em] [text-box:trim-start_cap_alphabetic] font-heading text-[clamp(96px,12vw,150px)] leading-none font-medium text-transparent">
        {project.areaSqm}
      </span>
      <span className="pb-1.5 font-heading text-[15px] leading-normal tracking-[.16em]">
        <span className="text-ottone">{label}</span>
        <br />
        {detail}
      </span>
    </p>
  )
}
