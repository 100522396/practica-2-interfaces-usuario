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
