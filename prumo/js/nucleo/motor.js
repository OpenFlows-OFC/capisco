/* =========================================================
   PRUMO · Motor de regras (núcleo, sem DOM)
   Herdado do motor do Capisco (jogo/core/motor.js, v1.2), com as mudanças
   que a especificação v3 manda (e.5):
   - conjunto = caderno, tópico = capítulo; as perguntas de entrada ficam fora;
   - a banda de acerto (60%–85%), nivelAlvo, escolherItem e regulacao saem da rodada;
   - minutosHoje() e o campo `sessoes` saem (o app não mede minutos);
   - rodada.teto (com a inserção do Pilar III) tem prioridade sobre tetoDe();
   - fecharRevisao(): a revisão é 1 item e vale a primeira resposta;
   - "roupa" vira "selo", "Chefão" vira "Prova do caderno";
   - só múltipla escolha: avaliar() devolve 'ok' ou 'erro' (não há 'quase').
   Todas as funções aceitam a data como parâmetro (padrão: relogio.hoje()),
   para o recomendador poder perguntar "como estará o estado em tal dia?".
   ========================================================= */
import * as R from './relogio.js';

export const P = Object.freeze({
  pesos: Object.freeze({ lembrar: 2, compreender: 3, aplicar: 4 }),
  criterio: 6,             // soma de pesos em acertos seguidos que vence a rodada
  teto: 8,                 // tentativas máximas por rodada
  razaoCepeda: 0.15,       // último intervalo ≈ 15% do horizonte (regra de projeto inspirada em Cepeda et al.)
  caixas: 5,
  limiarPrereq: 1,         // nível mínimo do pré-requisito para liberar o capítulo
  limiarChefe: 2,          // nível mínimo de todos os capítulos para liberar a Prova do caderno
  limiar: 0.85,            // R = 0,85^(t/I): a revisão vence quando R chega a 85%
  deliberacao: 1200,       // ms mínimos antes de liberar "Continuar" (intervalo deliberativo)
  deliberacaoMax: 3500,
  chefe: Object.freeze({ criterio: 10, teto: 12, topicos: 4 }),
  historico: 300,          // tentativas guardadas por capítulo
  horizontePadrao: 90,     // sem data de prova
});
export const NIVEIS = ['lembrar', 'compreender', 'aplicar'];
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
export const NIVEL = ['Novo', 'Aprendendo', 'Firmando', 'Firme', 'Forte', 'Dominado'];
export const MATERIAS = { mat: 'Matemática', cn: 'Ciências da Natureza', ch: 'Ciências Humanas', lc: 'Linguagens' };
export const CHEFE = 'chefe:';
export const ehChefe = id => typeof id === 'string' && id.startsWith(CHEFE);
export const chefeId = cjId => CHEFE + cjId;
/** Rótulo do nível para a tela (os nomes de NIVEL são só chaves internas): "nível 2 de 5"; o topo, "nível 5 de 5: dominado". */
export const rotuloNivel = k => (k >= 1 ? (k >= 5 ? 'nível 5 de 5: dominado' : `nível ${k} de 5`) : 'ainda não começou');
/** "no nível 2 de 5" (para "entrou no", "continua no", "volta para o"). */
export const noNivel = k => `no ${rotuloNivel(k)}`;
export const nomeNivel = k => rotuloNivel(k);

/* ---------------- Pilar VI · horizonte e intervalos (sem índice) ---------------- */
export function prova(st, d = R.hoje()) {
  const p = st.perfil && st.perfil.prova;
  if (!R.ehData(p)) return { dias: null, passou: false };
  const n = R.diff(d, p);
  return { dias: n, passou: n < 0 };
}
/** Dias até a prova (mínimo 7); sem data ou com a prova já passada, 90. */
export function horizonte(st, d = R.hoje()) {
  const pv = prova(st, d);
  if (pv.dias === null || pv.passou) return P.horizontePadrao;
  return Math.max(7, pv.dias);
}
/** out[caixa] = dias até a próxima revisão. Último = max(4, round(0,15 × H)), até 60; os outros em
 *  progressão geométrica, cada um pelo menos 1 dia maior que o anterior. */
export function intervalos(st, d = R.hoje()) {
  const H = horizonte(st, d);
  const max = Math.min(60, Math.max(4, Math.round(H * P.razaoCepeda)));
  const out = [0];
  for (let k = 1; k <= P.caixas; k++) {
    const v = Math.round(Math.pow(max, (k - 1) / (P.caixas - 1)));
    out.push(Math.max(v, (out[k - 1] || 0) + 1));
  }
  return out;
}
/** Reta final: últimos max(3, round(0,10 × H)) dias antes da prova (regra de projeto, f.1). */
export const retaFinal = (st, d = R.hoje()) => Math.max(3, Math.round(0.10 * horizonte(st, d)));
/** Lembrança estimada (estimativa do modelo, não é medida): R = 0,85^(t/I). Só aparece em "ver a regra". */
export function recuperabilidade(st, id, d = R.hoje()) {
  const t = st.topicos[id];
  if (!t || !t.caixa || !R.ehData(t.proxima)) return null;
  const I = intervalos(st, d)[t.caixa] || 1;
  const desde = Math.max(0, R.diff(R.addDias(t.proxima, -I), d));
  return Math.round(Math.pow(P.limiar, desde / I) * 100);
}
/** Intervalo deliberativo antes de liberar "Continuar" (1,2 a 3,5 s, pelo tamanho da explicação). */
export const pausa = item => Math.min(P.deliberacaoMax, P.deliberacao + 12 * String((item && item.explicacao) || '').length);

/* ---------------- avaliação (só múltipla escolha) ---------------- */
export function avaliar(item, indice) {
  const op = item && item.opcoes ? item.opcoes[indice] : null;
  return op && op.ok ? { res: 'ok' } : { res: 'erro', erroOpcao: op && op.erro };
}

export const reg = (st, id) => {
  const t = (st.topicos[id] = st.topicos[id] || { caixa: 0, proxima: null, tentativas: [], rodadas: [] });
  t.tentativas = t.tentativas || []; t.rodadas = t.rodadas || [];
  return t;
};

/* =========================================================
   Motor ligado a um índice (conjunto = caderno, tópico = capítulo)
   indice = { conjuntos: {id: {id, titulo, materia, topicos: [...] }},
              topicos: {id: {id, n, nome, prereq, ordem, conjunto, itens}},
              itens: {id: item}, dependentes: {id: [ids]} }
   ========================================================= */
export function criarMotor(indice) {
  const IDX = indice;
  const cacheChefe = {};
  function topico(id) {
    if (!ehChefe(id)) return IDX.topicos[id];
    const cjId = id.slice(CHEFE.length), cj = IDX.conjuntos[cjId];
    if (!cj) return null;
    if (!cacheChefe[id]) cacheChefe[id] = {
      id, chefe: true, n: 0, nome: 'Prova do caderno · ' + cj.titulo, conjunto: cjId, prereq: [], ordem: cj.topicos.length,
      itens: cj.topicos.flatMap(t => t.itens || []),
    };
    return cacheChefe[id];
  }
  const nomeCurto = id => { const T = topico(id); return T ? (T.chefe ? 'a Prova do caderno' : `o Cap. ${T.n}`) : 'um capítulo removido'; };
  const ativos = st => Object.values(IDX.conjuntos).filter(cj => (st.conjuntosAtivos || []).includes(cj.id));
  const topicosAtivos = st => ativos(st).flatMap(cj => cj.topicos.map(t => t.id));

  function chefeEstado(st, cjId) {
    const cj = IDX.conjuntos[cjId];
    if (!cj || cj.semProva) return 'bloqueado';   // os tópicos de prática não têm Prova do caderno
    if ((st.chefes || {})[cjId] && st.chefes[cjId].venceu !== false) return 'vencido';
    return cj.topicos.every(t => ((st.topicos[t.id] || {}).caixa || 0) >= P.limiarChefe) ? 'disponivel' : 'bloqueado';
  }
  function prereqOk(st, id) {
    return ((topico(id) || {}).prereq || []).every(p => ((st.topicos[p] || {}).caixa || 0) >= P.limiarPrereq);
  }
  function travadoAtivo(st, id, d = R.hoje()) {
    const t = st.topicos[id];
    if (!t || !t.travado) return false;
    const pr = st.topicos[t.travado.por] || {};
    if (t.travado.desde && t.travado.desde < d) return false; // no dia seguinte destrava sozinho
    return !((pr.ultimoOkEm || 0) > (t.travado.em || 0));
  }
  /** 'bloqueado' | 'novo' | 'pratica' | 'consolidado' | 'agendado' | 'vencido' */
  function estado(st, id, d = R.hoje()) {
    if (ehChefe(id)) return { vencido: 'consolidado', disponivel: 'novo', bloqueado: 'bloqueado' }[chefeEstado(st, id.slice(CHEFE.length))];
    const t = st.topicos[id] || { caixa: 0, tentativas: [] };
    if (!t.caixa && travadoAtivo(st, id, d)) return 'bloqueado';
    if (!t.caixa && !prereqOk(st, id)) return 'bloqueado';
    if (!t.caixa) return (t.tentativas || []).length ? 'pratica' : 'novo';
    if (!t.proxima || t.proxima > d) return 'consolidado';
    return t.proxima === d ? 'agendado' : 'vencido';
  }
  /** Texto da regra do estado do capítulo, para "ver a regra" (o único lugar com a lembrança estimada). */
  function porqueEstado(st, id, d = R.hoje()) {
    const t = st.topicos[id] || { caixa: 0, tentativas: [] }, e = estado(st, id, d), T = topico(id);
    const r = recuperabilidade(st, id, d);
    const est = r == null ? '' : ` Lembrança estimada hoje: ${r}% (estimativa do modelo, não é medida: R = 0,85^(t/I)).`;
    switch (e) {
      case 'bloqueado':
        if (t.travado && travadoAtivo(st, id, d)) return `Bateu no teto na primeira rodada. Antes de voltar, a prática vai para ${nomeCurto(t.travado.por)}, que é a base deste. Amanhã ele volta sozinho.`;
        return `Libera quando ${(T.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq).map(p => `Cap. ${topico(p).n}`).join(' e ')} estiver${(T.prereq || []).length > 1 ? 'em' : ''} no nível 1 de 5.`;
      case 'novo': return 'Pré-requisitos em dia. Pronto para a primeira rodada.';
      case 'pratica': return 'Já teve tentativas, mas ainda não venceu a primeira rodada.';
      case 'consolidado': return `${cap1(nomeNivel(t.caixa))}. A revisão vence em ${R.fmtCurta(t.proxima)}, quando a lembrança estimada chega a 85%.${est}`;
      case 'agendado': return `${cap1(nomeNivel(t.caixa))}. A revisão vence hoje: a lembrança estimada chegou a 85%.${est}`;
      case 'vencido': return `${cap1(nomeNivel(t.caixa))}. A revisão venceu em ${R.fmtCurta(t.proxima)}; revisões atrasadas vêm primeiro.${est}`;
    }
    return '';
  }

  /* ---------------- Pilar V · recompensa anunciada (só o que pode ser entregue) ---------------- */
  function recompensa(st, itens, d = R.hoje()) {
    const out = [];
    const simulado = JSON.parse(JSON.stringify(st.topicos || {}));
    const max = (st.config && st.config.nivelMaximo) || P.caixas;
    for (const it of itens.filter(i => ehChefe(i.id))) {
      const cjId = it.id.slice(CHEFE.length), cj = IDX.conjuntos[cjId];
      if (!cj || chefeEstado(st, cjId) === 'vencido') continue;
      out.push({ tipo: 'trofeu', conjunto: cjId });
      if (!(st.selos || []).includes(cj.materia)) out.push({ tipo: 'selo', materia: cj.materia });
    }
    for (const it of itens.filter(i => !ehChefe(i.id) && i.tipo !== 'extra')) {
      const t = simulado[it.id] || { caixa: 0 };
      const de = t.caixa || 0;
      if (it.tipo === 'revisao' && de >= max) { out.push({ tipo: 'mantem', id: it.id, caixa: de }); continue; }
      const para = it.tipo === 'revisao' ? Math.min(max, de + 1) : Math.max(1, de);
      simulado[it.id] = Object.assign({}, t, { caixa: para });
      out.push({ tipo: 'caixa', id: it.id, de, para, revisao: it.tipo === 'revisao' });
    }
    const ids = itens.map(i => i.id), libera = new Set();
    for (const it of itens) for (const dep of IDX.dependentes[it.id] || []) {
      if (!topicosAtivos(st).includes(dep) || (st.topicos[dep] || {}).caixa) continue;
      const td = st.topicos[dep];
      if (td && td.travado && travadoAtivo(st, dep, d) && !ids.includes(td.travado.por)) continue;
      const ok = (topico(dep).prereq || []).every(p => ((simulado[p] || {}).caixa || 0) >= P.limiarPrereq);
      if (ok && estado(st, dep, d) === 'bloqueado') libera.add(dep);
    }
    libera.forEach(id => out.push({ tipo: 'libera', id }));
    const cjs = new Set(itens.filter(i => !ehChefe(i.id) && topico(i.id)).map(i => topico(i.id).conjunto));
    cjs.forEach(cjId => {
      const cj = IDX.conjuntos[cjId];
      if (chefeEstado(st, cjId) === 'bloqueado' && cj.topicos.every(t => ((simulado[t.id] || {}).caixa || 0) >= P.limiarChefe)) out.push({ tipo: 'chefe', conjunto: cjId });
    });
    return out;
  }

  /* ---------------- rodada ---------------- */
  /** Teto padrão: min(8, max(2, nº de itens)). A rodada do Prumo grava rodada.teto, que tem prioridade. */
  const tetoDe = id => (ehChefe(id) ? P.chefe.teto : Math.min(P.teto, Math.max(2, ((topico(id) || {}).itens || []).length)));
  const criterioDe = id => (ehChefe(id) ? P.chefe.criterio : P.criterio);
  const chefeTopicos = id => Math.min(P.chefe.topicos, (IDX.conjuntos[id.slice(CHEFE.length)] || { topicos: [] }).topicos.length);

  function novaRodada(st, id, tipo, teto) {
    return { id, tipo, usados: [], hist: [], sequencia: 0, tentativas: 0, primeira: null, caixaAntes: (st.topicos[id] || {}).caixa || 0, teto: teto || null, okTops: [] };
  }
  /** Registra a tentativa no histórico do capítulo e na rodada. Marca o dia como estudado. */
  function registrar(st, rodada, item, aval, { dia = R.hoje(), agora = R.agora(), alt = null, tipo = null } = {}) {
    const t = reg(st, ehChefe(rodada.id) ? item.topico : rodada.id);
    const r = aval.res;
    rodada.usados.push(item.id);
    rodada.hist.push(r);
    rodada.tentativas++;
    if (rodada.primeira === null) rodada.primeira = r;
    if (r === 'ok') { rodada.sequencia += P.pesos[item.nivel] || 2; rodada.okTops = [...new Set([...(rodada.okTops || []), item.topico])]; }
    else { rodada.sequencia = 0; rodada.okTops = []; rodada.errosTop = rodada.errosTop || {}; rodada.errosTop[item.topico] = (rodada.errosTop[item.topico] || 0) + 1; }
    const primeiraVez = !t.tentativas.some(x => x.item === item.id);
    t.tentativas.push({ item: item.id, dia, em: agora, res: r, alt, tipo, primeiraVez });
    if (t.tentativas.length > P.historico) t.tentativas.splice(0, t.tentativas.length - P.historico);
    st.dias = st.dias || {};
    st.dias[dia] = true;
    const venceu = rodada.sequencia >= criterioDe(rodada.id) && (!ehChefe(rodada.id) || (rodada.okTops || []).length >= chefeTopicos(rodada.id));
    const teto = !venceu && rodada.tentativas >= (rodada.teto || tetoDe(rodada.id));   // mudança de uma linha (b.3)
    return { venceu, teto, fim: venceu || teto, progresso: Math.min(1, rodada.sequencia / criterioDe(rodada.id)) };
  }

  function fecharChefe(st, rodada, d = R.hoje()) {
    const cjId = rodada.id.slice(CHEFE.length), cj = IDX.conjuntos[cjId];
    const venceu = rodada.sequencia >= P.chefe.criterio && (rodada.okTops || []).length >= chefeTopicos(rodada.id);
    const out = { id: rodada.id, chefe: true, conjunto: cjId, venceu, tentativas: rodada.tentativas, caixaAntes: 0, caixaDepois: 0, liberou: [] };
    st.chefes = st.chefes || {};
    if (venceu) {
      const jaTinha = chefeEstado(st, cjId) === 'vencido';
      if (!jaTinha) { st.chefes[cjId] = { dia: d, tentativas: rodada.tentativas, venceu: true }; out.trofeu = cjId; }
      st.selos = st.selos || [];
      if (!st.selos.includes(cj.materia)) { st.selos.push(cj.materia); out.selo = cj.materia; }
      out.ganho = jaTinha ? 'treino' : 'chefe';
      out.regra = `${P.chefe.criterio} pontos seguidos com acertos em ${chefeTopicos(rodada.id)} capítulos diferentes: você firmou os ${chefeTopicos(rodada.id)} capítulos de ${cj.titulo}.`;
    } else {
      // não vencer não mexe na agenda: só aponta onde treinar
      out.revisar = Object.entries(rodada.errosTop || {}).sort((a, b) => b[1] - a[1] || (topico(a[0]).ordem - topico(b[0]).ordem)).slice(0, 2).map(([id]) => id);
      out.ganho = 'nenhum';
      out.regra = `Teto de ${P.chefe.teto} tentativas. Nada do que você já consolidou muda.`;
      if (!st.chefes[cjId]) st.chefes[cjId] = { dia: d, tentativas: rodada.tentativas, venceu: false };
      st.chefes[cjId].tentativasFeitas = (st.chefes[cjId].tentativasFeitas || 0) + 1;
    }
    return out;
  }

  /** Fecha uma rodada de capítulo novo, de prática ('pratica') ou de revisão antecipada ('extra'). */
  function fecharRodada(st, rodada, d = R.hoje()) {
    if (ehChefe(rodada.id)) return fecharChefe(st, rodada, d);
    const T = topico(rodada.id);
    if (rodada.tipo === 'extra') {
      const t = reg(st, rodada.id), venceu = rodada.sequencia >= P.criterio;
      const out = { id: rodada.id, caixaAntes: t.caixa, caixaDepois: t.caixa, tentativas: rodada.tentativas, venceu, liberou: [], extra: true, ganho: 'treino' };
      if (venceu) out.regra = `Revisão antecipada vencida. O nível só sobe na revisão do dia certo (${R.fmtCurta(t.proxima)}): é o intervalo que fixa.`;
      else { if (!t.proxima || t.proxima > R.addDias(d, 1)) t.proxima = R.addDias(d, 1); out.regra = `A revisão antecipada mostrou que o Cap. ${T.n} está escapando: a revisão dele passou para amanhã.`; }
      out.proxima = t.proxima;
      t.rodadas.push({ dia: d, venceu, tentativas: rodada.tentativas, de: t.caixa, para: t.caixa, tipo: 'extra' });
      return out;
    }
    const t = reg(st, rodada.id), iv = intervalos(st, d);
    const antes = t.caixa || 0;
    const out = { id: rodada.id, caixaAntes: antes, tentativas: rodada.tentativas, venceu: rodada.sequencia >= P.criterio };
    const liberaveis = (IDX.dependentes[rodada.id] || []).filter(x => estado(st, x, d) === 'bloqueado');
    if (out.venceu) {
      t.caixa = Math.max(1, antes);
      t.proxima = R.addDias(d, iv[t.caixa]);
      t.ultimoOk = d;
      t.ultimoOkEm = R.agora();
      delete t.travado;
      out.regra = `${T.nome} entrou ${noNivel(t.caixa)}. Revisão: ${R.fmtRelativa(t.proxima, d)}.`;
    } else if (antes >= 1) {
      // não acontece no Prumo (revisão usa fecharRevisao), mantido do motor: o consolidado não zera
      t.caixa = 1;
      t.proxima = R.addDias(d, 1);
      out.regra = `Rodada encerrada em ${rodada.tentativas} tentativas. O Cap. ${T.n} volta para o nível 1 de 5 e revisa amanhã. Seu histórico continua.`;
    } else {
      // teto na primeira vez: falta base; a prática vai para o pré-requisito
      t.caixa = 0;
      t.proxima = null;
      const raiz = p => { const tp = st.topicos[p]; return tp && tp.travado && travadoAtivo(st, p, d) ? raiz(tp.travado.por) : p; };
      const pres = (T.prereq || []).filter(p => topico(p)).map(raiz);
      const pre = pres.sort((a, b) => ((st.topicos[a] || {}).caixa || 0) - ((st.topicos[b] || {}).caixa || 0) || topico(a).ordem - topico(b).ordem)[0];
      if (pre) {
        t.travado = { por: pre, desde: d, em: R.agora() };
        const tp = reg(st, pre);
        if (tp.caixa && tp.ultimoOk !== d && (!tp.proxima || tp.proxima > d)) tp.proxima = d;
        out.redireciona = pre;
        out.regra = `A prática vai para o Cap. ${topico(pre).n}, que é a base deste.`;
      } else {
        out.regra = `Rodada encerrada em ${rodada.tentativas} tentativas. Nada se perde.`;
      }
    }
    out.caixaDepois = t.caixa;
    out.proxima = t.proxima;
    out.ganho = !out.venceu ? 'nenhum' : t.caixa > antes ? (antes ? 'subiu' : 'entrou') : t.caixa < antes ? 'caiu' : 'manteve';
    t.rodadas.push({ dia: d, venceu: out.venceu, tentativas: rodada.tentativas, de: antes, para: t.caixa, tipo: rodada.tipo });
    out.liberou = liberaveis.filter(x => estado(st, x, d) !== 'bloqueado');
    const cjId = T.conjunto;
    if (out.venceu && chefeEstado(st, cjId) === 'disponivel' && !(st.chefeAvisado || {})[cjId]) { out.chefeLiberado = cjId; st.chefeAvisado = Object.assign(st.chefeAvisado || {}, { [cjId]: d }); }
    return out;
  }

  /** Adaptador de revisão (b.3): a revisão é 1 item e vale a primeira resposta.
   *  Certa sobe um nível (até o nível máximo); errada volta a Aprendendo (Leitner clássico). */
  function fecharRevisao(st, capId, res, d = R.hoje()) {
    const t = reg(st, capId), iv = intervalos(st, d), antes = t.caixa || 0;
    const max = (st.config && st.config.nivelMaximo) || P.caixas;
    // certa sobe um nível; errada desce UM nível (nunca abaixo de 1) e a revisão volta para amanhã
    t.caixa = res === 'ok' ? Math.min(max, Math.max(1, antes + 1)) : Math.max(1, antes - 1);
    t.proxima = res === 'ok' ? R.addDias(d, iv[t.caixa]) : R.addDias(d, 1);
    if (res === 'ok') { t.ultimoOk = d; t.ultimoOkEm = R.agora(); delete t.travado; }
    t.rodadas.push({ dia: d, tipo: 'revisao', de: antes, para: t.caixa, venceu: res === 'ok', tentativas: 1 });
    const out = { id: capId, revisao: true, venceu: res === 'ok', caixaAntes: antes, caixaDepois: t.caixa, proxima: t.proxima, intervalo: iv[t.caixa] };
    const cjId = topico(capId).conjunto;
    if (res === 'ok' && chefeEstado(st, cjId) === 'disponivel' && !(st.chefeAvisado || {})[cjId]) { out.chefeLiberado = cjId; st.chefeAvisado = Object.assign(st.chefeAvisado || {}, { [cjId]: d }); }
    return out;
  }

  /* ---------------- agenda ---------------- */
  function agenda(st, dias = 14, d = R.hoje()) {
    const out = [];
    for (let i = 0; i < dias; i++) {
      const dia = R.addDias(d, i);
      const ids = topicosAtivos(st).filter(id => {
        const t = st.topicos[id];
        return t && t.caixa && t.proxima && (i === 0 ? t.proxima <= dia : t.proxima === dia);
      });
      out.push({ dia, ids });
    }
    return out;
  }
  function proximaRevisao(st, d = R.hoje()) {
    const ds = topicosAtivos(st).map(id => st.topicos[id]).filter(t => t && t.caixa && R.ehData(t.proxima)).map(t => t.proxima).sort();
    return ds.find(x => x > d) || null;
  }

  return {
    P, NIVEL, NIVEIS, indice: IDX, topico, nomeCurto, ativos, topicosAtivos, chefeEstado, prereqOk, travadoAtivo, estado, porqueEstado,
    recompensa, tetoDe, criterioDe, chefeTopicos, novaRodada, registrar, fecharRodada, fecharChefe, fecharRevisao,
    agenda, proximaRevisao, avaliar, pausa, prova, horizonte, intervalos, retaFinal, recuperabilidade,
  };
}
