// Responsive QA matrix — widths × engines × device descriptors, with screenshots and a contact sheet.
//   npm run qa:responsive -- [url] [--engines=chromium,webkit,firefox] [--no-devices] [--no-extras]
// Default URL is production. Live runs are paced (one load per engine × device class, widths are
// resized in place) so Vercel's bot checkpoint isn't triggered; set QA_PAUSE_MS to tune.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, devices, firefox, webkit } from "@playwright/test";
import { deviceChecks, pageChecks } from "./checks.mjs";
import { OUT_DIR, assertNotChallenged, outPath, settle, targetUrl } from "./lib.mjs";

const args = process.argv.slice(2);
const url = targetUrl(args);
const isLocal = /localhost|127\.0\.0\.1/.test(url);
const PAUSE = Number(process.env.QA_PAUSE_MS ?? (isLocal ? 0 : 2500));
const engineNames = (args.find((a) => a.startsWith("--engines="))?.split("=")[1] ?? "chromium,webkit,firefox").split(",");
const ENGINES = { chromium, webkit, firefox };
// Output folder under scripts/qa/out/ (QA_OUT=responsive-local keeps local runs apart from live ones).
const SUB = process.env.QA_OUT ?? "responsive";

// Width sweep: one page load per engine × group, then resize in place.
const SWEEP = [
  { group: "phone", dpr: 3, touch: true, sizes: [[280, 653], [320, 568], [360, 740], [375, 667], [390, 844], [393, 852], [412, 915], [430, 932]] },
  { group: "phone-land", dpr: 3, touch: true, sizes: [[568, 320], [667, 375], [844, 390], [932, 430]] },
  { group: "tablet", dpr: 2, touch: true, sizes: [[540, 720], [600, 960], [712, 1000], [744, 1133], [768, 1024], [810, 1080], [820, 1180], [834, 1194], [1024, 1366]] },
  { group: "tablet-land", dpr: 2, touch: true, sizes: [[1024, 768], [1133, 744], [1180, 820], [1194, 834], [1366, 1024]] },
  { group: "desktop", dpr: 1, touch: false, sizes: [[1180, 820], [1280, 800], [1366, 768], [1440, 900], [1536, 864], [1680, 1050], [1920, 1080], [2560, 1440]] },
  { group: "edge", dpr: 1, touch: false, sizes: [[767, 900], [768, 900], [1023, 900], [1024, 900], [1279, 900], [1280, 900]] },
  // Browser zoom: 400% of 1280 = 320 (in "phone"), 200% of 1280/1440 = 640/720.
  { group: "zoom", dpr: 2, touch: false, sizes: [[640, 800], [720, 900]] },
];
const DEVICES = ["iPhone SE", "iPhone 15", "iPhone 15 Pro Max", "Pixel 7", "Galaxy S9+", "iPad Mini", "iPad Pro 11", "Galaxy Tab S4"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const record = (row) => {
  results.push(row);
  const status = row.fails.length ? `FAIL ${[...new Set(row.fails.map((f) => f.check))].join(",")}` : "pass";
  console.log(`${row.engine.padEnd(8)} ${row.label.padEnd(34)} ${status}`);
};

/** Navigate, backing off once (6 min) if Vercel's bot checkpoint answers; throws "blocked" after that. */
async function open(page) {
  for (let attempt = 1; ; attempt++) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
    try {
      await assertNotChallenged(page);
      return;
    } catch (e) {
      if (attempt > 1) throw new Error("blocked: " + e.message);
      console.log("  checkpoint served — backing off 6 min");
      await sleep(360_000);
    }
  }
}

async function load(page) {
  await open(page);
  await settle(page);
}

async function shoot(page, file) {
  await page.screenshot({ path: outPath(SUB, file), fullPage: true, scale: "css" });
  return file.replaceAll("\\", "/");
}

async function runSweep(engine, browser) {
  const h1Series = [];
  for (const g of SWEEP) {
    const [w0, h0] = g.sizes[0];
    const context = await browser.newContext({
      viewport: { width: w0, height: h0 },
      deviceScaleFactor: g.dpr,
      hasTouch: g.touch,
      isMobile: g.touch && engine !== "firefox", // Firefox has no isMobile emulation
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await load(page);
    for (const [w, h] of g.sizes) {
      await page.setViewportSize({ width: w, height: h });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      await sleep(250);
      const res = await page.evaluate(pageChecks, { fresh: false });
      if (h <= 500) {
        const hh = await page.evaluate(() => document.querySelector("header")?.getBoundingClientRect().height ?? 0);
        if (hh > 64.5) res.fails.push({ check: "landscape-header", detail: `header ${hh}px tall at ${w}×${h}` });
      }
      const shot = await shoot(page, `${engine}/${g.group}-${w}x${h}.png`);
      h1Series.push({ w, h1: res.info.h1[0], h2: res.info.h2 });
      record({ engine, kind: "sweep", group: g.group, label: `${g.group} ${w}×${h}@${g.dpr}x`, w, h, dpr: g.dpr, fails: res.fails, shot });
    }
    await context.close();
    await sleep(PAUSE);
  }
  // Headline rhythm across the sweep: H1 40→64 and H2 32→40, never shrinking as width grows.
  const series = h1Series.filter((s) => s.h1).sort((a, b) => a.w - b.w);
  const rhythm = [];
  for (let i = 0; i < series.length; i++) {
    const s = series[i];
    if (s.h1 < 39.5 || s.h1 > 64.5) rhythm.push({ check: "h1-scale", detail: `${s.h1}px at ${s.w}` });
    for (const h2 of s.h2) if (h2 < 31.5 || h2 > 40.5) rhythm.push({ check: "h2-scale", detail: `${h2}px at ${s.w}` });
    if (i && s.h1 + 0.5 < series[i - 1].h1) rhythm.push({ check: "h1-scale", detail: `shrinks ${series[i - 1].h1}→${s.h1} at ${s.w}` });
  }
  record({ engine, kind: "rhythm", group: "rhythm", label: "headline scale 280→2560", fails: rhythm });
}

async function runDevices(engine, browser) {
  for (const base of DEVICES) {
    for (const name of [base, `${base} landscape`]) {
      const d = devices[name];
      if (!d) continue;
      const opts = { ...d };
      delete opts.defaultBrowserType; // engine is chosen by the matrix, not the descriptor
      const context = await browser.newContext({ ...opts, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__cls = 0;
        try {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
          }).observe({ type: "layout-shift", buffered: true });
        } catch {
          window.__cls = null; // engine without layout-shift entries
        }
      });
      await open(page);
      const cls = await page.evaluate(() => window.__cls);
      await settle(page);
      const res = await page.evaluate(pageChecks, { fresh: true });
      if (cls !== null && cls > 0.001) res.fails.push({ check: "cls", detail: `CLS ${cls.toFixed(4)}` });
      const { width: w, height: h } = opts.viewport;
      const shot = await shoot(page, `${engine}/device-${name.replaceAll(" ", "_").replace("+", "plus")}.png`);
      record({ engine, kind: "device", group: "device", label: `${name} ${w}×${h}@${opts.deviceScaleFactor}x`, w, h, dpr: opts.deviceScaleFactor, fails: res.fails, shot, cls });
      await context.close();
      await sleep(PAUSE);
    }
  }
}

async function runExtras(engine, browser) {
  // Page-wide CSS/meta checks + mobile sheet in landscape (short height).
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true, isMobile: engine !== "firefox", reducedMotion: "reduce" });
  const page = await context.newPage();
  await load(page);
  const { fails } = await page.evaluate(deviceChecks);

  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(200);
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").waitFor();
  await sleep(400);
  const sheet = await page.evaluate(() => {
    const d = document.querySelector("[role=dialog]");
    const nav = d.querySelector("nav");
    const last = [...d.querySelectorAll("a,button")].pop();
    return {
      panelH: d.getBoundingClientRect().height, vh: innerHeight, scrollY: scrollY,
      navScrolls: /auto|scroll/.test(getComputedStyle(nav).overflowY), navOverflow: nav.scrollHeight > nav.clientHeight,
      lastInView: last.getBoundingClientRect().bottom <= innerHeight + 1,
      locked: getComputedStyle(document.body).overflow === "hidden" || getComputedStyle(document.documentElement).overflow === "hidden",
    };
  });
  await shoot(page, `${engine}/extra-sheet-844x390.png`);
  if (Math.abs(sheet.panelH - sheet.vh) > 1) fails.push({ check: "sheet-height", detail: `panel ${sheet.panelH} vs viewport ${sheet.vh}` });
  if (!sheet.navScrolls) fails.push({ check: "sheet-scroll", detail: "nav does not scroll internally" });
  if (!sheet.lastInView) fails.push({ check: "sheet-scroll", detail: "last action below the fold" });
  if (!sheet.locked) fails.push({ check: "scroll-lock", detail: "page not locked while sheet open" });
  if (sheet.scrollY !== before) fails.push({ check: "scroll-lock", detail: `page jumped ${before}→${sheet.scrollY}` });
  await page.keyboard.press("Escape");

  // Reduced motion: marquee must not keep running.
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations === Infinity).length);
  if (running) fails.push({ check: "reduced-motion", detail: `${running} infinite animation(s) still running` });
  record({ engine, kind: "extra", group: "extra", label: "device CSS + sheet 844×390", fails });
  await context.close();
  await sleep(PAUSE);

  // Text size 150% the way browsers/OSes apply it: a larger *default* font size, so rem sizes AND
  // rem media queries scale (Chromium: CDP Page.setFontSizes; Firefox: font.size pref; WebKit: no equivalent).
  if (engine !== "webkit") {
    for (const [w, h] of [[375, 667], [1280, 800]]) {
      const b = engine === "firefox" ? await firefox.launch({ firefoxUserPrefs: { "font.size.variable.x-western": 24 } }) : browser;
      const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: "reduce" });
      const p = await c.newPage();
      if (engine === "chromium") {
        const cdp = await c.newCDPSession(p);
        await cdp.send("Page.setFontSizes", { fontSizes: { standard: 24 } });
      }
      await load(p);
      const rootPx = await p.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
      const res = await p.evaluate(pageChecks, { fresh: false, touchRules: false });
      const keep = res.fails.filter((f) => ["h-scroll", "overflow", "text-clipped", "text-overlap"].includes(f.check));
      if (rootPx < 23.5) keep.push({ check: "text150-emulation", detail: `root font ${rootPx}px — emulation did not apply` });
      const shot = await shoot(p, `${engine}/extra-text150-${w}.png`);
      record({ engine, kind: "extra", group: "extra", label: `text 150% ${w}×${h}`, fails: keep, shot });
      await c.close();
      if (b !== browser) await b.close();
      await sleep(PAUSE);
    }
  }

  // Windows High Contrast (Chromium only): CTAs keep a boundary, focus stays visible.
  if (engine === "chromium") {
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const c = await browser.newContext({ viewport: { width: w, height: h }, forcedColors: "active", reducedMotion: "reduce" });
      const p = await c.newPage();
      await load(p);
      const fc = [];
      const noEdge = await p.evaluate(() =>
        [...document.querySelectorAll("a.bg-primary, button.bg-primary")]
          .filter((el) => el.checkVisibility() && getComputedStyle(el).borderStyle === "none")
          .map((el) => el.textContent.trim().slice(0, 30)),
      );
      if (noEdge.length) fc.push({ check: "forced-colors", detail: `CTA without border: ${noEdge.join(", ")}` });
      await p.locator('input[type="email"]').focus();
      const ring = await p.evaluate(() => {
        const i = document.querySelector('input[type="email"]');
        const vis = (el) => { const cs = getComputedStyle(el); return cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0; };
        return vis(i) || vis(i.parentElement);
      });
      if (!ring) fc.push({ check: "forced-colors", detail: "newsletter focus has no outline" });
      const shot = await shoot(p, `${engine}/extra-forced-colors-${w}.png`);
      record({ engine, kind: "extra", group: "extra", label: `forced-colors ${w}×${h}`, fails: fc, shot });
      await c.close();
      await sleep(PAUSE);
    }
  }
}

console.log(`Responsive QA → ${url} (engines: ${engineNames.join(", ")}, pause ${PAUSE}ms)`);
for (const name of engineNames) {
  const browser = await ENGINES[name].launch();
  const stages = [
    ["sweep", () => runSweep(name, browser)],
    ["devices", () => (args.includes("--no-devices") || name === "firefox" ? null : runDevices(name, browser))],
    ["extras", () => (args.includes("--no-extras") ? null : runExtras(name, browser))],
  ];
  for (const [stage, run] of stages) {
    try {
      await run();
    } catch (e) {
      // Keep going with the next stage/engine; the cell shows why it has no result.
      record({ engine: name, kind: "error", group: stage, label: `${stage} aborted`, fails: [{ check: "blocked", detail: e.message.split("\n")[0] }] });
    }
  }
  await browser.close();
}

writeFileSync(outPath(SUB, "report.json"), JSON.stringify({ url, at: new Date().toISOString(), results }, null, 1));
writeContactSheet();
const failed = results.filter((r) => r.fails.length);
console.log(`\n${results.length - failed.length}/${results.length} cells pass · contact sheet: ${path.join(OUT_DIR, SUB, "index.html")}`);
process.exitCode = failed.length ? 1 : 0;

function writeContactSheet() {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cards = results
    .filter((r) => r.shot)
    .map((r) => {
      const rel = r.shot;
      const fails = r.fails.map((f) => `<li><b>${esc(f.check)}</b> ${esc(f.detail)}</li>`).join("");
      return `<figure class="${r.fails.length ? "bad" : "ok"}" data-engine="${r.engine}"><a href="${rel}" target="_blank"><img loading="lazy" src="${rel}" alt=""></a>
<figcaption><span class="tag">${esc(r.engine)}</span> ${esc(r.label)} ${r.fails.length ? `<ul>${fails}</ul>` : "✓"}</figcaption></figure>`;
    })
    .join("\n");
  const rows = results.filter((r) => !r.shot).map((r) => `<li class="${r.fails.length ? "bad" : "ok"}">${esc(r.engine)} · ${esc(r.label)} ${r.fails.length ? r.fails.map((f) => `<b>${esc(f.check)}</b> ${esc(f.detail)}`).join("; ") : "✓"}</li>`).join("");
  const html = `<!doctype html><meta charset="utf-8"><title>WorkUp responsive QA</title>
<style>body{font:14px/1.4 system-ui;margin:16px;background:#f6f7fb;color:#1a151a}h1{font-size:20px}
.filters button{margin-right:6px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;align-items:start}
figure{margin:0;background:#fff;border:2px solid #d0d5dd;border-radius:8px;overflow:hidden}figure.bad{border-color:#ae1d12}
figure img{display:block;width:100%;height:260px;object-fit:cover;object-position:top}
figcaption{padding:6px 8px;font-size:12px}figcaption ul{margin:4px 0 0;padding-left:16px;color:#ae1d12}.tag{font-weight:600}
li.bad{color:#ae1d12}</style>
<h1>WorkUp responsive QA — ${esc(url)}</h1><p>${esc(new Date().toISOString())} · ${results.filter((r) => !r.fails.length).length}/${results.length} cells pass</p>
<div class="filters">${["all", ...engineNames].map((e) => `<button onclick="document.querySelectorAll('figure').forEach(f=>f.hidden=!('${e}'==='all'||f.dataset.engine==='${e}'))">${e}</button>`).join("")}
<button onclick="document.querySelectorAll('figure').forEach(f=>f.hidden=!f.classList.contains('bad'))">failures only</button></div>
<ul>${rows}</ul><div class="grid">${cards}</div>`;
  writeFileSync(outPath(SUB, "index.html"), html);
}
