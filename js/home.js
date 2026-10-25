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
const heroSlides = document.getElementById("hero-slides");
const heroSlideItems = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
const footerToggles = document.querySelectorAll(".footer-toggle");
const categoryScroll = document.getElementById("category-scroll");
const categoryPrev = document.getElementById("category-left-arrow");
const categoryNext = document.getElementById("category-right-arrow");
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
// Hero Slider
let currentSlide = 0;
function showSlide(index) {
  currentSlide = index;
  heroSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
  heroDots.forEach((dot, i) => {
    const dotInner = dot.querySelector(".hero-dot-inner");
    if (i === currentSlide) {
      dotInner.classList.remove("bg-black/30");
      dotInner.classList.add("bg-black");
    } else {
      dotInner.classList.remove("bg-black");
      dotInner.classList.add("bg-black/30");
    }
  });
}
// Click on dots
heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = Number(dot.dataset.slide);
    showSlide(slideIndex);
  });
});
// Auto slide
setInterval(() => {
  let nextSlide = currentSlide + 1;
  if (nextSlide >= heroSlideItems.length) {
    nextSlide = 0;
  }
  showSlide(nextSlide);
}, 2000);
// Show first slide
showSlide(0);
// Shop by category arrows
if (categoryScroll && categoryPrev && categoryNext) {
  const step =
    categoryScroll.querySelector(".category-card")?.offsetWidth ||
    categoryScroll.clientWidth / 3;
  categoryNext.onclick = () =>
    categoryScroll.scrollBy({ left: step, behavior: "smooth" });
  categoryPrev.onclick = () =>
    categoryScroll.scrollBy({ left: -step, behavior: "smooth" });
}
// Mobile footer links
footerToggles.forEach((button) => {
  button.onclick = () => {
    document.getElementById(button.dataset.target).classList.toggle("hidden");
    button.querySelector(".footer-arrow").classList.toggle("rotate-180");
  };
});
