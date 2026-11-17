/* =========================================================
   PRUMO · Estudar: o mapa do que estudar (área → matéria → tópico),
   a página do tópico e a teoria em leitura livre.
   Rotas: #/estudar · #/estudar/<id do tópico> · #/estudar/<id>/teoria
   Tudo vem pronto do núcleo (estudar(), topicoPagina(id), teoriaLivre(id)).
   "Estudar este tópico hoje" manda ESTUDAR_TOPICO (ou CONTINUAR) à máquina.
   ========================================================= */
import { h, cada } from './dom.js';
import { registrar } from './registro.js';
import { nivel, teoria, prepararFiguras, comoFunciona } from './componentes.js';

/* "Como funciona um tópico": aberta até o aluno começar o primeiro tópico; depois, recolhida. */
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
      <h2 class="mapa-area-titulo" id="area-${a.id}">${a.nome}${a.disponivel ? '' : h`<span class="etiqueta">em breve</span>`}</h2>
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

function paginaTopico(p) {
  if (!p) return h`<p>Tópico não encontrado.</p><p><a class="link" href="#/estudar">Voltar ao mapa</a></p>`;
  return h`<p class="voltar-mapa"><a class="link" href="#/estudar">Voltar ao mapa</a></p>
    <p class="rotulo">${p.area}${p.materia && p.materia !== p.area ? h`, ${p.materia}` : ''}</p>
    <h1 class="titulo" tabindex="-1" data-foco-inicial>${p.titulo}</h1>
    ${p.disponivel ? h`
      ${nivel({ cheios: p.nivel.cheios, nome: p.nivel.cheios ? p.nivel.rotulo : null })}
      <p style="margin:8px 0 0">${p.estadoTexto}</p>
      ${p.progresso ? h`<p class="texto-2" style="margin:4px 0 0">${p.progresso.texto}</p>` : ''}
      ${jaViuComo() ? '' : comoFunciona({ aberto: true })}
      ${botaoAcao(p.acao)}
      ${jaViuComo() ? comoFunciona() : ''}
      <section class="secao" aria-labelledby="pq-t"><h2 class="titulo-pequeno" id="pq-t">Por que cai no Enem</h2><p>${p.porQueCai}</p></section>
      ${p.ideias && p.ideias.length ? h`<section class="secao" aria-labelledby="id-t"><h2 class="titulo-pequeno" id="id-t">O essencial</h2><ul class="teoria-lista">${cada(p.ideias, x => h`<li>${x}</li>`)}</ul></section>` : ''}
      <section class="secao" aria-labelledby="co-t"><h2 class="titulo-pequeno" id="co-t">Como é o estudo</h2><p>${p.composicao}</p>
        ${p.regraHoje ? h`<p>${p.regraHoje}</p>` : ''}
        ${p.capitulos ? h`<ul class="lista-topicos">${cada(p.capitulos, c => h`<li class="topico-linha"><span class="topico-titulo">Cap. ${c.n}: ${c.titulo}</span>${nivel({ cheios: c.nivel.cheios, nome: c.nivel.rotulo })}</li>`)}</ul>` : ''}
        <p class="pequeno texto-2">${p.regraNivel}</p>
        <p>${p.leitura.aba ? h`<a class="link" href="#/${p.leitura.aba}">${p.leitura.rotulo}</a>` : h`<a class="link" href="#/estudar/${p.id}/teoria">${p.leitura.rotulo}</a>`}</p>
        ${p.leitura.nota ? h`<p class="pequeno texto-2" style="margin:0">${p.leitura.nota}</p>` : ''}
      </section>`
    : h`<p>${p.estadoTexto}</p>`}`;
}

function teoriaLivre(v, id) {
  if (!v) return h`<p>Teoria não encontrada.</p><p><a class="link" href="#/estudar">Voltar ao mapa</a></p>`;
  return h`<p class="voltar-mapa"><a class="link" href="#/estudar/${id}">Voltar ao tópico</a></p>
    <p class="pr-recado" role="note">${v.aviso}</p>
    ${teoria(v)}
    <p style="margin-top:24px"><a class="link" href="#/estudar/${id}">Voltar ao tópico</a></p>`;
}

/** Aba Estudar. rota.sub = id do tópico; rota.resto[0] = 'teoria'. */
export function telaEstudar(ctx, t, rota) {
  const n = ctx.nucleo, id = rota.sub;
  let corpo, titulo = 'Estudar';
  if (!id) corpo = mapa(n.estudar());
  else if (rota.resto[0] === 'teoria') { const v = n.teoriaLivre(id); corpo = teoriaLivre(v, id); titulo = v ? `Teoria: ${v.titulo}` : titulo; }
  else { const p = n.topicoPagina(id); corpo = paginaTopico(p); titulo = p ? p.titulo : titulo; }
  return {
    chave: `estudar:${id || ''}:${rota.resto.join('/')}`,
    titulo,
    html: h`${topoAba()}${corpo}`,
    depois(raiz) {
      prepararFiguras(raiz.querySelector('#principal') || raiz, {
        aoAmpliar: el => { const c = el.cloneNode(true); c.removeAttribute('role'); c.removeAttribute('tabindex'); c.classList.remove('ampliavel'); ctx.abrirFolha('zoom', { html: c.outerHTML, zoom: 1 }, el); },
      });
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
