// Teoria do tópico de prática lc-variacao.
// Texto da equipe Prumo (CC BY-SA 4.0), com base nos verbetes "Variação linguística", "Preconceito linguístico" e "Funções da linguagem"
// da Wikipédia (CC BY-SA 4.0) e no capítulo "Português/Comunicação/Função da linguagem" do Wikilivros (CC BY-SA 3.0).
// Exemplos: textos curtos criados pela equipe e um trecho em domínio público (Olavo Bilac), com autor e obra citados.
export const teoria = {
  id: 'lc-variacao',
  titulo: 'Variação linguística e funções da linguagem',
  porQueCai: 'O Enem cobra todo ano o respeito às variedades do português e a identificação da função da linguagem que predomina em anúncios, poemas, verbetes e conversas.',
  termos: [
    { termo: 'Variação linguística', def: 'As diferentes formas de falar a mesma língua, conforme o lugar, o grupo, a situação e a época.' },
    { termo: 'Norma-padrão', def: 'O modelo de língua das gramáticas, esperado em textos formais; é uma das variedades.' },
    { termo: 'Adequação', def: 'Combinação entre o jeito de falar ou escrever e a situação de comunicação.' },
    { termo: 'Preconceito linguístico', def: 'Desvalorizar uma pessoa pelo seu jeito de falar.' },
    { termo: 'Função da linguagem', def: 'O objetivo de um texto, definido pelo elemento da comunicação que ele destaca.' },
  ],
  habilidades: [
    { codigo: 'H19', descricao: 'Analisar a função da linguagem predominante nos textos em situações específicas de interlocução.' },
    { codigo: 'H25', descricao: 'Identificar, em textos de diferentes gêneros, as marcas linguísticas que singularizam as variedades linguísticas sociais, regionais e de registro.' },
    { codigo: 'H26', descricao: 'Relacionar as variedades linguísticas a situações específicas de uso social.' },
    { codigo: 'H27', descricao: 'Reconhecer os usos da norma padrão da língua portuguesa nas diferentes situações de comunicação.' },
  ],
  secoes: [
    {
      titulo: 'Toda língua varia',
      imagem: {src: "./conteudo/praticas/img/ap-gazeta-1808.jpg",alt: "Recorte da primeira página de um jornal antigo: o título Gazeta do Rio de Janeiro, a data, sábado 10 de setembro de 1808, o carimbo da Real Biblioteca e o primeiro parágrafo, com grafia antiga.",legenda: "Começo do primeiro jornal impresso no Brasil, de 1808. Compare a grafia com a de hoje: “hum” (um), “immediatamente” (imediatamente), “arribárão” (arribaram). É a variação histórica, ou diacrônica, da língua.",credito: "Imprensa Régia, Gazeta do Rio de Janeiro n. 1, 1808. Domínio público. Wikimedia Commons."},
      paragrafos: [
        'Variação linguística é o fato de uma mesma língua ser falada de formas diferentes. Isso acontece em todas as línguas e não é sinal de erro.',
        'A variação pode ser regional, ligada ao lugar, como o uso de “tu” no Sul e em partes do Norte e do Nordeste, ou “mandioca”, “aipim” e “macaxeira” para o mesmo alimento. Pode ser social, ligada à idade, à escolaridade ou ao grupo, como as gírias dos jovens.',
        'Há ainda a variação situacional, que depende do contexto, e a histórica, que mostra como a língua muda com o tempo. “Vossa mercê” virou “vosmecê”, depois “você” e, na fala, “cê”.',
      ],
      tabela: {
        cabecalho: ['Variação (nome técnico)', 'Depende de', 'Exemplo'],
        linhas: [
          ['regional (diatópica)', 'lugar onde se fala', '“mandioca”, “aipim” e “macaxeira”; “concreto” no Brasil e “betão” em Portugal'],
          ['social (diastrática)', 'grupo, idade, profissão, escolaridade', 'gíria de skatistas (“mandar um flip”); jargão médico (“o paciente está estável”)'],
          ['situacional ou de registro (diafásica)', 'situação e grau de formalidade', '“E aí, beleza?” com amigos; “Bom dia, como vai o senhor?” com o diretor'],
          ['histórica (diacrônica)', 'época', '“vossa mercê” > “vosmecê” > “você” > “cê”; “pharmacia” virou “farmácia”'],
        ],
        legenda: 'Tabela 1. Os quatro tipos de variação linguística, com os nomes técnicos que às vezes aparecem nas questões.',
      },
      exemplo: {
        enunciado: 'Um estudante escreve a um amigo pelo celular: “cê vem amanhã? bora estudar junto”. Na redação do Enem, ele escreve: “É fundamental que os jovens se organizem para estudar em grupo.” Que tipo de variação explica a diferença?',
        resolucao: [
          'A mesma pessoa mudou a forma de escrever conforme a situação.',
          'Com o amigo, usou registro informal: “cê”, “bora”, sem letra maiúscula.',
          'Na redação, usou registro formal, próximo da norma-padrão, porque a situação exige.',
          'Resposta: variação situacional. As duas formas são adequadas, cada uma ao seu contexto.',
        ],
      },
      atencao: 'A prova traz letras de música, falas de personagens ou postagens e pede a marca linguística que revela a região, o grupo social ou o grau de formalidade de quem fala.',
      confira: {
        pergunta: 'O uso de palavras que mudaram de forma ao longo dos séculos é um exemplo de variação:',
        opcoes: ['regional', 'histórica', 'situacional'],
        certa: 1,
        porque: 'A variação histórica, ou diacrônica, mostra a mudança da língua com o tempo, como em “vossa mercê” até “você”.',
      },
    },
    {
      titulo: 'Norma-padrão, adequação e preconceito linguístico',
      paragrafos: [
        'Norma-padrão é o modelo de língua descrito nas gramáticas e esperado em textos formais, como documentos e a redação do Enem. Ela é uma das variedades, e não a língua inteira.',
        'Por isso, o Enem prefere falar em adequação, e não em certo ou errado. Uma forma é adequada quando combina com a situação, o interlocutor e o objetivo da comunicação.',
        'Preconceito linguístico é desvalorizar uma pessoa pelo seu jeito de falar, como ridicularizar um sotaque. As questões costumam valorizar textos que combatem esse preconceito.',
      ],
      exemplo: {
        enunciado: 'Situação criada pela equipe: um feirante do interior da Bahia é entrevistado pela TV e diz “Oxente, a feira tá cheia desde cedinho”. Nas redes, alguém comenta: “Ele fala tudo errado”. Como avaliar a fala do feirante e o comentário?',
        resolucao: [
          '“Oxente” é uma marca regional, comum no Nordeste. “Tá” e “cedinho” são formas da fala informal.',
          'Numa conversa espontânea sobre o trabalho dele, essas formas são adequadas: o público entende e a situação não pede formalidade.',
          'O comentário trata uma variedade regional como erro e desvaloriza o falante por isso.',
          'Resposta: a fala é adequada à situação, e o comentário é um caso de preconceito linguístico.',
        ],
      },
      atencao: 'As questões costumam trazer um texto que discute o “falar certo” e pedem a alternativa que reconhece a legitimidade das variedades ou o uso adequado da norma-padrão em situações formais.',
      confira: {
        pergunta: 'Para o Enem, uma forma de falar deve ser avaliada pela:',
        opcoes: ['proximidade com a fala de Portugal', 'quantidade de palavras difíceis', 'adequação à situação de comunicação'],
        certa: 2,
        porque: 'O critério é a adequação: a forma combina com o interlocutor, o contexto e o objetivo. Nenhuma variedade é errada em si.',
      },
    },
    {
      titulo: 'As seis funções da linguagem',
      paragrafos: [
        'Toda comunicação tem seis elementos: emissor, receptor, mensagem, código, canal e referente (o assunto). Cada função da linguagem destaca um deles.',
        'Função emotiva (ou expressiva): foco no emissor, com sentimentos e opiniões em primeira pessoa. Função conativa (ou apelativa): foco no receptor, com verbos no imperativo e o uso de “você”, comum em propagandas. Função referencial: foco no assunto, com linguagem objetiva, como em notícias.',
        'Função fática: foco no canal, para iniciar, manter ou testar o contato, como “alô, está me ouvindo?”. Função metalinguística: o código fala de si mesmo, como um verbete de dicionário ou um poema sobre escrever poemas. Função poética: foco na forma da mensagem, com ritmo, rima e jogos de palavras.',
      ],
      imagem: {src: "./conteudo/praticas/img/ap-kolynos-1942.jpg",alt: "Anúncio colorido em fundo azul: um bebê sentado numa toalha dá pasta de dente a uma boneca. No alto: É bom para você, tambem! Embaixo: Nunca é cedo... nem tarde demais para começar a escovar seus dentes com Kolynos.",legenda: "Anúncio de 1942. “É bom para você” e “seus dentes” falam direto com o leitor: é a função conativa. Repare também na grafia “tambem”, sem o acento que a palavra tem hoje.",credito: "Kolynos, anúncio na contracapa da revista Careta n. 1749, 1942. Domínio público. Wikimedia Commons."},
      tabela: {
        cabecalho: ['Função (foco)', 'Marcas', 'Exemplo'],
        linhas: [
          ['emotiva (emissor)', 'primeira pessoa, exclamações, adjetivos de sentimento', '“Eu fiquei tão aliviada com o resultado.”'],
          ['conativa (receptor)', 'imperativo, “você”, vocativo', '“Doe sangue. Você pode salvar vidas.”'],
          ['referencial (assunto)', 'terceira pessoa, dados, linguagem objetiva', '“A ponte será reaberta na quinta-feira.”'],
          ['fática (canal)', 'cumprimentos, perguntas de checagem', '“Oi, tá me ouvindo? Caiu a ligação?”'],
          ['metalinguística (código)', 'a língua explicando a língua', '“Saudade: s.f. sentimento causado pela falta de alguém ou de algo.”'],
          ['poética (mensagem)', 'rima, ritmo, repetição, jogo de palavras', '“Quem lê, vê; quem vê, prevê.”'],
        ],
        legenda: 'Tabela 2. As seis funções da linguagem, o elemento que cada uma destaca e as marcas que ajudam a reconhecê-las. Exemplos criados pela equipe.',
      },
      exemplo: {
        enunciado: 'Um cartaz da prefeitura diz: “Vacine seu filho. A proteção dele depende de você.” Qual função da linguagem predomina?',
        resolucao: [
          'O verbo “vacine” está no imperativo e o texto se dirige diretamente ao leitor com “você”.',
          'O objetivo é levar o receptor a agir.',
          'Resposta: função conativa (apelativa).',
        ],
      },
      atencao: 'Verbetes, poemas sobre o próprio poema e anúncios aparecem com frequência; a pergunta pede a função que predomina na situação de interlocução apresentada.',
      confira: {
        pergunta: 'A função fática tem foco no:',
        opcoes: ['canal de comunicação', 'emissor', 'código'],
        certa: 0,
        porque: 'A função fática serve para abrir, manter ou testar o contato, como em “alô” ou “está me ouvindo?”. O foco é o canal.',
      },
    },
    {
      titulo: 'Como identificar a função predominante',
      paragrafos: [
        'Um texto pode ter várias funções ao mesmo tempo. A questão pede a que predomina, ou seja, a que melhor explica o objetivo principal do texto.',
        'Pergunte: o texto quer expressar o sentimento de quem fala, convencer quem lê, informar sobre um assunto, manter o contato, explicar a própria linguagem ou chamar atenção para a forma? A resposta indica a função.',
      ],
      exemplos: [
        {
          enunciado: 'Uma padaria afixou na porta, num texto criado pela equipe: “Pão quentinho toda hora: passe aqui e leve agora.” Há rima entre “hora” e “agora”. Qual função predomina?',
          resolucao: [
            'A rima é uma marca da função poética, mas aqui ela está a serviço de outro objetivo.',
            'Os verbos “passe” e “leve” estão no imperativo e se dirigem ao cliente.',
            'O objetivo principal do texto é fazer o leitor entrar e comprar.',
            'Resposta: função conativa. A rima só ajuda a fixar a mensagem.',
          ],
        },
        {
          enunciado: 'O soneto “Língua portuguesa”, de Olavo Bilac, publicado em Tarde (1919), começa assim: “Última flor do Lácio, inculta e bela, / És, a um tempo, esplendor e sepultura”. Que funções aparecem nesses versos?',
          resolucao: [
            'O poema usa a língua para falar da própria língua portuguesa. Há metalinguagem.',
            'O trabalho com a forma também é forte: versos medidos, metáfora (“flor do Lácio”) e antítese (“esplendor e sepultura”).',
            'Num poema, a função poética está sempre presente.',
            'Resposta: poética e metalinguística. Quando o poema fala da própria língua, como aqui, a questão costuma pedir a metalinguística.',
          ],
        },
      ],
      atencao: 'O distrator mais comum é a função que aparece em um detalhe, como a rima de um anúncio; a correta é a que explica o objetivo principal do texto.',
      confira: {
        pergunta: 'Um anúncio com rimas que pede “compre já” tem como função predominante a:',
        opcoes: ['poética', 'conativa', 'fática'],
        certa: 1,
        porque: 'As rimas são um recurso, mas o objetivo principal é levar o leitor a comprar. Esse foco no receptor caracteriza a função conativa.',
      },
    },
  ],
  armadilhas: [
    'Tratar a variação regional ou social como erro, quando a questão pede para reconhecê-la como legítima.',
    'Confundir função emotiva com conativa: a emotiva fala de quem emite; a conativa quer agir sobre quem recebe.',
    'Ver uma rima ou um trocadilho e marcar função poética, quando o objetivo principal do texto é vender um produto.',
    'Achar que a norma-padrão é a única forma correta da língua, e não a forma adequada a situações formais.',
  ],
  resumo: [
    'Toda língua varia por região, grupo social, situação e época.',
    'Avalie a linguagem pela adequação ao contexto, e não por certo ou errado.',
    'Preconceito linguístico é discriminar alguém pelo jeito de falar.',
    'Emotiva: emissor. Conativa: receptor. Referencial: assunto.',
    'Fática: canal. Metalinguística: código. Poética: a forma da mensagem.',
  ],
  pergunta: {
    enunciado: 'Um verbete de dicionário que explica o significado da palavra “saudade” tem como função predominante a:',
    alternativas: { A: 'emotiva', B: 'poética', C: 'fática', D: 'metalinguística' },
    certa: 'D',
    porque: 'O verbete usa a língua para explicar uma palavra da própria língua. Quando o código fala do código, a função é metalinguística.',
  },
  fontes: [
    { titulo: 'Wikipédia, Variação linguística', url: 'https://pt.wikipedia.org/wiki/Varia%C3%A7%C3%A3o_lingu%C3%ADstica', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Preconceito linguístico', url: 'https://pt.wikipedia.org/wiki/Preconceito_lingu%C3%ADstico', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikipédia, Funções da linguagem', url: 'https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%B5es_da_linguagem', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR', adaptado: true },
    { titulo: 'Wikilivros, Português/Comunicação/Função da linguagem', url: 'https://pt.wikibooks.org/w/index.php?oldid=440402', revisao: '440402 (10/12/2016)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H19, H25, H26 e H27)', url: 'https://download.inep.gov.br/download/enem/matriz_referencia.pdf', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Texto da equipe Prumo em CC BY-SA 4.0, com base nos verbetes Variação linguística, Preconceito linguístico e Funções da linguagem da Wikipédia (CC BY-SA 4.0) e no capítulo Função da linguagem do livro Português do Wikilivros (CC BY-SA 3.0; autores: ver o histórico de cada página). Os exemplos usam textos criados pela equipe e um trecho em domínio público de Olavo Bilac (soneto “Língua portuguesa”).',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
