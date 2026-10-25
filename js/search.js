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
closeSearch.addEventListener("click", (e) => {
  e.stopPropagation();
  searchOverlay.classList.remove("show");
});
searchHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  searchOverlay.classList.remove("show");
});
// cart overlay
cartHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cartOverlay.classList.toggle("show");
});
cartHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
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
sortDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  sortDropdown.classList.remove("show");
});
// product
let products = [
  {
    id: 1,
    name: "Striped-Short-Sleeve-Shirt",
    price: 349,
    oldPrice: 700,
    sizes: "M,L,XL,XXL",
    colors: "Baje, Mint, Pink, Baby blue",
    img: "https://keswastore.com/cache/medium/product/2387/Ygln7HOKarKu0lId3VwncEHz2PnLd2IPBSZnu1uY.webp",
  },
  {
    id: 2,
    name: "Crinkle-Short-Sleeve-Shirt",
    price: 449,
    oldPrice: 900,
    sizes: "M,L,XL,XXL",
    colors: "Black",
    img: "https://keswastore.com/cache/medium/product/2366/NPilgDjJiTXgCBR20rfWcUmKgkxp19ml0Zt0bygf.webp",
  },
  {
    id: 3,
    name: "Half-Sleeve-Shirt-s25",
    price: 399,
    oldPrice: 800,
    sizes: "M,L,XL,XXL",
    colors: "Black,Baje,Brown,Off-white,Pink,Baby blue",
    img: "https://keswastore.com/cache/medium/product/2359/daDGzq8oxlSuyRBZ4Cygv5YDMHvPAkQr6cYcZ7hy.webp",
  },
  {
    id: 4,
    name: "Oxford-Shirt",
    price: 399,
    oldPrice: 800,
    sizes: "M,L,XL,XXL",
    colors: "Black,White,Baje,Mint,Olive,Brown",
    img: "https://keswastore.com/cache/medium/product/2356/9jhGobddbS80q9HV1dNwiYmdXhd4IqNXtaTmCqR9.webp",
  },
  {
    id: 5,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2357/m143ww6m6sWZcZ2R4V6zS2koWgaGRW38Csdsw7ol.webp",
  },
  {
    id: 6,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2107/zfie7Lym5EpptP2tavsh7doH1tgYtpIB1JI8VvnP.webp",
  },
  {
    id: 7,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2276/D6s82J025KSukVelQOtTzZ3jUNSXY416QiHWYWx0.webp",
  },
  {
    id: 8,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2201/Etqyr5QOkYE9B8nPDkYpET9VEFEIwpsyUkF6Fgxx.webp",
  },
  {
    id: 9,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2175/vInYoXjcQ1zQLHsHDI7G6XoWHqUg1yFc9m2DFpLj.webp",
  },
  {
    id: 10,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2327/SBlIE2cV0HuoAjGFQpQfj6JeDenGvdMaUaEZ9lhL.webp",
  },
  {
    id: 11,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2146/sBoXBhepCO7IcMz4KitPZlvL8uwAfVfSAuWGx899.webp",
  },
  {
    id: 12,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2124/Ms1r2YAMWvUeiWYQtfm3Etf7frWmbiOfdecFG6CI.webp",
  },
  {
    id: 13,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2107/zfie7Lym5EpptP2tavsh7doH1tgYtpIB1JI8VvnP.webp",
  },
  {
    id: 14,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2096/73e4tvDfYzm3EfL0kZLWoDyfvQb51ZIkTtjgzzxP.webp",
  },
  {
    id: 15,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2059/snUUHhazqRLRv8b6Zxn88OaPbchUGYKVDoTX27hF.webp",
  },
  {
    id: 16,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2042/lazP5zZpvgzRkUGD1HZKyh49KyimpHilLObjuqr1.webp",
  },
  {
    id: 17,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/2011/q59oGfHrvV4CVlpBACfpDEYzfbWeuiEgdaMIIZxL.webp",
  },
  {
    id: 18,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1968/nHHom9K70iCnAuB8HuIu5aWUc6o81s6lE2X5Fuqo.webp",
  },
  {
    id: 19,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1912/3mh0zwbsnrrqwi4teaSecv6txp2R7fbYjkQvP2sL.webp",
  },
  {
    id: 20,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1883/mUnUXatmvuPfdVPEh0c9gw4NuC5uubIFKz9wAMOp.webp",
  },
  {
    id: 21,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1858/PZzBXO1m21ZeKaQ3r9lTuwf1VfxXnuMmtR40v7Qs.webp",
  },
  {
    id: 22,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1822/PcvUdgDn1W8j9B5euydzNQyE55zBGH89TDw6Gwmq.webp",
  },
  {
    id: 23,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1754/Qx3AwNW7N4Pvw390HxKDrdYRauEVfB2OpEppjv51.webp",
  },
  {
    id: 24,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1723/Reu7DSWkFKZ581BpbGrYCu55u5jEqTzwrrrJbApB.webp",
  },
  {
    id: 25,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1702/BRdyoBUtcf7SRNGwWwjSrckSBT8pXxQEklcri4at.webp",
  },
  {
    id: 26,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1677/AWmb8fiFobpQY1Fla5Q155YqJEI6M5poOqwhPmTc.webp",
  },
  {
    id: 27,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1652/tN9Q2m6MIZwbQE9NbQqyPJv0X5BWeMs6wL91y5Nl.webp",
  },
  {
    id: 28,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1588/6PfZiPT3uFSeYctqqBtDnBTEEdaON9nztlzVXeob.webp",
  },
  {
    id: 29,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1563/AHRqD8AG9si6V2JYrhvzWp2ecRTJ0S66Xm3oJrUH.webp",
  },
  {
    id: 30,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1538/BcVjqPk7giqNg1t4nhctmKgsX4cnzoabsvWKg001.webp",
  },
  {
    id: 31,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1500/yCfCyuiCCKP8UCjcwobXTYAqtWfPxpTvXHMiGLdl.webp",
  },
  {
    id: 32,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1440/j74N4Ez7jc3tIB1hI6YZcbVaqckhSzQY9A0VkWGc.webp",
  },
  {
    id: 33,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1415/YGOGDzZ8KEIiMThh2Sg1JSHGXqX72CC5JOfXQlMZ.webp",
  },
  {
    id: 34,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1394/tN7l1WCeahIWo1W9AiVlWMMi0Xan7N3Eo5QfKCcP.webp",
  },
  {
    id: 35,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1360/wc3eA4F0ywpuLPyTFcUpqdaR6VPad6ZYEeGVfF8H.webp",
  },
  {
    id: 36,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/1215/WoPbtMBtoL0zTxhPWJXjH7ITYI4n8vxYtriEtQLL.webp",
  },
  {
    id: 37,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "M,L,XL",
    colors: "Black,Gray",
    img: "https://keswastore.com/cache/medium/product/706/3hfRyLB3FFCAxJqRW8RGracYWB4zH7OEK5Tx5yZQ.webp",
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
          src="https://keswastore.com/cache/medium/product/2387/Ygln7HOKarKu0lId3VwncEHz2PnLd2IPBSZnu1uY.webp"          alt="Striped-Short-Sleeve-Shirt"
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
const loadMoreBtn = document.getElementById("load-more");
let visibleProductsCount = 12;
let currentProducts = [...products];

function renderProducts(productsToRender = products, resetPagination = false) {
  if (resetPagination) {
    visibleProductsCount = 12;
  }

  currentProducts = productsToRender;

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

    loadMoreBtn.classList.add("hidden");
    return;
  }

  const visibleProducts = productsToRender.slice(0, visibleProductsCount);

  for (let i = 0; i < visibleProducts.length; i++) {
    let product = visibleProducts[i];

    let newProduct = productCard.cloneNode(true);

    let name = newProduct.querySelector(".product-title");
    name.textContent = product.name;

    let price = newProduct.querySelector(".text-lg p");
    price.innerHTML = `
      ${product.price}
      <span class="text-[0.75em]"> EGP </span>
    `;

    let image = newProduct.querySelector("img");
    image.src = product.img;
    image.alt = product.name;

    let oldPrice = newProduct.querySelector(".text-gray-400 del");
    oldPrice.textContent = product.oldPrice;

    productContainer.appendChild(newProduct);
  }

  // Show / hide Load More
  if (visibleProductsCount < productsToRender.length) {
    loadMoreBtn.classList.remove("hidden");
    loadMoreBtn.classList.add("flex");
  } else {
    loadMoreBtn.classList.add("hidden");
    loadMoreBtn.classList.remove("flex");
  }
}
// sort products
sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    let sortValue = option.dataset.value;
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
    document.getElementById("sort-selected").textContent =
      option.textContent.trim();
    renderProducts(products, true);
    sortDropdown.classList.remove("show");
  });
});
loadMoreBtn.addEventListener("click", () => {
  visibleProductsCount += 12;
  renderProducts(currentProducts);
});
renderProducts(products, true);
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
priceMin.addEventListener("input", function () {
  priceRangeText.textContent = `${priceMin.value} EGP - ${priceMax.value} EGP`;
});
priceMax.addEventListener("input", function () {
  priceRangeText.textContent = `${priceMin.value} EGP - ${priceMax.value} EGP`;
});
function filterByPrice() {
  const minPrice = Number(priceMin.value);
  const maxPrice = Number(priceMax.value);
  const filteredProducts = products.filter(function (product) {
    return product.price >= minPrice && product.price <= maxPrice;
  });
  renderProducts(filteredProducts, true);
}
priceMin.addEventListener("input", filterByPrice);
priceMax.addEventListener("input", filterByPrice);
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
const colorFilters = document.querySelectorAll('input[name="color-filter"]');
colorFilters.forEach((color) => {
  color.addEventListener("change", filterByColor);
});
function filterByColor() {
  const selectedColors = Array.from(colorFilters)
    .filter((color) => color.checked)
    .map((color) => color.value);
  if (selectedColors.length === 0) {
    renderProducts(products, true);
    return;
  }
  const filteredProducts = products.filter((product) => {
    const productColors = product.colors.split(",").map((c) => c.trim());
    return selectedColors.some((selectedColor) =>
      productColors.includes(selectedColor),
    );
  });
  renderProducts(filteredProducts, true);
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
    renderProducts(products, true);
    return;
  }
  const filteredProducts = products.filter((product) => {
    const productSizes = product.sizes.split(",").map((size) => size.trim());
    return selectedSizes.some((selectedSize) =>
      productSizes.includes(selectedSize),
    );
  });
  renderProducts(filteredProducts, true);
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
  priceRangeText.textContent = `${priceMin.value} EGP - ${priceMax.value} EGP`;
  // show all products
  renderProducts(products, true);
});
// Mobile Footer Dropdown
const footerToggles = document.querySelectorAll(".footer-toggle");
footerToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const arrow = button.querySelector(".footer-arrow");
    target.classList.toggle("hidden");
    arrow.classList.toggle("rotate-180");
  });
});
