import { LogoMark } from './logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-4">
          <LogoMark className="h-8 w-auto" />
          <p>
            <span className="text-navy">Archilab</span>, studio di architettura di Maria Pezzella
          </p>
        </div>
        <p>Fondi (LT)</p>
      </div>
    </footer>
  )
}
