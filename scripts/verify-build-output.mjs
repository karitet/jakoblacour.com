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

const [astroHome, astroActivities, astroLibrary, workDossier, publicCatalogBytes, legacyActivities, legacyLibrary] = await Promise.all([
  readFile(resolve(root, "dist", "index.html"), "utf8"),
  readFile(resolve(root, "dist", "activities.html"), "utf8"),
  readFile(resolve(root, "dist", "library.html"), "utf8"),
  readFile(resolve(root, "dist", "works", "hybrid-sensation.html"), "utf8"),
  readFile(resolve(root, "dist", "catalog", "works.v0.1.json"), "utf8"),
  readFile(resolve(root, "activities.html"), "utf8"),
  readFile(resolve(root, "library.html"), "utf8")
]);

const publicCatalog = JSON.parse(publicCatalogBytes);

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

if (!workDossier.includes('/media/works/hybrid-sensation-stage.jpg')) {
  throw new Error("The Hybrid Sensation work dossier is missing its local media asset.");
}

if (!workDossier.includes("saved local image unavailable")) {
  throw new Error("The Hybrid Sensation work dossier is missing its local-media fallback.");
}

if (workDossier.includes("https://jakoblacour.com/wp-content/")) {
  throw new Error("The Hybrid Sensation work dossier still embeds WordPress media.");
}

if (!workDossier.includes("Source trail") || !workDossier.includes("/hybrid-sensation.html")) {
  throw new Error("The Hybrid Sensation work dossier is missing source or legacy-route orientation.");
}

for (const section of ["Situation", "Form", "Trace", "Transmission"]) {
  if (!workDossier.includes(section)) throw new Error(`The Hybrid Sensation work dossier is missing ${section}.`);
}

if (publicCatalog.schema !== "jakoblacour.public-catalog" || publicCatalog.version !== "0.1") {
  throw new Error("The generated Public Catalog has an unexpected schema or version.");
}

if (publicCatalog.entries.length !== 1 || publicCatalog.entries[0].id !== "work-hybrid-sensation") {
  throw new Error("The generated Public Catalog is missing the Hybrid Sensation entry.");
}

if (publicCatalogBytes.includes("sourceIds") || publicCatalogBytes.includes("requires_jakob")) {
  throw new Error("The generated Public Catalog exposes internal or unresolved work data.");
}

console.log("Verified Astro routes, local work media, Public Catalog and byte-identical legacy rollback pages.");
