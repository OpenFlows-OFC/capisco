/* =========================================================
   CAPISCO · Motor de regras v1.2
   Todas as decisões do jogo saem daqui: são determinísticas, versionadas
   e cada uma tem um texto que a explica (Pilar IV · Progressão Legível).
   ========================================================= */
(function () {
  const C = (window.CAPISCO = window.CAPISCO || {});
  C.conteudo = C.conteudo || [];

  const P = {
    pesos: { lembrar: 2, compreender: 3, aplicar: 4 },
    criterio: 6,            // soma de pesos em acertos seguidos que vence a rodada
    teto: 8,                // tentativas máximas por rodada (carga cognitiva)
    banda: [0.6, 0.85],     // faixa-alvo de acerto (fluxo + carga cognitiva)
    razaoCepeda: 0.15,      // último intervalo ≈ 15% dos dias até a prova
    caixas: 5,
    limiarPrereq: 1,        // caixa mínima do pré-requisito para liberar o tópico
    limiarChefe: 2,         // caixa mínima de todos os tópicos para liberar o Chefão (≥ 1 revisão espaçada)
    limiar: 0.85,           // probabilidade-alvo de lembrar no dia agendado (agendamento no ponto de esforço)
    rodadas: { min: 1, max: 5, padrao: 3 },
    deliberacao: 1200,      // ms mínimos antes de liberar o "Continuar" (intervalo deliberativo)
    deliberacaoMax: 3500,   // ...crescendo com o tamanho da explicação, até este teto
    chefe: { criterio: 10, teto: 12, topicos: 4 }, // simulado: sequência maior, acertos em pelo menos 4 tópicos diferentes
    historico: 300,         // tentativas guardadas por tópico (as mais antigas saem)
  };
  const CHEFE = 'chefe:';
  const ehChefe = id => typeof id === 'string' && id.startsWith(CHEFE);
  const chefeId = cjId => CHEFE + cjId;
  const NIVEIS = ['lembrar', 'compreender', 'aplicar'];
  const NIVEL = ['Novo', 'Aprendendo', 'Firmando', 'Firme', 'Forte', 'Dominado'];
  const nivelTxt = k => `nível ${k} (${NIVEL[k] || ''})`;
  const MATERIAS = {
    bio: { n: 'Biologia', c: '#58b847' }, qui: { n: 'Química', c: '#3fa9f5' },
    fis: { n: 'Física', c: '#8b6cff' }, mat: { n: 'Matemática', c: '#ff7a6b' },
    his: { n: 'História', c: '#e0a100' }, geo: { n: 'Geografia', c: '#0b8577' },
    por: { n: 'Português', c: '#c98a4b' }, red: { n: 'Redação', c: '#e05c9a' },
  };

  /* ---------------- datas (dia local, sem fuso) ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const ehData = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const parse = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const addDias = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5); // dias de a até b
  let offset = 0;                                                    // "simular passagem do tempo" (modo demonstração)
  const hoje = () => { const d = new Date(); d.setDate(d.getDate() + offset); return iso(d); };
  const fmtData = (s, longo) => {
    if (!ehData(s)) return '—';
    const d = parse(s);
    const sem = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d.getDay()];
    const mes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d.getMonth()];
    return longo ? `${sem}, ${d.getDate()} ${mes}` : `${d.getDate()} ${mes}`;
  };
  const fmtRel = s => { if (!ehData(s)) return '—'; const n = diff(hoje(), s); return n === 0 ? 'hoje' : n === 1 ? 'amanhã' : n === -1 ? 'ontem' : n > 0 ? `em ${n} dias` : `há ${-n} dias`; };

  /* ---------------- índice do conteúdo ---------------- */
  const hash = t => { let h = 7; for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  /* Cartão de evocação vira questão objetiva (nada de "você lembrou?": autoavaliação não é dado).
     As alternativas erradas são respostas de OUTRAS perguntas da mesma unidade, escolhidas de forma
     determinística, e o retorno diz de qual pergunta cada uma é. Feito numa CÓPIA: a fonte (inclusive
     os conjuntos criados pelo aluno) nunca é alterada nem salva convertida. */
  function cartoesViramQuestao(cj) {
    const itens = cj.topicos.flatMap(t => t.itens || []);
    const pool = [
      ...itens.filter(i => i.tipo === 'cartao').map(i => ({ id: i.id, t: i.verso, de: i.frente, cartao: true })),
      ...itens.filter(i => i.tipo === 'mc').map(i => ({ id: i.id, t: (i.opcoes.find(o => o.ok) || {}).t, de: i.enunciado })),
    ].filter(p => p.t && p.de);
    for (const it of itens) {
      if (it.tipo !== 'cartao') continue;
      const certa = norm(it.verso);
      const validos = pool.filter(p => { const n = norm(p.t); return p.id !== it.id && n !== certa && !certa.includes(n) && !n.includes(certa); });
      const ordem = (x, y) => hash(it.id + x.id) - hash(it.id + y.id);
      const outros = [...validos.filter(p => p.cartao).sort(ordem), ...validos.filter(p => !p.cartao).sort(ordem)].slice(0, 3);
      if (outros.length < 3) continue; // conjunto pequeno demais: fica como evocação
      it.reconhecimento = true;
      it.tipo = 'mc';
      it.enunciado = it.frente;
      it.opcoes = [{ t: it.verso, ok: true }, ...outros.map(p => ({ t: p.t, erro: `troca as definições: essa frase é a resposta de "${p.de}"` }))];
    }
  }

  let IDX = null;
  function indexar(st) {
    const fonte = [...C.conteudo, ...((st && st.conjuntosUsuario) || [])];
    const idx = { conjuntos: {}, topicos: {}, itens: {}, dependentes: {} };
    for (const original of fonte) {
      const cj = JSON.parse(JSON.stringify(original));
      cartoesViramQuestao(cj);
      idx.conjuntos[cj.id] = cj;
      cj.topicos.forEach((t, ordem) => {
        idx.topicos[t.id] = Object.assign(t, { conjunto: cj.id, materia: cj.materia, ordem });
        (t.itens || []).forEach(it => (idx.itens[it.id] = Object.assign(it, { topico: t.id })));
        for (const p of t.prereq || []) (idx.dependentes[p] = idx.dependentes[p] || []).push(t.id);
      });
    }
    IDX = idx;
    for (const k in cacheChefe) delete cacheChefe[k];
    return idx;
  }
  const idx = () => IDX || indexar();
  const cacheChefe = {};
  function topico(id) {
    if (!ehChefe(id)) return idx().topicos[id];
    const cjId = id.slice(CHEFE.length), cj = idx().conjuntos[cjId];
    if (!cj) return null;
    if (!cacheChefe[id]) cacheChefe[id] = {
      id, chefe: true, nome: 'Chefão · ' + cj.titulo, resumo: 'Simulado da unidade: questões de todos os tópicos, em rodízio.',
      materia: cj.materia, conjunto: cjId, prereq: [], ordem: cj.topicos.length, fonte: cj.titulo,
      itens: cj.topicos.flatMap(t => t.itens || []),
    };
    return cacheChefe[id];
  }
  function chefeEstado(st, cjId) {
    const cj = idx().conjuntos[cjId];
    if (!cj) return 'bloqueado';
    if ((st.chefes || {})[cjId]) return 'vencido';
    return cj.topicos.every(t => ((st.topicos[t.id] || {}).caixa || 0) >= P.limiarChefe) ? 'disponivel' : 'bloqueado';
  }
  const ativos = st => Object.values(idx().conjuntos).filter(cj => (st.conjuntosAtivos || []).includes(cj.id));
  const topicosAtivos = st => ativos(st).flatMap(cj => cj.topicos.map(t => t.id));

  /* ---------------- Pilar VI · intervalos das caixas ---------------- */
  function prova(st) {
    const p = st.perfil && st.perfil.prova;
    if (!ehData(p)) return { dias: null, passou: false };
    const d = diff(hoje(), p);
    return { dias: d, passou: d < 0 };
  }
  // horizonte usado no cálculo: dias até a prova (mín. 7); sem data ou prova já passada → consolidação de 90 dias
  function horizonte(st) {
    const pv = prova(st);
    if (pv.dias === null || pv.passou) return 90;
    return Math.max(7, pv.dias);
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
  /* Probabilidade estimada de lembrar hoje (curva de esquecimento exponencial, Ebbinghaus):
     R(t) = limiar^(t/I), onde I é o intervalo da caixa. Por construção, R = limiar no dia agendado.
     Determinística e consultável: é a regra que justifica o dia de cada revisão. */
  function recuperabilidade(st, id) {
    const t = st.topicos[id];
    if (!t || !t.caixa || !ehData(t.proxima)) return null;
    const I = intervalos(st)[t.caixa] || 1;
    const desde = Math.max(0, diff(addDias(t.proxima, -I), hoje()));
    return Math.round(Math.pow(P.limiar, desde / I) * 100);
  }

  /* ---------------- estado de cada tópico (5 estados + bloqueado) ---------------- */
  const reg = (st, id) => {
    const t = (st.topicos[id] = st.topicos[id] || { caixa: 0, tentativas: [], rodadas: [] });
    t.tentativas = t.tentativas || []; t.rodadas = t.rodadas || [];
    return t;
  };
  function prereqOk(st, id) {
    return (topico(id).prereq || []).every(p => ((st.topicos[p] || {}).caixa || 0) >= P.limiarPrereq);
  }
  function travadoAtivo(st, id) {
    const t = st.topicos[id];
    if (!t || !t.travado) return false;
    const pr = st.topicos[t.travado.por] || {};
    if (t.travado.desde && t.travado.desde < hoje()) return false; // no dia seguinte destrava sozinho
    return !((pr.ultimoOkEm || 0) > (t.travado.em || 0));
  }
  function estado(st, id) {
    if (ehChefe(id)) return { vencido: 'consolidado', disponivel: 'novo', bloqueado: 'bloqueado' }[chefeEstado(st, id.slice(CHEFE.length))];
    const t = st.topicos[id] || { caixa: 0, tentativas: [] };
    if (!t.caixa && travadoAtivo(st, id)) return 'bloqueado';
    if (!t.caixa && !prereqOk(st, id)) return 'bloqueado';
    if (!t.caixa) return (t.tentativas || []).length ? 'pratica' : 'novo';
    const h = hoje();
    if (!t.proxima || t.proxima > h) return 'consolidado';
    return t.proxima === h ? 'agendado' : 'vencido';
  }
  const ROTULO = {
    novo: 'Não iniciado', pratica: 'Em prática', consolidado: 'Consolidado',
    agendado: 'Revisar hoje', vencido: 'Revisão atrasada', bloqueado: 'Bloqueado',
  };
  const nomeDe = i => (topico(i) || { nome: 'um tópico removido' }).nome;
  function porqueEstado(st, id) {
    if (ehChefe(id)) {
      const ce = chefeEstado(st, id.slice(CHEFE.length));
      return ce === 'vencido' ? 'Chefão vencido: troféu e roupa da Capi entregues. As revisões continuam chegando na hora certa.'
        : ce === 'disponivel' ? `Todos os tópicos já passaram por uma revisão espaçada (${nivelTxt(P.limiarChefe)}). Vença uma sequência de ${P.chefe.criterio} pontos acertando questões de pelo menos ${P.chefe.topicos} tópicos diferentes.`
          : `Libera quando todos os tópicos da unidade chegarem ao ${nivelTxt(P.limiarChefe)}, ou seja, depois de pelo menos uma revisão espaçada de cada um.`;
    }
    const t = st.topicos[id] || { caixa: 0, tentativas: [] }, e = estado(st, id), T = topico(id);
    const nomes = ids => ids.map(nomeDe).join(' e ');
    const r = recuperabilidade(st, id);
    switch (e) {
      case 'bloqueado':
        if (t.travado && travadoAtivo(st, id)) return `Chegou ao teto de ${P.teto} tentativas na primeira vez. Antes de voltar, vença uma rodada de ${nomes([t.travado.por])}: é a base deste tópico.`;
        return `Libera quando você vencer a primeira rodada de ${nomes((T.prereq || []).filter(p => ((st.topicos[p] || {}).caixa || 0) < P.limiarPrereq))}.`;
      case 'novo': return 'Pré-requisitos consolidados. Pronto para a primeira rodada.';
      case 'pratica': return 'Já teve tentativas, mas ainda não venceu uma rodada.';
      case 'consolidado': return `${NIVEL[t.caixa]} (nível ${t.caixa} de 5). Chance estimada de lembrar hoje: ~${r}%. A revisão fica para ${fmtData(t.proxima, true)}, quando ela cai para ~${Math.round(P.limiar * 100)}%.`;
      case 'agendado': return `${NIVEL[t.caixa]} (nível ${t.caixa} de 5). Hoje a chance estimada de lembrar chegou a ~${r}%: lembrar ainda é possível, mas já exige esforço. É o ponto ideal de revisar.`;
      case 'vencido': return `${NIVEL[t.caixa]} (nível ${t.caixa} de 5). A revisão era ${fmtRel(t.proxima)} e já passou do ponto ideal (chance estimada ~${r}%). Revisões atrasadas vêm primeiro.`;
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
    const por = { vencido: [], agendado: [], pratica: [], novo: [] };
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
    `Primeiro as revisões atrasadas (as mais antigas antes), depois as de hoje, depois tópicos em prática e novos cuja base você já venceu. Você escolhe quantas rodadas (${P.rodadas.min} a ${P.rodadas.max}) e quais tópicos novos entram.`;

  /* ---------------- Pilar V · recompensa anunciada (só o que pode ser entregue) ---------------- */
  function recompensa(st, itens) {
    const out = [];
    const simulado = JSON.parse(JSON.stringify(st.topicos || {}));
    for (const it of itens.filter(i => ehChefe(i.id))) {
      const cjId = it.id.slice(CHEFE.length), cj = idx().conjuntos[cjId];
      if (!cj || (st.chefes || {})[cjId]) continue; // troféu já ganho não é anunciado de novo
      out.push({ tipo: 'trofeu', conjunto: cjId });
      if (!(st.roupas || []).includes(cj.materia)) out.push({ tipo: 'roupa', materia: cj.materia });
    }
    const ids = itens.map(i => i.id);
    for (const it of itens.filter(i => !ehChefe(i.id) && i.tipo !== 'extra')) {
      const t = simulado[it.id] || { caixa: 0 };
      const de = t.caixa || 0;
      if (it.tipo === 'revisao' && de >= P.caixas) { out.push({ tipo: 'mantem', id: it.id, caixa: de }); continue; }
      const para = it.tipo === 'revisao' ? Math.min(P.caixas, de + 1) : Math.max(1, de);
      simulado[it.id] = Object.assign({}, t, { caixa: para });
      out.push({ tipo: 'caixa', id: it.id, de, para, revisao: it.tipo === 'revisao' });
    }
    const libera = new Set();
    for (const it of itens) for (const dep of idx().dependentes[it.id] || []) {
      if (!topicosAtivos(st).includes(dep) || (st.topicos[dep] || {}).caixa) continue;
      const td = st.topicos[dep];
      if (td && td.travado && travadoAtivo(st, dep) && !ids.includes(td.travado.por)) continue; // travado por outro: não dá pra prometer
      const ok = (topico(dep).prereq || []).every(p => ((simulado[p] || {}).caixa || 0) >= P.limiarPrereq);
      if (ok && estado(st, dep) === 'bloqueado') libera.add(dep);
    }
    libera.forEach(id => out.push({ tipo: 'libera', id }));
    const cjs = new Set(itens.filter(i => !ehChefe(i.id)).map(i => topico(i.id).conjunto));
    cjs.forEach(cjId => {
      const cj = idx().conjuntos[cjId];
      if (chefeEstado(st, cjId) === 'bloqueado' && cj.topicos.every(t => ((simulado[t.id] || {}).caixa || 0) >= P.limiarChefe)) out.push({ tipo: 'chefe', conjunto: cjId });
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
  // quando cada item foi visto por último (0 = nunca): desempata a favor do menos visto
  function vistoEm(st, topicoId) {
    const m = {};
    for (const x of ((st.topicos[topicoId] || {}).tentativas || [])) m[x.item] = Math.max(m[x.item] || 0, x.em || 1);
    return m;
  }
  function escolherItem(st, id, rodada) {
    const T = topico(id);
    let itens = T.itens || [];
    const usados = new Set(rodada.usados);
    if (ehChefe(id)) {
      // rodízio: a próxima questão vem do tópico menos usado nesta rodada (nunca o mesmo da anterior)
      const cj = idx().conjuntos[T.conjunto];
      const uso = Object.fromEntries(cj.topicos.map(t => [t.id, 0]));
      for (const u of rodada.usados) { const it = idx().itens[u]; if (it) uso[it.topico]++; }
      const ultimoTop = rodada.usados.length ? (idx().itens[rodada.usados[rodada.usados.length - 1]] || {}).topico : null;
      const ordem = cj.topicos.map(t => t.id).filter(t => t !== ultimoTop || cj.topicos.length === 1)
        .sort((a, b) => uso[a] - uso[b] || topico(a).ordem - topico(b).ordem);
      itens = itens.filter(i => i.topico === ordem[0]);
    }
    const alvo = nivelAlvo(st, id, rodada);
    const ultimo = rodada.usados[rodada.usados.length - 1];
    const pool = itens.filter(i => !usados.has(i.id));
    const base = pool.length ? pool : itens.filter(i => i.id !== ultimo);
    const visto = {};
    for (const i of base) Object.assign(visto, vistoEm(st, i.topico));
    // custo = distância do nível-alvo + penalidade por já ter sido vista (mais recente = mais cara):
    // uma questão nunca vista um nível ao lado ganha de uma repetida no nível exato
    const vistas = base.filter(i => visto[i.id]).sort((a, b) => visto[a.id] - visto[b.id]);
    const pen = i => (visto[i.id] ? 1.2 + vistas.indexOf(i) / Math.max(1, vistas.length) : 0);
    const custo = i => Math.abs(NIVEIS.indexOf(i.nivel) - alvo) + pen(i);
    const escolhido = [...base].sort((a, b) => custo(a) - custo(b) || (a.dif || 1) - (b.dif || 1) || (a.id < b.id ? -1 : 1))[0];
    return { item: escolhido, alvo: NIVEIS[alvo] };
  }
  // tentativas máximas efetivas: nunca mais que o número de questões do tópico (sem repetir com gabarito recém-visto)
  const tetoDe = id => (ehChefe(id) ? P.chefe.teto : Math.min(P.teto, Math.max(2, ((topico(id) || {}).itens || []).length)));
  const pausa = item => Math.min(P.deliberacaoMax, P.deliberacao + 12 * String((item && item.explicacao) || '').length);
  const criterioDe = id => (ehChefe(id) ? P.chefe.criterio : P.criterio);
  const chefeTopicos = id => Math.min(P.chefe.topicos, (idx().conjuntos[id.slice(CHEFE.length)] || { topicos: [] }).topicos.length);

  /* ---------------- avaliação da resposta ---------------- */
  const tokens = s => norm(s).replace(/(\d),(\d)/g, '$1.$2').replace(/%/g, ' % ').split(/[^a-z0-9.%]+/).map(t => t.replace(/^\.+|\.+$/g, '')).filter(Boolean);
  // chave casa por início de palavra; números só com número exato ("88" não casa "880"; "2 mol" não casa "12 moléculas")
  function casaChave(toks, chave) {
    const ks = tokens(chave);
    if (!ks.length) return false;
    const num = x => /^\d+(\.\d+)?$/.test(x);
    const casa = (tok, k) => (num(k) ? num(tok) && parseFloat(tok) === parseFloat(k) : tok.startsWith(k));
    const nega = i => ['nao', 'nem', 'sem', 'nunca', 'nada'].some(n => toks.slice(Math.max(0, i - 5), i).includes(n));
    for (let i = 0; i + ks.length <= toks.length; i++) if (ks.every((k, j) => casa(toks[i + j], k)) && !nega(i)) return true;
    return false;
  }
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
      const erradas = [...marc].filter(i => item.opcoes[i] && !item.opcoes[i].ok).length;
      const etapas = item.opcoes.map((o, i) => ({ t: o.t, ok: o.ok, marcada: marc.has(i), certo: !!o.ok === marc.has(i), erro: o.erro }));
      if (acertou === corretas.length && !erradas) return { res: 'ok', etapas };
      return { res: acertou > 0 && erradas < acertou ? 'quase' : 'erro', etapas };
    }
    if (fmt === 'aberta') {
      const toks = tokens(resp);
      const enun = new Set(tokens(item.enunciado));
      const novas = toks.filter(t => !enun.has(t) && (t.length > 3 || /\d/.test(t)));
      if (!novas.length) return { res: 'erro', copia: true, criterios: item.criterios.map(c => ({ rotulo: c.rotulo, ok: false })) };
      const crit = item.criterios.map(c => ({ rotulo: c.rotulo, ok: c.chaves.some(k => casaChave(toks, k)) }));
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
  function registrar(st, rodada, item, aval, agora) {
    const t = reg(st, ehChefe(rodada.id) ? item.topico : rodada.id);
    const r = aval.res;
    rodada.usados.push(item.id);
    rodada.hist.push(r);
    rodada.tentativas++;
    if (rodada.primeira === null) rodada.primeira = r;
    if (r === 'ok') { rodada.sequencia += P.pesos[item.nivel] || 2; rodada.okTops = [...new Set([...(rodada.okTops || []), item.topico])]; }
    else if (r === 'erro') { rodada.sequencia = 0; rodada.okTops = []; }
    if (r !== 'ok') { rodada.errosTop = rodada.errosTop || {}; rodada.errosTop[item.topico] = (rodada.errosTop[item.topico] || 0) + 1; }
    t.tentativas.push({ em: agora || Date.now(), dia: hoje(), item: item.id, res: r });
    if (t.tentativas.length > P.historico) t.tentativas.splice(0, t.tentativas.length - P.historico);
    st.dias = st.dias || {};
    st.dias[hoje()] = true;
    const venceu = rodada.sequencia >= criterioDe(rodada.id) && (!ehChefe(rodada.id) || (rodada.okTops || []).length >= chefeTopicos(rodada.id));
    const teto = !venceu && rodada.tentativas >= tetoDe(rodada.id);
    return { venceu, teto, fim: venceu || teto, progresso: Math.min(1, rodada.sequencia / criterioDe(rodada.id)) };
  }
  function fecharChefe(st, rodada) {
    const cjId = rodada.id.slice(CHEFE.length), cj = idx().conjuntos[cjId], h = hoje();
    const venceu = rodada.sequencia >= P.chefe.criterio && (rodada.okTops || []).length >= chefeTopicos(rodada.id);
    const out = { id: rodada.id, chefe: true, conjunto: cjId, venceu, tentativas: rodada.tentativas, caixaAntes: 0, caixaDepois: 0, liberou: [] };
    if (venceu) {
      const jaTinha = !!(st.chefes || {})[cjId];
      st.chefes = st.chefes || {};
      if (!jaTinha) { st.chefes[cjId] = { dia: h, tentativas: rodada.tentativas }; out.trofeu = cjId; }
      st.roupas = st.roupas || [];
      if (!st.roupas.includes(cj.materia)) { st.roupas.push(cj.materia); out.roupa = cj.materia; }
      out.ganho = jaTinha ? 'treino' : 'chefe';
      out.regra = `Sequência de ${P.chefe.criterio} pontos com acertos em ${chefeTopicos(rodada.id)} tópicos diferentes: ${cj.titulo} ${jaTinha ? 'continua firme' : 'está concluída'}.`;
    } else {
      // perder não mexe na agenda (mexer permitiria promoção antes do intervalo): só aponta onde treinar
      const piores = Object.entries(rodada.errosTop || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
      out.revisar = piores;
      out.ganho = 'nenhum';
      out.regra = `Teto de ${P.chefe.teto} tentativas. Nada do que você já consolidou muda. Treinar os tópicos que mais pesaram ajuda antes de tentar de novo.`;
    }
    return out;
  }
  function fecharRodada(st, rodada) {
    if (ehChefe(rodada.id)) return fecharChefe(st, rodada);
    const h = hoje();
    if (rodada.tipo === 'extra') {
      const t = reg(st, rodada.id), venceu = rodada.sequencia >= P.criterio;
      const out = { id: rodada.id, caixaAntes: t.caixa, caixaDepois: t.caixa, tentativas: rodada.tentativas, venceu, liberou: [], extra: true, ganho: 'treino' };
      if (venceu) out.regra = `Treino extra vencido. O nível só sobe na revisão do dia certo (${fmtData(t.proxima, true)}): é o intervalo que fixa.`;
      else { if (t.proxima > addDias(h, 1)) t.proxima = addDias(h, 1); out.regra = 'O treino mostrou que o tópico está escapando: a revisão dele foi antecipada para amanhã.'; }
      out.proxima = t.proxima;
      t.rodadas.push({ dia: h, venceu, tentativas: rodada.tentativas, de: t.caixa, para: t.caixa, tipo: 'extra' });
      return out;
    }
    const t = reg(st, rodada.id), iv = intervalos(st);
    const antes = t.caixa || 0;
    const out = { id: rodada.id, caixaAntes: antes, tentativas: rodada.tentativas, venceu: rodada.sequencia >= P.criterio };
    const liberaveis = (idx().dependentes[rodada.id] || []).filter(d => estado(st, d) === 'bloqueado');
    if (out.venceu) {
      if (rodada.tipo === 'revisao') {
        t.caixa = rodada.primeira === 'ok' ? Math.min(P.caixas, antes + 1) : rodada.primeira === 'quase' ? Math.max(1, antes) : 1;
      } else t.caixa = Math.max(1, antes);
      t.proxima = addDias(h, iv[t.caixa]);
      t.ultimoOk = h;
      t.ultimoOkEm = Date.now();
      t.travado = null;
      const volta = `próxima revisão em ${iv[t.caixa]} dia${iv[t.caixa] > 1 ? 's' : ''}`;
      out.regra = rodada.tipo !== 'revisao' ? `Primeira rodada vencida: o tópico entra no ${nivelTxt(1)}, ${volta}.`
        : rodada.primeira === 'ok' ? (antes >= P.caixas ? `Na revisão vale a primeira resposta, e ela saiu: o tópico continua no ${nivelTxt(P.caixas)}, ${volta}.` : `Na revisão vale a primeira resposta, e ela saiu: o tópico sobe para o ${nivelTxt(t.caixa)}, ${volta}.`)
          : rodada.primeira === 'quase' ? `Na revisão vale a primeira resposta, e ela saiu pela metade: o tópico fica no ${nivelTxt(t.caixa)}, ${volta}.`
            : `Na revisão vale a primeira resposta, e ela não saiu: o tópico volta para o ${nivelTxt(1)} para firmar de novo, ${volta}.`;
    } else if (antes >= 1) {
      // teto numa revisão: o que já foi consolidado não zera; volta à caixa 1 e revisa amanhã
      t.caixa = 1;
      t.proxima = addDias(h, 1);
      out.regra = `Teto de ${tetoDe(rodada.id)} tentativas. O tópico volta para o nível 1 e revisa amanhã: o que você já tinha visto não zera, só o intervalo encurta.`;
    } else {
      // teto na primeira vez (aquisição): falta base; a prática vai para o pré-requisito
      t.caixa = 0;
      t.proxima = null;
      const raiz = p => { const tp = st.topicos[p]; return tp && tp.travado && travadoAtivo(st, p) ? raiz(tp.travado.por) : p; };
      const pres = (topico(rodada.id).prereq || []).filter(p => topico(p)).map(raiz);
      const pre = pres.sort((a, b) => ((st.topicos[a] || {}).caixa || 0) - ((st.topicos[b] || {}).caixa || 0))[0];
      if (pre) {
        t.travado = { por: pre, desde: h, em: Date.now() };
        const tp = reg(st, pre);
        if (tp.caixa && tp.ultimoOk !== h && (!tp.proxima || tp.proxima > h)) tp.proxima = h;
        out.redireciona = pre;
        out.regra = `Teto de ${tetoDe(rodada.id)} tentativas. Insistir agora só cansa: a prática vai para ${nomeDe(pre)}, que é a base deste tópico.`;
      } else {
        out.regra = `Teto de ${tetoDe(rodada.id)} tentativas. Na próxima partida o tópico volta com questões mais diretas.`;
      }
    }
    out.caixaDepois = t.caixa;
    out.proxima = t.proxima;
    out.ganho = !out.venceu ? 'nenhum' : t.caixa > antes ? (antes ? 'subiu' : 'entrou') : t.caixa < antes ? 'caiu' : 'manteve';
    t.rodadas.push({ dia: h, venceu: out.venceu, tentativas: rodada.tentativas, de: antes, para: t.caixa, tipo: rodada.tipo });
    out.liberou = liberaveis.filter(d => estado(st, d) !== 'bloqueado');
    const cjId = topico(rodada.id).conjunto;
    if (out.venceu && chefeEstado(st, cjId) === 'disponivel' && !(st.chefeAvisado || {})[cjId]) { out.chefeLiberado = cjId; st.chefeAvisado = Object.assign(st.chefeAvisado || {}, { [cjId]: h }); }
    return out;
  }

  /* ---------------- Pilar IV · camada de regulação (sem verbo de perda) ---------------- */
  function regulacao(st, rodada, res) {
    if (res === 'fim') return null;
    const alvo = nivelAlvo(st, rodada.id, rodada);
    const falta = Math.max(0, criterioDe(rodada.id) - rodada.sequencia);
    const nivel = ['mais direta, de lembrar', 'de entender o conceito', 'de aplicar em situação nova'][alvo];
    const nf = String(falta).replace('.', ',');
    const pts = `${falta < 2 ? 'Falta' : 'Faltam'} ${nf} ${falta < 2 ? 'ponto' : 'pontos'} de domínio nesta rodada`;
    if (res === 'erro') return `${pts}, contando a partir da próxima. Ela é ${nivel}, sobre o mesmo assunto.`;
    if (res === 'quase') return `Parcial não soma nem desconta. ${pts}. A próxima é ${nivel}.`;
    return falta ? `${pts}. A próxima é ${nivel}.` : 'Critério de domínio atingido.';
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
    const ds = topicosAtivos(st).map(id => st.topicos[id]).filter(t => t && t.caixa && ehData(t.proxima)).map(t => t.proxima).sort();
    const h = hoje();
    return ds.find(d => d > h) || null;
  }

  C.regras = {
    versao: '1.2', P, MATERIAS, NIVEIS, NIVEL, nivelTxt, pausa, ROTULO, ehChefe, chefeId, chefeEstado, criterioDe, tetoDe,
    datas: { hoje, iso, parse, addDias, diff, fmtData, fmtRel, ehData, setOffset: n => (offset = +n || 0), getOffset: () => offset },
    indexar, idx, topico, ativos, topicosAtivos, travadoAtivo,
    prova, horizonte, intervalos, recuperabilidade, estado, porqueEstado, dominio, dominioMateria, prereqOk,
    candidatos, proposta, regraProposta, recompensa,
    nivelAlvo, escolherItem, avaliar, casaChave, tokens, novaRodada, registrar, fecharRodada, regulacao,
    ultimos14, agenda, minutosHoje, proximaRevisao, norm, hash,
  };
})();
