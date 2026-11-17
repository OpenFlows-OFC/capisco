// Build dos Caps. 3 e 4 do caderno "Funções afins" (e.6 da especificação).
// Lê _dev/c34_fonte.mjs (texto da equipe), prototipo/dados_enem/raw (enem.dev) e o ITENS_PROVA do INEP,
// gera as variantes dos modelos, roda os testes e escreve conteudo/mat-fa-c34.js.
// Uso (de qualquer pasta): node <caminho>/prumo/_dev/c34_build.mjs   [--checar]  (--checar não escreve)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CAPITULOS, MODELOS, QUESTOES, AUTORIA } from './c34_fonte.mjs';
import { conferir } from './conferencia_c34.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const PRUMO = resolve(aqui, '..');
const TCC = resolve(PRUMO, '../../..');
const RAW = resolve(TCC, 'prototipo/dados_enem/raw');
const SAIDA = resolve(PRUMO, 'conteudo/mat-fa-c34.js');
const HOJE = '2026-11-17';
const LICENCA_EQUIPE = 'CC BY-SA 4.0';
const CREDITO_EQUIPE = { fonte: 'Equipe Prumo', licenca: LICENCA_EQUIPE, autoria: AUTORIA };

const falhas = [];
const falha = m => falhas.push(m);

// ------------------------------------------------------------------ utilidades
const escapar = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MENOS = '−';
// Mesmo formato de fmtNum em js/nucleo/pack.js (o motor gera as variantes com ele): até 2 casas,
// sem o zero final, vírgula decimal, sinal de menos tipográfico. Assim "pronto" bate com a tela.
function numero(v) {
  if (!Number.isFinite(v)) throw new Error('valor não finito: ' + v);
  if (Math.abs(v * 100 - Math.round(v * 100)) > 1e-6) throw new Error('mais de 2 casas: ' + v);
  const r = Math.round(v * 100) / 100, a = Math.abs(r);
  let s = Number.isInteger(a) ? String(a) : a.toFixed(2).replace(/0$/, '').replace('.', ',');
  if (Number.isInteger(a) && a >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (r < 0 ? MENOS : '') + s;
}
const preencher = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (m, k) => {
  if (!(k in v)) throw new Error(`variável {${k}} sem valor em: ${tpl.slice(0, 60)}`);
  const x = v[k];
  return typeof x === 'number' ? numero(x) : String(x);
});
const avaliar = (expr, vars) => Function(...Object.keys(vars), `"use strict"; return (${expr});`)(...Object.values(vars));
const semTags = html => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
const palavras = t => semTags(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
function gramas(t, n = 6) { const p = palavras(t), s = new Set(); for (let i = 0; i + n <= p.length; i++) s.add(p.slice(i, i + n).join(' ')); return s; }

// ------------------------------------------------------------------ markdown do enem.dev → HTML (só formato)
function mdParaHtml(md, imagens, id) {
  const usadas = [];
  const blocos = md.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const html = blocos.map(b => {
    const img = b.match(/^!\[[^\]]*\]\((\S+)\)$/);
    if (img) {
      const nome = img[1].split('/').pop(), info = imagens[nome];
      if (!info) { falha(`${id}: imagem sem cópia local/alt: ${nome}`); return ''; }
      usadas.push(nome);
      return `<figure class="enem-img"><img src="conteudo/img/${info.arquivo}" alt="${escapar(info.alt)}" loading="lazy"></figure>`;
    }
    let t = escapar(b)
      .replace(/ {2}\n/g, '<br>')
      .replace(/\n/g, ' ')                       // junta as quebras da diagramação
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])_(.+?)_(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
    if (/!\[/.test(t)) falha(`${id}: imagem no meio do parágrafo, converter à mão`);
    return `<p>${t}</p>`;
  }).join('');
  return { html, usadas };
}

// ------------------------------------------------------------------ páginas, blocos e parágrafos
const paragrafos = new Map();   // id → { pagina, bloco, n, html }
const blocosPorId = new Map();
const paginasPorId = new Map();
const capitulosSaida = CAPITULOS.map(cap => {
  const paginas = cap.paginas.map(pg => {
    let n = 0;
    const blocos = pg.blocos.map(b => {
      const bl = { id: b.id, papel: b.papel, ...(b.prePergunta ? { prePergunta: b.prePergunta } : {}),
        paragrafos: b.paragrafos.map(html => { n++; const id = `${b.id}.s${n}`; paragrafos.set(id, { pagina: pg.id, bloco: b.id, n, html }); return { id, n, html }; }) };
      blocosPorId.set(b.id, { ...bl, pagina: pg.id, nucleo: pg.nucleo === b.id });
      return bl;
    });
    if (n < 3 || n > 4) falha(`${pg.id}: ${n} parágrafos (pedido: 3 a 4)`);
    const p = { id: pg.id, n: pg.n, capitulo: cap.id, titulo: pg.titulo, blocos, modelo: pg.modelo, nucleo: pg.nucleo, notaPrompt: pg.notaPrompt, credito: CREDITO_EQUIPE };
    paginasPorId.set(pg.id, p);
    return p;
  });
  // "ver o trecho" do card leva ao § exato (Pack.localDoCard); sem `paragrafo`, cairia no 1º § do bloco.
  const cards = cap.cards.map((c, i) => {
    const id = `${cap.id}.k${i + 1}`;
    if (!c.paragrafo) falha(`${id}: card sem paragrafo`);
    else if (paragrafos.get(c.paragrafo)?.bloco !== c.bloco) falha(`${id}: parágrafo ${c.paragrafo} fora do bloco ${c.bloco}`);
    return { id, tipo: c.tipo, frente: c.frente, verso: c.verso, bloco: c.bloco, paragrafo: c.paragrafo, autoria: AUTORIA };
  });
  return { id: cap.id, n: cap.n, titulo: cap.titulo, habilidades: cap.habilidades, prereq: cap.prereq,
    paginas, rodada: cap.rodada, reserva: cap.reserva, irAlem: cap.irAlem, cards };
});

// ------------------------------------------------------------------ modelos da equipe
const PAPEIS = {
  pagina: 'linha 0 = pré-pergunta do núcleo; 1 = checagem; 2 a 7 = variantes (revisões, R5, inserções do Pilar III, Prova, Questão do dia), em ordem; 8 a 10 = "Refazer com outros números"',
  bloco: 'linha 0 = pré-pergunta do bloco; 1 = variante de compreender (inserção do Pilar III)',
  aplicar: 'linha 0 = item da rodada (papel de aplicar); 1 a 4 = variantes (revisões, Prova, Questão do dia), em ordem; 5 a 7 = "Refazer com outros números"',
};
const N_LINHAS = { pagina: 11, bloco: 2, aplicar: 8 };
const modelosSaida = MODELOS.map(m => {
  if (m.linhas.length !== N_LINHAS[m.tipo]) falha(`${m.id}: ${m.linhas.length} linhas (esperado ${N_LINHAS[m.tipo]})`);
  for (const e of m.erros) if (!paragrafos.has(e.paragrafo)) falha(`${m.id}: parágrafo inexistente ${e.paragrafo}`);
  if (m.formato !== 'numero') falha(`${m.id}: formato tem de ser "numero" (é o que pack.js entende para valores)`);
  const linhas = m.linhas.map((linha, k) => {
    const v = { ...linha, ...m.deriva(linha) };
    if (v.conferePrecos && new Set(v.conferePrecos.map(x => x.toFixed(2))).size !== 1) falha(`${m.id}#${k}: os três pedidos não têm o mesmo total (${v.conferePrecos})`);
    const vals = [avaliar(m.certa, v), ...m.erros.map(e => avaliar(e.expr, v))];
    if (vals.some(x => !Number.isFinite(x))) { falha(`${m.id}#${k}: valor não finito`); return {}; }
    let textos;
    try { textos = vals.map(x => numero(x)); } catch (err) { falha(`${m.id}#${k}: ${err.message} (${vals.join(' | ')})`); return {}; }
    if (new Set(textos).size !== 5) falha(`${m.id}#${k}: alternativas repetidas ${textos.join(' | ')}`);
    if (vals.some(x => x < 0) && m.id !== 'mat-fa.p6.b2.m') falha(`${m.id}#${k}: valor negativo ${vals.join(' | ')}`);
    // Ordem crescente, como em pack.js (Pack.variante); a variedade da letra certa vem dos dados.
    const ordem = [0, 1, 2, 3, 4].sort((a, b) => Math.round(vals[a] * 100) - Math.round(vals[b] * 100));
    const alternativas = ordem.map((i, pos) => {
      const letra = 'ABCDE'[pos];
      if (i === 0) return { letra, texto: textos[i], certa: true };
      const e = m.erros[i - 1];
      return { letra, texto: textos[i], erro: i - 1, falta: preencher(e.falta, v), paragrafo: e.paragrafo };
    });
    const gabarito = alternativas.find(a => a.certa).letra;
    const pronto = { enunciado: preencher(m.enunciado, v), alternativas, gabarito, explicacao: preencher(m.explicacao, v) };
    const vars = Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === 'number' || typeof x === 'string'));
    return { ...vars, pronto };
  });
  // a pré-pergunta e a checagem não podem ter a mesma resposta certa (são irmãs, com outros números)
  if (m.tipo !== 'aplicar' && linhas[0].pronto.alternativas.find(a => a.certa).texto === linhas[1].pronto.alternativas.find(a => a.certa).texto)
    falha(`${m.id}: linhas 0 e 1 com a mesma resposta`);
  return { id: m.id, tipo: m.tipo, pagina: m.pagina, ...(m.bloco ? { bloco: m.bloco } : {}), capitulo: m.capitulo,
    licenca: LICENCA_EQUIPE, formato: m.formato, enunciado: m.enunciado, certa: m.certa,
    erros: m.erros, explicacao: m.explicacao, papeisDasLinhas: PAPEIS[m.tipo], linhas, credito: CREDITO_EQUIPE };
});
const modelosPorId = new Map(modelosSaida.map(m => [m.id, m]));
if (falhas.length) { console.error(`${falhas.length} falha(s) nos modelos:\n- ` + falhas.join('\n- ')); process.exit(1); }

// ------------------------------------------------------------------ questões do Enem
const ajudantes = teste => {
  const pts = teste.pontos || {};
  const maior = f => Object.entries(pts).sort((a, b) => f(b[1]) - f(a[1]))[0][0];
  const seq = s => s.split('→').map(x => +x.trim());
  const subidas = (teste.acumulado || []).slice(1).map((x, i) => x - teste.acumulado[i]);
  const porPot = Object.fromEntries(Object.entries(teste.potencia || {}).map(([c, p]) => [p, c]));
  return {
    maior, abs: Math.abs,
    sequenciaPelasSubidas: () => subidas.map(s => porPot[s]).join(' → '),
    somaPotencias: alt => seq(alt).reduce((a, c) => a + teste.potencia[c], 0),
    comodos: alt => seq(alt).length,
    primeiroMinutoDiferente: alt => { let acc = 0; const s = seq(alt); for (let i = 0; i < s.length; i++) { acc += teste.potencia[s[i]]; if (acc !== teste.acumulado[i + 1]) return i + 1; } return 0; },
  };
};
const valorAlt = t => +t.replace(/\./g, '').replace(',', '.');

const questoesSaida = [];
for (const [id, q] of Object.entries(QUESTOES)) {
  const [, ano, n] = id.match(/^enem-(\d{4})-(\d+)$/).map(Number);
  const raw = JSON.parse(readFileSync(resolve(RAW, `enem_${ano}.json`), 'utf8')).filter(x => x.index === n && x.language == null);
  if (raw.length !== 1) { falha(`${id}: ${raw.length} registros no enem.dev`); continue; }
  const r = raw[0], c = conferir({ ano, n });
  if (!c.confere) falha(`${id}: não passou na conferência (INEP ${c.gabaritoINEP}, enem.dev ${c.gabaritoEnemDev}, anulada ${c.anulada})`);
  const { html: contexto, usadas } = mdParaHtml(r.context || '', q.imagens, id);
  const alternativas = r.alternatives.map(a => {
    const alt = { letra: a.letter, texto: a.text == null ? '' : escapar(a.text) };
    if (a.file) {
      const nome = a.file.split('/').pop(), info = q.imagens[nome];
      if (!info) falha(`${id}: alternativa ${a.letter} com imagem sem cópia local`);
      else { usadas.push(nome); alt.imagem = { src: `conteudo/img/${info.arquivo}`, alt: info.alt, altFonte: 'equipe' }; }
    }
    if (a.letter !== r.correctAlternative) {
      const e = q.erradas[a.letter];
      if (!e) falha(`${id}: alternativa ${a.letter} sem "o que faltou"`);
      else Object.assign(alt, { falta: e.falta, ...(e.expr ? { expr: e.expr } : {}), ...(e.exprTeste ? { exprTeste: e.exprTeste } : {}), ...(e.esperado ? { esperado: e.esperado } : {}), paragrafo: e.paragrafo });
    }
    return alt;
  });
  const imagens = Object.entries(q.imagens).map(([nome, info]) => {
    if (!existsSync(resolve(PRUMO, 'conteudo/img', info.arquivo))) falha(`${id}: arquivo de imagem ausente ${info.arquivo}`);
    if (!usadas.includes(nome)) falha(`${id}: imagem declarada e não usada ${nome}`);
    return { src: `conteudo/img/${info.arquivo}`, alt: info.alt, altFonte: 'equipe', ...(info.letra ? { alternativa: info.letra } : {}), original: `https://enem.dev/${ano}/questions/${n}/${nome}` };
  });
  questoesSaida.push({
    id, ano, dia: 2, caderno: 'Azul', numero: n, area: 'MT', habilidade: c.habilidade, capitulo: q.capitulo,
    inep: { coItem: c.coItem, coProva: c.coProva, a: c.a, b: c.b, c: c.c },
    gabarito: r.correctAlternative, gabaritoConferido: c.gabaritoINEP === r.correctAlternative,
    conferidoITENS_PROVA: HOJE, textoConferidoPDF: null, anulada: c.anulada,
    contexto, introducao: escapar(r.alternativesIntroduction || ''), fonteMd: r.context || '',
    materialDeTerceiros: null, alternativas, imagens,
    atribuicao: `INEP · Enem ${ano}, 2º dia, Caderno Azul, questão ${n} · CC BY-ND 3.0`,
    transcricao: 'Transcrição do projeto enem.dev, em conferência com o PDF oficial.',
    licenca: 'CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)',
    licencaUrl: 'https://creativecommons.org/licenses/by-nd/3.0/legalcode',
    blocos: q.blocos, modelo: q.modelo, explicacao: q.explicacao, exprCerta: q.exprCerta, teste: q.teste,
    autoria: AUTORIA, papel: 'rodada',
  });
}
const questoesPorId = new Map(questoesSaida.map(q => [q.id, q]));

// ------------------------------------------------------------------ testes
// (1) d.6: cada "o que faltou" reproduz a alternativa; a expressão certa reproduz o gabarito.
for (const q of questoesSaida) {
  const h = ajudantes(q.teste);
  const ctx = (alt) => ({ ...h, alt, ...(q.teste.x ? { R: null, C: null } : {}) });
  const testar = (expr, alt) => {
    if (q.teste.x) {                                // curvas: avalia ponto a ponto e compara com a leitura da equipe
      return q.teste.x.map((_, i) => avaliar(expr, { ...h, R: q.teste.R[i], C: q.teste.C[i] }));
    }
    return avaliar(expr, ctx(alt));
  };
  for (const a of q.alternativas) {
    const certa = a.letra === q.gabarito;
    const expr = certa ? q.exprCerta : (a.expr || a.exprTeste);
    if (!expr) continue;
    const obtido = testar(expr, a.texto.replace(/&gt;/g, '>'));
    let ok;
    if (q.teste.x) ok = obtido.every((y, i) => Math.abs(y - q.teste.leitura[a.letra][i]) <= q.teste.tolerancia);
    else if (a.esperado) ok = JSON.stringify(obtido) === JSON.stringify(a.esperado);
    else if (typeof obtido === 'number') ok = Math.abs(obtido - valorAlt(a.texto)) < 0.005;
    else ok = String(obtido) === a.texto.replace(/&gt;/g, '>');
    if (!ok) falha(`${q.id} ${a.letra}: a expressão não reproduz a alternativa (${JSON.stringify(obtido)} × ${a.texto})`);
  }
  // nas curvas, a leitura de cada alternativa errada não pode servir também para a certa
  if (q.teste.x) for (const a of q.alternativas) if (a.letra !== q.gabarito) {
    const certa = testar(q.exprCerta);
    if (certa.every((y, i) => Math.abs(y - q.teste.leitura[a.letra][i]) <= q.teste.tolerancia)) falha(`${q.id} ${a.letra}: leitura indistinguível da certa`);
  }
}
// (2) b.5: todo bloco citado (questão.blocos ou parágrafo de erro, inclusive dos modelos) tem pré-pergunta antes dele.
const citados = new Map();
const citar = (bloco, por) => citados.set(bloco, [...(citados.get(bloco) || []), por]);
for (const q of questoesSaida) { q.blocos.forEach(b => citar(b, q.id)); q.alternativas.forEach(a => a.paragrafo && citar(paragrafos.get(a.paragrafo)?.bloco, q.id)); }
for (const m of modelosSaida) m.erros.forEach(e => citar(paragrafos.get(e.paragrafo)?.bloco, m.id));
for (const [b, por] of citados) {
  const bl = blocosPorId.get(b);
  if (!bl) { falha(`bloco inexistente ${b} (citado por ${por})`); continue; }
  if (bl.nucleo) continue;
  const mp = bl.prePergunta && modelosPorId.get(bl.prePergunta);
  if (!mp || mp.tipo !== 'bloco' || mp.bloco !== b) falha(`b.5: bloco ${b} citado por ${[...new Set(por)].join(', ')} sem pré-pergunta própria`);
}
for (const q of questoesSaida) for (const a of q.alternativas) if (a.paragrafo && !paragrafos.has(a.paragrafo)) falha(`${q.id} ${a.letra}: parágrafo inexistente ${a.paragrafo}`);
// (3) rodada: questões do Enem em ordem crescente de b; ids conhecidos; a questão da equipe aponta para um modelo de aplicar.
for (const cap of capitulosSaida) {
  const bs = cap.rodada.filter(i => i.startsWith('enem-')).map(i => questoesPorId.get(i)?.inep.b);
  if (bs.some(b => b == null)) falha(`${cap.id}: rodada com questão desconhecida`);
  if (bs.some((b, i) => i && b < bs[i - 1])) falha(`${cap.id}: rodada fora da ordem de b`);
  for (const i of cap.rodada.filter(i => !i.startsWith('enem-'))) { const [mid] = i.split('#'); if (modelosPorId.get(mid)?.tipo !== 'aplicar') falha(`${cap.id}: item da equipe ${i} sem modelo de aplicar`); }
  if (cap.rodada.length < 3) falha(`${cap.id}: rodada com menos de 3 itens`);
  for (const pg of cap.paginas) { if (!modelosPorId.has(pg.modelo)) falha(`${pg.id}: modelo ausente`); if (!blocosPorId.get(pg.nucleo)?.nucleo) falha(`${pg.id}: núcleo inválido`); }
  // cards (Decisão 1): de 6 a 8, frente até 14 palavras, verso até 25, bloco existente
  if (cap.cards.length < 6 || cap.cards.length > 8) falha(`${cap.id}: ${cap.cards.length} cards`);
  for (const c of cap.cards) {
    if (c.frente.split(/\s+/).length > 14) falha(`${c.id}: frente com mais de 14 palavras`);
    if (c.verso.split(/\s+/).length > 25) falha(`${c.id}: verso com mais de 25 palavras`);
    if (!blocosPorId.has(c.bloco)) falha(`${c.id}: bloco inexistente`);
    if (!['conceito', 'palavra-pista', 'procedimento', 'armadilha'].includes(c.tipo)) falha(`${c.id}: tipo inválido`);
  }
}
// (4) e.1: nenhum texto da equipe com 6 ou mais palavras seguidas em comum com as questões do Enem.
const textoEnem = q => [q.contexto, q.introducao, ...q.alternativas.map(a => a.texto)].join(' ');
const gramasEnem = questoesSaida.map(q => [q.id, gramas(textoEnem(q))]);
const textosEquipe = [];
for (const [id, p] of paragrafos) textosEquipe.push([id, p.html]);
for (const cap of capitulosSaida) { for (const c of cap.cards) textosEquipe.push([c.id, c.frente + ' / ' + c.verso]); for (const pg of cap.paginas) textosEquipe.push([pg.id + ' nota', pg.notaPrompt]); }
for (const m of modelosSaida) m.linhas.forEach((l, k) => { textosEquipe.push([`${m.id}#${k}`, l.pronto.enunciado]); textosEquipe.push([`${m.id}#${k} expl.`, l.pronto.explicacao]); l.pronto.alternativas.forEach(a => a.falta && textosEquipe.push([`${m.id}#${k} ${a.letra}`, a.falta])); });
for (const q of questoesSaida) { textosEquipe.push([q.id + ' expl.', q.explicacao]); q.alternativas.forEach(a => { if (a.falta) textosEquipe.push([`${q.id} ${a.letra} falta`, a.falta]); if (a.imagem) textosEquipe.push([`${q.id} ${a.letra} alt`, a.imagem.alt]); }); q.imagens.forEach((im, i) => textosEquipe.push([`${q.id} img${i}`, im.alt])); }
for (const [id, t] of textosEquipe) {
  const g = gramas(t);
  for (const [qid, ge] of gramasEnem) { const comum = [...g].filter(x => ge.has(x)); if (comum.length) falha(`e.1: ${id} tem 6+ palavras seguidas em comum com ${qid}: "${comum[0]}"`); }
}
// (5) tom: palavras e símbolos proibidos (Decisão 7 e c.0.1).
const proibidas = /\b(perdeu|perder|xp|moeda|ranking|vidas?|baú|mascote)\b/i;
for (const [id, t] of textosEquipe) { if (proibidas.test(semTags(t))) falha(`tom: ${id} usa palavra proibida`); if (/\p{Extended_Pictographic}/u.test(t)) falha(`tom: ${id} tem emoji`); }

// ------------------------------------------------------------------ saída
const cabecalho = `// Caderno "Funções afins" · Caps. 3 e 4 (págs. 5–8) · item 1 do Corte B (g.4).
// GERADO por _dev/c34_build.mjs em ${HOJE}. Não edite à mão: edite _dev/c34_fonte.mjs e rode
//   node prumo/_dev/c34_build.mjs
// Esquema: e.2 da especificação (PRODUTO_PRUMO.md), com estes acréscimos, todos opcionais para quem lê:
//  - capitulo.cards: [{ id, tipo, frente, verso, bloco, paragrafo, autoria }] (Decisão 1 do dono).
//  - bloco.papel: "nucleo" | "cobrado" | "apoio"; paragrafo.n: número do § na página.
//  - modelo.tipo "aplicar" (questão da equipe no papel de aplicar, só no Cap. 4); na rodada ela aparece
//    como "mat-fa.c4.ap#0" (id do modelo # linha), no mesmo formato que o estado usa para variantes.
//  - modelo.explicacao (molde da resolução), modelo.formato e, em cada linha, "pronto": enunciado,
//    alternativas (em ordem crescente, com "falta" e "paragrafo" nas erradas), gabarito e explicação
//    já preenchidos, para a tela não precisar avaliar expressões.
//  - questão: capitulo, exprCerta, teste (dados do teste de d.6), transcricao, conferidoITENS_PROVA;
//    alternativa.esperado quando a "expr" confere uma propriedade do erro e não o valor.
// Autoria: todo texto da equipe é rascunho por IA (Claude Opus 5.5), revisão pendente.
// Licenças: texto, modelos, explicações e cards da equipe em CC BY-SA 4.0; cada questão do Enem
// mantém a licença indicada nela (CC BY-ND 3.0, INEP), reproduzida sem adaptação.
`;
const corpo = `${cabecalho}
export const capitulos34 = ${JSON.stringify(capitulosSaida, null, 2)};

export const modelos34 = ${JSON.stringify(modelosSaida, null, 2)};

export const questoes34 = ${JSON.stringify(questoesSaida, null, 2)};

export default { capitulos: capitulos34, modelos: modelos34, questoes: questoes34 };
`;

if (falhas.length) { console.error(`${falhas.length} falha(s):\n- ` + falhas.join('\n- ')); process.exit(1); }
const n = { paginas: paragrafos.size, modelos: modelosSaida.length, linhas: modelosSaida.reduce((a, m) => a + m.linhas.length, 0), questoes: questoesSaida.length, cards: capitulosSaida.reduce((a, c) => a + c.cards.length, 0), textos: textosEquipe.length };
console.log(`ok: ${n.paginas} parágrafos, ${n.modelos} modelos (${n.linhas} linhas), ${n.questoes} questões do Enem, ${n.cards} cards; ${n.textos} textos da equipe sem 6 palavras seguidas em comum com o Enem.`);
if (!process.argv.includes('--checar')) { writeFileSync(SAIDA, corpo, 'utf8'); console.log('escrito: ' + SAIDA); }
