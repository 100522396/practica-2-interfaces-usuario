$(function () {
  // 1) Datos del carrusel (3 packs mínimo)
  const packs = [
    {
      id: 1,
      title: "Pack 1: Aventura en Islandia",
      desc: "7 días · vuelos + hotel · excursiones",
      img: "images/pack1.jpg"
    },
    {
      id: 2,
      title: "Pack 2: Ciudades nórdicas",
      desc: "10 días · Copenhague, Oslo, Estocolmo",
      img: "images/pack2.jpg"
    },
    {
      id: 3,
      title: "Pack 3: Fiordos y auroras",
      desc: "8 días · ruta por fiordos · tour auroras",
      img: "images/pack3.jpg"
    }
  ];

  // 2) Estado del carrusel
  let index = 0;                 // posición actual
  let autoplayTimer = null;      // id del setInterval

  // 3) Referencias a elementos del DOM (una vez, para no buscarlos cada vez)
  const $img   = $("#pack-image");
  const $title = $("#pack-title");
  const $desc  = $("#pack-desc");
  const $buy   = $("#buy-btn");

  // 4) Función que pinta el pack activo en el DOM
  function render() {
    const pack = packs[index];
    $img.attr("src", pack.img)
        .attr("alt", pack.title);
    $title.text(pack.title);
    $desc.text(pack.desc);
    $buy.attr("data-pack-id", pack.id);
  }

  // 5) Funciones para cambiar de pack
  function next() {
    index = (index + 1) % packs.length;  // avanza y vuelve al principio
    render();
  }
  function prev() {
    index = (index - 1 + packs.length) % packs.length; // retrocede y si es <0, va al último
    render();
  }

  // 6) Autoplay cada 2s
  function startAutoplay() {
    stopAutoplay(); // evita duplicados
    autoplayTimer = setInterval(next, 2000);
  }
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // 7) Eventos de los botones de flecha
  $(".carousel .next").on("click", function () {
    next();
    startAutoplay(); // reinicia el temporizador tras interacción
  });
  $(".carousel .prev").on("click", function () {
    prev();
    startAutoplay();
  });

  // 8) Comprar → ir a versión C con el pack seleccionado
  $buy.on("click", function () {
    const packId = $(this).data("pack-id"); // lee data-pack-id del botón
    // Redirige pasando el id por querystring. Ej: version_c.html?pack=2
    window.location.href = `version_c.html?pack=${packId}`;
  });

  // 9) Accesibilidad: pausa autoplay si el usuario pasa el ratón por encima
  $("#packs-carousel").on("mouseenter", stopAutoplay)
                      .on("mouseleave", startAutoplay);

  // 10) Inicialización
  render();
  startAutoplay();
});
