export const teoria = {
  id: 'lc-variacao',
  titulo: 'Variação linguística e funções da linguagem',
  porQueCai: 'O Enem cobra todo ano o respeito às variedades do português e a identificação da função da linguagem que predomina em anúncios, poemas, verbetes e conversas.',
  secoes: [
    {
      titulo: 'Toda língua varia',
      paragrafos: [
        'Variação linguística é o fato de uma mesma língua ser falada de formas diferentes. Isso acontece em todas as línguas e não é sinal de erro.',
        'A variação pode ser regional, ligada ao lugar, como o uso de “tu” no Sul e em partes do Norte e do Nordeste, ou “mandioca”, “aipim” e “macaxeira” para o mesmo alimento. Pode ser social, ligada à idade, à escolaridade ou ao grupo, como as gírias dos jovens.',
        'Há ainda a variação situacional, que depende do contexto, e a histórica, que mostra como a língua muda com o tempo. “Vossa mercê” virou “vosmecê”, depois “você” e, na fala, “cê”.',
      ],
      exemplo: {
        enunciado: 'Um estudante escreve a um amigo pelo celular: “cê vem amanhã? bora estudar junto”. Na redação do Enem, ele escreve: “É fundamental que os jovens se organizem para estudar em grupo.” Que tipo de variação explica a diferença?',
        resolucao: [
          'A mesma pessoa mudou a forma de escrever conforme a situação.',
          'Com o amigo, usou registro informal: “cê”, “bora”, sem letra maiúscula.',
          'Na redação, usou registro formal, próximo da norma-padrão, porque a situação exige.',
          'Resposta: variação situacional. As duas formas são adequadas, cada uma ao seu contexto.',
        ],
      },
    },
    {
      titulo: 'Norma-padrão, adequação e preconceito linguístico',
      paragrafos: [
        'Norma-padrão é o modelo de língua descrito nas gramáticas e esperado em textos formais, como documentos e a redação do Enem. Ela é uma das variedades, e não a língua inteira.',
        'Por isso, o Enem prefere falar em adequação, e não em certo ou errado. Uma forma é adequada quando combina com a situação, o interlocutor e o objetivo da comunicação.',
        'Preconceito linguístico é desvalorizar uma pessoa pelo seu jeito de falar, como ridicularizar um sotaque. As questões costumam valorizar textos que combatem esse preconceito.',
      ],
    },
    {
      titulo: 'As seis funções da linguagem',
      paragrafos: [
        'Toda comunicação tem seis elementos: emissor, receptor, mensagem, código, canal e referente (o assunto). Cada função da linguagem destaca um deles.',
        'Função emotiva (ou expressiva): foco no emissor, com sentimentos e opiniões em primeira pessoa. Função conativa (ou apelativa): foco no receptor, com verbos no imperativo e o uso de “você”, comum em propagandas. Função referencial: foco no assunto, com linguagem objetiva, como em notícias.',
        'Função fática: foco no canal, para iniciar, manter ou testar o contato, como “alô, está me ouvindo?”. Função metalinguística: o código fala de si mesmo, como um verbete de dicionário ou um poema sobre escrever poemas. Função poética: foco na forma da mensagem, com ritmo, rima e jogos de palavras.',
      ],
      exemplo: {
        enunciado: 'Um cartaz da prefeitura diz: “Vacine seu filho. A proteção dele depende de você.” Qual função da linguagem predomina?',
        resolucao: [
          'O verbo “vacine” está no imperativo e o texto se dirige diretamente ao leitor com “você”.',
          'O objetivo é levar o receptor a agir.',
          'Resposta: função conativa (apelativa).',
        ],
      },
    },
    {
      titulo: 'Como identificar a função predominante',
      paragrafos: [
        'Um texto pode ter várias funções ao mesmo tempo. A questão pede a que predomina, ou seja, a que melhor explica o objetivo principal do texto.',
        'Pergunte: o texto quer expressar o sentimento de quem fala, convencer quem lê, informar sobre um assunto, manter o contato, explicar a própria linguagem ou chamar atenção para a forma? A resposta indica a função.',
      ],
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
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
