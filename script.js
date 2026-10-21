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

  // Artwork remains static and calm on touch devices; subtle hover motion is CSS-only.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer) {
    document.querySelectorAll(".interactive-symbol-node").forEach((node) => {
      node.classList.remove("animate-float-1", "animate-float-2", "animate-float-3");
    });
  }
});
