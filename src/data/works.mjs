const fact = (value, sourceIds, status = "verified") => ({
  value,
  sourceIds,
  status
});

export const WORK_SOURCE_PRECEDENCE = Object.freeze([
  "direct_approved_correction",
  "approved_context",
  "current_site_implementation",
  "wordpress_archive"
]);

export const WORK_SOURCES = Object.freeze([
  {
    id: "mycontext-projects-2026-08-09",
    kind: "approved_context",
    visibility: "internal",
    label: "Approved current project direction",
    reference: "MyContext/projects/README.md",
    reviewedAt: "2026-08-09"
  },
  {
    id: "mycontext-works-2026-08-07",
    kind: "approved_context",
    visibility: "internal",
    label: "Works-family reconciliation",
    reference: "MyContext/profile/works-and-activities.md",
    reviewedAt: "2026-08-07"
  },
  {
    id: "wordpress-selected-work-2026-08-11",
    kind: "wordpress_archive",
    visibility: "public",
    label: "Selected Work archive",
    url: "https://jakoblacour.com/work/",
    accessedAt: "2026-08-11"
  },
  {
    id: "wordpress-hybrid-sensation-2026-08-11",
    kind: "wordpress_archive",
    visibility: "public",
    label: "Hybrid Sensation archive dossier",
    url: "https://jakoblacour.com/lens_portfolio/hybrid-sensation/",
    accessedAt: "2026-08-11"
  },
  {
    id: "wordpress-hybrid-tour-2026-08-11",
    kind: "wordpress_archive",
    visibility: "public",
    label: "Hybrid Sensation — Tour Edition archive dossier",
    url: "https://jakoblacour.com/lens_portfolio/hybrid-sensation-tour-edition/",
    accessedAt: "2026-08-11"
  },
  {
    id: "wordpress-hybrid-tour-alias-2026-08-11",
    kind: "wordpress_archive",
    visibility: "public",
    label: "Hybrid Sensation — Tour Edition historical URL alias",
    url: "https://jakoblacour.com/work/hybrid-sensation-tour-edition/",
    accessedAt: "2026-08-11"
  }
]);

const hybridSensation = {
  id: "work-hybrid-sensation",
  slug: "hybrid-sensation",
  publicationStatus: "publish",
  catalogStatus: "review_candidate",
  reviewHref: "/works/hybrid-sensation.html",
  stableHref: "/hybrid-sensation.html",
  stableRouteStatus: "preserved_pending_jakob_review",
  familyId: "family-hybrid-sensation",
  familyTitle: fact(
    "Hybrid Sensation",
    ["mycontext-works-2026-08-07", "wordpress-hybrid-sensation-2026-08-11"]
  ),
  title: fact(
    "Hybrid Sensation",
    ["mycontext-works-2026-08-07", "wordpress-hybrid-sensation-2026-08-11"]
  ),
  workType: fact("Mixed-reality performance", ["wordpress-hybrid-sensation-2026-08-11"], "historical"),
  currentOrientation: fact("In circulation", ["mycontext-projects-2026-08-09"], "approved_current"),
  summary: fact(
    "An immersive mixed-reality performance that opens new sensory perceptions through a participatory encounter between physical and meta-real space.",
    ["wordpress-hybrid-sensation-2026-08-11"],
    "historical"
  ),
  situation: fact(
    "Participants enter a shared sensory environment where virtual reality, bodies, light, sound and touch meet through active, non-verbal participation.",
    ["wordpress-hybrid-sensation-2026-08-11"],
    "editorial_synthesis"
  ),
  hero: {
    src: "/media/works/hybrid-sensation-stage.jpg",
    width: 800,
    height: 640,
    alt: "A participant wearing a reflective virtual-reality headset in darkness."
  },
  hero_credit_status: "requires_jakob",
  hero_credit_blocker: "Confirm the photographer from a primary source or replace the hero before stable-route promotion.",
  editions: [
    {
      id: "hybrid-sensation-original-2023",
      title: fact("Original work", ["wordpress-hybrid-sensation-2026-08-11"], "historical"),
      descriptor: fact(
        "A 40-minute mixed-reality performance and futuristic initiation ritual for the hybrid reality body.",
        ["wordpress-hybrid-sensation-2026-08-11"],
        "historical"
      ),
      facts: [
        {
          label: "Premiere",
          detail: fact(
            "30 October 2023 · The Royal Danish Theatre",
            ["wordpress-hybrid-sensation-2026-08-11"],
            "historical"
          )
        },
        {
          label: "Duration",
          detail: fact("40 minutes", ["wordpress-hybrid-sensation-2026-08-11"], "historical")
        },
        {
          label: "Production",
          detail: fact("Jakob la Cour Studio", ["wordpress-hybrid-sensation-2026-08-11"], "historical")
        }
      ],
      credits: [
        { role: "Artistic direction and concept", people: ["Jakob la Cour"] },
        { role: "Set and costume design", people: ["Frederikke Krogh"] },
        { role: "Composition and sound design", people: ["Julie Østengaard"] },
        { role: "VR art", people: ["Matias Brunacci", "Jakob la Cour"] },
        { role: "VR technician and tone master", people: ["Frederik la Cour"] },
        { role: "Light design", people: ["Frederikke Krogh", "Jakob la Cour"] },
        { role: "Costumier", people: ["Siri Viola Nysom Sandhagen"] },
        { role: "Production assistant", people: ["Nadia Mamchyts"] },
        { role: "Producer, production manager and PR", people: ["Anne Mai Slot Vilmann"] },
        { role: "Dramaturgical consulting", people: ["Kirsten Dehlholm", "Marie Dahl"] },
        { role: "Caretaker", people: ["Dreeas Vilas Nicolai Asmussen"] },
        { role: "Graphics and poster design", people: ["Jakob la Cour"] },
        { role: "Documentary and videography", people: ["Jacob Hesselberg"] },
        { role: "Video trailer", people: ["Søren Meisner"] }
      ].map((credit) => ({ ...credit, sourceIds: ["wordpress-hybrid-sensation-2026-08-11"] })),
      audience: [
        fact("16+", ["wordpress-hybrid-sensation-2026-08-11"], "historical"),
        fact(
          "Includes multisensory interaction, virtual reality, haze, darkness, participation, strong smells, strobe lights, physical contact and ceremonial drink.",
          ["wordpress-hybrid-sensation-2026-08-11"],
          "historical"
        )
      ]
    },
    {
      id: "hybrid-sensation-tour-edition-2026",
      title: fact(
        "Tour Edition",
        ["mycontext-works-2026-08-07", "wordpress-hybrid-tour-2026-08-11"]
      ),
      descriptor: fact(
        "A semi-automated, tour-ready edition that builds on the 2023 original work.",
        ["wordpress-hybrid-tour-2026-08-11"],
        "historical"
      ),
      facts: [
        {
          label: "Duration",
          detail: fact("30 minutes", ["wordpress-hybrid-tour-2026-08-11"], "historical")
        },
        {
          label: "Format",
          detail: fact(
            "Semi-automated VR installation with live host and technician",
            ["wordpress-hybrid-tour-2026-08-11"],
            "historical"
          )
        },
        {
          label: "Capacity",
          detail: fact(
            "8 participants per run; scalable to venue setup",
            ["wordpress-hybrid-tour-2026-08-11"],
            "historical"
          )
        },
        {
          label: "Space",
          detail: fact(
            "Black box or flexible space; minimum 7 × 7 metres; blackout recommended",
            ["wordpress-hybrid-tour-2026-08-11"],
            "historical"
          )
        }
      ],
      credits: [
        { role: "Artistic direction and concept", people: ["Jakob la Cour"] },
        { role: "Scenography", people: ["Frederikke Krogh"] },
        { role: "Sound", people: ["Based on original work by Julie Østengaard; adapted for touring version"] },
        { role: "VR art and interaction design", people: ["Jakob la Cour"] },
        { role: "VR development", people: ["Mattias Brunacci", "Harm van de Ven"] },
        { role: "Host", people: ["Frederikke Hooge"] },
        { role: "Technician", people: ["Will Zawistowski"] },
        { role: "Dramaturgical advice", people: ["Marie Dahl", "Kirsten Dehlholm (original version)"] },
        { role: "Documentation and video", people: ["Jacob Hesselberg"] },
        { role: "Production", people: ["Jakob la Cour Studio"] }
      ].map((credit) => ({ ...credit, sourceIds: ["wordpress-hybrid-tour-2026-08-11"] })),
      audience: [
        fact("English voice-over; no spoken dialogue", ["wordpress-hybrid-tour-2026-08-11"], "historical"),
        fact(
          "The work involves walking and periods of prolonged standing. Seating and assistance are available on request; the archive describes the edition as wheelchair accessible.",
          ["wordpress-hybrid-tour-2026-08-11"],
          "historical"
        ),
        fact(
          "Includes VR headsets, haze, spatial sound, darkness, strong scents and flashing or strobe lights. The archive advises against attendance for people with photosensitive epilepsy or severe motion sensitivity.",
          ["wordpress-hybrid-tour-2026-08-11"],
          "historical"
        )
      ],
      historicalDates: [
        { venue: "KU.BE", date: "27 January 2026" },
        { venue: "Sydhavn Teater", date: "4–5 February 2026" },
        { venue: "Limfjordsteatret", date: "18 February 2026" },
        { venue: "H2O", date: "5–6 March 2026" },
        { venue: "Aveny-T", date: "24–25 March 2026" }
      ].map((event) => ({ ...event, sourceIds: ["wordpress-hybrid-tour-2026-08-11"] }))
    }
  ],
  reviews: [
    {
      publication: "Iscene",
      rating: "★★★★☆☆",
      title: "Hybrid Sensation – farvestrålende, sanselig VR-indvielse",
      url: "https://iscene.dk/2023/11/01/hybrid-sensation-sanselig-vr-indvielse/",
      sourceIds: ["wordpress-hybrid-sensation-2026-08-11"]
    },
    {
      publication: "Sceneblog",
      rating: "★★★★",
      title: "HYBRID SENSATION // Jakob la Cour Studio",
      url: "https://sceneblog.dk/anmeldelse-hybrid-sensation-jakob-la-cour-studio-kselekt-i-skuespilhuset-det-kongelige-teater/",
      sourceIds: ["wordpress-hybrid-sensation-2026-08-11"]
    },
    {
      publication: "Den 4. Væg",
      title: "Hybrid Sensation",
      url: "https://www.den4vaeg.dk/anmeldelser/hybridsensation",
      sourceIds: ["wordpress-hybrid-sensation-2026-08-11"]
    },
    {
      publication: "Bastard.blog",
      title: "HYBRID SENSATION – virtual reality og scenekunst",
      url: "https://bastard.blog/hybrid-sensation-virtual-reality-og-scenekunst/",
      sourceIds: ["wordpress-hybrid-sensation-2026-08-11"]
    }
  ],
  archiveSourceIds: [
    "wordpress-selected-work-2026-08-11",
    "wordpress-hybrid-sensation-2026-08-11",
    "wordpress-hybrid-tour-2026-08-11",
    "wordpress-hybrid-tour-alias-2026-08-11"
  ],
  legacyHref: "/hybrid-sensation.html",
  reconciliationNotes: [
    "Hybrid Sensation and Tour Edition are one work family, not two unrelated signature works.",
    "The two public Tour Edition URLs differ in support and credit details. Disputed or one-sided additions are held out of this record until separately verified."
  ]
};

export const WORKS = Object.freeze([hybridSensation]);

export function publishedWorks() {
  return WORKS.filter((work) => work.publicationStatus === "publish");
}

export function workBySlug(slug) {
  return publishedWorks().find((work) => work.slug === slug);
}

export function sourceById(id) {
  return WORK_SOURCES.find((source) => source.id === id);
}

export function publicArchiveSources(work) {
  return work.archiveSourceIds
    .map((id) => sourceById(id))
    .filter((source) => source?.visibility === "public");
}

function visitFacts(value, callback) {
  if (Array.isArray(value)) {
    value.forEach((item) => visitFacts(item, callback));
    return;
  }

  if (!value || typeof value !== "object") return;

  if (Object.hasOwn(value, "value") && Object.hasOwn(value, "sourceIds") && Object.hasOwn(value, "status")) {
    callback(value);
  }

  Object.values(value).forEach((item) => visitFacts(item, callback));
}

export function validateWorksCatalog() {
  const sourceIds = new Set(WORK_SOURCES.map((source) => source.id));
  const workIds = new Set();
  const slugs = new Set();

  for (const work of WORKS) {
    if (workIds.has(work.id)) throw new Error(`Duplicate work id: ${work.id}`);
    if (slugs.has(work.slug)) throw new Error(`Duplicate work slug: ${work.slug}`);
    if (work.publicationStatus !== "publish") throw new Error(`${work.id}: unsupported publication status.`);
    if (!work.familyId) throw new Error(`${work.id}: a work family is required.`);
    if (!work.legacyHref.startsWith("/")) throw new Error(`${work.id}: legacy href must be root-relative.`);
    if (work.reviewHref !== `/works/${work.slug}.html`) {
      throw new Error(`${work.id}: review route does not match the stable slug.`);
    }
    if (work.stableHref !== work.legacyHref) throw new Error(`${work.id}: stable and legacy routes diverged.`);
    if (work.hero_credit_status !== "requires_jakob" && work.hero_credit_status !== "verified") {
      throw new Error(`${work.id}: unsupported hero credit status.`);
    }

    workIds.add(work.id);
    slugs.add(work.slug);

    for (const archiveSourceId of work.archiveSourceIds) {
      const source = sourceById(archiveSourceId);
      if (!source || source.visibility !== "public" || !source.url?.startsWith("https://")) {
        throw new Error(`${work.id}: invalid public archive source ${archiveSourceId}.`);
      }
    }

    visitFacts(work, (item) => {
      if (!item.status || item.sourceIds.length === 0) {
        throw new Error(`${work.id}: every source-aware fact needs status and source ids.`);
      }

      for (const sourceId of item.sourceIds) {
        if (!sourceIds.has(sourceId)) throw new Error(`${work.id}: unknown source ${sourceId}.`);
      }
    });

    for (const edition of work.editions) {
      for (const credit of edition.credits) {
        for (const sourceId of credit.sourceIds) {
          if (!sourceIds.has(sourceId)) throw new Error(`${work.id}: unknown credit source ${sourceId}.`);
        }
      }
    }
  }

  return true;
}
