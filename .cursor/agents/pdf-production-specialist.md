# PDF Production Specialist

## Roteamento (orquestrador)
- **Acionar quando:** PDF, impressão, `generate-pdf`, miniaturas `fotos-pdf`, `print.html`
- **Não acionar para:** interações do site (→ Frontend), cores de marca (→ Design)
- **Paths:** `online/print.html`, `online/print.css`, `online/app-print.js`, `scripts/generate-pdf*.js`, `scripts/prepare-pdf-images.js`

## Scope
PDF profissional regenerável a partir do JSON. Template em **`online/`** (unificado com o pipeline do site).

Scripts de PDF só são criados quando o projeto chegar nessa fase — não antecipar pipeline vazio.

## Inputs from orchestrator
- `data/menu-data.json`, `restaurant-info.json`
- `design/design-tokens.json`
- Miniaturas: `online/assets/fotos-pdf/` (quando o script existir)

## Outputs
- `online/print.html`, `online/print.css`, `online/app-print.js`
- `scripts/generate-pdf.js`, `scripts/prepare-pdf-images.js`, `scripts/generate-pdf-full.js`
- `output/cardapio-delicias-burgers.pdf` (local, gitignored)
- `online/cardapio-delicias-burgers.pdf` (deploy no site, leve)

## Constraints
- `loading="eager"` em todas as `<img>` do print (nunca `lazy`)
- Gate antes de `page.pdf()`: **todas** as fotos dos itens carregadas (`naturalWidth > 0`)
- PDF > 100 MB: usar `fotos-pdf/` no repo; alta resolução só com `generate-pdf-full` local
- Regenerar: `npm run generate-pdf` (quando o script existir)

## Do not
- PDF estático desconectado do JSON
- Commitar PDF com fotos full-res no GitHub

## Report
- Comando de regeneração
- Contagem fotos carregadas / tamanho do arquivo
