// Diagnóstico: as fontes Inter 400/500/600 e Poppins 600 carregam no Chromium e no WebKit?
const U = require('./comum.cjs');
(async () => {
  for (const motor of ['chromium', 'webkit']) {
    const { nav, pg } = await U.abrir(motor, 'light');
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.evaluate(() => document.fonts.ready);
    const r = await pg.evaluate(() => ({
      faces: [...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`).filter((x, i, a) => a.indexOf(x) === i).slice(0, 20),
      inter600: document.fonts.check('600 16px Inter'),
      poppins600: document.fonts.check('600 24px Poppins'),
      larguraNormal: (() => { const c = document.createElement('canvas').getContext('2d'); c.font = '400 16px Inter'; const a = c.measureText('Continuar passo').width; c.font = '600 16px Inter'; const b = c.measureText('Continuar passo').width; return [a, b]; })(),
    }));
    console.log(motor, JSON.stringify(r));
    await nav.close();
  }
})();
