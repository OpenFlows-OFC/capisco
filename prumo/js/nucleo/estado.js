/* =========================================================
   PRUMO · Estado do aluno (núcleo, sem DOM)
   Reescrito do zero (e.5): lista própria de campos do esquema e.4, mantém
   `prova: null`, aplica o deslocamento do modo demonstração ao carregar,
   exige app "prumo" e versão 2 para restaurar (e recusa a cópia do Capisco)
   e devolve o erro quando o salvamento falha, em vez de engoli-lo.
   O estado vive no localStorage na chave "prumo" (nunca "capisco.v1").
   ========================================================= */
import * as R from './relogio.js';

export const CHAVE = 'prumo';
export const APP = 'prumo';
export const VERSAO = 2;
export const ASSINATURA = 'Prumo · App de Estudos · cópia do progresso';
export const MSG_COPIA_INVALIDA = 'Este arquivo não é uma cópia do Prumo (ou é de outra versão). Nada foi alterado.';
export const MSG_FALHA_SALVAR = 'Não consegui salvar neste aparelho. Salve uma cópia agora para não perder o progresso.';

export class ErroCopia extends Error {
  constructor(msg = MSG_COPIA_INVALIDA, detalhe = '') { super(msg); this.name = 'ErroCopia'; this.detalhe = detalhe; }
}

export function vazio() {
  return {
    app: APP, versao: VERSAO,
    perfil: null,
    conjuntosAtivos: [],
    praticas: {},          // tópicos de prática começados: { id: { desde, pre: { alt, dia, revelado } | null } }
    pausa: { desde: null, ate: null },
    hojeNao: {},           // dias em que o aluno marcou "Hoje não": para as revisões, contam como folga (não viram atraso)
    topicos: {},
    pre: {},
    vistos: {},
    missao: null,
    dias: {},
    semanas: {},
    notas: [],
    erros: [],
    cards: {},
    baralho: {},
    carimbos: {},
    intencao: null,        // "quando e onde": { dia, horario, ancora } (escolhido no Pronto por hoje)          // dias com o visto da missão (Coleção de vistos; só cresce)
    marcos: {},
    chefes: {}, selos: [], chefeAvisado: {},
    historico: [],
    refazer: null,
    seq: { erro: 0, nota: 0 },
    // nivelMaximo: 5 para todo aluno; só o estado de exemplo (demo.exemplo) usa o teto do pack (nivelMaximoDemo)
    config: { som: false, nivelMaximo: 5, ultimaCopia: null, simboloConstancia: 'risquinhos', alarme: null,
      demo: { ativo: false, offset: 0, exemplo: false, guardado: null } },
  };
}

/* ---------------- validação ---------------- */
const ehId = x => typeof x === 'string' && /^[\w:.#-]{1,120}$/.test(x);
const str = (x, max = 400) => (typeof x === 'string' ? x.slice(0, max) : '');
const int = (x, min, max, pad) => { const n = Math.round(Number(x)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : pad; };
const num = (x, pad = 0) => (Number.isFinite(Number(x)) ? Number(x) : pad);
const data = (x, pad = null) => (R.ehData(x) ? x : pad);
const arr = x => (Array.isArray(x) ? x : []);
const obj = x => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
const LETRA = x => (['A', 'B', 'C', 'D', 'E'].includes(x) ? x : null);
const ESTADOS_MISSAO = ['hoje', 'pergunta', 'leitura', 'feedback', 'trecho', 'fimDaRodada', 'cards', 'fimDaMao', 'encerramento', 'feito',
  'prova', 'provaPergunta', 'provaFeedback', 'provaTrecho', 'provaResultado'];

function perfil(p) {
  p = obj(p);
  const dias = [...new Set(arr(p.dias).map(Number).filter(n => Number.isInteger(n) && n >= 0 && n <= 6))].sort();
  return {
    provaTipo: ['escola', 'enem', 'provao', 'vestibular', 'naosei', 'outro'].includes(p.provaTipo) ? p.provaTipo : 'naosei',
    prova: data(p.prova),
    dias: dias.length ? dias : [1, 2, 3, 4],
    metaSemana: p.metaSemana === null ? null : int(p.metaSemana, 0, 7, Math.max(1, (dias.length || 4) - 1)),
    minutos: [15, 25, 40].includes(+p.minutos) ? +p.minutos : 25,
    areas: (() => { const a = [...new Set(arr(p.areas).filter(x => ['MT', 'LC', 'CN', 'CH'].includes(x)))]; return a.length ? a : ['MT']; })(),
    horario: /^\d{2}:\d{2}$/.test(p.horario) ? p.horario : null,
    porque: str(p.porque, 200) || null,
    seEntao: p.seEntao ? { quando: str(obj(p.seEntao).quando, 60), onde: str(obj(p.seEntao).onde, 60) } : null,
    criadoEm: data(p.criadoEm),
    nome: str(p.nome, 40).replace(/\s+/g, ' ').trim() || null,
    foto: typeof p.foto === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.foto) && p.foto.length <= 200000 ? p.foto : null,
  };
}
/** Perfil do Primeiro uso e do Plano, conferido campo a campo. */
export const normalizarPerfil = p => perfil(p);
function topico(t) {
  t = obj(t);
  const out = {
    caixa: int(t.caixa, 0, 5, 0), proxima: data(t.proxima),
    tentativas: arr(t.tentativas).slice(-300).map(x => (x = obj(x), ehId(x.item) && ['ok', 'erro'].includes(x.res)
      ? { item: x.item, dia: data(x.dia, R.hoje()), em: num(x.em), res: x.res, alt: LETRA(x.alt), tipo: str(x.tipo, 20) || null, primeiraVez: x.primeiraVez !== false }
      : null)).filter(Boolean),
    rodadas: arr(t.rodadas).slice(-200).map(x => (x = obj(x), {
      dia: data(x.dia, R.hoje()), venceu: !!x.venceu, tentativas: int(x.tentativas, 0, 99, 0), de: int(x.de, 0, 5, 0), para: int(x.para, 0, 5, 0),
      tipo: ['novo', 'pratica', 'revisao', 'extra'].includes(x.tipo) ? x.tipo : 'novo',
    })),
  };
  if (data(t.ultimoOk)) out.ultimoOk = t.ultimoOk;
  if (t.ultimoOkEm) out.ultimoOkEm = num(t.ultimoOkEm);
  const tr = obj(t.travado);
  if (ehId(tr.por)) out.travado = { por: tr.por, desde: data(tr.desde, R.hoje()), em: num(tr.em) };
  if (t.parouEm && ehId(t.parouEm)) out.parouEm = t.parouEm;
  if (!out.caixa) out.proxima = null;
  return out;
}
function erro(e) {
  e = obj(e);
  if (!ehId(e.id) || !ehId(e.item)) return null;
  return {
    id: e.id, item: e.item, cap: ehId(e.cap) ? e.cap : null, dia: data(e.dia, R.hoje()), tipo: str(e.tipo, 20) || null,
    marcou: LETRA(e.marcou), certa: LETRA(e.certa), falta: str(e.falta, 400), anotacao: str(e.anotacao, 400),
    foiIsso: ['sim', 'outra'].includes(e.foiIsso) ? e.foiIsso : null,
    paragrafo: ehId(e.paragrafo) ? e.paragrafo : null, modelo: ehId(e.modelo) ? e.modelo : null,
    estado: e.estado === 'resolvido' ? 'resolvido' : 'aberto', resolvidoEm: data(e.resolvidoEm),
    refazerEm: data(e.refazerEm), refazerLinha: int(e.refazerLinha, 8, 11, 8),
    voltas: arr(e.voltas).slice(-30).map(v => (v = obj(v), { dia: data(v.dia, R.hoje()), item: ehId(v.item) ? v.item : null, res: v.res === 'ok' ? 'ok' : 'erro', marcou: LETRA(v.marcou), origem: str(v.origem, 20) })),
  };
}
function missao(m) {
  m = obj(m);
  if (!R.ehData(m.dia) || !ESTADOS_MISSAO.includes(m.estado) || !Array.isArray(m.passos)) return null;
  return JSON.parse(JSON.stringify(m)); // formato interno do próprio app; conferido na estrutura mínima
}

/** Preenche campos que faltam num estado da versão 2 (migração dentro da versão). */
export function migrar(s) {
  s = obj(s);
  if (s.app !== APP) throw new ErroCopia(MSG_COPIA_INVALIDA, 'campo app ausente ou diferente de "prumo"');
  const MIGRACOES = {
    // 1: s => { ...; s.versao = 2; return s; }   // não há versão 1 publicada do Prumo
  };
  let v = s.versao;
  while (v !== VERSAO && MIGRACOES[v]) { s = MIGRACOES[v](s); v = s.versao; }
  if (v !== VERSAO) throw new ErroCopia(MSG_COPIA_INVALIDA, `versão ${s.versao} não suportada`);
  return s;
}

/** Normaliza um estado (local ou de cópia): tipos conferidos, ids validados, tamanhos limitados. */
export function normalizar(s) {
  s = migrar(s);
  const v = vazio();
  if (s.perfil) v.perfil = perfil(s.perfil);
  v.conjuntosAtivos = [...new Set(arr(s.conjuntosAtivos).filter(ehId))];
  for (const [k, x] of Object.entries(obj(s.praticas)).slice(0, 100)) if (ehId(k)) {
    const pr = obj(obj(x).pre);
    v.praticas[k] = { desde: data(obj(x).desde, R.hoje()), pre: LETRA(pr.alt) ? { alt: pr.alt, dia: data(pr.dia, R.hoje()), revelado: data(pr.revelado) } : null };
  }
  const pz = obj(s.pausa);
  v.pausa = { desde: data(pz.desde), ate: data(pz.ate) };
  for (const k of Object.keys(obj(s.hojeNao)).filter(x => R.ehData(x)).sort().slice(-120)) v.hojeNao[k] = true;
  for (const [k, t] of Object.entries(obj(s.topicos)).slice(0, 200)) if (ehId(k)) v.topicos[k] = topico(t);
  for (const [k, x] of Object.entries(obj(s.pre)).slice(0, 500)) if (ehId(k) && LETRA(obj(x).alt)) v.pre[k] = { alt: x.alt, dia: data(x.dia, R.hoje()), cap: ehId(x.cap) ? x.cap : null, revelado: data(x.revelado) };
  for (const [k, d] of Object.entries(obj(s.vistos)).slice(0, 2000)) if (ehId(k) && R.ehData(d)) v.vistos[k] = d;
  v.missao = s.missao ? missao(s.missao) : null;
  for (const k of Object.keys(obj(s.dias)).slice(-2000)) if (R.ehData(k)) v.dias[k] = true;
  for (let [k, w] of Object.entries(obj(s.semanas))) if (R.ehData(k)) { w = obj(w); v.semanas[k] = { dias: int(w.dias, 0, 7, 0), total: int(w.total, 0, 7, 0), meta: w.meta == null ? null : int(w.meta, 0, 7, 0), cumprida: !!w.cumprida }; }
  v.notas = arr(s.notas).slice(-500).map(n => (n = obj(n), ehId(n.id) && ehId(n.paragrafo) ? { id: n.id, paragrafo: n.paragrafo, pagina: ehId(n.pagina) ? n.pagina : null, texto: str(n.texto, 600), dia: data(n.dia, R.hoje()), editadaEm: data(n.editadaEm) } : null)).filter(Boolean);
  v.erros = arr(s.erros).slice(-500).map(erro).filter(Boolean);
  for (let [k, c] of Object.entries(obj(s.cards)).slice(0, 400)) if (ehId(k)) {
    c = obj(c);
    v.cards[k] = { caixa: int(c.caixa, 1, 5, 1), proxima: data(c.proxima, R.hoje()), recebido: data(c.recebido, R.hoje()),
      hist: arr(c.hist).slice(-60).map(h => (h = obj(h), { dia: data(h.dia, R.hoje()), res: h.res === 'lembrei' ? 'lembrei' : 'ainda', repeticao: !!h.repeticao, de: int(h.de, 1, 5, 1), para: int(h.para, 1, 5, 1) })) };
  }
  { const it = obj(s.intencao); v.intencao = R.ehData(it.dia) && /^\d{2}:\d{2}$/.test(it.horario) ? { dia: it.dia, horario: it.horario, ancora: str(it.ancora, 80) || null } : null; }
  for (const k of Object.keys(obj(s.carimbos)).slice(-2000)) if (R.ehData(k)) v.carimbos[k] = true;
  for (const [k, d] of Object.entries(obj(s.baralho))) if (ehId(k) && R.ehData(d)) v.baralho[k] = d;
  for (const [k, d] of Object.entries(obj(s.marcos))) if (/^m\.[\w]+$/.test(k) && R.ehData(d)) v.marcos[k] = d;
  for (let [k, c] of Object.entries(obj(s.chefes))) if (ehId(k)) { c = obj(c); v.chefes[k] = { dia: data(c.dia, R.hoje()), tentativas: int(c.tentativas, 0, 99, 0), venceu: c.venceu !== false, tentativasFeitas: int(c.tentativasFeitas, 0, 999, 0) }; }
  v.selos = [...new Set(arr(s.selos).filter(x => typeof x === 'string' && /^[a-z]{2,4}$/.test(x)))];
  for (const [k, d] of Object.entries(obj(s.chefeAvisado))) if (ehId(k) && R.ehData(d)) v.chefeAvisado[k] = d;
  v.historico = arr(s.historico).slice(-400).map(h => (h = obj(h), R.ehData(h.dia) ? { dia: h.dia, regra: str(h.regra, 8), tipo: str(h.tipo, 20), passos: int(h.passos, 0, 99, 0), feitos: int(h.feitos, 0, 99, 0), parcial: !!h.parcial, fechada: !!h.fechada, viradaDeData: !!h.viradaDeData } : null)).filter(Boolean);
  v.refazer = s.refazer && typeof s.refazer === 'object' ? JSON.parse(JSON.stringify(s.refazer)) : null;
  const sq = obj(s.seq);
  v.seq = { erro: int(sq.erro, 0, 1e6, v.erros.length), nota: int(sq.nota, 0, 1e6, v.notas.length) };
  const c = obj(s.config), dm = obj(c.demo);
  v.config = {
    // o teto de nível só vale no estado de exemplo; perfil real (inclusive o salvo antes com 3) vai até o 5 de 5
    som: c.som === true, nivelMaximo: dm.ativo && dm.exemplo ? int(c.nivelMaximo, 1, 5, 5) : 5, ultimaCopia: data(c.ultimaCopia),
    simboloConstancia: 'risquinhos',   // único símbolo da constância (design system); 'chama' e 'regua' salvos antes viram risquinhos
    alarme: ['criado', 'agora-nao'].includes(c.alarme) ? c.alarme : null,
    demo: { ativo: !!dm.ativo, offset: int(dm.offset, -3650, 3650, 0), exemplo: !!dm.exemplo, guardado: typeof dm.guardado === 'string' ? dm.guardado : null },
  };
  return v;
}

/* ---------------- persistência (armazenamento injetável) ---------------- */
/** Armazenamento em memória, com o mesmo contrato do localStorage (para testes). */
export function memoria(inicial = {}) {
  const m = new Map(Object.entries(inicial));
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _m: m };
}
function storagePadrao() {
  try { return globalThis.localStorage || null; } catch (e) { return null; }
}
/** Lê o estado salvo. Devolve { st, problema }: st é null quando não há estado; problema descreve um estado ilegível. */
export function carregar(storage = storagePadrao()) {
  if (!storage) return { st: null, problema: 'armazenamento indisponível' };
  let bruto;
  try { bruto = storage.getItem(CHAVE); } catch (e) { return { st: null, problema: 'armazenamento indisponível' }; }
  if (!bruto) return { st: null, problema: null };
  try {
    const st = normalizar(JSON.parse(bruto));
    R.setOffset(st.config.demo.ativo ? st.config.demo.offset : 0);
    return { st, problema: null };
  } catch (e) { return { st: null, problema: 'estado salvo ilegível' }; }
}
/** Salva o estado. Nunca engole o erro: devolve { ok, erro }. */
export function salvar(st, storage = storagePadrao()) {
  if (!storage) return { ok: false, erro: 'armazenamento indisponível', mensagem: MSG_FALHA_SALVAR };
  try { storage.setItem(CHAVE, JSON.stringify(st)); return { ok: true }; }
  catch (e) { return { ok: false, erro: (e && e.name) || 'erro', mensagem: MSG_FALHA_SALVAR }; }
}
export function apagar(storage = storagePadrao()) {
  try { storage && storage.removeItem(CHAVE); } catch (e) { /* nada a apagar */ }
  R.setOffset(0);
  return vazio();
}

/* ---------------- cópia (JSON) e tentativas (CSV) ---------------- */
/** Cópia do progresso: { nome: "prumo-copia-AAAA-MM-DD.json", conteudo, tipo }. A tela só baixa o arquivo. */
export function copiaJSON(st, pack, d = R.hoje()) {
  const estado = JSON.parse(JSON.stringify(st));
  estado.config.demo.guardado = null;
  const envelope = {
    assinatura: ASSINATURA, app: APP, versao: VERSAO, geradoEm: new Date(R.agora()).toISOString(),
    pack: pack ? { id: pack.id, versao: pack.versao } : null, estado,
  };
  return { nome: `prumo-copia-${d}.json`, conteudo: JSON.stringify(envelope, null, 2), tipo: 'application/json' };
}
/** Lê uma cópia (texto do arquivo). Aceita o envelope ou um estado puro do Prumo. Recusa todo o resto. */
export function lerCopia(texto) {
  let o;
  try { o = typeof texto === 'string' ? JSON.parse(texto.replace(/^﻿/, '')) : texto; } catch (e) { throw new ErroCopia(MSG_COPIA_INVALIDA, 'não é JSON'); }
  o = obj(o);
  let est;
  if (o.assinatura !== undefined || o.estado !== undefined) {
    if (o.assinatura !== ASSINATURA || o.app !== APP || o.versao !== VERSAO) throw new ErroCopia(MSG_COPIA_INVALIDA, 'assinatura ou versão diferente');
    est = o.estado;
  } else est = o;
  est = obj(est);
  // o Capisco grava { versao: 1, perfil: { nome… }, ajustes, sessoes, roupas… } e não tem o campo app
  if (est.app !== APP || est.versao !== VERSAO) throw new ErroCopia(MSG_COPIA_INVALIDA, 'não é um estado do Prumo');
  const st = normalizar(est);
  if (!st.perfil) throw new ErroCopia(MSG_COPIA_INVALIDA, 'cópia sem plano');
  return st;
}

const NOME_TIPO = { checagem: 'checagem', enem: 'questão do Enem', equipe: 'questão da equipe', revisao: 'revisão', antecipada: 'revisão antecipada', dia: 'questão do dia', refazer: 'refazer', prova: 'prova do caderno', card: 'card' };
/** CSV de tentativas (e.4): dia;capítulo;item;tipo;resposta;resultado;primeiraVez — com os cards (Decisão 1). */
export function csvTentativas(st, pack) {
  const q = v => { const s = String(v == null ? '' : v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const nomeCap = id => { const c = pack && pack.capitulo(id); return c ? `Cap. ${c.n}` : id; };
  const linhas = [];
  for (const [cap, t] of Object.entries(st.topicos || {})) for (const x of t.tentativas || [])
    linhas.push({ em: x.em || 0, cols: [x.dia, nomeCap(cap), x.item, NOME_TIPO[x.tipo] || x.tipo || '', x.alt || '', x.res === 'ok' ? 'certa' : 'errada', x.primeiraVez === false ? 'não' : 'sim'] });
  for (const [id, c] of Object.entries(st.cards || {})) {
    const cap = pack ? pack.capDoCard(id) : '';
    (c.hist || []).forEach((h, i) => linhas.push({ em: R.parse(h.dia).getTime() + 1 + i, cols: [h.dia, nomeCap(cap), id, 'card', h.res === 'lembrei' ? 'lembrei' : 'ainda não', h.res === 'lembrei' ? 'lembrou' : 'ainda não', h.repeticao ? 'não' : (i === 0 ? 'sim' : 'não')] }));
  }
  linhas.sort((a, b) => a.em - b.em || (a.cols[0] < b.cols[0] ? -1 : 1));
  const cab = ['dia', 'capítulo', 'item', 'tipo', 'resposta', 'resultado', 'primeiraVez'];
  return { nome: 'prumo-tentativas.csv', conteudo: '﻿' + [cab, ...linhas.map(l => l.cols)].map(c => c.map(q).join(';')).join('\r\n') + '\r\n', tipo: 'text/csv;charset=utf-8' };
}
