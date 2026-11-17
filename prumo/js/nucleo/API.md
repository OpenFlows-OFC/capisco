# Núcleo do Prumo · contrato para as telas

O núcleo (`js/nucleo/`) não toca no DOM. Ele guarda o estado, aplica as regras e entrega **view models**: objetos com tudo já calculado e os textos prontos em português. A tela só lê esses objetos e manda eventos. Nenhuma tela calcula nível, data, regra ou frase.

## 1. Como ligar

```js
import { criarNucleo, relogio } from './js/nucleo/nucleo.js';   // relogio = js/nucleo/relogio.js
import { pack } from './conteudo/mat-fa.js';

const nucleo = criarNucleo({ pack });          // lê localStorage["prumo"] e faz a Abertura (b.2)
let { nome, vm, faixas } = nucleo.tela();      // a tela a desenhar agora
nucleo.despachar({ tipo: 'COMECAR' });          // evento → true se houve transição, false se foi ignorado
({ nome, vm, faixas } = nucleo.tela());        // depois de todo evento ou ação, desenhe de novo
```

- `criarNucleo({ pack, storage })`: `storage` é opcional (padrão: `localStorage`; nos testes, `memoria()` de `estado.js`).
- `nucleo.tela()` devolve `{ nome, vm, faixas }`. `nome` é o estado da máquina (seção 3); `vm` é o view model dele; `faixas` traz as faixas fixas: `demo` (modo demonstração: `{ texto, dataSimulada, sair, rotulo: 'Modo demonstração', frase: 'dados de exemplo, data simulada 18/11.' }`; a tela usa `rotulo` + `frase`, no formato do Recado), `falhaSalvar` (`{ texto, acao }`, quando o `localStorage` falhou) e `carga`.
- Todo efeito acontece dentro da transição e é salvo na hora. Recarregar a página volta ao mesmo passo: a tela não precisa guardar nada.
- Ao voltar para o app (`visibilitychange`) e perto da meia-noite, chame `nucleo.conferirData()`: com a missão pela metade, ela fecha a de ontem, mostra a faixa "Ontem você parou no passo N de M. Ficou registrado." e monta a de hoje.

## 2. Relógio (testes e demonstração)

`relogio.js` concentra `hoje()` e `agora()`. Nada no núcleo usa `new Date()` direto.

| Função | Para quê |
|---|---|
| `definirFonte(f)` | troca a fonte do tempo: função que devolve ms, número (ms fixo), `'AAAA-MM-DD'` ou `'AAAA-MM-DDTHH:MM'`; `definirFonte(null)` volta ao relógio real |
| `relogioFalso(inicio)` | relógio que se avança: `{ avancarMs(n), irPara(data), ms }` (usado pelos testes e pelo estado de exemplo) |
| `setOffset(dias)` / `getOffset()` | deslocamento do modo demonstração (gravado em `config.demo.offset`) |
| `hoje()`, `agora()` | data local `'AAAA-MM-DD'` e instante em ms, já com o deslocamento |
| `fmtCurta`, `fmtLonga`, `fmtCabecalho`, `fmtDiaSemana`, `fmtRelativa`… | datas em português ("sex 20/11", "QUINTA, 19 DE NOVEMBRO", "Segunda, 23/11", "amanhã, qui 19/11") |

No app, o modo demonstração usa `nucleo.avancarDias(1)` ou `nucleo.avancarDias(7)`; o núcleo grava o deslocamento e faz a virada de data.

## 3. Estados e eventos (máquina de b.1–b.4)

| `nome` | Tela | Eventos aceitos |
|---|---|---|
| `primeiroUso` | c.1 | `CONCLUIR {perfil}` (ou `nucleo.concluirPrimeiroUso(perfil)`), `RESTAURAR_COPIA {texto}`; "Ver com dados de exemplo" = `nucleo.carregarExemplo()` |
| `hoje` | Hoje (c.2), inclusive folga, pausa, em curso, Hoje não | `COMECAR`, `CONTINUAR`, `HOJE_NAO`, `ESTUDAR_MESMO_ASSIM` (folga), `ENCERRAR_PAUSA`, `FAZER_PROVA` (só quando `vm.prova` existe) |
| `pergunta` | pré-pergunta, checagem, questão do Enem, questão da equipe, revisão, Questão do dia, revisão antecipada (c.3) | `RESPONDER {alt: 'A'..'E'}` (sem `alt`, é ignorado: não há "não sei") |
| `leitura` | trecho da página (c.3b) | `TERMINEI_TRECHO`, `JA_SEI`, `SALVAR_NOTA {texto}` |
| `feedback` | resultado (c.3e, c.3h) | `CONTINUAR` (ignorado antes de `vm.continuar.liberaEm`), `VOLTAR_AO_TRECHO`, `VER_RESOLUCAO` |
| `trecho` | folha com a página ancorada (c.3f) | `VOLTAR` |
| `fimDaRodada` | venceu, teto, teto com pré-requisito (c.3g) | `SEGUIR` |
| `cards` | mão de cards (Decisão 1) | `VIRAR`, `LEMBREI`, `AINDA_NAO`; depois de "Ainda não": `SEGUIR` (próximo card) e `VER_TRECHO` |
| `trechoCard` | página ancorada no parágrafo do card | `VOLTAR` |
| `fimDaMao` | resumo da mão quando ainda há passos depois | `SEGUIR` |
| `encerramento` | Pronto por hoje (c.4) | `FECHAR` |
| `feito` | Hoje no estado feito | (nenhum; `conferirData()` faz a virada) |
| `prova` | abertura da Prova (c.3i) | `COMECAR_PROVA`, `AGORA_NAO` |
| `provaPergunta`, `provaFeedback`, `provaTrecho` | Prova em curso | `RESPONDER`, `CONTINUAR`, `VOLTAR_AO_TRECHO`, `VER_RESOLUCAO`, `VOLTAR`; em todos: `ENCERRAR_PROVA` (não muda nada) |
| `provaResultado` | resultado da Prova | `FECHAR` |

Em qualquer estado da missão (`pergunta`, `leitura`, `feedback`, `trecho`, `fimDaRodada`, `cards`, `trechoCard`, `fimDaMao`), a folha "Encerrar" é da tela e manda um destes dois eventos:

- `PAUSAR` → "Parar e continuar mais tarde (até a meia-noite)": volta a `hoje` com "Continuar · passo N de M".
- `CONFIRMAR_ENCERRAR` → "Encerrar por hoje": `encerramento` parcial; a rodada aberta não muda nível (as tentativas ficam).

Fechar o app tem o efeito de `PAUSAR` (o estado já está salvo). `POR_QUE`, `ENCERRAR` (abrir a folha) e `VOLTAR` entre as perguntas do Primeiro uso são da tela: não mudam o estado e não passam pelo núcleo. O "Voltar" do Android: `trecho` → `VOLTAR`; qualquer estado da missão → abrir a folha "Encerrar".

## 4. View models

Todos os textos já vêm prontos. Campos com `evento` são ações: mande `{ tipo: evento }`.

### `hoje()` (estados `hoje` e `feito`)
- `data` ("Quarta, 18 de novembro", caixa normal: `relogio.fmtTitulo`), `constancia: { simbolo: 'risquinhos', diasEstudados, rotulo: "24 dias estudados" }` (design system: os risquinhos são o único símbolo; a chama saiu).
- `recado`: o aviso de ontem no formato do Recado, `{ rotulo: 'Ontem', texto: 'você parou no passo 4 de 5. Ficou registrado.' }` (ou `null`); `faixa` continua com a frase inteira.
- `estado`: `primeiroDia` · `missao` · `emCurso` · `feito` · `encerradoAntes` · `folga` · `retorno` · `questaoDoDia` · `hojeNao` · `pausa` · `reta` · `firme` · `provaPassou`.
- `texto` (a frase do estado, quando há), `faixa` ("Ontem você parou…"), `acao: { evento, rotulo, nota? }` (botão principal no fluxo).
- `bloco` (a folha de rosto da missão; `null` no feito/folga/pausa): `rotulo` ("Missão 1"), `titulo` ("Cap. 2: Ler o gráfico", "Revisão do Cap. 1"), `cabecalho` (o Cabeçalho de prova, sem Data: `[{ rotulo: 'Capítulo', valor: '1' }, { rotulo: 'Páginas', valor: '1–2' }, { rotulo: 'Tempo', valor: '25', unidade: 'min' }]`; o valor só tem dígitos e vai em Mono), `regra` (o ganho anunciado, com o nome do nível explicado na primeira vez e a data exata, e "No fim, o visto do dia."), `linhaFina` (legado; a tela não mostra), `composicao` (frase: "2 páginas, até 3 questões do Enem e 5 cards."), `atrasada` ("1 revisão atrasada vem primeiro." ou `null`), `ganho` (frase de `regraDaFila`), `esmaecido` (Hoje não), `passos` (para "Ver os passos": `[{ n: '9 a 11', texto, nota?, pagina: 'p. 3' }]`).
- `links`: "ver passos", "Por que esta missão?", "Hoje não" (`HOJE_NAO`) ou aba a abrir (`{ rotulo, aba }`).
- `prova`: oferta da Prova do caderno (`{ titulo, texto, regra, acao: { evento: 'FAZER_PROVA', rotulo: 'ver a regra' } }`) ou `null`. Só aparece antes de começar a missão do dia ou numa folga; nunca no feito.
- `feito: { previa, proxima: { texto, gancho, porque } }` no estado feito; `porqueEstudo` ("Por que eu estudo: …") no "Bem-vindo de volta", quando o aluno escreveu a frase.
- `porQue: { frase, regra, verARegra: { linhas, revisoes, lembranca, questoes, texto, oQueE } }`: folha "Por que esta missão?". A lembrança estimada (percentual) existe **só** aqui.

### `passoAtual()` (estados da missão; `tela()` já escolhe)
- `pergunta`: `{ tipo: 'pre'|'preBloco'|'checagem'|'enem'|'equipe'|'revisao'|'dia'|'antecipada', rotulo (caixa normal: "Antes de ler a p. 1", "Antes do parágrafo 4", "Confira a p. 1", "Questão do Enem", "Revisão do Cap. 1"…), subrotulo, aviso ("Tente antes de ler. Esta página responde."), avisoPrimeiraChecagem, inserida, avisoInserida ("Depois do erro: uma questão da equipe sobre a p. 1, § 2." na questão inserida pelo Pilar III; `null` nas outras), item: { enunciado (HTML), introducao, imagens, figura, alternativas: [{letra, texto, imagem}], rodape (atribuição com o link da licença), cabecalho: { num: 'Questão 162' | 'Questão da equipe', fonte: 'Enem 2023, 2º dia' | 'p. 1' } (o cabeçalho do caderno impresso; a tela põe o número em maiúsculas, como no papel), imagemFalhou }, topo, acao }`. A pergunta **não** traz gabarito.
- `topo`: `{ etapa ("Leitura da p. 3"), encerrar, passo: {n, total}, progresso (0–1), legenda: { passo: 'passo 3 de 5', falta: 'faltam 2 questões' | 'faltam até 3 questões' | null } (legenda da Régua; nunca tempo), medidor, regra: { texto, mostrarAgora, rotulo: 'ver a regra' } }`.
- `medidor` (só nos passos que contam): `{ casas: [{cheia, rotulo}, {cheia, rotulo}], texto ("Falta acertar uma questão do Enem" | "Falta mais um acerto seguido" | "a contagem recomeça" | null), regra }`.
- `leitura`: `{ cabeco ("Matemática · Funções afins · Cap. 1"), pagina: {n, titulo, pe}, blocos: [{id, paragrafos: [{id, n (§), html, figura, notas}]}], faixa ("Resposta guardada." — igual para resposta certa ou errada), jaSei: { evento: 'JA_SEI', rotulo }, botao: { evento: 'TERMINEI_TRECHO', rotulo ("Terminei de ler" ou "Continuar: pergunta antes do § 4") }, nota: { prompt, texto, evento: 'SALVAR_NOTA' } | null }`.
- `feedback()`: `{ certa, titulo ("Certa." | "Você marcou E. A certa é D."), porque, falta, alternativas: [{letra, texto, marca: 'sua'|'certa'|'sua-certa'|null}], item, trecho: { evento, rotulo: "Voltar ao parágrafo 3" }, resolucao: { evento, rotulo, aberta, texto }, proxima ("A próxima é uma questão da equipe sobre a p. 2, § 3."), revisao: { texto, antesDepois, nivel: {de, para, animar} }, fimRodada, medidor, continuar: { evento, rotulo, texto: 'Leia a explicação', pausaMs, liberaEm, restanteMs }, som: 'acerto'|'erro'|'nivel'|null }`. Nível que desce: `animar: false` e `som: null`.
- `trecho`: `{ cabeco ("Funções afins, Cap. 1"), pagina, blocos, ancora (id do parágrafo do fio de prumo), rotulo ("p. 2, § 3"), titulo ("p. 2, parágrafo 3", título da folha), feedback, acao }`. A tela põe o marca-texto no parágrafo da âncora só quando `feedback.certa` é falso.
- `fimDaRodada()`: `{ variante: 'venceu'|'teto'|'tetoPrereq'|'naoFecha', texto, nivel: {de, para, nome, animar}, som, cards, acao }`.
- `mao()` (cards): `{ id, frente, verso, virado, caixa: {n, nome, rotulo: 'revisão 2 de 5'}, cap ('Cap. 1'), repeticao, rotulo ('Card' | 'Card de volta'), posicao ("3 de 5"), acoes, pendente: { texto, trecho } | null, trecho: { rotulo: "Ver o parágrafo 2 da p. 1", evento: 'VER_TRECHO' }, animacaoMs: 180, regra }`. A virada é de ~180 ms; com `prefers-reduced-motion`, sem animação. Resumo da mão: "Você lembrou 4 de 5 cards. O outro volta em sex 20/11."

### `prontoPorHoje()` (estado `encerramento`)
`{ titulo: 'Pronto por hoje', data, visto: { palavra: 'Visto', data: '17/11/2026', obs: 'Cap. 1 em Firme' | null, rotulo (para o leitor de tela) } | null (só quando o dia contou como estudado), fecho ('Por hoje é isso. Está tudo guardado neste aparelho.'), constancia: { simbolo: 'risquinhos', diasEstudados, rotulo, tracoDeHoje }, semanaPassada, mudancas: [{tipo, texto (frase, sem cadeia de pontos: "O Cap. 1 entrou em Aprendendo. Próxima revisão: amanhã, qui 19/11."), nivel?}], nivelAnimado, parcial, vazio, naoContou, proxima: { texto ("Quinta, 19/11: Cap. 2 (novo) e revisão do Cap. 1."), gancho, porque, rotuloPorque }, copia (linha semanal), som, acao: { evento: 'FECHAR' } }`. Não há oferta de nada (limite diário).

### `prova()` (estados `prova*`)
Abertura: `{ titulo, regra, tamanho, aviso, trofeu, reaproveita, acoes }`. Em curso: `topo: { casas: [{cap, rotulo, cheia}], tentativa: "tentativa 5 de 12", eventoEncerrar: 'ENCERRAR_PROVA', avisoEncerrar }`. Resultado: `{ venceu, titulo, texto, trofeu, selo }` ou `{ venceu: false, texto, linhaRevisar, volta }`.

### Caderno, Plano e Ajustes (abas; leitura livre)
- `sumario()`: `{ titulo, avisoDemo ("Na demo, o nível vai até Firme."), capitulos: [{ n, titulo, paginas, paginaIds, nivel: {caixa, nome, segmentos: 5, cheios}, estado ("em dia · revisar sex 20/11", "revisar hoje", "atrasada há 2 dias", "Aprendendo · revisar amanhã", "não aberto", "em prática", "bloqueado"), bloqueado, regra, antesDepois, cards, verARegra }], prova: { regra, estado, texto, trofeu, selos }, marcos: [{ nome, condicao, dia, texto }], niveis, regraNivel }`. Capítulo bloqueado não usa cadeado: mostre o número em contorno e `regra`.
- `pagina(id)`: leitor (c.6) `{ cabeco, n, titulo, blocos, notaPrompt, irAlem, credito, anterior, seguinte }`. Ler não conta como dia estudado.
- `erros(filtroCap?)`: `{ filtros, itens: [{ id, capRotulo, dia, questao: {rotulo, enunciado, alternativas (com marca)}, linha ("você marcou E / certa D"), falta, anotacao, foiIsso: {valor, pergunta, opcoes}, trecho, situacao, estado, refazer: { disponivel, rotulo, motivo }, irAlem }], vazio }`.
- `notas()`: `{ capitulos: [{ titulo, notas: [{id, texto, dia, trecho}] }], vazio }`.
- `cardsDoCaderno()` (aba "Cards"): `{ capitulos: [{ titulo, recebidoEm, cards: [{ frente, verso, caixaNome, proxima, proximaTexto, trecho }], aviso }], regra, aviso }`. Consultar é livre; jogar, só na missão.
- `plano()`: `{ prova: {texto, faltam, horizonte, retaFinal}, tiposProva, dias: {valor, texto}, minutos, meta: {valor, texto, regra}, pausa, lembrete: {texto: "Prumo · seg, ter, qua, qui · 19:00", como}, agenda: agenda(), constancia: constancia(), intervalos: { porNivel, verARegra } }` (o texto de `verARegra` vai só em "ver a regra").
- `agenda()`: 14 dias `[{ dia, rotulo, tipo: 'estudo'|'folga'|'pausa', itens, texto: "qui 19/11 · Cap. 2 (novo) + revisão do Cap. 1" }]`, `tudoFirme`, `porQueEstaOrdem`.
- `constancia()`: `{ simbolo: 'risquinhos', diasEstudados, rotulo, regua: [{dia, n, longo, latao}], miniRegua (últimas 4 semanas), semanasComMeta, linhaMeta ("semanas com a meta: 3"), vazio, regra }`. Os risquinhos (grupos de 5) saem de `diasEstudados` e só crescem; a chama saiu (decisão do dono).
- `ajustes()`: som, dados (cópia, CSV, restaurar, copiar dados, apagar com confirmação), demo. Não há mais "Símbolo da constância".
- `creditos()`: créditos do pack item a item (licença, autoria, "rascunho por IA, revisão pendente", terceiros) mais fontes do app e a nota de IA. `naoTem()`: "O que o Prumo não tem".
- `primeiroUso()`: opções e textos de c.1, `alarme(dias, horario)` com o texto pronto do alarme.

## 5. Ações (fora da máquina; cada uma salva)

| Ação | Efeito |
|---|---|
| `concluirPrimeiroUso({ provaTipo, prova, dias, minutos, metaSemana?, horario?, som?, alarme? })` | cria o plano e monta a missão de hoje |
| `mudarPlano({ provaTipo?, prova?, dias?, minutos?, metaSemana?, horario? })` | muda o plano; a missão de hoje é remontada se não começou |
| `marcarPausa(dias)` / `encerrarPausa()` | pausa de 1 a 14 dias; ao encerrar, as revisões e os cards andam os dias da pausa ("nada vence por isso") |
| `salvarNota({ paragrafo, texto, id? })`, `apagarNota(id)` | notas do leitor; na missão, use `SALVAR_NOTA` |
| `anotarErro(id, texto)`, `foiIsso(id, 'sim'|'outra', texto?)` | cartão do Caderno de erros |
| `iniciarRefazer(erroId)`, `responderRefazer(alt)`, `fecharRefazer()`, `refazer()` | "Refazer com outros números": linhas 8 a 10, 1 por cartão por dia, bloqueado depois do Pronto por hoje; conta como dia estudado e não muda nível |
| `copia()` | `{ nome: 'prumo-copia-AAAA-MM-DD.json', conteudo, tipo }` (a tela baixa ou copia o texto) e grava "Última cópia" |
| `csv()` | `{ nome: 'prumo-tentativas.csv', conteudo, tipo }` (inclui os cards) |
| `restaurar(texto)` | `{ ok, mensagem }`; arquivo inválido ou do Capisco: "Este arquivo não é uma cópia do Prumo (ou é de outra versão). Nada foi alterado." |
| `apagarTudo()` | volta ao Primeiro uso |
| `definirSom(bool)`, `definirAlarme('criado'|'agora-nao')` | ajustes (`definirSimbolo` saiu com a chama) |
| `carregarExemplo()` | modo demonstração com o estado de exemplo; o estado real fica guardado |
| `sairDaDemonstracao()` | volta ao estado real (ou ao Primeiro uso) |
| `avancarDias(n)` | modo demonstração: avança a data simulada |

Depois de `concluirPrimeiroUso`, chame `navigator.storage.persist()` na tela (o núcleo não toca no navegador).

## 6. Formato do estado (`localStorage["prumo"]`)

Esquema de e.4, com os acréscimos das decisões do dono:

```js
{
  app: 'prumo', versao: 2,
  perfil: { provaTipo, prova /* 'AAAA-MM-DD' ou null */, dias: [1,2,3,4], metaSemana, minutos: 15|25|40, horario, porque, seEntao, criadoEm },
  conjuntosAtivos: ['mat-fa'], pausa: { desde, ate },
  topicos: { 'mat-fa.c1': { caixa: 0..5, proxima, tentativas: [{ item, dia, em, res: 'ok'|'erro', alt, tipo, primeiraVez }], rodadas: [{ dia, tipo, de, para, venceu, tentativas }], ultimoOk, ultimoOkEm, travado?, parouEm? } },
  pre: { 'mat-fa.p2.m#0': { alt, dia, cap, revelado /* dia da 1ª revisão que mostrou */ } },   // nunca lido por tela antes da 1ª revisão
  vistos: { itemId: dia },                       // resposta já mostrada (regra dos 7 dias)
  missao: { dia, regra, tipo, trilha, frase, passos: [{ t, id, cap, papel, origem, r, ... }], i, estado, iniciada, rodada, ultima, feedbackEm, fimRodada, mao, fechada, parcial, resumo, prova, faixa, rev },
  dias: { 'AAAA-MM-DD': true },                  // dias estudados (só crescem)
  semanas: { segunda: { dias, total, meta, cumprida } },   // gravadas quando a semana termina; nunca refeitas
  notas: [{ id, paragrafo, pagina, texto, dia }],
  erros: [{ id, item, cap, dia, tipo, marcou, certa, falta, anotacao, foiIsso, paragrafo, modelo, estado, resolvidoEm, refazerEm, refazerLinha, voltas }],
  cards: { cardId: { caixa: 1..5, proxima, recebido, hist: [{ dia, res: 'lembrei'|'ainda', repeticao, de, para }] } },
  baralho: { capId: dia },                       // quando os cards do capítulo entraram
  marcos: { 'm.primeiroCap': dia, ... }, chefes: { 'mat-fa': { dia, tentativas, venceu } }, selos: ['mat'], chefeAvisado: {},
  historico: [{ dia, regra, tipo, passos, feitos, parcial, fechada, viradaDeData }],
  refazer: null | { erro, item, dia, estado, alt, res },
  config: { som: false, nivelMaximo: 3, ultimaCopia, simboloConstancia: 'risquinhos' /* 'chama' ou 'regua' salvos antes viram 'risquinhos' na leitura */, alarme, demo: { ativo, offset, exemplo, guardado } },
}
```

Sem campo de minutos, sessões, telemetria ou identificação pessoal. A cópia JSON é um envelope `{ assinatura: 'Prumo · App de Estudos · cópia do progresso', app: 'prumo', versao: 2, geradoEm, pack: { id, versao }, estado }`; a restauração exige `app: 'prumo'` e `versao: 2` e recusa o resto (inclusive o `capisco.v1`).

## 7. Regras que a tela precisa respeitar (o núcleo já garante o resto)

- Pré-pergunta: depois de `RESPONDER`, a Leitura mostra `vm.faixa` e nada mais. O núcleo nunca expõe o acerto antes da 1ª revisão.
- `CONTINUAR` no feedback só passa depois de `vm.continuar.liberaEm` (ms, no relógio do núcleo, `relogio.agora()`); antes disso o evento é ignorado. Use `vm.continuar.restanteMs` (calculado na hora em que o view model foi feito) para o preenchimento liso de "Leia a explicação" e libere o botão quando ele terminar.
- Sons: `vm.som` diz qual tocar (se o som estiver ligado). `null` = silêncio. Nenhuma animação quando `nivel.animar` é `false`.
- Cards: virada de ~180 ms (sem animação com `prefers-reduced-motion`).
- Não há "mais uma" depois do Pronto por hoje: o núcleo não oferece nada, e os eventos de missão, Prova e Refazer são ignorados.

## 8. Módulos

| Arquivo | Conteúdo |
|---|---|
| `relogio.js` | relógio injetável e datas em português |
| `motor.js` | regras do motor herdado do Capisco, adaptado (e.5): níveis, intervalos, `registrar`, `fecharRodada`, `fecharRevisao`, Prova (`fecharChefe`) |
| `pack.js` | classe `Pack` (consultas, variantes, índice do motor, créditos) e `checar()` (testes do build) |
| `estado.js` | esquema, normalização, migração, salvar, cópia JSON, restauração, CSV |
| `plano.js` | dias de estudo, folga, pausa, dias estudados, semanas com a meta, régua e chama |
| `cards.js` | baralho, mão do dia, caixas de Leitner dos cards |
| `recomendador.js` | árvore R0–R9, item de revisão, Questão do dia, `regraDaFila`, "ver a regra" |
| `missao.js` | classe `Missao`: a máquina de estados |
| `prova.js` | Prova do caderno |
| `exemplo.js` | estado de exemplo gerado pelo próprio motor com relógio falso |
| `nucleo.js` | fachada `Nucleo` com os view models e as ações |

Testes: `node --test "_dev/testes/*.test.mjs"` (na pasta `prumo/`). Rodam contra o pack de teste (`_dev/testes/fixture-pack.mjs`) e contra `conteudo/mat-fa.js`; `PRUMO_TESTE_PACK=fixture` ou `PRUMO_TESTE_PACK=real` filtra (o nome `PRUMO_PACK` é do validador do conteúdo, `_dev/valida_pack.mjs`).
