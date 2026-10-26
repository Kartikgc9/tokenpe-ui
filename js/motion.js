// Page motion: the hero load sequence, word-by-word headline reveals and the
// pinned developer story. Everything degrades to a static page with reduced motion.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  // Hero: one orchestrated entrance once the fonts are in, so lines do not reflow mid-animation.
  const start = () => requestAnimationFrame(() => document.body.classList.add("is-in"));
  if (reduce || !document.fonts) start();
  else Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(start);

  // Headlines marked data-reveal-words fill in from grey to ink as they scroll through the viewport.
  const reveals = [...document.querySelectorAll("[data-reveal-words]")].map((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    const spans = words.map((w, i) => {
      const span = document.createElement("span");
      span.className = "w";
      span.setAttribute("aria-hidden", "true");
      span.textContent = w;
      el.append(span, i < words.length - 1 ? " " : "");
      return span;
    });
    return { el, words: spans };
  });
  if (reduce) reveals.forEach((r) => r.words.forEach((w) => w.classList.add("is-lit")));

  // Developer story: the section is tall, its stage is sticky, and scroll progress picks the step.
  const story = document.querySelector(".story");
  const wide = window.matchMedia("(min-width: 981px)");
  const steps = story ? [...story.querySelectorAll("[data-story-step]")] : [];
  const STOPS = [0.2, 0.47, 0.74];
  let pinned = false;

  function setStep(n) {
    if (!story || story.dataset.step === String(n)) return;
    story.dataset.step = String(n);
    steps.forEach((s) => s.classList.toggle("is-on", Number(s.dataset.storyStep) === n));
    story.querySelectorAll(".story-progress i").forEach((dot, i) => dot.classList.toggle("is-on", i < n));
  }

  function layoutStory() {
    if (!story) return;
    pinned = wide.matches && !reduce;
    story.classList.toggle("is-pinned", pinned);
    if (!pinned) {
      story.dataset.step = "all";
      return;
    }
    story.dataset.step = "";
    onScroll();
  }

  // Hidden steps stay focusable, so keyboard users tabbing into one get scrolled to where it shows.
  story?.addEventListener("focusin", (e) => {
    if (!pinned) return;
    const step = e.target.closest("[data-story-step]");
    if (!step || step.classList.contains("is-on")) return;
    const n = Number(step.dataset.storyStep);
    const box = story.getBoundingClientRect();
    const travel = story.offsetHeight - window.innerHeight;
    window.scrollTo({ top: window.scrollY + box.top + travel * (STOPS[n - 1] + 0.05), behavior: "auto" });
  });

  function onScroll() {
    const vh = window.innerHeight;
    if (!reduce) {
      reveals.forEach(({ el, words }) => {
        const box = el.getBoundingClientRect();
        const p = clamp((vh * 0.88 - box.top) / (box.height + vh * 0.4), 0, 1);
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      });
    }
    if (pinned) {
      const box = story.getBoundingClientRect();
      const p = clamp(-box.top / (story.offsetHeight - vh), 0, 1);
      story.style.setProperty("--p", p.toFixed(3));
      setStep(p < STOPS[0] ? 0 : p < STOPS[1] ? 1 : p < STOPS[2] ? 2 : 3);
    }
  }

  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; onScroll(); });
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  wide.addEventListener?.("change", layoutStory);
  layoutStory();
  onScroll();

  // Hero visual drifts a little with the pointer.
  const visual = document.querySelector(".slip");
  if (visual && !reduce && window.matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    document.querySelector(".hero").addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        visual.style.setProperty("--px", x.toFixed(3));
        visual.style.setProperty("--py", y.toFixed(3));
      });
    });
  }
})();
