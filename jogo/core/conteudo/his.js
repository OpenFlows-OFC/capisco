(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'his-republica',
  materia: 'his',
  titulo: 'Brasil República',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Da Proclamação da República à Constituição de 1988: oligarquias, Vargas, populismo, ditadura e redemocratização.',
  topicos: [
    {
      id: 'his-rep-primeira',
      nome: 'Primeira República',
      resumo: 'Oligarquias, café com leite, política dos governadores, coronelismo e a crise que levou à Revolução de 1930.',
      prereq: [],
      fonte: 'Apostila de História · Brasil República, cap. 1',
      itens: [
        {
          id: 'his-rep-primeira-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'A chamada “política do café com leite” na Primeira República foi:',
          opcoes: [
            { t: 'o revezamento na Presidência entre as oligarquias de São Paulo e Minas Gerais.', ok: true },
            { t: 'uma política econômica de incentivo à exportação de café e laticínios.', erro: 'Interpreta o apelido ao pé da letra: “café” e “leite” eram símbolos de SP e MG, não produtos de uma política de exportação.' },
            { t: 'o acordo em que os coronéis trocavam votos por cargos com o governo federal.', erro: 'Mistura com a política dos governadores e o coronelismo, que são outros mecanismos do mesmo sistema oligárquico.' },
            { t: 'a aliança entre Minas Gerais e Rio Grande do Sul contra São Paulo.', erro: 'Confunde com a Aliança Liberal de 1930, que justamente marcou a ruptura do café com leite.' }
          ],
          explicacao: 'O apelido associa São Paulo (café) e Minas Gerais (gado leiteiro), os estados mais ricos e populosos, que dominavam a indicação dos presidentes. O arranjo não era uma regra escrita e teve exceções, mas marcou o período.',
          trecho: 'Entre 1894 e 1930, as oligarquias paulista e mineira controlaram a sucessão presidencial, arranjo conhecido como política do café com leite.'
        },
        {
          id: 'his-rep-primeira-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que o voto aberto era peça-chave do coronelismo?',
          opcoes: [
            { t: 'Porque permitia ao coronel fiscalizar em quem seus dependentes votavam.', ok: true },
            { t: 'Porque o coronel era um oficial do Exército que comandava as eleições.', erro: 'Toma “coronel” como patente militar da ativa; na prática era um chefe político local, geralmente grande proprietário de terras.' },
            { t: 'Porque garantia o voto das mulheres, base eleitoral dos coronéis.', erro: 'Anacronismo: as mulheres só conquistaram o direito ao voto com o Código Eleitoral de 1932.' },
            { t: 'Porque o voto aberto impedia qualquer tipo de fraude eleitoral.', erro: 'Inverte o efeito: sem sigilo, o eleitor ficava exposto à pressão, e as fraudes (como o “bico de pena”) eram comuns.' }
          ],
          explicacao: 'Sem voto secreto, o eleitor que dependia do coronel para trabalho, terra ou favores votava sob vigilância. Esse controle ficou conhecido como voto de cabresto e formava os “currais eleitorais”.',
          trecho: 'A Constituição de 1891 manteve o voto aberto, o que favorecia o voto de cabresto: o eleitor votava sob a vigilância do chefe político local.'
        },
        {
          id: 'his-rep-primeira-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as características da Primeira República (1889–1930).',
          opcoes: [
            { t: 'Voto aberto e exclusão dos analfabetos do eleitorado.', ok: true },
            { t: 'Política dos governadores, criada no governo Campos Sales.', ok: true },
            { t: 'Revoltas populares como Canudos e a Revolta da Vacina.', ok: true },
            { t: 'Voto feminino garantido pela Constituição de 1891.', ok: false, erro: 'A Constituição de 1891 não garantiu o voto feminino; ele veio com o Código Eleitoral de 1932.' },
            { t: 'Criação da Consolidação das Leis do Trabalho (CLT).', ok: false, erro: 'A CLT é de 1943, no Estado Novo de Vargas.' }
          ],
          explicacao: 'O período combinou um sistema político excludente (voto aberto, analfabetos fora) com pactos entre oligarquias. As tensões sociais apareceram em revoltas no campo e na cidade.',
          trecho: 'A República oligárquica restringia a participação política, e a exclusão social se expressou em conflitos como Canudos (1896–1897) e a Revolta da Vacina (1904).'
        },
        {
          id: 'his-rep-primeira-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Em uma frase, explique como funcionava a política dos governadores.',
          modelo: 'O presidente apoiava as oligarquias que governavam os estados e, em troca, elas elegiam bancadas no Congresso que apoiavam o governo federal.',
          criterios: [
            { rotulo: 'Cita as oligarquias ou os governos estaduais', chaves: ['oligarq', 'governador', 'estad'] },
            { rotulo: 'Cita o apoio no Congresso ao presidente', chaves: ['congress', 'bancad', 'deputad', 'legislativ', 'parlament', 'senad'] }
          ],
          explicacao: 'Era uma troca de apoio: o governo federal não interferia nos estados e reconhecia os aliados eleitos, enquanto as oligarquias garantiam deputados e senadores governistas. A Comissão de Verificação de Poderes barrava opositores eleitos.',
          trecho: 'Com a política dos governadores, Campos Sales (1898–1902) assegurou uma base parlamentar fiel em troca do apoio às oligarquias estaduais.'
        },
        {
          id: 'his-rep-primeira-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Quais fatores levaram à Revolução de 1930?',
          verso: 'Crise de 1929 (queda do café), rompimento do café com leite com a indicação do paulista Júlio Prestes, formação da Aliança Liberal (MG, RS e PB) com Getúlio Vargas, derrota eleitoral contestada e assassinato de João Pessoa. O movimento depôs Washington Luís e levou Vargas ao poder.',
          explicacao: 'A crise econômica enfraqueceu a oligarquia cafeeira no mesmo momento em que o acordo entre SP e MG se rompeu, abrindo espaço para a oposição chegar ao poder pelas armas.',
          trecho: 'Em outubro de 1930, tropas ligadas à Aliança Liberal depuseram Washington Luís, encerrando a Primeira República.'
        },
        {
          id: 'his-rep-primeira-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Carta fictícia de 1912: “Compadre, o pessoal da fazenda já sabe em quem votar. A mesa é nossa e a ata sai como combinamos. Em troca, o governo do estado garante a nomeação do nosso delegado.”',
          enunciado: 'A carta evidencia qual prática política?',
          passos: [
            'Identificar quem controla o voto: o fazendeiro que dá ordens aos trabalhadores.',
            'Notar a fraude na ata e a vigilância possível porque o voto era aberto.',
            'Relacionar a troca de votos por cargos com o pacto entre coronéis e governo estadual.'
          ],
          opcoes: [
            { t: 'Coronelismo, com voto de cabresto e fraude, sustentado pela troca de favores com o governo estadual.', ok: true },
            { t: 'Tenentismo, com militares disputando eleições no interior.', erro: 'Confunde o controle rural do voto com o tenentismo, movimento de jovens oficiais que combatia justamente as oligarquias.' },
            { t: 'Populismo, com um líder carismático mobilizando as massas urbanas.', erro: 'Leva para a Primeira República um fenômeno típico de 1930–1964, baseado nas massas urbanas, e não no controle rural.' },
            { t: 'Voto secreto, já que cada eleitor decidia sozinho na fazenda.', erro: 'Anacronismo: o voto secreto só foi instituído pelo Código Eleitoral de 1932.' }
          ],
          explicacao: 'O coronel controla o voto dos dependentes, frauda a ata e recebe do governo estadual cargos locais em troca. É a engrenagem que ligava o município ao estado e, pela política dos governadores, ao governo federal.',
          trecho: 'O coronelismo era um compromisso entre o poder privado dos chefes locais e o poder público: votos em troca de cargos e favores.'
        }
      ]
    },
    {
      id: 'his-rep-vargas',
      nome: 'Era Vargas',
      resumo: 'Governo Provisório, Constituição de 1934, Estado Novo, trabalhismo e industrialização estatal (1930–1945).',
      prereq: ['his-rep-primeira'],
      fonte: 'Apostila de História · Brasil República, cap. 2',
      itens: [
        {
          id: 'his-rep-vargas-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O Código Eleitoral de 1932 instituiu:',
          opcoes: [
            { t: 'o voto secreto, o voto feminino e a Justiça Eleitoral.', ok: true },
            { t: 'o voto dos analfabetos.', erro: 'Anacronismo: analfabetos só voltaram a votar em 1985, e a Constituição de 1988 tornou esse voto facultativo.' },
            { t: 'o voto aberto, para dar transparência às eleições.', erro: 'Inverte a mudança: o voto aberto era a marca da Primeira República; o código de 1932 trouxe o voto secreto.' },
            { t: 'eleições diretas para presidente durante o Estado Novo.', erro: 'Confunde fases: o Estado Novo (1937–1945) foi uma ditadura sem eleições presidenciais.' }
          ],
          explicacao: 'O código respondeu às críticas às fraudes da Primeira República: o voto secreto dificultava o cabresto, e a Justiça Eleitoral passou a organizar as eleições. As mulheres conquistaram o direito ao voto.',
          trecho: 'O Código Eleitoral de 1932 criou a Justiça Eleitoral e instituiu o voto secreto e o voto feminino, confirmados pela Constituição de 1934.'
        },
        {
          id: 'his-rep-vargas-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que se diz que a política trabalhista de Vargas combinava concessão e controle?',
          opcoes: [
            { t: 'Porque garantiu direitos, como salário mínimo e CLT, mas atrelou os sindicatos ao Ministério do Trabalho.', ok: true },
            { t: 'Porque proibiu todos os sindicatos e, em troca, criou o salário mínimo.', erro: 'Confunde controle com proibição: os sindicatos existiam, mas precisavam do reconhecimento do Estado.' },
            { t: 'Porque os direitos vieram só de greves, sem nenhuma participação do Estado.', erro: 'Ignora o papel central do Estado, que legislou e apresentou os direitos como concessão do governo.' },
            { t: 'Porque a CLT beneficiou igualmente trabalhadores urbanos e rurais.', erro: 'A CLT deixou a maior parte dos trabalhadores rurais de fora; o foco era o operariado urbano.' }
          ],
          explicacao: 'O governo ampliou direitos e, ao mesmo tempo, enquadrou os sindicatos: registro no Ministério do Trabalho, sindicato único por categoria e imposto sindical. Isso reduzia a autonomia operária e criava base de apoio ao governo.',
          trecho: 'O trabalhismo varguista concedeu direitos trabalhistas e subordinou os sindicatos ao Estado, reduzindo sua autonomia.'
        },
        {
          id: 'his-rep-vargas-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as características do Estado Novo (1937–1945).',
          opcoes: [
            { t: 'Censura e propaganda feitas pelo DIP.', ok: true },
            { t: 'Constituição outorgada em 1937, apelidada de “Polaca”.', ok: true },
            { t: 'Fechamento do Congresso Nacional.', ok: true },
            { t: 'Eleições diretas regulares para presidente.', ok: false, erro: 'O Estado Novo foi uma ditadura: não houve eleição presidencial no período.' },
            { t: 'Criação da Petrobras.', ok: false, erro: 'A Petrobras é de 1953, no segundo governo Vargas, já eleito na República de 1946.' }
          ],
          explicacao: 'Com o golpe de 1937, justificado pelo falso Plano Cohen, Vargas fechou o Congresso, outorgou uma constituição autoritária e controlou a informação pelo Departamento de Imprensa e Propaganda.',
          trecho: 'Em novembro de 1937, Vargas instaurou o Estado Novo: Congresso fechado, partidos extintos e imprensa censurada.'
        },
        {
          id: 'his-rep-vargas-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a Constituição de 1937 ficou conhecida como “Polaca”?',
          modelo: 'Porque foi inspirada na constituição autoritária da Polônia e concentrava os poderes no Executivo.',
          criterios: [
            { rotulo: 'Cita a inspiração na Polônia', chaves: ['polon'] },
            { rotulo: 'Cita o caráter autoritário ou a concentração de poder', chaves: ['autorit', 'concentr', 'executiv', 'ditad', 'centraliz', 'poder'] }
          ],
          explicacao: 'O apelido vem do modelo polonês de 1935, também autoritário. O texto, redigido por Francisco Campos, foi outorgado, ou seja, imposto sem assembleia constituinte, e dava amplos poderes ao presidente.',
          trecho: 'Outorgada em 1937, a Constituição “Polaca” fortaleceu o Executivo e suprimiu garantias individuais.'
        },
        {
          id: 'his-rep-vargas-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Quais são as três fases da Era Vargas (1930–1945)?',
          verso: 'Governo Provisório (1930–1934); Governo Constitucional (1934–1937), com a Constituição de 1934; Estado Novo (1937–1945), ditadura encerrada com a deposição de Vargas em 1945.',
          explicacao: 'A divisão segue as bases legais do poder: primeiro por decreto, depois sob uma constituição promulgada e, por fim, sob uma constituição outorgada.',
          trecho: 'A Era Vargas divide-se em Governo Provisório, Governo Constitucional e Estado Novo.'
        },
        {
          id: 'his-rep-vargas-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Trecho fictício de programa de rádio, 1942: “Neste 1º de Maio, o Chefe da Nação saúda os operários que ganharam do governo o salário mínimo. Nenhuma voz de desordem será ouvida, porque o Brasil marcha unido.” A transmissão era obrigatória em todas as emissoras.',
          enunciado: 'A situação exemplifica:',
          passos: [
            'Situar a data: 1942 está no Estado Novo.',
            'Notar a imagem de Vargas como doador de direitos aos trabalhadores.',
            'Ligar “nenhuma voz de desordem” e a transmissão obrigatória à censura e à propaganda estatal.'
          ],
          opcoes: [
            { t: 'o uso da propaganda estatal, via DIP, para construir a imagem de Vargas como protetor dos trabalhadores.', ok: true },
            { t: 'a liberdade de imprensa garantida pela Constituição de 1934.', erro: 'Confunde fases: em 1942 vigorava a Constituição de 1937, e havia censura.' },
            { t: 'a campanha eleitoral de Vargas contra candidatos da oposição.', erro: 'Não havia eleições no Estado Novo; a propaganda não disputava votos, legitimava a ditadura.' },
            { t: 'a propaganda integralista contra o governo Vargas.', erro: 'A Ação Integralista foi extinta em 1937; o texto exalta o governo, não o critica.' }
          ],
          explicacao: 'O Estado Novo usou o rádio para difundir o culto a Vargas e o trabalhismo, apresentando direitos como presente do governo. A mesma estrutura, o DIP, censurava vozes críticas.',
          trecho: 'Criado em 1939, o DIP controlava a imprensa e o rádio e promovia a imagem de Vargas como “pai dos pobres”.'
        }
      ]
    },
    {
      id: 'his-rep-populista',
      nome: 'República Populista',
      resumo: 'De Dutra a Jango (1946–1964): populismo, nacionalismo, desenvolvimentismo de JK e a crise que antecedeu o golpe.',
      prereq: ['his-rep-vargas'],
      fonte: 'Apostila de História · Brasil República, cap. 3',
      itens: [
        {
          id: 'his-rep-populista-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'A campanha “O petróleo é nosso” resultou na criação da Petrobras em:',
          opcoes: [
            { t: '1953, no governo eleito de Getúlio Vargas.', ok: true },
            { t: '1941, durante o Estado Novo.', erro: 'Confunde com as estatais da primeira fase de Vargas, como a CSN (1941) e a Vale do Rio Doce (1942).' },
            { t: '1958, como parte do Plano de Metas de JK.', erro: 'Associa toda grande empresa ao desenvolvimentismo de JK, que apostou mais no capital estrangeiro.' },
            { t: '1964, logo após o golpe militar.', erro: 'Anacronismo: a Petrobras já existia havia mais de uma década.' }
          ],
          explicacao: 'O segundo governo Vargas (1951–1954) teve forte tom nacionalista. A Lei 2.004, de 1953, criou a Petrobras e o monopólio estatal da exploração de petróleo.',
          trecho: 'A campanha “O petróleo é nosso” mobilizou estudantes, militares e sindicatos e culminou na criação da Petrobras em 1953.'
        },
        {
          id: 'his-rep-populista-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que o parlamentarismo foi adotado em 1961?',
          opcoes: [
            { t: 'Como saída negociada para Jango tomar posse com poderes reduzidos, diante da resistência de militares e conservadores.', ok: true },
            { t: 'Porque a população escolheu esse sistema em plebiscito.', erro: 'Inverte o plebiscito: o de 1963 restaurou o presidencialismo; o parlamentarismo foi adotado pelo Congresso.' },
            { t: 'Porque a Constituição de 1946 o exigia após qualquer renúncia.', erro: 'Não havia essa regra: a Constituição previa a posse do vice, que era justamente o que se tentava barrar.' },
            { t: 'Por iniciativa de Jango, para ampliar seus próprios poderes.', erro: 'Inverte o sentido: o parlamentarismo limitou os poderes de Jango, que depois lutou pela volta do presidencialismo.' }
          ],
          explicacao: 'Com a renúncia de Jânio Quadros, ministros militares vetaram a posse do vice João Goulart, visto como ligado à esquerda. A Campanha da Legalidade resistiu, e o Congresso aprovou o parlamentarismo como acordo.',
          trecho: 'Em 1961, a emenda parlamentarista permitiu a posse de João Goulart, mas transferiu parte de seus poderes a um primeiro-ministro.'
        },
        {
          id: 'his-rep-populista-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as marcas do governo Juscelino Kubitschek (1956–1961).',
          opcoes: [
            { t: 'Construção e inauguração de Brasília.', ok: true },
            { t: 'Instalação da indústria automobilística com capital estrangeiro.', ok: true },
            { t: 'Aumento da inflação e da dívida externa.', ok: true },
            { t: 'Criação da Petrobras.', ok: false, erro: 'A Petrobras é de 1953, no governo Vargas.' },
            { t: 'Lançamento das Reformas de Base.', ok: false, erro: 'As Reformas de Base foram a bandeira de João Goulart (1961–1964).' }
          ],
          explicacao: 'O Plano de Metas (“50 anos em 5”) acelerou a industrialização com investimento público em energia e transporte e abertura ao capital externo. O custo veio em inflação e endividamento.',
          trecho: 'O desenvolvimentismo de JK combinou Estado, capital nacional e capital estrangeiro, mas deixou inflação alta e dívida externa crescente.'
        },
        {
          id: 'his-rep-populista-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que foram as Reformas de Base? Cite ao menos uma e o presidente que as propôs.',
          modelo: 'Foram reformas estruturais, como a agrária, a urbana e a educacional, propostas pelo presidente João Goulart.',
          criterios: [
            { rotulo: 'Cita ao menos uma reforma (agrária, urbana, educacional, eleitoral, bancária ou tributária)', chaves: ['agrar', 'urban', 'educac', 'eleitor', 'bancar', 'tribut', 'fiscal', 'universit'] },
            { rotulo: 'Associa as reformas a João Goulart', chaves: ['jango', 'goulart', 'joao'] }
          ],
          explicacao: 'As reformas buscavam mudar estruturas ligadas à desigualdade, como a concentração de terras. Setores conservadores as viam como ameaça, o que aprofundou a crise que levou ao golpe de 1964.',
          trecho: 'As Reformas de Base defendidas por Goulart incluíam a reforma agrária, a urbana, a educacional e a extensão do voto aos analfabetos.'
        },
        {
          id: 'his-rep-populista-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'O que caracteriza o populismo no Brasil (1946–1964)?',
          verso: 'Relação direta entre um líder carismático e as massas urbanas, com concessões aos trabalhadores e, ao mesmo tempo, controle sobre suas organizações. Os principais partidos eram PSD, PTB e UDN.',
          explicacao: 'O conceito é usado para explicar como líderes buscavam apoio popular nas cidades em crescimento, equilibrando concessões e controle.',
          trecho: 'Na República de 1946, o populismo marcou a relação entre governantes e trabalhadores urbanos, em meio à disputa entre PSD, PTB e UDN.'
        },
        {
          id: 'his-rep-populista-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Duas manchetes fictícias de março de 1964: “Em comício no Rio, presidente anuncia desapropriação de terras às margens de rodovias federais” (dia 13). “Multidão marcha em São Paulo em defesa da família e contra o comunismo” (dia 19).',
          enunciado: 'As manchetes revelam:',
          passos: [
            'Reconhecer no comício as Reformas de Base de Jango, como a reforma agrária.',
            'Reconhecer na marcha a reação de setores conservadores e religiosos.',
            'Situar o medo do “comunismo” no contexto da Guerra Fria, às vésperas do golpe de 31 de março.'
          ],
          opcoes: [
            { t: 'a polarização entre apoiadores das reformas e setores conservadores, no contexto da Guerra Fria, que antecedeu o golpe.', ok: true },
            { t: 'um consenso nacional em torno das Reformas de Base.', erro: 'Ignora que as duas manchetes mostram lados opostos mobilizados nas ruas.' },
            { t: 'a disputa eleitoral para a Presidência em 1964.', erro: 'Não houve eleição presidencial em 1964; a próxima estava prevista para 1965.' },
            { t: 'a oposição da esquerda a um governo considerado conservador.', erro: 'Inverte as posições: o governo propunha reformas, e a oposição vinha da direita.' }
          ],
          explicacao: 'O Comício da Central e a Marcha da Família com Deus pela Liberdade mostram a radicalização de março de 1964. Parte das elites, da classe média e dos militares, temendo o comunismo, apoiou a deposição de Jango.',
          trecho: 'Em março de 1964, a polarização entre reformistas e conservadores chegou às ruas; no fim do mês, um golpe civil-militar depôs João Goulart.'
        }
      ]
    },
    {
      id: 'his-rep-ditadura',
      nome: 'Ditadura Militar',
      resumo: 'O regime de 1964–1985: atos institucionais, repressão, milagre econômico e abertura política.',
      prereq: ['his-rep-populista'],
      fonte: 'Apostila de História · Brasil República, cap. 4',
      itens: [
        {
          id: 'his-rep-ditadura-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O AI-5, de dezembro de 1968:',
          opcoes: [
            { t: 'permitiu fechar o Congresso e suspendeu o habeas corpus para crimes políticos.', ok: true },
            { t: 'criou o bipartidarismo entre ARENA e MDB.', erro: 'Confunde com o AI-2, de 1965, que extinguiu os partidos e abriu caminho para o bipartidarismo.' },
            { t: 'concedeu anistia aos presos e exilados políticos.', erro: 'Anacronismo: a Lei da Anistia é de 1979, na fase de abertura.' },
            { t: 'restabeleceu as eleições diretas para presidente.', erro: 'Inverte o sentido: o AI-5 endureceu o regime; as eleições diretas para presidente só voltaram em 1989.' }
          ],
          explicacao: 'Editado no governo Costa e Silva, o AI-5 deu ao presidente poderes para fechar o Legislativo, cassar mandatos e suspender direitos. Abriu o período mais repressivo do regime.',
          trecho: 'O AI-5 inaugurou os “anos de chumbo”, com censura prévia, cassações e suspensão do habeas corpus em crimes políticos.'
        },
        {
          id: 'his-rep-ditadura-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que o “milagre econômico” (1968–1973) é visto com ressalvas?',
          opcoes: [
            { t: 'Porque o crescimento se apoiou em endividamento externo e arrocho salarial, concentrando renda.', ok: true },
            { t: 'Porque o PIB caiu ano após ano no período.', erro: 'Confunde com a crise dos anos 1980; no “milagre”, o PIB cresceu a taxas muito altas.' },
            { t: 'Porque a economia foi fechada ao capital estrangeiro.', erro: 'O modelo atraiu capital e empréstimos externos, o que ajudou a gerar a dívida.' },
            { t: 'Porque o governo priorizou dividir a renda antes de crescer.', erro: 'Inverte o discurso da época, que defendia crescer primeiro para depois distribuir.' }
          ],
          explicacao: 'O crescimento foi real, mas os salários foram contidos e a renda se concentrou. A dependência de empréstimos cobrou seu preço após as crises do petróleo.',
          trecho: 'O milagre econômico registrou altas taxas de crescimento, acompanhadas de concentração de renda e aumento da dívida externa.'
        },
        {
          id: 'his-rep-ditadura-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as medidas da abertura política (1974–1985).',
          opcoes: [
            { t: 'Revogação do AI-5, em vigor até o fim de 1978.', ok: true },
            { t: 'Lei da Anistia, de 1979.', ok: true },
            { t: 'Fim do bipartidarismo, em 1979.', ok: true },
            { t: 'Edição do AI-2.', ok: false, erro: 'O AI-2 é de 1965, na fase de consolidação do regime, não da abertura.' },
            { t: 'Aprovação da Emenda Dante de Oliveira.', ok: false, erro: 'A emenda das Diretas foi rejeitada pela Câmara em 1984.' }
          ],
          explicacao: 'Geisel e Figueiredo conduziram uma abertura controlada, sob pressão da crise econômica e da oposição. As medidas afrouxaram o regime sem entregar de imediato o poder.',
          trecho: 'A abertura avançou com o fim do AI-5, a anistia e a volta do pluripartidarismo, mas a eleição de 1985 ainda foi indireta.'
        },
        {
          id: 'his-rep-ditadura-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que significava a abertura “lenta, gradual e segura” de Geisel?',
          modelo: 'Era uma transição para a democracia feita aos poucos e controlada pelos próprios militares, para evitar rupturas.',
          criterios: [
            { rotulo: 'Cita a transição para a democracia', chaves: ['democra', 'transic', 'liberaliz', 'abert', 'redemocra'] },
            { rotulo: 'Cita o controle dos militares ou do governo sobre o processo', chaves: ['militar', 'control', 'governo', 'regime', 'geisel'] }
          ],
          explicacao: 'O governo queria definir ritmo e limites da transição, evitando punições aos agentes do regime e a chegada da oposição ao poder sem controle.',
          trecho: 'Geisel anunciou uma distensão “lenta, gradual e segura”, conduzida pelo próprio regime.'
        },
        {
          id: 'his-rep-ditadura-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Quais foram os presidentes militares, em ordem?',
          verso: 'Castelo Branco (1964–1967), Costa e Silva (1967–1969), Junta Militar (1969), Médici (1969–1974), Geisel (1974–1979) e Figueiredo (1979–1985).',
          explicacao: 'Ordenar os governos ajuda a situar marcos: AI-5 com Costa e Silva, milagre e repressão com Médici, abertura com Geisel e Figueiredo.',
          trecho: 'Os presidentes militares eram escolhidos pelo alto comando e confirmados por eleição indireta.'
        },
        {
          id: 'his-rep-ditadura-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Situação fictícia: em 1973, um leitor abre o jornal e encontra, no meio da página de política, uma receita de bolo sem relação com o resto da página. No dia seguinte, outra receita aparece no mesmo espaço.',
          enunciado: 'A explicação mais provável é:',
          passos: [
            'Situar 1973: o AI-5 estava em vigor.',
            'Lembrar que havia censura prévia a jornais.',
            'Concluir que o texto estranho ocupava o lugar de uma matéria vetada e sinalizava o corte ao leitor.'
          ],
          opcoes: [
            { t: 'Censura prévia: o jornal preenchia com receitas o espaço de matérias vetadas.', ok: true },
            { t: 'Falta de notícias políticas por causa da tranquilidade do período.', erro: 'Toma o silêncio da imprensa como calmaria, sem considerar a censura.' },
            { t: 'Estratégia comercial para atrair leitoras.', erro: 'Ignora o contexto político: o texto aparece fora da seção de culinária, no espaço da política.' },
            { t: 'Efeito da Lei da Anistia, que liberou a imprensa.', erro: 'Anacronismo: a anistia é de 1979, e a liberação não explicaria um texto fora de lugar.' }
          ],
          explicacao: 'Sob o AI-5, censores vetavam matérias. Alguns jornais publicavam receitas ou versos no lugar do texto cortado, um jeito de avisar o leitor de que algo foi censurado.',
          trecho: 'Com o AI-5, a censura prévia atingiu jornais, músicas e peças; alguns veículos denunciavam os cortes com textos deslocados.'
        }
      ]
    },
    {
      id: 'his-rep-redemocratizacao',
      nome: 'Redemocratização e CF/1988',
      resumo: 'Diretas Já, eleição indireta de 1985, Assembleia Constituinte e os direitos da Constituição Cidadã.',
      prereq: ['his-rep-ditadura'],
      fonte: 'Apostila de História · Brasil República, cap. 5',
      itens: [
        {
          id: 'his-rep-redemocratizacao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual mudança eleitoral veio com a Constituição de 1988?',
          opcoes: [
            { t: 'Voto facultativo para jovens de 16 e 17 anos.', ok: true },
            { t: 'O direito de voto das mulheres.', erro: 'Anacronismo: o voto feminino existe desde o Código Eleitoral de 1932.' },
            { t: 'A criação do voto secreto.', erro: 'O voto secreto também vem de 1932; a Constituição de 1988 o manteve.' },
            { t: 'O fim do voto obrigatório para todos.', erro: 'Generaliza o voto facultativo: ele vale para 16–17 anos, maiores de 70 e analfabetos; para os demais adultos, o voto é obrigatório.' }
          ],
          explicacao: 'A Constituição ampliou o eleitorado: tornou facultativo o voto de jovens de 16 e 17 anos, de maiores de 70 e de analfabetos, mantendo obrigatório o voto entre 18 e 70 anos.',
          trecho: 'A Constituição de 1988 manteve o voto direto, secreto, universal e periódico e estendeu o direito facultativo aos jovens de 16 e 17 anos.'
        },
        {
          id: 'his-rep-redemocratizacao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a Constituição de 1988 foi chamada de “Constituição Cidadã”?',
          opcoes: [
            { t: 'Porque ampliou direitos sociais e individuais e recebeu emendas populares durante a Constituinte.', ok: true },
            { t: 'Porque seu texto foi aprovado pela população em plebiscito.', erro: 'Confunde com o plebiscito de 1993, que tratou só da forma e do sistema de governo; o texto foi votado pela Assembleia.' },
            { t: 'Porque foi outorgada pelos militares para marcar o fim do regime.', erro: 'Confunde outorgada e promulgada: ela foi promulgada por uma Assembleia eleita.' },
            { t: 'Porque foi a primeira constituição brasileira a garantir o direito de voto.', erro: 'Todas as constituições republicanas previam voto; o que mudou foi a ampliação e as garantias.' }
          ],
          explicacao: 'O apelido, popularizado por Ulysses Guimarães, destaca a ampliação de direitos após a ditadura e a participação da sociedade, que apresentou emendas com assinaturas populares.',
          trecho: 'Promulgada em 5 de outubro de 1988, a Constituição ampliou direitos e garantias e ficou conhecida como “Constituição Cidadã”.'
        },
        {
          id: 'his-rep-redemocratizacao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as determinações da Constituição de 1988.',
          opcoes: [
            { t: 'Racismo como crime inafiançável e imprescritível.', ok: true },
            { t: 'Saúde como direito de todos e dever do Estado, base do SUS.', ok: true },
            { t: 'Reconhecimento dos direitos indígenas sobre as terras que tradicionalmente ocupam.', ok: true },
            { t: 'Pena de morte para crimes hediondos em tempo de paz.', ok: false, erro: 'A Constituição proíbe a pena de morte, salvo em caso de guerra declarada.' },
            { t: 'Eleição indireta para presidente pelo Colégio Eleitoral.', ok: false, erro: 'Confunde com a eleição de 1985; a Constituição de 1988 garante eleição direta.' }
          ],
          explicacao: 'O texto respondeu a demandas de movimentos sociais: combate ao racismo, saúde universal e direitos indígenas. Também protege garantias como a vedação à pena de morte em tempo de paz.',
          trecho: 'A Constituição de 1988 criou o SUS, tornou o racismo crime inafiançável e reconheceu os direitos originários dos povos indígenas.'
        },
        {
          id: 'his-rep-redemocratizacao-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Por que a eleição de Tancredo Neves, em 1985, ainda não foi uma eleição democrática plena?',
          modelo: 'Porque foi indireta, feita pelo Colégio Eleitoral, já que a emenda das Diretas foi rejeitada e o povo não votou.',
          criterios: [
            { rotulo: 'Cita que foi indireta ou pelo Colégio Eleitoral', chaves: ['indiret', 'colegio'] },
            { rotulo: 'Cita a rejeição das Diretas ou a ausência do voto popular', chaves: ['emenda', 'dante', 'rejeit', 'povo', 'popula', 'nao vot', 'sem vot'] }
          ],
          explicacao: 'Apesar da campanha das Diretas Já, a Emenda Dante de Oliveira foi derrotada em 1984. Tancredo venceu no Colégio Eleitoral, mas morreu antes da posse, e José Sarney assumiu.',
          trecho: 'Em janeiro de 1985, o Colégio Eleitoral elegeu Tancredo Neves, primeiro civil escolhido para a Presidência desde 1964.'
        },
        {
          id: 'his-rep-redemocratizacao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'O que são as cláusulas pétreas da Constituição de 1988?',
          verso: 'Pontos que não podem ser abolidos nem por emenda: forma federativa de Estado; voto direto, secreto, universal e periódico; separação dos Poderes; direitos e garantias individuais (art. 60, § 4º).',
          explicacao: 'As cláusulas pétreas funcionam como trava contra retrocessos: nem uma emenda aprovada no Congresso pode suprimi-las.',
          trecho: 'O art. 60, § 4º, veda emendas tendentes a abolir a Federação, o voto direto e secreto, a separação dos Poderes e os direitos individuais.'
        },
        {
          id: 'his-rep-redemocratizacao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Notícia fictícia: um deputado apresenta uma proposta de emenda à Constituição para que o voto para presidente passe a ser aberto, “para dar mais transparência”. Ele diz que conseguirá 3/5 dos votos nas duas Casas.',
          enunciado: 'Pela Constituição de 1988, essa emenda:',
          passos: [
            'Identificar que a proposta mexe no voto secreto.',
            'Lembrar que o voto direto, secreto, universal e periódico é cláusula pétrea.',
            'Concluir que nem com o quórum de emenda ela pode ser aprovada.'
          ],
          opcoes: [
            { t: 'não pode ser aprovada, pois o voto secreto é cláusula pétrea.', ok: true },
            { t: 'pode ser aprovada se tiver 3/5 dos votos em dois turnos nas duas Casas.', erro: 'Confunde o rito da emenda com seus limites: o quórum não vale para cláusulas pétreas.' },
            { t: 'pode ser aprovada se passar por plebiscito.', erro: 'Supõe que consulta popular libera qualquer mudança; a vedação do art. 60 continua valendo.' },
            { t: 'só pode ser proposta pelo presidente da República.', erro: 'Troca o problema de conteúdo por um de iniciativa; deputados podem propor emendas, mas não sobre esse ponto.' }
          ],
          explicacao: 'Emendas exigem 3/5 em dois turnos em cada Casa, mas há limites materiais: o que tende a abolir o voto secreto não pode nem ser deliberado. O sigilo protege o eleitor de pressões, como o cabresto da Primeira República.',
          trecho: 'Não será objeto de deliberação a proposta de emenda tendente a abolir o voto direto, secreto, universal e periódico.'
        }
      ]
    }
  ]
});
