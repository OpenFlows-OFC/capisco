/* =========================================================
   CAPISCO · Lição (tentativa → resultado → fim de rodada)
   e fim de partida (resumo → recompensas → pronto por hoje)
   ========================================================= */
(function () {
  const C = window.CAPISCO, R = C.regras, D = R.datas, A = C.app;
  const esc = A.esc, st = () => A.st();
  let ui = {};
  const FALA = { ok: 'Capiscou!', quase: 'Quase!', erro: 'Ainda não.' };
  const EXPR = { ok: 'feliz', quase: 'quase', erro: 'pensando' };
  const INST = { mc: 'Escolha a resposta certa', multi: 'Marque todas as certas', aberta: 'Responda com suas palavras', cartao: 'Tente lembrar antes de virar' };
  const fmtDe = item => (item.tipo === 'transfer' ? item.formato : item.tipo);

  /* ---------------- cabeçalho: sair + rodadas da partida ---------------- */
  const topo = ss => `<div class="l-topo"><button class="sair" data-a="sair" aria-label="Sair da partida">✕</button>
    <div class="rodadas" aria-label="Rodada ${ss.i + 1} de ${ss.itens.length}">${ss.itens.map((_, k) => `<i class="${k < ss.i ? 'feita' : k === ss.i ? 'agora' : ''}"></i>`).join('')}</div></div>`;

  /* ---------------- corpo da questão (fica visível no resultado) ---------------- */
  function corpo(ss, T, item, travado) {
    const f = fmtDe(item), m = A.mat(T.materia), av = travado && ss.ultimo ? ss.ultimo.aval : null;
    let h = `<span class="l-onde" style="--m:${m.c}">${m.e} ${esc(T.chefe ? 'Chefão · ' + R.idx().conjuntos[T.conjunto].titulo : T.nome)}</span>`;
    if (item.tipo === 'transfer') h += `<div class="contexto">${esc(item.contexto)}</div>`;
    h += `<p class="l-inst">${item.tipo === 'transfer' ? 'Situação nova · ' : ''}${INST[f]}</p>`;
    if (f === 'mc' || f === 'multi') {
      const multi = f === 'multi';
      h += `<p class="l-enun">${esc(item.enunciado)}</p><div class="opcoes" role="${multi ? 'group' : 'radiogroup'}">${item.opcoes.map((o, k) => {
        const marc = multi ? (ui.marc || []).includes(k) : ui.sel === k;
        let cls = '';
        if (av) cls = o.ok ? 'certa' : marc ? 'errada' : '';
        return `<button class="cp-opt ${cls}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${marc}" data-op="${k}" ${av ? 'disabled' : ''}><span class="key">${k + 1}</span>${esc(o.t)}</button>`;
      }).join('')}</div>`;
    } else if (f === 'aberta') {
      h += `<p class="l-enun">${esc(item.enunciado)}</p><textarea class="cp-input" id="aberta" rows="3" maxlength="400" placeholder="Uma frase basta." ${av ? 'readonly' : ''}>${esc(ui.texto || '')}</textarea>`;
    } else if (f === 'cartao') {
      h += `<div class="cartao"><p class="l-enun">${esc(item.frente)}</p>${ui.virado ? '' : '<p class="muted">Falar em voz alta ajuda.</p>'}</div>`;
      if (ui.virado) h += `<div class="cartao verso cp-anim-pop"><p>${esc(item.verso)}</p></div>`;
    }
    return `<section class="l-corpo">${h}</section>`;
  }

  /* ---------------- rodapé: verificar / conferir / resultado ---------------- */
  function rodape(ss, T, item) {
    const f = fmtDe(item);
    if (ss.fase === 'tentativa') {
      if (f === 'cartao') return `<div class="pe"><div class="in">${ui.virado
        ? '<span class="muted" style="text-align:center">Comparando com o verso, você lembrou…</span><div class="auto"><button class="cp-btn secondary" data-auto="nada">Não lembrei</button><button class="cp-btn secondary" data-auto="parte">Em parte</button><button class="cp-btn" data-auto="tudo">Tudo</button></div>'
        : '<div class="acoes"><button class="cp-btn" data-a="virar">Virar cartão</button></div>'}</div></div>`;
      const pronto = f === 'multi' ? (ui.marc || []).length > 0 : f === 'aberta' ? (ui.texto || '').trim().length >= 3 : ui.sel !== undefined;
      return `<div class="pe"><div class="in"><div class="acoes"><button class="cp-btn" data-a="verificar" ${pronto ? '' : 'disabled'}>Verificar</button></div></div></div>`;
    }
    if (ss.fase === 'conferir') return `<div class="pe conferir"><div class="in">
      <div class="res"><div class="txt"><h3 style="color:var(--ceu-600)">Antes do resultado</h3><p>Em questões de aplicação, conferir o próprio caminho fixa mais do que ser corrigido. Marque os passos que você fez:</p>
      <div class="passos-conf">${item.passos.map((p, k) => `<label><input type="checkbox" data-passo="${k}">${esc(p)}</label>`).join('')}</div></div></div>
      <div class="acoes"><button class="cp-btn" data-a="resultado">Ver resultado</button></div></div></div>`;
    // resultado em três camadas
    const u = ss.ultimo, av = u.aval, res = av.res;
    let det = '';
    if (f === 'mc') {
      const certa = item.opcoes.find(o => o.ok);
      det = res === 'ok' ? '' : `<p>${av.erroOpcao ? `Essa alternativa pega quem ${esc(av.erroOpcao.charAt(0).toLowerCase() + av.erroOpcao.slice(1))}. ` : ''}A certa é: <b>${esc(certa.t)}</b></p>`;
    } else if (f === 'multi') {
      det = res === 'ok' ? '' : `<div class="etapas">${av.etapas.filter(e => !e.certo).map(e => `<div class="cp-step miss">${esc(e.t)} <span class="muted">${e.ok ? '(era certa e ficou de fora)' : '(não era: ' + esc(e.erro || 'não se aplica') + ')'}</span></div>`).join('')}</div>`;
    } else if (f === 'aberta') {
      det = `<div class="etapas">${av.criterios.map(c => `<div class="cp-step ${c.ok ? 'ok' : 'miss'}">${esc(c.rotulo)}</div>`).join('')}</div>${res === 'ok' ? '' : `<p>Resposta-modelo: <b>${esc(item.modelo)}</b></p>`}`;
    } else if (f === 'cartao') {
      det = res === 'ok' ? '' : '<p>Vale reler o verso com calma.</p>';
    }
    const crit = R.criterioDe(ss.rodada.id), seq = Math.min(ss.rodada.sequencia, crit);
    const prox = u.out.fim ? (u.out.venceu ? 'Critério de domínio atingido: a rodada fecha agora.' : `Teto de ${R.tetoDe(ss.rodada.id)} tentativas: a rodada fecha agora.`) : R.regulacao(st(), ss.rodada, res);
    return `<div class="pe ${res}"><div class="in">
      <div class="res" aria-live="polite">${A.capi(EXPR[res], T.materia, 60)}<div class="txt"><h3>${FALA[res]}</h3>${det}
        <details ${res === 'ok' ? '' : 'open'}><summary>Por quê?</summary><p>${esc(item.explicacao)}</p>${item.trecho ? `<div class="cp-source">"${esc(item.trecho)}"<cite>${esc(R.topico(item.topico).fonte || 'Material de origem')}</cite></div>` : ''}</details>
        <span class="prox">Sequência ${A.num(seq)} de ${A.num(crit)} · ${esc(prox)}</span></div></div>
      <div class="acoes"><button class="cp-btn" data-a="continuar" disabled>Continuar</button></div></div></div>`;
  }

  /* ---------------- fim de rodada ---------------- */
  function fimRodada(ss, T) {
    const f = ss.fechamentos[ss.fechamentos.length - 1];
    const ultima = ss.i >= ss.itens.length - 1;
    const botao = `<div class="pe"><div class="in"><div class="acoes"><button class="cp-btn ${ultima ? 'reward' : ''}" data-a="seguir">${ultima ? 'Ver resultado da partida' : 'Continuar'}</button></div></div></div>`;
    const cj = R.idx().conjuntos[T.conjunto];
    let h;
    if (f.chefe && f.venceu) h = `${A.capi('comemora', T.materia, 210)}<h1 class="ok">Chefão vencido!</h1><p class="sub">${esc(cj.titulo)} está concluída. 🏆</p>${f.roupa ? `<p class="sub">E a Capi ganhou a roupa de ${A.mat(f.roupa).n}.</p>` : ''}<p class="regra-mini">${esc(f.regra)}</p>`;
    else if (f.chefe) h = `${A.capi('pensando', T.materia, 190)}<h1>O Chefão ganhou essa.</h1><p class="sub">${f.revisar && f.revisar.length ? `${esc(A.lista(f.revisar.map(id => R.topico(id).nome)))} ${f.revisar.length > 1 ? 'entram' : 'entra'} na revisão de hoje.` : ''}</p><p class="regra-mini">${esc(f.regra)}</p>`;
    else if (f.venceu && f.extra) h = `${A.capi('feliz', T.materia, 200)}<h1 class="ok">Treino concluído!</h1><p class="sub">${esc(T.nome)} em ${A.plural(f.tentativas, 'tentativa', 'tentativas')}.</p><p class="regra-mini">${esc(f.regra)}</p>`;
    else if (f.venceu) h = `${A.capi('comemora', T.materia, 210)}<h1 class="ok">Rodada vencida!</h1><p class="sub">${esc(T.nome)} em ${A.plural(f.tentativas, 'tentativa', 'tentativas')}.</p>
      <div class="caixa-salto" aria-label="caixa ${f.caixaAntes} para ${f.caixaDepois}">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= f.caixaDepois ? 'on' : ''} ${k > f.caixaAntes && k <= f.caixaDepois ? 'novo' : ''}"></i>`).join('')}</div>
      <span class="caixa-legenda">caixa ${f.caixaAntes} → ${f.caixaDepois}${f.proxima ? ` · volta ${D.fmtData(f.proxima, true)}` : ''}</span>
      ${f.liberou.length || f.chefeLiberado ? `<div class="linha" style="justify-content:center">${f.liberou.map(id => `<span class="st novo"><i>✦</i>Liberou ${esc(R.topico(id).nome)}</span>`).join('')}${f.chefeLiberado ? '<span class="st consolidado"><i>🏆</i>Chefão liberado</span>' : ''}</div>` : ''}
      <p class="regra-mini">${esc(f.regra)}</p>`;
    else h = `${A.capi('pensando', T.materia, 190)}<h1>Essa pediu base.</h1><p class="sub">${esc(T.nome)} chegou ao teto de ${R.P.teto} tentativas. Não é fracasso: falta consolidar o que vem antes.</p><p class="regra-mini">${esc(f.regra)}</p>${f.redireciona && ss.inserida ? `<p class="sub">A próxima rodada virou <b>${esc(R.topico(f.redireciona).nome)}</b>.</p>` : ''}`;
    return `<section class="cheia">${h}</section>${botao}`;
  }

  function finalizar(s) {
    const ss = s.sessao;
    ss.fim = Date.now();
    const venc = ss.fechamentos.filter(f => f.venceu).length;
    s.sessoes = s.sessoes || [];
    s.sessoes.push({ dia: ss.dia, inicio: ss.inicio, fim: ss.fim, rodadas: ss.itens.length, vencidas: venc, completa: !ss.abandonada });
    s.ultimaPartida = { inicio: ss.inicio, fim: ss.fim, itens: ss.itens, fechamentos: ss.fechamentos, anunciado: ss.anunciado || [], contagem: ss.contagem || {}, abandonada: !!ss.abandonada };
    delete s.sessao;
    A.salvar();
  }

  /* =====================================================================
     LIÇÃO
     ===================================================================== */
  A.rota('licao', () => {
    const s = st(), ss = s.sessao;
    if (!ss) return { html: '', depois: () => location.replace('#/aprender') };
    const T = R.topico(ss.rodada.id);
    if (ss.fase === 'tentativa' && !ss.itemId) { ss.itemId = R.escolherItem(s, ss.rodada.id, ss.rodada).item.id; ui = {}; A.salvar(); }
    const item = R.idx().itens[ss.itemId];
    if (ss.fase === 'retorno' && ss.ultimo) Object.assign(ui, ss.ultimo.ui || {});
    const html = ss.fase === 'fimRodada'
      ? `<div class="licao">${topo(ss)}${fimRodada(ss, T)}</div>`
      : `<div class="licao">${topo(ss)}${corpo(ss, T, item, ss.fase === 'retorno')}${rodape(ss, T, item)}</div>`;
    return {
      titulo: 'Partida',
      html,
      depois(el) {
        const aplicar = () => {
          const out = R.registrar(s, ss.rodada, item, ss.pendente.aval);
          ss.contagem = ss.contagem || { ok: 0, quase: 0, erro: 0 };
          ss.contagem[ss.pendente.aval.res]++;
          ss.ultimo = Object.assign(ss.pendente, { out, ui: { sel: ui.sel, marc: ui.marc, texto: ui.texto, virado: ui.virado } });
          delete ss.pendente;
          ss.fase = 'retorno';
          A.som({ ok: 2, quase: 1, erro: 0 }[ss.ultimo.aval.res]);
          A.salvar(); A.render();
        };
        const verificar = () => {
          const f = fmtDe(item);
          const resp = f === 'mc' ? ui.sel : f === 'multi' ? ui.marc : f === 'aberta' ? ui.texto : ui.auto;
          ss.pendente = { resp, aval: R.avaliar(item, resp) };
          if (item.tipo === 'transfer') { ss.fase = 'conferir'; A.salvar(); return A.render(); }
          aplicar();
        };
        const seguir = () => {
          if (ss.fase === 'retorno') {
            if (ss.ultimo.out.fim) {
              const f = R.fecharRodada(s, ss.rodada);
              ss.fechamentos.push(Object.assign(f, { nome: T.nome }));
              ss.inserida = false;
              if (!f.venceu && f.redireciona && !ss.itens.slice(ss.i + 1).some(x => x.id === f.redireciona)) {
                ss.itens.splice(ss.i + 1, 0, { id: f.redireciona, tipo: (s.topicos[f.redireciona] || {}).caixa ? 'revisao' : 'pratica', motivo: 'base' });
                ss.inserida = true;
              }
              ss.fase = 'fimRodada';
              if (f.venceu) {
                A.som(f.caixaDepois > f.caixaAntes || f.chefe ? 3 : 2);
                setTimeout(() => { if (location.hash !== '#/licao') return; A.som(4); A.confete(); }, 450);
              } else A.som(0);
            } else { ss.fase = 'tentativa'; ss.itemId = null; }
          } else if (ss.fase === 'fimRodada') {
            if (ss.i >= ss.itens.length - 1) { finalizar(s); return A.ir('#/fim'); }
            ss.i++;
            const prox = ss.itens[ss.i];
            ss.rodada = R.novaRodada(s, prox.id, prox.tipo);
            ss.fase = 'tentativa'; ss.itemId = null;
          }
          A.salvar(); A.render();
        };
        el.addEventListener('click', async e => {
          const b = e.target.closest('[data-op],[data-a],[data-auto]'); if (!b || b.disabled) return;
          if (b.dataset.op !== undefined) {
            const k = +b.dataset.op;
            if (fmtDe(item) === 'multi') { ui.marc = ui.marc || []; const i = ui.marc.indexOf(k); i < 0 ? ui.marc.push(k) : ui.marc.splice(i, 1); } else ui.sel = k;
            return A.render();
          }
          if (b.dataset.auto) { ui.auto = b.dataset.auto; return verificar(); }
          const a = b.dataset.a;
          if (a === 'virar') { ui.virado = true; return A.render(); }
          if (a === 'verificar') return verificar();
          if (a === 'resultado') { ss.pendente.passos = [...el.querySelectorAll('[data-passo]:checked')].map(x => +x.dataset.passo); return aplicar(); }
          if (a === 'continuar' || a === 'seguir') return seguir();
          if (a === 'sair') {
            const ok = await A.confirmar({ titulo: 'Sair da partida?', texto: 'O que você já respondeu fica no histórico. As rodadas que faltam voltam pra fila.', ok: 'Continuar jogando', cancelar: 'Sair' });
            if (ok !== false) return; // só sai com o toque explícito em "Sair"
            ss.abandonada = true; finalizar(s); A.ir('#/fim');
          }
        });
        const ta = el.querySelector('#aberta:not([readonly])');
        if (ta) {
          ta.addEventListener('input', () => { ui.texto = ta.value; el.querySelector('[data-a=verificar]').disabled = ta.value.trim().length < 3; });
          ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
        }
        const cont = el.querySelector('[data-a=continuar]');
        if (cont) setTimeout(() => { cont.disabled = false; cont.focus({ preventScroll: true }); }, R.P.deliberacao);
        el.querySelector('[data-a=seguir]')?.focus({ preventScroll: true });
        const tecla = e => {
          if (document.querySelector('.modal-fundo')) return;
          if (e.target.matches('textarea') && e.key !== 'Enter') return;
          if (/^[1-5]$/.test(e.key) && !e.target.matches('textarea')) el.querySelector(`[data-op="${+e.key - 1}"]:not([disabled])`)?.click();
          if (e.key === 'Enter' && !e.shiftKey) {
            const btn = el.querySelector('[data-a=verificar]:not([disabled]),[data-a=continuar]:not([disabled]),[data-a=seguir],[data-a=resultado],[data-a=virar]');
            if (btn) { e.preventDefault(); btn.click(); }
          }
        };
        A._tecla = tecla;
        document.addEventListener('keydown', tecla);
      },
    };
  }, { foco: true });

  /* =====================================================================
     FIM DE PARTIDA: resumo → recompensas → pronto por hoje (Pilar VII)
     ===================================================================== */
  function premios(s, up) {
    const out = [];
    const venceu = id => up.fechamentos.some(f => f.id === id && f.venceu);
    const vistos = new Set();
    for (const x of up.anunciado) {
      let ok = false, ico = '⭐', texto = A.textoRecompensa(x);
      if (x.tipo === 'caixa') { ok = venceu(x.id); ico = '📦'; const f = up.fechamentos.find(f => f.id === x.id && f.venceu); if (f) texto = `<b>${esc(R.topico(x.id).nome)}</b> ${f.caixaAntes ? `subiu da caixa ${f.caixaAntes} para a ${f.caixaDepois}` : 'entrou na caixa 1'}`; vistos.add(x.id); }
      if (x.tipo === 'libera') { ok = R.estado(s, x.id) !== 'bloqueado'; ico = '🔓'; }
      if (x.tipo === 'chefe') { ok = R.chefeEstado(s, x.conjunto) !== 'bloqueado'; ico = '🏆'; }
      if (x.tipo === 'trofeu') { ok = !!(s.chefes || {})[x.conjunto]; ico = '🏆'; }
      if (x.tipo === 'roupa') { ok = (s.roupas || []).includes(x.materia); ico = `<img src="${capi3dSrc('feliz', ok ? x.materia : 'nenhuma')}" alt="">`; }
      out.push({ ok, ico, texto });
    }
    for (const f of up.fechamentos) if (!f.chefe && !vistos.has(f.id) && f.venceu && f.caixaDepois > f.caixaAntes) out.push({ ok: true, ico: '📦', texto: `<b>${esc(R.topico(f.id).nome)}</b> subiu da caixa ${f.caixaAntes} para a ${f.caixaDepois}` });
    for (const f of up.fechamentos) for (const id of f.liberou || []) if (!up.anunciado.some(x => x.tipo === 'libera' && x.id === id)) out.push({ ok: true, ico: '🔓', texto: `Libera <b>${esc(R.topico(id).nome)}</b>` });
    return out;
  }

  A.rota('fim', r => {
    const s = st(), up = s.ultimaPartida;
    if (!up) return { html: '', depois: () => location.replace('#/aprender') };
    document.querySelectorAll('.confete').forEach(c => c.remove());
    const etapa = r.args[0] || 'resumo';
    const mat = R.topico(up.itens[up.itens.length - 1].id).materia;
    const pr = premios(s, up);
    if (etapa === 'resumo') {
      const venc = up.fechamentos.filter(f => f.venceu).length, c = up.contagem || {};
      const total = (c.ok || 0) + (c.quase || 0) + (c.erro || 0);
      const prec = total ? Math.round(((c.ok || 0) + (c.quase || 0) * .5) / total * 100) : 0;
      const seg = Math.round((up.fim - up.inicio) / 1000);
      return {
        titulo: 'Partida concluída',
        html: `<div class="licao"><section class="cheia">${A.capi(venc ? 'comemora' : 'pensando', mat, 210)}
          <h1 class="${venc ? 'ok' : ''}">${up.abandonada ? 'Partida interrompida' : venc === up.fechamentos.length ? 'Partida concluída!' : 'Partida encerrada'}</h1>
          <div class="tiles"><div class="tile" style="--c:var(--reward)"><span>Rodadas</span><b>${venc}/${up.fechamentos.length || up.itens.length}</b></div>
            <div class="tile" style="--c:var(--brand)"><span>Precisão</span><b>${prec}%</b></div>
            <div class="tile" style="--c:var(--sched)"><span>Tempo</span><b>${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}</b></div></div>
          <p class="regra-mini">Precisão conta acerto parcial como meio. ${A.plural(total, 'resposta', 'respostas')} nesta partida.</p></section>
          <div class="pe"><div class="in"><div class="acoes"><a class="cp-btn" href="#/fim/${pr.length ? 'premios' : 'tchau'}">Continuar</a></div></div></div></div>`,
      };
    }
    if (etapa === 'premios') {
      return {
        titulo: 'Recompensas',
        html: `<div class="licao"><section class="cheia" style="justify-content:flex-start;padding-top:40px">
          <h1>Recompensas</h1><p class="sub">O que foi anunciado antes de começar, conferido item por item.</p>
          <div class="premios">${pr.map((p, i) => `<div class="premio" style="animation-delay:${i * 90}ms;${p.ok ? '' : 'opacity:.55'}"><span class="ico">${p.ico}</span><span style="flex:1"><span class="tx">${p.texto}</span><small>${p.ok ? 'Entregue' : 'Ficou pra próxima: a rodada não foi vencida'}</small></span>${p.ok ? '<span class="st consolidado"><i>✓</i>ok</span>' : ''}</div>`).join('')}</div></section>
          <div class="pe"><div class="in"><div class="acoes"><a class="cp-btn" href="#/fim/tchau">Continuar</a></div></div></div></div>`,
        depois() { if (pr.some(p => p.ok)) A.som(3); },
      };
    }
    // Pilar VII: tela visualmente descontínua, sem continuação imediata
    A.silencio();
    const prox = R.proximaRevisao(s);
    const noDia = prox ? R.topicosAtivos(s).filter(id => (s.topicos[id] || {}).proxima === prox) : [];
    return {
      titulo: 'Pronto por hoje',
      html: `<section class="encerra">${A.capiFav('dormindo', 200)}<h1>Pronto por hoje.</h1>
        ${prox ? `<div class="prox"><span>Próxima revisão</span><b>${D.fmtData(prox, true)}</b><p>${esc(A.lista(noDia.slice(0, 3).map(id => R.topico(id).nome)))}${noDia.length > 3 ? ` e mais ${noDia.length - 3}` : ''}. Te vejo lá.</p></div>` : ''}
        <a class="cp-btn secondary block" href="#/aprender" data-a="sair">Voltar ao início</a>
        <p class="nota">Não tem "só mais uma" aqui, de propósito. Se quiser estudar mais, monte uma partida nova: é uma decisão sua, com objetivo novo.</p></section>`,
      depois(el) {
        document.body.classList.add('fim');
        el.querySelector('[data-a=sair]').addEventListener('click', () => { delete s.ultimaPartida; A.salvar(); });
      },
    };
  }, { foco: true });
})();
