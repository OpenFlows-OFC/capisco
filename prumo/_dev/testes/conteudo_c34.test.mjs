// Testes do conteúdo dos Caps. 3 e 4 (conteudo/mat-fa-c34.js, gerado por _dev/c34_build.mjs) e das
// regras do validador ligadas a eles, depois da revisão adversarial de 17/11/2026.
// Uso (de prototipo/capisco):  node --test prumo/_dev/testes/conteudo_c34.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const aqui = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(aqui, '../..');
const VALIDADOR = join(RAIZ, '_dev/valida_pack.mjs');
const temC34 = existsSync(join(RAIZ, 'conteudo/mat-fa-c34.js'));
const PACK_URL = pathToFileURL(join(RAIZ, 'conteudo/mat-fa.js')).href;
const pular = !temC34 && 'mat-fa-c34.js ainda não existe';

// Valida uma cópia do pack com uma alteração feita de propósito (mesmo mecanismo de conteudo_c12.test.mjs).
function validarComAlteracao(codigo) {
  const pasta = mkdtempSync(join(tmpdir(), 'prumo-teste-c34-'));
  const arq = join(pasta, 'pack.mjs');
  writeFileSync(arq, `import { pack as base } from '${PACK_URL}';
const pack = structuredClone(base);
const cap = id => pack.capitulos.find(x => x.id === id);
${codigo}
export { pack };
`);
  try {
    const r = spawnSync(process.execPath, [VALIDADOR], { encoding: 'utf8', env: { ...process.env, PRUMO_PACK: arq } });
    return { codigo: r.status, saida: (r.stdout || '') + (r.stderr || '') };
  } finally { rmSync(pasta, { recursive: true, force: true }); }
}

test('cards dos Caps. 3 e 4: cada um aponta para o § exato do próprio bloco', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const { Pack } = await import(pathToFileURL(join(RAIZ, 'js/nucleo/pack.js')).href);
  const P = new Pack(pack);
  const esperado = {
    'mat-fa.c3.k1': 'p. 5, § 1', 'mat-fa.c3.k2': 'p. 5, § 2', 'mat-fa.c3.k3': 'p. 5, § 3', 'mat-fa.c3.k4': 'p. 5, § 4',
    'mat-fa.c3.k5': 'p. 6, § 1', 'mat-fa.c3.k6': 'p. 6, § 2', 'mat-fa.c3.k7': 'p. 6, § 2', 'mat-fa.c3.k8': 'p. 6, § 3',
    'mat-fa.c4.k1': 'p. 7, § 1', 'mat-fa.c4.k2': 'p. 7, § 1', 'mat-fa.c4.k3': 'p. 7, § 2', 'mat-fa.c4.k4': 'p. 7, § 3',
    'mat-fa.c4.k5': 'p. 7, § 4', 'mat-fa.c4.k6': 'p. 8, § 2', 'mat-fa.c4.k7': 'p. 8, § 3', 'mat-fa.c4.k8': 'p. 8, § 4',
  };
  const cards = pack.capitulos.filter(c => c.id === 'mat-fa.c3' || c.id === 'mat-fa.c4').flatMap(c => c.cards);
  assert.equal(cards.length, 16);
  for (const k of cards) assert.equal(P.localDoCard(k).rotulo, esperado[k.id], k.id);
});

test('validador recusa card sem parágrafo', { skip: pular }, () => {
  const r = validarComAlteracao("delete cap('mat-fa.c3').cards[1].paragrafo;");
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /mat-fa\.c3\.k2.*card sem paragrafo/);
});

test('validador recusa card com parágrafo fora do bloco', { skip: pular }, () => {
  const r = validarComAlteracao("cap('mat-fa.c4').cards[0].paragrafo = 'mat-fa.p8.b1.s2';");
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /mat-fa\.c4\.k1.*parágrafo mat-fa\.p8\.b1\.s2 fora do bloco mat-fa\.p7\.b1/);
});

test('p. 7: pré-pergunta e checagem treinam a frase-armadilha da 2023 Q175', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const m = pack.modelos.find(x => x.id === 'mat-fa.p7.m');
  const [pre, checagem, v2] = m.variantes;
  for (const v of [pre, checagem]) {
    assert.match(v.enunciado, /preço de um salgado menos o de um suco é igual ao preço do suco mais/);
    const armadilha = v.alternativas.find(a => a.paragrafo === 'mat-fa.p7.b1.s2');
    assert.match(armadilha.falta, /salgado − suco = suco \+ R\$ [\d,]+, ou seja, salgado = 2 × suco/);
  }
  assert.match(v2.enunciado, /a mais que o dobro do preço de um suco/);
  // nenhuma frase começa com numeral
  for (const v of m.variantes) assert.doesNotMatch(v.enunciado, /\.\s+\d/);
});

test('questão de aplicar do Cap. 4: a resolução usa só subtrair as condições e substituir', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const m = pack.modelos.find(x => x.id === 'mat-fa.c4.ap');
  for (const v of m.variantes) {
    assert.doesNotMatch(v.explicacao, /Somando/);
    assert.match(v.explicacao, /Subtraindo um kit do outro/);
    assert.match(v.explicacao, /Substitua no kit 2/);
  }
});

test('lucro da p. 6: o diagnóstico de "custo − receita" acompanha o sinal do lucro', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const m = pack.modelos.find(x => x.id === 'mat-fa.p6.b2.m');
  const falta = v => v.alternativas.find(a => a.paragrafo === 'mat-fa.p6.b2.s4').falta;
  assert.match(falta(m.variantes[0]), /^Tirou o sinal/);                 // lucro −80: prejuízo
  assert.doesNotMatch(falta(m.variantes[1]), /tirou o sinal/i);          // lucro 60: tirar o sinal daria a certa
});
