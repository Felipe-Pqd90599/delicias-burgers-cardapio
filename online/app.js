const EXTRA_CATS = new Set([
  "sanduiches",
  "sanduiches-artesanais",
  "pizzas",
  "pasteis",
  "petiscos",
  "combos",
]);

const REMOVE_CATS = new Set([...EXTRA_CATS, "rodizio"]);
const CART_KEY = "delicias-cart-v1";

const state = {
  menu: null,
  info: null,
  modalItem: null,
  modalCategory: null,
  modalPortion: null,
  modalRemoved: [],
  modalExtras: [],
  modalFries: null,
  modalComment: "",
  modalQty: 1,
  cart: [],
  cartPay: null,
  toastTimer: null,
};

function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function waLink(phone, text) {
  const msg = encodeURIComponent(text || "Olá, vim pelo cardápio da Delícias Burgers.");
  return `https://wa.me/${phone}?text=${msg}`;
}

function formatPhone(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  const local = d.startsWith("55") ? d.slice(2) : d;
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  return phone;
}

function instagramUrl(handle) {
  const user = String(handle || "").replace(/^@/, "");
  return `https://instagram.com/${user}`;
}

function mapsUrl(info) {
  const q = encodeURIComponent(
    `${info.location?.address || ""}, ${info.location?.neighborhood || ""}, ${info.location?.city || ""}-${info.location?.state || ""}`
  );
  return `https://maps.google.com/?q=${q}`;
}

function shopPhone(info) {
  return info?.contact?.whatsapp || "";
}

function paymentMethods() {
  return state.info?.ordering?.paymentMethods || [];
}

function suggestedExtras() {
  return state.info?.ordering?.extras || [];
}

function friesItem() {
  const id = state.info?.ordering?.pricedExtraId;
  return id ? findItem(id)?.item : null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function priceLines(item) {
  if (item.portionOptions?.length) {
    return item.portionOptions
      .map((opt) => `${opt.label} ${formatPrice(opt.price)}`)
      .join(" · ");
  }
  if (item.priceSecondary != null) {
    const a = item.priceLabel ? `${item.priceLabel} ` : "";
    const b = item.priceSecondaryLabel ? `${item.priceSecondaryLabel} ` : "";
    return `${a}${formatPrice(item.price)} · ${b}${formatPrice(item.priceSecondary)}`;
  }
  return formatPrice(item.price);
}

function currentPrice(item, portionKey) {
  if (item.portionOptions?.length) {
    const opt =
      item.portionOptions.find((o) => o.key === portionKey) || item.portionOptions[0];
    return opt.price;
  }
  if (portionKey === "secondary" && item.priceSecondary != null) {
    return item.priceSecondary;
  }
  return item.price;
}

function portionLabel(item, portionKey) {
  if (item.portionOptions?.length) {
    return item.portionOptions.find((o) => o.key === portionKey)?.label || "";
  }
  if (portionKey === "secondary") return item.priceSecondaryLabel || "";
  return item.priceLabel || "";
}

function parseIngredients(description) {
  if (!description) return [];
  return description
    .split(/,|\s\+\s|\se\s/)
    .map((part) => part.replace(/\.$/, "").trim())
    .filter((part) => part.length > 1 && !/^consultar/i.test(part));
}

function friesPriceFor(key) {
  const fries = friesItem();
  if (!fries || !key) return 0;
  return currentPrice(fries, key) || 0;
}

function extraPrice(name) {
  const extra = suggestedExtras().find((item) => item.name === name);
  return Number(extra?.price) || 0;
}

function extrasSum(names) {
  return (names || []).reduce((sum, name) => sum + extraPrice(name), 0);
}

function formatExtra(name) {
  const price = extraPrice(name);
  return price ? `${name} ${formatPrice(price)}` : name;
}

function itemPlusFriesPrice() {
  if (!state.modalItem) return 0;
  return currentPrice(state.modalItem, state.modalPortion) + friesPriceFor(state.modalFries);
}

function lineUnitPrice(line) {
  return (Number(line.unitPrice) || 0) + extrasSum(line.extras);
}

function lineTotal(line) {
  return lineUnitPrice(line) * (line.qty || 1);
}

function cartCount() {
  return state.cart.reduce((sum, line) => sum + (line.qty || 0), 0);
}

function cartTotal() {
  return state.cart.reduce((sum, line) => sum + lineTotal(line), 0);
}

function extraAlreadyInItem(item, extraName) {
  return (item.description || "").toLowerCase().includes(extraName.toLowerCase());
}

function lineKey(line) {
  return JSON.stringify({
    itemId: line.itemId,
    portionKey: line.portionKey,
    fries: line.fries,
    removed: [...(line.removed || [])].sort(),
    extras: [...(line.extras || [])].sort(),
    comment: line.comment || "",
  });
}

function loadCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    state.cart = Array.isArray(parsed) ? parsed : [];
  } catch {
    state.cart = [];
  }
}

function saveCart() {
  sessionStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function lockBody() {
  const modalOpen = !document.getElementById("modal").hidden;
  const cartOpen = !document.getElementById("cart").hidden;
  document.body.style.overflow = modalOpen || cartOpen ? "hidden" : "";
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function buildCartMessage() {
  const lines = ["Olá, vim pelo cardápio da *Delícias Burgers*.", "", "*Pedido:*"];
  state.cart.forEach((line, index) => {
    const size = line.portionLabel ? ` (${line.portionLabel})` : "";
    lines.push(
      `${index + 1}. ${line.qty}x ${line.name}${size} — ${formatPrice(lineTotal(line))}`
    );
    if (line.removed?.length) {
      lines.push(`   Tirar: ${line.removed.join(", ")}`);
    }
    const extras = [];
    if (line.fries) {
      extras.push(`batata frita ${line.fries} ${formatPrice(line.friesPrice || 0)}`);
    }
    (line.extras || []).forEach((name) => extras.push(formatExtra(name)));
    if (extras.length) {
      lines.push(`   Adicionais: ${extras.join("; ")}`);
    }
    if (line.comment) {
      lines.push(`   Obs.: ${line.comment}`);
    }
  });
  lines.push("", `*Total (cardápio):* ${formatPrice(cartTotal())}`);
  const pay = paymentMethods().find((p) => p.key === state.cartPay);
  lines.push(`*Pagamento:* ${pay ? pay.label : "não informado"}`);
  lines.push("", "Por favor, confirmem o pedido e o valor final.");
  return lines.join("\n");
}

function renderHero(info) {
  const place = document.getElementById("hero-place");
  const loc = info.location || {};
  place.textContent = `${loc.address} · ${loc.neighborhood}, ${loc.city}-${loc.state}`;

  const actions = document.getElementById("hero-actions");
  const ig = info.contact?.instagram || "";
  const phone = shopPhone(info);
  actions.innerHTML = phone
    ? `<a class="btn btn--wa" href="${waLink(phone)}" target="_blank" rel="noopener">WhatsApp ${formatPhone(phone)}</a>`
    : "";
  if (ig) {
    actions.insertAdjacentHTML(
      "beforeend",
      `<a class="btn btn--ig" href="${instagramUrl(ig)}" target="_blank" rel="noopener">${ig}</a>`
    );
  }
  actions.insertAdjacentHTML(
    "beforeend",
    `<a class="btn btn--ig" href="cardapio-delicias-burgers.pdf" target="_blank" rel="noopener">Baixar PDF</a>`
  );
}

function renderWifi(info) {
  const box = document.getElementById("wifi");
  const wifi = info.wifi;
  if (!wifi?.password) return;
  box.hidden = false;
  document.getElementById("wifi-ssid").textContent = wifi.ssid || "";
  document.getElementById("wifi-password").textContent = wifi.password;
  const qr = document.getElementById("wifi-qr");
  qr.src = wifi.qrImage || "assets/wifi-qr.png";
}

function renderNav(menu) {
  const nav = document.getElementById("cat-nav");
  nav.innerHTML = menu.categories
    .map((cat) => `<a href="#cat-${cat.id}">${cat.name}</a>`)
    .join("");
}

function catImage(cat) {
  if (!cat.image) return "";
  return `<img class="section__banner" src="assets/${cat.image}" alt="${cat.name}" />`;
}

function renderFeatured(menu) {
  const cat = menu.categories.find((c) => c.featured);
  const item = cat?.items?.[0];
  const root = document.getElementById("featured-root");
  if (!cat || !item) {
    root.innerHTML = "";
    return;
  }
  root.innerHTML = `
    <section class="featured" id="cat-${cat.id}">
      ${catImage(cat)}
      <div class="featured__body">
        <p class="featured__kicker">Carro-chefe</p>
        <h2>${item.name}</h2>
        <p class="featured__desc">${item.description}</p>
        <p class="featured__note">${cat.note || ""}</p>
        <p class="featured__price">${priceLines(item)}</p>
        <button class="btn btn--gold" type="button" data-id="${item.id}">Quero o rodízio</button>
      </div>
    </section>`;
  root.querySelector("[data-id]").addEventListener("click", () => openModal(item.id));
}

function renderMenu(menu) {
  const root = document.getElementById("menu");
  root.innerHTML = menu.categories
    .filter((cat) => !cat.featured)
    .map((cat) => {
      const note = cat.note ? `<p class="section__note">${cat.note}</p>` : "";
      const items = (cat.items || [])
        .map(
          (item) => `
        <button class="item" type="button" data-id="${item.id}">
          <h3 class="item__name">${item.name}</h3>
          <div class="item__price">${priceLines(item)}</div>
          ${item.description ? `<p class="item__desc">${item.description}</p>` : ""}
        </button>`
        )
        .join("");
      return `<section class="section" id="cat-${cat.id}">
        ${catImage(cat)}
        <h2 class="section__title">${cat.name}</h2>
        ${note}
        ${items}
      </section>`;
    })
    .join("");

  root.querySelectorAll(".item").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.id));
  });
}

function findItem(id) {
  for (const cat of state.menu.categories) {
    const item = (cat.items || []).find((i) => i.id === id);
    if (item) return { item, category: cat };
  }
  return null;
}

function openModal(id) {
  const found = findItem(id);
  if (!found) return;
  state.modalItem = found.item;
  state.modalCategory = found.category;
  state.modalPortion = found.item.portionOptions?.[0]?.key || "primary";
  state.modalRemoved = [];
  state.modalExtras = [];
  state.modalFries = null;
  state.modalComment = "";
  state.modalQty = 1;
  document.getElementById("modal-title").textContent = found.item.name;
  document.getElementById("modal-desc").textContent = found.item.description || "";
  document.getElementById("modal-comment").value = "";
  renderPortions(found.item);
  renderRemove(found.item, found.category);
  renderExtras(found.item, found.category);
  renderQty();
  renderModalPrice();
  document.getElementById("modal").hidden = false;
  lockBody();
}

function renderPortions(item) {
  const box = document.getElementById("modal-portions");
  const opts = [];
  if (item.portionOptions?.length) {
    item.portionOptions.forEach((opt) => opts.push(opt));
  } else if (item.priceSecondary != null) {
    opts.push({ key: "primary", label: item.priceLabel || "opção 1" });
    opts.push({ key: "secondary", label: item.priceSecondaryLabel || "opção 2" });
  }
  box.innerHTML = opts
    .map(
      (opt) =>
        `<button type="button" data-key="${opt.key}" class="${opt.key === state.modalPortion ? "is-on" : ""}">${opt.label}</button>`
    )
    .join("");
  box.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.modalPortion = btn.dataset.key;
      renderPortions(item);
      renderModalPrice();
    });
  });
}

function renderRemove(item, category) {
  const box = document.getElementById("modal-remove");
  const ingredients = parseIngredients(item.description);
  if (!REMOVE_CATS.has(category?.id) || ingredients.length < 2) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  box.hidden = false;
  box.innerHTML = `
    <span class="modal__label">Tirar do pedido</span>
    <p class="modal__help">Toque no que não quer no lanche</p>
    <div class="modal__chips">
      ${ingredients
        .map((ing) => {
          const off = state.modalRemoved.includes(ing);
          return `<button type="button" class="modal__chip${off ? " is-off" : ""}" data-ing="${escapeHtml(ing)}" aria-pressed="${off}">${escapeHtml(ing)}</button>`;
        })
        .join("")}
    </div>`;
  box.querySelectorAll("[data-ing]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.ing;
      if (state.modalRemoved.includes(name)) {
        state.modalRemoved = state.modalRemoved.filter((x) => x !== name);
      } else {
        state.modalRemoved = [...state.modalRemoved, name];
      }
      renderRemove(item, category);
    });
  });
}

function renderExtras(item, category) {
  const box = document.getElementById("modal-extras");
  const fries = friesItem();
  const showFries = Boolean(fries) && item.id !== fries.id;
  const extras = suggestedExtras().filter((extra) => !extraAlreadyInItem(item, extra.name));
  if (!EXTRA_CATS.has(category?.id) || (!showFries && extras.length === 0)) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  box.hidden = false;
  const friesHtml =
    showFries && fries.portionOptions
      ? `<p class="modal__help">Batata frita (preço do cardápio)</p>
         <div class="modal__portions" id="modal-fries">
           ${fries.portionOptions
             .map(
               (opt) =>
                 `<button type="button" data-fries="${opt.key}" class="${opt.key === state.modalFries ? "is-on" : ""}">${opt.label} ${formatPrice(opt.price)}</button>`
             )
             .join("")}
         </div>`
      : "";
  const extraHtml = extras.length
    ? `<p class="modal__help">Quer acrescentar algo? ${state.info.ordering?.extrasNote || ""}</p>
       <div class="modal__chips">
         ${extras
           .map((extra) => {
             const on = state.modalExtras.includes(extra.name);
             const price = extra.price ? ` ${formatPrice(extra.price)}` : "";
             return `<button type="button" class="modal__chip${on ? " is-on" : ""}" data-extra="${escapeHtml(extra.name)}" aria-pressed="${on}">${escapeHtml(extra.name)}${price}</button>`;
           })
           .join("")}
       </div>`
    : "";
  box.innerHTML = `<span class="modal__label">Adicionais</span>${friesHtml}${extraHtml}`;
  box.querySelectorAll("[data-fries]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.modalFries = state.modalFries === btn.dataset.fries ? null : btn.dataset.fries;
      renderExtras(item, category);
      renderModalPrice();
    });
  });
  box.querySelectorAll("[data-extra]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.extra;
      if (state.modalExtras.includes(name)) {
        state.modalExtras = state.modalExtras.filter((x) => x !== name);
      } else {
        state.modalExtras = [...state.modalExtras, name];
      }
      renderExtras(item, category);
      renderModalPrice();
    });
  });
}

function renderQty() {
  const box = document.getElementById("modal-qty-box");
  box.innerHTML = `
    <span class="modal__label">Quantidade</span>
    <div class="modal__qty">
      <button class="qty-btn" type="button" data-delta="-1" aria-label="Diminuir">−</button>
      <span class="qty-value">${state.modalQty}</span>
      <button class="qty-btn" type="button" data-delta="1" aria-label="Aumentar">+</button>
    </div>`;
  box.querySelectorAll("[data-delta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = state.modalQty + Number(btn.dataset.delta);
      state.modalQty = Math.min(20, Math.max(1, next));
      renderQty();
      renderModalPrice();
    });
  });
}

function modalUnitPrice() {
  return itemPlusFriesPrice() + extrasSum(state.modalExtras);
}

function renderModalPrice() {
  const qty = state.modalQty || 1;
  document.getElementById("modal-price").textContent = formatPrice(modalUnitPrice() * qty);
  const hint = document.getElementById("modal-hint");
  hint.textContent = "O item vai para o carrinho. Você pode pedir mais coisas antes de enviar.";
  document.getElementById("modal-wa").innerHTML =
    `<button class="btn btn--gold" type="button" id="add-to-cart">Adicionar ao carrinho</button>`;
  document.getElementById("add-to-cart").addEventListener("click", addCurrentToCart);
}

function addCurrentToCart() {
  const item = state.modalItem;
  if (!item) return;
  const fries = friesItem();
  const friesOpt = fries?.portionOptions?.find((opt) => opt.key === state.modalFries);
  const line = {
    itemId: item.id,
    name: item.name,
    portionKey: state.modalPortion,
    portionLabel: portionLabel(item, state.modalPortion),
    qty: state.modalQty || 1,
    removed: [...state.modalRemoved],
    extras: [...state.modalExtras],
    fries: state.modalFries,
    friesPrice: friesPriceFor(state.modalFries),
    friesLabel: friesOpt ? friesOpt.label : "",
    comment: state.modalComment.trim(),
    unitPrice: itemPlusFriesPrice(),
  };
  const key = lineKey(line);
  const existing = state.cart.find((row) => lineKey(row) === key);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + line.qty);
  } else {
    state.cart.push(line);
  }
  saveCart();
  renderCart();
  closeModal();
  showToast("Adicionado ao carrinho");
}

function closeModal() {
  document.getElementById("modal").hidden = true;
  state.modalItem = null;
  state.modalCategory = null;
  lockBody();
}

function openCart() {
  document.getElementById("cart").hidden = false;
  renderCart();
  lockBody();
}

function closeCart() {
  document.getElementById("cart").hidden = true;
  lockBody();
}

function renderCartFab() {
  document.getElementById("cart-count").textContent = String(cartCount());
}

function renderCartPay() {
  const box = document.getElementById("cart-pay");
  if (!state.cart.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `
    <span class="modal__label">Pagamento</span>
    <p class="modal__help">Escolha como vai pagar o pedido inteiro</p>
    <div class="modal__portions">
      ${paymentMethods()
        .map(
          (method) =>
            `<button type="button" data-pay="${method.key}" class="${method.key === state.cartPay ? "is-on" : ""}">${method.label}</button>`
        )
        .join("")}
    </div>`;
  box.querySelectorAll("[data-pay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.cartPay = btn.dataset.pay;
      renderCart();
    });
  });
}

function renderCart() {
  renderCartFab();
  const list = document.getElementById("cart-list");
  if (!state.cart.length) {
    list.innerHTML = `<p class="cart-empty">Seu carrinho está vazio. Escolha no cardápio.</p>`;
  } else {
    list.innerHTML = state.cart
      .map((line, index) => {
        const size = line.portionLabel ? ` · ${escapeHtml(line.portionLabel)}` : "";
        const bits = [];
        if (line.removed?.length) bits.push(`Tirar: ${escapeHtml(line.removed.join(", "))}`);
        const extras = [];
        if (line.fries) extras.push(`batata frita ${escapeHtml(line.fries)}`);
        (line.extras || []).forEach((name) => extras.push(escapeHtml(formatExtra(name))));
        if (extras.length) bits.push(`Adicionais: ${extras.join(", ")}`);
        if (line.comment) bits.push(`Obs.: ${escapeHtml(line.comment)}`);
        return `<article class="cart-line">
          <div>
            <p class="cart-line__name">${escapeHtml(line.name)}${size}</p>
            ${bits.length ? `<p class="cart-line__meta">${bits.join(" · ")}</p>` : ""}
          </div>
          <p class="cart-line__price">${formatPrice(lineTotal(line))}</p>
          <div class="cart-line__tools">
            <button class="qty-btn" type="button" data-line-qty="${index}" data-delta="-1" aria-label="Diminuir">−</button>
            <span class="qty-value">${line.qty}</span>
            <button class="qty-btn" type="button" data-line-qty="${index}" data-delta="1" aria-label="Aumentar">+</button>
            <button class="cart-remove" type="button" data-remove="${index}">Remover</button>
          </div>
        </article>`;
      })
      .join("");
    list.querySelectorAll("[data-line-qty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.lineQty);
        const line = state.cart[index];
        if (!line) return;
        line.qty = Math.min(20, Math.max(0, line.qty + Number(btn.dataset.delta)));
        if (line.qty === 0) state.cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });
    list.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.cart.splice(Number(btn.dataset.remove), 1);
        saveCart();
        renderCart();
      });
    });
  }

  renderCartPay();
  const totalEl = document.getElementById("cart-total");
  const hint = document.getElementById("cart-hint");
  const actions = document.getElementById("cart-actions");
  const phone = shopPhone(state.info);
  const ready = Boolean(state.cart.length && state.cartPay && phone);

  if (!state.cart.length) {
    totalEl.textContent = "";
    hint.textContent = "";
    actions.innerHTML = `<button class="btn btn--ghost" type="button" data-cart-close>Continuar escolhendo</button>`;
  } else {
    totalEl.textContent = formatPrice(cartTotal());
    hint.textContent = ready
      ? "A mensagem vai com todos os itens do carrinho."
      : "Escolha a forma de pagamento para enviar o pedido.";
    const href = ready ? waLink(phone, buildCartMessage()) : "#";
    actions.innerHTML = `
      <a class="btn btn--wa${ready ? "" : " is-disabled"}" href="${href}" target="_blank" rel="noopener" ${ready ? "" : 'aria-disabled="true"'}>Enviar pedido no WhatsApp</a>
      <button class="btn btn--ghost" type="button" data-cart-close>Continuar escolhendo</button>`;
    actions.querySelector("a").addEventListener("click", (event) => {
      if (!ready) event.preventDefault();
    });
  }
}

function renderFooter(info) {
  const loc = info.location || {};
  const ig = info.contact?.instagram || "";
  const phone = shopPhone(info);
  const promo = (info.policies?.birthdayRodizio || []).map((t) => `<p>${t}</p>`).join("");
  document.getElementById("footer").innerHTML = `
    <p><strong>${info.name}</strong></p>
    <p><a href="${mapsUrl(info)}" target="_blank" rel="noopener">${loc.address}</a></p>
    <p>${loc.neighborhood}, ${loc.city}-${loc.state}</p>
    <div class="footer__wa">
      ${
        phone
          ? `<a class="btn btn--wa" href="${waLink(phone)}" target="_blank" rel="noopener">${formatPhone(phone)}</a>`
          : ""
      }
    </div>
    <p><a href="${instagramUrl(ig)}" target="_blank" rel="noopener">${ig}</a></p>
    <p>Rodízio das 18h às 23:30 · ${info.hours?.rodizioWeekday || ""} · ${info.hours?.rodizioWeekend || ""}</p>
    ${promo}
    <small>Cardápio digital Delícias Burgers</small>
  `;
}

function watchNav() {
  const links = [...document.querySelectorAll("#cat-nav a")];
  const sections = [...document.querySelectorAll(".featured, .section")];
  const onScroll = () => {
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 90) current = section.id;
    }
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

async function boot() {
  const [menu, info] = await Promise.all([
    fetch("data/menu-data.json").then((r) => r.json()),
    fetch("data/restaurant-info.json").then((r) => r.json()),
  ]);
  state.menu = menu;
  state.info = info;
  loadCart();
  renderHero(info);
  renderFeatured(menu);
  renderWifi(info);
  renderNav(menu);
  renderMenu(menu);
  renderFooter(info);
  renderCart();
  watchNav();

  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target.dataset.close !== undefined) closeModal();
  });
  document.getElementById("cart").addEventListener("click", (event) => {
    if (event.target.closest("[data-cart-close]")) closeCart();
  });
  document.getElementById("cart-fab").addEventListener("click", openCart);
  document.getElementById("modal-comment").addEventListener("input", (event) => {
    state.modalComment = event.target.value;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!document.getElementById("cart").hidden) closeCart();
    else closeModal();
  });
}

boot().catch((err) => {
  document.getElementById("menu").innerHTML =
    "<p>Não foi possível carregar o cardápio. Abra o site por um servidor local ou GitHub Pages.</p>";
  console.error(err);
});
