// Roteiro g.7, passos 1 a 7, de verdade no navegador (Primeiro uso → Pronto por hoje → Hoje feito),
// com recarga no meio da missão, Voltar do sistema, folha "Encerrar" e "Parar e continuar mais tarde".
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_g7.cjs [chromium|webkit] [light|dark]
const U = require('./comum.cjs');

async function roteiro(motor, tema) {
  const { nav, pg, erros } = await U.abrir(motor, tema);
  const { falhas, confere, cap } = U.criarConferencia(`g7-${motor}-${tema}`);
  const tem = async s => (await U.texto(pg)).includes(s);
  try {
    // 1 · Primeiro uso
    await pg.goto(U.BASE); await U.pronto(pg);
    confere(await tem('Ver com dados de exemplo'), 'onboarding: atalho dos dados de exemplo');
    await pg.click('[data-acao="puPular"]');
    confere(await tem('Já usei o Prumo: restaurar uma cópia'), 'link "Já usei o Prumo: restaurar uma cópia"');
    confere(await tem('Ver com dados de exemplo'), 'link "Ver com dados de exemplo"');
    await cap(pg, 'primeiro-uso', true);
    await pg.click('label.escolha:has(input[value="escola"])');
    await pg.fill('#pu-data', '2026-12-15');
    await pg.click('label:has(input[name="minutos"][value="25"])');
    await pg.click('button[type="submit"]');
    confere(await tem('"Prumo", às 19:00, segunda, terça, quarta e quinta'), 'texto do alarme');
    await cap(pg, 'alarme');
    await pg.click('[data-acao="puAlarme"][data-arg="criado"]');
    await cap(pg, 'fecho');
    await pg.click('[data-acao="puConcluir"]');

    // 2 · Hoje como folha de rosto; "Por que esta missão?" → "ver a regra"
    await pg.waitForSelector('.manchete');
    confere((await U.texto(pg)).toUpperCase().includes('MISSÃO 1'), 'Hoje: "Missão 1"');
    confere(await tem('Funções afins: Parte fixa e parte que varia'), 'Hoje: manchete com o nome do capítulo');
    confere((await pg.$('.pr-cabecalho')) !== null && await tem('Capítulo') && await tem('Tempo') && !(await tem('Data')), 'Hoje: Cabecalho (Capítulo | Páginas | Tempo), sem Data');
    confere(await tem('No fim, o visto do dia.'), 'Hoje: regra anuncia o visto');
    confere(await tem('0 dias estudados'), 'Hoje: 0 dias estudados');
    confere((await pg.evaluate(() => window.__prumo.nucleo.st.perfil.prova)) === '2026-12-15', 'perfil com a prova em 15/12');
    await cap(pg, 'hoje-primeiro-dia', true);
    await pg.click('[data-folha="passos"]'); await cap(pg, 'ver-passos');
    confere(await tem('Pergunta antes do § 4'), 'ver passos: "Pergunta antes do § 4"');
    await pg.click('#folha-raiz .folha-pe [data-acao="fecharFolha"]');
    await pg.click('[data-folha="porQue"]'); await cap(pg, 'por-que');
    await pg.click('[data-acao="verRegraPorQue"]'); await cap(pg, 'ver-a-regra');
    confere(/\d+\. sim: /.test(await U.texto(pg)), 'ver a regra: a linha da regra que decidiu ("N. sim: …")');
    await pg.click('#folha-raiz .folha-pe [data-acao="fecharFolha"]');
    await pg.waitForTimeout(150);
    confere(!(await pg.$('#folha-raiz .folha')), 'folha fechada');

    // 3 · Pré-pergunta da p. 1 (sem sinal de acerto) + leitura + checagem
    await pg.click('[data-ev="COMECAR"]');
    await pg.waitForSelector('.alternativas');
    confere(await tem('Antes de ler a p. 1'), 'rótulo Antes de ler a p. 1');
    confere(await tem('Tente antes de ler. Esta página responde.'), 'aviso da pré-pergunta');
    confere(await tem('2 acertos seguidos, um deles numa questão do Enem'), 'regra da rodada no início');
    confere((await pg.getAttribute('[data-acao="responder"]', 'aria-disabled')) === 'true', 'Responder começa desabilitado');
    await cap(pg, 'pre-p1', true);
    await U.escolher(pg, await U.erradaDe(pg, 'A'));
    await pg.waitForSelector('.pagina-livro');
    confere(await tem('Resposta guardada.'), 'faixa "Resposta guardada."');
    confere(!(await tem('Certa')) && !(await tem('acertou')), 'leitura não revela acerto');
    confere(await tem('Já sei isto: ir para a próxima pergunta'), '"Já sei isto" na leitura');
    await cap(pg, 'leitura-p1', true);
    // recarregar no meio da missão volta ao mesmo passo, sem gravar tentativa
    const t0 = await U.tentativas(pg);
    await U.recarregar(pg);
    confere((await U.estado(pg)) === 'leitura' && (await tem('Um preço com duas partes')), 'recarga: volta à leitura da p. 1');
    confere((await U.tentativas(pg)) === t0, 'recarga: nenhuma tentativa a mais');
    // Voltar do sistema na missão abre a folha "Encerrar"
    if (motor === 'chromium') {
      await pg.goBack(); await pg.waitForTimeout(300);
      confere((await pg.$('#folha-raiz .folha')) !== null && (await tem('Parar agora?')), 'Voltar do sistema abre "Encerrar"');
      if (await pg.$('#folha-raiz .folha')) await pg.click('#folha-raiz .folha-pe [data-acao="fecharFolha"]');
      await pg.waitForTimeout(200);
      confere((await U.estado(pg)) === 'leitura' && !(await pg.$('#folha-raiz .folha')), 'Voltar à missão mantém a leitura');
    }
    await pg.click('[data-acao="termineiLer"]');
    await pg.waitForSelector('.alternativas');
    confere(await tem('Confira a p. 1'), 'checagem da p. 1');
    confere(await tem('Isso fica só neste aparelho. Ninguém da escola vê.'), 'aviso da primeira checagem');
    await cap(pg, 'checagem-p1');
    await U.responderCerta(pg);
    await pg.waitForSelector('.feedback');
    confere(await tem('Certa.'), 'checagem certa');
    const mdChecagem = await pg.evaluate(() => { const v = window.__prumo.nucleo.tela().vm; const t = v && (v.topo || {}); return t.medidor ? t.medidor.texto : null; });
    console.log(`  [${motor} ${tema}] medidor depois da checagem: ${mdChecagem}`);
    // a frase do medidor é do núcleo (hoje: "Falta acertar uma questão do Enem", a casa que falta); a tela mostra a que vier
    confere((await pg.$('.casa.cheia')) !== null && !!mdChecagem && (await tem(mdChecagem)), 'medidor: checagem cheia e a frase do que falta');
    confere((await pg.getAttribute('[data-continuar]', 'aria-disabled')) === 'true', 'intervalo deliberativo: Continuar começa travado');
    confere(await tem('Leia a explicação'), '"Leia a explicação" durante a pausa');
    await cap(pg, 'feedback-checagem');
    await U.continuar(pg);

    // 4 · Pré-pergunta da p. 2 + "Já sei isto" + pré-pergunta do § 4
    await pg.waitForSelector('.alternativas');
    confere(await tem('Antes de ler a p. 2'), 'pré-pergunta da p. 2');
    await U.escolher(pg, await U.gabarito(pg));
    await pg.waitForSelector('.pagina-livro');
    confere(await tem('Resposta guardada. Na primeira revisão do capítulo você vê se acertou.'), 'faixa da p. 2');
    await cap(pg, 'leitura-p2');
    await pg.click('[data-ev="JA_SEI"]');
    await pg.waitForSelector('.alternativas');
    confere(await tem('Antes do parágrafo 4'), 'pré-pergunta do § 4');
    confere(await tem('Tente antes de ler. O parágrafo 4 responde.'), 'aviso da pré-pergunta de bloco');
    await cap(pg, 'pre-bloco-p2');
    await U.escolher(pg, 'C');
    await pg.waitForSelector('.pagina-livro');
    confere(await tem('Porcentagem também vira fórmula'), 'leitura do § 4');
    await pg.fill('#nota-campo', 'Usa x − 1 quando alguém não entra na conta por dia.');
    await cap(pg, 'leitura-p2-nota', true);
    await pg.click('[data-acao="termineiLer"]');
    await pg.waitForSelector('.alternativas');
    confere((await pg.evaluate(() => window.__prumo.nucleo.st.notas.length)) === 1, 'nota da página guardada ao terminar de ler');
    confere(await tem('Confira a p. 2'), 'checagem da p. 2');
    await U.responderCerta(pg);
    await pg.waitForSelector('.feedback');
    await U.continuar(pg);

    // 5 · 2023 Q162, errando com E; trecho com o fio de prumo; folha Encerrar; Parar e continuar
    await pg.waitForSelector('.alternativas');
    confere((await tem('QUESTÃO 162')) && (await tem('Enem 2023, 2º dia')), 'questão do Enem 2023 Q162');
    confere((await pg.$('.rodape-licenca a[href*="creativecommons.org/licenses/by-nd/3.0"]')) !== null, 'atribuição com link da licença');
    await cap(pg, 'enem-q162', true);
    const t1 = await U.tentativas(pg);
    await U.recarregar(pg);
    confere((await U.estado(pg)) === 'pergunta' && (await tem('questão 162')), 'recarga: volta à Q162');
    confere((await U.tentativas(pg)) === t1, 'recarga na pergunta: nenhuma tentativa a mais');
    await U.escolher(pg, 'E');
    await pg.waitForSelector('.feedback');
    confere(await tem('Você marcou E. A certa é D.'), 'feedback de erro');
    confere(await tem('O que faltou'), '"o que faltou"');
    confere(await tem('A próxima é sobre o trecho que faltou'), 'medidor: "A próxima é sobre o trecho que faltou"');
    confere(await tem('A próxima é uma questão da equipe sobre a p. 1, § 2.'), 'aviso da questão da equipe');
    confere((await pg.$('.alt.sua')) !== null && (await pg.$('.alt.certa')) !== null, 'alternativas marcadas "sua" e "certa"');
    await cap(pg, 'feedback-erro-q162', true);
    await pg.click('[data-ev="VOLTAR_AO_TRECHO"]');
    await pg.waitForSelector('.par.ancora');
    confere((await pg.getAttribute('.par.ancora', 'id')) === 'mat-fa.p1.b1.s2', 'fio de prumo no p. 1, § 2');
    const visivel = await pg.evaluate(() => { const a = document.querySelector('.par.ancora').getBoundingClientRect(); return a.top >= 0 && a.top < innerHeight; });
    confere(visivel, 'trecho rolado até o parágrafo');
    await cap(pg, 'trecho-fio-de-prumo');
    if (motor === 'chromium') { await pg.goBack(); await pg.waitForTimeout(300); confere((await U.estado(pg)) === 'feedback', 'Voltar do sistema no trecho volta ao resultado'); }
    else await pg.click('[data-ev="VOLTAR"]');
    await pg.waitForSelector('.feedback');
    await U.recarregar(pg);
    confere((await U.estado(pg)) === 'feedback' && (await tem('Você marcou E. A certa é D.')), 'recarga: volta ao feedback');
    await pg.click('[data-folha="encerrar"]');
    await pg.waitForSelector('#folha-raiz .folha');
    confere((await tem('Parar e continuar mais tarde')) && (await tem('aberta até a meia-noite')) && (await tem('Encerrar por hoje')), 'folha Encerrar com duas saídas');
    await cap(pg, 'folha-encerrar');
    await pg.click('#folha-raiz [data-ev="PAUSAR"]');
    await pg.waitForSelector('.manchete');
    confere(/Continuar do passo \d+ de \d+/.test(await U.texto(pg)) && /aberta até a meia.noite/.test(await U.texto(pg)), 'Hoje em curso: "Continuar do passo N de M"');
    await cap(pg, 'hoje-em-curso');
    await pg.click('[data-ev="CONTINUAR"]');
    await pg.waitForSelector('.feedback');
    confere((await U.estado(pg)) === 'feedback', 'Continuar volta ao feedback');
    await U.continuar(pg);

    // 6 · Questão da equipe (inserida) e 2023 Q150, acertando as duas
    await pg.waitForSelector('.alternativas');
    confere(await tem('QUESTÃO DA EQUIPE'), 'questão da equipe inserida');
    confere(await tem('Depois do erro: uma questão da equipe sobre a p. 1, § 2.'), 'inserida anunciada no topo');
    await cap(pg, 'questao-equipe-inserida');
    await U.responderCerta(pg);
    await pg.waitForSelector('.feedback');
    await U.continuar(pg);
    await pg.waitForSelector('.alternativas');
    confere(await tem('questão 150'), 'Q150');
    await U.responderCerta(pg);
    await pg.waitForSelector('.feedback');
    confere((await pg.$$('.casa.cheia')).length === 2, 'medidor: duas casas cheias na vitória');
    await cap(pg, 'feedback-vitoria');
    await U.continuar(pg);

    // 7 · Pronto por hoje (direto, sem Fim da rodada) → Hoje feito sem nenhuma oferta
    await pg.waitForSelector('.colofao');
    confere((await U.estado(pg)) === 'encerramento', 'direto ao Pronto por hoje');
    confere(await tem('Pronto por hoje'), 'título do colofão');
    confere(await tem('1 dia estudado'), '"1 dia estudado"');
    confere(await tem('O capítulo Parte fixa e parte que varia entrou no nível 1 de 5. Próxima revisão: amanhã'), 'linha do nível novo');
    confere(await tem('Amanhã você vê se acertou a pergunta antes da p. 2.'), 'gancho do próximo dia');   // núcleo: "pergunta antes da p. N"
    confere((await pg.$('.pr-visto')) !== null && /\d\d\/\d\d\/\d{4}/.test(await pg.textContent('.pr-visto-data')), 'visto do dia com a data dd/mm/aaaa');
    await cap(pg, 'pronto-por-hoje', true);
    const nt = await U.tentativas(pg);
    confere(nt === 5, `5 tentativas avaliadas (veio ${nt})`);
    await pg.click('[data-ev="FECHAR"]');
    await pg.waitForSelector('.estado-texto');
    confere(await tem('Hoje está feito.'), 'Hoje feito');
    confere(!(await pg.$('[data-ev="COMECAR"]')) && !(await pg.$('.bloco-prova')), 'Feito: nenhuma oferta');
    await cap(pg, 'hoje-feito', true);
    const t = (await U.texto(pg)).toLowerCase();
    confere(!/perdeu|\bxp\b|moeda|ranking/.test(t), 'sem palavras proibidas');
  } catch (e) {
    falhas.push('exceção: ' + e.message.split('\n')[0]);
    await cap(pg, 'excecao', true).catch(() => {});
    console.log(e);
  }
  if (erros.length) falhas.push(...erros);
  await nav.close();
  return falhas;
}

(async () => {
  const motores = process.argv[2] ? [process.argv[2]] : ['chromium', 'webkit'];
  const temas = process.argv[3] ? [process.argv[3]] : ['light', 'dark'];
  let total = 0;
  for (const m of motores) for (const t of temas) {
    const f = await roteiro(m, t);
    console.log(`${m} ${t}: ${f.length ? f.length + ' falha(s)' : 'ok'}`);
    f.forEach(x => console.log('   -', x));
    total += f.length;
  }
  process.exit(total ? 1 : 0);
})();
