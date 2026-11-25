/* =========================================================
   PRUMO · Missão em tela cheia (c.3) e mão de cards (Decisão 1)
   Estados do núcleo: pergunta · leitura · feedback · trecho · fimDaRodada ·
   cards · trechoCard · fimDaMao. A única barra fixa é a do botão de ação
   (Responder, Continuar, Seguir, Virar, Lembrei/Ainda não). "Terminei de ler"
   fica no fluxo do texto, para o teclado não cobri-lo. A folha "Encerrar"
   é da tela e manda PAUSAR ou CONFIRMAR_ENCERRAR.
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { registrar } from './registro.js';
import {
  topo, linhaCombo, enunciado, alternativasPergunta, alternativasFeedback, rodape, blocos, nivel,
  botaoContinuar, animarContinuar, prepararFiguras, ampliarFigura, questaoCab, teoria, acompanharSumario, idDaAncora,
} from './componentes.js';

const CADERNO = new Set(['enem', 'equipe']);   // aí o cabeçalho "QUESTÃO 162" já é o título da tela

const chaveSel = vm => `${vm.item.id}@${vm.topo.passo.n}`;
const primeiraVez = (ctx, chave) => ctx.ui.chave !== chave;

/**
 * Trilha do tópico de prática (Aquecer → Apostila → Questões → Visto), em todo estado da missão do tópico.
 * A fase e o "estudo por conta própria" vêm do núcleo (vm.fase, vm.livre); enquanto um estado não os traz,
 * saem da própria missão (tipo 'topico' e a última resposta), sem calcular regra nenhuma.
 */
export function trilhaDe(ctx, vm, nome) {
  const m = ctx.nucleo.st && ctx.nucleo.st.missao;
  const livre = vm && typeof vm.livre === 'boolean' ? vm.livre : !!(m && m.livre);
  let fase;
  if (vm && Object.prototype.hasOwnProperty.call(vm, 'fase')) fase = vm.fase;
  else if (!m || m.tipo !== 'topico') fase = null;
  else if (nome === 'encerramento') fase = 'fim';
  else if (nome === 'fimDaRodada') fase = 'questoes';
  else {
    const u = m.ultima;
    // a resposta do aquecimento sai depois da apostila: a etapa já é Questões, como no núcleo (_feedbackPratica)
    fase = u && u.fonte === 'pratica' ? (!u.revela && u.t === 'pre' ? 'aquecer' : 'questoes') : null;
  }
  return fase ? { fase, livre } : null;
}

function figuras(ctx, raiz, item) {
  prepararFiguras(raiz.querySelector('#principal') || raiz, {
    textoFalha: (item && item.imagemFalhou) || undefined,
    aoAmpliar: el => ampliarFigura(ctx, el),
  });
}

/* ---------------- pergunta (c.3a, c.3c, c.3d, c.3d', c.3h) ---------------- */
function cabecaPergunta(vm, { foco = true } = {}) {
  const doCaderno = CADERNO.has(vm.tipo) && vm.item.cabecalho;
  const sub = vm.subrotulo && vm.subrotulo !== vm.item.rodape && !(doCaderno && vm.tipo === 'enem') ? vm.subrotulo : null;
  if (doCaderno) {
    return h`<div class="pergunta-cabeca"><span class="so-leitor">${vm.rotulo}. </span>${questaoCab(vm.item, { comoTitulo: foco })}${sub ? h`<p class="sub">${sub}</p>` : ''}</div>`;
  }
  return h`<div class="pergunta-cabeca">
    ${foco ? h`<h1 class="passo-rotulo" tabindex="-1" data-foco-inicial>${vm.rotulo}</h1>` : h`<p class="passo-rotulo">${vm.rotulo}</p>`}
    ${sub ? h`<p class="sub">${sub}</p>` : ''}
    ${questaoCab(vm.item)}
  </div>`;
}

function pergunta(ctx, vm) {
  const k = chaveSel(vm);
  const marcada = ctx.ui.selecao && ctx.ui.selecao.chave === k ? ctx.ui.selecao.alt : null;
  return {
    chave: `pergunta:${k}`,
    titulo: vm.rotulo,
    html: h`<main class="missao">
      ${topo(vm.topo, { rotuloDaTela: vm.rotulo, trilha: trilhaDe(ctx, vm, 'pergunta') })}
      <section class="pergunta">
        ${cabecaPergunta(vm)}
        ${vm.avisoInserida ? h`<p class="pr-recado aviso-inserida">${vm.avisoInserida}</p>` : ''}
        ${enunciado(vm.item)}
        <form data-enviar="responder" data-chave="${k}" novalidate>${alternativasPergunta(vm.item.alternativas, marcada)}</form>
        ${vm.aviso ? h`<p class="aviso-pergunta">${vm.aviso}</p>` : ''}
        ${vm.avisoPrimeiraChecagem ? h`<p class="aviso-pergunta">${vm.avisoPrimeiraChecagem}</p>` : ''}
        ${rodape(vm.item.rodape, vm.item.licencaUrl)}
      </section>
    </main>`,
    barra: h`<button type="button" class="botao botao-largo" data-acao="responder" data-chave="${k}" aria-disabled="${marcada ? 'false' : 'true'}">${vm.acao.rotulo}</button>`,
    depois(raiz) { figuras(ctx, raiz, vm.item); },
  };
}

/* ---------------- leitura (c.3b) ---------------- */
function notaForm(n) {
  return h`<form class="nota-pagina" data-enviar="salvarNota" novalidate>
    <label for="nota-campo">${n.prompt}</label>
    <div class="linha-campo">
      <input id="nota-campo" class="campo" type="text" name="nota" maxlength="600" autocomplete="off" enterkeyhint="done" value="${n.texto || ''}">
      <button type="submit" class="botao-sec">Guardar</button>
    </div>
    <p class="${n.texto ? 'salvo' : 'ajuda-campo'}">${n.texto ? 'Nota guardada. Ela aparece no Caderno, em Notas.' : 'Opcional. Fica só neste aparelho.'}</p>
  </form>`;
}

/** Teoria de um tópico de prática, dentro da missão (a apostila na folha pautada). */
function leituraTeoria(ctx, vm) {
  return {
    chave: `teoria:${vm.topo.passo.n}:${vm.id}`,
    titulo: `Apostila: ${vm.titulo}`,
    html: h`<main class="missao missao-leitura">
      ${topo(vm.topo, { trilha: trilhaDe(ctx, vm, 'leitura'), rotuloDaTela: vm.topo && vm.topo.etapa })}
      ${vm.faixa ? h`<p class="pr-recado" role="status">${vm.faixa}</p>` : ''}
      ${vm.jaSei ? h`<p class="ja-sei"><button type="button" class="link link-discreto" data-ev="${vm.jaSei.evento}">${vm.jaSei.rotulo}</button></p>` : ''}
      ${teoria(vm)}
      <div class="fim-leitura"><button type="button" class="botao botao-largo" data-ev="${vm.botao.evento}">${vm.botao.rotulo}</button></div>
    </main>`,
    depois(raiz) { figuras(ctx, raiz); return acompanharSumario(raiz); },
  };
}

function leitura(ctx, vm) {
  if (vm.teoria) return leituraTeoria(ctx, vm);
  return {
    chave: `leitura:${vm.topo.passo.n}:${vm.pagina.id}`,
    titulo: `Leitura da p. ${vm.pagina.n}`,
    html: h`<main class="missao missao-leitura">
      ${topo(vm.topo)}
      <article class="pagina-livro" aria-labelledby="pg-titulo">
        ${vm.faixa ? h`<p class="pr-recado" role="status">${vm.faixa}</p>` : ''}
        <p class="rotulo cabeco">${vm.cabeco}</p>
        ${vm.jaSei ? h`<p class="ja-sei"><button type="button" class="link link-discreto" data-ev="${vm.jaSei.evento}">${vm.jaSei.rotulo}</button></p>` : ''}
        <h1 class="pagina-titulo" id="pg-titulo" tabindex="-1" data-foco-inicial>${vm.pagina.titulo}</h1>
        ${blocos(vm.blocos)}
        <p class="pe">${vm.pagina.pe}</p>
      </article>
      ${vm.nota ? notaForm(vm.nota) : ''}
      <div class="fim-leitura"><button type="button" class="botao botao-largo" data-acao="termineiLer" data-alvo="${vm.botao.evento}">${vm.botao.rotulo}</button></div>
    </main>`,
    depois(raiz) { figuras(ctx, raiz); },
  };
}

/* ---------------- feedback (c.3e, c.3h) ---------------- */
function corpoFeedback(ctx, vm, { foco = true, animar = false } = {}) {
  const rev = vm.revisao;
  const res = vm.resolucao;
  const mostrarResolucao = res && res.texto && !(vm.certa && res.texto === vm.porque);
  return h`<section class="pergunta">
      ${cabecaPergunta(vm, { foco: false })}
      ${enunciado(vm.item)}
      ${alternativasFeedback(vm.alternativas)}
      ${rodape(vm.item.rodape, vm.item.licencaUrl)}
      <section class="feedback" id="feedback" aria-labelledby="fb-titulo">
        ${foco ? h`<h1 class="feedback-titulo" id="fb-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1>` : h`<p class="feedback-titulo" id="fb-titulo">${vm.titulo}</p>`}
        ${vm.certa && vm.topo ? linhaCombo(vm.topo.placar) : ''}
        ${vm.porque ? h`<p>${vm.porque}</p>` : ''}
        ${vm.falta ? h`<p class="falta"><strong>O que faltou.</strong> ${vm.falta}</p>` : ''}
        ${rev && !vm.certa ? h`<p>${rev.texto}</p>` : ''}
        ${rev && rev.antesDepois ? h`<p class="antes-depois">${rev.antesDepois}</p>` : ''}
        ${rev && rev.nivel ? nivel({ cheios: rev.nivel.para, de: rev.nivel.de, animar: animar && rev.nivel.animar }) : ''}
        ${vm.proxima ? h`<p class="proxima">${vm.proxima}</p>` : ''}
        <div class="acoes-fb">
          ${vm.trecho ? h`<button type="button" class="botao-sec botao-largo" data-ev="${vm.trecho.evento}">${vm.trecho.rotulo}</button>` : ''}
          ${mostrarResolucao ? (res.aberta
            ? h`<div class="resolucao"><p class="corpo-forte">Resolução da equipe</p><p>${res.texto}</p></div>`
            : h`<button type="button" class="link" data-ev="${res.evento}">${res.rotulo}</button>`) : ''}
        </div>
      </section>
    </section>`;
}

function feedback(ctx, vm) {
  const chave = `feedback:${vm.topo.passo.n}:${vm.item.id}`;
  const nova = primeiraVez(ctx, chave);
  return {
    chave,
    titulo: 'Resultado',
    html: h`<main class="missao">
      ${topo(vm.topo, { medidor: vm.medidor, rotuloDaTela: vm.rotulo, trilha: trilhaDe(ctx, vm, 'feedback') })}
      ${corpoFeedback(ctx, vm, { animar: nova })}
    </main>`,
    barra: botaoContinuar(vm.continuar),
    depois(raiz, { mudou }) {
      figuras(ctx, raiz, vm.item);
      if (mudou) {
        // a página rola até as alternativas marcadas e o bloco de feedback logo abaixo
        const alvo = raiz.querySelector('#principal .alternativas') || raiz.querySelector('#feedback');
        if (alvo) window.scrollTo({ top: Math.max(0, alvo.getBoundingClientRect().top + window.scrollY - 12), behavior: ctx.reduzido() ? 'auto' : 'smooth' });
      }
      return animarContinuar(raiz);
    },
  };
}

/* ---------------- trecho (c.3f): folha com a página ancorada no parágrafo ---------------- */
export function folhaTrecho(vm, { titulo, grifar = false }) {
  return h`<div class="folha-fundo">
    <div class="folha folha-alta" role="dialog" aria-modal="true" aria-labelledby="trecho-titulo">
      <div class="folha-cabeca"><h1 class="folha-titulo" id="trecho-titulo" tabindex="-1" data-foco-inicial>${titulo}</h1></div>
      <div class="folha-corpo" id="trecho-corpo">
        <article class="pagina-livro">
          <p class="rotulo cabeco">${vm.cabeco}</p>
          <h2 class="pagina-titulo">${vm.pagina.titulo}</h2>
          ${blocos(vm.blocos, vm.ancora, { grifar })}
          <p class="pe">${vm.pagina.pe}</p>
        </article>
      </div>
      <div class="folha-pe"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </div>
  </div>`;
}
function rolarAteAncora(raiz, ancora) {
  const corpo = raiz.querySelector('#trecho-corpo'), a = ancora && document.getElementById(ancora);
  // o parágrafo fica a um quarto da folha: dá para ver o fim do anterior
  if (corpo && a) corpo.scrollTop = Math.max(0, a.getBoundingClientRect().top - corpo.getBoundingClientRect().top + corpo.scrollTop - Math.min(120, corpo.clientHeight * 0.18));
}
/** A seção da apostila que a questão cobrou fica no alto da folha (com uma folga de 16 px). */
function rolarAteSecao(raiz, id) {
  const corpo = raiz.querySelector('#trecho-corpo'), a = id && document.getElementById(id);
  if (corpo && a) corpo.scrollTop = Math.max(0, a.getBoundingClientRect().top - corpo.getBoundingClientRect().top + corpo.scrollTop - 16);
}
function trecho(ctx, vm) {
  const fb = vm.feedback;
  const tr = trilhaDe(ctx, fb, 'trecho');
  if (vm.teoria) {
    // a âncora (a seção que a questão cobrou) vem do núcleo; sem ela, a folha abre no sumário, que leva a cada seção
    const ancora = idDaAncora(vm.ancora != null ? vm.ancora : vm.secao);
    return {
      chave: `trechoTeoria:${vm.id}:${ancora || ''}`,
      titulo: vm.titulo,
      html: h`<div inert aria-hidden="true"><main class="missao">${topo(fb.topo, { medidor: fb.medidor, rotuloDaTela: fb.rotulo, trilha: tr })}${corpoFeedback(ctx, fb, { foco: false })}</main></div>
        <div class="folha-fundo"><div class="folha folha-alta" role="dialog" aria-modal="true" aria-labelledby="trecho-titulo">
          <div class="folha-cabeca"><h1 class="folha-titulo" id="trecho-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1></div>
          <div class="folha-corpo" id="trecho-corpo">${teoria(vm, { tituloComoH1: false, naFolha: true, ancora, grifar: !fb.certa })}</div>
          <div class="folha-pe"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
        </div></div>`,
      depois(raiz) {
        document.documentElement.style.overflow = 'hidden';
        figuras(ctx, raiz);
        if (ancora) rolarAteSecao(raiz, ancora);
        const parar = acompanharSumario(raiz);
        return () => { parar(); document.documentElement.style.overflow = ''; };
      },
    };
  }
  return {
    chave: `trecho:${vm.ancora}`,
    titulo: `Trecho, ${vm.titulo || vm.rotulo}`,
    html: h`<div inert aria-hidden="true"><main class="missao">${topo(fb.topo, { medidor: fb.medidor, rotuloDaTela: fb.rotulo, trilha: tr })}${corpoFeedback(ctx, fb, { foco: false })}</main></div>
      ${folhaTrecho(vm, { titulo: vm.titulo || vm.rotulo, grifar: !fb.certa })}`,
    depois(raiz) {
      document.documentElement.style.overflow = 'hidden';
      figuras(ctx, raiz);
      rolarAteAncora(raiz, vm.ancora);
      return () => { document.documentElement.style.overflow = ''; };
    },
  };
}

/* ---------------- fim da rodada (c.3g): só quando a fila continua ---------------- */
function fimDaRodada(ctx, vm) {
  const chave = `fimDaRodada:${vm.topo.passo.n}`;
  const nova = primeiraVez(ctx, chave);
  const mostrarNivel = vm.variante === 'venceu' && vm.nivel && vm.nivel.para > 0;
  return {
    chave,
    titulo: 'Fim da rodada',
    html: h`<main class="missao">
      ${topo(vm.topo, { medidor: null, semRegra: true, trilha: trilhaDe(ctx, vm, 'fimDaRodada') })}
      <section class="fim-rodada">
        <h1 class="feedback-titulo" tabindex="-1" data-foco-inicial>${vm.texto}</h1>
        ${mostrarNivel ? nivel({ cheios: vm.nivel.para, de: vm.nivel.de, animar: nova && vm.nivel.animar, nome: vm.nivel.nome }) : ''}
        ${vm.cards ? h`<p>${vm.cards}</p>` : ''}
      </section>
    </main>`,
    barra: h`<button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button>`,
  };
}

/* ---------------- mão de cards (Decisão 1) ---------------- */
function botaoCard(a, i) {
  const primario = a.evento !== 'AINDA_NAO';
  return h`<button type="button" class="${primario ? 'botao' : 'botao-sec'} botao-largo" data-ev="${a.evento}" ${a.evento === 'LEMBREI' ? cru('data-foco-apos') : ''}>${a.rotulo}</button>`;
}
function cards(ctx, vm) {
  const mem = ctx.ui.memoria;
  const ant = mem.card;
  const animarVirada = vm.virado && ant && ant.id === vm.id && ant.rep === vm.repeticao && !ant.virado && !ctx.reduzido();
  mem.card = { id: vm.id, virado: vm.virado, rep: vm.repeticao };
  const classeGiro = vm.virado && !animarVirada ? 'virado' : '';
  return {
    chave: `cards:${vm.id}:${vm.repeticao ? 'volta' : 'ida'}`,
    titulo: 'Cartões',
    html: h`<main class="missao">
      ${topo(vm.topo, { medidor: null, semRegra: true })}
      <section class="mao" aria-labelledby="mao-rotulo">
        <div class="mao-cabeca">
          <h1 class="passo-rotulo" id="mao-rotulo" tabindex="-1" data-foco-inicial>${vm.rotulo}</h1>
          <p class="contagem">${vm.posicao}</p>
        </div>
        <div class="mesa">
          <div class="ficha-giro ${classeGiro}" id="ficha-giro" style="--giro:${vm.animacaoMs || 180}ms">
            <div class="ficha ficha-frente" ${vm.virado ? cru('aria-hidden="true"') : ''}>
              <div class="ficha-topo"><span>${vm.cap || 'Frente'}</span><span>${vm.caixa && vm.caixa.rotulo ? vm.caixa.rotulo : 'frente'}</span></div>
              <p class="ficha-frente-texto">${vm.frente}</p>
              <p class="ficha-pergunta">Tente lembrar a resposta antes de virar.</p>
            </div>
            <div class="ficha ficha-verso" ${vm.virado ? '' : cru('aria-hidden="true"')}>
              <div class="ficha-topo"><span>${vm.cap || 'Verso'}</span><span>verso</span></div>
              <p class="ficha-frente-texto">${vm.frente}</p>
              <p class="ficha-verso-texto">${vm.verso}</p>
            </div>
          </div>
        </div>
        ${vm.pendente ? h`<div class="mao-pendente">
          <p tabindex="-1" data-foco-apos>${vm.pendente.texto}</p>
          ${vm.pendente.trecho ? h`<button type="button" class="link" data-ev="${vm.pendente.trecho.evento}">${vm.pendente.trecho.rotulo}</button>` : ''}
        </div>` : ''}
      </section>
    </main>`,
    barra: cada(vm.acoes, botaoCard),
    depois(raiz) {
      const g = raiz.querySelector('#ficha-giro');
      if (!animarVirada || !g) return;
      // meia-volta até a borda (90 ms), troca a face, meia-volta de volta (90 ms): ~180 ms no total
      const meia = Math.round((vm.animacaoMs || 180) / 2);
      if (!g.animate) { g.classList.add('virado'); return; }
      const ida = g.animate([{ transform: 'perspective(900px) rotateY(0deg)' }, { transform: 'perspective(900px) rotateY(90deg)' }], { duration: meia, easing: 'ease-in' });
      let volta = null;
      ida.onfinish = () => {
        g.classList.add('virado');
        volta = g.animate([{ transform: 'perspective(900px) rotateY(-90deg)' }, { transform: 'perspective(900px) rotateY(0deg)' }], { duration: meia, easing: 'ease-out' });
      };
      return () => { ida.cancel(); if (volta) volta.cancel(); g.classList.add('virado'); };
    },
  };
}
function trechoCard(ctx, vm) {
  return {
    chave: `trechoCard:${vm.ancora}`,
    titulo: `Trecho, ${vm.titulo || vm.rotulo}`,
    html: h`<main class="missao" aria-hidden="true"></main>${folhaTrecho(vm, { titulo: vm.titulo || vm.rotulo })}`,
    depois(raiz) {
      document.documentElement.style.overflow = 'hidden';
      rolarAteAncora(raiz, vm.ancora);
      return () => { document.documentElement.style.overflow = ''; };
    },
  };
}
function fimDaMao(ctx, vm) {
  return {
    chave: `fimDaMao:${vm.topo.passo.n}`,
    titulo: 'Fim da mão',
    html: h`<main class="missao">
      ${topo(vm.topo, { medidor: null, semRegra: true })}
      <section class="fim-rodada">
        <h1 class="feedback-titulo" tabindex="-1" data-foco-inicial>${vm.resumo}</h1>
      </section>
    </main>`,
    barra: h`<button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button>`,
  };
}

/** Desenha o estado atual da missão. t = nucleo.tela(). */
export function telaMissao(ctx, t) {
  const { nome, vm } = t;
  if (!vm) return { chave: `missao:${nome}`, html: h`<main class="missao"><p>…</p></main>` };
  switch (nome) {
    case 'pergunta': return pergunta(ctx, vm);
    case 'leitura': return leitura(ctx, vm);
    case 'feedback': return feedback(ctx, vm);
    case 'trecho': return trecho(ctx, vm);
    case 'fimDaRodada': return fimDaRodada(ctx, vm);
    case 'cards': return cards(ctx, vm);
    case 'trechoCard': return trechoCard(ctx, vm);
    case 'fimDaMao': return fimDaMao(ctx, vm);
    default: return { chave: `missao:${nome}`, html: h`<main class="missao"><p>…</p></main>` };
  }
}

/* ---------------- ações e folhas da missão ---------------- */
function marcarEscolha(form) {
  form.querySelectorAll('.alt').forEach(l => { const i = l.querySelector('input'); l.classList.toggle('marcada', !!(i && i.checked)); });
}
registrar({
  acoes: {
    escolherAlt(ctx, el) {
      const form = el.closest('form');
      if (!form) return;
      ctx.ui.selecao = { chave: form.dataset.chave, alt: el.value };
      marcarEscolha(form);
      const b = document.querySelector('[data-acao="responder"]');
      if (b) b.setAttribute('aria-disabled', 'false');
    },
    responder(ctx, el) {
      const k = el.dataset.chave, s = ctx.ui.selecao;
      if (!s || s.chave !== k) {
        const r = document.querySelector('#principal input[name="alt"]');
        if (r) r.focus();
        ctx.anunciar('Escolha uma alternativa.');
        return;
      }
      ctx.ui.selecao = null;
      ctx.despachar({ tipo: 'RESPONDER', alt: s.alt });
    },
    salvarNota(ctx) {
      const c = document.getElementById('nota-campo');
      if (!c) return;
      if (c.value !== c.defaultValue) ctx.despachar({ tipo: 'SALVAR_NOTA', texto: c.value });
    },
    termineiLer(ctx, el) {
      const c = document.getElementById('nota-campo');
      if (c && c.value !== c.defaultValue && c.value.trim()) ctx.nucleo.despachar({ tipo: 'SALVAR_NOTA', texto: c.value });   // a nota digitada não se perde
      ctx.despachar({ tipo: el.dataset.alvo || 'TERMINEI_TRECHO' });
    },
    zoomMais(ctx) { const f = ctx.ui.folha; if (f && f.dados) { f.dados.zoom = Math.min(4, (f.dados.zoom || 1) * 1.5); ctx.redesenharFolha(); } },
    zoomMenos(ctx) { const f = ctx.ui.folha; if (f && f.dados) { f.dados.zoom = Math.max(1, (f.dados.zoom || 1) / 1.5); ctx.redesenharFolha(); } },
  },
  folhas: {
    /** Folha "Encerrar" (b.2): duas saídas, com a diferença escrita. */
    encerrar(ctx, dados, t) {
      const vm = t.vm || {}, tp = vm.topo || (vm.feedback && vm.feedback.topo);
      const passo = tp && tp.passo ? ` no passo ${tp.passo.n} de ${tp.passo.total}` : '';
      // estudo por conta própria (depois do Pronto por hoje): a missão do dia já está feita; nada de "próximo dia"
      const m = ctx.nucleo.st && ctx.nucleo.st.missao;
      const livre = typeof vm.livre === 'boolean' ? vm.livre : !!(m && m.livre);
      const txt = livre ? {
        pausa: 'O estudo fica aberto até a meia-noite.',
        sair: 'Encerrar este estudo',
        encerra: `Encerra este estudo${passo}. O que você fez fica registrado; a rodada aberta não muda nenhum nível. A missão de hoje já está feita.`,
        voltar: 'Voltar ao estudo',
      } : {
        pausa: 'A missão fica aberta até a meia-noite. Em Hoje, ela aparece como “Continuar”.',
        sair: 'Encerrar por hoje',
        encerra: `Encerra a missão de hoje${passo}. O que você fez fica registrado; a rodada aberta não muda nenhum nível e volta no próximo dia de estudo.`,
        voltar: 'Voltar à missão',
      };
      return {
        rotulo: 'Encerrar',
        corpo: h`<p class="folha-frase">Parar agora?</p>
          <div class="pilha-8">
            <button type="button" class="botao botao-largo" data-ev="PAUSAR">Parar e continuar mais tarde</button>
            <p class="pequeno texto-2" style="margin:0 0 16px">${txt.pausa}</p>
            <button type="button" class="botao-sec botao-largo" data-ev="CONFIRMAR_ENCERRAR">${txt.sair}</button>
            <p class="pequeno texto-2" style="margin:0">${txt.encerra}</p>
          </div>`,
        pe: h`<button type="button" class="link link-centro" data-acao="fecharFolha">${txt.voltar}</button>`,
      };
    },
    /** "ver a regra" da rodada (o topo mostra a regra uma vez, no início). O que cada casa conta vem do medidor do núcleo. */
    regra(ctx, dados, t) {
      const tp = t.vm && (t.vm.topo || (t.vm.feedback && t.vm.feedback.topo));
      if (!tp || !tp.regra) return null;
      const d = tp.medidor && tp.medidor.descricoes;
      return {
        rotulo: 'Regra da rodada',
        corpo: h`<p class="folha-frase">${tp.regra.texto}</p>
          ${d && d.length >= 2 ? h`<p class="pequeno texto-2">O medidor do topo tem duas casas (1ª: ${d[0]}; 2ª: ${d[1]}). As duas cheias fecham a rodada.</p>`
            : tp.medidor ? h`<p class="pequeno texto-2">O medidor do topo tem duas casas: a 1ª é um acerto seguido; a 2ª, um acerto numa questão de aplicar. As duas cheias fecham a rodada.</p>` : ''}`,
        pe: h`<button type="button" class="botao-sec botao-largo" data-acao="fecharFolha">Fechar</button>`,
      };
    },
    /** Figura em tela cheia (no celular, a tela inteira), com zoom. Um só "Fechar": o do pé, ao lado do − e do +. */
    zoom(ctx, dados) {
      if (!dados || !dados.html) return null;
      const z = dados.zoom || 1;
      return {
        rotulo: 'Figura ampliada',
        alta: true,
        fechar: false,
        corpo: h`<div class="zoom-corpo"><div class="zoom-quadro" style="width:${Math.round(z * 100)}%;min-width:100%">${cru(dados.html)}</div></div>`,
        pe: h`<div class="zoom-controles">
          <button type="button" class="botao-sec" data-acao="zoomMenos" aria-label="Reduzir" ${z <= 1 ? cru('disabled') : ''}>−</button>
          <button type="button" class="botao-sec" data-acao="zoomMais" aria-label="Ampliar" ${z >= 4 ? cru('disabled') : ''}>+</button>
          <button type="button" class="botao" data-acao="fecharFolha">Fechar</button>
        </div>`,
        depois(raiz) {
          raiz.querySelectorAll('.zoom-corpo img, .zoom-corpo svg').forEach(el => { el.style.width = '100%'; el.style.maxWidth = 'none'; el.style.height = 'auto'; });
          raiz.querySelectorAll('.zoom-corpo .ampliavel-dica').forEach(el => el.remove());
          // a figura maior que a tela abre pelo meio (como quem aproxima os dedos no centro)
          const zc = raiz.querySelector('.zoom-corpo');
          if (zc && zc.scrollWidth > zc.clientWidth) zc.scrollLeft = Math.round((zc.scrollWidth - zc.clientWidth) / 2);
        },
      };
    },
  },
});
