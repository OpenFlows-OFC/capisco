// Tópico de prática com questões reais do Enem (INEP, CC BY-ND 3.0). Gerado a partir do spec da equipe.
export const topico = {
  "id": "mat-estatistica",
  "area": "MT",
  "materia": "Matemática",
  "titulo": "Estatística: média, mediana, moda e gráficos",
  "descricao": "Calcular e comparar média, mediana e moda a partir de listas, tabelas de frequência e gráficos.",
  "ideias": [
    "Média é a soma de todos os valores dividida pela quantidade de valores; se você sabe a média que quer, sabe a soma que precisa (soma = média × quantidade).",
    "Mediana é o valor do meio depois de colocar os dados em ordem; com quantidade par de dados, é a média dos dois do meio.",
    "Em tabela de frequência, cada valor aparece tantas vezes quanto a sua frequência: use a frequência acumulada para achar a posição do meio.",
    "Moda é o valor que mais se repete; num gráfico de barras, é o valor da barra mais comprida, não o tamanho da barra.",
    "Antes de calcular, leia o gráfico com calma: confira o que está em cada eixo e quais dados entram na conta."
  ],
  "questoes": [
    {
      "id": "enem-2022-171",
      "ano": 2022,
      "numero": 171,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 96315,
      "habilidade": "H29",
      "a": 1.692,
      "b": 0.875,
      "c": 0.206,
      "gabarito": "A",
      "contexto": "<p>Nos cinco jogos finais da última temporada, com uma média de 18 pontos por jogo, um jogador foi eleito o melhor do campeonato de basquete. Na atual temporada, cinco jogadores têm a chance de igualar ou melhorar essa média. No quadro estão registradas as pontuações desses cinco jogadores nos quatro primeiros jogos das finais deste ano.</p><figure><img src=\"./conteudo/praticas/img/enem-2022-171-1.png\" alt=\"Quadro com as pontuações dos jogadores I a V nos jogos 1 a 4. I: 12, 25, 20, 20. II: 12, 12, 27, 20. III: 14, 14, 17, 26. IV: 15, 18, 21, 21. V: 22, 15, 23, 15.\"></figure><p>O quinto e último jogo será realizado para decidir a equipe campeã e qual o melhor jogador da temporada.</p>",
      "enunciado": "<p>O jogador que precisa fazer a menor quantidade de pontos no quinto jogo, para igualar a média de pontos do melhor jogador da temporada passada, é o</p>",
      "alternativas": {
        "A": "I.",
        "B": "II.",
        "C": "III.",
        "D": "IV.",
        "E": "V."
      },
      "explicacao": "Para ter média 18 em 5 jogos, o jogador precisa somar 5 × 18 = 90 pontos. Somando os quatro jogos: I tem 77, II tem 71, III tem 71, IV tem 75 e V tem 75. O que falta para 90 é 13 para o I, 19 para o II e o III e 15 para o IV e o V. Quem precisa de menos pontos é o jogador I.",
      "faltou": {
        "B": "Você se guiou pela maior pontuação em um único jogo (27, do jogador II). O que decide é a soma dos quatro jogos: o II tem só 71 e ainda precisa de 19 pontos.",
        "C": "Você olhou para quem foi melhor no último jogo (26, do jogador III). Mas a soma do III é 71, e ele precisaria de 19 pontos no quinto jogo.",
        "D": "Você comparou a soma de cada um com 4 × 18 = 72 e escolheu quem está mais perto disso. O critério certo é quem tem a maior soma, porque assim falta menos para chegar a 90; o IV, com 75, ainda precisa de 15.",
        "E": "Você somou só os três primeiros jogos: aí o V lidera com 60, contra 57 do I. Com os quatro jogos, o I chega a 77 e o V fica em 75."
      },
      "nivel": "médio",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 171. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA"
    },
    {
      "id": "enem-2021-148",
      "ano": 2021,
      "numero": 148,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 899,
      "coItem": 30751,
      "habilidade": "H27",
      "a": 1.624,
      "b": 1.468,
      "c": 0.171,
      "gabarito": "C",
      "contexto": "<p>O quadro apresenta o número de terremotos de magnitude maior ou igual a 7, na escala de Richter, ocorridos em nosso planeta nos anos de 2000 a 2011.</p><figure><img src=\"./conteudo/praticas/img/enem-2021-148-1.png\" alt=\"Quadro com o número de terremotos por ano: 2000: 15; 2001: 16; 2002: 13; 2003: 15; 2004: 16; 2005: 11; 2006: 11; 2007: 18; 2008: 12; 2009: 17; 2010: 24; 2011: 20.\"></figure>",
      "enunciado": "<p>Um pesquisador acredita que a mediana representa bem o número anual típico de terremotos em um período. Segundo esse pesquisador, o número anual típico de terremotos de magnitude maior ou igual a 7 é</p>",
      "alternativas": {
        "A": "11.",
        "B": "15.",
        "C": "15,5.",
        "D": "15,7.",
        "E": "17,5."
      },
      "explicacao": "São 12 anos, então a mediana é a média dos dois valores do meio depois de ordenar. Em ordem: 11, 11, 12, 13, 15, 15, 16, 16, 17, 18, 20, 24. O 6º valor é 15 e o 7º é 16, logo a mediana é (15 + 16) ÷ 2 = 15,5.",
      "faltou": {
        "A": "Você pegou os dois valores do meio do quadro sem colocar os dados em ordem (2005 e 2006, ambos 11). A mediana só vale depois de ordenar os números.",
        "B": "Você ficou só com o 6º valor da lista ordenada (15). Como a quantidade de dados é par, é preciso fazer a média do 6º e do 7º valores.",
        "D": "Você calculou a média: 188 ÷ 12 ≈ 15,7. A questão pede a mediana, que é o valor central da lista ordenada.",
        "E": "Você fez a média entre o menor e o maior valor, ou entre o primeiro e o último ano. Isso não é mediana: é preciso ordenar os 12 valores e olhar o centro."
      },
      "nivel": "médio",
      "fonte": "Enem 2021, 2º dia, Caderno Azul, questão 148. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e com o PDF oficial do INEP (enunciado corrigido pelo PDF)"
    },
    {
      "id": "enem-2023-140",
      "ano": 2023,
      "numero": 140,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1211,
      "coItem": 98278,
      "habilidade": "H27",
      "a": 1.719,
      "b": 2.196,
      "c": 0.087,
      "gabarito": "E",
      "contexto": "<p>Uma empresa de transporte faz regularmente um levantamento do número de viagens realizadas durante o dia por todos os 160 motoristas cadastrados em seu aplicativo. Em um certo dia, foi gerado um relatório, por meio de um gráfico de barras, no qual se relacionaram a quantidade de motoristas com a quantidade de viagens realizadas até aquele instante do dia.</p><figure><img src=\"./conteudo/praticas/img/enem-2023-140-1.png\" alt=\"Gráfico de barras horizontais. Eixo vertical: quantidade de viagens realizadas, de 1 a 7. Eixo horizontal: quantidade de motoristas, de 0 a 55. Valores: 1 viagem, 10 motoristas; 2 viagens, 10; 3 viagens, 55; 4 viagens, 25; 5 viagens, 0; 6 viagens, 50; 7 viagens, 10.\"></figure>",
      "enunciado": "<p>Comparando os valores da média, da mediana e da moda da distribuição das quantidades de viagens realizadas pelos motoristas cadastrados nessa empresa, obtém-se</p>",
      "alternativas": {
        "A": "mediana = média &lt; moda.",
        "B": "mediana = moda &lt; média.",
        "C": "mediana &lt; média &lt; moda.",
        "D": "moda &lt; média &lt; mediana.",
        "E": "moda &lt; mediana &lt; média."
      },
      "explicacao": "Do gráfico: 10 motoristas fizeram 1 viagem, 10 fizeram 2, 55 fizeram 3, 25 fizeram 4, nenhum fez 5, 50 fizeram 6 e 10 fizeram 7 (total 160). A moda é 3 viagens (barra mais longa). A mediana é a média do 80º e do 81º motoristas: acumulando, 10, 20, 75 e 100, os dois estão no grupo de 4 viagens, então a mediana é 4. A média é (10 + 20 + 165 + 100 + 300 + 70) ÷ 160 = 665 ÷ 160 ≈ 4,16. Assim, moda < mediana < média.",
      "faltou": {
        "A": "Você trocou a moda por 6 viagens (a outra barra comprida) e arredondou a média 4,16 para 4, igualando-a à mediana. A barra mais longa é a de 3 viagens, e a média fica um pouco acima de 4.",
        "B": "Você errou a contagem acumulada e achou que o 80º motorista ainda estava no grupo de 3 viagens. Somando 10 + 10 + 55, chega-se só a 75; o 80º e o 81º já fizeram 4 viagens.",
        "C": "Você tomou como moda o valor 6, cuja barra (50) é quase do tamanho da barra de 3 viagens (55). A moda é 3, que é menor que a mediana e a média.",
        "D": "Você calculou a média dos valores 1, 2, 3, 4, 6 e 7 sem levar em conta quantos motoristas há em cada um (23 ÷ 6 ≈ 3,8). A média precisa usar as frequências e dá cerca de 4,16."
      },
      "nivel": "difícil",
      "fonte": "Enem 2023, 2º dia, Caderno Azul, questão 140. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA"
    },
    {
      "id": "enem-2022-149",
      "ano": 2022,
      "numero": 149,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 111738,
      "habilidade": "H27",
      "a": 2.646,
      "b": 2.213,
      "c": 0.249,
      "gabarito": "B",
      "contexto": "<p>Uma das informações que pode auxiliar no dimensionamento do número de pediatras que devem atender em uma Unidade Básica de Saúde (UBS) é o número que representa a mediana da quantidade de crianças por família existente na região sob sua responsabilidade. O quadro mostra a distribuição das frequências do número de crianças por família na região de responsabilidade de uma UBS.</p><figure><img src=\"./conteudo/praticas/img/enem-2022-149-1.png\" alt=\"Quadro com o número de crianças por família e a frequência: 0 crianças, 100; 1 criança, 400; 2 crianças, 200; 3 crianças, 150; 4 crianças, 100; 5 crianças, 50.\"></figure>",
      "enunciado": "<p>O número que representa a mediana da quantidade de crianças por família nessa região é</p>",
      "alternativas": {
        "A": "1,0.",
        "B": "1,5.",
        "C": "1,9.",
        "D": "2,1.",
        "E": "2,5."
      },
      "explicacao": "Há 100 + 400 + 200 + 150 + 100 + 50 = 1 000 famílias. Com quantidade par, a mediana é a média da 500ª e da 501ª famílias, em ordem. Acumulando: as famílias com 0 crianças vão até a 100ª e as com 1 criança vão até a 500ª; a 501ª já tem 2 crianças. Logo, a mediana é (1 + 2) ÷ 2 = 1,5.",
      "faltou": {
        "A": "Você ficou só com a 500ª família (1 criança) ou com a moda, que também é 1. Como são 1 000 famílias, a mediana é a média da 500ª com a 501ª, que tem 2 crianças.",
        "C": "Você calculou a média: 1 900 crianças ÷ 1 000 famílias = 1,9. A questão pede a mediana.",
        "D": "Você deixou de fora as famílias sem crianças e calculou uma média: 1 900 ÷ 900 ≈ 2,1. Nem a média nem a mediana podem ignorar essas 100 famílias.",
        "E": "Você achou o meio dos valores 0, 1, 2, 3, 4 e 5 sem considerar as frequências, obtendo 2,5. Cada valor pesa pela quantidade de famílias que o têm."
      },
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 149. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA"
    },
    {
      "id": "enem-2022-138",
      "ano": 2022,
      "numero": 138,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 30493,
      "habilidade": "H27",
      "a": 0.804,
      "b": 2.276,
      "c": 0.129,
      "gabarito": "D",
      "contexto": "<p>O gráfico apresenta os totais de receitas e despesas de uma empresa, expressos em milhão de reais, no decorrer dos meses de um determinado ano. A empresa obtém lucro quando a diferença entre receita e despesa é positiva e tem prejuízo quando essa diferença é negativa.</p><figure><img src=\"./conteudo/praticas/img/enem-2022-138-1.png\" alt=\"Gráfico de colunas com receitas e despesas mensais, em milhão de reais. Jan.: receita 6, despesa 3. Fev.: 4 e 5. Mar.: 3 e 2. Abr.: 5 e 6. Maio: 6 e 1. Jun.: 5 e 2. Jul.: 6 e 4. Ago.: 2 e 4. Set.: 7 e 3. Out.: 2 e 4. Nov.: 8 e 7. Dez.: 6 e 2.\"></figure>",
      "enunciado": "<p>Qual é a mediana, em milhão de reais, dos valores dos lucros apurados pela empresa nesse ano?</p>",
      "alternativas": {
        "A": "1,5",
        "B": "2,0",
        "C": "2,9",
        "D": "3,0",
        "E": "5,5"
      },
      "explicacao": "Calcule receita menos despesa em cada mês e guarde só os meses com resultado positivo (lucro). Os lucros são: jan. 3, mar. 1, maio 5, jun. 3, jul. 2, set. 4, nov. 1 e dez. 4. Em ordem: 1, 1, 2, 3, 3, 4, 4, 5. São 8 valores, então a mediana é a média do 4º e do 5º: (3 + 3) ÷ 2 = 3,0.",
      "faltou": {
        "A": "Você incluiu os meses de prejuízo (−1, −1, −2, −2) na lista. Com 12 valores, o centro fica entre 1 e 2, dando 1,5. A pergunta é só sobre os lucros.",
        "B": "Você calculou a mediana das receitas (5,5) e a das despesas (3,5) e subtraiu uma da outra. A mediana dos lucros exige calcular o lucro de cada mês primeiro.",
        "C": "Você calculou a média dos lucros: 23 ÷ 8 ≈ 2,9. A questão pede a mediana.",
        "E": "Você achou a mediana das receitas (5,5), sem descontar as despesas de cada mês."
      },
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 138. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA"
    },
    {
      "id": "enem-2020-165",
      "ano": 2020,
      "numero": 165,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 587,
      "coItem": 83753,
      "habilidade": "H30",
      "a": 2.597,
      "b": 2.83,
      "c": 0.097,
      "gabarito": "D",
      "contexto": "<p>O técnico de um time de basquete pretende aumentar a estatura média de sua equipe de 1,93 m para, no mínimo, 1,99 m. Para tanto, dentre os 15 jogadores que fazem parte de sua equipe, irá substituir os quatro mais baixos, de estaturas: 1,78 m, 1,82 m, 1,84 m e 1,86 m. Para isso, o técnico contratou um novo jogador de 2,02 m. Os outros três jogadores que ele ainda precisa contratar devem satisfazer à sua necessidade de aumentar a média das estaturas da equipe. Ele fixará a média das estaturas para os três jogadores que ainda precisa contratar dentro do critério inicialmente estabelecido.</p>",
      "enunciado": "<p>Qual deverá ser a média mínima das estaturas, em metro, que ele deverá fixar para o grupo de três novos jogadores que ainda irá contratar?</p>",
      "alternativas": {
        "A": "1,96",
        "B": "1,98",
        "C": "2,05",
        "D": "2,06",
        "E": "2,08"
      },
      "explicacao": "Com 15 jogadores e média 1,99 m, a soma das alturas deve ser pelo menos 15 × 1,99 = 29,85 m. Hoje a soma é 15 × 1,93 = 28,95 m. Saem 1,78 + 1,82 + 1,84 + 1,86 = 7,30 m, então os 11 que ficam somam 21,65 m. Somando o reforço já contratado, de 2,02 m, a soma vai a 23,67 m. Os três que faltam precisam somar 29,85 − 23,67 = 6,18 m, ou seja, média de 6,18 ÷ 3 = 2,06 m.",
      "faltou": {
        "A": "Você fez a média entre a média atual e a desejada, (1,93 + 1,99) ÷ 2 = 1,96. Para subir a média do time, os novos precisam compensar os quatro baixos que saem; isso pede uma conta com as somas.",
        "B": "Você exigiu média 1,99 só para os quatro novos jogadores: (4 × 1,99 − 2,02) ÷ 3 ≈ 1,98. Mas quem sai tem média bem menor que 1,93, então os novos precisam ser bem mais altos.",
        "C": "Você calculou a média dos quatro novos juntos: (29,85 − 21,65) ÷ 4 = 2,05. O jogador de 2,02 m já está contratado; a pergunta é sobre os outros três.",
        "E": "Você exigiu mais do que o necessário, por exemplo somando 0,06 m à altura do jogador já contratado (2,02 + 0,06 = 2,08). A conta das somas mostra que basta média 2,06 m."
      },
      "nivel": "difícil",
      "fonte": "Enem 2020, 2º dia, Caderno Azul, questão 165. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA"
    }
  ],
  "autoria": {
    "equipe": "Prumo",
    "ia": "Claude Opus 5.5 (Anthropic), via Claude Code",
    "revisao": "pendente"
  }
};
