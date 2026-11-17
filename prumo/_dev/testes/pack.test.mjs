import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Pack, carregarPack, maiorSequenciaComum, contarPalavras, compilar } from '../../js/nucleo/pack.js';
import { pack as fixture } from './fixture-pack.mjs';
import { packs } from './ajuda.mjs';

const clone = o => JSON.parse(JSON.stringify(o));

for (const pk of await packs()) {
  test(`[${pk.nome}] o pack passa nas checagens do build`, () => {
    const r = new Pack(pk.dados).checar();
    assert.deepEqual(r.erros, [], r.erros.join('\n'));
  });
  test(`[${pk.nome}] g.8 · toda questão do Enem traz a atribuição com o link da licença`, () => {
    const p = new Pack(pk.dados);
    for (const q of pk.dados.questoes) {
      const it = p.item(q.id);
      assert.match(it.rodape, /creativecommons\.org\/licenses\/by-nd\/3\.0/);
      assert.equal(it.licencaUrl, 'https://creativecommons.org/licenses/by-nd/3.0/legalcode');
      assert.equal(it.alternativas.filter(a => a.certa).length, 1);
    }
  });
  test(`[${pk.nome}] variantes da equipe: 5 alternativas distintas, ordem determinística, id "modelo#linha"`, () => {
    const p = new Pack(pk.dados), p2 = new Pack(pk.dados);
    for (const m of pk.dados.modelos) for (let k = 0; k < m.linhas.length; k++) {
      const v = p.item(`${m.id}#${k}`), v2 = p2.item(`${m.id}#${k}`);
      assert.equal(v.id, `${m.id}#${k}`);
      assert.equal(v.alternativas.length, 5);
      assert.equal(new Set(v.alternativas.map(a => a.texto)).size, 5);
      assert.deepEqual(v.alternativas, v2.alternativas, 'mesma entrada, mesma variante');
      assert.equal(v.alternativas.filter(a => a.certa).length, 1);
    }
  });
  test(`[${pk.nome}] Decisão 1: 6 a 8 cards por capítulo, frente até 14 palavras, verso até 25, âncora válida`, () => {
    const p = new Pack(pk.dados);
    for (const c of p.capitulos) {
      assert.ok(c.cards.length >= 6 && c.cards.length <= 8, `${c.id}: ${c.cards.length} cards`);
      for (const k of c.cards) {
        assert.ok(contarPalavras(k.frente) <= 14, k.id);
        assert.ok(contarPalavras(k.verso) <= 25, k.id);
        assert.ok(p.bloco(k.bloco), k.id);
        assert.match(p.localDoCard(k).rotulo, /^p\. \d+, § \d+$/);
      }
    }
  });
  test(`[${pk.nome}] g.8 · créditos: cada item com a licença; "rascunho por IA, revisão pendente"; terceiros da Q150`, () => {
    const c = new Pack(pk.dados).creditos();
    assert.ok(c.itens.length > 0);
    for (const i of c.itens) assert.ok(i.licenca, `${i.id} sem licença`);
    assert.ok(c.itens.some(i => /rascunho por IA.*revisão pendente/.test(i.autoria)));
    assert.ok(!c.itens.some(i => /rascunho por IA \(true/.test(i.autoria)));
    if (pk.nome === 'mat-fa.js') {
      const q150 = c.itens.find(i => i.id === 'enem-2023-150');
      assert.ok(q150 && q150.terceiros, 'a linha de terceiros da Q150 vai para os créditos');
    }
  });
}

test('g.8 · o build recusa um pack com bloco citado em questaoEnem.blocos sem pré-pergunta', () => {
  const d = clone(fixture);
  delete d.capitulos[0].paginas[1].blocos[1].prePergunta;           // § 4 da p. 2, citado pela 2023 Q150
  const r = new Pack(d).checar();
  assert.equal(r.ok, false);
  assert.ok(r.erros.some(e => /mat-fa\.p2\.b2.*não tem pré-pergunta/.test(e)), r.erros.join('\n'));
  assert.throws(() => carregarPack(d, { exigirValido: true }), /Pack recusado/);
});
test('g.8 · o build recusa um modelo com 6 ou mais palavras seguidas em comum com a questão ligada', () => {
  const d = clone(fixture);
  d.modelos.find(m => m.id === 'mat-fa.p2.m').enunciado = 'Uma empresa tem diversos funcionários. Um deles é o gerente, que recebe R$ {F} por semana, e há {d} dias de {v} para {quem}.';
  const r = new Pack(d).checar();
  assert.equal(r.ok, false);
  assert.ok(r.erros.some(e => /mat-fa\.p2\.m: \d+ palavras seguidas em comum com enem-2019-168/.test(e)), r.erros.join('\n'));
});
test('Decisão 1 · o build recusa card longo, card com 6 palavras seguidas do Enem e capítulo com menos de 6 cards', () => {
  const d = clone(fixture);
  d.capitulos[0].cards[0].frente = 'um dois três quatro cinco seis sete oito nove dez onze doze treze quatorze quinze';
  d.capitulos[0].cards[1].verso = 'Uma empresa tem diversos funcionários. Um deles é o gerente.';
  d.capitulos[1].cards.pop();
  const r = new Pack(d).checar();
  assert.ok(r.erros.some(e => /frente com mais de 14 palavras/.test(e)));
  assert.ok(r.erros.some(e => /mat-fa\.c1\.k2: \d+ palavras seguidas em comum com enem-2019-168/.test(e)));
  assert.ok(r.erros.some(e => /mat-fa\.c2: precisa de 6 a 8 cards/.test(e)));
});
test('d.6 · o build confere o distrator: a expr tem de reproduzir a alternativa em X = 3, 5 e 8', () => {
  const d = clone(fixture);
  d.questoes.find(q => q.id === 'enem-2019-168').alternativas[0].expr = '80*X+1000';
  const r = new Pack(d).checar();
  assert.ok(r.erros.some(e => /enem-2019-168, alternativa A: expr .* não reproduz/.test(e)), r.erros.join('\n'));
});
test('d.6 · os distratores da 2019 Q168 (e.3) passam no teste', () => {
  assert.equal(compilar('160X + 840', { implicita: true })({ X: 3 }), 1320);
  assert.ok(!new Pack(fixture).checar().erros.some(e => /enem-2019-168/.test(e)));
});
test('maior sequência comum ignora acentos e maiúsculas', () => {
  assert.equal(maiorSequenciaComum('A Função afim é útil', 'a funcao AFIM e util').n, 5);
});
test('e.3 · modelo da van, linha 0: certa 210X + 690 e as quatro erradas do texto', () => {
  const v = new Pack(fixture).item('mat-fa.p2.m#0');
  assert.deepEqual(v.alternativas.map(a => a.texto).sort(), ['Y = 210X + 690', 'Y = 210X + 900', 'Y = 70X + 830', 'Y = 70X + 900', 'Y = 70X + 970'].sort());
  assert.equal(v.alternativas.find(a => a.certa).texto, 'Y = 210X + 690');
});
