import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packs, novo, continuar } from './ajuda.mjs';
import { marcarPlacar, estrelasDe } from '../../js/nucleo/missao.js';

function liberada(n) {
  for (const c of n.pack.capitulos) n.st.topicos[c.id] = { caixa: 2, proxima: '2026-11-25', tentativas: [{ item: 'x', dia: '2026-11-10', em: 1, res: 'ok' }], rodadas: [{ dia: '2026-11-10', venceu: true, tentativas: 3, de: 0, para: 1, tipo: 'novo' }] };
  n.st.missao = null; n.persistir(); n.missao.abrir();
}

test('placar: combo multiplica até x3, errar zera; carimbos 3/2/1 por aproveitamento', () => {
  const m = {};
  for (const r of ['ok', 'ok', 'ok', 'ok', 'erro', 'ok']) marcarPlacar(m, r);
  assert.equal(m.placar.pontos, 10 + 20 + 30 + 30 + 10);
  assert.equal(m.placar.maxSeq, 4);
  assert.equal(m.placar.seq, 1);
  assert.equal(estrelasDe({ acertos: 9, total: 10 }), 3);
  assert.equal(estrelasDe({ acertos: 6, total: 10 }), 2);
  assert.equal(estrelasDe({ acertos: 1, total: 10 }), 1);
});

for (const pk of await packs()) {
  const P = pk.nome;
  test(`[${P}] Chefão com 3 lápis: 3 erros encerram a Prova sem mudar nada`, () => {
    const { n, rel } = novo(pk.dados);
    liberada(n);
    n.despachar('FAZER_PROVA');
    assert.match(n.tela().vm.vidas, /3 lápis/);
    n.despachar('COMECAR_PROVA');
    for (let g = 0; g < 10 && n.estado() !== 'provaResultado'; g++) {
      if (n.estado() === 'provaPergunta') {
        const f = n.st.missao.prova.fila[n.st.missao.prova.i];
        n.despachar({ tipo: 'RESPONDER', alt: n.pack.item(f.id).alternativas.find(a => !a.certa).letra });
        assert.equal(n.tela().vm.topo.vidas.restam, 3 - n.st.missao.prova.rodada.tentativas);
      } else continuar(n, rel);
    }
    assert.equal(n.estado(), 'provaResultado');
    assert.equal(n.st.missao.prova.rodada.tentativas, 3, 'acabou no 3º erro, antes do teto de 12');
    const vm = n.tela().vm;
    assert.equal(vm.venceu, false);
    assert.match(vm.texto, /3 lápis quebraram/);
  });
  test(`[${P}] Contra o relógio: fila sorteada de várias fases, questões com gabarito e os 5 melhores placares`, () => {
    const { n } = novo(pk.dados);
    let k = 0; const rand = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
    const fila = n.sortearRelampago(rand);
    assert.ok(fila.length >= 10 && fila.length <= 15, `fila de ${fila.length}`);
    assert.equal(new Set(fila).size, fila.length);
    for (const id of fila) { const q = n.questaoRelampago(id); assert.ok(q && q.item && /^[A-E]$/.test(q.gabarito), id); }
    for (const p of [50, 300, 120, 80, 10, 200]) n.registrarRelampago({ pontos: p, acertos: 1, total: 2 });
    const v = n.relampago();
    assert.deepEqual(v.recordes.map(r => r.pontos), [300, 200, 120, 80, 50]);
    assert.equal(v.partidas, 6);
    assert.equal(n.registrarRelampago({ pontos: 999, acertos: 15, total: 15 }), 1);
  });
}

for (const pk of await packs()) {
  test(`[${pk.nome}] álbum: soma os carimbos das fases e o recorde chama no cartão`, () => {
    const { n } = novo(pk.dados);
    let a = n.album();
    assert.equal(a.ganhos, 0);
    assert.ok(a.max > 0 && a.max % 3 === 0);
    assert.equal(n.relampago().melhor, null);
    n.carregarExemplo();
    a = n.album();
    const soma = a.areas.flatMap(x => x.fases).reduce((s, f) => s + f.estrelas, 0);
    assert.equal(a.ganhos, soma);
    assert.ok(a.ganhos > 0 && a.ganhos <= a.max);
    assert.equal(n.relampago().melhor, 412);
    assert.match(n.relampago().chamada, /minutos/);
  });
}
