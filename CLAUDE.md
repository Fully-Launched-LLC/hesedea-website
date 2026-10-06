# Hesedea website

## Project

Hesedea website, a Fully Launched client site.

- Static HTML, no framework, no build step.
- Hosted on Vercel: team `fully-launched1`, project `hesedea-website`.
- Auto-deploys on push to `main` from GitHub `Fully-Launched-LLC/hesedea-website`.

## Structure

- `index.html` is the homepage.
- New pages go in folders as `<page>/index.html` so URLs are clean (`/about`, `/contact`).
- Shared CSS and JS go in `/assets`; images in `/assets/images`.
- No base64-embedded images. (`index.html` still has 23 embedded images from the original preview file; extract them to `/assets/images` when asked.)
- `vercel.json` redirects the old `/hesedea-preview-blue.html` URL to `/`.
- `.vercelignore` keeps this file out of the deployment.

## Rules

- Keep it static unless told otherwise.
- Every page links to the shared stylesheet.
- Nav links use root-relative paths (`/about`, not `about.html`).
- After any push to `main`, confirm the Vercel production deploy is READY and that each page returns 200.

## Commits

- Author: luke@fullylaunched.com (already set in repo config).

## Open questions

- Page list: TBD
- How Shopify fits in: TBD
- Who edits content after launch: TBD

## To-do (check with Elias first, not started)

1. **Extract the 23 base64 images into `/assets/images`** (17 unique files). Plan already worked out:
   - Dedupe: the logo mark used 4 times, and the 3 products shown twice (off-black tee, maroon crewneck, rope cap).
   - Keep existing alt text exactly; `initTeamGallery()` finds team photos by matching on it.
   - Leave the 3 decorative logos (hero logo, 2 mark-panel logos) with `alt=""`.
   - Add `width`/`height` to every img, and `loading="lazy"` on all except the hero logo.

   Why: images are ~78% of the 520 KB HTML. Extracting drops `index.html` to ~110 KB, lets browsers cache images, and lets future pages share them instead of each one re-embedding the same data.

2. **Get high-res product photos from Hesedea.** Ask for originals at 1200px+ on the long side.

   Why: all product images (9 unique, 12 placements) are 420x525px at 4.5 to 8.2 KB. They'll look soft on retina screens and won't hold up on product detail pages.

   Hesedea supplied the photos, so the low resolution most likely came from compression when they were embedded in the single-file HTML, or from pulling web/Shopify thumbnails. Ask Elias where the originals are. If the products are in Hesedea's Shopify, the admin has full-res versions.

3. **Decide whether to split into multiple pages.**

   Why: depends on the open questions (page list, how Shopify fits in, who edits content). If the site stays one page, item 1 is still worth doing for speed; if it splits, item 1 should happen first.
