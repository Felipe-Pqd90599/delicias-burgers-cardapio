# Layout spec — Delícias Burgers

**Status:** G3 rascunho a partir do PDF oficial (Gate ainda não fechado no site).  
**Fonte:** `assets/referencias/cardapio-oficial-delicias-burgers.pdf` + `capa.png`

## Paleta (oficial)

| Token | Hex | Onde no PDF |
|-------|-----|-------------|
| Preto / fundo | `#0A0A0A` | capa e madeira das páginas internas |
| Superfície | `#1A1A1A` | textura de madeira |
| Amarelo de preço | `#FFFF00` | fill RGB dos valores (R$6, R$8…) |
| Dourado da capa | `#F8E018` | título CARDÁPIO, splash, aro do logo |
| Texto | `#FFFFFF` | nomes dos itens |

## Hierarquia visual

1. **Hero** — logo circular (burger + DELÍCIAS + script Burgers), fundo preto com splash dourado
2. **Título de seção** — “CARDÁPIO” em dourado/outline; categoria em branco (SANDUÍCHES, PIZZAS…)
3. **Item** — nome branco em caixa alta; preço amarelo à direita; descrição em serif claro
4. **Rodapé / Wi-Fi** — senha visível + QR Code (padrão `WIFI:`) para o cliente conectar sem digitar

## Site (mobile-first)

- Uma coluna (o PDF impresso tem duas; no celular isso não cabe)
- Nav sticky com as categorias do JSON
- Preço sempre amarelo; fundo preto
- Pizzas: mostrar G e GG no mesmo card
- Artesanais: faixa com a nota “acompanha batata frita”

## Não fazer

- Paleta bege/turquesa de outro projeto
- Amarelo “hamburgueria genérica” diferente de `#FFFF00` / `#F8E018` sem aprovação
