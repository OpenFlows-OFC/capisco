// Prumo · pack do caderno "Funções afins" (Matemática). Esquema: e.2 da especificação + cards (Decisão 1).
// É um módulo JS (e não JSON lido por fetch) para abrir também offline e por file://.
//
// Junta os Caps. 1 e 2 (mat-fa-c12.js) e os Caps. 3 e 4 (mat-fa-c34.js), aplica os pré-requisitos
// de g.2 (Cap. 3 exige 1 e 2; Cap. 4 exige 1), tira "modelos" e "questoes" de dentro dos capítulos
// para pack.modelos e pack.questoes e gera as variantes de cada modelo (gerador.js), com ids
// "<modelo>#<linha>". Falha de geração não derruba o app: vai para pack.avisos, e o validador
// (_dev/valida_pack.mjs) recusa o pack enquanto houver aviso.
import { capitulos12 } from './mat-fa-c12.js';
import * as c34 from './mat-fa-c34.js';
import { materializar, AUTORIA_IA } from './gerador.js';

export const PREREQ = {
  'mat-fa.c1': [], 'mat-fa.c2': [],
  'mat-fa.c3': ['mat-fa.c1', 'mat-fa.c2'],
  'mat-fa.c4': ['mat-fa.c1'],
};

const MEC_ENEM = {
  tipo: 'mec', rotulo: 'Fazer um simulado no MEC Enem',
  url: 'https://app.mecenem.mec.gov.br/',
  // Conferido no navegador em 17/11/2026 (Playwright, sem sessão): o endereço abre em /onBoarding, com
  // telas de apresentação e, no fim, só o botão "Entrar com gov.br"; /home volta para /onBoarding.
  aviso: 'Abre a plataforma do MEC em outra aba. Depois das telas de apresentação, ela pede login gov.br para continuar. O Prumo não é do MEC e não envia nenhum dado para lá.',
  conferidoEm: '2026-11-17',
  outros: [{ rotulo: 'App MEC Enem na App Store', url: 'https://apps.apple.com/br/app/mec-enem/id6747131349' }],
};

export const META = {
  id: 'mat-fa', versao: '2026.11.17-demo', materia: 'mat', area: 'MT',
  titulo: 'Funções afins',
  cabeco: 'Matemática · Funções afins',
  descricao: 'Preço com parte fixa e parte que varia, leitura de gráficos, taxa de variação e sistemas, com questões oficiais do Enem (habilidades H19 a H22 da Matriz de Referência).',
  licencaPadrao: 'CC BY-SA 4.0',
  licencaPadraoUrl: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pt',
  avisoColetanea: 'Este pack é uma coletânea. O texto, os modelos e as explicações da equipe Prumo estão em CC BY-SA 4.0. Cada questão do Enem mantém a licença indicada nela e não é relicenciada pela licença do pack.',
  avisoIA: 'O texto do caderno, as questões da equipe, as explicações, as linhas de “o que faltou” e os cards foram rascunhados com IA (Claude Opus 5.5, via Claude Code, em 17/11/2026). Revisão pela equipe: pendente.',
  autoriaPadrao: AUTORIA_IA,
  nivelMaximoDemo: 3,
  chefao: { trofeu: 'Troféu Funções afins', selo: 'Selo de Matemática', regra: '4 acertos seguidos, um de cada capítulo', teto: 12 },
  irAlem: [MEC_ENEM],
};

const CREDITOS_FIXOS = [
  { id: 'equipe', fonte: 'Equipe Prumo (ETEC Jornalista Roberto Marinho)', licenca: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pt',
    texto: 'Texto do caderno, questões da equipe, explicações, “o que faltou” e cards. Rascunho por IA, revisão pendente.',
    autoria: AUTORIA_IA },
  { id: 'wikilivros', fonte: 'Wikilivros, Matemática elementar/Função afim (base da p. 2)', licenca: 'CC BY-SA 3.0',
    licencaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt',
    url: 'https://pt.wikibooks.org/w/index.php?oldid=263886', revisao: '263886 (29/10/2013)',
    historico: 'https://pt.wikibooks.org/w/index.php?title=Matem%C3%A1tica_elementar/Fun%C3%A7%C3%A3o_afim&action=history',
    texto: 'Adaptado de Matemática elementar/Função afim, Wikilivros, revisão 263886 (29/10/2013). Autores: ver o histórico da página. CC BY-SA 3.0 (creativecommons.org/licenses/by-sa/3.0/deed.pt). Adaptação da equipe Prumo em CC BY-SA 4.0. Alterações: texto reescrito em parágrafos curtos, exemplos trocados, notação simplificada.' },
  { id: 'inep', fonte: 'INEP/MEC, provas do Enem (2º dia, Caderno Azul)', licenca: 'CC BY-ND 3.0',
    url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos',
    licencaUrl: 'https://creativecommons.org/licenses/by-nd/3.0/legalcode',
    texto: 'Questões reproduzidas sem adaptação; só houve mudança de formato (texto em HTML e imagem em cópia local). A licença vem do rodapé do portal do INEP; a leitura de que ela cobre as provas é interpretação da equipe. Cada questão diz se o texto já foi conferido com o PDF oficial do caderno (textoConferidoPDF); onde a transcrição diferia do PDF, vale o PDF.' },
  { id: 'enem-dev', fonte: 'Projeto enem.dev (transcrição das provas)', licenca: 'código em GPL-2.0; licença dos dados da transcrição não encontrada',
    url: 'https://github.com/yunger7/enem-api', revisao: 'commit 938c56f',
    texto: 'Fonte da transcrição do texto, das alternativas e das imagens das questões, conferida contra o gabarito oficial do INEP e, em 17/11/2026, contra o PDF oficial de cada caderno (onde diferia, vale o PDF). As imagens das Enem 2019 Q143, 2019 Q179, 2020 Q164 e 2020 Q175 (enunciado e alternativas) não são as do enem.dev: são recortes do PDF oficial do INEP, só com mudança de formato.' },
  { id: 'itens-prova', fonte: 'INEP, microdados do Enem: ITENS_PROVA 2019 a 2023', licenca: 'dados abertos do INEP',
    url: 'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/enem',
    texto: 'Gabarito oficial, item anulado, habilidade da Matriz e parâmetros a, b e c da TRI de cada questão, conferidos em 17/11/2026.' },
  { id: 'dosvox', fonte: 'INEP, caderno DOSVOX do Enem 2023 (2º dia, Laranja)', licenca: 'CC BY-ND 3.0',
    url: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_MT_Caderno_11_Laranja_DOSVOX.txt',
    texto: 'Descrição oficial das imagens usada como texto alternativo nas questões de 2023. As outras descrições são da equipe e estão rotuladas.' },
  { id: 'matriz', fonte: 'INEP, Matriz de Referência do Enem', licenca: 'reprodução permitida com citação da fonte',
    url: 'https://download.inep.gov.br/enem/outros_documentos/enem_matriz_de_referencia_v1.pdf',
    texto: 'Códigos das habilidades (H19 a H22) usados para organizar o caderno.' },
  { id: 'links', fonte: 'Khan Academy, Portal da OBMEP e MEC Enem', licenca: 'só link; nenhum conteúdo copiado',
    texto: 'Os links “Ir além” abrem fora do Prumo. Todo o conteúdo da Khan Academy está disponível gratuitamente em www.khanacademy.org; o Prumo não é oficial nem endossado pela Khan Academy.' },
];

// Junta as listas de capítulos (cada uma pode trazer modelos, questões e cards dentro dos capítulos)
// e, opcionalmente, arrays soltos de modelos, questões e cards.
export function montarPack(listas, soltos = {}) {
  const avisos = [];
  const caps = listas.flat().filter(Boolean).slice().sort((a, b) => a.n - b.n);
  const modelos = [...caps.flatMap(c => c.modelos || []), ...(soltos.modelos || [])];
  const questoes = [...caps.flatMap(c => c.questoes || []), ...(soltos.questoes || [])];
  const capitulos = caps.map(({ modelos: _m, questoes: _q, ...c }) => {
    const prereq = PREREQ[c.id] || c.prereq || [];
    if (c.prereq && PREREQ[c.id] && c.prereq.join() !== PREREQ[c.id].join())
      avisos.push(`${c.id}: prereq do capítulo (${c.prereq.join(', ')}) difere de g.2; vale ${PREREQ[c.id].join(', ') || 'nenhum'}`);
    return { ...c, prereq, cards: [...(c.cards || [])] };
  });
  // cards soltos vão para o capítulo do bloco a que se ligam
  const capDoBloco = {};
  for (const c of capitulos) for (const pg of c.paginas || []) for (const b of pg.blocos || []) capDoBloco[b.id] = c;
  for (const k of soltos.cards || []) {
    const c = capDoBloco[k.bloco];
    if (c) c.cards.push(k); else avisos.push(`card ${k.id}: bloco ${k.bloco} não encontrado`);
  }
  for (const m of modelos) {
    if (Array.isArray(m.variantes) || !Array.isArray(m.linhas) || !m.certa) continue;
    try { m.variantes = materializar(m); }
    catch (e) { avisos.push(`modelo ${m.id}: ${e.message}`); }
  }
  const terceiros = questoes.filter(q => q.materialDeTerceiros).map(q => ({
    id: `terceiros-${q.id}`, fonte: `Material de terceiros citado em ${q.atribuicao || q.id}`,
    licenca: 'citação para fins de estudo (Lei 9.610/98, art. 46, III)', texto: q.materialDeTerceiros,
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l9610.htm',
  }));
  return { ...META, creditos: [...CREDITOS_FIXOS, ...terceiros], capitulos, modelos, questoes, avisos };
}

const soltosDe = ns => {
  const pega = re => Object.entries(ns).filter(([k, v]) => re.test(k) && Array.isArray(v)).flatMap(([, v]) => v);
  return { modelos: pega(/^modelos/), questoes: pega(/^questoes/), cards: pega(/^cards/) };
};

export const pack = montarPack([capitulos12, c34.capitulos34 || c34.capitulos || []], soltosDe(c34));
export const capitulos = pack.capitulos;   // a lista concatenada dos Caps. 1 a 4
export default pack;
