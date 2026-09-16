/**
 * Checklist: JSON, preços e fotos de categoria (não exige foto por item).
 * Uso: npm run qa-check
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const menu = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/menu-data.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/images-meta.json'), 'utf8'));
const catDir = path.join(ROOT, 'assets/categorias');

let errors = 0;
let warnings = 0;

function err(msg) {
  console.error('ERRO:', msg);
  errors += 1;
}
function warn(msg) {
  console.warn('AVISO:', msg);
  warnings += 1;
}
function ok(msg) {
  console.log('OK:', msg);
}

const items = menu.categories.flatMap((c) => c.items || []);
const ids = new Set();

if (menu.categories.length === 0) {
  warn('menu-data.json ainda sem categorias');
}

for (const cat of menu.categories) {
  if (cat.itemRefs?.length) {
    for (const refId of cat.itemRefs) {
      if (!items.find((i) => i.id === refId)) {
        err(`itemRef inválido em ${cat.id}: ${refId}`);
      }
    }
  }
  if (cat.image) {
    const file = path.join(ROOT, 'assets', cat.image);
    if (!fs.existsSync(file)) err(`foto de categoria ausente: assets/${cat.image}`);
  } else {
    warn(`categoria sem imagem: ${cat.id}`);
  }
}

for (const item of items) {
  if (ids.has(item.id)) err(`id duplicado: ${item.id}`);
  ids.add(item.id);
  if (item.portionOptions?.length) {
    for (const opt of item.portionOptions) {
      if (typeof opt.price !== 'number') err(`${item.id}: portionOptions price inválido (${opt.key})`);
    }
  } else if (typeof item.price !== 'number') {
    err(`${item.id}: price inválido`);
  }
}

const catFiles = fs.existsSync(catDir)
  ? fs.readdirSync(catDir).filter((f) => /\.(png|jpe?g)$/i.test(f))
  : [];
ok(`${catFiles.length} fotos de categoria em assets/categorias/`);
ok(`images-meta missingCount ${meta.missingCount}`);
ok(`${items.length} itens em ${menu.categories.length} categorias`);

const onlinePdf = path.join(ROOT, 'online/cardapio-delicias-burgers.pdf');
if (!fs.existsSync(onlinePdf)) {
  warn('online/cardapio-delicias-burgers.pdf não encontrado — rode npm run generate-pdf');
} else {
  const mb = (fs.statSync(onlinePdf).size / (1024 * 1024)).toFixed(2);
  ok(`PDF do site: ${mb} MB`);
}

console.log('---');
console.log(`Resultado: ${errors} erro(s), ${warnings} aviso(s)`);
process.exit(errors > 0 ? 1 : 0);
