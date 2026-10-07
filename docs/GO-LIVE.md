# Channel Dynamics — Go-Live Runbook
_Static site on Cloudflare Pages, deployed from GitHub. Same stack as porticosuites.com._

**Target architecture & monthly cost**

| Piece | Host | Cost |
|---|---|---|
| DNS + SSL + CDN | Cloudflare (free plan) | £0 |
| Website (static, built from the CMS) | Cloudflare Pages, auto-deploy from GitHub | £0 |
| Contact form | none — opens a pre-filled email (mailto) | £0 |

Everything deploys from `github.com/robertelding/eldingo`; every commit to `main` publishes `site/`.

## Phase 1 — Deploy to Cloudflare Pages via GitHub Actions (one-off, ~5 minutes)
The repo deploys itself with `.github/workflows/deploy.yml` (wrangler → Cloudflare Pages). This avoids the
Cloudflare GitHub-app connection, which would not list this repo.
- [ ] Cloudflare dashboard → profile icon (top right) → **My Profile** → **API Tokens** → **Create Token** →
      **Create Custom Token**: name `channeldynamics-pages-deploy`; Permissions: **Account · Cloudflare Pages · Edit**;
      Account Resources: your account. Create, then copy the token (it is shown once)
- [ ] Cloudflare → **Workers & Pages** → copy the **Account ID** from the right-hand side of the overview page
- [ ] GitHub → `robertelding/Channeldynamics` → **Settings** → **Secrets and variables** → **Actions** →
      **New repository secret**, twice: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [ ] GitHub → **Actions** tab → **Deploy to Cloudflare Pages** → **Run workflow** (or just push a commit)
- [ ] Check `https://channeldynamics.pages.dev/` renders, and that `/case-studies/cipfa/` redirects to `/work/cipfa/`
- [ ] If a `channeldynamics` Pages project already exists and shows a 522, the workflow deploys into it; if it was
      deleted, the workflow recreates it

## Phase 2 — Move to eldingo.co.uk (the brand's domain)
The repo is now `github.com/robertelding/eldingo`; the Pages project is still called `channeldynamics` (the name is
internal and cannot be renamed; the custom domain is what visitors see).
- [x] **You:** Cloudflare → Websites → **Add a site** → `eldingo.co.uk` → Free plan. Cloudflare shows two nameservers.
- [x] **You:** at LCN (where eldingo.co.uk is registered) → Manage domain → Nameservers → replace LCN's with the two
      Cloudflare nameservers. Wait until Cloudflare shows the zone as **Active** (minutes to a few hours).
- [x] **Either:** GitHub → Actions → **Attach custom domain to Pages** → Run workflow (domain `eldingo.co.uk`, project
      `channeldynamics`). It attaches apex + www using the repo's Cloudflare secrets; if the token cannot edit DNS it
      says so, and you finish in Cloudflare → Workers & Pages → channeldynamics → Custom domains → Set up a custom
      domain (one click each for `eldingo.co.uk` and `www.eldingo.co.uk`).
- [x] Done 2026-10-07: Site URL is `https://eldingo.co.uk`; `functions/_middleware.js` 301s channeldynamics.io, www.channeldynamics.io
      and www.eldingo.co.uk to the canonical host. Keep channeldynamics.io registered and attached to the same Pages
      project so those redirects keep working.
- [ ] SSL/TLS: Full (strict) + Always Use HTTPS on the new zone.
- [ ] Email: Cloudflare → eldingo.co.uk → Email → Email Routing → add and verify your Gmail as a destination, then a
      custom address `hello` → that destination. (The site already shows hello@eldingo.co.uk.)
- [ ] Contact form: go to web3forms.com, enter hello@eldingo.co.uk, confirm the email it sends, copy the access key, and
      paste it into *Contact → Web3Forms access key* in the CMS (or give it to Claude Code). Rebuild and push. Until
      then the form opens a pre-filled email instead. Test it once from the live site.
- [ ] Search Console: add `eldingo.co.uk`, submit the sitemap, and use **Change of address** from channeldynamics.io.

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
