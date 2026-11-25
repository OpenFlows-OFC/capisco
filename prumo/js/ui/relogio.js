/* =========================================================
   PRUMO · Contra o relógio (modo de treino com placar)
   Questões sorteadas de todas as fases (núcleo: sortearRelampago), relógio
   corrido. Acerto = 10 pontos vezes o combo (até x3); errar zera o combo.
   Respondeu todas antes do tempo: cada segundo que sobrou vale 1 ponto.
   A partida vive só na tela (ctx.ui.rl); o núcleo guarda os 5 melhores
   placares deste aparelho. Não mexe em nível nem no visto do dia.
   ========================================================= */
import { h, cada } from './dom.js';
import { registrar } from './registro.js';
import { enunciado, alternativasPergunta, alternativasFeedback, rodape, questaoCab, prepararFiguras, ampliarFigura, carimbos } from './componentes.js';

export const RELOGIO = '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M10 3h4M12 3v3M18.5 6.5l1.5-1.5"/></svg>';

const agora = () => Date.now();
const mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
// carimbos sobre a partida inteira (não só o que deu tempo de responder): 3 com 4 de cada 5 certas, 2 com metade
const estrelasDe = (a, n) => (!a ? 0 : a / n >= 0.8 ? 3 : a / n >= 0.5 ? 2 : 1);

function novaPartida(n) {
  const v = n.relampago();
  return { fila: n.sortearRelampago(), i: 0, pontos: 0, seq: 0, maxSeq: 0, acertos: 0, total: 0, fimEm: agora() + v.segundos * 1000, resp: null, acabou: null };
}
function terminar(ctx, { porTempo }) {
  const rl = ctx.ui.rl;
  if (!rl || rl.acabou) return;
  const bonus = porTempo ? 0 : Math.max(0, Math.floor((rl.fimEm - agora()) / 1000));
  rl.pontos += bonus;
  const pos = ctx.nucleo.registrarRelampago({ pontos: rl.pontos, acertos: rl.acertos, total: rl.total });
  rl.acabou = { porTempo, bonus, pos, estrelas: estrelasDe(rl.acertos, rl.fila.length) };
  ctx.tocar(pos === 1 ? 'trofeu' : 'marco');
}

function entrada(v) {
  return h`<main class="missao relampago" style="padding-top:32px">
    <p class="rotulo">Modo de jogo</p>
    <h1 class="titulo" tabindex="-1" data-foco-inicial style="margin:8px 0 12px">${v.titulo}</h1>
    <p style="font-size:18px;line-height:28px">${v.regra}</p>
    <p>${v.pontos}</p>
    <p class="texto-2">${v.aviso}</p>
    ${recordes(v)}
  </main>`;
}
function recordes(v, destaque = 0) {
  if (!v.recordes.length) return h`<p class="pequeno texto-2">Ainda não há recorde neste aparelho. O primeiro placar é seu.</p>`;
  return h`<section class="rl-recordes" aria-labelledby="rl-rec-t">
    <h2 class="titulo-pequeno" id="rl-rec-t">Seus recordes</h2>
    <ol>${cada(v.recordes, r => h`<li class="${r.pos === destaque ? 'agora' : ''}"><span class="rl-pos">${r.pos}º</span><b>${r.pontos}</b> pts <span class="texto-2">${r.texto}</span></li>`)}</ol>
    <p class="pequeno texto-2" style="margin:0">${v.partidas} ${v.partidas === 1 ? 'partida jogada' : 'partidas jogadas'} neste aparelho.</p>
  </section>`;
}
function topoJogo(rl) {
  return h`<header class="topo rl-topo">
    <div class="topo-linha">
      <p class="topo-etapa">Contra o relógio · ${rl.i + 1} de ${rl.fila.length}</p>
      <div class="topo-acoes"><button type="button" class="link" data-acao="rlSair">Sair</button></div>
    </div>
    <div class="rl-painel">
      <span class="rl-tempo" id="rl-tempo" role="timer" aria-label="Tempo restante">${mmss(rl.fimEm - agora())}</span>
      <span class="placar-topo"><b>${rl.pontos}</b> pts${rl.seq >= 2 ? h` <span class="combo">${rl.seq} seguidas · x${Math.min(3, rl.seq)}</span>` : ''}</span>
    </div>
    <span class="rl-barra" aria-hidden="true"><i id="rl-barra" style="width:100%"></i></span>
  </header>`;
}

export function telaRelogio(ctx) {
  const n = ctx.nucleo, v = n.relampago(), rl = ctx.ui.rl;
  if (!rl) {
    return { chave: 'relogio:entrada', titulo: v.titulo, semAbas: true, html: entrada(v),
      barra: h`<button type="button" class="botao botao-largo" data-acao="rlComecar">Começar</button><a class="botao-sec botao-largo" href="#/estudar">Voltar à trilha</a>` };
  }
  if (rl.acabou) {
    const a = rl.acabou;
    return {
      chave: `relogio:fim:${rl.fimEm}`, titulo: v.titulo, semAbas: true,
      html: h`<main class="colofao relampago">
        <h1 class="manchete colofao-titulo" tabindex="-1" data-foco-inicial>${a.porTempo ? 'Acabou o tempo!' : 'Você respondeu todas!'}</h1>
        <section class="placar-partida" aria-label="Placar">
          <div class="placar-numeros"><p><b class="placar-pontos">${rl.pontos}</b> pontos</p>${carimbos(a.estrelas, { grande: true, novo: true })}</div>
          <p>${rl.acertos} de ${rl.total} certas · maior sequência: ${rl.maxSeq}${a.bonus ? ` · bônus de tempo: +${a.bonus}` : ''}</p>
          ${a.pos === 1 ? h`<p><strong class="recorde">Novo recorde neste aparelho!</strong></p>` : a.pos ? h`<p><strong class="recorde">${a.pos}º lugar nos seus recordes.</strong></p>` : ''}
        </section>
        ${recordes(v, a.pos)}
        <div class="fechar"><button type="button" class="botao botao-largo" data-acao="rlComecar">Jogar de novo</button><a class="botao-sec botao-largo" href="#/estudar" data-acao="rlSair">Voltar à trilha</a></div>
      </main>`,
    };
  }
  const q = n.questaoRelampago(rl.fila[rl.i]);
  const k = `rl:${rl.fimEm}:${rl.i}`;
  const depois = raiz => {
    prepararFiguras(raiz.querySelector('#tela') || raiz, { aoAmpliar: el => ampliarFigura(ctx, el) });
    const total = n.relampago().segundos * 1000;
    const tique = () => {
      const r = rl.fimEm - agora(), t = document.getElementById('rl-tempo'), b = document.getElementById('rl-barra');
      if (t) { t.textContent = mmss(r); t.classList.toggle('pouco', r <= 30000); }
      if (b) b.style.width = `${Math.max(0, 100 * r / total)}%`;
      if (r <= 0 && ctx.ui.rl === rl && !rl.acabou) { terminar(ctx, { porTempo: true }); ctx.render(); }
    };
    tique();
    const id = setInterval(tique, 250);
    return () => clearInterval(id);
  };
  if (!rl.resp) {
    const marcada = ctx.ui.selecao && ctx.ui.selecao.chave === k ? ctx.ui.selecao.alt : null;
    return {
      chave: k, titulo: v.titulo, semAbas: true,
      html: h`<main class="missao relampago">${topoJogo(rl)}
        <section class="pergunta"><p class="rotulo rl-tema">${q.area} · ${q.tema}</p>
          <div class="pergunta-cabeca">${questaoCab(q.item, { comoTitulo: true })}</div>
          ${enunciado(q.item)}
          <form data-enviar="rlResponder" data-chave="${k}" novalidate>${alternativasPergunta(q.item.alternativas, marcada)}</form>
          ${rodape(q.item.rodape, q.item.licencaUrl)}</section></main>`,
      barra: h`<button type="button" class="botao botao-largo" data-acao="rlResponder" data-chave="${k}">Responder</button>`,
      depois,
    };
  }
  const r = rl.resp, ok = r.ok;
  const alts = q.item.alternativas.map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem, html: a.html, marca: a.letra === r.alt && ok ? 'sua-certa' : a.letra === r.alt ? 'sua' : a.letra === q.gabarito ? 'certa' : null }));
  return {
    chave: `${k}:fb`, titulo: v.titulo, semAbas: true,
    html: h`<main class="missao relampago">${topoJogo(rl)}
      <section class="feedback rl-feedback" aria-labelledby="rl-fb"><h1 class="feedback-titulo" id="rl-fb" tabindex="-1" data-foco-inicial>${ok ? 'Certa!' : `Você marcou ${r.alt}. A certa é ${q.gabarito}.`}</h1>
        ${ok ? h`<p class="combo-linha"><span class="combo-ganho">+${r.ganho} pontos</span>${rl.seq >= 2 ? h` <span class="combo">${rl.seq} seguidas · x${Math.min(3, rl.seq)}</span>` : ''}</p>` : h`<p class="texto-2">O combo voltou a zero. O relógio continua correndo.</p>`}
      </section>
      <section class="pergunta"><div class="pergunta-cabeca">${questaoCab(q.item)}</div>${enunciado(q.item)}${alternativasFeedback(alts)}${rodape(q.item.rodape, q.item.licencaUrl)}</section></main>`,
    barra: h`<button type="button" class="botao botao-largo" data-acao="rlProxima">${rl.i + 1 >= rl.fila.length ? 'Ver o placar' : 'Próxima'}</button>`,
    depois,
  };
}

registrar({
  acoes: {
    rlComecar(ctx) { ctx.prepararSom(); ctx.ui.selecao = null; ctx.ui.rl = novaPartida(ctx.nucleo); ctx.render(); },
    rlSair(ctx, el, e) { if (e) e.preventDefault(); ctx.ui.rl = null; ctx.ui.selecao = null; ctx.irPara('#/estudar'); },
    rlResponder(ctx, el) {
      const rl = ctx.ui.rl, s = ctx.ui.selecao, k = el.dataset.chave;
      if (!rl || rl.resp || rl.acabou) return;
      if (!s || s.chave !== k) { const r = document.querySelector('#tela input[name="alt"]'); if (r) r.focus(); ctx.anunciar('Escolha uma alternativa.'); return; }
      ctx.ui.selecao = null;
      if (rl.fimEm - agora() <= 0) { terminar(ctx, { porTempo: true }); ctx.render(); return; }
      const q = ctx.nucleo.questaoRelampago(rl.fila[rl.i]), ok = s.alt === q.gabarito;
      rl.total++;
      if (ok) { rl.acertos++; rl.seq++; rl.maxSeq = Math.max(rl.maxSeq, rl.seq); } else rl.seq = 0;
      const ganho = ok ? 10 * Math.min(3, rl.seq) : 0;
      rl.pontos += ganho;
      rl.resp = { alt: s.alt, ok, ganho };
      ctx.tocar(ok ? 'acerto' : 'erro');
      ctx.render();
    },
    rlProxima(ctx) {
      const rl = ctx.ui.rl;
      if (!rl || !rl.resp) return;
      rl.resp = null;
      if (rl.i + 1 >= rl.fila.length) terminar(ctx, { porTempo: false });
      else rl.i++;
      ctx.render();
    },
  },
});
