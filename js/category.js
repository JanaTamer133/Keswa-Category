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
    // Mobile menu
    mobileMenu: $("#mobile-menu"),
    openMobileMenu: $("#open-mobile-menu"),
    closeMobileMenu: $("#close-mobile-menu"),
    mobileMenuBackdrop: $("#mobile-menu-backdrop"),
    mobileMenuPanel: $("#mobile-menu-panel"),

    // Search
    searchButton: $("#header-search-button"),
    searchOverlay: $("#search-overlay"),
    searchPanel: $("#search-panel"),
    closeSearch: $("#close-search"),
    searchInput: $("#header-search-input"),

    // Cart
    cartButton: $("#header-cart-button"),
    cartOverlay: $("#cart-overlay"),
    cartDrawer: $("#cart-drawer"),
    closeCart: $("#close-cart"),

    // Account
    accountButton: $("#header-account-button"),
    accountDropdown: $("#account-dropdown"),

    // Filter
    filterButton: $("#filter-button"),
    filterOverlay: $("#filter-overlay"),
    filterPanel: $("#filter-panel"),
    closeFilter: $("#close-filter"),
    clearFilters: $("#clear-filters"),

    // Products
    productsContainer: $("#products-container"),
    noProductsMessage: $("#no-products-message"),

    // Sort
    sortButton: $("#sort-button"),
    sortDropdown: $("#sort-dropdown"),
    sortSelected: $("#sort-selected"),
    sortOptions: $$(".sort-option"),

    // Views
    listView: $("#list-view"),
    gridView: $("#grid-view"),

    // Price
    priceMin: $("#price-min"),
    priceMax: $("#price-max"),
    priceRangeText: $("#price-range-text"),
    priceRangeTrack: $("#price-range-track"),

    // Colors
    colorSearch: $("#color-search"),
    colorOptions: $$(".color-option"),
    colorCount: $("#color-count"),
    colorCheckboxes: $$('input[name="color-filter"]'),

    // Sizes
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

    // Top header
    if (topHeader) {
      topHeader.style.display = isMobile ? "none" : "";
    }

    // Desktop content
    [desktopLogo, desktopNavigation, desktopActions].forEach((element) => {
      if (!element) {
        return;
      }

      element.style.display = isMobile ? "none" : "";
    });

    // IMPORTANT:
    // Search icon stays visible in both desktop and mobile.
    // User icon stays visible in both desktop and mobile.
    // Their actions are controlled separately below.

    // Mobile header
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
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================

  function openMobileMenu() {
    if (!refs.mobileMenu) {
      return;
    }

    if (!refs.mobileMenu.classList.contains("hidden")) {
      return;
    }

    closeAllExcept("mobile");

    showElement(refs.mobileMenu);

    lockBody();
  }

  function closeMobileMenu() {
    if (!refs.mobileMenu) {
      return;
    }

    if (refs.mobileMenu.classList.contains("hidden")) {
      return;
    }

    hideElement(refs.mobileMenu);

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
    if (!refs.searchOverlay) {
      return;
    }

    // Responsive:
    // Search icon stays visible but does nothing.
    if (window.innerWidth < 768) {
      return;
    }

    if (!refs.searchOverlay.classList.contains("hidden")) {
      refs.searchInput?.focus();

      return;
    }

    closeAllExcept("search");

    showElement(refs.searchOverlay);

    refs.searchButton?.setAttribute("aria-expanded", "true");

    // Desktop only
    lockBody();

    desktopSearchLocked = true;

    setTimeout(() => {
      refs.searchInput?.focus();

      refs.searchInput?.select();
    }, 50);
  }

  function closeSearch() {
    if (!refs.searchOverlay) {
      return;
    }

    if (refs.searchOverlay.classList.contains("hidden")) {
      return;
    }

    hideElement(refs.searchOverlay);

    refs.searchButton?.setAttribute("aria-expanded", "false");

    if (desktopSearchLocked) {
      unlockBody();

      desktopSearchLocked = false;
    }
  }

  // Header Search
  refs.searchButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    // Mobile / Responsive:
    // Visible icon but NO action.
    if (window.innerWidth < 768) {
      return;
    }

    // Desktop:
    // Search works normally.
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

    if (!count) {
      return;
    }

    refs.cartButton.classList.add("relative");

    const badge = document.createElement("span");

    badge.className =
      "cart-count-badge absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none text-white";

    badge.textContent = String(count);

    refs.cartButton.appendChild(badge);

    const mobileCart = document.querySelector(
      '#mobile-bottom-nav button[aria-label="Cart"]',
    );

    if (mobileCart) {
      mobileCart.querySelector(".mobile-cart-count")?.remove();

      if (count) {
        mobileCart.classList.add("relative");

        const mobileBadge = document.createElement("span");

        mobileBadge.className =
          "mobile-cart-count absolute right-[calc(50%-15px)] top-[9px] flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] leading-none text-white";

        mobileBadge.textContent = String(count);

        mobileCart.appendChild(mobileBadge);
      }
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

    closeAllExcept("cart");

    showElement(refs.cartOverlay);

    refs.cartDrawer.classList.remove("translate-x-full");

    requestAnimationFrame(() => {
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

    refs.cartDrawer.classList.remove("translate-x-0");

    refs.cartDrawer.classList.add("translate-x-full");

    hideElement(refs.cartOverlay);

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

    // Only target the Cart Content area.
    // The Cart Header stays untouched.
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
              class="h-[120px] w-[120px] max-md:h-[100px] max-md:w-[100px]"
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
          class="h-24 w-20 shrink-0 rounded object-cover bg-zinc-100"
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

              <span class="flex h-8 min-w-8 items-center justify-center text-sm">
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

  // Desktop User icon
  // Works normally on desktop.
  refs.accountButton?.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    // Responsive:
    // User icon stays visible but does nothing.
    if (window.innerWidth < 768) {
      return;
    }

    // Desktop:
    // User dropdown works normally.
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

    closeAllExcept("filter");

    showElement(refs.filterOverlay);

    requestAnimationFrame(() => {
      refs.filterPanel.classList.remove("-translate-x-full");

      refs.filterPanel.classList.add("translate-x-0");
    });

    refs.filterButton?.setAttribute("aria-expanded", "true");

    lockBody();
  }

  function closeFilter() {
    if (!refs.filterOverlay || !refs.filterPanel) {
      return;
    }

    if (refs.filterOverlay.classList.contains("hidden")) {
      return;
    }

    refs.filterPanel.classList.remove("translate-x-0");

    refs.filterPanel.classList.add("-translate-x-full");

    hideElement(refs.filterOverlay);

    refs.filterButton?.setAttribute("aria-expanded", "false");

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
  // SORT
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
        class="h-[120px] w-[120px]"
      />

      <p class="text-xl font-normal text-black max-md:text-base">
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

    // Wishlist - الشكل فقط
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

    // Add To Cart - الشكل فقط
    const cart = document.createElement("button");

    cart.type = "button";

    cart.setAttribute("aria-label", "Add to cart");

    cart.className =
      "flex h-12 items-center justify-center bg-black px-8 text-sm font-medium text-white transition-all hover:bg-zinc-800";

    cart.textContent = "Add To Cart";

    // No click event.

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

        // Add To Cart - الشكل فقط
        // Wishlist - الشكل فقط
        // Quick View - الشكل فقط
        //
        // No click functionality is attached.

        void product;
        void button;
        void label;
      });
    });
  }

  // ============================================================
  // QUICK VIEW
  // ============================================================
  // Quick View is intentionally disabled.
  // The button remains visible as UI only.

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

    // Search:
    // Visible on responsive but has NO ACTION.
    mobileSearch?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      return;
    });

    mobileCart?.addEventListener("click", () => {
      openCart();
    });

    // Account:
    // Visible on responsive but has NO ACTION.
    mobileAccount?.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      return;
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
})();
