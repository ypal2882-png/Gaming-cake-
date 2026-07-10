/* ============================================================
   WEARLY — interactions & functionality
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA_NUMBER = "917477213796"; // WhatsApp number

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader")?.classList.add("hide"), 900);
  });

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = $("#header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    $("#toTop").classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  const toggleNav = (force) => {
    const open = force ?? !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleNav());
  $$(".nav__link").forEach((l) => l.addEventListener("click", () => toggleNav(false)));

  /* ---------- Active link on scroll (scrollspy) ---------- */
  const sections = $$("section[id]");
  const spy = () => {
    const y = window.scrollY + 120;
    let current = "home";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop) current = sec.id;
    });
    $$(".nav__link").forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + current)
    );
  };
  window.addEventListener("scroll", spy, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  const observeReveals = () => $$(".reveal:not(.in)").forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = $$(".stat__num");
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString("en-IN");
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => countIO.observe(c));

  /* ============================================================
     PRODUCT DATA
     ============================================================ */
  // `img` = real store photo in assets/img/. Swap the filename to change a product's picture.
  const products = [
    { id: 1, name: "Oversized Cotton Tee", cat: "tops", tag: "NEW", price: 199, was: 499, glyph: "TEE", note: "Cotton · Unisex", img: "tee-white.jpeg" },
    { id: 2, name: "Graphic Print Tee", cat: "tops", tag: "HOT", price: 249, was: 599, glyph: "GRAPHIC", note: "Streetwear fit", img: "tee-graphic.jpeg" },
    { id: 3, name: "Premium Linen Shirt", cat: "shirts", tag: "IMPORT", price: 349, was: 899, glyph: "LINEN", note: "Breathable · S–XL", img: "shirt-linen.jpeg" },
    { id: 4, name: "Star Cotton Tee", cat: "tops", tag: "", price: 179, was: 449, glyph: "STAR", note: "Everyday staple", img: "tee-star.jpeg" },
    { id: 5, name: "Slim Fit Denim", cat: "bottoms", tag: "NEW", price: 399, was: 1099, glyph: "DENIM", note: "Mid-rise · Blue", img: "denim-blue.jpeg" },
    { id: 6, name: "Baggy Wash Jeans", cat: "bottoms", tag: "HOT", price: 449, was: 1199, glyph: "BAGGY", note: "Relaxed · Y2K", img: "jeans-baggy.jpeg" },
    { id: 7, name: "Checked Flannel Shirt", cat: "shirts", tag: "", price: 299, was: 749, glyph: "CHECK", note: "Overshirt · Cozy", img: "shirt-checked.jpeg" },
    { id: 8, name: "Distressed Baggy Jeans", cat: "bottoms", tag: "NEW", price: 479, was: 1249, glyph: "RIPPED", note: "Distressed · Retro", img: "jeans-distressed.jpeg" },
    { id: 9, name: "Essential Hoodie", cat: "outer", tag: "COZY", price: 449, was: 1099, glyph: "HOODIE", note: "Heavy · Oversized", img: "hoodie-black.jpeg" },
    { id: 10, name: "'1977' Graphic Hoodie", cat: "outer", tag: "HOT", price: 549, was: 1399, glyph: "1977", note: "Statement piece", img: "hoodie-1977.jpeg" },
    { id: 11, name: "Varsity Bomber Jacket", cat: "outer", tag: "IMPORT", price: 799, was: 2199, glyph: "BOMBER", note: "Imported · Rare", img: "jacket-varsity.jpeg" },
    { id: 12, name: "Washed Black Denim", cat: "bottoms", tag: "", price: 429, was: 1149, glyph: "BLACK", note: "Faded · Straight", img: "denim-black.jpeg" },
  ];

  const rupee = (n) => "₹" + n.toLocaleString("en-IN");
  // Local store photo. On failure the <img> removes itself, revealing the glyph fallback.
  const photo = (file) => `assets/img/${file}`;

  /* ---------- Render products ---------- */
  const grid = $("#productGrid");
  const wishlist = new Set(JSON.parse(localStorage.getItem("wearly_wish") || "[]"));

  const productCard = (p) => {
    const wished = wishlist.has(p.id) ? "active" : "";
    const heart = wishlist.has(p.id) ? "♥" : "♡";
    const tagHtml = p.tag ? `<span class="card__tag">${p.tag}</span>` : "";
    return `
      <article class="card" data-cat="${p.cat}">
        <div class="card__media">
          <span class="card__pattern" style="background:repeating-linear-gradient(${45 + p.id * 12}deg,#1b1b1d,#1b1b1d 16px,#171718 16px,#171718 32px)"></span>
          <span class="card__glyph">${p.glyph}</span>
          <img class="card__img" src="${photo(p.img)}" alt="${p.name}" loading="lazy" onerror="this.remove()" />
          ${tagHtml}
          <button class="card__wish ${wished}" data-wish="${p.id}" aria-label="Add to wishlist">${heart}</button>
        </div>
        <div class="card__body">
          <span class="card__cat">${{ tops: "Tees", bottoms: "Denims", shirts: "Shirts", outer: "Outerwear" }[p.cat] || p.cat}</span>
          <span class="card__name">${p.name}</span>
          <span class="card__meta">${p.note}</span>
          <div class="card__foot">
            <span class="card__price">${rupee(p.price)}<small>${rupee(p.was)}</small></span>
            <button class="card__add" data-add="${p.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </article>`;
  };

  const renderProducts = (filter = "all") => {
    const list = filter === "all" ? products : products.filter((p) => p.cat === filter);
    grid.innerHTML = list.map(productCard).join("");
  };
  renderProducts();

  /* ---------- Filters ---------- */
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      renderProducts(chip.dataset.filter);
    });
  });

  // Collection cards link to shop filter
  $$(".coll").forEach((coll) => {
    coll.addEventListener("click", (e) => {
      const f = coll.dataset.filter;
      const chip = $(`.chip[data-filter="${f}"]`);
      if (chip) {
        setTimeout(() => {
          $$(".chip").forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");
          renderProducts(f);
        }, 400);
      }
    });
  });

  /* ============================================================
     CART
     ============================================================ */
  let cart = JSON.parse(localStorage.getItem("wearly_cart") || "[]");
  const cartCountEl = $("#cartCount");
  const drawer = $("#cartDrawer");
  const overlay = $("#drawerOverlay");

  const saveCart = () => localStorage.setItem("wearly_cart", JSON.stringify(cart));
  const cartQty = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => cart.reduce((s, i) => s + i.qty * i.price, 0);

  const updateCartBadge = () => {
    const q = cartQty();
    cartCountEl.textContent = q;
    cartCountEl.classList.toggle("show", q > 0);
    $("#drawerCount").textContent = `(${q})`;
    $("#cartTotal").textContent = rupee(cartTotal());
  };

  const renderCart = () => {
    const body = $("#cartItems");
    if (!cart.length) {
      body.innerHTML = `<div class="drawer__empty"><span>🛍️</span>Your bag is empty.<br/>Go grab a fit from the rack!</div>`;
    } else {
      body.innerHTML = cart
        .map(
          (i) => `
        <div class="cart-item">
          <div class="cart-item__thumb">${i.glyph}</div>
          <div class="cart-item__info">
            <strong>${i.name}</strong>
            <small>${i.note}</small>
            <div class="cart-item__price">${rupee(i.price)}</div>
            <div class="cart-item__qty">
              <button data-dec="${i.id}" aria-label="Decrease">−</button>
              <span>${i.qty}</span>
              <button data-inc="${i.id}" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-remove="${i.id}">Remove</button>
        </div>`
        )
        .join("");
    }
    updateCartBadge();
    buildCheckoutLink();
  };

  const addToCart = (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const found = cart.find((i) => i.id === id);
    if (found) found.qty++;
    else cart.push({ id: p.id, name: p.name, price: p.price, glyph: p.glyph, note: p.note, qty: 1 });
    saveCart();
    renderCart();
    toast(`${p.name} added to bag`);
    // pop badge
    cartCountEl.classList.remove("show");
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add("show");
  };

  const buildCheckoutLink = () => {
    let msg = "Hi Wearly! 👋 I'd like to reserve these pieces:%0A%0A";
    if (!cart.length) msg += "(nothing yet)";
    else {
      cart.forEach((i, idx) => {
        msg += `${idx + 1}. ${i.name} × ${i.qty} — ${rupee(i.price * i.qty)}%0A`;
      });
      msg += `%0ATotal: ${rupee(cartTotal())}`;
    }
    $("#checkoutBtn").href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  };

  // event delegation for cart actions
  $("#cartItems").addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc) { const it = cart.find((i) => i.id == inc.dataset.inc); it.qty++; }
    if (dec) { const it = cart.find((i) => i.id == dec.dataset.dec); it.qty--; if (it.qty <= 0) cart = cart.filter((i) => i.id != dec.dataset.dec); }
    if (rem) { cart = cart.filter((i) => i.id != rem.dataset.remove); }
    if (inc || dec || rem) { saveCart(); renderCart(); }
  });

  grid.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const wish = e.target.closest("[data-wish]");
    if (add) addToCart(+add.dataset.add);
    if (wish) toggleWish(+wish.dataset.wish, wish);
  });

  /* ---------- Drawer open/close ---------- */
  const openCart = () => { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  /* ============================================================
     WISHLIST
     ============================================================ */
  const wishCountEl = $("#wishCount");
  const updateWishBadge = () => {
    wishCountEl.textContent = wishlist.size;
    wishCountEl.classList.toggle("show", wishlist.size > 0);
  };
  const toggleWish = (id, btn) => {
    if (wishlist.has(id)) { wishlist.delete(id); btn.classList.remove("active"); btn.textContent = "♡"; }
    else { wishlist.add(id); btn.classList.add("active"); btn.textContent = "♥"; toast("Saved to wishlist ♥"); }
    localStorage.setItem("wearly_wish", JSON.stringify([...wishlist]));
    updateWishBadge();
  };
  $("#wishBtn").addEventListener("click", () => {
    if (!wishlist.size) { toast("Tap the ♡ on a piece to save it"); }
    else { toast(`${wishlist.size} piece(s) in your wishlist ♥`); }
  });

  /* ============================================================
     REVIEWS SLIDER
     ============================================================ */
  const reviews = [
    { stars: 5, text: "Found the cleanest oversized tees here for way less than any mall. The vibe of the store is unreal.", who: "Aditi S.", role: "College student, Gwalior" },
    { stars: 5, text: "Fresh imported stock every week means I always find something no one else has. My whole wardrobe is Wearly now.", who: "Rohan K.", role: "Streetwear collector" },
    { stars: 5, text: "Starting at ₹49 and the quality actually holds up. The linen shirts are premium. Highly recommend.", who: "Ishita M.", role: "Regular thrifter" },
    { stars: 5, text: "Best thrift store in the city. Staff helped me style a full fit and it cost less than one branded tee.", who: "Karan V.", role: "First-time visitor" },
  ];
  const track = $("#reviewTrack");
  const dots = $("#reviewDots");
  track.innerHTML = reviews
    .map(
      (r) => `
    <div class="rev">
      <div class="rev__stars">${"★".repeat(r.stars)}</div>
      <p class="rev__text">"${r.text}"</p>
      <div class="rev__who"><strong>${r.who}</strong><small>${r.role}</small></div>
    </div>`
    )
    .join("");
  dots.innerHTML = reviews.map((_, i) => `<button data-dot="${i}" aria-label="Review ${i + 1}"></button>`).join("");
  let rev = 0;
  const setReview = (i) => {
    rev = (i + reviews.length) % reviews.length;
    track.style.transform = `translateX(-${rev * 100}%)`;
    $$("#reviewDots button").forEach((d, idx) => d.classList.toggle("active", idx === rev));
  };
  setReview(0);
  dots.addEventListener("click", (e) => { const d = e.target.closest("[data-dot]"); if (d) { setReview(+d.dataset.dot); resetAuto(); } });
  let autoRev = setInterval(() => setReview(rev + 1), 5000);
  const resetAuto = () => { clearInterval(autoRev); autoRev = setInterval(() => setReview(rev + 1), 5000); };

  /* ============================================================
     GALLERY
     ============================================================ */
  const gtiles = [
    { t: "STREETWEAR", img: "model-back.jpeg" },
    { t: "TEES", img: "tee-graphic.jpeg" },
    { t: "LINEN", img: "shirt-linen.jpeg" },
    { t: "DENIM", img: "denim-blue.jpeg" },
    { t: "OUTERWEAR", img: "jacket-varsity.jpeg" },
    { t: "THE LOOKBOOK", img: "lookbook.jpeg" },
    { t: "HOODIES", img: "hoodie-1977.jpeg" },
    { t: "COMING SOON", img: "coming-soon.jpeg" },
  ];
  $("#gallery-grid").innerHTML = gtiles
    .map(
      (g, i) => `
    <a href="https://www.instagram.com/thriftwearly/" target="_blank" rel="noopener" class="gtile" style="background:linear-gradient(${140 + i * 25}deg,var(--surface),var(--bg))">
      <span class="gtile__glyph">${g.t.split(" ")[0]}</span>
      <img class="gtile__img" src="${photo(g.img)}" alt="${g.t}" loading="lazy" onerror="this.remove()" />
      <span class="gtile__over"><span>${g.t}</span></span>
    </a>`
    )
    .join("");

  /* ============================================================
     FORMS
     ============================================================ */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  // contact form
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name;
    const contact = form.contact;
    let ok = true;
    [name, contact].forEach((f) => {
      if (!f.value.trim()) { f.classList.add("err"); ok = false; }
      else f.classList.remove("err");
    });
    const msg = $("#formMsg");
    if (!ok) { msg.style.color = "#ff6b6b"; msg.textContent = "Please add your name & contact."; return; }
    msg.style.color = "var(--lime)";
    msg.textContent = "✓ Sent! We'll reach out to hold your fit.";
    // Also offer WhatsApp handoff
    const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      `Hi Wearly! I'm ${name.value}. Contact: ${contact.value}. Looking for: ${form.message.value || "—"}`
    )}`;
    setTimeout(() => window.open(wa, "_blank"), 600);
    form.reset();
  });
  $$("#contactForm input, #contactForm textarea").forEach((f) =>
    f.addEventListener("input", () => f.classList.remove("err"))
  );

  // newsletter
  const news = $("#newsletter");
  news.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = news.email.value.trim();
    const msg = $("#newsMsg");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.style.color = "#ff6b6b"; msg.textContent = "Enter a valid email.";
      return;
    }
    msg.style.color = "var(--lime)";
    msg.textContent = "✓ You're on the list! Watch for the next drop.";
    news.reset();
  });

  /* ---------- Back to top ---------- */
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Init ---------- */
  renderCart();
  updateWishBadge();
  observeReveals();
  // re-observe after product render for card reveals handled by CSS animation
})();
