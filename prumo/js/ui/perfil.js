/* =========================================================
   PRUMO · Perfil (aba): nome e foto do aluno, prova e data, matérias,
   dias e minutos, e os ajustes (som, cópia, restaurar, CSV, apagar).
   Tudo fica neste aparelho (núcleo: perfil(), definirNome, definirFoto,
   mudarPlano). A foto é reduzida aqui para ~160 px antes de ir ao núcleo.
   ========================================================= */
import { h, cru, cada } from './dom.js';
import { registrar } from './registro.js';
import { marca } from './componentes.js';
import { secoesAjustes } from './ajustes.js';

const SEM_DATA = new Set(['enem', 'naosei']);

function avatar(v) {
  return v.foto ? h`<span class="avatar"><img src="${v.foto}" alt="Sua foto"></span>` : h`<span class="avatar" aria-hidden="true">${v.iniciais || cru('<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.75"/><path d="M4.5 20.5c.8-3.9 3.9-6 7.5-6s6.7 2.1 7.5 6"/></svg>')}</span>`;
}

export function telaPerfil(ctx) {
  const n = ctx.nucleo, v = n.perfil();
  if (!v) return { chave: 'perfil:vazio', html: h`<p>Sem perfil ainda.</p>` };
  const pl = v.plano, p = n.st.perfil, hoje = ctx.relogio.hoje();
  return {
    chave: 'perfil',
    titulo: 'Perfil',
    html: h`<div class="linha-topo">${marca()}</div>
      <div class="perfil-cabeca">${avatar(v)}<h1 class="titulo" tabindex="-1" data-foco-inicial style="margin:0">${v.titulo}</h1></div>
      <p><button type="button" class="link" data-acao="pfFoto">${v.fotoTexto}</button>${v.foto ? h` <button type="button" class="link" data-acao="pfTirarFoto" style="margin-left:16px">Tirar a foto</button>` : ''}</p>
      <p class="pequeno texto-2" style="margin-top:0">${v.fotoNota}</p>

      ${colecao(n.colecao(ctx.ui.memoria.mesColecao))}

      <form class="secao" data-enviar="pfNome" novalidate aria-labelledby="pf-nome-t">
        <h2 class="titulo-pequeno" id="pf-nome-t">Seu nome</h2>
        <div class="campo-linha"><label for="pf-nome" class="so-leitor">Seu nome</label>
          <input id="pf-nome" class="campo" type="text" name="nome" maxlength="40" autocomplete="given-name" value="${v.nome}">
          <button type="submit" class="botao-sec">Guardar</button></div>
      </form>

      <form class="secao" data-enviar="pfPlano" novalidate aria-labelledby="pf-prova-t">
        <h2 class="titulo-pequeno" id="pf-prova-t">Prova e data</h2>
        <p>${pl.prova.texto}</p>
        <label for="pf-tipo" style="display:block;font-weight:600;margin:8px 0">Qual prova vem primeiro?</label>
        <select id="pf-tipo" class="campo" name="provaTipo">${cada(pl.tiposProva, t => h`<option value="${t.valor}" ${p.provaTipo === t.valor ? cru('selected') : ''}>${t.rotulo}</option>`)}</select>
        <label for="pf-data" style="display:block;font-weight:600;margin:16px 0 8px">Data da prova</label>
        <input id="pf-data" class="campo campo-data" type="date" name="prova" min="${hoje}" value="${p.prova || ''}">
        <p class="ajuda-campo">Sem data (ou no Enem, enquanto a data não sai), o Prumo planeja para os próximos 90 dias.</p>

        <h2 class="titulo-pequeno" style="margin-top:24px">Dias e minutos</h2>
        <p>${pl.dias.texto}</p>
        <fieldset style="border:0;margin:0;padding:0;min-width:0"><legend style="font-weight:600;margin-bottom:8px;padding:0">Dias de estudo (de 3 a 5)</legend>
          <ul class="chips">${cada([1, 2, 3, 4, 5, 6, 0], d => h`<li class="chip"><label><input type="checkbox" name="dias" value="${d}" ${p.dias.includes(d) ? cru('checked') : ''}><span>${['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d]}</span></label></li>`)}</ul></fieldset>
        <fieldset style="border:0;margin:16px 0 0;padding:0;min-width:0"><legend style="font-weight:600;margin-bottom:8px;padding:0">Minutos por dia</legend>
          <ul class="chips">${cada(pl.minutos.opcoes, m => h`<li class="chip"><label><input type="radio" name="minutos" value="${m}" ${p.minutos === m ? cru('checked') : ''}><span>${m} min</span></label></li>`)}</ul></fieldset>
        <fieldset style="border:0;margin:16px 0 0;padding:0;min-width:0"><legend style="font-weight:600;margin-bottom:8px;padding:0">Matérias</legend>
          <ul class="escolhas">${cada(v.areas, a => h`<li><label class="escolha"><input type="checkbox" name="areas" value="${a.valor}" ${a.marcada ? cru('checked') : ''} ${a.disponivel ? '' : cru('disabled')}><span class="marcador" aria-hidden="true"></span><span>${a.rotulo}${a.disponivel ? '' : h` <span class="etiqueta">em breve</span>`}</span></label></li>`)}</ul></fieldset>
        <p class="ajuda-campo">Se a missão de hoje ainda não começou, ela é montada de novo com o plano novo.</p>
        <div style="margin-top:16px"><button type="submit" class="botao botao-largo">Guardar o plano</button></div>
      </form>

      ${secoesAjustes(ctx)}`,
  };
}

/** Coleção de vistos: o calendário do mês com o carimbo nos dias com visto. */
function colecao(c) {
  return h`<section class="secao colecao" aria-labelledby="col-t">
    <h2 class="titulo-pequeno" id="col-t">${c.titulo}</h2>
    <div class="colecao-nav">
      <button type="button" class="link" data-acao="pfMes" data-arg="${c.anterior || ''}" ${c.anterior ? '' : cru('aria-disabled="true"')}>Mês anterior</button>
      <p class="colecao-mes">${c.rotuloMes}</p>
      <button type="button" class="link" data-acao="pfMes" data-arg="${c.seguinte || ''}" ${c.seguinte ? '' : cru('aria-disabled="true"')}>Mês seguinte</button>
    </div>
    <table class="calendario"><thead><tr>${cada(c.cabecalho, x => h`<th scope="col">${x}</th>`)}</tr></thead>
      <tbody>${cada(c.semanas, s => h`<tr>${cada(s, x => h`<td class="${x.fora ? 'fora' : ''} ${x.hoje ? 'hoje' : ''}">${x.fora ? '' : h`<span class="cal-n">${x.n}</span>${x.visto ? h`<span class="mini-visto" role="img" aria-label="visto">V</span>` : ''}`}</td>`)}</tr>`)}</tbody></table>
    <p>${c.texto}</p>
    <p class="pequeno texto-2">${c.regra}</p>
  </section>`;
}

/** Reduz a imagem escolhida para ~160 px (lado maior) e devolve um data URL JPEG. */
function reduzir(arquivo, lado = 160) {
  return new Promise((ok, erro) => {
    const url = URL.createObjectURL(arquivo), img = new Image();
    img.onload = () => {
      const k = Math.min(1, lado / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); erro(new Error('imagem')); };
    img.src = url;
  });
}

registrar({
  acoes: {
    pfNome(ctx) {
      const c = document.getElementById('pf-nome');
      if (!c) return;
      ctx.nucleo.definirNome(c.value);
      ctx.avisar('Nome guardado.');
      ctx.render();
    },
    pfFoto(ctx) {
      const i = document.createElement('input');
      i.type = 'file'; i.accept = 'image/*'; i.style.display = 'none';
      i.addEventListener('change', async () => {
        const f = i.files && i.files[0];
        i.remove();
        if (!f) return;
        try { const url = await reduzir(f); ctx.avisar(ctx.nucleo.definirFoto(url) ? 'Foto guardada neste aparelho.' : 'Essa imagem não deu para usar. Tente outra.'); }
        catch (e) { ctx.avisar('Essa imagem não deu para usar. Tente outra.'); }
        ctx.render();
      });
      document.body.appendChild(i);
      i.click();
    },
    pfMes(ctx, el) { if (!el.dataset.arg) return; ctx.ui.memoria.mesColecao = el.dataset.arg; ctx.render(); },
    pfTirarFoto(ctx) { ctx.nucleo.definirFoto(null); ctx.render(); },
    pfPlano(ctx, form) {
      const fd = new FormData(form);
      const dias = fd.getAll('dias').map(Number), areas = fd.getAll('areas');
      if (dias.length < 3 || dias.length > 5) { ctx.avisar('Escolha de 3 a 5 dias de estudo.'); return; }
      const provaTipo = fd.get('provaTipo');
      const prova = SEM_DATA.has(provaTipo) ? null : (fd.get('prova') || null);
      ctx.nucleo.mudarPlano({ provaTipo, prova, dias, minutos: Number(fd.get('minutos')), areas: areas.length ? areas : ['MT'] });
      ctx.avisar('Plano guardado.');
      ctx.render();
    },
  },
});
