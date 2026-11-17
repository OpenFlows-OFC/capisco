// Extrai, das cópias locais do enem.dev e do ITENS_PROVA do INEP, os campos
// reproduzidos sem adaptação das 7 questões dos Caps. 1 e 2 (g.2).
// Uso: node prumo/_dev/extrai_enem_c12.mjs            (imprime JSON para conferência)
//      node prumo/_dev/extrai_enem_c12.mjs --escrever (gera conteudo/mat-fa-c12-enem.js)
// O texto do INEP não é digitado: sai deste script. As anotações da equipe (o que faltou,
// explicação, blocos) ficam em conteudo/mat-fa-c12.js. O validador refaz a conferência.
// A conferência com o PDF oficial (_dev/correcoes_enem.mjs) corrige as falhas pontuais da transcrição
// e preenche textoConferidoPDF; fonteMd guarda o markdown original do enem.dev, para auditoria.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mdParaHtml } from './enem_md.mjs';
import { CONFERENCIA, PDF, corrigirRaw } from './correcoes_enem.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const TCC = resolve(aqui, '../../../..');
const RAW = resolve(TCC, 'prototipo/dados_enem/raw');
const INEP = resolve(TCC, 'rebranding/anexos/inep');

// Texto alternativo: descrição oficial do caderno DOSVOX de 2023 (INEP) quando existe;
// para a 2020 Q164, descrição da equipe, rotulada (c.0.1, g.2).
const DOSVOX = readFileSync(resolve(aqui, 'fontes/2023_Dia_2_P1_MT_Caderno_11_Laranja_DOSVOX.txt'), 'latin1').replace(/\r/g, '').split('\n');
function descricaoDosvox(inicio) {
  const i = DOSVOX.findIndex(l => l.startsWith(inicio));
  if (i < 0) throw new Error('descrição DOSVOX não encontrada: ' + inicio);
  const out = [];
  for (let k = i; k < DOSVOX.length; k++) { out.push(DOSVOX[k].trim()); if (DOSVOX[k].includes('(Fim da descrição)')) break; }
  return out.filter(Boolean).join(' ');
}
const ALT = {
  'enem-2023-156': { alt: descricaoDosvox('Descrição do gráfico: Gráfico cartesiano sobre uma malha quadriculada, em que o eixo horizontal representa o tempo'),
    altFonte: 'DOSVOX/INEP', altRef: 'INEP, Enem 2023, 2º dia, caderno 11 Laranja DOSVOX, questão 143 (a 156 do Caderno Azul)' },
  'enem-2023-151': { alt: descricaoDosvox('Descrição do gráfico: Gráfico cartesiano que relaciona os valores'),
    altFonte: 'DOSVOX/INEP', altRef: 'INEP, Enem 2023, 2º dia, caderno 11 Laranja DOSVOX, questão 154 (a 151 do Caderno Azul)' },
  'enem-2020-164': { altFonte: 'equipe', altRef: 'Descrição escrita pela equipe Prumo (não há caderno DOSVOX de 2020 nas fontes consultadas)',
    alt: 'Descrição da equipe Prumo. Gráfico de linha sobre uma malha de linhas verticais. Eixo horizontal: hora, de 0 a 24, de 1 em 1. Eixo vertical: decibel, com as marcas 0 e 55. Uma reta horizontal marca 55 decibéis. A curva começa em 0 às 0 h e cruza a reta dos 55 decibéis às 2 h (subindo), às 5 h (descendo), às 6 h (subindo), às 9 h (descendo), às 11 h (subindo), às 14 h (descendo), às 16 h (subindo), às 17 h (descendo), às 19 h (subindo) e às 22 h (descendo). Das 22 h às 24 h, fica abaixo da reta. O ponto mais alto fica perto das 8 h. Abaixo do gráfico, a linha de fonte: Disponível em: www.revistaencontro.com.br. Acesso em: 12 ago. 2020 (adaptado).' },
};
// Linha de fonte de terceiros que aparece dentro da imagem (não está no texto da transcrição).
const TERCEIROS_NA_IMAGEM = { 'enem-2020-164': 'Disponível em: www.revistaencontro.com.br. Acesso em: 12 ago. 2020 (adaptado). (linha de fonte impressa abaixo do gráfico, na imagem)' };

export const ALVO = [
  { ano: 2023, n: 162, img: [] },
  { ano: 2023, n: 150, img: [] },
  { ano: 2019, n: 168, img: [] },
  { ano: 2021, n: 141, img: [] },
  { ano: 2023, n: 156, img: ['enem-2023-156.png'] },
  { ano: 2020, n: 164, img: ['enem-2020-164.png'] },
  { ano: 2023, n: 151, img: ['enem-2023-151.png'] },
];

export function lerItens(ano) {
  const txt = readFileSync(resolve(INEP, `ITENS_PROVA_${ano}.csv`), 'latin1').replace(/\r/g, '');
  const [cab, ...linhas] = txt.split('\n').filter(Boolean);
  const cols = cab.split(';');
  return linhas.map(l => Object.fromEntries(l.split(';').map((v, i) => [cols[i], v])));
}

export function lerRaw(ano, n) {
  const todos = JSON.parse(readFileSync(resolve(RAW, `enem_${ano}.json`), 'utf8'));
  return todos.find(q => q.index === n && q.language == null);   // há registros duplicados (2023 Q150)
}

export function extrair() {
  const cur = JSON.parse(readFileSync(resolve(TCC, 'rebranding/anexos/curadoria.json'), 'utf8')).itens;
  const saida = {};
  for (const { ano, n, img } of ALVO) {
    const id = `enem-${ano}-${n}`;
    const bruto = lerRaw(ano, n);
    const q = corrigirRaw(id, bruto);
    const conf = CONFERENCIA[id] || null;
    const c = cur.find(x => x.id === id);
    const linha = lerItens(ano).find(r => +r.CO_PROVA === c.coProva && +r.CO_POSICAO === n);
    if (!linha) throw new Error(`${id}: item não encontrado no ITENS_PROVA`);
    if (linha.TX_GABARITO !== q.correctAlternative) throw new Error(`${id}: gabarito INEP ${linha.TX_GABARITO} x enem.dev ${q.correctAlternative}`);
    if (linha.IN_ITEM_ABAN !== '0') throw new Error(`${id}: item anulado pelo INEP`);
    const mapa = {}, imagens = [];
    (q.files || []).forEach((u, i) => {
      const meta = ALT[id];
      if (!meta) throw new Error(`${id}: imagem sem texto alternativo`);
      const im = { src: `conteudo/img/${img[i]}`, alt: meta.alt, altFonte: meta.altFonte, altRef: meta.altRef, original: u };
      if (conf?.imagem?.recorte) Object.assign(im, { recorte: conf.imagem.recorte, recortePDF: PDF[ano].url });
      mapa[u] = im; imagens.push(im);
    });
    const terceiros = [c.materialDeTerceiros, TERCEIROS_NA_IMAGEM[id]].filter(Boolean);
    saida[id] = {
      id, ano, numero: n, habilidade: `MT-H${+linha.CO_HABILIDADE}`,
      inep: { coItem: +linha.CO_ITEM, coProva: +linha.CO_PROVA, a: +linha.NU_PARAM_A, b: +linha.NU_PARAM_B, c: +linha.NU_PARAM_C },
      gabarito: linha.TX_GABARITO,
      contexto: mdParaHtml(q.context, mapa), introducao: q.alternativesIntroduction,
      alternativas: q.alternatives.map(a => ({ letra: a.letter, texto: a.text })),
      imagens, fonteMd: bruto.context,
      materialDeTerceiros: terceiros.length ? terceiros.join(' · ') : null,
      textoConferidoPDF: conf ? conf.em : null,
      conferenciaPDF: conf ? { pdf: PDF[ano].url, sha256: PDF[ano].sha256, pagina: conf.pagina, nota: conf.nota,
        correcoes: conf.correcoes.map(c => ({ ...c })) } : null,
    };
  }
  return saida;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const dados = extrair();
  if (process.argv.includes('--escrever')) {
    const destino = resolve(aqui, '../conteudo/mat-fa-c12-enem.js');
    writeFileSync(destino, `// GERADO por _dev/extrai_enem_c12.mjs a partir de prototipo/dados_enem/raw (enem.dev, commit 938c56f)
// e de rebranding/anexos/inep/ITENS_PROVA_<ano>.csv, com as correções da conferência com o PDF oficial
// (_dev/correcoes_enem.mjs). NÃO EDITE À MÃO: o texto do INEP é reproduzido sem adaptação (CC BY-ND 3.0);
// só houve mudança de formato (markdown para HTML, imagem local).
export const ENEM_C12 = ${JSON.stringify(dados, null, 1)};
`);
    console.log('escrito: ' + destino);
  } else console.log(JSON.stringify(dados, null, 1));
}
