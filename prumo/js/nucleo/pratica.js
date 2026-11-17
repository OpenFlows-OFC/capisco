/* =========================================================
   PRUMO · Mapa do que estudar e tópicos de prática (núcleo, sem DOM)
   O mapa segue o Enem: área → matéria → tópico. Um tópico de prática
   (conteudo/praticas/<id>.js + <id>.teoria.js) é estudado como uma partida:
   pergunta antes de ler → teoria → a resposta da pergunta → questões reais
   do Enem em ordem → fim da rodada. O nível do tópico sai do MESMO motor do
   caderno (motor.js: rodada, Leitner, revisões pela data da prova), numa
   segunda instância com o índice dos tópicos; o estado mora no mesmo
   st.topicos (chave = id do tópico, ex.: 'mat-porcentagem').
   O recomendador geral (montarMissaoGeral) começa pela árvore do caderno
   (recomendador.js) e acrescenta as regras P1–P3 dos tópicos.
   ========================================================= */
import * as R from './relogio.js';
import { criarMotor, NIVEL, revisaoAtrasada } from './motor.js';   // NIVEL: só reexportado (chave interna)
import { montarMissao, MIN } from './recomendador.js';
import { capacidade } from './plano.js';

/** As 4 áreas do Enem, com as matérias de cada uma (a ordem é a do Enem). */
export const AREAS = [
  { id: 'MT', nome: 'Matemática', materias: ['Matemática'] },
  { id: 'LC', nome: 'Linguagens', materias: ['Língua Portuguesa'] },
  { id: 'CN', nome: 'Ciências da Natureza', materias: ['Biologia', 'Física', 'Química'] },
  { id: 'CH', nome: 'Ciências Humanas', materias: ['História', 'Geografia', 'Filosofia e Sociologia'] },
];
export const IDS_AREAS = AREAS.map(a => a.id);
/** Tópicos de prática conhecidos (os arquivos podem ainda não existir: aparecem "em preparação"). */
export const CONHECIDOS = [
  { id: 'mat-porcentagem', area: 'MT', materia: 'Matemática', titulo: 'Porcentagem e juros' },
  { id: 'mat-proporcao', area: 'MT', materia: 'Matemática', titulo: 'Razão, proporção e escala' },
  { id: 'mat-estatistica', area: 'MT', materia: 'Matemática', titulo: 'Estatística: média, mediana, moda e gráficos' },
  { id: 'mat-geometria', area: 'MT', materia: 'Matemática', titulo: 'Geometria: áreas e volumes' },
  { id: 'lc-interpretacao', area: 'LC', materia: 'Língua Portuguesa', titulo: 'Interpretação de texto e gêneros' },
  { id: 'lc-variacao', area: 'LC', materia: 'Língua Portuguesa', titulo: 'Variação linguística e funções da linguagem' },
  { id: 'lc-argumentacao', area: 'LC', materia: 'Língua Portuguesa', titulo: 'Argumentação e recursos expressivos' },
];
export const IDS_PRATICA = CONHECIDOS.map(c => c.id);
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const LICENCA_INEP = 'https://creativecommons.org/licenses/by-nd/3.0/legalcode';
export const SEP = ':';   // id de item de prática: '<tópico>:<questão>' (ex.: 'mat-porcentagem:enem-2023-143')
/** Quantas questões do Enem cabem numa rodada de tópico, pelos minutos do plano. */
export const QUESTOES_POR_MINUTOS = { 15: 3, 25: 4, 40: 6 };
export const MIN_TEORIA = 6;   // rever a apostila já lida (min); a primeira leitura usa minutosApostila()

/** Minutos para ler a apostila pela primeira vez: palavras/140 + 1,5 por exemplo resolvido (mínimo 5).
 *  É a mesma conta da capa da apostila ("cerca de N min"); o view model da teoria leva o número pronto. */
export function minutosApostila(te) {
  const secoes = Array.isArray(te && te.secoes) ? te.secoes : [];
  const s = x => (Array.isArray(x) ? x.filter(y => typeof y === 'string') : []);
  let palavras = 0, nEx = 0;
  for (const x of secoes) {
    palavras += s(x && x.paragrafos).join(' ').split(/\s+/).length;
    nEx += [x && x.exemplo, ...(x && Array.isArray(x.exemplos) ? x.exemplos : [])].filter(e => e && typeof e.enunciado === 'string').length;
  }
  return Math.max(5, Math.round(palavras / 140 + nEx * 1.5));
}

const texto = (x, max = 4000) => (typeof x === 'string' ? x.slice(0, max) : '');
const curto = t => String(t || '').split(':')[0].trim();

/** Confere um tópico carregado; devolve { topico, teoria, questoes } limpo, ou null (fica "em preparação"). */
export function validar(id, topico, teoria) {
  if (!topico || typeof topico !== 'object' || topico.id !== id) return null;
  if (!teoria || typeof teoria !== 'object' || teoria.id !== id || !Array.isArray(teoria.secoes) || !teoria.secoes.length) return null;
  const pg = teoria.pergunta;
  if (!pg || !pg.alternativas || !LETRAS.includes(pg.certa) || !(pg.certa in pg.alternativas)) return null;
  const questoes = (Array.isArray(topico.questoes) ? topico.questoes : []).filter(q => q && typeof q.id === 'string' && LETRAS.includes(q.gabarito)
    && q.alternativas && LETRAS.filter(l => typeof q.alternativas[l] === 'string').length >= 4 && typeof q.alternativas[q.gabarito] === 'string');
  if (!questoes.length) return null;
  return { topico, teoria, questoes };
}

/** Os tópicos de prática carregados e o motor deles. lista: [{ id, topico?, teoria? }] (arquivos ausentes: sem topico/teoria). */
export class Praticas {
  constructor(lista = []) {
    this._t = {};
    this.ordem = [];
    const porId = Object.fromEntries((lista || []).filter(x => x && x.id).map(x => [x.id, x]));
    const ids = [...IDS_PRATICA, ...Object.keys(porId).filter(id => !IDS_PRATICA.includes(id))];
    for (const id of ids) {
      const x = porId[id];
      const v = x ? validar(id, x.topico, x.teoria) : null;
      if (!v) continue;
      const con = CONHECIDOS.find(c => c.id === id) || {};
      const itens = v.questoes.map(q => this._item(id, v.topico, q));
      this._t[id] = { id, area: v.topico.area || con.area, materia: v.topico.materia || con.materia, titulo: v.topico.titulo || con.titulo, topico: v.topico, teoria: v.teoria, itens, ordem: this.ordem.length };
      this.ordem.push(id);
    }
    const topicos = this.ordem.map((id, ordem) => ({ id, n: 0, nome: this._t[id].titulo, prereq: [], ordem, conjunto: 'praticas', itens: this._t[id].itens.map(it => this.paraMotor(it)) }));
    const idx = { conjuntos: { praticas: { id: 'praticas', titulo: 'Tópicos de prática', materia: 'pratica', semProva: true, topicos } }, topicos: {}, itens: {}, dependentes: {} };
    for (const t of topicos) { idx.topicos[t.id] = t; for (const it of t.itens) idx.itens[it.id] = it; }
    this.M = criarMotor(idx);
  }
  ids() { return this.ordem.slice(); }
  existe(id) { return !!this._t[id]; }
  get(id) { return this._t[id] || null; }
  titulo(id) { return (this._t[id] || CONHECIDOS.find(c => c.id === id) || {}).titulo || ''; }
  curto(id) { return curto(this.titulo(id)); }
  /** Item no formato dos itens do pack (questão do Enem), para as telas e o motor. */
  _item(id, topico, q) {
    const dia = (/(\d)º dia/.exec(q.fonte || '') || [])[1] || (['LC', 'CH'].includes(topico.area) ? '1' : '2');
    const fonte = texto(q.fonte, 300) || `Enem ${q.ano}, ${dia}º dia, questão ${q.numero}. INEP, CC BY-ND 3.0.`;
    return {
      id: `${id}${SEP}${q.id}`, questao: q.id, topico: id, cap: id, origem: 'enem', pratica: true,
      numero: q.numero, prova: `Enem ${q.ano}, ${dia}º dia`, rotulo: `Questão ${q.numero} do Enem ${q.ano}, ${dia}º dia`,
      contexto: `${texto(q.contexto, 20000)}${texto(q.enunciado, 4000)}`, enunciado: `${texto(q.contexto, 20000)}${texto(q.enunciado, 4000)}`, introducao: '', imagens: [], blocos: [],
      alternativas: LETRAS.filter(l => typeof q.alternativas[l] === 'string').map(l => ({ letra: l, texto: q.alternativas[l], html: true, certa: l === q.gabarito, falta: l === q.gabarito ? null : texto((q.faltou || {})[l], 800) || null, paragrafo: null })),
      gabarito: q.gabarito, explicacao: texto(q.explicacao, 2000), rodape: fonte, atribuicao: fonte, licencaUrl: LICENCA_INEP,
      dif: Number.isFinite(q.b) ? q.b : 0, nivel: q.nivel || null, habilidade: q.habilidade || null,
      // seção da apostila que a questão cobra (1, 2…), quando o conteúdo informa: "Rever a apostila" abre nela
      secao: Number.isInteger(q.secao) && q.secao >= 1 ? q.secao : null,
    };
  }
  /** A pergunta de antes da teoria, no mesmo formato (sem cabeçalho de caderno: é da equipe). */
  itemPre(id) {
    const t = this._t[id];
    if (!t) return null;
    const pg = t.teoria.pergunta;
    return {
      id: `${id}${SEP}pre`, topico: id, cap: id, origem: 'equipe', pratica: true, pre: true, numero: null, prova: null, rotulo: 'Pergunta da equipe Prumo',
      contexto: '', enunciado: `<p>${esc(pg.enunciado)}</p>`, introducao: '', imagens: [], blocos: [], semCabecalho: true,
      alternativas: LETRAS.filter(l => typeof pg.alternativas[l] === 'string').map(l => ({ letra: l, texto: pg.alternativas[l], certa: l === pg.certa, falta: null, paragrafo: null })),
      gabarito: pg.certa, explicacao: texto(pg.porque, 1000), rodape: null, licencaUrl: null, dif: 0,
    };
  }
  /** Item de prática pelo id ('<tópico>:<questão>' ou '<tópico>:pre'); null se não for de prática. */
  item(itemId) {
    const s = String(itemId), i = s.indexOf(SEP);
    if (i < 0) return null;
    const id = s.slice(0, i), t = this._t[id];
    if (!t) return null;
    if (s.slice(i + 1) === 'pre') return this.itemPre(id);
    return t.itens.find(x => x.id === s) || null;
  }
  paraMotor(item) {
    return { id: item.id, nivel: 'aplicar', topico: item.topico, dif: item.dif, explicacao: item.explicacao || '',
      opcoes: item.alternativas.map(a => ({ t: a.texto, ok: a.certa, erro: a.falta || undefined })) };
  }
  questoes(id) { return ((this._t[id] || {}).itens || []).map(x => x.id); }
  /** Minutos da primeira leitura da apostila do tópico (a conta da capa). */
  minutosTeoria(id) { const t = this._t[id]; if (!t) return MIN_TEORIA; if (t.minTeoria == null) t.minTeoria = minutosApostila(t.teoria); return t.minTeoria; }
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- estado do aluno num tópico ---------------- */
const visto = (st, id) => (st.vistos || {})[id] || null;
/** 'novo' (nunca começou) | 'pratica' (começou, ainda não venceu a primeira rodada) | 'consolidado' | 'agendado' | 'vencido' */
export function estadoTopico(st, prat, id, d) {
  const t = st.topicos[id];
  const comecou = !!((st.praticas || {})[id]) || !!(t && (t.tentativas || []).length);
  if (!t || !t.caixa) return comecou ? 'pratica' : 'novo';
  return prat.M.estado(st, id, d);
}
/** Questões do tópico ainda nunca respondidas, em ordem (a do arquivo: b crescente). */
export const ineditas = (st, prat, id) => prat.questoes(id).filter(q => !visto(st, q));
/** Questões para uma rodada: inéditas primeiro; sem inéditas, as vistas há 7 dias ou mais (a mais antiga primeiro). */
export function questoesDaRodada(st, prat, id, d, n, reservados = new Set(), { livre = false } = {}) {
  const out = ineditas(st, prat, id).filter(q => !reservados.has(q)).slice(0, n);
  if (out.length < n && livre) {
    // estudo livre: quantas vezes quiser; sem inéditas, as vistas há mais tempo voltam
    const vistas = prat.questoes(id).filter(q => visto(st, q) && !reservados.has(q) && !out.includes(q))
      .sort((a, b) => (visto(st, a) < visto(st, b) ? -1 : visto(st, a) > visto(st, b) ? 1 : 0));
    out.push(...vistas.slice(0, n - out.length));
  }
  if (out.length < n) {
    const velhas = prat.questoes(id).filter(q => visto(st, q) && R.diff(visto(st, q), d) >= 7 && !reservados.has(q) && !out.includes(q))
      .sort((a, b) => (visto(st, a) < visto(st, b) ? -1 : visto(st, a) > visto(st, b) ? 1 : 0));
    out.push(...velhas.slice(0, n - out.length));
  }
  out.forEach(q => reservados.add(q));
  return out;
}
/** Item da revisão de um tópico: questão inédita (em ordem); sem inédita, a vista há mais tempo. */
export function itemDeRevisao(st, prat, id, d, reservados = new Set()) {
  const ined = ineditas(st, prat, id).filter(q => !reservados.has(q));
  if (ined.length) return ined[0];
  const todas = prat.questoes(id).filter(q => !reservados.has(q)).sort((a, b) => ((visto(st, a) || '') < (visto(st, b) || '') ? -1 : 1));
  return todas[0] || null;
}
/** Tópicos com revisão vencida (a mais atrasada primeiro). */
export function vencidas(st, prat, d) {
  return prat.ids().filter(id => { const t = st.topicos[id]; return t && t.caixa >= 1 && t.proxima && t.proxima <= d; })
    .sort((a, b) => (st.topicos[a].proxima < st.topicos[b].proxima ? -1 : st.topicos[a].proxima > st.topicos[b].proxima ? 1 : 0) || prat.get(a).ordem - prat.get(b).ordem);
}
export function passoRevisaoPratica(st, prat, id, d, reservados) {
  const q = itemDeRevisao(st, prat, id, d, reservados);
  if (!q) return null;
  reservados.add(q);
  const t = st.topicos[id];
  return { t: 'revisao', fonte: 'pratica', id: q, cap: id, papel: 'aplicar', origem: 'enem', atrasada: !!(t && revisaoAtrasada(st, t.proxima, d)), motivo: visto(st, q) ? 'questão vista há mais tempo' : 'questão do Enem inédita' };
}
/** Regra da rodada de um tópico de prática, anunciada antes (b.3, versão do tópico: só questões do Enem). */
export function regraTopico(titulo) {
  return {
    frase: 'Acerte 2 questões seguidas e o tópico entra no nível 1 de 5',
    insercao: 'Depois de um erro, valem as 2 próximas certas seguidas.',
    ganho: `Acerte 2 questões seguidas e ${titulo} entra no nível 1 de 5.`,
    falta: 'Para fechar: 2 certas seguidas, falta 1',
  };
}

/**
 * Passos de um tópico: [pergunta antes de ler] → teoria → questões (rodada) ou revisão.
 * - nunca respondeu a pergunta de antes → ela vem primeiro;
 * - revisão vencida → teoria + 1 questão de revisão (vale a primeira resposta);
 * - já em Aprendendo ou acima, sem revisão vencida → teoria + revisão antecipada (não sobe nível);
 * - senão → teoria + rodada (inéditas em ordem).
 */
export function passosTopico(st, prat, id, d, reservados = new Set(), { livre = false } = {}) {
  const t = st.topicos[id] || {}, est = estadoTopico(st, prat, id, d);
  const n = QUESTOES_POR_MINUTOS[(st.perfil || {}).minutos] || 4;
  const out = [];
  const pre = ((st.praticas || {})[id] || {}).pre;
  if (!pre && !(t.tentativas || []).length) out.push({ t: 'pre', fonte: 'pratica', id: `${id}${SEP}pre`, cap: id, alvo: 'teoria' });
  out.push({ t: 'teoria', fonte: 'pratica', cap: id });
  if (est === 'agendado' || est === 'vencido') {
    const rv = passoRevisaoPratica(st, prat, id, d, reservados);
    if (rv) out.push(rv);
    return { passos: out, modo: 'revisao' };
  }
  const extra = t.caixa >= 1;
  const r = `${extra ? 'x' : 'p'}${SEP}${id}`;
  for (const q of questoesDaRodada(st, prat, id, d, n, reservados, { livre })) {
    out.push({ t: 'questao', fonte: 'pratica', id: q, cap: id, papel: 'aplicar', origem: 'enem', r, rodadaTipo: extra ? 'extra' : (t.tentativas || []).length ? 'pratica' : 'novo', antecipada: extra || undefined });
  }
  return { passos: out, modo: extra ? 'antecipada' : 'rodada' };
}
/** Minutos da apostila nesta missão: a primeira leitura pela conta da capa; depois de já ter
 *  respondido questões do tópico, é rever (MIN_TEORIA), e dá para pular com "Já sei isto". */
export function minutosDaTeoriaNaMissao(st, prat, id) {
  if (!prat || !prat.existe(id)) return MIN_TEORIA;
  const leu = st && ((st.topicos[id] || {}).tentativas || []).length > 0;
  return leu ? Math.min(MIN_TEORIA, prat.minutosTeoria(id)) : prat.minutosTeoria(id);
}
export function estimarMinutosTopico(passos, prat = null, st = null) {
  let m = 0;
  for (const p of passos) m += p.t === 'pre' ? MIN.pre : p.t === 'teoria' ? minutosDaTeoriaNaMissao(st, prat, p.cap) : p.t === 'questao' ? MIN.enem : p.t === 'revisao' ? MIN.revisao : 0;
  return m;
}

/**
 * Recomendador geral: a árvore do caderno (R0–R9) e, depois, as regras dos tópicos de prática.
 * P0 · o aluno escolheu um tópico ("Estudar este tópico hoje") → a missão é o tópico (e as revisões vencidas que couberem).
 * P1 · revisão vencida de tópico → entra na missão do dia como revisão (as atrasadas primeiro).
 * P2 · tópico começado e ainda não vencido, e o caderno sem capítulo em curso (R8 ou R9) → o tópico continua.
 * P3 · nada novo no caderno (R9 sem revisão) → o próximo tópico das áreas escolhidas no plano.
 * Pura: não muda o estado. Mesmo estado e mesma data dão a mesma missão.
 */
export function montarMissaoGeral(st, pack, M, prat, d, opts = {}) {
  // as revisões de tópico que o P1 vai somar entram já nas frases da árvore do caderno ("Por que esta missão?")
  const comTopicos = !!(prat && prat.ids().length && !opts.soCaderno && !opts.topico && !opts.livre);
  const vencP1 = comTopicos ? vencidas(st, prat, d) : [];
  const extraP1 = vencP1.slice(0, Math.max(1, Math.min(vencP1.length, capacidade(st))))
    .map(id => ({ nome: prat.titulo(id), atrasada: revisaoAtrasada(st, st.topicos[id].proxima, d) }));
  const base = montarMissao(st, pack, M, d, Object.assign({}, opts, { revisoesExtra: vencP1.length ? extraP1 : [] }));
  if (!prat || !prat.ids().length || opts.soCaderno) return base;
  if (base.tipo === 'folga' || base.tipo === 'pausa') return base;
  const trilha = base.trilha;
  const r = (id, ok, txt) => (trilha.push({ id, ok: !!ok, txt }), !!ok);
  const reservados = new Set(base.passos.map(p => p.id).filter(Boolean));
  const vencP = vencidas(st, prat, d);
  const minutos = (st.perfil || {}).minutos || 25;
  const nome = id => prat.titulo(id);
  const comecados = prat.ids().filter(id => estadoTopico(st, prat, id, d) === 'pratica');
  // revisões vencidas: as do caderno, que a árvore já pôs na missão, e as dos outros tópicos
  const revsBase = base.passos.filter(p => p.t === 'revisao');
  const revsDe = id => [...revsBase, ...vencP.filter(x => x !== id).map(x => passoRevisaoPratica(st, prat, x, d, reservados)).filter(Boolean)];
  const topico = (id, regra, frase, { revisoes = [], fora = [] } = {}) => {
    const { passos } = passosTopico(st, prat, id, d, reservados, { livre: !!opts.livre });
    // fora: as revisões que ficam para o próximo dia de estudo porque, junto com um tópico, entram até capacidade(st)
    const limpo = { retorno: false, reta: null, capAdiado: null, revisoesForaDoOrcamento: fora.length, foraPor: fora.length ? 'capacidade' : null, revisoesFora: fora.map(p => p.cap) };
    if (opts.livre) return Object.assign({}, base, limpo, { regra: 'L', tipo: 'topico', cap: id, frase, passos, minutos: estimarMinutosTopico(passos, prat, st) });
    const out = Object.assign({}, base, limpo, { regra, tipo: 'topico', cap: id, frase, passos: [...revisoes.filter(p => p.atrasada), ...passos, ...revisoes.filter(p => !p.atrasada)] });
    out.minutos = estimarMinutosTopico(out.passos, prat, st);
    return out;
  };
  if (opts.livre && opts.topico && prat.existe(opts.topico)) {
    r('L', true, `Estudo por conta própria: ${nome(opts.topico)} (a missão do dia já foi cumprida)`);
    return topico(opts.topico, 'L', `Missão de hoje cumprida. ${nome(opts.topico)} por conta própria.`);
  }
  if (opts.topico && prat.existe(opts.topico)) {
    r('P0', true, `Você escolheu ${nome(opts.topico)} em Estudar`);
    // o tópico escolhido entra no lugar da missão, mas as revisões vencidas continuam (até a capacidade do dia);
    // no corte, as mais atrasadas ficam e as que vencem hoje (ou depois) saem primeiro
    const px = p => (st.topicos[p.cap] || {}).proxima || '';
    const todas = revsDe(opts.topico).map((p, i) => ({ p, i })).sort((a, b) => (px(a.p) < px(b.p) ? -1 : px(a.p) > px(b.p) ? 1 : a.i - b.i)).map(x => x.p);
    const lim = capacidade(st), cabem = todas.slice(0, lim), fora = todas.slice(lim);
    const fraseP0 = `Você escolheu estudar ${nome(opts.topico)} hoje.${cabem.length ? ` ${cabem.length === 1 ? 'A revisão vencida continua' : `As ${cabem.length} revisões vencidas continuam`} na missão.` : ''}${fora.length ? ` ${fora.length === 1 ? 'Mais 1 fica' : `Mais ${fora.length} ficam`} para o próximo dia de estudo: junto com um tópico, entram até ${lim} revisões por dia.` : ''}`;
    return topico(opts.topico, 'P0', fraseP0, { revisoes: cabem, fora });
  }
  const semNovo = !base.reta && (base.regra === 'R8' || base.regra === 'R9');
  let comecado = semNovo ? comecados[0] : null, motivoP2 = null;
  if (comecado) {
    // a revisão vencida tem prioridade: o tópico só continua hoje se couber junto com as revisões
    const n = revsBase.length + vencP.filter(x => x !== comecado).length;
    const tTop = estimarMinutosTopico(passosTopico(st, prat, comecado, d, new Set(reservados)).passos, prat, st);
    if (n && tTop + n * MIN.revisao > minutos) { motivoP2 = `${nome(comecado)} começado, mas as revisões vencidas não cabem junto nos seus ${minutos} min: elas vêm primeiro`; comecado = null; }
  }
  if (r('P2', !!comecado, comecado ? `${nome(comecado)} começado e ainda não vencido` : motivoP2 || (comecados.length ? 'O caderno tem capítulo em curso ou está na reta final' : 'Nenhum tópico começado e não vencido'))) {
    return topico(comecado, 'P2', `Você começou ${nome(comecado)} e ainda não acertou duas seguidas. Hoje ele continua.`, { revisoes: revsDe(comecado) });
  }
  const areas = ((st.perfil || {}).areas || ['MT']);
  const livre = base.regra === 'R9' && base.tipo === 'questaoDoDia' && !vencP.length && !base.reta
    ? prat.ids().filter(id => areas.includes(prat.get(id).area) && estadoTopico(st, prat, id, d) === 'novo')[0] : null;
  if (r('P3', !!livre, livre ? `Nada novo no caderno; próximo tópico das suas áreas: ${nome(livre)}` : 'O caderno ainda tem o que fazer')) {
    return topico(livre, 'P3', `Nada vence hoje e o caderno de Funções afins está em dia. Hoje: ${nome(livre)}, um tópico novo das matérias que você escolheu.`, { revisoes: revsDe(livre) });
  }
  if (r('P1', vencP.length > 0, vencP.length ? `${vencP.length === 1 ? 'Revisão vencida' : 'Revisões vencidas'} de tópico: ${vencP.map(nome).join(', ')}` : 'Nenhuma revisão de tópico vencida')) {
    const lim = Math.max(1, Math.min(vencP.length, capacidade(st)));
    const revs = vencP.slice(0, lim).map(id => passoRevisaoPratica(st, prat, id, d, reservados)).filter(Boolean);
    const iCards = base.passos.findIndex(p => p.t === 'cards');
    const passos = base.passos.slice();
    const atr = revs.filter(p => p.atrasada), doDia = revs.filter(p => !p.atrasada);
    passos.splice(0, 0, ...atr);
    passos.splice(iCards < 0 ? passos.length : iCards + atr.length, 0, ...doDia);
    const out = Object.assign({}, base, { passos });
    if (base.tipo === 'questaoDoDia' && !base.passos.some(p => p.t === 'dia')) out.tipo = 'revisoes';
    out.minutos = (base.minutos || 0) + revs.length * MIN.revisao;
    // a frase da árvore já conta estas revisões (montarMissao recebeu revisoesExtra): nada a acrescentar
    return out;
  }
  return base;
}

export { NIVEL };

/** SVG do conteúdo, só depois de limpo: sem script, foreignObject, iframe, eventos on* nem links externos.
 *  Devolve null se não for um <svg> único. */
export function limparSvg(svg) {
  if (typeof svg !== 'string' || svg.length > 60000) return null;
  let s = svg.trim();
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>\s*$/i.test(s)) return null;
  s = s.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|foreignObject|iframe|object|embed|style|image|use|a)\b[\s\S]*?(<\/\1\s*>|\/>)/gi, '')
    .replace(/<\/?(script|foreignObject|iframe|object|embed|style|image|use|a)\b[^>]*>/gi, '')
    .replace(/\s(on[a-z]+|xlink:href|href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
  return /<script|on[a-z]+\s*=|foreignObject/i.test(s) ? null : s;
}
