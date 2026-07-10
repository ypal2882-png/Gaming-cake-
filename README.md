# Wearly — Thrift Wearly

A premium, aesthetic website for **Wearly (Thrift Wearly)** — Gwalior's streetwear thrift store (`@thriftwearly`).

**Thrift it. Wear it.** · 📍 Patel Nagar, City Centre, Gwalior · 📞 +91 74772 13796

## ✨ Features

- **Premium streetwear design** — dark luxe theme, Bebas Neue display type, lime accent, editorial serif touches, animated blobs & grain.
- **Fully interactive shop** — 12 curated products with category filters (Tees, Shirts, Denims, Women, Winter).
- **Working cart** — add / remove / change quantity, live totals, persists in `localStorage`, and a **“Reserve on WhatsApp”** checkout that pre-fills your order message.
- **Wishlist** — tap the ♡ on any piece; saved across visits.
- **Reviews slider** — auto-rotating testimonials with dot navigation.
- **Instagram-style gallery**, animated stat counters, scrollspy nav, scroll-reveal animations.
- **Contact & newsletter forms** with validation + WhatsApp hand-off, plus an embedded Google Map.
- **Premium motion layer** (`js/fx.js`) — scroll progress bar, cursor glow, magnetic buttons, 3D tilt on the price card & product cards, hero mouse + scroll parallax, split-text heading reveals, staggered card entrances, film-grain overlay, glitch preloader and scroll-velocity-reactive marquees.
- **Fully responsive** with a mobile drawer nav, and respects `prefers-reduced-motion` (all effects disable cleanly).

## 🗂 Structure

```
index.html      # markup
css/style.css   # all styling, responsive rules & motion styles
js/main.js      # products, cart, wishlist, forms, sliders
js/fx.js        # premium motion layer (parallax, tilt, reveals, cursor)
```

## 🚀 Run

It's a static site — no build step. Open `index.html`, or serve locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Deploy anywhere static (GitHub Pages, Netlify, Vercel).

## 🖼 Photos

The site uses **real store photos** bundled in `assets/img/` (products, hero, about, gallery & collections). Every image has an `onerror` fallback, so if one ever fails to load the card gracefully falls back to the typographic design instead of showing a broken image.

**To change a product photo:** drop a new file into `assets/img/` and update that product's `img` filename in the `products` array in `js/main.js`. Hero, about, gallery and collection photos are referenced in `index.html` / the `gtiles` array in `js/main.js`.

`assets/inspo/` holds the design-reference screenshots used to shape the look — they are **not** displayed on the site.

## 🔧 Customize

- **WhatsApp number:** `WA_NUMBER` in `js/main.js`.
- **Products / photos:** the `products` array in `js/main.js`.
- **Colors / fonts:** CSS variables in `:root` at the top of `css/style.css`.
