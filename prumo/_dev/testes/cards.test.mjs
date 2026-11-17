import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Pack } from '../../js/nucleo/pack.js';
import { maoDoDia, receberCards, responderCard, novaMao, avancarMao, resumoMao, MAO_MAX } from '../../js/nucleo/cards.js';
import { intervalos } from '../../js/nucleo/motor.js';
import { packs, novo, jogar, irPara } from './ajuda.mjs';

const base = () => Object.assign(E.vazio(), { perfil: E.normalizarPerfil({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25 }), conjuntosAtivos: ['mat-fa'] });

for (const pk of await packs()) {
  const P = pk.nome, pack = new Pack(pk.dados);

  test(`[${P}] Decisão 1 · o baralho recebe os cards do capítulo quando a 1ª rodada termina (não antes)`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && x.st.missao.passos[x.st.missao.i].t === 'questao' });
    assert.deepEqual(n.st.cards, {}, 'durante a rodada, nada no baralho');
    jogar(n, rel);
    assert.equal(Object.keys(n.st.cards).length, pack.cardsDe('mat-fa.c1').length);
    for (const c of Object.values(n.st.cards)) { assert.equal(c.caixa, 1); assert.equal(c.proxima, '2026-11-19'); }
    assert.ok(n.prontoPorHoje().mudancas.some(x => /^Os \d+ cards do Cap\. 1 entraram no seu baralho\.$/.test(x.texto)));
  });

  test(`[${P}] Decisão 1 · a mão é um passo anunciado em Hoje ("Cards: N cards para lembrar"), no máximo 8, vencidos e caixa mais baixa primeiro`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    const h = n.hoje();
    const linha = h.bloco.passos.find(p => p.texto.startsWith('Cards: '));
    assert.match(linha.texto, /^Cards: \d+ cards para lembrar$/);
    assert.match(h.bloco.composicao, /(^| e )\d+ cards\.$/, 'composição em frase, sem cadeia de pontos');
    assert.ok(!/·|≈/.test(h.bloco.composicao));
    // ordem: atrasados antes dos de hoje, caixa mais baixa primeiro, determinística
    const st = base();
    receberCards(st, pack, 'mat-fa.c1', '2026-11-10');
    receberCards(st, pack, 'mat-fa.c2', '2026-11-17');
    const ids1 = pack.cardsDe('mat-fa.c1').map(k => k.id), ids2 = pack.cardsDe('mat-fa.c2').map(k => k.id);
    st.cards[ids1[0]].caixa = 3;
    const mao = maoDoDia(st, pack, '2026-11-18');
    assert.ok(mao.length <= MAO_MAX);
    assert.equal(mao[0], ids1[1], 'o atrasado de caixa mais baixa vem primeiro');
    assert.ok(mao.indexOf(ids1[0]) < mao.indexOf(ids2[0]) || mao.indexOf(ids2[0]) === -1, 'atrasados antes dos de hoje');
    assert.deepEqual(maoDoDia(st, pack, '2026-11-18'), mao, 'nada sorteado');
  });

  test(`[${P}] Decisão 1 · Leitner dos cards: "Lembrei" sobe uma caixa, "Ainda não" recua uma (mínimo 1), intervalos do plano`, () => {
    const st = base();
    R.definirFonte('2026-11-18');
    receberCards(st, pack, 'mat-fa.c1', '2026-11-17');
    const [a, b] = pack.cardsDe('mat-fa.c1').map(k => k.id);
    const iv = intervalos(st, '2026-11-18');
    responderCard(st, a, 'lembrei', '2026-11-18');
    assert.equal(st.cards[a].caixa, 2); assert.equal(st.cards[a].proxima, R.addDias('2026-11-18', iv[2]));
    responderCard(st, b, 'ainda', '2026-11-18');
    assert.equal(st.cards[b].caixa, 1); assert.equal(st.cards[b].proxima, R.addDias('2026-11-18', iv[1]));
    st.cards[a].caixa = 4;
    responderCard(st, a, 'ainda', '2026-11-18');
    assert.equal(st.cards[a].caixa, 3);
  });

  test(`[${P}] Decisão 1 · "Ainda não" mostra "Ver o parágrafo N da p. P" e o card volta UMA vez no fim da mesma mão; resumo informativo`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    jogar(n, rel, { parar: x => x.estado() === 'cards' });
    const mao0 = n.st.missao.mao.fila.slice();
    const primeiro = mao0[0];
    let t = n.tela();
    assert.equal(t.vm.virado, false); assert.equal(t.vm.acoes[0].evento, 'VIRAR');
    assert.equal(n.despachar('LEMBREI'), false, 'antes de virar, não se responde');
    n.despachar('VIRAR');
    n.despachar('AINDA_NAO');
    t = n.tela();
    assert.match(t.vm.pendente.trecho.rotulo, /^Ver o parágrafo \d+ da p\. \d+$/);
    assert.equal(t.vm.pendente.texto, 'Ainda não. Este card volta uma vez no fim desta mão.');
    n.despachar('VER_TRECHO'); assert.equal(n.estado(), 'trechoCard'); n.despachar('VOLTAR');
    n.despachar('SEGUIR');
    const caixa1 = n.st.cards[primeiro].caixa;
    for (let g = 0; g < 40 && n.estado() === 'cards'; g++) {
      const mao = n.st.missao.mao;
      if (mao.pendente) { n.despachar('SEGUIR'); continue; }
      if (!mao.virado) { n.despachar('VIRAR'); continue; }
      n.despachar(mao.fila[mao.i] === primeiro ? 'AINDA_NAO' : 'LEMBREI');
    }
    const m = n.st.missao;
    assert.equal(m.mao.fila.filter(x => x === primeiro).length, 2, 'volta uma vez só');
    assert.equal(n.st.cards[primeiro].caixa, caixa1, 'a volta do fim da mão não mexe na caixa de novo');
    const resumo = m.resumo.cards.texto;
    assert.match(resumo, new RegExp(`^Você lembrou ${mao0.length - 1} de ${mao0.length} cards\\. O outro volta em \\S+ \\d\\d/\\d\\d\\.$`));
    assert.equal(n.estado(), 'encerramento');
    assert.ok(n.prontoPorHoje().mudancas.some(x => x.texto === resumo));
    n.despachar('FECHAR');
    assert.equal(n.despachar('VIRAR'), false, 'depois do Pronto por hoje, nenhuma mão nova no mesmo dia');
  });

  test(`[${P}] Decisão 1 · aba "Cards" do Caderno: frente, verso, caixa pelo nome e próxima data; sem cards antes da 1ª rodada`, () => {
    const { n, rel } = novo(pk.dados);
    let c = n.cardsDoCaderno();
    assert.equal(c.capitulos[0].cards.length, 0);
    assert.equal(c.capitulos[0].aviso, 'Os cards deste capítulo entram no seu baralho quando a primeira rodada dele terminar.');
    jogar(n, rel);
    c = n.cardsDoCaderno();
    const k = c.capitulos[0].cards[0];
    assert.ok(k.frente && k.verso);
    assert.equal(k.caixaNome, 'Aprendendo');
    assert.equal(k.proximaTexto, 'qui 19/11');
    assert.match(k.trecho.rotulo, /^Ver o parágrafo \d+ da p\. \d+$/);
    assert.equal(c.aviso, 'Consultar é leitura livre; jogar, só na missão.');
  });

  test(`[${P}] Decisão 1 · cards no JSON, no CSV e na restauração`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    jogar(n, rel, { cards: () => 'ainda' });
    const copia = JSON.parse(n.copia().conteudo);
    assert.ok(Object.keys(copia.estado.cards).length > 0);
    assert.match(n.csv().conteudo, /;card;ainda não;ainda não;/);
    const o = novo(pk.dados, { perfil: null });
    o.n.despachar({ tipo: 'RESTAURAR_COPIA', texto: n.copia().conteudo });
    assert.deepEqual(o.n.st.cards, n.st.cards);
  });

  test(`[${P}] Decisão 1 · teste das três perguntas: mão finita, sem pontos e sem moeda`, () => {
    const st = base();
    receberCards(st, pack, 'mat-fa.c1', '2026-11-17');
    const ids = maoDoDia(st, pack, '2026-11-18');
    const mao = novaMao(ids);
    for (const id of ids) { avancarMao(mao, id, 'ainda'); }
    for (let g = 0; g < 20 && !mao.fim; g++) avancarMao(mao, mao.fila[mao.i], 'ainda');
    assert.equal(mao.fim, true);
    assert.equal(mao.fila.length, ids.length * 2, 'cada card volta uma vez e a mão acaba');
    const r = resumoMao(st, mao, '2026-11-18');
    assert.ok(!/ponto|moeda|XP/i.test(r.texto));
  });
}
