const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const executablePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

const pdfPath = path.resolve(
  __dirname,
  '../assets/referencias/cardapio-oficial-delicias-burgers.pdf'
);
const outDir = path.resolve(__dirname, '../assets/referencias/pages');

async function main() {
  if (!executablePath) throw new Error('Chrome/Edge não encontrado');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
  const url = 'file:///' + pdfPath.replace(/\\/g, '/');
  for (let n = 1; n <= 8; n++) {
    await page.goto(url + '#page=' + n, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 1800));
    const out = path.join(outDir, 'chrome-page-' + n + '.png');
    await page.screenshot({ path: out, fullPage: false });
    console.log('saved', out);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
