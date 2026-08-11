import assert from "node:assert/strict";
import test from "node:test";
import {
  WORK_SOURCE_PRECEDENCE,
  WORK_SOURCES,
  publishedWorks,
  publicArchiveSources,
  validateWorksCatalog,
  workBySlug
} from "../src/data/works.mjs";

test("Works catalog is internally consistent and source-aware", () => {
  assert.equal(validateWorksCatalog(), true);
  assert.deepEqual(WORK_SOURCE_PRECEDENCE, [
    "direct_approved_correction",
    "approved_context",
    "current_site_implementation",
    "wordpress_archive"
  ]);
  assert.ok(WORK_SOURCES.some((source) => source.visibility === "internal"));
  assert.ok(WORK_SOURCES.some((source) => source.visibility === "public"));
});

test("Hybrid Sensation reconciles the original and Tour Edition as one work family", () => {
  const work = workBySlug("hybrid-sensation");

  assert.ok(work);
  assert.equal(work.familyId, "family-hybrid-sensation");
  assert.equal(work.editions.length, 2);
  assert.equal(work.editions[0].id, "hybrid-sensation-original-2023");
  assert.equal(work.editions[1].id, "hybrid-sensation-tour-edition-2026");
  assert.equal(work.currentOrientation.value, "In circulation");
  assert.equal(work.legacyHref, "/hybrid-sensation.html");
});

test("Only deliberately publishable works and public WordPress sources reach the prototype", () => {
  const [work] = publishedWorks();
  const archiveSources = publicArchiveSources(work);

  assert.equal(publishedWorks().every((item) => item.publicationStatus === "publish"), true);
  assert.equal(archiveSources.length, 4);
  assert.equal(archiveSources.every((source) => source.visibility === "public"), true);
  assert.equal(archiveSources.every((source) => source.url.startsWith("https://jakoblacour.com/")), true);
});
