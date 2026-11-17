// Teste de fumaça: abre o app no Chromium (360×780), lista erros do console e tira uma captura.
const { chromium } = require('playwright');
const BASE = process.env.PRUMO_URL || 'http://127.0.0.1:8767/prumo/';
(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, colorScheme: process.env.TEMA || 'light', serviceWorkers: 'block' });
  const pg = await ctx.newPage();
  const erros = [];
  pg.on('pageerror', e => erros.push('pageerror: ' + e));
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') erros.push(m.type() + ': ' + m.text()); });
  await pg.goto(BASE);
  await pg.waitForFunction(() => document.documentElement.dataset.pronto === '1', null, { timeout: 15000 }).catch(() => erros.push('não ficou pronto'));
  await pg.screenshot({ path: '_dev/capturas/ui/fumaca.png', fullPage: true });
  console.log(await pg.evaluate(() => document.querySelector('#tela') && document.querySelector('#tela').innerText.slice(0, 600)));
  console.log('ERROS', erros);
  await nav.close();
})();
