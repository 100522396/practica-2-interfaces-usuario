// --- Carrousel functionality ---

(function initCarousel() {
  // Find the carousel container
  const container = document.querySelector(".highlighted");
  if (!container) {
    console.warn("No .highlighted element found");
    return;
  }

  // Get all the cards inside the container
  const cards = Array.from(container.querySelectorAll(".highlighted-card"));
  console.log("initCarousel executed. Cards found:", cards.length);
  if (cards.length === 0) return;

  // Current index
  let index = 0;

  // Show only the card at position i
  function showCard(i) {
    cards.forEach((card, k) => {
      // toggle() adds or removes the class depending on the second argument
      card.classList.toggle("active", k === i);
    });
  }

  showCard(index);

  // Find buttons
  const btnPrev = container.querySelector(".prev");
  const btnNext = container.querySelector(".next");

  // Function to move between cards
  function move(delta) {
    index = (index + delta + cards.length) % cards.length;
    showCard(index);
  }

  // Click listeners to buttons
  if (btnPrev) btnPrev.addEventListener("click", () => move(-1));
  if (btnNext) btnNext.addEventListener("click", () => move(+1));

  // Change automaticly every 2 seconds
  setInterval(() => move(+1), 2000);
})();

// Store the selected pack id (solo con data-pack)
(function initBuySelection() {
  const container = document.querySelector(".highlighted");
  if (!container) return;

  container.addEventListener("click", function (ev) {
    const buyLink = ev.target.closest(".buy-button");
    if (!buyLink) return;

    ev.preventDefault();

    const card = buyLink.closest(".highlighted-card");
    if (!card) return;

    const packId = card.getAttribute("data-pack");
    const price = (card.querySelector(".price-tag")?.textContent || "").trim();

    if (!packId) return;

    localStorage.setItem("selectedPackId", packId);
    localStorage.setItem("selectedPackPrice", price);

    // Redirect to buy page
    window.location.href = "buy.html";
  });
})();

(function initBuyPageLongDesc() {
  const titleEl = document.getElementById("pack-title");
  const descEl = document.getElementById("pack-desc");
  const priceEl = document.getElementById("pack-price");
  if (!titleEl || !descEl || !priceEl) return;

  // Dictionary of packs with long descriptions
  const PACKS = {
    asia: {
      title: "Pack Sudeste Asiático",
      longDesc:
        "Explora el corazón del Sudeste Asiático en un viaje lleno de contrastes y culturas milenarias. Este pack te lleva desde los templos de Angkor Wat en Camboya hasta las calles vibrantes de Hanói y los paisajes de la bahía de Ha Long. Incluye transporte en buses locales, alojamiento en hostales cuidadosamente seleccionados y una completa guía para gestionar visados y cruces fronterizos sin complicaciones. Ideal para viajeros jóvenes o mochileros que buscan autenticidad, comida callejera y aventuras inolvidables. Además, recibirás consejos de seguridad, recomendaciones gastronómicas y rutas alternativas menos turísticas para aprovechar al máximo tu experiencia.",
    },
    europe: {
      title: "Pack Europa Central",
      longDesc:
        "Descubre la esencia del viejo continente recorriendo Alemania y Polonia a bordo de trenes panorámicos y rutas urbanas llenas de historia. Este pack incluye billetes de tren entre ciudades clave como Berlín, Cracovia o Varsovia, alojamiento en hostels céntricos con ambiente internacional y acceso gratuito a varios free tours que te permitirán conocer las ciudades de la mano de guías locales. También recibirás un itinerario recomendado con opciones gastronómicas, culturales y de ocio nocturno, así como mapas interactivos y asistencia digital durante el viaje. Perfecto para quienes desean combinar historia, arte y diversión en un solo recorrido europeo.",
    },
    southamerica: {
      title: "Pack Sudamérica",
      longDesc:
        "Embárcate en una travesía inolvidable por los Andes con nuestro pack Sudamérica Oeste. Visita el Machu Picchu en Perú, el Salar de Uyuni en Bolivia y el desierto de Atacama en Chile en un recorrido que combina naturaleza, cultura y aventura. El paquete incluye transporte terrestre en buses turísticos, alojamiento en hostales con encanto y excursiones guiadas por expertos locales. También tendrás acceso a una guía exclusiva con recomendaciones sobre gastronomía local, adaptación a la altitud y consejos para disfrutar de los mercados y festivales tradicionales. Ideal para espíritus aventureros que buscan experiencias auténticas y paisajes únicos.",
    },
  };

  const id = localStorage.getItem("selectedPackId");
  const price = localStorage.getItem("selectedPackPrice") || "";

  let pack;
  if (id) {
    pack = PACKS[id];
  } else {
    pack = null;
  }

  if (!pack) {
    return;
  }

  titleEl.textContent = pack.title;
  descEl.textContent = pack.longDesc;
  priceEl.textContent = price;
})();

// -- End of Carrousel functionality ---

// --- Login functionality ---

function showLoginError(open) {
  var modal = document.getElementById("login-error-modal");
  if (!modal) {
    alert("Usuario o contraseña no válidos.");
    return;
  }
  if (open) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  } else {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
}

var form = document.querySelector(".login-form");
var userInput = document.getElementById("user");
var passInput = document.getElementById("password");
var btnLogin = document.getElementById("btn-login");
var btnClose = document.getElementById("login-error-close");

if (btnClose) {
  btnClose.addEventListener("click", function () {
    showLoginError(false);
  });
}

if (btnLogin) {
  btnLogin.addEventListener("click", function (ev) {
    ev.preventDefault();

    var username = userInput ? userInput.value.trim() : "";
    var password = passInput ? passInput.value : "";

    if (!username || !password) {
      showLoginError(true);
      return;
    }

    // Search for user
    var users = Auth.getUsers();
    var found = null;
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      var loginOk = u.username === username || u.email === username;
      var passOk = u.password === password;
      if (loginOk && passOk) {
        found = u;
        break;
      }
    }

    if (!found) {
      showLoginError(true);
      return;
    }

    // Redirect
    Auth.setAuthUser(found);
    window.location.href = "logged.html";
  });
}

// --- Logged functionality ---

(function showUsername() {
  const nameEl = document.getElementById("profile-name");
  const picEl = document.getElementById("profile-pic");
  if (!nameEl) return;

  // Get current user from localStorage
  const raw = localStorage.getItem("authUser");
  if (!raw) return;

  const user = JSON.parse(raw);

  // Show username and picture
  nameEl.textContent = user.username;

  if (picEl) {
    if (user.avatarDataUrl) {
      picEl.src = user.avatarDataUrl;
      picEl.alt = (user.username || "Usuario") + " - foto de perfil";
    }
  }
})();

// --- Logout functionality ---
(function initLogout() {
  const btnLogout = document.getElementById("btn-logout");
  const modal = document.getElementById("logout-modal");
  const btnConfirm = document.getElementById("confirm-logout");
  const btnCancel = document.getElementById("cancel-logout");

  if (!btnLogout || !modal) return;

  // Prompt modal when clicling on logout button
  btnLogout.addEventListener("click", function (ev) {
    ev.preventDefault();
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  });

  // Hide modal if click on cancel
  btnCancel.addEventListener("click", function () {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });

  // If click on confirm logout and redirecto home
  btnConfirm.addEventListener("click", function () {
    localStorage.removeItem("authUser");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    window.location.href = "index.html";
  });
})();

// --- Advice functionality ---

// Load list from localStorage
function loadAdviceList() {
  var raw = localStorage.getItem("adviceList");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Save lista to localStorage
function saveAdviceList(list) {
  localStorage.setItem("adviceList", JSON.stringify(list));
}

// We generate a unique ID for each advice based on timestamp + random
function adviceID() {
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

// Add a new advice to the list
function addAdvice(title, description, author) {
  var list = loadAdviceList();
  var item = {
    id: adviceID(),
    title: String(title || "").trim(),
    description: String(description || "").trim(),
    author: String(author || "Anónimo").trim(),
    createdAt: Date.now(),
  };
  list.unshift(item);
  saveAdviceList(list);
  return item;
}

// Get last three advices
function getLastThreeAdvice() {
  var list = loadAdviceList();
  return list.slice(0, 3);
}

// Render section with last three advices
function renderLatestAdvice() {
  var listEl = document.getElementById("latest-advice-list");
  if (!listEl) return;

  var last3 = getLastThreeAdvice();
  listEl.innerHTML = "";

  if (last3.length === 0) {
    var li = document.createElement("li");
    li.textContent = "Aún no hay consejos.";
    listEl.appendChild(li);
    return;
  }

  for (var i = 0; i < last3.length; i++) {
    var item = last3[i];
    var li2 = document.createElement("li");
    var a = document.createElement("a");
    // Not a real page
    a.href = "advice.html?id=" + encodeURIComponent(item.id);
    a.textContent = item.title;
    li2.appendChild(a);
    listEl.appendChild(li2);
  }
}

// Initialize advice form
function initAdviceForm() {
  var form = document.getElementById("advice-form");
  if (!form) return;

  var titleEl = document.getElementById("advice-title");
  var descEl = document.getElementById("advice-desc");

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    var title = titleEl && titleEl.value ? titleEl.value.trim() : "";
    var description = descEl && descEl.value ? descEl.value.trim() : "";

    // Validations
    if (title.length < 15) {
      alert("El título debe tener al menos 15 caracteres.");
      if (titleEl) titleEl.focus();
      return;
    }
    if (description.length < 30) {
      alert("La descripción debe tener al menos 30 caracteres.");
      if (descEl) descEl.focus();
      return;
    }

    // Get the author from logged user
    var author = "Anónimo";
    var raw = localStorage.getItem("authUser");
    if (raw) {
      try {
        var u = JSON.parse(raw);
        author = u.username || u.name || "Anónimo";
      } catch (e) {}
    }

    addAdvice(title, description, author);

    renderLatestAdvice();

    if (titleEl) titleEl.value = "";
    if (descEl) descEl.value = "";
    if (titleEl) titleEl.focus();

    alert("Consejo añadido.");
  });
}
renderLatestAdvice();
initAdviceForm();

// --- Buy formulary logic ---

(function initBuyFormValidation() {
  const form = document.getElementById("buy-form");
  if (!form) return;

  const nameEl = document.getElementById("buyer-name");
  const emailEl = document.getElementById("buyer-email");
  const typeEl = document.getElementById("card-type");
  const numEl = document.getElementById("card-number");
  const holderEl = document.getElementById("card-holder");
  const expEl = document.getElementById("card-expiry");
  const cvvEl = document.getElementById("card-cvv");
  const btnClear = document.getElementById("btn-clear");

  function isMinLen3(s) {
    return String(s || "").trim().length >= 3;
  }

  function isEmail(s) {
    // mail regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || "").trim());
  }

  function isCardType(v) {
    return v === "visa" || v === "mc" || v === "amex";
  }

  function digitsOnly(s) {
    return String(s || "").replace(/\D+/g, "");
  }

  function isCardNumberValid(s) {
    const d = digitsOnly(s);
    // valid lenghts: 13, 15, 16, 19
    return (
      d.length === 13 || d.length === 15 || d.length === 16 || d.length === 19
    );
  }

  function isNotExpired(value) {
    if (!value) return false;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1..12

    const parts = value.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    if (year > currentYear) return true;
    if (year === currentYear && month >= currentMonth) return true;
    return false;
  }

  function isCVV3(s) {
    return /^\d{3}$/.test(String(s || "").trim());
  }

  // ---- Submit (Comprar) ----
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    // Validaciones del enunciado
    if (!isMinLen3(nameEl.value)) {
      alert("El nombre completo debe tener al menos 3 caracteres.");
      nameEl.focus();
      return;
    }
    if (!isEmail(emailEl.value)) {
      alert("Introduce un correo electrónico válido (nombre@dominio.ext).");
      emailEl.focus();
      return;
    }
    if (!isCardType(typeEl.value)) {
      alert(
        "Selecciona un tipo de tarjeta: Visa, Mastercard o American Express."
      );
      typeEl.focus();
      return;
    }
    if (!isCardNumberValid(numEl.value)) {
      alert("Número de tarjeta no válido. Debe tener 13, 15, 16 o 19 dígitos.");
      numEl.focus();
      return;
    }
    if (!isMinLen3(holderEl.value)) {
      alert("El nombre del titular debe tener al menos 3 caracteres.");
      holderEl.focus();
      return;
    }
    if (!isNotExpired(expEl.value)) {
      alert("La fecha de caducidad no puede estar expirada.");
      expEl.focus();
      return;
    }
    if (!isCVV3(cvvEl.value)) {
      alert("El CVV debe tener 3 dígitos.");
      cvvEl.focus();
      return;
    }

    // if all validations passes we simulate a successful purchase
    alert("Compra realizada");
    form.reset();
    typeEl.value = "";
  });

  // clear button
  if (btnClear) {
    btnClear.addEventListener("click", function () {
      form.reset();
      typeEl.value = "";
      nameEl.focus();
    });
  }
})();
