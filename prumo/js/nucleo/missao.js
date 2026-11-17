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
import { montarMissao, proximaVariante } from './recomendador.js';
import { fecharSemanas, encerrarPausa, semanasComMeta } from './plano.js';
import { receberCards, novaMao, cardAtual, avancarMao, responderCard, resumoMao } from './cards.js';
import { novaProva, provaOferecida } from './prova.js';
import { lerCopia, normalizarPerfil } from './estado.js';

export const IGNORAR = Symbol('ignorar');
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
export const DENTRO = new Set(['pergunta', 'leitura', 'feedback', 'trecho', 'fimDaRodada', 'cards', 'trechoCard', 'fimDaMao']);
export const DENTRO_PROVA = new Set(['provaPergunta', 'provaFeedback', 'provaTrecho']);
const novoResumo = () => ({ rodadas: [], revisoes: [], dia: { n: 0, certas: 0 }, antecipada: { n: 0, certas: 0 }, cards: null, pres: 0, tentativas: 0, certas: 0, cardsRecebidos: [] });

export class Missao {
  /** ctx: { st (objeto de estado, sempre o mesmo), pack, M (motor), persistir(), salvarNota(dados) } */
  constructor(ctx) { this.ctx = ctx; }
  get st() { return this.ctx.st; }
  get pack() { return this.ctx.pack; }
  get M() { return this.ctx.M; }
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
    const marca = (k, cond) => { if (cond && !st.marcos[k]) st.marcos[k] = d; };
    marca('m.primeiroCap', caps.some(id => cx(id) >= 1));
    marca('m.semanaMeta', semanasComMeta(st) >= 1);
    marca('m.todosFirmando', caps.length > 0 && caps.every(id => cx(id) >= 2));
    marca('m.primeiroFirme', caps.some(id => cx(id) >= 3));
    marca('m.prova', !!(st.chefes[this.pack.id] && st.chefes[this.pack.id].venceu));
  }

  /* ---------------- montagem e virada de data ---------------- */
  novaMissao(d, extra = {}) {
    const mm = montarMissao(this.st, this.pack, this.M, d, { estudarMesmoAssim: !!extra.estudarMesmoAssim });
    return {
      dia: d, regra: mm.regra, tipo: mm.tipo, trilha: mm.trilha, frase: mm.frase, passos: mm.passos, cap: mm.cap || null,
      minutos: mm.minutos, venc: mm.venc, boasVindas: !!mm.boasVindas, retorno: !!mm.retorno, reta: mm.reta || null, provaPassou: !!mm.provaPassou,
      capTravado: mm.capTravado || null, revisoesForaDoOrcamento: mm.revisoesForaDoOrcamento || 0, estudarMesmoAssim: !!extra.estudarMesmoAssim,
      i: 0, estado: 'hoje', iniciada: false, hojeNao: false, retomar: null,
      rodada: null, ultima: null, ultimaPre: null, feedbackEm: null, resolucaoAberta: false, fimRodada: null, mao: null,
      fechada: false, parcial: false, encerradoNoPasso: null, rev: 0, resumo: novoResumo(),
      faixa: extra.faixa || null, recado: extra.recado || null, prova: null, provaFeitaHoje: !!extra.provaFeitaHoje,
    };
  }
  /** Remonta a missão de hoje se ela ainda não começou (o plano mudou). */
  remontarSeNaoIniciada() {
    const m = this.m;
    if (!this.st.perfil || !m || m.iniciada || m.fechada) return false;
    return this.transicao(() => { this.st.missao = this.novaMissao(R.hoje(), { faixa: m.faixa, recado: m.recado, estudarMesmoAssim: m.estudarMesmoAssim, provaFeitaHoje: m.provaFeitaHoje }); return 'hoje'; });
  }
  virarDia() {
    const d = R.hoje(), st = this.st, m = this.m;
    let faixa = null, recado = null;
    if (m && m.dia !== d) {
      if (m.iniciada && !m.fechada) {
        const passo = Math.min(m.i + 1, m.passos.length), total = m.passos.length;
        this.descartarRodadaAberta();
        m.fechada = true; m.parcial = true; m.encerradoNoPasso = passo;
        st.historico.push({ dia: m.dia, regra: m.regra, tipo: m.tipo, passos: total, feitos: m.i, parcial: true, fechada: true, viradaDeData: true });
        const quando = R.diff(m.dia, d) === 1 ? 'Ontem' : `Em ${R.fmtCurta(m.dia)}`;
        faixa = `${quando} você parou no passo ${passo} de ${total}. Ficou registrado.`;
        // o mesmo aviso no formato do Recado do design system: rótulo em negrito + a frase
        recado = { rotulo: quando, texto: `você parou no passo ${passo} de ${total}. Ficou registrado.` };
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
    if (p.t === 'leitura') return 'leitura';
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
    return R.agora() - em >= this.M.pausa(this.pack.item(u.item));
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
    if (out.fim || pr.i >= pr.fila.length - 1) pr.resultado = M.fecharChefe(st, pr.rodada, d);
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
      m.iniciada = true; m.hojeNao = false;
      return this.estadoDoPasso();
    },
    CONTINUAR() {
      const m = this.m;
      if (!m.iniciada || m.fechada) return IGNORAR;
      const r = m.retomar || this.estadoDoPasso(); m.retomar = null;
      return r;
    },
    HOJE_NAO() { const m = this.m; if (m.iniciada || m.fechada || !m.passos.length) return IGNORAR; m.hojeNao = true; return 'hoje'; },
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
      const p = this.passo(), item = this.pack.item(p.id);
      if (this.pack.indice(item, alt) < 0) return IGNORAR;
      if (p.t === 'pre') { this.guardarPre(p, alt); return this.avancar(); }   // nenhum sinal de acerto ou erro
      return this.responder(p, item, alt);
    },
  },
  leitura: {
    TERMINEI_TRECHO() { return this.avancar(); },
    JA_SEI() { return this.irParaProximaPergunta(); },     // para todos; não lê a pré-pergunta
    SALVAR_NOTA(e) { this.ctx.salvarNota(Object.assign({ pagina: this.passo().pagina }, e)); return 'leitura'; },
  },
  feedback: {
    CONTINUAR() {
      if (!this.pausaCumprida()) return IGNORAR;          // intervalo deliberativo
      return this.m.fimRodada && this.restaPasso() ? 'fimDaRodada' : this.avancar();
    },
    VOLTAR_AO_TRECHO() { return this.m.ultima && this.m.ultima.paragrafo ? 'trecho' : IGNORAR; },
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
  encerramento: { FECHAR() { return 'feito'; } },
  feito: {},
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
