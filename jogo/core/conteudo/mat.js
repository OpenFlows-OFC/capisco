(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'mat-basica',
  materia: 'mat',
  titulo: 'Matemática básica do ENEM',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Razão, proporção, porcentagem, juros, função afim e medidas de tendência central aplicadas a situações do dia a dia.',
  topicos: [
    // ------------------------------------------------------------------
    {
      id: 'mat-bas-razao',
      nome: 'Razão e proporção',
      resumo: 'Razões, proporções, escalas e grandezas direta e inversamente proporcionais.',
      prereq: [],
      fonte: 'Apostila de Matemática · Aritmética, cap. 1',
      itens: [
        {
          id: 'mat-bas-razao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que é uma proporção?',
          opcoes: [
            { t: 'Uma divisão entre dois números quaisquer.', erro: 'Confunde proporção com razão; proporção é a igualdade entre duas razões.' },
            { t: 'Uma igualdade entre duas razões, como a/b = c/d.', ok: true },
            { t: 'A diferença entre dois valores.', erro: 'Confunde comparação por quociente (razão) com comparação por diferença.' },
            { t: 'Uma grandeza que sempre aumenta quando outra aumenta.', erro: 'Confunde o conceito de proporção com o de grandezas diretamente proporcionais.' }
          ],
          explicacao: 'Razão compara duas quantidades por divisão, como 3/4. Proporção é quando duas razões são iguais, como 3/4 = 6/8.',
          trecho: 'Razão entre a e b (b ≠ 0) é o quociente a/b. Proporção é a igualdade entre duas razões: a/b = c/d.'
        },
        {
          id: 'mat-bas-razao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Num mapa com escala 1 : 50 000, qual distância real corresponde a 4 cm no papel?',
          opcoes: [
            { t: '200 m', erro: 'Erra a conversão de unidades: 200 000 cm são 2 000 m, não 200 m.' },
            { t: '20 km', erro: 'Desloca a vírgula ao converter centímetros em quilômetros.' },
            { t: '12 500 cm', erro: 'Divide pela escala em vez de multiplicar.' },
            { t: '2 km', ok: true }
          ],
          explicacao: 'Escala 1 : 50 000 quer dizer que 1 cm no mapa vale 50 000 cm reais. Então 4 cm valem 200 000 cm = 2 000 m = 2 km.',
          trecho: 'Escala é a razão entre a medida no desenho e a medida real correspondente, ambas na mesma unidade.'
        },
        {
          id: 'mat-bas-razao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os pares de grandezas inversamente proporcionais.',
          opcoes: [
            { t: 'Velocidade e tempo de viagem, para uma distância fixa.', ok: true },
            { t: 'Quantidade de gasolina e valor pago no posto.', ok: false, erro: 'São diretamente proporcionais: se uma dobra, a outra também dobra.' },
            { t: 'Número de operários e tempo para terminar uma obra, no mesmo ritmo de trabalho.', ok: true },
            { t: 'Idade e altura de uma pessoa.', ok: false, erro: 'Aumentam juntas por um tempo, mas não há razão nem produto constante: não são proporcionais.' },
            { t: 'Número de pessoas e fatias de uma pizza que cada uma recebe, dividindo igualmente.', ok: true }
          ],
          explicacao: 'Em grandezas inversamente proporcionais, o produto é constante: dobrar uma faz a outra cair pela metade. Velocidade × tempo = distância fixa é o exemplo clássico.',
          trecho: 'Duas grandezas são inversamente proporcionais quando o produto entre seus valores correspondentes é constante.'
        },
        {
          id: 'mat-bas-razao-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Uma receita usa 3 xícaras de farinha para 2 ovos. Quantas xícaras são necessárias para 8 ovos? Mostre a proporção.',
          modelo: '3/2 = x/8, então 2x = 24 e x = 12 xícaras (os ovos quadruplicaram, e a farinha também).',
          criterios: [
            { rotulo: 'Monta a proporção ou identifica o fator 4', chaves: ['3/2', 'x/8', '2x', '4 vezes', 'quadrupl', 'vezes 4', '3 x 4', '3x4', '4x3', '4 x 3'] },
            { rotulo: 'Chega a 12 xícaras', chaves: ['12'] }
          ],
          explicacao: 'Farinha e ovos são diretamente proporcionais. Como 8 ovos são 4 vezes 2 ovos, a farinha também é multiplicada por 4: 3 × 4 = 12.',
          trecho: 'Em grandezas diretamente proporcionais, a razão entre os valores correspondentes é constante, o que permite montar a regra de três simples.'
        },
        {
          id: 'mat-bas-razao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Propriedade fundamental das proporções',
          verso: 'Em a/b = c/d, o produto dos meios é igual ao produto dos extremos: a·d = b·c.',
          explicacao: 'É a “multiplicação cruzada” da regra de três.',
          trecho: 'Em toda proporção, o produto dos extremos é igual ao produto dos meios.'
        },
        {
          id: 'mat-bas-razao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'O rótulo de um suco concentrado orienta a diluição na proporção de 1 parte de suco para 4 partes de água. Uma pessoa quer preparar 2,5 litros de suco pronto para uma festa.',
          enunciado: 'Quanto de concentrado ela deve usar?',
          passos: [
            '1 parte de suco + 4 de água = 5 partes no total.',
            '2,5 L ÷ 5 = 0,5 L por parte.',
            'Concentrado = 1 parte = 0,5 L (500 mL); água = 2 L.'
          ],
          opcoes: [
            { t: '625 mL', erro: 'Divide o total por 4, lendo “1 para 4” como “1 parte em 4”.' },
            { t: '500 mL', ok: true },
            { t: '2 L', erro: 'Troca as partes: calcula a água como se fosse o concentrado.' },
            { t: '10 L', erro: 'Multiplica 2,5 por 4, calculando a água para 2,5 L de concentrado.' }
          ],
          explicacao: '“1 para 4” compara suco com água, não suco com o total. O total tem 5 partes, então o concentrado é 1/5 de 2,5 L.',
          trecho: 'Numa mistura na razão a : b, a fração de cada componente no total é a/(a + b) e b/(a + b).'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'mat-bas-porcentagem',
      nome: 'Porcentagem',
      resumo: 'Porcentagem como razão de base 100, fator multiplicativo e variações sucessivas.',
      prereq: ['mat-bas-razao'],
      fonte: 'Apostila de Matemática · Aritmética, cap. 2',
      itens: [
        {
          id: 'mat-bas-porcentagem-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que significa 35%?',
          opcoes: [
            { t: '0,035', erro: 'Desloca a vírgula três casas, em vez de duas.' },
            { t: '35/10 = 3,5', erro: 'Divide por 10 em vez de 100.' },
            { t: '35 partes em cada 100, ou 35/100 = 0,35.', ok: true },
            { t: '35 unidades, qualquer que seja o total.', erro: 'Trata a porcentagem como valor absoluto, e não como uma parte relativa ao total.' }
          ],
          explicacao: 'Porcentagem é uma razão com denominador 100. Para fazer contas, 35% vira 35/100 = 0,35.',
          trecho: 'Porcentagem é uma razão centesimal: p% = p/100.'
        },
        {
          id: 'mat-bas-porcentagem-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um produto sobe 20% e, depois, cai 20%. Em relação ao preço inicial, ele fica:',
          opcoes: [
            { t: 'com o mesmo preço.', erro: 'Trata as duas porcentagens como se incidissem sobre a mesma base e se anulassem.' },
            { t: '4% mais caro.', erro: 'Acha que o aumento pesa mais por ter vindo primeiro.' },
            { t: '4% mais barato.', ok: true },
            { t: '20% mais barato.', erro: 'Considera só a última variação, ignorando a primeira.' }
          ],
          explicacao: 'Os 20% de queda incidem sobre um valor já aumentado. Com fatores: 1,20 × 0,80 = 0,96, ou seja, 4% abaixo do preço inicial.',
          trecho: 'Em variações percentuais sucessivas, multiplicam-se os fatores de cada variação; as porcentagens não podem ser somadas.'
        },
        {
          id: 'mat-bas-porcentagem-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas.',
          opcoes: [
            { t: 'Aumentar um valor em 15% é multiplicá-lo por 1,15.', ok: true },
            { t: 'Dois descontos seguidos de 10% equivalem a um desconto de 20%.', ok: false, erro: 'Soma porcentagens que incidem sobre bases diferentes; 0,9 × 0,9 = 0,81, desconto de 19%.' },
            { t: 'Dar 30% de desconto é multiplicar o preço por 0,7.', ok: true },
            { t: 'Dois aumentos seguidos de 10% equivalem a um aumento de 21%.', ok: true },
            { t: 'Se A é 25% maior que B, então B é 25% menor que A.', ok: false, erro: 'Esquece que a base muda: se A = 1,25B, então B = 0,8A, ou seja, 20% menor.' }
          ],
          explicacao: 'Pensar em fatores resolve tudo: 1,1 × 1,1 = 1,21 (aumento de 21%) e 0,9 × 0,9 = 0,81 (desconto de 19%). A base da porcentagem sempre importa.',
          trecho: 'Aumento de p% corresponde ao fator (1 + p/100); desconto de p%, ao fator (1 − p/100).'
        },
        {
          id: 'mat-bas-porcentagem-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Numa turma de 40 alunos, 14 foram aprovados na recuperação. Que porcentagem da turma isso representa? Mostre a conta.',
          modelo: '14 ÷ 40 = 0,35, ou seja, 35% da turma.',
          criterios: [
            { rotulo: 'Divide a parte pelo total', chaves: ['14/40', '14 / 40', '14 ÷ 40', '14 dividido', '0,35', '0.35', '7/20'] },
            { rotulo: 'Chega a 35%', chaves: ['35'] }
          ],
          explicacao: 'Porcentagem é parte ÷ todo, depois × 100. 14/40 = 0,35 = 35%.',
          trecho: 'Para saber que porcentagem uma parte representa do todo, divide-se a parte pelo todo e multiplica-se por 100.'
        },
        {
          id: 'mat-bas-porcentagem-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Fator multiplicativo de aumento e de desconto',
          verso: 'Aumento de p%: multiplique por (1 + p/100). Desconto de p%: multiplique por (1 − p/100). Variações sucessivas: multiplique os fatores.',
          explicacao: 'Com o fator, o cálculo sai numa conta só, sem calcular a porcentagem e depois somar ou subtrair.',
          trecho: 'Exemplo: aumento de 8% → fator 1,08; desconto de 15% → fator 0,85.'
        },
        {
          id: 'mat-bas-porcentagem-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Uma loja anuncia “Leve 3, pague 2” para camisetas de R$ 60,00 cada. A loja vizinha vende a mesma camiseta com 30% de desconto em cada unidade. Uma cliente precisa de 3 camisetas.',
          enunciado: 'Qual oferta é melhor para ela?',
          passos: [
            '“Leve 3, pague 2”: 2 × 60 = R$ 120,00.',
            '30% de desconto: 3 × 60 × 0,7 = R$ 126,00.',
            '120 < 126: a promoção equivale a 1/3 ≈ 33,3% de desconto.'
          ],
          opcoes: [
            { t: '30% de desconto: R$ 126,00 contra R$ 180,00.', erro: 'Esquece que, na promoção, só se pagam 2 camisetas.' },
            { t: 'Tanto faz: as duas dão cerca de 30% de desconto.', erro: 'Arredonda o “leve 3, pague 2” para 30%, quando ele equivale a 1/3 ≈ 33,3%.' },
            { t: 'A de 30%, pois economiza R$ 54,00.', erro: 'Calcula a economia de uma oferta só, sem comparar com os R$ 60,00 economizados na outra.' },
            { t: '“Leve 3, pague 2”: R$ 120,00 contra R$ 126,00.', ok: true }
          ],
          explicacao: 'Levar 3 e pagar 2 é ganhar 1 de cada 3 camisetas, ou seja, 1/3 de desconto sobre o total. Isso supera 30%.',
          trecho: 'Para comparar promoções de formatos diferentes, convém calcular o valor final de cada uma ou o desconto percentual equivalente.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'mat-bas-juros',
      nome: 'Juros simples e compostos',
      resumo: 'Capital, taxa, montante e a diferença entre crescimento linear e exponencial.',
      prereq: ['mat-bas-porcentagem'],
      fonte: 'Apostila de Matemática · Matemática financeira, cap. 1',
      itens: [
        {
          id: 'mat-bas-juros-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual é a diferença entre juros simples e juros compostos?',
          opcoes: [
            { t: 'Nos simples, os juros incidem sempre sobre o capital inicial; nos compostos, sobre o montante acumulado.', ok: true },
            { t: 'Nos simples, os juros incidem sobre o montante acumulado; nos compostos, sobre o capital inicial.', erro: 'Inverte as definições dos dois regimes.' },
            { t: 'Nos compostos, a taxa de juros aumenta a cada mês.', erro: 'Confunde o crescimento do montante com um aumento da taxa, que é fixa.' },
            { t: 'Nos simples, os juros são pagos só no fim; nos compostos, todo mês.', erro: 'Confunde o regime de capitalização com a forma de pagamento.' }
          ],
          explicacao: 'Nos compostos, os juros de cada período entram no saldo e passam a render juros também (“juros sobre juros”). Nos simples, os juros de cada período são sempre os mesmos.',
          trecho: 'No regime de juros simples, os juros de cada período são calculados sobre o capital inicial. No regime composto, são calculados sobre o montante do período anterior.'
        },
        {
          id: 'mat-bas-juros-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'R$ 1 000,00 são aplicados a juros compostos de 10% ao mês. Qual é o montante após 2 meses?',
          opcoes: [
            { t: 'R$ 1 200,00', erro: 'Calcula como juros simples, somando 10% do capital inicial a cada mês.' },
            { t: 'R$ 1 100,00', erro: 'Aplica a taxa uma vez só, esquecendo o segundo mês.' },
            { t: 'R$ 1 210,00', ok: true },
            { t: 'R$ 1 020,10', erro: 'Converte 10% em 0,01 em vez de 0,10.' }
          ],
          explicacao: '1º mês: 1 000 × 1,1 = 1 100. 2º mês: 1 100 × 1,1 = 1 210. Os R$ 10,00 a mais em relação aos simples são os juros sobre os juros do 1º mês.',
          trecho: 'Montante a juros compostos: M = C·(1 + i)ᵗ.'
        },
        {
          id: 'mat-bas-juros-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Um capital de R$ 2 000,00 é aplicado a 5% ao mês por 3 meses. Marque todas as corretas.',
          opcoes: [
            { t: 'A juros simples, os juros totais são R$ 300,00.', ok: true },
            { t: 'A juros compostos, o montante é 2 000 × 1,15.', ok: false, erro: 'Soma as taxas (3 × 5%) como se o regime fosse simples.' },
            { t: 'A juros compostos, o montante é 2 000 × 1,05³.', ok: true },
            { t: 'No 1º mês, os juros compostos rendem mais que os simples.', ok: false, erro: 'No primeiro período os dois regimes rendem igual (R$ 100,00); a diferença aparece a partir do 2º.' },
            { t: 'A juros compostos, o montante final supera o de juros simples.', ok: true }
          ],
          explicacao: 'Simples: 2 000 × 0,05 × 3 = 300 de juros (montante 2 300). Compostos: 2 000 × 1,05³ = 2 315,25. A diferença só surge depois do 1º mês.',
          trecho: 'Juros simples: J = C·i·t. Para prazos maiores que um período, juros compostos rendem mais que juros simples à mesma taxa.'
        },
        {
          id: 'mat-bas-juros-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que uma dívida no cartão, a juros compostos, cresce tão rápido quando fica muitos meses sem ser paga?',
          modelo: 'Porque os juros de cada mês entram no saldo e passam a render juros também (juros sobre juros), e a dívida cresce de forma exponencial, cada vez mais rápido.',
          criterios: [
            { rotulo: 'Juros sobre juros: os juros entram no saldo', chaves: ['juros sobre juros', 'acumul', 'incorpor', 'somam ao', 'montante', 'saldo'] },
            { rotulo: 'Crescimento exponencial, cada vez mais rápido', chaves: ['exponenc', 'potenc', 'geometric', 'cada vez mais', 'aceler', 'bola de neve'] }
          ],
          explicacao: 'A cada mês, a base sobre a qual se calculam os juros fica maior. Isso transforma um crescimento linear (simples) em exponencial (compostos).',
          trecho: 'O montante a juros compostos cresce em progressão geométrica, enquanto o montante a juros simples cresce em progressão aritmética.'
        },
        {
          id: 'mat-bas-juros-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Fórmulas do montante',
          verso: 'Simples: M = C·(1 + i·t). Compostos: M = C·(1 + i)ᵗ. A taxa i entra na forma decimal e na mesma unidade de tempo de t.',
          explicacao: 'Nos simples, o t multiplica a taxa; nos compostos, o t vira expoente. É daí que vem a diferença entre linear e exponencial.',
          trecho: 'Taxa e prazo devem estar na mesma unidade de tempo: taxa mensal com prazo em meses, taxa anual com prazo em anos.'
        },
        {
          id: 'mat-bas-juros-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Joana tem uma dívida de R$ 500,00 no cartão de crédito, com juros compostos de 10% ao mês. Por um aperto financeiro, ela fica 3 meses sem pagar nada.',
          enunciado: 'Quanto ela deve ao fim dos 3 meses?',
          passos: [
            'Juros compostos: a cada mês, multiplica-se o saldo por 1,10.',
            '500 → 550 → 605 → 665,50.',
            'Direto: 500 × 1,1³ = 500 × 1,331 = R$ 665,50.'
          ],
          opcoes: [
            { t: 'R$ 650,00', erro: 'Calcula a juros simples: 3 × R$ 50,00 sobre o valor inicial.' },
            { t: 'R$ 550,00', erro: 'Aplica os 10% uma vez só.' },
            { t: 'R$ 665,50', ok: true },
            { t: 'R$ 1 650,00', erro: 'Multiplica o fator 1,1 por 3 em vez de elevá-lo ao cubo.' }
          ],
          explicacao: 'Cada mês os juros incidem sobre o saldo do mês anterior, que já inclui juros. Por isso a dívida passa dos R$ 650,00 que daria a juros simples.',
          trecho: 'Em juros compostos, o montante após t períodos é obtido multiplicando o capital pelo fator (1 + i) t vezes.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'mat-bas-afim',
      nome: 'Função afim',
      resumo: 'A lei f(x) = ax + b, coeficientes, raiz, gráfico e comparação de planos e tarifas.',
      prereq: ['mat-bas-razao'],
      fonte: 'Apostila de Matemática · Funções, cap. 2',
      itens: [
        {
          id: 'mat-bas-afim-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Na função f(x) = ax + b, o que representa b?',
          opcoes: [
            { t: 'A raiz, ponto onde o gráfico corta o eixo x.', erro: 'Confunde o coeficiente linear com o zero da função (x = −b/a).' },
            { t: 'A inclinação da reta.', erro: 'Confunde o coeficiente linear (b) com o angular (a).' },
            { t: 'O coeficiente linear: o valor de f quando x = 0, onde o gráfico corta o eixo y.', ok: true },
            { t: 'O valor máximo da função.', erro: 'Função afim não tem máximo; confunde com a função quadrática.' }
          ],
          explicacao: 'Substituindo x = 0, sobra f(0) = b. Por isso b é o ponto onde a reta cruza o eixo y. Em problemas, costuma ser o valor fixo, como uma taxa inicial.',
          trecho: 'Na função afim f(x) = ax + b, a é o coeficiente angular e b é o coeficiente linear; o gráfico intercepta o eixo y no ponto (0, b).'
        },
        {
          id: 'mat-bas-afim-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Uma reta passa pelos pontos (0, 3) e (2, 7). Qual é a sua lei?',
          opcoes: [
            { t: 'f(x) = 3x + 2', erro: 'Troca os papéis de a e b.' },
            { t: 'f(x) = 4x + 3', erro: 'Calcula a variação de y (4) sem dividir pela variação de x (2).' },
            { t: 'f(x) = 2x + 3', ok: true },
            { t: 'f(x) = 0,5x + 3', erro: 'Calcula Δx/Δy, invertendo a razão.' }
          ],
          explicacao: 'O ponto (0, 3) já dá b = 3. A inclinação é a = Δy/Δx = (7 − 3)/(2 − 0) = 2. Conferindo: f(2) = 2·2 + 3 = 7.',
          trecho: 'O coeficiente angular de uma reta que passa por (x₁, y₁) e (x₂, y₂) é a = (y₂ − y₁)/(x₂ − x₁).'
        },
        {
          id: 'mat-bas-afim-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Sobre a função f(x) = −2x + 6, marque todas as corretas.',
          opcoes: [
            { t: 'É decrescente.', ok: true },
            { t: 'Sua raiz é x = −3.', ok: false, erro: 'Erra o sinal ao isolar x em −2x + 6 = 0.' },
            { t: 'Seu gráfico corta o eixo y em (0, 6).', ok: true },
            { t: 'Sua raiz é x = 3.', ok: true },
            { t: 'Quando x aumenta 1 unidade, y aumenta 2.', ok: false, erro: 'Ignora o sinal de a; com a = −2, y diminui 2.' }
          ],
          explicacao: 'a = −2 < 0: função decrescente, y cai 2 a cada unidade de x. b = 6: corta o eixo y em 6. Raiz: −2x + 6 = 0 → x = 3.',
          trecho: 'Se a > 0, a função afim é crescente; se a < 0, é decrescente. A raiz é o valor de x para o qual f(x) = 0.'
        },
        {
          id: 'mat-bas-afim-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Um táxi cobra R$ 5,00 de bandeirada mais R$ 2,50 por quilômetro. Escreva o preço P em função dos x km rodados e calcule o preço de uma corrida de 10 km.',
          modelo: 'P(x) = 2,5x + 5; P(10) = 2,5 · 10 + 5 = R$ 30,00.',
          criterios: [
            { rotulo: 'Escreve P = 2,5x + 5', chaves: ['2,5x', '2.5x', '2,50x', '2,5 x', '2,5·x', '2,5*x', '2,50 x', '5 + 2,5'] },
            { rotulo: 'Calcula R$ 30,00', chaves: ['30'] }
          ],
          explicacao: 'A parte que varia com a distância (R$ 2,50 por km) é o coeficiente a; o valor fixo (bandeirada) é o b. Para 10 km: 25 + 5 = 30.',
          trecho: 'Situações com um valor fixo mais um valor proporcional a uma quantidade são modeladas por funções afins.'
        },
        {
          id: 'mat-bas-afim-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Como achar o coeficiente angular a partir de dois pontos?',
          verso: 'a = Δy/Δx = (y₂ − y₁)/(x₂ − x₁). Se a > 0, a função é crescente; se a < 0, decrescente.',
          explicacao: 'O coeficiente angular diz quanto y muda para cada 1 unidade de x: é a taxa de variação da função.',
          trecho: 'Na função afim, a taxa de variação Δy/Δx é constante e igual ao coeficiente angular a.'
        },
        {
          id: 'mat-bas-afim-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Uma operadora de telefone oferece dois planos. Plano A: mensalidade de R$ 40,00 mais R$ 0,50 por minuto. Plano B: mensalidade de R$ 70,00 mais R$ 0,20 por minuto.',
          enunciado: 'A partir de quantos minutos por mês o plano B passa a ser mais vantajoso?',
          passos: [
            'Plano A: 40 + 0,5x. Plano B: 70 + 0,2x.',
            'Igualando: 0,3x = 30 → x = 100 min (os planos empatam).',
            'Acima de 100 min, a tarifa menor de B compensa a mensalidade maior.'
          ],
          opcoes: [
            { t: 'Mais de 60 minutos', erro: 'Divide a diferença das mensalidades (R$ 30,00) só pela tarifa do plano A.' },
            { t: 'Mais de 150 minutos', erro: 'Divide a diferença das mensalidades só pela tarifa do plano B.' },
            { t: 'Mais de 43 minutos', erro: 'Soma as tarifas (0,70) em vez de usar a diferença entre elas.' },
            { t: 'Mais de 100 minutos', ok: true }
          ],
          explicacao: 'Cada minuto no plano B sai R$ 0,30 mais barato. Para compensar os R$ 30,00 a mais de mensalidade, são precisos 30 ÷ 0,30 = 100 minutos.',
          trecho: 'O ponto de interseção dos gráficos de duas funções afins indica o valor de x em que elas se igualam.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'mat-bas-estatistica',
      nome: 'Média, mediana e moda',
      resumo: 'Medidas de tendência central, como calculá-las e quando cada uma representa melhor os dados.',
      prereq: ['mat-bas-porcentagem'],
      fonte: 'Apostila de Matemática · Estatística, cap. 1',
      itens: [
        {
          id: 'mat-bas-estatistica-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que é a mediana de um conjunto de dados?',
          opcoes: [
            { t: 'O valor que mais se repete.', erro: 'Confunde mediana com moda.' },
            { t: 'A soma dos valores dividida pela quantidade de valores.', erro: 'Confunde mediana com média aritmética.' },
            { t: 'O valor central com os dados em ordem (ou a média dos dois centrais, se a quantidade for par).', ok: true },
            { t: 'O valor que está no meio da lista, na ordem em que foi coletado.', erro: 'Esquece de ordenar os dados antes de buscar o valor central.' }
          ],
          explicacao: 'A mediana divide os dados ordenados em duas metades: metade dos valores fica abaixo dela e metade acima.',
          trecho: 'Mediana é o valor que ocupa a posição central de um conjunto de dados ordenado. Se o número de dados for par, é a média aritmética dos dois valores centrais.'
        },
        {
          id: 'mat-bas-estatistica-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'As notas de um aluno foram 4, 8, 6, 8 e 9. Quais são, respectivamente, a média, a mediana e a moda?',
          opcoes: [
            { t: '7; 6; 8', erro: 'Pega o termo central da lista sem ordenar os dados.' },
            { t: '7; 8; 8', ok: true },
            { t: '8,75; 8; 8', erro: 'Divide a soma por 4 em vez de 5 (quantidade de notas).' },
            { t: '7; 7; 8', erro: 'Acha que a mediana é sempre igual à média.' }
          ],
          explicacao: 'Média: 35 ÷ 5 = 7. Ordenando (4, 6, 8, 8, 9), o termo central é 8. A nota que mais aparece é 8.',
          trecho: 'Média aritmética é a soma dos valores dividida pela quantidade de valores. Moda é o valor de maior frequência.'
        },
        {
          id: 'mat-bas-estatistica-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Numa empresa, 9 funcionários ganham R$ 2 000,00 e o dono ganha R$ 32 000,00. Marque todas as corretas.',
          opcoes: [
            { t: 'A média salarial é R$ 5 000,00.', ok: true },
            { t: 'A moda é R$ 32 000,00, o maior valor.', ok: false, erro: 'Confunde moda (valor mais frequente) com valor máximo.' },
            { t: 'A mediana é R$ 2 000,00.', ok: true },
            { t: 'A mediana representa melhor o salário típico que a média.', ok: true },
            { t: 'Média e mediana são sempre próximas.', ok: false, erro: 'Um valor extremo puxa a média, mas quase não afeta a mediana.' }
          ],
          explicacao: 'Média: (9 × 2 000 + 32 000) ÷ 10 = 5 000, mas ninguém da equipe ganha isso. O salário do dono puxa a média; a mediana (2 000) mostra melhor a realidade.',
          trecho: 'A média aritmética é sensível a valores extremos; a mediana é uma medida resistente, pouco afetada por eles.'
        },
        {
          id: 'mat-bas-estatistica-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a mediana costuma ser mais indicada que a média quando há valores muito discrepantes?',
          modelo: 'Porque a média é puxada pelos valores extremos, enquanto a mediana depende só da posição central dos dados ordenados e quase não muda com um valor discrepante.',
          criterios: [
            { rotulo: 'A média é influenciada pelos valores extremos', chaves: ['extrem', 'discrep', 'outlier', 'puxa', 'distorc', 'influenc', 'afeta'] },
            { rotulo: 'A mediana depende da posição central', chaves: ['central', 'meio', 'posic', 'ordem', 'ordena'] }
          ],
          explicacao: 'Trocar o maior valor por um número enorme muda a soma (e a média), mas não muda quem está no meio da fila. Por isso renda e preço de imóveis costumam ser informados pela mediana.',
          trecho: 'Em distribuições com valores discrepantes, a mediana representa melhor o valor típico do conjunto do que a média.'
        },
        {
          id: 'mat-bas-estatistica-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Moda de um conjunto de dados',
          verso: 'É o valor que aparece com maior frequência. Pode haver mais de uma moda (bimodal) ou nenhuma (amodal).',
          explicacao: 'A moda é a única medida de tendência central que também serve para dados não numéricos, como a cor preferida de uma turma.',
          trecho: 'Moda é o valor de maior frequência num conjunto de dados; um conjunto pode ser amodal, unimodal, bimodal ou multimodal.'
        },
        {
          id: 'mat-bas-estatistica-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Um estudante tirou 6, 7 e 5 nas três primeiras provas do ano. As provas têm o mesmo peso, e para passar direto a média das quatro provas precisa ser pelo menos 7.',
          enunciado: 'Qual é a nota mínima que ele precisa tirar na 4ª prova?',
          passos: [
            'Média 7 em 4 provas: soma mínima = 7 × 4 = 28.',
            'Soma atual: 6 + 7 + 5 = 18.',
            'Nota necessária: 28 − 18 = 10.'
          ],
          opcoes: [
            { t: '7', erro: 'Acha que basta tirar na última prova a média desejada.' },
            { t: '8', erro: 'Soma ao 7 só o ponto que falta na média atual (6), sem considerar que o déficit vale para as 3 provas.' },
            { t: '1', erro: 'Calcula só quanto falta na média (7 − 6), e não a nota da prova.' },
            { t: '10', ok: true }
          ],
          explicacao: 'Em média, o que importa é a soma. Ele está 3 pontos abaixo do necessário (1 em cada prova), então a 4ª nota precisa ser 7 + 3 = 10.',
          trecho: 'Se a média de n valores deve ser M, a soma desses valores deve ser n × M.'
        }
      ]
    }
  ]
});
