/* =========================================================
   CAPISCO · Base da interface v2: estado, rotas, casca, som, modais
   ========================================================= */
(function () {
  const C = window.CAPISCO, R = C.regras, D = R.datas, E = C.estado;
  const A = (C.app = {});
  let st = E.carregar();
  D.setOffset(st.offset || 0);
  R.indexar(st);

  A.st = () => st;
  A.salvar = () => E.salvar(st);
  A.trocar = novo => { st = novo; D.setOffset(st.offset || 0); R.indexar(st); E.salvar(st); aplicarAjustes(); };

  /* ---------------- utilidades ---------------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.esc = esc;
  A.mat = id => R.MATERIAS[id] || { n: id, c: '#0fa292', e: '📘' };
  A.roupaDe = mat => ((st.roupas || []).includes(mat) ? mat : 'nenhuma');
  A.capi = (expr, mat, size = 160, cls = '') =>
    `<img class="capi3d ${cls}" src="${capi3dSrc(expr, mat ? A.roupaDe(mat) : 'nenhuma')}" width="${size}" height="${size}" alt="" decoding="async">`;
  A.capiFav = (expr, size) => A.capi(expr, st.roupaFavorita && (st.roupas || []).includes(st.roupaFavorita) ? st.roupaFavorita : null, size);
  const ICONE = { vencido: '!', agendado: '◷', consolidado: '★', novo: '✦', pratica: '↻', bloqueado: '🔒' };
  A.ICONE = ICONE;
  A.chip = e => `<span class="st ${e}"><i aria-hidden="true">${ICONE[e]}</i>${R.ROTULO[e]}</span>`;
  A.num = n => String(n).replace('.', ',');
  A.plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  A.lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1];
  A.revisoesHoje = () => R.topicosAtivos(st).filter(id => ['vencido', 'agendado'].includes(R.estado(st, id)));
  A.cjAtual = () => {
    const at = R.ativos(st);
    const cj = at.find(c => c.id === st.cjAtual) || at[0];
    return cj ? cj.id : null;
  };

  /* ---------------- som: intensidade = ganho real (níveis 0 a 4) ---------------- */
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
  A.confete = () => {
    if (!st.ajustes.movimento || matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('fim')) return;
    const cores = ['#ff8f0a', '#ffc62e', '#0fa292', '#3fa9f5', '#8b6cff', '#ff7a6b'];
    const box = document.createElement('div');
    box.className = 'confete';
    box.innerHTML = Array.from({ length: 60 }, (_, i) =>
      `<i style="left:${Math.random() * 100}%;background:${cores[i % cores.length]};animation-delay:${Math.random() * .5}s;animation-duration:${1.2 + Math.random()}s;transform:rotate(${Math.random() * 180}deg)"></i>`).join('');
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2600);
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
  }
  A.aplicarAjustes = aplicarAjustes;

  /* ---------------- toast, modal e folha ---------------- */
  A.toast = (msg, ms = 2600) => {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  };
  A.confirmar = ({ titulo, texto, ok = 'Confirmar', cancelar = 'Cancelar', perigo = false }) => new Promise(res => {
    const f = document.createElement('div');
    f.className = 'modal-fundo';
    f.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">${esc(titulo)}</h2>
      ${texto ? `<p class="sub">${texto}</p>` : ''}
      <div class="acoes"><button class="cp-btn ${perigo ? 'perigo' : ''}" data-r="1">${esc(ok)}</button><button class="cp-btn ghost" data-r="0">${esc(cancelar)}</button></div></div>`;
    const fechar = v => { f.remove(); document.removeEventListener('keydown', k); res(v); };
    const k = e => { if (e.key === 'Escape') fechar(null); };
    f.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) fechar(b.dataset.r === '1'); else if (e.target === f) fechar(null); });
    document.addEventListener('keydown', k);
    document.body.appendChild(f);
    f.querySelector('[data-r="1"]').focus();
  });
  A.folha = (html, depois) => {
    const f = document.createElement('div');
    f.className = 'folha-fundo';
    f.innerHTML = `<div class="folha" role="dialog" aria-modal="true">${html}</div>`;
    const fechar = () => { f.remove(); document.removeEventListener('keydown', k); };
    const k = e => { if (e.key === 'Escape') fechar(); };
    f.addEventListener('click', e => { if (e.target === f || e.target.closest('[data-fechar]')) fechar(); });
    document.addEventListener('keydown', k);
    document.body.appendChild(f);
    if (depois) depois(f.querySelector('.folha'), fechar);
  };
  A.trocarMateria = () => A.folha(`<div class="entre"><h2 class="tit" style="font-size:22px">Escolha a matéria</h2><button class="cp-btn ghost sm" data-fechar>Fechar</button></div>
    <div class="mats">${R.ativos(st).map(cj => { const m = A.mat(cj.materia); return `<button class="mat" data-cj="${cj.id}" style="--m:${m.c}" aria-pressed="${cj.id === A.cjAtual()}"><img src="${capi3dSrc('neutra', A.roupaDe(cj.materia))}" alt=""><span><b>${m.n}</b><small>${R.dominioMateria(st, cj.materia)}% dominado</small></span></button>`; }).join('')}</div>
    <a class="cp-btn secondary" href="#/conjuntos" data-fechar>Adicionar ou tirar matérias</a>`, (el, fechar) => {
    el.addEventListener('click', e => { const b = e.target.closest('[data-cj]'); if (!b) return; st.cjAtual = b.dataset.cj; A.salvar(); fechar(); A.ir('#/aprender'); });
  });

  /* ---------------- iniciar uma partida (qualquer composição) ---------------- */
  A.iniciar = itens => {
    if (!itens || !itens.length) return;
    st.sessao = { itens, i: 0, inicio: Date.now(), dia: D.hoje(), fase: 'tentativa', rodada: R.novaRodada(st, itens[0].id, itens[0].tipo), fechamentos: [], anunciado: R.recompensa(st, itens) };
    A.salvar();
    A.ir('#/licao');
  };
  A.tipoDe = id => {
    if (R.ehChefe(id)) return 'chefe';
    const e = R.estado(st, id);
    return e === 'vencido' || e === 'agendado' ? 'revisao' : e === 'pratica' ? 'pratica' : e === 'consolidado' ? 'revisao' : 'novo';
  };
  A.textoRecompensa = x => x.tipo === 'caixa'
    ? `<b>${esc(R.topico(x.id).nome)}</b> ${x.de ? `sobe da caixa ${x.de} para a ${x.para}` : 'entra na caixa 1'}`
    : x.tipo === 'libera' ? `Libera <b>${esc(R.topico(x.id).nome)}</b>`
      : x.tipo === 'chefe' ? `Libera o <b>Chefão</b> de ${esc(R.idx().conjuntos[x.conjunto].titulo)}`
        : x.tipo === 'trofeu' ? `Troféu da unidade <b>${esc(R.idx().conjuntos[x.conjunto].titulo)}</b>`
          : `Roupa nova da Capi: <b>${A.mat(x.materia).n}</b>`;

  /* ---------------- rotas ---------------- */
  const ROTAS = {};
  A.rota = (nome, fn, op = {}) => (ROTAS[nome] = Object.assign(fn, op));
  const ANTIGAS = { inicio: 'aprender', mapa: 'aprender', progresso: 'perfil', capi: 'perfil', revisoes: 'revisar', partida: 'licao' };
  A.parse = () => {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const partes = (path || '').split('/').filter(Boolean).map(decodeURIComponent);
    return { nome: partes[0] || 'aprender', args: partes.slice(1), q: Object.fromEntries(new URLSearchParams(qs || '')) };
  };
  A.ir = h => { if (location.hash === h) render(); else location.hash = h; };
  const ABA = { aprender: 'aprender', topico: 'aprender', revisar: 'revisar', briefing: 'revisar', perfil: 'perfil', mais: 'mais', conjuntos: 'mais', editor: 'mais', grupo: 'mais', regras: 'mais', ajustes: 'mais' };
  function render() {
    const r = A.parse();
    if (ANTIGAS[r.nome]) { if (r.nome === 'mapa' && r.args[0]) st.cjAtual = r.args[0]; return location.replace('#/' + ANTIGAS[r.nome]); }
    if (!st.perfil && r.nome !== 'boas-vindas') return location.replace('#/boas-vindas');
    const fn = ROTAS[r.nome] || ROTAS.aprender;
    document.body.classList.toggle('foco', !!fn.foco);
    document.body.classList.toggle('fim', false);
    const velho = document.getElementById('tela');
    const main = velho.cloneNode(false);
    velho.replaceWith(main);
    if (A._tecla) { document.removeEventListener('keydown', A._tecla); A._tecla = null; }
    document.querySelectorAll('.folha-fundo').forEach(f => f.remove());
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
    const m = cj ? A.mat(cj.materia) : { e: '📚', n: 'Matérias' };
    const topo = document.getElementById('topo');
    if (topo) topo.innerHTML = `
      <button class="stat" data-a="materia" aria-label="Trocar matéria: ${m.n}"><span class="e">${m.e}</span>${m.n}</button>
      <span class="linha" style="gap:2px;flex-wrap:nowrap">
        <a class="stat laranja" href="#/perfil" title="Dias com prática nas últimas 2 semanas"><span class="e">📅</span>${dias}</a>
        <a class="stat azul" href="#/revisar" title="Revisões para hoje"><span class="e">🔁</span>${rev}</a>
        <a class="stat verde" href="#/ajustes" title="Dias até a prova"><span class="e">🎯</span>${R.horizonte(st)}d</a></span>`;
    const rail = document.getElementById('rail');
    if (rail) {
      const prox = R.proximaRevisao(st);
      const trof = Object.keys(st.chefes || {}).length;
      rail.innerHTML = `
        <div class="entre"><button class="stat" data-a="materia"><span class="e">${m.e}</span>${m.n} ▾</button>
          <span class="linha" style="gap:2px"><a class="stat laranja" href="#/perfil" title="Dias com prática nas últimas 2 semanas"><span class="e">📅</span>${dias}</a><a class="stat azul" href="#/revisar" title="Revisões para hoje"><span class="e">🔁</span>${rev}</a></span></div>
        <section class="box"><h3>Revisões de hoje</h3>
          ${rev ? `<p class="muted">${A.plural(rev, 'tópico está', 'tópicos estão')} no ponto de revisar: lembrar ainda dá, mas já pede esforço.</p><a class="cp-btn" href="#/briefing">Revisar agora</a>`
            : `<p class="muted">Tudo em dia.${prox ? ` Próxima revisão: <b>${D.fmtData(prox, true)}</b>.` : ''}</p>`}</section>
        <section class="box"><h3>🎯 ${esc(st.perfil.provaNome || 'Prova')}</h3><p class="muted">Faltam <b>${R.horizonte(st)} dias</b>. Seu ritmo: ${A.plural(st.perfil.ritmo || 3, 'rodada', 'rodadas')} por partida. Hoje: ${R.minutosHoje(st)} min.</p></section>
        <section class="box"><h3>🏆 Unidades concluídas</h3><p class="muted">${trof} de ${R.ativos(st).length}. Cada unidade termina num Chefão, e vencer ele dá troféu e roupa nova para a Capi.</p></section>
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
          <a class="nav" href="#/aprender" data-nav="aprender"><span class="ic">🏠</span>Aprender</a>
          <a class="nav" href="#/revisar" data-nav="revisar"><span class="ic">🔁</span>Revisar</a>
          <a class="nav" href="#/perfil" data-nav="perfil"><span class="ic">👤</span>Perfil</a>
          <a class="nav" href="#/mais" data-nav="mais"><span class="ic">☰</span>Mais</a>
          <span class="grow"></span>
          <small>Seus dados ficam neste aparelho · regras v${R.versao}</small>
        </aside>
        <div class="meio">
          <header class="topo" id="topo"></header>
          <main class="tela" id="tela" tabindex="-1"></main>
        </div>
        <aside class="rail" id="rail" aria-label="Resumo"></aside>
      </div>
      <nav class="tabs" aria-label="Abas">
        <a href="#/aprender" data-nav="aprender"><span class="ic">🏠</span>Aprender</a>
        <a href="#/revisar" data-nav="revisar"><span class="ic">🔁</span>Revisar</a>
        <a href="#/perfil" data-nav="perfil"><span class="ic">👤</span>Perfil</a>
        <a href="#/mais" data-nav="mais"><span class="ic">☰</span>Mais</a>
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
    const t = R.topico(due[0]);
    return due.length === 1
      ? `${t.nome} está quase escapando da memória. Uma rodada resolve.`
      : `${t.nome} e mais ${A.plural(due.length - 1, 'tópico', 'tópicos')} estão no ponto de revisar. Uns ${Math.max(3, due.length * 2)} min resolvem.`;
  };
  A.avisarRevisoes = () => {
    if (!st.ajustes.avisos || !('Notification' in window) || Notification.permission !== 'granted') return;
    const h = D.hoje();
    if (st.avisadoEm === h) return;
    const txt = A.textoAviso();
    if (!txt) return;
    st.avisadoEm = h; A.salvar();
    const op = { body: txt, icon: document.querySelector('link[rel=icon]')?.href, tag: 'capisco-revisao' };
    if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.ready.then(r => r.showNotification('Capisco', op));
    else try { new Notification('Capisco', op); } catch (e) {}
  };
})();
