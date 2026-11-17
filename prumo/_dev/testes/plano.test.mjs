import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { fecharSemanas, regua, chama, constancia, linhaSemanaPassada, encerrarPausa, marcarPausa, emPausa, proximoDiaDeEstudo, rotuloDias } from '../../js/nucleo/plano.js';
import { packs, novo, jogar, irPara } from './ajuda.mjs';

const base = (dias = {}) => Object.assign(E.vazio(), { perfil: E.normalizarPerfil({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25, metaSemana: 3 }), conjuntosAtivos: ['mat-fa'], dias });

test('d.2 · "dias estudados" é a contagem de dias com tentativa avaliada; o rótulo é sempre "N dias estudados"', () => {
  assert.equal(rotuloDias(1), '1 dia estudado');
  assert.equal(rotuloDias(24), '24 dias estudados');
  const c = constancia(base({ '2026-11-02': true, '2026-11-03': true }), '2026-11-18');
  assert.equal(c.rotulo, '2 dias estudados');
  assert.equal(constancia(base(), '2026-11-18').vazio, 'A régua ganha um traço a cada dia em que você responde pelo menos uma checagem, questão ou revisão.');
});
test('d.2 · semana com a meta só depois que termina; estudar na folga não conta para a meta; resultado gravado não muda', () => {
  // semana de 02/11: seg, ter e sáb (folga) → 2 dias na meta, 3 no total
  const st = base({ '2026-11-02': true, '2026-11-03': true, '2026-11-07': true, '2026-11-09': true, '2026-11-10': true, '2026-11-11': true });
  fecharSemanas(st, '2026-11-12');                       // a semana de 09/11 ainda não terminou
  assert.deepEqual(Object.keys(st.semanas), ['2026-11-02']);
  assert.deepEqual(st.semanas['2026-11-02'], { dias: 2, total: 3, meta: 3, cumprida: false });
  fecharSemanas(st, '2026-11-16');
  assert.equal(st.semanas['2026-11-09'].cumprida, true);
  st.perfil.metaSemana = 5;                              // mudar a meta depois não apaga marca nenhuma
  fecharSemanas(st, '2026-11-23');
  assert.equal(st.semanas['2026-11-09'].cumprida, true);
  const r = regua(st);
  assert.equal(r.length, 6);
  assert.deepEqual(r.filter(x => x.latao).map(x => x.dia), ['2026-11-11'], 'latão no último dia estudado da semana com a meta');
  assert.equal(r[4].longo, true, 'traço longo a cada 5 dias');
});
test('Decisão 3 · chama (B): acende na semana com a meta depois que ela termina e nunca apaga nem zera', () => {
  const st = base({ '2026-11-09': true, '2026-11-10': true, '2026-11-11': true });
  fecharSemanas(st, '2026-11-12');
  assert.equal(chama(st).acesa, false, 'durante a semana, nada');
  fecharSemanas(st, '2026-11-16');
  assert.equal(chama(st).acesa, true); assert.equal(chama(st).acesas, 1);
  fecharSemanas(st, '2027-01-10');                       // semanas sem estudo depois
  assert.equal(chama(st).acesa, true, 'faltar não apaga');
  assert.equal(chama(st).acesas, 1);
  assert.equal(constancia(st, '2027-01-10').rotulo, '3 dias estudados');
});
test('d.2 · linha do 1º dia estudado da semana nova, sem palavra negativa', () => {
  const st = base({ '2026-11-09': true, '2026-11-10': true, '2026-11-11': true, '2026-11-16': true });
  fecharSemanas(st, '2026-11-16');
  assert.equal(linhaSemanaPassada(st, '2026-11-16'), 'Semana passada: 3 dias estudados · meta cumprida');
  st.dias['2026-11-17'] = true;
  assert.equal(linhaSemanaPassada(st, '2026-11-17'), null, 'só no 1º dia estudado da semana');
  const st2 = base({ '2026-11-09': true, '2026-11-10': true, '2026-11-16': true });
  fecharSemanas(st2, '2026-11-16');
  assert.equal(linhaSemanaPassada(st2, '2026-11-16'), 'Semana passada: 2 dias estudados');
});
test('pausa de 1 a 14 dias: "nada vence por isso" (revisões e cards andam os dias da pausa)', () => {
  const st = base();
  st.topicos['mat-fa.c1'] = { caixa: 2, proxima: '2026-11-19', tentativas: [], rodadas: [] };
  st.cards.k = { caixa: 1, proxima: '2026-11-20', recebido: '2026-11-17', hist: [] };
  marcarPausa(st, 3, '2026-11-18');
  assert.equal(emPausa(st, '2026-11-20'), true); assert.equal(emPausa(st, '2026-11-21'), false);
  assert.equal(proximoDiaDeEstudo(st, '2026-11-18'), '2026-11-23');
  encerrarPausa(st, '2026-11-21');
  assert.equal(st.topicos['mat-fa.c1'].proxima, '2026-11-22');
  assert.equal(st.cards.k.proxima, '2026-11-23');
  assert.equal(st.pausa.ate, null);
});

for (const pk of await packs()) {
  const P = pk.nome;
  test(`[${P}] Hoje e Plano: pausa e folga como estados de Hoje; "Estudar mesmo assim" conta como dia estudado`, () => {
    const { n, rel } = novo(pk.dados);
    n.marcarPausa(3);
    assert.equal(n.hoje().estado, 'pausa');
    assert.equal(n.hoje().texto, 'Pausa até 20/11. Nada vence por isso.');
    n.despachar('ENCERRAR_PAUSA');
    assert.equal(n.hoje().estado, 'primeiroDia');
    irPara(n, rel, '2026-11-21');
    const h = n.hoje();
    assert.equal(h.estado, 'folga'); assert.equal(h.texto, 'Hoje é folga. Nada vence por isso.');
    assert.equal(h.acao.evento, 'ESTUDAR_MESMO_ASSIM');
    n.despachar('ESTUDAR_MESMO_ASSIM');
    jogar(n, rel); n.despachar('FECHAR');
    assert.equal(n.st.dias['2026-11-21'], true);
    irPara(n, rel, '2026-11-23');
    assert.equal(n.st.semanas['2026-11-16'].dias, 0, 'a folga não conta para a meta');
    assert.equal(n.st.semanas['2026-11-16'].total, 1);
  });
  test(`[${P}] Plano: agenda de 14 dias, prova e lembrete com os textos de c.9`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    const p = n.plano();
    assert.equal(p.prova.texto, 'Prova da escola (bimestral) · 15/12/2026 · faltam 27 dias');
    assert.equal(p.dias.texto, 'seg, ter, qua, qui · 25 min');
    assert.equal(p.meta.texto, '3 dias (opcional)');
    assert.equal(p.lembrete.texto, 'Prumo · seg, ter, qua, qui · 19:00');
    assert.equal(p.agenda.dias.length, 14);
    assert.equal(p.agenda.dias[0].texto, 'qua 18/11 · feito + Cap. 1 (novo)');
    assert.match(p.agenda.dias[1].texto, /^qui 19\/11 · revisão do Cap\. 1 \+ \d+ cards$/);
    assert.equal(p.agenda.dias[3].texto, 'sáb 21/11 · folga');
    assert.deepEqual(p.intervalos.porNivel.map(x => x.dias), [1, 2, 3, 4, 5]);
    assert.equal(p.constancia.linhaMeta, 'semanas com a meta: 0');
  });
  test(`[${P}] Ajustes: "Símbolo da constância: Chama · Régua", padrão Chama`, () => {
    const { n } = novo(pk.dados);
    assert.equal(n.ajustes().simbolo.valor, 'chama');
    assert.equal(n.ajustes().simbolo.rotulo, 'Símbolo da constância');
    n.definirSimbolo('regua');
    assert.equal(n.hoje().constancia.simbolo, 'regua');
    assert.equal(n.constancia().simbolo, 'regua');
  });
}
