// Confere que o pack (conteudo/mat-fa.js) carrega como ES module no Chromium e no WebKit, sem erros,
// e que Pack.variante() do núcleo gera a variante com a figura embutida.
// Uso (de prototipo/capisco): NODE_PATH="$(npm root -g)" node prumo/_dev/carga_navegador.cjs
const pw = require('playwright');
const fs = require('fs');
const path = require('path');

// O WebKit instalado pode ser de outra build que a esperada por esta versão do Playwright: usa o que houver.
function opcoesDe(nome) {
  if (nome !== 'webkit') return {};
  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (!fs.existsSync(base)) return {};
  const exe = fs.readdirSync(base).filter(d => /^webkit-\d+$/.test(d)).sort().reverse()
    .map(d => path.join(base, d, 'Playwright.exe')).find(f => fs.existsSync(f));
  return exe ? { executablePath: exe } : {};
}

(async () => {
  let falhas = 0;
  for (const nome of ['chromium', 'webkit']) {
    let b;
    try { b = await pw[nome].launch(opcoesDe(nome)); }
    catch (e) { console.log(nome, 'não abriu:', e.message.split('\n')[0]); continue; }
    const pg = await b.newPage();
    const erros = [];
    pg.on('pageerror', e => erros.push(String(e)));
    pg.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
    await pg.goto('http://127.0.0.1:8767/prumo/_dev/preview_c12.html');
    await pg.waitForSelector('body[data-pronto="1"]', { timeout: 20000 });
    const r = await pg.evaluate(async () => {
      const { pack } = await import('../conteudo/mat-fa.js');
      const { Pack } = await import('../js/nucleo/pack.js');
      const P = new Pack(pack);
      const v = P.variante('mat-fa.p3.m', 0);
      return { caps: pack.capitulos.length, questoes: pack.questoes.length, avisos: pack.avisos.length,
        temFigura: /<svg/.test(v.enunciado), gabarito: v.gabarito, bytes: JSON.stringify(pack).length,
        figs: document.querySelectorAll('figure svg').length };
    });
    console.log(nome, JSON.stringify(r), erros.length ? 'ERROS: ' + erros.join(' | ') : 'sem erros');
    if (erros.length || r.avisos) falhas++;
    await b.close();
  }
  process.exit(falhas ? 1 : 0);
})();
