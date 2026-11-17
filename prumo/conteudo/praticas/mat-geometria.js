// Tópico de prática com questões reais do Enem (INEP, CC BY-ND 3.0). Gerado a partir do spec da equipe.
export const topico = {
  "id": "mat-geometria",
  "area": "MT",
  "materia": "Matemática",
  "titulo": "Geometria: áreas e volumes",
  "descricao": "Calcular áreas de figuras planas e volumes de sólidos (prismas, cilindros, cones e esferas) em situações do dia a dia.",
  "ideias": [
    "Áreas básicas: retângulo = base × altura; triângulo = base × altura ÷ 2; triângulo equilátero de lado L = L²√3 ÷ 4; círculo = π·r². Figura complicada: divida em partes conhecidas.",
    "Prisma e cilindro: volume = área da base × altura. Cone e pirâmide: um terço disso. Esfera: (4/3)·π·r³.",
    "Dobrar o raio de um círculo multiplica a área por 4; dobrar só a altura de um sólido dobra o volume. Escreva a fórmula e substitua as mudanças.",
    "Volume de algo oco ou recortado: calcule o sólido inteiro e subtraia as partes retiradas.",
    "Deixe tudo na mesma unidade antes de calcular (80 cm = 0,8 m) e confira se a pergunta é sobre diâmetro ou raio."
  ],
  "questoes": [
    {
      "id": "enem-2021-171",
      "ano": 2021,
      "numero": 171,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 899,
      "coItem": 88461,
      "habilidade": "H13",
      "a": 2.261,
      "b": 1.886,
      "c": 0.082,
      "gabarito": "E",
      "contexto": "<p>O dono de uma loja pretende usar cartões imantados para a divulgação de sua loja. A empresa que fornecerá o serviço lhe informa que o custo de fabricação do cartão é de R$ 0,01 por centímetro quadrado e que disponibiliza modelos tendo como faces úteis para impressão:</p><ul><li>um triângulo equilátero de lado 12 cm;</li><li>um quadrado de lado 8 cm;</li><li>um retângulo de lados 11 cm e 8 cm;</li><li>um hexágono regular de lado 6 cm;</li><li>um círculo de diâmetro 10 cm.</li></ul><p>O dono da loja está disposto a pagar, no máximo, R$ 0,80 por cartão. Ele escolherá, dentro desse limite de preço, o modelo que tiver maior área de impressão.</p><p>Use 3 como aproximação para π e use 1,7 como aproximação para √3.</p>",
      "enunciado": "<p>Nessas condições, o modelo que deverá ser escolhido tem como face útil para impressão um</p>",
      "alternativas": {
        "A": "triângulo.",
        "B": "quadrado.",
        "C": "retângulo.",
        "D": "hexágono.",
        "E": "círculo."
      },
      "explicacao": "Como cada cm² custa R$ 0,01, o limite de R$ 0,80 permite no máximo 80 cm². Áreas: triângulo 144 × 1,7 ÷ 4 = 61,2; quadrado 64; retângulo 88; hexágono (seis triângulos equiláteros de lado 6) 6 × 36 × 1,7 ÷ 4 = 91,8; círculo de raio 5: 3 × 25 = 75. Retângulo e hexágono passam do limite. Entre os que cabem no orçamento, a maior área é a do círculo, com 75 cm².",
      "faltou": {
        "A": "Você escolheu o cartão mais barato (61,2 cm², R$ 0,61). O dono quer a maior área possível dentro do limite de R$ 0,80, e o círculo tem mais área sem passar do limite.",
        "B": "Você provavelmente usou o diâmetro 10 no lugar do raio e achou 3 × 10² = 300 cm² para o círculo, descartando-o; aí sobra o quadrado (64 cm²). O raio é 5, e o círculo tem 75 cm².",
        "C": "Você não conferiu o preço do retângulo: 11 × 8 = 88 cm² custa R$ 0,88, acima do limite de R$ 0,80.",
        "D": "Você escolheu a maior área de todas (hexágono, 91,8 cm²) sem olhar o preço. Esse cartão custa cerca de R$ 0,92, fora do limite."
      },
      "secao": 2,
      "nivel": "difícil",
      "fonte": "Enem 2021, 2º dia, Caderno Azul, questão 171. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 29); corrigidos \"para a divulgação de sua loja\", \"R$ 0,01\" e \"R$ 0,80\""
    },
    {
      "id": "enem-2022-169",
      "ano": 2022,
      "numero": 169,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 63204,
      "habilidade": "H9",
      "a": 3.783,
      "b": 1.89,
      "c": 0.144,
      "gabarito": "E",
      "contexto": "<p>Uma loja comercializa cinco modelos de caixas-d’água (I, II, III, IV e V), todos em formato de cilindro reto de base circular. Os modelos II, III, IV e V têm as especificações de suas dimensões dadas em relação às dimensões do modelo I, cuja profundidade é <em>P</em> e área da base é <em>A</em><sub>b</sub>, como segue:</p><ul><li>modelo II: o dobro da profundidade e a metade da área da base do modelo I;</li><li>modelo III: o dobro da profundidade e a metade do raio da base do modelo I;</li><li>modelo IV: a metade da profundidade e o dobro da área da base do modelo I;</li><li>modelo V: a metade da profundidade e o dobro do raio da base do modelo I.</li></ul><p>Uma pessoa pretende comprar nessa loja o modelo de caixa-d’água que ofereça a maior capacidade volumétrica.</p>",
      "enunciado": "<p>O modelo escolhido deve ser o</p>",
      "alternativas": {
        "A": "I.",
        "B": "II.",
        "C": "III.",
        "D": "IV.",
        "E": "V."
      },
      "explicacao": "O volume do cilindro é área da base × profundidade, então o modelo I tem V = Ab·P. No II: 2P × Ab/2 = V. No III, a metade do raio deixa a área da base 4 vezes menor: 2P × Ab/4 = V/2. No IV: P/2 × 2Ab = V. No V, o dobro do raio deixa a área da base 4 vezes maior: P/2 × 4Ab = 2V. O maior volume é o do modelo V.",
      "faltou": {
        "A": "Você achou que todas as mudanças se compensam (dobra uma coisa, divide a outra por 2) e que nenhum modelo supera o I. Isso só vale quando a área da base muda; quando muda o raio, a área muda ao quadrado.",
        "B": "Você achou que dobrar a profundidade pesa mais. No II, a área da base cai pela metade e o volume fica igual ao do I.",
        "C": "Você tratou metade do raio como metade da área da base. Como a área depende do raio ao quadrado, a base do III fica 4 vezes menor e o volume cai para a metade do I.",
        "D": "Você achou que dobrar a área da base pesa mais que reduzir a profundidade. No IV, a área dobra e a profundidade cai pela metade, então o volume fica igual ao do I (P/2 × 2Ab = V). Quem passa do I é o V: dobrar o raio quadruplica a área da base, e P/2 × 4Ab = 2V."
      },
      "secao": 6,
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 169. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 28)"
    },
    {
      "id": "enem-2023-165",
      "ano": 2023,
      "numero": 165,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1211,
      "coItem": 28932,
      "habilidade": "H8",
      "a": 2.394,
      "b": 1.984,
      "c": 0.115,
      "gabarito": "E",
      "contexto": "<p>A figura representa uma escada com três degraus, construída em concreto maciço, com suas medidas especificadas.</p><figure><img src=\"./conteudo/praticas/img/enem-2023-165-1.png\" alt=\"Escada de concreto com três degraus encostada na parede. Cada piso tem 0,25 m de profundidade, cada espelho tem 0,20 m de altura e a escada tem 1,0 m de largura. Uma seta indica a parede lateral, em forma de degraus.\"></figure><p>Nessa escada, pisos e espelhos têm formato retangular, e as paredes laterais têm formato de um polígono cujos lados adjacentes são perpendiculares. Pisos, espelhos e paredes laterais serão revestidos em cerâmica.</p>",
      "enunciado": "<p>A área a ser revestida em cerâmica, em metro quadrado, mede</p>",
      "alternativas": {
        "A": "1,20.",
        "B": "1,35.",
        "C": "1,65.",
        "D": "1,80.",
        "E": "1,95."
      },
      "explicacao": "Pisos: 3 retângulos de 1,0 × 0,25 = 0,75 m². Espelhos: 3 retângulos de 1,0 × 0,20 = 0,60 m². Cada parede lateral tem forma de escadinha; divida em três faixas de 0,25 m de largura com alturas 0,20, 0,40 e 0,60: 0,05 + 0,10 + 0,15 = 0,30 m². São duas paredes laterais (esquerda e direita), 0,60 m². Total: 0,75 + 0,60 + 0,60 = 1,95 m².",
      "faltou": {
        "A": "Você usou 0,20 m também para a profundidade dos pisos (6 × 1,0 × 0,20 = 1,20) e não contou as paredes laterais. O piso tem 0,25 m e as laterais também são revestidas.",
        "B": "Você somou só pisos (0,75) e espelhos (0,60). Faltaram as duas paredes laterais, que também recebem cerâmica.",
        "C": "Você contou só a parede lateral que aparece na figura. A escada tem duas laterais, cada uma com 0,30 m².",
        "D": "Você contou uma parede lateral só e ainda a tratou como um retângulo inteiro de 0,75 × 0,60 = 0,45 m² (0,75 + 0,60 + 0,45 = 1,80). A lateral tem forma de escadinha, com 0,30 m², e são duas."
      },
      "secao": 3,
      "nivel": "difícil",
      "fonte": "Enem 2023, 2º dia, Caderno Azul, questão 165. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 25)"
    },
    {
      "id": "enem-2020-140",
      "ano": 2020,
      "numero": 140,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 587,
      "coItem": 111432,
      "habilidade": "H13",
      "a": 1.181,
      "b": 2.233,
      "c": 0.207,
      "gabarito": "C",
      "contexto": "<p>O proprietário de um apartamento decidiu instalar porcelanato no piso da sala. Essa sala tem formato retangular com 3,2 m de largura e 3,6 m de comprimento. As peças do porcelanato têm formato de um quadrado com lado medindo 80 cm. Esse porcelanato é vendido em dois tipos de caixas, com os preços indicados a seguir.</p><ul><li>Caixas do tipo A: 4 unidades de piso, R$ 35,00;</li><li>Caixas do tipo B: 3 unidades de piso, R$ 27,00.</li></ul><p>Na instalação do porcelanato, as peças podem ser recortadas e devem ser assentadas sem espaçamento entre elas, aproveitando-se ao máximo os recortes feitos.</p>",
      "enunciado": "<p>A compra que atende às necessidades do proprietário, proporciona a menor sobra de pisos e resulta no menor preço é</p>",
      "alternativas": {
        "A": "5 caixas do tipo A.",
        "B": "1 caixa do tipo A e 4 caixas do tipo B.",
        "C": "3 caixas do tipo A e 2 caixas do tipo B.",
        "D": "5 caixas do tipo A e 1 caixa do tipo B.",
        "E": "6 caixas do tipo B."
      },
      "explicacao": "A peça tem 0,8 m de lado. Na largura cabem 3,2 ÷ 0,8 = 4 peças; no comprimento, 3,6 ÷ 0,8 = 4,5. São 4 fileiras de 4 peças inteiras mais 4 meias peças, que saem de 2 peças cortadas ao meio: 18 peças (confira: 11,52 m² ÷ 0,64 m² = 18). As opções com exatamente 18 peças são C (12 + 6, por 3 × 35 + 2 × 27 = R$ 159,00) e E (18, por R$ 162,00). A mais barata sem sobra é a C.",
      "faltou": {
        "A": "Você arredondou 4,5 para 5 peças por fileira e chegou a 20 peças, sem aproveitar os recortes. Cada peça cortada ao meio serve para duas fileiras, então bastam 18.",
        "B": "Você contou só as peças inteiras (4 × 4 = 16) e esqueceu a meia faixa que falta no comprimento. Com 16 peças, o piso não fica completo.",
        "D": "Você comprou peças demais (23). Quem não aproveita os recortes e ainda pega uma caixa a mais por segurança gasta mais e deixa sobra; o enunciado pede a menor sobra.",
        "E": "Você achou as 18 peças certas, mas não comparou os preços: 6 caixas B custam R$ 162,00, e 3 caixas A com 2 caixas B custam R$ 159,00."
      },
      "secao": 3,
      "nivel": "difícil",
      "fonte": "Enem 2020, 2º dia, Caderno Azul, questão 140. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 17); alternativa C corrigida pelo PDF"
    },
    {
      "id": "enem-2023-136",
      "ano": 2023,
      "numero": 136,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1211,
      "coItem": 48324,
      "habilidade": "H8",
      "a": 2.095,
      "b": 2.448,
      "c": 0.258,
      "gabarito": "B",
      "contexto": "<p>Um artista plástico esculpe uma escultura a partir de um bloco de madeira de lei, em etapas. Inicialmente, esculpe um cone reto com 36 cm de altura e diâmetro da base medindo 18 cm. Em seguida, remove desse cone um cone menor, cujo diâmetro da base mede 6 cm, obtendo, assim, um tronco de cone, conforme ilustrado na figura.</p><figure><img src=\"./conteudo/praticas/img/enem-2023-136-1.png\" alt=\"À esquerda, cone com 36 cm de altura e 18 cm de diâmetro da base, com um corte perto do topo onde o diâmetro é 6 cm. Uma seta leva à figura da direita: o tronco de cone que sobra, atravessado por um furo cilíndrico de base a base.\"></figure><p>Em seguida, perfura esse tronco de cone, removendo um cilindro reto, de diâmetro 6 cm, cujo eixo de simetria é o mesmo do cone original. Dessa forma, ao final, a escultura tem a forma de um tronco de cone com uma perfuração cilíndrica de base a base. O tipo de madeira utilizada para produzir essa escultura tem massa igual a 0,6 g por centímetro cúbico de volume. Utilize 3 como aproximação para π.</p>",
      "enunciado": "<p>Qual é a massa, em grama, dessa escultura?</p>",
      "alternativas": {
        "A": "1 198,8",
        "B": "1 296,0",
        "C": "1 360,8",
        "D": "4 665,6",
        "E": "4 860,0"
      },
      "explicacao": "Cone inteiro (raio 9, altura 36): (1/3) × 3 × 81 × 36 = 2 916 cm³. O cone retirado tem raio 3, que é 1/3 do raio 9, então sua altura também é 1/3: 12 cm; volume (1/3) × 3 × 9 × 12 = 108 cm³. O tronco fica com 2 808 cm³ e altura 36 − 12 = 24 cm. O furo é um cilindro de raio 3 e altura 24: 3 × 9 × 24 = 648 cm³. Sobram 2 808 − 648 = 2 160 cm³, e a massa é 2 160 × 0,6 = 1 296 g.",
      "faltou": {
        "A": "Você usou altura errada para o furo, como 36 − 6 = 30 cm (confundindo o diâmetro 6 com a altura do cone pequeno). Isso retira volume demais; a altura do tronco é 24 cm.",
        "C": "Você retirou o cilindro mas esqueceu de retirar o cone pequeno do topo: 2 916 − 648 = 2 268 cm³, que dá 1 360,8 g.",
        "D": "Você calculou os cones sem o fator 1/3, como se fossem cilindros: 8 748 − 324 − 648 = 7 776 cm³. O volume do cone é um terço do volume do cilindro de mesma base e altura.",
        "E": "Você esqueceu o fator 1/3 dos cones e também não retirou o cone pequeno: 8 748 − 648 = 8 100 cm³, que dá 4 860 g."
      },
      "secao": 5,
      "nivel": "difícil",
      "fonte": "Enem 2023, 2º dia, Caderno Azul, questão 136. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 16)"
    },
    {
      "id": "enem-2022-174",
      "ano": 2022,
      "numero": 174,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 14797,
      "habilidade": "H8",
      "a": 2.939,
      "b": 2.578,
      "c": 0.12,
      "gabarito": "D",
      "contexto": "<p>Peças metálicas de aeronaves abandonadas em aeroportos serão recicladas. Uma dessas peças é maciça e tem o formato cilíndrico, com a medida do raio da base igual a 4 cm e a da altura igual a 50 cm. Ela será derretida, e o volume de metal resultante será utilizado para a fabricação de esferas maciças com diâmetro de 1 cm, a serem usadas para confeccionar rolamentos. Para estimar a quantidade de esferas que poderão ser produzidas a partir de cada uma das peças cilíndricas, admite-se que não ocorre perda de material durante o processo de derretimento.</p>",
      "enunciado": "<p>Quantas dessas esferas poderão ser obtidas a partir de cada peça cilíndrica?</p>",
      "alternativas": {
        "A": "800",
        "B": "1 200",
        "C": "2 400",
        "D": "4 800",
        "E": "6 400"
      },
      "explicacao": "Volume da peça: π × 4² × 50 = 800π cm³. Cada esfera tem diâmetro 1 cm, ou seja, raio 0,5 cm: (4/3) × π × 0,5³ = (4/3) × π × (1/8) = π/6 cm³. Número de esferas: 800π ÷ (π/6) = 800 × 6 = 4 800.",
      "faltou": {
        "A": "Você parou no volume da peça, 800π, e tirou só o π, como se cada esfera ocupasse π cm³. Falta dividir pelo volume real da esfera, π/6 cm³.",
        "B": "Você elevou o raio da esfera só à primeira potência: (4/3) × π × 0,5 = 2π/3, e 800π ÷ (2π/3) = 1 200. Na fórmula da esfera o raio vai ao cubo.",
        "C": "Você elevou o raio da esfera ao quadrado em vez de ao cubo: (4/3) × π × 0,25 = π/3, e 800π ÷ (π/3) = 2 400.",
        "E": "Você esqueceu o fator 4/3 e tomou a esfera como π × 0,5³ = π/8: 800π ÷ (π/8) = 6 400."
      },
      "secao": 5,
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 174. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 29); separador de milhar das alternativas como no caderno"
    }
  ],
  "autoria": {
    "equipe": "Prumo",
    "ia": "Claude Opus 5.5 (Anthropic), via Claude Code",
    "revisao": "pendente"
  }
};
