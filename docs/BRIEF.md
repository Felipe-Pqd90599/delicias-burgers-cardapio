# Brief — Delícias Burgers Cardápio

**Status:** G1 aprovado · site online montado (G4 parcial — ainda sem fotos por item e sem PDF regenerável)  
**Data:** 2026-09-15  
**Orquestrador:** Cursor Agent + skill `delicias-menu-orchestrator`

## Materiais recebidos

| Arquivo | Uso |
|---------|-----|
| `assets/referencias/cardapio-oficial-delicias-burgers.pdf` | Produtos, preços, contato, paleta, layout |
| `assets/referencias/capa.png` | Logo e identidade da capa |

## Decisões

1. **Cores:** preto `#0A0A0A` + amarelo de preço `#FFFF00` + dourado da capa `#F8E018` → `design/design-tokens.json`
2. **Fonte de dados:** `data/menu-data.json` (89 itens)
3. **Hospedagem prevista:** GitHub Pages
4. Copy: textos do PDF, sem inventar ingredientes

## Links (quando o GitHub existir)

- Repositório: https://github.com/Felipe-Pqd90599/delicias-burgers-cardapio
- Site: https://Felipe-Pqd90599.github.io/delicias-burgers-cardapio/

## Gates

| Gate | Status |
|------|--------|
| G0 — Plano e estrutura | ✅ |
| G1 — JSON | ✅ Aprovado pelo Felipe |
| G2 — Copy | ✅ Textos do PDF |
| G3 — Visual | ✅ Tokens amarelo/preto |
| G4 — PDF + online + QA | 🟡 Site no ar localmente; fotos e PDF ainda faltam |
