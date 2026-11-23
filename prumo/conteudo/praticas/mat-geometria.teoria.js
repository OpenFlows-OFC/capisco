// Teoria do tópico de prática mat-geometria.
// Adaptação da equipe Prumo (CC BY-SA 4.0) a partir do Wikilivros, livro "Matemática elementar" (CC BY-SA 3.0):
// Geometria plana/Áreas e volumes, Circunferência e círculo, Polígonos; Geometria espacial/Cilindros e Pirâmides.
// Figuras compostas, cones, esferas, sólidos recortados e mudança de medidas são texto original da equipe.
export const teoria = {
  id: 'mat-geometria',
  titulo: 'Geometria: áreas e volumes',
  porQueCai: 'O Enem pede a área de terrenos, pisos e cartões, a capacidade de caixas-d’água e a massa de peças recortadas ou derretidas. Quase sempre é preciso dividir a figura em partes conhecidas.',
  termos: [
    { termo: 'Área', def: 'Medida de uma superfície, em unidades ao quadrado, como m².' },
    { termo: 'Volume', def: 'Espaço que um sólido ocupa, em unidades ao cubo, como cm³.' },
    { termo: 'Capacidade', def: 'Quanto cabe dentro de um recipiente; 1 dm³ = 1 L.' },
    { termo: 'Raio', def: 'Distância do centro até a borda do círculo; metade do diâmetro.' },
    { termo: 'Densidade', def: 'Massa por unidade de volume: massa = densidade · volume.' },
  ],
  habilidades: [
    { codigo: 'H8', descricao: 'Resolver situação-problema que envolva conhecimentos geométricos de espaço e forma.' },
    { codigo: 'H9', descricao: 'Utilizar conhecimentos geométricos de espaço e forma na seleção de argumentos propostos como solução de problemas do cotidiano.' },
    { codigo: 'H13', descricao: 'Avaliar o resultado de uma medição na construção de um argumento consistente.' },
  ],
  secoes: [
    {
      titulo: 'Área dos quadriláteros e do triângulo',
      paragrafos: [
        'Polígono é uma figura plana fechada formada por segmentos de reta, os lados. O perímetro é a soma dos lados; a área é a medida da superfície, em unidades ao quadrado, como cm² ou m².',
        'A área do retângulo é base vezes altura, e o quadrado é um caso particular: A = l². No paralelogramo também vale base vezes altura, desde que a altura seja perpendicular à base.',
        'O triângulo tem metade da área do paralelogramo de mesma base e altura: A = b · h / 2. O trapézio tem área igual à altura vezes a média das bases: A = (B + b) / 2 · h. O losango tem A = D · d / 2, com as duas diagonais.',
      ],
      tabela: {
        cabecalho: ['Figura', 'Área'],
        linhas: [
          ['retângulo e paralelogramo', 'b · h'],
          ['quadrado de lado l', 'l²'],
          ['triângulo', 'b · h / 2'],
          ['trapézio', '(B + b) / 2 · h'],
          ['losango', 'D · d / 2'],
          ['círculo de raio r', 'π · r²'],
          ['triângulo equilátero de lado L', 'L² · √3 / 4'],
          ['hexágono regular de lado L', '6 · L² · √3 / 4'],
        ],
        legenda: 'Tabela 1. Fórmulas de área. A altura h é sempre perpendicular à base.',
      },
      exemplos: [
        {
          enunciado: 'Um terreno tem a forma de um trapézio com bases de 20 m e 12 m e altura de 15 m. Qual é a sua área?',
          resolucao: [
            'Média das bases: (20 + 12) / 2 = 16 m.',
            'Área: 16 · 15 = 240.',
            'Resposta: 240 m².',
          ],
        },
        {
          enunciado: 'Uma pipa em forma de losango tem diagonais de 60 cm e 40 cm. Quanto papel de seda cobre uma face dela?',
          resolucao: [
            'A = D · d / 2 = 60 · 40 / 2.',
            'A = 2 400 / 2 = 1 200.',
            'Resposta: 1 200 cm².',
          ],
        },
      ],
      confira: { pergunta: 'Qual é a área de um triângulo com base de 10 cm e altura de 6 cm?', opcoes: ['60 cm²', '30 cm²', '16 cm²'], certa: 1, porque: 'O triângulo tem metade da área do retângulo de mesma base e altura: 10 · 6 / 2 = 30 cm².' },
    },
    {
      titulo: 'Círculo, triângulo equilátero e hexágono regular',
      paragrafos: [
        'Circunferência é a linha da borda; círculo é a região dentro dela. O comprimento da circunferência é C = 2 · π · r, e a área do círculo é A = π · r².',
        'As duas fórmulas usam o raio, que é metade do diâmetro. O Enem costuma dar π ≈ 3 ou π ≈ 3,14.',
        'O triângulo equilátero de lado L tem área L² · √3 / 4. O hexágono regular é formado por seis desses triângulos, então tem área 6 · L² · √3 / 4.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 176" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="13" fill="currentColor"><path d="M20 145H130L75 49.7Z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M75 49.7V145" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M75 137H83V145" stroke="currentColor" fill="none"/><path d="M235 97L205 149H265Z" fill="currentColor" fill-opacity="0.3"/><path d="M295 97L265 45H205L175 97L205 149H265Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M235 97L295 97M235 97L265 45M235 97L205 45M235 97L175 97M235 97L205 149M235 97L265 149" stroke="currentColor" stroke-width="1"/><g text-anchor="middle"><text x="75" y="22">triângulo equilátero</text><text x="235" y="22">hexágono regular</text><text x="75" y="164">L</text><text x="235" y="166">L</text></g><text x="40" y="96" text-anchor="end">L</text><text x="81" y="112">h</text></svg>',
        alt: 'À esquerda, um triângulo equilátero de lado L, com a altura h tracejada do vértice de cima até o meio da base, formando ângulo reto. À direita, um hexágono regular de lado L dividido em 6 triângulos equiláteros iguais por segmentos que saem do centro; um desses triângulos está pintado.',
        legenda: 'Figura 1. O hexágono regular de lado L é formado por 6 triângulos equiláteros de lado L.',
      },
      exemplos: [
        {
          enunciado: 'Uma toalha redonda tem 12 dm de diâmetro. Qual é a sua área? Use π ≈ 3.',
          resolucao: [
            'Raio: 12 / 2 = 6 dm.',
            'A = 3 · 6² = 3 · 36 = 108.',
            'Resposta: 108 dm².',
          ],
        },
        {
          enunciado: 'Uma gráfica cobra R$ 0,02 por cm² de placa de acrílico. Um cliente pode gastar no máximo R$ 2,00 por placa e quer a maior área possível. Os modelos são: quadrado de lado 9 cm; triângulo equilátero de lado 14 cm; hexágono regular de lado 6 cm; círculo de diâmetro 12 cm; retângulo de 13 cm por 8 cm. Use π ≈ 3 e √3 ≈ 1,7. Qual modelo ele escolhe?',
          resolucao: [
            'Limite de área: 2,00 / 0,02 = 100 cm².',
            'Quadrado: 9² = 81. Triângulo: 14² · 1,7 / 4 = 196 · 1,7 / 4 = 83,3.',
            'Hexágono: 6 · 6² · 1,7 / 4 = 6 · 36 · 1,7 / 4 = 91,8.',
            'Círculo, raio 6: 3 · 36 = 108, acima do limite. Retângulo: 13 · 8 = 104, também acima.',
            'Resposta: o hexágono, com 91,8 cm², a maior área dentro do limite.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as medidas vêm misturadas, umas em lado, outras em diâmetro. Calcule todas as áreas antes de comparar e confira o limite de custo.',
      confira: { pergunta: 'Um círculo tem 8 m de diâmetro. Qual é a área dele? Use π ≈ 3.', opcoes: ['192 m²', '24 m²', '48 m²'], certa: 2, porque: 'Use o raio, que é metade do diâmetro: 4 m. A = 3 · 4² = 3 · 16 = 48 m².' },
    },
    {
      titulo: 'Figuras compostas e revestimentos',
      paragrafos: [
        'Uma figura complicada pode ser dividida em partes conhecidas, como retângulos e triângulos, e as áreas são somadas. Também é possível calcular uma figura maior e subtrair o que sobra.',
        'Para revestir uma superfície, some as áreas de todas as faces que serão cobertas. Faces iguais e opostas, como as duas laterais de uma escada, contam duas vezes.',
        'Em pisos, as unidades precisam combinar. Lembre que 1 m² = 10 000 cm², porque 1 m = 100 cm e a área usa duas dimensões.',
      ],
      figura: {
        svg: '<svg viewBox="0 0 320 196" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><path d="M70 170H250V35H190V80H130V125H70Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M130 125V170M190 80V170" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><g text-anchor="middle"><text x="100" y="152">0,12 m²</text><text x="160" y="130">0,24 m²</text><text x="220" y="108">0,36 m²</text><text x="100" y="188">0,40 m</text><text x="160" y="188">0,40 m</text><text x="220" y="188">0,40 m</text></g><g text-anchor="end"><text x="64" y="152">0,30 m</text><text x="124" y="106">0,30 m</text><text x="184" y="61">0,30 m</text></g><text x="258" y="106">0,90 m</text></svg>',
        alt: 'Perfil lateral de uma arquibancada de três degraus, em forma de escadinha que sobe para a direita. Cada degrau tem 0,40 m de profundidade e 0,30 m de altura, até a altura total de 0,90 m. Linhas tracejadas dividem o perfil em três faixas verticais de 0,40 m de largura, com alturas 0,30, 0,60 e 0,90 m e áreas 0,12, 0,24 e 0,36 m².',
        legenda: 'Figura 2. A parede lateral em degraus dividida em três retângulos: 0,12 + 0,24 + 0,36 = 0,72 m².',
      },
      exemplos: [
        {
          enunciado: 'Uma arquibancada de concreto tem 3 degraus, cada um com 0,40 m de profundidade e 0,30 m de altura, e largura de 2 m. Os pisos, os espelhos (partes verticais da frente) e as duas paredes laterais serão pintados. Qual é a área pintada?',
          resolucao: [
            'Pisos: 3 retângulos de 2 · 0,40 = 0,80 m², total 2,40 m².',
            'Espelhos: 3 retângulos de 2 · 0,30 = 0,60 m², total 1,80 m².',
            'Cada lateral (Figura 2): faixas de 0,40 m com alturas 0,30, 0,60 e 0,90 dão 0,12 + 0,24 + 0,36 = 0,72 m². As duas: 1,44 m².',
            'Total: 2,40 + 1,80 + 1,44 = 5,64.',
            'Resposta: 5,64 m².',
          ],
        },
        {
          enunciado: 'Uma sala de 3,0 m por 3,9 m vai receber peças quadradas de porcelanato de 60 cm de lado. As peças podem ser cortadas, e cada recorte é aproveitado. O porcelanato vem em caixas de 4 peças. Quantas caixas são necessárias?',
          resolucao: [
            'Na largura: 3,0 / 0,6 = 5 peças. No comprimento: 3,9 / 0,6 = 6,5 peças.',
            'São 5 fileiras de 6 peças inteiras (30 peças) e 5 meias peças, que saem de 3 peças cortadas ao meio. Total: 33 peças.',
            'Conferindo pela área: 3,0 · 3,9 = 11,7 m² e 11,7 / 0,36 = 32,5, então são pelo menos 33 peças.',
            'Caixas: 33 / 4 = 8,25, então 9 caixas.',
            'Resposta: 9 caixas.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: a figura mostra uma só parede lateral, mas o texto diz que todas serão revestidas. Conte as faces repetidas e arredonde para cima peças e caixas.',
      confira: { pergunta: 'Um piso de 2 m² será coberto com peças de 50 cm por 50 cm. Quantas peças são necessárias?', opcoes: ['8', '4', '80'], certa: 0, porque: 'Cada peça tem 0,5 · 0,5 = 0,25 m², e 2 ÷ 0,25 = 8. Ponha as medidas na mesma unidade antes de dividir.' },
    },
    {
      titulo: 'Prismas e cilindros: volume e capacidade',
      paragrafos: [
        'Volume é o espaço que um sólido ocupa, em unidades ao cubo. Em prismas e cilindros, ele é a área da base vezes a altura: V = Ab · h.',
        'No paralelepípedo (forma de caixa), V = comprimento · largura · altura. No cilindro, a base é um círculo: Ab = π · r², então V = π · r² · h. A área lateral do cilindro é 2 · π · r · h, e a área total soma as duas bases.',
        'Capacidade é quanto cabe dentro de um recipiente. A ponte entre as duas medidas é 1 dm³ = 1 L, 1 m³ = 1 000 L e 1 cm³ = 1 mL.',
      ],
      exemplos: [
        {
          enunciado: 'Uma caixa-d’água cilíndrica tem raio interno de 1 m e altura de 1,5 m. Quantos litros ela comporta? Use π ≈ 3.',
          resolucao: [
            'Área da base: 3 · 1² = 3 m².',
            'Volume: 3 · 1,5 = 4,5 m³.',
            'Capacidade: 4,5 · 1 000 = 4 500 L.',
            'Resposta: 4 500 litros.',
          ],
        },
        {
          enunciado: 'Um aquário tem 80 cm de comprimento, 40 cm de largura e 50 cm de altura. Quantos litros cabem nele?',
          resolucao: [
            'V = 80 · 40 · 50 = 160 000 cm³.',
            'Como 1 000 cm³ = 1 L: 160 000 / 1 000 = 160 L.',
            'Outro caminho: em decímetros, 8 · 4 · 5 = 160 dm³ = 160 L.',
            'Resposta: 160 litros.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: o volume aparece em litros nas alternativas. Passe tudo para decímetro antes de calcular e o resultado já sai em litros.',
      confira: { pergunta: 'Uma caixa tem 2 dm de comprimento, 3 dm de largura e 5 dm de altura. Quantos litros cabem nela?', opcoes: ['10 L', '30 L', '300 L'], certa: 1, porque: 'V = 2 · 3 · 5 = 30 dm³, e 1 dm³ = 1 L. Cabem 30 litros.' },
    },
    {
      titulo: 'Pirâmides, cones e esferas; sólidos recortados',
      paragrafos: [
        'A pirâmide tem um terço do volume do prisma de mesma base e mesma altura: V = Ab · h / 3. O mesmo vale para o cone em relação ao cilindro: V = π · r² · h / 3. A esfera de raio r tem V = 4 · π · r³ / 3.',
        'Se um cone é cortado por um plano paralelo à base, a parte de cima é um cone menor semelhante ao original. Raio e altura diminuem na mesma razão, e o que sobra embaixo é um tronco de cone.',
        'Para sólidos furados ou recortados, calcule o sólido inteiro e subtraia o que saiu. Massa é densidade vezes volume. Quando um material é derretido e moldado de novo, o volume se conserva.',
      ],
      tabela: {
        cabecalho: ['Sólido', 'Volume'],
        linhas: [
          ['paralelepípedo', 'a · b · c'],
          ['cubo de aresta a', 'a³'],
          ['prisma qualquer', 'Ab · h'],
          ['cilindro', 'π · r² · h'],
          ['pirâmide', 'Ab · h / 3'],
          ['cone', 'π · r² · h / 3'],
          ['esfera', '4 · π · r³ / 3'],
        ],
        legenda: 'Tabela 2. Fórmulas de volume. Ab é a área da base.',
      },
      figura: {
        svg: '<svg viewBox="0 0 320 236" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible Next, sans-serif" font-size="12" fill="currentColor"><path d="M148 56H172L220 200H100Z" fill="currentColor" fill-opacity="0.15"/><path d="M100 200A60 12 0 0 0 220 200Z" fill="currentColor" fill-opacity="0.15"/><path d="M160 20L148 56H172Z" fill="currentColor" fill-opacity="0.04"/><g fill="none" stroke="currentColor"><path d="M160 20L100 200M160 20L220 200" stroke-width="2"/><path d="M100 200A60 12 0 0 0 220 200" stroke-width="2"/><path d="M100 200A60 12 0 0 1 220 200" stroke-dasharray="4 3"/><ellipse cx="160" cy="56" rx="12" ry="3" stroke-width="1.5"/><path d="M148 56V200M172 56V200" stroke-dasharray="4 3"/><ellipse cx="160" cy="200" rx="12" ry="3" stroke-dasharray="3 2"/><path d="M160 200H220M160 56H172" stroke-width="1"/><path d="M250 20V200M245 20H255M245 56H255M245 200H255M122 106H146" stroke-width="1.2"/></g><text x="258" y="42">6 cm</text><text x="258" y="132">24 cm</text><text x="178" y="62">r = 2 cm</text><text x="190" y="228" text-anchor="middle">r = 10 cm</text><text x="118" y="110" text-anchor="end">furo</text><text x="150" y="38" text-anchor="end">retirado</text></svg>',
        alt: 'Cone de altura 30 cm e raio da base 10 cm. Um corte paralelo à base, a 6 cm do vértice, separa um cone pequeno de raio 2 cm, marcado como retirado. Abaixo do corte fica um tronco de cone de 24 cm de altura. Linhas tracejadas verticais mostram um furo cilíndrico de raio 2 cm que atravessa o tronco de cima a baixo.',
        legenda: 'Figura 3. Tronco de cone com furo: cone inteiro, menos o cone retirado, menos o cilindro do furo.',
      },
      exemplos: [
        {
          enunciado: 'Uma peça de madeira começa como um cone de 30 cm de altura e 10 cm de raio. O artesão corta o topo, onde o raio é 2 cm, e depois faz um furo cilíndrico de raio 2 cm, de base a base, no eixo do tronco (Figura 3). A madeira tem 0,5 g por cm³. Qual é a massa da peça? Use π ≈ 3.',
          resolucao: [
            'Cone inteiro: 3 · 10² · 30 / 3 = 3 000 cm³.',
            'Cone retirado: o raio é 2/10 = 1/5 do original, então a altura também é 1/5: 30 / 5 = 6 cm. Volume: 3 · 2² · 6 / 3 = 24 cm³.',
            'Tronco: 3 000 − 24 = 2 976 cm³, com altura 30 − 6 = 24 cm.',
            'Furo: cilindro de raio 2 e altura 24: 3 · 4 · 24 = 288 cm³. Sobram 2 976 − 288 = 2 688 cm³.',
            'Massa: 2 688 · 0,5 = 1 344 g.',
            'Resposta: 1 344 g.',
          ],
        },
        {
          enunciado: 'Uma barra cilíndrica de chocolate tem 3 cm de raio e 20 cm de comprimento. Ela será derretida para fazer bombons esféricos de 2 cm de diâmetro, sem perda. Quantos bombons saem?',
          resolucao: [
            'Volume da barra: π · 3² · 20 = 180 · π cm³.',
            'Cada bombom tem raio 1 cm: 4 · π · 1³ / 3 = 4π/3 cm³.',
            'Número de bombons: 180π ÷ (4π/3) = 180 · 3 / 4 = 135. O π se cancela.',
            'Resposta: 135 bombons.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as alternativas trazem o volume no lugar da massa, ou o cálculo que esquece de tirar o cone de cima. Confira cada parte retirada.',
      confira: { pergunta: 'Um cone e um cilindro têm a mesma base e a mesma altura. O cilindro tem 90 cm³. Qual é o volume do cone?', opcoes: ['90 cm³', '45 cm³', '30 cm³'], certa: 2, porque: 'O cone tem um terço do volume do cilindro de mesma base e altura: 90 ÷ 3 = 30 cm³.' },
    },
    {
      titulo: 'Ampliar, reduzir ou mudar uma medida só',
      paragrafos: [
        'Quando todas as medidas de uma figura são multiplicadas por k, a área fica multiplicada por k² e o volume por k³. Dobrar o lado de um quadrado multiplica a área por 4.',
        'Quando só uma medida muda, escreva a fórmula e substitua. No cilindro, V = π · r² · h: dobrar a altura dobra o volume, mas dobrar o raio quadruplica a área da base e o volume.',
      ],
      tabela: {
        cabecalho: ['Mudança no cilindro', 'Área da base', 'Volume'],
        linhas: [
          ['altura × 2', 'igual', '× 2'],
          ['raio × 2', '× 4', '× 4'],
          ['raio × 2 e altura ÷ 2', '× 4', '× 2'],
          ['raio ÷ 2 e altura × 2', '÷ 4', '÷ 2'],
          ['todas as medidas × 2', '× 4', '× 8'],
        ],
        legenda: 'Tabela 3. Efeito de mudar o raio e a altura de um cilindro, em relação ao original.',
      },
      exemplos: [
        {
          enunciado: 'A caixa-d’água B tem o dobro do raio e a metade da altura da caixa A. Qual tem mais capacidade?',
          resolucao: [
            'Volume de A: π · r² · h.',
            'Volume de B: π · (2r)² · (h/2) = π · 4r² · h / 2 = 2 · π · r² · h.',
            'Resposta: a caixa B, com o dobro do volume de A.',
          ],
        },
        {
          enunciado: 'Uma pizzaria vende a pizza grande, de 40 cm de diâmetro, por R$ 60,00, e a média, de 30 cm, por R$ 36,00. Qual compensa mais? Use π ≈ 3.',
          resolucao: [
            'Grande: raio 20, área 3 · 400 = 1 200 cm². Preço por cm²: 60 / 1 200 = 0,05.',
            'Média: raio 15, área 3 · 225 = 675 cm². Preço por cm²: 36 / 675 ≈ 0,053.',
            'Resposta: a grande. O diâmetro é só 4/3 do da média, mas a área é (4/3)² ≈ 1,78 vez maior.',
          ],
        },
      ],
      atencao: 'Como o Enem cobra isso: as opções dizem “o dobro do raio” ou “metade da área da base”. Repare se a mudança é no raio ou na área: raio dobrado é área quatro vezes maior.',
      confira: { pergunta: 'Todas as medidas de uma caixa são multiplicadas por 3. O volume fica multiplicado por:', opcoes: ['27', '9', '3'], certa: 0, porque: 'O volume tem três dimensões: 3³ = 27. O 9 = 3² vale para a área de cada face.' },
    },
  ],
  armadilhas: [
    'Usar o diâmetro no lugar do raio nas fórmulas do círculo, do cilindro, do cone e da esfera.',
    'Achar que dobrar o raio dobra a área do círculo: ela fica 4 vezes maior.',
    'Esquecer de dividir por 3 no volume de cones e pirâmides, ou por 2 na área do triângulo.',
    'Contar só uma das faces repetidas, como uma parede lateral quando há duas.',
    'Converter m² para cm² multiplicando por 100, em vez de 10 000; ou esquecer que 1 m³ = 1 000 L.',
    'Em sólidos recortados, esquecer alguma parte retirada ou usar a altura do cone inteiro no tronco.',
  ],
  resumo: [
    'Retângulo: b · h. Triângulo: b · h / 2. Trapézio: (B + b) / 2 · h. Losango: D · d / 2.',
    'Círculo: π · r². Circunferência: 2 · π · r. Use o raio.',
    'Triângulo equilátero: L² · √3 / 4. Hexágono regular: seis desses.',
    'Figura composta: divida em partes e some, ou calcule o todo e subtraia.',
    'Prisma e cilindro: V = Ab · h. Pirâmide e cone: um terço disso. Esfera: 4 · π · r³ / 3.',
    '1 m² = 10 000 cm²; 1 dm³ = 1 L; 1 m³ = 1 000 L.',
    'Massa = densidade · volume. Derreter e moldar conserva o volume.',
    'Medidas × k: área × k², volume × k³.',
  ],
  pergunta: {
    enunciado: 'Se a aresta de um cubo for dobrada, o volume do cubo fica multiplicado por:',
    alternativas: { A: '2', B: '4', C: '6', D: '8' },
    certa: 'D',
    porque: 'O volume do cubo é a³. Com aresta 2a, o volume é (2a)³ = 8a³, ou seja, 8 vezes maior.',
  },
  fontes: [
    { titulo: 'Wikilivros, Matemática elementar/Geometria plana/Áreas e volumes', url: 'https://pt.wikibooks.org/w/index.php?oldid=455451', revisao: '455451 (19/11/2018)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática elementar/Geometria plana/Circunferência e círculo', url: 'https://pt.wikibooks.org/w/index.php?oldid=270677', revisao: '270677 (05/05/2014)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática elementar/Geometria plana/Polígonos', url: 'https://pt.wikibooks.org/w/index.php?oldid=457879', revisao: '457879 (14/05/2019)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática elementar/Geometria espacial/Cilindros', url: 'https://pt.wikibooks.org/w/index.php?oldid=212813', revisao: '212813 (07/03/2011)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'Wikilivros, Matemática elementar/Geometria espacial/Pirâmides', url: 'https://pt.wikibooks.org/w/index.php?oldid=212814', revisao: '212814 (07/03/2011)', licenca: 'CC BY-SA 3.0', licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt', adaptado: true },
    { titulo: 'INEP, Matriz de Referência do Enem (habilidades H8, H9 e H13)', url: 'https://download.inep.gov.br/download/enem/matriz_referencia.pdf', licenca: 'reprodução permitida com citação da fonte', adaptado: false },
  ],
  adaptacao: 'Definições e fórmulas das seções 1, 2, 4 e 5 adaptadas do livro Matemática elementar, do Wikilivros (Geometria plana/Áreas e volumes, Circunferência e círculo e Polígonos; Geometria espacial/Cilindros e Pirâmides; autores: ver o histórico de cada página), CC BY-SA 3.0. Adaptação da equipe Prumo em CC BY-SA 4.0. Alterações: linguagem simplificada, exemplos, figuras e tabelas novos. São texto original da equipe Prumo: triângulo equilátero e hexágono, figuras compostas, cones, esferas, troncos, densidade e a seção 6, sobre mudança de medidas.',
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
