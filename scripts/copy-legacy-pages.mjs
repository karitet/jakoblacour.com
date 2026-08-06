import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const legacy = resolve(dist, "legacy");
const legacyPages = [
  "activities.html",
  "hybrid-sensation.html",
  "library.html",
  "map.html",
  "morphic-realities.html",
  "robotic-bloom.html"
];

await mkdir(legacy, { recursive: true });
await copyFile(resolve(root, "index.html"), resolve(legacy, "index.html"));

for (const page of legacyPages) {
  await copyFile(resolve(root, page), resolve(dist, page));
}

console.log(`Copied ${legacyPages.length} unchanged legacy routes and the rollback home.`);
