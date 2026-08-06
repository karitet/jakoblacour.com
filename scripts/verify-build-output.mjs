import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const legacyPages = [
  "activities.html",
  "hybrid-sensation.html",
  "library.html",
  "map.html",
  "morphic-realities.html",
  "robotic-bloom.html"
];

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

for (const page of legacyPages) {
  const [source, built] = await Promise.all([
    readFile(resolve(root, page)),
    readFile(resolve(root, "dist", page))
  ]);
  if (digest(source) !== digest(built)) throw new Error(`${page} changed while copying to dist.`);
}

const [legacyHome, rollbackHome, astroHome] = await Promise.all([
  readFile(resolve(root, "index.html")),
  readFile(resolve(root, "dist", "legacy", "index.html")),
  readFile(resolve(root, "dist", "index.html"), "utf8")
]);

if (digest(legacyHome) !== digest(rollbackHome)) {
  throw new Error("The rollback Home differs from the original static index.html.");
}

if (astroHome.includes("data:image") || astroHome.includes(";base64,")) {
  throw new Error("The Astro Home contains embedded base64 media.");
}

for (const href of [
  "/activities.html",
  "/hybrid-sensation.html",
  "/library.html",
  "/map.html",
  "/morphic-realities.html",
  "/robotic-bloom.html"
]) {
  if (!astroHome.includes(href)) throw new Error(`The Astro Home is missing ${href}.`);
}

console.log("Verified Home links, ordinary media and byte-identical legacy routes.");
