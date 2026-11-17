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
  - `hoje` e `feito` → as abas, pelo hash: `#/hoje` (`hoje.js`), `#/caderno[/erros|/notas|/cards|/pagina/<id>[/<parágrafo>]]` (`caderno.js`), `#/plano` (`plano.js`), `#/ajustes` (`ajustes.js`, pela engrenagem).
- **Abas.** Hoje · Caderno · Plano: barra inferior no celular (a única barra fixa dessas telas) e trilho à esquerda a partir de 960 px, com o símbolo e o nome.
- **Faixas** (no topo, no fluxo, nunca fixas): modo demonstração ("Modo demonstração · dados de exemplo · Sair", com a data simulada), falha ao salvar (com "Salvar uma cópia"), estado ilegível, versão nova do app (só fora da missão) e avisos passageiros (`ctx.avisar`).
- **Histórico e Voltar do Android (b.2).** Entrar na missão empilha uma entrada de guarda (`#/missao`). Voltar: folha aberta → fecha; `trecho`/`trechoCard` → `VOLTAR`; qualquer estado da missão → abre a folha "Encerrar"; Pronto por hoje → `FECHAR`; Primeiro uso → pergunta anterior. Recarregar no meio da missão recria a guarda.
- **Foco.** Tela nova: rola ao topo e foca o elemento `[data-foco-inicial]` (o título, com `tabindex="-1"`). Mesmo estado redesenhado (ex.: "Ver a resolução", virar o card): mantém a rolagem e devolve o foco ao mesmo controle; se ele sumiu, vai para `[data-foco-apos]`.
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

Ações e folhas se registram com `registrar({ acoes, folhas })` (`registro.js`). Folhas devolvem `{ rotulo, corpo, pe?, alta?, depois? }` e são desenhadas em `#folha-raiz`, com a tela marcada como `inert`.

Ações comuns da casca: `sairDemo`, `salvarCopia`, `fecharAviso`, `atualizarApp`, `fecharFolha`, `recarregar`.

## 4. Componentes reutilizáveis (`componentes.js`)

| Função | Para quê |
|---|---|
| `topo(topoVM, { medidor, semRegra, rotuloDaTela })` | topo da missão: etapa, "ver a regra", "Encerrar", medidor e a linha fina de progresso (o fio de baixo); a regra aparece uma vez no início da rodada |
| `medidor(md)` | medidor de duas casas, com o rótulo de quem as encheu |
| `enunciado(item)`, `rodape(texto, url)` | questão (HTML do pack) e atribuição com o link da licença |
| `alternativasPergunta(alts, marcada)` | rádio nativo; a área inteira seleciona; fios entre as alternativas |
| `alternativasFeedback(alts)` | "sua" (tracejado `--errada-contorno`) e "certa" (contorno `--certa-contorno` e ✓) |
| `blocos(blocosVM, ancora)`, `paragrafo(par, ancora)` | página de livro com § na margem; `ancora` desenha o fio de prumo |
| `nivel({ cheios, de, animar, nome })` | 5 segmentos com o nome do nível; anima só o que subiu (200 ms), nunca a perda |
| `regua(tracos, { animarUltimo })`, `chama(acesa)`, `constancia(c)` | constância (Decisão 3): régua ou chama, sempre com "N dias estudados" |
| `botaoContinuar(c)` + `animarContinuar(raiz)` | intervalo deliberativo: "Leia a explicação", preenchimento liso, `aria-disabled` |
| `prepararFiguras(raiz, { aoAmpliar })` | imagem e gráfico com zoom em tela cheia; imagem que não carregou mostra o aviso e a descrição |
| `folha({...})` | moldura das folhas |
| `simbolo()`, `linkAjustes()`, `icones` | marca (Cadeado-P pelos tokens), engrenagem, ícones de traço 1,5 px |

`dom.js`: `h`, `cru`, `cada`, `esc`, `reduzido`, `depoisDoQuadro`, `baixar`, `escolherArquivo`. `som.js`: `preparar`, `tocar('acerto'|'erro'|'nivel'|'marco'|'trofeu')`.

## 5. Convenções de CSS (`css/prumo.css`, c.0.1 à risca)

- **Tokens** em `:root`, trocados por `@media (prefers-color-scheme: dark)` e por `:root[data-theme]`: `--fundo`, `--papel`, `--texto`, `--texto-2`, `--fio` (marinho a 12%), `--fio-forte`, `--link`, `--foco`, `--certa-contorno`, `--errada-contorno`, `--botao-*`, `--cheio`, `--contorno-comp`, `--faixa`, `--latao`. Use só tokens; nenhuma cor solta. **Não existe vermelho.** Latão só em conquista (régua, chama, Prova) e na faixa do modo demonstração, sempre com texto marinho por cima.
- **Composição:** coluna única alinhada à esquerda; grade de 4 px; raio de 2 px; nenhuma sombra; separação por fios de 1 px (`.fio`, `.lista-fios`, bordas), nunca cartão com contorno. Única exceção: a ficha do card (`.ficha`, fio de 1 px, raio 2 px, linha cobalto no topo).
- **Tipos:** `.titulo`, `.manchete`, `.colofao-titulo` em Poppins 600; o resto em Inter. `.rotulo` = Inter 12, maiúsculas, +6%, no máximo 3 palavras (regra em caixa normal na linha de baixo). `body` já tem `tabular-nums`.
- **Uma só barra fixa por tela:** nas abas, `.trilho`; na missão, `.barra` (vem de `barra:` do módulo). "Começar" e "Terminei de ler" ficam no fluxo. Barras com `env(safe-area-inset-bottom)`.
- **Alvos de 48 px:** `.botao`, `.botao-sec`, `.link`, `.aba`, `.chip span`, `.alt`, `.escolha`. Links de texto corrido (rodapé de licença) são a exceção prevista na WCAG.
- **Foco visível:** `:focus-visible` com `--foco` (2 px, afastado 2 px) nos dois temas.
- **Movimento:** 150–200 ms (`--t`); com `prefers-reduced-motion`, nada anima. Nenhuma animação de perda.
- **Classes de estrutura:** `.conteudo` (abas), `.missao` (página da missão, 64 caracteres), `.colofao` (Pronto por hoje), `.pu` (Primeiro uso), `.secao`, `.subabas`/`.subaba` (Sumário | Erros | Notas | Cards), `.aviso-linha` (faixa no fluxo), `.links` (links de texto separados por "·").

## 6. Telas a completar (do outro agente)

Os módulos abaixo já estão registrados, funcionam com o núcleo e passam pela auditoria, mas são versões simples, marcadas `[A COMPLETAR]` no topo do arquivo:

- `caderno.js`: Sumário (nível em segmentos, estado com data, regra do capítulo bloqueado com o número em contorno, troféu, marcos, créditos), Erros ("Foi isso?", "Refazer com outros números" com `iniciarRefazer`/`responderRefazer`/`fecharRefazer`/`refazer()`, "Ir além", filtro por capítulo), Notas (editar e apagar), Cards (baralho por capítulo, caixa pelo nome, próxima data), leitor de página (notas por parágrafo, Ir além, crédito do Wikilivros).
- `plano.js`: mudar prova, dias, minutos, meta e horário (`mudarPlano`), pausa (`marcarPausa`/`encerrarPausa`), régua completa rolável, "Por que esta ordem?", tabela de intervalos com "ver a regra".
- `ajustes.js`: créditos item a item (`creditos()`), confirmação de "Apagar tudo" em folha, "Copiar dados" com retorno, avançar dias.
- `prova.js`: troféu em contorno na abertura, troféu em latão com a animação de 600 ms e selo no resultado (som `trofeu`), casas por capítulo no topo.

Reaproveite os componentes da seção 4 e as convenções da seção 5. Para conferir: `_dev/ui/auditoria.cjs`.

## 7. Testes de navegador (`_dev/ui/`)

Na pasta `prumo/`, com o servidor em `http://127.0.0.1:8767/prumo/`:

```
NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_g7.cjs        # g.7, passos 1–7, recarga, Voltar, Encerrar
NODE_PATH="$(npm root -g)" node _dev/ui/roteiro_estados.cjs   # exemplo, cards, estados de Hoje, 2º dia, zoom
NODE_PATH="$(npm root -g)" node _dev/ui/auditoria.cjs         # contraste, vermelho, 48 px, barra fixa
NODE_PATH="$(npm root -g)" node _dev/ui/offline.cjs           # service worker, precache e modo avião
NODE_PATH="$(npm root -g)" node _dev/ui/desktop.cjs           # trilho no computador e movimento reduzido
node _dev/ui/gera_precache.mjs                                 # refaz a lista do precache do sw.js
```

Cada roteiro roda no Chromium (360×780) e no WebKit (perfil iPhone 13), nos temas claro e escuro, e salva capturas em `_dev/capturas/ui/`. O WebKit do Playwright 1.64.1 pede a build 2370; a instalada é a 2359, e `comum.cjs` aponta para ela (ou para `PRUMO_WEBKIT`).

## 8. Publicação

Ao publicar uma versão nova: rode `node _dev/ui/gera_precache.mjs` e suba `VERSAO` em `sw.js` (`prumo-pwa-v2`, `v3`…). O cache das fontes (`prumo-pwa-fontes`) fica. O `activate` só apaga caches com o prefixo `prumo-pwa-`, para não tocar no app antigo, que mora na mesma origem.
