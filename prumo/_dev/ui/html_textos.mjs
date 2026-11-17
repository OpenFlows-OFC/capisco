// Confere quais campos de texto do pack trazem HTML (para a tela decidir entre escapar e inserir).
import { pack } from '../../conteudo/mat-fa.js';
import { Pack } from '../../js/nucleo/pack.js';
const P = new Pack(pack);
const tem = s => typeof s === 'string' && /<[a-z]/i.test(s);
const conta = {};
const marca = (k, s) => { if (tem(s)) conta[k] = (conta[k] || 0) + 1; };
for (const q of pack.questoes) { const it = P.item(q.id); marca('explicacao', it.explicacao); marca('introducao', it.introducao); it.alternativas.forEach(a => { marca('alt.texto', a.texto); marca('alt.falta', a.falta); }); }
for (const m of pack.modelos) for (let k = 0; k < (m.linhas || []).length; k++) { const it = P.item(`${m.id}#${k}`); if (!it) continue; marca('m.explicacao', it.explicacao); it.alternativas.forEach(a => { marca('m.alt.texto', a.texto); marca('m.alt.falta', a.falta); }); }
for (const c of pack.capitulos) for (const k of c.cards || []) { marca('card.frente', k.frente); marca('card.verso', k.verso); }
console.log(conta);
const ex = pack.questoes.map(q => P.item(q.id)).flatMap(it => it.alternativas.filter(a => tem(a.texto)).map(a => it.id + ' ' + a.letra + ' ' + a.texto.slice(0, 120)));
console.log(ex.slice(0, 6));
