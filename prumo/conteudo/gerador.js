// Prumo · gerador das questões da equipe (e.2, e.3, b.3).
// Funções puras, sem DOM e sem eval: transformam cada modelo da equipe
// (enunciado com {variáveis}, expressão certa, 4 a 6 erros com "o que faltou" e as linhas
// de números) nas variantes prontas para a tela, com as cinco alternativas, o gabarito,
// a explicação e, nos modelos de gráfico, a figura em SVG com texto alternativo.
//
// Linhas de um modelo de página: 0 = pré-pergunta; 1 = checagem; 2 a 7 = variantes
// (revisões, inserção do Pilar III, Prova, Questão do dia); 8 a 10 = "Refazer com outros números".
// Linhas de um modelo de bloco: 0 = pré-pergunta do bloco; 1 = variante de compreender.
// Id de cada variante: "<id do modelo>#<linha>" (ex.: "mat-fa.p1.m#0"), o mesmo do estado (e.4).
// Ordem das alternativas: determinística, em ordem crescente (números pelo valor; expressões pelo
// coeficiente e depois pelo termo independente). Nada é sorteado. Um modelo pode ter de 4 a 6 erros;
// com mais de 4, cada linha diz quais 4 usa (linha.erros, índices em modelo.erros), para a posição
// da certa não ficar sempre na mesma letra.
//
// Compatível com Pack.variante() de js/nucleo/pack.js, que gera a variante a partir de `linhas` com uma
// gramática simples ({nome} e expressões sobre os campos da linha). Por isso compatibilizar() grava em cada
// linha tudo o que é calculado (análise do gráfico, {=expr}, a figura em {FIGURA} e o texto da certa em
// {CERTA}): as duas implementações produzem a mesma variante, letra por letra (teste em _dev/valida_pack.mjs).

// Autoria de todo texto da equipe nesta versão: rascunho por IA, revisão pendente (h.1).
// "ia" segue o esquema e.2 (texto com ferramenta, versão e data); os outros campos são complemento.
// Os créditos (Pack.creditos) escrevem "rascunho por IA (<ia>), revisão pendente": por isso o texto de "ia"
// não repete a palavra "rascunho". O mesmo objeto vale para os Caps. 1 a 4 (_dev/c34_fonte.mjs o importa).
export const AUTORIA_IA = Object.freeze({
  ia: 'Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026',
  modelo: 'Claude Opus 5.5', ferramenta: 'Claude Opus 5.5 (Anthropic), via Claude Code',
  data: '2026-11-17', equipe: null, revisor: null, revisadoEm: null,
});

// ---------------------------------------------------------------- expressões
// Gramática: soma := termo (('+'|'-') termo)* ; termo := fator (('*'|'/') fator)* ;
// fator := ('-'|'+') fator | número | nome | nome '(' args ')' | '(' soma ')'.
const FUNCOES = { max: Math.max, min: Math.min, abs: Math.abs };

export function avaliar(expr, vars = {}) {
  const s = String(expr).replace(/−/g, '-').replace(/×|·/g, '*');
  let i = 0;
  const espaco = () => { while (s[i] === ' ') i++; };
  const erro = msg => { throw new Error(`expressão "${expr}": ${msg} (posição ${i})`); };
  function soma() {
    let v = termo();
    for (;;) { espaco(); const c = s[i];
      if (c === '+') { i++; v += termo(); } else if (c === '-') { i++; v -= termo(); } else return v; }
  }
  function termo() {
    let v = fator();
    for (;;) { espaco(); const c = s[i];
      if (c === '*') { i++; v *= fator(); } else if (c === '/') { i++; v /= fator(); } else return v; }
  }
  function fator() {
    espaco();
    const c = s[i];
    if (c === '-') { i++; return -fator(); }
    if (c === '+') { i++; return fator(); }
    if (c === '(') { i++; const v = soma(); espaco(); if (s[i] !== ')') erro('falta ")"'); i++; return v; }
    const num = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (num) { i += num[0].length; return parseFloat(num[0]); }
    const nome = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
    if (nome) {
      i += nome[0].length; espaco();
      if (s[i] === '(') {
        const f = FUNCOES[nome[0]]; if (!f) erro(`função desconhecida ${nome[0]}`);
        i++; const args = [soma()]; espaco();
        while (s[i] === ',') { i++; args.push(soma()); espaco(); }
        if (s[i] !== ')') erro('falta ")"'); i++;
        return f(...args);
      }
      if (!(nome[0] in vars)) erro(`variável desconhecida ${nome[0]}`);
      const v = vars[nome[0]];
      if (typeof v !== 'number') erro(`variável ${nome[0]} não é número`);
      return v;
    }
    return erro('símbolo inesperado');
  }
  const v = soma(); espaco();
  if (i < s.length) erro('sobrou texto');
  return v;
}

// ---------------------------------------------------------------- formato pt-BR
// Mesmas regras de fmtNum e do texto linear de js/nucleo/pack.js (2 casas; milhar com ponto a partir de 10.000).
const arred = n => Math.round(n * 100) / 100;
export function fmtNum(n) {
  if (!Number.isFinite(n)) return String(n);
  const r = arred(n), neg = r < 0, a = Math.abs(r);
  let s = Number.isInteger(a) ? String(a) : a.toFixed(2).replace(/0$/, '').replace('.', ',');
  if (Number.isInteger(a) && a >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '−' : '') + s;
}
// Contas no texto corrido sem quebra de linha no meio: espaço não separável (U+00A0) dos dois lados de
// + − × ÷ · e =, para a linha não terminar em "5 +" com "2 = 7" na seguinte. Só o espaço em volta do
// operador muda; vírgulas e palavras continuam quebrando normalmente.
const operadoresJuntos = html => String(html).replace(/ ([+−×÷·=]) (?=\S)/g, '\u00a0$1\u00a0');
// "R$" e o valor na mesma linha ("R$ 0,05", e não "R$" no fim de uma linha e "0,05" na seguinte). Também
// vale para o modelo antes de preencher ("R$ {F}"): ali a variável é sempre um número.
export function reaisJuntos(t) { return t == null ? t : String(t).replace(/R\$ (?=[\d{])/g, 'R$' + String.fromCharCode(160)); }
export const contasJuntas = html => reaisJuntos(operadoresJuntos(html));
// a·v + b: "160X + 840", "0,9q", "1 − 0,7V", "V − 70". Com coeficiente negativo e termo independente
// positivo, o termo vem primeiro, como o INEP escreve ("C = 1 − 0,1q"), e não "−0,7V + 1".
export function fmtLinear(a, b, v) {
  const ra = arred(a), rb = arred(b);
  if (ra < 0 && rb > 0) return `${fmtNum(rb)} − ${ra === -1 ? v : fmtNum(-ra) + v}`;
  let t = ra === 0 ? '' : ra === 1 ? v : ra === -1 ? `−${v}` : `${fmtNum(ra)}${v}`;
  if (rb !== 0 || !t) t = t ? `${t} ${rb < 0 ? '−' : '+'} ${fmtNum(Math.abs(rb))}` : fmtNum(rb);
  return t;
}
const ehLinear = m => m.formato === 'linear' || m.formato === 'expressao';
function coeficientes(expr, vars, v) {
  const f = x => avaliar(expr, { ...vars, [v]: x });
  const b = f(0), a = f(1) - b;
  for (const x of [2, 7, 13]) if (Math.abs(f(x) - (a * x + b)) > 1e-9) throw new Error(`"${expr}" não é afim em ${v}`);
  return { a: arred(a), b: arred(b) };
}

export function preencher(tpl, vars) {
  return String(tpl)
    .replace(/\{=([^}]+)\}/g, (_, e) => fmtNum(avaliar(e, vars)))
    .replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, k) => {
      if (!(k in vars)) throw new Error(`variável {${k}} sem valor`);
      return typeof vars[k] === 'number' ? fmtNum(vars[k]) : String(vars[k]);
    });
}

const listaPt = xs => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1]);

// ---------------------------------------------------------------- análise dos gráficos
// Cada análise lê a série desenhada e devolve as grandezas usadas pelas expressões
// (a resposta certa e os erros saem do mesmo desenho que o aluno vê).
function valorEm(serie, t) {
  for (let k = 0; k < serie.length - 1; k++) {
    const [t0, v0] = serie[k], [t1, v1] = serie[k + 1];
    if (t >= t0 && t <= t1) return v0 + (v1 - v0) * (t - t0) / (t1 - t0);
  }
  return NaN;
}
function juntar(trechos) {
  const out = [];
  for (const [a, f] of trechos) {
    if (out.length && out[out.length - 1][1] === a) out[out.length - 1][1] = f; else out.push([a, f]);
  }
  return out;
}

export const ANALISES = {
  // Velocidade ao longo do tempo: trechos em zero (parado) e trechos horizontais fora do zero.
  paradas(linha, g) {
    const s = linha.serie, zeros = [], horiz = [];
    for (let k = 0; k < s.length - 1; k++) {
      const [t0, v0] = s[k], [t1, v1] = s[k + 1];
      if (v0 === 0 && v1 === 0) zeros.push([t0, t1]);
      else if (v0 === v1) horiz.push([t0, t1, v0]);
    }
    const z = juntar(zeros);
    if (z.length !== 2) throw new Error('o modelo de paradas pede exatamente 2 trechos em zero');
    if (horiz.length !== 1) throw new Error('o modelo de paradas pede exatamente 1 trecho horizontal fora do zero');
    const passo = g.xPasso;
    const marcas = z.reduce((n, [a, f]) => n + Math.floor(f / passo) - Math.ceil(a / passo) + 1, 0);
    const [[a1, f1], [a2, f2]] = z, [c1, c2, vh] = horiz[0];
    return {
      T: s[s.length - 1][0], z1: f1 - a1, z2: f2 - a2, z: f1 - a1 + f2 - a2, zMaior: Math.max(f1 - a1, f2 - a2),
      a1, f1, a2, f2, marcas, h: c2 - c1, c1, c2, vh, inicio: a1, fim: f2,
    };
  },
  // Curva e linha de referência: trechos acima da linha (cruzamentos sempre num vértice).
  acima(linha, g) {
    const s = linha.serie, ref = linha.ref, sobre = [];
    for (let k = 0; k < s.length - 1; k++) {
      const [t0, v0] = s[k], [t1, v1] = s[k + 1];
      if ((v0 - ref) * (v1 - ref) < 0) throw new Error(`a curva cruza ${ref} fora de um vértice entre ${t0} e ${t1}`);
      if (Math.min(v0, v1) >= ref && Math.max(v0, v1) > ref) sobre.push([t0, t1]);
    }
    const tr = juntar(sobre), T = s[s.length - 1][0];
    if (tr.some(([a, f]) => a === s[0][0] || f === T)) throw new Error('trecho acima encostado na borda do gráfico');
    let marcas = 0;
    for (let t = Math.ceil(s[0][0]); t <= T; t += g.xPasso) if (valorEm(s, t) > ref) marcas++;
    const dur = tr.map(([a, f]) => f - a);
    return {
      T, ref, s: dur.reduce((x, y) => x + y, 0), maior: Math.max(...dur), n: tr.length,
      cruz: 2 * tr.length, marcas,
      trechos: listaPt(tr.map(([a, f]) => `das ${fmtNum(a)} h às ${fmtNum(f)} h (${fmtNum(f - a)} h)`)),
      somaTxt: dur.map(fmtNum).join(' + '),
    };
  },
  // Uma grandeza em cada eixo, horário ao lado do ponto (como a Enem 2023 Q151).
  pontos(linha) {
    const p = linha.pontos;
    const A = p.filter(q => q.x > q.y), B = p.filter(q => q.y > q.x), E = p.filter(q => q.x === q.y);
    let sobe = 0;
    for (let k = 1; k < p.length; k++) if (p[k].x > p[k - 1].x) sobe++;
    return {
      total: p.length, nA: A.length, nB: B.length, nE: E.length, nSobe: sobe,
      listaA: listaPt(A.map(q => q.rotulo)), listaE: listaPt(E.map(q => q.rotulo)),
      empates: E.length === 1 ? `o empate das ${E[0].rotulo}` : `os empates ${listaPt(E.map(q => `das ${q.rotulo}`))}`,
    };
  },
};

// ---------------------------------------------------------------- SVG (sem DOM)
// Cores pelos tokens do tema (c.0.1): o traço principal usa currentColor (cor do texto);
// a linha de referência e os destaques usam --foco (cobalto no claro, #8FA8F5 no escuro).
const escA = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const FOCO = 'var(--foco, #2348C9)';

export function svgLinha(serie, g, extra = {}) {
  const W = 340, H = 232, L = 36, R = 14, T = 30, B = 40;
  const pw = W - L - R, ph = H - T - B, xMin = g.xMin ?? 0;
  const X = t => L + (t - xMin) / (g.xMax - xMin) * pw;
  const Y = v => T + ph - (v - g.yMin) / (g.yMax - g.yMin) * ph;
  const p = [];
  for (let t = xMin; t <= g.xMax; t += g.xPasso)
    p.push(`<line x1="${X(t)}" y1="${T}" x2="${X(t)}" y2="${T + ph}" stroke="currentColor" stroke-opacity="0.16" stroke-width="1"/>`);
  for (let v = g.yMin; v <= g.yMax; v += g.yPasso)
    p.push(`<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="currentColor" stroke-opacity="0.16" stroke-width="1"/>`);
  for (let t = xMin; t <= g.xMax; t += g.xRotulo)
    p.push(`<text x="${X(t)}" y="${T + ph + 15}" text-anchor="middle" font-size="11" fill="currentColor">${fmtNum(t)}</text>`);
  for (let v = g.yMin; v <= g.yMax; v += g.yRotulo || g.yPasso)
    p.push(`<text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="currentColor">${fmtNum(v)}</text>`);
  p.push(`<line x1="${L}" y1="${T + ph}" x2="${L + pw}" y2="${T + ph}" stroke="currentColor" stroke-width="1.25"/>`);
  p.push(`<line x1="${L}" y1="${T}" x2="${L}" y2="${T + ph}" stroke="currentColor" stroke-width="1.25"/>`);
  p.push(`<text x="${L - 30}" y="${T - 12}" font-size="11.5" font-weight="600" fill="currentColor">${escA(g.yTitulo)}</text>`);
  p.push(`<text x="${L + pw}" y="${H - 6}" text-anchor="end" font-size="11.5" font-weight="600" fill="currentColor">${escA(g.xTitulo)}</text>`);
  if (extra.sombrear) for (const [a, f] of extra.sombrear)
    p.push(`<rect x="${X(a)}" y="${T}" width="${X(f) - X(a)}" height="${ph}" style="fill:${FOCO};fill-opacity:0.10"/>`);
  if (linhaRef(g, extra) != null) {
    const r = linhaRef(g, extra);
    p.push(`<line x1="${L}" y1="${Y(r)}" x2="${L + pw}" y2="${Y(r)}" style="stroke:${FOCO}" stroke-width="1.5" stroke-dasharray="6 4"/>`);
    p.push(`<text x="${L + pw - 2}" y="${Y(r) - 5}" text-anchor="end" font-size="11" font-weight="600" style="fill:${FOCO}">${fmtNum(r)}${escA(g.refUnidade || '')}</text>`);
  }
  const pts = serie.map(([t, v]) => `${X(t)},${Y(v)}`).join(' ');
  p.push(`<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>`);
  if (extra.destacar) for (const [a, f] of extra.destacar) {
    const sub = serie.filter(([t]) => t >= a && t <= f).map(([t, v]) => `${X(t)},${Y(v)}`).join(' ');
    p.push(`<polyline points="${sub}" fill="none" style="stroke:${FOCO}" stroke-width="4" stroke-linecap="round"/>`);
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escA(extra.alt || '')}" focusable="false" style="width:100%;height:auto;max-width:440px;display:block;font-family:inherit;font-variant-numeric:tabular-nums">${p.join('')}</svg>`;
}
const linhaRef = (g, extra) => (extra.ref ?? g.ref ?? null);

export function svgPontos(pontos, g, extra = {}) {
  const W = 330, H = 312, L = 38, R = 16, T = 30, B = 42;
  const pw = W - L - R, ph = H - T - B;
  const X = v => L + (v - g.min) / (g.max - g.min) * pw;
  const Y = v => T + ph - (v - g.min) / (g.max - g.min) * ph;
  const p = [];
  for (let v = g.min; v <= g.max; v += g.passo) {
    p.push(`<line x1="${X(v)}" y1="${T}" x2="${X(v)}" y2="${T + ph}" stroke="currentColor" stroke-opacity="0.16"/>`);
    p.push(`<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="currentColor" stroke-opacity="0.16"/>`);
  }
  for (let v = g.min; v <= g.max; v += g.rotulo) {
    p.push(`<text x="${X(v)}" y="${T + ph + 15}" text-anchor="middle" font-size="11" fill="currentColor">${fmtNum(v)}</text>`);
    p.push(`<text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="currentColor">${fmtNum(v)}</text>`);
  }
  p.push(`<line x1="${L}" y1="${T + ph}" x2="${L + pw}" y2="${T + ph}" stroke="currentColor" stroke-width="1.25"/>`);
  p.push(`<line x1="${L}" y1="${T}" x2="${L}" y2="${T + ph}" stroke="currentColor" stroke-width="1.25"/>`);
  p.push(`<text x="${L - 32}" y="${T - 12}" font-size="11.5" font-weight="600" fill="currentColor">${escA(g.yTitulo)}</text>`);
  p.push(`<text x="${L + pw}" y="${H - 6}" text-anchor="end" font-size="11.5" font-weight="600" fill="currentColor">${escA(g.xTitulo)}</text>`);
  if (extra.diagonal) {
    p.push(`<line x1="${X(g.min)}" y1="${Y(g.min)}" x2="${X(g.max)}" y2="${Y(g.max)}" style="stroke:${FOCO}" stroke-width="1.5" stroke-dasharray="6 4"/>`);
    const d = g.min + 0.22 * (g.max - g.min);   // rótulo abaixo e à direita da diagonal, fora do traço
    p.push(`<text x="${X(d) + 10}" y="${Y(d) + 16}" text-anchor="start" font-size="11" font-weight="600" style="fill:${FOCO}">${escA(extra.diagonal)}</text>`);
  }
  if (g.ligar !== false)
    p.push(`<polyline points="${pontos.map(q => `${X(q.x)},${Y(q.y)}`).join(' ')}" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" stroke-linejoin="round"/>`);
  const POS = { d: [8, 4, 'start'], e: [-8, 4, 'end'], c: [0, -9, 'middle'], b: [0, 17, 'middle'] };
  for (const q of pontos) {
    const [dx, dy, anc] = POS[q.pos || 'd'];
    p.push(`<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="3.6" fill="currentColor"/>`);
    p.push(`<text x="${X(q.x) + dx}" y="${Y(q.y) + dy}" text-anchor="${anc}" font-size="11.5" font-weight="600" fill="currentColor">${escA(q.rotulo)}</text>`);
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escA(extra.alt || '')}" focusable="false" style="width:100%;height:auto;max-width:420px;display:block;font-family:inherit;font-variant-numeric:tabular-nums">${p.join('')}</svg>`;
}

// Texto alternativo no formato das descrições do caderno DOSVOX do INEP, rotulado como da equipe.
export function altLinha(serie, g, extra = {}) {
  const pares = serie.map(([t, v]) => `(${fmtNum(t)}; ${fmtNum(v)})`).join(', ');
  const ref = linhaRef(g, extra);
  return `Descrição da equipe Prumo. Gráfico de linha sobre uma malha quadriculada. Eixo horizontal: ${g.xDescricao}, de ${fmtNum(g.xMin ?? 0)} a ${fmtNum(g.xMax)}, com marcas de ${fmtNum(g.xPasso)} em ${fmtNum(g.xPasso)}. Eixo vertical: ${g.yDescricao}, de ${fmtNum(g.yMin)} a ${fmtNum(g.yMax)}.`
    + (ref != null ? ` Uma linha tracejada horizontal marca ${fmtNum(ref)}${g.refUnidade || ''}.` : '')
    + ` A linha liga, em ordem, os pontos ${pares}.`;
}
export function altPontos(pontos, g, extra = {}) {
  return `Descrição da equipe Prumo. Gráfico cartesiano sobre uma malha quadriculada. Eixo horizontal: ${g.xDescricao}; eixo vertical: ${g.yDescricao}; os dois de ${fmtNum(g.min)} a ${fmtNum(g.max)}.`
    + (extra.diagonal ? ' Uma linha tracejada liga os pontos em que os dois valores são iguais (a diagonal).' : '')
    + ` Pontos, com o horário escrito ao lado: ${pontos.map(q => `${q.rotulo}: (${fmtNum(q.x)}; ${fmtNum(q.y)})`).join('; ')}.`
    + (g.ligar !== false ? ' Segmentos cinza ligam os pontos na ordem dos horários.' : '');
}

// Figura pronta (SVG embutido + texto alternativo) para uma linha de um modelo de gráfico.
export const eixosDaLinha = (modelo, linha) => {
  const g = { ...modelo.grafico, ...(linha.eixo || {}) };
  if (g.tipo === 'linha' && g.xMax == null) g.xMax = linha.serie[linha.serie.length - 1][0];
  return g;
};
function figuraDe(modelo, linha) {
  const g = eixosDaLinha(modelo, linha);
  if (g.tipo === 'linha') {
    const alt = altLinha(linha.serie, g, { ref: linha.ref });
    return { svg: svgLinha(linha.serie, g, { ref: linha.ref, alt }), alt, altFonte: 'equipe' };
  }
  if (g.tipo === 'pontos') {
    const alt = altPontos(linha.pontos, g);
    return { svg: svgPontos(linha.pontos, g, { alt }), alt, altFonte: 'equipe' };
  }
  throw new Error(`tipo de gráfico desconhecido: ${g.tipo}`);
}

// ---------------------------------------------------------------- variantes
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
export function usoDaLinha(tipo, k) {
  if (tipo === 'bloco') return k === 0 ? 'pre' : 'variante';
  return k === 0 ? 'pre' : k === 1 ? 'checagem' : k <= 7 ? 'variante' : 'refazer';
}
function textoDe(m, expr, vars) {
  if (ehLinear(m)) {
    const { a, b } = coeficientes(expr, vars, m.variavel);
    return { a, b, texto: `${m.saida} = ${fmtLinear(a, b, m.variavel)}` };
  }
  const v = arred(avaliar(expr, vars));
  return { a: v, b: 0, texto: `${m.prefixo || ''}${fmtNum(v)}${m.unidade ? ' ' + m.unidade : ''}` };
}

// Grava em cada linha os valores calculados e troca {=expr} por {_vN}; devolve um modelo novo.
export function compatibilizar(m) {
  if (m.compativel) return m;
  const exprs = new Map();
  const trocar = t => (t == null ? t : reaisJuntos(t).replace(/\{=([^}]+)\}/g, (_, e) => {
    if (!exprs.has(e)) exprs.set(e, `_v${exprs.size + 1}`);
    return `{${exprs.get(e)}}`;
  }));
  const enunciado = trocar(m.enunciado), explicacao = trocar(m.explicacao);
  const erros = (m.erros || []).map(e => ({ ...e, falta: trocar(e.falta) }));
  const linhas = (m.linhas || []).map(l => {
    const vars = { ...l };
    if (m.grafico) {
      Object.assign(vars, ANALISES[m.grafico.analise](l, eixosDaLinha(m, l)));
      const f = figuraDe(m, l);
      vars.FIGURA = `<figure class="grafico-equipe">${f.svg}</figure>`;
      vars.FIGURA_ALT = f.alt;
    } else if (/\{FIGURA\}/.test(m.enunciado)) vars.FIGURA = '';
    for (const [e, nome] of exprs) vars[nome] = arred(avaliar(e, vars));
    vars.CERTA = textoDe(m, m.certa, vars).texto;
    return vars;
  });
  return { ...m, enunciado, explicacao, erros, linhas, compativel: true };
}

// Os 4 erros da linha k: os índices de linha.erros ou, sem esse campo, os 4 erros do modelo.
// Mesma regra de Pack.variante() em js/nucleo/pack.js.
export function errosDaLinha(m, linha, k) {
  const n = (m.erros || []).length;
  if (!Array.isArray(linha.erros)) {
    if (n !== 4) throw new Error(`${m.id}#${k}: o modelo tem ${n} erros; a linha tem de dizer quais 4 usa (campo erros)`);
    return m.erros;
  }
  const idx = linha.erros;
  if (idx.length !== 4 || new Set(idx).size !== 4 || idx.some(i => !Number.isInteger(i) || i < 0 || i >= n))
    throw new Error(`${m.id}#${k}: linha.erros tem de trazer 4 índices distintos entre 0 e ${n - 1}`);
  return idx.map(i => m.erros[i]);
}

export function materializar(modelo) {
  if (!Array.isArray(modelo.erros) || modelo.erros.length < 4 || modelo.erros.length > 6) throw new Error(`${modelo.id}: precisa de 4 a 6 erros`);
  const m = compatibilizar(modelo);
  return m.linhas.map((vars, k) => {
    const brutas = [{ expr: m.certa, certa: true }, ...errosDaLinha(m, vars, k).map(e => ({ ...e, certa: false }))];
    const alts = brutas.map(x => ({ ...x, ...textoDe(m, x.expr, vars) }));
    const textos = new Set(alts.map(x => x.texto));
    if (textos.size !== 5) throw new Error(`${m.id}#${k}: alternativas repetidas (${alts.map(x => x.texto).join(' | ')})`);
    alts.sort((x, y) => x.a - y.a || x.b - y.b);
    const alternativas = alts.map((x, j) => (x.certa
      ? { letra: LETRAS[j], texto: x.texto, certa: true, expr: x.expr }
      : { letra: LETRAS[j], texto: x.texto, expr: x.expr, falta: preencher(x.falta, vars), paragrafo: x.paragrafo }));
    return {
      id: `${m.id}#${k}`, modelo: m.id, k, uso: usoDaLinha(m.tipo, k),
      origem: 'equipe', pagina: m.pagina, bloco: m.bloco, formato: m.formato,
      enunciado: preencher(m.enunciado, vars), alternativas, gabarito: alternativas.find(x => x.certa).letra,
      explicacao: preencher(m.explicacao, vars),
      figura: vars.FIGURA_ALT ? { alt: vars.FIGURA_ALT, altFonte: 'equipe' } : null,
      licenca: m.licenca, autoria: m.credito && m.credito.autoria,
    };
  });
}
