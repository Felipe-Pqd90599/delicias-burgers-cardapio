# Como editar o cardápio (incluindo fotos)

Ainda no Gate G0: não há site nem PDF. Quando existirem, o fluxo será:

## Trocar uma foto

1. Coloque a nova foto em `assets/fotos/` com o **mesmo nome** do item.
   - Ex.: item `burger-classic` → arquivo `burger-classic.jpg`
2. Rode os scripts de sync/PDF quando eles existirem.

## Editar preço ou texto

1. Abra `data/menu-data.json`
2. Altere `price`, `name` ou `description`
3. Não edite produtos direto no HTML

## Convenção de nomes

| Item no JSON (`id`) | Arquivo de foto |
|---------------------|-----------------|
| `burger-classic` | `burger-classic.jpg` |
