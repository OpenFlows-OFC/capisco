import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';

test('relógio injetável: fonte fixa, relógio falso e deslocamento da demonstração', () => {
  R.definirFonte('2026-11-18');
  assert.equal(R.hoje(), '2026-11-18');
  const rel = R.relogioFalso('2026-11-18T23:59');
  assert.equal(R.hoje(), '2026-11-18');
  rel.avancarMs(60 * 1000);
  assert.equal(R.hoje(), '2026-11-19', 'virar a meia-noite muda o dia');
  R.setOffset(7);
  assert.equal(R.hoje(), '2026-11-26');
  R.setOffset(0);
  R.definirFonte(null);
  assert.match(R.hoje(), /^\d{4}-\d{2}-\d{2}$/);
});

test('datas: aritmética, semana de segunda a domingo e textos em português', () => {
  assert.equal(R.addDias('2026-11-30', 1), '2026-12-01');
  assert.equal(R.diff('2026-11-18', '2026-12-15'), 27);
  assert.equal(R.segundaDe('2026-11-22'), '2026-11-16');
  assert.equal(R.segundaDe('2026-11-16'), '2026-11-16');
  assert.equal(R.fmtCurta('2026-11-20'), 'sex 20/11');
  assert.equal(R.fmtCabecalho('2026-11-19'), 'QUINTA, 19 DE NOVEMBRO');
  assert.equal(R.fmtDiaSemana('2026-11-23'), 'Segunda, 23/11');
  assert.equal(R.fmtRelativa('2026-11-19', '2026-11-18'), 'amanhã, qui 19/11');
  assert.equal(R.fmtCompleta('2026-12-15'), '15/12/2026');
});
