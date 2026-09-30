(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'red-enem',
  materia: 'red',
  titulo: 'Redação do ENEM',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Competências, estrutura, repertório, coesão e proposta de intervenção do texto dissertativo-argumentativo do ENEM.',
  topicos: [
    {
      id: 'red-enem-competencias',
      nome: 'As 5 competências',
      resumo: 'O que cada competência avalia, a nota de 0 a 1000 e os motivos de nota zero.',
      prereq: [],
      fonte: 'Apostila de Redação · ENEM, cap. 1',
      itens: [
        {
          id: 'red-enem-competencias-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual competência avalia a proposta de intervenção?',
          opcoes: [
            { t: 'Competência 5.', ok: true },
            { t: 'Competência 3.', erro: 'Confunde organizar os argumentos em defesa da tese (C3) com propor solução para o problema.' },
            { t: 'Competência 2.', erro: 'A C2 avalia a compreensão do tema, o tipo textual e o repertório, não a solução.' },
            { t: 'Competência 4.', erro: 'A C4 avalia os mecanismos de coesão; os conectivos aparecem na proposta, mas não são o que ela avalia.' }
          ],
          explicacao: 'A C5 pede uma proposta de intervenção para o problema discutido, articulada ao texto e respeitando os direitos humanos.',
          trecho: 'Competência 5: elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.'
        },
        {
          id: 'red-enem-competencias-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um texto sem desvios gramaticais, mas com argumentos soltos e sem relação com a tese, perde pontos principalmente na:',
          opcoes: [
            { t: 'Competência 3.', ok: true },
            { t: 'Competência 1.', erro: 'Associa toda falha à gramática; o enunciado diz que não há desvios.' },
            { t: 'Competência 4.', erro: 'Confunde ligar as frases com conectivos (C4) com selecionar e organizar argumentos que sustentem a tese (C3).' },
            { t: 'Competência 5.', erro: 'A C5 trata da proposta de intervenção, não da qualidade dos argumentos.' }
          ],
          explicacao: 'A C3 avalia se as informações e os argumentos foram selecionados, relacionados e organizados em defesa de um ponto de vista, o chamado projeto de texto.',
          trecho: 'Competência 3: selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.'
        },
        {
          id: 'red-enem-competencias-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as situações que levam à nota zero.',
          opcoes: [
            { t: 'Fuga total ao tema.', ok: true },
            { t: 'Texto com até 7 linhas.', ok: true },
            { t: 'Texto em outro tipo, como narrativa ou poema.', ok: true },
            { t: 'Redação sem título.', ok: false, erro: 'O título é opcional e não é avaliado.' },
            { t: 'Texto que usa as 30 linhas da folha.', ok: false, erro: 'O limite é de 30 linhas; usá-las todas é permitido.' }
          ],
          explicacao: 'A nota zero ocorre quando o texto não cumpre requisitos básicos: tema, tipo dissertativo-argumentativo e extensão mínima, entre outros casos previstos na Cartilha do Participante.',
          trecho: 'Recebe nota zero a redação com fuga total ao tema, que não obedeça ao tipo dissertativo-argumentativo ou que tenha até 7 linhas, entre outros casos.'
        },
        {
          id: 'red-enem-competencias-4', tipo: 'aberta', nivel: 'compreender', dif: 1,
          enunciado: 'O que a Competência 1 avalia?',
          modelo: 'O domínio da modalidade escrita formal da língua portuguesa, como ortografia, pontuação, concordância e regência.',
          criterios: [
            { rotulo: 'Cita a escrita formal ou a norma-padrão', chaves: ['formal', 'norma', 'padrao', 'culta'] },
            { rotulo: 'Cita aspectos gramaticais (ortografia, pontuação, concordância...)', chaves: ['gramat', 'ortograf', 'pontua', 'concord', 'regenc', 'acentu', 'sintax', 'desvio', 'crase'] }
          ],
          explicacao: 'A C1 observa desvios gramaticais e de convenções da escrita, além da escolha do registro. Uma frase mal estruturada também pesa nessa competência.',
          trecho: 'Competência 1: demonstrar domínio da modalidade escrita formal da língua portuguesa.'
        },
        {
          id: 'red-enem-competencias-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'As 5 competências da redação do ENEM, uma palavra-chave para cada.',
          verso: 'C1: escrita formal. C2: tema, tipo dissertativo-argumentativo e repertório. C3: seleção e organização dos argumentos (projeto de texto). C4: coesão. C5: proposta de intervenção com respeito aos direitos humanos. Cada uma vale de 0 a 200, total de 1000.',
          explicacao: 'Associar cada competência a uma palavra ajuda a revisar o próprio texto: gramática, tema, argumentos, conexão e solução.',
          trecho: 'A redação do ENEM é avaliada em cinco competências, cada uma com nota de 0 a 200.'
        },
        {
          id: 'red-enem-competencias-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Comentário fictício de um corretor: “O texto tem tese clara e argumentos bem escolhidos. Porém, os parágrafos não se ligam, há repetição das mesmas palavras e quase nenhum conectivo entre as frases.”',
          enunciado: 'Qual competência deve ter recebido a menor nota?',
          passos: [
            'Descartar a C3: a tese e os argumentos foram elogiados.',
            'Notar que as críticas são à ligação entre partes, à repetição e aos conectivos.',
            'Esses são mecanismos de coesão, avaliados na C4.'
          ],
          opcoes: [
            { t: 'Competência 4.', ok: true },
            { t: 'Competência 3.', erro: 'Associa “parágrafos soltos” a argumentos ruins, mas o corretor elogiou os argumentos.' },
            { t: 'Competência 1.', erro: 'Trata a repetição de palavras como erro gramatical; ela é problema de coesão.' },
            { t: 'Competência 2.', erro: 'Não há indício de fuga ao tema ou problema de tipo textual.' }
          ],
          explicacao: 'A C4 avalia os recursos que ligam as partes do texto: conectivos entre e dentro dos parágrafos e retomadas por pronomes e sinônimos. Argumentos bons, mas mal conectados, perdem pontos aí.',
          trecho: 'Competência 4: demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.'
        }
      ]
    },
    {
      id: 'red-enem-estrutura',
      nome: 'Estrutura dissertativo-argumentativa',
      resumo: 'Introdução com tese, desenvolvimento com tópico frasal e conclusão com proposta.',
      prereq: ['red-enem-competencias'],
      fonte: 'Apostila de Redação · ENEM, cap. 2',
      itens: [
        {
          id: 'red-enem-estrutura-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Na estrutura mais usada no ENEM, a tese aparece:',
          opcoes: [
            { t: 'na introdução.', ok: true },
            { t: 'apenas na conclusão, como surpresa.', erro: 'Confunde com textos que revelam a opinião no fim; no ENEM, a tese orienta o texto desde o início.' },
            { t: 'no título.', erro: 'O título é opcional e não é avaliado; a tese precisa estar no corpo do texto.' },
            { t: 'em forma de pergunta em cada parágrafo.', erro: 'Perguntas podem introduzir o tema, mas a tese é uma afirmação de posição.' }
          ],
          explicacao: 'A introdução contextualiza o tema e apresenta a tese, ou seja, o ponto de vista que será defendido. Os parágrafos seguintes a sustentam, e a conclusão a retoma.',
          trecho: 'A introdução apresenta o tema e a tese, orientando o leitor sobre o percurso argumentativo.'
        },
        {
          id: 'red-enem-estrutura-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a função do tópico frasal num parágrafo de desenvolvimento?',
          opcoes: [
            { t: 'Anunciar o argumento central que o parágrafo vai desenvolver.', ok: true },
            { t: 'Resumir o texto inteiro.', erro: 'Confunde com a conclusão, que retoma o texto.' },
            { t: 'Apresentar a proposta de intervenção.', erro: 'A proposta aparece na conclusão; o desenvolvimento sustenta a tese.' },
            { t: 'Trazer dados soltos, sem relação com a tese.', erro: 'Dados precisam estar a serviço do argumento, não soltos.' }
          ],
          explicacao: 'O tópico frasal é a primeira frase do parágrafo e diz qual ideia será defendida ali. Depois vêm a fundamentação, o repertório e o fechamento.',
          trecho: 'Cada parágrafo de desenvolvimento se abre com um tópico frasal, que anuncia o argumento a ser fundamentado.'
        },
        {
          id: 'red-enem-estrutura-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os elementos adequados a uma boa introdução.',
          opcoes: [
            { t: 'Contextualização do tema.', ok: true },
            { t: 'Apresentação da tese.', ok: true },
            { t: 'Anúncio dos argumentos que serão desenvolvidos.', ok: true },
            { t: 'Proposta de intervenção detalhada.', ok: false, erro: 'A proposta detalhada fica na conclusão; na introdução ela antecipa o fim do texto.' },
            { t: 'Relato de uma experiência pessoal como núcleo do texto.', ok: false, erro: 'Transformar o texto em relato aproxima-o do tipo narrativo, fugindo do dissertativo-argumentativo.' }
          ],
          explicacao: 'Uma boa introdução situa o leitor, mostra a posição do autor e prepara o caminho dos argumentos. É o mapa do texto.',
          trecho: 'Na introdução, contextualiza-se o tema, apresenta-se a tese e indicam-se os argumentos.'
        },
        {
          id: 'red-enem-estrutura-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a diferença entre tema e tese?',
          modelo: 'Tema é o assunto proposto; tese é o ponto de vista que o autor defende sobre esse assunto.',
          criterios: [
            { rotulo: 'Define o tema como o assunto proposto', chaves: ['assunto', 'propost', 'recorte', 'sobre o que'] },
            { rotulo: 'Define a tese como opinião ou ponto de vista defendido', chaves: ['opini', 'ponto de vista', 'posic', 'defend', 'argument'] }
          ],
          explicacao: 'O tema é dado pela prova e é igual para todos. A tese é pessoal: é o que cada participante afirma sobre o tema e sustenta com argumentos.',
          trecho: 'A tese é a posição do autor sobre o tema, e todo o texto deve convergir para sustentá-la.'
        },
        {
          id: 'red-enem-estrutura-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Estrutura clássica da redação do ENEM em 4 parágrafos.',
          verso: '1º: introdução (contexto + tese + argumentos). 2º e 3º: desenvolvimento (tópico frasal + fundamentação + repertório). 4º: conclusão (retomada da tese + proposta de intervenção).',
          explicacao: 'Não é obrigatório ter 4 parágrafos, mas essa estrutura organiza bem o espaço de até 30 linhas.',
          trecho: 'A estrutura em quatro parágrafos é a mais usada por equilibrar apresentação, argumentação e proposta.'
        },
        {
          id: 'red-enem-estrutura-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Tema fictício: “Desafios para o acesso de idosos a serviços digitais no Brasil”. Introdução de um participante: “Hoje em dia a tecnologia está em tudo. Muitas coisas mudaram. Por isso, precisamos pensar nisso.”',
          enunciado: 'O principal problema dessa introdução é:',
          passos: [
            'Procurar o recorte do tema: idosos e serviços digitais. Ele não aparece.',
            'Procurar a tese: não há posição defendida, só frases genéricas.',
            'Descartar título e proposta, que não pertencem à introdução.'
          ],
          opcoes: [
            { t: 'ser genérica, sem o recorte do tema e sem tese.', ok: true },
            { t: 'não ter proposta de intervenção.', erro: 'Confunde as partes: a proposta pertence à conclusão.' },
            { t: 'não ter título.', erro: 'O título é opcional e não é avaliado.' },
            { t: 'ser curta, já que o conteúdo está adequado.', erro: 'Toma tamanho por qualidade; o problema é a falta de recorte e de tese, não o número de linhas.' }
          ],
          explicacao: 'A introdução fala de “tecnologia” em geral e nunca cita idosos nem serviços digitais. Sem recorte e sem tese, o texto corre risco de tangenciar o tema e perde força argumentativa.',
          trecho: 'Introduções genéricas, que servem para qualquer tema, enfraquecem o projeto de texto e podem indicar tangenciamento.'
        }
      ]
    },
    {
      id: 'red-enem-repertorio',
      nome: 'Repertório sociocultural',
      resumo: 'Repertório legitimado, pertinente e produtivo: o que conta e como usar.',
      prereq: ['red-enem-estrutura'],
      fonte: 'Apostila de Redação · ENEM, cap. 3',
      itens: [
        {
          id: 'red-enem-repertorio-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Segundo a Cartilha do Participante, o repertório deve ser:',
          opcoes: [
            { t: 'legitimado, pertinente ao tema e usado de forma produtiva.', ok: true },
            { t: 'obrigatoriamente uma citação de filósofo.', erro: 'Supõe que só filosofia vale; dados, leis, obras e fatos históricos também são repertório.' },
            { t: 'retirado dos textos motivadores.', erro: 'Confunde a coletânea com repertório próprio; cópia dos textos motivadores é desconsiderada.' },
            { t: 'estrangeiro e o mais recente possível.', erro: 'Origem e data não definem a qualidade; o que importa é legitimidade, pertinência e uso.' }
          ],
          explicacao: 'Legitimado: tem base em áreas do conhecimento. Pertinente: tem a ver com o tema. Produtivo: está articulado ao argumento e ajuda a sustentá-lo.',
          trecho: 'Na Competência 2, avalia-se o uso de repertório sociocultural legitimado, pertinente ao tema e produtivo.'
        },
        {
          id: 'red-enem-repertorio-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'O que é um repertório de uso produtivo?',
          opcoes: [
            { t: 'Um repertório articulado ao argumento, que ajuda a sustentar a tese.', ok: true },
            { t: 'Uma citação decorada que serve para qualquer tema.', erro: 'Confunde memorizar com usar: sem ligação com o tema, a citação não sustenta nada.' },
            { t: 'Qualquer informação verdadeira, mesmo sem relação com o texto.', erro: 'Ser verdadeiro não basta; é preciso ser pertinente e estar a serviço do argumento.' },
            { t: 'O maior número possível de citações no mesmo parágrafo.', erro: 'Supõe que quantidade garante qualidade; excesso sem análise enfraquece o texto.' }
          ],
          explicacao: 'O repertório é produtivo quando o texto explica sua relação com o problema e tira dele uma conclusão que fortalece a tese.',
          trecho: 'O uso produtivo exige que o repertório seja relacionado à discussão, e não apenas mencionado.'
        },
        {
          id: 'red-enem-repertorio-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os exemplos de repertório legitimado.',
          opcoes: [
            { t: 'Dado de um instituto oficial de pesquisa, como o IBGE.', ok: true },
            { t: 'Um artigo da Constituição Federal.', ok: true },
            { t: 'Conceito de um pensador ou referência a uma obra literária.', ok: true },
            { t: 'Boato de rede social sem fonte.', ok: false, erro: 'Sem fonte verificável, a informação não é legitimada.' },
            { t: 'Trecho copiado dos textos motivadores.', ok: false, erro: 'A cópia da coletânea é desconsiderada e não conta como repertório próprio.' }
          ],
          explicacao: 'Repertório legitimado vem de áreas do conhecimento: ciência, história, direito, filosofia, artes. O que importa é a fonte ser reconhecível e confiável.',
          trecho: 'São exemplos de repertório: dados estatísticos, leis, fatos históricos, conceitos teóricos e obras artísticas.'
        },
        {
          id: 'red-enem-repertorio-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que uma “citação coringa” usada sem conexão com o tema rende pouco?',
          modelo: 'Porque o repertório precisa ser pertinente ao tema e articulado ao argumento; solto, ele não sustenta a tese.',
          criterios: [
            { rotulo: 'Cita a falta de pertinência ou relação com o tema', chaves: ['pertin', 'tema', 'relac', 'conex', 'vincul', 'ligac', 'nada a ver'] },
            { rotulo: 'Cita que não sustenta o argumento ou a tese (uso não produtivo)', chaves: ['argument', 'produt', 'tese', 'sustent', 'articul', 'desenvolv', 'fundament'] }
          ],
          explicacao: 'Citações genéricas até podem ser legítimas, mas, se não dialogam com o tema e não são exploradas, não cumprem o papel de sustentar a argumentação.',
          trecho: 'Repertórios desvinculados da discussão não contribuem para o desenvolvimento do tema.'
        },
        {
          id: 'red-enem-repertorio-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Tipos de repertório sociocultural que podem ser usados.',
          verso: 'Dados estatísticos, fatos históricos, leis e artigos da Constituição, conceitos de pensadores, obras literárias, filmes e músicas, acontecimentos atuais com fonte reconhecida.',
          explicacao: 'Variar as fontes ajuda a encontrar o repertório mais pertinente para cada tema.',
          trecho: 'O repertório sociocultural pode vir de diversas áreas do conhecimento, desde que pertinente ao tema.'
        },
        {
          id: 'red-enem-repertorio-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Tema fictício: “O desperdício de alimentos no Brasil”. Um participante quer defender que o desperdício contradiz um direito garantido pelo Estado.',
          enunciado: 'Qual repertório é mais produtivo para esse argumento?',
          passos: [
            'Identificar o argumento: desperdício x direito garantido.',
            'Buscar um repertório legitimado que trate de direito à alimentação.',
            'Verificar se ele se conecta diretamente ao argumento.'
          ],
          opcoes: [
            { t: 'O art. 6º da Constituição, que inclui a alimentação entre os direitos sociais, contrastado com o desperdício.', ok: true },
            { t: 'A ideia de Aristóteles de que o ser humano é um animal político, sem relação explicada.', erro: 'É legítima, mas funciona como citação coringa: não se liga ao direito à alimentação.' },
            { t: 'O fato de a Revolução Industrial ter começado na Inglaterra.', erro: 'É um fato histórico válido, mas não é pertinente ao argumento.' },
            { t: 'Um número visto numa postagem sem fonte.', erro: 'Sem fonte, o dado não é legitimado, por mais que pareça relevante.' }
          ],
          explicacao: 'O art. 6º nomeia o direito que o argumento quer mostrar como descumprido. É legitimado, pertinente e, se contrastado com o desperdício, produtivo.',
          trecho: 'Desde a Emenda Constitucional nº 64, de 2010, a alimentação consta entre os direitos sociais do art. 6º da Constituição.'
        }
      ]
    },
    {
      id: 'red-enem-coesao',
      nome: 'Coesão e argumentação',
      resumo: 'Conectivos entre parágrafos, retomadas e estratégias argumentativas.',
      prereq: ['red-enem-estrutura'],
      fonte: 'Apostila de Redação · ENEM, cap. 4',
      itens: [
        {
          id: 'red-enem-coesao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual expressão é adequada para iniciar a conclusão?',
          opcoes: [
            { t: '“Portanto”.', ok: true },
            { t: '“Em primeiro lugar”.', erro: 'É um marcador de início de sequência, típico do primeiro argumento.' },
            { t: '“Além disso”.', erro: 'Indica adição: serve para acrescentar um novo argumento, não para concluir.' },
            { t: '“Todavia”.', erro: 'Indica oposição; iniciaria uma ideia contrária, não o fechamento.' }
          ],
          explicacao: 'A conclusão retoma o que foi dito; por isso pede conectivos conclusivos, como “portanto”, “logo” ou “diante do exposto”.',
          trecho: 'Conectivos conclusivos sinalizam ao leitor o fechamento da argumentação.'
        },
        {
          id: 'red-enem-coesao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: '“A falta de ciclovias obriga ciclistas a dividir a pista com carros, o que aumenta o risco de acidentes.” É um argumento de:',
          opcoes: [
            { t: 'causa e consequência.', ok: true },
            { t: 'autoridade.', erro: 'Não há citação de especialista ou instituição.' },
            { t: 'exemplificação.', erro: 'Não há um caso concreto citado; há uma cadeia de efeitos.' },
            { t: 'comparação.', erro: 'Não há confronto entre duas realidades.' }
          ],
          explicacao: 'O argumento encadeia fatos: falta de ciclovias leva a dividir a pista, que leva a mais acidentes. Mostrar essa cadeia é típico do raciocínio de causa e consequência.',
          trecho: 'O argumento de causa e consequência explica um problema pela relação entre seus fatores e efeitos.'
        },
        {
          id: 'red-enem-coesao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os usos adequados de coesão numa redação.',
          opcoes: [
            { t: 'Retomar “os jovens” com “esse grupo”.', ok: true },
            { t: 'Usar conectivos entre os parágrafos.', ok: true },
            { t: 'Evitar repetições com sinônimos e hiperônimos.', ok: true },
            { t: 'Usar “mas” para somar ideias semelhantes.', ok: false, erro: '“Mas” indica oposição; para somar ideias, usa-se “além disso”, “também”.' },
            { t: 'Repetir “além disso” no início de todos os parágrafos.', ok: false, erro: 'A repetição do mesmo conectivo empobrece o texto; a C4 valoriza a diversidade de recursos.' }
          ],
          explicacao: 'Na C4, conta a presença de recursos coesivos variados e bem empregados, dentro dos parágrafos e entre eles.',
          trecho: 'A Competência 4 valoriza o repertório diversificado de recursos coesivos, usados com adequação.'
        },
        {
          id: 'red-enem-coesao-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a diferença entre coesão e coerência?',
          modelo: 'Coesão é a ligação entre as partes do texto por conectivos e retomadas; coerência é a lógica do sentido, sem contradições.',
          criterios: [
            { rotulo: 'Define coesão como ligação entre as partes (conectivos, pronomes, retomadas)', chaves: ['conect', 'ligac', 'liga', 'pronom', 'articul', 'retom', 'conexao'] },
            { rotulo: 'Define coerência como lógica ou sentido', chaves: ['sentido', 'logic', 'contradi', 'nexo', 'faz sentido'] }
          ],
          explicacao: 'Um texto pode ter conectivos e ainda ser incoerente, se as ideias se contradizem. A coesão está na superfície; a coerência, na lógica do conjunto.',
          trecho: 'A coesão diz respeito às conexões linguísticas; a coerência, à unidade de sentido do texto.'
        },
        {
          id: 'red-enem-coesao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Estratégias argumentativas mais usadas na redação.',
          verso: 'Dados e estatísticas, argumento de autoridade, exemplificação, causa e consequência, comparação e alusão histórica.',
          explicacao: 'Variar as estratégias deixa a argumentação mais consistente e ajuda a usar o repertório de forma produtiva.',
          trecho: 'As estratégias argumentativas são os modos de fundamentar uma tese diante do leitor.'
        },
        {
          id: 'red-enem-coesao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Rascunho fictício: “A obesidade infantil cresce. As crianças comem ultraprocessados. As crianças ficam muito tempo em telas. As escolas vendem refrigerantes.”',
          enunciado: 'Qual reescrita articula melhor as ideias?',
          passos: [
            'Identificar a relação: consumo, sedentarismo e cantinas são causas do crescimento.',
            'Escolher conectivos de causa e de adição.',
            'Evitar retomadas ambíguas e conectivos com relação errada.'
          ],
          opcoes: [
            { t: 'A obesidade infantil cresce, sobretudo porque as crianças consomem ultraprocessados e passam horas diante de telas; além disso, muitas escolas vendem refrigerantes.', ok: true },
            { t: 'A obesidade infantil cresce; portanto, as crianças comem ultraprocessados e ficam em telas, e as escolas vendem refrigerantes.', erro: 'Inverte causa e consequência: a obesidade viraria o motivo da alimentação ruim.' },
            { t: 'A obesidade infantil cresce, mas as crianças comem ultraprocessados, ficam em telas e as escolas vendem refrigerantes.', erro: 'Usa conectivo de oposição onde não há contraste.' },
            { t: 'A obesidade infantil cresce. Elas comem ultraprocessados. Elas ficam em telas. Elas vendem refrigerantes.', erro: 'Troca repetição por pronome ambíguo (“elas” pode ser crianças ou escolas) e continua sem conectivos.' }
          ],
          explicacao: 'A reescrita correta explicita a causa (“porque”) e acrescenta um fator (“além disso”), deixando claro quem faz o quê. Conectivos só ajudam quando expressam a relação lógica certa.',
          trecho: 'Articular ideias é explicitar suas relações lógicas: causa, adição, oposição ou conclusão.'
        }
      ]
    },
    {
      id: 'red-enem-intervencao',
      nome: 'Proposta de intervenção',
      resumo: 'Os cinco elementos da proposta: agente, ação, meio/modo, finalidade e detalhamento.',
      prereq: ['red-enem-coesao', 'red-enem-repertorio'],
      fonte: 'Apostila de Redação · ENEM, cap. 5',
      itens: [
        {
          id: 'red-enem-intervencao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Quais são os cinco elementos esperados na proposta de intervenção?',
          opcoes: [
            { t: 'Agente, ação, meio/modo, finalidade e detalhamento.', ok: true },
            { t: 'Introdução, tese, argumento, repertório e conclusão.', erro: 'Confunde os elementos da proposta com as partes da estrutura do texto.' },
            { t: 'Problema, causa, consequência, dado e citação.', erro: 'Mistura elementos da argumentação com os da proposta.' },
            { t: 'Tema, título, tese, conectivo e assinatura.', erro: 'Título e assinatura não entram na avaliação; assinatura fora do lugar pode até anular a prova.' }
          ],
          explicacao: 'A proposta responde: quem faz (agente), o que faz (ação), como faz (meio/modo), para quê (finalidade) e dá mais informação sobre algum desses pontos (detalhamento).',
          trecho: 'Uma proposta completa apresenta agente, ação, meio ou modo, finalidade e detalhamento.'
        },
        {
          id: 'red-enem-intervencao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Em “O Ministério da Educação deve criar oficinas de letramento digital, por meio de parcerias com universidades, a fim de incluir os idosos”, o trecho “por meio de parcerias com universidades” é o:',
          opcoes: [
            { t: 'meio/modo.', ok: true },
            { t: 'agente.', erro: 'Confunde parceiros com quem executa: o agente é o Ministério da Educação.' },
            { t: 'finalidade.', erro: 'Confunde “por meio de” com “a fim de”; a finalidade é “incluir os idosos”.' },
            { t: 'ação.', erro: 'A ação é “criar oficinas”; o trecho diz como ela será feita.' }
          ],
          explicacao: 'Meio/modo responde “como?” e costuma vir com “por meio de”, “mediante”, “com o auxílio de”. A finalidade responde “para quê?”, com “a fim de”, “para que”.',
          trecho: 'O meio ou modo explica como a ação será executada; a finalidade indica o efeito pretendido.'
        },
        {
          id: 'red-enem-intervencao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque tudo o que torna uma proposta de intervenção bem avaliada.',
          opcoes: [
            { t: 'Estar articulada à discussão feita no texto.', ok: true },
            { t: 'Respeitar os direitos humanos.', ok: true },
            { t: 'Detalhar ao menos um de seus elementos.', ok: true },
            { t: 'Dizer apenas que “o governo deve fazer algo”.', ok: false, erro: 'Proposta vaga: sem ação concreta, meio e finalidade, ela é pouco desenvolvida.' },
            { t: 'Resolver um problema diferente do discutido.', ok: false, erro: 'A proposta precisa responder ao problema que o texto analisou.' }
          ],
          explicacao: 'A C5 valoriza propostas concretas, detalhadas, ligadas aos argumentos e compatíveis com os direitos humanos.',
          trecho: 'A proposta deve ser concreta, detalhada e articulada à discussão, respeitando os direitos humanos.'
        },
        {
          id: 'red-enem-intervencao-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que é o detalhamento na proposta de intervenção?',
          modelo: 'É uma informação a mais sobre um dos elementos, como explicar melhor a ação ou o agente, tornando a proposta mais concreta.',
          criterios: [
            { rotulo: 'Cita que é uma informação adicional ou explicação', chaves: ['informa', 'explic', 'acrescent', 'adicion', 'amplia', 'especific', 'aprofund', 'complement'] },
            { rotulo: 'Relaciona a um dos outros elementos (agente, ação, meio, finalidade)', chaves: ['agente', 'acao', 'meio', 'modo', 'finalidade', 'elemento'] }
          ],
          explicacao: 'O detalhamento aprofunda um elemento já presente: pode explicar quem é o agente, como a ação funciona ou por que o meio é eficaz.',
          trecho: 'O detalhamento acrescenta informações a um dos elementos da proposta, tornando-a mais precisa.'
        },
        {
          id: 'red-enem-intervencao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Monte um exemplo de proposta e identifique os 5 elementos.',
          verso: '“O Ministério da Saúde (agente), órgão responsável pelas políticas de saúde pública (detalhamento), deve ampliar campanhas de vacinação (ação) por meio de agentes comunitários nas escolas (meio/modo), a fim de elevar a cobertura vacinal infantil (finalidade).”',
          explicacao: 'Perguntar quem, o quê, como e para quê ajuda a não esquecer nenhum elemento.',
          trecho: 'Identificar os elementos numa proposta-modelo ajuda a treinar a construção da própria proposta.'
        },
        {
          id: 'red-enem-intervencao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Tema fictício: “Caminhos para reduzir a evasão escolar no ensino médio”. Quatro participantes escreveram propostas diferentes.',
          enunciado: 'Qual proposta está mais completa e adequada?',
          passos: [
            'Procurar em cada proposta agente, ação, meio/modo, finalidade e detalhamento.',
            'Descartar propostas vagas ou incompletas.',
            'Descartar propostas que violem direitos humanos.'
          ],
          opcoes: [
            { t: 'As secretarias estaduais de Educação, responsáveis pelo ensino médio, devem ampliar bolsas de permanência, por meio de parcerias com empresas locais, a fim de reduzir o abandono por necessidade de trabalho.', ok: true },
            { t: 'É preciso que algo seja feito para diminuir a evasão escolar.', erro: 'Proposta vaga: não tem agente nem meio, e a ação é indefinida.' },
            { t: 'O governo deve criar bolsas para os alunos.', erro: 'Tem agente genérico e ação, mas falta meio, finalidade e detalhamento.' },
            { t: 'As escolas devem expulsar alunos faltosos, por meio de regras rígidas, para dar exemplo aos demais.', erro: 'Tem vários elementos, mas a medida exclui estudantes e fere o direito à educação.' }
          ],
          explicacao: 'A primeira proposta traz os cinco elementos e se relaciona a uma causa real da evasão. Propostas vagas perdem pontos, e as que desrespeitam direitos humanos são problemáticas mesmo se bem estruturadas.',
          trecho: 'A proposta de intervenção deve ser exequível, detalhada e compatível com os direitos humanos.'
        }
      ]
    }
  ]
});
