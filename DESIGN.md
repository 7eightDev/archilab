---
name: Archilab
description: Sito one-page dello studio di Arch. Maria Pezzella a Fondi, su fondo petrolio con accenti in ottone.
colors:
  petrolio: "#0a3947"
  petrolio-2: "#123847"
  petrolio-3: "#0b2530"
  linea: "#1e4f61"
  linea-forte: "#5e7f8c"
  testo: "#f6f2eb"
  testo-2: "#c9d6db"
  testo-3: "#e4ecee"
  ottone: "#bc9a62"
  rame: "#a0603e"
  errore: "#f2c4a8"
typography:
  display:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(34px, 5.2vw, 64px)"
    fontWeight: 300
    lineHeight: 1.06
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 40px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "0.24em"
  lead:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(20px, 2.4vw, 26px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
  title:
    fontFamily: "Oswald, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.04em"
  figure:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(96px, 12vw, 150px)"
    fontWeight: 500
    lineHeight: 1
  numeral:
    fontFamily: "Oswald, sans-serif"
    fontSize: "44px"
    fontWeight: 300
    lineHeight: 1
  caption-display:
    fontFamily: "Oswald, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.16em"
  nav:
    fontFamily: "Oswald, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  none: "0"
  full: "9999px"
spacing:
  "2": "8px"
  "3": "12px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
  "28": "112px"
components:
  button-primary:
    backgroundColor: "{colors.testo}"
    textColor: "{colors.petrolio-2}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.petrolio-2}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.testo}"
    rounded: "{rounded.none}"
    size: "44px"
  input:
    backgroundColor: "{colors.petrolio}"
    textColor: "{colors.testo}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "52px"
  nav-link:
    textColor: "{colors.testo}"
    typography: "{typography.nav}"
    height: "44px"
  nav-link-hover:
    textColor: "{colors.ottone}"
  header-contact:
    backgroundColor: "{colors.testo}"
    textColor: "{colors.petrolio-2}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "44px"
  tag-chip:
    backgroundColor: "{colors.petrolio}"
    textColor: "{colors.ottone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 8px"
---

# Design System: Archilab

## Overview

**Creative North Star: "Lo studio a Fondi"**

Il sito è lo studio di una persona sola, raccontato con i colori del suo biglietto da visita: il petrolio come fondo, l'ottone come la finitura che si nota per ultima, il rame solo nel marchio. Non è una vetrina di agenzia: è Maria che parla in prima persona, con la precisione di chi porta le pratiche in Comune e il calore di chi entra in casa delle persone.

Il carattere è caldo e diretto, con controlli netti e decisi. Il fondo è sempre scuro e pieno; la luce arriva dal testo color carta, dalle fotografie e da pochi tratti d'ottone. Gli spigoli sono vivi ovunque, come in un disegno tecnico, e non c'è nessuna ombra: la profondità nasce dal passaggio tra due petroli e da linee sottili. Il disegno d'architettura resta nei dettagli (il cartiglio, le quote, la linea delle fasi), non come costume.

Il ritmo è generoso ma non dispersivo: sezioni numerate 01–05 che seguono il percorso dalla conoscenza al contatto, ognuna con un solo compito, e il modulo come destinazione.

**Key Characteristics:**
- Solo tema scuro: petrolio come fondo, testo color carta, ottone come unico accento.
- Spigoli vivi (raggio 0) su tutto, tranne i pallini della timeline e la maniglia dello slider.
- Nessuna ombra: profondità per tono (petrolio → petrolio-2 → petrolio-3) e linee da 1px.
- Oswald leggero per la voce dei titoli, Montserrat per leggere e per i controlli.
- Controlli netti: pulsante color carta pieno su petrolio, bordi visibili, stati evidenti.

## Colors

Una palette notturna e calda: un petrolio profondo in tre toni, un testo color carta e un solo metallo, l'ottone.

### Primary
- **Ottone** (ottone): l'accento. Numeri di sezione, parola evidenziata nei titoli, kicker dell'apertura, linea e pallini della timeline, trattini degli elenchi, etichette del cartiglio e dell'indirizzo, hover dei link. Sempre su petrolio, mai come riempimento di un controllo.

### Secondary
- **Rame** (rame): solo nel marchio, nella barra verticale del logo. Non compare altrove.

### Neutral
- **Petrolio** (petrolio): il fondo della pagina, dell'header e dei campi del modulo. Il colore del brand.
- **Petrolio chiaro** (petrolio-2): le fasce alternate ("Come lavoro"), il fondo delle immagini in caricamento, il testo dei pulsanti chiari.
- **Petrolio profondo** (petrolio-3): solo il footer, per chiudere la pagina un tono più in basso.
- **Linea** (linea): divisori, bordi delle sezioni, separatori degli elenchi.
- **Linea forte** (linea-forte): bordi dei campi, del cartiglio e dei pulsanti secondari; tutto ciò che deve farsi notare come confine interattivo.
- **Carta** (testo): testo principale e riempimento del pulsante primario.
- **Carta velata** (testo-2): paragrafi secondari, didascalie, descrizioni.
- **Carta chiara** (testo-3): il sottotitolo dell'apertura, sopra la fotografia.
- **Pesca** (errore): messaggi e bordi di errore del modulo.

### Named Rules
**The Un Solo Metallo Rule.** L'ottone è l'unico accento. Niente altri colori saturi, niente blu per i link: un link si riconosce dal colore carta e dall'hover in ottone.

**The Rame Solo Nel Marchio Rule.** Il rame vive solo nel logo. Usarlo altrove diluisce l'unico punto in cui il marchio parla.

## Typography

**Display Font:** Oswald (con sans-serif), pesi 300/400/500
**Body Font:** Montserrat (con sans-serif), pesi 400/500/600

**Character:** Oswald, stretto e leggero, ha la verticalità delle quote di un disegno; Montserrat, largo e geometrico, tiene la lettura e i controlli calmi e leggibili su telefono.

### Hierarchy
- **Display** (300, clamp 34–64px, 1.06, +0.02em): solo il titolo dell'apertura.
- **Headline** (300, clamp 26–40px, 1.1, +0.24em, maiuscolo): i titoli di sezione, con la seconda parola in ottone ("LO **STUDIO**").
- **Lead** (Oswald 400, clamp 20–26px, 1.3): la riga sotto il titolo di sezione quando è una frase-voce ("Scrivimi due righe…").
- **Title** (Oswald 400, 26–28px, 1.1–1.2): titoli interni, i nomi dei servizi, la frase di presentazione di Maria.
- **Numeral** (Oswald 300, 44px, ottone): i numeri dei passi di "Come lavoro".
- **Caption display** (Oswald 400, 19px, 1.2): le didascalie sovrapposte alle foto della galleria.
- **Figure** (Oswald 500, clamp 96–150px): la sola cifra grande del progetto, "95", con sfumatura d'ottone.
- **Body** (Montserrat 400, 17px, 1.6): paragrafi, massimo circa 62 caratteri per riga.
- **Body small** (15px, 1.6): descrizioni dei passi, voci degli elenchi, testo dei pulsanti.
- **Caption** (13px): didascalie, firma, note sotto lo slider, footer.
- **Label** (Montserrat 500, 11px, +0.16em, maiuscolo, ottone): etichette del cartiglio, dell'indirizzo e della galleria.
- **Nav** (Oswald 400, 13px, +0.16em, maiuscolo): voci del menu.

### Named Rules
**The Maiuscolo Solo Per Etichette Rule.** La spaziatura ampia (oltre +0.2em) è riservata ai titoli di sezione. Etichette e menu stanno a +0.16em; il testo in minuscolo non si spazia mai oltre +0.04em.

**The Numeri Che Contano Rule.** I numeri 01–05 marcano le sezioni e i passi di "Come lavoro", dove l'ordine è informazione. Non si numerano elenchi, servizi o immagini.

## Layout

Una colonna centrale di 1200px con 24px di margine laterale, su un fondo che corre a tutta larghezza. Le fotografie del progetto escono dalla colonna e vanno a tutta pagina. Dietro "Lo studio" e "Un solo percorso", da 1024px in su, quattro linee sottili (`rgba(201,214,219,.08)`) dividono la colonna in quarti, come la squadratura di una tavola.

Il ritmo verticale è di 64px tra le sezioni su telefono e di 96–112px da 640px in su. All'interno, i gruppi stretti usano 8–12px, i blocchi 20–32px e le colonne 32–48px.

Tre stati, senza punti intermedi:
- **Telefono (< 640px):** tutto in una colonna; header di 64px con menu a scomparsa; timeline delle fasi verticale con la linea a sinistra; CTA e invio a tutta larghezza; foto del progetto impilate in 4:3; una barra fissa "Scrivimi / WhatsApp" compare dopo l'apertura e si ritira all'arrivo dei contatti.
- **Tablet (640–1023px):** header di 72px con "Contattami" visibile e il menu a scomparsa; servizi su due colonne con la terza a tutta larghezza; foto del progetto in griglia 2×2; passi del metodo 2×2; modulo con due campi per riga.
- **Desktop (≥ 1024px):** menu completo nell'header; servizi e Studio su più colonne; le quattro foto del progetto in una riga in cui la colonna sotto il mouse si allarga.

L'apertura occupa al massimo `min(88vh, 780px)` su desktop e `88svh` su telefono, e il suo contenuto deve stare tutto nella prima schermata a 1280×800.

## Elevation & Depth

Completamente piatto: nessuna ombra, mai. La profondità nasce dal tono (petrolio per la pagina, petrolio-2 per le fasce e le aree in attesa, petrolio-3 per il footer) e da linee da 1px. Sulle fotografie, una sfumatura petrolio da sinistra (o dall'alto, su telefono) rende il testo leggibile senza scatole né riquadri.

### Named Rules
**The Niente Ombre Rule.** Nessun `box-shadow` decorativo. L'unico "alone" ammesso è l'anello di focus (3px color carta sui campi, 3px ottone sul pulsante d'invio), che è un segnale e non una profondità.

## Shapes

Spigoli vivi ovunque (raggio 0): pulsanti, campi, immagini, cartiglio, chip delle etichette. Le uniche forme rotonde sono i pallini da 11px della timeline e la maniglia circolare da 44px dello slider prima/dopo, perché sono punti, non contenitori. I bordi sono sempre da 1px, tranne l'errore dei campi, che passa a 2px.

## Components

### Buttons
Netti e decisi: un blocco pieno color carta su petrolio, che non si può non vedere.
- **Shape:** spigoli vivi (0).
- **Primary:** fondo carta, testo petrolio-2, Montserrat 500 15px a +0.04em, altezza 52px, 24px di margine interno su telefono e 32px da 640px; a tutta larghezza su telefono. Freccia a icona a destra quando porta da qualche parte.
- **Hover / Focus:** il fondo diventa bianco pieno; il focus del pulsante d'invio è un anello di 3px in ottone.
- **Outline:** quadrato da 44px con bordo linea-forte e icona freccia, per le frecce del carosello; il bordo diventa carta in hover.
- **Contattami (header):** come il primario ma più compatto, altezza 44px e 14px di margine interno.
- **Invia il messaggio:** come il primario ma con 20px di margine interno su telefono e 24px da 640px.

### Inputs / Fields
- **Style:** fondo petrolio, bordo 1px linea-forte, spigoli vivi, altezza 52px, testo 17px. Etichetta sopra il campo in Montserrat 500 14px.
- **Focus:** anello di 3px color carta attorno al campo.
- **Error:** bordo 2px pesca (anche quando il campo ha il focus), messaggio pesca 13px sotto il campo, riepilogo "Controlla i N campi evidenziati." in cima al modulo.
- **Select:** freccia a icona staccata 16px dal bordo destro, non quella del browser.

### Navigation
- **Header:** sticky, fondo petrolio con bordo inferiore linea; logo a sinistra (40px di altezza su telefono, 52px da 640px).
- **Voci:** Oswald 13px maiuscolo a +0.16em, color carta, ottone in hover; visibili solo da 1024px, altrimenti in un menu a scomparsa aperto da un pulsante 44×44 e chiuso con Esc.

### Links
I link dei recapiti (telefono, WhatsApp, email, Google Maps) non sono sottolineati: colore carta, ottone in hover, area di tocco di 44px. Il link "Guarda un progetto" dell'apertura resta sottolineato con un margine di 6px.

### Cartiglio
La scheda tecnica del progetto disegnata come il riquadro dati di una tavola: griglia 2×2 con bordi 1px linea-forte, etichetta ottone in maiuscolo sopra il valore color carta. Mostra solo le voci di cui esiste il dato.

### Slider prima/dopo
Immagine 3:2 con la foto "dopo" scoperta da un `clip-path` guidato da un range invisibile (0–100, parte da 50). Linea verticale color carta da 2px, maniglia circolare da 44px con icona doppia freccia, etichette PRIMA (su petrolio) e DOPO (su carta) negli angoli alti.

### Timeline delle fasi
Cinque fasi su una linea d'ottone con pallini da 11px: orizzontale da 640px, verticale con la linea a sinistra su telefono.

### Barra contatti su telefono
Fissa in fondo allo schermo, fondo petrolio con bordo superiore linea, due pulsanti da 48px affiancati ("Scrivimi" pieno, "WhatsApp" con bordo). Scivola dentro dopo l'apertura e si ritira quando arriva la sezione contatti; nascosta da 640px in su.

## Do's and Don'ts

### Do:
- **Do** tenere ogni superficie su un tono di petrolio; il testo color carta (#f6f2eb) è la luce della pagina.
- **Do** usare l'ottone per numeri di sezione, linee e etichette, sempre in piccole dosi.
- **Do** tenere gli spigoli a 0 su pulsanti, campi e immagini.
- **Do** mostrare solo dati reali: quando un recapito, un numero d'iscrizione o una foto non esistono ancora, l'elemento si omette.
- **Do** garantire 44px di area di tocco a ogni link e controllo, 52px al pulsante primario.

### Don't:
- **Don't** usare ombre, angoli arrotondati o gradienti decorativi; l'unica sfumatura ammessa è quella sulle foto per leggere il testo, più la cifra "95".
- **Don't** mostrare segnaposto come "[DA FORNIRE]" ai visitatori.
- **Don't** numerare elenchi, servizi o immagini con 01/02/03.
- **Don't** spaziare il testo in minuscolo o usare spaziature oltre +0.2em fuori dai titoli di sezione.
- **Don't** usare caratteri Unicode (→, ⇔) al posto delle icone.
- **Don't** introdurre un tema chiaro: il sito è solo scuro.
