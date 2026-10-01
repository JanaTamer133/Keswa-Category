let openMobileMenu = document.getElementById("openMobileMenu");
let mobileMenu = document.querySelector(".mobile-menu");
let closeMobileMenu = document.getElementById("close-mobile-menu");

openMobileMenu.addEventListener("click", () => {
  mobileMenu.classList.add("show");
});

closeMobileMenu.addEventListener("click", () => {
  mobileMenu.classList.remove("show");
});
