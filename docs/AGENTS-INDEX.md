# Índice de agentes — Delícias Burgers Cardápio

**Total:** 7 agentes especializados + 1 orquestrador (skill)

Este projeto reutiliza os **mesmos papéis** do cardápio Prainha, em arquivos **deste repositório**. Não compartilham pasta, GitHub nem conteúdo.

---

## Relação agente → função → entregas

| # | Agente | Função no projeto | Entregas principais | Status |
|---|--------|-------------------|---------------------|--------|
| 0 | **Orquestrador** | Gates, delegação, deploy, imagens IA em lotes | Estrutura do repo, GitHub, coordenação | 🟡 G0 — estrutura pronta |
| 1 | **Menu Content Architect** | Estrutura JSON: categorias, preços, ids | `menu-data.json`, `restaurant-info.json`, `CHANGELOG-content.md` | ⏳ Aguardando material |
| 2 | **Brand Copywriter** | Tom de voz, descrições comerciais | `COPY-GUIDE.md`, descrições no JSON | ⏳ Depois do G1 |
| 3 | **Design & UX Specialist** | Paleta, layout mobile, consistência visual | `design-tokens.json`, `layout-spec.md` | ⏳ Aguardando referências |
| 4 | **Frontend Menu Developer** | Site online responsivo, WhatsApp, nav | `online/index.html`, `styles.css`, `app.js` | ⏳ Depois do G3 |
| 5 | **PDF Production Specialist** | PDF regenerável alinhado ao JSON | `print.html`, scripts PDF | ⏳ Quando o site existir |
| 6 | **QA & Brand Reviewer** | Checklist preço/copy/mobile/PDF antes do deploy | `QA-REPORT.md`, `scripts/qa-check.js` | 🟡 Script base criado |
| 7 | **Project Archivist** | Worklog, handoff, guias | `AGENT-WORKLOG.md`, `PROJECT-HANDOFF.md`, `EDIT-GUIDE.md` | 🟡 Docs iniciais |

---

## Novos agentes?

**Não agora.** Os 7 + orquestrador cobrem um cardápio online + PDF.

Crie um agente novo **só quando** uma função se repetir e não couber nesses papéis. Candidato natural:

- **Image Production Specialist** — se houver muitas rodadas de fotos IA

Como criar: orquestrador escreve `.cursor/agents/<nome>.md` → Archivist atualiza este índice e `AGENT-ROUTING.md`.

---

## Onde ler cada definição

```
.cursor/agents/menu-content-architect.md
.cursor/agents/brand-copywriter.md
.cursor/agents/design-ux-specialist.md
.cursor/agents/frontend-menu-developer.md
.cursor/agents/pdf-production-specialist.md
.cursor/agents/qa-brand-reviewer.md
.cursor/agents/project-archivist.md
.cursor/skills/delicias-menu-orchestrator/SKILL.md
```
