/* =========================================================
   PRUMO · Plano (c.9)                                   [A COMPLETAR]
   Versão simples, funcional, deixada pela equipe das telas do núcleo para o
   agente do Plano completar (mudar prova, dias, minutos, meta, pausa;
   "Por que esta ordem?"; régua completa rolável). Ver js/ui/LEIA.md.
   Rota: #/plano. Leitura livre; as mudanças usam nucleo.mudarPlano(),
   nucleo.marcarPausa(), nucleo.encerrarPausa().
   Topo: "Seu plano" com o Cabeçalho de prova (Data da prova | Faltam) e a
   frase com o nome da prova. Nada de metadados encadeados com pontos.
   ========================================================= */
import { h, cada } from './dom.js';
import { constancia, cabecalhoProva } from './componentes.js';
import { topoAba } from './hoje.js';

/** Só os dias com algo marcado: sem folgas e sem "depende do que você fizer". */
const agendaCurta = p => p.agenda.dias.filter(d => d.tipo !== 'folga' && !d.texto.includes('depende'));

export function telaPlano(ctx, t) {
  const p = ctx.nucleo.plano();
  if (!p) return { chave: 'plano:vazio', html: h`<p>Sem plano ainda.</p>` };
  const c = p.constancia;
  return {
    chave: 'plano',
    titulo: 'Plano',
    html: h`${topoAba()}
      <h1 class="titulo" tabindex="-1" data-foco-inicial>Seu plano</h1>
      ${cabecalhoProva(p.prova.cabecalho)}
      <ul class="lista-fios" style="margin-top:16px">
        <li><p class="rotulo">Dias e minutos</p><p style="margin:4px 0 0">${p.dias.texto}</p></li>
        <li><p class="rotulo">Meta da semana</p><p style="margin:4px 0 0">${p.meta.texto}</p></li>
        <li><p class="rotulo">Pausa</p><p style="margin:4px 0 0">${p.pausa.texto}</p></li>
        <li><p class="rotulo">Lembrete</p><p style="margin:4px 0 0">Alarme ${p.lembrete.texto}.</p><p class="pequeno texto-2" style="margin:4px 0 0">${p.lembrete.como}</p></li>
      </ul>
      <section class="secao" aria-labelledby="agenda-t">
        <h2 class="titulo-pequeno" id="agenda-t">Próximos 14 dias</h2>
        ${p.agenda.tudoFirme ? h`<p>${p.agenda.tudoFirme}</p>` : ''}
        ${agendaCurta(p).length ? '' : h`<p class="texto-2">Nada marcado por enquanto. As revisões aparecem aqui conforme você estuda.</p>`}<ul class="lista-fios">${cada(agendaCurta(p), d => h`<li class="${d.tipo === 'folga' ? 'texto-2' : ''}">${d.texto}</li>`)}</ul>
        <details style="margin-top:8px"><summary class="link">Por que esta ordem?</summary><p class="pequeno texto-2">${p.agenda.porQueEstaOrdem}</p></details>
      </section>
      <section class="secao" aria-labelledby="const-t">
        <h2 class="titulo-pequeno" id="const-t">Sua constância</h2>
        <div class="linha-constancia">${constancia(c)}</div>
        <p>${c.linhaMeta[0].toUpperCase()}${c.linhaMeta.slice(1)}.</p>
        ${c.vazio ? h`<p class="texto-2">${c.vazio}</p>` : ''}
      </section>
      <details class="secao detalhes-missao">
        <summary>De quanto em quanto tempo você revisa</summary>
        <ul class="lista-fios">${cada(p.intervalos.porNivel, x => h`<li>${x.nome}: a próxima revisão vem ${x.dias === 1 ? 'no dia seguinte' : `${x.dias} dias depois`}.</li>`)}</ul>
        <details style="margin-top:8px"><summary class="link">Ver a regra</summary><p class="pequeno texto-2">${p.intervalos.verARegra}</p></details>
      </details>`,
  };
}
