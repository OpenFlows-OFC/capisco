// Fonte do conteúdo dos Caps. 3 e 4 do caderno "Funções afins" (págs. 5–8).
// Texto, modelos, diagnósticos ("o que faltou"), explicações e cards: rascunho por IA
// (Claude Opus 5.5, via Claude Code, 17/11/2026), revisão humana pendente.
// O script _dev/c34_build.mjs lê este arquivo, junta as questões do Enem (enem.dev + ITENS_PROVA
// do INEP), gera as variantes, roda os testes e escreve conteudo/mat-fa-c34.js.
// Edite aqui, nunca no arquivo gerado.

// Autoria (e.2): "ia" é texto (ferramenta, versão e data), o mesmo objeto dos Caps. 1 e 2 e de
// pack.autoriaPadrao (AUTORIA_IA, conteudo/gerador.js). Nos créditos: "rascunho por IA (...), revisão pendente".
import { AUTORIA_IA } from '../conteudo/gerador.js';
export const AUTORIA = AUTORIA_IA;

// Links "Ir além" conferidos no navegador em 17/11/2026 (Playwright): a Unidade 3 do curso da Khan
// (2º Bimestre) tem "Retomando equações do 1º grau" e "Lei de Formação da Função Afim"; a Unidade 4
// (3º Bimestre) abre com a lição "Taxa de variação de uma função afim". O módulo 35 do Portal da OBMEP
// é "Função Afim" (videoaulas, exercícios resolvidos e caderno de exercícios), o mesmo link dos Caps. 1 e 2.
const KHAN_UNIDADE_3 = 'https://pt.khanacademy.org/math/1-serie-em-mat-sp/x82b03a9b6c8af113:2-bimestre-2026';
const KHAN_UNIDADE_4 = 'https://pt.khanacademy.org/math/1-serie-em-mat-sp/x82b03a9b6c8af113:3-bimestre-2026';
const KHAN_AVISO = 'Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org. O Prumo não é oficial nem endossado pela Khan Academy.';
const OBMEP = {
  tipo: 'obmep', rotulo: 'Portal da OBMEP: módulo Função Afim (videoaulas e exercícios)',
  url: 'https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=35',
  aviso: 'Abre o Portal da OBMEP (IMPA) em outra aba. O Prumo só aponta o link; o conteúdo do portal não é copiado.',
  conferidoEm: '2026-11-17',
};
// O link do MEC Enem fica no nível do pack (META.irAlem em conteudo/mat-fa.js), como nos Caps. 1 e 2.

// ---------------------------------------------------------------------------
// Páginas. § numerados dentro da página; cada bloco diz o seu papel:
// "nucleo" (pré-pergunta de abertura), "cobrado" (pré-pergunta de bloco) ou "apoio" (lido sem tentativa antes).
// ---------------------------------------------------------------------------
export const CAPITULOS = [
  {
    id: 'mat-fa.c3', n: 3, titulo: 'Taxa de variação', habilidades: ['MT-H20'],
    prereq: ['mat-fa.c1', 'mat-fa.c2'],
    rodada: ['enem-2019-143', 'enem-2020-175', 'enem-2019-179'],
    reserva: [],
    irAlem: [
      { tipo: 'khan', rotulo: 'Taxa de variação de uma função afim, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 4, 3º Bimestre)', url: KHAN_UNIDADE_4, aviso: KHAN_AVISO, conferidoEm: '2026-11-17' },
      OBMEP,
    ],
    paginas: [
      {
        id: 'mat-fa.p5', n: 5, titulo: 'Quanto por minuto', modelo: 'mat-fa.p5.m', nucleo: 'mat-fa.p5.b1',
        notaPrompt: 'Com suas palavras: por que quem fez mais nem sempre foi mais rápido?',
        blocos: [
          { id: 'mat-fa.p5.b1', papel: 'nucleo', paragrafos: [
            '<strong>Taxa de variação</strong> é quanto uma grandeza muda a cada unidade de outra. A conta é sempre uma divisão: quanto mudou, dividido pelo intervalo em que mudou. Um ônibus andou 6 km em 15 minutos. A taxa é 6 ÷ 15 = 0,4 km por minuto.',
            'A unidade diz a ordem da divisão. Em “km por minuto”, o km vai em cima e o minuto embaixo. A conta ao contrário, 15 ÷ 6 = 2,5, mede outra coisa: minutos por km, o tempo para andar 1 km. Nessa unidade, quanto maior o número, mais devagar.',
            'O maior total não é, sozinho, a maior taxa. Bia pedalou 15 km em 60 minutos; Caio, 10 km em 25 minutos. Bia andou mais, mas Caio foi mais rápido: 10 ÷ 25 = 0,4 km por minuto, contra 15 ÷ 60 = 0,25. Para comparar, divida cada total pelo próprio tempo. Somar os dois, multiplicar ou ficar com o maior número não compara taxas.',
          ] },
          { id: 'mat-fa.p5.b2', papel: 'apoio', paragrafos: [
            'No gráfico, a taxa vira inclinação. Se os dois eixos começam em 0, ligue o ponto (0; 0) a cada ponto: quanto mais em pé o segmento, maior a taxa. Se um dos eixos não começa em 0, o canto do gráfico não é o ponto (0; 0), e a inclinação engana: faça a divisão de cada ponto. Dois pontos na mesma altura têm o mesmo total, mas o que está mais à direita levou mais tempo e tem taxa menor. É o <em>a</em> de y = ax + b, da p. 2: quanto y muda quando x anda 1.',
          ] },
        ],
      },
      {
        id: 'mat-fa.p6', n: 6, titulo: 'Trecho a trecho', modelo: 'mat-fa.p6.m', nucleo: 'mat-fa.p6.b1',
        notaPrompt: 'Com suas palavras: num total acumulado, como você descobre o que aconteceu em um minuto só?',
        blocos: [
          { id: 'mat-fa.p6.b1', papel: 'nucleo', paragrafos: [
            'Alguns gráficos e tabelas mostram um <strong>total acumulado</strong>: cada valor é tudo o que já foi somado desde o começo. O hodômetro do carro e o consumo do mês no aplicativo de internet funcionam assim. Quando só se soma, como no hodômetro, um total acumulado nunca desce. No máximo, fica parado.',
            'O que aconteceu num trecho é a <strong>subida</strong> do trecho: valor no fim menos valor no começo. Se o trecho dura 1 minuto, essa subida já é a taxa daquele minuto. O 4º minuto vai de t = 3 a t = 4, e não de 0 a 4. Cada minuto tem a sua subida. Uma lista de valores por minuto cuja soma confere com o fim do gráfico ainda pode errar minuto a minuto: confira um por um.',
          ] },
          { id: 'mat-fa.p6.b2', papel: 'cobrado', prePergunta: 'mat-fa.p6.b2.m', paragrafos: [
            'Às vezes a pergunta é a <strong>diferença</strong> entre duas curvas no mesmo ponto do eixo horizontal. Lucro é receita menos custo, nessa ordem. Em cada valor do eixo horizontal, pegue a altura da receita e tire a altura do custo. O resultado é uma terceira curva, diferente das duas.',
            'Essa curva nova tem sinal. Onde a receita está acima do custo, o lucro é positivo. Onde as duas se cruzam, o lucro é zero. Onde o custo passa por cima, o lucro é <strong>negativo</strong>: é prejuízo, e a curva desce abaixo do eixo. Desenhar só a distância entre as curvas, sempre positiva, apaga o prejuízo.',
          ] },
        ],
      },
    ],
    // Cada card diz o bloco e o § exato que o explica ("ver o trecho · p. X, § Y", Decisão 1).
    cards: [
      { tipo: 'conceito', frente: 'O que é taxa de variação?', verso: 'Quanto uma grandeza muda a cada unidade da outra: o quanto mudou, dividido pelo intervalo.', bloco: 'mat-fa.p5.b1', paragrafo: 'mat-fa.p5.b1.s1' },
      { tipo: 'palavra-pista', frente: 'Em “km por minuto”, o que vai embaixo na divisão?', verso: 'O minuto. O que vem depois de “por” é o divisor: km ÷ minutos.', bloco: 'mat-fa.p5.b1', paragrafo: 'mat-fa.p5.b1.s2' },
      { tipo: 'armadilha', frente: 'Quem fez o maior total foi o mais rápido?', verso: 'Não necessariamente. Divida cada total pelo próprio tempo antes de comparar.', bloco: 'mat-fa.p5.b1', paragrafo: 'mat-fa.p5.b1.s3' },
      { tipo: 'procedimento', frente: 'Como achar a maior taxa num gráfico de pontos?', verso: 'Se os dois eixos começam em 0, ligue (0; 0) a cada ponto: o segmento mais inclinado tem a maior taxa. Se não, divida.', bloco: 'mat-fa.p5.b2', paragrafo: 'mat-fa.p5.b2.s4' },
      { tipo: 'conceito', frente: 'O que mostra um total acumulado?', verso: 'Em cada ponto, tudo o que foi somado desde o começo. Se só se soma, ele nunca desce.', bloco: 'mat-fa.p6.b1', paragrafo: 'mat-fa.p6.b1.s1' },
      { tipo: 'procedimento', frente: 'Num total acumulado, como achar o que houve no 4º minuto?', verso: 'Valor em t = 4 menos valor em t = 3. O 4º minuto vai de 3 a 4.', bloco: 'mat-fa.p6.b1', paragrafo: 'mat-fa.p6.b1.s2' },
      { tipo: 'armadilha', frente: 'Os valores por minuto somam o total do fim. Então estão todos certos?', verso: 'Não basta. Compare cada valor com a subida do seu minuto, um por um.', bloco: 'mat-fa.p6.b1', paragrafo: 'mat-fa.p6.b1.s2' },
      { tipo: 'procedimento', frente: 'Como montar o lucro a partir das curvas de receita e custo?', verso: 'Ponto a ponto: receita − custo, nessa ordem. Onde o custo fica acima, o lucro é negativo.', bloco: 'mat-fa.p6.b2', paragrafo: 'mat-fa.p6.b2.s3' },
    ],
  },
  {
    id: 'mat-fa.c4', n: 4, titulo: 'Duas condições, um sistema', habilidades: ['MT-H21', 'MT-H22'],
    prereq: ['mat-fa.c1'],
    // Ordem por b crescente nas questões do Enem; a questão da equipe (papel de aplicar, g.4) fica
    // entre as duas, por estimativa da equipe (não tem b do INEP).
    rodada: ['enem-2021-164', 'mat-fa.c4.ap#0', 'enem-2023-175'],
    reserva: [],
    irAlem: [
      { tipo: 'khan', rotulo: 'Para revisar equações de 1º grau, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 3, 2º Bimestre)', url: KHAN_UNIDADE_3, aviso: KHAN_AVISO, conferidoEm: '2026-11-17' },
      OBMEP,
    ],
    paginas: [
      {
        id: 'mat-fa.p7', n: 7, titulo: 'Duas frases, duas equações', modelo: 'mat-fa.p7.m', nucleo: 'mat-fa.p7.b1',
        notaPrompt: 'Com suas palavras: como uma frase de comparação vira equação?',
        blocos: [
          { id: 'mat-fa.p7.b1', papel: 'nucleo', paragrafos: [
            'Um problema com dois valores desconhecidos precisa de duas informações. Dê uma letra para cada valor e diga o que ela é: c = preço de uma coxinha, em reais; s = preço de um suco, em reais. Cada condição do texto vira uma equação. Duas condições sobre as mesmas letras formam um <strong>sistema</strong>.',
            'Traduza a frase inteira, sem pular pedaço. “A coxinha custa R$ 2 a mais que o suco” é c = s + 2. “A coxinha custa R$ 2 a mais que o dobro do suco” é c = 2s + 2. E “a coxinha menos o suco dá o suco mais R$ 2” é c − s = s + 2, que também vira c = 2s + 2. Ler só o “2 a mais” muda o problema.',
            'Cuide das quantidades e das unidades. Se a coxinha vem em bandeja de 6, uma bandeja custa 6c, e três bandejas custam 3 × 6c = 18c. Centavos viram reais com vírgula: 5 centavos são R$ 0,05; 50 centavos são R$ 0,50. Um zero fora do lugar muda a resposta.',
          ] },
          // Apoio (b.5): a 2023 Q175 e a mat-fa.c4.ap pedem a substituição deste §, mas a pré-pergunta do
          // núcleo (mat-fa.p7.m, linha 0) já exige resolver um sistema antes da leitura.
          { id: 'mat-fa.p7.b2', papel: 'apoio', paragrafos: [
            'Com as duas equações, use a <strong>substituição</strong>: isole uma letra numa equação e leve para a outra. Se uma equação é c = 2s + 2 e a outra é 3c + s = 27, troque c na segunda: 3(2s + 2) + s = 27, então 7s + 6 = 27 e s = 3. Volte à primeira: c = 2 × 3 + 2 = 8. Confira nas duas. Na primeira, 8 = 2 × 3 + 2; na segunda, 3 × 8 + 3 = 27.',
          ] },
        ],
      },
      {
        id: 'mat-fa.p8', n: 8, titulo: 'Comparar as duas condições', modelo: 'mat-fa.p8.m', nucleo: 'mat-fa.p8.b1',
        notaPrompt: 'Com suas palavras: o que a comparação entre os dois pedidos mostra?',
        blocos: [
          { id: 'mat-fa.p8.b1', papel: 'nucleo', paragrafos: [
            'Quando duas situações dão o mesmo total, compare uma com a outra. Dois pedidos de R$ 28 numa pastelaria: o primeiro com 2 pastéis e 3 caldos de cana; o segundo com 3 pastéis e 1 caldo. Do primeiro para o segundo, entrou 1 pastel e saíram 2 caldos, e o total não mudou.',
            'Se o total não mudou, o que entrou vale o mesmo que o que saiu: 1 pastel vale 2 caldos. É a <strong>troca</strong> que equilibra. Isso é o mesmo que subtrair uma condição da outra: o que é igual nas duas se cancela, e sobra a troca. Conte por tipo de item, e não pelo total de itens: o pedido ficou com 1 item a menos, mas o que vale é 1 pastel no lugar de 2 caldos.',
            'Com a troca, dá para montar uma terceira situação sem descobrir cada preço. Quer um pedido de R$ 28 com 1 pastel só? Parta do primeiro (2 pastéis e 3 caldos) e troque 1 pastel por 2 caldos: ficam 1 pastel e 5 caldos. Aplique a troca quantas vezes for preciso, nem uma a mais, nem uma a menos.',
          ] },
          { id: 'mat-fa.p8.b2', papel: 'cobrado', prePergunta: 'mat-fa.p8.b2.m', paragrafos: [
            'No fim, responda exatamente o que foi pedido. Se a pergunta é “quantos caldos”, não some os pastéis. Se uma parte já está ocupada por outros itens, desconte esses itens antes de contar o resto. E confira: a situação nova tem de dar o mesmo total das duas condições.',
          ] },
        ],
      },
    ],
    cards: [
      { tipo: 'conceito', frente: 'O que é um sistema de equações?', verso: 'Duas ou mais condições sobre as mesmas letras, cada uma escrita como equação.', bloco: 'mat-fa.p7.b1', paragrafo: 'mat-fa.p7.b1.s1' },
      { tipo: 'procedimento', frente: 'Qual é o primeiro passo para montar um sistema a partir do texto?', verso: 'Dar uma letra a cada valor desconhecido e dizer o que ela é, com a unidade.', bloco: 'mat-fa.p7.b1', paragrafo: 'mat-fa.p7.b1.s1' },
      { tipo: 'palavra-pista', frente: 'Como se escreve “R$ 2 a mais que o dobro de s”?', verso: '2s + 2. O dobro multiplica s por 2; o “a mais” soma depois.', bloco: 'mat-fa.p7.b1', paragrafo: 'mat-fa.p7.b1.s2' },
      { tipo: 'armadilha', frente: 'Quanto são 5 centavos em reais?', verso: 'R$ 0,05. Já 50 centavos são R$ 0,50: a casa do 5 muda a resposta.', bloco: 'mat-fa.p7.b1', paragrafo: 'mat-fa.p7.b1.s3' },
      { tipo: 'procedimento', frente: 'Como resolver um sistema por substituição?', verso: 'Isole uma letra numa equação, leve para a outra, resolva e volte para achar a segunda letra.', bloco: 'mat-fa.p7.b2', paragrafo: 'mat-fa.p7.b2.s4' },
      { tipo: 'conceito', frente: 'Duas situações com o mesmo total: o que a diferença entre elas mostra?', verso: 'Uma troca que equilibra: o que entrou vale o mesmo que o que saiu.', bloco: 'mat-fa.p8.b1', paragrafo: 'mat-fa.p8.b1.s2' },
      { tipo: 'procedimento', frente: 'Como chegar a uma terceira situação sem achar cada preço?', verso: 'Parta de uma das situações e aplique a troca quantas vezes for preciso, nem uma a mais, nem uma a menos.', bloco: 'mat-fa.p8.b1', paragrafo: 'mat-fa.p8.b1.s3' },
      { tipo: 'armadilha', frente: 'Achou um número. O que conferir antes de marcar?', verso: 'Se ele responde o que foi pedido, se você descontou o que já ocupa parte do total e se ele satisfaz as duas condições.', bloco: 'mat-fa.p8.b2', paragrafo: 'mat-fa.p8.b2.s4' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Modelos da equipe. Expressões só com + − × ÷ e parênteses sobre as variáveis da linha
// (a mesma gramática de js/nucleo/pack.js e de conteudo/gerador.js, sem eval).
// `deriva(l)` completa cada linha com valores calculados (nada sorteado); o build grava tudo na linha.
// As alternativas saem em ordem crescente (como em pack.js); a posição da certa varia pelos dados
// de cada linha (minuto ou hora; pergunta pelo suco ou pelo salgado; troca para frente ou para trás).
// ---------------------------------------------------------------------------
const plural = (n, um, varios) => `${String(n).replace('.', ',')} ${n === 1 || (n > 0 && n < 2 && !Number.isInteger(n)) ? um : varios}`;
const reais = v => v.toFixed(2).replace('.', ',');

export const MODELOS = [
  {
    id: 'mat-fa.p5.m', tipo: 'pagina', pagina: 'mat-fa.p5', capitulo: 'mat-fa.c3', formato: 'numero',
    enunciado: 'Na ciclovia do bairro, {A} pedalou {qa} km em {taT}, e {B} pedalou {qb} km em {tbT}. Quantos quilômetros por {un} fez quem foi mais rápido?',
    certa: 'qb/tb',
    erros: [
      { expr: 'qa/ta', falta: 'Escolheu quem andou mais km. {A} andou mais, porém em mais tempo: {qa} ÷ {ta} dá menos km por {un} que {qb} ÷ {tb}.', paragrafo: 'mat-fa.p5.b1.s3' },
      { expr: 'tb/qb', falta: 'Inverteu a divisão: {tb} ÷ {qb} dá {uns} por km. Km por {un} é km ÷ {uns}.', paragrafo: 'mat-fa.p5.b1.s2' },
      { expr: 'qb', falta: 'Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.', paragrafo: 'mat-fa.p5.b1.s1' },
      { expr: '(qa + qb)/(ta + tb)', falta: 'Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.', paragrafo: 'mat-fa.p5.b1.s3' },
    ],
    explicacao: 'Divida cada total pelo próprio tempo. {A}: {qa} ÷ {ta} = {ra}. {B}: {qb} ÷ {tb} = {rb}. A maior taxa é {rb} km por {un}, de {B}, que andou menos km.',
    deriva: l => {
      const min = l.unidade === 'min', t = x => min ? plural(x, 'minuto', 'minutos') : plural(x, 'hora', 'horas');
      return { taT: t(l.ta), tbT: t(l.tb), un: min ? 'minuto' : 'hora', uns: min ? 'minutos' : 'horas', ra: l.qa / l.ta, rb: l.qb / l.tb };
    },
    linhas: [
      { A: 'Lívia', B: 'Pedro', unidade: 'min', qa: 12, ta: 40, qb: 5, tb: 10 },
      { A: 'Bruna', B: 'Enzo', unidade: 'h', qa: 24, ta: 3, qb: 20, tb: 2 },
      { A: 'Júlia', B: 'Beto', unidade: 'min', qa: 14, ta: 40, qb: 10, tb: 20 },   // não repete o exemplo do § 3 (Caio, 10 km em 25 min)
      { A: 'Marta', B: 'Davi', unidade: 'h', qa: 18, ta: 1.5, qb: 10, tb: 0.5 },
      { A: 'Sofia', B: 'Igor', unidade: 'min', qa: 18, ta: 45, qb: 15, tb: 30 },
      { A: 'Clara', B: 'Luan', unidade: 'h', qa: 33, ta: 3, qb: 25, tb: 2 },
      { A: 'Rita', B: 'João', unidade: 'min', qa: 13, ta: 50, qb: 8, tb: 20 },
      { A: 'Ana', B: 'Téo', unidade: 'h', qa: 22, ta: 2, qb: 10, tb: 0.5 },
      { A: 'Elisa', B: 'Rafael', unidade: 'min', qa: 16, ta: 50, qb: 12, tb: 30 },
      { A: 'Nara', B: 'Gui', unidade: 'h', qa: 36, ta: 2.5, qb: 30, tb: 1.5 },
      { A: 'Lara', B: 'Otávio', unidade: 'min', qa: 12, ta: 60, qb: 10, tb: 40 },
    ],
  },
  {
    id: 'mat-fa.p6.m', tipo: 'pagina', pagina: 'mat-fa.p6', capitulo: 'mat-fa.c3', formato: 'numero',
    enunciado: 'O aplicativo de corrida de {nome} mostra a distância total, em metros, desde a largada:<table class="tabela-equipe"><caption>Distância total desde a largada</caption><thead><tr><th scope="col">t (min)</th><th scope="col">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>{d1}</td></tr><tr><td>2</td><td>{d2}</td></tr><tr><td>3</td><td>{d3}</td></tr><tr><td>4</td><td>{d4}</td></tr><tr><td>5</td><td>{d5}</td></tr></tbody></table>Quantos metros {nome} correu no {k}º minuto?',
    certa: 'dk - dk1',
    erros: [
      { expr: 'dk', falta: 'Leu o total acumulado em t = {k}. O que aconteceu no {k}º minuto é a subida: {dk} − {dk1}.', paragrafo: 'mat-fa.p6.b1.s1' },
      { expr: 'dk/k', falta: 'Dividiu o total pelo tempo desde a largada. Isso é a média dos {k} minutos, não o {k}º minuto.', paragrafo: 'mat-fa.p6.b1.s2' },
      { expr: 'dk1 - dk2', falta: 'Pegou o minuto anterior. O {k}º minuto vai de t = {km1} a t = {k}.', paragrafo: 'mat-fa.p6.b1.s2' },
      { expr: 'dk - dk2', falta: 'Pegou um trecho de 2 minutos, de t = {km2} a t = {k}. O {k}º minuto dura 1 minuto só.', paragrafo: 'mat-fa.p6.b1.s2' },
    ],
    explicacao: 'O {k}º minuto vai de t = {km1} a t = {k}. A subida desse trecho é {dk} − {dk1} = {sub} metros.',
    deriva: l => {
      const d = [0, l.d1, l.d2, l.d3, l.d4, l.d5];
      return { km1: l.k - 1, km2: l.k - 2, dk: d[l.k], dk1: d[l.k - 1], dk2: d[l.k - 2], sub: d[l.k] - d[l.k - 1] };
    },
    linhas: [
      { nome: 'Lia', d1: 180, d2: 360, d3: 540, d4: 700, d5: 880, k: 4 },
      { nome: 'Rafa', d1: 150, d2: 300, d3: 450, d4: 630, d5: 800, k: 5 },
      { nome: 'Duda', d1: 200, d2: 400, d3: 570, d4: 760, d5: 940, k: 3 },
      { nome: 'Téo', d1: 160, d2: 330, d3: 330, d4: 500, d5: 680, k: 5 },
      { nome: 'Nina', d1: 200, d2: 390, d3: 550, d4: 720, d5: 900, k: 4 },
      { nome: 'Gabi', d1: 170, d2: 340, d3: 500, d4: 680, d5: 850, k: 4 },
      { nome: 'Leo', d1: 210, d2: 400, d3: 600, d4: 790, d5: 960, k: 5 },
      { nome: 'Bia', d1: 150, d2: 310, d3: 500, d4: 680, d5: 860, k: 4 },
      { nome: 'Caio', d1: 180, d2: 350, d3: 540, d4: 720, d5: 900, k: 3 },
      { nome: 'Iara', d1: 150, d2: 300, d3: 480, d4: 640, d5: 810, k: 5 },
      { nome: 'Davi', d1: 200, d2: 380, d3: 570, d4: 750, d5: 950, k: 5 },
    ],
  },
  {
    id: 'mat-fa.p6.b2.m', tipo: 'bloco', pagina: 'mat-fa.p6', bloco: 'mat-fa.p6.b2', capitulo: 'mat-fa.c3', formato: 'numero',
    enunciado: 'Numa feira, a barraca de pastel de {nome} anota a receita e o custo acumulados desde a abertura, em reais:<table class="tabela-equipe"><caption>Receita e custo acumulados desde a abertura</caption><thead><tr><th scope="col">Hora</th><th scope="col">Receita (R$)</th><th scope="col">Custo (R$)</th></tr></thead><tbody><tr><td>7 h</td><td>{r7}</td><td>{c7}</td></tr><tr><td>8 h</td><td>{r8}</td><td>{c8}</td></tr><tr><td>9 h</td><td>{r9}</td><td>{c9}</td></tr><tr><td>10 h</td><td>{r10}</td><td>{c10}</td></tr><tr><td>11 h</td><td>{r11}</td><td>{c11}</td></tr></tbody></table>Qual era o lucro da barraca, em reais, às {h} h?',
    certa: 'R - C',
    erros: [
      // O diagnóstico depende do sinal do lucro da linha: "tirou o sinal" só explica o erro quando há prejuízo.
      { expr: 'C - R', falta: '{faltaInvertida}', paragrafo: 'mat-fa.p6.b2.s4' },
      { expr: 'R', falta: 'Respondeu a receita. O lucro é a receita menos o custo.', paragrafo: 'mat-fa.p6.b2.s3' },
      { expr: 'C', falta: 'Respondeu o custo. O lucro é a receita menos o custo.', paragrafo: 'mat-fa.p6.b2.s3' },
      { expr: 'R + C', falta: 'Somou receita e custo. Lucro é a diferença: receita − custo.', paragrafo: 'mat-fa.p6.b2.s3' },
    ],
    explicacao: 'Lucro = receita − custo. Às {h} h: {R} − {C} = {L}. {sinalTexto}',
    deriva: l => {
      const R = l['r' + l.h], C = l['c' + l.h], L = R - C;
      return { R, C, L, sinalTexto: L < 0 ? 'O custo estava acima da receita: houve prejuízo.' : 'A receita estava acima do custo: houve lucro.',
        faltaInvertida: L < 0
          ? 'Tirou o sinal (ou fez custo − receita). O custo estava acima da receita: o lucro é negativo, é prejuízo.'
          : 'Fez custo − receita, na ordem trocada. Lucro é receita − custo; aqui a receita estava acima, e o lucro é positivo.' };
    },
    linhas: [
      { nome: 'dona Lúcia', r7: 20, r8: 60, r9: 150, r10: 250, r11: 330, c7: 120, c8: 140, c9: 160, c10: 180, c11: 200, h: 8 },
      { nome: 'seu Jorge', r7: 30, r8: 90, r9: 160, r10: 260, r11: 350, c7: 140, c8: 160, c9: 180, c10: 200, c11: 220, h: 10 },
    ],
  },
  {
    id: 'mat-fa.p7.m', tipo: 'pagina', pagina: 'mat-fa.p7', capitulo: 'mat-fa.c4', formato: 'numero',
    // q = 0: a pergunta é o suco; q = 1: é o salgado.
    // forma = 'dif': a frase da comparação vem como na 2023 Q175 (b 1,83), "salgado menos suco é igual ao
    // suco mais d", cuja leitura apressada (salgado = suco + d) dá a alternativa D de lá. A pré-pergunta
    // (linha 0) e a checagem (linha 1) usam essa forma, para treinar a armadilha da questão ligada (g.2);
    // as variantes alternam com a forma direta, 'dobro' ("d a mais que o dobro do suco"). As contas não mudam.
    enunciado: 'Na cantina da escola, {fraseRelacao} Juntos, {n1t} e {n2t} custam R$ {Tt}. Quanto custa {umPedido}, em reais?',
    certa: 'q*(2*s + d) + (1 - q)*s',
    erros: [
      { expr: 'q*((T - n1*d)/(n1 + n2) + d) + (1 - q)*(T - n1*d)/(n1 + n2)', falta: '{faltaDobro}', paragrafo: 'mat-fa.p7.b1.s2' },
      { expr: 'q*(2*(T - (n1 + n2)*d)/(2*n1 + n2) + d) + (1 - q)*(T - (n1 + n2)*d)/(2*n1 + n2)', falta: 'Multiplicou o acréscimo de {dReais} pelos {nItens} itens. Só os {n1} salgados têm esse acréscimo: {n1} × {dReais}.', paragrafo: 'mat-fa.p7.b1.s3' },
      { expr: 'q*s + (1 - q)*(2*s + d)', falta: 'Achou o preço {doOutro}. A pergunta é o preço {doPedido}.', paragrafo: 'mat-fa.p7.b1.s1' },
      { expr: 'q*(2*(T - d)/(2 + n2) + d) + (1 - q)*(T - d)/(2 + n2)', falta: 'Contou um salgado só. São {n1} salgados: a conta tem {n1} × (2 × suco + {dReais}).', paragrafo: 'mat-fa.p7.b1.s3' },
    ],
    explicacao: 'Chame de g o preço de um salgado e de s o de um suco, em reais. {traducaoTexto} Então {n1}(2s + {dNum}) + {n2s} = {Tt}, ou seja, {coefS}s + {n1dTexto} = {Tt}. Daí {coefS}s = {restoTexto} e s = {sTexto}.{fimTexto}',
    deriva: l => {
      if (l.forma !== 'dif' && l.forma !== 'dobro') throw new Error('mat-fa.p7.m: forma tem de ser "dif" ou "dobro"');
      const d = l.dc / 100, s = l.s, T = l.n1 * (2 * s + d) + l.n2 * s, dif = l.forma === 'dif';
      const dTexto = l.dc < 100 ? `${l.dc} centavos` : 'R$ ' + reais(d), dReais = 'R$ ' + reais(d);
      return {
        d, T, Tt: reais(T), dReais, dNum: reais(d), dTexto,
        fraseRelacao: dif
          ? `o preço de um salgado menos o de um suco é igual ao preço do suco mais ${dTexto}.`
          : `um salgado custa ${dTexto} a mais que o dobro do preço de um suco.`,
        faltaDobro: dif
          ? `Leu como “o salgado custa ${dTexto} a mais que o suco”. A frase diz salgado − suco = suco + ${dReais}, ou seja, salgado = 2 × suco + ${dReais}.`
          : `Traduziu só “${dTexto} a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + ${dReais}.`,
        traducaoTexto: dif
          ? `A frase diz g − s = s + ${reais(d)}, ou seja, g = 2s + ${reais(d)}.`
          : `A frase diz g = 2s + ${reais(d)}.`,
        n2s: l.n2 === 1 ? 's' : `${l.n2}s`, n1t: plural(l.n1, 'salgado', 'salgados'), n2t: plural(l.n2, 'suco', 'sucos'), nItens: l.n1 + l.n2,
        umPedido: l.q ? 'um salgado' : 'um suco', doPedido: l.q ? 'do salgado' : 'do suco', doOutro: l.q ? 'do suco' : 'do salgado',
        coefS: 2 * l.n1 + l.n2, n1dTexto: reais(l.n1 * d), restoTexto: reais(T - l.n1 * d), sTexto: reais(s),
        fimTexto: l.q ? ` O salgado custa g = 2 × ${reais(s)} + ${reais(d)} = R$ ${reais(2 * s + d)}.` : '',
      };
    },
    linhas: [
      { forma: 'dif', q: 0, s: 2, dc: 100, n1: 3, n2: 2 },
      { forma: 'dif', q: 1, s: 3, dc: 75, n1: 2, n2: 1 },
      { forma: 'dobro', q: 0, s: 2.5, dc: 100, n1: 3, n2: 2 },
      { forma: 'dif', q: 1, s: 1.5, dc: 150, n1: 2, n2: 1 },
      { forma: 'dobro', q: 0, s: 4.5, dc: 75, n1: 2, n2: 1 },
      { forma: 'dif', q: 1, s: 3.5, dc: 50, n1: 3, n2: 4 },
      { forma: 'dobro', q: 0, s: 3, dc: 100, n1: 4, n2: 2 },
      { forma: 'dif', q: 1, s: 2, dc: 50, n1: 3, n2: 2 },
      { forma: 'dobro', q: 0, s: 4, dc: 100, n1: 3, n2: 2 },
      { forma: 'dif', q: 1, s: 4.5, dc: 100, n1: 4, n2: 2 },
      { forma: 'dobro', q: 0, s: 5, dc: 100, n1: 3, n2: 2 },
    ],
  },
  {
    id: 'mat-fa.p8.m', tipo: 'pagina', pagina: 'mat-fa.p8', capitulo: 'mat-fa.c4', formato: 'numero',
    // dir = 1: o terceiro pedido fica uma troca depois do segundo; dir = −1: uma troca antes do primeiro.
    enunciado: 'Dois pedidos numa lanchonete custaram o mesmo valor, R$ {Tt}. O primeiro tinha {x1t}, {y1t} e {z1t}. O segundo tinha {x2t}, {y2t} e {z2t}. Um terceiro pedido, também de R$ {Tt}, terá {y3t} e {z3t}. Quantos pães de queijo ele terá?',
    certa: 'xb + sg*p',
    erros: [
      { expr: 'xb + sg*(p - 2)', falta: '{erroTotalTexto} A troca é por tipo: {p} pães de queijo valem 1 suco e 1 fatia de bolo.', paragrafo: 'mat-fa.p8.b1.s2' },
      { expr: 'xb', falta: 'Parou no {nomeBase} pedido. Dele para o terceiro falta uma troca: {trocaTexto}.', paragrafo: 'mat-fa.p8.b1.s3' },
      { expr: 'xb + 2*sg*p', falta: 'Aplicou a troca uma vez a mais. Do {nomeBase} pedido para o terceiro é uma troca só.', paragrafo: 'mat-fa.p8.b1.s3' },
      { expr: 'xb + sg*p + y3 + z3', falta: 'Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.', paragrafo: 'mat-fa.p8.b2.s4' },
    ],
    explicacao: 'Do primeiro para o segundo pedido entraram {p} pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem {p} pães. {passoTexto}',
    // Preços (P, S, B) só para garantir que a situação existe; não aparecem no enunciado.
    deriva: l => {
      const p = (l.S + l.B) / l.P, x2 = l.x1 + p, y2 = l.y1 - 1, z2 = l.z1 - 1, fr = l.dir > 0;
      const x3 = fr ? l.x1 + 2 * p : l.x1 - p, y3 = fr ? l.y1 - 2 : l.y1 + 1, z3 = fr ? l.z1 - 2 : l.z1 + 1;
      const T = l.x1 * l.P + l.y1 * l.S + l.z1 * l.B;
      const pq = n => plural(n, 'pão de queijo', 'pães de queijo'), su = n => plural(n, 'suco', 'sucos'), fb = n => plural(n, 'fatia de bolo', 'fatias de bolo');
      return { p, sg: fr ? 1 : -1, xb: fr ? x2 : l.x1, x2, y2, z2, x3, y3, z3, pm2: p - 2, T, Tt: reais(T),
        nomeBase: fr ? 'segundo' : 'primeiro',
        erroTotalTexto: fr ? `Somou aos pães do segundo pedido a mudança no total de itens: a cada troca entram ${p} pães e saem 2 itens, o total sobe ${p - 2}, e ${x2} + ${p - 2} = ${x2 + p - 2}.` : `Tirou dos pães do primeiro pedido a mudança no total de itens: a cada troca saem ${p} pães e entram 2 itens, o total cai ${p - 2}, e ${l.x1} − ${p - 2} = ${l.x1 - p + 2}.`,
        trocaTexto: fr ? `saem 1 suco e 1 fatia, entram ${p} pães de queijo` : `saem ${p} pães de queijo, entram 1 suco e 1 fatia`,
        passoTexto: fr ? `O terceiro tem 1 suco e 1 fatia a menos que o segundo: ${x2} + ${p} = ${x3} pães de queijo.` : `O terceiro tem 1 suco e 1 fatia a mais que o primeiro: ${l.x1} − ${p} = ${x3} pães de queijo.`,
        x1t: pq(l.x1), y1t: su(l.y1), z1t: fb(l.z1), x2t: pq(x2), y2t: su(y2), z2t: fb(z2), y3t: su(y3), z3t: fb(z3),
        conferePrecos: [T, x2 * l.P + y2 * l.S + z2 * l.B, x3 * l.P + y3 * l.S + z3 * l.B] };
    },
    linhas: [
      { dir: 1, P: 2, S: 5, B: 7, x1: 4, y1: 3, z1: 3 },
      { dir: -1, P: 2, S: 5, B: 7, x1: 14, y1: 3, z1: 2 },
      { dir: 1, P: 3, S: 5, B: 7, x1: 2, y1: 4, z1: 3 },
      { dir: -1, P: 3, S: 5, B: 7, x1: 10, y1: 2, z1: 3 },
      { dir: 1, P: 2.5, S: 4.5, B: 8, x1: 3, y1: 3, z1: 4 },
      { dir: -1, P: 2.5, S: 4.5, B: 8, x1: 12, y1: 2, z1: 2 },
      { dir: 1, P: 2, S: 4, B: 6, x1: 1, y1: 4, z1: 4 },
      { dir: -1, P: 2, S: 4, B: 6, x1: 11, y1: 3, z1: 2 },
      { dir: 1, P: 1.5, S: 4, B: 5, x1: 2, y1: 5, z1: 3 },
      { dir: -1, P: 1.5, S: 4, B: 5, x1: 13, y1: 2, z1: 3 },
      { dir: 1, P: 2, S: 5, B: 7, x1: 1, y1: 4, z1: 5 },
    ],
  },
  {
    id: 'mat-fa.p8.b2.m', tipo: 'bloco', pagina: 'mat-fa.p8', bloco: 'mat-fa.p8.b2', capitulo: 'mat-fa.c4', formato: 'numero',
    enunciado: 'O elevador de carga de um mercado aguenta, no máximo, o peso de {N} fardos de água. Cada saco de arroz pesa o mesmo que {r} fardos de água. Já há {f} sacos de arroz no elevador. Quantos fardos de água ainda podem entrar?',
    certa: 'N - f*r',
    erros: [
      { expr: 'N', falta: 'Não descontou os {f} sacos de arroz que já estão no elevador.', paragrafo: 'mat-fa.p8.b2.s4' },
      { expr: 'N - f', falta: 'Descontou cada saco como se fosse 1 fardo. Cada saco pesa {r} fardos: {f} × {r} = {fr}.', paragrafo: 'mat-fa.p8.b2.s4' },
      { expr: 'N/r - f', falta: 'Fez a conta em sacos de arroz ({N} ÷ {r} − {f}). A pergunta é quantos fardos de água ainda cabem.', paragrafo: 'mat-fa.p8.b2.s4' },
      { expr: 'N - r', falta: 'Descontou um saco só. São {f} sacos, cada um com o peso de {r} fardos.', paragrafo: 'mat-fa.p8.b2.s4' },
    ],
    explicacao: 'Os {f} sacos pesam o mesmo que {f} × {r} = {fr} fardos. Ainda cabem {N} − {fr} = {resp} fardos de água.',
    deriva: l => ({ fr: l.f * l.r, resp: l.N - l.f * l.r }),
    linhas: [
      { N: 60, r: 4, f: 5 },
      { N: 48, r: 3, f: 6 },
    ],
  },
  {
    id: 'mat-fa.c4.ap', tipo: 'aplicar', pagina: 'mat-fa.p8', capitulo: 'mat-fa.c4', formato: 'numero',
    // q = 0: a pergunta é o caderno; q = 1: é a caneta.
    enunciado: 'Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem {at} e {bt} e custa R$ {T1t}. O kit 2 tem {bct} e {act} e custa R$ {T2t}. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de {umPedido}?',
    certa: '(1 - q)*c + q*k',
    erros: [
      { expr: '(1 - q)*k + q*c', falta: 'Achou o preço {doOutro}. A pergunta é o preço {doPedido}.', paragrafo: 'mat-fa.p8.b2.s4' },
      { expr: '(T1 + T2)/(a + b)', falta: 'Somou os dois kits e dividiu por {ab}. Isso dá caderno + caneta = R$ {somaTexto}, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.', paragrafo: 'mat-fa.p8.b1.s2' },
      { expr: 'T1 - T2', falta: 'Tomou a diferença entre os kits, R$ {difTexto}, como o preço {doPedido}. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.', paragrafo: 'mat-fa.p8.b1.s2' },
      { expr: 'T1/(a + b)', falta: 'Dividiu o kit 1 por {ab} itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.', paragrafo: 'mat-fa.p7.b1.s1' },
    ],
    // A resolução usa só o que as p. 7 e 8 ensinam: subtrair uma condição da outra (p. 8, § 2) e
    // substituir (p. 7, § 4). Por isso todo kit 1 tem 1 caderno a mais e 1 caneta a menos que o kit 2.
    explicacao: 'Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ {difTexto}. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = {difTexto}, ou seja, caderno = caneta + {difTexto}. Substitua no kit 2: {b} × (caneta + {difTexto}) + {a} × caneta = {T2t}, então {ab} × caneta + {bdTexto} = {T2t} e caneta = R$ {kTexto}. Caderno = {kTexto} + {difTexto} = R$ {cTexto}.',
    deriva: l => {
      if (l.a - l.b !== 1 || !(l.c > l.k)) throw new Error('mat-fa.c4.ap: cada linha precisa de a = b + 1 e caderno mais caro que a caneta');
      const T1 = l.a * l.c + l.b * l.k, T2 = l.b * l.c + l.a * l.k;
      return { T1, T2, T1t: reais(T1), T2t: reais(T2), ab: l.a + l.b,
        somaTexto: reais(l.c + l.k), difTexto: reais(T1 - T2), bdTexto: reais(l.b * (T1 - T2)), cTexto: reais(l.c), kTexto: reais(l.k),
        umPedido: l.q ? 'uma caneta' : 'um caderno', doPedido: l.q ? 'da caneta' : 'do caderno', doOutro: l.q ? 'do caderno' : 'da caneta',
        at: plural(l.a, 'caderno', 'cadernos'), bt: plural(l.b, 'caneta', 'canetas'),
        bct: plural(l.b, 'caderno', 'cadernos'), act: plural(l.a, 'caneta', 'canetas') };
    },
    // linha 0 = item da rodada; 1 a 4 = variantes (revisão, Prova, Questão do dia); 5 a 7 = "Refazer com outros números".
    linhas: [
      { q: 0, a: 3, b: 2, c: 12, k: 3 },
      { q: 1, a: 3, b: 2, c: 10, k: 3 },
      { q: 0, a: 2, b: 1, c: 10, k: 4 },
      { q: 1, a: 3, b: 2, c: 8, k: 3 },
      { q: 0, a: 3, b: 2, c: 11, k: 3.5 },
      { q: 1, a: 2, b: 1, c: 13, k: 4 },
      { q: 0, a: 3, b: 2, c: 9, k: 3 },
      { q: 1, a: 2, b: 1, c: 8.5, k: 4 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Questões do Enem: o texto vem do enem.dev (sem adaptar); aqui só o que é da equipe:
// blocos (N:M), modelo ligado, explicação, "o que faltou" de cada alternativa errada,
// a expressão que reproduz o erro (teste de d.6) e o texto alternativo das imagens.
// ---------------------------------------------------------------------------
// Mesmo começo dos textos alternativos dos Caps. 1 e 2 (altLinha e altPontos de gerador.js): ponto e maiúscula.
const ALT = 'Descrição da equipe Prumo. ';

export const QUESTOES = {
  'enem-2019-143': {
    capitulo: 'mat-fa.c3', blocos: ['mat-fa.p5.b1'], modelo: 'mat-fa.p5.m',
    imagens: { 'ef507c14-34a0-479e-a532-193bf38c48ba.png': { arquivo: 'enem-2019-143.png', alt: ALT + 'Gráfico de pontos sobre uma grade. Eixo horizontal: tempo, em minutos, marcado de 5 em 5, de 5 a 30. Eixo vertical: kcal, marcado de 20 em 20, de 20 a 140. Ponto I: 10 minutos e 20 kcal. Ponto II: 15 minutos e 100 kcal. Ponto III: 20 minutos e 120 kcal. Ponto IV: 25 minutos e 100 kcal. Ponto V: 30 minutos e 80 kcal.' } },
    explicacao: 'Taxa é kcal ÷ minutos, ponto a ponto. I: 20 ÷ 10 = 2. II: 100 ÷ 15 ≈ 6,7. III: 120 ÷ 20 = 6. IV: 100 ÷ 25 = 4. V: 80 ÷ 30 ≈ 2,7. A maior taxa é a de II, mesmo com III tendo o maior total.',
    teste: { pontos: { I: { t: 10, k: 20 }, II: { t: 15, k: 100 }, III: { t: 20, k: 120 }, IV: { t: 25, k: 100 }, V: { t: 30, k: 80 } } },
    exprCerta: 'maior(r => r.k / r.t)',
    erradas: {
      A: { exprTeste: 'maior(r => r.t / r.k)', falta: 'Inverteu a divisão: fez minutos ÷ kcal, e a maior conta assim é a de I (10 ÷ 20 = 0,5). Isso mede minutos por kcal; a pergunta é kcal por minuto.', paragrafo: 'mat-fa.p5.b1.s2' },
      C: { exprTeste: 'maior(r => r.k)', falta: 'Escolheu o maior total, 120 kcal. Mas III levou 20 minutos: 120 ÷ 20 = 6 kcal por minuto, menos que os 6,7 de II.', paragrafo: 'mat-fa.p5.b1.s3' },
      D: { exprTeste: 'maior(r => r.k * r.t)', falta: 'Multiplicou kcal por minutos (100 × 25 = 2 500 é o maior produto). Taxa é divisão: 100 ÷ 25 = 4 kcal por minuto.', paragrafo: 'mat-fa.p5.b1.s1' },
      E: { exprTeste: 'maior(r => r.t)', falta: 'Escolheu a atividade mais longa, de 30 minutos. Mais tempo não quer dizer mais gasto por minuto: 80 ÷ 30 ≈ 2,7.', paragrafo: 'mat-fa.p5.b1.s3' },
    },
  },
  'enem-2020-175': {
    capitulo: 'mat-fa.c3', blocos: ['mat-fa.p6.b2'], modelo: 'mat-fa.p6.b2.m',
    imagens: {
      '33aa811b-1dc7-4083-a8c0-2aeeb9fd52d6.png': { arquivo: 'enem-2020-175.png', alt: ALT + 'Gráfico com duas curvas, sobre uma grade tracejada. Eixo horizontal: quantidade de itens produzidos, de 5 em 5, até 30. Eixo vertical: R$, de 5 em 5, de 0 a 55. A curva Receita, mais grossa, começa perto de 5 com 5 itens, sobe até cerca de 50 perto de 25 itens e desce para cerca de 45 com 30 itens. A curva Custo, mais fina, começa perto de 5 com 5 itens, sobe rápido até cerca de 45 com 10 itens, desce até cerca de 10 com 25 itens e sobe para cerca de 35 com 30 itens. As curvas se encontram com 5 itens e se cruzam perto de 15 itens, na altura de 40.' },
      'b3298ba7-589f-4ca3-a510-3cebdb9903cd.png': { arquivo: 'enem-2020-175-a.png', letra: 'A', alt: ALT + 'Gráfico com eixo vertical em R$, de −20 a 40, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, desce até −20 com 10 itens, volta a 0 com 15 itens, sobe até 40 com 25 itens e cai para 10 com 30 itens.' },
      'fdcc74b5-e93d-42c8-9cce-7e018e43eb67.png': { arquivo: 'enem-2020-175-b.png', letra: 'B', alt: ALT + 'Gráfico com eixo vertical em R$, de −40 a 20, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, sobe até cerca de 19 perto de 9 itens, volta a 0 com 15 itens, desce até um pouco abaixo de −40 perto de 24 itens e sobe para −10 com 30 itens.' },
      '8d380a8c-6b10-40a5-bafa-cfe75141c412.png': { arquivo: 'enem-2020-175-c.png', letra: 'C', alt: ALT + 'Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva nunca fica abaixo de 0: começa em 0 com 5 itens, sobe até cerca de 18 perto de 10 itens, volta a 0 com 15 itens, sobe até cerca de 40 perto de 24 itens e cai para 10 com 30 itens.' },
      '5c8b1402-d364-4c5f-beaa-559cb23d0891.png': { arquivo: 'enem-2020-175-d.png', letra: 'D', alt: ALT + 'Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até cerca de 47 perto de 11 itens, desce até 10 com 25 itens e sobe para 35 com 30 itens.' },
      'f718a2fc-7a30-4e17-b4b3-28dfb028a6f5.png': { arquivo: 'enem-2020-175-e.png', letra: 'E', alt: ALT + 'Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até 50 perto de 24 itens e desce um pouco, para 45, com 30 itens.' },
    },
    explicacao: 'Lucro = receita − custo, em cada quantidade. Com 5 itens as curvas se encontram: lucro 0. Entre 5 e 15 itens o custo fica acima: lucro negativo, perto de −20 com 10 itens. Perto de 15 itens elas se cruzam: 0 de novo. Depois a receita fica acima: o lucro chega a cerca de 40 com 25 itens e cai para perto de 10 com 30. Só o gráfico A tem esse desenho.',
    // Leitura das curvas nos pontos 5, 10, 15, 20, 25 e 30, feita nos vetores do PDF oficial (página 29: as
    // curvas são caminhos de Bézier, convertidos pela escala dos rótulos de cada eixo) em 17/11/2026.
    // Tolerância de 3 reais: a leitura de cada alternativa errada não serve para a certa.
    teste: {
      x: [5, 10, 15, 20, 25, 30],
      R: [5.7, 25.3, 39.5, 47.3, 49.9, 45.1],
      C: [5.6, 45, 39.8, 19.7, 10.5, 35.1],
      leitura: {
        A: [-0.2, -20.2, -0.1, 28, 40.3, 9.8], B: [0, 18.3, -0.2, -27.9, -40.6, -10], C: [0.3, 18.3, 1.2, 29.4, 39.4, 9.9],
        D: [5, 46, 37.9, 19.8, 9.9, 34.9], E: [4.8, 26.4, 40.4, 48.2, 49.8, 45],
      },
      tolerancia: 3,
    },
    exprCerta: 'R - C',
    erradas: {
      B: { expr: 'C - R', exprTeste: 'C - R', falta: 'Fez custo − receita, na ordem trocada. Por isso o gráfico sobe onde devia descer: todos os sinais ficam invertidos.', paragrafo: 'mat-fa.p6.b2.s3' },
      C: { expr: 'abs(R - C)', exprTeste: 'abs(R - C)', falta: 'Desenhou a distância entre as curvas, sem sinal. Entre 5 e 15 itens o custo está acima da receita: ali o lucro é negativo, e o gráfico tem de descer abaixo do eixo.', paragrafo: 'mat-fa.p6.b2.s4' },
      D: { expr: 'C', exprTeste: 'C', falta: 'Escolheu o desenho do custo, uma das curvas dadas. O lucro é uma terceira curva: receita menos custo em cada ponto.', paragrafo: 'mat-fa.p6.b2.s3' },
      E: { expr: 'R', exprTeste: 'R', falta: 'Escolheu o desenho da receita. Falta tirar o custo de cada ponto: receita − custo.', paragrafo: 'mat-fa.p6.b2.s3' },
    },
  },
  'enem-2019-179': {
    capitulo: 'mat-fa.c3', blocos: ['mat-fa.p6.b1'], modelo: 'mat-fa.p6.m',
    imagens: { '3c23edf9-5531-4ae5-b328-9b0a6b31fdc1.png': { arquivo: 'enem-2019-179.png', alt: ALT + 'Em cima, gráfico de linha. Eixo horizontal: tempo, em minutos. Eixo vertical: energia, em W·min. A linha liga os pontos (0; 0), (1; 20), (2; 35), (3; 40), (4; 55), (5; 75), (6; 85), (7; 105) e (8; 120). Embaixo, planta baixa da casa com seis cômodos numerados: 1, sala, lâmpada de 20 W, onde fica a entrada; 2, quarto, 13 W; 3, banho, 2 W; 4, suíte, 15 W; 5, banho, 5 W; 6, cozinha, 10 W.' } },
    explicacao: 'No gráfico acumulado, a subida de cada minuto é a potência da lâmpada acesa naquele minuto. As subidas são 20, 15, 5, 15, 20, 10, 20 e 15. Pela planta, 20 W é a sala (1), 15 W a suíte (4), 5 W o banho do cômodo 5 e 10 W a cozinha (6). Sequência: 1 (sala) → 4 (suíte) → 5 (banho) → 4 → 1 → 6 (cozinha) → 1 → 4.',
    teste: { acumulado: [0, 20, 35, 40, 55, 75, 85, 105, 120], potencia: { 1: 20, 2: 13, 3: 2, 4: 15, 5: 5, 6: 10 } },
    exprCerta: 'sequenciaPelasSubidas()',
    erradas: {
      B: { exprTeste: '[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]', esperado: [120, 8, 2], falta: 'Conferiu só o total: as lâmpadas somam 120, igual ao fim do gráfico. Minuto a minuto não bate: no 2º minuto o gráfico sobe 15 (de 20 para 35), e o quarto (2) tem 13 W.', paragrafo: 'mat-fa.p6.b1.s2' },
      C: { exprTeste: '[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]', esperado: [120, 9, 8], falta: 'A sequência tem 9 paradas, mas o gráfico vai até t = 8: são 8 minutos, uma parada por minuto. O último minuto sobe 15 de uma vez (de 105 para 120): é uma lâmpada só, de 15 W, e não 13 + 2.', paragrafo: 'mat-fa.p6.b1.s2' },
      D: { exprTeste: '[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]', esperado: [120, 9, 2], falta: 'São 9 paradas (uma por minuto) para 8 minutos. O 2º minuto sobe 15 de uma vez (de 20 para 35): é a suíte, de 15 W, e não o quarto (2) e o banho (3) em dois minutos (13 + 2).', paragrafo: 'mat-fa.p6.b1.s2' },
      E: { exprTeste: '[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]', esperado: [120, 9, 3], falta: 'São 9 paradas (uma por minuto) para 8 minutos. No 3º e no 4º minutos o gráfico sobe 5 e depois 15, 20 no total; a sequência põe ali três cômodos, 13 + 2 + 5 = 20, no lugar de dois.', paragrafo: 'mat-fa.p6.b1.s2' },
    },
  },
  'enem-2021-164': {
    capitulo: 'mat-fa.c4', blocos: ['mat-fa.p8.b1', 'mat-fa.p8.b2'], modelo: 'mat-fa.p8.m',
    imagens: { 'eab2c90e-a45f-482b-997d-a5c2f6931726.png': { arquivo: 'enem-2021-164.png', alt: ALT + 'Tabela com as colunas Viagem, Camisetas, Calças e Sapatos. Viagem I: 12 camisetas, 4 calças e 3 sapatos. Viagem II: 18 camisetas, 3 calças e 2 sapatos.' } },
    explicacao: 'Da viagem I para a II entraram 6 camisetas e saíram 1 calça e 1 sapato, e a massa continuou 10 kg: 1 calça + 1 sapato pesam o mesmo que 6 camisetas. A mala nova tem 2 calças e 1 sapato, ou seja, 1 calça e 1 sapato a menos que na viagem II. Mais uma troca: 18 + 6 = 24 camisetas. Pela viagem I dá o mesmo: tirar 2 calças e 2 sapatos libera 12 camisetas, e 12 + 12 = 24.',
    teste: {},
    exprCerta: '18 + (18 - 12)',
    erradas: {
      A: { expr: '18 + ((18 + 3 + 2) - (12 + 4 + 3))', falta: 'Contou o total de peças: da viagem I para a II ele sobe 4 (de 19 para 23), e 18 + 4 = 22. A troca é por tipo: entram 6 camisetas no lugar de 1 calça e 1 sapato.', paragrafo: 'mat-fa.p8.b1.s2' },
      C: { expr: '18 + (18 - 12) + 2', falta: 'Achou as 24 camisetas e somou as 2 calças, como se a pergunta fosse de peças de roupa: 24 + 2 = 26. A pergunta é só de camisetas.', paragrafo: 'mat-fa.p8.b2.s4' },
      D: { expr: '12 + 3*(4 + 3)', falta: 'Contou cada calça e cada sapato como 3 camisetas (metade da troca de 6, o que a questão não garante) e trocou as 7 peças da viagem I: 12 + 7 × 3 = 33. A mala nova ainda leva 2 calças e 1 sapato: parta da viagem II e faça uma troca só.', paragrafo: 'mat-fa.p8.b2.s4' },
      E: { expr: '18 + 3*(4 + 3)', falta: 'Misturou as viagens: às 18 camisetas da II somou as 4 calças e os 3 sapatos da I, contando cada peça como 3 camisetas (metade da troca de 6): 18 + 7 × 3 = 39. Parta de uma viagem só e faça a troca uma vez.', paragrafo: 'mat-fa.p8.b1.s3' },
    },
  },
  'enem-2023-175': {
    capitulo: 'mat-fa.c4', blocos: ['mat-fa.p7.b1'], modelo: 'mat-fa.p7.m',
    imagens: {},
    explicacao: 'Chame de a o valor, em reais, de cada tíquete azul, e de v o de cada tíquete vermelho. Cada cartela tem 9 tíquetes. Duas cartelas azuis e uma vermelha: 18a + 9v = 32,40, então 2a + v = 3,60. A frase da diferença: a − v = v + 0,05, ou seja, a = 2v + 0,05. Substituindo: 2(2v + 0,05) + v = 3,60, então 5v + 0,10 = 3,60 e v = 0,70. A cartela vermelha custa 9 × 0,70 = R$ 6,30. Confere: a = 1,45 e 18 × 1,45 + 9 × 0,70 = 26,10 + 6,30 = 32,40.',
    teste: {},
    exprCerta: '9*((3.60 - 2*0.05)/5)',
    erradas: {
      A: { expr: '9*((3.60 - 2*0.50)/5)', falta: 'Leu cinco centavos como R$ 0,50. Cinco centavos são R$ 0,05.', paragrafo: 'mat-fa.p7.b1.s3' },
      C: { expr: '9*((3.60 - 0.50)/3)', falta: 'Contou uma cartela azul só e leu cinco centavos como R$ 0,50. São duas cartelas azuis, e cinco centavos são R$ 0,05.', paragrafo: 'mat-fa.p7.b1.s3' },
      D: { expr: '9*((3.60 - 2*0.05)/3)', falta: 'Leu como “azul = vermelho + 5 centavos”. A frase diz azul − vermelho = vermelho + 0,05, ou seja, azul = 2 × vermelho + 0,05.', paragrafo: 'mat-fa.p7.b1.s2' },
      E: { expr: '9*((3.60 - 0.05)/3)', falta: 'Contou uma cartela azul só. A compra tem duas cartelas azuis e uma vermelha.', paragrafo: 'mat-fa.p7.b1.s3' },
    },
  },
};
