/* =========================================================
   PRUMO · Recomendador "o que estudar agora" (f.1; núcleo, sem DOM)
   IA baseada em regras: uma lista de decisão (a primeira regra que bate
   decide), sem aprendizado de máquina. Cada regra tem uma linha própria na
   trilha, com o texto da regra, e a missão vem com a frase de
   "Por que esta missão?". Tudo é determinístico: mesmo estado e mesma data
   dão a mesma missão. Desempates: mais atrasada, ordem do caderno, id.
   ========================================================= */
import * as R from './relogio.js';
import { rotuloNivel } from './motor.js';
import { capacidade, ehDiaDeEstudo, emPausa, diasPrevistosSemEstudo, ultimoDiaEstudado, textoDiasCurto } from './plano.js';
import { maoDoDia, minutosDaMao } from './cards.js';

export const MIN = { pre: 1, pagina: 2, checagem: 1, enem: 3, equipe: 3, compreender: 1, revisao: 2, dia: 2, extra: 2 };
const QTD_DIA = 3;

/* ---------------- itens: vistos, variantes, revisão ---------------- */
const visto = (st, id) => (st.vistos || {})[id] || null;
const vezes = (st, pack, id) => { const cap = pack.capDoItem(id); return ((st.topicos[cap] || {}).tentativas || []).filter(x => x.item === id).length; };

/** Próxima variante do modelo, nas linhas [de, ate], em ordem; sem nenhuma inédita, a vista há 7 dias ou mais
 *  (a mais antiga). Respeita os já reservados nesta missão. */
export function proximaVariante(st, pack, modeloId, d, { de = 2, ate = 7, reservados = new Set() } = {}) {
  const m = pack.modelo(modeloId);
  if (!m) return null;
  if (m.tipo === 'bloco') { de = 1; ate = 1; }
  const ult = Math.min(ate, (m.linhas || []).length - 1);
  for (let k = de; k <= ult; k++) { const id = `${m.id}#${k}`; if (!reservados.has(id) && !visto(st, id)) return id; }
  const velhas = [];
  for (let k = de; k <= ult; k++) { const id = `${m.id}#${k}`; const v = visto(st, id); if (!reservados.has(id) && v && R.diff(v, d) >= 7) velhas.push([v, k, id]); }
  velhas.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]));
  return velhas.length ? velhas[0][2] : null;
}
/** Modelo de página ligado a um modelo qualquer (o de bloco aponta para o da página dele). */
const modeloDePagina = (pack, modeloId) => { const m = pack.modelo(modeloId); return m ? (m.tipo === 'pagina' ? m : pack.modeloDaPagina(m.pagina)) : null; };

/** Ordem de escolha do item de revisão (b.3, com a 1ª revisão antes, como pedem b.5, d.4 e g.7):
 *  (1) na 1ª revisão, a pré-pergunta do núcleo da 2ª página ("antes x depois", resposta nunca mostrada);
 *  (2) cartão aberto do caderno de erros → variante seguinte do modelo ligado; (3) questão do Enem nunca vista;
 *  (4) variante seguinte dos modelos do capítulo. Nunca devolve vazio.
 *  Nota: b.3 lista o cartão antes da pré-pergunta, mas g.7 (roteiro) e d.4 exigem o "antes x depois" na
 *  1ª revisão mesmo depois de um erro na rodada; o cartão volta na revisão seguinte. */
export function itemDeRevisao(st, pack, capId, d, reservados = new Set()) {
  const cap = pack.capitulo(capId);
  // (1) 1ª revisão: pré-pergunta do núcleo da 2ª página (a resposta nunca foi mostrada)
  const primeira = !((st.topicos[capId] || {}).rodadas || []).some(r => r.tipo === 'revisao');
  if (primeira) {
    for (const p of [...(cap.paginas || [])].reverse()) {
      const id = `${p.modelo}#0`;
      if (st.pre[id] && !st.pre[id].revelado && !reservados.has(id)) return { id, papel: 'compreender', antesDepois: id, motivo: '1ª revisão: a pergunta de entrada volta' };
    }
  }
  // (2) cartão aberto
  const cartoes = (st.erros || []).filter(e => e.estado === 'aberto' && e.cap === capId && e.modelo).sort((a, b) => (a.dia < b.dia ? -1 : a.dia > b.dia ? 1 : 0));
  for (const e of cartoes) {
    const ms = [e.modelo, (modeloDePagina(pack, e.modelo) || {}).id].filter((x, i, a) => x && a.indexOf(x) === i);
    for (const mid of ms) { const id = proximaVariante(st, pack, mid, d, { reservados }); if (id) return { id, papel: 'compreender', erro: e.id, motivo: 'cartão do caderno de erros' }; }
  }
  // (3) questão do Enem do capítulo nunca vista (rodada e reserva, pelo b)
  const enem = pack.questoesDoCap(capId).filter(id => !visto(st, id) && !reservados.has(id)).sort((a, b) => pack.item(a).dif - pack.item(b).dif);
  if (enem.length) return { id: enem[0], papel: 'aplicar', motivo: 'questão do Enem inédita' };
  // (4) variante seguinte dos modelos do capítulo
  const vs = pack.modelosDoCap(capId).map((m, i) => { const id = proximaVariante(st, pack, m.id, d, { reservados }); return id ? { id, k: +id.split('#')[1], i } : null; }).filter(Boolean)
    .sort((a, b) => (visto(st, a.id) ? 1 : 0) - (visto(st, b.id) ? 1 : 0) || a.k - b.k || a.i - b.i);
  if (vs.length) return { id: vs[0].id, papel: 'compreender', motivo: 'variante da equipe' };
  // sem nada inédito nem velho de 7 dias: o item visto há mais tempo (regra de projeto para não ficar sem revisão)
  const todos = [...pack.questoesDoCap(capId), ...pack.modelosDoCap(capId).flatMap(m => [1, 2, 3, 4, 5, 6, 7].filter(k => k < (m.linhas || []).length).map(k => `${m.id}#${k}`))]
    .filter(id => !reservados.has(id)).sort((a, b) => ((visto(st, a) || '') < (visto(st, b) || '') ? -1 : 1));
  return { id: todos[0], papel: pack.questao(todos[0]) ? 'aplicar' : 'compreender', motivo: 'item visto há mais tempo' };
}

/* ---------------- passos ---------------- */
/** Passos de leitura de uma página: pré-pergunta do núcleo, trechos e pré-perguntas de bloco, checagem. */
function passosDaPagina(pack, capId, pg, indicePagina, { preId, chkId, r }) {
  const out = [{ t: 'pre', id: preId, cap: capId, pagina: pg.id, bloco: pg.nucleo, alvo: 'nucleo', r }];
  let seg = [];
  for (const b of pg.blocos || []) {
    if (b.id !== pg.nucleo && b.prePergunta) {
      if (seg.length) out.push({ t: 'leitura', cap: capId, pagina: pg.id, blocos: seg, r });
      out.push({ t: 'pre', id: `${b.prePergunta}#0`, cap: capId, pagina: pg.id, bloco: b.id, alvo: 'bloco', r });
      seg = [];
    }
    seg.push(b.id);
  }
  if (seg.length) out.push({ t: 'leitura', cap: capId, pagina: pg.id, blocos: seg, r, fimDaPagina: true });
  out.push({ t: 'checagem', id: chkId, cap: capId, pagina: pg.id, papel: indicePagina === 0 ? 'lembrar' : 'compreender', r });
  return out;
}
const nAplicar = st => ((st.perfil || {}).minutos === 15 ? 2 : 3);
function aplicarDaRodada(st, pack, capId, d, reservados, { inedito = false } = {}) {
  const c = pack.capitulo(capId), n = nAplicar(st), out = [];
  for (const id of c.rodada || []) {
    if (out.length >= n) break;
    if (inedito && visto(st, id)) continue;
    if (!pack.existe(id) || reservados.has(id)) continue;
    out.push(id); reservados.add(id);
  }
  // R5b/R7 sem questão do Enem inédita: variantes da equipe no papel de aplicar (peso 4)
  let i = 0;
  const modelos = pack.modelosDoCap(capId);
  while (out.length < n && i < 20) {
    const m = modelos[i % modelos.length];
    const id = proximaVariante(st, pack, m.id, d, { reservados });
    if (id) { out.push(id); reservados.add(id); }
    i++;
  }
  return out.map(id => ({ t: 'questao', id, cap: capId, papel: 'aplicar', origem: pack.questao(id) ? 'enem' : 'equipe' }));
}
/** Marca os passos de uma rodada com a chave dela e o tipo de rodada do motor ('novo', 'pratica' ou 'extra'). */
function rotularRodada(passos, r, tipo) { return passos.map(p => Object.assign(p, { r, rodadaTipo: tipo })); }
/** R8 · capítulo novo (b.3). */
export function passosNovo(st, pack, capId, d, reservados = new Set()) {
  const c = pack.capitulo(capId), r = `r:${capId}`;
  const ps = [];
  (c.paginas || []).forEach((pg, i) => {
    const preId = `${pg.modelo}#0`, chkId = `${pg.modelo}#1`;
    reservados.add(preId); reservados.add(chkId);
    ps.push(...passosDaPagina(pack, capId, pg, i, { preId, chkId, r }));
  });
  ps.push(...aplicarDaRodada(st, pack, capId, d, reservados));
  return rotularRodada(ps, r, 'novo');
}
/** Páginas e aplicar para R5b e R7 (pré-pergunta = variante não vista; checagem = variante seguinte). */
function passosRetomada(st, pack, capId, d, paginasIdx, reservados) {
  const c = pack.capitulo(capId), r = `r:${capId}`, ps = [];
  for (const i of paginasIdx) {
    const pg = c.paginas[i];
    const preId = proximaVariante(st, pack, pg.modelo, d, { reservados }) || `${pg.modelo}#0`; reservados.add(preId);
    const chkId = proximaVariante(st, pack, pg.modelo, d, { reservados }) || `${pg.modelo}#1`; reservados.add(chkId);
    ps.push(...passosDaPagina(pack, capId, pg, i, { preId, chkId, r }));
  }
  ps.push(...aplicarDaRodada(st, pack, capId, d, reservados, { inedito: true }));
  return rotularRodada(ps, r, 'pratica');
}
/** Página do erro mais repetido do capítulo e as páginas com erro. */
export function paginasComErro(st, pack, capId) {
  const c = pack.capitulo(capId), cont = {};
  for (const x of (st.topicos[capId] || {}).tentativas || []) {
    if (x.res !== 'erro' || !pack.existe(x.item)) continue;
    const it = pack.item(x.item), alt = it.alternativas.find(a => a.letra === x.alt);
    const par = (alt && alt.paragrafo) || null;
    const loc = par ? pack.local(par) : null;
    const pag = loc && loc.cap === capId ? loc.pagina : (it.pagina && pack.capDaPagina(it.pagina) === capId ? it.pagina : null);
    if (pag) cont[pag] = (cont[pag] || 0) + 1;
  }
  const idx = id => c.paginas.findIndex(p => p.id === id);
  const ord = Object.keys(cont).sort((a, b) => cont[b] - cont[a] || idx(a) - idx(b));
  return { principal: ord.length ? idx(ord[0]) : 0, comErro: ord.map(idx) };
}
export function passosR5b(st, pack, capId, d, reservados = new Set()) {
  const { principal, comErro } = paginasComErro(st, pack, capId);
  const outras = comErro.filter(i => i !== principal);
  return passosRetomada(st, pack, capId, d, [principal, ...outras], reservados);
}
export function paginaOndeParou(st, pack, capId) {
  const c = pack.capitulo(capId), t = st.topicos[capId] || {};
  if (t.parouEm) { const i = c.paginas.findIndex(p => p.id === t.parouEm); if (i >= 0) return i; }
  const ult = [...(t.tentativas || [])].reverse().find(x => pack.existe(x.item));
  if (ult) { const it = pack.item(ult.item); const i = c.paginas.findIndex(p => p.id === it.pagina); if (i >= 0) return i; }
  return 0;
}
export function passosR7(st, pack, capId, d, reservados = new Set()) {
  const c = pack.capitulo(capId), i0 = paginaOndeParou(st, pack, capId);
  const idx = []; for (let i = i0; i < c.paginas.length; i++) idx.push(i);
  return passosRetomada(st, pack, capId, d, idx, reservados);
}
/** Passo de revisão (1 item, vale a primeira resposta). */
export function passoRevisao(st, pack, capId, d, reservados) {
  const it = itemDeRevisao(st, pack, capId, d, reservados);
  reservados.add(it.id);
  const t = st.topicos[capId];
  return { t: 'revisao', id: it.id, cap: capId, papel: it.papel, origem: pack.questao(it.id) ? 'enem' : 'equipe', erro: it.erro || null, antesDepois: it.antesDepois || null, atrasada: !!(t && t.proxima && t.proxima < d), motivo: it.motivo };
}
/** Revisão antecipada do capítulo mais fraco (treino 'extra' do motor: não sobe nível). */
export function passosAntecipada(st, pack, capId, d, reservados = new Set()) {
  const n = nAplicar(st), r = `x:${capId}`, out = [];
  // a pergunta de entrada fica para a 1ª revisão de verdade ("antes x depois"); não entra no treino
  for (const p of pack.capitulo(capId).paginas || []) reservados.add(`${p.modelo}#0`);
  for (let i = 0; i < n; i++) {
    const it = itemDeRevisao(st, pack, capId, d, reservados);
    if (!it || reservados.has(it.id)) break;
    reservados.add(it.id);
    out.push({ t: 'questao', id: it.id, cap: capId, papel: it.antesDepois ? 'compreender' : it.papel, origem: pack.questao(it.id) ? 'enem' : 'equipe', antecipada: true, erro: it.erro || null });
  }
  return rotularRodada(out, r, 'extra');
}
/** Questão do dia (d.17): de 1 a 3 itens dos capítulos já abertos; o menos visto primeiro, depois o menor b;
 *  variantes não vistas antes de questões do Enem vistas há 7 dias ou mais. */
export function itensQuestaoDoDia(st, pack, M, d, reservados = new Set()) {
  const abertos = M.topicosAtivos(st).filter(id => (st.topicos[id] || {}).caixa >= 1);
  const cand = [];
  for (const cap of abertos) {
    for (const m of pack.modelosDoCap(cap)) { const id = proximaVariante(st, pack, m.id, d, { reservados }); if (id) cand.push({ id, cap, n: vezes(st, pack, id), b: 0, enem: 0 }); }
    for (const id of pack.capitulo(cap).rodada || []) {
      if (!pack.questao(id) || reservados.has(id)) continue;
      const v = visto(st, id);   // questão do Enem inédita fica para revisões e Prova; aqui só as vistas há 7 dias ou mais
      if (v && R.diff(v, d) >= 7) cand.push({ id, cap, n: vezes(st, pack, id), b: pack.item(id).dif, enem: 1 });
    }
  }
  cand.sort((a, b) => a.n - b.n || a.enem - b.enem || a.b - b.b || pack.ordem(a.cap) - pack.ordem(b.cap) || (a.id < b.id ? -1 : 1));
  const out = [];
  for (const c of cand) { if (out.length >= QTD_DIA) break; if (!out.some(o => o.id === c.id)) out.push(c); }
  return out.map(c => ({ t: 'dia', id: c.id, cap: c.cap, papel: pack.questao(c.id) ? 'aplicar' : 'compreender', origem: pack.questao(c.id) ? 'enem' : 'equipe' }));
}

/* ---------------- regra da fila e tempo ---------------- */
/** Frase da regra de vitória calculada da fila real (b.3). */
export function regraDaFila(passos, cap, titulo) {
  const ap = passos.filter(p => p.papel === 'aplicar' && p.t === 'questao' && (!cap || p.cap === cap));
  const todosEnem = ap.length > 0 && ap.every(p => p.origem === 'enem');
  const antecipada = passos.some(p => p.antecipada && (!cap || p.cap === cap));
  const onde = todosEnem ? 'numa questão do Enem' : 'numa questão de aplicar (do Enem ou da equipe)';
  const ondeGanho = todosEnem ? 'numa questão do Enem' : 'numa questão de aplicar (do Enem ou da equipe)';
  if (antecipada) {
    return { tipo: 'antecipada', todosEnem, frase: '2 acertos seguidos, um deles numa questão de aplicar, firmam a revisão antecipada.', insercao: 'Revisão antecipada: não sobe nível. Se a sequência não fechar, a revisão passa para amanhã.', ganho: 'Revisão antecipada: o nível só sobe na revisão do dia certo.', falta: todosEnem ? 'Falta acertar uma questão do Enem' : 'Falta acertar uma questão de aplicar' };
  }
  return {
    tipo: 'capitulo', todosEnem,
    frase: `2 acertos seguidos, um deles ${onde}`,
    insercao: todosEnem ? 'Errou uma questão do Enem? A próxima é uma questão da equipe sobre o mesmo trecho.' : 'Errou uma questão de aplicar? A próxima é uma questão da equipe sobre o mesmo trecho.',
    ganho: `Acerte duas seguidas, uma delas ${ondeGanho}: ${titulo || 'o capítulo'} entra no nível 1 de 5.`,
    falta: 'Para fechar: 2 certas seguidas, falta 1',
  };
}
export function estimarMinutos(passos) {
  let m = 0;
  const paginas = new Set();
  for (const p of passos) {
    if (p.t === 'pre') m += MIN.pre;
    else if (p.t === 'leitura') paginas.add(p.pagina);
    else if (p.t === 'checagem') m += MIN.checagem;
    else if (p.t === 'questao') m += p.antecipada ? MIN.extra : p.papel === 'aplicar' ? MIN.enem : MIN.compreender;
    else if (p.t === 'revisao') m += MIN.revisao;
    else if (p.t === 'dia') m += MIN.dia;
    else if (p.t === 'cards') m += minutosDaMao(p.ids.length);
  }
  return m + MIN.pagina * paginas.size;
}

/* ---------------- a árvore de decisão (f.1) ---------------- */
const capN = (pack, id) => (pack.capitulo(id) || {}).n;
function vencidas(st, M, d) {
  return M.topicosAtivos(st).filter(id => { const t = st.topicos[id]; return t && t.caixa >= 1 && t.proxima && t.proxima <= d; })
    .sort((a, b) => (st.topicos[a].proxima < st.topicos[b].proxima ? -1 : st.topicos[a].proxima > st.topicos[b].proxima ? 1 : 0) || M.topico(a).ordem - M.topico(b).ordem || (a < b ? -1 : 1));
}
function capituloDeMenorNivel(st, M) {
  return M.topicosAtivos(st).filter(id => (st.topicos[id] || {}).caixa >= 1)
    .sort((a, b) => st.topicos[a].caixa - st.topicos[b].caixa || M.topico(a).ordem - M.topico(b).ordem || (a < b ? -1 : 1))[0] || null;
}
function tetoSemVencer(st, M, d) {
  return M.topicosAtivos(st).filter(id => {
    const t = st.topicos[id];
    if (!t || t.caixa) return false;
    const ult = [...(t.rodadas || [])].reverse().find(x => x.tipo !== 'extra' && x.tipo !== 'revisao');
    return ult && !ult.venceu && M.estado(st, id, d) !== 'bloqueado';
  }).sort((a, b) => M.topico(a).ordem - M.topico(b).ordem)[0] || null;
}
function prereqFraco(st, M, capId) {
  return (M.topico(capId).prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < 2)
    .sort((a, b) => ((st.topicos[a] || {}).caixa || 0) - ((st.topicos[b] || {}).caixa || 0) || M.topico(a).ordem - M.topico(b).ordem)[0] || null;
}
const comecadoNaoVencido = (st, M, d) => M.topicosAtivos(st).filter(id => M.estado(st, id, d) === 'pratica').sort((a, b) => M.topico(a).ordem - M.topico(b).ordem)[0] || null;
const proximoLiberado = (st, M, d) => M.topicosAtivos(st).filter(id => M.estado(st, id, d) === 'novo').sort((a, b) => M.topico(a).ordem - M.topico(b).ordem)[0] || null;

/**
 * Monta a missão do dia d. Pura: não muda o estado.
 * Devolve { dia, regra, tipo, trilha:[{id, ok, txt}], frase, passos, cap, ... }.
 */
export function montarMissao(st, pack, M, d, { estudarMesmoAssim = false } = {}) {
  const trilha = [];
  const r = (id, ok, txt) => (trilha.push({ id, ok: !!ok, txt }), !!ok);
  const venc = vencidas(st, M, d);
  const cap = capacidade(st), minutos = (st.perfil || {}).minutos || 25;
  const pv = M.prova(st, d), H = M.horizonte(st, d), reta = M.retaFinal(st, d), faltam = pv.passou ? null : pv.dias;
  const aberto = M.topicosAtivos(st).some(id => (st.topicos[id] || {}).caixa >= 1);
  const reservados = new Set();
  const ultimo = ultimoDiaEstudado(st, d);
  const ausencia = ultimo ? diasPrevistosSemEstudo(st, ultimo, d) : 0;
  const base = { dia: d, trilha, venc: venc.slice(), capacidade: cap, boasVindas: ausencia >= 3, provaPassou: pv.passou, folga: !ehDiaDeEstudo(st, d), estudarMesmoAssim };
  const mao = maoDoDia(st, pack, d);
  const comCards = passos => (mao.length ? [...passos, { t: 'cards', ids: mao }] : passos);
  const nomeCap = id => `Cap. ${capN(pack, id)}`;
  const fim = (o) => { const out = Object.assign(base, o); out.passos = out.passos || []; out.minutos = estimarMinutos(out.passos); return out; };

  const soRevisoes = (lista, regra, tipo, frase) => {
    const orc = Math.max(1, Math.floor(minutos / 2));
    const ps = lista.slice(0, orc).map(id => passoRevisao(st, pack, id, d, reservados));
    return fim({ regra, tipo, frase, passos: comCards(ps) });
  };
  const questaoDoDia = (regra, frase) => {
    const ps = itensQuestaoDoDia(st, pack, M, d, reservados);
    return fim({ regra, tipo: 'questaoDoDia', frase, passos: comCards(ps) });
  };
  const revisoesOuManter = (regra, prefixo) => {
    if (venc.length) return soRevisoes(venc, regra, 'revisoes', `${prefixo} Hoje: ${venc.length === 1 ? 'a revisão vencida' : `as ${venc.length} revisões vencidas`}.`);
    const fraco = capituloDeMenorNivel(st, M);
    if (fraco) {
      const ps = passosAntecipada(st, pack, fraco, d, reservados);
      if (ps.length) return fim({ regra, tipo: 'antecipada', cap: fraco, frase: `${prefixo} Hoje: revisão antecipada do ${nomeCap(fraco)}, o mais fraco.`, passos: comCards(ps) });
    }
    return questaoDoDia(regra, `${prefixo} Hoje: Questão do dia.`);
  };
  const comRevisoes = (regra, tipo, capId, passosCap, frase) => {
    const orc = minutos - estimarMinutos(passosCap);
    const cabem = Math.max(0, Math.floor(orc / MIN.revisao));
    const revs = venc.filter(id => id !== capId).slice(0, cabem).map(id => passoRevisao(st, pack, id, d, reservados));
    const atrasadas = revs.filter(p => p.atrasada), doDia = revs.filter(p => !p.atrasada);
    const fora = venc.filter(id => id !== capId).length - revs.length;
    const passos = comCards([...atrasadas, ...passosCap, ...doDia]);
    return fim({ regra, tipo, cap: capId, frase, passos, revisoesForaDoOrcamento: fora });
  };
  const revTxt = () => (venc.length === 0 ? 'hoje não tem revisão vencida' : venc.length === 1 ? 'hoje só tem 1 revisão' : `hoje tem ${venc.length} revisões`);

  // R0 · a prova já passou (só com algum capítulo aberto: sem capítulo aberto, segue para o capítulo novo)
  const provaTxt = st.perfil && st.perfil.prova ? R.fmtDiaMes(st.perfil.prova) : '';
  if (r('R0', pv.passou && aberto, pv.passou ? (aberto ? `A prova de ${provaTxt} já passou; enquanto não houver nova data, horizonte de 90 dias` : `A prova de ${provaTxt} já passou, mas nenhum capítulo está aberto: segue para o capítulo novo`) : 'A prova ainda não passou'))
    return revisoesOuManter('R0', `A prova de ${provaTxt} passou. Enquanto você não marca outra data, o Prumo usa 90 dias.`);
  // R1 · pausa
  if (r('R1', emPausa(st, d), emPausa(st, d) ? `Pausa ativa até ${R.fmtDiaMes(st.pausa.ate)}` : 'Sem pausa'))
    return fim({ regra: 'R1', tipo: 'pausa', frase: `Você marcou pausa até ${R.fmtCurta(st.pausa.ate)}. Nada vence por isso.` });
  // R2 · folga
  const folga = !ehDiaDeEstudo(st, d);
  if (r('R2', folga && !estudarMesmoAssim, folga ? (estudarMesmoAssim ? 'Hoje é folga, mas você escolheu estudar mesmo assim' : `Hoje é folga (seus dias: ${textoDiasCurto(st.perfil.dias)})`) : 'Hoje é dia de estudo'))
    return fim({ regra: 'R2', tipo: 'folga', frase: 'Hoje é folga no seu plano. Nada vence por isso.' });
  // R3 · modo retorno
  if (r('R3', venc.length >= cap, `${venc.length} ${venc.length === 1 ? 'revisão vencida' : 'revisões vencidas'}; capacidade ${cap}`))
    return Object.assign(soRevisoes(venc, 'R3', 'retorno', `Você tem ${venc.length} revisões vencidas, e a capacidade de hoje é ${cap}: hoje é dia de pôr as revisões em dia, as mais atrasadas primeiro.`), { retorno: true });
  // R4 · reta final (só com algum capítulo aberto)
  const naReta = aberto && faltam !== null && faltam <= reta;
  if (r('R4', naReta, !aberto ? 'Nenhum capítulo aberto: reta final não se aplica' : faltam === null ? `Sem data de prova; reta final é de ${reta} dias` : `Faltam ${faltam} dias; reta final é de ${reta}`))
    return Object.assign(revisoesOuManter('R4', `Reta final: ${faltam === 0 ? 'a prova é hoje' : faltam === 1 ? 'falta 1 dia' : `faltam ${faltam} dias`}; nada novo entra.`), { reta: { faltam, dias: reta } });
  // R5 · capítulo que bateu no teto na última rodada
  const teto = tetoSemVencer(st, M, d), pre = teto && prereqFraco(st, M, teto);
  if (r('R5a', !!pre, pre ? `${nomeCap(teto)} bateu no teto; base: ${nomeCap(pre)}, abaixo do nível 2 de 5` : teto ? `${nomeCap(teto)} bateu no teto; pré-requisitos já no nível 2 de 5 ou acima` : 'Nenhum capítulo bateu no teto')) {
    const ps = venc.includes(pre) ? [passoRevisao(st, pack, pre, d, reservados)]
      : passosAntecipada(st, pack, pre, d, reservados);
    const outras = venc.filter(id => id !== pre);
    const revs = outras.slice(0, Math.max(0, Math.floor((minutos - estimarMinutos(ps)) / MIN.revisao))).map(id => passoRevisao(st, pack, id, d, reservados));
    return fim({ regra: 'R5a', tipo: 'prereq', cap: pre, capTravado: teto, frase: `O ${nomeCap(teto)} bateu no teto na última rodada, e a base dele, o ${nomeCap(pre)}, ainda está ${(st.topicos[pre] || {}).caixa ? 'no ' + rotuloNivel(st.topicos[pre].caixa) : 'sem nível'}. Hoje: revisão do ${nomeCap(pre)}.`, passos: comCards([...ps, ...revs]) });
  }
  if (r('R5b', !!teto, teto ? `${nomeCap(teto)} bateu no teto na última rodada` : 'Nenhum capítulo bateu no teto')) {
    const ps = passosR5b(st, pack, teto, d, reservados);
    const pg = pack.pagina(ps[0].pagina);
    return comRevisoes('R5b', 'pratica', teto, ps, `O ${nomeCap(teto)} bateu no teto na última rodada. Hoje ele volta pela p. ${pg.n}, onde estava o erro mais repetido, e ${revTxt()}.`);
  }
  // R7 · capítulo começado e não vencido
  const comecado = comecadoNaoVencido(st, M, d);
  if (r('R7', !!comecado, comecado ? `${nomeCap(comecado)} começado e não vencido` : 'Nenhum começado')) {
    const ps = passosR7(st, pack, comecado, d, reservados);
    const pg = pack.pagina(ps[0].pagina);
    return comRevisoes('R7', 'pratica', comecado, ps, `Você começou o ${nomeCap(comecado)} e ainda não venceu a rodada. Hoje ele continua pela p. ${pg.n}, e ${revTxt()}.`);
  }
  // R8 · capítulo novo liberado
  const novo = proximoLiberado(st, M, d);
  if (r('R8', !!novo, novo ? `${nomeCap(novo)} é o próximo liberado` : 'Nenhum capítulo novo liberado')) {
    const ps = passosNovo(st, pack, novo, d, reservados);
    return comRevisoes('R8', 'novo', novo, ps, `Você ainda não abriu o ${nomeCap(novo)}, e ${revTxt()}.`);
  }
  // R9 · nada novo nem em curso
  r('R9', true, venc.length ? 'Só revisões' : 'Nada vence: Questão do dia');
  if (venc.length) return soRevisoes(venc, 'R9', 'revisoes', `Nada novo nem em curso: hoje ${venc.length === 1 ? 'é a revisão vencida' : `são as ${venc.length} revisões vencidas`}.`);
  return questaoDoDia('R9', 'Nada vence hoje: a missão é a Questão do dia, com questões dos capítulos que você já abriu.');
}

/** Textos de "ver a regra": a trilha da árvore, as revisões, a lembrança estimada e as questões. */
export function verARegra(st, pack, M, missao, d) {
  const linhas = (missao.trilha || []).map(x => `${x.id} ${x.ok ? 'sim' : 'não'}: ${x.txt}`);
  const revs = (missao.passos || []).filter(p => p.t === 'revisao').map(p => {
    const t = st.topicos[p.cap] || {};
    const quando = t.proxima === d ? 'vence hoje' : t.proxima < d ? `atrasada desde ${R.fmtCurta(t.proxima)}` : `vence ${R.fmtCurta(t.proxima)}`;
    return `Revisão: Cap. ${capN(pack, p.cap)}, ${quando} (${p.motivo})`;
  });
  const lembranca = M.topicosAtivos(st).filter(id => (st.topicos[id] || {}).caixa >= 1).map(id => `Cap. ${capN(pack, id)}: lembrança estimada ${M.recuperabilidade(st, id, d)}% (estimativa do modelo, não é medida: R = 0,85^(t/I))`);
  const questoes = (missao.passos || []).filter(p => p.id && pack.questao(p.id)).map(p => { const q = pack.questao(p.id); return `${q.ano} Q${q.numero}`; });
  return {
    linhas, revisoes: revs, lembranca, questoes: questoes.length ? `Questões do Enem: ${questoes.join(', ')}` : null,
    texto: [...linhas, ...revs].join(' · '),
    oQueE: 'O Prumo escolhe a missão por regras fixas: uma lista de decisão em que a primeira regra que bate decide. Sem aprendizado de máquina e sem sorteio: o mesmo estado e a mesma data dão a mesma missão.',
  };
}
