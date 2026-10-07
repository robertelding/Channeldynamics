# Channel Dynamics — project brief for Claude Code

Marketing website for **Channel Dynamics Ltd**, a UX, service design and conversion consultancy led by
Robert Elding (company no. 11077677). The site showcases past client work (case studies), services,
UX training, a blog archive and free resources. It replaces the old WordPress site that lived on WP Engine
(chndynamics.wpenginepowered.com); copy and images were migrated from there in October 2026.

## Layout
- `site/` — the published website. `.github/workflows/deploy.yml` pushes it to Cloudflare Pages on every push to
  `main` (project `channeldynamics`, secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` live in GitHub Actions secrets)
- `cms/channel-dynamics-cms.html` — single-file Site Manager; its `default-content` JSON block drives every page,
  and its `window.CD.buildPages()` renderer is shared with the build script
- `tools/` — `node tools/build-site.js` (build all pages), `node tools/apply-content.js <backup.json>` (publish a
  CMS backup into the defaults). See tools/README.md.
- `brand/` — logo. Palette: Red #E4130E, Dark red #AB0116, Ink #14181D, Slate #525B68, Mist #F4F5F7. Font: Manrope.
- `docs/GO-LIVE.md` — hosting/launch runbook.

## Site map
`/` · `/work/` + `/work/<slug>/` (12 case studies) · `/services/` + `/services/<pillar>/` (discover, insight,
optimise) + `/services/<pillar>/<slug>/` (10 pages) + `/services/predictable-selling-systems/`, `service-design/`,
`analytics-reporting/`, `traffic/` · `/training/` · `/about/` · `/resources/` · `/blog/` + `/blog/<slug>/` (36 posts)
· `/contact/` · `/terms/`. Old WordPress paths 301 in `site/_redirects`.

## Standard workflow for any change
1. Edit the content JSON in the CMS (or via the Site Manager UI → Backup JSON → `apply-content.js`)
2. `node tools/build-site.js`; check the output (it warns about missing images)
3. Show the owner a summary of what changed, then commit with a clear message and push

## Non-negotiables
- Never commit secrets or `.env`.
- Company name is "Channel Dynamics" (legal: Channel Dynamics Ltd).
- Testimonials, client names and case-study results are real and must stay verbatim. No invented claims.
- Images go in `site/images/`, named `channel-dynamics-*.jpg|png|webp`, web-optimised (< ~300 KB).
- The contact form has no backend: it opens a pre-filled email. Don't add form handlers that need secrets in the repo.
