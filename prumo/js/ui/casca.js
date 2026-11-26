/* =========================================================
   PRUMO · casca do app: roteador de telas, abas, faixas, folhas,
   histórico (botão Voltar do Android), foco, som e virada de data.
   A tela a desenhar vem sempre de nucleo.tela(); a casca só escolhe o
   módulo e liga os eventos. Convenções: js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, baixar, reduzido } from './dom.js';
import { acoes, folhas, registrar } from './registro.js';
import { simbolo, folha as moldura } from './componentes.js';
import * as Som from './som.js';
import { telaPrimeiroUso } from './primeiro-uso.js';
import { telaHoje } from './hoje.js';
import { telaMissao } from './missao.js';
import { telaPronto } from './pronto.js';
import { telaCaderno } from './caderno.js';
import { telaModos } from './modos.js';
import { telaPlano } from './plano.js';
import { telaPerfil } from './perfil.js';
import { telaEstudar } from './estudar.js';
import { telaProva } from './prova.js';

/** Estados da missão (tela cheia, sem abas). */
export const DENTRO = new Set(['pergunta', 'leitura', 'feedback', 'trecho', 'fimDaRodada', 'cards', 'trechoCard', 'fimDaMao']);
const TRECHOS = new Set(['trecho', 'trechoCard', 'provaTrecho']);
const PROVA_DENTRO = new Set(['provaPergunta', 'provaFeedback', 'provaTrecho']);
export const telaCheia = nome => DENTRO.has(nome) || nome === 'encerramento' || String(nome).startsWith('prova');

// ícones de traço (24 px, stroke 1.75, currentColor): sol nascendo, livro aberto, dado (modos), caderno de espiral, calendário, pessoa
const ICONES = {
  hoje: '<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 6v3M5.6 9.6l2 2M18.4 9.6l-2 2M3 14h1.5M19.5 14H21"/><path d="M9 21h6"/>',
  estudar: '<path d="M12 6.5C10.3 5.2 7.8 4.5 4 4.5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2v-13c-3.8 0-6.3.7-8 2z"/><path d="M12 6.5v13"/>',
  caderno: '<rect x="6" y="3" width="13" height="18" rx="1.5"/><path d="M4 7h3M4 11h3M4 15h3M4 19h3"/><path d="M10 8h6M10 12h6"/>',
  modos: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r=".9"/><circle cx="15.5" cy="8.5" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="8.5" cy="15.5" r=".9"/><circle cx="15.5" cy="15.5" r=".9"/>',
  plano: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2M16 14h.5M8 17.5h2M12 17.5h2"/>',
  perfil: '<circle cx="12" cy="8.5" r="3.75"/><path d="M4.5 20.5c.8-3.9 3.9-6 7.5-6s6.7 2.1 7.5 6"/>',
};
const ABAS = [{ id: 'hoje', rotulo: 'Hoje' }, { id: 'estudar', rotulo: 'Trilha' }, { id: 'modos', rotulo: 'Modos' }, { id: 'plano', rotulo: 'Plano' }, { id: 'perfil', rotulo: 'Perfil' }];
const ROTAS = { hoje: telaHoje, estudar: telaEstudar, caderno: telaCaderno, modos: telaModos, plano: telaPlano, perfil: telaPerfil, ajustes: telaPerfil };

/** Rota das abas pelo hash: #/caderno/erros → { aba: 'caderno', sub: 'erros', resto: [] }. */
export function rotaAtual() {
  const partes = (location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
  const aba = ROTAS[partes[0]] ? partes[0] : 'hoje';
  const propria = aba === partes[0];
  return { aba, sub: propria ? partes[1] || null : null, resto: propria ? partes.slice(2) : [] };
}

export function criarApp(nucleo, raiz, { relogio } = {}) {
  raiz.innerHTML = '<div id="faixas" class="faixas"></div><div id="tela"></div><div id="barra-raiz"></div><div id="aviso-raiz"></div><div id="folha-raiz"></div><div id="anuncio" class="so-leitor" aria-live="polite"></div>';
  const $faixas = raiz.querySelector('#faixas'), $tela = raiz.querySelector('#tela'), $barra = raiz.querySelector('#barra-raiz');
  const $aviso = raiz.querySelector('#aviso-raiz'), $folha = raiz.querySelector('#folha-raiz'), $anuncio = raiz.querySelector('#anuncio');
  // o aviso de versão nova só vale para quem já abriu o app com o service worker no controle: na primeira
  // visita, o sw.js assume a página (skipWaiting + claim) e não há versão nova nenhuma
  const tinhaControle = !!(typeof navigator !== 'undefined' && navigator.serviceWorker && navigator.serviceWorker.controller);

  const ui = {
    folha: null,        // { tipo, dados, origem } (folha aberta pela tela; não passa pelo núcleo)
    pu: null,           // estado local do Primeiro uso (primeiro-uso.js)
    chave: null,        // chave da tela desenhada (muda → rola ao topo e foca o título)
    aviso: null,        // aviso passageiro (bilhete perto da ação; some ao navegar ou em "Fechar")
    hashDesenhado: null, // hash da última tela desenhada (o hashchange não redesenha o que o popstate já desenhou)
    novaVersao: null,   // service worker novo esperando
    selecao: null,      // { chave, alt } alternativa marcada antes de "Responder"
    cancelar: [],       // limpezas da tela anterior (temporizadores, animações)
    memoria: {},        // memória curta entre desenhos (ex.: último card mostrado)
  };

  const ctx = {
    nucleo, ui, relogio, raiz,
    render: (t) => render(t),
    despachar: (ev) => despachar(ev),
    abrirFolha: (tipo, dados, origem) => abrirFolha(tipo, dados, origem),
    fecharFolha: () => fecharFolha(),
    redesenharFolha: () => renderFolha(),
    irPara: (hash) => { if (location.hash === hash) render(); else location.hash = hash; },
    avisar: (texto) => { ui.aviso = texto; renderFaixas(nucleo.tela().faixas); anunciar(texto); },
    anunciar: (texto) => anunciar(texto),
    baixar: (arq) => baixar(arq),
    reduzido,
    somLigado: () => somLigado(),
    tocar: (nome) => { if (somLigado()) Som.tocar(nome); },
    prepararSom: () => Som.preparar(),
  };

  function somLigado() { try { return !!nucleo.ajustes().som.valor; } catch (e) { return false; } }
  function anunciar(texto) { $anuncio.textContent = ''; setTimeout(() => { $anuncio.textContent = texto || ''; }, 30); }

  /* ---------------- foco ---------------- */
  function chaveDoFoco(el) {
    if (!el || el === document.body || !raiz.contains(el)) return null;
    const d = el.dataset || {}, q = s => (window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'));
    if (el.id) return `#${q(el.id)}`;
    if (el.hasAttribute && el.hasAttribute('data-foco-inicial')) return '[data-foco-inicial]';
    if (d.fig) return `[data-fig="${q(d.fig)}"]`;
    if (d.ev) return `[data-ev="${q(d.ev)}"]`;
    if (d.acao) return `[data-acao="${q(d.acao)}"]${d.arg != null ? `[data-arg="${q(d.arg)}"]` : ''}`;
    if (d.folha) return `[data-folha="${q(d.folha)}"]`;
    if (el.name && el.value) return `[name="${q(el.name)}"][value="${q(el.value)}"]`;
    if (el.getAttribute && el.getAttribute('href')) return `a[href="${q(el.getAttribute('href'))}"]`;
    return null;
  }
  function focarPorChave(k, onde = raiz) {
    if (!k) return false;
    try { const el = onde.querySelector(k); if (el && !el.closest('[inert]')) { el.focus({ preventScroll: true }); return document.activeElement === el; } } catch (e) { /* seletor inválido */ }
    return false;
  }

  /* ---------------- desenho ---------------- */
  // abas Hoje/Caderno/Plano como divisórias de fichário: a atual desce da folha (raio só embaixo)
  function htmlAbas(rota) {
    return h`<nav class="trilho" aria-label="Seções">
      <a class="trilho-marca" href="#/hoje" aria-label="Prumo, Hoje">${simbolo()}<span aria-hidden="true">prumo</span></a>
      ${cada(ABAS, a => h`<a class="aba" href="#/${a.id}" ${rota.aba === a.id || (a.id === 'perfil' && rota.aba === 'ajustes') || (a.id === 'modos' && rota.aba === 'caderno') ? cru('aria-current="page"') : ''}><span class="aba-icone" aria-hidden="true">${cru(`<svg viewBox="0 0 24 24" focusable="false">${ICONES[a.id]}</svg>`)}</span><span class="aba-rotulo">${a.rotulo}</span></a>`)}
    </nav>`;
  }
  function htmlFaixas(f, cheia) {
    const out = [];
    if (f && f.demo) out.push(h`<div class="faixa faixa-demo" role="status"><span class="faixa-texto"><strong>${f.demo.rotulo || 'Modo demonstração'}:</strong> ${f.demo.frase || f.demo.texto}</span><button type="button" class="link" data-acao="sairDemo">${f.demo.sair}</button></div>`);
    if (f && f.falhaSalvar) out.push(h`<div class="faixa" role="alert"><span class="faixa-texto">${f.falhaSalvar.texto}</span><button type="button" class="link" data-acao="salvarCopia">${f.falhaSalvar.acao}</button></div>`);
    if (f && f.carga) out.push(h`<div class="faixa" role="status"><span class="faixa-texto">${f.carga}</span></div>`);
    if (ui.novaVersao && !cheia) out.push(h`<div class="faixa" role="status"><span class="faixa-texto">Há uma versão nova do Prumo. Ela entra quando você fechar e abrir o app. Seu progresso não muda.</span><button type="button" class="link" data-acao="atualizarApp">Atualizar agora</button></div>`);
    return out.join('');
  }
  function renderFaixas(f, cheia = telaCheia(nucleo.estado())) {
    const fx = htmlFaixas(f, cheia);
    $faixas.innerHTML = fx;
    // aviso passageiro ("Cópia salva", "Plano guardado"): um bilhete fixo perto da ação, não no topo do documento
    $aviso.innerHTML = ui.aviso ? String(h`<div class="bilhete" role="status"><span class="bilhete-texto">${ui.aviso}</span><button type="button" class="link" data-acao="fecharAviso">Fechar</button></div>`) : '';
    raiz.classList.toggle('sem-faixa', !fx);
    raiz.classList.toggle('com-faixa', !!fx);
  }

  function render(t) {
    t = t || nucleo.tela();
    ui.cancelar.forEach(f => { try { f(); } catch (e) { /* nada */ } });
    ui.cancelar = [];
    const nome = t.nome, cheia = telaCheia(nome), rota = rotaAtual();
    let s;
    try {
      if (nome === 'primeiroUso') s = telaPrimeiroUso(ctx, t.vm);
      else if (nome === 'encerramento') s = telaPronto(ctx, t.vm, t);
      else if (nome.startsWith('prova')) s = telaProva(ctx, t);
      else if (cheia) s = telaMissao(ctx, t);
      else s = ROTAS[rota.aba](ctx, t, rota);
    } catch (err) {
      console.error(err);
      s = { chave: 'erro', html: h`<main class="pu"><h1 class="titulo" tabindex="-1" data-foco-inicial>Esta tela não abriu.</h1><p>Seu progresso continua salvo neste aparelho. Feche e abra o app de novo.</p><button type="button" class="botao botao-largo" data-acao="recarregar">Abrir de novo</button></main>` };
    }
    const comAbas = !cheia && nome !== 'primeiroUso' && !s.semAbas;   // semAbas: tela de jogo da aba (Contra o relógio)
    const ativo = document.activeElement, chaveFoco = chaveDoFoco(ativo);
    const mudou = s.chave !== ui.chave;
    ui.chave = s.chave;
    const y = window.scrollY;
    ui.hashDesenhado = location.hash;

    renderFaixas(t.faixas, cheia);
    $tela.innerHTML = String(comAbas
      ? h`<div class="casca com-abas">${htmlAbas(rota)}<main class="conteudo" id="principal">${s.html}</main></div>`
      : h`<div class="casca">${s.html}</div>`);
    $barra.innerHTML = s.barra ? String(h`<div class="barra"><div class="barra-dentro">${s.barra}</div></div>`) : '';
    raiz.classList.toggle('com-barra', !!s.barra);
    document.body.classList.toggle('modo-missao', cheia || nome === 'primeiroUso' || !!s.semAbas);
    document.title = s.titulo ? `${s.titulo} – Prumo` : 'Prumo · App de Estudos';

    if (mudou) {
      window.scrollTo(0, 0);
      if (!ui.folha) { const alvo = raiz.querySelector('[data-foco-inicial]'); if (alvo) alvo.focus({ preventScroll: true }); }
    } else {
      window.scrollTo(0, y);
      if (!ui.folha && !focarPorChave(chaveFoco)) { const alt = raiz.querySelector('[data-foco-apos]'); if (alt) alt.focus({ preventScroll: true }); }
    }
    renderFolha(t);
    if (s.depois) {
      const c = s.depois(raiz, { mudou });
      if (typeof c === 'function') ui.cancelar.push(c);
    }
  }

  /* ---------------- folhas (da tela; não passam pelo núcleo) ---------------- */
  function renderFolha(t) {
    const fechada = !ui.folha;
    if (!fechada && !folhas[ui.folha.tipo]) ui.folha = null;
    if (!ui.folha) {
      $folha.innerHTML = '';
      $tela.removeAttribute('inert'); $barra.removeAttribute('inert'); $faixas.removeAttribute('inert'); $aviso.removeAttribute('inert');
      document.documentElement.style.overflow = '';
      return;
    }
    let r = null;
    try { r = folhas[ui.folha.tipo](ctx, ui.folha.dados, t || nucleo.tela()); } catch (e) { console.error(e); }
    if (!r) { ui.folha = null; return renderFolha(t); }
    const corpoY = ($folha.querySelector('.folha-corpo') || {}).scrollTop || 0;
    const focoK = chaveDoFoco(document.activeElement);
    $folha.innerHTML = String(moldura({ id: `folha-${ui.folha.tipo}`, rotulo: r.rotulo, corpo: r.corpo, pe: r.pe, alta: r.alta, fechar: r.fechar !== false }));
    $tela.setAttribute('inert', ''); $barra.setAttribute('inert', ''); $faixas.setAttribute('inert', ''); $aviso.setAttribute('inert', '');
    document.documentElement.style.overflow = 'hidden';
    const corpo = $folha.querySelector('.folha-corpo');
    if (ui.folha.focou) { if (corpo) corpo.scrollTop = corpoY; if (!focarPorChave(focoK, $folha)) { const tt = $folha.querySelector('[data-foco-folha]'); if (tt) tt.focus({ preventScroll: true }); } }
    else { ui.folha.focou = true; const tt = $folha.querySelector('[data-foco-folha]'); if (tt) tt.focus({ preventScroll: true }); }
    if (r.depois) r.depois($folha);
  }
  function abrirFolha(tipo, dados, origem) {
    ui.folha = { tipo, dados: dados === undefined ? null : dados, origem: chaveDoFoco(origem || document.activeElement), focou: false };
    if (telaCheia(nucleo.estado()) || nucleo.estado() === 'primeiroUso') { /* o Voltar fecha a folha */ }
    history.pushState(Object.assign({}, history.state || {}, { folha: tipo }), '', location.hash || '#/hoje');
    renderFolha();
  }
  function fecharFolha({ doHistorico = false } = {}) {
    if (!ui.folha) return;
    const o = ui.folha.origem;
    ui.folha = null;
    renderFolha();
    if (o) focarPorChave(o);
    if (!doHistorico && history.state && history.state.folha) { ui.ignorarPop = true; history.back(); }
  }

  /* ---------------- eventos ---------------- */
  function despachar(ev) {
    const antes = nucleo.estado();
    let ok = false;
    try { ok = nucleo.despachar(ev); }
    catch (err) { console.error(err); ui.aviso = 'Não deu para registrar agora. Nada foi alterado; tente de novo.'; }
    if (ok && ui.folha) { ui.folha = null; if (history.state && history.state.folha) history.replaceState(Object.assign({}, history.state, { folha: null }), '', location.hash); }
    const t = nucleo.tela();
    if (ok) aposTransicao(antes, t);
    render(t);
    return ok;
  }
  function aposTransicao(antes, t) {
    const depois = t.nome;
    // a Prova vencida não manda vm.som: o troféu novo toca 'trofeu' na chegada ao resultado (só na transição, não ao recarregar)
    const som = t.vm && (t.vm.som || (depois === 'provaResultado' && t.vm.trofeu && t.vm.trofeu.novo ? 'trofeu' : null));
    if (depois !== antes && !TRECHOS.has(antes) && som && somLigado()) Som.tocar(som);
    if (!telaCheia(antes) && telaCheia(depois)) { ui.selecao = null; history.pushState({ guarda: 1 }, '', '#/missao'); }
    else if (telaCheia(antes) && !telaCheia(depois)) history.replaceState(null, '', '#/hoje');
    else if (antes === 'primeiroUso' && depois !== 'primeiroUso') history.replaceState(null, '', '#/hoje');
  }

  raiz.addEventListener('click', e => {
    const el = e.target.closest('[data-folha],[data-acao],[data-ev]');
    if (!el || !raiz.contains(el)) return;
    if (el.dataset.folha) { e.preventDefault(); abrirFolha(el.dataset.folha, el.dataset.arg, el); return; }
    if (el.dataset.acao) {
      const f = acoes[el.dataset.acao];
      if (f) f(ctx, el, e);
      return;
    }
    if (el.dataset.ev) {
      e.preventDefault();
      if (el.getAttribute('aria-disabled') === 'true' || el.disabled) return;
      despachar({ tipo: el.dataset.ev });
    }
  });
  raiz.addEventListener('change', e => {
    const el = e.target.closest('[data-mudar]');
    if (el && acoes[el.dataset.mudar]) acoes[el.dataset.mudar](ctx, el, e);
  });
  raiz.addEventListener('input', e => {
    const el = e.target.closest('[data-digitar]');
    if (el && acoes[el.dataset.digitar]) acoes[el.dataset.digitar](ctx, el, e);
  });
  raiz.addEventListener('submit', e => {
    e.preventDefault();
    const el = e.target.closest('[data-enviar]');
    if (el && acoes[el.dataset.enviar]) acoes[el.dataset.enviar](ctx, el, e);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && ui.folha) { e.preventDefault(); fecharFolha(); }
  });
  // iPhone: o áudio nasce dentro de um gesto
  document.addEventListener('pointerdown', () => { if (somLigado()) Som.preparar(); }, { passive: true });

  // Voltar do sistema (b.2): folha → fecha; trecho → VOLTAR; missão → folha "Encerrar"; Primeiro uso → pergunta anterior
  window.addEventListener('popstate', e => {
    if (ui.ignorarPop) { ui.ignorarPop = false; return; }   // o próprio app voltou uma entrada (folha fechada por botão)
    const nome = nucleo.estado();
    if (ui.folha) { fecharFolha({ doHistorico: true }); if (telaCheia(nome) && !(history.state && history.state.guarda)) history.pushState({ guarda: 1 }, '', '#/missao'); return; }
    if (telaCheia(nome)) {
      history.pushState({ guarda: 1 }, '', '#/missao');
      if (TRECHOS.has(nome)) { despachar({ tipo: 'VOLTAR' }); return; }
      if (nome === 'encerramento' || nome === 'provaResultado') { despachar({ tipo: 'FECHAR' }); return; }
      if (nome === 'prova') { despachar({ tipo: 'AGORA_NAO' }); return; }
      if (PROVA_DENTRO.has(nome)) { if (folhas.encerrarProva) abrirFolha('encerrarProva'); return; }
      abrirFolha('encerrar');
      return;
    }
    if (nome === 'primeiroUso') { if (ui.pu) ui.pu.onb = (e.state && e.state.pu) || 0; render(); return; }
    ui.aviso = null;   // navegou: o aviso passageiro fica para trás
    render();
  });
  // um clique numa aba dispara popstate e hashchange: desenha uma vez só (o 2º desenho tirava o foco do título)
  window.addEventListener('hashchange', () => {
    if (telaCheia(nucleo.estado())) return;
    if (ui.folha) ui.folha = null;
    else if (ui.hashDesenhado === location.hash) return;
    ui.aviso = null;
    render();
  });

  // Virada de data (b.2): ao voltar ao app e à meia-noite
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && nucleo.conferirData()) render(); });
  function agendarMeiaNoite() {
    const prox = new Date(); prox.setHours(24, 0, 2, 0);
    setTimeout(() => { if (nucleo.conferirData()) render(); agendarMeiaNoite(); }, Math.max(1000, prox - Date.now()));
  }

  /* ---------------- ações comuns ---------------- */
  registrar({
    acoes: {
      sairDemo(c) { c.nucleo.sairDaDemonstracao(); ui.aviso = null; history.replaceState(null, '', c.nucleo.estado() === 'primeiroUso' ? '#/' : '#/hoje'); render(); },
      salvarCopia(c) {
        const arq = c.nucleo.copia();
        const ok = c.baixar(arq);
        c.avisar(ok ? `Cópia salva: ${arq.nome}.` : 'O aparelho não deixou baixar o arquivo. Em Ajustes, use "Copiar dados".');
        render();
      },
      fecharAviso() { ui.aviso = null; render(); },
      atualizarApp() { if (ui.novaVersao) ui.novaVersao(); },
      recarregar() { location.reload(); },
      fundoFolha(c, el, e) { if (e.target === el) fecharFolha(); },
      fecharFolha() { fecharFolha(); },
    },
  });

  return {
    iniciar() {
      const nome = nucleo.estado();
      if (telaCheia(nome)) {
        if (!(history.state && history.state.guarda)) { history.replaceState(null, '', '#/hoje'); history.pushState({ guarda: 1 }, '', '#/missao'); }
      } else if (location.hash === '#/missao') history.replaceState(null, '', '#/hoje');
      render();
      agendarMeiaNoite();
    },
    render: () => render(),
    novaVersao(aplicar) { if (!tinhaControle) return; ui.novaVersao = aplicar; renderFaixas(nucleo.tela().faixas); },
    ctx,
  };
}
