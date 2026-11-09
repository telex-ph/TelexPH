/**
 * Post-build step: turns the SPA's public pages into static HTML that crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, SEO checkers) can read without running JS,
 * and writes dist/sitemap.xml from the same page list (src/data/seo-pages.js).
 *
 * dist/app.html keeps the untouched SPA shell; vercel.json rewrites the app
 * routes that are not prerendered (dashboards, portals, funnels, new blog posts) to it.
 * Any other URL gets dist/404.html (same shell, shows NotFound) with a real 404 status.
 *
 * If Chrome can't start (e.g. missing system libraries on the build machine)
 * the build still succeeds and the site behaves exactly like the plain SPA.
 * ponytail: soft-fail keeps deploys safe; watch the build log for "[prerender] SKIPPED".
 */
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { preview } from "vite";
import { SEO_PAGES, SITE_URL, PAGES_LASTMOD } from "../src/data/seo-pages.js";

const PORT = 4173;
const log = (...a) => console.log("[prerender]", ...a);

// URLs that vercel.json 301-redirects elsewhere; their posts stay out of the sitemap, llms.txt and prerender.
const redirected = new Set(
  JSON.parse(await fs.readFile("vercel.json", "utf8")).redirects.map((r) => r.source.replace("{/}?", ""))
);

// 0. Published blog posts each get a page (/resources/blogs/<slug>). Needs VITE_API_URL
//    (the backend's /api URL, same one the app uses); without it, or if the backend is down,
//    posts are skipped. Slugs are limited to [a-z0-9-] because they become folder names under dist/.
const posts = await fetch(`${process.env.VITE_API_URL}/blogs`, { signal: AbortSignal.timeout(60000) })
  .then((r) => r.json())
  .then((all) => all.filter((b) => b.status === "published" && /^[a-z0-9-]+$/.test(b.slug) && !redirected.has(`/resources/blogs/${b.slug}`)))
  .catch((err) => (log("blog posts skipped:", err.message), []));
// Same for case studies (/resources/case-studies/<slug>): live ones only, never drafts or archived.
const caseStudies = await fetch(`${process.env.VITE_API_URL}/casestudies`, { signal: AbortSignal.timeout(60000) })
  .then((r) => r.json())
  .then((all) => all.filter((c) => ["active", "completed"].includes(c.status) && !c.isArchived && /^[a-z0-9-]+$/.test(c.slug) && !redirected.has(`/resources/case-studies/${c.slug}`)))
  .catch((err) => (log("case studies skipped:", err.message), []));
// Detail page route -> its title (the page is snapshotted once that title is in an <h1>).
const postTitles = new Map([
  ...posts.map((b) => [`/resources/blogs/${b.slug}`, b.title]),
  ...caseStudies.map((c) => [`/resources/case-studies/${c.slug}`, c.title]),
]);
log(`${posts.length} blog posts, ${caseStudies.length} case studies`);

// 1. Sitemap + SPA shell first: both must exist even if prerendering fails.
// Static pages use their own `lastmod` or PAGES_LASTMOD, never the build date: a date that changes on
// every deploy without content changes teaches Google to ignore lastmod. The two list pages change
// whenever one of their posts does, so they take the newest post's date.
const buildDate = new Date().toISOString().slice(0, 10);
const newest = (list) => list.map((x) => x.updatedAt?.slice(0, 10)).filter(Boolean).sort().at(-1);
const listLastmod = { "/resources/blogs": newest(posts), "/resources": newest(caseStudies) };
const sitemapUrls = [
  ...SEO_PAGES.filter((p) => p.sitemap !== false).map((p) => [p.path, p.lastmod ?? listLastmod[p.path] ?? PAGES_LASTMOD]),
  ...posts.map((b) => [`/resources/blogs/${b.slug}`, b.updatedAt?.slice(0, 10) ?? buildDate]),
  ...caseStudies.map((c) => [`/resources/case-studies/${c.slug}`, c.updatedAt?.slice(0, 10) ?? buildDate]),
]
  .map(([path, lastmod]) => `  <url><loc>${SITE_URL}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
  .join("\n");
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);
// Same post list → "## Blog Posts" in llms.txt, so AI crawlers find every published article.
if (posts.length) {
  const blogList = posts
    .map((b) => `- [${b.title}](${SITE_URL}/resources/blogs/${b.slug}): ${(b.shortDescription ?? "").replace(/\s+/g, " ").trim()}`)
    .join("\n");
  const llms = await fs.readFile("dist/llms.txt", "utf8");
  await fs.writeFile("dist/llms.txt", llms.replace("## Technical Information", `## Blog Posts\n\n${blogList}\n\n## Technical Information`));
}
await fs.copyFile("dist/index.html", "dist/app.html");
await fs.copyFile("dist/index.html", "dist/404.html");
// Every public page starts as the SPA shell, so a page that fails to prerender (or a skipped
// prerender) still returns 200 like before, instead of falling through to 404.html.
const routes = [...SEO_PAGES.filter((p) => p.prerender !== false).map((p) => p.path), ...postTitles.keys()];
for (const route of routes.filter((r) => r !== "/")) {
  await fs.mkdir(`dist${route}`, { recursive: true });
  await fs.copyFile("dist/app.html", `dist${route}/index.html`);
}
log("wrote sitemap.xml, llms.txt, app.html, 404.html and page shells");

// 2. Launch Chrome (download it once if npm skipped puppeteer's install script).
//    Imported here, after app.html exists, so a missing puppeteer can't break the SPA fallback.
let browser;
try {
  const { default: puppeteer } = await import("puppeteer");
  // Vercel's build image lacks the system libraries puppeteer's Chrome needs;
  // @sparticuz/chromium ships a self-contained headless Chromium for it.
  // --disable-web-security: the preview runs on localhost:4173, which the backend's CORS list
  // doesn't allow, so without it every API call (blog posts, case studies) is blocked and the
  // pages snapshot empty. Build-time only; this headless Chrome only visits our own preview.
  const NO_CORS = "--disable-web-security";
  const launch = async () => {
    if (!process.env.VERCEL) return puppeteer.launch({ args: ["--no-sandbox", NO_CORS] });
    const { default: chromium } = await import("@sparticuz/chromium");
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({ args: [...chromium.args, NO_CORS], headless: "shell" }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  };
  try {
    browser = await launch();
  } catch (err) {
    log("launch failed, installing Chrome and retrying:", err.message);
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });
    browser = await launch();
  }
} catch (err) {
  log("SKIPPED: Chrome could not start, site ships as plain SPA.", err.message);
  process.exit(0);
}

// 3. Render each page. "/" goes last because it overwrites dist/index.html,
//    which the preview server also uses as its SPA fallback.
routes.sort((a, b) => (a === "/") - (b === "/"));

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: "error" });
const page = await browser.newPage();
let failed = 0;
for (const route of routes) {
  try {
    // Backend (Render) may be cold; don't let one slow API call sink the page.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 60000 })
      .catch((err) => log(`slow network on ${route}, snapshotting anyway:`, err.message));
    // A post or case study shows a short loading animation before its <h1>; wait for the real page.
    // Whitespace is ignored: the <h1> splits the title into styled spans and drops some spaces.
    if (postTitles.has(route)) {
      await page.waitForFunction(
        (t) => [...document.querySelectorAll("h1")].some((h) => h.textContent.replace(/\s+/g, "") === t),
        { timeout: 15000 },
        postTitles.get(route).replace(/\s+/g, "")
      );
    }
    const html = await page.evaluate(() => {
      document.getElementById("root")?.setAttribute("data-prerendered", "");
      return "<!doctype html>\n" + document.documentElement.outerHTML;
    });
    const dir = route === "/" ? "dist" : `dist${route}`;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(`${dir}/index.html`, html);
    log("ok", route);
  } catch (err) {
    failed++;
    log("FAILED", route, err.message);
  }
}
await browser.close();
server.httpServer.close();
log(`done: ${routes.length - failed}/${routes.length} pages`);
