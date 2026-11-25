/* =========================================================
   PRUMO · Prova do caderno (c.3i, d.11; núcleo, sem DOM)
   A Prova é a rodada "chefe" do motor: 10 pontos em acertos seguidos com
   acertos em min(4, nº de capítulos) capítulos diferentes, teto de 12.
   Itens: só questões do Enem nunca vistas (reservas primeiro) e variantes
   não vistas, todas no papel de aplicar; em rodízio de capítulos (o menos
   usado primeiro, nunca o mesmo da anterior). Não vencer não mexe em nada.
   Oferecida só antes de começar a missão do dia ou numa folga; nunca depois
   do "Pronto por hoje". Uma vez por dia.
   ========================================================= */
import * as R from './relogio.js';
import { P, chefeId } from './motor.js';

const visto = (st, id) => (st.vistos || {})[id] || null;

/** Itens candidatos de um capítulo, na ordem de uso: reservas inéditas, rodada inédita (pelo b),
 *  depois variantes inéditas das páginas (linhas 2 a 7), alternando as páginas. */
function poolDoCapitulo(st, pack, capId) {
  const c = pack.capitulo(capId);
  const enem = [...(c.reserva || []), ...[...(c.rodada || [])].filter(id => pack.questao(id)).sort((a, b) => pack.item(a).dif - pack.item(b).dif)]
    .filter(id => pack.questao(id) && !visto(st, id));
  const modelos = pack.modelosDoCap(capId), vars = [];
  for (let k = 2; k <= 7; k++) for (const m of modelos) if (k < (m.linhas || []).length && !visto(st, `${m.id}#${k}`)) vars.push(`${m.id}#${k}`);
  return [...new Set([...enem, ...vars])];
}
/** Variantes já vistas (as vistas há mais tempo primeiro), para quando o capítulo não tem item inédito. */
function reaproveitaveis(st, pack, capId) {
  const out = [];
  for (const m of pack.modelosDoCap(capId)) for (let k = 2; k <= 7; k++) if (k < (m.linhas || []).length) out.push(`${m.id}#${k}`);
  return out.sort((a, b) => ((visto(st, a) || '') < (visto(st, b) || '') ? -1 : 1));
}
/** Fila determinística da Prova (até o teto de 12). */
export function montarFilaProva(st, pack) {
  const caps = pack.capitulos.map(c => c.id);
  const pools = Object.fromEntries(caps.map(c => [c, poolDoCapitulo(st, pack, c)]));
  const reuso = Object.fromEntries(caps.map(c => [c, reaproveitaveis(st, pack, c)]));
  const uso = Object.fromEntries(caps.map(c => [c, 0]));
  const usados = new Set(), fila = [];
  let reaproveita = false, ultimo = null;
  for (let i = 0; i < P.chefe.teto; i++) {
    const ordem = caps.filter(c => c !== ultimo || caps.length === 1).sort((a, b) => uso[a] - uso[b] || pack.ordem(a) - pack.ordem(b));
    let escolhido = null;
    for (const c of ordem) {
      let id = pools[c].find(x => !usados.has(x));
      if (!id) { id = reuso[c].find(x => !usados.has(x)); if (id) reaproveita = true; }
      if (id) { escolhido = { id, cap: c }; break; }
    }
    if (!escolhido) break;
    usados.add(escolhido.id); uso[escolhido.cap]++; ultimo = escolhido.cap;
    fila.push(escolhido);
  }
  return { fila, reaproveita };
}
export function novaProva(st, pack, M, d) {
  const { fila, reaproveita } = montarFilaProva(st, pack);
  return { dia: d, fila, i: 0, rodada: M.novaRodada(st, chefeId(pack.id), 'chefe', P.chefe.teto), ultima: null, feedbackEm: null, resolucaoAberta: false, resultado: null, reaproveita, encerrada: false, abandonada: false };
}
export function regraProva(pack) {
  const n = Math.min(P.chefe.topicos, pack.capitulos.length);
  return n === 4 ? '4 acertos seguidos, um de cada capítulo' : `${n} acertos seguidos, um de cada capítulo`;
}
/** Oferecer a Prova hoje? Só com todos os capítulos em Firmando ou acima, Prova não vencida, antes de
 *  começar a missão do dia (ou numa folga) e se ainda não houve Prova hoje. */
export function provaOferecida(st, pack, M, m) {
  if (!m || M.chefeEstado(st, pack.id) !== 'disponivel') return false;
  if (m.fechada || m.iniciada || m.provaFeitaHoje) return false;
  return m.estado === 'hoje';
}
export function vmAberturaProva(pack, prova) {
  const n = Math.min(P.chefe.topicos, pack.capitulos.length);
  return {
    titulo: `Prova do caderno: ${pack.titulo}`,
    regra: regraProva(pack),
    tamanho: `São até ${P.chefe.teto} questões, cerca de ${P.chefe.teto * 3} minutos.`,
    aviso: 'Mais longa que a sua missão normal; um dia de folga é uma boa hora.',
    vidas: 'Você entra com 3 lápis. Cada erro quebra um; sem lápis, a prova acaba e volta no próximo dia.',
    trofeu: `O troféu registra que você firmou os ${n} capítulos.`,
    reaproveita: prova && prova.reaproveita ? 'Nesta demo, a prova reaproveita questões.' : null,
    acoes: [{ evento: 'COMECAR_PROVA', rotulo: 'Começar a prova' }, { evento: 'AGORA_NAO', rotulo: 'Agora não' }],
  };
}
export function casasProva(pack, prova) {
  const ok = new Set((prova.rodada && prova.rodada.okTops) || []);
  return pack.capitulos.map(c => ({ cap: c.id, rotulo: `Cap. ${c.n}`, cheia: ok.has(c.id) }));
}
export function vmResultadoProva(st, pack, prova, d = R.hoje()) {
  const r = prova.resultado;
  if (!r) return null;
  const n = Math.min(P.chefe.topicos, pack.capitulos.length);
  if (r.venceu) {
    return {
      venceu: true, titulo: 'Prova do caderno vencida',
      texto: `Você firmou os ${n} capítulos de ${pack.titulo}.`,
      trofeu: { nome: pack.titulo, dia: d, novo: !!r.trofeu }, selo: r.selo ? { materia: r.selo, nome: 'Matemática' } : null,
      tentativas: `${r.tentativas} tentativas`,
      estrelas: r.estrelas || 1, recorde: !!r.recorde,
      linhaEstrelas: `${r.estrelas || 1} de 3 carimbos: ${r.estrelas === 3 ? 'sem quebrar nenhum lápis' : `sobrou ${r.estrelas === 1 ? '1 lápis' : `${r.estrelas} lápis`}`}.`,
    };
  }
  return {
    venceu: false, titulo: 'Prova do caderno',
    texto: r.semVidas ? 'Os 3 lápis quebraram antes de fechar a prova. Nada do que você já firmou muda.' : `Você chegou ao limite de ${P.chefe.teto} questões sem fechar a prova. Nada do que você já firmou muda.`,
    revisar: (r.revisar || []).map(id => { const c = pack.capitulo(id); return { cap: id, texto: `Cap. ${c.n}: ${c.titulo}` }; }),
    linhaRevisar: (r.revisar || []).length ? `Os capítulos que mais pesaram: ${(r.revisar || []).map(id => `Cap. ${pack.capitulo(id).n}`).join(' e ')}.` : null,
    volta: 'A Prova continua liberada: ela volta a ser oferecida no próximo dia, antes da missão ou numa folga.',
  };
}
