/* =========================================================
   PRUMO · Hoje (c.2), na ordem do design system:
   marca + Ajustes; a data e os risquinhos (quebram de linha quando falta
   espaço); o título da missão; o Cabeçalho de prova (Capítulo | Páginas |
   Tempo, sem Data); o texto da regra; o Recado "Ontem:" logo acima do botão
   Começar; os links. Uma única decisão: começar. "Começar" fica no fluxo; a
   única barra fixa é a das divisórias.
   Estados: primeiro dia, em curso, feito, folga, modo retorno, Questão do
   dia (g.3), e os de texto (Hoje não, pausa, encerrado antes, reta final,
   firme, prova passou).
   ========================================================= */
import { h, cada, cru } from './dom.js';
import { registrar } from './registro.js';
import { marca, constancia, cabecalhoProva, recado, semQuebra, iconeArea } from './componentes.js';
import { guardarFoto } from './fases.js';
import { noFase, desenharCaminhos, CADEADO } from './estudar.js';

/** Topo das abas: a marca; em Hoje, a saudação, a data e os risquinhos em destaque. */
export function topoAba({ data, constancia: c, saudacao } = {}) {
  return h`<div class="linha-topo">${marca()}${data ? h`<p class="data-hoje">${data}</p>` : ''}</div>
    ${saudacao ? h`<p class="saudacao">${saudacao}</p>` : ''}
    ${c ? h`<div class="linha-data constancia-destaque">${constancia(c)}</div>` : ''}`;
}

const DETALHE = new Set(['ver passos', 'Por que esta missão?']);
function links(vm, { detalhe = false } = {}) {
  const lista = (vm.links || []).filter(l => DETALHE.has(l.rotulo) === detalhe);
  if (!lista.length) return '';
  return h`<ul class="links">${cada(lista, l => {
    if (l.evento) return h`<li><button type="button" class="link" data-ev="${l.evento}">${l.rotulo}</button></li>`;
    if (l.aba) return h`<li><a class="link" href="#/${l.aba}">${l.rotulo}</a></li>`;
    if (l.rotulo === 'ver passos') return h`<li><button type="button" class="link" data-folha="passos">Ver os passos</button></li>`;
    if (l.rotulo === 'Por que esta missão?') return h`<li><button type="button" class="link" data-folha="porQue">${l.rotulo}</button></li>`;
    return h`<li><span>${l.rotulo}</span></li>`;
  })}</ul>`;
}

function acao(vm) {
  if (!vm.acao) return '';
  // hífen inseparável: "meia-noite" não quebra no meio
  return h`<button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo.replace(/-/g, '‑')}</button>${vm.acao.nota ? h`<p class="nota-acao">${vm.acao.nota}</p>` : ''}`;
}

function blocoProva(p) {
  if (!p) return '';
  return h`<section class="bloco-prova" aria-labelledby="prova-titulo">
    <h2 class="titulo-pequeno" id="prova-titulo">${p.titulo}</h2>
    <p class="texto-2">${p.texto}</p>
    <button type="button" class="link" data-ev="${p.acao.evento}">${p.acao.rotulo === 'ver a regra' ? 'Ver a regra da Prova' : p.acao.rotulo}</button>
  </section>`;
}

/** Frase de abertura do estado (retorno, reta final, firme, prova passou, "Bem-vindo de volta."). */
function lede(vm) {
  if (!vm.texto || vm.estado === 'questaoDoDia') return '';
  return h`<p class="lede">${vm.texto}</p>`;
}

function rosto(vm) {
  const b = vm.bloco;
  const composicao = vm.estado === 'questaoDoDia' && vm.texto ? vm.texto : b.composicao;
  // um só recado sobre atraso: se o "Hoje vence" do topo já conta as atrasadas, o bloco não repete
  const atrasada = b.atrasada && !(vm.venceHoje && vm.venceHoje.atrasadas) ? b.atrasada : null;
  return h`<section class="rosto ${b.esmaecido ? 'esmaecido' : ''}" aria-labelledby="manchete">
    ${lede(vm)}
    ${vm.porqueEstudo ? h`<p class="texto-2">${vm.porqueEstudo}</p>` : ''}
    <div class="proximo">
      <p class="rotulo">${vm.proximoRotulo || 'Seu próximo conteúdo'}${b.rotulo ? h`<span class="so-leitor">, ${b.rotulo}</span>` : ''}</p>
      <h1 class="manchete" id="manchete" tabindex="-1" data-foco-inicial>${b.titulo}</h1>
      ${recado(vm.recado, { papel: 'status' })}
      ${acao(vm)}
    </div>
    ${atrasada ? h`<p class="atrasada">${atrasada}</p>` : ''}
    <details class="detalhes-missao">
      <summary>Detalhes da missão</summary>
      ${venceHoje(vm.venceHoje)}
      ${composicao ? h`<p class="composicao">${composicao}</p>` : ''}
      ${cabecalhoProva(b.cabecalho)}
      ${b.regra ? h`<p class="ganho">${b.regra}</p>` : ''}
      ${links(vm, { detalhe: true })}
    </details>
    <div class="acoes-rosto">
      ${links(vm)}
    </div>
  </section>`;
}

function semMissao(vm) {
  // feito, encerrado antes, folga, pausa, prova passou sem passos
  const f = vm.feito;
  return h`<section class="rosto" aria-labelledby="manchete">
    <h1 class="manchete estado-texto" id="manchete" tabindex="-1" data-foco-inicial>${vm.texto || 'Hoje'}</h1>
    ${f ? h`<div class="previa">
      <p class="proxima"><strong class="proxima-rotulo">Próxima missão</strong> ${semQuebra(f.previa)}</p>
      ${f.proxima && f.proxima.texto && f.proxima.texto !== f.previa ? h`<p class="texto-2">${semQuebra(f.proxima.texto)}</p>` : ''}
    </div>` : ''}
    <div class="acoes-rosto">
      ${recado(vm.recado, { papel: 'status' })}
      ${acao(vm)}
      ${links(vm)}${links(vm, { detalhe: true })}
    </div>
  </section>`;
}

/** Meta da semana: 7 marcas (seg a dom), cheias nos dias estudados. Sem perda: a semana seguinte começa limpa. */
function semana(s) {
  if (!s) return '';
  return h`<section class="semana" aria-label="${s.rotulo}">
    <p class="semana-texto"><strong>${s.rotulo}:</strong> ${s.texto}</p>
    <ol class="semana-marcas">${cada(s.dias, x => h`<li class="${x.estudado ? 'feito' : ''} ${x.hoje ? 'hoje' : ''} ${x.diaDeEstudo ? '' : 'folga'}"><span class="marca" aria-hidden="true"></span><span class="dia">${x.rotulo}</span><span class="so-leitor">${x.estudado ? ', estudado' : x.diaDeEstudo ? '' : ', folga'}</span></li>`)}</ol>
  </section>`;
}
/** "Semana nova" / "Bem-vindo de volta": recomeço anunciado, com a contagem da prova e o visto de retorno. */
function recomeco(r) {
  if (!r) return '';
  return h`<section class="recomeco" aria-labelledby="recomeco-t">
    <h2 class="titulo-pequeno" id="recomeco-t">${r.titulo}</h2>
    ${r.risquinhos ? h`<p>${r.risquinhos}</p>` : ''}
  </section>`;
}
/** "Hoje vence": o marca-texto só no que vence hoje. O atraso vai em texto normal, sem destaque: é um
 *  aviso de ordem, não uma cobrança (sem culpa, como o quadro "Semana nova" logo acima). */
function venceHoje(v) {
  if (!v) return '';
  if (!v.hoje) return h`<p class="pr-recado vence-hoje">${v.vence} ${v.porque}</p>`;
  // "Hoje vencem 2 revisões… Mais 3 revisões atrasadas…": o grifo fica na 1ª frase; a do atraso segue sem grifo
  const i = v.atrasadas ? v.vence.indexOf(' Mais ') : -1;
  const grifada = i > 0 ? v.vence.slice(0, i) : v.vence, resto = i > 0 ? v.vence.slice(i) : '';
  return h`<p class="pr-recado vence-hoje"><strong class="pr-recado-rotulo"><span class="grifo">${grifada}</span></strong>${resto} ${v.porque}</p>`;
}

/* ---------------- Início: a trilha da matéria escolhida, no jeito de jogo ----------------
   Barra de cima: a matéria (troca no balão), os dias estudados e os carimbos. Faixa da matéria com o
   avanço e o "guia" (os detalhes da missão). Embaixo, só o caminho; o balão "Começar" fica na fase atual. */
const MATERIA = 'prumo-ui-materia';
const ic = d => cru(`<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${d}</svg>`);
const RISCOS = '<path d="M6 5v14M10 5v14M14 5v14M18 5v14M3.5 15.5l17-7"/>';
const SELO = '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.7 2.7L16 9.5"/>';
const GUIA = '<path d="M12 6.5C10.3 5.2 7.8 4.5 4 4.5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2v-13c-3.8 0-6.3.7-8 2z"/><path d="M12 6.5v13"/>';
const SETA = '<path d="M7 10l5 5 5-5"/>';
const AVISO = new Set(['pausa', 'folga', 'hojeNao', 'encerradoAntes', 'provaPassou', 'retorno', 'reta', 'firme']);

/** A matéria da tela: a guardada neste aparelho; senão a primeira escolhida no perfil. */
export function materiaAtual(tr) {
  let id = null;
  try { id = localStorage.getItem(MATERIA); } catch (e) { /* sem armazenamento */ }
  return tr.areas.find(a => a.id === id) || tr.areas.find(a => a.escolhida) || tr.areas[0];
}

function bolhaInicio(vm, a) {
  const ac = vm.acao && a.escolhida ? vm.acao : null;
  if (ac) {
    const rot = ac.evento === 'CONTINUAR' ? 'Continuar' : ac.evento === 'COMECAR' && vm.estado !== 'hojeNao' ? 'Começar' : ac.rotulo;
    return h`<button type="button" class="bolha-inicio" data-ev="${ac.evento}">${rot.replace(/-/g, '‑')}</button>`;
  }
  if (a.escolhida && (vm.estado === 'feito' || vm.estado === 'encerradoAntes')) return h`<span class="bolha-inicio feito">${ic(SELO)}Feito hoje</span>`;
  return a.atual ? h`<button type="button" class="bolha-inicio" data-folha="fase" data-arg="${a.atual.id}">Jogar</button>` : '';
}

/** Tela inicial (aba Trilha). t = nucleo.tela() nos estados 'hoje' e 'feito'. */
export function telaHoje(ctx, t) {
  const vm = t.vm, n = ctx.nucleo;
  if (!vm) return { chave: 'hoje:vazio', html: h`<p>Abrindo o caderno…</p>` };
  const tr = n.trilha(), a = materiaAtual(tr), c = vm.constancia || {}, selos = n.album().ganhos;
  const bolha = bolhaInicio(vm, a);
  const aviso = (AVISO.has(vm.estado) && vm.texto) || (vm.recomeco && vm.recomeco.titulo) || '';
  return {
    chave: `hoje:${vm.dia}:${vm.estado}:${a.id}`,
    titulo: 'Trilha',
    html: h`<header class="jogo-topo">
        <button type="button" class="jogo-materia" data-folha="materia" aria-label="${`Matéria: ${a.nome}. Trocar de matéria`}">${iconeArea(a.id)}<span>${a.nome}</span>${ic(SETA)}</button>
        <button type="button" class="jogo-contador" data-folha="semana" aria-label="${c.rotulo || 'Dias estudados'}">${ic(RISCOS)}<b>${c.diasEstudados || 0}</b></button>
        <a class="jogo-contador selo" href="#/perfil" aria-label="${`${selos} carimbos`}">${ic(SELO)}<b>${selos}</b></a>
      </header>
      <section class="unidade" aria-labelledby="unidade-t">
        <div class="unidade-texto">
          <h1 class="unidade-titulo" id="unidade-t" tabindex="-1" data-foco-inicial>${a.nome}</h1>
          <div class="trilha-placar"><span class="trilha-conta" aria-label="${`${a.feitas} de ${a.total} fases`}"><b>${a.feitas}</b>/<b>${a.total}</b></span><span class="trilha-barra" aria-hidden="true"><i style="width:${Math.round(100 * a.feitas / Math.max(1, a.total))}%"></i></span></div>
        </div>
        <button type="button" class="unidade-guia" data-folha="missao" aria-label="Detalhes da missão de hoje">${ic(GUIA)}</button>
      </section>
      ${aviso ? h`<p class="jogo-aviso">${aviso}</p>` : ''}
      ${a.atual ? '' : h`<div class="jogo-solta">${bolha}</div>`}
      <div class="trilha-mapa jogo">
        <svg class="trilha-caminho" aria-hidden="true" focusable="false"></svg>
        <ol class="trilha-fases">${cada(a.fases, (f, i) => noFase(f, i, f.atual ? bolha : ''))}</ol>
      </div>`,
    depois(raiz, { mudou } = {}) {
      guardarFoto(n);
      const atual = raiz.querySelector('.jogo .fase-atual');
      if (mudou && atual && atual.getBoundingClientRect().bottom > innerHeight - 96) atual.scrollIntoView({ block: 'center' });
      return desenharCaminhos(raiz);
    },
  };
}

/** O "guia" da missão: o que a Hoje antiga mostrava, recolhido num balão. */
function detalhesMissao(vm) {
  const b = vm.bloco, f = vm.feito, l = { ...vm, links: (vm.links || []).filter(x => x.aba !== 'estudar') };
  const composicao = b && (vm.estado === 'questaoDoDia' && vm.texto ? vm.texto : b.composicao);
  return h`${b ? h`<p class="rotulo">${vm.proximoRotulo}</p><h2 class="titulo-pequeno">${b.titulo}</h2>` : h`<h2 class="titulo-pequeno">${vm.texto || 'Hoje'}</h2>`}
    ${vm.porqueEstudo ? h`<p class="texto-2">${vm.porqueEstudo}</p>` : ''}
    ${vm.intencao ? h`<p class="intencao">${vm.intencao.texto}</p>` : ''}
    ${venceHoje(vm.venceHoje)}
    ${b && b.atrasada && !(vm.venceHoje && vm.venceHoje.atrasadas) ? h`<p class="atrasada">${b.atrasada}</p>` : ''}
    ${composicao ? h`<p class="composicao">${composicao}</p>` : ''}
    ${b ? cabecalhoProva(b.cabecalho) : ''}
    ${b && b.regra ? h`<p class="ganho">${b.regra}</p>` : ''}
    ${recado(vm.recado, { papel: 'status' })}
    ${f ? h`<p class="proxima"><strong class="proxima-rotulo">Próxima missão</strong> ${semQuebra(f.previa)}</p>` : ''}
    ${blocoProva(vm.prova)}
    ${links(l, { detalhe: true })}${links(l)}`;
}

/* ---------------- folhas de Hoje ---------------- */
registrar({
  folhas: {
    /** O guia da missão (o livrinho da faixa da matéria). */
    missao(ctx, dados, t) {
      const vm = t.vm;
      if (!vm) return null;
      return { rotulo: 'Missão de hoje', corpo: h`<div class="guia-missao">${detalhesMissao(vm)}</div>`,
        pe: vm.acao ? acao(vm) : h`<button type="button" class="botao-sec botao-largo" data-acao="fecharFolha">Fechar</button>` };
    },
    /** Os dias estudados (o contador da barra de cima): risquinhos, recomeço e a meta da semana. */
    semana(ctx, dados, t) {
      const vm = t.vm;
      if (!vm) return null;
      return { rotulo: 'Dias estudados', corpo: h`<div class="linha-data constancia-destaque">${constancia(vm.constancia)}</div>${recomeco(vm.recomeco)}${semana(vm.semana)}` };
    },
    /** Trocar de matéria: as do MVP e, apagadas, as que chegam depois. */
    materia(ctx) {
      const tr = ctx.nucleo.trilha(), sel = materiaAtual(tr), embreve = ctx.nucleo.estudar().areas.filter(a => !a.disponivel);
      return { rotulo: 'Matéria', corpo: h`<ul class="materias">
          ${cada(tr.areas, a => h`<li><button type="button" class="materia-op${a.id === sel.id ? ' atual' : ''}" data-acao="escolherMateria" data-arg="${a.id}" aria-pressed="${a.id === sel.id ? 'true' : 'false'}">${iconeArea(a.id)}<span class="materia-nome">${a.nome}</span><span class="trilha-conta"><b>${a.feitas}</b>/${a.total}</span></button></li>`)}
          ${cada(embreve, a => h`<li><span class="materia-op inativa">${iconeArea(a.id)}<span class="materia-nome">${a.nome}</span>${cru(CADEADO)}<span class="so-leitor">, em breve</span></span></li>`)}
        </ul>
        <details class="trilha-regra"><summary>Como a trilha funciona</summary><p>${tr.intro}</p><p class="pequeno texto-2">${tr.regra}</p></details>` };
    },
    /** "Ver os passos": os passos numerados como o índice de um livro, com a página à direita. */
    passos(ctx, dados, t) {
      const b = t.vm && t.vm.bloco;
      if (!b) return null;
      return {
        rotulo: 'Passos de hoje',
        corpo: h`<ol class="indice">${cada(b.passos, p => h`<li>
            <span class="n">${p.n}</span>
            <span class="t"><span>${p.texto}</span></span>
            <span class="pg">${p.pagina || ''}</span>
            ${p.nota ? h`<span class="nota">${p.nota}</span>` : ''}
          </li>`)}</ol>`,
        pe: h`<button type="button" class="botao-sec botao-largo" data-acao="fecharFolha">Fechar</button>`,
      };
    },
    /** "Por que esta missão?": a frase simples e, em "ver a regra", a trilha da árvore (c.11). */
    porQue(ctx, dados, t) {
      const pq = t.vm && t.vm.porQue;
      if (!pq) return null;
      const aberta = !!(dados && dados.aberta), v = pq.verARegra || {};
      return {
        rotulo: 'Por que esta missão?',
        corpo: h`<p class="folha-frase">${pq.frase}</p>
          ${aberta ? h`
            <p class="texto-2 pequeno">${v.oQueE}</p>
            <ol class="trilha-regras">${cada(v.linhas, l => h`<li class="${/^\S+ sim:/.test(l) ? 'sim' : ''}">${l}</li>`)}
              ${cada(v.revisoes, l => h`<li>${l}</li>`)}</ol>
            ${v.lembranca && v.lembranca.length ? h`<p class="rotulo" style="margin-top:16px">Lembrança estimada</p><ul class="trilha-regras">${cada(v.lembranca, l => h`<li>${l}</li>`)}</ul>` : ''}
            ${v.questoes ? h`<p class="pequeno" style="margin-top:12px">${v.questoes}</p>` : ''}`
            : h`<button type="button" class="link" data-acao="verRegraPorQue">Ver a regra</button>`}`,
        pe: h`<button type="button" class="botao-sec botao-largo" data-acao="fecharFolha">Fechar</button>`,
      };
    },
  },
  acoes: {
    escolherMateria(ctx, el) {
      try { localStorage.setItem(MATERIA, el.dataset.arg); } catch (e) { /* sem armazenamento: vale só agora */ }
      ctx.fecharFolha();
      ctx.render();
    },
    verRegraPorQue(ctx) {
      if (!ctx.ui.folha) return;
      ctx.ui.folha.dados = Object.assign({}, ctx.ui.folha.dados || {}, { aberta: true });
      ctx.redesenharFolha();
      const lista = document.querySelector('#folha-raiz .trilha-regras');
      if (lista) { lista.setAttribute('tabindex', '-1'); lista.focus({ preventScroll: true }); }
    },
  },
});
