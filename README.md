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
- **Fully responsive** with a mobile drawer nav, and respects `prefers-reduced-motion`.

## 🗂 Structure

```
index.html      # markup
css/style.css   # all styling & responsive rules
js/main.js      # products, cart, wishlist, forms, sliders
```

## 🚀 Run

It's a static site — no build step. Open `index.html`, or serve locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Deploy anywhere static (GitHub Pages, Netlify, Vercel).

## 🔧 Customize

- **WhatsApp number:** `WA_NUMBER` in `js/main.js`.
- **Products:** the `products` array in `js/main.js`.
- **Colors / fonts:** CSS variables in `:root` at the top of `css/style.css`.
