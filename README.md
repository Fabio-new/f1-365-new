# F1 365 — Pacchetto completo

## IMPORTANTE
Questo pacchetto è pensato per sostituire il contenuto del repository GitHub `f1-365` collegato a Vercel.

Carica **tutti i file e tutte le cartelle** di questa directory nella root del repository. Non caricare la cartella `F1-365-COMPLETO` dentro il repository: carica il suo contenuto.

## Struttura
- `index.html` — Home ricostruita sul riferimento fornito
- `news.html` — News automatiche
- `calendar.html` — Calendario dinamico
- `results.html` — Risultati dinamici
- `standings.html` — Classifiche dinamiche
- `drivers.html` — Piloti dinamici
- `teams.html` — Team dinamici
- `live.html` — dati F1 Live/sessione
- `api/` — proxy serverless Vercel
- `data/fallback.json` — fallback se un'API esterna è temporaneamente indisponibile
- `assets/` — riferimento visivo e ritagli usati dalla Home
- `404.html`, `robots.txt`, `sitemap.xml`, `vercel.json`

## Pubblicazione
1. Apri il repository GitHub `f1-365`.
2. Elimina i vecchi file del sito.
3. Carica il contenuto di questo pacchetto nella root del repository.
4. Commit.
5. Vercel farà il nuovo deploy se il progetto è già collegato al repository.

## Dati
- Jolpica F1 per calendario e classifiche.
- OpenF1 per dati di sessione disponibili.
- Formula1.com e FIA per la raccolta dei link alle news.

La Home usa HTML/CSS reale, non uno screenshot come pagina: il riferimento fornito viene usato solo per l'impostazione grafica e per i ritagli visivi.
