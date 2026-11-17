// Caderno "Funções afins" · Caps. 3 e 4 (págs. 5–8) · item 1 do Corte B (g.4).
// GERADO por _dev/c34_build.mjs em 2026-11-17. Não edite à mão: edite _dev/c34_fonte.mjs e rode
//   node prumo/_dev/c34_build.mjs
// Esquema: e.2 da especificação (PRODUTO_PRUMO.md), com estes acréscimos, todos opcionais para quem lê:
//  - capitulo.cards: [{ id, tipo, frente, verso, bloco, paragrafo, autoria }] (Decisão 1 do dono).
//  - bloco.papel: "nucleo" | "cobrado" | "apoio"; paragrafo.n: número do § na página.
//  - modelo.tipo "aplicar" (questão da equipe no papel de aplicar, só no Cap. 4); na rodada ela aparece
//    como "mat-fa.c4.ap#0" (id do modelo # linha), no mesmo formato que o estado usa para variantes.
//  - modelo.explicacao (molde da resolução), modelo.formato e, em cada linha, "pronto": enunciado,
//    alternativas (em ordem crescente, com "falta" e "paragrafo" nas erradas), gabarito e explicação
//    já preenchidos, para a tela não precisar avaliar expressões.
//  - questão: capitulo, exprCerta, teste (dados do teste de d.6), transcricao, conferidoITENS_PROVA,
//    conferenciaPDF (PDF, SHA-256, página e correções da transcrição, _dev/correcoes_enem.mjs);
//    alternativa.esperado quando a "expr" confere uma propriedade do erro e não o valor;
//    imagem.recorte quando a imagem é recorte do PDF oficial (mesmo nome de arquivo).
// Autoria: todo texto da equipe é rascunho por IA (Claude Opus 5.5), revisão pendente.
// Licenças: texto, modelos, explicações e cards da equipe em CC BY-SA 4.0; cada questão do Enem
// mantém a licença indicada nela (CC BY-ND 3.0, INEP), reproduzida sem adaptação.

export const capitulos34 = [
  {
    "id": "mat-fa.c3",
    "n": 3,
    "titulo": "Taxa de variação",
    "habilidades": [
      "MT-H20"
    ],
    "prereq": [
      "mat-fa.c1",
      "mat-fa.c2"
    ],
    "paginas": [
      {
        "id": "mat-fa.p5",
        "n": 5,
        "capitulo": "mat-fa.c3",
        "titulo": "Quanto por minuto",
        "blocos": [
          {
            "id": "mat-fa.p5.b1",
            "papel": "nucleo",
            "paragrafos": [
              {
                "id": "mat-fa.p5.b1.s1",
                "n": 1,
                "html": "<strong>Taxa de variação</strong> é quanto uma grandeza muda a cada unidade de outra. A conta é sempre uma divisão: quanto mudou, dividido pelo intervalo em que mudou. Um ônibus andou 6 km em 15 minutos. A taxa é 6 ÷ 15 = 0,4 km por minuto."
              },
              {
                "id": "mat-fa.p5.b1.s2",
                "n": 2,
                "html": "A unidade diz a ordem da divisão. Em “km por minuto”, o km vai em cima e o minuto embaixo. A conta ao contrário, 15 ÷ 6 = 2,5, mede outra coisa: minutos por km, o tempo para andar 1 km. Nessa unidade, quanto maior o número, mais devagar."
              },
              {
                "id": "mat-fa.p5.b1.s3",
                "n": 3,
                "html": "O maior total não é, sozinho, a maior taxa. Bia pedalou 15 km em 60 minutos; Caio, 10 km em 25 minutos. Bia andou mais, mas Caio foi mais rápido: 10 ÷ 25 = 0,4 km por minuto, contra 15 ÷ 60 = 0,25. Para comparar, divida cada total pelo próprio tempo. Somar os dois, multiplicar ou ficar com o maior número não compara taxas."
              }
            ]
          },
          {
            "id": "mat-fa.p5.b2",
            "papel": "apoio",
            "paragrafos": [
              {
                "id": "mat-fa.p5.b2.s4",
                "n": 4,
                "html": "No gráfico, a taxa vira inclinação. Se os dois eixos começam em 0, ligue o ponto (0; 0) a cada ponto: quanto mais em pé o segmento, maior a taxa. Se um dos eixos não começa em 0, o canto do gráfico não é o ponto (0; 0), e a inclinação engana: faça a divisão de cada ponto. Dois pontos na mesma altura têm o mesmo total, mas o que está mais à direita levou mais tempo e tem taxa menor. É o <em>a</em> de y = ax + b, da p. 2: quanto y muda quando x anda 1."
              }
            ]
          }
        ],
        "modelo": "mat-fa.p5.m",
        "nucleo": "mat-fa.p5.b1",
        "notaPrompt": "Com suas palavras: por que quem fez mais nem sempre foi mais rápido?",
        "credito": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        },
        "fonte": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        }
      },
      {
        "id": "mat-fa.p6",
        "n": 6,
        "capitulo": "mat-fa.c3",
        "titulo": "Trecho a trecho",
        "blocos": [
          {
            "id": "mat-fa.p6.b1",
            "papel": "nucleo",
            "paragrafos": [
              {
                "id": "mat-fa.p6.b1.s1",
                "n": 1,
                "html": "Alguns gráficos e tabelas mostram um <strong>total acumulado</strong>: cada valor é tudo o que já foi somado desde o começo. O hodômetro do carro e o consumo do mês no aplicativo de internet funcionam assim. Quando só se soma, como no hodômetro, um total acumulado nunca desce. No máximo, fica parado."
              },
              {
                "id": "mat-fa.p6.b1.s2",
                "n": 2,
                "html": "O que aconteceu num trecho é a <strong>subida</strong> do trecho: valor no fim menos valor no começo. Se o trecho dura 1 minuto, essa subida já é a taxa daquele minuto. O 4º minuto vai de t = 3 a t = 4, e não de 0 a 4. Cada minuto tem a sua subida. Uma sequência cujo total confere com o fim do gráfico ainda pode errar minuto a minuto: confira um por um."
              }
            ]
          },
          {
            "id": "mat-fa.p6.b2",
            "papel": "cobrado",
            "prePergunta": "mat-fa.p6.b2.m",
            "paragrafos": [
              {
                "id": "mat-fa.p6.b2.s3",
                "n": 3,
                "html": "Às vezes a pergunta é a <strong>diferença</strong> entre duas curvas no mesmo ponto do eixo horizontal. Lucro é receita menos custo, nessa ordem. Em cada valor do eixo horizontal, pegue a altura da receita e tire a altura do custo. O resultado é uma terceira curva, diferente das duas."
              },
              {
                "id": "mat-fa.p6.b2.s4",
                "n": 4,
                "html": "Essa curva nova tem sinal. Onde a receita está acima do custo, o lucro é positivo. Onde as duas se cruzam, o lucro é zero. Onde o custo passa por cima, o lucro é <strong>negativo</strong>: é prejuízo, e a curva desce abaixo do eixo. Desenhar só a distância entre as curvas, sempre positiva, apaga o prejuízo."
              }
            ]
          }
        ],
        "modelo": "mat-fa.p6.m",
        "nucleo": "mat-fa.p6.b1",
        "notaPrompt": "Com suas palavras: num total acumulado, como você descobre o que aconteceu em um minuto só?",
        "credito": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        },
        "fonte": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        }
      }
    ],
    "rodada": [
      "enem-2019-143",
      "enem-2020-175",
      "enem-2019-179"
    ],
    "reserva": [],
    "irAlem": [
      {
        "tipo": "khan",
        "rotulo": "Taxa de variação de uma função afim, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 4, 3º Bimestre)",
        "url": "https://pt.khanacademy.org/math/1-serie-em-mat-sp/x82b03a9b6c8af113:3-bimestre-2026",
        "aviso": "Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org. O Prumo não é oficial nem endossado pela Khan Academy.",
        "conferidoEm": "2026-11-17"
      },
      {
        "tipo": "obmep",
        "rotulo": "Portal da OBMEP: módulo Função Afim (videoaulas e exercícios)",
        "url": "https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=35",
        "aviso": "Abre o Portal da OBMEP (IMPA) em outra aba. O Prumo só aponta o link; o conteúdo do portal não é copiado.",
        "conferidoEm": "2026-11-17"
      }
    ],
    "cards": [
      {
        "id": "mat-fa.c3.k1",
        "tipo": "conceito",
        "frente": "O que é taxa de variação?",
        "verso": "Quanto uma grandeza muda a cada unidade da outra: o quanto mudou, dividido pelo intervalo.",
        "bloco": "mat-fa.p5.b1",
        "paragrafo": "mat-fa.p5.b1.s1",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k2",
        "tipo": "palavra-pista",
        "frente": "Em “km por minuto”, o que vai embaixo na divisão?",
        "verso": "O minuto. O que vem depois de “por” é o divisor: km ÷ minutos.",
        "bloco": "mat-fa.p5.b1",
        "paragrafo": "mat-fa.p5.b1.s2",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k3",
        "tipo": "armadilha",
        "frente": "Quem fez o maior total foi o mais rápido?",
        "verso": "Não necessariamente. Divida cada total pelo próprio tempo antes de comparar.",
        "bloco": "mat-fa.p5.b1",
        "paragrafo": "mat-fa.p5.b1.s3",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k4",
        "tipo": "procedimento",
        "frente": "Como achar a maior taxa num gráfico de pontos?",
        "verso": "Se os dois eixos começam em 0, ligue (0; 0) a cada ponto: o segmento mais inclinado tem a maior taxa. Se não, divida.",
        "bloco": "mat-fa.p5.b2",
        "paragrafo": "mat-fa.p5.b2.s4",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k5",
        "tipo": "conceito",
        "frente": "O que mostra um total acumulado?",
        "verso": "Em cada ponto, tudo o que foi somado desde o começo. Se só se soma, ele nunca desce.",
        "bloco": "mat-fa.p6.b1",
        "paragrafo": "mat-fa.p6.b1.s1",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k6",
        "tipo": "procedimento",
        "frente": "Num total acumulado, como achar o que houve no 4º minuto?",
        "verso": "Valor em t = 4 menos valor em t = 3. O 4º minuto vai de 3 a 4.",
        "bloco": "mat-fa.p6.b1",
        "paragrafo": "mat-fa.p6.b1.s2",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k7",
        "tipo": "armadilha",
        "frente": "A soma das potências deu o total do gráfico. Então a sequência está certa?",
        "verso": "Não basta. Confira a subida de cada trecho, um por um.",
        "bloco": "mat-fa.p6.b1",
        "paragrafo": "mat-fa.p6.b1.s2",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c3.k8",
        "tipo": "procedimento",
        "frente": "Como montar o lucro a partir das curvas de receita e custo?",
        "verso": "Ponto a ponto: receita − custo, nessa ordem. Onde o custo fica acima, o lucro é negativo.",
        "bloco": "mat-fa.p6.b2",
        "paragrafo": "mat-fa.p6.b2.s3",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      }
    ]
  },
  {
    "id": "mat-fa.c4",
    "n": 4,
    "titulo": "Duas condições, um sistema",
    "habilidades": [
      "MT-H21",
      "MT-H22"
    ],
    "prereq": [
      "mat-fa.c1"
    ],
    "paginas": [
      {
        "id": "mat-fa.p7",
        "n": 7,
        "capitulo": "mat-fa.c4",
        "titulo": "Duas frases, duas equações",
        "blocos": [
          {
            "id": "mat-fa.p7.b1",
            "papel": "nucleo",
            "paragrafos": [
              {
                "id": "mat-fa.p7.b1.s1",
                "n": 1,
                "html": "Um problema com dois valores desconhecidos precisa de duas informações. Dê uma letra para cada valor e diga o que ela é: c = preço de uma coxinha, em reais; s = preço de um suco, em reais. Cada condição do texto vira uma equação. Duas condições sobre as mesmas letras formam um <strong>sistema</strong>."
              },
              {
                "id": "mat-fa.p7.b1.s2",
                "n": 2,
                "html": "Traduza a frase inteira, sem pular pedaço. “A coxinha custa R$ 2 a mais que o suco” é c = s + 2. “A coxinha custa R$ 2 a mais que o dobro do suco” é c = 2s + 2. E “a coxinha menos o suco dá o suco mais R$ 2” é c − s = s + 2, que também vira c = 2s + 2. Ler só o “2 a mais” muda o problema."
              },
              {
                "id": "mat-fa.p7.b1.s3",
                "n": 3,
                "html": "Cuide das quantidades e das unidades. Se a coxinha vem em bandeja de 6, uma bandeja custa 6c, e três bandejas custam 3 × 6c = 18c. Centavos viram reais com vírgula: 5 centavos são R$ 0,05; 50 centavos são R$ 0,50. Um zero fora do lugar muda a resposta."
              }
            ]
          },
          {
            "id": "mat-fa.p7.b2",
            "papel": "apoio",
            "paragrafos": [
              {
                "id": "mat-fa.p7.b2.s4",
                "n": 4,
                "html": "Com as duas equações, use a <strong>substituição</strong>: isole uma letra numa equação e leve para a outra. Se uma equação é c = 2s + 2 e a outra é 3c + s = 27, troque c na segunda: 3(2s + 2) + s = 27, então 7s + 6 = 27 e s = 3. Volte à primeira: c = 2 × 3 + 2 = 8. Confira nas duas. Na primeira, 8 = 2 × 3 + 2; na segunda, 3 × 8 + 3 = 27."
              }
            ]
          }
        ],
        "modelo": "mat-fa.p7.m",
        "nucleo": "mat-fa.p7.b1",
        "notaPrompt": "Com suas palavras: como uma frase de comparação vira equação?",
        "credito": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        },
        "fonte": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        }
      },
      {
        "id": "mat-fa.p8",
        "n": 8,
        "capitulo": "mat-fa.c4",
        "titulo": "Comparar as duas condições",
        "blocos": [
          {
            "id": "mat-fa.p8.b1",
            "papel": "nucleo",
            "paragrafos": [
              {
                "id": "mat-fa.p8.b1.s1",
                "n": 1,
                "html": "Quando duas situações dão o mesmo total, compare uma com a outra. Dois pedidos de R$ 28 numa pastelaria: o primeiro com 2 pastéis e 3 caldos de cana; o segundo com 3 pastéis e 1 caldo. Do primeiro para o segundo, entrou 1 pastel e saíram 2 caldos, e o total não mudou."
              },
              {
                "id": "mat-fa.p8.b1.s2",
                "n": 2,
                "html": "Se o total não mudou, o que entrou vale o mesmo que o que saiu: 1 pastel vale 2 caldos. É a <strong>troca</strong> que equilibra. Isso é o mesmo que subtrair uma condição da outra: o que é igual nas duas se cancela, e sobra a troca. Conte por tipo de item, e não pelo total de itens: o pedido ficou com 1 item a menos, mas o que vale é 1 pastel no lugar de 2 caldos."
              },
              {
                "id": "mat-fa.p8.b1.s3",
                "n": 3,
                "html": "Com a troca, dá para montar uma terceira situação sem descobrir cada preço. Quer um pedido de R$ 28 com 1 pastel só? Parta do primeiro (2 pastéis e 3 caldos) e troque 1 pastel por 2 caldos: ficam 1 pastel e 5 caldos. Aplique a troca quantas vezes for preciso, nem uma a mais, nem uma a menos."
              }
            ]
          },
          {
            "id": "mat-fa.p8.b2",
            "papel": "cobrado",
            "prePergunta": "mat-fa.p8.b2.m",
            "paragrafos": [
              {
                "id": "mat-fa.p8.b2.s4",
                "n": 4,
                "html": "No fim, responda exatamente o que foi pedido. Se a pergunta é “quantos caldos”, não some os pastéis. Se uma parte já está ocupada por outros itens, desconte esses itens antes de contar o resto. E confira: a situação nova tem de dar o mesmo total das duas condições."
              }
            ]
          }
        ],
        "modelo": "mat-fa.p8.m",
        "nucleo": "mat-fa.p8.b1",
        "notaPrompt": "Com suas palavras: o que a comparação entre os dois pedidos mostra?",
        "credito": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        },
        "fonte": {
          "fonte": "Equipe Prumo",
          "licenca": "CC BY-SA 4.0",
          "autoria": {
            "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
            "modelo": "Claude Opus 5.5",
            "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
            "data": "2026-11-17",
            "equipe": null,
            "revisor": null,
            "revisadoEm": null
          }
        }
      }
    ],
    "rodada": [
      "enem-2021-164",
      "mat-fa.c4.ap#0",
      "enem-2023-175"
    ],
    "reserva": [],
    "irAlem": [
      {
        "tipo": "khan",
        "rotulo": "Para revisar equações de 1º grau, no curso da Khan para a 1ª série do Ensino Médio de SP (Unidade 3, 2º Bimestre)",
        "url": "https://pt.khanacademy.org/math/1-serie-em-mat-sp/x82b03a9b6c8af113:2-bimestre-2026",
        "aviso": "Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org. O Prumo não é oficial nem endossado pela Khan Academy.",
        "conferidoEm": "2026-11-17"
      },
      {
        "tipo": "obmep",
        "rotulo": "Portal da OBMEP: módulo Função Afim (videoaulas e exercícios)",
        "url": "https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=35",
        "aviso": "Abre o Portal da OBMEP (IMPA) em outra aba. O Prumo só aponta o link; o conteúdo do portal não é copiado.",
        "conferidoEm": "2026-11-17"
      }
    ],
    "cards": [
      {
        "id": "mat-fa.c4.k1",
        "tipo": "conceito",
        "frente": "O que é um sistema de equações?",
        "verso": "Duas ou mais condições sobre as mesmas letras, cada uma escrita como equação.",
        "bloco": "mat-fa.p7.b1",
        "paragrafo": "mat-fa.p7.b1.s1",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k2",
        "tipo": "procedimento",
        "frente": "Qual é o primeiro passo para montar um sistema a partir do texto?",
        "verso": "Dar uma letra a cada valor desconhecido e dizer o que ela é, com a unidade.",
        "bloco": "mat-fa.p7.b1",
        "paragrafo": "mat-fa.p7.b1.s1",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k3",
        "tipo": "palavra-pista",
        "frente": "Como se escreve “R$ 2 a mais que o dobro de s”?",
        "verso": "2s + 2. O dobro multiplica s por 2; o “a mais” soma depois.",
        "bloco": "mat-fa.p7.b1",
        "paragrafo": "mat-fa.p7.b1.s2",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k4",
        "tipo": "armadilha",
        "frente": "Quanto são 5 centavos em reais?",
        "verso": "R$ 0,05. Já 50 centavos são R$ 0,50: a casa do 5 muda a resposta.",
        "bloco": "mat-fa.p7.b1",
        "paragrafo": "mat-fa.p7.b1.s3",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k5",
        "tipo": "procedimento",
        "frente": "Como resolver um sistema por substituição?",
        "verso": "Isole uma letra numa equação, leve para a outra, resolva e volte para achar a segunda letra.",
        "bloco": "mat-fa.p7.b2",
        "paragrafo": "mat-fa.p7.b2.s4",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k6",
        "tipo": "conceito",
        "frente": "Duas situações com o mesmo total: o que a diferença entre elas mostra?",
        "verso": "Uma troca que equilibra: o que entrou vale o mesmo que o que saiu.",
        "bloco": "mat-fa.p8.b1",
        "paragrafo": "mat-fa.p8.b1.s2",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k7",
        "tipo": "procedimento",
        "frente": "Como chegar a uma terceira situação sem achar cada preço?",
        "verso": "Parta de uma das situações e aplique a troca quantas vezes for preciso, nem uma a mais, nem uma a menos.",
        "bloco": "mat-fa.p8.b1",
        "paragrafo": "mat-fa.p8.b1.s3",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      },
      {
        "id": "mat-fa.c4.k8",
        "tipo": "armadilha",
        "frente": "Achou um número. O que conferir antes de marcar?",
        "verso": "Se ele responde o que foi pedido, se você descontou o que já ocupa parte do total e se ele satisfaz as duas condições.",
        "bloco": "mat-fa.p8.b2",
        "paragrafo": "mat-fa.p8.b2.s4",
        "autoria": {
          "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
          "modelo": "Claude Opus 5.5",
          "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
          "data": "2026-11-17",
          "equipe": null,
          "revisor": null,
          "revisadoEm": null
        }
      }
    ]
  }
];

export const modelos34 = [
  {
    "id": "mat-fa.p5.m",
    "tipo": "pagina",
    "pagina": "mat-fa.p5",
    "capitulo": "mat-fa.c3",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "Na ciclovia do bairro, {A} pedalou {qa} km em {taT}, e {B} pedalou {qb} km em {tbT}. Quantos quilômetros por {un} fez quem foi mais rápido?",
    "certa": "qb/tb",
    "erros": [
      {
        "expr": "qa/ta",
        "falta": "Escolheu quem andou mais km. {A} andou mais, porém em mais tempo: {qa} ÷ {ta} dá menos km por {un} que {qb} ÷ {tb}.",
        "paragrafo": "mat-fa.p5.b1.s3"
      },
      {
        "expr": "tb/qb",
        "falta": "Inverteu a divisão: {tb} ÷ {qb} dá {uns} por km. Km por {un} é km ÷ {uns}.",
        "paragrafo": "mat-fa.p5.b1.s2"
      },
      {
        "expr": "qb",
        "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
        "paragrafo": "mat-fa.p5.b1.s1"
      },
      {
        "expr": "(qa + qb)/(ta + tb)",
        "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
        "paragrafo": "mat-fa.p5.b1.s3"
      }
    ],
    "explicacao": "Divida cada total pelo próprio tempo. {A}: {qa} ÷ {ta} = {ra}. {B}: {qb} ÷ {tb} = {rb}. A maior taxa é {rb} km por {un}, de {B}, que andou menos km.",
    "papeisDasLinhas": "linha 0 = pré-pergunta do núcleo; 1 = checagem; 2 a 7 = variantes (revisões, R5, inserções do Pilar III, Prova, Questão do dia), em ordem; 8 a 10 = \"Refazer com outros números\"",
    "linhas": [
      {
        "A": "Lívia",
        "B": "Pedro",
        "unidade": "min",
        "qa": 12,
        "ta": 40,
        "qb": 5,
        "tb": 10,
        "taT": "40 minutos",
        "tbT": "10 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.3,
        "rb": 0.5,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Lívia pedalou 12 km em 40 minutos, e Pedro pedalou 5 km em 10 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,3",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Lívia andou mais, porém em mais tempo: 12 ÷ 40 dá menos km por minuto que 5 ÷ 10.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,34",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,5",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "2",
              "erro": 1,
              "falta": "Inverteu a divisão: 10 ÷ 5 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "5",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Lívia: 12 ÷ 40 = 0,3. Pedro: 5 ÷ 10 = 0,5. A maior taxa é 0,5 km por minuto, de Pedro, que andou menos km."
        }
      },
      {
        "A": "Bruna",
        "B": "Enzo",
        "unidade": "h",
        "qa": 24,
        "ta": 3,
        "qb": 20,
        "tb": 2,
        "taT": "3 horas",
        "tbT": "2 horas",
        "un": "hora",
        "uns": "horas",
        "ra": 8,
        "rb": 10,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Bruna pedalou 24 km em 3 horas, e Enzo pedalou 20 km em 2 horas. Quantos quilômetros por hora fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,1",
              "erro": 1,
              "falta": "Inverteu a divisão: 2 ÷ 20 dá horas por km. Km por hora é km ÷ horas.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "B",
              "texto": "8",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Bruna andou mais, porém em mais tempo: 24 ÷ 3 dá menos km por hora que 20 ÷ 2.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "8,8",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "D",
              "texto": "10",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "20",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "D",
          "explicacao": "Divida cada total pelo próprio tempo. Bruna: 24 ÷ 3 = 8. Enzo: 20 ÷ 2 = 10. A maior taxa é 10 km por hora, de Enzo, que andou menos km."
        }
      },
      {
        "A": "Júlia",
        "B": "Beto",
        "unidade": "min",
        "qa": 14,
        "ta": 40,
        "qb": 10,
        "tb": 20,
        "taT": "40 minutos",
        "tbT": "20 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.35,
        "rb": 0.5,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Júlia pedalou 14 km em 40 minutos, e Beto pedalou 10 km em 20 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,35",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Júlia andou mais, porém em mais tempo: 14 ÷ 40 dá menos km por minuto que 10 ÷ 20.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,4",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,5",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "2",
              "erro": 1,
              "falta": "Inverteu a divisão: 20 ÷ 10 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "10",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Júlia: 14 ÷ 40 = 0,35. Beto: 10 ÷ 20 = 0,5. A maior taxa é 0,5 km por minuto, de Beto, que andou menos km."
        }
      },
      {
        "A": "Marta",
        "B": "Davi",
        "unidade": "h",
        "qa": 18,
        "ta": 1.5,
        "qb": 10,
        "tb": 0.5,
        "taT": "1,5 hora",
        "tbT": "0,5 hora",
        "un": "hora",
        "uns": "horas",
        "ra": 12,
        "rb": 20,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Marta pedalou 18 km em 1,5 hora, e Davi pedalou 10 km em 0,5 hora. Quantos quilômetros por hora fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,05",
              "erro": 1,
              "falta": "Inverteu a divisão: 0,5 ÷ 10 dá horas por km. Km por hora é km ÷ horas.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "B",
              "texto": "10",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            },
            {
              "letra": "C",
              "texto": "12",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Marta andou mais, porém em mais tempo: 18 ÷ 1,5 dá menos km por hora que 10 ÷ 0,5.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "D",
              "texto": "14",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "E",
              "texto": "20",
              "certa": true
            }
          ],
          "gabarito": "E",
          "explicacao": "Divida cada total pelo próprio tempo. Marta: 18 ÷ 1,5 = 12. Davi: 10 ÷ 0,5 = 20. A maior taxa é 20 km por hora, de Davi, que andou menos km."
        }
      },
      {
        "A": "Sofia",
        "B": "Igor",
        "unidade": "min",
        "qa": 18,
        "ta": 45,
        "qb": 15,
        "tb": 30,
        "taT": "45 minutos",
        "tbT": "30 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.4,
        "rb": 0.5,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Sofia pedalou 18 km em 45 minutos, e Igor pedalou 15 km em 30 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,4",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Sofia andou mais, porém em mais tempo: 18 ÷ 45 dá menos km por minuto que 15 ÷ 30.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,44",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,5",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "2",
              "erro": 1,
              "falta": "Inverteu a divisão: 30 ÷ 15 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "15",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Sofia: 18 ÷ 45 = 0,4. Igor: 15 ÷ 30 = 0,5. A maior taxa é 0,5 km por minuto, de Igor, que andou menos km."
        }
      },
      {
        "A": "Clara",
        "B": "Luan",
        "unidade": "h",
        "qa": 33,
        "ta": 3,
        "qb": 25,
        "tb": 2,
        "taT": "3 horas",
        "tbT": "2 horas",
        "un": "hora",
        "uns": "horas",
        "ra": 11,
        "rb": 12.5,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Clara pedalou 33 km em 3 horas, e Luan pedalou 25 km em 2 horas. Quantos quilômetros por hora fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,08",
              "erro": 1,
              "falta": "Inverteu a divisão: 2 ÷ 25 dá horas por km. Km por hora é km ÷ horas.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "B",
              "texto": "11",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Clara andou mais, porém em mais tempo: 33 ÷ 3 dá menos km por hora que 25 ÷ 2.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "11,6",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "D",
              "texto": "12,5",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "25",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "D",
          "explicacao": "Divida cada total pelo próprio tempo. Clara: 33 ÷ 3 = 11. Luan: 25 ÷ 2 = 12,5. A maior taxa é 12,5 km por hora, de Luan, que andou menos km."
        }
      },
      {
        "A": "Rita",
        "B": "João",
        "unidade": "min",
        "qa": 13,
        "ta": 50,
        "qb": 8,
        "tb": 20,
        "taT": "50 minutos",
        "tbT": "20 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.26,
        "rb": 0.4,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Rita pedalou 13 km em 50 minutos, e João pedalou 8 km em 20 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,26",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Rita andou mais, porém em mais tempo: 13 ÷ 50 dá menos km por minuto que 8 ÷ 20.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,3",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,4",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "2,5",
              "erro": 1,
              "falta": "Inverteu a divisão: 20 ÷ 8 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "8",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Rita: 13 ÷ 50 = 0,26. João: 8 ÷ 20 = 0,4. A maior taxa é 0,4 km por minuto, de João, que andou menos km."
        }
      },
      {
        "A": "Ana",
        "B": "Téo",
        "unidade": "h",
        "qa": 22,
        "ta": 2,
        "qb": 10,
        "tb": 0.5,
        "taT": "2 horas",
        "tbT": "0,5 hora",
        "un": "hora",
        "uns": "horas",
        "ra": 11,
        "rb": 20,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Ana pedalou 22 km em 2 horas, e Téo pedalou 10 km em 0,5 hora. Quantos quilômetros por hora fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,05",
              "erro": 1,
              "falta": "Inverteu a divisão: 0,5 ÷ 10 dá horas por km. Km por hora é km ÷ horas.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "B",
              "texto": "10",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            },
            {
              "letra": "C",
              "texto": "11",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Ana andou mais, porém em mais tempo: 22 ÷ 2 dá menos km por hora que 10 ÷ 0,5.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "D",
              "texto": "12,8",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "E",
              "texto": "20",
              "certa": true
            }
          ],
          "gabarito": "E",
          "explicacao": "Divida cada total pelo próprio tempo. Ana: 22 ÷ 2 = 11. Téo: 10 ÷ 0,5 = 20. A maior taxa é 20 km por hora, de Téo, que andou menos km."
        }
      },
      {
        "A": "Elisa",
        "B": "Rafael",
        "unidade": "min",
        "qa": 16,
        "ta": 50,
        "qb": 12,
        "tb": 30,
        "taT": "50 minutos",
        "tbT": "30 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.32,
        "rb": 0.4,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Elisa pedalou 16 km em 50 minutos, e Rafael pedalou 12 km em 30 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,32",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Elisa andou mais, porém em mais tempo: 16 ÷ 50 dá menos km por minuto que 12 ÷ 30.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,35",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,4",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "2,5",
              "erro": 1,
              "falta": "Inverteu a divisão: 30 ÷ 12 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "12",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Elisa: 16 ÷ 50 = 0,32. Rafael: 12 ÷ 30 = 0,4. A maior taxa é 0,4 km por minuto, de Rafael, que andou menos km."
        }
      },
      {
        "A": "Nara",
        "B": "Gui",
        "unidade": "h",
        "qa": 36,
        "ta": 2.5,
        "qb": 30,
        "tb": 1.5,
        "taT": "2,5 horas",
        "tbT": "1,5 hora",
        "un": "hora",
        "uns": "horas",
        "ra": 14.4,
        "rb": 20,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Nara pedalou 36 km em 2,5 horas, e Gui pedalou 30 km em 1,5 hora. Quantos quilômetros por hora fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,05",
              "erro": 1,
              "falta": "Inverteu a divisão: 1,5 ÷ 30 dá horas por km. Km por hora é km ÷ horas.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "B",
              "texto": "14,4",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Nara andou mais, porém em mais tempo: 36 ÷ 2,5 dá menos km por hora que 30 ÷ 1,5.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "16,5",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "D",
              "texto": "20",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "30",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "D",
          "explicacao": "Divida cada total pelo próprio tempo. Nara: 36 ÷ 2,5 = 14,4. Gui: 30 ÷ 1,5 = 20. A maior taxa é 20 km por hora, de Gui, que andou menos km."
        }
      },
      {
        "A": "Lara",
        "B": "Otávio",
        "unidade": "min",
        "qa": 12,
        "ta": 60,
        "qb": 10,
        "tb": 40,
        "taT": "60 minutos",
        "tbT": "40 minutos",
        "un": "minuto",
        "uns": "minutos",
        "ra": 0.2,
        "rb": 0.25,
        "pronto": {
          "enunciado": "Na ciclovia do bairro, Lara pedalou 12 km em 60 minutos, e Otávio pedalou 10 km em 40 minutos. Quantos quilômetros por minuto fez quem foi mais rápido?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "0,2",
              "erro": 0,
              "falta": "Escolheu quem andou mais km. Lara andou mais, porém em mais tempo: 12 ÷ 60 dá menos km por minuto que 10 ÷ 40.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "B",
              "texto": "0,22",
              "erro": 3,
              "falta": "Juntou os dois numa conta só. Para comparar, cada um divide o próprio total pelo próprio tempo.",
              "paragrafo": "mat-fa.p5.b1.s3"
            },
            {
              "letra": "C",
              "texto": "0,25",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "4",
              "erro": 1,
              "falta": "Inverteu a divisão: 40 ÷ 10 dá minutos por km. Km por minuto é km ÷ minutos.",
              "paragrafo": "mat-fa.p5.b1.s2"
            },
            {
              "letra": "E",
              "texto": "10",
              "erro": 2,
              "falta": "Respondeu o total de km, sem dividir pelo tempo. Taxa é o quanto mudou dividido pelo intervalo.",
              "paragrafo": "mat-fa.p5.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "Divida cada total pelo próprio tempo. Lara: 12 ÷ 60 = 0,2. Otávio: 10 ÷ 40 = 0,25. A maior taxa é 0,25 km por minuto, de Otávio, que andou menos km."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.p6.m",
    "tipo": "pagina",
    "pagina": "mat-fa.p6",
    "capitulo": "mat-fa.c3",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "O aplicativo de corrida de {nome} mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>{d1}</td></tr><tr><td>2</td><td>{d2}</td></tr><tr><td>3</td><td>{d3}</td></tr><tr><td>4</td><td>{d4}</td></tr><tr><td>5</td><td>{d5}</td></tr></tbody></table>Quantos metros {nome} correu no {k}º minuto?",
    "certa": "dk - dk1",
    "erros": [
      {
        "expr": "dk",
        "falta": "Leu o total acumulado em t = {k}. O que aconteceu no {k}º minuto é a subida: {dk} − {dk1}.",
        "paragrafo": "mat-fa.p6.b1.s1"
      },
      {
        "expr": "dk/k",
        "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos {k} minutos, não o {k}º minuto.",
        "paragrafo": "mat-fa.p6.b1.s2"
      },
      {
        "expr": "dk1 - dk2",
        "falta": "Pegou o minuto anterior. O {k}º minuto vai de t = {km1} a t = {k}.",
        "paragrafo": "mat-fa.p6.b1.s2"
      },
      {
        "expr": "dk - dk2",
        "falta": "Pegou um trecho de 2 minutos, de t = {km2} a t = {k}. O {k}º minuto dura 1 minuto só.",
        "paragrafo": "mat-fa.p6.b1.s2"
      }
    ],
    "explicacao": "O {k}º minuto vai de t = {km1} a t = {k}. A subida desse trecho é {dk} − {dk1} = {sub} metros.",
    "papeisDasLinhas": "linha 0 = pré-pergunta do núcleo; 1 = checagem; 2 a 7 = variantes (revisões, R5, inserções do Pilar III, Prova, Questão do dia), em ordem; 8 a 10 = \"Refazer com outros números\"",
    "linhas": [
      {
        "nome": "Lia",
        "d1": 180,
        "d2": 360,
        "d3": 540,
        "d4": 700,
        "d5": 880,
        "k": 4,
        "km1": 3,
        "km2": 2,
        "dk": 700,
        "dk1": 540,
        "dk2": 360,
        "sub": 160,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Lia mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>180</td></tr><tr><td>2</td><td>360</td></tr><tr><td>3</td><td>540</td></tr><tr><td>4</td><td>700</td></tr><tr><td>5</td><td>880</td></tr></tbody></table>Quantos metros Lia correu no 4º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "160",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "175",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 4 minutos, não o 4º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "180",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 4º minuto vai de t = 3 a t = 4.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "340",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 2 a t = 4. O 4º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "700",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 4. O que aconteceu no 4º minuto é a subida: 700 − 540.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "A",
          "explicacao": "O 4º minuto vai de t = 3 a t = 4. A subida desse trecho é 700 − 540 = 160 metros."
        }
      },
      {
        "nome": "Rafa",
        "d1": 150,
        "d2": 300,
        "d3": 450,
        "d4": 630,
        "d5": 800,
        "k": 5,
        "km1": 4,
        "km2": 3,
        "dk": 800,
        "dk1": 630,
        "dk2": 450,
        "sub": 170,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Rafa mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>150</td></tr><tr><td>2</td><td>300</td></tr><tr><td>3</td><td>450</td></tr><tr><td>4</td><td>630</td></tr><tr><td>5</td><td>800</td></tr></tbody></table>Quantos metros Rafa correu no 5º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "160",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 5 minutos, não o 5º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "170",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "180",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 5º minuto vai de t = 4 a t = 5.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "350",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 3 a t = 5. O 5º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "800",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 5. O que aconteceu no 5º minuto é a subida: 800 − 630.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "O 5º minuto vai de t = 4 a t = 5. A subida desse trecho é 800 − 630 = 170 metros."
        }
      },
      {
        "nome": "Duda",
        "d1": 200,
        "d2": 400,
        "d3": 570,
        "d4": 760,
        "d5": 940,
        "k": 3,
        "km1": 2,
        "km2": 1,
        "dk": 570,
        "dk1": 400,
        "dk2": 200,
        "sub": 170,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Duda mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>200</td></tr><tr><td>2</td><td>400</td></tr><tr><td>3</td><td>570</td></tr><tr><td>4</td><td>760</td></tr><tr><td>5</td><td>940</td></tr></tbody></table>Quantos metros Duda correu no 3º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "170",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "190",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 3 minutos, não o 3º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "200",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 3º minuto vai de t = 2 a t = 3.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "370",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 1 a t = 3. O 3º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "570",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 3. O que aconteceu no 3º minuto é a subida: 570 − 400.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "A",
          "explicacao": "O 3º minuto vai de t = 2 a t = 3. A subida desse trecho é 570 − 400 = 170 metros."
        }
      },
      {
        "nome": "Téo",
        "d1": 160,
        "d2": 330,
        "d3": 330,
        "d4": 500,
        "d5": 680,
        "k": 5,
        "km1": 4,
        "km2": 3,
        "dk": 680,
        "dk1": 500,
        "dk2": 330,
        "sub": 180,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Téo mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>160</td></tr><tr><td>2</td><td>330</td></tr><tr><td>3</td><td>330</td></tr><tr><td>4</td><td>500</td></tr><tr><td>5</td><td>680</td></tr></tbody></table>Quantos metros Téo correu no 5º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "136",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 5 minutos, não o 5º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "170",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 5º minuto vai de t = 4 a t = 5.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "180",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "350",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 3 a t = 5. O 5º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "680",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 5. O que aconteceu no 5º minuto é a subida: 680 − 500.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "O 5º minuto vai de t = 4 a t = 5. A subida desse trecho é 680 − 500 = 180 metros."
        }
      },
      {
        "nome": "Nina",
        "d1": 200,
        "d2": 390,
        "d3": 550,
        "d4": 720,
        "d5": 900,
        "k": 4,
        "km1": 3,
        "km2": 2,
        "dk": 720,
        "dk1": 550,
        "dk2": 390,
        "sub": 170,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Nina mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>200</td></tr><tr><td>2</td><td>390</td></tr><tr><td>3</td><td>550</td></tr><tr><td>4</td><td>720</td></tr><tr><td>5</td><td>900</td></tr></tbody></table>Quantos metros Nina correu no 4º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "160",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 4º minuto vai de t = 3 a t = 4.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "170",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "180",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 4 minutos, não o 4º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "330",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 2 a t = 4. O 4º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "720",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 4. O que aconteceu no 4º minuto é a subida: 720 − 550.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "O 4º minuto vai de t = 3 a t = 4. A subida desse trecho é 720 − 550 = 170 metros."
        }
      },
      {
        "nome": "Gabi",
        "d1": 170,
        "d2": 340,
        "d3": 500,
        "d4": 680,
        "d5": 850,
        "k": 4,
        "km1": 3,
        "km2": 2,
        "dk": 680,
        "dk1": 500,
        "dk2": 340,
        "sub": 180,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Gabi mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>170</td></tr><tr><td>2</td><td>340</td></tr><tr><td>3</td><td>500</td></tr><tr><td>4</td><td>680</td></tr><tr><td>5</td><td>850</td></tr></tbody></table>Quantos metros Gabi correu no 4º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "160",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 4º minuto vai de t = 3 a t = 4.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "170",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 4 minutos, não o 4º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "180",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "340",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 2 a t = 4. O 4º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "680",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 4. O que aconteceu no 4º minuto é a subida: 680 − 500.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "O 4º minuto vai de t = 3 a t = 4. A subida desse trecho é 680 − 500 = 180 metros."
        }
      },
      {
        "nome": "Leo",
        "d1": 210,
        "d2": 400,
        "d3": 600,
        "d4": 790,
        "d5": 960,
        "k": 5,
        "km1": 4,
        "km2": 3,
        "dk": 960,
        "dk1": 790,
        "dk2": 600,
        "sub": 170,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Leo mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>210</td></tr><tr><td>2</td><td>400</td></tr><tr><td>3</td><td>600</td></tr><tr><td>4</td><td>790</td></tr><tr><td>5</td><td>960</td></tr></tbody></table>Quantos metros Leo correu no 5º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "170",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "190",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 5º minuto vai de t = 4 a t = 5.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "192",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 5 minutos, não o 5º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "360",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 3 a t = 5. O 5º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "960",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 5. O que aconteceu no 5º minuto é a subida: 960 − 790.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "A",
          "explicacao": "O 5º minuto vai de t = 4 a t = 5. A subida desse trecho é 960 − 790 = 170 metros."
        }
      },
      {
        "nome": "Bia",
        "d1": 150,
        "d2": 310,
        "d3": 500,
        "d4": 680,
        "d5": 860,
        "k": 4,
        "km1": 3,
        "km2": 2,
        "dk": 680,
        "dk1": 500,
        "dk2": 310,
        "sub": 180,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Bia mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>150</td></tr><tr><td>2</td><td>310</td></tr><tr><td>3</td><td>500</td></tr><tr><td>4</td><td>680</td></tr><tr><td>5</td><td>860</td></tr></tbody></table>Quantos metros Bia correu no 4º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "170",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 4 minutos, não o 4º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "180",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "190",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 4º minuto vai de t = 3 a t = 4.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "D",
              "texto": "370",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 2 a t = 4. O 4º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "680",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 4. O que aconteceu no 4º minuto é a subida: 680 − 500.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "O 4º minuto vai de t = 3 a t = 4. A subida desse trecho é 680 − 500 = 180 metros."
        }
      },
      {
        "nome": "Caio",
        "d1": 180,
        "d2": 350,
        "d3": 540,
        "d4": 720,
        "d5": 900,
        "k": 3,
        "km1": 2,
        "km2": 1,
        "dk": 540,
        "dk1": 350,
        "dk2": 180,
        "sub": 190,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Caio mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>180</td></tr><tr><td>2</td><td>350</td></tr><tr><td>3</td><td>540</td></tr><tr><td>4</td><td>720</td></tr><tr><td>5</td><td>900</td></tr></tbody></table>Quantos metros Caio correu no 3º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "170",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 3º minuto vai de t = 2 a t = 3.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "180",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 3 minutos, não o 3º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "190",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "360",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 1 a t = 3. O 3º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "540",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 3. O que aconteceu no 3º minuto é a subida: 540 − 350.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "O 3º minuto vai de t = 2 a t = 3. A subida desse trecho é 540 − 350 = 190 metros."
        }
      },
      {
        "nome": "Iara",
        "d1": 150,
        "d2": 300,
        "d3": 480,
        "d4": 640,
        "d5": 810,
        "k": 5,
        "km1": 4,
        "km2": 3,
        "dk": 810,
        "dk1": 640,
        "dk2": 480,
        "sub": 170,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Iara mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>150</td></tr><tr><td>2</td><td>300</td></tr><tr><td>3</td><td>480</td></tr><tr><td>4</td><td>640</td></tr><tr><td>5</td><td>810</td></tr></tbody></table>Quantos metros Iara correu no 5º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "160",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 5º minuto vai de t = 4 a t = 5.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "162",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 5 minutos, não o 5º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "170",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "330",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 3 a t = 5. O 5º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "810",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 5. O que aconteceu no 5º minuto é a subida: 810 − 640.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "O 5º minuto vai de t = 4 a t = 5. A subida desse trecho é 810 − 640 = 170 metros."
        }
      },
      {
        "nome": "Davi",
        "d1": 200,
        "d2": 380,
        "d3": 570,
        "d4": 750,
        "d5": 950,
        "k": 5,
        "km1": 4,
        "km2": 3,
        "dk": 950,
        "dk1": 750,
        "dk2": 570,
        "sub": 200,
        "pronto": {
          "enunciado": "O aplicativo de corrida de Davi mostra a distância total, em metros, desde a largada:<table class=\"tabela-equipe\"><caption>Distância total desde a largada</caption><thead><tr><th scope=\"col\">t (min)</th><th scope=\"col\">Distância (m)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>1</td><td>200</td></tr><tr><td>2</td><td>380</td></tr><tr><td>3</td><td>570</td></tr><tr><td>4</td><td>750</td></tr><tr><td>5</td><td>950</td></tr></tbody></table>Quantos metros Davi correu no 5º minuto?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "180",
              "erro": 2,
              "falta": "Pegou o minuto anterior. O 5º minuto vai de t = 4 a t = 5.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "B",
              "texto": "190",
              "erro": 1,
              "falta": "Dividiu o total pelo tempo desde a largada. Isso é a média dos 5 minutos, não o 5º minuto.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "C",
              "texto": "200",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "380",
              "erro": 3,
              "falta": "Pegou um trecho de 2 minutos, de t = 3 a t = 5. O 5º minuto dura 1 minuto só.",
              "paragrafo": "mat-fa.p6.b1.s2"
            },
            {
              "letra": "E",
              "texto": "950",
              "erro": 0,
              "falta": "Leu o total acumulado em t = 5. O que aconteceu no 5º minuto é a subida: 950 − 750.",
              "paragrafo": "mat-fa.p6.b1.s1"
            }
          ],
          "gabarito": "C",
          "explicacao": "O 5º minuto vai de t = 4 a t = 5. A subida desse trecho é 950 − 750 = 200 metros."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.p6.b2.m",
    "tipo": "bloco",
    "pagina": "mat-fa.p6",
    "bloco": "mat-fa.p6.b2",
    "capitulo": "mat-fa.c3",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "Numa feira, a barraca de pastel de {nome} anota a receita e o custo acumulados desde a abertura, em reais:<table class=\"tabela-equipe\"><caption>Receita e custo acumulados desde a abertura</caption><thead><tr><th scope=\"col\">Hora</th><th scope=\"col\">Receita (R$)</th><th scope=\"col\">Custo (R$)</th></tr></thead><tbody><tr><td>7 h</td><td>{r7}</td><td>{c7}</td></tr><tr><td>8 h</td><td>{r8}</td><td>{c8}</td></tr><tr><td>9 h</td><td>{r9}</td><td>{c9}</td></tr><tr><td>10 h</td><td>{r10}</td><td>{c10}</td></tr><tr><td>11 h</td><td>{r11}</td><td>{c11}</td></tr></tbody></table>Qual era o lucro da barraca, em reais, às {h} h?",
    "certa": "R - C",
    "erros": [
      {
        "expr": "C - R",
        "falta": "{faltaInvertida}",
        "paragrafo": "mat-fa.p6.b2.s4"
      },
      {
        "expr": "R",
        "falta": "Respondeu a receita. O lucro é a receita menos o custo.",
        "paragrafo": "mat-fa.p6.b2.s3"
      },
      {
        "expr": "C",
        "falta": "Respondeu o custo. O lucro é a receita menos o custo.",
        "paragrafo": "mat-fa.p6.b2.s3"
      },
      {
        "expr": "R + C",
        "falta": "Somou receita e custo. Lucro é a diferença: receita − custo.",
        "paragrafo": "mat-fa.p6.b2.s3"
      }
    ],
    "explicacao": "Lucro = receita − custo. Às {h} h: {R} − {C} = {L}. {sinalTexto}",
    "papeisDasLinhas": "linha 0 = pré-pergunta do bloco; 1 = variante de compreender (inserção do Pilar III)",
    "linhas": [
      {
        "nome": "dona Lúcia",
        "r7": 20,
        "r8": 60,
        "r9": 150,
        "r10": 250,
        "r11": 330,
        "c7": 120,
        "c8": 140,
        "c9": 160,
        "c10": 180,
        "c11": 200,
        "h": 8,
        "R": 60,
        "C": 140,
        "L": -80,
        "sinalTexto": "O custo estava acima da receita: houve prejuízo.",
        "faltaInvertida": "Tirou o sinal (ou fez custo − receita). O custo estava acima da receita: o lucro é negativo, é prejuízo.",
        "pronto": {
          "enunciado": "Numa feira, a barraca de pastel de dona Lúcia anota a receita e o custo acumulados desde a abertura, em reais:<table class=\"tabela-equipe\"><caption>Receita e custo acumulados desde a abertura</caption><thead><tr><th scope=\"col\">Hora</th><th scope=\"col\">Receita (R$)</th><th scope=\"col\">Custo (R$)</th></tr></thead><tbody><tr><td>7 h</td><td>20</td><td>120</td></tr><tr><td>8 h</td><td>60</td><td>140</td></tr><tr><td>9 h</td><td>150</td><td>160</td></tr><tr><td>10 h</td><td>250</td><td>180</td></tr><tr><td>11 h</td><td>330</td><td>200</td></tr></tbody></table>Qual era o lucro da barraca, em reais, às 8 h?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "−80",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "60",
              "erro": 1,
              "falta": "Respondeu a receita. O lucro é a receita menos o custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            },
            {
              "letra": "C",
              "texto": "80",
              "erro": 0,
              "falta": "Tirou o sinal (ou fez custo − receita). O custo estava acima da receita: o lucro é negativo, é prejuízo.",
              "paragrafo": "mat-fa.p6.b2.s4"
            },
            {
              "letra": "D",
              "texto": "140",
              "erro": 2,
              "falta": "Respondeu o custo. O lucro é a receita menos o custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            },
            {
              "letra": "E",
              "texto": "200",
              "erro": 3,
              "falta": "Somou receita e custo. Lucro é a diferença: receita − custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            }
          ],
          "gabarito": "A",
          "explicacao": "Lucro = receita − custo. Às 8 h: 60 − 140 = −80. O custo estava acima da receita: houve prejuízo."
        }
      },
      {
        "nome": "seu Jorge",
        "r7": 30,
        "r8": 90,
        "r9": 160,
        "r10": 260,
        "r11": 350,
        "c7": 140,
        "c8": 160,
        "c9": 180,
        "c10": 200,
        "c11": 220,
        "h": 10,
        "R": 260,
        "C": 200,
        "L": 60,
        "sinalTexto": "A receita estava acima do custo: houve lucro.",
        "faltaInvertida": "Fez custo − receita, na ordem trocada. Lucro é receita − custo; aqui a receita estava acima, e o lucro é positivo.",
        "pronto": {
          "enunciado": "Numa feira, a barraca de pastel de seu Jorge anota a receita e o custo acumulados desde a abertura, em reais:<table class=\"tabela-equipe\"><caption>Receita e custo acumulados desde a abertura</caption><thead><tr><th scope=\"col\">Hora</th><th scope=\"col\">Receita (R$)</th><th scope=\"col\">Custo (R$)</th></tr></thead><tbody><tr><td>7 h</td><td>30</td><td>140</td></tr><tr><td>8 h</td><td>90</td><td>160</td></tr><tr><td>9 h</td><td>160</td><td>180</td></tr><tr><td>10 h</td><td>260</td><td>200</td></tr><tr><td>11 h</td><td>350</td><td>220</td></tr></tbody></table>Qual era o lucro da barraca, em reais, às 10 h?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "−60",
              "erro": 0,
              "falta": "Fez custo − receita, na ordem trocada. Lucro é receita − custo; aqui a receita estava acima, e o lucro é positivo.",
              "paragrafo": "mat-fa.p6.b2.s4"
            },
            {
              "letra": "B",
              "texto": "60",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "200",
              "erro": 2,
              "falta": "Respondeu o custo. O lucro é a receita menos o custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            },
            {
              "letra": "D",
              "texto": "260",
              "erro": 1,
              "falta": "Respondeu a receita. O lucro é a receita menos o custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            },
            {
              "letra": "E",
              "texto": "460",
              "erro": 3,
              "falta": "Somou receita e custo. Lucro é a diferença: receita − custo.",
              "paragrafo": "mat-fa.p6.b2.s3"
            }
          ],
          "gabarito": "B",
          "explicacao": "Lucro = receita − custo. Às 10 h: 260 − 200 = 60. A receita estava acima do custo: houve lucro."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.p7.m",
    "tipo": "pagina",
    "pagina": "mat-fa.p7",
    "capitulo": "mat-fa.c4",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "Na cantina da escola, {fraseRelacao} Juntos, {n1t} e {n2t} custam R$ {Tt}. Quanto custa {umPedido}, em reais?",
    "certa": "q*(2*s + d) + (1 - q)*s",
    "erros": [
      {
        "expr": "q*((T - n1*d)/(n1 + n2) + d) + (1 - q)*(T - n1*d)/(n1 + n2)",
        "falta": "{faltaDobro}",
        "paragrafo": "mat-fa.p7.b1.s2"
      },
      {
        "expr": "q*(2*(T - (n1 + n2)*d)/(2*n1 + n2) + d) + (1 - q)*(T - (n1 + n2)*d)/(2*n1 + n2)",
        "falta": "Multiplicou o acréscimo de {dReais} pelos {nItens} itens. Só os {n1} salgados têm esse acréscimo: {n1} × {dReais}.",
        "paragrafo": "mat-fa.p7.b1.s3"
      },
      {
        "expr": "q*s + (1 - q)*(2*s + d)",
        "falta": "Achou o preço {doOutro}. A pergunta é o preço {doPedido}.",
        "paragrafo": "mat-fa.p7.b1.s1"
      },
      {
        "expr": "q*(2*(T - d)/(2 + n2) + d) + (1 - q)*(T - d)/(2 + n2)",
        "falta": "Contou um salgado só. São {n1} salgados: a conta tem {n1} × (2 × suco + {dReais}).",
        "paragrafo": "mat-fa.p7.b1.s3"
      }
    ],
    "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. {traducaoTexto} Então {n1}(2s + {dNum}) + {n2s} = {Tt}, ou seja, {coefS}s + {n1dTexto} = {Tt}. Daí {coefS}s = {restoTexto} e s = {sTexto}.{fimTexto}",
    "papeisDasLinhas": "linha 0 = pré-pergunta do núcleo; 1 = checagem; 2 a 7 = variantes (revisões, R5, inserções do Pilar III, Prova, Questão do dia), em ordem; 8 a 10 = \"Refazer com outros números\"",
    "linhas": [
      {
        "forma": "dif",
        "q": 0,
        "s": 2,
        "dc": 100,
        "n1": 3,
        "n2": 2,
        "d": 1,
        "T": 19,
        "Tt": "19,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,00.",
        "faltaDobro": "Leu como “o salgado custa R$ 1,00 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,00, ou seja, salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g − s = s + 1,00, ou seja, g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "3 salgados",
        "n2t": "2 sucos",
        "nItens": 5,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 8,
        "n1dTexto": "3,00",
        "restoTexto": "16,00",
        "sTexto": "2,00",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,00. Juntos, 3 salgados e 2 sucos custam R$ 19,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "1,75",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 5 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "2",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "3,2",
              "erro": 0,
              "falta": "Leu como “o salgado custa R$ 1,00 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,00, ou seja, salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "4,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "E",
              "texto": "5",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 1,00, ou seja, g = 2s + 1,00. Então 3(2s + 1,00) + 2s = 19,00, ou seja, 8s + 3,00 = 19,00. Daí 8s = 16,00 e s = 2,00."
        }
      },
      {
        "forma": "dif",
        "q": 1,
        "s": 3,
        "dc": 75,
        "n1": 2,
        "n2": 1,
        "d": 0.75,
        "T": 16.5,
        "Tt": "16,50",
        "dReais": "R$ 0,75",
        "dNum": "0,75",
        "dTexto": "75 centavos",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais 75 centavos.",
        "faltaDobro": "Leu como “o salgado custa 75 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,75, ou seja, salgado = 2 × suco + R$ 0,75.",
        "traducaoTexto": "A frase diz g − s = s + 0,75, ou seja, g = 2s + 0,75.",
        "n2s": "s",
        "n1t": "2 salgados",
        "n2t": "1 suco",
        "nItens": 3,
        "umPedido": "um salgado",
        "doPedido": "do salgado",
        "doOutro": "do suco",
        "coefS": 5,
        "n1dTexto": "1,50",
        "restoTexto": "15,00",
        "sTexto": "3,00",
        "fimTexto": " O salgado custa g = 2 × 3,00 + 0,75 = R$ 6,75.",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais 75 centavos. Juntos, 2 salgados e 1 suco custam R$ 16,50. Quanto custa um salgado, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3",
              "erro": 2,
              "falta": "Achou o preço do suco. A pergunta é o preço do salgado.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "B",
              "texto": "5,75",
              "erro": 0,
              "falta": "Leu como “o salgado custa 75 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,75, ou seja, salgado = 2 × suco + R$ 0,75.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "C",
              "texto": "6,45",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 0,75 pelos 3 itens. Só os 2 salgados têm esse acréscimo: 2 × R$ 0,75.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "D",
              "texto": "6,75",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "11,25",
              "erro": 3,
              "falta": "Contou um salgado só. São 2 salgados: a conta tem 2 × (2 × suco + R$ 0,75).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "D",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 0,75, ou seja, g = 2s + 0,75. Então 2(2s + 0,75) + s = 16,50, ou seja, 5s + 1,50 = 16,50. Daí 5s = 15,00 e s = 3,00. O salgado custa g = 2 × 3,00 + 0,75 = R$ 6,75."
        }
      },
      {
        "forma": "dobro",
        "q": 0,
        "s": 2.5,
        "dc": 100,
        "n1": 3,
        "n2": 2,
        "d": 1,
        "T": 23,
        "Tt": "23,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "um salgado custa R$ 1,00 a mais que o dobro do preço de um suco.",
        "faltaDobro": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "3 salgados",
        "n2t": "2 sucos",
        "nItens": 5,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 8,
        "n1dTexto": "3,00",
        "restoTexto": "20,00",
        "sTexto": "2,50",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, um salgado custa R$ 1,00 a mais que o dobro do preço de um suco. Juntos, 3 salgados e 2 sucos custam R$ 23,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2,25",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 5 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "2,5",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "4",
              "erro": 0,
              "falta": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "5,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "E",
              "texto": "6",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g = 2s + 1,00. Então 3(2s + 1,00) + 2s = 23,00, ou seja, 8s + 3,00 = 23,00. Daí 8s = 20,00 e s = 2,50."
        }
      },
      {
        "forma": "dif",
        "q": 1,
        "s": 1.5,
        "dc": 150,
        "n1": 2,
        "n2": 1,
        "d": 1.5,
        "T": 10.5,
        "Tt": "10,50",
        "dReais": "R$ 1,50",
        "dNum": "1,50",
        "dTexto": "R$ 1,50",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,50.",
        "faltaDobro": "Leu como “o salgado custa R$ 1,50 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,50, ou seja, salgado = 2 × suco + R$ 1,50.",
        "traducaoTexto": "A frase diz g − s = s + 1,50, ou seja, g = 2s + 1,50.",
        "n2s": "s",
        "n1t": "2 salgados",
        "n2t": "1 suco",
        "nItens": 3,
        "umPedido": "um salgado",
        "doPedido": "do salgado",
        "doOutro": "do suco",
        "coefS": 5,
        "n1dTexto": "3,00",
        "restoTexto": "7,50",
        "sTexto": "1,50",
        "fimTexto": " O salgado custa g = 2 × 1,50 + 1,50 = R$ 4,50.",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,50. Juntos, 2 salgados e 1 suco custam R$ 10,50. Quanto custa um salgado, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "1,5",
              "erro": 2,
              "falta": "Achou o preço do suco. A pergunta é o preço do salgado.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "B",
              "texto": "3,9",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,50 pelos 3 itens. Só os 2 salgados têm esse acréscimo: 2 × R$ 1,50.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "C",
              "texto": "4",
              "erro": 0,
              "falta": "Leu como “o salgado custa R$ 1,50 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,50, ou seja, salgado = 2 × suco + R$ 1,50.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "4,5",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "7,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 2 salgados: a conta tem 2 × (2 × suco + R$ 1,50).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "D",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 1,50, ou seja, g = 2s + 1,50. Então 2(2s + 1,50) + s = 10,50, ou seja, 5s + 3,00 = 10,50. Daí 5s = 7,50 e s = 1,50. O salgado custa g = 2 × 1,50 + 1,50 = R$ 4,50."
        }
      },
      {
        "forma": "dobro",
        "q": 0,
        "s": 4.5,
        "dc": 75,
        "n1": 2,
        "n2": 1,
        "d": 0.75,
        "T": 24,
        "Tt": "24,00",
        "dReais": "R$ 0,75",
        "dNum": "0,75",
        "dTexto": "75 centavos",
        "fraseRelacao": "um salgado custa 75 centavos a mais que o dobro do preço de um suco.",
        "faltaDobro": "Traduziu só “75 centavos a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 0,75.",
        "traducaoTexto": "A frase diz g = 2s + 0,75.",
        "n2s": "s",
        "n1t": "2 salgados",
        "n2t": "1 suco",
        "nItens": 3,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 5,
        "n1dTexto": "1,50",
        "restoTexto": "22,50",
        "sTexto": "4,50",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, um salgado custa 75 centavos a mais que o dobro do preço de um suco. Juntos, 2 salgados e 1 suco custam R$ 24,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4,35",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 0,75 pelos 3 itens. Só os 2 salgados têm esse acréscimo: 2 × R$ 0,75.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "4,5",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "7,5",
              "erro": 0,
              "falta": "Traduziu só “75 centavos a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 0,75.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "7,75",
              "erro": 3,
              "falta": "Contou um salgado só. São 2 salgados: a conta tem 2 × (2 × suco + R$ 0,75).",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "E",
              "texto": "9,75",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g = 2s + 0,75. Então 2(2s + 0,75) + s = 24,00, ou seja, 5s + 1,50 = 24,00. Daí 5s = 22,50 e s = 4,50."
        }
      },
      {
        "forma": "dif",
        "q": 1,
        "s": 3.5,
        "dc": 50,
        "n1": 3,
        "n2": 4,
        "d": 0.5,
        "T": 36.5,
        "Tt": "36,50",
        "dReais": "R$ 0,50",
        "dNum": "0,50",
        "dTexto": "50 centavos",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais 50 centavos.",
        "faltaDobro": "Leu como “o salgado custa 50 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,50, ou seja, salgado = 2 × suco + R$ 0,50.",
        "traducaoTexto": "A frase diz g − s = s + 0,50, ou seja, g = 2s + 0,50.",
        "n2s": "4s",
        "n1t": "3 salgados",
        "n2t": "4 sucos",
        "nItens": 7,
        "umPedido": "um salgado",
        "doPedido": "do salgado",
        "doOutro": "do suco",
        "coefS": 10,
        "n1dTexto": "1,50",
        "restoTexto": "35,00",
        "sTexto": "3,50",
        "fimTexto": " O salgado custa g = 2 × 3,50 + 0,50 = R$ 7,50.",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais 50 centavos. Juntos, 3 salgados e 4 sucos custam R$ 36,50. Quanto custa um salgado, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3,5",
              "erro": 2,
              "falta": "Achou o preço do suco. A pergunta é o preço do salgado.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "B",
              "texto": "5,5",
              "erro": 0,
              "falta": "Leu como “o salgado custa 50 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,50, ou seja, salgado = 2 × suco + R$ 0,50.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "C",
              "texto": "7,1",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 0,50 pelos 7 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 0,50.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "D",
              "texto": "7,5",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "12,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 0,50).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "D",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 0,50, ou seja, g = 2s + 0,50. Então 3(2s + 0,50) + 4s = 36,50, ou seja, 10s + 1,50 = 36,50. Daí 10s = 35,00 e s = 3,50. O salgado custa g = 2 × 3,50 + 0,50 = R$ 7,50."
        }
      },
      {
        "forma": "dobro",
        "q": 0,
        "s": 3,
        "dc": 100,
        "n1": 4,
        "n2": 2,
        "d": 1,
        "T": 34,
        "Tt": "34,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "um salgado custa R$ 1,00 a mais que o dobro do preço de um suco.",
        "faltaDobro": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "4 salgados",
        "n2t": "2 sucos",
        "nItens": 6,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 10,
        "n1dTexto": "4,00",
        "restoTexto": "30,00",
        "sTexto": "3,00",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, um salgado custa R$ 1,00 a mais que o dobro do preço de um suco. Juntos, 4 salgados e 2 sucos custam R$ 34,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2,8",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 6 itens. Só os 4 salgados têm esse acréscimo: 4 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "3",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "5",
              "erro": 0,
              "falta": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "7",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "E",
              "texto": "8,25",
              "erro": 3,
              "falta": "Contou um salgado só. São 4 salgados: a conta tem 4 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g = 2s + 1,00. Então 4(2s + 1,00) + 2s = 34,00, ou seja, 10s + 4,00 = 34,00. Daí 10s = 30,00 e s = 3,00."
        }
      },
      {
        "forma": "dif",
        "q": 1,
        "s": 2,
        "dc": 50,
        "n1": 3,
        "n2": 2,
        "d": 0.5,
        "T": 17.5,
        "Tt": "17,50",
        "dReais": "R$ 0,50",
        "dNum": "0,50",
        "dTexto": "50 centavos",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais 50 centavos.",
        "faltaDobro": "Leu como “o salgado custa 50 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,50, ou seja, salgado = 2 × suco + R$ 0,50.",
        "traducaoTexto": "A frase diz g − s = s + 0,50, ou seja, g = 2s + 0,50.",
        "n2s": "2s",
        "n1t": "3 salgados",
        "n2t": "2 sucos",
        "nItens": 5,
        "umPedido": "um salgado",
        "doPedido": "do salgado",
        "doOutro": "do suco",
        "coefS": 8,
        "n1dTexto": "1,50",
        "restoTexto": "16,00",
        "sTexto": "2,00",
        "fimTexto": " O salgado custa g = 2 × 2,00 + 0,50 = R$ 4,50.",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais 50 centavos. Juntos, 3 salgados e 2 sucos custam R$ 17,50. Quanto custa um salgado, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2",
              "erro": 2,
              "falta": "Achou o preço do suco. A pergunta é o preço do salgado.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "B",
              "texto": "3,7",
              "erro": 0,
              "falta": "Leu como “o salgado custa 50 centavos a mais que o suco”. A frase diz salgado − suco = suco + R$ 0,50, ou seja, salgado = 2 × suco + R$ 0,50.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "C",
              "texto": "4,25",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 0,50 pelos 5 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 0,50.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "D",
              "texto": "4,5",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "9",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 0,50).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "D",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 0,50, ou seja, g = 2s + 0,50. Então 3(2s + 0,50) + 2s = 17,50, ou seja, 8s + 1,50 = 17,50. Daí 8s = 16,00 e s = 2,00. O salgado custa g = 2 × 2,00 + 0,50 = R$ 4,50."
        }
      },
      {
        "forma": "dobro",
        "q": 0,
        "s": 4,
        "dc": 100,
        "n1": 3,
        "n2": 2,
        "d": 1,
        "T": 35,
        "Tt": "35,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "um salgado custa R$ 1,00 a mais que o dobro do preço de um suco.",
        "faltaDobro": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "3 salgados",
        "n2t": "2 sucos",
        "nItens": 5,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 8,
        "n1dTexto": "3,00",
        "restoTexto": "32,00",
        "sTexto": "4,00",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, um salgado custa R$ 1,00 a mais que o dobro do preço de um suco. Juntos, 3 salgados e 2 sucos custam R$ 35,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3,75",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 5 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "4",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "6,4",
              "erro": 0,
              "falta": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "8,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "E",
              "texto": "9",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g = 2s + 1,00. Então 3(2s + 1,00) + 2s = 35,00, ou seja, 8s + 3,00 = 35,00. Daí 8s = 32,00 e s = 4,00."
        }
      },
      {
        "forma": "dif",
        "q": 1,
        "s": 4.5,
        "dc": 100,
        "n1": 4,
        "n2": 2,
        "d": 1,
        "T": 49,
        "Tt": "49,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,00.",
        "faltaDobro": "Leu como “o salgado custa R$ 1,00 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,00, ou seja, salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g − s = s + 1,00, ou seja, g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "4 salgados",
        "n2t": "2 sucos",
        "nItens": 6,
        "umPedido": "um salgado",
        "doPedido": "do salgado",
        "doOutro": "do suco",
        "coefS": 10,
        "n1dTexto": "4,00",
        "restoTexto": "45,00",
        "sTexto": "4,50",
        "fimTexto": " O salgado custa g = 2 × 4,50 + 1,00 = R$ 10,00.",
        "pronto": {
          "enunciado": "Na cantina da escola, o preço de um salgado menos o de um suco é igual ao preço do suco mais R$ 1,00. Juntos, 4 salgados e 2 sucos custam R$ 49,00. Quanto custa um salgado, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4,5",
              "erro": 2,
              "falta": "Achou o preço do suco. A pergunta é o preço do salgado.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "B",
              "texto": "8,5",
              "erro": 0,
              "falta": "Leu como “o salgado custa R$ 1,00 a mais que o suco”. A frase diz salgado − suco = suco + R$ 1,00, ou seja, salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "C",
              "texto": "9,6",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 6 itens. Só os 4 salgados têm esse acréscimo: 4 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "D",
              "texto": "10",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "25",
              "erro": 3,
              "falta": "Contou um salgado só. São 4 salgados: a conta tem 4 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            }
          ],
          "gabarito": "D",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g − s = s + 1,00, ou seja, g = 2s + 1,00. Então 4(2s + 1,00) + 2s = 49,00, ou seja, 10s + 4,00 = 49,00. Daí 10s = 45,00 e s = 4,50. O salgado custa g = 2 × 4,50 + 1,00 = R$ 10,00."
        }
      },
      {
        "forma": "dobro",
        "q": 0,
        "s": 5,
        "dc": 100,
        "n1": 3,
        "n2": 2,
        "d": 1,
        "T": 43,
        "Tt": "43,00",
        "dReais": "R$ 1,00",
        "dNum": "1,00",
        "dTexto": "R$ 1,00",
        "fraseRelacao": "um salgado custa R$ 1,00 a mais que o dobro do preço de um suco.",
        "faltaDobro": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
        "traducaoTexto": "A frase diz g = 2s + 1,00.",
        "n2s": "2s",
        "n1t": "3 salgados",
        "n2t": "2 sucos",
        "nItens": 5,
        "umPedido": "um suco",
        "doPedido": "do suco",
        "doOutro": "do salgado",
        "coefS": 8,
        "n1dTexto": "3,00",
        "restoTexto": "40,00",
        "sTexto": "5,00",
        "fimTexto": "",
        "pronto": {
          "enunciado": "Na cantina da escola, um salgado custa R$ 1,00 a mais que o dobro do preço de um suco. Juntos, 3 salgados e 2 sucos custam R$ 43,00. Quanto custa um suco, em reais?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4,75",
              "erro": 1,
              "falta": "Multiplicou o acréscimo de R$ 1,00 pelos 5 itens. Só os 3 salgados têm esse acréscimo: 3 × R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "B",
              "texto": "5",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "8",
              "erro": 0,
              "falta": "Traduziu só “R$ 1,00 a mais que o suco” e esqueceu o dobro. A frase inteira dá: salgado = 2 × suco + R$ 1,00.",
              "paragrafo": "mat-fa.p7.b1.s2"
            },
            {
              "letra": "D",
              "texto": "10,5",
              "erro": 3,
              "falta": "Contou um salgado só. São 3 salgados: a conta tem 3 × (2 × suco + R$ 1,00).",
              "paragrafo": "mat-fa.p7.b1.s3"
            },
            {
              "letra": "E",
              "texto": "11",
              "erro": 2,
              "falta": "Achou o preço do salgado. A pergunta é o preço do suco.",
              "paragrafo": "mat-fa.p7.b1.s1"
            }
          ],
          "gabarito": "B",
          "explicacao": "Chame de g o preço de um salgado e de s o de um suco, em reais. A frase diz g = 2s + 1,00. Então 3(2s + 1,00) + 2s = 43,00, ou seja, 8s + 3,00 = 43,00. Daí 8s = 40,00 e s = 5,00."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.p8.m",
    "tipo": "pagina",
    "pagina": "mat-fa.p8",
    "capitulo": "mat-fa.c4",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ {Tt}. O primeiro tinha {x1t}, {y1t} e {z1t}. O segundo tinha {x2t}, {y2t} e {z2t}. Um terceiro pedido, também de R$ {Tt}, terá {y3t} e {z3t}. Quantos pães de queijo ele terá?",
    "certa": "xb + sg*p",
    "erros": [
      {
        "expr": "xb + sg*(p - 2)",
        "falta": "Contou o total de itens, que muda {pm2} a cada troca. A troca é por tipo: {p} pães de queijo valem 1 suco e 1 fatia de bolo.",
        "paragrafo": "mat-fa.p8.b1.s2"
      },
      {
        "expr": "xb",
        "falta": "Parou no {nomeBase} pedido. Dele para o terceiro falta uma troca: {trocaTexto}.",
        "paragrafo": "mat-fa.p8.b1.s3"
      },
      {
        "expr": "xb + 2*sg*p",
        "falta": "Aplicou a troca uma vez a mais. Do {nomeBase} pedido para o terceiro é uma troca só.",
        "paragrafo": "mat-fa.p8.b1.s3"
      },
      {
        "expr": "xb + sg*p + y3 + z3",
        "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
        "paragrafo": "mat-fa.p8.b2.s4"
      }
    ],
    "explicacao": "Do primeiro para o segundo pedido entraram {p} pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem {p} pães. {passoTexto}",
    "papeisDasLinhas": "linha 0 = pré-pergunta do núcleo; 1 = checagem; 2 a 7 = variantes (revisões, R5, inserções do Pilar III, Prova, Questão do dia), em ordem; 8 a 10 = \"Refazer com outros números\"",
    "linhas": [
      {
        "dir": 1,
        "P": 2,
        "S": 5,
        "B": 7,
        "x1": 4,
        "y1": 3,
        "z1": 3,
        "p": 6,
        "sg": 1,
        "xb": 10,
        "x2": 10,
        "y2": 2,
        "z2": 2,
        "x3": 16,
        "y3": 1,
        "z3": 1,
        "pm2": 4,
        "T": 44,
        "Tt": "44,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 6 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 10 + 6 = 16 pães de queijo.",
        "x1t": "4 pães de queijo",
        "y1t": "3 sucos",
        "z1t": "3 fatias de bolo",
        "x2t": "10 pães de queijo",
        "y2t": "2 sucos",
        "z2t": "2 fatias de bolo",
        "y3t": "1 suco",
        "z3t": "1 fatia de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 44,00. O primeiro tinha 4 pães de queijo, 3 sucos e 3 fatias de bolo. O segundo tinha 10 pães de queijo, 2 sucos e 2 fatias de bolo. Um terceiro pedido, também de R$ 44,00, terá 1 suco e 1 fatia de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "10",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 6 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "14",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 4 a cada troca. A troca é por tipo: 6 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "16",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "18",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "22",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 6 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 6 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 10 + 6 = 16 pães de queijo."
        }
      },
      {
        "dir": -1,
        "P": 2,
        "S": 5,
        "B": 7,
        "x1": 14,
        "y1": 3,
        "z1": 2,
        "p": 6,
        "sg": -1,
        "xb": 14,
        "x2": 20,
        "y2": 2,
        "z2": 1,
        "x3": 8,
        "y3": 4,
        "z3": 3,
        "pm2": 4,
        "T": 57,
        "Tt": "57,00",
        "nomeBase": "primeiro",
        "trocaTexto": "saem 6 pães de queijo, entram 1 suco e 1 fatia",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 14 − 6 = 8 pães de queijo.",
        "x1t": "14 pães de queijo",
        "y1t": "3 sucos",
        "z1t": "2 fatias de bolo",
        "x2t": "20 pães de queijo",
        "y2t": "2 sucos",
        "z2t": "1 fatia de bolo",
        "y3t": "4 sucos",
        "z3t": "3 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 57,00. O primeiro tinha 14 pães de queijo, 3 sucos e 2 fatias de bolo. O segundo tinha 20 pães de queijo, 2 sucos e 1 fatia de bolo. Um terceiro pedido, também de R$ 57,00, terá 4 sucos e 3 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do primeiro pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "8",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "10",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 4 a cada troca. A troca é por tipo: 6 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "14",
              "erro": 1,
              "falta": "Parou no primeiro pedido. Dele para o terceiro falta uma troca: saem 6 pães de queijo, entram 1 suco e 1 fatia.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "E",
              "texto": "15",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Do primeiro para o segundo pedido entraram 6 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 6 pães. O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 14 − 6 = 8 pães de queijo."
        }
      },
      {
        "dir": 1,
        "P": 3,
        "S": 5,
        "B": 7,
        "x1": 2,
        "y1": 4,
        "z1": 3,
        "p": 4,
        "sg": 1,
        "xb": 6,
        "x2": 6,
        "y2": 3,
        "z2": 2,
        "x3": 10,
        "y3": 2,
        "z3": 1,
        "pm2": 2,
        "T": 47,
        "Tt": "47,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 4 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 6 + 4 = 10 pães de queijo.",
        "x1t": "2 pães de queijo",
        "y1t": "4 sucos",
        "z1t": "3 fatias de bolo",
        "x2t": "6 pães de queijo",
        "y2t": "3 sucos",
        "z2t": "2 fatias de bolo",
        "y3t": "2 sucos",
        "z3t": "1 fatia de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 47,00. O primeiro tinha 2 pães de queijo, 4 sucos e 3 fatias de bolo. O segundo tinha 6 pães de queijo, 3 sucos e 2 fatias de bolo. Um terceiro pedido, também de R$ 47,00, terá 2 sucos e 1 fatia de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "6",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 4 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "8",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 2 a cada troca. A troca é por tipo: 4 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "10",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "13",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "14",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 4 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 4 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 6 + 4 = 10 pães de queijo."
        }
      },
      {
        "dir": -1,
        "P": 3,
        "S": 5,
        "B": 7,
        "x1": 10,
        "y1": 2,
        "z1": 3,
        "p": 4,
        "sg": -1,
        "xb": 10,
        "x2": 14,
        "y2": 1,
        "z2": 2,
        "x3": 6,
        "y3": 3,
        "z3": 4,
        "pm2": 2,
        "T": 61,
        "Tt": "61,00",
        "nomeBase": "primeiro",
        "trocaTexto": "saem 4 pães de queijo, entram 1 suco e 1 fatia",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 10 − 4 = 6 pães de queijo.",
        "x1t": "10 pães de queijo",
        "y1t": "2 sucos",
        "z1t": "3 fatias de bolo",
        "x2t": "14 pães de queijo",
        "y2t": "1 suco",
        "z2t": "2 fatias de bolo",
        "y3t": "3 sucos",
        "z3t": "4 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 61,00. O primeiro tinha 10 pães de queijo, 2 sucos e 3 fatias de bolo. O segundo tinha 14 pães de queijo, 1 suco e 2 fatias de bolo. Um terceiro pedido, também de R$ 61,00, terá 3 sucos e 4 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do primeiro pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "6",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "8",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 2 a cada troca. A troca é por tipo: 4 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "10",
              "erro": 1,
              "falta": "Parou no primeiro pedido. Dele para o terceiro falta uma troca: saem 4 pães de queijo, entram 1 suco e 1 fatia.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "E",
              "texto": "13",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Do primeiro para o segundo pedido entraram 4 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 4 pães. O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 10 − 4 = 6 pães de queijo."
        }
      },
      {
        "dir": 1,
        "P": 2.5,
        "S": 4.5,
        "B": 8,
        "x1": 3,
        "y1": 3,
        "z1": 4,
        "p": 5,
        "sg": 1,
        "xb": 8,
        "x2": 8,
        "y2": 2,
        "z2": 3,
        "x3": 13,
        "y3": 1,
        "z3": 2,
        "pm2": 3,
        "T": 53,
        "Tt": "53,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 5 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 8 + 5 = 13 pães de queijo.",
        "x1t": "3 pães de queijo",
        "y1t": "3 sucos",
        "z1t": "4 fatias de bolo",
        "x2t": "8 pães de queijo",
        "y2t": "2 sucos",
        "z2t": "3 fatias de bolo",
        "y3t": "1 suco",
        "z3t": "2 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 53,00. O primeiro tinha 3 pães de queijo, 3 sucos e 4 fatias de bolo. O segundo tinha 8 pães de queijo, 2 sucos e 3 fatias de bolo. Um terceiro pedido, também de R$ 53,00, terá 1 suco e 2 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "8",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 5 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "11",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 3 a cada troca. A troca é por tipo: 5 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "13",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "16",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "18",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 5 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 5 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 8 + 5 = 13 pães de queijo."
        }
      },
      {
        "dir": -1,
        "P": 2.5,
        "S": 4.5,
        "B": 8,
        "x1": 12,
        "y1": 2,
        "z1": 2,
        "p": 5,
        "sg": -1,
        "xb": 12,
        "x2": 17,
        "y2": 1,
        "z2": 1,
        "x3": 7,
        "y3": 3,
        "z3": 3,
        "pm2": 3,
        "T": 55,
        "Tt": "55,00",
        "nomeBase": "primeiro",
        "trocaTexto": "saem 5 pães de queijo, entram 1 suco e 1 fatia",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 12 − 5 = 7 pães de queijo.",
        "x1t": "12 pães de queijo",
        "y1t": "2 sucos",
        "z1t": "2 fatias de bolo",
        "x2t": "17 pães de queijo",
        "y2t": "1 suco",
        "z2t": "1 fatia de bolo",
        "y3t": "3 sucos",
        "z3t": "3 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 55,00. O primeiro tinha 12 pães de queijo, 2 sucos e 2 fatias de bolo. O segundo tinha 17 pães de queijo, 1 suco e 1 fatia de bolo. Um terceiro pedido, também de R$ 55,00, terá 3 sucos e 3 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "2",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do primeiro pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "7",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "9",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 3 a cada troca. A troca é por tipo: 5 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "12",
              "erro": 1,
              "falta": "Parou no primeiro pedido. Dele para o terceiro falta uma troca: saem 5 pães de queijo, entram 1 suco e 1 fatia.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "E",
              "texto": "13",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Do primeiro para o segundo pedido entraram 5 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 5 pães. O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 12 − 5 = 7 pães de queijo."
        }
      },
      {
        "dir": 1,
        "P": 2,
        "S": 4,
        "B": 6,
        "x1": 1,
        "y1": 4,
        "z1": 4,
        "p": 5,
        "sg": 1,
        "xb": 6,
        "x2": 6,
        "y2": 3,
        "z2": 3,
        "x3": 11,
        "y3": 2,
        "z3": 2,
        "pm2": 3,
        "T": 42,
        "Tt": "42,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 5 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 6 + 5 = 11 pães de queijo.",
        "x1t": "1 pão de queijo",
        "y1t": "4 sucos",
        "z1t": "4 fatias de bolo",
        "x2t": "6 pães de queijo",
        "y2t": "3 sucos",
        "z2t": "3 fatias de bolo",
        "y3t": "2 sucos",
        "z3t": "2 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 42,00. O primeiro tinha 1 pão de queijo, 4 sucos e 4 fatias de bolo. O segundo tinha 6 pães de queijo, 3 sucos e 3 fatias de bolo. Um terceiro pedido, também de R$ 42,00, terá 2 sucos e 2 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "6",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 5 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "9",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 3 a cada troca. A troca é por tipo: 5 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "11",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "15",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "16",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 5 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 5 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 6 + 5 = 11 pães de queijo."
        }
      },
      {
        "dir": -1,
        "P": 2,
        "S": 4,
        "B": 6,
        "x1": 11,
        "y1": 3,
        "z1": 2,
        "p": 5,
        "sg": -1,
        "xb": 11,
        "x2": 16,
        "y2": 2,
        "z2": 1,
        "x3": 6,
        "y3": 4,
        "z3": 3,
        "pm2": 3,
        "T": 46,
        "Tt": "46,00",
        "nomeBase": "primeiro",
        "trocaTexto": "saem 5 pães de queijo, entram 1 suco e 1 fatia",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 11 − 5 = 6 pães de queijo.",
        "x1t": "11 pães de queijo",
        "y1t": "3 sucos",
        "z1t": "2 fatias de bolo",
        "x2t": "16 pães de queijo",
        "y2t": "2 sucos",
        "z2t": "1 fatia de bolo",
        "y3t": "4 sucos",
        "z3t": "3 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 46,00. O primeiro tinha 11 pães de queijo, 3 sucos e 2 fatias de bolo. O segundo tinha 16 pães de queijo, 2 sucos e 1 fatia de bolo. Um terceiro pedido, também de R$ 46,00, terá 4 sucos e 3 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "1",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do primeiro pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "6",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "8",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 3 a cada troca. A troca é por tipo: 5 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "11",
              "erro": 1,
              "falta": "Parou no primeiro pedido. Dele para o terceiro falta uma troca: saem 5 pães de queijo, entram 1 suco e 1 fatia.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "E",
              "texto": "13",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Do primeiro para o segundo pedido entraram 5 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 5 pães. O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 11 − 5 = 6 pães de queijo."
        }
      },
      {
        "dir": 1,
        "P": 1.5,
        "S": 4,
        "B": 5,
        "x1": 2,
        "y1": 5,
        "z1": 3,
        "p": 6,
        "sg": 1,
        "xb": 8,
        "x2": 8,
        "y2": 4,
        "z2": 2,
        "x3": 14,
        "y3": 3,
        "z3": 1,
        "pm2": 4,
        "T": 38,
        "Tt": "38,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 6 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 8 + 6 = 14 pães de queijo.",
        "x1t": "2 pães de queijo",
        "y1t": "5 sucos",
        "z1t": "3 fatias de bolo",
        "x2t": "8 pães de queijo",
        "y2t": "4 sucos",
        "z2t": "2 fatias de bolo",
        "y3t": "3 sucos",
        "z3t": "1 fatia de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 38,00. O primeiro tinha 2 pães de queijo, 5 sucos e 3 fatias de bolo. O segundo tinha 8 pães de queijo, 4 sucos e 2 fatias de bolo. Um terceiro pedido, também de R$ 38,00, terá 3 sucos e 1 fatia de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "8",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 6 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "12",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 4 a cada troca. A troca é por tipo: 6 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "14",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "18",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "20",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 6 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 6 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 8 + 6 = 14 pães de queijo."
        }
      },
      {
        "dir": -1,
        "P": 1.5,
        "S": 4,
        "B": 5,
        "x1": 13,
        "y1": 2,
        "z1": 3,
        "p": 6,
        "sg": -1,
        "xb": 13,
        "x2": 19,
        "y2": 1,
        "z2": 2,
        "x3": 7,
        "y3": 3,
        "z3": 4,
        "pm2": 4,
        "T": 42.5,
        "Tt": "42,50",
        "nomeBase": "primeiro",
        "trocaTexto": "saem 6 pães de queijo, entram 1 suco e 1 fatia",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 13 − 6 = 7 pães de queijo.",
        "x1t": "13 pães de queijo",
        "y1t": "2 sucos",
        "z1t": "3 fatias de bolo",
        "x2t": "19 pães de queijo",
        "y2t": "1 suco",
        "z2t": "2 fatias de bolo",
        "y3t": "3 sucos",
        "z3t": "4 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 42,50. O primeiro tinha 13 pães de queijo, 2 sucos e 3 fatias de bolo. O segundo tinha 19 pães de queijo, 1 suco e 2 fatias de bolo. Um terceiro pedido, também de R$ 42,50, terá 3 sucos e 4 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "1",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do primeiro pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "7",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "9",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 4 a cada troca. A troca é por tipo: 6 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "13",
              "erro": 1,
              "falta": "Parou no primeiro pedido. Dele para o terceiro falta uma troca: saem 6 pães de queijo, entram 1 suco e 1 fatia.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "E",
              "texto": "14",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Do primeiro para o segundo pedido entraram 6 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 6 pães. O terceiro tem 1 suco e 1 fatia a mais que o primeiro: 13 − 6 = 7 pães de queijo."
        }
      },
      {
        "dir": 1,
        "P": 2,
        "S": 5,
        "B": 7,
        "x1": 1,
        "y1": 4,
        "z1": 5,
        "p": 6,
        "sg": 1,
        "xb": 7,
        "x2": 7,
        "y2": 3,
        "z2": 4,
        "x3": 13,
        "y3": 2,
        "z3": 3,
        "pm2": 4,
        "T": 57,
        "Tt": "57,00",
        "nomeBase": "segundo",
        "trocaTexto": "saem 1 suco e 1 fatia, entram 6 pães de queijo",
        "passoTexto": "O terceiro tem 1 suco e 1 fatia a menos que o segundo: 7 + 6 = 13 pães de queijo.",
        "x1t": "1 pão de queijo",
        "y1t": "4 sucos",
        "z1t": "5 fatias de bolo",
        "x2t": "7 pães de queijo",
        "y2t": "3 sucos",
        "z2t": "4 fatias de bolo",
        "y3t": "2 sucos",
        "z3t": "3 fatias de bolo",
        "pronto": {
          "enunciado": "Dois pedidos numa lanchonete custaram o mesmo valor, R$ 57,00. O primeiro tinha 1 pão de queijo, 4 sucos e 5 fatias de bolo. O segundo tinha 7 pães de queijo, 3 sucos e 4 fatias de bolo. Um terceiro pedido, também de R$ 57,00, terá 2 sucos e 3 fatias de bolo. Quantos pães de queijo ele terá?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "7",
              "erro": 1,
              "falta": "Parou no segundo pedido. Dele para o terceiro falta uma troca: saem 1 suco e 1 fatia, entram 6 pães de queijo.",
              "paragrafo": "mat-fa.p8.b1.s3"
            },
            {
              "letra": "B",
              "texto": "11",
              "erro": 0,
              "falta": "Contou o total de itens, que muda 4 a cada troca. A troca é por tipo: 6 pães de queijo valem 1 suco e 1 fatia de bolo.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "13",
              "certa": true
            },
            {
              "letra": "D",
              "texto": "18",
              "erro": 3,
              "falta": "Somou os sucos e as fatias aos pães de queijo. A pergunta é só de pães de queijo.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "19",
              "erro": 2,
              "falta": "Aplicou a troca uma vez a mais. Do segundo pedido para o terceiro é uma troca só.",
              "paragrafo": "mat-fa.p8.b1.s3"
            }
          ],
          "gabarito": "C",
          "explicacao": "Do primeiro para o segundo pedido entraram 6 pães de queijo e saíram 1 suco e 1 fatia de bolo, com o mesmo total: 1 suco + 1 fatia valem 6 pães. O terceiro tem 1 suco e 1 fatia a menos que o segundo: 7 + 6 = 13 pães de queijo."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.p8.b2.m",
    "tipo": "bloco",
    "pagina": "mat-fa.p8",
    "bloco": "mat-fa.p8.b2",
    "capitulo": "mat-fa.c4",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "O elevador de carga de um mercado aguenta, no máximo, o peso de {N} fardos de água. Cada saco de arroz pesa o mesmo que {r} fardos de água. Já há {f} sacos de arroz no elevador. Quantos fardos de água ainda podem entrar?",
    "certa": "N - f*r",
    "erros": [
      {
        "expr": "N",
        "falta": "Não descontou os {f} sacos de arroz que já estão no elevador.",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "expr": "N - f",
        "falta": "Descontou cada saco como se fosse 1 fardo. Cada saco pesa {r} fardos: {f} × {r} = {fr}.",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "expr": "N/r - f",
        "falta": "Fez a conta em sacos de arroz ({N} ÷ {r} − {f}). A pergunta é quantos fardos de água ainda cabem.",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "expr": "N - r",
        "falta": "Descontou um saco só. São {f} sacos, cada um com o peso de {r} fardos.",
        "paragrafo": "mat-fa.p8.b2.s4"
      }
    ],
    "explicacao": "Os {f} sacos pesam o mesmo que {f} × {r} = {fr} fardos. Ainda cabem {N} − {fr} = {resp} fardos de água.",
    "papeisDasLinhas": "linha 0 = pré-pergunta do bloco; 1 = variante de compreender (inserção do Pilar III)",
    "linhas": [
      {
        "N": 60,
        "r": 4,
        "f": 5,
        "fr": 20,
        "resp": 40,
        "pronto": {
          "enunciado": "O elevador de carga de um mercado aguenta, no máximo, o peso de 60 fardos de água. Cada saco de arroz pesa o mesmo que 4 fardos de água. Já há 5 sacos de arroz no elevador. Quantos fardos de água ainda podem entrar?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "10",
              "erro": 2,
              "falta": "Fez a conta em sacos de arroz (60 ÷ 4 − 5). A pergunta é quantos fardos de água ainda cabem.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "40",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "55",
              "erro": 1,
              "falta": "Descontou cada saco como se fosse 1 fardo. Cada saco pesa 4 fardos: 5 × 4 = 20.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "D",
              "texto": "56",
              "erro": 3,
              "falta": "Descontou um saco só. São 5 sacos, cada um com o peso de 4 fardos.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "60",
              "erro": 0,
              "falta": "Não descontou os 5 sacos de arroz que já estão no elevador.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Os 5 sacos pesam o mesmo que 5 × 4 = 20 fardos. Ainda cabem 60 − 20 = 40 fardos de água."
        }
      },
      {
        "N": 48,
        "r": 3,
        "f": 6,
        "fr": 18,
        "resp": 30,
        "pronto": {
          "enunciado": "O elevador de carga de um mercado aguenta, no máximo, o peso de 48 fardos de água. Cada saco de arroz pesa o mesmo que 3 fardos de água. Já há 6 sacos de arroz no elevador. Quantos fardos de água ainda podem entrar?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "10",
              "erro": 2,
              "falta": "Fez a conta em sacos de arroz (48 ÷ 3 − 6). A pergunta é quantos fardos de água ainda cabem.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "30",
              "certa": true
            },
            {
              "letra": "C",
              "texto": "42",
              "erro": 1,
              "falta": "Descontou cada saco como se fosse 1 fardo. Cada saco pesa 3 fardos: 6 × 3 = 18.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "D",
              "texto": "45",
              "erro": 3,
              "falta": "Descontou um saco só. São 6 sacos, cada um com o peso de 3 fardos.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "48",
              "erro": 0,
              "falta": "Não descontou os 6 sacos de arroz que já estão no elevador.",
              "paragrafo": "mat-fa.p8.b2.s4"
            }
          ],
          "gabarito": "B",
          "explicacao": "Os 6 sacos pesam o mesmo que 6 × 3 = 18 fardos. Ainda cabem 48 − 18 = 30 fardos de água."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  },
  {
    "id": "mat-fa.c4.ap",
    "tipo": "aplicar",
    "pagina": "mat-fa.p8",
    "capitulo": "mat-fa.c4",
    "licenca": "CC BY-SA 4.0",
    "formato": "numero",
    "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem {at} e {bt} e custa R$ {T1t}. O kit 2 tem {bct} e {act} e custa R$ {T2t}. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de {umPedido}?",
    "certa": "(1 - q)*c + q*k",
    "erros": [
      {
        "expr": "(1 - q)*k + q*c",
        "falta": "Achou o preço {doOutro}. A pergunta é o preço {doPedido}.",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "expr": "(T1 + T2)/(a + b)",
        "falta": "Somou os dois kits e dividiu por {ab}. Isso dá caderno + caneta = R$ {somaTexto}, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
        "paragrafo": "mat-fa.p8.b1.s2"
      },
      {
        "expr": "T1 - T2",
        "falta": "Tomou a diferença entre os kits, R$ {difTexto}, como o preço {doPedido}. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
        "paragrafo": "mat-fa.p8.b1.s2"
      },
      {
        "expr": "T1/(a + b)",
        "falta": "Dividiu o kit 1 por {ab} itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
        "paragrafo": "mat-fa.p7.b1.s1"
      }
    ],
    "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ {difTexto}. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = {difTexto}, ou seja, caderno = caneta + {difTexto}. Substitua no kit 2: {b} × (caneta + {difTexto}) + {a} × caneta = {T2t}, então {ab} × caneta + {bdTexto} = {T2t} e caneta = R$ {kTexto}. Caderno = {kTexto} + {difTexto} = R$ {cTexto}.",
    "papeisDasLinhas": "linha 0 = item da rodada (papel de aplicar); 1 a 4 = variantes (revisões, Prova, Questão do dia), em ordem; 5 a 7 = \"Refazer com outros números\"",
    "linhas": [
      {
        "q": 0,
        "a": 3,
        "b": 2,
        "c": 12,
        "k": 3,
        "T1": 42,
        "T2": 33,
        "T1t": "42,00",
        "T2t": "33,00",
        "ab": 5,
        "somaTexto": "15,00",
        "difTexto": "9,00",
        "bdTexto": "18,00",
        "cTexto": "12,00",
        "kTexto": "3,00",
        "umPedido": "um caderno",
        "doPedido": "do caderno",
        "doOutro": "da caneta",
        "at": "3 cadernos",
        "bt": "2 canetas",
        "bct": "2 cadernos",
        "act": "3 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 3 cadernos e 2 canetas e custa R$ 42,00. O kit 2 tem 2 cadernos e 3 canetas e custa R$ 33,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de um caderno?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3",
              "erro": 0,
              "falta": "Achou o preço da caneta. A pergunta é o preço do caderno.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "8,4",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 5 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "C",
              "texto": "9",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 9,00, como o preço do caderno. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "D",
              "texto": "12",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "15",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 5. Isso dá caderno + caneta = R$ 15,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "D",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 9,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 9,00, ou seja, caderno = caneta + 9,00. Substitua no kit 2: 2 × (caneta + 9,00) + 3 × caneta = 33,00, então 5 × caneta + 18,00 = 33,00 e caneta = R$ 3,00. Caderno = 3,00 + 9,00 = R$ 12,00."
        }
      },
      {
        "q": 1,
        "a": 3,
        "b": 2,
        "c": 10,
        "k": 3,
        "T1": 36,
        "T2": 29,
        "T1t": "36,00",
        "T2t": "29,00",
        "ab": 5,
        "somaTexto": "13,00",
        "difTexto": "7,00",
        "bdTexto": "14,00",
        "cTexto": "10,00",
        "kTexto": "3,00",
        "umPedido": "uma caneta",
        "doPedido": "da caneta",
        "doOutro": "do caderno",
        "at": "3 cadernos",
        "bt": "2 canetas",
        "bct": "2 cadernos",
        "act": "3 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 3 cadernos e 2 canetas e custa R$ 36,00. O kit 2 tem 2 cadernos e 3 canetas e custa R$ 29,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de uma caneta?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "7",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 7,00, como o preço da caneta. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "7,2",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 5 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "10",
              "erro": 0,
              "falta": "Achou o preço do caderno. A pergunta é o preço da caneta.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "13",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 5. Isso dá caderno + caneta = R$ 13,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "A",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 7,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 7,00, ou seja, caderno = caneta + 7,00. Substitua no kit 2: 2 × (caneta + 7,00) + 3 × caneta = 29,00, então 5 × caneta + 14,00 = 29,00 e caneta = R$ 3,00. Caderno = 3,00 + 7,00 = R$ 10,00."
        }
      },
      {
        "q": 0,
        "a": 2,
        "b": 1,
        "c": 10,
        "k": 4,
        "T1": 24,
        "T2": 18,
        "T1t": "24,00",
        "T2t": "18,00",
        "ab": 3,
        "somaTexto": "14,00",
        "difTexto": "6,00",
        "bdTexto": "6,00",
        "cTexto": "10,00",
        "kTexto": "4,00",
        "umPedido": "um caderno",
        "doPedido": "do caderno",
        "doOutro": "da caneta",
        "at": "2 cadernos",
        "bt": "1 caneta",
        "bct": "1 caderno",
        "act": "2 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 2 cadernos e 1 caneta e custa R$ 24,00. O kit 2 tem 1 caderno e 2 canetas e custa R$ 18,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de um caderno?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4",
              "erro": 0,
              "falta": "Achou o preço da caneta. A pergunta é o preço do caderno.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "6",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 6,00, como o preço do caderno. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "8",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 3 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "10",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "14",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 3. Isso dá caderno + caneta = R$ 14,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "D",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 6,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 6,00, ou seja, caderno = caneta + 6,00. Substitua no kit 2: 1 × (caneta + 6,00) + 2 × caneta = 18,00, então 3 × caneta + 6,00 = 18,00 e caneta = R$ 4,00. Caderno = 4,00 + 6,00 = R$ 10,00."
        }
      },
      {
        "q": 1,
        "a": 3,
        "b": 2,
        "c": 8,
        "k": 3,
        "T1": 30,
        "T2": 25,
        "T1t": "30,00",
        "T2t": "25,00",
        "ab": 5,
        "somaTexto": "11,00",
        "difTexto": "5,00",
        "bdTexto": "10,00",
        "cTexto": "8,00",
        "kTexto": "3,00",
        "umPedido": "uma caneta",
        "doPedido": "da caneta",
        "doOutro": "do caderno",
        "at": "3 cadernos",
        "bt": "2 canetas",
        "bct": "2 cadernos",
        "act": "3 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 3 cadernos e 2 canetas e custa R$ 30,00. O kit 2 tem 2 cadernos e 3 canetas e custa R$ 25,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de uma caneta?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "5",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 5,00, como o preço da caneta. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "6",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 5 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "8",
              "erro": 0,
              "falta": "Achou o preço do caderno. A pergunta é o preço da caneta.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "11",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 5. Isso dá caderno + caneta = R$ 11,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "A",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 5,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 5,00, ou seja, caderno = caneta + 5,00. Substitua no kit 2: 2 × (caneta + 5,00) + 3 × caneta = 25,00, então 5 × caneta + 10,00 = 25,00 e caneta = R$ 3,00. Caderno = 3,00 + 5,00 = R$ 8,00."
        }
      },
      {
        "q": 0,
        "a": 3,
        "b": 2,
        "c": 11,
        "k": 3.5,
        "T1": 40,
        "T2": 32.5,
        "T1t": "40,00",
        "T2t": "32,50",
        "ab": 5,
        "somaTexto": "14,50",
        "difTexto": "7,50",
        "bdTexto": "15,00",
        "cTexto": "11,00",
        "kTexto": "3,50",
        "umPedido": "um caderno",
        "doPedido": "do caderno",
        "doOutro": "da caneta",
        "at": "3 cadernos",
        "bt": "2 canetas",
        "bct": "2 cadernos",
        "act": "3 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 3 cadernos e 2 canetas e custa R$ 40,00. O kit 2 tem 2 cadernos e 3 canetas e custa R$ 32,50. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de um caderno?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3,5",
              "erro": 0,
              "falta": "Achou o preço da caneta. A pergunta é o preço do caderno.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "7,5",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 7,50, como o preço do caderno. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "8",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 5 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "11",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "14,5",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 5. Isso dá caderno + caneta = R$ 14,50, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "D",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 7,50. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 7,50, ou seja, caderno = caneta + 7,50. Substitua no kit 2: 2 × (caneta + 7,50) + 3 × caneta = 32,50, então 5 × caneta + 15,00 = 32,50 e caneta = R$ 3,50. Caderno = 3,50 + 7,50 = R$ 11,00."
        }
      },
      {
        "q": 1,
        "a": 2,
        "b": 1,
        "c": 13,
        "k": 4,
        "T1": 30,
        "T2": 21,
        "T1t": "30,00",
        "T2t": "21,00",
        "ab": 3,
        "somaTexto": "17,00",
        "difTexto": "9,00",
        "bdTexto": "9,00",
        "cTexto": "13,00",
        "kTexto": "4,00",
        "umPedido": "uma caneta",
        "doPedido": "da caneta",
        "doOutro": "do caderno",
        "at": "2 cadernos",
        "bt": "1 caneta",
        "bct": "1 caderno",
        "act": "2 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 2 cadernos e 1 caneta e custa R$ 30,00. O kit 2 tem 1 caderno e 2 canetas e custa R$ 21,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de uma caneta?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "9",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 9,00, como o preço da caneta. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "10",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 3 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "13",
              "erro": 0,
              "falta": "Achou o preço do caderno. A pergunta é o preço da caneta.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "17",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 3. Isso dá caderno + caneta = R$ 17,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "A",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 9,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 9,00, ou seja, caderno = caneta + 9,00. Substitua no kit 2: 1 × (caneta + 9,00) + 2 × caneta = 21,00, então 3 × caneta + 9,00 = 21,00 e caneta = R$ 4,00. Caderno = 4,00 + 9,00 = R$ 13,00."
        }
      },
      {
        "q": 0,
        "a": 3,
        "b": 2,
        "c": 9,
        "k": 3,
        "T1": 33,
        "T2": 27,
        "T1t": "33,00",
        "T2t": "27,00",
        "ab": 5,
        "somaTexto": "12,00",
        "difTexto": "6,00",
        "bdTexto": "12,00",
        "cTexto": "9,00",
        "kTexto": "3,00",
        "umPedido": "um caderno",
        "doPedido": "do caderno",
        "doOutro": "da caneta",
        "at": "3 cadernos",
        "bt": "2 canetas",
        "bct": "2 cadernos",
        "act": "3 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 3 cadernos e 2 canetas e custa R$ 33,00. O kit 2 tem 2 cadernos e 3 canetas e custa R$ 27,00. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de um caderno?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "3",
              "erro": 0,
              "falta": "Achou o preço da caneta. A pergunta é o preço do caderno.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "B",
              "texto": "6",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 6,00, como o preço do caderno. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "6,6",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 5 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "9",
              "certa": true
            },
            {
              "letra": "E",
              "texto": "12",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 5. Isso dá caderno + caneta = R$ 12,00, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "D",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 6,00. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 6,00, ou seja, caderno = caneta + 6,00. Substitua no kit 2: 2 × (caneta + 6,00) + 3 × caneta = 27,00, então 5 × caneta + 12,00 = 27,00 e caneta = R$ 3,00. Caderno = 3,00 + 6,00 = R$ 9,00."
        }
      },
      {
        "q": 1,
        "a": 2,
        "b": 1,
        "c": 8.5,
        "k": 4,
        "T1": 21,
        "T2": 16.5,
        "T1t": "21,00",
        "T2t": "16,50",
        "ab": 3,
        "somaTexto": "12,50",
        "difTexto": "4,50",
        "bdTexto": "4,50",
        "cTexto": "8,50",
        "kTexto": "4,00",
        "umPedido": "uma caneta",
        "doPedido": "da caneta",
        "doOutro": "do caderno",
        "at": "2 cadernos",
        "bt": "1 caneta",
        "bct": "1 caderno",
        "act": "2 canetas",
        "pronto": {
          "enunciado": "Uma papelaria monta dois kits para a volta às aulas. O kit 1 tem 2 cadernos e 1 caneta e custa R$ 21,00. O kit 2 tem 1 caderno e 2 canetas e custa R$ 16,50. Todos os cadernos têm o mesmo preço, e todas as canetas também. Qual é o preço, em reais, de uma caneta?",
          "alternativas": [
            {
              "letra": "A",
              "texto": "4",
              "certa": true
            },
            {
              "letra": "B",
              "texto": "4,5",
              "erro": 2,
              "falta": "Tomou a diferença entre os kits, R$ 4,50, como o preço da caneta. Essa diferença é caderno − caneta: o kit 1 tem 1 caderno a mais e 1 caneta a menos.",
              "paragrafo": "mat-fa.p8.b1.s2"
            },
            {
              "letra": "C",
              "texto": "7",
              "erro": 3,
              "falta": "Dividiu o kit 1 por 3 itens, como se caderno e caneta custassem o mesmo. Cada um tem o seu preço: dê uma letra para cada.",
              "paragrafo": "mat-fa.p7.b1.s1"
            },
            {
              "letra": "D",
              "texto": "8,5",
              "erro": 0,
              "falta": "Achou o preço do caderno. A pergunta é o preço da caneta.",
              "paragrafo": "mat-fa.p8.b2.s4"
            },
            {
              "letra": "E",
              "texto": "12,5",
              "erro": 1,
              "falta": "Somou os dois kits e dividiu por 3. Isso dá caderno + caneta = R$ 12,50, o preço de um de cada, e não o de um item só. Para separar os dois, compare os kits: a diferença entre eles é caderno − caneta.",
              "paragrafo": "mat-fa.p8.b1.s2"
            }
          ],
          "gabarito": "A",
          "explicacao": "Do kit 1 para o kit 2 sai 1 caderno, entra 1 caneta, e o total cai R$ 4,50. Subtraindo um kit do outro, o que é igual nos dois se cancela: caderno − caneta = 4,50, ou seja, caderno = caneta + 4,50. Substitua no kit 2: 1 × (caneta + 4,50) + 2 × caneta = 16,50, então 3 × caneta + 4,50 = 16,50 e caneta = R$ 4,00. Caderno = 4,00 + 4,50 = R$ 8,50."
        }
      }
    ],
    "credito": {
      "fonte": "Equipe Prumo",
      "licenca": "CC BY-SA 4.0",
      "autoria": {
        "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
        "modelo": "Claude Opus 5.5",
        "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
        "data": "2026-11-17",
        "equipe": null,
        "revisor": null,
        "revisadoEm": null
      }
    }
  }
];

export const questoes34 = [
  {
    "id": "enem-2019-143",
    "ano": 2019,
    "dia": 2,
    "caderno": "Azul",
    "numero": 143,
    "area": "MT",
    "habilidade": "MT-H20",
    "capitulo": "mat-fa.c3",
    "inep": {
      "coItem": 54448,
      "coProva": 515,
      "a": 3.06326,
      "b": 0.80679,
      "c": 0.08034
    },
    "gabarito": "B",
    "gabaritoConferido": true,
    "conferidoITENS_PROVA": "2026-11-17",
    "textoConferidoPDF": "2026-11-17",
    "conferenciaPDF": {
      "pdf": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf",
      "sha256": "a476882608be2bf1353af8b26c60838ac187f2d1a3653524c90de62b0372efa6",
      "pagina": 19,
      "nota": "Texto igual ao PDF. A imagem do enem.dev (527 × 259 px) foi trocada por um recorte do gráfico renderizado do PDF oficial (764 × 361 px).",
      "correcoes": []
    },
    "anulada": false,
    "contexto": "<p>Os exercícios físicos são recomendados para o bom funcionamento do organismo, pois aceleram o metabolismo e, em consequência, elevam o consumo de calorias. No gráfico, estão registrados os valores calóricos, em kcal, gastos em cinco diferentes atividades físicas, em função do tempo dedicado às atividades, contado em minuto.</p><figure class=\"enem-img\"><img src=\"conteudo/img/enem-2019-143.png\" alt=\"Descrição da equipe Prumo. Gráfico de pontos sobre uma grade. Eixo horizontal: tempo, em minutos, marcado de 5 em 5, de 5 a 30. Eixo vertical: kcal, marcado de 20 em 20, de 20 a 140. Ponto I: 10 minutos e 20 kcal. Ponto II: 15 minutos e 100 kcal. Ponto III: 20 minutos e 120 kcal. Ponto IV: 25 minutos e 100 kcal. Ponto V: 30 minutos e 80 kcal.\" loading=\"lazy\"></figure>",
    "introducao": "Qual dessas atividades físicas proporciona o maior consumo de quilocalorias por minuto?",
    "fonteMd": "Os exercícios físicos são recomendados para o bom funcionamento do organismo, pois aceleram o metabolismo e, em consequência, elevam o consumo de calorias. No gráfico, estão registrados os valores calóricos, em kcal, gastos em cinco diferentes atividades físicas, em função do tempo dedicado às atividades, contado em minuto.\n\n![](https://enem.dev/2019/questions/143/ef507c14-34a0-479e-a532-193bf38c48ba.png)",
    "materialDeTerceiros": null,
    "alternativas": [
      {
        "letra": "A",
        "texto": "I",
        "falta": "Inverteu a divisão: fez minutos ÷ kcal, e a maior conta assim é a de I (10 ÷ 20 = 0,5). Isso mede minutos por kcal; a pergunta é kcal por minuto.",
        "exprTeste": "maior(r => r.t / r.k)",
        "paragrafo": "mat-fa.p5.b1.s2"
      },
      {
        "letra": "B",
        "texto": "II"
      },
      {
        "letra": "C",
        "texto": "III",
        "falta": "Escolheu o maior total, 120 kcal. Mas III levou 20 minutos: 120 ÷ 20 = 6 kcal por minuto, menos que os 6,7 de II.",
        "exprTeste": "maior(r => r.k)",
        "paragrafo": "mat-fa.p5.b1.s3"
      },
      {
        "letra": "D",
        "texto": "IV",
        "falta": "Multiplicou kcal por minutos (100 × 25 = 2 500 é o maior produto). Taxa é divisão: 100 ÷ 25 = 4 kcal por minuto.",
        "exprTeste": "maior(r => r.k * r.t)",
        "paragrafo": "mat-fa.p5.b1.s1"
      },
      {
        "letra": "E",
        "texto": "V",
        "falta": "Escolheu a atividade mais longa, de 30 minutos. Mais tempo não quer dizer mais gasto por minuto: 80 ÷ 30 ≈ 2,7.",
        "exprTeste": "maior(r => r.t)",
        "paragrafo": "mat-fa.p5.b1.s3"
      }
    ],
    "imagens": [
      {
        "src": "conteudo/img/enem-2019-143.png",
        "alt": "Descrição da equipe Prumo. Gráfico de pontos sobre uma grade. Eixo horizontal: tempo, em minutos, marcado de 5 em 5, de 5 a 30. Eixo vertical: kcal, marcado de 20 em 20, de 20 a 140. Ponto I: 10 minutos e 20 kcal. Ponto II: 15 minutos e 100 kcal. Ponto III: 20 minutos e 120 kcal. Ponto IV: 25 minutos e 100 kcal. Ponto V: 30 minutos e 80 kcal.",
        "altFonte": "equipe",
        "original": "https://enem.dev/2019/questions/143/ef507c14-34a0-479e-a532-193bf38c48ba.png",
        "recorte": "Recorte do gráfico da questão 143 (página 19 do PDF oficial do Enem 2019, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf"
      }
    ],
    "atribuicao": "INEP · Enem 2019, 2º dia, Caderno Azul, questão 143 · CC BY-ND 3.0",
    "transcricao": "Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em 17/11/2026.",
    "licenca": "CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)",
    "licencaUrl": "https://creativecommons.org/licenses/by-nd/3.0/legalcode",
    "blocos": [
      "mat-fa.p5.b1"
    ],
    "modelo": "mat-fa.p5.m",
    "explicacao": "Taxa é kcal ÷ minutos, ponto a ponto. I: 20 ÷ 10 = 2. II: 100 ÷ 15 ≈ 6,7. III: 120 ÷ 20 = 6. IV: 100 ÷ 25 = 4. V: 80 ÷ 30 ≈ 2,7. A maior taxa é a de II, mesmo com III tendo o maior total.",
    "exprCerta": "maior(r => r.k / r.t)",
    "teste": {
      "pontos": {
        "I": {
          "t": 10,
          "k": 20
        },
        "II": {
          "t": 15,
          "k": 100
        },
        "III": {
          "t": 20,
          "k": 120
        },
        "IV": {
          "t": 25,
          "k": 100
        },
        "V": {
          "t": 30,
          "k": 80
        }
      }
    },
    "autoria": {
      "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
      "modelo": "Claude Opus 5.5",
      "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
      "data": "2026-11-17",
      "equipe": null,
      "revisor": null,
      "revisadoEm": null
    },
    "papel": "rodada"
  },
  {
    "id": "enem-2020-175",
    "ano": 2020,
    "dia": 2,
    "caderno": "Azul",
    "numero": 175,
    "area": "MT",
    "habilidade": "MT-H20",
    "capitulo": "mat-fa.c3",
    "inep": {
      "coItem": 49630,
      "coProva": 587,
      "a": 2.75865,
      "b": 1.15201,
      "c": 0.15163
    },
    "gabarito": "A",
    "gabaritoConferido": true,
    "conferidoITENS_PROVA": "2026-11-17",
    "textoConferidoPDF": "2026-11-17",
    "conferenciaPDF": {
      "pdf": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf",
      "sha256": "f9970a82e0ee67a31ec16e2f14c99e620738b88dfe7c68484128964a5d5d69bc",
      "pagina": 29,
      "nota": "Texto igual ao PDF, inclusive \"Receita – Custo\" com meia-risca (U+2013), como no PDF. As seis imagens do enem.dev (fotos do caderno, de 202 × 136 a 225 × 175 px) foram trocadas por recortes do PDF oficial renderizados em 3× (597 × 450 px no gráfico do enunciado; cerca de 530 × 390 px em cada alternativa), sem a letra da alternativa, que o app já mostra.",
      "correcoes": []
    },
    "anulada": false,
    "contexto": "<p>Um administrador resolve estudar o lucro de sua empresa e, para isso, traça o gráfico da receita e do custo de produção de seus itens, em real, em função da quantidade de itens produzidos.</p><figure class=\"enem-img\"><img src=\"conteudo/img/enem-2020-175.png\" alt=\"Descrição da equipe Prumo. Gráfico com duas curvas, sobre uma grade tracejada. Eixo horizontal: quantidade de itens produzidos, de 5 em 5, até 30. Eixo vertical: R$, de 5 em 5, de 0 a 55. A curva Receita, mais grossa, começa perto de 5 com 5 itens, sobe até cerca de 50 perto de 25 itens e desce para cerca de 45 com 30 itens. A curva Custo, mais fina, começa perto de 5 com 5 itens, sobe rápido até cerca de 45 com 10 itens, desce até cerca de 10 com 25 itens e sobe para cerca de 35 com 30 itens. As curvas se encontram com 5 itens e se cruzam perto de 15 itens, na altura de 40.\" loading=\"lazy\"></figure><p>O lucro é determinado pela diferença: Receita – Custo.</p>",
    "introducao": "O gráfico que representa o lucro dessa empresa, em função da quantidade de itens produzidos, é",
    "fonteMd": "Um administrador resolve estudar o lucro de sua empresa e, para isso, traça o gráfico da receita e do custo de produção de seus itens, em real, em função da quantidade de itens produzidos.\n\n![](https://enem.dev/2020/questions/175/33aa811b-1dc7-4083-a8c0-2aeeb9fd52d6.png)\n\nO lucro é determinado pela diferença: Receita – Custo.",
    "materialDeTerceiros": null,
    "alternativas": [
      {
        "letra": "A",
        "texto": "",
        "imagem": {
          "src": "conteudo/img/enem-2020-175-a.png",
          "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −20 a 40, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, desce até −20 com 10 itens, volta a 0 com 15 itens, sobe até 40 com 25 itens e cai para 10 com 30 itens.",
          "altFonte": "equipe"
        }
      },
      {
        "letra": "B",
        "texto": "",
        "imagem": {
          "src": "conteudo/img/enem-2020-175-b.png",
          "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −40 a 20, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, sobe até cerca de 19 perto de 9 itens, volta a 0 com 15 itens, desce até um pouco abaixo de −40 perto de 24 itens e sobe para −10 com 30 itens.",
          "altFonte": "equipe"
        },
        "falta": "Fez custo − receita, na ordem trocada. Por isso o gráfico sobe onde devia descer: todos os sinais ficam invertidos.",
        "expr": "C - R",
        "exprTeste": "C - R",
        "paragrafo": "mat-fa.p6.b2.s3"
      },
      {
        "letra": "C",
        "texto": "",
        "imagem": {
          "src": "conteudo/img/enem-2020-175-c.png",
          "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva nunca fica abaixo de 0: começa em 0 com 5 itens, sobe até cerca de 18 perto de 10 itens, volta a 0 com 15 itens, sobe até cerca de 40 perto de 24 itens e cai para 10 com 30 itens.",
          "altFonte": "equipe"
        },
        "falta": "Desenhou a distância entre as curvas, sem sinal. Entre 5 e 15 itens o custo está acima da receita: ali o lucro é negativo, e o gráfico tem de descer abaixo do eixo.",
        "expr": "abs(R - C)",
        "exprTeste": "abs(R - C)",
        "paragrafo": "mat-fa.p6.b2.s4"
      },
      {
        "letra": "D",
        "texto": "",
        "imagem": {
          "src": "conteudo/img/enem-2020-175-d.png",
          "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até cerca de 47 perto de 11 itens, desce até 10 com 25 itens e sobe para 35 com 30 itens.",
          "altFonte": "equipe"
        },
        "falta": "Escolheu o desenho do custo, uma das curvas dadas. O lucro é uma terceira curva: receita menos custo em cada ponto.",
        "expr": "C",
        "exprTeste": "C",
        "paragrafo": "mat-fa.p6.b2.s3"
      },
      {
        "letra": "E",
        "texto": "",
        "imagem": {
          "src": "conteudo/img/enem-2020-175-e.png",
          "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até 50 perto de 24 itens e desce um pouco, para 45, com 30 itens.",
          "altFonte": "equipe"
        },
        "falta": "Escolheu o desenho da receita. Falta tirar o custo de cada ponto: receita − custo.",
        "expr": "R",
        "exprTeste": "R",
        "paragrafo": "mat-fa.p6.b2.s3"
      }
    ],
    "imagens": [
      {
        "src": "conteudo/img/enem-2020-175.png",
        "alt": "Descrição da equipe Prumo. Gráfico com duas curvas, sobre uma grade tracejada. Eixo horizontal: quantidade de itens produzidos, de 5 em 5, até 30. Eixo vertical: R$, de 5 em 5, de 0 a 55. A curva Receita, mais grossa, começa perto de 5 com 5 itens, sobe até cerca de 50 perto de 25 itens e desce para cerca de 45 com 30 itens. A curva Custo, mais fina, começa perto de 5 com 5 itens, sobe rápido até cerca de 45 com 10 itens, desce até cerca de 10 com 25 itens e sobe para cerca de 35 com 30 itens. As curvas se encontram com 5 itens e se cruzam perto de 15 itens, na altura de 40.",
        "altFonte": "equipe",
        "original": "https://enem.dev/2020/questions/175/33aa811b-1dc7-4083-a8c0-2aeeb9fd52d6.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      },
      {
        "src": "conteudo/img/enem-2020-175-a.png",
        "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −20 a 40, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, desce até −20 com 10 itens, volta a 0 com 15 itens, sobe até 40 com 25 itens e cai para 10 com 30 itens.",
        "altFonte": "equipe",
        "alternativa": "A",
        "original": "https://enem.dev/2020/questions/175/b3298ba7-589f-4ca3-a510-3cebdb9903cd.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      },
      {
        "src": "conteudo/img/enem-2020-175-b.png",
        "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −40 a 20, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 0 com 5 itens, sobe até cerca de 19 perto de 9 itens, volta a 0 com 15 itens, desce até um pouco abaixo de −40 perto de 24 itens e sobe para −10 com 30 itens.",
        "altFonte": "equipe",
        "alternativa": "B",
        "original": "https://enem.dev/2020/questions/175/fdcc74b5-e93d-42c8-9cce-7e018e43eb67.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      },
      {
        "src": "conteudo/img/enem-2020-175-c.png",
        "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva nunca fica abaixo de 0: começa em 0 com 5 itens, sobe até cerca de 18 perto de 10 itens, volta a 0 com 15 itens, sobe até cerca de 40 perto de 24 itens e cai para 10 com 30 itens.",
        "altFonte": "equipe",
        "alternativa": "C",
        "original": "https://enem.dev/2020/questions/175/8d380a8c-6b10-40a5-bafa-cfe75141c412.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      },
      {
        "src": "conteudo/img/enem-2020-175-d.png",
        "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até cerca de 47 perto de 11 itens, desce até 10 com 25 itens e sobe para 35 com 30 itens.",
        "altFonte": "equipe",
        "alternativa": "D",
        "original": "https://enem.dev/2020/questions/175/5c8b1402-d364-4c5f-beaa-559cb23d0891.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      },
      {
        "src": "conteudo/img/enem-2020-175-e.png",
        "alt": "Descrição da equipe Prumo. Gráfico com eixo vertical em R$, de −5 a 55, e eixo horizontal com a quantidade de itens produzidos, até 30. A curva começa em 5 com 5 itens, sobe até 50 perto de 24 itens e desce um pouco, para 45, com 30 itens.",
        "altFonte": "equipe",
        "alternativa": "E",
        "original": "https://enem.dev/2020/questions/175/f718a2fc-7a30-4e17-b4b3-28dfb028a6f5.png",
        "recorte": "Recorte da questão 175 (página 29 do PDF oficial do Enem 2020, 2º dia, Caderno Azul), renderizado em 3× com PyMuPDF em 17/11/2026: o gráfico do enunciado e o gráfico de cada alternativa, sem a letra. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf"
      }
    ],
    "atribuicao": "INEP · Enem 2020, 2º dia, Caderno Azul, questão 175 · CC BY-ND 3.0",
    "transcricao": "Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em 17/11/2026.",
    "licenca": "CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)",
    "licencaUrl": "https://creativecommons.org/licenses/by-nd/3.0/legalcode",
    "blocos": [
      "mat-fa.p6.b2"
    ],
    "modelo": "mat-fa.p6.b2.m",
    "explicacao": "Lucro = receita − custo, em cada quantidade. Com 5 itens as curvas se encontram: lucro 0. Entre 5 e 15 itens o custo fica acima: lucro negativo, perto de −20 com 10 itens. Perto de 15 itens elas se cruzam: 0 de novo. Depois a receita fica acima: o lucro chega a cerca de 40 com 25 itens e cai para perto de 10 com 30. Só o gráfico A tem esse desenho.",
    "exprCerta": "R - C",
    "teste": {
      "x": [
        5,
        10,
        15,
        20,
        25,
        30
      ],
      "R": [
        5.7,
        25.3,
        39.5,
        47.3,
        49.9,
        45.1
      ],
      "C": [
        5.6,
        45,
        39.8,
        19.7,
        10.5,
        35.1
      ],
      "leitura": {
        "A": [
          -0.2,
          -20.2,
          -0.1,
          28,
          40.3,
          9.8
        ],
        "B": [
          0,
          18.3,
          -0.2,
          -27.9,
          -40.6,
          -10
        ],
        "C": [
          0.3,
          18.3,
          1.2,
          29.4,
          39.4,
          9.9
        ],
        "D": [
          5,
          46,
          37.9,
          19.8,
          9.9,
          34.9
        ],
        "E": [
          4.8,
          26.4,
          40.4,
          48.2,
          49.8,
          45
        ]
      },
      "tolerancia": 3
    },
    "autoria": {
      "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
      "modelo": "Claude Opus 5.5",
      "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
      "data": "2026-11-17",
      "equipe": null,
      "revisor": null,
      "revisadoEm": null
    },
    "papel": "rodada"
  },
  {
    "id": "enem-2019-179",
    "ano": 2019,
    "dia": 2,
    "caderno": "Azul",
    "numero": 179,
    "area": "MT",
    "habilidade": "MT-H20",
    "capitulo": "mat-fa.c3",
    "inep": {
      "coItem": 111518,
      "coProva": 515,
      "a": 1.57287,
      "b": 1.15345,
      "c": 0.11072
    },
    "gabarito": "A",
    "gabaritoConferido": true,
    "conferidoITENS_PROVA": "2026-11-17",
    "textoConferidoPDF": "2026-11-17",
    "conferenciaPDF": {
      "pdf": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf",
      "sha256": "a476882608be2bf1353af8b26c60838ac187f2d1a3653524c90de62b0372efa6",
      "pagina": 31,
      "nota": "O PDF traz \"watt × minuto\" (sinal de multiplicação) e \"A sequência de deslocamentos\" (plural); a transcrição trazia \"watt x minuto\" (letra x) e \"deslocamento\". As alternativas conferem (as setas são desenhadas à parte no PDF; lidas na página renderizada). A imagem do enem.dev (648 × 228 px) foi trocada por recortes do PDF oficial: o gráfico e a planta, que no caderno ficam lado a lado, vão um embaixo do outro numa imagem só (881 × 1396 px), para os rótulos de potência ficarem legíveis na largura do celular. Só mudança de formato: nada foi redesenhado.",
      "correcoes": [
        {
          "campo": "contexto",
          "de": "em watt x minuto,",
          "para": "em watt × minuto,"
        },
        {
          "campo": "introducao",
          "de": "A sequência de deslocamento pelos cômodos",
          "para": "A sequência de deslocamentos pelos cômodos"
        }
      ]
    },
    "anulada": false,
    "contexto": "<p>Nos seis cômodos de uma casa há sensores de presença posicionados de forma que a luz de cada cômodo acende assim que uma pessoa nele adentra, e apaga assim que a pessoa se retira desse cômodo. Suponha que o acendimento e o desligamento sejam instantâneos.</p><p>O morador dessa casa visitou alguns desses cômodos, ficando exatamente um minuto em cada um deles. O gráfico descreve o consumo acumulado de energia, em watt × minuto, em função do tempo t, em minuto, das lâmpadas de LED dessa casa, enquanto a figura apresenta a planta baixa da casa, na qual os cômodos estão numerados de 1 a 6, com as potências das respectivas lâmpadas indicadas.</p><figure class=\"enem-img\"><img src=\"conteudo/img/enem-2019-179.png\" alt=\"Descrição da equipe Prumo. Em cima, gráfico de linha. Eixo horizontal: tempo, em minutos. Eixo vertical: energia, em W·min. A linha liga os pontos (0; 0), (1; 20), (2; 35), (3; 40), (4; 55), (5; 75), (6; 85), (7; 105) e (8; 120). Embaixo, planta baixa da casa com seis cômodos numerados: 1, sala, lâmpada de 20 W, onde fica a entrada; 2, quarto, 13 W; 3, banho, 2 W; 4, suíte, 15 W; 5, banho, 5 W; 6, cozinha, 10 W.\" loading=\"lazy\"></figure>",
    "introducao": "A sequência de deslocamentos pelos cômodos, conforme o consumo de energia apresentado no gráfico, é",
    "fonteMd": "Nos seis cômodos de uma casa há sensores de presença posicionados de forma que a luz de cada cômodo acende assim que uma pessoa nele adentra, e apaga assim que a pessoa se retira desse cômodo. Suponha que o acendimento e o desligamento sejam instantâneos.\n\nO morador dessa casa visitou alguns desses cômodos, ficando exatamente um minuto em cada um deles. O gráfico descreve o consumo acumulado de energia, em watt x minuto, em função do tempo t, em minuto, das lâmpadas de LED dessa casa, enquanto a figura apresenta a planta baixa da casa, na qual os cômodos estão numerados de 1 a 6, com as potências das respectivas lâmpadas indicadas.\n\n![](https://enem.dev/2019/questions/179/3c23edf9-5531-4ae5-b328-9b0a6b31fdc1.png)",
    "materialDeTerceiros": null,
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 → 4 → 5 → 4 → 1 → 6 → 1 → 4"
      },
      {
        "letra": "B",
        "texto": "1 → 2 → 3 → 1 → 4 → 1 → 4 → 4",
        "falta": "Conferiu só o total: as lâmpadas somam 120, igual ao fim do gráfico. Minuto a minuto não bate: no 2º minuto o gráfico sobe 15 (de 20 para 35), e o quarto (2) tem 13 W.",
        "exprTeste": "[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]",
        "esperado": [
          120,
          8,
          2
        ],
        "paragrafo": "mat-fa.p6.b1.s2"
      },
      {
        "letra": "C",
        "texto": "1 → 4 → 5 → 4 → 1 → 6 → 1 → 2 → 3",
        "falta": "A sequência tem 9 paradas, mas o gráfico vai até t = 8: são 8 minutos, uma parada por minuto. O último minuto sobe 15 de uma vez (de 105 para 120): é uma lâmpada só, de 15 W, e não 13 + 2.",
        "exprTeste": "[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]",
        "esperado": [
          120,
          9,
          8
        ],
        "paragrafo": "mat-fa.p6.b1.s2"
      },
      {
        "letra": "D",
        "texto": "1 → 2 → 3 → 5 → 4 → 1 → 6 → 1 → 4",
        "falta": "São 9 paradas (uma por minuto) para 8 minutos. O 2º minuto sobe 15 de uma vez (de 20 para 35): é a suíte, de 15 W, e não o quarto (2) e o banho (3) em dois minutos (13 + 2).",
        "exprTeste": "[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]",
        "esperado": [
          120,
          9,
          2
        ],
        "paragrafo": "mat-fa.p6.b1.s2"
      },
      {
        "letra": "E",
        "texto": "1 → 4 → 2 → 3 → 5 → 1 → 6 → 1 → 4",
        "falta": "São 9 paradas (uma por minuto) para 8 minutos. No 3º e no 4º minutos o gráfico sobe 5 e depois 15, 20 no total; a sequência põe ali três cômodos, 13 + 2 + 5 = 20, no lugar de dois.",
        "exprTeste": "[somaPotencias(alt), comodos(alt), primeiroMinutoDiferente(alt)]",
        "esperado": [
          120,
          9,
          3
        ],
        "paragrafo": "mat-fa.p6.b1.s2"
      }
    ],
    "imagens": [
      {
        "src": "conteudo/img/enem-2019-179.png",
        "alt": "Descrição da equipe Prumo. Em cima, gráfico de linha. Eixo horizontal: tempo, em minutos. Eixo vertical: energia, em W·min. A linha liga os pontos (0; 0), (1; 20), (2; 35), (3; 40), (4; 55), (5; 75), (6; 85), (7; 105) e (8; 120). Embaixo, planta baixa da casa com seis cômodos numerados: 1, sala, lâmpada de 20 W, onde fica a entrada; 2, quarto, 13 W; 3, banho, 2 W; 4, suíte, 15 W; 5, banho, 5 W; 6, cozinha, 10 W.",
        "altFonte": "equipe",
        "original": "https://enem.dev/2019/questions/179/3c23edf9-5531-4ae5-b328-9b0a6b31fdc1.png",
        "recorte": "Recortes do gráfico e da planta baixa da questão 179 (página 31 do PDF oficial do Enem 2019, 2º dia, Caderno Azul), renderizados com PyMuPDF em 17/11/2026 (gráfico em 4×, planta em cerca de 4,4×, as duas com a mesma largura) e postos um embaixo do outro, e não lado a lado como no caderno. Só mudança de formato.",
        "recortePDF": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf"
      }
    ],
    "atribuicao": "INEP · Enem 2019, 2º dia, Caderno Azul, questão 179 · CC BY-ND 3.0",
    "transcricao": "Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em 17/11/2026; onde a transcrição diferia do PDF, vale o PDF.",
    "licenca": "CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)",
    "licencaUrl": "https://creativecommons.org/licenses/by-nd/3.0/legalcode",
    "blocos": [
      "mat-fa.p6.b1"
    ],
    "modelo": "mat-fa.p6.m",
    "explicacao": "No gráfico acumulado, a subida de cada minuto é a potência da lâmpada acesa naquele minuto. As subidas são 20, 15, 5, 15, 20, 10, 20 e 15. Pela planta, 20 W é a sala (1), 15 W a suíte (4), 5 W o banho do cômodo 5 e 10 W a cozinha (6). Sequência: 1 (sala) → 4 (suíte) → 5 (banho) → 4 → 1 → 6 (cozinha) → 1 → 4.",
    "exprCerta": "sequenciaPelasSubidas()",
    "teste": {
      "acumulado": [
        0,
        20,
        35,
        40,
        55,
        75,
        85,
        105,
        120
      ],
      "potencia": {
        "1": 20,
        "2": 13,
        "3": 2,
        "4": 15,
        "5": 5,
        "6": 10
      }
    },
    "autoria": {
      "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
      "modelo": "Claude Opus 5.5",
      "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
      "data": "2026-11-17",
      "equipe": null,
      "revisor": null,
      "revisadoEm": null
    },
    "papel": "rodada"
  },
  {
    "id": "enem-2021-164",
    "ano": 2021,
    "dia": 2,
    "caderno": "Azul",
    "numero": 164,
    "area": "MT",
    "habilidade": "MT-H22",
    "capitulo": "mat-fa.c4",
    "inep": {
      "coItem": 111521,
      "coProva": 899,
      "a": 1.02386,
      "b": 0.77599,
      "c": 0.14727
    },
    "gabarito": "B",
    "gabaritoConferido": true,
    "conferidoITENS_PROVA": "2026-11-17",
    "textoConferidoPDF": "2026-11-17",
    "conferenciaPDF": {
      "pdf": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD7.pdf",
      "sha256": "887b2a10ebb163f0c40db2ab4f67a5a4b5959ceb74ce7273466a755b8e55f540",
      "pagina": 28,
      "nota": "O PDF traz \"até 10 kg\", com espaço, como nas outras duas vezes em que a massa aparece; a transcrição trazia \"até 10kg\". No PDF, a coluna Viagem da tabela usa fonte sem mapa Unicode: \"I\" e \"II\" foram lidos na página renderizada e conferem com a imagem do enem.dev, que foi mantida (nítida, 452 × 103 px).",
      "correcoes": [
        {
          "campo": "contexto",
          "de": "mala com até 10kg.",
          "para": "mala com até 10 kg."
        }
      ]
    },
    "anulada": false,
    "contexto": "<p>Uma pessoa pretende viajar por uma companhia aérea que despacha gratuitamente uma mala com até 10 kg.</p><p>Em duas viagens que realizou, essa pessoa utilizou a mesma mala e conseguiu 10 kg com as seguintes combinações de itens:</p><figure class=\"enem-img\"><img src=\"conteudo/img/enem-2021-164.png\" alt=\"Descrição da equipe Prumo. Tabela com as colunas Viagem, Camisetas, Calças e Sapatos. Viagem I: 12 camisetas, 4 calças e 3 sapatos. Viagem II: 18 camisetas, 3 calças e 2 sapatos.\" loading=\"lazy\"></figure><p>Para ter certeza de que sua bagagem terá massa de 10 kg, ela decide levar essa mala com duas calças, um sapato e o máximo de camisetas, admitindo que itens do mesmo tipo têm a mesma massa.</p>",
    "introducao": "Qual a quantidade máxima de camisetas que essa pessoa poderá levar?",
    "fonteMd": "Uma pessoa pretende viajar por uma companhia aérea que despacha gratuitamente uma mala com até 10kg.\n\nEm duas viagens que realizou, essa pessoa utilizou a mesma mala e conseguiu 10 kg com as seguintes combinações de itens:\n\n![](https://enem.dev/2021/questions/164/eab2c90e-a45f-482b-997d-a5c2f6931726.png)\n\nPara ter certeza de que sua bagagem terá massa de 10 kg, ela decide levar essa mala com duas calças, um sapato e o máximo de camisetas, admitindo que itens do mesmo tipo têm a mesma massa.",
    "materialDeTerceiros": null,
    "alternativas": [
      {
        "letra": "A",
        "texto": "22",
        "falta": "Contou o total de peças: da viagem I para a II ele sobe 4 (de 19 para 23), e 18 + 4 = 22. A troca é por tipo: entram 6 camisetas no lugar de 1 calça e 1 sapato.",
        "expr": "18 + ((18 + 3 + 2) - (12 + 4 + 3))",
        "paragrafo": "mat-fa.p8.b1.s2"
      },
      {
        "letra": "B",
        "texto": "24"
      },
      {
        "letra": "C",
        "texto": "26",
        "falta": "Achou as 24 camisetas e somou as 2 calças, como se a pergunta fosse de peças de roupa: 24 + 2 = 26. A pergunta é só de camisetas.",
        "expr": "18 + (18 - 12) + 2",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "letra": "D",
        "texto": "33",
        "falta": "Trocou por camisetas todas as calças e sapatos da viagem I (12 + 7 × 3 = 33). A mala nova ainda leva 2 calças e 1 sapato: parta da viagem II e faça uma troca só.",
        "expr": "12 + 3*(4 + 3)",
        "paragrafo": "mat-fa.p8.b2.s4"
      },
      {
        "letra": "E",
        "texto": "39",
        "falta": "Misturou as viagens: as camisetas da II com as calças e os sapatos da I (18 + 7 × 3 = 39). Parta de uma viagem só e faça a troca uma vez.",
        "expr": "18 + 3*(4 + 3)",
        "paragrafo": "mat-fa.p8.b1.s3"
      }
    ],
    "imagens": [
      {
        "src": "conteudo/img/enem-2021-164.png",
        "alt": "Descrição da equipe Prumo. Tabela com as colunas Viagem, Camisetas, Calças e Sapatos. Viagem I: 12 camisetas, 4 calças e 3 sapatos. Viagem II: 18 camisetas, 3 calças e 2 sapatos.",
        "altFonte": "equipe",
        "original": "https://enem.dev/2021/questions/164/eab2c90e-a45f-482b-997d-a5c2f6931726.png"
      }
    ],
    "atribuicao": "INEP · Enem 2021, 2º dia, Caderno Azul, questão 164 · CC BY-ND 3.0",
    "transcricao": "Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em 17/11/2026; onde a transcrição diferia do PDF, vale o PDF.",
    "licenca": "CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)",
    "licencaUrl": "https://creativecommons.org/licenses/by-nd/3.0/legalcode",
    "blocos": [
      "mat-fa.p8.b1",
      "mat-fa.p8.b2"
    ],
    "modelo": "mat-fa.p8.m",
    "explicacao": "Da viagem I para a II entraram 6 camisetas e saíram 1 calça e 1 sapato, e a massa continuou 10 kg: 1 calça + 1 sapato pesam o mesmo que 6 camisetas. A mala nova tem 2 calças e 1 sapato, ou seja, 1 calça e 1 sapato a menos que na viagem II. Mais uma troca: 18 + 6 = 24 camisetas. Pela viagem I dá o mesmo: tirar 2 calças e 2 sapatos libera 12 camisetas, e 12 + 12 = 24.",
    "exprCerta": "18 + (18 - 12)",
    "teste": {},
    "autoria": {
      "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
      "modelo": "Claude Opus 5.5",
      "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
      "data": "2026-11-17",
      "equipe": null,
      "revisor": null,
      "revisadoEm": null
    },
    "papel": "rodada"
  },
  {
    "id": "enem-2023-175",
    "ano": 2023,
    "dia": 2,
    "caderno": "Azul",
    "numero": 175,
    "area": "MT",
    "habilidade": "MT-H21",
    "capitulo": "mat-fa.c4",
    "inep": {
      "coItem": 85504,
      "coProva": 1211,
      "a": 2.21375,
      "b": 1.82985,
      "c": 0.15414
    },
    "gabarito": "B",
    "gabaritoConferido": true,
    "conferidoITENS_PROVA": "2026-11-17",
    "textoConferidoPDF": "2026-11-17",
    "conferenciaPDF": {
      "pdf": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf",
      "sha256": "49e7ad9d0ab25710f6e5c4c3296fc40b63d86a3a87d5f25d83e8ecc81b98415b",
      "pagina": 29,
      "nota": "Igual ao PDF.",
      "correcoes": []
    },
    "anulada": false,
    "contexto": "<p>O metrô de um município oferece dois tipos de tíquetes com colorações diferentes, azul e vermelha, sendo vendidos em cartelas, cada qual com nove tíquetes da mesma cor e mesmo valor unitário. Duas cartelas de tíquetes azuis e uma cartela de tíquetes vermelhos são vendidas por R$ 32,40. Sabe-se que o preço de um tíquete azul menos o preço de um tíquete vermelho é igual ao preço de um tíquete vermelho mais cinco centavos.</p>",
    "introducao": "Qual o preço, em real, de uma cartela de tíquetes vermelhos?",
    "fonteMd": "O metrô de um município oferece dois tipos de tíquetes com colorações diferentes, azul e vermelha, sendo vendidos em cartelas, cada qual com nove tíquetes da mesma cor e mesmo valor unitário. Duas cartelas de tíquetes azuis e uma cartela de tíquetes vermelhos são vendidas por R$ 32,40. Sabe-se que o preço de um tíquete azul menos o preço de um tíquete vermelho é igual ao preço de um tíquete vermelho mais cinco centavos.",
    "materialDeTerceiros": null,
    "alternativas": [
      {
        "letra": "A",
        "texto": "4,68",
        "falta": "Leu cinco centavos como R$ 0,50. Cinco centavos são R$ 0,05.",
        "expr": "9*((3.60 - 2*0.50)/5)",
        "paragrafo": "mat-fa.p7.b1.s3"
      },
      {
        "letra": "B",
        "texto": "6,30"
      },
      {
        "letra": "C",
        "texto": "9,30",
        "falta": "Contou uma cartela azul só e leu cinco centavos como R$ 0,50. São duas cartelas azuis, e cinco centavos são R$ 0,05.",
        "expr": "9*((3.60 - 0.50)/3)",
        "paragrafo": "mat-fa.p7.b1.s3"
      },
      {
        "letra": "D",
        "texto": "10,50",
        "falta": "Leu como “azul = vermelho + 5 centavos”. A frase diz azul − vermelho = vermelho + 0,05, ou seja, azul = 2 × vermelho + 0,05.",
        "expr": "9*((3.60 - 2*0.05)/3)",
        "paragrafo": "mat-fa.p7.b1.s2"
      },
      {
        "letra": "E",
        "texto": "10,65",
        "falta": "Contou uma cartela azul só. A compra tem duas cartelas azuis e uma vermelha.",
        "expr": "9*((3.60 - 0.05)/3)",
        "paragrafo": "mat-fa.p7.b1.s3"
      }
    ],
    "imagens": [],
    "atribuicao": "INEP · Enem 2023, 2º dia, Caderno Azul, questão 175 · CC BY-ND 3.0",
    "transcricao": "Transcrição do projeto enem.dev (commit 938c56f), conferida com o PDF oficial do INEP em 17/11/2026.",
    "licenca": "CC BY-ND 3.0 (rodapé do portal do INEP; interpretação da equipe, e.1)",
    "licencaUrl": "https://creativecommons.org/licenses/by-nd/3.0/legalcode",
    "blocos": [
      "mat-fa.p7.b1"
    ],
    "modelo": "mat-fa.p7.m",
    "explicacao": "Chame de a o valor, em reais, de cada tíquete azul, e de v o de cada tíquete vermelho. Cada cartela tem 9 tíquetes. Duas cartelas azuis e uma vermelha: 18a + 9v = 32,40, então 2a + v = 3,60. A frase da diferença: a − v = v + 0,05, ou seja, a = 2v + 0,05. Substituindo: 2(2v + 0,05) + v = 3,60, então 5v + 0,10 = 3,60 e v = 0,70. A cartela vermelha custa 9 × 0,70 = R$ 6,30. Confere: a = 1,45 e 18 × 1,45 + 9 × 0,70 = 26,10 + 6,30 = 32,40.",
    "exprCerta": "9*((3.60 - 2*0.05)/5)",
    "teste": {},
    "autoria": {
      "ia": "Claude Opus 5.5 (Anthropic), via Claude Code, em 17/11/2026",
      "modelo": "Claude Opus 5.5",
      "ferramenta": "Claude Opus 5.5 (Anthropic), via Claude Code",
      "data": "2026-11-17",
      "equipe": null,
      "revisor": null,
      "revisadoEm": null
    },
    "papel": "rodada"
  }
];

export default { capitulos: capitulos34, modelos: modelos34, questoes: questoes34 };
