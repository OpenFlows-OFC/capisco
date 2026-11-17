/* =========================================================
   PRUMO · Plano (c.9)                                   [A COMPLETAR]
   Versão simples, funcional, deixada pela equipe das telas do núcleo para o
   agente do Plano completar (mudar prova, dias, minutos, meta, pausa;
   "Por que esta ordem?"; régua completa rolável). Ver js/ui/LEIA.md.
   Rota: #/plano. Leitura livre; as mudanças usam nucleo.mudarPlano(),
   nucleo.marcarPausa(), nucleo.encerrarPausa().
   ========================================================= */
import { h, cada } from './dom.js';
import { constancia } from './componentes.js';
import { topoAba } from './hoje.js';

export function telaPlano(ctx, t) {
  const p = ctx.nucleo.plano();
  if (!p) return { chave: 'plano:vazio', html: h`<p>Sem plano ainda.</p>` };
  const c = p.constancia;
  return {
    chave: 'plano',
    titulo: 'Plano',
    html: h`${topoAba()}
      <p class="rotulo">Plano</p>
      <h1 class="titulo" tabindex="-1" data-foco-inicial>${p.prova.texto}</h1>
      <ul class="lista-fios" style="margin-top:16px">
        <li><p class="rotulo">Dias e minutos</p><p style="margin:4px 0 0">${p.dias.texto}</p></li>
        <li><p class="rotulo">Meta da semana</p><p style="margin:4px 0 0">${p.meta.texto}</p><p class="pequeno texto-2" style="margin:4px 0 0">${p.meta.regra}</p></li>
        <li><p class="rotulo">Pausa</p><p style="margin:4px 0 0">${p.pausa.texto}</p></li>
        <li><p class="rotulo">Lembrete</p><p style="margin:4px 0 0">${p.lembrete.texto}</p><p class="pequeno texto-2" style="margin:4px 0 0">${p.lembrete.como}</p></li>
      </ul>
      <section class="secao" aria-labelledby="agenda-t">
        <h2 class="titulo-pequeno" id="agenda-t">Próximos 14 dias</h2>
        ${p.agenda.tudoFirme ? h`<p>${p.agenda.tudoFirme}</p>` : ''}
        <ul class="lista-fios">${cada(p.agenda.dias, d => h`<li class="${d.tipo === 'folga' ? 'texto-2' : ''}">${d.texto}</li>`)}</ul>
        <details style="margin-top:8px"><summary class="link">Por que esta ordem?</summary><p class="pequeno texto-2">${p.agenda.porQueEstaOrdem}</p></details>
      </section>
      <section class="secao" aria-labelledby="const-t">
        <h2 class="titulo-pequeno" id="const-t">Sua constância</h2>
        <div class="linha-constancia">${constancia(c)}</div>
        <p>${c.linhaMeta[0].toUpperCase()}${c.linhaMeta.slice(1)}.</p>
        ${c.vazio ? h`<p class="texto-2">${c.vazio}</p>` : ''}
        <p class="pequeno texto-2">${c.regra}</p>
      </section>`,
  };
}
