/* =========================================================
   PRUMO · Primeiro uso (c.1)
   Apresentação em 3 telas (Pergunta · Leitura · Questões, com Pular), depois
   uma tela só: qual prova vem primeiro e como chamar o aluno. O resto entra com
   padrão (dias, minutos, matérias, horário) e fica escrito na tela, com
   "Mudar dias e minutos agora" para quem quiser. Lembrete e cópia ficam para o
   "Pronto por hoje" e o Plano. Nada é salvo até "Ver minha missão de hoje".
   O estado local fica em ctx.ui.pu; o núcleo só recebe o perfil no fim.
   ========================================================= */
import { h, cru, cada, escolherArquivo } from './dom.js';
import { registrar } from './registro.js';
import { marca as marcaPrumo } from './componentes.js';

function estadoInicial(vm) {
  return {
    onb: 0, nome: '', prova: '', mudar: false, erro: null,
    provaTipo: vm.provaPadrao || 'enem',
    areas: (vm.areasPadrao || ['MT']).slice(),
    dias: (vm.dias.padrao || [1, 2, 3, 4]).slice(),
    minutos: vm.minutos.padrao || 25,
    horario: (vm.horario && vm.horario.padrao) || '19:00',
    som: !!vm.som.padrao,
  };
}
const SEM_DATA = new Set(['enem', 'naosei']);

function marca() {
  return h`<div class="linha-topo">${marcaPrumo()}<span class="descritor">App de Estudos</span></div>`;
}

/** A régua da apresentação: as 3 etapas de um tópico, com a mesma .trilha da missão. */
function reguaOnb(vm, i) {
  return h`<ol class="trilha onb-trilha" aria-labelledby="onb-rotulo">${cada(vm.onboarding, (o, k) => h`<li class="${k < i ? 'feita' : k === i ? 'atual' : 'depois'}" ${k === i ? cru('aria-current="step"') : ''}><span class="trilha-passo"><span class="trilha-n" aria-hidden="true">${k < i ? '✓' : k + 1}</span><span class="trilha-rotulo">${o.etapa}</span></span></li>`)}</ol>`;
}

/** Três telas curtas: um conceito por tela, Pular sempre à vista (menos na última). */
function onboarding(ctx, vm, pu) {
  const o = vm.onboarding[pu.onb], total = vm.onboarding.length, ultima = pu.onb + 1 >= total;
  return h`<section class="onb" aria-labelledby="onb-t">
    <p class="so-leitor">Tela ${pu.onb + 1} de ${total}</p>
    <div class="onb-cabeca">
      <p class="rotulo" id="onb-rotulo">${vm.onboardingRotulo}</p>
      ${reguaOnb(vm, pu.onb)}
    </div>
    <h1 class="onb-titulo" id="onb-t" tabindex="-1" data-foco-inicial>${o.titulo}</h1>
    <p class="onb-texto">${o.texto}</p>
    ${ultima && vm.impacto ? h`<p class="onb-frase">${vm.impacto}</p>` : ''}
    <div class="onb-acoes">
      ${ultima ? '' : h`<button type="button" class="link" data-acao="puPular">Pular</button>`}
      <button type="button" class="botao ${ultima ? 'botao-largo' : ''}" data-acao="puProximo">${ultima ? 'Montar meu plano' : 'Próximo'}</button>
    </div>
    <p class="onb-exemplo"><button type="button" class="link link-discreto" data-acao="puExemplo">${vm.exemplo.rotulo}</button></p>
  </section>`;
}

/** A configuração: uma tela, duas perguntas, os padrões em texto. */
function configuracao(ctx, vm, pu) {
  const amanha = ctx.relogio.addDias(ctx.relogio.hoje(), 1);
  const nDias = pu.dias.length;
  const dica = vm.dias.dica && pu.dias.includes(vm.dias.hoje) ? ` ${vm.dias.dica}` : '';
  return h`
    <form class="pu-passo" data-enviar="puConcluir" novalidate>
      <h1 class="titulo pu-titulo" tabindex="-1" data-foco-inicial>${vm.titulo}</h1>
      <p class="pu-frase">${vm.frase}</p>

      <h2 class="pergunta-pu" id="q-prova">${vm.perguntas.prova}</h2>
      <ul class="escolhas" role="radiogroup" aria-labelledby="q-prova">${cada(vm.provas, p => h`<li>
        <label class="escolha"><input type="radio" name="provaTipo" value="${p.valor}" data-mudar="puCampo" ${pu.provaTipo === p.valor ? cru('checked') : ''}><span class="marcador" aria-hidden="true"></span><span>${p.rotulo}</span></label>
        ${pu.provaTipo === p.valor && (p.aviso || p.dica) ? h`<div class="aviso-escolha">${p.aviso ? h`<p>${p.aviso}</p>` : ''}${p.dica ? h`<p>${p.dica}</p>` : ''}</div>` : ''}
      </li>`)}</ul>
      ${SEM_DATA.has(pu.provaTipo) ? '' : h`<div class="pu-data">
        <label for="pu-data" class="pu-campo-rotulo">Data da prova</label>
        <input id="pu-data" class="campo campo-data" type="date" name="prova" min="${amanha}" value="${pu.prova}" data-mudar="puCampo" aria-describedby="pu-data-ajuda">
        <p class="ajuda-campo" id="pu-data-ajuda">${vm.ajudaData}</p>
      </div>`}

      <div class="secao-pu">
        <label for="pu-nome" class="pergunta-pu">${vm.perguntas.nome}</label>
        <input id="pu-nome" class="campo" type="text" name="nome" maxlength="40" autocomplete="given-name" value="${pu.nome}" data-mudar="puCampo" aria-describedby="pu-nome-ajuda">
        <p class="ajuda-campo" id="pu-nome-ajuda">${vm.ajudaNome}</p>
      </div>

      <div class="secao-pu pu-padroes">
        <p class="pu-padrao">${vm.padroes(pu.dias, pu.minutos, pu.areas)}${dica} ${vm.padroesOnde}</p>
        <details class="detalhes-missao pu-mudar" id="pu-mudar" ${pu.mudar ? cru('open') : ''}>
          <summary>${vm.mudarAgora}</summary>
          <fieldset class="pu-grupo">
            <legend>Dias de estudo (de ${vm.dias.min} a ${vm.dias.max})</legend>
            <ul class="chips chips-dias">${cada(vm.dias.opcoes, d => {
              const marcado = pu.dias.includes(d.valor);
              const travado = !marcado && nDias >= vm.dias.max;
              return h`<li class="chip"><label><input type="checkbox" name="dias" value="${d.valor}" data-mudar="puDia" ${marcado ? cru('checked') : ''} ${travado ? cru('disabled') : ''}><span>${d.rotulo}</span></label></li>`;
            })}</ul>
            <p class="ajuda-campo">Os outros dias viram folga. Meta da semana: ${vm.metaSugerida(pu.dias)} ${vm.metaSugerida(pu.dias) === 1 ? 'dia' : 'dias'}, um a menos que os dias de estudo.</p>
            ${nDias < vm.dias.min ? h`<p class="erro-campo" id="pu-dias-erro" role="status">Escolha pelo menos ${vm.dias.min} dias.</p>` : ''}
          </fieldset>
          <fieldset class="pu-grupo">
            <legend>Minutos por dia</legend>
            <ul class="chips">${cada(vm.minutos.opcoes, m => h`<li class="chip"><label><input type="radio" name="minutos" value="${m}" data-mudar="puCampo" ${pu.minutos === m ? cru('checked') : ''}><span>${m} min</span></label></li>`)}</ul>
          </fieldset>
        </details>
      </div>

      <div class="acoes-pu"><button type="submit" class="botao botao-largo">${vm.concluir}</button></div>
    </form>
    <div class="pu-rodape">
      <p class="pu-dados">${vm.fecho}</p>
      <p><button type="button" class="link" data-folha="instalar">Como instalar no celular</button></p>
      <p><button type="button" class="link" data-acao="puRestaurar">${vm.restaurar.rotulo}</button></p>
      ${pu.erro ? h`<p class="erro-campo" role="alert">${pu.erro}</p>` : ''}
      <p><button type="button" class="link link-discreto" data-acao="puExemplo">${vm.exemplo.rotulo}</button></p>
    </div>`;
}

/** Tela do Primeiro uso. vm = nucleo.primeiroUso(). */
export function telaPrimeiroUso(ctx, vm) {
  if (!ctx.ui.pu) ctx.ui.pu = estadoInicial(vm);
  const pu = ctx.ui.pu;
  if (pu.onb != null && pu.onb < (vm.onboarding || []).length) {
    return { chave: `onboarding:${pu.onb}`, titulo: 'Boas-vindas', html: h`<main class="pu">${marca()}${onboarding(ctx, vm, pu)}</main>` };
  }
  return { chave: 'primeiroUso', titulo: 'Primeiro uso', html: h`<main class="pu">${marca()}${configuracao(ctx, vm, pu)}</main>` };
}

/** Android/Chrome: o pedido de instalação fica guardado para o botão "Instalar agora" (um toque). */
let pedidoInstalar = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedidoInstalar = e; });
  window.addEventListener('appinstalled', () => { pedidoInstalar = null; });
}

/** Redesenha guardando o que o aluno já escreveu e se "Mudar dias e minutos" está aberto (a tela é refeita do zero). */
function redesenhar(ctx) {
  const pu = ctx.ui.pu, d = document.getElementById('pu-mudar'), nome = document.getElementById('pu-nome'), data = document.getElementById('pu-data');
  if (d) pu.mudar = d.open;
  if (nome) pu.nome = nome.value;
  if (data) pu.prova = data.value;
  ctx.render();
}

registrar({
  acoes: {
    puCampo(ctx, el) {
      const pu = ctx.ui.pu;
      if (!pu) return;
      if (el.name === 'provaTipo') { pu.provaTipo = el.value; if (SEM_DATA.has(el.value)) pu.prova = ''; redesenhar(ctx); return; }
      if (el.name === 'prova') { pu.prova = el.value; return; }
      if (el.name === 'nome') { pu.nome = el.value; return; }
      if (el.name === 'minutos') { pu.minutos = Number(el.value); redesenhar(ctx); }
    },
    // cada tela entra no histórico: o Voltar do celular volta uma tela em vez de sair do app
    puProximo(ctx) { ctx.ui.pu.onb++; history.pushState({ pu: ctx.ui.pu.onb }, '', location.hash); ctx.render(); },
    puPular(ctx) { ctx.ui.pu.onb = 99; history.pushState({ pu: 99 }, '', location.hash); ctx.render(); },
    puDia(ctx, el) {
      const pu = ctx.ui.pu, v = Number(el.value);
      if (el.checked) { if (!pu.dias.includes(v)) pu.dias.push(v); } else pu.dias = pu.dias.filter(x => x !== v);
      pu.dias.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));   // seg … dom
      redesenhar(ctx);
    },
    puConcluir(ctx) {
      const pu = ctx.ui.pu;
      const campoData = document.getElementById('pu-data'), nome = document.getElementById('pu-nome');
      if (campoData) pu.prova = campoData.value;
      if (nome) pu.nome = nome.value;
      // o botão nunca fica desativado: com menos dias que o mínimo, abre "Mudar dias e minutos" e mostra o aviso
      if (pu.dias.length < 3) {
        pu.mudar = true; ctx.render();
        const e = document.getElementById('pu-dias-erro');
        if (e) { e.scrollIntoView({ block: 'center' }); const c = document.querySelector('#pu-mudar input[name="dias"]:not(:checked)'); if (c) c.focus({ preventScroll: true }); }
        return;
      }
      const perfil = {
        provaTipo: pu.provaTipo,
        prova: SEM_DATA.has(pu.provaTipo) || !pu.prova ? null : pu.prova,
        dias: pu.dias.slice(), minutos: pu.minutos, horario: pu.horario || null,
        som: !!pu.som, alarme: null, nome: pu.nome.trim() || null, areas: pu.areas.length ? pu.areas.slice() : ['MT'],
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
      if (!r.ok) { if (ctx.ui.pu) ctx.ui.pu.erro = r.mensagem; redesenhar(ctx); return; }
      ctx.ui.pu = null;
      history.replaceState(null, '', '#/hoje');
      ctx.ui.aviso = r.mensagem;
      ctx.render();
    },
    async instalarAgora(ctx) {
      const p = pedidoInstalar;
      if (!p) return;
      pedidoInstalar = null;
      ctx.fecharFolha();
      try { p.prompt(); const r = await p.userChoice; if (r && r.outcome === 'accepted') ctx.avisar('Prumo instalado. Ele abre pela tela inicial.'); } catch (e) { /* o navegador decide */ }
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
        corpo: h`${pedidoInstalar ? h`<button type="button" class="botao botao-largo" data-acao="instalarAgora" style="margin-bottom:16px">Instalar agora</button>` : ''}<ul class="lista-fios"><li>${vm.instalar.iphone}</li><li>${vm.instalar.android}</li></ul>
          <p class="pequeno texto-2" style="margin-top:12px">Instalado, o Prumo abre sem internet e o iPhone guarda os dados por mais tempo.</p>`,
        pe: h`<button type="button" class="botao botao-largo" data-acao="fecharFolha">Entendi</button>`,
      };
    },
  },
});
