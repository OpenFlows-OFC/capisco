// Exploração do estado de exemplo (fora do app): imprime Hoje e os passos da missão de exemplo.
import { novo, passo, gabarito } from '../testes/ajuda.mjs';
import { pack } from '../../conteudo/mat-fa.js';
const dia = process.argv[2] || '2026-11-17';
const { n, rel } = novo(pack, { dia, hora: '19:00', perfil: null });
const t = n.carregarExemplo();
const cut = (o) => JSON.stringify(o, (k, v) => (k === 'enunciado' || k === 'html' || k === 'miniRegua' || k === 'regua' || k === 'semanas') ? '[..]' : v);
console.log(t.nome, cut(t.faixas));
console.log(cut(t.vm).slice(0, 3000));
n.despachar('COMECAR');
for (let g = 0; g < 30; g++) {
  const e = n.estado(); if (e === 'encerramento') { console.log('FIM', cut(n.tela().vm).slice(0, 1500)); break; }
  const vm = n.tela().vm;
  if (e === 'pergunta') { const p = passo(n); console.log('PERG', vm.rotulo, vm.subrotulo, p.id); n.despachar({ tipo: 'RESPONDER', alt: gabarito(n, p.id) }); const f = n.tela().vm; console.log('  FB', f.titulo, cut(f.revisao), f.fimRodada && f.fimRodada.texto); rel.avancarMs(4000); n.despachar('CONTINUAR'); }
  else if (e === 'leitura') n.despachar('TERMINEI_TRECHO');
  else if (e === 'cards') { console.log('CARD', vm.posicao, vm.frente, '|', vm.caixa.nome); if (!vm.virado) n.despachar('VIRAR'); else n.despachar('LEMBREI'); }
  else if (e === 'fimDaRodada' || e === 'fimDaMao') { console.log(e, cut(vm).slice(0, 400)); n.despachar('SEGUIR'); }
  else { console.log('??', e); break; }
}
