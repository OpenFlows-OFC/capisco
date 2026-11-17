// Capturas extras (390×844, claro e escuro) do estado de exemplo: Hoje (Hoje vence, meta da semana),
// Perfil (coleção de vistos) e Estudar com um tópico começado. Uso: NODE_PATH="$(npm root -g)" node _dev/ui/capturas_estudar_extra.cjs
const path = require('path');
const U = require('./comum.cjs');
const CAPS = path.resolve(__dirname, '../capturas');
(async () => {
  let falhas = 0;
  for (const tema of ['light', 'dark']) {
    const { nav, pg, erros } = await U.abrir('chromium', tema, { viewport: { width: 390, height: 844 } });
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.click('[data-acao="puExemplo"]');
    await pg.waitForSelector('.manchete');
    await pg.screenshot({ path: path.join(CAPS, `est-hoje-exemplo-${tema}.png`), fullPage: true });
    await pg.evaluate(() => { location.hash = '#/estudar'; });
    await pg.waitForSelector('.mapa-area');
    await pg.screenshot({ path: path.join(CAPS, `est-estudar-exemplo-${tema}.png`) });
    await pg.evaluate(() => { location.hash = '#/perfil'; });
    await pg.waitForSelector('.calendario');
    await pg.screenshot({ path: path.join(CAPS, `est-perfil-colecao-${tema}.png`) });
    if (erros.length) { falhas++; console.log(tema, erros); }
    await nav.close();
  }
  console.log(falhas ? 'FALHAS' : 'ok');
})();
