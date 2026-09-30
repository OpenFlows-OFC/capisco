(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'por-linguagens',
  materia: 'por',
  titulo: 'Linguagens e interpretação',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Funções da linguagem, figuras, variação linguística, gêneros textuais e coesão para ler como o ENEM pede.',
  topicos: [
    {
      id: 'por-lin-funcoes',
      nome: 'Funções da linguagem',
      resumo: 'As seis funções de Jakobson e o elemento da comunicação em que cada uma se concentra.',
      prereq: [],
      fonte: 'Apostila de Linguagens · Comunicação e texto, cap. 1',
      itens: [
        {
          id: 'por-lin-funcoes-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual função se centra no receptor, com verbos no imperativo e vocativos?',
          opcoes: [
            { t: 'Conativa (apelativa).', ok: true },
            { t: 'Emotiva (expressiva).', erro: 'Troca receptor por emissor: a emotiva expressa sentimentos de quem fala.' },
            { t: 'Fática.', erro: 'Confunde dirigir-se ao outro para convencer com testar ou manter o contato.' },
            { t: 'Referencial.', erro: 'A referencial informa sobre um assunto, sem apelo direto ao receptor.' }
          ],
          explicacao: 'A função conativa tenta influenciar quem recebe a mensagem. Por isso usa imperativo (“compre”, “venha”), vocativo e a segunda pessoa.',
          trecho: 'Na função conativa, a mensagem se orienta para o receptor, buscando persuadi-lo ou levá-lo a agir.'
        },
        {
          id: 'por-lin-funcoes-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Em “Alô? Tá me ouvindo? A ligação tá cortando...”, predomina a função:',
          opcoes: [
            { t: 'fática.', ok: true },
            { t: 'conativa.', erro: 'Há perguntas ao outro, mas o objetivo é testar a ligação, não convencê-lo de algo.' },
            { t: 'metalinguística.', erro: 'Confunde falar do canal com falar do código; a frase não explica a língua.' },
            { t: 'emotiva.', erro: 'Não há foco nos sentimentos de quem fala, e sim no funcionamento do contato.' }
          ],
          explicacao: 'A função fática se volta para o canal: abrir, manter, testar ou encerrar a comunicação. Cumprimentos e expressões como “alô” e “tá me ouvindo?” são típicos.',
          trecho: 'A função fática centra-se no canal e serve para iniciar, prolongar ou verificar a comunicação.'
        },
        {
          id: 'por-lin-funcoes-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os casos de função metalinguística.',
          opcoes: [
            { t: 'Um verbete de dicionário.', ok: true },
            { t: 'Um poema que fala sobre como escrever poemas.', ok: true },
            { t: 'Um filme sobre os bastidores de uma filmagem.', ok: true },
            { t: 'Uma notícia sobre a alta do preço do arroz.', ok: false, erro: 'É função referencial: informa sobre um fato do mundo.' },
            { t: 'Um anúncio: “Garanta já o seu!”.', ok: false, erro: 'É função conativa: apela ao receptor.' }
          ],
          explicacao: 'Metalinguagem é o código falando de si mesmo: palavras explicando palavras, poema sobre poesia, cinema sobre cinema.',
          trecho: 'Na função metalinguística, a linguagem toma o próprio código como assunto.'
        },
        {
          id: 'por-lin-funcoes-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que anúncios publicitários costumam ter predomínio da função conativa?',
          modelo: 'Porque se dirigem ao receptor para convencê-lo a comprar ou agir, usando verbos no imperativo e vocativos.',
          criterios: [
            { rotulo: 'Cita o foco no receptor (leitor, consumidor, público)', chaves: ['receptor', 'leitor', 'consumid', 'interlocut', 'public', 'destinat', 'cliente', 'ouvinte'] },
            { rotulo: 'Cita a intenção de convencer ou levar à ação', chaves: ['convenc', 'persua', 'imperativ', 'influenc', 'compr', 'apel', 'induz', 'agir'] }
          ],
          explicacao: 'O objetivo do anúncio é fazer o público agir: comprar, assinar, visitar. Tudo no texto se organiza para atingir quem recebe a mensagem.',
          trecho: 'A publicidade explora a função conativa para persuadir o consumidor.'
        },
        {
          id: 'por-lin-funcoes-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'As seis funções da linguagem e o elemento em que cada uma se concentra.',
          verso: 'Referencial: referente/contexto. Emotiva: emissor. Conativa: receptor. Fática: canal. Metalinguística: código. Poética: a própria mensagem (forma).',
          explicacao: 'Cada função corresponde a um elemento da comunicação. Um texto mistura várias, mas uma costuma predominar.',
          trecho: 'Jakobson associou cada função da linguagem a um dos elementos do ato comunicativo.'
        },
        {
          id: 'por-lin-funcoes-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Poema inédito: “Esta palavra que escrevo / não sabe ainda o que diz: / procura o verso seguinte / como quem procura raiz.”',
          enunciado: 'Além da função poética, própria do gênero, predomina no poema a função:',
          passos: [
            'Perguntar qual é o assunto do poema: a palavra e o verso.',
            'Quando o texto fala do próprio código ou do ato de escrever, há metalinguagem.',
            'Verificar que a 1ª pessoa aparece, mas o foco é o processo de escrita, não os sentimentos do eu.'
          ],
          opcoes: [
            { t: 'metalinguística.', ok: true },
            { t: 'emotiva.', erro: 'A 1ª pessoa (“escrevo”) chama a atenção, mas o poema trata da escrita, não de emoções do eu lírico.' },
            { t: 'referencial.', erro: 'Não há informação objetiva sobre um fato; o texto reflete sobre a linguagem.' },
            { t: 'conativa.', erro: 'O poema não se dirige a um interlocutor para convencê-lo de algo.' }
          ],
          explicacao: 'O poema toma a própria palavra e o verso como tema: é a linguagem refletindo sobre si. Isso caracteriza a metalinguagem, muito explorada no ENEM em poemas sobre o fazer poético.',
          trecho: 'Poemas sobre o próprio fazer poético combinam as funções poética e metalinguística.'
        }
      ]
    },
    {
      id: 'por-lin-figuras',
      nome: 'Figuras de linguagem',
      resumo: 'Metáfora, metonímia, hipérbole, ironia, antítese, paradoxo, sinestesia e outras.',
      prereq: ['por-lin-funcoes'],
      fonte: 'Apostila de Linguagens · Comunicação e texto, cap. 2',
      itens: [
        {
          id: 'por-lin-figuras-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Em “Nas férias, li Machado de Assis inteiro”, a figura é:',
          opcoes: [
            { t: 'metonímia.', ok: true },
            { t: 'metáfora.', erro: 'Confunde substituição por proximidade (autor pela obra) com substituição por semelhança.' },
            { t: 'personificação.', erro: 'Não há ser inanimado agindo como humano; Machado é uma pessoa real citada no lugar da obra.' },
            { t: 'hipérbole.', erro: 'Lê “inteiro” como exagero, mas a figura central é trocar a obra pelo nome do autor.' }
          ],
          explicacao: 'Na metonímia, um termo substitui outro com o qual tem relação de proximidade: autor pela obra, marca pelo produto, parte pelo todo.',
          trecho: 'A metonímia substitui um termo por outro com o qual mantém relação de contiguidade, como o autor pela obra.'
        },
        {
          id: 'por-lin-figuras-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a diferença entre antítese e paradoxo?',
          opcoes: [
            { t: 'A antítese aproxima ideias opostas; o paradoxo as atribui ao mesmo ser, criando uma contradição aparente.', ok: true },
            { t: 'São sinônimos: ambos opõem palavras.', erro: 'Ignora o grau: no paradoxo, os opostos se fundem numa mesma afirmação.' },
            { t: 'O paradoxo é um exagero; a antítese é uma suavização.', erro: 'Confunde com hipérbole e eufemismo.' },
            { t: 'A antítese só existe em poemas com rima.', erro: 'Figuras não dependem de rima e aparecem em qualquer gênero.' }
          ],
          explicacao: 'Em “riso e choro na mesma festa” há antítese: opostos lado a lado. Em “um silêncio que grita” há paradoxo: o mesmo ser recebe qualidades que parecem incompatíveis.',
          trecho: 'A antítese contrapõe ideias opostas; o paradoxo reúne ideias contraditórias num só enunciado.'
        },
        {
          id: 'por-lin-figuras-3', tipo: 'multi', nivel: 'compreender', dif: 1,
          enunciado: 'Marque todas as frases com hipérbole.',
          opcoes: [
            { t: 'Já te falei um milhão de vezes.', ok: true },
            { t: 'Morri de rir com aquele vídeo.', ok: true },
            { t: 'Chorei rios de lágrimas.', ok: true },
            { t: 'Ele partiu desta para melhor.', ok: false, erro: 'É eufemismo: suaviza a ideia de morte.' },
            { t: 'O vento sussurrava na janela.', ok: false, erro: 'É personificação: o vento recebe uma ação humana.' }
          ],
          explicacao: 'A hipérbole exagera de propósito para dar ênfase. Ninguém falou um milhão de vezes nem morreu de rir: o exagero é expressivo.',
          trecho: 'A hipérbole consiste no exagero intencional de uma ideia para intensificá-la.'
        },
        {
          id: 'por-lin-figuras-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Alguém quebra um vaso e ouve: “Que belo serviço, hein!”. Por que há ironia?',
          modelo: 'Porque a frase diz o contrário do que se pensa: elogia o “belo serviço” para criticar o estrago.',
          criterios: [
            { rotulo: 'Cita que se diz o contrário do que se pensa', chaves: ['contrari', 'oposto', 'inverso', 'invert'] },
            { rotulo: 'Cita a crítica ou o sentido negativo real', chaves: ['critic', 'censur', 'reprov', 'deboch', 'zomb', 'estrago', 'quebr', 'negativ', 'bronca'] }
          ],
          explicacao: 'A ironia depende do contexto: as palavras elogiam, mas a situação mostra que a intenção é criticar. É o contraste entre o dito e o pretendido que produz o efeito.',
          trecho: 'Na ironia, afirma-se o contrário do que se pretende dizer, geralmente com intenção crítica ou humorística.'
        },
        {
          id: 'por-lin-figuras-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Metáfora x comparação: qual a diferença?',
          verso: 'Comparação: aproxima dois termos com conectivo explícito (“como”, “tal qual”): “Ela é forte como um touro”. Metáfora: a aproximação é implícita, sem conectivo: “Ela é um touro”.',
          explicacao: 'As duas se baseiam em semelhança; a presença do conectivo comparativo é o que as distingue.',
          trecho: 'A metáfora é uma comparação implícita, sem o elemento comparativo.'
        },
        {
          id: 'por-lin-figuras-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Slogan de uma padaria fictícia: “Pão Dourado: o cheiro quentinho que acorda o bairro.”',
          enunciado: '“Cheiro quentinho” e “o bairro” (no lugar dos moradores) exemplificam, respectivamente:',
          passos: [
            'Em “cheiro quentinho”, identificar os sentidos: olfato (cheiro) e tato (quente).',
            'Mistura de sentidos caracteriza sinestesia.',
            '“O bairro” está no lugar das pessoas que moram nele: relação de proximidade, ou seja, metonímia.'
          ],
          opcoes: [
            { t: 'sinestesia e metonímia.', ok: true },
            { t: 'metáfora e metonímia.', erro: 'Chama de metáfora qualquer uso figurado; em “cheiro quentinho” não há comparação implícita, há mistura de sentidos.' },
            { t: 'sinestesia e antítese.', erro: 'Vê oposição onde não há ideias contrárias; “bairro” substitui os moradores.' },
            { t: 'personificação e eufemismo.', erro: 'Atribui vida ao cheiro por causa de “acorda” e vê suavização onde não há.' }
          ],
          explicacao: 'A sinestesia cruza sensações de sentidos diferentes, e a metonímia troca um termo por outro com que tem relação de proximidade (lugar pelos habitantes). Juntas, tornam o slogan sensorial e afetivo.',
          trecho: 'Na sinestesia, fundem-se sensações percebidas por sentidos diferentes, como em “voz macia” ou “cheiro quente”.'
        }
      ]
    },
    {
      id: 'por-lin-variacao',
      nome: 'Variação linguística',
      resumo: 'Variação regional, social, situacional e histórica; adequação e preconceito linguístico.',
      prereq: [],
      fonte: 'Apostila de Linguagens · Língua e sociedade, cap. 3',
      itens: [
        {
          id: 'por-lin-variacao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: '“Mandioca”, “aipim” e “macaxeira” nomeiam a mesma raiz em regiões diferentes. É variação:',
          opcoes: [
            { t: 'diatópica (geográfica).', ok: true },
            { t: 'diacrônica (histórica).', erro: 'Confunde diferença entre regiões com mudança ao longo do tempo.' },
            { t: 'diastrática (social).', erro: 'A diferença não depende de grupo social ou escolaridade, e sim do lugar.' },
            { t: 'diafásica (situacional).', erro: 'Não se trata de formalidade da situação; cada região usa sua palavra em qualquer contexto.' }
          ],
          explicacao: 'A variação diatópica é a ligada ao espaço: vocabulário, sotaque e construções mudam de uma região para outra.',
          trecho: 'A variação diatópica, ou regional, se manifesta em diferenças de pronúncia, vocabulário e construção entre regiões.'
        },
        {
          id: 'por-lin-variacao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um candidato abre uma entrevista de emprego com “E aí, mano, beleza?”. A melhor análise é:',
          opcoes: [
            { t: 'a fala não é “errada”, mas é inadequada a uma situação formal.', ok: true },
            { t: 'é um erro gramatical em qualquer situação.', erro: 'Trata variação como erro; entre amigos, a mesma frase é perfeitamente adequada.' },
            { t: 'é adequada, pois qualquer variedade serve em qualquer situação.', erro: 'Ignora o critério de adequação: situações diferentes pedem registros diferentes.' },
            { t: 'é um exemplo de variação histórica.', erro: 'A questão é o grau de formalidade da situação (diafásica), não a época.' }
          ],
          explicacao: 'O foco atual é a adequação: cada situação pede um registro. Gírias funcionam entre amigos; numa entrevista, espera-se um registro mais monitorado.',
          trecho: 'A variação diafásica refere-se às escolhas de registro, mais ou menos formal, conforme a situação comunicativa.'
        },
        {
          id: 'por-lin-variacao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as afirmações coerentes com os estudos de variação linguística.',
          opcoes: [
            { t: 'Todas as variedades têm regras próprias.', ok: true },
            { t: 'A norma-padrão é uma referência associada a situações formais.', ok: true },
            { t: 'O preconceito linguístico costuma refletir preconceitos sociais e regionais.', ok: true },
            { t: 'Existe um único português correto; o resto é erro.', ok: false, erro: 'Confunde norma-padrão com a língua inteira e desconsidera a variação.' },
            { t: 'O sotaque de uma região é um desvio da língua.', ok: false, erro: 'Todo falante tem sotaque; nenhum é mais “correto” que outro.' }
          ],
          explicacao: 'Variedades não são desvios, mas sistemas com regras próprias. O julgamento de “certo” e “errado” fora da situação de uso costuma esconder preconceito contra quem fala.',
          trecho: 'Toda variedade linguística é organizada e eficiente para a comunicação de sua comunidade.'
        },
        {
          id: 'por-lin-variacao-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que é preconceito linguístico?',
          modelo: 'É discriminar alguém pelo modo como fala, tratando variedades diferentes da norma-padrão como erradas ou inferiores.',
          criterios: [
            { rotulo: 'Cita discriminação, julgamento ou desvalorização', chaves: ['discrimin', 'julg', 'desvaloriz', 'ridiculariz', 'inferior', 'menospre', 'zomb', 'exclu', 'deboch'] },
            { rotulo: 'Relaciona ao modo de falar (sotaque, variedade, jeito de falar)', chaves: ['fala', 'sotaque', 'variedade', 'variant', 'jeito', 'linguag', 'modo', 'regiona'] }
          ],
          explicacao: 'O preconceito linguístico atinge as pessoas, não só as palavras: quem é ridicularizado pelo sotaque ou pelo uso de uma variedade popular sofre uma forma de exclusão social.',
          trecho: 'O preconceito linguístico consiste em desqualificar falantes por usarem variedades diferentes daquela considerada de prestígio.'
        },
        {
          id: 'por-lin-variacao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Os quatro tipos de variação linguística.',
          verso: 'Diatópica: por região. Diastrática: por grupo social (idade, escolaridade, profissão). Diafásica: por situação (formal/informal). Diacrônica: ao longo do tempo.',
          explicacao: 'Os nomes indicam o eixo: lugar (topos), camada social (estrato), situação de fala e tempo (cronos).',
          trecho: 'A língua varia no espaço, entre grupos sociais, conforme a situação e ao longo do tempo.'
        },
        {
          id: 'por-lin-variacao-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Bilhete fictício encontrado num livro antigo: “Recebi hontem a encommenda da pharmacia. Achei o preço elevado, mas o remedio é bom.”',
          enunciado: 'As grafias “hontem”, “encommenda” e “pharmacia” indicam:',
          passos: [
            'Perceber que as palavras são as mesmas de hoje, com outra grafia.',
            'Lembrar que grafias com “ph”, consoantes dobradas e “h” inicial eram norma antes das reformas ortográficas do século XX.',
            'Concluir que a variação é no tempo (diacrônica), não erro.'
          ],
          opcoes: [
            { t: 'variação histórica: a ortografia seguia normas anteriores às reformas do século XX.', ok: true },
            { t: 'erros de quem não dominava a norma.', erro: 'Julga o passado pelas regras de hoje; na época, essas grafias eram as oficiais.' },
            { t: 'variação regional de quem escreveu.', erro: 'Confunde mudança de ortografia ao longo do tempo com diferença entre regiões.' },
            { t: 'marcas de baixa escolaridade do autor.', erro: 'Associa grafia diferente a pouca instrução; o texto, aliás, é bem estruturado.' }
          ],
          explicacao: 'A ortografia é uma convenção que muda por decisões oficiais. Um texto antigo com grafias hoje estranhas revela variação diacrônica, não desconhecimento da língua.',
          trecho: 'As reformas ortográficas do século XX simplificaram grafias etimológicas, como “ph” e consoantes dobradas.'
        }
      ]
    },
    {
      id: 'por-lin-generos',
      nome: 'Gêneros textuais',
      resumo: 'Gêneros e tipos textuais, função social dos gêneros e intergenericidade.',
      prereq: ['por-lin-funcoes'],
      fonte: 'Apostila de Linguagens · Comunicação e texto, cap. 4',
      itens: [
        {
          id: 'por-lin-generos-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Numa receita culinária, o tipo textual predominante é o:',
          opcoes: [
            { t: 'injuntivo (instrucional).', ok: true },
            { t: 'narrativo.', erro: 'Confunde sequência de passos com narração; a receita orienta ações, não conta uma história.' },
            { t: 'descritivo.', erro: 'A lista de ingredientes descreve, mas o núcleo do texto é o modo de preparo.' },
            { t: 'dissertativo-argumentativo.', erro: 'A receita não defende uma tese.' }
          ],
          explicacao: 'O tipo injuntivo orienta o leitor a fazer algo, com verbos no imperativo ou no infinitivo: “bata”, “misture”, “asse”.',
          trecho: 'Textos injuntivos, como receitas e manuais, orientam o leitor na execução de ações.'
        },
        {
          id: 'por-lin-generos-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a diferença entre editorial e artigo de opinião?',
          opcoes: [
            { t: 'O editorial expressa a opinião do veículo, sem assinatura; o artigo é assinado e expressa a opinião do autor.', ok: true },
            { t: 'O editorial é neutro e só informa; o artigo opina.', erro: 'Confunde editorial com notícia; o editorial é opinativo.' },
            { t: 'O artigo de opinião sempre representa a posição oficial do jornal.', erro: 'Inverte os papéis: quem representa o jornal é o editorial.' },
            { t: 'Os dois são textos narrativos.', erro: 'Ambos são predominantemente argumentativos.' }
          ],
          explicacao: 'Os dois gêneros argumentam, mas a autoria muda: o editorial fala em nome da empresa jornalística; o artigo, em nome de quem assina, e o jornal pode até discordar dele.',
          trecho: 'O editorial expressa o posicionamento institucional do veículo; o artigo de opinião é assinado e reflete a visão do autor.'
        },
        {
          id: 'por-lin-generos-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as afirmações corretas sobre gêneros e tipos textuais.',
          opcoes: [
            { t: 'Gêneros são numerosos e ligados a práticas sociais.', ok: true },
            { t: 'Um gênero pode combinar vários tipos textuais.', ok: true },
            { t: 'Os tipos são poucos: narrar, descrever, expor, argumentar e instruir.', ok: true },
            { t: 'Crônica é um tipo textual.', ok: false, erro: 'Crônica é gênero; pode ter trechos narrativos, descritivos e argumentativos.' },
            { t: 'Cada gênero usa um único tipo textual.', ok: false, erro: 'A maioria dos gêneros mistura tipos, com um predominante.' }
          ],
          explicacao: 'Tipos são modos de organizar o texto; gêneros são formas sociais de comunicação (notícia, bula, crônica). Uma notícia, por exemplo, narra e descreve.',
          trecho: 'Os gêneros textuais são formas relativamente estáveis de enunciado, definidas por função, estrutura e contexto de circulação.'
        },
        {
          id: 'por-lin-generos-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'O que é intergenericidade? Dê um exemplo.',
          modelo: 'É quando um gênero assume a forma de outro para cumprir sua função, como um poema escrito em forma de receita.',
          criterios: [
            { rotulo: 'Explica que um gênero usa a forma de outro (mistura de gêneros)', chaves: ['mistur', 'forma de', 'estrutura de', 'outro genero', 'hibrid', 'combin', 'forma do', 'estrutura do'] },
            { rotulo: 'Dá um exemplo com gêneros', chaves: ['poema', 'receita', 'anuncio', 'bula', 'carta', 'noticia', 'classificado', 'propaganda', 'manual', 'cronica'] }
          ],
          explicacao: 'Na intergenericidade, a forma de um gênero é emprestada para cumprir a função de outro, gerando humor, crítica ou lirismo. É recorrente em questões do ENEM.',
          trecho: 'A intergenericidade ocorre quando um gênero incorpora a estrutura de outro para produzir novos efeitos de sentido.'
        },
        {
          id: 'por-lin-generos-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Quais são os tipos textuais e sua função?',
          verso: 'Narrativo: contar fatos no tempo. Descritivo: caracterizar seres e lugares. Expositivo: explicar e informar. Argumentativo: defender um ponto de vista. Injuntivo: orientar ações.',
          explicacao: 'Os tipos são poucos e se combinam dentro dos inúmeros gêneros.',
          trecho: 'Os tipos textuais correspondem a sequências linguísticas relativamente fixas, que compõem os diferentes gêneros.'
        },
        {
          id: 'por-lin-generos-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Texto inédito: “AMIZADE. Indicações: dias cinzentos, saudade crônica. Modo de usar: uma conversa longa, sem pressa, de preferência com café. Contraindicações: não há. Efeitos colaterais: risadas fora de hora.”',
          enunciado: 'O texto:',
          passos: [
            'Reconhecer a estrutura: indicações, modo de usar, contraindicações, efeitos colaterais.',
            'Essa estrutura é de bula de remédio.',
            'Notar que a função não é orientar um tratamento, e sim falar de afeto com humor: intergenericidade.'
          ],
          opcoes: [
            { t: 'usa a estrutura de bula para tratar, com humor e lirismo, da amizade.', ok: true },
            { t: 'é uma bula real de medicamento.', erro: 'Confunde forma com função: não há remédio, e o conteúdo é afetivo.' },
            { t: 'é uma receita culinária, por citar café.', erro: 'Toma um detalhe pelo gênero; as seções são típicas de bula, não de receita.' },
            { t: 'não pertence a gênero nenhum, por misturar assuntos.', erro: 'Todo texto se realiza em algum gênero; aqui há mistura intencional de gêneros.' }
          ],
          explicacao: 'O texto empresta a forma da bula para tratar de um tema afetivo. O efeito vem do contraste entre a linguagem técnica esperada e o conteúdo emotivo.',
          trecho: 'Na intergenericidade, reconhecer o gênero emprestado é o primeiro passo para compreender o efeito de sentido.'
        }
      ]
    },
    {
      id: 'por-lin-coesao',
      nome: 'Coesão e conectivos',
      resumo: 'Coesão referencial e sequencial, valor semântico dos conectivos e coerência.',
      prereq: ['por-lin-generos'],
      fonte: 'Apostila de Linguagens · Comunicação e texto, cap. 5',
      itens: [
        {
          id: 'por-lin-coesao-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O conectivo “no entanto” expressa:',
          opcoes: [
            { t: 'oposição (adversidade).', ok: true },
            { t: 'conclusão.', erro: 'Confunde “no entanto” com “portanto” pela semelhança sonora.' },
            { t: 'causa.', erro: 'Causa é expressa por “porque”, “já que”, “visto que”.' },
            { t: 'tempo.', erro: 'Associa “entanto” a “enquanto”; no uso atual, a locução é adversativa.' }
          ],
          explicacao: '“No entanto” equivale a “mas”, “porém”, “contudo”, “todavia”: introduz uma ideia que contraria ou limita a anterior.',
          trecho: 'As conjunções adversativas, como mas, porém, contudo e no entanto, estabelecem relação de oposição.'
        },
        {
          id: 'por-lin-coesao-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual reescrita mantém o sentido de “Embora chovesse, o jogo continuou”?',
          opcoes: [
            { t: 'Apesar da chuva, o jogo continuou.', ok: true },
            { t: 'Como chovia, o jogo continuou.', erro: 'Transforma concessão em causa: a chuva viraria o motivo de o jogo continuar.' },
            { t: 'Choveu; portanto, o jogo continuou.', erro: 'Troca concessão por conclusão, o que muda a lógica.' },
            { t: 'Se chovesse, o jogo continuaria.', erro: 'Troca um fato por uma hipótese (condição).' }
          ],
          explicacao: 'A concessão apresenta um obstáculo que não impede o fato principal. “Embora” e “apesar de” têm esse valor; “como”, “portanto” e “se” mudam a relação.',
          trecho: 'As orações concessivas expressam um fato contrário ao da principal, mas incapaz de impedi-lo.'
        },
        {
          id: 'por-lin-coesao-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todos os mecanismos de coesão REFERENCIAL.',
          opcoes: [
            { t: 'Pronome retomando um termo: “Li o livro e adorei-o”.', ok: true },
            { t: 'Sinônimo ou hiperônimo: “o cão... o animal”.', ok: true },
            { t: 'Elipse: “Ana chegou cedo e (ela) saiu tarde”.', ok: true },
            { t: 'Uso de “mas” para opor ideias.', ok: false, erro: 'Conectivos fazem coesão sequencial, ligando partes; não retomam termos.' },
            { t: 'Repetição de sons no fim dos versos.', ok: false, erro: 'Rima é recurso sonoro, não mecanismo de retomada de referentes.' }
          ],
          explicacao: 'A coesão referencial retoma ou antecipa elementos do texto (pronomes, sinônimos, elipse). A sequencial liga as partes por relações lógicas (conectivos).',
          trecho: 'A coesão referencial evita repetições ao retomar termos por pronomes, sinônimos, hiperônimos ou elipse.'
        },
        {
          id: 'por-lin-coesao-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Qual o problema de “O prefeito visitou o hospital. O prefeito disse que o prefeito vai reformar o hospital.”? Como resolver?',
          modelo: 'Há repetição excessiva; basta usar pronomes ou elipse: “O prefeito visitou o hospital e disse que vai reformá-lo.”',
          criterios: [
            { rotulo: 'Identifica a repetição excessiva', chaves: ['repet', 'redund'] },
            { rotulo: 'Propõe pronome, sinônimo, elipse ou reescrita com retomada', chaves: ['pronom', 'sinonim', 'substitu', 'elips', 'reforma-lo', 'reformalo', 'retom', 'omit'] }
          ],
          explicacao: 'A repetição deixa o texto truncado e pouco fluido. Pronomes (“o”, “ele”) e elipse retomam os termos sem repeti-los.',
          trecho: 'Repetições desnecessárias comprometem a fluidez e podem ser evitadas com mecanismos de coesão referencial.'
        },
        {
          id: 'por-lin-coesao-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Conectivos por relação: adição, oposição, concessão, causa, conclusão e finalidade.',
          verso: 'Adição: e, além disso. Oposição: mas, porém, contudo, no entanto. Concessão: embora, ainda que, apesar de. Causa: porque, já que, visto que. Conclusão: portanto, logo, por isso. Finalidade: para que, a fim de.',
          explicacao: 'Saber o valor de cada conectivo é essencial para interpretar e para escrever, sobretudo na redação.',
          trecho: 'Os conectivos estabelecem relações lógico-semânticas entre orações, períodos e parágrafos.'
        },
        {
          id: 'por-lin-coesao-6', tipo: 'transfer', formato: 'aberta', nivel: 'aplicar', dif: 3,
          contexto: 'Trecho de reportagem fictícia: “O número de empréstimos de livros nas bibliotecas municipais dobrou no último ano. Portanto, as salas de leitura continuam vazias na maior parte do dia.”',
          enunciado: 'Qual o problema no uso de “Portanto”? Que conectivo seria adequado?',
          passos: [
            'Identificar a relação entre as ideias: mais empréstimos x salas vazias.',
            'Notar que a segunda ideia contrasta com a primeira, não é conclusão dela.',
            'Substituir por um conectivo de oposição, como “no entanto” ou “porém”.'
          ],
          modelo: '“Portanto” indica conclusão, mas as ideias se opõem; o adequado é um conectivo adversativo, como “No entanto”.',
          criterios: [
            { rotulo: 'Explica que as ideias se opõem (não há conclusão)', chaves: ['oposi', 'opoe', 'opost', 'contrast', 'contradi', 'advers', 'contrari', 'nao e conclus', 'nao conclu'] },
            { rotulo: 'Propõe conectivo de oposição', chaves: ['no entanto', 'mas', 'porem', 'contudo', 'todavia', 'entretanto'] }
          ],
          explicacao: 'O conectivo precisa refletir a relação lógica. Empréstimos em alta e salas vazias contrastam, então pedem um conectivo adversativo; “portanto” cria uma conclusão incoerente.',
          trecho: 'O uso inadequado de conectivos compromete a coerência, pois estabelece relações lógicas que não existem entre as ideias.'
        }
      ]
    }
  ]
});
