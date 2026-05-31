const API_BASE = "https://api-receitas-pi.vercel.app";

const user = getLoggedUser();

if (!user) {
window.location.href = "login.html";
}

document.getElementById("profile-avatar").textContent = user.avatar;
document.getElementById("profile-name").textContent = user.name;
document.getElementById("profile-email").textContent = user.email;
document.getElementById("profile-bio").textContent = user.bio;

document.getElementById("logout-btn").addEventListener("click", () => {
logout();
});

async function loadFavorites() {
const favStatus = document.getElementById("fav-status");
const favGrid = document.getElementById("fav-grid");

if (!user.favorites.length) {
favStatus.textContent = "Voce ainda nao tem receitas favoritas. Explore o catalogo e favorite as que mais gostar!";
favGrid.innerHTML = "";
return;
}

favStatus.textContent = "Carregando favoritas...";
favGrid.innerHTML = Array.from({ length: 3 }, () => '<div class="skeleton" aria-hidden="true"></div>').join("");

try {
const recipes = await Promise.all(
user.favorites.map(async (id) => {
const response = await fetch(`${API_BASE}/receitas/${encodeURIComponent(id)}`);
if (!response.ok) return null;
const payload = await response.json();
return payload?.receita && typeof payload.receita === "object" ? payload.receita : payload;
})
);

const valid = recipes.filter(Boolean);
favStatus.textContent = `${valid.length} receita${valid.length > 1 ? "s" : ""} favorita${valid.length > 1 ? "s" : ""}`;

favGrid.innerHTML = valid.map((recipe) => {
const image = String(recipe?.link_imagem || "").trim();
const title = recipe?.receita || "Receita";
const type = recipe?.tipo || "receita";
const imgTag = image
? `<img src="${image}" alt="${title}" loading="lazy" onerror="this.replaceWith(createImageFallback())">`
: `<div class="image-fallback" aria-hidden="true"><i class="fas fa-utensils"></i></div>`;

return `
<a class="recipe-card" href="index.html" aria-label="Ver ${title}">
${imgTag}
<div class="recipe-card-body">
<span class="recipe-type">${type}</span>
<h3>${title}</h3>
</div>
</a>
`;
}).join("");
} catch (error) {
favStatus.textContent = "Nao foi possivel carregar as receitas favoritas.";
favGrid.innerHTML = "";
}
}

function createImageFallback() {
const fallback = document.createElement("div");
fallback.className = "image-fallback";
fallback.setAttribute("aria-hidden", "true");
fallback.innerHTML = '<i class="fas fa-utensils"></i>';
return fallback;
}

loadFavorites();
