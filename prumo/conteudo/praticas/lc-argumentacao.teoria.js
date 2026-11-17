export const teoria = {
  id: 'lc-argumentacao',
  titulo: 'Argumentação e recursos expressivos',
  porQueCai: 'O Enem pede para reconhecer a tese de artigos e anúncios, o tipo de argumento usado, o sentido dos conectivos e o efeito de figuras como ironia e metáfora.',
  secoes: [
    {
      titulo: 'Tese e argumentos',
      paragrafos: [
        'Um texto argumentativo defende uma tese, isto é, uma opinião sobre um tema. Os argumentos são as razões que sustentam essa opinião.',
        'A estrutura mais comum tem introdução com a tese, desenvolvimento com os argumentos e conclusão que retoma a ideia central. É a mesma estrutura da redação do Enem.',
        'Para achar a tese, pergunte: o que o autor quer que eu passe a pensar depois de ler? Ela costuma aparecer no início ou no fim do texto.',
      ],
    },
    {
      titulo: 'Tipos de argumento',
      paragrafos: [
        'Argumento de autoridade cita um especialista ou uma instituição reconhecida. Argumento por dados usa números e pesquisas. Argumento por exemplificação apresenta um caso concreto.',
        'Argumento de causa e consequência mostra que um fato provoca outro. Argumento por comparação aproxima duas situações para mostrar semelhanças ou diferenças.',
        'Saber o nome do argumento ajuda, mas o mais importante é perceber o que ele faz no texto: dar credibilidade, provar com números ou tornar a ideia concreta.',
      ],
      exemplo: {
        enunciado: 'Leia: “A cidade precisa de mais ciclovias. Segundo um levantamento da secretaria de transportes, 40% das viagens no centro têm menos de 3 km, distância fácil de percorrer de bicicleta.” Que tipo de argumento sustenta a tese?',
        resolucao: [
          'A tese é a primeira frase: a cidade precisa de mais ciclovias.',
          'O apoio vem de um número (40%) obtido em uma pesquisa de um órgão público.',
          'Resposta: argumento por dados, reforçado pela autoridade da secretaria.',
        ],
      },
    },
    {
      titulo: 'Conectivos e o sentido entre as ideias',
      paragrafos: [
        'Conectivos ligam orações e indicam a relação lógica entre elas. Trocar um conectivo pode mudar todo o sentido do trecho.',
        'Os grupos principais são: oposição (mas, porém, contudo, no entanto); concessão (embora, apesar de, mesmo que); causa (porque, já que, visto que); conclusão (portanto, logo, por isso); adição (além disso, também); condição (se, caso).',
        'A concessão merece atenção. Em “Embora estivesse cansado, terminou o trabalho”, o cansaço é admitido, mas não impede a ação principal.',
      ],
      exemplo: {
        enunciado: 'Reescreva sem mudar o sentido: “A prefeitura ampliou as ciclovias, mas o número de ciclistas caiu.” Use um conectivo de concessão.',
        resolucao: [
          'A relação é de oposição: esperava-se aumento, mas houve queda.',
          'Na concessão, a ideia admitida vai para a oração com “embora”, e o verbo fica no subjuntivo.',
          'Resposta: “Embora a prefeitura tenha ampliado as ciclovias, o número de ciclistas caiu.”',
        ],
      },
    },
    {
      titulo: 'Figuras de linguagem e persuasão',
      paragrafos: [
        'Metáfora é uma comparação implícita (“aquela sala é um forno”); comparação usa “como” (“quente como um forno”). Metonímia troca um termo por outro com relação próxima (“li Machado de Assis”, isto é, a obra dele). Hipérbole é o exagero intencional (“já falei mil vezes”).',
        'Ironia diz o contrário do que se pensa para criticar (“que pontualidade”, para quem chegou atrasado). Eufemismo suaviza uma ideia (“ele partiu” no lugar de “ele morreu”). Antítese aproxima palavras opostas, e personificação atribui ações humanas a seres não humanos.',
        'Em anúncios e campanhas, essas figuras servem para persuadir. O Enem pergunta qual efeito o recurso produz: humor, crítica, emoção ou destaque de uma ideia.',
      ],
    },
  ],
  armadilhas: [
    'Confundir o tema com a tese: o tema é o assunto; a tese é a opinião sobre ele.',
    'Trocar um conectivo por outro de sentido diferente, como “portanto” no lugar de “porém”.',
    'Ler uma ironia ao pé da letra e entender elogio onde há crítica.',
    'Classificar como argumento de autoridade uma simples opinião de alguém sem relação com o assunto.',
  ],
  resumo: [
    'Tese é a opinião defendida; argumentos são as razões que a sustentam.',
    'Tipos de argumento: autoridade, dados, exemplificação, causa e consequência, comparação.',
    'Conectivos indicam relações: oposição, concessão, causa, conclusão, adição e condição.',
    'Metáfora compara sem “como”; ironia diz o contrário para criticar; hipérbole exagera.',
    'Pergunte sempre qual efeito o recurso produz no leitor.',
  ],
  pergunta: {
    enunciado: 'Qual conectivo completa a frase com sentido adequado: “Ele estudou muito, ___ não conseguiu a nota que queria.”?',
    alternativas: { A: 'porque', B: 'portanto', C: 'porém', D: 'além disso' },
    certa: 'C',
    porque: 'A segunda ideia contraria o que se esperava da primeira. Essa relação de oposição é expressa por “porém”.',
  },
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
