import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssr = path.resolve("dist-ssr");
const template = fs
  .readFileSync(path.join(dist, "index.html"), "utf8")
  .replace(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/, (tag, href) => {
    const css = fs.readFileSync(path.join(dist, href), "utf8");
    const latin = css.match(/\/assets\/inter-tight-latin-wght-normal-[^)"']+\.woff2/);
    const preload = latin ? `<link rel="preload" href="${latin[0]}" as="font" type="font/woff2" crossorigin>` : "";
    return `${preload}<style>${css}</style>`;
  });
const { render, ROUTES, ORIGIN, UPDATED } = await import(pathToFileURL(path.join(ssr, "entry-server.js")).href);

if (!template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--app-html--> placeholder");
}

const NEWLINE = String.fromCharCode(10);
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const safeJson = (data) => JSON.stringify(data).replaceAll("<", "\\u003c");

function withHead(html, route) {
  const image = route.image ?? `${ORIGIN}/og.png`;
  const url = `${ORIGIN}${route.path === "/" ? "/" : route.path}`;
  return html
    .replaceAll(`${ORIGIN}/og.png`, image)
    .replace(/<title>[^<]*<\/title>/,`<title>${escape(route.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(route.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(route.title)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escape(route.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(route.description)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escape(route.description)}$2`);
}

for (const route of ROUTES) {
  let html = template.replace("<!--app-html-->", render(route.path));
  if (route.path !== "/") {
    const structured = (route.jsonld ?? [])
      .map((data) => `<script type="application/ld+json">${safeJson(data)}</script>`)
      .join(`${NEWLINE}    `);
    const replacement = structured ? `${structured}${NEWLINE}    ` : "";
    html = withHead(html, route).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, replacement);
  }
  const target = route.path === "/" ? path.join(dist, "index.html") : path.join(dist, `${route.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log(`Prerendered ${route.path}`);
}

const urls = ROUTES.map(
  (route) => `  <url>
    <loc>${ORIGIN}${route.path === "/" ? "/" : route.path}</loc>
    <lastmod>${UPDATED}</lastmod>
  </url>`,
).join(NEWLINE);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
);
console.log(`Sitemap with ${ROUTES.length} pages`);

fs.rmSync(ssr, { recursive: true, force: true });
