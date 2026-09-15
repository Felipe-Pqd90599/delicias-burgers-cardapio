# Delícias Burgers — Cardápio

Cardápio online + PDF com **fonte única de dados** em `data/menu-data.json`.

Projeto **separado** do Prainha Rooftop. Mesma forma de trabalhar (orquestrador + agentes), pasta e GitHub próprios.

## Status

**Gate G0** — estrutura criada. Conteúdo, visual e site ainda não começaram.

Quando existir o site:

https://Felipe-Pqd90599.github.io/delicias-burgers-cardapio/

## Estrutura

```
data/menu-data.json       → itens, preços, categorias (fonte principal)
data/restaurant-info.json → nome, contato, links
design/design-tokens.json → cores e tipografia (a definir)
online/                   → site publicado (GitHub Pages)
assets/fotos/             → fotos dos itens ({id}.jpg)
assets/referencias/       → PDF/fotos oficiais do cliente
docs/                     → guias, agentes, QA
.cursor/agents/           → agentes especializados
.cursor/skills/           → orquestrador
```

## Comandos

```bash
npm run qa-check    # valida JSON e fotos antes do deploy
```

Novos scripts (sync, PDF, fotos) entram conforme o projeto avançar.

## Orquestração de agentes

Roteamento: `docs/AGENT-ROUTING.md` · índice: `docs/AGENTS-INDEX.md`

Os 7 agentes + orquestrador são os mesmos papéis do cardápio Prainha. Funções novas só quando o projeto pedir (ex.: Image Production Specialist).
