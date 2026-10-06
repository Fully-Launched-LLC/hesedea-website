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
