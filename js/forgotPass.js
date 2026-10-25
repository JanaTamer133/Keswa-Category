const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
// Validate Email
function validateEmail() {
  const email = emailInput.value.trim();
  if (!email) {
    emailError.textContent = "Email address is required.";
    emailError.classList.remove("hidden");
    emailInput.classList.add("border-red-600");
    return false;
  }
  if (!emailInput.validity.valid) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.classList.remove("hidden");
    emailInput.classList.add("border-red-600");
    return false;
  }
  emailError.textContent = "";
  emailError.classList.add("hidden");
  emailInput.classList.remove("border-red-600");
  return true;
}
// Check while typing
emailInput.addEventListener("input", validateEmail);
// Save Data
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();// prevents the page from reloading when we tap submit
  if (!validateEmail()) {
    emailInput.focus();
    return;
  }
  // save data
  const savedData = JSON.parse(localStorage.getItem("userData") || "{}");
  // Update email
  savedData.email = emailInput.value.trim();
  localStorage.setItem("userData", JSON.stringify(savedData));
  // Clear input
  loginForm.reset();
  // Clear error message
  emailError.textContent = "";
  emailError.classList.add("hidden");
  emailInput.classList.remove("border-red-600");
});