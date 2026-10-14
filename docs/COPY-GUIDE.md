# Copy Guide — Delícias Burgers

**Fonte:** PDF oficial  
**Gate G2** — textos do cardápio, sem campanha extra

## Tom de voz

- **Direto** — nomes em caixa do cardápio, ingredientes objetivos
- **Carro-chefe:** rodízio (pizzas, arroz cremoso, parmegiana, lasanha, fritas, coxinha e refri)
- **Sem inventar** ingredientes além do que o Felipe e o PDF informaram

## Padrões

| Elemento | Regra |
|----------|--------|
| Nome | Como no cardápio (Delícias Burguer, Delícias da Casa) |
| Descrição | Ingredientes separados por vírgula |
| Consultar | Manter “consultar sabores” em suco, milk-shake, sorvete, fatia do combo kids |
| Preços | Só no JSON |

## Institucional (capa)

- Av. Doutor João Medeiros Filho, 3030
- WhatsApp **somente (84) 98669-4702**
- Instagram @deliciasburgerszonanorte
- Rodízio de pizza todos os dias das 18h às 23:30

## Pedido no WhatsApp

O cliente monta o **carrinho** e só então envia. Tom direto, sem redigir:

```
Olá, vim pelo cardápio da *Delícias Burgers*.

*Pedido:*
1. 2x Delícias Especial — R$ 16,00
   Tirar: ovo
   Adicionais: bacon R$ 6,00; batata frita M R$ 7,00
   Obs.: Sem cebola demais
2. 1x Muçarela (G) — R$ 35,00

*Total (cardápio):* R$ 51,00
*Pagamento:* PIX

Por favor, confirmem o pedido e o valor final.
```

| Onde | Texto |
|------|--------|
| Modal | Adicionar ao carrinho |
| Toast | Adicionado ao carrinho |
| FAB | Carrinho |
| Carrinho vazio | Seu carrinho está vazio. Escolha no cardápio. |
| Continuar | Continuar escolhendo |
| Pagamento | PIX · Dinheiro · Cartão de crédito · Cartão de débito (só no carrinho) |
| Botão final | Enviar pedido no WhatsApp |

Omitir linhas Tirar / Adicionais / Obs. se o cliente não usou. Pagamento obrigatório só para fechar o pedido. Adicionais entram com o preço da tabela da loja.
