import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Pack } from '../../js/nucleo/pack.js';
import { criarMotor } from '../../js/nucleo/motor.js';
import { montarMissao, regraDaFila, verARegra } from '../../js/nucleo/recomendador.js';
import { packs, novo, jogar, passo, responder, continuar, irPara } from './ajuda.mjs';

const D = '2026-11-18';                       // quarta-feira
const base = (extra = {}, perfil = {}) => Object.assign(E.vazio(), {
  perfil: E.normalizarPerfil(Object.assign({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25, metaSemana: 3 }, perfil)),
  conjuntosAtivos: ['mat-fa'],
}, extra);
const aberto = (caixa, proxima) => ({ caixa, proxima, tentativas: [{ item: 'x', dia: '2026-11-01', em: 1, res: 'ok' }], rodadas: [{ dia: '2026-11-01', venceu: true, tentativas: 3, de: 0, para: 1, tipo: 'novo' }] });
const todosAbertos = (prox = '2026-11-25', caixa = 2) => ({ 'mat-fa.c1': aberto(caixa, prox), 'mat-fa.c2': aberto(caixa, prox), 'mat-fa.c3': aberto(caixa, prox), 'mat-fa.c4': aberto(caixa, prox) });
const ids = t => t.map(x => x.id);

for (const pk of await packs()) {
  const P = pk.nome, pack = new Pack(pk.dados), M = criarMotor(pack.indiceMotor());
  const mm = (st, d = D, op) => { R.definirFonte(`${d}T19:00`); return montarMissao(st, pack, M, d, op); };

  test(`[${P}] f.1 · R8 abre o Cap. 1; cada regra numa linha própria da trilha; frase de "Por que esta missão?"`, () => {
    const m = mm(base());
    assert.equal(m.regra, 'R8'); assert.equal(m.cap, 'mat-fa.c1');
    assert.deepEqual(ids(m.trilha), ['R0', 'R1', 'R2', 'R3', 'R4', 'R5a', 'R5b', 'R7', 'R8']);
    assert.ok(m.trilha.slice(0, -1).every(x => !x.ok) && m.trilha[m.trilha.length - 1].ok);
    assert.equal(m.frase, 'Você ainda não abriu o Cap. 1, e hoje não tem revisão vencida.');
    const v = verARegra(base(), pack, M, m, D);
    // "ver a regra" sem códigos internos: numeradas na ordem em que valem, a que decidiu marcada "sim"
    assert.match(v.texto, /^1\. não: .* · 9\. sim: Cap\. 1 é o próximo liberado$/);
    assert.ok(!/R\d|P\d|aprendizado|intelig/i.test(JSON.stringify(v.linhas) + v.oQueE), 'nem código interno nem menção a IA');
    assert.deepEqual(v.regras.filter(r => r.decidiu).map(r => r.n), [9]);
    assert.match(v.questoes, /^Questões do Enem: 2023 Q162/);
    assert.deepEqual(mm(base()), m, 'determinístico: mesmo estado e mesma data, mesma missão');
  });
  test(`[${P}] b.3 · composição de R8: pré-pergunta antes de cada trecho cobrado, checagens, questões do Enem por b (2 no perfil de 15 min, 3 nos outros)`, () => {
    const m = mm(base());
    const t = m.passos.map(p => p.t);
    assert.equal(t[0], 'pre'); assert.equal(t[1], 'leitura');
    assert.ok(m.passos.filter(p => p.t === 'pre').length >= 3);
    const ap = m.passos.filter(p => p.papel === 'aplicar');
    assert.equal(ap.length, 3);
    const bs = ap.map(p => pack.item(p.id).dif); assert.deepEqual(bs, [...bs].sort((a, b) => a - b));
    assert.equal(mm(base({}, { minutos: 15 })).passos.filter(p => p.papel === 'aplicar').length, 2);
    assert.equal(regraDaFila(m.passos, 'mat-fa.c1').frase, '2 acertos seguidos, um deles numa questão do Enem');
    // cada bloco citado tem pré-pergunta logo antes dele
    for (const q of m.passos.filter(p => p.origem === 'enem')) for (const b of pack.item(q.id).blocos) {
      const ip = m.passos.findIndex(p => p.t === 'leitura' && p.blocos.includes(b));
      if (ip < 0) continue;
      const anterior = m.passos[ip - 1];
      const pg = pack.pagina(pack.paginaDoBloco(b));
      assert.equal(anterior.t, 'pre');
      if (pg.nucleo !== b) assert.equal(anterior.bloco, b);
    }
  });
  test(`[${P}] f.1 · perfil de 15 min: a revisão vencida vem antes do capítulo novo que não cabe junto; 25 min: a revisão atrasada vem primeiro`, () => {
    const st = { topicos: { 'mat-fa.c1': aberto(1, '2026-11-16') } };
    const m15 = mm(base(st, { minutos: 15 }));
    assert.equal(m15.regra, 'R8'); assert.equal(m15.tipo, 'revisoes');
    assert.equal(m15.passos.filter(p => p.t === 'revisao').length, 1, 'a revisão prometida não some');
    assert.ok(!m15.passos.some(p => p.t === 'leitura'), 'o capítulo novo fica para o próximo dia');
    assert.equal(m15.capAdiado, 'mat-fa.c2');
    assert.match(m15.frase, /^Hoje vence 1 revisão, e o Cap\. 2 não cabe junto nos seus 15 min\. A revisão vem primeiro; o Cap\. 2 fica para o próximo dia de estudo\.$/);
    assert.ok(m15.minutos <= 15);
    const m25 = mm(base(st));
    assert.equal(m25.passos[0].t, 'revisao'); assert.equal(m25.passos[0].atrasada, true);
  });
  test(`[${P}] f.1 · R1 pausa e R2 folga ("Estudar mesmo assim" segue para R3)`, () => {
    const p = mm(base({ pausa: { desde: D, ate: '2026-11-20' } }));
    assert.equal(p.regra, 'R1'); assert.equal(p.tipo, 'pausa'); assert.equal(p.passos.length, 0);
    const f = mm(base(), '2026-11-21');
    assert.equal(f.regra, 'R2'); assert.equal(f.tipo, 'folga'); assert.equal(f.frase, 'Hoje é folga no seu plano. Nada vence por isso.');
    const f2 = mm(base(), '2026-11-21', { estudarMesmoAssim: true });
    assert.equal(f2.regra, 'R8');
    assert.equal(f2.trilha.find(x => x.id === 'R2').ok, false);
  });
  test(`[${P}] f.1 · R3 modo retorno: revisões vencidas ≥ capacidade → só revisões, as mais atrasadas primeiro`, () => {
    const st = base({ topicos: { 'mat-fa.c1': aberto(1, '2026-11-16'), 'mat-fa.c2': aberto(2, '2026-11-12') } }, { minutos: 15 });
    const m = mm(st);
    assert.equal(m.regra, 'R3'); assert.equal(m.tipo, 'retorno'); assert.equal(m.retorno, true);
    assert.deepEqual(m.passos.filter(p => p.t === 'revisao').map(p => p.cap), ['mat-fa.c2', 'mat-fa.c1']);
    assert.ok(m.passos.every(p => p.t === 'revisao' || p.t === 'cards'));
  });
  test(`[${P}] g.8 · R4 sem revisão vencida → revisão antecipada do capítulo mais fraco; sem capítulo aberto, R8 abre o Cap. 1`, () => {
    const st = base({ topicos: { 'mat-fa.c1': aberto(2, '2026-11-25'), 'mat-fa.c2': aberto(1, '2026-11-25') } }, { prova: '2026-11-20' });
    const m = mm(st);
    assert.equal(m.regra, 'R4'); assert.equal(m.tipo, 'antecipada'); assert.equal(m.cap, 'mat-fa.c2');
    assert.ok(m.passos.length > 0 && m.passos.every(p => p.antecipada || p.t === 'cards'));
    assert.equal(m.frase, 'Reta final: faltam 2 dias; nada novo entra. Hoje: revisão antecipada do Cap. 2, o mais fraco.');
    const n = mm(base({}, { prova: '2026-11-20' }));
    assert.equal(n.regra, 'R8'); assert.equal(n.cap, 'mat-fa.c1');
    assert.equal(n.trilha.find(x => x.id === 'R4').txt, 'Nenhum capítulo aberto: reta final não se aplica');
  });
  test(`[${P}] g.8 · R0 nunca devolve missão vazia (prova passada)`, () => {
    const a = mm(base({ topicos: todosAbertos() }, { prova: '2026-11-01' }));
    assert.equal(a.regra, 'R0'); assert.ok(a.passos.length > 0); assert.equal(a.tipo, 'antecipada');
    const b = mm(base({ topicos: { 'mat-fa.c1': aberto(1, '2026-11-17') } }, { prova: '2026-11-01' }));
    assert.equal(b.regra, 'R0'); assert.equal(b.tipo, 'revisoes');
    const c = mm(base({}, { prova: '2026-11-01' }));
    assert.equal(c.regra, 'R8'); assert.ok(c.passos.length > 0);
  });
  test(`[${P}] f.1 · R5a (pré-requisito abaixo do nível 2 de 5), R5b (mesmo capítulo) e R7 (continuar)`, () => {
    const teto = { caixa: 0, proxima: null, tentativas: [{ item: 'enem-2019-143', dia: '2026-11-17', em: 1, res: 'erro', alt: 'A' }], rodadas: [{ dia: '2026-11-17', venceu: false, tentativas: 5, de: 0, para: 0, tipo: 'novo' }] };
    const a = mm(base({ topicos: { 'mat-fa.c1': aberto(2, '2026-11-25'), 'mat-fa.c2': aberto(1, '2026-11-25'), 'mat-fa.c3': teto } }));
    assert.equal(a.regra, 'R5a'); assert.equal(a.cap, 'mat-fa.c2');
    assert.match(a.frase, /^O Cap\. 3 bateu no teto na última rodada, e a base dele, o Cap\. 2, ainda está no nível 1 de 5\./);
    const b = mm(base({ topicos: { 'mat-fa.c1': aberto(2, '2026-11-25'), 'mat-fa.c2': aberto(2, '2026-11-25'), 'mat-fa.c3': teto } }));
    assert.equal(b.regra, 'R5b'); assert.equal(b.cap, 'mat-fa.c3'); assert.equal(b.passos[0].t, 'pre');
    const pratica = { caixa: 0, proxima: null, tentativas: [{ item: 'mat-fa.p1.m#1', dia: '2026-11-17', em: 1, res: 'ok', alt: 'A' }], rodadas: [], parouEm: 'mat-fa.p2' };
    const c = mm(base({ topicos: { 'mat-fa.c1': pratica } }));
    assert.equal(c.regra, 'R7'); assert.equal(c.passos[0].pagina, 'mat-fa.p2');
    assert.equal(c.frase, 'Você começou o Cap. 1 e ainda não venceu a rodada. Hoje ele continua pela p. 2, e hoje não tem revisão vencida.');
  });
  test(`[${P}] f.1 · R9: só revisões quando há vencidas; senão, Questão do dia (1 a 3 itens, nada sorteado)`, () => {
    const a = mm(base({ topicos: Object.assign(todosAbertos(), { 'mat-fa.c2': aberto(2, D) }) }));
    assert.equal(a.regra, 'R9'); assert.equal(a.tipo, 'revisoes');
    const b = mm(base({ topicos: todosAbertos() }));
    assert.equal(b.regra, 'R9'); assert.equal(b.tipo, 'questaoDoDia');
    const dia = b.passos.filter(p => p.t === 'dia');
    assert.ok(dia.length >= 1 && dia.length <= 3);
    assert.ok(dia.every(p => !pack.questao(p.id)), 'sem questão do Enem inédita na Questão do dia');
    assert.equal(b.frase, 'Nada vence hoje: a missão é a Questão do dia, com questões dos capítulos que você já abriu.');
  });

  test(`[${P}] g.8 · R5b sem questão do Enem inédita: a regra diz "do Enem ou da equipe" e vencer com duas questões da equipe é coerente`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { decidir: p => (p.t === 'pre' || p.inserido ? 'certa' : 'errada') });
    assert.equal(n.st.missao.resumo.rodadas[0].venceu, false);
    for (const id of pack.capitulo('mat-fa.c1').rodada) assert.ok(n.st.vistos[id], `${id} visto`);
    n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    assert.equal(n.st.missao.regra, 'R5b');
    const ap = n.st.missao.passos.filter(p => p.papel === 'aplicar' && p.t === 'questao');
    assert.ok(ap.length && ap.every(p => p.origem === 'equipe'));
    assert.equal(n.hoje().bloco.ganho, 'Acerte duas seguidas, uma delas numa questão de aplicar (do Enem ou da equipe): o capítulo Parte fixa e parte que varia entra no nível 1 de 5.');
    // erra as checagens e vence com duas questões da equipe no papel de aplicar
    jogar(n, rel, { decidir: p => (p.t === 'checagem' ? 'errada' : 'certa'), parar: x => x.estado() === 'pergunta' && passo(x).papel === 'aplicar' && passo(x).t === 'questao' });
    assert.equal(n.tela().vm.topo.medidor.texto, 'Para fechar: 2 certas seguidas, faltam 2');
    responder(n, 'certa'); continuar(n, rel);
    assert.equal(n.tela().vm.topo.medidor.texto, 'Para fechar: 2 certas seguidas, falta 1');
    responder(n, 'certa');
    assert.equal(n.st.topicos['mat-fa.c1'].caixa, 1, '4 + 4 = 8: venceu com duas questões da equipe');
  });

  test(`[${P}] g.8 · R5a pelo motor: o capítulo que bate no teto manda a prática para o pré-requisito no nível 1 de 5`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');                                     // qua 18: Cap. 1
    irPara(n, rel, '2026-11-19'); jogar(n, rel); n.despachar('FECHAR');       // qui 19: Cap. 2 + revisão do Cap. 1
    irPara(n, rel, '2026-11-23');                                            // seg 23: Cap. 3 (revisão do Cap. 2 errada, rodada no teto)
    assert.equal(n.st.missao.regra, 'R8'); assert.equal(n.st.missao.cap, 'mat-fa.c3');
    jogar(n, rel, { decidir: p => (p.t === 'pre' || p.inserido ? 'certa' : p.cap === 'mat-fa.c1' ? 'certa' : 'errada') });
    n.despachar('FECHAR');
    assert.equal(n.st.topicos['mat-fa.c2'].caixa, 1);
    assert.ok(n.st.topicos['mat-fa.c1'].caixa >= 2);
    irPara(n, rel, '2026-11-24');
    assert.equal(n.st.missao.regra, 'R5a');
    assert.equal(n.st.missao.cap, 'mat-fa.c2');
  });
}
