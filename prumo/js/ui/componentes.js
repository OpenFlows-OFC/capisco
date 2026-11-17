/* =========================================================
   PRUMO · componentes reutilizáveis das telas (design system "Prumo")
   Cada componente é um objeto do material de estudo: cabeçalho de prova,
   cartão-resposta, página pautada, ficha, régua, risquinhos, visto, recado.
   Cada função recebe dados já prontos do núcleo e devolve HTML (h``).
   Nenhuma calcula nível, data, regra ou frase: isso vem dos view models.
   Catálogo e convenções: js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, esc, reduzido } from './dom.js';
import { NIVEL } from '../nucleo/motor.js';   // só os nomes dos níveis (rótulos), nenhuma regra

/* ---------------- marca ---------------- */
/** Símbolo do Prumo (Cadeado-P), sem alteração: anel em marinho (branco no escuro), esquadro azul, fechadura em latão. */
export const simbolo = (classe = '') => cru(`<svg class="simbolo ${classe}" viewBox="-3 -8 55.2 79.2" aria-hidden="true" focusable="false"><path class="anel" fill="none" stroke-width="11.2" d="M6.80 18.80A18.4 18.4 0 1 1 22.00 36.92"/><rect class="haste" x="1.20" y="17.30" width="11.2" height="15.5"/><path class="esquadro" d="M0 26V68L37.2 61.2Z"/><circle class="fechadura" cx="10.4" cy="50" r="3.6"/><rect class="fechadura" x="9" y="50" width="2.8" height="8" rx="0.6"/></svg>`);
/** Símbolo + a palavra "prumo" em minúsculas (Gabarito 700, tinta). */
export const marca = () => h`<span class="marca-prumo">${simbolo()}<span>prumo</span></span>`;
/** Link para Ajustes, escrito (o Prumo quase não tem ícones). */
export const linkAjustes = () => h`<a class="link" href="#/ajustes">Ajustes</a>`;

/* ---------------- Risquinhos: dias estudados de cinco em cinco ---------------- */
// o desenho sai do número e é sempre igual para o mesmo número; dois "jeitos de mão" que se alternam por grupo
const MAO = [
  [[2.0, 3.6, 2.6, 22.7], [8.0, 3.4, 7.6, 22.8], [14.0, 3.3, 14.3, 22.9], [20.0, 3.7, 19.3, 22.6]],
  [[2.0, 3.5, 2.5, 22.8], [8.0, 3.2, 7.8, 22.9], [14.0, 3.4, 14.4, 22.8], [20.0, 3.5, 19.5, 22.8]],
];
const POR_LINHA = 8;   // grupos por linha antes de quebrar (≈ 256 px)
/** SVG dos risquinhos para n dias (só crescem; nenhum número volta a zero). */
export function risquinhos(n) {
  const total = Math.max(0, Math.floor(n || 0));
  if (!total) return '';
  const grupos = Math.ceil(total / 5), linhas = Math.ceil(grupos / POR_LINHA);
  const out = [];
  let largura = 0;
  for (let g = 0; g < grupos; g++) {
    const ox = (g % POR_LINHA) * 32, oy = Math.floor(g / POR_LINHA) * 30, mao = MAO[g % 2];
    const nesse = Math.min(5, total - g * 5);
    for (let k = 0; k < Math.min(4, nesse); k++) {
      const [x1, y1, x2, y2] = mao[k];
      out.push(`<line x1="${(ox + x1).toFixed(1)}" y1="${(oy + y1).toFixed(1)}" x2="${(ox + x2).toFixed(1)}" y2="${(oy + y2).toFixed(1)}"/>`);
      largura = Math.max(largura, ox + x1 + 8);
    }
    if (nesse === 5) { out.push(`<line x1="${ox - 1}" y1="${oy + 19}" x2="${ox + 24}" y2="${oy + 7.5}"/>`); largura = Math.max(largura, ox + 26); }
  }
  const altura = linhas * 30 - 4;
  return cru(`<svg class="pr-risquinhos" viewBox="-1 0 ${largura + 1} ${altura}" width="${largura + 1}" height="${altura}" aria-hidden="true" focusable="false">${out.join('')}</svg>`);
}
/** Constância: risquinhos + "N dias estudados" (o mesmo em todas as telas). c = { diasEstudados, rotulo } do núcleo. */
export function constancia(c) {
  if (!c) return '';
  return h`<span class="pr-constancia">${risquinhos(c.diasEstudados)}<span class="pr-contagem">${c.rotulo}</span></span>`;
}

/* ---------------- Cabeçalho de prova ---------------- */
/** celulas: [{ rotulo, valor, unidade? }] do núcleo. Rótulo impresso em grafite-2; valor "à caneta", em Mono tinta. */
export function cabecalhoProva(celulas) {
  if (!celulas || !celulas.length) return '';
  const colunas = celulas.length === 3 ? '1.4fr .8fr 1fr' : `repeat(${celulas.length}, 1fr)`;
  return h`<div class="pr-cabecalho" style="grid-template-columns:${colunas}">${cada(celulas, c => h`<div class="pr-celula">
    <span class="pr-rotulo">${c.rotulo}</span>
    <span class="pr-valor">${c.valor}${c.unidade ? h`<span class="pr-unidade"> ${c.unidade}</span>` : ''}</span>
  </div>`)}</div>`;
}

/* ---------------- Recado ---------------- */
/** Recado de uma linha, como na agenda: rótulo em negrito ("Ontem:") e a frase. Sem caixa, sem filete. */
export function recado(r, { papel = null } = {}) {
  if (!r || !r.texto) return '';
  return h`<p class="pr-recado" ${papel ? cru(`role="${papel}"`) : ''}>${r.rotulo ? h`<strong class="pr-recado-rotulo">${r.rotulo}:</strong> ` : ''}${r.texto}</p>`;
}

/* ---------------- Visto do dia ---------------- */
/** Carimbo roxo com máscara de tinta. novo: gesto de carimbar (140 ms, sem quique; nada com movimento reduzido). */
export function visto(v, { novo = false } = {}) {
  if (!v) return '';
  return h`<div class="pr-visto-lugar"><div class="pr-visto ${novo && !reduzido() ? 'is-novo' : ''}" role="img" aria-label="${v.rotulo}">
    <span class="pr-visto-palavra" aria-hidden="true">${v.palavra || 'Visto'}</span>
    <span class="pr-visto-data" aria-hidden="true">${v.data}</span>
    ${v.obs ? h`<span class="pr-visto-obs" aria-hidden="true">${v.obs}</span>` : ''}
  </div></div>`;
}

/* ---------------- nível do capítulo: régua curta de 5 passos com o nome ao lado ---------------- */
/** cheios: 0 a 5; de: quantos já estavam cheios (os novos enchem em 180 ms se animar; nunca anima perda). */
export function nivel({ cheios = 0, de = cheios, animar = false, nome } = {}) {
  const n = nome || (cheios ? NIVEL[cheios] : null);
  const segs = [0, 1, 2, 3, 4].map(i => `<i class="${i < cheios ? 'cheio' : ''}${animar && !reduzido() && i >= de && i < cheios ? ' novo' : ''}"></i>`).join('');
  return h`<span class="linha-nivel"><span class="nivel" role="img" aria-label="${n ? `Nível: ${n}` : 'Nível: ainda sem nível'}">${cru(segs)}</span>${n ? h`<span class="nivel-nome">${n}</span>` : ''}</span>`;
}

/* ---------------- Régua: progresso da missão ---------------- */
// traços de 1 (curto), 5 (médio) e 10 (longo) em 60 divisões, como numa régua escolar
const TRACOS = (() => {
  const l = [];
  for (let i = 1; i < 60; i++) {
    const x = ((i / 60) * 100).toFixed(3);
    const alto = i % 10 === 0 ? 11 : i % 5 === 0 ? 7 : 4;
    l.push(`<line x1="${x}%" y1="0" x2="${x}%" y2="${alto}"/>`);
  }
  return l.join('');
})();
/** Régua da missão: anda pelo que foi feito, nunca por tempo. t = topo do núcleo (passo, progresso, legenda). */
export function regua(t) {
  if (!t || !t.passo) return '';
  const total = Math.max(1, t.passo.total), feitos = Math.max(0, Math.min(total, Math.round((t.progresso || 0) * total)));
  const pct = ((feitos / total) * 100).toFixed(2);
  const lg = t.legenda || {};
  const marcas = total <= 20 ? cru(Array.from({ length: total }, () => '<span></span>').join('')) : '';
  return h`<div class="pr-regua">
    <div class="pr-regua-barra" style="--feito:${pct}%;--passos:${total <= 20 ? total : 1}" role="progressbar" aria-label="Passos da missão" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${feitos}" aria-valuetext="${lg.passo || ''}">
      <span class="pr-regua-cheio"></span>
      <span class="pr-regua-tracos" aria-hidden="true"><svg preserveAspectRatio="none">${cru(TRACOS)}</svg></span>
      <span class="pr-regua-marcas" aria-hidden="true">${marcas}</span>
    </div>
    ${lg.passo ? h`<div class="pr-regua-legenda"><span>${lg.passo}</span>${lg.falta ? h`<span>${lg.falta}</span>` : ''}</div>` : ''}
  </div>`;
}

/* ---------------- missão: topo e medidor ---------------- */
/** Medidor de duas casas (c.3): 1ª = um acerto seguido; 2ª = acerto em questão de aplicar. */
export function medidor(md) {
  if (!md) return '';
  const desc = ['um acerto seguido', 'acerto em questão de aplicar'];
  return h`<div class="medidor">
    <span class="casas">${cada(md.casas, (c, i) => h`<span class="casa ${c.cheia ? 'cheia' : ''}" aria-label="${`${i + 1}ª casa (${desc[i]}): ${c.cheia ? 'preenchida, ' + c.rotulo : 'vazia'}`}"><span aria-hidden="true">${c.rotulo}</span></span>`)}</span>
    ${md.texto ? h`<span class="medidor-texto">${md.texto}</span>` : ''}
  </div>`;
}
/**
 * Topo da missão: a etapa e "Encerrar"; a Régua (passo N de M e o que falta); o medidor nos passos que contam.
 * A regra da rodada aparece uma vez, no início.
 */
export function topo(t, { medidor: md, encerrar = 'encerrar', semRegra = false, rotuloDaTela = null } = {}) {
  if (!t) return '';
  const m = md === undefined ? t.medidor : md;
  const verRegra = t.regra && !t.regra.mostrarAgora && !semRegra;
  const etapa = rotuloDaTela && String(t.etapa).toLowerCase() === String(rotuloDaTela).toLowerCase() ? '' : t.etapa;
  return h`<header class="topo">
    <div class="topo-linha">
      <p class="topo-etapa">${etapa}</p>
      <div class="topo-acoes">
        ${verRegra ? h`<button type="button" class="link link-discreto" data-folha="regra">${t.regra.rotulo}</button>` : ''}
        ${encerrar ? h`<button type="button" class="link" data-folha="${encerrar}">${t.encerrar || 'Encerrar'}</button>` : ''}
      </div>
    </div>
    ${regua(t)}
    ${m ? h`<div class="topo-medidor">${medidor(m)}</div>` : ''}
  </header>
  ${t.regra && t.regra.mostrarAgora && !semRegra ? h`<p class="regra-linha">${t.regra.texto}</p>` : ''}`;
}

/* ---------------- questão: cabeçalho, enunciado, cartão-resposta, rodapé ---------------- */
/** Cabeçalho do caderno impresso: "QUESTÃO 162" (maiúsculas como no papel) e a prova. */
export function questaoCab(item, { comoTitulo = false } = {}) {
  const c = item && item.cabecalho;
  if (!c) return '';
  const num = comoTitulo ? h`<h1 class="pr-questao-num" tabindex="-1" data-foco-inicial>${c.num}</h1>` : h`<span class="pr-questao-num">${c.num}</span>`;
  return h`<header class="pr-questao-cab">${num}${c.fonte ? h`<span class="pr-questao-fonte">${c.fonte}</span>` : ''}</header>`;
}
/** Rodapé de atribuição com o link da licença (c.3d). */
export function rodape(texto, url) {
  if (!texto) return '';
  if (!url) return h`<p class="rodape-licenca">${texto}</p>`;
  const semProto = url.replace(/^https?:\/\//, '');
  let i = texto.indexOf(semProto), alvo = semProto;
  if (i < 0) { const mm = /CC BY(?:-[A-Z]{2})*(?:-[A-Z]{2})? \d\.\d/.exec(texto); if (mm) { i = mm.index; alvo = mm[0]; } }
  if (i < 0) return h`<p class="rodape-licenca">${texto} (<a href="${url}" target="_blank" rel="noopener">licença</a>)</p>`;
  return h`<p class="rodape-licenca">${texto.slice(0, i)}<a href="${url}" target="_blank" rel="noopener">${alvo}</a>${texto.slice(i + alvo.length)}</p>`;
}
/** Enunciado (HTML do pack) e o comando da questão. */
export function enunciado(item) {
  return h`<div class="enunciado">${cru(item.enunciado || '')}${item.introducao ? h`<p class="comando">${item.introducao}</p>` : ''}</div>`;
}
const imagemAlt = a => (a.imagem ? h`<span class="alt-img"><img src="${a.imagem.src}" alt="${a.imagem.alt || ''}" loading="lazy"></span>` : '');
/** Cartão-resposta para responder: rádio nativo, a linha inteira é o alvo, bolha oval A–E. */
export function alternativasPergunta(alts, marcada, nome = 'alt') {
  return h`<fieldset class="cartao"><legend class="so-leitor">Alternativas</legend><ol class="alternativas">${cada(alts, a => h`<li>
      <label class="alt ${marcada === a.letra ? 'marcada' : ''}">
        <input type="radio" name="${nome}" value="${a.letra}" data-mudar="escolherAlt" ${marcada === a.letra ? cru('checked') : ''}>
        <span class="letra" aria-hidden="true">${a.letra}</span>
        <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${a.texto || ''}${imagemAlt(a)}</span>
      </label></li>`)}</ol></fieldset>`;
}
/** Cartão-resposta corrigido: a certa ganha o círculo de caneta; a sua marcação fica em grafite. Sem vermelho. */
export function alternativasFeedback(alts) {
  return h`<ol class="alternativas">${cada(alts, a => {
    const sua = a.marca === 'sua' || a.marca === 'sua-certa', certa = a.marca === 'certa' || a.marca === 'sua-certa';
    const nota = a.marca === 'sua-certa' ? 'sua marcação, certa' : a.marca === 'sua' ? 'sua marcação' : a.marca === 'certa' ? 'certa' : '';
    return h`<li><div class="alt estatica ${certa ? 'certa' : sua ? 'sua' : ''}">
      <span class="letra" aria-hidden="true">${a.letra}</span>
      <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${a.texto || ''}${imagemAlt(a)}${nota ? h`<span class="nota-alt">${nota}</span>` : ''}</span>
    </div></li>`;
  })}</ol>`;
}

/* ---------------- Trecho: a página pautada do caderno ---------------- */
function figura(f) {
  if (!f) return '';
  return h`${cru(f.html || '')}${f.legenda && f.tipo !== 'tabela' ? h`<p class="legenda">${f.legenda}</p>` : ''}`;
}
/** Um parágrafo com o § na margem; o atual ganha o fio de prumo; grifar: marca-texto no trecho que o erro cobrou. */
export function paragrafo(par, ancora, { grifar = false } = {}) {
  const aqui = par.id === ancora;
  const corpo = cru(par.html || '');
  return h`<div class="par ${aqui ? 'ancora' : ''}" id="${par.id}" data-par="${par.id}">
    <span class="par-n" aria-hidden="true">§ ${par.n}</span>
    ${aqui ? cru('<span class="fio-prumo" aria-hidden="true"></span>') : ''}
    <div class="par-texto"><span class="so-leitor">Parágrafo ${par.n}. </span><p>${aqui && grifar ? h`<span class="marca-texto">${corpo}</span>` : corpo}</p>${figura(par.figura)}</div>
    ${par.notas && par.notas.length ? h`<div class="par-notas">${cada(par.notas, n => h`<p class="nota-margem">${n.texto} <span class="nota-dia">(${n.dia})</span></p>`)}</div>` : ''}
  </div>`;
}
/** A folha pautada: pauta azul no passo de 30 px, margem rosa, § na margem. */
export function blocos(bs, ancora, op = {}) {
  return h`<div class="pagina">${cada(bs, b => cada(b.paragrafos, p => paragrafo(p, ancora, op)))}</div>`;
}

/* ---------------- folha (sobe sobre a tela) ---------------- */
/** Moldura de folha. corpo/pe já em HTML. A tela que abre a folha é marcada como inerte. */
export function folha({ id = 'folha', rotulo, corpo, pe, alta = false, fechar = true, acaoFechar = 'fecharFolha' }) {
  return h`<div class="folha-fundo" data-acao="fundoFolha">
    <div class="folha ${alta ? 'folha-alta' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}-titulo">
      <div class="folha-cabeca"><h2 class="folha-titulo" id="${id}-titulo" tabindex="-1" data-foco-folha>${rotulo}</h2>
        ${fechar ? h`<button type="button" class="link" data-acao="${acaoFechar}">Fechar</button>` : ''}</div>
      <div class="folha-corpo">${corpo}</div>
      ${pe ? h`<div class="folha-pe">${pe}</div>` : ''}
    </div>
  </div>`;
}

/* ---------------- intervalo deliberativo ---------------- */
/** Botão "Continuar" do feedback: tracejado ("ainda não") durante a pausa, com aria-disabled e "Leia a explicação". */
export function botaoContinuar(c) {
  const espera = c.restanteMs > 0;
  return h`<button type="button" class="botao botao-largo ${espera ? 'esperando' : ''}" data-ev="${c.evento}" data-continuar
    data-restante="${Math.round(c.restanteMs)}" data-pausa="${Math.round(c.pausaMs)}" data-rotulo="${c.rotulo}" aria-disabled="${espera ? 'true' : 'false'}">
    <span class="preenche" aria-hidden="true"></span><span class="rotulo-botao">${espera ? c.texto : c.rotulo}</span></button>`;
}
/** Anima o preenchimento e libera o botão quando a pausa termina. Devolve uma função que cancela. */
export function animarContinuar(raiz) {
  const b = raiz.querySelector('[data-continuar]');
  if (!b) return () => {};
  const resta = Number(b.dataset.restante) || 0, pausa = Number(b.dataset.pausa) || resta;
  if (resta <= 0) return () => {};
  const fill = b.querySelector('.preenche');
  const ini = pausa ? Math.max(0, Math.min(1, 1 - resta / pausa)) : 0;
  let anim = null;
  if (fill && !reduzido() && fill.animate) {
    anim = fill.animate([{ width: `${ini * 100}%` }, { width: '100%' }], { duration: resta, easing: 'linear', fill: 'forwards' });
  }
  const t = setTimeout(() => {
    b.setAttribute('aria-disabled', 'false');
    b.classList.remove('esperando');
    const r = b.querySelector('.rotulo-botao');
    if (r) r.textContent = b.dataset.rotulo || 'Continuar';
    if (fill) fill.style.width = '0';
    if (anim) anim.cancel();
  }, resta + 30);
  return () => { clearTimeout(t); if (anim) anim.cancel(); };
}

/* ---------------- figuras: zoom em tela cheia e imagem que não carregou ---------------- */
/**
 * Prepara as figuras de um trecho já desenhado: tocar abre em tela cheia com zoom;
 * se a imagem não carregou (offline), mostra o aviso e a descrição.
 */
export function prepararFiguras(raiz, { aoAmpliar, textoFalha = 'A imagem não carregou; a descrição está abaixo.' } = {}) {
  const alvos = raiz.querySelectorAll('.enunciado img, .alt-texto img, .par-texto figure.grafico-equipe, .enunciado figure.grafico-equipe, .par-texto img');
  alvos.forEach(el => {
    if (el.dataset.preparado) return;
    el.dataset.preparado = '1';
    if (el.tagName === 'IMG') {
      const falhou = () => {
        const p = document.createElement('div');
        p.className = 'imagem-falhou';
        p.innerHTML = `<p>${esc(textoFalha)}</p><p>${esc(el.getAttribute('alt') || '')}</p>`;
        el.replaceWith(p);
      };
      if (el.complete && el.naturalWidth === 0 && el.getAttribute('src')) falhou();
      else el.addEventListener('error', falhou, { once: true });
    }
    if (el.closest('label')) return;   // alternativa em imagem: tocar escolhe a alternativa (a linha inteira)
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.classList.add('ampliavel');
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Ampliar a figura');
    const dica = document.createElement('span');
    dica.className = 'ampliavel-dica';
    dica.textContent = 'Toque para ampliar';
    dica.setAttribute('aria-hidden', 'true');
    (el.tagName === 'IMG' && el.parentElement && el.parentElement.tagName === 'FIGURE' ? el.parentElement : el).insertAdjacentElement('afterend', dica);
    const abrir = e => { e.preventDefault(); aoAmpliar && aoAmpliar(el); };
    el.addEventListener('click', abrir);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') abrir(e); });
  });
}
