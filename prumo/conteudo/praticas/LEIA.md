# Tópicos de prática com questões reais do Enem

Cada arquivo `conteudo/praticas/<id>.js` é um ES module que exporta `topico`:

```js
export const topico = {
  id: 'mat-porcentagem',            // <area>-<slug>
  area: 'MT',                       // MT | CN | CH | LC (áreas do Enem)
  materia: 'Matemática',            // Matemática | Biologia | Química | Física | História | Geografia | Filosofia e Sociologia | Língua Portuguesa
  titulo: 'Porcentagem e juros',
  descricao: 'Uma frase do que o tópico cobre, para o aluno.',
  ideias: [                         // 3 a 5 frases curtas: o essencial para resolver as questões (texto da equipe)
    'Porcentagem é uma fração de 100: 15% = 0,15.',
  ],
  questoes: [                       // 6 questões, em ordem crescente de b (dificuldade TRI)
    {
      id: 'enem-2021-150',
      ano: 2021, numero: 150, caderno: 'Azul', aplicacao: '1ª aplicação',
      coProva: 911, coItem: 12345, habilidade: 'H16', a: 2.1, b: 1.05, c: 0.17,
      gabarito: 'C',                // conferido em ITENS_PROVA_<ano>.csv (TX_GABARITO), item não anulado
      contexto: '<p>…</p>',         // HTML do texto do INEP, íntegro (só mudança de formato); imagens: <figure><img src="./conteudo/praticas/img/<arquivo>" alt="…"></figure>
      enunciado: '<p>…</p>',
      alternativas: { A: '…', B: '…', C: '…', D: '…', E: '…' },   // texto íntegro do INEP (HTML permitido)
      explicacao: 'Texto da equipe: como resolver, em 2 a 5 frases.',
      faltou: { A: 'Texto da equipe: o erro provável de quem marca A.', B: '…', D: '…', E: '…' }, // todas as erradas
      nivel: 'médio',               // fácil (b < 0,5) | médio (0,5 ≤ b < 1,5) | difícil (b ≥ 1,5); só itens com b informado
      fonte: 'Enem 2021, 2º dia, Caderno Azul, questão 150. INEP, CC BY-ND 3.0.',
      transcricao: 'enem.dev, conferida com ITENS_PROVA' 
    },
  ],
  autoria: { equipe: 'Prumo', ia: 'Claude Opus 5.5 (Anthropic), via Claude Code', revisao: 'pendente' },
};
```

Regras:
- Questão do INEP: texto íntegro, sem adaptar (CC BY-ND 3.0). Só formato muda. Atribuição em `fonte`.
- Gabarito, CO_ITEM, habilidade e a, b, c conferidos no `rebranding/anexos/inep/ITENS_PROVA_<ano>.csv` (Caderno Azul, 1ª aplicação). Item anulado ou com gabarito divergente: fora.
- Prefira questões sem imagem ou com imagem simples; imagem baixada para `conteudo/praticas/img/` com o mesmo conteúdo do original.
- `explicacao`, `faltou` e `ideias` são texto da equipe, em português claro para aluno de 16 anos, sem copiar 6 palavras seguidas do INEP.
- Sem "perdeu", sem emoji, sem exclamação.
- Não repita questões já usadas em `conteudo/mat-fa*.js`.
