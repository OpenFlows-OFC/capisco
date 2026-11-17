import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Pack } from '../../js/nucleo/pack.js';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import { gerarExemplo } from '../../js/nucleo/exemplo.js';
import { packs, novo } from './ajuda.mjs';

// uma semana inteira de "hoje": o exemplo tem de funcionar em qualquer dia
const DIAS = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22', '2027-03-03'];

for (const pk of await packs()) {
  const P = pk.nome, pack = new Pack(pk.dados);
  for (const T of DIAS) {
    test(`[${P}] Decisão 5 · estado de exemplo relativo a hoje = ${T}: consistente e com tudo o que a banca precisa ver`, () => {
      R.definirFonte(`${T}T08:00`);
      const st = gerarExemplo(pack, T);
      assert.equal(R.hoje(), T, 'o relógio é devolvido depois da simulação');
      // forma e plano
      assert.equal(st.app, 'prumo'); assert.equal(st.versao, 2);
      assert.deepEqual(E.normalizar(JSON.parse(JSON.stringify(st))), st, 'o estado já está normalizado');
      assert.equal(st.perfil.minutos, 15); assert.equal(st.perfil.provaTipo, 'escola');
      assert.equal(st.perfil.prova, R.addDias(T, 28));
      assert.ok(st.perfil.dias.includes(R.diaDaSemana(T)), 'hoje é dia de estudo');
      assert.equal(st.config.demo.ativo, true); assert.equal(st.config.demo.exemplo, true);
      // três semanas que terminam ontem
      const dias = Object.keys(st.dias).sort();
      assert.ok(dias[0] >= R.addDias(T, -21) && dias[dias.length - 1] < T);
      for (const t of Object.values(st.topicos)) for (const x of t.tentativas) assert.ok(x.dia < T && st.dias[x.dia], 'toda tentativa num dia estudado do passado');
      // consistência por construção: o nível de cada capítulo é o "para" da última rodada
      for (const t of Object.values(st.topicos)) assert.equal(t.caixa, t.rodadas[t.rodadas.length - 1].para);
      // 1ª revisão com "antes x depois"
      const reveladas = Object.entries(st.pre).filter(([, x]) => x.revelado);
      assert.ok(reveladas.length >= 2);
      for (const [id, x] of reveladas) assert.ok(st.topicos[x.cap].tentativas.some(y => y.item === id && y.dia === x.revelado && y.tipo === 'revisao'));
      // uma revisão errada que volta o Cap. 1 para Aprendendo
      assert.ok(st.topicos['mat-fa.c1'].rodadas.some(r => r.tipo === 'revisao' && !r.venceu && r.de >= 2 && r.para === 1));
      // caderno de erros com a Q168
      assert.ok(st.erros.some(e => e.item === 'enem-2019-168' && e.tipo === 'revisao' && e.marcou));
      // constância com semanas de meta
      assert.ok(Object.values(st.semanas).filter(w => w.cumprida).length >= 1);
      // cards em várias caixas
      assert.ok(new Set(Object.values(st.cards).map(c => c.caixa)).size >= 3);
      // uma Prova feita (e vencida)
      assert.equal(st.chefes['mat-fa'].venceu, true);
      assert.ok(st.marcos['m.prova']);
      // hoje: a missão tem revisão atrasada
      const s = E.memoria({ prumo: JSON.stringify(st) });
      const n = new Nucleo({ pack: pk.dados, storage: s });
      const t = n.abrir();
      assert.equal(t.nome, 'hoje');
      assert.match(t.vm.bloco.atrasada, /^(1 revisão atrasada vem primeiro|\d+ revisões atrasadas vêm primeiro)\.$/);
      assert.equal(t.faixas.demo.texto, 'Modo demonstração · dados de exemplo');
      assert.ok(n.sumario().capitulos.every(c => c.antesDepois), 'o "antes x depois" fica no Sumário');
      assert.equal(n.sumario().prova.trofeu.ganho, true);
    });
  }

  test(`[${P}] Decisão 5 · "Ver com dados de exemplo" no Primeiro uso e "Sair" volta ao Primeiro uso`, () => {
    const { n } = novo(pk.dados, { perfil: null });
    assert.equal(n.primeiroUso().exemplo.rotulo, 'Ver com dados de exemplo');
    const t = n.carregarExemplo();
    assert.equal(t.nome, 'hoje');
    assert.equal(t.faixas.demo.sair, 'Sair');
    const t2 = n.sairDaDemonstracao();
    assert.equal(t2.nome, 'primeiroUso');
  });
  test(`[${P}] Decisão 5 · com um progresso real, o exemplo não apaga nada: "Sair" devolve o estado real`, () => {
    const { n } = novo(pk.dados);
    n.despachar('COMECAR');
    const real = JSON.stringify(n.st.missao.passos);
    n.carregarExemplo();
    assert.ok(n.st.config.demo.guardado);
    assert.ok(!JSON.parse(n.copia().conteudo).estado.config.demo.guardado, 'a cópia não leva o estado guardado');
    n.sairDaDemonstracao();
    assert.equal(JSON.stringify(n.st.missao.passos), real);
    assert.equal(n.st.config.demo.ativo, false);
  });
  test(`[${P}] modo demonstração: "avançar 1 dia" faz a virada de data`, () => {
    const { n } = novo(pk.dados);
    n.carregarExemplo();
    const t = n.avancarDias(1);
    assert.equal(n.st.missao.dia, R.addDias('2026-11-18', 1));
    assert.match(t.faixas.demo.dataSimulada, /^data simulada \d\d\/\d\d$/);
    R.setOffset(0);
  });
}
