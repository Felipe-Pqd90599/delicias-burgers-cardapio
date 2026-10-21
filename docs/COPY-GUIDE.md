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
| Consultar | Só no sorvete e na fatia do combo kids. Milk shake e sucos usam a lista de sabores do JSON |
| Pedido pizza | Sempre “Pizza de {sabor} G/GG”, nunca só o sabor |
| Preços | Só no JSON |

## Institucional (capa)

- Av. Doutor João Medeiros Filho, 3030
- WhatsApp **somente (84) 98669-4702**
- Instagram @deliciasburgerszonanorte
- Rodízio de pizza todos os dias das 18h às 23:30

## Pedido no WhatsApp

O cliente monta o **carrinho** e só então envia. Tom direto, sem redigir:

```
Olá, vim pelo cardápio do *Delícias Burgers*.

*Pedido:*
1. 2x Delícias Especial — R$ 16,00
   Tirar: ovo
   Adicionais: bacon R$ 6,00; batata frita M R$ 7,00
   Obs.: Sem cebola demais
2. 1x Pizza de Muçarela G — R$ 35,00
3. 1x Milk shake 400ml de chocolate — R$ 14,00
4. 1x Suco de cajá 400ml — R$ 7,00
5. 1x Açaí 300 ml — R$ 12,00
   Acompanhamentos: leite condensado, granola, banana, coco ralado

*Total (cardápio):* R$ 51,00
*Pagamento:* PIX

*Entrega:*
Nome: Maria
CEP: 59100-000
Avenida Exemplo, 100 — apto 2
Zona Norte, Natal-RN
Ref.: portão azul

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

Omitir linhas Tirar / Adicionais / Acompanhamentos / Obs. se o cliente não usou. Pagamento e endereço de entrega obrigatórios para fechar o pedido. Adicionais entram com o preço da tabela da loja. Açaí: até 4 acompanhamentos. Sorvete: até 2, mesma lista. Mensagem: “cardápio do Delícias Burgers”.
