/* Ajudantes dos testes do núcleo (node --test). */
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { pack as fixture } from './fixture-pack.mjs';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));
export const CAMINHO_PACK_REAL = path.resolve(aqui, '../../conteudo/mat-fa.js');

/** Packs contra os quais os testes rodam: a fixture sempre; o pack real quando existir. PRUMO_TESTE_PACK=fixture|real filtra. */
export async function packs() {
  const out = [{ nome: 'fixture', dados: fixture }];
  if (existsSync(CAMINHO_PACK_REAL)) {
    const m = await import(pathToFileURL(CAMINHO_PACK_REAL).href);
    out.push({ nome: 'mat-fa.js', dados: m.pack });
  }
  const f = process.env.PRUMO_TESTE_PACK;
  return f ? out.filter(p => (f === 'real' ? p.nome === 'mat-fa.js' : p.nome === 'fixture')) : out;
}
export const PERFIL = { provaTipo: 'escola', prova: '2026-12-15', dias: [1, 2, 3, 4], minutos: 25, metaSemana: 3, horario: '19:00' };

/** Núcleo novo com relógio falso e armazenamento em memória. perfil: null = fica no Primeiro uso. */
export function novo(dados, { dia = '2026-11-18', hora = '19:00', perfil = {}, storage = E.memoria() } = {}) {
  const rel = R.relogioFalso(`${dia}T${hora}`);
  R.setOffset(0);
  const n = new Nucleo({ pack: dados, storage });
  n.abrir();
  if (perfil !== null) n.concluirPrimeiroUso(Object.assign({}, PERFIL, perfil));
  return { n, rel, storage };
}
/** Outro núcleo lendo o mesmo armazenamento (simula recarregar a página). */
export function recarregar(n, storage) {
  const m = new Nucleo({ pack: n.pack, storage });
  m.abrir();
  return m;
}
export const passo = n => n.st.missao.passos[n.st.missao.i];
export const gabarito = (n, id) => n.pack.item(id).gabarito;
export const errada = (n, id, pref = 'E') => { const e = n.pack.item(id).alternativas.filter(a => !a.certa).map(a => a.letra); return e.includes(pref) ? pref : e[0]; };
/** Responde o passo atual: 'certa', 'errada' ou uma letra. */
export function responder(n, como = 'certa') {
  const p = passo(n);
  const alt = como === 'certa' ? gabarito(n, p.id) : como === 'errada' ? errada(n, p.id) : como;
  return n.despachar({ tipo: 'RESPONDER', alt });
}
/** CONTINUAR depois do intervalo deliberativo. */
export function continuar(n, rel) { rel.avancarMs(4000); return n.despachar('CONTINUAR'); }
/**
 * Joga a missão até o Encerramento (ou até `parar(n)` dar true).
 * decidir(passo, n) → 'certa' | 'errada' | letra (padrão: certa). Cards: 'lembrei'.
 */
export function jogar(n, rel, { decidir = () => 'certa', cards = () => 'lembrei', parar = () => false } = {}) {
  if (n.estado() === 'hoje') n.despachar('COMECAR');
  for (let g = 0; g < 500; g++) {
    if (parar(n)) return n.estado();
    const e = n.estado();
    if (e === 'pergunta') responder(n, decidir(passo(n), n));
    else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
    else if (e === 'feedback') continuar(n, rel);
    else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
    else if (e === 'trecho' || e === 'trechoCard') n.despachar('VOLTAR');
    else if (e === 'cards') {
      const mao = n.st.missao.mao;
      if (mao.pendente) n.despachar('SEGUIR');
      else if (!mao.virado) n.despachar('VIRAR');
      else n.despachar(cards(mao.fila[mao.i], n) === 'ainda' ? 'AINDA_NAO' : 'LEMBREI');
    } else return e;
  }
  throw new Error('jogar(): laço sem fim');
}
/** Avança o relógio para o dia d (19:00) e confere a data. */
export function irPara(n, rel, d, hora = '19:00') { rel.irPara(`${d}T${hora}`); n.conferirData(); }
/** Joga dias seguidos (só os dias de estudo), todos certos, até a data d (exclusiva). */
export function jogarAte(n, rel, ate, op = {}) {
  let d = n.st.missao.dia;
  while (d < ate) {
    if (n.st.missao.dia !== d) irPara(n, rel, d);
    const m = n.st.missao;
    if (m.passos.length && m.tipo !== 'folga' && m.tipo !== 'pausa' && !m.fechada) { jogar(n, rel, op); if (n.estado() === 'encerramento') n.despachar('FECHAR'); }
    d = R.addDias(d, 1);
    irPara(n, rel, d);
  }
}
/** Todas as strings de um objeto, para varreduras de texto. */
export function textos(o, fora = new Set(['verARegra', 'porqueEstado', 'lembranca'])) {
  const out = [];
  const vai = (x, k) => {
    if (fora.has(k)) return;
    if (typeof x === 'string') out.push(x);
    else if (Array.isArray(x)) x.forEach(y => vai(y));
    else if (x && typeof x === 'object') for (const [kk, v] of Object.entries(x)) vai(v, kk);
  };
  vai(o);
  return out;
}
