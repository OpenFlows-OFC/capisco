// Tópico de prática com questões reais do Enem (INEP, CC BY-ND 3.0). Gerado a partir do spec da equipe.
export const topico = {
  "id": "mat-porcentagem",
  "area": "MT",
  "materia": "Matemática",
  "titulo": "Porcentagem e juros",
  "descricao": "Aumentos, descontos, quedas percentuais, variações em sequência e juros compostos em situações de compra, salário e emprego.",
  "ideias": [
    "Porcentagem é uma fração de 100: 25% = 0,25. Aumentar 10% é multiplicar por 1,10, e diminuir 25% é multiplicar por 0,75.",
    "Variações seguidas se multiplicam, não se somam: subir 20% e depois 10% é multiplicar por 1,20 e depois por 1,10.",
    "Para voltar ao valor original, divida pelo fator: se uma queda de 60% deixou 1 240, o valor antigo era 1 240 ÷ 0,40.",
    "Em juros compostos, cada mês multiplica o valor por (1 + taxa). Para saber quanto vale hoje um pagamento futuro, divida por (1 + taxa) elevado ao número de meses.",
    "Antes de fazer a conta, pergunte: a porcentagem é de qual valor? Trocar a base é o erro mais comum."
  ],
  "questoes": [
    {
      "id": "enem-2023-143",
      "ano": 2023,
      "numero": 143,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1211,
      "coItem": 111446,
      "habilidade": "H5",
      "a": 2.098,
      "b": 1.526,
      "c": 0.107,
      "gabarito": "B",
      "contexto": "<p>Em janeiro do ano passado, a direção de uma fábrica abriu uma creche para os filhos de seus funcionários, com 10 salas, cada uma com capacidade para atender 10 crianças a cada ano. As vagas são sorteadas entre os filhos dos funcionários inscritos, enquanto os não contemplados pelo sorteio formam uma lista de espera. No ano passado, a lista de espera teve 400 nomes e, neste ano, esse número cresceu 10%.</p><p>A direção da fábrica realizou uma pesquisa e constatou que a lista de espera para o próximo ano terá a mesma quantidade de nomes da lista de espera deste ano. Decidiu, então, construir, ao longo desse ano, novas salas para a creche, também com capacidade de atendimento para 10 crianças cada, de modo que o número de nomes na lista de espera no próximo ano seja 25% menor que o deste ano.</p>",
      "enunciado": "<p>O número mínimo de salas que deverão ser construídas é</p>",
      "alternativas": {
        "A": "10.",
        "B": "11.",
        "C": "13.",
        "D": "30.",
        "E": "33."
      },
      "explicacao": "Neste ano a lista de espera tem 400 nomes mais 10%, ou seja, 400 × 1,10 = 440. Sem salas novas, a lista do próximo ano também teria 440 nomes. A meta é ficar 25% abaixo disso: 0,75 × 440 = 330. Então a creche precisa atender 440 − 330 = 110 crianças a mais, e como cada sala nova recebe 10 crianças, são 110 ÷ 10 = 11 salas.",
      "faltou": {
        "A": "Você calculou 25% de 400, o tamanho da lista do ano passado, e achou 100 crianças, ou 10 salas. A redução deve ser aplicada à lista deste ano, que já cresceu 10% e tem 440 nomes.",
        "C": "Você supôs que a lista cresceria mais 10% no próximo ano (440 × 1,10 = 484) e tirou 25% desse número: 121 crianças, que pedem 13 salas. O texto diz que a lista do próximo ano terá os mesmos 440 nomes, e 25% de 440 são 110 crianças, ou 11 salas.",
        "D": "Você calculou o tamanho da lista com a redução sobre o ano passado (0,75 × 400 = 300) e dividiu por 10. Esse número é quantos nomes ficariam na lista, não quantas salas faltam construir.",
        "E": "Você achou a lista desejada, 330 nomes, e dividiu por 10, como se fosse preciso abrir vaga para todos eles. As salas novas só precisam absorver a diferença entre 440 e 330, que são 110 crianças."
      },
      "secao": 3,
      "nivel": "difícil",
      "fonte": "Enem 2023, 2º dia, Caderno Azul, questão 143. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 18); alternativa C corrigida para 13, como no caderno impresso"
    },
    {
      "id": "enem-2019-150",
      "ano": 2019,
      "numero": 150,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 515,
      "coItem": 84409,
      "habilidade": "H23",
      "a": 1.776,
      "b": 1.538,
      "c": 0.148,
      "gabarito": "B",
      "contexto": "<p>Uma pessoa se interessou em adquirir um produto anunciado em uma loja. Negociou com o gerente e conseguiu comprá-lo a uma taxa de juros compostos de 1% ao mês. O primeiro pagamento será um mês após a aquisição do produto, e no valor de R$ 202,00. O segundo pagamento será efetuado um mês após o primeiro, e terá o valor de R$ 204,02. Para concretizar a compra, o gerente emitirá uma nota fiscal com o valor do produto à vista negociado com o cliente, correspondendo ao financiamento aprovado.</p>",
      "enunciado": "<p>O valor à vista, em real, que deverá constar na nota fiscal é de</p>",
      "alternativas": {
        "A": "398,02.",
        "B": "400,00.",
        "C": "401,94.",
        "D": "404,00.",
        "E": "406,02."
      },
      "explicacao": "Com juros compostos a 1% por mês, um valor pago daqui a 1 mês equivale hoje a esse valor dividido por 1,01, e um pago daqui a 2 meses, dividido por 1,01² = 1,0201. Primeira parcela: 202,00 ÷ 1,01 = 200,00. Segunda parcela: 204,02 ÷ 1,0201 = 200,00. O valor à vista é a soma dos valores de hoje: 200 + 200 = 400,00.",
      "faltou": {
        "A": "Você descontou juros demais: tirou 2% de R$ 400,00 (R$ 8,00) da soma das parcelas, como se as duas tivessem dois meses de juros. A primeira parcela tem só um mês de juros e a segunda tem dois, e o certo é dividir cada uma pelo seu fator.",
        "C": "Você só tirou juros da segunda parcela (2% de 204, cerca de R$ 4,08) e deixou a primeira inteira. A primeira também traz um mês de juros embutido: 202,00 ÷ 1,01 = 200,00.",
        "D": "Você tirou os juros só da primeira parcela (R$ 2,02) e manteve a segunda inteira. A segunda parcela tem dois meses de juros e também precisa ser trazida para a data da compra.",
        "E": "Você somou as duas parcelas (202,00 + 204,02) sem tirar os juros. Esse é o total pago no financiamento, que é maior que o preço à vista justamente por causa dos juros."
      },
      "secao": 6,
      "nivel": "difícil",
      "fonte": "Enem 2019, 2º dia, Caderno Azul, questão 150. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 21)"
    },
    {
      "id": "enem-2022-154",
      "ano": 2022,
      "numero": 154,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 43182,
      "habilidade": "H3",
      "a": 2.194,
      "b": 1.567,
      "c": 0.13,
      "gabarito": "C",
      "contexto": "<p>Em janeiro de 2013, foram declaradas 1 794 272 admissões e 1 765 372 desligamentos no Brasil, ou seja, foram criadas 28 900 vagas de emprego, segundo dados do Cadastro Geral de Empregados e Desempregados (Caged), divulgados pelo Ministério do Trabalho e Emprego (MTE). Segundo o Caged, o número de vagas criadas em janeiro de 2013 sofreu uma queda de 75%, quando comparado com o mesmo período de 2012.</p><p>Disponível em: http://portal.mte.gov.br. Acesso em: 23 fev. 2013 (adaptado).</p>",
      "enunciado": "<p>De acordo com as informações dadas, o número de vagas criadas em janeiro de 2012 foi</p>",
      "alternativas": {
        "A": "16 514.",
        "B": "86 700.",
        "C": "115 600.",
        "D": "441 343.",
        "E": "448 568."
      },
      "explicacao": "Uma queda de 75% significa que o número de 2013 é só 25% do número de 2012. Então 28 900 = 0,25 × (vagas de 2012), e as vagas de 2012 foram 28 900 ÷ 0,25 = 115 600. Confira: 75% de 115 600 é 86 700, e 115 600 − 86 700 = 28 900.",
      "faltou": {
        "A": "Você dividiu 28 900 por 1,75, como se o número tivesse subido 75% de 2012 para 2013. Foi uma queda: o valor de 2013 é 25% do de 2012, então o certo é dividir por 0,25.",
        "B": "Você achou 86 700, que é o tamanho da queda (75% de 115 600), e não o número de vagas de 2012. Por exemplo, multiplicar 28 900 por 3 dá exatamente esse valor.",
        "D": "Você calculou 25% dos 1 765 372 desligamentos. A queda de 75% fala do saldo de vagas criadas (28 900), não do total de desligamentos.",
        "E": "Você calculou 25% das 1 794 272 admissões. A porcentagem se refere ao número de vagas criadas, que é a diferença entre admissões e desligamentos."
      },
      "secao": 4,
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 154. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 23)"
    },
    {
      "id": "enem-2022-167",
      "ano": 2022,
      "numero": 167,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1075,
      "coItem": 68369,
      "habilidade": "H4",
      "a": 2.572,
      "b": 1.586,
      "c": 0.102,
      "gabarito": "A",
      "contexto": "<p>Em uma loja, o preço promocional de uma geladeira é de R$ 1 000,00 para pagamento somente em dinheiro. Seu preço normal, fora da promoção, é 10% maior. Para pagamento feito com o cartão de crédito da loja, é dado um desconto de 2% sobre o preço normal. Uma cliente decidiu comprar essa geladeira, optando pelo pagamento com o cartão de crédito da loja. Ela calculou que o valor a ser pago seria o preço promocional acrescido de 8%. Ao ser informada pela loja do valor a pagar, segundo sua opção, percebeu uma diferença entre seu cálculo e o valor que lhe foi apresentado.</p>",
      "enunciado": "<p>O valor apresentado pela loja, comparado ao valor calculado pela cliente, foi</p>",
      "alternativas": {
        "A": "R$ 2,00 menor.",
        "B": "R$ 100,00 menor.",
        "C": "R$ 200,00 menor.",
        "D": "R$ 42,00 maior.",
        "E": "R$ 80,00 maior."
      },
      "explicacao": "O preço normal é 10% maior que o promocional: 1 000 × 1,10 = 1 100 reais. No cartão da loja, o preço normal tem 2% de desconto: 1 100 × 0,98 = 1 078 reais. A cliente fez 1 000 × 1,08 = 1 080 reais. A loja cobrou 1 080 − 1 078 = 2 reais a menos que o cálculo dela.",
      "faltou": {
        "B": "Você aplicou os 2% de desconto ao preço promocional (1 000 × 0,98 = 980) e comparou com 1 080. O desconto do cartão vale sobre o preço normal, que é R$ 1 100,00.",
        "C": "Você trocou o sentido do preço normal, tirando 10% e mais 2% de R$ 1 000,00 (chegando a R$ 880,00). O preço normal é 10% maior que o promocional, não menor.",
        "D": "Você tratou os 2% como acréscimo: 1 100 × 1,02 = 1 122, que dá R$ 42,00 a mais que 1 080. No cartão da loja os 2% são um desconto.",
        "E": "Você tomou o preço promocional (R$ 1 000,00) como se fosse a conta da cliente e o valor com 8% (R$ 1 080,00) como se fosse o da loja, e achou R$ 80,00 a mais. A cliente calculou R$ 1 080,00, e a loja cobrou R$ 1 078,00."
      },
      "secao": 3,
      "nivel": "difícil",
      "fonte": "Enem 2022, 2º dia, Caderno Azul, questão 167. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 27); acrescentado o ponto final que falta no enem.dev"
    },
    {
      "id": "enem-2023-167",
      "ano": 2023,
      "numero": 167,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 1211,
      "coItem": 27330,
      "habilidade": "H18",
      "a": 1.948,
      "b": 1.939,
      "c": 0.171,
      "gabarito": "A",
      "contexto": "<p>A cada bimestre, a diretora de uma escola compra uma quantidade de folhas de papel ofício proporcional ao número de alunos matriculados. No bimestre passado, ela comprou 6 000 folhas para serem utilizadas pelos 1 200 alunos matriculados. Neste bimestre, alguns alunos cancelaram suas matrículas e a escola tem, agora, 1 150 alunos. A diretora só pode gastar R$ 220,00 nessa compra, e sabe que o fornecedor da escola vende as folhas de papel ofício em embalagens de 100 unidades a R$ 4,00 a embalagem. Assim, será preciso convencer o fornecedor a dar um desconto à escola, de modo que seja possível comprar a quantidade total de papel ofício necessária para o bimestre.</p>",
      "enunciado": "<p>O desconto necessário no preço final da compra, em porcentagem, pertence ao intervalo</p>",
      "alternativas": {
        "A": "(5,0 ; 5,5).",
        "B": "(8,0 ; 8,5).",
        "C": "(11,5 ; 12,5).",
        "D": "(19,5 ; 20,5).",
        "E": "(3,5 ; 4,0)."
      },
      "explicacao": "A compra é proporcional aos alunos: 6 000 folhas para 1 200 alunos dão 5 folhas por aluno, então agora são 1 150 × 5 = 5 750 folhas. Como as folhas vêm em embalagens de 100, é preciso comprar 58 embalagens (57 não bastam), o que custa 58 × 4 = 232 reais. Para pagar só 220, o desconto deve ser de 12 reais sobre 232: 12 ÷ 232 ≈ 0,0517, ou cerca de 5,2%, que está entre 5,0% e 5,5%.",
      "faltou": {
        "B": "Você usou as 6 000 folhas do bimestre passado (60 embalagens, R$ 240,00) e achou 20 ÷ 240 ≈ 8,3%. Faltou ajustar a quantidade para os 1 150 alunos de agora.",
        "C": "Você achou a diferença certa em reais (R$ 12,00) e leu esse número como se fosse a porcentagem. O desconto em porcentagem é 12 dividido pelo preço total, 232.",
        "D": "Você usou a compra antiga (R$ 240,00) e tomou a diferença de R$ 20,00 como se já fosse a porcentagem. Era preciso usar 1 150 alunos e dividir a diferença pelo preço total.",
        "E": "Você arredondou 57,5 embalagens para baixo (57 embalagens, R$ 228,00) e achou 8 ÷ 228 ≈ 3,5%. Com 57 embalagens faltariam 50 folhas, então são 58 embalagens."
      },
      "secao": 2,
      "nivel": "difícil",
      "fonte": "Enem 2023, 2º dia, Caderno Azul, questão 167. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 26)"
    },
    {
      "id": "enem-2019-153",
      "ano": 2019,
      "numero": 153,
      "caderno": "Azul",
      "aplicacao": "1ª aplicação",
      "coProva": 515,
      "coItem": 30570,
      "habilidade": "H3",
      "a": 3.176,
      "b": 2.357,
      "c": 0.273,
      "gabarito": "E",
      "contexto": "<p>Segundo o Instituto Brasileiro de Geografia e Estatística (IBGE), o rendimento médio mensal dos trabalhadores brasileiros, no ano 2000, era de R$ 1 250,00. Já o Censo 2010 mostrou que, em 2010, esse valor teve um aumento de 7,2% em relação a 2000. Esse mesmo instituto projeta que, em 2020, o rendimento médio mensal dos trabalhadores brasileiros poderá ser 10% maior do que foi em 2010.</p><p>IBGE. <strong>Censo 2010</strong>. Disponível em: www.ibge.gov.br. Acesso em: 13 ago. 2012 (adaptado).</p>",
      "enunciado": "<p>Supondo que as projeções do IBGE se realizem, o rendimento médio mensal dos brasileiros em 2020 será de</p>",
      "alternativas": {
        "A": "R$ 1 340,00.",
        "B": "R$ 1 349,00.",
        "C": "R$ 1 375,00.",
        "D": "R$ 1 465,00.",
        "E": "R$ 1 474,00."
      },
      "explicacao": "Os dois aumentos são aplicados um depois do outro. De 2000 para 2010: 1 250 × 1,072 = 1 340. De 2010 para 2020, 10% sobre o valor de 2010: 1 340 × 1,10 = 1 474. O rendimento projetado é R$ 1 474,00.",
      "faltou": {
        "A": "Você parou em 2010 (1 250 × 1,072 = 1 340). Ainda faltava aplicar a projeção de 10% para 2020.",
        "B": "Você aplicou os 10% só sobre o aumento de R$ 90,00 (somando R$ 9,00) e não sobre o rendimento inteiro de 2010. O novo aumento vale sobre os R$ 1 340,00.",
        "C": "Você aplicou só os 10% sobre o valor de 2000 (1 250 × 1,10 = 1 375) e esqueceu o aumento de 7,2% entre 2000 e 2010.",
        "D": "Você somou as porcentagens (7,2% + 10% = 17,2%) e aplicou sobre R$ 1 250,00. Aumentos seguidos se multiplicam: o segundo incide sobre o valor já aumentado."
      },
      "secao": 3,
      "nivel": "difícil",
      "fonte": "Enem 2019, 2º dia, Caderno Azul, questão 153. INEP, CC BY-ND 3.0.",
      "transcricao": "enem.dev, conferida com ITENS_PROVA e, palavra por palavra, com o caderno oficial do INEP (PDF, Caderno Azul, p. 22); destaque da referência como no caderno"
    }
  ],
  "autoria": {
    "equipe": "Prumo",
    "ia": "Claude Opus 5.5 (Anthropic), via Claude Code",
    "revisao": "pendente"
  }
};
