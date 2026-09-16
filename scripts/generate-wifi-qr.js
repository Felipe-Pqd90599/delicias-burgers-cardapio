const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const root = path.join(__dirname, '..');
const info = JSON.parse(
  fs.readFileSync(path.join(root, 'data/restaurant-info.json'), 'utf8')
);

function escapeWifi(value) {
  return String(value).replace(/([\\;,:"])/g, '\\$1');
}

async function main() {
  const wifi = info.wifi || {};
  const ssid = wifi.ssid;
  const password = wifi.password;
  const security = wifi.security || 'WPA';
  if (!ssid || !password) {
    throw new Error('wifi.ssid e wifi.password são obrigatórios em restaurant-info.json');
  }

  const payload = `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;
  const outDir = path.join(root, 'online/assets');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'wifi-qr.png');

  await QRCode.toFile(outFile, payload, {
    type: 'png',
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0A0A0A',
      light: '#FFFF00',
    },
  });

  console.log('wifi qr', outFile);
  console.log('payload', payload);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
