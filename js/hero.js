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
})();
