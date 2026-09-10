(() => {
  "use strict";

  // ============================================================
  // KESWA - CATEGORY PAGE
  // FRONTEND ONLY
  // ============================================================

  const $ = (selector, root = document) => {
    return root.querySelector(selector);
  };

  const $$ = (selector, root = document) => {
    return Array.from(root.querySelectorAll(selector));
  };

  // ============================================================
  // STATE
  // ============================================================

  const state = {
    sort: "newest-first",
    view: "grid",
    cart: loadStorage("keswa-cart", []),
  };

  let bodyLockCount = 0;
  let desktopSearchLocked = false;

  let noticeTimer = null;
  let mobileMenuCloseTimer = null;
  let searchCloseTimer = null;
  let cartCloseTimer = null;
  let filterCloseTimer = null;
  let mobileSortCloseTimer = null;

  // ============================================================
  // STORAGE
  // ============================================================

  function loadStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallback;
      }

      const parsed = JSON.parse(value);

      return parsed;
    } catch {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors.
    }
  }

  // ============================================================
  // BODY LOCK
  // ============================================================

  function lockBody() {
    bodyLockCount += 1;

    document.body.style.overflow = "hidden";
  }

  function unlockBody() {
    bodyLockCount = Math.max(0, bodyLockCount - 1);

    if (bodyLockCount === 0) {
      document.body.style.overflow = "";
    }
  }

  // ============================================================
  // ELEMENTS
  // ============================================================

  const topHeader = $("#top-header");

  const bottomHeader = $("#bottom-header");

  const refs = {
    // ----------------------------------------------------------
    // Mobile Menu
    // ----------------------------------------------------------

    mobileMenu: $("#mobile-menu"),
    openMobileMenu: $("#open-mobile-menu"),
    closeMobileMenu: $("#close-mobile-menu"),
    mobileMenuBackdrop: $("#mobile-menu-backdrop"),
    mobileMenuPanel: $("#mobile-menu-panel"),

    // ----------------------------------------------------------
    // Search
    // ----------------------------------------------------------

    searchButton: $("#header-search-button"),
    searchOverlay: $("#search-overlay"),
    searchPanel: $("#search-panel"),
    closeSearch: $("#close-search"),
    searchInput: $("#header-search-input"),

    // ----------------------------------------------------------
    // Cart
    // ----------------------------------------------------------

    cartButton: $("#header-cart-button"),
    cartOverlay: $("#cart-overlay"),
    cartDrawer: $("#cart-drawer"),
    closeCart: $("#close-cart"),

    // ----------------------------------------------------------
    // Account
    // ----------------------------------------------------------

    accountButton: $("#header-account-button"),
    accountDropdown: $("#account-dropdown"),

    // ----------------------------------------------------------
    // Desktop Filter
    // ----------------------------------------------------------

    filterButton: $("#filter-button"),
    filterOverlay: $("#filter-overlay"),
    filterPanel: $("#filter-panel"),
    closeFilter: $("#close-filter"),
    clearFilters: $("#clear-filters"),

    // ----------------------------------------------------------
    // Mobile Filter / Sort
    // ----------------------------------------------------------

    mobileFilterButton: $("#mobile-filter-button"),
    mobileSortButton: $("#mobile-sort-button"),

    // ----------------------------------------------------------
    // Products
    // ----------------------------------------------------------

    productsContainer: $("#products-container"),
    noProductsMessage: $("#no-products-message"),

    // ----------------------------------------------------------
    // Desktop Sort
    // ----------------------------------------------------------

    sortButton: $("#sort-button"),
    sortDropdown: $("#sort-dropdown"),
    sortSelected: $("#sort-selected"),
    sortOptions: $$(".sort-option"),

    // ----------------------------------------------------------
    // Views
    // ----------------------------------------------------------

    listView: $("#list-view"),
    gridView: $("#grid-view"),

    // ----------------------------------------------------------
    // Price
    // ----------------------------------------------------------

    priceMin: $("#price-min"),
    priceMax: $("#price-max"),
    priceRangeText: $("#price-range-text"),
    priceRangeTrack: $("#price-range-track"),

    // ----------------------------------------------------------
    // Colors
    // ----------------------------------------------------------

    colorSearch: $("#color-search"),
    colorOptions: $$(".color-option"),
    colorCount: $("#color-count"),
    colorCheckboxes: $$('input[name="color-filter"]'),

    // ----------------------------------------------------------
    // Sizes
    // ----------------------------------------------------------

    sizeSearch: $("#size-search"),
    sizeOptions: $$(".size-option"),
    sizeCount: $("#size-count"),
    sizeCheckboxes: $$('input[name="size-filter"]'),
  };

  // ============================================================
  // PRODUCTS
  // ============================================================

  const originalProducts = refs.productsContainer
    ? Array.from(refs.productsContainer.children).filter(
        (item) => item.id !== "no-products-message",
      )
    : [];

  originalProducts.forEach((product, index) => {
    product.dataset.originalIndex = String(index);

    if (!product.dataset.productId) {
      product.dataset.productId = `product-${index}`;
    }
  });

  // ============================================================
  // HELPERS
  // ============================================================

  function normalize(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getProductId(product) {
    return (
      product.dataset.productId ||
      `product-${
        product.dataset.originalIndex ?? originalProducts.indexOf(product)
      }`
    );
  }

  function getProductName(product) {
    const link = $("a[aria-label]", product);

    if (link) {
      const ariaLabel = link.getAttribute("aria-label");

      if (ariaLabel?.trim()) {
        return ariaLabel.trim();
      }
    }

    const name = $(".break-all", product);

    if (name?.textContent?.trim()) {
      return name.textContent.trim();
    }

    return "Product";
  }

  function getProductPrice(product) {
    const price = Number(product.dataset.price);

    return Number.isFinite(price) ? price : 0;
  }

  function getProductColor(product) {
    return normalize(product.dataset.color);
  }

  function getProductSizes(product) {
    return String(product.dataset.size || "")
      .split(",")
      .map(normalize)
      .filter(Boolean);
  }

  function getProductImage(product) {
    return $("img", product)?.getAttribute("src") || "";
  }

  function getProductInfo(product) {
    return {
      id: getProductId(product),
      name: getProductName(product),
      price: getProductPrice(product),
      color: product.dataset.color || "",
      sizes: getProductSizes(product),
      image: getProductImage(product),
    };
  }

  function isSale(product) {
    return $$(".text-white", product).some(
      (element) => normalize(element.textContent) === "sale",
    );
  }

  function showElement(element) {
    if (!element) {
      return;
    }

    element.classList.remove("hidden");
  }

  function hideElement(element) {
    if (!element) {
      return;
    }

    element.classList.add("hidden");
  }

  // ============================================================
  // HEADER
  // ============================================================

  function updateHeader() {
    if (!bottomHeader) {
      return;
    }

    const isMobile = window.innerWidth < 768;

    const headerContent = bottomHeader.firstElementChild;

    if (!headerContent) {
      return;
    }

    const desktopLogo = $(":scope > a.logo", headerContent);

    const desktopNavigation = $("nav", headerContent);

    const desktopActions = desktopNavigation?.nextElementSibling;

    const hamburger = $(".hamburger", headerContent);

    const mobileHeader = $(".hamburger > div", headerContent);

    if (topHeader) {
      topHeader.style.display = isMobile ? "none" : "";
    }

    [desktopLogo, desktopNavigation, desktopActions].forEach((element) => {
      if (!element) {
        return;
      }

      element.style.display = isMobile ? "none" : "";
    });

    if (hamburger) {
      hamburger.style.width = isMobile ? "100%" : "";
    }

    if (mobileHeader) {
      mobileHeader.style.display = isMobile ? "flex" : "none";

      mobileHeader.style.width = "100%";

      mobileHeader.style.height = "64px";
    }

    bottomHeader.style.position = "sticky";

    bottomHeader.style.top = "0";

    bottomHeader.style.left = "0";

    bottomHeader.style.backgroundColor = "#ffffff";

    bottomHeader.style.boxShadow = isMobile
      ? "none"
      : "0 1px 3px rgb(0 0 0 / 4%)";

    // ----------------------------------------------------------
    // Mobile Filter / Sort Bar
    // ----------------------------------------------------------

    const mobileFilterBar = document.querySelector("#mobile-filter-sort-bar");

    if (mobileFilterBar) {
      if (isMobile) {
        mobileFilterBar.classList.remove("hidden");
        mobileFilterBar.classList.add("flex");
      } else {
        mobileFilterBar.classList.add("hidden");
        mobileFilterBar.classList.remove("flex");
      }
    }
  }

  window.addEventListener("resize", updateHeader);

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  updateHeader();

  // ============================================================
  // CLOSE OTHER PANELS
  // ============================================================

  function closeAllExcept(except) {
    if (except !== "search") {
      closeSearch();
    }

    if (except !== "cart") {
      closeCart();
    }

    if (except !== "filter") {
      closeFilter();
    }

    if (except !== "mobile") {
      closeMobileMenu();
    }

    if (except !== "account") {
      closeAccount();
    }

    if (except !== "sort") {
      closeSortDropdown();
    }

    if (except !== "mobile-sort") {
      closeMobileSort();
    }
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================

  function openMobileMenu() {
    if (!refs.mobileMenu || !refs.mobileMenuPanel) {
      return;
    }

    if (!refs.mobileMenu.classList.contains("hidden")) {
      return;
    }

    clearTimeout(mobileMenuCloseTimer);

    closeAllExcept("mobile");

    refs.mobileMenuPanel.classList.remove("translate-x-0");

    refs.mobileMenuPanel.classList.add("-translate-x-full");

    showElement(refs.mobileMenu);

    requestAnimationFrame(() => {
      refs.mobileMenuPanel.classList.remove("-translate-x-full");

      refs.mobileMenuPanel.classList.add("translate-x-0");
    });

    lockBody();
  }

  function closeMobileMenu() {
    if (!refs.mobileMenu || !refs.mobileMenuPanel) {
      return;
    }

    if (refs.mobileMenu.classList.contains("hidden")) {
      return;
    }

    clearTimeout(mobileMenuCloseTimer);

    refs.mobileMenuPanel.classList.remove("translate-x-0");

    refs.mobileMenuPanel.classList.add("-translate-x-full");

    mobileMenuCloseTimer = setTimeout(() => {
      hideElement(refs.mobileMenu);
    }, 300);

    unlockBody();
  }

  refs.openMobileMenu?.addEventListener("click", (event) => {
    event.stopPropagation();

    openMobileMenu();
  });

  refs.closeMobileMenu?.addEventListener("click", closeMobileMenu);

  refs.mobileMenuBackdrop?.addEventListener("click", closeMobileMenu);

  refs.mobileMenuPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // ============================================================
  // SEARCH
  // ============================================================

  function openSearch() {
    if (!refs.searchOverlay || !refs.searchPanel) {
      return;
    }

    if (window.innerWidth < 768) {
      return;
    }

    if (!refs.searchOverlay.classList.contains("hidden")) {
      refs.searchInput?.focus();

      return;
    }

    clearTimeout(searchCloseTimer);

    closeAllExcept("search");

    refs.searchPanel.classList.remove("translate-y-0");

    refs.searchPanel.classList.add("-translate-y-full");

    showElement(refs.searchOverlay);

    refs.searchButton?.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
      refs.searchPanel.classList.remove("-translate-y-full");

      refs.searchPanel.classList.add("translate-y-0");
    });

    lockBody();

    desktopSearchLocked = true;

    setTimeout(() => {
      refs.searchInput?.focus();

      refs.searchInput?.select();
    }, 50);
  }

  function closeSearch() {
    if (!refs.searchOverlay || !refs.searchPanel) {
      return;
    }

    if (refs.searchOverlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(searchCloseTimer);

    refs.searchPanel.classList.remove("translate-y-0");

    refs.searchPanel.classList.add("-translate-y-full");

    searchCloseTimer = setTimeout(() => {
      hideElement(refs.searchOverlay);
    }, 300);

    refs.searchButton?.setAttribute("aria-expanded", "false");

    if (desktopSearchLocked) {
      unlockBody();

      desktopSearchLocked = false;
    }
  }

  refs.searchButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (window.innerWidth < 768) {
      return;
    }

    openSearch();
  });

  refs.closeSearch?.addEventListener("click", (event) => {
    event.stopPropagation();

    closeSearch();
  });

  refs.searchPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  refs.searchOverlay?.addEventListener("click", (event) => {
    if (event.target === refs.searchOverlay) {
      closeSearch();
    }
  });

  // ============================================================
  // CART
  // ============================================================

  function getCartCount() {
    return state.cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
  }

  function getCartTotal() {
    return state.cart.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }

  function updateCartBadge() {
    if (!refs.cartButton) {
      return;
    }

    refs.cartButton.querySelector(".cart-count-badge")?.remove();

    const count = getCartCount();

    const mobileCart = document.querySelector(
      '#mobile-bottom-nav button[aria-label="Cart"]',
    );

    if (!count) {
      mobileCart?.querySelector(".mobile-cart-count")?.remove();

      return;
    }

    refs.cartButton.classList.add("relative");

    const badge = document.createElement("span");

    badge.className =
      "cart-count-badge absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none text-white";

    badge.textContent = String(count);

    refs.cartButton.appendChild(badge);

    if (mobileCart) {
      mobileCart.querySelector(".mobile-cart-count")?.remove();

      mobileCart.classList.add("relative");

      const mobileBadge = document.createElement("span");

      mobileBadge.className =
        "mobile-cart-count absolute right-[calc(50%-15px)] top-[9px] flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] leading-none text-white";

      mobileBadge.textContent = String(count);

      mobileCart.appendChild(mobileBadge);
    }
  }

  function addToCart(product, quantity = 1) {
    const info = getProductInfo(product);

    const existing = state.cart.find((item) => item.id === info.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        ...info,
        quantity,
      });
    }

    saveStorage("keswa-cart", state.cart);

    updateCartBadge();

    renderCart();

    showNotice(`${info.name} added to cart`);
  }

  function changeCartQuantity(id, delta) {
    const item = state.cart.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    item.quantity += delta;

    if (item.quantity <= 0) {
      state.cart = state.cart.filter((entry) => entry.id !== id);
    }

    saveStorage("keswa-cart", state.cart);

    updateCartBadge();

    renderCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((item) => item.id !== id);

    saveStorage("keswa-cart", state.cart);

    updateCartBadge();

    renderCart();
  }

  function openCart() {
    if (!refs.cartOverlay || !refs.cartDrawer) {
      return;
    }

    if (!refs.cartOverlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(cartCloseTimer);

    closeAllExcept("cart");

    refs.cartDrawer.classList.remove("translate-x-0");

    refs.cartDrawer.classList.add("translate-x-full");

    showElement(refs.cartOverlay);

    requestAnimationFrame(() => {
      refs.cartDrawer.classList.remove("translate-x-full");

      refs.cartDrawer.classList.add("translate-x-0");
    });

    lockBody();

    renderCart();
  }

  function closeCart() {
    if (!refs.cartOverlay || !refs.cartDrawer) {
      return;
    }

    if (refs.cartOverlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(cartCloseTimer);

    refs.cartDrawer.classList.remove("translate-x-0");

    refs.cartDrawer.classList.add("translate-x-full");

    cartCloseTimer = setTimeout(() => {
      hideElement(refs.cartOverlay);
    }, 300);

    unlockBody();
  }

  refs.cartButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    openCart();
  });

  refs.closeCart?.addEventListener("click", closeCart);

  refs.cartDrawer?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  refs.cartOverlay?.addEventListener("click", (event) => {
    if (event.target === refs.cartOverlay) {
      closeCart();
    }
  });

  function renderCart() {
    if (!refs.cartDrawer) {
      return;
    }

    const cartContent = $("#cart-content", refs.cartDrawer);

    if (!cartContent) {
      return;
    }

    cartContent.innerHTML = "";

    if (!state.cart.length) {
      cartContent.innerHTML = `
        <div class="mt-32 pb-8 max-md:mt-32">
          <div class="grid place-items-center gap-y-5 text-center">
            <img
              class="h-[150px] w-[150px] max-md:h-[120px] max-md:w-[120px]"
              src="https://keswastore.com/themes/shop/default/build/assets/shopping-cart-placeholder-a8WmYsMY.svg"
              loading="lazy"
              decoding="async"
              alt="Empty shopping cart"
            />

            <p class="text-xl max-md:text-sm">
              Your cart is empty
            </p>
          </div>
        </div>
      `;

      updateCartBadge();

      return;
    }

    const wrapper = document.createElement("div");

    wrapper.className = "space-y-4 pb-6";

    state.cart.forEach((item) => {
      const row = document.createElement("article");

      row.className = "flex gap-3 border-b border-zinc-200 pb-4";

      row.innerHTML = `
        <img
          src="${escapeHtml(item.image)}"
          alt="${escapeHtml(item.name)}"
          class="h-24 w-20 shrink-0 rounded bg-zinc-100 object-cover"
          loading="lazy"
        />

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <p class="truncate text-sm font-medium">
              ${escapeHtml(item.name)}
            </p>

            <button
              type="button"
              data-remove-cart="${escapeHtml(item.id)}"
              class="text-lg text-zinc-500 hover:text-black"
            >
              ×
            </button>
          </div>

          <p class="mt-1 text-sm text-zinc-500">
            ${item.price} EGP
          </p>

          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="flex items-center border border-zinc-200">
              <button
                type="button"
                data-minus-cart="${escapeHtml(item.id)}"
                class="flex h-8 w-8 items-center justify-center"
              >
                −
              </button>

              <span
                class="flex h-8 min-w-8 items-center justify-center text-sm"
              >
                ${item.quantity}
              </span>

              <button
                type="button"
                data-plus-cart="${escapeHtml(item.id)}"
                class="flex h-8 w-8 items-center justify-center"
              >
                +
              </button>
            </div>

            <strong class="text-sm">
              ${item.price * item.quantity} EGP
            </strong>
          </div>
        </div>
      `;

      wrapper.appendChild(row);
    });

    const summary = document.createElement("div");

    summary.className = "border-t border-zinc-200 pt-4";

    summary.innerHTML = `
      <div class="flex items-center justify-between text-base font-medium">
        <span>Total</span>

        <span>
          ${getCartTotal()} EGP
        </span>
      </div>

      <button
        type="button"
        id="cart-checkout-button"
        class="mt-4 h-12 w-full bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Proceed to Checkout
      </button>

      <button
        type="button"
        id="cart-clear-button"
        class="mt-2 w-full py-2 text-sm underline underline-offset-4"
      >
        Clear cart
      </button>
    `;

    wrapper.appendChild(summary);

    cartContent.appendChild(wrapper);

    $$("[data-minus-cart]", cartContent).forEach((button) => {
      button.addEventListener("click", () => {
        changeCartQuantity(button.dataset.minusCart, -1);
      });
    });

    $$("[data-plus-cart]", cartContent).forEach((button) => {
      button.addEventListener("click", () => {
        changeCartQuantity(button.dataset.plusCart, 1);
      });
    });

    $$("[data-remove-cart]", cartContent).forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(button.dataset.removeCart);
      });
    });

    $("#cart-clear-button", cartContent)?.addEventListener("click", () => {
      state.cart = [];

      saveStorage("keswa-cart", state.cart);

      updateCartBadge();

      renderCart();
    });

    $("#cart-checkout-button", cartContent)?.addEventListener("click", () => {
      showNotice("Checkout is not connected yet");
    });

    updateCartBadge();
  }

  // ============================================================
  // ACCOUNT DROPDOWN
  // ============================================================

  function openAccount() {
    if (!refs.accountDropdown) {
      return;
    }

    closeAllExcept("account");

    showElement(refs.accountDropdown);

    refs.accountButton?.setAttribute("aria-expanded", "true");
  }

  function closeAccount() {
    if (!refs.accountDropdown) {
      return;
    }

    hideElement(refs.accountDropdown);

    refs.accountButton?.setAttribute("aria-expanded", "false");
  }

  function toggleAccount() {
    if (!refs.accountDropdown) {
      return;
    }

    const opened = !refs.accountDropdown.classList.contains("hidden");

    if (opened) {
      closeAccount();
    } else {
      openAccount();
    }
  }

  refs.accountButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (window.innerWidth < 768) {
      return;
    }

    toggleAccount();
  });

  refs.accountDropdown?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // ============================================================
  // FILTER DRAWER
  // ============================================================

  function openFilter() {
    if (!refs.filterOverlay || !refs.filterPanel) {
      return;
    }

    if (!refs.filterOverlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(filterCloseTimer);

    closeAllExcept("filter");

    refs.filterPanel.classList.remove("translate-x-0");

    refs.filterPanel.classList.add("-translate-x-full");

    showElement(refs.filterOverlay);

    refs.filterButton?.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
      refs.filterPanel.classList.remove("-translate-x-full");

      refs.filterPanel.classList.add("translate-x-0");
    });

    lockBody();
  }

  function closeFilter() {
    if (!refs.filterOverlay || !refs.filterPanel) {
      return;
    }

    if (refs.filterOverlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(filterCloseTimer);

    refs.filterPanel.classList.remove("translate-x-0");

    refs.filterPanel.classList.add("-translate-x-full");

    refs.filterButton?.setAttribute("aria-expanded", "false");

    filterCloseTimer = setTimeout(() => {
      hideElement(refs.filterOverlay);
    }, 500);

    unlockBody();
  }

  refs.filterButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    openFilter();
  });

  refs.closeFilter?.addEventListener("click", closeFilter);

  refs.filterPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  refs.filterOverlay?.addEventListener("click", (event) => {
    if (event.target === refs.filterOverlay) {
      closeFilter();
    }
  });

  // ============================================================
  // FILTER ACCORDIONS
  // ============================================================

  $$(".filter-section-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target || "");

      if (!target) {
        return;
      }

      target.classList.toggle("hidden");

      const expanded = !target.classList.contains("hidden");

      button.setAttribute("aria-expanded", String(expanded));

      $(".filter-arrow", button)?.classList.toggle("rotate-180", !expanded);
    });
  });

  // ============================================================
  // PRICE FILTER
  // ============================================================

  function updatePriceRange() {
    if (!refs.priceMin || !refs.priceMax) {
      return;
    }

    const minLimit = Number(refs.priceMin.min || 0);

    const maxLimit = Number(refs.priceMin.max || refs.priceMax.max || 599);

    let min = Number(refs.priceMin.value);

    let max = Number(refs.priceMax.value);

    if (!Number.isFinite(min)) {
      min = minLimit;
    }

    if (!Number.isFinite(max)) {
      max = maxLimit;
    }

    if (min > max) {
      if (document.activeElement === refs.priceMin) {
        min = max;

        refs.priceMin.value = String(max);
      } else {
        max = min;

        refs.priceMax.value = String(min);
      }
    }

    const left = ((min - minLimit) / (maxLimit - minLimit || 1)) * 100;

    const right = ((max - minLimit) / (maxLimit - minLimit || 1)) * 100;

    if (refs.priceRangeTrack) {
      refs.priceRangeTrack.style.left = `${left}%`;

      refs.priceRangeTrack.style.width = `${Math.max(0, right - left)}%`;
    }

    if (refs.priceRangeText) {
      refs.priceRangeText.textContent = `${min} EGP - ${max} EGP`;
    }
  }

  refs.priceMin?.addEventListener("input", () => {
    updatePriceRange();

    applyFiltersAndSort();
  });

  refs.priceMax?.addEventListener("input", () => {
    updatePriceRange();

    applyFiltersAndSort();
  });

  // ============================================================
  // COLOR / SIZE SEARCH
  // ============================================================

  function updateOptionSearch(input, options, counter) {
    if (!input) {
      return;
    }

    const value = normalize(input.value);

    let visible = 0;

    options.forEach((option) => {
      const text = normalize(option.textContent);

      const matches = !value || text.includes(value);

      option.classList.toggle("hidden", !matches);

      if (matches) {
        visible++;
      }
    });

    if (counter) {
      counter.textContent = `Showing ${visible} of ${options.length} options`;
    }
  }

  refs.colorSearch?.addEventListener("input", () => {
    updateOptionSearch(refs.colorSearch, refs.colorOptions, refs.colorCount);
  });

  refs.sizeSearch?.addEventListener("input", () => {
    updateOptionSearch(refs.sizeSearch, refs.sizeOptions, refs.sizeCount);
  });

  // ============================================================
  // FILTERING
  // ============================================================

  function getSelectedValues(checkboxes) {
    return checkboxes
      .filter((input) => input.checked)
      .map((input) => normalize(input.value));
  }

  function getPriceRange() {
    return {
      min: Number(refs.priceMin?.value ?? 0),

      max: Number(refs.priceMax?.value ?? 599),
    };
  }

  function colorMatches(selectedColors, productColor) {
    if (!selectedColors.length) {
      return true;
    }

    const aliases = {
      beige: ["beige", "baje"],
      baje: ["beige", "baje"],
      "off-white": ["off-white", "off white"],
      "off white": ["off-white", "off white"],
    };

    return selectedColors.some((selected) => {
      const allowed = aliases[selected] || [selected];

      return allowed.includes(productColor);
    });
  }

  function productMatchesFilters(product) {
    const { min, max } = getPriceRange();

    const productPrice = getProductPrice(product);

    const selectedColors = getSelectedValues(refs.colorCheckboxes);

    const selectedSizes = getSelectedValues(refs.sizeCheckboxes);

    const productColor = getProductColor(product);

    const productSizes = getProductSizes(product);

    const matchesPrice = productPrice >= min && productPrice <= max;

    const matchesColor = colorMatches(selectedColors, productColor);

    const matchesSize =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) => productSizes.includes(size));

    return matchesPrice && matchesColor && matchesSize;
  }

  function getFilteredProducts() {
    return originalProducts.filter(productMatchesFilters);
  }

  refs.colorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFiltersAndSort);
  });

  refs.sizeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFiltersAndSort);
  });

  // ============================================================
  // DESKTOP SORT
  // ============================================================

  function closeSortDropdown() {
    hideElement(refs.sortDropdown);

    refs.sortButton?.setAttribute("aria-expanded", "false");
  }

  function toggleSortDropdown() {
    if (!refs.sortDropdown) {
      return;
    }

    const opened = !refs.sortDropdown.classList.contains("hidden");

    closeSortDropdown();

    if (!opened) {
      showElement(refs.sortDropdown);

      refs.sortButton?.setAttribute("aria-expanded", "true");
    }
  }

  function sortProducts(products) {
    const list = [...products];

    switch (state.sort) {
      case "a-z":
        return list.sort((a, b) =>
          getProductName(a).localeCompare(getProductName(b), undefined, {
            sensitivity: "base",
          }),
        );

      case "z-a":
        return list.sort((a, b) =>
          getProductName(b).localeCompare(getProductName(a), undefined, {
            sensitivity: "base",
          }),
        );

      case "cheapest-first":
        return list.sort((a, b) => getProductPrice(a) - getProductPrice(b));

      case "expensive-first":
        return list.sort((a, b) => getProductPrice(b) - getProductPrice(a));

      case "oldest-first":
        return list.sort(
          (a, b) =>
            Number(b.dataset.originalIndex) - Number(a.dataset.originalIndex),
        );

      case "newest-first":
      default:
        return list.sort(
          (a, b) =>
            Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex),
        );
    }
  }

  refs.sortButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    toggleSortDropdown();
  });

  refs.sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
      state.sort = option.dataset.value || "newest-first";

      if (refs.sortSelected) {
        refs.sortSelected.textContent = option.textContent.trim();
      }

      closeSortDropdown();

      applyFiltersAndSort();
    });
  });

  // ============================================================
  // MOBILE SORT SHEET
  // ============================================================

  function createMobileSortSheet() {
    let overlay = $("#mobile-sort-overlay");

    if (overlay) {
      return overlay;
    }

    overlay = document.createElement("div");

    overlay.id = "mobile-sort-overlay";

    overlay.className = "fixed inset-0 z-[1100] hidden bg-black/40 md:hidden";

    overlay.innerHTML = `
      <div
        id="mobile-sort-sheet"
        class="absolute bottom-0 left-0 w-full translate-y-full bg-white transition-transform duration-300 ease-out"
      >
        <div
          class="flex h-[60px] items-center justify-between border-b border-zinc-200 px-4"
        >
          <h2 class="text-lg font-medium">
            Sort
          </h2>

          <button
            type="button"
            id="mobile-sort-close"
            class="flex h-8 w-8 items-center justify-center text-black"
            aria-label="Close sort"
          >
            <svg class="h-6 w-6">
              <use href="./assests/icons.svg#close"></use>
            </svg>
          </button>
        </div>

        <div class="w-full">
          <button
            type="button"
            data-mobile-sort="a-z"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            From A-Z
          </button>

          <button
            type="button"
            data-mobile-sort="z-a"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            From Z-A
          </button>

          <button
            type="button"
            data-mobile-sort="newest-first"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            Newest First
          </button>

          <button
            type="button"
            data-mobile-sort="oldest-first"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            Oldest First
          </button>

          <button
            type="button"
            data-mobile-sort="cheapest-first"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            Cheapest First
          </button>

          <button
            type="button"
            data-mobile-sort="expensive-first"
            class="mobile-sort-option flex h-[44px] w-full items-center px-4 text-left text-base"
          >
            Expensive First
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const sheet = $("#mobile-sort-sheet", overlay);

    const closeButton = $("#mobile-sort-close", overlay);

    closeButton?.addEventListener("click", closeMobileSort);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeMobileSort();
      }
    });

    $$(".mobile-sort-option", overlay).forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.mobileSort;

        if (!value) {
          return;
        }

        state.sort = value;

        if (refs.sortSelected) {
          refs.sortSelected.textContent = option.textContent.trim();
        }

        updateMobileSortSelection();

        closeMobileSort();

        applyFiltersAndSort();
      });
    });

    sheet?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    return overlay;
  }

  function updateMobileSortSelection() {
    const overlay = $("#mobile-sort-overlay");

    if (!overlay) {
      return;
    }

    $$(".mobile-sort-option", overlay).forEach((option) => {
      const isActive = option.dataset.mobileSort === state.sort;

      option.classList.toggle("bg-zinc-100", isActive);
    });
  }

  function openMobileSort() {
    if (window.innerWidth >= 768) {
      return;
    }

    const overlay = createMobileSortSheet();

    const sheet = $("#mobile-sort-sheet", overlay);

    if (!overlay || !sheet) {
      return;
    }

    clearTimeout(mobileSortCloseTimer);

    closeAllExcept("mobile-sort");

    updateMobileSortSelection();

    showElement(overlay);

    requestAnimationFrame(() => {
      sheet.classList.remove("translate-y-full");

      sheet.classList.add("translate-y-0");
    });

    lockBody();
  }

  function closeMobileSort() {
    const overlay = $("#mobile-sort-overlay");

    const sheet = $("#mobile-sort-sheet");

    if (!overlay || !sheet) {
      return;
    }

    if (overlay.classList.contains("hidden")) {
      return;
    }

    clearTimeout(mobileSortCloseTimer);

    sheet.classList.remove("translate-y-0");

    sheet.classList.add("translate-y-full");

    mobileSortCloseTimer = setTimeout(() => {
      hideElement(overlay);
    }, 300);

    unlockBody();
  }

  refs.mobileSortButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    openMobileSort();
  });

  // ============================================================
  // MOBILE FILTER
  // ============================================================

  refs.mobileFilterButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (window.innerWidth >= 768) {
      return;
    }

    openFilter();
  });

  // ============================================================
  // SEARCH + RENDER
  // ============================================================

  function matchesSearch(product, term) {
    if (!term) {
      return true;
    }

    const info = getProductInfo(product);

    const searchable = normalize(
      [info.name, info.color, info.sizes.join(" ")].join(" "),
    );

    return searchable.includes(term);
  }

  function updateNoProductsMessage(count) {
    if (!refs.noProductsMessage) {
      return;
    }

    if (count > 0) {
      refs.noProductsMessage.className = "hidden";

      return;
    }

    refs.noProductsMessage.className = [
      "col-span-full",
      "flex",
      "min-h-[500px]",
      "w-full",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-5",
      "py-10",
      "text-center",
    ].join(" ");

    refs.noProductsMessage.innerHTML = `
      <img
        src="https://keswastore.com/themes/shop/default/build/assets/shopping-cart-placeholder-a8WmYsMY.svg"
        alt="No products available"
        loading="lazy"
        decoding="async"
        class="h-[170px] w-[170px]"
      />

      <p
        class="text-xl font-normal text-black max-md:text-base"
      >
        No products available in this category
      </p>
    `;

    refs.productsContainer?.appendChild(refs.noProductsMessage);
  }

  function renderProducts(products) {
    if (!refs.productsContainer) {
      return;
    }

    const sorted = sortProducts(products);

    const visible = new Set(sorted);

    sorted.forEach((product) => {
      product.classList.remove("hidden");

      refs.productsContainer.appendChild(product);
    });

    originalProducts
      .filter((product) => !visible.has(product))
      .forEach((product) => {
        product.classList.add("hidden");

        refs.productsContainer.appendChild(product);
      });

    updateNoProductsMessage(sorted.length);

    bindProductActions();
  }

  function applyFiltersAndSort() {
    let products = getFilteredProducts();

    const term = normalize(refs.searchInput?.value || "");

    if (term) {
      products = products.filter((product) => matchesSearch(product, term));
    }

    renderProducts(products);
  }

  // ============================================================
  // SEARCH INPUT
  // ============================================================

  refs.searchInput?.addEventListener("input", () => {
    applyFiltersAndSort();
  });

  // ============================================================
  // GRID / LIST
  // ============================================================

  function updateViewButtons(view) {
    state.view = view;

    refs.listView?.classList.toggle("text-black", view === "list");

    refs.listView?.classList.toggle("text-zinc-400", view !== "list");

    refs.gridView?.classList.toggle("text-black", view === "grid");

    refs.gridView?.classList.toggle("text-zinc-400", view !== "grid");

    const listIcon = refs.listView?.querySelector("svg");

    const gridIcon = refs.gridView?.querySelector("svg");

    if (listIcon) {
      listIcon.style.opacity = view === "list" ? "1" : "0.4";
    }

    if (gridIcon) {
      gridIcon.style.opacity = view === "grid" ? "1" : "0.4";
    }
  }

  function removeListActions(product) {
    product.querySelector(".list-view-actions")?.remove();
  }

  function createListActions(product) {
    const productInfo = product.children[1];

    if (!productInfo) {
      return;
    }

    removeListActions(product);

    const actions = document.createElement("div");

    actions.className = "list-view-actions mt-4 flex items-center gap-3";

    const wishlist = document.createElement("button");

    wishlist.type = "button";

    wishlist.setAttribute("aria-label", "Add to Wishlist");

    wishlist.className =
      "flex h-12 w-12 items-center justify-center border border-black bg-white text-black transition-all hover:bg-zinc-100";

    wishlist.innerHTML = `
      <svg class="h-5 w-5">
        <use href="./assests/icons.svg#wishlist"></use>
      </svg>
    `;

    const cart = document.createElement("button");

    cart.type = "button";

    cart.setAttribute("aria-label", "Add to cart");

    cart.className =
      "flex h-12 items-center justify-center bg-black px-8 text-sm font-medium text-white transition-all hover:bg-zinc-800";

    cart.textContent = "Add To Cart";

    actions.append(wishlist, cart);

    productInfo.appendChild(actions);
  }

  function setGridView() {
    if (!refs.productsContainer) {
      return;
    }

    refs.productsContainer.classList.remove("flex", "flex-col", "gap-6");

    refs.productsContainer.classList.add(
      "grid",
      "grid-cols-4",
      "max-lg:grid-cols-3",
      "max-sm:grid-cols-2",
    );

    originalProducts.forEach((product) => {
      const image = product.children[0];

      const info = product.children[1];

      if (!image || !info) {
        return;
      }

      product.classList.remove(
        "grid",
        "grid-cols-[291px_minmax(0,1fr)]",
        "gap-x-5",
      );

      product.classList.add("w-full");

      image.classList.remove("w-[291px]", "max-w-[291px]", "row-span-1");

      image.classList.add("aspect-[5/7]", "w-full");

      $(".absolute.bottom-2", image)?.classList.remove("hidden");

      info.classList.remove(
        "col-start-2",
        "row-start-1",
        "flex",
        "flex-col",
        "items-start",
        "justify-start",
        "min-w-0",
        "pt-0",
      );

      removeListActions(product);
    });

    updateViewButtons("grid");

    applyFiltersAndSort();
  }

  function setListView() {
    if (!refs.productsContainer) {
      return;
    }

    refs.productsContainer.classList.remove(
      "grid",
      "grid-cols-4",
      "max-lg:grid-cols-3",
      "max-sm:grid-cols-2",
    );

    refs.productsContainer.classList.add("flex", "flex-col", "gap-6");

    originalProducts.forEach((product) => {
      const image = product.children[0];

      const info = product.children[1];

      if (!image || !info) {
        return;
      }

      product.classList.remove("w-full");

      product.classList.add(
        "grid",
        "grid-cols-[291px_minmax(0,1fr)]",
        "gap-x-5",
        "w-full",
      );

      image.classList.remove("w-full", "w-[250px]", "max-w-[250px]");

      image.classList.add(
        "aspect-[5/7]",
        "w-[291px]",
        "max-w-[291px]",
        "row-span-1",
      );

      $(".absolute.bottom-2", image)?.classList.add("hidden");

      info.classList.add(
        "col-start-2",
        "row-start-1",
        "flex",
        "flex-col",
        "items-start",
        "justify-start",
        "min-w-0",
        "pt-0",
      );

      createListActions(product);
    });

    updateViewButtons("list");

    applyFiltersAndSort();
  }

  refs.gridView?.addEventListener("click", setGridView);

  refs.listView?.addEventListener("click", setListView);

  // ============================================================
  // PRODUCT ACTIONS
  // ============================================================

  function bindProductActions() {
    originalProducts.forEach((product) => {
      $$('button[type="button"]', product).forEach((button) => {
        const label = normalize(button.getAttribute("aria-label"));

        void product;
        void button;
        void label;
      });
    });
  }

  // ============================================================
  // CLEAR ALL
  // ============================================================

  refs.clearFilters?.addEventListener("click", () => {
    if (refs.priceMin) {
      refs.priceMin.value = refs.priceMin.min || "0";
    }

    if (refs.priceMax) {
      refs.priceMax.value = refs.priceMax.max || "599";
    }

    refs.colorCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    refs.sizeCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    if (refs.colorSearch) {
      refs.colorSearch.value = "";
    }

    if (refs.sizeSearch) {
      refs.sizeSearch.value = "";
    }

    updateOptionSearch(refs.colorSearch, refs.colorOptions, refs.colorCount);

    updateOptionSearch(refs.sizeSearch, refs.sizeOptions, refs.sizeCount);

    updatePriceRange();

    applyFiltersAndSort();
  });

  // ============================================================
  // FOOTER ACCORDION
  // ============================================================

  $$(".footer-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target || "");

      if (!target) {
        return;
      }

      target.classList.toggle("hidden");

      const expanded = !target.classList.contains("hidden");

      button.setAttribute("aria-expanded", String(expanded));

      $(".footer-arrow", button)?.classList.toggle("rotate-180", !expanded);
    });
  });

  // ============================================================
  // OUTSIDE CLICK
  // ============================================================

  document.addEventListener("click", (event) => {
    if (
      refs.accountDropdown &&
      refs.accountButton &&
      !refs.accountDropdown.contains(event.target) &&
      !refs.accountButton.contains(event.target)
    ) {
      closeAccount();
    }

    if (
      refs.sortDropdown &&
      refs.sortButton &&
      !refs.sortDropdown.contains(event.target) &&
      !refs.sortButton.contains(event.target)
    ) {
      closeSortDropdown();
    }
  });

  // ============================================================
  // ESCAPE
  // ============================================================

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeMobileMenu();

    closeSearch();

    closeCart();

    closeFilter();

    closeAccount();

    closeSortDropdown();

    closeMobileSort();
  });

  // ============================================================
  // NOTICE
  // ============================================================

  function showNotice(message) {
    let notice = $("#keswa-mini-notice");

    if (!notice) {
      notice = document.createElement("div");

      notice.id = "keswa-mini-notice";

      notice.className =
        "fixed bottom-5 left-1/2 z-[1200] -translate-x-1/2 rounded bg-black px-4 py-3 text-sm text-white shadow-lg";

      document.body.appendChild(notice);
    }

    notice.textContent = message;

    notice.classList.remove("hidden");

    clearTimeout(noticeTimer);

    noticeTimer = setTimeout(() => {
      notice.classList.add("hidden");
    }, 2200);
  }

  // ============================================================
  // MOBILE BOTTOM NAVIGATION
  // ============================================================

  const mobileBottomNav = document.getElementById("mobile-bottom-nav");

  if (mobileBottomNav) {
    const mobileSearch = mobileBottomNav.querySelector(
      'button[aria-label="Search"]',
    );

    const mobileCart = mobileBottomNav.querySelector(
      'button[aria-label="Cart"]',
    );

    const mobileAccount = mobileBottomNav.querySelector(
      'button[aria-label="Account"]',
    );

    mobileSearch?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();
    });

    mobileCart?.addEventListener("click", () => {
      openCart();
    });

    mobileAccount?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();
    });
  }

  // ============================================================
  // MOBILE FILTER / SORT BAR
  // ============================================================

  const mobileFilterSortBar = document.getElementById("mobile-filter-sort-bar");

  if (mobileFilterSortBar) {
    const mobileFilter = document.getElementById("mobile-filter-button");

    const mobileSort = document.getElementById("mobile-sort-button");

    // ----------------------------------------------------------
    // Force the bar to be FLEX on mobile
    // ----------------------------------------------------------

    function updateMobileBarVisibility() {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // IMPORTANT:
        // Remove hidden AND add flex.
        mobileFilterSortBar.classList.remove("hidden");

        mobileFilterSortBar.classList.add("flex");
      } else {
        // Desktop:
        // Hide the mobile bar.
        mobileFilterSortBar.classList.add("hidden");

        mobileFilterSortBar.classList.remove("flex");
      }
    }

    updateMobileBarVisibility();

    window.addEventListener("resize", updateMobileBarVisibility);

    // ----------------------------------------------------------
    // MOBILE FILTER
    // ----------------------------------------------------------

    mobileFilter?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      if (window.innerWidth >= 768) {
        return;
      }

      openFilter();
    });

    // ----------------------------------------------------------
    // MOBILE SORT
    // ----------------------------------------------------------

    mobileSort?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      if (window.innerWidth >= 768) {
        return;
      }

      openMobileSort();
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  updateViewButtons("grid");

  updatePriceRange();

  updateOptionSearch(refs.colorSearch, refs.colorOptions, refs.colorCount);

  updateOptionSearch(refs.sizeSearch, refs.sizeOptions, refs.sizeCount);

  updateCartBadge();

  renderCart();

  bindProductActions();

  applyFiltersAndSort();

  createMobileSortSheet();

  updateMobileSortSelection();

  // Make sure mobile Filter / Sort starts correctly.
  updateHeader();
})();
