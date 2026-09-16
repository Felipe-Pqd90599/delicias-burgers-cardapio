# Deploy — Delícias Burgers

O GitHub Actions publica a pasta `online/` na branch `gh-pages`.

## Atualizar o site depois de mudar JSON

```bash
npm run sync-online
npm run qa-check
```

Isso copia `data/` para `online/data/`, gera o QR do Wi-Fi e atualiza o cache-bust.

1. Commit na `main`
2. `git push origin main`
3. Ativar GitHub Pages: Settings → Pages → branch `gh-pages` / root

URL prevista: https://Felipe-Pqd90599.github.io/delicias-burgers-cardapio/
