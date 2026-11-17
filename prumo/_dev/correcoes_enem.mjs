// Prumo · conferência das 12 questões do caderno (7 dos Caps. 1 e 2, 5 dos Caps. 3 e 4) com o PDF oficial
// do INEP (e.1, g.2, g.6). Lido por _dev/extrai_enem_c12.mjs (Caps. 1 e 2) e por _dev/c34_build.mjs (Caps. 3
// e 4), que aplicam as correções ao gerar o conteúdo, e por _dev/valida_pack.mjs (aplica as mesmas correções
// à transcrição do enem.dev antes de comparar o texto).
//
// A transcrição do enem.dev tem falhas pontuais; o texto que vale é o impresso no caderno. Cada correção
// troca um trecho EXATO da transcrição pelo trecho impresso no PDF. Se o trecho "de" não for encontrado,
// a geração e a validação falham: a transcrição mudou e a conferência tem de ser refeita.
// Os trechos dos PDFs estão em _dev/fontes/pdf_azul_c12.txt e _dev/fontes/pdf_azul_c34.txt (texto extraído,
// com URL e SHA-256); as páginas renderizadas da 2019 Q168 e da 2021 Q141 estão em _dev/capturas/pdf-enem-*.png.
// Imagem trocada por recorte do PDF (campo imagem.recorte): mesmo nome de arquivo, renderizada com PyMuPDF,
// sem mudar o conteúdo (só recorte e formato).
// Mudanças só de formato (quebra de linha da diagramação, separador de milhar, espaços) são "technically
// necessary" na CC BY-ND 3.0; nenhuma palavra do INEP é trocada por outra que não esteja no PDF.

const NBSP = ' ';   // espaço do separador de milhar ("1 000"), sem quebra de linha no meio do número

export const PDF = {
  2019: { url: 'https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf',
    sha256: 'a476882608be2bf1353af8b26c60838ac187f2d1a3653524c90de62b0372efa6' },
  2020: { url: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf',
    sha256: 'f9970a82e0ee67a31ec16e2f14c99e620738b88dfe7c68484128964a5d5d69bc' },
  2021: { url: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD7.pdf',
    sha256: '887b2a10ebb163f0c40db2ab4f67a5a4b5959ceb74ce7273466a755b8e55f540' },
  2023: { url: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf',
    sha256: '49e7ad9d0ab25710f6e5c4c3296fc40b63d86a3a87d5f25d83e8ecc81b98415b' },
};

const alt = (letra, de, para) => ({ campo: `alternativas.${letra}`, de, para });

// em: data da leitura contra o PDF (vai para textoConferidoPDF); pagina: página do arquivo PDF.
export const CONFERENCIA = {
  'enem-2023-162': { em: '2026-11-17', pagina: 24,
    nota: 'O PDF traz "y" minúsculo nas cinco alternativas, como no enunciado; o caderno DOSVOX Laranja (questão 145) também. A transcrição trazia "Y".',
    correcoes: [
      alt('A', 'Y = 250x', 'y = 250x'), alt('B', 'Y = 500x', 'y = 500x'), alt('C', 'Y = 750x', 'y = 750x'),
      alt('D', 'Y = 250x + 500', 'y = 250x + 500'), alt('E', 'Y = 500x + 250', 'y = 500x + 250'),
    ] },
  'enem-2023-150': { em: '2026-11-17', pagina: 21, nota: 'Igual ao PDF.', correcoes: [] },
  'enem-2019-168': { em: '2026-11-17', pagina: 26,
    nota: 'O PDF traz "R$ 1 000,00" e "Cada um deles trabalha"; a transcrição omitia o "deles", juntou o milhar e partiu o parágrafo em dois (a linha do PDF é justificada: é quebra da diagramação). Alternativas com "1 000".',
    correcoes: [
      { campo: 'contexto', de: 'R$ 1000,00 por semana.  \nOs outros', para: `R$ 1${NBSP}000,00 por semana. Os outros` },
      { campo: 'contexto', de: 'Cada um trabalha', para: 'Cada um deles trabalha' },
      alt('B', 'Y = 80X + 1000.', `Y = 80X + 1${NBSP}000.`), alt('C', 'Y = 80X + 1080.', `Y = 80X + 1${NBSP}080.`),
      alt('E', 'Y = 160X + 1000.', `Y = 160X + 1${NBSP}000.`),
    ] },
  'enem-2021-141': { em: '2026-11-17', pagina: 19,
    nota: 'Leitura na página renderizada (o texto do PDF usa, em parte, fonte sem mapa Unicode). O enunciado confere; as alternativas do PDF usam o ponto a meia altura para multiplicar e espaços dos dois lados de "=" e "+". A transcrição trazia "P=d.n + L + d.n.s", "P= d+ L +s" etc.',
    correcoes: [
      alt('A', 'P=d.n + L + d.n.s', 'P = d·n + L + d·n·s'), alt('B', 'P=d.n + L + d.s', 'P = d·n + L + d·s'),
      alt('C', 'P= d+ L +s', 'P = d + L + s'), alt('D', 'P= d.n.s + L', 'P = d·n·s + L'),
      alt('E', 'P= d.n + L +s', 'P = d·n + L + s'),
    ] },
  'enem-2023-156': { em: '2026-11-17', pagina: 22, nota: 'Igual ao PDF.', correcoes: [] },
  'enem-2020-164': { em: '2026-11-17', pagina: 24,
    nota: 'Texto igual ao PDF. A imagem do enem.dev (285 × 156 px, foto do caderno) foi trocada por um recorte do gráfico renderizado do PDF oficial (1040 × 532 px), com a linha de fonte.',
    correcoes: [],
    imagem: { recorte: 'Recorte do gráfico da questão 164 (página 24 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 4× com PyMuPDF em 17/11/2026, com a linha de fonte. Só mudança de formato.' } },
  'enem-2023-151': { em: '2026-11-17', pagina: 21, nota: 'Igual ao PDF (os rótulos dos eixos estão dentro da imagem).', correcoes: [] },

  // ---- Caps. 3 e 4 (lidas em 17/11/2026 no texto extraído e na página renderizada de cada PDF)
  'enem-2019-143': { em: '2026-11-17', pagina: 19,
    nota: 'Texto igual ao PDF. A imagem do enem.dev (527 × 259 px) foi trocada por um recorte do gráfico renderizado do PDF oficial (764 × 361 px).',
    correcoes: [],
    imagem: { recorte: 'Recorte do gráfico da questão 143 (página 19 do PDF oficial do Enem 2019, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026. Só mudança de formato.' } },
  'enem-2020-175': { em: '2026-11-17', pagina: 29,
    nota: 'Texto igual ao PDF, inclusive "Receita – Custo" com meia-risca (U+2013), como no PDF. As seis imagens do enem.dev (fotos do caderno, de 202 × 136 a 225 × 175 px) foram trocadas por recortes do PDF oficial renderizados em 3× (597 × 450 px no gráfico do enunciado; cerca de 530 × 390 px em cada alternativa), sem a letra da alternativa, que o app já mostra.',
    correcoes: [],
    imagem: { recorte: 'Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.' } },
  'enem-2019-179': { em: '2026-11-17', pagina: 31,
    nota: 'O PDF traz "watt × minuto" (sinal de multiplicação) e "A sequência de deslocamentos" (plural); a transcrição trazia "watt x minuto" (letra x) e "deslocamento". As alternativas conferem (as setas são desenhadas à parte no PDF; lidas na página renderizada). A imagem do enem.dev (648 × 228 px) foi trocada por recortes do PDF oficial: o gráfico e a planta, que no caderno ficam lado a lado, vão um embaixo do outro numa imagem só (881 × 1396 px), para os rótulos de potência ficarem legíveis na largura do celular. Só mudança de formato: nada foi redesenhado.',
    correcoes: [
      { campo: 'contexto', de: 'em watt x minuto,', para: 'em watt × minuto,' },
      { campo: 'introducao', de: 'A sequência de deslocamento pelos cômodos', para: 'A sequência de deslocamentos pelos cômodos' },
    ],
    imagem: { recorte: 'Recortes do gráfico e da planta baixa da questão 179 (página 31 do PDF oficial do Enem 2019, 2º dia, Caderno Azul), renderizados com PyMuPDF em 17/11/2026 (gráfico em 4×, planta em cerca de 4,4×, as duas com a mesma largura) e postos um embaixo do outro, e não lado a lado como no caderno. Só mudança de formato.' } },
  'enem-2021-164': { em: '2026-11-17', pagina: 28,
    nota: 'O PDF traz "até 10 kg", com espaço, como nas outras duas vezes em que a massa aparece; a transcrição trazia "até 10kg". No PDF, a coluna Viagem da tabela usa fonte sem mapa Unicode: "I" e "II" foram lidos na página renderizada e conferem com a imagem do enem.dev, que foi mantida (nítida, 452 × 103 px).',
    correcoes: [{ campo: 'contexto', de: 'mala com até 10kg.', para: 'mala com até 10 kg.' }] },
  'enem-2023-175': { em: '2026-11-17', pagina: 29, nota: 'Igual ao PDF.', correcoes: [] },
};

function trocar(texto, c, id) {
  if (typeof texto !== 'string' || !texto.includes(c.de)) throw new Error(`${id}: correção de ${c.campo} não encontrou "${c.de}" na transcrição (refazer a conferência)`);
  return texto.replace(c.de, c.para);
}

// Devolve uma cópia da questão do enem.dev com as correções da conferência aplicadas.
export function corrigirRaw(id, raw) {
  const conf = CONFERENCIA[id];
  if (!conf || !raw) return raw;
  const q = { ...raw, alternatives: (raw.alternatives || []).map(a => ({ ...a })) };
  for (const c of conf.correcoes) {
    if (c.campo === 'contexto') q.context = trocar(q.context, c, id);
    else if (c.campo === 'introducao') q.alternativesIntroduction = trocar(q.alternativesIntroduction, c, id);
    else if (c.campo.startsWith('alternativas.')) {
      const a = q.alternatives.find(x => x.letter === c.campo.slice(13));
      if (!a) throw new Error(`${id}: alternativa ${c.campo} não existe`);
      a.text = trocar(a.text, c, id);
    } else throw new Error(`${id}: campo de correção desconhecido ${c.campo}`);
  }
  return q;
}
