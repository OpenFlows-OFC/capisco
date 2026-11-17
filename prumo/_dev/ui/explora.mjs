// Exploração dos view models (fora do app): percorre o roteiro g.7 no Node e imprime as telas.
import { novo, passo, gabarito } from '../testes/ajuda.mjs';
import { pack } from '../../conteudo/mat-fa.js';
const { n, rel } = novo(pack, { dia: '2026-11-17', hora: '19:00' });
const show = (lbl) => { const t = n.tela(); console.log('\n==', lbl, t.nome, JSON.stringify(t.vm, (k, v) => (k === 'enunciado' || k === 'html' || k === 'miniRegua' || k === 'regua') ? (typeof v === 'string' ? v.slice(0, 60) : '[..]') : v).slice(0, 2500)); };
show('hoje');
n.despachar('COMECAR');
for (let g = 0; g < 40; g++) {
  const e = n.estado();
  if (e === 'encerramento') { show('fim'); break; }
  const p = passo(n);
  show(`passo ${n.st.missao.i} ${p.t} ${p.id || ''}`);
  if (e === 'pergunta') {
    const alt = p.id === 'enem-2023-162' ? 'E' : gabarito(n, p.id);
    n.despachar({ tipo: 'RESPONDER', alt });
    if (n.estado() === 'feedback') { show('feedback'); rel.avancarMs(4000); n.despachar('CONTINUAR'); }
  } else if (e === 'leitura') { n.despachar(p.pagina === 'mat-fa.p2' && n.st.missao.passos[n.st.missao.i-1].t==='pre' && n.st.missao.passos[n.st.missao.i-1].alvo==='nucleo' ? 'JA_SEI' : 'TERMINEI_TRECHO'); }
  else if (e === 'fimDaRodada' || e === 'fimDaMao') n.despachar('SEGUIR');
  else break;
}
n.despachar('FECHAR'); show('feito');
