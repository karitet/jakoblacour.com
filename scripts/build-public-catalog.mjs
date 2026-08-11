import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createPublicCatalog, validatePublicCatalog } from "../src/data/public-catalog.v0.1.mjs";

const root = resolve(import.meta.dirname, "..");
const catalog = createPublicCatalog();

validatePublicCatalog(catalog);
await mkdir(resolve(root, "dist", "catalog"), { recursive: true });
await writeFile(
  resolve(root, "dist", "catalog", "works.v0.1.json"),
  `${JSON.stringify(catalog, null, 2)}\n`
);

console.log(`Built Public Catalog v${catalog.version} with ${catalog.entries.length} entry.`);
