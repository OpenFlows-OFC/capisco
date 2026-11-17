/* =========================================================
   PRUMO · service worker (offline e instalação)
   Mesma origem do app antigo (openflows-ofc.github.io/capisco/): por isso os
   caches usam o prefixo exclusivo "prumo-pwa-", e o activate só apaga caches
   com esse prefixo. Suba VERSAO a cada publicação (prumo-pwa-v2, v3…).
   cache.addAll com a lista explícita: se um arquivo faltar, a instalação
   falha de forma visível (nada de engolir 404).
   A lista ARQUIVOS é gerada por _dev/ui/gera_precache.mjs (não edite à mão).
   ========================================================= */
const VERSAO = 'prumo-pwa-v2';
const FONTES = 'prumo-pwa-fontes-v2';   // fontes do design system (Gabarito, Atkinson Hyperlegible Next e Mono); o activate apaga o cache antigo
const PREFIXO = 'prumo-pwa-';
// <precache>
const ARQUIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'icone-192.png',
  'icone-512.png',
  'icone-maskable.png',
  'icone.svg',
  'marca/prumo-logo-negativo.svg',
  'marca/prumo-logo.svg',
  'marca/prumo-simbolo-negativo.svg',
  'marca/prumo-simbolo.svg',
  'css/prumo.css',
  'js/app.js',
  'js/ui/ajustes.js',
  'js/ui/caderno.js',
  'js/ui/casca.js',
  'js/ui/componentes.js',
  'js/ui/dom.js',
  'js/ui/hoje.js',
  'js/ui/missao.js',
  'js/ui/plano.js',
  'js/ui/primeiro-uso.js',
  'js/ui/pronto.js',
  'js/ui/prova.js',
  'js/ui/registro.js',
  'js/ui/som.js',
  'js/nucleo/cards.js',
  'js/nucleo/estado.js',
  'js/nucleo/exemplo.js',
  'js/nucleo/missao.js',
  'js/nucleo/motor.js',
  'js/nucleo/nucleo.js',
  'js/nucleo/pack.js',
  'js/nucleo/plano.js',
  'js/nucleo/prova.js',
  'js/nucleo/recomendador.js',
  'js/nucleo/relogio.js',
  'conteudo/gerador.js',
  'conteudo/mat-fa-c12-enem.js',
  'conteudo/mat-fa-c12.js',
  'conteudo/mat-fa-c34.js',
  'conteudo/mat-fa.js',
  'conteudo/img/enem-2019-143.png',
  'conteudo/img/enem-2019-179.png',
  'conteudo/img/enem-2020-164.png',
  'conteudo/img/enem-2020-175-a.png',
  'conteudo/img/enem-2020-175-b.png',
  'conteudo/img/enem-2020-175-c.png',
  'conteudo/img/enem-2020-175-d.png',
  'conteudo/img/enem-2020-175-e.png',
  'conteudo/img/enem-2020-175.png',
  'conteudo/img/enem-2021-164.png',
  'conteudo/img/enem-2023-151.png',
  'conteudo/img/enem-2023-156.png',
  'conteudo/img/mat-fa-p3-s4.svg',
  'conteudo/img/mat-fa-p4-s2.svg',
  'conteudo/img/mat-fa-p4-s4.svg',
];
// </precache>

// A folha de fontes do index.html (Gabarito 700/800, Atkinson Hyperlegible Next 400/600, Atkinson Hyperlegible Mono 500). Na primeira visita o service worker
// ainda não controla a página, então as fontes são buscadas já na instalação (sem derrubar a instalação
// se o Google não responder: aí elas entram em tempo de execução, na visita seguinte).
const FONTES_CSS = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@500&family=Atkinson+Hyperlegible+Next:wght@400;600&family=Gabarito:wght@700;800&display=swap';
async function guardarFontes() {
  const c = await caches.open(FONTES);
  if (await c.match(FONTES_CSS, { ignoreVary: true })) return;
  const res = await fetch(FONTES_CSS, { mode: 'cors', credentials: 'omit' });
  if (!res.ok) return;
  const css = await res.clone().text();
  await c.put(FONTES_CSS, res);
  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map(m => m[1]))].slice(0, 24);
  await Promise.all(urls.map(u => fetch(u, { mode: 'cors', credentials: 'omit' }).then(r => (r.ok ? c.put(u, r) : null)).catch(() => null)));
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => guardarFontes().catch(() => null)).then(() => {
    // primeira instalação: entra já, para o app abrir offline desde a primeira visita.
    // versão nova: espera o aluno fechar e abrir (ou tocar "Atualizar agora", fora da missão).
    if (!self.registration.active) return self.skipWaiting();
  }));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIXO) && k !== VERSAO && k !== FONTES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (e.data && e.data.tipo === 'ATIVAR') self.skipWaiting();
});

// Fontes do Google: guardadas em tempo de execução (Gabarito, Atkinson Hyperlegible Next e Mono).
async function fonte(req) {
  const c = await caches.open(FONTES);
  const m = await c.match(req, { ignoreVary: true });
  if (m) return m;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
    return res;
  } catch (err) {
    return Response.error();
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(fonte(req)); return; }
  if (url.origin !== self.location.origin) return;
  const escopo = new URL(self.registration.scope);
  if (!url.pathname.startsWith(escopo.pathname)) return;
  if (req.mode === 'navigate') {
    // navegação offline: a casca do app (index.html) vem do cache
    e.respondWith(caches.open(VERSAO)
      .then(c => c.match(new URL('index.html', escopo).href))
      .then(m => m || fetch(req))
      .catch(() => caches.match(new URL('index.html', escopo).href)));
    return;
  }
  e.respondWith(caches.open(VERSAO)
    .then(c => c.match(req, { ignoreSearch: true }))
    .then(m => m || fetch(req)));
});
