/* =========================================================
   CAPISCO · Base da interface: estado, rotas, casca, som, modais
   ========================================================= */
(function () {
  const C = window.CAPISCO, R = C.regras, D = R.datas, E = C.estado;
  const A = (C.app = {});
  let st = E.carregar();
  D.setOffset(st.offset || 0);
  R.indexar(st);

  /* ---------------- estado ---------------- */
  let avisouFalha = false;
  A.st = () => st;
  A.salvar = () => {
    const ok = E.salvar(st);
    if (!ok && !avisouFalha) { avisouFalha = true; A.toast('Não consegui salvar neste aparelho (memória cheia ou navegação privada). Exporte seus dados em Ajustes.', 6000); }
    return ok;
  };
  // partida em andamento que aponta para conteúdo que não existe mais é descartada
  function validarSessao() {
    const ss = st.sessao;
    if (!ss) return;
    const ok = Array.isArray(ss.itens) && ss.itens.length && ss.itens.every(i => i && R.topico(i.id)) && ss.rodada && R.topico(ss.rodada.id) && (!ss.itemId || R.idx().itens[ss.itemId]);
    if (!ok) delete st.sessao;
  }
  A.trocar = novo => { st = novo; D.setOffset(st.offset || 0); R.indexar(st); validarSessao(); A.salvar(); aplicarAjustes(); };
  validarSessao();
  // o mesmo jogo aberto em outra aba (ou no app instalado) salvou: recarrega em vez de sobrescrever
  window.addEventListener('storage', e => {
    if (e.key !== E.KEY) return;
    st = E.carregar(); D.setOffset(st.offset || 0); R.indexar(st); validarSessao(); aplicarAjustes();
    if (document.getElementById('tela')) render();
  });

  /* ---------------- utilidades ---------------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.esc = esc;
  const I = C.icones;
  A.ic = I.ic;
  A.icMat = I.icMat;
  A.mat = id => Object.assign({}, R.MATERIAS[id] || { n: 'Matéria', c: '#0fa292' }, { e: I.icMat(id, 20) });
  A.roupaDe = mat => (R.MATERIAS[mat] && (st.roupas || []).includes(mat) ? mat : 'nenhuma');
  A.capi = (expr, mat, size = 160, cls = '') =>
    `<img class="capi3d ${cls}" src="${capi3dSrc(expr, mat ? A.roupaDe(mat) : 'nenhuma')}" width="${+size}" height="${+size}" alt="" decoding="async">`;
  A.capiFav = (expr, size) => A.capi(expr, st.roupaFavorita, size);
  // glifo branco dentro do nó da trilha e do chip de estado
  A.ICONE = Object.fromEntries(Object.keys(I.ESTADO).map(k => [k, I.icEstado(k, 32, 3)]));
  A.chip = e => `<span class="st ${e}"><i aria-hidden="true">${I.icEstado(e, 12, 3.2)}</i>${R.ROTULO[e]}</span>`;
  A.num = n => String(n).replace('.', ',');
  A.plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  A.lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1];
  A.nivel = k => `${R.NIVEL[k] || ''}`;
  A.minutos = n => (n < 1 ? 'menos de 1 min' : `${n} min`);
  A.estimativa = n => `uns ${Math.max(3, n * 3)} min`; // única estimativa usada no app inteiro
  A.revisoesHoje = () => R.topicosAtivos(st).filter(id => ['vencido', 'agendado'].includes(R.estado(st, id)));
  A.cjAtual = () => {
    const at = R.ativos(st);
    const cj = at.find(c => c.id === st.cjAtual) || at[0];
    return cj ? cj.id : null;
  };
  A.modoDemo = () => !!st.demo || /[?&]demo\b/.test(location.search);

  /* ---------------- som e festa: intensidade = ganho real (Pilar IV) ---------------- */
  let ac;
  A.som = nivel => {
    if (!st.ajustes.som) return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    const S = [[[220, .05, .12]], [[392, .07, .1], [392, .07, .12]], [[784, .12, .14]], [[659, .13, .1], [988, .15, .18]],
      [[523, .15, .12], [659, .16, .12], [784, .18, .12], [1047, .2, .4]]][nivel];
    if (!S) return;
    let t = ac.currentTime;
    S.forEach(([f, g, d]) => {
      const o = ac.createOscillator(), a = ac.createGain();
      o.type = nivel ? 'triangle' : 'sine'; o.frequency.value = f;
      a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + .01); a.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(a).connect(ac.destination); o.start(t); o.stop(t + d + .02); t += d * .8;
    });
    if (navigator.vibrate && nivel >= 2 && matchMedia('(pointer: coarse)').matches) navigator.vibrate(nivel >= 4 ? [20, 40, 20, 40, 40] : nivel === 3 ? [15, 30, 25] : 12);
  };
  A.silencio = () => { try { ac && ac.suspend(); setTimeout(() => ac && ac.resume(), 50); } catch (e) {} };
  // confete com desenho fixo (sem Math.random: nem a festa é sorteada)
  A.confete = (qtd = 60) => {
    if (!st.ajustes.movimento || matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('fim')) return;
    const cores = ['#ff8f0a', '#ffc62e', '#0fa292', '#3fa9f5', '#8b6cff', '#ff7a6b'];
    const box = document.createElement('div');
    box.className = 'confete';
    box.innerHTML = Array.from({ length: qtd }, (_, i) =>
      `<i style="left:${(i * 37) % 100}%;background:${cores[i % cores.length]};animation-delay:${((i * 7) % 10) / 20}s;animation-duration:${1.2 + ((i * 13) % 10) / 10}s;transform:rotate(${(i * 47) % 180}deg)"></i>`).join('');
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2600);
  };
  // tabela única ganho → retorno sensorial (monotônica: quanto maior o ganho real, mais intenso)
  A.festa = ganho => {
    const tabela = { caiu: [0], nenhum: [0], manteve: [1], treino: [1], entrou: [3], subiu: [4], chefe: [4, 80] };
    const [som, confete] = tabela[ganho] || [0];
    A.som(som);
    if (confete) A.confete(confete);
  };

  /* ---------------- ajustes de acessibilidade ---------------- */
  function aplicarAjustes() {
    const a = st.ajustes;
    document.body.classList.toggle('contraste', !!a.contraste);
    document.body.classList.toggle('sem-mov', !a.movimento);
    document.documentElement.style.setProperty('--escala', (a.texto || 100) / 100);
    if (a.tema === 'claro') document.documentElement.dataset.theme = 'light';
    else if (a.tema === 'escuro') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    const escuro = a.tema === 'escuro' || (a.tema !== 'claro' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('escuro', escuro);
    const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = escuro ? '#15191b' : '#0fa292';
  }
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => aplicarAjustes()); } catch (e) {}
  A.aplicarAjustes = aplicarAjustes;
  // teclado do celular: o rodapé fixo sobe junto (o botão nunca fica escondido)
  if (window.visualViewport) {
    const ajustarTeclado = () => document.documentElement.style.setProperty('--teclado', Math.max(0, innerHeight - visualViewport.height - visualViewport.offsetTop) + 'px');
    visualViewport.addEventListener('resize', ajustarTeclado);
    visualViewport.addEventListener('scroll', ajustarTeclado);
  }

  /* ---------------- toast, modal e folha ---------------- */
  A.toast = (msg, ms = 2600) => {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  };
  // iguais: os dois botões com o mesmo peso e sem foco pré-escolhido (simetria de atrito, Quadro 3)
  A.confirmar = ({ titulo, texto, ok = 'Confirmar', cancelar = 'Cancelar', perigo = false, iguais = false }) => new Promise(res => {
    const antes = document.activeElement;
    const f = document.createElement('div');
    f.className = 'modal-fundo';
    f.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt" tabindex="-1"><h2 id="mt">${esc(titulo)}</h2>
      ${texto ? `<p class="sub">${texto}</p>` : ''}
      <div class="acoes ${iguais ? 'iguais' : ''}"><button class="cp-btn ${iguais ? 'secondary' : perigo ? 'perigo' : ''}" data-r="1">${esc(ok)}</button><button class="cp-btn ${iguais ? 'secondary' : 'ghost'}" data-r="0">${esc(cancelar)}</button></div></div>`;
    const fechar = v => { f.remove(); document.removeEventListener('keydown', k); if (antes && antes.focus) antes.focus({ preventScroll: true }); res(v); };
    const k = e => { if (e.key === 'Escape') fechar(null); };
    f.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) fechar(b.dataset.r === '1'); else if (e.target === f) fechar(null); });
    document.addEventListener('keydown', k);
    document.body.appendChild(f);
    (iguais ? f.querySelector('.modal') : f.querySelector('[data-r="1"]')).focus();
  });
  A.folha = (html, depois, rotulo = 'Escolha') => {
    const f = document.createElement('div');
    f.className = 'folha-fundo';
    f.innerHTML = `<div class="folha" role="dialog" aria-modal="true" aria-label="${esc(rotulo)}" tabindex="-1">${html}</div>`;
    const fechar = () => { f.remove(); document.removeEventListener('keydown', k); };
    const k = e => { if (e.key === 'Escape') fechar(); };
    f.addEventListener('click', e => { if (e.target === f || e.target.closest('[data-fechar]')) fechar(); });
    document.addEventListener('keydown', k);
    document.body.appendChild(f);
    f.querySelector('.folha').focus();
    if (depois) depois(f.querySelector('.folha'), fechar);
  };
  A.trocarMateria = () => A.folha(`<div class="entre"><h2 class="tit" style="font-size:22px">Escolha a matéria</h2><button class="cp-btn ghost sm" data-fechar>Fechar</button></div>
    <div class="mats">${R.ativos(st).map(cj => { const m = A.mat(cj.materia); return `<button class="mat" data-cj="${esc(cj.id)}" style="--m:${m.c}" aria-pressed="${cj.id === A.cjAtual()}"><img src="${capi3dSrc('neutra', A.roupaDe(cj.materia))}" alt=""><span><b>${esc(m.n)}</b><small>${R.dominioMateria(st, cj.materia)}% dominado</small></span></button>`; }).join('')}</div>
    <a class="cp-btn secondary" href="#/conjuntos" data-fechar>Adicionar ou tirar matérias</a>`, (el, fechar) => {
    el.addEventListener('click', e => { const b = e.target.closest('[data-cj]'); if (!b) return; st.cjAtual = b.dataset.cj; A.salvar(); fechar(); A.ir('#/aprender'); });
  }, 'Escolha a matéria');

  /* ---------------- iniciar uma partida (qualquer composição) ---------------- */
  A.iniciar = itens => {
    if (!itens || !itens.length) return;
    st.sessao = { itens, i: 0, inicio: Date.now(), dia: D.hoje(), fase: 'tentativa', rodada: R.novaRodada(st, itens[0].id, itens[0].tipo), fechamentos: [], anunciado: R.recompensa(st, itens), declaradas: itens.length };
    A.salvar();
    A.ir('#/licao');
  };
  A.sessaoAtiva = () => (st.sessao ? `<a class="aviso-partida" href="#/licao"><span class="linha" style="gap:8px;flex-wrap:nowrap">${I.ic('pausa', 22, 2.8)}Partida em andamento: rodada ${st.sessao.i + 1} de ${st.sessao.itens.length}</span><b>Continuar</b></a>` : '');
  A.textoRecompensa = x => {
    const nome = id => esc((R.topico(id) || { nome: '—' }).nome);
    const cj = id => esc((R.idx().conjuntos[id] || { titulo: '—' }).titulo);
    if (x.tipo === 'caixa') return x.revisao
      ? `<b>${nome(x.id)}</b> sobe para o nível ${x.para} (${A.nivel(x.para)}) se a 1ª resposta sair certa`
      : `<b>${nome(x.id)}</b> entra no nível 1 (${A.nivel(1)})`;
    if (x.tipo === 'mantem') return `<b>${nome(x.id)}</b> se mantém no nível ${x.caixa} (${A.nivel(x.caixa)}) se a 1ª resposta sair certa`;
    if (x.tipo === 'libera') return `Libera <b>${nome(x.id)}</b>`;
    if (x.tipo === 'chefe') return `Libera o <b>Chefão</b> de ${cj(x.conjunto)}`;
    if (x.tipo === 'trofeu') return `Troféu da unidade <b>${cj(x.conjunto)}</b>`;
    return `Roupa nova da Capi: <b>${esc(A.mat(x.materia).n)}</b>`;
  };

  /* ---------------- rotas ---------------- */
  const ROTAS = {};
  A.rota = (nome, fn, op = {}) => (ROTAS[nome] = Object.assign(fn, op));
  const ANTIGAS = { inicio: 'aprender', mapa: 'aprender', progresso: 'perfil', capi: 'perfil', revisoes: 'revisar', partida: 'licao' };
  const dec = x => { try { return decodeURIComponent(x); } catch (e) { return ''; } };
  A.parse = () => {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const partes = (path || '').split('/').filter(Boolean).map(dec);
    let q = {};
    try { q = Object.fromEntries(new URLSearchParams(qs || '')); } catch (e) {}
    return { nome: partes[0] || 'aprender', args: partes.slice(1), q };
  };
  A.ir = h => { if (location.hash === h) render(); else location.hash = h; };
  const ABA = { aprender: 'aprender', topico: 'aprender', revisar: 'revisar', briefing: 'revisar', perfil: 'perfil', mais: 'mais', conjuntos: 'mais', editor: 'mais', grupo: 'mais', regras: 'mais', ajustes: 'mais' };
  function render() {
    const r = A.parse();
    if (ANTIGAS[r.nome]) { if (r.nome === 'mapa' && r.args[0]) st.cjAtual = r.args[0]; return location.replace('#/' + ANTIGAS[r.nome]); }
    if (!st.perfil && r.nome !== 'boas-vindas') return location.replace('#/boas-vindas');
    if (st.perfil && r.nome === 'boas-vindas') return location.replace('#/aprender'); // "voltar" depois do cadastro não reabre as boas-vindas
    const fn = ROTAS[r.nome] || ROTAS.aprender;
    document.body.classList.toggle('foco', !!fn.foco);
    document.body.classList.toggle('fim', false);
    const velho = document.getElementById('tela');
    const main = velho.cloneNode(false);
    velho.replaceWith(main);
    if (A._tecla) { document.removeEventListener('keydown', A._tecla); A._tecla = null; }
    window.onresize = null;
    document.querySelectorAll('.folha-fundo,.toast').forEach(f => f.remove());
    const out = fn(r) || {};
    main.innerHTML = typeof out === 'string' ? out : out.html;
    const aba = ABA[r.nome];
    document.querySelectorAll('[data-nav]').forEach(a => a.dataset.nav === aba ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    document.title = (out.titulo ? out.titulo + ' · ' : '') + 'Capisco';
    if (!out.manterRolagem) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    if (out.depois) out.depois(main, r);
    if (!fn.foco && st.perfil) pintarBarras();
  }
  A.render = render;

  /* ---------------- barra do topo (app) e trilho lateral (web) ---------------- */
  function pintarBarras() {
    const rev = A.revisoesHoje().length;
    const dias = R.ultimos14(st).filter(d => d.on).length;
    const cj = R.idx().conjuntos[A.cjAtual()];
    const m = cj ? A.mat(cj.materia) : { e: I.ic('livros', 20), n: 'Matérias', c: 'var(--brand)' };
    const mi = cj ? I.icMat(cj.materia, 24) : I.ic('livros', 24);
    const pv = R.prova(st);
    const provaTxt = pv.dias === null ? 'sem data' : pv.passou ? 'passou' : `${pv.dias}d`;
    const topo = document.getElementById('topo');
    if (topo) topo.innerHTML = `
      <button class="stat mat-atual" data-a="materia" aria-label="Trocar matéria: ${esc(m.n)}" style="--m:${m.c}"><span class="e">${mi}</span><span class="mat-nome">${esc(m.n)}</span>${I.ic('baixo', 16, 2.6)}</button>
      <span class="linha" style="gap:2px;flex-wrap:nowrap">
        <a class="stat laranja" href="#/perfil" aria-label="${dias} dias com estudo nas últimas 2 semanas"><span class="e">${I.ic('calendario', 22)}</span><span class="v">${dias}<small>dias</small></span></a>
        <a class="stat azul" href="#/revisar" aria-label="${rev} revisões para hoje"><span class="e">${I.ic('revisar', 22, 2.4)}</span><span class="v">${rev}<small>revisar</small></span></a>
        <a class="stat verde" href="#/ajustes" aria-label="${esc(st.perfil.provaNome || 'Prova')}: ${provaTxt}"><span class="e">${I.ic('alvo', 22)}</span><span class="v">${provaTxt}<small>prova</small></span></a></span>`;
    const rail = document.getElementById('rail');
    if (rail) {
      const prox = R.proximaRevisao(st);
      const trof = Object.keys(st.chefes || {}).length;
      rail.innerHTML = `
        <div class="entre"><button class="stat mat-atual" data-a="materia" style="--m:${m.c}"><span class="e">${mi}</span>${esc(m.n)}${I.ic('baixo', 16, 2.6)}</button>
          <span class="linha" style="gap:2px"><a class="stat laranja" href="#/perfil" aria-label="${dias} dias com estudo nas últimas 2 semanas"><span class="e">${I.ic('calendario', 22)}</span><span class="v">${dias}<small>dias</small></span></a><a class="stat azul" href="#/revisar" aria-label="${rev} revisões para hoje"><span class="e">${I.ic('revisar', 22, 2.4)}</span><span class="v">${rev}<small>revisar</small></span></a></span></div>
        <section class="box"><h3 class="h-ic"><span class="ic-azul">${I.ic('revisar', 22, 2.4)}</span>Revisões de hoje</h3>
          ${rev ? `<p class="muted">${A.plural(rev, 'tópico está', 'tópicos estão')} no ponto de revisar: lembrar ainda dá, mas já pede esforço.</p><a class="cp-btn" href="#/briefing">Revisar agora</a>`
            : `<p class="muted">Tudo em dia.${prox ? ` Próxima revisão: <b>${D.fmtData(prox, true)}</b>.` : ''}</p>`}</section>
        <section class="box"><h3 class="h-ic"><span class="ic-verde">${I.ic('alvo', 22)}</span>${esc(st.perfil.provaNome || 'Prova')}</h3><p class="muted">${pv.passou ? 'A data da prova já passou. Atualize em Ajustes para o jogo recalcular as revisões.' : pv.dias === null ? 'Sem data definida.' : `Faltam <b>${pv.dias} dias</b>.`} Seu ritmo: ${A.plural(st.perfil.ritmo || 3, 'rodada', 'rodadas')} por partida. Hoje: ${A.minutos(R.minutosHoje(st))}.</p></section>
        <section class="box"><h3 class="h-ic"><span class="ic-ouro">${I.ic('trofeu', 22)}</span>Troféus</h3><p class="muted">${trof} de ${R.ativos(st).length}. Cada unidade termina num Chefão: vencer ele dá troféu e roupa nova para a Capi.</p></section>
        <p class="muted" style="font-size:12px">Sem sorte, sem moeda, sem ranking. <a href="#/regras">Como o jogo decide</a></p>`;
    }
  }
  A.pintarBarras = pintarBarras;

  A.montar = modo => {
    document.body.classList.add(modo);
    document.getElementById('raiz').innerHTML = `
      <div class="shell">
        <aside class="side" aria-label="Navegação">
          <a class="brand" href="#/aprender">${capiscoLogo({ size: 30 })}</a>
          <a class="nav" href="#/aprender" data-nav="aprender"><span class="ic">${I.ic('trilha', 26, 2.3)}</span>Aprender</a>
          <a class="nav" href="#/revisar" data-nav="revisar"><span class="ic">${I.ic('revisar', 26, 2.3)}</span>Revisar</a>
          <a class="nav" href="#/perfil" data-nav="perfil"><span class="ic">${I.ic('capi', 26, 2.3)}</span>Perfil</a>
          <a class="nav" href="#/mais" data-nav="mais"><span class="ic">${I.ic('mais', 26, 2.3)}</span>Mais</a>
          <span class="grow"></span>
          <small>Seus dados ficam neste aparelho</small>
        </aside>
        <div class="meio">
          <header class="topo" id="topo"></header>
          <main class="tela" id="tela" tabindex="-1"></main>
        </div>
        <aside class="rail" id="rail" aria-label="Resumo"></aside>
      </div>
      <nav class="tabs" aria-label="Abas">
        <a href="#/aprender" data-nav="aprender"><span class="ic">${I.ic('trilha', 26, 2.3)}</span>Aprender</a>
        <a href="#/revisar" data-nav="revisar"><span class="ic">${I.ic('revisar', 26, 2.3)}</span>Revisar</a>
        <a href="#/perfil" data-nav="perfil"><span class="ic">${I.ic('capi', 26, 2.3)}</span>Perfil</a>
        <a href="#/mais" data-nav="mais"><span class="ic">${I.ic('mais', 26, 2.3)}</span>Mais</a>
      </nav>`;
    document.addEventListener('click', e => { if (e.target.closest('[data-a="materia"]')) A.trocarMateria(); });
    aplicarAjustes();
    window.addEventListener('hashchange', render);
    render();
    setTimeout(A.avisarRevisoes, 1500);
  };

  /* ---------------- instalação (preenchido pela casca do app) ---------------- */
  A.instalavel = false;
  A.instalar = () => {};
  A.ehIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  A.instalado = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  /* ---------------- Pilar VI · aviso de revisão (urgência verdadeira) ---------------- */
  A.textoAviso = () => {
    const due = A.revisoesHoje();
    if (!due.length) return null;
    const atrasados = due.filter(id => R.estado(st, id) === 'vencido');
    const t = R.topico(due[0]);
    if (due.length === 1) return atrasados.length ? `${t.nome} já passou do ponto ideal de revisar. Uma rodada resolve.` : `${t.nome} está no ponto de revisar: lembrar ainda dá, mas já exige esforço.`;
    return `${due.length} tópicos para revisar hoje${atrasados.length ? ` (${atrasados.length} já passaram do ponto ideal)` : ''}. Uma partida de ${A.estimativa(Math.min(due.length, st.perfil.ritmo || 3))} cobre os mais urgentes.`;
  };
  A.avisarRevisoes = () => {
    if (!st.ajustes.avisos || !('Notification' in window) || Notification.permission !== 'granted') return;
    const h = D.hoje();
    if (st.avisadoEm === h) return;
    const txt = A.textoAviso();
    if (!txt) return;
    st.avisadoEm = h; A.salvar();
    const op = { body: txt, icon: document.querySelector('link[rel=icon]')?.href, tag: 'capisco-revisao', data: { url: '#/revisar' } };
    if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.ready.then(r => r.showNotification('Capisco', op));
    else try { new Notification('Capisco', op); } catch (e) {}
  };
})();
