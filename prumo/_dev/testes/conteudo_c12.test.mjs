// Testes do conteúdo dos Caps. 1 e 2 e do validador do pack (e.6).
// Uso (de prototipo/capisco):  node --test prumo/_dev/testes/conteudo_c12.test.mjs
// Cada teste "recusa" altera de propósito uma cópia do pack e confere que valida_pack.mjs sai com
// código 1 e diz o motivo certo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, unlinkSync, existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const aqui = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(aqui, '../..');
const VALIDADOR = join(RAIZ, '_dev/valida_pack.mjs');
const temC34 = existsSync(join(RAIZ, 'conteudo/mat-fa-c34.js'));
const PACK_URL = pathToFileURL(join(RAIZ, 'conteudo/mat-fa.js')).href;

function validar(args = [], env = {}) {
  const r = spawnSync(process.execPath, [VALIDADOR, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { codigo: r.status, saida: (r.stdout || '') + (r.stderr || '') };
}
// Escreve um módulo temporário que clona o pack, aplica a alteração e exporta o resultado.
function comAlteracao(codigo) {
  const pasta = mkdtempSync(join(tmpdir(), 'prumo-teste-'));
  const arq = join(pasta, 'pack.mjs');
  writeFileSync(arq, `import { pack as base } from '${PACK_URL}';
const pack = structuredClone(base);
const q = id => pack.questoes.find(x => x.id === id);
const cap = id => pack.capitulos.find(x => x.id === id);
const bloco = id => pack.capitulos.flatMap(c => c.paginas).flatMap(p => p.blocos).find(b => b.id === id);
${codigo}
export { pack };
`);
  try { return validar([], { PRUMO_PACK: arq }); } finally { unlinkSync(arq); rmSync(pasta, { recursive: true, force: true }); }
}

test('Caps. 1 e 2 passam no validador (--so-c12)', () => {
  const r = validar(['--so-c12']);
  assert.equal(r.codigo, 0, r.saida);
  assert.match(r.saida, /ACEITO: 0 erros/);
  assert.match(r.saida, /48\/48 variantes iguais/);
});

test('pack completo passa no validador', { skip: !temC34 && 'mat-fa-c34.js ainda não existe' }, () => {
  const r = validar();
  assert.equal(r.codigo, 0, r.saida);
});

test('conteúdo dos Caps. 1 e 2: estrutura de g.2', async () => {
  if (!temC34) return;
  const { pack } = await import(PACK_URL);
  const [c1, c2] = pack.capitulos;
  assert.deepEqual(c1.rodada, ['enem-2023-162', 'enem-2023-150', 'enem-2019-168']);
  assert.deepEqual(c1.reserva, ['enem-2021-141']);
  assert.deepEqual(c2.rodada, ['enem-2023-156', 'enem-2020-164', 'enem-2023-151']);
  assert.deepEqual(pack.capitulos.find(c => c.id === 'mat-fa.c3').prereq, ['mat-fa.c1', 'mat-fa.c2']);
  assert.deepEqual(pack.capitulos.find(c => c.id === 'mat-fa.c4').prereq, ['mat-fa.c1']);
  const meus = pack.modelos.filter(m => /^mat-fa\.p[1-4]\./.test(m.id));
  assert.equal(meus.length, 6);                                              // 4 de página e 2 de bloco
  assert.equal(meus.filter(m => m.tipo === 'pagina').every(m => m.variantes.length === 11), true);
  assert.equal(meus.filter(m => m.tipo === 'bloco').every(m => m.variantes.length === 2), true);
  // e.3: a linha 0 do modelo da p. 2 é a do exemplo da especificação
  const v = pack.modelos.find(m => m.id === 'mat-fa.p2.m').variantes[0];
  assert.deepEqual(v.alternativas.map(a => a.texto).sort(),
    ['Y = 210X + 690', 'Y = 210X + 900', 'Y = 70X + 830', 'Y = 70X + 900', 'Y = 70X + 970'].sort());
  assert.equal(v.alternativas.find(a => a.certa).texto, 'Y = 210X + 690');
  assert.equal(c1.cards.length >= 6 && c1.cards.length <= 8, true);
  assert.equal(c2.cards.length >= 6 && c2.cards.length <= 8, true);
});

test('revisão dos Caps. 1 e 2: conferência com o PDF e posição da certa', async () => {
  const { pack } = await import(PACK_URL);
  const q = id => pack.questoes.find(x => x.id === id);
  // 2023 Q162: "y" minúsculo, como no PDF oficial e no DOSVOX
  assert.deepEqual(q('enem-2023-162').alternativas.map(a => a.texto), ['y = 250x', 'y = 500x', 'y = 750x', 'y = 250x + 500', 'y = 500x + 250']);
  // 2019 Q168: "Cada um deles" e o milhar com espaço, um parágrafo só
  assert.match(q('enem-2019-168').contexto, /^<p>Uma empresa[^<]*R\$ 1\u00a0000,00 por semana\. Os outros[^<]*Cada um deles trabalha/);
  assert.equal(q('enem-2021-141').alternativas[0].texto, 'P = d·n + L + d·n·s');
  for (const id of ['enem-2023-162', 'enem-2023-150', 'enem-2019-168', 'enem-2021-141', 'enem-2023-156', 'enem-2020-164', 'enem-2023-151'])
    assert.equal(q(id).textoConferidoPDF, '2026-11-17', id);
  // imagem da 2020 Q164: recorte do PDF, com pelo menos 900 px de largura (cabeçalho IHDR do PNG)
  const png = readFileSync(join(RAIZ, 'conteudo/img/enem-2020-164.png'));
  assert.ok(png.readUInt32BE(16) >= 900, `largura ${png.readUInt32BE(16)} px`);
  // modelo da p. 2: a certa não fica sempre na mesma letra (a linha 0 continua a de e.3)
  const letras = pack.modelos.find(m => m.id === 'mat-fa.p2.m').variantes.map(v => v.gabarito);
  assert.equal(letras[0], 'D');
  assert.ok(new Set(letras).size >= 3, letras.join(''));
  // distrator que imita a alternativa C da Q150: termo independente primeiro, como o INEP escreve
  const b2 = pack.modelos.find(m => m.id === 'mat-fa.p2.b2.m').variantes[0];
  assert.deepEqual(b2.alternativas.map(a => a.texto), ['P = 1 − 0,7V', 'P = 0,3V', 'P = 0,7V', 'P = V − 70', 'P = 30V']);
});

const RECUSAS = [
  ['alternativa errada de rodada sem "o que faltou"', "delete q('enem-2023-162').alternativas[0].falta;", /enem-2023-162.*alternativa A sem "o que faltou"/],
  ['gabarito diferente do INEP', "q('enem-2023-150').gabarito = 'B';", /gabarito B ≠ TX_GABARITO do INEP A/],
  ['bloco cobrado sem pré-pergunta', "delete bloco('mat-fa.p2.b2').prePergunta;", /cobra o bloco mat-fa\.p2\.b2: sem pré-pergunta/],
  ['6 palavras seguidas da questão ligada', "q('enem-2019-168').explicacao += ' Uma empresa tem diversos funcionários. Um deles é o gerente.';   // 5 palavras não bastam; aqui são 10", /6 palavras.*enem-2019-168/],
  ['id duplicado', "cap('mat-fa.c1').cards[1].id = cap('mat-fa.c1').cards[0].id;", /id duplicado: mat-fa\.c1\.card1/],
  ['capítulo com menos de 6 cards', "cap('mat-fa.c2').cards.splice(0, 3);", /cap 2.*5 cards/],
  ['card sem bloco válido', "cap('mat-fa.c1').cards[0].bloco = 'mat-fa.p9.b9';", /card sem bloco válido/],
  ['imagem local inexistente', "q('enem-2023-156').imagens[0].src = 'conteudo/img/nao-existe.png';", /imagem local inexistente/],
  ['expr que não reproduz a alternativa', "q('enem-2023-162').alternativas[1].expr = '400*x';", /enem-2023-162.*alternativa B: expr/],
  ['questão anulada pelo INEP (2022 Q157)', `const x = structuredClone(q('enem-2023-162'));
Object.assign(x, { id: 'enem-2022-157', ano: 2022, numero: 157, atribuicao: 'INEP · Enem 2022, 2º dia, Caderno Azul, questão 157 · CC BY-ND 3.0' });
x.inep = { ...x.inep, coProva: 1075, coItem: 39443 };   // 2022, 2º dia, Caderno Azul: item anulado pedagogicamente
pack.questoes.push(x); cap('mat-fa.c1').reserva.push(x.id);`, /enem-2022-157.*anulada pelo INEP/],
  ['texto do INEP alterado', "q('enem-2019-168').introducao += ' (adaptado)';", /comando da questão diferente da transcrição/],
  ['conferência com o PDF sem textoConferidoPDF', "q('enem-2023-162').textoConferidoPDF = null;", /enem-2023-162.*textoConferidoPDF/],
  ['texto diferente do PDF oficial', "q('enem-2023-162').alternativas[0].texto = 'Y = 250x';", /enem-2023-162.*texto diferente do PDF oficial/],
];
for (const [nome, codigo, esperado] of RECUSAS) {
  test(`recusa: ${nome}`, { skip: !temC34 && 'mat-fa-c34.js ainda não existe' }, () => {
    const r = comAlteracao(codigo);
    assert.equal(r.codigo, 1, r.saida);
    assert.match(r.saida, esperado);
  });
}
