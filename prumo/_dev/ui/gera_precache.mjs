// Gera a lista explícita do precache do sw.js (app, conteúdo e imagens; _dev fica de fora).
// Uso (na pasta prumo/): node _dev/ui/gera_precache.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lista = (dir, filtro) => readdirSync(path.join(raiz, dir)).filter(f => statSync(path.join(raiz, dir, f)).isFile() && filtro(f)).sort().map(f => (dir ? `${dir}/${f}` : f));
const arquivos = [
  './', 'index.html', 'manifest.webmanifest',
  ...lista('', f => /^(icone.*|apple-touch-icon)\.(svg|png)$/.test(f)),
  ...lista('marca', f => /\.svg$/.test(f)),
  ...lista('css', f => /\.css$/.test(f)),
  'js/app.js',
  ...lista('js/ui', f => /\.js$/.test(f)),
  ...lista('js/nucleo', f => /\.js$/.test(f)),
  ...lista('conteudo', f => /\.js$/.test(f)),
  ...lista('conteudo/img', f => /\.(png|svg|webp|jpg)$/.test(f)),
];
const sw = path.join(raiz, 'sw.js');
const txt = readFileSync(sw, 'utf8');
const bloco = `// <precache>\nconst ARQUIVOS = [\n${arquivos.map(a => `  '${a}',`).join('\n')}\n];\n// </precache>`;
const novo = txt.replace(/\/\/ <precache>[\s\S]*?\/\/ <\/precache>/, bloco);
writeFileSync(sw, novo);
console.log(`${arquivos.length} arquivos no precache`);
