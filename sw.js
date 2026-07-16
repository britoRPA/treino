/* Ferro — service worker
   Regra: o CASCO (index.html) vai pela REDE primeiro, com o cache como rede de
   segurança. Assim, publicar um index.html novo chega no aparelho sem depender
   de o sw.js ter mudado. O resto (ícones, manifest) fica cache-first, porque
   quase nunca muda.
   Ao publicar uma versão: suba o V aqui E o APP_VERSION no index.html. */
const V = '1.5.0';
const C = 'ferro-' + V;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // sem skipWaiting: o novo worker espera o usuário tocar em "Atualizar"
  e.waitUntil(caches.open(C).then(c => c.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'skip') self.skipWaiting();
  if (d.type === 'version' && e.ports && e.ports[0]) e.ports[0].postMessage({ v: V });
});

const isShell = req => {
  if (req.mode === 'navigate') return true;
  const p = new URL(req.url).pathname;
  return p.endsWith('/') || p.endsWith('/index.html');
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (isShell(req)) {
    // rede primeiro: é assim que a versão nova te alcança
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(C).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(C).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
