/* =========================================================
   PRUMO · componentes reutilizáveis das telas (design system "Prumo")
   Cada componente é um objeto do material de estudo: cabeçalho de prova,
   cartão-resposta, página pautada, ficha, régua, risquinhos, visto, recado.
   Cada função recebe dados já prontos do núcleo e devolve HTML (h``).
   Nenhuma calcula nível, data, regra ou frase: isso vem dos view models.
   Catálogo e convenções: js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, esc, reduzido } from './dom.js';
import { registrar } from './registro.js';

/* ---------------- marca ---------------- */
/** Símbolo do Prumo (Cadeado-P), sem alteração: anel em marinho (branco no escuro), esquadro azul, fechadura em latão. */
export const simbolo = (classe = '') => cru(`<svg class="simbolo ${classe}" viewBox="-3 -8 55.2 79.2" aria-hidden="true" focusable="false"><path class="anel" fill="none" stroke-width="11.2" d="M6.80 18.80A18.4 18.4 0 1 1 22.00 36.92"/><rect class="haste" x="1.20" y="17.30" width="11.2" height="15.5"/><path class="esquadro" d="M0 26V68L37.2 61.2Z"/><circle class="fechadura" cx="10.4" cy="50" r="3.6"/><rect class="fechadura" x="9" y="50" width="2.8" height="8" rx="0.6"/></svg>`);
/** Símbolo + a palavra "prumo" em minúsculas (Gabarito 700, tinta). No computador, a do topo das abas some (o trilho já tem a marca). */
export const marca = () => h`<span class="marca-prumo">${simbolo()}<span>prumo</span></span>`;

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

/* ---------------- Troféu da Prova do caderno ---------------- */
// taça em traço (24 px, como os ícones das abas): copo, alças, haste e base
export const TACA = '<svg class="pr-trofeu-taca" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.5h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5v1.2a3.3 3.3 0 0 0 3 3.3M17 5.5h2.5v1.2a3.3 3.3 0 0 1-3 3.3"/><path d="M12 13.5v3.5M8.5 20.5h7M9.5 17h5v3.5h-5z"/></svg>';
/** Troféu: o mesmo carimbo do visto (roxo, com falhas de tinta; a única cor de conquista), com a taça,
 *  o nome do caderno e o dia em que a Prova foi vencida. t = { nome, dia: 'aaaa-mm-dd' } do núcleo. */
export function trofeu(t, { novo = false } = {}) {
  if (!t || !t.dia) return '';
  const data = String(t.dia).split('-').reverse().join('/');
  return h`<div class="pr-visto-lugar"><div class="pr-visto pr-trofeu ${novo && !reduzido() ? 'is-novo' : ''}" role="img" aria-label="${`Troféu da Prova do caderno: ${t.nome}, ${data}`}">
    ${cru(TACA)}
    <span class="pr-trofeu-palavra" aria-hidden="true">Troféu</span>
    <span class="pr-visto-obs" aria-hidden="true">${t.nome}</span>
    <span class="pr-visto-data" aria-hidden="true">${data}</span>
  </div></div>`;
}

/* ---------------- nível do capítulo: régua curta de 5 passos com o nome ao lado ---------------- */
/** cheios: 0 a 5; de: quantos já estavam cheios (os novos enchem em 180 ms se animar; nunca anima perda). */
export function nivel({ cheios = 0, de = cheios, animar = false, nome } = {}) {
  const n = nome || (cheios ? `nível ${Math.min(5, cheios)} de 5` : null);   // o núcleo manda o rótulo; isto é só a reserva
  const segs = [0, 1, 2, 3, 4].map(i => `<i class="${i < cheios ? 'cheio' : ''}${animar && !reduzido() && i >= de && i < cheios ? ' novo' : ''}"></i>`).join('');
  return h`<span class="linha-nivel"><span class="nivel" role="img" aria-label="${n ? n.charAt(0).toUpperCase() + n.slice(1) : 'Ainda não começou'}">${cru(segs)}</span>${n ? h`<span class="nivel-nome">${n}</span>` : ''}</span>`;
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
/**
 * Régua da missão: anda pelo que foi feito, nunca por tempo. t = topo do núcleo (passo, progresso, legenda).
 * semPasso: no tópico de prática a trilha já diz onde o aluno está; a legenda fica só com o que falta.
 */
export function regua(t, { semPasso = false } = {}) {
  if (!t || !t.passo) return '';
  const total = Math.max(1, t.passo.total), feitos = Math.max(0, Math.min(total, Math.round((t.progresso || 0) * total)));
  const pct = ((feitos / total) * 100).toFixed(2);
  const lg = t.legenda || {};
  const marcas = total <= 20 ? cru(Array.from({ length: total }, () => '<span></span>').join('')) : '';
  const legenda = semPasso ? (lg.falta ? h`<div class="pr-regua-legenda"><span>${lg.falta}</span></div>` : '')
    : lg.passo ? h`<div class="pr-regua-legenda"><span>${lg.passo}</span>${lg.falta ? h`<span>${lg.falta}</span>` : ''}</div>` : '';
  return h`<div class="pr-regua">
    <div class="pr-regua-barra" style="--feito:${pct}%;--passos:${total <= 20 ? total : 1}" role="progressbar" aria-label="Passos da missão" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${feitos}" aria-valuetext="${[lg.passo, lg.falta].filter(Boolean).join(', ')}">
      <span class="pr-regua-cheio"></span>
      <span class="pr-regua-tracos" aria-hidden="true"><svg preserveAspectRatio="none">${cru(TRACOS)}</svg></span>
      <span class="pr-regua-marcas" aria-hidden="true">${marcas}</span>
    </div>
    ${legenda}
  </div>`;
}

/* ---------------- missão: topo e medidor ---------------- */
/** Medidor de duas casas (c.3): o que cada casa conta vem do núcleo (md.descricoes). */
export function medidor(md) {
  if (!md) return '';
  const desc = md.descricoes || ['um acerto seguido', 'acerto em questão de aplicar'];
  return h`<div class="medidor">
    <span class="casas">${cada(md.casas, (c, i) => h`<span class="casa ${c.cheia ? 'cheia' : ''}" aria-label="${`${i + 1}ª casa (${desc[i]}): ${c.cheia ? 'preenchida, ' + c.rotulo : 'vazia'}`}"><span aria-hidden="true">${c.rotulo}</span></span>`)}</span>
    ${md.texto ? h`<span class="medidor-texto">${md.texto}</span>` : ''}
  </div>`;
}
/** No tópico: uma linha só, "2 certas seguidas: falta 1". */
function contador(md) {
  const cheias = (md.casas || []).filter(c => c.cheia).length, total = (md.casas || []).length || 2;
  const falta = total - cheias;
  return h`<p class="contador">${falta <= 0 ? `${total} certas seguidas: feito` : `${total} certas seguidas: falta${falta > 1 ? 'm' : ''} ${falta}`}</p>`;
}
/**
 * Topo da missão: a etapa e "Encerrar"; no tópico de prática, a trilha logo abaixo (sempre no mesmo lugar);
 * a Régua (passo N de M e o que falta) e o medidor nos passos que contam. No tópico, a régua só aparece
 * na etapa Questões. A regra da rodada aparece uma vez, no início.
 * trilha: { fase, livre } (ver trilha()); rotuloDaTela: o título da tela (a etapa some se ele já a diz).
 */
export function topo(t, { medidor: md, encerrar = 'encerrar', semRegra = false, rotuloDaTela = null, trilha: tr = null } = {}) {
  if (!t) return '';
  const m = md === undefined ? t.medidor : md;
  const comTrilha = !!(tr && tr.fase);
  // no tópico, a regra já foi dita no "Como funciona": o topo fica só com a trilha e o contador
  const verRegra = t.regra && !t.regra.mostrarAgora && !semRegra && !comTrilha;
  const etapa = rotuloDaTela && t.etapa && String(rotuloDaTela).toLowerCase().startsWith(String(t.etapa).toLowerCase()) ? '' : t.etapa;
  const comRegua = !comTrilha;
  return h`<header class="topo ${comTrilha ? 'topo-topico' : ''}">
    <div class="topo-linha">
      <p class="topo-etapa">${etapa}</p>
      <div class="topo-acoes">
        ${verRegra ? h`<button type="button" class="link link-discreto" data-folha="regra">${t.regra.rotulo}</button>` : ''}
        ${encerrar ? h`<button type="button" class="link" data-folha="${encerrar}">${t.encerrar || 'Encerrar'}</button>` : ''}
      </div>
    </div>
    ${comTrilha ? trilha(tr.fase, { livre: tr.livre }) : ''}
    ${comRegua || m ? h`<div class="topo-progresso">
      ${comRegua ? regua(t, { semPasso: comTrilha }) : ''}
      ${m ? h`<div class="topo-medidor">${comTrilha ? contador(m) : medidor(m)}</div>` : ''}
    </div>` : ''}
  </header>
  ${t.regra && t.regra.mostrarAgora && !semRegra && !comTrilha ? h`<p class="regra-linha">${t.regra.texto}</p>` : ''}`;
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
// alternativa de questão do INEP em HTML (tópicos de prática): o texto vem do conteúdo, como o enunciado
const textoAlt = a => (a.html ? cru(a.texto || '') : (a.texto || ''));
const imagemAlt = a => (a.imagem ? h`<span class="alt-img"><img src="${a.imagem.src}" alt="${a.imagem.alt || ''}" loading="lazy"></span>` : '');
/** Cartão-resposta para responder: rádio nativo, a linha inteira é o alvo, bolha oval A–E. */
export function alternativasPergunta(alts, marcada, nome = 'alt') {
  return h`<fieldset class="cartao"><legend class="so-leitor">Alternativas</legend><ol class="alternativas">${cada(alts, a => h`<li>
      <label class="alt ${marcada === a.letra ? 'marcada' : ''}">
        <input type="radio" name="${nome}" value="${a.letra}" data-mudar="escolherAlt" ${marcada === a.letra ? cru('checked') : ''}>
        <span class="letra" aria-hidden="true">${a.letra}</span>
        <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${textoAlt(a)}${imagemAlt(a)}</span>
      </label></li>`)}</ol></fieldset>`;
}
/** Cartão-resposta corrigido: a certa ganha o círculo de caneta; a sua marcação fica em grafite. Sem vermelho. */
export function alternativasFeedback(alts) {
  return h`<ol class="alternativas">${cada(alts, a => {
    const sua = a.marca === 'sua' || a.marca === 'sua-certa', certa = a.marca === 'certa' || a.marca === 'sua-certa';
    const nota = a.marca === 'sua-certa' ? 'sua marcação, certa' : a.marca === 'sua' ? 'sua marcação' : a.marca === 'certa' ? 'certa' : '';
    return h`<li><div class="alt estatica ${certa ? 'certa' : sua ? 'sua' : ''}">
      <span class="letra" aria-hidden="true">${a.letra}</span>
      <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${textoAlt(a)}${imagemAlt(a)}${nota ? h`<span class="nota-alt">${nota}</span>` : ''}</span>
    </div></li>`;
  })}</ol>`;
}

/* ---------------- Trecho: a página pautada do caderno ---------------- */
function figura(f) {
  if (!f) return '';
  return h`${cru(f.html || '')}${f.legenda && f.tipo !== 'tabela' ? h`<p class="legenda">${f.legenda}</p>` : ''}`;
}
/** Espaço inseparável em "p. 2", "R$ 6", "20 km", "25 min": o número não fica sozinho no começo da linha. */
export const semQuebra = s => String(s == null ? '' : s).replace(/(^|[\s(])(p\.|R\$) (?=\d)/g, '$1$2 ').replace(/(\d) (km|min)(?![\wÀ-ú])/g, '$1 $2');
/** Um parágrafo com o § na margem; o atual ganha o fio de prumo; grifar: marca-texto no trecho que o erro cobrou. */
export function paragrafo(par, ancora, { grifar = false } = {}) {
  const aqui = par.id === ancora;
  const corpo = cru(semQuebra(par.html || ''));
  return h`<div class="par ${aqui ? 'ancora' : ''}" id="${par.id}" data-par="${par.id}">
    <span class="par-n" aria-hidden="true">§ ${par.n}</span>
    ${aqui ? cru('<span class="fio-prumo" aria-hidden="true"></span>') : ''}
    <div class="par-texto"><span class="so-leitor">Parágrafo ${par.n}. </span><p class="pautado">${aqui && grifar ? h`<span class="marca-texto">${corpo}</span>` : corpo}</p>${figura(par.figura)}</div>
    ${par.notas && par.notas.length ? h`<div class="par-notas">${cada(par.notas, n => h`<p class="nota-margem">${n.texto}</p>`)}</div>` : ''}
  </div>`;
}
/** A folha pautada: margem rosa e § na margem; a pauta azul vem de cada parágrafo (.pautado), não da folha. */
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
  const alvos = raiz.querySelectorAll('.teoria-figura svg, .teoria-imagem img, .enunciado img, .alt-texto img, .par-texto figure.grafico-equipe, .enunciado figure.grafico-equipe, .par-texto img');
  // com mouse, "clique"; no toque, "toque"
  const comMouse = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  alvos.forEach((el, i) => {
    if (el.dataset.preparado) return;
    el.dataset.preparado = '1';
    el.dataset.fig = String(i);   // a casca devolve o foco à figura quando a folha do zoom fecha
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
    dica.textContent = comMouse ? 'Clique para ampliar' : 'Toque para ampliar';
    dica.setAttribute('aria-hidden', 'true');
    // sempre logo abaixo da figura e antes da legenda (foto, anúncio ou gráfico em SVG)
    el.insertAdjacentElement('afterend', dica);
    const abrir = e => { e.preventDefault(); aoAmpliar && aoAmpliar(el); };
    el.addEventListener('click', abrir);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') abrir(e); });
  });
}
/** Zoom inicial da figura ampliada (1 = a largura da folha). No celular, a folha ocupa a tela inteira e a
 *  figura abre com 1,5 vez a largura que tinha na página (no mínimo, a largura da tela), com rolagem;
 *  no tablet e no computador, a largura da folha. */
export function zoomInicial(el) {
  const celular = !!(window.matchMedia && window.matchMedia('(max-width: 719.98px)').matches);
  const w = el && el.getBoundingClientRect ? el.getBoundingClientRect().width : 0;
  if (!celular || !w || !window.innerWidth) return 1;
  return Math.round(Math.min(4, Math.max(1, (1.5 * w) / window.innerWidth)) * 100) / 100;
}
/** "Toque para ampliar": abre a folha do zoom com uma cópia limpa da figura (sem papel de botão nem dica). */
export function ampliarFigura(ctx, el) {
  const c = el.cloneNode(true);
  ['role', 'tabindex', 'data-fig', 'data-preparado'].forEach(a => c.removeAttribute(a));
  if (c.getAttribute('aria-label') === 'Ampliar a figura') c.removeAttribute('aria-label');
  else if (c.tagName.toLowerCase() === 'svg' && c.getAttribute('aria-label')) c.setAttribute('role', 'img');   // a descrição da figura continua
  c.classList.remove('ampliavel');
  ctx.abrirFolha('zoom', { html: c.outerHTML, zoom: zoomInicial(el) }, el);
}


/* ---------------- Teoria de um tópico de prática: a apostila impressa ----------------
   A apostila tem cara própria (folha branca impressa, capa, sumário, caixas), diferente
   do caderno pautado (o que é do aluno) e do caderno de prova (a questão do Enem).
   Cada seção tem id ("secao-N", o mesmo da âncora que o núcleo manda; "secao-cuidado" e
   "secao-resumo" nos quadros do fim): o sumário leva até ela e "Rever a apostila" abre nela. */
function livroDe(fontes) {
  const f = (fontes || []).find(x => /^Wikilivros, /.test(x.titulo));
  if (!f) return null;
  return f.titulo.replace(/^Wikilivros, /, '').split('/')[0];
}
const idSecao = n => `secao-${n}`;
/** Âncora de seção vinda do núcleo (3, "3" ou "secao-3") → id do elemento na apostila. */
export function idDaAncora(a) {
  if (a == null || a === '') return null;
  if (typeof a === 'object') return idDaAncora(a.id != null ? a.id : a.n);
  return /^\d+$/.test(String(a)) ? idSecao(a) : String(a);
}
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

/** "Confira": pergunta de recordação no fim da seção. Tocar numa opção mostra na hora se acertou e o porquê.
 *  Não conta para o nível nem fica salva: é só para o aluno testar a memória antes de seguir (prática de recordação). */
function confira(c, n) {
  const id = `confira-${n}`;
  return h`<div class="confira" role="group" aria-labelledby="${id}-p" data-certa="${c.certa}">
    <p class="confira-rotulo">Confira</p>
    <p class="confira-pergunta" id="${id}-p">${c.pergunta}</p>
    <ul class="confira-opcoes">${cada(c.opcoes, (o, i) => h`<li><button type="button" class="confira-op" data-acao="conferir" data-arg="${i}">${o}</button></li>`)}</ul>
    <p class="confira-resposta" role="status" aria-live="polite" data-porque="${c.porque}"></p>
  </div>`;
}
/** Toque numa opção do "Confira": marca a escolhida e a certa, sem redesenhar a página (a leitura não pula). */
export function conferir(el) {
  const box = el.closest('.confira');
  if (!box || box.classList.contains('respondida')) return;
  const certa = Number(box.dataset.certa), i = Number(el.dataset.arg);
  box.classList.add('respondida');
  box.querySelectorAll('.confira-op').forEach((b, k) => {
    b.setAttribute('aria-disabled', 'true');
    if (k === certa) b.classList.add('certa');
    if (k === i && i !== certa) b.classList.add('errada');
    if (k === i) b.setAttribute('aria-pressed', 'true');
  });
  const r = box.querySelector('.confira-resposta');
  const op = box.querySelectorAll('.confira-op')[certa];
  r.textContent = `${i === certa ? 'Isso.' : `A certa é: ${op ? op.textContent.replace(/\.$/, '') : ''}.`} ${r.dataset.porque || ''}`.trim();
}

/** Tabela de texto (3 colunas ou mais, com célula longa): no celular, cada linha vira uma ficha empilhada,
 *  com o nome da coluna antes de cada valor (data-rotulo). Tabelas de números ficam em grade. */
const emFichas = tb => (tb.cabecalho || []).length >= 3 && (tb.linhas || []).some(l => l.some(c => String(c).replace(/<[^>]*>/g, '').length > 24));

/**
 * t = teoria do núcleo: seções (parágrafos, figura, tabela, quadro "No Enem", exemplos), armadilhas e resumo.
 * naFolha: dentro da folha "Rever a apostila" (sem capa: o título já está na folha; uma coluna em qualquer tela).
 * ancora/grifar: a seção que a questão cobrou ganha o marca-texto no título.
 */
export function teoria(t, { tituloComoH1 = true, naFolha = false, ancora = null, grifar = false } = {}) {
  if (!t) return '';
  const secoes = t.secoes || [];
  const alvo = idDaAncora(ancora);
  const livro = livroDe(t.fontes);
  const nEx = secoes.reduce((s, x) => s + (x.exemplos || []).length, 0);
  // o núcleo manda o tempo (o mesmo da missão); a conta daqui é só a reserva, com a mesma regra
  const min = Number.isFinite(t.minutos) ? t.minutos
    : Math.max(5, Math.round(secoes.reduce((s, x) => s + (x.paragrafos || []).join(' ').split(/\s+/).length, 0) / 140 + nEx * 1.5));
  const materia = String(t.cabeco || '').replace(/: teoria$/, '');
  const temCuidado = !!(t.armadilhas && t.armadilhas.length), temResumo = !!(t.resumo && t.resumo.length);
  const itens = [
    ...secoes.map(sc => ({ id: idSecao(sc.n), n: sc.n, titulo: sc.titulo })),
    ...(temCuidado ? [{ id: 'secao-cuidado', titulo: 'Cuidado: erros comuns' }] : []),
    ...(temResumo ? [{ id: 'secao-resumo', titulo: 'Resumo do tópico' }] : []),
  ];
  const T = tituloComoH1 ? h`<h1 class="pagina-titulo apostila-titulo" id="pg-titulo" tabindex="-1" data-foco-inicial>${t.titulo}</h1>` : h`<h2 class="pagina-titulo apostila-titulo" id="pg-titulo">${t.titulo}</h2>`;
  const tituloSecao = (id, conteudo) => (grifar && alvo === id ? h`<span class="marca-texto">${conteudo}</span>` : conteudo);
  // o número da seção fica à parte do título (no sumário e na seção), em Mono
  const sumario = itens.length > 1 ? h`<nav class="apostila-sumario" aria-label="Sumário da apostila">
      <button type="button" class="sumario-abrir" data-acao="sumarioAbrir" aria-expanded="false" aria-controls="sumario-lista">Sumário: ${plural(secoes.length, 'seção', 'seções')}</button>
      <p class="rotulo sumario-rotulo">Neste tópico</p>
      <ol class="sumario-lista" id="sumario-lista">${cada(itens, it => h`<li><button type="button" class="sumario-item" data-acao="irSecao" data-arg="${it.id}">${it.n ? h`<span class="sumario-n" aria-hidden="true">${it.n}</span>` : h`<span class="sumario-n" aria-hidden="true"></span>`}<span>${it.titulo}</span></button></li>`)}</ol>
    </nav>` : '';
  return h`<article class="pagina-livro teoria apostila ${naFolha ? 'apostila-folha' : 'apostila-larga'}" ${naFolha ? cru(`aria-label="${esc(t.titulo)}"`) : cru('aria-labelledby="pg-titulo"')}>
    ${naFolha ? '' : h`<header class="apostila-capa">
      <p class="apostila-selo">Apostila${materia ? h` de ${materia}` : ''}</p>
      ${T}
      ${livro ? h`<p class="apostila-base">Adaptada do livro <cite>${livro}</cite>, do Wikilivros</p>` : ''}
      <p class="apostila-dados">${plural(secoes.length, 'seção', 'seções')}, ${plural(nEx, 'exemplo resolvido', 'exemplos resolvidos')}, cerca de ${min}${cru('&nbsp;')}min</p>
    </header>`}
    ${sumario}
    <div class="apostila-corpo">
      ${t.porQueCai ? h`<p class="apostila-abre pautado"><strong>Por que cai no Enem.</strong> ${t.porQueCai}</p>` : ''}
      ${t.termos && t.termos.length ? h`<aside class="apostila-quadro quadro-termos" aria-labelledby="termos-t"><h2 class="quadro-rotulo" id="termos-t">Termos que você vai ver</h2><dl class="termos">${cada(t.termos, x => h`<div><dt>${x.termo}</dt><dd>${x.def}</dd></div>`)}</dl></aside>` : ''}
      ${cada(secoes, sc => h`<section class="teoria-secao ${alvo === idSecao(sc.n) ? 'ancora' : ''}" id="${idSecao(sc.n)}" aria-labelledby="${idSecao(sc.n)}-t">
        <h2 class="teoria-sub" id="${idSecao(sc.n)}-t" tabindex="-1"><span class="teoria-n" aria-hidden="true">${sc.n}</span><span>${tituloSecao(idSecao(sc.n), sc.titulo)}</span></h2>
        ${cada(sc.paragrafos, p => h`<p class="pautado">${p}</p>`)}
        ${sc.imagem ? h`<figure class="teoria-imagem"><img src="${sc.imagem.src}" alt="${sc.imagem.alt}" loading="lazy" decoding="async"><figcaption>${sc.imagem.legenda ? h`<span>${sc.imagem.legenda}</span>` : ''}<span class="credito-imagem">${sc.imagem.credito}</span></figcaption></figure>` : ''}
        ${sc.figura ? h`<figure class="teoria-figura" role="group" aria-label="${sc.figura.alt}">${cru(sc.figura.svg)}${sc.figura.legenda ? h`<figcaption>${sc.figura.legenda}</figcaption>` : ''}</figure>` : ''}
        ${sc.tabela ? h`<div class="teoria-tabela-rolagem"><table class="teoria-tabela ${emFichas(sc.tabela) ? 'fichas' : ''}">${sc.tabela.legenda ? h`<caption>${sc.tabela.legenda}</caption>` : ''}
          ${sc.tabela.cabecalho.length ? h`<thead><tr>${cada(sc.tabela.cabecalho, c => h`<th scope="col">${c}</th>`)}</tr></thead>` : ''}
          <tbody>${cada(sc.tabela.linhas, l => h`<tr>${cada(l, (c, i) => h`<td data-rotulo="${sc.tabela.cabecalho[i] || ''}">${c}</td>`)}</tr>`)}</tbody></table></div>` : ''}
        ${cada(sc.exemplos, ex => h`<div class="exemplo">
          <p class="exemplo-rotulo">Exemplo resolvido ${ex.n}</p>
          <p class="exemplo-enunciado">${ex.enunciado}</p>
          <p class="exemplo-res">Resolução</p>
          <ol class="exemplo-passos">${cada(ex.resolucao, r => h`<li>${r}</li>`)}</ol>
        </div>`)}
        ${sc.atencao ? h`<aside class="apostila-quadro quadro-enem teoria-enem"><p class="quadro-rotulo"><span class="grifo">${sc.atencao.rotulo}</span></p><p>${sc.atencao.texto}</p></aside>` : ''}
        ${sc.confira ? confira(sc.confira, sc.n) : ''}
      </section>`)}
      ${temCuidado ? h`<aside class="apostila-quadro quadro-cuidado teoria-secao ${alvo === 'secao-cuidado' ? 'ancora' : ''}" id="secao-cuidado" aria-labelledby="secao-cuidado-t"><h2 class="quadro-rotulo" id="secao-cuidado-t" tabindex="-1"><span class="grifo">${tituloSecao('secao-cuidado', 'Cuidado: erros comuns')}</span></h2><ul class="teoria-lista">${cada(t.armadilhas, a => h`<li>${a}</li>`)}</ul></aside>` : ''}
      ${temResumo ? h`<section class="apostila-quadro quadro-resumo teoria-secao teoria-resumo ${alvo === 'secao-resumo' ? 'ancora' : ''}" id="secao-resumo" aria-labelledby="secao-resumo-t"><h2 class="quadro-rotulo" id="secao-resumo-t" tabindex="-1">${tituloSecao('secao-resumo', 'Resumo do tópico')}</h2><ul class="teoria-lista">${cada(t.resumo, a => h`<li>${a}</li>`)}</ul></section>` : ''}
    </div>
    ${t.habilidades && t.habilidades.length ? h`<section class="teoria-rodape"><p class="rotulo">Habilidades do Enem</p><ul class="teoria-lista pequeno">${cada(t.habilidades, x => h`<li>${x.codigo}: ${x.descricao}</li>`)}</ul></section>` : ''}
    ${t.fontes && t.fontes.length ? h`<section class="teoria-rodape"><p class="rotulo">Fontes</p>
      <ul class="teoria-lista pequeno">${cada(t.fontes, f => h`<li>${f.adaptado ? 'Adaptado de ' : ''}${f.url ? h`<a href="${f.url}" target="_blank" rel="noopener">${f.titulo}</a>` : f.titulo}${f.licenca ? h` (${f.licencaUrl ? h`<a href="${f.licencaUrl}" target="_blank" rel="noopener">${f.licenca}</a>` : f.licenca})` : ''}</li>`)}</ul>
      ${secoes.some(x => x.imagem) ? h`<p class="rotulo" style="margin-top:12px">Imagens</p><ul class="teoria-lista pequeno">${cada(secoes.filter(x => x.imagem), x => h`<li>${x.imagem.credito}</li>`)}</ul>` : ''}
      </section>` : ''}
    ${t.adaptacao ? h`<p class="rodape-licenca">${t.adaptacao}</p>` : ''}
    ${t.credito && (!t.adaptacao || /revisado/.test(t.credito)) ? h`<p class="rodape-licenca">${t.credito}</p>` : ''}
  </article>`;
}

/**
 * Acompanha a leitura: o item do sumário da seção que está no alto da tela ganha aria-current.
 * Devolve a limpeza (desliga o observador). Na folha, o rolamento é o da folha.
 */
export function acompanharSumario(raiz) {
  const nav = raiz && raiz.querySelector('.apostila-sumario');
  if (!nav) return () => {};
  const botoes = new Map([...nav.querySelectorAll('[data-acao="irSecao"]')].map(b => [b.dataset.arg, b]));
  const secoes = [...botoes.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const caixa = nav.closest('.folha-corpo'), alvo = caixa || window;
  let pendente = false;
  // a seção atual é a última cujo começo já passou do primeiro terço da tela (ou da folha)
  const marcar = () => {
    pendente = false;
    const topo = caixa ? caixa.getBoundingClientRect().top : 0, alt = caixa ? caixa.clientHeight : window.innerHeight;
    let atual = null;
    for (const s of secoes) { if (s.getBoundingClientRect().top - topo <= alt * 0.3) atual = s; else break; }
    botoes.forEach((b, id) => { if (atual && id === atual.id) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  const aoRolar = () => { if (!pendente) { pendente = true; requestAnimationFrame(marcar); } };
  alvo.addEventListener('scroll', aoRolar, { passive: true });
  marcar();
  return () => alvo.removeEventListener('scroll', aoRolar);
}
/** Leva a vista até uma seção da apostila (na página ou dentro da folha) e põe o foco no título dela. */
export function irParaSecao(id, { suave = true } = {}) {
  const alvo = id && document.getElementById(id);
  if (!alvo) return false;
  alvo.scrollIntoView({ block: 'start', behavior: suave && !reduzido() ? 'smooth' : 'auto' });
  const t = alvo.querySelector('h2');
  if (t) t.focus({ preventScroll: true });
  return true;
}

/* ---------------- Trilha do tópico: onde o aluno está (Aquecer → Apostila → Questões → Visto) ----------------
   Não é botão nem aba: número e rótulo, a etapa atual sublinhada em tinta, as feitas com ✓.
   No estudo por conta própria não há visto: a última etapa é "Registro". fase 'fim' = tudo feito (Pronto). */
const ETAPAS = [['aquecer', 'Aquecer'], ['apostila', 'Leitura'], ['questoes', 'Questões'], ['visto', 'Visto']];
export function trilha(fase, { livre = false } = {}) {
  if (!fase) return '';
  const etapas = livre ? [...ETAPAS.slice(0, 3), ['visto', 'Registro']] : ETAPAS;
  // o núcleo chama a última etapa do estudo livre de 'registro': é a mesma casa do 'visto'
  const chave = fase === 'registro' ? 'visto' : fase;
  const i = chave === 'fim' ? etapas.length : etapas.findIndex(e => e[0] === chave);
  const estado = k => (k < i ? 'feita' : k === i ? 'atual' : 'depois');
  return h`<ol class="trilha" aria-label="Etapas do tópico">${cada(etapas, (e, k) => h`<li class="${estado(k)}" ${k === i ? cru('aria-current="step"') : ''}><span class="trilha-passo"><span class="trilha-n" aria-hidden="true">${k < i ? '✓' : k + 1}</span><span class="trilha-rotulo">${e[1]}</span></span>${k < i ? h`<span class="so-leitor"> (feita)</span>` : ''}</li>`)}</ol>`;
}
/**
 * "Como funciona um tópico" (primeira vez aberta, logo depois do botão; depois, recolhida).
 * itens: [{ titulo, texto }] do núcleo (topicoPagina().comoFunciona, com a regra do nível fiel ao motor).
 * A lista daqui é só a reserva, com o mesmo texto, para um núcleo que ainda não a mande.
 */
const COMO_FUNCIONA = [
  { titulo: 'Aquecer', texto: 'Uma questão antes de ler. Chute se não souber: a ideia é ler a apostila já com a dúvida na cabeça. A resposta aparece depois da leitura.' },
  { titulo: 'Leitura', texto: 'A apostila do tópico, com exemplos resolvidos, figuras e tabelas. Se você já domina, pode pular.' },
  { titulo: 'Questões do Enem', texto: 'Questões de provas reais. Acerte 2 seguidas e o tópico entra no nível 1 de 5. Errou? A contagem recomeça e a explicação mostra o que faltou.' },
  { titulo: 'Visto do dia', texto: 'Terminou, ganhou o visto e o dia conta. Depois, o Prumo marca as revisões até a prova: cada revisão certa sobe um nível, e errar uma revisão desce um.' },
];
export function comoFunciona({ aberto = false, itens = COMO_FUNCIONA } = {}) {
  if (!itens || !itens.length) return '';
  const lista = h`<ol class="como-funciona">${cada(itens, (x, k) => h`<li><span class="cf-n" aria-hidden="true">${k + 1}</span><div><strong>${x.titulo}</strong><p>${x.texto}</p></div></li>`)}</ol>`;
  return aberto
    ? h`<section class="secao como-funciona-caixa" aria-labelledby="cf-t"><h2 class="titulo-pequeno" id="cf-t">Como funciona um tópico</h2>${lista}</section>`
    : h`<details class="secao como-funciona-caixa"><summary class="titulo-pequeno">Como funciona um tópico</summary>${lista}</details>`;
}

/* ---------------- ações da apostila (sumário) ---------------- */
registrar({
  acoes: {
    conferir(ctx, el) { conferir(el); },
    /** Item do sumário: leva até a seção (não usa href="#…": o roteador usa o hash). */
    irSecao(ctx, el) {
      const nav = el.closest('.apostila-sumario');
      if (nav && nav.classList.contains('aberto')) { nav.classList.remove('aberto'); const b = nav.querySelector('.sumario-abrir'); if (b) b.setAttribute('aria-expanded', 'false'); }
      irParaSecao(el.dataset.arg);
    },
    /** No celular, o sumário fica recolhido atrás de "Sumário: N seções". */
    sumarioAbrir(ctx, el) {
      const nav = el.closest('.apostila-sumario');
      if (!nav) return;
      const aberto = nav.classList.toggle('aberto');
      el.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    },
  },
});

/* ---------------- ícone da área (a única cor fora da tinta: uma por área do Enem) ---------------- */
const AREA_ID = { 'Matemática': 'MT', 'Linguagens': 'LC', 'Ciências da Natureza': 'CN', 'Ciências Humanas': 'CH' };
const AREA_TRACO = {
  MT: '<path d="M7 4v6M4 7h6M14 7h6M5 15l4 4M9 15l-4 4M14 16h6M14 19h6"/>',
  LC: '<path d="M4 5.5c2.5-1 5-1 8 1 3-2 5.5-2 8-1V19c-2.5-1-5-1-8 1-3-2-5.5-2-8-1z"/><path d="M12 6.5V20"/>',
  CN: '<path d="M9.5 3.5h5M10.5 3.5v5.5L5 18.5A1.5 1.5 0 0 0 6.3 20.5h11.4A1.5 1.5 0 0 0 19 18.5L13.5 9V3.5"/><path d="M7.5 14.5h9"/>',
  CH: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.6 5.2 3.6 8.5S14.6 18.1 12 20.5M12 3.5C9.4 5.9 8.4 8.7 8.4 12s1 6.1 3.6 8.5"/>',
};
/** Ícone da área do Enem, na cor da área. Aceita o id (MT, LC, CN, CH) ou o nome. Decorativo: o nome da área vem ao lado. */
export function iconeArea(area) {
  const id = AREA_TRACO[area] ? area : AREA_ID[area];
  if (!id) return '';
  return cru(`<span class="icone-area area-${id.toLowerCase()}" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${AREA_TRACO[id]}</svg></span>`);
}
