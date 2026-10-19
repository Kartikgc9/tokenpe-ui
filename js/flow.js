(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const write = (el, text) => {
    if (!el || el.textContent === text) return;
    el.textContent = text;
    if (el.classList.contains("bubble")) {
      el.classList.remove("is-swap");
      void el.offsetWidth;
      el.classList.add("is-swap");
    }
  };

  const themePhone = $("#theme-phone");
  let themeLive = true;
  let subsLive = true;
  let recvLive = true;

  $("#theme-pay")?.addEventListener("click", () => { themeLive = false; });
  $("#sub-list")?.addEventListener("click", () => { subsLive = false; });
  $(".receive-box")?.addEventListener("change", () => { recvLive = false; });

  const paymentStory = [
    ["Payment · customer pays", "250 USDC received on Solana.", "Waiting for confirmation."],
    ["Payment · TokenPe confirms", "Transfer confirmed on-chain.", "Screened with blockchain analytics."],
    ["Payment · you settle", "Balance credited in USDC.", "Webhook sent to your platform."],
  ];
  const payoutStory = [
    ["Payout · you request", "Payout of 250 USDC requested.", "Rate shown before you confirm."],
    ["Payout · TokenPe converts", "Converting to local currency.", "Payout in progress."],
    ["Payout · delivered", "Paid to the bank account.", "Tracked by webhook."],
  ];
  const themeFrames = [
    { btn: "Confirm payout", status: "Rate shown before you confirm.", tilt: false },
    { btn: "Sending…", status: "Payout in progress.", tilt: true },
    { btn: "Payout sent", status: "Tracked by webhook.", tilt: false },
    { btn: "Payout sent", status: "Tracked by webhook.", tilt: true },
  ];
  const networks = ["Solana", "Tron", "Ethereum"];
  // Everything below is rendered once by app.js, so look it up once instead of every frame.
  const els = {
    hubs: $$(".rail-hub"),
    railPills: $$(".rail-steps [data-step]"),
    rails: $$(".rail").map((rail) => ({
      from: rail.dataset.from || "Customer",
      to: rail.dataset.to || "Business",
      caption: rail.querySelector("[data-rail-caption]"),
    })),
    stackA: $("#stack-a"),
    stackB: $("#stack-b"),
    payLines: $$(".pay-line"),
    themePay: $("#theme-pay"),
    themeStatus: $("#theme-status"),
    methods: $$("#method-grid .method"),
    subs: $$("#sub-list button"),
    settleRows: $$("#settle-card .mini-row"),
    payoutBar: $("#payout-bar"),
    payoutLeft: $("#payout-left"),
    payoutFile: $("#payout-file"),
    radios: $$(".receive-box input"),
    recvStatus: $("#recv-status"),
    switches: $$(".mock-checkout .switch"),
  };

  const tick = (now) => {
    if (document.hidden) {
      requestAnimationFrame(tick);
      return;
    }

    const local = (now / 1000) % 8;
    const going = local < 4;
    const u = going ? local / 4 : 1 - (local - 4) / 4;
    const e = ease(u);
    const forward = going ? e : 1 - e;
    const step = forward < 0.34 ? 1 : forward < 0.7 ? 2 : 3;
    const story = (going ? paymentStory : payoutStory)[step - 1];

    const tilt = (Math.sin(forward * Math.PI) * (going ? 7 : -7)).toFixed(2);
    els.hubs.forEach((hub) => hub.setAttribute("transform", "rotate(" + tilt + " 210 78)"));
    els.railPills.forEach((pill) => {
      pill.classList.toggle("is-on", pill.dataset.step === String(step));
    });
    els.rails.forEach((rail) => {
      const caption = going
        ? "Payment · " + rail.from + " pays in crypto. TokenPe confirms and screens it."
        : "Settlement · " + rail.to + " is credited in the asset it chose.";
      write(rail.caption, caption);
    });

    write(els.stackA, story[1]);
    write(els.stackB, story[2]);
    const hotLine = going ? (step === 1 ? 0 : 2) : (step === 3 ? 3 : 2);
    els.payLines.forEach((line, index) => line.classList.toggle("is-hot", index === hotLine));

    const quarter = Math.floor(local / 2);
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
    els.settleRows.forEach((row, index) => row.classList.toggle("is-hot", index === step - 1));

    const left = Math.max(0, Math.round(38 * (1 - local / 8)));
    if (els.payoutBar) els.payoutBar.style.width = ((38 - left) / 38 * 100).toFixed(1) + "%";
    write(els.payoutLeft, left === 0 ? "Delivered" : "In progress");
    write(els.payoutFile, left === 0 ? "Payout batch · delivered" : "Payout batch · in progress");
    if (recvLive) {
      const index = Math.min(els.radios.length - 1, Math.floor((local / 8) * els.radios.length));
      els.radios.forEach((radio, i) => { radio.checked = i === index; });
      write(els.recvStatus, left === 0 ? "Sent" : "Sending on " + (networks[index] || networks[0]));
    }

    els.switches.forEach((knob) => knob.classList.toggle("is-off", !going));

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
