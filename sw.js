/* ============================================================
   SERVICE WORKER — app er offline cache
   Kaj: site er file gula phone/browser e cache kore rakhe,
   jate app druto khole ar internet na thakleo chole.
   Notun file asle background e nije update hoye jay.
   Database (Firebase) er call kokhono cache hoy na.
   ============================================================ */

const CACHE = 'wtg-v24';

/* Agey thekei cache kore rakha mul file gula */

const CORE = [
  './',
  'index.html', 'world.html', 'map.html', 'quiz.html',
  'places.html', 'news.html','help.html', 'admin.html',
  'app.js', 'data-world.js', 'style.css', 'firebase-config.js',
  'bootstrap.min.css', 'd3.min.js', 'topojson-client.min.js',
  'jspdf.umd.min.js',
  'banner-explore.svg', 'banner-map.svg', 'banner-quiz.svg',
  'banner-places.svg', 'banner-news.svg', 'world-banner.svg',
  'icon-192.png', 'icon-512.png', 'manifest.webmanifest',
  'boundaries/boundaries-index.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Database ar khobor er live call — kokhono cache na, soja network */

  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('mymemory.translated.net') ||
      url.hostname.endsWith('firebaseio.com') ||
      url.hostname.includes('allorigins') ||
      url.hostname.includes('codetabs') ||
      url.hostname.includes('rss2json') ||
      url.hostname.includes('gdeltproject')) return;

  /* Nijer file: agey cache theke dekhay (druto khole),
     pasapasi background e notun version ene rakhe */

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(hit => {
        const fresh = fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  /* Firebase er script (gstatic) — cache-first, egula bodlay na */

  if (url.hostname === 'www.gstatic.com') {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
