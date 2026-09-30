(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'bio-genetica',
  materia: 'bio',
  titulo: 'Genética mendeliana',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Da diferença entre gene e alelo até heredogramas, di-hibridismo e grupos sanguíneos, do jeito que o ENEM cobra.',
  topicos: [
    // ------------------------------------------------------------------
    {
      id: 'bio-gen-conceitos',
      nome: 'Gene, alelo e genótipo',
      resumo: 'O vocabulário básico da genética: gene, alelo, lócus, homozigoto, heterozigoto, genótipo e fenótipo.',
      prereq: [],
      fonte: 'Apostila de Biologia · Genética, cap. 1',
      itens: [
        {
          id: 'bio-gen-conceitos-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que são alelos?',
          opcoes: [
            { t: 'Genes diferentes localizados no mesmo cromossomo.', erro: 'Confunde alelos (versões de um mesmo gene) com genes distintos que estão no mesmo cromossomo.' },
            { t: 'Formas alternativas de um mesmo gene, que ocupam o mesmo lócus em cromossomos homólogos.', ok: true },
            { t: 'As duas cromátides-irmãs de um cromossomo duplicado.', erro: 'Confunde cromossomos homólogos com cromátides-irmãs, que são cópias idênticas após a duplicação do DNA.' },
            { t: 'O conjunto de características observáveis de um indivíduo.', erro: 'Confunde alelo com fenótipo.' }
          ],
          explicacao: 'Um gene pode existir em versões diferentes, os alelos. Como os cromossomos vêm em pares homólogos, cada indivíduo diploide tem dois alelos para cada gene, um em cada homólogo, no mesmo lócus.',
          trecho: 'Alelos são formas alternativas de um gene que ocupam a mesma posição (lócus) em cromossomos homólogos. Cada indivíduo diploide possui dois alelos para cada gene.'
        },
        {
          id: 'bio-gen-conceitos-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Duas plantas têm flores vermelhas: uma é VV e a outra é Vv (V domina v). O que se pode afirmar?',
          opcoes: [
            { t: 'Têm o mesmo genótipo, já que exibem a mesma cor.', erro: 'Supõe que o mesmo fenótipo implica o mesmo genótipo.' },
            { t: 'Ambas são homozigotas, pois o alelo v não aparece na cor.', erro: 'Acha que só é heterozigoto quem manifesta os dois alelos; na dominância completa o recessivo fica oculto.' },
            { t: 'Têm o mesmo fenótipo e genótipos diferentes.', ok: true },
            { t: 'Têm fenótipos diferentes, pois os genótipos são diferentes.', erro: 'Ignora a dominância completa: um único V já basta para a flor ser vermelha.' }
          ],
          explicacao: 'Com dominância completa, um único alelo V já determina flor vermelha. Por isso VV e Vv produzem o mesmo fenótipo, embora a composição de alelos (genótipo) seja diferente.',
          trecho: 'Genótipo é a constituição genética do indivíduo; fenótipo é a característica expressa. Na dominância completa, homozigotos dominantes e heterozigotos apresentam o mesmo fenótipo.'
        },
        {
          id: 'bio-gen-conceitos-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as afirmações corretas.',
          opcoes: [
            { t: 'O fenótipo resulta da interação entre o genótipo e o ambiente.', ok: true },
            { t: 'Um indivíduo aa é homozigoto recessivo.', ok: true },
            { t: 'Um heterozigoto tem dois alelos diferentes para o mesmo gene.', ok: true },
            { t: 'O alelo recessivo só existe em quem manifesta a característica recessiva.', ok: false, erro: 'Esquece que heterozigotos carregam o alelo recessivo sem manifestá-lo (são portadores).' },
            { t: 'Alelo dominante é o mais frequente na população.', ok: false, erro: 'Confunde dominância (relação entre alelos no indivíduo) com frequência do alelo na população.' }
          ],
          explicacao: 'Dominância descreve qual alelo se expressa no heterozigoto, não quão comum ele é. E o recessivo pode estar escondido em heterozigotos, que o transmitem sem manifestá-lo.',
          trecho: 'Indivíduos heterozigotos (Aa) carregam o alelo recessivo sem expressá-lo. A dominância de um alelo não tem relação com sua frequência na população.'
        },
        {
          id: 'bio-gen-conceitos-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a diferença entre um indivíduo homozigoto e um heterozigoto para um gene?',
          modelo: 'O homozigoto tem dois alelos iguais para o gene (AA ou aa), e o heterozigoto tem dois alelos diferentes (Aa).',
          criterios: [
            { rotulo: 'Homozigoto: alelos iguais', chaves: ['igua', 'mesmo alelo', 'mesmos alelos', 'identic'] },
            { rotulo: 'Heterozigoto: alelos diferentes', chaves: ['diferen', 'distint'] }
          ],
          explicacao: 'O prefixo diz tudo: homo = igual, hetero = diferente. A comparação é sempre entre os dois alelos que o indivíduo tem para aquele gene.',
          trecho: 'Homozigoto é o indivíduo que possui alelos iguais para um gene (AA ou aa); heterozigoto possui alelos diferentes (Aa).'
        },
        {
          id: 'bio-gen-conceitos-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'O que é lócus gênico?',
          verso: 'É o local fixo que um gene ocupa no cromossomo. Os alelos de um mesmo gene ficam no mesmo lócus, em cromossomos homólogos.',
          explicacao: 'Lócus é o “endereço” do gene no cromossomo. Por isso se diz que alelos são versões do gene que disputam o mesmo endereço nos dois homólogos.',
          trecho: 'Lócus (plural: loci) é a posição ocupada por um gene em um cromossomo.'
        },
        {
          id: 'bio-gen-conceitos-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Coelhos da raça himalaia têm pelo branco no corpo e preto nas orelhas, patas e focinho, as partes mais frias. Num experimento, raspa-se o pelo das costas de um desses coelhos e mantém-se uma bolsa de gelo no local. O pelo que nasce ali é preto.',
          enunciado: 'O que o experimento mostra?',
          passos: [
            'Todas as células do coelho vêm do mesmo zigoto, então têm o mesmo genótipo.',
            'A única coisa que mudou nas costas foi a temperatura.',
            'Logo, a cor diferente é efeito do ambiente sobre a expressão do gene: fenótipo = genótipo + ambiente.'
          ],
          opcoes: [
            { t: 'O frio causou uma mutação no gene da cor nas células das costas.', erro: 'Confunde alteração na expressão de um gene com alteração do próprio DNA.' },
            { t: 'O genótipo é o mesmo no corpo todo; a temperatura altera a expressão do gene e, com isso, o fenótipo.', ok: true },
            { t: 'As costas e as orelhas do coelho têm genótipos diferentes.', erro: 'Supõe que cada parte do corpo tem genótipo próprio, esquecendo que todas as células vêm do mesmo zigoto.' },
            { t: 'O gelo só revelou uma cor que já existia, sem influência do ambiente.', erro: 'Ignora que o ambiente participa da formação do fenótipo.' }
          ],
          explicacao: 'No coelho himalaia, a enzima que produz o pigmento só funciona em temperaturas mais baixas. O gene é o mesmo em todo o corpo; o que muda é se ele consegue se expressar.',
          trecho: 'O fenótipo resulta da interação entre o genótipo e o ambiente. No coelho himalaia, a produção de pigmento depende da temperatura da pele.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'bio-gen-mendel1',
      nome: '1ª Lei de Mendel',
      resumo: 'Segregação dos alelos na formação dos gametas, proporções 3:1 e 1:2:1 e cruzamento-teste.',
      prereq: ['bio-gen-conceitos'],
      fonte: 'Apostila de Biologia · Genética, cap. 2',
      itens: [
        {
          id: 'bio-gen-mendel1-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que diz a 1ª Lei de Mendel (lei da segregação)?',
          opcoes: [
            { t: 'Genes de características diferentes se distribuem de forma independente nos gametas.', erro: 'Confunde a 1ª Lei com a 2ª Lei (segregação independente).' },
            { t: 'Cada gameta recebe os dois fatores do par, um de cada genitor.', erro: 'Esquece que os gametas são haploides e levam só um alelo de cada par.' },
            { t: 'O alelo dominante tem mais chance de ser transmitido aos filhos.', erro: 'Acha que a dominância afeta a probabilidade de transmissão; os dois alelos têm chance de 1/2.' },
            { t: 'Cada característica é determinada por um par de fatores que se separam na formação dos gametas.', ok: true }
          ],
          explicacao: 'Na meiose, os cromossomos homólogos se separam e cada gameta leva só um alelo de cada gene. Num heterozigoto Aa, metade dos gametas leva A e metade leva a.',
          trecho: 'Primeira Lei de Mendel: cada caráter é condicionado por um par de fatores que se separam na formação dos gametas, de modo que cada gameta recebe apenas um fator do par.'
        },
        {
          id: 'bio-gen-mendel1-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Cruzam-se dois heterozigotos Aa (A dominante). Qual a proporção fenotípica esperada na prole?',
          opcoes: [
            { t: '1 : 2 : 1', erro: 'Confunde a proporção genotípica (1 AA : 2 Aa : 1 aa) com a fenotípica.' },
            { t: '3 dominantes : 1 recessivo', ok: true },
            { t: '1 dominante : 1 recessivo', erro: 'Usa o resultado do cruzamento-teste (Aa × aa).' },
            { t: 'Todos com fenótipo dominante', erro: 'Confunde com o cruzamento AA × aa, em que toda a prole é Aa.' }
          ],
          explicacao: 'Aa × Aa gera 1 AA : 2 Aa : 1 aa. Como AA e Aa têm o mesmo fenótipo, juntam-se 3 partes com fenótipo dominante para 1 com fenótipo recessivo.',
          trecho: 'No cruzamento entre heterozigotos, a proporção genotípica esperada é 1 AA : 2 Aa : 1 aa, e a fenotípica, 3 : 1, quando há dominância completa.'
        },
        {
          id: 'bio-gen-mendel1-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'No cruzamento Aa × Aa, marque todas as corretas.',
          opcoes: [
            { t: '1/4 da prole esperada é AA.', ok: true },
            { t: '3/4 da prole esperada é homozigota.', ok: false, erro: 'Soma errado: homozigotos são AA + aa = 1/4 + 1/4 = 1/2.' },
            { t: '1/2 da prole esperada é heterozigota.', ok: true },
            { t: 'Entre os filhos de fenótipo dominante, 2/3 são heterozigotos.', ok: true },
            { t: 'Se nascerem 4 filhotes, exatamente 1 será aa.', ok: false, erro: 'Trata a probabilidade como garantia; em amostras pequenas o resultado pode variar bastante.' }
          ],
          explicacao: 'Entre os dominantes (AA + 2 Aa = 3 partes), 2 das 3 são Aa, daí os 2/3. E proporções são probabilidades: só se aproximam do esperado com muitos descendentes.',
          trecho: 'As proporções mendelianas expressam probabilidades. Entre os descendentes de fenótipo dominante de um cruzamento Aa × Aa, a chance de ser heterozigoto é 2/3.'
        },
        {
          id: 'bio-gen-mendel1-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Para que serve o cruzamento-teste e com quem se cruza o indivíduo testado?',
          modelo: 'Serve para descobrir se um indivíduo de fenótipo dominante é homozigoto ou heterozigoto; ele é cruzado com um homozigoto recessivo (aa).',
          criterios: [
            { rotulo: 'Objetivo: descobrir o genótipo do indivíduo dominante', chaves: ['genotip', 'heterozig', 'puro', 'descobrir se'] },
            { rotulo: 'Cruza com um homozigoto recessivo', chaves: ['recessiv'] }
          ],
          explicacao: 'O homozigoto recessivo só passa alelo a, então o fenótipo dos filhos revela o alelo que veio do testado. Se aparecer algum filho recessivo, o testado é heterozigoto.',
          trecho: 'Cruzamento-teste é o cruzamento de um indivíduo de fenótipo dominante com um homozigoto recessivo, para determinar se ele é homozigoto ou heterozigoto.'
        },
        {
          id: 'bio-gen-mendel1-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Proporções do cruzamento Aa × Aa',
          verso: 'Genotípica: 1 AA : 2 Aa : 1 aa. Fenotípica: 3 dominantes : 1 recessivo (com dominância completa).',
          explicacao: 'Cada genitor forma metade dos gametas A e metade a. Combinando: 1/4 AA, 1/2 Aa e 1/4 aa.',
          trecho: 'O quadro de Punnett do cruzamento Aa × Aa apresenta quatro combinações igualmente prováveis: AA, Aa, aA e aa.'
        },
        {
          id: 'bio-gen-mendel1-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Um criador tem um cão de pelo preto (B, dominante sobre b, marrom) e quer saber se ele é BB. Cruza o cão com uma fêmea marrom, e nascem 6 filhotes: 3 pretos e 3 marrons.',
          enunciado: 'Qual é o genótipo do cão preto?',
          passos: [
            'A fêmea marrom é bb: só produz gametas b.',
            'Um filhote marrom é bb: recebeu b da mãe e b do pai.',
            'Como o pai é preto, tem ao menos um B; logo é Bb. A proporção 1:1 confirma.'
          ],
          opcoes: [
            { t: 'BB, porque ele é preto e o preto é dominante.', erro: 'Supõe que fenótipo dominante implica homozigose.' },
            { t: 'Não dá para saber; seria preciso cruzá-lo com uma fêmea preta.', erro: 'Não reconhece o cruzamento com o recessivo como o teste mais informativo.' },
            { t: 'bb, já que metade dos filhotes saiu marrom.', erro: 'Ignora que o pai tem fenótipo preto, então carrega pelo menos um B.' },
            { t: 'Bb, porque os filhotes marrons (bb) receberam um b do pai.', ok: true }
          ],
          explicacao: 'Esse é um cruzamento-teste: a fêmea bb só contribui com b, então cada filhote marrom prova que o pai também passou um b. Um pai BB teria só filhotes pretos.',
          trecho: 'No cruzamento-teste, o surgimento de descendentes com fenótipo recessivo indica que o indivíduo testado é heterozigoto.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'bio-gen-heredograma',
      nome: 'Heredogramas',
      resumo: 'Leitura de genealogias: símbolos, pistas de herança dominante e recessiva e cálculo de probabilidades.',
      prereq: ['bio-gen-mendel1'],
      fonte: 'Apostila de Biologia · Genética, cap. 3',
      itens: [
        {
          id: 'bio-gen-heredograma-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Num heredograma, o que representam o quadrado e o círculo?',
          opcoes: [
            { t: 'Quadrado: pessoa afetada; círculo: pessoa normal.', erro: 'Confunde a forma do símbolo com o preenchimento; quem tem a característica aparece com o símbolo preenchido.' },
            { t: 'Quadrado: homem; círculo: mulher.', ok: true },
            { t: 'Quadrado: mulher; círculo: homem.', erro: 'Inverte a convenção dos símbolos.' },
            { t: 'Quadrado: homozigoto; círculo: heterozigoto.', erro: 'Acha que o símbolo indica o genótipo, que na verdade precisa ser deduzido.' }
          ],
          explicacao: 'A forma indica o sexo e o preenchimento indica quem manifesta a característica. O genótipo não aparece no desenho: é deduzido a partir dos cruzamentos.',
          trecho: 'Nos heredogramas, quadrados representam homens e círculos, mulheres. Símbolos preenchidos indicam indivíduos que manifestam a característica estudada.'
        },
        {
          id: 'bio-gen-heredograma-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um casal sem determinada doença tem uma filha afetada. O que se conclui?',
          opcoes: [
            { t: 'A doença é dominante, pois apareceu na filha.', erro: 'Não percebe que pais sem a doença não podem carregar um alelo dominante para ela.' },
            { t: 'A doença é recessiva ligada ao X, e o pai é portador.', erro: 'Esquece que, na herança ligada ao X, o pai sem a doença passa à filha um X normal, e ela não seria afetada.' },
            { t: 'A doença é autossômica recessiva, e os pais são heterozigotos.', ok: true },
            { t: 'Os pais são homozigotos recessivos.', erro: 'Confunde portador com afetado: pais aa manifestariam a doença.' }
          ],
          explicacao: 'Se pais normais têm filho afetado, o alelo estava escondido nos dois: é recessivo e ambos são Aa. Como a afetada é filha de pai normal, a herança ligada ao X fica descartada.',
          trecho: 'Quando pais normais têm um descendente afetado, a característica é recessiva e os pais são heterozigotos. Filha afetada de pai normal exclui herança recessiva ligada ao X.'
        },
        {
          id: 'bio-gen-heredograma-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as pistas típicas de herança autossômica dominante num heredograma.',
          opcoes: [
            { t: 'Todo afetado tem pelo menos um dos pais afetado.', ok: true },
            { t: 'Pais normais frequentemente têm filhos afetados.', ok: false, erro: 'Essa é a pista de herança recessiva, em que os pais são portadores.' },
            { t: 'Dois pais afetados podem ter um filho normal.', ok: true },
            { t: 'Só homens são afetados na família.', ok: false, erro: 'Esse padrão sugere herança ligada ao sexo, não autossômica.' },
            { t: 'A característica aparece em todas as gerações, sem “pular”.', ok: true }
          ],
          explicacao: 'Na dominante, basta um alelo para manifestar, então a característica passa de geração em geração. Pais afetados Aa podem ter um filho aa normal, o que seria impossível se fosse recessiva.',
          trecho: 'Na herança autossômica dominante, os afetados têm pelo menos um genitor afetado, e a característica tende a aparecer em todas as gerações.'
        },
        {
          id: 'bio-gen-heredograma-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que um casal afetado ter um filho normal indica que a característica é dominante?',
          modelo: 'Porque os pais afetados são heterozigotos (Aa) e cada um pode passar o alelo recessivo, gerando um filho aa normal; se fosse recessiva, pais afetados (aa) só teriam filhos afetados.',
          criterios: [
            { rotulo: 'Os pais afetados são heterozigotos', chaves: ['heterozig'] },
            { rotulo: 'O filho normal recebeu o alelo recessivo de cada genitor', chaves: ['recessiv'] }
          ],
          explicacao: 'O filho normal só pode ter recebido um alelo “normal” de cada genitor. Se os pais têm a característica e escondem um alelo normal, a característica é a dominante.',
          trecho: 'Se dois indivíduos afetados têm um descendente normal, ambos são heterozigotos e a característica é dominante.'
        },
        {
          id: 'bio-gen-heredograma-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Pista clássica de herança recessiva num heredograma',
          verso: 'Pais sem a característica têm filho(a) com ela: os dois pais são heterozigotos (portadores).',
          explicacao: 'O alelo recessivo fica escondido nos pais heterozigotos e aparece quando o filho recebe uma cópia de cada um.',
          trecho: 'Características recessivas podem “pular” gerações, reaparecendo em filhos de pais normais heterozigotos.'
        },
        {
          id: 'bio-gen-heredograma-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Ana e Beto não têm fibrose cística, doença autossômica recessiva, mas o primeiro filho do casal tem. Eles esperam o segundo filho e procuram um serviço de aconselhamento genético.',
          enunciado: 'Qual a probabilidade de a criança ser menina e ter fibrose cística?',
          passos: [
            'Filho afetado de pais normais: os dois são Aa.',
            'Aa × Aa: chance de aa = 1/4 a cada gestação, independentemente das anteriores.',
            'Chance de ser menina = 1/2. Eventos independentes: 1/4 × 1/2 = 1/8.'
          ],
          opcoes: [
            { t: '1/4', erro: 'Calcula só a chance de ter a doença e esquece de multiplicar pela chance de ser menina.' },
            { t: '3/8', erro: 'Usa a chance de não ter a doença (3/4) em vez da chance de ter (1/4).' },
            { t: '1/8', ok: true },
            { t: 'Zero, porque o primeiro filho já nasceu afetado.', erro: 'Acha que o resultado de uma gestação muda a chance da próxima; cada gestação é independente.' }
          ],
          explicacao: 'Cada gestação é um sorteio novo de gametas, então a chance de aa continua 1/4. Como “menina” e “afetada” precisam acontecer juntos, multiplicam-se as probabilidades.',
          trecho: 'A probabilidade de dois eventos independentes ocorrerem juntos é o produto das probabilidades de cada um (regra do “e”).'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'bio-gen-mendel2',
      nome: '2ª Lei de Mendel',
      resumo: 'Segregação independente de dois genes, gametas de um di-híbrido e a proporção 9:3:3:1.',
      prereq: ['bio-gen-mendel1'],
      fonte: 'Apostila de Biologia · Genética, cap. 4',
      itens: [
        {
          id: 'bio-gen-mendel2-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que afirma a 2ª Lei de Mendel?',
          opcoes: [
            { t: 'Genes de características diferentes, em cromossomos distintos, segregam-se de forma independente nos gametas.', ok: true },
            { t: 'Os dois alelos de um mesmo gene se separam na formação dos gametas.', erro: 'Descreve a 1ª Lei (segregação dos alelos de um gene).' },
            { t: 'Genes no mesmo cromossomo são sempre herdados separadamente.', erro: 'Ignora a ligação gênica: genes próximos no mesmo cromossomo tendem a ser herdados juntos.' },
            { t: 'O alelo dominante de um gene também domina os outros genes.', erro: 'Confunde dominância entre alelos de um gene com interação entre genes diferentes.' }
          ],
          explicacao: 'Na meiose, cada par de homólogos se alinha e se separa de forma independente dos outros pares. Por isso o alelo que vai para o gameta num gene não influencia o que vai no outro gene.',
          trecho: 'Segunda Lei de Mendel: os fatores para duas ou mais características segregam-se de forma independente na formação dos gametas, desde que estejam em cromossomos diferentes.'
        },
        {
          id: 'bio-gen-mendel2-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Quantos tipos de gametas produz um indivíduo AaBb (genes independentes)?',
          opcoes: [
            { t: '2', erro: 'Acha que os alelos vão sempre juntos (só AB e ab), como se os genes estivessem ligados.' },
            { t: '4', ok: true },
            { t: '9', erro: 'Confunde o número de gametas com o número de genótipos da F2 di-híbrida (3 × 3).' },
            { t: '16', erro: 'Confunde o número de gametas com o número de casas do quadro de Punnett do cruzamento AaBb × AaBb.' }
          ],
          explicacao: 'Cada gameta leva um alelo de cada gene: A ou a, combinado com B ou b. Isso dá 2 × 2 = 4 tipos (AB, Ab, aB, ab), em proporções iguais.',
          trecho: 'O número de tipos de gametas é 2ⁿ, em que n é o número de pares de genes em heterozigose. Um di-híbrido AaBb forma AB, Ab, aB e ab.'
        },
        {
          id: 'bio-gen-mendel2-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'No cruzamento AaBb × AaBb (genes independentes, dominância completa), marque todas as corretas.',
          opcoes: [
            { t: 'A proporção fenotípica esperada é 9 : 3 : 3 : 1.', ok: true },
            { t: 'Há só 4 genótipos possíveis na prole.', ok: false, erro: 'Confunde as 4 classes fenotípicas com os 9 genótipos possíveis (3 × 3).' },
            { t: 'A chance de um descendente aabb é 1/16.', ok: true },
            { t: 'A chance de um descendente A_B_ é 9/16.', ok: true },
            { t: 'A proporção 9 : 3 : 3 : 1 vale mesmo se os genes estiverem juntos no mesmo cromossomo.', ok: false, erro: 'Ignora a ligação gênica, que altera as proporções.' }
          ],
          explicacao: 'Cada gene dá 3/4 dominante e 1/4 recessivo. Multiplicando: A_B_ = 3/4 × 3/4 = 9/16 e aabb = 1/4 × 1/4 = 1/16. Isso só vale se os genes segregam de forma independente.',
          trecho: 'Na F2 de um di-híbrido, com genes independentes e dominância completa, a proporção fenotípica é 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.'
        },
        {
          id: 'bio-gen-mendel2-4', tipo: 'aberta', nivel: 'aplicar', dif: 3,
          enunciado: 'Como calcular a chance de aaB_ em AaBb × AaBb sem montar o quadro de 16 casas?',
          modelo: 'Separando os genes: P(aa) = 1/4 e P(B_) = 3/4. Como são independentes, multiplico: 1/4 × 3/4 = 3/16.',
          criterios: [
            { rotulo: 'Separa os genes e calcula cada probabilidade (1/4 e 3/4)', chaves: ['1/4', '3/4', 'separ'] },
            { rotulo: 'Multiplica as probabilidades', chaves: ['multiplic', 'vezes', 'produto'] },
            { rotulo: 'Chega a 3/16', chaves: ['3/16'] }
          ],
          explicacao: 'Com genes independentes, cada um é um “monoíbrido” separado. Calcula-se a chance de cada parte e aplica-se a regra do “e”, multiplicando.',
          trecho: 'Em cruzamentos com genes independentes, pode-se analisar cada gene separadamente e multiplicar as probabilidades obtidas.'
        },
        {
          id: 'bio-gen-mendel2-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Proporção fenotípica da F2 di-híbrida (AaBb × AaBb)',
          verso: '9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb, com genes independentes e dominância completa.',
          explicacao: 'É o produto de duas proporções 3:1: (3 + 1) × (3 + 1) = 9 + 3 + 3 + 1.',
          trecho: 'A proporção 9:3:3:1 foi obtida por Mendel ao cruzar ervilhas di-híbridas para cor e textura da semente.'
        },
        {
          id: 'bio-gen-mendel2-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Em ervilhas, semente amarela (V) domina sobre verde (v), e lisa (R) domina sobre rugosa (r); os genes estão em cromossomos diferentes. Um produtor cruza plantas VvRr com plantas vvrr e colhe 800 sementes.',
          enunciado: 'Quantas sementes verdes e lisas ele deve esperar?',
          passos: [
            'Separe os genes: Vv × vv dá 1/2 vv (verde); Rr × rr dá 1/2 Rr (lisa).',
            'Genes independentes: 1/2 × 1/2 = 1/4 de sementes verdes e lisas.',
            '1/4 de 800 = 200 sementes.'
          ],
          opcoes: [
            { t: '150', erro: 'Aplica os 3/16 da F2 (AaBb × AaBb), sem perceber que o cruzamento é com um duplo recessivo.' },
            { t: '400', erro: 'Considera só o gene da cor (1/2 verdes) e esquece de multiplicar pela chance de ser lisa.' },
            { t: '50', erro: 'Usa 1/16, a proporção do duplo recessivo na F2 di-híbrida.' },
            { t: '200', ok: true }
          ],
          explicacao: 'Esse é um cruzamento-teste di-híbrido: dá 1 : 1 : 1 : 1 entre as quatro classes. Cada classe, inclusive verde e lisa, fica com 1/4 das sementes.',
          trecho: 'O cruzamento de um di-híbrido com um duplo recessivo (AaBb × aabb) produz quatro classes fenotípicas na proporção 1 : 1 : 1 : 1.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'bio-gen-abo',
      nome: 'Grupos sanguíneos ABO e Rh',
      resumo: 'Alelos múltiplos e codominância no ABO, transfusões, fator Rh e eritroblastose fetal.',
      prereq: ['bio-gen-heredograma'],
      fonte: 'Apostila de Biologia · Genética, cap. 5',
      itens: [
        {
          id: 'bio-gen-abo-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Quais genótipos correspondem ao sangue tipo A?',
          opcoes: [
            { t: 'Somente IᴬIᴬ', erro: 'Esquece que Iᴬ domina i, então Iᴬi também é tipo A.' },
            { t: 'IᴬIᴬ e Iᴬi', ok: true },
            { t: 'IᴬIᴬ, Iᴬi e IᴬIᴮ', erro: 'Esquece que Iᴬ e Iᴮ são codominantes: IᴬIᴮ produz os dois aglutinogênios e é tipo AB.' },
            { t: 'Iᴬi e ii', erro: 'Acha que o alelo i também produz aglutinogênio A; ii é tipo O.' }
          ],
          explicacao: 'No ABO há três alelos: Iᴬ e Iᴮ são codominantes entre si e ambos dominam i. Por isso o tipo A pode ser IᴬIᴬ ou Iᴬi.',
          trecho: 'O sistema ABO é um caso de alelos múltiplos (Iᴬ, Iᴮ e i). Iᴬ e Iᴮ são codominantes, e ambos são dominantes sobre i.'
        },
        {
          id: 'bio-gen-abo-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Por que uma pessoa tipo O pode doar hemácias para qualquer tipo do sistema ABO?',
          opcoes: [
            { t: 'Seu plasma não tem aglutininas anti-A nem anti-B.', erro: 'Confunde o tipo O com o AB; quem não tem aglutininas é o AB, o receptor universal.' },
            { t: 'Suas hemácias têm os aglutinogênios A e B, compatíveis com todos.', erro: 'Inverte: quem tem A e B nas hemácias é o tipo AB, que só doa para AB.' },
            { t: 'Suas hemácias não têm aglutinogênios A nem B, então não são aglutinadas pelo receptor.', ok: true },
            { t: 'O alelo i é recessivo e por isso não é reconhecido pelo sistema imune.', erro: 'Confunde dominância genética com reação imunológica.' }
          ],
          explicacao: 'Na transfusão, o que importa é se as hemácias doadas têm antígenos (aglutinogênios) que o plasma do receptor ataca. As hemácias O não têm A nem B, então nada as aglutina.',
          trecho: 'Indivíduos do grupo O não possuem aglutinogênios nas hemácias e são chamados doadores universais; os do grupo AB não possuem aglutininas no plasma e são receptores universais.'
        },
        {
          id: 'bio-gen-abo-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas sobre os sistemas ABO e Rh.',
          opcoes: [
            { t: 'Pessoas tipo A têm aglutinina anti-A no plasma.', ok: false, erro: 'Teriam reação contra as próprias hemácias; o tipo A tem anti-B.' },
            { t: 'Iᴬ e Iᴮ são codominantes, e ambos dominam i.', ok: true },
            { t: 'Uma pessoa Rh⁻ só produz anti-Rh depois de ser sensibilizada por sangue Rh⁺.', ok: true },
            { t: 'Um casal AB × O pode ter filho AB.', ok: false, erro: 'O genitor O só passa i; os filhos são Iᴬi ou Iᴮi, ou seja, A ou B.' },
            { t: 'No sistema ABO, o tipo AB é chamado receptor universal.', ok: true }
          ],
          explicacao: 'No ABO, as aglutininas já existem naturalmente e são sempre contra o antígeno que a pessoa não tem. No Rh é diferente: o anti-Rh só aparece após contato com hemácias Rh⁺.',
          trecho: 'Diferentemente do sistema ABO, o anticorpo anti-Rh não existe naturalmente: é produzido por pessoas Rh⁻ após sensibilização com hemácias Rh⁺.'
        },
        {
          id: 'bio-gen-abo-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que é a eritroblastose fetal e em que situação ela pode ocorrer?',
          modelo: 'É a destruição das hemácias de um feto Rh⁺ por anticorpos anti-Rh de uma mãe Rh⁻, que foi sensibilizada numa gestação ou parto anterior de filho Rh⁺.',
          criterios: [
            { rotulo: 'Mãe Rh negativo e feto Rh positivo', chaves: ['negativ', 'rh-', 'rh−', 'rh⁻'] },
            { rotulo: 'Anticorpos da mãe destroem as hemácias do feto', chaves: ['anticorp', 'anti-rh', 'anti rh', 'antirh', 'aglutin', 'destro', 'hemoli'] },
            { rotulo: 'A mãe foi sensibilizada antes (gestação ou parto anterior)', chaves: ['sensibiliz', 'anterior', 'primeir', 'segund'] }
          ],
          explicacao: 'No primeiro parto de filho Rh⁺, hemácias do bebê passam para a mãe Rh⁻, que produz anti-Rh. Numa gestação seguinte de feto Rh⁺, esses anticorpos atravessam a placenta e destroem as hemácias fetais.',
          trecho: 'A eritroblastose fetal ocorre quando uma mãe Rh⁻, previamente sensibilizada, gera um filho Rh⁺. Seus anticorpos anti-Rh atravessam a placenta e provocam a hemólise das hemácias do feto.'
        },
        {
          id: 'bio-gen-abo-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Quais aglutininas cada tipo ABO tem no plasma?',
          verso: 'A: anti-B. B: anti-A. AB: nenhuma. O: anti-A e anti-B.',
          explicacao: 'A regra é simples: o plasma tem anticorpo contra o antígeno que a hemácia não tem.',
          trecho: 'As aglutininas do plasma são dirigidas contra os aglutinogênios ausentes nas hemácias do próprio indivíduo.'
        },
        {
          id: 'bio-gen-abo-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Num caso de dúvida de paternidade, a mãe tem sangue tipo A e a criança, tipo O. Dois homens são investigados: Carlos, tipo AB, e Davi, tipo B.',
          enunciado: 'O que o sistema ABO permite concluir?',
          passos: [
            'Criança O é ii: recebeu um i da mãe e um i do pai.',
            'Carlos (IᴬIᴮ) não tem alelo i: não pode ser o pai.',
            'Davi (tipo B) pode ser Iᴮi; então não é excluído. O ABO só exclui, não confirma paternidade.'
          ],
          opcoes: [
            { t: 'Carlos está excluído; Davi pode ser o pai, se for Iᴮi.', ok: true },
            { t: 'Davi está excluído, pois uma criança O não pode ter pai B.', erro: 'Esquece que uma pessoa B pode ser Iᴮi e transmitir o alelo i.' },
            { t: 'Carlos pode ser o pai, pois AB é receptor universal.', erro: 'Mistura compatibilidade em transfusão com herança; AB não tem o alelo i.' },
            { t: 'Os dois estão excluídos, pois uma criança O precisa ter pais O.', erro: 'Esquece dos heterozigotos Iᴬi e Iᴮi, que podem ter filhos ii.' }
          ],
          explicacao: 'Para ter filho ii, cada genitor precisa ter ao menos um i. A mãe A pode ser Iᴬi; Davi pode ser Iᴮi; Carlos, IᴬIᴮ, não tem i para passar.',
          trecho: 'Pais dos grupos A ou B podem ter filhos do grupo O se forem heterozigotos (Iᴬi ou Iᴮi). Indivíduos AB não podem ter filhos O.'
        }
      ]
    }
  ]
});
