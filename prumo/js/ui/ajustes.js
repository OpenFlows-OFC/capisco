/* =========================================================
   PRUMO · Ajustes e dados (c.10)                        [A COMPLETAR]
   Versão simples, funcional, deixada pela equipe das telas do núcleo para o
   agente de Ajustes completar (créditos item a item com mais detalhe,
   confirmação de "Apagar tudo" em folha, "Copiar dados" com retorno etc.).
   Rota: #/ajustes (link "Ajustes" no topo das três abas). Ver js/ui/LEIA.md.
   ========================================================= */
import { h, cru, cada, escolherArquivo } from './dom.js';
import { registrar } from './registro.js';
import { marca } from './componentes.js';

export function telaAjustes(ctx) {
  const n = ctx.nucleo, a = n.ajustes(), cr = n.creditos(), nt = n.naoTem();
  return {
    chave: 'ajustes',
    titulo: 'Ajustes e dados',
    html: h`<div class="linha-topo">${marca()}<a class="link" href="#/hoje">Voltar</a></div>
      <h1 class="titulo" tabindex="-1" data-foco-inicial>Ajustes e dados</h1>

      <section class="secao" aria-labelledby="aj-som">
        <h2 class="titulo-pequeno" id="aj-som">${a.som.rotulo}</h2>
        <label class="interruptor"><span>Som ligado</span><input type="checkbox" data-mudar="ajSom" ${a.som.valor ? cru('checked') : ''}></label>
        <p class="pequeno texto-2">${a.som.nota}</p>
      </section>

      <section class="secao" aria-labelledby="aj-dados">
        <h2 class="titulo-pequeno" id="aj-dados">Dados</h2>
        <ul class="lista-fios">
          <li><button type="button" class="link" data-acao="salvarCopia">${a.dados.copia.rotulo}</button><p class="pequeno texto-2" style="margin:0">${a.dados.copia.ultima}</p></li>
          <li><button type="button" class="link" data-acao="ajCsv">${a.dados.csv.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajRestaurar">${a.dados.restaurar.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajCopiarTexto">${a.dados.copiarTexto.rotulo}</button></li>
          <li><button type="button" class="link" data-acao="ajApagar">${a.dados.apagar.rotulo}</button></li>
        </ul>
      </section>

      <section class="secao" aria-labelledby="aj-demo">
        <h2 class="titulo-pequeno" id="aj-demo">Modo demonstração</h2>
        ${a.demo.ativo ? h`<p class="pequeno">Data simulada: ${a.demo.data}</p>` : ''}
        <ul class="links">
          <li><button type="button" class="link" data-acao="ajAvancar" data-arg="1">Avançar 1 dia</button></li>
          <li><button type="button" class="link" data-acao="ajAvancar" data-arg="7">Avançar 7 dias</button></li>
          <li><button type="button" class="link" data-acao="ajExemplo">Carregar o estado de exemplo</button></li>
          ${a.demo.ativo ? h`<li><button type="button" class="link" data-acao="sairDemo">Sair da demonstração</button></li>` : ''}
        </ul>
      </section>

      <section class="secao" aria-labelledby="aj-nt">
        <h2 class="titulo-pequeno" id="aj-nt">${nt.titulo}</h2>
        <ul class="lista-fios">${cada(nt.itens, x => h`<li><strong>${x.item}</strong><p class="pequeno texto-2" style="margin:4px 0 0">${x.motivo}</p></li>`)}</ul>
      </section>

      <section class="secao" aria-labelledby="aj-cr">
        <h2 class="titulo-pequeno" id="aj-cr">Créditos e licenças</h2>
        <p class="pequeno">${cr.ia || ''}</p>
        <ul class="lista-fios">${cada(cr.app || [], x => h`<li class="pequeno">${x.item}: ${x.licenca}, ${x.fonte}.</li>`)}</ul>
      </section>`,
  };
}

registrar({
  acoes: {
    ajSom(ctx, el) { ctx.nucleo.definirSom(el.checked); if (el.checked) { ctx.prepararSom(); ctx.tocar('acerto'); } ctx.render(); },

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
