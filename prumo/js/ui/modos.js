/* =========================================================
   PRUMO · Modos
   Rotas: #/modos (os modos) · #/modos/relogio · #/modos/revanche ·
   #/modos/cartoes · #/modos/cartoes/novo
   A missão do dia (Hoje) é o modo principal: é ela que sobe a trilha.
   Os outros são treino com placar: não mexem em nível, revisão nem visto.
   Cartões: até 10 por partida, do Enem (capítulos estudados) e os seus;
   a partida vive só na tela (ctx.ui.ct).
   ========================================================= */
import { h, cada, cru } from './dom.js';
import { registrar } from './registro.js';
import { carimbos } from './componentes.js';
import { topoAba } from './hoje.js';
import { telaRelogio, RELOGIO } from './relogio.js';

const ic = d => cru(`<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${d}</svg>`);
const SOL = '<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 6v3M5.6 9.6l2 2M18.4 9.6l-2 2M3 14h1.5M19.5 14H21"/><path d="M9 21h6"/>';
const CARTAO = '<rect x="3.5" y="6.5" width="13" height="10" rx="1.5"/><path d="M7.5 3.5h11a2 2 0 0 1 2 2v9"/><path d="M7 11.5h6"/>';
const REVANCHE = '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L20 9.5"/><path d="M20 4.5v5h-5"/><path d="M19.5 12a7.5 7.5 0 0 1-13 5.1L4 14.5"/><path d="M4 19.5v-5h5"/>';
const estrelas = (a, n) => (!n || !a ? 0 : a / n >= 0.8 ? 3 : a / n >= 0.5 ? 2 : 1);

function modo({ href, icone, titulo, linha, lado = '', principal = false }) {
  return h`<a class="modo${principal ? ' modo-principal' : ''}" href="${href}">
    <span class="modo-icone">${ic(icone)}</span>
    <span class="modo-texto"><span class="modo-titulo">${titulo}</span><span class="modo-linha">${linha}</span></span>
    ${lado}
  </a>`;
}

function hub(n) {
  const m = n.modos();
  return h`<h1 class="titulo" tabindex="-1" data-foco-inicial>Modos</h1>
    ${modo({ href: '#/hoje', icone: SOL, titulo: 'Missão do dia', linha: 'O modo principal. Sobe a trilha.', principal: true })}
    <div class="modos-lista">
      ${modo({ href: '#/modos/relogio', icone: RELOGIO.replace(/^<svg[^>]*>|<\/svg>$/g, ''), titulo: m.relogio.titulo, linha: m.relogio.linha,
        lado: m.relogio.melhor != null ? h`<span class="relampago-recorde" aria-label="${`recorde ${m.relogio.melhor}`}"><b>${m.relogio.melhor}</b>recorde</span>` : '' })}
      ${modo({ href: '#/modos/cartoes', icone: CARTAO, titulo: m.cartoes.titulo, linha: m.cartoes.linha })}
      ${modo({ href: '#/modos/revanche', icone: REVANCHE, titulo: m.revanche.titulo, linha: m.revanche.linha })}
    </div>
    <p class="modos-links"><a class="link" href="#/caderno/erros">Caderno de erros</a><a class="link" href="#/caderno/notas">Suas notas</a></p>`;
}

/* ---------------- Cartões ---------------- */
function cartoesEntrada(n) {
  const c = n.cartoes();
  return h`<h1 class="titulo" tabindex="-1" data-foco-inicial>Cartões</h1>
    <p class="ct-conta"><b>${c.enem.length}</b> do Enem · <b>${c.meus.length}</b> seus</p>
    ${c.total ? '' : h`<p class="texto-2">Os cartões do Enem chegam quando você termina um capítulo. Os seus, você cria aqui.</p>`}
    <section class="secao" aria-labelledby="ct-meus-t">
      <h2 class="titulo-pequeno" id="ct-meus-t">Seus cartões</h2>
      ${c.meus.length ? h`<ul class="lista-fios ct-meus">${cada(c.meus, k => h`<li><p class="ct-frente">${k.frente}</p><p class="pequeno texto-2">${k.verso}</p>
        <button type="button" class="link" data-acao="ctApagar" data-arg="${k.id}">Apagar</button></li>`)}</ul>` : ''}
      <a class="botao-sec" href="#/modos/cartoes/novo">Criar cartão</a>
    </section>`;
}
function cartoesNovo() {
  return h`<h1 class="titulo" tabindex="-1" data-foco-inicial>Novo cartão</h1>
    <form class="ct-form" data-enviar="ctGuardar" novalidate>
      <label for="ct-frente">Frente</label>
      <textarea id="ct-frente" name="frente" rows="3" maxlength="200" required placeholder="Ex.: Quanto é 15% de 80?"></textarea>
      <label for="ct-verso">Verso</label>
      <textarea id="ct-verso" name="verso" rows="4" maxlength="400" required placeholder="Ex.: 12. 10% é 8 e 5% é 4."></textarea>
      <button type="submit" class="botao botao-largo">Guardar cartão</button>
    </form>
    <p><a class="link" href="#/modos/cartoes">Voltar aos cartões</a></p>`;
}
function cartoesJogo(ct) {
  if (ct.acabou) {
    const e = estrelas(ct.lembrei, ct.fila.length);
    return { chave: `ct:fim:${ct.id}`, html: h`<main class="colofao relampago">
      <h1 class="manchete colofao-titulo" tabindex="-1" data-foco-inicial>${ct.lembrei === ct.fila.length ? 'Lembrou de todos!' : 'Partida feita!'}</h1>
      <section class="placar-partida" aria-label="Placar">
        <div class="placar-numeros"><p><b class="placar-pontos">${ct.lembrei}</b> de ${ct.fila.length}</p>${carimbos(e, { grande: true, novo: true })}</div>
        <p>lembrados · maior sequência: ${ct.maxSeq}</p>
      </section>
      <div class="fechar"><button type="button" class="botao botao-largo" data-acao="ctComecar">Jogar de novo</button><a class="botao-sec botao-largo" href="#/modos" data-acao="ctSair">Voltar aos modos</a></div>
    </main>` };
  }
  const k = ct.fila[ct.i];
  return {
    chave: `ct:${ct.id}:${ct.i}:${ct.virado ? 1 : 0}`,
    html: h`<main class="missao relampago">
      <header class="topo rl-topo"><div class="topo-linha"><p class="topo-etapa">Cartões · ${ct.i + 1} de ${ct.fila.length}</p>
        <div class="topo-acoes"><span class="placar-topo"><b>${ct.lembrei}</b> lembrados</span><button type="button" class="link" data-acao="ctSair">Sair</button></div></div></header>
      <section class="ct-cartao${ct.virado ? ' virado' : ''}" aria-live="polite">
        <p class="rotulo">${k.origem}</p>
        <h1 class="ct-frente-grande" tabindex="-1" data-foco-inicial>${k.frente}</h1>
        ${ct.virado ? h`<p class="ct-verso">${k.verso}</p>` : ''}
      </section>
    </main>`,
    barra: ct.virado
      ? h`<button type="button" class="botao botao-largo" data-acao="ctResp" data-arg="lembrei">Lembrei</button><button type="button" class="botao-sec botao-largo" data-acao="ctResp" data-arg="ainda">Ainda não</button>`
      : h`<button type="button" class="botao botao-largo" data-acao="ctVirar">Virar</button>`,
  };
}

/** Aba Modos. rota.sub: (nada) | relogio | revanche | cartoes [novo]. */
export function telaModos(ctx, t, rota) {
  const n = ctx.nucleo, sub = rota.sub;
  if (sub === 'relogio' || sub === 'revanche') return telaRelogio(ctx, sub);
  if (sub === 'cartoes') {
    const ct = ctx.ui.ct;
    if (ct) { const s = cartoesJogo(ct); return { ...s, titulo: 'Cartões', semAbas: true }; }
    if (rota.resto[0] === 'novo') return { chave: 'modos:cartoes:novo', titulo: 'Novo cartão', html: h`${topoAba()}${cartoesNovo()}` };
    const total = n.cartoes().total;
    return { chave: 'modos:cartoes', titulo: 'Cartões', html: h`${topoAba()}${cartoesEntrada(n)}`,
      barra: total ? h`<button type="button" class="botao botao-largo" data-acao="ctComecar">Jogar ${Math.min(total, n.cartoes().max)} cartões</button>` : '' };
  }
  return { chave: 'modos', titulo: 'Modos', html: h`${topoAba()}${hub(n)}` };
}

registrar({
  acoes: {
    ctComecar(ctx) {
      const fila = ctx.nucleo.sortearCartoes();
      if (!fila.length) return;
      ctx.prepararSom();
      ctx.ui.aviso = null;   // o bilhete ("Cartão guardado.") não pode cobrir o Virar
      ctx.ui.ct = { id: Date.now(), fila, i: 0, virado: false, lembrei: 0, seq: 0, maxSeq: 0, acabou: false };
      ctx.render();
    },
    ctVirar(ctx) { const ct = ctx.ui.ct; if (ct && !ct.acabou) { ct.virado = true; ctx.render(); } },
    ctResp(ctx, el) {
      const ct = ctx.ui.ct;
      if (!ct || !ct.virado || ct.acabou) return;
      const ok = el.dataset.arg === 'lembrei';
      if (ok) { ct.lembrei++; ct.seq++; ct.maxSeq = Math.max(ct.maxSeq, ct.seq); } else ct.seq = 0;
      ctx.tocar(ok ? 'acerto' : 'erro');
      ct.virado = false;
      if (ct.i + 1 >= ct.fila.length) { ct.acabou = true; ctx.tocar('marco'); } else ct.i++;
      ctx.render();
    },
    ctSair(ctx, el, e) { if (e) e.preventDefault(); ctx.ui.ct = null; ctx.irPara('#/modos'); },
    ctGuardar(ctx, form, e) {
      if (e) e.preventDefault();
      const f = form.querySelector('#ct-frente'), v = form.querySelector('#ct-verso');
      const id = ctx.nucleo.criarCartao({ frente: f.value, verso: v.value });
      if (!id) { (f.value.trim() ? v : f).focus(); ctx.anunciar('Escreva a frente e o verso.'); ctx.avisar('Escreva a frente e o verso do cartão.'); return; }
      ctx.irPara('#/modos/cartoes');
      ctx.avisar('Cartão guardado.');
    },
    ctApagar(ctx, el) {
      if (ctx.nucleo.apagarCartao(el.dataset.arg)) { ctx.render(); ctx.avisar('Cartão apagado.'); }
    },
  },
});
