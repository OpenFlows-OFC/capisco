/* =========================================================
   CAPISCO · Estado do jogador
   Fica no próprio aparelho (localStorage) e sai inteiro em JSON aberto:
   nada de investimento aprisionado (Quadro 1, linha 9).
   ========================================================= */
(function () {
  const C = window.CAPISCO;
  const R = C.regras, D = R.datas;
  const KEY = 'capisco.v1';

  function vazio() {
    return {
      versao: 1,
      perfil: null,
      ajustes: { som: true, movimento: true, contraste: false, texto: 100, avisos: false, tema: 'auto' },
      conjuntosAtivos: [], conjuntosUsuario: [],
      topicos: {}, sessoes: [], dias: {}, roupas: [], chefes: {}, roupaFavorita: null, grupo: null, offset: 0,
    };
  }
  function carregar() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.versao === 1) return Object.assign(vazio(), s);
    } catch (e) {}
    return vazio();
  }
  function salvar(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }
  function apagar() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return vazio();
  }
  function exportar(st) {
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `capisco-meus-dados-${D.hoje()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function importar(arquivo) {
    return arquivo.text().then(txt => {
      const s = JSON.parse(txt);
      if (!s || s.versao !== 1 || !s.topicos) throw new Error('Arquivo não é um backup do Capisco.');
      return Object.assign(vazio(), s);
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

  /* Perfil de demonstração: ~3 semanas de uso, com todos os estados do mapa visíveis */
  function exemplo(nome) {
    const st = vazio();
    const h = D.hoje();
    st.perfil = { nome: nome || 'Davi', prova: D.addDias(h, 40), provaNome: 'ENEM 2026', criado: D.addDias(h, -21), ritmo: 3 };
    st.conjuntosAtivos = C.conteudo.map(c => c.id);
    R.indexar(st);
    const iv = R.intervalos(st);
    // padrões por posição do tópico no conjunto: [caixa, dias até a próxima revisão]
    const padroes = [
      [[3, -2], [2, 0], [1, 3], [0, null], [0, null]],
      [[2, 1], [1, 0], [0, null], [0, null], [0, null]],
      [[4, 5], [3, -1], [2, 2], [2, 4], [1, 0]],
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
      st.sessoes.push({ dia, inicio: ini, fim: ini + (6 + (i % 4) * 2) * 60000, rodadas: 2 + (i % 3), vencidas: 2 + (i % 3) - (i % 4 === 0 ? 1 : 0) });
    }
    // uma unidade com o Chefão já vencido (troféu + roupa) e outra com ele liberado
    const fis = C.conteudo.find(c => c.materia === 'fis');
    if (fis) { st.chefes[fis.id] = { dia: D.addDias(h, -3), tentativas: 7 }; st.roupas.push('fis'); st.roupaFavorita = 'fis'; }
    st.grupo = grupoExemplo();
    return st;
  }

  C.estado = { vazio, carregar, salvar, apagar, exportar, importar, exemplo, grupoExemplo };
})();
