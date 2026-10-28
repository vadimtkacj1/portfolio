import fs from "node:fs";
import path from "node:path";

const host = "portfolio-chi-teal-59.vercel.app";
const key = fs.readdirSync("public").find((name) => /^[0-9a-f]{32}\.txt$/.test(name)).slice(0, 32);
const sitemap = await fetch(`https://${host}/sitemap.xml`).then((response) => response.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(response.status, urlList.length, "urls", path.basename(import.meta.url));
