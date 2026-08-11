import assert from "node:assert/strict";
import test from "node:test";
import {
  PUBLIC_CATALOG_VERSION,
  createPublicCatalog,
  validatePublicCatalog
} from "../src/data/public-catalog.v0.1.mjs";

test("Public Catalog v0.1 is a generated, publishable work projection", () => {
  const catalog = createPublicCatalog();

  assert.equal(validatePublicCatalog(catalog), true);
  assert.equal(catalog.version, PUBLIC_CATALOG_VERSION);
  assert.equal(catalog.entries.length, 1);
  assert.equal(catalog.entries[0].id, "work-hybrid-sensation");
  assert.equal(catalog.entries[0].reviewHref, "/works/hybrid-sensation.html");
  assert.equal(catalog.entries[0].stableHref, "/hybrid-sensation.html");
});

test("Public Catalog excludes internal provenance and unresolved hero-credit state", () => {
  const serialized = JSON.stringify(createPublicCatalog());

  assert.equal(serialized.includes("sourceIds"), false);
  assert.equal(serialized.includes("requires_jakob"), false);
  assert.equal(serialized.includes("MyContext/"), false);
});
