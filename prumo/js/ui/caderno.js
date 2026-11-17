/* =========================================================
   PRUMO · Caderno (c.5–c.8 e aba Cards)            [A COMPLETAR]
   Versão simples, funcional, deixada pela equipe das telas do núcleo para o
   agente do Caderno completar (ver js/ui/LEIA.md, seção "Telas a completar").
   Rotas: #/caderno (Sumário) · #/caderno/erros · #/caderno/notas ·
   #/caderno/cards · #/caderno/pagina/<id da página>[/<id do parágrafo>]
   Leitura livre: nada aqui passa pela máquina da missão.
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { nivel, blocos, trofeu } from './componentes.js';
import { topoAba } from './hoje.js';

const SUBS = [
  { id: 'sumario', rotulo: 'Sumário' }, { id: 'erros', rotulo: 'Erros' },
  { id: 'notas', rotulo: 'Notas' }, { id: 'cards', rotulo: 'Cartões' },
];

function subabas(atual) {
  return h`<nav class="subabas" aria-label="Partes do caderno">${cada(SUBS, s => h`<a class="subaba" href="#/caderno${s.id === 'sumario' ? '' : '/' + s.id}" ${atual === s.id ? cru('aria-current="page"') : ''}>${s.rotulo}</a>`)}</nav>`;
}
// do Caderno de erros, a página abre com o marca-texto no trecho que o erro cobrou (".../erro")
const linkTrecho = (tr, erro = false) => (tr ? h`<a class="link" href="#/caderno/pagina/${tr.pagina}/${tr.paragrafo}${erro ? '/erro' : ''}">${tr.rotulo}</a>` : '');
// erro de tópico de prática: a apostila do tópico, aberta na seção que a questão cobrou (quando o conteúdo informa)
const linkApostila = ap => (ap ? h`<a class="link" href="#/estudar/${ap.topico}/teoria${ap.ancora ? `/${ap.ancora}` : ''}">${ap.rotulo}</a>` : '');

function sumario(n) {
  const s = n.sumario();
  return h`
    ${s.avisoDemo ? h`<p class="texto-2 pequeno">${s.avisoDemo}</p>` : ''}
    <ul class="lista-fios">${cada(s.capitulos, c => h`<li>
      <p class="rotulo">Cap. ${c.n}, ${c.paginas}</p>
      <h2 class="titulo-pequeno">${c.titulo}</h2>
      ${nivel({ cheios: c.nivel.cheios, nome: c.nivel.nome })}
      <p class="pequeno" style="margin:6px 0 0">${c.estado}</p>
      ${c.regra ? h`<p class="pequeno texto-2" style="margin:4px 0 0">${c.regra}</p>` : ''}
      ${c.antesDepois ? h`<p class="pequeno" style="margin:4px 0 0">${c.antesDepois}</p>` : ''}
      <p style="margin:4px 0 0">${cada(c.paginaIds, id => h`<a class="link link-pequeno" href="#/caderno/pagina/${id}" style="margin-right:16px">abrir a p. ${(n.pagina(id) || {}).n}</a>`)}</p>
    </li>`)}</ul>
    <section class="secao"><p class="rotulo">Prova do caderno</p><p>${s.prova.regra}</p><p class="texto-2 pequeno">${s.prova.texto}</p>
      ${s.prova.trofeu && s.prova.trofeu.ganho ? trofeu(s.prova.trofeu) : ''}</section>
    <section class="secao"><p class="rotulo">Marcos</p><ul class="lista-fios">${cada(s.marcos, m => h`<li><strong>${m.nome}</strong> <span class="texto-2 pequeno">${m.texto || m.condicao}</span></li>`)}</ul></section>
    <p class="pequeno texto-2" style="margin-top:16px">${s.regraNivel}</p>`;
}

/** Erros agrupados pela fonte: o caderno (capítulos do pack, sob o título dele) e cada tópico de prática
 *  (erro de tópico vem com o link da apostila), na ordem do erro mais recente. A área de cada grupo vai
 *  para o rótulo do topo ("Matemática", ou "Matemática e Linguagens"). */
function gruposDeErros(n, s, itens) {
  const grupos = [], porNome = new Map();
  for (const it of itens) {
    const doTopico = !!it.apostila, nome = doTopico ? it.capRotulo : s.titulo;
    let g = porNome.get(nome);
    if (!g) {
      let area = s.materia;
      if (doTopico) { try { area = (n.topicoPagina(it.cap) || {}).area || area; } catch (x) { /* tópico fora do mapa: fica a matéria do caderno */ } }
      g = { nome, area, doTopico, itens: [] };
      porNome.set(nome, g); grupos.push(g);
    }
    g.itens.push(it);
  }
  return grupos;
}
const juntar = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`);

function erros(n, s, filtro) {
  const e = n.erros(filtro);
  if (e.vazio) return { rotulo: s.materia, html: h`<p>${e.vazio}</p>` };
  const grupos = gruposDeErros(n, s, e.itens);
  return {
    rotulo: juntar([...new Set(grupos.map(g => g.area))]),
    html: h`<div class="erros-grupos">${cada(grupos, (g, k) => h`<section class="secao" aria-labelledby="erros-g${k}">
      <h2 class="titulo-pequeno" id="erros-g${k}">${g.nome}</h2>
      <ul class="lista-fios">${cada(g.itens, it => h`<li>
        <p class="rotulo">${g.doTopico || !it.capRotulo ? it.dia : `${it.capRotulo}, ${it.dia}`}</p>
        ${it.questao ? h`<p style="margin:4px 0"><strong>${it.questao.rotulo}</strong></p>` : ''}
        <p style="margin:0">${it.linha}</p>
        ${it.falta ? h`<p class="pequeno" style="margin:4px 0 0"><strong>O que faltou.</strong> ${it.falta}</p>` : ''}
        <p class="pequeno texto-2" style="margin:4px 0 0">${it.situacao}</p>
        ${linkTrecho(it.trecho, true)}
        ${linkApostila(it.apostila)}
      </li>`)}</ul>
    </section>`)}</div>`,
  };
}

function notas(n) {
  const v = n.notas();
  if (v.vazio) return h`<p>${v.vazio}</p>`;
  return cada(v.capitulos, c => h`<section class="secao"><p class="rotulo">${c.titulo}</p><ul class="lista-fios">${cada(c.notas, x => h`<li><p style="margin:0">${x.texto}</p><p class="pequeno texto-2" style="margin:4px 0 0">${x.dia}</p>${linkTrecho(x.trecho)}</li>`)}</ul></section>`);
}

function cards(n) {
  const v = n.cardsDoCaderno();
  return h`<p class="pequeno texto-2">${v.aviso}</p>${cada(v.capitulos, c => h`<section class="secao">
    <p class="rotulo">${c.titulo}</p>
    ${c.aviso ? h`<p class="pequeno texto-2">${c.aviso}</p>` : h`<ul class="lista-fios">${cada(c.cards, k => h`<li>
      <p style="margin:0"><strong>${k.frente}</strong></p>
      <p style="margin:4px 0 0">${k.verso}</p>
      <p class="pequeno texto-2" style="margin:4px 0 0">${k.caixaRotulo ? `${k.caixaRotulo[0].toUpperCase()}${k.caixaRotulo.slice(1)}` : ''}${k.proximaTexto ? `${k.caixaRotulo ? '. ' : ''}Próxima: ${k.proximaTexto}.` : ''}</p>
    </li>`)}</ul>`}
  </section>`)}`;
}

function pagina(n, id, ancora, erro) {
  const p = n.pagina(id);
  if (!p) return h`<p>Página não encontrada.</p>`;
  return h`<article class="pagina-livro" style="margin-top:8px">
    <p class="rotulo cabeco">${p.cabeco}</p>
    <h2 class="pagina-titulo">${p.titulo}</h2>
    ${blocos(p.blocos, ancora, { grifar: erro })}
    <p class="pe">${p.pe}</p>
    <p class="pequeno texto-2">${p.credito.fonte}. ${p.credito.licenca}.</p>
    ${p.irAlem && p.irAlem.length ? h`<section class="secao"><p class="rotulo">Ir além</p><ul class="lista-fios">${cada(p.irAlem, l => h`<li><a href="${l.url}" target="_blank" rel="noopener">${l.rotulo}</a><p class="pequeno texto-2" style="margin:4px 0 0">${l.aviso}</p></li>`)}</ul></section>` : ''}
    <p class="links" style="margin-top:16px">${p.anterior ? h`<a class="link" href="#/caderno/pagina/${p.anterior}">página anterior</a>` : ''}${p.seguinte ? h`<a class="link" href="#/caderno/pagina/${p.seguinte}">página seguinte</a>` : ''}</p>
  </article>`;
}

/** Aba Caderno. rota.sub: sumario | erros | notas | cards | pagina. */
export function telaCaderno(ctx, t, rota) {
  const n = ctx.nucleo;
  const sub = rota.sub || 'sumario';
  const s = n.sumario();
  // o título do pack fica no Sumário, nas Notas e nos Cartões; os Erros juntam o caderno e os tópicos de prática
  let corpo, rotulo = `Caderno de ${s.materia}`, titulo = s.titulo;
  if (sub === 'pagina') corpo = pagina(n, rota.resto[0], rota.resto[1], rota.resto[2] === 'erro');
  else if (sub === 'erros') { const e = erros(n, s, rota.resto[0] || null); corpo = e.html; rotulo = e.rotulo; titulo = 'Caderno de erros'; }
  else if (sub === 'notas') corpo = notas(n);
  else if (sub === 'cards') corpo = cards(n);
  else corpo = sumario(n);
  return {
    chave: `caderno:${sub}:${rota.resto.join('/')}`,
    titulo: 'Caderno',
    html: h`${topoAba()}
      <p class="rotulo">${rotulo}</p>
      <h1 class="titulo" tabindex="-1" data-foco-inicial>${titulo}</h1>
      ${subabas(sub === 'pagina' ? 'sumario' : sub)}
      ${corpo}`,
    depois(raiz) {
      const anc = rota.resto[1] && document.getElementById(rota.resto[1]);
      if (sub === 'pagina' && anc) anc.scrollIntoView({ block: 'center' });
    },
  };
}
