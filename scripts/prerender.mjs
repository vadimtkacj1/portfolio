import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssr = path.resolve("dist-ssr");
const templatePath = path.join(dist, "index.html");
const template = fs.readFileSync(templatePath, "utf8");
const { render } = await import(pathToFileURL(path.join(ssr, "entry-server.js")).href);

if (!template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--app-html--> placeholder");
}

fs.writeFileSync(templatePath, template.replace("<!--app-html-->", render()));
fs.rmSync(ssr, { recursive: true, force: true });
console.log("Prerendered dist/index.html");
