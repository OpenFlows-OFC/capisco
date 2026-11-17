/* =========================================================
   PRUMO · Primeiro uso (c.1)
   Montar o plano em menos de um minuto, ou recuperar o progresso.
   Na 1ª tela, no topo: "Já usei o Prumo: restaurar uma cópia" e "Ver com
   dados de exemplo" (Decisão 5: a banca abre pelo QR code, sem instalar).
   Três passos em texto ("1 de 3"): perguntas (prova, dias, minutos, horário,
   som) · texto do alarme · fecho. Nada é salvo até "Começar".
   O estado local fica em ctx.ui.pu; o núcleo só recebe o perfil no fim.
   ========================================================= */
import { h, cru, cada, escolherArquivo } from './dom.js';
import { registrar } from './registro.js';
import { marca as marcaPrumo } from './componentes.js';

function estadoInicial(vm) {
  return {
    passo: 0, provaTipo: 'escola', prova: '', dias: (vm.dias.padrao || [1, 2, 3, 4]).slice(),
    minutos: vm.minutos.padrao || 25, horario: '19:00', som: !!vm.som.padrao, alarme: null, erro: null,
  };
}
const SEM_DATA = new Set(['enem', 'naosei']);

function marca() {
  return h`<div class="linha-topo">${marcaPrumo()}<span class="descritor">App de Estudos</span></div>`;
}

function passoPerguntas(ctx, vm, pu) {
  const amanha = ctx.relogio.addDias(ctx.relogio.hoje(), 1);
  const nDias = pu.dias.length;
  return h`
    <div class="pu-links">
      <button type="button" class="link" data-acao="puRestaurar">${vm.restaurar.rotulo}</button>
      <button type="button" class="link" data-acao="puExemplo">${vm.exemplo.rotulo}</button>
      ${pu.erro ? h`<p class="erro-campo" role="alert">${pu.erro}</p>` : ''}
    </div>
    <hr class="fio fio-0">
    <form class="pu-passo" data-enviar="puAvancar" novalidate>
      <p class="rotulo">1 de 3</p>
      <h1 class="pergunta-pu" tabindex="-1" data-foco-inicial id="q-prova">Qual prova vem primeiro?</h1>
      <ul class="escolhas" role="radiogroup" aria-labelledby="q-prova">${cada(vm.provas, p => h`<li>
        <label class="escolha"><input type="radio" name="provaTipo" value="${p.valor}" data-mudar="puCampo" ${pu.provaTipo === p.valor ? cru('checked') : ''}><span class="marcador" aria-hidden="true"></span><span>${p.rotulo}</span></label>
        ${pu.provaTipo === p.valor && (p.aviso || p.dica) ? h`<div class="aviso-escolha">${p.aviso ? h`<p style="margin:0 0 4px">${p.aviso}</p>` : ''}${p.dica ? h`<p style="margin:0">${p.dica}</p>` : ''}</div>` : ''}
      </li>`)}</ul>
      ${SEM_DATA.has(pu.provaTipo) ? '' : h`<div class="secao-pu" style="margin-top:16px">
        <label for="pu-data" style="display:block;font-weight:600;margin-bottom:8px">Data da prova</label>
        <input id="pu-data" class="campo campo-data" type="date" name="prova" min="${amanha}" value="${pu.prova}" data-mudar="puCampo">
        <p class="ajuda-campo">${pu.prova ? 'Dá para mudar depois, no Plano.' : 'Sem data, o Prumo usa um horizonte de 90 dias. Dá para marcar depois, no Plano.'}</p>
      </div>`}

      <div class="secao-pu">
        <h2 class="pergunta-pu" id="q-dias">Em quais dias e por quanto tempo?</h2>
        <fieldset style="border:0;margin:0;padding:0;min-width:0">
          <legend style="font-weight:600;margin-bottom:8px;padding:0">Dias de estudo (de ${vm.dias.min} a ${vm.dias.max})</legend>
          <ul class="chips">${cada(vm.dias.opcoes, d => {
            const marcado = pu.dias.includes(d.valor);
            const travado = (!marcado && nDias >= vm.dias.max);
            return h`<li class="chip"><label><input type="checkbox" name="dias" value="${d.valor}" data-mudar="puDia" ${marcado ? cru('checked') : ''} ${travado ? cru('disabled') : ''}><span>${d.rotulo}</span></label></li>`;
          })}</ul>
          <p class="ajuda-campo">Os outros dias viram folga. Meta da semana: ${vm.metaSugerida(pu.dias)} ${vm.metaSugerida(pu.dias) === 1 ? 'dia' : 'dias'} (um a menos que os dias escolhidos), editável no Plano.</p>
          ${nDias < vm.dias.min ? h`<p class="erro-campo" role="status">Escolha pelo menos ${vm.dias.min} dias.</p>` : ''}
        </fieldset>
        <fieldset style="border:0;margin:20px 0 0;padding:0;min-width:0">
          <legend style="font-weight:600;margin-bottom:8px;padding:0">Minutos por dia</legend>
          <ul class="chips">${cada(vm.minutos.opcoes, m => h`<li class="chip"><label><input type="radio" name="minutos" value="${m}" data-mudar="puCampo" ${pu.minutos === m ? cru('checked') : ''}><span>${m} min</span></label></li>`)}</ul>
        </fieldset>
        <div style="margin-top:20px">
          <label for="pu-hora" style="display:block;font-weight:600;margin-bottom:8px">Horário (para o alarme)</label>
          <input id="pu-hora" class="campo campo-data" type="time" name="horario" value="${pu.horario}" data-mudar="puCampo">
        </div>
      </div>

      <div class="secao-pu">
        <h2 class="pergunta-pu" id="q-som">${vm.som.pergunta}</h2>
        <ul class="chips" role="radiogroup" aria-labelledby="q-som">
          <li class="chip"><label><input type="radio" name="som" value="sim" data-mudar="puCampo" ${pu.som ? cru('checked') : ''}><span>Sim</span></label></li>
          <li class="chip"><label><input type="radio" name="som" value="nao" data-mudar="puCampo" ${!pu.som ? cru('checked') : ''}><span>Não</span></label></li>
        </ul>
        <p class="ajuda-campo">Desligado por padrão. O que aparece na tela nunca depende do som.</p>
      </div>

      <div class="acoes-pu"><button type="submit" class="botao botao-largo" ${nDias < vm.dias.min ? cru('aria-disabled="true"') : ''}>Continuar</button></div>
    </form>`;
}

function passoAlarme(ctx, vm, pu) {
  const al = vm.alarme(pu.dias, pu.horario);
  return h`<div class="pu-passo">
    <p class="rotulo">2 de 3</p>
    <h1 class="pergunta-pu" tabindex="-1" data-foco-inicial>Quer um lembrete?</h1>
    <p>Crie um alarme no app Relógio:</p>
    <p class="alarme-texto">${al.rotulo}</p>
    <p>O Prumo não manda notificação.</p>
    <div class="acoes-pu">
      <button type="button" class="botao botao-largo" data-acao="puAlarme" data-arg="criado">Criei o alarme</button>
      <button type="button" class="botao-sec" data-acao="puAlarme" data-arg="agora-nao">Agora não</button>
    </div>
  </div>`;
}

function passoFecho(ctx, vm) {
  return h`<div class="pu-passo">
    <p class="rotulo">3 de 3</p>
    <h1 class="pergunta-pu" tabindex="-1" data-foco-inicial>Seus dados, no seu aparelho</h1>
    <p style="font-size:18px;line-height:28px">${vm.fecho}</p>
    <button type="button" class="link" data-folha="instalar">Como instalar</button>
    <div class="acoes-pu"><button type="button" class="botao botao-largo" data-acao="puConcluir">Começar</button></div>
  </div>`;
}

/** Tela do Primeiro uso. vm = nucleo.primeiroUso(). */
export function telaPrimeiroUso(ctx, vm) {
  if (!ctx.ui.pu) ctx.ui.pu = estadoInicial(vm);
  const pu = ctx.ui.pu;
  const corpo = pu.passo === 0 ? passoPerguntas(ctx, vm, pu) : pu.passo === 1 ? passoAlarme(ctx, vm, pu) : passoFecho(ctx, vm);
  return {
    chave: `primeiroUso:${pu.passo}`,
    titulo: 'Primeiro uso',
    html: h`<main class="pu">${marca()}${corpo}</main>`,
  };
}

function irPara(ctx, passo) {
  ctx.ui.pu.passo = passo;
  ctx.ui.pu.erro = null;
  history.pushState({ pu: passo }, '', location.hash || '#/');
  ctx.render();
}

registrar({
  acoes: {
    puCampo(ctx, el) {
      const pu = ctx.ui.pu;
      if (!pu) return;
      if (el.name === 'provaTipo') { pu.provaTipo = el.value; if (SEM_DATA.has(el.value)) pu.prova = ''; ctx.render(); return; }
      if (el.name === 'prova') { pu.prova = el.value; return; }
      if (el.name === 'minutos') pu.minutos = Number(el.value);
      if (el.name === 'horario') { pu.horario = el.value; return; }
      if (el.name === 'som') { pu.som = el.value === 'sim'; if (pu.som) ctx.prepararSom(); }
    },
    puDia(ctx, el) {
      const pu = ctx.ui.pu, v = Number(el.value);
      if (el.checked) { if (!pu.dias.includes(v)) pu.dias.push(v); }
      else pu.dias = pu.dias.filter(x => x !== v);
      pu.dias.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));   // seg … dom
      ctx.render();
    },
    puAvancar(ctx) {
      const pu = ctx.ui.pu;
      const campoData = document.getElementById('pu-data');
      if (campoData) pu.prova = campoData.value;
      const hora = document.getElementById('pu-hora');
      if (hora) pu.horario = hora.value;
      if (pu.dias.length < 3) return;
      irPara(ctx, 1);
    },
    puAlarme(ctx, el) { ctx.ui.pu.alarme = el.dataset.arg; irPara(ctx, 2); },
    puConcluir(ctx) {
      const pu = ctx.ui.pu;
      const perfil = {
        provaTipo: pu.provaTipo,
        prova: SEM_DATA.has(pu.provaTipo) || !pu.prova ? null : pu.prova,
        dias: pu.dias.slice(), minutos: pu.minutos, horario: pu.horario || null,
        som: !!pu.som, alarme: pu.alarme || null,
      };
      ctx.ui.pu = null;
      ctx.nucleo.concluirPrimeiroUso(perfil);
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* o navegador decide */ }
      history.replaceState(null, '', '#/hoje');
      ctx.render();
    },
    async puRestaurar(ctx) {
      const texto = await escolherArquivo();
      if (texto == null) return;
      const r = ctx.nucleo.restaurar(texto);
      if (!r.ok) { if (ctx.ui.pu) ctx.ui.pu.erro = r.mensagem; ctx.render(); return; }
      ctx.ui.pu = null;
      history.replaceState(null, '', '#/hoje');
      ctx.ui.aviso = r.mensagem;
      ctx.render();
    },
    puExemplo(ctx) {
      ctx.ui.pu = null;
      ctx.nucleo.carregarExemplo();
      history.replaceState(null, '', '#/hoje');
      ctx.render();
    },
  },
  folhas: {
    instalar(ctx) {
      const vm = ctx.nucleo.primeiroUso();
      return {
        rotulo: 'Como instalar',
        corpo: h`<ul class="lista-fios"><li>${vm.instalar.iphone}</li><li>${vm.instalar.android}</li></ul>
          <p class="pequeno texto-2" style="margin-top:12px">Instalado, o Prumo abre sem internet e o iPhone guarda os dados por mais tempo.</p>`,
        pe: h`<button type="button" class="botao botao-largo" data-acao="fecharFolha">Entendi</button>`,
      };
    },
  },
});
