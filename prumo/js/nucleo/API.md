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

- `criarNucleo({ pack, storage, praticas })`: `praticas` é a lista `[{ id, topico, teoria }]` dos tópicos de prática (o `app.js` importa `conteudo/praticas/<id>.js` e `<id>.teoria.js` dos ids de `IDS_PRATICA`; arquivo ausente ou inválido → o tópico aparece "em preparação"); `storage` é opcional (padrão: `localStorage`; nos testes, `memoria()` de `estado.js`).
- `nucleo.tela()` devolve `{ nome, vm, faixas }`. `nome` é o estado da máquina (seção 3); `vm` é o view model dele; `faixas` traz as faixas fixas: `demo` (modo demonstração: `{ texto, dataSimulada, sair, rotulo: 'Modo demonstração', frase: 'dados de exemplo, data simulada 18/11.' }`; a tela usa `rotulo` + `frase`, no formato do Recado), `falhaSalvar` (`{ texto, acao }`, quando o `localStorage` falhou) e `carga`.
- Todo efeito acontece dentro da transição e é salvo na hora. Recarregar a página volta ao mesmo passo: a tela não precisa guardar nada.
- Ao voltar para o app (`visibilitychange`) e perto da meia-noite, chame `nucleo.conferirData()`: com a missão pela metade, ela fecha a de ontem (com o visto do dia, se o dia contou, como em "Encerrar por hoje"), mostra a faixa "Ontem você parou no passo N de M. O que fez ficou registrado; hoje a missão é nova." e monta a de hoje.

## 2. Relógio (testes e demonstração)

`relogio.js` concentra `hoje()` e `agora()`. Nada no núcleo usa `new Date()` direto.

| Função | Para quê |
|---|---|
| `definirFonte(f)` | troca a fonte do tempo: função que devolve ms, número (ms fixo), `'AAAA-MM-DD'` ou `'AAAA-MM-DDTHH:MM'`; `definirFonte(null)` volta ao relógio real |
| `relogioFalso(inicio)` | relógio que se avança: `{ avancarMs(n), irPara(data), ms }` (usado pelos testes e pelo estado de exemplo) |
| `setOffset(dias)` / `getOffset()` | deslocamento do modo demonstração (gravado em `config.demo.offset`) |
| `hoje()`, `agora()` | data local `'AAAA-MM-DD'` e instante em ms, já com o deslocamento |
| `fmtCurta`, `fmtLonga`, `fmtCabecalho`, `fmtDiaSemana`, `fmtRelativa`… | datas em português ("sex 20/11", "QUINTA, 19 DE NOVEMBRO", "Segunda, 23/11", "amanhã, qui 19/11") |

No app, o modo demonstração usa `nucleo.avancarDias(1)` ou `nucleo.avancarDias(7)`; o núcleo grava o deslocamento e faz a virada de data. Num perfil real, o primeiro `avancarDias` guarda o estado real em `config.demo.guardado` antes de simular; `sairDaDemonstracao()` o devolve intacto (nunca apaga um perfil real).

## 3. Estados e eventos (máquina de b.1–b.4)

| `nome` | Tela | Eventos aceitos |
|---|---|---|
| `primeiroUso` | c.1 | `CONCLUIR {perfil}` (ou `nucleo.concluirPrimeiroUso(perfil)`), `RESTAURAR_COPIA {texto}`; "Ver com dados de exemplo" = `nucleo.carregarExemplo()` |
| `hoje` | Hoje (c.2), inclusive folga, pausa, em curso, Hoje não | `COMECAR`, `CONTINUAR`, `HOJE_NAO`, `ESTUDAR_MESMO_ASSIM` (folga), `ENCERRAR_PAUSA`, `FAZER_PROVA` (só quando `vm.prova` existe), `ESTUDAR_TOPICO {id}` ("Estudar este tópico hoje": o tópico vira a missão do dia e começa; ignorado com a missão começada, fechada, em pausa ou com a Prova aberta; `id` do caderno = o fluxo do caderno) |
| `pergunta` | pré-pergunta, checagem, questão do Enem, questão da equipe, revisão, Questão do dia, revisão antecipada (c.3) | `RESPONDER {alt: 'A'..'E'}` (sem `alt`, é ignorado: não há "não sei") |
| `leitura` | trecho da página (c.3b) | `TERMINEI_TRECHO`, `JA_SEI`, `SALVAR_NOTA {texto}` |
| `feedback` | resultado (c.3e, c.3h) | `CONTINUAR` (ignorado antes de `vm.continuar.liberaEm`), `VOLTAR_AO_TRECHO`, `VER_RESOLUCAO` |
| `trecho` | folha com a página ancorada (c.3f) | `VOLTAR` |
| `fimDaRodada` | venceu, teto, teto com pré-requisito (c.3g) | `SEGUIR` |
| `cards` | mão de cards (Decisão 1) | `VIRAR`, `LEMBREI`, `AINDA_NAO`; depois de "Ainda não": `SEGUIR` (próximo card) e `VER_TRECHO` |
| `trechoCard` | página ancorada no parágrafo do card | `VOLTAR` |
| `fimDaMao` | resumo da mão quando ainda há passos depois | `SEGUIR` |
| `encerramento` | Pronto por hoje (c.4) | `FECHAR` |
| `feito` | Hoje no estado feito | `ESTUDAR_TOPICO {id}` (estudo livre; `conferirData()` faz a virada) |
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
- `recado`: o aviso de ontem no formato do Recado, `{ rotulo: null, texto: 'Ontem você parou no passo 4 de 5. O que fez ficou registrado; hoje a missão é nova.' }` (ou `null`); `faixa` continua com a frase inteira.
- `estado`: `primeiroDia` · `missao` · `emCurso` · `feito` · `encerradoAntes` · `folga` · `retorno` · `questaoDoDia` · `hojeNao` · `pausa` · `reta` · `firme` · `provaPassou`. `retorno` (modo retorno, regra R3) só vale com revisão atrasada de fato (que passou por um dia de estudo sem ser feita) e capacidade(st) ou mais vencidas no caderno; revisões que só vencem hoje, ou que venceram na folga, seguem o caminho normal. A frase não fala em capacidade: "Você tem 2 revisões atrasadas e mais 1 para hoje: hoje é dia de pôr as revisões em dia, as mais atrasadas primeiro." As revisões de tópico que o P1 soma entram já na frase de "Por que esta missão?" (`montarMissao` recebe `revisoesExtra`): "Você ainda não abriu o Cap. 1, e hoje vencem as revisões de X e Y."
- `texto` (a frase do estado, quando há), `faixa` ("Ontem você parou…"), `acao: { evento, rotulo, nota? }` (botão principal no fluxo).
- `bloco` (a folha de rosto da missão; `null` no feito/folga/pausa): `rotulo` ("Missão 1"), `titulo` ("Cap. 2: Ler o gráfico", "Revisão do Cap. 1"), `cabecalho` (o Cabeçalho de prova, sem Data: `[{ rotulo: 'Capítulo', valor: '1' }, { rotulo: 'Páginas', valor: '1–2' }, { rotulo: 'Tempo', valor: '25', unidade: 'min' }]`; o valor só tem dígitos e vai em Mono), `regra` (o ganho anunciado, com o nome do nível explicado na primeira vez e a data exata, e "No fim, o visto do dia."), `linhaFina` (legado; a tela não mostra), `composicao` (frase com a mesma contagem da régua: "2 páginas, 5 perguntas curtas sobre elas e até 3 questões do Enem." — as perguntas antes de ler e as checagens entram; a questão da equipe que vem depois de um erro não, porque é condicional — seguida dos `avisos`), `avisos` (lista, já dentro de `composicao`: "Hoje passa dos seus 25 min: só a apostila leva cerca de 23. Se precisar, encerre no meio; o dia conta como estudado quando você responde uma questão ou revisão (o aquecimento não conta).", "O capítulo X fica para o próximo dia de estudo: hoje a revisão vem primeiro.", "Mais 2 revisões ficam para o próximo dia de estudo: não cabem nos seus 15 min." ou, no tópico escolhido, "…: junto com um tópico, entram até 3 revisões por dia."), `atrasada` ("1 revisão atrasada vem primeiro." ou `null`; atrasada é só a revisão que passou por um dia de estudo sem ser feita; a que venceu numa folga entra no dia de estudo seguinte sem atraso), `ganho` (frase de `regraDaFila`), `esmaecido` (Hoje não; o texto é "Hoje não. A missão fica para o próximo dia de estudo[, e a revisão de hoje entra nele sem contar como atraso]." e `venceHoje` é `null`: o dia do "Hoje não" fica em `st.hojeNao` e conta como folga para as revisões, em `motor.dataEfetiva`/`revisaoAtrasada`; "Começar mesmo assim" e "Estudar este tópico" desfazem), `passos` (para "Ver os passos": `[{ n: '9 a 11', texto, nota?, pagina: 'p. 3' }]`).
- `links`: "ver passos", "Por que esta missão?", "Hoje não" (`HOJE_NAO`) ou aba a abrir (`{ rotulo, aba }`).
- `prova`: oferta da Prova do caderno (`{ titulo, texto, regra, acao: { evento: 'FAZER_PROVA', rotulo: 'ver a regra' } }`) ou `null`. Só aparece antes de começar a missão do dia ou numa folga; nunca no feito.
- `feito: { previa, gancho, proxima: { texto, gancho, porque } }` no estado feito: `previa` é sempre a missão ("Quarta, 18/11: capítulo Ler o gráfico (novo) e revisão do capítulo X."), com o aviso da pergunta de antes como segunda frase ("Nela você vê se acertou a pergunta antes da p. 2."); `proxima.texto` é igual a `previa` (a tela não repete a linha cinza) e `proxima.textoMissao` traz só a missão; `porqueEstudo` ("Por que eu estudo: …") no "Bem-vindo de volta", quando o aluno escreveu a frase.
- `porQue: { frase, regra, verARegra: { linhas, regras, revisoes, lembranca, questoes, texto, oQueE } }`: folha "Por que esta missão?". `linhas` vem sem códigos internos, numerada na ordem em que as regras valem, até a que decidiu: `"10. sim: Cap. 1 é o próximo liberado"`; as anteriores com "não" e as revisões de tópico que se somam com "também" (o padrão `/^\S+ sim:/` continua marcando a linha que decidiu). `regras: [{ n, texto, decidiu, tambem, linha }]` é a mesma lista estruturada. A lembrança estimada (percentual) existe **só** aqui.
- `livre` (estudo por conta própria em curso) e `proximoRotulo` ("Seu próximo conteúdo", "Sua missão de hoje" ou "Estudo por conta própria"); com `livre`, `acao.nota` diz que o estudo fica aberto até a meia-noite e não dá um segundo visto.

### `passoAtual()` (estados da missão; `tela()` já escolhe)
- Todo VM de `passoAtual()` traz `livre` (true no estudo por conta própria, depois do Pronto por hoje: a tela troca a última etapa da trilha e o texto de "Encerrar"). Na missão de tópico, os VMs trazem `fase`: `'aquecer'` (pergunta antes da apostila e a resposta dela), `'apostila'` (leitura), `'questoes'` (questões, resultado e fim da rodada); o Pronto traz `'visto'` (ou `'registro'` no estudo livre). Fora da missão de tópico, `fase` é `null`.
- `pergunta`: `{ tipo: 'pre'|'preBloco'|'checagem'|'enem'|'equipe'|'revisao'|'dia'|'antecipada', rotulo (caixa normal: "Antes de ler a p. 1", "Antes do parágrafo 4", "Confira a p. 1", "Questão do Enem", "Revisão do Cap. 1"…), subrotulo, aviso ("Tente antes de ler. Esta página responde."), avisoPrimeiraChecagem, inserida, avisoInserida ("Depois do erro: uma questão da equipe sobre a p. 1, § 2." na questão inserida pelo Pilar III; `null` nas outras), item: { enunciado (HTML), introducao, imagens, figura, alternativas: [{letra, texto, imagem}], rodape (atribuição com o link da licença), cabecalho: { num: 'Questão 162' | 'Questão da equipe', fonte: 'Enem 2023, 2º dia' | 'p. 1' } (o cabeçalho do caderno impresso; a tela põe o número em maiúsculas, como no papel), imagemFalhou }, topo, acao }`. A pergunta **não** traz gabarito.
- `topo`: `{ etapa ("Leitura da p. 3"), encerrar, passo: {n, total}, progresso (0–1), legenda: { passo: 'passo 3 de 5', falta: 'faltam 2 questões' | 'faltam até 3 questões' | null } (legenda da Régua; nunca tempo), medidor, regra: { texto, mostrarAgora, rotulo: 'ver a regra' } }`.
- `medidor` (só nos passos que contam): `{ casas: [{cheia, rotulo}, {cheia, rotulo}] (rótulos fixos: "acerto" e "Enem" ou "aplicar"; só a casa enche), texto ("Falta acertar uma questão do Enem" | "Falta mais um acerto seguido" | "a contagem recomeça" | null), regra, descricoes }`.
- `leitura`: `{ cabeco ("Matemática · Funções afins · Cap. 1"), pagina: {n, titulo, pe}, blocos: [{id, paragrafos: [{id, n (§), html, figura, notas}]}], faixa ("Resposta guardada." — igual para resposta certa ou errada), jaSei: { evento: 'JA_SEI', rotulo }, botao: { evento: 'TERMINEI_TRECHO', rotulo ("Terminei de ler" ou "Continuar: pergunta antes do § 4") }, nota: { prompt, texto, evento: 'SALVAR_NOTA' } | null }`.
- `feedback()`: `{ certa, titulo ("Certa." | "Você marcou E. A certa é D."), porque, falta, alternativas: [{letra, texto, marca: 'sua'|'certa'|'sua-certa'|null}], item, trecho: { evento, rotulo: "Voltar ao parágrafo 3" }, resolucao: { evento, rotulo, aberta, texto }, proxima ("A próxima é uma questão da equipe sobre a p. 2, § 3."), revisao: { texto, antesDepois, nivel: {de, para, animar} }, fimRodada, medidor, continuar: { evento, rotulo, texto: 'Leia a explicação', pausaMs, liberaEm, restanteMs }, som: 'acerto'|'erro'|'nivel'|null }`. Nível que desce: `animar: false` e `som: null`.
- `trecho`: `{ cabeco ("Funções afins, Cap. 1"), pagina, blocos, ancora (id do parágrafo do fio de prumo), rotulo ("p. 2, § 3"), titulo ("p. 2, parágrafo 3", título da folha), feedback, acao }`. A tela põe o marca-texto no parágrafo da âncora só quando `feedback.certa` é falso. No tópico de prática, o `trecho` ("Rever a apostila") é a teoria inteira com `titulo: 'Rever a apostila'`, `secao` (número da seção que a questão cobra, quando o conteúdo informa `secao` na questão) e `ancora: 'secao-N'` (a tela dá esse id à seção N da apostila e rola até ela).
- Revisão no `feedback` e no Pronto: certa → "Certa. O capítulo X subiu para o nível 3 de 5. Próxima revisão: seg 23/11." (a data é a do dia de estudo em que ela entra); no topo, "continua no nível 5 de 5, o mais alto" (no estado de exemplo, "continua no nível 3 de 5 (na demonstração, o nível vai até 3 de 5)"); errada → "A revisão de X volta amanhã, qua 18/11. Seus dias estudados e seu histórico continuam. O capítulo X desceu para o nível 2 de 5." (errar desce UM nível, nunca abaixo do 1; a data é a do dia de estudo em que ela entra: na véspera da folga, "volta na segunda, 23/11").
- `fimDaRodada()`: `{ variante: 'venceu'|'teto'|'tetoPrereq'|'naoFecha', texto, nivel: {de, para, nome, animar}, som, cards, acao }`.
- `mao()` (cards): `{ id, frente, verso, virado, caixa: {n, nome, rotulo: 'revisão 2 de 5'}, cap ('Cap. 1'), repeticao, rotulo ('Card' | 'Card de volta'), posicao ("3 de 5"), acoes, pendente: { texto, trecho } | null, trecho: { rotulo: "Ver o parágrafo 2 da p. 1", evento: 'VER_TRECHO' }, animacaoMs: 180, regra }`. A virada é de ~180 ms; com `prefers-reduced-motion`, sem animação. Resumo da mão: "Você lembrou 4 de 5 cards. O outro volta em sex 20/11."

### `prontoPorHoje()` (estado `encerramento`)
`{ titulo: 'Pronto por hoje', data, fase ('visto' | 'registro' no tópico; senão null), visto: { palavra: 'Visto', data: '17/11/2026', obs: 'Cap. 1, nível 3 de 5' | null, rotulo (para o leitor de tela) } | null (só quando o dia contou como estudado), fecho ('Por hoje é isso. Está tudo guardado neste aparelho.'), constancia: { simbolo: 'risquinhos', diasEstudados, rotulo, tracoDeHoje }, semanaPassada, mudancas: [{tipo, texto (frase, sem cadeia de pontos: "O Cap. 1 entrou em Aprendendo. Próxima revisão: amanhã, qui 19/11."), nivel?}], nivelAnimado, parcial, vazio (o que ficou feito numa missão encerrada antes da primeira questão: no tópico, "Hoje você fez o aquecimento e leu a apostila. Na próxima vez que estudar este tópico, vêm as questões do Enem; a apostila abre antes, e dá para pular." — o aquecimento não volta, e a resposta dele aparece no fim da próxima leitura; no caderno, "Hoje ficou só a pergunta antes de ler. Ela volta no próximo dia de estudo."), naoContou ("O dia não conta como estudado: ele conta quando você responde …"), proxima: { texto ("Quinta, 19/11: capítulo X (novo) e revisão do capítulo Y."; a revisão de tópico entra em todo tipo de missão: "Questão do dia e revisão do tópico Porcentagem e juros"), gancho ("Amanhã você vê se acertou a pergunta antes da p. 2."), porque (do dia anunciado, nunca com o "Hoje" do próprio dia; revisão errada: "Você errou a revisão de X, e revisão errada volta no próximo dia de estudo: na quarta."), rotuloPorque }, mudancas: só os marcos ganhos NESTA missão (`resumo.marcos`); a linha de manter da Questão do dia conta a revisão somada ("…, e 1 revisão.") e não diz "Nenhuma revisão venceu" quando houve revisão, copia (linha semanal), som, acao: { evento: 'FECHAR' } }`. Não há oferta de nada (limite diário).

### `prova()` (estados `prova*`)
Abertura: `{ titulo, regra, tamanho, aviso, trofeu, reaproveita, acoes }`. Em curso: `topo: { casas: [{cap, rotulo, cheia}], tentativa: "tentativa 5 de 12", eventoEncerrar: 'ENCERRAR_PROVA', avisoEncerrar }`. Resultado: `{ venceu, titulo, texto, trofeu, selo }` ou `{ venceu: false, texto, linhaRevisar, volta }`.

### Caderno, Plano e Ajustes (abas; leitura livre)
- `sumario()`: `{ titulo, avisoDemo ("Na demonstração, o nível vai até 3 de 5." só no estado de exemplo; senão `null`), capitulos: [{ n, titulo, paginas, paginaIds, nivel: {caixa, nome ('nível 2 de 5' | null), rotulo ('nível 2 de 5' | 'ainda não começou'), segmentos: 5, cheios}, estado (frase: "Em dia. Próxima revisão: sex 20/11.", "Revisão marcada para hoje.", "Revisão atrasada há 2 dias.", "Voltou para Aprendendo. Próxima revisão: amanhã.", "Ainda não começou.", "Começado. Falta acertar duas seguidas…", "bloqueado"), bloqueado, regra, antesDepois, cards, verARegra }], prova: { regra, estado, texto, trofeu, selos }, marcos: [{ nome, condicao, dia, texto }], niveis, regraNivel }`. `regraNivel` sai de `regraNivel(oQue, teto)` (exportada por `nucleo.js`), a mesma frase no Caderno, no mapa e na página do tópico: "Acerte 2 seguidas na rodada e o capítulo entra no nível 1 de 5. Depois, cada revisão certa na primeira resposta sobe um nível, até o 5 de 5; errar uma revisão desce um nível, nunca abaixo do 1. Errar nas questões da rodada só recomeça a contagem das 2 seguidas. Nada do que você fez se apaga." Capítulo bloqueado não usa cadeado: mostre o número em contorno e `regra`.
- `pagina(id)`: leitor (c.6) `{ cabeco, n, titulo, blocos, notaPrompt, irAlem, credito, anterior, seguinte }`. Ler não conta como dia estudado.
- `erros(filtroCap?)`: os erros do caderno e dos tópicos de prática (o filtro de um tópico usa o id dele; `capRotulo` é o nome curto do tópico). Erro de tópico traz `trecho: null` e `apostila: { rotulo: 'Rever a apostila', topico, secao, ancora }` (a tela abre a apostila do tópico na seção). `{ filtros, itens: [{ id, capRotulo, dia, questao: {rotulo, enunciado, alternativas (com marca)}, linha ("Você marcou E. A certa é D."), falta, anotacao, foiIsso: {valor, pergunta, opcoes}, trecho, situacao, estado, refazer: { disponivel, rotulo: "Refazer com outros números", nota: "Uma vez por dia. Não muda o nível.", motivo }, irAlem }], vazio }`.
- `notas()`: `{ capitulos: [{ titulo, notas: [{id, texto, dia, trecho}] }], vazio }`.
- `cardsDoCaderno()` (aba "Cards"): `{ capitulos: [{ titulo, recebidoEm, cards: [{ frente, verso, caixaNome, proxima, proximaTexto, trecho }], aviso }], regra, aviso }`. Consultar é livre; jogar, só na missão.
- `plano()`: `{ prova: {texto (frase: "Prova da escola (bimestral) em 15/12/2026. Faltam 27 dias."), cabecalho ([{rotulo: 'Data da prova', valor: '15/12/2026'}, {rotulo: 'Faltam', valor: '27', unidade: 'dias'}], `null` sem data; o Plano desenha com `cabecalhoProva`), nome, faltam, horizonte, retaFinal}, tiposProva, dias: {valor, texto: "Segunda, terça, quarta e quinta, 25 minutos por dia."}, minutos, meta: {valor, texto, regra}, pausa, lembrete: {texto (nome do alarme: '"Prumo", às 19:00, segunda, terça, quarta e quinta'), como}, agenda: agenda(), constancia: constancia(), intervalos: { porNivel, verARegra } }` (o texto de `verARegra` vai só em "ver a regra").
- `agenda()`: 14 dias `[{ dia, rotulo, tipo: 'estudo'|'folga'|'pausa', itens, status?, projetada?, texto: "Qui 19/11: capítulo X (novo), revisão do capítulo Y e 8 cartões." }]` (inclui as revisões dos tópicos de prática). O próximo dia de estudo é a missão que `montarMissaoGeral` montaria (a mesma da "Próxima missão") quando nada de hoje ainda pode mudar o estado; com a missão de hoje por fazer, ele diz "depende do resultado de hoje"; os outros dias sem nada marcado dizem "depende do que você fizer até lá". `tudoFirme` ("Todos os capítulos estão no nível 3 de 5 ou acima. As revisões voltam em intervalos que crescem com o nível."), `porQueEstaOrdem`.
- `constancia()`: `{ simbolo: 'risquinhos', diasEstudados, rotulo, regua: [{dia, n, longo, latao}], miniRegua (últimas 4 semanas), semanasComMeta, linhaMeta ("semanas com a meta: 3"), vazio, regra }`. Os risquinhos (grupos de 5) saem de `diasEstudados` e só crescem; a chama saiu (decisão do dono).
- `ajustes()`: som, dados (cópia, CSV, restaurar, copiar dados, apagar com confirmação), demo (com `explica`, a frase do que é o modo demonstração). Não há mais "Símbolo da constância".
- `creditos()`: créditos do pack item a item (licença, autoria, "rascunho por IA, revisão pendente", terceiros) mais fontes do app e a nota de IA. `naoTem()`: "O que o Prumo não tem".
- `primeiroUso()`: opções e textos de c.1, `alarme(dias, horario)` com o texto pronto do alarme.

### Níveis na tela (decisão do dono)
Os nomes internos de `NIVEL` (motor.js) nunca chegam à tela; nível não tem nome. O núcleo usa `rotuloNivel(k)` (motor.js): `'ainda não começou'` (0), `'nível 1 de 5'` … `'nível 5 de 5'`, e `noNivel(k)` ("no nível 3 de 5") nas frases: "entrou no nível 1 de 5", "subiu para o nível 2 de 5", "continua no nível 3 de 5", "desceu para o nível 2 de 5", "a próxima revisão fica para 23/11". O teto é o 5 de 5; só o estado de exemplo usa `pack.nivelMaximoDemo` (3), e aí os textos dizem "na demonstração, o nível vai até 3 de 5". Todo `nivel` de view model traz `cheios` (0–5, para a régua de 5 segmentos), `nome` (o rótulo, ou `null` em 0) e `rotulo` (sempre preenchido).

## 5. Ações (fora da máquina; cada uma salva)

| Ação | Efeito |
|---|---|
| `concluirPrimeiroUso({ provaTipo, prova, dias, minutos, metaSemana?, horario?, som?, alarme?, nome?, areas? })` | cria o plano e monta a missão de hoje (`areas`: 'MT' 'LC' 'CN' 'CH'; padrão `['MT']`) |
| `definirNome(texto)`, `definirFoto(dataURL|null)` | Perfil: nome (até 40 letras) e foto (data URL png/jpeg/webp de até 200 kB; a tela reduz para ~160 px) |
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
| `avancarDias(n)` | modo demonstração: avança a data simulada (num perfil real, guarda o estado real antes; "Sair" o devolve) |

Depois de `concluirPrimeiroUso`, chame `navigator.storage.persist()` na tela (o núcleo não toca no navegador).

## 6. Formato do estado (`localStorage["prumo"]`)

Esquema de e.4, com os acréscimos das decisões do dono:

```js
{
  app: 'prumo', versao: 2,
  perfil: { provaTipo, prova /* 'AAAA-MM-DD' ou null */, dias: [1,2,3,4], metaSemana, minutos: 15|25|40, horario, porque, seEntao, criadoEm, nome, foto, areas },
  conjuntosAtivos: ['mat-fa'], pausa: { desde, ate },
  praticas: { 'mat-porcentagem': { desde, pre: { alt, dia, revelado } | null } },   // tópicos de prática começados (a pré-pergunta mora aqui, não em `pre`)
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
  config: { som: false, nivelMaximo: 5 /* 3 só no estado de exemplo (pack.nivelMaximoDemo) */, ultimaCopia, simboloConstancia: 'risquinhos' /* 'chama' ou 'regua' salvos antes viram 'risquinhos' na leitura */, alarme, demo: { ativo, offset, exemplo, guardado } },
}
```

Sem campo de minutos, sessões, telemetria ou identificação pessoal. A cópia JSON é um envelope `{ assinatura: 'Prumo · App de Estudos · cópia do progresso', app: 'prumo', versao: 2, geradoEm, pack: { id, versao }, estado }`; a restauração exige `app: 'prumo'` e `versao: 2` e recusa o resto (inclusive o `capisco.v1`).

## 7. Regras que a tela precisa respeitar (o núcleo já garante o resto)

- Pré-pergunta: depois de `RESPONDER`, a Leitura mostra `vm.faixa` e nada mais. O núcleo nunca expõe o acerto antes da 1ª revisão.
- `CONTINUAR` no feedback só passa depois de `vm.continuar.liberaEm` (ms, no relógio do núcleo, `relogio.agora()`); antes disso o evento é ignorado. Use `vm.continuar.restanteMs` (calculado na hora em que o view model foi feito) para o preenchimento liso de "Leia a explicação" e libere o botão quando ele terminar.
- Sons: `vm.som` diz qual tocar (se o som estiver ligado). `null` = silêncio. Nenhuma animação quando `nivel.animar` é `false`.
- Cards: virada de ~180 ms (sem animação com `prefers-reduced-motion`).
- Depois do Pronto por hoje o app não oferece iscas ("só mais uma", recompensa surpresa): a missão do dia é uma só, e Prova e Refazer ficam para outro dia. O aluno pode continuar por conta própria: `prontoPorHoje().continuar` ("Missão cumprida. Se quiser, pode continuar estudando por conta própria." + link "Continuar estudando" → aba Estudar; também em Hoje feito e na folga). Em Estudar, `ESTUDAR_TOPICO` com a missão fechada abre um **estudo livre** do tópico (`missao.livre`, regra `L`, questões repetíveis), sem um segundo visto. A nota do botão e o fecho do "Estudo registrado" dizem o que ele faz de fato: tópico novo ou começado → "acerte 2 seguidas e X entra no nível 1 de 5"; tópico com nível → "é uma revisão antecipada: firma o conteúdo, mas o nível só muda na revisão do dia marcado"; "conta como dia estudado" só quando o dia ainda não contou (`prontoPorHoje().visto` é null, título "Estudo registrado"); `FECHAR` devolve a missão do dia (já cumprida). No caderno de Funções afins (`id` do pack), o estudo livre é a revisão antecipada do capítulo mais fraco (não muda o nível); sem capítulo aberto, o capítulo em curso ou o próximo liberado. Depois do Pronto, `topicoPagina().regraHoje` não anuncia outro visto ("Sem visto extra: o de hoje já é seu.").

## 8. Módulos

| Arquivo | Conteúdo |
|---|---|
| `relogio.js` | relógio injetável e datas em português |
| `pratica.js` | mapa (AREAS, CONHECIDOS), classe `Praticas` (tópicos carregados + segunda instância do motor, mesmas regras), `montarMissaoGeral` (árvore do caderno + P0–P3), `limparSvg` |
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


## 9. Estudar e tópicos de prática (pratica.js)

- `estudar()`: `{ titulo, intro, areas: [{ id, nome, disponivel, escolhida, frase ("Biologia, Física e Química: chega nas próximas versões." quando não há conteúdo), materias: [{ nome, topicos: [{ id, titulo, descricao, disponivel, emPreparacao, caderno, estado, nivel: { cheios, nome, rotulo }, estadoTexto, progresso: { feitas, total, texto } }] }] }], regraNivel }`. O caderno (Funções afins) é o 1º tópico de Matemática.
- `topicoPagina(id)`: o resumo + `{ area, materia, porQueCai, ideias, composicao (o que o tópico tem, separado do que entra hoje, e o tempo: "O tópico tem a apostila (6 seções, com exemplos resolvidos) e 6 questões reais do Enem, da mais fácil para a mais difícil. Hoje: um aquecimento, a apostila e até 4 questões (plano de 25 min). Leva cerca de 36 min (só a apostila, uns 23), mais que os seus 25 min." — a mesma missão que o botão monta, com as revisões que vêm junto; o aquecimento já feito não aparece; com a missão do tópico em curso, "Hoje falta: …"), tempo: { minutos, apostila, plano, passa, emCurso, hoje, rotulo, partes, texto }, comoFunciona: [{ titulo, texto }] (as 4 etapas da trilha, com a regra do nível certa, para o quadro "Como funciona um tópico"), capitulos (caderno), regraNivel, regraHoje ("Hoje: acerte 2 questões seguidas e X entra no nível 1 de 5. No fim, o visto do dia."), leitura: { rotulo: 'Ler a apostila', aba? , nota }, acao: { disponivel, evento: 'ESTUDAR_TOPICO'|'CONTINUAR', id, rotulo, nota } | { disponivel: false, rotulo, motivo } }`. A nota de "Estudar este tópico hoje" sai da missão que o P0 montaria: "Ele entra na missão de hoje. As 3 revisões de Funções afins (Caps. 1, 2 e 3) continuam; as revisões do capítulo X e do tópico Y vão para o próximo dia de estudo: junto com um tópico, entram até 3 revisões por dia." (no corte ficam as mais antigas). Depois do Pronto por hoje: "abre amanhã" (a teoria segue livre).
- `teoria(id)` / `teoriaLivre(id)`: `{ teoria: true, titulo, cabeco, porQueCai, minutos (a conta da capa, pronta: palavras/140 + 1,5 por exemplo, mínimo 5; a mesma que entra no tempo da missão), credito ("Texto da equipe Prumo · CC BY-SA 4.0", com "· revisado por … em …" quando o *.teoria.js traz `revisao: { por, em }`), secoes: [{ n, titulo, paragrafos, figura: { n, svg (já limpo), alt, legenda } | null, tabela: { cabecalho, linhas, legenda } | null, atencao: { rotulo: 'No Enem', texto } | null, exemplos: [{ n, enunciado, resolucao }] }], armadilhas, resumo, credito }`; a livre traz `livre` e `aviso` (não conta como dia estudado).
- Partida do tópico (estados de sempre): `pergunta` (pré-pergunta, `tipo: 'pre'`, sem gabarito) → `leitura` com `vm.teoria` (TERMINEI_TRECHO/JA_SEI) → `feedback` com `tipo: 'revela'` (a resposta da pré-pergunta, só depois de ler) → `pergunta`/`feedback` das questões do Enem (o `trecho` de um erro é "Rever a teoria": `VOLTAR_AO_TRECHO` abre a teoria) → `fimDaRodada` → `encerramento`. O nível sai do mesmo motor (rodada: 2 certas seguidas; revisão: vale a primeira resposta; intervalos pela data da prova).
- Recomendador: P0 tópico escolhido; P2 tópico começado e não vencido quando o caderno não tem capítulo em curso (R8/R9); P3 com o caderno em dia (R9 sem revisão), o próximo tópico das áreas escolhidas; P1 revisões vencidas de tópicos entram na missão do dia.
- `perfil()`: `{ nome, foto, iniciais, titulo, fotoTexto, fotoNota, plano, ajustes, areas }`; `hoje()` traz `saudacao` ("Oi, Daniel") e `proximoRotulo` ("Seu próximo conteúdo"); `primeiroUso()` traz `frase`, `areas`, `onboarding` (3 telas).

## 10. Retorno diário (sem culpa, sem perda)

- `hoje()` traz também: `venceHoje` (`{ rotulo: 'Hoje vence', n, vence: "Hoje vence 1 revisão do Cap. 4.", porque: 'Revisando hoje, você guarda o conteúdo.', texto }`, só com revisão na missão de hoje), `semana` (= `semana()`), `recomeco` (`{ tipo: 'semana'|'retorno', titulo: 'Semana nova: começa limpa' | 'Bem-vindo de volta. Nada se perdeu.', prova ("Faltam 28 dias para a prova de 15/12."), visto, risquinhos }`; retorno = 3 ou mais dias de estudo sem estudar) e `intencao` (`{ texto: "Seu plano: amanhã, 18h, depois que eu chegar da escola." }`).
- `semana(d?)`: meta da semana (segunda a domingo) `{ n, meta, cumprida, dias: [{ dia, rotulo, estudado, diaDeEstudo, hoje, futuro }] (7), texto: "2 de 3 dias" | "3 de 3 dias, cumprida" | "4 dias, meta de 3 cumprida" (o texto não repete o `rotulo` "Meta da semana", que a tela põe na frente), rotulo, regra }`. A semana seguinte começa limpa; nada de "perdeu". Ela entra na conta de semanas com a meta (Plano, marco) quando termina.
- `colecao('AAAA-MM'?)`: Coleção de vistos (Perfil) `{ titulo, mes, rotuloMes, cabecalho (seg…dom), semanas: [[{ dia, n, fora, visto, hoje }]], texto, regra, anterior, seguinte }` a partir de `st.carimbos` (gravado no fim da missão quando o dia contou; estudo livre não carimba; só cresce).
- `prontoPorHoje()` traz: `quando` ("quando e onde": `{ pergunta, dia, rotuloDia, horario, ancoras, ancora, salvo, lembrete }`; `lembrete` só diz "o alarme do Prumo fica para as 19:00" se o aluno criou o alarme no Primeiro uso; senão, "Se quiser, crie um alarme…"), `amanha` (`{ rotulo: 'Amanhã começa por aqui' | 'Na segunda começa por aqui' | 'No sábado…' (o dia certo), html (só o enunciado da 1ª pergunta da próxima missão), aviso (com o crédito na frente quando é questão do Enem: "Questão 167 do Enem 2022, 2º dia. INEP, CC BY-ND 3.0. Só para pensar no caminho: a resposta fica para a missão."), fonte, rodape, licencaUrl }`), `continuar` e `visto.retorno` (o visto do dia de volta vem com a anotação "retorno").
- Ação `definirIntencao({ dia, horario, ancora })`: grava `st.intencao` e o `perfil.horario` (o lembrete). Estado: `carimbos: { dia: true }`, `intencao: { dia, horario, ancora } | null`.
