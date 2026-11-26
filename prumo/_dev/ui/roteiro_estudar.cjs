// Roteiro de Estudar, no navegador: apresentação (3 telas, régua Pergunta · Leitura · Questões) → configuração
// (uma tela: prova e nome; dias, minutos e matérias como padrão em texto) → Hoje (saudação e
// "Seu próximo conteúdo") → aba Estudar (4 áreas, "em breve") → página do tópico → "Estudar este tópico
// hoje" → pré-pergunta (sem acerto) → teoria (apostila) → a resposta da pré-pergunta → questões do Enem
// (erro com "o que faltou" e "Rever a apostila") → fim → Pronto por hoje com o visto → o botão do tópico
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
    // apresentação: 3 telas, um conceito por tela, régua .trilha (Pergunta · Leitura · Questões)
    const atual = () => pg.$eval('.onb .trilha li[aria-current="step"]', li => li.innerText.trim());
    confere(await tem('Como o Prumo ensina'), 'apresentação: rótulo "Como o Prumo ensina"');
    confere(await tem('Primeiro, uma pergunta.') && await tem('você vai ler já procurando a resposta'), 'apresentação 1');
    confere((await pg.$$('.onb .trilha li')).length === 3, 'apresentação: régua com 3 casas');
    confere((await atual()).includes('Aquecer'), 'apresentação 1: casa atual "Aquecer"');
    confere((await pg.textContent('.onb .so-leitor')).trim() === 'Tela 1 de 3', 'leitor de tela: "Tela 1 de 3"');
    confere((await pg.$('[data-acao="puPular"]')) !== null && await tem('Ver com dados de exemplo'), 'apresentação 1: Pular e dados de exemplo');
    confere(!(await tem('Como instalar no celular')), 'apresentação: "Como instalar no celular" fica na configuração');
    confere(await pg.evaluate(() => document.activeElement && document.activeElement.id === 'onb-t'), 'apresentação: foco no título');
    await foto('onboarding-1');
    await pg.click('[data-acao="puProximo"]');
    confere(await tem('Depois, a explicação.') && (await atual()).includes('Leitura'), 'apresentação 2');
    confere((await pg.textContent('.onb .trilha li.feita')).includes('✓'), 'apresentação 2: etapa anterior com ✓');
    confere((await pg.textContent('.onb .so-leitor')).trim() === 'Tela 2 de 3', 'leitor de tela: "Tela 2 de 3"');
    await foto('onboarding-2');
    await pg.click('[data-acao="puProximo"]');
    confere(await tem('Por fim, questões do Enem.') && (await atual()).includes('Questões'), 'apresentação 3');
    confere((await pg.textContent('.onb-frase')).replace(/ /g, ' ') === 'Você treina com o que já caiu no Enem.', 'apresentação 3: frase em destaque');
    confere((await pg.$('[data-acao="puPular"]')) === null, 'apresentação 3: sem Pular');
    confere(/Montar meu plano/.test(await pg.textContent('[data-acao="puProximo"]')), 'apresentação 3: "Montar meu plano"');
    await foto('onboarding');
    await pg.click('[data-acao="puProximo"]');
    // configuração: uma tela, duas perguntas, o resto como padrão em texto
    confere(await tem('Vamos montar o seu plano') && await tem('Duas perguntas e a primeira missão fica pronta.'), 'configuração: título e frase');
    confere(!(await tem('Passo 1 de 3')), 'configuração: sem "Passo 1 de 3"');
    confere(await pg.$eval('input[name="provaTipo"][value="enem"]', i => i.checked), 'configuração: Enem já marcado');
    confere((await pg.$('#pu-data')) === null, 'Enem: sem campo de data');
    confere(!(await tem('Marque também')), 'dica do Enem não pede duas escolhas');
    confere(/Para começar: seg, ter, qua,? (e )?qui.*, 25 min por dia, Matemática e Linguagens\./.test(await U.texto(pg)), 'padrões em texto');
    confere(await pg.$eval('#pu-mudar', d => !d.open), '"Mudar dias e minutos agora" começa fechado');
    confere((await pg.$('input[name="areas"]')) === null, 'configuração: matérias fora do formulário');
    confere(await tem('Seus dados ficam só neste aparelho.') && await tem('Como instalar no celular'), 'dados e "Como instalar no celular"');
    confere(await pg.evaluate(() => { const b = document.querySelector('.acoes-pu button[type="submit"]'); return ['puRestaurar', 'puExemplo'].every(a => !!(b.compareDocumentPosition(document.querySelector(`[data-acao="${a}"]`)) & Node.DOCUMENT_POSITION_FOLLOWING)); }), 'restaurar e exemplo abaixo do botão');
    confere((await pg.getAttribute('button[type="submit"]', 'aria-disabled')) === null, 'botão nunca desativado');
    const alto = await pg.evaluate(() => document.documentElement.scrollHeight);
    confere(alto <= 844 * 1.5, `configuração cabe em tela e meia (${alto} px)`);
    await foto('primeiro-uso');
    await pg.fill('#pu-nome', 'Daniel');
    await pg.click('label.escolha:has(input[value="escola"])');
    confere((await pg.inputValue('#pu-nome')) === 'Daniel', 'o nome fica ao trocar a prova');
    confere(await tem('Com a data, o Prumo marca as revisões até o dia da prova.'), 'ajuda da data');
    await pg.fill('#pu-data', '2026-12-15');
    await pg.click('button[type="submit"]');
    await pg.waitForSelector('.jogo-topo');
    confere((await pg.evaluate(() => window.__prumo.nucleo.st.perfil.areas)).join() === 'MT,LC', 'perfil: Matemática e Linguagens');
    confere((await pg.evaluate(() => window.__prumo.nucleo.st.missao.tipo)) !== 'folga', 'primeiro dia não é folga');
    confere((await pg.$('.fase-atual .bolha-inicio[data-ev="COMECAR"]')) !== null, 'Início: Começar no balão da fase atual');
    await foto('hoje');
    // abas: 4, com ícone
    confere((await pg.$$('.trilho .aba')).length === 4 && (await pg.$$('.trilho .aba svg')).length === 4, '4 abas com ícone');
    // Início: só a trilha da matéria escolhida; as outras no seletor
    confere((await pg.$$('.jogo .trilha-fases')).length === 1, 'Início: uma matéria por vez');
    await pg.click('.jogo-materia'); await pg.waitForSelector('.materias');
    for (const a of ['Matemática', 'Linguagens', 'Ciências da Natureza', 'Ciências Humanas']) confere(await tem(a), `seletor: ${a}`);
    confere((await pg.$$('.materia-op.inativa')).length === 2, 'seletor: áreas sem conteúdo com cadeado');
    await pg.click('[data-acao="escolherMateria"][data-arg="MT"]'); await pg.waitForSelector('.materias', { state: 'detached' });
    await pg.click('.unidade-guia'); await pg.waitForSelector('.guia-missao');
    confere(await tem('Seu próximo conteúdo'), 'guia: o próximo conteúdo');
    await pg.click('#folha-raiz [data-acao="fecharFolha"]'); await pg.waitForSelector('.guia-missao', { state: 'detached' });
    confere((await pg.$$('.fase-atual')).length > 0, 'trilha: fase atual');
    confere((await pg.$$('.fase-bloqueada')).length > 0, 'trilha: fases bloqueadas');
    confere((await pg.$$('.fase-chefe')).length === 1, 'trilha: o Chefão');
    await foto('estudar');
    await cap(pg, 'mapa');
    // página do tópico (o primeiro tópico de prática disponível)
    const id = await pg.evaluate(() => window.__prumo.nucleo.prat.ids()[0]);
    await pg.click(`[data-folha="fase"][data-arg="${id}"]`);
    await pg.waitForSelector('.balao-fase');
    confere(await tem('Você ganha:'), 'balão: o que se ganha');
    await pg.click('#folha-raiz a.botao');
    await pg.waitForSelector('[data-acao="estudarTopico"]');
    confere(!(await tem('Por que cai no Enem')) && !(await tem('O essencial')), 'tópico: sem textos de apoio (só o botão)');
    confere(await tem('Estudar este tópico hoje'), 'tópico: botão');
    await foto('topico');
    await pg.click('[data-acao="estudarTopico"]');
    // pré-pergunta: sem acerto
    await pg.waitForFunction(() => window.__prumo.nucleo.estado() === 'pergunta');
    confere(await tem('Aquecimento: antes da apostila'), 'pré-pergunta');
    const pre = await pg.evaluate(() => { const n = window.__prumo.nucleo, m = n.st.missao, it = n.missao.itemDe(m.passos[m.i].id); return { certa: it.gabarito, errada: it.alternativas.find(a => !a.certa).letra }; });
    await U.escolher(pg, pre.errada);
    await pg.waitForSelector('.teoria');
    confere(await tem('Resposta guardada. No fim da apostila você vê se acertou.'), 'teoria: resposta guardada, sem acerto');
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
    confere(await tem('Rever a apostila'), 'feedback: "Rever a apostila"');
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
    confere(await tem('Passou de fase!'), 'Pronto: passou de fase');
    confere(/Fase \d+ liberada/.test(await U.texto(pg)), 'Pronto: a próxima fase liberada');
    await cap(pg, 'passou-fase', true);
    await foto('pronto');
    confere(await tem('Se quiser, pode continuar estudando por conta própria.'), 'Pronto: convite neutro ao estudo livre');
    // "Amanhã começa por aqui" (só o enunciado) e "quando e onde" (vira o lembrete e aparece em Hoje)
    confere(!(await tem('Amanhã começa por aqui')), 'Pronto: sem a pergunta de amanhã (tela enxuta)');
    await pg.click('.quando-detalhes > summary');
    await pg.fill('#quando-hora', '18:00');
    await pg.click('.quando label.escolha:has(input[value="depois que eu chegar da escola"])');
    await pg.click('.quando button[type="submit"]');
    await pg.waitForSelector('.quando .intencao');
    confere(/Seu plano: .+, 18h, depois que eu chegar da escola\./.test(await U.texto(pg)), 'Pronto: plano guardado');
    await foto('pronto-quando');
    // estudo livre, por iniciativa do aluno: "Continuar estudando" → Estudar → outro tópico
    await pg.click('[data-acao="continuarEstudando"]');
    await pg.waitForSelector('.jogo .trilha-fases');
    const outro = await pg.evaluate(i => window.__prumo.nucleo.prat.ids().find(x => x !== i), id);
    await pg.click(`[data-folha="fase"][data-arg="${outro}"]`); await pg.waitForSelector(".balao-fase"); await pg.click("#folha-raiz a.botao");
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
    confere((await pg.$('.bolha-inicio.feito')) !== null, 'Início: "Feito hoje" no balão');
    await pg.click('.unidade-guia'); await pg.waitForSelector('.guia-missao');
    confere(/Seu plano: .+, 18h, depois que eu chegar da escola\./.test(await U.texto(pg)), 'guia: "Seu plano: …"');
    await pg.click('#folha-raiz [data-acao="fecharFolha"]'); await pg.waitForSelector('.guia-missao', { state: 'detached' });
    await pg.click('.jogo-contador'); await pg.waitForSelector('.semana-marcas');
    confere(/Meta da semana:/.test(await U.texto(pg)) && (await pg.$$('.semana-marcas li')).length === 7, 'dias estudados: meta da semana com 7 marcas');
    await pg.keyboard.press('Escape');
    // a teoria segue livre
    await pg.evaluate(i => { location.hash = `#/estudar/${i}`; }, id);
    await pg.waitForSelector(`a[href="#/estudar/${id}/teoria"]`);
    await pg.click(`a[href="#/estudar/${id}/teoria"]`);
    await pg.waitForSelector('.teoria');
    confere(await tem('Leitura livre'), 'teoria em leitura livre');
    // Perfil: nome
    await pg.click('.trilho .aba[href="#/perfil"]');
    await pg.waitForSelector('#pf-nome', { state: 'attached' });   // fica em "Seu nome e seu plano", recolhido
    confere((await pg.inputValue('#pf-nome')) === 'Daniel', 'Perfil: nome');
    confere(!(await tem('Apagar tudo')), 'Perfil: ajustes recolhidos');
    for (const sm of await pg.$$('.perfil-grupo > summary')) await sm.click();
    confere(await tem('Apagar tudo'), 'Perfil: dados (em Ajustes)');
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
