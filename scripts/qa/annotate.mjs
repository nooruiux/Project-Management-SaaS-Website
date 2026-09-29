// CI helper: publish a responsive report as GitHub annotations + job summary.
// Annotations are readable through the public check-runs API, so results can be pulled without a token.
//   node scripts/qa/annotate.mjs [responsive]
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { outPath } from "./lib.mjs";

const sub = process.argv[2] ?? "responsive";
const file = outPath(sub, "report.json");
if (!existsSync(file)) {
  console.log("::error title=responsive-qa::no report.json — the matrix did not finish");
  process.exit(1);
}
const { url, results } = JSON.parse(readFileSync(file, "utf8"));
const enc = (s) => s.replaceAll("%", "%25").replaceAll("\r", "").replaceAll("\n", "%0A");

const pass = results.filter((r) => !r.fails.length).length;
const lines = [`${pass}/${results.length} cells pass — ${url}`];
const agg = new Map();
for (const r of results) {
  for (const f of r.fails) {
    const key = `${f.check} | ${f.detail.replace(/\d+(\.\d+)?×\d+(\.\d+)?|\d+(\.\d+)?px|\d+ch\/line.*|spans.*|\d+w for \d+px.*|scrollWidth.*|\(\d+ > \d+\)|at \d+.*$|\d{3,4}\b/g, "#")}`;
    if (!agg.has(key)) agg.set(key, new Set());
    agg.get(key).add(`${r.engine}:${r.w ?? r.label}`);
  }
}
for (const [k, cells] of agg) lines.push(`${k.slice(0, 110)} ×${cells.size}  ${[...cells].slice(0, 8).join(" ")}`);

// One notice with the whole summary (≤ 64 KB), plus per-cell status so the table can be rebuilt remotely.
console.log(`::notice title=responsive-qa summary::${enc(lines.join("\n"))}`);
const cells = results.map((r) => `${r.engine}\t${r.label}\t${r.fails.length ? [...new Set(r.fails.map((f) => f.check))].join(",") : "pass"}`);
console.log(`::notice title=responsive-qa cells::${enc(cells.join("\n"))}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Responsive QA\n\n\`\`\`\n${lines.join("\n")}\n\`\`\`\n`);
}
process.exit(pass === results.length ? 0 : 1);
