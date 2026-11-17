/* Tópicos de prática: mapa (Estudar), página do tópico e a partida do tópico pela máquina de estados. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import { Praticas, IDS_PRATICA, montarMissaoGeral } from '../../js/nucleo/pratica.js';
import { gerarExemplo } from '../../js/nucleo/exemplo.js';
import { Pack } from '../../js/nucleo/pack.js';
import { packs, PERFIL } from './ajuda.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
async function carregarPraticas() {
  const out = [];
  for (const id of IDS_PRATICA) {
    const a = path.resolve(aqui, `../../conteudo/praticas/${id}.js`), b = path.resolve(aqui, `../../conteudo/praticas/${id}.teoria.js`);
    out.push({ id, topico: existsSync(a) ? (await import(pathToFileURL(a).href)).topico : null, teoria: existsSync(b) ? (await import(pathToFileURL(b).href)).teoria : null });
  }
  return out;
}
const LISTA = await carregarPraticas();
const PRIMEIRO = LISTA.find(x => x.topico && x.teoria).id;

function novo(dados, { dia = '2026-11-18', praticas = LISTA, perfil = PERFIL } = {}) {
  const rel = R.relogioFalso(`${dia}T19:00`);
  R.setOffset(0);
  const n = new Nucleo({ pack: dados, storage: E.memoria(), praticas });
  n.abrir();
  if (perfil) n.concluirPrimeiroUso(perfil);
  return { n, rel };
}
/** Joga a missão até o fim respondendo pela função alt(item, passo). */
function jogar(n, rel, alt) {
  for (let g = 0; g < 200; g++) {
    const e = n.estado(), m = n.st.missao;
    if (e === 'encerramento' || e === 'feito' || e === 'hoje') return e;
    const p = m.passos[m.i];
    if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: alt(n.missao.itemDe(p.id), p) });
    else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') { rel.avancarMs(4000); assert.ok(n.despachar('CONTINUAR')); }
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') { const mao = m.mao; n.despachar(mao.pendente ? 'SEGUIR' : mao.virado ? 'LEMBREI' : 'VIRAR'); }
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else throw new Error(`estado inesperado ${e}`);
  }
  throw new Error('não terminou');
}
const errada = item => item.alternativas.find(a => !a.certa).letra;


for (const pk of await packs()) {
  const P = pk.nome;
  test(`[${P}] Estudar: 4 áreas do Enem, matérias e tópicos; sem dados, área "em breve" com frase honesta`, () => {
    const { n } = novo(pk.dados);
    const v = n.estudar();
    assert.deepEqual(v.areas.map(a => a.nome), ['Matemática', 'Linguagens', 'Ciências da Natureza', 'Ciências Humanas']);
    const mt = v.areas[0];
    assert.equal(mt.disponivel, true);
    assert.equal(mt.materias[0].topicos[0].caderno, true, 'Funções afins vem primeiro, o caderno completo');
    assert.equal(mt.materias[0].topicos[0].estadoTexto, 'Ainda não começou.');
    const cn = v.areas.find(a => a.id === 'CN');
    assert.equal(cn.disponivel, false);
    assert.match(cn.frase, /chega nas próximas versões\.$/);
    for (const a of v.areas) for (const mt2 of a.materias) for (const t of mt2.topicos) assert.ok(!/·/.test(t.estadoTexto));
  });

  test(`[${P}] arquivo ausente: o tópico aparece "em preparação" e não abre`, () => {
    const { n } = novo(pk.dados, { praticas: LISTA.filter(x => x.id !== 'mat-proporcao') });
    const t = n.estudar().areas[0].materias[0].topicos.find(x => x.id === 'mat-proporcao');
    assert.equal(t.disponivel, false); assert.equal(t.emPreparacao, true);
    assert.equal(n.topicoPagina('mat-proporcao').acao, null);
    assert.equal(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: 'mat-proporcao' }), false);
  });

  test(`[${P}] partida do tópico: pré-pergunta sem acerto → teoria → resposta → questões → fim → Pronto com o visto`, () => {
    const { n, rel } = novo(pk.dados);
    const pg = n.topicoPagina(PRIMEIRO);
    assert.equal(pg.acao.disponivel, true); assert.equal(pg.acao.evento, 'ESTUDAR_TOPICO');
    assert.match(pg.acao.nota, /no lugar de/);
    assert.ok(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO }));
    assert.equal(n.estado(), 'pergunta');
    let t = n.tela();
    assert.equal(t.vm.tipo, 'pre');
    assert.ok(!JSON.stringify(t.vm).includes('"certa":true'), 'a pré-pergunta não traz gabarito');
    const pre = n.missao.itemDe(n.st.missao.passos[0].id);
    n.despachar({ tipo: 'RESPONDER', alt: errada(pre) });
    assert.equal(n.estado(), 'leitura');
    t = n.tela();
    assert.equal(t.vm.teoria, true);
    assert.equal(t.vm.faixa, 'Resposta guardada. No fim da teoria você vê se acertou.');
    assert.ok(!JSON.stringify(t.vm).includes(n.st.praticas[PRIMEIRO].pre.alt + '. A certa'), 'nada de acerto durante a leitura');
    assert.equal(Object.keys(n.st.dias).length, 0, 'ler não conta como dia estudado');
    n.despachar('TERMINEI_TRECHO');
    assert.equal(n.estado(), 'feedback');
    t = n.tela();
    assert.equal(t.vm.tipo, 'revela');
    assert.match(t.vm.titulo, /^Antes de ler, você marcou [A-E]\. A certa é [A-E]\.$/);
    rel.avancarMs(4000); n.despachar('CONTINUAR');
    // 1ª questão errada: "o que faltou" e "Rever a teoria"; depois acerta duas seguidas
    assert.equal(n.estado(), 'pergunta');
    assert.equal(n.tela().vm.tipo, 'enem');
    assert.match(n.tela().vm.topo.regra.texto, /Acerte 2 questões seguidas/);
    const q1 = n.missao.itemDe(n.st.missao.passos[n.st.missao.i].id);
    n.despachar({ tipo: 'RESPONDER', alt: errada(q1) });
    t = n.tela();
    assert.equal(t.vm.certa, false);
    assert.ok(t.vm.falta, 'o que faltou');
    assert.equal(t.vm.trecho.rotulo, 'Rever a teoria');
    assert.ok(n.despachar('VOLTAR_AO_TRECHO'));
    assert.equal(n.tela().vm.teoria, true);
    n.despachar('VOLTAR');
    rel.avancarMs(4000); n.despachar('CONTINUAR');
    const fim = jogar(n, rel, item => item.gabarito);
    assert.equal(fim, 'encerramento');
    const v = n.tela().vm;
    assert.ok(v.visto, 'o visto do dia');
    assert.match(v.visto.obs, /, nível 1 de 5$/);
    assert.ok(v.mudancas.some(x => /entrou no nível 1 de 5/.test(x.texto)));
    assert.equal(n.st.topicos[PRIMEIRO].caixa, 1);
    assert.ok(n.st.topicos[PRIMEIRO].proxima > '2026-11-18');
    assert.equal(v.continuar.texto, 'Se quiser, pode continuar estudando por conta própria.');
    assert.equal(v.continuar.aba, 'estudar');
    // depois do Pronto por hoje: nenhuma isca, mas o aluno pode continuar por conta própria (estudo livre)
    n.despachar('FECHAR');
    assert.ok(n.teoriaLivre(PRIMEIRO).livre, 'a teoria continua livre para ler');
    assert.equal(n.topicoPagina(PRIMEIRO).nivel.rotulo, 'nível 1 de 5');
    const outro = n.prat.ids().find(x => x !== PRIMEIRO);
    const pg2 = n.topicoPagina(outro);
    assert.equal(pg2.acao.disponivel, true); assert.match(pg2.acao.nota, /por conta própria/);
    assert.equal(n.topicoPagina(n.pack.id).acao.disponivel, false, 'o caderno fica para a próxima missão');
    const tent = Object.values(n.st.topicos).reduce((s, t) => s + t.tentativas.length, 0);
    assert.ok(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: outro }));
    assert.equal(n.st.missao.livre, true);
    assert.equal(n.topicoPagina(PRIMEIRO).acao.disponivel, false, 'um estudo livre por vez');
    assert.equal(jogar(n, rel, item => item.gabarito), 'encerramento');
    const v2 = n.tela().vm;
    assert.equal(v2.visto, null, 'sem segundo visto no mesmo dia');
    assert.equal(v2.titulo, 'Estudo registrado');
    assert.ok(Object.values(n.st.topicos).reduce((s, t) => s + t.tentativas.length, 0) > tent, 'as tentativas contam');
    assert.equal(n.st.topicos[outro].caixa, 1, 'o nível sobe pelas mesmas regras');
    n.despachar('FECHAR');
    assert.equal(n.estado(), 'feito');
    assert.ok(!n.st.missao.livre, 'volta a missão do dia, já cumprida');
    assert.equal(n.hoje().estado, 'feito');
    assert.ok(n.hoje().links.some(l => l.aba === 'estudar' && l.rotulo === 'Continuar estudando'));
    // de novo o mesmo tópico: as questões se repetem no estudo livre
    assert.ok(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: outro }));
    assert.ok(n.st.missao.passos.some(p => p.t === 'questao'), 'questões repetíveis no estudo livre');
  });

  test(`[${P}] revisão do tópico entra na missão pela data (P1) e sobe o nível pelo mesmo motor`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO });
    jogar(n, rel, item => item.gabarito);
    n.despachar('FECHAR');
    const prox = n.st.topicos[PRIMEIRO].proxima;
    rel.irPara(`${prox}T19:00`);
    n.conferirData();
    const m = n.st.missao;
    if (m.tipo === 'folga') return;
    const rv = m.passos.find(p => p.t === 'revisao' && p.cap === PRIMEIRO);
    assert.ok(rv, 'a revisão do tópico está na missão');
    assert.ok(m.trilha.some(x => x.id === 'P1' && x.ok));
    assert.ok(!/Cap\. undefined|undefined/.test(JSON.stringify(n.hoje())));
    n.despachar('COMECAR');
    jogar(n, rel, item => item.gabarito);
    assert.equal(n.st.topicos[PRIMEIRO].caixa, 2);
  });

  test(`[${P}] missão em curso: o botão explica; tópico começado e não vencido continua (P2) quando o caderno não tem capítulo em curso`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar('COMECAR');
    const a = n.topicoPagina(PRIMEIRO).acao;
    assert.equal(a.disponivel, false); assert.match(a.motivo, /já começou/);
    assert.equal(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO }), false);
    // tópico com tudo errado: fica começado
    const { n: n2, rel: r2 } = novo(pk.dados);
    n2.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO });
    jogar(n2, r2, (item, p) => (p.t === 'pre' ? item.gabarito : errada(item)));
    n2.despachar('FECHAR');
    assert.equal(n2.topicoPagina(PRIMEIRO).estado, 'pratica');
    const mm = montarMissaoGeral(n2.st, n2.pack, n2.M, n2.prat, '2026-11-19');
    // o caderno ainda tem o Cap. 1 novo (R8): o tópico começado continua (P2)
    assert.equal(mm.regra, 'P2'); assert.equal(mm.cap, PRIMEIRO);
    assert.ok(!mm.passos.some(p => p.t === 'pre'), 'a pergunta de antes não se repete');
  });

  test(`[${P}] "Estudar este tópico hoje" no caderno (Funções afins) leva ao fluxo que já existe`, () => {
    const { n } = novo(pk.dados);
    assert.ok(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: n.pack.id }));
    assert.notEqual(n.st.missao.tipo, 'topico');
    assert.ok(['pergunta', 'leitura'].includes(n.estado()));
  });

  test(`[${P}] estado salvo com tópico de prática é normalizado e restaurado igual`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO });
    jogar(n, rel, item => item.gabarito);
    const st = JSON.parse(JSON.stringify(n.st));
    assert.deepEqual(E.normalizar(st).praticas, st.praticas);
    assert.deepEqual(E.normalizar(st).topicos[PRIMEIRO], st.topicos[PRIMEIRO]);
  });

  test(`[${P}] Perfil: nome e foto ficam no aparelho; foto inválida é recusada`, () => {
    const { n } = novo(pk.dados, { perfil: Object.assign({}, PERFIL, { nome: '  Daniel  Souza ', areas: ['MT', 'LC', 'XX'] }) });
    assert.equal(n.st.perfil.nome, 'Daniel Souza');
    assert.deepEqual(n.st.perfil.areas, ['MT', 'LC']);
    assert.equal(n.hoje().saudacao, 'Oi, Daniel');
    assert.equal(n.perfil().iniciais, 'DS');
    assert.equal(n.definirFoto('javascript:alert(1)'), false);
    assert.ok(n.definirFoto('data:image/jpeg;base64,AAAA'));
    assert.equal(n.perfil().foto, 'data:image/jpeg;base64,AAAA');
    n.definirNome('Ana');
    assert.equal(n.hoje().saudacao, 'Oi, Ana');
  });

  test(`[${P}] exemplo com tópicos: um tópico de prática começado e o resto do exemplo intacto`, () => {
    const T = '2026-11-18';
    R.definirFonte(`${T}T08:00`);
    const pack = new Pack(pk.dados);
    const n0 = new Nucleo({ pack, storage: E.memoria(), praticas: LISTA });
    const st = gerarExemplo(pack, T, n0.prat);
    assert.ok(Object.keys(st.praticas).length >= 1);
    const id = Object.keys(st.praticas)[0];
    assert.ok(st.topicos[id].caixa >= 1);
    assert.equal(st.chefes['mat-fa'].venceu, true);
    for (const t of Object.values(st.topicos)) assert.equal(t.caixa, t.rodadas[t.rodadas.length - 1].para);
    const n = new Nucleo({ pack: pk.dados, storage: E.memoria({ prumo: JSON.stringify(st) }), praticas: LISTA });
    const t = n.abrir();
    assert.equal(t.nome, 'hoje');
    assert.ok(t.vm.bloco);
    assert.ok(!/undefined/.test(JSON.stringify(t.vm)));
    assert.ok(!/undefined/.test(JSON.stringify(n.plano().agenda)));
  });
}

test('limparSvg: SVG do conteúdo entra só limpo (sem script, eventos, foreignObject nem links)', async () => {
  const { limparSvg } = await import('../../js/nucleo/pratica.js');
  assert.equal(limparSvg('<div>oi</div>'), null);
  assert.equal(limparSvg(null), null);
  const s = limparSvg('<svg viewBox="0 0 10 10"><script>alert(1)</script><rect onclick="x()" width="5" height="5" fill="currentColor"/><foreignObject><p>x</p></foreignObject><a href="javascript:x()"><text>t</text></a></svg>');
  assert.ok(s && s.startsWith('<svg'));
  assert.ok(!/script|onclick|foreignObject|javascript|href/i.test(s), s);
  assert.ok(/<rect/.test(s) && /currentColor/.test(s));
});

test('teoria: figura, tabela, quadro "No Enem" e exemplos numerados; campos que faltam não quebram', async () => {
  const base = LISTA.find(x => x.topico && x.teoria);
  const te = JSON.parse(JSON.stringify(base.teoria));
  te.secoes[0].figura = { svg: '<svg viewBox="0 0 4 4"><circle cx="2" cy="2" r="1" onload="x()"/></svg>', alt: 'um círculo', legenda: 'Figura 1. Um círculo.' };
  te.secoes[0].tabela = { cabecalho: ['a', 'b'], linhas: [['1', 2]], legenda: 'Tabela 1.' };
  te.secoes[0].atencao = 'Cai muito.';
  te.secoes[0].exemplos = [{ enunciado: 'E1', resolucao: ['p1'] }];
  te.secoes[1].figura = { svg: '<script>x</script>' };
  const lista = LISTA.map(x => (x.id === base.id ? Object.assign({}, x, { teoria: te }) : x));
  const pk = (await packs())[0];
  const { n } = novo(pk.dados, { praticas: lista });
  const v = n.teoriaLivre(base.id);
  assert.equal(v.secoes[0].figura.legenda, 'Figura 1. Um círculo.');
  assert.ok(!/onload/.test(v.secoes[0].figura.svg));
  assert.deepEqual(v.secoes[0].tabela.linhas, [['1', '2']]);
  assert.deepEqual(v.secoes[0].atencao, { rotulo: 'No Enem', texto: 'Cai muito.' });
  assert.ok(v.secoes[0].exemplos.length >= 1 && v.secoes[0].exemplos.every((e, i) => e.n >= i + 1));
  assert.equal(v.secoes[1].figura, null, 'figura inválida some, sem quebrar');
  assert.ok(!/\bIA\b|Claude/.test(JSON.stringify(v)));
});

for (const pk of await packs()) {
  test(`[${pk.nome}] retorno diário: "Hoje vence", meta da semana (sem perda) e coleção de vistos (só cresce)`, () => {
    const { n, rel } = novo(pk.dados);
    const s = n.semana();
    assert.equal(s.dias.length, 7); assert.equal(s.n, 0); assert.equal(s.meta, 3);
    assert.equal(s.texto, '0 de 3 dias nesta semana');
    assert.ok(!/perd/i.test(JSON.stringify(s)));
    assert.equal(n.hoje().venceHoje, null, 'sem revisão vencendo, sem destaque');
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: PRIMEIRO });
    jogar(n, rel, item => item.gabarito);
    assert.ok(n.st.carimbos['2026-11-18'], 'o visto entra na coleção');
    n.despachar('FECHAR');
    assert.equal(n.semana().n, 1);
    const c = n.colecao();
    assert.equal(c.mes, '2026-11');
    assert.ok(c.semanas.flat().some(x => x.dia === '2026-11-18' && x.visto));
    assert.match(c.texto, /^1 visto neste mês\. 1 visto no total\.$/);
    assert.equal(c.seguinte, null, 'não navega para o futuro');
    // estudo livre não gera carimbo novo (o do dia já existe) e não apaga nada
    const outro = n.prat.ids().find(x => x !== PRIMEIRO);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: outro }); jogar(n, rel, item => item.gabarito); n.despachar('FECHAR');
    assert.equal(Object.keys(n.st.carimbos).length, 1);
    // no dia da revisão: "Hoje vence"
    rel.irPara(`${n.st.topicos[PRIMEIRO].proxima}T19:00`); n.conferirData();
    if (n.st.missao.tipo !== 'folga') {
      const v = n.hoje().venceHoje;
      assert.ok(v && /^Hoje (vence 1 revisão|vencem \d+ revisões) do .+. Revisando hoje, você guarda o conteúdo\.$/.test(v.texto), v && v.texto);
    }
    // semana seguinte começa limpa; a coleção continua
    rel.irPara('2026-11-30T19:00'); n.conferirData();
    assert.equal(n.semana().n, 0);
    assert.equal(n.colecao('2026-11').semanas.flat().filter(x => x.visto).length >= 1, true);
  });
}

for (const pk of await packs()) {
  test(`[${pk.nome}] retorno diário: "quando e onde", "Amanhã começa por aqui" e "Bem-vindo de volta" com o visto de retorno`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar('COMECAR');
    jogar(n, rel, item => item.gabarito);
    const v = n.tela().vm;
    assert.ok(v.quando, 'Pronto: quando e onde');
    assert.deepEqual(v.quando.ancoras, ['depois que eu chegar da escola', 'depois do almoço', 'antes de dormir']);
    assert.ok(v.amanha && v.amanha.html, 'Pronto: a pergunta de amanhã');
    assert.ok(!('alternativas' in v.amanha), 'só o enunciado, sem alternativas');
    assert.equal(n.definirIntencao({ dia: '2026-11-10', horario: '18:00' }), false, 'dia no passado é recusado');
    assert.equal(n.definirIntencao({ dia: v.quando.dia, horario: '18:00', ancora: 'depois que eu chegar da escola' }), true);
    assert.equal(n.st.perfil.horario, '18:00', 'alimenta o lembrete');
    n.despachar('FECHAR');
    assert.match(n.hoje().intencao.texto, /^Seu plano: (amanhã|.+), 18h, depois que eu chegar da escola\.$/);
    // some por 4 dias de estudo e volta: "Bem-vindo de volta. Nada se perdeu." e o visto com "retorno"
    rel.irPara('2026-11-30T19:00'); n.conferirData();
    const h = n.hoje();
    assert.ok(h.recomeco && h.recomeco.tipo === 'retorno', JSON.stringify(h.recomeco));
    assert.equal(h.recomeco.titulo, 'Bem-vindo de volta. Nada se perdeu.');
    assert.match(h.recomeco.prova, /^Faltam \d+ dias para a prova de 15\/12\.$/);
    assert.ok(!/você perdeu|perdid|culpa/i.test(JSON.stringify(h.recomeco)));
    n.despachar('COMECAR');
    jogar(n, rel, item => item.gabarito);
    const p = n.tela().vm;
    assert.ok(p.visto && p.visto.retorno && /^retorno/.test(p.visto.obs), 'o visto vem com a anotação "retorno"');
  });
  test(`[${pk.nome}] "Semana nova: começa limpa" na primeira abertura da semana`, () => {
    const { n, rel } = novo(pk.dados);   // qua 18/11
    n.despachar('COMECAR'); jogar(n, rel, item => item.gabarito); n.despachar('FECHAR');
    rel.irPara('2026-11-23T19:00'); n.conferirData();   // segunda seguinte
    const h = n.hoje();
    assert.ok(h.recomeco && h.recomeco.tipo === 'semana', JSON.stringify(h.recomeco));
    assert.equal(h.recomeco.titulo, 'Semana nova: começa limpa');
  });
}
