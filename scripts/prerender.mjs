/**
 * Post-build step: turns the SPA's public pages into static HTML that crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, SEO checkers) can read without running JS,
 * and writes dist/sitemap.xml from the same page list (src/data/seo-pages.js).
 *
 * dist/app.html keeps the untouched SPA shell; vercel.json rewrites every
 * non-prerendered route (dashboards, portals, 404s) to it.
 *
 * If Chrome can't start (e.g. missing system libraries on the build machine)
 * the build still succeeds and the site behaves exactly like the plain SPA.
 * ponytail: soft-fail keeps deploys safe; watch the build log for "[prerender] SKIPPED".
 */
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { preview } from "vite";
import { SEO_PAGES, SITE_URL } from "../src/data/seo-pages.js";

const PORT = 4173;
const log = (...a) => console.log("[prerender]", ...a);

// 1. Sitemap + SPA shell first: both must exist even if prerendering fails.
const sitemapUrls = SEO_PAGES.filter((p) => p.sitemap !== false)
  .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`)
  .join("\n");
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);
await fs.copyFile("dist/index.html", "dist/app.html");
log("wrote sitemap.xml and app.html");

// 2. Launch Chrome (download it once if npm skipped puppeteer's install script).
//    Imported here, after app.html exists, so a missing puppeteer can't break the SPA fallback.
let browser;
try {
  const { default: puppeteer } = await import("puppeteer");
  // Vercel's build image lacks the system libraries puppeteer's Chrome needs;
  // @sparticuz/chromium ships a self-contained headless Chromium for it.
  const launch = async () => {
    if (!process.env.VERCEL) return puppeteer.launch({ args: ["--no-sandbox"] });
    const { default: chromium } = await import("@sparticuz/chromium");
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
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
const routes = SEO_PAGES.filter((p) => p.prerender !== false).map((p) => p.path);
routes.sort((a, b) => (a === "/") - (b === "/"));

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: "error" });
const page = await browser.newPage();
let failed = 0;
for (const route of routes) {
  try {
    // Backend (Render) may be cold; don't let one slow API call sink the page.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 60000 })
      .catch((err) => log(`slow network on ${route}, snapshotting anyway:`, err.message));
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
