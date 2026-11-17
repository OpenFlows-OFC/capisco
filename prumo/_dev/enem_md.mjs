// Conversão do markdown da transcrição do enem.dev para HTML (e.6, passo 3).
// Só mudanças de formato, como a CC BY-ND 3.0 permite ("technically necessary"):
// escapar o HTML, juntar as quebras de linha da diagramação do PDF, trocar
// "_x_" por <em>, "**x**" por <strong> e "![](url)" pela cópia local da imagem.
// Não usa renderizador de LaTeX (três questões têm "R$", que quebraria um que use "$").
// Usado por _dev/extrai_enem_c12.mjs (gera o texto) e por _dev/valida_pack.mjs (confere).

// A transcrição do enem.dev põe U+00A0 em vários pontos onde o PDF quebrava a linha ("que percebemos").
// Juntar as quebras da diagramação é mudança de formato (e.1): esses viram espaço comum. Ficam inquebráveis
// só os de propósito: em volta de uma variável de uma letra ("preço y do"), depois de "R$" e entre algarismos
// (milhar "1 000", posto por _dev/correcoes_enem.mjs). textoDeMd/textoDeHtml tratam os dois espaços igual.
export function soltarNbsp(s) {
  if (!s) return s;
  // "a", "e" e "o" soltos são artigo ou conjunção ("que a pessoa"), e não variável.
  const variavel = t => /^_[A-Za-z]_[.,;:)]?$/.test(t) || /^(?![aeo])[A-Za-z][.,;:)]?$/.test(t);
  return s.replace(/(\S*)\u00a0(?=(\S*))/g, (m, a, b) =>
    (variavel(a) || variavel(b) || /R\$$/.test(a) || (/\d$/.test(a) && /^\d/.test(b))) ? m : a + ' ');
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1<em>$2</em>');
}

// imagens: { [url]: { src, alt } } — a URL original vira a cópia local.
export function mdParaHtml(md, imagens = {}) {
  if (!md) return '';
  const paragrafos = soltarNbsp(md).replace(/\r/g, '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  return paragrafos.map(p => {
    const img = p.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (img) {
      const i = imagens[img[1]];
      if (!i) throw new Error(`imagem sem cópia local: ${img[1]}`);
      return `<figure class="enem-img"><img src="${i.src}" alt="${esc(i.alt).replace(/"/g, '&quot;')}" loading="lazy"></figure>`;
    }
    // Quebra "  \n": no meio da frase é diagramação do PDF (junta com espaço);
    // depois de ponto final, dois-pontos ou interrogação, vira <br>.
    const linhas = p.split(/ {2,}\n|\n/);
    let html = '';
    linhas.forEach((l, i) => {
      const t = l.trim();
      if (i === 0) { html = inline(t); return; }
      const anterior = linhas[i - 1].trim();
      html += /[.:;?!]$/.test(anterior) ? '<br>' + inline(t) : ' ' + inline(t);
    });
    const classe = /^Disponível em:/i.test(p) ? ' class="fonte"' : '';
    return `<p${classe}>${html}</p>`;
  }).join('');
}

// Texto corrido para comparação (ND: o texto não pode mudar).
export function textoDeMd(md) {
  return (md || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1$2')
    .replace(/\s+/g, ' ').trim();
}

export function textoDeHtml(html) {
  return (html || '')
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}
