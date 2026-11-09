const MENU = [
  {
    id: "tomato-beef",
    name: "番茄牛腩饭",
    category: "招牌",
    price: 32,
    description: "牛腩慢炖两小时，番茄酸甜挂汁，配一碗五常米饭。",
    tags: ["高蛋白", "微酸甜"],
    emoji: "🍅",
    watermark: "饭",
    badge: "主厨推荐",
    kcal: 620,
    artBg: "#f2d4c2",
    artAccent: "#d96a46"
  },
  {
    id: "mushroom-chicken",
    name: "香菇滑鸡饭",
    category: "主食",
    price: 26,
    description: "去骨鸡腿肉与厚切香菇同蒸，嫩滑不柴，汤汁拌饭正好。",
    tags: ["低脂", "不辣"],
    emoji: "🍄",
    watermark: "鲜",
    kcal: 540,
    artBg: "#e3e4cb",
    artAccent: "#78834f"
  },
  {
    id: "scallion-noodles",
    name: "葱油拌面",
    category: "主食",
    price: 18,
    description: "现熬葱油，碱水细面，拌开就是小时候的味道。",
    tags: ["素食", "经典"],
    emoji: "🍜",
    watermark: "面",
    kcal: 480,
    artBg: "#f0e3c4",
    artAccent: "#c08b39"
  },
  {
    id: "crispy-chicken",
    name: "香煎鸡腿饭",
    category: "招牌",
    price: 28,
    description: "外皮焦香、肉汁饱满，配时蔬和一颗溏心蛋。",
    tags: ["高蛋白", "微辣"],
    emoji: "🍗",
    watermark: "香",
    badge: "今日限量",
    kcal: 680,
    artBg: "#efd6c5",
    artAccent: "#bd663a"
  },
  {
    id: "seasonal-greens",
    name: "清炒时蔬",
    category: "小炒",
    price: 12,
    description: "当日时令绿叶菜，蒜蓉快炒，清爽解腻。",
    tags: ["素食", "低卡"],
    emoji: "🥬",
    watermark: "青",
    kcal: 120,
    artBg: "#dce7d2",
    artAccent: "#5e8151"
  },
  {
    id: "mapo-tofu",
    name: "麻婆豆腐",
    category: "小炒",
    price: 16,
    description: "嫩豆腐配现炒肉末，麻辣鲜香，是米饭的好搭子。",
    tags: ["微辣", "下饭"],
    emoji: "🌶️",
    watermark: "辣",
    kcal: 320,
    artBg: "#f2d0c7",
    artAccent: "#cd5136"
  },
  {
    id: "corn-rib-soup",
    name: "玉米排骨汤",
    category: "汤品",
    price: 14,
    description: "排骨与甜玉米小火慢煨，汤清味甜，喝完胃里暖暖的。",
    tags: ["清淡", "暖胃"],
    emoji: "🌽",
    watermark: "汤",
    kcal: 210,
    artBg: "#f1e3c0",
    artAccent: "#ce9f3d"
  },
  {
    id: "plum-drink",
    name: "桂花酸梅汤",
    category: "饮品",
    price: 8,
    description: "乌梅、山楂与桂花冷泡，冰镇后更解腻，夏日限定。",
    tags: ["冰饮", "解腻"],
    emoji: "🥤",
    watermark: "饮",
    kcal: 90,
    artBg: "#e5d7d1",
    artAccent: "#8d555b"
  }
];

const CART_KEY = "shiguang-canteen-cart-v1";
const ORDERS_KEY = "shiguang-canteen-orders-v1";
const MAX_QTY = 20;

const state = {
  cart: loadCart(),
  filter: "all",
  query: "",
  orderType: "dine-in"
};

const dom = {
  menuGrid: document.querySelector("#menu-grid"),
  menuEmpty: document.querySelector("#menu-empty"),
  search: document.querySelector("#menu-search"),
  filterTabs: [...document.querySelectorAll("[data-filter]")],
  cartCount: document.querySelector("[data-cart-count]"),
  cartButton: document.querySelector("[data-open-cart]"),
  cartDrawer: document.querySelector("#cart-drawer"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartFoot: document.querySelector("#cart-foot"),
  subtotal: document.querySelector("[data-subtotal]"),
  total: document.querySelector("[data-total]"),
  packagingRow: document.querySelector("#packaging-row"),
  checkoutButton: document.querySelector("#checkout-button"),
  checkoutTotal: document.querySelector("[data-checkout-total]"),
  orderTypeButtons: [...document.querySelectorAll("[data-order-type]")],
  backdrop: document.querySelector(".drawer-backdrop"),
  modal: document.querySelector("#checkout-modal"),
  checkoutView: document.querySelector("#checkout-view"),
  successView: document.querySelector("#success-view"),
  checkoutSummary: document.querySelector("#checkout-summary"),
  checkoutGrandTotal: document.querySelector("[data-checkout-grand-total]"),
  pickupTime: document.querySelector("#pickup-time"),
  pickupName: document.querySelector("#pickup-name"),
  orderNote: document.querySelector("#order-note"),
  placeOrder: document.querySelector("#place-order"),
  pickupCode: document.querySelector("#pickup-code"),
  pickupEta: document.querySelector("#pickup-eta"),
  toast: document.querySelector("#toast"),
  today: document.querySelector("[data-today]"),
  year: document.querySelector("[data-year]")
};

let lastCartFocus = null;
let lastModalFocus = null;
let toastTimer = null;

/* ---------- helpers ---------- */
function formatPrice(value) {
  return Number.isInteger(value) ? `¥${value}` : `¥${value.toFixed(1)}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character];
  });
}

function getItem(id) {
  return MENU.find((item) => item.id === id);
}

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    const cart = {};
    for (const [id, quantity] of Object.entries(stored)) {
      if (getItem(id) && Number.isInteger(quantity) && quantity > 0) {
        cart[id] = Math.min(quantity, MAX_QTY);
      }
    }
    return cart;
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  } catch {
    // Storage can be unavailable in private browsing; the cart still works for this visit.
  }
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ item: getItem(id), quantity }))
    .filter((entry) => entry.item && entry.quantity > 0);
}

function cartCount() {
  return Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);
}

function subtotal() {
  return cartEntries().reduce((total, entry) => total + entry.item.price * entry.quantity, 0);
}

function packagingFee() {
  return state.orderType === "takeaway" && cartCount() > 0 ? 1 : 0;
}

function grandTotal() {
  return subtotal() + packagingFee();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    dom.toast.classList.remove("is-visible");
  }, 1900);
}

/* ---------- menu ---------- */
function filteredMenu() {
  const query = state.query.trim().toLowerCase();
  return MENU.filter((item) => {
    const matchesCategory = state.filter === "all" || item.category === state.filter;
    const haystack = `${item.name} ${item.description} ${item.tags.join(" ")} ${item.category}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function dishCard(item, index) {
  const isDrink = item.category === "饮品";
  const tags = item.tags
    .map((tag) => `<span class="dish-tag${tag.includes("辣") ? " dish-tag--hot" : ""}">${escapeHTML(tag)}</span>`)
    .join("");

  return `
    <article class="dish-card" style="--i:${index}">
      <div class="dish-art${isDrink ? " dish-art--drink" : ""}" style="--art-bg:${item.artBg};--art-accent:${item.artAccent}">
        <span class="art-watermark" aria-hidden="true">${escapeHTML(item.watermark)}</span>
        <span class="dish-badge">${escapeHTML(item.badge || item.category)}</span>
        <div class="dish-plate">
          <span class="dish-emoji" aria-hidden="true">${item.emoji}</span>
        </div>
        <span class="dish-number">SG · ${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="dish-body">
        <div class="dish-title-row">
          <h3 class="dish-title">${escapeHTML(item.name)}</h3>
          <span class="dish-category">${escapeHTML(item.category)}</span>
        </div>
        <p class="dish-description">${escapeHTML(item.description)}</p>
        <div class="dish-tags">${tags}</div>
        <div class="dish-foot">
          <div>
            <span class="dish-price"><small>¥</small>${item.price}<span class="dish-kcal">${item.kcal} kcal</span></span>
          </div>
          <button class="add-dish" type="button" data-add="${item.id}" aria-label="将${escapeHTML(item.name)}加入餐盘">
            <span aria-hidden="true">+</span> 加入
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMenu() {
  const items = filteredMenu();
  dom.menuGrid.innerHTML = items.map(dishCard).join("");
  dom.menuGrid.hidden = items.length === 0;
  dom.menuEmpty.hidden = items.length !== 0;
}

function resetFilters() {
  state.filter = "all";
  state.query = "";
  dom.search.value = "";
  dom.filterTabs.forEach((tab) => {
    const active = tab.dataset.filter === "all";
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  renderMenu();
}

/* ---------- cart ---------- */
function addToCart(id) {
  const item = getItem(id);
  if (!item) return;

  state.cart[id] = Math.min((state.cart[id] || 0) + 1, MAX_QTY);
  saveCart();
  renderCart();
  showToast(`「${item.name}」已加入餐盘`);

  dom.cartButton.classList.remove("bump");
  void dom.cartButton.offsetWidth;
  dom.cartButton.classList.add("bump");
}

function changeQuantity(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = Math.min(next, MAX_QTY);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = cartEntries();
  const count = cartCount();
  const total = grandTotal();

  dom.cartCount.textContent = count;
  dom.cartCount.setAttribute("aria-label", `餐盘中有 ${count} 件商品`);
  dom.cartItems.innerHTML = entries
    .map(
      ({ item, quantity }) => `
        <div class="cart-item" data-cart-item="${item.id}">
          <div class="cart-item-art" style="--art-bg:${item.artBg}" aria-hidden="true">${item.emoji}</div>
          <div class="cart-item-info">
            <h3>${escapeHTML(item.name)}</h3>
            <p>${escapeHTML(item.category)} · ${escapeHTML(item.tags[0])}</p>
            <div class="cart-item-price">${formatPrice(item.price * quantity)} <span style="color:#9a9b8e;font-weight:400">/ ${quantity} 份</span></div>
          </div>
          <div class="qty-control" aria-label="${escapeHTML(item.name)}数量">
            <button class="qty-button" type="button" data-quantity="-1" data-id="${item.id}" aria-label="减少一份${escapeHTML(item.name)}">−</button>
            <span class="qty-value" aria-live="polite">${quantity}</span>
            <button class="qty-button" type="button" data-quantity="1" data-id="${item.id}" aria-label="增加一份${escapeHTML(item.name)}">+</button>
          </div>
        </div>
      `
    )
    .join("");

  dom.cartItems.hidden = entries.length === 0;
  dom.cartEmpty.hidden = entries.length > 0;
  dom.cartFoot.hidden = entries.length === 0;
  dom.packagingRow.hidden = state.orderType !== "takeaway" || entries.length === 0;

  dom.subtotal.textContent = formatPrice(subtotal());
  dom.total.textContent = formatPrice(total);
  dom.checkoutTotal.textContent = formatPrice(total);
  dom.checkoutButton.disabled = entries.length === 0;
  dom.checkoutGrandTotal.textContent = formatPrice(total);
}

function openCart() {
  lastCartFocus = document.activeElement;
  dom.cartDrawer.setAttribute("aria-hidden", "false");
  dom.cartButton.setAttribute("aria-expanded", "true");
  dom.backdrop.hidden = false;
  document.body.classList.add("cart-open", "is-locked");
  document.querySelector("#cart-drawer [data-close-cart]").focus();
}

function closeCart(restoreFocus = true) {
  dom.cartDrawer.setAttribute("aria-hidden", "true");
  dom.cartButton.setAttribute("aria-expanded", "false");
  dom.backdrop.hidden = true;
  document.body.classList.remove("cart-open");
  if (dom.modal.hidden) {
    document.body.classList.remove("is-locked");
  }
  if (restoreFocus && lastCartFocus instanceof HTMLElement) {
    lastCartFocus.focus();
  }
}

function setOrderType(type) {
  state.orderType = type;
  dom.orderTypeButtons.forEach((button) => {
    const active = button.dataset.orderType === type;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderCart();
}

/* ---------- checkout ---------- */
function renderCheckoutSummary() {
  const entries = cartEntries();
  const rows = entries
    .map(
      ({ item, quantity }) => `
        <div class="checkout-summary-row">
          <span>${escapeHTML(item.name)} × ${quantity}</span>
          <strong>${formatPrice(item.price * quantity)}</strong>
        </div>
      `
    )
    .join("");
  const feeRow =
    state.orderType === "takeaway"
      ? '<div class="checkout-summary-row"><span>打包费</span><strong>¥1</strong></div>'
      : "";
  dom.checkoutSummary.innerHTML = `${rows}${feeRow}
    <div class="checkout-summary-total"><span>${state.orderType === "takeaway" ? "打包自取" : "堂食取餐"}</span><strong>${formatPrice(grandTotal())}</strong></div>`;
  dom.checkoutGrandTotal.textContent = formatPrice(grandTotal());
}

function openCheckout() {
  if (cartCount() === 0) return;

  lastModalFocus = document.activeElement;
  renderCheckoutSummary();
  closeCart(false);

  dom.checkoutView.hidden = false;
  dom.successView.hidden = true;
  dom.modal.hidden = false;
  dom.modal.setAttribute("aria-hidden", "false");
  dom.modal.removeAttribute("aria-labelledby");
  dom.modal.setAttribute("aria-label", "确认订单");
  document.body.classList.add("is-locked");

  window.setTimeout(() => dom.pickupTime.focus(), 50);
}

function closeCheckout() {
  dom.modal.hidden = true;
  dom.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");

  if (lastModalFocus instanceof HTMLElement && lastModalFocus.offsetParent !== null) {
    lastModalFocus.focus();
  } else {
    dom.cartButton.focus();
  }

  window.setTimeout(() => {
    dom.checkoutView.hidden = false;
    dom.successView.hidden = true;
  }, 300);
}

function placeOrder() {
  if (cartCount() === 0) return;

  const entries = cartEntries();
  const total = grandTotal();
  const code = `A${Math.floor(100 + Math.random() * 900)}`;
  const pickupTime = dom.pickupTime.value;
  const order = {
    code,
    total,
    orderType: state.orderType,
    pickupTime,
    name: dom.pickupName.value.trim(),
    note: dom.orderNote.value.trim(),
    items: entries.map(({ item, quantity }) => ({ id: item.id, name: item.name, quantity, price: item.price })),
    createdAt: new Date().toISOString()
  };

  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 20)));
  } catch {
    // Keep the confirmation useful even if storage is unavailable.
  }

  dom.pickupCode.textContent = code;
  dom.pickupEta.textContent =
    pickupTime === "尽快取餐" ? "预计 10 分钟后可取" : `请于 ${pickupTime} 到取餐口取餐`;
  dom.checkoutView.hidden = true;
  dom.successView.hidden = false;
  dom.modal.removeAttribute("aria-label");
  dom.modal.setAttribute("aria-labelledby", "success-title");

  state.cart = {};
  saveCart();
  renderCart();

  dom.orderNote.value = "";
  dom.pickupName.value = "";
  dom.pickupTime.value = "尽快取餐";
  document.querySelector("#success-title").focus();
}

/* ---------- focus trap ---------- */
function focusableElements(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (element) => !element.hidden && element.offsetParent !== null
  );
}

function trapFocus(event, container) {
  if (event.key !== "Tab") return;
  const elements = focusableElements(container);
  if (elements.length === 0) return;
  const first = elements[0];
  const last = elements[elements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ---------- events ---------- */
document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }

  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    changeQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.quantity));
    return;
  }

  if (event.target.closest("[data-open-cart]")) {
    openCart();
    return;
  }

  if (event.target.closest("[data-close-cart]")) {
    closeCart();
    return;
  }

  if (event.target.closest("[data-close-checkout]")) {
    closeCheckout();
    return;
  }

  if (event.target.closest("[data-reset-filters]")) {
    resetFilters();
  }
});

dom.filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.filter = tab.dataset.filter;
    dom.filterTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderMenu();
  });
});

dom.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
});

dom.orderTypeButtons.forEach((button) => {
  button.addEventListener("click", () => setOrderType(button.dataset.orderType));
});

dom.checkoutButton.addEventListener("click", openCheckout);
dom.placeOrder.addEventListener("click", placeOrder);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!dom.modal.hidden) {
      event.preventDefault();
      closeCheckout();
      return;
    }
    if (document.body.classList.contains("cart-open")) {
      event.preventDefault();
      closeCart();
      return;
    }
  }

  if (!dom.modal.hidden) {
    trapFocus(event, dom.modal.querySelector(".modal-card"));
    return;
  }

  if (document.body.classList.contains("cart-open")) {
    trapFocus(event, dom.cartDrawer);
    return;
  }

  const tag = document.activeElement?.tagName;
  const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    dom.search.focus();
  }
});

/* ---------- boot ---------- */
function boot() {
  if (dom.today) {
    dom.today.textContent = new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(new Date());
  }
  if (dom.year) {
    dom.year.textContent = String(new Date().getFullYear());
  }

  renderMenu();
  renderCart();
}

boot();
