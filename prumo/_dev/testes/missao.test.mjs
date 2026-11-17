import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packs, novo, recarregar, passo, gabarito, errada, responder, continuar, jogar, irPara, textos } from './ajuda.mjs';

const totalTentativas = n => Object.values(n.st.topicos).reduce((s, t) => s + t.tentativas.length, 0);

for (const pk of await packs()) {
  const P = pk.nome;

  test(`[${P}] g.7 · roteiro do Cap. 1: pré-pergunta sem sinal, "Já sei isto", erro na Q162, questão da equipe, vitória direto no Pronto por hoje`, () => {
    const { n, rel } = novo(pk.dados);
    let t = n.tela();
    assert.equal(t.nome, 'hoje');
    assert.equal(t.vm.estado, 'primeiroDia');
    assert.equal(t.vm.bloco.ganho, 'Acerte duas seguidas, uma delas numa questão do Enem: o capítulo Parte fixa e parte que varia entra no nível 1 de 5.');
    n.despachar('COMECAR');
    t = n.tela();
    assert.equal(t.vm.rotulo, 'Antes de ler a p. 1');
    assert.equal(t.vm.aviso, 'Tente antes de ler. Esta página responde.');
    assert.equal(n.despachar({ tipo: 'RESPONDER' }), false, 'guarda alt != null: sem botão "não sei"');
    responder(n, 'errada');
    t = n.tela();
    assert.equal(t.nome, 'leitura');
    assert.equal(t.vm.faixa, 'Resposta guardada.');
    assert.equal(t.vm.jaSei.rotulo, 'Já sei isto: ir para a próxima pergunta');
    n.despachar('TERMINEI_TRECHO');
    t = n.tela();
    assert.equal(t.vm.rotulo, 'Confira a p. 1');
    assert.equal(t.vm.avisoPrimeiraChecagem, 'Isso fica só neste aparelho. Ninguém da escola vê.');
    responder(n, 'certa');
    t = n.tela();
    assert.equal(t.vm.titulo, 'Certa.');
    assert.deepEqual(t.vm.medidor.casas.map(c => c.cheia), [true, false]);
    // R2-20: com a casa do acerto seguido cheia, o que falta é a questão do Enem (não "2 certas seguidas, falta 1")
    assert.equal(t.vm.medidor.texto, 'Falta acertar uma questão do Enem');
    assert.equal(n.despachar('CONTINUAR'), false, 'intervalo deliberativo: Continuar só depois da pausa');
    continuar(n, rel);
    assert.equal(n.tela().vm.rotulo, 'Antes de ler a p. 2');
    responder(n, 'errada');
    assert.equal(n.tela().vm.faixa, 'Resposta guardada. Na primeira revisão do capítulo você vê se acertou.');
    n.despachar('JA_SEI');
    t = n.tela();
    assert.equal(t.nome, 'pergunta');
    assert.match(t.vm.rotulo, /^Antes do parágrafo \d+$/);
    responder(n, 'certa');
    n.despachar('TERMINEI_TRECHO');
    assert.equal(n.tela().vm.rotulo, 'Confira a p. 2');
    responder(n, 'certa');
    assert.equal(n.tela().vm.medidor.texto, 'Falta acertar uma questão do Enem', 'depois de 2 checagens certas seguidas, o medidor não diz "2 certas seguidas, falta 1"');
    continuar(n, rel);
    t = n.tela();
    assert.equal(t.vm.rotulo, 'Questão do Enem');
    const q162 = passo(n).id;
    assert.equal(q162, 'enem-2023-162');
    const teto0 = n.st.missao.rodada.teto;
    responder(n, errada(n, q162, 'E'));
    t = n.tela();
    assert.equal(t.vm.titulo, `Você marcou ${errada(n, q162, 'E')}. A certa é ${gabarito(n, q162)}.`);
    assert.ok(t.vm.falta);
    assert.match(t.vm.proxima, /^A próxima é uma questão da equipe sobre a p\. \d+, § \d+\.$/);
    assert.match(t.vm.trecho.rotulo, /^Voltar ao parágrafo \d+$/);
    assert.equal(t.vm.medidor.texto, 'A próxima é sobre o trecho que faltou');
    assert.equal(n.st.missao.rodada.teto, teto0 + 1, 'a inserção soma 1 ao teto');
    n.despachar('VOLTAR_AO_TRECHO');
    t = n.tela();
    assert.equal(t.nome, 'trecho');
    assert.ok(t.vm.ancora);
    assert.equal(t.vm.acao.rotulo, 'Voltar ao resultado');
    n.despachar('VOLTAR');
    continuar(n, rel);
    t = n.tela();
    assert.equal(t.vm.rotulo, 'Questão da equipe');
    assert.equal(t.vm.subrotulo, 'Texto e números da equipe Prumo, licença CC BY-SA 4.0');
    assert.equal(passo(n).papel, 'compreender');
    responder(n, 'certa'); continuar(n, rel);
    assert.equal(passo(n).id, 'enem-2023-150');
    responder(n, 'certa');
    t = n.tela();
    assert.equal(t.vm.fimRodada.venceu, true);
    assert.equal(n.st.missao.rodada, null);
    assert.equal(n.st.topicos['mat-fa.c1'].tentativas.length, 5, 'vitória na 5ª tentativa');
    continuar(n, rel);
    t = n.tela();
    assert.equal(t.nome, 'encerramento', 'a rodada fechou no último passo: sem tela de Fim da rodada');
    assert.equal(t.vm.titulo, 'Pronto por hoje');
    assert.match(t.vm.visto.data, /^\d\d\/\d\d\/\d{4}$/, 'o visto traz a data dd/mm/aaaa');
    assert.equal(t.vm.visto.palavra, 'Visto');
    assert.equal(t.vm.fecho, 'Por hoje é isso. Está tudo guardado neste aparelho.');
    assert.ok(!('chama' in t.vm.constancia));
    assert.equal(t.vm.constancia.rotulo, '1 dia estudado');
    assert.ok(t.vm.mudancas.some(x => x.texto === 'O capítulo Parte fixa e parte que varia entrou no nível 1 de 5. Próxima revisão: amanhã, qui 19/11.'));
    assert.ok(t.vm.mudancas.every(x => !/ · /.test(x.texto)), 'resumo em frases, sem cadeia de pontos');
    assert.ok(t.vm.mudancas.some(x => x.texto === 'Você tentou antes de ler em todos os trechos cobrados.'));
    assert.equal(t.vm.nivelAnimado.para, 1);
    assert.equal(t.vm.proxima.gancho, 'Amanhã você vê se acertou a pergunta antes da p. 2.');
    assert.ok(!('enem-2019-168' in n.st.vistos), 'a questão que sobrou fica inédita');
    n.despachar('FECHAR');
    t = n.tela();
    assert.equal(t.vm.estado, 'feito');
    // R2-19: "Próxima missão:" é a missão; o aviso da pergunta de antes vem como segunda frase dela
    assert.match(t.vm.feito.previa, /^Quinta, 19\/11: capítulo .+ \(novo\) e revisão do capítulo Parte fixa e parte que varia\. Nela você vê se acertou a pergunta antes da p\. 2\.$/);
    assert.equal(t.vm.feito.proxima.texto, t.vm.feito.previa, 'a tela não repete a missão na linha cinza');
  });

  test(`[${P}] g.8 · recarregar em cada estado da missão volta ao mesmo passo, sem registrar tentativa duas vezes`, () => {
    const { n, rel, storage } = novo(pk.dados);
    let atual = n;
    atual.despachar('COMECAR');
    const vistos = new Set();
    for (let g = 0; g < 80; g++) {
      const e = atual.estado();
      vistos.add(e);
      const antes = { e, i: atual.st.missao.i, tent: totalTentativas(atual), vm: JSON.stringify(atual.tela().vm) };
      const r = recarregar(atual, storage);
      assert.equal(r.estado(), antes.e);
      assert.equal(r.st.missao.i, antes.i);
      assert.equal(totalTentativas(r), antes.tent);
      assert.equal(JSON.stringify(r.tela().vm), antes.vm, `mesma tela depois de recarregar em ${e}`);
      if (e === 'feedback') {
        assert.equal(r.despachar({ tipo: 'RESPONDER', alt: 'A' }), false);
        assert.equal(totalTentativas(r), antes.tent);
      }
      atual = r;
      if (e === 'encerramento') break;
      if (e === 'pergunta') responder(atual, passo(atual).t === 'questao' && passo(atual).origem === 'enem' && !atual.st.erros.length ? 'errada' : 'certa');
      else if (e === 'leitura') atual.despachar('TERMINEI_TRECHO');
      else if (e === 'feedback') { if (!vistos.has('trecho') && atual.st.missao.ultima.res === 'erro') atual.despachar('VOLTAR_AO_TRECHO'); else continuar(atual, rel); }
      else if (e === 'trecho') atual.despachar('VOLTAR');
      else if (e === 'fimDaRodada') atual.despachar('SEGUIR');
    }
    for (const e of ['pergunta', 'leitura', 'feedback', 'trecho', 'encerramento']) assert.ok(vistos.has(e), e);
  });

  test(`[${P}] g.8 · nenhuma tela revela a pré-pergunta: telas idênticas com pré-pergunta certa e com errada`, () => {
    const corridas = ['certa', 'errada'].map(modo => {
      const { n, rel } = novo(pk.dados);
      const vms = [];
      jogar(n, rel, {
        decidir: p => (p.t === 'pre' ? modo : 'certa'),
        parar: x => { const e = x.estado(); if (['leitura', 'feedback', 'hoje', 'encerramento'].includes(e)) vms.push([e, JSON.stringify(x.tela().vm)]); return false; },
      });
      vms.push(['pronto', JSON.stringify(n.prontoPorHoje())]);
      n.despachar('FECHAR');
      vms.push(['hoje', JSON.stringify(n.hoje())], ['sumario', JSON.stringify(n.sumario())], ['erros', JSON.stringify(n.erros())], ['notas', JSON.stringify(n.notas())], ['cards', JSON.stringify(n.cardsDoCaderno())], ['plano', JSON.stringify(n.plano())]);
      const leituras = vms.filter(([e]) => e === 'leitura');
      assert.ok(leituras.length >= 2);
      for (const [, vm] of leituras) assert.match(vm, /Já sei isto: ir para a próxima pergunta/);
      return vms;
    });
    assert.deepEqual(corridas[0], corridas[1]);
  });

  test(`[${P}] g.8 · erro numa questão do Enem insere a questão da equipe e soma 1 ao teto; erro na inserida não insere outra; teto até 8`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'questao' });
    const tam = n.st.missao.passos.length;
    responder(n, 'errada');
    const teto = n.st.missao.rodada.teto;
    assert.equal(n.st.missao.passos.length, tam + 1);
    const ins = n.st.missao.passos[n.st.missao.i + 1];
    assert.equal(ins.inserido, true); assert.equal(ins.origem, 'equipe'); assert.equal(ins.papel, 'compreender');
    continuar(n, rel);
    const vmIns = n.tela().vm;                               // a inserida é anunciada no topo, com o trecho do erro
    assert.equal(vmIns.inserida, true);
    assert.match(vmIns.avisoInserida, /^Depois do erro: uma questão da equipe sobre (a p\. \d+, § \d+|o mesmo trecho)\.$/);
    responder(n, 'errada');                                  // erro na própria inserida
    assert.equal(n.st.missao.passos.length, tam + 1, 'sem nova inserção');
    assert.equal(n.st.missao.rodada ? n.st.missao.rodada.teto : teto, teto);
    // teto no máximo 8
    const b = novo(pk.dados);
    jogar(b.n, b.rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'questao' });
    b.n.st.missao.rodada = Object.assign(b.n.st.missao.rodada || {}, {});
    responder(b.n, 'certa'); continuar(b.n, b.rel);
    if (b.n.st.missao.rodada) { b.n.st.missao.rodada.teto = 8; responder(b.n, 'errada'); assert.ok(!b.n.st.missao.rodada || b.n.st.missao.rodada.teto <= 8); }
  });

  test(`[${P}] g.8 · "Encerrar por hoje" no meio da rodada não muda nível; "Parar e continuar mais tarde" volta a Hoje com "Continuar do passo N de M"`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'checagem' && passo(x).papel === 'compreender' });
    const i = n.st.missao.i, total = n.st.missao.passos.length;
    assert.equal(n.despachar('PAUSAR'), true);
    let t = n.tela();
    assert.equal(t.nome, 'hoje');
    assert.equal(t.vm.estado, 'emCurso');
    assert.equal(t.vm.acao.rotulo, `Continuar do passo ${i + 1} de ${total}`);
    assert.equal(t.vm.acao.nota, 'A missão fica aberta até a meia-noite.');
    n.despachar('CONTINUAR');
    assert.equal(n.estado(), 'pergunta');
    assert.equal(n.st.missao.i, i);
    responder(n, 'certa');
    const tent = totalTentativas(n);
    n.despachar('CONFIRMAR_ENCERRAR');
    t = n.tela();
    assert.equal(t.nome, 'encerramento');
    assert.equal(t.vm.parcial, `Você encerrou no passo ${i + 1} de ${total}. O que já tinha fechado hoje continua; o resto não mudou nenhum nível.`);
    assert.equal((n.st.topicos['mat-fa.c1'] || {}).caixa || 0, 0, 'nenhum nível muda');
    assert.equal(totalTentativas(n), tent, 'as tentativas ficam no histórico');
    assert.equal(n.st.topicos['mat-fa.c1'].rodadas.length, 0, 'encerrar nunca chama fecharRodada');
    n.despachar('FECHAR');
    assert.equal(n.hoje().estado, 'encerradoAntes');
    // no próximo dia de estudo o capítulo volta pela regra R7
    irPara(n, rel, '2026-11-19');
    assert.equal(n.st.missao.regra, 'R7');
  });

  test(`[${P}] g.8 · virar a data com a missão pela metade mostra "Ontem você parou..." e monta a missão de hoje`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'checagem' && passo(x).papel === 'compreender' });
    const passoN = n.st.missao.i + 1, total = n.st.missao.passos.length;
    n.despachar('PAUSAR');
    rel.irPara('2026-11-19T07:00');
    assert.equal(n.conferirData(), true);
    const t = n.tela();
    assert.equal(t.nome, 'hoje');
    assert.equal(t.vm.faixa, `Ontem você parou no passo ${passoN} de ${total}. O que fez ficou registrado; hoje a missão é nova.`);
    assert.equal(n.st.missao.dia, '2026-11-19');
    assert.equal(n.st.missao.iniciada, false);
    assert.ok(n.st.historico.some(h => h.dia === '2026-11-18' && h.parcial && h.viradaDeData));
    assert.equal(n.st.dias['2026-11-18'], true, 'o dia já contou na 1ª tentativa avaliada');
  });

  test(`[${P}] g.8 · depois do Pronto por hoje, nenhuma oferta: missão, Questão do dia, Prova e "Refazer" ficam para amanhã`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { decidir: p => (p.t === 'checagem' && p.papel === 'lembrar' ? 'errada' : 'certa') });
    n.despachar('FECHAR');
    const h = n.hoje();
    assert.equal(h.estado, 'feito');
    assert.equal(h.acao, null); assert.equal(h.prova, null); assert.equal(h.bloco, null);
    assert.equal(n.despachar('COMECAR'), false);
    assert.equal(n.despachar('FAZER_PROVA'), false);
    const e = n.erros().itens[0];
    assert.equal(e.refazer.disponivel, false);
    assert.equal(e.refazer.motivo, 'Abre amanhã: hoje você já terminou o dia de estudo.');
    assert.equal(n.iniciarRefazer(e.id), false);
  });

  test(`[${P}] "Refazer com outros números": só as linhas 8 a 10, 1 por cartão por dia, conta como dia estudado e não muda nível`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { decidir: p => (p.t === 'checagem' && p.papel === 'lembrar' ? 'errada' : 'certa'), parar: x => x.estado() === 'encerramento' });
    // ainda no Encerramento? fecha amanhã: refazer antes de fechar o dia não é possível (dia fechado); então vai para amanhã
    n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    const e = n.erros().itens[0];
    assert.equal(e.refazer.disponivel, true);
    assert.equal(e.refazer.rotulo, 'Refazer com outros números');
    const caixa = n.st.topicos['mat-fa.c1'].caixa, prox = n.st.topicos['mat-fa.c1'].proxima;
    assert.equal(n.iniciarRefazer(e.id), true);
    assert.match(n.st.refazer.item, /#8$/);
    n.responderRefazer(gabarito(n, n.st.refazer.item));
    assert.equal(n.refazer().titulo, 'Certa.');
    n.fecharRefazer();
    assert.equal(n.st.topicos['mat-fa.c1'].caixa, caixa); assert.equal(n.st.topicos['mat-fa.c1'].proxima, prox);
    assert.equal(n.st.dias['2026-11-19'], true);
    assert.equal(n.erros().itens[0].refazer.motivo, 'Abre amanhã: você já refez esta hoje.');
    irPara(n, rel, '2026-11-20'); n.iniciarRefazer(e.id); assert.match(n.st.refazer.item, /#9$/); n.responderRefazer('A'); n.fecharRefazer();
    irPara(n, rel, '2026-11-23'); n.iniciarRefazer(e.id); assert.match(n.st.refazer.item, /#10$/); n.responderRefazer('A'); n.fecharRefazer();
    irPara(n, rel, '2026-11-24');
    assert.equal(n.erros().itens[0].refazer.motivo, 'Por enquanto não há outra versão desta questão.');
  });

  test(`[${P}] g.8 · revisão: "antes x depois" na 1ª revisão e a revisão errada sem a palavra "perdeu" e sem animação`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel, { decidir: p => (p.t === 'pre' ? 'errada' : 'certa') });
    n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'revisao' });
    let t = n.tela();
    assert.equal(t.vm.rotulo, 'Revisão do capítulo Parte fixa e parte que varia'); assert.equal(t.vm.subrotulo, 'Vale a primeira resposta.');
    const pid = passo(n).id, antes = n.st.pre[pid].alt;
    assert.ok(pid.endsWith('#0'), 'a 1ª revisão traz a pergunta de entrada da 2ª página');
    responder(n, 'certa');
    t = n.tela();
    assert.equal(t.vm.revisao.antesDepois, `Ontem, antes de ler, você marcou ${antes}. Hoje: ${gabarito(n, pid)}, certa.`);
    assert.match(t.vm.revisao.texto, /^Certa\. O capítulo Parte fixa e parte que varia subiu para o nível 2 de 5\. Próxima revisão: \S+ \d\d\/\d\d\.$/);
    jogar(n, rel); n.despachar('FECHAR');
    // revisão errada: volta para Aprendendo
    let prox = n.st.topicos['mat-fa.c1'].proxima;
    while (![1, 2, 3, 4].includes(new Date(`${prox}T12:00`).getDay())) prox = new Date(new Date(`${prox}T12:00`).getTime() + 864e5).toISOString().slice(0, 10);
    irPara(n, rel, prox);
    jogar(n, rel, { parar: x => x.estado() === 'pergunta' && passo(x).t === 'revisao' && passo(x).cap === 'mat-fa.c1' });
    responder(n, 'errada');
    t = n.tela();
    // R2-18: a data é a do dia de estudo em que a revisão entra ("amanhã, qua 18/11" ou, na véspera da folga, "na segunda, 23/11")
    const volta = t.vm.revisao.texto;
    assert.match(volta, /^A revisão de Parte fixa e parte que varia volta (amanhã, \S+ \d\d\/\d\d|n[ao] \S+, \d\d\/\d\d)\. Seus dias estudados e seu histórico continuam\. O capítulo Parte fixa e parte que varia desceu para o nível 1 de 5\.$/);
    assert.equal(t.vm.revisao.nivel.animar, false); assert.equal(t.vm.som, null);
    assert.equal(n.st.topicos['mat-fa.c1'].caixa, 1);
    jogar(n, rel);
    const pronto = n.prontoPorHoje();
    assert.ok(pronto.mudancas.some(x => x.texto === volta));
    // R2-17: o "Por quê?" da próxima missão diz que a revisão volta pelo erro (não "vence em N dias" do nível novo)
    assert.match(pronto.proxima.porque, /^Você errou a revisão de Parte fixa e parte que varia, e revisão errada volta no próximo dia de estudo: na \S+\.$/);
    assert.ok(!/vence em \d+ dias?/.test(pronto.proxima.porque));
    assert.match(n.sumario().capitulos[0].verARegra, /Você errou a última revisão, e ela volta no próximo dia de estudo/);
    n.despachar('FECHAR');
    assert.match(n.sumario().capitulos[0].estado, /^Voltou para o nível 1 de 5\. Próxima revisão: amanhã\.$/);
    for (const s of [...textos(pronto), ...textos(n.sumario()), ...textos(n.hoje())]) assert.ok(!/perdeu/i.test(s), s);
  });

  test(`[${P}] só a pré-pergunta não conta como dia estudado ("Hoje ficou só a pergunta antes de ler")`, () => {
    const { n } = novo(pk.dados);
    n.despachar('COMECAR');
    responder(n, 'certa');
    n.despachar('CONFIRMAR_ENCERRAR');
    const v = n.prontoPorHoje();
    assert.equal(v.vazio, 'Hoje ficou só a pergunta antes de ler. Ela volta no próximo dia de estudo.');
    assert.equal(v.naoContou, 'O dia não conta como estudado: ele conta quando você responde uma checagem, questão ou revisão.');
    assert.deepEqual(n.st.dias, {});
  });

  test(`[${P}] rodada que não fecha mais: encerra no teto, os cards entram no baralho e a tela de Fim da rodada aparece só se a fila continua`, () => {
    const { n, rel } = novo(pk.dados);
    const r = jogar(n, rel, { decidir: p => (p.t === 'pre' ? 'certa' : 'errada'), parar: x => x.estado() === 'fimDaRodada' || x.estado() === 'encerramento' });
    assert.equal(r, 'encerramento', 'no 1º dia a rodada é o último passo');
    const fr = n.st.missao.resumo.rodadas[0];
    assert.equal(fr.venceu, false);
    assert.ok(n.st.baralho['mat-fa.c1'], 'Decisão 1: os cards entram quando a 1ª rodada termina, mesmo no teto');
    assert.ok(n.prontoPorHoje().mudancas.some(x => /^Hoje não subiu nível\. Ficaram registradas \d+ tentativas; a p\. \d+ volta no próximo dia de estudo\.$/.test(x.texto)));
    n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    assert.ok(['R5b', 'R5a'].includes(n.st.missao.regra));
  });

  test(`[${P}] b.1 · a tela de Fim da rodada aparece quando ainda há passos depois da rodada (revisão do dia)`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    irPara(n, rel, '2026-11-19');
    assert.equal(n.st.missao.regra, 'R8'); assert.equal(n.st.missao.cap, 'mat-fa.c2');
    const fim = jogar(n, rel, { parar: x => x.estado() === 'fimDaRodada' });
    assert.equal(fim, 'fimDaRodada');
    const t = n.tela();
    assert.equal(t.vm.variante, 'venceu');
    // a revisão marcada para sex 20/11 (folga no plano seg a qui) entra na segunda: o anúncio diz o dia real
    assert.match(t.vm.texto, /entrou no nível 1 de 5\. A primeira revisão fica para segunda, 23\/11\.$/);
    assert.equal(t.vm.nivel.animar, true);
    assert.match(t.vm.cards, /^Os \d+ cartões do capítulo Ler o gráfico entraram no seu baralho\.$/);
    n.despachar('SEGUIR');
    assert.equal(passo(n).t, 'revisao');
  });
}
