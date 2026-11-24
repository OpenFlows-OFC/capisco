/* =========================================================
   PRUMO · Estudar: o mapa do que estudar (área → matéria → tópico),
   a página do tópico e a teoria em leitura livre.
   Rotas: #/estudar · #/estudar/<id do tópico> · #/estudar/<id>/teoria[/<seção>][/de-erros]
   ("/de-erros": aberta do Caderno de erros, a apostila volta para lá)
   Tudo vem pronto do núcleo (estudar(), topicoPagina(id), teoriaLivre(id)).
   "Estudar este tópico hoje" manda ESTUDAR_TOPICO (ou CONTINUAR) à máquina.
   ========================================================= */
import { h, cada } from './dom.js';
import { registrar } from './registro.js';
import { nivel, teoria, prepararFiguras, ampliarFigura, comoFunciona, acompanharSumario, idDaAncora, irParaSecao, iconeArea } from './componentes.js';

/* "Como funciona um tópico": aberta até o aluno começar o primeiro tópico (logo abaixo do botão, que fica
   à vista); depois, recolhida. */
const CHAVE_COMO = 'prumo-ui-como-funciona';
function jaViuComo() { try { return localStorage.getItem(CHAVE_COMO) === '1'; } catch (e) { return false; } }
function marcarComo() { try { localStorage.setItem(CHAVE_COMO, '1'); } catch (e) { /* sem armazenamento: segue aberta */ } }
import { topoAba } from './hoje.js';

function linhaTopico(t) {
  const corpo = h`<span class="topico-titulo">${t.titulo}</span>
    ${t.nivel ? nivel({ cheios: t.nivel.cheios, nome: t.nivel.cheios ? t.nivel.rotulo : null }) : ''}
    <span class="topico-estado">${t.estadoTexto}</span>
    ${t.progresso ? h`<span class="topico-progresso">${t.progresso.texto}</span>` : ''}`;
  return t.disponivel
    ? h`<li><a class="topico-linha" href="#/estudar/${t.id}">${corpo}</a></li>`
    : h`<li><div class="topico-linha inativo">${corpo}</div></li>`;
}

function mapa(v) {
  return h`<h1 class="titulo" tabindex="-1" data-foco-inicial>${v.titulo}</h1>
    <p>${v.intro}</p>
    ${cada(v.areas, a => h`<section class="mapa-area" aria-labelledby="area-${a.id}">
      <h2 class="mapa-area-titulo" id="area-${a.id}">${iconeArea(a.id)}${a.nome}${a.disponivel ? '' : h`<span class="etiqueta">em breve</span>`}</h2>
      ${a.disponivel ? cada(a.materias, mt => h`
        ${a.materias.length > 1 || mt.nome !== a.nome ? h`<p class="rotulo mapa-materia">${mt.nome}</p>` : ''}
        <ul class="lista-topicos">${cada(mt.topicos, linhaTopico)}</ul>`) : h`<p class="mapa-embreve">${a.frase}</p>`}
    </section>`)}
    <p class="pequeno texto-2" style="margin-top:24px">${v.regraNivel}</p>`;
}

function botaoAcao(a) {
  if (!a) return '';
  if (!a.disponivel) return h`<div class="topico-acao"><button type="button" class="botao botao-largo" aria-disabled="true" aria-describedby="motivo-topico">${a.rotulo}</button><p class="topico-motivo" id="motivo-topico">${a.motivo}</p></div>`;
  return h`<div class="topico-acao"><button type="button" class="botao botao-largo" data-acao="estudarTopico" data-arg="${a.id || ''}" data-evento="${a.evento}">${a.rotulo}</button>${a.nota ? h`<p class="nota-acao">${a.nota}</p>` : ''}</div>`;
}

/** "Como funciona" em frases curtas: sai a ressalva do fim da rodada (fica para quando acontecer). */
function curto(itens) {
  return itens ? itens.map(x => ({ ...x, texto: x.texto.replace(/\s*Se não der mais[^.]*\./u, '') })) : undefined;
}
/** Capítulo do caderno na página do tópico: abre a 1ª página dele no Caderno (leitura livre). */
function linhaCapitulo(c, pag) {
  const corpo = h`<span class="topico-titulo">Cap. ${c.n}: ${c.titulo}</span>${nivel({ cheios: c.nivel.cheios, nome: c.nivel.rotulo })}`;
  return pag ? h`<li><a class="topico-linha" href="#/caderno/pagina/${pag}">${corpo}</a></li>` : h`<li class="topico-linha">${corpo}</li>`;
}
function paginaTopico(p, n) {
  if (!p) return h`<p>Tópico não encontrado.</p><p><a class="link" href="#/estudar">Voltar ao mapa</a></p>`;
  return h`<p class="voltar-mapa"><a class="link" href="#/estudar">Voltar ao mapa</a></p>
    <p class="rotulo rotulo-area">${iconeArea(p.area)}${p.area}${p.materia && p.materia !== p.area ? h`, ${p.materia}` : ''}</p>
    <h1 class="titulo" tabindex="-1" data-foco-inicial>${p.titulo}</h1>
    ${p.disponivel ? h`
      ${nivel({ cheios: p.nivel.cheios, nome: p.nivel.cheios ? p.nivel.rotulo : null })}
      <p style="margin:8px 0 0">${p.estadoTexto}</p>
      ${p.progresso ? h`<p class="texto-2" style="margin:4px 0 0">${p.progresso.texto}</p>` : ''}
      ${botaoAcao(p.acao)}
      ${p.comoFunciona === null ? '' : comoFunciona({ aberto: !jaViuComo(), itens: curto(p.comoFunciona) })}
      <section class="secao" aria-labelledby="pq-t"><h2 class="titulo-pequeno" id="pq-t">Por que cai no Enem</h2><p>${p.porQueCai}</p></section>
      ${p.ideias && p.ideias.length ? h`<section class="secao" aria-labelledby="id-t"><h2 class="titulo-pequeno" id="id-t">O essencial</h2><ul class="teoria-lista">${cada(p.ideias, x => h`<li>${x}</li>`)}</ul></section>` : ''}
      ${p.capitulos ? h`<ul class="lista-topicos">${cada(p.capitulos, (c, k) => linhaCapitulo(c, primeiraPagina(n, c, k)))}</ul>` : ''}
      <p class="secao">${p.leitura.aba ? h`<a class="link" href="#/${p.leitura.aba}">${p.leitura.rotulo}</a>` : h`<a class="link" href="#/estudar/${p.id}/teoria">${p.leitura.rotulo}</a>`}</p>`
    : h`<p>${p.estadoTexto}</p>`}`;
}

function primeiraPagina(n, c, k) {
  try { const caps = n.sumario().capitulos; const s = caps.find(x => x.n === c.n) || caps[k]; return s && s.paginaIds && s.paginaIds[0]; } catch (e) { return null; }
}

function teoriaLivre(v, id, ancora, deErros) {
  if (!v) return h`<p>Apostila não encontrada.</p><p><a class="link" href="#/estudar">Voltar ao mapa</a></p>`;
  const voltar = deErros ? h`<a class="link" href="#/caderno/erros">Voltar ao Caderno de erros</a>` : h`<a class="link" href="#/estudar/${id}">Voltar ao tópico</a>`;
  return h`<p class="voltar-mapa">${voltar}</p>
    <p class="pr-recado" role="note">${v.aviso}</p>
    ${teoria(v, { ancora, grifar: !!ancora })}
    <p style="margin-top:24px">${voltar}</p>`;
}

/** Aba Estudar. rota.sub = id do tópico; rota.resto[0] = 'teoria'. */
export function telaEstudar(ctx, t, rota) {
  const n = ctx.nucleo, id = rota.sub;
  let corpo, titulo = 'Estudar', ancora = null;
  if (!id) corpo = mapa(n.estudar());
  else if (rota.resto[0] === 'teoria') {
    const resto = rota.resto.filter(x => x !== 'de-erros'), v = n.teoriaLivre(id);
    ancora = idDaAncora(resto[1]); corpo = teoriaLivre(v, id, ancora, resto.length < rota.resto.length); titulo = v ? `Apostila: ${v.titulo}` : titulo;
  } else { const p = n.topicoPagina(id); corpo = paginaTopico(p, n); titulo = p ? p.titulo : titulo; }
  return {
    chave: `estudar:${id || ''}:${rota.resto.join('/')}`,
    titulo,
    html: h`${topoAba()}${corpo}`,
    depois(raiz, { mudou } = {}) {
      // vindo do Caderno de erros: abre na seção que a questão cobrou (o título dela, com o marca-texto)
      if (ancora && mudou) irParaSecao(ancora, { suave: false });
      prepararFiguras(raiz.querySelector('#principal') || raiz, {
        aoAmpliar: el => ampliarFigura(ctx, el),
      });
      return acompanharSumario(raiz);
    },
  };
}

registrar({
  acoes: {
    estudarTopico(ctx, el) {
      marcarComo();
      const ev = el.dataset.evento;
      if (ev === 'CONTINUAR') { ctx.despachar({ tipo: 'CONTINUAR' }); return; }
      const ok = ctx.despachar({ tipo: 'ESTUDAR_TOPICO', id: el.dataset.arg });
      if (!ok) ctx.avisar('Não deu para começar este tópico agora. Nada foi alterado.');
    },
  },
});
