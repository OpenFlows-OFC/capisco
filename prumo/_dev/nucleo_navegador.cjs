// Confere que o núcleo carrega como ES module no Chromium e no WebKit (Safari) e roda o laço do Cap. 1.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/nucleo_navegador.cjs
// Se o WebKit instalado for de outra build que a do Playwright global, aponte o executável:
// PRUMO_WEBKIT="$LOCALAPPDATA/ms-playwright/webkit-2359/Playwright.exe" (conferido assim em 17/11/2026).
const { chromium, webkit } = require('playwright');
const BASE = process.env.PRUMO_URL || 'http://127.0.0.1:8767/prumo/';

(async () => {
  let falhas = 0;
  for (const tipo of [chromium, webkit]) {
    const exe = tipo.name() === 'webkit' && process.env.PRUMO_WEBKIT ? { executablePath: process.env.PRUMO_WEBKIT } : {};
    const nav = await tipo.launch(exe);
    const ctx = await nav.newContext();
    const pg = await ctx.newPage();
    const erros = [];
    pg.on('pageerror', e => erros.push(String(e)));
    await pg.goto(BASE + 'js/nucleo/API.md');
    const r = await pg.evaluate(async (base) => {
      const { criarNucleo } = await import(base + 'js/nucleo/nucleo.js');
      const { pack } = await import(base + 'conteudo/mat-fa.js');
      localStorage.removeItem('prumo');
      const n = criarNucleo({ pack });
      const out = { inicio: n.tela().nome };
      n.concluirPrimeiroUso({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4, 5], minutos: 25 });
      out.hoje = n.tela().vm.bloco.titulo;
      n.despachar('COMECAR');
      let g = 0;
      while (g++ < 200) {
        const e = n.estado();
        if (e === 'pergunta') { const p = n.st.missao.passos[n.st.missao.i]; n.despachar({ tipo: 'RESPONDER', alt: n.pack.item(p.id).gabarito }); }
        else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
        else if (e === 'feedback') { n.st.missao.feedbackEm = 0; n.despachar('CONTINUAR'); }
        else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
        else break;
      }
      out.fim = n.estado();
      out.pronto = n.prontoPorHoje().mudancas.map(x => x.texto);
      out.salvo = JSON.parse(localStorage.getItem('prumo')).missao.estado;
      const t = n.carregarExemplo();
      out.exemplo = [t.nome, t.vm.bloco && t.vm.bloco.atrasada, t.faixas.demo && t.faixas.demo.texto];
      out.sair = n.sairDaDemonstracao().nome;
      return out;
    }, BASE);
    console.log(tipo.name(), JSON.stringify(r));
    if (erros.length || r.fim !== 'encerramento' || r.salvo !== 'encerramento') { falhas++; console.log('ERROS:', erros); }
    await nav.close();
  }
  process.exit(falhas ? 1 : 0);
})();
