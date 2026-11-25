// Service worker: precache com a lista explícita, prefixo "prumo-pwa-" (o activate não toca em caches
// de outro app da mesma origem), fontes do próprio app no precache e o app abrindo em modo avião.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/offline.cjs
const U = require('./comum.cjs');

(async () => {
  const { nav, ctx, pg, erros } = await U.abrir('chromium', 'light');
  const { falhas, confere, cap } = U.criarConferencia('offline-chromium');
  try {
    // caches de "outro app" na mesma origem, antes do Prumo: o do Capisco tem de ficar; um prumo-pwa antigo, sair
    await pg.goto(U.BASE + 'manifest.webmanifest');
    await pg.evaluate(async () => { await caches.open('prumo-v1'); await caches.open('prumo-pwa-v0'); await caches.open('prumo-pwa-v1'); await caches.open('prumo-pwa-v2'); await caches.open('prumo-pwa-v3'); await caches.open('prumo-pwa-v4'); await caches.open('prumo-pwa-v5'); await caches.open('prumo-pwa-v6'); await caches.open('prumo-pwa-v7'); await caches.open('prumo-pwa-v8'); await caches.open('prumo-pwa-fontes'); });
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.evaluate(() => navigator.serviceWorker.ready);
    await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    await pg.waitForTimeout(800);
    const r = await pg.evaluate(async () => {
      const ks = await caches.keys();
      const app = await (await caches.open('prumo-pwa-v12')).keys();
      const fontes = app.filter(r => /\/fontes\/.+\.woff2$/.test(r.url)).length;
      return { ks, app: app.length, fontes };
    });
    console.log('  caches:', JSON.stringify(r));
    confere(r.ks.includes('prumo-v1'), 'cache do app antigo (prumo-v1) preservado');
    confere(!r.ks.includes('prumo-pwa-v0') && !r.ks.includes('prumo-pwa-v1') && !r.ks.includes('prumo-pwa-v2') && !r.ks.includes('prumo-pwa-v3') && !r.ks.includes('prumo-pwa-v4') && !r.ks.includes('prumo-pwa-v5') && !r.ks.includes('prumo-pwa-v6') && !r.ks.includes('prumo-pwa-v7') && !r.ks.includes('prumo-pwa-v8') && !r.ks.includes('prumo-pwa-fontes'), 'caches prumo-pwa antigos (v1, v2 e fontes antigas) apagados');
    confere(r.app >= 80, `precache completo (${r.app} arquivos)`);
    confere(r.fontes >= 10, `fontes do próprio app no precache (${r.fontes} woff2)`);
    // modo avião: o app abre, com as fontes e as imagens
    await ctx.setOffline(true);
    await pg.reload(); await U.pronto(pg);
    confere((await U.estado(pg)) === 'primeiroUso', 'abre offline no Primeiro uso');
    const off = await pg.evaluate(async () => {
      await document.fonts.ready;
      const img = await new Promise(ok => { const i = new Image(); i.onload = () => ok(i.naturalWidth); i.onerror = () => ok(0); i.src = 'conteudo/img/enem-2023-156.png'; });
      const carrega = async f => (await document.fonts.load(f, 'Questão 162')).length > 0;
      return { texto: await carrega('600 16px "Atkinson Hyperlegible Next"'), titulo: await carrega('800 32px Gabarito'), mono: await carrega('500 13px "Atkinson Hyperlegible Mono"'), img };
    });
    confere(off.img > 0, 'imagem do Enem abre offline');
    confere(off.texto && off.titulo && off.mono, 'fontes do design system disponíveis offline');
    await pg.click('[data-acao="puExemplo"]');
    await pg.waitForSelector('.faixa-demo');
    confere(/dias estudados/.test(await U.texto(pg)), 'estado de exemplo offline');
    await cap(pg, 'modo-aviao-exemplo');
  } catch (e) {
    falhas.push('exceção: ' + e.message.split('\n')[0]);
    console.log(e);
  }
  falhas.push(...erros.filter(x => !/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(x)));
  console.log(`offline chromium: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
  falhas.forEach(x => console.log('   -', x));
  await nav.close();
  process.exit(falhas.length ? 1 : 0);
})();
