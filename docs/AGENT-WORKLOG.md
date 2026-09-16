# Agent Worklog — Delícias Burgers Cardápio

**Última atualização:** 2026-09-15  
**Índice de agentes:** `docs/AGENTS-INDEX.md`

---

## Orquestrador

**Fase:** G1 (JSON extraído) + tokens G3  
**Status:** 🟡 Aguardando o Felipe validar o cardápio

### Produzi
- Copiou o PDF oficial para `assets/referencias/`
- Delegou Content Architect, Design & UX, Copywriter e Archivist

### Pendências
- Conferência G1 com o Felipe
- Fotos por item
- Repositório GitHub (login `gh` ainda falta)
- Site (Frontend) depois do G1 fechado

---

## Menu Content Architect — 🟡 G1 extraído

### Recebi
- PDF oficial 8 páginas

### Produzi
- `data/menu-data.json` — 89 itens, 8 categorias
- `data/restaurant-info.json`
- `docs/CHANGELOG-content.md`

### Decisões
- Pizzas G/GG e petiscos M/G como `portionOptions`
- Combos separados de petiscos no JSON

### Pendências
- Validação do Felipe (preços, segundo telefone, Wi-Fi no site)

---

## Brand Copywriter — 🟡

- Descrições = texto do PDF
- `docs/COPY-GUIDE.md` atualizado
- Não reescreveu nomes comerciais

---

## Design & UX Specialist — 🟡 tokens

- Paleta amostrada: preto + `#FFFF00` + dourado `#F8E018`
- `design/design-tokens.json`, `design/layout-spec.md`
- Capa em `assets/referencias/capa.png`

---

## Frontend Menu Developer — 🟡 Site G1

### Produzi
- `online/index.html`, `styles.css`, `app.js`
- Dois botões WhatsApp, Instagram, nav de categorias
- Modal com G/GG e pedido nos dois números
- Bloco Wi-Fi + QR amarelo (`npm run wifi-qr`)

---

- Brief, worklog e changelog atualizados para G1
