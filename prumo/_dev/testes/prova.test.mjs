import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../../js/nucleo/estado.js';
import { packs, novo, irPara, continuar } from './ajuda.mjs';

/** Estado com os 4 capítulos em Firmando e nada vencendo hoje (a Prova fica liberada). */
function liberada(n, dia = '2026-11-18') {
  for (const c of n.pack.capitulos) n.st.topicos[c.id] = { caixa: 2, proxima: '2026-11-25', tentativas: [{ item: 'x', dia: '2026-11-10', em: 1, res: 'ok' }], rodadas: [{ dia: '2026-11-10', venceu: true, tentativas: 3, de: 0, para: 1, tipo: 'novo' }] };
  n.st.missao = null;
  n.persistir();
  n.missao.abrir();
}

for (const pk of await packs()) {
  const P = pk.nome;
  test(`[${P}] Decisão 2 · a Prova do caderno é jogável: oferecida antes da missão, 4 acertos seguidos de 4 capítulos, troféu e selo`, () => {
    const { n, rel } = novo(pk.dados);
    liberada(n);
    const h = n.hoje();
    assert.ok(h.prova, 'oferta antes de começar a missão');
    assert.equal(h.prova.regra, '4 acertos seguidos, um de cada capítulo');
    n.despachar('FAZER_PROVA');
    let t = n.tela();
    assert.equal(t.nome, 'prova');
    assert.equal(t.vm.titulo, 'Prova do caderno: Funções afins');
    assert.equal(t.vm.tamanho, 'São até 12 questões, cerca de 36 minutos.');
    n.despachar('COMECAR_PROVA');
    const caps = new Set();
    for (let g = 0; g < 20 && n.estado() !== 'provaResultado'; g++) {
      if (n.estado() === 'provaPergunta') {
        t = n.tela();
        assert.match(t.vm.topo.tentativa, /^tentativa \d+ de 12$/);
        assert.equal(t.vm.topo.casas.length, 4);
        const f = n.st.missao.prova.fila[n.st.missao.prova.i];
        caps.add(f.cap);
        const it = n.pack.item(f.id);
        assert.ok(!n.st.vistos[f.id], 'só itens nunca vistos');
        n.despachar({ tipo: 'RESPONDER', alt: it.gabarito });
      } else continuar(n, rel);
    }
    assert.equal(caps.size, 4, 'um de cada capítulo');
    t = n.tela();
    assert.equal(t.vm.venceu, true);
    assert.equal(t.vm.texto, 'Você firmou os 4 capítulos de Funções afins.');
    n.despachar('FECHAR');
    assert.equal(n.st.chefes['mat-fa'].venceu, true);
    assert.deepEqual(n.st.selos, ['mat']);
    assert.ok(n.st.marcos['m.prova']);
    assert.equal(n.hoje().prova, null, 'uma Prova por dia');
    assert.equal(n.sumario().prova.estado, 'vencida');
    assert.equal(n.sumario().prova.trofeu.ganho, true);
  });
  test(`[${P}] g.8 · "Agora não" e encerrar no meio não mudam nada; a oferta some no estado Feito`, () => {
    const { n, rel } = novo(pk.dados);
    liberada(n);
    const antes = JSON.stringify(n.st.topicos);
    n.despachar('FAZER_PROVA'); n.despachar('AGORA_NAO');
    assert.equal(n.estado(), 'hoje'); assert.ok(n.hoje().prova);
    n.despachar('FAZER_PROVA'); n.despachar('COMECAR_PROVA');
    const f = n.st.missao.prova.fila[0];
    n.despachar({ tipo: 'RESPONDER', alt: n.pack.item(f.id).alternativas.find(a => !a.certa).letra });
    continuar(n, rel);
    n.despachar('ENCERRAR_PROVA');
    assert.equal(n.estado(), 'hoje');
    const depois = JSON.parse(JSON.stringify(n.st.topicos));
    for (const [id, t] of Object.entries(JSON.parse(antes))) { assert.equal(depois[id].caixa, t.caixa); assert.equal(depois[id].proxima, t.proxima); }
    assert.ok(!n.st.chefes['mat-fa'] || !n.st.chefes['mat-fa'].venceu);
    assert.equal(n.hoje().prova, null, 'a Prova já foi tentada hoje');
    // num novo dia, oferecida de novo; depois de começar a missão, não
    irPara(n, rel, '2026-11-19');
    assert.ok(n.hoje().prova);
    n.despachar('COMECAR');
    n.despachar('PAUSAR');
    assert.equal(n.hoje().prova, null, 'só antes de começar a missão do dia');
    assert.equal(n.despachar('FAZER_PROVA'), false);
  });
  test(`[${P}] a Prova é oferecida num dia de folga`, () => {
    const { n, rel } = novo(pk.dados);
    liberada(n);
    irPara(n, rel, '2026-11-21');
    assert.equal(n.hoje().estado, 'folga');
    assert.ok(n.hoje().prova);
  });
  test(`[${P}] sem todos os capítulos no nível 2 de 5, não há oferta`, () => {
    const { n } = novo(pk.dados);
    assert.equal(n.hoje().prova, null);
    assert.equal(n.despachar('FAZER_PROVA'), false);
    assert.equal(n.sumario().prova.texto, 'Ela libera quando todos os capítulos chegarem ao nível 2 de 5.');
  });
}
