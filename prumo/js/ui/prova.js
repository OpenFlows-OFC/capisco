/* =========================================================
   PRUMO · Prova do caderno (c.3i)
   Reaproveita os componentes da missão. A Prova vencida fica em carimbo (a
   única cor de conquista; nada de latão fora do símbolo): o troféu anunciado
   na abertura desce como o visto, com a taça, o nome do caderno e o dia, e
   toca o som 'trofeu' na chegada (casca.js); o selo da matéria vem junto
   quando é o primeiro troféu dela. O troféu fica no Caderno e no Perfil.
   Estados: prova (abertura) · provaPergunta · provaFeedback · provaTrecho ·
   provaResultado. Ver js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { registrar } from './registro.js';
import { enunciado, alternativasPergunta, alternativasFeedback, rodape, blocos, botaoContinuar, animarContinuar, prepararFiguras, ampliarFigura, questaoCab, trofeu, lapis, placarTopo, linhaCombo, carimbos } from './componentes.js';

function topoProva(t) {
  return h`<header class="topo">
    <div class="topo-linha"><p class="topo-etapa">${t.etapa}</p>
      <div class="topo-acoes">${lapis(t.vidas)}${placarTopo(t.placar)}<button type="button" class="link" data-folha="encerrarProva">${t.encerrar}</button></div></div>
    <div class="topo-medidor"><div class="medidor">
      <span class="casas">${cada(t.casas, c => h`<span class="casa ${c.cheia ? 'cheia' : ''}" aria-label="${`${c.rotulo}: ${c.cheia ? 'acerto' : 'falta'}`}"><span aria-hidden="true">${c.rotulo}</span></span>`)}</span>
      <span class="medidor-texto">${t.tentativa}</span>
    </div></div>
  </header>`;
}

export function telaProva(ctx, t) {
  const { nome, vm } = t;
  if (!vm) return { chave: `prova:${nome}`, html: h`<main class="missao"></main>` };
  if (nome === 'prova') {
    return {
      chave: 'prova:abertura', titulo: 'Prova do caderno',
      html: h`<main class="missao" style="padding-top:32px">
        <p class="rotulo">Prova do caderno</p>
        <h1 class="titulo" tabindex="-1" data-foco-inicial style="margin:8px 0 12px">${vm.titulo}</h1>
        <p style="font-size:18px;line-height:28px">${vm.regra}</p>
        <p>${vm.tamanho}</p>
        <p class="texto-2">${vm.aviso}</p>
        <p class="prova-vidas">${lapis({ total: 3, restam: 3 })} ${vm.vidas}</p>
        <hr class="fio">
        <p>${vm.trofeu}</p>
        ${vm.reaproveita ? h`<p class="texto-2 pequeno">${vm.reaproveita}</p>` : ''}
      </main>`,
      barra: cada(vm.acoes, (a, i) => h`<button type="button" class="${i ? 'botao-sec' : 'botao'} botao-largo" data-ev="${a.evento}">${a.rotulo}</button>`),
    };
  }
  if (nome === 'provaPergunta') {
    const k = `${vm.item.id}@prova@${vm.topo.tentativa}`;
    const marcada = ctx.ui.selecao && ctx.ui.selecao.chave === k ? ctx.ui.selecao.alt : null;
    return {
      chave: `provaPergunta:${k}`, titulo: 'Prova do caderno',
      html: h`<main class="missao">${topoProva(vm.topo)}
        <section class="pergunta"><div class="pergunta-cabeca"><span class="so-leitor">${vm.rotulo}. </span>${questaoCab(vm.item, { comoTitulo: true })}</div>
        ${enunciado(vm.item)}
        <form data-enviar="responder" data-chave="${k}" novalidate>${alternativasPergunta(vm.item.alternativas, marcada)}</form>
        ${rodape(vm.item.rodape, vm.item.licencaUrl)}</section></main>`,
      barra: h`<button type="button" class="botao botao-largo" data-acao="responder" data-chave="${k}" aria-disabled="${marcada ? 'false' : 'true'}">${vm.acao.rotulo}</button>`,
      depois(raiz) { prepararFiguras(raiz.querySelector('#principal') || raiz, { aoAmpliar: el => ampliarFigura(ctx, el) }); },
    };
  }
  if (nome === 'provaFeedback' || nome === 'provaTrecho') {
    const fb = nome === 'provaTrecho' ? vm.feedback : vm;
    const corpo = h`<main class="missao">${topoProva(fb.topo)}
      <section class="pergunta"><div class="pergunta-cabeca">${questaoCab(fb.item)}</div>${enunciado(fb.item)}${alternativasFeedback(fb.alternativas)}${rodape(fb.item.rodape, fb.item.licencaUrl)}
      <section class="feedback" id="feedback"><h1 class="feedback-titulo" ${nome === 'provaFeedback' ? cru('tabindex="-1" data-foco-inicial') : ''}>${fb.titulo}</h1>
        ${fb.certa ? linhaCombo(fb.topo.placar) : h`<p class="prova-vidas">${lapis(fb.topo.vidas)} ${fb.topo.vidas.restam ? `Um lápis quebrou. Restam ${fb.topo.vidas.restam}.` : 'O último lápis quebrou.'}</p>`}
        ${fb.porque ? h`<p>${fb.porque}</p>` : ''}${fb.falta ? h`<p class="falta"><strong>O que faltou.</strong> ${fb.falta}</p>` : ''}
        <div class="acoes-fb">${fb.trecho ? h`<button type="button" class="botao-sec botao-largo" data-ev="${fb.trecho.evento}">${fb.trecho.rotulo}</button>` : ''}</div>
      </section></section></main>`;
    if (nome === 'provaFeedback') return { chave: `provaFeedback:${fb.item.id}:${fb.topo.tentativa}`, titulo: 'Prova do caderno', html: corpo, barra: botaoContinuar(fb.continuar), depois: raiz => animarContinuar(raiz) };
    return {
      chave: `provaTrecho:${vm.ancora}`, titulo: 'Trecho',
      html: h`<div inert aria-hidden="true">${corpo}</div><div class="folha-fundo"><div class="folha folha-alta" role="dialog" aria-modal="true" aria-labelledby="trecho-titulo">
        <div class="folha-cabeca"><h1 class="folha-titulo" id="trecho-titulo" tabindex="-1" data-foco-inicial>${vm.titulo || vm.rotulo}</h1></div>
        <div class="folha-corpo" id="trecho-corpo"><article class="pagina-livro"><p class="rotulo cabeco">${vm.cabeco}</p><h2 class="pagina-titulo">${vm.pagina.titulo}</h2>${blocos(vm.blocos, vm.ancora, { grifar: !(vm.feedback && vm.feedback.certa) })}</article></div>
        <div class="folha-pe"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div></div></div>`,
      depois(raiz) { const c = raiz.querySelector('#trecho-corpo'), a = document.getElementById(vm.ancora); if (c && a) c.scrollTop = a.offsetTop - 24; },
    };
  }
  // provaResultado: vencida, o troféu anunciado na abertura (carimbo, com o som 'trofeu' tocado pela casca na
  // chegada) e o selo da matéria quando ele vem junto; não vencida, os capítulos que pesaram e a volta da Prova
  const nova = ctx.ui.chave !== 'provaResultado';   // o carimbo desce só na primeira vez que a tela aparece
  return {
    chave: 'provaResultado', titulo: 'Prova do caderno',
    html: h`<main class="colofao">
      <h1 class="manchete colofao-titulo ${vm.venceu ? 'prova-vencida' : ''}" tabindex="-1" data-foco-inicial>${vm.titulo || 'Prova do caderno'}</h1>
      <p>${vm.texto}</p>
      ${vm.trofeu ? trofeu(vm.trofeu, { novo: nova && vm.trofeu.novo }) : ''}
      ${vm.venceu && vm.estrelas ? h`<p class="placar-linha">${carimbos(vm.estrelas, { grande: true, novo: nova })} ${vm.linhaEstrelas}</p>` : ''}
      ${vm.trofeu ? h`<p>${vm.selo ? h`<strong>Selo de ${vm.selo.nome}:</strong> primeiro troféu da matéria. ` : ''}O troféu fica guardado no Caderno e no Perfil.</p>` : ''}
      ${vm.linhaRevisar ? h`<p>${vm.linhaRevisar}</p>` : ''}
      ${vm.volta ? h`<p class="texto-2">${vm.volta}</p>` : ''}
      <div class="fechar"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </main>`,
  };
}

registrar({
  folhas: {
    encerrarProva(ctx, dados, t) {
      const tp = t.vm && (t.vm.topo || (t.vm.feedback && t.vm.feedback.topo));
      return {
        rotulo: 'Encerrar a prova',
        corpo: h`<p class="feedback-titulo">Parar a prova agora?</p><p>${tp ? tp.avisoEncerrar : 'Encerrar a prova no meio não muda nada.'}</p>`,
        pe: h`<button type="button" class="botao-sec botao-largo" data-ev="ENCERRAR_PROVA">Encerrar a prova</button><button type="button" class="link link-centro" data-acao="fecharFolha">Voltar à prova</button>`,
      };
    },
  },
});
