// Roteiro dos outros estados, no navegador:
//  A) estado de exemplo (Decisão 5): faixa do modo demonstração, revisão atrasada, revisão errada
//     (c.3h, sem "perdeu"), mão de cards inteira (virar, Lembrei, Ainda não, ver o trecho, card que
//     volta uma vez, resumo), Pronto por hoje, e os estados de Hoje pelos dias simulados
//     (Questão do dia, folga com "Estudar mesmo assim", modo retorno); "Sair" da demonstração.
//  B) 2º dia de estudo real: 1ª revisão com "antes x depois", Cap. 2 com imagem do Enem (zoom em
//     tela cheia) e o Fim da rodada com o nível se preenchendo.
// Uso (na pasta prumo/): NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_estados.cjs [chromium|webkit] [light|dark]
const U = require('./comum.cjs');

async function parteA(motor, tema) {
  const { nav, pg, erros } = await U.abrir(motor, tema);
  const { falhas, confere, cap } = U.criarConferencia(`ex-${motor}-${tema}`);
  const tem = async s => (await U.texto(pg)).includes(s);
  try {
    await pg.goto(U.BASE); await U.pronto(pg);
    await pg.click('[data-acao="puExemplo"]');
    await pg.waitForSelector('.faixa-demo');
    confere(await tem('Modo demonstração · dados de exemplo'), 'faixa do modo demonstração');
    confere((await pg.$('.faixa-demo [data-acao="sairDemo"]')) !== null, 'faixa com "Sair"');
    const vm = await pg.evaluate(() => window.__prumo.nucleo.tela().vm);
    console.log(`  [${motor} ${tema}] exemplo hoje: ${vm.estado} · ${vm.bloco && vm.bloco.titulo} · ${vm.bloco && vm.bloco.composicao} · ${vm.bloco && vm.bloco.atrasada}`);
    confere(/dias estudados/.test(await U.texto(pg)), 'constância com "N dias estudados"');
    confere((await pg.$('.chama.acesa')) !== null, 'chama acesa (semanas com a meta no exemplo)');
    await cap(pg, 'hoje-exemplo', true);
    if (vm.bloco && vm.bloco.atrasada) confere(await tem(vm.bloco.atrasada), 'linha da revisão atrasada');

    // missão do exemplo: revisão(ões) e mão de cards
    await pg.click('[data-ev="COMECAR"]');
    let errouRevisao = false, viuCards = false, viuPendente = false, viuVolta = false;
    for (let g = 0; g < 80; g++) {
      const e = await U.estado(pg);
      if (e === 'encerramento') break;
      if (e === 'pergunta') {
        const rot = (await pg.textContent('.pergunta-cabeca .rotulo')) || '';
        if (/REVISÃO/.test(rot) && !errouRevisao) {
          confere(await tem('Vale a primeira resposta.'), 'revisão: "Vale a primeira resposta."');
          await cap(pg, 'revisao-pergunta');
          await U.escolher(pg, await U.erradaDe(pg, 'E'));
          await pg.waitForSelector('.feedback');
          const t = await U.texto(pg);
          confere(/volta para Aprendendo|continua em Aprendendo/.test(t) && t.includes('Seu histórico continua.'), 'revisão errada: texto de c.3h');
          confere(!/perdeu/i.test(t), 'revisão errada sem "perdeu"');
          confere((await pg.$('.nivel i.novo')) === null, 'nível que desce sem animação');
          await cap(pg, 'revisao-errada', true);
          errouRevisao = true;
        } else await U.responderCerta(pg);
        await pg.waitForSelector('.feedback');
        await U.continuar(pg);
      } else if (e === 'leitura') await pg.click('[data-acao="termineiLer"]');
      else if (e === 'fimDaRodada' || e === 'fimDaMao') { await cap(pg, e); await pg.click('.barra [data-ev="SEGUIR"]'); }
      else if (e === 'cards') {
        const v = await pg.evaluate(() => window.__prumo.nucleo.tela().vm);
        if (!viuCards) {
          confere((await pg.$('.ficha')) !== null, 'ficha do card');
          await cap(pg, 'card-frente');
          await pg.click('.barra [data-ev="VIRAR"]');
          await pg.waitForTimeout(400);
          confere((await pg.$('.ficha-giro.virado')) !== null, 'card virado');
          await cap(pg, 'card-verso');
          await pg.click('.barra [data-ev="AINDA_NAO"]');
          await pg.waitForSelector('.mao-pendente');
          confere(await tem('Este card volta uma vez no fim desta mão.'), '"Ainda não": volta uma vez');
          confere(/ver o trecho · p\. \d+, § \d+/.test(await U.texto(pg)), '"ver o trecho · p. X, § Y"');
          await cap(pg, 'card-ainda-nao');
          await pg.click('.mao-pendente [data-ev="VER_TRECHO"]');
          await pg.waitForSelector('.par.ancora');
          await cap(pg, 'card-trecho');
          await pg.click('.folha-pe [data-ev="VOLTAR"]');
          await pg.waitForSelector('.mao-pendente');
          await pg.click('.barra [data-ev="SEGUIR"]');
          viuCards = true; viuPendente = true;
          continue;
        }
        if (v.repeticao && !viuVolta) { confere(/DE VOLTA/i.test(await U.texto(pg)), 'card de volta no fim da mão'); await cap(pg, 'card-de-volta'); viuVolta = true; }
        if (!v.virado) await pg.click('.barra [data-ev="VIRAR"]');
        else await pg.click('.barra [data-ev="LEMBREI"]');
        await pg.waitForTimeout(60);
      } else { falhas.push('estado inesperado: ' + e); break; }
    }
    confere(viuPendente && viuVolta, 'mão de cards completa (Ainda não + volta)');
    await pg.waitForSelector('.colofao');
    const tp = await U.texto(pg);
    confere(/\d+ cards · \d+ lembrados/.test(tp), 'resumo da mão no Pronto por hoje');
    await cap(pg, 'pronto-exemplo', true);
    await pg.click('[data-ev="FECHAR"]');
    await pg.waitForSelector('.estado-texto');
    confere(!(await pg.$('[data-ev="COMECAR"]')) && !(await pg.$('.bloco-prova')), 'feito sem ofertas');

    // estados de Hoje pelos dias simulados (modo demonstração)
    const vistos = {};
    for (let k = 1; k <= 16 && Object.keys(vistos).length < 4; k++) {
      await pg.evaluate(() => { window.__prumo.nucleo.avancarDias(1); window.__prumo.app.render(); });
      await pg.waitForTimeout(120);
      const v = await pg.evaluate(() => window.__prumo.nucleo.tela().vm);
      const chave = v.estado;
      if (['questaoDoDia', 'folga', 'retorno', 'firme'].includes(chave) && !vistos[chave]) {
        vistos[chave] = true;
        confere(await tem('data simulada'), `faixa com a data simulada (${chave})`);
        await cap(pg, `hoje-${chave}`, true);
        if (chave === 'folga') {
          confere(await tem('Hoje é folga. Nada vence por isso.'), 'folga: texto');
          await pg.click('[data-ev="ESTUDAR_MESMO_ASSIM"]');
          await pg.waitForTimeout(150);
          await cap(pg, 'hoje-folga-estudar-mesmo-assim', true);
        }
        if (chave === 'retorno') confere(/revis(ão passou|ões passaram) para hoje; a missão de hoje tem só revisões\./.test(await U.texto(pg)), 'modo retorno: texto');
        if (chave === 'questaoDoDia') confere(/questões dos capítulos que você já abriu|questão dos capítulos que você já abriu/.test(await U.texto(pg)), 'Questão do dia: texto');
      }
    }
    // estudando todo dia (pelo núcleo), as revisões ficam em dia e aparece a Questão do dia
    for (let k = 1; k <= 21 && !(vistos.questaoDoDia || vistos.firme); k++) {
      await pg.evaluate(() => {
        const n = window.__prumo.nucleo;
        n.avancarDias(1);
        const v = n.tela().vm;
        if (v && (v.estado === 'questaoDoDia' || v.estado === 'firme')) return;
        if (v && v.acao && v.acao.evento === 'COMECAR') {
          n.despachar('COMECAR');
          for (let g = 0; g < 300; g++) {
            const e = n.estado(), m = n.st.missao, p = m.passos[m.i];
            if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: n.pack.item(p.id).gabarito });
            else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
            else if (e === 'feedback') { m.feedbackEm = 0; n.despachar('CONTINUAR'); }
            else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
            else if (e === 'cards') n.despachar(m.mao.virado ? 'LEMBREI' : 'VIRAR');
            else if (e === 'encerramento') { n.despachar('FECHAR'); break; }
            else break;
          }
        }
      });
      await pg.evaluate(() => window.__prumo.app.render());
      await pg.waitForTimeout(100);
      const v = await pg.evaluate(() => window.__prumo.nucleo.tela().vm);
      if ((v.estado === 'questaoDoDia' || v.estado === 'firme') && !vistos[v.estado]) {
        vistos[v.estado] = true;
        await cap(pg, `hoje-${v.estado}`, true);
        confere(/dos capítulos que você já abriu|está firme/.test(await U.texto(pg)), 'Questão do dia: texto');
      }
    }
    console.log(`  [${motor} ${tema}] estados vistos: ${Object.keys(vistos).join(', ')}`);
    confere(vistos.questaoDoDia || vistos.firme, 'estado Questão do dia visto');
    confere(vistos.folga, 'estado folga visto');
    // Ajustes: régua no lugar da chama
    await pg.evaluate(() => { window.__prumo.nucleo.definirSimbolo('regua'); window.__prumo.app.render(); });
    await pg.waitForTimeout(100);
    confere((await pg.$('.cabecalho .regua')) !== null, 'régua no cabeçalho quando escolhida em Ajustes');
    await cap(pg, 'hoje-com-regua');
    await pg.evaluate(() => { window.__prumo.nucleo.definirSimbolo('chama'); });
    // Sair da demonstração
    await pg.click('.faixa-demo [data-acao="sairDemo"]');
    await pg.waitForTimeout(200);
    confere((await U.estado(pg)) === 'primeiroUso', 'Sair da demonstração volta ao Primeiro uso');
  } catch (e) {
    falhas.push('exceção: ' + e.message.split('\n')[0]);
    await cap(pg, 'excecao', true).catch(() => {});
    console.log(e);
  }
  if (erros.length) falhas.push(...erros);
  await nav.close();
  return falhas;
}

async function parteB(motor, tema) {
  const { nav, pg, erros } = await U.abrir(motor, tema);
  const { falhas, confere, cap } = U.criarConferencia(`dia2-${motor}-${tema}`);
  const tem = async s => (await U.texto(pg)).includes(s);
  try {
    await pg.goto(U.BASE); await U.pronto(pg);
    // dia 1 jogado pelo núcleo (a tela já foi conferida no roteiro g.7); pré-pergunta da p. 2 marcada errada
    await pg.evaluate(() => {
      const n = window.__prumo.nucleo;
      n.concluirPrimeiroUso({ provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4, 5], minutos: 25 });
      n.definirSimbolo('regua');   // Decisão 3: a régua no lugar da chama (Ajustes)
      n.definirSom(true);          // d.12: com som, nada pode quebrar
      n.despachar('COMECAR');
      for (let g = 0; g < 200; g++) {
        const e = n.estado(), m = n.st.missao, p = m.passos[m.i];
        if (e === 'pergunta') {
          const it = n.pack.item(p.id);
          const alt = p.t === 'pre' ? it.alternativas.find(a => !a.certa).letra : it.gabarito;
          n.despachar({ tipo: 'RESPONDER', alt });
        } else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
        else if (e === 'feedback') { m.feedbackEm = 0; n.despachar('CONTINUAR'); }
        else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
        else if (e === 'encerramento') { n.despachar('FECHAR'); break; }
        else break;
      }
      n.avancarDias(1);
      window.__prumo.app.render();
    });
    await pg.waitForTimeout(200);
    const vm = await pg.evaluate(() => window.__prumo.nucleo.tela().vm);
    console.log(`  [${motor} ${tema}] dia 2: ${vm.estado} · ${vm.bloco && vm.bloco.titulo} · ${vm.bloco && vm.bloco.composicao}`);
    await cap(pg, 'hoje-dia2', true);
    await pg.click('[data-ev="COMECAR"]');
    let viuAD = false, viuImagem = false, viuFim = false;
    for (let g = 0; g < 60; g++) {
      const e = await U.estado(pg);
      if (e === 'encerramento') break;
      if (e === 'pergunta') {
        if (!viuImagem && (await pg.$('.enunciado img.ampliavel'))) {
          await cap(pg, 'enem-com-imagem', true);
          await pg.click('.enunciado img.ampliavel');
          await pg.waitForSelector('.zoom-corpo img');
          await cap(pg, 'zoom-imagem');
          await pg.click('[data-acao="zoomMais"]');
          await pg.waitForTimeout(150);
          const larg = await pg.evaluate(() => { const d = document.querySelector('.zoom-corpo > div'); return d.getBoundingClientRect().width / document.querySelector('.zoom-corpo').clientWidth; });
          confere(larg > 1.3, 'zoom amplia a figura');
          await cap(pg, 'zoom-ampliado');
          await pg.click('.folha-pe [data-acao="fecharFolha"]');
          await pg.waitForTimeout(150);
          viuImagem = true;
        }
        await U.responderCerta(pg);
        await pg.waitForTimeout(150);
        if ((await U.estado(pg)) !== 'feedback') continue;   // pré-pergunta: vai direto à leitura
        if (!viuAD && (await pg.$('.antes-depois'))) { confere(/antes de ler, você marcou [A-E]\. Hoje: [A-E], certa\./.test(await U.texto(pg)), '"antes x depois" na 1ª revisão'); await cap(pg, 'revisao-antes-depois', true); viuAD = true; }
        await U.continuar(pg);
      } else if (e === 'leitura') {
        if (await pg.$('.par-texto figure.grafico-equipe') && !(await pg.$('.capturado-grafico'))) { await cap(pg, 'leitura-grafico', true); await pg.evaluate(() => document.body.classList.add('capturado-grafico')); }
        await pg.click('[data-acao="termineiLer"]');
      } else if (e === 'fimDaRodada') { viuFim = true; confere(await tem('entrou em Aprendendo') || await tem('Rodada encerrada'), 'Fim da rodada: texto'); await cap(pg, 'fim-da-rodada'); await pg.click('.barra [data-ev="SEGUIR"]'); }
      else if (e === 'fimDaMao') { await cap(pg, 'fim-da-mao'); await pg.click('.barra [data-ev="SEGUIR"]'); }
      else if (e === 'cards') { const v = await pg.evaluate(() => window.__prumo.nucleo.tela().vm); await pg.click(v.virado ? '.barra [data-ev="LEMBREI"]' : '.barra [data-ev="VIRAR"]'); await pg.waitForTimeout(60); }
      else { falhas.push('estado inesperado: ' + e); break; }
    }
    confere(viuAD, '"antes x depois" visto no dia 2');
    confere(viuImagem, 'questão do Enem com imagem vista');
    console.log(`  [${motor} ${tema}] fim da rodada visto: ${viuFim}`);
    await pg.waitForSelector('.colofao');
    confere((await pg.$('.colofao .regua .traco-hoje, .colofao .regua line.traco')) !== null, 'Pronto por hoje com a régua e o traço de hoje');
    confere(/2 dias estudados/.test(await U.texto(pg)), '"2 dias estudados"');
    await cap(pg, 'pronto-dia2', true);
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
  for (const m of motores) for (const t of temas) for (const [nome, fn] of [['exemplo', parteA], ['dia 2', parteB]]) {
    const f = await fn(m, t);
    console.log(`${m} ${t} ${nome}: ${f.length ? f.length + ' falha(s)' : 'ok'}`);
    f.forEach(x => console.log('   -', x));
    total += f.length;
  }
  process.exit(total ? 1 : 0);
})();
