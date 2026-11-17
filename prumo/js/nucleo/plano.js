/* =========================================================
   PRUMO · Plano e constância (núcleo, sem DOM)
   Dias de estudo, folga e pausa; "dias estudados"; semanas com a meta
   (resultado só depois que a semana termina, e gravado para nunca apagar);
   régua dos dias estudados (desenhada como risquinhos); agenda de 14 dias.
   A chama (Decisão 3) saiu com o design system: o único símbolo são os risquinhos.
   ========================================================= */
import * as R from './relogio.js';
import { intervalos, retaFinal, prova as provaDe, horizonte, NIVEL, rotuloNivel } from './motor.js';

export const CAPACIDADE = { 15: 2, 25: 3, 40: 5 };
export const capacidade = st => CAPACIDADE[(st.perfil || {}).minutos] || 3;
export { intervalos, retaFinal, horizonte };

/* ---------------- dias de estudo, folga e pausa ---------------- */
export const ehDiaDeEstudo = (st, d) => !!st.perfil && (st.perfil.dias || []).includes(R.diaDaSemana(d));
export function emPausa(st, d) {
  const p = st.pausa || {};
  return !!(p.ate && R.ehData(p.ate) && d <= p.ate && (!p.desde || d >= p.desde));
}
/** Próximo dia (depois de d) que é dia de estudo e não está em pausa. */
export function proximoDiaDeEstudo(st, d) {
  for (let i = 1; i <= 21; i++) { const x = R.addDias(d, i); if (ehDiaDeEstudo(st, x) && !emPausa(st, x)) return x; }
  return null;
}
/** Dias de estudo previstos, entre a e b (exclusivos), em que o aluno não estudou (sem contar pausa). */
export function diasPrevistosSemEstudo(st, a, b) {
  let n = 0;
  for (let x = R.addDias(a, 1); x < b; x = R.addDias(x, 1)) if (ehDiaDeEstudo(st, x) && !emPausa(st, x) && !st.dias[x]) n++;
  return n;
}
export const ultimoDiaEstudado = (st, antesDe) => Object.keys(st.dias || {}).filter(x => !antesDe || x < antesDe).sort().pop() || null;
export const NOMES_DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
/** "seg, ter, qua, qui" */
export const textoDias = dias => [1, 2, 3, 4, 5, 6, 0].filter(d => dias.includes(d)).map(d => NOMES_DIAS[d]).join(', ');
/** "segunda, terça, quarta e quinta" (frase, sem abreviar). */
export const NOMES_DIAS_LONGOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export function textoDiasLongo(dias) {
  const ns = [1, 2, 3, 4, 5, 6, 0].filter(d => (dias || []).includes(d)).map(d => NOMES_DIAS_LONGOS[d]);
  return ns.length > 1 ? `${ns.slice(0, -1).join(', ')} e ${ns[ns.length - 1]}` : (ns[0] || '');
}
/** "seg a qui" quando os dias são seguidos; senão, a lista. */
export function textoDiasCurto(dias) {
  const ord = [1, 2, 3, 4, 5, 6, 0].filter(d => dias.includes(d));
  const pos = ord.map(d => (d + 6) % 7);
  const seguidos = pos.every((p, i) => i === 0 || p === pos[i - 1] + 1);
  return seguidos && ord.length >= 3 ? `${NOMES_DIAS[ord[0]]} a ${NOMES_DIAS[ord[ord.length - 1]]}` : textoDias(dias);
}

/* ---------------- pausa (1 a 14 dias) ---------------- */
export function marcarPausa(st, n, d) {
  n = Math.max(1, Math.min(14, Math.round(n)));
  st.pausa = { desde: d, ate: R.addDias(d, n - 1) };
  return st.pausa;
}
/** Encerra a pausa: as revisões e os cards que venceriam durante ela andam os dias da pausa ("nada vence por isso"). */
export function encerrarPausa(st, d) {
  const p = st.pausa || {};
  if (!p.desde) { st.pausa = { desde: null, ate: null }; return 0; }
  const fim = p.ate && p.ate < d ? R.addDias(p.ate, 1) : d;
  const n = Math.max(0, R.diff(p.desde, fim));
  if (n > 0) {
    for (const t of Object.values(st.topicos || {})) if (t.caixa && t.proxima && t.proxima >= p.desde) t.proxima = R.addDias(t.proxima, n);
    for (const c of Object.values(st.cards || {})) if (c.proxima && c.proxima >= p.desde) c.proxima = R.addDias(c.proxima, n);
  }
  st.pausa = { desde: null, ate: null };
  return n;
}

/* ---------------- constância ---------------- */
export const diasEstudados = st => Object.keys(st.dias || {}).length;
export const rotuloDias = n => `${n} ${n === 1 ? 'dia estudado' : 'dias estudados'}`;

/** Grava o resultado de cada semana que já terminou (segunda a domingo). Gravado uma vez, nunca refeito:
 *  mudar a meta depois não apaga marca nenhuma. Estudar na folga não conta para a meta. */
export function fecharSemanas(st, d) {
  if (!st.perfil) return [];
  const dias = Object.keys(st.dias || {}).sort();
  if (!dias.length) return [];
  const novas = [];
  const atual = R.segundaDe(d);
  for (let seg = R.segundaDe(dias[0]); seg < atual; seg = R.addDias(seg, 7)) {
    if (st.semanas[seg]) continue;
    let total = 0, naMeta = 0;
    for (let i = 0; i < 7; i++) { const x = R.addDias(seg, i); if (st.dias[x]) { total++; if (ehDiaDeEstudo(st, x)) naMeta++; } }
    const meta = st.perfil.metaSemana || null;
    st.semanas[seg] = { dias: naMeta, total, meta, cumprida: !!meta && naMeta >= meta };
    novas.push(seg);
  }
  return novas;
}
export const semanasComMeta = st => Object.values(st.semanas || {}).filter(w => w.cumprida).length;

/** Régua de constância: um traço por dia estudado; traço longo a cada 5; latão no último dia
 *  estudado de cada semana com a meta (só depois que a semana termina). */
export function regua(st) {
  const dias = Object.keys(st.dias || {}).sort();
  const ultimoDaSemana = {};
  for (const x of dias) ultimoDaSemana[R.segundaDe(x)] = x;
  return dias.map((dia, i) => {
    const w = st.semanas[R.segundaDe(dia)];
    return { dia, n: i + 1, longo: (i + 1) % 5 === 0, latao: !!(w && w.cumprida && ultimoDaSemana[R.segundaDe(dia)] === dia) };
  });
}
/** Linha do Pronto por hoje no 1º dia estudado de uma semana nova (sem palavra negativa). */
export function linhaSemanaPassada(st, d) {
  const seg = R.segundaDe(d);
  const antes = Object.keys(st.dias || {}).filter(x => x >= seg && x < d);
  if (antes.length) return null;
  const w = st.semanas[R.addDias(seg, -7)];
  if (!w || !w.total) return null;
  return `Semana passada: ${rotuloDias(w.dias)}${w.cumprida ? ', com a meta cumprida' : ''}.`;
}
export function constancia(st, d) {
  const n = diasEstudados(st);
  const r = regua(st);
  const desde = R.addDias(d, -27);
  const comMeta = semanasComMeta(st);
  return {
    simbolo: 'risquinhos',
    diasEstudados: n, rotulo: rotuloDias(n),
    regua: r, miniRegua: r.filter(x => x.dia >= desde).slice(-28),
    semanasComMeta: comMeta, linhaMeta: `semanas com a meta: ${comMeta}`,
    meta: st.perfil ? st.perfil.metaSemana : null,
    vazio: n === 0 ? 'Cada dia em que você responde pelo menos uma checagem, questão ou revisão ganha um risquinho.' : null,
    regra: 'Dia estudado é o dia com pelo menos uma checagem, questão ou revisão respondida. Os risquinhos só crescem: faltar um dia não apaga nada, só mexe na agenda das revisões.',
  };
}

/* ---------------- prova e horizonte ---------------- */
export function resumoProva(st, d) {
  const p = st.perfil || {};
  const TIPO = { escola: 'Prova da escola (bimestral)', enem: 'Enem', provao: 'Provão Paulista', vestibular: 'Outro vestibular', outro: 'Outra prova', naosei: 'Ainda não sei' };
  const pv = provaDe(st, d);
  const nome = TIPO[p.provaTipo] || 'Prova';
  const temNome = p.provaTipo && p.provaTipo !== 'naosei';
  const faltamTxt = pv.dias === 0 ? 'A prova é hoje.' : pv.dias === 1 ? 'Falta 1 dia.' : `Faltam ${pv.dias} dias.`;
  let texto, cabecalho = null;
  if (!p.prova) texto = `${temNome ? `${nome}, ainda sem data` : 'Prova ainda sem data'}. Até você marcar, o Prumo planeja as revisões para os próximos 90 dias.`;
  else if (pv.passou) texto = `A prova de ${R.fmtDiaMes(p.prova)} passou. Até você marcar a próxima, o Prumo planeja as revisões para os próximos 90 dias.`;
  else {
    texto = `${nome} em ${R.fmtCompleta(p.prova)}. ${faltamTxt}`;
    // cabeçalho de prova: rótulo impresso, valor só com dígitos (o nome da prova vai na frase)
    cabecalho = [{ rotulo: 'Data da prova', valor: R.fmtCompleta(p.prova) }, { rotulo: pv.dias === 1 ? 'Falta' : 'Faltam', valor: String(pv.dias), unidade: pv.dias === 1 ? 'dia' : 'dias' }];
  }
  return { tipo: p.provaTipo || 'naosei', nome: temNome ? nome : null, data: p.prova || null, faltam: pv.dias, passou: pv.passou, texto, cabecalho, horizonte: horizonte(st, d), retaFinal: retaFinal(st, d) };
}
/** Tabela de intervalos por nível, com a regra escrita. */
export function tabelaIntervalos(st, d) {
  const iv = intervalos(st, d), H = horizonte(st, d);
  return {
    porNivel: [1, 2, 3, 4, 5].map(k => ({ nivel: k, nome: rotuloNivel(k), dias: iv[k] })),
    verARegra: `O Prumo conta ${H} dias${(st.perfil || {}).prova ? ' até a sua prova' : ' (você ainda não marcou a data da prova)'}. O maior intervalo entre revisões é 15% desse prazo (no mínimo 4 dias, no máximo 60); os outros vão dobrando aos poucos, cada um pelo menos 1 dia maior que o anterior. Hoje, os intervalos são de ${iv.slice(1).join(', ')} dias.`,
  };
}
