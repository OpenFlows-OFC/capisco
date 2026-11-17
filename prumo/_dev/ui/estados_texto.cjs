// Estados de texto de Hoje e do Pronto por hoje: "Hoje não", encerrar antes da primeira pergunta,
// Hoje "encerrado antes", "Ver a resolução da equipe" e o "Por quê?" do colofão.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/estados_texto.cjs [chromium|webkit]
const U = require('./comum.cjs');
(async () => {
  const motor = process.argv[2] || 'chromium';
  const { nav, pg, erros } = await U.abrir(motor, 'light');
  const { falhas, confere, cap } = U.criarConferencia(`texto-${motor}`);
  const tem = async s => (await U.texto(pg)).includes(s);
  try {
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.evaluate(() => { window.__prumo.nucleo.concluirPrimeiroUso({ provaTipo: 'naosei', prova: null, dias: [0, 1, 2, 3, 4, 5, 6].slice(0, 5), minutos: 15 }); window.__prumo.app.render(); });
    await pg.click('[data-ev="HOJE_NAO"]');
    confere(await tem('Hoje não. As revisões de hoje passam para o próximo dia de estudo.'), 'Hoje não: texto');
    confere(await tem('Começar mesmo assim'), 'Hoje não: "Começar mesmo assim"');
    confere((await pg.$('.rosto.esmaecido')) !== null, 'Hoje não: bloco esmaecido');
    await cap(pg, 'hoje-nao', true);
    await pg.click('[data-ev="COMECAR"]');
    await pg.waitForSelector('.alternativas');
    await pg.click('[data-folha="encerrar"]');
    await pg.click('#folha-raiz [data-ev="CONFIRMAR_ENCERRAR"]');
    await pg.waitForSelector('.colofao');
    confere(await tem('Você encerrou no passo 1 de'), 'Pronto parcial: passo');
    confere(await tem('O dia não conta como estudado.'), 'Pronto parcial: não contou');
    await cap(pg, 'pronto-parcial', true);
    await pg.click('[data-ev="FECHAR"]');
    await pg.waitForSelector('.estado-texto');
    confere(/Hoje você encerrou no passo 1 de \d+\. O resto vai para o próximo dia de estudo\./.test(await U.texto(pg)), 'Hoje encerrado antes');
    confere(!(await pg.$('[data-ev="COMECAR"]')), 'encerrado antes: sem nova missão');
    await cap(pg, 'hoje-encerrado-antes', true);
    // resolução da equipe e "Por quê?" (estado de exemplo)
    await pg.evaluate(() => { const n = window.__prumo.nucleo; n.carregarExemplo(); n.despachar('COMECAR'); const m = n.st.missao; const it = n.missao.itemDe(m.passos[m.i].id); n.despachar({ tipo: 'RESPONDER', alt: it.alternativas.find(a => !a.certa).letra }); window.__prumo.app.render(); });
    await pg.waitForSelector('[data-ev="VER_RESOLUCAO"]');
    await pg.click('[data-ev="VER_RESOLUCAO"]');
    await pg.waitForSelector('.resolucao');
    confere(await tem('Resolução da equipe') || /RESOLUÇÃO DA EQUIPE/.test(await U.texto(pg)), 'resolução aberta');
    await cap(pg, 'resolucao-aberta');
  } catch (e) { falhas.push('exceção: ' + e.message.split('\n')[0]); console.log(e); await cap(pg, 'excecao', true).catch(() => {}); }
  falhas.push(...erros);
  console.log(`estados de texto ${motor}: ${falhas.length ? falhas.length + ' falha(s)' : 'ok'}`);
  falhas.forEach(x => console.log('   -', x));
  await nav.close();
  process.exit(falhas.length ? 1 : 0);
})();
