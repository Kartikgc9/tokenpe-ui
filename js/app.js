const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const features = ["Bitcoin", "Ethereum", "Solana", "Tron", "Sui", "Base", "Polygon", "Arbitrum", "Optimism", "BNB Chain", "Avalanche"];

const products = [
  { title: "Crypto-to-Crypto", body: "Accept BTC, ETH, SOL, TRX, SUI, and USDC and USDT on supported chains. Keep it as received or convert to USDC or USDT.", icon: "ramp", drawer: "sales" },
  { title: "Crypto-to-Fiat Payouts", body: "Pay out to bank accounts in 100+ countries. Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported.", icon: "bank", drawer: "sales" },
  { title: "11 networks", body: "Bitcoin, Ethereum, Solana, Tron, Sui, Base, Polygon, Arbitrum, Optimism, BNB Chain and Avalanche.", icon: "globe", drawer: "assets" },
  { title: "Compliance built in", body: "Registered with FinCEN as a Money Services Business. Every business verified. Every transfer screened.", icon: "kyc", drawer: "sales" },
  { title: "Fiat-to-Crypto · Coming soon", body: "Let your customers buy crypto with fiat. Not available yet. Join the waitlist.", icon: "card", drawer: "waitlist" },
];

// Network, native coin (null shows a dash), USDC, USDT. Remove any tick that is not confirmed at launch.
const supportedAssets = [
  ["Bitcoin", "BTC", false, false],
  ["Ethereum", "ETH", true, true],
  ["Solana", "SOL", true, true],
  ["Tron", "TRX", true, true],
  ["Sui", "SUI", true, true],
  ["Base", "ETH", true, true],
  ["Polygon", null, true, true],
  ["Arbitrum", "ETH", true, true],
  ["Optimism", "ETH", true, true],
  ["BNB Chain", null, true, true],
  ["Avalanche", null, true, true],
];

const useCases = [
  { id: "stores", label: "Online stores", title: "Crypto checkout for online stores", body: "Create a payment request for each order. Customers pay from any wallet or exchange on a supported network.", points: ["A payment request for every order", "Address and QR code for the customer", "Webhook when the payment confirms", "Settle in crypto, USDC or USDT"], nodes: ["Customer", "Store"] },
  { id: "digital", label: "Digital services", title: "Get paid for software and digital goods", body: "Take crypto from customers anywhere, with no card chargebacks on crypto payments.", points: ["BTC, ETH, SOL, TRX and SUI", "USDC and USDT on supported chains", "No card chargebacks on crypto payments", "One API for every network"], nodes: ["Customer", "Business"] },
  { id: "marketplaces", label: "Marketplaces", title: "Collect from buyers. Pay out sellers.", body: "Accept crypto from buyers, then pay sellers in crypto or to their bank account.", points: ["Crypto payments from buyers", "Crypto payouts to seller wallets", "Single or bulk payouts by API", "Bank payouts in 100+ countries"], nodes: ["Buyer", "Seller"] },
  { id: "partners", label: "Contractors & affiliates", title: "Pay partners worldwide from one balance", body: "Send commissions and payments to wallets or bank accounts from your TokenPe balance.", points: ["Wallet payouts, single or in bulk", "Bank payouts in 100+ countries", "See the conversion before you confirm", "Track every payout by webhook"], nodes: ["Business", "Partner"] },
  { id: "treasury", label: "Treasury", title: "Turn crypto revenue into local currency", body: "Convert your crypto balance and pay out to your business bank account. Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported.", points: ["Convert to USDC or USDT", "Pay out to your business bank account", "Rate shown before you confirm", "Coverage confirmed during onboarding"], nodes: ["Business", "Bank"] },
];

const industries = [
  { id: "registration", label: "Registration", title: "Registered with FinCEN.", body: '[LEGAL ENTITY NAME] is registered with FinCEN as a Money Services Business, Registration No. [FINCEN MSB NUMBER]. Registration is not a licence or an endorsement. Verify it on FinCEN\'s public <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener">MSB Registrant Search</a>.', chips: ["Money Services Business", "US company", "Bank Secrecy Act", "Public MSB search"] },
  { id: "verification", label: "Verification", title: "Every business verified.", body: "We verify every business, its owners and its licences before it goes live. Gaming operators get enhanced due diligence.", chips: ["KYB", "Beneficial owners", "Licence checks", "Enhanced due diligence"] },
  { id: "screening", label: "Screening", title: "Every transfer screened.", body: "We screen businesses, counterparties and wallet addresses against OFAC sanctions lists, and every transfer with blockchain analytics.", chips: ["OFAC screening", "Blockchain analytics", "Wallet screening", "Restricted jurisdictions blocked"] },
  { id: "monitoring", label: "Monitoring", title: "Ongoing monitoring.", body: "We monitor transactions for unusual activity, report suspicious activity as the law requires, and keep records for at least five years.", chips: ["Transaction monitoring", "Suspicious activity reports", "Five-year records", "Independent testing"] },
  { id: "security", label: "Account security", title: "Account security.", body: 'Protect your account and your team\'s access. Compliance questions: <a href="mailto:compliance@tokenpe.com">compliance@tokenpe.com</a>.', chips: ["Two-factor authentication", "Team roles", "Address allow-listing", "API key controls"] },
];

const faqs = {
  "Getting started": [
    ["What is TokenPe?", "TokenPe is a US company that lets businesses accept crypto, settle in crypto, and pay out to bank accounts in 100+ countries."],
    ["Is TokenPe registered?", 'Yes. [LEGAL ENTITY NAME] is registered with FinCEN as a Money Services Business, Registration No. [FINCEN MSB NUMBER]. You can verify it on FinCEN\'s public <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener">MSB Registrant Search</a>. Registration is not a licence or an endorsement.'],
    ["How do I open an account?", "Use Get started. We verify your business, its owners and its activities before you go live. TokenPe serves businesses only."],
  ],
  "Products": [
    ["Which products are live?", "Crypto-to-Crypto and Crypto-to-Fiat Payouts are live. Fiat-to-Crypto is coming soon and is not available yet. You can join the waitlist."],
    ["Which networks and assets do you support?", "Bitcoin, Ethereum, Solana, Tron, Sui, Base, Polygon, Arbitrum, Optimism, BNB Chain and Avalanche. Assets are BTC, ETH, SOL, TRX, SUI, and USDC and USDT on supported chains."],
    ["Which countries can you pay out to?", "Bank accounts in 100+ countries. Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported. We confirm coverage for your corridors during onboarding."],
  ],
  "Payments": [
    ["Can crypto payments be charged back?", "Confirmed blockchain payments cannot be reversed by a card issuer. You can still send refunds to your customers."],
    ["What if a customer sends on the wrong network?", 'Funds sent on the wrong network or as an unsupported token may be lost. Contact <a href="mailto:support@tokenpe.com">support@tokenpe.com</a> straight away. Recovery is not always possible.'],
    ["How much does TokenPe cost?", "Custom pricing for your volume. Contact sales for pricing."],
  ],
  "Gaming & support": [
    ["Do you work with gaming and casino operators?", "Yes, with operators licensed for the products and markets they serve. Every application gets a full business and licence review."],
    ["Do you accept US players?", "Only for operators licensed by the US state where the player is located, and only where the transaction is lawful."],
    ["How do I get help or report a security issue?", 'Email <a href="mailto:support@tokenpe.com">support@tokenpe.com</a>. For security issues, use the subject "Security".'],
  ],
};

// Match the endpoint and field names to the real API before publishing.
const codeSample = `curl -X POST https://api.tokenpe.com/v1/payments \\
  -H "Authorization: Bearer $TOKENPE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "100.00",
    "currency": "USD",
    "pay_asset": "USDT",
    "network": "tron",
    "order_id": "order_1234"
  }'`;

const checkIcon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

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

const attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

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

  $("#method-grid").innerHTML = ["BTC", "ETH", "SOL", "TRX", "SUI", "USDC", "USDT", "11 networks"]
    .map((m) => `<div class="method">${m}</div>`).join("");

  const subs = ["As received", "USDC", "USDT"];
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
        <ul class="checks">${u.points.map((pt) => `<li>${checkIcon}${pt}</li>`).join("")}</ul>
      </div>
      <div class="rail" data-from="${u.nodes[0]}" data-to="${u.nodes[1]}">
        <div class="rail-steps" aria-hidden="true">
          <span data-step="1" class="is-on">1 · Customer pays</span>
          <span data-step="2">2 · TokenPe confirms</span>
          <span data-step="3">3 · You settle</span>
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
          <text x="350" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="#1461DB">${u.nodes[1]}</text>
        </svg>
        <p class="rail-caption" data-rail-caption>Every payment is confirmed and screened by TokenPe.</p>
      </div>
    </article>`).join("");

  $("#payouts").innerHTML = [
    { title: "Fiat payouts", body: "Convert crypto and pay out to bank accounts in 100+ countries. Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported.", cta: "Talk to sales", visual: "bulk" },
    { title: "Crypto payouts", body: "Send crypto to wallets, one at a time or in bulk, by API.", cta: "Get API access", visual: "crypto" },
  ].map((p, i) => `
    <article class="payout-item ${i === 0 ? "is-open" : ""}">
      <header><button type="button" aria-expanded="${i === 0}"><span class="ic" style="width:18px">${icon("bank")}</span> ${p.title}</button></header>
      <div class="payout-collapse"><div>
      <div class="payout-body">
        <div><p>${p.body}</p><button class="btn btn-green btn-sm" type="button" data-open="sales">${p.cta}</button></div>
        ${p.visual === "bulk" ? `<div class="bulk"><div class="file" id="payout-file">Payout batch · in progress</div><div class="line"><span>Destination</span><b>Bank account</b></div><div class="line"><span>Coverage</span><b>100+ countries</b></div><div class="line"><span>Status</span><span id="payout-left">In progress</span></div><div class="bar"><span id="payout-bar"></span></div></div>` : `<div class="receive-box"><b>Send 250 USDC</b><label><span>Solana</span><input type="radio" name="recv" checked></label><label><span>Tron</span><input type="radio" name="recv"></label><label><span>Ethereum</span><input type="radio" name="recv"></label><p class="flow-status" id="recv-status">Choose a network</p><button class="btn btn-green" type="button" id="recv-go" style="width:100%;margin-top:8px">Send payout</button></div>`}
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
          <div style="display:flex;justify-content:space-between;align-items:center">Transfer screening <i class="switch"></i></div>
          <div class="riskpill"><span class="on">Low</span><span>Medium</span><span>High</span></div>
          <div style="background:#0c2414;border-radius:12px;padding:10px;margin-top:8px">
            <div>Transfer · 250 USDC</div>
            <div style="display:flex;justify-content:space-between;margin-top:8px"><span>Screened</span><span>Cleared</span></div>
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

  $("#code-block").textContent = codeSample;
  renderSettle();
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

function renderSettle() {
  const rows = [
    ["KYB", "Every business verified"],
    ["OFAC", "Sanctions screening"],
    ["Analytics", "Every transfer screened"],
  ];
  $("#settle-card").innerHTML = `<p class="settle-phase">Screening</p>` +
    rows.map((r) => `<div class="mini-row"><b>${r[0]}</b><span>${r[1]}</span></div>`).join("") +
    `<a class="btn btn-green btn-sm" href="/legal/aml.html" style="margin-top:8px">Read our AML policy</a>`;
}

function assetsTable() {
  const mark = (on) => (on ? "✓" : "—");
  return `<table class="assets-table">
    <thead><tr><th scope="col">Network</th><th scope="col">Native coin</th><th scope="col">USDC</th><th scope="col">USDT</th></tr></thead>
    <tbody>${supportedAssets.map(([net, coin, usdc, usdt]) =>
      `<tr><th scope="row">${net}</th><td>${coin || "—"}</td><td>${mark(usdc)}</td><td>${mark(usdt)}</td></tr>`).join("")}</tbody>
  </table>`;
}

function openProduct(p) {
  let html = `<h2>${p.title}</h2><p>${p.body}</p>`;
  if (p.drawer === "assets") {
    html += assetsTable() +
      `<p>Bitcoin does not support USDC or USDT. Stablecoins are accepted only on the networks marked ✓. Always send on the network shown in your payment request. Funds sent on the wrong network may be lost.</p>` +
      `<button class="btn btn-blue" type="button" data-open="sales">Talk to sales</button>`;
  } else if (p.drawer === "waitlist") {
    html += `<p>Fiat-to-Crypto is not available yet. Join the waitlist and we will email you when it launches.</p>` +
      `<a class="btn btn-blue" href="#waitlist" data-close>Join the waitlist</a>`;
  } else {
    html += `<p>Talk to sales to see how this works for your business. Custom pricing for your volume.</p>` +
      `<button class="btn btn-blue" type="button" data-open="sales">Talk to sales</button>`;
  }
  openDrawer(html);
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

const honeypot = '<label class="hp" aria-hidden="true">Leave this empty<input name="bot-field" tabindex="-1" autocomplete="off"></label>';

function formShell(title, text, fields, submitLabel, formName) {
  return `<h2 id="modal-title">${title}</h2><p style="color:#667085">${text}</p>
    <form class="form" data-validate data-form="${formName}" novalidate>
      <input type="hidden" name="title" value="${attr(title)}">
      ${fields.map((f) => `<label>${f.label}${f.required ? " *" : ""}<input name="${f.name}" type="${f.type || "text"}" ${f.required ? "required" : ""} ${f.placeholder ? `placeholder="${attr(f.placeholder)}"` : ""} ${f.value ? `value="${attr(f.value)}"` : ""} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ""}><span class="err"></span></label>`).join("")}
      ${honeypot}
      <button class="btn btn-blue" type="submit">${submitLabel}</button>
      <p class="err" data-form-error role="alert"></p>
    </form>`;
}

function salesForm(title, industry) {
  return formShell(title, 'Tell us about your business. We reply by email with next steps and custom pricing for your volume. See our <a href="/legal/privacy.html">Privacy Policy</a>.', [
    { label: "Name", name: "name", required: true, autocomplete: "name" },
    { label: "Work email", name: "email", type: "email", required: true, autocomplete: "email" },
    { label: "Company", name: "company", required: true, autocomplete: "organization" },
    { label: "Website", name: "website", required: true, placeholder: "https://", autocomplete: "url" },
    { label: "Country", name: "country", required: true, autocomplete: "country-name" },
    { label: "Industry", name: "industry", required: true, placeholder: "e.g. Gaming & Casino", value: industry },
    { label: "Gaming licence", name: "licence", placeholder: "Authority and licence number, if gaming" },
  ], "Send", "sales");
}

// Posts a form to Netlify Forms. The matching static form definitions are in index.html.
async function sendForm(name, data) {
  if (data.get("bot-field")) return;
  data.set("form-name", name);
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data).toString(),
  });
  if (!res.ok) throw new Error(`Form ${name} failed with ${res.status}`);
}

const docs = {
  payments: ["Payments", "Create a payment request. Show the address and QR code to your customer. Get a webhook when it confirms.", codeSample],
  webhooks: ["Webhooks", "Get an event for every payment and payout status change. Full API documentation is shared with verified merchants during onboarding.", null],
  payouts: ["Payouts", "Send crypto to wallets, or pay out to bank accounts in 100+ countries. Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported.", null],
};

function openDocs(key) {
  const [title, text, code] = docs[key] || docs.payments;
  openDrawer(`<h2>${title}</h2><p>${text}</p>
    <div class="docs-side">
      ${Object.keys(docs).map((k) => `<button type="button" data-doc="${k}" class="${k === key ? "is-on" : ""}">${docs[k][0]}</button>`).join("")}
    </div>
    ${code ? `<div class="code"><pre style="margin:0">${code}</pre></div>` : ""}`);
}

// Cookie consent is kept for 12 months, then the banner asks again.
const CONSENT_KEY = "tokenpe-cookie";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (!saved || !saved.choice || Date.now() - saved.at > CONSENT_MAX_AGE) return null;
    return saved.choice;
  } catch (err) {
    return null;
  }
}

function saveConsent(choice) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() })); } catch (err) { /* storage blocked */ }
  if (choice === "analytics") loadAnalytics();
}

// Analytics runs only with consent. No analytics provider is configured yet;
// load its script here once one is chosen.
function loadAnalytics() {}

function showCookie(settings) {
  const bar = $("#cookie");
  if (!bar) return;
  bar.hidden = false;
  bar.classList.toggle("settings", Boolean(settings));
  $("#cookie-analytics").checked = readConsent() === "analytics";
  document.body.classList.add("cookie-open");
}

function hideCookie() {
  const bar = $("#cookie");
  if (bar) {
    bar.hidden = true;
    bar.classList.remove("settings");
  }
  document.body.classList.remove("cookie-open");
}

function openFromHash() {
  const forms = { "#get-started": () => salesForm("Get started with TokenPe"), "#contact": () => salesForm("Talk to sales") };
  const form = forms[location.hash];
  if (!form) return;
  openModal(form());
  history.replaceState(null, "", location.pathname + location.search);
}

function bind() {
  $(".burger").addEventListener("click", () => {
    setMobileNav($(".burger").getAttribute("aria-expanded") !== "true");
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && $(".burger").getAttribute("aria-expanded") === "true") setMobileNav(false);
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
      if (product.tagName === "A") e.preventDefault();
      openProduct(products[product.dataset.product]);
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
    const navLink = e.target.closest("#nav-links a, .nav-actions a, .nav-actions button");
    if (navLink && $(".burger").getAttribute("aria-expanded") === "true") setMobileNav(false);
    const doc = e.target.closest("[data-doc]");
    if (doc) openDocs(doc.dataset.doc);
    const open = e.target.closest("[data-open]");
    if (open) {
      e.preventDefault();
      const name = open.dataset.open;
      if (name === "docs") openDocs(open.dataset.doc || "payments");
      else if (name === "sales") openModal(salesForm("Talk to sales", open.dataset.presetIndustry));
      else if (name === "signup") openModal(salesForm("Get started with TokenPe"));
    }
    if (e.target.closest("[data-close]") || e.target.id === "backdrop") closeOverlays();
    const footerLink = e.target.closest("[data-footer]");
    if (footerLink && footerLink.dataset.footer === "cookies") {
      e.preventDefault();
      showCookie(true);
    }
  });

  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("form");
    if (!form) return;
    if (form.id === "mini-form") {
      e.preventDefault();
      const note = $("#mini-form-note");
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const company = String(data.get("company") || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company) { note.textContent = "Enter your work email and company."; return; }
      const button = $("button[type=submit]", form);
      button.disabled = true;
      try {
        await sendForm("waitlist", data);
        note.textContent = "You are on the list. We will email you when Fiat-to-Crypto launches.";
        form.reset();
      } catch (err) {
        note.textContent = "Something went wrong. Please try again or email sales@tokenpe.com.";
      }
      button.disabled = false;
      return;
    }
    if (form.hasAttribute("data-validate")) {
      e.preventDefault();
      let ok = true;
      $$("input:not([type=hidden]):not([name=bot-field])", form).forEach((input) => {
        const err = input.parentElement.querySelector(".err");
        input.classList.remove("bad");
        err.textContent = "";
        if (input.required && !input.value.trim()) { ok = false; input.classList.add("bad"); err.textContent = "This field is required."; }
        if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { ok = false; input.classList.add("bad"); err.textContent = "Enter a valid email."; }
      });
      if (!ok) return;
      const button = $("button[type=submit]", form);
      const error = $("[data-form-error]", form);
      button.disabled = true;
      error.textContent = "";
      try {
        await sendForm(form.dataset.form, new FormData(form));
        form.outerHTML = `<div class="success"><strong>Thank you.</strong><p>We have received your request and will reply by email.</p></div>`;
      } catch (err) {
        error.textContent = "Something went wrong. Please try again or email sales@tokenpe.com.";
        button.disabled = false;
      }
    }
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
    if (e.target.id === "recv-go" || e.target.id === "theme-pay") toast("Preview only. No payout was sent.");
  });

  $("#copy-code").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#code-block").textContent); toast("Copied"); }
    catch { toast("Copy blocked in this browser"); }
  });

  const consent = readConsent();
  if (consent === "analytics") loadAnalytics();
  if (!consent) showCookie(false);
  $("#cookie-settings").addEventListener("click", () => $("#cookie").classList.toggle("settings"));
  $("#cookie-analytics").addEventListener("change", (e) => saveConsent(e.target.checked ? "analytics" : "necessary"));
  $("#cookie-reject").addEventListener("click", () => { saveConsent("necessary"); hideCookie(); });
  $("#cookie-accept").addEventListener("click", () => { saveConsent("analytics"); hideCookie(); });

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

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
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
  $$("#usecase-panels .usecase-panel").forEach((p) => p.classList.toggle("is-on", p.dataset.panel === id));
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
