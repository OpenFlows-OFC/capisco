// Conferência das questões do Enem dos Caps. 3 e 4 do caderno "Funções afins"
// contra o ITENS_PROVA do INEP (Caderno Azul, 2º dia, 1ª aplicação).
// Uso: node prumo/_dev/conferencia_c34.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const TCC = resolve(aqui, '../../../..');
const INEP = resolve(TCC, 'rebranding/anexos/inep');
const RAW = resolve(TCC, 'prototipo/dados_enem/raw');

// CO_PROVA do Caderno Azul da 1ª aplicação (o menor código "Azul" de MT em cada ano).
export const PROVA_AZUL = { 2019: 515, 2020: 587, 2021: 899, 2022: 1085, 2023: 1211 };

export const ALVO = [
  { ano: 2019, n: 143, cap: 'mat-fa.c3' },
  { ano: 2020, n: 175, cap: 'mat-fa.c3' },
  { ano: 2019, n: 179, cap: 'mat-fa.c3' },
  { ano: 2021, n: 164, cap: 'mat-fa.c4' },
  { ano: 2023, n: 175, cap: 'mat-fa.c4' },
];

function lerItens(ano) {
  const txt = readFileSync(resolve(INEP, `ITENS_PROVA_${ano}.csv`), 'latin1').replace(/\r/g, '');
  const [cab, ...linhas] = txt.split('\n').filter(Boolean);
  const cols = cab.split(';');
  return linhas.map(l => Object.fromEntries(l.split(';').map((v, i) => [cols[i], v])));
}

export function conferir({ ano, n }) {
  const itens = lerItens(ano);
  const azul = itens.filter(r => r.SG_AREA === 'MT' && /^AZUL$/i.test(r.TX_COR));
  const provas = [...new Set(azul.map(r => +r.CO_PROVA))].sort((a, b) => a - b);
  const coProva = provas[0];
  const linha = azul.find(r => +r.CO_PROVA === coProva && +r.CO_POSICAO === n);
  const raw = JSON.parse(readFileSync(resolve(RAW, `enem_${ano}.json`), 'utf8'))
    .filter(q => q.index === n && q.language == null);
  const q = raw[0];
  return {
    id: `enem-${ano}-${n}`, coProva, provasAzul: provas,
    coItem: +linha.CO_ITEM, gabaritoINEP: linha.TX_GABARITO, gabaritoEnemDev: q?.correctAlternative,
    habilidade: `MT-H${+linha.CO_HABILIDADE}`, anulada: linha.IN_ITEM_ABAN === '1',
    motivo: linha.TX_MOTIVO_ABAN || null,
    a: +linha.NU_PARAM_A, b: +linha.NU_PARAM_B, c: +linha.NU_PARAM_C,
    registrosEnemDev: raw.length,
    confere: !!q && linha.TX_GABARITO === q.correctAlternative && linha.IN_ITEM_ABAN !== '1',
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  for (const alvo of ALVO) console.log(JSON.stringify({ cap: alvo.cap, ...conferir(alvo) }));
}
