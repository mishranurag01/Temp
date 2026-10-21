tailwind.config = {
      theme: {
        extend: {
          colors: {
            cream: '#F5F0E4',
            'cream-light': '#FAF7EE',
            'deep-black': '#171613',
            'gold': '#C5A15D',
            'gold-light': '#D8BA7A',
            'gold-dark': '#A3813E',
          },
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
            sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
          },
          letterSpacing: {
            'widest-brand': '0.35em',
            'subtle-wide': '0.2em',
            'micro': '0.12em',
          }
        }
      }
    }

// Keep the small page independent of a framework build step.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Keep touch devices calm, but let a tapped artwork retain its luminous selected state.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const artworkNodes = document.querySelectorAll(".interactive-symbol-node");
  if (!finePointer) {
    artworkNodes.forEach((node) => {
      node.classList.remove("animate-float-1", "animate-float-2", "animate-float-3");
    });
  }

  artworkNodes.forEach((node) => {
    const toggleSelection = () => {
      const shouldSelect = !node.classList.contains("is-selected");
      artworkNodes.forEach((other) => {
        other.classList.remove("is-selected");
        other.setAttribute("aria-pressed", "false");
      });
      if (shouldSelect) {
        node.classList.add("is-selected");
        node.setAttribute("aria-pressed", "true");
      }
    };

    node.addEventListener("click", toggleSelection);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSelection();
      }
      if (event.key === "Escape") {
        node.classList.remove("is-selected");
        node.setAttribute("aria-pressed", "false");
      }
    });
  });
});
