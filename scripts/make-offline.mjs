import { readFile, writeFile } from "node:fs/promises";
// Inline the production bundle so the preview can also open through file://.
let html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const jsMatch = html.match(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
);
const cssMatch = html.match(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/,
);
if (!jsMatch || !cssMatch)
  throw new Error("No se ha encontrado el bundle de producción.");
const js = await readFile(
  new URL(`../dist/${jsMatch[1]}`, import.meta.url),
  "utf8",
);
const css = await readFile(
  new URL(`../dist/${cssMatch[1]}`, import.meta.url),
  "utf8",
);
html = html.replace(
  jsMatch[0],
  () =>
    `<script type="module">${js.replaceAll("</script", "<\\/script")}</script>`,
);
html = html.replace(cssMatch[0], () => `<style>${css}</style>`);
html = html.replace("<head>", '<head>\n    <base href="./dist/" />');
await writeFile(new URL("../ABRIR.html", import.meta.url), html);
console.log("Vista local lista: ABRIR.html");
