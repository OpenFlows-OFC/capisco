# Banco de conteúdo do Capisco

Cada matéria fica num arquivo `<materia>.js` (bio, qui, fis, mat, his, geo, por, red) carregado como script clássico (sem módulos, para abrir via `file://`).

```js
(window.CAPISCO = window.CAPISCO || {}).conteudo = window.CAPISCO.conteudo || [];
CAPISCO.conteudo.push({
  id: 'bio-genetica',            // único
  materia: 'bio',                // bio | qui | fis | mat | his | geo | por | red
  titulo: 'Genética mendeliana',
  autor: 'Equipe Capisco',
  versao: '1.0',
  descricao: 'Uma frase sobre o que o conjunto cobre.',
  topicos: [
    {
      id: 'bio-gen-conceitos',   // único no banco inteiro, prefixo da matéria
      nome: 'Gene, alelo e genótipo',   // curto: cabe num nó do mapa
      resumo: 'Uma frase do que o tópico cobre.',
      prereq: [],                // ids de tópicos DO MESMO conjunto (grafo dirigido, sem ciclos)
      fonte: 'Apostila de Biologia · Genética, cap. 1',   // referência do material de origem
      itens: [ /* 6 itens, ver tipos abaixo */ ]
    }
  ]
});
```

## Campos comuns a todo item

| campo | valores |
|---|---|
| `id` | único, ex.: `bio-gen-conceitos-1` |
| `tipo` | `mc` · `multi` · `aberta` · `cartao` · `transfer` |
| `nivel` | `lembrar` · `compreender` · `aplicar` |
| `dif` | 1 (fácil) · 2 · 3 (difícil) |
| `explicacao` | camada de **elaboração**: explica o mecanismo e reconstrói o raciocínio correto. Fala do conteúdo, nunca da pessoa. 1 a 3 frases. |
| `trecho` | trecho do material de origem que ancora a explicação (1 a 2 frases, tom de apostila) |

## Tipos

**`mc`** · múltipla escolha, 4 alternativas, 1 correta. Cada distrator **precisa** de `erro`: a concepção errônea plausível que leva a escolhê-lo (distrator diagnóstico).
```js
{ tipo:'mc', enunciado:'…', opcoes:[ {t:'…', ok:true}, {t:'…', erro:'Confunde genótipo com fenótipo'}, … ] }
```

**`multi`** · "marque todas as corretas", 4 ou 5 opções, 2 ou 3 corretas. Permite o **quase** verdadeiro: acertar parte.
```js
{ tipo:'multi', enunciado:'Marque todas as …', opcoes:[ {t:'…', ok:true}, {t:'…', ok:false, erro:'…'}, … ] }
```

**`aberta`** · resposta construída curta (1 frase). Correção por critérios; cada critério tem palavras-chave (sem acento, minúsculas, radicais curtos funcionam: `'domin'` casa com dominante/dominância). Todos os critérios = acerto; parte = quase.
```js
{ tipo:'aberta', enunciado:'…', modelo:'resposta-modelo completa',
  criterios:[ {rotulo:'Cita que o alelo dominante se expressa', chaves:['domin']}, {rotulo:'…', chaves:['…','…']} ] }
```

**`cartao`** · evocação livre: a pessoa tenta lembrar e depois se autoavalia (lembrei / lembrei em parte / não lembrei).
```js
{ tipo:'cartao', frente:'pergunta ou conceito', verso:'o que deveria ter lembrado' }
```

**`transfer`** · desafio de aplicação em **contexto novo** (situação, gráfico descrito, caso). Retorno adiado: antes do resultado, a pessoa confere o próprio raciocínio pelos `passos`. `formato` é `mc` (usa `opcoes` como no mc) ou `aberta` (usa `modelo` + `criterios`).
```js
{ tipo:'transfer', formato:'mc', contexto:'situação nova em 2 a 4 frases', enunciado:'…',
  passos:['1º passo do raciocínio','2º','3º'], opcoes:[…] }
```

## Composição por tópico (6 itens)
- 2 `mc` (um `lembrar`, um `compreender`)
- 1 `multi` (`compreender`)
- 1 `aberta` (`compreender` ou `aplicar`)
- 1 `cartao` (`lembrar`)
- 1 `transfer` (`aplicar`, `dif` 2 ou 3)

## Voz
Informal, direto, gentil, como um colega do 3º ano que já passou no vestibular. Sem "você é gênio", sem "errado!". Português do Brasil com acentuação correta. Nível ENEM / vestibular.
