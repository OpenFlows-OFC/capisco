export const teoria = {
  id: 'lc-interpretacao',
  titulo: 'Interpretação de texto e gêneros',
  porQueCai: 'Quase toda questão de Linguagens começa com um texto, como notícia, crônica, tirinha, anúncio ou poema, e pergunta qual é a sua finalidade, o seu gênero ou o que se pode concluir a partir dele.',
  secoes: [
    {
      titulo: 'Tema, tese e finalidade',
      paragrafos: [
        'Tema é o assunto do texto. Tese é a posição que o autor defende sobre esse assunto, quando o texto é opinativo.',
        'Finalidade é o que o texto pretende fazer com o leitor: informar, convencer, orientar, divertir ou emocionar. Muitas questões do Enem perguntam exatamente isso, com palavras como “objetivo”, “intenção” ou “função social”.',
        'Uma boa estratégia é ler primeiro o comando da questão e depois o texto. Assim você sabe o que procurar durante a leitura.',
      ],
    },
    {
      titulo: 'O que está escrito, o que se pode inferir e o que é invenção',
      paragrafos: [
        'Informação explícita é a que aparece escrita no texto. Inferência é uma conclusão que não está escrita, mas que o texto permite tirar com segurança.',
        'Extrapolação é ir além do texto, afirmando algo que ele não autoriza. Alternativas com extrapolação parecem razoáveis, mas não têm apoio no que foi lido.',
        'Para testar uma alternativa, pergunte: qual trecho do texto comprova isso? Se não houver trecho, desconfie.',
      ],
      exemplo: {
        enunciado: 'Leia: “Depois de três dias de chuva, Dona Lúcia finalmente estendeu a roupa no varal do quintal.” Qual das conclusões é uma inferência válida: (1) o tempo melhorou; (2) Dona Lúcia não tem máquina de secar; (3) o varal fica no quintal?',
        resolucao: [
          'A conclusão 3 é informação explícita: o texto diz “no varal do quintal”.',
          'A conclusão 1 é inferência válida: a palavra “finalmente” e o fim da chuva indicam que ela esperava um tempo melhor para secar a roupa.',
          'A conclusão 2 é extrapolação: o texto não diz nada sobre outros eletrodomésticos.',
          'Resposta: a inferência válida é a 1.',
        ],
      },
    },
    {
      titulo: 'Gênero textual e tipo textual',
      paragrafos: [
        'Gênero textual é a forma concreta que o texto assume na vida social: notícia, crônica, receita, anúncio, carta, bula, charge, artigo de opinião, entre muitos outros. Cada gênero tem uma finalidade, um público, um suporte e uma estrutura típicos.',
        'Tipo textual é o modo de organização da linguagem dentro do texto. Os principais são narração (conta fatos em sequência), descrição (caracteriza), dissertação (expõe ou argumenta) e injunção (orienta o leitor a fazer algo, com verbos no imperativo).',
        'Um mesmo gênero pode misturar tipos. Uma crônica pode narrar um fato do cotidiano e, no final, refletir sobre ele.',
      ],
      exemplo: {
        enunciado: 'No elevador de um prédio, está afixado: “Senhores moradores, a partir de segunda-feira a coleta de recicláveis será feita às terças e sextas. Separem o material limpo e seco.” Identifique o gênero, a finalidade e o tipo textual predominante.',
        resolucao: [
          'Gênero: aviso, um texto curto, afixado em local de circulação, dirigido a um grupo definido.',
          'Finalidade: informar uma mudança e orientar o comportamento dos moradores.',
          'Tipo predominante: injuntivo, marcado pelo verbo no imperativo “separem”, combinado com um trecho informativo.',
        ],
      },
    },
    {
      titulo: 'Textos com imagem e diálogo entre textos',
      paragrafos: [
        'Charges, tirinhas, cartazes e infográficos combinam linguagem verbal e não verbal. O sentido nasce da relação entre imagem e palavra, por isso observe expressões, cores, tamanho das letras e detalhes do cenário.',
        'A charge comenta, em geral com humor crítico, um fato da atualidade. A tirinha apresenta uma pequena narrativa em quadrinhos, muitas vezes com uma quebra de expectativa no último quadro.',
        'Intertextualidade é o diálogo de um texto com outro já conhecido, por citação, paródia ou alusão. Reconhecer o texto de origem ajuda a perceber a crítica ou o humor.',
      ],
    },
  ],
  armadilhas: [
    'Marcar uma alternativa verdadeira no mundo real, mas que o texto não sustenta.',
    'Escolher a alternativa que repete palavras do texto, mas muda o sentido do que foi dito.',
    'Responder sobre o tema quando a pergunta pede a finalidade, ou o contrário.',
    'Confundir gênero com tipo: a receita é um gênero; o modo injuntivo é o tipo que predomina nela.',
  ],
  resumo: [
    'Tema é o assunto; tese é a posição defendida; finalidade é o que o texto quer fazer com o leitor.',
    'Inferência tem apoio no texto; extrapolação não tem.',
    'Gênero é a forma social do texto; tipo é o modo de organização da linguagem.',
    'Em charges e tirinhas, o sentido depende da relação entre imagem e palavra.',
    'Leia o comando antes do texto e procure o trecho que comprova cada alternativa.',
  ],
  pergunta: {
    enunciado: 'Em uma receita de bolo, o tipo textual que predomina no modo de preparo é o:',
    alternativas: { A: 'narrativo', B: 'injuntivo', C: 'dissertativo', D: 'descritivo' },
    certa: 'B',
    porque: 'O modo de preparo orienta o leitor a agir, com verbos no imperativo como “misture” e “asse”. Essa é a marca do tipo injuntivo.',
  },
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
