# Changelog — Menu Content

## 2026-10-21 — Entrega + acompanhamentos do sorvete

- Sorvete usa a mesma lista de acompanhamentos do açaí, no máximo **2** (como no cardápio: 2 bolas + 2 acompanhamentos).
- Pedido no WhatsApp pede endereço de entrega (CEP, rua, número, bairro, etc.) antes de enviar.
- Mensagem: “cardápio **do** Delícias Burgers”.

## 2026-10-14 — Acompanhamentos do açaí

Lista do Felipe (máximo 4): leite condensado, leite em pó, granola, cobertura de morango, cobertura de chocolate, ovomaltine, confete, granulado de chocolate, coco ralado, amendoim triturado, banana e abacaxi.

## 2026-10-14 — Sabores no pedido (pizza, milk shake, suco)

- Pizza no WhatsApp/carrinho: **Pizza de {sabor} G/GG** (ex.: Pizza de Frango G).
- Milk shake: Chocolate, Morango, Ovomaltine (Felipe).
- Suco e suco ao leite: Abacaxi, Acerola, Cajá, Caju, Uva, Morango, Goiaba, Manga, Mangaba, Graviola (Felipe).

## 2026-10-14 — Preços dos adicionais

Felipe aprovou a tabela sugerida a partir das diferenças do cardápio oficial:

- Ovo, salsicha, presunto R$ 2
- Cheddar, coalho, catupiry, calabresa R$ 3
- Frango R$ 4 · Bacon R$ 6 · Carne de sol R$ 10 · Camarão R$ 12
- Batata frita segue P/M/G R$ 5 / 7 / 9

## 2026-10-14 — Carrinho antes do WhatsApp

- Itens vão para o **carrinho** (com tirar / adicionais / observação / quantidade).
- Pagamento e envio no WhatsApp só na finalização do carrinho, com o pedido completo.
- Sem preço novo: totais usam o JSON; adicionais sem preço continuam “confirmar valor”.

## 2026-10-13 — Pedido no WhatsApp + um único número

- WhatsApp da loja **somente (84) 98669-4702**. O 5442 saiu do JSON e do site.
- Bloco `ordering` em `restaurant-info.json`: PIX, dinheiro, crédito e débito.
- Adicionais sugeridos = ingredientes que já existem no cardápio (ovo, bacon, cheddar, catupiry…). **Sem preço inventado**; a loja confirma no WhatsApp.
- Extra com preço oficial: **Adicional de batata frita** P/M/G (já estava no JSON).

## 2026-09-15 — Rodízio como carro-chefe

- Categoria **Rodízio** no topo, fora da lista de pizzas à la carte
- Inclui: pizzas salgadas e doces, arroz cremoso, parmegiana, lasanha, batata frita, coxinha e **refrigerante**
- Preços (Felipe): **R$ 34,99** terça a quinta · **R$ 38,99** sexta a domingo · 18h–23:30
- PDF antigo tinha R$ 37,90 único; vale o valor informado pelo Felipe
- Segunda-feira ainda não informada

## 2026-09-15 — G1 aprovado pelo Felipe

- Preços confirmados (próxima revisão prevista só no ano que vem)
- Endereço confirmado: Av. Doutor João Medeiros Filho, 3030 — Zona Norte, Natal-RN
- Dois WhatsApp: (84) 98669-4702 e (84) 98620-5442 (o primeiro do PDF `99669` era leitura errada; vale o número informado pelo Felipe)
- Senha do Wi-Fi no site + QR Code (`WIFI:T:WPA;S:…`)
- Nome da rede no QR: **Delicias Burgers** (ajustar se o roteador tiver outro SSID)

## 2026-09-15 — G1 extraído do PDF oficial

Fonte: `assets/referencias/cardapio-oficial-delicias-burgers.pdf` (8 páginas)

- **89 itens** em **8 categorias**
- Contatos: (84) 99669-4702, (84) 98620-5442, @deliciasburgerszonanorte
- Endereço: Av. Doutor João Medeiros Filho, 3030
- Rodízio de pizza R$ 37,90 (18h–23:30) + promoção de aniversariante
- Pizzas com porções **G / GG**; petiscos **M / G**; açaí **200 / 300 / 500 ml**

## Normalizações aplicadas

- Preços numéricos (sem R$)
- `CATIPIRY` do PDF → **Catupiry**
- `SERTANEJOR$20` → **Delícias Sertanejo** R$ 20
- `BACON A MODA` → **Bacon à Moda**
- Petiscos e combos, que no PDF estão na mesma página, viraram duas categorias no JSON (mesmos itens e preços)
- Grafia **Burguer** mantida como no PDF

## Lacunas em aberto

1. **Horário** além do rodízio (almoço / entrega / segunda-feira) — não informado.
2. **SSID do Wi-Fi** — QR gerado com rede `Delicias Burgers`; confirmar o nome real da rede.
