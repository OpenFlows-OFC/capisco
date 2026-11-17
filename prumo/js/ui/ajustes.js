/* =========================================================
   PRUMO · Ajustes e dados (c.10)                        [A COMPLETAR]
   Versão simples, funcional, deixada pela equipe das telas do núcleo para o
   agente de Ajustes completar (créditos item a item com mais detalhe,
   confirmação de "Apagar tudo" em folha, "Copiar dados" com retorno etc.).
   Rota: #/ajustes (engrenagem no topo das três abas). Ver js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, escolherArquivo } from './dom.js';
import { registrar } from './registro.js';

export function telaAjustes(ctx) {
  const n = ctx.nucleo, a = n.ajustes(), cr = n.creditos(), nt = n.naoTem();
  return {
    chave: 'ajustes',
    titulo: 'Ajustes e dados',
    html: h`<header class="cabecalho"><p class="rotulo">Ajustes e dados</p><a class="link" href="#/hoje">Voltar</a></header>
      <h1 class="titulo" tabindex="-1" data-foco-inicial style="margin-top:8px">Ajustes e dados</h1>

      <section class="secao" aria-labelledby="aj-som">
        <h2 class="rotulo" id="aj-som">${a.som.rotulo}</h2>
        <label class="interruptor"><span>Som ligado</span><input type="checkbox" data-mudar="ajSom" ${a.som.valor ? cru('checked') : ''} style="width:24px;height:24px"></label>
        <p class="pequeno texto-2">${a.som.nota}</p>
      </section>

      <section class="secao" aria-labelledby="aj-simb">
        <h2 class="rotulo" id="aj-simb">${a.simbolo.rotulo}</h2>
        <ul class="chips" role="radiogroup" aria-labelledby="aj-simb">${cada(a.simbolo.opcoes, o => h`<li class="chip"><label><input type="radio" name="simbolo" value="${o.valor}" data-mudar="ajSimbolo" ${a.simbolo.valor === o.valor ? cru('checked') : ''}><span>${o.rotulo}</span></label></li>`)}</ul>
        <p class="pequeno texto-2">${a.simbolo.nota}</p>
      </section>

      <section class="secao" aria-labelledby="aj-dados">
        <h2 class="rotulo" id="aj-dados">Dados</h2>
        <ul class="lista-fios">
          <li><button type="button" class="link" data-acao="salvarCopia">${a.dados.copia.rotulo}</button><p class="pequeno texto-2" style="margin:0">${a.dados.copia.ultima}</p></li>
          <li><button type="button" class="link" data-acao="ajCsv">${a.dados.csv.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajRestaurar">${a.dados.restaurar.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajCopiarTexto">${a.dados.copiarTexto.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajApagar">${a.dados.apagar.rotulo}</button></li>
        </ul>
      </section>

      <section class="secao" aria-labelledby="aj-demo">
        <h2 class="rotulo" id="aj-demo">Modo demonstração</h2>
        ${a.demo.ativo ? h`<p class="pequeno">Data simulada: ${a.demo.data}</p>` : ''}
        <ul class="links">
          <li><button type="button" class="link" data-acao="ajAvancar" data-arg="1">avançar 1 dia</button></li>
          <li><button type="button" class="link" data-acao="ajAvancar" data-arg="7">avançar 7 dias</button></li>
          <li><button type="button" class="link" data-acao="ajExemplo">carregar estado de exemplo</button></li>
          ${a.demo.ativo ? h`<li><button type="button" class="link" data-acao="sairDemo">sair da demonstração</button></li>` : ''}
        </ul>
      </section>

      <section class="secao" aria-labelledby="aj-nt">
        <h2 class="rotulo" id="aj-nt">${nt.titulo}</h2>
        <ul class="lista-fios">${cada(nt.itens, x => h`<li><strong>${x.item}</strong><p class="pequeno texto-2" style="margin:4px 0 0">${x.motivo}</p></li>`)}</ul>
      </section>

      <section class="secao" aria-labelledby="aj-cr">
        <h2 class="rotulo" id="aj-cr">Créditos e licenças</h2>
        <p class="pequeno">${cr.ia || ''}</p>
        <ul class="lista-fios">${cada(cr.app || [], x => h`<li class="pequeno">${x.item} · ${x.licenca} · ${x.fonte}</li>`)}</ul>
      </section>`,
  };
}

registrar({
  acoes: {
    ajSom(ctx, el) { ctx.nucleo.definirSom(el.checked); if (el.checked) { ctx.prepararSom(); ctx.tocar('acerto'); } ctx.render(); },
    ajSimbolo(ctx, el) { ctx.nucleo.definirSimbolo(el.value); ctx.render(); },
    ajCsv(ctx) { const arq = ctx.nucleo.csv(); ctx.avisar(ctx.baixar(arq) ? `Arquivo salvo: ${arq.nome}.` : 'O aparelho não deixou baixar o arquivo.'); },
    async ajRestaurar(ctx) {
      const texto = await escolherArquivo();
      if (texto == null) return;
      const r = ctx.nucleo.restaurar(texto);
      ctx.ui.aviso = r.mensagem;
      if (r.ok) history.replaceState(null, '', '#/hoje');
      ctx.render();
    },
    async ajCopiarTexto(ctx) {
      const c = ctx.nucleo.copia();
      try { await navigator.clipboard.writeText(c.conteudo); ctx.avisar('Dados copiados. Cole num lugar seguro (um e-mail para você mesmo, por exemplo).'); }
      catch (e) { ctx.avisar('O aparelho não deixou copiar.'); }
    },
    ajApagar(ctx) {
      const a = ctx.nucleo.ajustes();
      if (!window.confirm(a.dados.apagar.confirmacao)) return;
      ctx.nucleo.apagarTudo();
      history.replaceState(null, '', '#/');
      ctx.render();
    },
    ajAvancar(ctx, el) { ctx.nucleo.avancarDias(Number(el.dataset.arg) || 1); ctx.render(); },
    ajExemplo(ctx) { ctx.nucleo.carregarExemplo(); history.replaceState(null, '', '#/hoje'); ctx.render(); },
  },
});
