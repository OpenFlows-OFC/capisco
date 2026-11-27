/* =========================================================
   PRUMO · service worker (offline e instalação)
   Mesma origem do app antigo (openflows-ofc.github.io/capisco/): por isso os
   caches usam o prefixo exclusivo "prumo-pwa-", e o activate só apaga caches
   com esse prefixo. Suba VERSAO a cada publicação (prumo-pwa-v2, v3…).
   cache.addAll com a lista explícita: se um arquivo faltar, a instalação
   falha de forma visível (nada de engolir 404).
   A lista ARQUIVOS é gerada por _dev/ui/gera_precache.mjs (não edite à mão).
   ========================================================= */
const VERSAO = 'prumo-pwa-v17.4';
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
  'fontes/atkinson-hyperlegible-mono-500-latin-ext.woff2',
  'fontes/atkinson-hyperlegible-mono-500-latin.woff2',
  'fontes/atkinson-hyperlegible-next-400-latin-ext.woff2',
  'fontes/atkinson-hyperlegible-next-400-latin.woff2',
  'fontes/atkinson-hyperlegible-next-600-latin-ext.woff2',
  'fontes/atkinson-hyperlegible-next-600-latin.woff2',
  'fontes/fontes.css',
  'fontes/gabarito-700-latin-ext.woff2',
  'fontes/gabarito-700-latin.woff2',
  'fontes/gabarito-800-latin-ext.woff2',
  'fontes/gabarito-800-latin.woff2',
  'js/app.js',
  'js/ui/ajustes.js',
  'js/ui/caderno.js',
  'js/ui/casca.js',
  'js/ui/componentes.js',
  'js/ui/dom.js',
  'js/ui/estudar.js',
  'js/ui/fases.js',
  'js/ui/hoje.js',
  'js/ui/missao.js',
  'js/ui/modos.js',
  'js/ui/perfil.js',
  'js/ui/plano.js',
  'js/ui/primeiro-uso.js',
  'js/ui/pronto.js',
  'js/ui/prova.js',
  'js/ui/registro.js',
  'js/ui/relogio.js',
  'js/ui/som.js',
  'js/nucleo/cards.js',
  'js/nucleo/estado.js',
  'js/nucleo/exemplo.js',
  'js/nucleo/missao.js',
  'js/nucleo/motor.js',
  'js/nucleo/nucleo.js',
  'js/nucleo/pack.js',
  'js/nucleo/plano.js',
  'js/nucleo/pratica.js',
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
  'conteudo/praticas/lc-argumentacao.js',
  'conteudo/praticas/lc-argumentacao.teoria.js',
  'conteudo/praticas/lc-interpretacao.js',
  'conteudo/praticas/lc-interpretacao.teoria.js',
  'conteudo/praticas/lc-variacao.js',
  'conteudo/praticas/lc-variacao.teoria.js',
  'conteudo/praticas/mat-estatistica.js',
  'conteudo/praticas/mat-estatistica.teoria.js',
  'conteudo/praticas/mat-geometria.js',
  'conteudo/praticas/mat-geometria.teoria.js',
  'conteudo/praticas/mat-porcentagem.js',
  'conteudo/praticas/mat-porcentagem.teoria.js',
  'conteudo/praticas/mat-proporcao.js',
  'conteudo/praticas/mat-proporcao.teoria.js',
  'conteudo/praticas/img/ap-congresso.jpg',
  'conteudo/praticas/img/ap-duas-imprensas.jpg',
  'conteudo/praticas/img/ap-esmaltodont-1929.jpg',
  'conteudo/praticas/img/ap-eucalol-1935.jpg',
  'conteudo/praticas/img/ap-favo.jpg',
  'conteudo/praticas/img/ap-gazeta-1808.jpg',
  'conteudo/praticas/img/ap-ipca-2015-2025.svg',
  'conteudo/praticas/img/ap-ipca-2021-2022.svg',
  'conteudo/praticas/img/ap-kolynos-1942.jpg',
  'conteudo/praticas/img/ap-planta-quarto.svg',
  'conteudo/praticas/img/ap-vitruviano.jpg',
  'conteudo/praticas/img/enem-2020-145-1.png',
  'conteudo/praticas/img/enem-2021-153-1.jpg',
  'conteudo/praticas/img/enem-2022-138-1.png',
  'conteudo/praticas/img/enem-2022-149-1.png',
  'conteudo/praticas/img/enem-2022-171-1.png',
  'conteudo/praticas/img/enem-2023-136-1.png',
  'conteudo/praticas/img/enem-2023-140-1.png',
  'conteudo/praticas/img/enem-2023-165-1.png',
];
// </precache>

// As fontes (Gabarito, Atkinson Hyperlegible Next e Mono, woff2 em fontes/) vêm no próprio app e entram no precache:
// o Prumo não depende de nenhum servidor externo.

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => {
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
