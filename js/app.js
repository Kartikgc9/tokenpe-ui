const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const features = ["On-ramps", "Off-ramps", "Checkout", "UPI", "Cards", "Payouts", "KYC", "Payment links", "Subscriptions", "Settlements", "Widget", "White-label API", "Webhooks", "FlashUPI", "Passkeys"];

const products = [
  { title: "On-ramps and off-ramps", body: "White-label ramps when you want your own UI. A widget when you want to ship this week.", icon: "ramp" },
  { title: "Virtual account payments", body: "A named account for each user. Inbound transfers credit USDT, USDC, or the balance you choose.", icon: "bank" },
  { title: "Global coverage", body: "Local payment methods, currencies, and the licensing paperwork, handled on the corridors we support.", icon: "globe" },
  { title: "KYC", body: "Use the hosted flow, or pass a user you already verified through KYC reliance.", icon: "kyc" },
  { title: "Headless cards", body: "One-tap checkout with a tokenised card or Apple Pay, without a second payment page.", icon: "card" },
];

const useCases = [
  { id: "wallets", label: "Wallets", title: "On and off ramps that live inside your wallet", body: "Build the checkout in your UI, or drop in the widget when you need the ramp this week.", points: ["White-label API for a checkout you own", "Widget when you need a hosted flow", "USDT, USDC, and BTC on major networks", "UPI, cards, bank transfer, and Apple Pay"], nodes: ["User", "KYC", "Wallet"] },
  { id: "exchanges", label: "Exchanges", title: "A direct deposit flow for traders you already know", body: "Skip a second KYC. Fund the account they already have, and send withdrawals back to their bank.", points: ["Pass the session, no second login", "KYC reliance for users you verified", "Off-ramp settles to a bank account", "Traders stay inside your exchange"], nodes: ["Trader", "Auth", "Exchange"] },
  { id: "neobanks", label: "Neobanks", title: "Leave stablecoin deposits to the rail", body: "Give every user a named account. Inbound money credits a stablecoin balance they can spend or send.", points: ["Named virtual account per user", "Inbound credits as USDT or USDC", "White-label API under your brand", "No duplicate KYC for existing users"], nodes: ["User", "Account", "Balance"] },
  { id: "remittance", label: "Remittance", title: "Local money in. Local money out.", body: "The sender pays with a method they already use. The recipient gets a bank deposit or a stablecoin.", points: ["Licensed ramps on supported corridors", "Cards, UPI, bank transfer, Apple Pay", "Recipient gets local fiat or a token", "Me-to-me and third-party payouts where allowed"], nodes: ["Sender", "Rail", "Recipient"] },
  { id: "payroll", label: "Payroll", title: "Salary that can land as fiat or a stablecoin", body: "Each person gets an account you can pay like any other. They choose stablecoin or local currency.", points: ["Named account per person, issued by API", "You pay it like a normal transfer", "Employee picks stablecoin or local fiat", "KYC on each person, handled by TokenPe"], nodes: ["Employer", "Account", "Employee"] },
];

const industries = [
  { id: "d2c", label: "E-commerce & D2C", title: "A checkout built for brands that ship.", body: "COD and returns eat the margin. One-click checkout lifts prepaid orders and flags risky shipments before they leave.", chips: ["One-click checkout", "Payment gateway", "Partial COD", "Subscriptions"], risk: "Medium" },
  { id: "bfsi", label: "BFSI", title: "Disburse in seconds. Collect on schedule.", body: "Payout speed, mandate reliability, and a check on the account before money moves.", chips: ["Payment gateway", "UPI Autopay", "eNACH", "Payouts"], risk: "Low" },
  { id: "edu", label: "Education", title: "From admission fee to EMI, one stack.", body: "Stop chasing parents by hand. Collect on a form, offer EMI, and split fees across departments.", chips: ["Payment forms", "Subscriptions", "Easy split", "EMI"], risk: "Low" },
  { id: "smb", label: "SMB & startups", title: "Start on a link. Grow into the rest.", body: "Collect on a link, a form, or a checkout. Settle the same day. No engineering required to go live.", chips: ["Payment links", "Payment forms", "Checkout", "Instant settlements"], risk: "Medium" },
  { id: "enterprise", label: "Enterprise", title: "The rail under high-volume brands.", body: "Direct UPI and card routes, a named manager, and custom SLAs when you outgrow a standard gateway.", chips: ["Full platform", "Risk tools", "Dedicated support", "Custom SLA"], risk: "Low" },
];

const faqs = {
  "Getting started": [
    ["What is the ₹20L offer?", "New businesses that finish onboarding in the offer window pay 0% platform fee on the first ₹20L of volume, then the standard rate. Next-day settlement is included. The offer applies on its own. Full terms are in the offer note."],
    ["Can I sign up as an individual?", "Yes. Use the Individual view to buy or sell, or open a business account with a personal address proof if you do not have a registered firm yet."],
    ["Do I need a website?", "No. Payment links and payment forms collect money without an app. A website or app is only required for the embedded widget and the white-label API."],
  ],
  "Integration": [
    ["How long does the widget take?", "A web team usually has the widget opening in a sandbox the same day. Production waits on KYC review of the business."],
    ["Which languages have SDKs?", "REST is enough for any stack. The docs drawer shows curl, Node, and Python for quotes and orders. Webhooks cover status changes."],
    ["Can I theme the widget?", "Yes. themeColor, colorMode, and the background, text, and border colors are query parameters. The white-label card on this page updates the sample string."],
  ],
  "Payments": [
    ["Which methods are supported?", "UPI, RuPay, Visa, Mastercard, netbanking, and wallets in India. Cards and local methods on supported international corridors. USDT and USDC on the token rail."],
    ["How fast is settlement?", "Standard settlement is next day. Instant settlement moves eligible volume in minutes, on a schedule or on demand."],
    ["Can I ramp and collect on one order?", "Yes. A checkout can take rupees and deliver a stablecoin, or take a stablecoin and settle INR. The quote shows the rate before the user confirms."],
  ],
  "Support": [
    ["When is a person available?", "Business accounts get a named contact after go-live. The sales form on this page is the path before that."],
    ["What businesses are out of scope?", "We decline categories we cannot support under our licensing. The review happens during onboarding, before you take a live payment."],
    ["Are NRE accounts supported?", "NRO accounts are supported for eligible individuals and organisations. NRE accounts are not."],
  ],
};

const codeSamples = {
  curl: `curl -X POST https://api.tokenpe.in/v1/quotes \\
  -H "Authorization: Bearer $TOKENPE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"side":"buy","pay":"INR","amount":"10000","receive":"USDT"}'`,
  node: `const quote = await tokenpe.quotes.create({
  side: "buy",
  pay: "INR",
  amount: "10000",
  receive: "USDT",
});`,
  python: `quote = tokenpe.quotes.create(
    side="buy",
    pay="INR",
    amount="10000",
    receive="USDT",
)`,
};

const rates = { INR: 84.15, USD: 1, EUR: 0.92, GBP: 0.78 };
const assets = ["USDT", "USDC", "BTC"];
const themes = ["#1461DB", "#111111", "#17803D", "#7A3E9D"];

function icon(name) {
  const paths = {
    ramp: '<path d="M8 14a6 6 0 1 1 1.5 3.9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 14l-3 1M8 14l1.2-3.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    bank: '<path d="M4 10l8-5 8 5M6 10v6M10 10v6M14 10v6M18 10v6M4 16h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    globe: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 12h16M12 4c2.5 2.4 2.5 11.6 0 16M12 4c-2.5 2.4-2.5 11.6 0 16" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    kyc: '<circle cx="12" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M6 18c1.2-2.4 3-3.5 6-3.5S16.8 15.6 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 8.5l1.2 1.2L20 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.7"/>',
  };
  return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-on"), 2400);
}

function renderStatic() {
  const group = `<div class="marquee-group">${features.map((n) => `<span class="word">${n}</span>`).join("")}</div>`;
  $("#marquee").innerHTML = group + group.replace("<div", '<div aria-hidden="true"');

  $("#cover-grid").innerHTML = products.map((p, i) => `
    <button class="cover-card ${i < 2 ? "wide" : ""}" type="button" data-product="${i}">
      ${icon(p.icon)}
      <h3>${p.title}</h3>
      <p>${p.body}</p>
    </button>`).join("");

  $("#method-grid").innerHTML = ["UPI", "Cards", "RuPay", "Wallets", "Netbanking", "EMI", "USDT", "USDC"]
    .map((m) => `<div class="method">${m}</div>`).join("");

  const subs = ["UPI Autopay", "Visa ···· 4242", "eNACH"];
  $("#sub-list").insertAdjacentHTML("beforeend", subs.map((s, i) =>
    `<button type="button" class="${i === 0 ? "is-on" : ""}">${s}</button>`).join(""));
  $("#sub-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    $$("#sub-list button").forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
  });

  $("#usecase-pills").innerHTML = useCases.map((u, i) =>
    `<button type="button" role="tab" data-usecase="${u.id}" class="${i === 0 ? "is-on" : ""}" aria-selected="${i === 0}">${u.label}</button>`).join("");
  $("#usecase-panels").innerHTML = useCases.map((u, i) => `
    <article class="usecase-panel ${i === 0 ? "is-on" : ""}" data-panel="${u.id}">
      <div>
        <h3>${u.title}</h3>
        <p>${u.body}</p>
        <ul class="checks">${u.points.map((pt) => `<li><svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>${pt}</li>`).join("")}</ul>
      </div>
      <div class="rail" data-from="${u.nodes[0]}" data-to="${u.nodes[2]}">
        <div class="rail-steps" aria-hidden="true">
          <span data-step="1" class="is-on">1 · Customer pays</span>
          <span data-step="2">2 · TokenPe treasury</span>
          <span data-step="3">3 · You withdraw</span>
        </div>
        <svg class="diagram" viewBox="0 0 420 230" aria-hidden="true">
          <path class="rail-track" d="M70 156 C 150 210, 270 210, 350 156" fill="none" stroke="#c5d8f7" stroke-width="3"/>
          <path class="rail-dash" pathLength="100" d="M70 156 C 150 210, 270 210, 350 156" fill="none" stroke="#1461DB" stroke-width="2.5" stroke-dasharray="6 7"/>
          <circle cx="70" cy="78" r="42" fill="#fff" stroke="#d5e4fb"/>
          <g class="rail-hub">
            <circle cx="210" cy="78" r="44" fill="#1461DB"/>
            <text x="210" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">TokenPe</text>
          </g>
          <circle cx="350" cy="78" r="42" fill="#fff" stroke="#d5e4fb"/>
          <text x="70" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="#1461DB">${u.nodes[0]}</text>
          <text x="350" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="#1461DB">${u.nodes[2]}</text>
        </svg>
        <p class="rail-caption" data-rail-caption>On-ramp and off-ramp both pass through TokenPe.</p>
      </div>
    </article>`).join("");

  $("#payouts").innerHTML = [
    { id: "payouts", title: "Payouts", body: "Pay anyone, including on holidays. Bank accounts, UPI IDs, cards, and wallets. Refunds, vendors, salaries, and incentives.", visual: "bulk" },
    { id: "linkpay", title: "Link payout", body: "Send money with a link. You do not collect account details, and the recipient picks UPI, bank, or wallet.", visual: "link" },
  ].map((p, i) => `
    <article class="payout-item ${i === 0 ? "is-open" : ""}">
      <header><button type="button" aria-expanded="${i === 0}"><span class="ic" style="width:18px">${icon("bank")}</span> ${p.title}</button></header>
      <div class="payout-collapse"><div>
      <div class="payout-body">
        <div><p>${p.body}</p><button class="btn btn-green btn-sm" type="button" data-open="docs" data-doc="payouts">Learn more</button></div>
        ${p.visual === "bulk" ? `<div class="bulk"><div class="file" id="payout-file">Payroll_Apr.xlsx · 186 rows · updated 2m ago</div><div class="line"><span>Engineering</span><b>₹58.2L</b></div><div class="line"><span>Sales</span><b>₹31.6L</b></div><div class="line"><span>Contract staff</span><span id="payout-left">148 done · 38 left</span></div><div class="bar"><span id="payout-bar"></span></div></div>` : `<div class="receive-box"><b>Receive ₹2,500</b><label><span>UPI</span><input type="radio" name="recv" checked></label><label><span>Bank account</span><input type="radio" name="recv"></label><label><span>Wallet</span><input type="radio" name="recv"></label><p class="flow-status" id="recv-status">Waiting for a method</p><button class="btn btn-green" type="button" id="recv-go" style="width:100%;margin-top:8px">Receive payout</button></div>`}
      </div>
      </div></div>
    </article>`).join("");
  syncPayoutInert();

  $("#industry-pills").innerHTML = industries.map((ind, i) =>
    `<button type="button" data-industry="${ind.id}" class="${i === 0 ? "is-on" : ""}">${ind.label}</button>`).join("");
  $("#industry-panels").innerHTML = industries.map((ind, i) => `
    <article class="industry-panel ${i === 0 ? "is-on" : ""}" data-industry-panel="${ind.id}">
      <div class="scene">
        <div class="mock-checkout">
          <div style="display:flex;justify-content:space-between;align-items:center">RTO risk rule <i class="switch"></i></div>
          <div class="riskpill"><span>Low</span><span class="on">${ind.risk}</span><span>High</span></div>
          <div style="background:#0c2414;border-radius:12px;padding:10px;margin-top:8px">
            <div>Order total ₹2,120</div>
            <div style="display:flex;justify-content:space-between;margin-top:8px"><span class="split-now">Pay ₹100 now</span><span class="split-later">₹2,020 on delivery</span></div>
          </div>
        </div>
        <div class="scene-copy">
          <h3>${ind.title}</h3>
          <p>${ind.body}</p>
          <div class="chips">${ind.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
        </div>
      </div>
    </article>`).join("");

  $("#faq-pills").innerHTML = Object.keys(faqs).map((name, i) =>
    `<button type="button" data-faq="${name}" class="${i === 0 ? "is-on" : ""}">${name}</button>`).join("");
  renderFaq("Getting started");

  setCode("curl");
  renderSettle();
  $("#theme-swatches").innerHTML = themes.map((c, i) =>
    `<button type="button" class="${i === 0 ? "is-on" : ""}" style="background:${c}" data-theme="${c}" aria-label="Theme ${c}"></button>`).join("");
  applyTheme(themes[0]);
  fillSelect($("#pay-ccy"), ["INR", "USD", "EUR"]);
  fillSelect($("#get-asset"), assets);
  updateQuote();
}

function fillSelect(el, values) {
  el.innerHTML = values.map((v) => `<option>${v}</option>`).join("");
}

function renderFaq(name) {
  $("#faq-list").innerHTML = faqs[name].map(([q, a], i) => `
    <div class="faq-item ${i === 0 ? "is-open" : ""}">
      <button class="q" type="button" aria-expanded="${i === 0}" aria-controls="faq-a-${i}">${q}<span class="pm" aria-hidden="true">${i === 0 ? "–" : "+"}</span></button>
      <div class="a" id="faq-a-${i}"><div ${i === 0 ? "" : "inert"}>${a}</div></div>
    </div>`).join("");
}

// Collapsed accordion content stays in the DOM for the height animation,
// so take it out of the tab order and the accessibility tree while closed.
function syncPayoutInert() {
  $$(".payout-item").forEach((item) => {
    const inner = $(".payout-collapse > div", item);
    if (inner) inner.inert = !item.classList.contains("is-open");
  });
}

function setCode(lang) {
  $("#code-block").textContent = codeSamples[lang];
  $$("#code-langs button").forEach((b) => b.classList.toggle("is-on", b.dataset.lang === lang));
}

function renderSettle() {
  const rows = [
    ["₹2,450", "UPI · just now"],
    ["$1,800", "Card · 4m ago"],
    ["₹899", "Link · 11m ago"],
  ];
  $("#settle-card").innerHTML = `<p class="settle-phase" id="settle-phase">On-ramp clearing</p>` +
    rows.map((r) => `<div class="mini-row"><b>${r[0]}</b><span>${r[1]}</span></div>`).join("") +
    `<button class="btn btn-green btn-sm" type="button" id="settle-now" style="margin-top:8px">Settle available balance</button>`;
}

function updateQuote() {
  const side = $(".buy-sell button.is-on")?.dataset.side || "buy";
  const amount = Math.max(0, Number($("#pay-amount").value) || 0);
  const fee = 0.012;
  let receive = 0;
  let digits = 2;
  if (side === "buy") {
    const ccy = $("#pay-ccy").value;
    const asset = $("#get-asset").value;
    const usd = ccy === "INR" ? amount / rates.INR : amount / (rates[ccy] || 1);
    receive = usd * (1 - fee);
    if (asset === "BTC") { receive /= 64000; digits = 6; }
    $("#pay-label").textContent = "You pay";
    $("#get-label").textContent = "You receive";
    const per = asset === "BTC" ? 64000 * (ccy === "INR" ? rates.INR : (rates[ccy] || 1)) : (ccy === "INR" ? rates.INR : (rates[ccy] || 1));
    $("#rate-line").textContent = `1 ${asset} = ${ccy === "INR" ? "₹" : ""}${per.toLocaleString("en-IN")} · fee 1.20%`;
  } else {
    const sold = $("#pay-ccy").value;
    const out = $("#get-asset").value;
    const units = sold === "BTC" ? amount * 64000 : amount;
    const usd = units * (1 - fee);
    receive = out === "INR" ? usd * rates.INR : usd * (rates[out] || 1);
    $("#pay-label").textContent = "You sell";
    $("#get-label").textContent = "You receive";
    $("#rate-line").textContent = "Fee 1.20% · rate locked for this quote";
  }
  $("#receive").textContent = receive.toLocaleString("en-IN", { maximumFractionDigits: digits, minimumFractionDigits: digits > 2 ? 4 : 2 });
}

function applyTheme(color) {
  $("#theme-phone").style.borderColor = color;
  $("#theme-pay").style.background = color;
  $("#theme-query").textContent = `themeColor=${encodeURIComponent(color)}&colorMode=LIGHT`;
}

let lastFocus = null;
function rememberFocus() {
  if (!$("#backdrop").classList.contains("is-on")) lastFocus = document.activeElement;
}

function openModal(html, titleId) {
  rememberFocus();
  if ($("#drawer").classList.contains("is-on")) {
    $("#drawer").classList.remove("is-on");
    $("#drawer").setAttribute("aria-hidden", "true");
  }
  const modal = $("#modal");
  modal.innerHTML = `<button class="close-x" type="button" data-close aria-label="Close">×</button>${html}`;
  modal.classList.add("is-on");
  $("#backdrop").classList.add("is-on");
  $("#backdrop").hidden = false;
  document.body.classList.add("modal-open");
  const focusable = modal.querySelector("input, button, select, textarea");
  if (focusable) focusable.focus();
  modal.dataset.title = titleId || "";
}

function openDrawer(html) {
  rememberFocus();
  $("#modal").classList.remove("is-on");
  $("#drawer").innerHTML = `<button class="close-x" type="button" data-close aria-label="Close">×</button>${html}`;
  $("#drawer").classList.add("is-on");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#backdrop").classList.add("is-on");
  $("#backdrop").hidden = false;
  document.body.classList.add("modal-open");
  $("#drawer .close-x").focus({ preventScroll: true });
}

function closeOverlays() {
  const wasOpen = $("#backdrop").classList.contains("is-on");
  $("#modal").classList.remove("is-on");
  $("#drawer").classList.remove("is-on");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#backdrop").classList.remove("is-on");
  $("#backdrop").hidden = true;
  document.body.classList.remove("modal-open");
  if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  lastFocus = null;
}

// Keep Tab inside whichever overlay is open.
function trapFocus(e) {
  if (e.key !== "Tab") return;
  const box = $("#modal.is-on") || $("#drawer.is-on");
  if (!box) return;
  const items = $$("a[href], button:not([disabled]), input:not([disabled]), select, textarea", box).filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}

function formShell(title, text, fields, submitLabel) {
  return `<h2 id="modal-title">${title}</h2><p style="color:#667085">${text}</p>
    <form class="form" data-validate>
      ${fields.map((f) => `<label>${f.label}<input name="${f.name}" type="${f.type || "text"}" ${f.required ? "required" : ""} ${f.placeholder ? `placeholder="${f.placeholder}"` : ""}><span class="err"></span></label>`).join("")}
      <button class="btn btn-blue" type="submit">${submitLabel}</button>
    </form>`;
}

const docs = {
  widget: ["Widget", "Open the hosted ramp with a publishable key. themeColor changes the button and the border.", codeSamples.curl],
  quotes: ["Quotes", "Ask for a rate before you create an order. Quotes expire in 15 minutes on this demo.", codeSamples.node],
  orders: ["Orders", "Create an order from a quote. Listen for order.completed on your webhook.", codeSamples.python],
  payouts: ["Payouts", "Send a payout to a bank account, a UPI ID, or a link the recipient opens.", codeSamples.curl],
};

function openDocs(key) {
  const [title, text, code] = docs[key] || docs.orders;
  openDrawer(`<h2>${title}</h2><p>${text}</p>
    <div class="docs-side">
      ${Object.keys(docs).map((k) => `<button type="button" data-doc="${k}" class="${k === key ? "is-on" : ""}">${docs[k][0]}</button>`).join("")}
    </div>
    <div class="code"><pre style="margin:0;white-space:pre-wrap">${code}</pre></div>`);
}

function bind() {
  $("#tab-ind").addEventListener("click", () => setAudience("individual"));
  $("#tab-biz").addEventListener("click", () => setAudience("business"));

  $(".burger").addEventListener("click", () => {
    setMobileNav($(".burger").getAttribute("aria-expanded") !== "true");
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && $(".burger").getAttribute("aria-expanded") === "true") setMobileNav(false);
    positionSegThumb(false);
  }, { passive: true });

  $("#cover-grid").addEventListener("pointermove", (e) => {
    const card = e.target.closest(".cover-card");
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - box.left}px`);
    card.style.setProperty("--my", `${e.clientY - box.top}px`);
  });

  $$(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth > 980) return;
      e.preventDefault();
      const menu = btn.closest(".menu");
      menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
  });

  document.addEventListener("click", (e) => {
    const product = e.target.closest("[data-product]");
    if (product) {
      const p = products[product.dataset.product];
      openDrawer(`<h2>${p.title}</h2><p>${p.body}</p><p>This is the product surface on the TokenPe rail. Talk to sales to turn it on for a business, or use the widget to try a quote.</p><button class="btn btn-blue" type="button" data-open="sales">Talk to sales</button>`);
    }
    const usecase = e.target.closest("[data-usecase]");
    if (usecase && usecase.dataset.usecase) showUsecase(usecase.dataset.usecase);
    const industry = e.target.closest("[data-industry]");
    if (industry && !industry.dataset.industryPanel) {
      $$("[data-industry]").forEach((b) => b.classList.toggle("is-on", b === industry));
      $$("[data-industry-panel]").forEach((p) => p.classList.toggle("is-on", p.dataset.industryPanel === industry.dataset.industry));
    }
    const faq = e.target.closest("[data-faq]");
    if (faq && $("#faq-pills").contains(faq)) {
      $$("#faq-pills button").forEach((b) => b.classList.toggle("is-on", b === faq));
      renderFaq(faq.dataset.faq);
    }
    const q = e.target.closest(".faq-item .q");
    if (q) {
      const item = q.closest(".faq-item");
      const open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open);
      $(".pm", q).textContent = open ? "–" : "+";
      const answer = $(".a > div", item);
      if (answer) answer.inert = !open;
    }
    const navLink = e.target.closest("#nav-links a, .nav-actions button");
    if (navLink && $(".burger").getAttribute("aria-expanded") === "true") setMobileNav(false);
    const doc = e.target.closest("[data-doc]");
    if (doc) openDocs(doc.dataset.doc);
    const open = e.target.closest("[data-open]");
    if (open) {
      e.preventDefault();
      const name = open.dataset.open;
      if (name === "docs") openDocs(open.dataset.doc || "orders");
      else if (name === "sales") openModal(formShell("Talk to sales", "Tell us what you are building. We reply to the work email.", [
        { label: "Name", name: "name", required: true },
        { label: "Work email", name: "email", type: "email", required: true },
        { label: "Company", name: "company", required: true },
        { label: "Website", name: "website", placeholder: "https://" },
      ], "Request a call"));
      else if (name === "signup") openModal(formShell("Create your TokenPe account", "UI only. Nothing is sent to a server.", [
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Password", name: "password", type: "password", required: true },
      ], "Create account"));
      else if (name === "signin") openModal(formShell("Sign in", "Partner and merchant sign-in. UI only.", [
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Password", name: "password", type: "password", required: true },
      ], "Sign in"));
      else if (name === "terms") openModal(`<h2 id="modal-title">Offer terms</h2><p>0% platform fee applies to the first ₹20,00,000 of eligible domestic volume for a new business that finishes onboarding during the offer. After that, the standard platform rate applies. Instant settlement, chargebacks, and payout fees are separate. This page is a design preview and not a live offer.</p>`);
      else if (name === "privacy") openModal(`<h2 id="modal-title">Privacy notice</h2><p>This preview stores your cookie choice in this browser only. Forms on the page are not submitted anywhere. Analytics stays off unless you accept it.</p>`);
      else if (name === "status") openModal(`<h2 id="modal-title">Status</h2><p>All systems operational in this preview. Quotes, checkout, payouts, and webhooks are shown as design states, not live services.</p>`);
      else if (name === "paylink") openModal(`<h2 id="modal-title">Payment link</h2><p>Invoice for ₹1,499. Choose a method and confirm. This does not charge a real account.</p><div class="rails" id="link-rails"><button type="button" class="is-on">UPI</button><button type="button">Card</button></div><button class="btn btn-green" type="button" id="link-paid" style="margin-top:12px">Pay ₹1,499</button>`);
    }
    if (e.target.closest("[data-close]") || e.target.id === "backdrop") closeOverlays();
    const toastBtn = e.target.closest("[data-toast]");
    if (toastBtn) toast(toastBtn.dataset.toast);
    const footerLink = e.target.closest("[data-footer]");
    if (footerLink) {
      e.preventDefault();
      const name = footerLink.dataset.footer;
      if (name === "FAQ") { location.hash = "faq"; return; }
      if (name === "API docs") { openDocs("orders"); return; }
      const modalFor = { About: "status", Careers: "status", Contact: "sales", Privacy: "privacy", Terms: "terms", "Risk note": "terms", "Sign in": "signin", Status: "status" };
      const kind = modalFor[name];
      if (kind) document.querySelector(`[data-open="${kind}"]`)?.click();
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target.closest("form");
    if (!form) return;
    if (form.id === "mini-form") {
      e.preventDefault();
      const data = new FormData(form);
      if (!data.get("name")) { $("#mini-form-note").textContent = "Add a name to continue."; return; }
      $("#mini-form-note").textContent = `Link ready for ${data.get("name")} · ₹${data.get("amount")}.`;
      return;
    }
    if (form.hasAttribute("data-validate")) {
      e.preventDefault();
      let ok = true;
      $$("input", form).forEach((input) => {
        const err = input.parentElement.querySelector(".err");
        input.classList.remove("bad");
        err.textContent = "";
        if (input.required && !input.value.trim()) { ok = false; input.classList.add("bad"); err.textContent = "This field is required."; }
        if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { ok = false; input.classList.add("bad"); err.textContent = "Enter a valid email."; }
        if (input.name === "password" && input.value && input.value.length < 8) { ok = false; input.classList.add("bad"); err.textContent = "Use at least 8 characters."; }
      });
      if (!ok) return;
      form.outerHTML = `<div class="success"><strong>Saved on this page only.</strong><p>No account was created and no message was sent. This is the UI state after a valid form.</p></div>`;
    }
  });

  $$(".buy-sell button").forEach((btn) => btn.addEventListener("click", () => {
    $$(".buy-sell button").forEach((b) => b.classList.toggle("is-on", b === btn));
    const selling = btn.dataset.side === "sell";
    fillSelect($("#pay-ccy"), selling ? assets : ["INR", "USD", "EUR"]);
    fillSelect($("#get-asset"), selling ? ["INR", "USD"] : assets);
    if (selling) $("#pay-amount").value = "100";
    else $("#pay-amount").value = "10000";
    updateQuote();
  }));
  ["pay-amount", "pay-ccy", "get-asset"].forEach((id) => $(`#${id}`).addEventListener("input", updateQuote));
  $("#widget-continue").addEventListener("click", () => {
    $("#widget-home").hidden = true;
    $("#widget-pay").hidden = false;
    const side = $(".buy-sell button.is-on").dataset.side;
    $("#pay-title").textContent = side === "buy" ? "Pay with UPI" : "Send to your bank";
    $("#pay-summary").textContent = `${$("#pay-amount").value} ${$("#pay-ccy").value} → ${$("#receive").textContent} ${$("#get-asset").value}`;
  });
  $("#widget-back").addEventListener("click", () => {
    $("#widget-pay").hidden = true;
    $("#widget-home").hidden = false;
  });
  $("#widget-confirm").addEventListener("click", () => {
    const upi = $("#upi-id").value.trim();
    if ($("#pay-title").textContent.includes("UPI") && !upi.includes("@")) {
      toast("Enter a UPI ID such as name@upi");
      return;
    }
    toast("Quote confirmed in the preview. No payment was sent.");
    $("#widget-pay").hidden = true;
    $("#widget-home").hidden = false;
  });
  $$("[data-widget-mode]").forEach((btn) => btn.addEventListener("click", () => {
    document.getElementById("integrate").scrollIntoView({ behavior: "smooth" });
    const side = btn.dataset.widgetMode;
    $(`.buy-sell button[data-side="${side}"]`).click();
  }));

  $("#theme-swatches").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme]");
    if (!btn) return;
    $$("#theme-swatches button").forEach((b) => b.classList.toggle("is-on", b === btn));
    applyTheme(btn.dataset.theme);
  });

  $("#payouts").addEventListener("click", (e) => {
    const head = e.target.closest(".payout-item header button");
    if (!head) return;
    const item = head.closest(".payout-item");
    $$(".payout-item").forEach((el) => {
      const on = el === item;
      el.classList.toggle("is-open", on);
      $("header button", el).setAttribute("aria-expanded", on);
    });
    syncPayoutInert();
  });
  document.addEventListener("click", (e) => {
    if (e.target.id === "recv-go") toast("Payout link ready. The recipient still has to choose an account.");
    if (e.target.id === "settle-now") toast("₹4,149 queued for instant settlement in this preview.");
    if (e.target.id === "link-paid") { toast("₹1,499 marked paid in the preview."); closeOverlays(); }
  });

  $("#code-langs").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (btn) setCode(btn.dataset.lang);
  });
  $("#copy-code").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#code-block").textContent); toast("Copied"); }
    catch { toast("Copy blocked in this browser"); }
  });
  $("#sandbox-run").addEventListener("click", () => {
    const amount = 10000;
    const receive = ((amount / rates.INR) * 0.988).toFixed(2);
    $("#sandbox-out").textContent = `POST /v1/quotes 200\n{ "pay": "INR", "amount": "${amount}", "receive": "USDT", "out": "${receive}", "fee": "1.20%" }`;
  });

  const cookie = $("#cookie");
  let saved = null;
  try { saved = localStorage.getItem("tokenpe-cookie"); } catch (err) { saved = null; }
  if (cookie && saved) cookie.remove();
  if (cookie && !saved) {
    document.body.classList.add("cookie-open");
    $("#cookie-settings").addEventListener("click", () => cookie.classList.toggle("settings"));
    const rememberCookie = (value) => { try { localStorage.setItem("tokenpe-cookie", value); } catch (err) { /* preview only */ } };
    $("#cookie-reject").addEventListener("click", () => { rememberCookie("rejected"); hideCookie(); });
    $("#cookie-accept").addEventListener("click", () => {
      const analytics = $("#cookie-analytics") && $("#cookie-analytics").checked;
      rememberCookie(analytics ? "analytics" : "necessary");
      hideCookie();
    });
  }

  let scrollQueued = false;
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; onScroll(); });
  }, { passive: true });
  onScroll();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($(".burger").getAttribute("aria-expanded") === "true") setMobileNav(false);
      closeOverlays();
    }
    trapFocus(e);
  });
  positionSegThumb(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => positionSegThumb(false));

  const liveTimer = setInterval(() => {
    const el = $("#live-count");
    const n = 2800 + Math.floor(Math.random() * 80);
    el.textContent = n.toLocaleString("en-IN");
  }, 2600);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(liveTimer);
}

function hideCookie() {
  const bar = $("#cookie");
  if (bar) bar.remove();
  document.body.classList.remove("cookie-open");
}

function setAudience(mode) {
  document.body.classList.toggle("audience-individual", mode === "individual");
  $("#tab-ind").classList.toggle("is-on", mode === "individual");
  $("#tab-biz").classList.toggle("is-on", mode === "business");
  $("#tab-ind").setAttribute("aria-selected", mode === "individual");
  $("#tab-biz").setAttribute("aria-selected", mode === "business");
  positionSegThumb(true);
}

function positionSegThumb(animate) {
  const seg = $(".seg");
  const on = seg && $("button.is-on", seg);
  if (!on || !on.offsetWidth) return;
  seg.classList.toggle("no-anim", !animate);
  seg.style.setProperty("--thumb-x", `${on.offsetLeft}px`);
  seg.style.setProperty("--thumb-w", `${on.offsetWidth}px`);
  seg.classList.add("has-thumb");
}

function setMobileNav(open) {
  $(".burger").setAttribute("aria-expanded", String(open));
  $("#nav-links").classList.toggle("is-open", open);
  $(".nav-actions").classList.toggle("is-open", open);
  document.body.classList.toggle("modal-open", open);
}

function showUsecase(id) {
  $$("#usecase-pills button").forEach((b) => {
    const on = b.dataset.usecase === id;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-selected", on);
  });
  $$(".usecase-panel").forEach((p) => p.classList.toggle("is-on", p.dataset.panel === id));
}

function onScroll() {
  $("#sticky").classList.toggle("scrolled", window.scrollY > 8);
  const ids = ["collect", "disburse"];
  const nav = $("#section-nav");
  const start = $("#collect").getBoundingClientRect().top;
  const end = $("#industries").getBoundingClientRect().top;
  nav.classList.toggle("is-hidden", start > 200 || end < 120);
  let current = ids[0];
  ids.forEach((id) => {
    if (document.getElementById(id).getBoundingClientRect().top < 180) current = id;
  });
  $$("#section-nav a").forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === `#${current}`));
}

renderStatic();
bind();
