/* =========================================================
   PRUMO · Fachada do núcleo para as telas (sem DOM)
   As telas só leem o estado: tudo chega aqui já calculado, em "view models"
   com os textos prontos em português. Para mudar o estado, as telas mandam
   eventos (despachar) ou chamam as ações nomeadas abaixo. Contrato em API.md.
   ========================================================= */
import * as R from './relogio.js';
import * as E from './estado.js';
import { criarMotor, P, NIVEL, MATERIAS } from './motor.js';
import { Pack } from './pack.js';
import { Missao, DENTRO, DENTRO_PROVA } from './missao.js';
import { montarMissao, regraDaFila, verARegra, paginasComErro, proximaVariante } from './recomendador.js';
import * as Plano from './plano.js';
import * as Cards from './cards.js';
import * as Prova from './prova.js';
import { gerarExemplo } from './exemplo.js';

export { R as relogio };   // a tela pode ler relogio.agora() e os formatadores de data

export const MARCOS = [
  { id: 'm.primeiroCap', nome: 'Primeiro capítulo aberto', condicao: 'Vencer a primeira rodada de um capítulo (Aprendendo).' },
  { id: 'm.semanaMeta', nome: 'Primeira semana com a meta', condicao: 'Cumprir a meta numa semana (aparece depois que a semana termina).' },
  { id: 'm.todosFirmando', nome: 'Todos os capítulos em Firmando', condicao: 'Todos os capítulos em Firmando ou acima. Libera a Prova do caderno.' },
  { id: 'm.primeiroFirme', nome: 'Primeiro capítulo Firme', condicao: 'Um capítulo chega a Firme.' },
  { id: 'm.prova', nome: 'Prova do caderno vencida', condicao: '4 acertos seguidos, um de cada capítulo.' },
];
export const NAO_TEM = [
  { item: 'Ligas e ranking', motivo: 'Comparação só consigo mesmo: ranking público é a mecânica extrativa do Quadro 1.' },
  { item: 'XP e pontos', motivo: 'A unidade de progresso é o nível de cada capítulo, não um número a acumular.' },
  { item: 'Baús e sorteio', motivo: 'Toda recompensa é anunciada antes; nada é sorteado (reforço de razão variável eliminado).' },
  { item: 'Energia e vidas', motivo: 'Errar não custa nada além do que a regra escrita diz.' },
  { item: 'Moeda', motivo: 'Sem moeda intermediária: o ganho é o domínio dos capítulos.' },
  { item: 'Apostas', motivo: 'Nada no Prumo depende de sorte.' },
  { item: 'Telemetria', motivo: 'Nenhum dado sai do aparelho; a cópia e o CSV saem só quando você pede.' },
  { item: 'Alertas de reengajamento', motivo: 'O Prumo não manda notificação; o lembrete é um alarme que você mesmo cria.' },
];
const TIPOS_PROVA = [
  { valor: 'escola', rotulo: 'Prova da escola (bimestral)' },
  { valor: 'enem', rotulo: 'Enem', aviso: 'Enem 2027 · data ainda não divulgada · o Prumo usa 90 dias até você marcar', dica: 'Marque também a prova da escola: ela vem antes e deixa o plano mais útil.' },
  { valor: 'provao', rotulo: 'Provão Paulista' },
  { valor: 'vestibular', rotulo: 'Outro vestibular' },
  { valor: 'naosei', rotulo: 'Ainda não sei', aviso: 'Sem data, o Prumo usa um horizonte de 90 dias.' },
];
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
/** "amanhã, qui 19/11" · "segunda, 23/11" */
const dataRevisao = (x, d) => (R.diff(d, x) === 1 ? `amanhã, ${R.fmtCurta(x)}` : R.diff(d, x) === 0 ? 'hoje' : `${R.SEMANA_LONGA[R.diaDaSemana(x)]}, ${R.fmtDiaMes(x)}`);
const nDe = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const listaCaps = ns => (ns.length === 1 ? `Cap. ${ns[0]}` : `Caps. ${ns.slice(0, -1).join(', ')} e ${ns[ns.length - 1]}`);

export function textoAlarme(dias, horario) {
  return `Prumo · ${Plano.textoDias(dias || [])}${horario ? ' · ' + horario : ''}`;
}

export class Nucleo {
  /** @param {{ pack: object|Pack, storage?: Storage|null }} op */
  constructor({ pack, storage } = {}) {
    this.pack = pack instanceof Pack ? pack : new Pack(pack);
    this.M = criarMotor(this.pack.indiceMotor());
    this.storage = storage === undefined ? (() => { try { return globalThis.localStorage || null; } catch (e) { return null; } })() : storage;
    this.st = E.vazio();
    this.falhaSalvar = null;
    this.problemaCarga = null;
    const self = this;
    this.missao = new Missao({ get st() { return self.st; }, pack: this.pack, M: this.M, persistir: () => self.persistir(), salvarNota: x => self._salvarNota(x) });
  }

  /* =========================================================
     Ciclo de vida e eventos
     ========================================================= */
  /** Lê o estado salvo, aplica o relógio da demonstração e faz a Abertura (b.2). Devolve tela(). */
  abrir() {
    const r = E.carregar(this.storage);
    this.problemaCarga = r.problema;
    if (r.st) this.missao.substituir(r.st);
    R.setOffset(this.st.config.demo.ativo ? this.st.config.demo.offset : 0);
    this.missao.abrir();
    return this.tela();
  }
  persistir() {
    const r = E.salvar(this.st, this.storage);
    this.falhaSalvar = r.ok ? null : r;
    return r;
  }
  /** Envia um evento à máquina de estados. Devolve true se houve transição. */
  despachar(evento) { return this.missao.despachar(evento); }
  /** Confere a data (chamar ao voltar para o app e perto da meia-noite). */
  conferirData() { return this.missao.despachar({ tipo: 'DATA_MUDOU' }); }
  estado() { return this.missao.estadoAtual(); }
  /** A tela a desenhar agora: { nome, vm, faixas }. */
  tela() {
    const nome = this.estado();
    let vm;
    if (nome === 'primeiroUso') vm = this.primeiroUso();
    else if (nome === 'hoje' || nome === 'feito') vm = this.hoje();
    else if (nome === 'encerramento') vm = this.prontoPorHoje();
    else if (nome.startsWith('prova')) vm = this.prova();
    else vm = this.passoAtual();
    return { nome, vm, faixas: this.faixas() };
  }
  faixas() {
    const dm = this.st.config.demo;
    return {
      demo: dm.ativo ? { texto: dm.exemplo ? 'Modo demonstração · dados de exemplo' : 'Modo demonstração', dataSimulada: dm.offset ? `data simulada ${R.fmtDiaMes(R.hoje())}` : null, sair: 'Sair' } : null,
      falhaSalvar: this.falhaSalvar ? { texto: E.MSG_FALHA_SALVAR, acao: 'Salvar uma cópia' } : null,
      carga: this.problemaCarga && this.problemaCarga !== 'armazenamento indisponível' ? 'O progresso salvo neste aparelho não pôde ser lido. Restaure uma cópia, se tiver.' : null,
    };
  }

  /* =========================================================
     Primeiro uso
     ========================================================= */
  primeiroUso() {
    return {
      restaurar: { rotulo: 'Já usei o Prumo · restaurar uma cópia' },
      exemplo: { rotulo: 'Ver com dados de exemplo' },
      provas: TIPOS_PROVA,
      dias: { padrao: [1, 2, 3, 4], min: 3, max: 5, opcoes: [1, 2, 3, 4, 5, 6, 0].map(v => ({ valor: v, rotulo: Plano.NOMES_DIAS[v] })) },
      minutos: { padrao: 25, opcoes: [15, 25, 40] },
      som: { padrao: false, pergunta: 'Quer som?' },
      metaSugerida: dias => Math.max(1, (dias || []).length - 1),
      alarme: (dias, horario) => ({ texto: `Quer um lembrete? Crie um alarme no app Relógio: ${textoAlarme(dias, horario)}. O Prumo não manda notificação.`, rotulo: textoAlarme(dias, horario) }),
      fecho: 'Seus dados ficam só neste aparelho. Instale o Prumo na tela inicial (iPhone e Android) e salve uma cópia de vez em quando.',
      instalar: { iphone: 'iPhone: Compartilhar → "Adicionar à Tela de Início".', android: 'Android: menu ⋮ → "Instalar app" ou "Adicionar à tela inicial".' },
      evento: 'CONCLUIR',
    };
  }
  /** Conclui o Primeiro uso. perfil: { provaTipo, prova|null, dias:[1..], minutos, metaSemana?, horario?, som?, alarme? } */
  concluirPrimeiroUso(perfil) {
    const p = Object.assign({}, perfil);
    if (p.metaSemana === undefined) p.metaSemana = Math.max(1, (p.dias || [1, 2, 3, 4]).length - 1);
    return this.despachar({ tipo: 'CONCLUIR', perfil: p });
  }

  /* =========================================================
     Hoje (c.2)
     ========================================================= */
  _nomeCap(id) { const c = this.pack.capitulo(id); return c ? `Cap. ${c.n}` : ''; }
  _tituloCap(id) { const c = this.pack.capitulo(id); return c ? `Cap. ${c.n} · ${c.titulo}` : ''; }
  _paginasDe(passos) {
    const ns = [...new Set(passos.filter(p => p.pagina && (p.t === 'leitura' || p.t === 'pre' || p.t === 'checagem')).map(p => this.pack.pagina(p.pagina).n))].sort((a, b) => a - b);
    return ns.length ? (ns.length === 1 ? `p. ${ns[0]}` : `p. ${ns[0]}–${ns[ns.length - 1]}`) : '';
  }
  _verPassos(passos) {
    const out = [], pk = this.pack;
    for (let i = 0; i < passos.length; i++) {
      const p = passos[i], n = i + 1;
      if (p.t === 'questao' && p.papel === 'aplicar' && !p.antecipada && !p.inserido) {
        let j = i; while (j + 1 < passos.length && passos[j + 1].t === 'questao' && passos[j + 1].papel === 'aplicar' && passos[j + 1].r === p.r && !passos[j + 1].antecipada) j++;
        const grupo = passos.slice(i, j + 1), q = grupo.length, todosEnem = grupo.every(x => x.origem === 'enem');
        out.push({ n: q > 1 ? `${n} a ${j + 1}` : `${n}`, texto: `Até ${q} ${todosEnem ? (q === 1 ? 'questão do Enem' : 'questões do Enem') : (q === 1 ? 'questão de aplicar' : 'questões de aplicar (do Enem ou da equipe)')}`, nota: 'a rodada pode fechar antes; um erro traz uma questão da equipe', pagina: '' });
        i = j; continue;
      }
      if (p.t === 'questao' && p.antecipada) {
        let j = i; while (j + 1 < passos.length && passos[j + 1].antecipada && passos[j + 1].r === p.r) j++;
        out.push({ n: j > i ? `${n} a ${j + 1}` : `${n}`, texto: `Revisão antecipada do ${this._nomeCap(p.cap)} · ${nDe(j - i + 1, 'questão', 'questões')}`, nota: 'não sobe nível', pagina: '' });
        i = j; continue;
      }
      const pg = p.pagina ? `p. ${pk.pagina(p.pagina).n}` : '';
      let texto;
      if (p.t === 'pre') texto = p.alvo === 'bloco' ? `Pergunta antes do § ${pk.localDoBloco(p.bloco).n}` : 'Pergunta antes de ler';
      else if (p.t === 'leitura') texto = `Leitura ${pk.faixaDeBlocos(p.blocos)}`;
      else if (p.t === 'checagem') texto = 'Confira';
      else if (p.t === 'questao') texto = 'Questão da equipe';
      else if (p.t === 'revisao') texto = `Revisão do ${this._nomeCap(p.cap)}`;
      else if (p.t === 'dia') texto = `Questão do dia · ${this._nomeCap(p.cap)}`;
      else if (p.t === 'cards') texto = `Cards · ${nDe(p.ids.length, 'card', 'cards')} · ≈ ${Cards.minutosDaMao(p.ids.length)} min`;
      out.push({ n: `${n}`, texto, pagina: pg });
    }
    return out;
  }
  _composicao(m) {
    const ps = m.passos, partes = [];
    const pgs = new Set(ps.filter(p => p.t === 'leitura').map(p => p.pagina)).size;
    if (pgs) partes.push(nDe(pgs, 'página', 'páginas'));
    const ap = ps.filter(p => p.t === 'questao' && p.papel === 'aplicar' && !p.antecipada);
    if (ap.length) partes.push(`até ${ap.length} ${ap.every(p => p.origem === 'enem') ? (ap.length === 1 ? 'questão do Enem' : 'questões do Enem') : (ap.length === 1 ? 'questão de aplicar' : 'questões de aplicar')}`);
    const ant = ps.filter(p => p.antecipada).length;
    if (ant) partes.push(`revisão antecipada · ${nDe(ant, 'questão', 'questões')}`);
    const rv = ps.filter(p => p.t === 'revisao').length;
    if (rv) partes.push(nDe(rv, 'revisão', 'revisões'));
    const dia = ps.filter(p => p.t === 'dia').length;
    if (dia) partes.push(nDe(dia, 'questão do dia', 'questões do dia'));
    const cd = ps.find(p => p.t === 'cards');
    if (cd) partes.push(nDe(cd.ids.length, 'card', 'cards'));
    return partes.join(' · ');
  }
  _titulo(m) {
    if (m.tipo === 'novo' || m.tipo === 'pratica') return this._tituloCap(m.cap);
    if (m.tipo === 'antecipada') return `Revisão antecipada · ${this._nomeCap(m.cap)}`;
    if (m.tipo === 'questaoDoDia') return 'Questão do dia';
    const revs = m.passos.filter(p => p.t === 'revisao');
    if (revs.length) return `${revs.length === 1 ? 'Revisão' : 'Revisões'} · ${listaCaps(revs.map(p => this.pack.capitulo(p.cap).n))}`;
    if (m.tipo === 'prereq') return `Revisão antecipada · ${this._nomeCap(m.cap)}`;
    return 'Missão de hoje';
  }
  _ganho(m) {
    const st = this.st;
    if (m.tipo === 'novo' || m.tipo === 'pratica') {
      const rods = m.passos.filter(p => p.r === `r:${m.cap}`);
      return regraDaFila(rods, m.cap, `o ${this._nomeCap(m.cap)}`).ganho;
    }
    if (m.tipo === 'antecipada' || (m.tipo === 'prereq' && m.passos.some(p => p.antecipada))) return 'Revisão antecipada: o nível só sobe na revisão do dia certo. Se a sequência não fechar, a revisão passa para amanhã.';
    if (m.tipo === 'questaoDoDia') return 'A Questão do dia não muda nível nem agenda: é dia de manter.';
    const revs = m.passos.filter(p => p.t === 'revisao');
    if (revs.length === 1) {
      const t = st.topicos[revs[0].cap] || {}, max = st.config.nivelMaximo || 5;
      const para = Math.min(max, (t.caixa || 0) + 1);
      return para > (t.caixa || 0) ? `Acerte a revisão na primeira resposta: o ${this._nomeCap(revs[0].cap)} sobe para ${NIVEL[para]}.` : `Acerte a revisão na primeira resposta: o ${this._nomeCap(revs[0].cap)} continua em ${NIVEL[t.caixa]}, com a próxima revisão mais longe.`;
    }
    if (revs.length > 1) return 'Cada revisão certa na primeira resposta sobe o capítulo um nível.';
    return '';
  }
  _proximoDia(d) {
    const st = this.st, prox = Plano.proximoDiaDeEstudo(st, d);
    if (!prox) return null;
    const mm = montarMissao(st, this.pack, this.M, prox);
    const revs = mm.passos.filter(p => p.t === 'revisao');
    let o;
    if (mm.tipo === 'novo') o = `${this._tituloCap(mm.cap)} (novo)${revs.length ? ' + ' + (revs.length === 1 ? 'revisão do ' + this._nomeCap(revs[0].cap) : 'revisões dos ' + listaCaps(revs.map(p => this.pack.capitulo(p.cap).n))) : ''}`;
    else if (mm.tipo === 'pratica') o = `${this._tituloCap(mm.cap)}, continuação`;
    else if (mm.tipo === 'antecipada') o = `revisão antecipada do ${this._nomeCap(mm.cap)}`;
    else if (mm.tipo === 'questaoDoDia') o = 'Questão do dia';
    else if (revs.length) o = revs.length === 1 ? `revisão do ${this._nomeCap(revs[0].cap)}` : `revisões dos ${listaCaps(revs.map(p => this.pack.capitulo(p.cap).n))}`;
    else o = 'missão do dia';
    const quando = R.diff(d, prox) === 1 ? 'Amanhã' : `Na ${R.SEMANA_LONGA[R.diaDaSemana(prox)]}`.replace('Na sábado', 'No sábado').replace('Na domingo', 'No domingo');
    const ad = revs.find(p => p.antesDepois);
    const gancho = ad ? `${quando} você vê se acertou a pergunta de entrada da p. ${this.pack.pagina(ad.antesDepois.split('#')[0] && this.pack.modelo(ad.antesDepois.split('#')[0]).pagina).n}.` : null;
    let porque = null;
    if (revs.length) {
      const t = st.topicos[revs[0].cap], iv = Plano.intervalos(st, d);
      if (t && t.caixa) {
        porque = `Em ${NIVEL[t.caixa]}, a revisão vence em ${nDe(iv[t.caixa], 'dia', 'dias')}`;
        porque += t.proxima < prox ? `; ${R.SEMANA_LONGA[R.diaDaSemana(t.proxima)]} é folga, então ela entra na ${R.SEMANA_LONGA[R.diaDaSemana(prox)]}.` : '.';
      }
    } else if (mm.tipo === 'novo') porque = `É o próximo capítulo liberado pela ordem do caderno (regra ${mm.regra}).`;
    else if (mm.tipo === 'questaoDoDia') porque = 'Nada vence nesse dia: a missão é a Questão do dia.';
    return { dia: prox, data: R.fmtDiaSemana(prox), texto: `${R.fmtDiaSemana(prox)} · ${o}`, gancho, porque, regra: mm.regra };
  }
  hoje() {
    const st = this.st, m = st.missao, d = R.hoje();
    if (!st.perfil || !m) return null;
    const cons = Plano.constancia(st, d);
    const vm = {
      data: R.fmtCabecalho(d), dia: d,
      constancia: { simbolo: cons.simbolo, diasEstudados: cons.diasEstudados, rotulo: cons.rotulo, miniRegua: cons.miniRegua, chama: { acesa: cons.chama.acesa, acesas: cons.chama.acesas } },
      faixa: m.faixa, estado: null, texto: null, bloco: null, acao: null, links: [], prova: null, feito: null, porQue: null,
    };
    const temPassos = m.passos.length > 0;
    const firme = this.M.topicosAtivos(st).every(id => (st.topicos[id] || {}).caixa >= Math.min(3, st.config.nivelMaximo || 5));
    if (m.tipo === 'pausa') { vm.estado = 'pausa'; vm.texto = `Pausa até ${R.fmtDiaMes(st.pausa.ate)}. Nada vence por isso.`; vm.acao = { evento: 'ENCERRAR_PAUSA', rotulo: 'Encerrar pausa' }; }
    else if (m.fechada) {
      vm.estado = m.parcial ? 'encerradoAntes' : 'feito';
      vm.texto = m.parcial ? `Hoje você encerrou no passo ${m.encerradoNoPasso} de ${m.passos.length}. O resto vai para o próximo dia de estudo.` : 'Hoje está feito.';
      const prox = this._proximoDia(d);
      vm.feito = prox ? { previa: prox.gancho ? `${prox.data} · ${prox.gancho.replace(/^(Amanhã|Na \S+|No \S+) /, '')}` : prox.texto, proxima: prox } : null;
      vm.links = [{ rotulo: 'Abrir o caderno', aba: 'caderno' }];
    } else if (m.iniciada) {
      vm.estado = 'emCurso';
      vm.acao = { evento: 'CONTINUAR', rotulo: `Continuar · passo ${m.i + 1} de ${m.passos.length} (até a meia-noite)` };
    } else if (m.tipo === 'folga') {
      vm.estado = 'folga'; vm.texto = 'Hoje é folga. Nada vence por isso.';
      vm.acao = { evento: 'ESTUDAR_MESMO_ASSIM', rotulo: 'Estudar mesmo assim', nota: 'Conta como dia estudado; não conta para a meta da semana.' };
    } else if (m.hojeNao) {
      vm.estado = 'hojeNao'; vm.texto = 'Hoje não. As revisões de hoje passam para o próximo dia de estudo.';
      vm.acao = { evento: 'COMECAR', rotulo: 'Começar mesmo assim' };
    } else {
      vm.estado = m.provaPassou ? 'provaPassou' : m.reta ? 'reta' : m.retorno ? 'retorno' : m.tipo === 'questaoDoDia' ? (firme && this.M.topicosAtivos(st).length ? 'firme' : 'questaoDoDia') : (!Object.keys(st.dias).length && !st.historico.length ? 'primeiroDia' : 'missao');
      vm.acao = temPassos ? { evento: 'COMECAR', rotulo: 'Começar' } : null;
      if (vm.estado === 'provaPassou') vm.texto = `A prova de ${R.fmtDiaMes(st.perfil.prova)} passou. Quer marcar a próxima? Sem data, o Prumo usa 90 dias.`;
      else if (vm.estado === 'reta') vm.texto = m.frase;
      else if (vm.estado === 'retorno') vm.texto = `${m.boasVindas ? 'Bem-vindo de volta. ' : ''}${nDe(m.venc.length, 'revisão passou', 'revisões passaram')} para hoje; a missão de hoje tem só revisões.`;
      else if (vm.estado === 'firme') vm.texto = `${this.pack.titulo} está firme. As revisões continuam quando vencerem.`;
      else if (vm.estado === 'questaoDoDia') vm.texto = `Questão do dia · ${nDe(m.passos.filter(p => p.t === 'dia').length, 'questão', 'questões')} dos capítulos que você já abriu · ≈ ${m.minutos} min`;
      else if (m.boasVindas) vm.texto = 'Bem-vindo de volta.';
      if (vm.estado === 'provaPassou') vm.links.push({ rotulo: 'Marcar data', aba: 'plano' });
    }
    if (temPassos && !m.fechada && m.tipo !== 'pausa' && m.tipo !== 'folga') {
      const atrasadas = m.passos.filter(p => p.t === 'revisao' && p.atrasada).length;
      vm.bloco = {
        rotulo: vm.estado === 'primeiroDia' ? 'Missão 1' : null,
        titulo: this._titulo(m),
        linhaFina: `${[this._paginasDe(m.passos), `≈ ${m.minutos} min`].filter(Boolean).join(' · ')} · termina em "Pronto por hoje"`,
        composicao: this._composicao(m),
        atrasada: atrasadas ? (atrasadas === 1 ? '1 revisão atrasada vem primeiro.' : `${atrasadas} revisões atrasadas vêm primeiro.`) : null,
        ganho: this._ganho(m),
        esmaecido: !!m.hojeNao,
        passos: this._verPassos(m.passos),
        totalPassos: m.passos.length,
      };
      if (!m.iniciada) vm.links = [{ rotulo: 'ver passos' }, { rotulo: 'Por que esta missão?' }, ...(m.hojeNao ? [] : [{ evento: 'HOJE_NAO', rotulo: 'Hoje não' }]), ...vm.links];
    }
    if (Prova.provaOferecida(st, this.pack, this.M, m)) {
      vm.prova = { titulo: 'Prova do caderno liberada', texto: `até ${P.chefe.teto} questões · cerca de ${P.chefe.teto * 3} min, mais longa que a sua missão normal`, regra: Prova.regraProva(this.pack), acao: { evento: 'FAZER_PROVA', rotulo: 'ver a regra' } };
    }
    if (m.boasVindas && st.perfil.porque && !m.fechada) vm.porqueEstudo = `Por que eu estudo: ${st.perfil.porque}`;   // d.3
    vm.porQue = this.porQue();
    return vm;
  }
  /** Folha "Por que esta missão?": a frase simples e, em "ver a regra", a trilha da árvore. */
  porQue() {
    const m = this.st.missao;
    if (!m) return null;
    const v = verARegra(this.st, this.pack, this.M, m, R.hoje());
    return { frase: m.frase, regra: m.regra, verARegra: v };
  }

  /* =========================================================
     Missão: passo atual (c.3)
     ========================================================= */
  _itemVM(item) {
    return {
      id: item.id, origem: item.origem, rotulo: item.rotulo,
      enunciado: item.origem === 'enem' ? item.contexto : item.enunciado, introducao: item.introducao || '',
      imagens: item.imagens || [], dados: item.dados || null, figura: item.figura || null,
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem || null })),
      rodape: item.rodape, licencaUrl: item.licencaUrl,
      imagemFalhou: 'A imagem não carregou; a descrição está abaixo.',
    };
  }
  _rotulos(p, item) {
    const pk = this.pack;
    if (p.t === 'pre') {
      const pg = pk.pagina(p.pagina);
      if (p.alvo === 'bloco') { const n = pk.localDoBloco(p.bloco).n; return { tipo: 'preBloco', rotulo: `ANTES DO § ${n}`, sub: null, aviso: `Tente antes de ler. O § ${n} responde.` }; }
      return { tipo: 'pre', rotulo: `ANTES DE LER · P. ${pg.n}`, sub: null, aviso: 'Tente antes de ler. Esta página responde.' };
    }
    if (p.t === 'checagem') return { tipo: 'checagem', rotulo: `CONFIRA · P. ${pk.pagina(p.pagina).n}`, sub: null };
    if (p.t === 'revisao') return { tipo: 'revisao', rotulo: `REVISÃO · CAP. ${pk.capitulo(p.cap).n}`, sub: 'Vale a primeira resposta.' };
    if (p.t === 'dia') return { tipo: 'dia', rotulo: 'QUESTÃO DO DIA', sub: 'Não muda nível nem agenda.' };
    if (p.antecipada) return { tipo: 'antecipada', rotulo: 'REVISÃO ANTECIPADA', sub: `${this._nomeCap(p.cap)} · não sobe nível` };
    return item.origem === 'enem' ? { tipo: 'enem', rotulo: 'QUESTÃO DO ENEM', sub: item.rotulo } : { tipo: 'equipe', rotulo: 'QUESTÃO DA EQUIPE', sub: 'Texto e números da equipe Prumo · CC BY-SA 4.0' };
  }
  _medidor(p) {
    const m = this.st.missao;
    if (!p || !p.r || !p.papel || p.t === 'pre') return null;
    const rod = m.rodada && m.rodada.chave === p.r ? m.rodada : null;
    const regra = regraDaFila(m.passos.filter(x => x.r === p.r), p.cap);
    const corrida = rod ? rod.corrida : [];
    const ia = corrida.findIndex(x => x.papel === 'aplicar');
    const rotuloDe = x => (x.t === 'checagem' ? 'checagem' : x.origem === 'enem' ? 'Enem' : 'equipe');
    const casa2 = ia >= 0 ? { cheia: true, rotulo: rotuloDe(corrida[ia]) } : { cheia: false, rotulo: regra.todosEnem ? 'Enem' : 'aplicar' };
    const outros = corrida.filter((x, i) => i !== ia);
    const casa1 = outros.length ? { cheia: true, rotulo: rotuloDe(outros[outros.length - 1]) } : { cheia: false, rotulo: 'acerto seguido' };
    let texto = null;
    if (rod && rod.ultimoErro) texto = 'a contagem recomeça';
    else if (casa1.cheia && !casa2.cheia) texto = regra.falta;
    else if (!casa1.cheia && casa2.cheia) texto = 'Falta mais um acerto seguido';
    return { casas: [casa1, casa2], texto, regra: `${regra.frase}. ${regra.insercao}` };
  }
  _topo(p, etapa) {
    const m = this.st.missao, total = m.passos.length;
    const primeiroDaRodada = p && p.r ? m.passos.findIndex(x => x.r === p.r) === m.i : false;
    const regra = p && p.r && p.papel !== undefined ? regraDaFila(m.passos.filter(x => x.r === p.r), p.cap) : (p && p.r ? regraDaFila(m.passos.filter(x => x.r === p.r), p.cap) : null);
    return {
      etapa, encerrar: 'Encerrar',
      passo: { n: m.i + 1, total }, progresso: total ? m.i / total : 0,
      medidor: this._medidor(p),
      regra: regra ? { texto: `${regra.frase}. ${regra.insercao}`, mostrarAgora: primeiroDaRodada, rotulo: 'ver a regra' } : null,
    };
  }
  passoAtual() {
    const st = this.st, m = st.missao, pk = this.pack, nome = this.estado();
    if (!m || !DENTRO.has(nome)) return null;
    const p = m.passos[m.i];
    if (nome === 'feedback' || nome === 'trecho') {
      const fb = this.feedback();
      return nome === 'trecho' ? Object.assign({ estado: 'trecho' }, this._trecho(m.ultima.paragrafo), { feedback: fb, acao: { evento: 'VOLTAR', rotulo: 'Voltar ao resultado' } }) : fb;
    }
    if (nome === 'fimDaRodada') return this.fimDaRodada();
    if (nome === 'cards' || nome === 'trechoCard' || nome === 'fimDaMao') return this.mao();
    if (nome === 'leitura') {
      const pg = pk.pagina(p.pagina), cap = pk.capitulo(p.cap);
      const ant = m.passos[m.i - 1], prox = m.passos[m.i + 1];
      let faixa = null;
      if (ant && ant.t === 'pre') {
        const segunda = ant.alvo === 'nucleo' && cap.paginas.findIndex(x => x.id === ant.pagina) === 1 && String(ant.id).endsWith('#0');
        faixa = segunda ? 'Resposta guardada. Na primeira revisão do capítulo você vê se acertou.' : 'Resposta guardada.';
      }
      const temPergunta = m.passos.slice(m.i + 1).some(x => x.t !== 'leitura' && x.t !== 'cards');
      return {
        estado: 'leitura', topo: this._topo(p, `Leitura · p. ${pg.n}`),
        cabeco: `${MATERIAS[pk.materia] || pk.materia} · ${pk.titulo} · Cap. ${cap.n}`,
        pagina: { id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}` },
        blocos: p.blocos.map(b => this._blocoVM(pk.bloco(b))),
        faixa,
        jaSei: temPergunta ? { evento: 'JA_SEI', rotulo: 'Já sei isto · ir para a próxima pergunta' } : null,
        botao: { evento: 'TERMINEI_TRECHO', rotulo: prox && prox.t === 'pre' && prox.alvo === 'bloco' ? `Continuar: pergunta antes do § ${pk.localDoBloco(prox.bloco).n}` : 'Terminei de ler' },
        nota: p.fimDaPagina && pg.notaPrompt ? { prompt: pg.notaPrompt, texto: ((st.notas || []).find(n => n.pagina === pg.id) || {}).texto || '', evento: 'SALVAR_NOTA' } : null,
      };
    }
    // pergunta
    const item = pk.item(p.id), r = this._rotulos(p, item);
    const primeiraChecagem = p.t === 'checagem' && !Object.values(st.topicos).some(t => (t.tentativas || []).some(x => x.tipo === 'checagem'));
    const etapa = p.t === 'pre' ? `Pergunta · p. ${pk.pagina(p.pagina).n}` : p.t === 'checagem' ? `Confira · p. ${pk.pagina(p.pagina).n}` : p.t === 'revisao' ? `Revisão · ${this._nomeCap(p.cap)}` : p.t === 'dia' ? 'Questão do dia' : r.tipo === 'enem' ? 'Questão do Enem' : r.tipo === 'antecipada' ? 'Revisão antecipada' : 'Questão da equipe';
    return {
      estado: 'pergunta', tipo: r.tipo, rotulo: r.rotulo, subrotulo: r.sub, aviso: r.aviso || null,
      avisoPrimeiraChecagem: primeiraChecagem ? 'Isso fica só no seu celular. Ninguém da escola vê.' : null,
      inserida: !!p.inserido,
      // Pilar III (b.3): a questão inserida depois do erro é anunciada no topo, com o trecho do erro
      avisoInserida: p.inserido ? `Depois do erro: uma questão da equipe sobre ${p.sobre && pk.local(p.sobre) ? `a ${pk.local(p.sobre).rotulo}` : 'o mesmo trecho'}.` : null,
      item: this._itemVM(item), topo: this._topo(p, etapa),
      acao: { evento: 'RESPONDER', rotulo: 'Responder', exige: 'alt' },
    };
  }
  _blocoVM(b) {
    const pk = this.pack, notas = this.st.notas || [];
    return { id: b.id, paragrafos: (b.paragrafos || []).map(par => ({ id: par.id, n: pk.local(par.id).n, html: par.html, figura: par.figura || null, notas: notas.filter(n => n.paragrafo === par.id).map(n => ({ id: n.id, texto: n.texto, dia: R.fmtDiaMes(n.dia) })) })) };
  }
  _trecho(parId) {
    const pk = this.pack, loc = pk.local(parId);
    if (!loc) return null;
    const pg = pk.pagina(loc.pagina), cap = pk.capitulo(loc.cap);
    return { cabeco: `${MATERIAS[pk.materia] || pk.materia} · ${pk.titulo} · Cap. ${cap.n}`, pagina: { id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}` }, blocos: pg.blocos.map(b => this._blocoVM(b)), ancora: parId, rotulo: loc.rotulo };
  }
  /** Feedback (c.3e/c.3h): a questão continua na tela com "sua" e "certa", o que faltou e o trecho. */
  feedback() {
    const st = this.st, m = st.missao, pk = this.pack, u = m && m.ultima;
    if (!u) return null;
    const item = pk.item(u.item), p = m.passos[u.passo] || {}, ok = u.res === 'ok', d = R.hoje();
    const alt = item.alternativas.find(a => a.letra === u.alt) || {};
    const r = this._rotulos(p, item);
    const loc = u.paragrafo ? pk.local(u.paragrafo) : null;
    const vm = {
      estado: 'feedback', tipo: r.tipo, rotulo: r.rotulo, subrotulo: r.sub, certa: ok,
      titulo: ok ? 'Certa.' : `Você marcou ${u.alt}. A certa é ${item.gabarito}.`,
      porque: ok ? (item.explicacao || null) : null,
      falta: ok ? null : (alt.falta || null),
      item: this._itemVM(item),
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem || null, marca: a.letra === u.alt && a.certa ? 'sua-certa' : a.letra === u.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: loc ? { evento: 'VOLTAR_AO_TRECHO', rotulo: `Voltar ao trecho · ${loc.rotulo}` } : null,
      resolucao: { evento: 'VER_RESOLUCAO', rotulo: 'Ver a resolução da equipe', aberta: !!m.resolucaoAberta, texto: item.explicacao || '' },
      proxima: u.inserida && !u.inserida.cancelada ? `A próxima é uma questão da equipe sobre a ${u.inserida.rotulo}.` : null,
      revisao: null, fimRodada: null,
      medidor: p.r && p.papel ? this._medidorDepois(u, p) : null,
      continuar: { evento: 'CONTINUAR', rotulo: 'Continuar', texto: 'Leia a explicação', pausaMs: this.M.pausa(item), liberaEm: (m.feedbackEm || 0) + this.M.pausa(item), restanteMs: Math.max(0, (m.feedbackEm || 0) + this.M.pausa(item) - R.agora()) },
      som: ok ? 'acerto' : 'erro',
      topo: this._topo(p, r.tipo === 'revisao' ? `Revisão · ${this._nomeCap(p.cap)}` : 'Resultado'),
    };
    if (u.revisao) {
      const fr = u.revisao, cn = this._nomeCap(p.cap);
      if (fr.venceu) {
        vm.revisao = { texto: fr.caixaDepois > fr.caixaAntes ? `Certa. O ${cn} sobe para ${NIVEL[fr.caixaDepois]}. Próxima revisão: ${R.fmtCurta(fr.proxima)}.` : `Certa. O ${cn} continua em ${NIVEL[fr.caixaDepois]}${st.config.nivelMaximo < 5 && fr.caixaDepois >= st.config.nivelMaximo ? ' (na demo, o nível vai até Firme)' : ''}. Próxima revisão: ${R.fmtCurta(fr.proxima)}.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: fr.caixaDepois > fr.caixaAntes } };
        vm.titulo = vm.revisao.texto; vm.som = fr.caixaDepois > fr.caixaAntes ? 'nivel' : 'acerto';
      } else {
        vm.revisao = { texto: `O ${cn} ${fr.caixaAntes > 1 ? 'volta para' : 'continua em'} Aprendendo: a próxima revisão fica para ${dataRevisao(fr.proxima, d)}. Seu histórico continua.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: false } };
        vm.som = null;   // nível que desce: sem animação e sem som
      }
      if (fr.antesDepois) {
        const a = fr.antesDepois, quando = R.diff(a.antesDia, d) === 1 ? 'Ontem' : `Em ${R.fmtCurta(a.antesDia)}`;
        vm.revisao.antesDepois = fr.venceu ? `${quando}, antes de ler, você marcou ${a.antes}. Hoje: ${a.hoje}, certa.` : `${quando}, antes de ler, você marcou ${a.antes}. Hoje: ${a.hoje}. A certa é ${a.certa}.`;
      }
    }
    if (u.fimRodada) {
      const fr = m.fimRodada || (m.resumo.rodadas[m.resumo.rodadas.length - 1]);
      if (fr) vm.fimRodada = { venceu: fr.venceu, texto: this._textoFimRodada(fr).texto, direto: !this.missao.restaPasso() };
      if (fr && fr.venceu && !fr.extra) vm.som = 'nivel';
    }
    return vm;
  }
  _medidorDepois(u, p) {
    const md = this._medidor(p);
    if (!md) return null;
    if (u.res === 'erro') md.texto = 'a contagem recomeça';
    if (u.fimRodada) { const fr = this.st.missao.fimRodada || this.st.missao.resumo.rodadas.slice(-1)[0]; if (fr && fr.venceu) { md.casas = md.casas.map(c => Object.assign({}, c, { cheia: true })); md.texto = null; } }
    return md;
  }
  _textoFimRodada(fr) {
    const pk = this.pack, c = pk.capitulo(fr.cap), d = R.hoje();
    if (fr.extra) return { variante: fr.venceu ? 'venceu' : 'teto', texto: fr.venceu ? `Revisão antecipada vencida. O nível do Cap. ${c.n} só sobe na revisão do dia certo (${R.fmtCurta(fr.proxima)}).` : `A revisão antecipada mostrou que o Cap. ${c.n} está escapando: a revisão dele passou para amanhã, ${R.fmtCurta(fr.proxima)}.` };
    if (fr.venceu) return { variante: 'venceu', texto: `${c.titulo} entrou em ${NIVEL[fr.caixaDepois]}. Revisão: ${dataRevisao(fr.proxima, d)}.` };
    if (fr.redireciona) return { variante: 'tetoPrereq', texto: `A prática vai para o Cap. ${pk.capitulo(fr.redireciona).n}, que é a base deste.` };
    const pe = paginasComErro(this.st, pk, fr.cap);
    const pg = c.paginas[pe.principal];
    const par = this._paragrafoMaisErrado(fr.cap);
    const onde = par ? pk.local(par).rotulo : `p. ${pg.n}`;
    if (fr.naoFecha) return { variante: 'naoFecha', texto: `Com o que resta hoje, a rodada não fecha. As questões que sobraram ficam guardadas. Na próxima missão: ${onde}.` };
    return { variante: 'teto', texto: `Rodada encerrada em ${fr.tentativas} tentativas. Nada se perde. Na próxima missão: ${onde}.` };
  }
  _paragrafoMaisErrado(capId) {
    const cont = {};
    for (const x of (this.st.topicos[capId] || {}).tentativas || []) {
      if (x.res !== 'erro' || !this.pack.existe(x.item)) continue;
      const a = this.pack.item(x.item).alternativas.find(y => y.letra === x.alt);
      if (a && a.paragrafo) cont[a.paragrafo] = (cont[a.paragrafo] || 0) + 1;
    }
    return Object.keys(cont).sort((a, b) => cont[b] - cont[a] || (a < b ? -1 : 1))[0] || null;
  }
  fimDaRodada() {
    const m = this.st.missao, fr = m.fimRodada;
    if (!fr) return null;
    const t = this._textoFimRodada(fr);
    return {
      estado: 'fimDaRodada', variante: t.variante, texto: t.texto,
      nivel: { de: fr.caixaAntes, para: fr.caixaDepois, nome: NIVEL[fr.caixaDepois], animar: !!fr.venceu && !fr.extra && fr.caixaDepois > fr.caixaAntes },
      som: fr.venceu && !fr.extra ? 'nivel' : null,
      cards: fr.cardsRecebidos ? `Os ${fr.cardsRecebidos} cards do Cap. ${this.pack.capitulo(fr.cap).n} entraram no seu baralho.` : null,
      acao: { evento: 'SEGUIR', rotulo: 'Seguir' },
      topo: this._topo(m.passos[m.i], 'Fim da rodada'),
    };
  }
  /** Mão de cards (Decisão 1): frente → Virar → verso → Lembrei / Ainda não. */
  mao() {
    const st = this.st, m = st.missao, mao = m.mao, nome = this.estado(), pk = this.pack;
    if (!mao) return null;
    if (nome === 'fimDaMao') return { estado: 'fimDaMao', resumo: (m.resumo.cards || {}).texto || '', acao: { evento: 'SEGUIR', rotulo: 'Seguir' }, topo: this._topo(m.passos[m.i], 'Cards') };
    const id = mao.pendente ? mao.pendente.id : Cards.cardAtual(mao);
    const k = pk.card(id), loc = pk.localDoCard(k), e = st.cards[id] || {};
    const trecho = loc ? { rotulo: `ver o trecho · ${loc.rotulo}`, evento: 'VER_TRECHO', pagina: loc.pagina, paragrafo: loc.paragrafo } : null;
    if (nome === 'trechoCard') return Object.assign({ estado: 'trechoCard' }, this._trecho(loc.paragrafo), { acao: { evento: 'VOLTAR', rotulo: 'Voltar ao card' } });
    const repeticao = mao.respostas[id] !== undefined && !mao.pendente;
    return {
      estado: 'cards', id, frente: k.frente, verso: k.verso, virado: !!mao.virado,
      caixa: { n: e.caixa, nome: NIVEL[e.caixa] }, repeticao, rotulo: repeticao ? 'CARD · DE VOLTA' : 'CARD',
      posicao: `${Math.min(mao.i + 1, mao.fila.length)} de ${mao.fila.length}`,
      acoes: mao.pendente ? [{ evento: 'SEGUIR', rotulo: 'Próximo card' }] : mao.virado ? [{ evento: 'LEMBREI', rotulo: 'Lembrei' }, { evento: 'AINDA_NAO', rotulo: 'Ainda não' }] : [{ evento: 'VIRAR', rotulo: 'Virar' }],
      pendente: mao.pendente ? { texto: mao.pendente.repeticao ? 'Ainda não. Ele volta em outro dia, pela agenda.' : 'Ainda não. Este card volta uma vez no fim desta mão.', trecho } : null,
      trecho: mao.virado || mao.pendente ? trecho : null,
      animacaoMs: 180,
      regra: Cards.REGRA_CARDS,
      topo: this._topo(m.passos[m.i], 'Cards'),
    };
  }

  /* =========================================================
     Pronto por hoje (c.4)
     ========================================================= */
  prontoPorHoje() {
    const st = this.st, m = st.missao, d = R.hoje(), pk = this.pack;
    if (!m) return null;
    const cons = Plano.constancia(st, d), res = m.resumo;
    const mud = [];
    for (const fr of res.rodadas) {
      const c = pk.capitulo(fr.cap);
      if (fr.extra) mud.push({ tipo: 'antecipada', texto: fr.venceu ? `Cap. ${c.n} · revisão antecipada vencida. O nível só sobe na revisão do dia certo.` : `Cap. ${c.n} · revisão marcada para amanhã.` });
      else if (fr.venceu) mud.push({ tipo: 'nivel', texto: `Cap. ${c.n} · ${c.titulo} entrou em ${NIVEL[fr.caixaDepois]}. Revisão: ${dataRevisao(fr.proxima, d)}.`, nivel: { cap: fr.cap, de: fr.caixaAntes, para: fr.caixaDepois, animar: true } });
      else mud.push({ tipo: 'teto', texto: `Cap. ${c.n} · ${this._textoFimRodada(fr).texto}` });
      if (fr.cardsRecebidos) mud.push({ tipo: 'cards', texto: `Os ${fr.cardsRecebidos} cards do Cap. ${c.n} entraram no seu baralho.` });
    }
    for (const rv of res.revisoes) {
      const c = pk.capitulo(rv.cap);
      mud.push(rv.venceu ? { tipo: 'revisao', texto: `Cap. ${c.n} · ${NIVEL[rv.caixaDepois]}. Próxima revisão: ${R.fmtCurta(rv.proxima)}.`, nivel: { cap: rv.cap, de: rv.caixaAntes, para: rv.caixaDepois, animar: rv.caixaDepois > rv.caixaAntes } }
        : { tipo: 'revisao', texto: `Cap. ${c.n} · revisão marcada para ${R.diff(d, rv.proxima) === 1 ? 'amanhã' : R.fmtCurta(rv.proxima)}.`, nivel: { cap: rv.cap, de: rv.caixaAntes, para: rv.caixaDepois, animar: false } });
    }
    const pres = m.passos.filter(p => p.t === 'pre'), ultimoFeito = m.parcial ? m.i - 1 : m.passos.length - 1;
    if (pres.length && res.pres > 0 && pres.every(p => m.passos.indexOf(p) <= ultimoFeito || (!m.parcial))) mud.push({ tipo: 'antes', texto: 'Você tentou antes de ler em todos os trechos cobrados.' });
    for (const mc of MARCOS) if (st.marcos[mc.id] === d) mud.push({ tipo: 'marco', texto: `Marco: ${mc.nome}.`, marco: mc.id });
    if (res.cards) mud.push({ tipo: 'mao', texto: res.cards.texto });
    let manter = null;
    if (m.tipo === 'questaoDoDia' && res.dia.n) manter = `Hoje foi dia de manter: ${nDe(res.dia.n, 'questão', 'questões')}, ${nDe(res.dia.certas, 'certa', 'certas')} de primeira. Nenhuma revisão venceu.`;
    else if (m.retorno && res.revisoes.length) manter = `Hoje foi dia de pôr as revisões em dia: ${nDe(res.revisoes.length, 'revisão', 'revisões')}, ${nDe(res.revisoes.filter(x => x.venceu).length, 'certa', 'certas')} na primeira resposta.`;
    if (manter) mud.unshift({ tipo: 'manter', texto: manter });
    const subiu = res.rodadas.some(x => x.venceu && !x.extra) || res.revisoes.some(x => x.caixaDepois > x.caixaAntes);
    if ((m.tipo === 'novo' || m.tipo === 'pratica') && !subiu && res.tentativas > 0) {
      const pe = paginasComErro(st, pk, m.cap), pg = pk.capitulo(m.cap).paginas[pe.principal];
      mud.push({ tipo: 'nada', texto: `Hoje não subiu nível. Ficaram registradas ${nDe(res.tentativas, 'tentativa', 'tentativas')}; a p. ${pg.n} volta no próximo dia de estudo.` });
    }
    const ultimaRodada = res.rodadas.length ? res.rodadas[res.rodadas.length - 1] : null;
    const prox = this._proximoDia(d);
    const umaVezPorSemana = !st.config.ultimaCopia || R.diff(st.config.ultimaCopia, d) >= 7;
    return {
      estado: 'encerramento', titulo: 'Pronto por hoje.', data: R.fmtLonga(d),
      constancia: { simbolo: cons.simbolo, diasEstudados: cons.diasEstudados, rotulo: cons.rotulo, regua: cons.miniRegua, tracoDeHoje: !!st.dias[d], chama: cons.chama },
      semanaPassada: st.dias[d] ? Plano.linhaSemanaPassada(st, d) : null,
      mudancas: mud,
      nivelAnimado: ultimaRodada && ultimaRodada.venceu && !ultimaRodada.extra ? { cap: ultimaRodada.cap, de: ultimaRodada.caixaAntes, para: ultimaRodada.caixaDepois, nome: NIVEL[ultimaRodada.caixaDepois] } : null,
      parcial: m.parcial ? `Você encerrou no passo ${m.encerradoNoPasso} de ${m.passos.length}. O que já tinha fechado hoje continua; o resto não mudou nenhum nível.` : null,
      vazio: m.parcial && res.tentativas === 0 ? (res.pres > 0 ? 'Hoje ficou só a pergunta de entrada. Ela volta no próximo dia de estudo.' : 'Hoje você encerrou antes da primeira pergunta. Nada mudou.') : null,
      naoContou: m.parcial && !st.dias[d] ? 'O dia não conta como estudado.' : null,
      proxima: prox ? { texto: prox.texto, gancho: prox.gancho, porque: prox.porque, rotuloPorque: 'Por quê?' } : null,
      copia: umaVezPorSemana ? { rotulo: 'Salvar uma cópia do meu progresso' } : null,
      som: subiu ? 'nivel' : null,
      acao: { evento: 'FECHAR', rotulo: 'Fechar' },
    };
  }

  /* =========================================================
     Prova do caderno (c.3i)
     ========================================================= */
  prova() {
    const m = this.st.missao, pr = m && m.prova, nome = this.estado(), pk = this.pack;
    if (!pr) return null;
    if (nome === 'prova') return Object.assign({ estado: 'prova' }, Prova.vmAberturaProva(pk, pr));
    if (nome === 'provaResultado') return Object.assign({ estado: 'provaResultado', acao: { evento: 'FECHAR', rotulo: 'Fechar' } }, Prova.vmResultadoProva(this.st, pk, pr, R.hoje()));
    const f = pr.fila[pr.i], item = pk.item(f.id);
    const topo = { etapa: 'Prova do caderno', encerrar: 'Encerrar', casas: Prova.casasProva(pk, pr), tentativa: `tentativa ${pr.rodada.tentativas + (nome === 'provaPergunta' ? 1 : 0)} de ${P.chefe.teto}`, regra: Prova.regraProva(pk), eventoEncerrar: 'ENCERRAR_PROVA', avisoEncerrar: 'Encerrar a prova no meio não muda nada.' };
    const r = item.origem === 'enem' ? { rotulo: 'QUESTÃO DO ENEM', sub: item.rotulo } : { rotulo: 'QUESTÃO DA EQUIPE', sub: 'Texto e números da equipe Prumo · CC BY-SA 4.0' };
    if (nome === 'provaPergunta') return { estado: 'provaPergunta', rotulo: r.rotulo, subrotulo: r.sub, item: this._itemVM(item), topo, acao: { evento: 'RESPONDER', rotulo: 'Responder', exige: 'alt' }, reaproveita: pr.reaproveita ? 'Nesta demo, a prova reaproveita questões.' : null };
    const u = pr.ultima, ok = u.res === 'ok', alt = item.alternativas.find(a => a.letra === u.alt) || {}, loc = u.paragrafo ? pk.local(u.paragrafo) : null;
    const fb = {
      estado: 'provaFeedback', rotulo: r.rotulo, subrotulo: r.sub, certa: ok,
      titulo: ok ? 'Certa.' : `Você marcou ${u.alt}. A certa é ${item.gabarito}.`, porque: ok ? item.explicacao || null : null, falta: ok ? null : alt.falta || null,
      item: this._itemVM(item),
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem || null, marca: a.letra === u.alt && a.certa ? 'sua-certa' : a.letra === u.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: loc ? { evento: 'VOLTAR_AO_TRECHO', rotulo: `Voltar ao trecho · ${loc.rotulo}` } : null,
      resolucao: { evento: 'VER_RESOLUCAO', rotulo: 'Ver a resolução da equipe', aberta: !!pr.resolucaoAberta, texto: item.explicacao || '' },
      continuar: { evento: 'CONTINUAR', rotulo: pr.resultado ? 'Ver o resultado' : 'Continuar', texto: 'Leia a explicação', pausaMs: this.M.pausa(item), liberaEm: (pr.feedbackEm || 0) + this.M.pausa(item), restanteMs: Math.max(0, (pr.feedbackEm || 0) + this.M.pausa(item) - R.agora()) },
      topo, som: ok ? 'acerto' : 'erro',
    };
    if (nome === 'provaTrecho') return Object.assign({ estado: 'provaTrecho' }, this._trecho(u.paragrafo), { feedback: fb, acao: { evento: 'VOLTAR', rotulo: 'Voltar ao resultado' } });
    return fb;
  }

  /* =========================================================
     Caderno (c.5–c.8 e aba Cards)
     ========================================================= */
  sumario() {
    const st = this.st, pk = this.pack, M = this.M, d = R.hoje();
    const caps = pk.capitulos.map(c => {
      const t = st.topicos[c.id] || { caixa: 0, tentativas: [], rodadas: [] }, e = M.estado(st, c.id, d);
      const ns = (c.paginas || []).map(p => p.n);
      let estado, regra = null;
      const ultRev = [...(t.rodadas || [])].reverse().find(x => x.tipo === 'revisao');
      if (e === 'bloqueado') {
        estado = 'bloqueado';
        regra = t.travado && M.travadoAtivo(st, c.id, d) ? `Volta amanhã: a prática foi para o Cap. ${pk.capitulo(t.travado.por).n}, que é a base deste.`
          : `Libera quando ${listaCaps((c.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq).map(p => pk.capitulo(p).n))} ${(c.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq).length > 1 ? 'estiverem' : 'estiver'} em Aprendendo.`;
      } else if (e === 'novo') estado = 'não aberto';
      else if (e === 'pratica') estado = 'em prática';
      else if (e === 'agendado') estado = 'revisar hoje';
      else if (e === 'vencido') { const n = R.diff(t.proxima, d); estado = `atrasada há ${nDe(n, 'dia', 'dias')}`; }
      else estado = ultRev && !ultRev.venceu && ultRev.dia === [...(t.rodadas || [])].slice(-1)[0].dia && t.caixa === 1 ? `Aprendendo · revisar ${R.fmtQuando(t.proxima, d)}` : `em dia · revisar ${R.fmtCurta(t.proxima)}`;
      const pre = Object.entries(st.pre || {}).find(([id, x]) => x.cap === c.id && x.revelado);
      let antesDepois = null;
      if (pre) {
        const [id, x] = pre, tent = (t.tentativas || []).find(y => y.item === id && y.dia === x.revelado);
        if (tent) antesDepois = `1ª revisão (${R.fmtCurta(x.revelado)}): antes de ler, você marcou ${x.alt}; na revisão, ${tent.alt}${tent.res === 'ok' ? ', certa' : ''}.`;
      }
      return {
        id: c.id, n: c.n, titulo: c.titulo, paginas: ns.length > 1 ? `p. ${ns[0]}–${ns[ns.length - 1]}` : `p. ${ns[0]}`, paginaIds: (c.paginas || []).map(p => p.id),
        nivel: { caixa: t.caixa || 0, nome: t.caixa ? NIVEL[t.caixa] : null, segmentos: 5, cheios: t.caixa || 0 },
        estado, bloqueado: e === 'bloqueado', regra, antesDepois, cards: (st.baralho || {})[c.id] ? (c.cards || []).length : 0,
        verARegra: M.porqueEstado(st, c.id, d),
      };
    });
    const ce = M.chefeEstado(st, pk.id), ch = st.chefes[pk.id];
    return {
      titulo: pk.titulo, materia: MATERIAS[pk.materia] || pk.materia,
      avisoDemo: (st.config.nivelMaximo || 5) < 5 ? `Na demo, o nível vai até ${NIVEL[st.config.nivelMaximo]}.` : null,
      capitulos: caps,
      prova: {
        regra: Prova.regraProva(pk), estado: ce === 'vencido' ? 'vencida' : ce === 'disponivel' ? 'liberada' : 'bloqueada',
        texto: ce === 'vencido' ? `Vencida em ${R.fmtCompleta(ch.dia)}.` : ce === 'disponivel' ? 'Liberada: aparece em Hoje antes da missão do dia ou numa folga.' : 'Libera quando todos os capítulos estiverem em Firmando ou acima.',
        trofeu: { ganho: ce === 'vencido', nome: pk.titulo, dia: ce === 'vencido' ? ch.dia : null, tentativasFeitas: ch ? ch.tentativasFeitas || (ch.venceu ? 1 : 0) : 0 },
        selos: (st.selos || []).map(s => ({ materia: s, nome: MATERIAS[s] || s })),
      },
      marcos: MARCOS.map(mc => ({ id: mc.id, nome: mc.nome, condicao: mc.condicao, dia: st.marcos[mc.id] || null, texto: st.marcos[mc.id] ? `em ${R.fmtCompleta(st.marcos[mc.id])}` : null })),
      creditos: { rotulo: 'Créditos deste caderno' },
      niveis: NIVEL.slice(1).map((n, i) => ({ n: i + 1, nome: n })),
      regraNivel: 'Nível do capítulo: 5 caixas (Aprendendo, Firmando, Firme, Forte, Dominado). Vencer a primeira rodada põe o capítulo em Aprendendo; cada revisão certa na primeira resposta sobe um nível; uma revisão errada volta a Aprendendo, sem apagar o histórico.',
    };
  }
  /** Leitor do Caderno (c.6): qualquer página abre a qualquer hora. Ler não conta como dia estudado. */
  pagina(id) {
    const pk = this.pack, pg = pk.pagina(id);
    if (!pg) return null;
    const capId = pk.capDaPagina(id), c = pk.capitulo(capId), todas = pk.capitulos.flatMap(x => x.paginas || []), i = todas.findIndex(x => x.id === id);
    return {
      cabeco: `${MATERIAS[pk.materia] || pk.materia} · ${pk.titulo} · Cap. ${c.n}`, id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}`,
      blocos: pg.blocos.map(b => this._blocoVM(b)), notaPrompt: pg.notaPrompt || null,
      irAlem: (c.irAlem || []).map(l => ({ rotulo: l.rotulo, url: l.url, aviso: l.aviso, tipo: l.tipo })),
      credito: pg.fonte ? { fonte: pg.fonte.fonte, url: pg.fonte.url || null, licenca: pg.fonte.licenca, alteracoes: pg.fonte.alteracoes || null, revisao: pg.fonte.revisao || null } : { fonte: 'Equipe Prumo', licenca: pk.dados.licencaPadrao },
      anterior: i > 0 ? todas[i - 1].id : null, seguinte: i < todas.length - 1 ? todas[i + 1].id : null,
    };
  }
  _situacaoErro(e) {
    const t = this.st.topicos[e.cap] || {}, d = R.hoje();
    if (e.estado === 'resolvido') return `acertou a variante em ${R.fmtDiaMes(e.resolvidoEm)}`;
    return t.caixa && t.proxima ? `volta como variante na revisão do Cap. ${this.pack.capitulo(e.cap).n}, ${t.proxima <= d ? 'hoje' : R.fmtCurta(t.proxima)}` : `volta como variante quando o Cap. ${this.pack.capitulo(e.cap).n} for revisado`;
  }
  _refazerInfo(e) {
    const st = this.st, d = R.hoje(), m = st.missao;
    const mp = this._modeloRefazer(e);
    const rotulo = 'Refazer com outros números · 1 por dia · não muda nível';
    if (m && m.dia === d && m.fechada) return { disponivel: false, rotulo, motivo: 'Disponível amanhã. Hoje você já fechou o dia.' };
    if (e.refazerEm === d) return { disponivel: false, rotulo, motivo: 'Disponível amanhã. Você já refez esta hoje.' };
    if (!mp || e.refazerLinha > 10 || e.refazerLinha >= (mp.linhas || []).length) return { disponivel: false, rotulo, motivo: 'Sem novas versões deste modelo por enquanto.' };
    return { disponivel: true, rotulo, motivo: null };
  }
  _modeloRefazer(e) {
    const m = e.modelo ? this.pack.modelo(e.modelo) : null;
    if (m && m.tipo === 'pagina') return m;
    if (m && m.tipo === 'bloco') return this.pack.modeloDaPagina(m.pagina);
    try { const it = this.pack.item(e.item); return it.pagina ? this.pack.modeloDaPagina(it.pagina) : null; } catch (x) { return null; }
  }
  erros(filtroCap = null) {
    const pk = this.pack, todos = [...(this.st.erros || [])].sort((a, b) => (a.dia < b.dia ? 1 : a.dia > b.dia ? -1 : 0));
    const lista = todos.filter(e => !filtroCap || e.cap === filtroCap);
    const itens = lista.map(e => {
      let it = null; try { it = pk.item(e.item); } catch (x) { /* item removido do pack */ }
      const loc = e.paragrafo ? pk.local(e.paragrafo) : null, c = pk.capitulo(e.cap);
      return {
        id: e.id, cap: e.cap, capRotulo: c ? `Cap. ${c.n}` : '', dia: R.fmtDiaMes(e.dia),
        questao: it ? { rotulo: it.origem === 'enem' ? it.rotulo : `Questão da equipe · ${it.pagina ? 'p. ' + pk.pagina(it.pagina).n : ''}`, enunciado: it.origem === 'enem' ? it.contexto : it.enunciado, introducao: it.introducao || '', imagens: it.imagens || [], rodape: it.rodape, alternativas: it.alternativas.map(a => ({ letra: a.letra, texto: a.texto, marca: a.letra === e.marcou ? 'sua' : a.certa ? 'certa' : null })) } : null,
        linha: `você marcou ${e.marcou} / certa ${e.certa}`,
        falta: e.falta || null, anotacao: e.anotacao || '', foiIsso: { valor: e.foiIsso, pergunta: 'Foi isso?', opcoes: [{ valor: 'sim', rotulo: 'Sim' }, { valor: 'outra', rotulo: 'Foi outra coisa' }] },
        trecho: loc ? { rotulo: `Abrir o trecho · ${loc.rotulo}`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
        situacao: this._situacaoErro(e), estado: e.estado,
        refazer: this._refazerInfo(e),
        irAlem: c ? (c.irAlem || []).map(l => ({ rotulo: l.rotulo, url: l.url, aviso: l.aviso })) : [],
      };
    });
    return {
      filtros: pk.capitulos.map(c => ({ cap: c.id, rotulo: `Cap. ${c.n}`, n: todos.filter(e => e.cap === c.id).length })), filtro: filtroCap,
      itens,
      vazio: !todos.length ? 'Nenhum erro guardado ainda. Quando errar, a questão vem para cá com o trecho que explica.' : !itens.length ? 'Nenhum erro neste capítulo.' : null,
    };
  }
  notas() {
    const pk = this.pack;
    const porCap = pk.capitulos.map(c => ({
      cap: c.id, titulo: `Cap. ${c.n} · ${c.titulo}`,
      notas: (this.st.notas || []).filter(n => pk.local(n.paragrafo) && pk.local(n.paragrafo).cap === c.id).map(n => ({ id: n.id, texto: n.texto, dia: R.fmtDiaMes(n.dia), trecho: { rotulo: pk.local(n.paragrafo).rotulo, pagina: pk.local(n.paragrafo).pagina, paragrafo: n.paragrafo } })),
    })).filter(x => x.notas.length);
    return { capitulos: porCap, vazio: porCap.length ? null : 'Suas notas aparecem aqui. No fim de cada página, o Prumo pergunta uma coisa; a resposta fica guardada.' };
  }
  cardsDoCaderno() {
    return { capitulos: Cards.cardsDoCaderno(this.st, this.pack, R.hoje()), regra: Cards.REGRA_CARDS, aviso: 'Consultar é leitura livre; jogar, só na missão.' };
  }

  /* =========================================================
     Plano (c.9), agenda e constância
     ========================================================= */
  constancia() { return Plano.constancia(this.st, R.hoje()); }
  agenda() {
    const st = this.st, d = R.hoje(), m = st.missao, pk = this.pack, out = [];
    const atribuidos = new Set(), cardsAtrib = new Set();
    for (let i = 0; i < 14; i++) {
      const dia = R.addDias(d, i);
      const estudo = Plano.ehDiaDeEstudo(st, dia), pausa = Plano.emPausa(st, dia);
      const linha = { dia, rotulo: R.fmtCurta(dia), tipo: pausa ? 'pausa' : estudo ? 'estudo' : 'folga', itens: [], texto: '' };
      if (i === 0 && m && m.passos.length && m.tipo !== 'folga' && m.tipo !== 'pausa') {
        linha.tipo = 'estudo';
        if (m.fechada) linha.itens.push(m.parcial ? 'encerrada antes do fim' : 'feito');
        if (m.tipo === 'novo') linha.itens.push(`${this._nomeCap(m.cap)} (novo)`);
        else if (m.tipo === 'pratica') linha.itens.push(`${this._nomeCap(m.cap)} (continuação)`);
        else if (m.tipo === 'antecipada') linha.itens.push(`revisão antecipada do ${this._nomeCap(m.cap)}`);
        else if (m.tipo === 'questaoDoDia') linha.itens.push('Questão do dia');
        const revs = m.passos.filter(p => p.t === 'revisao');
        revs.forEach(p => atribuidos.add(p.cap));
        if (revs.length) linha.itens.push(revs.length === 1 ? `revisão do ${this._nomeCap(revs[0].cap)}` : `revisões dos ${listaCaps(revs.map(p => pk.capitulo(p.cap).n))}`);
        const cd = m.passos.find(p => p.t === 'cards');
        if (cd) { cd.ids.forEach(x => cardsAtrib.add(x)); linha.itens.push(nDe(cd.ids.length, 'card', 'cards')); }
      } else if (linha.tipo === 'estudo') {
        const devidos = this.M.topicosAtivos(st).filter(id => { const t = st.topicos[id]; return t && t.caixa && t.proxima && t.proxima <= dia && !atribuidos.has(id); });
        devidos.forEach(x => atribuidos.add(x));
        if (devidos.length) linha.itens.push(devidos.length === 1 ? `revisão do ${this._nomeCap(devidos[0])}` : `revisões dos ${listaCaps(devidos.map(x => pk.capitulo(x).n))}`);
        const cs = Object.entries(st.cards || {}).filter(([id, c]) => c.proxima <= dia && !cardsAtrib.has(id)).slice(0, Cards.MAO_MAX);
        cs.forEach(([id]) => cardsAtrib.add(id));
        if (cs.length) linha.itens.push(nDe(cs.length, 'card', 'cards'));
        if (!linha.itens.length) linha.itens.push('sem revisão vencida');
      }
      linha.texto = `${linha.rotulo} · ${linha.tipo === 'folga' ? 'folga' : linha.tipo === 'pausa' ? 'pausa' : linha.itens.join(' + ')}`;
      out.push(linha);
    }
    const firme = this.M.topicosAtivos(st).length && this.M.topicosAtivos(st).every(id => (st.topicos[id] || {}).caixa >= Math.min(3, st.config.nivelMaximo || 5));
    const iv = Plano.intervalos(st, d);
    return {
      dias: out, tudoFirme: firme ? 'Tudo firme. As revisões seguem a agenda abaixo.' : null,
      porQueEstaOrdem: `As revisões vencem pela agenda calculada a partir da data da prova: em Aprendendo, ${nDe(iv[1], 'dia', 'dias')}; em Firmando, ${iv[2]}; em Firme, ${iv[3]}; em Forte, ${iv[4]}; em Dominado, ${iv[5]}. Revisão que vence numa folga entra no próximo dia de estudo, e as atrasadas vêm primeiro. Capítulo novo e Questão do dia dependem do que acontecer até lá, por isso a agenda mostra só o que já está marcado.`,
    };
  }
  plano() {
    const st = this.st, d = R.hoje(), p = st.perfil;
    if (!p) return null;
    return {
      prova: Plano.resumoProva(st, d),
      tiposProva: TIPOS_PROVA,
      dias: { valor: p.dias, texto: `${Plano.textoDias(p.dias)} · ${p.minutos} min` },
      minutos: { valor: p.minutos, opcoes: [15, 25, 40], capacidade: Plano.capacidade(st) },
      meta: { valor: p.metaSemana, texto: p.metaSemana ? `${nDe(p.metaSemana, 'dia', 'dias')} (opcional)` : 'desligada', regra: 'O resultado só aparece depois que a semana termina. Estudar na folga conta como dia estudado, mas não para a meta.' },
      pausa: st.pausa && st.pausa.ate ? { ativa: true, ate: st.pausa.ate, texto: `Pausa até ${R.fmtDiaMes(st.pausa.ate)}. Nada vence por isso.`, acao: 'Encerrar pausa' } : { ativa: false, texto: 'Marcar pausa (1 a 14 dias)' },
      lembrete: { texto: textoAlarme(p.dias, p.horario), como: `Crie um alarme no app Relógio com o nome "Prumo"${p.horario ? `, às ${p.horario}` : ''}, nos dias ${Plano.textoDias(p.dias)}. O Prumo não manda notificação.` },
      agenda: this.agenda(),
      constancia: this.constancia(),
      intervalos: Plano.tabelaIntervalos(st, d),
    };
  }

  /* =========================================================
     Ajustes, dados, créditos
     ========================================================= */
  ajustes() {
    const c = this.st.config, d = R.hoje();
    return {
      som: { valor: !!c.som, rotulo: 'Som', nota: 'Desligado por padrão. O retorno nunca depende do som.' },
      simbolo: { valor: c.simboloConstancia, rotulo: 'Símbolo da constância', opcoes: [{ valor: 'chama', rotulo: 'Chama' }, { valor: 'regua', rotulo: 'Régua' }], nota: 'Os dois mostram "dias estudados", que só cresce. A chama acende na semana em que a meta foi cumprida, depois que ela termina, e nunca apaga.' },
      dados: {
        copia: { rotulo: 'Salvar uma cópia do meu progresso', ultima: c.ultimaCopia ? `Última cópia: ${R.fmtDiaMes(c.ultimaCopia)}` : 'Nenhuma cópia salva ainda.' },
        csv: { rotulo: 'Baixar minhas tentativas (CSV)' },
        restaurar: { rotulo: 'Restaurar uma cópia' },
        copiarTexto: { rotulo: 'Copiar dados' },
        apagar: { rotulo: 'Apagar tudo', confirmacao: 'Apagar todo o progresso deste aparelho? Isso não pode ser desfeito. Salve uma cópia antes, se quiser guardar.' },
      },
      demo: { ativo: !!c.demo.ativo, exemplo: !!c.demo.exemplo, data: R.fmtDiaMes(d), offset: c.demo.offset, acoes: [{ rotulo: 'avançar 1 dia', dias: 1 }, { rotulo: 'avançar 7 dias', dias: 7 }, { rotulo: 'carregar estado de exemplo' }] },
      falhaSalvar: this.falhaSalvar ? E.MSG_FALHA_SALVAR : null,
    };
  }
  creditos() {
    const c = this.pack.creditos();
    c.app = [
      { item: 'Poppins (marca e títulos)', licenca: 'SIL Open Font License 1.1', fonte: 'Google Fonts' },
      { item: 'Inter (texto)', licenca: 'SIL Open Font License 1.1', fonte: 'Google Fonts' },
      { item: 'Código do Prumo', licenca: 'da equipe do TCC', fonte: 'ETEC Jornalista Roberto Marinho' },
    ];
    c.ia = 'Uso de IA declarado: textos, modelos e explicações com "rascunho por IA" foram redigidos com Claude (Anthropic), via Claude Code, e aguardam revisão de um aluno. O diário de uso de IA da equipe registra cada caso.';
    return c;
  }
  naoTem() { return { titulo: 'O que o Prumo não tem', itens: NAO_TEM }; }

  /* ---------------- ações (cada uma salva) ---------------- */
  _acao(fn) { return this.missao.transicao(() => { const r = fn(); return r === undefined ? null : r; }); }
  definirSom(v) { return this._acao(() => { this.st.config.som = !!v; }); }
  definirSimbolo(v) { return this._acao(() => { this.st.config.simboloConstancia = v === 'regua' ? 'regua' : 'chama'; }); }
  definirAlarme(v) { return this._acao(() => { this.st.config.alarme = ['criado', 'agora-nao'].includes(v) ? v : null; }); }
  /** Muda o plano (prova, dias, minutos, meta, horário). A missão de hoje é remontada se não começou. */
  mudarPlano(mud) {
    const ok = this._acao(() => {
      const p = Object.assign({}, this.st.perfil, mud);
      if (mud.dias && mud.metaSemana === undefined && this.st.perfil.metaSemana) p.metaSemana = Math.min(this.st.perfil.metaSemana, mud.dias.length);
      this.st.perfil = E.normalizarPerfil(p);
    });
    this.missao.remontarSeNaoIniciada();
    return ok;
  }
  marcarPausa(dias) { const ok = this._acao(() => { Plano.marcarPausa(this.st, dias, R.hoje()); }); this.missao.remontarSeNaoIniciada(); return ok; }
  encerrarPausa() {
    if (this.st.missao && this.st.missao.tipo === 'pausa' && this.estado() === 'hoje') return this.despachar({ tipo: 'ENCERRAR_PAUSA' });
    const ok = this._acao(() => { Plano.encerrarPausa(this.st, R.hoje()); }); this.missao.remontarSeNaoIniciada(); return ok;
  }
  _salvarNota({ id, paragrafo, pagina, texto }) {
    const st = this.st, d = R.hoje(), t = String(texto || '').slice(0, 600);
    let n = id ? st.notas.find(x => x.id === id) : pagina && !paragrafo ? st.notas.find(x => x.pagina === pagina) : null;
    if (!paragrafo && pagina) { const pg = this.pack.pagina(pagina); paragrafo = pg ? (this.pack.bloco(pg.nucleo).paragrafos[0] || {}).id : null; }
    if (n) { if (!t.trim()) { st.notas = st.notas.filter(x => x !== n); return; } n.texto = t; n.editadaEm = d; return; }
    if (!t.trim() || !paragrafo) return;
    st.seq.nota = (st.seq.nota || 0) + 1;
    st.notas.push({ id: `n-${st.seq.nota}`, paragrafo, pagina: pagina || null, texto: t, dia: d, editadaEm: null });
  }
  salvarNota(dados) { return this._acao(() => { this._salvarNota(dados); }); }
  apagarNota(id) { return this._acao(() => { this.st.notas = this.st.notas.filter(n => n.id !== id); }); }
  anotarErro(id, texto) { return this._acao(() => { const e = this.st.erros.find(x => x.id === id); if (e) e.anotacao = String(texto || '').slice(0, 400); }); }
  /** "Foi isso? Sim · Foi outra coisa" (no cartão do Caderno de erros). */
  foiIsso(id, valor, texto) { return this._acao(() => { const e = this.st.erros.find(x => x.id === id); if (!e) return; e.foiIsso = valor === 'outra' ? 'outra' : 'sim'; if (valor === 'outra' && texto != null) e.anotacao = String(texto).slice(0, 400); }); }

  /* ---------------- Refazer com outros números (c.8) ---------------- */
  iniciarRefazer(erroId) {
    const e = this.st.erros.find(x => x.id === erroId);
    if (!e || !this._refazerInfo(e).disponivel) return false;
    const mp = this._modeloRefazer(e);
    return this._acao(() => { this.st.refazer = { erro: e.id, item: `${mp.id}#${e.refazerLinha}`, dia: R.hoje(), estado: 'pergunta', alt: null, res: null }; });
  }
  responderRefazer(alt) {
    const rf = this.st.refazer;
    if (!rf || rf.estado !== 'pergunta' || !['A', 'B', 'C', 'D', 'E'].includes(alt)) return false;
    return this._acao(() => {
      const st = this.st, d = R.hoje(), item = this.pack.item(rf.item), e = st.erros.find(x => x.id === rf.erro);
      const itemM = this.pack.paraMotor(item, 'compreender'), aval = this.M.avaliar(itemM, this.pack.indice(item, alt));
      this.M.registrar(st, this.M.novaRodada(st, item.cap, 'refazer'), itemM, aval, { dia: d, alt, tipo: 'refazer' });   // conta como dia estudado; não mexe em nível nem agenda
      st.vistos[item.id] = d;
      e.refazerEm = d; e.refazerLinha++;
      e.voltas.push({ dia: d, item: item.id, res: aval.res, marcou: alt, origem: 'refazer' });
      Object.assign(rf, { estado: 'feedback', alt, res: aval.res });
    });
  }
  fecharRefazer() { return this._acao(() => { this.st.refazer = null; }); }
  refazer() {
    const rf = this.st.refazer;
    if (!rf) return null;
    const item = this.pack.item(rf.item), base = { estado: rf.estado, rotulo: 'REFAZER · OUTROS NÚMEROS', subrotulo: 'Não muda nível nem agenda.', item: this._itemVM(item) };
    if (rf.estado === 'pergunta') return Object.assign(base, { acao: { rotulo: 'Responder', exige: 'alt' } });
    const ok = rf.res === 'ok', alt = item.alternativas.find(a => a.letra === rf.alt) || {}, loc = alt.paragrafo ? this.pack.local(alt.paragrafo) : null;
    return Object.assign(base, {
      certa: ok, titulo: ok ? 'Certa.' : `Você marcou ${rf.alt}. A certa é ${item.gabarito}.`, falta: ok ? null : alt.falta || null, porque: ok ? item.explicacao : null,
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, marca: a.letra === rf.alt && a.certa ? 'sua-certa' : a.letra === rf.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: loc ? { rotulo: `Voltar ao trecho · ${loc.rotulo}`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
      acao: { rotulo: 'Fechar' },
    });
  }

  /* ---------------- dados: cópia, CSV, restaurar, apagar ---------------- */
  copia() {
    const c = E.copiaJSON(this.st, this.pack, R.hoje());
    this._acao(() => { this.st.config.ultimaCopia = R.hoje(); });
    return c;
  }
  csv() { return E.csvTentativas(this.st, this.pack); }
  /** Restaura uma cópia (texto do arquivo). Devolve { ok, mensagem }. Arquivo inválido não altera nada. */
  restaurar(texto) {
    let novo;
    try { novo = E.lerCopia(texto); } catch (err) { return { ok: false, mensagem: err.message || E.MSG_COPIA_INVALIDA }; }
    this.missao.transicao(() => {
      this.missao.substituir(novo);
      R.setOffset(this.st.config.demo.ativo ? this.st.config.demo.offset : 0);
      if (!this.st.missao || this.st.missao.dia !== R.hoje()) return this.missao.virarDia();
      return this.st.missao.estado;
    });
    return { ok: true, mensagem: 'Cópia restaurada.' };
  }
  apagarTudo() {
    E.apagar(this.storage);
    this.missao.substituir(E.vazio());
    R.setOffset(0);
    this.falhaSalvar = null;
    return true;
  }

  /* ---------------- modo demonstração (Decisão 5) ---------------- */
  /** Carrega o estado de exemplo (3 semanas que terminam ontem, gerado pelo próprio motor). O estado real fica guardado. */
  carregarExemplo() {
    const guardado = this.st.perfil && !this.st.config.demo.ativo ? JSON.stringify(this.st) : this.st.config.demo.guardado;
    R.setOffset(0);
    const ex = gerarExemplo(this.pack, R.hoje());
    ex.config.demo = { ativo: true, offset: 0, exemplo: true, guardado: guardado || null };
    this.missao.transicao(() => { this.missao.substituir(ex); return this.missao.virarDia(); });
    return this.tela();
  }
  /** Sai do modo demonstração: volta ao estado real guardado (ou ao Primeiro uso). */
  sairDaDemonstracao() {
    const g = this.st.config.demo.guardado;
    let real = null;
    if (g) { try { real = E.normalizar(JSON.parse(g)); } catch (e) { real = null; } }
    R.setOffset(0);
    if (!real) { this.apagarTudo(); return this.tela(); }
    real.config.demo = { ativo: false, offset: 0, exemplo: false, guardado: null };
    this.missao.transicao(() => { this.missao.substituir(real); if (!this.st.missao || this.st.missao.dia !== R.hoje()) return this.missao.virarDia(); return this.st.missao.estado; });
    return this.tela();
  }
  /** Avança a data simulada (modo demonstração). */
  avancarDias(n) {
    this._acao(() => { const dm = this.st.config.demo; dm.ativo = true; dm.offset = (dm.offset || 0) + Math.round(n); R.setOffset(dm.offset); });
    this.missao.abrir();
    return this.tela();
  }
}

/** Atalho: cria o núcleo e faz a Abertura. */
export function criarNucleo(op) { const n = new Nucleo(op); n.abrir(); return n; }
