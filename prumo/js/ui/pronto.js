/* =========================================================
   PRUMO · Pronto por hoje (c.4), com o visto do professor
   O título; o Visto (carimbo roxo com a data dd/mm/aaaa, a única
   recompensa, sempre a mesma, dada ao terminar); o que mudou, em frases;
   a próxima missão; os risquinhos; o fecho e o botão Fechar.
   Nenhuma isca ("mais uma", Prova, Questão do dia, Refazer). Só um link discreto,
   "Continuar estudando", para quem quiser seguir por conta própria (sem 2º visto).
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { registrar } from './registro.js';
import { marca, visto, constancia, trilha, rodape, semQuebra, carimbos } from './componentes.js';
import { trilhaDe } from './missao.js';
import { passouDeFase, blocoPassou } from './fases.js';

/** "Quando e onde": dia (o próximo dia de estudo), hora e uma âncora da rotina. Vira o horário do lembrete. */
function quando(q) {
  if (!q) return '';
  return h`<details class="quando-detalhes" ${q.salvo ? cru('open') : ''}><summary>Marcar quando estudar de novo</summary><form class="quando secao" data-enviar="guardarQuando" data-dia="${q.dia}" novalidate aria-labelledby="quando-t">
    <h2 class="titulo-pequeno" id="quando-t">${q.pergunta}</h2>
    <p style="margin:0 0 8px">${q.rotuloDia}</p>
    ${q.salvo ? h`<p class="intencao" role="status">${q.salvo}</p>` : ''}
    <label for="quando-hora" style="display:block;font-weight:600;margin:8px 0">Que horas?</label>
    <input id="quando-hora" class="campo campo-data" type="time" name="horario" value="${q.horario}">
    <fieldset style="border:0;margin:16px 0 0;padding:0;min-width:0"><legend style="font-weight:600;margin-bottom:8px;padding:0">Depois de quê?</legend>
      <ul class="escolhas">${cada(q.ancoras, a => h`<li><label class="escolha"><input type="radio" name="ancora" value="${a}" ${q.ancora === a ? cru('checked') : ''}><span class="marcador" aria-hidden="true"></span><span>${a[0].toUpperCase() + a.slice(1)}</span></label></li>`)}</ul>
      <label for="quando-outra" class="so-leitor">Outra âncora</label>
      <input id="quando-outra" class="campo" type="text" name="outra" maxlength="80" placeholder="Ou escreva: depois de…" value="${q.ancora && !q.ancoras.includes(q.ancora) ? q.ancora : ''}">
    </fieldset>
    <p class="pequeno texto-2">${q.lembrete}</p>
    <button type="submit" class="botao-sec botao-largo">Guardar meu plano</button>
  </form></details>`;
}

const DOURADO = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 6.8l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"/></svg>';
/** Raspadinha: o prêmio já está sorteado (núcleo); raspar só revela. Sempre ganha. */
function raspadinha(r) {
  if (!r) return '';
  return h`<section class="raspa${r.raspada ? ' raspada' : ''}" aria-labelledby="raspa-t">
    <h2 class="titulo-pequeno" id="raspa-t">Raspadinha</h2>
    <div class="raspa-cartao">
      <p class="raspa-premio raspa-${r.tipo}" ${r.raspada ? '' : cru('aria-hidden="true"')}>${r.tipo === 'dourado' ? cru(DOURADO) : ''}<b>${r.texto}</b></p>
      ${r.raspada ? '' : h`<canvas class="raspa-tinta" aria-hidden="true"></canvas>`}
    </div>
    ${r.raspada ? '' : h`<p class="raspa-pe"><button type="button" class="link" data-acao="raspar">Raspar de uma vez</button></p>`}
  </section>`;
}
/** A camada prateada: o dedo (ou o mouse) apaga; passou da metade, revela. */
function prepararRaspa(ctx, raiz) {
  const cv = raiz.querySelector('.raspa-tinta');
  if (!cv) return null;
  const caixa = cv.parentElement.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(caixa.width * dpr); cv.height = Math.round(caixa.height * dpr);
  const g = cv.getContext('2d');
  if (!g) return null;
  const css = getComputedStyle(cv);
  g.scale(dpr, dpr);
  g.fillStyle = css.getPropertyValue('--raspa-tinta').trim() || '#b9bfc8';
  g.fillRect(0, 0, caixa.width, caixa.height);
  g.fillStyle = css.getPropertyValue('--raspa-texto').trim() || '#5b6270';
  g.font = '700 18px Gabarito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('RASPE AQUI', caixa.width / 2, caixa.height / 2);
  g.globalCompositeOperation = 'destination-out';
  let ativo = false, n = 0, feito = false;
  const ponto = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const raspar = e => {
    if (!ativo || feito) return;
    const [x, y] = ponto(e);
    g.beginPath(); g.arc(x, y, 22, 0, Math.PI * 2); g.fill();
    if (++n % 8 === 0) {
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      let vazio = 0, total = 0;
      for (let k = 3; k < d.length; k += 4 * 37) { total++; if (d[k] === 0) vazio++; }
      if (vazio / total > 0.5) { feito = true; revelar(ctx); }
    }
  };
  const ini = e => { ativo = true; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); raspar(e); };
  const fim = () => { ativo = false; };
  cv.addEventListener('pointerdown', ini); cv.addEventListener('pointermove', raspar);
  cv.addEventListener('pointerup', fim); cv.addEventListener('pointercancel', fim);
  return () => { cv.removeEventListener('pointerdown', ini); cv.removeEventListener('pointermove', raspar); cv.removeEventListener('pointerup', fim); cv.removeEventListener('pointercancel', fim); };
}
function revelar(ctx) {
  const p = ctx.nucleo.raspar();
  if (!p) return;
  ctx.tocar('marco');
  ctx.anunciar(p.tipo === 'dourado' ? 'Você ganhou um carimbo dourado!' : `Você ganhou ${p.valor} pontos!`);
  ctx.render();
}

export function telaPronto(ctx, vm) {
  if (!vm) return { chave: 'pronto:vazio', html: h`<main class="colofao"></main>` };
  const chave = `pronto:${vm.data}`;
  const nova = ctx.ui.chave !== chave;   // o carimbo desce só na primeira vez que a tela aparece
  const p = vm.proxima;
  // tópico de prática terminado: a trilha com todas as etapas feitas (o visto, ou o registro no estudo livre)
  const tr = vm.parcial ? null : trilhaDe(ctx, vm, 'encerramento');
  // encerrou antes: a barra de passos e, se o dia não contou, o X; as frases ficam só para o leitor de tela
  const ps = vm.passos;
  const frases = [
    // só o que mudou de verdade; o comentário sobre o aquecimento sai
    ...(vm.mudancas || []).map(m => m.texto).filter(t => !/^Você fez o aquecimento/.test(t)),
    vm.semanaPassada,
  ].filter(Boolean);
  return {
    chave,
    titulo: 'Pronto por hoje',
    html: h`<main class="colofao">
      <div class="linha-topo">${marca()}</div>
      ${tr ? trilha(['visto', 'registro'].includes(tr.fase) ? 'fim' : tr.fase, { livre: tr.livre }) : ''}
      <h1 class="manchete colofao-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1>
      ${ps ? h`<section class="pr-passos" aria-label="${[vm.parcial, vm.vazio, vm.naoContou].filter(Boolean).join(' ')}">
        <div class="pr-passos-barra" aria-hidden="true"><i style="width:${Math.round(100 * ps.feitos / Math.max(1, ps.total))}%"></i></div>
        <p class="pr-passos-conta" aria-hidden="true"><b>${ps.feitos}</b>/${ps.total}</p>
        ${ps.andou ? '' : h`<p class="pr-nada" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>Seu progresso não andou hoje</p>`}
      </section>` : ''}
      ${frases.length ? h`<ul class="pr-frases" aria-label="O que mudou hoje">${cada(frases, f => h`<li>${f}</li>`)}</ul>` : ''}
      ${vm.placar ? h`<section class="placar-partida" aria-labelledby="placar-t">
        <h2 id="placar-t" class="titulo-pequeno">Placar da partida</h2>
        <div class="placar-numeros">
          <p><b class="placar-pontos">${vm.placar.pontos}</b> pontos</p>
          ${carimbos(vm.placar.estrelas, { grande: true, novo: nova })}
        </div>
        <p>${vm.placar.acertos} de ${vm.placar.total} certas · maior sequência: ${vm.placar.maxSeq}${vm.placar.recorde ? h` · <strong class="recorde">${vm.placar.recorde === 'primeiro' ? 'Primeiros carimbos da fase!' : 'Novo recorde da fase!'}</strong>` : ''}</p>
      </section>` : ''}
      ${vm.placar ? raspadinha(vm.placar.raspa) : ''}
      ${visto(vm.visto, { novo: nova })}
      ${blocoPassou(passouDeFase(ctx.nucleo))}
      ${quando(vm.quando)}
      ${constancia(vm.constancia)}
      ${vm.continuar ? h`<p class="links"><button type="button" class="link" data-acao="continuarEstudando">${vm.continuar.rotulo}</button></p>` : ''}
      ${vm.copia ? h`<p><button type="button" class="link" data-acao="salvarCopia">${vm.copia.rotulo}</button></p>` : ''}
      <div class="fechar"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </main>`,
    depois(raiz) { return prepararRaspa(ctx, raiz); },
  };
}

registrar({
  acoes: {
    raspar(ctx) { revelar(ctx); },
    guardarQuando(ctx, form) {
      const fd = new FormData(form), outra = String(fd.get('outra') || '').trim();
      const ok = ctx.nucleo.definirIntencao({ dia: form.dataset.dia, horario: fd.get('horario'), ancora: outra || fd.get('ancora') || null });
      ctx.avisar(ok ? 'Plano guardado.' : 'Escolha uma hora válida.');
      ctx.render();
    },
    /** "Continuar estudando": fecha o Pronto por hoje (o visto já foi dado) e abre a aba Estudar. Iniciativa do aluno. */
    continuarEstudando(ctx) {
      ctx.despachar({ tipo: 'FECHAR' });
      ctx.irPara('#/estudar');
    },
  },
});
