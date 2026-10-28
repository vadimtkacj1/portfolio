import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssr = path.resolve("dist-ssr");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, ROUTES, ORIGIN } = await import(pathToFileURL(path.join(ssr, "entry-server.js")).href);

if (!template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--app-html--> placeholder");
}

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

function withHead(html, route) {
  const url = `${ORIGIN}${route.path === "/" ? "/" : route.path}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
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
    html = withHead(html, route).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, "");
  }
  const target = route.path === "/" ? path.join(dist, "index.html") : path.join(dist, `${route.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log(`Prerendered ${route.path}`);
}

fs.rmSync(ssr, { recursive: true, force: true });
