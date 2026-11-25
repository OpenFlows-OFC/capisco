/* =========================================================
   PRUMO · fases da trilha fora da aba Estudar
   - Hoje: a fase atual de cada área escolhida (bolha + título + pontinhos das fases), leva à trilha.
   - Pronto por hoje: "Passou de fase!", comparando a trilha de agora com a foto tirada em Hoje
     (antes da missão). A foto é só da tela (localStorage); a regra das fases vem do núcleo (trilha()).
   ========================================================= */
import { h, cada } from './dom.js';

const CHAVE = 'prumo-ui-trilha-foto', MEMO = 'prumo-ui-trilha-passou';
const ler = (arm, k) => { try { return JSON.parse(arm.getItem(k) || 'null'); } catch (e) { return null; } };
const gravar = (arm, k, v) => { try { arm.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: sem aviso de fase */ } };
const armL = () => { try { return localStorage; } catch (e) { return null; } };
const armS = () => { try { return sessionStorage; } catch (e) { return null; } };

function trilhaSegura(n) { try { return n.trilha(); } catch (e) { return null; } }
function foto(t) {
  const f = {};
  for (const a of t.areas) for (const x of a.fases) f[x.id] = x.estado;
  return f;
}

/** Guarda a foto da trilha (chamada em Hoje, antes de começar a missão). */
export function guardarFoto(n) {
  const t = trilhaSegura(n), L = armL();
  if (t && L) gravar(L, CHAVE, foto(t));
}

/** Frases de "Passou de fase!" para o Pronto por hoje (a mesma lista se a tela redesenhar). */
export function passouDeFase(n) {
  const t = trilhaSegura(n), L = armL(), S = armS();
  if (!t || !L) return [];
  const agora = foto(t), chave = JSON.stringify(agora);
  const memo = S && ler(S, MEMO);
  if (memo && memo.foto === chave) return memo.lista;
  const antes = ler(L, CHAVE);
  const lista = [];
  if (antes) {
    for (const a of t.areas) for (const x of a.fases) {
      const era = antes[x.id];
      if (!era || era === x.estado) continue;
      const nome = x.tipo === 'chefe' ? `Chefão vencido: ${x.titulo}. O troféu é seu.` : null;
      if (x.estado === 'concluida') lista.push(nome || `Fase ${x.n} concluída: ${x.titulo} entrou no ${x.nivel.rotulo}.`);
      else if (era === 'bloqueada' && x.estado === 'liberada') lista.push(x.tipo === 'chefe' ? `Chefão liberado: ${x.titulo}.` : `Fase ${x.n} liberada: ${x.titulo}.`);
    }
  }
  if (S) gravar(S, MEMO, { foto: chave, lista });
  gravar(L, CHAVE, agora);
  return lista;
}

/** Bloco "Passou de fase!" do Pronto por hoje. */
export function blocoPassou(lista) {
  if (!lista || !lista.length) return '';
  return h`<section class="passou-fase" aria-labelledby="passou-t">
    <h2 id="passou-t">Passou de fase!</h2>
    <ul>${cada(lista, x => h`<li>${x}</li>`)}</ul>
    <p class="pequeno texto-2" style="margin:0">A trilha fica na aba Estudar.</p>
  </section>`;
}

/** Hoje: a fase atual de cada área escolhida. */
export function blocoHojeTrilha(n) {
  const t = trilhaSegura(n);
  if (!t) return '';
  const areas = t.areas.filter(a => a.escolhida);
  if (!areas.length) return '';
  return h`<section class="hoje-trilha" aria-labelledby="hoje-trilha-t">
    <h2 class="titulo-pequeno" id="hoje-trilha-t">Sua trilha</h2>
    ${cada(areas, a => {
      const cont = a.fases.filter(f => f.tipo !== 'chefe');
      const at = a.atual;
      return h`<a class="hoje-trilha-linha ${at ? 'fase-atual' : 'fase-concluida'}" href="#/estudar">
        <span class="fase-no" aria-hidden="true">${at ? at.n : '✓'}</span>
        <span class="fase-rotulo">
          <span class="fase-num">${a.nome} · ${at ? `fase ${at.n} de ${a.total}` : 'trilha completa'}</span>
          <span class="fase-titulo">${at ? at.titulo : `${a.total} de ${a.total} fases`}</span>
          <span class="hoje-trilha-pontos" aria-hidden="true">${cada(cont, f => h`<i class="${f.estado === 'concluida' ? 'feita' : at && f.id === at.id ? 'agora' : ''}"></i>`)}</span>
        </span>
      </a>`;
    })}
  </section>`;
}
