# Project Handoff — Delícias Burgers Cardápio

**Versão:** 0.2.0-g1  
**Data:** 2026-09-15  
**Cliente / dono:** Felipe  
**Pasta local:** `C:\Users\Felipe\delicias-burgers-cardapio\`  
**Repositório:** https://github.com/Felipe-Pqd90599/delicias-burgers-cardapio (criar se ainda não existir)

---

## Separação dos projetos

| Projeto | Pasta no PC | GitHub |
|---------|-------------|--------|
| Página pessoal | `C:\Users\Felipe\pagina-pessoal\` | `pagina-pessoal` |
| Cardápio Prainha | `C:\Users\Felipe\pagina-pessoal\prainha-rooftop-cardapio\` | `prainha-rooftop-cardapio` |
| Cardápio Delícias Burgers | `C:\Users\Felipe\delicias-burgers-cardapio\` | `delicias-burgers-cardapio` |

No Cursor: **File → Open Folder** na pasta do projeto em que você quer trabalhar. Cada pasta tem o próprio `.cursor/agents`.

---

## Fonte única de dados

- **Menu:** `data/menu-data.json`
- **Restaurante:** `data/restaurant-info.json`
- **Fotos:** `assets/fotos/{item.id}.jpg`
- **Status fotos:** `data/images-meta.json`

---

## Comandos essenciais

```bash
npm run qa-check
```

(sync, PDF e fotos entram nas fases seguintes.)

---

## Gates

| Gate | Status |
|------|--------|
| G0 Plano | ✅ |
| G1 JSON | 🟡 Extraído do PDF — conferir com Felipe |
| G2 Copy | 🟡 Textos do PDF |
| G3 Visual | 🟡 Tokens amarelo/preto; site ainda não |
| G4 Site + PDF + QA | ⏳ |
