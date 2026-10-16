(function () {
  const host = document.getElementById("branch-demo");
  if (!host) return;

  const QUESTION = "Which TokenPe setup should we ship first?";
  const ANSWER = "Ship the white-label API if checkout has to stay in your product. Use the widget for a hosted ramp you can theme. Use payment links when there is no app yet.";
  const BRANCHES = [
    { id: "links", title: "Payment links", note: "Collect before an app is ready.", score: 74 },
    { id: "widget", title: "Hosted widget", note: "A themed ramp you can embed.", score: 86 },
    { id: "api", title: "White-label API", note: "Checkout stays in your UI.", score: 94 },
  ];
  const FALLBACK = [
    { id: "widget", title: "Hosted widget", note: "Theme the ramp and embed it.", score: 76 },
    { id: "links", title: "Payment link", note: "Collect without a website.", score: 84 },
    { id: "api", title: "Direct API", note: "Quotes, orders, and webhooks.", score: 92 },
  ];
  const FALLBACK_ANSWER = "This preview compares TokenPe setups and shows a sample answer. It does not call a live service.";
  const MOVE_MS = 520;
  const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

  const ICONS = {
    fork: '<circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    stop: '<rect x="3" y="3" width="18" height="18" rx="2"/>',
    replay: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  };

  function icon(name, size) {
    const fill = name === "stop" ? ' fill="currentColor" stroke="none"' : ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return `<svg class="ico ${size || ""}" viewBox="0 0 24 24"${fill} aria-hidden="true">${ICONS[name]}</svg>`;
  }

  function initial() {
    return { status: "idle", prompt: "", value: QUESTION, branches: [], answer: "" };
  }

  let state = initial();
  let motion = { ready: false, reduced: true };
  let run = { id: 0, source: "auto", prompt: QUESTION };
  let started = false;
  let expanded = false;
  let timers = [];
  let animations = [];
  let shimmerAnim = null;
  let viewKey = "";
  const positions = {};

  host.innerHTML = `
    <div class="branch-frame">
      <header class="branch-head">
        <div>
          <p class="branch-kicker">${icon("fork", "ico-sm")} Choose a setup</p>
          <h3>Three ways onto the rail.</h3>
        </div>
        <span class="branch-badge">Preview</span>
      </header>
      <div class="branch-stage" data-demo-stage></div>
      <footer class="branch-foot">
        <span>Preview only. Scores are illustrative.</span>
        <button type="button" class="branch-replay" data-replay>${icon("replay", "ico-sm")} Replay</button>
      </footer>
    </div>`;

  const stage = host.querySelector("[data-demo-stage]");
  const chat = document.createElement("div");
  chat.className = "branch-chat";
  chat.setAttribute("data-slot", "branching-reasoning-chat-input");
  stage.appendChild(chat);

  const transcript = document.createElement("div");
  transcript.className = "branch-transcript";
  transcript.setAttribute("data-transcript", "");
  transcript.setAttribute("role", "region");
  transcript.setAttribute("aria-label", "Conversation");
  transcript.tabIndex = 0;

  const composer = document.createElement("form");
  composer.className = "branch-composer";
  composer.setAttribute("data-composer", "");
  composer.innerHTML = `
    <label class="sr-only" for="branch-question">Your question</label>
    <textarea id="branch-question" rows="1" placeholder="Ask a question…"></textarea>
    <div class="branch-composer-row">
      <span class="branch-hint">${icon("fork", "ico-sm")} Explore approaches</span>
      <button class="branch-send" type="submit" data-action="send" aria-label="Send question"></button>
    </div>`;

  const live = document.createElement("p");
  live.className = "sr-only";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  live.setAttribute("data-announcement", "");

  chat.append(transcript, composer, live);
  const field = composer.querySelector("textarea");
  const actionBtn = composer.querySelector("[data-action]");

  function boundedScore(score) {
    return typeof score === "number" && Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : undefined;
  }

  function chosenBranch() {
    return state.branches.find((branch) => branch.chosen);
  }

  function isOpen() {
    return state.status === "branching" || !chosenBranch() || expanded;
  }

  function headingText() {
    const chosen = chosenBranch();
    if (chosen && state.status !== "branching") return `Chose: ${chosen.title}`;
    if (state.status === "done") return "Approaches considered";
    if (state.branches.length > 0) {
      const count = state.branches.length;
      return `Considering ${count} ${count === 1 ? "approach" : "approaches"}`;
    }
    return "Finding a few ways forward";
  }

  function announcement() {
    const chosen = chosenBranch();
    if (state.status === "idle") return "Ready for a question.";
    if (state.status === "done") return `Response complete. ${state.answer}`;
    if (state.status === "answering") return `${chosen ? `Chose: ${chosen.title}. ` : ""}Writing a response.`;
    return headingText();
  }

  function viewSignature() {
    const chosen = chosenBranch();
    return [state.status, isOpen(), state.prompt, expanded, state.branches.map((branch) => branch.id).join("|"), chosen ? chosen.id : ""].join(":");
  }

  function busy() {
    return state.status === "branching" || state.status === "choosing" || state.status === "answering";
  }

  function paintEmpty() {
    const empty = document.createElement("div");
    empty.className = "branch-empty";
    empty.setAttribute("data-empty", "");
    empty.innerHTML = `
      <svg class="branch-empty-art" viewBox="0 0 176 70" fill="none" aria-hidden="true">
        <path d="M88 6V22M28 57V42Q28 32 38 32H138Q148 32 148 42V57M88 32V57" stroke="currentColor" stroke-width="1.5"/>
        <circle class="node" cx="28" cy="60" r="5"/>
        <circle class="node" cx="88" cy="60" r="5"/>
        <circle class="node" cx="148" cy="60" r="5"/>
        <circle class="root" cx="88" cy="7" r="6"/>
      </svg>`;
    const title = document.createElement("strong");
    title.textContent = "One question. A few ways forward.";
    const copy = document.createElement("p");
    copy.textContent = "Explore the options, then bring the best approach into focus.";
    empty.append(title, copy);
    return empty;
  }

  function paintCard(branch, index, open) {
    const chosen = chosenBranch();
    const selected = branch.id === chosen?.id;
    const folded = !open && !selected;
    const count = state.branches.length;
    const column = index % 3;
    const row = Math.floor(index / 3);
    const visibleColumns = Math.min(count, 3);
    const angle = open ? (column - (visibleColumns - 1) / 2) * 4 : 0;
    const score = boundedScore(branch.score);
    const highlighted = selected && state.status !== "branching";
    const card = document.createElement("div");
    card.className = `branch-card${highlighted ? " is-on" : ""}`;
    card.setAttribute("data-branch", branch.id);
    card.setAttribute("data-selected", String(selected));
    card.dataset.angle = String(angle);
    if (folded) {
      card.setAttribute("aria-hidden", "true");
      card.setAttribute("inert", "");
    }
    card.style.left = open ? `${2 + column * (96 / visibleColumns)}%` : "8%";
    card.style.top = `${open ? 20 + Math.abs(angle) * 1.2 + row * 158 : 8}px`;
    card.style.width = open ? `${96 / visibleColumns - 2}%` : "84%";
    card.style.height = open ? "144px" : "88px";
    card.style.transform = `rotate(${angle}deg)`;
    card.style.transformOrigin = "top left";
    card.style.opacity = folded ? "0" : "1";
    card.style.zIndex = String(selected ? 4 : index + 1);
    card.style.pointerEvents = folded ? "none" : "auto";

    const kicker = document.createElement("div");
    kicker.className = "branch-card-kicker";
    const label = document.createElement("span");
    label.textContent = highlighted ? "Selected approach" : `Approach 0${index + 1}`;
    kicker.appendChild(label);
    if (highlighted) kicker.insertAdjacentHTML("beforeend", icon("check", "ico-sm"));

    const title = document.createElement("h4");
    title.textContent = branch.title;
    card.append(kicker, title);
    if (open) {
      const note = document.createElement("p");
      note.className = "note";
      note.textContent = branch.note;
      card.appendChild(note);
    }

    const scoreRow = document.createElement("div");
    scoreRow.className = "branch-score";
    const bar = document.createElement("div");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${branch.title} score`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    if (score !== undefined) bar.setAttribute("aria-valuenow", String(score));
    const fill = document.createElement("div");
    fill.setAttribute("data-score-fill", "");
    fill.style.width = `${score ?? 0}%`;
    fill.style.transition = motion.reduced ? "none" : "width 180ms linear";
    bar.appendChild(fill);
    const scoreLabel = document.createElement("span");
    scoreLabel.setAttribute("data-score-label", "");
    scoreLabel.textContent = score === undefined ? "—" : String(Math.round(score));
    scoreRow.append(bar, scoreLabel);
    card.appendChild(scoreRow);
    return card;
  }

  function paintTranscript() {
    const open = isOpen();
    const showBranches = state.status !== "idle" && state.branches.length > 0;
    transcript.replaceChildren();
    if (state.status === "idle") {
      transcript.appendChild(paintEmpty());
      return;
    }

    if (state.prompt) {
      const question = document.createElement("p");
      question.className = "branch-question";
      question.setAttribute("data-question", "");
      question.textContent = state.prompt;
      transcript.appendChild(question);
    }

    const assistant = document.createElement("div");
    assistant.setAttribute("data-assistant", "");
    const status = document.createElement("div");
    status.className = "branch-status";
    const chosen = chosenBranch();
    status.insertAdjacentHTML("beforeend", chosen && state.status !== "branching" ? icon("check", "ico-sm") : icon("fork", "ico-sm"));
    const heading = document.createElement("span");
    heading.className = "branch-heading";
    heading.setAttribute("data-branch-heading", "");
    heading.textContent = headingText();
    status.appendChild(heading);

    const deck = document.createElement("div");
    deck.className = "branch-deck";
    deck.id = "branch-deck";
    deck.setAttribute("data-branch-deck", "");
    deck.setAttribute("data-open", String(open));
    deck.setAttribute("role", "group");
    deck.setAttribute("aria-label", "Approaches");
    const rows = Math.floor((state.branches.length - 1) / 3);
    deck.style.height = `${showBranches ? (open ? 180 + rows * 158 : 104) : 24}px`;
    if (showBranches) state.branches.forEach((branch, index) => deck.appendChild(paintCard(branch, index, open)));

    assistant.append(status, deck);

    if (chosen && state.status !== "branching" && state.branches.length > 1) {
      const otherCount = state.branches.length - 1;
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "branch-toggle";
      toggle.setAttribute("data-approaches-toggle", "");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-controls", "branch-deck");
      toggle.innerHTML = icon("down", "ico-sm");
      const words = document.createElement("span");
      words.textContent = expanded ? "Hide other approaches" : `${otherCount} other ${otherCount === 1 ? "approach" : "approaches"}`;
      toggle.appendChild(words);
      assistant.appendChild(toggle);
    }

    if (state.status === "answering" || state.status === "done") {
      const answer = document.createElement("div");
      answer.className = "branch-answer";
      answer.setAttribute("data-answer", "");
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-label", "Response");
      answer.setAttribute("aria-live", "off");
      answer.appendChild(document.createTextNode(state.answer));
      if (state.status === "answering") {
        const cursor = document.createElement("span");
        cursor.className = "branch-cursor";
        cursor.setAttribute("data-stream-cursor", "");
        cursor.setAttribute("aria-hidden", "true");
        answer.appendChild(cursor);
      }
      assistant.appendChild(answer);
    }

    transcript.appendChild(assistant);
  }

  function patchScores() {
    state.branches.forEach((branch) => {
      const card = transcript.querySelector(`[data-branch="${CSS.escape(branch.id)}"]`);
      if (!card) return;
      const score = boundedScore(branch.score);
      const fill = card.querySelector("[data-score-fill]");
      const label = card.querySelector("[data-score-label]");
      const bar = card.querySelector("[role='progressbar']");
      if (fill) fill.style.width = `${score ?? 0}%`;
      if (label) label.textContent = score === undefined ? "—" : String(Math.round(score));
      if (bar && score !== undefined) bar.setAttribute("aria-valuenow", String(score));
    });
    const answer = transcript.querySelector("[data-answer]");
    if (!answer) return;
    const text = answer.firstChild;
    if (text && text.nodeType === Node.TEXT_NODE) text.nodeValue = state.answer;
  }

  function flip() {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    const deck = transcript.querySelector("[data-branch-deck]");
    if (!deck) return;
    const next = {};
    deck.querySelectorAll("[data-branch]").forEach((node, index) => {
      const id = node.dataset.branch;
      const to = {
        left: node.offsetLeft,
        top: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight,
        angle: Number(node.dataset.angle),
        opacity: Number(node.style.opacity),
      };
      next[id] = to;
      const from = positions[id];
      if (motion.reduced || typeof node.animate !== "function" || !to.width || !to.height) return;
      const start = from
        ? {
            transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) rotate(${from.angle}deg) scale(${from.width / to.width}, ${from.height / to.height})`,
            opacity: String(from.opacity),
          }
        : {
            transform: `translate(${(deck.clientWidth - to.width) / 2 - to.left}px, 22px) rotate(0deg) scale(0.86)`,
            opacity: "0",
          };
      animations.push(node.animate([
        start,
        { transform: `translate(0px, 0px) rotate(${to.angle}deg) scale(1)`, opacity: String(to.opacity) },
      ], { duration: MOVE_MS, delay: from ? 0 : index * 35, easing: EASING, fill: "backwards" }));
    });
    Object.keys(positions).forEach((id) => delete positions[id]);
    Object.assign(positions, next);
  }

  function syncShimmer(restart) {
    if (restart && shimmerAnim) {
      shimmerAnim.cancel();
      shimmerAnim = null;
    }
    const shimmer = transcript.querySelector("[data-branch-heading]");
    const want = state.status === "branching" && !motion.reduced && shimmer;
    if (shimmer) shimmer.classList.toggle("is-shimmer", Boolean(want));
    if (!want) {
      if (shimmerAnim) shimmerAnim.cancel();
      shimmerAnim = null;
      return;
    }
    if (shimmerAnim && shimmerAnim.playState === "running") return;
    shimmerAnim = shimmer.animate(
      [{ backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0" }],
      { duration: 1600, iterations: Infinity, easing: "linear" }
    );
  }

  function syncComposer() {
    if (field.value !== state.value) field.value = state.value;
    const stopping = busy();
    actionBtn.dataset.action = stopping ? "stop" : "send";
    actionBtn.type = stopping ? "button" : "submit";
    actionBtn.setAttribute("aria-label", stopping ? "Stop" : "Send question");
    actionBtn.disabled = stopping ? false : !state.value.trim();
    actionBtn.innerHTML = stopping ? icon("stop", "ico-sm") : icon("up", "ico-md");
  }

  function render() {
    if (state.status === "idle" || state.status === "branching") expanded = false;
    chat.dataset.state = state.status;
    chat.dataset.reduced = String(motion.reduced);
    const nextKey = viewSignature();
    const changed = nextKey !== viewKey;
    if (changed) {
      viewKey = nextKey;
      paintTranscript();
      flip();
    } else {
      patchScores();
    }
    syncShimmer(changed);
    live.textContent = announcement();
    syncComposer();
  }

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  }

  function armRun() {
    clearTimers();
    if (!motion.ready || !run || (run.source === "auto" && host.dataset.autoplay === "false")) return;
    const sample = run.prompt === QUESTION;
    const approaches = (sample ? BRANCHES : FALLBACK).map((branch) => ({ ...branch }));
    const response = sample ? ANSWER : FALLBACK_ANSWER;
    const selected = approaches.map((branch, index) => ({ ...branch, chosen: index === 2 }));

    if (motion.reduced) {
      if (run.source === "auto" && !started) return;
      state = { status: "done", prompt: run.prompt, value: "", branches: selected, answer: response };
      run = null;
      render();
      return;
    }

    started = false;
    const offset = run.source === "auto" ? 1000 : 0;
    const later = (ms, callback) => timers.push(window.setTimeout(callback, offset + ms));
    if (run.source === "auto") {
      state = initial();
      render();
    }
    later(0, () => {
      started = true;
      state = { status: "branching", prompt: run.prompt, value: "", branches: [], answer: "" };
      render();
    });
    later(400, () => {
      state = { ...state, branches: approaches.map((branch) => ({ ...branch, score: 0 })) };
      render();
    });
    for (let step = 0; step <= 10; step++) {
      later(800 + step * 180, () => {
        state = { ...state, branches: approaches.map((branch) => ({ ...branch, score: Math.round(branch.score * step / 10) })) };
        render();
      });
    }
    later(2900, () => {
      state = { ...state, status: "choosing", branches: selected };
      render();
    });
    for (let step = 1; step <= 20; step++) {
      later(3300 + (step - 1) * 105, () => {
        state = { ...state, status: "answering", answer: response.slice(0, Math.ceil(response.length * step / 20)) };
        render();
      });
    }
    later(5400, () => {
      state = { ...state, status: "done", answer: response };
      run = null;
      render();
    });
  }

  function send(prompt) {
    run = { id: (run && run.id ? run.id : 0) + 1, source: "user", prompt };
    armRun();
  }

  function submit() {
    const message = field.value.trim();
    if (!message || busy()) return;
    state = { ...state, value: "" };
    field.value = "";
    send(message);
  }

  function stop() {
    clearTimers();
    run = null;
    state = {
      ...state,
      status: "done",
      value: state.value || state.prompt,
      answer: state.answer || "Stopped before an answer was ready.",
    };
    render();
  }

  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
  });
  field.addEventListener("input", () => {
    state = { ...state, value: field.value };
    if (state.status === "idle") {
      run = null;
      clearTimers();
    }
    syncComposer();
  });
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
      event.preventDefault();
      submit();
    }
  });
  actionBtn.addEventListener("click", (event) => {
    if (actionBtn.dataset.action !== "stop") return;
    event.preventDefault();
    stop();
  });
  transcript.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-approaches-toggle]");
    if (!toggle) return;
    expanded = !expanded;
    render();
  });
  host.querySelector("[data-replay]").addEventListener("click", () => send(QUESTION));

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const updateMotion = () => {
    motion = { ready: true, reduced: media.matches };
    render();
    armRun();
  };
  if (media.addEventListener) media.addEventListener("change", updateMotion);
  else media.addListener(updateMotion);
  updateMotion();
})();
