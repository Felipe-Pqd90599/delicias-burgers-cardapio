const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = path.resolve(__dirname, '../online');
const outDir = path.resolve(__dirname, '../output');
const browsers = [
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(root, url === '/' ? 'print.html' : url);
      if (!file.startsWith(root)) {
        res.writeHead(403);
        return res.end();
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end('not found');
        }
        res.writeHead(200, {
          'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
        });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function main() {
  const executablePath = browsers.find((p) => p && fs.existsSync(p));
  if (!executablePath) throw new Error('Chrome/Edge não encontrado');

  fs.mkdirSync(outDir, { recursive: true });
  const { server, port } = await startServer();
  const url = `http://127.0.0.1:${port}/print.html`;
  const outPdf = path.join(outDir, 'cardapio-delicias-burgers.pdf');

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction(
    () => document.body.dataset.printReady === '1',
    { timeout: 60000 }
  );

  const stats = await page.evaluate(() => ({
    loaded: Number(document.body.dataset.imagesLoaded || 0),
    total: Number(document.body.dataset.imagesTotal || 0),
  }));
  console.log('imagens PDF', stats);
  if (stats.loaded < stats.total) {
    throw new Error(
      `Gate PDF: ${stats.loaded}/${stats.total} imagens carregadas`
    );
  }

  await page.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });
  await browser.close();
  server.close();

  const onlinePdf = path.join(root, 'cardapio-delicias-burgers.pdf');
  fs.copyFileSync(outPdf, onlinePdf);
  const mb = (fs.statSync(onlinePdf).size / (1024 * 1024)).toFixed(2);
  console.log('PDF gerado:', onlinePdf, mb + ' MB');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
