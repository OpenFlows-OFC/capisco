/* =========================================================
   PRUMO · Estado de exemplo (Decisão 5 do dono; núcleo, sem DOM)
   Três semanas que terminam ontem, relativas à data real de hoje; prova da
   escola em hoje + 28 dias; 25 min por dia (capacidade 3: com a revisão vencida
   antes do capítulo novo, 15 min não abrem os 4 capítulos em 3 semanas). O estado NÃO é
   escrito à mão: um aluno simulado joga as missões dia a dia com um relógio
   falso, pelo próprio motor e pela própria máquina de estados. Por isso ele é
   consistente por construção.
   O que o roteiro garante (conferido nos testes):
   - a 1ª revisão de cada capítulo com o "antes x depois";
   - uma revisão errada que desce o Cap. 1 um nível (e o cartão da
     questão do Enem no caderno de erros, a 2019 Q168 no pack real);
   - semanas com a meta (marcas de latão), cards em várias caixas, uma
     Prova do caderno feita e vencida;
   - ontem a missão ficou pela metade, e hoje há revisão atrasada.
   ========================================================= */
import * as R from './relogio.js';
import * as E from './estado.js';
import { Nucleo } from './nucleo.js';
import { montarMissao } from './recomendador.js';

const LIMITE_EVENTOS = 600;

/** Escolhe os dias de estudo: seg a qui, ou (se hoje não for um deles) quatro dias seguidos que incluem hoje. */
export function diasDoExemplo(hoje) {
  const wd = R.diaDaSemana(hoje);
  if ([1, 2, 3, 4].includes(wd)) return [1, 2, 3, 4];
  return [(wd + 5) % 7, (wd + 6) % 7, wd, (wd + 1) % 7].sort();
}

/**
 * Gera o estado de exemplo. `pack` é um Pack (ou o objeto do pack); `hoje` é a data real de hoje.
 * Devolve um objeto de estado (versão 2) pronto para salvar.
 */
export function gerarExemplo(pack, hoje = R.hoje(), praticas = null) {
  const fonteAntes = R.obterFonte(), offsetAntes = R.getOffset();
  try {
    R.setOffset(0);
    // o penúltimo dia de estudo fica sem estudo (falta); se com isso hoje não tiver revisão atrasada,
    // tenta a falta um dia antes, e depois nenhuma (determinístico: a primeira que cumpre vence)
    let escolhido = null;
    // cada opção: [quantos dias de estudo antes do fim fica a falta, quantos antes do fim fica o dia que para no meio]
    for (const [recuo, parada] of [[2, 1], [3, 1], [1, 2], [0, 1], [2, 3]]) {
      const n = simular(pack, hoje, recuo, parada, praticas);
      R.definirFonte(`${hoje}T08:00`);
      const mm = montarMissao(n.st, n.pack, n.M, hoje);
      if (!escolhido) escolhido = n;
      if (mm.passos.some(p => p.t === 'revisao' && p.atrasada)) { escolhido = n; break; }
    }
    const st = JSON.parse(JSON.stringify(escolhido.st));
    st.config.demo = { ativo: true, offset: 0, exemplo: true, guardado: null };
    return E.normalizar(st);
  } finally {
    R.definirFonte(fonteAntes);
    R.setOffset(offsetAntes);
  }
}

function simular(pack, hoje, recuoFalta, recuoParada, praticas) {
  const inicio = R.addDias(hoje, -21);
  const rel = R.relogioFalso(`${inicio}T19:00`);
  const n = new Nucleo({ pack, storage: E.memoria(), praticas: praticas || undefined });
  n.concluirPrimeiroUso({ nome: 'Daniel', provaTipo: 'escola', prova: R.addDias(hoje, 28), dias: diasDoExemplo(hoje), minutos: 25, metaSemana: 3, horario: '19:00', som: false, alarme: 'criado' });
  // teto de nível da demonstração (pack.nivelMaximoDemo); um perfil real vai até o 5 de 5
  n.st.config.nivelMaximo = Math.min(5, Math.max(1, Math.round(Number(n.pack.dados.nivelMaximoDemo)) || 5));
  const ctx = { diaDeEstudo: 0, errouRevisaoEnemC1: false, errouDia: false, provaFeita: false, maos: 0, notaFeita: false, jaSeiUsado: false, refeito: false };
  const diasDeEstudo = [];
  for (let k = 21; k >= 1; k--) { const x = R.addDias(hoje, -k); if (n.st.perfil.dias.includes(R.diaDaSemana(x))) diasDeEstudo.push(x); }
  const falta = recuoFalta ? diasDeEstudo[diasDeEstudo.length - recuoFalta] : null, ultimoDia = diasDeEstudo[diasDeEstudo.length - recuoParada];
  for (let k = 21; k >= 1; k--) {
    const dia = R.addDias(hoje, -k);
    rel.irPara(`${dia}T19:00`);
    n.conferirData();
    const m = n.st.missao;
    // um tópico de prática começado (e vencido) numa folga da última semana: aparece em Estudar com nível
    if (!ctx.topico && m.tipo === 'folga' && k <= 7 && n.prat.ids().length) {
      const id = n.prat.ids()[0];
      if (n.despachar({ tipo: 'ESTUDAR_TOPICO', id })) { jogarDia(n, rel, ctx, { ultimo: false, jaComecou: true }); ctx.topico = id; }
      continue;
    }
    if (dia === falta || dia > ultimoDia || m.tipo === 'folga' || m.tipo === 'pausa' || !m.passos.length) continue;
    jogarDia(n, rel, ctx, { ultimo: dia === ultimoDia });
    ctx.diaDeEstudo++;
  }
  return n;
}

/** Letra errada determinística: a preferida, se for errada; senão a primeira errada. */
function letraErrada(item, preferida = 'E') {
  const errada = item.alternativas.filter(a => !a.certa).map(a => a.letra);
  return errada.includes(preferida) ? preferida : errada[0];
}

function jogarDia(n, rel, ctx, { ultimo, jaComecou = false }) {
  const pk = n.pack, st = n.st;
  // Prova do caderno: no primeiro dia em que é oferecida, antes da missão, vencida com 4 acertos
  if (!jaComecou && !ctx.provaFeita && n.hoje().prova) {
    n.despachar('FAZER_PROVA');
    n.despachar('COMECAR_PROVA');
    for (let g = 0; g < 40 && n.estado() !== 'hoje'; g++) {
      const e = n.estado();
      if (e === 'provaPergunta') { const f = st.missao.prova.fila[st.missao.prova.i]; n.despachar({ tipo: 'RESPONDER', alt: pk.item(f.id).gabarito }); }
      else if (e === 'provaFeedback') { rel.avancarMs(4000); n.despachar('CONTINUAR'); }
      else if (e === 'provaResultado') n.despachar('FECHAR');
      else break;
    }
    ctx.provaFeita = true;
  }
  // Refazer com outros números, uma vez, no cartão da questão do Enem errada na revisão (antes da missão)
  if (!jaComecou && !ctx.refeito && ctx.errouRevisaoEnemC1) {
    const e = st.erros.find(x => x.tipo === 'revisao');
    if (e && n.iniciarRefazer(e.id)) { const it = pk.item(st.refazer.item); n.responderRefazer(it.gabarito); n.fecharRefazer(); n.foiIsso(e.id, 'sim'); ctx.refeito = true; }
  }
  if (!jaComecou) n.despachar('COMECAR');
  let respostasHoje = 0;
  for (let g = 0; g < LIMITE_EVENTOS; g++) {
    const e = n.estado(), m = st.missao;
    if (e === 'feito' || e === 'hoje') break;
    const p = m.passos[m.i];
    if (e === 'pergunta') {
      // no último dia, para antes da última revisão da fila: hoje ela aparece como "1 revisão atrasada"
      if (ultimo && p.t === 'revisao' && !m.passos.slice(m.i + 1).some(x => x.t === 'revisao')) { n.despachar('PAUSAR'); break; }
      const item = n.missao.itemDe(p.id);
      let alt = item.gabarito;
      if (p.t === 'pre') {
        // a pergunta de entrada da 2ª página é chutada errada no 1º dia: o "antes x depois" mostra a diferença
        const cap = pk.capitulo(p.cap);
        const segunda = cap && cap.paginas.findIndex(x => x.id === p.pagina) === 1 && p.alvo === 'nucleo';
        alt = segunda ? letraErrada(item, 'C') : item.gabarito;
      } else if (p.t === 'revisao' && p.cap === pk.capitulos[0].id && item.origem === 'enem' && !ctx.errouRevisaoEnemC1
        && (item.id === 'enem-2019-168' || !pk.questoesDoCap(p.cap).includes('enem-2019-168'))) {
        alt = letraErrada(item, 'E');          // a revisão errada: o Cap. 1 desce um nível
        ctx.errouRevisaoEnemC1 = true;
      } else if (p.t === 'dia' && !ctx.errouDia) {
        alt = letraErrada(item, 'B');          // um erro na Questão do dia: cartão aberto no caderno
        ctx.errouDia = true;
      }
      n.despachar({ tipo: 'RESPONDER', alt });
      if (p.t !== 'pre') respostasHoje++;
      if (ultimo && respostasHoje >= 1 && n.estado() === 'feedback' && !m.passos.some(x => x.t === 'revisao')) { rel.avancarMs(4000); n.despachar('PAUSAR'); break; }   // o último dia fica pela metade
    } else if (e === 'leitura') {
      if (!ctx.notaFeita && p.fimDaPagina) { n.despachar({ tipo: 'SALVAR_NOTA', texto: 'A parte fixa entra uma vez só; a outra multiplica.' }); ctx.notaFeita = true; }
      if (!ctx.jaSeiUsado && ctx.diaDeEstudo === 1 && m.passos[m.i + 1] && m.passos[m.i + 1].t === 'pre') { n.despachar('JA_SEI'); ctx.jaSeiUsado = true; }
      else n.despachar('TERMINEI_TRECHO');
    } else if (e === 'feedback') {
      if (m.ultima && m.ultima.res === 'erro' && m.ultima.paragrafo) { n.despachar('VOLTAR_AO_TRECHO'); n.despachar('VOLTAR'); }
      rel.avancarMs(4000);
      n.despachar('CONTINUAR');
    } else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') {
      const mao = m.mao;
      if (mao.pendente) { n.despachar('SEGUIR'); continue; }
      if (!mao.virado) { n.despachar('VIRAR'); continue; }
      const id = mao.fila[mao.i], volta = mao.respostas[id] !== undefined;
      // na 1ª e na 3ª mão, o 2º e o 4º cards ficam para depois ("Ainda não"); nas outras, o 5º
      const pos = Object.keys(mao.respostas).length + (volta ? 0 : 1);
      const ainda = !volta && ((ctx.maos % 2 === 0 && (pos === 2 || pos === 4)) || pos === 5);
      n.despachar(ainda ? 'AINDA_NAO' : 'LEMBREI');
      if (mao.fim || (st.missao.mao && st.missao.mao.fim)) ctx.maos++;
    } else if (e === 'encerramento') { n.despachar('FECHAR'); }
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else break;
  }
}
