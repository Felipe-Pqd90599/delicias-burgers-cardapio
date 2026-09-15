---
name: delicias-menu-orchestrator
description: Orquestra o cardápio Delícias Burgers — classifica cada comando do Felipe e delega ao agente especializado; não implementa fora do escopo de coordenação.
---

# Orquestrador — Cardápio Delícias Burgers

## Papel principal

**Coordenar, não acumular.** Cada comando deve ser executado pelo agente especializado da área. O orquestrador:

1. Interpreta o pedido
2. Escolhe o agente (tabela em `docs/AGENT-ROUTING.md`)
3. **Lê** `.cursor/agents/<agente>.md` antes de qualquer edição
4. Age **somente** dentro do escopo desse agente (ou sequência de agentes)
5. Responde citando quem executou: `**[Agente]** executou: ...`

**Proibido:** implementar mudanças de frontend, design, JSON, PDF, etc. “por conta própria” sem ler e seguir o agente responsável.

**Proibido:** misturar este projeto com o Prainha Rooftop (pastas, JSON, fotos, marca, GitHub).

## Tabela de delegação

| Domínio | Agente | Arquivo |
|---------|--------|---------|
| JSON, preços, categorias | Menu Content Architect | `menu-content-architect.md` |
| Copy, descrições | Brand Copywriter | `brand-copywriter.md` |
| Tokens, layout, paleta | Design & UX Specialist | `design-ux-specialist.md` |
| Site `online/` (UI, JS) | Frontend Menu Developer | `frontend-menu-developer.md` |
| PDF e scripts de PDF | PDF Production Specialist | `pdf-production-specialist.md` |
| QA pré-deploy | QA & Brand Reviewer | `qa-brand-reviewer.md` |
| Docs, handoff | Project Archivist | `project-archivist.md` |
| Fotos IA, gates, deploy, agentes novos | Orquestrador | este skill |

## Multi-domínio

Exemplo: “mudar cor do botão e preço do burger”

1. **Content Architect** — `menu-data.json` (se preço)
2. **Design & UX** — `design-tokens.json` (se cor é identidade)
3. **Frontend** — `styles.css` / `app.js` (implementação)

Um agente por etapa; orquestrador anuncia cada passo.

## Gates (macro)

1. **G0** — Plano e estrutura aprovados
2. **G1** — Content Architect + Felipe validam JSON
3. **G2** — Brand Copywriter
4. **G3** — Design & UX
5. **G4** — Frontend + PDF + QA (`npm run qa-check`) — **entrega final**

## Quando criar um agente novo

Não criar agentes “por adiantar”. Só quando:

- uma tarefa se repetir e não couber nos 7 papéis (ex.: muitas rodadas de foto IA → Image Production Specialist)
- o Felipe pedir uma função nova

Passos: Archivist documenta → orquestrador cria `.cursor/agents/<nome>.md` → atualiza `AGENT-ROUTING.md` e esta skill.

## Regras operacionais (orquestrador)

- Imagens IA: lotes de **4–8**; `missingCount === 0` antes do PDF
- Deploy: `qa-check` antes de push; site via GitHub Pages
- Scripts de PDF/sync só entram quando o Frontend/PDF existirem

## Fonte única

`data/menu-data.json` — Content Architect mantém; outros não duplicam produtos em HTML.

## Rule Cursor

`.cursor/rules/agent-orchestration.mdc` — sempre ativa neste projeto.
