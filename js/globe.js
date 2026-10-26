// Rotating cobe globe beside the supported networks list. A plain-JS port of the
// 21st.dev (Magic UI) <Globe> component in 21stcomps/globecode.md, recoloured as a
// solid blue sphere with light land dots, with the same auto-rotation and drag-to-spin.
// cobe renders a dark sphere; the canvas is screen-blended (css/home.css) over the
// blue .globe-halo, so the dark drops out and only the light land and markers show.
import createGlobe from "./vendor/cobe.js";

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.85, 0.89, 1],
  markerColor: [1, 1, 1],
  glowColor: [0.35, 0.45, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

const canvas = document.querySelector(".globe-canvas");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  let phi = 0;
  let width = 0;
  let r = 0;
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;

  const updatePointerInteraction = (value) => {
    pointerInteracting = value;
    canvas.style.cursor = value !== null ? "grabbing" : "grab";
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting !== null) {
      const delta = clientX - pointerInteracting;
      pointerInteractionMovement = delta;
      r = delta / 200;
    }
  };

  const onRender = (state) => {
    if (pointerInteracting === null && !reduce) phi += 0.005;
    state.phi = phi + r;
    state.width = width * 2;
    state.height = width * 2;
  };

  const onResize = () => { width = canvas.offsetWidth; };
  window.addEventListener("resize", onResize, { passive: true });
  onResize();

  let globe = null;
  try {
    globe = createGlobe(canvas, { ...GLOBE_CONFIG, width: width * 2, height: width * 2, onRender });
  } catch (err) {
    // No WebGL: the CSS sphere behind the canvas stays in place.
    canvas.remove();
  }

  if (globe) {
    setTimeout(() => { canvas.style.opacity = "1"; });

    canvas.addEventListener("pointerdown", (e) => updatePointerInteraction(e.clientX - pointerInteractionMovement));
    canvas.addEventListener("pointerup", () => updatePointerInteraction(null));
    canvas.addEventListener("pointerout", () => updatePointerInteraction(null));
    canvas.addEventListener("mousemove", (e) => updateMovement(e.clientX));
    canvas.addEventListener("touchmove", (e) => e.touches[0] && updateMovement(e.touches[0].clientX), { passive: true });

    // Stop drawing while the globe is off screen; the rotation picks up where it left off.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => globe.toggle(entry.isIntersecting)).observe(canvas);
    }
  }
}
