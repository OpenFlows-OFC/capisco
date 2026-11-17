// Confere os Caps. 3 e 4 contra o núcleo do app: Pack.checar() de js/nucleo/pack.js e as variantes
// geradas por Pack.variante() e por materializar() de conteudo/gerador.js, que têm de bater, letra por
// letra, com o "pronto" gravado pelo build. Uso: node prumo/_dev/c34_compat.mjs
import { capitulos34, modelos34, questoes34 } from '../conteudo/mat-fa-c34.js';
import { Pack } from '../js/nucleo/pack.js';
import { materializar } from '../conteudo/gerador.js';

const pack = new Pack({
  id: 'mat-fa', versao: 'teste-c34', materia: 'mat', titulo: 'Funções afins', licencaPadrao: 'CC BY-SA 4.0',
  avisoColetanea: 'teste', capitulos: capitulos34, modelos: modelos34, questoes: questoes34,
});
const r = pack.checar();
// Os Caps. 1 e 2 não estão neste pack de teste: os pré-requisitos deles ficam de fora da contagem.
const erros = r.erros.filter(e => !/pré-requisito desconhecido mat-fa\.c[12]/.test(e));
let falhas = 0;
for (const e of erros) { console.log('ERRO  ' + e); falhas++; }
for (const a of r.avisos) console.log('aviso ' + a);

const assinatura = alts => alts.map(a => `${a.letra}:${a.texto}${a.certa ? '*' : ''}`).join(' ');
for (const m of modelos34) {
  let gerados = null;
  try { gerados = materializar(m); } catch (err) { console.log(`ERRO  gerador.js ${m.id}: ${err.message}`); falhas++; }
  m.linhas.forEach((l, k) => {
    const v = pack.variante(m.id, k), p = l.pronto;
    if (assinatura(v.alternativas) !== assinatura(p.alternativas)) { console.log(`ERRO  ${m.id}#${k} pack.js: ${assinatura(v.alternativas)} × pronto: ${assinatura(p.alternativas)}`); falhas++; }
    if (v.enunciado !== p.enunciado) { console.log(`ERRO  ${m.id}#${k}: enunciado difere`); falhas++; }
    if (v.explicacao !== p.explicacao) { console.log(`ERRO  ${m.id}#${k}: explicação difere\n  pack.js: ${v.explicacao}\n  pronto:  ${p.explicacao}`); falhas++; }
    v.alternativas.forEach((a, i) => { if ((a.falta || null) !== (p.alternativas[i].falta || null)) { console.log(`ERRO  ${m.id}#${k} ${a.letra}: "o que faltou" difere`); falhas++; } });
    if (gerados) {
      const g = gerados[k];
      if (assinatura(g.alternativas) !== assinatura(p.alternativas)) { console.log(`ERRO  ${m.id}#${k} gerador.js: ${assinatura(g.alternativas)}`); falhas++; }
    }
  });
}
// Itens da rodada e o índice do motor (a questão da equipe do Cap. 4 entra no papel de aplicar).
for (const c of capitulos34) for (const id of c.rodada) { try { pack.item(id); } catch (err) { console.log('ERRO  ' + err.message); falhas++; } }
const idx = pack.indiceMotor();
for (const c of capitulos34) console.log(`${c.id}: itens do motor = ${idx.topicos[c.id].itens.map(i => `${i.id}(${i.nivel})`).join(', ')}`);
const pos = modelos34.map(m => `${m.id}: ${m.linhas.map(l => l.pronto.gabarito).join(' ')}`);
console.log('letra da certa por linha:\n  ' + pos.join('\n  '));
console.log(falhas ? `${falhas} falha(s).` : 'ok: Pack.checar() sem erros nos Caps. 3 e 4; variantes de pack.js e gerador.js iguais ao "pronto".');
process.exit(falhas ? 1 : 0);
