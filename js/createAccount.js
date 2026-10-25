// Create Account Form
const registerForm = document.getElementById("login-form");
const firstNameInput = document.getElementById("fname");
const firstNameError = document.getElementById("fname-error");
const lastNameInput = document.getElementById("lname");
const lastNameError = document.getElementById("lname-error");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const newsletterCheckbox = document.getElementById("subscribe-newsletter");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
// Show error message
function showError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  input.classList.add("border-red-600");
}
// Clear error message
function clearError(input, errorElement) {
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
  input.classList.remove("border-red-600");
}
// Validate first name
function validateFirstName() {
  const fname = firstNameInput.value.trim();
  if (!fname) {
    showError(firstNameInput, firstNameError, "First name is required.");
    return false;
  }
  clearError(firstNameInput, firstNameError);
  return true;
}
// Validate last name
function validateLastName() {
  const lname = lastNameInput.value.trim();
  if (!lname) {
    showError(lastNameInput, lastNameError, "Last name is required.");
    return false;
  }
  clearError(lastNameInput, lastNameError);
  return true;
}
// Validate email
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
// Validate password
function validatePassword() {
  const password = passwordInput.value;
  if (!password) {
    showError(passwordInput, passwordError, "Password is required.");
    return false;
  }
  if (password.length < 8) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters long.",
    );
    return false;
  }
  clearError(passwordInput, passwordError);
  return true;
}
// Validate confirm password
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  if (!confirmPassword) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Please confirm your password.",
    );
    return false;
  }
  if (confirmPassword !== password) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match.",
    );
    return false;
  }
  clearError(confirmPasswordInput, confirmPasswordError);
  return true;
}
// Validate inputs while typing
firstNameInput.addEventListener("input", validateFirstName);
lastNameInput.addEventListener("input", validateLastName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", () => {
  validatePassword();
  if (confirmPasswordInput.value) {
    validateConfirmPassword();
  }
});
confirmPasswordInput.addEventListener("input", validateConfirmPassword);
// Validate form on submit
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();// prevents the page from reloading when we tap submit
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  if (
    !isFirstNameValid ||
    !isLastNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    return;
  }
  // Collect user data
  const user = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    subscribeToNewsletter: newsletterCheckbox.checked,
  };
  // Save data to localStorage
  localStorage.setItem("userData", JSON.stringify(user));
  // Clear all inputs
  registerForm.reset();
  // Clear all error messages
  clearError(firstNameInput, firstNameError);
  clearError(lastNameInput, lastNameError);
  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);
  clearError(confirmPasswordInput, confirmPasswordError);
});
