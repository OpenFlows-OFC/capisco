// Computador (1280×800): trilho à esquerda, coluna de leitura e margem das notas; movimento reduzido:
// a virada do card e o preenchimento de "Continuar" não animam.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/desktop.cjs
const U = require('./comum.cjs');

(async () => {
  let total = 0;
  for (const tema of ['light', 'dark']) {
    const { nav, pg, erros } = await U.abrir('chromium', tema, { viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 });
    const { falhas, confere, cap } = U.criarConferencia(`desktop-${tema}`);
    try {
      await pg.goto(U.BASE); await U.pronto(pg);
      await cap(pg, 'primeiro-uso');
      await pg.evaluate(() => { const n = window.__prumo.nucleo; n.concluirPrimeiroUso({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25 }); n.salvarNota({ pagina: 'mat-fa.p1', paragrafo: 'mat-fa.p1.b1.s2', texto: 'Só o 3 multiplica o x.' }); window.__prumo.app.render(); });
      const trilho = await pg.evaluate(() => { const r = document.querySelector('.trilho').getBoundingClientRect(); return { x: r.x, w: r.width, h: r.height }; });
      confere(trilho.x === 0 && trilho.w > 150 && trilho.h > 700, 'trilho à esquerda no computador');
      await cap(pg, 'hoje');
      await pg.click('[data-ev="COMECAR"]');
      await U.escolher(pg, 'A');
      await pg.waitForSelector('.pagina-livro');
      const larg = await pg.evaluate(() => { const p = document.querySelector('.par-texto p'); const cs = getComputedStyle(p); const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontSize} Inter`; const ch = c.measureText('abcdefghijklmnopqrstuvwxyz').width / 26; return Math.round(p.getBoundingClientRect().width / ch); });
      confere(larg <= 72, `coluna de leitura com cerca de 64 caracteres (${larg})`);
      await cap(pg, 'leitura', true);
    } catch (e) { falhas.push('exceção: ' + e.message.split('\n')[0]); console.log(e); }
    falhas.push(...erros);
    console.log(`desktop ${tema}: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
    falhas.forEach(x => console.log('   -', x));
    total += falhas.length;
    await nav.close();
  }
  // movimento reduzido (celular)
  {
    const { nav, pg, erros } = await U.abrir('chromium', 'light', { reducedMotion: 'reduce' });
    const { falhas, confere, cap } = U.criarConferencia('movimento-reduzido');
    try {
      await pg.goto(U.BASE); await U.pronto(pg);
      await pg.evaluate(() => { const n = window.__prumo.nucleo; n.carregarExemplo(); n.despachar('COMECAR'); const m = n.st.missao; n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(m.passos[m.i].id).gabarito }); window.__prumo.app.render(); });
      await pg.waitForSelector('[data-continuar]');
      const anims = await pg.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
      confere(anims === 0, `sem animação no "Continuar" (${anims})`);
      confere(await (await U.texto(pg)).includes('Leia a explicação'), 'só o texto "Leia a explicação"');
      await U.continuar(pg);
      for (let g = 0; g < 10 && (await U.estado(pg)) !== 'cards'; g++) { await pg.evaluate(() => { const n = window.__prumo.nucleo; const e = n.estado(); if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR'); window.__prumo.app.render(); }); }
      await pg.click('.barra [data-ev="VIRAR"]');
      const vir = await pg.evaluate(() => ({ anims: document.getAnimations().filter(a => a.playState === 'running').length, virado: document.querySelector('.ficha-giro').classList.contains('virado') }));
      confere(vir.anims === 0 && vir.virado, `virada do card sem animação (${vir.anims} animações)`);
      await cap(pg, 'card-virado');
    } catch (e) { falhas.push('exceção: ' + e.message.split('\n')[0]); console.log(e); }
    falhas.push(...erros);
    console.log(`movimento reduzido: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
    falhas.forEach(x => console.log('   -', x));
    total += falhas.length;
    await nav.close();
  }
  process.exit(total ? 1 : 0);
})();
