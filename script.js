(function () {
  "use strict";

  // À personnaliser : le prénom de la personne (laisser vide pour "toi") et ta signature.
  var PRENOM = "";
  var DE = "Kossi Angelo";

  var MESSAGES = [
    "Oups, mauvais bouton.",
    "Tu es sûre ?",
    "Ce bouton ne marche pas aujourd'hui.",
    "Il court vite, hein.",
    "Réfléchis encore un peu.",
    "Tu as vu comme le Oui grandit ?",
    "Essaie plutôt l'autre bouton.",
    "Le Non est en maintenance.",
    "Clique sur Oui, c'est plus simple."
  ];

  var LINES = [
    { c: "code", t: 'if (ta_reponse === "oui") {\n  bonheur++;\n}' },
    { c: "", t: PRENOM ? "À " + PRENOM + "," : "À toi DESIRIA," },
    { c: "", t: "Je suis meilleur pour écrire du code que pour écrire des lettres, alors pardonne mes maladresses. Mais certaines choses ne se disent pas avec des lignes de code." },
    { c: "", t: "Depuis que je te connais, mes journées sont un peu plus légères. Une conversation avec toi, et le reste passe au second plan." },
    { c: "", t: "J'aime ta façon d'être. J'aime que tu me fasses sourire sans même essayer. Et j'aime l'idée de faire un bout de chemin avec toi." },
    { c: "", t: "Je ne te promets pas une vie parfaite. Je te promets de la sincérité, du respect et de l'attention, dans les bons jours comme dans les jours difficiles." },
    { c: "", t: "Tu as cliqué sur Oui. J'ai failli ne pas y croire, parce que, avoue-le, le bouton Non n'était pas très coopératif." },
    { c: "", t: "Alors merci. Merci d'avoir répondu, et merci d'exister dans mon monde." },
    { c: "code", t: 'return "toi + moi";' },
    { c: "", t: "Avec tout mon cœur," },
    { c: "sign", t: DE }
  ];

  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var $ = function (id) { return document.getElementById(id); };
  var ask = $("ask"), yes = $("yes"), no = $("no"), tease = $("tease"), question = $("question");
  var letter = $("letter"), paper = $("paper"), lines = $("lines"), after = $("after"), again = $("again"), hearts = $("hearts");

  if (PRENOM) { question.textContent = PRENOM + ", veux-tu être ma copine ?"; }

  /* ---------- Le bouton Non qui s'échappe ---------- */
  var attempts = 0, lastDodge = 0, flying = false;

  function overlap(x, y, w, h, r, pad) {
    return x < r.right + pad && x + w > r.left - pad && y < r.bottom + pad && y + h > r.top - pad;
  }

  function place(px, py) {
    var cs = getComputedStyle(document.documentElement);
    var top = (parseFloat(cs.paddingTop) || 0) + 16;
    var bottom = (parseFloat(cs.paddingBottom) || 0) + 16;
    var side = 16;
    if (!flying) {
      var r0 = no.getBoundingClientRect();
      no.style.left = r0.left + "px";
      no.style.top = r0.top + "px";
      no.classList.add("fly");
      void no.offsetWidth;
      flying = true;
    }
    var w = no.offsetWidth, h = no.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight;
    var minX = side, maxX = Math.max(minX, vw - w - side);
    var minY = top, maxY = Math.max(minY, vh - h - bottom);
    var yr = yes.getBoundingClientRect(), qr = question.getBoundingClientRect();
    if (px == null) { px = vw / 2; py = vh / 2; }
    var best = { x: minX, y: minY }, bestScore = -Infinity;
    for (var i = 0; i < 40; i++) {
      var x = minX + Math.random() * (maxX - minX);
      var y = minY + Math.random() * (maxY - minY);
      var d = Math.hypot(x + w / 2 - px, y + h / 2 - py);
      var hit = overlap(x, y, w, h, yr, 40) || overlap(x, y, w, h, qr, 6);
      var score = d - (hit ? 1000 : 0);
      if (score > bestScore) { bestScore = score; best = { x: x, y: y }; }
      if (!hit && d > 180) { break; }
    }
    no.style.left = best.x + "px";
    no.style.top = best.y + "px";
  }

  function say(n) {
    var i = n <= MESSAGES.length ? n - 1 : Math.floor(Math.random() * MESSAGES.length);
    tease.textContent = MESSAGES[i];
  }

  function dodge(px, py) {
    var now = Date.now();
    if (now - lastDodge < 140) { return; }
    lastDodge = now;
    attempts++;
    ask.style.setProperty("--n", Math.min(attempts, 12));
    say(attempts);
    place(px, py);
  }

  no.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { dodge(e.clientX, e.clientY); } });
  no.addEventListener("pointerdown", function (e) { e.preventDefault(); dodge(e.clientX, e.clientY); });
  no.addEventListener("touchstart", function (e) {
    e.preventDefault();
    var t = e.touches && e.touches[0];
    dodge(t ? t.clientX : null, t ? t.clientY : null);
  }, { passive: false });
  no.addEventListener("focus", function () { dodge(null, null); no.blur(); });
  no.addEventListener("click", function (e) { e.preventDefault(); dodge(null, null); });

  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || ask.hidden || yes.disabled) { return; }
    var r = no.getBoundingClientRect();
    var dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    var dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) < 60) { dodge(e.clientX, e.clientY); }
  });

  /* ---------- Cœurs ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function burst(count) {
    if (reduce) { return; }
    for (var i = 0; i < count; i++) {
      var h = document.createElement("span");
      h.className = "heart";
      h.style.setProperty("--x", rand(2, 96) + "%");
      h.style.setProperty("--s", rand(14, 38) + "px");
      h.style.setProperty("--d", rand(3.2, 6.5) + "s");
      h.style.setProperty("--r", rand(-40, 40) + "deg");
      h.style.animationDelay = rand(0, 1.4) + "s";
      h.innerHTML = HEART;
      hearts.appendChild(h);
      setTimeout(function (el) { el.remove(); }, 9000, h);
    }
  }

  /* ---------- La lettre qui défile ---------- */
  var idx = 0, timer = null, finished = false;

  function scrollEnd() {
    paper.scrollTo({ top: paper.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }

  function addLine(item, instant) {
    var p = document.createElement("p");
    p.className = "ln" + (item.c ? " " + item.c : "");
    p.textContent = item.t;
    lines.appendChild(p);
    if (instant) { p.classList.add("in"); }
    else { requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add("in"); }); }); }
  }

  function finish() {
    if (finished) { return; }
    finished = true;
    after.hidden = false;
    burst(14);
  }

  function next() {
    if (idx >= LINES.length) { finish(); return; }
    var item = LINES[idx++];
    addLine(item, false);
    scrollEnd();
    timer = setTimeout(next, Math.min(3200, 900 + item.t.length * 28));
  }

  function revealAll() {
    if (finished) { return; }
    clearTimeout(timer);
    while (idx < LINES.length) { addLine(LINES[idx++], true); }
    finish();
  }

  ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (name) {
    paper.addEventListener(name, revealAll, { passive: true });
  });

  again.addEventListener("click", function () {
    paper.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  yes.addEventListener("click", function () {
    if (yes.disabled) { return; }
    yes.disabled = true;
    ask.classList.add("gone");
    burst(30);
    setTimeout(function () {
      ask.hidden = true;
      letter.hidden = false;
      letter.classList.add("show");
      paper.focus({ preventScroll: true });
      if (reduce) { revealAll(); } else { timer = setTimeout(next, 500); }
    }, reduce ? 0 : 450);
  });
})();
