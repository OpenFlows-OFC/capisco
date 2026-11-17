/* =========================================================
   PRUMO · Pack de caderno (classe Pack, e.2 + cards)
   Carrega o pack (conteudo/mat-fa.js, export const pack), indexa capítulos,
   páginas, blocos, parágrafos, modelos, variantes, questões do Enem e cards,
   e roda as checagens do build (b.5, d.6, e.1 e Decisão 1 do dono).
   Sem DOM.
   ========================================================= */

/* ---------------- expressões (sem eval) ---------------- */
// Gramática: soma := termo (('+'|'-') termo)* ; termo := pot (('*'|'/'|implícito) pot)* ;
// pot := unario ('^' unario)? ; unario := '-' unario | prim ; prim := número | nome | '(' soma ')'
function tokenizar(src) {
  const s = String(src).replace(/[×·]/g, '*').replace(/[−–]/g, '-').replace(/÷/g, '/');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    const num = /^\d+(?:[.,]\d+)?/.exec(s.slice(i));
    if (num) { out.push({ t: 'n', v: parseFloat(num[0].replace(',', '.')) }); i += num[0].length; continue; }
    const nome = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
    if (nome) { out.push({ t: 'id', v: nome[0] }); i += nome[0].length; continue; }
    if ('+-*/^()'.includes(c)) { out.push({ t: c }); i++; continue; }
    throw new Error(`Caractere inesperado "${c}" em "${src}"`);
  }
  return out;
}
/** Compila uma expressão em função (env → número). Multiplicação implícita: "80X", "2(x+1)". */
export function compilar(src, { implicita = false } = {}) {
  const tk = tokenizar(src);
  let p = 0;
  const ver = () => tk[p], prox = () => tk[p++];
  const comeca = t => t && (t.t === 'n' || t.t === 'id' || t.t === '(');
  function soma() {
    let f = termo();
    while (ver() && (ver().t === '+' || ver().t === '-')) {
      const op = prox().t, a = f, b = termo();
      f = op === '+' ? e => a(e) + b(e) : e => a(e) - b(e);
    }
    return f;
  }
  function termo() {
    let f = pot();
    for (;;) {
      const t = ver();
      if (t && (t.t === '*' || t.t === '/')) { prox(); const a = f, b = pot(); f = t.t === '*' ? e => a(e) * b(e) : e => a(e) / b(e); }
      else if (implicita && comeca(t)) { const a = f, b = pot(); f = e => a(e) * b(e); }
      else return f;
    }
  }
  function pot() { const a = unario(); if (ver() && ver().t === '^') { prox(); const b = unario(); return e => Math.pow(a(e), b(e)); } return a; }
  function unario() { if (ver() && ver().t === '-') { prox(); const a = unario(); return e => -a(e); } if (ver() && ver().t === '+') { prox(); return unario(); } return prim(); }
  function prim() {
    const t = prox();
    if (!t) throw new Error(`Expressão incompleta: "${src}"`);
    if (t.t === 'n') return () => t.v;
    if (t.t === 'id') return e => { if (!(t.v in e)) throw new Error(`Variável desconhecida "${t.v}" em "${src}"`); return Number(e[t.v]); };
    if (t.t === '(') { const f = soma(); if (!ver() || ver().t !== ')') throw new Error(`Falta ")" em "${src}"`); prox(); return f; }
    throw new Error(`Símbolo inesperado em "${src}"`);
  }
  const f = soma();
  if (p !== tk.length) throw new Error(`Sobrou texto em "${src}"`);
  return f;
}
export const avaliarExpr = (src, env, op) => compilar(src, op)(env);
/** Nomes usados na expressão. */
export const nomesDe = src => [...new Set(tokenizar(src).filter(t => t.t === 'id').map(t => t.v))];

/* ---------------- números e textos ---------------- */
export function fmtNum(n) {
  if (!Number.isFinite(n)) return String(n);
  const r = Math.round(n * 100) / 100;
  const neg = r < 0, a = Math.abs(r);
  let s = Number.isInteger(a) ? String(a) : a.toFixed(2).replace(/0$/, '').replace('.', ',');
  if (Number.isInteger(a) && a >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '−' : '') + s;
}
/** Troca {chave} pelos valores da linha. Números saem no formato brasileiro. */
export function preencher(texto, linha) {
  return String(texto == null ? '' : texto).replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, k) =>
    (linha && k in linha) ? (typeof linha[k] === 'number' ? fmtNum(linha[k]) : String(linha[k])) : m);
}
export const semTags = s => String(s == null ? '' : s).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ');
const norm = s => semTags(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const palavras = s => norm(s).split(/[^a-z0-9]+/).filter(Boolean);
/** Conta palavras como um leitor conta: tokens com letra ou número. */
export const contarPalavras = s => semTags(s).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/** Maior sequência de palavras seguidas em comum entre dois textos (e a sequência). */
export function maiorSequenciaComum(a, b) {
  const A = palavras(a), B = palavras(b);
  let melhor = 0, fim = 0;
  const lin = new Array(B.length + 1).fill(0);
  for (let i = 1; i <= A.length; i++) {
    let diag = 0;
    for (let j = 1; j <= B.length; j++) {
      const tmp = lin[j];
      lin[j] = A[i - 1] === B[j - 1] ? diag + 1 : 0;
      if (lin[j] > melhor) { melhor = lin[j]; fim = i; }
      diag = tmp;
    }
  }
  return { n: melhor, trecho: A.slice(fim - melhor, fim).join(' ') };
}

const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const ROTULO_DIA = { 1: '1º dia', 2: '2º dia' };

/* =========================================================
   Classe Pack
   ========================================================= */
export class Pack {
  constructor(dados) {
    if (!dados || typeof dados !== 'object') throw new Error('Pack ausente.');
    this.dados = dados;
    this.id = dados.id;
    this.titulo = dados.titulo;
    this.materia = dados.materia;
    this.versao = dados.versao;
    this.capitulos = [...(dados.capitulos || [])].sort((a, b) => (a.n || 0) - (b.n || 0));
    this._cap = {}; this._pag = {}; this._bloco = {}; this._par = {}; this._mod = {}; this._q = {}; this._card = {};
    this._capDaQuestao = {}; this._papelDaQuestao = {};
    for (const m of dados.modelos || []) this._mod[m.id] = m;
    for (const q of dados.questoes || []) this._q[q.id] = q;
    this.capitulos.forEach((c, ordem) => {
      this._cap[c.id] = { c, ordem };
      (c.paginas || []).forEach((p, ip) => {
        this._pag[p.id] = { p, cap: c.id, indice: ip };
        let n = 0;
        (p.blocos || []).forEach((b, ib) => {
          this._bloco[b.id] = { b, pagina: p.id, cap: c.id, indice: ib, primeiro: n + 1 };
          for (const par of b.paragrafos || []) { n++; this._par[par.id] = { par, bloco: b.id, pagina: p.id, cap: c.id, n }; }
        });
      });
      for (const id of c.rodada || []) { if (!this._capDaQuestao[id]) { this._capDaQuestao[id] = c.id; this._papelDaQuestao[id] = 'rodada'; } }
      for (const id of c.reserva || []) { if (!this._capDaQuestao[id]) { this._capDaQuestao[id] = c.id; this._papelDaQuestao[id] = 'reserva'; } }
      for (const k of c.cards || []) this._card[k.id] = { k, cap: c.id };
    });
    this._itens = {};
    this._motor = null;
  }

  /* ---------- consultas estruturais ---------- */
  capitulo(id) { return (this._cap[id] || {}).c || null; }
  ordem(capId) { return (this._cap[capId] || { ordem: 99 }).ordem; }
  pagina(id) { return (this._pag[id] || {}).p || null; }
  capDaPagina(id) { return (this._pag[id] || {}).cap || null; }
  bloco(id) { return (this._bloco[id] || {}).b || null; }
  paginaDoBloco(id) { return (this._bloco[id] || {}).pagina || null; }
  capDoBloco(id) { return (this._bloco[id] || {}).cap || null; }
  paragrafo(id) { return (this._par[id] || {}).par || null; }
  modelo(id) { return this._mod[id] || null; }
  questao(id) { return this._q[id] || null; }
  card(id) { return (this._card[id] || {}).k || null; }
  capDoCard(id) { return (this._card[id] || {}).cap || null; }
  cardsDe(capId) { return (this.capitulo(capId) || {}).cards || []; }
  /** Onde fica um parágrafo: { cap, capN, pagina, paginaN, bloco, n (§), rotulo: "p. 2, § 3" }. */
  local(parId) {
    const x = this._par[parId];
    if (!x) return null;
    const pg = this.pagina(x.pagina), cp = this.capitulo(x.cap);
    return { cap: x.cap, capN: cp.n, pagina: x.pagina, paginaN: pg.n, bloco: x.bloco, paragrafo: parId, n: x.n, rotulo: `p. ${pg.n}, § ${x.n}` };
  }
  /** Local do primeiro parágrafo de um bloco. */
  localDoBloco(blocoId) {
    const b = this.bloco(blocoId);
    if (!b || !(b.paragrafos || []).length) return null;
    return this.local(b.paragrafos[0].id);
  }
  /** Âncora de um card: o parágrafo dele, se houver; senão, o 1º parágrafo do bloco. */
  localDoCard(k) { return (k.paragrafo && this.local(k.paragrafo)) || this.localDoBloco(k.bloco); }
  /** Faixa de § de um conjunto de blocos da mesma página: "§1–§3" ou "§ 4". */
  faixaDeBlocos(blocoIds) {
    const ns = blocoIds.flatMap(id => (this.bloco(id).paragrafos || []).map(p => this._par[p.id].n));
    if (!ns.length) return '';
    const a = Math.min(...ns), b = Math.max(...ns);
    return a === b ? `§ ${a}` : `§${a}–§${b}`;
  }
  /** Capítulo de um item (questão do Enem ou variante "modelo#k"). */
  capDoItem(id) {
    if (this._capDaQuestao[id]) return this._capDaQuestao[id];
    const [mid] = String(id).split('#');
    const m = this.modelo(mid);
    if (m) return this.capDaPagina(m.pagina);
    const q = this.questao(id);
    if (q && (q.blocos || []).length) return this.capDoBloco(q.blocos[0]);
    return null;
  }
  papelDaQuestao(id) { return this._papelDaQuestao[id] || null; }
  /** Questões do Enem do capítulo (rodada + reserva), sem variantes da equipe. */
  questoesDoCap(capId) {
    const c = this.capitulo(capId);
    return [...(c.rodada || []), ...(c.reserva || [])].filter(id => this.questao(id));
  }
  /** Modelos de página do capítulo, na ordem das páginas. */
  modelosDoCap(capId) { return (this.capitulo(capId).paginas || []).map(p => this.modelo(p.modelo)).filter(Boolean); }
  /** Modelo de página de uma página. */
  modeloDaPagina(pagId) { const p = this.pagina(pagId); return p ? this.modelo(p.modelo) : null; }
  /** Modelo para a inserção do Pilar III a partir de um parágrafo: o do bloco, se houver; senão, o da página. */
  modelosParaParagrafo(parId) {
    const x = this._par[parId];
    if (!x) return [];
    const b = this.bloco(x.bloco), out = [];
    if (b.prePergunta && this.modelo(b.prePergunta)) out.push(this.modelo(b.prePergunta));
    const mp = this.modeloDaPagina(x.pagina);
    if (mp) out.push(mp);
    return out;
  }

  /* ---------- itens ---------- */
  /** Item unificado (questão do Enem ou variante da equipe). Lança erro se não existir. */
  item(id) {
    if (this._itens[id]) return this._itens[id];
    let it;
    if (this.questao(id)) it = this._itemEnem(this.questao(id));
    else if (String(id).includes('#')) { const [mid, k] = String(id).split('#'); it = this.variante(mid, Number(k)); }
    if (!it) throw new Error(`Item desconhecido: ${id}`);
    this._itens[id] = it;
    return it;
  }
  existe(id) { try { this.item(id); return true; } catch (e) { return false; } }
  indice(item, letra) { return item.alternativas.findIndex(a => a.letra === letra); }
  letraDe(item, indice) { return (item.alternativas[indice] || {}).letra || null; }

  _itemEnem(q) {
    const cap = this.capDoItem(q.id);
    const pagina = (q.blocos || []).length ? this.paginaDoBloco(q.blocos[0]) : null;
    const conf = q.textoConferidoPDF ? 'reproduzida sem alterações' : 'transcrição do enem.dev, em conferência';
    const rodape = `Enem ${q.ano}, ${ROTULO_DIA[q.dia] || q.dia + 'º dia'}, Caderno ${q.caderno}, questão ${q.numero}. © INEP/MEC, licença CC BY-ND 3.0 (creativecommons.org/licenses/by-nd/3.0/legalcode). Transcrição: projeto enem.dev (${conf}).`;
    return {
      id: q.id, origem: 'enem', cap, pagina, modelo: q.modelo || null, blocos: q.blocos || [],
      rotulo: `Enem ${q.ano} · ${ROTULO_DIA[q.dia] || q.dia + 'º dia'} · questão ${q.numero}`,
      numero: q.numero, prova: `Enem ${q.ano}, ${ROTULO_DIA[q.dia] || q.dia + 'º dia'}`,
      contexto: q.contexto || '', introducao: q.introducao || '', enunciado: q.contexto || '', imagens: q.imagens || [],
      alternativas: (q.alternativas || []).map(a => ({ letra: a.letra, texto: a.texto, imagem: a.imagem || null, certa: a.letra === q.gabarito, falta: a.falta || null, paragrafo: a.paragrafo || null, expr: a.expr || null })),
      gabarito: q.gabarito, explicacao: q.explicacao || '', atribuicao: q.atribuicao || rodape, rodape,
      licenca: q.licenca, licencaUrl: q.licencaUrl, materialDeTerceiros: q.materialDeTerceiros || null,
      conferido: !!q.textoConferidoPDF, dif: (q.inep && Number.isFinite(q.inep.b)) ? q.inep.b : 0, autoria: q.autoria || null, habilidade: q.habilidade || null,
    };
  }
  /** Valor exibido de uma expressão na linha k do modelo: { valor (para ordenar), texto }. */
  _valor(m, expr, linha) {
    const f = compilar(expr);
    const livres = nomesDe(expr).filter(n => !(n in linha));
    const formato = m.formato || (livres.length ? 'linear' : 'numero');
    if (formato === 'linear') {
      const v = (m.variavel || livres[0] || 'X');
      const e0 = Object.assign({}, linha, { [v]: 0 }), e1 = Object.assign({}, linha, { [v]: 1 }), e2 = Object.assign({}, linha, { [v]: 2 });
      const b = f(e0), a = f(e1) - b;
      if (Math.abs(f(e2) - (2 * a + b)) > 1e-9) throw new Error(`Expressão não é linear em ${v}: ${expr}`);
      const ra = Math.round(a * 100) / 100, rb = Math.round(b * 100) / 100;
      let t = ra === 0 ? '' : ra === 1 ? v : ra === -1 ? `−${v}` : `${fmtNum(ra)}${v}`;
      if (rb !== 0 || !t) t = t ? `${t} ${rb < 0 ? '−' : '+'} ${fmtNum(Math.abs(rb))}` : fmtNum(rb);
      if (ra < 0 && rb > 0) t = `${fmtNum(rb)} − ${ra === -1 ? v : fmtNum(-ra) + v}`;   // "1 − 0,7V", como o INEP escreve (fmtLinear do gerador.js)
      return { valor: [ra, rb], texto: `${m.saida || 'Y'} = ${t}` };
    }
    const n = f(linha);
    const r = Math.round(n * 100) / 100;
    return { valor: [r], texto: `${m.prefixo || ''}${fmtNum(r)}${m.unidade ? ' ' + m.unidade : ''}` };
  }
  /** Variante k do modelo: enunciado preenchido e cinco alternativas (a certa e as 4 "faltas"),
   *  em ordem crescente de valor (determinística, nada sorteado). */
  variante(modeloId, k) {
    const m = this.modelo(modeloId);
    if (!m) return null;
    const linha = (m.linhas || [])[k];
    if (!linha) return null;
    const pronta = Array.isArray(m.variantes) ? m.variantes[k] : null;   // variante já materializada pelo pack (conteudo/gerador.js)
    if (pronta) return this._daVariantePronta(m, k, pronta);
    // linha.erros: quais 4 dos erros do modelo a linha usa (modelo com 5 ou 6 erros; errosDaLinha() do gerador.js)
    const errosLinha = Array.isArray(linha.erros) ? linha.erros.map(i => (m.erros || [])[i]).filter(Boolean) : (m.erros || []);
    const ops = [{ certa: true, expr: m.certa }, ...errosLinha.map(e => ({ certa: false, expr: e.expr, falta: preencher(e.falta, linha), paragrafo: e.paragrafo }))]
      .map(o => Object.assign(o, this._valor(m, o.expr, linha)));
    ops.sort((a, b) => a.valor[0] - b.valor[0] || (a.valor[1] || 0) - (b.valor[1] || 0));
    const alternativas = ops.map((o, i) => ({ letra: LETRAS[i], texto: o.texto, certa: o.certa, falta: o.falta || null, paragrafo: o.paragrafo || null, expr: o.expr, imagem: null }));
    const cap = this.capDaPagina(m.pagina);
    const certa = alternativas.find(a => a.certa);
    return {
      id: `${m.id}#${k}`, origem: 'equipe', modelo: m.id, tipoModelo: m.tipo, linha: k, cap, pagina: m.pagina, bloco: m.bloco || null,
      blocos: m.tipo === 'bloco' ? [m.bloco] : [this.pagina(m.pagina).nucleo],
      rotulo: 'Texto e números da equipe Prumo · CC BY-SA 4.0',
      contexto: '', introducao: '', enunciado: preencher(m.enunciado, linha), imagens: [], dados: linha, figura: m.figura || null,
      alternativas, gabarito: certa.letra,
      explicacao: m.explicacao ? preencher(m.explicacao, linha) : `A certa é ${certa.texto}.`,
      atribuicao: 'Texto e números da equipe Prumo · CC BY-SA 4.0', rodape: 'Texto e números da equipe Prumo · CC BY-SA 4.0',
      licenca: m.licenca || 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pt',
      conferido: true, dif: 0, autoria: (m.credito && m.credito.autoria) || null,
    };
  }
  _daVariantePronta(m, k, v) {
    const cap = this.capDaPagina(m.pagina);
    const alternativas = v.alternativas.map(a => ({ letra: a.letra, texto: a.texto, certa: !!a.certa, falta: a.falta || null, paragrafo: a.paragrafo || null, expr: a.expr || null, imagem: a.imagem || null }));
    const certa = alternativas.find(a => a.certa);
    return {
      id: `${m.id}#${k}`, origem: 'equipe', modelo: m.id, tipoModelo: m.tipo, linha: k, cap, pagina: m.pagina, bloco: m.bloco || null,
      blocos: m.tipo === 'bloco' ? [m.bloco] : [this.pagina(m.pagina).nucleo],
      rotulo: 'Texto e números da equipe Prumo · CC BY-SA 4.0',
      contexto: '', introducao: '', enunciado: v.enunciado, imagens: [], dados: m.linhas[k], figura: v.figura || null,
      alternativas, gabarito: v.gabarito || certa.letra,
      explicacao: v.explicacao || `A certa é ${certa.texto}.`,
      atribuicao: 'Texto e números da equipe Prumo · CC BY-SA 4.0', rodape: 'Texto e números da equipe Prumo · CC BY-SA 4.0',
      licenca: m.licenca || 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pt',
      conferido: true, dif: 0, autoria: v.autoria || (m.credito && m.credito.autoria) || null,
    };
  }
  /** Item no formato do motor: o papel do passo vira item.nivel (o peso vem do papel, b.3). */
  paraMotor(item, papel) {
    return { id: item.id, nivel: papel, topico: item.cap, dif: item.dif, explicacao: item.explicacao || '',
      opcoes: item.alternativas.map(a => ({ t: a.texto, ok: a.certa, erro: a.falta || undefined })) };
  }

  /* ---------- índice para o motor (conjunto = caderno, tópico = capítulo) ---------- */
  indiceMotor() {
    if (this._motor) return this._motor;
    const topicos = this.capitulos.map((c, ordem) => {
      const [p1, p2] = c.paginas || [];
      const itens = [];
      if (p1) itens.push(`${p1.modelo}#1`);
      if (p2) itens.push(`${p2.modelo}#1`);
      itens.push(...(c.rodada || []));
      return { id: c.id, n: c.n, nome: c.titulo, prereq: c.prereq || [], ordem, conjunto: this.id,
        itens: itens.filter(id => this.existe(id)).map((id, i) => Object.assign(this.paraMotor(this.item(id), i === 0 ? 'lembrar' : i === 1 ? 'compreender' : 'aplicar'))) };
    });
    const idx = { conjuntos: { [this.id]: { id: this.id, titulo: this.titulo, materia: this.materia, topicos } }, topicos: {}, itens: {}, dependentes: {} };
    for (const t of topicos) {
      idx.topicos[t.id] = t;
      for (const it of t.itens) idx.itens[it.id] = it;
      for (const p of t.prereq) (idx.dependentes[p] = idx.dependentes[p] || []).push(t.id);
    }
    this._motor = idx;
    return idx;
  }

  /* ---------- créditos ---------- */
  creditos() {
    const nomeIA = a => (typeof a.ia === 'string' ? a.ia : a.ferramenta || a.modelo || 'IA generativa') + (typeof a.ia !== 'string' && a.data ? `, ${a.data}` : '');
    const autoriaTxt = a => !a ? 'autoria não registrada'
      : a.ia && !a.revisor ? `rascunho por IA (${nomeIA(a)}), revisão pendente`
        : a.ia ? `rascunho por IA (${nomeIA(a)}); ${a.equipe ? 'escrito por ' + a.equipe + '; ' : ''}revisado por ${a.revisor}${a.revisadoEm ? ' em ' + a.revisadoEm : ''}`
          : `${a.equipe ? 'escrito por ' + a.equipe : 'equipe'}${a.revisor ? '; revisado por ' + a.revisor : '; revisão pendente'}`;
    const itens = [];
    for (const c of this.capitulos) {
      for (const p of c.paginas || []) {
        if (p.fonte) itens.push({ tipo: 'pagina', id: p.id, titulo: `p. ${p.n} · ${p.titulo}`, fonte: p.fonte.fonte, url: p.fonte.url || null, licenca: p.fonte.licenca, detalhe: [p.fonte.revisao, p.fonte.alteracoes].filter(Boolean).join(' · '), autoria: autoriaTxt(p.fonte.autoria) });
        else itens.push({ tipo: 'pagina', id: p.id, titulo: `p. ${p.n} · ${p.titulo}`, fonte: 'Equipe Prumo', url: null, licenca: this.dados.licencaPadrao, detalhe: '', autoria: autoriaTxt(null) });
      }
    }
    for (const m of this.dados.modelos || []) {
      const pg = this.pagina(m.pagina);
      itens.push({ tipo: 'modelo', id: m.id, titulo: `Questões da equipe · ${m.tipo === 'bloco' ? 'bloco ' + (this.localDoBloco(m.bloco) || {}).rotulo : 'p. ' + (pg ? pg.n : '?')}`, fonte: (m.credito && m.credito.fonte) || 'Equipe Prumo', url: null, licenca: m.licenca, detalhe: '', autoria: autoriaTxt(m.credito && m.credito.autoria) });
    }
    for (const q of this.dados.questoes || []) {
      const it = this.item(q.id);
      itens.push({ tipo: 'enem', id: q.id, titulo: it.rotulo, fonte: it.rodape, url: q.licencaUrl, licenca: q.licenca, detalhe: q.materialDeTerceiros ? `Material de terceiros no enunciado: ${q.materialDeTerceiros}` : '', terceiros: q.materialDeTerceiros || null, autoria: q.explicacao ? `Explicação e "o que faltou": ${autoriaTxt(q.autoria)}` : '' });
    }
    for (const c of this.capitulos) for (const k of c.cards || []) {
      itens.push({ tipo: 'card', id: k.id, titulo: `Card · Cap. ${c.n} · ${k.frente}`, fonte: 'Equipe Prumo', url: null, licenca: this.dados.licencaPadrao, detalhe: '', autoria: autoriaTxt(k.autoria) });
    }
    return { titulo: this.titulo, licencaPadrao: this.dados.licencaPadrao, avisoColetanea: this.dados.avisoColetanea, gerais: this.dados.creditos || [], itens, revisaoPendente: itens.filter(i => /revisão pendente/.test(i.autoria)).length };
  }

  /* =========================================================
     Checagens do build (b.5, d.6, e.1, e.2 e Decisão 1)
     ========================================================= */
  checar() {
    const erros = [], avisos = [];
    const E = m => erros.push(m), A = m => avisos.push(m);
    const d = this.dados;
    for (const k of ['id', 'versao', 'materia', 'titulo', 'licencaPadrao', 'avisoColetanea', 'capitulos', 'modelos', 'questoes']) if (d[k] == null) E(`Pack sem o campo obrigatório "${k}".`);
    if (d.licencaPadrao && d.licencaPadrao !== 'CC BY-SA 4.0') E('licencaPadrao tem de ser "CC BY-SA 4.0".');
    if (d.id && !/^[a-z0-9-]+$/.test(d.id)) E(`id do pack inválido: ${d.id}`);
    const ids = new Set();
    const unico = (id, oque) => { if (ids.has(id)) E(`Id repetido (${oque}): ${id}`); ids.add(id); };

    for (const c of this.capitulos) {
      unico(c.id, 'capítulo');
      for (const k of ['id', 'n', 'titulo', 'habilidades', 'paginas', 'rodada']) if (c[k] == null) E(`Capítulo ${c.id} sem "${k}".`);
      if ((c.paginas || []).length !== 2) E(`Capítulo ${c.id} precisa ter 2 páginas (tem ${(c.paginas || []).length}).`);
      if ((c.rodada || []).length < 3) E(`Capítulo ${c.id} precisa de pelo menos 3 itens na rodada.`);
      for (const id of [...(c.rodada || []), ...(c.reserva || [])]) if (!this.existe(id)) E(`Capítulo ${c.id}: item da rodada/reserva não existe: ${id}`);
      for (const p of c.prereq || []) if (!this.capitulo(p)) E(`Capítulo ${c.id}: pré-requisito desconhecido ${p}.`);
      const bs = (c.rodada || []).filter(id => this.questao(id)).map(id => this.questao(id).inep && this.questao(id).inep.b);
      for (let i = 1; i < bs.length; i++) if (bs[i] < bs[i - 1]) A(`Capítulo ${c.id}: a rodada não está em ordem crescente de b.`);
      for (const p of c.paginas || []) {
        unico(p.id, 'página');
        for (const k of ['id', 'n', 'titulo', 'blocos', 'modelo', 'nucleo']) if (p[k] == null) E(`Página ${p.id} sem "${k}".`);
        const mp = this.modelo(p.modelo);
        if (!mp) E(`Página ${p.id}: modelo ${p.modelo} não existe.`);
        else if (mp.tipo !== 'pagina') E(`Página ${p.id}: o modelo ${p.modelo} não é de página.`);
        if (!(p.blocos || []).some(b => b.id === p.nucleo)) E(`Página ${p.id}: o núcleo ${p.nucleo} não é um bloco da página.`);
        for (const b of p.blocos || []) {
          unico(b.id, 'bloco');
          if (!(b.paragrafos || []).length) E(`Bloco ${b.id} sem parágrafos.`);
          for (const par of b.paragrafos || []) { unico(par.id, 'parágrafo'); if (typeof par.html !== 'string') E(`Parágrafo ${par.id} sem html.`); }
          if (b.prePergunta) {
            const mb = this.modelo(b.prePergunta);
            if (!mb) E(`Bloco ${b.id}: modelo de pré-pergunta ${b.prePergunta} não existe.`);
            else if (mb.tipo !== 'bloco' || mb.bloco !== b.id) E(`Bloco ${b.id}: o modelo ${b.prePergunta} não é o modelo deste bloco.`);
          }
        }
      }
      // Decisão 1 do dono: cards
      const cs = c.cards || [];
      if (cs.length < 6 || cs.length > 8) E(`Capítulo ${c.id}: precisa de 6 a 8 cards (tem ${cs.length}).`);
      for (const k of cs) {
        unico(k.id, 'card');
        if (!k.frente || !k.verso) E(`Card ${k.id} sem frente ou verso.`);
        if (contarPalavras(k.frente) > 14) E(`Card ${k.id}: frente com mais de 14 palavras (${contarPalavras(k.frente)}).`);
        if (contarPalavras(k.verso) > 25) E(`Card ${k.id}: verso com mais de 25 palavras (${contarPalavras(k.verso)}).`);
        if (!this.bloco(k.bloco)) E(`Card ${k.id}: bloco ${k.bloco} não existe.`);
        else if (this.capDoBloco(k.bloco) !== c.id) A(`Card ${k.id}: o bloco ${k.bloco} é de outro capítulo.`);
        if (!k.autoria) E(`Card ${k.id} sem autoria.`);
        if (k.tipo && !['conceito', 'palavra-pista', 'procedimento', 'armadilha comum', 'armadilha'].includes(k.tipo)) A(`Card ${k.id}: tipo "${k.tipo}" fora da lista.`);
        for (const q of d.questoes || []) {
          const txt = [q.contexto, q.introducao, ...(q.alternativas || []).map(a => a.texto)].join(' \n ');
          const s = maiorSequenciaComum(`${k.frente} \n ${k.verso}`, txt);
          if (s.n >= 6) E(`Card ${k.id}: ${s.n} palavras seguidas em comum com ${q.id} ("${s.trecho}").`);
        }
      }
    }

    // modelos
    for (const m of d.modelos || []) {
      unico(m.id, 'modelo');
      for (const k of ['id', 'tipo', 'pagina', 'enunciado', 'certa', 'erros', 'linhas', 'licenca', 'credito']) if (m[k] == null) E(`Modelo ${m.id} sem "${k}".`);
      if (m.licenca && m.licenca !== 'CC BY-SA 4.0') E(`Modelo ${m.id}: licença tem de ser CC BY-SA 4.0.`);
      if (!this.pagina(m.pagina)) E(`Modelo ${m.id}: página ${m.pagina} não existe.`);
      const nErros = (m.erros || []).length, escolhe = (m.linhas || []).some(l => l && Array.isArray(l.erros));
      if (escolhe ? (nErros < 4 || nErros > 6) : nErros !== 4) E(`Modelo ${m.id}: precisa de ${escolhe ? '4 a 6' : '4'} erros (tem ${nErros}).`);
      if (escolhe) (m.linhas || []).forEach((l, k) => {
        const ix = l && l.erros;
        if (!Array.isArray(ix) || ix.length !== 4 || new Set(ix).size !== 4 || ix.some(i => !Number.isInteger(i) || i < 0 || i >= nErros))
          E(`Modelo ${m.id}, linha ${k}: "erros" tem de trazer 4 índices distintos de modelo.erros.`);
      });
      for (const e of m.erros || []) if (e.paragrafo && !this.paragrafo(e.paragrafo)) E(`Modelo ${m.id}: parágrafo ${e.paragrafo} não existe.`);
      const nLinhas = (m.linhas || []).length;
      if (m.tipo === 'pagina' && nLinhas < 2) E(`Modelo ${m.id}: precisa de pelo menos 2 linhas.`);
      if (m.tipo === 'pagina' && nLinhas < 11) A(`Modelo ${m.id}: tem ${nLinhas} linhas; o modelo completo de página tem 11.`);
      if (m.tipo === 'bloco' && nLinhas < 2) E(`Modelo de bloco ${m.id}: precisa de 2 linhas (pré-pergunta e variante de compreender).`);
      for (let k = 0; k < nLinhas; k++) {
        try {
          const v = this.variante(m.id, k);
          const textos = v.alternativas.map(a => a.texto);
          if (new Set(textos).size !== textos.length) E(`Modelo ${m.id}, linha ${k}: alternativas repetidas (${textos.join(' | ')}).`);
          if (/\{[A-Za-z_]/.test(v.enunciado)) E(`Modelo ${m.id}, linha ${k}: variável sem valor no enunciado.`);
        } catch (err) { E(`Modelo ${m.id}, linha ${k}: ${err.message}`); }
      }
      // e.1: sobreposição de 6 ou mais palavras com a questão do INEP ligada
      for (const q of d.questoes || []) {
        const ligado = q.modelo === m.id || (m.tipo === 'bloco' && (q.blocos || []).includes(m.bloco))
          || (m.tipo === 'pagina' && (q.blocos || []).some(b => this.paginaDoBloco(b) === m.pagina));
        if (!ligado) continue;
        const txtQ = [q.contexto, q.introducao].join(' \n ');
        for (let k = 0; k < Math.max(1, nLinhas); k++) {
          const s = maiorSequenciaComum(preencher(m.enunciado, (m.linhas || [])[k] || {}), txtQ);
          if (s.n >= 6) { E(`Modelo ${m.id}: ${s.n} palavras seguidas em comum com ${q.id} ("${s.trecho}").`); break; }
        }
      }
    }

    // questões do Enem
    for (const q of d.questoes || []) {
      unico(q.id, 'questão');
      for (const k of ['id', 'ano', 'dia', 'caderno', 'numero', 'area', 'habilidade', 'inep', 'gabarito', 'anulada', 'contexto', 'introducao', 'alternativas', 'atribuicao', 'licenca', 'licencaUrl', 'blocos', 'modelo', 'fonteMd'])
        if (q[k] == null) E(`Questão ${q.id} sem "${k}".`);
      if (!/^enem-[0-9]{4}-[0-9]{1,3}$/.test(q.id)) E(`Questão com id fora do padrão: ${q.id}`);
      if (q.anulada !== false) E(`Questão ${q.id}: anulada tem de ser false.`);
      if (q.gabaritoConferido !== true) A(`Questão ${q.id}: gabaritoConferido não é true.`);
      if (!(q.alternativas || []).some(a => a.letra === q.gabarito)) E(`Questão ${q.id}: o gabarito ${q.gabarito} não está nas alternativas.`);
      if (q.licencaUrl !== 'https://creativecommons.org/licenses/by-nd/3.0/legalcode') E(`Questão ${q.id}: licencaUrl diferente da CC BY-ND 3.0.`);
      for (const b of q.blocos || []) if (!this.bloco(b)) E(`Questão ${q.id}: bloco ${b} não existe.`);
      if (q.modelo && !this.modelo(q.modelo)) E(`Questão ${q.id}: modelo ${q.modelo} não existe.`);
      for (const a of q.alternativas || []) {
        if (a.letra === q.gabarito) continue;
        if (a.paragrafo && !this.paragrafo(a.paragrafo)) E(`Questão ${q.id}, alternativa ${a.letra}: parágrafo ${a.paragrafo} não existe.`);
        if (this.papelDaQuestao(q.id) === 'rodada' && !a.falta) A(`Questão ${q.id}, alternativa ${a.letra}: sem "o que faltou".`);
        if (a.expr) {
          // d.6: a expressão tem de reproduzir a alternativa em X = 3, 5 e 8
          let alvo;
          try {
            const lado = String(a.texto).split('=').pop().replace(/\.\s*$/, '').trim();
            alvo = compilar(lado.replace(/(\d)[.\s\u00a0\u202f](\d{3})(?!\d)/g, '$1$2'), { implicita: true });   // milhar: "1.000" ou "1 000" (INEP)
          } catch (err) { A(`Questão ${q.id}, alternativa ${a.letra}: não consegui ler a expressão do texto para conferir o distrator.`); continue; }
          try {
            const fe = compilar(a.expr);
            const v = nomesDe(a.expr)[0] || 'X';
            for (const x of [3, 5, 8]) {
              const env = { [v]: x, x, X: x };
              if (Math.abs(fe(env) - alvo(env)) > 1e-6) { E(`Questão ${q.id}, alternativa ${a.letra}: expr "${a.expr}" não reproduz "${a.texto}" em ${v} = ${x}.`); break; }
            }
          } catch (err) { E(`Questão ${q.id}, alternativa ${a.letra}: ${err.message}`); }
        }
      }
    }

    // b.5: todo bloco citado pelas questões da rodada ou da reserva, e todo bloco para onde um erro leva, tem pré-pergunta
    const citados = new Map();
    for (const c of this.capitulos) for (const id of [...(c.rodada || []), ...(c.reserva || [])]) {
      const q = this.questao(id);
      if (!q) continue;
      for (const b of q.blocos || []) if (!citados.has(b)) citados.set(b, `${id} (blocos)`);
      for (const a of q.alternativas || []) if (a.paragrafo && this._par[a.paragrafo]) { const b = this._par[a.paragrafo].bloco; if (!citados.has(b)) citados.set(b, `${id}, alternativa ${a.letra}`); }
    }
    for (const [b, por] of citados) {
      const pg = this.pagina(this.paginaDoBloco(b)), bl = this.bloco(b);
      if (!pg || !bl) continue;
      if (pg.nucleo !== b && !bl.prePergunta) E(`Bloco ${b} é citado por ${por} e não tem pré-pergunta (b.5).`);
    }
    return { ok: erros.length === 0, erros, avisos };
  }
}

/** Carrega um pack a partir do objeto exportado e confere as regras do build. */
export function carregarPack(dados, { exigirValido = false } = {}) {
  const p = new Pack(dados);
  if (exigirValido) { const r = p.checar(); if (!r.ok) throw new Error('Pack recusado:\n' + r.erros.join('\n')); }
  return p;
}
