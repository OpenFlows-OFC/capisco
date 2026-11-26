// Ajudantes dos roteiros de navegador das telas (Playwright global 1.64.1).
// Uso: NODE_PATH="$(npm root -g)" node _dev/ui/<roteiro>.cjs [chromium|webkit] [light|dark]
const path = require('path');
const fs = require('fs');
const { chromium, webkit, devices } = require('playwright');

const BASE = process.env.PRUMO_URL || 'http://127.0.0.1:8767/prumo/';
const CAPTURAS = path.resolve(__dirname, '../capturas/ui');
fs.mkdirSync(CAPTURAS, { recursive: true });
const WEBKIT_EXE = process.env.PRUMO_WEBKIT || path.join(process.env.LOCALAPPDATA || '', 'ms-playwright/webkit-2359/Playwright.exe');

const CONFIGS = {
  chromium: { tipo: chromium, ctx: { viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  webkit: { tipo: webkit, ctx: Object.assign({}, devices['iPhone 13']), exe: fs.existsSync(WEBKIT_EXE) ? WEBKIT_EXE : undefined },
};

async function abrir(motor, tema, extra = {}) {
  const c = CONFIGS[motor];
  const nav = await c.tipo.launch(c.exe ? { executablePath: c.exe } : {});
  const ctx = await nav.newContext(Object.assign({}, c.ctx, { colorScheme: tema, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' }, extra));
  const pg = await ctx.newPage();
  const erros = [];
  pg.on('pageerror', e => erros.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') erros.push('console: ' + m.text()); });
  return { nav, ctx, pg, erros };
}

function criarConferencia(prefixo) {
  const falhas = [];
  let n = 0;
  return {
    falhas,
    confere(cond, msg) { if (!cond) { falhas.push(msg); console.log(`  FALHA: ${msg}`); } },
    async cap(pg, nome, full = false) {
      await pg.waitForTimeout(260);
      n++;
      const arq = path.join(CAPTURAS, `${prefixo}-${String(n).padStart(2, '0')}-${nome}.png`);
      await pg.screenshot({ path: arq, fullPage: full });
      return arq;
    },
  };
}

const pronto = pg => pg.waitForFunction(() => document.documentElement.dataset.pronto === '1', null, { timeout: 20000 });
const estado = pg => pg.evaluate(() => window.__prumo.nucleo.estado());
const texto = pg => pg.evaluate(() => document.getElementById('app').innerText.replace(/ /g, ' '));
const gabarito = pg => pg.evaluate(() => { const n = window.__prumo.nucleo, m = n.st.missao; return n.missao.itemDe(m.passos[m.i].id).gabarito; });
const erradaDe = (pg, pref = 'E') => pg.evaluate(p => { const n = window.__prumo.nucleo, m = n.st.missao; const e = n.missao.itemDe(m.passos[m.i].id).alternativas.filter(a => !a.certa).map(a => a.letra); return e.includes(p) ? p : e[0]; }, pref);
const tentativas = pg => pg.evaluate(() => Object.values(window.__prumo.nucleo.st.topicos).reduce((s, t) => s + (t.tentativas || []).length, 0));
async function escolher(pg, alt) {
  await pg.click(`label.alt:has(input[value="${alt}"])`);
  await pg.click('[data-acao="responder"]');
}
async function responderCerta(pg) { await escolher(pg, await gabarito(pg)); }
async function continuar(pg) {
  // "Garantir ou dobrar" no lugar do Continuar (3 acertos seguidos): o roteiro garante e segue
  if (await pg.$('[data-acao="apostar"][data-arg="garantir"]')) await pg.click('[data-acao="apostar"][data-arg="garantir"]');
  await pg.waitForSelector('[data-continuar][aria-disabled="false"]', { timeout: 8000 });
  await pg.click('[data-continuar]');
}
async function recarregar(pg) { await pg.reload(); await pronto(pg); await pg.waitForTimeout(150); }

module.exports = { BASE, CONFIGS, abrir, criarConferencia, pronto, estado, texto, gabarito, erradaDe, tentativas, escolher, responderCerta, continuar, recarregar };
