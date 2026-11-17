import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import { criarMotor, intervalos, horizonte, retaFinal, recuperabilidade, pausa, P, NIVEL, rotuloNivel } from '../../js/nucleo/motor.js';
import { Pack } from '../../js/nucleo/pack.js';
import { vazio } from '../../js/nucleo/estado.js';
import { packs } from './ajuda.mjs';

const comProva = (prova, extra = {}) => Object.assign(vazio(), { perfil: { prova, dias: [1, 2, 3, 4], minutos: 25 }, conjuntosAtivos: ['mat-fa'] }, extra);

test('intervalos pela data da prova (f.2): prova a 27 dias dá 1, 2, 3, 4 e 5 dias', () => {
  assert.deepEqual(intervalos(comProva('2026-12-15'), '2026-11-18').slice(1), [1, 2, 3, 4, 5]);
  assert.equal(retaFinal(comProva('2026-12-15'), '2026-11-18'), 3);
});
test('sem data de prova: horizonte de 90 dias e intervalos 1, 2, 4, 7, 14 (f.3)', () => {
  const st = comProva(null);
  assert.equal(horizonte(st, '2026-11-18'), 90);
  assert.deepEqual(intervalos(st, '2026-11-18').slice(1), [1, 2, 4, 7, 14]);
});
test('prova já passada também usa 90 dias', () => {
  assert.equal(horizonte(comProva('2026-11-01'), '2026-11-18'), 90);
});
test('níveis com os nomes do motor e pesos 2/3/4 com critério 6', () => {
  assert.equal(NIVEL.length, 6, 'NIVEL é só chave interna (0 a 5)');
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(rotuloNivel), ['ainda não começou', 'nível 1 de 5', 'nível 2 de 5', 'nível 3 de 5', 'nível 4 de 5', 'nível 5 de 5'], 'nível não tem nome, nem o 5');
  assert.deepEqual(P.pesos, { lembrar: 2, compreender: 3, aplicar: 4 });
  assert.equal(P.criterio, 6);
  assert.equal(P.teto, 8);
});
test('R = 0,85^(t/I): 85% exatamente no dia agendado', () => {
  const st = comProva('2026-12-15', { topicos: { 'mat-fa.c1': { caixa: 2, proxima: '2026-11-20', tentativas: [], rodadas: [] } } });
  assert.equal(recuperabilidade(st, 'mat-fa.c1', '2026-11-20'), 85);
  assert.ok(recuperabilidade(st, 'mat-fa.c1', '2026-11-19') > 85);
});
test('intervalo deliberativo de 1,2 a 3,5 s', () => {
  assert.equal(pausa({ explicacao: '' }), 1200);
  assert.equal(pausa({ explicacao: 'x'.repeat(1000) }), 3500);
});

for (const pk of await packs()) {
  const pack = new Pack(pk.dados), M = criarMotor(pack.indiceMotor());
  test(`[${pk.nome}] g.8 · fecharRevisao: nível 1 + revisão certa → nível 2, próxima em intervalos[2]`, () => {
    R.definirFonte('2026-11-19');
    const st = comProva('2026-12-15', { topicos: { 'mat-fa.c1': { caixa: 1, proxima: '2026-11-19', tentativas: [{ item: 'x', dia: '2026-11-18', em: 1, res: 'ok' }], rodadas: [] } } });
    const iv = M.intervalos(st);
    const out = M.fecharRevisao(st, 'mat-fa.c1', 'ok');
    assert.equal(st.topicos['mat-fa.c1'].caixa, 2);
    assert.equal(st.topicos['mat-fa.c1'].proxima, R.addDias('2026-11-19', iv[2]));
    assert.equal(out.caixaAntes, 1); assert.equal(out.caixaDepois, 2);
  });
  test(`[${pk.nome}] g.8 · fecharRevisao: nível 3 + revisão errada → nível 2 (desce um), próxima amanhã, histórico intacto`, () => {
    R.definirFonte('2026-11-19');
    const tent = [{ item: 'a', dia: '2026-11-10', em: 1, res: 'ok' }, { item: 'b', dia: '2026-11-15', em: 2, res: 'ok' }];
    const st = comProva('2026-12-15', { topicos: { 'mat-fa.c1': { caixa: 3, proxima: '2026-11-19', tentativas: JSON.parse(JSON.stringify(tent)), rodadas: [] } } });
    const iv = M.intervalos(st);
    M.fecharRevisao(st, 'mat-fa.c1', 'erro');
    assert.equal(st.topicos['mat-fa.c1'].caixa, 2, 'desce UM nível');
    assert.equal(st.topicos['mat-fa.c1'].proxima, R.addDias('2026-11-19', 1), 'a revisão volta para amanhã');
    M.fecharRevisao(st, 'mat-fa.c1', 'erro'); M.fecharRevisao(st, 'mat-fa.c1', 'erro');
    assert.equal(st.topicos['mat-fa.c1'].caixa, 1, 'nunca abaixo do nível 1');
    assert.ok(iv[1] >= 1);
    assert.deepEqual(st.topicos['mat-fa.c1'].tentativas, tent);
  });
  test(`[${pk.nome}] rodada.teto tem prioridade sobre tetoDe (mudança de uma linha) e a vitória vem antes do teto`, () => {
    R.definirFonte('2026-11-18');
    const st = comProva('2026-12-15');
    const rod = M.novaRodada(st, 'mat-fa.c1', 'novo', 3);
    const it = (n, nivel) => ({ id: `i${n}`, nivel, topico: 'mat-fa.c1', opcoes: [] });
    assert.equal(M.registrar(st, rod, it(1, 'lembrar'), { res: 'erro' }).fim, false);
    assert.equal(M.registrar(st, rod, it(2, 'compreender'), { res: 'ok' }).fim, false);
    const out = M.registrar(st, rod, it(3, 'aplicar'), { res: 'ok' });
    assert.equal(out.venceu, true, '3 + 4 = 7 vence na 3ª tentativa, que também é o teto');
    assert.equal(st.dias['2026-11-18'], true, 'a tentativa avaliada marca o dia estudado');
  });
  test(`[${pk.nome}] avaliar(): só múltipla escolha, devolve ok ou erro (sem "quase")`, () => {
    const item = pack.paraMotor(pack.item('enem-2019-168'), 'aplicar');
    assert.equal(M.avaliar(item, pack.indice(pack.item('enem-2019-168'), 'D')).res, 'ok');
    assert.equal(M.avaliar(item, pack.indice(pack.item('enem-2019-168'), 'A')).res, 'erro');
  });
}
