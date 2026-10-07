# Site build tools

Everything under `site/` (except `images/`, `downloads/`, `_headers`, `_redirects`, `favicon.png`) is generated
from the **default content** inside `cms/channel-dynamics-cms.html`.

| Output | Source | Command (run from repo root) |
|---|---|---|
| All 75 pages, `sitemap.xml`, `robots.txt` | the `default-content` JSON block in `cms/channel-dynamics-cms.html` | `node tools/build-site.js` |

Setup once: `cd tools && npm install` (installs jsdom).

## Two ways to change content

**A. In the Site Manager (no code)**
1. Open `cms/channel-dynamics-cms.html` in a browser (double-click it). Edit in the left panel; the preview updates live.
   Set *Site settings → Preview base URL* to `http://localhost:8080` and run `npm run serve` inside `tools/` to see local images.
2. Click **Save** (keeps a draft in that browser), then **Backup JSON** to download `channel-dynamics-content.json`.
3. `node tools/apply-content.js ~/Downloads/channel-dynamics-content.json` writes it into the CMS file as the published defaults.
4. `node tools/build-site.js`, check `site/`, commit and push.

**B. Directly in the file** — edit the JSON inside the `default-content` block of the CMS (or ask Claude Code to), then build.

## Adding things
- **Case study**: Work → Case studies → Add. Needs a slug, client, headline, stat, images (`/images/channel-dynamics-….jpg`), copy. It becomes `/work/<slug>/` and appears in the grid; add its slug to Home → Featured case studies to show it on the homepage.
- **Blog post**: Blog → Posts → Add. Body is simple markdown (`## Heading`, `- bullet`, `![alt](/images/x.jpg)`, `> quote`). It becomes `/blog/<slug>/`.
- **Service page**: Services → Service pages → Add; set `parent` to `discover`, `insight` or `optimise` (or blank for `/services/<slug>/`) and add the slug to that pillar's item list.
- **Images**: put web-optimised files in `site/images/` named `channel-dynamics-<subject>.jpg|png|webp` (keep under ~300 KB), then reference them as `/images/channel-dynamics-<subject>.jpg`.
- **Downloads**: PDFs go in `site/downloads/`.

## Rules
- Never commit `.env` or any secret.
- Testimonials and case-study results must stay real and verbatim.
- Old WordPress URLs are redirected in `site/_redirects`; keep it updated if you rename pages.
