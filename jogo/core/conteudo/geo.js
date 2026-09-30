(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'geo-brasil',
  materia: 'geo',
  titulo: 'Natureza e sociedade no Brasil',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Clima, biomas, urbanização, problemas ambientais urbanos e matriz energética do Brasil.',
  topicos: [
    {
      id: 'geo-br-clima',
      nome: 'Clima e fatores climáticos',
      resumo: 'Elementos e fatores do clima, massas de ar e os principais tipos climáticos do Brasil.',
      prereq: [],
      fonte: 'Apostila de Geografia · Brasil: natureza, cap. 1',
      itens: [
        {
          id: 'geo-br-clima-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual massa de ar provoca a friagem na Amazônia ocidental?',
          opcoes: [
            { t: 'Massa Polar atlântica (mPa).', ok: true },
            { t: 'Massa Equatorial continental (mEc).', erro: 'Associa a massa que atua na Amazônia à queda de temperatura; a mEc é quente e úmida.' },
            { t: 'Massa Tropical atlântica (mTa).', erro: 'A mTa é quente e úmida e atua sobretudo no litoral, não provoca resfriamento na Amazônia.' },
            { t: 'Massa Tropical continental (mTc).', erro: 'A mTc é quente e seca; não teria como derrubar a temperatura.' }
          ],
          explicacao: 'No inverno, a mPa, fria e úmida, avança pelo interior do continente e pode chegar a Rondônia e ao Acre, derrubando a temperatura por alguns dias. É a friagem.',
          trecho: 'A massa Polar atlântica causa geadas no Sul e, em avanços mais fortes, provoca a friagem na Amazônia ocidental.'
        },
        {
          id: 'geo-br-clima-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a encosta da Serra do Mar voltada para o oceano é tão chuvosa?',
          opcoes: [
            { t: 'O ar úmido vindo do mar sobe a serra, esfria e condensa, formando chuva orográfica.', ok: true },
            { t: 'A altitude aumenta a temperatura, o que eleva a evaporação na encosta.', erro: 'Inverte a relação: a temperatura diminui com a altitude.' },
            { t: 'Correntes marítimas frias no litoral aumentam as chuvas.', erro: 'Correntes frias tendem a reduzir as chuvas, como no deserto do Atacama.' },
            { t: 'A serra impede a entrada de qualquer massa de ar no litoral.', erro: 'Confunde barreira com bloqueio total; a serra força a subida do ar, e é isso que gera a chuva.' }
          ],
          explicacao: 'Ao encontrar o relevo, o ar é forçado a subir. Com a subida, ele se expande e esfria, o vapor condensa e a chuva cai na vertente a barlavento.',
          trecho: 'As chuvas orográficas ocorrem quando o relevo obriga massas de ar úmidas a subir, resfriando-se e condensando.'
        },
        {
          id: 'geo-br-clima-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os FATORES climáticos (e não elementos).',
          opcoes: [
            { t: 'Latitude.', ok: true },
            { t: 'Altitude.', ok: true },
            { t: 'Maritimidade ou continentalidade.', ok: true },
            { t: 'Umidade do ar.', ok: false, erro: 'Umidade é elemento: é algo que se mede no clima, não algo que o influencia de fora.' },
            { t: 'Temperatura.', ok: false, erro: 'Temperatura é elemento; os fatores é que explicam por que ela varia.' }
          ],
          explicacao: 'Elementos (temperatura, umidade, pressão) descrevem o clima. Fatores (latitude, altitude, maritimidade, relevo, massas de ar, correntes marítimas, vegetação) explicam as variações desses elementos.',
          trecho: 'Os fatores climáticos interferem nos elementos do clima, fazendo variar temperatura, umidade e pressão de um lugar para outro.'
        },
        {
          id: 'geo-br-clima-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que cidades litorâneas têm menor amplitude térmica que cidades no interior?',
          modelo: 'Porque a água do mar aquece e esfria mais devagar que a terra, e essa influência (maritimidade) suaviza as variações de temperatura.',
          criterios: [
            { rotulo: 'Cita a influência do mar ou da água', chaves: ['mar', 'ocean', 'agua', 'litor'] },
            { rotulo: 'Explica que a água aquece e esfria mais devagar', chaves: ['devagar', 'lent', 'retem', 'reten', 'armazen', 'conserv', 'calor especif', 'suaviz', 'demora'] }
          ],
          explicacao: 'A água tem alto calor específico: precisa de muita energia para mudar de temperatura. Por isso o mar funciona como regulador térmico, enquanto no interior a continentalidade aumenta a diferença entre máximas e mínimas.',
          trecho: 'A maritimidade reduz a amplitude térmica; a continentalidade a amplia, porque o solo se aquece e se resfria rapidamente.'
        },
        {
          id: 'geo-br-clima-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Diferença entre elementos e fatores do clima, com exemplos.',
          verso: 'Elementos são as características medidas: temperatura, umidade e pressão atmosférica. Fatores são o que as influencia: latitude, altitude, maritimidade/continentalidade, massas de ar, correntes marítimas, relevo e vegetação.',
          explicacao: 'Pensar em causa e efeito ajuda: os fatores são causas, os elementos são o que se observa.',
          trecho: 'O clima resulta da interação entre seus elementos e os fatores geográficos que os modificam.'
        },
        {
          id: 'geo-br-clima-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Dados de duas cidades brasileiras. Cidade A: média de 26 °C o ano todo e cerca de 2.300 mm de chuva, bem distribuída. Cidade B: média de 27 °C e cerca de 500 mm de chuva, concentrada em poucos meses e com anos de seca.',
          enunciado: 'Os climas de A e B são, respectivamente:',
          passos: [
            'Notar que as duas têm temperaturas altas o ano todo, então não são subtropicais nem de altitude.',
            'Em A, chuva muito alta e bem distribuída indica clima equatorial.',
            'Em B, chuva baixa, concentrada e irregular indica o tropical semiárido.'
          ],
          opcoes: [
            { t: 'equatorial e tropical semiárido.', ok: true },
            { t: 'subtropical e equatorial.', erro: 'Ignora a temperatura: o subtropical tem invernos frios, e B é a mais seca, não a mais chuvosa.' },
            { t: 'equatorial e tropical típico.', erro: 'Confunde a estação seca regular do tropical típico, com chuva anual bem maior, com a escassez irregular do semiárido.' },
            { t: 'tropical de altitude e subtropical.', erro: 'Médias acima de 25 °C não combinam com climas de altitude ou subtropicais.' }
          ],
          explicacao: 'A leitura combina temperatura e regime de chuvas. Calor constante com chuva abundante caracteriza o equatorial; calor com pouca chuva e irregular caracteriza o semiárido do Sertão nordestino.',
          trecho: 'O clima tropical semiárido apresenta temperaturas elevadas e chuvas escassas e irregulares, com secas prolongadas.'
        }
      ]
    },
    {
      id: 'geo-br-biomas',
      nome: 'Biomas brasileiros',
      resumo: 'Amazônia, Cerrado, Caatinga, Mata Atlântica, Pampa e Pantanal: características e pressões.',
      prereq: ['geo-br-clima'],
      fonte: 'Apostila de Geografia · Brasil: natureza, cap. 2',
      itens: [
        {
          id: 'geo-br-biomas-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual bioma é exclusivamente brasileiro e tem vegetação que perde as folhas na seca?',
          opcoes: [
            { t: 'Caatinga.', ok: true },
            { t: 'Cerrado.', erro: 'Lembra da estação seca e dos troncos retorcidos do Cerrado, mas ele não é típico do semiárido e se estende a países vizinhos.' },
            { t: 'Pampa.', erro: 'Confunde vegetação baixa com adaptação à seca; o Pampa é campo de clima subtropical úmido e se estende a outros países.' },
            { t: 'Pantanal.', erro: 'Confunde a alternância de cheia e seca do Pantanal com a aridez; ele também ocupa áreas da Bolívia e do Paraguai.' }
          ],
          explicacao: 'A Caatinga tem plantas xerófilas e caducifólias: perder as folhas reduz a perda de água na estação seca. É o único bioma restrito ao território brasileiro.',
          trecho: 'A Caatinga, bioma exclusivamente brasileiro, reúne plantas adaptadas à escassez hídrica, como cactáceas e árvores caducifólias.'
        },
        {
          id: 'geo-br-biomas-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que áreas desmatadas da Amazônia costumam ter solo pouco produtivo?',
          opcoes: [
            { t: 'Porque a floresta vive da reciclagem rápida de nutrientes da matéria orgânica; sem ela, a chuva lava o solo.', ok: true },
            { t: 'Porque o solo amazônico é muito fértil e só se esgota com o uso de agrotóxicos.', erro: 'Supõe que floresta exuberante indica solo rico; em grande parte a fertilidade está na biomassa, não no solo.' },
            { t: 'Porque o desmatamento faz faltar água no solo, como na Caatinga.', erro: 'Transfere o problema da Caatinga; na Amazônia o problema central é a lixiviação pela chuva.' },
            { t: 'Porque o frio da friagem congela o solo desprotegido.', erro: 'A friagem é rara e passageira; não congela o solo nem explica a baixa fertilidade.' }
          ],
          explicacao: 'Os nutrientes circulam entre a serapilheira e as plantas. Sem a cobertura, a chuva intensa carrega os nutrientes (lixiviação) e a produtividade cai em poucos anos.',
          trecho: 'A exuberância da floresta amazônica depende da ciclagem de nutrientes; sem a vegetação, os solos são rapidamente empobrecidos.'
        },
        {
          id: 'geo-br-biomas-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as características do Cerrado.',
          opcoes: [
            { t: 'Árvores de troncos tortuosos e casca grossa.', ok: true },
            { t: 'Raízes profundas que alcançam água no subsolo.', ok: true },
            { t: 'Nascentes de importantes bacias hidrográficas.', ok: true },
            { t: 'Clima semiárido com chuvas irregulares.', ok: false, erro: 'Isso descreve a Caatinga; o Cerrado tem clima tropical com verão chuvoso e inverno seco.' },
            { t: 'Floresta densa e sempre verde.', ok: false, erro: 'Descreve a Amazônia ou a Mata Atlântica; o Cerrado é uma savana.' }
          ],
          explicacao: 'O Cerrado é uma savana adaptada a estação seca e a queimadas naturais. Por abrigar nascentes de várias bacias, é chamado de “berço das águas”, e sofre forte pressão da expansão agropecuária.',
          trecho: 'Segundo maior bioma do país, o Cerrado abriga nascentes de grandes bacias e perdeu grande parte da vegetação para a agropecuária.'
        },
        {
          id: 'geo-br-biomas-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a Mata Atlântica é o bioma mais devastado do Brasil?',
          modelo: 'Porque ocupa a faixa litorânea, onde começou a colonização e hoje se concentram as maiores cidades, a indústria e a agricultura.',
          criterios: [
            { rotulo: 'Cita a ocupação histórica do litoral ou a colonização', chaves: ['litor', 'costa', 'coloniz', 'pau-brasil', 'pau brasil', 'cana', 'histor'] },
            { rotulo: 'Cita cidades, população ou atividades econômicas atuais', chaves: ['cidad', 'urban', 'popula', 'industr', 'metropol', 'agricult', 'agropec', 'ocupa'] }
          ],
          explicacao: 'A devastação é acumulada: pau-brasil, cana, café e depois urbanização e industrialização ocorreram sobre a área original da Mata Atlântica. Hoje resta uma pequena fração da cobertura, fragmentada.',
          trecho: 'Primeiro bioma explorado na colonização, a Mata Atlântica abriga hoje a maior parte da população brasileira e restam dela apenas fragmentos.'
        },
        {
          id: 'geo-br-biomas-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Pantanal: onde fica e o que o caracteriza?',
          verso: 'Planície no Centro-Oeste (MT e MS), uma das maiores áreas úmidas do planeta. Alterna cheias e secas ao longo do ano, o que sustenta grande biodiversidade. Pressões: pecuária, queimadas e assoreamento dos rios.',
          explicacao: 'O pulso de inundação é a chave do Pantanal: a água que sobe e desce renova nutrientes e organiza a vida no bioma.',
          trecho: 'O Pantanal é uma planície sazonalmente inundável, cuja dinâmica de cheias e vazantes sustenta sua biodiversidade.'
        },
        {
          id: 'geo-br-biomas-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Relato fictício de viagem: “No sudoeste do Rio Grande do Sul, a paisagem é de campos de gramíneas sobre coxilhas, com gado solto. Em algumas áreas, surgem manchas de areia exposta onde quase nada cresce, e elas aumentam depois de anos de pastoreio intenso.”',
          enunciado: 'O bioma e o processo descritos são:',
          passos: [
            'Campos de gramíneas e coxilhas no RS indicam o Pampa.',
            'O clima do Pampa é úmido, então a perda de solo não é desertificação.',
            'Areia exposta em solos arenosos frágeis, agravada pelo pisoteio, é arenização.'
          ],
          opcoes: [
            { t: 'Pampa e arenização.', ok: true },
            { t: 'Caatinga e desertificação.', erro: 'Confunde arenização com desertificação, que ocorre em climas secos; o relato é no RS, de clima úmido.' },
            { t: 'Cerrado e laterização.', erro: 'Troca o bioma pelos campos do Centro-Oeste e o processo pela formação de crostas ferruginosas.' },
            { t: 'Pantanal e assoreamento.', erro: 'Associa acúmulo de areia a rios assoreados; o relato descreve campos secos, não planície inundável.' }
          ],
          explicacao: 'No Pampa, solos arenosos frágeis perdem a cobertura vegetal com pisoteio e cultivo, e o vento e a chuva retrabalham a areia. É um processo natural intensificado pelo uso, diferente da desertificação.',
          trecho: 'A arenização, observada no sudoeste gaúcho, é a formação de areais em solos arenosos de clima úmido, intensificada pelo manejo inadequado.'
        }
      ]
    },
    {
      id: 'geo-br-urbanizacao',
      nome: 'Urbanização brasileira',
      resumo: 'Êxodo rural, urbanização tardia e acelerada, metropolização, conurbação e segregação socioespacial.',
      prereq: [],
      fonte: 'Apostila de Geografia · Brasil: sociedade, cap. 3',
      itens: [
        {
          id: 'geo-br-urbanizacao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Conurbação é:',
          opcoes: [
            { t: 'a junção física das áreas urbanas de municípios vizinhos.', ok: true },
            { t: 'uma cidade grande que polariza toda uma região.', erro: 'Confunde conurbação com metrópole.' },
            { t: 'a união de várias metrópoles ao longo de um eixo.', erro: 'Confunde com megalópole, que é uma escala maior, entre metrópoles.' },
            { t: 'a troca de moradores pobres por mais ricos num bairro revalorizado.', erro: 'Confunde com gentrificação.' }
          ],
          explicacao: 'Na conurbação, as manchas urbanas crescem até se encontrarem, e o limite entre os municípios deixa de ser visível na paisagem, como no ABC paulista.',
          trecho: 'A conurbação ocorre quando o crescimento urbano une as malhas de cidades vizinhas, formando uma só mancha.'
        },
        {
          id: 'geo-br-urbanizacao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a urbanização brasileira foi acelerada e desigual?',
          opcoes: [
            { t: 'O êxodo rural, movido pela mecanização e pela concentração de terras, superou a capacidade de planejamento das cidades.', ok: true },
            { t: 'Uma ampla reforma agrária liberou mão de obra do campo para as indústrias.', erro: 'Não houve reforma agrária ampla; foi a concentração fundiária que expulsou trabalhadores.' },
            { t: 'Ela foi lenta, ao longo de séculos, como na Europa.', erro: 'Confunde o ritmo: no Brasil a mudança ocorreu em poucas décadas, sobretudo após 1950.' },
            { t: 'As cidades cresceram só pelo crescimento vegetativo, sem migração.', erro: 'Ignora o peso da migração campo-cidade e inter-regional.' }
          ],
          explicacao: 'Milhões de pessoas migraram para as cidades em poucas décadas, atraídas pela indústria e expulsas pela modernização do campo. Sem moradia e infraestrutura suficientes, cresceram periferias e favelas.',
          trecho: 'A modernização conservadora do campo e a industrialização do Sudeste impulsionaram um êxodo rural intenso a partir de 1950.'
        },
        {
          id: 'geo-br-urbanizacao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os problemas ligados à urbanização acelerada no Brasil.',
          opcoes: [
            { t: 'Favelização e ocupação de áreas de risco.', ok: true },
            { t: 'Segregação socioespacial.', ok: true },
            { t: 'Déficit de saneamento e de transporte público.', ok: true },
            { t: 'Distribuição equilibrada da população entre as regiões.', ok: false, erro: 'Ocorreu o contrário: concentração no Sudeste e no litoral.' },
            { t: 'Planejamento prévio de todas as grandes cidades.', ok: false, erro: 'Generaliza exceções como Brasília; a maioria cresceu sem planejamento.' }
          ],
          explicacao: 'O ritmo da urbanização não foi acompanhado de investimentos em habitação e serviços. A população de baixa renda foi empurrada para periferias e áreas de risco.',
          trecho: 'O crescimento urbano desordenado gerou carências em habitação, saneamento e mobilidade, especialmente nas periferias.'
        },
        {
          id: 'geo-br-urbanizacao-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que é segregação socioespacial?',
          modelo: 'É a separação da população na cidade conforme a renda: os mais ricos vivem em áreas com boa infraestrutura, e os mais pobres, em periferias precárias.',
          criterios: [
            { rotulo: 'Relaciona a separação à renda ou à classe social', chaves: ['renda', 'rico', 'pobre', 'classe', 'social', 'econom', 'desigual'] },
            { rotulo: 'Cita a separação no espaço da cidade (bairros, periferias, áreas)', chaves: ['bairro', 'periferi', 'area', 'regio', 'centro', 'favel', 'morad', 'local'] }
          ],
          explicacao: 'A segregação se vê no mapa da cidade: a renda define onde se mora, e a localização define o acesso a emprego, transporte, saúde e lazer.',
          trecho: 'A segregação socioespacial expressa no território as desigualdades de renda, separando áreas valorizadas e periferias precárias.'
        },
        {
          id: 'geo-br-urbanizacao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Por que a urbanização brasileira é chamada de “tardia e acelerada”?',
          verso: 'Tardia porque ganhou força só no século XX, sobretudo após 1950, com a industrialização. Acelerada porque, em poucas décadas, a população urbana superou a rural (anos 1960) e passou de 80% (Censo 2010: cerca de 84%).',
          explicacao: 'Comparar com os países pioneiros ajuda: lá o processo levou mais de um século; aqui, poucas décadas.',
          trecho: 'Entre 1960 e 1970, a população urbana brasileira ultrapassou a rural, em um processo muito mais rápido que o europeu.'
        },
        {
          id: 'geo-br-urbanizacao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Dados fictícios: o município Y, a 30 km da capital, tinha 60 mil habitantes em 1980 e 400 mil em 2020. Hoje suas ruas se emendam às da capital, e a maioria dos moradores trabalha lá e volta para casa à noite.',
          enunciado: 'A situação ilustra:',
          passos: [
            'Ruas que se emendam às da capital indicam conurbação.',
            'Ir trabalhar na capital e voltar todo dia é movimento pendular.',
            'Por isso Y funciona como cidade-dormitório.'
          ],
          opcoes: [
            { t: 'conurbação e movimento pendular, com Y funcionando como cidade-dormitório.', ok: true },
            { t: 'êxodo urbano, com moradores deixando a capital para o campo.', erro: 'Inverte o fluxo: Y é urbano e integrado à capital, não rural.' },
            { t: 'transumância, migração sazonal de trabalhadores.', erro: 'Confunde deslocamento diário com migração sazonal.' },
            { t: 'gentrificação, com a troca de moradores por outros de renda maior.', erro: 'Não há dado sobre mudança de renda dos moradores; o dado central é o deslocamento diário.' }
          ],
          explicacao: 'O crescimento de Y integrou fisicamente sua malha à da capital. Como o emprego se concentra na capital, os moradores fazem o trajeto diário de ida e volta.',
          trecho: 'Nas regiões metropolitanas, o movimento pendular liga cidades-dormitório aos centros onde se concentram os empregos.'
        }
      ]
    },
    {
      id: 'geo-br-ambiente-urbano',
      nome: 'Questões ambientais urbanas',
      resumo: 'Ilhas de calor, inversão térmica e enchentes: como a cidade altera o clima e a água.',
      prereq: ['geo-br-urbanizacao', 'geo-br-clima'],
      fonte: 'Apostila de Geografia · Brasil: sociedade, cap. 4',
      itens: [
        {
          id: 'geo-br-ambiente-urbano-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'A inversão térmica é mais comum no inverno e consiste em:',
          opcoes: [
            { t: 'uma camada de ar frio presa junto ao solo sob uma camada mais quente, retendo poluentes.', ok: true },
            { t: 'o mesmo fenômeno do efeito estufa, só que em escala local.', erro: 'Confunde fenômenos: o efeito estufa é a retenção de calor pela atmosfera global.' },
            { t: 'uma consequência direta do buraco na camada de ozônio.', erro: 'Mistura problemas: a camada de ozônio filtra radiação ultravioleta e não controla a circulação do ar próxima ao solo.' },
            { t: 'o ar quente subindo rapidamente no verão e espalhando a poluição.', erro: 'Descreve a situação normal, de dispersão; a inversão é justamente o bloqueio dessa subida.' }
          ],
          explicacao: 'Normalmente o ar próximo ao solo é mais quente e sobe, dispersando poluentes. Em noites frias de inverno, o solo esfria rápido e o ar frio fica embaixo, sem subir, prendendo a poluição.',
          trecho: 'Na inversão térmica, o ar frio e denso permanece junto à superfície, sob uma camada mais quente, impedindo a dispersão dos poluentes.'
        },
        {
          id: 'geo-br-ambiente-urbano-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Como a impermeabilização do solo agrava as enchentes urbanas?',
          opcoes: [
            { t: 'Asfalto e concreto impedem a infiltração, e mais água escoa, mais rápido, para os rios.', ok: true },
            { t: 'O asfalto faz o lençol freático subir até a superfície.', erro: 'Inverte o efeito: sem infiltração, o lençol recebe menos água, não mais.' },
            { t: 'Não agrava; as enchentes ocorrem só porque chove mais hoje do que antes.', erro: 'Atribui tudo à chuva e ignora o papel do uso do solo no escoamento.' },
            { t: 'A canalização dos rios resolve o problema, então a impermeabilização não importa.', erro: 'Canalizar e retificar acelera a água e pode transferir a enchente para outros trechos.' }
          ],
          explicacao: 'Em solo coberto, a chuva não infiltra e vira escoamento superficial. Com várzeas ocupadas e bueiros entupidos, o volume chega aos rios de uma vez e transborda.',
          trecho: 'A impermeabilização do solo aumenta o volume e a velocidade do escoamento superficial, agravando as enchentes.'
        },
        {
          id: 'geo-br-ambiente-urbano-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as medidas que ajudam a reduzir ilhas de calor.',
          opcoes: [
            { t: 'Arborização de ruas e praças.', ok: true },
            { t: 'Telhados verdes e superfícies claras.', ok: true },
            { t: 'Criação de parques e áreas verdes.', ok: true },
            { t: 'Ampliação das áreas asfaltadas.', ok: false, erro: 'O asfalto absorve e retém calor, reforçando a ilha de calor.' },
            { t: 'Prédios altos e colados que bloqueiam o vento.', ok: false, erro: 'Bloquear a ventilação dificulta a dissipação do calor.' }
          ],
          explicacao: 'Vegetação sombreia e refresca pela evapotranspiração; superfícies claras refletem mais radiação. Tudo que troca superfícies escuras e densas por verde ou materiais claros reduz o aquecimento.',
          trecho: 'Áreas verdes e materiais de alta refletância atenuam as ilhas de calor urbanas.'
        },
        {
          id: 'geo-br-ambiente-urbano-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Explique como se forma uma ilha de calor.',
          modelo: 'Asfalto, concreto e prédios absorvem e retêm calor, e a pouca vegetação e o calor de carros e indústrias deixam o centro urbano mais quente que o entorno.',
          criterios: [
            { rotulo: 'Cita materiais ou construções urbanas (asfalto, concreto, prédios)', chaves: ['asfalt', 'concret', 'constru', 'predio', 'edific', 'paviment', 'cimento'] },
            { rotulo: 'Cita a falta de vegetação, a retenção de calor ou o calor de veículos e indústrias', chaves: ['vegeta', 'arvor', 'verde', 'absorv', 'retem', 'reten', 'acumul', 'carro', 'veicul', 'industr'] }
          ],
          explicacao: 'O centro urbano troca vegetação por superfícies que armazenam calor durante o dia e o liberam à noite. Somado ao calor das atividades humanas, isso eleva a temperatura em relação à periferia e à zona rural.',
          trecho: 'A ilha de calor é a elevação da temperatura nas áreas centrais das cidades, causada pela substituição da vegetação por superfícies construídas.'
        },
        {
          id: 'geo-br-ambiente-urbano-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Ilha de calor x inversão térmica: qual a diferença?',
          verso: 'Ilha de calor: o centro da cidade fica mais quente que o entorno, por causa do asfalto, do concreto e da falta de verde. Inversão térmica: ar frio preso junto ao solo sob ar mais quente, típico de manhãs frias de inverno, que retém a poluição.',
          explicacao: 'Uma é diferença de temperatura no espaço (centro x periferia); a outra é uma inversão na distribuição vertical do ar.',
          trecho: 'Ilha de calor e inversão térmica são fenômenos distintos, embora ambos afetem a qualidade de vida nas grandes cidades.'
        },
        {
          id: 'geo-br-ambiente-urbano-6', tipo: 'transfer', formato: 'aberta', nivel: 'aplicar', dif: 3,
          contexto: 'Notícia fictícia: “Em manhã fria e sem vento de julho, a cidade amanheceu sob uma névoa acinzentada, e os postos de saúde registraram mais casos de crises respiratórias. À tarde, com o sol forte e a volta do vento, o céu clareou.”',
          enunciado: 'Qual fenômeno explica a notícia e por que a poluição ficou presa pela manhã?',
          passos: [
            'Observar as pistas: inverno, manhã fria, ausência de vento.',
            'Lembrar que nessas condições o ar frio fica embaixo, sob uma camada mais quente.',
            'Concluir que os poluentes não sobem nem se dispersam até o solo aquecer.'
          ],
          modelo: 'Inversão térmica: o ar frio ficou preso junto ao solo sob uma camada de ar mais quente, impedindo a dispersão dos poluentes até o aquecimento da tarde.',
          criterios: [
            { rotulo: 'Identifica a inversão térmica', chaves: ['invers'] },
            { rotulo: 'Explica o ar frio preso embaixo de ar quente', chaves: ['ar frio', 'camada', 'quente', 'preso', 'embaixo', 'junto ao solo'] },
            { rotulo: 'Relaciona à retenção ou não dispersão dos poluentes', chaves: ['poluen', 'dispers', 'poluic', 'fumaca', 'retid', 'reten'] }
          ],
          explicacao: 'A combinação de frio, manhã e falta de vento é o cenário típico da inversão térmica. Quando o sol aquece o solo, o ar volta a subir e a névoa poluída se dissipa.',
          trecho: 'A inversão térmica agrava a poluição em grandes cidades no inverno, elevando os problemas respiratórios.'
        }
      ]
    },
    {
      id: 'geo-br-energia',
      nome: 'Matriz energética',
      resumo: 'Fontes de energia do Brasil, matriz energética x matriz elétrica, hidrelétricas e novas renováveis.',
      prereq: ['geo-br-biomas'],
      fonte: 'Apostila de Geografia · Brasil: economia, cap. 5',
      itens: [
        {
          id: 'geo-br-energia-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual fonte gera a maior parte da eletricidade no Brasil?',
          opcoes: [
            { t: 'Hidráulica.', ok: true },
            { t: 'Carvão mineral.', erro: 'Transfere o padrão de países como a China; no Brasil o carvão tem papel pequeno na eletricidade.' },
            { t: 'Petróleo e derivados.', erro: 'Confunde matriz energética com matriz elétrica: o petróleo pesa muito nos transportes, não na geração de eletricidade.' },
            { t: 'Nuclear.', erro: 'Superestima Angra 1 e 2, que respondem por uma parcela pequena da geração.' }
          ],
          explicacao: 'A abundância de rios de planalto favoreceu grandes hidrelétricas. Por isso a eletricidade brasileira é majoritariamente renovável.',
          trecho: 'As usinas hidrelétricas respondem pela maior parte da geração de energia elétrica do Brasil.'
        },
        {
          id: 'geo-br-energia-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que a matriz elétrica brasileira é mais renovável que a matriz energética?',
          opcoes: [
            { t: 'A matriz energética inclui transportes e indústria, que dependem muito do petróleo, e a elétrica vem sobretudo de hidrelétricas.', ok: true },
            { t: 'As duas são a mesma coisa, com nomes diferentes.', erro: 'Confunde os conceitos: a energética abrange toda a energia consumida; a elétrica, só a eletricidade.' },
            { t: 'A matriz energética considera apenas fontes fósseis.', erro: 'A energética inclui renováveis, como biomassa da cana e hidráulica.' },
            { t: 'O Brasil importa toda a energia fóssil que consome.', erro: 'O Brasil é grande produtor de petróleo, inclusive do pré-sal.' }
          ],
          explicacao: 'Matriz energética soma todas as fontes: combustíveis de veículos, energia da indústria, eletricidade. Como os transportes usam muito diesel e gasolina, a parcela renovável fica menor que na eletricidade.',
          trecho: 'Cerca de metade da matriz energética brasileira é renovável, proporção bem acima da média mundial; na matriz elétrica, a parcela renovável é ainda maior.'
        },
        {
          id: 'geo-br-energia-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os impactos de grandes hidrelétricas na Amazônia.',
          opcoes: [
            { t: 'Alagamento de áreas de floresta.', ok: true },
            { t: 'Deslocamento de ribeirinhos e povos indígenas.', ok: true },
            { t: 'Emissão de metano pela decomposição da vegetação submersa.', ok: true },
            { t: 'Emissão zero de gases em todas as etapas.', ok: false, erro: 'Confunde renovável com impacto zero: construção e reservatórios também emitem gases.' },
            { t: 'Fim da dependência das chuvas para gerar energia.', ok: false, erro: 'Inverte a relação: hidrelétricas dependem diretamente do regime de chuvas.' }
          ],
          explicacao: 'Ser renovável não significa ser livre de impactos. Reservatórios alagam ecossistemas, alteram rios e modos de vida, e a matéria orgânica submersa libera metano.',
          trecho: 'Grandes usinas na Amazônia, como Belo Monte, no rio Xingu, geraram debates sobre impactos ambientais e sociais.'
        },
        {
          id: 'geo-br-energia-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Por que, em anos de seca, a conta de luz tende a ficar mais cara no Brasil?',
          modelo: 'Com os reservatórios baixos, as hidrelétricas geram menos, e é preciso acionar termelétricas, que usam combustíveis mais caros.',
          criterios: [
            { rotulo: 'Cita reservatórios baixos ou menor geração hidrelétrica', chaves: ['reservat', 'hidrel', 'agua', 'represa', 'nivel', 'estiag'] },
            { rotulo: 'Cita o uso de termelétricas ou combustíveis mais caros', chaves: ['termel', 'termoel', 'combust', 'fossil', 'carvao', 'diesel', 'gas natural', 'queima'] }
          ],
          explicacao: 'O sistema depende das chuvas. Quando a água falta, entram usinas térmicas com custo de operação maior, e o sistema de bandeiras tarifárias repassa esse custo ao consumidor.',
          trecho: 'Em períodos de estiagem, o acionamento de termelétricas eleva o custo da energia e as emissões do setor elétrico.'
        },
        {
          id: 'geo-br-energia-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'O que foi o Proálcool?',
          verso: 'Programa lançado em 1975, após a crise do petróleo de 1973, para substituir parte da gasolina por etanol de cana-de-açúcar. Base dos carros a álcool e, depois, dos motores flex.',
          explicacao: 'O programa mostra como choques externos redesenham a matriz: a alta do petróleo levou o país a apostar na biomassa da cana.',
          trecho: 'Criado em 1975, o Proálcool estimulou a produção de etanol como alternativa à gasolina importada.'
        },
        {
          id: 'geo-br-energia-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Gráfico descrito: no Nordeste, a geração eólica é maior entre julho e novembro. Nesse mesmo período, o nível dos reservatórios das hidrelétricas costuma estar mais baixo.',
          enunciado: 'A conclusão mais adequada é:',
          passos: [
            'Comparar as duas curvas: quando uma cai, a outra sobe.',
            'Lembrar que o vento é intermitente e não substitui sozinho a base do sistema.',
            'Concluir que as fontes se complementam e a eólica ajuda a poupar água no período seco.'
          ],
          opcoes: [
            { t: 'As fontes se complementam: a eólica ajuda a poupar água dos reservatórios no período seco.', ok: true },
            { t: 'Os ventos fortes causam a queda do nível dos reservatórios.', erro: 'Confunde coincidência no tempo com relação de causa.' },
            { t: 'A eólica pode substituir totalmente as hidrelétricas, pois não varia.', erro: 'Ignora que o vento é intermitente e sazonal, como o próprio gráfico mostra.' },
            { t: 'Parques eólicos só funcionam ao lado de hidrelétricas.', erro: 'Confunde complementaridade no sistema interligado com proximidade física.' }
          ],
          explicacao: 'O pico dos ventos no Nordeste coincide com a estação seca em boa parte do país. Integradas pelo sistema elétrico nacional, eólicas e hidrelétricas aumentam a segurança do abastecimento.',
          trecho: 'A complementaridade entre a geração eólica do Nordeste e a hidrelétrica reduz a necessidade de acionar termelétricas nos meses secos.'
        }
      ]
    }
  ]
});
