#!/usr/bin/env node
// Writes a content JSON (e.g. a "Backup JSON" downloaded from the Site Manager) into the
// DEFAULT CONTENT block of cms/channel-dynamics-cms.html, making it the published source of truth.
// Usage (from repo root):  node tools/apply-content.js path/to/channel-dynamics-content.json
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CMS = path.join(ROOT, 'cms/channel-dynamics-cms.html');
const src = process.argv[2];
if (!src) { console.error('Usage: node tools/apply-content.js <content.json>'); process.exit(1); }
const json = JSON.parse(fs.readFileSync(path.resolve(src), 'utf8'));
for (const k of ['site', 'theme', 'nav', 'footer', 'home', 'work', 'services', 'blog', 'contact']) {
  if (!(k in json)) { console.error(`Refusing: content JSON has no "${k}" section`); process.exit(1); }
}
const html = fs.readFileSync(CMS, 'utf8');
const re = /(<script id="default-content" type="application\/json">\n)[\s\S]*?(\n<\/script>)/;
if (!re.test(html)) { console.error('Could not find the default-content block in the CMS file'); process.exit(1); }
const safe = JSON.stringify(json, null, 1).replace(/<\/script/gi, '<\\/script');
fs.writeFileSync(CMS, html.replace(re, `$1${safe}$2`));
console.log('Default content updated in cms/channel-dynamics-cms.html — now run: node tools/build-site.js');
