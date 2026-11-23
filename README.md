# Prumo · App de Estudos

Uma missão de estudo por dia para o Enem, com fim marcado. O aluno responde a uma pergunta antes de ler, lê a apostila, resolve questões reais do Enem, e o app marca as revisões até a prova.

TCC · Etec Jornalista Roberto Marinho · Técnico em Programação de Jogos Digitais.

## Abrir no celular

**https://openflows-ofc.github.io/capisco/prumo/**

<img src="leia/qr-prumo.png" alt="QR code que abre o Prumo" width="220">

1. Aponte a câmera do celular para o QR code ou abra o link acima.
2. Para conhecer o app com dados prontos, toque em **Ver com dados de exemplo** na primeira tela.
3. Para usar de verdade, toque em **Próximo** e monte o seu plano: nome, data da prova, matérias e dias de estudo.

### Instalar como aplicativo (opcional)

- **Android (Chrome):** abra o link, toque no menu **⋮** e depois em **Instalar app** ou **Adicionar à tela inicial**. No Prumo, o link **Como instalar no celular** tem um botão que instala com um toque.
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

Instalado, o Prumo abre sem internet. Não há cadastro: os dados ficam só no aparelho. Para levar o progresso para outro celular, use **Perfil → Ajustes, dados e créditos → Salvar uma cópia do meu progresso**.

## O que tem no app

- **Hoje:** a missão do dia e o botão Começar.
- **Estudar:** o mapa das áreas do Enem. Matemática e Linguagens estão disponíveis; Ciências da Natureza e Ciências Humanas chegam nas próximas versões.
- **Caderno:** os capítulos de Funções afins, com os erros, as notas e os cartões.
- **Plano:** as revisões marcadas até a data da prova.
- **Perfil:** os vistos dos dias estudados, o plano, a cópia dos dados e o modo de demonstração.

## Como funciona por dentro

- **Aplicativo web progressivo (PWA)** em JavaScript puro (ES modules), sem framework e sem servidor. Funciona offline com service worker e pode ser instalado.
- **Núcleo separado das telas** (`prumo/js/nucleo`): as regras ficam no núcleo e não tocam no HTML. Isso vale para a missão do dia, os níveis de 1 a 5, as revisões espaçadas e a prova do caderno. As telas (`prumo/js/ui`) só desenham o que o núcleo entrega.
- **Máquina de estados da missão:** aquecimento → apostila → questões → fim do dia. Toda missão chega ao fim, mesmo quando o aluno erra ou sai no meio.
- **Motor de regras explicável:** a missão do dia é escolhida por uma lista de regras, e o app mostra ao aluno por que escolheu cada coisa.
- **Conteúdo:**
  - questões reais do Enem (INEP, CC BY-ND 3.0), com o texto íntegro e o gabarito conferido nos microdados;
  - apostilas adaptadas do Wikilivros (CC BY-SA), com as fontes e os créditos das imagens no fim.
- **Qualidade:**
  - testes automatizados do núcleo: `node --test prumo/_dev/testes/*.test.mjs`;
  - roteiros de navegador com Playwright em Chromium e WebKit, nos temas claro e escuro, no celular, no computador e offline.

## Situação

Este é um MVP. O aplicativo está completo e funcionando. O material didático ainda não passou pela revisão de um professor de cada área.

A versão anterior do projeto (Capisco) continua em [`jogo/`](jogo/LEIA-ME.md).
