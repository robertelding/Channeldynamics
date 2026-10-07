# Channel Dynamics — channeldynamics.io

Website, content management and build tooling for Channel Dynamics Ltd, a UX, service design and
conversion consultancy. Static site, no servers.

## Structure

| Path | What it is |
|---|---|
| `/site` | The published website (75 static pages, images, downloads, redirects). Cloudflare Pages serves this folder. |
| `/cms` | **Site Manager** — single-file CMS: edit every page, case study, service, blog post and setting with a live preview; export a content backup. |
| `/tools` | `build-site.js` renders the whole site from the CMS content; `apply-content.js` publishes a CMS backup into the defaults. |
| `/brand` | Logo and palette. |
| `/docs` | Go-live runbook. |

## Quick start

```bash
cd tools && npm install          # once
node build-site.js               # from tools/, or `node tools/build-site.js` from the root
npm run serve                    # preview at http://localhost:8080
```

To edit content without code, open `cms/channel-dynamics-cms.html` in a browser. See `tools/README.md`.

## Deployment

Cloudflare Pages. A GitHub Actions workflow (`.github/workflows/deploy.yml`) uploads `site/` with wrangler on
every push to `main`. Custom domain and DNS are managed in Cloudflare.
See `docs/GO-LIVE.md`.
