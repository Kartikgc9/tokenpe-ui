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

  const phone = $("#widget-phone");
  const themePhone = $("#theme-phone");
  let driving = false;
  let widgetLive = true;
  let widgetPaused = false;
  let integrateVisible = false;
  let widgetAcc = 0;
  let widgetShown = -1;
  let upiTimer = 0;
  let themeLive = true;
  let subsLive = true;
  let recvLive = true;
  let codeLive = true;
  let codePause = false;
  let devVisible = false;
  let langTick = null;
  let sandboxLive = true;
  let sandboxStarted = false;

  const stopType = () => clearInterval(upiTimer);
  const quoteSummary = () => {
    const amount = $("#pay-amount");
    const pay = $("#pay-ccy");
    const receive = $("#receive");
    const asset = $("#get-asset");
    if (!amount || !pay || !receive || !asset) return "";
    return amount.value + " " + pay.value + " → " + receive.textContent + " " + asset.value;
  };
  const showPanel = (id) => {
    ["widget-home", "widget-pay", "widget-done"].forEach((key) => {
      const panel = document.getElementById(key);
      if (panel) panel.hidden = key !== id;
    });
  };
  const typeUpi = () => {
    const input = $("#upi-id");
    if (!input) return;
    const text = "priya@okaxis";
    let i = 0;
    input.value = "";
    stopType();
    upiTimer = setInterval(() => {
      i += 1;
      input.value = text.slice(0, i);
      if (i >= text.length) stopType();
    }, 48);
  };
  const showWidget = (name) => {
    if (!phone) return;
    driving = true;
    try {
      stopType();
      phone.classList.toggle("is-tilt", name === "pay-buy" || name === "pay-sell");
      if (name === "buy" || name === "sell") {
        showPanel("widget-home");
        const side = document.querySelector('.buy-sell button[data-side="' + name + '"]');
        if (side) side.click();
        return;
      }
      if (name === "pay-buy" || name === "pay-sell") {
        const sell = name === "pay-sell";
        showPanel("widget-pay");
        write($("#pay-title"), sell ? "Send to your bank" : "Pay with UPI");
        write($("#pay-field-label"), sell ? "Account" : "UPI ID");
        const input = $("#upi-id");
        if (input) {
          input.placeholder = sell ? "Account" : "name@upi";
          input.value = sell ? "HDFC ···· 4821" : "";
        }
        write($("#pay-summary"), quoteSummary());
        if (!sell) typeUpi();
        return;
      }
      const sell = name === "done-sell";
      showPanel("widget-done");
      write($("#widget-done-kicker"), sell ? "Off-ramp" : "On-ramp");
      write($("#widget-done-title"), sell ? "INR sent" : "USDT landed");
      write($("#widget-done-status"), sell ? "Paid out" : "Settled");
      write($("#widget-done-copy"), quoteSummary());
    } finally {
      driving = false;
    }
  };

  if (phone) {
    phone.addEventListener("pointerenter", () => { widgetPaused = true; });
    phone.addEventListener("pointerleave", () => { widgetPaused = false; });
    phone.addEventListener("click", () => {
      if (driving) return;
      widgetLive = false;
      stopType();
    });
    phone.addEventListener("input", () => {
      if (driving) return;
      widgetLive = false;
      stopType();
    });
  }
  if (themePhone) {
    $("#theme-pay")?.addEventListener("click", () => {
      themeLive = false;
      if (typeof toast === "function") toast("Theme preview confirmed. No payment was sent.");
    });
  }
  $("#sub-list")?.addEventListener("click", () => { subsLive = false; });
  $(".receive-box")?.addEventListener("change", () => { recvLive = false; });
  $("#code-langs")?.addEventListener("click", () => { codeLive = false; });
  $("#code-langs")?.closest("article")?.addEventListener("pointerenter", () => { codePause = true; });
  $("#code-langs")?.closest("article")?.addEventListener("pointerleave", () => { codePause = false; });
  $("#sandbox-run")?.addEventListener("click", () => { sandboxLive = false; });

  const watch = (el, set) => {
    if (!el || !("IntersectionObserver" in window)) {
      set(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { threshold: 0.22 });
    io.observe(el);
  };
  watch($("#integrate"), (on) => { integrateVisible = on; });
  watch($("#developers"), (on) => { devVisible = on; });

  const widgetSteps = [
    { name: "buy", dur: 1700 },
    { name: "pay-buy", dur: 1900 },
    { name: "done-buy", dur: 1800 },
    { name: "sell", dur: 1700 },
    { name: "pay-sell", dur: 1900 },
    { name: "done-sell", dur: 2100 },
  ];
  const widgetTotal = widgetSteps.reduce((sum, step) => sum + step.dur, 0);
  const onRampStory = [
    ["On-ramp · customer pays", "UPI collected ₹2,450.", "The quote is locked."],
    ["On-ramp · TokenPe treasury", "Converting rupees to USDT.", "Fee 1.20% on this quote."],
    ["On-ramp · you withdraw", "USDT 29.05 left treasury.", "Landed in the wallet."],
  ];
  const offRampStory = [
    ["Off-ramp · customer pays", "Wallet sent USDT 100.", "The sell quote is locked."],
    ["Off-ramp · TokenPe treasury", "Treasury is holding the token.", "INR payout is queued."],
    ["Off-ramp · you withdraw", "₹8,403 paid to HDFC ···· 4821.", "Payout settled."],
  ];
  const themeFrames = [
    { asset: "USDT", out: "99.10", btn: "Apple Pay", status: "On-ramp · card to USDT", tilt: false },
    { asset: "USDT", out: "99.10", btn: "Paying…", status: "On-ramp · treasury", tilt: true },
    { asset: "USDT", out: "99.10", btn: "USDT received", status: "On-ramp · withdrawn", tilt: false },
    { asset: "INR", out: "8,339.27", btn: "Cash out", status: "Off-ramp · rupees sent", tilt: true },
  ];
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(48, now - last);
    last = now;
    const hidden = document.hidden;

    if (widgetLive && !widgetPaused && integrateVisible && !hidden) {
      widgetAcc += dt;
      let cursor = widgetAcc % widgetTotal;
      let index = 0;
      for (let i = 0; i < widgetSteps.length; i++) {
        if (cursor < widgetSteps[i].dur) {
          index = i;
          break;
        }
        cursor -= widgetSteps[i].dur;
      }
      if (index !== widgetShown) {
        widgetShown = index;
        showWidget(widgetSteps[index].name);
      }
    }

    const local = (now / 1000) % 8;
    const going = local < 4;
    const u = going ? local / 4 : 1 - (local - 4) / 4;
    const e = ease(u);
    const forward = going ? e : 1 - e;
    const step = forward < 0.34 ? 1 : forward < 0.7 ? 2 : 3;
    const story = (going ? onRampStory : offRampStory)[step - 1];

    $$(".rail-hub").forEach((hub) => {
      const tilt = Math.sin(forward * Math.PI) * (going ? 7 : -7);
      hub.setAttribute("transform", "rotate(" + tilt.toFixed(2) + " 210 78)");
    });
    $$(".rail-steps [data-step]").forEach((pill) => {
      pill.classList.toggle("is-on", pill.dataset.step === String(step));
    });
    $$(".rail").forEach((rail) => {
      const from = rail.dataset.from || "Customer";
      const to = rail.dataset.to || "Wallet";
      const caption = going
        ? "On-ramp · " + from + " pays in. " + to + " receives the token."
        : "Off-ramp · " + to + " sends the token back. " + from + " is paid out.";
      write(rail.querySelector("[data-rail-caption]"), caption);
    });

    write($("#stack-phase"), story[0]);
    write($("#stack-a"), story[1]);
    write($("#stack-b"), story[2]);
    const hotLine = going ? (step === 1 ? 0 : 2) : (step === 3 ? 3 : 2);
    $$(".pay-line").forEach((line, index) => line.classList.toggle("is-hot", index === hotLine));

    const quarter = Math.floor(local / 2);
    if (themeLive) {
      const frame = themeFrames[quarter];
      write($("#theme-asset"), frame.asset);
      write($("#theme-out"), frame.out);
      write($("#theme-pay"), frame.btn);
      write($("#theme-status"), frame.status);
      themePhone?.classList.toggle("is-tilt", frame.tilt);
    }

    $$("#method-grid .method").forEach((method, index, list) => {
      method.classList.toggle("is-hot", index === Math.floor(local / 8 * list.length));
    });
    if (subsLive) {
      const buttons = $$("#sub-list button");
      const index = Math.floor(local / 2.7) % Math.max(1, buttons.length);
      buttons.forEach((button, i) => button.classList.toggle("is-on", i === index));
    }
    const settleRows = $$("#settle-card .mini-row");
    settleRows.forEach((row, index) => row.classList.toggle("is-hot", index === step - 1));
    write($("#settle-phase"), story[0]);
    const rate = $("#success-rate");
    if (rate) write(rate, (98.2 + Math.sin((local / 8) * Math.PI * 2) * 0.4).toFixed(1) + "%");

    const left = Math.max(0, Math.round(38 * (1 - local / 8)));
    const bar = $("#payout-bar");
    if (bar) bar.style.width = ((38 - left) / 38 * 100).toFixed(1) + "%";
    write($("#payout-left"), left === 0 ? "186 done · paid out" : (186 - left) + " done · " + left + " left");
    write($("#payout-file"), left === 0 ? "Payroll_Apr.xlsx · 186 rows · paid" : "Payroll_Apr.xlsx · 186 rows · paying out");
    if (recvLive) {
      const radios = $$(".receive-box input");
      const index = Math.min(radios.length - 1, Math.floor((local / 8) * radios.length));
      radios.forEach((radio, i) => { radio.checked = i === index; });
      const names = ["UPI", "Bank account", "Wallet"];
      write($("#recv-status"), left === 0 ? "Paid out" : "Sending via " + (names[index] || "UPI"));
    }

    const prepaid = Math.round(100 + (local / 8) * 1920);
    const later = Math.max(0, 2120 - prepaid);
    $$(".split-now").forEach((el) => write(el, "Pay ₹" + prepaid.toLocaleString("en-IN") + " now"));
    $$(".split-later").forEach((el) => write(el, "₹" + later.toLocaleString("en-IN") + " on delivery"));
    $$(".mock-checkout .switch").forEach((knob) => knob.classList.toggle("is-off", !going));

    if (langTick === null) langTick = Math.floor(now / 8000);
    const nextLangTick = Math.floor(now / 8000);
    if (devVisible && codeLive && !codePause && nextLangTick !== langTick && typeof setCode === "function") {
      langTick = nextLangTick;
      const order = ["curl", "node", "python"];
      const current = $("#code-langs button.is-on")?.dataset.lang || "curl";
      const next = order[(order.indexOf(current) + 1) % order.length];
      setCode(next);
    } else if (!devVisible || codePause) {
      langTick = nextLangTick;
    }

    if (sandboxLive && devVisible && !sandboxStarted && typeof rates !== "undefined") {
      sandboxStarted = true;
      window.setTimeout(() => {
        if (!sandboxLive) return;
        const out = $("#sandbox-out");
        if (!out || out.textContent.trim()) return;
        const amount = 10000;
        const receive = ((amount / rates.INR) * 0.988).toFixed(2);
        out.textContent = 'POST /v1/quotes 200\n{ "pay": "INR", "amount": "' + amount + '", "receive": "USDT", "out": "' + receive + '", "fee": "1.20%" }';
      }, 1100);
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
