// Prumo · validador do pack (script de build, e.6 da especificação). Roda em Node 24, sem dependências.
// Uso (de prototipo/capisco):  node prumo/_dev/valida_pack.mjs
// Sai com código 1 se houver erro. RECUSA o pack quando encontra:
//   - bloco citado em questaoEnem.blocos (ou com parágrafo para onde um erro leva) sem pré-pergunta (b.5);
//   - texto da equipe com 6 ou mais palavras seguidas em comum com a questão do INEP ligada (e.1);
//   - gabarito diferente do curadoria.json, do ITENS_PROVA do INEP ou da transcrição do enem.dev;
//   - questão anulada pelo INEP;
//   - texto do INEP alterado em relação à transcrição (CC BY-ND: só mudança de formato), depois de aplicadas
//     as correções da conferência com o PDF oficial (_dev/correcoes_enem.mjs);
//   - questão conferida com o PDF (textoConferidoPDF) cujo texto não aparece no trecho do PDF oficial
//     (_dev/fontes/pdf_azul_c12.txt e pdf_azul_c34.txt), ou com data diferente da registrada na conferência;
//   - imagem local inexistente ou sem texto alternativo;
//   - alternativa errada de questão de rodada sem "o que faltou" (falta, parágrafo e expr que reproduz o erro, d.6);
//   - capítulo com menos de 6 (ou mais de 8) cards; card sem bloco válido, sem parágrafo ou com parágrafo
//     fora do bloco; card longo demais;
//   - id duplicado; rodada fora da ordem crescente de b; modelo sem variantes ou com alternativas repetidas.
// Se conteudo/mat-fa-c34.js ainda não existe, avisa e valida o que existe (Caps. 1 e 2).
// Com --so-c12, valida só os Caps. 1 e 2 mesmo que mat-fa-c34.js exista.
import { readFileSync, existsSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { textoDeHtml, textoDeMd } from './enem_md.mjs';
import { CONFERENCIA, corrigirRaw } from './correcoes_enem.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(aqui, '..');                 // prototipo/capisco/prumo
const TCC = resolve(RAIZ, '../../..');            // pasta do TCC
const CONTEUDO = resolve(RAIZ, 'conteudo');

const erros = [], avisos = [], feitos = [];
const erro = (sec, msg) => erros.push(`[${sec}] ${msg}`);
const aviso = (sec, msg) => avisos.push(`[${sec}] ${msg}`);
const feito = msg => feitos.push(msg);

// ------------------------------------------------------------------ carga
let pack, parcial = false;
const { avaliar } = await import(pathToFileURL(join(CONTEUDO, 'gerador.js')).href);
try {
  const soC12 = process.argv.includes('--so-c12');
  if (process.env.PRUMO_PACK) {
    // Testes (_dev/testes/conteudo_c12.test.mjs): módulo que exporta um pack alterado de propósito.
    pack = (await import(pathToFileURL(resolve(process.env.PRUMO_PACK)).href)).pack;
    parcial = soC12;
  } else if (existsSync(join(CONTEUDO, 'mat-fa-c34.js')) && !soC12) {
    pack = (await import(pathToFileURL(join(CONTEUDO, 'mat-fa.js')).href)).pack;
  } else {
    parcial = true;
    if (soC12) aviso('carga', 'opção --so-c12: validei só os Caps. 1 e 2.');
    else aviso('carga', 'conteudo/mat-fa-c34.js ainda não existe: validei só os Caps. 1 e 2. Atenção: o app não abre sem ele, porque mat-fa.js o importa.');
    const base = pathToFileURL(CONTEUDO).href + '/';
    let src = readFileSync(join(CONTEUDO, 'mat-fa.js'), 'utf8');
    if (!src.includes("import * as c34 from './mat-fa-c34.js';")) throw new Error('linha de importação dos Caps. 3 e 4 não encontrada em mat-fa.js');
    src = src.replace("import * as c34 from './mat-fa-c34.js';", 'const c34 = {};').replace(/from '\.\//g, `from '${base}`);
    const tmp = join(tmpdir(), `prumo-valida-${process.pid}.mjs`);
    writeFileSync(tmp, src);
    try { pack = (await import(pathToFileURL(tmp).href)).pack; } finally { unlinkSync(tmp); }
  }
} catch (e) {
  console.error('Não consegui carregar o pack: ' + (e.stack || e));
  process.exit(1);
}

// ------------------------------------------------------------------ utilidades
const semAcento = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const tokens = t => semAcento(textoDeHtml(String(t || '')).replace(/\{=?[^}]*\}/g, ' ').toLowerCase()).match(/[a-z0-9]+(?:[.,][0-9]+)*/g) || [];
function ngramas(t, n = 6) { const tk = tokens(t), s = new Set(); for (let i = 0; i + n <= tk.length; i++) s.add(tk.slice(i, i + n).join(' ')); return s; }
const palavras = t => (String(t || '').replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}]+/gu) || []).length;
const autoriaOk = a => a && typeof a === 'object' && 'ia' in a && 'modelo' in a && 'revisor' in a;

function lerCsvItens(ano) {
  const arq = resolve(TCC, `rebranding/anexos/inep/ITENS_PROVA_${ano}.csv`);
  if (!existsSync(arq)) return null;
  const txt = readFileSync(arq, 'latin1').replace(/\r/g, '');
  const [cab, ...linhas] = txt.split('\n').filter(Boolean);
  const cols = cab.split(';');
  return linhas.map(l => Object.fromEntries(l.split(';').map((v, i) => [cols[i], v])));
}
const cacheItens = {}, cacheRaw = {};
const itensDe = ano => (cacheItens[ano] ??= lerCsvItens(ano));
function rawDe(ano, n) {
  if (!cacheRaw[ano]) {
    const arq = resolve(TCC, `prototipo/dados_enem/raw/enem_${ano}.json`);
    cacheRaw[ano] = existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : [];
  }
  return cacheRaw[ano].find(q => q.index === n && q.language == null);
}
const curadoria = (() => {
  const arq = resolve(TCC, 'rebranding/anexos/curadoria.json');
  return existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')).itens : [];
})();
{ // uma linha por questão no curadoria.json (o papel na rodada ou na reserva vem do pack)
  const vistos = new Set();
  for (const c of curadoria) { if (vistos.has(c.id)) erro('curadoria', `${c.id} aparece mais de uma vez em curadoria.json`); vistos.add(c.id); }
}

// Alternativa do Enem em texto → expressão avaliável ("Y = 80X + 920." → "80*X+920"; "P=d.n + L" → "d*n+L").
function exprDaAlternativa(texto) {
  let s = String(texto).trim().replace(/\.$/, '').replace(/−/g, '-').replace(/×|·/g, '*');
  s = s.replace(/^[A-Za-z]\s*=\s*/, '');
  s = s.replace(/(\d),(\d)/g, '$1.$2');
  s = s.replace(/([A-Za-z)])\s*\.\s*(?=[A-Za-z(])/g, '$1*');
  s = s.replace(/(\d)\s*(?=[A-Za-z(])/g, '$1*').replace(/\)\s*(?=[A-Za-z0-9(])/g, ')*');
  return s.replace(/\s+/g, '');
}
function confereExpr(exprErro, textoAlt) {
  const num = String(textoAlt).trim().replace(/\.$/, '');
  if (/^-?\d+(,\d+)?$/.test(num)) {
    const v = parseFloat(num.replace(',', '.'));
    const e = avaliar(exprErro, {});
    return Math.abs(e - v) < 1e-9 ? null : `expr dá ${e}, alternativa diz ${v}`;
  }
  const alvo = exprDaAlternativa(textoAlt);
  const nomes = [...new Set([...(alvo.match(/[A-Za-z_]\w*/g) || []), ...(String(exprErro).match(/[A-Za-z_]\w*/g) || [])])].sort();
  const valores = [[3, 5, 8, 2, 7, 11], [5, 8, 3, 7, 2, 13], [8, 3, 5, 4, 9, 6]];
  for (const linha of valores) {
    const vars = Object.fromEntries(nomes.map((n, i) => [n, linha[i % linha.length] + i * 0.37]));
    const a = avaliar(alvo, vars), b = avaliar(exprErro, vars);
    if (Math.abs(a - b) > 1e-9) return `expr "${exprErro}" ≠ alternativa "${textoAlt}" em ${JSON.stringify(vars)}`;
  }
  return null;
}

// ------------------------------------------------------------------ índices e ids únicos
const ids = new Map();
function registra(tipo, id) {
  if (!id) { erro('ids', `${tipo} sem id`); return; }
  if (ids.has(id)) erro('ids', `id duplicado: ${id} (${ids.get(id)} e ${tipo})`); else ids.set(id, tipo);
}
const capitulo = {}, pagina = {}, bloco = {}, paragrafo = {}, modelo = {}, variante = {}, questao = {};
const paginaDoBloco = {}, blocoDoParagrafo = {}, capDoBloco = {};
for (const c of pack.capitulos || []) {
  registra('capítulo', c.id); capitulo[c.id] = c;
  for (const pg of c.paginas || []) {
    registra('página', pg.id); pagina[pg.id] = pg;
    for (const b of pg.blocos || []) {
      registra('bloco', b.id); bloco[b.id] = b; paginaDoBloco[b.id] = pg; capDoBloco[b.id] = c;
      for (const p of b.paragrafos || []) { registra('parágrafo', p.id); paragrafo[p.id] = p; blocoDoParagrafo[p.id] = b.id; }
    }
  }
  for (const k of c.cards || []) registra('card', k.id);
}
for (const m of pack.modelos || []) {
  registra('modelo', m.id); modelo[m.id] = m;
  for (const v of m.variantes || []) { registra('variante', v.id); variante[v.id] = v; }
}
for (const q of pack.questoes || []) { registra('questão', q.id); questao[q.id] = q; }
feito(`ids únicos verificados (${ids.size} ids)`);

for (const a of pack.avisos || []) erro('pack', a);

// ------------------------------------------------------------------ pack e capítulos
if (pack.licencaPadrao !== 'CC BY-SA 4.0') erro('pack', 'licencaPadrao deve ser "CC BY-SA 4.0"');
if (!pack.avisoColetanea) erro('pack', 'falta o aviso de coletânea (e.1)');
if (!Array.isArray(pack.creditos) || !pack.creditos.length) erro('pack', 'sem créditos');
const esperados = parcial ? ['mat-fa.c1', 'mat-fa.c2'] : ['mat-fa.c1', 'mat-fa.c2', 'mat-fa.c3', 'mat-fa.c4'];
for (const id of esperados) if (!capitulo[id]) erro('capítulos', `capítulo ${id} ausente`);
const PRE_G2 = { 'mat-fa.c1': [], 'mat-fa.c2': [], 'mat-fa.c3': ['mat-fa.c1', 'mat-fa.c2'], 'mat-fa.c4': ['mat-fa.c1'] };

for (const c of pack.capitulos || []) {
  const sec = `cap ${c.n}`;
  for (const k of ['id', 'n', 'titulo', 'habilidades', 'paginas', 'rodada']) if (c[k] == null) erro(sec, `campo obrigatório ausente: ${k}`);
  if ((c.paginas || []).length !== 2) erro(sec, `tem ${(c.paginas || []).length} páginas (o esquema pede 2)`);
  for (const pr of c.prereq || []) if (!PRE_G2[pr] && !capitulo[pr]) erro(sec, `pré-requisito inexistente: ${pr}`);
  if (PRE_G2[c.id] && (c.prereq || []).join() !== PRE_G2[c.id].join()) erro(sec, `pré-requisitos ${JSON.stringify(c.prereq)} diferentes de g.2 ${JSON.stringify(PRE_G2[c.id])}`);
  if ((c.rodada || []).length < 3) erro(sec, `rodada com ${(c.rodada || []).length} itens (mínimo 3)`);
  for (const id of [...(c.rodada || []), ...(c.reserva || [])])
    if (!questao[id] && !variante[id] && !modelo[id]) erro(sec, `item da rodada/reserva inexistente: ${id}`);
  const bs = (c.rodada || []).filter(id => questao[id]).map(id => questao[id].inep?.b);
  for (let i = 1; i < bs.length; i++) if (!(bs[i - 1] <= bs[i])) erro(sec, `rodada fora da ordem crescente de b: ${bs.join(' · ')}`);
  if (bs.length) feito(`${sec}: rodada em ordem de b (${bs.map(b => b.toFixed(2)).join(' · ')})`);
  for (const id of [...(c.rodada || []), ...(c.reserva || [])]) {
    const q = questao[id];
    if (q && q.capitulo && q.capitulo !== c.id) aviso(sec, `${id} está na rodada/reserva de ${c.id}, mas diz capitulo = ${q.capitulo}`);
  }
  // páginas: núcleo e modelo da página (pré-pergunta e checagem)
  for (const pg of c.paginas || []) {
    if (!pg.blocos?.some(b => b.id === pg.nucleo)) erro(sec, `${pg.id}: núcleo ${pg.nucleo} não é bloco da página`);
    const m = modelo[pg.modelo];
    if (!m) erro(sec, `${pg.id}: modelo da página ${pg.modelo} inexistente`);
    else {
      if (m.tipo !== 'pagina') erro(sec, `${pg.id}: o modelo ${m.id} deveria ter tipo "pagina"`);
      if (!m.variantes || m.variantes.length < 2) erro(sec, `${pg.id}: o modelo ${m.id} não tem pré-pergunta e checagem (linhas 0 e 1)`);
      else if (m.variantes.length !== 11) aviso(sec, `${m.id}: ${m.variantes.length} linhas (o esquema pede 11 num modelo de página)`);
    }
    // autoria do texto da equipe em pagina.fonte (e.2): é dela que Pack.creditos() lê a autoria da página;
    // sem ela, a tela de créditos diria "autoria não registrada".
    if (!autoriaOk(pg.fonte?.autoria)) erro(sec, `${pg.id}: página sem fonte.autoria { ia, modelo, revisor } (os créditos diriam "autoria não registrada")`);
    for (const b of pg.blocos || []) for (const p of b.paragrafos || []) {
      if (!p.html) erro(sec, `${p.id}: parágrafo vazio`);
      if (/<(p|div|table|figure|ul|ol|h\d)\b/i.test(p.html || '')) aviso(sec, `${p.id}: html do parágrafo com elemento de bloco (use figura)`);
      if (p.figura?.tipo === 'svg' && !p.figura.alt) erro(sec, `${p.id}: figura sem texto alternativo`);
    }
  }
}

// ------------------------------------------------------------------ pré-pergunta antes de todo bloco cobrado (b.5)
function temPrePergunta(bid) {
  const b = bloco[bid], pg = paginaDoBloco[bid];
  if (!b) return `bloco inexistente`;
  if (pg.nucleo === bid) {
    const m = modelo[pg.modelo];
    return m && m.variantes && m.variantes[0] && m.variantes[0].uso === 'pre' ? null : `núcleo sem pré-pergunta (modelo ${pg.modelo})`;
  }
  if (!b.prePergunta) return 'sem pré-pergunta (nem núcleo da página, nem bloco.prePergunta)';
  const m = modelo[b.prePergunta];
  if (!m) return `prePergunta aponta para modelo inexistente ${b.prePergunta}`;
  if (m.tipo !== 'bloco' || m.bloco !== bid) return `o modelo ${m.id} não é um modelo de bloco deste bloco`;
  if (!m.variantes?.length) return `o modelo ${m.id} não gerou a linha 0`;
  return null;
}
let blocosCobrados = 0;
for (const q of pack.questoes || []) {
  const alvo = new Set(q.blocos || []);
  for (const a of q.alternativas || []) if (a.paragrafo) alvo.add(blocoDoParagrafo[a.paragrafo] || `?${a.paragrafo}`);
  for (const bid of alvo) {
    blocosCobrados++;
    if (bid.startsWith('?')) { erro('pré-pergunta', `${q.id}: alternativa leva a parágrafo inexistente ${bid.slice(1)}`); continue; }
    const r = temPrePergunta(bid);
    if (r) erro('pré-pergunta', `${q.id} cobra o bloco ${bid}: ${r}`);
  }
  if (!(q.blocos || []).length) erro('pré-pergunta', `${q.id}: questão sem blocos que a expliquem`);
}
feito(`pré-pergunta conferida em ${blocosCobrados} ligações questão → bloco`);

// ------------------------------------------------------------------ questões do Enem: conferência com o INEP
const RE_ATRIB = /^INEP · Enem (\d{4}), 2º dia, Caderno Azul, questão (\d+) · CC BY-ND 3\.0$/;
const naRodada = new Set((pack.capitulos || []).flatMap(c => c.rodada || []));
const naReserva = new Set((pack.capitulos || []).flatMap(c => c.reserva || []));
let conferidas = 0;
for (const q of pack.questoes || []) {
  const sec = q.id;
  if (!naRodada.has(q.id) && !naReserva.has(q.id)) aviso(sec, 'questão fora de qualquer rodada ou reserva');
  if (q.origem !== 'enem' && !/^enem-/.test(q.id)) continue;
  const linhas = itensDe(q.ano);
  if (!linhas) { erro(sec, `ITENS_PROVA_${q.ano}.csv não encontrado`); continue; }
  const r = linhas.find(x => +x.CO_PROVA === q.inep?.coProva && +x.CO_POSICAO === q.numero);
  if (!r) { erro(sec, `item não encontrado no ITENS_PROVA (CO_PROVA ${q.inep?.coProva}, posição ${q.numero})`); continue; }
  if (!/azul/i.test(r.TX_COR)) erro(sec, `CO_PROVA ${r.CO_PROVA} não é do Caderno Azul (${r.TX_COR})`);
  if (+r.CO_ITEM !== q.inep.coItem) erro(sec, `CO_ITEM ${q.inep.coItem} ≠ INEP ${r.CO_ITEM}`);
  if (r.TX_GABARITO !== q.gabarito) erro(sec, `gabarito ${q.gabarito} ≠ TX_GABARITO do INEP ${r.TX_GABARITO}`);
  if (r.IN_ITEM_ABAN !== '0') erro(sec, `questão anulada pelo INEP (${r.TX_MOTIVO_ABAN || 'sem motivo'})`);
  if (q.anulada !== false) erro(sec, 'campo anulada deve ser false');
  const hab = `${r.SG_AREA}-H${+r.CO_HABILIDADE}`;
  if (q.habilidade !== hab) erro(sec, `habilidade ${q.habilidade} ≠ INEP ${hab}`);
  for (const [k, col] of [['a', 'NU_PARAM_A'], ['b', 'NU_PARAM_B'], ['c', 'NU_PARAM_C']])
    if (q.inep[k] == null || Math.abs(q.inep[k] - +r[col]) > 1e-4) erro(sec, `parâmetro ${k} ${q.inep[k]} ≠ INEP ${r[col]}`);
  const cur = curadoria.find(x => x.id === q.id);
  if (!cur) aviso(sec, 'questão fora do curadoria.json');
  else {
    if (cur.gabaritoINEP !== q.gabarito) erro(sec, `gabarito ${q.gabarito} ≠ curadoria.json ${cur.gabaritoINEP}`);
    if (cur.anulada || cur.confere === false) erro(sec, 'curadoria.json marca a questão como anulada ou divergente');
    if (cur.coItem !== q.inep.coItem) erro(sec, `CO_ITEM ${q.inep.coItem} ≠ curadoria.json ${cur.coItem}`);
    if ((cur.textoConferidoPDF || null) !== (q.textoConferidoPDF || null)) erro(sec, `textoConferidoPDF ${q.textoConferidoPDF} ≠ curadoria.json ${cur.textoConferidoPDF}`);
    if (cur.materialDeTerceiros && !String(q.materialDeTerceiros || '').startsWith(cur.materialDeTerceiros)) erro(sec, `material de terceiros do curadoria.json ausente na questão ("${cur.materialDeTerceiros}")`);
    if (!cur.materialDeTerceiros && q.materialDeTerceiros) erro(sec, 'material de terceiros na questão e não no curadoria.json');
  }
  // A transcrição do enem.dev, com as correções da conferência com o PDF oficial (o texto que vale é o do PDF).
  const bruto = rawDe(q.ano, q.numero);
  let raw = bruto;
  if (bruto) { try { raw = corrigirRaw(q.id, bruto); } catch (e) { erro(sec, e.message); } }
  const conf = CONFERENCIA[q.id];
  if (conf && q.textoConferidoPDF !== conf.em) erro(sec, `textoConferidoPDF (${q.textoConferidoPDF}) ≠ data da conferência com o PDF (${conf.em}, _dev/correcoes_enem.mjs)`);
  if (!conf && q.textoConferidoPDF) aviso(sec, 'textoConferidoPDF preenchido sem registro da conferência em _dev/correcoes_enem.mjs');
  if (!raw) erro(sec, 'transcrição do enem.dev não encontrada');
  else {
    if (raw.correctAlternative !== q.gabarito) erro(sec, `gabarito do enem.dev (${raw.correctAlternative}) diverge do INEP: a questão sai (g.2)`);
    if (textoDeHtml(q.contexto) !== textoDeMd(raw.context)) erro(sec, 'texto-base diferente da transcrição (CC BY-ND: só mudança de formato)');
    if ((q.introducao || '').trim() !== (raw.alternativesIntroduction || '').trim()) erro(sec, 'comando da questão diferente da transcrição');
    for (const ra of raw.alternatives || []) {
      const a = (q.alternativas || []).find(x => x.letra === ra.letter);
      if (!a) { erro(sec, `alternativa ${ra.letter} ausente`); continue; }
      if ((ra.text || '').trim() && (a.texto || '').trim() !== ra.text.trim()) erro(sec, `alternativa ${ra.letter} diferente da transcrição`);
      if (ra.file && !a.imagem?.src) erro(sec, `alternativa ${ra.letter} é imagem no original e não tem imagem local`);
    }
    if (q.fonteMd != null && q.fonteMd !== bruto.context) aviso(sec, 'fonteMd difere do markdown original do enem.dev');
  }
  const m = RE_ATRIB.exec(q.atribuicao || '');
  if (!m || +m[1] !== q.ano || +m[2] !== q.numero) erro(sec, `atribuição fora do padrão "INEP · Enem ${q.ano}, 2º dia, Caderno Azul, questão ${q.numero} · CC BY-ND 3.0"`);
  if (q.licencaUrl !== 'https://creativecommons.org/licenses/by-nd/3.0/legalcode') erro(sec, 'licencaUrl deve ser o legalcode da CC BY-ND 3.0');
  if (!/^CC BY-ND 3\.0/.test(q.licenca || '')) erro(sec, 'licença deve ser CC BY-ND 3.0');
  if (!q.explicacao) (naRodada.has(q.id) ? erro : aviso)(sec, 'sem explicação da equipe');
  if (!autoriaOk(q.autoria)) erro(sec, 'explicação e "o que faltou" sem autoria { ia, modelo, revisor }');
  if (q.modelo && !modelo[q.modelo]) erro(sec, `modelo ligado inexistente: ${q.modelo}`);
  conferidas++;
}
feito(`${conferidas} questão(ões) do Enem conferidas com ITENS_PROVA, curadoria.json e enem.dev`);

// ------------------------------------------------------------------ texto contra o PDF oficial (e.1, g.6)
// Toda questão com textoConferidoPDF e registro em _dev/correcoes_enem.mjs tem de ter cada parágrafo do
// texto-base, o comando e as cinco alternativas dentro do trecho do PDF oficial (espaços normalizados).
// Um arquivo de trechos por parte do caderno: fontes/pdf_azul_c12.txt (Caps. 1 e 2) e pdf_azul_c34.txt (Caps. 3 e 4).
const PASTA_FONTES = resolve(aqui, 'fontes');
const ARQS_PDF = existsSync(PASTA_FONTES) ? readdirSync(PASTA_FONTES).filter(n => /^pdf_azul_.*\.txt$/.test(n)).sort().map(n => join(PASTA_FONTES, n)) : [];
const trechosPdf = {};
for (const arq of ARQS_PDF) {
  let atual = null;
  for (const l of readFileSync(arq, 'utf8').split(/\r?\n/)) {
    const m = /^=== (enem-\d{4}-\d+) ·/.exec(l);
    if (m) {
      if (m[1] in trechosPdf) erro('pdf', `${m[1]}: trecho repetido em _dev/fontes/pdf_azul_*.txt`);
      atual = m[1]; trechosPdf[atual] = ''; continue;
    }
    if (atual && !l.startsWith('#')) trechosPdf[atual] += l + '\n';
  }
}
const normPdf = s => String(s).normalize('NFC').replace(/\s+/g, ' ').trim();
let conferidasPdf = 0, correcoesPdf = 0;
for (const q of pack.questoes || []) {
  if (!q.textoConferidoPDF || !CONFERENCIA[q.id]) continue;
  correcoesPdf += CONFERENCIA[q.id].correcoes.length;
  const t = trechosPdf[q.id];
  if (!t) { erro(q.id, 'conferida com o PDF, mas sem trecho em _dev/fontes/pdf_azul_*.txt'); continue; }
  const pdf = normPdf(t);
  const pecas = [...String(q.contexto || '').split(/<\/p>|<figure[\s\S]*?<\/figure>/).map(textoDeHtml), q.introducao, ...(q.alternativas || []).map(a => a.texto)]
    .filter(x => x && x.trim());
  const fora = pecas.filter(x => !pdf.includes(normPdf(x)));
  if (fora.length) erro(q.id, `texto diferente do PDF oficial: "${fora[0].slice(0, 90)}"`); else conferidasPdf++;
}
feito(`${conferidasPdf} questão(ões) com o texto igual ao do PDF oficial (${correcoesPdf} correções da transcrição, _dev/correcoes_enem.mjs)`);

// ------------------------------------------------------------------ "o que faltou" (d.6)
let linhasFalta = 0;
for (const q of pack.questoes || []) {
  const daRodada = naRodada.has(q.id);
  const reclama = daRodada ? erro : aviso;
  for (const a of q.alternativas || []) {
    if (a.letra === q.gabarito) { if (a.falta) erro(q.id, `a alternativa certa (${a.letra}) não pode ter "o que faltou"`); continue; }
    if (!a.falta) { reclama(q.id, `alternativa ${a.letra} sem "o que faltou"`); continue; }
    if (!a.paragrafo || !paragrafo[a.paragrafo]) reclama(q.id, `alternativa ${a.letra}: parágrafo inválido (${a.paragrafo})`);
    // Alternativa que é rótulo ou sequência ("IV", "1 → 4 → 5"), sem forma algébrica: a reprodução do erro
    // fica em exprTeste (com os dados em q.teste) e é conferida pelo build do capítulo (_dev/c34_build.mjs).
    // exprTeste também guarda a expressão com várias letras (2021 Q141: d, n, L, s), que o teste de
    // Pack.checar() não lê; quando ela é álgebra comum, este script confere; se não, fica o aviso.
    const ex = a.expr || a.exprTeste;
    if (!ex) { reclama(q.id, `alternativa ${a.letra}: sem expr que reproduza o erro (d.6)`); continue; }
    if (!(a.texto || '').trim()) { aviso(q.id, `alternativa ${a.letra} em imagem: expr não conferida automaticamente`); continue; }
    let r;
    try { r = confereExpr(ex, a.texto); }
    catch (e) {
      if (!a.expr && a.exprTeste) aviso(q.id, `alternativa ${a.letra} ("${a.texto}"): sem forma algébrica; d.6 conferido por exprTeste em _dev/c34_build.mjs`);
      else erro(q.id, `alternativa ${a.letra}: não consegui conferir a expr (${e.message})`);
      continue;
    }
    if (r) erro(q.id, `alternativa ${a.letra}: ${r}`); else linhasFalta++;
  }
}
feito(`${linhasFalta} linhas de "o que faltou" reproduzem a alternativa (teste de d.6)`);

// ------------------------------------------------------------------ modelos e variantes
let nVar = 0;
for (const m of pack.modelos || []) {
  const sec = m.id;
  if (m.licenca !== 'CC BY-SA 4.0') erro(sec, 'licença do modelo deve ser CC BY-SA 4.0');
  if (!autoriaOk(m.credito?.autoria)) erro(sec, 'modelo sem credito.autoria { ia, modelo, revisor }');
  if (!pagina[m.pagina]) erro(sec, `página inexistente: ${m.pagina}`);
  if (m.tipo === 'bloco' && !bloco[m.bloco]) erro(sec, `bloco inexistente: ${m.bloco}`);
  if (m.tipo === 'bloco' && (m.linhas || m.variantes || []).length !== 2) aviso(sec, 'modelo de bloco deveria ter 2 linhas');
  for (const e of m.erros || []) if (!paragrafo[e.paragrafo]) erro(sec, `erro "${e.expr}" leva a parágrafo inexistente ${e.paragrafo}`);
  if (!Array.isArray(m.variantes) || !m.variantes.length) { erro(sec, 'sem variantes'); continue; }
  for (const v of m.variantes) {
    nVar++;
    const alts = v.alternativas || [];
    if (alts.length !== 5) erro(v.id, `${alts.length} alternativas (são 5)`);
    if (new Set(alts.map(a => a.texto)).size !== alts.length) erro(v.id, 'alternativas repetidas');
    const certas = alts.filter(a => a.certa);
    if (certas.length !== 1) erro(v.id, `${certas.length} alternativas certas`);
    else if (certas[0].letra !== v.gabarito) erro(v.id, 'gabarito não bate com a alternativa certa');
    for (const a of alts) if (!a.certa && (!a.falta || !paragrafo[a.paragrafo])) erro(v.id, `alternativa ${a.letra} sem "o que faltou" ou com parágrafo inválido`);
    if (/\{[A-Za-z_=]/.test(v.enunciado + v.explicacao + alts.map(a => a.falta || '').join(' '))) erro(v.id, 'sobrou variável sem valor no texto');
    if (v.figura && !v.figura.alt) erro(v.id, 'figura sem texto alternativo');
  }
}
feito(`${(pack.modelos || []).length} modelos da equipe com ${nVar} variantes conferidas`);

// ------------------------------------------------------------------ imagens
let nImg = 0;
function confereImagem(dono, im) {
  if (!im?.src) { erro(dono, 'imagem sem src'); return; }
  if (!existsSync(resolve(RAIZ, im.src))) erro(dono, `imagem local inexistente: ${im.src}`);
  if (!im.alt || !String(im.alt).trim()) erro(dono, `imagem sem texto alternativo: ${im.src}`);
  if (im.altFonte && !['DOSVOX/INEP', 'equipe'].includes(im.altFonte)) aviso(dono, `altFonte desconhecida: ${im.altFonte}`);
  if (!im.altFonte) aviso(dono, `imagem sem altFonte (DOSVOX/INEP ou equipe): ${im.src}`);
  nImg++;
}
for (const q of pack.questoes || []) {
  for (const im of q.imagens || []) confereImagem(q.id, im);
  for (const a of q.alternativas || []) if (a.imagem) confereImagem(`${q.id} ${a.letra}`, a.imagem);
  for (const m of String(q.contexto || '').matchAll(/<img\b[^>]*>/g)) {
    const src = /src="([^"]+)"/.exec(m[0])?.[1], alt = /alt="([^"]*)"/.exec(m[0])?.[1];
    if (!src || !existsSync(resolve(RAIZ, src))) erro(q.id, `<img> do texto com arquivo inexistente: ${src}`);
    if (src && /^https?:/.test(src)) erro(q.id, `<img> aponta para a internet (${src}); use a cópia local`);
    if (!alt || !alt.trim()) erro(q.id, `<img> do texto sem alt: ${src}`);
  }
}
for (const p of Object.values(paragrafo)) if (p.figura?.src) confereImagem(p.id, p.figura);
feito(`${nImg} imagem(ns) locais com texto alternativo`);

// ------------------------------------------------------------------ cards (Decisão 1)
const TIPOS_CARD = new Set(['conceito', 'palavra-pista', 'procedimento', 'armadilha']);
let nCards = 0;
for (const c of pack.capitulos || []) {
  const cards = c.cards || [];
  if (cards.length < 6 || cards.length > 8) erro(`cap ${c.n}`, `${cards.length} cards (a Decisão 1 pede de 6 a 8)`);
  for (const k of cards) {
    nCards++;
    if (!k.frente || !k.verso) erro(k.id, 'card sem frente ou verso');
    if (palavras(k.frente) > 14) erro(k.id, `frente com ${palavras(k.frente)} palavras (máx. 14)`);
    if (palavras(k.verso) > 25) erro(k.id, `verso com ${palavras(k.verso)} palavras (máx. 25)`);
    if (!bloco[k.bloco]) erro(k.id, `card sem bloco válido (${k.bloco})`);
    else if (capDoBloco[k.bloco] !== c) erro(k.id, `o bloco ${k.bloco} é de outro capítulo`);
    // "Ainda não" mostra "ver o trecho · p. X, § Y": sem paragrafo, o app cairia no 1º § do bloco.
    if (!k.paragrafo) erro(k.id, 'card sem paragrafo (o "ver o trecho" iria para o 1º § do bloco)');
    else if (blocoDoParagrafo[k.paragrafo] !== k.bloco) erro(k.id, `parágrafo ${k.paragrafo} fora do bloco ${k.bloco}`);
    if (k.tipo && !TIPOS_CARD.has(k.tipo)) aviso(k.id, `tipo de card desconhecido: ${k.tipo}`);
    if (!autoriaOk(k.autoria)) erro(k.id, 'card sem autoria { ia, modelo, revisor }');
  }
}
feito(`${nCards} cards em ${(pack.capitulos || []).length} capítulos`);

// ------------------------------------------------------------------ 6 palavras seguidas (e.1)
const textoEnem = q => [textoDeHtml(q.contexto), q.introducao, ...(q.alternativas || []).map(a => a.texto)].join(' \n ');
function textosDoModelo(m) {
  const out = [[`${m.id} (enunciado-base)`, m.enunciado], [`${m.id} (explicação-base)`, m.explicacao],
    ...(m.erros || []).map((e, i) => [`${m.id} (erro ${i + 1})`, e.falta])];
  for (const v of m.variantes || []) {
    out.push([`${v.id} (enunciado)`, v.enunciado], [`${v.id} (explicação)`, v.explicacao]);
    for (const a of v.alternativas || []) if (a.falta) out.push([`${v.id} (${a.letra}, o que faltou)`, a.falta]);
  }
  return out;
}
let nComparacoes = 0;
for (const q of pack.questoes || []) {
  if (q.origem !== 'enem' && !/^enem-/.test(q.id)) continue;
  const alvo = ngramas(textoEnem(q));
  const ligados = [];
  ligados.push([`${q.id} (explicação)`, q.explicacao], [`${q.id} (leitura)`, q.leitura]);
  for (const a of q.alternativas || []) if (a.falta) ligados.push([`${q.id} (${a.letra}, o que faltou)`, a.falta]);
  const mods = new Set([q.modelo, ...(pack.modelos || []).filter(m => (m.ligadaA || []).includes(q.id)).map(m => m.id)]);
  for (const bid of q.blocos || []) {
    const pg = paginaDoBloco[bid], b = bloco[bid];
    if (pg?.nucleo === bid) mods.add(pg.modelo);
    if (b?.prePergunta) mods.add(b.prePergunta);
    for (const p of b?.paragrafos || []) ligados.push([`${p.id} (texto)`, p.html + ' ' + (p.figura?.legenda || '')]);
    for (const c of pack.capitulos || []) for (const k of c.cards || []) if (k.bloco === bid) ligados.push([`${k.id} (card)`, `${k.frente} ${k.verso}`]);
  }
  for (const mid of mods) if (modelo[mid]) ligados.push(...textosDoModelo(modelo[mid]));
  for (const [onde, t] of ligados) {
    if (!t) continue;
    nComparacoes++;
    for (const g of ngramas(t)) if (alvo.has(g)) { erro('6 palavras', `${onde} repete "${g}" da ${q.id}`); break; }
  }
}
// cards contra todas as questões do Enem do pack (Decisão 1)
const todasEnem = (pack.questoes || []).filter(q => q.origem === 'enem' || /^enem-/.test(q.id));
for (const c of pack.capitulos || []) for (const k of c.cards || []) {
  const g = ngramas(`${k.frente} ${k.verso}`);
  for (const q of todasEnem) { nComparacoes++; const al = ngramas(textoEnem(q)); for (const x of g) if (al.has(x)) { erro('6 palavras', `${k.id} repete "${x}" da ${q.id}`); break; } }
}
feito(`${nComparacoes} comparações de 6 palavras seguidas com o texto do INEP`);

// ------------------------------------------------------------------ compatibilidade com o núcleo do app
// O app não lê pack.modelos[].variantes: Pack.variante() (js/nucleo/pack.js) gera cada variante a partir
// das linhas. As duas gerações têm de bater letra por letra (e com o "pronto" gravado, quando houver),
// e Pack.checar() não pode recusar o pack.
const ARQ_PACK_JS = join(RAIZ, 'js/nucleo/pack.js');
if (!existsSync(ARQ_PACK_JS)) aviso('núcleo', 'js/nucleo/pack.js não existe: compatibilidade com o app não conferida');
else {
  try {
    const { Pack } = await import(pathToFileURL(ARQ_PACK_JS).href);
    const P = new Pack(pack);
    // Pack.variante() usa a variante já materializada quando o pack a traz; para conferir de fato a geração
    // pelas linhas (o caminho de um pack sem "variantes", como a cópia JSON), monta também um Pack sem elas.
    const Plinhas = new Pack({ ...pack, modelos: (pack.modelos || []).map(({ variantes: _v, ...m }) => m) });
    const r = P.checar();
    for (const e of r.erros) {
      // pré-requisito dos Caps. 3 e 4 quando eles ainda não existem (validação parcial)
      if (parcial && /pré-requisito desconhecido mat-fa\.c[34]/.test(e)) continue;
      erro('núcleo', `Pack.checar(): ${e}`);
    }
    for (const a of r.avisos) aviso('núcleo', `Pack.checar(): ${a}`);
    const sig = alts => alts.map(a => `${a.letra}:${a.texto}${a.certa ? '*' : ''}|${a.falta || ''}|${a.paragrafo || ''}`).join(' ');
    let iguais = 0, total = 0;
    for (const m of pack.modelos || []) for (const v of m.variantes || []) {
      total++;
      let w;
      try { w = P.variante(m.id, v.k); } catch (e) { erro('núcleo', `${v.id}: Pack.variante() falhou (${e.message})`); continue; }
      const dif = [];
      if (sig(w.alternativas) !== sig(v.alternativas)) dif.push('alternativas');
      let wl = null;
      try { wl = Plinhas.variante(m.id, v.k); } catch (e) { dif.push(`geração pelas linhas (${e.message})`); }
      if (wl && (sig(wl.alternativas) !== sig(v.alternativas) || wl.enunciado !== v.enunciado || wl.explicacao !== v.explicacao)) dif.push('geração pelas linhas');
      if (w.enunciado !== v.enunciado) dif.push('enunciado');
      if (w.explicacao !== v.explicacao) dif.push('explicação');
      const pronto = (m.linhas || [])[v.k]?.pronto;
      if (pronto && sig(pronto.alternativas.map(a => ({ ...a, certa: !!a.certa }))) !== sig(v.alternativas)) dif.push('pronto');
      if (dif.length) erro('núcleo', `${v.id}: Pack.variante() e gerador.js diferem em ${dif.join(', ')}`); else iguais++;
    }
    feito(`Pack.checar() sem erros do núcleo e ${iguais}/${total} variantes iguais entre Pack.variante() e gerador.js`);
  } catch (e) { erro('núcleo', `não consegui carregar js/nucleo/pack.js: ${e.message}`); }
}

// ------------------------------------------------------------------ relatório
const caps = (pack.capitulos || []).map(c => `Cap. ${c.n} ${c.titulo}`).join('; ');
const contagem = {
  paginas: Object.keys(pagina).length, blocos: Object.keys(bloco).length, paragrafos: Object.keys(paragrafo).length,
  modelos: (pack.modelos || []).length, variantes: nVar,
  questoesRodada: [...naRodada].filter(id => questao[id]).length, questoesReserva: [...naReserva].filter(id => questao[id]).length,
  cards: nCards,
};
console.log(`Prumo · validação do pack ${pack.id} (${pack.versao})${parcial ? ' · PARCIAL: só Caps. 1 e 2' : ''}`);
console.log(`Capítulos: ${caps}`);
console.log(`Conteúdo: ${contagem.paginas} páginas, ${contagem.blocos} blocos, ${contagem.paragrafos} parágrafos, ${contagem.modelos} modelos (${contagem.variantes} variantes), ${contagem.questoesRodada} questões de rodada + ${contagem.questoesReserva} de reserva, ${contagem.cards} cards.`);
console.log('');
for (const f of feitos) console.log(`  ok   ${f}`);
for (const a of avisos) console.log(`  AVISO ${a}`);
for (const e of erros) console.log(`  ERRO ${e}`);
console.log('');
console.log(erros.length ? `RECUSADO: ${erros.length} erro(s), ${avisos.length} aviso(s).` : `ACEITO: 0 erros, ${avisos.length} aviso(s).`);
process.exit(erros.length ? 1 : 0);
