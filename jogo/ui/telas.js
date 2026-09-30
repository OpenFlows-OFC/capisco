/* =========================================================
   CAPISCO · Telas v2 (fora da lição)
   ========================================================= */
(function () {
  const C = window.CAPISCO, R = C.regras, D = R.datas, E = C.estado, A = C.app;
  const esc = A.esc, st = () => A.st();
  const volta = (h, t = 'Voltar') => `<a class="volta" href="${h}">← ${t}</a>`;

  /* ---------------- o que o balão/detalhe do tópico oferece ---------------- */
  function oferta(id) {
    const s = st(), T = R.topico(id), e = R.estado(s, id), t = s.topicos[id] || {};
    if (R.ehChefe(id)) {
      const ce = R.chefeEstado(s, T.conjunto);
      if (ce === 'bloqueado') {
        const faltam = R.idx().conjuntos[T.conjunto].topicos.filter(x => !((s.topicos[x.id] || {}).caixa)).length;
        return { ok: false, texto: `Libera quando todos os tópicos da unidade chegarem à caixa 1. Falta${faltam > 1 ? 'm' : ''} ${faltam}.`, botao: 'Bloqueado' };
      }
      const itens = [{ id, tipo: 'chefe' }];
      return ce === 'vencido'
        ? { ok: true, itens, texto: `Vencido em ${D.fmtData(s.chefes[T.conjunto].dia, true)}. Dá pra enfrentar de novo pra treinar.`, botao: 'Treinar de novo', ganhos: [] }
        : { ok: true, itens, texto: `Questões da unidade inteira, misturadas. Vença com uma sequência de ${R.P.chefe.criterio} pontos.`, botao: 'Enfrentar', ganhos: R.recompensa(s, itens) };
    }
    if (e === 'bloqueado') return { ok: false, texto: R.porqueEstado(s, id), botao: 'Bloqueado' };
    if (e === 'consolidado') {
      const itens = [{ id, tipo: 'extra' }];
      return { ok: true, itens, texto: `Caixa ${t.caixa} de ${R.P.caixas}. Próxima revisão ${D.fmtRel(t.proxima)}. Treinar antes não muda a caixa: ela só sobe na revisão do dia certo.`, botao: 'Treinar', ganhos: [] };
    }
    const tipo = e === 'vencido' || e === 'agendado' ? 'revisao' : e === 'pratica' ? 'pratica' : 'novo';
    const itens = [{ id, tipo }];
    const texto = tipo === 'revisao' ? 'Hora de revisar. Vale a primeira resposta: acertou de primeira, a caixa sobe.'
      : `Acerte em sequência até somar ${A.num(R.P.criterio)} pontos. Errou, a sequência recomeça. Sem pressa e sem cronômetro.`;
    return { ok: true, itens, texto, botao: tipo === 'revisao' ? 'Revisar' : 'Começar', ganhos: R.recompensa(s, itens) };
  }
  A.oferta = oferta;

  /* anel de caixas em volta do nó (5 segmentos) */
  function anel(caixa) {
    const r = 42, c = 46, arcos = [];
    for (let k = 0; k < 5; k++) {
      const a0 = (-90 + k * 72 + 5) * Math.PI / 180, a1 = (-90 + (k + 1) * 72 - 5) * Math.PI / 180;
      const p = a => `${(c + r * Math.cos(a)).toFixed(1)} ${(c + r * Math.sin(a)).toFixed(1)}`;
      arcos.push(`<path d="M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}" stroke="${k < caixa ? 'var(--reward)' : 'var(--line)'}" stroke-width="6" fill="none" stroke-linecap="round"/>`);
    }
    return `<svg class="anel" viewBox="0 0 92 92" aria-hidden="true">${arcos.join('')}</svg>`;
  }

  /* =====================================================================
     APRENDER (a trilha da unidade)
     ===================================================================== */
  A.rota('aprender', () => {
    const s = st(), cjId = A.cjAtual();
    if (!cjId) return { titulo: 'Aprender', html: `<div class="vazio">Nenhuma matéria no seu mapa ainda.<br><a class="cp-btn" style="margin-top:12px" href="#/conjuntos">Escolher matérias</a></div>` };
    const cj = R.idx().conjuntos[cjId], m = A.mat(cj.materia);
    const ids = [...cj.topicos.map(t => t.id), R.chefeId(cj.id)];
    const estados = ids.map(id => R.estado(s, id));
    let atual = estados.findIndex((e, i) => i < ids.length - 1 && ['vencido', 'agendado', 'pratica', 'novo'].includes(e));
    if (atual < 0 && R.chefeEstado(s, cj.id) === 'disponivel') atual = ids.length - 1;
    const desloc = [0, 64, 96, 64, 0, -64, -96, -64];
    const dueAqui = cj.topicos.filter(t => ['vencido', 'agendado'].includes(R.estado(s, t.id))).length;
    const dueTotal = A.revisoesHoje().length;
    const passos = ids.map((id, i) => {
      const e = estados[i], x = desloc[i % desloc.length], T = R.topico(id), chefe = R.ehChefe(id);
      const cx = (s.topicos[id] || {}).caixa || 0;
      const lado = x > 0 ? 'right:calc(100% - 6px)' : 'left:calc(100% - 6px)';
      const legenda = chefe ? { vencido: 'Vencido', disponivel: 'Liberado', bloqueado: 'Bloqueado' }[R.chefeEstado(s, cj.id)]
        : e === 'bloqueado' ? 'Bloqueado' : e === 'novo' ? 'Novo' : e === 'pratica' ? 'Em prática' : e === 'vencido' ? 'Revisão atrasada' : e === 'agendado' ? 'Revisar hoje' : `Caixa ${cx} de 5`;
      return `<div class="passo ${i === atual ? 'atual' : ''}" data-i="${i}" data-x="${x}" style="--dx:${x}">
        ${i === atual ? `<img class="capi3d capi-aqui" style="${lado}" src="${capi3dSrc('neutra', A.roupaDe(cj.materia))}" alt="">` : ''}
        <button class="no ${e} ${chefe ? 'chefe' : ''}" data-no="${esc(id)}" aria-label="${esc(T.nome)}: ${legenda}">${!chefe && cx && e !== 'bloqueado' ? anel(cx) : ''}${chefe ? '🏆' : A.ICONE[e]}</button>
        <span class="nome">${chefe ? 'Chefão da unidade' : esc(T.nome)}</span><span class="cx">${legenda}</span></div>`;
    }).join('');
    return {
      titulo: 'Aprender',
      html: `
      <div class="unidade" style="--m:${m.c}"><div class="t"><span>${m.e} ${m.n} · ${R.dominioMateria(s, cj.materia)}% dominado</span><b>${esc(cj.titulo)}</b></div>
        <button class="troca" data-a="materia">Trocar</button></div>
      ${dueTotal ? `<a class="aviso-rev" href="#/briefing"><span>🔁 ${A.plural(dueTotal, 'revisão', 'revisões')} para hoje${dueAqui && dueAqui < dueTotal ? ` (${dueAqui} nesta unidade)` : ''}</span><b>Revisar →</b></a>` : ''}
      <section class="trilha" id="trilha"><svg class="caminho" aria-hidden="true"></svg>${passos}</section>
      <div class="fim-trilha">${R.chefeEstado(s, cj.id) === 'vencido'
        ? `${A.capi('comemora', cj.materia, 130)}<b style="font:800 18px var(--font-display)">Unidade concluída!</b><p class="muted">As revisões continuam chegando na hora certa pra não esquecer.</p>`
        : `<p class="muted">Chegue ao Chefão para concluir a unidade.</p>`}
        <button class="cp-btn secondary sm" data-a="materia" style="margin-top:6px">Outras matérias</button></div>`,
      depois(el) {
        const desenhar = () => {
          const tr = el.querySelector('#trilha'); if (!tr) return;
          const svg = tr.querySelector('svg'), meio = tr.clientWidth / 2, k = +getComputedStyle(tr).getPropertyValue('--k') || 1;
          const pts = [...tr.querySelectorAll('.passo')].map(p => { const n = p.querySelector('.no'); return [meio + +p.dataset.x * k, p.offsetTop + n.offsetTop + n.offsetHeight / 2]; });
          let d = `M${pts[0][0]} ${pts[0][1]}`;
          for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2; d += ` C${x0} ${my} ${x1} ${my} ${x1} ${y1}`; }
          svg.innerHTML = `<path d="${d}" fill="none" stroke="var(--line)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 16"/>`;
        };
        requestAnimationFrame(desenhar);
        document.fonts && document.fonts.ready.then(desenhar);
        window.onresize = desenhar;
        const fecharPop = () => { el.querySelectorAll('.pop').forEach(p => p.remove()); el.querySelectorAll('.passo.aberto').forEach(p => p.classList.remove('aberto')); };
        el.addEventListener('click', e => {
          const ini = e.target.closest('[data-iniciar]');
          if (ini) { const o = oferta(ini.dataset.iniciar); if (o.ok) A.iniciar(o.itens); return; }
          const b = e.target.closest('[data-no]');
          if (!b) { if (!e.target.closest('.pop')) fecharPop(); return; }
          const passo = b.closest('.passo'), aberto = passo.querySelector('.pop');
          fecharPop();
          if (aberto) return;
          const id = b.dataset.no, o = oferta(id), T = R.topico(id);
          const pop = document.createElement('div');
          pop.className = 'pop' + (o.ok ? '' : ' cinza');
          if (o.ok) pop.style.setProperty('--m', m.c);
          pop.innerHTML = `<b class="t">${esc(T.chefe ? 'Chefão · ' + cj.titulo : T.nome)}</b><p>${esc(o.texto)}</p>
            ${o.ganhos && o.ganhos.length ? `<p><b>Se vencer:</b></p><ul>${o.ganhos.map(x => `<li>${A.textoRecompensa(x)}</li>`).join('')}</ul>` : ''}
            <button class="cp-btn block" ${o.ok ? `data-iniciar="${esc(id)}"` : 'disabled'}>${o.botao}</button>
            ${T.chefe ? '' : `<a class="det" href="#/topico/${encodeURIComponent(id)}">Ver detalhes do tópico</a>`}`;
          passo.appendChild(pop);
          passo.classList.add('aberto');
          const r = pop.getBoundingClientRect();
          const tabs = document.querySelector('.tabs'), baixo = tabs && getComputedStyle(tabs).display !== 'none' ? tabs.offsetHeight : 0;
          if (r.bottom > innerHeight - baixo - 16) window.scrollBy({ top: r.bottom - innerHeight + baixo + 24, behavior: 'auto' });
        });
        if (A._abrirNo) { const alvo = el.querySelector(`[data-no="${A._abrirNo}"]`); A._abrirNo = null; if (alvo) { alvo.scrollIntoView({ block: 'center' }); alvo.click(); } }
        else { const at = el.querySelector('.passo.atual'); if (at && at.getBoundingClientRect().top > innerHeight * .7) at.scrollIntoView({ block: 'center' }); }
      },
    };
  });

  /* =====================================================================
     TÓPICO (Progressão Legível)
     ===================================================================== */
  A.rota('topico', r => {
    const s = st(), id = r.args[0], T = R.topico(id);
    if (!T) return { html: `<div class="vazio">Tópico não encontrado. <a href="#/aprender">Voltar</a></div>` };
    const m = A.mat(T.materia), t = s.topicos[id] || { caixa: 0, tentativas: [], rodadas: [] };
    const e = R.estado(s, id), iv = R.intervalos(s), o = oferta(id);
    const deps = R.idx().dependentes[id] || [];
    const hist = t.tentativas.slice(-10).reverse();
    const sim = { ok: ['✓', 'var(--ok)'], quase: ['½', 'var(--sol-600)'], erro: ['–', 'var(--n-500)'] };
    return {
      titulo: T.nome,
      html: `${volta('#/aprender', 'Trilha')}
      <div class="pilha" style="gap:8px"><span style="color:${m.c};font:900 12px var(--font-body);letter-spacing:.06em;text-transform:uppercase">${m.e} ${m.n}</span>
        <h1 class="tit">${esc(T.nome)}</h1><p class="sub">${esc(T.resumo || '')}</p><div>${A.chip(e)}</div></div>
      <div class="regra">${esc(R.porqueEstado(s, id))}</div>
      <section class="box"><div class="entre"><h3>Caixa ${t.caixa || 0} de 5</h3><span class="mono" style="color:var(--text-muted)">${R.dominio(s, id)}%</span></div>
        <div class="caixa-salto">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= (t.caixa || 0) ? 'on' : ''}"></i>`).join('')}</div>
        ${t.proxima ? `<p class="muted">Próxima revisão: <b>${D.fmtData(t.proxima, true)}</b> (${D.fmtRel(t.proxima)}).</p>` : ''}
        <p class="muted">Cada caixa volta mais tarde: ${[1, 2, 3, 4, 5].map(k => `${k}→${iv[k]}d`).join(' · ')}. Os intervalos vêm da data da prova.</p></section>
      ${(T.prereq || []).length || deps.length ? `<section class="box"><h3>Na trilha</h3><div class="lista">
        ${(T.prereq || []).map(p => `<a class="item" href="#/topico/${p}"><span class="bola" style="--m:var(--line-strong)">↑</span><span class="t"><b>${esc(R.topico(p).nome)}</b><small>Vem antes · ${R.ROTULO[R.estado(s, p)]}</small></span><span class="seta">›</span></a>`).join('')}
        ${deps.map(p => `<a class="item" href="#/topico/${p}"><span class="bola" style="--m:var(--line-strong)">↓</span><span class="t"><b>${esc(R.topico(p).nome)}</b><small>Libera depois · ${R.ROTULO[R.estado(s, p)]}</small></span><span class="seta">›</span></a>`).join('')}</div></section>` : ''}
      <section class="box"><div class="entre"><h3>Histórico</h3><span class="muted">${A.plural(t.tentativas.length, 'tentativa', 'tentativas')}</span></div>
        ${hist.length ? `<div class="lista">${hist.map(h => { const it = R.idx().itens[h.item]; return `<div class="item"><span class="bola" style="--m:${sim[h.res][1]};width:30px;height:30px;font-size:14px">${sim[h.res][0]}</span><span class="t"><b style="font-size:14px;font-weight:700">${esc(it ? (it.enunciado || it.frente || '').slice(0, 80) : h.item)}</b><small>${D.fmtData(h.dia, true)}</small></span></div>`; }).join('')}</div>` : '<p class="muted">Nenhuma tentativa ainda.</p>'}</section>
      <div class="cp-source">Material de origem<cite>${esc(T.fonte || R.idx().conjuntos[T.conjunto].titulo)}</cite></div>
      <button class="cp-btn ${o.ok ? 'reward' : ''} block" ${o.ok ? 'data-a="ir"' : 'disabled'}>${o.botao}</button>`,
      depois(el) { el.querySelector('[data-a=ir]')?.addEventListener('click', () => A.iniciar(o.itens)); },
    };
  });

  /* =====================================================================
     REVISAR
     ===================================================================== */
  A.rota('revisar', () => {
    const s = st(), due = A.revisoesHoje(), prox = R.proximaRevisao(s), ag = R.agenda(s, 8).slice(1), iv = R.intervalos(s);
    const perm = 'Notification' in window ? Notification.permission : 'indisponivel';
    const ordenado = due.sort((a, b) => (R.estado(s, a) === 'vencido' ? -1 : 1));
    const aviso = A.textoAviso();
    return {
      titulo: 'Revisar',
      html: `<div><h1 class="tit">Revisar</h1><p class="sub">Cada tópico volta no dia em que está quase escapando da memória.</p></div>
      <section class="box" style="flex-direction:row;align-items:center;gap:14px">${A.capiFav(due.length ? 'neutra' : 'dormindo', 110)}
        <div class="pilha" style="flex:1;gap:8px">${due.length
          ? `<h3>${A.plural(due.length, 'tópico', 'tópicos')} pra hoje</h3><p class="muted">Uma partida de uns ${Math.max(3, Math.min(15, Math.min(due.length, s.perfil.ritmo || 3) * 3))} minutos resolve as mais urgentes.</p><a class="cp-btn" href="#/briefing">Revisar agora</a>`
          : `<h3>Tudo em dia</h3><p class="muted">${prox ? `Próxima revisão: <b>${D.fmtData(prox, true)}</b>.` : 'Nada agendado ainda. Vença rodadas na trilha e elas aparecem aqui.'}</p><a class="cp-btn secondary" href="#/aprender">Ir para a trilha</a>`}</div></section>
      ${ordenado.length ? `<section class="box"><h3>Hoje</h3><div class="lista">${ordenado.map(id => { const T = R.topico(id), m = A.mat(T.materia); return `<a class="item" href="#/topico/${id}"><span class="bola" style="--m:${m.c}">${m.e}</span><span class="t"><b>${esc(T.nome)}</b><small>${m.n} · caixa ${s.topicos[id].caixa}</small></span>${A.chip(R.estado(s, id))}</a>`; }).join('')}</div></section>` : ''}
      <section class="box"><h3>Próximos dias</h3><div class="dias">${ag.map(d => `<div class="d"><span>${D.fmtData(d.dia, true)}</span><div class="linha">${d.ids.length ? d.ids.map(id => `<a class="chipt" style="--m:${A.mat(R.topico(id).materia).c}" href="#/topico/${id}">${esc(R.topico(id).nome)}</a>`).join('') : '<span class="muted">livre</span>'}</div></div>`).join('')}</div></section>
      <details class="dobra"><summary>Como o jogo escolhe o dia</summary><div>
        <p class="muted">Cada tópico mora numa caixa. Acertou de primeira na revisão, sobe uma caixa e volta mais tarde. Errou de primeira, volta pra caixa 1. Com ${R.horizonte(s)} dias até a prova, os intervalos ficam assim:</p>
        <table class="tabela"><tr><th>Caixa</th>${[1, 2, 3, 4, 5].map(k => `<th>${k}</th>`).join('')}</tr><tr><td>volta em</td>${[1, 2, 3, 4, 5].map(k => `<td class="mono">${iv[k]}d</td>`).join('')}</tr></table>
        <p class="muted">A caixa 5 revisa a cada ~15% do tempo até a prova (Cepeda et al., 2008). <a href="#/regras">Todas as regras</a></p></div></details>
      <section class="box"><div class="opcao" style="padding:0;border:0"><div class="txt"><b>Avisos de revisão</b><span>No máximo 1 por dia, só quando tem revisão de verdade.</span></div>
        <input type="checkbox" class="cp-toggle" id="avisos" ${s.ajustes.avisos && perm === 'granted' ? 'checked' : ''} ${perm === 'indisponivel' ? 'disabled' : ''} aria-label="Avisos de revisão"></div>
        ${aviso ? `<div class="cp-source">${esc(aviso)}<cite>Prévia do aviso de hoje</cite></div>` : ''}
        ${perm === 'indisponivel' && A.ehIOS() ? '<p class="muted">No iPhone, os avisos funcionam depois de adicionar o Capisco à Tela de Início.</p>' : ''}
        ${perm === 'denied' ? '<p class="muted">O navegador bloqueou os avisos. Libere nas configurações do site.</p>' : ''}</section>`,
      depois(el) {
        el.querySelector('#avisos')?.addEventListener('change', async e => {
          if (e.target.checked) {
            const p = await Notification.requestPermission();
            s.ajustes.avisos = p === 'granted';
            if (p === 'granted') { s.avisadoEm = null; A.salvar(); A.avisarRevisoes(); A.toast('Avisos ligados.'); } else A.toast('Sem permissão do navegador.');
          } else { s.ajustes.avisos = false; A.toast('Avisos desligados.'); }
          A.salvar(); A.render();
        });
      },
    };
  });

  /* =====================================================================
     BRIEFING da partida de revisão (Pilar I · objetivo visível)
     ===================================================================== */
  const br = { chave: '', rodadas: null, rota: [] };
  A.rota('briefing', r => {
    const s = st();
    if (s.sessao) return {
      titulo: 'Partida',
      html: `<section class="box" style="align-items:center;text-align:center">${A.capiFav('neutra', 140)}<h3>Tem uma partida em andamento</h3><p class="muted">Rodada ${s.sessao.i + 1} de ${s.sessao.itens.length}. O que você respondeu está salvo.</p><a class="cp-btn reward" href="#/licao">Continuar a partida</a><button class="cp-btn ghost" data-a="descartar">Descartar</button></section>`,
      depois: el => el.querySelector('[data-a=descartar]').addEventListener('click', async () => { if (await A.confirmar({ titulo: 'Descartar a partida?', texto: 'As respostas já dadas continuam no histórico.', ok: 'Descartar' })) { delete s.sessao; A.salvar(); A.render(); } }),
    };
    const chave = (r.q.materia || '') + '|' + (r.q.rota || '');
    if (br.chave !== chave) Object.assign(br, { chave, rodadas: null, rota: r.q.rota ? [r.q.rota] : [] });
    const prop = R.proposta(s, { rodadas: br.rodadas, filtroMateria: r.q.materia || '', rota: br.rota });
    const itens = prop.itens, n = itens.length;
    if (!n) return { titulo: 'Partida', html: `${volta('#/revisar', 'Revisar')}<section class="box" style="align-items:center;text-align:center">${A.capiFav('dormindo', 150)}<h3>Nada pra jogar agora</h3><p class="muted">Tudo o que está liberado já foi consolidado. Descansar também faz parte: a memória consolida entre as sessões.</p><a class="cp-btn secondary" href="#/conjuntos">Adicionar matérias</a></section>` };
    const rec = R.recompensa(s, itens);
    const escolhidos = new Set(itens.map(i => i.id));
    const livres = prop.livres.filter(id => !escolhidos.has(id));
    const rot = it => it.tipo === 'revisao' ? (it.motivo === 'atrasada' ? 'Revisão atrasada' : 'Revisão de hoje') : it.tipo === 'pratica' ? 'Continuar prática' : 'Tópico novo';
    return {
      titulo: 'Partida',
      html: `${volta('#/revisar', 'Revisar')}
      <div><h1 class="tit">Sua partida</h1><p class="sub">O jogo propôs; você ajusta quantas rodadas e quais tópicos novos entram.</p></div>
      <section class="box"><div class="entre"><h3>Rodadas</h3>
        <div class="stepper" role="group" aria-label="Número de rodadas"><button data-n="-1" ${n <= R.P.rodadas.min ? 'disabled' : ''} aria-label="Menos uma">−</button><output>${n}</output><button data-n="1" ${n >= prop.max ? 'disabled' : ''} aria-label="Mais uma">+</button></div></div>
        <div>${itens.map((it, k) => { const T = R.topico(it.id), m = A.mat(T.materia); return `<div class="rod" style="--m:${m.c}"><span class="n">${k + 1}</span><span><b>${esc(T.nome)}</b><small>${m.n} · ${rot(it)}</small></span>${it.tipo !== 'revisao' && livres.length ? `<select class="cp-input" data-troca="${it.id}" aria-label="Trocar tópico"><option value="">Trocar</option>${livres.map(id => `<option value="${id}">${esc(R.topico(id).nome)}</option>`).join('')}</select>` : ''}</div>`; }).join('')}</div>
        ${prop.obrigatorios > n ? `<p class="muted">${A.plural(prop.obrigatorios - n, 'revisão ficou', 'revisões ficaram')} pra próxima partida; elas continuam na frente da fila.</p>` : ''}</section>
      <div class="ganha"><b class="t">Se vencer ${n === 1 ? 'a rodada' : `as ${n} rodadas`}</b><ul>${rec.map(x => `<li>${A.textoRecompensa(x)}</li>`).join('')}</ul></div>
      <p class="vitoria"><small>Condição de vitória</small>Vencer ${A.plural(n, 'rodada', 'rodadas')}: ${esc(A.lista(itens.map(i => R.topico(i.id).nome)))}.</p>
      <button class="cp-btn reward block" data-a="comecar">Começar partida</button>
      <p class="muted" style="text-align:center">Estimativa: ${n * 2}–${n * 4} min · sem cronômetro durante as questões</p>`,
      depois(el) {
        el.addEventListener('click', e => {
          const b = e.target.closest('[data-n],[data-a]'); if (!b) return;
          if (b.dataset.n) { br.rodadas = n + +b.dataset.n; return A.render(); }
          if (b.dataset.a === 'comecar') { br.chave = ''; A.iniciar(itens); }
        });
        el.addEventListener('change', e => {
          const sel = e.target.closest('[data-troca]'); if (!sel || !sel.value) return;
          br.rota = itens.filter(i => i.tipo !== 'revisao').map(i => (i.id === sel.dataset.troca ? sel.value : i.id));
          br.rodadas = n; A.render();
        });
      },
    };
  });

  /* =====================================================================
     PERFIL (progresso + recompensas)
     ===================================================================== */
  A.rota('perfil', () => {
    const s = st(), ids = R.topicosAtivos(s), dias = R.ultimos14(s);
    const minutos = Math.round((s.sessoes || []).reduce((t, x) => t + ((x.fim || x.inicio) - x.inicio), 0) / 60000);
    const fav = s.roupaFavorita && (s.roupas || []).includes(s.roupaFavorita) ? s.roupaFavorita : null;
    const cjs = R.ativos(s);
    const sess = [...(s.sessoes || [])].sort((a, b) => b.inicio - a.inicio).slice(0, 5);
    return {
      titulo: 'Perfil',
      html: `<div class="perfil-cab" style="--m:${fav ? A.mat(fav).c : 'var(--brand)'}"><div class="av">${A.capi('feliz', fav, 112)}</div>
        <div><b>${esc(s.perfil.nome)}</b><p class="muted">${esc(s.perfil.provaNome || 'Prova')} em ${R.horizonte(s)} dias · desde ${D.fmtData(s.perfil.criado || D.hoje())}</p><a class="muted" href="#/ajustes" style="color:var(--ceu-600)">Editar perfil</a></div></div>
      <div class="nums">
        <div class="num"><span class="e">⭐</span><div><b>${ids.filter(id => (s.topicos[id] || {}).caixa).length}/${ids.length}</b><small>consolidados</small></div></div>
        <div class="num"><span class="e">📅</span><div><b>${dias.filter(d => d.on).length}</b><small>dias em 14</small></div></div>
        <div class="num"><span class="e">⏱️</span><div><b>${minutos}</b><small>minutos</small></div></div>
        <div class="num"><span class="e">🏆</span><div><b>${Object.keys(s.chefes || {}).length}</b><small>troféus</small></div></div></div>
      <section class="box"><div class="entre"><h3>Constância</h3><span class="muted">últimas 2 semanas</span></div>
        <div class="cal">${dias.map(d => `<i class="${d.on ? 'on' : ''}" title="${D.fmtData(d.dia, true)}">${D.parse(d.dia).getDate()}</i>`).join('')}</div>
        <p class="muted">É registro, não ameaça: pular um dia não apaga nada, só muda quando cada tópico volta.</p></section>
      <section class="box"><h3>Domínio por matéria</h3>${cjs.map(cj => { const m = A.mat(cj.materia), p = R.dominioMateria(s, cj.materia); return `<a href="#/aprender" data-cj="${cj.id}" style="--m:${m.c};text-decoration:none;color:var(--text);display:flex;flex-direction:column;gap:6px"><span class="entre"><b style="font:800 15px var(--font-body)">${m.e} ${esc(cj.titulo)} ${(s.chefes || {})[cj.id] ? '🏆' : ''}</b><span class="mono" style="color:var(--text-muted)">${p}%</span></span><div class="barra"><i style="width:${p}%"></i></div></a>`; }).join('') || '<p class="muted">Nenhuma matéria ativa.</p>'}</section>
      <section class="box"><h3>Troféus</h3><p class="muted">Um por unidade: vença o Chefão no fim da trilha.</p>
        <div class="grade">${cjs.map(cj => { const ok = (s.chefes || {})[cj.id]; return `<div class="trofeu ${ok ? '' : 'nao'}"><span class="e">🏆</span>${esc(A.mat(cj.materia).n)}</div>`; }).join('')}</div></section>
      <section class="box"><h3>Guarda-roupa da Capi</h3><p class="muted">Cada roupa vem com o troféu da unidade. Toque numa liberada pra Capi usar no perfil.</p>
        <div class="grade">${Object.keys(R.MATERIAS).map(k => { const m = R.MATERIAS[k], tem = (s.roupas || []).includes(k); return `<button class="roupa ${tem ? '' : 'nao'}" style="--m:${m.c}" ${tem ? `data-roupa="${k}" aria-pressed="${fav === k}"` : 'disabled'}><img src="${capi3dSrc(tem ? 'feliz' : 'neutra', k)}" alt="">${m.n}</button>`; }).join('')}</div></section>
      <section class="box"><h3>Partidas recentes</h3>${sess.length ? `<div class="lista">${sess.map(x => `<div class="item"><span class="bola" style="--m:${x.completa === false ? 'var(--line-strong)' : 'var(--brand)'}">${x.completa === false ? '⏸' : '✓'}</span><span class="t"><b>${x.vencidas ?? '–'} de ${x.rodadas} rodadas</b><small>${D.fmtData(x.dia, true)} · ${Math.max(1, Math.round((x.fim - x.inicio) / 60000))} min</small></span></div>`).join('')}</div>` : '<p class="muted">Nenhuma partida ainda.</p>'}</section>`,
      depois(el) {
        el.addEventListener('click', e => {
          const rb = e.target.closest('[data-roupa]'); if (rb) { s.roupaFavorita = rb.dataset.roupa; A.salvar(); A.toast('A Capi trocou de roupa.'); return A.render(); }
          const cb = e.target.closest('[data-cj]'); if (cb) { s.cjAtual = cb.dataset.cj; A.salvar(); }
        });
      },
    };
  });

  /* =====================================================================
     MAIS
     ===================================================================== */
  A.rota('mais', () => {
    const inst = !A.instalado() && (A.instalavel || A.ehIOS());
    return {
      titulo: 'Mais',
      html: `<h1 class="tit">Mais</h1>
      ${inst ? `<section class="box" style="flex-direction:row;align-items:center">${capiscoIcon(52)}<div style="flex:1"><b style="font:800 16px var(--font-body)">Instalar o Capisco</b><p class="muted">${A.ehIOS() ? 'No Safari: toque em <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>.' : 'Abre como app, funciona offline e avisa as revisões.'}</p></div>${A.instalavel ? '<button class="cp-btn sm" data-a="instalar">Instalar</button>' : ''}</section>` : ''}
      <section class="box" style="padding:4px 16px"><div class="menu">
        <a href="#/conjuntos"><span class="ic">📚</span><span>Matérias e conjuntos<small>Adicionar, tirar ou criar conteúdo</small></span><span class="seta">›</span></a>
        <a href="#/grupo"><span class="ic">👥</span><span>Grupo de estudo<small>Meta coletiva, sem ranking</small></span><span class="seta">›</span></a>
        <a href="#/regras"><span class="ic">⚖️</span><span>Como o jogo decide<small>Todas as regras, à vista</small></span><span class="seta">›</span></a>
        <a href="#/ajustes"><span class="ic">⚙️</span><span>Ajustes e dados<small>Perfil, acessibilidade, exportar</small></span><span class="seta">›</span></a>
        <a href="../index.html"><span class="ic">🎨</span><span>Design system<small>Marca, cores e componentes</small></span><span class="seta">›</span></a></div></section>
      <p class="muted" style="text-align:center">Capisco · regras v${R.versao} · seus dados ficam neste aparelho</p>`,
      depois(el) { el.querySelector('[data-a=instalar]')?.addEventListener('click', A.instalar); },
    };
  });

  /* =====================================================================
     CONJUNTOS (matérias no mapa + repositório)
     ===================================================================== */
  let abaCj = 'meus';
  A.rota('conjuntos', () => {
    const s = st(), todos = Object.values(R.idx().conjuntos);
    const lista = abaCj === 'meus' ? todos.filter(cj => s.conjuntosAtivos.includes(cj.id)) : todos;
    const nItens = cj => cj.topicos.reduce((n, t) => n + (t.itens || []).length, 0);
    return {
      titulo: 'Matérias',
      html: `${volta('#/mais', 'Mais')}<div class="entre"><h1 class="tit">Matérias</h1><a class="cp-btn sm" href="#/editor/novo">+ Criar</a></div>
      <div class="seg"><button data-aba="meus" aria-pressed="${abaCj === 'meus'}">No meu mapa</button><button data-aba="repo" aria-pressed="${abaCj === 'repo'}">Repositório</button></div>
      <section class="box" style="padding:4px 16px">${lista.map(cj => {
        const m = A.mat(cj.materia), ativo = s.conjuntosAtivos.includes(cj.id), meu = (s.conjuntosUsuario || []).some(c => c.id === cj.id);
        return `<div class="cj" style="--m:${m.c}"><img src="${capi3dSrc('neutra', A.roupaDe(cj.materia))}" alt=""><div class="t"><span style="color:${m.c};font:900 12px var(--font-body);text-transform:uppercase;letter-spacing:.06em">${m.n}</span><b>${esc(cj.titulo)}</b><span class="muted">${cj.topicos.length} tópicos · ${nItens(cj)} questões · ${esc(cj.autor || 'você')}</span>
          <div class="linha" style="margin-top:4px">${ativo ? `<button class="cp-btn secondary sm" data-abrir="${cj.id}">Abrir trilha</button>${meu ? `<a class="cp-btn ghost sm" href="#/editor/${cj.id}">Editar</a>` : ''}<button class="cp-btn ghost sm" data-tirar="${cj.id}">Tirar</button>` : `<button class="cp-btn sm" data-adotar="${cj.id}">Adicionar</button>`}</div></div></div>`;
      }).join('') || '<div class="vazio" style="margin:12px 0">Nenhuma matéria no mapa. Veja o repositório.</div>'}</section>
      <p class="muted">Cada conjunto é uma trilha de tópicos com pré-requisitos, terminando num Chefão.</p>`,
      depois(el) {
        el.addEventListener('click', async e => {
          const b = e.target.closest('[data-aba],[data-adotar],[data-tirar],[data-abrir]'); if (!b) return;
          if (b.dataset.aba) abaCj = b.dataset.aba;
          if (b.dataset.abrir) { s.cjAtual = b.dataset.abrir; A.salvar(); return A.ir('#/aprender'); }
          if (b.dataset.adotar) { s.conjuntosAtivos.push(b.dataset.adotar); s.cjAtual = b.dataset.adotar; A.salvar(); A.toast('Adicionada ao seu mapa.'); }
          if (b.dataset.tirar) {
            if (!(await A.confirmar({ titulo: 'Tirar do mapa?', texto: 'O histórico continua guardado. Se adicionar de novo, volta de onde parou.', ok: 'Tirar' }))) return;
            s.conjuntosAtivos = s.conjuntosAtivos.filter(i => i !== b.dataset.tirar); A.salvar();
          }
          A.render();
        });
      },
    };
  });

  /* =====================================================================
     EDITOR DE CONJUNTO (curadoria por restrição)
     ===================================================================== */
  let ed = null;
  const novoItem = tipo => tipo === 'cartao'
    ? { id: '', tipo: 'cartao', nivel: 'lembrar', dif: 1, frente: '', verso: '', explicacao: '', trecho: '' }
    : { id: '', tipo: 'mc', nivel: 'lembrar', dif: 1, enunciado: '', opcoes: [{ t: '', ok: true }, { t: '', erro: '' }, { t: '', erro: '' }, { t: '', erro: '' }], explicacao: '', trecho: '' };
  function validar(cj) {
    const out = [], add = (ok, t) => out.push({ ok, t });
    add(!!cj.titulo.trim(), 'Conjunto tem título');
    cj.topicos.forEach((t, ti) => {
      const nome = t.nome.trim() || `Tópico ${ti + 1}`;
      add(!!t.nome.trim() && !!t.fonte.trim(), `${nome}: nome e material de origem`);
      add(t.itens.length >= 2, `${nome}: pelo menos 2 questões`);
      t.itens.forEach((it, ii) => {
        const r = `${nome} · questão ${ii + 1}`;
        add(!!it.trecho.trim(), `${r}: trecho de origem citado`);
        if (it.tipo === 'mc') {
          add(!!it.enunciado.trim() && it.opcoes.every(o => o.t.trim()), `${r}: enunciado e 4 alternativas`);
          add(it.opcoes.filter(o => !o.ok).every(o => (o.erro || '').trim()), `${r}: cada distrator com a concepção errônea`);
        } else add(!!it.frente.trim() && !!it.verso.trim(), `${r}: frente e verso`);
      });
    });
    return out;
  }
  A.rota('editor', r => {
    const s = st(), id = r.args[0];
    if (!ed || ed._de !== id) {
      const base = (s.conjuntosUsuario || []).find(c => c.id === id);
      ed = base ? JSON.parse(JSON.stringify(base)) : { id: 'meu-' + Date.now().toString(36), materia: 'bio', titulo: '', autor: s.perfil.nome, versao: '1.0', descricao: '', topicos: [{ id: '', nome: '', resumo: '', prereq: [], fonte: '', itens: [novoItem('mc'), novoItem('cartao')] }] };
      ed.topicos.forEach(t => t.itens.forEach(it => { it.trecho = it.trecho || ''; if (it.tipo === 'mc') it.opcoes.forEach(o => { if (!o.ok) o.erro = o.erro || ''; }); }));
      ed._de = id;
    }
    const chk = validar(ed), ok = chk.every(c => c.ok);
    const campo = (rot, path, val, area, extra = '') => `<div class="campo"><label>${rot}</label>${area ? `<textarea class="cp-input" data-p="${path}" rows="2" ${extra}>${esc(val)}</textarea>` : `<input class="cp-input" data-p="${path}" value="${esc(val)}" ${extra}>`}</div>`;
    const topicos = ed.topicos.map((t, ti) => `
      <section class="box"><div class="entre"><h3>Tópico ${ti + 1}</h3>${ed.topicos.length > 1 ? `<button class="cp-btn ghost sm" data-rm-top="${ti}">Remover</button>` : ''}</div>
        <div class="duas">${campo('Nome', `topicos.${ti}.nome`, t.nome, false, 'maxlength="40" placeholder="Ex.: 1ª Lei de Mendel"')}${campo('Material de origem', `topicos.${ti}.fonte`, t.fonte, false, 'placeholder="Ex.: Apostila Bio 2, cap. 4"')}</div>
        ${ti ? `<div class="campo"><span>Vem depois de</span><div class="linha">${ed.topicos.slice(0, ti).map((p, pi) => `<label class="cp-chip"><input type="checkbox" data-prereq="${ti}:${pi}" ${t.prereq.includes('#' + pi) ? 'checked' : ''}> ${esc(p.nome || 'Tópico ' + (pi + 1))}</label>`).join('')}</div></div>` : ''}
        ${t.itens.map((it, ii) => `<div class="item-ed"><div class="entre"><span style="font:900 12px var(--font-body);letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted)">Questão ${ii + 1} · ${it.tipo === 'mc' ? 'múltipla escolha' : 'cartão'}</span>${t.itens.length > 1 ? `<button class="cp-btn ghost sm" data-rm-item="${ti}:${ii}">Remover</button>` : ''}</div>
          ${it.tipo === 'mc' ? `${campo('Enunciado', `topicos.${ti}.itens.${ii}.enunciado`, it.enunciado, true)}
            <div class="campo"><span>Alternativas · marque a certa e diga que erro leva a cada errada</span><div class="alt-ed">${it.opcoes.map((o, oi) => `<input type="radio" name="ok-${ti}-${ii}" data-ok="${ti}:${ii}:${oi}" ${o.ok ? 'checked' : ''} aria-label="correta"><input class="cp-input" data-p="topicos.${ti}.itens.${ii}.opcoes.${oi}.t" value="${esc(o.t)}" placeholder="Alternativa ${oi + 1}">${o.ok ? '' : `<input class="cp-input conc" data-p="topicos.${ti}.itens.${ii}.opcoes.${oi}.erro" value="${esc(o.erro || '')}" placeholder="Erro que leva aqui (ex.: confunde genótipo com fenótipo)">`}`).join('')}</div></div>`
            : `<div class="duas">${campo('Frente', `topicos.${ti}.itens.${ii}.frente`, it.frente, true)}${campo('Verso', `topicos.${ti}.itens.${ii}.verso`, it.verso, true)}</div>`}
          <div class="duas"><div class="campo"><label>Nível</label><select class="cp-input" data-p="topicos.${ti}.itens.${ii}.nivel">${R.NIVEIS.map(n => `<option ${n === it.nivel ? 'selected' : ''}>${n}</option>`).join('')}</select></div>${campo('Explicação', `topicos.${ti}.itens.${ii}.explicacao`, it.explicacao)}</div>
          ${campo('Trecho do material de origem', `topicos.${ti}.itens.${ii}.trecho`, it.trecho, true)}</div>`).join('')}
        <div class="linha"><button class="cp-btn secondary sm" data-add-item="${ti}:mc">+ Múltipla escolha</button><button class="cp-btn secondary sm" data-add-item="${ti}:cartao">+ Cartão</button></div></section>`).join('');
    return {
      titulo: 'Editor',
      html: `${volta('#/conjuntos', 'Matérias')}<div><h1 class="tit">${esc(ed.titulo || 'Novo conjunto')}</h1><p class="sub">Só salva quando passa no checklist de qualidade: a curadoria vira regra.</p></div>
      <section class="box"><div class="duas">${campo('Título', 'titulo', ed.titulo, false, 'maxlength="48"')}<div class="campo"><label>Matéria</label><select class="cp-input" data-p="materia">${Object.entries(R.MATERIAS).map(([k, m]) => `<option value="${k}" ${k === ed.materia ? 'selected' : ''}>${m.n}</option>`).join('')}</select></div></div>${campo('Descrição', 'descricao', ed.descricao, false, 'maxlength="120"')}</section>
      ${topicos}
      <button class="cp-btn secondary" data-add-top>+ Adicionar tópico</button>
      <section class="box"><div class="entre"><h3>Checklist de qualidade</h3><span class="mono" id="chkN">${chk.filter(c => c.ok).length}/${chk.length}</span></div>
        <div class="checklist">${chk.map(c => `<div class="cp-step ${c.ok ? 'ok' : 'miss'}">${esc(c.t)}</div>`).join('')}</div>
        <button class="cp-btn reward" data-salvar ${ok ? '' : 'disabled'}>Salvar e adicionar ao mapa</button>
        ${(s.conjuntosUsuario || []).some(c => c.id === ed.id) ? '<button class="cp-btn ghost" data-excluir>Excluir conjunto</button>' : ''}</section>`,
      depois(el) {
        const setp = (path, v) => { const k = path.split('.'); let o = ed; k.slice(0, -1).forEach(p => (o = o[p])); o[k[k.length - 1]] = v; };
        const reChk = () => { const c = validar(ed); el.querySelector('.checklist').innerHTML = c.map(x => `<div class="cp-step ${x.ok ? 'ok' : 'miss'}">${esc(x.t)}</div>`).join(''); el.querySelector('[data-salvar]').disabled = !c.every(x => x.ok); el.querySelector('#chkN').textContent = `${c.filter(x => x.ok).length}/${c.length}`; };
        el.addEventListener('input', e => { const p = e.target.dataset.p; if (p) { setp(p, e.target.value); reChk(); } });
        el.addEventListener('change', e => {
          if (e.target.dataset.ok) { const [ti, ii, oi] = e.target.dataset.ok.split(':').map(Number); ed.topicos[ti].itens[ii].opcoes.forEach((o, i) => { o.ok = i === oi; if (o.ok) delete o.erro; else o.erro = o.erro || ''; }); return A.render(); }
          if (e.target.dataset.prereq) { const [ti, pi] = e.target.dataset.prereq.split(':').map(Number); const pr = ed.topicos[ti].prereq, k = '#' + pi; e.target.checked ? pr.push(k) : pr.splice(pr.indexOf(k), 1); }
        });
        el.addEventListener('click', async e => {
          const b = e.target.closest('button'); if (!b) return;
          if (b.hasAttribute('data-add-top')) ed.topicos.push({ id: '', nome: '', resumo: '', prereq: [], fonte: '', itens: [novoItem('mc'), novoItem('cartao')] });
          else if (b.dataset.rmTop) ed.topicos.splice(+b.dataset.rmTop, 1);
          else if (b.dataset.addItem) { const [ti, tipo] = b.dataset.addItem.split(':'); ed.topicos[+ti].itens.push(novoItem(tipo)); }
          else if (b.dataset.rmItem) { const [ti, ii] = b.dataset.rmItem.split(':').map(Number); ed.topicos[ti].itens.splice(ii, 1); }
          else if (b.hasAttribute('data-excluir')) {
            if (!(await A.confirmar({ titulo: 'Excluir este conjunto?', texto: 'Os tópicos somem do mapa e o histórico deles é apagado.', ok: 'Excluir', perigo: true }))) return;
            s.conjuntosUsuario = s.conjuntosUsuario.filter(c => c.id !== ed.id); s.conjuntosAtivos = s.conjuntosAtivos.filter(c => c !== ed.id);
            A.trocar(s); ed = null; return A.ir('#/conjuntos');
          } else if (b.hasAttribute('data-salvar')) {
            const cj = JSON.parse(JSON.stringify(ed)); delete cj._de;
            cj.topicos.forEach((t, ti) => { t.id = `${cj.id}-t${ti}`; });
            cj.topicos.forEach(t => { t.prereq = t.prereq.map(k => `${cj.id}-t${k.slice(1)}`); t.itens.forEach((it, ii) => (it.id = `${t.id}-i${ii}`)); });
            s.conjuntosUsuario = (s.conjuntosUsuario || []).filter(c => c.id !== cj.id).concat(cj);
            if (!s.conjuntosAtivos.includes(cj.id)) s.conjuntosAtivos.push(cj.id);
            s.cjAtual = cj.id;
            A.trocar(s); ed = null; A.toast('Conjunto salvo.'); return A.ir('#/aprender');
          } else return;
          A.render();
        });
      },
    };
  });

  /* =====================================================================
     GRUPO DE ESTUDO (meta coletiva, sem ranking)
     ===================================================================== */
  A.rota('grupo', () => {
    const s = st(), g = s.grupo;
    if (!g) return {
      titulo: 'Grupo',
      html: `${volta('#/mais', 'Mais')}<div><h1 class="tit">Grupo de estudo</h1><p class="sub">O grupo declara uma meta e vê o progresso coletivo. Sua parte só você vê: sem ranking.</p></div>
      <section class="box"><h3>Criar grupo</h3>
        <div class="campo"><label for="gn">Nome</label><input class="cp-input" id="gn" placeholder="Ex.: 3ºB · Rumo ao ENEM" maxlength="32"></div>
        <div class="duas"><div class="campo"><label for="gc">Meta: matéria</label><select class="cp-input" id="gc">${R.ativos(s).map(cj => `<option value="${cj.id}">${esc(cj.titulo)}</option>`).join('')}</select></div>
        <div class="campo"><label for="gp">Prazo</label><input class="cp-input" type="date" id="gp" value="${D.addDias(D.hoje(), 21)}" min="${D.hoje()}"></div></div>
        <button class="cp-btn" data-a="criar">Criar grupo</button></section>
      <section class="box"><h3>Entrar com código</h3>
        <div class="campo"><label for="gcod">Código</label><input class="cp-input" id="gcod" placeholder="CAPI-3B" maxlength="10" style="text-transform:uppercase"></div>
        <button class="cp-btn secondary" data-a="entrar">Entrar</button>
        <p class="muted">Neste protótipo não há servidor: os colegas são simulados.</p></section>`,
      depois(el) {
        el.addEventListener('click', e => {
          const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
          if (a === 'criar') {
            const nome = el.querySelector('#gn').value.trim(); if (!nome) return A.toast('Dá um nome pro grupo.');
            s.grupo = Object.assign(E.grupoExemplo(), { nome, codigo: 'CAPI-' + Math.random().toString(36).slice(2, 5).toUpperCase(), meta: { conjunto: el.querySelector('#gc').value, caixa: 2, prazo: el.querySelector('#gp').value }, membros: [s.perfil.nome], colegas: 0 });
          } else {
            const cod = el.querySelector('#gcod').value.trim().toUpperCase(); if (!cod) return A.toast('Digite o código.');
            s.grupo = Object.assign(E.grupoExemplo(), { codigo: cod });
            if (!R.ativos(s).some(c => c.id === s.grupo.meta.conjunto)) s.grupo.meta.conjunto = (R.ativos(s)[0] || {}).id;
          }
          A.salvar(); A.render();
        });
      },
    };
    const cj = R.idx().conjuntos[g.meta.conjunto];
    const meus = cj ? cj.topicos.filter(t => ((s.topicos[t.id] || {}).caixa || 0) >= g.meta.caixa).length : 0;
    const total = cj ? cj.topicos.length : 1;
    const nMemb = g.membros.length + (g.membros.includes(s.perfil.nome) ? 0 : 1);
    const coletivo = Math.round(((g.colegas * (nMemb - 1) * total + meus) / (nMemb * total)) * 100);
    const cores = ['#58b847', '#3fa9f5', '#8b6cff', '#ff7a6b', '#e0a100', '#0b8577', '#e05c9a'];
    const todos = g.membros.includes(s.perfil.nome) ? g.membros : [s.perfil.nome, ...g.membros];
    return {
      titulo: 'Grupo',
      html: `${volta('#/mais', 'Mais')}<div class="pilha" style="gap:6px"><span class="aviso-demo">Colegas simulados neste protótipo</span><h1 class="tit">${esc(g.nome)}</h1><p class="muted">Código <b class="mono">${esc(g.codigo)}</b></p></div>
      <section class="box" style="border-color:var(--text)"><span style="font:900 12px var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted)">Meta do grupo</span>
        <h3>Todos os tópicos de ${esc(cj ? cj.titulo : '—')} na caixa ${g.meta.caixa} até ${D.fmtData(g.meta.prazo, true)}</h3>
        <div class="entre"><span class="muted">Progresso do grupo</span><b class="mono">${coletivo}%</b></div><div class="cp-progress"><b style="width:${coletivo}%"></b></div>
        <p class="muted">Faltam ${Math.max(0, D.diff(D.hoje(), g.meta.prazo))} dias. O grupo só vê este número.</p></section>
      <section class="box"><div class="entre"><h3>Sua parte</h3><span class="st pratica"><i>🔒</i>só você vê</span></div>
        <b class="mono" style="font-size:26px">${meus} de ${total} tópicos</b><div class="barra"><i style="width:${(meus / total) * 100}%"></i></div>
        ${cj ? `<button class="cp-btn secondary" data-cj="${cj.id}">Abrir a trilha</button>` : ''}</section>
      <section class="box"><h3>Quem está no grupo</h3><div class="membros">${todos.map((n, i) => `<span class="membro"><i style="background:${cores[i % cores.length]}">${esc(n[0] || '?')}</i>${esc(n)}${n === s.perfil.nome ? ' (você)' : ''}</span>`).join('')}</div>
        <p class="muted">Sem pontos na lista: comparar colegas desmotiva justamente quem mais precisa (Hanus e Fox, 2015).</p>
        <button class="cp-btn ghost" data-a="sair">Sair do grupo</button></section>`,
      depois(el) {
        el.querySelector('[data-cj]')?.addEventListener('click', e => { s.cjAtual = e.currentTarget.dataset.cj; A.salvar(); A.ir('#/aprender'); });
        el.querySelector('[data-a=sair]').addEventListener('click', async () => { if (!(await A.confirmar({ titulo: 'Sair do grupo?', texto: 'Seu progresso pessoal não muda.', ok: 'Sair' }))) return; s.grupo = null; A.salvar(); A.render(); });
      },
    };
  });

  /* =====================================================================
     COMO O JOGO DECIDE
     ===================================================================== */
  A.rota('regras', () => {
    const s = st(), P = R.P, iv = R.intervalos(s);
    const bloco = (n, t, corpo) => `<details class="dobra"><summary><span><span style="font:900 11px var(--font-body);letter-spacing:.08em;text-transform:uppercase;display:block;color:var(--text-muted)">${n}</span>${t}</span></summary><div>${corpo}</div></details>`;
    return {
      titulo: 'Como o jogo decide',
      html: `${volta('#/mais', 'Mais')}<div><h1 class="tit">Como o jogo decide</h1><p class="sub">Toda decisão sai de uma regra curta, que está aqui. Nada depende de sorteio.</p></div>
      ${bloco('Pilar I · Objetivo visível', 'O que entra na partida', `<p class="muted">${esc(R.regraProposta())} Na trilha, o balão de cada tópico mostra o objetivo e o que você ganha antes de começar.</p>`)}
      ${bloco('Pilar II · Tentativa como unidade', 'Resposta antes da explicação', `<p class="muted">A explicação só aparece depois que você tenta. Depois de cada resultado há uma pausa de ${P.deliberacao / 1000} s antes do "Continuar": o jogo nunca avança sozinho.</p>`)}
      ${bloco('Pilar III · Ritmo elástico', 'Quando a rodada termina', `<p class="muted">Por domínio, não por tempo: acertos seguidos somam pontos até <b>${A.num(P.criterio)}</b> (lembrar ${P.pesos.lembrar} · entender ${A.num(P.pesos.compreender)} · aplicar ${P.pesos.aplicar}). Erro zera a sequência; acerto parcial não soma nem zera. Teto de ${P.teto} tentativas: aí o tópico volta à caixa 0 e a prática vai pro pré-requisito. O Chefão pede ${P.chefe.criterio} pontos, com teto de ${P.chefe.teto}.</p><p class="muted">A dificuldade mira ${P.banda[0] * 100}–${P.banda[1] * 100}% de acerto nas últimas 6 respostas: acima disso sobe o nível, abaixo desce.</p>`)}
      ${bloco('Pilar IV · Progressão legível', 'Como o resultado é mostrado', `<p class="muted">Três camadas: acertou/quase/ainda não, o porquê (com o trecho da apostila) e o que vem a seguir. O jogo julga a resposta, nunca você. Em questões de aplicação, você confere o próprio raciocínio antes de ver o resultado.</p>`)}
      ${bloco('Pilar V · Recompensa determinística', 'O que você ganha', `<p class="muted">Tudo é anunciado antes e entregue inteiro: tópicos que sobem de caixa, tópicos que liberam, o Chefão liberado e, ao vencê-lo, troféu da unidade e roupa da Capi. Não existe moeda, sorteio nem ranking.</p>`)}
      ${bloco('Pilar VI · Retorno programado', 'Quando cada tópico volta', `<p class="muted">Caixas de Leitner com intervalos pela distância até a prova (${R.horizonte(s)} dias). Revisão acertada de primeira: sobe uma caixa. Errada de primeira: volta à caixa 1.</p><table class="tabela"><tr><th>Caixa</th>${[1, 2, 3, 4, 5].map(k => `<th>${k}</th>`).join('')}</tr><tr><td>volta em</td>${[1, 2, 3, 4, 5].map(k => `<td class="mono">${iv[k]}d</td>`).join('')}</tr></table>`)}
      ${bloco('Pilar VII · Encerramento projetado', 'Como a partida acaba', `<p class="muted">Quando as rodadas declaradas acabam. A última tela muda de cor, o som para e não existe "só mais uma": pra estudar mais, você monta uma partida nova.</p>`)}
      <section class="box"><h3>Sons: intensidade = ganho real</h3><div class="lista">${[['0', 'Ainda não', 'grave e baixo'], ['1', 'Quase', 'duas notas neutras'], ['2', 'Acertou', 'uma nota aguda'], ['3', 'Subiu de caixa', 'duas notas subindo'], ['4', 'Rodada vencida', 'arpejo']].map(([n, ev, d]) => `<div class="item"><span class="bola" style="--m:var(--line-strong)">${n}</span><span class="t"><b>${ev}</b><small>${d}</small></span><button class="cp-btn secondary sm" data-som="${n}">Ouvir</button></div>`).join('')}</div></section>
      <details class="dobra"><summary>Parâmetros atuais</summary><div><pre class="mono" style="margin:0;white-space:pre-wrap;font-size:12.5px;color:var(--text-soft)">${esc(JSON.stringify(P, null, 2))}</pre></div></details>`,
      depois(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-som]'); if (b) { const v = s.ajustes.som; s.ajustes.som = true; A.som(+b.dataset.som); s.ajustes.som = v; } }); },
    };
  });

  /* =====================================================================
     AJUSTES
     ===================================================================== */
  A.rota('ajustes', () => {
    const s = st(), a = s.ajustes;
    const tog = (k, b, t) => `<div class="opcao"><div class="txt"><b>${b}</b><span>${t}</span></div><input type="checkbox" class="cp-toggle" data-aj="${k}" ${a[k] ? 'checked' : ''} aria-label="${b}"></div>`;
    return {
      titulo: 'Ajustes',
      html: `${volta('#/mais', 'Mais')}<h1 class="tit">Ajustes</h1>
      <section class="box"><h3>Perfil</h3>
        <div class="campo"><label for="an">Nome</label><input class="cp-input" id="an" value="${esc(s.perfil.nome)}" maxlength="24"></div>
        <div class="duas"><div class="campo"><label for="ap">Data da prova</label><input class="cp-input" type="date" id="ap" value="${esc(s.perfil.prova)}"></div>
        <div class="campo"><label for="apn">Nome da prova</label><input class="cp-input" id="apn" value="${esc(s.perfil.provaNome || '')}" maxlength="30"></div></div>
        <div class="campo"><label>Ritmo</label><div class="seg">${[[2, 'Leve'], [3, 'Normal'], [5, 'Puxado']].map(([n, t]) => `<button data-ritmo="${n}" aria-pressed="${(s.perfil.ritmo || 3) === n}">${t} · ${n}</button>`).join('')}</div></div>
        <p class="muted">Mudar a data recalcula os intervalos das próximas revisões. O ritmo é quantas rodadas o jogo sugere por partida.</p></section>
      <section class="box"><h3>Acessibilidade</h3>
        ${tog('som', 'Sons', 'Proporcionais ao ganho real. Erro tem som neutro.')}
        ${tog('movimento', 'Animações', 'Desligue para uma tela estática.')}
        ${tog('contraste', 'Alto contraste', 'Textos secundários mais escuros.')}
        <div class="opcao"><div class="txt"><b>Tamanho do texto</b><span class="mono">${a.texto || 100}%</span></div><input type="range" min="90" max="130" step="10" value="${a.texto || 100}" data-aj="texto" aria-label="Tamanho do texto"></div>
        <div class="opcao"><div class="txt"><b>Tema</b><span>Tela escura pra estudar à noite.</span></div><select class="cp-input" style="width:auto;min-height:40px" data-aj="tema">${[['auto', 'Do sistema'], ['claro', 'Claro'], ['escuro', 'Escuro']].map(([v, n]) => `<option value="${v}" ${a.tema === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div></section>
      <section class="box"><h3>Seus dados</h3><p class="muted">Tudo fica neste aparelho. Sair custa o mesmo número de passos que entrar.</p>
        <button class="cp-btn secondary" data-a="exportar">Exportar meus dados</button>
        <label class="cp-btn secondary" style="cursor:pointer">Importar backup<input type="file" accept="application/json" data-a="importar" hidden></label>
        <button class="cp-btn perigo" data-a="apagar">Apagar tudo</button></section>
      <section class="box"><div class="entre"><h3>Demonstração</h3><span class="aviso-demo">apresentação</span></div>
        <p class="muted">Hoje no jogo: <b>${D.fmtData(D.hoje(), true)}</b>${D.getOffset() ? ` (+${D.getOffset()} dia${D.getOffset() > 1 ? 's' : ''} simulados)` : ''}. Avançar o tempo mostra as revisões vencendo.</p>
        <div class="linha"><button class="cp-btn secondary sm" data-a="dia">+1 dia</button><button class="cp-btn secondary sm" data-a="semana">+7 dias</button>${D.getOffset() ? '<button class="cp-btn ghost sm" data-a="real">Voltar ao dia real</button>' : ''}</div>
        <button class="cp-btn secondary" data-a="exemplo">Carregar perfil de exemplo</button></section>`,
      depois(el) {
        const perfil = () => { s.perfil.nome = el.querySelector('#an').value.trim() || s.perfil.nome; s.perfil.prova = el.querySelector('#ap').value || s.perfil.prova; s.perfil.provaNome = el.querySelector('#apn').value.trim(); A.salvar(); };
        el.querySelectorAll('#an,#apn').forEach(i => i.addEventListener('change', perfil));
        el.querySelector('#ap').addEventListener('change', () => { perfil(); A.toast('Intervalos recalculados.'); A.render(); });
        el.addEventListener('change', e => {
          const k = e.target.dataset.aj; if (!k) return;
          a[k] = e.target.type === 'checkbox' ? e.target.checked : k === 'texto' ? +e.target.value : e.target.value;
          A.salvar(); A.aplicarAjustes(); if (k === 'texto') A.render();
          if (k === 'som' && a.som) A.som(2);
        });
        el.addEventListener('click', async e => {
          const rt = e.target.closest('[data-ritmo]'); if (rt) { s.perfil.ritmo = +rt.dataset.ritmo; A.salvar(); return A.render(); }
          const b = e.target.closest('[data-a]'); if (!b || b.tagName === 'INPUT') return;
          const x = b.dataset.a;
          if (x === 'exportar') { E.exportar(s); A.toast('Arquivo baixado.'); }
          if (x === 'apagar' && await A.confirmar({ titulo: 'Apagar todos os dados?', texto: 'Perfil, histórico e conjuntos criados somem deste aparelho. Exporte antes se quiser guardar.', ok: 'Apagar tudo', perigo: true })) { A.trocar(E.apagar()); return A.ir('#/boas-vindas'); }
          if (x === 'dia' || x === 'semana') { s.offset = (s.offset || 0) + (x === 'dia' ? 1 : 7); A.trocar(s); A.toast(`Agora é ${D.fmtData(D.hoje(), true)}.`); A.render(); }
          if (x === 'real') { s.offset = 0; A.trocar(s); A.render(); }
          if (x === 'exemplo' && await A.confirmar({ titulo: 'Carregar o perfil de exemplo?', texto: 'Substitui os dados atuais por 3 semanas de uso simulado.', ok: 'Carregar' })) { A.trocar(E.exemplo(s.perfil.nome)); A.toast('Perfil de exemplo carregado.'); A.ir('#/aprender'); }
        });
        el.querySelector('[data-a=importar]').addEventListener('change', e => {
          const f = e.target.files[0]; if (!f) return;
          E.importar(f).then(n => { A.trocar(n); A.toast('Backup importado.'); A.ir('#/aprender'); }).catch(err => A.toast(err.message));
        });
      },
    };
  });

  /* =====================================================================
     BOAS-VINDAS (primeiro acesso, no estilo Duolingo)
     ===================================================================== */
  const bv = { passo: 0, nome: '', prova: '', provaNome: 'ENEM', conjuntos: [], ritmo: 3 };
  const TOTAL = 5;
  A.rota('boas-vindas', () => {
    if (!bv.prova) bv.prova = D.addDias(D.hoje(), 40);
    const fala = (expr, txt) => `<div class="fala">${A.capi(expr, null, 120)}<div class="balao">${txt}</div></div>`;
    let corpo = '', pe = '';
    if (bv.passo === 0) {
      return {
        titulo: 'Boas-vindas',
        html: `<section class="bv" style="justify-content:center;text-align:center;align-items:center;gap:14px">
          ${A.capi('comemora', null, 230)}${capiscoLogo({ size: 46, icon: false })}
          <p class="sub" style="max-width:400px">Estude jogando, com partidas que têm fim e revisões na hora certa. Sem sorte no meio.</p>
          <div class="pilha" style="width:100%;max-width:380px;margin-top:10px">
            <button class="cp-btn reward block" data-a="prox">Começar</button>
            <button class="cp-btn secondary block" data-a="exemplo">Ver com dados de exemplo</button>
            <label class="cp-btn ghost block" style="cursor:pointer">Tenho um backup<input type="file" accept="application/json" data-a="importar" hidden></label></div></section>`,
        depois(el) {
          el.querySelector('[data-a=prox]').addEventListener('click', () => { bv.passo = 1; A.render(); });
          el.querySelector('[data-a=exemplo]').addEventListener('click', () => { A.trocar(E.exemplo()); A.toast('Perfil de exemplo: 3 semanas de uso.'); A.ir('#/aprender'); });
          el.querySelector('[data-a=importar]').addEventListener('change', e => { const f = e.target.files[0]; if (f) E.importar(f).then(n => { A.trocar(n); A.ir('#/aprender'); }).catch(err => A.toast(err.message)); });
        },
      };
    }
    if (bv.passo === 1) {
      corpo = `${fala('feliz', 'Oi! Eu sou a Capi. Como posso te chamar?')}<input class="cp-input" id="nome" maxlength="24" autocomplete="given-name" value="${esc(bv.nome)}" placeholder="Seu nome ou apelido">`;
      pe = `<button class="cp-btn block" data-a="prox">Continuar</button>`;
    }
    if (bv.passo === 2) {
      const iv = R.intervalos({ perfil: { prova: bv.prova } });
      corpo = `${fala('pensando', `Beleza, ${esc(bv.nome)}! Pra quando você precisa lembrar de tudo?`)}
        <div class="pilha">${['ENEM', 'Vestibular', 'Prova da escola'].map(n => `<button class="escolha" data-prova="${n}" aria-pressed="${bv.provaNome === n}"><span class="e">${{ ENEM: '🎯', Vestibular: '🎓', 'Prova da escola': '📝' }[n]}</span>${n}</button>`).join('')}</div>
        <div class="campo"><label for="prova">Data</label><input class="cp-input" type="date" id="prova" min="${D.hoje()}" value="${esc(bv.prova)}"></div>
        <p class="muted">Faltam ${Math.max(7, D.diff(D.hoje(), bv.prova))} dias. Quanto mais longe a prova, mais espaçadas as revisões (a maior fica em ${iv[5]} dias).</p>`;
      pe = `<button class="cp-btn block" data-a="prox">Continuar</button>`;
    }
    if (bv.passo === 3) {
      corpo = `${fala('neutra', 'O que vamos estudar? Pode escolher mais de uma.')}
        <div class="pilha">${C.conteudo.map(cj => { const m = A.mat(cj.materia); return `<button class="escolha" data-cj="${cj.id}" style="--m:${m.c}" aria-pressed="${bv.conjuntos.includes(cj.id)}"><img src="${capi3dSrc('neutra', cj.materia)}" alt=""><span>${m.n}<small>${esc(cj.titulo)}</small></span></button>`; }).join('')}</div>`;
      pe = `<button class="cp-btn block" data-a="prox" ${bv.conjuntos.length ? '' : 'disabled'}>Continuar</button>`;
    }
    if (bv.passo === 4) {
      corpo = `${fala('feliz', 'Quanto você quer jogar por partida?')}
        <div class="pilha">${[[2, 'Leve', '2 rodadas · uns 5 min'], [3, 'Normal', '3 rodadas · uns 8 min'], [5, 'Puxado', '5 rodadas · uns 15 min']].map(([n, t, d]) => `<button class="escolha" data-ritmo="${n}" aria-pressed="${bv.ritmo === n}"><span class="e">${{ 2: '🌱', 3: '🌿', 5: '🌳' }[n]}</span><span>${t}<small>${d}</small></span></button>`).join('')}</div>
        <p class="muted">Toda partida tem fim. Dá pra mudar depois em Ajustes.</p>`;
      pe = `<button class="cp-btn block" data-a="prox">Continuar</button>`;
    }
    if (bv.passo === 5) {
      corpo = `${fala('comemora', 'Só quatro coisas pra saber:')}
        <div class="bullets">
          <div><span>🎯</span><p style="margin:0"><b>Você sabe o que ganha antes</b>Toque num tópico da trilha: ele mostra o objetivo e a recompensa. Sem sorteio.</p></div>
          <div><span>✍️</span><p style="margin:0"><b>Responde antes, entende depois</b>Tentar lembrar é o que fixa. A explicação vem logo em seguida.</p></div>
          <div><span>🔁</span><p style="margin:0"><b>Revisão na hora certa</b>Cada tópico volta quando está quase escapando da memória.</p></div>
          <div><span>🏆</span><p style="margin:0"><b>Cada unidade termina num Chefão</b>Venceu, ganha troféu e roupa nova pra Capi.</p></div></div>`;
      pe = `<button class="cp-btn reward block" data-a="fim">Bora pra primeira rodada</button>`;
    }
    return {
      titulo: 'Boas-vindas',
      html: `<section class="bv"><div class="linha" style="flex-wrap:nowrap"><button class="cp-btn ghost sm" data-a="ant" aria-label="Voltar" style="padding:0 8px">←</button><div class="barra-bv" style="flex:1"><i style="width:${(bv.passo / TOTAL) * 100}%"></i></div></div>
        <div class="corpo">${corpo}</div><div class="pe-bv">${pe}</div></section>`,
      depois(el) {
        const ler = () => {
          const n = el.querySelector('#nome'); if (n) bv.nome = n.value.trim();
          const p = el.querySelector('#prova'); if (p && p.value) bv.prova = p.value;
        };
        el.querySelector('#prova')?.addEventListener('change', () => { ler(); A.render(); });
        el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); el.querySelector('[data-a=prox]')?.click(); } });
        el.addEventListener('click', e => {
          const b = e.target.closest('[data-a],[data-cj],[data-prova],[data-ritmo]'); if (!b) return;
          ler();
          if (b.dataset.cj) { const i = bv.conjuntos.indexOf(b.dataset.cj); i < 0 ? bv.conjuntos.push(b.dataset.cj) : bv.conjuntos.splice(i, 1); return A.render(); }
          if (b.dataset.prova) { bv.provaNome = b.dataset.prova; return A.render(); }
          if (b.dataset.ritmo) { bv.ritmo = +b.dataset.ritmo; return A.render(); }
          const a = b.dataset.a;
          if (a === 'ant') bv.passo = Math.max(0, bv.passo - 1);
          if (a === 'prox') { if (bv.passo === 1 && !bv.nome) { el.querySelector('#nome').focus(); return A.toast('Escreve um nome, pode ser apelido.'); } bv.passo++; }
          if (a === 'fim') {
            const s = E.vazio();
            s.perfil = { nome: bv.nome, prova: bv.prova, provaNome: bv.provaNome, criado: D.hoje(), ritmo: bv.ritmo };
            s.conjuntosAtivos = bv.conjuntos.slice();
            s.cjAtual = bv.conjuntos[0];
            s.ajustes = st().ajustes;
            A.trocar(s);
            bv.passo = 0;
            A._abrirNo = R.idx().conjuntos[s.cjAtual].topicos[0].id;
            return A.ir('#/aprender');
          }
          A.render();
        });
        el.querySelector('input:not([type=file])')?.focus();
      },
    };
  }, { foco: true });
})();
