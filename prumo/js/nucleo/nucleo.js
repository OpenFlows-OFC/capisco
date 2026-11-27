/* =========================================================
   PRUMO · Fachada do núcleo para as telas (sem DOM)
   As telas só leem o estado: tudo chega aqui já calculado, em "view models"
   com os textos prontos em português. Para mudar o estado, as telas mandam
   eventos (despachar) ou chamam as ações nomeadas abaixo. Contrato em API.md.
   ========================================================= */
import * as R from './relogio.js';
import * as E from './estado.js';
import { criarMotor, P, NIVEL, MATERIAS, rotuloNivel, noNivel, dataEfetiva, revisaoAtrasada, voltaPorErro, passouPorHojeNao } from './motor.js';
import { Pack } from './pack.js';
import { Missao, DENTRO, DENTRO_PROVA, estrelasDe, VIDAS_PROVA, apostarPlacar } from './missao.js';
import { montarMissao, regraDaFila, verARegra, paginasComErro, proximaVariante, quandoRevisao } from './recomendador.js';
import * as Plano from './plano.js';
import * as Cards from './cards.js';
import * as Prova from './prova.js';
import { gerarExemplo } from './exemplo.js';

/** Contra o relógio: questões sorteadas de todas as fases, relógio corrido. É treino: não mexe em nível nem no visto. */
export const CARTOES_SESSAO = 10, REVANCHE_MAX = 10;
export const RELAMPAGO = Object.freeze({ questoes: 15, minutos: 5 });
import { Praticas, limparSvg, AREAS, CONHECIDOS, estadoTopico, montarMissaoGeral, ineditas, regraTopico, passosTopico, estimarMinutosTopico, minutosDaTeoriaNaMissao, QUESTOES_POR_MINUTOS } from './pratica.js';

export { R as relogio };   // a tela pode ler relogio.agora() e os formatadores de data

export const MARCOS = [
  { id: 'm.primeiroCap', nome: 'Primeiro capítulo aberto', condicao: 'Acertar duas seguidas num capítulo novo, que entra no nível 1 de 5.' },
  { id: 'm.semanaMeta', nome: 'Primeira semana com a meta', condicao: 'Cumprir a meta numa semana. O marco entra quando a semana termina.' },
  { id: 'm.todosFirmando', nome: 'Todos os capítulos no nível 2 de 5', condicao: 'Todos os capítulos chegam ao nível 2 de 5. Isso libera a Prova do caderno.' },
  { id: 'm.primeiroFirme', nome: 'Primeiro capítulo no nível 3 de 5', condicao: 'Um capítulo chega ao nível 3 de 5.' },
  { id: 'm.prova', nome: 'Prova do caderno vencida', condicao: 'Acertar 4 seguidas na Prova do caderno, uma de cada capítulo.' },
];
export const NAO_TEM = [
  { item: 'Ligas e ranking', motivo: 'Você só se compara com você mesmo. Ranking faz a gente estudar para ganhar dos outros, não para aprender.' },
  { item: 'XP e pontos', motivo: 'XP cresce com qualquer clique e não diz o que você sabe. Aqui o progresso é o nível de cada capítulo, e os risquinhos só registram os dias em que você estudou.' },
  { item: 'Baús e sorteio', motivo: 'Tudo o que você ganha é avisado antes. Nada é sorteado, para o app não prender você pela surpresa.' },
  { item: 'Energia e vidas', motivo: 'Errar não custa nada além do que a regra escrita diz.' },
  { item: 'Moeda', motivo: 'Não há moeda para juntar: o que vale é saber a matéria.' },
  { item: 'Apostas', motivo: 'Nada no Prumo depende de sorte.' },
  { item: 'Coleta de dados', motivo: 'Nenhum dado seu sai deste aparelho. A cópia e a planilha só saem quando você pede.' },
  { item: 'Notificações para você voltar', motivo: 'O Prumo não manda notificação; o lembrete é um alarme que você mesmo cria.' },
];
const TIPOS_PROVA = [
  { valor: 'escola', rotulo: 'Prova da escola (bimestral)' },
  { valor: 'enem', rotulo: 'Enem', aviso: 'A data do Enem 2027 ainda não saiu. Até lá, o Prumo planeja as revisões para 90 dias.', dica: 'Se a prova da escola vem antes, marque "Prova da escola": o plano fica mais útil.' },
  { valor: 'provao', rotulo: 'Provão Paulista', aviso: 'As questões do Prumo são do Enem. O plano usa a data da sua prova.' },
  { valor: 'vestibular', rotulo: 'Outro vestibular', aviso: 'As questões do Prumo são do Enem. O plano usa a data da sua prova.' },
  { valor: 'naosei', rotulo: 'Ainda não sei', aviso: 'Sem data, o Prumo planeja as revisões para 90 dias.' },
];
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
/** "amanhã, qui 19/11" · "segunda, 23/11" */
const dataRevisao = (x, d) => (R.diff(d, x) === 1 ? `amanhã, ${R.fmtCurta(x)}` : R.diff(d, x) === 0 ? 'hoje' : `${R.SEMANA_LONGA[R.diaDaSemana(x)]}, ${R.fmtDiaMes(x)}`);
const nDe = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const listaCaps = ns => (ns.length === 1 ? `Cap. ${ns[0]}` : `Caps. ${ns.slice(0, -1).join(', ')} e ${ns[ns.length - 1]}`);
const juntarE = l => (l.length > 1 ? `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}` : l[0] || '');
/** "na quarta" · "no sábado" */
const naDia = x => { const w = R.SEMANA_LONGA[R.diaDaSemana(x)]; return `${['sábado', 'domingo'].includes(w) ? 'no' : 'na'} ${w}`; };
/** Quando a revisão errada volta: "amanhã, qua 18/11" · "na segunda, 23/11" (o dia de estudo em que ela entra). */
const voltaEm = (x, d) => (R.diff(d, x) === 1 ? `amanhã, ${R.fmtCurta(x)}` : `${naDia(x)}, ${R.fmtDiaMes(x)}`);
/** "Ficou registrada 1 tentativa" · "Ficaram registradas 3 tentativas" */
const registradas = n => (n === 1 ? 'Ficou registrada 1 tentativa' : `Ficaram registradas ${n} tentativas`);

/** A regra do nível, numa frase só (Caderno, página do tópico e mapa), fiel ao motor: rodada com 2 certas
 *  seguidas abre o nível 1; revisão certa sobe um; revisão errada desce UM (nunca abaixo de 1). */
export function regraNivel(oQue = 'o tópico', teto = 5) {
  const ate = teto < 5 ? `até o 5 de 5 (na demonstração, até o ${teto} de 5)` : 'até o 5 de 5';
  return `Acerte 2 seguidas na rodada e ${oQue} entra no nível 1 de 5. Depois, cada revisão certa na primeira resposta sobe um nível, ${ate}; errar uma revisão desce um nível, nunca abaixo do 1. Errar nas questões da rodada só recomeça a contagem das 2 seguidas. Nada do que você fez se apaga.`;
}
/** "Como funciona um tópico" (página do tópico): as 4 etapas da trilha, com a regra do nível certa. */
export const COMO_FUNCIONA = [
  { titulo: 'Aquecer', texto: 'Uma questão antes de ler. Chute se não souber: a ideia é ler a apostila já com a dúvida na cabeça. A resposta aparece depois da leitura.' },
  { titulo: 'Leitura', texto: 'A apostila do tópico, com exemplos resolvidos, figuras e tabelas. Se você já domina, pode pular.' },
  { titulo: 'Questões do Enem', texto: 'Questões de provas reais. Acerte 2 seguidas e o tópico entra no nível 1 de 5. Errou? A contagem recomeça e a explicação mostra o que faltou. Se não der mais para acertar 2 seguidas com as que restam, o tópico continua na próxima vez.' },
  { titulo: 'Visto do dia', texto: 'Terminou, ganhou o visto e o dia conta. Depois, o Prumo marca as revisões até a prova: cada revisão certa sobe um nível, e errar uma revisão desce um.' },
];

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
    // dias padrão: seg a qui e, se faltar, o dia de hoje (no máximo 5), para o primeiro dia nunca cair em folga (R2)
    const hojeDS = R.diaDaSemana(R.hoje()), diasPadrao = [1, 2, 3, 4];
    if (!diasPadrao.includes(hojeDS)) diasPadrao.push(hojeDS);
    const areas = AREAS.map(a => { const ok = a.id === 'MT' || this.prat.ids().some(id => this.prat.get(id).area === a.id); return { valor: a.id, rotulo: a.nome, disponivel: ok, nota: ok ? null : 'Em breve' }; });
    const nomeArea = id => (AREAS.find(a => a.id === id) || {}).nome;
    return {
      restaurar: { rotulo: 'Já usei o Prumo: restaurar uma cópia' },
      exemplo: { rotulo: 'Ver com dados de exemplo' },
      provas: TIPOS_PROVA,
      provaPadrao: 'enem',
      dias: {
        padrao: diasPadrao, hoje: hojeDS, min: 3, max: 5, opcoes: [1, 2, 3, 4, 5, 6, 0].map(v => ({ valor: v, rotulo: Plano.NOMES_DIAS[v] })),
        dica: diasPadrao.length > 4 ? `${{ 5: 'A sexta', 6: 'O sábado', 0: 'O domingo' }[hojeDS]} entrou para você começar hoje.` : null,
      },
      minutos: { padrao: 25, opcoes: [15, 25, 40] },
      horario: { padrao: '19:00' },
      som: { padrao: false, pergunta: 'Quer som?' },
      metaSugerida: dias => Math.max(1, (dias || []).length - 1),
      alarme: (dias, horario) => ({ texto: `Quer um lembrete? Crie um alarme no app Relógio: ${textoAlarme(dias, horario)}. O Prumo não manda notificação.`, rotulo: textoAlarme(dias, horario) }),
      titulo: 'Vamos montar o seu plano',
      frase: 'Duas perguntas e a primeira missão fica pronta.',
      perguntas: { prova: 'Qual prova vem primeiro?', nome: 'Como você quer ser chamado?' },
      ajudaData: 'Com a data, o Prumo marca as revisões até o dia da prova. Sem ela, planeja para 90 dias.',
      ajudaNome: 'Opcional. É como o Prumo vai chamar você.',
      /** "Para começar: seg, ter, qua e qui, 25 min por dia, Matemática e Linguagens." */
      padroes: (dias, minutos, ids) => `Para começar: ${juntarE([1, 2, 3, 4, 5, 6, 0].filter(d => (dias || []).includes(d)).map(d => Plano.NOMES_DIAS[d]))}, ${minutos} min por dia, ${juntarE((ids || []).map(nomeArea).filter(Boolean))}.`,
      padroesOnde: 'Dá para mudar depois no Perfil, em "Seu nome e seu plano".',
      mudarAgora: 'Mudar dias e minutos agora',
      concluir: 'Ver minha missão de hoje',
      areas,
      areasPadrao: areas.filter(a => a.disponivel).map(a => a.valor),
      onboardingRotulo: 'Como o Prumo ensina',
      onboarding: [
        { etapa: 'Aquecer', titulo: 'Primeiro, uma pergunta.', texto: 'Antes de ler, você tenta responder. Se não souber, chute: você vai ler já procurando a resposta.' },
        { etapa: 'Leitura', titulo: 'Depois, a explicação.', texto: 'A leitura vem com exemplos resolvidos e figuras. Depois dela, você confere o que entendeu.' },
        { etapa: 'Questões', titulo: 'Por fim, questões do Enem.', texto: 'Questões de provas reais. Errou? O Prumo mostra o que faltou e o trecho para rever.' },
      ],
      impacto: 'Você treina com o que já caiu no Enem.',   // espaço fixo: "Enem." nunca fica sozinho na linha
      fecho: 'Seus dados ficam só neste aparelho.',
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
  /** Data em que a revisão marcada para x entra de fato (o primeiro dia de estudo igual ou depois de x). */
  _ef(x) { return dataEfetiva(this.st, x); }
  /** Teto de nível: 5; só o estado de exemplo usa o teto da demonstração (pack.nivelMaximoDemo). */
  _teto() { return Math.min(5, this.st.config.nivelMaximo || 5); }
  /** " (na demonstração, o nível vai até 3 de 5)" quando o teto da demonstração segura o nível k. */
  _notaTeto(k) { const t = this._teto(); return t < 5 && k >= t ? ` (na demonstração, o nível vai até ${t} de 5)` : ''; }
  /** No topo: ", o mais alto" no 5 de 5; a nota da demonstração no teto dela. */
  _notaTopo(k) { return k >= 5 ? ', o mais alto' : this._notaTeto(k); }
  /** Partes de uma lista longa, sem títulos com vírgula: ["Funções afins (Caps. 1, 2 e 4)", "Porcentagem e juros"]. */
  _partesCaps(caps, { comCaps = true } = {}) {
    const nums = caps.map(c => this.pack.capitulo(c)).filter(Boolean).map(c => c.n).sort((a, b) => a - b), tops = caps.filter(c => !this.pack.capitulo(c));
    return [nums.length ? (comCaps ? `${this.pack.titulo} (${listaCaps(nums)})` : this.pack.titulo) : null,
      tops.length === 1 ? this.prat.curto(tops[0]) : tops.length > 1 ? `${tops.length} tópicos de prática` : null].filter(Boolean);
  }
  /** "do capítulo X" · "do capítulo X e do tópico Y" · acima de 2: "de Funções afins (Caps. 1, 2 e 4) e de Porcentagem e juros". */
  _doLista(caps) {
    caps = [...new Set(caps)];
    if (caps.length > 2) return juntarE(this._partesCaps(caps).map(x => `de ${x}`));
    return juntarE(caps.map(c => `do ${this._nomeCap(c)}`));
  }
  /** "revisão do capítulo X" · "revisões do capítulo X e do tópico Y" · acima de 2: "5 revisões de Funções afins (Caps. 1 a 4)…". */
  _revisoes(caps, { curto = false } = {}) {
    caps = [...new Set(caps)];
    if (caps.length === 1) return `revisão do ${this._nomeCap(caps[0])}`;
    if (caps.length > 2) return `${caps.length} revisões ${juntarE(this._partesCaps(caps, { comCaps: !curto }).map(x => `de ${x}`))}`;
    return `revisões ${this._doLista(caps)}`;
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
      if (p.t === 'teoria') { out.push({ n: `${n}`, texto: `Apostila: ${this.prat.titulo(p.cap)}`, pagina: '' }); continue; }
      let texto;
      if (p.t === 'pre') texto = p.fonte === 'pratica' ? 'Aquecimento: uma questão antes da apostila' : p.alvo === 'bloco' ? `Pergunta antes do § ${pk.localDoBloco(p.bloco).n}` : 'Pergunta antes de ler';
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
    if (ps.some(p => p.t === 'pre' && p.fonte === 'pratica')) partes.push('um aquecimento');
    if (ps.some(p => p.t === 'teoria')) partes.push('a apostila');
    const pgs = new Set(ps.filter(p => p.t === 'leitura').map(p => p.pagina)).size;
    if (pgs) partes.push(nDe(pgs, 'página', 'páginas'));
    // as perguntas do caderno (antes de ler e "Confira") entram na conta, como na régua ("faltam até N questões");
    // a questão da equipe que entra depois de um erro fica fora: ela é condicional
    const curtas = ps.filter(p => (p.t === 'pre' && p.fonte !== 'pratica') || p.t === 'checagem').length;
    if (curtas) partes.push(`${nDe(curtas, 'pergunta curta', 'perguntas curtas')}${pgs ? ` sobre ${pgs === 1 ? 'ela' : 'elas'}` : ''}`);
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
    if (m.livre) {
      // o dia já contou (a missão do dia foi feita): não prometer de novo "conta como dia estudado"
      const sv = this.st.carimbos && this.st.carimbos[d] ? 'sem um segundo visto' : 'sem visto';
      return `${ganho ? ganho + ' ' : ''}Estudo por conta própria${this.st.dias[d] ? `, ${sv}` : `: conta como dia estudado, ${sv}`}.`;
    }
    if (!ganho) return 'No fim, o visto do dia.';
    const mk = /nível (\d) de 5/.exec(ganho);
    let explica = '';
    if (mk) {
      const k = Number(mk[1]), iv = Plano.intervalos(this.st, d);
      const quando = iv && iv[k] ? R.fmtDiaMes(this._ef(R.addDias(d, iv[k]))) : null;
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
    if (revs.length) return cap1(this._revisoes(revs.map(p => p.cap), { curto: true }));
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
      if (rv) return this._ganhoRevisao(m.cap, nome);
      return 'Hoje é a leitura da apostila. As questões deste tópico voltam quando fizer 7 dias que você as viu.';
    }
    if (m.tipo === 'novo' || m.tipo === 'pratica') {
      const rods = m.passos.filter(p => p.r === `r:${m.cap}`);
      return regraDaFila(rods, m.cap, `o ${this._nomeCap(m.cap)}`).ganho;
    }
    if (m.tipo === 'antecipada' || (m.tipo === 'prereq' && m.passos.some(p => p.antecipada))) return 'Revisão antecipada: o nível só sobe na revisão do dia certo. Se a sequência não fechar, a revisão passa para amanhã.';
    const revs = m.passos.filter(p => p.t === 'revisao');
    if (m.tipo === 'questaoDoDia') {
      // com revisão de tópico somada (P1), a revisão muda o nível: anunciar as duas coisas, sem contradição
      const rg = this._ganhoRevisoes(revs);
      return rg ? `A Questão do dia não muda nível nem agenda; a revisão muda. ${rg}` : 'A Questão do dia não muda nível nem agenda: é dia de manter.';
    }
    return this._ganhoRevisoes(revs);
  }
  /** Ganho anunciado das revisões da missão ('' sem revisão). */
  _ganhoRevisoes(revs) {
    const st = this.st;
    if (revs.length === 1) return this._ganhoRevisao(revs[0].cap, `o ${this._nomeCap(revs[0].cap)}`);
    if (revs.length > 1) {
      const max = this._teto(), cx = revs.map(p => (st.topicos[p.cap] || {}).caixa || 0), sobem = cx.filter(k => k < max).length;
      if (!sobem) return max < 5 ? `Cada revisão certa na primeira resposta mantém o nível: na demonstração, o nível vai até ${max} de 5.` : 'Cada revisão certa na primeira resposta mantém o nível 5 de 5, o mais alto.';
      return sobem < cx.length ? `Cada revisão certa na primeira resposta sobe um nível, até o ${max} de 5${max < 5 ? ' (o teto da demonstração)' : ''}.` : 'Cada revisão certa na primeira resposta sobe um nível.';
    }
    return '';
  }
  /** Ganho anunciado de uma revisão: sobe um nível; no teto, continua (sem prometer intervalo maior). */
  _ganhoRevisao(cap, nome) {
    const t = this.st.topicos[cap] || {}, de = t.caixa || 0, para = Math.min(this._teto(), de + 1);
    return para > de ? `Acerte a revisão na primeira resposta: ${nome} sobe para o ${rotuloNivel(para)}.` : `Acerte a revisão na primeira resposta: ${nome} continua ${noNivel(de)}${this._notaTopo(de)}.`;
  }
  /** O que uma missão montada tem, para a "Próxima missão" e a agenda: a parte principal (capítulo novo,
   *  continuação, revisão antecipada, Questão do dia, tópico) e os capítulos/tópicos com revisão. */
  _partesMissao(mm) {
    const revs = [...new Set(mm.passos.filter(p => p.t === 'revisao').map(p => p.cap))];
    let principal = null;
    if (mm.tipo === 'novo') principal = `${this._nomeCap(mm.cap)} (novo)`;
    else if (mm.tipo === 'pratica') principal = `${this._nomeCap(mm.cap)}, continuação`;
    else if (mm.tipo === 'antecipada' || (mm.tipo === 'prereq' && mm.passos.some(p => p.antecipada))) principal = `revisão antecipada do ${this._nomeCap(mm.cap)}`;
    else if (mm.tipo === 'questaoDoDia' && mm.passos.some(p => p.t === 'dia')) principal = 'Questão do dia';
    else if (mm.tipo === 'topico') principal = this.prat.titulo(mm.cap);
    return { principal, revs };
  }
  _proximoDia(d) {
    const st = this.st, prox = Plano.proximoDiaDeEstudo(st, d);
    if (!prox) return null;
    const mm = montarMissaoGeral(st, this.pack, this.M, this.prat, prox);
    const revs = mm.passos.filter(p => p.t === 'revisao');
    // a revisão de tópico que o P1 soma entra no texto em todo tipo de missão (antes, só em 'novo' e 'topico')
    const pt = this._partesMissao(mm);
    const o = [pt.principal, pt.revs.length ? this._revisoes(pt.revs) : null].filter(Boolean).join(' e ') || 'missão do dia';
    const quando = R.diff(d, prox) === 1 ? 'Amanhã' : cap1(naDia(prox));
    const ad = revs.find(p => p.antesDepois);
    const nPag = ad ? this.pack.pagina(this.pack.modelo(ad.antesDepois.split('#')[0]).pagina).n : null;
    const gancho = ad ? `${quando} você vê se acertou a pergunta antes da p. ${nPag}.` : null;
    // o "Por quê?" fala do dia anunciado (nunca a frase escrita para o próprio dia, com "Hoje")
    let porque = null;
    if (revs.length) {
      const t = st.topicos[revs[0].cap], iv = Plano.intervalos(st, d), erro = voltaPorErro(t);
      if (mm.capAdiado) {
        const n = revs.length, c = this.pack.capitulo(mm.capAdiado), min = (st.perfil || {}).minutos || 25;
        porque = `${quando} ${n === 1 ? 'vence 1 revisão' : `vencem ${n} revisões`}, e o Cap. ${c ? c.n : ''} não cabe junto nos seus ${min} min: ${n === 1 ? 'a revisão vem' : 'as revisões vêm'} primeiro, e o capítulo fica para o dia de estudo seguinte.`;
      } else if (erro) {
        porque = erro === 'extra' ? `A revisão antecipada ${this._de(revs[0].cap)} não fechou, e a revisão passa para o próximo dia de estudo: ${naDia(prox)}.` : `Você errou a revisão ${this._de(revs[0].cap)}, e revisão errada volta no próximo dia de estudo: ${naDia(prox)}.`;
      } else if (t && t.caixa) {
        porque = `No ${rotuloNivel(t.caixa)}, a revisão vence em ${nDe(iv[t.caixa], 'dia', 'dias')}`;
        if (t.proxima >= prox) porque += '.';
        else if (passouPorHojeNao(st, t.proxima, prox) && this._ef(t.proxima) >= prox) porque += `; você marcou “Hoje não”, então ela entra ${naDia(prox)}.`;
        else if (!Plano.ehDiaDeEstudo(st, t.proxima) || Plano.emPausa(st, t.proxima)) porque += `; ${R.SEMANA_LONGA[R.diaDaSemana(t.proxima)]} é folga, então ela entra ${naDia(prox)}.`;
        else porque += `; ela venceu ${t.proxima === d ? 'hoje' : `em ${R.fmtCurta(t.proxima)}`} e ainda não foi feita, então vem primeiro ${naDia(prox)}.`;
      }
    } else if (mm.tipo === 'novo') porque = 'É o próximo capítulo liberado pela ordem do caderno.';
    else if (mm.tipo === 'questaoDoDia') porque = 'Nada vence nesse dia: a missão é a Questão do dia.';
    else if (mm.tipo === 'topico' && mm.regra === 'P3') porque = `${quando} nada vence e o caderno de ${this.pack.titulo} está em dia: entra ${this.prat.titulo(mm.cap)}, um tópico novo das matérias que você escolheu.`;
    else if (mm.tipo === 'topico' && mm.regra === 'P2') porque = `Você começou ${this.prat.titulo(mm.cap)} e ainda não acertou duas seguidas: ele continua ${naDia(prox)}.`;
    const pq = mm.passos.find(p => p.id && ['pre', 'checagem', 'questao', 'revisao', 'dia'].includes(p.t));
    let primeira = null, fonte = null, rodape = null, licencaUrl = null;
    try {
      const it = pq ? this.missao.itemDe(pq.id) : null;
      if (it) {
        primeira = it.origem === 'enem' ? (it.contexto || it.enunciado) : it.enunciado;
        // questão do Enem: o crédito vai junto (INEP, CC BY-ND), como em toda tela que mostra a questão
        if (it.origem === 'enem') { fonte = `Questão ${it.numero} do ${it.prova}. INEP, CC BY-ND 3.0`; rodape = it.rodape || null; licencaUrl = it.licencaUrl || null; }
      }
    } catch (e) { primeira = null; }
    return { dia: prox, data: R.fmtDiaSemana(prox), quando, texto: `${R.fmtDiaSemana(prox)}: ${o}.`, gancho, ganchoPagina: nPag, porque, regra: mm.regra, primeira, fonte, rodape, licencaUrl };
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
      // "Próxima missão:" é sempre a missão; o aviso da pergunta de antes vem como segunda frase dela.
      // proxima.texto acompanha a prévia: a tela só repete a linha cinza quando as duas diferem
      const previa = prox ? `${prox.texto}${prox.gancho ? ` Nela você vê se acertou a pergunta antes da p. ${prox.ganchoPagina}.` : ''}` : null;
      vm.feito = prox ? { previa, gancho: prox.gancho, proxima: Object.assign({}, prox, { texto: previa, textoMissao: prox.texto }) } : null;
      vm.links = [{ rotulo: 'Continuar estudando', aba: 'estudar' }, { rotulo: 'Abrir o caderno', aba: 'caderno' }];
    } else if (m.iniciada) {
      vm.estado = 'emCurso';
      vm.acao = { evento: 'CONTINUAR', rotulo: `Continuar do passo ${m.i + 1} de ${m.passos.length}`, nota: m.livre ? 'O estudo por conta própria fica aberto até a meia-noite. Ele não dá um segundo visto.' : 'A missão fica aberta até a meia-noite.' };
    } else if (m.tipo === 'folga') {
      vm.estado = 'folga'; vm.texto = 'Hoje é folga. Nada vence por isso.'; vm.links = [{ rotulo: 'Continuar estudando', aba: 'estudar' }];
      vm.acao = { evento: 'ESTUDAR_MESMO_ASSIM', rotulo: 'Estudar mesmo assim', nota: 'Conta como dia estudado; não conta para a meta da semana.' };
    } else if (m.hojeNao) {
      // o dia do "Hoje não" conta como folga para as revisões (motor.dataEfetiva): a de hoje entra no próximo dia de estudo sem atraso
      const nHoje = m.passos.filter(p => p.t === 'revisao' && !p.atrasada).length;
      vm.estado = 'hojeNao';
      vm.texto = `Hoje não. A missão fica para o próximo dia de estudo${nHoje ? `, e ${nHoje === 1 ? 'a revisão de hoje entra' : `as ${nHoje} revisões de hoje entram`} nele sem contar como atraso` : ''}.`;
      vm.acao = { evento: 'COMECAR', rotulo: 'Começar mesmo assim' };
    } else {
      vm.estado = m.provaPassou ? 'provaPassou' : m.reta ? 'reta' : m.retorno ? 'retorno' : m.tipo === 'questaoDoDia' ? (firme && this.M.topicosAtivos(st).length ? 'firme' : 'questaoDoDia') : (!Object.keys(st.dias).length && !st.historico.length ? 'primeiroDia' : 'missao');
      vm.acao = temPassos ? { evento: 'COMECAR', rotulo: 'Começar' } : null;
      if (vm.estado === 'provaPassou') vm.texto = `A prova de ${R.fmtDiaMes(st.perfil.prova)} passou. Quer marcar a próxima? Sem data, o Prumo usa 90 dias.`;
      else if (vm.estado === 'reta') vm.texto = m.frase;
      else if (vm.estado === 'retorno') vm.texto = `${m.boasVindas ? 'Bem-vindo de volta. ' : ''}Hoje a missão tem só revisões.`;
      else if (vm.estado === 'firme') vm.texto = `${this.pack.titulo}: todos os capítulos estão no nível 3 de 5 ou acima. As revisões continuam quando vencerem.`;
      else if (vm.estado === 'questaoDoDia') { const nr = m.passos.filter(p => p.t === 'revisao').length; vm.texto = `${cap1(nDe(m.passos.filter(p => p.t === 'dia').length, 'questão', 'questões'))} dos capítulos que você já abriu${nr ? ` e ${nDe(nr, 'revisão', 'revisões')}` : ''}.`; }
      else if (m.boasVindas) vm.texto = 'Bem-vindo de volta.';
      if (vm.estado === 'provaPassou') vm.links.push({ rotulo: 'Marcar data', aba: 'plano' });
    }
    if (temPassos && !m.fechada && m.tipo !== 'pausa' && m.tipo !== 'folga') {
      const atrasadas = m.passos.filter(p => p.t === 'revisao' && p.atrasada).length;
      const avisos = this._avisosTempo(m);
      vm.bloco = {
        rotulo: vm.estado === 'primeiroDia' ? 'Missão 1' : null,
        titulo: this._titulo(m),
        linhaFina: `${[this._paginasDe(m.passos), `≈ ${m.minutos} min`].filter(Boolean).join(' · ')} · termina em "Pronto por hoje"`,
        composicao: [this._composicao(m), ...avisos].filter(Boolean).join(' '),
        avisos,
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
    vm.livre = !!m.livre;
    vm.proximoRotulo = m.livre ? 'Estudo por conta própria' : vm.estado === 'emCurso' ? 'Sua missão de hoje' : 'Seu próximo conteúdo';
    if (m.boasVindas && st.perfil.porque && !m.fechada) vm.porqueEstudo = `Por que eu estudo: ${st.perfil.porque}`;   // d.3
    vm.porQue = this.porQue();
    vm.venceHoje = !m.fechada && !m.livre && !m.hojeNao ? this._venceHoje(m) : null;
    vm.recomeco = this._recomeco(m, d);
    if (vm.recomeco && vm.texto === 'Bem-vindo de volta.') vm.texto = null;
    vm.intencao = this._textoIntencao(d);
    vm.semana = this.semana(d);
    return vm;
  }
  /** Avisos de tempo da missão (vão também na composição): a apostila que passa dos minutos do plano,
   *  o capítulo que ficou para depois das revisões e as revisões que não couberam. */
  _avisosTempo(m) {
    const st = this.st, min = (st.perfil || {}).minutos || 25, out = [];
    if (m.tipo === 'topico' && m.minutos > min) {
      const tp = m.passos.find(p => p.t === 'teoria'), mt = tp ? minutosDaTeoriaNaMissao(st, this.prat, tp.cap) : 0;
      // o aquecimento e a leitura não fazem o dia contar: dizer quando ele conta, em vez de "o que fizer fica registrado"
      out.push(`Hoje passa dos seus ${min} min${mt > 6 ? `: só a apostila leva cerca de ${mt}` : ''}. Se precisar, encerre no meio; o dia conta como estudado quando você responde uma questão ou revisão (o aquecimento não conta).`);
    } else if (m.minutos >= min + 5) out.push(`Leva cerca de ${m.minutos} min, mais que os seus ${min}.`);
    if (m.capAdiado) out.push(`O ${this._nomeCap(m.capAdiado)} fica para o próximo dia de estudo: hoje a revisão vem primeiro.`);
    if (m.revisoesForaDoOrcamento) {
      const n = m.revisoesForaDoOrcamento, mais = n === 1 ? 'Mais 1 revisão fica' : `Mais ${n} revisões ficam`;
      // o corte do tópico escolhido é pela capacidade do dia (P0), não pelos minutos: cada um com o seu motivo
      out.push(m.foraPor === 'capacidade'
        ? `${mais} para o próximo dia de estudo: junto com um tópico, entram até ${Plano.capacidade(st)} revisões por dia.`
        : `${mais} para o próximo dia de estudo: não ${n === 1 ? 'cabe' : 'cabem'} nos seus ${min} min.`);
    }
    return out;
  }
  /** "Hoje vence": as revisões da missão de hoje, separando as que vencem hoje (inclusive as que venceram
   *  numa folga) das atrasadas (que passaram por um dia de estudo sem ser feitas). */
  _venceHoje(m) {
    const revs = m.passos.filter(p => p.t === 'revisao');
    if (!revs.length) return null;
    const hoje = revs.filter(p => !p.atrasada), atr = revs.filter(p => p.atrasada), partes = [];
    if (hoje.length) partes.push(`Hoje ${hoje.length === 1 ? 'vence 1 revisão' : `vencem ${hoje.length} revisões`} ${this._doLista(hoje.map(p => p.cap))}.`);
    if (atr.length) {
      const desde = atr.map(p => this._ef((this.st.topicos[p.cap] || {}).proxima)).filter(R.ehData).sort()[0];
      const qtd = atr.length === 1 ? '1 revisão atrasada' : `${atr.length} revisões atrasadas`;
      partes.push(`${hoje.length ? 'Mais ' : ''}${hoje.length ? qtd : cap1(qtd)}${desde ? ` desde ${R.fmtCurta(desde)}` : ''}: ${atr.length === 1 ? 'a' : 'as'} ${this._doLista(atr.map(p => p.cap))}.`);
    }
    const vence = partes.join(' '), porque = 'Revisando hoje, você guarda o conteúdo.';
    return { rotulo: hoje.length ? 'Hoje vence' : atr.length === 1 ? 'Revisão atrasada' : 'Revisões atrasadas', n: revs.length, hoje: hoje.length, atrasadas: atr.length, vence, porque, texto: `${vence} ${porque}` };
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
    const meta = p.metaSemana, ok = n >= meta, nd = `${meta === 1 ? 'dia' : 'dias'}`;
    // o rótulo ("Meta da semana") vem na frente na tela: o texto não o repete
    return { n, meta, cumprida: ok, dias, texto: ok ? (n > meta ? `${n} dias, meta de ${meta} cumprida` : `${n} de ${meta} ${nd}, cumprida`) : `${n} de ${meta} ${nd}`, rotulo: 'Meta da semana', regra: 'Conta cada dia de estudo do seu plano em que você estudou. A semana entra na conta de semanas com a meta quando termina, no domingo. Na segunda, a semana começa limpa, e tudo o que você estudou continua nos risquinhos.' };
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
      v.revisoes.push(`Revisão: ${this.prat.titulo(p.cap)}, ${quandoRevisao(this.st, t.proxima, d)} (${p.motivo})`);
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
    // o rótulo da casa é fixo (só a casa enche): trocar o nome no meio da rodada confundia quem está começando
    const r2 = regra.todosEnem ? 'Enem' : 'aplicar';
    const casa2 = { cheia: ia >= 0, rotulo: r2 };
    const casa1 = { cheia: corrida.some((x, i) => i !== ia), rotulo: 'acerto' };
    let texto = null;
    if (rod && rod.ultimoErro) texto = m.passos[m.i] && m.passos[m.i].inserido ? 'A próxima é sobre o trecho que faltou' : 'Para fechar: 2 certas seguidas, faltam 2';
    else if (casa1.cheia && !casa2.cheia) texto = regra.falta;
    else if (!casa1.cheia && casa2.cheia) texto = 'Para fechar: 2 certas seguidas, falta 1';
    return { casas: [casa1, casa2], texto, regra: `${regra.frase}. ${regra.insercao}`, descricoes: ['um acerto seguido', regra.todosEnem ? 'um acerto numa questão do Enem' : 'um acerto numa questão de aplicar'] };
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
    // a regra aparece aberta na primeira pergunta que conta (não na pergunta de antes de ler nem na leitura)
    const primeiroDaRodada = p && p.r ? m.passos.findIndex(x => x.r === p.r && ['checagem', 'questao', 'revisao', 'dia'].includes(x.t)) === m.i : false;
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
      placar: this._placar(m.placar),
      regra: regra ? { texto: `${regra.frase}. ${regra.insercao}`, mostrarAgora: primeiroDaRodada, rotulo: 'ver a regra' } : null,
    };
  }
  /** Placar da partida para o topo: pontos e combo (só depois da 1ª resposta). */
  _placar(p) { return p && p.total ? { pontos: p.pontos, seq: p.seq, mult: p.mult, ganho: p.ganho, combo: p.seq >= 2 ? `x${p.mult}` : null,
    pote: p.pote || 0, oferta: !!p.oferta, dobro: !!p.dobro, bonus: p.bonus || 0, perdeu: p.perdeu || 0 } : null; }
  passoAtual() {
    const vm = this._passoAtual(), m = this.st.missao;
    // estudo por conta própria (depois do Pronto): a tela troca a última etapa da trilha e o texto de "Encerrar"
    if (vm && m) vm.livre = !!m.livre;
    return vm;
  }
  _passoAtual() {
    const st = this.st, m = st.missao, pk = this.pack, nome = this.estado();
    if (!m || !DENTRO.has(nome)) return null;
    const p = m.passos[m.i];
    if (nome === 'feedback' || nome === 'trecho') {
      const fb = this.feedback();
      if (nome === 'trecho' && m.ultima.fonte === 'pratica') {
        // "Rever a apostila": abre na seção que a questão cobra, quando o conteúdo informa (âncora "secao-N")
        const it = this.missao.itemDe(m.ultima.item) || {}, sec = it.secao || null;
        return Object.assign({ estado: 'trecho' }, this.teoria(m.ultima.cap), { titulo: 'Rever a apostila', secao: sec, ancora: sec ? `secao-${sec}` : null, feedback: fb, acao: { evento: 'VOLTAR', rotulo: 'Voltar ao resultado' } });
      }
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
        // a apresentação promete "depois dela, você confere": a faixa diz quando (checagem da página ou 1ª revisão)
        faixa = segunda ? 'Resposta guardada. Na primeira revisão do capítulo você vê se acertou.'
          : ant.alvo === 'nucleo' ? 'Resposta guardada. Depois da leitura, uma pergunta parecida mostra se você entendeu.' : 'Resposta guardada.';
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
    const etapa = p.fonte === 'pratica' ? (p.t === 'pre' ? 'Aquecimento' : p.t === 'revisao' ? `Revisão do ${this._nomeCap(p.cap)}` : this.prat.curto(p.cap)) : p.t === 'pre' ? `Aquecimento: p. ${pk.pagina(p.pagina).n}` : p.t === 'checagem' ? `Confira a p. ${pk.pagina(p.pagina).n}` : p.t === 'revisao' ? `Revisão do ${this._nomeCap(p.cap)}` : p.t === 'dia' ? 'Questão do dia' : r.tipo === 'enem' ? 'Questão do Enem' : r.tipo === 'antecipada' ? 'Revisão antecipada' : 'Questão da equipe';
    return {
      estado: 'pergunta', tipo: r.tipo, rotulo: r.rotulo, subrotulo: r.sub, aviso: r.aviso || null,
      avisoPrimeiraChecagem: primeiraChecagem ? 'Isso fica só neste aparelho. Ninguém da escola vê.' : null,
      inserida: !!p.inserido,
      // Pilar III (b.3): a questão inserida depois do erro é anunciada no topo, com o trecho do erro
      avisoInserida: p.inserido ? `Depois do erro: uma questão da equipe sobre ${p.sobre && pk.local(p.sobre) ? `a ${pk.local(p.sobre).rotulo}` : 'o mesmo trecho'}.` : null,
      item: this._itemVM(item), topo: this._topo(p, etapa),
      fase: this._fase(p.t === 'pre' ? 'aquecer' : 'questoes'),
      acao: { evento: 'RESPONDER', rotulo: 'Responder', exige: 'alt' },
    };
  }
  /** Etapa da trilha do tópico (Aquecer → Apostila → Questões → Visto) só na missão de tópico; null no caderno. */
  _fase(f) { const m = this.st.missao; return m && m.tipo === 'topico' ? f : null; }
  /** Teoria de um tópico de prática, na folha pautada: seções, exemplos resolvidos, armadilhas e resumo. */
  teoria(id) {
    const t = this.prat.get(id);
    if (!t) return null;
    const te = t.teoria, s = x => (Array.isArray(x) ? x.filter(y => typeof y === 'string') : []);
    const rev = te.revisao && typeof te.revisao === 'object' && typeof te.revisao.por === 'string' && te.revisao.por.trim() ? te.revisao : null;
    return {
      teoria: true, id, titulo: te.titulo || t.titulo, cabeco: `${t.materia}: teoria`, porQueCai: te.porQueCai || null,
      secoes: (() => {
        let nEx = 0, nFig = 0;
        const ex = e => (e && typeof e.enunciado === 'string' ? { n: ++nEx, enunciado: e.enunciado, resolucao: s(e.resolucao) } : null);
        return (te.secoes || []).map((x, i) => {
          const fig = x.figura && limparSvg(x.figura.svg) ? { n: ++nFig, svg: limparSvg(x.figura.svg), alt: typeof x.figura.alt === 'string' ? x.figura.alt : '', legenda: typeof x.figura.legenda === 'string' ? x.figura.legenda : null } : null;
          const tb = x.tabela && Array.isArray(x.tabela.linhas) ? { cabecalho: s(x.tabela.cabecalho), linhas: x.tabela.linhas.filter(Array.isArray).map(l => l.map(c => String(c == null ? '' : c))), legenda: typeof x.tabela.legenda === 'string' ? x.tabela.legenda : null } : null;
          const exemplos = [x.exemplo, ...(Array.isArray(x.exemplos) ? x.exemplos : [])].map(ex).filter(Boolean);
          // imagem real (domínio público ou licença livre), com crédito embaixo; só arquivo local do pacote
          const im = x.imagem && /^\.\/conteudo\/[\w./-]+\.(png|jpe?g|webp|svg)$/.test(x.imagem.src || '') && typeof x.imagem.credito === 'string'
            ? { src: x.imagem.src, alt: typeof x.imagem.alt === 'string' ? x.imagem.alt : '', legenda: typeof x.imagem.legenda === 'string' ? x.imagem.legenda : null, credito: x.imagem.credito } : null;
          // "Confira": uma pergunta rápida de recordação no fim da seção, com a resposta na hora (não conta nível)
          const cf = x.confira;
          const confira = cf && typeof cf.pergunta === 'string' && Array.isArray(cf.opcoes) && cf.opcoes.length >= 2 && Number.isInteger(cf.certa) && cf.certa >= 0 && cf.certa < cf.opcoes.length
            ? { pergunta: cf.pergunta, opcoes: s(cf.opcoes), certa: cf.certa, porque: typeof cf.porque === 'string' ? cf.porque : '' } : null;
          return { n: i + 1, titulo: x.titulo || '', paragrafos: s(x.paragrafos), figura: fig, imagem: im, tabela: tb, atencao: typeof x.atencao === 'string' && x.atencao ? { rotulo: 'No Enem', texto: x.atencao } : null, exemplos, confira };
        });
      })(),
      armadilhas: s(te.armadilhas), resumo: s(te.resumo),
      // pré-treino: os termos do tópico, com uma linha cada, antes da primeira seção
      termos: (Array.isArray(te.termos) ? te.termos : []).filter(x => x && typeof x.termo === 'string' && typeof x.def === 'string').map(x => ({ termo: x.termo, def: x.def })),
      pagina: { titulo: te.titulo || t.titulo, pe: 'Teoria' },
      // "revisado por … em …" só quando o conteúdo registra a revisão (campo revisao: { por, em } no *.teoria.js)
      credito: `Texto da equipe Prumo · CC BY-SA 4.0${rev ? ` · revisado por ${rev.por.trim()}${R.ehData(rev.em) ? ` em ${R.fmtCompleta(rev.em)}` : ''}` : ''}`,
      // a conta da capa ("cerca de N min"), pronta: a mesma que a missão usa no tempo
      minutos: this.prat.minutosTeoria(id),
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
    // aquecimento respondido numa missão encerrada antes do fim da apostila: a resposta aparece no fim desta leitura
    const pr = ((this.st.praticas || {})[p.cap] || {}).pre, aguarda = !!(pr && pr.alt && !pr.revelado);
    const temQuestao = m.passos.slice(m.i + 1).some(x => x.t === 'questao' || x.t === 'revisao');
    return Object.assign(this.teoria(p.cap), {
      estado: 'leitura', fase: this._fase('apostila'), topo: this._topo(p, `Apostila: ${this.prat.curto(p.cap)}`),
      faixa: respondeuAgora ? 'Resposta guardada. No fim da apostila você vê se acertou.' : aguarda ? 'No fim da apostila você vê se acertou o aquecimento.' : null,
      jaSei: temQuestao || aguarda ? { evento: 'JA_SEI', rotulo: 'Já sei isto: pular a leitura' } : null,
      botao: { evento: 'TERMINEI_TRECHO', rotulo: aguarda ? 'Terminei de ler: ver a resposta do aquecimento' : temQuestao ? 'Terminei de ler: ir para as questões' : 'Terminei de ler' },
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
      vm.revisao = { texto: this._textoRevisao(fr, `o ${cn}`, p.cap), nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: !!fr.venceu && fr.caixaDepois > fr.caixaAntes } };
      if (fr.venceu) { vm.titulo = vm.revisao.texto; vm.som = fr.caixaDepois > fr.caixaAntes ? 'nivel' : 'acerto'; }
      else vm.som = null;   // nível que desce: sem animação e sem som
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
  /** Frase do resultado da revisão (feedback e Pronto), fiel ao motor: certa sobe um nível (ou continua no
   *  teto); errada desce UM nível (nunca abaixo de 1) e volta no próximo dia de estudo. A data, nos dois casos,
   *  é a do dia de estudo em que ela entra ("amanhã, qua 18/11" ou, na véspera da folga, "na segunda, 23/11"). */
  _textoRevisao(fr, nome, cap, { certaAntes = true, semNota = false } = {}) {
    const prox = R.fmtCurta(this._ef(fr.proxima));
    if (fr.venceu) {
      const t = fr.caixaDepois > fr.caixaAntes ? `${nome} subiu para o ${rotuloNivel(fr.caixaDepois)}` : `${nome} continua ${noNivel(fr.caixaDepois)}${semNota && fr.caixaDepois < 5 ? '' : this._notaTopo(fr.caixaDepois)}`;
      return `${certaAntes ? 'Certa. ' : ''}${cap1(t)}. Próxima revisão: ${prox}.`;
    }
    const nivel = fr.caixaDepois < fr.caixaAntes ? `${cap1(nome)} desceu para o ${rotuloNivel(fr.caixaDepois)}.` : `${cap1(nome)} fica ${noNivel(fr.caixaDepois)}.`;
    return `A revisão ${this._de(cap)} volta ${voltaEm(this._ef(fr.proxima), R.hoje())}. Seus dias estudados e seu histórico continuam. ${nivel}`;
  }
  _feedbackPratica(u) {
    const st = this.st, m = st.missao, item = this.missao.itemDe(u.item), p = m.passos[u.passo] || {}, ok = u.res === 'ok', d = R.hoje();
    const alt = item.alternativas.find(a => a.letra === u.alt) || {}, nome = this.prat.titulo(u.cap);
    const depois = m.passos.slice(m.i + 1).some(x => x.t === 'questao' || x.t === 'revisao');
    const vm = {
      estado: 'feedback', tipo: u.revela ? 'revela' : u.t === 'revisao' ? 'revisao' : 'enem',
      rotulo: u.revela ? 'Resposta do aquecimento' : u.t === 'revisao' ? `Revisão do ${this._nomeCap(u.cap)}` : 'Questão do Enem', subrotulo: null, certa: ok,
      titulo: u.revela ? (ok ? `Antes de ler, você marcou ${u.alt}. Certa.` : `Antes de ler, você marcou ${u.alt}. A certa é ${item.gabarito}.`) : ok ? 'Certa.' : `Você marcou ${u.alt}. A certa é ${item.gabarito}.`,
      porque: u.revela || ok ? item.explicacao || null : null,
      falta: u.revela || ok ? null : alt.falta || null,
      item: this._itemVM(item),
      alternativas: item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, html: !!a.html, imagem: null, marca: a.letra === u.alt && a.certa ? 'sua-certa' : a.letra === u.alt ? 'sua' : a.certa ? 'certa' : null })),
      trecho: !u.revela && !ok ? { evento: 'VOLTAR_AO_TRECHO', rotulo: 'Rever a apostila', secao: item.secao || null } : null,
      resolucao: !u.revela && !ok && item.explicacao ? { evento: 'VER_RESOLUCAO', rotulo: 'Ver a resolução da equipe', aberta: !!m.resolucaoAberta, texto: item.explicacao } : null,
      proxima: u.revela && depois ? 'Agora, as questões do Enem, da mais fácil para a mais difícil.' : null,
      revisao: null, fimRodada: null,
      medidor: !u.revela && p.t === 'questao' && !p.antecipada ? this._medidorDepois(u, p) : null,
      continuar: { evento: 'CONTINUAR', rotulo: 'Continuar', texto: 'Leia a explicação', pausaMs: u.pausaMs, liberaEm: (m.feedbackEm || 0) + u.pausaMs, restanteMs: Math.max(0, (m.feedbackEm || 0) + u.pausaMs - R.agora()) },
      som: u.revela ? null : ok ? 'acerto' : 'erro',
      topo: this._topo(p, u.revela ? 'Aquecimento: a resposta' : 'Resultado'),
      // a resposta do aquecimento vem depois da apostila: Aquecer e Apostila ficam feitos, e a trilha não anda para trás
      fase: this._fase('questoes'),
    };
    if (u.revisao) {
      const fr = u.revisao;
      vm.revisao = { texto: this._textoRevisao(fr, nome, u.cap), nivel: { de: fr.caixaAntes, para: fr.caixaDepois, animar: !!fr.venceu && fr.caixaDepois > fr.caixaAntes } };
      if (fr.venceu) { vm.titulo = vm.revisao.texto; vm.som = fr.caixaDepois > fr.caixaAntes ? 'nivel' : 'acerto'; }
      else vm.som = null;
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
    if (fr.extra) return { variante: fr.venceu ? 'venceu' : 'teto', texto: fr.venceu ? `Revisão antecipada vencida. O nível de ${nome} só sobe na revisão do dia marcado (${R.fmtCurta(this._ef(fr.proxima))}).` : `A revisão antecipada mostrou que ${nome} está escapando: a revisão passou para ${dataRevisao(this._ef(fr.proxima), d)}.` };
    if (fr.venceu) return { variante: 'venceu', texto: `${nome} entrou ${noNivel(fr.caixaDepois)}. A primeira revisão fica para ${dataRevisao(this._ef(fr.proxima), d)}.` };
    const resta = ineditas(this.st, this.prat, fr.cap).length;
    const prox = resta ? `Na próxima vez, o tópico continua com ${resta === 1 ? 'a questão que falta' : `as ${resta} questões que faltam`}.` : 'As questões deste tópico voltam quando fizer 7 dias que você as viu.';
    if (fr.naoFecha) return { variante: 'naoFecha', texto: `Com as questões que restam hoje, não dá mais para acertar duas seguidas. ${prox}` };
    return { variante: 'teto', texto: `Rodada encerrada em ${nDe(fr.tentativas, 'questão', 'questões')}, sem duas certas seguidas. Nada se perde. ${prox}` };
  }
  _textoFimRodada(fr) {
    if (fr.fonte === 'pratica') return this._fimRodadaPratica(fr);
    const pk = this.pack, c = pk.capitulo(fr.cap), d = R.hoje();
    if (fr.extra) return { variante: fr.venceu ? 'venceu' : 'teto', texto: fr.venceu ? `Revisão antecipada vencida. O nível do Cap. ${c.n} só sobe na revisão do dia certo (${R.fmtCurta(this._ef(fr.proxima))}).` : `A revisão antecipada mostrou que o Cap. ${c.n} está escapando: a revisão dele passou para ${dataRevisao(this._ef(fr.proxima), d)}.` };
    if (fr.venceu) return { variante: 'venceu', texto: `${c.titulo} entrou ${noNivel(fr.caixaDepois)}. A primeira revisão fica para ${dataRevisao(this._ef(fr.proxima), d)}.` };
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
      fase: this._fase('questoes'),
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
      if (fr.extra) mud.push({ tipo: 'antecipada', texto: fr.venceu ? `A revisão antecipada do ${cn} fechou. O nível só sobe na revisão do dia certo.` : `A revisão do ${cn} ficou para ${dataRevisao(this._ef(fr.proxima), d)}.` });
      else if (fr.venceu) mud.push({ tipo: 'nivel', texto: `O ${cn} entrou ${noNivel(fr.caixaDepois)}. Próxima revisão: ${dataRevisao(this._ef(fr.proxima), d)}.`, nivel: { cap: fr.cap, de: fr.caixaAntes, para: fr.caixaDepois, animar: true } });
      else mud.push({ tipo: 'teto', texto: `${cap1(this._curto(fr.cap))}: ${this._textoFimRodada(fr).texto}` });
      if (fr.cardsRecebidos) mud.push({ tipo: 'cards', texto: `Os ${fr.cardsRecebidos} cartões do ${cn} entraram no seu baralho.` });
    }
    for (const rv of res.revisoes) {
      const cn = this._nomeCap(rv.cap);
      mud.push({ tipo: 'revisao', texto: this._textoRevisao(rv, `o ${cn}`, rv.cap, { certaAntes: false, semNota: true }), nivel: { cap: rv.cap, de: rv.caixaAntes, para: rv.caixaDepois, animar: !!rv.venceu && rv.caixaDepois > rv.caixaAntes } });
    }
    // o teto da demonstração, uma vez só (e não em cada revisão que ficou no nível)
    if (res.revisoes.some(rv => rv.venceu && this._notaTeto(rv.caixaDepois))) mud.push({ tipo: 'nota', texto: `Na demonstração, o nível vai até ${this._teto()} de 5.` });
    const pres = m.passos.filter(p => p.t === 'pre'), ultimoFeito = m.parcial ? m.i - 1 : m.passos.length - 1;
    const soAntes = m.parcial && res.tentativas === 0;   // encerrou sem responder questão: a frase do "vazio" já conta o que houve
    if (!soAntes && pres.length && res.pres > 0 && pres.every(p => m.passos.indexOf(p) <= ultimoFeito || (!m.parcial))) mud.push({ tipo: 'antes', texto: pres.some(p => p.fonte === 'pratica') ? 'Você fez o aquecimento antes de ler a apostila.' : 'Você tentou antes de ler em todos os trechos cobrados.' });
    // só os marcos ganhos NESTA missão (resumo.marcos); um estudo por conta própria não repete o marco ganho mais cedo
    const marcosAqui = Array.isArray(res.marcos) ? res.marcos : m.livre ? [] : MARCOS.filter(mc => st.marcos[mc.id] === d).map(mc => mc.id);
    for (const mc of MARCOS) if (marcosAqui.includes(mc.id)) mud.push({ tipo: 'marco', texto: `Marco: ${mc.nome}.`, marco: mc.id });
    if (res.cards) mud.push({ tipo: 'mao', texto: res.cards.texto });
    let manter = null;
    const revsPassos = m.passos.some(p => p.t === 'revisao');
    if (m.tipo === 'questaoDoDia' && res.dia.n) {
      // com revisão somada (P1), nada de "Nenhuma revisão venceu": ela entra na conta do dia
      const rv = res.revisoes.length;
      manter = `Hoje foi dia de manter: ${nDe(res.dia.n, 'questão do dia', 'questões do dia')}, ${nDe(res.dia.certas, 'certa', 'certas')} de primeira${rv ? `, e ${nDe(rv, 'revisão', 'revisões')}` : ''}.${rv || revsPassos ? '' : ' Nenhuma revisão venceu.'}`;
    } else if (m.retorno && res.revisoes.length) {
      const atr = m.passos.some(p => p.t === 'revisao' && p.atrasada);
      manter = `${atr ? 'Hoje foi dia de pôr as revisões em dia' : 'Hoje foi dia de revisões'}: ${nDe(res.revisoes.length, 'revisão', 'revisões')}, ${nDe(res.revisoes.filter(x => x.venceu).length, 'certa', 'certas')} na primeira resposta.`;
    }
    if (manter) mud.unshift({ tipo: 'manter', texto: manter });
    const subiu = res.rodadas.some(x => x.venceu && !x.extra) || res.revisoes.some(x => x.caixaDepois > x.caixaAntes);
    if ((m.tipo === 'novo' || m.tipo === 'pratica') && !subiu && res.tentativas > 0) {
      const pe = paginasComErro(st, pk, m.cap), pg = pk.capitulo(m.cap).paginas[pe.principal];
      mud.push({ tipo: 'nada', texto: `Hoje não subiu nível. ${registradas(res.tentativas)}; a p. ${pg.n} volta no próximo dia de estudo.` });
    } else if (m.tipo === 'topico' && !subiu && res.tentativas > 0 && !res.rodadas.length) {
      mud.push({ tipo: 'nada', texto: `Hoje não subiu nível. ${registradas(res.tentativas)}.` });
    }
    const ultimaRodada = res.rodadas.length ? res.rodadas[res.rodadas.length - 1] : null;
    const prox = this._proximoDia(d);
    const umaVezPorSemana = !st.config.ultimaCopia || R.diff(st.config.ultimaCopia, d) >= 7;
    const horaProx = prox ? ((st.intencao && st.intencao.dia === prox.dia && st.intencao.horario) || st.perfil.horario || '19:00') : null;
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
        // o alarme só "fica para" um horário se o aluno disse que criou o alarme no Primeiro uso
        lembrete: st.config.alarme === 'criado' ? `Com isso, o alarme do Prumo fica para as ${horaProx}. Ajuste no app Relógio, se quiser.` : `Se quiser, crie um alarme "Prumo" às ${horaProx} no Relógio do celular.`,
      } : null,
      // a pergunta da próxima missão, só o enunciado; o rótulo diz o dia certo e a questão do Enem leva o crédito
      amanha: prox && prox.primeira && !m.livre ? { rotulo: `${prox.quando} começa por aqui`, html: prox.primeira, aviso: `${prox.fonte ? `${prox.fonte}. ` : ''}Só para pensar no caminho: a resposta fica para a missão.`, fonte: prox.fonte, rodape: prox.rodape, licencaUrl: prox.licencaUrl } : null,
      continuar: { rotulo: 'Continuar estudando', aba: 'estudar', texto: 'Se quiser, pode continuar estudando por conta própria.' },
      visto: st.dias[d] && !m.livre ? (() => { const obs = m.boasVindas ? ['retorno', obsVisto].filter(Boolean).join(', ') : obsVisto; return { palavra: 'Visto', data: R.fmtCompleta(d), obs, retorno: !!m.boasVindas, rotulo: `Visto de ${R.fmtCompleta(d)}${obs ? `. ${obs}` : ''}` }; })() : null,
      fecho: m.livre ? this._fechoLivre(m, d) : 'Por hoje é isso. Está tudo guardado neste aparelho.',
      fase: m.tipo === 'topico' ? (m.livre ? 'registro' : 'visto') : null,
      constancia: { simbolo: cons.simbolo, diasEstudados: cons.diasEstudados, rotulo: cons.rotulo, tracoDeHoje: !!st.dias[d] },
      semanaPassada: st.dias[d] ? Plano.linhaSemanaPassada(st, d) : null,
      mudancas: mud,
      placar: m.placar && m.placar.total && !m.parcial ? { pontos: m.placar.pontos, acertos: m.placar.acertos, total: m.placar.total, maxSeq: m.placar.maxSeq,
        estrelas: m.placar.estrelas || estrelasDe(m.placar), recorde: m.placar.recorde || false,
        raspa: m.placar.raspa ? { raspada: !!m.placar.raspa.raspada, tipo: m.placar.raspa.premio.tipo, valor: m.placar.raspa.premio.valor || 0,
          texto: m.placar.raspa.premio.tipo === 'dourado' ? 'Carimbo dourado!' : `+${m.placar.raspa.premio.valor} pontos` } : null,
        regra: '3 carimbos acertando 9 de cada 10 questões, 2 acertando 6 de cada 10, 1 por terminar a partida.' } : null,
      nivelAnimado: ultimaRodada && ultimaRodada.venceu && !ultimaRodada.extra ? { cap: ultimaRodada.cap, de: ultimaRodada.caixaAntes, para: ultimaRodada.caixaDepois, nome: rotuloNivel(ultimaRodada.caixaDepois), rotulo: rotuloNivel(ultimaRodada.caixaDepois) } : null,
      parcial: m.parcial ? `Você encerrou no passo ${m.encerradoNoPasso} de ${m.passos.length}. O que já tinha fechado hoje continua; o resto não mudou nenhum nível.` : null,
      vazio: soAntes ? this._vazioPronto(m) : null,
      passos: m.parcial ? { feitos: Math.max(0, (m.encerradoNoPasso || 1) - 1), total: m.passos.length, andou: !!st.dias[d] } : null,
      naoContou: m.parcial && !st.dias[d] ? (m.tipo === 'topico' ? 'O dia não conta como estudado: ele conta quando você responde uma questão ou revisão, e o aquecimento não entra nessa conta.' : 'O dia não conta como estudado: ele conta quando você responde uma checagem, questão ou revisão.') : null,
      proxima: prox ? { texto: prox.texto, gancho: prox.gancho, porque: prox.porque, rotuloPorque: 'Por quê?' } : null,
      copia: umaVezPorSemana ? { rotulo: 'Salvar uma cópia do meu progresso' } : null,
      som: subiu ? 'nivel' : null,
      acao: { evento: 'FECHAR', rotulo: 'Fechar' },
    };
  }

  /** O que ficou feito numa missão encerrada antes da primeira questão respondida (sem "pergunta de entrada"):
   *  no tópico, o aquecimento (que não volta) e a apostila; no caderno, a pergunta antes de ler (que volta). */
  _vazioPronto(m) {
    const res = m.resumo;
    if (m.tipo === 'topico') {
      const aq = res.pres > 0, ap = res.apostila || (m.ultima && m.ultima.revela ? 'lida' : null);
      const vem = m.passos.some(p => p.t === 'questao' && p.cap === m.cap) ? 'as questões do Enem' : 'a revisão do tópico';
      const leu = ap === 'lida' ? 'leu a apostila' : 'passou pela apostila';
      if (aq && ap) return `Hoje você fez o aquecimento e ${leu}. Na próxima vez que estudar este tópico, vêm ${vem}; a apostila abre antes, e dá para pular.`;
      if (aq) return `Hoje você fez o aquecimento. Na próxima vez que estudar este tópico, vêm a apostila (no fim dela, a resposta do aquecimento) e ${vem}.`;
      if (ap) return `Hoje você ${leu}. Na próxima vez que estudar este tópico, vêm ${vem}; a apostila abre antes, e dá para pular.`;
      return 'Hoje você encerrou antes da primeira pergunta. Nada mudou.';
    }
    if (res.pres > 0) return res.pres === 1 ? 'Hoje ficou só a pergunta antes de ler. Ela volta no próximo dia de estudo.' : 'Hoje ficaram só as perguntas antes de ler. Elas voltam no próximo dia de estudo.';
    return 'Hoje você encerrou antes da primeira pergunta. Nada mudou.';
  }
  /** Fecho do "Estudo registrado" (estudo por conta própria), fiel ao que a missão era: a revisão antecipada não
   *  muda o nível; a rodada e a revisão do dia certo seguem as regras da missão. "Conta como dia" só se for novidade. */
  _fechoLivre(m, d) {
    const st = this.st;
    const antecipada = m.tipo === 'antecipada' || (m.passos.some(p => p.antecipada) && !m.passos.some(p => (p.t === 'questao' && !p.antecipada) || p.t === 'revisao'));
    const oQue = antecipada ? 'Estudo por conta própria: foi uma revisão antecipada, que firma o conteúdo; o nível só muda na revisão do dia marcado.' : 'Estudo por conta própria, pelas mesmas regras da missão.';
    const visto = st.carimbos && st.carimbos[d] ? 'O visto de hoje é o da missão.' : st.dias[d] ? 'O dia conta como estudado, mas o estudo por conta própria não dá visto.' : 'Ele não dá visto.';
    return `${oQue} ${visto} Está tudo guardado neste aparelho.`;
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
    const topo = { etapa: 'Prova do caderno', encerrar: 'Encerrar', casas: Prova.casasProva(pk, pr), tentativa: `tentativa ${pr.rodada.tentativas + (nome === 'provaPergunta' ? 1 : 0)} de ${P.chefe.teto}`, regra: Prova.regraProva(pk), vidas: { total: VIDAS_PROVA, restam: pr.vidas == null ? VIDAS_PROVA : pr.vidas }, placar: this._placar(pr.placar), eventoEncerrar: 'ENCERRAR_PROVA', avisoEncerrar: 'Encerrar a prova no meio não muda nada.' };
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
      else if ((e === 'agendado' || e === 'vencido') && revisaoAtrasada(st, t.proxima, d)) { const n = R.diff(this._ef(t.proxima), d); estado = `Revisão atrasada há ${nDe(n, 'dia', 'dias')}.`; }
      else if ((e === 'agendado' || e === 'vencido') && this._ef(t.proxima) === d) estado = 'Revisão marcada para hoje.';
      else estado = ultRev && !ultRev.venceu && ultRev.dia === [...(t.rodadas || [])].slice(-1)[0].dia ? `Voltou para o nível ${t.caixa} de 5. Próxima revisão: ${R.fmtQuando(this._ef(t.proxima), d)}.` : `Em dia. Próxima revisão: ${R.fmtCurta(this._ef(t.proxima))}.`;
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
      avisoDemo: this._teto() < 5 ? `Na demonstração, o nível vai até ${this._teto()} de 5.` : null,
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
      regraNivel: `Cada capítulo tem 5 níveis, de 1 a 5. ${regraNivel('o capítulo', this._teto())}`,
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
    const c = this.pack.capitulo(e.cap), quando = t.caixa && t.proxima ? (this._ef(t.proxima) <= d ? 'hoje' : R.fmtCurta(this._ef(t.proxima))) : null;
    if (e.estado === 'resolvido') return c ? `Resolvido: você acertou uma questão parecida em ${R.fmtDiaMes(e.resolvidoEm)}.` : `Resolvido: você acertou esta questão em ${R.fmtDiaMes(e.resolvidoEm)}.`;
    if (!c && this.prat.existe(e.cap)) return `Ela pode voltar quando fizer 7 dias que você a viu, depois das questões ainda inéditas do tópico.${quando ? ` A próxima revisão de ${this.prat.curto(e.cap)} é ${quando}.` : ''}`;
    if (!c) return 'Uma questão parecida volta numa próxima revisão.';
    return quando ? `Uma questão parecida, com outros números, volta na revisão do Cap. ${c.n}, ${quando}.` : `Uma questão parecida, com outros números, volta quando você revisar o Cap. ${c.n}.`;
  }
  _refazerInfo(e) {
    const st = this.st, d = R.hoje(), m = st.missao;
    const rotulo = 'Refazer com outros números', nota = 'Uma vez por dia. Não muda o nível.';
    if (!this.pack.capitulo(e.cap)) return { disponivel: false, rotulo, nota, motivo: 'Questão de um tópico: ela volta nas rodadas e revisões do próprio tópico.' };
    const mp = this._modeloRefazer(e);
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
      let it = null; try { it = this.missao.itemDe(e.item); } catch (x) { /* item removido do pack */ }
      const loc = e.paragrafo ? pk.local(e.paragrafo) : null, c = pk.capitulo(e.cap), tp = !c && this.prat.existe(e.cap);
      return {
        id: e.id, cap: e.cap, capRotulo: c ? `Cap. ${c.n}` : tp ? this.prat.curto(e.cap) : '', dia: R.fmtDiaMes(e.dia),
        questao: it ? { rotulo: it.origem === 'enem' ? `Questão ${it.numero} do ${it.prova}` : `Questão da equipe${it.pagina ? ` sobre a p. ${pk.pagina(it.pagina).n}` : ''}`, enunciado: it.origem === 'enem' ? it.contexto : it.enunciado, introducao: it.introducao || '', imagens: it.imagens || [], rodape: it.rodape, alternativas: it.alternativas.map(a => ({ letra: a.letra, texto: a.texto, marca: a.letra === e.marcou ? 'sua' : a.certa ? 'certa' : null })) } : null,
        linha: `Você marcou ${e.marcou}. A certa é ${e.certa}.`,
        falta: e.falta || null, anotacao: e.anotacao || '', foiIsso: { valor: e.foiIsso, pergunta: 'Foi isso?', opcoes: [{ valor: 'sim', rotulo: 'Sim' }, { valor: 'outra', rotulo: 'Foi outra coisa' }] },
        trecho: loc ? { rotulo: `Abrir o trecho (p. ${loc.paginaN}, parágrafo ${loc.n})`, pagina: loc.pagina, paragrafo: loc.paragrafo } : null,
        // erro de tópico de prática: a apostila do tópico (na seção da questão, quando o conteúdo informa)
        apostila: tp ? { rotulo: 'Rever a apostila', topico: e.cap, secao: (it && it.secao) || null, ancora: it && it.secao ? `secao-${it.secao}` : null } : null,
        situacao: this._situacaoErro(e), estado: e.estado,
        refazer: this._refazerInfo(e),
        irAlem: c ? (c.irAlem || []).map(l => ({ rotulo: l.rotulo, url: l.url, aviso: l.aviso })) : [],
      };
    });
    return {
      filtros: [...pk.capitulos.map(c => ({ cap: c.id, rotulo: `Cap. ${c.n}`, n: todos.filter(e => e.cap === c.id).length })),
        ...this.prat.ids().filter(id => todos.some(e => e.cap === id)).map(id => ({ cap: id, rotulo: this.prat.curto(id), n: todos.filter(e => e.cap === id).length }))], filtro: filtroCap,
      itens,
      vazio: !todos.length ? 'Nenhum erro guardado ainda. Quando você errar uma questão, ela vem para cá com o que faltou e o trecho do caderno ou da apostila que explica.' : !itens.length ? (pk.capitulo(filtroCap) ? 'Nenhum erro neste capítulo.' : 'Nenhum erro neste tópico.') : null,
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
    const st = this.st, d = R.hoje(), m0 = st.missao, pk = this.pack, out = [];
    // no estudo por conta própria, a linha de hoje é a da missão do dia (já cumprida)
    const m = m0 && m0.livre && m0.missaoDoDia ? m0.missaoDoDia : m0;
    const atribuidos = new Set(), cardsAtrib = new Set();
    // o próximo dia de estudo é projetado com a mesma conta da "Próxima missão" (montarMissaoGeral), quando
    // nada de hoje ainda pode mudar o estado; com a missão de hoje por fazer, ele depende do resultado de hoje
    const ativa = !!(m && m.passos.length && m.tipo !== 'folga' && m.tipo !== 'pausa');
    const pendente = (ativa && !m.fechada && !m.hojeNao) || !!(m0 && m0.livre && !m0.fechada);
    const prox = Plano.proximoDiaDeEstudo(st, d);
    const proj = prox && m && !pendente ? montarMissaoGeral(st, pk, this.M, this.prat, prox) : null;
    for (let i = 0; i < 14; i++) {
      const dia = R.addDias(d, i);
      const estudo = Plano.ehDiaDeEstudo(st, dia), pausa = Plano.emPausa(st, dia);
      const linha = { dia, rotulo: R.fmtCurta(dia), tipo: pausa ? 'pausa' : estudo ? 'estudo' : 'folga', itens: [], texto: '' };
      let nota = null;
      if (i === 0 && ativa) {
        linha.tipo = 'estudo';
        if (m.fechada) linha.status = m.parcial ? 'encerrada antes do fim' : 'feito';
        else if (m.hojeNao) linha.status = 'você marcou “Hoje não”';
        if (m.tipo === 'novo') linha.itens.push(`${this._nomeCap(m.cap)} (novo)`);
        else if (m.tipo === 'pratica') linha.itens.push(`${this._nomeCap(m.cap)} (continuação)`);
        else if (m.tipo === 'antecipada') linha.itens.push(`revisão antecipada do ${this._nomeCap(m.cap)}`);
        else if (m.tipo === 'questaoDoDia') linha.itens.push('Questão do dia');
        else if (m.tipo === 'topico') linha.itens.push(this.prat.titulo(m.cap));
        const revs = m.passos.filter(p => p.t === 'revisao');
        // só fica "de hoje" a revisão ainda pendente; a feita hoje já tem data nova e aparece nela, mais abaixo
        revs.forEach(p => { const t = st.topicos[p.cap]; if (!t || !t.proxima || t.proxima <= d) atribuidos.add(p.cap); });
        if (revs.length) linha.itens.push(this._revisoes(revs.map(p => p.cap)));
        const cd = m.passos.find(p => p.t === 'cards');
        if (cd) { cd.ids.forEach(x => { const c = (st.cards || {})[x]; if (!c || c.proxima <= d) cardsAtrib.add(x); }); linha.itens.push(nDe(cd.ids.length, 'cartão', 'cartões')); }
      } else if (linha.tipo === 'estudo' && proj && dia === prox) {
        // a missão que o Prumo montaria nesse dia: o capítulo novo e as revisões anunciadas na "Próxima missão"
        const pt = this._partesMissao(proj);
        if (pt.principal) linha.itens.push(pt.principal);
        if (pt.revs.length) { linha.itens.push(this._revisoes(pt.revs)); pt.revs.forEach(c => atribuidos.add(c)); }
        const cd = proj.passos.find(p => p.t === 'cards');
        if (cd) { cd.ids.forEach(x => cardsAtrib.add(x)); linha.itens.push(nDe(cd.ids.length, 'cartão', 'cartões')); }
        linha.projetada = true;
      } else if (linha.tipo === 'estudo') {
        const devidos = [...this.M.topicosAtivos(st), ...this.prat.ids()].filter(id => { const t = st.topicos[id]; return t && t.caixa && t.proxima && t.proxima <= dia && !atribuidos.has(id); });
        devidos.forEach(x => atribuidos.add(x));
        if (devidos.length) linha.itens.push(this._revisoes(devidos));
        const cs = Object.entries(st.cards || {}).filter(([id, c]) => c.proxima <= dia && !cardsAtrib.has(id)).slice(0, Cards.MAO_MAX);
        cs.forEach(([id]) => cardsAtrib.add(id));
        if (cs.length) linha.itens.push(nDe(cs.length, 'cartão', 'cartões'));
        // o que ainda não está marcado não é "sem revisão": depende do resultado de hoje (no próximo dia de estudo) ou do que vier até lá
        if (pendente && dia === prox) nota = 'depende do resultado de hoje';
        else if (!linha.itens.length) nota = 'depende do que você fizer até lá';
      }
      const its = linha.itens, frase = its.length > 1 ? `${its.slice(0, -1).join(', ')} e ${its[its.length - 1]}` : (its[0] || '');
      const corpo = linha.tipo === 'folga' ? 'folga' : linha.tipo === 'pausa' ? 'pausa' : frase && nota ? `${frase}; o resto ${nota}` : (frase || nota || '');
      linha.texto = `${cap1(linha.rotulo)}: ${corpo}${linha.status ? `, ${linha.status}` : ''}.`;
      out.push(linha);
    }
    const firme = this.M.topicosAtivos(st).length && this.M.topicosAtivos(st).every(id => (st.topicos[id] || {}).caixa >= Math.min(3, st.config.nivelMaximo || 5));
    const iv = Plano.intervalos(st, d);
    return {
      dias: out, tudoFirme: firme ? 'Todos os capítulos estão no nível 3 de 5 ou acima. As revisões voltam em intervalos que crescem com o nível.' : null,
      porQueEstaOrdem: `As revisões vencem pela agenda calculada a partir da data da prova: no nível 1 de 5, ${nDe(iv[1], 'dia', 'dias')}; no nível 2, ${iv[2]}; no 3, ${iv[3]}; no 4, ${iv[4]}; no 5, ${iv[5]}.${this._teto() < 5 ? ` Na demonstração, o nível vai até ${this._teto()} de 5.` : ''} Revisão que vence numa folga (ou num dia em que você marcou “Hoje não”) entra no próximo dia de estudo, e as atrasadas vêm primeiro. O próximo dia de estudo mostra a missão que o Prumo montaria com o que você já fez; os dias depois dele mostram só o que já está marcado, porque capítulo novo e Questão do dia dependem do que acontecer até lá.`,
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
      meta: { valor: p.metaSemana, texto: p.metaSemana ? `Estudar ${nDe(p.metaSemana, 'dia', 'dias')} por semana (opcional).` : 'Sem meta por semana.', regra: 'Em Hoje você acompanha a semana. Ela entra na conta de semanas com a meta quando termina, no domingo. Estudar num dia de folga ganha risquinho, mas não conta para a meta.' },
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
  /** O nível já aparece na régua com o rótulo, ao lado: aqui só a revisão (pela data em que ela entra). */
  _textoEstadoTopico(e, t, d) {
    if (e === 'novo') return 'Ainda não começou.';
    if (e === 'pratica') return 'Começado. Acerte 2 questões seguidas para entrar no nível 1 de 5.';
    const ef = this._ef(t.proxima);
    if (revisaoAtrasada(this.st, t.proxima, d)) return `Revisão atrasada desde ${R.fmtCurta(ef)}.`;
    if (ef === d) return 'Revisão marcada para hoje.';
    return `Próxima revisão: ${R.fmtCurta(ef)}.`;
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
      estadoTexto: abertos === caps.length ? `Os ${caps.length} capítulos estão abertos. O mais fraco está ${noNivel(min)}.` : comecou ? 'Começado. A régua mostra o capítulo mais fraco.' : 'Ainda não começou.',
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
        // "Filosofia e Sociologia" entra separada: uma lista com um "e" só, e o verbo no plural
        frase: disponivel ? null : (l => `${juntar(l)} ${l.length > 1 ? 'chegam' : 'chega'} nas próximas versões.`)(a.materias.flatMap(x => x.split(' e '))),
      };
    });
    return {
      titulo: 'O que estudar',
      intro: 'O mapa do que cai no Enem: área, matéria e tópico. Escolha um tópico para ver o seu nível e estudar.',
      areas,
      regraNivel: `${regraNivel('o tópico', this._teto())} As revisões são marcadas pela data da sua prova.`,
    };
  }
  /** Trilha de fases (aba Estudar, Hoje e Pronto): cada área do Enem vira uma sequência de fases.
   *  Matemática: os 4 capítulos do caderno, a Prova do caderno (o Chefão, fora da corrente) e os tópicos.
   *  Regra: uma fase é concluída quando entra no nível 1 de 5; a seguinte libera nesse momento.
   *  Capítulo segue o pré-requisito do pack; tópico já começado nunca volta a ficar bloqueado. */
  trilha() {
    const st = this.st, d = R.hoje(), escolhidas = (st.perfil && st.perfil.areas) || ['MT'];
    const caixa = id => (st.topicos[id] || {}).caixa || 0;
    const comecou = id => { const x = st.topicos[id] || {}; return !!(x.caixa || (x.tentativas || []).length || (x.rodadas || []).length); };
    const nv = c => ({ cheios: c, rotulo: rotuloNivel(c) });
    const areas = [];
    for (const a of AREAS) {
      const fases = [];
      if (a.id === 'MT') {
        const s = this.sumario();
        for (const c of s.capitulos) fases.push({ id: c.id, tipo: 'capitulo', titulo: `Cap. ${c.n}: ${c.titulo}`, curto: c.titulo, href: `#/estudar/${this.pack.id}`, nivel: nv(c.nivel.cheios), bloqueioPack: c.bloqueado ? c.regra : null, conta: true });
        const pv = s.prova;
        fases.push({ id: `${this.pack.id}:prova`, tipo: 'chefe', titulo: `Prova de ${this.pack.titulo}`, curto: 'Prova do caderno', href: '#/caderno', nivel: null, conta: false,
          estado: pv.estado === 'vencida' ? 'concluida' : pv.estado === 'liberada' ? 'liberada' : 'bloqueada',
          legenda: pv.estado === 'vencida' ? 'Troféu ganho' : pv.estado === 'liberada' ? 'Chefão liberado' : 'Chefão',
          motivo: pv.estado === 'vencida' ? pv.texto : pv.estado === 'liberada' ? `${pv.regra}. Ela aparece em Hoje antes da missão do dia.` : pv.texto,
          ganho: 'O troféu do caderno e o selo de Matemática.' });
      }
      for (const c of CONHECIDOS.filter(x => x.area === a.id)) {
        const r = this._resumoTopico(c.id);
        if (!r.disponivel) continue;
        fases.push({ id: c.id, tipo: 'topico', titulo: r.titulo, curto: r.titulo.split(':')[0], href: `#/estudar/${c.id}`, nivel: nv(r.nivel.cheios), conta: true, comecou: comecou(c.id) });
      }
      if (!fases.length) continue;
      // a corrente dos tópicos: concluído (nível 1+) → o próximo libera; o 1º tópico da área está sempre liberado.
      // Capítulos seguem o pré-requisito do próprio caderno.
      let antTop = null, n = 0, atual = null;
      for (const f of fases) {
        if (!f.conta) continue;
        f.n = ++n;
        const feita = caixa(f.id) >= 1;
        if (feita) f.estado = 'concluida';
        else if (f.bloqueioPack) { f.estado = 'bloqueada'; f.motivo = f.bloqueioPack; }
        else if (f.tipo === 'capitulo' || !antTop || antTop.estado === 'concluida' || f.comecou) f.estado = 'liberada';
        else { f.estado = 'bloqueada'; f.motivo = `Libera quando “${antTop.curto}” entrar no nível 1 de 5.`; }
        if (!atual && f.estado === 'liberada') { atual = f; f.atual = true; }
        if (f.estado === 'concluida') f.legenda = f.nivel.rotulo;
        else if (f.estado === 'liberada') f.legenda = f.atual ? 'Fase atual' : comecou(f.id) ? 'Começada' : 'Liberada';
        else f.legenda = 'Bloqueada';
        if (!f.motivo) f.motivo = f.estado === 'concluida' ? `Fase concluída. As revisões sobem o nível até 5 de 5.` : 'Acerte 2 questões seguidas e a fase entra no nível 1 de 5: a próxima libera.';
        if (!f.ganho && f.tipo === 'capitulo') {
          const deps = this.pack.capitulos.filter(c => (c.prereq || []).includes(f.id)).map(c => `Cap. ${c.n}`);
          f.ganho = deps.length ? `Ajuda a liberar ${deps.length > 1 ? 'os' : 'o'} ${deps.join(' e ')}, e conta para o Chefão.` : 'Conta para liberar o Chefão, a Prova do caderno.';
        }
        if (!f.ganho) { const prox = fases.slice(fases.indexOf(f) + 1).find(x => x.tipo === 'topico'); f.ganho = prox ? `Libera o próximo tópico: ${prox.curto}.` : 'Fecha a trilha desta área.'; }
        if (f.tipo === 'topico') antTop = f;
      }
      const total = n, feitas = fases.filter(f => f.conta && f.estado === 'concluida').length;
      for (const f of fases) { delete f.bloqueioPack; delete f.comecou; delete f.conta; f.estrelas = f.estado === 'concluida' ? (st.estrelas || {})[f.id] || 0 : 0; }
      areas.push({ id: a.id, nome: a.nome, escolhida: escolhidas.includes(a.id), fases, feitas, total,
        atual: atual ? { id: atual.id, n: atual.n, titulo: atual.titulo, href: atual.href } : null,
        texto: feitas === total ? `Trilha completa: ${total} de ${total} fases.` : `${feitas} de ${total} fases concluídas${atual ? `. Agora: fase ${atual.n}, ${atual.curto}` : ''}.` });
    }
    return {
      titulo: 'Trilha',
      intro: 'Cada fase entra no nível 1 de 5 quando você acerta 2 questões seguidas, e aí a próxima libera. As revisões sobem o nível até 5 de 5.',
      areas,
      regra: `${regraNivel('a fase', this._teto())}`,
    };
  }
  /** A fase do tópico na trilha (para bloquear "Estudar este tópico" fora de ordem). */
  _faseDe(id) {
    for (const a of this.trilha().areas) { const f = a.fases.find(x => x.id === id); if (f) return f; }
    return null;
  }
  /** O botão "Estudar este tópico hoje", com o motivo quando não dá. */
  _acaoTopico(id) {
    const m = this.st.missao, fa = id === this.pack.id, rotulo = 'Estudar este tópico hoje', d = R.hoje();
    if (!m) return null;
    if (!fa) { const f = this._faseDe(id); if (f && f.estado === 'bloqueada') return { disponivel: false, rotulo, motivo: `Fase ${f.n} bloqueada. ${f.motivo}` }; }
    if (m.livre && m.iniciada && !m.fechada) {
      const deste = fa ? !this.prat.existe(m.cap) : m.cap === id, nomeL = this.prat.existe(m.cap) ? this.prat.titulo(m.cap) : this.pack.titulo;
      return deste
        ? { disponivel: true, evento: 'CONTINUAR', rotulo: `Continuar do passo ${Math.min(m.i + 1, m.passos.length)} de ${m.passos.length}`, nota: 'Você está estudando este tópico por conta própria.' }
        : { disponivel: false, rotulo, motivo: `Você está estudando ${nomeL} por conta própria. Termine ou encerre antes de abrir outro tópico.` };
    }
    const semVisto = this.st.carimbos && this.st.carimbos[d] ? 'sem um segundo visto' : 'sem visto';
    // "conta como dia estudado" só quando o dia ainda não contou; o nível, só o que a missão livre faz de fato
    const fimLivre = this.st.dias[d] ? `${cap1(semVisto)}.` : `Conta como dia estudado, ${semVisto}.`;
    if (m.fechada || m.livre) {
      if (fa) {
        // o caderno por conta própria: revisão antecipada do capítulo mais fraco (não muda o nível)
        const mm = montarMissao(this.st, this.pack, this.M, d, { livre: true, soCaderno: true });
        if (!mm.passos.length) return { disponivel: false, rotulo, motivo: 'Missão de hoje cumprida. As páginas do caderno ficam livres para ler na aba Caderno; as questões dele voltam na próxima missão.' };
        const oque = mm.tipo === 'antecipada' ? `uma revisão antecipada do ${this._nomeCap(mm.cap)}, o mais fraco, que não muda o nível` : `o ${this._nomeCap(mm.cap)}. Acerte 2 seguidas e ele entra no nível 1 de 5`;
        return { disponivel: true, evento: 'ESTUDAR_TOPICO', id, rotulo: 'Estudar este tópico agora', nota: `Missão de hoje cumprida. Por conta própria: ${oque}. ${fimLivre}` };
      }
      const mm = montarMissaoGeral(this.st, this.pack, this.M, this.prat, d, { topico: id, livre: true }), titulo = this.prat.titulo(id);
      const deste = mm.passos.filter(p => p.cap === id);
      const oque = deste.some(p => p.t === 'questao' && !p.antecipada) ? `Este estudo é por conta própria: acerte 2 seguidas e ${titulo} entra no nível 1 de 5.`
        : deste.some(p => p.antecipada) ? 'Este estudo é por conta própria e é uma revisão antecipada: firma o conteúdo, mas o nível só muda na revisão do dia marcado.'
        : deste.some(p => p.t === 'revisao') ? `Este estudo é por conta própria, com a revisão do tópico que vence hoje. ${this._ganhoRevisao(id, titulo)}`
        : 'Este estudo é por conta própria: a apostila do tópico.';
      return { disponivel: true, evento: 'ESTUDAR_TOPICO', id, rotulo: 'Estudar este tópico agora', nota: `Missão de hoje cumprida. ${oque} ${fimLivre}` };
    }
    if (m.tipo === 'pausa') return { disponivel: false, rotulo, motivo: `Você marcou pausa até ${R.fmtDiaMes(this.st.pausa.ate)}. Para estudar, encerre a pausa no Plano.` };
    const ehEste = fa ? m.tipo !== 'topico' && m.tipo !== 'folga' : m.tipo === 'topico' && m.cap === id;
    if (m.iniciada) return ehEste
      ? { disponivel: true, evento: 'CONTINUAR', rotulo: `Continuar do passo ${Math.min(m.i + 1, m.passos.length)} de ${m.passos.length}`, nota: null }
      : { disponivel: false, rotulo, motivo: 'A missão de hoje já começou. Termine ou encerre por hoje; amanhã este tópico pode ser a missão.' };
    const atual = m.tipo === 'folga' || !m.passos.length ? null : this._titulo(m);
    return { disponivel: true, evento: 'ESTUDAR_TOPICO', id, rotulo,
      nota: ehEste ? null : m.tipo === 'folga' ? 'Conta como dia estudado, não para a meta da semana.' : atual ? this._notaTrocaTopico(id, m, d, atual) : null };
  }
  /** Nota de "Estudar este tópico hoje" montada da missão que o P0 montaria: o que ele substitui, as revisões
   *  que continuam e as que vão para o próximo dia de estudo (com o motivo: até capacidade(st) junto com um tópico). */
  _notaTrocaTopico(id, m, d, atual) {
    const mm = montarMissaoGeral(this.st, this.pack, this.M, this.prat, d, { topico: id, estudarMesmoAssim: !!m.estudarMesmoAssim });
    const ficam = [...new Set(mm.passos.filter(p => p.t === 'revisao' && p.cap !== id).map(p => p.cap))];
    const saem = [...new Set(mm.revisoesFora || [])];
    if (!ficam.length && !saem.length) return `Entra no lugar de “${atual}”.`;
    // curta: quanto fica e quanto sai, em números (o nome de cada revisão está no guia da missão)
    const nr = k => (k === 1 ? '1 revisão' : `${k} revisões`);
    const partes = [];
    if (ficam.length) partes.push(`${nr(ficam.length)} ${ficam.length === 1 ? 'continua' : 'continuam'}`);
    if (saem.length) partes.push(`${nr(saem.length)} ${saem.length === 1 ? 'vai' : 'vão'} para o próximo dia (cabem até ${Plano.capacidade(this.st)} por dia)`);
    return `Entra na missão de hoje. ${cap1(partes.join('; '))}.`;
  }
  /** Página do tópico: título, por que cai no Enem, o nível do aluno e "Estudar este tópico hoje". */
  topicoPagina(id) {
    const fa = id === this.pack.id;
    const r = fa ? this._resumoCaderno() : this._resumoTopico(id);
    if (!r) return null;
    if (!r.disponivel) return Object.assign({}, r, { acao: null, area: (AREAS.find(a => a.id === (CONHECIDOS.find(c => c.id === id) || {}).area) || {}).nome || '' });
    const t = fa ? null : this.prat.get(id), st = this.st, d = R.hoje(), m = st.missao;
    const tempo = fa ? null : this._tempoTopico(id, d);
    // depois do Pronto (ou no estudo livre), o visto do dia já foi dado (ou não vem): não anunciar outro
    const fimHoje = m && (m.fechada || m.livre) ? (st.carimbos && st.carimbos[d] ? 'Sem visto extra: o de hoje já é seu.' : 'Estudo por conta própria não dá visto.') : 'No fim, o visto do dia.';
    const ganho = fa ? '' : regraTopico(t.titulo).ganho;
    return Object.assign({}, r, {
      area: fa ? 'Matemática' : (AREAS.find(a => a.id === t.area) || {}).nome || '', materia: fa ? 'Matemática' : t.materia,
      porQueCai: fa ? 'Função afim cai todo ano no Enem: tarifas com uma parte fixa e uma parte por unidade, gráficos de retas e comparação de planos e preços.' : t.teoria.porQueCai,
      ideias: fa ? [] : (t.topico.ideias || []).filter(x => typeof x === 'string'),
      // o que o tópico tem, separado do que entra hoje (a mesma missão do botão, com as revisões que vêm junto)
      composicao: fa ? 'Cada capítulo tem páginas para ler, uma pergunta antes de cada página e questões reais do Enem.'
        : [`O tópico tem a apostila (${t.teoria.secoes.length} seções, com exemplos resolvidos) e ${t.itens.length} questões reais do Enem, da mais fácil para a mais difícil.`,
          tempo && tempo.partes ? `${tempo.rotulo}: ${tempo.partes}.` : null, tempo ? tempo.texto : null].filter(Boolean).join(' '),
      tempo,
      comoFunciona: fa ? null : COMO_FUNCIONA.map(x => Object.assign({}, x)),
      capitulos: fa ? this.pack.capitulos.map(c => { const x = st.topicos[c.id] || {}; return { n: c.n, titulo: c.titulo, nivel: { cheios: x.caixa || 0, nome: x.caixa ? rotuloNivel(x.caixa) : null, rotulo: rotuloNivel(x.caixa || 0) } }; }) : null,
      regraNivel: fa ? `Cada capítulo tem o seu nível, de 1 a 5. ${regraNivel('o capítulo', this._teto())}` : regraNivel('o tópico', this._teto()),
      acao: this._acaoTopico(id),
      leitura: fa ? { rotulo: 'Abrir o caderno', aba: 'caderno' } : { rotulo: 'Ler a apostila', nota: 'Ler é livre e não conta como dia estudado.' },
      regraHoje: r.estado === 'novo' && !fa ? `Hoje: ${ganho.charAt(0).toLowerCase()}${ganho.slice(1)} ${fimHoje}` : null,
      dia: d,
    });
  }
  /** A missão do tópico hoje: a que "Estudar este tópico" monta (P0, ou o estudo por conta própria depois do
   *  Pronto, com as revisões que entram junto) ou a que já está em curso (o que falta dela). null quando outra
   *  missão está em curso ou em pausa: o botão explica, e a página descreve uma missão do tópico em geral. */
  _missaoDoTopico(id, d) {
    const st = this.st, m = st.missao;
    if (!m || !st.perfil || !this.prat.existe(id) || m.tipo === 'pausa') return null;
    if (m.tipo === 'topico' && m.cap === id && !m.fechada) {
      if (!m.iniciada) return { passos: m.passos, emCurso: false };
      const feito = ['feedback', 'trecho', 'fimDaRodada', 'fimDaMao'].includes(m.retomar || this.estado());
      return { passos: m.passos.slice(m.i + (feito ? 1 : 0)), emCurso: true };
    }
    if (m.iniciada && !m.fechada) return null;
    const livre = !!(m.fechada || m.livre);
    const mm = montarMissaoGeral(st, this.pack, this.M, this.prat, d, livre ? { topico: id, livre: true } : { topico: id, estudarMesmoAssim: m.tipo === 'folga' || !!m.estudarMesmoAssim });
    return { passos: mm.passos, emCurso: false };
  }
  /** "um aquecimento, a apostila e até 4 questões (plano de 25 min)" · "a apostila, 1 revisão do tópico e a revisão do capítulo X" */
  _composicaoTopico(passos, id) {
    const t = this.prat.get(id), plano = (this.st.perfil || {}).minutos || 25, lim = QUESTOES_POR_MINUTOS[plano] || 4, partes = [];
    if (passos.some(p => p.t === 'pre' && p.fonte === 'pratica' && p.cap === id)) partes.push('um aquecimento');
    if (passos.some(p => p.t === 'teoria' && p.cap === id)) partes.push('a apostila');
    const q = passos.filter(p => p.t === 'questao' && p.cap === id && !p.antecipada).length;
    if (q) partes.push(`até ${nDe(q, 'questão', 'questões')}${q === lim && t.itens.length > lim ? ` (plano de ${plano} min)` : ''}`);
    const ant = passos.filter(p => p.t === 'questao' && p.cap === id && p.antecipada).length;
    if (ant) partes.push(`${nDe(ant, 'questão', 'questões')} de revisão antecipada, que não muda o nível`);
    if (passos.some(p => p.t === 'revisao' && p.cap === id)) partes.push('1 revisão do tópico');
    const outras = [...new Set(passos.filter(p => p.t === 'revisao' && p.cap !== id).map(p => p.cap))];
    if (outras.length) partes.push(`${outras.length === 1 ? 'a' : 'as'} ${this._revisoes(outras, { curto: true })}`);
    return juntarE(partes);
  }
  /** Quanto leva a missão do tópico hoje (a mesma conta do Hoje: a apostila pela capa, as questões e as revisões que vêm junto). */
  _tempoTopico(id, d = R.hoje()) {
    const st = this.st, t = this.prat.get(id);
    if (!t || !st.perfil) return null;
    const x = this._missaoDoTopico(id, d), plano = st.perfil.minutos || 25;
    const passos = x ? x.passos : passosTopico(st, this.prat, id, d, new Set()).passos;
    const min = estimarMinutosTopico(passos, this.prat, st), mt = passos.some(p => p.t === 'teoria' && p.cap === id) ? minutosDaTeoriaNaMissao(st, this.prat, id) : 0;
    const emCurso = !!(x && x.emCurso);
    return { minutos: min, apostila: mt, plano, passa: min > plano, emCurso, hoje: !!x,
      rotulo: emCurso ? 'Hoje falta' : x ? 'Hoje' : 'Numa missão deste tópico', partes: this._composicaoTopico(passos, id) || null,
      texto: `${emCurso ? 'Falta' : 'Leva'} cerca de ${min} min${mt > 6 ? ` (só a apostila, uns ${mt})` : ''}${min > plano ? `, mais que os seus ${plano} min` : ''}.` };
  }
  /** Teoria para leitura livre (fora da missão): não conta como dia estudado. */
  teoriaLivre(id) {
    const v = this.teoria(id);
    return v ? Object.assign(v, { livre: true, aviso: 'Leitura livre: não conta como dia estudado e não muda o nível.' }) : null;
  }

  /* =========================================================
     Perfil (nome, foto, plano, som, dados)
     ========================================================= */
  /* =========================================================
     Contra o relógio (modo de treino com placar; recordes só deste aparelho)
     ========================================================= */
  relampago() {
    const rl = this.st.relampago || { recordes: [], partidas: 0 }, R2 = RELAMPAGO;
    return {
      titulo: 'Contra o relógio',
      regra: `Até ${R2.questoes} questões sorteadas de Matemática e Linguagens, com ${R2.minutos} minutos no relógio.`,
      pontos: 'Cada acerto vale 10 pontos vezes o combo (acertos seguidos, até x3). Errar zera o combo. Respondeu todas antes do tempo acabar: cada segundo que sobrou vale 1 ponto.',
      aviso: 'É treino: não mexe nos níveis da trilha nem no visto do dia.',
      recordes: rl.recordes.map((r, i) => ({ pos: i + 1, pontos: r.pontos, texto: `${r.acertos} de ${r.total} certas` })),
      partidas: rl.partidas, questoes: R2.questoes, segundos: R2.minutos * 60,
      melhor: rl.recordes.length ? rl.recordes[0].pontos : null,
      chamada: `${R2.questoes} questões · ${R2.minutos} minutos`,
    };
  }
  /* =========================================================
     Modos: a missão do dia é o principal; Contra o relógio, Cartões e Revanche são treino
     (não mexem em nível, revisão nem visto do dia)
     ========================================================= */
  modos() {
    const c = this.cartoes(), r = this.revanche(), rl = this.relampago();
    return {
      relogio: { titulo: rl.titulo, linha: rl.chamada, melhor: rl.melhor },
      cartoes: { titulo: 'Cartões', linha: c.total ? `${c.total} ${c.total === 1 ? 'cartão' : 'cartões'}` : 'Crie o seu primeiro', total: c.total },
      revanche: { titulo: 'Revanche', linha: r.fila.length ? `${r.fila.length} ${r.fila.length === 1 ? 'questão errada' : 'questões erradas'}` : 'Nenhum erro guardado', total: r.fila.length },
    };
  }
  /** Cartões do modo: os do Enem que já entraram no baralho (capítulos estudados) e os seus. */
  cartoes() {
    const pk = this.pack, st = this.st;
    const enem = Object.keys(st.cards || {}).map(id => pk.card(id)).filter(Boolean).map(k => {
      const cap = pk.capitulo(pk.capDoCard(k.id));
      return { id: k.id, frente: k.frente, verso: k.verso, origem: cap ? `Cap. ${cap.n}` : '' };
    });
    const meus = (st.meusCartoes || []).map(c => ({ id: c.id, frente: c.frente, verso: c.verso, origem: 'Seu cartão', meu: true }));
    return { enem, meus, total: enem.length + meus.length, max: CARTOES_SESSAO };
  }
  /** Sessão do modo Cartões: até 10, sorteados entre os do Enem e os seus (rand injetável nos testes). */
  sortearCartoes(rand = Math.random) {
    const c = this.cartoes(), todos = [...c.enem, ...c.meus];
    for (let i = todos.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [todos[i], todos[j]] = [todos[j], todos[i]]; }
    return todos.slice(0, CARTOES_SESSAO);
  }
  /** Cria um cartão do aluno. Devolve o id, ou null se faltar frente ou verso. */
  criarCartao({ frente = '', verso = '' } = {}) {
    const f = String(frente).trim().slice(0, 200), v = String(verso).trim().slice(0, 400);
    if (!f || !v) return null;
    const lista = this.st.meusCartoes || [];
    let n = lista.length + 1;
    while (lista.some(x => x.id === `meu-${n}`)) n++;
    const id = `meu-${n}`;
    this._acao(() => { (this.st.meusCartoes = this.st.meusCartoes || []).push({ id, frente: f, verso: v, dia: R.hoje() }); });
    return id;
  }
  /** Garantir ou dobrar, no feedback de um acerto que fechou 3 seguidas. */
  apostar(dobrar) {
    let ok = false;
    this._acao(() => { const m = this.st.missao; ok = apostarPlacar(m && m.placar, !!dobrar); });
    return ok;
  }
  /** Raspadinha do Pronto por hoje: revela o prêmio uma vez (pontos na partida ou um carimbo dourado). */
  raspar() {
    let premio = null;
    this._acao(() => {
      const m = this.st.missao, p = m && m.placar, r = p && p.raspa;
      if (!r || r.raspada) return;
      r.raspada = true; premio = r.premio;
      if (premio.tipo === 'pontos') p.pontos += premio.valor;
      else this.st.dourados = (this.st.dourados || 0) + 1;
    });
    return premio;
  }
  apagarCartao(id) {
    let ok = false;
    this._acao(() => { const l = this.st.meusCartoes || []; const i = l.findIndex(x => x.id === id); if (i >= 0) { l.splice(i, 1); ok = true; } });
    return ok;
  }
  /** Revanche: as questões que você errou (a mais recente primeiro, sem repetir), até 10. */
  revanche() {
    const vistos = new Set(), fila = [];
    for (const e of [...(this.st.erros || [])].sort((a, b) => (a.dia < b.dia ? 1 : a.dia > b.dia ? -1 : 0))) {
      if (vistos.has(e.item) || !this.questaoRelampago(e.item)) continue;
      vistos.add(e.item); fila.push(e.item);
    }
    return { fila: fila.slice(0, REVANCHE_MAX) };
  }
  /** Álbum de carimbos: o que já foi ganho em cada fase da trilha (3 por fase, o melhor resultado fica). */
  album() {
    const t = this.trilha();
    const areas = t.areas.map(a => ({ id: a.id, nome: a.nome,
      fases: a.fases.map(f => ({ id: f.id, n: f.n, titulo: f.titulo, chefe: f.tipo === 'chefe', estrelas: f.estrelas || 0, feita: f.estado === 'concluida' })) }))
      .filter(a => a.fases.length);
    const ganhos = areas.reduce((s, a) => s + a.fases.reduce((x, f) => x + f.estrelas, 0), 0);
    const max = areas.reduce((s, a) => s + a.fases.length * 3, 0), dourados = this.st.dourados || 0;
    const cheias = areas.reduce((s, a) => s + a.fases.filter(f => f.estrelas === 3).length, 0);
    return { titulo: 'Álbum de carimbos', ganhos, max, cheias, areas, dourados,
      texto: ganhos ? (cheias ? `${cheias} ${cheias === 1 ? 'fase' : 'fases'} com os 3 carimbos. Cada fase vale até 3.` : 'Cada fase vale até 3 carimbos.') : 'Nenhum carimbo ainda. Cada fase vale até 3.',
      regra: 'Cada fase guarda o melhor carimbo que você já tirou nela. Um resultado pior não apaga o melhor.' };
  }
  /** Fila sorteada: questões do Enem e da equipe de todos os tópicos e capítulos (rand injetável nos testes). */
  sortearRelampago(rand = Math.random) {
    const ids = [];
    for (const id of this.prat.ids()) ids.push(...this.prat.questoes(id));
    for (const c of this.pack.capitulos) ids.push(...this.pack.questoesDoCap(c.id));
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return ids.slice(0, RELAMPAGO.questoes);
  }
  questaoRelampago(id) {
    const pi = this.prat.item(id), item = pi || this.pack.item(id);
    if (!item) return null;
    const c = pi ? CONHECIDOS.find(x => x.id === pi.topico) : null;
    return { item: this._itemVM(item), gabarito: item.gabarito, area: c ? (AREAS.find(a => a.id === c.area) || {}).nome : 'Matemática', tema: c ? c.titulo : this.pack.titulo };
  }
  /** Guarda o placar entre os 5 melhores deste aparelho; devolve a posição (0 = fora do pódio de 5). */
  registrarRelampago({ pontos = 0, acertos = 0, total = 0 } = {}) {
    let pos = 0;
    this._acao(() => {
      const rl = this.st.relampago = this.st.relampago || { recordes: [], partidas: 0 };
      const novo = { pontos, acertos, total, dia: R.hoje() };
      rl.partidas++;
      rl.recordes.push(novo);
      rl.recordes.sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos);
      rl.recordes = rl.recordes.slice(0, 5);
      pos = rl.recordes.indexOf(novo) + 1;
    });
    return pos;
  }

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
    // no modo demonstração com o estado real guardado, a cópia é do progresso real (não dos dias simulados)
    const dm = this.st.config.demo;
    let base = this.st;
    if (dm.ativo && dm.guardado) { try { base = E.normalizar(JSON.parse(dm.guardado)); } catch (e) { base = this.st; } }
    const c = E.copiaJSON(base, this.pack, R.hoje());
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
    // a demonstração já mostra o jogo: carimbos nas fases concluídas, no Chefão vencido e recordes do Contra o relógio
    const pad = [3, 2, 3, 1, 2, 3];
    Object.keys(ex.topicos).filter(id => (ex.topicos[id].caixa || 0) >= 1).forEach((id, i) => { ex.estrelas[id] = pad[i % pad.length]; });
    if ((ex.chefes[this.pack.id] || {}).venceu) ex.estrelas[`${this.pack.id}:prova`] = 2;
    ex.relampago = { partidas: 6, recordes: [{ pontos: 412, acertos: 12, total: 15, dia: R.hoje() }, { pontos: 290, acertos: 10, total: 14, dia: R.hoje() }, { pontos: 176, acertos: 7, total: 11, dia: R.hoje() }] };
    this.missao.transicao(() => { this.missao.substituir(ex); return this.missao.virarDia(); });
    return this.tela();
  }
  /** Sai do modo demonstração: volta ao estado real guardado (ou ao Primeiro uso). */
  sairDaDemonstracao() {
    const dm = this.st.config.demo, g = dm.guardado;
    let real = null;
    if (g) { try { real = E.normalizar(JSON.parse(g)); } catch (e) { real = null; } }
    R.setOffset(0);
    if (!real) {
      // sem estado guardado: o exemplo aberto no Primeiro uso volta ao Primeiro uso; um perfil real nunca é apagado
      if (dm.exemplo || !this.st.perfil) { this.apagarTudo(); return this.tela(); }
      real = E.normalizar(JSON.parse(JSON.stringify(this.st)));
    }
    real.config.demo = { ativo: false, offset: 0, exemplo: false, guardado: null };
    this.missao.transicao(() => { this.missao.substituir(real); if (!this.st.missao || this.st.missao.dia !== R.hoje()) return this.missao.virarDia(); return this.st.missao.estado; });
    return this.tela();
  }
  /** Avança a data simulada (modo demonstração). */
  avancarDias(n) {
    this._acao(() => {
      const dm = this.st.config.demo;
      // num perfil real, a demonstração começa guardando o estado real: "Sair" o devolve intacto
      if (!dm.ativo) { dm.guardado = this.st.perfil ? JSON.stringify(this.st) : null; dm.ativo = true; dm.exemplo = false; dm.offset = 0; }
      dm.offset = (dm.offset || 0) + Math.round(n); R.setOffset(dm.offset);
    });
    this.missao.abrir();
    return this.tela();
  }
}

/** Atalho: cria o núcleo e faz a Abertura. */
export function criarNucleo(op) { const n = new Nucleo(op); n.abrir(); return n; }
