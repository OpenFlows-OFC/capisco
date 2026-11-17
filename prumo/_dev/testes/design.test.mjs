/* Design system "Prumo": os textos novos que as telas leem do núcleo (nenhum calculado na tela).
   Cabeçalho de prova (Capítulo | Páginas | Tempo), regra com o nível explicado na primeira vez,
   Recado "Ontem:", legenda da Régua ("faltam N questões"), ficha "revisão N de 5", cabeçalho
   da questão ("QUESTÃO 162"), visto do dia e frases sem cadeia de pontos. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packs, novo, passo, jogar, irPara } from './ajuda.mjs';

for (const pk of await packs()) {
  const P = pk.nome;

  test(`[${P}] design · Hoje: data em caixa normal, Cabecalho sem Data, regra com o nível explicado e o visto anunciado`, () => {
    const { n } = novo(pk.dados);
    const vm = n.hoje();
    assert.equal(vm.data, 'Quarta, 18 de novembro');
    const cab = vm.bloco.cabecalho;
    assert.deepEqual(cab.map(c => c.rotulo), ['Capítulo', 'Páginas', 'Tempo']);
    assert.equal(cab[0].valor, '1');
    assert.match(cab[1].valor, /^\d+–\d+$/);
    assert.match(cab[2].valor, /^\d+$/); assert.equal(cab[2].unidade, 'min');
    assert.ok(cab.every(c => /^[\d,–\s]+$/.test(c.valor)), 'valor do cabeçalho só com dígitos (vai em Mono)');
    assert.match(vm.bloco.regra, /^Acerte duas seguidas, uma delas numa questão do Enem: o capítulo Parte fixa e parte que varia entra no nível 1 de 5\. A primeira revisão fica para \d\d\/\d\d\. No fim, o visto do dia\.$/);
    assert.equal(vm.recado, null);
    assert.ok(!/·|≈/.test(vm.bloco.composicao));
  });

  test(`[${P}] design · revisão de um capítulo: "nível N de 5" com a data exata da próxima revisão, com a data exata`, () => {
    const { n } = novo(pk.dados);
    const cap = n.pack.capitulos[0].id;
    n.st.topicos[cap] = Object.assign(n.st.topicos[cap] || { tentativas: [], rodadas: [] }, { caixa: 2 });
    n.st.config.nivelMaximo = 5;
    const regra = n._regraHoje({ tipo: 'revisao', passos: [{ t: 'revisao', cap }] }, '2026-11-18');
    assert.match(regra, /^Acerte a revisão na primeira resposta: o capítulo Parte fixa e parte que varia sobe para o nível 3 de 5\. A próxima revisão fica para \d\d\/\d\d\. No fim, o visto do dia\.$/);
  });

  test(`[${P}] design · Recado "Ontem:" (rótulo + frase) quando a missão de ontem ficou pela metade`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'checagem' });
    const passoN = n.st.missao.i + 1, total = n.st.missao.passos.length;
    n.despachar('PAUSAR');
    irPara(n, rel, '2026-11-19', '07:00');
    assert.deepEqual(n.hoje().recado, { rotulo: null, texto: `Ontem você parou no passo ${passoN} de ${total}. O que fez ficou registrado; hoje a missão é nova.` });
  });

  test(`[${P}] design · Régua da missão: "passo N de M" e "faltam (até) N questões", nunca tempo`, () => {
    const { n } = novo(pk.dados);
    n.despachar('COMECAR');
    const tp = n.tela().vm.topo;
    assert.equal(tp.legenda.passo, `passo 1 de ${n.st.missao.passos.length}`);
    assert.match(tp.legenda.falta, /^faltam (até )?\d+ questões$/);
    assert.ok(!/min|≈/.test(JSON.stringify(tp.legenda)));
  });

  test(`[${P}] design · pergunta: rótulo em caixa normal e cabeçalho do caderno impresso`, () => {
    const { n, rel } = novo(pk.dados);
    n.despachar('COMECAR');
    const vm = n.tela().vm;
    assert.equal(vm.rotulo, 'Antes de ler a p. 1');
    assert.ok(vm.item.cabecalho && vm.item.cabecalho.num);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && x.tela().vm.tipo === 'enem' });
    const q = n.tela().vm;
    assert.match(q.item.cabecalho.num, /^Questão \d+$/);
    assert.match(q.item.cabecalho.fonte, /^Enem \d{4}, \dº dia$/);
  });

  test(`[${P}] design · ficha: "revisão N de 5" e o capítulo; Pronto por hoje com visto e frases`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    jogar(n, rel, { parar: x => x.estado() === 'cards' });
    if (n.estado() === 'cards') {
      const vm = n.tela().vm;
      assert.match(vm.caixa.rotulo, /^revisão [1-5] de 5$/);
      assert.match(vm.cap, /^Cap\. \d+$/);
      jogar(n, rel);
    }
    const pr = n.tela().vm;
    assert.equal(n.estado(), 'encerramento');
    assert.equal(pr.visto.data, '19/11/2026');
    assert.ok(pr.mudancas.every(m => !/ · /.test(m.texto)));
    assert.ok(pr.proxima && !/ · /.test(pr.proxima.texto));
  });

  test(`[${P}] design · faixa do modo demonstração no formato do Recado`, () => {
    const { n } = novo(pk.dados);
    n.carregarExemplo();
    const d = n.tela().faixas.demo;
    assert.equal(d.rotulo, 'Modo demonstração');
    assert.match(d.frase, /^dados de exemplo(, data simulada \d\d\/\d\d)?\.$/);
  });
}
