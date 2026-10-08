// Cloudflare Pages middleware: send every request on the old or www hosts to the canonical domain.
// Runs in front of the static site for all paths.
const CANONICAL = 'eldingo.co.uk';
const REDIRECT_HOSTS = new Set(['channeldynamics.io', 'www.channeldynamics.io', 'www.eldingo.co.uk']);
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  // Google Search Console verification: serve the token at the exact URL with a 200 (Pages would otherwise redirect .html URLs)
  if (url.pathname === '/google094081bd59565cc6.html') {
    return new Response('google-site-verification: google094081bd59565cc6.html', { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  return context.next();
}
