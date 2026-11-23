// Apostilas dos tópicos de prática: termos (pré-treino), "Confira" (recordação por seção),
// imagens com crédito e fontes. Confere o conteúdo real e o filtro do núcleo contra dados malformados.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import { IDS_PRATICA } from '../../js/nucleo/pratica.js';
import { packs, PERFIL } from './ajuda.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../..');
async function carregar(trocar = {}) {
  const out = [];
  for (const id of IDS_PRATICA) {
    const a = path.resolve(raiz, `conteudo/praticas/${id}.js`), b = path.resolve(raiz, `conteudo/praticas/${id}.teoria.js`);
    const teoria = existsSync(b) ? (await import(pathToFileURL(b).href)).teoria : null;
    out.push({ id, topico: existsSync(a) ? (await import(pathToFileURL(a).href)).topico : null, teoria: trocar[id] ? trocar[id](teoria) : teoria });
  }
  return out;
}
function novo(praticas) {
  R.relogioFalso('2026-11-18T19:00'); R.setOffset(0);
  const n = new Nucleo({ pack: PACK, storage: E.memoria(), praticas });
  n.abrir(); n.concluirPrimeiroUso(PERFIL);
  return n;
}
const PACK = (await packs())[0].dados;
const LISTA = await carregar();
const COM_TEORIA = LISTA.filter(x => x.topico && x.teoria);

test('toda apostila tem termos, um "Confira" válido em cada seção e fontes', () => {
  const n = novo(LISTA);
  assert.ok(COM_TEORIA.length >= 7);
  for (const { id } of COM_TEORIA) {
    const t = n.teoria(id);
    assert.ok(t.termos.length >= 3 && t.termos.length <= 6, `${id}: 3 a 6 termos`);
    for (const sc of t.secoes) {
      assert.ok(sc.confira, `${id}, seção ${sc.n}: tem "Confira"`);
      assert.ok(sc.confira.opcoes.length >= 2 && sc.confira.certa < sc.confira.opcoes.length, `${id}, seção ${sc.n}: opção certa existe`);
      assert.ok(sc.confira.porque.length > 10, `${id}, seção ${sc.n}: explica o porquê`);
      assert.equal(new Set(sc.confira.opcoes).size, sc.confira.opcoes.length, `${id}, seção ${sc.n}: opções distintas`);
    }
    // a resposta certa não fica sempre na mesma posição
    const pos = new Set(t.secoes.map(s => s.confira.certa));
    assert.ok(pos.size >= 2, `${id}: a certa varia de posição`);
    assert.ok(t.fontes.length >= 1, `${id}: tem fontes`);
  }
});

test('imagens das apostilas: arquivo existe, tem descrição e crédito com licença', () => {
  const n = novo(LISTA);
  let total = 0;
  for (const { id } of COM_TEORIA) {
    for (const sc of n.teoria(id).secoes.filter(s => s.imagem)) {
      total++;
      assert.ok(existsSync(path.resolve(raiz, sc.imagem.src)), `${id}: ${sc.imagem.src} existe`);
      assert.ok(sc.imagem.alt.length > 20, `${id}: descrição da imagem`);
      assert.match(sc.imagem.credito, /(Domínio público|CC0|CC BY)/, `${id}: licença no crédito`);
    }
  }
  assert.ok(total >= 5, 'pelo menos 5 imagens reais nas apostilas');
});

test('o núcleo descarta "Confira", termos e imagem malformados (sem derrubar a apostila)', async () => {
  const id = COM_TEORIA[0].id;
  const ruim = await carregar({ [id]: t => ({
    ...t,
    termos: [{ termo: 'ok', def: 'certo' }, { termo: 1 }, null],
    secoes: t.secoes.map((s, i) => ({ ...s,
      confira: i === 0 ? { pergunta: 'x', opcoes: ['a', 'b'], certa: 5 } : i === 1 ? { pergunta: 'x', opcoes: ['a'], certa: 0 } : s.confira,
      imagem: i === 0 ? { src: 'https://exemplo.com/a.jpg', credito: 'x' } : i === 1 ? { src: './conteudo/../../segredo.png' } : s.imagem,
    })),
  }) });
  const t = novo(ruim).teoria(id);
  assert.deepEqual(t.termos, [{ termo: 'ok', def: 'certo' }]);
  assert.equal(t.secoes[0].confira, null, 'índice da certa fora das opções');
  assert.equal(t.secoes[1].confira, null, 'uma opção só');
  assert.equal(t.secoes[0].imagem, null, 'imagem de fora do pacote');
  assert.equal(t.secoes[1].imagem, null, 'imagem sem crédito');
  assert.ok(t.secoes.length > 2, 'a apostila continua');
});
