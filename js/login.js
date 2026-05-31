document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");

  togglePassword.addEventListener("click", function () {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const user = login(email, password);

    if (user) {
      window.location.href = "perfil.html";
    } else {
      alert("E-mail ou senha inválidos!");
    }
  });

  const loggedUser = getLoggedUser();
  if (loggedUser) {
    window.location.href = "index.html";
  }
});
