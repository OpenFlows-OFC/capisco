/* Correções da rodada 1 (núcleo): cada teste protege um item do relatório (R1-xx).
   Regras de produto conferidas aqui: nível sem nome, errar desce UM nível, recompensa anunciada que vem,
   o dia tem fim, nada de IA em texto visível, dias estudados que só crescem. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo, NAO_TEM } from '../../js/nucleo/nucleo.js';
import { IDS_PRATICA } from '../../js/nucleo/pratica.js';
import { packs, PERFIL, textos } from './ajuda.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const LISTA = [];
for (const id of IDS_PRATICA) {
  const a = path.resolve(aqui, `../../conteudo/praticas/${id}.js`), b = path.resolve(aqui, `../../conteudo/praticas/${id}.teoria.js`);
  LISTA.push({ id, topico: existsSync(a) ? (await import(pathToFileURL(a).href)).topico : null, teoria: existsSync(b) ? (await import(pathToFileURL(b).href)).teoria : null });
}
const TOP = LISTA.find(x => x.topico && x.teoria).id;

function novo(dados, { dia = '2026-11-17', perfil = {}, praticas = LISTA, storage = E.memoria() } = {}) {
  const rel = R.relogioFalso(`${dia}T19:00`);
  R.setOffset(0);
  const n = new Nucleo({ pack: dados, storage, praticas });
  n.abrir();
  if (perfil !== null) n.concluirPrimeiroUso(Object.assign({}, PERFIL, perfil));
  return { n, rel, storage };
}
/** Joga até sair da missão. alt(item, passo) escolhe a letra (padrão: a certa). */
function jogar(n, rel, alt = it => it.gabarito, { trecho = false } = {}) {
  if (n.estado() === 'hoje') n.despachar('COMECAR');
  let viu = false;
  for (let g = 0; g < 400; g++) {
    const e = n.estado(), m = n.st.missao, p = m && m.passos[m.i];
    if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: alt(n.missao.itemDe(p.id), p) });
    else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') { if (trecho && !viu && n.tela().vm.trecho && n.despachar('VOLTAR_AO_TRECHO')) { viu = true; continue; } viu = false; rel.avancarMs(4000); n.despachar('CONTINUAR'); }
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'cards') { const mao = m.mao; n.despachar(mao.pendente ? 'SEGUIR' : mao.virado ? 'LEMBREI' : 'VIRAR'); }
    else return e;
  }
  throw new Error('não terminou');
}
const ir = (n, rel, d) => { rel.irPara(`${d}T19:00`); n.conferirData(); };
const errada = it => it.alternativas.find(a => !a.certa).letra;
const cap1 = 'mat-fa.c1';

for (const pk of await packs()) {
  const P = pk.nome;

  test(`[${P}] R1-01 · perfil real vai até o nível 5 de 5; o teto 3 é só do estado de exemplo, e a nota dele só aparece lá`, () => {
    assert.equal(E.vazio().config.nivelMaximo, 5);
    const salvo = E.vazio(); salvo.perfil = E.normalizarPerfil(PERFIL); salvo.config.nivelMaximo = 3;   // gravado pela versão anterior
    assert.equal(E.normalizar(salvo).config.nivelMaximo, 5, 'perfil real salvo com 3 passa a ir até o 5');
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    assert.equal(n.st.config.nivelMaximo, 5);
    // revisão certa no nível 3: sobe para o 4 (antes, ficava no 3 para sempre)
    Object.assign(n.st.topicos[cap1], { caixa: 3, proxima: '2026-11-18' });
    ir(n, rel, '2026-11-18');
    assert.ok(n.st.missao.passos.some(p => p.t === 'revisao' && p.cap === cap1));
    assert.match(n._ganhoRevisao(cap1, 'o capítulo X'), /sobe para o nível 4 de 5\.$/);
    jogar(n, rel, (it, p) => it.gabarito);
    assert.equal(n.st.topicos[cap1].caixa, 4);
    const txt = JSON.stringify(n.tela().vm.mudancas);
    assert.ok(/subiu para o nível 4 de 5/.test(txt) && !/demonstra/.test(txt), 'fora da demonstração, sem nota de teto');
    assert.equal(n.sumario().avisoDemo, null);
    // no nível 5: "continua no nível 5 de 5, o mais alto", sem prometer intervalo maior
    n.despachar('FECHAR');
    Object.assign(n.st.topicos[cap1], { caixa: 5, proxima: '2026-11-19' });
    ir(n, rel, '2026-11-19');
    const g = n._ganhoRevisao(cap1, 'o capítulo X');
    assert.equal(g, 'Acerte a revisão na primeira resposta: o capítulo X continua no nível 5 de 5, o mais alto.');
    // estado de exemplo: teto da demonstração, com a nota no Caderno e no ganho
    n.carregarExemplo();
    assert.equal(n.st.config.nivelMaximo, 3);
    assert.equal(n.sumario().avisoDemo, 'Na demonstração, o nível vai até 3 de 5.');
    const t = Object.keys(n.st.topicos).find(id => n.st.topicos[id].caixa === 3);
    assert.match(n._ganhoRevisao(t, 'o capítulo X'), /continua no nível 3 de 5 \(na demonstração, o nível vai até 3 de 5\)\.$/);
    assert.ok(!/mais longe/.test(n._ganhoRevisao(t, 'o capítulo X')));
  });

  test(`[${P}] R1-02 · a regra do nível é uma só e fiel ao motor: errar a revisão desce um nível`, () => {
    const { n } = novo(pk.dados);
    for (const r of [n.sumario().regraNivel, n.topicoPagina(TOP).regraNivel, n.topicoPagina(n.pack.id).regraNivel, n.estudar().regraNivel]) {
      assert.match(r, /errar uma revisão desce um nível, nunca abaixo do 1/);
      assert.match(r, /Errar nas questões da rodada só recomeça a contagem das 2 seguidas/);
    }
    assert.ok(n.topicoPagina(TOP).comoFunciona.some(x => /errar uma revisão desce um/.test(x.texto)), 'o quadro "Como funciona" tem a regra certa no VM');
    // nenhum texto do núcleo diz que errar volta ao nível 1
    const dir = path.resolve(aqui, '../../js/nucleo');
    for (const f of readdirSync(dir).filter(x => x.endsWith('.js') || x.endsWith('.md'))) {
      const s = readFileSync(path.join(dir, f), 'utf8');
      assert.ok(!/volta (?:o (?:tópico|capítulo) )?para o nível 1 de 5/.test(s), `${f}: "volta para o nível 1"`);
      assert.ok(!/volta a Aprendendo|dominado/.test(s), `${f}: nome de nível ou regra velha`);
    }
  });

  test(`[${P}] R1-04 · "Avançar 1 dia" num perfil real guarda o estado real; "Sair" devolve tudo, sem apagar`, () => {
    const { n, rel, storage } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    const antes = JSON.stringify({ perfil: n.st.perfil, dias: n.st.dias, topicos: n.st.topicos, carimbos: n.st.carimbos });
    n.avancarDias(1);
    assert.match(n.tela().faixas.demo.frase, /^nada do seu progresso real muda, data simulada 18\/11\.$/);
    jogar(n, rel); n.despachar('FECHAR');
    assert.ok(n.st.dias['2026-11-18'], 'o dia simulado conta só na demonstração');
    const t = n.sairDaDemonstracao();
    assert.notEqual(t.nome, 'primeiroUso');
    assert.equal(JSON.stringify({ perfil: n.st.perfil, dias: n.st.dias, topicos: n.st.topicos, carimbos: n.st.carimbos }), antes);
    assert.equal(n.st.config.demo.ativo, false);
    const m = new Nucleo({ pack: pk.dados, storage, praticas: LISTA }); m.abrir();
    assert.ok(m.st.perfil && !m.st.dias['2026-11-18'], 'o que ficou salvo é o estado real');
    // estado já gravado sem cópia (versão anterior): "Sair" desliga a demonstração e não apaga o perfil
    n.st.config.demo = { ativo: true, offset: 1, exemplo: false, guardado: null };
    assert.notEqual(n.sairDaDemonstracao().nome, 'primeiroUso');
    assert.ok(n.st.perfil);
  });

  test(`[${P}] R1-06 · revisar hoje: a próxima revisão aparece na agenda do Plano, no dia em que entra`, () => {
    const { n, rel } = novo(pk.dados);
    jogar(n, rel); n.despachar('FECHAR');
    ir(n, rel, '2026-11-18');
    jogar(n, rel); n.despachar('FECHAR');
    const t = n.st.topicos[cap1], ef = n._ef(t.proxima);
    assert.ok(t.proxima > '2026-11-18');
    const linha = n.agenda().dias.find(x => x.dia === ef);
    assert.ok(linha && /Parte fixa e parte que varia/.test(linha.texto), `a revisão de ${ef} está na agenda: ${linha && linha.texto}`);
  });

  test(`[${P}] R1-07 · revisão que vence na folga não vira atraso; atrasada é só a que passou por um dia de estudo`, () => {
    const { n, rel } = novo(pk.dados, { dia: '2026-11-19' });   // quinta; plano seg a qui
    jogar(n, rel); n.despachar('FECHAR');
    const t = n.st.topicos[cap1];
    assert.equal(t.proxima, '2026-11-20', 'o motor marca sexta');
    assert.match(n.prontoPorHoje().mudancas[0].texto, /Próxima revisão: segunda, 23\/11\.$/, 'o anúncio diz o dia em que ela entra');
    ir(n, rel, '2026-11-20');
    assert.equal(n.hoje().texto, 'Hoje é folga. Nada vence por isso.');
    ir(n, rel, '2026-11-23');
    const h = n.hoje();
    assert.equal(h.bloco.atrasada, null, 'na segunda ela não está atrasada');
    assert.match(h.venceHoje.vence, /^Hoje vence 1 revisão do capítulo Parte fixa e parte que varia\.$/);
    assert.ok(!/atrasada/.test(n.sumario().capitulos[0].estado));
    // faltou na segunda: na terça ela está atrasada desde segunda, com a mesma contagem nas frases
    ir(n, rel, '2026-11-24');
    const h2 = n.hoje(), atr = n.st.missao.passos.filter(p => p.t === 'revisao' && p.atrasada).length;
    assert.ok(atr >= 1);
    assert.equal(h2.venceHoje.atrasadas, atr);
    assert.match(h2.venceHoje.vence, /revis(ão|ões) atrasadas? desde seg 23\/11/);
    assert.match(n.sumario().capitulos[0].estado, /^Revisão atrasada há 1 dia\.$/);
  });

  test(`[${P}] R1-07/R1-44 · virada de data: recado claro e o visto do dia, como em "Encerrar por hoje"`, () => {
    const { n: n2, rel: r2 } = novo(pk.dados);
    n2.despachar('COMECAR');
    // responde até a primeira checagem (conta o dia) e para
    for (let g = 0; g < 60; g++) {
      const e = n2.estado(), m = n2.st.missao, p = m.passos[m.i];
      if (e === 'pergunta') { n2.despachar({ tipo: 'RESPONDER', alt: n2.missao.itemDe(p.id).gabarito }); if (p.t !== 'pre') break; }
      else if (e === 'leitura') n2.despachar('TERMINEI_TRECHO');
      else break;
    }
    assert.ok(n2.st.dias['2026-11-17']);
    const passoN = n2.st.missao.i + 1, total = n2.st.missao.passos.length;
    n2.despachar('PAUSAR');
    ir(n2, r2, '2026-11-18');
    assert.equal(n2.hoje().recado.texto, `Ontem você parou no passo ${passoN} de ${total}. O que fez ficou registrado; hoje a missão é nova.`);
    assert.ok(n2.st.carimbos['2026-11-17'], 'o dia contou e a missão fechou na virada: o visto vem, igual a "Encerrar por hoje"');
  });

  test(`[${P}] R1-08 · plano de 15 min: a revisão prometida para amanhã está na missão de amanhã`, () => {
    const { n, rel } = novo(pk.dados, { perfil: { minutos: 15 } });
    jogar(n, rel);
    const pr = n.tela().vm;
    assert.ok(pr.mudancas.some(x => /Próxima revisão: amanhã, qua 18\/11\./.test(x.texto)));
    assert.match(pr.proxima.texto, /^Quarta, 18\/11: revisão do capítulo Parte fixa e parte que varia\.$/);
    assert.ok(!/folga/.test(pr.proxima.porque || ''), 'o "Por quê?" não inventa folga');
    n.despachar('FECHAR');
    ir(n, rel, '2026-11-18');
    const m = n.st.missao;
    assert.ok(m.passos.some(p => p.t === 'revisao' && p.cap === cap1), 'a revisão anunciada está na missão');
    assert.ok(m.minutos <= 15);
    assert.match(n.hoje().bloco.composicao, /fica para o próximo dia de estudo: hoje a revisão vem primeiro\./);
  });

  test(`[${P}] R1-09 · o tempo da missão de tópico conta a apostila pela conta da capa; a página do tópico mostra o tempo`, () => {
    const { n } = novo(pk.dados);
    const v = n.teoria(TOP);
    // a mesma conta da capa (componentes.js): palavras/140 + 1,5 por exemplo, mínimo 5
    const palavras = v.secoes.reduce((s, x) => s + (x.paragrafos || []).join(' ').split(/\s+/).length, 0), nEx = v.secoes.reduce((s, x) => s + x.exemplos.length, 0);
    assert.equal(v.minutos, Math.max(5, Math.round(palavras / 140 + nEx * 1.5)));
    const pg = n.topicoPagina(TOP);
    assert.ok(pg.tempo && pg.tempo.minutos >= v.minutos + 1);
    assert.match(pg.composicao, /Leva cerca de \d+ min/);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    const m = n.st.missao;
    assert.equal(m.minutos, pg.tempo.minutos, 'Hoje e a página do tópico dizem o mesmo tempo');
    assert.ok(m.minutos >= 1 + v.minutos, 'a apostila entra com os minutos dela');
    n.despachar('PAUSAR');
    const h = n.hoje();
    assert.equal(h.bloco.cabecalho.find(c => c.rotulo === 'Tempo').valor, String(m.minutos));
    if (m.minutos > 25) assert.match(h.bloco.composicao, /Hoje passa dos seus 25 min: só a apostila leva cerca de \d+\./);
  });

  test(`[${P}] R1-10/R1-45/R1-48 · depois do Pronto: estudo por conta própria sem prometer visto; o caderno também aceita`, () => {
    const { n, rel } = novo(pk.dados);
    const pg0 = n.topicoPagina(TOP);
    assert.match(pg0.regraHoje, /^Hoje: acerte 2 questões seguidas e .+ entra no nível 1 de 5\. No fim, o visto do dia\.$/);
    assert.match(pg0.acao.nota, /no lugar de “.+”\./, 'aspas curvas');
    jogar(n, rel); n.despachar('FECHAR');
    const pg = n.topicoPagina(TOP);
    assert.match(pg.regraHoje, /Sem visto extra: o de hoje já é seu\.$/);
    assert.ok(!/No fim, o visto do dia/.test(pg.regraHoje));
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    assert.equal(n.tela().vm.livre, true, 'o VM da missão diz que é estudo livre');
    n.despachar('PAUSAR');
    const h = n.hoje();
    assert.equal(h.proximoRotulo, 'Estudo por conta própria');
    assert.match(h.acao.nota, /não dá um segundo visto/);
    n.despachar('CONTINUAR');
    jogar(n, rel);
    assert.equal(n.tela().vm.fase, 'registro');
    n.despachar('FECHAR');
    // Funções afins por conta própria: revisão antecipada do capítulo mais fraco, sem visto e sem mudar o nível
    const fa = n.topicoPagina(n.pack.id).acao;
    assert.equal(fa.disponivel, true); assert.match(fa.nota, /revisão antecipada do capítulo .+, o mais fraco, que não muda o nível/);
    const nivel = n.st.topicos[cap1].caixa, carimbos = JSON.stringify(n.st.carimbos);
    assert.ok(n.despachar({ tipo: 'ESTUDAR_TOPICO', id: n.pack.id }));
    assert.equal(n.st.missao.livre, true); assert.equal(n.st.missao.tipo, 'antecipada');
    assert.equal(jogar(n, rel), 'encerramento');
    const v = n.tela().vm;
    assert.equal(v.titulo, 'Estudo registrado'); assert.equal(v.visto, null);
    assert.equal(n.st.topicos[cap1].caixa, nivel); assert.equal(JSON.stringify(n.st.carimbos), carimbos);
    n.despachar('FECHAR');
    assert.equal(n.estado(), 'feito'); assert.ok(!n.st.missao.livre);
    // estado do tópico sem repetir o nível (a régua com o rótulo já mostra)
    assert.ok(!/[Nn]ível \d de 5/.test(n.topicoPagina(TOP).estadoTexto));
  });

  test(`[${P}] R1-11/R1-12 · erro em tópico de prática vai para o Caderno de erros; "Rever a apostila" abre na seção`, () => {
    const lista = LISTA.map(x => (x.id === TOP ? Object.assign({}, x, { topico: Object.assign({}, x.topico, { questoes: x.topico.questoes.map(q => Object.assign({}, q, { secao: 2 })) }) }) : x));
    const { n, rel } = novo(pk.dados, { praticas: lista });
    assert.match(n.erros().vazio, /trecho do caderno ou da apostila/);
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    let errou = null;
    for (let g = 0; g < 80 && !errou; g++) {
      const e = n.estado(), m = n.st.missao, p = m.passos[m.i];
      if (e === 'pergunta') { const it = n.missao.itemDe(p.id); n.despachar({ tipo: 'RESPONDER', alt: p.t === 'questao' ? errada(it) : it.gabarito }); if (p.t === 'questao') errou = it; }
      else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
      else if (e === 'feedback') { rel.avancarMs(4000); n.despachar('CONTINUAR'); }
    }
    const fb = n.tela().vm;
    assert.equal(fb.trecho.rotulo, 'Rever a apostila'); assert.equal(fb.fase, 'questoes');
    assert.ok(n.despachar('VOLTAR_AO_TRECHO'));
    const tr = n.tela().vm;
    assert.equal(tr.titulo, 'Rever a apostila'); assert.equal(tr.ancora, 'secao-2'); assert.equal(tr.secao, 2);
    n.despachar('VOLTAR');
    const er = n.erros();
    assert.equal(er.vazio, null);
    const it = er.itens.find(x => x.cap === TOP);
    assert.ok(it, 'o erro do tópico está no Caderno');
    assert.equal(it.capRotulo, n.prat.curto(TOP));
    assert.match(it.questao.rotulo, /^Questão \d+ do Enem \d{4}, \dº dia$/);
    assert.equal(it.linha, `Você marcou ${errada(errou)}. A certa é ${errou.gabarito}.`);
    assert.equal(it.trecho, null); assert.deepEqual(it.apostila, { rotulo: 'Rever a apostila', topico: TOP, secao: 2, ancora: 'secao-2' });
    assert.ok(er.filtros.some(f => f.cap === TOP && f.n >= 1));
    assert.equal(it.refazer.disponivel, false);
  });

  test(`[${P}] R1-13/R1-14/R1-47 · textos: XP, meta da semana sem rótulo repetido, alarme recusado e "neste aparelho"`, () => {
    assert.ok(!NAO_TEM.some(x => /só serve para crescer|celular/.test(x.motivo)));
    const { n, rel } = novo(pk.dados, { dia: '2026-11-16', perfil: { alarme: 'agora-nao' } });
    for (const d of ['2026-11-16', '2026-11-17', '2026-11-18']) { ir(n, rel, d); if (!n.st.missao.fechada) { jogar(n, rel); n.despachar('FECHAR'); } }
    const s = n.semana();
    assert.equal(s.texto, '3 de 3 dias, cumprida');
    assert.ok(!/Meta da semana/.test(s.texto));
    assert.ok(!/só vê se cumpriu/.test(n.plano().meta.regra));
    ir(n, rel, '2026-11-19'); jogar(n, rel);
    assert.equal(n.tela().vm.quando.lembrete, 'Se quiser, crie um alarme "Prumo" às 19:00 no Relógio do celular.');
    assert.ok(!/Toque/.test(n.estudar().intro));
  });

  test(`[${P}] R1-15 · "Na segunda começa por aqui" na quinta; a questão do Enem leva o crédito do INEP`, () => {
    const { n, rel } = novo(pk.dados, { dia: '2026-11-19' });
    jogar(n, rel);
    const a = n.tela().vm.amanha;
    assert.equal(a.rotulo, 'Na segunda começa por aqui');
    if (a.fonte) assert.match(a.aviso, /^Questão \d+ do Enem \d{4}, \dº dia\. INEP, CC BY-ND 3\.0\. Só para pensar no caminho/);
    const { n: n2, rel: r2 } = novo(pk.dados);
    jogar(n2, r2);
    assert.equal(n2.tela().vm.amanha.rotulo, 'Amanhã começa por aqui');
  });

  test(`[${P}] R1-16/R1-17/R1-42 · "ver a regra" sem códigos nem IA; nível 5 sem nome; intervalos com a conta certa`, () => {
    const { n, rel } = novo(pk.dados);
    const v = n.hoje().porQue.verARegra;
    assert.ok(!/aprendizado|intelig|\bIA\b/i.test(v.oQueE));
    assert.ok(v.linhas.every(l => /^\d+\. (sim|não|também): /.test(l)), v.linhas.join(' | '));
    assert.equal(v.regras.filter(r => r.decidiu).length, 1);
    const pl = n.plano().intervalos;
    assert.deepEqual(pl.porNivel.map(x => x.nome), ['nível 1 de 5', 'nível 2 de 5', 'nível 3 de 5', 'nível 4 de 5', 'nível 5 de 5']);
    assert.ok(!/dobrando/.test(pl.verARegra));
    const maior = pl.porNivel[4].dias;
    assert.match(pl.verARegra, new RegExp(`e ${maior} dias\\.$`));
    assert.ok(maior >= 5 && maior >= Math.round(0.15 * n.plano().prova.horizonte));
    n.carregarExemplo();
    const ve = n.hoje().porQue.verARegra;
    assert.ok(!/\b[RP]\d|\bR5[ab]\b/.test(ve.linhas.join(' ')), 'sem os códigos internos (R0, P2…)');
  });

  test(`[${P}] R1-18/R1-19 · um nome para cada etapa do tópico, e a fase em todas as telas da partida`, () => {
    const { n, rel } = novo(pk.dados);
    const telas = [];
    n.despachar({ tipo: 'ESTUDAR_TOPICO', id: TOP });
    for (let g = 0; g < 80; g++) {
      const e = n.estado(), t = n.tela(), m = n.st.missao, p = m.passos[m.i];
      telas.push(t.vm);
      if (['pergunta', 'leitura', 'feedback', 'fimDaRodada', 'encerramento'].includes(e)) assert.ok(['aquecer', 'apostila', 'questoes', 'visto'].includes(t.vm.fase), `${e} sem fase`);
      if (e === 'pergunta') n.despachar({ tipo: 'RESPONDER', alt: n.missao.itemDe(p.id).gabarito });
      else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
      else if (e === 'feedback') { rel.avancarMs(4000); n.despachar('CONTINUAR'); }
      else if (e === 'fimDaRodada') n.despachar('SEGUIR');
      else break;
    }
    assert.equal(n.tela().vm.fase, 'visto');
    const tudo = [...telas, n.topicoPagina(TOP), n.hoje()].flatMap(x => textos(x)).join(' | ');
    for (const re of [/Teoria de /, /pergunta do começo/i, /Ler a teoria/, /Rever a teoria/, /antes de ler a teoria/, /\(\d+ partes,/]) assert.ok(!re.test(tudo), `${re}`);
    assert.ok(/Resposta do aquecimento/.test(tudo) && /Você fez o aquecimento antes de ler a apostila\./.test(tudo));
    // no caderno, sem fase (a trilha é só do tópico)
    const { n: n2 } = novo(pk.dados);
    n2.despachar('COMECAR');
    assert.equal(n2.tela().vm.fase, null);
  });

  test(`[${P}] R1-43 · o crédito da apostila não diz "revisão em andamento"; com revisão registrada, diz quem revisou`, () => {
    const { n } = novo(pk.dados);
    assert.equal(n.teoria(TOP).credito, 'Texto da equipe Prumo · CC BY-SA 4.0');
    const lista = LISTA.map(x => (x.id === TOP ? Object.assign({}, x, { teoria: Object.assign({}, x.teoria, { revisao: { por: 'Prof. Ana', em: '2026-11-20' } }) }) : x));
    const { n: n2 } = novo(pk.dados, { praticas: lista });
    assert.equal(n2.teoria(TOP).credito, 'Texto da equipe Prumo · CC BY-SA 4.0 · revisado por Prof. Ana em 20/11/2026');
  });

  test(`[${P}] R1-46 · lista longa de revisões vira resumo, sem título com vírgula solto`, () => {
    const { n } = novo(pk.dados);
    const caps = n.pack.capitulos.map(c => c.id);
    assert.equal(n._revisoes(caps.slice(0, 3)), '3 revisões de Funções afins (Caps. 1, 2 e 3)');
    assert.equal(n._revisoes([...caps, TOP], { curto: true }), `5 revisões de Funções afins e de ${n.prat.curto(TOP)}`);
    assert.equal(n._revisoes(caps.slice(0, 2)), `revisões do capítulo ${n.pack.capitulos[0].titulo} e do capítulo ${n.pack.capitulos[1].titulo}`);
  });
}
