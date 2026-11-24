/* Primeiro uso enxuto: os padrões montam um perfil completo, o primeiro dia nunca é folga
   e os textos seguem as regras (sem IA, sem "vestibular" como fonte de questão). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import { IDS_PRATICA } from '../../js/nucleo/pratica.js';
import { packs, textos } from './ajuda.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const PRATICAS = [];
for (const id of IDS_PRATICA) {
  const a = path.resolve(aqui, `../../conteudo/praticas/${id}.js`), b = path.resolve(aqui, `../../conteudo/praticas/${id}.teoria.js`);
  PRATICAS.push({ id, topico: existsSync(a) ? (await import(pathToFileURL(a).href)).topico : null, teoria: existsSync(b) ? (await import(pathToFileURL(b).href)).teoria : null });
}
/** O perfil que a tela manda quando o aluno não mexe em nada (só toca em "Ver minha missão de hoje"). */
const perfilPadrao = vm => ({ provaTipo: vm.provaPadrao, prova: null, dias: vm.dias.padrao, minutos: vm.minutos.padrao, horario: vm.horario.padrao, som: false, alarme: null, nome: null, areas: vm.areasPadrao });

for (const pk of await packs()) {
  test(`[${pk.nome}] primeiro uso · de segunda a domingo, os padrões nunca começam numa folga`, () => {
    for (let k = 0; k < 7; k++) {
      const dia = R.addDias('2026-11-16', k);            // 16/11/2026 é segunda
      R.relogioFalso(`${dia}T10:00`); R.setOffset(0);
      const n = new Nucleo({ pack: pk.dados, storage: E.memoria(), praticas: PRATICAS });
      n.abrir();
      const vm = n.primeiroUso();
      const ds = R.diaDaSemana(dia);
      assert.ok(vm.dias.padrao.includes(ds), `${dia}: hoje entra nos dias`);
      assert.ok(vm.dias.padrao.length >= vm.dias.min && vm.dias.padrao.length <= vm.dias.max, `${dia}: de 3 a 5 dias`);
      assert.equal(!!vm.dias.dica, ![1, 2, 3, 4].includes(ds), `${dia}: a dica só aparece quando hoje entrou`);
      n.concluirPrimeiroUso(perfilPadrao(vm));
      assert.equal(n.estado(), 'hoje');
      assert.notEqual(n.st.missao.tipo, 'folga', `${dia}: o primeiro dia não é folga`);
      assert.ok(n.st.missao.passos.length > 0, `${dia}: a primeira missão tem passos`);
      assert.equal(n.st.perfil.metaSemana, vm.dias.padrao.length - 1);
    }
  });

  test(`[${pk.nome}] primeiro uso · padrões: Enem, 25 min, Matemática e Linguagens, alarme às 19:00 no Plano`, () => {
    R.relogioFalso('2026-11-18T10:00'); R.setOffset(0);
    const n = new Nucleo({ pack: pk.dados, storage: E.memoria(), praticas: PRATICAS });
    n.abrir();
    const vm = n.primeiroUso();
    assert.equal(vm.provaPadrao, 'enem');
    assert.deepEqual(vm.areasPadrao, ['MT', 'LC']);
    assert.equal(vm.padroes([1, 2, 3, 4], 25, ['MT', 'LC']), 'Para começar: seg, ter, qua e qui, 25 min por dia, Matemática e Linguagens.');
    n.concluirPrimeiroUso(perfilPadrao(vm));
    const p = n.st.perfil;
    assert.equal(p.provaTipo, 'enem'); assert.equal(p.prova, null); assert.equal(p.minutos, 25); assert.equal(p.horario, '19:00');
    assert.deepEqual(p.areas, ['MT', 'LC']);
    assert.equal(n.st.config.alarme, null);
    assert.equal(n.plano().lembrete.texto, '"Prumo", às 19:00, segunda, terça, quarta e quinta');
  });

  test(`[${pk.nome}] primeiro uso · textos sem IA, sem "vestibular" como fonte e sem nome de nível`, () => {
    R.relogioFalso('2026-11-18T10:00'); R.setOffset(0);
    const n = new Nucleo({ pack: pk.dados, storage: E.memoria(), praticas: PRATICAS });
    n.abrir();
    const vm = n.primeiroUso();
    // o rótulo "Outro vestibular" é um tipo de prova do aluno, não uma fonte de questões
    const ts = textos(Object.assign({}, vm, { provas: vm.provas.map(p => Object.assign({}, p, { rotulo: '', valor: '' })) }));
    for (const s of ts) {
      assert.ok(!/\bIA\b|intelig[êe]ncia artificial/i.test(s), `IA: "${s}"`);
      assert.ok(!/vestibular/i.test(s), `vestibular: "${s}"`);
      assert.ok(!/\bn[íi]vel\b(?! \d de 5)/i.test(s), `nível sem "N de 5": "${s}"`);
    }
    assert.equal(vm.onboarding.length, 3);
    assert.deepEqual(vm.onboarding.map(o => o.etapa), ['Aquecer', 'Leitura', 'Questões']);
    assert.ok(!/Marque também/.test(JSON.stringify(vm.provas)), 'a dica do Enem não pede duas escolhas num rádio');
  });
}
