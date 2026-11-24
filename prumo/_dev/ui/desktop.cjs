// Computador (1280×800): trilho à esquerda, coluna de leitura (nem estreita nem larga demais) e margem
// das notas só onde há nota; uma marca só; faixa do modo demonstração fora do trilho; movimento reduzido:
// a virada do card e o preenchimento de "Continuar" não animam.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/desktop.cjs [chromium|webkit] [light|dark]
const U = require('./comum.cjs');

(async () => {
  let total = 0;
  const motor = process.argv[2] || 'chromium';
  const temas = process.argv[3] ? [process.argv[3]] : ['light', 'dark'];
  for (const tema of temas) {
    const { nav, pg, erros } = await U.abrir(motor, tema, { viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 });
    const { falhas, confere, cap } = U.criarConferencia(`desktop-${motor}-${tema}`);
    try {
      await pg.goto(U.BASE); await U.pronto(pg);
      await cap(pg, 'primeiro-uso');
      await pg.evaluate(() => { const n = window.__prumo.nucleo; n.concluirPrimeiroUso({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25 }); n.salvarNota({ pagina: 'mat-fa.p1', paragrafo: 'mat-fa.p1.b1.s2', texto: 'Só o 3 multiplica o x.' }); window.__prumo.app.render(); });
      const trilho = await pg.evaluate(() => { const r = document.querySelector('.trilho').getBoundingClientRect(); return { x: r.x, w: r.width, h: r.height }; });
      confere(trilho.x === 0 && trilho.w > 150 && trilho.h > 700, 'trilho à esquerda no computador');
      const marcas = await pg.evaluate(() => [...document.querySelectorAll('.trilho-marca, .marca-prumo')].filter(e => e.getBoundingClientRect().width > 0).length);
      confere(marcas === 1, `uma marca só no computador (${marcas})`);
      await cap(pg, 'hoje');
      await pg.click('[data-ev="COMECAR"]');
      await U.escolher(pg, 'A');
      await pg.waitForSelector('.pagina-livro');
      const larg = await pg.evaluate(() => { const p = document.querySelector('.par-texto p'); const cs = getComputedStyle(p); const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontSize} Inter`; const ch = c.measureText('abcdefghijklmnopqrstuvwxyz').width / 26; return Math.round((p.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / ch); });   // só a coluna do texto: a pauta do parágrafo entra na margem do §
      confere(larg <= 72 && larg >= 55, `coluna de leitura entre 55 e 72 caracteres (${larg})`);
      const notas = await pg.evaluate(() => ({ comNota: document.querySelectorAll('.par-notas').length, grade: [...document.querySelectorAll('.par')].filter(p => getComputedStyle(p).display === 'grid').length }));
      confere(notas.grade === notas.comNota, `só o parágrafo com nota reserva a margem das notas (${notas.grade} em grade, ${notas.comNota} com nota)`);
      await cap(pg, 'leitura', true);
    } catch (e) { falhas.push('exceção: ' + e.message.split('\n')[0]); console.log(e); }
    falhas.push(...erros);
    console.log(`desktop ${motor} ${tema}: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
    falhas.forEach(x => console.log('   -', x));
    total += falhas.length;
    await nav.close();
  }
  // movimento reduzido (celular)
  {
    const temaRM = temas[0];
    const { nav, pg, erros } = await U.abrir(motor, temaRM, { reducedMotion: 'reduce' });
    const { falhas, confere, cap } = U.criarConferencia(`movimento-reduzido-${motor}-${temaRM}`);
    try {
      await pg.goto(U.BASE); await U.pronto(pg);
      await pg.evaluate(() => { const n = window.__prumo.nucleo; n.carregarExemplo(); n.despachar('COMECAR'); const m = n.st.missao; n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(m.passos[m.i].id).gabarito }); window.__prumo.app.render(); });
      await pg.waitForSelector('[data-continuar]');
      const anims = await pg.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
      confere(anims === 0, `sem animação no "Continuar" (${anims})`);
      confere(await (await U.texto(pg)).includes('Leia a explicação'), 'só o texto "Leia a explicação"');
      await U.continuar(pg);
      // a missão de exemplo pode ter várias revisões antes da mão de cartões: responde certo e segue até os cartões
      for (let g = 0; g < 40 && (await U.estado(pg)) !== 'cards'; g++) {
        await pg.evaluate(() => {
          const n = window.__prumo.nucleo, e = n.estado(), m = n.st.missao;
          if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
          else if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(m.passos[m.i].id).gabarito });
          else if (e === 'feedback') { m.feedbackEm = 0; n.despachar('CONTINUAR'); }
          else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
          window.__prumo.app.render();
        });
      }
      await pg.click('.barra [data-ev="VIRAR"]');
      const vir = await pg.evaluate(() => ({ anims: document.getAnimations().filter(a => a.playState === 'running').length, virado: document.querySelector('.ficha-giro').classList.contains('virado') }));
      confere(vir.anims === 0 && vir.virado, `virada do card sem animação (${vir.anims} animações)`);
      await cap(pg, 'card-virado');
    } catch (e) { falhas.push('exceção: ' + e.message.split('\n')[0]); console.log(e); }
    falhas.push(...erros);
    console.log(`movimento reduzido ${motor} ${temaRM}: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
    falhas.forEach(x => console.log('   -', x));
    total += falhas.length;
    await nav.close();
  }
  process.exit(total ? 1 : 0);
})();
