const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve(
  'pdfjs-dist/legacy/build/pdf.worker.js'
);

const pdfPath = path.resolve(
  __dirname,
  '../assets/referencias/cardapio-oficial-delicias-burgers.pdf'
);
const outDir = path.resolve(__dirname, '../assets/referencias/pages');

function toRgba(img) {
  const { width: w, height: h, data, kind } = img;
  const rgba = Buffer.alloc(w * h * 4);
  if (kind === 1) {
    for (let i = 0, p = 0; i < data.length; i++, p += 4) {
      rgba[p] = data[i];
      rgba[p + 1] = data[i];
      rgba[p + 2] = data[i];
      rgba[p + 3] = 255;
    }
  } else if (kind === 2) {
    for (let i = 0, p = 0; i < data.length; i += 3, p += 4) {
      rgba[p] = data[i];
      rgba[p + 1] = data[i + 1];
      rgba[p + 2] = data[i + 2];
      rgba[p + 3] = 255;
    }
  } else if (kind === 3) {
    Buffer.from(data).copy(rgba);
  } else {
    throw new Error('kind desconhecido: ' + kind);
  }
  return { w, h, rgba };
}

function quantize(r, g, b) {
  const q = (v) => Math.round(v / 16) * 16;
  return `#${[q(r), q(g), q(b)]
    .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const globalCounts = new Map();

  for (let p = 1; p <= 3; p++) {
    const page = await doc.getPage(p);
    const ops = await page.getOperatorList();
    let imgIndex = 0;
    const inv = {};
    for (const [k, v] of Object.entries(pdfjsLib.OPS)) inv[v] = k;

    for (let i = 0; i < ops.fnArray.length; i++) {
      const name = inv[ops.fnArray[i]];
      if (name !== 'paintImageXObject' && name !== 'paintJpegXObject') continue;
      const imgName = ops.argsArray[i][0];
      const img = await page.objs.get(imgName);
      if (!img?.data) continue;
      const { w, h, rgba } = toRgba(img);
      const src = Canvas.createCanvas(w, h);
      const sctx = src.getContext('2d');
      const imageData = sctx.createImageData(w, h);
      imageData.data.set(rgba);
      sctx.putImageData(imageData, 0, 0);
      const maxW = 900;
      const scale = w > maxW ? maxW / w : 1;
      const canvas = Canvas.createCanvas(Math.round(w * scale), Math.round(h * scale));
      canvas.getContext('2d').drawImage(src, 0, 0, canvas.width, canvas.height);
      const out = path.join(outDir, `page-${p}-img${imgIndex}.png`);
      fs.writeFileSync(out, canvas.toBuffer('image/png'));
      console.log('saved', out, w + 'x' + h, 'kind=' + img.kind);

      const step = 8;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const o = (y * w + x) * 4;
          const key = quantize(rgba[o], rgba[o + 1], rgba[o + 2]);
          globalCounts.set(key, (globalCounts.get(key) || 0) + 1);
        }
      }
      imgIndex += 1;
    }
  }

  const sorted = [...globalCounts.entries()].sort((a, b) => b[1] - a[1]);
  console.log('TOP COLORS');
  console.log(JSON.stringify(sorted.slice(0, 25), null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
