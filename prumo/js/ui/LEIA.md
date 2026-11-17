# Telas do Prumo · casca, componentes e convenções

As telas (`js/ui/`) só leem o núcleo (`js/nucleo/`, contrato em `js/nucleo/API.md`) e mandam eventos. Nenhuma tela calcula nível, data, regra ou frase: os textos chegam prontos nos view models. Se faltar alguma coisa, ela entra no núcleo, com teste e com uma linha no `API.md` (foi assim com `avisoInserida`, o aviso da questão da equipe inserida pelo Pilar III).

## 1. Como o app sobe

```
index.html → js/app.js → criarNucleo({ pack }) (js/nucleo/nucleo.js + conteudo/mat-fa.js)
                       → criarApp(nucleo, #app, { relogio }) (js/ui/casca.js) → iniciar()
                       → registra sw.js (offline; aviso de versão nova fora da missão)
```

`window.__prumo = { nucleo, app, relogio }` existe só para os roteiros de navegador de `_dev/ui/`.

## 2. A casca (`casca.js`)

- **Roteador.** A tela a desenhar vem sempre de `nucleo.tela()`:
  - `primeiroUso` → `primeiro-uso.js`;
  - estados da missão (`pergunta`, `leitura`, `feedback`, `trecho`, `fimDaRodada`, `cards`, `trechoCard`, `fimDaMao`) → `missao.js`, em tela cheia e sem abas;
  - `encerramento` → `pronto.js`; `prova*` → `prova.js`;
  - `hoje` e `feito` → as abas, pelo hash: `#/hoje` (`hoje.js`), `#/caderno[/erros|/notas|/cards|/pagina/<id>[/<parágrafo>[/erro]]]` (`caderno.js`; `/erro` acende o marca-texto no parágrafo que o erro cobrou), `#/plano` (`plano.js`), `#/perfil` (`perfil.js`, com as seções de `ajustes.js`; `#/ajustes` abre o Perfil).
- **Abas (barra de baixo).** Hoje, Estudar, Caderno, Plano e Perfil: ícone de traço em SVG (24 px, stroke 1,75, `currentColor`) + rótulo; a atual em tinta, com o grifo de marca-texto atrás do ícone; fundo papel, fio de pauta no topo, safe-area. A partir de 960 px viram o trilho lateral (`.trilho`), com a marca; a marca do topo das abas some (uma marca só) e a coluna das abas fica no centro do espaço à direita do trilho. `#/ajustes` abre o Perfil. Rotas novas: `#/estudar[/<tópico>[/teoria]]` (`estudar.js`) e `#/perfil` (`perfil.js`, que inclui `secoesAjustes()` de `ajustes.js`).
- **Faixas** (no topo, no fluxo, nunca fixas): modo demonstração ("**Modo demonstração:** dados de exemplo, data simulada 18/11." e "Sair"), falha ao salvar (com "Salvar uma cópia"), estado ilegível e versão nova do app (só fora da missão e só para quem abriu o app já com o service worker no controle: na primeira visita não há versão nova). Fundo `papel-2` e fio de 1 px; nunca latão. No computador, começam depois do trilho.
- **Bilhete** (`.bilhete` em `#aviso-raiz`): o aviso passageiro de `ctx.avisar` ("Cópia salva", "Plano guardado"). Fica fixo perto da ação, acima da barra de baixo (no computador, no pé da coluna), com "Fechar"; some ao navegar. É o único fixo além da barra, e só depois de uma ação.
- **Histórico e Voltar do Android (b.2).** Entrar na missão empilha uma entrada de guarda (`#/missao`). Voltar: folha aberta → fecha; `trecho`/`trechoCard` → `VOLTAR`; qualquer estado da missão → abre a folha "Encerrar"; Pronto por hoje → `FECHAR`; Primeiro uso → pergunta anterior. Recarregar no meio da missão recria a guarda.
- **Foco.** Tela nova: rola ao topo e foca o elemento `[data-foco-inicial]` (o título, com `tabindex="-1"`). Mesmo estado redesenhado (ex.: "Ver a resolução", virar o card): mantém a rolagem e devolve o foco ao mesmo controle; se ele sumiu, vai para `[data-foco-apos]`. Um clique numa aba dispara `popstate` e `hashchange`: a casca desenha uma vez só (guarda o hash desenhado). Figura ampliada: cada figura tem `data-fig`, e o foco volta a ela quando a folha do zoom fecha.
- **Som.** Toca `vm.som` só na transição que o produziu (nunca ao redesenhar nem ao voltar do trecho) e só com o som ligado. O áudio nasce dentro de um toque (iPhone).
- **Virada de data.** `nucleo.conferirData()` ao voltar ao app (`visibilitychange`) e à meia-noite.

## 3. Contrato de um módulo de tela

```js
export function telaX(ctx, t, rota) {
  return {
    chave: 'x:…',        // muda → tela nova (rola ao topo e foca o título)
    titulo: 'Título',    // document.title
    html: h`…`,          // conteúdo (h`` escapa tudo; HTML do pack entra com cru())
    barra: h`…`,         // opcional: a barra fixa de ação (só na missão)
    depois(raiz, { mudou }) { … return () => limpeza; },   // opcional
  };
}
```

`ctx`: `nucleo`, `ui` (estado local da tela: `folha`, `pu`, `selecao`, `memoria`), `relogio`, `render()`, `despachar(evento)`, `abrirFolha(tipo, dados, origem)`, `fecharFolha()`, `redesenharFolha()`, `irPara(hash)`, `avisar(texto)`, `anunciar(texto)` (leitor de tela), `baixar({nome, conteudo, tipo})`, `reduzido()`, `tocar(som)`, `prepararSom()`.

**Eventos por atributo** (delegação na casca):

| Atributo | Efeito |
|---|---|
| `data-ev="TIPO"` | `ctx.despachar({ tipo })` (ignorado com `aria-disabled="true"`) |
| `data-acao="nome"` (+ `data-arg`) | `acoes.nome(ctx, el, evento)` |
| `data-folha="nome"` (+ `data-arg`) | abre a folha `folhas.nome(ctx, dados, t)` |
| `data-mudar` / `data-digitar` / `data-enviar` | `change` / `input` / `submit` → `acoes[nome]` |

Ações e folhas se registram com `registrar({ acoes, folhas })` (`registro.js`). Folhas devolvem `{ rotulo, corpo, pe?, alta?, fechar?, depois? }` (`fechar: false` tira o "Fechar" do topo quando o pé já tem um) e são desenhadas em `#folha-raiz`, com a tela marcada como `inert`.

Ações comuns da casca: `sairDemo`, `salvarCopia`, `fecharAviso`, `atualizarApp`, `fecharFolha`, `recarregar`.

## 4. Componentes reutilizáveis (`componentes.js`): o design system "Prumo"

Cada componente é um objeto do material de estudo (o "teste do objeto real" do design system: se não aponta para um objeto, não entra).

| Função | Objeto real | Para quê |
|---|---|---|
| `marca()`, `simbolo()` | a marca | símbolo Cadeado-P sem alteração (anel marinho, branco no escuro; esquadro azul; fechadura em latão) + "prumo" em Gabarito 700 minúsculo, tinta |
| `teoria(vm, { naFolha, ancora, grifar })` | apostila impressa | teoria de um tópico de prática: capa (selo "Apostila de Matemática", título, dados), sumário que leva a cada seção (botões `irSecao`, não `href`; recolhido no celular atrás de "Sumário: N seções"; fixo à esquerda no computador, com `aria-current` na seção lida, por `acompanharSumario(raiz)`), seções com id `secao-N` (e `secao-cuidado`, `secao-resumo`), o mesmo formato da âncora do núcleo; figura (toque ou clique para ampliar), tabela, quadro "No Enem", exemplos resolvidos, "Cuidado" e "Resumo do tópico". `naFolha`: sem capa e em uma coluna (folha "Rever a apostila"); `ancora` + `grifar`: a seção cobrada ganha o marca-texto no título e a folha abre nela (`idDaAncora`, `irParaSecao`) |
| `trilha(fase, { livre })` | | onde o aluno está no tópico: Aquecer → Apostila → Questões → Visto ("Registro" no estudo por conta própria). Número e rótulo, a atual sublinhada em tinta, as feitas com ✓; não é botão. Vai dentro do `topo` (sempre no mesmo lugar) e no Pronto (`'fim'`: tudo feito; a fase `'registro'` do estudo livre é a mesma casa do `'visto'`) |
| `comoFunciona({ aberto, itens })` | | "Como funciona um tópico", com os itens do núcleo (`topicoPagina().comoFunciona`); aberto na primeira visita, logo abaixo do botão; depois, `details` com "+" |
| `constancia(c)`, `risquinhos(n)` | risquinhos no canto do caderno | **Risquinhos**: grupos de 5 (quatro em pé, um atravessado), sempre o mesmo desenho para o mesmo número, quebram de linha a cada 8 grupos; com "N dias estudados" (`contagem`). Só crescem. É o único símbolo de constância (a chama saiu) |
| `cabecalhoProva(celulas)` | cabeçalho de prova | **Cabecalho**: Capítulo, Páginas e Tempo (sem Data); rótulo impresso (`rotulo`, grafite-2), valor "à caneta" em Mono tinta; a unidade ("min") é palavra e fica no texto |
| `recado(r, { papel })` | recado da agenda | **Recado**: "**Ontem:** você parou…" em negrito + frase, sem caixa, sem filete lateral |
| `topo(topoVM, { trilha, … })`, `regua(topoVM, { semPasso })`, `medidor(md)` | régua escolar | topo da missão: etapa e "Encerrar"; no tópico de prática, a trilha logo abaixo e a régua só na etapa Questões (legenda só com "faltam N", na mesma linha das casas); **Régua** com traços SVG de 1, 5 e 10 por cima do preenchimento tinta .82, marcas entre os passos e a legenda "passo 3 de 5" / "faltam 2 questões" (nunca tempo); o medidor de duas casas (traços de régua com o rótulo, sem moldura) nos passos que contam; a regra uma vez no início da rodada |
| `questaoCab(item, { comoTitulo })` | caderno impresso do Enem | "QUESTÃO 162" (maiúsculas por CSS, como no papel) e a prova; questão da equipe: "QUESTÃO DA EQUIPE" e a página. Em questão do Enem/da equipe, é o título (`h1`) da tela |
| `enunciado(item)`, `rodape(texto, url)` | | questão (HTML do pack) e atribuição com o link da licença |
| `alternativasPergunta(alts, marcada)` | cartão-resposta | **CartaoResposta**: rádio nativo cobrindo a linha inteira (48 px), bolha oval A–E em Mono; marcada = bolha cheia de tinta |
| `alternativasFeedback(alts)` | correção a caneta | `.certa`: bolha tinta + círculo de caneta que não fecha (máscara SVG) e a nota "certa"; `.sua`: bolha grafite-2 e "sua marcação". Sem vermelho, sem riscado |
| `blocos(bs, ancora, { grifar })`, `paragrafo(…)` | caderno pautado | **Trecho**: `.pagina` com pauta no passo de 30 px, margem rosa (`margem-caderno`), "§ N" em Mono na margem, fio de prumo (`.fio-prumo`) no parágrafo atual e, com `grifar`, o **marca-texto** só no trecho que o erro cobrou (uma vez por tela) |
| `nivel({ cheios, de, animar, nome })` | régua curta | nível do capítulo em 5 passos com o nome; enche só o que subiu (180 ms), nunca anima perda |
| `visto(v, { novo })` | visto do professor | **Visto**: carimbo roxo (`carimbo`) inclinado −4°, máscara de tinta, "VISTO", data dd/mm/aaaa em Mono e a observação; `is-novo` desce em 140 ms sem quique, só sem movimento reduzido |
| `trofeu(t, { novo })` | troféu da Prova | o mesmo carimbo do visto, com a taça em traço, "Troféu" (caixa normal), o nome do caderno e o dia; no resultado da Prova vencida (som `trofeu`, tocado pela casca na chegada), no Sumário do Caderno e no Perfil |
| `botaoContinuar(c)` + `animarContinuar(raiz)` | "ainda não" | intervalo deliberativo: botão tracejado "Leia a explicação" (`aria-disabled`), a pauta enche por baixo, lisa |
| `prepararFiguras(raiz, { aoAmpliar })`, `ampliarFigura(ctx, el)` | | imagem e gráfico com zoom: `ampliarFigura` abre a folha `zoom` com uma cópia limpa da figura; no celular (< 720 px) a folha é a tela inteira e a figura abre com 1,5 vez a largura que tinha na página, no mínimo a da tela (`zoomInicial(el)`), pelo meio; um só "Fechar", no pé, ao lado do − e do +. Imagem que não carregou mostra o aviso e a descrição |
| `folha({...})` | | moldura das folhas, com "Fechar" escrito |

A **Ficha** (card de memorização) está em `missao.js` (`.ficha`): fundo `ficha`, borda de 1 px `pauta-forte` igual nos quatro lados, linha de 2 px tinta sob o cabeçalho ("Cap. 1" e "revisão N de 5"), pauta, frente em Gabarito, verso em texto; vira em ~180 ms. `topoAba()` (em `hoje.js`) é o topo comum de Hoje, Caderno e Plano.

`dom.js`: `h`, `cru`, `cada`, `esc`, `reduzido`, `depoisDoQuadro`, `baixar`, `escolherArquivo`. `som.js`: `preparar`, `tocar('acerto'|'erro'|'nivel'|'marco'|'trofeu')`.

## 5. Convenções de CSS (`css/prumo.css`, design system "Prumo")

- **Tokens** em `:root` (tema claro "Papel"), trocados por `@media (prefers-color-scheme: dark)` e por `:root[data-theme="dark"]` (tema escuro "Caderno à noite"); `:root[data-theme="light"]` força o claro. Cores: `--papel` (fundo de toda tela), `--papel-2` (divisórias de trás, faixas), `--ficha`, `--pauta` (linhas e fios de 1 px), `--pauta-forte` (bordas de ficha, controles inativos, 3:1), `--margem-caderno` (só a linha rosa da margem), `--grafite`/`--grafite-2` (texto e apoio), `--tinta`/`--on-tinta` (botão, link, bolha marcada, círculo da certa, fio de prumo, régua cheia, valores do cabeçalho), `--marca-texto`/`--on-marca-texto`, `--carimbo` (só o visto e a Prova vencida), `--latao` (só dentro do símbolo), `--foco`. Use só tokens. **Não existe vermelho nem verde de acerto.**
- **Tipos** (woff2 do próprio app em `fontes/`, `fontes/fontes.css`; nada de servidor externo): Gabarito 700/800 (`--font-display`: `.manchete` 32/36 800 = título da missão, uma por tela; `.titulo` 24/30; `.titulo-pequeno`, `.passo-rotulo`, `.folha-titulo`; botões e abas), Atkinson Hyperlegible Next 400/600 (`--font-texto`: leitura 18/30, corpo 16/24, apoio 14/20, `.rotulo` 13/16 600 grafite-2 **em caixa normal**, `.contagem` 15/20 600), Atkinson Hyperlegible Mono 500 (`--font-numeros`) **só em dígitos puros**: valor do Cabecalho, "§ N" da margem, data do Visto, letra da bolha, rodapé de página. Frase nunca vai em Mono. Nenhum rótulo em maiúsculas espaçadas, exceto "VISTO" e "QUESTÃO N".
- **Forma:** grade de 4 px; margem lateral 16 px; entre blocos 24 px. A folha do caderno tem canto vivo; botões e campos 10 px, abas 12 px (só de um lado), ficha 8 px, cabeçalho/régua/carimbo 6 px; traços pequenos (nível, meta da semana, grifo da aba) 2 a 4 px; bolha oval só na escolha única (a caixa de marcar é quadrada, com ✓). Nada em pílula. **Nenhuma sombra** (a apostila também não tem): separação por fio de 1 px ou por mudança de papel. Sem filete lateral grosso em caixa.
- **Mouse:** com `(hover: hover)`, abas, alternativas, botões, links e itens do sumário respondem ao passar por cima (cor, traço ou fundo de 8 % de tinta), nunca com sombra. No computador, os botões do fluxo ("Começar", "Estudar este tópico", "Terminei de ler") têm o tamanho do rótulo (mínimo de 360 px), não a coluna inteira.
- **Voz:** sem cadeias de metadados com "·" (se são campos, Cabecalho; se é frase, a frase); "parágrafo N" na tela, "§ N" só na margem; números e datas exatos ("faltam 2 questões", nunca "≈"); sem exclamação, emoji, "perdeu", "sequência".
- **Botão principal** (`.botao`): tinta, raio 10, Gabarito 18; desabilitado (`aria-disabled="true"`) = contorno tracejado `pauta-forte`. `.botao-sec`: contorno tinta de 2 px. `.link`: sublinhado de 2 px em tinta, afastado 5 px. Um botão cheio por tela.
- **Uma só barra fixa por tela:** nas abas, `.trilho` (as Divisórias); na missão, `.barra` (vem de `barra:` do módulo). "Começar" e "Terminei de ler" ficam no fluxo. Barras com `env(safe-area-inset-bottom)`.
- **Alvos de 48 px:** `.botao`, `.botao-sec`, `.link`, `.aba`, `.chip span`, `.alt`, `.escolha`, `summary`. Links de texto corrido (rodapé de licença) são a exceção prevista na WCAG.
- **Foco visível:** anel sólido de 3 px em `--foco` (tinta), afastado 3 px, nos dois temas.
- **Movimento:** só três gestos: o carimbo descendo (140 ms, sem quique), a ficha virando (180 ms) e a régua enchendo um passo (nível, 180 ms). Com `prefers-reduced-motion`, tudo aparece no estado final. Nenhuma animação de perda.
- **Classes de estrutura:** `.conteudo` (abas), `.linha-topo` (marca + Ajustes), `.linha-data` (data + risquinhos, quebra quando falta espaço), `.rosto`/`.bloco-titulo`/`.acoes-rosto` (Hoje), `.missao` (página da missão, 64 caracteres), `.colofao` (Pronto por hoje), `.pr-frases` (resumo em frases), `.pu` (Primeiro uso), `.secao`, `.subabas`/`.subaba` (Sumário | Erros | Notas | Cards), `.links` (links lado a lado, sem separador).

## 6. Telas a completar (do outro agente)

Os módulos abaixo já estão registrados, funcionam com o núcleo e passam pela auditoria, mas são versões simples, marcadas `[A COMPLETAR]` no topo do arquivo:

- `caderno.js`: Sumário (nível em régua curta, estado com data, regra do capítulo bloqueado com o número em contorno, troféu, marcos, créditos), Erros (título "Caderno de erros", com a área no rótulo, agrupados pela fonte: o caderno e cada tópico de prática; "Foi isso?", "Refazer com outros números" com `iniciarRefazer`/`responderRefazer`/`fecharRefazer`/`refazer()`, "Ir além", filtro por capítulo), Notas (editar e apagar), Cards (baralho por capítulo, "revisão N de 5", próxima data), leitor de página (notas por parágrafo, Ir além, crédito do Wikilivros).
- `plano.js`: mudar prova, dias, minutos, meta e horário (`mudarPlano`), pausa (`marcarPausa`/`encerrarPausa`), régua completa rolável, "Por que esta ordem?", tabela de intervalos com "ver a regra".
- `ajustes.js`: créditos item a item (`creditos()`), confirmação de "Apagar tudo" em folha, "Copiar dados" com retorno, avançar dias.
- `prova.js`: a Prova vencida em `carimbo` (a única cor de conquista; nada de latão fora do símbolo): o troféu anunciado na abertura desce no resultado (`trofeu()`, com o som `trofeu` na chegada) e o selo da matéria vem junto quando é o primeiro troféu dela; casas por capítulo no topo.
- `hoje.js`, "Hoje vence": o marca-texto só no que vence hoje; as revisões atrasadas vão em texto normal (aviso de ordem, sem cobrança), e o bloco da missão não repete "N revisões atrasadas vêm primeiro." quando esse aviso já está no topo.

Reaproveite os componentes da seção 4 e as convenções da seção 5. Para conferir: `_dev/ui/auditoria.cjs`.

## 7. Testes de navegador (`_dev/ui/`)

Na pasta `prumo/`, com o servidor em `http://127.0.0.1:8767/prumo/`:

```
NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_g7.cjs        # g.7, passos 1–7, recarga, Voltar, Encerrar
NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_estados.cjs   # exemplo, cards, estados de Hoje, 2º dia, zoom
NODE_PATH="$(npm root -g)" node _dev/ui/auditoria.cjs         # contraste, vermelho, 48 px, barra fixa
NODE_PATH="$(npm root -g)" node _dev/ui/offline.cjs           # service worker, precache e modo avião
NODE_PATH="$(npm root -g)" node _dev/ui/desktop.cjs           # trilho no computador e movimento reduzido
NODE_PATH="$(npm root -g)" node _dev/ui/capturas_ds.cjs       # capturas 390×844 do design system (_dev/capturas/ds-*.png)
node _dev/ui/gera_precache.mjs                                 # refaz a lista do precache do sw.js
```

Cada roteiro roda no Chromium (360×780) e no WebKit (perfil iPhone 13), nos temas claro e escuro, e salva capturas em `_dev/capturas/ui/`. O WebKit do Playwright 1.64.1 pede a build 2370; a instalada é a 2359, e `comum.cjs` aponta para ela (ou para `PRUMO_WEBKIT`).

## 8. Publicação

Ao publicar uma versão nova: rode `node _dev/ui/gera_precache.mjs` e suba `VERSAO` em `sw.js` (a atual é `prumo-pwa-v2`, a do design system; depois `v3`…). O cache das fontes se chama `prumo-pwa-fontes-v2` (Gabarito e Atkinson Hyperlegible); se a URL das fontes mudar de novo, troque o nome dele também, e o `activate` apaga o antigo. O `activate` só apaga caches com o prefixo `prumo-pwa-`, para não tocar no app antigo, que mora na mesma origem.


## 9. Estudar, Perfil e primeiro uso (novos)

- `estudar.js`: mapa (área → matéria → tópico com a régua de nível e o progresso), página do tópico ("Estudar este tópico hoje" → `ESTUDAR_TOPICO`; sem poder, o botão fica tracejado e o motivo aparece logo abaixo), teoria em leitura livre.
- Missão de tópico: `missao.js` desenha `vm.teoria` na leitura e no "Rever a apostila" (folha, aberta na seção `vm.ancora` quando o conteúdo informa; sem âncora, abre no sumário); a pré-pergunta e as questões usam o cartão-resposta de sempre (alternativas do INEP em HTML com `a.html`). A trilha vem de `vm.fase` e `vm.livre`; enquanto um estado não as traz, `trilhaDe()` as tira da missão (tipo `topico` e a última resposta). No estudo por conta própria, a folha Encerrar fala do estudo, não da missão do dia.
- Caderno de erros: o erro de um tópico de prática tem "Rever a apostila" (`#/estudar/<tópico>/teoria/secao-N`: a apostila abre na seção, com o marca-texto no título).
- `hoje.js`: saudação ("Oi, Daniel"), risquinhos em destaque e o bloco "Seu próximo conteúdo" com o Começar logo no topo; a regra e "Por que esta missão?" continuam.
- `primeiro-uso.js`: 3 telas de boas-vindas (Pular/Próximo, com o atalho dos dados de exemplo), depois a frase do Prumo, o nome e as 3 perguntas (prova e data; matérias, com "em breve"; dias e minutos). O horário do alarme foi para o passo do lembrete; o som fica no Perfil.
- Roteiro: `_dev/ui/roteiro_estudar.cjs` (capturas 390×844 em `_dev/capturas/est-*.png`).
