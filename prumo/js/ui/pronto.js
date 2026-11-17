/* =========================================================
   PRUMO · Pronto por hoje (c.4): o colofão
   O que foi feito, a data, o que vem depois. Três batidas e o botão Fechar:
   (1) "Pronto por hoje." com a constância (o traço de hoje na régua, ou a
   chama) e "N dias estudados"; (2) o que mudou, uma linha cada, com o nível
   que sobe se preenchendo; (3) a próxima missão, com o gancho e o "Por quê?".
   Não há "mais uma", nem oferta de Prova, Questão do dia ou Refazer (d.13).
   ========================================================= */
import { h, cada } from './dom.js';
import { regua, chama, nivel } from './componentes.js';

export function telaPronto(ctx, vm) {
  if (!vm) return { chave: 'pronto:vazio', html: h`<main class="colofao"></main>` };
  const chave = `pronto:${vm.data}`;
  const nova = ctx.ui.chave !== chave;   // anima só na primeira vez que a tela aparece
  const c = vm.constancia;
  const simbolo = c.simbolo === 'regua'
    ? regua(c.regua, { animarUltimo: nova && c.tracoDeHoje, rotulo: `Régua de constância: ${c.rotulo}` })
    : chama(c.chama && c.chama.acesa, { grande: true, rotulo: c.chama && c.chama.acesa ? `Chama acesa: ${c.chama.acesas} ${c.chama.acesas === 1 ? 'semana' : 'semanas'} com a meta` : 'Chama apagada: nenhuma semana com a meta ainda' });
  const p = vm.proxima;
  return {
    chave,
    titulo: 'Pronto por hoje',
    html: h`<main class="colofao">
      <h1 class="colofao-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1>
      <div class="constancia-pronto">${simbolo}<span class="constancia-rotulo num">${c.rotulo}</span></div>
      ${vm.semanaPassada ? h`<p class="semana-passada">${vm.semanaPassada}</p>` : ''}

      <section class="pilha-16" style="margin-top:28px" aria-label="O que mudou hoje">
        ${vm.parcial ? h`<p style="margin:0">${vm.parcial}</p>` : ''}
        ${vm.vazio ? h`<p style="margin:0">${vm.vazio}</p>` : ''}
        ${vm.naoContou ? h`<p class="texto-2" style="margin:0">${vm.naoContou}</p>` : ''}
        ${vm.mudancas && vm.mudancas.length ? h`<ul class="mudancas">${cada(vm.mudancas, m => h`<li>
            <span>${m.texto}</span>
            ${m.nivel ? nivel({ cheios: m.nivel.para, de: m.nivel.de, animar: nova && m.nivel.animar }) : ''}
          </li>`)}</ul>` : ''}
      </section>

      ${p ? h`<section class="proxima-bloco" aria-labelledby="proxima-rotulo">
        <p class="rotulo" id="proxima-rotulo">Próxima missão</p>
        <p class="proxima-texto">${p.texto}</p>
        ${p.gancho ? h`<p style="margin:0 0 4px">${p.gancho}</p>` : ''}
        ${p.porque ? h`<details class="porque"><summary class="link">${p.rotuloPorque || 'Por quê?'}</summary><p class="texto-2" style="margin:4px 0 0">${p.porque}</p></details>` : ''}
      </section>` : ''}

      ${vm.copia ? h`<p style="margin:20px 0 0"><button type="button" class="link" data-acao="salvarCopia">${vm.copia.rotulo}</button></p>` : ''}
      <p class="data">${vm.data}</p>
      <div class="fechar"><button type="button" class="botao botao-largo" data-ev="${vm.acao.evento}">${vm.acao.rotulo}</button></div>
    </main>`,
  };
}
