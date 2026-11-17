import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../../js/nucleo/estado.js';
import { packs, novo, jogar } from './ajuda.mjs';

const CAPISCO = { versao: 1, perfil: { nome: 'Davi', prova: '2026-12-01', provaNome: 'ENEM', criado: '2026-10-01', ritmo: 3 }, ajustes: { som: true }, conjuntosAtivos: ['bio-genetica'], topicos: {}, sessoes: [], dias: {}, roupas: [], chefes: {} };

test('estado vazio tem os campos de e.4 (com cards) e nada de minutos, sessões ou identificação', () => {
  const v = E.vazio();
  for (const k of ['app', 'versao', 'perfil', 'conjuntosAtivos', 'pausa', 'topicos', 'pre', 'vistos', 'missao', 'dias', 'notas', 'erros', 'marcos', 'chefes', 'selos', 'config', 'cards'])
    assert.ok(k in v, k);
  assert.equal(v.app, 'prumo'); assert.equal(v.versao, 2);
  assert.ok(!('sessoes' in v) && !('minutosHoje' in v) && !('nome' in v));
  assert.equal(E.CHAVE, 'prumo');
});
test('migração dentro da versão 2: campos que faltam são preenchidos; prova null continua null', () => {
  const st = E.normalizar({ app: 'prumo', versao: 2, perfil: { provaTipo: 'naosei', prova: null, dias: [1, 3, 5], minutos: 15 } });
  assert.equal(st.perfil.prova, null);
  assert.deepEqual(st.cards, {}); assert.deepEqual(st.semanas, {});
  assert.equal(st.config.simboloConstancia, 'chama');
  assert.equal(st.perfil.metaSemana, 2);
});
test('g.8 · restaurar recusa o arquivo do Capisco e arquivo de outra versão', () => {
  assert.throws(() => E.lerCopia(JSON.stringify(CAPISCO)), err => err instanceof E.ErroCopia && err.message === E.MSG_COPIA_INVALIDA);
  assert.throws(() => E.lerCopia(JSON.stringify({ app: 'prumo', versao: 3, perfil: {} })), E.ErroCopia);
  assert.throws(() => E.lerCopia('isto não é json'), E.ErroCopia);
  assert.throws(() => E.lerCopia(JSON.stringify({ assinatura: 'outra coisa', app: 'prumo', versao: 2, estado: {} })), E.ErroCopia);
});
test('salvar não engole o erro: a falha de cota vira aviso para a tela', () => {
  const cheio = { getItem: () => null, setItem: () => { const e = new Error('cheio'); e.name = 'QuotaExceededError'; throw e; }, removeItem() {} };
  const r = E.salvar(E.vazio(), cheio);
  assert.equal(r.ok, false); assert.equal(r.erro, 'QuotaExceededError'); assert.equal(r.mensagem, E.MSG_FALHA_SALVAR);
});

for (const pk of await packs()) {
  test(`[${pk.nome}] g.8 · salvar uma cópia e restaurá-la devolve o estado (pelo Primeiro uso e pelos Ajustes)`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel);
    n.despachar('FECHAR');
    const c = n.copia();
    assert.equal(c.nome, 'prumo-copia-2026-11-18.json');
    const env = JSON.parse(c.conteudo);
    assert.equal(env.assinatura, E.ASSINATURA); assert.equal(env.app, 'prumo'); assert.equal(env.versao, 2);
    assert.equal(env.pack.id, 'mat-fa');
    assert.equal(n.st.config.ultimaCopia, '2026-11-18');
    const outro = novo(pk.dados, { perfil: null });
    assert.equal(outro.n.estado(), 'primeiroUso');
    assert.equal(outro.n.despachar({ tipo: 'RESTAURAR_COPIA', texto: c.conteudo }), true);
    assert.equal(outro.n.estado(), 'feito');
    assert.deepEqual(outro.n.st.topicos, n.st.topicos);
    assert.deepEqual(outro.n.st.dias, n.st.dias);
    const terceiro = novo(pk.dados);
    assert.equal(terceiro.n.restaurar(c.conteudo).ok, true);
    assert.deepEqual(terceiro.n.st.erros, n.st.erros);
  });
  test(`[${pk.nome}] g.8 · arquivo do Capisco recusado pelo Primeiro uso e pelos Ajustes, sem mudar nada`, () => {
    const { n } = novo(pk.dados);
    const antes = JSON.stringify(n.st);
    const r = n.restaurar(JSON.stringify(CAPISCO));
    assert.equal(r.ok, false); assert.equal(r.mensagem, E.MSG_COPIA_INVALIDA);
    assert.equal(JSON.stringify(n.st), antes);
    const p = novo(pk.dados, { perfil: null });
    assert.throws(() => p.n.despachar({ tipo: 'RESTAURAR_COPIA', texto: JSON.stringify(CAPISCO) }), E.ErroCopia);
    assert.equal(p.n.estado(), 'primeiroUso');
  });
  test(`[${pk.nome}] CSV de tentativas: cabeçalho de e.4 e uma linha por tentativa`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel);
    const csv = n.csv();
    assert.equal(csv.nome, 'prumo-tentativas.csv');
    const linhas = csv.conteudo.replace(/^﻿/, '').trim().split('\r\n');
    assert.equal(linhas[0], 'dia;capítulo;item;tipo;resposta;resultado;primeiraVez');
    const total = Object.values(n.st.topicos).reduce((s, t) => s + t.tentativas.length, 0);
    assert.equal(linhas.length - 1, total);
    assert.match(linhas[1], /^2026-11-18;Cap\. 1;/);
  });
  test(`[${pk.nome}] o estado é salvo a cada transição na chave "prumo"; apagar tudo volta ao Primeiro uso`, () => {
    const { n, storage } = novo(pk.dados);
    n.despachar('COMECAR');
    assert.equal(JSON.parse(storage.getItem('prumo')).missao.estado, 'pergunta');
    assert.equal(storage.getItem('capisco.v1'), null);
    n.apagarTudo();
    assert.equal(storage.getItem('prumo'), null);
    assert.equal(n.estado(), 'primeiroUso');
  });
}
