// Prumo · caderno "Funções afins" (Matemática) · Caps. 1 e 2 (págs. 1 a 4), Corte A (g.2).
//
// Formato de cada capítulo (esquema e.2 da especificação, mais os cards da Decisão 1 do dono):
//   { id, n, titulo, habilidades, prereq, paginas[2], rodada[ids, b crescente], reserva[ids],
//     irAlem[links], cards[6 a 8], modelos[...], questoes[...] }
// "modelos" e "questoes" vêm dentro do capítulo; conteudo/mat-fa.js os junta em pack.modelos e
// pack.questoes e gera as variantes de cada modelo (conteudo/gerador.js).
//   página  { id, n, capitulo, titulo, modelo, nucleo, notaPrompt, blocos[], credito, fonte? }
//   bloco   { id, prePergunta?, paragrafos[{ id, n (§), html (só texto em linha), figura? }] }
//   figura  { tipo: 'svg' | 'tabela', html (bloco para pôr depois do parágrafo), src?, alt?, altFonte?, legenda }
//   modelo  { id, tipo: 'pagina' | 'bloco', pagina, bloco, formato: 'linear' | 'numero', variavel?, saida?,
//             enunciado (HTML com {variáveis} e {FIGURA}), certa (expr), erros[4 a 6]{ expr, falta, paragrafo },
//             explicacao, linhas[11 ou 2], grafico?, ligadaA[ids do Enem], licenca, credito }
//             Com mais de 4 erros, cada linha diz quais 4 usa (linha.erros = índices em modelo.erros); assim a
//             posição da certa muda de uma linha para outra (as alternativas vão em ordem crescente).
//             Os modelos saem por compatibilizar() (gerador.js): cada linha já traz os valores calculados,
//             para Pack.variante() de js/nucleo/pack.js gerar a mesma variante que o gerador.
//   questão { campos do INEP (gerados em mat-fa-c12-enem.js) + capitulo, papel, blocos, modelo,
//             explicacao, alternativas[].{ falta, expr, paragrafo } nas erradas, autoria }
//   card    { id, tipo, frente (até 14 palavras), verso (até 25), bloco, paragrafo, autoria }
//
// Texto, modelos, explicações, "o que faltou" e cards: rascunho por IA (Claude Opus 5.5), revisão
// pendente; licença CC BY-SA 4.0. O texto das questões do Enem é do INEP (CC BY-ND 3.0), sem adaptação.
import { AUTORIA_IA, svgLinha, svgPontos, altLinha, altPontos, compatibilizar, contasJuntas, reaisJuntos } from './gerador.js';
import { ENEM_C12 } from './mat-fa-c12-enem.js';

const AUT = AUTORIA_IA;
const CRED = { fonte: 'Equipe Prumo', licenca: 'CC BY-SA 4.0', autoria: AUT };
const LIC_ENEM = 'CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)';
const LIC_ENEM_URL = 'https://creativecommons.org/licenses/by-nd/3.0/legalcode';

// "Ir além": fora da missão (leitor do Caderno e cartão de erro), em nova aba (g.2).
// Unidade 3 (2º Bimestre) do curso da Khan para a 1ª série do Ensino Médio de SP, conferida em 17/11/2026
// (anexos/khan/2026-11-17_khan-curso-1a-serie-mat-sp.pdf): traz "Lei de Formação da Função Afim",
// "Gráfico de função afim" e "Relação entre grandezas: representação gráfica". O rótulo diz o que o
// capítulo encontra lá, e não promete "a mesma matéria".
const KHAN_BASE = {
  tipo: 'khan',
  url: 'https://pt.khanacademy.org/math/1-serie-em-mat-sp/x82b03a9b6c8af113:2-bimestre-2026',
  aviso: 'Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org. O Prumo não é oficial nem endossado pela Khan Academy.',
  conferidoEm: '2026-11-17',
};
const KHAN_C1 = { ...KHAN_BASE, rotulo: 'Lei de formação da função afim, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 3, 2º Bimestre)' };
const KHAN_C2 = { ...KHAN_BASE, rotulo: 'Gráficos de relação entre grandezas, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 3, 2º Bimestre)' };
const OBMEP = {
  tipo: 'obmep', rotulo: 'Portal da OBMEP: módulo Função Afim (videoaulas e exercícios)',
  url: 'https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=35',
  aviso: 'Abre o Portal da OBMEP (IMPA) em outra aba. O Prumo só aponta o link; o conteúdo do portal não é copiado.',
  conferidoEm: '2026-11-17',
};

// O texto do parágrafo passa por contasJuntas (gerador.js): a quebra de linha não cai no meio de uma conta.
const p = (id, n, texto, figura) => { const html = contasJuntas(texto); return figura ? { id, n, html, figura } : { id, n, html }; };

// ------------------------------------------------------------------ figuras do texto
const G_VEL = { xMax: 20, xPasso: 2, xRotulo: 2, yMin: 0, yMax: 50, yPasso: 10,
  yTitulo: 'Velocidade (km/h)', xTitulo: 'Tempo (min)', xDescricao: 'tempo, em minuto', yDescricao: 'velocidade, em km/h' };
const S_VEL = [[0, 20], [2, 30], [6, 40], [10, 40], [12, 0], [16, 0], [20, 30]];
const ALT_VEL = altLinha(S_VEL, G_VEL);

const G_TEMP = { xMax: 24, xPasso: 1, xRotulo: 2, yMin: 16, yMax: 32, yPasso: 2, yRotulo: 4, refUnidade: ' °C',
  yTitulo: 'Temperatura (°C)', xTitulo: 'Hora', xDescricao: 'hora do dia', yDescricao: 'temperatura, em °C' };
const S_TEMP = [[0, 20], [4, 18], [7, 21], [10, 25], [12, 29], [14, 28], [15, 25], [17, 22], [19, 25], [20, 27], [21, 25], [24, 21]];
const ALT_TEMP = altLinha(S_TEMP, G_TEMP, { ref: 25 });

const G_AB = { min: 0, max: 5, passo: 1, rotulo: 1, ligar: true,
  xTitulo: 'Valor de A', yTitulo: 'Valor de B', xDescricao: 'valor de A', yDescricao: 'valor de B' };
const P_AB = [{ rotulo: '8 h', x: 4, y: 1, pos: 'd' }, { rotulo: '9 h', x: 3, y: 3, pos: 'e' },
  { rotulo: '10 h', x: 1.5, y: 4, pos: 'c' }, { rotulo: '11 h', x: 4.5, y: 3.5, pos: 'b' }];
const ALT_AB = altPontos(P_AB, G_AB, { diagonal: true });

const TABELA_TAXI = '<table class="tabela-equipe"><caption>Tabela 1. Cada km a mais soma R$&nbsp;3. Em 0&nbsp;km, o preço é só a bandeirada de R$&nbsp;6.</caption>'
  + '<thead><tr><th scope="col">Distância (km)</th><th scope="col">Conta</th><th scope="col">Preço (R$)</th></tr></thead><tbody>'
  + [0, 1, 2, 3, 4].map(x => `<tr><td>${x}</td><td>3 × ${x} + 6</td><td>${3 * x + 6}</td></tr>`).join('')
  + '</tbody></table>';

// ------------------------------------------------------------------ páginas
const P1 = {
  id: 'mat-fa.p1', n: 1, capitulo: 'mat-fa.c1', titulo: 'Um preço com duas partes',
  modelo: 'mat-fa.p1.m', nucleo: 'mat-fa.p1.b1',
  notaPrompt: 'Com suas palavras: por que a bandeirada não multiplica pelos km?',
  // fonte (e.2): é dela que Pack.creditos() lê a autoria da página; sem ela, os créditos diriam "autoria não registrada".
  credito: CRED, fonte: CRED,
  blocos: [
    { id: 'mat-fa.p1.b1', paragrafos: [
      p('mat-fa.p1.b1.s1', 1, 'Pense numa corrida de táxi. Antes de o carro sair do lugar, o taxímetro já mostra um valor: é a <strong>bandeirada</strong>. Imagine um táxi com bandeirada de R$ 6. Você paga esses R$ 6 uma vez só, seja a corrida de 1 km, seja de 20 km. Por isso a bandeirada é a <strong>parte fixa</strong> do preço.'),
      p('mat-fa.p1.b1.s2', 2, 'O resto do preço depende da distância. Se o táxi cobra R$ 3 por quilômetro, cada quilômetro a mais soma R$ 3. Numa corrida de x quilômetros, essa parte custa 3 × x, que se escreve 3x. Ela é a <strong>parte que varia</strong>. O preço total P junta as duas: <strong>P = 3x + 6</strong>. Repare: só o 3 multiplica o x. O 6 entra uma vez, somado no fim.'),
    ] },
    { id: 'mat-fa.p1.b2', paragrafos: [
      p('mat-fa.p1.b2.s3', 3, 'Veja a mesma corrida em números: 0 km custa R$ 6 (você entrou e desistiu); 1 km, R$ 9; 2 km, R$ 12; 3 km, R$ 15; 4 km, R$ 18. Cada quilômetro soma sempre os mesmos R$ 3. Isso dá um jeito rápido de conferir uma fórmula: em x = 0, ela tem de dar só a parte fixa; em x = 1, a parte fixa mais uma unidade.',
        { tipo: 'tabela', html: TABELA_TAXI, legenda: 'Tabela 1. Cada km a mais soma R$ 3. Em 0 km, o preço é só a bandeirada de R$ 6.' }),
    ] },
  ],
};

const P2 = {
  id: 'mat-fa.p2', n: 2, capitulo: 'mat-fa.c1', titulo: 'Da frase para a fórmula',
  modelo: 'mat-fa.p2.m', nucleo: 'mat-fa.p2.b1',
  notaPrompt: 'Com suas palavras: como saber, pela frase, o que fica somado e o que multiplica?',
  credito: CRED,
  fonte: {
    fonte: 'Wikilivros, Matemática elementar/Função afim', revisao: '263886 (29/10/2013)',
    url: 'https://pt.wikibooks.org/w/index.php?oldid=263886',
    historico: 'https://pt.wikibooks.org/w/index.php?title=Matem%C3%A1tica_elementar/Fun%C3%A7%C3%A3o_afim&action=history',
    licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt',
    texto: 'Adaptado de Matemática elementar/Função afim, Wikilivros, revisão 263886 (29/10/2013), pt.wikibooks.org/w/index.php?oldid=263886. Autores: ver o histórico da página. CC BY-SA 3.0 (creativecommons.org/licenses/by-sa/3.0/deed.pt). Adaptação da equipe Prumo em CC BY-SA 4.0.',
    alteracoes: 'Texto reescrito em parágrafos curtos, exemplos trocados, notação simplificada. Da página-base ficaram a forma y = ax + b e os nomes coeficiente angular e coeficiente linear.',
    autoria: AUT,
  },
  blocos: [
    { id: 'mat-fa.p2.b1', paragrafos: [
      p('mat-fa.p2.b1.s1', 1, 'Todo preço com uma parte fixa e uma parte por unidade cabe num molde: <strong>y = ax + b</strong>. Isso é uma <strong>função afim</strong>. O número a é a taxa de variação: quanto y muda a cada unidade a mais de x. O número b é o valor de y quando x = 0, o ponto de partida. No táxi da página anterior, a = 3 (reais por km) e b = 6 (a bandeirada). Nos livros, a se chama coeficiente angular, e b, coeficiente linear.'),
      p('mat-fa.p2.b1.s2', 2, 'No enunciado, algumas palavras mostram o lugar de cada número. “Fixo”, “só uma vez”, “de entrada” e “de instalação” apontam para o b, que fica somado. “Por”, “a cada”, “por unidade” e “por dia” apontam para o a, que multiplica o x. Cuidado com a palavra “taxa” sozinha: uma taxa de entrega ou de instalação costuma ser cobrada uma vez só. Quem decide é o “por”, ou o preço de uma unidade (“o metro cúbico custa…”).'),
      p('mat-fa.p2.b1.s3', 3, 'Agora, confira quem entra na conta. Uma escola leva x pessoas a uma feira de ciências: a professora e os alunos. A escola paga R$ 150 fixos à professora pela viagem e R$ 20 de lanche por dia a cada aluno, durante 2 dias, ou seja, 2 × 20 = R$ 40 por aluno. Como x conta todo mundo, os alunos são <strong>x − 1</strong>. O gasto total da escola é y = 40(x − 1) + 150 = 40x + 110. Usar x no lugar de x − 1 é contar a professora como aluna.'),
    ] },
    { id: 'mat-fa.p2.b2', prePergunta: 'mat-fa.p2.b2.m', paragrafos: [
      p('mat-fa.p2.b2.s4', 4, 'Porcentagem também vira fórmula. Calcular p% de uma quantidade é multiplicar por p/100. Se 40% dos A alunos de uma escola vão de ônibus, eles são <strong>0,4A</strong>, e os outros 60% são 0,6A. Fique de olho em dois enganos: escrever 40A (sem dividir por 100) ou usar a parte que sobra. E, quando a porcentagem vale só para uma parte do preço, multiplique só essa parte: 10% de serviço sobre a comida c, com entrega fixa de R$ 8, dá c + 0,1c + 8.'),
    ] },
  ],
};

const P3 = {
  id: 'mat-fa.p3', n: 3, capitulo: 'mat-fa.c2', titulo: 'O que cada ponto diz',
  modelo: 'mat-fa.p3.m', nucleo: 'mat-fa.p3.b2',
  notaPrompt: 'Com suas palavras: num gráfico de velocidade, qual a diferença entre um trecho horizontal fora do zero e um trecho em zero?',
  // fonte (e.2): é dela que Pack.creditos() lê a autoria da página; sem ela, os créditos diriam "autoria não registrada".
  credito: CRED, fonte: CRED,
  blocos: [
    { id: 'mat-fa.p3.b1', paragrafos: [
      p('mat-fa.p3.b1.s1', 1, 'Antes de qualquer conta, leia os eixos. Em quase todo gráfico de linha, o eixo horizontal é o tempo, e o vertical é a grandeza que muda: temperatura, velocidade, preço. Confira a unidade de cada eixo (minuto ou hora? km/h ou m/s?) e de quanto em quanto a escala anda: de 1 em 1, de 2 em 2, de 5 em 5.'),
      p('mat-fa.p3.b1.s2', 2, 'Cada ponto da linha é um par: um instante e um valor. Para ler um ponto, desça dele até o eixo do tempo para achar o instante; depois, do mesmo ponto, vá para o lado até o eixo vertical para achar o valor. Num gráfico da velocidade de um ônibus, o ponto (8; 40) quer dizer que, aos 8 minutos, o ônibus estava a 40 km/h.'),
    ] },
    { id: 'mat-fa.p3.b2', paragrafos: [
      p('mat-fa.p3.b2.s3', 3, 'Muitas questões perguntam “por quanto tempo”. A resposta é uma duração: <strong>instante do fim menos instante do começo</strong>. Se a velocidade ficou em 40 km/h dos 6 aos 10 minutos, isso durou 10 − 6 = 4 minutos. Não conte as linhas da grade: de 6 a 10, de 2 em 2, há três marcas (6, 8 e 10), mas o trecho dura 4 minutos.'),
      p('mat-fa.p3.b2.s4', 4, 'Dois tipos de trecho pedem atenção. No <strong>trecho horizontal fora do zero</strong>, a grandeza ficou constante: não subiu nem desceu. O <strong>trecho em zero</strong> também é horizontal, mas ali ela valia zero. Num gráfico de velocidade, isso muda tudo: horizontal em 40 km/h quer dizer que o ônibus andava sem mudar a velocidade; parado é só o trecho em zero. Se mais de um trecho responde à pergunta, calcule a duração de cada um e some.',
        { tipo: 'svg', html: `<figure class="grafico-equipe">${svgLinha(S_VEL, G_VEL, { alt: ALT_VEL, sombrear: [[12, 16]] })}</figure>`,
          src: 'conteudo/img/mat-fa-p3-s4.svg', alt: ALT_VEL, altFonte: 'equipe',
          legenda: 'Dos 6 aos 10 min, o ônibus anda a 40 km/h constantes (trecho horizontal). Dos 12 aos 16 min, a velocidade é zero: ele está parado (faixa destacada) por 16 − 12 = 4 minutos.' }),
    ] },
  ],
};

const P4 = {
  id: 'mat-fa.p4', n: 4, capitulo: 'mat-fa.c2', titulo: 'Acima de, abaixo de',
  modelo: 'mat-fa.p4.m', nucleo: 'mat-fa.p4.b1',
  notaPrompt: 'Com suas palavras: como saber, num gráfico, por quanto tempo algo ficou acima de um limite?',
  // fonte (e.2): é dela que Pack.creditos() lê a autoria da página; sem ela, os créditos diriam "autoria não registrada".
  credito: CRED, fonte: CRED,
  blocos: [
    { id: 'mat-fa.p4.b1', paragrafos: [
      p('mat-fa.p4.b1.s1', 1, 'Muitos gráficos trazem uma <strong>linha de referência</strong>: um limite, uma meta, um valor que importa. Pense numa linha tracejada em 25 °C num gráfico de temperatura. Onde a curva está acima da linha, fez mais de 25 °C; abaixo, menos. Os instantes em que a curva cruza a linha são as fronteiras. Anote cada um.'),
      p('mat-fa.p4.b1.s2', 2, 'Para saber por quanto tempo a curva ficou acima da linha, separe os trechos. Cada trecho começa quando a curva cruza a linha subindo e termina quando cruza descendo. Se a curva já começa acima da linha, o trecho começa no início do gráfico; se termina acima, vai até o fim. Faça fim − começo em cada um e <strong>some todos</strong>. Se um dia ficou acima de 25 °C das 10 h às 15 h e das 19 h às 21 h, foram 5 + 2 = 7 horas. A pergunta pede horas: não pare no maior trecho, nem conte quantos trechos são.',
        { tipo: 'svg', html: `<figure class="grafico-equipe">${svgLinha(S_TEMP, G_TEMP, { ref: 25, alt: ALT_TEMP, sombrear: [[10, 15], [19, 21]] })}</figure>`,
          src: 'conteudo/img/mat-fa-p4-s2.svg', alt: ALT_TEMP, altFonte: 'equipe',
          legenda: 'Acima de 25 °C das 10 h às 15 h e das 19 h às 21 h (faixas destacadas): 5 + 2 = 7 horas.' }),
    ] },
    { id: 'mat-fa.p4.b2', prePergunta: 'mat-fa.p4.b2.m', paragrafos: [
      p('mat-fa.p4.b2.s3', 3, 'Às vezes o gráfico mostra duas grandezas ao mesmo tempo, como a temperatura de duas cidades. O jeito seguro é comparar <strong>instante a instante</strong>: escolha um horário, leia o valor de cada uma e veja qual é maior. Quando as duas aparecem como curvas sobre o mesmo eixo do tempo, a curva mais alta naquele horário é a maior.'),
      p('mat-fa.p4.b2.s4', 4, 'Há gráficos em que cada eixo traz uma grandeza e o horário vem escrito ao lado do ponto. Aí, cada ponto é um par (A; B), com A no eixo horizontal e B no vertical, e A é maior quando o primeiro número passa o segundo. Um atalho: imagine a diagonal em que A = B. Os pontos abaixo dela têm A maior; os acima dela, B maior; os que ficam exatamente na diagonal são empate. E não confunda “A maior que B” com “A subiu desde o horário anterior”.',
        { tipo: 'svg', html: `<figure class="grafico-equipe">${svgPontos(P_AB, G_AB, { alt: ALT_AB, diagonal: 'A = B' })}</figure>`,
          src: 'conteudo/img/mat-fa-p4-s4.svg', alt: ALT_AB, altFonte: 'equipe',
          legenda: 'Abaixo da diagonal (8 h e 11 h), A é maior; na diagonal (9 h), empate; acima dela (10 h), B é maior.' }),
    ] },
  ],
};

// ------------------------------------------------------------------ modelos da equipe
// Estrutura matemática da questão do INEP ligada, com contexto e redação próprios (e.1, e.3).
const M_P1 = {
  id: 'mat-fa.p1.m', tipo: 'pagina', pagina: 'mat-fa.p1', bloco: 'mat-fa.p1.b1', ligadaA: ['enem-2023-162', 'enem-2021-141'],
  formato: 'linear', variavel: 'x', saida: 'V',
  enunciado: '<p>{quem} cobra R$ {F} {fixo} e mais R$ {v} por {unidade}.</p><p>Qual expressão dá o valor V, em reais, {pedido}?</p>',
  certa: 'v*x+F',
  erros: [
    { expr: 'v*x', falta: 'Esqueceu a parte fixa: os R$ {F} {fixo} entram uma vez, somados.', paragrafo: 'mat-fa.p1.b1.s1' },
    { expr: 'F*x', falta: 'Multiplicou a parte fixa (R$ {F}) por x e deixou de fora os R$ {v} por {unidade}.', paragrafo: 'mat-fa.p1.b1.s1' },
    { expr: '(F+v)*x', falta: 'Somou as duas partes e multiplicou tudo por x. Só os R$ {v} por {unidade} multiplicam x.', paragrafo: 'mat-fa.p1.b1.s2' },
    { expr: 'F*x+v', falta: 'Trocou os papéis: quem multiplica x são os R$ {v} por {unidade}; os R$ {F} {fixo} ficam somados.', paragrafo: 'mat-fa.p1.b1.s2' },
    { expr: 'v*(x-1)+F', falta: 'Usou x − 1, como se os R$ {F} {fixo} já incluíssem 1 {unidade}. Não incluem: todas as x unidades são cobradas, a R$ {v} cada, e a parte fixa vem somada.', paragrafo: 'mat-fa.p1.b1.s1' },
  ],
  // Cada linha usa 4 dos 5 erros (linha.erros). Em ordem crescente de coeficiente, a certa (vx + F) fica
  // depois de vx; quando v < F, também depois de v(x − 1) + F, o erro de achar que a parte fixa já paga
  // 1 unidade (como quem pensa que a bandeirada inclui o 1º km). Assim a certa cai em B, C ou D.
  // A e E pediriam um 5º erro com coeficiente maior que o da certa e termo independente maior (v(x + F),
  // que dá "60x + 4800") ou um erro sem x ("V = 140"): artificiais, ficaram de fora.
  explicacao: 'Os R$ {F} {fixo} entram uma vez; os R$ {v} por {unidade} multiplicam x. Por isso, {CERTA}.',
  linhas: [
    { quem: 'Um eletricista', F: 80, fixo: 'pela visita', v: 60, unidade: 'hora de trabalho', pedido: 'de um serviço de x horas', erros: [0, 1, 2, 3] },
    { quem: 'Uma locadora de carros', F: 30, fixo: 'pela lavagem na devolução', v: 120, unidade: 'dia de aluguel', pedido: 'de x dias de aluguel', erros: [0, 1, 2, 3] },
    { quem: 'Uma academia de bairro', F: 50, fixo: 'de matrícula', v: 90, unidade: 'mês', pedido: 'de x meses de treino', erros: [0, 1, 2, 3] },
    { quem: 'Um estacionamento', F: 12, fixo: 'pela entrada', v: 5, unidade: 'hora', pedido: 'para x horas', erros: [0, 4, 2, 3] },
    { quem: 'Uma empresa de internet', F: 150, fixo: 'pela instalação', v: 100, unidade: 'mês', pedido: 'de x meses de serviço', erros: [0, 1, 2, 3] },
    { quem: 'Uma empresa de limpeza', F: 20, fixo: 'pela visita de orçamento', v: 150, unidade: 'dia de faxina', pedido: 'de x dias de faxina', erros: [0, 1, 2, 3] },
    { quem: 'Uma locadora de bicicletas', F: 10, fixo: 'pelo cadastro', v: 4, unidade: 'hora de uso', pedido: 'para x horas de uso', erros: [0, 4, 2, 3] },
    { quem: 'Um bufê infantil', F: 400, fixo: 'pelo aluguel do salão', v: 35, unidade: 'convidado', pedido: 'de uma festa com x convidados', erros: [0, 1, 2, 3] },
    { quem: 'Uma escola de idiomas', F: 120, fixo: 'pelo material', v: 180, unidade: 'mês', pedido: 'de x meses de curso', erros: [0, 1, 2, 3] },
    { quem: 'Um fotógrafo', F: 200, fixo: 'pelo deslocamento', v: 15, unidade: 'foto editada', pedido: 'de x fotos editadas', erros: [0, 4, 2, 3] },
    { quem: 'Um professor particular', F: 25, fixo: 'pelo material', v: 60, unidade: 'aula', pedido: 'de x aulas', erros: [0, 1, 2, 3] },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

const M_P2 = {
  id: 'mat-fa.p2.m', tipo: 'pagina', pagina: 'mat-fa.p2', bloco: 'mat-fa.p2.b1', ligadaA: ['enem-2019-168'],
  formato: 'linear', variavel: 'X', saida: 'Y',
  enunciado: '<p>Um grupo de X pessoas viaja {destino}. Uma dessas X pessoas é {quem}, que recebe R$ {F} fixos pelo trabalho e não paga {item}. Cada uma das outras paga R$ {v} de {item} por dia, durante {d} dias.</p><p>Qual expressão dá o gasto total Y da viagem, em reais?</p>',
  certa: 'd*v*(X-1)+F',
  erros: [
    { expr: 'v*(X-1)+F', falta: 'Esqueceu que cada pessoa paga {item} durante {d} dias: por pessoa, são {d} × R$ {v} = R$ {=d*v}.', paragrafo: 'mat-fa.p2.b1.s3' },
    { expr: 'd*v*X+F', falta: 'Contou {quem} entre os que pagam {item}. Quem paga são X − 1 pessoas.', paragrafo: 'mat-fa.p2.b1.s3' },
    { expr: 'v*X+F', falta: 'Esqueceu os {d} dias e ainda contou {quem} entre os que pagam.', paragrafo: 'mat-fa.p2.b1.s3' },
    { expr: 'v*(X+1)+F', falta: 'Esqueceu os {d} dias e somou {quem} aos pagantes em vez de tirar: são X − 1, não X + 1.', paragrafo: 'mat-fa.p2.b1.s3' },
    { expr: 'd*v*(X+1)+F', falta: 'Somou {quem} aos que pagam {item} em vez de tirar: são X − 1, não X + 1.', paragrafo: 'mat-fa.p2.b1.s3' },
    { expr: 'd*v*(X-1)+d*F', falta: 'Multiplicou pelos {d} dias os R$ {F} que {quem} recebe: esse valor é fixo e entra uma vez, somado.', paragrafo: 'mat-fa.p2.b1.s2' },
  ],
  // Cada linha usa 4 dos 6 erros (índices acima). A certa fica logo depois dos erros de coeficiente v
  // (erros 0, 2 e 3): com 1 deles ela é B, com 2 é C, com 3 é D. A linha 0 é o exemplo de e.3 (D).
  explicacao: 'Quem paga são X − 1 pessoas ({quem} fica de fora), e cada uma paga {d} × {v} = {=d*v}. Y = {=d*v}(X − 1) + {F}, ou seja, {CERTA}.',
  linhas: [
    { destino: 'para um parque aquático', quem: 'a motorista da van', F: 900, item: 'ingresso', v: 70, d: 3, erros: [0, 1, 2, 3] },
    { destino: 'para uma praia do litoral', quem: 'o motorista do ônibus', F: 800, item: 'hospedagem', v: 90, d: 2, erros: [0, 2, 1, 4] },
    { destino: 'para um torneio de vôlei', quem: 'o técnico', F: 600, item: 'hospedagem', v: 50, d: 4, erros: [0, 1, 4, 5] },
    { destino: 'para um festival de música', quem: 'a produtora', F: 500, item: 'alimentação', v: 40, d: 2, erros: [2, 3, 1, 5] },
    { destino: 'para uma mostra de teatro', quem: 'a professora', F: 300, item: 'pousada', v: 60, d: 3, erros: [0, 2, 3, 4] },
    { destino: 'para um acampamento', quem: 'o guia', F: 450, item: 'taxa de camping', v: 25, d: 4, erros: [3, 1, 4, 5] },
    { destino: 'para uma olimpíada de robótica', quem: 'o orientador', F: 700, item: 'hotel', v: 120, d: 2, erros: [0, 3, 1, 5] },
    { destino: 'para um encontro de corais', quem: 'a regente', F: 400, item: 'almoço', v: 30, d: 3, erros: [2, 1, 4, 5] },
    { destino: 'para uma trilha num parque estadual', quem: 'o guia', F: 350, item: 'taxa do parque', v: 20, d: 3, erros: [0, 2, 3, 1] },
    { destino: 'para os Jogos Escolares', quem: 'a técnica', F: 800, item: 'hospedagem', v: 55, d: 4, erros: [0, 3, 4, 5] },
    { destino: 'para Porto Seguro, na excursão de formatura', quem: 'o fotógrafo', F: 550, item: 'passeio', v: 85, d: 2, erros: [2, 1, 4, 5] },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

const M_P2B2 = {
  id: 'mat-fa.p2.b2.m', tipo: 'bloco', pagina: 'mat-fa.p2', bloco: 'mat-fa.p2.b2', ligadaA: ['enem-2023-150', 'enem-2021-141'],
  formato: 'linear', variavel: 'V', saida: 'P',
  enunciado: '<p>Num {mistura}, {p}% do volume é {parte}.</p><p>Para fazer V litros desse {mistura}, qual expressão dá o volume P de {parte}, em litros?</p>',
  certa: 'p/100*V',
  erros: [
    { expr: '(1-p/100)*V', falta: 'Usou a parte que não é {parte} ({=100-p}%). A pergunta pede os {p}%.', paragrafo: 'mat-fa.p2.b2.s4' },
    { expr: 'p*V', falta: 'Usou {p} no lugar de {p}%. Porcentagem divide por 100: {p}% = {=p/100}.', paragrafo: 'mat-fa.p2.b2.s4' },
    { expr: 'V-(100-p)', falta: 'Tirou {=100-p} do volume, como se os {=100-p}% que não são {parte} fossem {=100-p} litros. Porcentagem multiplica: {p}% de V é {=p/100} × V.', paragrafo: 'mat-fa.p2.b2.s4' },
    { expr: '1-(1-p/100)*V', falta: 'Partiu de 1 como se fosse o todo e tirou a parte que não é {parte}. O todo aqui é V.', paragrafo: 'mat-fa.p2.b2.s4' },
  ],
  explicacao: '{p}% é {p}/100 = {=p/100}. A parte de {parte} é {=p/100} × V, ou seja, {CERTA}.',
  linhas: [
    { mistura: 'suco', p: 30, parte: 'polpa de fruta' },
    { mistura: 'refresco', p: 60, parte: 'água' },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

// Gráficos gerados: a resposta certa e cada erro saem da própria série desenhada (gerador.js).
const G_P3 = { tipo: 'linha', analise: 'paradas', xPasso: 2, xRotulo: 2, yMin: 0, yMax: 60, yPasso: 10,
  yTitulo: 'Velocidade (km/h)', xTitulo: 'Tempo (min)', xDescricao: 'tempo, em minuto', yDescricao: 'velocidade, em km/h' };
const R4 = { xRotulo: 4 };   // de 36 a 40 min, números de 4 em 4 (a grade continua de 2 em 2)
const M_P3 = {
  id: 'mat-fa.p3.m', tipo: 'pagina', pagina: 'mat-fa.p3', bloco: 'mat-fa.p3.b2', ligadaA: ['enem-2023-156'],
  formato: 'numero', grafico: G_P3,
  enunciado: '<p>O gráfico mostra a velocidade de {veiculo}, em km/h, nos {T} minutos de um trajeto pela cidade.</p>{FIGURA}<p>Por quantos minutos, no total, ele ficou parado nesse trajeto?</p>',
  certa: 'z',
  erros: [
    { expr: 'marcas', falta: 'Contou as marcas da grade nos trechos em zero ({marcas}), em vez de fazer fim − começo em cada trecho.', paragrafo: 'mat-fa.p3.b2.s3' },
    { expr: 'z+h', falta: 'Somou também o trecho horizontal em {vh} km/h. Ali o veículo andava com velocidade constante; parado é só onde a velocidade é zero.', paragrafo: 'mat-fa.p3.b2.s4' },
    { expr: 'fim-inicio', falta: 'Mediu do começo da primeira parada ({inicio} min) ao fim da última ({fim} min) e contou junto o tempo em movimento entre elas.', paragrafo: 'mat-fa.p3.b2.s4' },
    { expr: 'T-z', falta: 'Calculou o tempo em movimento. A pergunta pede o tempo parado.', paragrafo: 'mat-fa.p3.b2.s3' },
    { expr: 'zMaior', falta: 'Ficou só com a parada mais longa ({zMaior} min). A pergunta pede o total: some as duas paradas, {z1} + {z2}.', paragrafo: 'mat-fa.p3.b2.s4' },
    { expr: 'h', falta: 'Contou como parada o trecho horizontal em {vh} km/h ({h} min). Ali a velocidade era constante, e não zero; parado é só onde a velocidade é zero.', paragrafo: 'mat-fa.p3.b2.s4' },
  ],
  // Cada linha usa 4 dos 6 erros (linha.erros), escolhidos pelos valores da própria linha para a certa
  // cair em letras diferentes (A a E), sem dois erros com o mesmo valor. A linha 8 tem o trecho horizontal
  // (8 min) mais longo que as paradas (6 min): é a que permite a certa em A.
  explicacao: 'Parado é velocidade zero. A linha fica no zero de {a1} a {f1} min ({z1} min) e de {a2} a {f2} min ({z2} min). Total: {z1} + {z2} = {z} minutos.',
  linhas: [
    { veiculo: 'um ônibus', serie: [[0, 30], [2, 40], [6, 40], [8, 0], [12, 0], [16, 50], [20, 0], [26, 0], [30, 30]], erros: [0, 4, 5, 1] },
    { veiculo: 'um caminhão de lixo', serie: [[0, 30], [2, 40], [6, 0], [14, 0], [16, 30], [18, 30], [20, 0], [30, 0], [32, 20]], erros: [0, 3, 4, 5] },
    { veiculo: 'um micro-ônibus', eixo: R4, serie: [[0, 30], [2, 40], [8, 40], [12, 0], [14, 0], [18, 50], [22, 30], [24, 0], [30, 0], [34, 40], [36, 30]], erros: [0, 1, 2, 3] },
    { veiculo: 'um ônibus escolar', eixo: R4, serie: [[0, 30], [2, 40], [4, 0], [10, 0], [14, 40], [16, 50], [20, 50], [24, 30], [28, 0], [32, 0], [36, 40], [40, 30]], erros: [0, 4, 1, 2] },   // paradas de 6 e 4 min: o erro 4 ("só a parada mais longa") precisa de durações diferentes
    { veiculo: 'um carro de autoescola', serie: [[0, 30], [4, 0], [10, 0], [12, 40], [14, 40], [16, 0], [26, 0], [30, 40]], erros: [0, 3, 5, 1] },
    { veiculo: 'um ônibus de linha', eixo: R4, serie: [[0, 40], [2, 0], [10, 0], [12, 30], [14, 30], [16, 0], [28, 0], [32, 50], [36, 40]], erros: [0, 1, 2, 3] },
    { veiculo: 'um caminhão de entregas', eixo: R4, serie: [[0, 30], [4, 40], [6, 0], [12, 0], [16, 40], [20, 30], [22, 0], [24, 0], [28, 50], [34, 50], [38, 30], [40, 40]], erros: [0, 1, 2, 3] },
    { veiculo: 'um táxi', serie: [[0, 30], [2, 0], [4, 0], [8, 40], [12, 30], [14, 0], [20, 0], [24, 40], [28, 40], [32, 20]], erros: [4, 5, 1, 2] },
    { veiculo: 'um ônibus circular', serie: [[0, 20], [2, 30], [10, 30], [12, 0], [16, 0], [18, 40], [22, 0], [24, 0], [28, 40], [30, 30]], erros: [5, 2, 1, 3] },
    { veiculo: 'um carro de aplicativo', eixo: R4, serie: [[0, 30], [2, 20], [4, 0], [12, 0], [14, 40], [18, 40], [20, 0], [32, 0], [34, 30], [36, 40]], erros: [0, 3, 5, 2] },
    { veiculo: 'um ônibus num dia de trânsito', eixo: R4, serie: [[0, 30], [4, 40], [6, 0], [16, 0], [18, 30], [22, 30], [24, 0], [36, 0], [38, 20], [40, 30]], erros: [0, 3, 4, 5] },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

const G_P4 = { tipo: 'linha', analise: 'acima', xMax: 24, xPasso: 1, xRotulo: 2, yMin: 16, yMax: 34, yPasso: 2, yRotulo: 4,
  refUnidade: ' °C', yTitulo: 'Temperatura (°C)', xTitulo: 'Hora', xDescricao: 'hora do dia', yDescricao: 'temperatura, em °C' };
const M_P4 = {
  id: 'mat-fa.p4.m', tipo: 'pagina', pagina: 'mat-fa.p4', bloco: 'mat-fa.p4.b1', ligadaA: ['enem-2020-164'],
  formato: 'numero', grafico: G_P4,
  enunciado: '<p>O gráfico mostra a temperatura em {cidade} num dia de verão com pancadas de chuva, das 0 h às 24 h. A linha tracejada marca {ref} °C.</p>{FIGURA}<p>Por quantas horas, nesse dia, a temperatura ficou acima de {ref} °C?</p>',
  certa: 's',
  erros: [
    { expr: 'maior', falta: 'Ficou só com o maior trecho acima da linha. A pergunta pede o total: some a duração de todos os trechos.', paragrafo: 'mat-fa.p4.b1.s2' },
    { expr: 'cruz', falta: 'Contou quantas vezes a curva cruza a linha ({cruz}). Os cruzamentos só marcam onde cada trecho começa e termina.', paragrafo: 'mat-fa.p4.b1.s1' },
    { expr: 'marcas', falta: 'Contou as marcas de hora em que a curva está acima da linha, em vez de fazer fim − começo em cada trecho.', paragrafo: 'mat-fa.p3.b2.s3' },
    { expr: 'T-s', falta: 'Calculou as horas abaixo da linha. A pergunta pede as horas acima de {ref} °C.', paragrafo: 'mat-fa.p4.b1.s1' },
  ],
  explicacao: 'A curva fica acima de {ref} °C {trechos}. Somando: {somaTxt} = {s} horas.',
  linhas: [
    { cidade: 'Cuiabá', ref: 25, serie: [[0, 21], [3, 19], [6, 20], [9, 25], [11, 29], [13, 30], [14, 25], [15, 22], [16, 25], [17, 28], [19, 25], [21, 22], [24, 20]] },
    { cidade: 'São Paulo', ref: 27, serie: [[0, 19], [5, 17], [8, 21], [11, 27], [12, 29], [13, 27], [14, 25], [15, 27], [15.5, 28], [16, 27], [19, 24], [24, 20]] },
    { cidade: 'Teresina', ref: 25, serie: [[0, 23], [4, 22], [6, 23], [8, 25], [10, 30], [13, 33], [15, 31], [17, 25], [17.5, 24], [18, 25], [20, 28], [23, 25], [24, 24]] },
    { cidade: 'Manaus', ref: 25, serie: [[0, 23], [4, 22], [6, 23], [8, 25], [10, 28], [12, 30], [13, 25], [13.5, 24], [14, 25], [15, 28], [17, 25], [18, 23], [19, 25], [20, 27], [21, 25], [24, 23]] },
    { cidade: 'Palmas', ref: 24, serie: [[0, 21], [4, 20], [7, 24], [9, 29], [12, 33], [15, 30], [17, 24], [17.5, 23], [18, 24], [20, 28], [23, 24], [24, 23]] },
    { cidade: 'Belo Horizonte', ref: 28, serie: [[0, 18], [5, 17], [8, 23], [10, 28], [11, 31], [12, 30], [13, 28], [14, 26], [15, 28], [15.5, 29], [16, 28], [17, 26], [18, 28], [18.5, 29], [19, 28], [21, 24], [24, 20]] },
    { cidade: 'Porto Alegre', ref: 24, serie: [[0, 19], [4, 17], [7, 21], [9, 24], [10, 27], [12, 24], [13, 22], [14, 24], [14.5, 26], [15, 24], [16, 22], [17, 24], [19, 28], [21, 24], [24, 20]] },
    { cidade: 'Rio Branco', ref: 25, serie: [[0, 23], [4, 22], [7, 25], [10, 30], [12, 32], [14, 25], [14.5, 24], [15, 25], [17, 29], [19, 25], [19.5, 24], [20, 25], [21, 27], [22, 25], [24, 23]] },
    { cidade: 'Fortaleza', ref: 26, serie: [[0, 24], [4, 23], [6, 24], [8, 26], [10, 29], [12, 30], [14, 26], [15, 25], [16, 26], [18, 29], [21, 26], [24, 24]] },
    { cidade: 'Recife', ref: 27, serie: [[0, 24], [5, 23], [9, 25], [12, 27], [13, 29], [14, 27], [15, 26], [16, 27], [16.5, 28], [17, 27], [18, 26], [19, 27], [19.5, 28], [20, 27], [22, 25], [24, 24]] },
    { cidade: 'Campo Grande', ref: 25, serie: [[0, 21], [5, 19], [8, 25], [11, 31], [13, 33], [16, 25], [16.5, 24], [17, 25], [19, 29], [21, 28], [23, 25], [24, 23]] },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

const G_P4B2 = { tipo: 'pontos', analise: 'pontos', min: 14, max: 34, passo: 2, rotulo: 4,
  xTitulo: 'Cidade A (°C)', yTitulo: 'Cidade B (°C)', xDescricao: 'temperatura da cidade A, em °C', yDescricao: 'temperatura da cidade B, em °C' };
const M_P4B2 = {
  id: 'mat-fa.p4.b2.m', tipo: 'bloco', pagina: 'mat-fa.p4', bloco: 'mat-fa.p4.b2', ligadaA: ['enem-2023-151'],
  formato: 'numero', grafico: G_P4B2,
  enunciado: '<p>Uma estação registrou a temperatura de duas cidades vizinhas, A e B, em {total} horários do mesmo dia. Cada ponto do gráfico mostra a temperatura de A no eixo horizontal e a de B no eixo vertical, em °C. O horário está escrito ao lado do ponto.</p>{FIGURA}<p>Em quantos desses horários fazia mais calor em A do que em B?</p>',
  certa: 'nA',
  erros: [
    { expr: 'nB', falta: 'Contou os horários em que B estava mais quente ({nB}). Os pontos acima da diagonal imaginária A = B (p. 4, § 4) têm B maior; a pergunta pede A maior.', paragrafo: 'mat-fa.p4.b2.s4' },
    { expr: 'nA+nE', falta: 'Contou também {empates}, quando as duas cidades tinham a mesma temperatura.', paragrafo: 'mat-fa.p4.b2.s4' },
    { expr: 'nSobe', falta: 'Contou os horários em que A esquentou em relação ao horário anterior. A pergunta compara A com B no mesmo horário.', paragrafo: 'mat-fa.p4.b2.s4' },
    { expr: 'nA+nB', falta: 'Contou os horários em que A e B tinham temperaturas diferentes, sem ver qual era maior.', paragrafo: 'mat-fa.p4.b2.s3' },
  ],
  explicacao: 'A está mais quente quando o ponto fica abaixo da diagonal imaginária A = B (p. 4, § 4), onde a temperatura de A passa a de B. Isso acontece em {nA} horários: {listaA}.',
  linhas: [
    { pontos: [
      { rotulo: '6 h', x: 18, y: 16, pos: 'd' }, { rotulo: '8 h', x: 20, y: 20, pos: 'd' },
      { rotulo: '10 h', x: 21, y: 25, pos: 'e' }, { rotulo: '12 h', x: 24, y: 29, pos: 'e' },
      { rotulo: '14 h', x: 28, y: 32, pos: 'd' }, { rotulo: '16 h', x: 27, y: 29, pos: 'd' },
      { rotulo: '18 h', x: 25, y: 23, pos: 'd' }, { rotulo: '20 h', x: 23, y: 26, pos: 'd' } ] },
    { pontos: [
      { rotulo: '7 h', x: 16, y: 18, pos: 'c' }, { rotulo: '9 h', x: 20, y: 20, pos: 'e' },
      { rotulo: '11 h', x: 23, y: 21, pos: 'c' }, { rotulo: '13 h', x: 28, y: 25, pos: 'b' },
      { rotulo: '15 h', x: 30, y: 26, pos: 'd' }, { rotulo: '17 h', x: 28, y: 28, pos: 'c' },
      { rotulo: '19 h', x: 26, y: 22, pos: 'd' }, { rotulo: '21 h', x: 21, y: 17, pos: 'd' } ] },
  ],
  licenca: 'CC BY-SA 4.0', credito: CRED,
};

// ------------------------------------------------------------------ questões do Enem
// O texto vem de mat-fa-c12-enem.js (gerado, sem adaptação); aqui só entram as anotações da equipe,
// que ficam AO LADO da questão, como obra separada (CC BY-SA 4.0).
function enem(id, a) {
  const q = ENEM_C12[id];
  if (!q) throw new Error(`questão ausente em mat-fa-c12-enem.js: ${id}`);
  return {
    id, ano: q.ano, dia: 2, caderno: 'Azul', numero: q.numero, area: 'MT', habilidade: q.habilidade,
    inep: q.inep, gabarito: q.gabarito, gabaritoConferido: true, conferidoITENS_PROVA: '2026-11-17',
    textoConferidoPDF: q.textoConferidoPDF || null, conferenciaPDF: q.conferenciaPDF || null, anulada: false,
    contexto: q.contexto, introducao: q.introducao, fonteMd: q.fonteMd, materialDeTerceiros: q.materialDeTerceiros,
    alternativas: q.alternativas.map(x => (x.letra === q.gabarito ? { ...x }
      : { ...x, ...a.erradas[x.letra], falta: reaisJuntos(a.erradas[x.letra].falta) })),
    imagens: q.imagens,
    atribuicao: `INEP · Enem ${q.ano}, 2º dia, Caderno Azul, questão ${q.numero} · CC BY-ND 3.0`,
    transcricao: q.textoConferidoPDF
      ? `Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em ${q.textoConferidoPDF.split('-').reverse().join('/')}`
        + (q.conferenciaPDF?.correcoes?.length ? '; onde a transcrição diferia do PDF, vale o PDF.' : '.')
      : 'Transcrição do projeto enem.dev (commit 938c56f), em conferência com o PDF oficial.',
    licenca: LIC_ENEM, licencaUrl: LIC_ENEM_URL, origem: 'enem',
    capitulo: a.capitulo, papel: a.papel, blocos: a.blocos, modelo: a.modelo,
    explicacao: reaisJuntos(a.explicacao), leitura: a.leitura || null, autoria: AUT,
  };
}

const Q_C1 = [
  enem('enem-2023-162', {
    capitulo: 'mat-fa.c1', papel: 'rodada', blocos: ['mat-fa.p1.b1'], modelo: 'mat-fa.p1.m',
    explicacao: 'Duas partes: a fixa (R$ 500 de taxa, paga uma vez) e a que varia (R$ 250 por metro cúbico, que multiplica o volume x). Juntando: y = 250x + 500. Conferência rápida: com x = 0, sobra só a taxa de R$ 500.',
    erradas: {
      A: { expr: '250*x', falta: 'Faltou a parte fixa: os R$ 500 da taxa entram uma vez, somados ao preço do volume.', paragrafo: 'mat-fa.p1.b1.s1' },
      B: { expr: '500*x', falta: 'Multiplicou a parte fixa pelo volume e deixou de fora o preço do metro cúbico (R$ 250).', paragrafo: 'mat-fa.p1.b1.s1' },
      C: { expr: '(500+250)*x', falta: 'Somou as duas partes e multiplicou tudo pelo volume. Só os R$ 250 do metro cúbico multiplicam x.', paragrafo: 'mat-fa.p1.b1.s2' },
      E: { expr: '500*x+250', falta: 'Trocou os papéis: quem multiplica x é o preço do metro cúbico (250); a taxa de bombeamento (500) fica somada.', paragrafo: 'mat-fa.p1.b1.s2' },
    },
  }),
  enem('enem-2023-150', {
    capitulo: 'mat-fa.c1', papel: 'rodada', blocos: ['mat-fa.p2.b2'], modelo: 'mat-fa.p2.b2.m',
    explicacao: '90% de q é 90/100 de q, isto é, 0,9 × q. Então C = 0,9q. Os outros 10% não entram na conta.',
    erradas: {
      B: { expr: '0.1*q', falta: 'Usou os 10% que sobram. A concentração é 90% de q, isto é, 0,9q.', paragrafo: 'mat-fa.p2.b2.s4' },
      C: { expr: '1-0.1*q', falta: 'Tentou fazer “o todo menos 10%”, mas usou 1 como o todo. O todo aqui é q: q − 0,1q = 0,9q.', paragrafo: 'mat-fa.p2.b2.s4' },
      D: { expr: '1-0.9*q', falta: 'Achou os 90% (0,9q), mas subtraiu de 1. Para tomar 90% de q, basta multiplicar: C = 0,9q.', paragrafo: 'mat-fa.p2.b2.s4' },
      E: { expr: 'q-10', falta: 'Tratou 10% como 10 unidades. Porcentagem multiplica: 90% de q é 0,9 × q.', paragrafo: 'mat-fa.p2.b2.s4' },
    },
  }),
  enem('enem-2019-168', {
    capitulo: 'mat-fa.c1', papel: 'rodada', blocos: ['mat-fa.p1.b1', 'mat-fa.p2.b1'], modelo: 'mat-fa.p2.m',
    explicacao: 'O gerente está entre os X funcionários, então os diaristas são X − 1. Cada diarista ganha 2 × 80 = 160 na semana. Y = 160(X − 1) + 1 000 = 160X + 840.',
    erradas: {
      A: { expr: '80*(X-1)+1000', falta: 'Esqueceu que cada diarista trabalha 2 dias: na semana, cada um ganha 2 × 80 = 160.', paragrafo: 'mat-fa.p2.b1.s3' },
      B: { expr: '80*X+1000', falta: 'Esqueceu os 2 dias e contou o gerente como diarista.', paragrafo: 'mat-fa.p2.b1.s3' },
      C: { expr: '80*(X+1)+1000', falta: 'Esqueceu os 2 dias e somou o gerente aos diaristas em vez de tirá-lo: são X − 1, não X + 1.', paragrafo: 'mat-fa.p2.b1.s3' },
      E: { expr: '160*X+1000', falta: 'Contou o gerente como diarista: ele recebe R$ 1 000 fixos e não entra nos R$ 160.', paragrafo: 'mat-fa.p2.b1.s3' },
    },
  }),
  // Reserva com quatro letras (d, n, L, s): a conferência do erro fica em exprTeste, porque o teste de
  // Pack.checar() (js/nucleo/pack.js) só lê uma variável; o _dev/valida_pack.mjs confere as quatro.
  enem('enem-2021-141', {
    capitulo: 'mat-fa.c1', papel: 'reserva', blocos: ['mat-fa.p1.b1', 'mat-fa.p2.b2'], modelo: 'mat-fa.p1.m',
    explicacao: 'O preço tem três partes: as diárias (d · n), a limpeza (L, fixa) e a taxa de serviço, que é a porcentagem s aplicada ao total das diárias: d · n · s (com s escrito como decimal, por exemplo 0,1 para 10%). Somando as três partes: P = d·n + L + s·(d·n).',
    erradas: {
      B: { exprTeste: 'd*n+L+d*s', falta: 'Calculou a taxa de serviço sobre uma diária só. Ela incide sobre o total das diárias, d · n.', paragrafo: 'mat-fa.p2.b2.s4' },
      C: { exprTeste: 'd+L+s', falta: 'Não multiplicou a diária pelo número de diárias (n) e somou s como se fosse um valor em reais.', paragrafo: 'mat-fa.p1.b1.s2' },
      D: { exprTeste: 'd*n*s+L', falta: 'Ficou só com a taxa de serviço e esqueceu de somar o valor das próprias diárias, d · n.', paragrafo: 'mat-fa.p2.b2.s4' },
      E: { exprTeste: 'd*n+L+s', falta: 'Somou s direto. A taxa é uma porcentagem do total das diárias: entra como d · n · s.', paragrafo: 'mat-fa.p2.b2.s4' },
    },
  }),
];

const Q_C2 = [
  enem('enem-2023-156', {
    capitulo: 'mat-fa.c2', papel: 'rodada', blocos: ['mat-fa.p3.b2', 'mat-fa.p4.b1'], modelo: 'mat-fa.p3.m',
    leitura: 'Leitura da equipe, igual à descrição DOSVOX: sinal em zero de 10 a 12 min e de 16 a 20 min; trechos horizontais fora do zero em 0–2, 6–8, 22–24 e 28–30 min.',
    explicacao: 'Sem sinal é intensidade zero. A linha fica no zero de 10 a 12 min (2 min) e de 16 a 20 min (4 min). Total: 2 + 4 = 6 minutos. Aos 14 min há um pico, com sinal: ele fica de fora.',
    erradas: {
      B: { expr: '2+2+2+2', falta: 'Somou os trechos horizontais em que ainda havia sinal (0–2, 6–8, 22–24 e 28–30 min). Sem sinal é só onde a linha está no zero.', paragrafo: 'mat-fa.p3.b2.s4' },
      C: { expr: '20-10', falta: 'Mediu do começo do primeiro trecho em zero (10 min) ao fim do último (20 min) e contou junto o pico dos 14 min, quando havia sinal.', paragrafo: 'mat-fa.p3.b2.s4' },
      D: { expr: '(2+2+2+2)+(2+4)', falta: 'Somou todos os trechos horizontais, inclusive os que não estão no zero. Só os trechos em zero contam.', paragrafo: 'mat-fa.p3.b2.s4' },
      E: { expr: '30-(2+4)', falta: 'Calculou o tempo com sinal (30 − 6). A pergunta pede o tempo sem sinal.', paragrafo: 'mat-fa.p3.b2.s3' },
    },
  }),
  enem('enem-2020-164', {
    capitulo: 'mat-fa.c2', papel: 'rodada', blocos: ['mat-fa.p3.b2', 'mat-fa.p4.b1'], modelo: 'mat-fa.p4.m',
    leitura: 'Leitura da equipe: a curva cruza a reta dos 55 dB às 2, 5, 6, 9, 11, 14, 16, 17, 19 e 22 h; fica acima nos trechos 2–5, 6–9, 11–14, 16–17 e 19–22 h; as marcas de hora estritamente acima são 3, 4, 7, 8, 12, 13, 20 e 21 h.',
    explicacao: 'A curva fica acima da reta dos 55 dB em cinco trechos: 2 h–5 h (3 h), 6 h–9 h (3 h), 11 h–14 h (3 h), 16 h–17 h (1 h) e 19 h–22 h (3 h). Somando: 3 + 3 + 3 + 1 + 3 = 13 horas.',
    erradas: {
      A: { expr: '1+1+1+1+1', falta: 'Contou quantos trechos ficaram acima de 55 dB (5), não quantas horas eles duraram.', paragrafo: 'mat-fa.p4.b1.s2' },
      B: { expr: '2+2+2+0+2', falta: 'Contou as marcas de hora acima da reta (3, 4, 7, 8, 12, 13, 20 e 21 h) em vez de fazer fim − começo em cada trecho.', paragrafo: 'mat-fa.p3.b2.s3' },
      C: { expr: '2*5', falta: 'Contou quantas vezes a curva cruza a reta dos 55 dB. Os cruzamentos só marcam onde cada trecho começa e termina.', paragrafo: 'mat-fa.p4.b1.s1' },
      D: { expr: '24-13', falta: 'Calculou as horas abaixo de 55 dB. A pergunta pede as horas acima.', paragrafo: 'mat-fa.p4.b1.s1' },
    },
  }),
  enem('enem-2023-151', {
    capitulo: 'mat-fa.c2', papel: 'rodada', blocos: ['mat-fa.p4.b2'], modelo: 'mat-fa.p4.b2.m',
    leitura: 'Leitura da equipe, igual à descrição DOSVOX: A maior que B às 9, 12, 13 e 14 h; empate às 10 e 11 h; B maior que A às 15, 16 e 17 h.',
    explicacao: 'Cada ponto é (valor de A; valor de B). A vale mais quando o primeiro número passa o segundo, isto é, quando o ponto fica abaixo da diagonal imaginária A = B: às 9 h (3 > 0,5), 12 h (5,5 > 3), 13 h (6 > 1,5) e 14 h (3,5 > 2). Às 10 h e às 11 h há empate. São 4 instantes.',
    erradas: {
      A: { expr: '3', falta: 'Contou os instantes em que B valia mais (15 h, 16 h e 17 h): os pontos acima da diagonal imaginária A = B. A pergunta pede A maior.', paragrafo: 'mat-fa.p4.b2.s4' },
      C: { expr: '4+2', falta: 'Contou também os empates das 10 h e das 11 h, quando A e B valiam o mesmo.', paragrafo: 'mat-fa.p4.b2.s4' },
      D: { expr: '9-2', falta: 'Contou os instantes em que A e B eram diferentes, sem ver qual dos dois era maior.', paragrafo: 'mat-fa.p4.b2.s3' },
      E: { expr: '9', falta: 'Contou todos os instantes. Só valem aqueles em que o valor de A passa o de B.', paragrafo: 'mat-fa.p4.b2.s3' },
    },
  }),
];

// ------------------------------------------------------------------ cards (Decisão 1 do dono)
const card = (id, tipo, bloco, paragrafo, frente, verso) => ({ id, tipo, frente: reaisJuntos(frente), verso: reaisJuntos(verso), bloco, paragrafo, autoria: AUT });

const CARDS_C1 = [
  card('mat-fa.c1.card1', 'conceito', 'mat-fa.p1.b1', 'mat-fa.p1.b1.s1', 'Parte fixa de um preço',
    'Valor cobrado uma vez só, qualquer que seja a quantidade. Na fórmula, fica somado: é o b de y = ax + b.'),
  card('mat-fa.c1.card2', 'conceito', 'mat-fa.p1.b1', 'mat-fa.p1.b1.s2', 'Parte que varia de um preço',
    'Preço por unidade vezes a quantidade: o termo ax de y = ax + b. Só o a multiplica o x.'),
  card('mat-fa.c1.card3', 'procedimento', 'mat-fa.p1.b2', 'mat-fa.p1.b2.s3', 'Como conferir uma fórmula de preço com parte fixa?',
    'Faça x = 0: tem de sobrar só a parte fixa. Faça x = 1: parte fixa mais uma unidade.'),
  card('mat-fa.c1.card4', 'palavra-pista', 'mat-fa.p2.b1', 'mat-fa.p2.b1.s2', 'Palavras que apontam a parte fixa',
    '“Fixo”, “só uma vez”, “de entrada”, “de instalação”. Esse número fica somado, sem x.'),
  card('mat-fa.c1.card5', 'palavra-pista', 'mat-fa.p2.b1', 'mat-fa.p2.b1.s2', 'Palavras que apontam o número que multiplica o x',
    '“Por”, “a cada”, “por dia” ou o preço de uma unidade (“o metro cúbico custa…”). É o a de y = ax + b.'),
  card('mat-fa.c1.card6', 'armadilha', 'mat-fa.p2.b1', 'mat-fa.p2.b1.s3', 'Grupo de x pessoas, uma com valor fixo: quantas entram na conta por dia?',
    'x − 1. Quem tem valor fixo faz parte do total, mas fica fora da conta por dia.'),
  card('mat-fa.c1.card7', 'procedimento', 'mat-fa.p2.b2', 'mat-fa.p2.b2.s4', 'Como escrever p% de uma quantidade q?',
    'Multiplique q por p/100. Exemplo: 35% de q é 0,35q. Não é 35q nem a parte que sobra.'),
  card('mat-fa.c1.card8', 'armadilha', 'mat-fa.p2.b2', 'mat-fa.p2.b2.s4', 'Porcentagem cobrada só sobre parte do preço',
    'Multiplique só essa parte. Serviço de 10% sobre a comida c, entrega de R$ 8: c + 0,1c + 8.'),
];

const CARDS_C2 = [
  card('mat-fa.c2.card1', 'procedimento', 'mat-fa.p3.b1', 'mat-fa.p3.b1.s1', 'Primeiro passo para ler um gráfico de linha',
    'Ler os eixos: o que cada um mede, a unidade e de quanto em quanto a escala anda.'),
  card('mat-fa.c2.card2', 'conceito', 'mat-fa.p3.b1', 'mat-fa.p3.b1.s2', 'O que diz um ponto de um gráfico de linha?',
    'Um par: o instante, no eixo horizontal, e o valor da grandeza nesse instante, no eixo vertical.'),
  card('mat-fa.c2.card3', 'procedimento', 'mat-fa.p3.b2', 'mat-fa.p3.b2.s3', 'Quanto durou um trecho do gráfico?',
    'Instante do fim menos instante do começo. De 6 a 10 minutos: 10 − 6 = 4 minutos.'),
  card('mat-fa.c2.card4', 'armadilha', 'mat-fa.p3.b2', 'mat-fa.p3.b2.s3', 'Contar as marcas da grade para medir um tempo',
    'Engano: de 6 a 10, de 2 em 2, há 3 marcas, mas o trecho dura 4 minutos.'),
  card('mat-fa.c2.card5', 'conceito', 'mat-fa.p3.b2', 'mat-fa.p3.b2.s4', 'Trecho horizontal fora do zero, num gráfico de velocidade',
    'Velocidade constante: o veículo anda sem acelerar nem frear. Parado é só o trecho em zero.'),
  card('mat-fa.c2.card6', 'procedimento', 'mat-fa.p4.b1', 'mat-fa.p4.b1.s2', 'Por quanto tempo a curva ficou acima da linha de referência?',
    'Ache os cruzamentos, faça fim − começo em cada trecho acima da linha e some todos.'),
  card('mat-fa.c2.card7', 'armadilha', 'mat-fa.p4.b1', 'mat-fa.p4.b1.s2', 'Erro comum ao medir o tempo acima de um limite',
    'Ficar só com o maior trecho ou contar quantos trechos são. Some a duração de todos.'),
  card('mat-fa.c2.card8', 'procedimento', 'mat-fa.p4.b2', 'mat-fa.p4.b2.s4', 'A no eixo horizontal, B no vertical: quando A é maior?',
    'Quando o ponto fica abaixo da diagonal A = B. Exatamente na diagonal, é empate.'),
];

// ------------------------------------------------------------------ capítulos
export const capitulos12 = [
  {
    id: 'mat-fa.c1', n: 1, titulo: 'Parte fixa e parte que varia', paginasTxt: 'p. 1–2',
    habilidades: ['MT-H19'], prereq: [],
    paginas: [P1, P2],
    rodada: ['enem-2023-162', 'enem-2023-150', 'enem-2019-168'],   // b: 0,86 · 1,45 · 1,52
    reserva: ['enem-2021-141'],                                     // b: 1,59
    irAlem: [KHAN_C1, OBMEP],
    cards: CARDS_C1,
    modelos: [M_P1, M_P2, M_P2B2].map(compatibilizar),
    questoes: Q_C1,
  },
  {
    id: 'mat-fa.c2', n: 2, titulo: 'Ler o gráfico', paginasTxt: 'p. 3–4',
    habilidades: ['MT-H20'], prereq: [],
    paginas: [P3, P4],
    rodada: ['enem-2023-156', 'enem-2020-164', 'enem-2023-151'],   // b: 0,38 · 0,44 · 0,86
    reserva: [],                                                    // a Prova usa variantes (g.2)
    irAlem: [KHAN_C2, OBMEP],
    cards: CARDS_C2,
    modelos: [M_P3, M_P4, M_P4B2].map(compatibilizar),
    questoes: Q_C2,
  },
];
