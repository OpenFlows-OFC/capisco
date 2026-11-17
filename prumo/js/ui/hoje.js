/* =========================================================
   PRUMO · Hoje (c.2): a folha de rosto da missão do dia
   Cabeçalho com só três coisas (data; constância com "N dias estudados";
   engrenagem). Uma única decisão: começar. "Começar" fica no fluxo; a única
   barra fixa é a das abas. Estados: primeiro dia, em curso, feito, folga,
   modo retorno, Questão do dia (g.3), e os de texto (Hoje não, pausa,
   encerrado antes, reta final, firme, prova passou).
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { registrar } from './registro.js';
import { constancia, linkAjustes } from './componentes.js';

/** Cabeçalho comum das abas (data · constância · engrenagem). Exportado para Caderno e Plano. */
export function cabecalho(vm) {
  return h`<header class="cabecalho">
    <p class="rotulo">${vm.data}</p>
    ${linkAjustes()}
    ${vm.constancia ? h`<div class="constancia">${constancia(vm.constancia)}</div>` : ''}
  </header>`;
}

function links(vm) {
  if (!vm.links || !vm.links.length) return '';
  return h`<ul class="links">${cada(vm.links, l => {
    if (l.evento) return h`<li><button type="button" class="link" data-ev="${l.evento}">${l.rotulo}</button></li>`;
    if (l.aba) return h`<li><a class="link" href="#/${l.aba}">${l.rotulo}</a></li>`;
    if (l.rotulo === 'ver passos') return h`<li><button type="button" class="link" data-folha="passos">${l.rotulo}</button></li>`;
    if (l.rotulo === 'Por que esta missão?') return h`<li><button type="button" class="link" data-folha="porQue">${l.rotulo}</button></li>`;
    return h`<li><span>${l.rotulo}</span></li>`;
  })}</ul>`;
}

function acao(vm) {
  if (!vm.acao) return '';
  // hífen inseparável: "meia-noite" não quebra no meio
  return h`<button type="button" class="botao" data-ev="${vm.acao.evento}">${vm.acao.rotulo.replace(/-/g, '‑')}</button>${vm.acao.nota ? h`<p class="nota-acao">${vm.acao.nota}</p>` : ''}`;
}

function blocoProva(p) {
  if (!p) return '';
  return h`<section class="bloco-prova" aria-labelledby="prova-titulo">
    <h2 class="titulo-pequeno" id="prova-titulo">${p.titulo}</h2>
    <p class="texto-2" style="margin:0">${p.texto}</p>
    <button type="button" class="link" data-ev="${p.acao.evento}">${p.acao.rotulo}</button>
  </section>`;
}

/** Linha de abertura do estado (retorno, reta final, firme, prova passou, "Bem-vindo de volta."). */
function lede(vm) {
  if (!vm.texto || vm.estado === 'questaoDoDia' || vm.estado === 'hojeNao') return '';
  return h`<p class="lede">${vm.texto}</p>`;
}

function rosto(vm) {
  const b = vm.bloco;
  const composicao = vm.estado === 'questaoDoDia' && vm.texto
    ? vm.texto.replace(/^Questão do dia · /, '').replace(/ · ≈ \d+ min$/, '')   // "3 questões dos capítulos que você já abriu"
    : b.composicao;
  return h`<section class="rosto ${b.esmaecido ? 'esmaecido' : ''}" aria-labelledby="manchete">
    ${vm.estado === 'hojeNao' ? h`<p class="lede">${vm.texto}</p>` : ''}
    ${lede(vm)}
    ${vm.porqueEstudo ? h`<p class="texto-2" style="margin:0 0 8px">${vm.porqueEstudo}</p>` : ''}
    ${b.rotulo ? h`<p class="rotulo">${b.rotulo}</p>` : ''}
    <h1 class="manchete" id="manchete" tabindex="-1" data-foco-inicial>${b.titulo}</h1>
    <p class="linha-fina">${b.linhaFina}</p>
    ${composicao ? h`<p class="composicao">${composicao}</p>` : ''}
    <hr class="fio">
    ${b.atrasada ? h`<p class="atrasada">${b.atrasada}</p>` : ''}
    ${b.ganho ? h`<p class="ganho">${b.ganho}</p>` : ''}
    <div class="acoes-rosto">
      ${acao(vm)}
      ${links(vm)}
    </div>
  </section>`;
}

function semMissao(vm) {
  // feito, encerrado antes, folga, pausa, prova passou sem passos
  const f = vm.feito;
  return h`<section class="rosto" aria-labelledby="manchete">
    <h1 class="estado-texto" id="manchete" tabindex="-1" data-foco-inicial>${vm.texto || 'Hoje'}</h1>
    ${f ? h`<div class="previa">
      <p class="rotulo">Próxima missão</p>
      <p class="proxima">${f.previa}</p>
      ${f.proxima && f.proxima.texto && f.proxima.texto !== f.previa ? h`<p class="texto-2" style="margin:4px 0 0">${f.proxima.texto}</p>` : ''}
    </div>` : ''}
    ${vm.acao ? h`<div class="acoes-rosto">${acao(vm)}</div>` : ''}
    ${vm.links && vm.links.length ? h`<div style="margin-top:12px">${links(vm)}</div>` : ''}
  </section>`;
}

/** Tela Hoje (aba). t = nucleo.tela() nos estados 'hoje' e 'feito'. */
export function telaHoje(ctx, t) {
  const vm = t.vm;
  if (!vm) return { chave: 'hoje:vazio', html: h`<p>Carregando…</p>` };
  const corpo = vm.bloco ? rosto(vm) : semMissao(vm);
  return {
    chave: `hoje:${vm.dia}:${vm.estado}`,
    titulo: 'Hoje',
    html: h`${cabecalho(vm)}
      ${vm.faixa ? h`<p class="aviso-linha" role="status" style="margin-top:16px">${vm.faixa}</p>` : ''}
      ${corpo}
      ${blocoProva(vm.prova)}`,
  };
}

/* ---------------- folhas de Hoje ---------------- */
registrar({
  folhas: {
    /** "ver passos": os passos numerados como o índice de um livro, com a página à direita. */
    passos(ctx, dados, t) {
      const b = t.vm && t.vm.bloco;
      if (!b) return null;
      return {
        rotulo: 'Passos de hoje',
        corpo: h`<ol class="indice">${cada(b.passos, p => h`<li>
            <span class="n num">${p.n}</span>
            <span class="t"><span>${p.texto}</span></span>
            <span class="pg num">${p.pagina || ''}</span>
            ${p.nota ? h`<span class="nota">${p.nota}</span>` : ''}
          </li>`)}</ol>`,
        pe: h`<button type="button" class="botao-sec" data-acao="fecharFolha">Fechar</button>`,
      };
    },
    /** "Por que esta missão?": a frase simples e, em "ver a regra", a trilha da árvore (c.11). */
    porQue(ctx, dados, t) {
      const pq = t.vm && t.vm.porQue;
      if (!pq) return null;
      const aberta = !!(dados && dados.aberta), v = pq.verARegra || {};
      return {
        rotulo: 'Por que esta missão?',
        corpo: h`<p class="titulo-pequeno" style="font:600 20px/28px var(--f-titulo);margin:0 0 12px">${pq.frase}</p>
          ${aberta ? h`
            <p class="texto-2 pequeno">${v.oQueE}</p>
            <ol class="trilha-regras">${cada(v.linhas, l => h`<li class="${/^\S+ sim:/.test(l) ? 'sim' : ''}">${l}</li>`)}
              ${cada(v.revisoes, l => h`<li>${l}</li>`)}</ol>
            ${v.lembranca && v.lembranca.length ? h`<p class="rotulo" style="margin-top:16px">Lembrança estimada</p><ul class="trilha-regras">${cada(v.lembranca, l => h`<li>${l}</li>`)}</ul>` : ''}
            ${v.questoes ? h`<p class="pequeno" style="margin-top:12px">${v.questoes}</p>` : ''}`
            : h`<button type="button" class="link" data-acao="verRegraPorQue">ver a regra</button>`}`,
        pe: h`<button type="button" class="botao-sec" data-acao="fecharFolha">Fechar</button>`,
      };
    },
  },
  acoes: {
    verRegraPorQue(ctx) {
      if (!ctx.ui.folha) return;
      ctx.ui.folha.dados = Object.assign({}, ctx.ui.folha.dados || {}, { aberta: true });
      ctx.redesenharFolha();
      const lista = document.querySelector('#folha-raiz .trilha-regras');
      if (lista) { lista.setAttribute('tabindex', '-1'); lista.focus({ preventScroll: true }); }
    },
  },
});
