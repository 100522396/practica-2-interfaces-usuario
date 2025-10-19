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
