function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

function catBanner(cat) {
  if (!cat.image) return "";
  return `<img src="assets/${cat.image}" alt="" loading="eager" />`;
}

async function waitImages() {
  const imgs = [...document.images];
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) return resolve();
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
    )
  );
}

async function init() {
  const [menu, info] = await Promise.all([
    fetch("data/menu-data.json").then((r) => r.json()),
    fetch("data/restaurant-info.json").then((r) => r.json()),
  ]);

  const loc = info.location || {};
  const wifi = info.wifi || {};
  document.getElementById("cover-meta").innerHTML = `
    <p><strong>${info.name}</strong></p>
    <p>${loc.address} · ${loc.neighborhood}, ${loc.city}-${loc.state}</p>
    <p>${info.contact?.phone || ""} · ${info.contact?.instagram || ""}</p>
  `;

  const featured = menu.categories.find((c) => c.featured);
  const rest = menu.categories.filter((c) => !c.featured);
  const featuredItem = featured?.items?.[0];

  const featuredHtml = featuredItem
    ? `<section class="featured">
        ${catBanner(featured)}
        <div class="featured__body">
          <p class="kicker">Carro-chefe</p>
          <h1>${featuredItem.name}</h1>
          <p>${featuredItem.description || ""}</p>
          <p>${featured.note || ""}</p>
          <p class="price">${priceLines(featuredItem)}</p>
        </div>
      </section>`
    : "";

  const columns = rest
    .map((cat) => {
      const items = (cat.items || [])
        .map(
          (item) => `<article class="item">
            <div class="item__row">
              <span class="item__name">${item.name}</span>
              <span class="item__price">${priceLines(item)}</span>
            </div>
            ${item.description ? `<p class="item__desc">${item.description}</p>` : ""}
          </article>`
        )
        .join("");
      return `<section class="section">
        ${catBanner(cat)}
        <h2>${cat.name}</h2>
        ${cat.note ? `<p class="note">${cat.note}</p>` : ""}
        ${items}
      </section>`;
    })
    .join("");

  document.getElementById("menu").innerHTML = featuredHtml + `<div class="columns">${columns}</div>`;

  if (wifi.password) {
    document.getElementById("wifi").innerHTML = `
      <div>
        <h2>Wi-Fi da casa</h2>
        <p>Rede <strong>${wifi.ssid || ""}</strong></p>
        <p>Senha <strong>${wifi.password}</strong></p>
      </div>
      <img src="${wifi.qrImage || "assets/wifi-qr.png"}" alt="QR Wi-Fi" loading="eager" />
    `;
  }

  const promo = (info.policies?.birthdayRodizio || []).join(" · ");
  document.getElementById("footer").innerHTML = `
    <p>${info.hours?.rodizioWeekday || ""} · ${info.hours?.rodizioWeekend || ""} · ${info.hours?.pizzaRodizio || ""}</p>
    <p>${promo}</p>
  `;

  await waitImages();
  const loaded = [...document.images].filter((img) => img.complete && img.naturalWidth > 0).length;
  document.body.dataset.printReady = "1";
  document.body.dataset.imagesLoaded = String(loaded);
  document.body.dataset.imagesTotal = String(document.images.length);
}

init().catch((err) => {
  console.error(err);
  document.body.dataset.printReady = "error";
});
