// Capturas do design system "Prumo" (390×844, claro e escuro): Hoje, Questão com correção,
// Trecho (página do caderno com marca-texto e fio de prumo), Ficha e Pronto por hoje.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/capturas_ds.cjs [light|dark]
// Salva em _dev/capturas/ds-<tela>-<tema>.png.
const path = require('path');
const { chromium } = require('playwright');
const U = require('./comum.cjs');

const SAIDA = path.resolve(__dirname, '../capturas');

// leva o núcleo até um estado-alvo, sem tela; erra a primeira questão do Enem (para a correção e o trecho)
const ate = ({ alvo, errar }) => {
  const n = window.__prumo.nucleo;
  for (let g = 0; g < 400; g++) {
    const e = n.estado();
    if (e === alvo) break;
    const m = n.st.missao, p = m && m.passos[m.i];
    if (e === 'hoje') { if (!n.despachar('COMECAR')) break; }
    else if (e === 'pergunta') {
      const it = n.pack.item(p.id);
      const tipo = n.tela().vm.tipo;
      const alt = errar && tipo !== 'pre' && tipo !== 'preBloco' && !window.__errou ? it.alternativas.find(a => !a.certa).letra : it.gabarito;
      if (alt !== it.gabarito) window.__errou = true;
      n.despachar({ tipo: 'RESPONDER', alt });
      if (alvo === 'feedback' && window.__errou) break;
    } else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') { m.feedbackEm = 0; n.despachar('CONTINUAR'); }
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') { if (alvo === 'cards') break; n.despachar(m.mao.virado ? 'LEMBREI' : 'VIRAR'); }
    else break;
  }
  window.__prumo.app.render();
  return n.estado();
};

(async () => {
  const temas = process.argv[2] ? [process.argv[2]] : ['light', 'dark'];
  for (const tema of temas) {
    const nav = await chromium.launch();
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: tema, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo', reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    const erros = [];
    pg.on('pageerror', e => erros.push(e.message));
    pg.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
    const foto = async (nome, full = false) => { await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(SAIDA, `ds-${nome}-${tema}.png`), fullPage: full }); };
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.evaluate(() => { localStorage.clear(); });
    await pg.reload(); await U.pronto(pg);
    await pg.evaluate(() => document.fonts.ready);
    await foto('primeiro-uso');
    await pg.evaluate(() => { window.__prumo.nucleo.carregarExemplo(); location.hash = '#/hoje'; window.__prumo.app.render(); });
    await pg.evaluate(() => document.fonts.ready);
    await foto('hoje', true);
    for (const aba of ['caderno', 'plano', 'ajustes']) { await pg.evaluate(a => { location.hash = `#/${a}`; }, aba); await foto(aba); }
    await pg.evaluate(() => { location.hash = '#/hoje'; });
    // questão com correção
    const e1 = await pg.evaluate(ate, { alvo: 'feedback', errar: true });
    if (e1 === 'feedback') {
      await pg.evaluate(() => { const a = document.querySelector('.alternativas'); window.scrollTo(0, a.getBoundingClientRect().top + scrollY - 140); });
      await foto('questao');
      await foto('questao-inteira', true);
      // trecho: a página do caderno com o marca-texto
      if (await pg.$('[data-ev="VOLTAR_AO_TRECHO"]')) { await pg.click('[data-ev="VOLTAR_AO_TRECHO"]'); await foto('trecho'); await pg.click('.folha-pe [data-ev="VOLTAR"]'); }
    } else console.log('  sem feedback de erro; estado', e1);
    // ficha
    const e2 = await pg.evaluate(ate, { alvo: 'cards' });
    if (e2 === 'cards') {
      await foto('ficha');
      await pg.click('[data-ev="VIRAR"]'); await foto('ficha-verso');
    } else console.log('  sem cards hoje; estado', e2);
    // Pronto por hoje
    const e3 = await pg.evaluate(ate, { alvo: 'encerramento' });
    await foto('pronto', true);
    console.log(`${tema}: ${e3}; erros: ${erros.length ? erros.join(' | ') : 'nenhum'}`);
    await nav.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
