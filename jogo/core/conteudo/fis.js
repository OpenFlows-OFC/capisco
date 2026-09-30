(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'fis-mecanica',
  materia: 'fis',
  titulo: 'Cinemática e Leis de Newton',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Velocidade média, MUV, as três Leis de Newton e conservação da energia mecânica, com g = 10 m/s².',
  topicos: [
    // ------------------------------------------------------------------
    {
      id: 'fis-mec-velocidade',
      nome: 'Velocidade média',
      resumo: 'Velocidade escalar média, conversão entre km/h e m/s e o erro clássico da média das velocidades.',
      prereq: [],
      fonte: 'Apostila de Física · Cinemática, cap. 1',
      itens: [
        {
          id: 'fis-mec-velocidade-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Como se define a velocidade escalar média?',
          opcoes: [
            { t: 'A média aritmética das velocidades ao longo do percurso.', erro: 'Acha que é a média simples das velocidades, o que só vale em casos especiais (tempos iguais).' },
            { t: 'Δt ÷ Δs', erro: 'Inverte a razão entre deslocamento e tempo.' },
            { t: 'Δs ÷ Δt: a variação de posição dividida pelo intervalo de tempo.', ok: true },
            { t: 'A maior velocidade atingida no percurso.', erro: 'Confunde velocidade média com velocidade máxima (ou instantânea).' }
          ],
          explicacao: 'A velocidade média diz qual velocidade constante faria o mesmo trajeto no mesmo tempo. Por isso ela é sempre “distância ÷ tempo”, nunca a média das velocidades.',
          trecho: 'A velocidade escalar média é a razão entre a variação de posição (Δs) e o intervalo de tempo (Δt) correspondente: vm = Δs / Δt.'
        },
        {
          id: 'fis-mec-velocidade-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Quanto é 72 km/h em m/s?',
          opcoes: [
            { t: '259,2 m/s', erro: 'Multiplica por 3,6 em vez de dividir.' },
            { t: '72 m/s', erro: 'Acha que km/h e m/s são equivalentes e não converte.' },
            { t: '1,2 m/s', erro: 'Divide por 60, pensando só na conversão de horas para minutos.' },
            { t: '20 m/s', ok: true }
          ],
          explicacao: '1 km/h = 1 000 m ÷ 3 600 s = 1/3,6 m/s. Então 72 km/h ÷ 3,6 = 20 m/s. Faz sentido: 20 m/s é bem menos “número” que 72 km/h.',
          trecho: 'Para converter km/h em m/s, divide-se por 3,6; para converter m/s em km/h, multiplica-se por 3,6.'
        },
        {
          id: 'fis-mec-velocidade-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Um carro percorre 120 km em 2 h e, em seguida, mais 120 km em 1 h, sempre no mesmo sentido. Marque todas as corretas.',
          opcoes: [
            { t: 'No 1º trecho, a velocidade média foi 60 km/h.', ok: true },
            { t: 'No 2º trecho, a velocidade média foi 120 km/h.', ok: true },
            { t: 'Na viagem toda, a velocidade média foi 90 km/h.', ok: false, erro: 'Faz a média aritmética das velocidades, (60 + 120) ÷ 2, em vez de distância total ÷ tempo total.' },
            { t: 'Na viagem toda, a velocidade média foi 80 km/h.', ok: true },
            { t: 'No 2º trecho, a velocidade média também foi 60 km/h, pois a distância é a mesma.', ok: false, erro: 'Ignora que o tempo mudou; mesma distância em menos tempo significa velocidade maior.' }
          ],
          explicacao: 'Na viagem toda: 240 km em 3 h = 80 km/h. A média aritmética (90) falha porque o carro passou mais tempo no trecho lento.',
          trecho: 'A velocidade média de um percurso completo é a distância total dividida pelo tempo total, e não a média das velocidades de cada trecho.'
        },
        {
          id: 'fis-mec-velocidade-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Um ciclista percorre 30 km em 1 h 30 min. Qual sua velocidade média em km/h? Mostre a conta.',
          modelo: '1 h 30 min = 1,5 h; vm = 30 km ÷ 1,5 h = 20 km/h.',
          criterios: [
            { rotulo: 'Converte 1 h 30 min em 1,5 h', chaves: ['1,5', '1.5', '3/2', '90 min'] },
            { rotulo: 'Chega a 20 km/h', chaves: ['20'] }
          ],
          explicacao: '30 minutos são meia hora, então o tempo é 1,5 h (e não 1,3 h). Dividindo 30 por 1,5, dá 20 km/h.',
          trecho: 'Antes de aplicar vm = Δs / Δt, as unidades devem ser compatíveis; 30 min equivalem a 0,5 h.'
        },
        {
          id: 'fis-mec-velocidade-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Como converter km/h em m/s e vice-versa?',
          verso: 'km/h → m/s: divida por 3,6. m/s → km/h: multiplique por 3,6. (1 m/s = 3,6 km/h.)',
          explicacao: 'O 3,6 vem de 3 600 s por hora dividido por 1 000 m por quilômetro.',
          trecho: '1 km/h = 1 000 m / 3 600 s, portanto 1 m/s = 3,6 km/h.'
        },
        {
          id: 'fis-mec-velocidade-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Num trecho de rodovia há fiscalização de velocidade média: câmeras registram a placa em dois pontos separados por 10 km. O limite é 100 km/h. Um carro passou pela 1ª câmera às 14h00 e pela 2ª às 14h05.',
          enunciado: 'O que o sistema conclui?',
          passos: [
            'Δt = 5 min = 5/60 h = 1/12 h.',
            'vm = 10 km ÷ (1/12 h) = 120 km/h.',
            'Se a média passou de 100 km/h, em algum instante ele esteve acima do limite.'
          ],
          opcoes: [
            { t: 'Multa: a velocidade média foi 120 km/h.', ok: true },
            { t: 'Não há multa: a velocidade média foi 2 km/h.', erro: 'Divide 10 km por 5 sem converter os minutos para horas.' },
            { t: 'Multa: a velocidade média foi 200 km/h.', erro: 'Converte 5 min em 0,05 h, como se uma hora tivesse 100 minutos.' },
            { t: 'Não há multa, pois a média não prova que ele passou do limite.', erro: 'Não percebe que, se a média superou 100 km/h, a velocidade precisou superar esse valor em algum momento.' }
          ],
          explicacao: 'Em 5 minutos (1/12 de hora) o carro fez 10 km; numa hora inteira, nesse ritmo, faria 120 km. Uma média acima do limite garante que o limite foi ultrapassado em algum instante.',
          trecho: 'Se a velocidade média num intervalo é v, a velocidade instantânea foi maior ou igual a v em pelo menos um instante desse intervalo.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'fis-mec-muv',
      nome: 'Movimento uniformemente variado',
      resumo: 'Aceleração constante, funções horárias, equação de Torricelli e lançamento vertical.',
      prereq: ['fis-mec-velocidade'],
      fonte: 'Apostila de Física · Cinemática, cap. 2',
      itens: [
        {
          id: 'fis-mec-muv-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que caracteriza o movimento uniformemente variado (MUV)?',
          opcoes: [
            { t: 'Deslocamentos iguais em intervalos de tempo iguais.', erro: 'Descreve o movimento uniforme (MU); no MUV é a velocidade que varia igualmente.' },
            { t: 'Aceleração constante e diferente de zero: a velocidade varia igualmente em tempos iguais.', ok: true },
            { t: 'Aceleração que cresce a cada segundo.', erro: 'Confunde velocidade variando com aceleração variando.' },
            { t: 'Velocidade que nunca muda de sentido.', erro: 'Acha que o MUV não admite inversão de sentido; no lançamento vertical, por exemplo, a velocidade inverte.' }
          ],
          explicacao: 'No MUV, a velocidade ganha (ou perde) sempre a mesma quantidade a cada segundo. Essa taxa fixa é a aceleração.',
          trecho: 'No movimento uniformemente variado, a aceleração escalar é constante e não nula; a velocidade varia de quantidades iguais em intervalos de tempo iguais.'
        },
        {
          id: 'fis-mec-muv-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um carro parte do repouso com aceleração constante de 2 m/s². Qual sua velocidade após 5 s e quanto ele percorreu?',
          opcoes: [
            { t: '10 m/s e 50 m', erro: 'Esquece o fator ½ em Δs = a·t²/2 (ou usa velocidade final × tempo, como se fosse MU).' },
            { t: '5 m/s e 25 m', erro: 'Toma a velocidade média (0 + 10) ÷ 2 como se fosse a velocidade final.' },
            { t: '2 m/s e 25 m', erro: 'Confunde aceleração com velocidade, achando que a velocidade é sempre 2 m/s.' },
            { t: '10 m/s e 25 m', ok: true }
          ],
          explicacao: 'v = v₀ + a·t = 0 + 2·5 = 10 m/s. Δs = a·t²/2 = 2·25/2 = 25 m. Confere: velocidade média 5 m/s durante 5 s dá 25 m.',
          trecho: 'Funções horárias do MUV: v = v₀ + a·t e s = s₀ + v₀·t + a·t²/2.'
        },
        {
          id: 'fis-mec-muv-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Um objeto é lançado verticalmente para cima, sem resistência do ar. Marque todas as corretas.',
          opcoes: [
            { t: 'No ponto mais alto, a velocidade é zero.', ok: true },
            { t: 'No ponto mais alto, a aceleração também é zero.', ok: false, erro: 'Confunde velocidade nula com aceleração nula; a gravidade continua agindo.' },
            { t: 'No ponto mais alto, a aceleração é g = 10 m/s², para baixo.', ok: true },
            { t: 'Na subida, a aceleração aponta para cima.', ok: false, erro: 'Acha que a aceleração acompanha o sentido do movimento; na subida o objeto está freando.' },
            { t: 'O tempo de subida é igual ao de descida até o mesmo nível.', ok: true }
          ],
          explicacao: 'Durante todo o voo, a única força é o peso, então a aceleração é sempre g para baixo. No topo, a velocidade passa por zero justamente porque está mudando de sentido.',
          trecho: 'No lançamento vertical, desprezando a resistência do ar, a aceleração é constante e igual a g, dirigida para baixo, tanto na subida quanto na descida.'
        },
        {
          id: 'fis-mec-muv-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Num gráfico velocidade × tempo do MUV, o que representam a inclinação da reta e a área sob ela?',
          modelo: 'A inclinação da reta é a aceleração, e a área sob a reta é o deslocamento.',
          criterios: [
            { rotulo: 'Inclinação = aceleração', chaves: ['aceler'] },
            { rotulo: 'Área = deslocamento', chaves: ['desloc', 'distanc', 'espaco percorrido', 'variacao de posicao', 'variacao do espaco'] }
          ],
          explicacao: 'Inclinação é Δv/Δt, que é a definição de aceleração. Área é velocidade × tempo, que dá deslocamento.',
          trecho: 'No gráfico v × t, a declividade da reta fornece a aceleração, e a área entre o gráfico e o eixo do tempo fornece o deslocamento.'
        },
        {
          id: 'fis-mec-muv-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Equação de Torricelli',
          verso: 'v² = v₀² + 2·a·Δs. Útil quando o problema não informa (nem pede) o tempo.',
          explicacao: 'Ela vem da combinação das duas funções horárias, eliminando o tempo.',
          trecho: 'A equação de Torricelli relaciona velocidade e deslocamento no MUV sem depender do tempo: v² = v₀² + 2·a·Δs.'
        },
        {
          id: 'fis-mec-muv-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Um carro a 72 km/h freia com desaceleração constante de 5 m/s² até parar. A 50 m à frente há uma faixa de pedestres. (Desconsidere o tempo de reação do motorista.)',
          enunciado: 'O carro para antes da faixa?',
          passos: [
            'Converta: 72 km/h = 20 m/s.',
            'Torricelli: 0 = 20² − 2·5·d → d = 400 ÷ 10 = 40 m.',
            '40 m < 50 m: o carro para antes da faixa.'
          ],
          opcoes: [
            { t: 'Não: ele percorre 518,4 m até parar.', erro: 'Usa 72 km/h direto na equação, sem converter para m/s.' },
            { t: 'Não: ele percorre 80 m até parar.', erro: 'Esquece o fator 2 da equação de Torricelli (400 ÷ 5).' },
            { t: 'Sim: ele percorre 40 m até parar.', ok: true },
            { t: 'Sim: ele percorre só 4 m até parar.', erro: 'Confunde o tempo de frenagem (4 s) com a distância percorrida.' }
          ],
          explicacao: 'Sem o tempo no enunciado, Torricelli resolve direto. Com v em m/s, a distância de frenagem é v²/(2a) = 400/10 = 40 m.',
          trecho: 'A distância de frenagem é proporcional ao quadrado da velocidade inicial: d = v₀² / (2a).'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'fis-mec-newton13',
      nome: '1ª e 3ª Leis de Newton',
      resumo: 'Inércia, equilíbrio e pares de ação e reação.',
      prereq: ['fis-mec-velocidade'],
      fonte: 'Apostila de Física · Dinâmica, cap. 1',
      itens: [
        {
          id: 'fis-mec-newton13-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'O que diz a 1ª Lei de Newton (princípio da inércia)?',
          opcoes: [
            { t: 'Todo corpo tende a parar quando nenhuma força age sobre ele.', erro: 'Concepção aristotélica: acha que manter o movimento exige força.' },
            { t: 'Se a força resultante é nula, o corpo permanece em repouso ou em movimento retilíneo uniforme.', ok: true },
            { t: 'A toda ação corresponde uma reação de mesma intensidade e sentido oposto.', erro: 'Confunde a 1ª Lei com a 3ª Lei.' },
            { t: 'A força resultante é igual à massa vezes a aceleração.', erro: 'Confunde a 1ª Lei com a 2ª Lei.' }
          ],
          explicacao: 'Sem força resultante, nada muda a velocidade: quem está parado fica parado, e quem se move segue em linha reta com velocidade constante. Corpos só param porque atrito ou outra força agem.',
          trecho: 'Princípio da inércia: todo corpo permanece em repouso ou em movimento retilíneo uniforme, a menos que uma força resultante não nula atue sobre ele.'
        },
        {
          id: 'fis-mec-newton13-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Um caminhão colide de frente com um carro pequeno. Compare as forças que um exerce sobre o outro.',
          opcoes: [
            { t: 'O caminhão exerce força maior, pois tem mais massa.', erro: 'Confunde a força com o efeito dela; a massa muda a aceleração, não a intensidade do par.' },
            { t: 'O carro exerce força maior, pois se deforma mais.', erro: 'Associa deformação à força aplicada, e não à resistência de cada estrutura.' },
            { t: 'As forças se anulam, pois são iguais e opostas.', erro: 'Esquece que ação e reação agem em corpos diferentes e por isso não se anulam.' },
            { t: 'Têm a mesma intensidade e sentidos opostos.', ok: true }
          ],
          explicacao: 'Pela 3ª Lei, as forças do par ação-reação são sempre iguais em intensidade. O carro sofre mais porque, com massa menor, a mesma força gera nele uma aceleração muito maior.',
          trecho: 'Terceira Lei de Newton: se um corpo A exerce força sobre B, B exerce sobre A uma força de mesma intensidade, mesma direção e sentido oposto.'
        },
        {
          id: 'fis-mec-newton13-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas sobre pares de ação e reação.',
          opcoes: [
            { t: 'Atuam em corpos diferentes.', ok: true },
            { t: 'O peso de um livro e a força normal da mesa sobre ele formam um par ação-reação.', ok: false, erro: 'As duas forças agem no mesmo corpo (o livro) e têm naturezas diferentes; o par do peso é a força que o livro faz na Terra.' },
            { t: 'Têm a mesma natureza (por exemplo, ambas gravitacionais).', ok: true },
            { t: 'A reação só aparece um instante depois da ação.', ok: false, erro: 'Acha que há ordem no tempo; as duas forças surgem e desaparecem juntas.' },
            { t: 'Surgem simultaneamente.', ok: true }
          ],
          explicacao: 'Um par ação-reação é a mesma interação vista dos dois lados: por isso tem a mesma natureza, surge ao mesmo tempo e cada força age num corpo.',
          trecho: 'As forças de ação e reação são simultâneas, de mesma natureza e aplicadas em corpos distintos; por isso nunca se equilibram entre si.'
        },
        {
          id: 'fis-mec-newton13-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Por que um passageiro em pé é lançado para a frente quando o ônibus freia bruscamente?',
          modelo: 'Por inércia: o corpo do passageiro tende a manter a velocidade que tinha, enquanto o ônibus desacelera.',
          criterios: [
            { rotulo: 'Cita a inércia (1ª Lei)', chaves: ['inerci', '1a lei', '1ª lei', 'primeira lei'] },
            { rotulo: 'O corpo tende a manter o movimento', chaves: ['manter', 'mante', 'continu', 'conserv', 'permanec'] }
          ],
          explicacao: 'Ninguém “empurra” o passageiro para a frente. É o ônibus que para, e o corpo, sem uma força que o freie na mesma hora, continua se movendo.',
          trecho: 'Inércia é a tendência de um corpo em manter seu estado de repouso ou de movimento retilíneo uniforme.'
        },
        {
          id: 'fis-mec-newton13-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: '3ª Lei de Newton (ação e reação)',
          verso: 'Se A exerce força em B, B exerce em A uma força de mesma intensidade, mesma direção e sentido oposto. As forças agem em corpos diferentes e não se anulam.',
          explicacao: 'Forças sempre aparecem aos pares, porque são interações entre dois corpos.',
          trecho: 'Toda força resulta da interação entre dois corpos e, portanto, surge sempre acompanhada de uma força de reação.'
        },
        {
          id: 'fis-mec-newton13-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 2,
          contexto: 'Na Estação Espacial Internacional, uma astronauta flutua parada no meio de um módulo, sem tocar em nada. Ela arremessa uma mochila com força para a frente.',
          enunciado: 'O que acontece com a astronauta?',
          passos: [
            'Ela empurra a mochila para a frente (ação).',
            'A mochila empurra a astronauta para trás com força de mesma intensidade (reação).',
            'Sem atrito, essa força a acelera para trás; como ela tem mais massa, sai mais devagar que a mochila.'
          ],
          opcoes: [
            { t: 'Continua parada, pois quem recebeu a força foi a mochila.', erro: 'Não reconhece a força de reação que a mochila exerce sobre quem a empurra.' },
            { t: 'Passa a se mover para trás, empurrada pela reação da mochila.', ok: true },
            { t: 'Move-se para a frente, acompanhando a mochila.', erro: 'Acha que o corpo segue o sentido da força que ele próprio aplicou.' },
            { t: 'Continua parada, pois no espaço não há chão nem atrito para se apoiar.', erro: 'Acha que é preciso apoio ou atrito para haver reação; a reação vem da própria mochila.' }
          ],
          explicacao: 'O empurrão é uma interação entre astronauta e mochila: cada uma recebe uma força. É o mesmo princípio que faz foguetes andarem no vácuo.',
          trecho: 'A propulsão de foguetes é explicada pela 3ª Lei: os gases são empurrados para trás e empurram o foguete para a frente.'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'fis-mec-newton2',
      nome: '2ª Lei de Newton',
      resumo: 'Força resultante, massa e aceleração; peso e aplicações com atrito e elevadores.',
      prereq: ['fis-mec-muv', 'fis-mec-newton13'],
      fonte: 'Apostila de Física · Dinâmica, cap. 2',
      itens: [
        {
          id: 'fis-mec-newton2-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual é a expressão da 2ª Lei de Newton?',
          opcoes: [
            { t: 'F = m · v', erro: 'Confunde aceleração com velocidade.' },
            { t: 'F = m / a', erro: 'Acha que força e aceleração são inversamente proporcionais.' },
            { t: 'F = m · g, para qualquer força', erro: 'Generaliza a fórmula do peso para todas as forças.' },
            { t: 'F_R = m · a (força resultante = massa × aceleração)', ok: true }
          ],
          explicacao: 'A força resultante é a causa da aceleração. Para a mesma massa, mais força dá mais aceleração; para a mesma força, mais massa dá menos aceleração.',
          trecho: 'Segunda Lei de Newton: a força resultante sobre um corpo é igual ao produto de sua massa pela aceleração adquirida (F_R = m · a).'
        },
        {
          id: 'fis-mec-newton2-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Uma caixa de 10 kg é puxada com 50 N num piso onde o atrito vale 20 N. Qual é a aceleração?',
          opcoes: [
            { t: '5 m/s²', erro: 'Usa só a força aplicada e ignora o atrito.' },
            { t: '3 m/s²', ok: true },
            { t: '7 m/s²', erro: 'Soma o atrito à força aplicada, em vez de subtrair (o atrito se opõe ao movimento).' },
            { t: '2 m/s²', erro: 'Usa só a força de atrito no lugar da resultante.' }
          ],
          explicacao: 'O que acelera a caixa é a força resultante: 50 − 20 = 30 N. Então a = 30 ÷ 10 = 3 m/s².',
          trecho: 'Na 2ª Lei, F representa a força resultante: a soma vetorial de todas as forças que atuam sobre o corpo.'
        },
        {
          id: 'fis-mec-newton2-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Marque todas as corretas sobre força resultante e aceleração.',
          opcoes: [
            { t: 'A aceleração tem sempre a direção e o sentido da força resultante.', ok: true },
            { t: 'Um corpo em movimento sempre tem força resultante no sentido do movimento.', ok: false, erro: 'Concepção aristotélica; em movimento retilíneo uniforme a resultante é nula.' },
            { t: 'Dobrando a força resultante sobre um corpo, a aceleração dobra.', ok: true },
            { t: 'Com a mesma força resultante, um corpo de massa maior acelera menos.', ok: true },
            { t: 'Se a força resultante é zero, o corpo obrigatoriamente está parado.', ok: false, erro: 'Esquece o movimento retilíneo uniforme, que também tem resultante nula.' }
          ],
          explicacao: 'A força resultante define a aceleração, não a velocidade. Um carro em velocidade constante numa reta tem resultante zero; um carro freando tem resultante contra o movimento.',
          trecho: 'A força resultante e a aceleração têm sempre a mesma direção e o mesmo sentido. Resultante nula implica aceleração nula, não necessariamente repouso.'
        },
        {
          id: 'fis-mec-newton2-4', tipo: 'aberta', nivel: 'aplicar', dif: 2,
          enunciado: 'Qual é o peso de uma pessoa de 60 kg na Terra (g = 10 m/s²)? E por que peso e massa não são a mesma coisa?',
          modelo: 'P = m·g = 60 × 10 = 600 N. A massa (kg) não muda de lugar para lugar; o peso (N) é a força gravitacional e depende do g local.',
          criterios: [
            { rotulo: 'Calcula 600 N', chaves: ['600'] },
            { rotulo: 'Peso é uma força e depende da gravidade', chaves: ['forca', 'gravidade', 'gravitac', 'depende do g', 'newton'] },
            { rotulo: 'A massa não muda com o local', chaves: ['nao muda', 'nao vari', 'constante', 'mesma', 'quantidade de materia', 'inercia'] }
          ],
          explicacao: 'Na Lua, onde g ≈ 1,6 m/s², a mesma pessoa continua com 60 kg, mas pesa cerca de 96 N. Massa é propriedade do corpo; peso depende de onde ele está.',
          trecho: 'Peso é a força com que um planeta atrai um corpo: P = m · g. A massa é uma propriedade do corpo e não depende do local.'
        },
        {
          id: 'fis-mec-newton2-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Peso × massa',
          verso: 'Massa (kg) mede a inércia e não muda de lugar para lugar. Peso (N) é a força gravitacional: P = m·g.',
          explicacao: 'No dia a dia se diz “peso 60 quilos”, mas em Física isso é a massa; o peso seria 600 N.',
          trecho: 'No SI, a massa é medida em quilogramas (kg) e o peso, por ser força, em newtons (N).'
        },
        {
          id: 'fis-mec-newton2-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Um elevador de 800 kg começa a subir acelerando a 2 m/s². O cabo é a única força que o puxa para cima. (Ignore atritos; g = 10 m/s².)',
          enunciado: 'Qual é a tração no cabo nesse momento?',
          passos: [
            'Forças: tração T para cima e peso P = 800 × 10 = 8 000 N para baixo.',
            '2ª Lei (para cima positivo): T − P = m·a → T − 8 000 = 800 × 2.',
            'T = 8 000 + 1 600 = 9 600 N.'
          ],
          opcoes: [
            { t: '8 000 N', erro: 'Acha que a tração é igual ao peso, esquecendo que há aceleração.' },
            { t: '1 600 N', erro: 'Calcula só m·a e esquece que o cabo também precisa sustentar o peso.' },
            { t: '9 600 N', ok: true },
            { t: '6 400 N', erro: 'Subtrai m·a do peso, como se a aceleração fosse para baixo.' }
          ],
          explicacao: 'Para acelerar para cima, a resultante precisa apontar para cima: a tração tem de superar o peso em m·a. Por isso a gente se sente “mais pesado” quando o elevador arranca subindo.',
          trecho: 'Num elevador acelerando para cima, a força que o sustenta é maior que o peso: T = m·(g + a).'
        }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'fis-mec-energia',
      nome: 'Energia mecânica',
      resumo: 'Energia cinética, potencial gravitacional e conservação da energia mecânica.',
      prereq: ['fis-mec-newton2'],
      fonte: 'Apostila de Física · Energia, cap. 1',
      itens: [
        {
          id: 'fis-mec-energia-1', tipo: 'mc', nivel: 'lembrar', dif: 1,
          enunciado: 'Qual é a expressão da energia cinética?',
          opcoes: [
            { t: 'Ec = m·v', erro: 'Confunde energia cinética com quantidade de movimento.' },
            { t: 'Ec = m·v²/2', ok: true },
            { t: 'Ec = m·g·h', erro: 'Confunde com a energia potencial gravitacional.' },
            { t: 'Ec = m·v²', erro: 'Esquece o fator ½.' }
          ],
          explicacao: 'A energia cinética depende do quadrado da velocidade: dobrar a velocidade quadruplica a energia. Por isso colisões em alta velocidade são tão mais destrutivas.',
          trecho: 'Energia cinética é a energia associada ao movimento: Ec = m·v²/2, em joules (J), com m em kg e v em m/s.'
        },
        {
          id: 'fis-mec-energia-2', tipo: 'mc', nivel: 'compreender', dif: 2,
          enunciado: 'Uma bola cai de 5 m de altura, a partir do repouso e sem resistência do ar. Com que velocidade chega ao chão?',
          opcoes: [
            { t: '50 m/s', erro: 'Usa v = g·h, misturando as grandezas sem passar pela conservação de energia.' },
            { t: '100 m/s', erro: 'Calcula v² = 2·g·h = 100 e esquece de tirar a raiz quadrada.' },
            { t: '7,1 m/s', erro: 'Esquece o fator 2: v = √(g·h) = √50.' },
            { t: '10 m/s', ok: true }
          ],
          explicacao: 'Toda a energia potencial vira cinética: m·g·h = m·v²/2. A massa cancela e v = √(2·g·h) = √(2·10·5) = √100 = 10 m/s.',
          trecho: 'Na queda livre a partir do repouso, a conservação da energia mecânica fornece v = √(2·g·h), independente da massa.'
        },
        {
          id: 'fis-mec-energia-3', tipo: 'multi', nivel: 'compreender', dif: 2,
          enunciado: 'Um carrinho desce uma rampa sem atrito, partindo do repouso. Marque todas as corretas.',
          opcoes: [
            { t: 'A energia potencial gravitacional diminui na descida.', ok: true },
            { t: 'A velocidade no pé da rampa depende da massa do carrinho.', ok: false, erro: 'A massa cancela em m·g·h = m·v²/2; a velocidade final só depende da altura.' },
            { t: 'A energia cinética aumenta na descida.', ok: true },
            { t: 'A energia mecânica total se mantém constante.', ok: true },
            { t: 'A velocidade final depende do formato da rampa, não só da altura.', ok: false, erro: 'Sem atrito, só o desnível importa; o formato muda o tempo de descida, não a velocidade final.' }
          ],
          explicacao: 'Sem atrito, a energia só troca de forma: a potencial que se perde vira cinética. Como a conta envolve apenas a altura, rampas diferentes com o mesmo desnível dão a mesma velocidade final.',
          trecho: 'Em sistemas conservativos, a energia mecânica (Em = Ec + Ep) permanece constante; há apenas conversão entre energia cinética e potencial.'
        },
        {
          id: 'fis-mec-energia-4', tipo: 'aberta', nivel: 'compreender', dif: 2,
          enunciado: 'Com atrito, a energia mecânica de um corpo não se conserva. Para onde vai a energia que “some”?',
          modelo: 'O atrito transforma parte da energia mecânica em energia térmica (aquecimento) e som; a energia total se conserva, mas a mecânica diminui.',
          criterios: [
            { rotulo: 'Parte vira energia térmica (calor)', chaves: ['termic', 'calor', 'aquec', 'temperatura'] },
            { rotulo: 'A energia é transformada/dissipada, não destruída', chaves: ['transform', 'convert', 'dissip', 'total', 'nao some', 'nao e destruid', 'conserva'] }
          ],
          explicacao: 'A energia não desaparece: o atrito converte energia mecânica em formas que não voltam a ser movimento, como aquecimento das superfícies e som.',
          trecho: 'Forças dissipativas, como o atrito, convertem energia mecânica em outras formas, principalmente energia térmica. A energia total do sistema continua conservada.'
        },
        {
          id: 'fis-mec-energia-5', tipo: 'cartao', nivel: 'lembrar', dif: 1,
          frente: 'Energia potencial gravitacional',
          verso: 'Ep = m·g·h: depende da massa, de g e da altura em relação a um nível de referência escolhido.',
          explicacao: 'Só as diferenças de altura importam nos cálculos, por isso o nível de referência (h = 0) pode ser escolhido à vontade.',
          trecho: 'Energia potencial gravitacional é a energia armazenada por um corpo em razão de sua posição num campo gravitacional: Ep = m·g·h.'
        },
        {
          id: 'fis-mec-energia-6', tipo: 'transfer', formato: 'mc', nivel: 'aplicar', dif: 3,
          contexto: 'Numa montanha-russa, um carrinho parte praticamente do repouso do alto de uma subida de 45 m. Ele desce até o nível do chão e depois sobe um loop cujo topo está a 25 m de altura. Despreze os atritos. (g = 10 m/s²)',
          enunciado: 'Qual é a velocidade do carrinho no topo do loop?',
          passos: [
            'A energia mecânica se conserva: m·g·45 = m·g·25 + m·v²/2.',
            'A massa cancela: v² = 2·10·(45 − 25) = 400.',
            'v = 20 m/s.'
          ],
          opcoes: [
            { t: '30 m/s', erro: 'Calcula a velocidade no nível do chão (√900) e esquece que o carrinho subiu de novo 25 m.' },
            { t: '20 m/s', ok: true },
            { t: 'Zero', erro: 'Acha que o carrinho chega sem velocidade a qualquer ponto alto; só pararia a 45 m.' },
            { t: '22,4 m/s', erro: 'Usa a altura do loop (25 m) como se fosse a queda: √(2·10·25) = √500.' }
          ],
          explicacao: 'O que importa é o desnível entre o ponto de partida e o topo do loop: 20 m. Essa diferença de energia potencial vira energia cinética.',
          trecho: 'Com conservação da energia mecânica, a velocidade num ponto depende apenas da diferença de altura em relação ao ponto de partida.'
        }
      ]
    }
  ]
});
