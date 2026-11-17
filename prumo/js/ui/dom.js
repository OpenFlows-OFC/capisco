/* =========================================================
   PRUMO · utilitários de tela (sem regra de negócio)
   h`...` monta HTML escapando tudo o que entra, menos o que vier de cru()
   ou de outro h`...`. Texto do aluno (notas, anotações) entra sempre escapado;
   só o HTML do pack (enunciados, parágrafos, figuras) entra com cru().
   ========================================================= */

class Cru {
  constructor(s) { this.s = String(s); }
  toString() { return this.s; }
}
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Escapa texto para HTML. */
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);
/** Marca uma string como HTML confiável (só para o HTML do pack e para SVG do app). */
export const cru = s => new Cru(s == null ? '' : s);
const valor = v => (v == null || v === false || v === true ? '' : v instanceof Cru ? v.s : Array.isArray(v) ? v.map(valor).join('') : esc(v));
/** Template que escapa os valores. Devolve HTML confiável (pode ser aninhado). */
export const h = (partes, ...vs) => cru(partes.reduce((a, s, i) => a + s + (i < vs.length ? valor(vs[i]) : ''), ''));
/** Junta uma lista com uma função que devolve h``. */
export const cada = (lista, fn) => cru((lista || []).map((x, i) => valor(fn(x, i))).join(''));
/** Texto para atributo (dataset, aria-label). */
export const attr = s => esc(s);

/** O sistema pediu menos movimento? */
export const reduzido = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
};
/** Dois quadros de animação (para aplicar uma classe depois de o elemento existir). */
export const depoisDoQuadro = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

/** Baixa um arquivo gerado no aparelho ({ nome, conteudo, tipo }). Devolve false se o navegador recusou. */
export function baixar({ nome, conteudo, tipo }) {
  try {
    const blob = new Blob([conteudo], { type: tipo || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nome; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (e) { return false; }
}
/** Lê um arquivo escolhido pelo aluno como texto. */
export function lerArquivo(arquivo) {
  return new Promise((ok, erro) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result || ''));
    r.onerror = () => erro(r.error);
    r.readAsText(arquivo);
  });
}
/** Abre o seletor de arquivo e devolve o texto (ou null se o aluno cancelou). */
export function escolherArquivo(aceita = '.json,application/json') {
  return new Promise(ok => {
    const i = document.createElement('input');
    i.type = 'file'; i.accept = aceita; i.style.display = 'none';
    i.addEventListener('change', async () => {
      const f = i.files && i.files[0];
      i.remove();
      if (!f) return ok(null);
      try { ok(await lerArquivo(f)); } catch (e) { ok(null); }
    });
    document.body.appendChild(i);
    i.click();
  });
}
