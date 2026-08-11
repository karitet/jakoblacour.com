import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const copiedLegacyPages = [
  "hybrid-sensation.html",
  "map.html",
  "morphic-realities.html",
  "robotic-bloom.html"
];
const rollbackPages = ["index.html", "activities.html", "library.html"];

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

for (const page of copiedLegacyPages) {
  const [source, built] = await Promise.all([
    readFile(resolve(root, page)),
    readFile(resolve(root, "dist", page))
  ]);
  if (digest(source) !== digest(built)) throw new Error(`${page} changed while copying to dist.`);
}

for (const page of rollbackPages) {
  const [source, rollback] = await Promise.all([
    readFile(resolve(root, page)),
    readFile(resolve(root, "dist", "legacy", page))
  ]);
  if (digest(source) !== digest(rollback)) {
    throw new Error(`The rollback ${page} differs from the original static page.`);
  }
}

const [astroHome, astroActivities, astroLibrary, legacyActivities, legacyLibrary] = await Promise.all([
  readFile(resolve(root, "dist", "index.html"), "utf8"),
  readFile(resolve(root, "dist", "activities.html"), "utf8"),
  readFile(resolve(root, "dist", "library.html"), "utf8"),
  readFile(resolve(root, "activities.html"), "utf8"),
  readFile(resolve(root, "library.html"), "utf8")
]);

if (astroHome.includes("data:image") || astroHome.includes(";base64,")) {
  throw new Error("The Astro Home contains embedded base64 media.");
}

for (const key of [
  "site.title",
  "home.intro",
  "home.now_label",
  "contact.title",
  "contact.summary",
  "contact.email",
  "contact.phone"
]) {
  if (!astroHome.includes(`data-site-content=\"${key}\"`)) {
    throw new Error(`The Astro Home is missing the static Site Content fallback for ${key}.`);
  }
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

if (digest(astroActivities) === digest(legacyActivities)) {
  throw new Error("The Astro Activities route was replaced by the legacy source.");
}

if (!astroActivities.includes('data-source-state="loading"')) {
  throw new Error("The Astro Activities route is missing its static live-data shell.");
}

if (!astroActivities.includes('data-site-content="site.title"')) {
  throw new Error("The Astro Activities route is missing its static Site Content site-title fallback.");
}

if (digest(astroLibrary) === digest(legacyLibrary)) {
  throw new Error("The Astro Library route was replaced by the legacy source.");
}

if (!astroLibrary.includes('data-source-state="loading"')) {
  throw new Error("The Astro Library route is missing its static live-data shell.");
}

if (!astroLibrary.includes('data-site-content="site.title"')) {
  throw new Error("The Astro Library route is missing its static Site Content site-title fallback.");
}

if (!astroLibrary.includes("Saved public record")) {
  throw new Error("The Astro Library route is missing its static fallback orientation.");
}

console.log("Verified Astro routes, ordinary media and byte-identical legacy rollback pages.");
