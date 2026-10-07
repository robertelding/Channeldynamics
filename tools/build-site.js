#!/usr/bin/env node
// Builds the whole static site into site/ from the CMS defaults.
// Usage (from repo root):  node tools/build-site.js [--content path/to/backup.json]
// The CMS file (cms/channel-dynamics-cms.html) holds both the content (DEFAULT CONTENT block)
// and the renderer (window.CD.buildPages). This script runs the renderer in jsdom and writes every page.
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CMS = path.join(ROOT, 'cms/channel-dynamics-cms.html');
const SITE = path.join(ROOT, 'site');

const args = process.argv.slice(2);
const ci = args.indexOf('--content');
const html = fs.readFileSync(CMS, 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' });
const win = dom.window;

let content;
if (ci >= 0) content = JSON.parse(fs.readFileSync(path.resolve(args[ci + 1]), 'utf8'));
else content = JSON.parse(win.document.getElementById('default-content').textContent);

const pages = win.CD.buildPages(content);
const paths = Object.keys(pages);
if (paths.length < 10) { console.error('Build FAILED: too few pages'); process.exit(1); }

// remove previously generated html (keep images, downloads, static files)
function clean(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (['images', 'downloads', 'favicon.png', '_headers', '_redirects', 'robots.txt', '.well-known'].includes(f)) continue;
    if (fs.statSync(p).isDirectory()) { clean(p); if (fs.readdirSync(p).length === 0) fs.rmdirSync(p); }
    else if (f.endsWith('.html') || f === 'sitemap.xml') fs.unlinkSync(p);
  }
}
clean(SITE);

let bytes = 0;
for (const [file, out] of Object.entries(pages)) {
  const p = path.join(SITE, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, out);
  bytes += out.length;
}

// sitemap
const base = content.site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const urls = paths.filter(f => f !== '404.html').map(f => '/' + f.replace(/index\.html$/, ''));
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : u.split('/').length > 3 ? '0.6' : '0.8'}</priority></url>`).join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sm);

// robots
fs.writeFileSync(path.join(SITE, 'robots.txt'), `# ${content.site.name} — ${base}\nUser-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

// referenced image check
const missing = new Set();
for (const out of Object.values(pages)) {
  for (const m of out.matchAll(/(?:src|href)="(\/(?:images|downloads)\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join(SITE, decodeURIComponent(m[1])))) missing.add(m[1]);
  }
}
console.log(`Built ${paths.length} pages (${Math.round(bytes / 1024)} KB) into site/`);
if (missing.size) { console.warn('WARNING: referenced files missing from site/:'); for (const m of missing) console.warn('  ' + m); }

win.close();
process.exit(0);
