const state = {
  menu: null,
  info: null,
  modalItem: null,
  modalPortion: null,
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

function orderText(item, portionKey) {
  const extra = portionLabel(item, portionKey);
  const size = extra ? ` (${extra})` : "";
  return `Olá, quero pedir *${item.name}*${size} — ${formatPrice(currentPrice(item, portionKey))}`;
}

function phones(info) {
  return [info.contact?.whatsapp, info.contact?.whatsappSecondary].filter(Boolean);
}

function renderHero(info) {
  const place = document.getElementById("hero-place");
  const loc = info.location || {};
  place.textContent = `${loc.address} · ${loc.neighborhood}, ${loc.city}-${loc.state}`;

  const actions = document.getElementById("hero-actions");
  const ig = info.contact?.instagram || "";
  actions.innerHTML = phones(info)
    .map(
      (phone) =>
        `<a class="btn btn--wa" href="${waLink(phone)}" target="_blank" rel="noopener">WhatsApp ${formatPhone(phone)}</a>`
    )
    .join("");
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
    if (item) return item;
  }
  return null;
}

function openModal(id) {
  const item = findItem(id);
  if (!item) return;
  state.modalItem = item;
  state.modalPortion = item.portionOptions?.[0]?.key || "primary";
  document.getElementById("modal-title").textContent = item.name;
  document.getElementById("modal-desc").textContent = item.description || "";
  renderPortions(item);
  renderModalPrice();
  document.getElementById("modal").hidden = false;
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

function renderModalPrice() {
  const item = state.modalItem;
  const price = currentPrice(item, state.modalPortion);
  document.getElementById("modal-price").textContent = formatPrice(price);
  const text = orderText(item, state.modalPortion);
  document.getElementById("modal-wa").innerHTML = phones(state.info)
    .map(
      (phone) =>
        `<a class="btn btn--wa" href="${waLink(phone, text)}" target="_blank" rel="noopener">Pedir no ${formatPhone(phone)}</a>`
    )
    .join("");
}

function closeModal() {
  document.getElementById("modal").hidden = true;
  state.modalItem = null;
}

function renderFooter(info) {
  const loc = info.location || {};
  const ig = info.contact?.instagram || "";
  const promo = (info.policies?.birthdayRodizio || []).map((t) => `<p>${t}</p>`).join("");
  document.getElementById("footer").innerHTML = `
    <p><strong>${info.name}</strong></p>
    <p><a href="${mapsUrl(info)}" target="_blank" rel="noopener">${loc.address}</a></p>
    <p>${loc.neighborhood}, ${loc.city}-${loc.state}</p>
    <div class="footer__wa">
      ${phones(info)
        .map(
          (phone) =>
            `<a class="btn btn--wa" href="${waLink(phone)}" target="_blank" rel="noopener">${formatPhone(phone)}</a>`
        )
        .join("")}
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
  renderHero(info);
  renderFeatured(menu);
  renderWifi(info);
  renderNav(menu);
  renderMenu(menu);
  renderFooter(info);
  watchNav();

  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target.dataset.close !== undefined) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

boot().catch((err) => {
  document.getElementById("menu").innerHTML =
    "<p>Não foi possível carregar o cardápio. Abra o site por um servidor local ou GitHub Pages.</p>";
  console.error(err);
});
