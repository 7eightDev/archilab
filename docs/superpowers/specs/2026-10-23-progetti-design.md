# Pagine Progetti, dettaglio progetto e Hero dai progetti — design

Data: 2026-10-23 · Stato: in revisione

## Obiettivo

Oggi il sito è una one-page con un solo progetto, raccontato nella sezione "03 Caso studio". Si aggiungono:

1. `/progetti`, l'elenco di circa 10 progetti con filtro per categoria;
2. `/progetti/[slug]`, il dettaglio di un progetto raccontato come caso studio;
3. un Hero della home che fa scorrere fino a 5 progetti scelti da Maria;
4. un drawer dei contatti nelle pagine progetti.

È una proposta speculativa: tutti i progetti sono di esempio, con foto Unsplash provvisorie. Il riferimento visivo è il mockup di Claude Design `Archilab website wireframes/Archilab Progetti.dc.html` (cartella locale, esclusa dal repo), direzione **A** per l'elenco.

Criteri di successo:
- le pagine reggono i dati parziali: le sezioni senza dati spariscono e non compaiono segnaposto;
- il filtro sta nell'indirizzo e funziona anche senza JavaScript;
- il sito rispetta [DESIGN.md](../../../DESIGN.md): solo tema scuro, ottone come unico accento, spigoli vivi, nessuna ombra.

## Decisioni prese

| Tema | Decisione |
|---|---|
| Elenco `/progetti` | Direzione A: griglia regolare, con il progetto in evidenza su una riga intera in testa |
| Contatti dalle pagine nuove | Drawer laterale a tutta altezza, solo nelle pagine progetti; in home i pulsanti continuano a scorrere fino a `#contatti` |
| Menu | Studio · Servizi · Progetti ovunque; "Caso studio" esce dal menu |
| Filtro | Nell'indirizzo (`?categoria=`), letto sul server dentro `<Suspense>` |
| Striscia delle fasi | Un solo componente nuovo (disegno del mockup), in home e nel dettaglio |
| Campi dati nuovi | `heroPosition`, `heroKicker`, `heroImage`, `durationMonths`, `permits` |
| Campi rimandati | `phaseSubtitle`, `heroCaption`, `heroFocalPoint` (finché non servono) |
| Progetti dell'Hero in `/progetti` | Non segnalati; l'etichetta CASO STUDIO resta solo sul progetto `featured` |
| Anno | Mostrato nel cartiglio, nelle card e nell'apertura del dettaglio |

## 1. Dati e use case

### Modello `Project` ([project.ts](../../../app/_domain/entities/project.ts))

Campi nuovi, tutti opzionali:

- `heroPosition`: intero da 1 a 5, cioè la posizione nell'Hero della home.
- `heroKicker`: stringa non vuota, l'occhiello dell'Hero. Il maiuscolo lo applica il componente.
- `heroImage`: `ImageSchema` (con `alt` obbligatorio), la foto orizzontale per l'Hero. Se manca si usa `coverImage`.
- `durationMonths`: intero positivo, la durata dei lavori.
- `permits`: array di stringhe non vuote (default `[]`), le pratiche presentate, es. `['CILA']`. È testo libero perché le pratiche possibili sono molte.

### Regole di validità

Nel repository in memoria, al caricamento, accanto a `assertUniqueSlugs`:
- `assertUniqueHeroPositions`: due progetti non possono avere lo stesso `heroPosition`. Se succede, l'avvio fallisce con il messaggio `Posizione nell'Hero duplicata: N`.
- Il limite di 5 posizioni discende dall'intervallo 1–5 dello schema.

### Repository ([project-repository.ts](../../../app/_domain/repositories/project-repository.ts))

Nuovo metodo `findInHero(): Promise<Project[]>`: i progetti con `heroPosition`, ordinati per posizione. `findAll(filter)` e `findBySlug` esistono già.

### Use case (in `app/_application/use-cases/`, sullo stampo di `GetFeaturedProject`)

- **`ListProjects.execute({ category? })`** restituisce `{ projects, counts, total }`:
  - `projects`: i progetti filtrati, ordinati con quelli `featured` in testa e poi per anno decrescente; a parità di anno decide l'ordine dei dati;
  - `counts`: il numero di progetti per categoria, calcolato su tutti i progetti e senza le categorie con zero progetti;
  - `total`: il numero di tutti i progetti.
- **`GetProject.execute(slug)`** restituisce `null` per uno slug sconosciuto, altrimenti `{ project, previous, next, related }`:
  - `previous` e `next` seguono l'ordine di `ListProjects` senza filtro e sono circolari. Con un solo progetto valgono `null`;
  - `related`: fino a 3 progetti diversi da quello corrente, prima quelli della stessa categoria e poi gli altri, sempre in quell'ordine.
- **`ListHeroProjects.execute()`**: `findInHero()`, al massimo 5.

I nuovi use case si registrano in [container.ts](../../../app/_infrastructure/container.ts).

### Dati di esempio ([projects.ts](../../../app/_infrastructure/data/projects.ts))

L'unico progetto attuale viene sostituito dai 10 del mockup, con gli stessi testi e le stesse foto Unsplash. Ogni immagine ha un `alt` scritto a mano.

| slug | categoria | luogo | anno | m² | hero | note |
|---|---|---|---|---|---|---|
| appartamento-fondi | ristrutturazione | Fondi (LT) | 2025 | 95 | 1 | `featured`, 6 fasi, prima/dopo, racconto |
| casa-sperlonga | residenziale | Sperlonga (LT) | 2024 | 160 | 2 | occhiello dalla regola |
| bar-fondi | commerciale | Fondi (LT) | 2023 | 48 | 3 | |
| villetta-terracina | ristrutturazione | Terracina (LT) | 2022 | 140 | 4 | |
| cucina-monte-san-biagio | interni | Monte San Biagio (LT) | 2024 | — | — | caso con dati minimi, 2 foto |
| sala-civica | pubblico | Monte San Biagio (LT) | 2021 | 210 | 5 | occhiello dalla regola |
| attico-latina | interni | Latina | 2026 | 110 | — | 1 foto |
| sottotetto-fondi | ristrutturazione | Fondi (LT) | 2019 | 38 | — | galleria vuota |
| casa-vacanze-sperlonga | interni | Sperlonga (LT) | 2020 | — | — | galleria vuota |
| casa-terracina | ristrutturazione | Terracina (LT) | 2018 | 120 | — | galleria vuota |

`durationMonths` e `permits` si aggiungono dove sono plausibili (per esempio sull'appartamento a Fondi: 7 mesi, CILA). Il commento TODO sull'anno dell'appartamento si aggiorna, perché ora l'anno viene mostrato.

### Testo della home ([content.ts](../../../app/_components/site/content.ts))

`heroSlides` viene rimosso. Resta `defaultHeroImage`, la foto del tavolo da disegno, usata quando l'Hero non ha progetti.

## 2. La pagina `/progetti`

### File

- `app/progetti/layout.tsx`, condiviso da elenco e dettaglio: header con Progetti attivo, provider e drawer dei contatti, footer, barra contatti su telefono.
- `app/progetti/page.tsx`.

### Composizione

1. **Intestazione**, nella parte statica della pagina: titolo "TUTTI I **PROGETTI**" e la frase in Oswald "Case, locali e una sala civica tra Fondi e il mare. Li ho seguiti tutti io, dal rilievo alla consegna."
2. **Dentro `<Suspense>`**, perché dipende da `searchParams`:
   - **riga del conteggio**: "10 progetti · 2018–2026", oppure "4 progetti · Ristrutturazione · 2018–2025" con un filtro attivo;
   - **chip del filtro** (`FilterChips`): link a `/progetti` e a `/progetti?categoria=<categoria>`, con il conteggio. Sono ordinati per numero di progetti decrescente e poi per nome; le categorie vuote non compaiono. Il chip attivo è pieno color carta e ha `aria-current="page"`. Su telefono i chip scorrono in orizzontale;
   - **riga in evidenza** (`FeaturedProjectRow`), solo se il progetto `featured` rientra nel filtro: foto 16:10 in 8 colonne; nelle altre 4 l'etichetta CASO STUDIO, la categoria, il titolo, il riassunto, luogo e anno, e "Leggi il caso studio";
   - **griglia** di `ProjectCard`: 3 colonne da 1024px, 2 da 640px, 1 sotto. Ogni card ha foto 4:3, categoria in ottone, titolo, luogo · anno e una freccia;
   - **fallback dell'attesa**: 6 rettangoli petrolio-2 con le proporzioni delle card.
3. **Fascia finale** (`ClosingCta`): "Hai un progetto simile? Scrivimi.", il pulsante "Scrivimi" che apre il drawer e un link WhatsApp.

### Interazione delle card

Al passaggio del mouse o con il focus da tastiera:
- la foto si ingrandisce del 4%;
- il titolo diventa ottone;
- la linea sotto la card diventa carta;
- compare la freccia.

Con `prefers-reduced-motion` la foto non si ingrandisce. L'intera card è un solo link.

### Casi limite

- `?categoria=` con un valore che non è una categoria: la pagina mostra tutti i progetti, con "Tutti" attivo.
- Categoria valida senza progetti: compare "Non ci sono ancora progetti in questa categoria." con un link a "Tutti i progetti".

### Metadati

- Titolo "Progetti · Archilab", più una descrizione.
- Con un filtro attivo: "Progetti di <categoria> · Archilab".

## 3. Il dettaglio `/progetti/[slug]`

### Generazione

- `generateStaticParams` genera in anticipo le pagine di tutti i progetti.
- `generateMetadata` imposta titolo, descrizione (il riassunto) e foto di copertina per le anteprime di condivisione.
- Per uno slug sconosciuto si chiama `notFound()`. Il file `app/progetti/[slug]/not-found.tsx` mostra "Questo progetto non c'è" e un link a Tutti i progetti.

### Composizione (ogni sezione senza dati sparisce)

1. **Link "Tutti i progetti"** sotto l'header.
2. **Apertura**:
   - **desktop**: copertina a tutta larghezza, alta 640px, con il velo petrolio da sinistra. Sopra la foto: CASO STUDIO (solo per il progetto `featured`), la riga "CATEGORIA · ANNO", il titolo (Oswald 300, 60px) e il riassunto;
   - **telefono**: copertina in 4:3 con il testo sotto.
3. **Dati e racconto**, su una griglia di 12 colonne:
   - **colonne 1–5**: la cifra dei m² (Oswald 500 con sfumatura d'ottone), con "M² RIPENSATI / DA ZERO" per la categoria ristrutturazione e "M² / DI PROGETTO" per le altre; sotto, il **cartiglio**;
   - **colonne 7–12**: "IL **RACCONTO**", con `description` divisa in paragrafi sulle righe vuote;
   - **senza racconto**: il blocco dei dati occupa tutte le 12 colonne e il cartiglio passa a 4 colonne.
4. **"LE FASI"** (`PhaseStrip`): solo se la galleria non è vuota.
5. **"PRIMA E DOPO"**: il componente esistente [before-after.tsx](../../../app/_components/site/before-after.tsx), su una fascia petrolio-2, solo se ci sono entrambe le foto.
6. **"COSA HO SEGUITO"** (`ServiceList`): un riquadro con bordo linea-forte per ogni servizio, con il titolo e il campo `summary` del servizio (omesso se manca). Non sono link, perché non esistono pagine dei servizi. Su telefono diventa un elenco a righe.
7. **"ALTRI PROGETTI"** (`RelatedProjects`): 3 card piccole in 3:2. La nota a destra dice "Della stessa categoria: <categoria>" se i progetti della stessa categoria sono almeno 3, altrimenti "<categoria> e altri progetti recenti".
8. **Navigazione fra progetti** (`ProjectPager`): PRECEDENTE · Tutti i progetti · SUCCESSIVO, con i titoli. Su telefono è una griglia 2×1 con "Tutti i progetti" sotto.
9. **Fascia finale**: "Hai una casa da ripensare? Scrivimi." per la categoria ristrutturazione, "Hai un progetto simile? Scrivimi." per le altre.

### Cartiglio (`TitleBlock`)

- Le voci, in ordine: LUOGO, SUPERFICIE, INTERVENTO, ANNO, DURATA ("7 mesi"; "1 mese" al singolare), PRATICHE (unite da " · "), SERVIZI (titoli uniti da " · ").
- Compaiono solo le voci con un dato.
- Si dispone su 2 o 4 colonne. SERVIZI occupa tutta la riga quando le colonne sono 2. L'ultima cella di una riga incompleta si allarga fino a chiuderla.
- Il calcolo delle celle è una funzione pura e testata.
- Lo stesso componente si usa nella sezione 03 della home e sostituisce `technicalSheet` di [featured-project.tsx](../../../app/_components/site/featured-project.tsx).

### Striscia delle fasi (`PhaseStrip`)

Un componente unico, usato nel dettaglio e in home. Sostituisce la striscia attuale.

- **Desktop, da 1024px**:
  - una riga da 1 a 8 colonne;
  - sopra ogni foto una linea d'ottone da 1px con un pallino da 11px e il tag della fase in ottone;
  - la colonna sotto il mouse o con il focus si allarga (`flex-grow` 2,2, oppure 1,4 se le foto sono al massimo 2);
  - se la fase ha una descrizione, sale dal basso una fascia piena petrolio con bordo superiore linea e il testo;
  - la didascalia sta sotto la foto, in Montserrat 14px carta velata;
  - nel dettaglio la foto è alta 500px, 560px con al massimo 2 foto.
- **Tablet, 640–1023px**: griglia a 2 colonne, con la descrizione sempre visibile sotto la didascalia.
- **Telefono**: timeline verticale con la linea d'ottone a sinistra, il pallino e il tag, foto 4:3, didascalia e descrizione sempre visibili.
- **Accessibilità**:
  - le fasi con una descrizione hanno `tabIndex=0` e si aprono con il focus;
  - la descrizione resta nel DOM, quindi i lettori di schermo la leggono;
  - con `prefers-reduced-motion` non ci sono transizioni.
- **Suggerimento sopra la striscia**: "Passa sopra una fase per leggere com'è andata." se almeno una fase ha una descrizione, altrimenti il numero di immagini. È visibile solo su desktop.

## 4. Hero, home e header

### Hero ([hero.tsx](../../../app/_components/site/hero.tsx))

Il comportamento attuale resta: autoplay ogni 6 secondi, pausa con mouse o focus, swipe, frecce, contatore, rispetto di `prefers-reduced-motion`. Il titolo, il paragrafo e "Raccontami la tua idea" (che continua a portare a `#contatti`) restano fissi.

Le slide vengono da `ListHeroProjects`, trasformate da una funzione pura `toHeroSlide(project)`:

- **`kicker`**: `heroKicker`, se c'è. Altrimenti una frase per categoria più "A" e il comune senza la provincia tra parentesi. Se manca il luogo, la frase è seguita da "· ANNO".
  - Le frasi per categoria: residenziale → UNA CASA · commerciale → UN LOCALE · interni → GLI INTERNI DI UNA CASA · ristrutturazione → UNA RISTRUTTURAZIONE · pubblico → UNO SPAZIO PUBBLICO.
  - Esempio: "UNA CASA A SPERLONGA".
- **`caption`**: `scope` e `areaSqm` m², uniti da " · " e omettendo ciò che manca.
- **`image`**: `heroImage`, oppure `coverImage`.
- **`href`**: `/progetti/<slug>`, più `title` per il nome accessibile.

**Link al progetto**
- Nella riga delle frecce la didascalia diventa un link: "<didascalia> — Guarda il progetto", con la parte "Guarda il progetto" sottolineata e l'icona freccia in diagonale.
- È carta chiara, ottone in hover, con il contorno di 2px carta al focus.
- `aria-label` = "Guarda il progetto: <titolo>".
- Su telefono frecce e link stanno in una fascia petrolio piena in fondo all'Hero, con bordo superiore linea, e la didascalia troncata con i puntini.

**Stati**
- **1 progetto**: niente frecce, niente contatore, niente autoplay; il link resta.
- **0 progetti**: `defaultHeroImage`, occhiello "ARCHITETTO A FONDI (LT)", niente link e niente comandi.

### Home, sezione 03 ([featured-project.tsx](../../../app/_components/site/featured-project.tsx))

Diventa l'anteprima del progetto `featured`:
- il titolo del progetto come lead della sezione;
- `PhaseStrip` con le **prime 4 foto** della galleria;
- poi su 12 colonne: a sinistra la cifra dei m² e `TitleBlock` su 2 colonne; a destra il riassunto, il pulsante con bordo "Leggi il caso studio" (verso il dettaglio) e il link "Tutti i progetti · N".

Il prima/dopo e il racconto escono dalla home.

### Header ([site-header.tsx](../../../app/_components/site/site-header.tsx))

- **Voci**: Studio · Servizi · Progetti, sia nella barra sia nel menu a scomparsa.
  - In home: `#studio`, `#servizi`, `/progetti`.
  - Nelle pagine progetti: `/#studio`, `/#servizi`, `/progetti`.
  - La voce attiva è ottone e ha `aria-current="page"`.
  - Servizi resta condizionato all'esistenza di servizi, come oggi.
- **"Contattami"** (barra e menu): in home resta il link a `#contatti`; nelle pagine progetti apre il drawer (vedi sezione 5).
- **Footer**: non cambia, perché contiene solo il link alla privacy.

### Barra contatti su telefono ([mobile-contact-bar.tsx](../../../app/_components/site/mobile-contact-bar.tsx))

- In home resta com'è.
- Nelle pagine progetti compare dopo l'intestazione della pagina e si ritira quando la fascia finale entra nello schermo. Gli elementi di riferimento sono passati come proprietà e non sono più fissi su `#top` e `#contatti`.
- "Scrivimi" apre il drawer.

## 5. Drawer dei contatti (solo pagine progetti)

### Aspetto

- È un pannello che entra da destra, alto quanto lo schermo, largo `min(560px, 100%)`, quindi a tutta larghezza su telefono.
- Fondo petrolio, bordo sinistro linea, spigoli vivi, nessuna ombra.
- Dietro il pannello c'è un velo petrolio-3 all'85%, più scuro della pagina, così il pannello si stacca da ciò che c'è dietro.
- Entra scorrendo in 300ms; con `prefers-reduced-motion` compare senza animazione.

### Contenuto

1. Il titolo "Scrivi**mi**" (`DialogTitle`), la frase "Scrivimi due righe, anche se l'idea è ancora confusa." e il pulsante di chiusura da 44px in alto a destra.
2. Recapiti rapidi: il telefono e WhatsApp, con le stesse classi dei link di [contact.tsx](../../../app/_components/site/contact.tsx).
3. `ContactForm`, lo stesso componente con la stessa azione d'invio. Nel drawer i campi vanno uno per riga: il modulo usa container query al posto delle media query per il passaggio a due campi per riga, e in home il comportamento resta lo stesso.

### Comportamento

- È costruito sul Dialog di Base UI ([dialog.tsx](../../../app/_components/ui/dialog.tsx)): focus intrappolato nel pannello, Esc e clic sul velo per chiudere, focus restituito al pulsante d'apertura, scorrimento della pagina bloccato.
- `ContactDrawerProvider` vive in `app/progetti/layout.tsx` ed espone `useContactDrawer()`. Il componente `ContactDrawerTrigger` è un `<a href="/#contatti">`: con il JavaScript caricato, il clic viene intercettato e apre il drawer; senza JavaScript il link porta al modulo della home.
- Il pannello resta montato quando è chiuso (`keepMounted`), così una bozza non si perde chiudendo il drawer.
- Dopo l'invio il messaggio di conferma del modulo compare nel pannello, che resta aperto.
- Il drawer esiste solo nelle pagine progetti, quindi non ci sono mai due `ContactForm` nella stessa pagina e gli `id` dei campi restano unici.

## 6. Componenti: nuovi, modificati, rimossi

Tutti in `app/_components/site/` salvo dove indicato.

- **Nuovi**: `ProjectCard`, `FeaturedProjectRow`, `FilterChips`, `TitleBlock` (con la funzione pura delle celle), `PhaseStrip`, `ServiceList`, `RelatedProjects`, `ProjectPager`, `ClosingCta`, `ContactDrawer` (con provider e trigger), `hero-slides.ts` (con `toHeroSlide` e la regola dell'occhiello).
- **Modificati**: `Hero` (link al progetto, stati con 0 e 1 slide, fascia su telefono), `FeaturedProject` (anteprima), `SiteHeader` (voci, stato attivo, "Contattami" che apre il drawer), `MobileContactBar` (riferimenti configurabili, apertura del drawer), `ContactForm` (container query), `content.ts` (via `heroSlides`).
- **Pagine**: `app/page.tsx` (Hero dai progetti, voci del menu), `app/progetti/layout.tsx`, `app/progetti/page.tsx`, `app/progetti/[slug]/page.tsx`, `app/progetti/[slug]/not-found.tsx`.

## 7. Test

I test si scrivono prima del codice, con Jest e Testing Library, in un file accanto a ogni file sorgente.

- **Dominio**: lo schema accetta i campi nuovi e rifiuta `heroPosition` fuori da 1–5, `durationMonths` non positivo e `permits` con stringhe vuote.
- **Repository**: `findInHero` è ordinato per posizione; una posizione duplicata fa fallire il caricamento.
- **Use case**:
  - `ListProjects`: ordine, filtro, conteggi senza categorie vuote;
  - `GetProject`: precedente e successivo circolari, `related` prima della stessa categoria, `null` per uno slug sconosciuto, un progetto solo;
  - `ListHeroProjects`: ordine e massimo 5.
- **Dati**: i 10 progetti superano lo schema, c'è un solo progetto `featured` e le posizioni dell'Hero sono 1–5 senza buchi. Si estende [data.test.ts](../../../app/_infrastructure/data/data.test.ts).
- **Funzioni pure**: `toHeroSlide` (occhiello con e senza luogo, con `heroKicker`, didascalia parziale) e le celle del cartiglio (voci presenti, allargamento, 2 e 4 colonne).
- **Componenti**:
  - Hero con 5, 1 e 0 slide e nome accessibile del link;
  - `FilterChips` con gli `href` e `aria-current`;
  - `ProjectCard`;
  - `PhaseStrip` con 1, 2 e 8 foto e il focus su una fase con descrizione;
  - `TitleBlock`;
  - `SiteHeader` con la voce attiva e "Contattami" come ancora in home e come apertura del drawer nelle pagine progetti;
  - `ContactDrawer`: apertura, Esc, ritorno del focus, bozza conservata.
- **Pagine**:
  - `/progetti` con categoria valida, inesistente e vuota;
  - il dettaglio con dati completi (appartamento a Fondi) e minimi (cucina a Monte San Biagio);
  - `notFound` per uno slug sconosciuto;
  - [page.test.tsx](../../../app/page.test.tsx) aggiornato con l'Hero dai progetti e la nuova sezione 03.
- **Verifica finale**: lint, `tsc`, la build di produzione (con le 10 pagine di dettaglio generate in anticipo) e un controllo nel browser a 1440 e a 390 rispetto al mockup.

## Fuori dall'ambito

- Il pannello di amministrazione o il database per i progetti e per la scelta dell'Hero: per ora i dati restano nel codice.
- Il drawer dei contatti in home.
- I campi `phaseSubtitle`, `heroCaption` e `heroFocalPoint`.
- I dati strutturati schema.org per i singoli progetti.
- La paginazione dell'elenco.
