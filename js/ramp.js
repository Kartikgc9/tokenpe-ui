// Interactive hero checkout. Preview only — no payment is sent.
(function () {
  const root = document.getElementById("ramp");
  if (!root) return;

  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];

  const CRYPTO = [
    { code: "BTC", name: "Bitcoin", usd: 97500, net: "Bitcoin", icon: "assets/networks/btc.svg", decimals: 8 },
    { code: "ETH", name: "Ethereum", usd: 3850, net: "Ethereum", icon: "assets/networks/eth.svg", decimals: 6 },
    { code: "SOL", name: "Solana", usd: 178, net: "Solana", icon: "assets/networks/sol.svg", decimals: 6 },
    { code: "TRX", name: "Tron", usd: 0.24, net: "Tron", icon: "assets/networks/trx.svg", decimals: 4 },
    { code: "SUI", name: "Sui", usd: 3.4, net: "Sui", icon: "assets/networks/sui.svg", decimals: 4 },
    { code: "USDC", name: "USD Coin", usd: 1, net: "Solana", icon: null, decimals: 2 },
    { code: "USDT", name: "Tether", usd: 1, net: "Tron", icon: null, decimals: 2 },
  ];
  const FIAT = [
    { code: "USD", name: "US Dollar", perUsd: 1, decimals: 2 },
    { code: "EUR", name: "Euro", perUsd: 0.92, decimals: 2 },
    { code: "GBP", name: "Pound", perUsd: 0.78, decimals: 2 },
    { code: "INR", name: "Indian Rupee", perUsd: 83.2, decimals: 0 },
  ];
  const byCode = Object.fromEntries([...CRYPTO, ...FIAT].map((a) => [a.code, a]));

  const MODES = {
    accept: {
      inLabel: "You receive",
      outLabel: "Customer sends",
      payLabel: "Pay using",
      cta: "Create payment",
      inList: ["USDC", "USDT"],
      outList: ["BTC", "ETH", "SOL", "TRX", "SUI"],
      inDefault: "USDC",
      outDefault: "ETH",
      methods: ["Wallet", "Exchange", "MetaMask", "Coinbase Wallet"],
      spread: 0,
    },
    offramp: {
      inLabel: "You send",
      outLabel: "Payout to",
      payLabel: "Pay out using",
      cta: "Confirm payout",
      inList: ["USDC", "USDT", "ETH", "BTC", "SOL"],
      outList: ["USD", "EUR", "GBP", "INR"],
      inDefault: "USDC",
      outDefault: "USD",
      methods: ["Bank transfer", "Local rails"],
      spread: 0.008,
    },
    convert: {
      inLabel: "You convert",
      outLabel: "You get",
      payLabel: "Settle as",
      cta: "Convert",
      inList: ["BTC", "ETH", "SOL", "TRX", "SUI"],
      outList: ["USDC", "USDT"],
      inDefault: "ETH",
      outDefault: "USDC",
      methods: ["Instant", "Keep as received"],
      spread: 0.004,
    },
  };

  const state = {
    mode: "accept",
    inCode: "USDC",
    outCode: "ETH",
    method: "Wallet",
    amount: "250",
  };

  const els = {
    inLabel: $("#ramp-in-label"),
    outLabel: $("#ramp-out-label"),
    payLabel: $("#ramp-pay-label"),
    inAmount: $("#ramp-in-amount"),
    outAmount: $("#ramp-out-amount"),
    inToken: $("#ramp-in-token"),
    outToken: $("#ramp-out-token"),
    network: $("#ramp-network"),
    payBtn: $("#ramp-pay-method"),
    payName: $("#ramp-pay-name"),
    cta: $("#ramp-cta"),
    quote: $("#ramp-quote"),
    menuIn: $("#ramp-menu-in"),
    menuOut: $("#ramp-menu-out"),
    menuPay: $("#ramp-menu-pay"),
    help: $("#ramp-help"),
    helpPanel: $("#ramp-help-panel"),
    panel: $("#ramp-panel"),
  };

  const parseAmount = (raw) => {
    const n = Number(String(raw).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const format = (n, code) => {
    const asset = byCode[code];
    const d = asset ? asset.decimals : 2;
    if (!Number.isFinite(n) || n <= 0) return d === 0 ? "0" : "0";
    if (n >= 1e9) return n.toExponential(2);
    return n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });
  };

  const usdValue = (amount, code) => {
    const crypto = CRYPTO.find((a) => a.code === code);
    if (crypto) return amount * crypto.usd;
    const fiat = FIAT.find((a) => a.code === code);
    if (fiat) return amount / fiat.perUsd;
    return 0;
  };

  const fromUsd = (usd, code) => {
    const crypto = CRYPTO.find((a) => a.code === code);
    if (crypto) return usd / crypto.usd;
    const fiat = FIAT.find((a) => a.code === code);
    if (fiat) return usd * fiat.perUsd;
    return 0;
  };

  const setChip = (btn, code) => {
    const ic = $(".ramp-ic", btn);
    const label = $("[data-code]", btn);
    if (ic) ic.setAttribute("data-ic", code);
    if (label) label.textContent = code;
  };

  const netFor = (code) => {
    const asset = CRYPTO.find((a) => a.code === code);
    return asset || null;
  };

  const renderNetwork = (code) => {
    const asset = netFor(code);
    if (!asset || FIAT.some((f) => f.code === code)) {
      els.network.hidden = true;
      els.network.innerHTML = "";
      return;
    }
    els.network.hidden = false;
    const src = asset.icon
      ? `<img src="${asset.icon}" alt="" width="14" height="14">`
      : `<span class="ramp-ic" data-ic="${asset.code}" style="width:14px;height:14px"></span>`;
    els.network.innerHTML = `${src} ${asset.net}`;
  };

  const closeMenus = () => {
    $$(".ramp-menu").forEach((m) => { m.hidden = true; });
    $$("[aria-haspopup=listbox]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  };

  const optionRow = (code, extra) => {
    const asset = byCode[code];
    return `<button type="button" role="option" data-code="${code}" aria-selected="${code === extra}">
      <span class="ramp-ic" data-ic="${code}"></span>${code}${asset && asset.name ? `<span>${asset.name}</span>` : ""}
    </button>`;
  };

  const fillMenu = (menu, list, selected) => {
    menu.innerHTML = list.map((code) => optionRow(code, selected)).join("");
  };

  const quote = () => {
    const mode = MODES[state.mode];
    const inAmt = parseAmount(state.amount);
    const usd = usdValue(inAmt, state.inCode);
    const out = fromUsd(usd * (1 - mode.spread), state.outCode);
    els.outAmount.textContent = format(out, state.outCode);
    const ready = inAmt > 0;
    els.cta.classList.toggle("is-ready", ready);
    els.cta.disabled = !ready;
    if (!ready) {
      els.quote.textContent = "Enter an amount to see the conversion.";
      return;
    }
    if (state.mode === "accept") {
      els.quote.textContent = `Customer sends ${format(out, state.outCode)} ${state.outCode} · you receive ${format(inAmt, state.inCode)} ${state.inCode}. Indicative.`;
    } else if (state.mode === "offramp") {
      els.quote.textContent = `${format(inAmt, state.inCode)} ${state.inCode} → ${format(out, state.outCode)} ${state.outCode} to bank. Indicative.`;
    } else {
      els.quote.textContent = `${format(inAmt, state.inCode)} ${state.inCode} → ${format(out, state.outCode)} ${state.outCode}. Indicative.`;
    }
  };

  const applyMode = (modeName) => {
    const mode = MODES[modeName];
    state.mode = modeName;
    state.inCode = mode.inDefault;
    state.outCode = mode.outDefault;
    state.method = mode.methods[0];
    if (modeName === "convert") state.amount = "1";
    else if (modeName === "accept") state.amount = "250";
    else state.amount = "250";

    root.dataset.mode = modeName;
    els.inLabel.textContent = mode.inLabel;
    els.outLabel.textContent = mode.outLabel;
    els.payLabel.textContent = mode.payLabel;
    els.cta.textContent = mode.cta;
    els.inAmount.value = state.amount;
    els.payName.textContent = state.method;
    $$(".ramp-tabs button").forEach((btn) => {
      const on = btn.dataset.rampMode === modeName;
      btn.setAttribute("aria-selected", on);
    });
    els.panel.setAttribute("aria-labelledby", `ramp-tab-${modeName}`);
    setChip(els.inToken, state.inCode);
    setChip(els.outToken, state.outCode);
    renderNetwork(FIAT.some((f) => f.code === state.outCode) ? state.inCode : state.outCode);
    fillMenu(els.menuIn, mode.inList, state.inCode);
    fillMenu(els.menuOut, mode.outList, state.outCode);
    els.menuPay.innerHTML = mode.methods.map((m) =>
      `<button type="button" role="option" data-method="${m}" aria-selected="${m === state.method}">${m}${m === mode.methods[0] ? "<span>Recommended</span>" : ""}</button>`
    ).join("");
    closeMenus();
    quote();
  };

  const openMenu = (which) => {
    const map = { in: els.menuIn, out: els.menuOut, pay: els.menuPay };
    const btn = which === "in" ? els.inToken : which === "out" ? els.outToken : els.payBtn;
    const menu = map[which];
    const willOpen = menu.hidden;
    closeMenus();
    if (!willOpen) return;
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };

  els.inAmount.addEventListener("input", () => {
    state.amount = els.inAmount.value;
    quote();
  });
  els.inAmount.addEventListener("blur", () => {
    const n = parseAmount(state.amount);
    if (n > 0) {
      state.amount = format(n, state.inCode).replace(/,/g, n >= 1000 ? "," : "");
      // keep raw grouping light: store canonical string without forcing commas in the field
      els.inAmount.value = String(n);
      state.amount = els.inAmount.value;
    }
    quote();
  });

  $$(".ramp-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => applyMode(btn.dataset.rampMode));
  });

  els.inToken.addEventListener("click", (e) => { e.stopPropagation(); openMenu("in"); });
  els.outToken.addEventListener("click", (e) => { e.stopPropagation(); openMenu("out"); });
  els.payBtn.addEventListener("click", (e) => { e.stopPropagation(); openMenu("pay"); });

  els.menuIn.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-code]");
    if (!opt) return;
    state.inCode = opt.dataset.code;
    setChip(els.inToken, state.inCode);
    fillMenu(els.menuIn, MODES[state.mode].inList, state.inCode);
    if (FIAT.some((f) => f.code === state.outCode)) renderNetwork(state.inCode);
    closeMenus();
    quote();
  });
  els.menuOut.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-code]");
    if (!opt) return;
    state.outCode = opt.dataset.code;
    setChip(els.outToken, state.outCode);
    fillMenu(els.menuOut, MODES[state.mode].outList, state.outCode);
    renderNetwork(FIAT.some((f) => f.code === state.outCode) ? state.inCode : state.outCode);
    closeMenus();
    quote();
  });
  els.menuPay.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-method]");
    if (!opt) return;
    state.method = opt.dataset.method;
    els.payName.textContent = state.method;
    closeMenus();
  });

  els.cta.addEventListener("click", () => {
    if (els.cta.disabled) return;
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = "Preview only. Email contact@tokenpe.com to go live.";
      toast.classList.add("is-on");
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove("is-on"), 2800);
    }
  });

  els.help.addEventListener("click", () => {
    const open = els.helpPanel.hidden;
    els.helpPanel.hidden = !open;
    els.help.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) closeMenus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenus();
      els.helpPanel.hidden = true;
      els.help.setAttribute("aria-expanded", "false");
    }
  });

  applyMode("accept");
})();
