// Capturas da prévia dos Caps. 3 e 4 (360 px, tema claro e escuro) e conferência de imagens e console.
// Uso: NODE_PATH="$(npm root -g)" node prumo/_dev/captura_c34.cjs
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
    pg.on('requestfailed', r => erros.push('falhou: ' + r.url()));
    await pg.goto('http://127.0.0.1:8767/prumo/_dev/preview_c34.html');
    await pg.waitForSelector('body[data-pronto="1"]');
    const quebradas = await pg.evaluate(async () => {
      const imgs = [...document.images];
      await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
      return imgs.filter(i => !i.naturalWidth || !i.alt).map(i => i.src);
    });
    if (quebradas.length) erros.push('imagens sem carga ou sem alt: ' + quebradas.join(', '));
    for (const id of ['enem-2019-143', 'enem-2020-175', 'enem-2019-179', 'enem-2021-164', 'enem-2023-175', 'mat-fa.p6.m#0', 'mat-fa.p6.b2.m#0'])
      await (await pg.$(`[data-id="${id}"]`)).screenshot({ path: path.join(__dirname, 'capturas', `c34-${id.replace('#', '_')}-${tema}.png`) });
    await (await pg.$('[id="mat-fa.p5.b1.s1"]')).screenshot({ path: path.join(__dirname, 'capturas', `c34-p5s1-${tema}.png`) });
    console.log(tema, 'scrollWidth', await pg.evaluate(() => document.documentElement.scrollWidth), 'imagens', await pg.evaluate(() => document.images.length));
    await ctx.close();
  }
  await b.close();
  console.log(erros.length ? 'ERROS: ' + erros.join(' | ') : 'sem erros no console nem imagens quebradas');
})();
