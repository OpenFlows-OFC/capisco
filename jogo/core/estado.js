/* =========================================================
   CAPISCO · Estado do jogador
   Fica no próprio aparelho (localStorage) e sai inteiro em JSON aberto:
   nada de investimento aprisionado (Quadro 1, linha 9).
   Tudo o que entra (backup importado ou dado salvo) passa por normalizar():
   tipos conferidos, ids validados e tamanhos limitados.
   ========================================================= */
(function () {
  const C = window.CAPISCO;
  const R = C.regras, D = R.datas;
  const KEY = 'capisco.v1';
  const MATS = Object.keys(R.MATERIAS);
  const RES = ['ok', 'quase', 'erro'];
  const TIPOS = ['novo', 'pratica', 'revisao', 'extra', 'chefe'];

  function vazio() {
    return {
      versao: 1,
      perfil: null,
      ajustes: { som: true, movimento: true, contraste: false, texto: 100, avisos: false, tema: 'auto' },
      conjuntosAtivos: [], conjuntosUsuario: [],
      topicos: {}, sessoes: [], dias: {}, roupas: [], chefes: {}, chefeAvisado: {}, roupaFavorita: null, grupo: null, offset: 0, demo: false, cjAtual: null,
    };
  }

  /* ---------------- validação ---------------- */
  const ehId = x => typeof x === 'string' && /^[\w:.-]{1,80}$/.test(x);
  const str = (x, max = 200) => (typeof x === 'string' ? x.slice(0, max) : '');
  const int = (x, min, max, pad) => { const n = Math.round(Number(x)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : pad; };
  const num = (x, pad = 0) => (Number.isFinite(Number(x)) ? Number(x) : pad);
  const data = (x, pad = null) => (D.ehData(x) ? x : pad);
  const arr = x => (Array.isArray(x) ? x : []);
  const obj = x => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  function item(i) {
    i = obj(i);
    if (!ehId(i.id)) return null;
    const base = { id: i.id, nivel: R.NIVEIS.includes(i.nivel) ? i.nivel : 'lembrar', dif: int(i.dif, 1, 3, 1), explicacao: str(i.explicacao, 600), trecho: str(i.trecho, 600) };
    if (i.tipo === 'cartao') return Object.assign(base, { tipo: 'cartao', frente: str(i.frente, 300), verso: str(i.verso, 400) });
    if (i.tipo === 'mc') {
      const opcoes = arr(i.opcoes).slice(0, 5).map(o => (o = obj(o), o.ok ? { t: str(o.t, 300), ok: true } : { t: str(o.t, 300), erro: str(o.erro, 300) }));
      if (opcoes.length < 2 || opcoes.filter(o => o.ok).length !== 1) return null;
      return Object.assign(base, { tipo: 'mc', enunciado: str(i.enunciado, 600), opcoes });
    }
    return null;
  }
  function conjuntoUsuario(cj) {
    cj = obj(cj);
    if (!ehId(cj.id) || !MATS.includes(cj.materia)) return null;
    const topicos = arr(cj.topicos).slice(0, 40).map(t => {
      t = obj(t);
      if (!ehId(t.id)) return null;
      return { id: t.id, nome: str(t.nome, 60) || 'Tópico', resumo: str(t.resumo, 200), fonte: str(t.fonte, 120), prereq: arr(t.prereq).filter(ehId), itens: arr(t.itens).slice(0, 60).map(item).filter(Boolean) };
    }).filter(Boolean);
    const ids = new Set(topicos.map(t => t.id));
    topicos.forEach(t => (t.prereq = t.prereq.filter(p => ids.has(p) && p !== t.id)));
    if (!topicos.length) return null;
    return { id: cj.id, materia: cj.materia, titulo: str(cj.titulo, 60) || 'Meu conjunto', autor: str(cj.autor, 40), versao: str(cj.versao, 10) || '1.0', descricao: str(cj.descricao, 160), topicos };
  }
  function topico(t) {
    t = obj(t);
    const out = {
      caixa: int(t.caixa, 0, R.P.caixas, 0), proxima: data(t.proxima),
      tentativas: arr(t.tentativas).slice(-R.P.historico).map(x => (x = obj(x), ehId(x.item) && RES.includes(x.res) ? { em: num(x.em), dia: data(x.dia, D.hoje()), item: x.item, res: x.res } : null)).filter(Boolean),
      rodadas: arr(t.rodadas).slice(-200).map(x => (x = obj(x), { dia: data(x.dia, D.hoje()), venceu: !!x.venceu, tentativas: int(x.tentativas, 0, 99, 0), de: int(x.de, 0, 5, 0), para: int(x.para, 0, 5, 0), tipo: TIPOS.includes(x.tipo) ? x.tipo : 'novo' })),
    };
    if (data(t.ultimoOk)) out.ultimoOk = t.ultimoOk;
    if (t.ultimoOkEm) out.ultimoOkEm = num(t.ultimoOkEm);
    const tr = obj(t.travado);
    if (ehId(tr.por)) out.travado = { por: tr.por, desde: data(tr.desde, D.hoje()), em: num(tr.em) };
    if (!out.caixa) out.proxima = null;
    return out;
  }
  function normalizar(s, { confiavel = false } = {}) {
    s = obj(s);
    if (s.versao !== 1) throw new Error('Arquivo não é um backup do Capisco.');
    const v = vazio();
    const p = obj(s.perfil);
    if (s.perfil) v.perfil = { nome: str(p.nome, 24).trim() || 'Estudante', prova: data(p.prova, D.addDias(D.hoje(), 40)), provaNome: str(p.provaNome, 30), criado: data(p.criado, D.hoje()), ritmo: [2, 3, 5].includes(+p.ritmo) ? +p.ritmo : 3 };
    const a = obj(s.ajustes);
    v.ajustes = { som: a.som !== false, movimento: a.movimento !== false, contraste: !!a.contraste, texto: int(a.texto, 90, 130, 100), avisos: !!a.avisos, tema: ['auto', 'claro', 'escuro'].includes(a.tema) ? a.tema : 'auto' };
    v.conjuntosUsuario = arr(s.conjuntosUsuario).slice(0, 30).map(conjuntoUsuario).filter(Boolean);
    v.conjuntosAtivos = [...new Set(arr(s.conjuntosAtivos).filter(ehId))];
    for (const [k, t] of Object.entries(obj(s.topicos)).slice(0, 2000)) if (ehId(k)) v.topicos[k] = topico(t);
    v.sessoes = arr(s.sessoes).slice(-500).map(x => (x = obj(x), { dia: data(x.dia, D.hoje()), inicio: num(x.inicio), fim: num(x.fim, num(x.inicio)), rodadas: int(x.rodadas, 0, 99, 0), vencidas: int(x.vencidas, 0, 99, 0), completa: x.completa !== false }));
    for (const k of Object.keys(obj(s.dias)).slice(-1000)) if (D.ehData(k)) v.dias[k] = true;
    v.roupas = [...new Set(arr(s.roupas).filter(m => MATS.includes(m)))];
    for (const [k, c] of Object.entries(obj(s.chefes))) if (ehId(k)) v.chefes[k] = { dia: data(obj(c).dia, D.hoje()), tentativas: int(obj(c).tentativas, 0, 99, 0) };
    for (const [k, d] of Object.entries(obj(s.chefeAvisado))) if (ehId(k) && D.ehData(d)) v.chefeAvisado[k] = d;
    v.roupaFavorita = MATS.includes(s.roupaFavorita) ? s.roupaFavorita : null;
    const g = obj(s.grupo);
    if (s.grupo) v.grupo = { nome: str(g.nome, 32) || 'Grupo', codigo: str(g.codigo, 12).replace(/[^\w-]/g, ''), meta: { conjunto: ehId(obj(g.meta).conjunto) ? g.meta.conjunto : null, caixa: int(obj(g.meta).caixa, 1, 5, 2), prazo: data(obj(g.meta).prazo, D.addDias(D.hoje(), 21)) }, membros: arr(g.membros).slice(0, 30).map(m => str(m, 24)).filter(Boolean), colegas: Math.min(1, Math.max(0, num(g.colegas))) };
    v.offset = int(s.offset, -3650, 3650, 0);
    v.demo = !!s.demo || !!v.offset;
    v.cjAtual = ehId(s.cjAtual) ? s.cjAtual : null;
    if (D.ehData(s.avisadoEm)) v.avisadoEm = s.avisadoEm;
    // partida em andamento só sobrevive no próprio aparelho (nunca vem de arquivo importado)
    if (confiavel) { if (s.sessao && typeof s.sessao === 'object') v.sessao = s.sessao; if (s.ultimaPartida && typeof s.ultimaPartida === 'object') v.ultimaPartida = s.ultimaPartida; }
    return v;
  }

  /* ---------------- persistência ---------------- */
  function carregar() {
    try {
      const bruto = localStorage.getItem(KEY);
      if (bruto) return normalizar(JSON.parse(bruto), { confiavel: true });
    } catch (e) {}
    return vazio();
  }
  let rev = 0;
  function salvar(st) {
    try { st._rev = ++rev + Date.now(); localStorage.setItem(KEY, JSON.stringify(st)); return true; } catch (e) { return false; }
  }
  function apagar() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return vazio();
  }
  function baixar(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function exportar(st) {
    const copia = Object.assign({}, st); delete copia.sessao; delete copia._rev;
    baixar(`capisco-meus-dados-${D.hoje()}.json`, JSON.stringify(copia, null, 2), 'application/json');
  }
  /* Exportação para pesquisa (protocolo 6.3): uma linha por tentativa e por partida, em CSV aberto */
  function exportarCSV(st) {
    const q = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const linhas = [['registro', 'dia', 'quando', 'topico', 'item', 'resultado', 'rodadas', 'vencidas', 'minutos', 'completa', 'demonstracao'].join(',')];
    for (const s of st.sessoes || []) linhas.push(['partida', s.dia, new Date(s.inicio).toISOString(), '', '', '', s.rodadas, s.vencidas, Math.round((s.fim - s.inicio) / 6000) / 10, s.completa !== false, !!st.demo].map(q).join(','));
    for (const [id, t] of Object.entries(st.topicos || {})) for (const x of t.tentativas || []) linhas.push(['tentativa', x.dia, new Date(x.em).toISOString(), id, x.item, x.res, '', '', '', '', !!st.demo].map(q).join(','));
    baixar(`capisco-pesquisa-${D.hoje()}.csv`, '﻿' + linhas.join('\n'), 'text/csv');
  }
  function importar(arquivo) {
    return arquivo.text().then(txt => {
      let s;
      try { s = JSON.parse(txt); } catch (e) { throw new Error('Arquivo não é um backup do Capisco.'); }
      return normalizar(s);
    });
  }

  function grupoExemplo() {
    return {
      nome: '3ºB · Rumo ao ENEM', codigo: 'CAPI-3B',
      meta: { conjunto: 'bio-genetica', caixa: 2, prazo: D.addDias(D.hoje(), 18) },
      membros: ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa'],
      // progresso dos colegas é simulado neste protótipo (sem servidor)
      colegas: 0.46,
    };
  }

  /* Perfil de demonstração: ~3 semanas de uso, com todos os estados do mapa visíveis.
     Fica marcado como demonstração (st.demo) e assim sai no arquivo exportado. */
  function exemplo(nome) {
    const st = vazio();
    const h = D.hoje();
    st.demo = true;
    st.perfil = { nome: nome || 'Davi', prova: D.addDias(h, 40), provaNome: 'ENEM 2026', criado: D.addDias(h, -21), ritmo: 3 };
    st.conjuntosAtivos = C.conteudo.map(c => c.id);
    R.indexar(st);
    const iv = R.intervalos(st);
    // padrões por posição do tópico no conjunto: [nível, dias até a próxima revisão]
    const padroes = [
      [[3, -2], [2, 0], [1, 3], [0, null], [0, null]],
      [[2, 1], [1, 0], [0, null], [0, null], [0, null]],
      [[4, 5], [3, -1], [2, 2], [2, 4], [2, 0]],
      [[1, 2], [0, null], [0, null], [0, null], [0, null]],
    ];
    C.conteudo.forEach((cj, ci) => {
      const pad = padroes[ci % padroes.length];
      cj.topicos.forEach((t, ti) => {
        const [caixa, prox] = pad[ti] || [0, null];
        const reg = { caixa, tentativas: [], rodadas: [] };
        const itens = t.itens || [];
        const nRod = caixa ? caixa : (ti === pad.findIndex(p => !p[0]) && ci % 2 === 0 ? 1 : 0);
        for (let r = 0; r < nRod; r++) {
          const dia = D.addDias(h, -18 + r * 5 + ti);
          const seq = caixa ? ['erro', 'ok', 'quase', 'ok', 'ok'] : ['erro', 'quase', 'erro'];
          seq.forEach((res, k) => itens[k % itens.length] && reg.tentativas.push({ em: D.parse(dia).getTime() + k * 60000, dia, item: itens[k % itens.length].id, res }));
          reg.rodadas.push({ dia, venceu: !!caixa, tentativas: seq.length, de: Math.max(0, r), para: caixa ? r + 1 : 0, tipo: r ? 'revisao' : 'novo' });
        }
        if (caixa) { reg.proxima = D.addDias(h, prox); reg.ultimoOk = D.addDias(h, Math.min(-1, prox - iv[caixa])); }
        if (reg.tentativas.length || caixa) st.topicos[t.id] = reg;
      });
    });
    [0, 1, 2, 4, 5, 7, 8, 9, 11, 12].forEach(i => (st.dias[D.addDias(h, -i - 1)] = true));
    for (let i = 1; i <= 12; i++) {
      const dia = D.addDias(h, -i);
      if (!st.dias[dia]) continue;
      const ini = D.parse(dia).getTime() + 7 * 3600e3;
      st.sessoes.push({ dia, inicio: ini, fim: ini + (6 + (i % 4) * 2) * 60000, rodadas: 2 + (i % 3), vencidas: 2 + (i % 3) - (i % 4 === 0 ? 1 : 0), completa: true });
    }
    // uma unidade com o Chefão já vencido (troféu + roupa) e outra com ele liberado
    const fis = C.conteudo.find(c => c.materia === 'fis');
    if (fis) { st.chefes[fis.id] = { dia: D.addDias(h, -3), tentativas: 7 }; st.roupas.push('fis'); st.roupaFavorita = 'fis'; }
    st.grupo = grupoExemplo();
    return st;
  }

  C.estado = { vazio, normalizar, carregar, salvar, apagar, exportar, exportarCSV, importar, exemplo, grupoExemplo, KEY };
})();
