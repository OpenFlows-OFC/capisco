// Diagnóstico: as fontes do design system (Gabarito 700/800, Atkinson Hyperlegible Next 400/600 e Mono 500) carregam no Chromium e no WebKit?
const U = require('./comum.cjs');
(async () => {
  for (const motor of ['chromium', 'webkit']) {
    const { nav, pg } = await U.abrir(motor, 'light');
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.evaluate(() => document.fonts.ready);
    const r = await pg.evaluate(() => ({
      faces: [...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`).filter((x, i, a) => a.indexOf(x) === i).slice(0, 20),
      texto600: document.fonts.check('600 16px "Atkinson Hyperlegible Next"'), mono500: document.fonts.check('500 13px "Atkinson Hyperlegible Mono"'),
      gabarito800: document.fonts.check('800 32px Gabarito'),
      larguraNormal: (() => { const c = document.createElement('canvas').getContext('2d'); c.font = '400 16px "Atkinson Hyperlegible Next"'; const a = c.measureText('Continuar passo').width; c.font = '600 16px "Atkinson Hyperlegible Next"'; const b = c.measureText('Continuar passo').width; return [a, b]; })(),
    }));
    console.log(motor, JSON.stringify(r));
    await nav.close();
  }
})();
