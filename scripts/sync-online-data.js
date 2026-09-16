const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const files = [
  ['data/menu-data.json', 'online/data/menu-data.json'],
  ['data/restaurant-info.json', 'online/data/restaurant-info.json'],
  ['design/design-tokens.json', 'online/data/design-tokens.json'],
  ['data/images-meta.json', 'online/data/images-meta.json'],
];

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(path.join(root, dest)), { recursive: true });
  fs.copyFileSync(path.join(root, src), path.join(root, dest));
  console.log('copied', dest);
}

function copyIfExists(srcRel, destRel) {
  const src = path.join(root, srcRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(path.join(root, destRel)), { recursive: true });
  fs.copyFileSync(src, path.join(root, destRel));
  console.log('copied', destRel);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    if (!fs.statSync(from).isFile()) continue;
    if (name === '.gitkeep') continue;
    fs.copyFileSync(from, path.join(dest, name));
  }
  console.log('copied dir', path.basename(src));
}

for (const [src, dest] of files) copyFile(src, dest);

copyDir(path.join(root, 'assets/fotos'), path.join(root, 'online/assets/fotos'));
copyDir(path.join(root, 'assets/categorias'), path.join(root, 'online/assets/categorias'));
copyIfExists('assets/referencias/capa.png', 'online/assets/capa.png');
copyIfExists('assets/referencias/fundo-madeira.png', 'online/assets/fundo-madeira.png');

const menu = JSON.parse(fs.readFileSync(path.join(root, 'data/menu-data.json'), 'utf8'));
const v = encodeURIComponent(menu.meta?.version || '1');
const indexPath = path.join(root, 'online/index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/href="styles\.css(?:\?v=[^"]*)?"/, `href="styles.css?v=${v}"`);
  html = html.replace(/src="app\.js(?:\?v=[^"]*)?"/, `src="app.js?v=${v}"`);
  fs.writeFileSync(indexPath, html);
  console.log('cache-bust v=', menu.meta?.version);
}
