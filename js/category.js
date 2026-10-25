const showBtn = document.getElementById("open-mobile-menu");
const hideBtn = document.getElementById("close-mobile-menu");
const mobileMenu = document.getElementById("mobile-menu");
const searchHeaderBtn = document.getElementById("header-search-button");
const searchOverlay = document.getElementById("search-overlay");
const searchPanel = document.getElementById("search-panel");
const closeSearch = document.getElementById("close-search");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("close-cart");
const cartHeaderBtn = document.getElementById("header-cart-button");
const userHeaderBtn = document.getElementById("header-account-button");
const accountDropdown = document.getElementById("account-dropdown");
const sortButton = document.getElementById("sort-button");
const sortDropdown = document.getElementById("sort-dropdown");
const sortOptions = sortDropdown.querySelectorAll(".sort-option");
const productContainer = document.getElementById("products-container");
const listView = document.getElementById("list-view");
const gridView = document.getElementById("grid-view");
const filterBtn = document.getElementById("filter-button");
const filterOverlay = document.getElementById("filter-overlay");
const filterpanel = document.getElementById("filter-panel");
const filterClose = document.getElementById("close-filter");
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");
const priceRangeText = document.getElementById("price-range-text");
const colorSearch = document.getElementById("color-search");
const colorOptions = document.getElementById("color-options");
const colorCount = document.getElementById("color-count");
const sizeSearch = document.getElementById("size-search");
const sizeCount = document.getElementById("size-count");
const sizeOptions = document.getElementById("size-options");
const clearAllBtn = document.getElementById("clear-all");
const mobileFilterBtn = document.getElementById("mobile-filter-button");
const priceTrack = document.getElementById("price-range-track");
const footerToggles = document.querySelectorAll(".footer-toggle");
const mobileSortBtn = document.getElementById("mobile-sort-button");
const mobileSortOverlay = document.getElementById("mobile-sort-overlay");
const mobileSortPanel = document.getElementById("mobile-sort-panel");
const closeMobileSort = document.getElementById("close-mobile-sort");
const mobileSortOptions = document.querySelectorAll(".mobile-sort-option");
// mobile burger menu
showBtn.addEventListener("click", () => {
  mobileMenu.classList.add("show");
});
hideBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("show");
});
// search overlay
searchHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchOverlay.classList.toggle("show");
});
document.addEventListener("click", () => {
  searchOverlay.classList.remove("show");
});
// cart overlay
cartHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cartOverlay.classList.toggle("show");
});
document.addEventListener("click", () => {
  cartOverlay.classList.remove("show");
});
// account dropdown
userHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  accountDropdown.classList.add("show");
});
document.addEventListener("click", () => {
  accountDropdown.classList.remove("show");
});
// sort dropdown
sortButton.addEventListener("click", (e) => {
  e.stopPropagation();
  sortDropdown.classList.toggle("show");
});
document.addEventListener("click", () => {
  sortDropdown.classList.remove("show");
});
// products
let products = [
  {
    id: 1,
    name: "Striped-Short-Sleeve-Shirt",
    price: 349,
    oldPrice: 700,
    sizes: "M,L,XL,XXL",
    colors: "Baje, Mint, Pink, Baby blue",
    img: "https://keswastore.com/cache/medium/product/2107/zfie7Lym5EpptP2tavsh7doH1tgYtpIB1JI8VvnP.webp",
  },
  {
    id: 2,
    name: "Crinkle-Short-Sleeve-Shirt",
    price: 449,
    oldPrice: 900,
    sizes: "M,L,XL,XXL",
    colors: "Black",
    img: "https://keswastore.com/cache/medium/product/2042/lazP5zZpvgzRkUGD1HZKyh49KyimpHilLObjuqr1.webp",
  },
  {
    id: 3,
    name: "Half-Sleeve-Shirt-s25",
    price: 399,
    oldPrice: 800,
    sizes: "M,L,XL,XXL",
    colors: "Black,Baje,Brown,Off-white,Pink,Baby blue",
    img: "https://keswastore.com/cache/medium/product/1883/mUnUXatmvuPfdVPEh0c9gw4NuC5uubIFKz9wAMOp.webp",
  },
  {
    id: 4,
    name: "Oxford-Shirt",
    price: 399,
    oldPrice: 800,
    sizes: "M,L,XL,XXL",
    colors: "Black,White,Baje,Mint,Olive,Brown",
    img: "https://keswastore.com/cache/medium/product/1858/PZzBXO1m21ZeKaQ3r9lTuwf1VfxXnuMmtR40v7Qs.webp",
  },
  {
    id: 5,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1652/tN9Q2m6MIZwbQE9NbQqyPJv0X5BWeMs6wL91y5Nl.webp",
  },
];
let productCard = document.createElement("div");
productCard.innerHTML = `
  <div
    class="product-card w-full min-w-0"
    data-price="420"
    data-color="Black"
    data-size="M,L,XL"
  >
    <div class="img group relative aspect-[5/7] overflow-hidden rounded-md">
      <a href="#" aria-label="Striped-Short-Sleeve-Shirt">
        <img
          class="h-full w-full bg-zinc-100 object-cover transition-all duration-500 group-hover:scale-110"
          src="https://keswastore.com/cache/medium/product/2107/zfie7Lym5EpptP2tavsh7doH1tgYtpIB1JI8VvnP.webp"
          alt="Striped-Short-Sleeve-Shirt"
          loading="lazy"
          decoding="async"
        />
      </a>
      <p
        class="absolute top-1.5 inline-block rounded-[44px] bg-secondary px-2.5 text-sm text-white max-sm:rounded-l-none max-sm:rounded-r-xl max-sm:px-2 max-sm:py-0.5 max-sm:text-xs ltr:left-1.5 max-sm:ltr:left-0 rtl:right-5 max-sm:rtl:right-0"
      >
        Sale
      </p>
      <div
        class="action-btns absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5"
      >
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-xs bg-white p-2 text-black shadow-sm transition-all duration-300 hover:bg-black hover:text-white md:translate-y-[100px] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 max-md:h-7 max-md:w-7"
          aria-label="Add to cart"
        >
          <svg class="h-5 w-5">
            <use href="./assests/icons.svg#bag"></use>
          </svg>
        </button>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-xs bg-white p-2 text-black shadow-sm transition-all delay-100 duration-300 hover:bg-black hover:text-white md:translate-y-[100px] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 max-md:h-7 max-md:w-7"
          aria-label="Add to Wishlist"
        >
          <svg class="h-5 w-5">
            <use href="./assests/icons.svg#wishlist"></use>
          </svg>
        </button>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-xs bg-white p-2 text-black shadow-sm transition-all delay-200 duration-300 hover:bg-black hover:text-white md:translate-y-[100px] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 max-md:h-7 max-md:w-7"
          aria-label="Quick View"
        >
          <svg class="h-5 w-5">
            <use href="./assests/icons.svg#eye"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="grid content-start gap-1 bg-white py-3">
      <p
        class="product-title text-base font-semibold max-md:mb-1.5 max-sm:text-sm"
      >
        Striped-Short-Sleeve-Shirt
      </p>
      <div
        class="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-lg font-medium max-sm:text-sm"
      >
        <p>
          375
          <span class="text-[0.75em]"> EGP </span>
        </p>
        <p class="text-base font-normal text-gray-400 max-sm:text-xs">
          <del>700</del>
          <span class="text-[0.75em]">
            <del>EGP</del>
          </span>
        </p>
      </div>
        <div class="list-action-btns">
          <button type="button" class="list-wishlist-btn" aria-label="Add to Wishlist">
            <svg>
              <use href="./assests/icons.svg#wishlist"></use>
            </svg>
          </button>
          <button type="button" class="list-cart-btn">
            Add To Cart
          </button>
        </div>
    </div>
  </div>
`;
function renderProducts(productsToRender = products) {
  productContainer.innerHTML = "";
  if (productsToRender.length === 0) {
    productContainer.innerHTML = `
      <div class="col-span-full flex min-h-[500px] w-full flex-col items-center justify-center gap-5 py-10 text-center">
        <img
          src="https://keswastore.com/themes/shop/default/build/assets/shopping-cart-placeholder-a8WmYsMY.svg"
          alt="No products available"
          class="h-[170px] w-[170px]"
        />
        <p class="text-xl font-normal text-black max-md:text-base">
          No products available in this category
        </p>
      </div>
    `;
    return;
  }
  for (let i = 0; i < productsToRender.length; i++) {
    let product = productsToRender[i];
    let newProduct = productCard.cloneNode(true);
    let name = newProduct.querySelector(".product-title");
    name.textContent = product.name;
    let price = newProduct.querySelector(".text-lg p");
    price.innerHTML = `
      ${product.price}
      <span class="text-[0.75em]">EGP</span>
    `;
    let image = newProduct.querySelector("img");
    image.src = product.img;
    image.alt = product.name;
    let oldPrice = newProduct.querySelector(".text-gray-400 del");
    oldPrice.textContent = product.oldPrice;
    productContainer.appendChild(newProduct);
  }
}
renderProducts();
// sort products
function sortProducts(sortValue) {
  if (sortValue === "a-z") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortValue === "z-a") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sortValue === "newest-first") {
    products.sort((a, b) => a.id - b.id);
  }
  if (sortValue === "oldest-first") {
    products.sort((a, b) => b.id - a.id);
  }
  if (sortValue === "cheapest-first") {
    products.sort((a, b) => a.price - b.price);
  }
  if (sortValue === "expensive-first") {
    products.sort((a, b) => b.price - a.price);
  }
  renderProducts();
}
// desktop sort
sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    sortProducts(option.dataset.value);
    document.getElementById("sort-selected").textContent =
      option.textContent.trim();
    sortDropdown.classList.remove("show");
  });
});
// mobile sort sheet
mobileSortBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileSortOverlay.classList.add("show");
});
closeMobileSort.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileSortOverlay.classList.remove("show");
});
mobileSortPanel.addEventListener("click", (e) => {
  e.stopPropagation();
});
mobileSortOverlay.addEventListener("click", () => {
  mobileSortOverlay.classList.remove("show");
});
mobileSortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    sortProducts(option.dataset.value);
    mobileSortOptions.forEach((o) => o.classList.remove("bg-zinc-100"));
    option.classList.add("bg-zinc-100");
    document.getElementById("sort-selected").textContent =
      option.textContent.trim();
    mobileSortOverlay.classList.remove("show");
  });
});
// mobile filter button
mobileFilterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterOverlay.classList.add("show");
});
// list view and grid view
listView.addEventListener("click", () => {
  productContainer.classList.add("list-view");
  productContainer.classList.remove("grid-view");
});
gridView.addEventListener("click", () => {
  productContainer.classList.add("grid-view");
  productContainer.classList.remove("list-view");
});
// filter overlay
filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterOverlay.classList.toggle("show");
});
filterClose.addEventListener("click", (e) => {
  e.stopPropagation();
  filterOverlay.classList.remove("show");
});
filterpanel.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  filterOverlay.classList.remove("show");
});
// price range filter
function updatePriceUI(changed) {
  if (Number(priceMin.value) > Number(priceMax.value)) {
    if (changed === priceMin) priceMin.value = priceMax.value;
    else priceMax.value = priceMin.value;
  }
  const min = Number(priceMin.value);
  const max = Number(priceMax.value);
  const total = Number(priceMax.max) - Number(priceMax.min) || 1; //the ||1 bec. if result = 0 it may cause problem as NaN.
  priceTrack.style.left = ((min - Number(priceMin.min)) / total) * 100 + "%";
  priceTrack.style.width = ((max - min) / total) * 100 + "%";
  if (min > Number(priceMax.max) / 2) {
    priceMin.style.zIndex = 30;
  } else {
    priceMin.style.zIndex = 20;
  }
  priceRangeText.textContent = `${min} EGP - ${max} EGP`;
}
function filterByPrice() {
  const minPrice = Number(priceMin.value);
  const maxPrice = Number(priceMax.value);
  const filteredProducts = products.filter(function (product) {
    return product.price >= minPrice && product.price <= maxPrice;
  });
  renderProducts(filteredProducts);
}
// To update value of both min & max
priceMin.addEventListener("input", () => {
  updatePriceUI(priceMin);
  filterByPrice();
});
priceMax.addEventListener("input", () => {
  updatePriceUI(priceMax);
  filterByPrice();
});
updatePriceUI();
// color search filter
colorSearch.addEventListener("input", function () {
  let searchValue = colorSearch.value.toLowerCase().trim();
  let colorLabels = colorOptions.querySelectorAll("label");
  let visibleCount = 0;
  colorLabels.forEach(function (label) {
    let colorName = label.textContent.toLowerCase().trim();
    if (colorName.includes(searchValue)) {
      label.style.display = "";
      visibleCount++;
    } else {
      label.style.display = "none";
    }
  });
  colorCount.textContent = `Showing ${visibleCount} of ${colorLabels.length} options`;
});
// color filter
const colorFilters = document.querySelectorAll('input[name="color-filter"]'); // get all check boxes of colors
colorFilters.forEach((color) => {
  color.addEventListener("change", filterByColor); //checked or unchecked
});
function filterByColor() {
  const selectedColors = Array.from(colorFilters) // convert the collection to an array
    .filter((color) => color.checked) // keep only checked color inputs
    .map((color) => color.value); // get the values of the selected colors
  if (selectedColors.length === 0) {
    // check if no colors are selected
    renderProducts(); // display all products
    return; // exit the function
  }
  const filteredProducts = products.filter((product) => {
    // Filter products based on selected colors
    const productColors = product.colors.split(",").map((c) => c.trim()); // Split the color string into an array, // Remove spaces from each color
    return selectedColors.some(
      (
        selectedColor, // Check if at least one selected color matches
      ) => productColors.includes(selectedColor), // Check if the product has this color
    );
  });
  renderProducts(filteredProducts);
}
// size search filter
sizeSearch.addEventListener("input", function () {
  let searchValue = sizeSearch.value.toLowerCase().trim();
  let sizeLabels = sizeOptions.querySelectorAll("label");
  let visibleCount = 0;
  sizeLabels.forEach(function (label) {
    let sizeName = label.textContent.toLowerCase().trim();
    if (sizeName.includes(searchValue)) {
      label.style.display = "";
      visibleCount++;
    } else {
      label.style.display = "none";
    }
  });
  sizeCount.textContent = `Showing ${visibleCount} of ${sizeLabels.length} options`;
});
// size filter
const sizeFilters = document.querySelectorAll('input[name="size-filter"]');
sizeFilters.forEach((size) => {
  size.addEventListener("change", filterBySize);
});
function filterBySize() {
  const selectedSizes = Array.from(sizeFilters)
    .filter((size) => size.checked)
    .map((size) => size.value);

  if (selectedSizes.length === 0) {
    renderProducts();
    return;
  }
  const filteredProducts = products.filter((product) => {
    const productSizes = product.sizes.split(",").map((size) => size.trim());
    return selectedSizes.some((selectedSize) =>
      productSizes.includes(selectedSize),
    );
  });
  renderProducts(filteredProducts);
}
// clear all btn
clearAllBtn.addEventListener("click", () => {
  // clear color
  colorFilters.forEach((color) => {
    color.checked = false;
  });
  // clear size
  sizeFilters.forEach((size) => {
    size.checked = false;
  });
  // clear searches
  colorSearch.value = "";
  sizeSearch.value = "";
  // reset price
  priceMin.value = priceMin.min;
  priceMax.value = priceMax.max;
  // show all color options
  colorOptions.querySelectorAll("label").forEach((label) => {
    label.style.display = "";
  });
  // show all size options
  sizeOptions.querySelectorAll("label").forEach((label) => {
    label.style.display = "";
  });
  // reset counts
  colorCount.textContent = `Showing ${colorOptions.querySelectorAll("label").length} of ${colorOptions.querySelectorAll("label").length} options`;
  sizeCount.textContent = `Showing ${sizeOptions.querySelectorAll("label").length} of ${sizeOptions.querySelectorAll("label").length} options`;
  // reset price text
  updatePriceUI();
  // show all products
  renderProducts();
});
// Mobile footer links
footerToggles.forEach((button) => {
  button.onclick = () => {
    document.getElementById(button.dataset.target).classList.toggle("hidden");
    button.querySelector(".footer-arrow").classList.toggle("rotate-180");
  };
});
