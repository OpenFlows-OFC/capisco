/* =========================================================
   PRUMO · Pronto por hoje (c.4), com o visto do professor
   O título; o Visto (carimbo roxo com a data dd/mm/aaaa, a única
   recompensa, sempre a mesma, dada ao terminar); o que mudou, em frases;
   a próxima missão; os risquinhos; o fecho e o botão Fechar.
   Não há "mais uma", nem oferta de Prova, Questão do dia ou Refazer (d.13).
   ========================================================= */
import { h, cada } from './dom.js';
import { marca, visto, constancia } from './componentes.js';

export function telaPronto(ctx, vm) {
  if (!vm) return { chave: 'pronto:vazio', html: h`<main class="colofao"></main>` };
  const chave = `pronto:${vm.data}`;
  const nova = ctx.ui.chave !== chave;   // o carimbo desce só na primeira vez que a tela aparece
  const p = vm.proxima;
  const frases = [
    vm.parcial, vm.vazio, vm.naoContou,
    ...(vm.mudancas || []).map(m => m.texto),
    vm.semanaPassada,
  ].filter(Boolean);
  return {
    chave,
    titulo: 'Pronto por hoje',
    html: h`<main class="colofao">
      <div class="linha-topo">${marca()}</div>
      <h1 class="manchete colofao-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1>
      ${visto(vm.visto, { novo: nova })}
      ${frases.length ? h`<ul class="pr-frases" aria-label="O que mudou hoje">${cada(frases, f => h`<li>${f}</li>`)}</ul>` : ''}
      ${p ? h`<section class="proxima-bloco" aria-label="Próxima missão">
        <p class="proxima-texto"><strong>Próxima missão:</strong> ${p.texto}</p>
        ${p.gancho ? h`<p>${p.gancho}</p>` : ''}
        ${p.porque ? h`<details class="porque"><summary class="link">${p.rotuloPorque || 'Por quê?'}</summary><p class="texto-2">${p.porque}</p></details>` : ''}
      </section>` : ''}
      ${constancia(vm.constancia)}
      <p class="fecho">${vm.fecho}</p>
      ${vm.copia ? h`<p><button type="button" class="link" data-acao="salvarCopia">${vm.copia.rotulo}</button></p>` : ''}
      <div class="fechar"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </main>`,
  };
}
