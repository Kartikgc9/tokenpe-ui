(function () {
  var root = document.querySelector(".horizon");
  if (!root) return;

  var edge = root.querySelector(".horizon-edge");
  var halo = root.querySelector(".halo-fill");
  var clip = root.querySelector(".rim-clip");
  var filter = root.querySelector(".rim-filter");
  var copy = root.querySelector(".horizon-copy");
  var eyebrows = root.querySelectorAll(".horizon-eyebrow");
  var title = root.querySelector(".horizon-title");
  var actions = root.querySelector(".horizon-actions");
  var streaks = root.querySelector(".horizon-streaks");

  function slice(p, from, to, a, b) {
    var t = (p - from) / (to - from);
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    return a + (b - a) * t;
  }

  function blur(px) {
    return px <= 0.05 ? "none" : "blur(" + px + "px)";
  }

  function apply(p) {
    var wipe = slice(p, 0.1, 0.65, 0, 1);
    var right = (1 - wipe) * 100;
    var bleed = wipe * 64;
    if (edge) edge.style.opacity = String(slice(p, 0, 0.2, 0, 1));
    if (halo) {
      halo.style.opacity = String(slice(p, 0.05, 0.45, 0, 1));
      halo.style.transform = "scale(" + slice(p, 0.05, 0.45, 0.84, 1) + ")";
    }
    if (clip) {
      clip.style.opacity = String(slice(p, 0.1, 0.25, 0, 1));
      clip.style.clipPath = "inset(-64px calc(" + right + "% - " + bleed + "px) -64px -64px)";
    }
    if (filter) {
      filter.style.filter = "hue-rotate(" + slice(p, 0.1, 0.8, -40, 0) + "deg) saturate(" + slice(p, 0.1, 0.8, 0.35, 1.25) + ")";
    }
    var eyebrowOpacity = String(slice(p, 0.35, 0.55, 0, 1));
    var eyebrowBlur = blur(slice(p, 0.35, 0.55, 1.5, 0));
    for (var i = 0; i < eyebrows.length; i++) {
      eyebrows[i].style.opacity = eyebrowOpacity;
      eyebrows[i].style.filter = eyebrowBlur;
    }
    var titleOpacity = String(slice(p, 0.45, 0.7, 0, 1));
    var titleBlur = blur(slice(p, 0.45, 0.7, 2.5, 0));
    if (title) {
      title.style.opacity = titleOpacity;
      title.style.filter = titleBlur;
    }
    if (actions) {
      actions.style.opacity = titleOpacity;
      actions.style.filter = titleBlur;
    }
    if (copy) copy.style.transform = "translateY(" + slice(p, 0.35, 0.7, 4, 0) + "px)";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply(1);
    if (streaks) streaks.hidden = true;
    return;
  }

  var start = performance.now();
  function frame(now) {
    var t = Math.min(1, (now - start) / 2400);
    apply(1 - Math.pow(1 - t, 3));
    if (t < 1) requestAnimationFrame(frame);
  }
  apply(0);
  requestAnimationFrame(frame);

  var stage = root.querySelector(".horizon-stage");

  // Meteors: replace the fixed streaks with more, faster ones. Each meteor
  // re-rolls its column and look at the end of every pass, while it is
  // invisible, so the pattern never visibly repeats.
  var TINTS = [
    "rgba(255, 255, 255, 0.6)",
    "rgba(255, 255, 255, 0.6)",
    "rgba(158, 193, 255, 0.7)",
    "rgba(45, 212, 191, 0.6)",
    "rgba(249, 115, 22, 0.55)",
  ];
  function rand(a, b) { return a + Math.random() * (b - a); }
  function roll(span) {
    var tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    span.style.setProperty("--left", rand(1, 99).toFixed(2) + "%");
    span.style.setProperty("--len", Math.round(rand(140, 320)) + "px");
    span.style.setProperty("--w", (Math.random() < 0.25 ? 3 : Math.random() < 0.5 ? 1.5 : 2) + "px");
    span.style.setProperty("--peak", rand(0.45, 0.95).toFixed(2));
    span.style.setProperty("--tint", tint);
  }
  function setFall() {
    if (!streaks || !stage) return;
    streaks.style.setProperty("--fall", Math.round(stage.offsetHeight * 0.92) + "px");
  }
  if (streaks) {
    var count = window.innerWidth < 720 ? 10 : 18;
    streaks.textContent = "";
    for (var n = 0; n < count; n++) {
      var span = document.createElement("span");
      span.className = "meteor";
      span.style.setProperty("--dur", rand(1.8, 3.6).toFixed(2) + "s");
      span.style.setProperty("--delay", (-rand(0, 3.6)).toFixed(2) + "s");
      roll(span);
      span.addEventListener("animationiteration", function (event) { roll(event.currentTarget); });
      streaks.appendChild(span);
    }
    setFall();
    window.addEventListener("resize", setFall, { passive: true });
  }

  // Spotlight that follows the pointer with a little lag.
  var spot = root.querySelector(".horizon-spot");
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (spot && stage && fine) {
    var target = { x: 0, y: 0 };
    var pos = null;
    var raf = 0;
    var follow = function () {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      spot.style.setProperty("--spot-x", pos.x.toFixed(1) + "px");
      spot.style.setProperty("--spot-y", pos.y.toFixed(1) + "px");
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5 ? requestAnimationFrame(follow) : 0;
    };
    stage.addEventListener("pointermove", function (event) {
      var box = stage.getBoundingClientRect();
      target.x = event.clientX - box.left;
      target.y = event.clientY - box.top;
      if (!pos) pos = { x: target.x, y: target.y };
      root.classList.add("is-pointer");
      if (!raf) raf = requestAnimationFrame(follow);
    });
    stage.addEventListener("pointerleave", function () { root.classList.remove("is-pointer"); });
  }

  // Pause every hero loop while it is off screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      root.classList.toggle("is-offscreen", !entries[0].isIntersecting);
    }).observe(root);
  }
})();
