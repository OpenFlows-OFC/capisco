// Tópico de prática com questões reais do Enem (INEP, CC BY-ND 3.0). Gerado a partir do spec da equipe.
export const topico = {
  "id": "mat-proporcao",
  "area": "MT",
  "materia": "Matemática",
  "titulo": "Razão, proporção e escala",
  "descricao": "Escalas de plantas e maquetes, grandezas proporcionais, conversão de unidades e o efeito da escala sobre comprimentos e volumes.",
  "ideias": [
    "Escala 1 : 50 quer dizer que 1 cm no desenho vale 50 cm de verdade. Coloque as duas medidas na mesma unidade antes de dividir.",
    "Se os comprimentos são multiplicados por k, as áreas ficam multiplicadas por k² e os volumes por k³. Para achar a escala a partir de volumes, tire a raiz cúbica.",
    "Em grandezas diretamente proporcionais, a razão fica constante: se a dose é por quilograma, o dobro da massa pede o dobro da dose.",
    "Desempenho em km/L é distância dividida por litros. Quando o consumo muda, calcule os litros gastos num trecho e divida de novo.",
    "Confira as unidades no fim: 1 L = 1 dm³ = 1 000 cm³, 1 m = 100 cm e 1 g de um líquido de densidade 1 ocupa 1 cm³ = 1 mL."
  ],
  "questoes": [
    {
      "id": "enem-2021-153",
      "ano": 2021,
      "numero": 153,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 899,
      "coItem": 117852,
      "habilidade": "H11",
      "a": 2.144,
      "b": 1.532,
      "c": 0.181,
      "gabarito": "C",
      "contexto": "<p>Um parque temático brasileiro construiu uma réplica em miniatura do castelo de Liechtenstein. O castelo original, representado na imagem, está situado na Alemanha e foi reconstruído entre os anos de 1840 e 1842, após duas destruições causadas por guerras.</p><figure><img src=\"./conteudo/praticas/img/enem-2021-153-1.jpg\" alt=\"Foto do castelo de Liechtenstein, construção de pedra com torres sobre um rochedo, cercada de árvores.\"></figure><p>O castelo possui uma ponte de 38,4 m de comprimento e 1,68 m de largura. O artesão que trabalhou para o parque produziu a réplica do castelo, em escala. Nessa obra, as medidas do comprimento e da largura da ponte eram, respectivamente, 160 cm e 7 cm.</p>",
      "enunciado": "<p>A escala utilizada para fazer a réplica é</p>",
      "alternativas": {
        "A": "1 : 576",
        "B": "1 : 240",
        "C": "1 : 24",
        "D": "1 : 4,2",
        "E": "1 : 2,4"
      },
      "explicacao": "Escala é a razão entre a medida da réplica e a medida real, na mesma unidade. O comprimento real da ponte é 38,4 m = 3 840 cm, e na réplica ele mede 160 cm: 3 840 ÷ 160 = 24. A largura confirma: 1,68 m = 168 cm e 168 ÷ 7 = 24. Cada centímetro da réplica representa 24 cm do castelo, ou seja, escala 1 : 24.",
      "faltou": {
        "A": "Você multiplicou as duas razões (24 × 24 = 576), como se a escala fosse de áreas. A escala de uma réplica compara comprimentos, então basta uma razão: 1 : 24.",
        "B": "Você converteu metro para centímetro multiplicando por 1 000 (38,4 m virou 38 400 cm) e achou 240. Um metro tem 100 cm, então 38,4 m = 3 840 cm.",
        "D": "Você dividiu 160 por 38,4 sem converter as unidades, comparando centímetros com metros. Antes de dividir, as duas medidas precisam estar em centímetros.",
        "E": "Você converteu metro para centímetro multiplicando por 10 (38,4 m virou 384 cm) e achou 2,4. Um metro tem 100 cm, então o comprimento real é 3 840 cm."
      },
      "nivel": "difícil",
      "fonte": "Enem 2021, 2º dia, Caderno Azul, questão 153. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial (espaços entre número e unidade como no caderno)"
    },
    {
      "id": "enem-2019-170",
      "ano": 2019,
      "numero": 170,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 515,
      "coItem": 117783,
      "habilidade": "H14",
      "a": 1.966,
      "b": 2.016,
      "c": 0.155,
      "gabarito": "B",
      "contexto": "<p>A bula de um antibiótico infantil, fabricado na forma de xarope, recomenda que sejam ministrados, diariamente, no máximo 500 mg desse medicamento para cada quilograma de massa do paciente. Um pediatra prescreveu a dosagem máxima desse antibiótico para ser ministrada diariamente a uma criança de 20 kg pelo período de 5 dias.</p><p>Esse medicamento pode ser comprado em frascos de 10 mL, 50 mL, 100 mL, 250 mL e 500 mL. Os pais dessa criança decidiram comprar a quantidade exata de medicamento que precisará ser ministrada no tratamento, evitando a sobra de medicamento.</p><p>Considere que 1 g desse medicamento ocupe um volume de 1 cm³.</p>",
      "enunciado": "<p>A capacidade do frasco, em mililitro, que esses pais deverão comprar é</p>",
      "alternativas": {
        "A": "10.",
        "B": "50.",
        "C": "100.",
        "D": "250.",
        "E": "500."
      },
      "explicacao": "A dose é proporcional à massa: 500 mg por quilograma, para 20 kg, dá 500 × 20 = 10 000 mg = 10 g por dia. Em 5 dias são 10 × 5 = 50 g. Como 1 g ocupa 1 cm³ e 1 cm³ = 1 mL, o tratamento precisa de 50 mL, que é exatamente o frasco de 50 mL.",
      "faltou": {
        "A": "Você calculou a dose de um só dia (10 g, ou 10 mL). O tratamento dura 5 dias, então é preciso multiplicar por 5.",
        "C": "Você multiplicou a massa pelos dias (20 × 5 = 100) e deixou de fora a dose de 500 mg = 0,5 g por quilograma. Sem ela a conta fica o dobro do certo.",
        "D": "Você contou os 5 dias duas vezes: chegou aos 50 mL do tratamento e multiplicou de novo por 5. Os 50 mL já cobrem os 5 dias.",
        "E": "Você converteu miligrama para grama dividindo por 100 em vez de 1 000. Os 50 000 mg do tratamento são 50 g, não 500 g."
      },
      "nivel": "difícil",
      "fonte": "Enem 2019, 2º dia, Caderno Azul, questão 170. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial"
    },
    {
      "id": "enem-2021-165",
      "ano": 2021,
      "numero": 165,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 899,
      "coItem": 117832,
      "habilidade": "H12",
      "a": 2.725,
      "b": 2.1,
      "c": 0.081,
      "gabarito": "D",
      "contexto": "<p>Um automóvel apresenta um desempenho médio de 16 km/L. Um engenheiro desenvolveu um novo motor a combustão que economiza, em relação ao consumo do motor anterior, 0,1 L de combustível a cada 20 km percorridos.</p>",
      "enunciado": "<p>O valor do desempenho médio do automóvel com o novo motor, em quilômetro por litro, expresso com uma casa decimal, é</p>",
      "alternativas": {
        "A": "15,9.",
        "B": "16,1.",
        "C": "16,4.",
        "D": "17,4.",
        "E": "18,0."
      },
      "explicacao": "Com 16 km/L, o motor antigo gasta 20 ÷ 16 = 1,25 L a cada 20 km. O novo motor economiza 0,1 L nesse trecho, então gasta 1,25 − 0,1 = 1,15 L para os mesmos 20 km. O novo desempenho é 20 ÷ 1,15 ≈ 17,39, que com uma casa decimal fica 17,4 km/L.",
      "faltou": {
        "A": "Você tirou 0,1 do desempenho (16 − 0,1). A economia é de combustível, e gastar menos combustível faz o desempenho em km/L aumentar, não diminuir.",
        "B": "Você somou 0,1 direto ao desempenho (16 + 0,1). Os 0,1 L são litros economizados a cada 20 km, não quilômetros a mais por litro; é preciso refazer a divisão distância ÷ litros.",
        "C": "Você comparou os 0,1 L economizados com uma quantidade maior de combustível do que a gasta em 20 km (algo como 4 L) e achou um ganho de só 2,5%. Em 20 km o carro gasta 1,25 L, e 0,1 L é 8% disso.",
        "E": "Você multiplicou 0,1 por 20 e somou 2 km/L ao desempenho. O jeito certo é calcular o combustível gasto em 20 km com o motor novo (1,15 L) e dividir 20 por esse valor."
      },
      "nivel": "difícil",
      "fonte": "Enem 2021, 2º dia, Caderno Azul, questão 165. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial (o enem.dev traz '10 km'; o caderno impresso diz '20 km')"
    },
    {
      "id": "enem-2020-145",
      "ano": 2020,
      "numero": 145,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 587,
      "coItem": 7633,
      "habilidade": "H11",
      "a": 2.731,
      "b": 2.499,
      "c": 0.135,
      "gabarito": "B",
      "contexto": "<p>Um clube deseja produzir miniaturas em escala do troféu que ganhou no último campeonato. O troféu está representado na Figura 1 e é composto por uma base em formato de um paralelepípedo reto-retângulo de madeira, sobre a qual estão fixadas três hastes verticais que sustentam uma esfera de 30 cm de diâmetro, que fica centralizada sobre a base de madeira. O troféu tem 100 cm de altura, incluída sua base.</p><figure><img src=\"./conteudo/praticas/img/enem-2020-145-1.png\" alt=\"Figura 1: troféu com base quadrada de 50 cm por 50 cm, três hastes verticais e uma esfera no alto. Figura 2: caixa de vidro com base de 8 cm por 10 cm e altura indicada por um ponto de interrogação.\"></figure><p>A miniatura desse troféu deverá ser instalada no interior de uma caixa de vidro, em formato de paralelepípedo reto-retângulo, cujas dimensões internas de sua base estão indicadas na Figura 2, de modo que a base do troféu seja colada na base da caixa e distante das paredes laterais da caixa de vidro em pelo menos 1 cm. Deve ainda haver uma distância de exatos 2 cm entre o topo da esfera e a tampa dessa caixa de vidro. Nessas condições deseja-se fazer a maior miniatura possível.</p>",
      "enunciado": "<p>A medida da altura, em centímetro, dessa caixa de vidro deverá ser igual a</p>",
      "alternativas": {
        "A": "12.",
        "B": "14.",
        "C": "16.",
        "D": "18.",
        "E": "20."
      },
      "explicacao": "A base do troféu é um quadrado de 50 cm de lado e precisa ficar a pelo menos 1 cm de cada parede. O lado que limita é o de 8 cm: sobram 8 − 1 − 1 = 6 cm para o lado da base da miniatura. A escala é 6 ÷ 50 = 0,12, então a altura do troféu na miniatura é 100 × 0,12 = 12 cm. Somando os 2 cm entre a esfera e a tampa, a caixa tem 12 + 2 = 14 cm de altura.",
      "faltou": {
        "A": "Você achou a altura da miniatura (12 cm), mas esqueceu a folga de 2 cm que deve ficar acima da esfera, até a tampa.",
        "C": "Você descontou a folga de 1 cm de um lado só (8 − 1 = 7 cm), achou a escala 7 ÷ 50 e uma miniatura de 14 cm, mais 2 cm. A base precisa ficar a 1 cm das duas paredes, então sobram 6 cm.",
        "D": "Você usou o lado de 10 cm da caixa (10 − 2 = 8 cm para a base), o que dá miniatura de 16 cm e caixa de 18 cm. A base é quadrada, então quem limita é o lado menor, de 8 cm.",
        "E": "Você usou o lado de 10 cm sem as folgas, achou escala 10 ÷ 50 e miniatura de 20 cm. A base quadrada precisa caber no lado menor da caixa, com 1 cm de folga de cada lado."
      },
      "nivel": "difícil",
      "fonte": "Enem 2020, 2º dia, Caderno Azul, questão 145. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial"
    },
    {
      "id": "enem-2022-139",
      "ano": 2022,
      "numero": 139,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 117973,
      "habilidade": "H11",
      "a": 1.873,
      "b": 2.86,
      "c": 0.183,
      "gabarito": "A",
      "contexto": "<p>Um casal está reformando a cozinha de casa e decidiu comprar um refrigerador novo. Observando a planta da nova cozinha, desenhada na escala de 1: 50, notaram que o espaço destinado ao refrigerador tinha 3,8 cm de altura e 1,6 cm de largura. Eles sabem que os fabricantes de refrigeradores indicam que, para um bom funcionamento e fácil manejo na limpeza, esses eletrodomésticos devem ser colocados em espaços que permitam uma distância de, pelo menos, 10 cm de outros móveis ou paredes, tanto na parte superior quanto nas laterais. O casal comprou um refrigerador que caberia no local a ele destinado na nova cozinha, seguindo as instruções do fabricante.</p>",
      "enunciado": "<p>Esse refrigerador tem altura e largura máximas, em metro, respectivamente, iguais a</p>",
      "alternativas": {
        "A": "1,80 e 0,60.",
        "B": "1,80 e 0,70.",
        "C": "1,90 e 0,80.",
        "D": "2,00 e 0,90.",
        "E": "2,00 e 1,00."
      },
      "explicacao": "Na escala 1 : 50, cada centímetro da planta vale 50 cm. Na realidade, o espaço mede 3,8 × 50 = 190 cm na altura e 1,6 × 50 = 80 cm na largura. Na altura só existe folga em cima: 190 − 10 = 180 cm. Na largura há folga nas duas laterais: 80 − 10 − 10 = 60 cm. O refrigerador pode ter no máximo 1,80 m por 0,60 m.",
      "faltou": {
        "B": "Você descontou a folga de 10 cm de um lado só da largura (80 − 10 = 70 cm). O refrigerador tem duas laterais, e cada uma precisa de 10 cm.",
        "C": "Você converteu a escala certo (190 cm e 80 cm), mas esqueceu as folgas recomendadas pelo fabricante. Essas são as medidas do espaço, não do aparelho.",
        "D": "Você somou 10 cm às medidas do espaço em vez de subtrair. A folga é um espaço vazio em volta do refrigerador, então o aparelho precisa ser menor que o espaço.",
        "E": "Você somou as folgas (10 cm em cima e 10 cm de cada lado) às medidas do espaço. O certo é subtrair: o aparelho tem que caber com sobra em volta."
      },
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 139. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA (sem PDF de 2022 para conferência)"
    },
    {
      "id": "enem-2020-138",
      "ano": 2020,
      "numero": 138,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 587,
      "coItem": 32975,
      "habilidade": "H11",
      "a": 3.351,
      "b": 3.342,
      "c": 0.166,
      "gabarito": "B",
      "contexto": "<p>A caixa-d’água de um edifício terá a forma de um paralelepípedo retângulo reto com volume igual a 28 080 litros. Em uma maquete que representa o edifício, a caixa-d’água tem dimensões 2 cm × 3,51 cm × 4 cm.</p><p>Dado: 1 dm³ = 1 L.</p>",
      "enunciado": "<p>A escala usada pelo arquiteto foi</p>",
      "alternativas": {
        "A": "1 : 10",
        "B": "1 : 100",
        "C": "1 : 1 000",
        "D": "1 : 10 000",
        "E": "1 : 100 000"
      },
      "explicacao": "O volume da maquete é 2 × 3,51 × 4 = 28,08 cm³. O volume real é 28 080 L = 28 080 dm³ = 28 080 000 cm³. A razão entre os volumes é 28 080 000 ÷ 28,08 = 1 000 000. Como o volume cresce com o cubo da escala, o fator de comprimento é a raiz cúbica de 1 000 000, que é 100. A escala é 1 : 100.",
      "faltou": {
        "A": "Você comparou 28 080 com 28,08 sem converter litros em cm³, achou 1 000 e tirou a raiz cúbica. Antes de comparar, 28 080 L precisam virar 28 080 000 cm³.",
        "C": "Você comparou os números 28 080 e 28,08 sem converter as unidades e usou a razão 1 000 direto como escala. Faltou converter litros em cm³ e tirar a raiz cúbica.",
        "D": "Você converteu dm³ em cm³ multiplicando só por 10, como se fosse comprimento, e usou a razão como escala. Um decímetro cúbico tem 10 × 10 × 10 = 1 000 cm³.",
        "E": "Você converteu dm³ em cm³ multiplicando por 100, como se fosse área, e usou a razão como escala. Para volume o fator é 1 000, e a escala sai da raiz cúbica da razão entre os volumes."
      },
      "nivel": "difícil",
      "fonte": "Enem 2020, 2º dia, Caderno Azul, questão 138. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial"
    }
  ],
  "autoria": {
    "equipe": "Prumo",
    "ia": "Claude Opus 5.5 (Anthropic), via Claude Code",
    "revisao": "pendente"
  }
};
