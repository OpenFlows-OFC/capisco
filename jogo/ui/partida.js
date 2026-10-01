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
  const INST = { mc: 'Escolha a resposta certa', multi: 'Marque todas as certas', aberta: 'Responda com suas palavras' };
  const fmtDe = item => (item.tipo === 'transfer' ? item.formato : item.tipo);
  // checagem de raciocínio antes do resultado: genérica de propósito (os passos da resolução entregariam a resposta)
  const CHECA = ['Separei os dados que a situação dá', 'Identifiquei o conceito ou a fórmula que resolve', 'Conferi se a resposta faz sentido (unidade, ordem de grandeza, contexto)'];
  const nomeT = id => esc((R.topico(id) || { nome: '—' }).nome);
  const niv = k => `nível ${k} (${R.NIVEL[k] || ''})`;

  // ordem das alternativas embaralhada de forma determinística (mesma questão, mesma partida, mesma ordem);
  // evita decorar a posição da resposta sem introduzir sorteio
  function ordem(ss, item) {
    if (ss.ordem && ss.ordem.item === item.id) return ss.ordem.k;
    let x = R.hash(item.id + ':' + ss.inicio + ':' + ss.rodada.tentativas) || 1;
    const k = item.opcoes.map((_, i) => i);
    for (let i = k.length - 1; i > 0; i--) { x = (x * 1103515245 + 12345) >>> 0; const j = x % (i + 1); [k[i], k[j]] = [k[j], k[i]]; }
    ss.ordem = { item: item.id, k };
    return k;
  }

  /* mini-mapa da unidade: um quadradinho por tópico, na cor do estado */
  A.miniMapa = cjId => {
    const cj = R.idx().conjuntos[cjId];
    if (!cj) return '';
    const s = st();
    return `<div class="mini-mapa" aria-label="Mapa de ${esc(cj.titulo)}">${cj.topicos.map(t => { const e = R.estado(s, t.id); return `<i class="${e}" title="${esc(t.nome)}: ${R.ROTULO[e]}"></i>`; }).join('')}<i class="chefe ${R.chefeEstado(s, cjId)}" title="Chefão">${A.ic('trofeu', 12, 2.6)}</i></div>`;
  };

  /* ---------------- cabeçalho: sair + rodadas da partida + tentativa ---------------- */
  const topo = ss => {
    const teto = R.tetoDe(ss.rodada.id), n = Math.min(teto, ss.rodada.tentativas + (ss.fase === 'tentativa' || ss.fase === 'conferir' ? 1 : 0));
    return `<div class="l-topo"><button class="sair" data-a="sair" aria-label="Sair da partida">${A.ic('fechar', 26, 2.8)}</button>
    <div class="rodadas" aria-label="Rodada ${ss.i + 1} de ${ss.itens.length}">${ss.itens.map((_, k) => `<i class="${k < ss.i ? 'feita' : k === ss.i ? 'agora' : ''}" ${k === ss.i ? `style="--p:${n / teto}"` : ''}></i>`).join('')}</div>
    ${ss.fase === 'fimRodada' ? '' : `<span class="tent mono" aria-label="Tentativa ${n} de no máximo ${teto}">${n}/${teto}</span>`}</div>`;
  };

  /* ---------------- corpo da questão (fica visível no resultado) ---------------- */
  function corpo(ss, T, item, travado) {
    const f = fmtDe(item), m = A.mat(T.materia), av = travado && ss.ultimo ? ss.ultimo.aval : null;
    let h = `<span class="l-onde" style="--m:${m.c}">${m.e} ${esc(T.chefe ? 'Chefão · ' + R.idx().conjuntos[T.conjunto].titulo : T.nome)}</span>`;
    if (item.tipo === 'transfer') h += `<div class="contexto">${esc(item.contexto)}</div>`;
    h += `<p class="l-inst">${item.tipo === 'transfer' ? 'Situação nova · ' : ''}${INST[f] || ''}</p>`;
    if (f === 'mc' || f === 'multi') {
      const multi = f === 'multi';
      h += `<p class="l-enun">${esc(item.enunciado)}</p><div class="opcoes" role="${multi ? 'group' : 'radiogroup'}">${ordem(ss, item).map((k, pos) => {
        const o = item.opcoes[k];
        const marc = multi ? (ui.marc || []).includes(k) : ui.sel === k;
        let cls = '', marca = '';
        if (av) {
          if (o.ok) { cls = 'certa'; marca = `<span class="marca" aria-label="certa">${A.ic('check', 18, 3.2)}</span>`; }
          else if (marc) { cls = 'errada'; marca = `<span class="marca" aria-label="sua escolha">${A.ic('fechar', 18, 3.2)}</span>`; }
        }
        return `<button class="cp-opt ${cls}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${marc}" data-op="${k}" ${av ? 'disabled' : ''}><span class="key">${pos + 1}</span><span class="t">${esc(o.t)}</span>${marca}</button>`;
      }).join('')}</div>`;
    } else if (f === 'aberta') {
      h += `<p class="l-enun">${esc(item.enunciado)}</p><textarea class="cp-input" id="aberta" rows="3" maxlength="400" placeholder="Uma frase basta." aria-label="Sua resposta" ${av ? 'readonly' : ''}>${esc(ui.texto || '')}</textarea>`;
    }
    return `<section class="l-corpo">${h}</section>`;
  }

  /* ---------------- rodapé: verificar / revisar o caminho / resultado ---------------- */
  const pronto = (item) => {
    const f = fmtDe(item);
    return f === 'multi' ? (ui.marc || []).length > 0 : f === 'aberta' ? (ui.texto || '').trim().length >= 3 : ui.sel !== undefined;
  };
  function rodape(ss, T, item) {
    if (ss.fase === 'tentativa') return `<div class="pe"><div class="in"><div class="acoes"><button class="cp-btn" data-a="verificar" ${pronto(item) ? '' : 'disabled'}>Verificar</button></div></div></div>`;
    // situação nova: antes do resultado, o aluno confere o próprio raciocínio e ainda pode mudar a resposta (autocorreção)
    if (ss.fase === 'conferir') return `<div class="pe conferir"><div class="in">
      <div class="res"><div class="txt"><h3 style="color:var(--ceu-600)">Revise seu caminho</h3><p>Antes de ver o resultado, refaça de cabeça e marque o que você fez. Se faltou algo, ainda dá pra mudar a resposta.</p>
      <div class="passos-conf">${CHECA.map((p, k) => `<label><input type="checkbox" data-passo="${k}" ${(ui.passos || []).includes(k) ? 'checked' : ''}>${esc(p)}</label>`).join('')}</div></div></div>
      <div class="acoes"><button class="cp-btn" data-a="resultado" ${pronto(item) ? '' : 'disabled'}>Ver resultado</button></div></div></div>`;
    // resultado em três camadas: verificação, elaboração (o porquê) e regulação (o que vem agora)
    const f = fmtDe(item), u = ss.ultimo, av = u.aval, res = av.res;
    let det = '';
    if (f === 'mc') {
      const certa = item.opcoes.find(o => o.ok);
      det = res === 'ok' ? '' : `<p>${av.erroOpcao ? `Essa alternativa pega quem ${esc(av.erroOpcao.charAt(0).toLowerCase() + av.erroOpcao.slice(1).replace(/[.\s]+$/, ''))}. ` : ''}A certa é: <b>${esc(certa.t)}</b></p>`;
    } else if (f === 'multi') {
      det = `<div class="etapas">${av.etapas.map(e => `<div class="cp-step ${e.certo ? 'ok' : 'miss'}">${esc(e.t)} <span class="muted">${e.ok ? (e.marcada ? '(certa, você marcou)' : '(era certa e ficou de fora)') : e.marcada ? '(não era: ' + esc(e.erro || 'não se aplica') + ')' : '(não era, e ficou de fora)'}</span></div>`).join('')}</div>`;
    } else if (f === 'aberta') {
      det = `${av.copia ? '<p>A resposta repete o enunciado: precisa trazer algo seu.</p>' : ''}<div class="etapas">${av.criterios.map(c => `<div class="cp-step ${c.ok ? 'ok' : 'miss'}">${esc(c.rotulo)}</div>`).join('')}</div>${res === 'ok' ? '' : `<p>Resposta-modelo: <b>${esc(item.modelo)}</b></p>`}`;
    }
    if (item.passos && item.passos.length) det += `<p class="l-inst" style="margin:8px 0 2px">Resolução passo a passo</p><ol class="resolucao">${item.passos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>${u.passos ? `<p class="muted" style="margin:0">Na sua conferência: ${u.passos.length} de ${CHECA.length} itens marcados.</p>` : ''}`;
    const crit = R.criterioDe(ss.rodada.id), seq = Math.min(ss.rodada.sequencia, crit);
    const prox = u.out.fim ? (u.out.venceu ? 'Critério de domínio atingido: a rodada fecha agora.' : `Teto de ${R.tetoDe(ss.rodada.id)} tentativas: a rodada fecha agora.`) : R.regulacao(st(), ss.rodada, res);
    const espera = R.pausa(item);
    return `<div class="pe ${res}"><div class="in">
      <div class="res" aria-live="polite">${A.capi(EXPR[res], T.materia, 60)}<div class="txt"><h3>${FALA[res]}</h3>${det}
        <div class="porque"><b>Por quê</b><p>${esc(item.explicacao)}</p>${item.trecho ? `<div class="cp-source">"${esc(item.trecho)}"<cite>${esc(R.topico(item.topico).fonte || 'Material de origem')}</cite></div>` : ''}</div>
        <span class="prox">Domínio ${A.num(seq)} de ${A.num(crit)} · ${esc(prox)}</span></div></div>
      <div class="acoes"><button class="cp-btn espera" data-a="continuar" disabled style="--t:${espera}ms" aria-label="Continuar (libera depois de ler)">Continuar</button></div></div></div>`;
  }

  /* ---------------- fim de rodada: intensidade pelo ganho real ---------------- */
  function fimRodada(ss, T) {
    const f = ss.fechamentos[ss.fechamentos.length - 1];
    const ultima = ss.i >= ss.itens.length - 1;
    const botao = `<div class="pe"><div class="in"><div class="acoes"><button class="cp-btn ${ultima ? 'reward' : ''}" data-a="seguir">${ultima ? 'Ver resultado da partida' : 'Continuar'}</button></div></div></div>`;
    const cj = R.idx().conjuntos[T.conjunto];
    const niveis = `<div class="caixa-salto" aria-label="nível ${f.caixaAntes} para ${f.caixaDepois}">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= f.caixaDepois ? 'on' : ''} ${k > f.caixaAntes && k <= f.caixaDepois ? 'novo' : ''}"></i>`).join('')}</div>
      <span class="caixa-legenda">${f.caixaAntes === f.caixaDepois ? `continua no ${niv(f.caixaDepois)}` : f.caixaAntes ? `${niv(f.caixaAntes)} → ${niv(f.caixaDepois)}` : `entrou no ${niv(f.caixaDepois)}`}${f.proxima ? ` · volta ${D.fmtData(f.proxima, true)}` : ''}</span>`;
    const libs = f.liberou.length || f.chefeLiberado ? `<div class="linha" style="justify-content:center">${f.liberou.map(id => `<span class="st novo"><i>${A.ic('aberto', 12, 3)}</i>Liberou ${nomeT(id)}</span>`).join('')}${f.chefeLiberado ? `<span class="st consolidado"><i>${A.ic('trofeu', 12, 2.6)}</i>Chefão liberado</span>` : ''}</div>` : '';
    const regra = `<p class="regra-mini">${esc(f.regra)}</p>`;
    let h;
    if (f.chefe && f.venceu && f.ganho === 'chefe') h = `${A.capi('comemora', T.materia, 210)}<h1 class="ok">Chefão vencido!</h1><p class="sub">${esc(cj.titulo)} está concluída.</p>${f.roupa ? `<p class="sub">E a Capi ganhou a roupa de ${esc(A.mat(f.roupa).n)}.</p>` : ''}${regra}`;
    else if (f.chefe && f.venceu) h = `${A.capi('feliz', T.materia, 200)}<h1 class="ok">Chefão vencido de novo</h1><p class="sub">${esc(cj.titulo)} continua firme. O troféu já era seu.</p>${regra}`;
    else if (f.chefe) h = `${A.capi('pensando', T.materia, 190)}<h1>O Chefão ganhou essa.</h1><p class="sub">${f.revisar && f.revisar.length ? `Os tópicos que mais pesaram: ${esc(A.lista(f.revisar.map(id => R.topico(id).nome)))}.` : ''}</p>${regra}`;
    else if (f.extra) h = `${A.capi(f.venceu ? 'feliz' : 'pensando', T.materia, 200)}<h1 class="${f.venceu ? 'ok' : ''}">${f.venceu ? 'Treino concluído' : 'Treino encerrado'}</h1><p class="sub">${esc(T.nome)} em ${A.plural(f.tentativas, 'tentativa', 'tentativas')}.</p>${regra}`;
    else if (f.venceu && f.ganho === 'caiu') h = `${A.capi('neutra', T.materia, 190)}<h1>Revisão feita</h1><p class="sub">${esc(T.nome)}: a primeira resposta não saiu, então o intervalo encurta para firmar de novo.</p>${niveis}${libs}${regra}`;
    else if (f.venceu && f.ganho === 'manteve') h = `${A.capi('feliz', T.materia, 200)}<h1 class="ok">Rodada vencida</h1><p class="sub">${esc(T.nome)} em ${A.plural(f.tentativas, 'tentativa', 'tentativas')}.</p>${niveis}${libs}${regra}`;
    else if (f.venceu) h = `${A.capi('comemora', T.materia, 210)}<h1 class="ok">Rodada vencida!</h1><p class="sub">${esc(T.nome)} em ${A.plural(f.tentativas, 'tentativa', 'tentativas')}.</p>${niveis}${libs}${regra}`;
    else if (f.caixaAntes >= 1) h = `${A.capi('pensando', T.materia, 190)}<h1>Essa pediu mais tempo.</h1><p class="sub">${esc(T.nome)} chegou ao teto de ${R.tetoDe(f.id)} tentativas.</p>${niveis}${regra}`;
    else h = `${A.capi('pensando', T.materia, 190)}<h1>Essa pediu base.</h1><p class="sub">${esc(T.nome)} chegou ao teto de ${R.tetoDe(f.id)} tentativas. Não é fracasso: falta consolidar o que vem antes.</p>${regra}${f.redireciona && ss.trocou ? `<p class="sub">A próxima rodada virou <b>${nomeT(f.redireciona)}</b>.</p>` : f.redireciona ? `<p class="sub"><b>${nomeT(f.redireciona)}</b> entrou na revisão de hoje.</p>` : ''}`;
    return `<section class="cheia">${h}</section>${botao}`;
  }

  function finalizar(s) {
    const ss = s.sessao;
    ss.fim = Date.now();
    const venc = ss.fechamentos.filter(f => f.venceu).length;
    s.sessoes = s.sessoes || [];
    s.sessoes.push({ dia: ss.dia, inicio: ss.inicio, fim: ss.fim, rodadas: ss.itens.length, vencidas: venc, completa: !ss.abandonada });
    s.ultimaPartida = { inicio: ss.inicio, fim: ss.fim, itens: ss.itens, fechamentos: ss.fechamentos, anunciado: ss.anunciado || [], contagem: ss.contagem || {}, abandonada: !!ss.abandonada, trocas: ss.trocas || {} };
    delete s.sessao;
    A.salvar();
  }

  /* =====================================================================
     LIÇÃO
     ===================================================================== */
  A.rota('licao', () => {
    const s = st(), ss = s.sessao;
    const sair = () => ({ html: '', depois: () => location.replace('#/aprender') });
    if (!ss) return sair();
    const T = R.topico(ss.rodada.id);
    if (!T) { delete s.sessao; A.salvar(); return sair(); }
    if (ss.fase === 'tentativa' && !ss.itemId) {
      const esc0 = R.escolherItem(s, ss.rodada.id, ss.rodada);
      if (!esc0 || !esc0.item) { delete s.sessao; A.salvar(); return sair(); }
      ss.itemId = esc0.item.id; ss.ordem = null; ui = {}; A.salvar();
    }
    const item = R.idx().itens[ss.itemId];
    if (ss.fase !== 'fimRodada' && !item) { delete s.sessao; A.salvar(); return sair(); }
    if (ss.fase === 'retorno' && ss.ultimo) Object.assign(ui, ss.ultimo.ui || {});
    const html = ss.fase === 'fimRodada'
      ? `<div class="licao">${topo(ss)}${fimRodada(ss, T)}</div>`
      : `<div class="licao">${topo(ss)}${corpo(ss, T, item, ss.fase === 'retorno')}${rodape(ss, T, item)}</div>`;
    return {
      titulo: 'Partida',
      html,
      depois(el) {
        const verificar = () => {
          const f = fmtDe(item);
          if (item.tipo === 'transfer' && item.passos && item.passos.length && ss.fase === 'tentativa') { ss.fase = 'conferir'; A.salvar(); return A.render(); }
          const resp = f === 'mc' ? ui.sel : f === 'multi' ? ui.marc : ui.texto;
          const aval = R.avaliar(item, resp);
          const out = R.registrar(s, ss.rodada, item, aval);
          ss.contagem = ss.contagem || { ok: 0, quase: 0, erro: 0 };
          ss.contagem[aval.res]++;
          ss.ultimo = { resp, aval, out, passos: ss.fase === 'conferir' ? (ui.passos || []).slice() : null, ui: { sel: ui.sel, marc: ui.marc, texto: ui.texto } };
          ss.fase = 'retorno';
          A.som({ ok: 2, quase: 1, erro: 0 }[aval.res]);
          A.salvar(); A.render();
        };
        const seguir = () => {
          if (ss.fase === 'retorno') {
            if (ss.ultimo.out.fim) {
              const f = R.fecharRodada(s, ss.rodada);
              ss.fechamentos.push(Object.assign(f, { nome: T.nome }));
              ss.trocou = false;
              // o redirecionamento ocupa a vaga da próxima rodada: a partida nunca fica mais longa do que o combinado
              const prox = ss.itens[ss.i + 1];
              const jaJogado = ss.itens.slice(0, ss.i + 1).some(x => x.id === f.redireciona);
              const jaNaFila = ss.itens.slice(ss.i + 1).some(x => x.id === f.redireciona);
              if (!f.venceu && f.redireciona && prox && !jaJogado && !jaNaFila) {
                ss.trocas = Object.assign(ss.trocas || {}, { [prox.id]: f.redireciona });
                ss.itens[ss.i + 1] = { id: f.redireciona, tipo: (s.topicos[f.redireciona] || {}).caixa ? 'revisao' : 'pratica', motivo: 'base' };
                ss.trocou = true;
              }
              ss.fase = 'fimRodada';
              setTimeout(() => { if (location.hash === '#/licao') A.festa(f.ganho); }, 250);
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
        const atualizarBotao = () => { const b = el.querySelector('[data-a=verificar],[data-a=resultado]'); if (b) b.disabled = !pronto(item); };
        el.addEventListener('click', async e => {
          const b = e.target.closest('[data-op],[data-a]'); if (!b || b.disabled) return;
          if (b.dataset.op !== undefined) {
            const k = +b.dataset.op;
            if (fmtDe(item) === 'multi') { ui.marc = ui.marc || []; const i = ui.marc.indexOf(k); i < 0 ? ui.marc.push(k) : ui.marc.splice(i, 1); } else ui.sel = k;
            el.querySelectorAll('[data-op]').forEach(o => o.setAttribute('aria-checked', fmtDe(item) === 'multi' ? (ui.marc || []).includes(+o.dataset.op) : ui.sel === +o.dataset.op));
            return atualizarBotao();
          }
          const a = b.dataset.a;
          if (a === 'verificar' || a === 'resultado') return verificar();
          if (a === 'continuar' || a === 'seguir') return seguir();
          if (a === 'sair') {
            // os dois botões têm o mesmo peso: sair custa um toque, ficar também (Quadro 3)
            const sai = await A.confirmar({ titulo: 'Sair da partida?', texto: 'O que você já respondeu fica salvo. As rodadas que faltam ficam para outra partida.', ok: 'Sair', cancelar: 'Continuar jogando', iguais: true });
            if (sai !== true) return;
            ss.abandonada = true; finalizar(s); A.ir('#/fim/tchau');
          }
        });
        el.addEventListener('change', e => {
          if (!e.target.matches('[data-passo]')) return;
          ui.passos = [...el.querySelectorAll('[data-passo]:checked')].map(x => +x.dataset.passo);
        });
        const ta = el.querySelector('#aberta:not([readonly])');
        if (ta) {
          ta.addEventListener('input', () => { ui.texto = ta.value; atualizarBotao(); });
          if (ss.fase === 'tentativa') { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
        }
        // pausa de leitura proporcional ao tamanho da explicação; o botão mostra que está esperando, não que está quebrado
        const cont = el.querySelector('[data-a=continuar]');
        if (cont) setTimeout(() => { cont.disabled = false; cont.classList.remove('espera'); cont.removeAttribute('aria-label'); cont.focus({ preventScroll: true }); }, R.pausa(item));
        el.querySelector('[data-a=seguir]')?.focus({ preventScroll: true });
        // o conteúdo nunca fica escondido atrás da folha de resultado
        const pe = el.querySelector('.pe'), lc = el.querySelector('.l-corpo');
        const folga = () => { if (pe && lc) lc.style.paddingBottom = (pe.offsetHeight + 16) + 'px'; };
        folga(); window.onresize = folga;
        if (ss.fase === 'retorno' && pe) pe.scrollTop = 0;
        const tecla = e => {
          if (document.querySelector('.modal-fundo')) return;
          if (e.target.matches('textarea') && e.key !== 'Enter') return;
          if (/^[1-9]$/.test(e.key) && !e.target.matches('textarea')) el.querySelectorAll('[data-op]:not([disabled])')[+e.key - 1]?.click();
          if (e.key === 'Enter' && !e.shiftKey) {
            const btn = el.querySelector('[data-a=verificar]:not([disabled]),[data-a=resultado]:not([disabled]),[data-a=continuar]:not([disabled]),[data-a=seguir]');
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
  // confere cada recompensa anunciada contra o que de fato aconteceu nos fechamentos
  function premios(s, up) {
    const out = [], FS = up.fechamentos, trocas = up.trocas || {};
    const fDe = id => FS.filter(f => f.id === id).pop();
    const cad = A.ic('cadeado', 30);
    const vistos = new Set();
    const naoJogada = id => (trocas[id] ? `Rodada trocada por ${nomeT(trocas[id])}, a base deste tópico` : up.abandonada ? 'Rodada não jogada: a partida foi interrompida' : 'Rodada não jogada');
    for (const x of up.anunciado) {
      let ok = false, ico = A.ic('estrela', 30), texto = A.textoRecompensa(x), nota = '';
      if (x.tipo === 'caixa' || x.tipo === 'mantem') {
        vistos.add(x.id);
        const f = fDe(x.id);
        ico = A.ic('caixa', 30);
        if (!f) nota = naoJogada(x.id);
        else if (!f.venceu) nota = 'A rodada não foi vencida';
        else if (f.caixaDepois > f.caixaAntes) { ok = true; texto = f.caixaAntes ? `<b>${nomeT(x.id)}</b> subiu para o ${niv(f.caixaDepois)}` : `<b>${nomeT(x.id)}</b> entrou no ${niv(f.caixaDepois)}`; }
        else if (f.caixaDepois === f.caixaAntes) { ok = x.tipo === 'mantem'; texto = `<b>${nomeT(x.id)}</b> ficou no ${niv(f.caixaDepois)}`; nota = ok ? '' : 'A primeira resposta saiu pela metade'; }
        else { texto = `<b>${nomeT(x.id)}</b> voltou para o ${niv(f.caixaDepois)}`; nota = 'A primeira resposta da revisão não saiu: o intervalo encurtou'; }
      } else if (x.tipo === 'libera') {
        ico = A.ic('aberto', 30);
        ok = FS.some(f => (f.liberou || []).includes(x.id));
        if (!ok) nota = 'O tópico de base ainda não foi vencido';
      } else if (x.tipo === 'chefe') {
        ico = A.ic('trofeu', 30);
        ok = FS.some(f => f.chefeLiberado === x.conjunto) || R.chefeEstado(s, x.conjunto) !== 'bloqueado';
        if (!ok) nota = 'Ainda falta tópico da unidade no nível 2';
      } else if (x.tipo === 'trofeu') {
        ico = A.ic('trofeu', 30);
        ok = FS.some(f => f.trofeu === x.conjunto);
        if (!ok) nota = 'O Chefão não foi vencido desta vez';
      } else if (x.tipo === 'roupa') {
        ok = FS.some(f => f.roupa === x.materia);
        ico = `<img src="${capi3dSrc('feliz', ok ? x.materia : 'nenhuma')}" alt="">`;
        if (!ok) nota = 'Vem junto com o troféu do Chefão';
      }
      out.push({ ok, ico: ok ? ico : cad, texto, nota });
    }
    // ganhos que não estavam anunciados (ex.: a rodada de base que entrou no lugar de outra)
    for (const f of FS) if (!f.chefe && !f.extra && !vistos.has(f.id) && f.venceu && f.caixaDepois > f.caixaAntes) { vistos.add(f.id); out.push({ ok: true, ico: A.ic('caixa', 30), texto: f.caixaAntes ? `<b>${nomeT(f.id)}</b> subiu para o ${niv(f.caixaDepois)}` : `<b>${nomeT(f.id)}</b> entrou no ${niv(f.caixaDepois)}`, nota: 'Não estava no anúncio: veio da rodada de base' }); }
    for (const f of FS) for (const id of f.liberou || []) if (!up.anunciado.some(x => x.tipo === 'libera' && x.id === id)) out.push({ ok: true, ico: A.ic('aberto', 30), texto: `Liberou <b>${nomeT(id)}</b>`, nota: '' });
    return out;
  }

  A.rota('fim', r => {
    const s = st(), up = s.ultimaPartida;
    if (!up) return { html: '', depois: () => location.replace('#/aprender') };
    document.querySelectorAll('.confete').forEach(c => c.remove());
    const etapa = r.args[0] || 'resumo';
    const ult = R.topico(up.itens[Math.min(up.itens.length, Math.max(1, up.fechamentos.length)) - 1].id) || R.topico(up.itens[0].id) || {};
    const mat = ult.materia;
    const pr = premios(s, up);
    if (etapa === 'resumo') {
      const venc = up.fechamentos.filter(f => f.venceu).length, c = up.contagem || {};
      const total = (c.ok || 0) + (c.quase || 0) + (c.erro || 0);
      const seg = Math.max(0, Math.round((up.fim - up.inicio) / 1000));
      const tempo = seg < 60 ? `${seg} s` : `${Math.round(seg / 60)} min`;
      const linha = f => {
        const nome = f.chefe ? `Chefão · ${esc(R.idx().conjuntos[f.conjunto].titulo)}` : nomeT(f.id);
        const mud = f.chefe ? (f.venceu ? 'vencido' : 'não vencido') : f.extra ? 'treino, nível igual' : !f.venceu && !f.caixaAntes ? 'ainda não entrou' : f.caixaAntes === f.caixaDepois ? `ficou no nível ${f.caixaDepois}` : `nível ${f.caixaAntes} → ${f.caixaDepois}`;
        const cls = f.chefe ? (f.venceu ? 'ok' : 'miss') : f.caixaDepois > f.caixaAntes ? 'ok' : f.caixaDepois < f.caixaAntes || !f.venceu ? 'miss' : 'partial';
        return `<div class="cp-step ${cls}"><b>${nome}</b> <span class="muted">${mud}</span></div>`;
      };
      return {
        titulo: 'Partida concluída',
        html: `<div class="licao"><section class="cheia">${A.capi(venc ? 'feliz' : 'pensando', mat, 190)}
          <h1 class="${venc ? 'ok' : ''}">${up.abandonada ? 'Partida interrompida' : venc === up.fechamentos.length ? 'Partida concluída!' : 'Partida encerrada'}</h1>
          <p class="sub">${venc} de ${A.plural(up.fechamentos.length, 'rodada vencida', 'rodadas vencidas')} · ${A.plural(total, 'resposta', 'respostas')} · ${tempo}</p>
          <div class="etapas resumo">${up.fechamentos.map(linha).join('')}</div></section>
          <div class="pe"><div class="in"><div class="acoes"><a class="cp-btn" href="#/fim/${pr.length ? 'premios' : 'tchau'}">Continuar</a></div></div></div></div>`,
      };
    }
    if (etapa === 'premios') {
      return {
        titulo: 'Recompensas',
        html: `<div class="licao"><section class="cheia" style="justify-content:flex-start;padding-top:40px">
          <h1>Recompensas</h1><p class="sub">O que foi anunciado antes de começar, conferido item por item.</p>
          <div class="premios">${pr.map((p, i) => `<div class="premio ${p.ok ? '' : 'nao'}" style="animation-delay:${i * 90}ms"><span class="ico">${p.ico}</span><span style="flex:1"><span class="tx">${p.texto}</span><small>${p.ok ? (p.nota || 'Entregue') : p.nota}</small></span>${p.ok ? `<span class="st consolidado"><i>${A.ic('check', 12, 3.4)}</i>ok</span>` : ''}</div>`).join('')}</div></section>
          <div class="pe"><div class="in"><div class="acoes"><a class="cp-btn" href="#/fim/tchau">Continuar</a></div></div></div></div>`,
        depois() { if (pr.some(p => p.ok)) A.som(3); },
      };
    }
    // Pilar VII: tela visualmente descontínua, sem continuação imediata
    A.silencio();
    const prox = R.proximaRevisao(s);
    const noDia = prox ? R.topicosAtivos(s).filter(id => (s.topicos[id] || {}).proxima === prox) : [];
    const pend = A.revisoesHoje();
    return {
      titulo: 'Pronto por hoje',
      html: `<section class="encerra">${A.capiFav('dormindo', 200)}<h1>${pend.length ? 'Partida encerrada.' : 'Pronto por hoje.'}</h1>
        ${ult.conjunto ? A.miniMapa(ult.conjunto) : ''}
        ${pend.length ? `<div class="prox"><span>Ainda para hoje</span><b>${A.plural(pend.length, 'revisão', 'revisões')}</b><p>${esc(A.lista(pend.slice(0, 3).map(id => R.topico(id).nome)))}${pend.length > 3 ? ` e mais ${pend.length - 3}` : ''}. Ficam na aba Revisar para quando você decidir.</p></div>`
          : prox ? `<div class="prox"><span>Próxima revisão</span><b>${D.fmtData(prox, true)}</b><p>${esc(A.lista(noDia.slice(0, 3).map(id => R.topico(id).nome)))}${noDia.length > 3 ? ` e mais ${noDia.length - 3}` : ''}. Te vejo lá.</p></div>` : ''}
        <a class="cp-btn secondary block" href="#/aprender" data-a="sair">Voltar ao início</a></section>`,
      depois(el) {
        document.body.classList.add('fim');
        el.querySelector('[data-a=sair]').addEventListener('click', () => { delete s.ultimaPartida; A.salvar(); });
      },
    };
  }, { foco: true });
})();
