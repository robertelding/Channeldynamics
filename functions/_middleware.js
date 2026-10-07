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
  return context.next();
}
