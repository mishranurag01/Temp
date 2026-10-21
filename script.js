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

// Single-focus gallery behavior:
// - Desktop/laptop: hover (or keyboard focus) controls the glow.
// - Touch screens: the most prominent artwork in the viewport receives the glow.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const gallery = document.querySelector(".symbolic-trio-group");
  const artworkNodes = Array.from(document.querySelectorAll(".interactive-symbol-node"));
  if (!gallery || !artworkNodes.length) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const setViewportFocus = (activeNode) => {
    artworkNodes.forEach((node) => {
      const isActive = node === activeNode;
      node.classList.toggle("is-viewport-focus", isActive);
      node.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  // Do not keep a tap/click selection on desktop: the pointer owns the focus.
  artworkNodes.forEach((node) => {
    node.classList.remove("is-selected");
    node.removeAttribute("aria-pressed");
    node.setAttribute("role", "group");
  });

  if (finePointer.matches) {
    setViewportFocus(null);
    return;
  }

  // Touch layouts: calculate visible area and distance from the viewport's visual centre.
  // The best-scoring artwork is the only one with a glowing frame at any moment.
  let frameRequested = false;
  const updateViewportFocus = () => {
    frameRequested = false;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportCenterY = viewportHeight / 2;
    let bestNode = null;
    let bestScore = 0;

    artworkNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      if (!visibleWidth || !visibleHeight) return;

      const area = Math.max(1, rect.width * rect.height);
      const visibleRatio = (visibleWidth * visibleHeight) / area;
      const centerY = Math.max(0, Math.min(viewportCenterY, rect.bottom));
      const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - centerY) / Math.max(1, viewportHeight / 2);
      const centrality = 1 - Math.min(1, centerDistance);
      const score = visibleRatio * 0.65 + centrality * 0.35;

      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    });

    setViewportFocus(bestScore >= 0.12 ? bestNode : null);
  };

  const requestFocusUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateViewportFocus);
  };

  // IntersectionObserver wakes the calculation as artwork enters/leaves view;
  // scroll/resize handles the changing prominence between those events.
  const observer = new IntersectionObserver(requestFocusUpdate, {
    root: null,
    threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1]
  });
  artworkNodes.forEach((node) => observer.observe(node));
  window.addEventListener("scroll", requestFocusUpdate, { passive: true });
  window.addEventListener("resize", requestFocusUpdate, { passive: true });
  window.addEventListener("orientationchange", requestFocusUpdate, { passive: true });
  requestFocusUpdate();

  // Handle a device that changes between touch and mouse input after load.
  finePointer.addEventListener?.("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      window.removeEventListener("scroll", requestFocusUpdate);
      window.removeEventListener("resize", requestFocusUpdate);
      window.removeEventListener("orientationchange", requestFocusUpdate);
      setViewportFocus(null);
    } else {
      artworkNodes.forEach((node) => observer.observe(node));
      window.addEventListener("scroll", requestFocusUpdate, { passive: true });
      window.addEventListener("resize", requestFocusUpdate, { passive: true });
      window.addEventListener("orientationchange", requestFocusUpdate, { passive: true });
      requestFocusUpdate();
    }
  });
});
