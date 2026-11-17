/* g.8 · varredura de textos: nenhuma tela com "perdeu", contagem de minutos, contagem parcial da semana,
   percentual de lembrança fora de "ver a regra" ou outro rótulo de constância que não "dias estudados". */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../js/nucleo/relogio.js';
import * as E from '../../js/nucleo/estado.js';
import { Nucleo } from '../../js/nucleo/nucleo.js';
import { gerarExemplo } from '../../js/nucleo/exemplo.js';
import { Pack } from '../../js/nucleo/pack.js';
import { packs, textos, continuar } from './ajuda.mjs';

const PROIBIDO = [/perdeu/i, /\bperder\b/i, /restam?\s+\d/i, /\bDia \d+\b/, /Semana: \d+ de \d+/, /maior período/i, /sequência de \d+/i, /\bXP\b/, /\bmoedas?\b/i, /\branking\b/i, /vermelh/i, /minutos? (hoje|estudados)/i, /só mais uma/i, /\bbaú/i];
// campos de UI (não de conteúdo do caderno) onde nenhum percentual pode aparecer
const CAMPOS_UI = new Set(['texto', 'faixa', 'titulo', 'rotulo', 'linhaFina', 'composicao', 'atrasada', 'ganho', 'estado', 'regra', 'parcial', 'vazio', 'previa', 'gancho', 'situacao', 'linha', 'frase', 'semanaPassada', 'linhaMeta', 'proximaTexto', 'caixaNome', 'posicao', 'naoContou']);

function varrer(o, onde) {
  for (const s of textos(o)) for (const re of PROIBIDO) assert.ok(!re.test(s), `${onde}: "${s}" casa ${re}`);
  const vai = (x, k) => {
    if (k === 'verARegra' || k === 'item' || k === 'blocos' || k === 'alternativas' || k === 'questao') return;
    if (typeof x === 'string') { if (CAMPOS_UI.has(k)) assert.ok(!/%/.test(x), `${onde}.${k}: percentual fora de "ver a regra": "${x}"`); }
    else if (Array.isArray(x)) x.forEach(y => vai(y, k));
    else if (x && typeof x === 'object') for (const [kk, v] of Object.entries(x)) vai(v, kk);
  };
  vai(o, '');
}

for (const pk of await packs()) {
  test(`[${pk.nome}] g.8 · varredura de todas as telas do estado de exemplo e de uma semana jogada`, () => {
    const T = '2026-11-18';
    R.definirFonte(`${T}T08:00`);
    const st = gerarExemplo(new Pack(pk.dados), T);
    const rel = R.relogioFalso(`${T}T19:00`);
    const n = new Nucleo({ pack: pk.dados, storage: E.memoria({ prumo: JSON.stringify(st) }) });
    n.abrir();
    const telas = () => {
      varrer(n.tela(), n.estado());
      for (const [nome, f] of [['sumario', () => n.sumario()], ['erros', () => n.erros()], ['notas', () => n.notas()], ['cards', () => n.cardsDoCaderno()], ['plano', () => n.plano()], ['ajustes', () => n.ajustes()], ['hoje', () => n.hoje()]]) varrer(f(), nome);
    };
    for (let dia = 0; dia < 7; dia++) {
      telas();
      const m = n.st.missao;
      if (m.passos.length && m.tipo !== 'folga' && m.tipo !== 'pausa') {
        n.despachar('COMECAR');
        for (let g = 0; g < 200; g++) {
          const e = n.estado();
          telas();
          if (e === 'pergunta') { const p = m && n.st.missao.passos[n.st.missao.i]; const it = n.pack.item(p.id); n.despachar({ tipo: 'RESPONDER', alt: g % 3 === 0 ? it.alternativas.find(a => !a.certa).letra : it.gabarito }); }
          else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
          else if (e === 'feedback') { if (g % 4 === 0) { n.despachar('VOLTAR_AO_TRECHO'); telas(); n.despachar('VOLTAR'); } continuar(n, rel); }
          else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
          else if (e === 'cards') { const mao = n.st.missao.mao; n.despachar(mao.pendente ? 'SEGUIR' : !mao.virado ? 'VIRAR' : g % 2 ? 'LEMBREI' : 'AINDA_NAO'); }
          else if (e === 'trechoCard') n.despachar('VOLTAR');
          else if (e === 'encerramento') { n.despachar('FECHAR'); break; }
          else break;
        }
      }
      telas();
      rel.irPara(`${R.addDias(n.st.missao.dia, 1)}T19:00`);
      n.conferirData();
    }
    for (const s of textos(n.creditos())) for (const re of PROIBIDO) assert.ok(!re.test(s), `créditos: "${s}" casa ${re}`);   // créditos citam o conteúdo (ex.: "30%")
  });
}
