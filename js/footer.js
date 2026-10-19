(function () {
  const host = document.getElementById("site-footer");
  if (!host) return;

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const CAP = 100;
  const S = 19;
  const B = 17;
  const f = (n) => String(Math.round(n * 100) / 100);
  const rect = (x, y, w, h) => "M" + f(x) + " " + f(y) + "H" + f(x + w) + "V" + f(y + h) + "H" + f(x) + "Z";
  const slant = (x1, y1, x2, y2, t) => "M" + f(x1) + " " + f(y1) + "H" + f(x1 + t) + "L" + f(x2 + t) + " " + f(y2) + "H" + f(x2) + "Z";
  const at = (cx, cy, rx, ry, deg) => {
    const a = (deg * Math.PI) / 180;
    return f(cx + rx * Math.cos(a)) + " " + f(cy + ry * Math.sin(a));
  };
  const band = (cx, cy, rx, ry, tx, ty, a0, a1) => {
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    const cw = a1 > a0 ? 1 : 0;
    const irx = rx - tx;
    const iry = ry - ty;
    return "M" + at(cx, cy, rx, ry, a0) + "A" + f(rx) + " " + f(ry) + " 0 " + large + " " + cw + " " + at(cx, cy, rx, ry, a1) + "L" + at(cx, cy, irx, iry, a1) + "A" + f(irx) + " " + f(iry) + " 0 " + large + " " + (1 - cw) + " " + at(cx, cy, irx, iry, a0) + "Z";
  };
  const ring = (cx, cy, rx, ry, tx, ty) => {
    const e = (r1, r2) => "M" + f(cx - r1) + " " + f(cy) + "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx + r1) + " " + f(cy) + "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx - r1) + " " + f(cy) + "Z";
    return e(rx, ry) + e(rx - tx, ry - ty);
  };
  const bowl = (x, y, w, h, t, tb) => {
    const ry = h / 2;
    const rx = Math.min(w - t, ry * 0.95);
    const sx = x + w - rx;
    return "M" + f(x) + " " + f(y) + "H" + f(sx) + "A" + f(rx) + " " + f(ry) + " 0 0 1 " + f(sx) + " " + f(y + h) + "H" + f(x) + "Z" + "M" + f(x + t) + " " + f(y + tb) + "H" + f(sx) + "A" + f(rx - t) + " " + f(ry - tb) + " 0 0 1 " + f(sx) + " " + f(y + h - tb) + "H" + f(x + t) + "Z";
  };

  const GLYPHS = {
    A: { w: 96, d: [slant(37, 0, 0, 100, 23), slant(37, 0, 73, 100, 23), rect(18, 60, 60, 16)] },
    B: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 78, 52, S, B), bowl(0, 52 - B, 84, 100 - 52 + B, S, B)] },
    C: { w: 90, d: [band(45, 50, 45, 50, S + 2, B, -40, -320)] },
    D: { w: 90, d: [rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },
    E: { w: 72, d: [rect(0, 0, S, 100), rect(0, 0, 72, B), rect(0, 41.5, 64, B), rect(0, 100 - B, 72, B)] },
    F: { w: 70, d: [rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)] },
    G: { w: 94, d: [band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)] },
    H: { w: 86, d: [rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)] },
    I: { w: S + 2, d: [rect(0, 0, S + 2, 100)] },
    J: { w: 72, d: [rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)] },
    K: { w: 86, d: [rect(0, 0, S, 100), slant(62, 0, 10, 62, 24), slant(30, 42, 62, 100, 24)] },
    L: { w: 68, d: [rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },
    M: { w: 112, d: [rect(0, 0, S + 3, 100), slant(0, 0, 46, 100, 9), slant(68, 0, 40, 100, 22), rect(112 - S - 3, 0, S + 3, 100)] },
    N: { w: 88, d: [rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)] },
    O: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B)] },
    P: { w: 80, d: [rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },
    Q: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)] },
    R: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 82, 58, S, B), slant(34, 50, 62, 100, 22)] },
    S: { w: 80, d: [band(40, 29.25, 40, 29.25, S, B, -22, -273), band(40, 70.75, 40, 29.25, S, B, -93, 158)] },
    T: { w: 82, d: [rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)] },
    U: { w: 86, d: [rect(0, 0, S, 60), rect(86 - S, 0, S, 60), band(43, 58, 43, 42, S, B, 0, 180)] },
    V: { w: 94, d: [slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)] },
    W: { w: 132, d: [slant(0, 0, 26, 100, 20), slant(56, 0, 26, 100, 20), slant(56, 0, 86, 100, 20), slant(112, 0, 86, 100, 20)] },
    X: { w: 92, d: [slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)] },
    Y: { w: 92, d: [slant(0, 0, 35, 56, 22), slant(70, 0, 35, 56, 22), rect(35, 50, 22, 50)] },
    Z: { w: 80, d: [rect(0, 0, 80, B), rect(0, 100 - B, 80, B), slant(56, B - 1, 0, 100 - B + 1, 24)] },
  };
  const SPACE = { w: 42, d: [] };
  const glyphOf = (ch) => GLYPHS[ch.toUpperCase()] || SPACE;
  const SHUTTER = 100;
  const K = 21;
  const REST = 77;
  const turn = (x, y, turns) => {
    const n = ((turns % 4) + 4) % 4;
    let a = x;
    let b = y;
    for (let i = 0; i < n; i++) {
      const t = a;
      a = SHUTTER - b;
      b = t;
    }
    return [a, b];
  };
  const restPivot = (turns) => turn(REST, REST, turns);
  const blades = (px, py, turns) => {
    const q = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns);
    const shapes = [
      [0, 0, K, 0, q[0], q[1], 0, K],
      [q[0], 0, SHUTTER, 0, SHUTTER, K, q[0], q[1]],
      [0, q[1], q[0], q[1], K, SHUTTER, 0, SHUTTER],
    ];
    return shapes.map((shape) => {
      const out = [];
      for (let i = 0; i < shape.length; i += 2) out.push(...turn(shape[i], shape[i + 1], turns));
      return out;
    });
  };
  const layout = (word, shutterAt, gap = 12) => {
    const items = [];
    let x = 0;
    Array.from(word).forEach((ch, i) => {
      const shutter = i === shutterAt && ch.trim() !== "";
      const w = shutter ? SHUTTER : glyphOf(ch).w;
      items.push({ ch, x, w, shutter });
      x += w + gap;
    });
    return { items, width: Math.max(1, x - (items.length ? gap : 0)) };
  };
  const approach = (from, to, k, dt) => to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);
  const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";
  const scramble = (text, progress, seed) => {
    const chars = Array.from(text);
    const settled = Math.floor(clamp(Number.isFinite(progress) ? progress : 1, 0, 1) * chars.length);
    return chars.map((ch, i) => {
      if (i < settled || !/[a-z0-9]/i.test(ch)) return ch;
      const r = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
      return NOISE[Math.floor(r * NOISE.length)];
    }).join("");
  };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim());

  const SVG = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => {
    const node = document.createElementNS(SVG, name);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const arrow = () => {
    const svg = el("svg", { viewBox: "0 0 12 12", "aria-hidden": "true" });
    svg.appendChild(el("path", { d: "M1 6h9.2M6.4 2.2 10.2 6l-3.8 3.8", fill: "none", stroke: "currentColor", "stroke-width": "1.3", "stroke-linecap": "square" }));
    return svg;
  };
  const check = () => {
    const svg = el("svg", { viewBox: "0 0 12 12", "aria-hidden": "true" });
    svg.appendChild(el("path", { d: "M1.5 6.4 4.6 9.4 10.6 2.6", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "square" }));
    return svg;
  };

  const CSS = [
    ".sgf{position:relative;isolation:isolate;overflow:hidden;container-type:inline-size;color:var(--sgf-ink);background:linear-gradient(180deg,var(--sgf-top) 0%,var(--sgf-bg) 28%);font-family:var(--sgf-mono);font-size:clamp(11px,1.12cqw,13.5px);line-height:1.18;letter-spacing:.015em;text-transform:uppercase;-webkit-font-smoothing:antialiased}",
    ".sgf ::selection{background:var(--sgf-ink);color:var(--sgf-bg)}",
    ":where(.sgf) a{color:inherit;text-decoration:none}",
    ":where(.sgf) button{font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}",
    ":where(.sgf) ul{list-style:none;margin:0;padding:0}",
    ":where(.sgf) p{margin:0}",
    ".sgf svg{max-width:none}",
    ".sgf .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
    ".sgf-top{box-sizing:border-box;display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,2fr) auto;column-gap:24px;row-gap:36px;padding:clamp(64px,11.5cqw,150px) clamp(16px,2.6cqw,40px) 0}",
    ".sgf-fade{transition:opacity .8s ease var(--sgf-d,0ms),translate .8s cubic-bezier(.2,.7,.1,1) var(--sgf-d,0ms)}",
    ".sgf[data-in='false'] .sgf-fade{opacity:0;translate:0 10px}",
    ".sgf-form{max-width:280px}",
    ".sgf-lede{max-width:250px}",
    ".sgf-field{position:relative;display:flex;align-items:center;margin-top:clamp(18px,2.2cqw,26px);padding:4px 0 5px;border-bottom:1px solid var(--sgf-ink)}",
    ".sgf-field::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--sgf-ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .5s cubic-bezier(.2,.8,.2,1)}",
    ".sgf-field:focus-within::after{transform:scaleX(1)}",
    ".sgf-field[data-state='error'],.sgf-field[data-state='failed']{animation:sgf-shake .42s cubic-bezier(.36,.07,.19,.97)}",
    "@keyframes sgf-shake{20%,60%{translate:-5px 0}40%,80%{translate:5px 0}}",
    ".sgf-input{flex:1;min-width:0;font:inherit;letter-spacing:inherit;text-transform:uppercase;color:inherit;background:transparent;border:0;outline:none;padding:0;margin:0;border-radius:0;-webkit-appearance:none;appearance:none}",
    ".sgf-input::placeholder{color:var(--sgf-ink);opacity:1;transition:opacity .25s}",
    ".sgf-input:focus::placeholder{opacity:.4}",
    ".sgf-go{flex:none;display:grid;place-items:center;width:26px;height:20px;margin-right:-6px}",
    ".sgf-go svg{width:11px;height:11px;transition:translate .35s cubic-bezier(.2,.8,.2,1)}",
    ".sgf-go:hover svg,.sgf-go:focus-visible svg{translate:4px 0}",
    ".sgf-go:focus-visible{outline:1px dashed var(--sgf-ink);outline-offset:1px}",
    ".sgf-spin{display:inline-block;width:1ch;text-align:center}",
    ".sgf-done{display:flex;align-items:center;gap:10px}",
    ".sgf-done svg{width:12px;height:12px;flex:none}",
    ".sgf-done button{margin-left:auto;opacity:.55;transition:opacity .2s}",
    ".sgf-done button:hover,.sgf-done button:focus-visible{opacity:1;outline:none;text-decoration:underline;text-underline-offset:3px}",
    ".sgf-msg{min-height:1.2em;margin-top:8px;font-size:.86em;opacity:.85}",
    ".sgf-list{display:flex;flex-direction:column;gap:clamp(5px,.6cqw,7px)}",
    ".sgf-link{position:relative;display:inline-flex;align-items:center;gap:.65em;white-space:nowrap;padding:1px 0}",
    ".sgf-link::after{content:'';position:absolute;left:0;right:1.6em;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:100% 50%;transition:transform .4s cubic-bezier(.2,.8,.2,1)}",
    ".sgf-link:hover::after,.sgf-link:focus-visible::after{transform:scaleX(1);transform-origin:0 50%}",
    ".sgf-link svg{width:.8em;height:.8em;flex:none;transition:translate .35s cubic-bezier(.2,.8,.2,1)}",
    ".sgf-link:hover svg,.sgf-link:focus-visible svg{translate:5px 0}",
    ".sgf-link:focus-visible{outline:none}",
    ".sgf-copy{white-space:pre-line}",
    ".sgf-copy span{display:block}",
    ".sgf-copy span+span{margin-top:.7em}",
    ".sgf-mark{box-sizing:border-box;padding:clamp(36px,4.6cqw,64px) clamp(16px,2.6cqw,40px) clamp(14px,2.1cqw,28px)}",
    ".sgf-svg{display:block;width:100%;height:auto;overflow:hidden;fill:var(--sgf-ink)}",
    ".sgf-rise{transition:transform 1.15s cubic-bezier(.16,.84,.2,1) var(--sgf-d,0ms)}",
    ".sgf[data-in='false'] .sgf-rise{transform:translateY(112px)}",
    ".sgf-g{cursor:pointer}",
    ".sgf-flip{transform-box:fill-box;transform-origin:50% 50%}",
    ".sgf-flip.is-flip{animation:sgf-flip .7s cubic-bezier(.2,.8,.2,1)}",
    "@keyframes sgf-flip{0%{transform:scaleY(1)}45%{transform:scaleY(-1)}100%{transform:scaleY(1)}}",
    ".sgf-half{transition:transform .45s cubic-bezier(.2,.9,.25,1.15)}",
    ".sgf-g:hover .sgf-up{transform:translate(5px,-1.5px)}",
    ".sgf-g:hover .sgf-dn{transform:translate(-5px,1.5px)}",
    ".sgf-sh polygon{transition:none}",
    "@container (max-width: 760px){.sgf-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.sgf-top>:first-child,.sgf-top>.sgf-copy{grid-column:1 / -1}.sgf-copy{order:3}.sgf-form{max-width:360px}}",
    "@container (max-width: 420px){.sgf-top{grid-template-columns:minmax(0,1fr)}}",
    "@media (prefers-reduced-motion: reduce){.sgf .sgf-rise,.sgf .sgf-fade,.sgf .sgf-half,.sgf .sgf-link svg,.sgf .sgf-link::after,.sgf .sgf-field::after,.sgf .sgf-go svg{transition:none!important}.sgf .sgf-field,.sgf .sgf-flip{animation:none!important}.sgf[data-in='false'] .sgf-rise{transform:none}.sgf[data-in='false'] .sgf-fade{opacity:1;translate:none}}",
  ].join("");

  const word = "TOKENPE";
  const shutterAt = 1;
  const { items, width } = layout(word, shutterAt);
  const shutterItem = items.find((item) => item.shutter);
  const uid = "sgf" + Math.random().toString(36).slice(2, 8);
  const upId = "sgf-up-" + uid;
  const dnId = "sgf-dn-" + uid;
  const emailId = "sgf-email-" + uid;
  const msgId = "sgf-msg-" + uid;

  let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let still = reduced;
  let turns = 0;
  let visible = false;
  let seen = still;
  const ptr = { x: 0, y: 0, inside: false };
  let pivot = restPivot(0);
  const bladeRefs = [];
  let raf = 0;
  let formState = "idle";
  let spin = 0;
  let spinTimer = 0;
  let alive = true;

  const footer = document.createElement("footer");
  footer.className = "sgf";
  footer.dataset.in = seen ? "true" : "false";
  footer.style.setProperty("--sgf-bg", "#050505");
  footer.style.setProperty("--sgf-top", "#12315f");
  footer.style.setProperty("--sgf-ink", "#f4f4f5");
  footer.style.setProperty("--sgf-mono", '"JetBrains Mono", "Cascadia Mono", "Segoe UI Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace');
  const style = document.createElement("style");
  style.textContent = CSS;
  footer.appendChild(style);

  let delayMs = 0;
  const delay = (node) => {
    delayMs += 60;
    node.style.setProperty("--sgf-d", delayMs + "ms");
  };

  // The home page opens the sales form and the cookie banner in place. Legal pages
  // link back to the home page instead, and to the Cookie Policy for cookie settings.
  const onHome = Boolean(document.getElementById("cookie"));
  const home = onHome ? "" : "/";
  const socials = [
    { label: "Products", href: home + "#covered" },
    { label: "Gaming & Casino", href: home + "#gaming" },
    { label: "Developers", href: home + "#developers" },
    { label: "FAQ", href: home + "#faq" },
    onHome ? { label: "Contact", href: "#", open: "sales" } : { label: "Contact", href: "/#contact" },
    { label: "Sign in", href: "https://app.tokenpe.com" },
    onHome ? { label: "Cookie settings", href: "/legal/cookies.html", footer: "cookies" } : { label: "Cookie settings", href: "/legal/cookies.html" },
  ];
  const legal = [
    { label: "Terms", href: "/legal/terms.html" },
    { label: "Privacy", href: "/legal/privacy.html" },
    { label: "Cookies", href: "/legal/cookies.html" },
    { label: "AML policy", href: "/legal/aml.html" },
    { label: "Acceptable use", href: "/legal/acceptable-use.html" },
    { label: "Risk disclosure", href: "/legal/risk-disclosure.html" },
    { label: "Complaints", href: "/legal/complaints.html" },
    { label: "Gaming operators", href: "/legal/gaming-operators.html" },
  ];

  function scrambleLink(link) {
    const li = document.createElement("li");
    li.className = "sgf-fade";
    delay(li);
    const a = document.createElement("a");
    a.className = "sgf-link";
    a.href = link.href || "#";
    a.setAttribute("aria-label", link.label);
    if (link.footer) a.dataset.footer = link.footer;
    if (link.open) a.dataset.open = link.open;
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.textContent = link.label;
    a.append(span, arrow());
    let frame = 0;
    const run = () => {
      if (still) return;
      cancelAnimationFrame(frame);
      const t0 = performance.now();
      const seed = Math.random() * 100;
      let n = 0;
      const step = (now) => {
        const p = (now - t0) / 420;
        if (p >= 1) {
          span.textContent = link.label;
          return;
        }
        n += 1;
        if (n % 2 === 0) span.textContent = scramble(link.label, p, seed + Math.floor(n / 2));
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    a.addEventListener("pointerenter", run);
    a.addEventListener("focus", run);
    a.addEventListener("click", (event) => {
      if (!link.href || link.href === "#") event.preventDefault();
    });
    li.appendChild(a);
    return li;
  }

  const top = document.createElement("div");
  top.className = "sgf-top";
  const form = document.createElement("form");
  form.className = "sgf-form sgf-fade";
  form.noValidate = true;
  delay(form);
  const label = document.createElement("label");
  label.className = "sgf-lede";
  label.htmlFor = emailId;
  label.style.display = "block";
  label.textContent = "Product updates and new networks";
  const field = document.createElement("div");
  field.className = "sgf-field";
  const input = document.createElement("input");
  input.id = emailId;
  input.className = "sgf-input";
  input.type = "email";
  input.inputMode = "email";
  input.autocomplete = "email";
  input.spellcheck = false;
  input.placeholder = "Work email";
  input.setAttribute("aria-describedby", msgId);
  const trap = document.createElement("input");
  trap.className = "sr-only";
  trap.name = "bot-field";
  trap.tabIndex = -1;
  trap.autocomplete = "off";
  trap.setAttribute("aria-hidden", "true");
  const go = document.createElement("button");
  go.className = "sgf-go";
  go.type = "submit";
  go.setAttribute("aria-label", "Subscribe");
  go.appendChild(arrow());
  const done = document.createElement("div");
  done.className = "sgf-done";
  done.setAttribute("role", "status");
  done.hidden = true;
  const doneText = document.createElement("span");
  doneText.textContent = "You're on the list";
  const undo = document.createElement("button");
  undo.type = "button";
  undo.textContent = "Undo";
  done.append(check(), doneText, undo);
  field.append(input, go, done);
  const message = document.createElement("p");
  message.id = msgId;
  message.className = "sgf-msg";
  message.setAttribute("aria-live", "polite");
  form.append(label, field, message, trap);

  const socialNav = document.createElement("nav");
  socialNav.setAttribute("aria-label", "Company");
  const socialList = document.createElement("ul");
  socialList.className = "sgf-list";
  socials.forEach((link) => socialList.appendChild(scrambleLink(link)));
  socialNav.appendChild(socialList);

  const copy = document.createElement("p");
  copy.className = "sgf-copy sgf-fade";
  delay(copy);
  [
    "© 2026 [LEGAL ENTITY NAME]\n[US ADDRESS]",
    "Registered with FinCEN as a Money Services Business, Reg. No. [FINCEN MSB NUMBER]. Registration is not a licence or an endorsement.",
    "Payouts powered by our Mastercard partnership, available only where Mastercard transfers are supported. Mastercard is a registered trademark of Mastercard International Incorporated.",
    "Not a bank. Balances are not FDIC or SIPC insured. Crypto is volatile and transfers are irreversible.",
    "Gaming: licensed operators only. 18+.",
    "sales@tokenpe.com · support@tokenpe.com · compliance@tokenpe.com",
  ].forEach((line) => {
    const item = document.createElement("span");
    item.textContent = line;
    copy.appendChild(item);
  });

  const legalNav = document.createElement("nav");
  legalNav.setAttribute("aria-label", "Legal");
  const legalList = document.createElement("ul");
  legalList.className = "sgf-list";
  legal.forEach((link) => legalList.appendChild(scrambleLink(link)));
  legalNav.appendChild(legalList);
  top.append(form, socialNav, copy, legalNav);

  const mark = document.createElement("div");
  mark.className = "sgf-mark";
  const sr = document.createElement("p");
  sr.className = "sr-only";
  sr.textContent = word;
  const svg = el("svg", {
    class: "sgf-svg",
    viewBox: "0 0 " + f(width) + " " + CAP,
    "aria-hidden": "true",
    focusable: "false",
  });
  svg.style.aspectRatio = width + " / " + CAP;
  const defs = el("defs");
  const upClip = el("clipPath", { id: upId, clipPathUnits: "userSpaceOnUse" });
  upClip.appendChild(el("rect", { x: -40, y: -200, width: 400, height: 252.6 }));
  const dnClip = el("clipPath", { id: dnId, clipPathUnits: "userSpaceOnUse" });
  dnClip.appendChild(el("rect", { x: -40, y: 51.4, width: 400, height: 250 }));
  defs.append(upClip, dnClip);
  svg.appendChild(defs);

  const paint = (x, y) => {
    blades(x, y, turns).forEach((pts, i) => {
      if (bladeRefs[i]) bladeRefs[i].setAttribute("points", pts.map(f).join(" "));
    });
  };
  const onKey = (event, fn) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fn();
    }
  };

  items.forEach((item, index) => {
    if (!item.ch.trim()) return;
    const wrap = el("g", { transform: "translate(" + f(item.x) + " 0)" });
    const rise = el("g", { class: "sgf-rise" });
    rise.style.setProperty("--sgf-d", 200 + index * 90 + "ms");
    if (item.shutter) {
      const g = el("g", { class: "sgf-g sgf-sh", role: "button", tabindex: "0" });
      g.setAttribute("aria-label", "Turn the shutter");
      g.appendChild(el("rect", { width: SHUTTER, height: CAP, fill: "transparent" }));
      const rest = restPivot(0);
      blades(rest[0], rest[1], 0).forEach((pts) => {
        const poly = el("polygon", { points: pts.map(f).join(" ") });
        bladeRefs.push(poly);
        g.appendChild(poly);
      });
      const spinShutter = () => { turns += 1; };
      g.addEventListener("click", spinShutter);
      g.addEventListener("keydown", (event) => onKey(event, spinShutter));
      rise.appendChild(g);
    } else {
      const glyph = glyphOf(item.ch);
      const g = el("g", { class: "sgf-g sgf-flip", role: "button", tabindex: "0" });
      g.setAttribute("aria-label", "Flip " + item.ch);
      g.appendChild(el("rect", { width: glyph.w, height: CAP, fill: "transparent" }));
      const upper = el("g", { "clip-path": "url(#" + upId + ")" });
      const upperHalf = el("g", { class: "sgf-half sgf-up" });
      const lower = el("g", { "clip-path": "url(#" + dnId + ")" });
      const lowerHalf = el("g", { class: "sgf-half sgf-dn" });
      glyph.d.forEach((d) => {
        upperHalf.appendChild(el("path", { d, "fill-rule": "evenodd" }));
        lowerHalf.appendChild(el("path", { d, "fill-rule": "evenodd" }));
      });
      upper.appendChild(upperHalf);
      lower.appendChild(lowerHalf);
      g.append(upper, lower);
      const flip = () => {
        if (still) return;
        g.classList.remove("is-flip");
        void g.getBoundingClientRect();
        g.classList.add("is-flip");
      };
      g.addEventListener("click", flip);
      g.addEventListener("keydown", (event) => onKey(event, flip));
      g.addEventListener("animationend", () => g.classList.remove("is-flip"));
      rise.appendChild(g);
    }
    wrap.appendChild(rise);
    svg.appendChild(wrap);
  });
  mark.append(sr, svg);
  footer.append(top, mark);
  host.replaceWith(footer);

  const messages = {
    error: "That doesn't look like an email",
    failed: "Couldn't sign you up. Try again",
    sending: "Sending",
  };
  const renderForm = () => {
    const busy = formState === "sending";
    const finished = formState === "done";
    input.hidden = finished;
    go.hidden = finished;
    done.hidden = !finished;
    input.disabled = busy;
    go.disabled = busy;
    input.setAttribute("aria-invalid", formState === "error" ? "true" : "false");
    field.dataset.state = formState === "idle" ? "" : formState;
    message.textContent = messages[formState] || "";
    if (busy && !still) {
      clearInterval(spinTimer);
      spinTimer = setInterval(() => {
        spin += 1;
        go.textContent = "|/-\\"[spin % 4];
      }, 90);
    } else {
      clearInterval(spinTimer);
      if (!finished && !go.querySelector("svg")) {
        go.textContent = "";
        go.appendChild(arrow());
      }
    }
  };
  const shake = () => {
    field.dataset.state = "";
    void field.offsetWidth;
    renderForm();
    if (formState === "error") input.focus();
  };
  input.addEventListener("input", () => {
    if (formState === "error" || formState === "failed") {
      formState = "idle";
      renderForm();
    }
  });
  undo.addEventListener("click", () => {
    input.value = "";
    formState = "idle";
    renderForm();
    input.focus();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (formState === "sending") return;
    const email = input.value;
    if (!isEmail(email)) {
      formState = "error";
      shake();
      return;
    }
    formState = "sending";
    renderForm();
    // Netlify Forms; the matching static "newsletter" form is in index.html.
    let ok = true;
    try {
      if (!trap.value) {
        const body = new URLSearchParams({ "form-name": "newsletter", email: email.trim(), "bot-field": "" });
        const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
        ok = res.ok;
      }
    } catch (err) {
      ok = false;
    }
    if (!alive) return;
    formState = ok ? "done" : "failed";
    if (!ok) shake();
    else renderForm();
  });

  const onPointer = (event) => {
    ptr.inside = event.type !== "pointerleave";
    if (!svg || !shutterItem) return;
    const box = svg.getBoundingClientRect();
    const scale = box.width / width || 1;
    ptr.x = (event.clientX - box.left) / scale - shutterItem.x;
    ptr.y = (event.clientY - box.top) / scale;
  };
  footer.addEventListener("pointermove", onPointer);
  footer.addEventListener("pointerenter", onPointer);
  footer.addEventListener("pointerleave", onPointer);

  const start = () => {
    cancelAnimationFrame(raf);
    if (!shutterItem) return;
    const rest = restPivot(turns);
    if (still || !visible) {
      pivot = rest.slice();
      paint(rest[0], rest[1]);
      return;
    }
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const restNow = restPivot(turns);
      const tx = ptr.inside ? clamp(ptr.x, 8, 92) : restNow[0];
      const ty = ptr.inside ? clamp(ptr.y, 8, 92) : restNow[1];
      pivot = [approach(pivot[0], tx, 0.12, dt), approach(pivot[1], ty, 0.12, dt)];
      paint(pivot[0], pivot[1]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (entry.isIntersecting) {
      seen = true;
      footer.dataset.in = "true";
    }
    start();
  }, { threshold: 0.1 });
  observer.observe(footer);

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMedia = () => {
    reduced = media.matches;
    still = reduced;
    if (still) {
      seen = true;
      footer.dataset.in = "true";
    }
    start();
  };
  if (media.addEventListener) media.addEventListener("change", onMedia);
  window.addEventListener("pagehide", () => {
    alive = false;
    cancelAnimationFrame(raf);
    clearInterval(spinTimer);
    observer.disconnect();
  });
  renderForm();
  start();
})();
