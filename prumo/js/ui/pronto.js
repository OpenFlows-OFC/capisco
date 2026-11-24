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
import { marca, visto, constancia, trilha, rodape, semQuebra } from './componentes.js';
import { trilhaDe } from './missao.js';

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

export function telaPronto(ctx, vm) {
  if (!vm) return { chave: 'pronto:vazio', html: h`<main class="colofao"></main>` };
  const chave = `pronto:${vm.data}`;
  const nova = ctx.ui.chave !== chave;   // o carimbo desce só na primeira vez que a tela aparece
  const p = vm.proxima;
  // tópico de prática terminado: a trilha com todas as etapas feitas (o visto, ou o registro no estudo livre)
  const tr = vm.parcial ? null : trilhaDe(ctx, vm, 'encerramento');
  const frases = [
    vm.parcial, vm.vazio, vm.naoContou,
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
      ${frases.length ? h`<ul class="pr-frases" aria-label="O que mudou hoje">${cada(frases, f => h`<li>${f}</li>`)}</ul>` : ''}
      ${visto(vm.visto, { novo: nova })}
      ${p ? h`<section class="proxima-bloco" aria-label="Próxima missão">
        <p class="proxima-texto"><strong class="proxima-rotulo">Próxima missão</strong> ${semQuebra(p.texto)}</p>
        ${p.gancho ? h`<p>${semQuebra(p.gancho)}</p>` : ''}
        ${p.porque ? h`<details class="porque"><summary class="link">${p.rotuloPorque || 'Por quê?'}</summary><p class="texto-2">${p.porque}</p></details>` : ''}
      </section>` : ''}
      ${quando(vm.quando)}
      ${constancia(vm.constancia)}
      ${vm.continuar ? h`<p class="continuar-livre">${vm.continuar.texto}</p><p class="links"><button type="button" class="link" data-acao="continuarEstudando">${vm.continuar.rotulo}</button></p>` : ''}
      ${vm.copia ? h`<p><button type="button" class="link" data-acao="salvarCopia">${vm.copia.rotulo}</button></p>` : ''}
      <div class="fechar"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </main>`,
  };
}

registrar({
  acoes: {
    guardarQuando(ctx, form) {
      const fd = new FormData(form), outra = String(fd.get('outra') || '').trim();
      const ok = ctx.nucleo.definirIntencao({ dia: form.dataset.dia, horario: fd.get('horario'), ancora: outra || fd.get('ancora') || null });
      ctx.avisar(ok ? 'Plano guardado. Ele aparece em Hoje.' : 'Escolha uma hora válida.');
      ctx.render();
    },
    /** "Continuar estudando": fecha o Pronto por hoje (o visto já foi dado) e abre a aba Estudar. Iniciativa do aluno. */
    continuarEstudando(ctx) {
      ctx.despachar({ tipo: 'FECHAR' });
      ctx.irPara('#/estudar');
    },
  },
});
