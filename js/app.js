const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const features = ["Bitcoin", "Ethereum", "Solana", "Tron", "Sui", "Base", "Polygon", "Arbitrum", "Optimism", "BNB Chain", "Avalanche"];

const products = [
  { title: "Crypto-to-Crypto", body: "Accept BTC, ETH, SOL, TRX, SUI, and USDC and USDT on supported chains. Keep it as received or convert to USDC or USDT.", icon: "ramp", drawer: "sales" },
  { title: "Crypto-to-Fiat Payouts", body: "Pay out to bank accounts in supported countries. See the conversion before you confirm.", icon: "bank", drawer: "sales" },
  { title: "Supported networks", body: "Bitcoin, Ethereum, Solana, Tron, Sui, Base, Polygon, Arbitrum, Optimism, BNB Chain and Avalanche.", icon: "globe", drawer: "assets" },
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

// Brand-ish colour and short code for each network, used by the logo strip and the networks list.
const networkMarks = {
  Bitcoin: ["#f7931a", "BTC"], Ethereum: ["#627eea", "ETH"], Solana: ["#9945ff", "SOL"], Tron: ["#ff2a3a", "TRX"],
  Sui: ["#4da2ff", "SUI"], Base: ["#0052ff", "BASE"], Polygon: ["#8247e5", "POL"], Arbitrum: ["#28a0f0", "ARB"],
  Optimism: ["#ff0420", "OP"], "BNB Chain": ["#f0b90b", "BNB"], Avalanche: ["#e84142", "AVAX"],
};

// Old section links (footer, bookmarks) that point at sections no longer on the page.
const legacyHashes = { "#gaming": "#faq", "#disburse": "#integrate", "#usecases": "#integrate", "#collect": "#integrate", "#waitlist": "#integrate", "#industries": "#covered", "#stack": "#covered" };

const faqs = {
  "Getting started": [
    ["What is TokenPe?", "TokenPe lets businesses accept crypto, settle in crypto, and pay out to bank accounts."],
    ["How do I open an account?", "Use Get started. We verify your business, its owners and its activities before you go live. TokenPe serves businesses only."],
  ],
  "Products": [
    ["Which products are live?", "Crypto-to-Crypto and Crypto-to-Fiat Payouts are live."],
    ["Which networks and assets do you support?", "Bitcoin, Ethereum, Solana, Tron, Sui, Base, Polygon, Arbitrum, Optimism, BNB Chain and Avalanche. Assets are BTC, ETH, SOL, TRX, SUI, and USDC and USDT on supported chains."],
    ["Which countries can you pay out to?", "Bank payouts are available in supported countries. We confirm coverage for your corridors during onboarding."],
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
const arrowIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14L14 6M7 6h7v7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const plusIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

const attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-on"), 2400);
}

function netGlyph(name) {
  const [color, code] = networkMarks[name] || ["#666", name];
  return `<span class="net-ic" style="--c:${color}" aria-hidden="true">${code.slice(0, 1)}</span>`;
}

// Product card visuals. Everything inside is decorative (aria-hidden); the card text carries the meaning.
const coverVisuals = {
  ramp: () => `<span class="cv cv-stack" aria-hidden="true"><span class="cv-swirl"></span>
      ${[["USDC · Solana", "250.00 USDC", "#2775ca", "$"], ["USDT · Tron", "250.00 USDT", "#26a17b", "₮"], ["BTC · Bitcoin", "As received", "#f7931a", "₿"]].map(([n, v, c, g], i) => `
      <span class="stk stk-${i + 1}"><span class="stk-ic" style="--c:${c}">${g}</span><span class="stk-t"><b>${n}</b>${i === 0 ? "<em>Settle as</em>" : ""}</span><span class="stk-v">${v}</span></span>`).join("")}
    </span>`,
  bank: () => `<span class="cv cv-flow" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M27 16 V41 Q27 49 35 49 H42 M73 16 V41 Q73 49 65 49 H58"/><path d="M50 62 V84 M50 68 Q50 74 44 74 H24 Q18 74 18 80 V84 M50 68 Q50 74 56 74 H76 Q82 74 82 80 V84"/></svg>
      <span class="fl-node fl-a">Crypto balance</span><span class="fl-node fl-b">Conversion</span>
      <span class="fl-hub">TokenPe</span>
      <span class="fl-node fl-c"><i>${checkIcon}</i>Bank account</span><span class="fl-node fl-d"><i>${checkIcon}</i>Bank account</span><span class="fl-node fl-e"><i>${checkIcon}</i>Bank account</span>
    </span>`,
  globe: () => {
    const row = (list) => `<span class="orbs-row"><span class="orbs-track">${[...list, ...list, ...list].map((n) => `<span class="orb" style="--c:${networkMarks[n][0]}">${networkMarks[n][1]}</span>`).join("")}</span></span>`;
    return `<span class="cv cv-orbs" aria-hidden="true">${row(features.slice(0, 6))}${row(features.slice(5))}</span>`;
  },
  // Engraved institution from the RampPay brand kit, with the compliance checks pinned over it.
  kyc: () => `<span class="cv cv-institution" aria-hidden="true"><img src="assets/rampay/institution.webp" alt="" width="520" height="458" loading="lazy" decoding="async"><span class="cv-checks">${["Money Services Business", "Every business verified", "Every transfer screened"].map((t) => `<span class="ck"><i>${checkIcon}</i>${t}</span>`).join("")}</span></span>`,
  card: () => `<span class="cv cv-soon" aria-hidden="true"><span class="soon-pill">Coming soon</span><span class="soon-field"><small>Pay with</small><b>Fiat</b></span><span class="soon-field"><small>Receive</small><b>Crypto</b></span></span>`,
};

function renderStatic() {
  const plain = `<div class="marquee-group">${features.map((n) => `<span class="word">${n}</span>`).join("")}</div>`;
  const ctaMarquee = $("#marquee-cta");
  if (ctaMarquee) ctaMarquee.innerHTML = plain + plain;

  const cover = $("#cover-grid");
  if (cover) {
    cover.innerHTML = products.map((p, i) => `
    <button class="cover-card cover-${p.icon}" type="button" data-product="${i}">
      <span class="cover-head"><span class="cover-title"><span>${p.title}</span></span><span class="arrow">${arrowIcon}</span></span>
      <span class="cover-body">${p.body}</span>
      ${coverVisuals[p.icon]()}
    </button>`).join("");
  }

  const methods = $("#method-grid");
  if (methods) {
    methods.innerHTML = ["BTC", "ETH", "SOL", "TRX", "SUI", "USDC", "USDT"]
      .map((m) => `<div class="method">${m}</div>`).join("");
  }

  const subList = $("#sub-list");
  if (subList) {
    const subs = ["As received", "USDC", "USDT"];
    subList.insertAdjacentHTML("beforeend", subs.map((s, i) =>
      `<button type="button" class="${i === 0 ? "is-on" : ""}">${s}</button>`).join(""));
    subList.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      $$("#sub-list button").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
    });
  }

  $("#faq-pills").innerHTML = Object.keys(faqs).map((name, i) =>
    `<button type="button" data-faq="${name}" class="${i === 0 ? "is-on" : ""}" aria-pressed="${i === 0}">${name}</button>`).join("");
  renderFaq("Getting started");

  const codeBlock = $("#code-block");
  if (codeBlock) codeBlock.textContent = codeSample;
  if ($("#settle-card")) renderSettle();
  if ($("#net-list")) renderNetworks();
}

function renderFaq(name) {
  $("#faq-list").innerHTML = faqs[name].map(([q, a], i) => `
    <div class="faq-item ${i === 0 ? "is-open" : ""}">
      <button class="q" type="button" aria-expanded="${i === 0}" aria-controls="faq-a-${i}">${q}<span class="pm" aria-hidden="true">${plusIcon}</span></button>
      <div class="a" id="faq-a-${i}"><div ${i === 0 ? "" : "inert"}>${a}</div></div>
    </div>`).join("");
}

function showFaq(name) {
  $$("#faq-pills button").forEach((b) => {
    const on = b.dataset.faq === name;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
  });
  renderFaq(name);
}

// Supported networks explorer: filter by stablecoin and search by name or coin.
const netState = { filter: "all", query: "" };
function renderNetworks() {
  const q = netState.query.trim().toLowerCase();
  const rows = supportedAssets.filter(([net, coin, usdc, usdt]) => {
    if (netState.filter === "usdc" && !usdc) return false;
    if (netState.filter === "usdt" && !usdt) return false;
    return !q || net.toLowerCase().includes(q) || (coin || "").toLowerCase().includes(q);
  });
  const tag = (label, on) => `<em class="${on ? "on" : "off"}" aria-label="${label} ${on ? "supported" : "not supported"}">${label}</em>`;
  $("#net-list").innerHTML = rows.length
    ? rows.map(([net, coin, usdc, usdt]) => `<li>${netGlyph(net)}<b>${net}</b><span class="net-tags">${coin ? `<em class="native">${coin}</em>` : ""}${tag("USDC", usdc)}${tag("USDT", usdt)}</span></li>`).join("")
    : `<li class="net-empty">No supported network matches “${escapeText(netState.query.trim())}”. Try Ethereum, Solana or Tron.</li>`;
}

function renderSettle() {
  const rows = [
    ["KYB", "Every business verified"],
    ["OFAC", "Sanctions screening"],
    ["Analytics", "Every transfer screened"],
  ];
  $("#settle-card").innerHTML = `<p class="settle-phase">Screening</p>` +
    rows.map((r) => `<div class="mini-row"><b>${r[0]}</b><span>${r[1]}</span></div>`).join("") +
    `<a class="pill pill-dark pill-sm" href="/legal/aml.html">Read our AML policy</a>`;
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
      `<button class="pill pill-blue" type="button" data-open="sales">Talk to sales</button>`;
  } else if (p.drawer === "waitlist") {
    html += `<p>Fiat-to-Crypto is not available yet. Join the waitlist and we will email you when it launches.</p>` +
      `<a class="pill pill-blue" href="#waitlist" data-close>Join the waitlist</a>`;
  } else {
    html += `<p>Talk to sales to see how this works for your business. Custom pricing for your volume.</p>` +
      `<button class="pill pill-blue" type="button" data-open="sales">Talk to sales</button>`;
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
      <button class="pill pill-blue" type="submit">${submitLabel}</button>
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
  payouts: ["Payouts", "Send crypto to wallets, or pay out to bank accounts in supported countries.", null],
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
  const moved = legacyHashes[location.hash];
  if (moved) {
    if (location.hash === "#gaming") showFaq("Gaming & support");
    history.replaceState(null, "", moved);
    document.querySelector(moved).scrollIntoView();
    return;
  }
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

  $("#cover-grid")?.addEventListener("pointermove", (e) => {
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
    const faq = e.target.closest("[data-faq]");
    if (faq && $("#faq-pills").contains(faq)) showFaq(faq.dataset.faq);
    const netFilter = e.target.closest("[data-net-filter]");
    if (netFilter) {
      netState.filter = netFilter.dataset.netFilter;
      $$("[data-net-filter]").forEach((b) => {
        b.classList.toggle("is-on", b === netFilter);
        b.setAttribute("aria-pressed", b === netFilter);
      });
      renderNetworks();
    }
    const q = e.target.closest(".faq-item .q");
    if (q) {
      const item = q.closest(".faq-item");
      const open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open);
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

  $("#theme-pay")?.addEventListener("click", () => toast("Preview only. No payout was sent."));
  $("#net-search")?.addEventListener("input", (e) => {
    netState.query = e.target.value;
    renderNetworks();
  });

  $("#copy-code")?.addEventListener("click", async () => {
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

function onScroll() {
  $("#sticky").classList.toggle("scrolled", window.scrollY > 8);
}

renderStatic();
bind();
