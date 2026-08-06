import test from "node:test";
import assert from "node:assert/strict";
import {
  currentActivities,
  parseActivitiesCsv,
  parseCsv,
  parseReelCsv,
  safePublicUrl,
  weightedShuffle
} from "../src/lib/public-data.mjs";

test("CSV parser preserves quoted commas and escaped quotes", () => {
  const rows = parseCsv('title,caption\n"Field, one","A ""quoted"" note"\n');
  assert.deepEqual(rows, [
    ["title", "caption"],
    ["Field, one", 'A "quoted" note']
  ]);
});

test("reel parser accepts aliases and only publishes safe media", () => {
  const csv = [
    "name,video,image,href,in,out,priority,publish,ratio",
    "Visible,https://example.com/a.mp4,https://example.com/a.jpg,https://example.com/work,2,9,2,publish,1.5",
    "Draft,https://example.com/b.mp4,,,,,,draft,",
    "Unsafe,javascript:alert(1),,,,,,publish,"
  ].join("\n");

  assert.deepEqual(parseReelCsv(csv), [{
    title: "Visible",
    src: "https://example.com/a.mp4",
    poster: "https://example.com/a.jpg",
    link: "https://example.com/work",
    start: 2,
    end: 9,
    weight: 2,
    aspect: 1.5
  }]);
});

test("activities parser finds headers below introductory rows", () => {
  const csv = [
    "Public activities",
    "Job title,Year,Production company,URL,Category,Selected,Status",
    "Hyperspectral,2027,Jakob la Cour,https://example.com/h,Artistical,yes,upcoming",
    "Past work,2020,Company,,Educational,no,past"
  ].join("\n");

  const current = currentActivities(parseActivitiesCsv(csv));
  assert.equal(current.length, 1);
  assert.equal(current[0].job, "Hyperspectral");
  assert.equal(current[0].selected, true);
});

test("unsafe public protocols are rejected", () => {
  assert.equal(safePublicUrl("javascript:alert(1)"), "");
  assert.equal(safePublicUrl("https://example.com"), "https://example.com");
  assert.equal(safePublicUrl("/activities.html"), "/activities.html");
});

test("weighted shuffle repeats rows according to weight", () => {
  const result = weightedShuffle([
    { title: "A", weight: 2 },
    { title: "B", weight: 1 }
  ], () => 0.5);
  assert.equal(result.filter((item) => item.title === "A").length, 2);
  assert.equal(result.filter((item) => item.title === "B").length, 1);
});
