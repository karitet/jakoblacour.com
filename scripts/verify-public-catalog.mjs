import { createPublicCatalog, validatePublicCatalog } from "../src/data/public-catalog.v0.1.mjs";

const catalog = createPublicCatalog();
validatePublicCatalog(catalog);
console.log(`Validated Public Catalog v${catalog.version} with ${catalog.entries.length} entry.`);
