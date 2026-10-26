(function () {
  const host = document.getElementById("site-footer");
  if (!host) return;

  const onHome = Boolean(document.getElementById("cookie"));
  const home = onHome ? "" : "/";

  const columns = [
    {
      title: "Product",
      links: [
        { name: "Crypto payments", href: home + "#integrate" },
        { name: "Off-ramp", href: home + "#integrate" },
        { name: "Settle", href: home + "#networks" },
        { name: "Developers", href: home + "#developers" },
        { name: "FAQ", href: home + "#faq" },
        { name: "Contact us", href: "mailto:contact@tokenpe.com" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Terms", href: "/legal/terms.html" },
        { name: "Privacy", href: "/legal/privacy.html" },
        { name: "Cookies", href: "/legal/cookies.html" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "AML policy", href: "/legal/aml.html" },
        { name: "Acceptable use", href: "/legal/acceptable-use.html" },
        { name: "Risk disclosure", href: "/legal/risk-disclosure.html" },
        { name: "Complaints", href: "/legal/complaints.html" },
        { name: "Gaming operators", href: "/legal/gaming-operators.html" },
        onHome
          ? { name: "Cookie settings", href: "/legal/cookies.html", footer: "cookies" }
          : { name: "Cookie settings", href: "/legal/cookies.html" },
      ],
    },
  ];

  const css = [
    "@font-face{font-family:\"Die Grotesk C\";src:url(\"/assets/fonts/die-grotesk-medium.woff2\") format(\"woff2\");font-weight:500;font-style:normal;font-display:swap}",
    ".tp-foot{position:relative;overflow:hidden;background:#fff;color:#1e1e1e;font-family:\"Die Grotesk C\",Geist,Inter,\"Segoe UI\",system-ui,sans-serif;font-synthesis:none;-webkit-font-smoothing:antialiased}",
    ".tp-foot a{color:inherit;text-decoration:none}",
    ".tp-foot :focus-visible{outline:2px solid #fff;outline-offset:3px}",
    ".tp-foot-word{margin:0;padding:clamp(64px,8vw,112px) 6vw 0;text-align:center;font-size:clamp(48px,10vw,128px);font-weight:500;line-height:.8;letter-spacing:-.045em;color:transparent;-webkit-text-stroke:1px rgba(0,0,0,.4);opacity:.5;user-select:none;white-space:nowrap}",
    ".tp-foot-panel{position:relative;z-index:1;margin-top:-.12em;min-height:400px;background:#1C76F8;color:#fff}",
    ".tp-foot-flutes{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 14px,rgba(255,255,255,.09) 14px 15px,transparent 15px 28px,rgba(0,0,0,.12) 28px 30px);mix-blend-mode:soft-light}",
    "@media (prefers-reduced-motion:no-preference){.tp-foot-flutes{animation:tp-flute 14s linear infinite}}",
    "@keyframes tp-flute{to{background-position:56px 0}}",
    ".tp-foot-inner{position:relative;z-index:1;display:flex;flex-wrap:wrap;justify-content:space-between;gap:48px 32px;width:min(1120px,calc(100% - 48px));margin:0 auto;padding:clamp(56px,8vw,96px) 0}",
    ".tp-foot-brand{display:flex;flex-direction:column;justify-content:space-between;gap:40px;max-width:360px}",
    ".tp-foot-mark{margin:0 0 8px;font-size:22px;font-weight:500;letter-spacing:-.03em}",
    ".tp-foot-brand h2{margin:0;font-size:clamp(20px,2vw,22px);font-weight:500;line-height:1.25}",
    ".tp-foot-base{display:grid;gap:8px}",
    ".tp-foot-social{width:min(200px,70vw)}",
    ".tp-foot-social svg{display:block;width:100%;height:auto}",
    ".tp-foot-copy,.tp-foot-note{margin:0;font-weight:400;line-height:1.45}",
    ".tp-foot-copy{font-size:13px;color:rgba(255,255,255,.82)}",
    ".tp-foot-note{max-width:36ch;font-size:12px;color:rgba(255,255,255,.72)}",
    ".tp-foot-note a{text-decoration:underline;text-underline-offset:2px}",
    ".tp-foot-cols{display:flex;flex-wrap:wrap;gap:40px 72px}",
    ".tp-foot-col{display:grid;align-content:start;gap:18px;min-width:140px}",
    ".tp-foot-col h3{margin:0;font-size:20px;font-weight:600}",
    ".tp-foot-col ul{list-style:none;margin:0;padding:0;display:grid;gap:12px}",
    ".tp-foot-col a{font-size:15px;font-weight:500;color:rgba(255,255,255,.72)}",
    ".tp-foot-col a:hover{color:#fff}",
    "@media (max-width:720px){.tp-foot-inner{width:calc(100% - 40px)}.tp-foot-word{font-size:clamp(56px,18vw,120px)}.tp-foot-cols{gap:32px 28px}}",
  ].join("");

  const socialSvg = '<svg width="312" height="34" viewBox="0 0 312 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.673 20.703L18.427 28.375H26.885L17.39 15.714L25.29 6.625H22.088L15.905 13.737L10.573 6.625H2.115L11.189 18.727L2.803 28.375H6.005L12.673 20.703ZM19.635 25.958L6.948 9.042H9.364L22.052 25.958H19.635Z" fill="#fff"/><path d="M68.75 5.75C69.413 5.75 70.049 6.013 70.518 6.482C70.987 6.951 71.25 7.587 71.25 8.25V25.75C71.25 26.413 70.987 27.049 70.518 27.518C70.049 27.987 69.413 28.25 68.75 28.25H51.25C50.587 28.25 49.951 27.987 49.482 27.518C49.013 27.049 48.75 26.413 48.75 25.75V8.25C48.75 7.587 49.013 6.951 49.482 6.482C49.951 6.013 50.587 5.75 51.25 5.75H68.75ZM68.125 25.125V18.5C68.125 17.419 67.696 16.383 66.931 15.618C66.167 14.854 65.131 14.425 64.05 14.425C62.987 14.425 61.75 15.075 61.15 16.05V14.662H57.663V25.125H61.15V18.962C61.15 18 61.925 17.212 62.888 17.212C63.352 17.212 63.797 17.397 64.125 17.725C64.453 18.053 64.638 18.498 64.638 18.962V25.125H68.125ZM53.6 12.7C54.157 12.7 54.691 12.479 55.085 12.085C55.479 11.691 55.7 11.157 55.7 10.6C55.7 9.438 54.763 8.488 53.6 8.488C53.04 8.488 52.502 8.71 52.106 9.106C51.71 9.502 51.487 10.04 51.487 10.6C51.487 11.762 52.438 12.7 53.6 12.7ZM55.337 25.125V14.662H51.875V25.125H55.337Z" fill="#fff"/><path d="M124.167 17C124.167 9.18 117.82 2.833 110 2.833C102.18 2.833 95.833 9.18 95.833 17C95.833 23.857 100.707 29.566 107.167 30.883V21.25H104.333V17H107.167V13.458C107.167 10.724 109.391 8.5 112.125 8.5H115.667V12.75H112.833C112.054 12.75 111.417 13.387 111.417 14.167V17H115.667V21.25H111.417V31.096C118.571 30.387 124.167 24.352 124.167 17Z" fill="#fff"/><path d="M167.458 12.922C165.619 6.078 159.292 6.506 159.292 6.506C159.292 6.506 150.542 5.923 150.542 17C150.542 28.078 159.292 27.495 159.292 27.495C159.292 27.495 164.493 27.841 166.875 22.924C167.653 20.757 167.458 16.422 159.875 16.422C159.875 16.422 156.375 16.422 156.375 19.339C156.375 20.478 157.542 21.672 159.292 21.672C161.042 21.672 162.991 20.474 163.375 18.172C164.542 11.172 158.125 10.589 156.375 13.506" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/><path d="M200.1 6.333H209.9C213.633 6.333 216.667 9.367 216.667 13.1V22.9C216.667 24.695 215.954 26.416 214.685 27.685C213.416 28.954 211.695 29.667 209.9 29.667H200.1C196.367 29.667 193.333 26.633 193.333 22.9V13.1C193.333 11.305 194.046 9.584 195.315 8.315C196.584 7.046 198.305 6.333 200.1 6.333ZM199.867 8.667C198.753 8.667 197.684 9.109 196.897 9.897C196.109 10.684 195.667 11.753 195.667 12.867V23.133C195.667 25.455 197.545 27.333 199.867 27.333H210.133C211.247 27.333 212.315 26.891 213.103 26.103C213.891 25.316 214.333 24.247 214.333 23.133V12.867C214.333 10.545 212.455 8.667 210.133 8.667H199.867ZM211.125 10.417C211.512 10.417 211.883 10.57 212.156 10.844C212.43 11.117 212.583 11.488 212.583 11.875C212.583 12.262 212.43 12.633 212.156 12.906C211.883 13.18 211.512 13.333 211.125 13.333C210.738 13.333 210.367 13.18 210.094 12.906C209.82 12.633 209.667 12.262 209.667 11.875C209.667 11.488 209.82 11.117 210.094 10.844C210.367 10.57 210.738 10.417 211.125 10.417ZM205 12.167C206.547 12.167 208.031 12.781 209.125 13.875C210.219 14.969 210.833 16.453 210.833 18C210.833 19.547 210.219 21.031 209.125 22.125C208.031 23.219 206.547 23.833 205 23.833C203.453 23.833 201.969 23.219 200.875 22.125C199.781 21.031 199.167 19.547 199.167 18C199.167 16.453 199.781 14.969 200.875 13.875C201.969 12.781 203.453 12.167 205 12.167ZM205 14.5C204.072 14.5 203.181 14.869 202.525 15.525C201.869 16.181 201.5 17.072 201.5 18C201.5 18.928 201.869 19.819 202.525 20.475C203.181 21.131 204.072 21.5 205 21.5C205.928 21.5 206.818 21.131 207.475 20.475C208.131 19.819 208.5 18.928 208.5 18C208.5 17.072 208.131 16.181 207.475 15.525C206.818 14.869 205.928 14.5 205 14.5Z" fill="#fff"/><path d="M256.367 9.79C255.569 8.879 255.13 7.71 255.13 6.5H251.525V20.967C251.498 21.75 251.167 22.492 250.604 23.036C250.04 23.58 249.287 23.884 248.503 23.883C246.847 23.883 245.47 22.53 245.47 20.85C245.47 18.843 247.407 17.338 249.402 17.957V14.27C245.377 13.733 241.853 16.86 241.853 20.85C241.853 24.735 245.073 27.5 248.492 27.5C252.155 27.5 255.13 24.525 255.13 20.85V13.512C256.592 14.562 258.347 15.125 260.147 15.122V11.517C260.147 11.517 257.953 11.622 256.367 9.79Z" fill="#fff"/><path d="M311.209 8.588C310.88 7.356 309.909 6.385 308.677 6.055C306.443 5.457 297.484 5.457 297.484 5.457C297.484 5.457 288.525 5.457 286.291 6.055C285.059 6.385 284.088 7.356 283.758 8.588C283.159 10.822 283.159 15.484 283.159 15.484C283.159 15.484 283.159 20.145 283.758 22.379C284.088 23.612 285.059 24.583 286.291 24.912C288.525 25.511 297.484 25.511 297.484 25.511C297.484 25.511 306.443 25.511 308.677 24.912C309.909 24.583 310.88 23.612 311.209 22.379C311.808 20.145 311.808 15.484 311.808 15.484C311.808 15.484 311.808 10.822 311.209 8.588ZM294.619 19.781V11.186L302.062 15.484L294.619 19.781Z" fill="#fff"/></svg>';

  const footer = document.createElement("footer");
  footer.className = "tp-foot";
  const style = document.createElement("style");
  style.textContent = css;
  footer.appendChild(style);

  const word = document.createElement("p");
  word.className = "tp-foot-word";
  word.setAttribute("aria-hidden", "true");
  word.textContent = "TokenPe";

  const panel = document.createElement("div");
  panel.className = "tp-foot-panel";
  const flutes = document.createElement("div");
  flutes.className = "tp-foot-flutes";
  flutes.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = "tp-foot-inner";

  const brand = document.createElement("div");
  brand.className = "tp-foot-brand";
  const mark = document.createElement("p");
  mark.className = "tp-foot-mark";
  mark.textContent = "TokenPe";
  const title = document.createElement("h2");
  title.innerHTML = "Global payments<br>infrastructure layer.";
  const base = document.createElement("div");
  base.className = "tp-foot-base";
  const social = document.createElement("div");
  social.className = "tp-foot-social";
  social.innerHTML = socialSvg;
  const copy = document.createElement("p");
  copy.className = "tp-foot-copy";
  copy.textContent = "© 2026 TokenPe, All rights reserved";
  const note = document.createElement("p");
  note.className = "tp-foot-note";
  note.append("Not a bank. Balances are not FDIC or SIPC insured. Crypto is volatile and transfers are irreversible. Gaming: licensed operators only. 18+. ");
  const mail = document.createElement("a");
  mail.href = "mailto:contact@tokenpe.com";
  mail.textContent = "contact@tokenpe.com";
  note.appendChild(mail);
  base.append(social, copy, note);
  brand.append(mark, title, base);

  const cols = document.createElement("div");
  cols.className = "tp-foot-cols";
  columns.forEach((column) => {
    const block = document.createElement("nav");
    block.className = "tp-foot-col";
    block.setAttribute("aria-label", column.title);
    const heading = document.createElement("h3");
    heading.textContent = column.title;
    const list = document.createElement("ul");
    column.links.forEach((link) => {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.name;
      if (link.open) anchor.dataset.open = link.open;
      if (link.footer) anchor.dataset.footer = link.footer;
      item.appendChild(anchor);
      list.appendChild(item);
    });
    block.append(heading, list);
    cols.appendChild(block);
  });

  inner.append(brand, cols);
  panel.append(flutes, inner);
  footer.append(word, panel);
  host.replaceWith(footer);
})();
