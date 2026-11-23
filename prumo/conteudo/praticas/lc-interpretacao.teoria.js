// Teoria do tópico de prática lc-interpretacao.
// Texto da equipe Prumo (CC BY-SA 4.0), com base nos verbetes "Gênero textual", "Tipo textual" e "Intertextualidade" da Wikipédia
// (CC BY-SA 4.0) e no capítulo "Português I/Linguagem, língua, discurso e texto" do Wikilivros (CC BY-SA 3.0).
// Exemplos: textos curtos criados pela equipe e trechos em domínio público (Machado de Assis, Gonçalves Dias), com autor e obra citados.
export const teoria = {
  id: 'lc-interpretacao',
  titulo: 'Interpretação de texto e gêneros',
  porQueCai: 'Quase toda questão de Linguagens começa com um texto, como notícia, crônica, tirinha, anúncio ou poema, e pergunta qual é a sua finalidade, o seu gênero ou o que se pode concluir a partir dele.',
  termos: [
    { termo: 'Tese', def: 'A posição que o autor defende sobre o tema, que é o assunto do texto.' },
    { termo: 'Inferência', def: 'Conclusão que não está escrita, mas que o texto permite tirar com segurança.' },
    { termo: 'Extrapolação', def: 'Afirmação que vai além do texto e não tem apoio em nenhum trecho dele.' },
    { termo: 'Gênero textual', def: 'Forma social do texto, como notícia, receita, charge ou crônica, com finalidade e público típicos.' },
    { termo: 'Intertextualidade', def: 'Diálogo de um texto com outro já conhecido, por citação, paródia ou alusão.' },
  ],
  habilidades: [
    { codigo: 'H3', descricao: 'Relacionar informações geradas nos sistemas de comunicação e informação, considerando a função social desses sistemas.' },
    { codigo: 'H18', descricao: 'Identificar os elementos que concorrem para a progressão temática e para a organização e estruturação de textos de diferentes gêneros e tipos.' },
    { codigo: 'H21', descricao: 'Reconhecer em textos de diferentes gêneros, recursos verbais e não-verbais utilizados com a finalidade de criar e mudar comportamentos e hábitos.' },
    { codigo: 'H22', descricao: 'Relacionar, em diferentes textos, opiniões, temas, assuntos e recursos linguísticos.' },
    { codigo: 'H23', descricao: 'Inferir em um texto quais são os objetivos de seu produtor e quem é seu público alvo, pela análise dos procedimentos argumentativos utilizados.' },
  ],
  secoes: [
    {
      titulo: 'Tema, tese e finalidade',
      paragrafos: [
        'Tema é o assunto do texto. Tese é a posição que o autor defende sobre esse assunto, quando o texto é opinativo.',
        'Finalidade é o que o texto pretende fazer com o leitor: informar, convencer, orientar, divertir ou emocionar. Muitas questões do Enem perguntam exatamente isso, com palavras como “objetivo”, “intenção” ou “função social”.',
        'Uma boa estratégia é ler primeiro o comando da questão e depois o texto. Assim você sabe o que procurar durante a leitura.',
      ],
      tabela: {
        cabecalho: ['Finalidade', 'Gêneros em que costuma aparecer', 'Pista no texto'],
        linhas: [
          ['informar', 'notícia, verbete, reportagem', 'dados, datas, linguagem objetiva'],
          ['convencer', 'artigo de opinião, anúncio, campanha', 'opinião, argumentos, apelo ao leitor'],
          ['orientar', 'receita, manual, regulamento', 'verbos no imperativo, passos em ordem'],
          ['divertir', 'piada, tirinha, crônica de humor', 'quebra de expectativa, exagero'],
          ['emocionar', 'poema, carta pessoal, depoimento', 'sentimentos em primeira pessoa'],
        ],
        legenda: 'Tabela 1. Finalidades mais comuns e onde elas aparecem. Um texto pode ter mais de uma; a questão pede a principal.',
      },
      exemplo: {
        enunciado: 'Leia este texto, criado pela equipe: “A biblioteca da escola fecha às 17 horas, justamente quando termina a última aula. Quem estuda à tarde nunca consegue usá-la. O horário precisa ser ampliado até as 19 horas.” Indique o tema, a tese e a finalidade.',
        resolucao: [
          'Tema: o horário de funcionamento da biblioteca da escola.',
          'Tese: o horário precisa ser ampliado. É a opinião que o autor defende, e aparece na última frase.',
          'As duas primeiras frases são os argumentos: o fechamento coincide com o fim das aulas e impede o uso pelos alunos da tarde.',
          'Finalidade: convencer o leitor, provavelmente a direção, a mudar o horário.',
        ],
      },
      atencao: 'O comando costuma usar “objetivo”, “finalidade” ou “função social”, e as alternativas erradas trocam a finalidade pelo tema ou descrevem só um detalhe do texto.',
      confira: {
        pergunta: 'Em um artigo de opinião, a tese é:',
        opcoes: ['o assunto geral do texto', 'a posição que o autor defende', 'o título do artigo'],
        certa: 1,
        porque: 'O assunto é o tema. A tese é a opinião que o autor defende sobre esse tema.',
      },
    },
    {
      titulo: 'O que está escrito, o que se pode inferir e o que é invenção',
      paragrafos: [
        'Informação explícita é a que aparece escrita no texto. Inferência é uma conclusão que não está escrita, mas que o texto permite tirar com segurança.',
        'Extrapolação é ir além do texto, afirmando algo que ele não autoriza. Alternativas com extrapolação parecem razoáveis, mas não têm apoio no que foi lido.',
        'Para testar uma alternativa, pergunte: qual trecho do texto comprova isso? Se não houver trecho, desconfie.',
      ],
      exemplos: [
        {
          enunciado: 'Leia: “Depois de três dias de chuva, Dona Lúcia finalmente estendeu a roupa no varal do quintal.” Qual das conclusões é uma inferência válida: (1) o tempo melhorou; (2) Dona Lúcia não tem máquina de secar; (3) o varal fica no quintal?',
          resolucao: [
            'A conclusão 3 é informação explícita: o texto diz “no varal do quintal”.',
            'A conclusão 1 é inferência válida: a palavra “finalmente” e o fim da chuva indicam que ela esperava um tempo melhor para secar a roupa.',
            'A conclusão 2 é extrapolação: o texto não diz nada sobre outros eletrodomésticos.',
            'Resposta: a inferência válida é a 1.',
          ],
        },
        {
          enunciado: 'Em Dom Casmurro (1899), de Machado de Assis, o narrador conta: “Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu.” O que se pode inferir sobre a relação entre o narrador e o rapaz?',
          resolucao: [
            'Explícito: o encontro foi no trem, à noite, e o rapaz mora no mesmo bairro.',
            'A expressão “de vista e de chapéu” lembra o gesto de tirar o chapéu para cumprimentar alguém na rua.',
            'Inferência válida: os dois se conhecem só de cumprimento, sem intimidade.',
            'Seria extrapolação dizer que eles são inimigos ou que o rapaz é parente do narrador: nada no trecho sustenta isso.',
          ],
        },
      ],
      atencao: 'As alternativas erradas costumam ser frases verdadeiras sobre o mundo ou conclusões exageradas; a certa é a única que se apoia em um trecho do texto.',
      confira: {
        pergunta: 'Uma alternativa que parece razoável, mas não tem trecho do texto que a comprove, é um caso de:',
        opcoes: ['extrapolação', 'inferência', 'informação explícita'],
        certa: 0,
        porque: 'A inferência tem apoio no texto, mesmo sem estar escrita. Quando falta esse apoio, a conclusão é extrapolação.',
      },
    },
    {
      titulo: 'Gênero textual e tipo textual',
      paragrafos: [
        'Gênero textual é a forma concreta que o texto assume na vida social: notícia, crônica, receita, anúncio, carta, bula, charge, artigo de opinião, entre muitos outros. Cada gênero tem uma finalidade, um público, um suporte e uma estrutura típicos.',
        'Tipo textual é o modo de organização da linguagem dentro do texto. Os principais são narração (conta fatos em sequência), descrição (caracteriza), dissertação (expõe ou argumenta) e injunção (orienta o leitor a fazer algo, com verbos no imperativo).',
        'Um mesmo gênero pode misturar tipos. Uma crônica pode narrar um fato do cotidiano e, no final, refletir sobre ele.',
      ],
      tabela: {
        cabecalho: ['Tipo textual', 'O que faz', 'Marcas linguísticas', 'Gêneros em que predomina'],
        linhas: [
          ['narrativo', 'conta fatos em sequência', 'verbos no pretérito, marcadores de tempo (“depois”, “naquela noite”), personagens', 'conto, crônica, notícia'],
          ['descritivo', 'caracteriza seres, lugares e objetos', 'adjetivos, verbos de estado (ser, estar, parecer), enumerações', 'anúncio de imóvel, retrato, guia de viagem'],
          ['dissertativo', 'expõe ou defende ideias', 'verbos no presente, conectivos (“portanto”, “porém”), dados e argumentos', 'artigo de opinião, editorial, verbete'],
          ['injuntivo', 'orienta o leitor a agir', 'verbos no imperativo ou no infinitivo, passos numerados', 'receita, manual, aviso'],
        ],
        legenda: 'Tabela 2. Os tipos textuais e as marcas que ajudam a reconhecê-los.',
      },
      exemplo: {
        enunciado: 'No elevador de um prédio, está afixado: “Senhores moradores, a partir de segunda-feira a coleta de recicláveis será feita às terças e sextas. Separem o material limpo e seco.” Identifique o gênero, a finalidade e o tipo textual predominante.',
        resolucao: [
          'Gênero: aviso, um texto curto, afixado em local de circulação, dirigido a um grupo definido.',
          'Finalidade: informar uma mudança e orientar o comportamento dos moradores.',
          'Tipo predominante: injuntivo, marcado pelo verbo no imperativo “separem”, combinado com um trecho informativo.',
        ],
      },
      atencao: 'A prova mostra um texto de gênero pouco comum, como um relato, um anúncio de utilidade pública ou uma crônica, e pergunta qual traço o identifica: finalidade, estrutura ou marca linguística.',
      confira: {
        pergunta: 'Verbos no imperativo e passos em ordem são marcas do tipo:',
        opcoes: ['narrativo', 'descritivo', 'injuntivo'],
        certa: 2,
        porque: 'O tipo injuntivo orienta o leitor a fazer algo. Por isso usa o imperativo e organiza as ações em sequência, como numa receita.',
      },
    },
    {
      titulo: 'Textos com imagem e diálogo entre textos',
      imagem: {src: "./conteudo/praticas/img/ap-duas-imprensas.jpg",alt: "Charge em preto e branco: um senador ergue um machado escrito Lei de Imprensa; diante dele, uma mulher serena representa a imprensa séria e, atrás, um homem caricato segura uma pena enorme.",legenda: "Charge de J. Carlos sobre uma lei de imprensa de 1922. O sentido nasce da imagem com a legenda: o “Bom Senso” pede que o senador não castigue a imprensa séria pelos erros da imprensa sensacionalista.",credito: "J. Carlos, As duas imprensas (O Malho, n. 1057), 1922. Domínio público. Wikimedia Commons."},
      paragrafos: [
        'Charges, tirinhas, cartazes e infográficos combinam linguagem verbal e não verbal. O sentido nasce da relação entre imagem e palavra, por isso observe expressões, cores, tamanho das letras e detalhes do cenário.',
        'A charge comenta, em geral com humor crítico, um fato da atualidade. A tirinha apresenta uma pequena narrativa em quadrinhos, muitas vezes com uma quebra de expectativa no último quadro.',
        'Intertextualidade é o diálogo de um texto com outro já conhecido, por citação, paródia ou alusão. Reconhecer o texto de origem ajuda a perceber a crítica ou o humor.',
      ],
      exemplo: {
        enunciado: 'A “Canção do exílio” (1843), de Gonçalves Dias, começa assim: “Minha terra tem palmeiras, / Onde canta o Sabiá; / As aves, que aqui gorjeiam, / Não gorjeiam como lá.” Compare com estes versos criados pela equipe: “Minha terra tem viadutos, / Onde buzina o motor; / O ar que aqui se respira / Não tem cheiro de flor.” Que relação há entre os textos e que efeito ela produz?',
        resolucao: [
          'Os versos da equipe repetem a estrutura, o ritmo e o início do poema de Gonçalves Dias. Há intertextualidade.',
          'O poema original exalta a natureza da terra natal, vista com saudade.',
          'A nova versão troca palmeiras e sabiás por viadutos e buzinas, invertendo o elogio.',
          'Resposta: é uma paródia, que retoma um texto conhecido para criticar a vida na cidade grande.',
        ],
      },
      atencao: 'As questões trazem dois textos lado a lado, ou uma charge que retoma um texto famoso, e perguntam o que eles têm em comum ou qual é o efeito do diálogo entre eles.',
      confira: {
        pergunta: 'Um texto que imita outro muito conhecido para criticá-lo ou provocar humor é uma:',
        opcoes: ['citação', 'paródia', 'descrição'],
        certa: 1,
        porque: 'A paródia retoma a forma de um texto conhecido e muda o sentido, em geral com crítica ou humor. A citação apenas reproduz o trecho.',
      },
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
  fontes: [
    { titulo: 'Wikipédia, Gênero textual', url: 'https://pt.wikipedia.org/wiki/G%C3%AAnero_textual', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Tipo textual', url: 'https://pt.wikipedia.org/wiki/Tipo_textual', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Intertextualidade', url: 'https://pt.wikipedia.org/wiki/Intertextualidade', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikilivros, Português I/Linguagem, língua, discurso e texto', url: 'https://pt.wikibooks.org/w/index.php?oldid=474741', revisao: '474741 (16/09/2021)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H3, H18, H21, H22 e H23)', url: 'https://download.inep.gov.br/download/enem/matriz_referencia.pdf', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Texto da equipe Prumo em CC BY-SA 4.0, com base nos verbetes Gênero textual, Tipo textual e Intertextualidade da Wikipédia (CC BY-SA 4.0) e no capítulo Linguagem, língua, discurso e texto do livro Português I do Wikilivros (CC BY-SA 3.0; autores: ver o histórico de cada página). Os exemplos usam textos criados pela equipe e trechos em domínio público de Machado de Assis (Dom Casmurro) e Gonçalves Dias (Canção do exílio).',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
