# Finanze App – versione PWA

Stessa identica app (funzioni, grafici, colori) della tua `FinanzeAppR8.html`,
trasformata in Progressive Web App installabile su iPhone.

## Cosa contiene questa cartella
Tutti i file sono **nella stessa cartella, nessuna sottocartella** (scelta
apposta per rendere facile l'upload da iPhone):
- `index.html` — la tua app originale, invariata, con solo l'aggiunta dei
  collegamenti a manifest/service worker/icone.
- `manifest.json` — descrive nome, colori e icone dell'app per l'installazione.
- `service-worker.js` — permette all'app di funzionare offline e di
  aggiornarsi in futuro.
- `icon-192.png`, `icon-512.png`, `icon-maskable-192.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png` — icone dell'app.

## Come pubblicarla su GitHub Pages (da iPhone)
1. Crea un account su github.com (se non lo hai già).
2. Crea un nuovo repository, es. `finanze-app` (può essere pubblico o privato,
   ma GitHub Pages gratuito richiede repo pubblico salvo abbonamento Pro).
3. Nella pagina del repository tocca **"Add file" → "Upload files"** e
   seleziona **tutti i file di questa cartella in un colpo solo** (non ci
   sono sottocartelle da gestire). Fai commit.
4. Vai su Settings → Pages del repository, scegli come sorgente il branch
   `main` (cartella `/root`) e salva.
5. Dopo qualche minuto GitHub ti darà un link tipo:
   `https://tuonome.github.io/finanze-app/`
6. Apri quel link da Safari sull'iPhone → tasto Condividi → "Aggiungi a
   Home". L'icona apparirà sulla home come un'app vera, a schermo intero.

## Nota importante sulla privacy
I tuoi file di spese **non vengono mai caricati online**. Li selezioni ogni
volta direttamente dal Files del telefono; l'app li legge ed elabora
interamente nel browser, in locale. Su GitHub finisce solo il codice
dell'app (identico per tutti), mai i tuoi dati.

## Aggiornamenti futuri
Quando modificheremo il codice, basterà ricaricare i file cambiati sullo
stesso repository. La prossima volta che apri l'app, il service worker
scarica automaticamente la nuova versione (potrebbe servire chiudere e
riaprire l'app una volta per vederla applicata).
Se cambi `index.html`, ricordati di alzare `CACHE_VERSION` dentro
`service-worker.js` (es. da `'v1'` a `'v2'`): serve a far capire al telefono
che deve scaricare la versione aggiornata invece di usare quella salvata.

## File Investimenti.txt (opzionale)
Se nella cartella che selezioni è presente un file il cui nome contiene
"investimenti" (es. `Investimenti.txt`), l'app lo riconosce automaticamente
e mostra nel menu la voce "Investimenti". Ogni riga deve essere un oggetto
JSON con questo formato:

```
{"Data": "12/08/26", "Fondo": "S&P 500", "Totale": "1245,6", "Rendimento%": "12,5", "Rendimento€": "145,6"}
```

Puoi avere più fondi semplicemente usando nomi diversi nel campo "Fondo":
l'app li riconosce automaticamente e li rende sfogliabili con lo swipe.
