import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { render, pageMetadata } from "../.prerender/entry-server.js";

const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const template = await readFile(resolve("dist/index.html"), "utf8");
for (const [path, { title, description }] of Object.entries(pageMetadata)) {
  const html = template
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    );
  const directory = resolve("dist", `.${path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), html);
  console.log(`Prerendered ${path}`);
}
await writeFile(
  resolve("dist/404.html"),
  template.replace(
    '<div id="root"></div>',
    `<div id="root">${render("/missing")}</div>`,
  ),
);

// GitHub Pages serves real directories; keep the archived client view reachable.
await mkdir(resolve("dist/previous"), { recursive: true });
await writeFile(resolve("dist/previous/index.html"), template);
