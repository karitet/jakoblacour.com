import test from "node:test";
import assert from "node:assert/strict";
import { LIBRARY_FALLBACK_ITEMS } from "../src/data/library-fallback.mjs";
import {
  activityMatchesFilter,
  activityYearKey,
  currentActivities,
  libraryMatchesFilter,
  libraryTypes,
  parseActivitiesCsv,
  parseCsv,
  parseLibraryCsv,
  parseReelCsv,
  safePublicUrl,
  sortLibraryItems,
  sortActivities,
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
  assert.equal(current[0].category, "Artistical");
});

test("activity helpers preserve the legacy filters and sort order", () => {
  const activities = [
    { job: "Zeta", year: "2024", category: "Educational", selected: false },
    { job: "Alpha", year: "2027–", category: "Artistical", selected: true },
    { job: "Beta", year: "2026", category: "Artistical", selected: false }
  ];

  assert.deepEqual(
    sortActivities(activities, "year-desc").map((item) => item.job),
    ["Alpha", "Beta", "Zeta"]
  );
  assert.deepEqual(
    sortActivities(activities, "title-asc").map((item) => item.job),
    ["Alpha", "Beta", "Zeta"]
  );
  assert.equal(activityMatchesFilter(activities[1], "selected"), true);
  assert.equal(activityMatchesFilter(activities[0], "Artistical"), false);
  assert.equal(activityYearKey("2027–"), "2027");
});

test("activity year sorts place unknown and invalid years after valid years", () => {
  const activities = [
    { job: "Unknown year", year: "?" },
    { job: "Older work", year: "2024" },
    { job: "Invalid year", year: "TBD" },
    { job: "Newer work", year: "2026" }
  ];

  assert.deepEqual(
    sortActivities(activities, "year-asc").map((item) => item.job),
    ["Older work", "Newer work", "Unknown year", "Invalid year"]
  );
  assert.deepEqual(
    sortActivities(activities, "year-desc").map((item) => item.job),
    ["Newer work", "Older work", "Unknown year", "Invalid year"]
  );
});

test("library parser preserves the published schema, link safety and publication gate", () => {
  const csv = [
    "Library record",
    "Title,Type,Date,URL,Outlet,Language,Status,Project,Quote,External ID",
    "A quoted document,Press mention,2025.8.3,https://example.com/article,Example Press,EN,publish,Hybrid Sensation,Visible quote,ref-1",
    "Unpublished document,Newsletter,2024-04-02,https://example.com/draft,Studio,EN,planned,,,"
  ].join("\n");

  assert.deepEqual(parseLibraryCsv(csv), [{
    title: "A quoted document",
    type: "Press mention",
    date: "2025-08-03",
    url: "https://example.com/article",
    outlet: "Example Press",
    language: "EN",
    project: "Hybrid Sensation",
    quote: "Visible quote",
    externalId: "ref-1",
    status: "publish"
  }]);
});

test("saved Library fallback remains a publishable, useful record", () => {
  assert.equal(LIBRARY_FALLBACK_ITEMS.length, 13);
  assert.equal(LIBRARY_FALLBACK_ITEMS.every((item) => item.title && item.type && item.date), true);
  assert.equal(
    LIBRARY_FALLBACK_ITEMS.every((item) => !item.url || safePublicUrl(item.url) === item.url),
    true
  );
});

test("library helpers preserve filters and deterministic date, type and title sorting", () => {
  const items = [
    { title: "Zulu", type: "Newsletter", date: "?" },
    { title: "Alpha", type: "Press mention", date: "2025-08-30" },
    { title: "Beta", type: "Counselling", date: "2024-01-01" }
  ];

  assert.deepEqual(libraryTypes(items), ["Counselling", "Newsletter", "Press mention"]);
  assert.equal(libraryMatchesFilter(items[0], "Newsletter"), true);
  assert.equal(libraryMatchesFilter(items[0], "all"), true);
  assert.deepEqual(
    sortLibraryItems(items, "date-desc").map((item) => item.title),
    ["Alpha", "Beta", "Zulu"]
  );
  assert.deepEqual(
    sortLibraryItems(items, "date-asc").map((item) => item.title),
    ["Beta", "Alpha", "Zulu"]
  );
  assert.deepEqual(
    sortLibraryItems(items, "type-asc").map((item) => item.title),
    ["Beta", "Zulu", "Alpha"]
  );
  assert.deepEqual(
    sortLibraryItems(items, "title-asc").map((item) => item.title),
    ["Alpha", "Beta", "Zulu"]
  );
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
