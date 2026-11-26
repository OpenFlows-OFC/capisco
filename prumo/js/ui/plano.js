/* =========================================================
   PRUMO · Plano, no jeito da aba de metas de um jogo
   Rota: #/plano. De cima para baixo: a contagem para a prova (faixa em tinta),
   as metas de hoje com barra de avanço, os próximos 14 dias em quadradinhos
   (toque abre o dia) e o seu ritmo em três linhas (dias e minutos, pausa,
   lembrete). Tudo vem do núcleo: plano(), semana(), agenda(), tela().
   A pausa se marca e se encerra aqui (nucleo.marcarPausa(), encerrarPausa()).
   ========================================================= */
import { h, cada, cru } from './dom.js';
import { registrar } from './registro.js';

const ic = d => cru(`<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${d}</svg>`);
const I = {
  missao: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  semana: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  riscos: '<path d="M6 5v14M10 5v14M14 5v14M18 5v14M3.5 15.5l17-7"/>',
  dias: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pausa: '<rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/>',
  alarme: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5M4.5 5.5l3-2.5M19.5 5.5l-3-2.5"/>',
  seta: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
};
const SEM = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function meta({ icone, titulo, n, de, feita }) {
  const pct = Math.round(100 * Math.min(n, de) / Math.max(1, de));
  return h`<li class="pl-meta${feita ? ' feita' : ''}">
    <span class="pl-meta-icone">${ic(feita ? I.check : icone)}</span>
    <span class="pl-meta-corpo"><span class="pl-meta-titulo">${titulo}</span>
      <span class="pl-meta-barra" role="img" aria-label="${`${Math.min(n, de)} de ${de}`}"><i style="width:${pct}%"></i><b>${Math.min(n, de)}/${de}</b></span></span>
  </li>`;
}

function dia(d, i) {
  const dt = new Date(`${d.dia}T12:00:00`), tem = d.itens && d.itens.length, feito = d.status === 'feito';
  const cls = `pl-dia pl-${d.tipo}${i === 0 ? ' hoje' : ''}${tem ? ' tem' : ''}${feito ? ' feito' : ''}`;
  const rotulo = `${d.rotulo}: ${d.texto || (d.tipo === 'folga' ? 'folga' : d.tipo === 'pausa' ? 'pausa' : 'nada marcado')}`;
  return h`<li><button type="button" class="${cls}" data-folha="plDia" data-arg="${String(i)}" aria-label="${rotulo}">
    <span class="pl-dia-sem">${SEM[dt.getDay()]}</span><span class="pl-dia-n">${d.dia.slice(8)}</span>
    <span class="pl-dia-marca" aria-hidden="true">${feito ? ic(I.check) : ''}</span>
  </button></li>`;
}

function linha({ icone, titulo, valor, attrs }) {
  const miolo = h`<span class="pl-linha-icone">${ic(icone)}</span>
    <span class="pl-linha-texto"><span class="pl-linha-titulo">${titulo}</span><span class="pl-linha-valor">${valor}</span></span>${ic(I.seta)}`;
  return attrs.href ? h`<li><a class="pl-linha" href="${attrs.href}">${miolo}</a></li>`
    : h`<li><button type="button" class="pl-linha" data-folha="${attrs.folha}">${miolo}</button></li>`;
}

export function telaPlano(ctx, t) {
  const n = ctx.nucleo, p = n.plano();
  if (!p) return { chave: 'plano:vazio', html: h`<p>Sem plano ainda.</p>` };
  const vm = t && t.vm, sem = n.semana(), c = p.constancia || {}, pv = p.prova;
  const dias = c.diasEstudados || 0, marco = (Math.floor(dias / 5) + 1) * 5;
  const missaoFeita = !!vm && (vm.estado === 'feito' || vm.estado === 'encerradoAntes');
  const faltam = pv.cabecalho ? pv.cabecalho[1] : null;
  return {
    chave: 'plano',
    titulo: 'Plano',
    html: h`<h1 class="titulo pl-titulo" tabindex="-1" data-foco-inicial>Plano</h1>
      <section class="pl-prova" aria-label="${pv.texto}">
        ${faltam ? h`<p class="pl-prova-n"><b>${faltam.valor}</b> ${faltam.unidade}</p><p class="pl-prova-sub">até a prova · ${pv.cabecalho[0].valor}</p>`
          : h`<p class="pl-prova-sub pl-prova-sem">${pv.texto}</p><a class="pl-prova-link" href="#/perfil/plano">Marcar a data</a>`}
      </section>
      <section class="secao" aria-labelledby="pl-metas-t">
        <h2 class="titulo-pequeno" id="pl-metas-t">Metas</h2>
        <ul class="pl-metas">
          ${vm && vm.estado !== 'folga' && vm.estado !== 'pausa' ? meta({ icone: I.missao, titulo: 'Missão do dia', n: missaoFeita ? 1 : 0, de: 1, feita: missaoFeita }) : ''}
          ${sem ? meta({ icone: I.semana, titulo: 'Meta da semana', n: sem.n, de: sem.meta, feita: sem.cumprida }) : ''}
          ${meta({ icone: I.riscos, titulo: `Chegar a ${marco} dias estudados`, n: dias, de: marco, feita: false })}
        </ul>
      </section>
      <section class="secao" aria-labelledby="pl-dias-t">
        <h2 class="titulo-pequeno" id="pl-dias-t">Próximos 14 dias</h2>
        <ol class="pl-dias">${cada(p.agenda.dias, dia)}</ol>
      </section>
      <section class="secao" aria-labelledby="pl-ritmo-t">
        <h2 class="titulo-pequeno" id="pl-ritmo-t">Seu ritmo</h2>
        <ul class="pl-linhas">
          ${linha({ icone: I.dias, titulo: 'Dias e minutos', valor: p.dias.texto, attrs: { href: '#/perfil/plano' } })}
          ${linha({ icone: I.pausa, titulo: 'Pausa', valor: p.pausa.ativa ? `Até ${p.pausa.ate.slice(8)}/${p.pausa.ate.slice(5, 7)}` : 'Nenhuma', attrs: { folha: 'plPausa' } })}
          ${linha({ icone: I.alarme, titulo: 'Lembrete', valor: `Alarme ${p.lembrete.texto}`, attrs: { folha: 'plLembrete' } })}
        </ul>
      </section>`,
  };
}

registrar({
  folhas: {
    plDia(ctx, i) {
      const d = ctx.nucleo.plano().agenda.dias[Number(i)];
      if (!d) return null;
      return { rotulo: d.rotulo, corpo: h`<p>${d.texto || (d.tipo === 'folga' ? 'Folga.' : d.tipo === 'pausa' ? 'Pausa.' : 'Nada marcado. As revisões aparecem aqui conforme você estuda.')}</p>
        <details class="trilha-regra"><summary>Por que esta ordem?</summary><p class="pequeno texto-2">${ctx.nucleo.plano().agenda.porQueEstaOrdem}</p></details>` };
    },
    plPausa(ctx) {
      const p = ctx.nucleo.plano();
      return { rotulo: 'Pausa', corpo: p.pausa.ativa
        ? h`<p>${p.pausa.texto}</p>`
        : h`<p class="texto-2">Viagem, semana de provas: as revisões esperam.</p>
          <form data-enviar="plPausa" novalidate id="pl-pausa-form"><label for="pl-pausa-dias" style="display:block;font-weight:600;margin:12px 0 8px">Quantos dias, contando hoje</label>
            <select id="pl-pausa-dias" name="dias" class="campo">${cada([1, 2, 3, 4, 5, 6, 7, 10, 14], k => h`<option value="${k}" ${k === 7 ? 'selected' : ''}>${k === 1 ? '1 dia' : `${k} dias`}</option>`)}</select></form>`,
        pe: p.pausa.ativa ? h`<button type="button" class="botao botao-largo" data-acao="plEncerrarPausa">Encerrar pausa</button>`
          : h`<button type="submit" form="pl-pausa-form" class="botao botao-largo">Marcar a pausa</button>` };
    },
    plLembrete(ctx) {
      const p = ctx.nucleo.plano();
      return { rotulo: 'Lembrete', corpo: h`<p>Alarme ${p.lembrete.texto}.</p><p class="texto-2">${p.lembrete.como}</p>
        <details class="trilha-regra"><summary>De quanto em quanto tempo você revisa</summary><ul class="lista-fios">${cada(p.intervalos.porNivel, x => h`<li>${x.nome}: a próxima revisão vem ${x.dias === 1 ? 'no dia seguinte' : `${x.dias} dias depois`}.</li>`)}</ul></details>` };
    },
  },
  acoes: {
    plPausa(ctx, form) {
      const dias = Number(new FormData(form).get('dias')) || 7;
      const ok = ctx.nucleo.marcarPausa(dias);
      ctx.fecharFolha();
      ctx.avisar(ok === false ? 'Não deu para marcar a pausa. Nada foi alterado.' : 'Pausa marcada. As revisões esperam.');
      ctx.render();
    },
    plEncerrarPausa(ctx) {
      const ok = ctx.nucleo.encerrarPausa();
      ctx.fecharFolha();
      ctx.avisar(ok === false ? 'Não deu para encerrar a pausa agora.' : 'Pausa encerrada.');
      ctx.render();
    },
  },
});
