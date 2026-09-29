// Shared helpers for the QA scripts (Playwright).
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const QA_DIR = path.dirname(fileURLToPath(import.meta.url));
export const OUT_DIR = path.join(QA_DIR, "out");
export const LIVE_URL = "https://project-management-saa-s-website.vercel.app/";

export function outPath(...parts) {
  const p = path.join(OUT_DIR, ...parts);
  mkdirSync(path.dirname(p), { recursive: true });
  return p;
}

/** Target URL: first CLI arg that looks like a URL, else QA_URL, else production. */
export function targetUrl(argv = process.argv.slice(2)) {
  return argv.find((a) => /^https?:\/\//.test(a)) ?? process.env.QA_URL ?? LIVE_URL;
}

/** Vercel's bot checkpoint answers automated bursts with a 403 page — fail loudly instead of "passing" it. */
export async function assertNotChallenged(page) {
  const title = await page.title();
  if (/security checkpoint/i.test(title)) throw new Error("Vercel Security Checkpoint served — back off and retry later");
  // Guard against measuring a browser error page (dead server) or the wrong route.
  if (!(await page.locator("#hero-title").count())) throw new Error(`not the WorkUp home page (title "${title}")`);
}

/**
 * Settle a loaded page for measurement/screenshots: scroll through it so lazy images load,
 * return to the top, then wait for fonts and every <img> to finish.
 */
export async function settle(page, { step = 600, pause = 80 } = {}) {
  await page.evaluate(
    async ({ step, pause }) => {
      const h = () => document.documentElement.scrollHeight;
      for (let y = 0; y < h(); y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, pause));
      }
      window.scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((img) =>
          img.complete ? 0 : new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); setTimeout(r, 8000); }),
        ),
      );
      await new Promise((r) => setTimeout(r, 400));
    },
    { step, pause },
  );
}
