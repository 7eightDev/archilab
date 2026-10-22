/** Four faint construction lines at 0/25/50/75/100% of the container, behind Studio and Servizi. */
export function GridLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mx-auto max-w-[1200px] border-r border-[rgba(201,214,219,.08)] bg-[repeating-linear-gradient(90deg,rgba(201,214,219,.08)_0_1px,transparent_1px_25%)]"
    />
  )
}
