import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const legacy = resolve(dist, "legacy");
const copiedLegacyPages = [
  "hybrid-sensation.html",
  "map.html",
  "morphic-realities.html",
  "robotic-bloom.html"
];
const rollbackPages = ["index.html", "activities.html", "library.html"];

await mkdir(legacy, { recursive: true });

for (const page of copiedLegacyPages) {
  await copyFile(resolve(root, page), resolve(dist, page));
}

for (const page of rollbackPages) {
  await copyFile(resolve(root, page), resolve(legacy, page));
}

console.log(`Copied ${copiedLegacyPages.length} unchanged legacy routes and ${rollbackPages.length} rollback pages.`);
