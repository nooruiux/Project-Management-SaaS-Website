// Desktop 1440 is the only Figma frame, so it is locked while responsive work happens.
//   node scripts/qa/lock-1440.mjs capture [url]   → writes the baseline (do this once, on the known-good build)
//   node scripts/qa/lock-1440.mjs diff [url]      → re-captures and diffs against the baseline (must stay ≤ 0.1%)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { assertNotChallenged, outPath, settle, targetUrl } from "./lib.mjs";

const LIMIT = 0.1; // percent
const mode = process.argv[2];
const url = targetUrl();
const baselineFile = outPath("baseline-1440.png");

async function capture(file) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await assertNotChallenged(page);
  await settle(page);
  await page.screenshot({ path: file, fullPage: true });
  await browser.close();
}

if (mode === "capture") {
  await capture(baselineFile);
  console.log(`baseline captured from ${url} → ${baselineFile}`);
} else if (mode === "diff") {
  if (!existsSync(baselineFile)) throw new Error("No baseline — run `capture` first");
  const currentFile = outPath("current-1440.png");
  await capture(currentFile);
  const a = PNG.sync.read(readFileSync(baselineFile));
  const b = PNG.sync.read(readFileSync(currentFile));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`FAIL size changed: baseline ${a.width}×${a.height}, current ${b.width}×${b.height} (${url})`);
    process.exit(1);
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  writeFileSync(outPath("diff-1440.png"), PNG.sync.write(diff));
  const pct = (100 * n) / (a.width * a.height);
  console.log(`${pct <= LIMIT ? "PASS" : "FAIL"} 1440 diff ${pct.toFixed(4)}% (${n} px of ${a.width}×${a.height}) vs baseline — ${url}`);
  process.exit(pct <= LIMIT ? 0 : 1);
} else {
  console.log("usage: node scripts/qa/lock-1440.mjs capture|diff [url]");
  process.exit(2);
}
