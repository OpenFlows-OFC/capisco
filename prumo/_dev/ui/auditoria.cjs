// Auditoria das telas do núcleo (g.8): contraste WCAG de todo texto visível, nenhum vermelho,
// alvos de toque de 48 px, uma só barra fixa por tela, sem rolagem horizontal, tabular-nums.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/auditoria.cjs [chromium|webkit]
const U = require('./comum.cjs');

const AUDITAR = () => {
  const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const rgba = s => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; };
  const mistura = (c, fundo) => [0, 1, 2].map(i => c[i] * c[3] + fundo[i] * (1 - c[3]));
  function fundoDe(el) {
    const pilha = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const c = rgba(cs.backgroundColor);
      if (c && c[3] > 0) { pilha.push(c); if (c[3] >= 1) break; }
    }
    let base = [255, 255, 255];
    const raiz = rgba(getComputedStyle(document.body).backgroundColor);
    if (raiz && raiz[3] >= 1) base = raiz.slice(0, 3);
    for (let i = pilha.length - 1; i >= 0; i--) base = mistura(pilha[i], base);
    return base;
  }
  const visivel = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05 && !el.closest('[inert],[aria-hidden="true"]'); };
  const res = { contraste: [], vermelho: [], alvos: [], fixas: 0, rolagemX: document.documentElement.scrollWidth > innerWidth + 1, tabular: null };
  const els = [...document.querySelectorAll('#app *')];
  for (const el of els) {
    if (!visivel(el)) continue;
    const cs = getComputedStyle(el);
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
    if (txt && !el.closest('svg') && !el.closest('.enem-img') && !el.closest('.zoom-corpo')) {
      const cor = rgba(cs.color); const fundo = fundoDe(el);
      if (cor) {
        const c = mistura(cor, fundo);
        const L1 = lum(c), L2 = lum(fundo), r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const tam = parseFloat(cs.fontSize), negrito = Number(cs.fontWeight) >= 600;
        const minimo = tam >= 24 || (tam >= 18.66 && negrito) ? 3 : 4.5;
        if (r < minimo) res.contraste.push(`${r.toFixed(2)} < ${minimo} · "${txt.slice(0, 40)}" (${el.className || el.tagName})`);
      }
    }
    for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'outlineColor']) {
      const c = rgba(cs[prop]);
      if (c && c[3] > 0.2 && c[0] - Math.max(c[1], c[2]) > 70 && c[0] > 150) res.vermelho.push(`${prop} ${cs[prop]} em ${el.className || el.tagName}`);
    }
    if (cs.position === 'fixed' && !el.closest('#folha-raiz') && !el.classList.contains('folha-fundo') && !el.closest('.folha-fundo')) res.fixas++;
    const interativo = el.matches('button, a[href], input:not([type="radio"]):not([type="checkbox"]), summary, label.alt, label.escolha, .chip span, [role="button"]');
    if (interativo && !el.closest('.rodape-licenca') && !el.closest('.par-texto') && !el.closest('.enunciado p')) {
      const r = el.getBoundingClientRect();
      const alvo = el.matches('.chip span') ? r : r;
      if (alvo.height < 47.5 && !el.closest('.faixa')) res.alvos.push(`${Math.round(alvo.height)} px · ${(el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30)} (${el.className})`);
      if (el.closest('.faixa') && alvo.height < 39.5) res.alvos.push(`faixa ${Math.round(alvo.height)} px · ${(el.innerText || '').trim().slice(0, 30)}`);
    }
  }
  res.tabular = getComputedStyle(document.body).fontVariantNumeric;
  return res;
};

const jogar = (alvo) => {
  // leva o núcleo até um estado-alvo, jogando certo (sem tela); depois a tela é desenhada
  const n = window.__prumo.nucleo;
  for (let g = 0; g < 300; g++) {
    const e = n.estado();
    if (e === alvo) break;
    const m = n.st.missao, p = m && m.passos[m.i];
    if (e === 'hoje') { if (!n.despachar('COMECAR')) break; }
    else if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(p.id).gabarito });
    else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') { if (alvo === 'feedbackErro') break; m.feedbackEm = 0; n.despachar('CONTINUAR'); }
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') { if (alvo === 'cards') break; n.despachar(m.mao.virado ? 'LEMBREI' : 'VIRAR'); }
    else break;
  }
  window.__prumo.app.render();
};

(async () => {
  const motores = process.argv[2] ? [process.argv[2]] : ['chromium', 'webkit'];
  let total = 0;
  for (const motor of motores) for (const tema of ['light', 'dark']) {
    const { nav, pg, erros } = await U.abrir(motor, tema);
    await pg.goto(U.BASE); await U.pronto(pg);
    const telas = [];
    const auditar = async nome => { await pg.waitForTimeout(250); telas.push([nome, await pg.evaluate(AUDITAR)]); };
    await auditar('primeiro-uso');
    await pg.evaluate(() => { window.__prumo.nucleo.concluirPrimeiroUso({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25 }); window.__prumo.app.render(); });
    await auditar('hoje');
    await pg.click('[data-folha="porQue"]'); await pg.click('[data-acao="verRegraPorQue"]'); await auditar('folha-por-que');
    await pg.click('#folha-raiz .folha-pe [data-acao="fecharFolha"]');
    await pg.evaluate(() => { window.__prumo.nucleo.despachar('HOJE_NAO'); window.__prumo.app.render(); }); await auditar('hoje-nao-esmaecido');
    await pg.evaluate(() => { window.__prumo.nucleo.despachar('COMECAR'); window.__prumo.app.render(); }); await auditar('pre-pergunta');
    await pg.click('label.alt:has(input[value="B"])'); await auditar('pre-pergunta-marcada');
    await pg.click('[data-acao="responder"]'); await auditar('leitura');
    await pg.evaluate(() => { window.__prumo.nucleo.despachar('TERMINEI_TRECHO'); const n = window.__prumo.nucleo, m = n.st.missao; n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(m.passos[m.i].id).gabarito }); window.__prumo.app.render(); });
    await auditar('feedback-esperando');
    await pg.waitForTimeout(3600); await auditar('feedback-liberado');
    await pg.evaluate(jogar, 'naoExiste');
    await auditar('pronto-por-hoje');
    await pg.evaluate(() => { window.__prumo.nucleo.despachar('FECHAR'); window.__prumo.app.render(); }); await auditar('hoje-feito');
    // estado de exemplo: revisão errada e cards
    await pg.evaluate(() => { window.__prumo.nucleo.carregarExemplo(); window.__prumo.app.render(); }); await auditar('hoje-exemplo');
    await pg.evaluate(() => { const n = window.__prumo.nucleo; n.despachar('COMECAR'); const m = n.st.missao; const it = n.missao.itemDe(m.passos[m.i].id); n.despachar({ tipo: 'RESPONDER', alt: it.alternativas.find(a => !a.certa).letra }); window.__prumo.app.render(); });
    await auditar('revisao-errada');
    await pg.evaluate(jogar, 'cards'); await auditar('card-frente');
    await pg.click('.barra [data-ev="VIRAR"]'); await auditar('card-verso');
    await pg.click('.barra [data-ev="AINDA_NAO"]'); await auditar('card-ainda-nao');
    await pg.click('[data-folha="encerrar"]'); await auditar('folha-encerrar');
    const falhas = [];
    for (const [nome, r] of telas) {
      const f = [...r.contraste.map(x => `contraste ${x}`), ...r.vermelho.map(x => `vermelho ${x}`), ...r.alvos.map(x => `alvo ${x}`)];
      if (r.fixas > 1) f.push(`${r.fixas} barras fixas`);
      if (r.rolagemX) f.push('rolagem horizontal');
      if (!/tabular-nums/.test(r.tabular)) f.push('sem tabular-nums');
      f.forEach(x => falhas.push(`${nome}: ${x}`));
    }
    falhas.push(...erros);
    console.log(`${motor} ${tema}: ${telas.length} telas, ${falhas.length ? falhas.length + ' achado(s)' : 'ok'}`);
    [...new Set(falhas)].slice(0, 40).forEach(x => console.log('   -', x));
    total += falhas.length;
    await nav.close();
  }
  process.exit(total ? 1 : 0);
})();
