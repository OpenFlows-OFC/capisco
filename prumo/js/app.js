/* =========================================================
   PRUMO · App de Estudos · ponto de entrada
   Liga o núcleo (js/nucleo, sem DOM) ao pack do caderno e à casca das
   telas (js/ui). Registra o service worker (offline) e avisa quando há
   versão nova, nunca durante a missão (c.12).
   ========================================================= */
import { criarNucleo, relogio } from './nucleo/nucleo.js';
import { pack } from '../conteudo/mat-fa.js';
import { criarApp, telaCheia } from './ui/casca.js';

const raiz = document.getElementById('app');
let app = null;
try {
  const nucleo = criarNucleo({ pack });
  app = criarApp(nucleo, raiz, { relogio });
  app.iniciar();
  window.__prumo = { nucleo, app, relogio };   // apoio aos testes de navegador (_dev/ui)
  document.documentElement.dataset.pronto = '1';
} catch (err) {
  console.error(err);
  raiz.innerHTML = '<main class="pu"><p class="rotulo">Prumo · App de Estudos</p><h1 class="titulo">O Prumo não abriu.</h1><p>Seu progresso continua salvo neste aparelho. Feche e abra de novo; se continuar, salve uma cópia em outro aparelho.</p><button type="button" class="botao" onclick="location.reload()">Abrir de novo</button></main>';
}

/* ---------------- service worker ---------------- */
if (app && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  const tinhaControle = !!navigator.serviceWorker.controller;
  let pediuAtualizar = false;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    if (!reg) return;
    const avisar = sw => app.novaVersao(() => { pediuAtualizar = true; sw.postMessage({ tipo: 'ATIVAR' }); });
    if (reg.waiting && tinhaControle) avisar(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => { if (sw.state === 'installed' && navigator.serviceWorker.controller) avisar(sw); });
    });
    // confere de novo quando o app volta ao primeiro plano (fora da missão)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !telaCheia(app.ctx.nucleo.estado())) reg.update().catch(() => {});
    });
  }).catch(err => console.warn('[prumo] service worker não registrado:', err));
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (pediuAtualizar && tinhaControle) location.reload();
  });
}
