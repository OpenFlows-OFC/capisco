/* CAPISCO · service worker: guarda o jogo no aparelho para funcionar offline (persistência local, TCC 5.6) */
const VERSAO = 'capisco-v4';
const ARQUIVOS = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icone.svg",
 "apple-touch-icon.png",
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
// só guarda respostas válidas (um 404 ou erro do servidor nunca vira a versão offline)
const guardar = (r, res) => { if (res && (res.ok || (res.type === 'opaque' && r.url.includes('fonts.g')))) { const cp = res.clone(); caches.open(VERSAO).then(c => c.put(r, cp)); } return res; };
// rede com limite de 3 s: em conexão ruim o jogo abre do cache em vez de ficar em branco
const comLimite = (p, ms) => new Promise((ok, erro) => { const t = setTimeout(() => erro(new Error('lento')), ms); p.then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); erro(e); }); });
// rede primeiro para o código (atualiza quando online), cache primeiro para imagens e fontes
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith('http')) return;
  const img = /[.](webp|png|svg|woff2?)([?]|$)/.test(r.url) || r.url.includes('fonts.g');
  if (img) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => guardar(r, res))));
  } else {
    const rede = fetch(r).then(res => guardar(r, res));
    e.respondWith(comLimite(rede, 3000).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || rede)));
  }
});
// tocar no aviso abre (ou foca) o jogo direto na aba Revisar
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL('./#/revisar', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.startsWith(self.registration.scope));
    if (c) return c.focus().then(w => (w && 'navigate' in w ? w.navigate(alvo) : w));
    return self.clients.openWindow(alvo);
  }));
});
