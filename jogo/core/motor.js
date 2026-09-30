/* =========================================================
   CAPISCO · Motor de regras v1.0
   Todas as decisões do jogo saem daqui: são determinísticas, versionadas
   e cada uma tem um texto que a explica (Pilar IV · Progressão Legível).
   ========================================================= */
(function () {
  const C = (window.CAPISCO = window.CAPISCO || {});
  C.conteudo = C.conteudo || [];

  const P = {
    pesos: { lembrar: 1, compreender: 1.5, aplicar: 2 },
    criterio: 3,            // soma de pesos em acertos seguidos que vence a rodada
    teto: 8,                // tentativas máximas por rodada (carga cognitiva)
    banda: [0.6, 0.85],     // faixa-alvo de acerto (fluxo + carga cognitiva)
    razaoCepeda: 0.15,      // último intervalo ≈ 15% dos dias até a prova
    caixas: 5,
    limiarPrereq: 1,        // caixa mínima do pré-requisito para liberar o tópico
    rodadas: { min: 1, max: 5, padrao: 3 },
    deliberacao: 1200,      // ms antes de liberar o "Continuar" (intervalo deliberativo)
    chefe: { criterio: 5, teto: 12 }, // simulado da unidade: sequência maior, questões de todos os tópicos
  };
  const CHEFE = 'chefe:';
  const ehChefe = id => typeof id === 'string' && id.startsWith(CHEFE);
  const chefeId = cjId => CHEFE + cjId;
  const NIVEIS = ['lembrar', 'compreender', 'aplicar'];
  const MATERIAS = {
    bio: { n: 'Biologia', c: '#58b847', e: '🧬' }, qui: { n: 'Química', c: '#3fa9f5', e: '⚗️' },
    fis: { n: 'Física', c: '#8b6cff', e: '⚛️' }, mat: { n: 'Matemática', c: '#ff7a6b', e: '📐' },
    his: { n: 'História', c: '#e0a100', e: '🏛️' }, geo: { n: 'Geografia', c: '#0b8577', e: '🧭' },
    por: { n: 'Português', c: '#c98a4b', e: '📖' }, red: { n: 'Redação', c: '#e05c9a', e: '✍️' },
  };

  /* ---------------- datas (dia local, sem fuso) ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const addDias = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5); // dias de a até b
  let offset = 0;                                                    // "simular passagem do tempo"
  const hoje = () => { const d = new Date(); d.setDate(d.getDate() + offset); return iso(d); };
  const fmtData = (s, longo) => {
    const d = parse(s);
    const sem = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d.getDay()];
    const mes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d.getMonth()];
    return longo ? `${sem}, ${d.getDate()} ${mes}` : `${d.getDate()} ${mes}`;
  };
  const fmtRel = s => { const n = diff(hoje(), s); return n === 0 ? 'hoje' : n === 1 ? 'amanhã' : n === -1 ? 'ontem' : n > 0 ? `em ${n} dias` : `há ${-n} dias`; };

  /* ---------------- índice do conteúdo ---------------- */
  /* Cartão de evocação vira questão objetiva: nada de "você lembrou?" (autoavaliação não é dado).
     As alternativas erradas são respostas de OUTRAS perguntas da mesma unidade, escolhidas de forma
     determinística (hash do id), e o retorno diz de qual pergunta cada uma é. */
  const hash = t => { let h = 7; for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  function cartoesViramQuestao(cj) {
    const itens = cj.topicos.flatMap(t => t.itens || []);
    const pool = [
      ...itens.filter(i => i.tipo === 'cartao' || i._cartao).map(i => ({ id: i.id, t: i._cartao ? i._cartao.verso : i.verso, de: i._cartao ? i._cartao.frente : i.frente })),
      ...itens.filter(i => i.tipo === 'mc' && !i._cartao).map(i => ({ id: i.id, t: (i.opcoes.find(o => o.ok) || {}).t, de: i.enunciado })),
    ].filter(p => p.t);
    for (const it of itens) {
      if (it.tipo !== 'cartao') continue;
      const outros = pool.filter(p => p.id !== it.id && p.t !== it.verso)
        .sort((x, y) => hash(it.id + x.id) - hash(it.id + y.id)).slice(0, 3);
      if (outros.length < 3) continue; // conjunto pequeno demais: fica como está
      it._cartao = { frente: it.frente, verso: it.verso };
      it.tipo = 'mc';
      it.enunciado = it.frente;
      it.opcoes = [{ t: it.verso, ok: true }, ...outros.map(p => ({ t: p.t, erro: `confunde com outra ideia da unidade: essa frase responde "${p.de}"` }))]
        .sort((x, y) => hash(it.id + x.t) - hash(it.id + y.t));
    }
  }

  let IDX = null;
  function indexar(st) {
    const conjuntos = [...C.conteudo, ...((st && st.conjuntosUsuario) || [])];
    const idx = { conjuntos: {}, topicos: {}, itens: {}, dependentes: {} };
    for (const cj of conjuntos) {
      cartoesViramQuestao(cj);
      idx.conjuntos[cj.id] = cj;
      cj.topicos.forEach((t, ordem) => {
        idx.topicos[t.id] = Object.assign(t, { conjunto: cj.id, materia: cj.materia, ordem });
        (t.itens || []).forEach(it => (idx.itens[it.id] = Object.assign(it, { topico: t.id })));
        for (const p of t.prereq || []) (idx.dependentes[p] = idx.dependentes[p] || []).push(t.id);
      });
    }
    IDX = idx;
    return idx;
  }
  const idx = () => IDX || indexar();
  const cacheChefe = {};
  function topico(id) {
    if (!ehChefe(id)) return idx().topicos[id];
    const cjId = id.slice(CHEFE.length), cj = idx().conjuntos[cjId];
    if (!cj) return null;
    if (!cacheChefe[id] || cacheChefe[id]._cj !== cj) cacheChefe[id] = {
      _cj: cj, id, chefe: true, nome: 'Chefão · ' + cj.titulo, resumo: 'Simulado da unidade: questões de todos os tópicos, misturadas.',
      materia: cj.materia, conjunto: cjId, prereq: [], ordem: cj.topicos.length, fonte: cj.titulo,
      itens: cj.topicos.flatMap(t => t.itens || []),
    };
    return cacheChefe[id];
  }
  function chefeEstado(st, cjId) {
    const cj = idx().conjuntos[cjId];
    if (!cj) return 'bloqueado';
    if ((st.chefes || {})[cjId]) return 'vencido';
    return cj.topicos.every(t => ((st.topicos[t.id] || {}).caixa || 0) >= P.limiarPrereq) ? 'disponivel' : 'bloqueado';
  }
  const ativos = st => Object.values(idx().conjuntos).filter(cj => (st.conjuntosAtivos || []).includes(cj.id));
  const topicosAtivos = st => ativos(st).flatMap(cj => cj.topicos.map(t => t.id));

  /* ---------------- Pilar VI · intervalos das caixas ---------------- */
  function horizonte(st) {
    const d = st.perfil && st.perfil.prova ? diff(hoje(), st.perfil.prova) : 90;
    return Math.max(7, d);
  }
  function intervalos(st) {
    const H = horizonte(st);
    const max = Math.min(60, Math.max(4, Math.round(H * P.razaoCepeda)));
    const out = [0];
    for (let k = 1; k <= P.caixas; k++) {
      const v = Math.round(Math.pow(max, (k - 1) / (P.caixas - 1)));
      out.push(Math.max(v, (out[k - 1] || 0) + 1));
    }
    return out; // out[caixa] = dias até a próxima revisão
  }

  /* ---------------- estado de cada tópico (5 estados + bloqueado) ---------------- */
  const reg = (st, id) => (st.topicos[id] = st.topicos[id] || { caixa: 0, tentativas: [], rodadas: [] });
  function prereqOk(st, id) {
    return (topico(id).prereq || []).every(p => ((st.topicos[p] || {}).caixa || 0) >= P.limiarPrereq);
  }
  function estado(st, id) {
    if (ehChefe(id)) return { vencido: 'consolidado', disponivel: 'novo', bloqueado: 'bloqueado' }[chefeEstado(st, id.slice(CHEFE.length))];
    const t = st.topicos[id] || { caixa: 0, tentativas: [] };
    if (t.travado) {
      const pr = st.topicos[t.travado.por] || {};
      if (!((pr.ultimoOkEm || 0) > (t.travado.em || 0))) return 'bloqueado';
    }
    if (!t.caixa && !prereqOk(st, id)) return 'bloqueado';
    if (!t.caixa) return t.tentativas.length ? 'pratica' : 'novo';
    const h = hoje();
    if (!t.proxima || t.proxima > h) return 'consolidado';
    return t.proxima === h ? 'agendado' : 'vencido';
  }
  const ROTULO = {
    novo: 'Não iniciado', pratica: 'Em prática', consolidado: 'Consolidado',
    agendado: 'Revisar hoje', vencido: 'Revisão atrasada', bloqueado: 'Bloqueado',
  };
  function porqueEstado(st, id) {
    if (ehChefe(id)) {
      const ce = chefeEstado(st, id.slice(CHEFE.length));
      return ce === 'vencido' ? 'Chefão vencido: unidade concluída, troféu e roupa da Capi garantidos.'
        : ce === 'disponivel' ? `Todos os tópicos chegaram à caixa ${P.limiarPrereq}. Vença uma sequência de ${P.chefe.criterio} pontos com questões da unidade inteira.`
          : `Libera quando todos os tópicos da unidade chegarem à caixa ${P.limiarPrereq}.`;
    }
    const t = st.topicos[id] || { caixa: 0, tentativas: [] }, e = estado(st, id), T = topico(id);
    const nomes = ids => ids.map(i => topico(i).nome).join(' e ');
    switch (e) {
      case 'bloqueado':
        if (t.travado) return `Chegou ao teto de ${P.teto} tentativas numa rodada. Antes de voltar, revise ${nomes([t.travado.por])}: é a base deste tópico.`;
        return `Libera quando ${nomes(T.prereq.filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq))} chegar à caixa ${P.limiarPrereq}.`;
      case 'novo': return 'Pré-requisitos consolidados. Pronto para a primeira rodada.';
      case 'pratica': return 'Já teve tentativas, mas ainda não venceu uma rodada.';
      case 'consolidado': return `Caixa ${t.caixa}. Próxima revisão ${fmtRel(t.proxima)} (${fmtData(t.proxima, true)}).`;
      case 'agendado': return `Caixa ${t.caixa}. A revisão de hoje pega a memória no ponto em que lembrar ainda é possível, mas já exige esforço.`;
      case 'vencido': return `Caixa ${t.caixa}. A revisão era ${fmtRel(t.proxima)}. Revisões atrasadas vêm primeiro na próxima partida.`;
    }
  }
  const dominio = (st, id) => Math.round((((st.topicos[id] || {}).caixa || 0) / P.caixas) * 100);
  function dominioMateria(st, mat) {
    const ids = topicosAtivos(st).filter(i => topico(i).materia === mat);
    if (!ids.length) return 0;
    return Math.round(ids.reduce((s, i) => s + dominio(st, i), 0) / ids.length);
  }

  /* ---------------- Pilar I · proposta de sessão ---------------- */
  function candidatos(st, filtroMateria) {
    const ids = topicosAtivos(st).filter(i => !filtroMateria || topico(i).materia === filtroMateria);
    const h = hoje(), por = { vencido: [], agendado: [], pratica: [], novo: [] };
    for (const id of ids) { const e = estado(st, id); if (por[e]) por[e].push(id); }
    por.vencido.sort((a, b) => (st.topicos[a].proxima < st.topicos[b].proxima ? -1 : 1));
    por.novo.sort((a, b) => topico(a).ordem - topico(b).ordem);
    por.pratica.sort((a, b) => topico(a).ordem - topico(b).ordem);
    return por;
  }
  function proposta(st, { rodadas, filtroMateria, rota } = {}) {
    const c = candidatos(st, filtroMateria);
    const obrig = [...c.vencido.map(id => ({ id, tipo: 'revisao', motivo: 'atrasada' })),
                   ...c.agendado.map(id => ({ id, tipo: 'revisao', motivo: 'hoje' }))];
    const livres = [...c.pratica, ...c.novo];
    const escolhidos = (rota || []).filter(id => livres.includes(id));
    const resto = livres.filter(id => !escolhidos.includes(id));
    const opc = [...escolhidos, ...resto].map(id => ({ id, tipo: estado(st, id) === 'pratica' ? 'pratica' : 'novo', motivo: estado(st, id) }));
    const total = [...obrig, ...opc];
    const sugerido = Math.max(P.rodadas.min, Math.min((st.perfil && st.perfil.ritmo) || P.rodadas.padrao, total.length));
    const n = Math.max(P.rodadas.min, Math.min(P.rodadas.max, rodadas || sugerido, total.length || 1));
    return { itens: total.slice(0, n), max: Math.min(P.rodadas.max, total.length), obrigatorios: obrig.length, livres, sugerido };
  }
  const regraProposta = () =>
    `Primeiro as revisões atrasadas (as mais antigas antes), depois as de hoje, depois tópicos em prática e novos cujos pré-requisitos já chegaram à caixa ${P.limiarPrereq}. Você escolhe quantas rodadas (${P.rodadas.min} a ${P.rodadas.max}) e quais tópicos novos entram.`;

  /* ---------------- Pilar V · recompensa anunciada ---------------- */
  function recompensa(st, itens) {
    const out = [];
    const simulado = JSON.parse(JSON.stringify(st.topicos));
    for (const it of itens.filter(i => ehChefe(i.id))) {
      const cjId = it.id.slice(CHEFE.length), m = idx().conjuntos[cjId].materia;
      out.push({ tipo: 'trofeu', conjunto: cjId });
      if (!(st.roupas || []).includes(m)) out.push({ tipo: 'roupa', materia: m });
    }
    for (const it of itens.filter(i => !ehChefe(i.id) && i.tipo !== 'extra')) {
      const t = simulado[it.id] || { caixa: 0 };
      const nova = it.tipo === 'revisao' ? Math.min(P.caixas, (t.caixa || 0) + 1) : Math.max(1, t.caixa || 0);
      simulado[it.id] = Object.assign({}, t, { caixa: nova });
      out.push({ tipo: 'caixa', id: it.id, de: t.caixa || 0, para: nova });
    }
    const libera = new Set();
    for (const it of itens) for (const dep of idx().dependentes[it.id] || []) {
      if (!topicosAtivos(st).includes(dep) || (st.topicos[dep] || {}).caixa) continue;
      const ok = (topico(dep).prereq || []).every(p => ((simulado[p] || {}).caixa || 0) >= P.limiarPrereq);
      if (ok && estado(st, dep) === 'bloqueado') libera.add(dep);
    }
    libera.forEach(id => out.push({ tipo: 'libera', id }));
    const cjs = new Set(itens.filter(i => !ehChefe(i.id)).map(i => topico(i.id).conjunto));
    cjs.forEach(cjId => {
      const cj = idx().conjuntos[cjId];
      if (chefeEstado(st, cjId) === 'bloqueado' && cj.topicos.every(t => ((simulado[t.id] || {}).caixa || 0) >= P.limiarPrereq)) out.push({ tipo: 'chefe', conjunto: cjId });
    });
    return out;
  }

  /* ---------------- escalonamento dentro da rodada (banda-alvo) ---------------- */
  function taxa(hist) {
    const v = { ok: 1, quase: 0.5, erro: 0 };
    const h = hist.slice(-6);
    return h.length ? h.reduce((s, r) => s + v[r], 0) / h.length : null;
  }
  function nivelAlvo(st, id, rodada) {
    const caixa = ehChefe(id) ? 2 : (st.topicos[id] || {}).caixa || 0;
    let n = caixa >= 3 ? 2 : caixa >= 1 ? 1 : 0;
    const tx = taxa(rodada.hist);
    if (tx !== null && rodada.hist.length >= 2) {
      if (tx > P.banda[1]) n++;
      else if (tx < P.banda[0]) n--;
    }
    return Math.max(0, Math.min(2, n));
  }
  function escolherItem(st, id, rodada) {
    const itens = topico(id).itens || [];
    const alvo = nivelAlvo(st, id, rodada);
    const usados = new Set(rodada.usados);
    const ultimo = rodada.usados[rodada.usados.length - 1];
    const pool = itens.filter(i => !usados.has(i.id));
    const base = pool.length ? pool : itens.filter(i => i.id !== ultimo);
    const custo = i => Math.abs(NIVEIS.indexOf(i.nivel) - alvo) * 10 + (i.dif || 1);
    const escolhido = [...base].sort((a, b) => custo(a) - custo(b))[0];
    return { item: escolhido, alvo: NIVEIS[alvo] };
  }

  /* ---------------- avaliação da resposta ---------------- */
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function avaliar(item, resp) {
    const fmt = item.tipo === 'transfer' ? item.formato : item.tipo;
    if (fmt === 'mc') {
      const op = item.opcoes[resp];
      return op && op.ok ? { res: 'ok' } : { res: 'erro', erroOpcao: op && op.erro };
    }
    if (fmt === 'multi') {
      const marc = new Set(resp || []);
      const corretas = item.opcoes.map((o, i) => (o.ok ? i : -1)).filter(i => i >= 0);
      const acertou = corretas.filter(i => marc.has(i)).length;
      const erradas = [...marc].filter(i => !item.opcoes[i].ok).length;
      const etapas = item.opcoes.map((o, i) => ({ t: o.t, ok: o.ok, marcada: marc.has(i), certo: !!o.ok === marc.has(i), erro: o.erro }));
      if (acertou === corretas.length && !erradas) return { res: 'ok', etapas };
      return { res: acertou > 0 ? 'quase' : 'erro', etapas };
    }
    if (fmt === 'aberta') {
      const txt = norm(resp);
      const crit = item.criterios.map(c => ({ rotulo: c.rotulo, ok: c.chaves.some(k => txt.includes(norm(k))) }));
      const n = crit.filter(c => c.ok).length;
      return { res: n === crit.length ? 'ok' : n > 0 ? 'quase' : 'erro', criterios: crit };
    }
    if (fmt === 'cartao') return { res: { tudo: 'ok', parte: 'quase', nada: 'erro' }[resp] || 'erro', auto: true };
    return { res: 'erro' };
  }

  /* ---------------- Pilar III · rodada ---------------- */
  function novaRodada(st, id, tipo) {
    return { id, tipo, usados: [], hist: [], sequencia: 0, tentativas: 0, primeira: null, caixaAntes: (st.topicos[id] || {}).caixa || 0 };
  }
  const criterioDe = id => (ehChefe(id) ? P.chefe.criterio : P.criterio);
  const tetoDe = id => (ehChefe(id) ? P.chefe.teto : P.teto);
  function registrar(st, rodada, item, aval, agora) {
    const t = reg(st, ehChefe(rodada.id) ? item.topico : rodada.id);
    const r = aval.res;
    rodada.usados.push(item.id);
    rodada.hist.push(r);
    rodada.tentativas++;
    if (rodada.primeira === null) rodada.primeira = r;
    if (r === 'ok') rodada.sequencia += P.pesos[item.nivel] || 1;
    else if (r === 'erro') rodada.sequencia = 0;
    if (r !== 'ok') { rodada.errosTop = rodada.errosTop || {}; rodada.errosTop[item.topico] = (rodada.errosTop[item.topico] || 0) + 1; }
    t.tentativas.push({ em: agora || Date.now(), dia: hoje(), item: item.id, res: r });
    st.dias = st.dias || {};
    st.dias[hoje()] = true;
    const venceu = rodada.sequencia >= criterioDe(rodada.id);
    const teto = !venceu && rodada.tentativas >= tetoDe(rodada.id);
    return { venceu, teto, fim: venceu || teto, progresso: Math.min(1, rodada.sequencia / criterioDe(rodada.id)) };
  }
  function fecharChefe(st, rodada) {
    const cjId = rodada.id.slice(CHEFE.length), cj = idx().conjuntos[cjId], h = hoje();
    const venceu = rodada.sequencia >= P.chefe.criterio;
    const out = { id: rodada.id, chefe: true, conjunto: cjId, venceu, tentativas: rodada.tentativas, caixaAntes: 0, caixaDepois: 0, liberou: [] };
    if (venceu) {
      st.chefes = st.chefes || {};
      st.chefes[cjId] = { dia: h, tentativas: rodada.tentativas };
      out.trofeu = cjId;
      st.roupas = st.roupas || [];
      if (!st.roupas.includes(cj.materia)) { st.roupas.push(cj.materia); out.roupa = cj.materia; }
      out.regra = `Sequência de ${P.chefe.criterio} pontos com a unidade inteira misturada: ${cj.titulo} está concluída.`;
    } else {
      const piores = Object.entries(rodada.errosTop || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
      piores.forEach(id => { const t = reg(st, id); if (t.caixa) t.proxima = h; });
      out.revisar = piores;
      out.regra = `Teto de ${P.chefe.teto} tentativas. Os tópicos que mais pesaram entram na revisão de hoje. O Chefão continua liberado para quando você quiser.`;
    }
    return out;
  }
  function fecharRodada(st, rodada) {
    if (ehChefe(rodada.id)) return fecharChefe(st, rodada);
    if (rodada.tipo === 'extra') {
      const t = reg(st, rodada.id), h = hoje(), venceu = rodada.sequencia >= P.criterio;
      const out = { id: rodada.id, caixaAntes: t.caixa, caixaDepois: t.caixa, tentativas: rodada.tentativas, venceu, liberou: [], extra: true };
      if (venceu) out.regra = `Treino extra vencido. A caixa só sobe na revisão do dia certo (${fmtData(t.proxima, true)}): é o intervalo que fixa.`;
      else { t.proxima = h; out.regra = 'O treino mostrou que o tópico está escapando: ele entra na revisão de hoje.'; }
      out.proxima = t.proxima;
      (t.rodadas = t.rodadas || []).push({ dia: h, venceu, tentativas: rodada.tentativas, de: t.caixa, para: t.caixa, tipo: 'extra' });
      return out;
    }
    const t = reg(st, rodada.id), h = hoje(), iv = intervalos(st);
    const antes = t.caixa || 0;
    const out = { id: rodada.id, caixaAntes: antes, tentativas: rodada.tentativas, venceu: rodada.sequencia >= P.criterio };
    const liberaveis = (idx().dependentes[rodada.id] || []).filter(d => estado(st, d) === 'bloqueado');
    if (out.venceu) {
      if (rodada.tipo === 'revisao') t.caixa = rodada.primeira === 'erro' ? 1 : Math.min(P.caixas, antes + 1);
      else t.caixa = Math.max(1, antes);
      t.proxima = addDias(h, iv[t.caixa]);
      t.ultimoOk = h;
      t.ultimoOkEm = Date.now();
      t.travado = null;
      out.regra = rodada.tipo === 'revisao'
        ? (rodada.primeira === 'erro'
          ? `Na revisão vale a primeira tentativa. Ela não saiu, então o tópico volta para a caixa 1 e revisa de novo em ${iv[1]} dia(s).`
          : `Na revisão vale a primeira tentativa. Ela saiu, então o tópico sobe para a caixa ${t.caixa}: próxima revisão em ${iv[t.caixa]} dias.`)
        : `Primeira rodada vencida: o tópico entra na caixa 1 e revisa em ${iv[1]} dia(s).`;
    } else {
      t.caixa = 0;
      t.proxima = null;
      const pre = (topico(rodada.id).prereq || []).slice().sort((a, b) => ((st.topicos[a] || {}).caixa || 0) - ((st.topicos[b] || {}).caixa || 0))[0];
      if (pre) {
        t.travado = { por: pre, desde: h, em: Date.now() };
        const tp = reg(st, pre);
        if (tp.caixa) tp.proxima = h;
        out.redireciona = pre;
        out.regra = `Teto de ${P.teto} tentativas. Insistir agora só cansa: o tópico volta para a caixa 0 e a prática vai para ${topico(pre).nome}, que é a base dele.`;
      } else {
        out.regra = `Teto de ${P.teto} tentativas. O tópico volta para a caixa 0. Na próxima partida ele volta com questões mais diretas.`;
      }
    }
    out.caixaDepois = t.caixa;
    out.proxima = t.proxima;
    t.rodadas = t.rodadas || [];
    t.rodadas.push({ dia: h, venceu: out.venceu, tentativas: rodada.tentativas, de: antes, para: t.caixa, tipo: rodada.tipo });
    out.liberou = liberaveis.filter(d => estado(st, d) !== 'bloqueado');
    const cjId = topico(rodada.id).conjunto;
    if (out.venceu && chefeEstado(st, cjId) === 'disponivel' && !(st.chefeAvisado || {})[cjId]) { out.chefeLiberado = cjId; st.chefeAvisado = Object.assign(st.chefeAvisado || {}, { [cjId]: h }); }
    return out;
  }

  /* ---------------- Pilar IV · camada de regulação ---------------- */
  function regulacao(st, rodada, res) {
    if (res === 'fim') return null;
    const alvo = nivelAlvo(st, rodada.id, rodada);
    const falta = Math.max(0, criterioDe(rodada.id) - rodada.sequencia);
    const nivel = ['mais direta, de lembrar', 'de entender o conceito', 'de aplicar em situação nova'][alvo];
    if (res === 'erro') return `A próxima questão é ${nivel}, sobre o mesmo ponto. A sequência recomeça.`;
    if (res === 'quase') return `A sequência fica onde estava. A próxima questão é ${nivel}.`;
    const nf = String(falta).replace('.', ',');
    return falta ? `${falta < 2 ? 'Falta' : 'Faltam'} ${nf} ${falta < 2 ? 'ponto' : 'pontos'} de sequência. A próxima é ${nivel}.` : 'Critério de domínio atingido.';
  }

  /* ---------------- constância, agenda, tempo ---------------- */
  function ultimos14(st) {
    const h = hoje(), out = [];
    for (let i = 13; i >= 0; i--) { const d = addDias(h, -i); out.push({ dia: d, on: !!(st.dias || {})[d] }); }
    return out;
  }
  function agenda(st, dias = 14) {
    const h = hoje(), out = [];
    for (let i = 0; i < dias; i++) {
      const d = addDias(h, i);
      const ids = topicosAtivos(st).filter(id => {
        const t = st.topicos[id];
        return t && t.caixa && t.proxima && (i === 0 ? t.proxima <= d : t.proxima === d);
      });
      out.push({ dia: d, ids });
    }
    return out;
  }
  function minutosHoje(st) {
    const h = hoje();
    return Math.round((st.sessoes || []).filter(s => s.dia === h).reduce((s, x) => s + ((x.fim || x.inicio) - x.inicio), 0) / 60000);
  }
  function proximaRevisao(st) {
    const ds = topicosAtivos(st).map(id => st.topicos[id]).filter(t => t && t.caixa && t.proxima).map(t => t.proxima).sort();
    const h = hoje();
    return ds.find(d => d > h) || ds[0] || null;
  }

  C.regras = {
    versao: '1.1', P, MATERIAS, NIVEIS, ROTULO, ehChefe, chefeId, chefeEstado, criterioDe, tetoDe,
    datas: { hoje, iso, parse, addDias, diff, fmtData, fmtRel, setOffset: n => (offset = n || 0), getOffset: () => offset },
    indexar, idx, topico, ativos, topicosAtivos,
    horizonte, intervalos, estado, porqueEstado, dominio, dominioMateria, prereqOk,
    candidatos, proposta, regraProposta, recompensa,
    nivelAlvo, escolherItem, avaliar, novaRodada, registrar, fecharRodada, regulacao,
    ultimos14, agenda, minutosHoje, proximaRevisao, norm,
  };
})();
