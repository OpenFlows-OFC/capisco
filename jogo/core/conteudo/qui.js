(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'qui-estequiometria',
  materia: 'qui',
  titulo: 'Estequiometria',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Mol, balanceamento e cálculos com reações químicas, incluindo reagente limitante, rendimento e pureza.',
  topicos: [
    // ------------------------------------------------------------------
    {
      id: 'qui-est-mol',
      nome: 'Mol e massa molar',
      resumo: 'Quantidade de matéria, constante de Avogadro, massa molar e conversão entre gramas, mols e partículas.',
      prereq: [],
      fonte: 'Apostila de Química · Estequiometria, cap. 1',
      itens: [
        {
          id: 'qui-est-mol-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que é 1 mol?',
          opcoes: [
            { t: 'A massa de 1 grama de qualquer substância.', erro: 'Confunde quantidade de matéria (mol) com massa.' },
            { t: 'O volume ocupado por qualquer substância nas CNTP.', erro: 'Confunde mol com volume e generaliza o volume molar dos gases (22,4 L) para qualquer substância.' },
            { t: 'Uma quantidade de entidades igual a 6,0 × 10²³ (constante de Avogadro).', ok: true },
            { t: 'O número de átomos que formam uma molécula.', erro: 'Confunde mol com a atomicidade da molécula.' }
          ],
          explicacao: 'Mol é uma unidade de contagem, como a dúzia, só que gigante: 6,0 × 10²³ unidades. Pode ser de átomos, moléculas, íons ou elétrons.',
          trecho: 'Mol é a unidade de quantidade de matéria do SI. Um mol contém 6,02 × 10²³ entidades elementares, valor conhecido como constante de Avogadro.'
        },
        {
          id: 'qui-est-mol-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual a massa molar do CaCO₃? (Ca = 40, C = 12, O = 16)',
          opcoes: [
            { t: '68 g/mol', erro: 'Conta o oxigênio uma vez só, esquecendo o índice 3 (40 + 12 + 16).' },
            { t: '50 g/mol', erro: 'Usa os números atômicos (20, 6 e 8) em vez das massas atômicas.' },
            { t: '204 g/mol', erro: 'Aplica o índice 3 à fórmula inteira: (40 + 12 + 16) × 3.' },
            { t: '100 g/mol', ok: true }
          ],
          explicacao: 'Some a massa de cada átomo quantas vezes ele aparece: 40 + 12 + 3 × 16 = 100 g/mol. O índice vale só para o elemento que vem logo antes dele.',
          trecho: 'A massa molar de uma substância é a soma das massas atômicas de todos os átomos da fórmula, expressa em g/mol.'
        },
        {
          id: 'qui-est-mol-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas. (H = 1, C = 12, O = 16)',
          opcoes: [
            { t: '1 mol de H₂O tem massa de 18 g.', ok: true },
            { t: '1 mol de H₂ e 1 mol de O₂ têm a mesma massa.', ok: false, erro: 'Acha que mesma quantidade de moléculas implica mesma massa; são 2 g contra 32 g.' },
            { t: '1 mol de CO₂ contém 6,0 × 10²³ moléculas.', ok: true },
            { t: '1 mol de CO₂ contém 3 mol de átomos.', ok: true },
            { t: '44 g de CO₂ correspondem a 44 mol.', ok: false, erro: 'Confunde massa em gramas com quantidade em mol; 44 g de CO₂ são 1 mol.' }
          ],
          explicacao: 'Mesmo número de mols significa mesmo número de partículas, mas cada partícula tem sua massa. E cada molécula de CO₂ tem 3 átomos, então 1 mol de moléculas traz 3 mol de átomos.',
          trecho: 'Quantidades iguais em mol de substâncias diferentes possuem o mesmo número de partículas, mas massas diferentes, determinadas pelas respectivas massas molares.'
        },
        {
          id: 'qui-est-mol-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Quantas moléculas há em 36 g de água (H₂O = 18 g/mol)? Mostre o raciocínio.',
          modelo: '36 g ÷ 18 g/mol = 2 mol; 2 × 6,0 × 10²³ = 1,2 × 10²⁴ moléculas.',
          criterios: [
            { rotulo: 'Calcula 2 mol de água', chaves: ['2 mol', '2mol', 'dois mol'] },
            { rotulo: 'Chega a 1,2 × 10²⁴ moléculas (ou 12 × 10²³)', chaves: ['1,2', '1.2', '12', '1,204', '1.204'] }
          ],
          explicacao: 'Primeiro passa-se de massa para mol (divide pela massa molar); depois, de mol para número de partículas (multiplica pela constante de Avogadro).',
          trecho: 'Número de mols: n = m / M. Número de partículas: N = n × 6,0 × 10²³.'
        },
        {
          id: 'qui-est-mol-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Como passar de massa (g) para quantidade de matéria (mol)?',
          verso: 'n = m / M: divide-se a massa pela massa molar. Ex.: 88 g de CO₂ ÷ 44 g/mol = 2 mol.',
          explicacao: 'A massa molar diz quantos gramas tem 1 mol. Dividir a massa por ela conta quantos “pacotes” de 1 mol cabem na amostra.',
          trecho: 'A quantidade de matéria (n) é a razão entre a massa da amostra (m) e a massa molar da substância (M).'
        },
        {
          id: 'qui-est-mol-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Uma receita de pão leva 5,85 g de sal de cozinha (NaCl). Ao se dissolver na massa, cada NaCl se separa em um íon Na⁺ e um íon Cl⁻. (Na = 23, Cl = 35,5)',
          enunciado: 'Quantos mols de íons Na⁺ vão para o pão?',
          passos: [
            'Massa molar do NaCl: 23 + 35,5 = 58,5 g/mol.',
            'n = 5,85 ÷ 58,5 = 0,1 mol de NaCl.',
            'Cada NaCl libera 1 Na⁺: 0,1 mol de Na⁺.'
          ],
          opcoes: [
            { t: '0,2 mol', erro: 'Soma os íons Na⁺ e Cl⁻, contando 2 mol de íons por mol de NaCl, quando a pergunta é só sobre o Na⁺.' },
            { t: '0,1 mol', ok: true },
            { t: '0,25 mol', erro: 'Divide a massa do sal pela massa molar do sódio (23), e não pela do NaCl.' },
            { t: '6,0 × 10²² mol', erro: 'Confunde o número de partículas (6,0 × 10²² íons) com a quantidade em mol.' }
          ],
          explicacao: 'A massa dada é do NaCl inteiro, então usa-se a massa molar do NaCl. Depois, a proporção 1 NaCl : 1 Na⁺ dá direto a quantidade de íons sódio.',
          trecho: 'Na dissociação do NaCl em água, cada fórmula NaCl origina um íon Na⁺ e um íon Cl⁻.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'qui-est-balanceamento',
      nome: 'Balanceamento de equações',
      resumo: 'Conservação dos átomos, coeficientes versus índices e método das tentativas.',
      prereq: ['qui-est-mol'],
      fonte: 'Apostila de Química · Estequiometria, cap. 2',
      itens: [
        {
          id: 'qui-est-balanceamento-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Por que se balanceia uma equação química?',
          opcoes: [
            { t: 'Para igualar o número de moléculas dos reagentes e dos produtos.', erro: 'Confunde conservação de átomos com conservação de moléculas; o número de moléculas pode mudar.' },
            { t: 'Para respeitar a conservação da massa: cada elemento tem o mesmo número de átomos nos dois lados.', ok: true },
            { t: 'Para igualar a soma dos coeficientes dos dois lados.', erro: 'Acha que os coeficientes precisam somar o mesmo valor em cada lado.' },
            { t: 'Para que a reação aconteça mais rápido.', erro: 'Confunde a representação da reação com sua velocidade (cinética).' }
          ],
          explicacao: 'Numa reação, os átomos só se reorganizam: nenhum é criado ou destruído. O balanceamento garante que a equação mostre isso, como previsto pela lei de Lavoisier.',
          trecho: 'Lei de Lavoisier: numa reação em sistema fechado, a massa total dos reagentes é igual à massa total dos produtos. Os átomos apenas se rearranjam.'
        },
        {
          id: 'qui-est-balanceamento-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Qual é a equação balanceada da combustão completa do metano?',
          opcoes: [
            { t: 'CH₄ + O₂ → CO₂ + 2 H₂O', erro: 'Acerta C e H, mas não confere o oxigênio no final: há 4 átomos de O nos produtos.' },
            { t: 'CH₄ + O₄ → CO₂ + 2 H₂O', erro: 'Muda o índice da fórmula (O₄), criando outra substância, em vez de mudar o coeficiente.' },
            { t: 'CH₄ + 3 O₂ → CO₂ + 2 H₂O', erro: 'Conta 2 átomos de O em cada H₂O ao somar os oxigênios dos produtos.' },
            { t: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', ok: true }
          ],
          explicacao: 'C: 1 = 1. H: 4 = 2 × 2. O: nos produtos há 2 (no CO₂) + 2 (nas duas H₂O) = 4, que vêm de 2 O₂.',
          trecho: 'No balanceamento por tentativas, acertam-se primeiro os elementos que aparecem em uma só substância de cada lado, deixando hidrogênio e oxigênio para o fim.'
        },
        {
          id: 'qui-est-balanceamento-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Na equação N₂ + 3 H₂ → 2 NH₃, marque todas as corretas.',
          opcoes: [
            { t: '1 molécula de N₂ reage com 3 moléculas de H₂.', ok: true },
            { t: 'Como 1 + 3 ≠ 2, a equação não está balanceada.', ok: false, erro: 'Acha que a soma dos coeficientes deve ser igual nos dois lados; o que se conserva são os átomos.' },
            { t: 'Há 6 átomos de H em cada lado.', ok: true },
            { t: 'A proporção em mol é 1 : 3 : 2.', ok: true },
            { t: 'O 2 em 2 NH₃ indica que cada molécula de amônia tem 2 átomos de N.', ok: false, erro: 'Confunde coeficiente (quantas moléculas) com índice (quantos átomos na molécula).' }
          ],
          explicacao: 'Os coeficientes contam moléculas (ou mols); os índices contam átomos dentro de cada molécula. O número de moléculas pode diminuir, desde que os átomos batam.',
          trecho: 'Os coeficientes estequiométricos indicam a proporção entre as quantidades, em moléculas ou em mol, das substâncias que participam da reação.'
        },
        {
          id: 'qui-est-balanceamento-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Ao balancear, por que não se pode trocar H₂O por H₂O₂ para acertar os oxigênios?',
          modelo: 'Porque mudar o índice muda a substância (H₂O₂ é água oxigenada, não água); no balanceamento só se alteram os coeficientes.',
          criterios: [
            { rotulo: 'Mudar o índice muda a substância', chaves: ['substanc', 'outra', 'diferent', 'composto', 'oxigenada', 'peroxido'] },
            { rotulo: 'Só os coeficientes podem ser alterados', chaves: ['coeficient', 'na frente', 'numero antes'] }
          ],
          explicacao: 'O índice faz parte da identidade da substância: H₂O e H₂O₂ têm propriedades totalmente diferentes. Balancear é ajustar quantas moléculas participam, não quais.',
          trecho: 'No balanceamento, apenas os coeficientes podem ser alterados. Os índices definem a composição das substâncias e não podem ser modificados.'
        },
        {
          id: 'qui-est-balanceamento-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Ordem prática do método das tentativas',
          verso: 'Regra MACHO: acerte primeiro os Metais, depois Ametais, Carbono, Hidrogênio e, por último, Oxigênio. Mude só os coeficientes.',
          explicacao: 'Oxigênio e hidrogênio costumam aparecer em várias substâncias; deixá-los para o fim evita desfazer o que já foi acertado.',
          trecho: 'Uma sequência prática para o método das tentativas é: metais, ametais, carbono, hidrogênio e oxigênio.'
        },
        {
          id: 'qui-est-balanceamento-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Na fotossíntese, a planta combina gás carbônico e água para produzir glicose (C₆H₁₂O₆) e gás oxigênio. Um estudante escreveu a equação 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + x O₂ e travou no último coeficiente.',
          enunciado: 'Qual é o valor de x?',
          passos: [
            'Conte os O nos reagentes: 6 × 2 + 6 × 1 = 18.',
            'Nos produtos, a glicose tem 6 O; faltam 12 átomos de O.',
            'Cada O₂ tem 2 átomos: x = 12 ÷ 2 = 6.'
          ],
          opcoes: [
            { t: '12', erro: 'Conta os átomos de O que faltam, mas esquece que cada molécula de O₂ tem 2 átomos.' },
            { t: '9', erro: 'Divide todos os 18 oxigênios dos reagentes por 2, esquecendo os 6 que ficam na glicose.' },
            { t: '6', ok: true },
            { t: '18', erro: 'Iguala x ao total de átomos de O dos reagentes.' }
          ],
          explicacao: 'O oxigênio dos reagentes se divide entre a glicose e o O₂. Tirando os 6 da glicose, sobram 12 átomos, que formam 6 moléculas de O₂.',
          trecho: 'Equação global da fotossíntese: 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'qui-est-calculo',
      nome: 'Cálculo estequiométrico',
      resumo: 'Relações entre quantidades de reagentes e produtos a partir da equação balanceada.',
      prereq: ['qui-est-mol', 'qui-est-balanceamento'],
      fonte: 'Apostila de Química · Estequiometria, cap. 3',
      itens: [
        {
          id: 'qui-est-calculo-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Num cálculo estequiométrico, de onde vem a proporção entre as substâncias?',
          opcoes: [
            { t: 'Dos índices das fórmulas químicas.', erro: 'Confunde índice (átomos na molécula) com coeficiente (proporção entre substâncias).' },
            { t: 'Dos coeficientes da equação balanceada, que indicam a proporção em mol.', ok: true },
            { t: 'Dos coeficientes, que indicam a proporção em gramas.', erro: 'Acha que os coeficientes dão proporção em massa; eles dão proporção em mol.' },
            { t: 'Da equação como foi escrita, mesmo sem balancear.', erro: 'Pula o balanceamento; sem ele, a proporção entre as substâncias sai errada.' }
          ],
          explicacao: 'Os coeficientes da equação balanceada dizem quantos mols de cada substância participam. Para usar gramas, é preciso converter com a massa molar.',
          trecho: 'Os coeficientes da equação balanceada fornecem a proporção em mol entre reagentes e produtos, base de todo cálculo estequiométrico.'
        },
        {
          id: 'qui-est-calculo-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Em 2 H₂ + O₂ → 2 H₂O, quantos gramas de água se formam a partir de 4 g de H₂? (H = 1, O = 16)',
          opcoes: [
            { t: '4 g', erro: 'Acha que a massa de produto é igual à do reagente citado, esquecendo o O₂ que também entra na água.' },
            { t: '18 g', erro: 'Lê a proporção como se 2 mol de H₂ formassem só 1 mol de água.' },
            { t: '36 g', ok: true },
            { t: '72 g', erro: 'Aplica o coeficiente 2 duas vezes, depois de já ter usado a proporção 2 : 2.' }
          ],
          explicacao: '4 g de H₂ são 2 mol. A proporção H₂ : H₂O é 2 : 2, então formam-se 2 mol de água, que pesam 2 × 18 = 36 g.',
          trecho: 'Para relacionar massas numa reação, convertem-se as massas em mol, aplica-se a proporção dos coeficientes e converte-se o resultado de volta para gramas.'
        },
        {
          id: 'qui-est-calculo-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Na decomposição CaCO₃ → CaO + CO₂ (Ca = 40, C = 12, O = 16), marque todas as corretas.',
          opcoes: [
            { t: '100 g de CaCO₃ produzem 56 g de CaO.', ok: true },
            { t: 'A massa de CaO formada é igual à de CaCO₃ decomposta.', ok: false, erro: 'Esquece que parte da massa sai como CO₂; a massa total se conserva, não a de cada substância.' },
            { t: '100 g de CaCO₃ produzem 44 g de CO₂.', ok: true },
            { t: '50 g de CaCO₃ produzem 0,5 mol de CO₂.', ok: true },
            { t: '1 mol de CaCO₃ produz 2 mol de gás.', ok: false, erro: 'Trata os dois produtos como gases; o CaO é sólido, e só o CO₂ (1 mol) é gás.' }
          ],
          explicacao: '1 mol de CaCO₃ (100 g) vira 1 mol de CaO (56 g) e 1 mol de CO₂ (44 g): 56 + 44 = 100, e a massa se conserva. Metade da quantidade de CaCO₃ gera metade de cada produto.',
          trecho: 'A decomposição térmica do calcário (CaCO₃) produz cal virgem (CaO), um sólido, e gás carbônico (CO₂).'
        },
        {
          id: 'qui-est-calculo-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Quantos gramas de CO₂ se formam na queima de 32 g de CH₄? (CH₄ + 2 O₂ → CO₂ + 2 H₂O; C = 12, H = 1, O = 16)',
          modelo: '32 g ÷ 16 g/mol = 2 mol de CH₄; a proporção CH₄ : CO₂ é 1 : 1, então se formam 2 mol de CO₂ × 44 g/mol = 88 g.',
          criterios: [
            { rotulo: 'Converte para 2 mol de CH₄', chaves: ['2 mol', '2mol', 'dois mol'] },
            { rotulo: 'Chega a 88 g de CO₂', chaves: ['88'] }
          ],
          explicacao: 'Massa → mol (÷ 16), proporção 1 : 1 dos coeficientes, mol → massa (× 44). O O₂ não entra na conta porque a pergunta relaciona só CH₄ e CO₂.',
          trecho: 'Massa molar do CH₄: 12 + 4 × 1 = 16 g/mol. Massa molar do CO₂: 12 + 2 × 16 = 44 g/mol.'
        },
        {
          id: 'qui-est-calculo-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Roteiro do cálculo estequiométrico',
          verso: '1) Balancear a equação. 2) Converter o dado para mol. 3) Aplicar a proporção dos coeficientes. 4) Converter para a unidade pedida (g, L, moléculas).',
          explicacao: 'O mol é a “moeda de troca” entre as substâncias: tudo passa por ele porque os coeficientes estão em mol.',
          trecho: 'Todo cálculo estequiométrico passa pela quantidade de matéria, já que a equação química relaciona as substâncias em mol.'
        },
        {
          id: 'qui-est-calculo-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Airbags inflam em milissegundos graças à decomposição da azida de sódio: 2 NaN₃ → 2 Na + 3 N₂. Um fabricante calcula que certo airbag precisa de 3 mol de N₂ para inflar. (NaN₃ = 65 g/mol; N₂ = 28 g/mol)',
          enunciado: 'Qual massa de NaN₃ deve ser colocada no dispositivo?',
          passos: [
            'A proporção é 2 NaN₃ : 3 N₂.',
            'Para 3 mol de N₂: n(NaN₃) = 3 × 2/3 = 2 mol.',
            'm = 2 × 65 = 130 g.'
          ],
          opcoes: [
            { t: '195 g', erro: 'Usa proporção 1 : 1 entre NaN₃ e N₂ (3 × 65), ignorando os coeficientes.' },
            { t: '130 g', ok: true },
            { t: '292,5 g', erro: 'Inverte a proporção: multiplica 3 por 3/2 em vez de 2/3.' },
            { t: '84 g', erro: 'Calcula a massa de N₂ produzida (3 × 28) em vez da massa de NaN₃.' }
          ],
          explicacao: 'Cada 2 mol de azida liberam 3 mol de gás. Para 3 mol de N₂, bastam 2 mol de NaN₃, ou seja, 130 g.',
          trecho: 'Numa regra de três estequiométrica, a proporção entre as quantidades em mol é a mesma dos coeficientes da equação balanceada.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'qui-est-limitante',
      nome: 'Reagente limitante e em excesso',
      resumo: 'Como identificar o reagente que acaba primeiro e calcular o que sobra do outro.',
      prereq: ['qui-est-calculo'],
      fonte: 'Apostila de Química · Estequiometria, cap. 4',
      itens: [
        {
          id: 'qui-est-limitante-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que é o reagente limitante?',
          opcoes: [
            { t: 'O reagente presente em menor massa.', erro: 'Compara massas em vez de comparar quantidades em mol ajustadas pelos coeficientes.' },
            { t: 'O reagente que sobra no final da reação.', erro: 'Inverte os conceitos: quem sobra é o reagente em excesso.' },
            { t: 'O reagente de menor coeficiente na equação.', erro: 'Acha que o coeficiente sozinho define o limitante, sem considerar as quantidades misturadas.' },
            { t: 'O reagente consumido por completo, que determina quanto produto se forma.', ok: true }
          ],
          explicacao: 'Quando um reagente acaba, a reação para, mesmo que o outro ainda exista. Por isso é o limitante que define a quantidade máxima de produto.',
          trecho: 'Reagente limitante é aquele que é totalmente consumido na reação; ele determina a quantidade máxima de produto formado. O outro é o reagente em excesso.'
        },
        {
          id: 'qui-est-limitante-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Em 2 H₂ + O₂ → 2 H₂O, misturam-se 4 mol de H₂ e 3 mol de O₂. O que acontece?',
          opcoes: [
            { t: 'O H₂ é o limitante; sobra 1 mol de O₂ e formam-se 4 mol de água.', ok: true },
            { t: 'O O₂ é o limitante, pois há menos mols dele.', erro: 'Compara os mols sem considerar a proporção 2 : 1 da equação.' },
            { t: 'Nada sobra: os dois reagem por completo.', erro: 'Ignora a proporção estequiométrica; 4 mol de H₂ só consomem 2 mol de O₂.' },
            { t: 'O H₂ é o limitante e formam-se 7 mol de água.', erro: 'Soma os mols dos reagentes como se tudo virasse produto.' }
          ],
          explicacao: '4 mol de H₂ precisam de só 2 mol de O₂ (proporção 2 : 1). Há 3 mol, então sobra 1 mol de O₂, e o H₂ acaba primeiro, formando 4 mol de água.',
          trecho: 'Para identificar o limitante, calcula-se quanto de um reagente seria necessário para consumir totalmente o outro e compara-se com o disponível.'
        },
        {
          id: 'qui-est-limitante-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas sobre o reagente em excesso.',
          opcoes: [
            { t: 'Parte dele sobra sem reagir ao fim da reação.', ok: true },
            { t: 'É sempre o reagente de maior massa.', ok: false, erro: 'A massa sozinha não decide; é preciso comparar mols usando a proporção da equação.' },
            { t: 'Aumentar só a quantidade dele não aumenta a quantidade de produto.', ok: true },
            { t: 'A quantidade de produto deve ser calculada a partir do limitante, não do excesso.', ok: true },
            { t: 'Usá-lo de propósito nunca faz sentido na indústria.', ok: false, erro: 'Na indústria, usa-se excesso de um reagente barato para garantir o consumo total do mais caro.' }
          ],
          explicacao: 'O produto depende de quem acaba primeiro. Colocar mais do reagente que já sobra só aumenta a sobra, mas garante que o limitante seja todo aproveitado.',
          trecho: 'Em processos industriais, é comum empregar excesso do reagente mais barato para assegurar o consumo completo do reagente de maior custo.'
        },
        {
          id: 'qui-est-limitante-4', tipo: 'aberta', nivel: 'aplicar', dif: 3,
          enunciado: 'Na reação Fe + S → FeS, misturam-se 56 g de Fe e 64 g de S (Fe = 56, S = 32). Qual é o limitante e quanto sobra do outro?',
          modelo: '56 g de Fe = 1 mol e 64 g de S = 2 mol; como a proporção é 1 : 1, o ferro é o limitante e sobra 1 mol de enxofre, ou seja, 32 g.',
          criterios: [
            { rotulo: 'Identifica o ferro como limitante', chaves: ['ferro', 'fe ', 'fe,', 'fe.'] },
            { rotulo: 'Sobram 32 g de enxofre (1 mol)', chaves: ['32', '1 mol de s', '1 mol de enxofre'] }
          ],
          explicacao: 'Em mol, há 1 de Fe e 2 de S. Na proporção 1 : 1, o Fe acaba primeiro e consome só 1 mol de S; o outro mol (32 g) sobra.',
          trecho: 'Para comparar reagentes, convertem-se as massas em mol e divide-se cada quantidade pelo seu coeficiente: o menor valor indica o limitante.'
        },
        {
          id: 'qui-est-limitante-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Como achar o reagente limitante?',
          verso: 'Converta tudo para mol e divida cada quantidade pelo seu coeficiente na equação: o menor resultado indica o limitante.',
          explicacao: 'Dividir pelo coeficiente mostra quantas “vezes” a reação pode acontecer com cada reagente; quem permite menos vezes limita.',
          trecho: 'A razão entre a quantidade disponível (em mol) e o coeficiente estequiométrico indica qual reagente se esgota primeiro.'
        },
        {
          id: 'qui-est-limitante-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Para encher um balão numa feira de ciências, um estudante mistura 8,4 g de bicarbonato de sódio (NaHCO₃, 84 g/mol) com um vinagre que contém 0,05 mol de ácido acético. A reação é NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. (CO₂ = 44 g/mol)',
          enunciado: 'Qual é a massa máxima de CO₂ que pode encher o balão?',
          passos: [
            'n(NaHCO₃) = 8,4 ÷ 84 = 0,1 mol; ácido = 0,05 mol.',
            'Proporção 1 : 1: o ácido acaba primeiro e é o limitante.',
            'CO₂ = 0,05 mol × 44 g/mol = 2,2 g (sobra 0,05 mol de bicarbonato).'
          ],
          opcoes: [
            { t: '4,4 g', erro: 'Faz o cálculo pelo bicarbonato, que está em excesso.' },
            { t: '6,6 g', erro: 'Soma os mols dos dois reagentes (0,15 mol) como se tudo virasse CO₂.' },
            { t: '2,2 g', ok: true },
            { t: '8,4 g', erro: 'Acha que a massa de gás é igual à massa de bicarbonato colocada.' }
          ],
          explicacao: 'Há mais bicarbonato (0,1 mol) do que ácido (0,05 mol), e a proporção é 1 : 1. O ácido limita a reação, então só 0,05 mol de CO₂ se forma.',
          trecho: 'A quantidade de produto é sempre calculada a partir do reagente limitante.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'qui-est-rendimento',
      nome: 'Rendimento e pureza',
      resumo: 'Cálculos com reagentes impuros e reações que não produzem o máximo teórico.',
      prereq: ['qui-est-calculo'],
      fonte: 'Apostila de Química · Estequiometria, cap. 5',
      itens: [
        {
          id: 'qui-est-rendimento-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Como se calcula o rendimento de uma reação?',
          opcoes: [
            { t: '(quantidade teórica ÷ quantidade obtida) × 100%', erro: 'Inverte a razão, o que daria valores acima de 100%.' },
            { t: '(massa de produto ÷ massa de reagente) × 100%', erro: 'Compara o produto com o reagente, em vez de compará-lo com o máximo teórico de produto.' },
            { t: '(quantidade obtida ÷ quantidade teórica) × 100%', ok: true },
            { t: 'Quantidade teórica − quantidade obtida', erro: 'Confunde rendimento (porcentagem) com a perda absoluta de produto.' }
          ],
          explicacao: 'O rendimento compara o que de fato se obteve com o máximo que a estequiometria prevê. Por isso fica entre 0 e 100%.',
          trecho: 'Rendimento percentual é a razão entre a quantidade real de produto obtida e a quantidade teórica prevista pela estequiometria, multiplicada por 100.'
        },
        {
          id: 'qui-est-rendimento-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Uma amostra de 200 g de calcário tem 80% de pureza em CaCO₃. Quanto CaCO₃ de fato reage?',
          opcoes: [
            { t: '200 g', erro: 'Ignora as impurezas e usa a massa da amostra inteira.' },
            { t: '160 g', ok: true },
            { t: '40 g', erro: 'Calcula a massa das impurezas (20%) em vez da massa pura.' },
            { t: '250 g', erro: 'Divide por 0,8 em vez de multiplicar.' }
          ],
          explicacao: 'Só a parte pura participa da reação: 80% de 200 g = 0,8 × 200 = 160 g. Os outros 40 g são impurezas.',
          trecho: 'Grau de pureza é a porcentagem, em massa, da substância de interesse numa amostra. Massa pura = massa da amostra × pureza.'
        },
        {
          id: 'qui-est-rendimento-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as razões que fazem o rendimento real ficar abaixo de 100%.',
          opcoes: [
            { t: 'Reações paralelas, que formam outros produtos.', ok: true },
            { t: 'Excesso de um dos reagentes.', ok: false, erro: 'O excesso não reduz o produto; o cálculo teórico já parte do limitante.' },
            { t: 'Perdas de produto na filtração, transferência ou secagem.', ok: true },
            { t: 'Reação reversível que atinge o equilíbrio antes de consumir todo o reagente.', ok: true },
            { t: 'A massa não se conserva em reações químicas.', ok: false, erro: 'Contraria a lei de Lavoisier; a massa total se conserva, o que se perde é produto isolado.' }
          ],
          explicacao: 'Parte do reagente pode virar outra coisa, não reagir (equilíbrio) ou o produto pode se perder no manuseio. Nada disso viola a conservação da massa.',
          trecho: 'O rendimento real costuma ser menor que o teórico devido a reações secundárias, reações incompletas e perdas durante a separação e purificação do produto.'
        },
        {
          id: 'qui-est-rendimento-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Teoricamente se formariam 50 g de um produto, mas obtiveram-se 40 g. Qual foi o rendimento? Mostre a conta.',
          modelo: 'Rendimento = 40 ÷ 50 × 100% = 80%.',
          criterios: [
            { rotulo: 'Divide o obtido pelo teórico', chaves: ['40/50', '40 / 50', '40 ÷ 50', '40 dividido', '0,8', '0.8', '4/5'] },
            { rotulo: 'Chega a 80%', chaves: ['80'] }
          ],
          explicacao: 'O teórico (50 g) é o 100%. O obtido (40 g) é 4/5 disso, ou seja, 80%.',
          trecho: 'Rendimento (%) = (massa obtida ÷ massa teórica) × 100.'
        },
        {
          id: 'qui-est-rendimento-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Pureza e rendimento: onde aplicar cada um?',
          verso: 'Pureza: no início, sobre o reagente (massa pura = massa da amostra × pureza). Rendimento: no fim, sobre o produto (obtido = teórico × rendimento).',
          explicacao: 'A pureza diz quanto do reagente realmente participa; o rendimento diz quanto do produto previsto realmente sai.',
          trecho: 'Em problemas com pureza e rendimento, corrige-se primeiro a massa do reagente pela pureza e, ao final, a massa do produto pelo rendimento.'
        },
        {
          id: 'qui-est-rendimento-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Uma siderúrgica processa 1 000 kg de minério de ferro com 80% de Fe₂O₃. No alto-forno ocorre Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂, com rendimento de 90%. (Fe₂O₃ = 160 g/mol; Fe = 56 g/mol)',
          enunciado: 'Quanto ferro é produzido?',
          passos: [
            'Pureza: 80% de 1 000 kg = 800 kg de Fe₂O₃ = 5 000 mol.',
            'Proporção 1 Fe₂O₃ : 2 Fe → 10 000 mol de Fe = 560 kg (teórico).',
            'Rendimento de 90%: 0,9 × 560 = 504 kg.'
          ],
          opcoes: [
            { t: '560 kg', erro: 'Aplica a pureza, mas esquece de aplicar o rendimento no final.' },
            { t: '630 kg', erro: 'Aplica o rendimento, mas esquece a pureza do minério.' },
            { t: '252 kg', erro: 'Usa proporção 1 : 1 entre Fe₂O₃ e Fe, ignorando que cada Fe₂O₃ tem 2 átomos de ferro.' },
            { t: '504 kg', ok: true }
          ],
          explicacao: 'A pureza entra no começo (só 800 kg reagem) e o rendimento no fim (só 90% do teórico é obtido). No meio, a proporção 1 : 2 dá o ferro teórico.',
          trecho: 'No alto-forno, o óxido de ferro(III) é reduzido pelo monóxido de carbono, formando ferro metálico e gás carbônico.'
        }
      ]
    }
  ]
});
