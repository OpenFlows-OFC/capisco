/* =========================================================
   PRUMO · componentes reutilizáveis das telas (c.0.1)
   Cada função recebe dados já prontos do núcleo e devolve HTML (h``).
   Nenhuma calcula nível, data, regra ou frase: isso vem dos view models.
   Catálogo e convenções: js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, esc, reduzido } from './dom.js';
import { NIVEL } from '../nucleo/motor.js';   // só os nomes dos níveis (rótulos), nenhuma regra

/* ---------------- ícones (traço de 1,5 px, geométricos) ---------------- */
const engrenagemPath = (() => {
  const c = 12, r1 = 7.1, r2 = 9.7, n = 8, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n;
    for (const [r, da] of [[r1, -0.34], [r2, -0.2], [r2, 0.2], [r1, 0.34]]) pts.push([c + r * Math.sin(a + da), c - r * Math.cos(a + da)]);
  }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
})();
export const icones = {
  engrenagem: cru(`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${engrenagemPath}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="miter"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`),
  fechar: cru('<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'),
  certo: cru('<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.5 8.5L6.2 12.2L13.5 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square"/></svg>'),
};
/** Engrenagem no topo das três abas → Ajustes e dados (c.0). */
export const linkAjustes = () => h`<a class="engrenagem" href="#/ajustes" aria-label="Ajustes e dados">${icones.engrenagem}</a>`;
/** Símbolo do Prumo (Cadeado-P), com cores pelos tokens do tema. */
export const simbolo = (classe = '') => cru(`<svg class="marca ${classe}" viewBox="-3 -8 55.2 79.2" aria-hidden="true" focusable="false"><path class="anel" fill="none" stroke-width="11.2" d="M6.80 18.80A18.4 18.4 0 1 1 22.00 36.92"/><rect class="haste" x="1.20" y="17.30" width="11.2" height="15.5"/><path class="esquadro" d="M0 26V68L37.2 61.2Z"/><circle class="fechadura" cx="10.4" cy="50" r="3.6"/><rect class="fechadura" x="9" y="50" width="2.8" height="8" rx="0.6"/></svg>`);

/* ---------------- constância: régua (A) e chama (B) ---------------- */
/**
 * Régua de constância (d.2): fio de 1 px; um traço de 1 × 6 px por dia estudado; 10 px a cada 5;
 * traço de latão de 2 px no último dia de cada semana com a meta. Sem círculos, canto vivo.
 * tracos: [{ dia, n, longo, latao }] (do núcleo). animarUltimo: o traço de hoje cresce (200 ms).
 */
export function regua(tracos, { animarUltimo = false, passo = 5, rotulo = '' } = {}) {
  const lista = tracos || [];
  const w = Math.max(lista.length * passo + 3, 40);
  const linhas = lista.map((t, i) => {
    const x = 2 + i * passo + 0.5, alto = t.longo ? 10 : 6;
    const classe = ['traco', t.latao ? 'traco-latao' : '', animarUltimo && i === lista.length - 1 && !reduzido() ? 'traco-hoje' : ''].filter(Boolean).join(' ');
    return `<line class="${classe}" x1="${t.latao ? x + 0.5 : x}" y1="13" x2="${t.latao ? x + 0.5 : x}" y2="${13 - alto}" stroke-width="${t.latao ? 2 : 1}"/>`;
  }).join('');
  return cru(`<svg class="regua" width="${w}" height="14" viewBox="0 0 ${w} 14" role="img" aria-label="${esc(rotulo || 'Régua de constância')}"><line class="base" x1="0" y1="13.5" x2="${w}" y2="13.5" stroke-width="1"/>${linhas}</svg>`);
}
/** Chama geométrica (versão B, Decisão 3): traço de 1,5 px em latão; acende na semana com a meta e nunca apaga. */
export function chama(acesa, { grande = false, rotulo = '' } = {}) {
  // geometria: arco de círculo embaixo, retas até a ponta e uma língua menor à esquerda (canto vivo)
  const ext = 'M13 2L17.87 12.2A6.5 6.5 0 1 1 5.89 12.78L7.2 7.6L9.7 10.4Z';
  const int = 'M12 11L14.32 14.93A2.7 2.7 0 1 1 9.68 14.93Z';
  return cru(`<svg class="chama ${acesa ? 'acesa' : 'apagada'} ${grande ? 'chama-grande' : ''}" viewBox="0 0 24 24" role="img" aria-label="${esc(rotulo || (acesa ? 'Chama acesa' : 'Chama ainda apagada'))}"><path class="externa" d="${ext}"/><path class="interna" d="${int}"/></svg>`);
}
/** Símbolo escolhido em Ajustes + o rótulo "N dias estudados" (o mesmo em todas as telas). */
export function constancia(c, { tracos, animarUltimo = false, grande = false } = {}) {
  if (!c) return '';
  const chamaRot = c.chama && c.chama.acesa ? `Chama acesa: ${c.chama.acesas} ${c.chama.acesas === 1 ? 'semana' : 'semanas'} com a meta` : 'Chama apagada: nenhuma semana com a meta ainda';
  const sim = c.simbolo === 'regua'
    ? regua(tracos || c.miniRegua || c.regua || [], { animarUltimo, rotulo: `Régua de constância: ${c.rotulo}` })
    : chama(c.chama && c.chama.acesa, { grande, rotulo: chamaRot });
  return h`${sim}<span class="constancia-rotulo num">${c.rotulo}</span>`;
}

/* ---------------- nível do capítulo: 5 segmentos com o nome ao lado ---------------- */
/** cheios: 0 a 5; de: quantos já estavam cheios (os novos se preenchem em 200 ms se animar). */
export function nivel({ cheios = 0, de = cheios, animar = false, nome } = {}) {
  const n = nome || (cheios ? NIVEL[cheios] : null);
  const segs = [0, 1, 2, 3, 4].map(i => `<i class="${i < cheios ? 'cheio' : ''}${animar && !reduzido() && i >= de && i < cheios ? ' novo' : ''}"></i>`).join('');
  return h`<span class="linha-nivel"><span class="nivel" role="img" aria-label="${n ? `Nível: ${n}` : 'Nível: ainda sem nível'}">${cru(segs)}</span>${n ? h`<span class="nivel-nome">${n}</span>` : ''}</span>`;
}

/* ---------------- missão: topo, medidor, progresso ---------------- */
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
 * Topo da missão em no máximo duas linhas: etapa e "Encerrar"; o medidor (só nos passos que contam);
 * a linha fina de progresso (contínua, sem graduação e sem total) é o fio de baixo.
 */
export function topo(t, { medidor: md, encerrar = 'encerrar', semRegra = false, rotuloDaTela = null } = {}) {
  if (!t) return '';
  const m = md === undefined ? t.medidor : md;
  const pct = Math.round(Math.max(0, Math.min(1, t.progresso || 0)) * 100);
  const verRegra = t.regra && !t.regra.mostrarAgora && !semRegra;
  return h`<header class="topo">
    <div class="topo-linha">
      <p class="rotulo topo-etapa">${rotuloDaTela && String(t.etapa).toUpperCase() === String(rotuloDaTela).toUpperCase() ? '' : t.etapa}</p>
      <div class="topo-acoes">
        ${verRegra ? h`<button type="button" class="link link-discreto" data-folha="regra">${t.regra.rotulo}</button>` : ''}
        ${encerrar ? h`<button type="button" class="link" data-folha="${encerrar}">${t.encerrar || 'Encerrar'}</button>` : ''}
      </div>
    </div>
    ${m ? h`<div class="topo-medidor">${medidor(m)}</div>` : ''}
    <div class="progresso" role="progressbar" aria-label="Passos da missão" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
  </header>
  ${t.regra && t.regra.mostrarAgora && !semRegra ? h`<p class="regra-linha">${t.regra.texto}</p>` : ''}`;
}

/* ---------------- questão: enunciado, alternativas, rodapé ---------------- */
/** Rodapé de atribuição com o link da licença (c.3d). */
export function rodape(texto, url) {
  if (!texto) return '';
  if (!url) return h`<p class="rodape-licenca">${texto}</p>`;
  const semProto = url.replace(/^https?:\/\//, '');
  let i = texto.indexOf(semProto), alvo = semProto;
  if (i < 0) { const mm = /CC BY(?:-[A-Z]{2})*(?:-[A-Z]{2})? \d\.\d/.exec(texto); if (mm) { i = mm.index; alvo = mm[0]; } }
  if (i < 0) return h`<p class="rodape-licenca">${texto} · <a href="${url}" target="_blank" rel="noopener">licença</a></p>`;
  return h`<p class="rodape-licenca">${texto.slice(0, i)}<a href="${url}" target="_blank" rel="noopener">${alvo}</a>${texto.slice(i + alvo.length)}</p>`;
}
/** Enunciado (HTML do pack) e o comando da questão. */
export function enunciado(item) {
  return h`<div class="enunciado">${cru(item.enunciado || '')}${item.introducao ? h`<p class="comando">${item.introducao}</p>` : ''}</div>`;
}
const imagemAlt = a => (a.imagem ? h`<span class="alt-img"><img src="${a.imagem.src}" alt="${a.imagem.alt || ''}" loading="lazy"></span>` : '');
/** Alternativas para responder: rádio nativo, área inteira selecionável, fios entre elas. */
export function alternativasPergunta(alts, marcada, nome = 'alt') {
  return h`<fieldset class="sem-borda" style="border:0;margin:0;padding:0;min-width:0"><legend class="so-leitor">Alternativas</legend><ol class="alternativas">${cada(alts, a => h`<li>
      <label class="alt ${marcada === a.letra ? 'marcada' : ''}">
        <input type="radio" name="${nome}" value="${a.letra}" data-mudar="escolherAlt" ${marcada === a.letra ? cru('checked') : ''}>
        <span class="letra" aria-hidden="true">${a.letra}</span>
        <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${a.texto || ''}${imagemAlt(a)}</span>
        <span></span>
      </label></li>`)}</ol></fieldset>`;
}
/** Alternativas marcadas no feedback: "sua" (tracejado) e "certa" (contorno e ✓). */
export function alternativasFeedback(alts) {
  return h`<ol class="alternativas">${cada(alts, a => {
    const sua = a.marca === 'sua' || a.marca === 'sua-certa', certa = a.marca === 'certa' || a.marca === 'sua-certa';
    const etiqueta = a.marca === 'sua-certa' ? 'sua · certa' : a.marca === 'sua' ? 'sua' : a.marca === 'certa' ? 'certa' : '';
    return h`<li><div class="alt estatica ${certa ? 'certa' : sua ? 'sua' : ''}">
      <span class="letra" aria-hidden="true">${a.letra}</span>
      <span class="alt-texto"><span class="so-leitor">${a.letra}) </span>${a.texto || ''}${imagemAlt(a)}</span>
      ${etiqueta ? h`<span class="marca-alt">${etiqueta}${certa ? icones.certo : ''}</span>` : h`<span></span>`}
    </div></li>`;
  })}</ol>`;
}

/* ---------------- página de livro (leitura, trecho, leitor do Caderno) ---------------- */
function figura(f) {
  if (!f) return '';
  return h`${cru(f.html || '')}${f.legenda && f.tipo !== 'tabela' ? h`<p class="legenda">${f.legenda}</p>` : ''}`;
}
/** Um parágrafo com o § na margem (âncora pelo id) e as notas do aluno. */
export function paragrafo(par, ancora) {
  return h`<div class="par ${par.id === ancora ? 'ancora' : ''}" id="${par.id}" data-par="${par.id}">
    <span class="par-n" aria-hidden="true">§ ${par.n}</span>
    <div class="par-texto"><span class="so-leitor">§ ${par.n}. </span><p>${cru(par.html || '')}</p>${figura(par.figura)}</div>
    ${par.notas && par.notas.length ? h`<div class="par-notas">${cada(par.notas, n => h`<p class="nota-margem">${n.texto} <span class="mini">(${n.dia})</span></p>`)}</div>` : ''}
  </div>`;
}
export function blocos(bs, ancora) {
  return cada(bs, b => cada(b.paragrafos, p => paragrafo(p, ancora)));
}

/* ---------------- folha (sobe sobre a tela) ---------------- */
/** Moldura de folha. corpo/pe já em HTML. A tela que abre a folha é marcada como inerte. */
export function folha({ id = 'folha', rotulo, corpo, pe, alta = false, fechar = true, acaoFechar = 'fecharFolha' }) {
  return h`<div class="folha-fundo" data-acao="fundoFolha">
    <div class="folha ${alta ? 'folha-alta' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}-titulo">
      <div class="folha-cabeca"><h2 class="rotulo" id="${id}-titulo" tabindex="-1" data-foco-folha>${rotulo}</h2>
        ${fechar ? h`<button type="button" class="fechar-x" data-acao="${acaoFechar}" aria-label="Fechar">${icones.fechar}</button>` : ''}</div>
      <div class="folha-corpo">${corpo}</div>
      ${pe ? h`<div class="folha-pe">${pe}</div>` : ''}
    </div>
  </div>`;
}

/* ---------------- intervalo deliberativo ---------------- */
/** Botão "Continuar" do feedback: preenchimento liso durante a pausa, com aria-disabled e "Leia a explicação". */
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
    const ampliavel = el.tagName === 'IMG' ? el : el;
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
    if (el.closest('label')) return;   // alternativa em imagem: tocar escolhe a alternativa (a área inteira)
    ampliavel.setAttribute('tabindex', '0');
    ampliavel.setAttribute('role', 'button');
    ampliavel.classList.add('ampliavel');
    if (!ampliavel.getAttribute('aria-label')) ampliavel.setAttribute('aria-label', 'Ampliar a figura');
    const dica = document.createElement('span');
    dica.className = 'ampliavel-dica';
    dica.textContent = 'Toque para ampliar';
    dica.setAttribute('aria-hidden', 'true');
    (el.tagName === 'IMG' && el.parentElement && el.parentElement.tagName === 'FIGURE' ? el.parentElement : el).insertAdjacentElement('afterend', dica);
    const abrir = e => { e.preventDefault(); aoAmpliar && aoAmpliar(el); };
    ampliavel.addEventListener('click', abrir);
    ampliavel.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') abrir(e); });
  });
}
