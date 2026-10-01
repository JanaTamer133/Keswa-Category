let showBtn = document.getElementById("open-mobile-menu");
let hideBtn = document.getElementById("close-mobile-menu");
let mobileMenu = document.getElementById("mobile-menu");
let searchHeaderBtn = document.getElementById("header-search-button");
let searchOverlay = document.getElementById("search-overlay");
let searchPanel = document.getElementById("search-panel");
let closeSearch = document.getElementById("close-search");
let cartOverlay = document.getElementById("cart-overlay");
let cartClose = document.getElementById("close-cart");
let cartHeaderBtn = document.getElementById("header-cart-button");
let userHeaderBtn = document.getElementById("header-account-button");
let accountDropdown = document.getElementById("account-dropdown");
let sortButton = document.getElementById("sort-button");
let sortDropdown = document.getElementById("sort-dropdown");
let sortOptions = sortDropdown.querySelectorAll(".sort-option");
let productContainer = document.getElementById("products-container");
let listView = document.getElementById("list-view");
let gridView = document.getElementById("grid-view");
let filterOverlay = document.getElementById("filter-overlay");
let filterBtn = document.getElementById("filter-button");
let filterpanel = document.getElementById("filter-panel");
let filterClose = document.getElementById("close-filter");

showBtn.addEventListener("click", () => {
  mobileMenu.classList.add("show");
});
hideBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("show");
});
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

userHeaderBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  accountDropdown.classList.add("show");
});
document.addEventListener("click", () => {
  accountDropdown.classList.remove("show");
});
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
let products = [
  {
    id: 1,
    name: "Striped-Short-Sleeve-Shirt",
    price: 349,
    oldPrice: 700,
    sizes: "S,M,L,XL,XXL,XXXL",
    colors: "White,Black,Baje",
    img: "https://keswastore.com/cache/medium/product/2107/zfie7Lym5EpptP2tavsh7doH1tgYtpIB1JI8VvnP.webp",
  },
  {
    id: 2,
    name: "Crinkle-Short-Sleeve-Shirt",
    price: 449,
    oldPrice: 900,
    sizes: "S,M,L,XL,XXL,XXXL",
    colors: "White,Black,Baje",
    img: "https://keswastore.com/cache/medium/product/2042/lazP5zZpvgzRkUGD1HZKyh49KyimpHilLObjuqr1.webp",
  },
  {
    id: 3,
    name: "Half-Sleeve-Shirt-s25",
    price: 399,
    oldPrice: 800,
    sizes: "S,M,L,XL,XXL,XXXL",
    colors: "White,Black,Baje",
    img: "https://keswastore.com/cache/medium/product/1883/mUnUXatmvuPfdVPEh0c9gw4NuC5uubIFKz9wAMOp.webp",
  },
  {
    id: 4,
    name: "Oxford-Shirt",
    price: 399,
    oldPrice: 800,
    sizes: "S,M,L,XL,XXL,XXXL",
    colors: "White,Black,Baje",
    img: "https://keswastore.com/cache/medium/product/1858/PZzBXO1m21ZeKaQ3r9lTuwf1VfxXnuMmtR40v7Qs.webp",
  },
  {
    id: 5,
    name: "Cotton-Shirt-Relaxed",
    price: 499,
    oldPrice: 1000,
    sizes: "S,M,L,XL,XXL,XXXL",
    colors: "White,Black,Baje",
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
function renderProducts() {
  productContainer.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
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
}
renderProducts();
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
    renderProducts();
    sortDropdown.classList.remove("show");
  });
});
listView.addEventListener("click", () => {
  productContainer.classList.add("list-view");
  productContainer.classList.remove("grid-view");
});
gridView.addEventListener("click", () => {
  productContainer.classList.add("grid-view");
  productContainer.classList.remove("list-view");
});
filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterOverlay.classList.toggle("show");
});
filterClose.addEventListener("click", (e) => {
  e.stopPropagation();
  filterOverlay.classList.remove("show");
});
document.addEventListener("click", () => {
  filterOverlay.classList.remove("show");
});
