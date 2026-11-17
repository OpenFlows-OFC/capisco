// Roteiro de Estudar, no navegador: onboarding → primeiro uso (nome, matérias) → Hoje (saudação e
// "Seu próximo conteúdo") → aba Estudar (4 áreas, "em breve") → página do tópico → "Estudar este tópico
// hoje" → pré-pergunta (sem acerto) → teoria (apostila) → a resposta da pré-pergunta → questões do Enem
// (erro com "o que faltou" e "Rever a teoria") → fim → Pronto por hoje com o visto → o botão do tópico
// leva, com "Continuar estudando", ao estudo livre de outro tópico (sem 2º visto); a teoria segue livre. Perfil: nome. Capturas 390×844 em _dev/capturas/est-*.png.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_estudar.cjs [chromium|webkit] [light|dark]
const path = require('path');
const U = require('./comum.cjs');
const CAPS = path.resolve(__dirname, '../capturas');

async function roteiro(motor, tema) {
  const { nav, pg, erros } = await U.abrir(motor, tema, { viewport: { width: 390, height: 844 } });
  const { falhas, confere, cap } = U.criarConferencia(`est-${motor}-${tema}`);
  const tem = async s => (await U.texto(pg)).includes(s);
  const foto = async nome => { if (motor === 'chromium') { await pg.waitForTimeout(250); await pg.screenshot({ path: path.join(CAPS, `est-${nome}-${tema}.png`) }); } };
  try {
    await pg.goto(U.BASE); await U.pronto(pg);
    // onboarding: 3 telas
    confere(await tem('Uma missão de estudo por dia, com fim marcado'), 'onboarding 1');
    await pg.click('[data-acao="puProximo"]');
    confere(await tem('Errou? O app mostra o que faltou'), 'onboarding 2');
    await pg.click('[data-acao="puProximo"]');
    confere(await tem('Seus dias estudados só crescem'), 'onboarding 3');
    await foto('onboarding');
    await pg.click('[data-acao="puProximo"]');
    // primeiro uso: frase, nome, prova, matérias, dias
    confere(await tem('Uma missão de estudo por dia, com fim marcado, a partir do seu caderno e de questões reais do Enem.'), 'frase do Prumo');
    confere(await tem('Ciências da Natureza') && await tem('em breve'), 'matérias com "em breve"');
    confere(await pg.$eval('input[name="areas"][value="CN"]', i => i.disabled), 'área sem conteúdo desabilitada');
    await foto('primeiro-uso');
    await pg.fill('#pu-nome', 'Daniel');
    await pg.click('label.escolha:has(input[value="escola"])');
    await pg.fill('#pu-data', '2026-12-15');
    await pg.click('button[type="submit"]');
    await pg.click('[data-acao="puAlarme"][data-arg="agora-nao"]');
    await pg.click('[data-acao="puConcluir"]');
    await pg.waitForSelector('.manchete');
    confere(await tem('Oi, Daniel'), 'Hoje: saudação com o nome');
    confere(await tem('Seu próximo conteúdo'), 'Hoje: bloco "Seu próximo conteúdo"');
    confere((await pg.$('.proximo [data-ev="COMECAR"]')) !== null, 'Hoje: Começar dentro do bloco do próximo conteúdo');
    await foto('hoje');
    // abas: 5, com ícone
    confere((await pg.$$('.trilho .aba')).length === 5 && (await pg.$$('.trilho .aba svg')).length === 5, '5 abas com ícone');
    // Estudar: mapa
    await pg.click('.trilho .aba[href="#/estudar"]');
    await pg.waitForSelector('.mapa-area');
    for (const a of ['Matemática', 'Linguagens', 'Ciências da Natureza', 'Ciências Humanas']) confere(await tem(a), `mapa: ${a}`);
    confere(await tem('chega nas próximas versões'), 'mapa: frase honesta das áreas sem conteúdo');
    confere(await tem('Funções afins'), 'mapa: Funções afins');
    confere(/Ainda não começou/.test(await U.texto(pg)), 'mapa: "Ainda não começou"');
    await foto('estudar');
    await cap(pg, 'mapa');
    // página do tópico (o primeiro tópico de prática disponível)
    const id = await pg.evaluate(() => window.__prumo.nucleo.prat.ids()[0]);
    await pg.click(`a.topico-linha[href="#/estudar/${id}"]`);
    await pg.waitForSelector('[data-acao="estudarTopico"]');
    confere(await tem('Por que cai no Enem'), 'tópico: por que cai');
    confere(await tem('Estudar este tópico hoje'), 'tópico: botão');
    await foto('topico');
    await pg.click('[data-acao="estudarTopico"]');
    // pré-pergunta: sem acerto
    await pg.waitForFunction(() => window.__prumo.nucleo.estado() === 'pergunta');
    confere(await tem('Antes de ler a teoria'), 'pré-pergunta');
    const pre = await pg.evaluate(() => { const n = window.__prumo.nucleo, m = n.st.missao, it = n.missao.itemDe(m.passos[m.i].id); return { certa: it.gabarito, errada: it.alternativas.find(a => !a.certa).letra }; });
    await U.escolher(pg, pre.errada);
    await pg.waitForSelector('.teoria');
    confere(await tem('Resposta guardada. No fim da teoria você vê se acertou.'), 'teoria: resposta guardada, sem acerto');
    confere(!(await tem(`A certa é ${pre.certa}`)), 'teoria: nada de acerto durante a leitura');
    confere((await pg.$$('.teoria-secao')).length >= 3, 'teoria: seções');
    await foto('teoria');
    await cap(pg, 'teoria');
    await pg.click('.fim-leitura .botao');
    await pg.waitForSelector('.feedback');
    confere(await tem(`Antes de ler, você marcou ${pre.errada}. A certa é ${pre.certa}.`), 'a resposta da pergunta do começo, depois de ler');
    await U.continuar(pg);
    // questões do Enem: erra a 1ª, revê a teoria, acerta duas seguidas
    await pg.waitForFunction(() => window.__prumo.nucleo.estado() === 'pergunta');
    confere(/QUESTÃO \d+/.test((await U.texto(pg)).toUpperCase()), 'questão do Enem com o número');
    await foto('questao');
    await U.escolher(pg, await U.erradaDe(pg, 'E'));
    await pg.waitForSelector('.feedback');
    confere(await tem('O que faltou.'), 'feedback: o que faltou');
    confere(await tem('Rever a teoria'), 'feedback: "Rever a teoria"');
    await foto('feedback');
    await pg.click('[data-ev="VOLTAR_AO_TRECHO"]');
    await pg.waitForSelector('#trecho-corpo .teoria');
    await pg.click('.folha-pe [data-ev="VOLTAR"]');
    await U.continuar(pg);
    for (let g = 0; g < 20; g++) {
      const e = await U.estado(pg);
      if (e === 'encerramento') break;
      if (e === 'pergunta') { await U.responderCerta(pg); await pg.waitForSelector('.feedback'); }
      else if (e === 'feedback') await U.continuar(pg);
      else if (e === 'fimDaRodada') await pg.click('[data-ev="SEGUIR"]');
      else if (e === 'leitura') await pg.click('.fim-leitura .botao');
      await pg.waitForTimeout(80);
    }
    confere((await U.estado(pg)) === 'encerramento', 'fim: Pronto por hoje');
    confere((await pg.$('.pr-visto')) !== null, 'Pronto: o visto do dia');
    confere(/nível 1 de 5/.test(await U.texto(pg)), 'Pronto: o tópico no nível 1 de 5');
    await foto('pronto');
    confere(await tem('Se quiser, pode continuar estudando por conta própria.'), 'Pronto: convite neutro ao estudo livre');
    // "Amanhã começa por aqui" (só o enunciado) e "quando e onde" (vira o lembrete e aparece em Hoje)
    confere(await tem('Amanhã começa por aqui') && (await pg.$('.amanha .alternativas')) === null, 'Pronto: a pergunta de amanhã, sem alternativas');
    await pg.fill('#quando-hora', '18:00');
    await pg.click('.quando label.escolha:has(input[value="depois que eu chegar da escola"])');
    await pg.click('.quando button[type="submit"]');
    await pg.waitForSelector('.quando .intencao');
    confere(/Seu plano: .+, 18h, depois que eu chegar da escola\./.test(await U.texto(pg)), 'Pronto: plano guardado');
    await foto('pronto-quando');
    // estudo livre, por iniciativa do aluno: "Continuar estudando" → Estudar → outro tópico
    await pg.click('[data-acao="continuarEstudando"]');
    await pg.waitForSelector('.mapa-area');
    const outro = await pg.evaluate(i => window.__prumo.nucleo.prat.ids().find(x => x !== i), id);
    await pg.click(`a.topico-linha[href="#/estudar/${outro}"]`);
    await pg.waitForSelector('[data-acao="estudarTopico"]');
    confere(await tem('Estudar este tópico agora') && await tem('por conta própria'), 'tópico: estudo livre disponível');
    await pg.click('[data-acao="estudarTopico"]');
    for (let g = 0; g < 30; g++) {
      const e = await U.estado(pg);
      if (e === 'encerramento') break;
      if (e === 'pergunta') { await U.responderCerta(pg); await pg.waitForFunction(() => window.__prumo.nucleo.estado() !== 'pergunta' || !!document.querySelector('.feedback')); }
      else if (e === 'feedback') await U.continuar(pg);
      else if (e === 'fimDaRodada') await pg.click('[data-ev="SEGUIR"]');
      else if (e === 'leitura') await pg.click('.fim-leitura .botao');
      await pg.waitForTimeout(80);
    }
    confere(await tem('Estudo registrado') && (await pg.$('.pr-visto')) === null, 'estudo livre: registrado, sem segundo visto');
    await pg.click('[data-ev="FECHAR"]');
    await pg.waitForSelector('.trilho');
    confere((await U.estado(pg)) === 'feito', 'volta a missão do dia, já cumprida');
    confere(/Seu plano: .+, 18h, depois que eu chegar da escola\./.test(await U.texto(pg)), 'Hoje: "Seu plano: …"');
    confere(/Meta da semana:/.test(await U.texto(pg)) && (await pg.$$('.semana-marcas li')).length === 7, 'Hoje: meta da semana com 7 marcas');
    // a teoria segue livre
    await pg.evaluate(i => { location.hash = `#/estudar/${i}`; }, id);
    await pg.waitForSelector(`a[href="#/estudar/${id}/teoria"]`);
    await pg.click(`a[href="#/estudar/${id}/teoria"]`);
    await pg.waitForSelector('.teoria');
    confere(await tem('Leitura livre'), 'teoria em leitura livre');
    // Perfil: nome
    await pg.click('.trilho .aba[href="#/perfil"]');
    await pg.waitForSelector('#pf-nome');
    confere((await pg.inputValue('#pf-nome')) === 'Daniel', 'Perfil: nome');
    confere(await tem('Apagar tudo'), 'Perfil: dados');
    confere(await tem('Coleção de vistos') && (await pg.$$('.calendario .mini-visto')).length >= 1, 'Perfil: coleção de vistos com o carimbo de hoje');
    await foto('perfil');
    await U.recarregar(pg);
    confere((await U.estado(pg)) === 'feito', 'recarregar: o dia continua feito');
  } catch (e) {
    falhas.push(`exceção: ${e.message}`);
    console.log(e);
  } finally {
    if (erros.length) falhas.push(...erros);
    await nav.close();
  }
  return falhas;
}

(async () => {
  const motores = process.argv[2] ? [process.argv[2]] : ['chromium', 'webkit'];
  const temas = process.argv[3] ? [process.argv[3]] : ['light', 'dark'];
  let total = 0;
  for (const m of motores) for (const t of temas) {
    const f = await roteiro(m, t);
    console.log(`[${m} ${t}] ${f.length ? 'FALHAS: ' + f.join(' | ') : 'ok'}`);
    total += f.length;
  }
  process.exit(total ? 1 : 0);
})();
