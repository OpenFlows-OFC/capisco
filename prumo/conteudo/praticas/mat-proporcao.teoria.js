// Teoria do tópico de prática mat-proporcao.
// Adaptação da equipe Prumo (CC BY-SA 4.0) a partir do Wikilivros: "Matemática para concursos/Razão e proporção" (CC BY-SA 4.0)
// e "Matemática financeira/Porcentagem", seção Proporções e razões (CC BY-SA 3.0).
// Seções 3, 4 e 5 (unidades, escala, escala em áreas e volumes) são texto original da equipe.
export const teoria = {
  id: 'mat-proporcao',
  titulo: 'Razão, proporção e escala',
  porQueCai: 'O Enem usa proporção em receitas, doses de remédio, consumo de combustível, mapas, plantas de casas e maquetes. Quase toda questão exige também converter unidades no meio da conta.',
  habilidades: [
    { codigo: 'H11', descricao: 'Utilizar a noção de escalas na leitura de representação de situação do cotidiano.' },
    { codigo: 'H12', descricao: 'Resolver situação-problema que envolva medidas de grandezas.' },
    { codigo: 'H14', descricao: 'Avaliar proposta de intervenção na realidade utilizando conhecimentos geométricos relacionados a grandezas e medidas.' },
  ],
  secoes: [
    {
      titulo: 'Razão: comparar por divisão',
      paragrafos: [
        'A razão entre duas quantidades é o quociente entre elas. A razão de a para b se escreve a/b ou a : b, e a ordem importa: a razão de 3 para 5 é 3/5 = 0,6, e a de 5 para 3 é outra.',
        'Quando as duas quantidades têm unidades diferentes, a razão ganha uma unidade composta e, muitas vezes, um nome próprio. Velocidade é distância ÷ tempo (km/h), e desempenho de um carro é distância ÷ combustível (km/L).',
        'Densidade demográfica é habitantes ÷ área. Uma cidade com 84.000 habitantes em 120 km² tem 84.000 ÷ 120 = 700 hab/km².',
        'Razões servem para comparar coisas de tamanhos diferentes. Para saber qual embalagem compensa, calcule o preço por unidade de cada uma.',
      ],
      exemplos: [
        {
          enunciado: 'Um pacote de 5 kg de arroz custa R$ 24,90, e o de 1 kg custa R$ 5,40. Qual compensa mais?',
          resolucao: [
            'Preço por quilo do pacote grande: 24,90 ÷ 5 = 4,98 reais/kg.',
            'Preço por quilo do pacote pequeno: 5,40 reais/kg.',
            'Resposta: o pacote de 5 kg, que sai R$ 0,42 mais barato por quilo.',
          ],
        },
        {
          enunciado: 'Um carro faz 12 km/L. Uma peça nova faz o carro economizar 0,1 L de combustível a cada 30 km rodados. Qual é o novo desempenho, em km/L?',
          resolucao: [
            'Gasto antigo em 30 km: 30 ÷ 12 = 2,5 L.',
            'Gasto novo nos mesmos 30 km: 2,5 − 0,1 = 2,4 L.',
            'Novo desempenho: 30 ÷ 2,4 = 12,5 km/L.',
            'Somar 0,1 ao desempenho não faz sentido: 0,1 é litro, e o desempenho é km/L.',
            'Resposta: 12,5 km/L.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: quando uma razão muda, volte para as quantidades. Calcule quanto se gasta num trecho fixo e divida de novo.',
    },
    {
      titulo: 'Proporção: grandezas diretas e inversas',
      paragrafos: [
        'Proporção é uma igualdade entre duas razões, como 3/12 = 5/20. Nela, os produtos cruzados são iguais: 3 · 20 = 12 · 5. É isso que faz a regra de três funcionar.',
        'Duas grandezas são diretamente proporcionais quando, multiplicando uma por um número k, a outra também fica multiplicada por k. A razão entre elas é constante, e o gráfico é uma reta que passa pela origem.',
        'Elas são inversamente proporcionais quando, multiplicando uma por k, a outra fica dividida por k. O produto entre elas é constante. Antes de montar a regra de três, pergunte: se uma aumenta, a outra aumenta ou diminui?',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 204" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><path d="M30 34V160H154M190 34V160H314" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M30 160L150 35" stroke="currentColor" stroke-width="2.5" fill="none"/><polyline points="210,40 215,64 220,80 230,100 240,112 250,120 270,130 290,136 310,140" stroke="currentColor" stroke-width="2.5" fill="none"/><g><circle cx="54" cy="135" r="3.5"/><circle cx="78" cy="110" r="3.5"/><circle cx="102" cy="85" r="3.5"/><circle cx="126" cy="60" r="3.5"/><circle cx="150" cy="35" r="3.5"/><circle cx="210" cy="40" r="3.5"/><circle cx="230" cy="100" r="3.5"/><circle cx="250" cy="120" r="3.5"/><circle cx="270" cy="130" r="3.5"/><circle cx="290" cy="136" r="3.5"/><circle cx="310" cy="140" r="3.5"/></g><g stroke="currentColor" stroke-dasharray="3 3" stroke-opacity="0.6"><path d="M102 85V160M102 85H30M270 130V160M270 130H190"/></g><g font-size="14" font-weight="600"><text x="30" y="16">Direta</text><text x="190" y="16">Inversa</text></g><text x="34" y="30">xícaras</text><text x="194" y="30">dias</text><g text-anchor="end"><text x="24" y="89">3</text><text x="24" y="164">0</text><text x="184" y="44">60</text><text x="184" y="134">15</text><text x="184" y="164">0</text></g><g text-anchor="middle"><text x="102" y="176">12</text><text x="150" y="176">20</text><text x="210" y="176">1</text><text x="270" y="176">4</text><text x="310" y="176">6</text><text x="92" y="196">pães</text><text x="252" y="196">pedreiros</text></g></svg>',
        alt: 'Dois gráficos lado a lado. À esquerda, Direta: xícaras de farinha em função do número de pães. Os pontos ficam sobre uma reta que sai da origem; o ponto destacado é 12 pães com 3 xícaras, e a reta chega a 20 pães com 5 xícaras. À direita, Inversa: dias de obra em função do número de pedreiros. A curva desce cada vez mais devagar: 1 pedreiro leva 60 dias, 4 pedreiros levam 15 dias e 6 pedreiros levam 10 dias.',
        legenda: 'Figura 1. Na proporção direta, a razão xícaras/pães é sempre 0,25. Na inversa, o produto pedreiros · dias é sempre 60.',
      },
      exemplos: [
        {
          enunciado: 'Uma padaria usa 3 xícaras de farinha para fazer 12 pães. Quantas xícaras são necessárias para 20 pães?',
          resolucao: [
            'Mais pães pedem mais farinha: grandezas diretas.',
            'Proporção: 3/12 = x/20. Produtos cruzados: 12 · x = 3 · 20 = 60.',
            'x = 60 ÷ 12 = 5.',
            'Resposta: 5 xícaras.',
          ],
        },
        {
          enunciado: 'Seis pedreiros constroem um muro em 10 dias. No mesmo ritmo, em quantos dias 4 pedreiros fariam o mesmo muro?',
          resolucao: [
            'Menos pedreiros levam mais tempo: grandezas inversas.',
            'O produto fica constante: 6 · 10 = 60.',
            '4 · x = 60, então x = 15.',
            'Resposta: 15 dias.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: frases como "proporcional ao número de alunos" ou "a dose máxima por quilograma" avisam que a relação é direta. Use a razão por unidade e multiplique.',
    },
    {
      titulo: 'Unidades de medida e conversões',
      paragrafos: [
        'Uma conta de proporção só fecha se as unidades combinarem. Antes de dividir ou comparar, coloque tudo na mesma unidade.',
        'No sistema métrico, cada passo entre unidades vizinhas de comprimento, massa ou capacidade vale 10. As conversões mais usadas estão na tabela.',
        'Uma ligação importante une volume e capacidade: 1 cm³ = 1 mL e 1 dm³ = 1 L. Para a água e líquidos parecidos, 1 g ocupa cerca de 1 cm³.',
      ],
      tabela: {
        cabecalho: ['Grandeza', 'Conversões principais'],
        linhas: [
          ['comprimento', '1 km = 1.000 m; 1 m = 100 cm; 1 km = 100.000 cm'],
          ['massa', '1 kg = 1.000 g; 1 g = 1.000 mg'],
          ['capacidade', '1 L = 1.000 mL'],
          ['volume e capacidade', '1 cm³ = 1 mL; 1 dm³ = 1 L; 1 m³ = 1.000 L'],
          ['área', '1 m² = 10.000 cm²; 1 km² = 1.000.000 m²'],
        ],
        legenda: 'Tabela 1. Conversões que mais aparecem no Enem.',
      },
      exemplos: [
        {
          enunciado: 'Um xarope deve ser dado na dose de 15 mg por quilograma da criança, por dia. Uma criança de 18 kg vai tomar o remédio por 7 dias. O xarope tem 50 mg do remédio em cada mililitro. Os frascos à venda têm 30 mL, 40 mL e 60 mL. Qual é o menor frasco que basta para o tratamento?',
          resolucao: [
            'Dose diária, proporcional à massa: 15 · 18 = 270 mg.',
            'Tratamento todo: 270 · 7 = 1.890 mg, ou 1,89 g.',
            'Volume de xarope: cada mL tem 50 mg, então 1.890 ÷ 50 = 37,8 mL.',
            'O frasco de 30 mL não basta.',
            'Resposta: o frasco de 40 mL.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as alternativas costumam ser o mesmo número em unidades diferentes, como 50 mL e 500 mL. Escreva a unidade em cada passo.',
    },
    {
      titulo: 'Escala em mapas, plantas e maquetes',
      paragrafos: [
        'Escala é a razão entre uma medida no desenho e a medida real correspondente, nas mesmas unidades. A escala 1 : 50 significa que 1 cm no desenho vale 50 cm de verdade.',
        'Do desenho para o real, multiplique pelo denominador da escala. Do real para o desenho, divida. Para descobrir a escala, divida a medida real pela do desenho, com as duas na mesma unidade.',
        'Em plantas, o espaço desenhado nem sempre é o tamanho do objeto que cabe nele. Se o fabricante pede folga nas laterais e em cima, desconte as folgas da medida real.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 222" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="13" fill="currentColor"><rect x="104" y="24" width="112" height="172" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/><rect x="124" y="48" width="72" height="148" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/><path d="M76 196H244" stroke="currentColor" stroke-width="3"/><g stroke="currentColor" stroke-width="1.5"><path d="M107 186H121M199 186H213M140 27V45"/></g><path d="M105 186L110 183V189zM123 186L118 183V189zM197 186L202 183V189zM215 186L210 183V189zM140 25L137 30H143zM140 47L137 42H143z" fill="currentColor"/><g text-anchor="middle"><text x="160" y="16">vão: 160 cm × 240 cm</text><text x="160" y="112">móvel</text><text x="160" y="130">150 × 232</text><text x="160" y="146">cm</text><text x="114" y="214">5 cm</text><text x="206" y="214">5 cm</text></g><text x="146" y="41">8 cm</text></svg>',
        alt: 'Desenho de um vão retangular tracejado de 160 cm de largura por 240 cm de altura, apoiado no chão. Dentro dele há um móvel de 150 por 232 cm, encostado no chão. Entre o móvel e cada parede lateral há uma folga de 5 cm, e entre o topo do móvel e o alto do vão há uma folga de 8 cm. As folgas estão desenhadas maiores que o real para ficarem visíveis.',
        legenda: 'Figura 2. O maior móvel que cabe no vão: largura 160 − 5 − 5 = 150 cm e altura 240 − 8 = 232 cm. Folgas fora de proporção.',
      },
      exemplos: [
        {
          enunciado: 'Em um mapa na escala 1 : 250.000, duas cidades estão a 4,2 cm uma da outra. Qual é a distância real, em km?',
          resolucao: [
            'Real: 4,2 · 250.000 = 1.050.000 cm.',
            'Como 1 km = 100.000 cm, 1.050.000 ÷ 100.000 = 10,5.',
            'Resposta: 10,5 km.',
          ],
        },
        {
          enunciado: 'A miniatura de um ônibus tem 30 cm de comprimento. O ônibus real tem 12 m. Qual é a escala?',
          resolucao: [
            'Mesma unidade: 12 m = 1.200 cm.',
            'Real ÷ desenho: 1.200 ÷ 30 = 40.',
            'Resposta: escala 1 : 40. Cada centímetro da miniatura vale 40 cm do ônibus.',
          ],
        },
        {
          enunciado: 'Na planta de um quarto, na escala 1 : 25, o vão do guarda-roupa mede 6,4 cm de largura e 9,6 cm de altura. O guarda-roupa precisa de 5 cm de folga em cada lateral e 8 cm em cima. Quais são a largura e a altura máximas do móvel?',
          resolucao: [
            'Medidas reais do vão: 6,4 · 25 = 160 cm e 9,6 · 25 = 240 cm.',
            'Largura: há folga dos dois lados, então 160 − 5 − 5 = 150 cm.',
            'Altura: só há folga em cima, então 240 − 8 = 232 cm.',
            'Resposta: 1,50 m de largura e 2,32 m de altura (Figura 2).',
          ],
        },
        {
          enunciado: 'Uma escultura tem base quadrada de 40 cm de lado e 120 cm de altura. Uma miniatura dela vai ficar numa vitrine cuja base interna mede 10 cm por 12 cm, com pelo menos 1 cm entre a base da miniatura e cada parede. Entre o topo da miniatura e a tampa devem ficar 3 cm. Qual deve ser a altura interna da vitrine, para a maior miniatura possível?',
          resolucao: [
            'O lado que limita é o menor, de 10 cm: sobram 10 − 1 − 1 = 8 cm para o lado da base.',
            'Escala: 8 ÷ 40 = 1/5, ou 1 : 5.',
            'Altura da miniatura: 120 ÷ 5 = 24 cm.',
            'Resposta: 24 + 3 = 27 cm.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as questões de escala quase sempre misturam metro e centímetro. Na planta com folgas, leia se a folga é só de um lado ou dos dois.',
    },
    {
      titulo: 'Escala em áreas e volumes',
      paragrafos: [
        'Se todos os comprimentos de uma figura são multiplicados por k, a área fica multiplicada por k² e o volume por k³. Isso acontece porque a área tem duas dimensões e o volume, três.',
        'Na escala 1 : 50, um comprimento real é 50 vezes o do desenho, uma área real é 50² = 2.500 vezes e um volume real é 50³ = 125.000 vezes.',
        'O caminho de volta usa raiz. Se a razão entre os volumes é 8.000.000, a razão entre os comprimentos é a raiz cúbica de 8.000.000, que é 200.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 180" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="13" fill="currentColor"><g fill="currentColor" fill-opacity="0.35"><rect x="45" y="100" width="30" height="30"/><rect x="105" y="100" width="30" height="30"/><rect x="195" y="100" width="30" height="30"/></g><g fill="none" stroke="currentColor" stroke-width="2"><rect x="45" y="100" width="30" height="30"/><rect x="105" y="70" width="60" height="60"/><rect x="195" y="40" width="90" height="90"/></g><g stroke="currentColor" stroke-opacity="0.6" stroke-width="1"><path d="M135 70V130M105 100H165M225 40V130M255 40V130M195 70H285M195 100H285"/></g><g text-anchor="middle"><text x="60" y="152">lado 1</text><text x="135" y="152">lado 2</text><text x="240" y="152">lado 3</text><text x="60" y="170">área 1</text><text x="135" y="170">área 4</text><text x="240" y="170">área 9</text></g></svg>',
        alt: 'Três quadrados lado a lado. O primeiro tem lado 1 e área 1. O segundo tem lado 2 e está dividido em 4 quadradinhos iguais ao primeiro, área 4. O terceiro tem lado 3 e está dividido em 9 quadradinhos, área 9. Em cada um, o quadradinho do canto inferior esquerdo está pintado.',
        legenda: 'Figura 3. Lado multiplicado por 2 ou por 3: área multiplicada por 4 ou por 9. Se fossem cubos, os volumes seriam 1, 8 e 27.',
      },
      tabela: {
        cabecalho: ['Medida', 'Fica multiplicada por', 'Na escala 1 : 100'],
        linhas: [
          ['comprimento', 'k', '100'],
          ['área', 'k²', '10.000'],
          ['volume', 'k³', '1.000.000'],
        ],
        legenda: 'Tabela 2. Efeito de uma escala de fator k sobre comprimento, área e volume.',
      },
      exemplos: [
        {
          enunciado: 'Na planta de uma casa, na escala 1 : 50, a sala ocupa 30 cm². Qual é a área real da sala?',
          resolucao: [
            'A área real é 50² = 2.500 vezes a da planta: 30 · 2.500 = 75.000 cm².',
            'Como 1 m² = 10.000 cm², 75.000 ÷ 10.000 = 7,5.',
            'Resposta: 7,5 m².',
          ],
        },
        {
          enunciado: 'Uma piscina tem capacidade de 64.000 litros. Na maquete do clube, ela é um bloco de 5 cm × 2 cm × 0,8 cm. Qual é a escala da maquete?',
          resolucao: [
            'Volume na maquete: 5 · 2 · 0,8 = 8 cm³.',
            'Volume real: 64.000 L = 64.000 dm³ = 64.000.000 cm³.',
            'Razão entre volumes: 64.000.000 ÷ 8 = 8.000.000.',
            'Razão entre comprimentos: raiz cúbica de 8.000.000 = 200, pois 200³ = 8.000.000.',
            'Resposta: 1 : 200. Conferindo: a piscina mede 10 m × 4 m × 1,6 m.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: se a questão dá volumes ou litros e pede a escala, a resposta errada mais comum é usar a razão dos volumes como se fosse a dos comprimentos.',
    },
  ],
  armadilhas: [
    'Montar regra de três direta quando as grandezas são inversas, como trabalhadores e dias de obra.',
    'Esquecer de converter unidades: a escala pede as duas medidas na mesma unidade, e a pergunta pode pedir a resposta em outra.',
    'Usar a escala linear para áreas ou volumes: na escala 1 : 100, a área real é 10.000 vezes maior, e o volume, 1.000.000 de vezes.',
    'Descontar a folga de um lado só quando ela vale para as duas laterais.',
    'Somar ou subtrair direto em uma razão, como fazer 12 + 0,1 no desempenho do carro. Volte para as quantidades e divida de novo.',
  ],
  resumo: [
    'Razão é um quociente; a ordem importa e a unidade vem junto (km/L, hab/km², R$/kg).',
    'Proporção é igualdade de razões; os produtos cruzados são iguais.',
    'Diretas: a razão é constante. Inversas: o produto é constante.',
    'Escala = medida no desenho ÷ medida real, nas mesmas unidades.',
    'Desenho → real: multiplique pelo denominador. Real → desenho: divida.',
    'Comprimento × k, área × k², volume × k³.',
    '1 m = 100 cm; 1 km = 100.000 cm; 1 cm³ = 1 mL; 1 dm³ = 1 L; 1 m³ = 1.000 L.',
  ],
  pergunta: {
    enunciado: 'Em um mapa na escala 1:200.000, duas cidades estão a 3 cm de distância. Qual é a distância real entre elas?',
    alternativas: { A: '600 m', B: '60 km', C: '6 km', D: '0,6 km' },
    certa: 'C',
    porque: '3 · 200.000 = 600.000 cm. Como 1 km = 100.000 cm, a distância real é 6 km.',
  },
  fontes: [
    { titulo: 'Wikilivros, Matemática para concursos/Razão e proporção', url: 'https://pt.wikibooks.org/w/index.php?oldid=589558', revisao: '589558 (26/10/2026)', licenca: 'CC BY-SA 4.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática financeira/Porcentagem (seção Proporções e razões)', url: 'https://pt.wikibooks.org/w/index.php?oldid=456617', revisao: '456617 (02/02/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H11, H12 e H14)', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/matriz-de-referencia', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Seções 1 e 2 adaptadas do Wikilivros: Matemática para concursos/Razão e proporção (CC BY-SA 4.0) e Matemática financeira/Porcentagem, seção Proporções e razões (CC BY-SA 3.0); autores: ver o histórico de cada página. Adaptação da equipe Prumo em CC BY-SA 4.0. Alterações: linguagem simplificada, exemplos e figura novos. As seções de unidades, escala e escala em áreas e volumes são texto original da equipe: o Wikilivros não tem capítulo de escala, e a página Semelhança de figuras planas ou espaciais, listada no livro Matemática elementar, não existe.',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
