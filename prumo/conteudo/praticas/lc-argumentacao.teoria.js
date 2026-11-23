// Teoria do tópico de prática lc-argumentacao.
// Texto da equipe Prumo (CC BY-SA 4.0), com base nos verbetes "Argumentação", "Conjunção" e "Figura de linguagem" da Wikipédia
// (CC BY-SA 4.0) e no capítulo "Retórica e argumentação/Os 5 Cânones da Retórica/Arranjo" do Wikilivros (CC BY-SA 3.0).
// Exemplos: textos curtos criados pela equipe e trechos em domínio público (Luís de Camões, Machado de Assis), com autor e obra citados.
export const teoria = {
  id: 'lc-argumentacao',
  titulo: 'Argumentação e recursos expressivos',
  porQueCai: 'O Enem pede para reconhecer a tese de artigos e anúncios, o tipo de argumento usado, o sentido dos conectivos e o efeito de figuras como ironia e metáfora.',
  termos: [
    { termo: 'Tese', def: 'A opinião que o texto defende sobre um tema.' },
    { termo: 'Argumento', def: 'Razão apresentada para sustentar a tese, como um dado, um exemplo ou a fala de um especialista.' },
    { termo: 'Conectivo', def: 'Palavra ou expressão que liga ideias e mostra a relação entre elas, como “mas” ou “portanto”.' },
    { termo: 'Concessão', def: 'Relação em que se admite um fato contrário que não impede a ideia principal, como em “embora”.' },
    { termo: 'Ironia', def: 'Recurso que diz o contrário do que se pensa, em geral para criticar.' },
  ],
  habilidades: [
    { codigo: 'H18', descricao: 'Identificar os elementos que concorrem para a progressão temática e para a organização e estruturação de textos de diferentes gêneros e tipos.' },
    { codigo: 'H21', descricao: 'Reconhecer em textos de diferentes gêneros, recursos verbais e não-verbais utilizados com a finalidade de criar e mudar comportamentos e hábitos.' },
    { codigo: 'H22', descricao: 'Relacionar, em diferentes textos, opiniões, temas, assuntos e recursos linguísticos.' },
    { codigo: 'H23', descricao: 'Inferir em um texto quais são os objetivos de seu produtor e quem é seu público alvo, pela análise dos procedimentos argumentativos utilizados.' },
    { codigo: 'H24', descricao: 'Reconhecer no texto estratégias argumentativas empregadas para o convencimento do público, tais como a intimidação, sedução, comoção, chantagem, entre outras.' },
  ],
  secoes: [
    {
      titulo: 'Tese e argumentos',
      imagem: {src: "./conteudo/praticas/img/ap-cicero.jpg",alt: "Pintura de um salão romano com senadores sentados em semicírculo; um orador de pé, à esquerda, aponta para um homem sentado sozinho à direita.",legenda: "Cícero discursa contra Catilina no Senado romano. Na argumentação há sempre uma tese (Catilina conspira), quem a defende, o oponente e o público que precisa ser convencido.",credito: "Cesare Maccari, Cícero denuncia Catilina, 1889. Domínio público. Wikimedia Commons."},
      paragrafos: [
        'Um texto argumentativo defende uma tese, isto é, uma opinião sobre um tema. Os argumentos são as razões que sustentam essa opinião.',
        'A estrutura mais comum tem introdução com a tese, desenvolvimento com os argumentos e conclusão que retoma a ideia central. É a mesma estrutura da redação do Enem.',
        'Para achar a tese, pergunte: o que o autor quer que eu passe a pensar depois de ler? Ela costuma aparecer no início ou no fim do texto.',
      ],
      exemplo: {
        enunciado: 'Leia este texto, criado pela equipe: “Muita gente acha que celular na sala de aula só atrapalha. Na nossa escola, porém, os alunos usam o aparelho para consultar dicionários e gravar experiências de Ciências. Proibir de vez seria jogar fora uma ferramenta útil. O caminho é combinar regras de uso.” Qual é a tese, e o que a primeira frase faz no texto?',
        resolucao: [
          'A primeira frase apresenta uma opinião contrária, a de que o celular só atrapalha. O autor a cita para depois rebatê-la.',
          'O conectivo “porém” marca a virada para a posição do autor.',
          'Os argumentos são o uso em dicionários e nas experiências, um caso concreto da escola.',
          'Tese: o celular não deve ser proibido, mas usado com regras. Ela aparece no fim do texto.',
        ],
      },
      atencao: 'A tese quase nunca vem anunciada como tal; as questões pedem que você a reconheça em artigos, anúncios ou crônicas e não a confunda com uma opinião que o autor cita para rebater.',
      confira: {
        pergunta: 'O que diferencia a tese do tema?',
        opcoes: ['A tese é a opinião defendida; o tema é o assunto.', 'A tese é o título; o tema é a conclusão.', 'Não há diferença, são sinônimos.'],
        certa: 0,
        porque: 'O tema diz sobre o que o texto fala. A tese diz o que o autor pensa sobre esse assunto.',
      },
    },
    {
      titulo: 'Tipos de argumento',
      paragrafos: [
        'Argumento de autoridade cita um especialista ou uma instituição reconhecida. Argumento por dados usa números e pesquisas. Argumento por exemplificação apresenta um caso concreto.',
        'Argumento de causa e consequência mostra que um fato provoca outro. Argumento por comparação aproxima duas situações para mostrar semelhanças ou diferenças.',
        'Saber o nome do argumento ajuda, mas o mais importante é perceber o que ele faz no texto: dar credibilidade, provar com números ou tornar a ideia concreta.',
      ],
      tabela: {
        cabecalho: ['Tipo de argumento', 'O que faz', 'Exemplo (criado pela equipe)'],
        linhas: [
          ['autoridade', 'dá credibilidade com a voz de quem entende do assunto', '“Nutricionistas recomendam beber água ao longo de todo o dia.”'],
          ['dados', 'prova com números e pesquisas', '“Em uma pesquisa com 500 alunos, 7 em cada 10 disseram dormir menos de 7 horas.”'],
          ['exemplificação', 'torna a ideia concreta com um caso', '“Na escola do bairro, a horta comunitária reduziu o desperdício de merenda.”'],
          ['causa e consequência', 'mostra que um fato provoca outro', '“Sem árvores, o asfalto esquenta mais, e a cidade fica mais quente.”'],
          ['comparação', 'aproxima duas situações', '“Assim como o corpo precisa de treino, a leitura melhora com a prática diária.”'],
        ],
        legenda: 'Tabela 1. Os tipos de argumento mais cobrados, com um exemplo de cada.',
      },
      exemplo: {
        enunciado: 'Leia: “A cidade precisa de mais ciclovias. Segundo um levantamento da secretaria de transportes, 40% das viagens no centro têm menos de 3 km, distância fácil de percorrer de bicicleta.” Que tipo de argumento sustenta a tese?',
        resolucao: [
          'A tese é a primeira frase: a cidade precisa de mais ciclovias.',
          'O apoio vem de um número (40%) obtido em uma pesquisa de um órgão público.',
          'Resposta: argumento por dados, reforçado pela autoridade da secretaria.',
        ],
      },
      atencao: 'O comando pede a estratégia usada para convencer o público, e as alternativas misturam nomes parecidos; identifique o que o trecho faz, como citar alguém, mostrar números ou contar um caso.',
      confira: {
        pergunta: '“Segundo a Organização Mundial da Saúde, a vacina é segura.” Que argumento é esse?',
        opcoes: ['comparação', 'exemplificação', 'autoridade'],
        certa: 2,
        porque: 'A frase se apoia em uma instituição reconhecida na área da saúde. Isso é argumento de autoridade.',
      },
    },
    {
      titulo: 'Conectivos e o sentido entre as ideias',
      paragrafos: [
        'Conectivos ligam orações e indicam a relação lógica entre elas. Trocar um conectivo pode mudar todo o sentido do trecho.',
        'Os grupos principais são: oposição (mas, porém, contudo, no entanto); concessão (embora, apesar de, mesmo que); causa (porque, já que, visto que); conclusão (portanto, logo, por isso); adição (além disso, também); condição (se, caso).',
        'A concessão merece atenção. Em “Embora estivesse cansado, terminou o trabalho”, o cansaço é admitido, mas não impede a ação principal.',
      ],
      tabela: {
        cabecalho: ['Relação', 'Conectivos', 'Exemplo'],
        linhas: [
          ['oposição', 'mas, porém, contudo, no entanto', '“Choveu, mas o jogo continuou.”'],
          ['concessão', 'embora, apesar de, mesmo que', '“Embora chovesse, o jogo continuou.”'],
          ['causa', 'porque, já que, visto que', '“O jogo parou porque o campo alagou.”'],
          ['conclusão', 'portanto, logo, por isso', '“O campo alagou; portanto, o jogo parou.”'],
          ['adição', 'e, além disso, também', '“Choveu e, além disso, ventou forte.”'],
          ['condição', 'se, caso, desde que', '“Se chover, o jogo será adiado.”'],
        ],
        legenda: 'Tabela 2. Relações entre ideias e os conectivos que as expressam. Note que “embora” pede o verbo no subjuntivo.',
      },
      exemplo: {
        enunciado: 'Reescreva sem mudar o sentido: “A prefeitura ampliou as ciclovias, mas o número de ciclistas caiu.” Use um conectivo de concessão.',
        resolucao: [
          'A relação é de oposição: esperava-se aumento, mas houve queda.',
          'Na concessão, a ideia admitida vai para a oração com “embora”, e o verbo fica no subjuntivo.',
          'Resposta: “Embora a prefeitura tenha ampliado as ciclovias, o número de ciclistas caiu.”',
        ],
      },
      atencao: 'Questões de conectivo pedem o sentido de uma palavra destacada ou uma reescrita que mantenha o sentido; troque o conectivo pelo de cada alternativa e veja se a relação continua a mesma.',
      confira: {
        pergunta: 'Em “Já que a ponte caiu, o ônibus mudou de rota”, o conectivo indica:',
        opcoes: ['causa', 'oposição', 'condição'],
        certa: 0,
        porque: 'A queda da ponte é o motivo da mudança de rota. “Já que” expressa causa, como “porque” e “visto que”.',
      },
    },
    {
      titulo: 'Figuras de linguagem e persuasão',
      paragrafos: [
        'Metáfora é uma comparação implícita (“aquela sala é um forno”); comparação usa “como” (“quente como um forno”). Metonímia troca um termo por outro com relação próxima (“li Machado de Assis”, isto é, a obra dele). Hipérbole é o exagero intencional (“já falei mil vezes”).',
        'Ironia diz o contrário do que se pensa para criticar (“que pontualidade”, para quem chegou atrasado). Eufemismo suaviza uma ideia (“ele partiu” no lugar de “ele morreu”). Antítese aproxima palavras opostas, e personificação atribui ações humanas a seres não humanos.',
        'Em anúncios e campanhas, essas figuras servem para persuadir. O Enem pergunta qual efeito o recurso produz: humor, crítica, emoção ou destaque de uma ideia.',
      ],
      tabela: {
        cabecalho: ['Figura', 'Como reconhecer', 'Efeito mais comum'],
        linhas: [
          ['metáfora', 'comparação sem “como”', 'imagem forte, sentido novo'],
          ['hipérbole', 'exagero proposital', 'ênfase, humor'],
          ['ironia', 'diz o contrário do que pensa', 'crítica, humor'],
          ['eufemismo', 'troca uma palavra dura por outra mais suave', 'suavizar, ser delicado'],
          ['antítese', 'palavras de sentido oposto lado a lado', 'contraste, tensão'],
          ['personificação', 'ser não humano age ou sente como gente', 'aproximar, emocionar'],
        ],
        legenda: 'Tabela 3. Figuras de linguagem frequentes e o efeito que costumam produzir.',
      },
      exemplos: [
        {
          enunciado: 'Em um soneto de Luís de Camões (século XVI), lê-se: “Amor é fogo que arde sem se ver; / é ferida que dói, e não se sente; / é um contentamento descontente”. Que figuras aparecem e que efeito produzem?',
          resolucao: [
            '“Amor é fogo” e “amor é ferida” são metáforas: o amor é comparado a fogo e a ferida sem o uso de “como”.',
            '“Dói, e não se sente” e “contentamento descontente” juntam ideias opostas. São antíteses, e a segunda chega ao paradoxo, uma afirmação que parece impossível.',
            'Efeito: mostrar que o amor é contraditório, difícil de explicar pela lógica.',
          ],
        },
        {
          enunciado: 'Machado de Assis abre Memórias póstumas de Brás Cubas (1881) com esta dedicatória: “Ao verme que primeiro roeu as frias carnes do meu cadáver dedico como saudosa lembrança estas Memórias Póstumas.” Que recurso torna o trecho surpreendente?',
          resolucao: [
            'Dedicatórias costumam homenagear pessoas queridas, com carinho.',
            'Aqui, o homenageado é um verme, e a “saudosa lembrança” vai para quem roeu o corpo do narrador.',
            'O narrador usa o tom de homenagem para dizer algo nada afetuoso. Há ironia, com humor sombrio.',
            'Efeito: avisar ao leitor que o livro vai tratar a vida e a morte com deboche.',
          ],
        },
      ],
      atencao: 'Raramente a prova pede só o nome da figura; ela pergunta que efeito de sentido o recurso cria, como crítica, humor, ênfase ou emoção, em anúncios, poemas e crônicas.',
      confira: {
        pergunta: 'Alguém chega duas horas atrasado e ouve: “Chegou cedo, hein”. A figura é:',
        opcoes: ['hipérbole', 'ironia', 'metonímia'],
        certa: 1,
        porque: 'A frase diz o contrário do que o falante pensa, para criticar o atraso. Isso é ironia.',
      },
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
  fontes: [
    { titulo: 'Wikipédia, Argumentação', url: 'https://pt.wikipedia.org/wiki/Argumenta%C3%A7%C3%A3o', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Conjunção', url: 'https://pt.wikipedia.org/wiki/Conjun%C3%A7%C3%A3o_(gram%C3%A1tica)', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Figura de linguagem', url: 'https://pt.wikipedia.org/wiki/Figura_de_linguagem', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikilivros, Retórica e argumentação/Os 5 Cânones da Retórica/Arranjo', url: 'https://pt.wikibooks.org/w/index.php?oldid=447166', revisao: '447166 (23/08/2017)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H18, H21, H22, H23 e H24)', url: 'https://download.inep.gov.br/download/enem/matriz_referencia.pdf', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Texto da equipe Prumo em CC BY-SA 4.0, com base nos verbetes Argumentação, Conjunção e Figura de linguagem da Wikipédia (CC BY-SA 4.0) e no capítulo Arranjo do livro Retórica e argumentação do Wikilivros (CC BY-SA 3.0; autores: ver o histórico de cada página). Os exemplos usam textos criados pela equipe e trechos em domínio público de Luís de Camões (soneto “Amor é fogo que arde sem se ver”) e Machado de Assis (Memórias póstumas de Brás Cubas).',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
