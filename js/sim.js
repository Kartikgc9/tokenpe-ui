(function () {
  const root = document.getElementById("pay-sim");
  if (!root) return;

  const status = document.getElementById("sim-status");
  const card = document.getElementById("sim-card");
  const left = document.getElementById("sim-left");
  const right = document.getElementById("sim-right");
  const leftKicker = document.getElementById("sim-left-kicker");
  const leftTitle = document.getElementById("sim-left-title");
  const leftSub = document.getElementById("sim-left-sub");
  const rightTitle = document.getElementById("sim-right-title");
  const rightSub = document.getElementById("sim-right-sub");
  const amountEl = document.getElementById("sim-amount");
  const whereEl = document.getElementById("sim-card-where");
  const kickerEl = document.getElementById("sim-card-kicker");
  const waitEl = document.getElementById("sim-wait");
  const walletsEl = document.getElementById("sim-wallets");
  const qrEl = document.getElementById("sim-qr");
  const openEl = document.getElementById("sim-open");
  const paidEl = document.getElementById("sim-paid");
  const businessEl = document.getElementById("sim-business");
  const usdEl = document.getElementById("sim-usd");
  const runEl = document.getElementById("sim-run");
  const route = document.getElementById("sim-route");
  const packet = document.getElementById("sim-packet");
  const glow = document.getElementById("sim-packet-glow");
  const steps = [...root.querySelectorAll("[data-sim-step]")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const qrSize = 11;
  for (let y = 0; y < qrSize; y += 1) {
    for (let x = 0; x < qrSize; x += 1) {
      const cell = document.createElement("i");
      const finder = (x < 3 && y < 3) || (x > qrSize - 4 && y < 3) || (x < 3 && y > qrSize - 4);
      if (finder || ((x * 7 + y * 3) % 5 > 2)) cell.className = "on";
      qrEl.appendChild(cell);
    }
  }

  let mode = "hosted";
  let pay = "wallet";
  let visible = false;
  let acc = 0;
  let ran = false;
  const routeLength = route.getTotalLength();

  const IDLE = 700;
  const TRAVEL_IN = 1400;
  const SHOW = 1400;
  const PAID = 1100;
  const TRAVEL_OUT = 1200;
  const LANDED = 800;
  const DONE = 2400;
  const TOTAL = IDLE + TRAVEL_IN + SHOW + PAID + TRAVEL_OUT + LANDED + DONE;

  const business = () => businessEl.value.trim() || "Your store";
  const money = () => {
    const n = Number(String(usdEl.value).replace(/[^0-9.]/g, ""));
    const value = Number.isFinite(n) ? n : 0;
    return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const show = (el, on) => { el.hidden = !on; };
  const place = (t, on) => {
    const point = route.getPointAtLength(routeLength * Math.min(1, Math.max(0, t)));
    packet.setAttribute("cx", point.x.toFixed(2));
    packet.setAttribute("cy", point.y.toFixed(2));
    glow.setAttribute("cx", point.x.toFixed(2));
    glow.setAttribute("cy", point.y.toFixed(2));
    packet.setAttribute("opacity", on ? "1" : "0");
    glow.setAttribute("opacity", on ? "0.28" : "0");
  };
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

  const paint = (phase, travel) => {
    const name = business();
    const sum = money();
    const hosted = mode === "hosted";
    amountEl.textContent = sum;
    whereEl.textContent = "USD on " + name;
    kickerEl.textContent = hosted ? "Hosted checkout" : "Embedded";
    steps.forEach((step) => {
      const n = Number(step.dataset.simStep);
      const on = (phase === "in" || phase === "show" || phase === "paid" || phase === "out") && n === 1
        || phase === "landed" && n === 2
        || phase === "done" && n === 3;
      step.classList.toggle("is-on", on);
    });
    left.classList.toggle("is-hot", phase !== "idle");
    right.classList.toggle("is-hot", phase === "landed" || phase === "done");
    card.classList.toggle("is-tilt", phase === "in");
    leftKicker.textContent = name;
    if (phase === "idle") {
      leftTitle.textContent = "Your website";
      leftSub.textContent = "Customer checkout sits here";
    } else {
      leftTitle.textContent = "Customer pays";
      leftSub.textContent = sum + " through TokenPe";
    }
    if (phase === "landed") {
      rightTitle.textContent = "Landed";
      rightSub.textContent = sum + " USDC, net of fees";
    } else if (phase === "done") {
      rightTitle.textContent = "Withdrawn";
      rightSub.textContent = "Settled as USDC";
    } else {
      rightTitle.textContent = "USDC";
      rightSub.textContent = "Any payment lands here";
    }
    const showPay = phase === "show" || phase === "paid" || phase === "out" || phase === "landed" || phase === "done";
    show(waitEl, phase === "idle" || phase === "in");
    waitEl.textContent = phase === "in" ? "Connecting a wallet…" : "Waiting for the customer.";
    show(openEl, phase === "idle");
    show(walletsEl, showPay && pay === "wallet");
    show(qrEl, showPay && pay === "qr");
    show(paidEl, phase === "paid" || phase === "out" || phase === "landed" || phase === "done");
    if (phase === "idle") {
      status.textContent = "Name your business, set an amount, then run the simulation.";
      runEl.textContent = ran ? "Run again" : "Run simulation";
    } else if (phase === "in") {
      status.textContent = "A customer at " + name + " is paying " + sum + " on the website.";
      runEl.textContent = "Running";
    } else if (phase === "show") {
      status.textContent = pay === "qr"
        ? "The customer scans the QR and pays " + sum + " through TokenPe."
        : "The customer connects a wallet and pays " + sum + " through TokenPe.";
      runEl.textContent = "Running";
    } else if (phase === "paid" || phase === "out") {
      status.textContent = "TokenPe confirms the payment with a signed payment.paid event.";
      runEl.textContent = "Running";
    } else if (phase === "landed") {
      status.textContent = sum + " lands in the TokenPe treasury, net of fees.";
      runEl.textContent = "Running";
    } else {
      status.textContent = "A customer at " + name + " paid through TokenPe. The amount landed in the TokenPe treasury, and " + name + " withdrew it. Nothing on this page was sent.";
      runEl.textContent = "Run again";
    }
    let t = 0;
    let packetOn = false;
    if (phase === "in") {
      t = ease(travel) * 0.42;
      packetOn = true;
    } else if (phase === "out") {
      t = 0.58 + ease(travel) * 0.42;
      packetOn = true;
    }
    place(t, packetOn);
    root.dataset.phase = phase;
  };

  const phaseAt = (time) => {
    let cursor = time;
    const spans = [
      ["idle", IDLE],
      ["in", TRAVEL_IN],
      ["show", SHOW],
      ["paid", PAID],
      ["out", TRAVEL_OUT],
      ["landed", LANDED],
      ["done", DONE],
    ];
    for (let i = 0; i < spans.length; i += 1) {
      if (cursor <= spans[i][1]) return { phase: spans[i][0], travel: spans[i][1] ? cursor / spans[i][1] : 0 };
      cursor -= spans[i][1];
    }
    return { phase: "done", travel: 1 };
  };

  root.querySelectorAll("[data-sim-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.simMode;
      root.querySelectorAll("[data-sim-mode]").forEach((item) => item.classList.toggle("is-on", item === button));
    });
  });
  root.querySelectorAll("[data-sim-pay]").forEach((button) => {
    button.addEventListener("click", () => {
      pay = button.dataset.simPay;
      root.querySelectorAll("[data-sim-pay]").forEach((item) => item.classList.toggle("is-on", item === button));
    });
  });
  runEl.addEventListener("click", () => {
    ran = true;
    acc = IDLE;
  });

  if (reduce) {
    paint("done", 1);
    runEl.textContent = "Run again";
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0.35 });
  observer.observe(root);

  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(48, now - last);
    last = now;
    if (visible && !document.hidden) {
      const before = acc;
      acc = (acc + dt) % TOTAL;
      if (acc < before) ran = true;
    }
    const frame = phaseAt(acc);
    paint(frame.phase, frame.travel);
    requestAnimationFrame(tick);
  };
  paint("idle", 0);
  requestAnimationFrame(tick);
})();
