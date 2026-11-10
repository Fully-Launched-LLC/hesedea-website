# Hesedea website

## Project

Hesedea website, a Fully Launched client site.

- Static HTML, no framework, no build step.
- Hosted on Vercel: team `fully-launched1`, project `hesedea-website`.
- Auto-deploys on push to `main` from GitHub `Fully-Launched-LLC/hesedea-website`.

## Structure

- Pages: `home/`, `shop/`, `about/`, `mully/`, `team/` (each `<page>/index.html`). There is no root `index.html`: `vercel.json` rewrites `/` to serve `home/index.html` (no redirect, so `hesedea.com` shows the homepage at the bare domain; needed for Google Search Console's HTML-tag verification, whose `google-site-verification` meta tag is in `home/index.html` and must stay). `vercel.json` redirects the old `/mcf` and `/gear` URLs to `/mully` and `/shop`. Split from the original single-file site; there is no JS view router any more, nav links are real URLs.
- Header, footer and cart drawer markup is duplicated in every page (no build step). Change it in every page (5 main pages + 9 product pages) and keep them identical.
- Each page has its own title, meta description, canonical and OG tags. The Organization JSON-LD is on Home only. Add new pages to `sitemap.xml`.
- `assets/styles.css` and `assets/site.js` are shared by all pages.
- Shopify Buy SDK (in `site.js`) is live: it turns the static "Notify Me" buttons into Add to Cart with size pickers. The cart is a Shopify checkout whose id is kept in localStorage, so it persists across pages. Every page needs the cart drawer markup and `#cart-count`.
- Product pages: `shop/<slug>/index.html` for each of the 9 products (e.g. `/shop/off-black-tee`; the women's ivory tee is `/shop/womens-ivory-tee` but its Shopify key is `womens-bone-tee`). Shop and Home cards link to them. Each has its own title/description/canonical/OG, a BreadcrumbList JSON-LD, the buy slot, and 3 related cards. Add new products as a page plus a sitemap entry.
- On product pages `site.js` (`enhanceProductDetail`) swaps in Shopify's own description (`descriptionHtml`) and full-size photos with thumbnails at runtime; the static description and local 420x525 photo are the fallback. Once the Shopify connector works, put the real descriptions and full-size photos into the HTML too, so Google sees them without JS.
- Product structured data (JSON-LD) is built at runtime in `site.js` (`recordProductSchema`) on product pages only, from the live Shopify variants, so price and stock in Google always match the page. It reads the page's `h1`, main image, thumbnails and `[data-product-description]`.
- New pages go in folders as `<page>/index.html` so URLs are clean (`/about`, `/contact`).
- Shared CSS and JS go in `/assets`; images in `/assets/images`.
- No base64-embedded images. All images are files in `/assets/images` (the 23 originally embedded ones were extracted, deduped to 17 files).
- Global CSS rule `img{ height: auto }` is required because every `<img>` carries `width`/`height` attributes; without it the height attribute would override CSS sizing (e.g. `.team-photo img` aspect-ratio).
- Team gallery (`initTeamGallery()`) clones team photos by matching alt text: don't change those alts.
- `google6626213620253c95.html` at the root is an earlier Search Console verification file; leave it in place.
- `vercel.json` also redirects the old `/hesedea-preview-blue.html` and `/index.html` URLs to `/home`.
- `.vercelignore` keeps this file out of the deployment.

## Rules

- Keep it static unless told otherwise.
- Every page links to the shared stylesheet.
- Nav links use root-relative paths (`/about`, not `about.html`).
- After any push to `main`, confirm the Vercel production deploy is READY and that each page returns 200.
- Before making any changes, run git pull on main. Other people push to this repo.

## Commits

- Author: luke@fullylaunched.com (already set in repo config).

## Open questions

- Page list: TBD
- How Shopify fits in: TBD
- Who edits content after launch: TBD

## To-do (check with Elias first, not started)

1. ~~Extract the 23 base64 images into `/assets/images`~~ Done: 17 files, `index.html` down from ~520 KB to ~100 KB, width/height on every img, `loading="lazy"` on all but the hero logo.

2. **Get high-res product photos from Hesedea.** Ask for originals at 1200px+ on the long side.

   Why: all product images (9 unique, 12 placements) are 420x525px at 4.5 to 8.2 KB. They'll look soft on retina screens and won't hold up on product detail pages.

   Hesedea supplied the photos, so the low resolution most likely came from compression when they were embedded in the single-file HTML, or from pulling web/Shopify thumbnails. Ask Elias where the originals are. If the products are in Hesedea's Shopify, the admin has full-res versions.

3. ~~Decide whether to split into multiple pages.~~ Done: split into 5 pages.

   Why: depends on the open questions (page list, how Shopify fits in, who edits content). If the site stays one page, item 1 is still worth doing for speed; if it splits, item 1 should happen first.
