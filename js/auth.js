const USERS = {
  "test@gmail": {
    password: "1234",
    name: "Chef Teste",
    avatar: "CT",
    bio: "Amante de cozinha caseira e receitas praticas.",
    favorites: ["1", "2", "3"],
  },
  "maria@email.com": {
    password: "1234",
    name: "Maria Silva",
    avatar: "MS",
    bio: "Cozinheira por hobby, explorando sabores novos.",
    favorites: [],
  },
};

function getLoggedUser() {
  const email = localStorage.getItem("loggedUser");
  if (!email) return null;
  return { email, ...USERS[email] } || null;
}

function login(email, password) {
  const user = USERS[email];
  if (!user || user.password !== password) return null;
  localStorage.setItem("loggedUser", email);
  return { email, ...user };
}

function logout() {
  localStorage.removeItem("loggedUser");
}

function toggleFavorite(recipeId) {
  const email = localStorage.getItem("loggedUser");
  if (!email || !USERS[email]) return false;

  const favs = USERS[email].favorites;
  const index = favs.indexOf(String(recipeId));

  if (index === -1) {
    favs.push(String(recipeId));
  } else {
    favs.splice(index, 1);
  }

  return true;
}

function isFavorite(recipeId) {
  const email = localStorage.getItem("loggedUser");
  if (!email || !USERS[email]) return false;
  return USERS[email].favorites.includes(String(recipeId));
}

function updateTopbar() {
  const link = document.querySelector(".login-link");
  if (!link) return;

  const user = getLoggedUser();
  if (user) {
    link.href = "perfil.html";
    link.textContent = user.name;
    link.innerHTML = `<i class="fas fa-user" aria-hidden="true"></i> ${user.name}`;
  } else {
    link.href = "login.html";
    link.textContent = "Login";
  }
}

document.addEventListener("DOMContentLoaded", updateTopbar);
