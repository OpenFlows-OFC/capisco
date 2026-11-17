// Capturas da prévia do conteúdo dos Caps. 1 e 2 (figuras e gráficos gerados), tema claro e escuro.
// Uso: NODE_PATH="$(npm root -g)" node prumo/_dev/captura_c12.cjs
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const erros = [];
  for (const tema of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, colorScheme: tema });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => erros.push(String(e)));
    pg.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
    await pg.goto('http://127.0.0.1:8767/prumo/_dev/preview_c12.html');
    await pg.waitForSelector('body[data-pronto="1"]');
    const alvos = ['mat-fa.p3.b2.s4', 'mat-fa.p4.b1.s2', 'mat-fa.p4.b2.s4'];
    for (const id of alvos) {
      const el = await pg.$(`[id="${id}"] + figure`);
      await el.screenshot({ path: path.join(__dirname, 'capturas', `fig-${id}-${tema}.png`) });
    }
    for (const id of ['mat-fa.p3.m#0', 'mat-fa.p3.m#3', 'mat-fa.p4.m#0', 'mat-fa.p4.m#5', 'mat-fa.p4.b2.m#0', 'mat-fa.p4.b2.m#1']) {
      const el = await pg.$(`[data-id="${id}"] figure`);
      await el.screenshot({ path: path.join(__dirname, 'capturas', `var-${id.replace('#', '_')}-${tema}.png`) });
    }
    const larg = await pg.evaluate(() => document.documentElement.scrollWidth);
    console.log(tema, 'scrollWidth', larg);
    await ctx.close();
  }
  await b.close();
  console.log(erros.length ? 'ERROS: ' + erros.join(' | ') : 'sem erros no console');
})();
