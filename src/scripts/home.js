import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../config/data-sources.mjs";
import {
  currentActivities,
  parseActivitiesCsv,
  parseReelCsv,
  weightedShuffle
} from "../lib/public-data.mjs";
import { loadSiteContent } from "../lib/site-content.mjs";

const forcedFallback = new URLSearchParams(window.location.search).get("data") === "fallback";

async function fetchText(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

function createNowItem(item) {
  const row = document.createElement("div");
  row.className = "now-item";

  const when = document.createElement("span");
  when.className = "when";
  when.textContent = item.year || "Now";

  const what = document.createElement("span");
  what.className = "what";
  const title = document.createElement("b");
  title.textContent = item.job;

  if (item.url) {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.append(title);
    what.append(link);
  } else {
    what.append(title);
  }

  row.append(when, what);
  return row;
}

async function loadNow() {
  const feed = document.querySelector("#now-feed");
  const note = document.querySelector("#now-source-note");
  if (!(feed instanceof HTMLElement) || !(note instanceof HTMLElement)) return;

  if (forcedFallback) {
    note.textContent = "Saved orientation";
    return;
  }

  try {
    const csv = await fetchText(DATA_SOURCES.activities.url);
    const activities = currentActivities(parseActivitiesCsv(csv));
    if (activities.length === 0) throw new Error("No current activities");

    feed.replaceChildren(...activities.map(createNowItem));
    feed.dataset.sourceState = "live";
    note.textContent = "";
  } catch (error) {
    feed.dataset.sourceState = "fallback";
    note.textContent = "Saved orientation";
    console.warn("Now source unavailable; retaining saved orientation.", error);
  }
}

function safeEmail(value) {
  const email = String(value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function safePhone(value) {
  const phone = String(value ?? "").trim();
  const compact = phone.replace(/[\s().-]/g, "");
  return /^\+?\d{3,15}$/.test(compact) ? { phone, compact } : null;
}

function setContentText(key, value) {
  const target = document.querySelector(`[data-site-content="${key}"]`);
  if (!target) return false;
  target.textContent = value;
  return true;
}

function applySiteContent(values) {
  let applied = 0;

  for (const [key, value] of Object.entries(values)) {
    if (key === "contact.email") {
      const target = document.querySelector('[data-site-content="contact.email"]');
      const email = safeEmail(value);
      if (target instanceof HTMLAnchorElement && email) {
        target.href = `mailto:${email}`;
        target.textContent = email;
        applied += 1;
      } else if (!email) {
        console.warn("Site Content contact.email is invalid; retaining the static contact address.");
      }
      continue;
    }

    if (key === "contact.phone") {
      const target = document.querySelector('[data-site-content="contact.phone"]');
      const phone = safePhone(value);
      if (target instanceof HTMLAnchorElement && phone) {
        target.href = `tel:${phone.compact}`;
        target.textContent = phone.phone;
        applied += 1;
      } else if (!phone) {
        console.warn("Site Content contact.phone is invalid; retaining the static contact number.");
      }
      continue;
    }

    if (setContentText(key, value)) applied += 1;
  }

  return applied;
}

async function loadHomeSiteContent() {
  if (forcedFallback) {
    console.info("Site Content source paused by ?data=fallback; retaining static Home content.");
    return;
  }

  const result = await loadSiteContent({
    source: DATA_SOURCES.siteContent,
    fetchText
  });

  if (result.sourceState === "fallback") {
    console.warn("Site Content source unavailable; retaining static Home content.", result.error);
    return;
  }

  const applied = applySiteContent(result.liveValues);
  console.info(`Site Content loaded; applied ${applied} field(s).`);
}

function mediaProvider(source) {
  try {
    const url = new URL(source);
    if (url.hostname.includes("vimeo.com")) return "vimeo";
    if (url.hostname.includes("youtube.com") || url.hostname === "youtu.be") return "youtube";
    return "video";
  } catch {
    return "video";
  }
}

function videoId(source) {
  try {
    const url = new URL(source);
    if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function vimeoId(source) {
  try {
    return new URL(source).pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part)) || "";
  } catch {
    return "";
  }
}

function sizeFrame(frame, aspect) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (viewportWidth / viewportHeight > aspect) {
    frame.style.width = `${viewportWidth}px`;
    frame.style.height = `${viewportWidth / aspect}px`;
  } else {
    frame.style.height = `${viewportHeight}px`;
    frame.style.width = `${viewportHeight * aspect}px`;
  }
}

function makeMedia(item) {
  const provider = mediaProvider(item.src);
  if (provider === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (item.poster) video.poster = item.poster;
    return { element: video, provider };
  }

  const frame = document.createElement("iframe");
  const id = provider === "youtube" ? videoId(item.src) : vimeoId(item.src);
  if (!id) throw new Error(`Unsupported ${provider} URL`);

  const embed = provider === "youtube"
    ? new URL(`https://www.youtube.com/embed/${id}`)
    : new URL(`https://player.vimeo.com/video/${id}`);
  embed.searchParams.set("autoplay", "1");
  embed.searchParams.set(provider === "youtube" ? "mute" : "muted", "1");
  embed.searchParams.set("controls", "0");
  embed.searchParams.set("playsinline", "1");

  frame.src = embed.toString();
  frame.title = item.title;
  frame.allow = "autoplay; fullscreen";
  sizeFrame(frame, item.aspect);
  const resize = () => sizeFrame(frame, item.aspect);
  window.addEventListener("resize", resize, { passive: true });
  frame.addEventListener("load", () => frame.dataset.loaded = "true", { once: true });

  return { element: frame, provider, cleanup: () => window.removeEventListener("resize", resize) };
}

function updateCaption(item) {
  const caption = document.querySelector("#reel-caption");
  if (!(caption instanceof HTMLElement)) return;

  const label = item.link ? document.createElement("a") : document.createElement("span");
  label.textContent = item.title;
  if (label instanceof HTMLAnchorElement) {
    label.href = item.link;
    label.target = "_blank";
    label.rel = "noopener";
  }
  caption.replaceChildren(label);
}

function playVideoSegment(video, item) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.pause();
      resolve();
    };
    const start = () => {
      if (item.start > 0 && video.duration > item.start) video.currentTime = item.start;
      video.play().catch(() => {});
    };
    const tick = () => {
      if (item.end !== null && video.currentTime >= item.end) finish();
    };

    video.addEventListener("loadedmetadata", start, { once: true });
    video.addEventListener("timeupdate", tick);
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });

    if (video.readyState >= 1) start();
    window.setTimeout(finish, Math.max(8000, ((item.end ?? item.start + 18) - item.start) * 1000 + 2000));
  });
}

async function runReel(items) {
  const layers = [document.querySelector("#reel-a"), document.querySelector("#reel-b")];
  if (!layers.every((layer) => layer instanceof HTMLElement)) return;

  const playlist = weightedShuffle(items);
  let active = 0;
  let index = -1;

  while (playlist.length > 0) {
    index = (index + 1) % playlist.length;
    const item = playlist[index];
    const next = (active + 1) % 2;
    const layer = layers[next];
    const previous = layers[active];
    let media;

    try {
      media = makeMedia(item);
    } catch (error) {
      console.warn("Skipping unsupported reel item.", error);
      continue;
    }

    layer.replaceChildren(media.element);
    updateCaption(item);
    previous.classList.remove("is-active");
    layer.classList.add("is-active");
    active = next;

    if (media.provider === "video") {
      await playVideoSegment(media.element, item);
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, ((item.end ?? item.start + 18) - item.start) * 1000));
    }

    media.cleanup?.();
    await new Promise((resolve) => window.setTimeout(resolve, 200));
  }
}

async function loadReel() {
  const caption = document.querySelector("#reel-caption");
  if (forcedFallback) {
    if (caption instanceof HTMLElement) caption.textContent = "Living media field · saved still";
    return;
  }

  try {
    const csv = await fetchText(DATA_SOURCES.homeVideo.url);
    const items = parseReelCsv(csv);
    if (items.length === 0) throw new Error("No publishable media rows");
    void runReel(items);
  } catch (error) {
    if (caption instanceof HTMLElement) caption.textContent = "Living media field · saved still";
    console.warn("Video source unavailable; retaining saved still.", error);
  }
}

function setupPanels() {
  const scrim = document.querySelector("#scrim");
  const panels = [...document.querySelectorAll("[data-panel]")];
  const openers = [...document.querySelectorAll("[data-open]")];
  let returnFocus = null;

  const closeAll = () => {
    panels.forEach((panel) => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    });
    openers.forEach((opener) => opener.setAttribute("aria-expanded", "false"));
    scrim?.classList.remove("is-visible");
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  };

  const openPanel = (name, opener) => {
    const panel = panels.find((candidate) => candidate.getAttribute("data-panel") === name);
    if (!(panel instanceof HTMLElement)) return;

    panels.forEach((candidate) => {
      candidate.classList.remove("is-open");
      candidate.setAttribute("aria-hidden", "true");
    });
    openers.forEach((candidate) => candidate.setAttribute("aria-expanded", "false"));

    returnFocus = opener;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    opener.setAttribute("aria-expanded", "true");
    scrim?.classList.add("is-visible");
    panel.querySelector("[data-close]")?.focus();
  };

  openers.forEach((opener) => {
    opener.addEventListener("click", () => openPanel(opener.getAttribute("data-open"), opener));
  });
  document.querySelectorAll("[data-close]").forEach((closer) => closer.addEventListener("click", closeAll));
  scrim?.addEventListener("click", closeAll);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}

setupPanels();
void Promise.allSettled([loadNow(), loadReel(), loadHomeSiteContent()]);
