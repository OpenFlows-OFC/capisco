/* =========================================================
   PRUMO · retorno sonoro fiel (d.12), sintetizado com Web Audio
   Desligado por padrão. O feedback nunca depende do som.
   Acerto: 2 notas curtas (660 e 880 Hz, ~200 ms). Erro: 1 nota grave e suave
   (220 Hz, 80 ms), sem buzina. Nível que sobe: 3 notas ascendentes.
   Marco: acorde de 600 ms. Troféu: acorde e uma nota alta.
   Nível que desce: silêncio (o núcleo manda som: null).
   No iPhone, o AudioContext nasce e é retomado no toque, e o tipo de sessão
   vira 'playback' onde existir ('ambient' fica mudo com a chave silenciosa).
   ========================================================= */
let ac = null;

/** Prepara o áudio dentro de um gesto do aluno (toque ou clique). */
export function preparar() {
  try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) { /* sem audioSession */ }
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    ac = ac || new C();
    if (ac.state === 'suspended') ac.resume();
  } catch (e) { ac = null; }
}

// [frequência, início (s), duração (s), ganho]
const SONS = {
  acerto: [[660, 0, 0.09, 0.12], [880, 0.1, 0.11, 0.12]],
  erro: [[220, 0, 0.08, 0.09]],
  nivel: [[523.25, 0, 0.12, 0.12], [659.25, 0.13, 0.12, 0.12], [783.99, 0.26, 0.2, 0.12]],
  marco: [[523.25, 0, 0.6, 0.07], [659.25, 0, 0.6, 0.07], [783.99, 0, 0.6, 0.07]],
  trofeu: [[523.25, 0, 0.6, 0.07], [659.25, 0, 0.6, 0.07], [783.99, 0, 0.6, 0.07], [1046.5, 0.45, 0.4, 0.09]],
};

/** Toca um som pelo nome, se ele existir. Quem chama confere se o som está ligado. */
export function tocar(nome) {
  const notas = SONS[nome];
  if (!notas) return;
  if (!ac) preparar();
  if (!ac) return;
  try {
    if (ac.state === 'suspended') ac.resume();
    const t0 = ac.currentTime + 0.02;
    for (const [f, ini, dur, g] of notas) {
      const o = ac.createOscillator(), a = ac.createGain();
      o.type = nome === 'erro' ? 'sine' : 'triangle';
      o.frequency.value = f;
      a.gain.setValueAtTime(0.0001, t0 + ini);
      a.gain.exponentialRampToValueAtTime(g, t0 + ini + 0.012);
      a.gain.exponentialRampToValueAtTime(0.0001, t0 + ini + dur);
      o.connect(a).connect(ac.destination);
      o.start(t0 + ini);
      o.stop(t0 + ini + dur + 0.03);
    }
  } catch (e) { /* sem som: o retorno visual basta */ }
}
