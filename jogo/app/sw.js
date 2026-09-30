/* CAPISCO · service worker: guarda o jogo no aparelho para funcionar offline (persistência local, TCC 5.6) */
const VERSAO = 'capisco-v3';
const ARQUIVOS = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icone.svg",
 "icone-192.png",
 "icone-512.png",
 "icone-maskable.png",
 "../ui/jogo.css",
 "../ui/icones.js",
 "../ui/base.js",
 "../ui/telas.js",
 "../ui/partida.js",
 "../core/motor.js",
 "../core/estado.js",
 "../core/conteudo/bio.js",
 "../core/conteudo/qui.js",
 "../core/conteudo/fis.js",
 "../core/conteudo/mat.js",
 "../core/conteudo/his.js",
 "../core/conteudo/geo.js",
 "../core/conteudo/por.js",
 "../core/conteudo/red.js",
 "../../tokens.css",
 "../../components.css",
 "../../capi.js",
 "../../marca/wordmark.js",
 "../../capi3d/sm/capi_bio_comemora.webp",
 "../../capi3d/sm/capi_bio_dormindo.webp",
 "../../capi3d/sm/capi_bio_feliz.webp",
 "../../capi3d/sm/capi_bio_neutra.webp",
 "../../capi3d/sm/capi_bio_pensando.webp",
 "../../capi3d/sm/capi_bio_quase.webp",
 "../../capi3d/sm/capi_fis_comemora.webp",
 "../../capi3d/sm/capi_fis_dormindo.webp",
 "../../capi3d/sm/capi_fis_feliz.webp",
 "../../capi3d/sm/capi_fis_neutra.webp",
 "../../capi3d/sm/capi_fis_pensando.webp",
 "../../capi3d/sm/capi_fis_quase.webp",
 "../../capi3d/sm/capi_geo_comemora.webp",
 "../../capi3d/sm/capi_geo_dormindo.webp",
 "../../capi3d/sm/capi_geo_feliz.webp",
 "../../capi3d/sm/capi_geo_neutra.webp",
 "../../capi3d/sm/capi_geo_pensando.webp",
 "../../capi3d/sm/capi_geo_quase.webp",
 "../../capi3d/sm/capi_his_comemora.webp",
 "../../capi3d/sm/capi_his_dormindo.webp",
 "../../capi3d/sm/capi_his_feliz.webp",
 "../../capi3d/sm/capi_his_neutra.webp",
 "../../capi3d/sm/capi_his_pensando.webp",
 "../../capi3d/sm/capi_his_quase.webp",
 "../../capi3d/sm/capi_mat_comemora.webp",
 "../../capi3d/sm/capi_mat_dormindo.webp",
 "../../capi3d/sm/capi_mat_feliz.webp",
 "../../capi3d/sm/capi_mat_neutra.webp",
 "../../capi3d/sm/capi_mat_pensando.webp",
 "../../capi3d/sm/capi_mat_quase.webp",
 "../../capi3d/sm/capi_nenhuma_comemora.webp",
 "../../capi3d/sm/capi_nenhuma_dormindo.webp",
 "../../capi3d/sm/capi_nenhuma_feliz.webp",
 "../../capi3d/sm/capi_nenhuma_neutra.webp",
 "../../capi3d/sm/capi_nenhuma_pensando.webp",
 "../../capi3d/sm/capi_nenhuma_quase.webp",
 "../../capi3d/sm/capi_por_comemora.webp",
 "../../capi3d/sm/capi_por_dormindo.webp",
 "../../capi3d/sm/capi_por_feliz.webp",
 "../../capi3d/sm/capi_por_neutra.webp",
 "../../capi3d/sm/capi_por_pensando.webp",
 "../../capi3d/sm/capi_por_quase.webp",
 "../../capi3d/sm/capi_qui_comemora.webp",
 "../../capi3d/sm/capi_qui_dormindo.webp",
 "../../capi3d/sm/capi_qui_feliz.webp",
 "../../capi3d/sm/capi_qui_neutra.webp",
 "../../capi3d/sm/capi_qui_pensando.webp",
 "../../capi3d/sm/capi_qui_quase.webp",
 "../../capi3d/sm/capi_red_comemora.webp",
 "../../capi3d/sm/capi_red_dormindo.webp",
 "../../capi3d/sm/capi_red_feliz.webp",
 "../../capi3d/sm/capi_red_neutra.webp",
 "../../capi3d/sm/capi_red_pensando.webp",
 "../../capi3d/sm/capi_red_quase.webp"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => Promise.all(ARQUIVOS.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// rede primeiro para o código (atualiza quando online), cache primeiro para imagens e fontes
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const img = /[.](webp|png|svg|woff2?)([?]|$)/.test(r.url) || r.url.includes('fonts.g');
  if (img) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(VERSAO).then(c => c.put(r, cp)); return res; })));
  } else {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(VERSAO).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r, { ignoreSearch: true })));
  }
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./#/revisoes')));
});
