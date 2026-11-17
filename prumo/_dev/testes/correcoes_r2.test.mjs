/* Correções da rodada 2 (núcleo): cada teste protege um item do relatório (R2-xx).
   Regras de produto conferidas aqui: recompensa anunciada que vem (e nada anunciado que não vem), estudo
   livre sem prêmio extra, o dia tem fim, "Hoje não" sem culpa, dias estudados que só crescem. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo, COMO_FUNCIONA } from '../../js/nucleo/nucleo.js';
import { IDS_PRATICA, montarMissaoGeral } from '../../js/nucleo/pratica.js';
import { packs, PERFIL, textos } from './ajuda.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const LISTA = [];
for (const id of IDS_PRATICA) {
  const a = path.resolve(aqui, `../../conteudo/praticas/${id}.js`), b = path.resolve(aqui, `../../conteudo/praticas/${id}.teoria.js`);
  LISTA.push({ id, topico: existsSync(a) ? (await import(pathToFileURL(a).href)).topico : null, teoria: existsSync(b) ? (await import(pathToFileURL(b).href)).teoria : null });
}
const TOPS = LISTA.filter(x => x.topico && x.teoria).map(x => x.id);
const TOP = TOPS[0], TOP2 = TOPS[1];

function novo(dados, { dia = '2026-11-17', perfil = {} } = {}) {
  const rel = R.relogioFalso(`${dia}T19:00`);
  R.setOffset(0);
  const n = new Nucleo({ pack: dados, storage: E.memoria(), praticas: LISTA });
  n.abrir();
  n.concluirPrimeiroUso(Object.assign({}, PERFIL, perfil));
  return { n, rel };
}
/** Joga até sair da missão. decidir(passo, item) → letra (padrão: a certa). */
function jogar(n, rel, decidir = (p, it) => it.gabarito) {
  if (n.estado() === 'hoje' || n.estado() === 'feito') n.despachar('COMECAR');
  for (let g = 0; g < 400; g++) {
    const e = n.estado(), m = n.st.missao, p = m && m.passos[m.i];
    if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: decidir(p, n.missao.itemDe(p.id)) });
    else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') { rel.avancarMs(4000); n.despachar('CONTINUAR'); }
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') { const mao = m.mao; n.despachar(mao.pendente ? 'SEGUIR' : mao.virado ? 'LEMBREI' : 'VIRAR'); }
    else return e;
  }
  throw new Error('não terminou');
}
const ir = (n, rel, d) => { rel.irPara(`${d}T19:00`); n.conferirData(); };
const errada = it => it.alternativas.find(a => !a.certa).letra;
const certa = it => it.gabarito;
/** Joga todos os dias de estudo, tudo certo, até a data `ate` (exclusiva). */
function perfeito(n, rel, ate, cada = () => {}) {
  let d = n.st.missao.dia;
  while (d < ate) {
    if (n.st.missao.dia !== d) ir(n, rel, d);
    cada(n, d);
    const m = n.st.missao;
    if (m.passos.length && m.tipo !== 'folga' && m.tipo !== 'pausa' && !m.fechada) { jogar(n, rel); if (n.estado() === 'encerramento') n.despachar('FECHAR'); }
    d = R.addDias(d, 1);
  }
  ir(n, rel, ate);
}
/** Estado de exemplo com o relógio do teste. */
function exemplo(dados) {
  const { n } = novo(dados);
  n.carregarExemplo();
  return { n, rel: R.relogioFalso(`${R.hoje()}T19:00`) };
}

for (const pk of await packs()) {
  const P = pk.nome;

  test(`[${P}] R2-02 · a resposta do aquecimento não volta a trilha para "Aquecer"`, () => {
    const { n } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    assert.equal(n.tela().vm.fase, 'aquecer');
    n.despachar({ tipo: 'RESPONDER', alt: errada(n.missao.itemDe(n.st.missao.passos[0].id)) });
    assert.equal(n.tela().vm.fase, 'apostila');
    n.despachar('TERMINEI_TRECHO');
    const vm = n.tela().vm;
    assert.equal(vm.tipo, 'revela');
    assert.notEqual(vm.fase, 'aquecer', 'depois da apostila, Aquecer e Apostila ficam feitos');
    assert.equal(vm.fase, 'questoes');
  });

  test(`[${P}] R2-03 · página do tópico: o que o tópico tem, o que entra hoje e o mesmo tempo da missão`, () => {
    assert.match(COMO_FUNCIONA[2].texto, /Se não der mais para acertar 2 seguidas com as que restam, o tópico continua na próxima vez\.$/);
    const { n } = novo(pk.dados);
    const t = n.prat.get(TOP), pg = n.topicoPagina(TOP);
    assert.ok(pg.composicao.startsWith(`O tópico tem a apostila (${t.teoria.secoes.length} seções, com exemplos resolvidos) e ${t.itens.length} questões reais do Enem`));
    assert.match(pg.composicao, /Hoje: um aquecimento, a apostila e até 4 questões \(plano de 25 min\)\. Leva cerca de \d+ min/);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    assert.equal(pg.tempo.minutos, n.st.missao.minutos, 'a página e o Hoje dizem o mesmo tempo');
    // de volta à página depois do aquecimento: não fala mais dele
    n.despachar({ tipo: 'RESPONDER', alt: errada(n.missao.itemDe(n.st.missao.passos[0].id)) });
    n.despachar('PAUSAR');
    const volta = n.topicoPagina(TOP).composicao;
    assert.match(volta, /Hoje falta: a apostila e até \d questões/);
    assert.ok(!/aquecimento/.test(volta));
    // plano de 15 min: até 3
    const { n: n15 } = novo(pk.dados, { perfil: { minutos: 15 } });
    assert.match(n15.topicoPagina(TOP).composicao, /até 3 questões \(plano de 15 min\)/);
    // exemplo: tópico com revisão vencida e revisões de outros conteúdos que entram junto
    const { n: ne } = exemplo(pk.dados);
    const id = Object.keys(ne.st.topicos).find(k => ne.prat.existe(k) && ne.st.topicos[k].caixa);
    const pe = ne.topicoPagina(id);
    assert.match(pe.composicao, /Hoje: a apostila, 1 revisão do tópico e /);
    assert.ok(!/um aquecimento/.test(pe.composicao));
    const antes = JSON.stringify(ne.st);
    ne.despachar({ tipo: 'ESTUDAR_TOPICO', id });
    assert.equal(pe.tempo.minutos, ne.st.missao.minutos, 'o tempo conta as revisões que entram junto');
    ne.missao.substituir(JSON.parse(antes));
    // estudo por conta própria: o tempo é o da missão livre
    const novoTop = TOPS.find(x => !ne.st.topicos[x]);
    jogar(ne, R.relogioFalso(`${R.hoje()}T19:00`)); ne.despachar('FECHAR');
    const pl = ne.topicoPagina(novoTop);
    ne.despachar({ tipo: 'ESTUDAR_TOPICO', id: novoTop });
    assert.equal(pl.tempo.minutos, ne.st.missao.minutos);
  });

  test(`[${P}] R2-04 · composição da Missão 1 conta as perguntas curtas, como a régua`, () => {
    for (const minutos of [25, 15]) {
      const { n } = novo(pk.dados, { perfil: { minutos } });
      const comp = n.hoje().bloco.composicao;
      const m = /^(\d+) páginas?, (\d+) perguntas? curtas? sobre (?:ela|elas) e até (\d+) questões? do Enem\.$/.exec(comp);
      assert.ok(m, comp);
      n.despachar('COMECAR');
      const falta = Number(/(\d+) questões?$/.exec(n.tela().vm.topo.legenda.falta)[1]);
      assert.equal(Number(m[2]) + Number(m[3]), falta, 'composição e régua contam a mesma coisa');
    }
  });

  test(`[${P}] R2-06 · agenda do Plano: o próximo dia é a missão anunciada; nada de "sem revisão vencida"`, () => {
    const { n, rel } = novo(pk.dados);
    let a = n.agenda();
    assert.match(a.dias[1].texto, /^Qua 18\/11: depende do resultado de hoje\.$/);
    assert.ok(a.dias.every(x => !/sem revisão vencida/.test(x.texto)));
    assert.ok(a.dias.filter(x => x.tipo === 'estudo' && !x.itens.length).every(x => /depende do/.test(x.texto)));
    jogar(n, rel);
    const prox = n.tela().vm.proxima.texto;
    n.despachar('FECHAR');
    a = n.agenda();
    const l = a.dias.find(x => x.dia === '2026-11-18');
    assert.ok(l.projetada);
    // o que a "Próxima missão" anuncia ("capítulo X (novo) e revisão do capítulo Y") está na linha do dia
    const corpo = prox.replace(/^[^:]+: /, '').replace(/\.$/, '');
    for (const parte of corpo.split(' e revis')) assert.ok(l.texto.includes(parte.replace(/^ão/, 'revisão')), `${l.texto} ⊇ ${parte}`);
    assert.match(a.porQueEstaOrdem, /O próximo dia de estudo mostra a missão que o Prumo montaria/);
    const { n: ne } = exemplo(pk.dados);
    const ae = ne.agenda();
    assert.equal(ae.tudoFirme, 'Todos os capítulos estão no nível 3 de 5 ou acima. As revisões voltam em intervalos que crescem com o nível.');
    assert.match(ae.dias[1].texto, /depende do resultado de hoje\.$/);
  });

  test(`[${P}] R2-07 · encerrar depois da apostila: o Pronto conta o que houve, sem "pergunta de entrada" e sem prometer que o aquecimento volta`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    n.despachar('PAUSAR');
    const comp = n.hoje().bloco.composicao;
    assert.ok(!/o que fizer fica registrado/.test(comp));
    if (/passa dos seus/.test(comp)) assert.match(comp, /o dia conta como estudado quando você responde uma questão ou revisão \(o aquecimento não conta\)/);
    n.despachar('CONTINUAR');
    n.despachar({ tipo: 'RESPONDER', alt: errada(n.missao.itemDe(n.st.missao.passos[0].id)) });
    n.despachar('TERMINEI_TRECHO');                      // terminou a apostila: resposta do aquecimento
    n.despachar('CONFIRMAR_ENCERRAR');
    const v = n.tela().vm;
    assert.equal(v.vazio, 'Hoje você fez o aquecimento e leu a apostila. Na próxima vez que estudar este tópico, vêm as questões do Enem; a apostila abre antes, e dá para pular.');
    assert.match(v.naoContou, /^O dia não conta como estudado: ele conta quando você responde uma questão ou revisão, e o aquecimento não entra nessa conta\.$/);
    assert.ok(!v.mudancas.some(x => x.tipo === 'antes'), 'sem repetir o aquecimento numa segunda frase');
    assert.ok(!textos(v).some(s => /pergunta de entrada/.test(s)));
    // só o aquecimento: a apostila (com a resposta no fim) e as questões ficam para a próxima vez
    const { n: n2, rel: r2 } = novo(pk.dados);
    n2.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    const pre = n2.missao.itemDe(n2.st.missao.passos[0].id);
    n2.despachar({ tipo: 'RESPONDER', alt: errada(pre) });
    n2.despachar('CONFIRMAR_ENCERRAR');
    assert.match(n2.tela().vm.vazio, /^Hoje você fez o aquecimento\. Na próxima vez que estudar este tópico, vêm a apostila \(no fim dela, a resposta do aquecimento\) e as questões do Enem\.$/);
    n2.despachar('FECHAR');
    ir(n2, r2, '2026-11-18');
    n2.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    assert.equal(n2.st.missao.passos[0].t, 'teoria', 'o aquecimento não volta');
    const lt = n2.tela().vm;
    assert.equal(lt.botao.rotulo, 'Terminei de ler: ver a resposta do aquecimento');
    n2.despachar('TERMINEI_TRECHO');
    const rv = n2.tela().vm;
    assert.equal(rv.tipo, 'revela', 'a promessa "no fim da leitura você vê se acertou" se cumpre');
    assert.match(rv.titulo, new RegExp(`^Antes de ler, você marcou ${errada(pre)}\\.`));
    // nenhum texto do núcleo chama a pergunta de "pergunta de entrada"
    for (const f of readdirSync(path.resolve(aqui, '../../js/nucleo')).filter(x => x.endsWith('.js'))) {
      const s = readFileSync(path.resolve(aqui, '../../js/nucleo', f), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
      assert.ok(!/pergunta de entrada/.test(s), `${f}: "pergunta de entrada" em texto visível`);
    }
  });

  test(`[${P}] R2-09 · estudo livre: a nota e o fecho dizem o que acontece com o nível, e "conta como dia" só quando é novidade`, () => {
    const { n, rel } = exemplo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    assert.ok(n.st.dias[R.hoje()]);
    const comNivel = Object.keys(n.st.topicos).find(k => n.prat.existe(k) && n.st.topicos[k].caixa && n.st.topicos[k].proxima > R.hoje());
    const nota = n.topicoPagina(comNivel).acao.nota;
    assert.match(nota, /é uma revisão antecipada: firma o conteúdo, mas o nível só muda na revisão do dia marcado\./);
    assert.ok(!/muda o nível pelas mesmas regras|Conta como dia estudado|conta como dia estudado/.test(nota), nota);
    assert.match(nota, /Sem um segundo visto\.$/);
    const novoTop = TOPS.find(x => !n.st.topicos[x]);
    assert.match(n.topicoPagina(novoTop).acao.nota, /acerte 2 seguidas e .+ entra no nível 1 de 5\. Sem um segundo visto\.$/);
    const nivel = n.st.topicos[comNivel].caixa;
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: comNivel });
    n.despachar('PAUSAR');
    assert.ok(!/conta como dia estudado/.test(n.hoje().bloco.regra));
    n.despachar('CONTINUAR');
    jogar(n, rel);
    const v = n.tela().vm;
    assert.equal(v.titulo, 'Estudo registrado');
    assert.match(v.fecho, /^Estudo por conta própria: foi uma revisão antecipada, que firma o conteúdo; o nível só muda na revisão do dia marcado\. O visto de hoje é o da missão\./);
    assert.ok(!/muda o nível pelas mesmas regras|conta como dia estudado/.test(v.fecho));
    assert.equal(n.st.topicos[comNivel].caixa, nivel, 'e o nível de fato não mudou');
  });

  test(`[${P}] R2-10 · o marco aparece só no Pronto da missão em que foi ganho`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel);
    assert.ok(n.tela().vm.mudancas.some(x => x.tipo === 'marco' && x.marco === 'm.primeiroCap'));
    n.despachar('FECHAR');
    for (const id of [TOP, TOP2, TOP]) {
      n.despachar({ tipo: 'ESTUDAR_TOPICO', id });
      jogar(n, rel);
      assert.equal(n.tela().vm.titulo, 'Estudo registrado');
      assert.ok(!n.tela().vm.mudancas.some(x => x.tipo === 'marco'), `estudo livre de ${id} sem marco repetido`);
      n.despachar('FECHAR');
    }
    assert.equal(n.st.marcos['m.primeiroCap'], '2026-11-17');
  });

  test(`[${P}] R2-11 · "Hoje não": texto pelo que a missão tem, sem "Hoje vence" e sem virar atraso no dia seguinte`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar('HOJE_NAO');
    let h = n.hoje();
    assert.equal(h.texto, 'Hoje não. A missão fica para o próximo dia de estudo.', 'primeiro dia: não há revisão');
    n.despachar('COMECAR');
    assert.ok(!n.st.hojeNao['2026-11-17'], '"Começar mesmo assim" desfaz');
    jogar(n, rel); n.despachar('FECHAR');
    ir(n, rel, '2026-11-18');
    assert.ok(n.hoje().venceHoje);
    n.despachar('HOJE_NAO');
    h = n.hoje();
    assert.equal(h.texto, 'Hoje não. A missão fica para o próximo dia de estudo, e a revisão de hoje entra nele sem contar como atraso.');
    assert.equal(h.venceHoje, null);
    n.mudarPlano({ metaSemana: 2 });
    assert.ok(n.st.missao.hojeNao && n.st.hojeNao['2026-11-18'], 'remontar a missão mantém o "Hoje não"');
    ir(n, rel, '2026-11-19');
    h = n.hoje();
    const rv = n.st.missao.passos.filter(p => p.t === 'revisao');
    assert.ok(rv.length && rv.every(p => !p.atrasada), 'a revisão chega sem marca de atraso');
    assert.equal(h.bloco.atrasada, null);
    assert.match(h.venceHoje.vence, /^Hoje vence 1 revisão do capítulo /);
    assert.equal(n.sumario().capitulos[0].estado, 'Revisão marcada para hoje.');
    // o "Hoje não" fica salvo
    const st2 = E.normalizar(JSON.parse(JSON.stringify(n.st)));
    assert.deepEqual(st2.hojeNao, { '2026-11-18': true });
  });

  test(`[${P}] R2-12 · aluno que cumpre tudo nunca cai no modo retorno; com atraso de fato, a frase não fala em capacidade`, () => {
    for (const minutos of [25, 15]) {
      const { n, rel } = novo(pk.dados, { perfil: { minutos } });
      const retorno = [];
      perfeito(n, rel, '2026-12-15', (x, d) => { if (x.st.missao.retorno) retorno.push(d); });
      assert.deepEqual(retorno, [], `${minutos} min`);
    }
    const { n } = exemplo(pk.dados);
    const m = n.st.missao;
    assert.ok(m.retorno, 'o exemplo tem revisões atrasadas desde o dia de estudo anterior');
    assert.ok(m.passos.some(p => p.t === 'revisao' && p.atrasada));
    assert.match(m.frase, /^Você tem \d+ revis(ão atrasada|ões atrasadas)( e mais \d+ para hoje)?: hoje é dia de pôr as revisões em dia, as mais atrasadas primeiro\.$/);
    assert.ok(!/capacidade/.test(n.hoje().porQue.frase));
  });

  test(`[${P}] R2-13 · escolher outro tópico: a nota diz o que fica e o que sai, e o corte é pela capacidade, com as mais antigas primeiro`, () => {
    const { n } = exemplo(pk.dados);
    const vencidas = n.st.missao.passos.filter(p => p.t === 'revisao').map(p => p.cap);
    const novoTop = TOPS.find(x => !n.st.topicos[x]);
    const nota = n.topicoPagina(novoTop).acao.nota;
    assert.ok(vencidas.length > 3, 'o exemplo tem mais revisões vencidas do que cabem junto com um tópico');
    {
      assert.match(nota, /^Ele entra na missão de hoje\. .+ continuam; .+ (vai|vão) para o próximo dia de estudo: junto com um tópico, entram até 3 revisões por dia\.$/);
      n.despachar({ tipo: 'ESTUDAR_TOPICO', id: novoTop });
      const m = n.st.missao;
      assert.equal(m.foraPor, 'capacidade');
      assert.equal(m.revisoesForaDoOrcamento, vencidas.length - 3);
      const px = c => n.st.topicos[c].proxima;
      const ficam = m.passos.filter(p => p.t === 'revisao').map(p => p.cap);
      assert.ok(Math.max(...ficam.map(c => +new Date(px(c)))) <= Math.min(...m.revisoesFora.map(c => +new Date(px(c)))), 'ficam as mais antigas');
      n.despachar('PAUSAR');
      const comp = n.hoje().bloco.composicao;
      assert.match(comp, /para o próximo dia de estudo: junto com um tópico, entram até 3 revisões por dia\./);
      assert.ok(!/não cabem? nos seus/.test(comp));
      assert.ok(!/que vencem hoje continuam/.test(m.frase));
    }
  });

  test(`[${P}] R2-14 · revisão de tópico: "Por que esta missão?" conta as revisões que o quadro "Hoje vence" mostra`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP }); jogar(n, rel); n.despachar('FECHAR');
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP2 }); jogar(n, rel); n.despachar('FECHAR');
    ir(n, rel, '2026-11-18');
    const h = n.hoje(), f = h.porQue.frase;
    assert.match(h.venceHoje.vence, /^Hoje vencem 2 revisões/);
    assert.ok(!/não tem revisão vencida/.test(f) && !/ E as revisões de /.test(f), f);
    assert.equal(f, `Você ainda não abriu o Cap. 1, e hoje vencem as revisões de ${n.prat.titulo(TOP)} e ${n.prat.titulo(TOP2)}.`);
    // R9: Questão do dia com revisão de tópico
    const st = JSON.parse(JSON.stringify(n.st));
    for (const c of n.pack.capitulos) st.topicos[c.id] = { caixa: 2, proxima: '2026-11-25', tentativas: [{ item: 'x', dia: '2026-11-10', em: 1, res: 'ok' }], rodadas: [] };
    st.topicos[TOP2].proxima = '2026-11-25';
    const mm = montarMissaoGeral(st, n.pack, n.M, n.prat, '2026-11-18');
    assert.equal(mm.tipo, 'questaoDoDia');
    assert.equal(mm.frase, `Hoje vence a revisão de ${n.prat.titulo(TOP)}; o caderno está em dia, então o resto é a Questão do dia.`);
  });

  test(`[${P}] R2-15/R2-16 · Questão do dia com revisão de tópico: a próxima missão cita a revisão, e o ganho e o Pronto não se contradizem`, () => {
    const { n, rel } = exemplo(pk.dados);
    const top = Object.keys(n.st.topicos).find(k => n.prat.existe(k) && n.st.topicos[k].caixa);
    jogar(n, rel, (p, it) => (p.t === 'revisao' && p.cap === top ? errada(it) : certa(it)));
    const v = n.tela().vm;
    assert.ok(v.mudancas.some(x => x.texto.startsWith(`A revisão de ${n.prat.curto(top)} volta amanhã`)));
    assert.match(v.proxima.texto, new RegExp(`Questão do dia e revisão do tópico ${n.prat.curto(top)}\\.$`));
    n.despachar('FECHAR');
    ir(n, rel, R.addDias(R.hoje(), 1));
    const m = n.st.missao;
    assert.ok(m.tipo === 'questaoDoDia' && m.passos.some(p => p.t === 'revisao'), 'no dia seguinte: Questão do dia com a revisão do tópico');
    {
      const h = n.hoje();
      assert.match(h.bloco.ganho, /^A Questão do dia não muda nível nem agenda; a revisão muda\. Acerte a revisão na primeira resposta: /);
      // a composição que a tela mostra (hoje.js: no estado questaoDoDia, vm.texto; senão, bloco.composicao) conta a revisão
      const comp = h.estado === 'questaoDoDia' && h.texto ? h.texto : h.bloco.composicao;
      assert.match(comp, /1 revisão/);
      jogar(n, rel);
      const p = n.tela().vm, manter = p.mudancas.find(x => x.tipo === 'manter');
      assert.match(manter.texto, /^Hoje foi dia de manter: \d+ questões? do dia, \d+ certas? de primeira, e 1 revisão\.$/);
      assert.ok(!p.mudancas.some(x => /Nenhuma revisão venceu/.test(x.texto)));
    }
  });

  test(`[${P}] R2-17 · "Por quê?" da próxima missão fala do dia anunciado`, () => {
    // (a) revisão errada: volta pelo erro, não pelo intervalo do nível
    const { n, rel } = exemplo(pk.dados);
    jogar(n, rel, (p, it) => (p.t === 'revisao' && p.cap === 'mat-fa.c1' ? errada(it) : certa(it)));
    const pq = n.tela().vm.proxima.porque;
    assert.match(pq, /^Você errou a revisão de .+, e revisão errada volta no próximo dia de estudo: n[ao] \S+\.$/);
    assert.match(n.sumario().capitulos[0].verARegra, /Você errou a última revisão, e ela volta no próximo dia de estudo: \S+ \d\d\/\d\d\.$/);
    // (b) capítulo adiado (15 min): sem o "Hoje" do próprio dia
    const { n: n2, rel: r2 } = novo(pk.dados, { perfil: { minutos: 15 } });
    jogar(n2, r2);
    assert.match(n2.tela().vm.proxima.porque, /^Amanhã vence 1 revisão, e o Cap\. 2 não cabe junto nos seus 15 min: a revisão vem primeiro/);
    // (c) nenhum "Por quê?" de próxima missão começa com "Hoje"
    const { n: n3, rel: r3 } = novo(pk.dados);
    perfeito(n3, r3, '2026-12-03', x => { if (x.estado() === 'encerramento') { const p = x.tela().vm.proxima; assert.ok(!p || !/^Hoje|Hoje:/.test(p.porque || ''), p && p.porque); } });
  });

  test(`[${P}] R2-18 · revisão errada na véspera da folga: "volta na segunda", como a próxima missão`, () => {
    const { n, rel } = novo(pk.dados, { dia: '2026-11-18' });
    jogar(n, rel); n.despachar('FECHAR');
    ir(n, rel, '2026-11-19');                                         // quinta; plano de seg a qui
    jogar(n, rel, (p, it) => (p.t === 'revisao' ? errada(it) : certa(it)));
    const v = n.tela().vm;
    assert.ok(v.mudancas.some(x => /^A revisão de .+ volta na segunda, 23\/11\. /.test(x.texto)));
    assert.ok(!textos(v).some(s => /volta para amanhã/.test(s)));
    assert.match(v.proxima.texto, /^Segunda, 23\/11: /);
  });

  test(`[${P}] R2-19 · Hoje feito: "Próxima missão:" é a missão; o aviso da pergunta vem como segunda frase`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel);
    assert.equal(n.tela().vm.proxima.gancho, 'Amanhã você vê se acertou a pergunta antes da p. 2.');
    n.despachar('FECHAR');
    const f = n.hoje().feito;
    assert.ok(f.previa.startsWith(f.proxima.textoMissao), f.previa);
    assert.match(f.previa, /^Quarta, 18\/11: .+\. Nela você vê se acertou a pergunta antes da p\. 2\.$/);
    assert.equal(f.proxima.texto, f.previa);
  });

  test(`[${P}] R2-20 · medidor depois de duas checagens certas: falta a questão do Enem`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar('COMECAR');
    const medidores = [];
    for (let g = 0; g < 40; g++) {
      const e = n.estado(), p = n.st.missao.passos[n.st.missao.i];
      if (e === 'pergunta') { if (p.t === 'questao') break; n.despachar({ tipo: 'RESPONDER', alt: certa(n.missao.itemDe(p.id)) }); if (p.t === 'checagem') medidores.push(n.tela().vm.medidor.texto); }
      else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
      else if (e === 'feedback') { rel.avancarMs(4000); n.despachar('CONTINUAR'); }
    }
    assert.ok(medidores.length >= 2);
    assert.ok(medidores.every(t => t === 'Falta acertar uma questão do Enem'), medidores.join(' | '));
  });

  test(`[${P}] R2-23 · "Ficou registrada 1 tentativa" (concordância), no tópico e no caderno`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    n.despachar({ tipo: 'RESPONDER', alt: certa(n.missao.itemDe(n.st.missao.passos[0].id)) });
    n.despachar('TERMINEI_TRECHO'); rel.avancarMs(4000); n.despachar('CONTINUAR');
    const q = n.st.missao.passos[n.st.missao.i];
    n.despachar({ tipo: 'RESPONDER', alt: errada(n.missao.itemDe(q.id)) });
    n.despachar('CONFIRMAR_ENCERRAR');
    assert.ok(n.tela().vm.mudancas.some(x => x.texto === 'Hoje não subiu nível. Ficou registrada 1 tentativa.'));
    const { n: n2 } = novo(pk.dados);
    n2.despachar('COMECAR');
    for (let g = 0; g < 20; g++) {
      const e = n2.estado(), p = n2.st.missao.passos[n2.st.missao.i];
      if (e === 'pergunta') { const it = n2.missao.itemDe(p.id); n2.despachar({ tipo: 'RESPONDER', alt: p.t === 'pre' ? certa(it) : errada(it) }); if (p.t !== 'pre') break; }
      else if (e === 'leitura') n2.despachar('TERMINEI_TRECHO');
    }
    n2.despachar('CONFIRMAR_ENCERRAR');
    assert.ok(n2.tela().vm.mudancas.some(x => /^Hoje não subiu nível\. Ficou registrada 1 tentativa; a p\. \d+ volta no próximo dia de estudo\.$/.test(x.texto)));
  });
}
