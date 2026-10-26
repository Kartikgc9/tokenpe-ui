(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const write = (el, text) => {
    if (!el || el.textContent === text) return;
    el.textContent = text;
  };

  const themePhone = $("#theme-phone");
  let themeLive = true;
  let subsLive = true;

  $("#theme-pay")?.addEventListener("click", () => { themeLive = false; });
  $("#sub-list")?.addEventListener("click", () => { subsLive = false; });

  const themeFrames = [
    { btn: "Confirm payout", status: "Rate shown before you confirm.", tilt: false },
    { btn: "Sending…", status: "Payout in progress.", tilt: true },
    { btn: "Payout sent", status: "Tracked by webhook.", tilt: false },
    { btn: "Payout sent", status: "Tracked by webhook.", tilt: true },
  ];
  // Everything below is rendered once by app.js, so look it up once instead of every frame.
  const els = {
    themePay: $("#theme-pay"),
    themeStatus: $("#theme-status"),
    methods: $$("#method-grid .method"),
    subs: $$("#sub-list button"),
    settleRows: $$("#settle-card .mini-row"),
    heroRows: $$(".hv-row"),
    events: $$(".event-row"),
  };

  const tick = (now) => {
    if (document.hidden) {
      requestAnimationFrame(tick);
      return;
    }

    const local = (now / 1000) % 8;
    const quarter = Math.floor(local / 2);
    const step = Math.floor(local / 8 * 3);

    if (themeLive) {
      const frame = themeFrames[quarter];
      write(els.themePay, frame.btn);
      write(els.themeStatus, frame.status);
      themePhone?.classList.toggle("is-tilt", frame.tilt);
    }

    const hotMethod = Math.floor(local / 8 * els.methods.length);
    els.methods.forEach((method, index) => method.classList.toggle("is-hot", index === hotMethod));
    if (subsLive) {
      const index = Math.floor(local / 2.7) % Math.max(1, els.subs.length);
      els.subs.forEach((button, i) => button.classList.toggle("is-on", i === index));
    }
    els.settleRows.forEach((row, index) => row.classList.toggle("is-hot", index === step));
    els.heroRows.forEach((row, index) => row.classList.toggle("is-on", index === quarter));
    els.events.forEach((row, index) => row.classList.toggle("is-on", index === step));

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
