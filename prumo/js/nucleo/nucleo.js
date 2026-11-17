/* =========================================================
   PRUMO · Fachada do núcleo para as telas (sem DOM)
   As telas só leem o estado: tudo chega aqui já calculado, em "view models"
   com os textos prontos em português. Para mudar o estado, as telas mandam
   eventos (despachar) ou chamam as ações nomeadas abaixo. Contrato em API.md.
   ========================================================= */
import * as R from './relogio.js';
import * as E from './estado.js';
import { criarMotor, P, NIVEL, MATERIAS, rotuloNivel, noNivel } from './motor.js';
import { Pack } from './pack.js';
import { Missao, DENTRO, DENTRO_PROVA } from './missao.js';
import { montarMissao, regraDaFila, verARegra, paginasComErro, proximaVariante } from './recomendador.js';
import * as Plano from './plano.js';
import * as Cards from './cards.js';
import * as Prova from './prova.js';
import { gerarExemplo } from './exemplo.js';
import { Praticas, limparSvg, AREAS, CONHECIDOS, estadoTopico, montarMissaoGeral, ineditas, regraTopico } from './pratica.js';

export { R as relogio };   // a tela pode ler relogio.agora() e os formatadores de data

export const MARCOS = [
  { id: 'm.primeiroCap', nome: 'Primeiro capítulo aberto', condicao: 'Acertar duas seguidas num capítulo novo, que entra no nível 1 de 5.' },
  { id: 'm.semanaMeta', nome: 'Primeira semana com a meta', condicao: 'Cumprir a meta numa semana. Aparece depois que a semana termina.' },
  { id: 'm.todosFirmando', nome: 'Todos os capítulos no nível 2 de 5', condicao: 'Todos os capítulos chegam ao nível 2 de 5. Isso libera a Prova do caderno.' },
  { id: 'm.primeiroFirme', nome: 'Primeiro capítulo no nível 3 de 5', condicao: 'Um capítulo chega ao nível 3 de 5.' },
  { id: 'm.prova', nome: 'Prova do caderno vencida', condicao: 'Acertar 4 seguidas na Prova do caderno, uma de cada capítulo.' },
];
export const NAO_TEM = [
  { item: 'Ligas e ranking', motivo: 'Você só se compara com você mesmo. Ranking faz a gente estudar para ganhar dos outros, não para aprender.' },
  { item: 'XP e pontos', motivo: 'O seu progresso é o nível de cada capítulo, não um número que só serve para crescer.' },
  { item: 'Baús e sorteio', motivo: 'Tudo o que você ganha é avisado antes. Nada é sorteado, para o app não prender você pela surpresa.' },
  { item: 'Energia e vidas', motivo: 'Errar não custa nada além do que a regra escrita diz.' },
  { item: 'Moeda', motivo: 'Não há moeda para juntar: o que vale é saber a matéria.' },
  { item: 'Apostas', motivo: 'Nada no Prumo depende de sorte.' },
  { item: 'Coleta de dados', motivo: 'Nenhum dado seu sai do celular. A cópia e a planilha só saem quando você pede.' },
  { item: 'Notificações para você voltar', motivo: 'O Prumo não manda notificação; o lembrete é um alarme que você mesmo cria.' },
];
const TIPOS_PROVA = [
  { valor: 'escola', rotulo: 'Prova da escola (bimestral)' },
  { valor: 'enem', rotulo: 'Enem', aviso: 'A data do Enem 2027 ainda não saiu. Até você marcar, o Prumo planeja as revisões para os próximos 90 dias.', dica: 'Marque também a prova da escola: ela vem antes e deixa o plano mais útil.' },
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
  const ds = Plano.textoDiasLongo(dias || []);
  return `"Prumo"${horario ? `, às ${horario}` : ''}${ds ? `, ${ds}` : ''}`;
}

export class Nucleo {
  /** @param {{ pack: object|Pack, storage?: Storage|null }} op */
  constructor({ pack, storage, praticas } = {}) {
    this.pack = pack instanceof Pack ? pack : new Pack(pack);
    this.prat = praticas instanceof Praticas ? praticas : new Praticas(praticas || []);
    this.M = criarMotor(this.pack.indiceMotor());
    this.storage = storage === undefined ? (() => { try { return globalThis.localStorage || null; } catch (e) { return null; } })() : storage;
    this.st = E.vazio();
    this.falhaSalvar = null;
    this.problemaCarga = null;
    const self = this;
    this.missao = new Missao({ get st() { return self.st; }, pack: this.pack, M: this.M, prat: this.prat, persistir: () => self.persistir(), salvarNota: x => self._salvarNota(x) });
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
      demo: dm.ativo ? {
        texto: dm.exemplo ? 'Modo demonstração · dados de exemplo' : 'Modo demonstração', dataSimulada: dm.offset ? `data simulada ${R.fmtDiaMes(R.hoje())}` : null, sair: 'Sair',
        // formato do Recado (rótulo em negrito + frase), sem cadeia de pontos
        rotulo: 'Modo demonstração',
        frase: `${[dm.exemplo ? 'dados de exemplo' : 'nada do seu progresso real muda', dm.offset ? `data simulada ${R.fmtDiaMes(R.hoje())}` : null].filter(Boolean).join(', ')}.`,
      } : null,
      falhaSalvar: this.falhaSalvar ? { texto: E.MSG_FALHA_SALVAR, acao: 'Salvar uma cópia' } : null,
      carga: this.problemaCarga && this.problemaCarga !== 'armazenamento indisponível' ? 'O progresso salvo neste aparelho não pôde ser lido. Restaure uma cópia, se tiver.' : null,
    };
  }

  /* =========================================================
     Primeiro uso
     ========================================================= */
  primeiroUso() {
    return {
      restaurar: { rotulo: 'Já usei o Prumo: restaurar uma cópia' },
      exemplo: { rotulo: 'Ver com dados de exemplo' },
      provas: TIPOS_PROVA,
      dias: { padrao: [1, 2, 3, 4], min: 3, max: 5, opcoes: [1, 2, 3, 4, 5, 6, 0].map(v => ({ valor: v, rotulo: Plano.NOMES_DIAS[v] })) },
      minutos: { padrao: 25, opcoes: [15, 25, 40] },
      som: { padrao: false, pergunta: 'Quer som?' },
      metaSugerida: dias => Math.max(1, (dias || []).length - 1),
      alarme: (dias, horario) => ({ texto: `Quer um lembrete? Crie um alarme no app Relógio: ${textoAlarme(dias, horario)}. O Prumo não manda notificação.`, rotulo: textoAlarme(dias, horario) }),
      frase: 'Uma missão de estudo por dia, com fim marcado, a partir do seu caderno e de questões reais do Enem.',
      areas: AREAS.map(a => { const ok = a.id === 'MT' || this.prat.ids().some(id => this.prat.get(id).area === a.id); return { valor: a.id, rotulo: a.nome, disponivel: ok, nota: ok ? null : 'Em breve' }; }),
      areasPadrao: ['MT'],
      onboarding: [
        { titulo: 'Uma missão de estudo por dia, com fim marcado', texto: 'Você abre o Prumo, faz a missão do dia e termina no "Pronto por hoje". Sem rolar sem fim.' },
        { titulo: 'Errou? O app mostra o que faltou', texto: 'Cada erro vem com o que faltou e o trecho da teoria para rever.' },
        { titulo: 'Seus dias estudados só crescem', texto: 'Cada dia estudado vira um risquinho. Faltar um dia não apaga nada: nada zera.' },
      ],
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
  /** "Cap. 1" no caderno; "tópico Porcentagem e juros" num tópico de prática (lê bem com "o"/"do"). */
  /** "capítulo Parte fixa e parte que varia" no caderno; "tópico Porcentagem e juros" num tópico (lê bem com "o"/"do"). */
  _nomeCap(id) { const c = this.pack.capitulo(id); if (c) return `capítulo ${c.titulo}`; return this.prat.existe(id) ? `tópico ${this.prat.curto(id)}` : ''; }
  /** "Funções afins: Parte fixa e parte que varia" (o nome, não o número). */
  _tituloCap(id) { const c = this.pack.capitulo(id); if (c) return `${this.pack.titulo}: ${c.titulo}`; return this.prat.titulo(id); }
  /** Curto e sem artigo, para o visto: "Parte fixa e parte que varia" ou "Porcentagem e juros". */
  _curto(id) { const c = this.pack.capitulo(id); return c ? c.titulo : this.prat.curto(id); }
  /** "de Parte fixa e parte que varia" / "de Porcentagem e juros" (a revisão de …). */
  _de(id) { return `de ${this._curto(id)}`; }
  /** "revisão do Cap. 1" · "revisões dos Caps. 1 e 2" · "revisões do Cap. 1 e do tópico Estatística" */
  _revisoes(caps) {
    caps = [...new Set(caps)];
    if (caps.length === 1) return `revisão do ${this._nomeCap(caps[0])}`;
    const ns = caps.map(c => `do ${this._nomeCap(c)}`);
    return `revisões ${ns.slice(0, -1).join(', ')} e ${ns[ns.length - 1]}`;
  }
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
        out.push({ n: q > 1 ? `${n} a ${j + 1}` : `${n}`, texto: `Até ${q} ${todosEnem ? (q === 1 ? 'questão do Enem' : 'questões do Enem') : (q === 1 ? 'questão de aplicar' : 'questões de aplicar (do Enem ou da equipe)')}`, nota: p.fonte === 'pratica' ? 'acabam antes se você acertar duas seguidas' : 'a rodada pode fechar antes; um erro traz uma questão da equipe', pagina: '' });
        i = j; continue;
      }
      if (p.t === 'questao' && p.antecipada) {
        let j = i; while (j + 1 < passos.length && passos[j + 1].antecipada && passos[j + 1].r === p.r) j++;
        out.push({ n: j > i ? `${n} a ${j + 1}` : `${n}`, texto: `Revisão antecipada do ${this._nomeCap(p.cap)}, ${nDe(j - i + 1, 'questão', 'questões')}`, nota: 'não sobe nível', pagina: '' });
        i = j; continue;
      }
      const pg = p.pagina ? `p. ${pk.pagina(p.pagina).n}` : '';
      if (p.t === 'teoria') { out.push({ n: `${n}`, texto: `Teoria de ${this.prat.titulo(p.cap)}`, pagina: '' }); continue; }
      let texto;
      if (p.t === 'pre') texto = p.alvo === 'bloco' ? `Pergunta antes do § ${pk.localDoBloco(p.bloco).n}` : 'Pergunta antes de ler';
      else if (p.t === 'leitura') texto = `Leitura ${pk.faixaDeBlocos(p.blocos)}`;
      else if (p.t === 'checagem') texto = 'Confira';
      else if (p.t === 'questao') texto = 'Questão da equipe';
      else if (p.t === 'revisao') texto = `Revisão do ${this._nomeCap(p.cap)}`;
      else if (p.t === 'dia') texto = `Questão do dia do ${this._nomeCap(p.cap)}`;
      else if (p.t === 'cards') texto = `Cartões: ${nDe(p.ids.length, 'cartão', 'cartões')} para lembrar`;
      out.push({ n: `${n}`, texto, pagina: pg });
    }
    return out;
  }
  _composicao(m) {
    const ps = m.passos, partes = [];
    if (ps.some(p => p.t === 'teoria')) partes.push('a teoria');
    const pgs = new Set(ps.filter(p => p.t === 'leitura').map(p => p.pagina)).size;
    if (pgs) partes.push(nDe(pgs, 'página', 'páginas'));
    const ap = ps.filter(p => p.t === 'questao' && p.papel === 'aplicar' && !p.antecipada);
    if (ap.length) partes.push(`até ${ap.length} ${ap.every(p => p.origem === 'enem') ? (ap.length === 1 ? 'questão do Enem' : 'questões do Enem') : (ap.length === 1 ? 'questão de aplicar' : 'questões de aplicar')}`);
    const ant = ps.filter(p => p.antecipada).length;
    if (ant) partes.push(`${nDe(ant, 'questão', 'questões')} de revisão antecipada`);
    const rv = ps.filter(p => p.t === 'revisao').length;
    if (rv) partes.push(nDe(rv, 'revisão', 'revisões'));
    const dia = ps.filter(p => p.t === 'dia').length;
    if (dia) partes.push(nDe(dia, 'questão do dia', 'questões do dia'));
    const cd = ps.find(p => p.t === 'cards');
    if (cd) partes.push(nDe(cd.ids.length, 'cartão', 'cartões'));
    // uma frase, não uma cadeia de metadados: "2 páginas, até 3 questões do Enem e 5 cards."
    const frase = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}` : (partes[0] || '');
    return frase ? `${cap1(frase)}.` : '';
  }
  /** Cabeçalho de prova da missão (Capítulo | Páginas | Tempo): rótulo impresso e valor curto, sem a data. */
  _cabecalho(m) {
    const caps = [...new Set(m.passos.map(p => p.cap).filter(Boolean))].map(c => this.pack.capitulo(c)).filter(Boolean).map(c => c.n).sort((a, b) => a - b);
    const pgs = this._paginasDe(m.passos).replace(/^p\. /, '');
    const cel = [];
    if (m.tipo === 'topico') {
      const q = m.passos.filter(p => p.t === 'questao' || p.t === 'revisao').length;
      if (q) cel.push({ rotulo: 'Questões', valor: String(q) });
    }
    if (caps.length) cel.push({ rotulo: caps.length === 1 ? 'Capítulo' : 'Capítulos', valor: caps.join(', ') });
    if (pgs) cel.push({ rotulo: pgs.includes('–') ? 'Páginas' : 'Página', valor: pgs });
    if (m.minutos) cel.push({ rotulo: 'Tempo', valor: String(m.minutos), unidade: 'min' });
    return cel;
  }
  /** Texto da regra em Hoje: o ganho anunciado antes, com o nome do nível explicado na primeira vez, e o visto. */
  _regraHoje(m, d) {
    const ganho = this._ganho(m);
    if (m.livre) return `${ganho ? ganho + ' ' : ''}Estudo por conta própria: conta como dia estudado, sem um segundo visto.`;
    if (!ganho) return 'No fim, o visto do dia.';
    const mk = /nível (\d) de 5/.exec(ganho);
    let explica = '';
    if (mk) {
      const k = Number(mk[1]), iv = Plano.intervalos(this.st, d);
      const quando = iv && iv[k] ? R.fmtDiaMes(R.addDias(d, iv[k])) : null;
      if (quando) explica = k === 1 ? ` A primeira revisão fica para ${quando}.` : ` A próxima revisão fica para ${quando}.`;
    }
    return `${ganho}${explica} No fim, o visto do dia.`;
  }
  _titulo(m) {
    if (m.tipo === 'topico') return this.prat.titulo(m.cap);
    if (m.tipo === 'novo' || m.tipo === 'pratica') return this._tituloCap(m.cap);
    if (m.tipo === 'antecipada') return `Revisão antecipada do ${this._nomeCap(m.cap)}`;
    if (m.tipo === 'questaoDoDia') return 'Questão do dia';
    const revs = m.passos.filter(p => p.t === 'revisao');
    if (revs.length) return cap1(this._revisoes(revs.map(p => p.cap)));
    if (m.tipo === 'prereq') return `Revisão antecipada do ${this._nomeCap(m.cap)}`;
    return 'Missão de hoje';
  }
  _ganho(m) {
    const st = this.st;
    if (m.tipo === 'topico') {
      const nome = this.prat.titulo(m.cap);
      if (m.passos.some(p => p.t === 'questao' && p.cap === m.cap && !p.antecipada)) return regraTopico(nome).ganho;
      if (m.passos.some(p => p.antecipada && p.cap === m.cap)) return `Revisão antecipada de ${nome}: o nível só sobe na revisão do dia marcado.`;
      const rv = m.passos.find(p => p.t === 'revisao' && p.cap === m.cap);
      if (rv) {
        const t = st.topicos[m.cap] || {}, max = st.config.nivelMaximo || 5, para = Math.min(max, (t.caixa || 0) + 1);
        return para > (t.caixa || 0) ? `Acerte a revisão na primeira resposta: ${nome} sobe para o ${rotuloNivel(para)}.` : `Acerte a revisão na primeira resposta: ${nome} continua ${noNivel(t.caixa)}, com a próxima revisão mais longe.`;
      }
      return 'Hoje é a leitura da teoria. As questões deste tópico voltam quando fizer 7 dias que você as viu.';
    }
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
      return para > (t.caixa || 0) ? `Acerte a revisão na primeira resposta: o ${this._nomeCap(revs[0].cap)} sobe para o ${rotuloNivel(para)}.` : `Acerte a revisão na primeira resposta: o ${this._nomeCap(revs[0].cap)} continua ${noNivel(t.caixa)}, com a próxima revisão mais longe.`;
    }
    if (revs.length > 1) return 'Cada revisão certa na primeira resposta sobe o capítulo um nível.';
    return '';
  }
  _proximoDia(d) {
    const st = this.st, prox = Plano.proximoDiaDeEstudo(st, d);
    if (!prox) return null;
    const mm = montarMissaoGeral(st, this.pack, this.M, this.prat, prox);
    const revs = mm.passos.filter(p => p.t === 'revisao');
    let o;
    if (mm.tipo === 'novo') o = `${this._nomeCap(mm.cap)} (novo)${revs.length ? ' e ' + this._revisoes(revs.map(p => p.cap)) : ''}`;
    else if (mm.tipo === 'pratica') o = `${this._nomeCap(mm.cap)}, continuação`;
    else if (mm.tipo === 'antecipada') o = `revisão antecipada do ${this._nomeCap(mm.cap)}`;
    else if (mm.tipo === 'questaoDoDia') o = 'Questão do dia';
    else if (mm.tipo === 'topico') o = `${this.prat.titulo(mm.cap)}${revs.length ? ' e ' + this._revisoes(revs.map(p => p.cap)) : ''}`;
    else if (revs.length) o = this._revisoes(revs.map(p => p.cap));
    else o = 'missão do dia';
    const quando = R.diff(d, prox) === 1 ? 'Amanhã' : `Na ${R.SEMANA_LONGA[R.diaDaSemana(prox)]}`.replace('Na sábado', 'No sábado').replace('Na domingo', 'No domingo');
    const ad = revs.find(p => p.antesDepois);
    const gancho = ad ? `${quando} você vê se acertou a pergunta de entrada da p. ${this.pack.pagina(ad.antesDepois.split('#')[0] && this.pack.modelo(ad.antesDepois.split('#')[0]).pagina).n}.` : null;
    let porque = null;
    if (revs.length) {
      const t = st.topicos[revs[0].cap], iv = Plano.intervalos(st, d);
      if (t && t.caixa) {
        porque = `No ${rotuloNivel(t.caixa)}, a revisão vence em ${nDe(iv[t.caixa], 'dia', 'dias')}`;
        porque += t.proxima < prox ? `; ${R.SEMANA_LONGA[R.diaDaSemana(t.proxima)]} é folga, então ela entra na ${R.SEMANA_LONGA[R.diaDaSemana(prox)]}.` : '.';
      }
    } else if (mm.tipo === 'novo') porque = `É o próximo capítulo liberado pela ordem do caderno (regra ${mm.regra}).`;
    else if (mm.tipo === 'questaoDoDia') porque = 'Nada vence nesse dia: a missão é a Questão do dia.';
    else if (mm.tipo === 'topico') porque = mm.frase;
    const pq = mm.passos.find(p => p.id && ['pre', 'checagem', 'questao', 'revisao', 'dia'].includes(p.t));
    let primeira = null;
    try { const it = pq ? this.missao.itemDe(pq.id) : null; if (it) primeira = it.origem === 'enem' ? (it.contexto || it.enunciado) : it.enunciado; } catch (e) { primeira = null; }
    return { dia: prox, data: R.fmtDiaSemana(prox), texto: `${R.fmtDiaSemana(prox)}: ${o}.`, gancho, porque, regra: mm.regra, primeira };
  }
  hoje() {
    const st = this.st, m = st.missao, d = R.hoje();
    if (!st.perfil || !m) return null;
    const cons = Plano.constancia(st, d);
    const vm = {
      data: R.fmtTitulo(d), dia: d,
      constancia: { simbolo: cons.simbolo, diasEstudados: cons.diasEstudados, rotulo: cons.rotulo },
      faixa: m.faixa, recado: m.recado || (m.faixa ? { rotulo: null, texto: m.faixa } : null),
      estado: null, texto: null, bloco: null, acao: null, links: [], prova: null, feito: null, porQue: null,
    };
    const temPassos = m.passos.length > 0;
    const firme = this.M.topicosAtivos(st).every(id => (st.topicos[id] || {}).caixa >= Math.min(3, st.config.nivelMaximo || 5));
    if (m.tipo === 'pausa') { vm.estado = 'pausa'; vm.texto = `Pausa até ${R.fmtDiaMes(st.pausa.ate)}. Nada vence por isso.`; vm.acao = { evento: 'ENCERRAR_PAUSA', rotulo: 'Encerrar pausa' }; }
    else if (m.fechada) {
      vm.estado = m.parcial ? 'encerradoAntes' : 'feito';
      vm.texto = m.parcial ? `Hoje você encerrou no passo ${m.encerradoNoPasso} de ${m.passos.length}. O resto vai para o próximo dia de estudo.` : 'Hoje está feito.';
      const prox = this._proximoDia(d);
      vm.feito = prox ? { previa: prox.gancho ? `${prox.data}: ${prox.gancho.replace(/^(Amanhã|Na \S+|No \S+) /, '')}` : prox.texto, proxima: prox } : null;
      vm.links = [{ rotulo: 'Continuar estudando', aba: 'estudar' }, { rotulo: 'Abrir o caderno', aba: 'caderno' }];
    } else if (m.iniciada) {
      vm.estado = 'emCurso';
      vm.acao = { evento: 'CONTINUAR', rotulo: `Continuar do passo ${m.i + 1} de ${m.passos.length}`, nota: 'A missão fica aberta até a meia-noite.' };
    } else if (m.tipo === 'folga') {
      vm.estado = 'folga'; vm.texto = 'Hoje é folga. Nada vence por isso.'; vm.links = [{ rotulo: 'Continuar estudando', aba: 'estudar' }];
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
      else if (vm.estado === 'firme') vm.texto = `${this.pack.titulo}: todos os capítulos estão no nível 3 de 5 ou acima. As revisões continuam quando vencerem.`;
      else if (vm.estado === 'questaoDoDia') vm.texto = `${cap1(nDe(m.passos.filter(p => p.t === 'dia').length, 'questão', 'questões'))} dos capítulos que você já abriu.`;
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
        cabecalho: this._cabecalho(m),
        regra: this._regraHoje(m, d),
        esmaecido: !!m.hojeNao,
        passos: this._verPassos(m.passos),
        totalPassos: m.passos.length,
      };
      if (!m.iniciada) vm.links = [{ rotulo: 'ver passos' }, { rotulo: 'Por que esta missão?' }, ...(m.hojeNao ? [] : [{ evento: 'HOJE_NAO', rotulo: 'Hoje não' }]), { rotulo: 'Escolher outro tópico', aba: 'estudar' }, ...vm.links];
    }
    if (Prova.provaOferecida(st, this.pack, this.M, m)) {
      vm.prova = { titulo: 'Prova do caderno liberada', texto: `São até ${P.chefe.teto} questões, cerca de ${P.chefe.teto * 3} minutos: mais longa que a sua missão normal.`, regra: Prova.regraProva(this.pack), acao: { evento: 'FAZER_PROVA', rotulo: 'ver a regra' } };
    }
    vm.saudacao = st.perfil.nome ? `Oi, ${st.perfil.nome.split(/\s+/)[0]}` : null;
    vm.proximoRotulo = vm.estado === 'emCurso' ? 'Sua missão de hoje' : 'Seu próximo conteúdo';
    if (m.boasVindas && st.perfil.porque && !m.fechada) vm.porqueEstudo = `Por que eu estudo: ${st.perfil.porque}`;   // d.3
    vm.porQue = this.porQue();
    vm.venceHoje = !m.fechada && !m.livre ? this._venceHoje(m) : null;
    vm.recomeco = this._recomeco(m, d);
    if (vm.recomeco && vm.texto === 'Bem-vindo de volta.') vm.texto = null;
    vm.intencao = this._textoIntencao(d);
    vm.semana = this.semana(d);
    return vm;
  }
  /** "Hoje vence": as revisões de hoje, pelo motor (a data da revisão chegou). */
  _venceHoje(m) {
    const caps = [...new Set(m.passos.filter(p => p.t === 'revisao').map(p => p.cap))];
    if (!caps.length) return null;
    const n = m.passos.filter(p => p.t === 'revisao').length;
    const nomes = caps.map(c => `do ${this._nomeCap(c)}`), lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0];
    const vence = `Hoje ${n === 1 ? 'vence 1 revisão' : `vencem ${n} revisões`} ${lista}.`;
    return { rotulo: 'Hoje vence', n, vence, porque: 'Revisando hoje, você guarda o conteúdo.', texto: `${vence} Revisando hoje, você guarda o conteúdo.` };
  }
  /** "Semana nova" (1ª abertura da semana) ou "Bem-vindo de volta" (3 ou mais dias de estudo sem estudar): sem culpa. */
  _recomeco(m, d) {
    const st = this.st, dias = Object.keys(st.dias || {}), seg = R.segundaDe(d);
    if (!m || m.fechada || m.livre || st.dias[d] || !dias.length || m.tipo === 'pausa') return null;
    const p = st.perfil, pv = this.M.prova(st, d);
    const prova = p.prova && !pv.passou ? (pv.dias === 0 ? `A prova de ${R.fmtDiaMes(p.prova)} é hoje.` : `Faltam ${nDe(pv.dias, 'dia', 'dias')} para a prova de ${R.fmtDiaMes(p.prova)}.`) : 'Sem data de prova marcada: o Prumo planeja para os próximos 90 dias.';
    if (m.boasVindas) return { tipo: 'retorno', titulo: 'Bem-vindo de volta. Nada se perdeu.', prova, visto: 'Termine a missão de hoje e o visto vem com a anotação "retorno".', risquinhos: `Seus ${Plano.rotuloDias(Plano.diasEstudados(st))} continuam aqui.` };
    if (dias.some(x => x < seg) && !dias.some(x => x >= seg)) return { tipo: 'semana', titulo: 'Semana nova: começa limpa', prova, visto: 'A meta da semana recomeça do zero; os risquinhos continuam.', risquinhos: null };
    return null;
  }
  _fmtHora(h) { const [hh, mm] = String(h || '').split(':'); return mm === '00' ? `${Number(hh)}h` : `${Number(hh)}h${mm}`; }
  /** "Seu plano: amanhã, 18h, depois de chegar da escola." (do "quando e onde" do Pronto por hoje) */
  _textoIntencao(d) {
    const it = this.st.intencao;
    if (!it || it.dia < d) return null;
    const quando = it.dia === d ? 'hoje' : R.diff(d, it.dia) === 1 ? 'amanhã' : R.fmtDiaSemana(it.dia);
    return { texto: `Seu plano: ${quando}, ${this._fmtHora(it.horario)}${it.ancora ? `, ${it.ancora}` : ''}.`, dia: it.dia };
  }
  /** "Quando e onde" (no Pronto por hoje): dia, hora e âncora. Alimenta o lembrete (horário do alarme). */
  definirIntencao({ dia, horario, ancora } = {}) {
    const d = R.hoje();
    if (!R.ehDataValida(dia) || dia < d || !/^\d{2}:\d{2}$/.test(horario || '')) return false;
    return this._acao(() => {
      this.st.intencao = { dia, horario, ancora: String(ancora || '').replace(/\s+/g, ' ').trim().slice(0, 80) || null };
      this.st.perfil.horario = horario;
    });
  }
  /** Meta da semana (segunda a domingo): dias estudados nos dias de estudo, com as 7 marcas. A semana seguinte começa limpa. */
  semana(d = R.hoje()) {
    const st = this.st, p = st.perfil;
    if (!p || !p.metaSemana) return null;
    const seg = R.segundaDe(d), dias = [];
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const x = R.addDias(seg, i), estudo = Plano.ehDiaDeEstudo(st, x), feito = !!st.dias[x];
      if (feito && estudo) n++;
      dias.push({ dia: x, rotulo: R.SEMANA_CURTA[R.diaDaSemana(x)], estudado: feito, diaDeEstudo: estudo, hoje: x === d, futuro: x > d });
    }
    const meta = p.metaSemana, ok = n >= meta;
    return { n, meta, cumprida: ok, dias, texto: ok ? `Meta da semana cumprida: ${n} de ${meta} dias.` : `${n} de ${meta} ${meta === 1 ? 'dia' : 'dias'} nesta semana`, rotulo: 'Meta da semana', regra: 'Conta cada dia de estudo do seu plano em que você estudou. Na segunda, a semana começa limpa, e tudo o que você estudou continua nos risquinhos.' };
  }
  /** Coleção de vistos (Perfil): o calendário de um mês com o carimbo nos dias com o visto da missão. mes = 'AAAA-MM'. */
  colecao(mes) {
    const st = this.st, d = R.hoje(), car = st.carimbos || {};
    const m = /^\d{4}-\d{2}$/.test(mes || '') ? mes : d.slice(0, 7);
    const ini = `${m}-01`, MESES = R.MESES;
    const [ano, mm] = m.split('-').map(Number);
    const fim = R.addDias(`${mm === 12 ? ano + 1 : ano}-${String(mm === 12 ? 1 : mm + 1).padStart(2, '0')}-01`, -1);
    const semanas = [];
    let x = R.segundaDe(ini);
    while (x <= fim) {
      const s = [];
      for (let i = 0; i < 7; i++) { s.push({ dia: x, n: Number(x.slice(8)), fora: x.slice(0, 7) !== m, visto: !!car[x], hoje: x === d }); x = R.addDias(x, 1); }
      semanas.push(s);
    }
    const doMes = Object.keys(car).filter(k => k.startsWith(m)).length, total = Object.keys(car).length;
    const primeiro = Object.keys(car).sort()[0] || d;
    const ant = R.addDias(ini, -1).slice(0, 7), seg = R.addDias(fim, 1).slice(0, 7);
    return {
      titulo: 'Coleção de vistos', mes: m, rotuloMes: `${MESES[mm - 1]} de ${ano}`, semanas, cabecalho: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'],
      texto: `${doMes === 1 ? '1 visto' : `${doMes} vistos`} neste mês. ${total === 1 ? '1 visto' : `${total} vistos`} no total.`,
      regra: 'Cada missão terminada num dia estudado ganha o visto do dia. A coleção só cresce.',
      anterior: ant >= primeiro.slice(0, 7) ? ant : null, seguinte: seg <= d.slice(0, 7) ? seg : null,
    };
  }
  /** Folha "Por que esta missão?": a frase simples e, em "ver a regra", a trilha da árvore. */
  porQue() {
    const m = this.st.missao;
    if (!m) return null;
    const d = R.hoje(), soCaderno = Object.assign({}, m, { passos: m.passos.filter(p => p.fonte !== 'pratica') });
    const v = verARegra(this.st, this.pack, this.M, soCaderno, d);
    for (const p of m.passos.filter(x => x.fonte === 'pratica' && x.t === 'revisao')) {
      const t = this.st.topicos[p.cap] || {};
      v.revisoes.push(`Revisão: ${this.prat.titulo(p.cap)}, ${t.proxima === d ? 'vence hoje' : t.proxima < d ? `atrasada desde ${R.fmtCurta(t.proxima)}` : `vence ${R.fmtCurta(t.proxima)}`} (${p.motivo})`);
    }
    const qp = m.passos.filter(x => x.fonte === 'pratica' && x.id && (x.t === 'questao' || x.t === 'revisao')).map(x => this.prat.item(x.id)).filter(Boolean).map(it => `${it.prova.replace(/^Enem /, '').replace(/, .*$/, '')} Q${it.numero}`);
    if (qp.length) v.questoes = v.questoes ? `${v.questoes}, ${qp.join(', ')}` : `Questões do Enem: ${qp.join(', ')}`;
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
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, html: !!a.html, imagem: a.imagem || null })),
      rodape: item.rodape, licencaUrl: item.licencaUrl,
      // cabeçalho do caderno impresso: "QUESTÃO 162" e a prova; questão da equipe: "QUESTÃO DA EQUIPE" e a página
      cabecalho: item.semCabecalho ? null : item.origem === 'enem'
        ? { num: `Questão ${item.numero}`, fonte: item.prova || null }
        : { num: 'Questão da equipe', fonte: item.pagina && this.pack.pagina(item.pagina) ? `p. ${this.pack.pagina(item.pagina).n}` : null },
      imagemFalhou: 'A imagem não carregou; a descrição está abaixo.',
    };
  }
  _rotulos(p, item) {
    const pk = this.pack;
    if (p.fonte === 'pratica') {
      if (p.t === 'pre') return { tipo: 'pre', rotulo: 'Aquecimento: antes da apostila', sub: null, aviso: 'Responda mesmo chutando: você lê a apostila já com a dúvida na cabeça. No fim da leitura você vê se acertou.' };
      if (p.t === 'revisao') return { tipo: 'revisao', rotulo: `Revisão do ${this._nomeCap(p.cap)}`, sub: 'Vale a primeira resposta.' };
      if (p.antecipada) return { tipo: 'antecipada', rotulo: 'Revisão antecipada', sub: `${cap1(this._nomeCap(p.cap))}: não sobe nível.` };
      return { tipo: 'enem', rotulo: 'Questão do Enem', sub: null };
    }
    if (p.t === 'pre') {
      const pg = pk.pagina(p.pagina);
      if (p.alvo === 'bloco') { const n = pk.localDoBloco(p.bloco).n; return { tipo: 'preBloco', rotulo: `Antes do parágrafo ${n}`, sub: null, aviso: `Tente antes de ler. O parágrafo ${n} responde.` }; }
      return { tipo: 'pre', rotulo: `Antes de ler a p. ${pg.n}`, sub: null, aviso: 'Tente antes de ler. Esta página responde.' };
    }
    if (p.t === 'checagem') return { tipo: 'checagem', rotulo: `Confira a p. ${pk.pagina(p.pagina).n}`, sub: null };
    if (p.t === 'revisao') return { tipo: 'revisao', rotulo: `Revisão do ${this._nomeCap(p.cap)}`, sub: 'Vale a primeira resposta.' };
    if (p.t === 'dia') return { tipo: 'dia', rotulo: 'Questão do dia', sub: 'Não muda nível nem agenda.' };
    if (p.antecipada) return { tipo: 'antecipada', rotulo: 'Revisão antecipada', sub: `${this._nomeCap(p.cap)}: não sobe nível.` };
    return item.origem === 'enem' ? { tipo: 'enem', rotulo: 'Questão do Enem', sub: item.rotulo } : { tipo: 'equipe', rotulo: 'Questão da equipe', sub: 'Texto e números da equipe Prumo, licença CC BY-SA 4.0' };
  }
  _medidorPratica(p) {
    const m = this.st.missao;
    if (!p || p.t !== 'questao' || p.antecipada) return null;
    const rod = m.rodada && m.rodada.chave === p.r ? m.rodada : null;
    const n = rod ? rod.corrida.length : 0, rg = regraTopico(this.prat.titulo(p.cap));
    const texto = rod && rod.ultimoErro ? 'Para fechar: 2 certas seguidas, faltam 2' : n === 1 ? rg.falta : null;
    return { casas: [{ cheia: n >= 1, rotulo: '1º acerto' }, { cheia: n >= 2, rotulo: '2º acerto' }], texto, regra: `${rg.frase}. ${rg.insercao}`, descricoes: ['primeiro acerto seguido', 'segundo acerto seguido'] };
  }
  _medidor(p) {
    if (p && p.fonte === 'pratica') return this._medidorPratica(p);
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
    if (rod && rod.ultimoErro) texto = m.passos[m.i] && m.passos[m.i].inserido ? 'A próxima é sobre o trecho que faltou' : 'Para fechar: 2 certas seguidas, faltam 2';
    else if (casa1.cheia && !casa2.cheia) texto = regra.falta;
    else if (!casa1.cheia && casa2.cheia) texto = 'Para fechar: 2 certas seguidas, falta 1';
    return { casas: [casa1, casa2], texto, regra: `${regra.frase}. ${regra.insercao}` };
  }
  /** "faltam 2 questões" (ou "faltam até 3 questões", quando a rodada pode fechar antes); null sem questões pela frente. */
  _faltam(m) {
    const feito = ['feedback', 'trecho', 'fimDaRodada', 'fimDaMao'].includes(this.estado());
    const resto = m.passos.slice(m.i + (feito ? 1 : 0)).filter(p => ['pre', 'checagem', 'questao', 'revisao', 'dia'].includes(p.t));
    if (!resto.length) return null;
    const ate = resto.some(p => p.t === 'questao' && p.papel === 'aplicar' && !p.inserido);
    return `${resto.length === 1 ? 'falta' : 'faltam'} ${ate ? 'até ' : ''}${nDe(resto.length, 'questão', 'questões')}`;
  }
  _topo(p, etapa) {
    const m = this.st.missao, total = m.passos.length;
    const primeiroDaRodada = p && p.r ? m.passos.findIndex(x => x.r === p.r) === m.i : false;
    let regra = p && p.r && p.fonte !== 'pratica' ? regraDaFila(m.passos.filter(x => x.r === p.r), p.cap) : null;
    if (p && p.fonte === 'pratica' && p.t === 'questao') regra = p.antecipada
      ? { frase: 'Revisão antecipada: acerte 2 seguidas para firmar', insercao: 'O nível só sobe na revisão do dia marcado.' }
      : regraTopico(this.prat.titulo(p.cap));
    return {
      etapa, encerrar: 'Encerrar',
      passo: { n: m.i + 1, total }, progresso: total ? m.i / total : 0,
      // legenda da Régua: o passo e o que falta (nunca tempo)
      legenda: { passo: `passo ${Math.min(m.i + 1, total)} de ${total}`, falta: this._faltam(m) },
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
      if (nome === 'trecho' && m.ultima.fonte === 'pratica') return Object.assign({ estado: 'trecho' }, this.teoria(m.ultima.cap), { titulo: `Teoria: ${this.prat.titulo(m.ultima.cap)}`, ancora: null, feedback: fb, acao: { evento: 'VOLTAR', rotulo: 'Voltar ao resultado' } });
      return nome === 'trecho' ? Object.assign({ estado: 'trecho' }, this._trecho(m.ultima.paragrafo), { feedback: fb, acao: { evento: 'VOLTAR', rotulo: 'Voltar ao resultado' } }) : fb;
    }
    if (nome === 'fimDaRodada') return this.fimDaRodada();
    if (nome === 'cards' || nome === 'trechoCard' || nome === 'fimDaMao') return this.mao();
    if (nome === 'leitura' && p.t === 'teoria') return this._leituraTeoria(p);
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
        estado: 'leitura', topo: this._topo(p, `Leitura da p. ${pg.n}`),
        cabeco: `${pk.titulo}, Cap. ${cap.n}`,
        pagina: { id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}` },
        blocos: p.blocos.map(b => this._blocoVM(pk.bloco(b))),
        faixa,
        jaSei: temPergunta ? { evento: 'JA_SEI', rotulo: 'Já sei isto: ir para a próxima pergunta' } : null,
        botao: { evento: 'TERMINEI_TRECHO', rotulo: prox && prox.t === 'pre' && prox.alvo === 'bloco' ? `Continuar: pergunta antes do parágrafo ${pk.localDoBloco(prox.bloco).n}` : 'Terminei de ler' },
        nota: p.fimDaPagina && pg.notaPrompt ? { prompt: pg.notaPrompt, texto: ((st.notas || []).find(n => n.pagina === pg.id) || {}).texto || '', evento: 'SALVAR_NOTA' } : null,
      };
    }
    // pergunta
    const item = this.missao.itemDe(p.id), r = this._rotulos(p, item);
    const primeiraChecagem = p.t === 'checagem' && !Object.values(st.topicos).some(t => (t.tentativas || []).some(x => x.tipo === 'checagem'));
    const etapa = p.fonte === 'pratica' ? (p.t === 'pre' ? 'Aquecimento' : p.t === 'revisao' ? `Revisão do ${this._nomeCap(p.cap)}` : this.prat.curto(p.cap)) : p.t === 'pre' ? `Pergunta da p. ${pk.pagina(p.pagina).n}` : p.t === 'checagem' ? `Confira a p. ${pk.pagina(p.pagina).n}` : p.t === 'revisao' ? `Revisão do ${this._nomeCap(p.cap)}` : p.t === 'dia' ? 'Questão do dia' : r.tipo === 'enem' ? 'Questão do Enem' : r.tipo === 'antecipada' ? 'Revisão antecipada' : 'Questão da equipe';
    return {
      estado: 'pergunta', tipo: r.tipo, rotulo: r.rotulo, subrotulo: r.sub, aviso: r.aviso || null,
      avisoPrimeiraChecagem: primeiraChecagem ? 'Isso fica só no seu celular. Ninguém da escola vê.' : null,
      inserida: !!p.inserido,
      // Pilar III (b.3): a questão inserida depois do erro é anunciada no topo, com o trecho do erro
      avisoInserida: p.inserido ? `Depois do erro: uma questão da equipe sobre ${p.sobre && pk.local(p.sobre) ? `a ${pk.local(p.sobre).rotulo}` : 'o mesmo trecho'}.` : null,
      item: this._itemVM(item), topo: this._topo(p, etapa),
      fase: p.fonte === 'pratica' ? (p.t === 'pre' ? 'aquecer' : 'questoes') : null,
      acao: { evento: 'RESPONDER', rotulo: 'Responder', exige: 'alt' },
    };
  }
  /** Teoria de um tópico de prática, na folha pautada: seções, exemplos resolvidos, armadilhas e resumo. */
  teoria(id) {
    const t = this.prat.get(id);
    if (!t) return null;
    const te = t.teoria, s = x => (Array.isArray(x) ? x.filter(y => typeof y === 'string') : []);
    return {
      teoria: true, id, titulo: te.titulo || t.titulo, cabeco: `${t.materia}: teoria`, porQueCai: te.porQueCai || null,
      secoes: (() => {
        let nEx = 0, nFig = 0;
        const ex = e => (e && typeof e.enunciado === 'string' ? { n: ++nEx, enunciado: e.enunciado, resolucao: s(e.resolucao) } : null);
        return (te.secoes || []).map((x, i) => {
          const fig = x.figura && limparSvg(x.figura.svg) ? { n: ++nFig, svg: limparSvg(x.figura.svg), alt: typeof x.figura.alt === 'string' ? x.figura.alt : '', legenda: typeof x.figura.legenda === 'string' ? x.figura.legenda : null } : null;
          const tb = x.tabela && Array.isArray(x.tabela.linhas) ? { cabecalho: s(x.tabela.cabecalho), linhas: x.tabela.linhas.filter(Array.isArray).map(l => l.map(c => String(c == null ? '' : c))), legenda: typeof x.tabela.legenda === 'string' ? x.tabela.legenda : null } : null;
          const exemplos = [x.exemplo, ...(Array.isArray(x.exemplos) ? x.exemplos : [])].map(ex).filter(Boolean);
          return { n: i + 1, titulo: x.titulo || '', paragrafos: s(x.paragrafos), figura: fig, tabela: tb, atencao: typeof x.atencao === 'string' && x.atencao ? { rotulo: 'No Enem', texto: x.atencao } : null, exemplos };
        });
      })(),
      armadilhas: s(te.armadilhas), resumo: s(te.resumo),
      pagina: { titulo: te.titulo || t.titulo, pe: 'Teoria' },
      credito: 'Texto da equipe Prumo · CC BY-SA 4.0 · revisão em andamento',
      habilidades: (Array.isArray(te.habilidades) ? te.habilidades : []).filter(x => x && typeof x.codigo === 'string').map(x => ({ codigo: x.codigo, descricao: typeof x.descricao === 'string' ? x.descricao : '' })),
      fontes: (Array.isArray(te.fontes) ? te.fontes : []).filter(f => f && typeof f.titulo === 'string').map(f => ({
        titulo: f.titulo, url: /^https:\/\//.test(f.url || '') ? f.url : null, licenca: typeof f.licenca === 'string' ? f.licenca : '',
        licencaUrl: /^https:\/\//.test(f.licencaUrl || '') ? f.licencaUrl : null, adaptado: f.adaptado !== false })),
      adaptacao: typeof te.adaptacao === 'string' ? te.adaptacao : null,
    };
  }
  _leituraTeoria(p) {
    const m = this.st.missao, ant = m.passos[m.i - 1];
    const respondeuAgora = !!(ant && ant.t === 'pre' && ant.fonte === 'pratica' && m.ultimaPre && m.ultimaPre.cap === p.cap);
    const temQuestao = m.passos.slice(m.i + 1).some(x => x.t === 'questao' || x.t === 'revisao');
    return Object.assign(this.teoria(p.cap), {
      estado: 'leitura', fase: 'apostila', topo: this._topo(p, `Apostila: ${this.prat.curto(p.cap)}`),
      faixa: respondeuAgora ? 'Resposta guardada. No fim da apostila você vê se acertou.' : null,
      jaSei: temQuestao || respondeuAgora ? { evento: 'JA_SEI', rotulo: 'Já sei isto: pular a leitura' } : null,
      botao: { evento: 'TERMINEI_TRECHO', rotulo: respondeuAgora ? 'Terminei de ler: ver a pergunta do começo' : temQuestao ? 'Terminei de ler: ir para as questões' : 'Terminei de ler' },
      nota: null,
    });
  }
  _blocoVM(b) {
    const pk = this.pack, notas = this.st.notas || [];
    return { id: b.id, paragrafos: (b.paragrafos || []).map(par => ({ id: par.id, n: pk.local(par.id).n, html: par.html, figura: par.figura || null, notas: notas.filter(n => n.paragrafo === par.id).map(n => ({ id: n.id, texto: n.texto, dia: R.fmtDiaMes(n.dia) })) })) };
  }
  _trecho(parId) {
    const pk = this.pack, loc = pk.local(parId);
    if (!loc) return null;
    const pg = pk.pagina(loc.pagina), cap = pk.capitulo(loc.cap);
    return { cabeco: `${pk.titulo}, Cap. ${cap.n}`, pagina: { id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}` }, blocos: pg.blocos.map(b => this._blocoVM(b)), ancora: parId, rotulo: loc.rotulo, titulo: `p. ${pg.n}, parágrafo ${loc.n}` };
  }
  /** Feedback (c.3e/c.3h): a questão continua na tela com "sua" e "certa", o que faltou e o trecho. */
  feedback() {
    const st = this.st, m = st.missao, pk = this.pack, u = m && m.ultima;
    if (!u) return null;
    if (u.fonte === 'pratica') return this._feedbackPratica(u);
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
      trecho: loc ? { evento: 'VOLTAR_AO_TRECHO', rotulo: `Voltar ao parágrafo ${loc.n}` } : null,
      resolucao: { evento: 'VER_RESOLUCAO', rotulo: 'Ver a resolução da equipe', aberta: !!m.resolucaoAberta, texto: item.explicacao || '' },
      proxima: u.inserida && !u.inserida.cancelada ? `A próxima é uma questão da equipe sobre a ${u.inserida.rotulo}.` : null,
      revisao: null, fimRodada: null,
      medidor: p.r && p.papel ? this._medidorDepois(u, p) : null,
      continuar: { evento: 'CONTINUAR', rotulo: 'Continuar', texto: 'Leia a explicação', pausaMs: this.M.pausa(item), liberaEm: (m.feedbackEm || 0) + this.M.pausa(item), restanteMs: Math.max(0, (m.feedbackEm || 0) + this.M.pausa(item) - R.agora()) },
      som: ok ? 'acerto' : 'erro',
      topo: this._topo(p, r.tipo === 'revisao' ? `Revisão do ${this._nomeCap(p.cap)}` : 'Resultado'),
    };
    if (u.revisao) {
      const fr = u.revisao, cn = this._nomeCap(p.cap);
      if (fr.venceu) {
        vm.revisao = { texto: fr.caixaDepois > fr.caixaAntes ? `Certa. O ${cn} subiu para o ${rotuloNivel(fr.caixaDepois)}. Próxima revisão: ${R.fmtCurta(fr.proxima)}.` : `Certa. O ${cn} continua ${noNivel(fr.caixaDepois)}${st.config.nivelMaximo < 5 && fr.caixaDepois >= st.config.nivelMaximo ? ` (na demo, o nível vai até ${st.config.nivelMaximo} de 5)` : ''}. Próxima revisão: ${R.fmtCurta(fr.proxima)}.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: fr.caixaDepois > fr.caixaAntes } };
        vm.titulo = vm.revisao.texto; vm.som = fr.caixaDepois > fr.caixaAntes ? 'nivel' : 'acerto';
      } else {
        vm.revisao = { texto: `A revisão ${this._de(p.cap)} volta para amanhã. Seus dias estudados e seu histórico continuam.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: false } };
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
  _feedbackPratica(u) {
    const st = this.st, m = st.missao, item = this.missao.itemDe(u.item), p = m.passos[u.passo] || {}, ok = u.res === 'ok', d = R.hoje();
    const alt = item.alternativas.find(a => a.letra === u.alt) || {}, nome = this.prat.titulo(u.cap);
    const depois = m.passos.slice(m.i + 1).some(x => x.t === 'questao' || x.t === 'revisao');
    const vm = {
      estado: 'feedback', tipo: u.revela ? 'revela' : u.t === 'revisao' ? 'revisao' : 'enem',
      rotulo: u.revela ? 'A pergunta do começo' : u.t === 'revisao' ? `Revisão do ${this._nomeCap(u.cap)}` : 'Questão do Enem', subrotulo: null, certa: ok,
      titulo: u.revela ? (ok ? `Antes de ler, você marcou ${u.alt}. Certa.` : `Antes de ler, você marcou ${u.alt}. A certa é ${item.gabarito}.`) : ok ? 'Certa.' : `Você marcou ${u.alt}. A certa é ${item.gabarito}.`,
      porque: u.revela || ok ? item.explicacao || null : null,
      falta: u.revela || ok ? null : alt.falta || null,
      item: this._itemVM(item),
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, html: !!a.html, imagem: null, marca: a.letra === u.alt && a.certa ? 'sua-certa' : a.letra === u.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: !u.revela && !ok ? { evento: 'VOLTAR_AO_TRECHO', rotulo: 'Rever a teoria' } : null,
      resolucao: !u.revela && !ok && item.explicacao ? { evento: 'VER_RESOLUCAO', rotulo: 'Ver a resolução da equipe', aberta: !!m.resolucaoAberta, texto: item.explicacao } : null,
      proxima: u.revela && depois ? 'Agora, as questões do Enem, da mais fácil para a mais difícil.' : null,
      revisao: null, fimRodada: null,
      medidor: !u.revela && p.t === 'questao' && !p.antecipada ? this._medidorDepois(u, p) : null,
      continuar: { evento: 'CONTINUAR', rotulo: 'Continuar', texto: 'Leia a explicação', pausaMs: u.pausaMs, liberaEm: (m.feedbackEm || 0) + u.pausaMs, restanteMs: Math.max(0, (m.feedbackEm || 0) + u.pausaMs - R.agora()) },
      som: u.revela ? null : ok ? 'acerto' : 'erro',
      topo: this._topo(p, u.revela ? `Teoria de ${this.prat.curto(u.cap)}` : 'Resultado'),
    };
    if (u.revisao) {
      const fr = u.revisao;
      if (fr.venceu) { vm.revisao = { texto: `Certa. ${nome} ${fr.caixaDepois > fr.caixaAntes ? `subiu para o ${rotuloNivel(fr.caixaDepois)}` : `continua ${noNivel(fr.caixaDepois)}`}. Próxima revisão: ${R.fmtCurta(fr.proxima)}.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: fr.caixaDepois > fr.caixaAntes } }; vm.titulo = vm.revisao.texto; vm.som = fr.caixaDepois > fr.caixaAntes ? 'nivel' : 'acerto'; }
      else { vm.revisao = { texto: `A revisão ${this._de(u.cap)} volta para amanhã. Seus dias estudados e seu histórico continuam.`, nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: false } }; vm.som = null; }
    }
    if (u.fimRodada) {
      const fr = m.fimRodada || m.resumo.rodadas[m.resumo.rodadas.length - 1];
      if (fr) vm.fimRodada = { venceu: fr.venceu, texto: this._textoFimRodada(fr).texto, direto: !this.missao.restaPasso() };
      if (fr && fr.venceu && !fr.extra) vm.som = 'nivel';
    }
    return vm;
  }
  _medidorDepois(u, p) {
    const md = this._medidor(p);
    if (!md) return null;
    if (u.res === 'erro') md.texto = u.inserida && !u.inserida.cancelada ? 'A próxima é sobre o trecho que faltou' : 'Para fechar: 2 certas seguidas, faltam 2';
    if (u.fimRodada) { const fr = this.st.missao.fimRodada || this.st.missao.resumo.rodadas.slice(-1)[0]; if (fr && fr.venceu) { md.casas = md.casas.map(c => Object.assign({}, c, { cheia: true })); md.texto = null; } }
    return md;
  }
  _fimRodadaPratica(fr) {
    const nome = this.prat.titulo(fr.cap), d = R.hoje();
    if (fr.extra) return { variante: fr.venceu ? 'venceu' : 'teto', texto: fr.venceu ? `Revisão antecipada vencida. O nível de ${nome} só sobe na revisão do dia marcado (${R.fmtCurta(fr.proxima)}).` : `A revisão antecipada mostrou que ${nome} está escapando: a revisão passou para amanhã, ${R.fmtCurta(fr.proxima)}.` };
    if (fr.venceu) return { variante: 'venceu', texto: `${nome} entrou ${noNivel(fr.caixaDepois)}. A primeira revisão fica para ${dataRevisao(fr.proxima, d)}.` };
    const resta = ineditas(this.st, this.prat, fr.cap).length;
    const prox = resta ? `Na próxima vez, o tópico continua com ${resta === 1 ? 'a questão que falta' : `as ${resta} questões que faltam`}.` : 'As questões deste tópico voltam quando fizer 7 dias que você as viu.';
    if (fr.naoFecha) return { variante: 'naoFecha', texto: `Com as questões que restam hoje, não dá mais para acertar duas seguidas. ${prox}` };
    return { variante: 'teto', texto: `Rodada encerrada em ${nDe(fr.tentativas, 'questão', 'questões')}, sem duas certas seguidas. Nada se perde. ${prox}` };
  }
  _textoFimRodada(fr) {
    if (fr.fonte === 'pratica') return this._fimRodadaPratica(fr);
    const pk = this.pack, c = pk.capitulo(fr.cap), d = R.hoje();
    if (fr.extra) return { variante: fr.venceu ? 'venceu' : 'teto', texto: fr.venceu ? `Revisão antecipada vencida. O nível do Cap. ${c.n} só sobe na revisão do dia certo (${R.fmtCurta(fr.proxima)}).` : `A revisão antecipada mostrou que o Cap. ${c.n} está escapando: a revisão dele passou para amanhã, ${R.fmtCurta(fr.proxima)}.` };
    if (fr.venceu) return { variante: 'venceu', texto: `${c.titulo} entrou ${noNivel(fr.caixaDepois)}. A primeira revisão fica para ${dataRevisao(fr.proxima, d)}.` };
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
      nivel: { de: fr.caixaAntes, para: fr.caixaDepois, nome: rotuloNivel(fr.caixaDepois), rotulo: rotuloNivel(fr.caixaDepois), animar: !!fr.venceu && !fr.extra && fr.caixaDepois > fr.caixaAntes },
      som: fr.venceu && !fr.extra ? 'nivel' : null,
      cards: fr.cardsRecebidos ? `Os ${fr.cardsRecebidos} cartões do ${this._nomeCap(fr.cap)} entraram no seu baralho.` : null,
      acao: { evento: 'SEGUIR', rotulo: 'Seguir' },
      topo: this._topo(m.passos[m.i], 'Fim da rodada'),
    };
  }
  /** Mão de cards (Decisão 1): frente → Virar → verso → Lembrei / Ainda não. */
  mao() {
    const st = this.st, m = st.missao, mao = m.mao, nome = this.estado(), pk = this.pack;
    if (!mao) return null;
    if (nome === 'fimDaMao') return { estado: 'fimDaMao', resumo: (m.resumo.cards || {}).texto || '', acao: { evento: 'SEGUIR', rotulo: 'Seguir' }, topo: this._topo(m.passos[m.i], 'Cartões') };
    const id = mao.pendente ? mao.pendente.id : Cards.cardAtual(mao);
    const k = pk.card(id), loc = pk.localDoCard(k), e = st.cards[id] || {};
    const trecho = loc ? { rotulo: `Ver o parágrafo ${loc.n} da p. ${loc.paginaN}`, evento: 'VER_TRECHO', pagina: loc.pagina, paragrafo: loc.paragrafo } : null;
    if (nome === 'trechoCard') return Object.assign({ estado: 'trechoCard' }, this._trecho(loc.paragrafo), { acao: { evento: 'VOLTAR', rotulo: 'Voltar ao cartão' } });
    const repeticao = mao.respostas[id] !== undefined && !mao.pendente;
    return {
      estado: 'cards', id, frente: k.frente, verso: k.verso, virado: !!mao.virado,
      // a ficha mostra "revisão N de 5" (a caixa de Leitner do card, de 1 a 5) e o capítulo
      caixa: { n: e.caixa, nome: `revisão ${Math.max(1, e.caixa || 1)} de 5`, rotulo: `revisão ${Math.max(1, e.caixa || 1)} de 5` }, cap: loc ? `Cap. ${loc.capN}` : '',
      repeticao, rotulo: repeticao ? 'Cartão de volta' : 'Cartão',
      posicao: `${Math.min(mao.i + 1, mao.fila.length)} de ${mao.fila.length}`,
      acoes: mao.pendente ? [{ evento: 'SEGUIR', rotulo: 'Próximo cartão' }] : mao.virado ? [{ evento: 'LEMBREI', rotulo: 'Lembrei' }, { evento: 'AINDA_NAO', rotulo: 'Ainda não' }] : [{ evento: 'VIRAR', rotulo: 'Virar' }],
      pendente: mao.pendente ? { texto: mao.pendente.repeticao ? 'Ainda não. Ele volta em outro dia, pela agenda.' : 'Ainda não. Este cartão volta uma vez no fim desta mão.', trecho } : null,
      trecho: mao.virado || mao.pendente ? trecho : null,
      animacaoMs: 180,
      regra: Cards.REGRA_CARDS,
      topo: this._topo(m.passos[m.i], 'Cartões'),
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
      const cn = this._nomeCap(fr.cap);
      if (fr.extra) mud.push({ tipo: 'antecipada', texto: fr.venceu ? `A revisão antecipada do ${cn} fechou. O nível só sobe na revisão do dia certo.` : `A revisão do ${cn} ficou para amanhã.` });
      else if (fr.venceu) mud.push({ tipo: 'nivel', texto: `O ${cn} entrou ${noNivel(fr.caixaDepois)}. Próxima revisão: ${dataRevisao(fr.proxima, d)}.`, nivel: { cap: fr.cap, de: fr.caixaAntes, para: fr.caixaDepois, animar: true } });
      else mud.push({ tipo: 'teto', texto: `${cap1(this._curto(fr.cap))}: ${this._textoFimRodada(fr).texto}` });
      if (fr.cardsRecebidos) mud.push({ tipo: 'cards', texto: `Os ${fr.cardsRecebidos} cartões do ${cn} entraram no seu baralho.` });
    }
    for (const rv of res.revisoes) {
      const cn = this._nomeCap(rv.cap);
      mud.push(rv.venceu ? { tipo: 'revisao', texto: `O ${cn} ${rv.caixaDepois > rv.caixaAntes ? `subiu para o ${rotuloNivel(rv.caixaDepois)}` : `continua ${noNivel(rv.caixaDepois)}`}. Próxima revisão: ${R.fmtCurta(rv.proxima)}.`, nivel: { cap: rv.cap, de: rv.caixaAntes, para: rv.caixaDepois, animar: rv.caixaDepois > rv.caixaAntes } }
        : { tipo: 'revisao', texto: `A revisão ${this._de(rv.cap)} volta para amanhã. Seus dias estudados e seu histórico continuam.`, nivel: { cap: rv.cap, de: rv.caixaAntes, para: rv.caixaDepois, animar: false } });
    }
    const pres = m.passos.filter(p => p.t === 'pre'), ultimoFeito = m.parcial ? m.i - 1 : m.passos.length - 1;
    if (pres.length && res.pres > 0 && pres.every(p => m.passos.indexOf(p) <= ultimoFeito || (!m.parcial))) mud.push({ tipo: 'antes', texto: pres.some(p => p.fonte === 'pratica') ? 'Você tentou responder antes de ler a teoria.' : 'Você tentou antes de ler em todos os trechos cobrados.' });
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
    } else if (m.tipo === 'topico' && !subiu && res.tentativas > 0 && !res.rodadas.length) {
      mud.push({ tipo: 'nada', texto: `Hoje não subiu nível. Ficaram registradas ${nDe(res.tentativas, 'tentativa', 'tentativas')}.` });
    }
    const ultimaRodada = res.rodadas.length ? res.rodadas[res.rodadas.length - 1] : null;
    const prox = this._proximoDia(d);
    const umaVezPorSemana = !st.config.ultimaCopia || R.diff(st.config.ultimaCopia, d) >= 7;
    // o visto do dia (só quando o dia conta como estudado): a data e o que mudou, em poucas palavras
    const revOk = res.revisoes.filter(x => x.venceu).slice(-1)[0];
    const obsVisto = ultimaRodada && ultimaRodada.venceu && !ultimaRodada.extra ? `${this._curto(ultimaRodada.cap)}, ${rotuloNivel(ultimaRodada.caixaDepois)}`
      : revOk ? `${this._curto(revOk.cap)}, ${rotuloNivel(revOk.caixaDepois)}` : null;
    return {
      estado: 'encerramento', titulo: m.livre ? 'Estudo registrado' : 'Pronto por hoje', data: R.fmtLonga(d), livre: !!m.livre,
      quando: prox && !m.livre ? {
        pergunta: 'Quando e onde você estuda na próxima vez?', dia: prox.dia, rotuloDia: prox.data,
        horario: (st.intencao && st.intencao.dia === prox.dia && st.intencao.horario) || st.perfil.horario || '19:00',
        ancoras: ['depois que eu chegar da escola', 'depois do almoço', 'antes de dormir'],
        ancora: st.intencao && st.intencao.dia === prox.dia ? st.intencao.ancora : null,
        salvo: st.intencao && st.intencao.dia === prox.dia ? this._textoIntencao(d).texto : null,
        lembrete: `Com isso, o alarme do Prumo fica para as ${(st.intencao && st.intencao.dia === prox.dia && st.intencao.horario) || st.perfil.horario || '19:00'}. Ajuste no app Relógio, se quiser.`,
      } : null,
      amanha: prox && prox.primeira && !m.livre ? { rotulo: 'Amanhã começa por aqui', html: prox.primeira, aviso: 'Só para pensar no caminho. A resposta fica para a missão.' } : null,
      continuar: { rotulo: 'Continuar estudando', aba: 'estudar', texto: 'Se quiser, pode continuar estudando por conta própria.' },
      visto: st.dias[d] && !m.livre ? (() => { const obs = m.boasVindas ? ['retorno', obsVisto].filter(Boolean).join(', ') : obsVisto; return { palavra: 'Visto', data: R.fmtCompleta(d), obs, retorno: !!m.boasVindas, rotulo: `Visto de ${R.fmtCompleta(d)}${obs ? `. ${obs}` : ''}` }; })() : null,
      fecho: m.livre ? 'Estudo por conta própria: conta como dia estudado e muda o nível pelas mesmas regras. O visto de hoje é o da missão. Está tudo guardado neste aparelho.' : 'Por hoje é isso. Está tudo guardado neste aparelho.',
      constancia: { simbolo: cons.simbolo, diasEstudados: cons.diasEstudados, rotulo: cons.rotulo, tracoDeHoje: !!st.dias[d] },
      semanaPassada: st.dias[d] ? Plano.linhaSemanaPassada(st, d) : null,
      mudancas: mud,
      nivelAnimado: ultimaRodada && ultimaRodada.venceu && !ultimaRodada.extra ? { cap: ultimaRodada.cap, de: ultimaRodada.caixaAntes, para: ultimaRodada.caixaDepois, nome: rotuloNivel(ultimaRodada.caixaDepois), rotulo: rotuloNivel(ultimaRodada.caixaDepois) } : null,
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
    const r = item.origem === 'enem' ? { rotulo: 'Questão do Enem', sub: item.rotulo } : { rotulo: 'Questão da equipe', sub: 'Texto e números da equipe Prumo, licença CC BY-SA 4.0' };
    if (nome === 'provaPergunta') return { estado: 'provaPergunta', rotulo: r.rotulo, subrotulo: r.sub, item: this._itemVM(item), topo, acao: { evento: 'RESPONDER', rotulo: 'Responder', exige: 'alt' }, reaproveita: pr.reaproveita ? 'Nesta demo, a prova reaproveita questões.' : null };
    const u = pr.ultima, ok = u.res === 'ok', alt = item.alternativas.find(a => a.letra === u.alt) || {}, loc = u.paragrafo ? pk.local(u.paragrafo) : null;
    const fb = {
      estado: 'provaFeedback', rotulo: r.rotulo, subrotulo: r.sub, certa: ok,
      titulo: ok ? 'Certa.' : `Você marcou ${u.alt}. A certa é ${item.gabarito}.`, porque: ok ? item.explicacao || null : null, falta: ok ? null : alt.falta || null,
      item: this._itemVM(item),
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem || null, marca: a.letra === u.alt && a.certa ? 'sua-certa' : a.letra === u.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: loc ? { evento: 'VOLTAR_AO_TRECHO', rotulo: `Voltar ao parágrafo ${loc.n}` } : null,
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
          : `Libera quando ${listaCaps((c.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq).map(p => pk.capitulo(p).n))} ${(c.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq).length > 1 ? 'estiverem' : 'estiver'} no nível 1 de 5.`;
      } else if (e === 'novo') estado = 'Ainda não começou.';
      else if (e === 'pratica') estado = 'Começado. Falta acertar duas seguidas para entrar no nível 1 de 5.';
      else if (e === 'agendado') estado = 'Revisão marcada para hoje.';
      else if (e === 'vencido') { const n = R.diff(t.proxima, d); estado = `Revisão atrasada há ${nDe(n, 'dia', 'dias')}.`; }
      else estado = ultRev && !ultRev.venceu && ultRev.dia === [...(t.rodadas || [])].slice(-1)[0].dia ? `Voltou para o nível ${t.caixa} de 5. Próxima revisão: ${R.fmtQuando(t.proxima, d)}.` : `Em dia. Próxima revisão: ${R.fmtCurta(t.proxima)}.`;
      const pre = Object.entries(st.pre || {}).find(([id, x]) => x.cap === c.id && x.revelado);
      let antesDepois = null;
      if (pre) {
        const [id, x] = pre, tent = (t.tentativas || []).find(y => y.item === id && y.dia === x.revelado);
        if (tent) antesDepois = `Na 1ª revisão (${R.fmtCurta(x.revelado)}): antes de ler, você tinha marcado ${x.alt}; na revisão, marcou ${tent.alt}${tent.res === 'ok' ? ', a certa' : ''}.`;
      }
      return {
        id: c.id, n: c.n, titulo: c.titulo, paginas: ns.length > 1 ? `p. ${ns[0]}–${ns[ns.length - 1]}` : `p. ${ns[0]}`, paginaIds: (c.paginas || []).map(p => p.id),
        nivel: { caixa: t.caixa || 0, nome: t.caixa ? rotuloNivel(t.caixa) : null, rotulo: rotuloNivel(t.caixa || 0), segmentos: 5, cheios: t.caixa || 0 },
        estado, bloqueado: e === 'bloqueado', regra, antesDepois, cards: (st.baralho || {})[c.id] ? (c.cards || []).length : 0,
        verARegra: M.porqueEstado(st, c.id, d),
      };
    });
    const ce = M.chefeEstado(st, pk.id), ch = st.chefes[pk.id];
    return {
      titulo: pk.titulo, materia: MATERIAS[pk.materia] || pk.materia,
      avisoDemo: null,
      capitulos: caps,
      prova: {
        regra: Prova.regraProva(pk), estado: ce === 'vencido' ? 'vencida' : ce === 'disponivel' ? 'liberada' : 'bloqueada',
        texto: ce === 'vencido' ? `Vencida em ${R.fmtCompleta(ch.dia)}.` : ce === 'disponivel' ? 'Liberada. Ela aparece em Hoje antes de você começar a missão do dia, ou num dia de folga.' : 'Ela libera quando todos os capítulos chegarem ao nível 2 de 5.',
        trofeu: { ganho: ce === 'vencido', nome: pk.titulo, dia: ce === 'vencido' ? ch.dia : null, tentativasFeitas: ch ? ch.tentativasFeitas || (ch.venceu ? 1 : 0) : 0 },
        selos: (st.selos || []).map(s => ({ materia: s, nome: MATERIAS[s] || s })),
      },
      marcos: MARCOS.map(mc => ({ id: mc.id, nome: mc.nome, condicao: mc.condicao, dia: st.marcos[mc.id] || null, texto: st.marcos[mc.id] ? `em ${R.fmtCompleta(st.marcos[mc.id])}` : null })),
      creditos: { rotulo: 'Créditos deste caderno' },
      niveis: [1, 2, 3, 4, 5].map(k => ({ n: k, nome: rotuloNivel(k) })),
      regraNivel: 'Cada capítulo tem 5 níveis, de 1 a 5. Acertar duas seguidas na primeira vez põe o capítulo no nível 1 de 5. Depois, cada revisão que você acerta de primeira sobe um nível, e a revisão seguinte fica mais longe. Errar uma revisão volta o capítulo para o nível 1 de 5; nada do que você fez se apaga.',
    };
  }
  /** Leitor do Caderno (c.6): qualquer página abre a qualquer hora. Ler não conta como dia estudado. */
  pagina(id) {
    const pk = this.pack, pg = pk.pagina(id);
    if (!pg) return null;
    const capId = pk.capDaPagina(id), c = pk.capitulo(capId), todas = pk.capitulos.flatMap(x => x.paginas || []), i = todas.findIndex(x => x.id === id);
    return {
      cabeco: `${pk.titulo}, Cap. ${c.n}`, id: pg.id, n: pg.n, titulo: pg.titulo, pe: `p. ${pg.n}`,
      blocos: pg.blocos.map(b => this._blocoVM(b)), notaPrompt: pg.notaPrompt || null,
      irAlem: (c.irAlem || []).map(l => ({ rotulo: l.rotulo, url: l.url, aviso: l.aviso, tipo: l.tipo })),
      credito: pg.fonte ? { fonte: pg.fonte.fonte, url: pg.fonte.url || null, licenca: pg.fonte.licenca, alteracoes: pg.fonte.alteracoes || null, revisao: pg.fonte.revisao || null } : { fonte: 'Equipe Prumo', licenca: pk.dados.licencaPadrao },
      anterior: i > 0 ? todas[i - 1].id : null, seguinte: i < todas.length - 1 ? todas[i + 1].id : null,
    };
  }
  _situacaoErro(e) {
    const t = this.st.topicos[e.cap] || {}, d = R.hoje();
    const c = this.pack.capitulo(e.cap);
    if (e.estado === 'resolvido') return `Resolvido: você acertou uma questão parecida em ${R.fmtDiaMes(e.resolvidoEm)}.`;
    if (!c) return 'Uma questão parecida volta numa próxima revisão.';
    return t.caixa && t.proxima ? `Uma questão parecida, com outros números, volta na revisão do Cap. ${c.n}, ${t.proxima <= d ? 'hoje' : R.fmtCurta(t.proxima)}.` : `Uma questão parecida, com outros números, volta quando você revisar o Cap. ${c.n}.`;
  }
  _refazerInfo(e) {
    const st = this.st, d = R.hoje(), m = st.missao;
    const mp = this._modeloRefazer(e);
    const rotulo = 'Refazer com outros números', nota = 'Uma vez por dia. Não muda o nível.';
    if (m && m.dia === d && m.fechada) return { disponivel: false, rotulo, nota, motivo: 'Abre amanhã: hoje você já terminou o dia de estudo.' };
    if (e.refazerEm === d) return { disponivel: false, rotulo, nota, motivo: 'Abre amanhã: você já refez esta hoje.' };
    if (!mp || e.refazerLinha > 10 || e.refazerLinha >= (mp.linhas || []).length) return { disponivel: false, rotulo, nota, motivo: 'Por enquanto não há outra versão desta questão.' };
    return { disponivel: true, rotulo, nota, motivo: null };
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
        questao: it ? { rotulo: it.origem === 'enem' ? `Questão ${it.numero} do ${it.prova}` : `Questão da equipe${it.pagina ? ` sobre a p. ${pk.pagina(it.pagina).n}` : ''}`, enunciado: it.origem === 'enem' ? it.contexto : it.enunciado, introducao: it.introducao || '', imagens: it.imagens || [], rodape: it.rodape, alternativas: it.alternativas.map(a => ({ letra: a.letra, texto: a.texto, marca: a.letra === e.marcou ? 'sua' : a.certa ? 'certa' : null })) } : null,
        linha: `Você marcou ${e.marcou}. A certa é ${e.certa}.`,
        falta: e.falta || null, anotacao: e.anotacao || '', foiIsso: { valor: e.foiIsso, pergunta: 'Foi isso?', opcoes: [{ valor: 'sim', rotulo: 'Sim' }, { valor: 'outra', rotulo: 'Foi outra coisa' }] },
        trecho: loc ? { rotulo: `Abrir o trecho (p. ${loc.paginaN}, parágrafo ${loc.n})`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
        situacao: this._situacaoErro(e), estado: e.estado,
        refazer: this._refazerInfo(e),
        irAlem: c ? (c.irAlem || []).map(l => ({ rotulo: l.rotulo, url: l.url, aviso: l.aviso })) : [],
      };
    });
    return {
      filtros: pk.capitulos.map(c => ({ cap: c.id, rotulo: `Cap. ${c.n}`, n: todos.filter(e => e.cap === c.id).length })), filtro: filtroCap,
      itens,
      vazio: !todos.length ? 'Nenhum erro guardado ainda. Quando você errar uma questão, ela vem para cá com o trecho do caderno que explica.' : !itens.length ? 'Nenhum erro neste capítulo.' : null,
    };
  }
  notas() {
    const pk = this.pack;
    const porCap = pk.capitulos.map(c => ({
      cap: c.id, titulo: `Cap. ${c.n}: ${c.titulo}`,
      notas: (this.st.notas || []).filter(n => pk.local(n.paragrafo) && pk.local(n.paragrafo).cap === c.id).map(n => ({ id: n.id, texto: n.texto, dia: R.fmtDiaMes(n.dia), trecho: { rotulo: `Abrir a p. ${pk.local(n.paragrafo).paginaN}, parágrafo ${pk.local(n.paragrafo).n}`, pagina: pk.local(n.paragrafo).pagina, paragrafo: n.paragrafo } })),
    })).filter(x => x.notas.length);
    return { capitulos: porCap, vazio: porCap.length ? null : 'Suas notas aparecem aqui. No fim de cada página, o Prumo pergunta uma coisa; a resposta fica guardada.' };
  }
  cardsDoCaderno() {
    return { capitulos: Cards.cardsDoCaderno(this.st, this.pack, R.hoje()), regra: Cards.REGRA_CARDS, aviso: 'Aqui você lê os seus cartões quando quiser. Para treinar com eles, eles aparecem na missão do dia.' };
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
        if (m.fechada) linha.status = m.parcial ? 'encerrada antes do fim' : 'feito';
        if (m.tipo === 'novo') linha.itens.push(`${this._nomeCap(m.cap)} (novo)`);
        else if (m.tipo === 'pratica') linha.itens.push(`${this._nomeCap(m.cap)} (continuação)`);
        else if (m.tipo === 'antecipada') linha.itens.push(`revisão antecipada do ${this._nomeCap(m.cap)}`);
        else if (m.tipo === 'questaoDoDia') linha.itens.push('Questão do dia');
        else if (m.tipo === 'topico') linha.itens.push(this.prat.titulo(m.cap));
        const revs = m.passos.filter(p => p.t === 'revisao');
        revs.forEach(p => atribuidos.add(p.cap));
        if (revs.length) linha.itens.push(this._revisoes(revs.map(p => p.cap)));
        const cd = m.passos.find(p => p.t === 'cards');
        if (cd) { cd.ids.forEach(x => cardsAtrib.add(x)); linha.itens.push(nDe(cd.ids.length, 'cartão', 'cartões')); }
      } else if (linha.tipo === 'estudo') {
        const devidos = [...this.M.topicosAtivos(st), ...this.prat.ids()].filter(id => { const t = st.topicos[id]; return t && t.caixa && t.proxima && t.proxima <= dia && !atribuidos.has(id); });
        devidos.forEach(x => atribuidos.add(x));
        if (devidos.length) linha.itens.push(this._revisoes(devidos));
        const cs = Object.entries(st.cards || {}).filter(([id, c]) => c.proxima <= dia && !cardsAtrib.has(id)).slice(0, Cards.MAO_MAX);
        cs.forEach(([id]) => cardsAtrib.add(id));
        if (cs.length) linha.itens.push(nDe(cs.length, 'cartão', 'cartões'));
        if (!linha.itens.length) linha.itens.push('sem revisão vencida');
      }
      const its = linha.itens, frase = its.length > 1 ? `${its.slice(0, -1).join(', ')} e ${its[its.length - 1]}` : (its[0] || '');
      linha.texto = `${cap1(linha.rotulo)}: ${linha.tipo === 'folga' ? 'folga' : linha.tipo === 'pausa' ? 'pausa' : frase}${linha.status ? `, ${linha.status}` : ''}.`;
      out.push(linha);
    }
    const firme = this.M.topicosAtivos(st).length && this.M.topicosAtivos(st).every(id => (st.topicos[id] || {}).caixa >= Math.min(3, st.config.nivelMaximo || 5));
    const iv = Plano.intervalos(st, d);
    return {
      dias: out, tudoFirme: firme ? 'Todos os capítulos estão no nível 3 de 5 ou acima. As revisões seguem a agenda abaixo.' : null,
      porQueEstaOrdem: `As revisões vencem pela agenda calculada a partir da data da prova: no nível 1 de 5, ${nDe(iv[1], 'dia', 'dias')}; no nível 2, ${iv[2]}; no 3, ${iv[3]}; no 4, ${iv[4]}; no 5, ${iv[5]}. Revisão que vence numa folga entra no próximo dia de estudo, e as atrasadas vêm primeiro. Capítulo novo e Questão do dia dependem do que acontecer até lá, por isso a agenda mostra só o que já está marcado.`,
    };
  }
  plano() {
    const st = this.st, d = R.hoje(), p = st.perfil;
    if (!p) return null;
    return {
      prova: Plano.resumoProva(st, d),
      tiposProva: TIPOS_PROVA,
      dias: { valor: p.dias, texto: `${cap1(Plano.textoDiasLongo(p.dias))}, ${p.minutos} minutos por dia.` },
      minutos: { valor: p.minutos, opcoes: [15, 25, 40], capacidade: Plano.capacidade(st) },
      meta: { valor: p.metaSemana, texto: p.metaSemana ? `Estudar ${nDe(p.metaSemana, 'dia', 'dias')} por semana (opcional).` : 'Sem meta por semana.', regra: 'Você só vê se cumpriu a meta depois que a semana termina. Estudar num dia de folga ganha risquinho, mas não conta para a meta.' },
      pausa: st.pausa && st.pausa.ate ? { ativa: true, ate: st.pausa.ate, texto: `Pausa até ${R.fmtDiaMes(st.pausa.ate)}. As revisões esperam: nenhuma fica atrasada por causa da pausa.`, acao: 'Encerrar pausa' } : { ativa: false, texto: 'Sem pausa. Se precisar parar de 1 a 14 dias (viagem, semana de provas), marque uma pausa: as revisões esperam.' },
      lembrete: { texto: textoAlarme(p.dias, p.horario), como: 'Crie esse alarme no app Relógio do celular. O Prumo não manda notificação.' },
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
      som: { valor: !!c.som, rotulo: 'Som', nota: 'Começa desligado. Tudo o que o som avisa também aparece na tela.' },

      dados: {
        copia: { rotulo: 'Salvar uma cópia do meu progresso', ultima: c.ultimaCopia ? `Última cópia: ${R.fmtDiaMes(c.ultimaCopia)}` : 'Nenhuma cópia salva ainda.' },
        csv: { rotulo: 'Baixar minhas respostas (planilha CSV)' },
        restaurar: { rotulo: 'Restaurar uma cópia' },
        copiarTexto: { rotulo: 'Copiar dados' },
        apagar: { rotulo: 'Apagar tudo', confirmacao: 'Apagar todo o progresso deste aparelho? Isso não pode ser desfeito. Salve uma cópia antes, se quiser guardar.' },
      },
      demo: { ativo: !!c.demo.ativo, exemplo: !!c.demo.exemplo, data: R.fmtDiaMes(d), offset: c.demo.offset, explica: 'Serve para ver como o Prumo funciona: dados de exemplo e uma data simulada. O seu progresso real fica guardado.', acoes: [{ rotulo: 'avançar 1 dia', dias: 1 }, { rotulo: 'avançar 7 dias', dias: 7 }, { rotulo: 'carregar estado de exemplo' }] },
      falhaSalvar: this.falhaSalvar ? E.MSG_FALHA_SALVAR : null,
    };
  }
  creditos() {
    const c = this.pack.creditos();
    c.app = [
      { item: 'Gabarito (marca e títulos)', licenca: 'SIL Open Font License 1.1', fonte: 'arquivo incluído no app' },
      { item: 'Atkinson Hyperlegible Next (texto)', licenca: 'SIL Open Font License 1.1', fonte: 'arquivo incluído no app' },
      { item: 'Atkinson Hyperlegible Mono (números)', licenca: 'SIL Open Font License 1.1', fonte: 'arquivo incluído no app' },
      { item: 'Código do Prumo', licenca: 'da equipe do TCC', fonte: 'ETEC Jornalista Roberto Marinho' },
    ];
    return c;
  }

  /* =========================================================
     Estudar: o mapa (área → matéria → tópico) e a página do tópico
     ========================================================= */
  _textoEstadoTopico(e, t, d) {
    if (e === 'novo') return 'Ainda não começou.';
    if (e === 'pratica') return 'Começado. Acerte 2 questões seguidas para entrar no nível 1 de 5.';
    if (e === 'agendado') return `${cap1(rotuloNivel(t.caixa))}. Revisão marcada para hoje.`;
    if (e === 'vencido') return `${cap1(rotuloNivel(t.caixa))}. Revisão atrasada desde ${R.fmtCurta(t.proxima)}.`;
    return `${cap1(rotuloNivel(t.caixa))}. Próxima revisão: ${R.fmtCurta(t.proxima)}.`;
  }
  /** Resumo de um tópico de prática para o mapa. Arquivo ausente ou inválido: "em preparação". */
  _resumoTopico(id) {
    const t = this.prat.get(id), con = CONHECIDOS.find(c => c.id === id) || {};
    if (!t) return { id, titulo: con.titulo || id, disponivel: false, emPreparacao: true, estadoTexto: 'Em preparação: as questões deste tópico ainda estão sendo conferidas.', nivel: null, progresso: null };
    const st = this.st, d = R.hoje(), x = st.topicos[id] || {}, e = estadoTopico(st, this.prat, id, d);
    const total = t.itens.length, feitas = t.itens.filter(q => st.vistos[q.id]).length;
    return {
      id, titulo: t.titulo, descricao: t.topico.descricao || '', disponivel: true, emPreparacao: false, caderno: false,
      nivel: { cheios: x.caixa || 0, nome: x.caixa ? rotuloNivel(x.caixa) : null, rotulo: rotuloNivel(x.caixa || 0) }, estado: e,
      estadoTexto: this._textoEstadoTopico(e, x, d),
      progresso: { feitas, total, texto: `${feitas} de ${total} questões do Enem feitas` },
    };
  }
  /** O caderno completo (Funções afins) como um tópico do mapa: o nível é o do capítulo mais fraco. */
  _resumoCaderno() {
    const st = this.st, pk = this.pack, caps = pk.capitulos;
    const cx = caps.map(c => (st.topicos[c.id] || {}).caixa || 0), abertos = cx.filter(Boolean).length, min = Math.min(...cx);
    const comecou = caps.some(c => ((st.topicos[c.id] || {}).tentativas || []).length);
    return {
      id: pk.id, titulo: pk.titulo, caderno: true, disponivel: true, emPreparacao: false,
      descricao: `O caderno completo: ${caps.length} capítulos com páginas para ler, uma pergunta antes de cada página e questões reais do Enem.`,
      nivel: { cheios: min, nome: min ? rotuloNivel(min) : null, rotulo: rotuloNivel(min) }, estado: abertos === caps.length ? 'consolidado' : comecou ? 'pratica' : 'novo',
      estadoTexto: abertos === caps.length ? `Os ${caps.length} capítulos estão abertos. O mais fraco está ${noNivel(min)}.` : comecou ? `Começado: ${abertos} de ${caps.length} capítulos com nível.` : 'Ainda não começou.',
      progresso: { feitas: abertos, total: caps.length, texto: `${abertos} de ${caps.length} capítulos abertos` },
    };
  }
  /** Mapa do que estudar (aba Estudar): as 4 áreas do Enem, as matérias e os tópicos com o nível do aluno. */
  estudar() {
    const st = this.st, escolhidas = (st.perfil && st.perfil.areas) || ['MT'];
    const juntar = l => (l.length > 1 ? `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}` : l[0] || '');
    const areas = AREAS.map(a => {
      const materias = a.materias.map(nome => {
        const topicos = [];
        if (a.id === 'MT' && nome === 'Matemática') topicos.push(this._resumoCaderno());
        for (const c of CONHECIDOS.filter(x => x.area === a.id && x.materia === nome)) topicos.push(this._resumoTopico(c.id));
        return { nome, topicos };
      }).filter(mt => mt.topicos.length);
      const disponivel = materias.some(mt => mt.topicos.some(t => t.disponivel));
      return {
        id: a.id, nome: a.nome, disponivel, escolhida: escolhidas.includes(a.id), materias: disponivel ? materias : [],
        frase: disponivel ? null : `${juntar(a.materias)}: chega nas próximas versões.`,
      };
    });
    return {
      titulo: 'O que estudar',
      intro: 'O mapa do que cai no Enem: área, matéria e tópico. Toque num tópico para ver o seu nível e estudar.',
      areas,
      regraNivel: 'O nível de cada tópico vai de 1 a 5. Acerte 2 questões seguidas para entrar no nível 1 de 5. Depois, cada revisão certa na primeira resposta sobe um nível; as revisões são marcadas pela data da sua prova.',
    };
  }
  /** O botão "Estudar este tópico hoje", com o motivo quando não dá. */
  _acaoTopico(id) {
    const m = this.st.missao, fa = id === this.pack.id, rotulo = 'Estudar este tópico hoje';
    if (!m) return null;
    if (m.livre && m.iniciada && !m.fechada) return m.cap === id
      ? { disponivel: true, evento: 'CONTINUAR', rotulo: `Continuar do passo ${Math.min(m.i + 1, m.passos.length)} de ${m.passos.length}`, nota: 'Você está estudando este tópico por conta própria.' }
      : { disponivel: false, rotulo, motivo: `Você está estudando ${this.prat.titulo(m.cap)} por conta própria. Termine ou encerre antes de abrir outro tópico.` };
    if (m.fechada || m.livre) return fa
      ? { disponivel: false, rotulo, motivo: 'Missão de hoje cumprida. As páginas do caderno ficam livres para ler na aba Caderno; as questões dele voltam na próxima missão.' }
      : { disponivel: true, evento: 'ESTUDAR_TOPICO', id, rotulo: 'Estudar este tópico agora', nota: 'Missão de hoje cumprida. Este estudo é por conta própria: conta como dia estudado e muda o nível pelas mesmas regras, sem um segundo visto.' };
    if (m.tipo === 'pausa') return { disponivel: false, rotulo, motivo: `Você marcou pausa até ${R.fmtDiaMes(this.st.pausa.ate)}. Para estudar, encerre a pausa no Plano.` };
    const ehEste = fa ? m.tipo !== 'topico' && m.tipo !== 'folga' : m.tipo === 'topico' && m.cap === id;
    if (m.iniciada) return ehEste
      ? { disponivel: true, evento: 'CONTINUAR', rotulo: `Continuar do passo ${Math.min(m.i + 1, m.passos.length)} de ${m.passos.length}`, nota: 'Este tópico já é a sua missão de hoje.' }
      : { disponivel: false, rotulo, motivo: 'A missão de hoje já começou. Termine ou encerre por hoje; amanhã este tópico pode ser a missão.' };
    const atual = m.tipo === 'folga' || !m.passos.length ? null : this._titulo(m);
    return { disponivel: true, evento: 'ESTUDAR_TOPICO', id, rotulo,
      nota: ehEste ? 'Este tópico já é a sua missão de hoje.' : m.tipo === 'folga' ? 'Hoje é folga. Estudar conta como dia estudado, mas não para a meta da semana.' : atual ? `Ele vira a sua missão de hoje no lugar de "${atual}". É uma missão por dia.` : 'Ele vira a sua missão de hoje.' };
  }
  /** Página do tópico: título, por que cai no Enem, o nível do aluno e "Estudar este tópico hoje". */
  topicoPagina(id) {
    const fa = id === this.pack.id;
    const r = fa ? this._resumoCaderno() : this._resumoTopico(id);
    if (!r) return null;
    if (!r.disponivel) return Object.assign({}, r, { acao: null, area: (AREAS.find(a => a.id === (CONHECIDOS.find(c => c.id === id) || {}).area) || {}).nome || '' });
    const t = fa ? null : this.prat.get(id), st = this.st, d = R.hoje();
    return Object.assign({}, r, {
      area: fa ? 'Matemática' : (AREAS.find(a => a.id === t.area) || {}).nome || '', materia: fa ? 'Matemática' : t.materia,
      porQueCai: fa ? 'Função afim cai todo ano no Enem: tarifas com uma parte fixa e uma parte por unidade, gráficos de retas e comparação de planos e preços.' : t.teoria.porQueCai,
      ideias: fa ? [] : (t.topico.ideias || []).filter(x => typeof x === 'string'),
      composicao: fa ? 'Cada capítulo tem páginas para ler, uma pergunta antes de cada página e questões reais do Enem.'
        : `Uma pergunta antes de ler, a teoria (${t.teoria.secoes.length} partes, com exemplos resolvidos) e ${t.itens.length} questões reais do Enem, da mais fácil para a mais difícil.`,
      capitulos: fa ? this.pack.capitulos.map(c => { const x = st.topicos[c.id] || {}; return { n: c.n, titulo: c.titulo, nivel: { cheios: x.caixa || 0, nome: x.caixa ? rotuloNivel(x.caixa) : null, rotulo: rotuloNivel(x.caixa || 0) } }; }) : null,
      regraNivel: fa ? 'Cada capítulo tem o seu nível, de 1 a 5. Acertar duas seguidas na primeira vez põe o capítulo no nível 1 de 5; cada revisão certa na primeira resposta sobe um nível.' : 'Acerte 2 questões seguidas e o tópico entra no nível 1 de 5. Depois, cada revisão certa na primeira resposta sobe um nível, até o 5 de 5. Errar uma revisão volta o tópico para o nível 1 de 5, sem apagar nada.',
      acao: this._acaoTopico(id),
      leitura: fa ? { rotulo: 'Abrir o caderno', aba: 'caderno' } : { rotulo: 'Ler a teoria', nota: 'Ler é livre e não conta como dia estudado.' },
      regraHoje: r.estado === 'novo' && !fa ? `Hoje: ${regraTopico(t.titulo).ganho} No fim, o visto do dia.` : null,
      dia: d,
    });
  }
  /** Teoria para leitura livre (fora da missão): não conta como dia estudado. */
  teoriaLivre(id) {
    const v = this.teoria(id);
    return v ? Object.assign(v, { livre: true, aviso: 'Leitura livre: não conta como dia estudado e não muda o nível.' }) : null;
  }

  /* =========================================================
     Perfil (nome, foto, plano, som, dados)
     ========================================================= */
  perfil() {
    const p = this.st.perfil;
    if (!p) return null;
    const nome = p.nome || '';
    const iniciais = nome ? nome.split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('') : '';
    return {
      nome, foto: p.foto || null, iniciais,
      titulo: nome || 'Seu perfil',
      fotoTexto: p.foto ? 'Trocar a foto' : 'Escolher uma foto',
      fotoNota: 'A foto fica só neste aparelho.',
      plano: this.plano(), ajustes: this.ajustes(),
      areas: AREAS.map(a => ({ valor: a.id, rotulo: a.nome, marcada: (p.areas || ['MT']).includes(a.id), disponivel: this.prat.ids().some(id => this.prat.get(id).area === a.id) || a.id === 'MT' })),
    };
  }
  definirNome(nome) { return this._acao(() => { this.st.perfil.nome = String(nome || '').replace(/\s+/g, ' ').trim().slice(0, 40) || null; }); }
  /** Foto do perfil como data URL (a tela reduz para ~160 px). null apaga. */
  definirFoto(url) {
    if (url != null && !(typeof url === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(url) && url.length <= 200000)) return false;
    return this._acao(() => { this.st.perfil.foto = url || null; });
  }
  naoTem() { return { titulo: 'O que o Prumo não tem', itens: NAO_TEM }; }

  /* ---------------- ações (cada uma salva) ---------------- */
  _acao(fn) { return this.missao.transicao(() => { const r = fn(); return r === undefined ? null : r; }); }
  definirSom(v) { return this._acao(() => { this.st.config.som = !!v; }); }

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
    const item = this.pack.item(rf.item), base = { estado: rf.estado, rotulo: 'Refazer com outros números', subrotulo: 'Não muda nível nem agenda.', item: this._itemVM(item) };
    if (rf.estado === 'pergunta') return Object.assign(base, { acao: { rotulo: 'Responder', exige: 'alt' } });
    const ok = rf.res === 'ok', alt = item.alternativas.find(a => a.letra === rf.alt) || {}, loc = alt.paragrafo ? this.pack.local(alt.paragrafo) : null;
    return Object.assign(base, {
      certa: ok, titulo: ok ? 'Certa.' : `Você marcou ${rf.alt}. A certa é ${item.gabarito}.`, falta: ok ? null : alt.falta || null, porque: ok ? item.explicacao : null,
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, marca: a.letra === rf.alt && a.certa ? 'sua-certa' : a.letra === rf.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: loc ? { rotulo: `Voltar ao parágrafo ${loc.n} da p. ${loc.paginaN}`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
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
    const ex = gerarExemplo(this.pack, R.hoje(), this.prat);
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
