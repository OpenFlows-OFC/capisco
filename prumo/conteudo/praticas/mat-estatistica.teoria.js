// Teoria do tópico de prática mat-estatistica.
// Adaptação da equipe Prumo (CC BY-SA 4.0) a partir do Wikilivros: "Matemática elementar/Estatística" e
// "Matemática elementar/Médias" (CC BY-SA 3.0). Seções 4 a 7 (tabelas de frequência e gráficos) são texto original da equipe.
export const teoria = {
  id: 'mat-estatistica',
  titulo: 'Estatística: média, mediana, moda e gráficos',
  porQueCai: 'O Enem traz tabelas e gráficos com dados reais, como empregos, terremotos, notas e viagens. Ele pede média, mediana ou moda e cobra a leitura correta do gráfico antes de qualquer conta.',
  termos: [
    { termo: 'Média aritmética', def: 'Soma dos valores dividida pela quantidade de valores.' },
    { termo: 'Mediana', def: 'Valor do meio depois que os dados são colocados em ordem.' },
    { termo: 'Moda', def: 'Valor que mais se repete em um conjunto de dados.' },
    { termo: 'Frequência', def: 'Quantas vezes um valor aparece nos dados.' },
    { termo: 'Frequência acumulada', def: 'Soma das frequências desde a primeira linha da tabela até aquela.' },
  ],
  habilidades: [
    { codigo: 'H27', descricao: 'Calcular medidas de tendência central ou de dispersão de um conjunto de dados expressos em uma tabela de frequências de dados agrupados (não em classes) ou em gráficos.' },
    { codigo: 'H29', descricao: 'Utilizar conhecimentos de estatística e probabilidade como recurso para a construção de argumentação.' },
    { codigo: 'H30', descricao: 'Avaliar propostas de intervenção na realidade utilizando conhecimentos de estatística e probabilidade.' },
  ],
  secoes: [
    {
      titulo: 'Para que serve a estatística e a média aritmética',
      figura: {
        svg: '<svg viewBox="0 0 320 220" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><g stroke="currentColor" stroke-opacity="0.2"><path d="M50 138H300M50 98H300M50 58H300M50 18H300"/></g><g fill="currentColor" fill-opacity="0.45" stroke="currentColor"><rect x="95" y="45.6" width="70" height="132.4"/><rect x="195" y="66.4" width="70" height="111.6"/></g><path d="M50 18V178H300" stroke="currentColor" stroke-width="1.5" fill="none"/><g text-anchor="end" font-size="13"><text x="42" y="182">0</text><text x="42" y="142">1</text><text x="42" y="102">2</text><text x="42" y="62">3</text><text x="42" y="22">4</text></g><g text-anchor="middle" font-size="14" font-weight="700"><text x="130" y="39">3,31</text><text x="230" y="60">2,79</text></g><g text-anchor="middle" font-size="13"><text x="130" y="196">Censo 2010</text><text x="230" y="196">Censo 2022</text></g><text x="4" y="10">moradores por domicílio (média)</text></svg>',
        alt: 'Gráfico de colunas com a média de moradores por domicílio no Brasil, segundo o IBGE. Censo 2010: 3,31 moradores. Censo 2022: 2,79 moradores. O eixo vertical vai de 0 a 4.',
        legenda: 'Figura 1. Média de moradores por domicílio no Brasil, nos Censos de 2010 e 2022 (IBGE). Leia a altura de cada coluna no eixo da esquerda. Nenhuma casa tem 2,79 moradores: a média é o total de moradores repartido igualmente entre as casas.',
      },
      paragrafos: [
        'A estatística é a parte da Matemática que coleta, organiza e analisa dados. A estatística descritiva resume muitos números em poucos: as medidas de tendência central (média, mediana e moda) dizem qual é o valor típico de um conjunto.',
        'A média aritmética é a soma de todos os valores dividida pela quantidade de valores. Ela é o valor que cada um teria se o total fosse repartido igualmente.',
        'Da definição sai a ferramenta mais útil do tema: soma = média · quantidade. Quem sabe a média que quer atingir sabe a soma de que precisa.',
      ],
      exemplos: [
        {
          enunciado: 'Bia tirou 6,5; 7,0; 8,5 e 6,0 nos quatro bimestres. Qual é a média dela?',
          resolucao: [
            'Soma: 6,5 + 7,0 + 8,5 + 6,0 = 28.',
            'Média: 28 ÷ 4 = 7.',
            'Resposta: 7,0.',
          ],
        },
        {
          enunciado: 'Para passar, Caio precisa de média 6 nos quatro bimestres. Nos três primeiros ele tirou 5,5; 6,0 e 5,0. Quanto precisa tirar no último?',
          resolucao: [
            'Soma necessária: 6 · 4 = 24.',
            'Soma que ele já tem: 5,5 + 6,0 + 5,0 = 16,5.',
            'Falta: 24 − 16,5 = 7,5.',
            'Resposta: pelo menos 7,5.',
          ],
        },
        {
          enunciado: 'Um time de vôlei tem 12 jogadoras com altura média de 1,78 m. A técnica quer média de pelo menos 1,82 m. Ela vai trocar as três mais baixas (1,68 m, 1,70 m e 1,72 m) e já contratou uma jogadora de 1,90 m. Qual deve ser a altura média mínima das outras duas contratadas?',
          resolucao: [
            'Soma de hoje: 12 · 1,78 = 21,36 m. Soma desejada: 12 · 1,82 = 21,84 m.',
            'Saem 1,68 + 1,70 + 1,72 = 5,10 m. Ficam 21,36 − 5,10 = 16,26 m para 9 jogadoras.',
            'Com a nova jogadora: 16,26 + 1,90 = 18,16 m.',
            'As outras duas precisam somar 21,84 − 18,16 = 3,68 m, ou seja, média de 3,68 ÷ 2 = 1,84 m.',
            'Resposta: 1,84 m.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: quase nunca pede só a média. Pede o valor que falta para chegar a uma média, ou o efeito de trocar alguns elementos. Trabalhe sempre com a soma.',
      confira: { pergunta: 'Quatro amigos têm média de idade de 15 anos. Qual é a soma das idades deles?', opcoes: ['15 anos', '19 anos', '60 anos'], certa: 2, porque: 'Soma = média · quantidade: 15 · 4 = 60 anos.' },
    },
    {
      titulo: 'Média ponderada e tabelas de frequência',
      paragrafos: [
        'Na média ponderada, cada valor tem um peso. Multiplique cada valor pelo seu peso, some os produtos e divida pela soma dos pesos.',
        'Uma tabela de frequência diz quantas vezes cada valor aparece. A frequência funciona como peso: a média é a soma de (valor · frequência) dividida pelo total de frequências.',
      ],
      tabela: {
        cabecalho: ['Gols no jogo', 'Número de jogos', 'Gols × jogos'],
        linhas: [
          ['0', '5', '0'],
          ['1', '8', '8'],
          ['2', '4', '8'],
          ['3', '3', '9'],
          ['Total', '20', '25'],
        ],
        legenda: 'Tabela 1. Gols marcados por um time em 20 jogos. A última coluna dá o total de gols.',
      },
      exemplos: [
        {
          enunciado: 'Em uma ETEC, a nota é a média ponderada da prova (peso 3), do trabalho (peso 2) e da participação (peso 1). Lia tirou 6 na prova, 9 no trabalho e 8 na participação. Qual é a nota final?',
          resolucao: [
            'Produtos: 6 · 3 = 18; 9 · 2 = 18; 8 · 1 = 8.',
            'Soma dos produtos: 18 + 18 + 8 = 44. Soma dos pesos: 3 + 2 + 1 = 6.',
            'Média: 44 ÷ 6 ≈ 7,33.',
            'Resposta: cerca de 7,3. A média simples daria 7,67, porque daria à participação o mesmo peso da prova.',
          ],
        },
        {
          enunciado: 'Use a Tabela 1. Qual é a média de gols por jogo do time?',
          resolucao: [
            'Total de gols: 0 · 5 + 1 · 8 + 2 · 4 + 3 · 3 = 25.',
            'Total de jogos: 5 + 8 + 4 + 3 = 20.',
            'Média: 25 ÷ 20 = 1,25.',
            'Resposta: 1,25 gol por jogo. Somar 0 + 1 + 2 + 3 e dividir por 4 daria 1,5, que ignora as frequências.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as frequências aparecem em quadros, como famílias por número de filhos. Divida pelo total de famílias, não pelo número de linhas do quadro.',
      confira: { pergunta: 'Em uma tabela, o valor 2 aparece 3 vezes e o valor 4 aparece 1 vez. Qual é a média?', opcoes: ['2,5', '3', '2'], certa: 0, porque: 'A frequência é o peso: (2 · 3 + 4 · 1) ÷ (3 + 1) = 10 ÷ 4 = 2,5. A média simples de 2 e 4, que dá 3, ignora as frequências.' },
    },
    {
      titulo: 'Mediana e moda',
      paragrafos: [
        'A mediana é o valor que ocupa a posição central depois que os dados são colocados em ordem. Na lista ordenada, há tantos valores antes dela quanto depois.',
        'Com uma quantidade ímpar n de dados, a mediana é o termo de posição (n + 1) ÷ 2. Com quantidade par, ela é a média dos dois termos centrais, nas posições n ÷ 2 e n ÷ 2 + 1.',
        'A moda é o valor que mais se repete. Um conjunto sem repetição é amodal; com um valor mais frequente, é unimodal; com dois empatados, é bimodal.',
        'A média é puxada por valores extremos, e a mediana quase não muda com eles. Por isso a mediana costuma descrever melhor dados desiguais, como salários.',
      ],
      exemplos: [
        {
          enunciado: 'As temperaturas máximas de 10 dias em Cuiabá foram 31, 28, 33, 29, 35, 28, 30, 32, 27 e 34 °C. Calcule a mediana, a moda e a média.',
          resolucao: [
            'Em ordem: 27, 28, 28, 29, 30, 31, 32, 33, 34, 35.',
            'São 10 dados, quantidade par: os centrais são o 5º (30) e o 6º (31). Mediana: (30 + 31) ÷ 2 = 30,5.',
            'Moda: 28, o único valor que aparece duas vezes.',
            'Média: soma 307 ÷ 10 = 30,7.',
            'Resposta: mediana 30,5 °C; moda 28 °C; média 30,7 °C.',
          ],
        },
        {
          enunciado: 'Os 5 funcionários de uma pequena empresa ganham R$ 1 500, R$ 1 600, R$ 1 700, R$ 1 800 e R$ 12 000. Qual medida representa melhor o salário típico?',
          resolucao: [
            'Média: 18 600 ÷ 5 = 3 720 reais.',
            'Mediana: os dados já estão em ordem, e o 3º termo é 1 700 reais.',
            'Quatro dos cinco ganham menos que a média, que foi puxada pelo salário de 12 000.',
            'Resposta: a mediana, R$ 1 700.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: o enunciado pode dizer que “a mediana representa o valor típico”. As alternativas trazem o termo do meio sem ordenar e a média no lugar da mediana.',
      confira: { pergunta: 'Qual é a mediana de 7, 1, 9, 4 e 3?', opcoes: ['9', '4', '4,8'], certa: 1, porque: 'Em ordem: 1, 3, 4, 7, 9, e o termo central, o 3º, vale 4. O 9 é o termo do meio sem ordenar, e 4,8 é a média.' },
    },
    {
      titulo: 'Mediana em tabelas de frequência',
      paragrafos: [
        'Quando os dados vêm numa tabela de frequência, não é preciso escrever todos os valores. Some as frequências para saber o total n e descubra as posições centrais.',
        'Depois, monte a frequência acumulada: some as frequências linha a linha. Ela diz até qual posição vai cada valor, e assim você acha em que linha estão os termos centrais.',
      ],
      tabela: {
        cabecalho: ['Livros lidos no ano', 'Alunos', 'Acumulada', 'Posições'],
        linhas: [
          ['0', '6', '6', '1ª a 6ª'],
          ['1', '9', '15', '7ª a 15ª'],
          ['2', '10', '25', '16ª a 25ª'],
          ['3', '3', '28', '26ª a 28ª'],
          ['4', '2', '30', '29ª e 30ª'],
        ],
        legenda: 'Tabela 2. Livros lidos pelos 30 alunos de uma turma, com a frequência acumulada.',
      },
      exemplos: [
        {
          enunciado: 'Use a Tabela 2. Qual é a mediana do número de livros lidos?',
          resolucao: [
            'Total: 30 alunos, quantidade par. Os centrais estão nas posições 15 e 16.',
            'Pela acumulada, a posição 15 ainda está na linha de 1 livro, e a 16 já está na linha de 2 livros.',
            'Mediana: (1 + 2) ÷ 2 = 1,5.',
            'Resposta: 1,5 livro. A moda é 2 (10 alunos), e a média é 46 ÷ 30 ≈ 1,53.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: a armadilha é a linha que fecha exatamente na posição central. Confira se as duas posições do meio caem na mesma linha ou em linhas vizinhas.',
      confira: { pergunta: 'Uma tabela de frequência tem 20 dados no total. Em que posições estão os termos centrais?', opcoes: ['só na 10ª', '20ª e 21ª', '10ª e 11ª'], certa: 2, porque: 'Com n par, os centrais ficam nas posições n ÷ 2 e n ÷ 2 + 1, ou seja, 10ª e 11ª. A frequência acumulada mostra em que linha cada uma está.' },
    },
    {
      titulo: 'Gráfico de barras como tabela de frequência',
      paragrafos: [
        'Muitos gráficos de barras são tabelas de frequência desenhadas. Um eixo traz os valores, e o comprimento da barra diz quantas vezes cada valor aparece.',
        'Antes de calcular, leia o título e o nome de cada eixo. A moda é o valor da barra mais comprida, e não o comprimento dela.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 220" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><g stroke="currentColor" stroke-opacity="0.2"><path d="M90 18V178M130 18V178M170 18V178M210 18V178M250 18V178M290 18V178"/></g><g fill="currentColor" fill-opacity="0.45" stroke="currentColor"><rect x="50" y="24" width="40" height="16"/><rect x="50" y="50" width="120" height="16"/><rect x="50" y="102" width="200" height="16"/><rect x="50" y="128" width="80" height="16"/><rect x="50" y="154" width="120" height="16"/></g><rect x="50" y="76" width="240" height="16" fill="#ffe76a" stroke="currentColor" stroke-width="1.5"/><path d="M50 18V178H294" stroke="currentColor" stroke-width="1.5" fill="none"/><g text-anchor="end" font-size="13"><text x="42" y="37">1</text><text x="42" y="63">2</text><text x="42" y="89">3</text><text x="42" y="115">4</text><text x="42" y="141">5</text><text x="42" y="167">6</text></g><g><text x="95" y="37">2</text><text x="175" y="63">6</text><text x="295" y="89">12</text><text x="255" y="115">10</text><text x="135" y="141">4</text><text x="175" y="167">6</text></g><g text-anchor="middle"><text x="50" y="194">0</text><text x="90" y="194">2</text><text x="130" y="194">4</text><text x="170" y="194">6</text><text x="210" y="194">8</text><text x="250" y="194">10</text><text x="290" y="194">12</text><text x="170" y="212">número de entregadores</text></g><text x="4" y="12">entregas</text></svg>',
        alt: 'Gráfico de barras horizontais. O eixo vertical mostra o número de entregas feitas no dia, de 1 a 6. O eixo horizontal mostra o número de entregadores, de 0 a 12. Valores: 1 entrega, 2 entregadores; 2 entregas, 6; 3 entregas, 12, a barra mais longa, destacada; 4 entregas, 10; 5 entregas, 4; 6 entregas, 6. Total de 40 entregadores.',
        legenda: 'Figura 2. Entregas feitas em um dia pelos 40 entregadores de um aplicativo. A barra destacada mostra a moda: 3 entregas.',
      },
      exemplos: [
        {
          enunciado: 'Use a Figura 2. Compare a moda, a mediana e a média do número de entregas.',
          resolucao: [
            'Moda: 3 entregas, a barra mais comprida (12 entregadores).',
            'Total: 2 + 6 + 12 + 10 + 4 + 6 = 40. Centrais: posições 20 e 21.',
            'Acumulada: 2, 8, 20, 30. A posição 20 tem 3 entregas, e a 21 já tem 4. Mediana: (3 + 4) ÷ 2 = 3,5.',
            'Média: (1 · 2 + 2 · 6 + 3 · 12 + 4 · 10 + 5 · 4 + 6 · 6) ÷ 40 = 146 ÷ 40 = 3,65.',
            'Resposta: moda < mediana < média, pois 3 < 3,5 < 3,65.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: o gráfico pode ter um valor sem barra, com frequência zero. Ele não soma nada na média, mas a leitura dos outros valores no eixo precisa continuar certa.',
      confira: { pergunta: 'Em um gráfico de barras, o valor 5 tem a barra mais comprida, com 9 pessoas. Qual é a moda?', opcoes: ['5', '9', '14'], certa: 0, porque: 'A moda é o valor que a barra representa, 5. O 9 é a frequência desse valor.' },
    },
    {
      titulo: 'Gráficos de colunas e de linhas',
      imagem: {src: "./conteudo/praticas/img/ap-ipca-2015-2025.svg",alt: "Gráfico de linha da inflação anual no Brasil, o IPCA, de 2015 a 2025, em porcentagem: 2015, 10,67; 2016, 6,29; 2017, 2,95; 2018, 3,75; 2019, 4,31; 2020, 4,52; 2021, 10,06; 2022, 5,79; 2023, 4,62; 2024, 4,83; 2025, 4,26. Os pontos de 2015 e 2021, acima de 10, estão destacados. Uma linha tracejada marca a média, 5,64, e uma linha pontilhada, mais baixa, marca a mediana, 4,62.",legenda: "Inflação de cada ano, de 2015 a 2025. Só dois anos passaram de 10%, mas eles puxam a média (5,64%) para cima da mediana (4,62%).",credito: "Gráfico da equipe Prumo com dados do IBGE (Sidra, tabela 1737, IPCA acumulado no ano). CC BY-SA 4.0."},
      paragrafos: [
        'Gráficos de colunas comparam categorias, e com duas colunas por categoria comparam duas séries, como receita e despesa. Gráficos de linhas mostram como um valor muda ao longo do tempo.',
        'Às vezes a questão pede uma medida só de parte dos dados. Primeiro filtre (por exemplo, só os meses com lucro), depois ordene e calcule.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 220" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><g stroke="currentColor" stroke-opacity="0.2"><path d="M40 156H312M40 116H312M40 76H312M40 36H312"/></g><g fill="currentColor" fill-opacity="0.8"><rect x="48" y="96" width="16" height="100"/><rect x="93" y="116" width="16" height="80"/><rect x="138" y="56" width="16" height="140"/><rect x="183" y="136" width="16" height="60"/><rect x="228" y="76" width="16" height="120"/><rect x="273" y="36" width="16" height="160"/></g><g fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"><rect x="66" y="136" width="16" height="60"/><rect x="111" y="76" width="16" height="120"/><rect x="156" y="156" width="16" height="40"/><rect x="201" y="116" width="16" height="80"/><rect x="246" y="96" width="16" height="100"/><rect x="291" y="116" width="16" height="80"/></g><path d="M40 30V196H312" stroke="currentColor" stroke-width="1.5" fill="none"/><g text-anchor="middle"><text x="56" y="92">5</text><text x="101" y="112">4</text><text x="146" y="52">7</text><text x="191" y="132">3</text><text x="236" y="72">6</text><text x="281" y="32">8</text><text x="74" y="132">3</text><text x="119" y="72">6</text><text x="164" y="152">2</text><text x="209" y="112">4</text><text x="254" y="92">5</text><text x="299" y="112">4</text><text x="65" y="212">jan</text><text x="110" y="212">fev</text><text x="155" y="212">mar</text><text x="200" y="212">abr</text><text x="245" y="212">mai</text><text x="290" y="212">jun</text></g><g text-anchor="end"><text x="34" y="200">0</text><text x="34" y="160">2</text><text x="34" y="120">4</text><text x="34" y="80">6</text><text x="34" y="40">8</text></g><rect x="44" y="4" width="12" height="12" fill="currentColor" fill-opacity="0.8"/><text x="60" y="14">receita</text><rect x="124" y="4" width="12" height="12" fill="currentColor" fill-opacity="0.2" stroke="currentColor"/><text x="140" y="14">despesa</text><text x="312" y="14" text-anchor="end">milhões de R$</text></svg>',
        alt: 'Gráfico de colunas duplas com receita e despesa de uma cooperativa, em milhões de reais, de janeiro a junho. Janeiro: receita 5, despesa 3. Fevereiro: receita 4, despesa 6. Março: receita 7, despesa 2. Abril: receita 3, despesa 4. Maio: receita 6, despesa 5. Junho: receita 8, despesa 4. As colunas de receita são preenchidas e as de despesa são mais claras, com contorno.',
        legenda: 'Figura 3. Receita e despesa mensais de uma cooperativa, em milhões de reais.',
      },
      exemplos: [
        {
          enunciado: 'Use a Figura 3. Há lucro quando a receita é maior que a despesa. Qual é a mediana dos lucros mensais da cooperativa?',
          resolucao: [
            'Receita − despesa: jan 2; fev −2; mar 5; abr −1; mai 1; jun 4.',
            'Fevereiro e abril tiveram prejuízo e ficam fora. Lucros: 2, 5, 1 e 4.',
            'Em ordem: 1, 2, 4, 5. São 4 valores: mediana = (2 + 4) ÷ 2 = 3.',
            'Resposta: 3 milhões de reais.',
          ],
        },
        {
          enunciado: 'Use o gráfico da inflação de 2015 a 2025. Calcule a média e a mediana das 11 taxas anuais. Qual das duas descreve melhor um ano típico?',
          resolucao: [
            'Soma das 11 taxas: 62,05. Média: 62,05 ÷ 11 ≈ 5,64%.',
            'Em ordem: 2,95; 3,75; 4,26; 4,31; 4,52; 4,62; 4,83; 5,79; 6,29; 10,06; 10,67. Com 11 valores, a mediana é o 6º: 4,62%.',
            'Os dois anos acima de 10% puxam a média para cima. Em 7 dos 11 anos, a inflação ficou abaixo dela.',
            'Resposta: média ≈ 5,64% e mediana 4,62%. A mediana descreve melhor um ano típico.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: em gráficos com duas séries, a questão pede uma conta entre elas (diferença, lucro, saldo) antes da medida estatística. Faça a tabela da diferença mês a mês.',
      confira: { pergunta: 'Em um gráfico de receita e despesa, um mês teve receita 6 e despesa 8. Como ele entra na mediana dos lucros?', opcoes: ['com lucro 2', 'fica de fora', 'com lucro 14'], certa: 1, porque: 'Receita menos despesa dá −2: o mês teve prejuízo. Na mediana dos lucros, ele fica de fora.' },
    },
    {
      titulo: 'Gráfico de setores',
      paragrafos: [
        'O gráfico de setores, ou de pizza, mostra como um todo se divide em partes. O círculo inteiro vale 100% e 360°.',
        'Cada 1% vale 3,6°, então o ângulo de um setor é porcentagem · 3,6. Um setor de 25% é um quarto do círculo, com 90°.',
        'Para passar de porcentagem para quantidade de pessoas, multiplique a taxa unitária pelo total.',
      ],
      figura: {
        svg: '<svg viewBox="0 20 320 160" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><g stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M80 100L80 30A70 70 0 0 1 101.6 166.6Z" fill-opacity="0.8"/><path d="M80 100L101.6 166.6A70 70 0 0 1 13.4 121.6Z" fill-opacity="0.55"/><path d="M80 100L13.4 121.6A70 70 0 0 1 23.4 58.9Z" fill-opacity="0.32"/><path d="M80 100L23.4 58.9A70 70 0 0 1 58.4 33.4Z" fill="#ffe76a"/><path d="M80 100L58.4 33.4A70 70 0 0 1 80 30Z" fill-opacity="0.05"/></g><g stroke="currentColor"><rect x="168" y="41" width="13" height="13" fill-opacity="0.8"/><rect x="168" y="67" width="13" height="13" fill-opacity="0.55"/><rect x="168" y="93" width="13" height="13" fill-opacity="0.32"/><rect x="168" y="119" width="13" height="13" fill="#ffe76a"/><rect x="168" y="145" width="13" height="13" fill-opacity="0.05"/></g><text x="188" y="52">ônibus 45% · 162°</text><text x="188" y="78">a pé 25% · 90°</text><text x="188" y="104">carro/moto 15% · 54°</text><text x="188" y="130">bicicleta 10% · 36°</text><text x="188" y="156">outros 5% · 18°</text></svg>',
        alt: 'Gráfico de setores sobre como os alunos de uma escola chegam até ela. Ônibus, 45%, setor de 162 graus. A pé, 25%, 90 graus. Carro ou moto, 15%, 54 graus. Bicicleta, 10%, 36 graus, setor destacado. Outros, 5%, 18 graus. Ao lado, uma legenda com essas porcentagens e ângulos.',
        legenda: 'Figura 4. Como os alunos de uma escola chegam até ela. Ângulo = porcentagem · 3,6°.',
      },
      exemplos: [
        {
          enunciado: 'Em uma escola com 640 alunos, a Figura 4 mostra como eles chegam à escola. Quantos vão de bicicleta, e qual é o ângulo do setor de quem vai de ônibus?',
          resolucao: [
            'Bicicleta: 10% de 640 = 0,10 · 640 = 64 alunos.',
            'Ônibus: 45% de 360° = 0,45 · 360 = 162°.',
            'Resposta: 64 alunos e 162°.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: a questão pode dar o ângulo e pedir a porcentagem (divida por 3,6) ou dar a porcentagem e pedir quantas pessoas são (multiplique pelo total).',
      confira: { pergunta: 'Em um gráfico de setores, um setor representa 20% do total. Qual é o ângulo dele?', opcoes: ['20°', '36°', '72°'], certa: 2, porque: 'Cada 1% vale 3,6°, então o ângulo é 20 · 3,6 = 72°.' },
    },
  ],
  armadilhas: [
    'Calcular a mediana sem ordenar os dados.',
    'Esquecer, com quantidade par de dados, de fazer a média dos dois valores centrais.',
    'Fazer média simples quando há pesos ou frequências: em tabela de frequência, divida pelo total de frequências.',
    'Confundir a moda com o tamanho da barra: a moda é o valor que a barra representa.',
    'Incluir na conta dados que a questão mandou deixar de fora, como meses com prejuízo quando se pede a mediana dos lucros.',
    'Comparar barras sem olhar a escala e o ponto de partida do eixo.',
  ],
  resumo: [
    'Média = soma ÷ quantidade. Logo, soma = média · quantidade.',
    'Média ponderada = soma de (valor · peso) ÷ soma dos pesos. Em tabela, a frequência é o peso.',
    'Mediana: ordene e pegue o centro. Com n par, faça a média dos termos n ÷ 2 e n ÷ 2 + 1.',
    'Em tabela de frequência, use a frequência acumulada para achar as posições centrais.',
    'Moda é o valor mais frequente; pode haver mais de uma ou nenhuma.',
    'Valores extremos puxam a média, mas quase não mexem na mediana.',
    'Setores: 100% = 360°, então 1% = 3,6°.',
  ],
  pergunta: {
    enunciado: 'Qual é a mediana dos valores 2, 3, 3, 5 e 12?',
    alternativas: { A: '5', B: '4', C: '3', D: '7' },
    certa: 'C',
    porque: 'Os valores já estão em ordem e são cinco; o termo central é o 3º, que vale 3. A média, que é 5, seria outra medida.',
  },
  fontes: [
    { titulo: 'Wikilivros, Matemática elementar/Estatística', url: 'https://pt.wikibooks.org/w/index.php?oldid=457338', revisao: '457338 (28/03/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática elementar/Médias', url: 'https://pt.wikibooks.org/w/index.php?oldid=212833', revisao: '212833 (07/03/2011)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H27, H29 e H30)', url: 'https://download.inep.gov.br/download/enem/matriz_referencia.pdf', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Seções 1 a 3 adaptadas do Wikilivros: Matemática elementar/Estatística e Matemática elementar/Médias (autores: ver o histórico de cada página), CC BY-SA 3.0. Adaptação da equipe Prumo em CC BY-SA 4.0. Alterações: linguagem simplificada, regra da mediana para quantidade par acrescentada, exemplos e tabelas novos. As seções 4 a 7 (tabelas de frequência e gráficos) são texto original da equipe Prumo.',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
