/* =========================================================
   PRUMO · Estudar: o mapa do que estudar (área → matéria → tópico),
   a página do tópico e a teoria em leitura livre.
   Rotas: #/estudar · #/estudar/<id do tópico> · #/estudar/<id>/teoria[/<seção>][/de-erros]
   ("/de-erros": aberta do Caderno de erros, a apostila volta para lá)
   Tudo vem pronto do núcleo (estudar(), topicoPagina(id), teoriaLivre(id)).
   "Estudar este tópico hoje" manda ESTUDAR_TOPICO (ou CONTINUAR) à máquina.
   ========================================================= */
import { h, cada, cru } from './dom.js';
import { registrar } from './registro.js';
import { nivel, teoria, prepararFiguras, ampliarFigura, comoFunciona, acompanharSumario, idDaAncora, irParaSecao, iconeArea, TACA, carimbos } from './componentes.js';
import { telaRelogio } from './relogio.js';

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

/* ---------------- Trilha de fases (o mapa do Estudar) ----------------
   Cada área é um caminho de fases, de cima para baixo, em zigue-zague, como as casas de um jogo de tabuleiro
   desenhado no caderno: o caminho é um traço de lápis (tracejado) e vira caneta (tinta) até a fase atual.
   Fase: bolha do cartão-resposta com o número (Mono). Concluída = bolha cheia com ✓; atual = grifo de
   marca-texto em volta (sem rótulo); bloqueada = contorno tracejado com cadeado. Pouco texto: o desenho diz o estado,
   e o rótulo completo fica no aria-label do botão.
   O Chefão é a Prova do caderno: a taça do troféu, no roxo do carimbo. Tocar numa fase abre o balão
   com o objetivo e o que se ganha (o briefing do Capisco). */
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
export const CADEADO = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
const ZIGUE = [0, 1, 2, 1, 0, -1, -2, -1];
/** Uma casa do caminho: só a bolha (o nome vai no aria-label e no balão). bolha = o "Começar" da fase atual. */
export function noFase(f, i, bolha = '') {
  const miolo = f.tipo === 'chefe' ? cru(TACA) : f.estado === 'concluida' ? cru(CHECK) : f.estado === 'bloqueada' ? cru(CADEADO) : h`<span class="fase-n">${f.n}</span>`;
  const rotulo = `${f.tipo === 'chefe' ? 'Chefão' : `Fase ${f.n}`}: ${f.titulo}. ${f.atual ? 'Você está aqui. ' : ''}${f.legenda}.`;
  return h`<li class="fase fase-${f.estado}${f.atual ? ' fase-atual' : ''}${f.tipo === 'chefe' ? ' fase-chefe' : ''}" style="--zz:${ZIGUE[i % ZIGUE.length]}">
    ${bolha}
    <button type="button" class="fase-no" data-folha="fase" data-arg="${f.id}" aria-label="${rotulo}">${miolo}</button>
    ${f.estrelas ? carimbos(f.estrelas) : ''}
  </li>`;
}
/** Desenha o caminho entre as fases: lápis tracejado; caneta até a fase atual (ou a última concluída). */
export function desenharCaminhos(raiz) {
  const mapas = [...raiz.querySelectorAll('.trilha-mapa')];
  const fazer = () => mapas.forEach(m => {
    const svg = m.querySelector('.trilha-caminho'), nos = [...m.querySelectorAll('.fase-no')];
    if (!svg || nos.length < 2) return;
    const b = m.getBoundingClientRect();
    const pts = nos.map(n => { const r = n.getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + r.height / 2]; });
    const seg = (a, c) => { const my = (a[1] + c[1]) / 2; return `C${a[0]} ${my} ${c[0]} ${my} ${c[0]} ${c[1]}`; };
    const caminho = l => l.length < 2 ? '' : `M${l[0][0]} ${l[0][1]}` + l.slice(1).map((p, k) => seg(l[k], p)).join('');
    const lis = nos.map(n => n.parentElement);
    let ate = lis.findIndex(li => li.classList.contains('fase-atual'));
    if (ate < 0) ate = lis.reduce((k, li, i) => (li.classList.contains('fase-concluida') ? i : k), 0);
    svg.setAttribute('width', b.width); svg.setAttribute('height', b.height);
    svg.innerHTML = `<path class="lapis" d="${caminho(pts)}"/><path class="caneta" d="${caminho(pts.slice(0, ate + 1))}"/>`;
  });
  fazer();
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fazer) : null;
  if (ro) mapas.forEach(m => ro.observe(m));
  return () => ro && ro.disconnect();
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
  if (!p) return h`<p>Tópico não encontrado.</p><p><a class="link" href="#/estudar">Voltar à trilha</a></p>`;
  return h`<p class="voltar-mapa"><a class="link" href="#/estudar">Voltar à trilha</a></p>
    <p class="rotulo rotulo-area">${iconeArea(p.area)}${p.area}${p.materia && p.materia !== p.area ? h`, ${p.materia}` : ''}</p>
    <h1 class="titulo" tabindex="-1" data-foco-inicial>${p.titulo}</h1>
    ${p.disponivel ? h`
      ${nivel({ cheios: p.nivel.cheios, nome: p.nivel.cheios ? p.nivel.rotulo : null })}
      <p class="so-leitor">${p.estadoTexto}</p>
      ${p.progresso && p.progresso.total ? h`<p class="topico-pontos" role="img" aria-label="${p.progresso.texto}">${cada(Array.from({ length: p.progresso.total }, (_, i) => i < p.progresso.feitas), f => h`<i class="${f ? 'feita' : ''}"></i>`)}</p>` : ''}
      ${botaoAcao(p.acao)}
      ${p.comoFunciona === null || jaViuComo() ? '' : comoFunciona({ aberto: true, itens: curto(p.comoFunciona) })}
      ${p.capitulos ? h`<ul class="lista-topicos">${cada(p.capitulos, (c, k) => linhaCapitulo(c, primeiraPagina(n, c, k)))}</ul>` : ''}
      <p class="secao">${p.leitura.aba ? h`<a class="link" href="#/${p.leitura.aba}">${p.leitura.rotulo}</a>` : h`<a class="link" href="#/estudar/${p.id}/teoria">${p.leitura.rotulo}</a>`}</p>`
    : h`<p>${p.estadoTexto}</p>`}`;
}

function primeiraPagina(n, c, k) {
  try { const caps = n.sumario().capitulos; const s = caps.find(x => x.n === c.n) || caps[k]; return s && s.paginaIds && s.paginaIds[0]; } catch (e) { return null; }
}

function teoriaLivre(v, id, ancora, deErros) {
  if (!v) return h`<p>Apostila não encontrada.</p><p><a class="link" href="#/estudar">Voltar à trilha</a></p>`;
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
  if (id === 'relogio') return telaRelogio(ctx);
  if (rota.resto[0] === 'teoria') {
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
  folhas: {
    /** Balão da fase: o objetivo, o que se ganha e o botão para jogar (o briefing do Capisco). */
    fase(ctx, id, t) {
      let f = null;
      for (const a of ctx.nucleo.trilha().areas) f = f || a.fases.find(x => x.id === id);
      if (!f) return null;
      const chefe = f.tipo === 'chefe';
      return {
        rotulo: chefe ? 'Chefão' : `Fase ${f.n}`,
        corpo: h`<div class="balao-fase fase-${f.estado}">
          <h2 class="titulo-pequeno">${f.titulo}</h2>
          ${f.nivel && f.nivel.cheios ? nivel({ cheios: f.nivel.cheios, nome: f.nivel.rotulo }) : h`<p class="rotulo">${f.legenda}</p>`}
          <p><strong>${f.estado === 'bloqueada' ? 'Para liberar:' : chefe ? 'Regra:' : f.estado === 'concluida' ? 'Situação:' : 'Objetivo:'}</strong> ${f.motivo}</p>
          ${f.estado !== 'concluida' || chefe ? h`<p class="pr-recado"><strong>Você ganha:</strong> ${f.ganho}</p>` : ''}
        </div>`,
        pe: f.estado === 'bloqueada' ? '' : chefe && t.vm && t.vm.prova ? h`<button type="button" class="botao botao-largo" data-ev="${t.vm.prova.acao.evento}">Enfrentar o Chefão</button>`
          : h`<a class="botao botao-largo" href="${f.href}">${chefe ? 'Ver a Prova no Caderno' : f.estado === 'concluida' ? 'Abrir a fase' : 'Jogar esta fase'}</a>`,
      };
    },
  },
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
