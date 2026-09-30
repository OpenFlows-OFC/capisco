# Capisco · jogo (web + app)

Protótipo funcional do jogo descrito no capítulo 5 do TCC, implementando os 7 pilares do método RAID.

## Como abrir

**Online**
- Celular: https://openflows-ofc.github.io/capisco/jogo/app/
  - iPhone: Safari → Compartilhar → **Adicionar à Tela de Início**
  - Android: Chrome → **Instalar app**
- Computador: https://openflows-ofc.github.io/capisco/jogo/

**Local:** dois cliques em `jogo/index.html` (sem offline e sem avisos) ou `npx serve` dentro de `prototipo/capisco`.

**Atualizar o site:** dentro de `prototipo/capisco`, faça commit e `git push`. O GitHub Pages publica em cerca de 1 minuto.

**Para a apresentação**
- Na primeira tela, **"Ver com dados de exemplo"** carrega 3 semanas de uso simulado, com todos os estados do mapa.
- Em **Mais → Ajustes → Demonstração**, dá para avançar o tempo (+1 dia, +7 dias) e mostrar as revisões vencendo.

## Como o jogo funciona (v2)
- **Aprender**: a trilha da matéria. Tocar num tópico abre um balão com o objetivo e o que se ganha, que é o briefing do Pilar I. Cada unidade termina num **Chefão**, um simulado com a unidade inteira.
- **Revisar**: o que o agendador trouxe para hoje, a agenda dos próximos dias e a montagem da partida de revisão.
- **Lição**: pergunta → Verificar → faixa de resultado (acertou, quase ou ainda não; por quê; o que vem) → fim de rodada.
- **Fim de partida**: resumo → recompensas (anunciadas antes, conferidas item a item) → "Pronto por hoje" (tela escura, sem "só mais uma").
- **Recompensas**: o tópico sobe de caixa, libera o próximo e libera o Chefão. Vencer o Chefão dá o troféu da unidade e a roupa da Capi. Treinar um tópico antes do dia da revisão não sobe a caixa.
- **Perfil**: números, constância (não zera), domínio por matéria, troféus e guarda-roupa.

## Arquitetura

```
jogo/
├── index.html            casca web (menu lateral; vira abas embaixo em telas estreitas)
├── app/                  casca app: PWA com manifesto, service worker (offline) e ícones
├── core/
│   ├── motor.js          TODAS as regras do jogo: funções puras, determinísticas, com texto explicativo
│   ├── estado.js         dados do jogador no aparelho (localStorage) + exportar/importar JSON
│   └── conteudo/         banco de itens: 8 conjuntos, 40 tópicos, 240 itens (esquema em LEIA.md)
└── ui/
    ├── base.js           roteador, casca, som (níveis 0–4), modais, avisos
    ├── telas.js          boas-vindas, início, mapa, tópico, revisões, progresso, conjuntos,
    │                     editor, grupo, guarda-roupa, ajustes, "como o jogo decide"
    ├── partida.js        briefing → tentativa → retorno → fim de rodada → encerramento
    └── jogo.css
```

Tudo é HTML, CSS e JavaScript sem build e sem dependências. Web e app compartilham 100% do código; só muda a casca (`CAPISCO.app.montar('web' | 'app')`).

## Onde cada pilar está no código

| Pilar | Tela | Regra em `core/motor.js` |
|---|---|---|
| I · Objetivo visível | Briefing: mapa, rodadas ajustáveis, condição de vitória em texto | `proposta`, `regraProposta` |
| II · Tentativa como unidade | Partida: resposta antes da explicação e pausa de 1,2 s antes do "Continuar" | `P.deliberacao` |
| III · Ritmo elástico | A rodada fecha por sequência de domínio; teto de 8 tentativas redireciona ao pré-requisito | `registrar`, `fecharRodada`, `escolherItem` (banda-alvo 60–85%) |
| IV · Progressão legível | Retorno em 3 camadas; tela do tópico com caixa, histórico e regra; "Como o jogo decide" | `avaliar`, `regulacao`, `porqueEstado` |
| V · Recompensa determinística | Bilhete com a recompensa anunciada; roupa da Capi liberada na 1ª rodada vencida de cada matéria | `recompensa` |
| VI · Retorno programado | Revisões: caixas de Leitner com intervalos pela data da prova (Cepeda); avisos com urgência verdadeira | `intervalos`, `agenda` |
| VII · Encerramento projetado | Encerramento: fundo muda, som para, sem "só mais uma", mostra a próxima revisão | rota `fim` em `ui/partida.js` |

## Limites deste protótipo
- **Grupo de estudo**: os colegas são simulados, porque não há servidor. A tela avisa isso.
- **Calibração da dificuldade**: a recalibração pelos acertos da população (TCC 5.3) depende de servidor e está fora do escopo.
- **Avisos no celular**: disparam quando o app é aberto no dia da revisão. Para avisar com o app fechado, é preciso push com servidor ou o app nativo.

## Próximo passo do app
Embrulhar a pasta `jogo/` com [Capacitor](https://capacitorjs.com/) para gerar APK e IPA:
1. `npm i @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init Capisco br.com.capisco --web-dir=.`
3. `npx cap add android`
4. `npx cap open android`

O código não muda. Os avisos passam a usar `@capacitor/local-notifications`, que agenda as revisões mesmo com o app fechado.
