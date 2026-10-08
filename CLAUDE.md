# Eldingo (formerly Channel Dynamics) — project brief for Claude Code

Marketing website for **Eldingo**, the trading name of Channel Dynamics Ltd (company no. 11077677), an AI, service
design and research consultancy led by Robert Elding. The site showcases past client work (case studies), services,
UX training, a blog archive and free resources. It replaces the old WordPress site that lived on WP Engine
(chndynamics.wpenginepowered.com); copy and images were migrated from there in October 2026.

## Layout
- `site/` — the published website. `.github/workflows/deploy.yml` pushes it to Cloudflare Pages on every push to
  `main` (project `channeldynamics`, secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` live in GitHub Actions secrets).
  `functions/` holds Pages Functions (currently only the host-redirect middleware).
- `cms/channel-dynamics-cms.html` — single-file Site Manager; its `default-content` JSON block drives every page,
  and its `window.CD.buildPages()` renderer is shared with the build script
- `tools/` — `node tools/build-site.js` (build all pages), `node tools/apply-content.js <backup.json>` (publish a
  CMS backup into the defaults). See tools/README.md.
- `brand/` — Eldingo! logo system (navy wordmark in Helvetica Neue Bold outlines, hanging-bulb exclamation mark).
  Palette: Brand navy #1B2A4A, Spark yellow #FFC83D, Ink #1F2733, Mist #F4F5F7; Red #E4130E only for `theme: red`
  pages (Switch On / Red Team). Site font: Inter. Logo geometry in `brand/eldingo-logo.json`; the renderer builds the
  header/footer logo inline from `site.logoPath` (see `logoSvg()` in the CMS).
- `docs/GO-LIVE.md` — hosting/launch runbook.

## Site map
`/` · `/work/` + `/work/<slug>/` (25 case studies: 13 recent 2020–26 in group `recent`, 12 earlier) ·
`/services/` + `/services/<pillar>/` (ai, service-design, research, advisory) + `/services/<pillar>/<slug>/`
(20 pages) + `/services/public-sector/` · `/training/` · `/about/` · `/about/leadership/` (director profile for
clients, boards and NED searches) · `/resources/` · `/blog/` + `/blog/<slug>/` (41 posts) · `/contact/` · `/terms/`.
Old WordPress paths and the pre-October-2026 service paths 301 in `site/_redirects`.

## Brand direction (decided Oct 2026)
The site is **Eldingo**, live at https://eldingo.co.uk (canonical). channeldynamics.io, www.channeldynamics.io and
www.eldingo.co.uk 301 to it via `functions/_middleware.js` (Cloudflare Pages Functions, deployed by wrangler from the
repo root). Channel Dynamics Ltd stays the legal entity; verbatim testimonials still say "Channel Dynamics" and must
not be edited. Email: hello@eldingo.co.uk (Cloudflare Email Routing). Contact form: Web3Forms key in the CMS. Positioning: AI, service design and innovation, research
and future concept design. Predictable Selling Systems and Traffic pages were removed. Voice is "we".
Recent-work case studies (2020–26) come from Robert's CV; they state what the client reported and invent no metrics.
Robert resells **RedOS by redfirst.ai** (page under the AI pillar); keep its description consistent with redfirst.ai.
Design rules from Robert (Oct 2026): NO dark mode, lots of white space, colour client logos shown large, subtle motion only.
The redfirst.ai reseller offer is branded **Switch On** (stages: Lightbulb session → Switch On → Build Out → Lights On),
mapped to redfirst's Red Brief / Red Eye / Red Embed. Extra pages: `/lab/` (tools, products, explorations), `/press-kit/`, `/ai-readiness-check/`, `/tools/ai-use-case-prioritiser/`,
`/tools/usability-test-participants/` (all client-side, logic in the renderer, wording in `tools`/`quickcheck` content).
IMPORTANT: `site/_headers` caches /images/* for a year as immutable, so NEVER overwrite an image under the same
name; give changed artwork a new filename (e.g. `eldingo-*`). Client logos: `eldingo-client-*.svg` (bp pulse, Tesco,
Lloyd's, Lebara, DWP from Wikimedia Commons PD-textlogo; name plates for MoJ, DHSC, HMRC, MHCLG, Shell, WLGA).
Illustrations: `eldingo-ill-*.svg`, generated in the brand style. Brand pack (logos, animation, business card, guidelines)
lives in `brand/pack/`; rasterise SVGs with headless Chrome, never Quick Look. Pitch deck for Switch On is a Claude Slides
artifact (https://claude.ai/artifact/QxX8WXtt6bKKHEk7VwkivK). Case studies may carry an interactive `blueprint` (lanes × steps). Brand concepts for the Eldingo!
rename live in `brand/eldingo-logo-concepts.html` (A lightbulb, B bolt, C bell).
Videos: leadership and About pages accept a `videos` list (YouTube ID or an .mp4 in site/downloads/); press items live in
`leadership.press`. The Jazz FM / Mishcon interview (May 2025) is audio only, hosted at hellorayo.co.uk; link, don't copy.

## Standard workflow for any change
1. Edit the content JSON in the CMS (or via the Site Manager UI → Backup JSON → `apply-content.js`)
2. `node tools/build-site.js`; check the output (it warns about missing images)
3. Show the owner a summary of what changed, then commit with a clear message and push

## Non-negotiables
- Never commit secrets or `.env`.
- Brand is "Eldingo" (legal: Channel Dynamics Ltd). Testimonials and quotes stay verbatim even where they say Channel Dynamics.
- Testimonials, client names and case-study results are real and must stay verbatim. No invented claims.
- Images go in `site/images/`, named `channel-dynamics-*.jpg|png|webp`, web-optimised (< ~300 KB).
- The contact form posts to Web3Forms when `contact.formAccessKey` is set (an access key tied to hello@eldingo.co.uk;
  it is designed to be public, not a secret) and falls back to a pre-filled email otherwise. No secrets in the repo.
