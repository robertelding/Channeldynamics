# Channel Dynamics — Go-Live Runbook
_Static site on Cloudflare Pages, deployed from GitHub. Same stack as porticosuites.com._

**Target architecture & monthly cost**

| Piece | Host | Cost |
|---|---|---|
| DNS + SSL + CDN | Cloudflare (free plan) | £0 |
| Website (static, built from the CMS) | Cloudflare Pages, auto-deploy from GitHub | £0 |
| Contact form | none — opens a pre-filled email (mailto) | £0 |

Everything deploys from `github.com/robertelding/Channeldynamics`; every commit to `main` publishes `site/`.

## Phase 1 — Cloudflare Pages project (one-off, ~5 minutes)
- [ ] Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- [ ] Pick the GitHub repo `robertelding/Channeldynamics` (authorise the Cloudflare GitHub app for it if asked)
- [ ] Build settings: Framework preset **None** · Build command **(leave empty)** · Build output directory **`site`**
- [ ] Save and Deploy → note the `*.pages.dev` URL and check every section renders
      (`/`, `/work/post-office/`, `/services/insight/usability-testing/`, `/blog/`, `/contact/`)
- [ ] Verify the old-URL redirects work, e.g. `/case-studies/cipfa/` → `/work/cipfa/`

## Phase 2 — Domain & DNS
- [ ] Decide the live domain (the old site referenced **channeldynamics.io**). In Cloudflare → Websites → Add site
      (free plan) if the domain isn't already on Cloudflare; move the nameservers at the registrar
- [ ] Pages project → **Custom domains** → add `channeldynamics.io` and `www.channeldynamics.io`
      (Cloudflare creates the CNAME records; www redirects to the apex)
- [ ] SSL/TLS mode: **Full (strict)**; enable **Always use HTTPS**
- [ ] If the domain differs, change **Site settings → Live site URL** in the CMS (canonical links, sitemap,
      Open Graph) and rebuild

## Phase 3 — Retire the WordPress site
- [ ] Confirm the new site is live on the custom domain
- [ ] In WP Engine, either delete the install or point its domain to the new site; cancel the plan
- [ ] Search Console: add the new property, submit `https://<domain>/sitemap.xml`
- [ ] Google Business Profile / LinkedIn / email signatures: update the website link

## Phase 4 — Optional improvements
- [ ] Real contact form: Cloudflare Pages Functions + an email API (e.g. Resend) — keep the API key in
      Pages → Settings → Environment variables, never in the repo
- [ ] Analytics: Cloudflare Web Analytics (free, no cookie banner) — Pages → Analytics → enable
- [ ] Confirm the office address, phone number and email on the Contact page are current
- [ ] Review training prices and FAQ answers; add public course dates when scheduled

## Day-to-day publishing
Edit content (Site Manager → Backup JSON → `node tools/apply-content.js`, or edit the JSON directly) →
`node tools/build-site.js` → commit → push. Cloudflare publishes in about a minute.
