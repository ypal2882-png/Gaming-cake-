/* ============================================================
   WEARLY — premium motion layer (fx.js)
   Scroll progress · cursor glow · magnetic buttons · 3D tilt
   · parallax · split-text reveal · marquee velocity.
   All effects are progressively enhanced & disabled for
   users who prefer reduced motion / on touch devices.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Enhanced preloader counter ---------- */
  (function preloader() {
    const fill = $("#preFill"), pct = $("#prePct");
    if (!fill || !pct) return;
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) { p = 100; clearInterval(t); }
      fill.style.width = p + "%";
      pct.textContent = Math.floor(p) + "%";
    }, 130);
  })();

  /* ---------- Scroll progress bar ---------- */
  const bar = $("#progress");
  const setProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max, 0, 1) : 0})`;
  };
  window.addEventListener("scroll", setProgress, { passive: true });
  setProgress();

  if (reduce) return; // stop here for reduced-motion users

  /* ---------- Cursor glow (desktop only) ---------- */
  if (fine) {
    const glow = $("#cursorGlow");
    let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
    document.body.classList.add("has-glow");
    addEventListener("mousemove", (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    (function loop() {
      cx = lerp(cx, gx, 0.15); cy = lerp(cy, gy, 0.15);
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    // grow over interactive elements
    $$("a, button, .card, .coll, .chip").forEach((el) => {
      el.addEventListener("mouseenter", () => glow.classList.add("big"));
      el.addEventListener("mouseleave", () => glow.classList.remove("big"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine) {
    $$(".btn, .icon-btn, .newsletter button, .to-top").forEach((el) => {
      const strength = el.classList.contains("btn") ? 0.35 : 0.25;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- 3D tilt (price card + any [data-tilt]) ---------- */
  if (fine) {
    $$("[data-tilt]").forEach((el) => {
      el.style.transformStyle = "preserve-3d";
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Product-card tilt (delegated, survives re-render) ---------- */
  if (fine) {
    const grid = $("#productGrid");
    if (grid) {
      grid.addEventListener("mousemove", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-8px)`;
      });
      grid.addEventListener("mouseout", (e) => {
        const card = e.target.closest(".card");
        if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
      });
    }
  }

  /* ---------- Split-text reveal on headings ---------- */
  const splitTargets = $$(".section__title, .cta-banner h2");
  const splitIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("lit"); splitIO.unobserve(en.target); }
    });
  }, { threshold: 0.3 });

  splitTargets.forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    // split into words, keeping any nested inline element intact
    const frag = document.createDocumentFragment();
    let idx = 0;
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
          const outer = document.createElement("span");
          outer.className = "w";
          const inner = document.createElement("span");
          inner.className = "w__i";
          inner.textContent = w;
          inner.style.transitionDelay = idx * 0.05 + "s";
          outer.appendChild(inner);
          frag.appendChild(outer);
          idx++;
        });
      } else {
        // wrap an element (e.g. <span class="italic">) as one animated unit
        const outer = document.createElement("span");
        outer.className = "w";
        node.classList && node.classList.add("w__i");
        node.style && (node.style.transitionDelay = idx * 0.05 + "s");
        outer.appendChild(node.cloneNode(true));
        frag.appendChild(outer);
        idx++;
      }
    });
    el.textContent = "";
    el.appendChild(frag);
    splitIO.observe(el);
  });

  /* ---------- Scroll parallax on [data-parallax] ---------- */
  const pxEls = $$("[data-parallax]");
  const heroBlobs = $$(".blob");
  let ticking = false;
  const onScrollFx = () => {
    const y = window.scrollY;
    pxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || -15;
      el.style.setProperty("--py", (y * speed) / 100 + "px");
    });
    heroBlobs.forEach((b, i) => {
      b.style.setProperty("--by", y * (i ? 0.08 : 0.14) + "px");
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScrollFx); ticking = true; } }, { passive: true });
  onScrollFx();

  /* ---------- Hero mouse parallax ---------- */
  if (fine) {
    const hero = $(".hero");
    const layers = [
      { el: $(".blob--1"), s: 26 },
      { el: $(".blob--2"), s: -22 },
      { el: $(".hero__feature"), s: 14 },
      { el: $(".hero__content"), s: -8 },
    ].filter((l) => l.el);
    let tx = 0, ty = 0, mx = 0, my = 0;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener("mouseleave", () => { mx = 0; my = 0; });
    (function hloop() {
      tx = lerp(tx, mx, 0.06); ty = lerp(ty, my, 0.06);
      layers.forEach((l) => { l.el.style.setProperty("--mx", tx * l.s + "px"); l.el.style.setProperty("--my", ty * l.s + "px"); });
      requestAnimationFrame(hloop);
    })();
  }

  /* ---------- Marquee reacts to scroll velocity ---------- */
  const tracks = $$(".strip__track, .announce__track");
  let lastY = scrollY, vel = 0;
  addEventListener("scroll", () => {
    vel = clamp((scrollY - lastY) * 0.4, -8, 8);
    lastY = scrollY;
  }, { passive: true });
  (function vloop() {
    const speed = 1 + Math.abs(vel) * 0.4;
    tracks.forEach((t) => { t.style.animationDuration = (t.classList.contains("announce__track") ? 26 : 34) / speed + "s"; });
    vel *= 0.9;
    requestAnimationFrame(vloop);
  })();

  /* ---------- Reveal images with clip (re-observe dynamic) ---------- */
  const clipIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("shown"); clipIO.unobserve(en.target); } });
  }, { threshold: 0.15 });
  const observeClips = () => $$(".coll:not(.shown), .feature:not(.shown), .gtile:not(.shown)").forEach((el) => clipIO.observe(el));
  observeClips();
})();
