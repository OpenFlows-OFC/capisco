/* =========================================================
   PRUMO · Pack de teste mínimo (fixture do núcleo)
   Segue o esquema e.2 da especificação, com o acréscimo de cards por
   capítulo (Decisão 1 do dono). Os textos das questões, exceto a 2019 Q168
   (citada em e.3), são TEXTOS DE TESTE: não são do INEP. Servem só para
   exercitar as regras do núcleo.
   ========================================================= */

const AUT = { ia: 'Claude Opus 5.5 (Anthropic), via Claude Code, fixture de teste em 17/11/2026', equipe: null, revisor: null, revisadoEm: null };
const CRED = { fonte: 'Equipe Prumo', licenca: 'CC BY-SA 4.0', autoria: AUT };
const LIC_ENEM = 'CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)';
const URL_ENEM = 'https://creativecommons.org/licenses/by-nd/3.0/legalcode';

const par = (id, html) => ({ id, html });
const bloco = (id, paragrafos, extra = {}) => Object.assign({ id, paragrafos }, extra);

function modeloPagina(id, pagina, enunciado, certa, erros, linhas, extra = {}) {
  return Object.assign({ id, tipo: 'pagina', pagina, enunciado, certa, erros, linhas, licenca: 'CC BY-SA 4.0', credito: CRED }, extra);
}
function modeloBloco(id, pagina, blocoId, enunciado, certa, erros, linhas, extra = {}) {
  return Object.assign({ id, tipo: 'bloco', pagina, bloco: blocoId, enunciado, certa, erros, linhas, licenca: 'CC BY-SA 4.0', credito: CRED }, extra);
}
function questao(id, { b, gabarito, contexto, introducao, alternativas, blocos, modelo, habilidade = 'MT-H19', explicacao = 'Explicação de teste.', imagens = [] }) {
  const [, ano, numero] = /^enem-(\d{4})-(\d{1,3})$/.exec(id);
  return {
    id, ano: +ano, dia: 2, caderno: 'Azul', numero: +numero, area: 'MT', habilidade,
    inep: { coItem: 1000 + +numero, coProva: 500, a: 2, b, c: 0.1 },
    gabarito, gabaritoConferido: true, textoConferidoPDF: null, anulada: false,
    contexto, introducao, fonteMd: contexto, materialDeTerceiros: null,
    alternativas, imagens,
    atribuicao: `Enem ${ano}, 2º dia, Caderno Azul, questão ${+numero}. © INEP/MEC, licença CC BY-ND 3.0. Transcrição: projeto enem.dev (em conferência).`,
    licenca: LIC_ENEM, licencaUrl: URL_ENEM, blocos, modelo, explicacao, autoria: AUT, papel: 'rodada',
  };
}
/** Alternativas numéricas com "o que faltou" e parágrafo nas erradas. */
function altsNum(valores, certa, faltas, paragrafo) {
  return ['A', 'B', 'C', 'D', 'E'].map((L, i) => L === certa
    ? { letra: L, texto: valores[i] }
    : { letra: L, texto: valores[i], falta: faltas[i] || 'Falta de teste.', paragrafo });
}
const card = (id, frente, verso, blocoId, tipo = 'conceito') => ({ id, frente, verso, bloco: blocoId, tipo, autoria: AUT });

/* ---------------- linhas de números ---------------- */
const L_TAXI = [[5, 2], [4, 3], [6, 2], [7, 3], [5, 4], [8, 3], [6, 5], [9, 2], [4, 5], [7, 4], [10, 3]].map(([F, v]) => ({ F, v }));
const L_VAN = [
  { quem: 'a motorista', F: 900, d: 3, v: 70 }, { quem: 'o motorista', F: 1200, d: 2, v: 90 },
  { quem: 'a guia', F: 800, d: 2, v: 60 }, { quem: 'o guia', F: 700, d: 3, v: 50 }, { quem: 'a monitora', F: 600, d: 4, v: 40 },
  { quem: 'o monitor', F: 950, d: 2, v: 75 }, { quem: 'a fotógrafa', F: 500, d: 3, v: 45 }, { quem: 'o fotógrafo', F: 650, d: 2, v: 85 },
  { quem: 'a cozinheira', F: 1100, d: 3, v: 55 }, { quem: 'o cozinheiro', F: 1000, d: 4, v: 35 }, { quem: 'a enfermeira', F: 1300, d: 2, v: 65 },
];
const L_POLPA = [{ p: 30, V: 12 }, { p: 20, V: 15 }];
const L_PARADO = [[3, 8], [2, 7], [4, 11], [3, 10], [5, 12], [2, 9], [4, 13], [3, 11], [6, 14], [5, 13], [2, 6]].map(([ini, fim]) => ({ ini, fim }));
const L_ACIMA = [[4, 2], [5, 3], [6, 2], [5, 2], [7, 3], [6, 4], [4, 3], [7, 2], [8, 3], [6, 3], [5, 4]].map(([a, b]) => ({ a, b }));
const L_CURVAS = [{ n: 3, s: 6, c: 1 }, { n: 2, s: 5, c: 4 }];
const L_TAXA = [[2, 10, 4], [3, 15, 6], [2, 14, 8], [4, 20, 9], [3, 12, 5], [5, 25, 7], [2, 18, 4], [4, 16, 7], [3, 21, 9], [6, 30, 8], [2, 12, 7]].map(([x, y, k]) => ({ x, y, k }));
const L_RAZAO = [[6, 2], [9, 3], [8, 4], [12, 3], [10, 5], [15, 3], [14, 7], [16, 4], [18, 6], [20, 5], [21, 7]].map(([d, t]) => ({ d, t }));
const L_SIS = [[10, 4], [12, 5], [14, 6], [9, 2], [11, 3], [16, 7], [13, 4], [15, 4], [17, 5], [18, 7], [20, 6]].map(([s, df]) => ({ s, df }));
/** Linhas do modelo de empate: a − b ≥ 2 e as cinco respostas distintas (gerado sem sorteio). */
const L_DUAS = (() => {
  const out = [];
  for (const [a, b] of [[5, 3], [6, 3], [7, 4], [6, 2], [8, 5], [7, 3], [9, 5], [8, 4], [9, 6], [10, 6], [11, 7], [10, 5]])
    for (const t1 of [12, 15, 18]) {
      const t2 = t1 + 4 * (a - b) + 2 * (a - b), r = (t2 - t1) / (a - b);
      const v = [r, (t2 + t1) / (a - b), (t2 - t1) / (a + b), t2 - t1, r + 1].map(x => Math.round(x * 100) / 100);
      if (new Set(v).size === 5 && !out.some(l => l.a === a && l.b === b)) { out.push({ a, b, t1, t2 }); break; }
    }
  return out.slice(0, 11);
})();

export const pack = {
  id: 'mat-fa', versao: '0.0.1-fixture', materia: 'mat', titulo: 'Funções afins',
  licencaPadrao: 'CC BY-SA 4.0',
  nivelMaximoDemo: 3,   // como o pack real: o estado de exemplo vai até o nível 3 de 5
  avisoColetanea: 'Este pack é uma coletânea. O texto, os modelos e as explicações da equipe Prumo estão em CC BY-SA 4.0. Cada questão do Enem mantém a licença indicada nela e não é relicenciada pela licença do pack.',
  creditos: [{ fonte: 'Fixture de teste do núcleo', licenca: 'CC BY-SA 4.0', autoria: AUT }],
  chefao: { trofeu: 'Funções afins', selo: 'mat', regra: '4 acertos seguidos, um de cada capítulo' },
  capitulos: [
    {
      id: 'mat-fa.c1', n: 1, titulo: 'Parte fixa e parte que varia', habilidades: ['MT-H19'], prereq: [],
      paginas: [
        { id: 'mat-fa.p1', n: 1, titulo: 'Um preço com duas partes', modelo: 'mat-fa.p1.m', nucleo: 'mat-fa.p1.b1',
          notaPrompt: 'Com suas palavras: por que a bandeirada não multiplica pelos km?',
          blocos: [
            bloco('mat-fa.p1.b1', [par('mat-fa.p1.b1.s1', 'A bandeirada se paga uma vez só, ao entrar no táxi.'), par('mat-fa.p1.b1.s2', 'O preço por quilômetro multiplica a distância percorrida.')]),
            bloco('mat-fa.p1.b2', [par('mat-fa.p1.b2.s3', 'Tabela de 0 a 4 km com os preços de uma corrida.')]),
          ] },
        { id: 'mat-fa.p2', n: 2, titulo: 'Da frase para a fórmula', modelo: 'mat-fa.p2.m', nucleo: 'mat-fa.p2.b1',
          notaPrompt: 'Quem fica fora da contagem por dia, e por quê?',
          blocos: [
            bloco('mat-fa.p2.b1', [par('mat-fa.p2.b1.s1', 'Em y = ax + b, a é a taxa por unidade e b é o valor quando x = 0.'), par('mat-fa.p2.b1.s2', 'Palavras-pista: fixo, taxa de, por, a cada.'), par('mat-fa.p2.b1.s3', 'Quem entra na contagem: às vezes são x − 1, e não x.')]),
            bloco('mat-fa.p2.b2', [par('mat-fa.p2.b2.s4', 'Percentual sobre uma parte: 30% de V é 0,3 V.')], { prePergunta: 'mat-fa.p2.b2.m' }),
          ] },
      ],
      rodada: ['enem-2023-162', 'enem-2023-150', 'enem-2019-168'], reserva: ['enem-2021-141'],
      irAlem: [{ tipo: 'khan', rotulo: 'A mesma matéria no curso da Khan que a sua escola usa', url: 'https://pt.khanacademy.org/', aviso: 'Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org.' }],
      cards: [
        card('mat-fa.c1.k1', 'O que é a parte fixa de um preço?', 'O valor pago uma vez só, que não depende da quantidade.', 'mat-fa.p1.b1'),
        card('mat-fa.c1.k2', 'Em y = ax + b, o que é a?', 'A taxa por unidade: quanto y muda quando x aumenta 1.', 'mat-fa.p2.b1'),
        card('mat-fa.c1.k3', 'Palavra-pista "a cada" indica qual parte?', 'A parte que varia: ela multiplica a quantidade.', 'mat-fa.p2.b1', 'palavra-pista'),
        card('mat-fa.c1.k4', 'Como montar a fórmula de um preço com duas partes?', 'Multiplique a taxa pela quantidade e some a parte fixa uma vez.', 'mat-fa.p1.b1', 'procedimento'),
        card('mat-fa.c1.k5', 'Armadilha: um dos X tem valor fixo.', 'Ele sai da conta por unidade: os outros são X − 1.', 'mat-fa.p2.b1', 'armadilha comum'),
        card('mat-fa.c1.k6', 'Quanto é 30% de V?', '0,3 × V.', 'mat-fa.p2.b2'),
      ],
    },
    {
      id: 'mat-fa.c2', n: 2, titulo: 'Ler o gráfico', habilidades: ['MT-H20'], prereq: [],
      paginas: [
        { id: 'mat-fa.p3', n: 3, titulo: 'O que cada ponto diz', modelo: 'mat-fa.p3.m', nucleo: 'mat-fa.p3.b2',
          blocos: [
            bloco('mat-fa.p3.b1', [par('mat-fa.p3.b1.s1', 'Eixos e unidades.'), par('mat-fa.p3.b1.s2', 'Ler um ponto do gráfico.')]),
            bloco('mat-fa.p3.b2', [par('mat-fa.p3.b2.s3', 'Duração de um trecho = fim − começo, inclusive no trecho horizontal.')]),
          ] },
        { id: 'mat-fa.p4', n: 4, titulo: 'Acima de, abaixo de', modelo: 'mat-fa.p4.m', nucleo: 'mat-fa.p4.b1',
          blocos: [
            bloco('mat-fa.p4.b1', [par('mat-fa.p4.b1.s1', 'A linha de referência separa acima e abaixo.'), par('mat-fa.p4.b1.s2', 'Some os intervalos separados.')]),
            bloco('mat-fa.p4.b2', [par('mat-fa.p4.b2.s3', 'Compare duas curvas instante a instante.')], { prePergunta: 'mat-fa.p4.b2.m' }),
          ] },
      ],
      rodada: ['enem-2023-156', 'enem-2020-164', 'enem-2023-151'], reserva: [],
      cards: [
        card('mat-fa.c2.k1', 'Como medir a duração de um trecho?', 'Fim menos começo, lidos no eixo do tempo.', 'mat-fa.p3.b2', 'procedimento'),
        card('mat-fa.c2.k2', 'Trecho horizontal significa o quê?', 'A grandeza ficou parada nesse intervalo.', 'mat-fa.p3.b2'),
        card('mat-fa.c2.k3', 'Para que serve a linha de referência?', 'Para separar os instantes acima e abaixo de um valor.', 'mat-fa.p4.b1'),
        card('mat-fa.c2.k4', 'Armadilha: contar pontos em vez de medir.', 'Duração é fim − começo, não o número de pontos marcados.', 'mat-fa.p3.b2', 'armadilha comum'),
        card('mat-fa.c2.k5', 'Intervalos separados acima da linha:', 'Some todos eles, não só o maior.', 'mat-fa.p4.b1'),
        card('mat-fa.c2.k6', 'Comparar duas curvas:', 'Olhe instante a instante qual está mais alta.', 'mat-fa.p4.b2'),
      ],
    },
    {
      id: 'mat-fa.c3', n: 3, titulo: 'Taxa de variação', habilidades: ['MT-H20'], prereq: ['mat-fa.c1', 'mat-fa.c2'],
      paginas: [
        { id: 'mat-fa.p5', n: 5, titulo: 'Quanto muda por unidade', modelo: 'mat-fa.p5.m', nucleo: 'mat-fa.p5.b1',
          blocos: [
            bloco('mat-fa.p5.b1', [par('mat-fa.p5.b1.s1', 'Taxa = variação de y dividida pela variação de x.'), par('mat-fa.p5.b1.s2', 'A taxa é a mesma em qualquer trecho de uma reta.')]),
            bloco('mat-fa.p5.b2', [par('mat-fa.p5.b2.s3', 'Exemplo com uma torneira.')]),
          ] },
        { id: 'mat-fa.p6', n: 6, titulo: 'Taxa no gráfico', modelo: 'mat-fa.p6.m', nucleo: 'mat-fa.p6.b1',
          blocos: [
            bloco('mat-fa.p6.b1', [par('mat-fa.p6.b1.s1', 'Inclinação da reta e taxa são a mesma coisa.'), par('mat-fa.p6.b1.s2', 'Distância dividida pelo tempo dá a velocidade média.')]),
          ] },
      ],
      rodada: ['enem-2019-143', 'enem-2020-175', 'enem-2019-179'], reserva: [],
      cards: [
        card('mat-fa.c3.k1', 'O que é taxa de variação?', 'Quanto y muda para cada unidade de x.', 'mat-fa.p5.b1'),
        card('mat-fa.c3.k2', 'Como calcular a taxa entre dois pontos?', 'Divida a variação de y pela variação de x.', 'mat-fa.p5.b1', 'procedimento'),
        card('mat-fa.c3.k3', 'Inclinação da reta é o quê?', 'A taxa de variação da função afim.', 'mat-fa.p6.b1'),
        card('mat-fa.c3.k4', 'Armadilha: dividir y por x direto.', 'A taxa usa as variações, não os valores.', 'mat-fa.p5.b1', 'armadilha comum'),
        card('mat-fa.c3.k5', 'Velocidade média:', 'Distância percorrida dividida pelo tempo gasto.', 'mat-fa.p6.b1'),
        card('mat-fa.c3.k6', 'Palavra-pista "por hora" indica:', 'Uma taxa: algo dividido pelo tempo.', 'mat-fa.p6.b1', 'palavra-pista'),
      ],
    },
    {
      id: 'mat-fa.c4', n: 4, titulo: 'Duas condições, um sistema', habilidades: ['MT-H21', 'MT-H22'], prereq: ['mat-fa.c1'],
      paginas: [
        { id: 'mat-fa.p7', n: 7, titulo: 'Duas pistas, dois números', modelo: 'mat-fa.p7.m', nucleo: 'mat-fa.p7.b1',
          blocos: [
            bloco('mat-fa.p7.b1', [par('mat-fa.p7.b1.s1', 'Soma e diferença de dois números.'), par('mat-fa.p7.b1.s2', 'Some as duas equações para achar o maior.')]),
          ] },
        { id: 'mat-fa.p8', n: 8, titulo: 'Quando dois planos empatam', modelo: 'mat-fa.p8.m', nucleo: 'mat-fa.p8.b1',
          blocos: [
            bloco('mat-fa.p8.b1', [par('mat-fa.p8.b1.s1', 'Dois planos empatam quando as fórmulas dão o mesmo valor.'), par('mat-fa.p8.b1.s2', 'Iguale as fórmulas e resolva.')]),
          ] },
      ],
      rodada: ['enem-2021-164', 'enem-2023-175', 'mat-fa.p8.m#7'], reserva: [],
      cards: [
        card('mat-fa.c4.k1', 'O que é um sistema de duas equações?', 'Duas condições que os mesmos números cumprem juntos.', 'mat-fa.p7.b1'),
        card('mat-fa.c4.k2', 'Soma S e diferença D: o maior é?', '(S + D) dividido por 2.', 'mat-fa.p7.b1', 'procedimento'),
        card('mat-fa.c4.k3', 'Quando dois planos empatam?', 'Quando as duas fórmulas dão o mesmo valor.', 'mat-fa.p8.b1'),
        card('mat-fa.c4.k4', 'Como achar o ponto de empate?', 'Iguale as fórmulas e isole x.', 'mat-fa.p8.b1', 'procedimento'),
        card('mat-fa.c4.k5', 'Armadilha: usar só uma das condições.', 'Cada condição vira uma equação; as duas valem juntas.', 'mat-fa.p7.b1', 'armadilha comum'),
        card('mat-fa.c4.k6', 'Palavra-pista "ao mesmo tempo" indica:', 'Que as condições formam um sistema.', 'mat-fa.p7.b1', 'palavra-pista'),
      ],
    },
  ],
  modelos: [
    modeloPagina('mat-fa.p1.m', 'mat-fa.p1',
      'Um táxi cobra R$ {F} de bandeirada e R$ {v} por quilômetro rodado. Qual expressão dá o preço Y de uma corrida de X km?',
      'v*X+F',
      [{ expr: 'F*X+v', falta: 'Trocou a parte fixa pela que varia.', paragrafo: 'mat-fa.p1.b1.s1' },
       { expr: '(F+v)*X', falta: 'Somou as duas partes e multiplicou tudo pelos km.', paragrafo: 'mat-fa.p1.b1.s1' },
       { expr: 'v*X', falta: 'Esqueceu a bandeirada de R$ {F}.', paragrafo: 'mat-fa.p1.b1.s1' },
       { expr: 'F*X', falta: 'Multiplicou a bandeirada pelos km.', paragrafo: 'mat-fa.p1.b1.s2' }],
      L_TAXI, { explicacao: 'A bandeirada de R$ {F} entra uma vez; os R$ {v} multiplicam os km.' }),
    modeloPagina('mat-fa.p2.m', 'mat-fa.p2',
      'Uma van leva X pessoas a um parque. Uma delas é {quem}, que recebe R$ {F} pelo passeio e não entra no parque. Cada uma das outras paga R$ {v} de ingresso por dia, durante {d} dias. Qual expressão dá o gasto total Y do grupo, em reais?',
      'd*v*(X-1)+F',
      [{ expr: 'v*(X-1)+F', falta: 'Esqueceu que cada pessoa paga {d} dias de ingresso.', paragrafo: 'mat-fa.p1.b1.s2' },
       { expr: 'd*v*X+F', falta: 'Contou {quem} entre os que pagam ingresso.', paragrafo: 'mat-fa.p2.b1.s3' },
       { expr: 'v*X+F', falta: 'Esqueceu os {d} dias e contou {quem} entre os que pagam.', paragrafo: 'mat-fa.p2.b1.s3' },
       { expr: 'v*(X+1)+F', falta: 'Esqueceu os {d} dias e somou {quem} em vez de tirar.', paragrafo: 'mat-fa.p2.b1.s3' }],
      L_VAN),
    modeloBloco('mat-fa.p2.b2.m', 'mat-fa.p2', 'mat-fa.p2.b2',
      'Num suco, {p}% do volume é polpa. Com {V} litros desse suco, quantos litros são de polpa?',
      'p/100*V',
      [{ expr: '(100-p)/100*V', falta: 'Usou o complemento: a parte que não é polpa.', paragrafo: 'mat-fa.p2.b2.s4' },
       { expr: 'p*V', falta: 'Esqueceu de dividir o percentual por 100.', paragrafo: 'mat-fa.p2.b2.s4' },
       { expr: 'p/10*V', falta: 'Dividiu o percentual por 10, e não por 100.', paragrafo: 'mat-fa.p2.b2.s4' },
       { expr: 'V/p', falta: 'Dividiu o volume pelo percentual.', paragrafo: 'mat-fa.p2.b2.s4' }],
      L_POLPA, { formato: 'numero', unidade: 'L' }),
    modeloPagina('mat-fa.p3.m', 'mat-fa.p3',
      'Um gráfico mostra a altura de uma pipa. Ela ficou parada do minuto {ini} ao minuto {fim}. Por quantos minutos ficou parada?',
      'fim-ini',
      [{ expr: 'fim', falta: 'Leu só o fim do trecho.', paragrafo: 'mat-fa.p3.b2.s3' },
       { expr: 'ini', falta: 'Leu só o começo do trecho.', paragrafo: 'mat-fa.p3.b2.s3' },
       { expr: 'fim-ini+1', falta: 'Contou os pontos marcados em vez de medir.', paragrafo: 'mat-fa.p3.b2.s3' },
       { expr: 'fim+ini', falta: 'Somou começo e fim.', paragrafo: 'mat-fa.p3.b2.s3' }],
      L_PARADO, { formato: 'numero', unidade: 'min' }),
    modeloPagina('mat-fa.p4.m', 'mat-fa.p4',
      'A temperatura de uma cidade ficou acima de 25 °C por {a} horas de manhã e por {b} horas à tarde. Por quantas horas ficou acima de 25 °C?',
      'a+b',
      [{ expr: 'a', falta: 'Contou só o maior intervalo.', paragrafo: 'mat-fa.p4.b1.s2' },
       { expr: 'b', falta: 'Contou só o menor intervalo.', paragrafo: 'mat-fa.p4.b1.s2' },
       { expr: 'a+b+1', falta: 'Contou uma hora a mais na emenda.', paragrafo: 'mat-fa.p4.b1.s1' },
       { expr: 'a*b', falta: 'Multiplicou os intervalos.', paragrafo: 'mat-fa.p4.b1.s2' }],
      L_ACIMA, { formato: 'numero', unidade: 'h' }),
    modeloBloco('mat-fa.p4.b2.m', 'mat-fa.p4', 'mat-fa.p4.b2',
      'Em {n} dos 8 horários a cidade A estava mais quente; a curva de A subiu {s} vezes e cruzou a de B {c} vezes. Em quantos horários A estava mais quente?',
      'n',
      [{ expr: 's', falta: 'Contou as subidas de A.', paragrafo: 'mat-fa.p4.b2.s3' },
       { expr: 'c', falta: 'Contou os cruzamentos.', paragrafo: 'mat-fa.p4.b2.s3' },
       { expr: '8-n', falta: 'Contou os horários em que B estava mais quente.', paragrafo: 'mat-fa.p4.b2.s3' },
       { expr: 'n+1', falta: 'Contou um horário de empate.', paragrafo: 'mat-fa.p4.b2.s3' }],
      L_CURVAS, { formato: 'numero' }),
    modeloPagina('mat-fa.p5.m', 'mat-fa.p5',
      'Uma caixa tinha {k} litros no minuto 0 e {y} litros depois, no minuto {x}, enchendo sempre no mesmo ritmo. Quantos litros entram por minuto?',
      '(y-k)/x',
      [{ expr: 'y/x', falta: 'Dividiu o valor final, e não a variação.', paragrafo: 'mat-fa.p5.b1.s1' },
       { expr: 'y-k', falta: 'Esqueceu de dividir pelo tempo.', paragrafo: 'mat-fa.p5.b1.s1' },
       { expr: 'x/(y-k)', falta: 'Inverteu a divisão.', paragrafo: 'mat-fa.p5.b1.s1' },
       { expr: '(y+k)/x', falta: 'Somou em vez de subtrair.', paragrafo: 'mat-fa.p5.b1.s1' }],
      L_TAXA, { formato: 'numero', unidade: 'L/min' }),
    modeloPagina('mat-fa.p6.m', 'mat-fa.p6',
      'Um ciclista percorreu {d} km em {t} horas, sempre no mesmo ritmo. Qual foi a velocidade média, em km por hora?',
      'd/t',
      [{ expr: 't/d', falta: 'Inverteu a divisão.', paragrafo: 'mat-fa.p6.b1.s2' },
       { expr: 'd*t', falta: 'Multiplicou distância e tempo.', paragrafo: 'mat-fa.p6.b1.s2' },
       { expr: 'd-t', falta: 'Subtraiu o tempo da distância.', paragrafo: 'mat-fa.p6.b1.s2' },
       { expr: 'd+t', falta: 'Somou distância e tempo.', paragrafo: 'mat-fa.p6.b1.s2' }],
      L_RAZAO, { formato: 'numero', unidade: 'km/h' }),
    modeloPagina('mat-fa.p7.m', 'mat-fa.p7',
      'Dois números somam {s} e o maior passa o menor em {df}. Qual é o maior?',
      '(s+df)/2',
      [{ expr: 's-df', falta: 'Subtraiu a diferença da soma e parou aí.', paragrafo: 'mat-fa.p7.b1.s2' },
       { expr: '(s-df)/2', falta: 'Achou o menor, não o maior.', paragrafo: 'mat-fa.p7.b1.s2' },
       { expr: 's+df', falta: 'Somou e esqueceu de dividir por 2.', paragrafo: 'mat-fa.p7.b1.s2' },
       { expr: 's/2', falta: 'Usou só a soma.', paragrafo: 'mat-fa.p7.b1.s1' }],
      L_SIS, { formato: 'numero' }),
    modeloPagina('mat-fa.p8.m', 'mat-fa.p8',
      'O plano A cobra R$ {t1} de taxa mais R$ {a} por hora; o plano B cobra R$ {t2} de taxa mais R$ {b} por hora. Com quantas horas os dois planos custam o mesmo?',
      '(t2-t1)/(a-b)',
      [{ expr: '(t2+t1)/(a-b)', falta: 'Somou as taxas em vez de subtrair.', paragrafo: 'mat-fa.p8.b1.s2' },
       { expr: '(t2-t1)/(a+b)', falta: 'Somou as tarifas por hora.', paragrafo: 'mat-fa.p8.b1.s2' },
       { expr: 't2-t1', falta: 'Esqueceu de dividir pela diferença das tarifas.', paragrafo: 'mat-fa.p8.b1.s2' },
       { expr: '(t2-t1)/(a-b)+1', falta: 'Contou uma hora a mais.', paragrafo: 'mat-fa.p8.b1.s1' }],
      L_DUAS, { formato: 'numero', unidade: 'h' }),
  ],
  questoes: [
    questao('enem-2023-162', { b: 0.86, gabarito: 'D', blocos: ['mat-fa.p1.b1'], modelo: 'mat-fa.p1.m',
      contexto: 'Texto de teste: uma empresa de água cobra uma taxa fixa mensal e um valor por metro cúbico consumido.',
      introducao: 'Texto de teste: a expressão do valor Y pago por x metros cúbicos é',
      alternativas: [
        { letra: 'A', texto: 'Y = 250x', expr: '250*x', falta: 'Esqueceu a taxa fixa de R$ 500.', paragrafo: 'mat-fa.p1.b1.s1' },
        { letra: 'B', texto: 'Y = 500x', expr: '500*x', falta: 'Multiplicou a taxa fixa pelo volume e esqueceu o preço do metro cúbico.', paragrafo: 'mat-fa.p1.b1.s2' },
        { letra: 'C', texto: 'Y = 750x', expr: '750*x', falta: 'Somou as duas partes e multiplicou tudo pelo volume.', paragrafo: 'mat-fa.p1.b1.s1' },
        { letra: 'D', texto: 'Y = 250x + 500' },
        { letra: 'E', texto: 'Y = 500x + 250', expr: '500*x+250', falta: 'Trocou a parte fixa pela que varia.', paragrafo: 'mat-fa.p1.b1.s2' }],
      explicacao: 'A taxa fixa de 500 entra uma vez; 250 multiplica o volume.' }),
    questao('enem-2023-150', { b: 1.45, gabarito: 'C', blocos: ['mat-fa.p2.b2'], modelo: 'mat-fa.p2.m',
      contexto: 'Texto de teste: uma mistura tem uma parte percentual de concentrado.',
      introducao: 'Texto de teste: a quantidade C em função de q é',
      alternativas: [
        { letra: 'A', texto: 'C = 0,1q', expr: '0.1*q', falta: 'Usou o complemento do percentual.', paragrafo: 'mat-fa.p2.b2.s4' },
        { letra: 'B', texto: 'C = 9q', expr: '9*q', falta: 'Esqueceu de dividir por 100.', paragrafo: 'mat-fa.p2.b2.s4' },
        { letra: 'C', texto: 'C = 0,9q' },
        { letra: 'D', texto: 'C = 90q', expr: '90*q', falta: 'Usou o percentual sem dividir.', paragrafo: 'mat-fa.p2.b2.s4' },
        { letra: 'E', texto: 'C = q + 0,9', expr: 'q+0.9', falta: 'Somou o percentual em vez de multiplicar.', paragrafo: 'mat-fa.p2.b2.s4' }],
      explicacao: '90% de q é 0,9q.' }),
    questao('enem-2019-168', { b: 1.51757, gabarito: 'D', blocos: ['mat-fa.p1.b1', 'mat-fa.p2.b1'], modelo: 'mat-fa.p2.m',
      contexto: 'Uma empresa tem diversos funcionários. Um deles é o gerente, que recebe R$ 1000,00 por semana. Os outros funcionários são diaristas. Cada um trabalha 2 dias por semana, recebendo R$ 80,00 por dia trabalhado.',
      introducao: 'Chamando de X a quantidade total de funcionários da empresa, a quantia Y, em reais, que esta empresa gasta semanalmente para pagar seus funcionários é expressa por',
      alternativas: [
        { letra: 'A', texto: 'Y = 80X + 920.', expr: '80*(X-1)+1000', falta: 'Esqueceu que cada diarista trabalha 2 dias.', paragrafo: 'mat-fa.p1.b1.s2' },
        { letra: 'B', texto: 'Y = 80X + 1000.', expr: '80*X+1000', falta: 'Esqueceu os 2 dias e contou o gerente como diarista.', paragrafo: 'mat-fa.p2.b1.s3' },
        { letra: 'C', texto: 'Y = 80X + 1080.', expr: '80*(X+1)+1000', falta: 'Esqueceu que cada diarista trabalha 2 dias e somou o gerente aos diaristas em vez de tirá-lo.', paragrafo: 'mat-fa.p2.b1.s3' },
        { letra: 'D', texto: 'Y = 160X + 840.' },
        { letra: 'E', texto: 'Y = 160X + 1000.', expr: '160*X+1000', falta: 'Contou o gerente como diarista: ele não entra nos R$ 160.', paragrafo: 'mat-fa.p2.b1.s3' }],
      explicacao: 'Os diaristas são X − 1, porque o gerente está entre os X. Cada um recebe 2 × 80 = 160 por semana. Y = 160(X − 1) + 1000 = 160X + 840.' }),
    questao('enem-2021-141', { b: 1.59, gabarito: 'B', blocos: ['mat-fa.p2.b1'], modelo: 'mat-fa.p2.m',
      contexto: 'Texto de teste: um clube cobra mensalidade fixa e um valor por aula avulsa.',
      introducao: 'Texto de teste: o gasto anual com n aulas é',
      alternativas: altsNum(['G = 12n', 'G = 30n + 600', 'G = 600n', 'G = 630n', 'G = 30n'], 'B', [], 'mat-fa.p2.b1.s3') }),
    questao('enem-2023-156', { b: 0.38, gabarito: 'C', blocos: ['mat-fa.p3.b2'], modelo: 'mat-fa.p3.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: um gráfico mostra o sinal de um celular ao longo do dia.', introducao: 'Texto de teste: por quantos minutos ficou sem sinal?',
      alternativas: altsNum(['10', '20', '30', '40', '50'], 'C', ['Leu só o começo.', 'Contou pontos.', '', 'Somou trechos errados.', 'Leu só o fim.'], 'mat-fa.p3.b2.s3') }),
    questao('enem-2020-164', { b: 0.44, gabarito: 'B', blocos: ['mat-fa.p3.b2', 'mat-fa.p4.b1'], modelo: 'mat-fa.p4.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: um gráfico mostra o ruído de uma rua.', introducao: 'Texto de teste: por quantas horas ficou acima do limite?',
      alternativas: altsNum(['2', '5', '3', '7', '1'], 'B', ['Contou só o maior.', '', 'Contou só o menor.', 'Somou demais.', 'Contou cruzamentos.'], 'mat-fa.p4.b1.s2') }),
    questao('enem-2023-151', { b: 0.86, gabarito: 'A', blocos: ['mat-fa.p4.b2'], modelo: 'mat-fa.p4.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: duas curvas mostram os preços de dois produtos.', introducao: 'Texto de teste: em quantos dias o produto A valeu mais?',
      alternativas: altsNum(['3', '4', '5', '2', '6'], 'A', ['', 'Contou subidas.', 'Contou dias de B.', 'Contou cruzamentos.', 'Contou empates.'], 'mat-fa.p4.b2.s3') }),
    questao('enem-2019-143', { b: 0.81, gabarito: 'E', blocos: ['mat-fa.p5.b1'], modelo: 'mat-fa.p5.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: uma tabela mostra o nível de um tanque.', introducao: 'Texto de teste: qual é a taxa de variação?',
      alternativas: altsNum(['1', '2', '3', '4', '5'], 'E', ['Dividiu o valor final.', 'Inverteu.', 'Não dividiu.', 'Somou.', ''], 'mat-fa.p5.b1.s1') }),
    questao('enem-2020-175', { b: 1.15, gabarito: 'A', blocos: ['mat-fa.p6.b1'], modelo: 'mat-fa.p6.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: um carro percorre uma estrada.', introducao: 'Texto de teste: qual a velocidade média?',
      alternativas: altsNum(['60', '30', '90', '120', '45'], 'A', ['', 'Inverteu.', 'Somou.', 'Multiplicou.', 'Dividiu errado.'], 'mat-fa.p6.b1.s2') }),
    questao('enem-2019-179', { b: 1.15, gabarito: 'D', blocos: ['mat-fa.p5.b1'], modelo: 'mat-fa.p5.m', habilidade: 'MT-H20',
      contexto: 'Texto de teste: o gráfico de uma reta passa por dois pontos.', introducao: 'Texto de teste: qual a inclinação?',
      alternativas: altsNum(['0,5', '1', '1,5', '2', '2,5'], 'D', ['Inverteu.', 'Usou um ponto só.', 'Somou.', '', 'Arredondou.'], 'mat-fa.p5.b1.s1') }),
    questao('enem-2021-164', { b: 0.78, gabarito: 'B', blocos: ['mat-fa.p7.b1'], modelo: 'mat-fa.p7.m', habilidade: 'MT-H21',
      contexto: 'Texto de teste: dois amigos dividem uma conta.', introducao: 'Texto de teste: quanto pagou o que pagou mais?',
      alternativas: altsNum(['20', '35', '15', '50', '25'], 'B', ['Achou o menor.', '', 'Achou a diferença.', 'Esqueceu de dividir.', 'Usou só a soma.'], 'mat-fa.p7.b1.s2') }),
    questao('enem-2023-175', { b: 1.83, gabarito: 'C', blocos: ['mat-fa.p8.b1'], modelo: 'mat-fa.p8.m', habilidade: 'MT-H22',
      contexto: 'Texto de teste: duas operadoras oferecem planos.', introducao: 'Texto de teste: a partir de quantos minutos o plano B compensa?',
      alternativas: altsNum(['100', '150', '200', '250', '300'], 'C', ['Somou as taxas.', 'Errou a divisão.', '', 'Contou a mais.', 'Usou um plano só.'], 'mat-fa.p8.b1.s2') }),
  ],
};
export default pack;
