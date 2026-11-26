/* =========================================================
   PRUMO · A missão como máquina de estados finita (b.1–b.4; núcleo, sem DOM)
   Nada avança sozinho: toda transição depende de um evento do aluno, e todo
   efeito acontece dentro da transição, junto com o salvamento (efeito e
   salvamento juntos, ou nada). A tela só lê o estado.
   Estados: primeiroUso · hoje · pergunta · leitura · feedback · trecho ·
   fimDaRodada · cards · trechoCard · fimDaMao · encerramento · feito ·
   prova · provaPergunta · provaFeedback · provaTrecho · provaResultado.
   ========================================================= */
import * as R from './relogio.js';
import { P, chefeId } from './motor.js';
import { proximaVariante } from './recomendador.js';
import { montarMissaoGeral } from './pratica.js';
import { fecharSemanas, encerrarPausa, semanasComMeta } from './plano.js';
import { receberCards, novaMao, cardAtual, avancarMao, responderCard, resumoMao } from './cards.js';
import { novaProva, provaOferecida } from './prova.js';
import { lerCopia, normalizarPerfil } from './estado.js';

export const IGNORAR = Symbol('ignorar');
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
export const DENTRO = new Set(['pergunta', 'leitura', 'feedback', 'trecho', 'fimDaRodada', 'cards', 'trechoCard', 'fimDaMao']);
/* ---------------- placar da partida (combo, pontos e carimbos) ----------------
   Cada acerto vale 10 pontos vezes o combo (acertos seguidos, até x3); errar zera o combo.
   Carimbos da partida: 3 acertando 9 de cada 10, 2 acertando 6 de cada 10, 1 por terminar.
   Garantir ou dobrar (o "cash out"): os pontos da sequência formam o pote. A cada 3 acertos seguidos, o aluno
   garante o pote ou aposta que acerta a próxima: acertando, o pote dobra; errando, perde só o pote.
   Nível, revisão e carimbos não entram na aposta: ela mexe só nos pontos da partida. */
export const VIDAS_PROVA = 3;
export function marcarPlacar(m, res) {
  const p = m.placar || (m.placar = { pontos: 0, seq: 0, maxSeq: 0, acertos: 0, total: 0, ganho: 0, mult: 1 });
  const dobro = !!p.dobro;
  p.total++; p.bonus = 0; p.perdeu = 0; p.dobro = false; p.oferta = false;
  if (res === 'ok') {
    p.acertos++; p.seq++; p.maxSeq = Math.max(p.maxSeq, p.seq); p.mult = Math.min(3, p.seq); p.ganho = 10 * p.mult;
    if (dobro) { p.bonus = p.pote || 0; p.pontos += p.bonus; p.pote = 0; }
    p.pontos += p.ganho; p.pote = (p.pote || 0) + p.ganho;
    p.oferta = !dobro && p.seq % 3 === 0;
  } else {
    if (dobro) { p.perdeu = p.pote || 0; p.pontos -= p.perdeu; }
    p.seq = 0; p.mult = 1; p.ganho = 0; p.pote = 0;
  }
  return p;
}
/** Escolha do "Garantir ou dobrar" (só quando há oferta). Garantir: o pote fica a salvo. */
export function apostarPlacar(p, dobrar) {
  if (!p || !p.oferta) return false;
  p.oferta = false;
  if (dobrar) p.dobro = true; else p.pote = 0;
  return true;
}
/** Raspadinha do fim da partida: sempre ganha. 8% carimbo dourado, 12% +100, 30% +50, 50% +20. */
export function sortearRaspadinha(r = Math.random()) {
  return r < 0.08 ? { tipo: 'dourado' } : r < 0.2 ? { tipo: 'pontos', valor: 100 } : r < 0.5 ? { tipo: 'pontos', valor: 50 } : { tipo: 'pontos', valor: 20 };
}
export function estrelasDe(p) {
  if (!p || !p.total) return 0;
  const r = p.acertos / p.total;
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1;
}
export function guardarEstrelas(st, id, n) {
  st.estrelas = st.estrelas || {};
  const antes = st.estrelas[id] || 0;
  if (n > antes) st.estrelas[id] = n;
  // 'primeiro' na primeira vez; 'melhor' quando supera o que já havia
  return n > antes ? (antes ? 'melhor' : 'primeiro') : false;
}

export const DENTRO_PROVA = new Set(['provaPergunta', 'provaFeedback', 'provaTrecho']);
// marcos: os marcos ganhos NESTA missão (o Pronto lista só esses); apostila: 'lida' | 'pulada' | null (tópico de prática)
const novoResumo = () => ({ rodadas: [], revisoes: [], dia: { n: 0, certas: 0 }, antecipada: { n: 0, certas: 0 }, cards: null, pres: 0, tentativas: 0, certas: 0, cardsRecebidos: [], marcos: [], apostila: null });
/** Dias em que o aluno marcou "Hoje não" (as revisões tratam esses dias como folga: não viram atraso). */
function marcarHojeNao(st, d, sim) {
  st.hojeNao = st.hojeNao || {};
  if (sim) st.hojeNao[d] = true; else delete st.hojeNao[d];
  const ks = Object.keys(st.hojeNao).sort();
  for (const k of ks.slice(0, Math.max(0, ks.length - 120))) delete st.hojeNao[k];
}

export class Missao {
  /** ctx: { st (objeto de estado, sempre o mesmo), pack, M (motor), persistir(), salvarNota(dados) } */
  constructor(ctx) { this.ctx = ctx; }
  get st() { return this.ctx.st; }
  get pack() { return this.ctx.pack; }
  get M() { return this.ctx.M; }
  /** Tópicos de prática (pratica.js) e o motor deles (a mesma regra, outro índice). */
  get prat() { return this.ctx.prat; }
  /** Item de qualquer origem: tópico de prática ('<tópico>:<questão>') ou caderno. */
  itemDe(id) { return (this.prat && this.prat.item(id)) || this.pack.item(id); }
  get m() { return this.st.missao; }
  estadoAtual() { if (!this.st.perfil) return 'primeiroUso'; return this.m ? this.m.estado : 'hoje'; }

  /* ---------------- despacho ---------------- */
  /** Aplica um evento. Devolve true se houve transição; false se o evento foi ignorado. */
  despachar(e) {
    if (typeof e === 'string') e = { tipo: e };
    if (!e || !e.tipo) return false;
    if (e.tipo === 'CARREGOU') return this.abrir();
    // a virada de data vem antes de qualquer evento (b.2): fecha a missão de ontem e monta a de hoje
    if (this.st.perfil && this.m && this.m.dia !== R.hoje()) {
      this.transicao(() => this.virarDia());
      if (e.tipo === 'DATA_MUDOU') return true;
    }
    const estado = this.estadoAtual();
    let f = (Missao.T[estado] || {})[e.tipo];
    if (!f && DENTRO.has(estado)) f = Missao.GLOBAL[e.tipo];
    if (!f && DENTRO_PROVA.has(estado)) f = Missao.GLOBAL_PROVA[e.tipo];
    if (!f) return false;                                     // nunca há transição implícita
    return this.transicao(() => f.call(this, e));
  }
  /** Executa o efeito e salva; se algo falhar, devolve o estado ao que era. */
  transicao(fn) {
    const copia = JSON.stringify(this.st);
    try {
      const novo = fn();
      if (novo === IGNORAR) { this.substituir(JSON.parse(copia)); return false; }
      if (typeof novo === 'string' && this.m) { this.m.estado = novo; this.m.rev = (this.m.rev || 0) + 1; }
      this.posTransicao();
      this.ctx.persistir();
      return true;
    } catch (err) { this.substituir(JSON.parse(copia)); throw err; }
  }
  /** Troca o conteúdo do estado no mesmo objeto (a tela e o núcleo guardam a mesma referência). */
  substituir(novo) {
    const st = this.st;
    for (const k of Object.keys(st)) delete st[k];
    Object.assign(st, novo);
  }
  /** Abertura (CARREGOU): sem perfil, Primeiro uso; com missão de outra data, fecha e monta a de hoje. */
  abrir() {
    if (!this.st.perfil) return false;
    if (!this.m || this.m.dia !== R.hoje()) return this.transicao(() => this.virarDia());
    return false;
  }
  posTransicao() {
    const d = R.hoje(), st = this.st;
    if (!st.perfil) return;
    fecharSemanas(st, d);
    const caps = this.M.topicosAtivos(st), cx = id => (st.topicos[id] || {}).caixa || 0;
    // o marco ganho agora fica também no resumo da missão de hoje: o Pronto lista só os ganhos nela
    // (um estudo por conta própria depois do Pronto não repete o marco ganho mais cedo)
    const res = this.m && this.m.dia === d && this.m.resumo ? this.m.resumo : null;
    const marca = (k, cond) => { if (cond && !st.marcos[k]) { st.marcos[k] = d; if (res) (res.marcos = res.marcos || []).push(k); } };
    marca('m.primeiroCap', caps.some(id => cx(id) >= 1));
    marca('m.semanaMeta', semanasComMeta(st) >= 1);
    marca('m.todosFirmando', caps.length > 0 && caps.every(id => cx(id) >= 2));
    marca('m.primeiroFirme', caps.some(id => cx(id) >= 3));
    marca('m.prova', !!(st.chefes[this.pack.id] && st.chefes[this.pack.id].venceu));
  }

  /* ---------------- montagem e virada de data ---------------- */
  novaMissao(d, extra = {}) {
    const mm = montarMissaoGeral(this.st, this.pack, this.M, this.prat, d, { estudarMesmoAssim: !!extra.estudarMesmoAssim, topico: extra.topico || null, soCaderno: !!extra.soCaderno, livre: !!extra.livre });
    return {
      dia: d, regra: mm.regra, tipo: mm.tipo, trilha: mm.trilha, frase: mm.frase, passos: mm.passos, cap: mm.cap || null,
      minutos: mm.minutos, venc: mm.venc, boasVindas: !!mm.boasVindas, retorno: !!mm.retorno, reta: mm.reta || null, provaPassou: !!mm.provaPassou,
      capTravado: mm.capTravado || null, revisoesForaDoOrcamento: mm.revisoesForaDoOrcamento || 0, foraPor: mm.foraPor || null, revisoesFora: mm.revisoesFora || [],
      capAdiado: mm.capAdiado || null, estudarMesmoAssim: !!extra.estudarMesmoAssim,
      i: 0, estado: 'hoje', iniciada: false, hojeNao: !!extra.hojeNao, retomar: null,
      rodada: null, ultima: null, ultimaPre: null, feedbackEm: null, resolucaoAberta: false, fimRodada: null, mao: null,
      fechada: false, parcial: false, encerradoNoPasso: null, rev: 0, resumo: novoResumo(),
      faixa: extra.faixa || null, recado: extra.recado || null, prova: null, provaFeitaHoje: !!extra.provaFeitaHoje,
      livre: !!extra.livre, missaoDoDia: extra.missaoDoDia || null,
    };
  }
  /** Remonta a missão de hoje se ela ainda não começou (o plano mudou). */
  remontarSeNaoIniciada() {
    const m = this.m;
    if (!this.st.perfil || !m || m.iniciada || m.fechada) return false;
    return this.transicao(() => { this.st.missao = this.novaMissao(R.hoje(), { faixa: m.faixa, recado: m.recado, estudarMesmoAssim: m.estudarMesmoAssim, provaFeitaHoje: m.provaFeitaHoje, hojeNao: m.hojeNao }); return 'hoje'; });
  }
  virarDia() {
    const d = R.hoje(), st = this.st, m = this.m;
    let faixa = null, recado = null;
    if (m && m.dia !== d) {
      if (m.iniciada && !m.fechada && !m.livre) {
        const passo = Math.min(m.i + 1, m.passos.length), total = m.passos.length;
        this.descartarRodadaAberta();
        m.fechada = true; m.parcial = true; m.encerradoNoPasso = passo;
        st.historico.push({ dia: m.dia, regra: m.regra, tipo: m.tipo, passos: total, feitos: m.i, parcial: true, fechada: true, viradaDeData: true });
        // o visto do dia segue a mesma regra de "Encerrar por hoje": o dia contou como estudado, a missão fechou
        if (st.dias && st.dias[m.dia]) { st.carimbos = st.carimbos || {}; st.carimbos[m.dia] = true; }
        const quando = R.diff(m.dia, d) === 1 ? 'Ontem' : `Em ${R.fmtCurta(m.dia)}`;
        faixa = `${quando} você parou no passo ${passo} de ${total}. O que fez ficou registrado; hoje a missão é nova.`;
        // o mesmo aviso no formato do Recado do design system: rótulo em negrito + a frase
        recado = { rotulo: null, texto: faixa };
      }
    }
    if (st.pausa && st.pausa.ate && st.pausa.ate < d) encerrarPausa(st, d);
    fecharSemanas(st, d);
    st.missao = this.novaMissao(d, { faixa, recado });
    return 'hoje';
  }

  /* ---------------- passos ---------------- */
  passo() { return this.m && this.m.passos[this.m.i]; }
  restaPasso() { return this.m.i < this.m.passos.length - 1; }
  estadoDoPasso() {
    const m = this.m, p = this.passo();
    if (!p) return this.encerrar(false);
    if (p.t === 'leitura' || p.t === 'teoria') return 'leitura';
    if (p.t === 'cards') { if (!m.mao || m.mao.passo !== m.i) m.mao = Object.assign(novaMao(p.ids), { passo: m.i, pendente: null }); return 'cards'; }
    return 'pergunta';
  }
  avancar() {
    const m = this.m;
    m.resolucaoAberta = false;
    if (m.i + 1 >= m.passos.length) return this.encerrar(false);
    m.i++;
    return this.estadoDoPasso();
  }
  irParaProximaPergunta() {
    const m = this.m;
    let j = m.i + 1;
    while (j < m.passos.length && m.passos[j].t === 'leitura') j++;
    if (j >= m.passos.length) return this.encerrar(false);
    m.i = j;
    return this.estadoDoPasso();
  }
  encerrar(parcial) {
    const m = this.m, st = this.st;
    m.fechada = true; m.parcial = !!parcial;
    m.encerradoNoPasso = Math.min(m.i + 1, m.passos.length);
    if (m.mao && !m.resumo.cards && Object.keys(m.mao.respostas).length) m.resumo.cards = resumoMao(st, m.mao, m.dia);
    m.rodada = null;
    // carimbos da partida: o melhor fica na fase (tópico da trilha ou capítulo que fechou a rodada)
    if (!parcial && m.placar && m.placar.total) {
      const n = estrelasDe(m.placar), alvos = m.topico ? [m.topico] : (m.resumo.rodadas || []).filter(fr => fr.venceu && !fr.extra).map(fr => fr.cap);
      m.placar.estrelas = n;
      m.placar.recorde = alvos.map(id => guardarEstrelas(st, id, n)).find(Boolean) || false;
      m.placar.dobro = false; m.placar.oferta = false;
      m.placar.raspa = { premio: sortearRaspadinha(), raspada: false };
    }
    // o visto do dia (carimbo) é da missão: só quando o dia contou como estudado e não é estudo livre; só cresce
    if (!m.livre && st.dias && st.dias[m.dia]) { st.carimbos = st.carimbos || {}; st.carimbos[m.dia] = true; }
    st.historico.push({ dia: m.dia, regra: m.regra, tipo: m.tipo, passos: m.passos.length, feitos: parcial ? m.i : m.passos.length, parcial: !!parcial, fechada: true });
    return 'encerramento';
  }
  /** Encerrar nunca chama fecharRodada: descarta só a rodada aberta. As tentativas ficam no histórico. */
  descartarRodadaAberta() {
    const m = this.m;
    if (!m || !m.rodada) return;
    const t = this.st.topicos[m.rodada.id], p = this.passo();
    let pag = p && p.pagina;
    if (!pag) { const ant = m.passos.slice(0, m.i + 1).reverse().find(x => x.r === m.rodada.chave && x.pagina); pag = ant ? ant.pagina : null; }
    if (t && pag) t.parouEm = pag;
    m.rodada = null;
  }
  pausaCumprida() {
    const m = this.m, u = m.prova && DENTRO_PROVA.has(m.estado) ? m.prova.ultima : m.ultima;
    const em = m.prova && DENTRO_PROVA.has(m.estado) ? m.prova.feedbackEm : m.feedbackEm;
    if (!u || em == null) return true;
    return R.agora() - em >= (u.pausaMs != null ? u.pausaMs : this.M.pausa(this.pack.item(u.item)));
  }

  /* ---------------- resposta (o único lugar que chama o motor na missão) ---------------- */
  guardarPre(p, alt) {
    const st = this.st, d = R.hoje();
    if (!st.pre[p.id]) st.pre[p.id] = { alt, dia: d, cap: p.cap, revelado: null };
    this.m.resumo.pres++;
    this.m.ultimaPre = { i: this.m.i, id: p.id, alvo: p.alvo, pagina: p.pagina, bloco: p.bloco };
  }
  tipoDaTentativa(p, item) {
    if (p.t === 'checagem') return 'checagem';
    if (p.t === 'revisao') return 'revisao';
    if (p.t === 'dia') return 'dia';
    if (p.antecipada) return 'antecipada';
    return item.origem === 'enem' ? 'enem' : 'equipe';
  }
  criarCartao(item, alt, tipo, cap) {
    const st = this.st, a = item.alternativas.find(x => x.letra === alt) || {};
    let paragrafo = a.paragrafo || null;
    if (!paragrafo && item.blocos && item.blocos[0]) { const b = this.pack.bloco(item.blocos[0]); paragrafo = b && b.paragrafos[0] ? b.paragrafos[0].id : null; }
    const aberto = st.erros.find(e => e.item === item.id && e.estado === 'aberto');
    if (aberto) { Object.assign(aberto, { dia: R.hoje(), marcou: alt, falta: a.falta || '', paragrafo }); return aberto.id; }
    st.seq.erro = (st.seq.erro || 0) + 1;
    const id = `e-${st.seq.erro}`;
    st.erros.push({ id, item: item.id, cap: cap || item.cap, dia: R.hoje(), tipo, marcou: alt, certa: item.gabarito, falta: a.falta || '', anotacao: '', foiIsso: null,
      paragrafo, modelo: item.modelo || null, estado: 'aberto', resolvidoEm: null, refazerEm: null, refazerLinha: 8, voltas: [] });
    return id;
  }
  responder(p, item, alt) {
    const st = this.st, m = this.m, M = this.M, d = R.hoje(), agora = R.agora();
    const itemM = this.pack.paraMotor(item, p.papel || 'compreender');
    const aval = M.avaliar(itemM, this.pack.indice(item, alt));
    const tipo = this.tipoDaTentativa(p, item);
    st.vistos[item.id] = d;
    m.resumo.tentativas++; if (aval.res === 'ok') m.resumo.certas++;
    marcarPlacar(m, aval.res);
    const u = { passo: m.i, item: item.id, alt, res: aval.res, t: p.t, papel: p.papel || null, origem: item.origem, tipo, cap: p.cap, inserida: null, cartao: null, revisao: null, fimRodada: false };
    const a = item.alternativas.find(x => x.letra === alt) || {};
    u.paragrafo = aval.res === 'erro' ? (a.paragrafo || (item.blocos[0] && ((this.pack.bloco(item.blocos[0]) || {}).paragrafos || [])[0] || {}).id || null) : ((item.blocos[0] && ((this.pack.bloco(item.blocos[0]) || {}).paragrafos || [])[0] || {}).id || null);

    if (p.t === 'revisao') {
      M.registrar(st, M.novaRodada(st, p.cap, 'revisao'), itemM, aval, { dia: d, agora, alt, tipo });
      const fr = M.fecharRevisao(st, p.cap, aval.res, d);
      if (p.antesDepois && st.pre[p.antesDepois]) {
        const pr = st.pre[p.antesDepois];
        fr.antesDepois = { antes: pr.alt, antesDia: pr.dia, hoje: alt, certa: item.gabarito };
        pr.revelado = d;
      }
      if (p.erro) {
        const c = st.erros.find(e => e.id === p.erro);
        if (c) { c.voltas.push({ dia: d, item: item.id, res: aval.res, marcou: alt, origem: 'revisao' }); if (aval.res === 'ok') { c.estado = 'resolvido'; c.resolvidoEm = d; } }
        fr.cartao = p.erro;
      }
      u.revisao = fr;
      m.resumo.revisoes.push(Object.assign({ cap: p.cap }, fr));
    } else if (p.t === 'dia') {
      M.registrar(st, M.novaRodada(st, p.cap, 'dia'), itemM, aval, { dia: d, agora, alt, tipo });   // treino: não mexe em nível nem agenda
      m.resumo.dia.n++; if (aval.res === 'ok') m.resumo.dia.certas++;
    } else {
      if (!m.rodada || m.rodada.chave !== p.r) {
        const pontuados = m.passos.filter(x => x.r === p.r && x.papel && x.t !== 'pre').length;
        m.rodada = Object.assign(M.novaRodada(st, p.cap, p.rodadaTipo || 'novo', Math.min(P.teto, Math.max(2, pontuados))), { chave: p.r, corrida: [], insercoes: 0, ultimoErro: false });
      }
      const rod = m.rodada;
      const out = M.registrar(st, rod, itemM, aval, { dia: d, agora, alt, tipo });
      if (aval.res === 'ok') { rod.corrida.push({ papel: p.papel, origem: item.origem, t: p.t }); rod.ultimoErro = false; }
      else { rod.corrida = []; rod.ultimoErro = true; }
      if (p.antecipada) { m.resumo.antecipada.n++; if (aval.res === 'ok') m.resumo.antecipada.certas++; }
      // Pilar III (b.3): erro num passo de aplicar insere a questão da equipe do trecho do erro (não depois de outra inserida)
      if (aval.res === 'erro' && p.papel === 'aplicar' && !p.inserido && !p.antecipada && !out.fim) u.inserida = this.inserirCompreender(p, item, alt);
      const naoFecha = !out.fim && this.naoFechaMais();
      if (out.fim || naoFecha) { this.fecharRodadaAtual(naoFecha); u.fimRodada = true; if (u.inserida) u.inserida.cancelada = true; }
      if (p.erro && p.antecipada) { const c = st.erros.find(e => e.id === p.erro); if (c) c.voltas.push({ dia: d, item: item.id, res: aval.res, marcou: alt, origem: 'antecipada' }); }
    }
    if (aval.res === 'erro' && !(p.t === 'revisao' && p.erro)) u.cartao = this.criarCartao(item, alt, tipo, p.cap);
    m.ultima = u; m.feedbackEm = agora; m.resolucaoAberta = false;
    return 'feedback';
  }
  inserirCompreender(p, item, alt) {
    const st = this.st, m = this.m, pack = this.pack, d = R.hoje();
    const a = item.alternativas.find(x => x.letra === alt) || {};
    let par = a.paragrafo;
    if (!par && item.blocos[0]) { const b = pack.bloco(item.blocos[0]); par = b && b.paragrafos[0] && b.paragrafos[0].id; }
    if (!par) return null;
    const reservados = new Set(m.passos.map(x => x.id).filter(Boolean));
    let id = null;
    for (const mo of pack.modelosParaParagrafo(par)) { id = proximaVariante(st, pack, mo.id, d, { reservados }); if (id) break; }
    if (!id) return null;
    m.passos.splice(m.i + 1, 0, { t: 'questao', id, cap: p.cap, papel: 'compreender', origem: 'equipe', inserido: true, sobre: par, r: p.r, rodadaTipo: p.rodadaTipo });
    m.rodada.teto = Math.min(P.teto, m.rodada.teto + 1);
    m.rodada.insercoes++;
    const loc = pack.local(par);
    return { id, paragrafo: par, rotulo: loc ? loc.rotulo : '' };
  }
  /** A rodada não fecha mais: contagem atual + pesos que restam na fila (dentro do teto) < 6. */
  naoFechaMais() {
    const m = this.m, rod = m.rodada;
    const rest = m.passos.slice(m.i + 1).filter(x => x.r === rod.chave && x.papel && x.t !== 'pre');
    const cabe = Math.max(0, (rod.teto || 0) - rod.tentativas);
    const soma = rest.slice(0, cabe).reduce((s, x) => s + (P.pesos[x.papel] || 0), 0);
    return rod.sequencia + soma < P.criterio;
  }
  fecharRodadaAtual(naoFecha) {
    const st = this.st, m = this.m, rod = m.rodada, d = R.hoje();
    const out = this.M.fecharRodada(st, rod, d);
    out.naoFecha = !!naoFecha && !out.venceu;
    out.cap = rod.id; out.tipo = rod.tipo; out.insercoes = rod.insercoes || 0;
    // Decisão 1: a 1ª rodada do capítulo terminou (vencida ou no teto) → os cards entram no baralho
    if (rod.tipo !== 'extra' && !(st.baralho || {})[rod.id]) { out.cardsRecebidos = receberCards(st, this.pack, rod.id, d); if (out.cardsRecebidos) m.resumo.cardsRecebidos.push(rod.id); }
    m.passos = m.passos.filter((x, j) => j <= m.i || x.r !== rod.chave);   // as questões que sobraram ficam inéditas
    m.fimRodada = out;
    m.resumo.rodadas.push(out);
    m.rodada = null;
  }

  /* ---------------- tópico de prática (pratica.js) ---------------- */
  /** Pergunta antes da teoria: guarda a marcação; nenhum sinal de acerto até o fim da leitura. */
  guardarPrePratica(p, alt) {
    const st = this.st, d = R.hoje();
    st.praticas = st.praticas || {};
    const pr = st.praticas[p.cap] = st.praticas[p.cap] || { desde: d, pre: null };
    if (!pr.pre) pr.pre = { alt, dia: d, revelado: null };
    this.m.resumo.pres++;
    this.m.ultimaPre = { i: this.m.i, id: p.id, alvo: 'teoria', cap: p.cap, pratica: true };
  }
  /** Fim da teoria: se o aquecimento do tópico ainda não teve a resposta mostrada (respondido nesta missão ou numa
   *  anterior que foi encerrada antes do fim da apostila), mostra a resposta agora, depois de ler. */
  fimDaTeoria() {
    const m = this.m, p = this.passo(), st = this.st;
    const pr = ((st.praticas || {})[p.cap] || {}).pre;
    if (pr && pr.alt && !pr.revelado) {
      const item = this.itemDe(`${p.cap}:pre`), d = R.hoje();
      pr.revelado = d;
      m.ultima = { passo: m.i, item: item.id, alt: pr.alt, res: pr.alt === item.gabarito ? 'ok' : 'erro', fonte: 'pratica', revela: true, cap: p.cap, pausaMs: this.M.pausa(item) };
      m.feedbackEm = R.agora(); m.resolucaoAberta = false; m.ultimaPre = null;
      return 'feedback';
    }
    return this.avancar();
  }
  /** Resposta numa questão de tópico (rodada, revisão antecipada ou revisão): o mesmo motor, outro índice. */
  responderPratica(p, item, alt) {
    const st = this.st, m = this.m, MP = this.prat.M, d = R.hoje(), agora = R.agora();
    const itemM = this.prat.paraMotor(item);
    const aval = MP.avaliar(itemM, item.alternativas.findIndex(a => a.letra === alt));
    st.vistos[item.id] = d;
    st.praticas = st.praticas || {};
    if (!st.praticas[p.cap]) st.praticas[p.cap] = { desde: d, pre: null };
    m.resumo.tentativas++; if (aval.res === 'ok') m.resumo.certas++;
    marcarPlacar(m, aval.res);
    const tipo = p.t === 'revisao' ? 'revisao' : p.antecipada ? 'antecipada' : 'enem';
    const u = { passo: m.i, item: item.id, alt, res: aval.res, t: p.t, papel: 'aplicar', origem: 'enem', tipo, cap: p.cap, fonte: 'pratica', revisao: null, fimRodada: false, paragrafo: null, pausaMs: this.M.pausa(item), cartao: null };
    // caderno de erros: a questão errada vai para lá (com o que faltou); acertar a mesma questão depois resolve o cartão
    if (aval.res === 'erro') u.cartao = this.criarCartao(item, alt, tipo, p.cap);
    else {
      const c = (st.erros || []).find(e => e.item === item.id && e.estado === 'aberto');
      if (c) { c.voltas.push({ dia: d, item: item.id, res: 'ok', marcou: alt, origem: tipo }); c.estado = 'resolvido'; c.resolvidoEm = d; }
    }
    if (p.t === 'revisao') {
      MP.registrar(st, MP.novaRodada(st, p.cap, 'revisao'), itemM, aval, { dia: d, agora, alt, tipo });
      const fr = MP.fecharRevisao(st, p.cap, aval.res, d);
      u.revisao = fr;
      m.resumo.revisoes.push(Object.assign({ cap: p.cap, fonte: 'pratica' }, fr));
    } else {
      if (!m.rodada || m.rodada.chave !== p.r) {
        const n = m.passos.filter(x => x.r === p.r).length;
        m.rodada = Object.assign(MP.novaRodada(st, p.cap, p.rodadaTipo || 'novo', Math.max(1, n)), { chave: p.r, corrida: [], insercoes: 0, ultimoErro: false, fonte: 'pratica' });
      }
      const rod = m.rodada;
      const out = MP.registrar(st, rod, itemM, aval, { dia: d, agora, alt, tipo });
      if (aval.res === 'ok') { rod.corrida.push({ papel: 'aplicar', origem: 'enem', t: p.t }); rod.ultimoErro = false; }
      else { rod.corrida = []; rod.ultimoErro = true; }
      if (p.antecipada) { m.resumo.antecipada.n++; if (aval.res === 'ok') m.resumo.antecipada.certas++; }
      const naoFecha = !out.fim && this.naoFechaMais();
      if (out.fim || naoFecha) {
        const fr = MP.fecharRodada(st, rod, d);
        fr.naoFecha = !!naoFecha && !fr.venceu; fr.cap = rod.id; fr.tipo = rod.tipo; fr.fonte = 'pratica'; fr.insercoes = 0;
        m.passos = m.passos.filter((x, j) => j <= m.i || x.r !== rod.chave);   // as questões que sobraram ficam inéditas
        m.fimRodada = fr; m.resumo.rodadas.push(fr); m.rodada = null;
        u.fimRodada = true;
      }
    }
    m.ultima = u; m.feedbackEm = agora; m.resolucaoAberta = false;
    return 'feedback';
  }

  /* ---------------- Prova do caderno ---------------- */
  responderProva(alt) {
    const st = this.st, m = this.m, pr = m.prova, M = this.M, d = R.hoje();
    const f = pr.fila[pr.i];
    const item = this.pack.item(f.id), itemM = this.pack.paraMotor(item, 'aplicar');
    itemM.topico = f.cap;
    const aval = M.avaliar(itemM, this.pack.indice(item, alt));
    st.vistos[item.id] = d;
    const out = M.registrar(st, pr.rodada, itemM, aval, { dia: d, alt, tipo: 'prova' });
    const a = item.alternativas.find(x => x.letra === alt) || {};
    const u = { item: item.id, alt, res: aval.res, cap: f.cap, paragrafo: a.paragrafo || null, cartao: null };
    if (aval.res === 'erro') u.cartao = this.criarCartao(item, alt, 'prova', f.cap);
    marcarPlacar(pr, aval.res);
    // vidas: cada erro quebra um lápis; sem lápis, a Prova acaba (não vencida: nada do que foi firmado muda)
    pr.vidas = Math.max(0, (pr.vidas == null ? VIDAS_PROVA : pr.vidas) - (aval.res === 'erro' ? 1 : 0));
    const semVidas = !out.venceu && pr.vidas === 0;
    if (out.fim || semVidas || pr.i >= pr.fila.length - 1) {
      pr.resultado = M.fecharChefe(st, pr.rodada, d);
      if (semVidas) pr.resultado.semVidas = true;
      if (pr.resultado.venceu) { pr.resultado.estrelas = Math.max(1, pr.vidas); pr.resultado.recorde = guardarEstrelas(st, `${this.pack.id}:prova`, pr.resultado.estrelas); }
    }
    pr.ultima = u; pr.feedbackEm = R.agora(); pr.resolucaoAberta = false;
    return 'provaFeedback';
  }
}

/* ---------------- tabela de transições ---------------- */
Missao.T = {
  primeiroUso: {
    CONCLUIR(e) {
      const d = R.hoje(), st = this.st;
      st.perfil = normalizarPerfil(Object.assign({}, e.perfil, { criadoEm: d }));
      st.conjuntosAtivos = [this.pack.id];
      if (e.perfil && typeof e.perfil.som === 'boolean') st.config.som = e.perfil.som;
      if (e.perfil && ['criado', 'agora-nao'].includes(e.perfil.alarme)) st.config.alarme = e.perfil.alarme;
      st.missao = this.novaMissao(d);
      return 'hoje';
    },
    RESTAURAR_COPIA(e) {
      const novo = lerCopia(e.texto);           // lança ErroCopia: nada é alterado
      this.substituir(novo);
      R.setOffset(this.st.config.demo.ativo ? this.st.config.demo.offset : 0);
      if (!this.m || this.m.dia !== R.hoje()) return this.virarDia();
      return this.m.estado;
    },
  },
  hoje: {
    COMECAR() {
      const m = this.m;
      if (m.fechada || !m.passos.length) return IGNORAR;
      if (m.iniciada) { const r = m.retomar || this.estadoDoPasso(); m.retomar = null; return r; }
      if (m.hojeNao) marcarHojeNao(this.st, m.dia, false);   // "Começar mesmo assim": o dia volta a ser de estudo
      m.iniciada = true; m.hojeNao = false;
      return this.estadoDoPasso();
    },
    CONTINUAR() {
      const m = this.m;
      if (!m.iniciada || m.fechada) return IGNORAR;
      const r = m.retomar || this.estadoDoPasso(); m.retomar = null;
      return r;
    },
    /** "Estudar este tópico hoje" (Estudar): o tópico vira a missão do dia e começa. Só antes de a missão começar. */
    ESTUDAR_TOPICO(e) {
      const m = this.m, id = e && e.id, d = R.hoje();
      // missão do dia cumprida: o aluno pode continuar por conta própria (estudo livre; conta como dia estudado, sem 2º visto)
      if (m.fechada && id !== this.pack.id && this.prat && this.prat.existe(id)) {
        const doDia = m.livre && m.missaoDoDia ? m.missaoDoDia : JSON.parse(JSON.stringify(Object.assign({}, m, { estado: 'feito' })));
        this.st.praticas = this.st.praticas || {};
        if (!this.st.praticas[id]) this.st.praticas[id] = { desde: d, pre: null };
        this.st.missao = this.novaMissao(d, { topico: id, livre: true, missaoDoDia: doDia, provaFeitaHoje: m.provaFeitaHoje });
        const nl = this.m;
        nl.iniciada = true;
        return this.estadoDoPasso();
      }
      // o caderno (Funções afins) por conta própria: revisão antecipada do capítulo mais fraco (não muda o nível)
      if (m.fechada && id === this.pack.id) {
        const doDia = m.livre && m.missaoDoDia ? m.missaoDoDia : JSON.parse(JSON.stringify(Object.assign({}, m, { estado: 'feito' })));
        const nl = this.novaMissao(d, { soCaderno: true, livre: true, missaoDoDia: doDia, provaFeitaHoje: m.provaFeitaHoje });
        if (!nl.passos.length) return IGNORAR;
        this.st.missao = nl;
        nl.iniciada = true;
        return this.estadoDoPasso();
      }
      if (m.fechada || m.iniciada || m.tipo === 'pausa' || (m.prova && !m.prova.encerrada)) return IGNORAR;
      marcarHojeNao(this.st, d, false);   // estudar desfaz o "Hoje não" do dia
      const folga = m.tipo === 'folga' || m.estudarMesmoAssim;
      const extra = { faixa: m.faixa, recado: m.recado, provaFeitaHoje: m.provaFeitaHoje, estudarMesmoAssim: folga };
      if (id === this.pack.id) {
        if (m.tipo === 'topico' || m.tipo === 'folga') this.st.missao = this.novaMissao(d, Object.assign(extra, { soCaderno: true }));
      } else {
        if (!this.prat || !this.prat.existe(id)) return IGNORAR;
        this.st.praticas = this.st.praticas || {};
        if (!this.st.praticas[id]) this.st.praticas[id] = { desde: d, pre: null };
        this.st.missao = this.novaMissao(d, Object.assign(extra, { topico: id }));
      }
      const nm = this.m;
      if (!nm.passos.length) return 'hoje';
      nm.iniciada = true; nm.hojeNao = false;
      return this.estadoDoPasso();
    },
    /** "Hoje não": o dia passa a contar como folga para as revisões (a de hoje entra no próximo dia de estudo sem virar atraso). */
    HOJE_NAO() { const m = this.m; if (m.iniciada || m.fechada || !m.passos.length) return IGNORAR; m.hojeNao = true; marcarHojeNao(this.st, m.dia, true); return 'hoje'; },
    ESTUDAR_MESMO_ASSIM() {
      const m = this.m;
      if (m.tipo !== 'folga' || m.iniciada) return IGNORAR;
      this.st.missao = this.novaMissao(R.hoje(), { estudarMesmoAssim: true, faixa: m.faixa, recado: m.recado, provaFeitaHoje: m.provaFeitaHoje });
      return 'hoje';
    },
    ENCERRAR_PAUSA() {
      const m = this.m;
      if (m.tipo !== 'pausa') return IGNORAR;
      encerrarPausa(this.st, R.hoje());
      this.st.missao = this.novaMissao(R.hoje(), { faixa: m.faixa, recado: m.recado });
      return 'hoje';
    },
    FAZER_PROVA() {
      if (!provaOferecida(this.st, this.pack, this.M, this.m)) return IGNORAR;
      this.m.prova = novaProva(this.st, this.pack, this.M, R.hoje());
      if (!this.m.prova.fila.length) return IGNORAR;
      return 'prova';
    },
  },
  pergunta: {
    RESPONDER(e) {
      const alt = e && e.alt;
      if (!LETRAS.includes(alt)) return IGNORAR;          // guarda: alt != null (sem botão "não sei")
      const p = this.passo(), item = p.fonte === 'pratica' ? null : this.pack.item(p.id);
      if (p.fonte === 'pratica') {
        const it = this.itemDe(p.id);
        if (!it || !it.alternativas.some(a => a.letra === alt)) return IGNORAR;
        if (p.t === 'pre') { this.guardarPrePratica(p, alt); return this.avancar(); }   // nenhum sinal de acerto ou erro
        return this.responderPratica(p, it, alt);
      }
      if (this.pack.indice(item, alt) < 0) return IGNORAR;
      if (p.t === 'pre') { this.guardarPre(p, alt); return this.avancar(); }   // nenhum sinal de acerto ou erro
      return this.responder(p, item, alt);
    },
  },
  leitura: {
    TERMINEI_TRECHO() { if (this.passo().t !== 'teoria') return this.avancar(); this.m.resumo.apostila = 'lida'; return this.fimDaTeoria(); },
    JA_SEI() {     // para todos; não lê a pré-pergunta
      if (this.passo().t !== 'teoria') return this.irParaProximaPergunta();
      if (this.m.resumo.apostila !== 'lida') this.m.resumo.apostila = 'pulada';
      return this.fimDaTeoria();
    },
    SALVAR_NOTA(e) { if (this.passo().t === 'teoria') return IGNORAR; this.ctx.salvarNota(Object.assign({ pagina: this.passo().pagina }, e)); return 'leitura'; },
  },
  feedback: {
    CONTINUAR() {
      if (!this.pausaCumprida()) return IGNORAR;          // intervalo deliberativo
      return this.m.fimRodada && this.restaPasso() ? 'fimDaRodada' : this.avancar();
    },
    VOLTAR_AO_TRECHO() {
      const u = this.m.ultima;
      if (u && u.fonte === 'pratica') return !u.revela && u.res === 'erro' ? 'trecho' : IGNORAR;   // "Rever a teoria"
      return u && u.paragrafo ? 'trecho' : IGNORAR;
    },
    VER_RESOLUCAO() { this.m.resolucaoAberta = true; return 'feedback'; },
  },
  trecho: { VOLTAR() { return 'feedback'; } },
  fimDaRodada: { SEGUIR() { this.m.fimRodada = null; return this.avancar(); } },
  cards: {
    VIRAR() { const mao = this.m.mao; if (!mao || mao.virado || mao.pendente) return IGNORAR; mao.virado = true; return 'cards'; },
    LEMBREI() { return Missao.responderCard.call(this, 'lembrei'); },
    AINDA_NAO() { return Missao.responderCard.call(this, 'ainda'); },
    SEGUIR() { const mao = this.m.mao; if (!mao || !mao.pendente) return IGNORAR; return Missao.seguirMao.call(this); },
    VER_TRECHO() { const mao = this.m.mao; return mao && mao.pendente ? 'trechoCard' : IGNORAR; },
  },
  trechoCard: { VOLTAR() { return 'cards'; } },
  fimDaMao: { SEGUIR() { return this.avancar(); } },
  encerramento: {
    FECHAR() {
      // estudo livre: ao fechar, volta a missão do dia (já cumprida); o visto continua sendo só o dela
      const m = this.m;
      if (m.livre && m.missaoDoDia) { this.st.missao = m.missaoDoDia; this.st.missao.estado = 'feito'; }
      return 'feito';
    },
  },
  feito: { ESTUDAR_TOPICO(e) { return Missao.T.hoje.ESTUDAR_TOPICO.call(this, e); } },   // estudo livre depois do Pronto por hoje
  prova: {
    COMECAR_PROVA() { return 'provaPergunta'; },
    AGORA_NAO() { this.m.prova = null; return 'hoje'; },
  },
  provaPergunta: {
    RESPONDER(e) {
      const alt = e && e.alt;
      if (!LETRAS.includes(alt)) return IGNORAR;
      const f = this.m.prova.fila[this.m.prova.i];
      if (!f || this.pack.indice(this.pack.item(f.id), alt) < 0) return IGNORAR;
      return this.responderProva(alt);
    },
  },
  provaFeedback: {
    CONTINUAR() {
      if (!this.pausaCumprida()) return IGNORAR;
      const pr = this.m.prova;
      if (pr.resultado) return 'provaResultado';
      pr.i++; pr.resolucaoAberta = false;
      return 'provaPergunta';
    },
    VOLTAR_AO_TRECHO() { return this.m.prova.ultima && this.m.prova.ultima.paragrafo ? 'provaTrecho' : IGNORAR; },
    VER_RESOLUCAO() { this.m.prova.resolucaoAberta = true; return 'provaFeedback'; },
  },
  provaTrecho: { VOLTAR() { return 'provaFeedback'; } },
  provaResultado: { FECHAR() { this.m.prova.encerrada = true; this.m.provaFeitaHoje = true; return 'hoje'; } },
};
/** Eventos aceitos em todo estado da missão (a folha "Encerrar" tem duas saídas). */
Missao.GLOBAL = {
  PAUSAR() {                                               // "Parar e continuar mais tarde (até a meia-noite)"
    const e = this.m.estado;
    this.m.retomar = e === 'trecho' ? 'feedback' : e === 'trechoCard' ? 'cards' : e;
    return 'hoje';
  },
  CONFIRMAR_ENCERRAR() { this.descartarRodadaAberta(); return this.encerrar(true); },   // "Encerrar por hoje"
};
/** Na Prova, encerrar no meio não muda nada (o motor não mexe na agenda quando a Prova não é vencida). */
Missao.GLOBAL_PROVA = {
  ENCERRAR_PROVA() { const pr = this.m.prova; pr.abandonada = true; pr.encerrada = true; this.m.provaFeitaHoje = true; return 'hoje'; },
};
Missao.responderCard = function (res) {
  const st = this.st, m = this.m, mao = m.mao, d = R.hoje();
  if (!mao || !mao.virado || mao.pendente) return IGNORAR;
  const id = cardAtual(mao);
  const repeticao = mao.respostas[id] !== undefined;
  responderCard(st, id, res, d, { repeticao });
  if (res === 'ainda') { mao.pendente = { id, res, repeticao }; return 'cards'; }   // mostra "ver o trecho" antes do próximo
  avancarMao(mao, id, res);
  return Missao.fimDaMaoOuCards.call(this);
};
Missao.seguirMao = function () {
  const mao = this.m.mao, pd = mao.pendente;
  mao.pendente = null;
  avancarMao(mao, pd.id, pd.res);
  return Missao.fimDaMaoOuCards.call(this);
};
Missao.fimDaMaoOuCards = function () {
  const m = this.m;
  if (!m.mao.fim) return 'cards';
  m.resumo.cards = resumoMao(this.st, m.mao, R.hoje());
  return this.restaPasso() ? 'fimDaMao' : this.avancar();
};
