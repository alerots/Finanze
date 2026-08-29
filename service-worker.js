// Incrementa questo numero ogni volta che aggiorni index.html o gli altri file,
// così il service worker capisce che deve scaricare la nuova versione.
const CACHE_VERSION = 'v19';
const CACHE_NAME = `finanze-app-cache-${CACHE_VERSION}`;

// File dell'app (locali) da mettere in cache per il funzionamento offline
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-192.png',
    './icon-maskable-512.png',
    './apple-touch-icon.png'
];

// Librerie esterne (CDN) usate dall'app: le mettiamo in cache così funzionano anche offline
const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0',
    'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // I file locali devono andare a buon fine
            await cache.addAll(APP_SHELL);
            // Le risorse esterne le proviamo una per una: se una fallisse
            // (es. offline durante l'installazione) non blocchiamo tutto il resto
            await Promise.allSettled(
                EXTERNAL_ASSETS.map((url) =>
                    fetch(url, { mode: 'cors' })
                        .then((res) => { if (res.ok) cache.put(url, res); })
                        .catch(() => {})
                )
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Solo richieste GET (i file locali dell'utente non passano mai dalla rete)
    if (req.method !== 'GET') return;

    // Per la pagina principale: prova prima la rete (per prendere aggiornamenti),
    // se non c'è connessione usa la copia salvata in cache
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
                    return res;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Per tutto il resto (librerie, icone): usa la cache se disponibile,
    // altrimenti scarica dalla rete e salvala per la prossima volta
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((res) => {
                if (res.ok) {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                }
                return res;
            }).catch(() => cached);
        })
    );
});
