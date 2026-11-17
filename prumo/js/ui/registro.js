/* =========================================================
   PRUMO · registro de ações e folhas das telas
   Cada módulo de tela registra aqui as suas ações (data-acao="nome") e as
   suas folhas (data-folha="nome"). A casca (casca.js) faz a delegação de
   eventos e chama acoes[nome](ctx, elemento, evento) ou desenha folhas[nome].
   ========================================================= */
export const acoes = Object.create(null);
export const folhas = Object.create(null);

/**
 * Registra ações e folhas de um módulo.
 * acoes: { nome(ctx, el, evento) }
 * folhas: { nome(ctx, dados) → { rotulo, corpo, pe?, alta?, depois?(raiz) } }
 */
export function registrar({ acoes: a = {}, folhas: f = {} } = {}) {
  for (const [k, v] of Object.entries(a)) {
    if (acoes[k] && acoes[k] !== v) console.warn(`[prumo] ação "${k}" registrada de novo`);
    acoes[k] = v;
  }
  for (const [k, v] of Object.entries(f)) {
    if (folhas[k] && folhas[k] !== v) console.warn(`[prumo] folha "${k}" registrada de novo`);
    folhas[k] = v;
  }
}
