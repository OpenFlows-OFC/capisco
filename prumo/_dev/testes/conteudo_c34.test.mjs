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
    assert.match(armadilha.falta, /salgado − suco = suco \+ R\$\s[\d,]+, ou seja, salgado = 2 × suco/);
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

// Pendências de conteúdo resolvidas em 17/11/2026 (conferência com o PDF, imagens, autoria, links).
test('Caps. 3 e 4: texto conferido com o PDF oficial, com as correções da transcrição', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const q = id => pack.questoes.find(x => x.id === id);
  for (const id of ['enem-2019-143', 'enem-2020-175', 'enem-2019-179', 'enem-2021-164', 'enem-2023-175']) {
    assert.equal(q(id).textoConferidoPDF, '2026-11-17', id);
    assert.match(q(id).transcricao, /conferida com o PDF oficial do INEP em 17\/11\/2026/, id);
  }
  assert.match(q('enem-2019-179').contexto, /em watt × minuto,/);
  assert.equal(q('enem-2019-179').introducao, 'A sequência de deslocamentos pelos cômodos, conforme o consumo de energia apresentado no gráfico, é');
  assert.match(q('enem-2021-164').contexto, /mala com até 10 kg\./);
  assert.match(q('enem-2020-175').contexto, /Receita – Custo\./);   // meia-risca, como no PDF
  assert.equal(q('enem-2019-179').fonteMd.includes('watt x minuto'), true);   // fonteMd guarda o original do enem.dev
});

test('validador recusa texto dos Caps. 3 e 4 diferente do PDF oficial', { skip: pular }, () => {
  const r = validarComAlteracao("const q = pack.questoes.find(x => x.id === 'enem-2021-164'); q.contexto = q.contexto.replace('até 10 kg.', 'até 10kg.');");
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /enem-2021-164.*(texto diferente do PDF oficial|texto-base diferente da transcrição)/);
});

test('imagens do Enem dos Caps. 3 e 4 recortadas do PDF em alta resolução (mesmo nome de arquivo)', { skip: pular }, async () => {
  const { readFileSync } = await import('node:fs');
  const largura = arq => readFileSync(join(RAIZ, 'conteudo/img', arq)).readUInt32BE(16);   // cabeçalho IHDR do PNG
  for (const l of ['', '-a', '-b', '-c', '-d', '-e']) assert.ok(largura(`enem-2020-175${l}.png`) >= 500, `enem-2020-175${l}.png`);
  // 2019 Q179: gráfico e planta um embaixo do outro (rodada 2), cada um com a largura toda da tela.
  const altura = arq => readFileSync(join(RAIZ, 'conteudo/img', arq)).readUInt32BE(20);
  assert.ok(largura('enem-2019-179.png') >= 800);
  assert.ok(altura('enem-2019-179.png') > largura('enem-2019-179.png'));
  assert.ok(largura('enem-2019-143.png') >= 700);
  const { pack } = await import(PACK_URL);
  const q = pack.questoes.find(x => x.id === 'enem-2020-175');
  assert.equal(q.imagens.length, 6);
  for (const im of q.imagens) assert.match(im.recorte, /PDF oficial do Enem 2020/);
});

test('autoria dos Caps. 3 e 4 em texto, igual à dos Caps. 1 e 2, e créditos sem "(true)"', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const { Pack } = await import(pathToFileURL(join(RAIZ, 'js/nucleo/pack.js')).href);
  const c4 = pack.capitulos.find(c => c.id === 'mat-fa.c4');
  assert.equal(typeof c4.cards[0].autoria.ia, 'string');
  assert.deepEqual(c4.cards[0].autoria, pack.autoriaPadrao);
  assert.deepEqual(pack.questoes.find(x => x.id === 'enem-2023-175').autoria, pack.autoriaPadrao);
  const cr = new Pack(pack).creditos();
  const frases = new Set(cr.itens.map(i => i.autoria.replace(/^Explicação e "o que faltou": /, '')).filter(Boolean));
  assert.deepEqual([...frases], ['Texto da equipe Prumo · CC BY-SA 4.0 · revisão em andamento']);
});

test('links "Ir além" dos Caps. 3 e 4: OBMEP módulo 35 e Khan na unidade de cada capítulo', { skip: pular }, async () => {
  const { pack } = await import(PACK_URL);
  const cap = id => pack.capitulos.find(c => c.id === id);
  for (const c of [cap('mat-fa.c3'), cap('mat-fa.c4')]) {
    const o = c.irAlem.find(l => l.tipo === 'obmep');
    assert.equal(o.url, 'https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=35');
    assert.equal(o.rotulo, 'Portal da OBMEP: módulo Função Afim (videoaulas e exercícios)');
  }
  assert.match(cap('mat-fa.c3').irAlem.find(l => l.tipo === 'khan').url, /:3-bimestre-2026$/);
  assert.match(cap('mat-fa.c3').irAlem.find(l => l.tipo === 'khan').rotulo, /Unidade 4, 3º Bimestre/);
  assert.match(cap('mat-fa.c4').irAlem.find(l => l.tipo === 'khan').url, /:2-bimestre-2026$/);
});
