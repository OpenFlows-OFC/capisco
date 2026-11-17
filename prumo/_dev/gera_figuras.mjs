// Gera os arquivos SVG das figuras do texto do caderno (figura.src), a partir do mesmo SVG
// que vai embutido no pack (figura.html). O arquivo leva as cores do tema dentro dele, porque
// um <img> não herda as variáveis CSS da página.
// Uso: node prumo/_dev/gera_figuras.mjs
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');

const listas = [];
listas.push((await import(pathToFileURL(resolve(raiz, 'conteudo/mat-fa-c12.js')).href)).capitulos12);
if (existsSync(resolve(raiz, 'conteudo/mat-fa-c34.js'))) {
  const m = await import(pathToFileURL(resolve(raiz, 'conteudo/mat-fa-c34.js')).href);
  listas.push(m.capitulos34 || m.capitulos || []);
}

const ESTILO = '<style>svg{color:#0B1B33;--foco:#2348C9;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
  + '@media (prefers-color-scheme: dark){svg{color:#E6ECF7;--foco:#8FA8F5}}</style>';

let n = 0;
for (const caps of listas) for (const c of caps) for (const pg of c.paginas || []) for (const b of pg.blocos || [])
  for (const par of b.paragrafos || []) {
    const f = par.figura;
    if (!f || f.tipo !== 'svg' || !f.src) continue;
    const m = /<svg[\s\S]*<\/svg>/.exec(f.html || '');
    if (!m) throw new Error(`${par.id}: figura sem <svg>`);
    const svg = m[0]
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace(/style="width:100%;height:auto;[^"]*"/, '')
      .replace(/(<svg[^>]*>)/, `$1<title>${f.alt.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>${ESTILO}`);
    writeFileSync(resolve(raiz, f.src), svg);
    n++;
    console.log('escrito: ' + f.src);
  }
console.log(`${n} figura(s).`);
