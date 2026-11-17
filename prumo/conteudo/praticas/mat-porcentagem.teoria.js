// Teoria do tópico de prática mat-porcentagem.
// Adaptação da equipe Prumo (CC BY-SA 4.0) a partir do livro "Matemática financeira" do Wikilivros (CC BY-SA 3.0).
// Seções 2, 3 e 4 (fator multiplicativo, variações em sequência, problema inverso) são texto original da equipe.
export const teoria = {
  id: 'mat-porcentagem',
  titulo: 'Porcentagem e juros',
  porQueCai: 'O Enem cobra porcentagem em compras, salários, contas, vagas de emprego e financiamentos. Quase sempre há mais de uma variação seguida, e a dificuldade está em saber sobre qual valor cada porcentagem é calculada.',
  habilidades: [
    { codigo: 'H3', descricao: 'Resolver situação-problema envolvendo conhecimentos numéricos.' },
    { codigo: 'H4', descricao: 'Avaliar a razoabilidade de um resultado numérico na construção de argumentos sobre afirmações quantitativas.' },
    { codigo: 'H5', descricao: 'Avaliar propostas de intervenção na realidade utilizando conhecimentos numéricos.' },
    { codigo: 'H18', descricao: 'Avaliar propostas de intervenção na realidade envolvendo variação de grandezas.' },
    { codigo: 'H23', descricao: 'Avaliar propostas de intervenção na realidade utilizando conhecimentos algébricos.' },
  ],
  secoes: [
    {
      titulo: 'Porcentagem é uma razão com denominador 100',
      paragrafos: [
        'Uma razão compara duas grandezas por divisão. Porcentagem é a razão em que o denominador é 100: 20% quer dizer 20 em cada 100, ou 20/100.',
        'A mesma taxa pode ser escrita de dois jeitos. A taxa percentual é 20%; a taxa unitária é 0,20, que é o número usado nas contas. Para passar da unitária para a percentual, multiplique por 100%: 1/5 = 0,20 = 20%.',
        'Para calcular x% de um valor, multiplique o valor pela taxa unitária. Para descobrir quantos por cento uma parte representa do todo, divida a parte pelo todo.',
        'Em contas de cabeça, ajuda partir de 10% (divida por 10) e de 1% (divida por 100). Com eles você monta 5%, 15%, 35% e qualquer outra taxa.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 240" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="14" fill="currentColor"><rect x="20" y="20" width="200" height="60" fill="currentColor" fill-opacity="0.45"/><rect x="20" y="80" width="100" height="20" fill="currentColor" fill-opacity="0.45"/><path d="M20 40H220M20 60H220M20 80H220M20 100H220M20 120H220M20 140H220M20 160H220M20 180H220M20 200H220M40 20V220M60 20V220M80 20V220M100 20V220M120 20V220M140 20V220M160 20V220M180 20V220M200 20V220" stroke="currentColor" stroke-opacity="0.55" stroke-width="1" fill="none"/><rect x="20" y="20" width="200" height="200" stroke="currentColor" stroke-width="2" fill="none"/><text x="234" y="90">35 de 100</text><text x="234" y="115">= 35/100</text><text x="234" y="140">= 0,35</text><text x="234" y="165">= 35%</text></svg>',
        alt: 'Quadrado dividido em 100 quadradinhos iguais, 10 por linha. As três primeiras linhas inteiras e mais 5 quadradinhos da quarta linha estão pintados, somando 35. Ao lado está escrito: 35 de 100, igual a 35 sobre 100, igual a 0,35, igual a 35%.',
        legenda: 'Figura 1. Porcentagem como parte de 100: 35 quadradinhos pintados em 100 são 35%.',
      },
      exemplos: [
        {
          enunciado: 'Calcule 35% de R$ 240,00 sem calculadora.',
          resolucao: [
            '10% de 240 é 240 ÷ 10 = 24.',
            '30% é o triplo: 3 · 24 = 72. E 5% é a metade de 10%: 24 ÷ 2 = 12.',
            '35% = 30% + 5% = 72 + 12 = 84. Conferindo com a taxa unitária: 0,35 · 240 = 84.',
            'Resposta: R$ 84,00.',
          ],
        },
        {
          enunciado: 'Em uma turma de 40 alunos de uma ETEC, 14 vão para a escola de ônibus. Que porcentagem da turma usa ônibus?',
          resolucao: [
            'Parte ÷ todo: 14 ÷ 40 = 0,35.',
            'Taxa unitária 0,35 vezes 100% dá 35%.',
            'Resposta: 35% da turma, como na Figura 1.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: a porcentagem quase nunca aparece sozinha. Ela é o primeiro passo de uma conta maior, então vale treinar até ela sair rápido.',
    },
    {
      titulo: 'Aumentos e descontos: o fator multiplicativo',
      paragrafos: [
        'Um desconto é calculado como o juro: valor vezes a taxa unitária. Um produto de R$ 500,00 com 5% de desconto sai por 500 − 0,05 · 500 = 475 reais.',
        'Há um caminho mais curto. Quem tem 5% de desconto paga 95% do preço, então basta multiplicar por 0,95. Esse número é o fator multiplicativo: aumento de taxa i é fator (1 + i), e desconto de taxa i é fator (1 − i).',
        'Para achar a variação percentual entre dois valores, use (valor novo − valor antigo) ÷ valor antigo. A base da conta é sempre o valor de antes.',
      ],
      tabela: {
        cabecalho: ['Situação', 'Taxa unitária', 'Multiplique por'],
        linhas: [
          ['aumento de 6%', '0,06', '1,06'],
          ['aumento de 30%', '0,30', '1,30'],
          ['aumento de 100% (dobrar)', '1,00', '2'],
          ['desconto de 4%', '0,04', '0,96'],
          ['desconto de 25%', '0,25', '0,75'],
          ['queda de 75%', '0,75', '0,25'],
        ],
        legenda: 'Tabela 1. Fatores multiplicativos. Aumento: 1 + taxa. Desconto: 1 − taxa.',
      },
      exemplos: [
        {
          enunciado: 'O salário de Rita era R$ 1 850,00 e teve reajuste de 6%. Qual é o novo salário?',
          resolucao: [
            'Aumento de 6%: fator 1,06.',
            '1 850 · 1,06 = 1 961.',
            'Resposta: R$ 1 961,00.',
          ],
        },
        {
          enunciado: 'A conta de água de uma família, de R$ 120,00, foi paga com atraso e ficou em R$ 126,00. De quantos por cento foi a multa?',
          resolucao: [
            'Diferença: 126 − 120 = 6 reais.',
            'Base é o valor antigo: 6 ÷ 120 = 0,05.',
            'Resposta: multa de 5%.',
          ],
        },
        {
          enunciado: 'O grêmio de uma escola precisa de 1 030 copos para a festa junina. Os copos são vendidos em pacotes de 50, a R$ 9,00 o pacote, e o grêmio tem R$ 180,00. Que desconto, em porcentagem, precisa ser negociado?',
          resolucao: [
            'Pacotes: 1 030 ÷ 50 = 20,6. Com 20 pacotes faltam copos, então são 21 pacotes.',
            'Preço sem desconto: 21 · 9 = 189 reais.',
            'O desconto precisa ser de 189 − 180 = 9 reais, calculado sobre o preço cheio: 9 ÷ 189 ≈ 0,048.',
            'Resposta: cerca de 4,8% de desconto.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: em perguntas de desconto necessário, a porcentagem é calculada sobre o preço sem desconto, nunca sobre o dinheiro que se tem.',
    },
    {
      titulo: 'Variações em sequência',
      paragrafos: [
        'Quando um valor sofre duas ou mais variações seguidas, multiplique os fatores. Cada nova porcentagem é calculada sobre o valor que já foi alterado, por isso não dá para somar as taxas.',
        'Leia com cuidado expressões como “10% maior que o preço normal” ou “25% menor que o deste ano”. Elas dizem qual é a base daquela porcentagem.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 134" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="13" fill="currentColor"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="30" width="64" height="40" rx="6"/><rect x="128" y="30" width="64" height="40" rx="6"/><rect x="248" y="30" width="64" height="40" rx="6" stroke-width="3"/><path d="M74 50H118M194 50H238"/><path d="M40 74Q160 128 272 79" stroke-dasharray="5 4"/></g><path d="M126 50L116 45V55zM246 50L236 45V55zM279.3 75.7L274.1 83.6L269.9 74.4z" fill="currentColor"/><g text-anchor="middle"><text x="40" y="56" font-size="16">500</text><text x="160" y="56" font-size="16">600</text><text x="280" y="56" font-size="16">540</text><text x="100" y="42">× 1,20</text><text x="100" y="68">+20%</text><text x="220" y="42">× 0,90</text><text x="220" y="68">−10%</text><text x="160" y="124">no total: × 1,08 (+8%)</text></g></svg>',
        alt: 'Esquema com três caixas em linha: 500, 600 e 540. Uma seta da primeira para a segunda indica vezes 1,20, aumento de 20%. Uma seta da segunda para a terceira indica vezes 0,90, desconto de 10%. Uma seta curva tracejada liga a primeira caixa à última, com a indicação: no total, vezes 1,08, aumento de 8%.',
        legenda: 'Figura 2. Aumento de 20% seguido de desconto de 10%: os fatores se multiplicam, 1,20 · 0,90 = 1,08.',
      },
      exemplos: [
        {
          enunciado: 'Um produto de R$ 500,00 sobe 20% e depois tem desconto de 10%. Qual é o preço final e a variação total?',
          resolucao: [
            'Fatores: 1,20 e 0,90.',
            'Preço final: 500 · 1,20 · 0,90 = 600 · 0,90 = 540 reais.',
            'Fator total: 1,20 · 0,90 = 1,08, aumento de 8%. Somar as taxas daria 20% − 10% = 10%, o que está errado.',
            'Resposta: R$ 540,00, aumento total de 8% (Figura 2).',
          ],
        },
        {
          enunciado: 'Uma bicicleta custa R$ 800,00 no Pix. No crediário, o preço é 15% maior. Quem paga com o cartão da loja tem 4% de desconto sobre o preço do crediário. Um cliente pensou: “15% − 4% = 11%, então vou pagar 800 · 1,11”. Quanto ele vai pagar de verdade, e qual a diferença para a conta dele?',
          resolucao: [
            'Preço do crediário: 800 · 1,15 = 920 reais.',
            'Desconto de 4% sobre 920: 920 · 0,96 = 883,20 reais.',
            'Conta do cliente: 800 · 1,11 = 888 reais. O erro foi aplicar os 4% sobre 800, e não sobre 920.',
            'Resposta: ele paga R$ 883,20, ou seja, R$ 4,80 a menos do que calculou.',
          ],
        },
        {
          enunciado: 'A fila de espera de um posto de saúde tinha 300 pessoas no ano passado e cresceu 20% neste ano. Sem mudanças, no próximo ano a fila seria igual à deste ano. A prefeitura quer que ela fique 30% menor que a deste ano. Cada equipe nova atende 15 pessoas da fila por ano. Quantas equipes novas, no mínimo, são necessárias?',
          resolucao: [
            'Fila deste ano: 300 · 1,20 = 360 pessoas.',
            'Meta: 30% menor que 360, ou seja, 360 · 0,70 = 252 pessoas.',
            'É preciso atender 360 − 252 = 108 pessoas a mais.',
            '108 ÷ 15 = 7,2. Com 7 equipes, só 105 pessoas saem da fila, e a meta não é atingida.',
            'Resposta: 8 equipes.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: a alternativa errada mais comum é a que soma ou subtrai as taxas. Outra é a que aplica uma porcentagem sobre o valor errado.',
    },
    {
      titulo: 'Voltar ao valor de antes',
      paragrafos: [
        'Às vezes a questão dá o valor depois da variação e pergunta o valor original. Como valor novo = valor antigo · fator, o caminho de volta é dividir: valor antigo = valor novo ÷ fator.',
        'Uma queda de 60% significa que sobrou 40% do valor antigo. Por isso se divide por 0,40, e não se multiplica por 1,60.',
      ],
      exemplos: [
        {
          enunciado: 'Com 25% de desconto, uma mochila saiu por R$ 135,00. Qual era o preço sem desconto?',
          resolucao: [
            'Fator do desconto: 0,75. Então preço antigo · 0,75 = 135.',
            'Preço antigo = 135 ÷ 0,75 = 180.',
            'Conferindo: 25% de 180 é 45, e 180 − 45 = 135.',
            'Resposta: R$ 180,00.',
          ],
        },
        {
          enunciado: 'As matrículas em um curso noturno caíram 60% de um ano para o outro e chegaram a 1 240. Quantas eram no ano anterior?',
          resolucao: [
            'Depois da queda de 60%, restaram 40%: matrículas antigas · 0,40 = 1 240.',
            'Matrículas antigas = 1 240 ÷ 0,40 = 3 100.',
            'Conferindo: 60% de 3 100 é 1 860, e 3 100 − 1 860 = 1 240. Já 1 240 · 1,60 = 1 984 não confere.',
            'Resposta: 3 100 matrículas.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as alternativas costumam trazer o resultado de multiplicar por (1 + taxa). Sempre confira aplicando a variação ao valor encontrado.',
    },
    {
      titulo: 'Juros simples e juros compostos',
      paragrafos: [
        'Juro (J) é a remuneração paga pelo uso do dinheiro. O capital (C) é o valor no início, a taxa (i) é a razão entre o juro de um período e o capital, e o montante (M) é capital mais juro: M = C + J.',
        'Nos juros simples, a taxa incide só sobre o capital inicial, e o juro de cada período é sempre o mesmo: J = C · i · t e M = C · (1 + i · t). Nos juros compostos, o juro de cada período é somado ao capital e passa a render também: M = C · (1 + i)ᵗ.',
        'A expressão (1 + i)ᵗ é o fator de capitalização. Taxa e tempo devem estar na mesma unidade, e a taxa entra na forma unitária.',
      ],
      tabela: {
        cabecalho: ['Fim do ano', 'Juros simples (R$)', 'Juros compostos (R$)'],
        linhas: [
          ['1', '1 100,00', '1 100,00'],
          ['2', '1 200,00', '1 210,00'],
          ['3', '1 300,00', '1 331,00'],
          ['4', '1 400,00', '1 464,10'],
        ],
        legenda: 'Tabela 2. R$ 1 000,00 aplicados a 10% ao ano. No simples, o juro é sempre R$ 100; no composto, cresce a cada ano.',
      },
      figura: {
        svg: '<svg viewBox="0 0 320 240" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><g stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="3 3"><path d="M50 151.4H305M50 102.9H305M50 54.3H305"/></g><path d="M50 30V200H305" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="50,200 100,175.7 150,151.4 200,127.1 250,102.9 300,78.6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="7 5"/><polyline points="50,200 100,175.7 150,149 200,119.6 250,87.3 300,51.7" fill="none" stroke="currentColor" stroke-width="3"/><g><circle cx="100" cy="175.7" r="3"/><circle cx="150" cy="149" r="3"/><circle cx="200" cy="119.6" r="3"/><circle cx="250" cy="87.3" r="3"/><circle cx="300" cy="51.7" r="3"/><circle cx="50" cy="200" r="3"/></g><g text-anchor="end"><text x="44" y="204">1 000</text><text x="44" y="155.4">1 200</text><text x="44" y="106.9">1 400</text><text x="44" y="58.3">1 600</text></g><g text-anchor="middle"><text x="50" y="218">0</text><text x="100" y="218">1</text><text x="150" y="218">2</text><text x="200" y="218">3</text><text x="250" y="218">4</text><text x="300" y="218">5</text><text x="177" y="234">tempo (anos)</text></g><text x="8" y="18">montante (R$)</text><path d="M62 40H86" stroke="currentColor" stroke-width="3"/><text x="92" y="44">juros compostos</text><path d="M62 60H86" stroke="currentColor" stroke-width="2" stroke-dasharray="7 5"/><text x="92" y="64">juros simples</text></svg>',
        alt: 'Gráfico de linhas do montante, em reais, ao longo de 5 anos, para R$ 1 000,00 a 10% ao ano. O eixo vertical começa em 1 000 e vai até 1 700. A linha tracejada dos juros simples é reta: 1 000, 1 100, 1 200, 1 300, 1 400 e 1 500. A linha cheia dos juros compostos começa junto e vai se curvando para cima: 1 000, 1 100, 1 210, 1 331, 1 464,10 e 1 610,51.',
        legenda: 'Figura 3. Juros simples crescem em linha reta; juros compostos crescem cada vez mais rápido. Atenção: o eixo vertical começa em R$ 1 000.',
      },
      exemplos: [
        {
          enunciado: 'Luís pegou R$ 2 400,00 emprestados a juros simples de 2% ao mês, por 1 ano. Quanto vai devolver?',
          resolucao: [
            'Taxa mensal pede tempo em meses: 1 ano = 12 meses.',
            'J = 2 400 · 0,02 · 12 = 576 reais.',
            'M = 2 400 + 576 = 2 976 reais.',
            'Resposta: R$ 2 976,00.',
          ],
        },
        {
          enunciado: 'Uma dívida de R$ 5 000,00 cresce a juros compostos de 1% ao mês. Quanto ela vale depois de 3 meses?',
          resolucao: [
            'Fator de capitalização: 1,01³ = 1,01 · 1,01 · 1,01 = 1,030301.',
            'M = 5 000 · 1,030301 = 5 151,505.',
            'Resposta: cerca de R$ 5 151,51. A juros simples seriam R$ 5 150,00.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: juros compostos aparecem em compras parceladas e financiamentos. A potência costuma ser pequena (2 ou 3 períodos) ou vem dada no enunciado.',
    },
    {
      titulo: 'Descapitalização: quanto vale hoje um pagamento futuro',
      paragrafos: [
        'Capitalizar é levar um valor para o futuro, multiplicando pelo fator. Descapitalizar é o caminho inverso: sabendo quanto será pago no futuro, descobrir quanto isso vale hoje. Nos juros compostos, divide-se por (1 + i)ᵗ.',
        'Em uma compra parcelada com juros, o preço à vista é a soma dos valores de hoje de todas as parcelas. Cada parcela é dividida pelo fator do seu próprio prazo.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 176" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="13" fill="currentColor"><path d="M20 46H304M40 40V52M160 40V52M280 40V52" stroke="currentColor" stroke-width="2" fill="none"/><g text-anchor="middle"><text x="40" y="30">hoje</text><text x="160" y="30">1 mês</text><text x="280" y="30">2 meses</text><text x="160" y="84">315,00</text><text x="280" y="128">330,75</text><text x="40" y="84">300,00</text><text x="40" y="128">300,00</text><text x="100" y="70">÷ 1,05</text><text x="160" y="114">÷ 1,05² = ÷ 1,1025</text></g><path d="M128 80H82M248 124H82" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M74 80L84 75V85zM74 124L84 119V129z" fill="currentColor"/><text x="16" y="164">à vista: 300,00 + 300,00 = R$ 600,00</text></svg>',
        alt: 'Linha do tempo com três marcas: hoje, 1 mês e 2 meses. A parcela de 315,00 em 1 mês tem uma seta para hoje com a indicação dividir por 1,05, chegando a 300,00. A parcela de 330,75 em 2 meses tem uma seta para hoje com a indicação dividir por 1,05 ao quadrado, que é 1,1025, chegando a 300,00. Embaixo: à vista, 300,00 mais 300,00, igual a R$ 600,00.',
        legenda: 'Figura 4. Cada parcela é trazida para hoje dividindo pelo fator do seu prazo, com juros compostos de 5% ao mês.',
      },
      exemplos: [
        {
          enunciado: 'Uma loja vende uma TV em duas parcelas, com juros compostos de 5% ao mês: R$ 315,00 um mês após a compra e R$ 330,75 dois meses após a compra. Qual é o preço à vista equivalente?',
          resolucao: [
            'Primeira parcela, 1 mês: 315 ÷ 1,05 = 300.',
            'Segunda parcela, 2 meses: 1,05² = 1,1025, e 330,75 ÷ 1,1025 = 300.',
            'Preço à vista: 300 + 300 = 600.',
            'Somar as parcelas daria 645,75, que inclui os juros. Por isso essa conta não dá o preço à vista.',
            'Resposta: R$ 600,00 (Figura 4).',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: o enunciado fala em “valor à vista” ou “nota fiscal” de uma compra financiada. As alternativas trazem a soma das parcelas como distrator.',
    },
  ],
  armadilhas: [
    'Somar porcentagens seguidas: aumento de 10% e depois desconto de 10% dá fator 1,1 · 0,9 = 0,99, uma queda de 1%, e não zero.',
    'Calcular a porcentagem sobre a base errada: “4% de desconto sobre o preço do crediário” é sobre o preço do crediário, não sobre o preço à vista.',
    'No problema inverso, multiplicar por (1 + taxa) em vez de dividir pelo fator: depois de uma queda de 75%, o valor antigo é o novo ÷ 0,25.',
    'Arredondar para baixo quando a pergunta pede o mínimo: 7,2 equipes ou 20,6 pacotes viram 8 e 21.',
    'Misturar unidades: taxa de 2% ao mês com prazo de 1 ano exige t = 12.',
    'Achar o preço à vista de uma compra com juros somando as parcelas: cada parcela precisa ser dividida pelo seu fator.',
  ],
  resumo: [
    'x% = x/100. Taxa unitária × valor dá a porcentagem do valor.',
    'Parte ÷ todo dá a taxa. Variação percentual = (novo − antigo) ÷ antigo.',
    'Aumento de i: multiplique por (1 + i). Desconto de i: multiplique por (1 − i).',
    'Variações seguidas: multiplique os fatores, nunca some as taxas.',
    'Para voltar ao valor antigo, divida o valor novo pelo fator.',
    'Juros simples: J = C · i · t. Juros compostos: M = C · (1 + i)ᵗ.',
    'Valor de hoje de um pagamento futuro: divida por (1 + i)ᵗ.',
  ],
  pergunta: {
    enunciado: 'Um produto teve aumento de 20% e, depois, desconto de 20%. Em relação ao preço original, o preço final é:',
    alternativas: { A: 'igual ao original', B: '4% menor', C: '4% maior', D: '40% menor' },
    certa: 'B',
    porque: 'Os fatores se multiplicam: 1,2 · 0,8 = 0,96. O preço final é 96% do original, ou seja, 4% menor.',
  },
  fontes: [
    { titulo: 'Wikilivros, Matemática financeira/Porcentagem', url: 'https://pt.wikibooks.org/w/index.php?oldid=456617', revisao: '456617 (02/02/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática financeira/Conceitos básicos', url: 'https://pt.wikibooks.org/w/index.php?oldid=460858', revisao: '460858 (19/11/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática financeira/Juros simples', url: 'https://pt.wikibooks.org/w/index.php?oldid=290594', revisao: '290594 (28/08/2015)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática financeira/Juros compostos', url: 'https://pt.wikibooks.org/w/index.php?oldid=478154', revisao: '478154 (15/03/2022)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática financeira/Fluxo de caixa', url: 'https://pt.wikibooks.org/w/index.php?oldid=458976', revisao: '458976 (28/07/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H3, H4, H5, H18 e H23)', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/matriz-de-referencia', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Texto adaptado do livro Matemática financeira, do Wikilivros (capítulos Porcentagem, Conceitos básicos, Juros simples, Juros compostos e Fluxo de caixa; autores: ver o histórico de cada página), CC BY-SA 3.0. Adaptação da equipe Prumo em CC BY-SA 4.0. Alterações: linguagem simplificada, definições reorganizadas, notação t para o prazo, exemplos, figuras e tabelas novos. As seções 2, 3 e 4 (aumentos e descontos, variações em sequência e voltar ao valor de antes) são texto original da equipe Prumo.',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
