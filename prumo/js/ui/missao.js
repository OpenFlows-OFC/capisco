/* =========================================================
   PRUMO · Missão em tela cheia (c.3) e mão de cards (Decisão 1)
   Estados do núcleo: pergunta · leitura · feedback · trecho · fimDaRodada ·
   cards · trechoCard · fimDaMao. A única barra fixa é a do botão de ação
   (Responder, Continuar, Seguir, Virar, Lembrei/Ainda não). "Terminei de ler"
   fica no fluxo do texto, para o teclado não cobri-lo. A folha "Encerrar"
   é da tela e manda PAUSAR ou CONFIRMAR_ENCERRAR.
   ========================================================= */
import { h, cru, cada, depoisDoQuadro } from './dom.js';
import { registrar } from './registro.js';
import {
  topo, enunciado, alternativasPergunta, alternativasFeedback, rodape, blocos, nivel,
  botaoContinuar, animarContinuar, prepararFiguras,
} from './componentes.js';

const chaveSel = vm => `${vm.item.id}@${vm.topo.passo.n}`;
const primeiraVez = (ctx, chave) => ctx.ui.chave !== chave;

function figuras(ctx, raiz, item) {
  prepararFiguras(raiz.querySelector('#principal') || raiz, {
    textoFalha: (item && item.imagemFalhou) || undefined,
    aoAmpliar: el => {
      const c = el.cloneNode(true);
      c.removeAttribute('role'); c.removeAttribute('tabindex'); c.removeAttribute('aria-label'); c.classList.remove('ampliavel');
      ctx.abrirFolha('zoom', { html: c.outerHTML, zoom: 1 }, el);
    },
  });
}

/* ---------------- pergunta (c.3a, c.3c, c.3d, c.3d', c.3h) ---------------- */
function cabecaPergunta(vm, { foco = true } = {}) {
  const sub = vm.subrotulo && vm.subrotulo !== vm.item.rodape ? vm.subrotulo : null;
  return h`<header class="pergunta-cabeca">
    ${foco ? h`<h1 class="rotulo" tabindex="-1" data-foco-inicial>${vm.rotulo}</h1>` : h`<p class="rotulo">${vm.rotulo}</p>`}
    ${sub ? h`<p class="sub">${sub}</p>` : ''}
  </header>`;
}

function pergunta(ctx, vm) {
  const k = chaveSel(vm);
  const marcada = ctx.ui.selecao && ctx.ui.selecao.chave === k ? ctx.ui.selecao.alt : null;
  return {
    chave: `pergunta:${k}`,
    titulo: vm.rotulo.charAt(0) + vm.rotulo.slice(1).toLowerCase(),
    html: h`<main class="missao">
      ${topo(vm.topo, { rotuloDaTela: vm.rotulo })}
      <section class="pergunta">
        ${cabecaPergunta(vm)}
        ${vm.avisoInserida ? h`<p class="aviso-linha" style="margin:0 0 16px">${vm.avisoInserida}</p>` : ''}
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

function leitura(ctx, vm) {
  return {
    chave: `leitura:${vm.topo.passo.n}:${vm.pagina.id}`,
    titulo: `Leitura · p. ${vm.pagina.n}`,
    html: h`<main class="missao missao-leitura">
      ${topo(vm.topo)}
      <article class="pagina-livro" aria-labelledby="pg-titulo">
        ${vm.faixa ? h`<p class="aviso-linha" role="status" style="margin:0 0 20px">${vm.faixa}</p>` : ''}
        <p class="rotulo cabeco">${vm.cabeco}</p>
        ${vm.jaSei ? h`<p class="ja-sei"><button type="button" class="link link-discreto link-pequeno" data-ev="${vm.jaSei.evento}">${vm.jaSei.rotulo}</button></p>` : ''}
        <h1 class="pagina-titulo" id="pg-titulo" tabindex="-1" data-foco-inicial>${vm.pagina.titulo}</h1>
        ${blocos(vm.blocos)}
        <p class="pe num">${vm.pagina.pe}</p>
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
        ${vm.porque ? h`<p>${vm.porque}</p>` : ''}
        ${vm.falta ? h`<p class="falta"><strong>O que faltou:</strong> ${vm.falta}</p>` : ''}
        ${rev && !vm.certa ? h`<p>${rev.texto}</p>` : ''}
        ${rev && rev.antesDepois ? h`<p class="antes-depois">${rev.antesDepois}</p>` : ''}
        ${rev && rev.nivel ? nivel({ cheios: rev.nivel.para, de: rev.nivel.de, animar: animar && rev.nivel.animar }) : ''}
        ${vm.proxima ? h`<p class="proxima">${vm.proxima}</p>` : ''}
        <div class="acoes-fb">
          ${vm.trecho ? h`<button type="button" class="link" data-ev="${vm.trecho.evento}">${vm.trecho.rotulo}</button>` : ''}
          ${mostrarResolucao ? (res.aberta
            ? h`<div class="resolucao"><p class="rotulo">Resolução da equipe</p><p>${res.texto}</p></div>`
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
      ${topo(vm.topo, { medidor: vm.medidor, rotuloDaTela: vm.rotulo })}
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
function folhaTrecho(vm, { titulo }) {
  return h`<div class="folha-fundo">
    <div class="folha folha-alta" role="dialog" aria-modal="true" aria-labelledby="trecho-titulo">
      <div class="folha-cabeca"><h1 class="rotulo" id="trecho-titulo" tabindex="-1" data-foco-inicial>${titulo}</h1></div>
      <div class="folha-corpo" id="trecho-corpo">
        <article class="pagina-livro">
          <p class="rotulo cabeco">${vm.cabeco}</p>
          <h2 class="pagina-titulo">${vm.pagina.titulo}</h2>
          ${blocos(vm.blocos, vm.ancora)}
          <p class="pe num">${vm.pagina.pe}</p>
        </article>
      </div>
      <div class="folha-pe"><button type="button" class="botao" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </div>
  </div>`;
}
function rolarAteAncora(raiz, ancora) {
  const corpo = raiz.querySelector('#trecho-corpo'), a = ancora && document.getElementById(ancora);
  // o parágrafo fica a um quarto da folha: dá para ver o fim do anterior
  if (corpo && a) corpo.scrollTop = Math.max(0, a.getBoundingClientRect().top - corpo.getBoundingClientRect().top + corpo.scrollTop - Math.min(120, corpo.clientHeight * 0.18));
}
function trecho(ctx, vm) {
  const fb = vm.feedback;
  return {
    chave: `trecho:${vm.ancora}`,
    titulo: `Trecho · ${vm.rotulo}`,
    html: h`<div inert aria-hidden="true"><main class="missao">${topo(fb.topo, { medidor: fb.medidor })}${corpoFeedback(ctx, fb, { foco: false })}</main></div>
      ${folhaTrecho(vm, { titulo: `Trecho · ${vm.rotulo}` })}`,
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
      ${topo(vm.topo, { medidor: null, semRegra: true })}
      <section class="fim-rodada">
        <h1 class="feedback-titulo" tabindex="-1" data-foco-inicial>${vm.texto}</h1>
        ${mostrarNivel ? nivel({ cheios: vm.nivel.para, de: vm.nivel.de, animar: nova && vm.nivel.animar, nome: vm.nivel.nome }) : ''}
        ${vm.cards ? h`<p style="margin-top:16px">${vm.cards}</p>` : ''}
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
    titulo: 'Cards',
    html: h`<main class="missao">
      ${topo(vm.topo, { medidor: null, semRegra: true })}
      <section class="mao" aria-labelledby="mao-rotulo">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
          <h1 class="rotulo" id="mao-rotulo" tabindex="-1" data-foco-inicial>${vm.rotulo}</h1>
          <p class="rotulo num">${vm.posicao}</p>
        </div>
        <div class="mesa">
          <div class="ficha-giro ${classeGiro}" id="ficha-giro" style="--giro:${vm.animacaoMs || 180}ms">
            <div class="ficha ficha-frente" ${vm.virado ? cru('aria-hidden="true"') : ''}>
              <div class="ficha-topo"><span class="rotulo">Frente</span><span class="mini texto-2">${vm.caixa && vm.caixa.nome ? vm.caixa.nome : ''}</span></div>
              <p class="ficha-frente-texto">${vm.frente}</p>
              <p class="ficha-pergunta">Tente lembrar a resposta antes de virar.</p>
            </div>
            <div class="ficha ficha-verso" ${vm.virado ? '' : cru('aria-hidden="true"')}>
              <div class="ficha-topo"><span class="rotulo">Verso</span><span class="mini texto-2">${vm.caixa && vm.caixa.nome ? vm.caixa.nome : ''}</span></div>
              <p class="ficha-pergunta">${vm.frente}</p>
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
      if (animarVirada) {
        const g = raiz.querySelector('#ficha-giro');
        depoisDoQuadro(() => { if (g) g.classList.add('virado'); });
      }
    },
  };
}
function trechoCard(ctx, vm) {
  return {
    chave: `trechoCard:${vm.ancora}`,
    titulo: `Trecho · ${vm.rotulo}`,
    html: h`<main class="missao" aria-hidden="true"></main>${folhaTrecho(vm, { titulo: `Trecho · ${vm.rotulo}` })}`,
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
      const passo = tp && tp.passo ? `no passo ${tp.passo.n} de ${tp.passo.total}` : '';
      return {
        rotulo: 'Encerrar',
        corpo: h`<p class="feedback-titulo" style="margin-bottom:16px">Parar agora?</p>
          <div class="pilha-8">
            <button type="button" class="botao botao-largo" data-ev="PAUSAR">Parar e continuar mais tarde (até a meia-noite)</button>
            <p class="pequeno texto-2" style="margin:0 0 16px">A missão fica aberta. Em Hoje, ela aparece como “Continuar”.</p>
            <button type="button" class="botao-sec botao-largo" data-ev="CONFIRMAR_ENCERRAR">Encerrar por hoje</button>
            <p class="pequeno texto-2" style="margin:0">Encerra a missão de hoje ${passo}. O que você fez fica registrado; a rodada aberta não muda nenhum nível e volta no próximo dia de estudo.</p>
          </div>`,
        pe: h`<button type="button" class="link" data-acao="fecharFolha" style="width:100%;justify-content:center">Voltar à missão</button>`,
      };
    },
    /** "ver a regra" da rodada (o topo mostra a regra uma vez, no início). */
    regra(ctx, dados, t) {
      const tp = t.vm && (t.vm.topo || (t.vm.feedback && t.vm.feedback.topo));
      if (!tp || !tp.regra) return null;
      return {
        rotulo: 'Regra da rodada',
        corpo: h`<p style="font-size:18px;line-height:28px">${tp.regra.texto}</p>
          ${tp.medidor ? h`<p class="pequeno texto-2">O medidor do topo tem duas casas: a 1ª é um acerto seguido; a 2ª, um acerto numa questão de aplicar. As duas cheias fecham a rodada.</p>` : ''}`,
        pe: h`<button type="button" class="botao-sec" data-acao="fecharFolha">Fechar</button>`,
      };
    },
    /** Figura em tela cheia, com zoom. */
    zoom(ctx, dados) {
      if (!dados || !dados.html) return null;
      const z = dados.zoom || 1;
      return {
        rotulo: 'Figura ampliada',
        alta: true,
        corpo: h`<div class="zoom-corpo"><div style="width:${Math.round(z * 100)}%;min-width:100%;padding:8px">${cru(dados.html)}</div></div>`,
        pe: h`<div class="zoom-controles">
          <button type="button" class="botao-sec" data-acao="zoomMenos" aria-label="Reduzir" ${z <= 1 ? cru('disabled') : ''}>−</button>
          <button type="button" class="botao-sec" data-acao="zoomMais" aria-label="Ampliar" ${z >= 4 ? cru('disabled') : ''}>+</button>
          <button type="button" class="botao" data-acao="fecharFolha">Fechar</button>
        </div>`,
        depois(raiz) {
          raiz.querySelectorAll('.zoom-corpo img, .zoom-corpo svg').forEach(el => { el.style.width = '100%'; el.style.maxWidth = 'none'; el.style.height = 'auto'; });
          raiz.querySelectorAll('.zoom-corpo .ampliavel-dica').forEach(el => el.remove());
        },
      };
    },
  },
});
