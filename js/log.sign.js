const showPassword = document.getElementById("show-password");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
// Show / Hide Password
showPassword.addEventListener("change", () => {
  if (showPassword.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});
// Show Error
function showError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  input.classList.add("border-red-600");
}
// Clear Error
function clearError(input, errorElement) {
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
  input.classList.remove("border-red-600");
}
// Validate Email
function validateEmail() {
  const email = emailInput.value.trim();
  if (!email) {
    showError(emailInput, emailError, "Email address is required.");
    return false;
  }
  if (!emailInput.validity.valid) {
    showError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }
  clearError(emailInput, emailError);
  return true;
}
// Validate Password
function validatePassword() {
  const password = passwordInput.value;
  if (!password) {
    showError(passwordInput, passwordError, "Password is required.");
    return false;
  }
  clearError(passwordInput, passwordError);
  return true;
}
// Validate While Typing
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);
// Save Data
loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevents the page from reloading when we tap submit
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  if (!isEmailValid || !isPasswordValid) {
    return;
  }
  // save user data in local storage
  const userData = {
    email: emailInput.value.trim(),
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  loginForm.reset();
  // Hide password again
  passwordInput.type = "password";
  // Reset checkbox
  showPassword.checked = false;
  // Clear errors
  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);
});
