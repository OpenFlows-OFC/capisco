/* =========================================================
   PRUMO · Cards de memorização (Decisão 1 do dono; núcleo, sem DOM)
   - O baralho recebe os cards de um capítulo quando a 1ª rodada dele termina
     (vencida ou no teto): o aluno já tentou e leu antes de memorizar (Pilar II).
   - "Mão de cards" é um passo da missão, no máximo 8 por dia: vencidos primeiro,
     caixa mais baixa primeiro, ordem determinística (nada sorteado).
   - Caixas de Leitner 1 a 5 com os intervalos do plano: "Lembrei" sobe uma caixa,
     "Ainda não" recua uma (mínimo 1) e o card volta UMA vez no fim da mesma mão.
   - Sem pontos, sem moeda. Teste das três perguntas: incerteza? não; dificulta parar?
     não (mão finita, fim mostrado); ganho de quem? do aluno.
   ========================================================= */
import * as R from './relogio.js';
import { intervalos, NIVEL } from './motor.js';

export const MAO_MAX = 8;
export const MIN_POR_CARD = 0.4; // estimativa da equipe: 5 cards ≈ 2 min

/** Entrega ao baralho os cards do capítulo (uma vez só). Devolve quantos entraram. */
export function receberCards(st, pack, capId, d) {
  st.cards = st.cards || {}; st.baralho = st.baralho || {};
  if (st.baralho[capId]) return 0;
  const iv = intervalos(st, d);
  let n = 0;
  for (const k of pack.cardsDe(capId)) {
    if (st.cards[k.id]) continue;
    st.cards[k.id] = { caixa: 1, proxima: R.addDias(d, iv[1]), recebido: d, hist: [] };
    n++;
  }
  st.baralho[capId] = d;
  return n;
}

/** Cards vencidos no dia d, na ordem da mão: atrasados antes dos de hoje, caixa mais baixa primeiro,
 *  depois a data, depois a ordem do caderno. No máximo 8. */
export function maoDoDia(st, pack, d) {
  const ordemCard = id => { const cap = pack.capDoCard(id); return pack.ordem(cap) * 100 + pack.cardsDe(cap).findIndex(k => k.id === id); };
  return Object.entries(st.cards || {})
    .filter(([id, c]) => pack.card(id) && c.proxima && c.proxima <= d)
    .sort(([a, x], [b, y]) => (x.proxima < d ? 0 : 1) - (y.proxima < d ? 0 : 1) || x.caixa - y.caixa || (x.proxima < y.proxima ? -1 : x.proxima > y.proxima ? 1 : 0) || ordemCard(a) - ordemCard(b))
    .slice(0, MAO_MAX)
    .map(([id]) => id);
}
export const minutosDaMao = n => (n ? Math.max(1, Math.round(n * MIN_POR_CARD)) : 0);

/** Resposta a um card. Na 1ª vez da mão, mexe na caixa; na volta do fim da mão, só registra. */
export function responderCard(st, cardId, res, d, { repeticao = false } = {}) {
  const c = st.cards[cardId];
  if (!c) throw new Error(`Card fora do baralho: ${cardId}`);
  const de = c.caixa;
  if (!repeticao) {
    c.caixa = res === 'lembrei' ? Math.min(5, de + 1) : Math.max(1, de - 1);
    c.proxima = R.addDias(d, intervalos(st, d)[c.caixa]);
  }
  c.hist.push({ dia: d, res, repeticao, de, para: c.caixa });
  return { id: cardId, de, para: c.caixa, proxima: c.proxima, repeticao };
}

/** Estado da mão dentro da missão: fila de cards, volta única dos "Ainda não". */
export function novaMao(ids) {
  return { fila: [...ids], i: 0, virado: false, respostas: {}, voltas: [], repetidos: {}, fim: false };
}
export function cardAtual(mao) { return mao && !mao.fim ? mao.fila[mao.i] : null; }
/** Avança a mão depois de uma resposta. "Ainda não" (na 1ª vez) agenda uma volta no fim. */
export function avancarMao(mao, cardId, res) {
  const repeticao = !!mao.repetidos[cardId] || mao.respostas[cardId] !== undefined;
  if (!repeticao) {
    mao.respostas[cardId] = res;
    if (res === 'ainda') { mao.fila.push(cardId); mao.repetidos[cardId] = true; }
  }
  mao.i++;
  mao.virado = false;
  if (mao.i >= mao.fila.length) mao.fim = true;
  return repeticao;
}
/** Resumo informativo do fim da mão, em frase: "Você lembrou 4 de 5 cards. O outro volta em sex 20/11." */
export function resumoMao(st, mao, d) {
  if (!mao) return null;
  const ids = Object.keys(mao.respostas);
  const lembrados = ids.filter(id => mao.respostas[id] === 'lembrei').length;
  const voltam = ids.filter(id => mao.respostas[id] === 'ainda');
  const datas = [...new Set(voltam.map(id => st.cards[id] && st.cards[id].proxima).filter(Boolean))].sort();
  const n = ids.length;
  let txt = `Você marcou 'lembrei' em ${lembrados} de ${n} ${n === 1 ? 'cartão' : 'cartões'} (não muda o nível).`;
  if (voltam.length) txt += ` ${voltam.length === 1 ? 'O outro volta' : `Os outros ${voltam.length} voltam`} em ${datas.map(x => R.fmtCurta(x)).join(' e ')}.`;
  return { total: n, lembrados, voltam: voltam.length, texto: txt };
}

/** Aba "Cards" do Caderno: baralho por capítulo (leitura livre; jogar, só na missão). */
export function cardsDoCaderno(st, pack, d) {
  return pack.capitulos.map(c => {
    const recebidoEm = (st.baralho || {})[c.id] || null;
    const cards = (c.cards || []).map(k => {
      const e = (st.cards || {})[k.id];
      const loc = pack.localDoCard(k);
      return {
        id: k.id, frente: k.frente, verso: k.verso, tipo: k.tipo || null,
        trecho: loc ? { rotulo: `Ver o parágrafo ${loc.n} da p. ${loc.paginaN}`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
        noBaralho: !!e,
        caixa: e ? e.caixa : null, caixaNome: e ? `revisão ${Math.max(1, e.caixa || 1)} de 5` : null, caixaRotulo: e ? `revisão ${Math.max(1, e.caixa || 1)} de 5` : null,
        proxima: e ? e.proxima : null,
        proximaTexto: e ? (e.proxima <= d ? (e.proxima < d ? `atrasado desde ${R.fmtCurta(e.proxima)}` : 'hoje') : R.fmtCurta(e.proxima)) : null,
      };
    });
    return {
      cap: c.id, n: c.n, titulo: `Cap. ${c.n}: ${c.titulo}`, recebidoEm,
      cards: recebidoEm ? cards : [],
      aviso: recebidoEm ? null : `Os cartões deste capítulo entram no seu baralho quando a primeira rodada dele terminar.`,
      quantos: (c.cards || []).length,
    };
  });
}
export const REGRA_CARDS = 'Cada capítulo traz de 6 a 8 cartões, fichas com uma pergunta na frente e a resposta no verso. Eles entram no seu baralho quando você termina as questões do capítulo pela primeira vez. Na missão aparecem no máximo 8 por dia, primeiro os atrasados e os que você mais esqueceu. Cada card tem 5 etapas de revisão: "Lembrei" passa para a etapa seguinte e o card demora mais para voltar; "Ainda não" volta uma etapa e o card aparece de novo no fim do mesmo dia. Não vale ponto.';
