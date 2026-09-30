/* =========================================================
   CAPISCO · gerador do wordmark vetorial
   Parte dos contornos reais da Fredoka Bold e aplica cortes mínimos:
   - pingo do "i" vira um "squircle", o mesmo quadrado redondo da cabeça da Capi
   - (variante "trilha") a perna do "p" continua por baixo do nome como a trilha do mapa,
     subindo de leve até um ponto de chegada: perseverança + objetivo
   Uso: node gera_wordmark.js <pasta com node_modules> <pasta de saída>
   ========================================================= */
const path = require('path');
const fs = require('fs');
const MODS = process.argv[2];
const OUT = process.argv[3];
const opentype = require(path.join(MODS, 'opentype.js'));
const buf = fs.readFileSync(path.join(MODS, '@fontsource/fredoka/files/fredoka-latin-600-normal.woff'));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const SIZE = 100, TRACK = 0.5;   // tracking em unidades do tamanho 100

function contours(cmds) {
  const out = []; let cur = [];
  for (const c of cmds) { if (c.type === 'M' && cur.length) { out.push(cur); cur = []; } cur.push(c); if (c.type === 'Z') { out.push(cur); cur = []; } }
  if (cur.length) out.push(cur);
  return out;
}
function bbox(cs) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const c of cs) for (const k of ['', '1', '2']) {
    const x = c['x' + k], y = c['y' + k];
    if (x === undefined) continue;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
const f = n => +n.toFixed(2);
function toD(cs) {
  return cs.map(c => c.type === 'Z' ? 'Z' : c.type === 'Q' ? `Q${f(c.x1)} ${f(c.y1)} ${f(c.x)} ${f(c.y)}`
    : c.type === 'C' ? `C${f(c.x1)} ${f(c.y1)} ${f(c.x2)} ${f(c.y2)} ${f(c.x)} ${f(c.y)}` : `${c.type}${f(c.x)} ${f(c.y)}`).join('');
}
// superelipse (squircle): n=4 lembra a cabeça quadrada-redonda da Capi
function squircle(cx, cy, rx, ry, n = 4, steps = 48) {
  let d = '';
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
    const x = cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n), y = cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n);
    d += (i ? 'L' : 'M') + f(x) + ' ' + f(y);
  }
  return d + 'Z';
}
function ellipse(cx, cy, rx, ry) {
  return `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`;
}

function build(variant) {
  const text = 'capisco';
  let x = 0; const parts = []; const box = {};
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, SIZE);
    const cs = contours(p.commands);
    const ch = text[i];
    let d;
    if (ch === 'i') {
      const byTop = cs.map(c => ({ c, b: bbox(c) })).sort((a, b) => a.b.y0 - b.b.y0);
      const dot = byTop[0].b, stem = byTop.slice(1).map(o => o.c).flat();
      const r = Math.max(dot.w, dot.h) / 2 * 1.06;
      d = toD(stem) + squircle(dot.cx, dot.cy - 0.6, r, r * 0.96);
    } else if (ch === 'o' && i === text.length - 1 && variant === 'enem') {
      const bs = cs.map(c => ({ c, b: bbox(c) })).sort((a, b) => b.b.w - a.b.w);
      const outer = bs[0].b, inner = bs[1].b;
      const gap = inner.w * 0.28;
      d = toD(p.commands) + ellipse(inner.cx, inner.cy, inner.w / 2 - gap, inner.h / 2 - gap);
    } else {
      d = toD(p.commands);
    }
    parts.push(d);
    box[ch + i] = bbox(p.commands);
    const next = glyphs[i + 1];
    x += g.advanceWidth * SIZE / font.unitsPerEm + TRACK + (next ? font.getKerningValue(g, next) * SIZE / font.unitsPerEm : 0);
  });
  let all = parts.join(''), trail = '', tw = 0, bottom = 0, extraW = 0, cut = '', cw = 0, dash = '';
  if (variant === 'estrada') {
    // o "s" vira estrada: faixa central tracejada, vazada no meio da haste
    const b = box.s4, st = 12.2, h = st / 2;
    const X = u => f(b.x0 + h + u * (b.w - st)), Y = v => f(b.y0 + h + v * (b.h - st));
    cut = `M${X(0.93)} ${Y(0.13)}C${X(0.72)} ${Y(-0.04)} ${X(0.02)} ${Y(-0.04)} ${X(0.03)} ${Y(0.26)}C${X(0.04)} ${Y(0.52)} ${X(0.96)} ${Y(0.44)} ${X(0.97)} ${Y(0.72)}C${X(0.98)} ${Y(1.04)} ${X(0.24)} ${Y(1.04)} ${X(0.05)} ${Y(0.84)}`;
    cw = f(st * 0.2); dash = `${f(st * 0.34)} ${f(st * 0.5)}`;
  }
  if (variant === 'trilha') {
    // a perna do "p" continua como a trilha do mapa: sobe de leve e termina no ponto de chegada
    const pb = box.p2, ob = box.o6, ib = box.i3;
    const s = 12.2;                          // espessura aproximada da haste da Fredoka Bold em 100px
    tw = s * 0.62;
    const sx = pb.x0 + s / 2 + 0.6, y0 = pb.y1 - s * 0.9;
    const ex = ob.x1 + 9, ey = 6;
    trail = `M${f(sx)} ${f(y0)}C${f(sx)} ${f(pb.y1 + 3)} ${f(sx + 8)} ${f(21)} ${f(sx + 22)} ${f(20.5)}C${f(ib.cx + 60)} ${f(19.5)} ${f(ex - 22)} ${f(15)} ${f(ex - 8)} ${f(ey + 3)}`;
    all += ellipse(ex, ey, s * 0.52, s * 0.52);
    bottom = pb.y1 + 4; extraW = ex + s * 0.52 + 2;
  }
  // bbox geral via caminho de todas as letras
  const bb = font.getPath(text, 0, 0, SIZE, { kerning: true }).getBoundingBox();
  const pad = 2, vb = [f(bb.x1 - pad), f(bb.y1 - pad - 2), f(x - TRACK - bb.x1 + pad * 2), f(bb.y2 - bb.y1 + pad * 2 + 2)];
  if (extraW) vb[2] = f(Math.max(vb[2], extraW - vb[0]));
  if (bottom) vb[3] = f(Math.max(vb[1] + vb[3], bottom + pad) - vb[1]);
  return { d: all, trail, tw: f(tw), cut, cw, dash, viewBox: vb.join(' ') };
}

fs.mkdirSync(OUT, { recursive: true });
const V = { limpa: build('limpa'), estrada: build('estrada') };
for (const [k, v] of Object.entries(V)) {
  fs.writeFileSync(path.join(OUT, `capisco-wordmark-${k}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.viewBox}">${v.cut ? `<mask id="m" maskUnits="userSpaceOnUse" x="-50" y="-150" width="600" height="300"><rect x="-50" y="-150" width="600" height="300" fill="#fff"/><path d="${v.cut}" fill="none" stroke="#000" stroke-width="${v.cw}" stroke-dasharray="${v.dash}" stroke-linecap="round"/></mask>` : ""}<path ${v.cut ? 'mask="url(#m)" ' : ""}fill="#0fa292" fill-rule="evenodd" d="${v.d}"/>${v.trail ? `<path fill="none" stroke="#0fa292" stroke-width="${v.tw}" stroke-linecap="round" d="${v.trail}"/>` : ""}</svg>\n`);
}
fs.writeFileSync(path.join(OUT, 'wordmark.js'),
  `/* gerado por marca/src/gera_wordmark.js — não editar à mão */\nconst CAPISCO_WM=${JSON.stringify(V)};\n`);
console.log('ok', V.limpa.viewBox);
