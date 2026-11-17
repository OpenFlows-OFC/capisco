/* =========================================================
   PRUMO · Relógio e datas (núcleo, sem DOM)
   Toda leitura de "hoje" e de "agora" do app passa por aqui. O relógio é
   injetável: os testes e o estado de exemplo trocam a fonte por um relógio
   falso, e o modo demonstração soma um deslocamento em dias.
   Datas são strings 'AAAA-MM-DD' no fuso local, sem horário.
   ========================================================= */

const pad = n => String(n).padStart(2, '0');

/* ---------------- fonte do tempo (injetável) ---------------- */
let fonte = () => Date.now();          // milissegundos desde 1970
let deslocamento = 0;                  // dias somados (modo demonstração)

/** Troca a fonte do tempo. Aceita uma função que devolve ms, um número (ms fixo),
 *  uma string 'AAAA-MM-DD' (meio-dia local) ou 'AAAA-MM-DDTHH:MM'. Sem argumento, volta ao relógio real. */
export function definirFonte(f) {
  if (f == null) { fonte = () => Date.now(); return; }
  if (typeof f === 'function') { fonte = f; return; }
  const ms = typeof f === 'number' ? f : msDe(f);
  fonte = () => ms;
}
/** Relógio falso que se pode avançar: devolve { avancarMs, irPara, ms }. */
export function relogioFalso(inicio) {
  let ms = typeof inicio === 'number' ? inicio : msDe(inicio);
  fonte = () => ms;
  return {
    avancarMs(n) { ms += n; },
    irPara(s) { ms = typeof s === 'number' ? s : msDe(s); },
    get ms() { return ms; },
  };
}
/** A fonte atual (para quem troca o relógio e precisa devolvê-lo depois). */
export function obterFonte() { return fonte; }
export function setOffset(n) { deslocamento = Math.round(Number(n)) || 0; }
export function getOffset() { return deslocamento; }

/** Instante atual (ms), já com o deslocamento do modo demonstração. */
export function agora() { return fonte() + deslocamento * 864e5; }
/** Data local de hoje, 'AAAA-MM-DD'. */
export function hoje() { return iso(new Date(agora())); }

/* ---------------- aritmética de datas ---------------- */
export const ehData = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** 'AAAA-MM-DD' → Date ao meio-dia local (evita problemas de horário de verão). */
export const parse = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d, 12); };
export function msDe(s) {
  const t = String(s);
  if (ehData(t)) return parse(t).getTime();
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(t);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)).getTime();
  const n = Date.parse(t);
  if (Number.isFinite(n)) return n;
  throw new Error(`Data inválida: ${s}`);
}
export const addDias = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
/** Dias de a até b (b − a). */
export const diff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
/** 0 = domingo … 6 = sábado. */
export const diaDaSemana = s => parse(s).getDay();
/** Segunda-feira da semana de s (a semana do Prumo vai de segunda a domingo). */
export const segundaDe = s => addDias(s, -((diaDaSemana(s) + 6) % 7));
export const ehDataValida = s => ehData(s) && iso(parse(s)) === s;

/* ---------------- textos em português ---------------- */
export const SEMANA_CURTA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const SEMANA_LONGA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "20/11" */
export const fmtDiaMes = s => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
/** "sex 20/11" */
export const fmtCurta = s => `${SEMANA_CURTA[diaDaSemana(s)]} ${fmtDiaMes(s)}`;
/** "Segunda, 23/11" */
export const fmtDiaSemana = s => { const w = SEMANA_LONGA[diaDaSemana(s)]; return `${w[0].toUpperCase()}${w.slice(1)}, ${fmtDiaMes(s)}`; };
/** "quinta, 19 de novembro" */
export const fmtLonga = s => { const d = parse(s); return `${SEMANA_LONGA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
/** "QUINTA, 19 DE NOVEMBRO" (antiga linha de data de Hoje; o design system pede caixa normal: use fmtTitulo) */
export const fmtCabecalho = s => fmtLonga(s).toUpperCase();
/** "Quinta, 19 de novembro" (linha de data de Hoje) */
export const fmtTitulo = s => { const t = fmtLonga(s); return t.charAt(0).toUpperCase() + t.slice(1); };
/** "15/12/2026" */
export const fmtCompleta = s => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
/** Data relativa a uma referência: "hoje", "amanhã, qui 19/11", "ontem", ou "sex 20/11". */
export function fmtRelativa(s, ref = hoje()) {
  if (!ehData(s)) return '';
  const n = diff(ref, s);
  if (n === 0) return 'hoje';
  if (n === 1) return `amanhã, ${fmtCurta(s)}`;
  if (n === -1) return 'ontem';
  return fmtCurta(s);
}
/** Como fmtRelativa, mas sem repetir a data em "amanhã": "amanhã" / "sex 20/11". */
export function fmtQuando(s, ref = hoje()) {
  const n = diff(ref, s);
  return n === 0 ? 'hoje' : n === 1 ? 'amanhã' : n === -1 ? 'ontem' : fmtCurta(s);
}
/** Plural simples: plural(1, 'dia estudado', 'dias estudados') → "1 dia estudado". */
export const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
