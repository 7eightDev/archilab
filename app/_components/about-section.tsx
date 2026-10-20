export function AboutSection() {
  return (
    <section id="chi-siamo" aria-labelledby="chi-siamo-title" className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-8 md:grid-cols-[4fr_8fr] md:gap-16 md:py-16">
        <h2 id="chi-siamo-title" className="font-display text-3xl font-normal text-navy md:text-4xl">
          Chi siamo
        </h2>
        <p className="max-w-[62ch] font-display text-xl leading-relaxed font-light text-navy md:text-2xl md:leading-relaxed">
          Archilab è lo studio di architettura di Maria Pezzella, con sede a Fondi (LT). Da anni affianca
          famiglie, professionisti e aziende del territorio in progetti di interior design,
          ristrutturazione e pratiche urbanistiche, con un metodo che parte dall&apos;ascolto delle
          esigenze di chi vivrà lo spazio e arriva fino alla cura del dettaglio costruttivo.
        </p>
      </div>
    </section>
  )
}
