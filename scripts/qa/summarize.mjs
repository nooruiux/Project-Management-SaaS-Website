// Summarize a responsive report: one line per distinct failure, with the cells it hits.
//   node scripts/qa/summarize.mjs [responsive|responsive-local]
import { readFileSync } from "node:fs";
import { outPath } from "./lib.mjs";

const sub = process.argv[2] ?? "responsive";
const { url, results } = JSON.parse(readFileSync(outPath(sub, "report.json"), "utf8"));
const agg = new Map();
for (const row of results) {
  for (const f of row.fails) {
    const key = `${f.check} | ${f.detail.replace(/\d+(\.\d+)?×\d+(\.\d+)?|\d+(\.\d+)?px|\d+ch\/line.*|spans.*|\d+w for \d+px.*|scrollWidth.*|\(\d+ > \d+\)|at \d+.*$|\d{3,4}\b/g, "#")}`;
    if (!agg.has(key)) agg.set(key, []);
    agg.get(key).push(`${row.engine[0]}:${row.w ?? row.label}`);
  }
}
console.log(`${url} — ${results.filter((r) => !r.fails.length).length}/${results.length} cells pass`);
for (const [k, cells] of [...agg].sort()) console.log(`${k.slice(0, 100).padEnd(100)} ×${cells.length}  ${[...new Set(cells)].slice(0, 8).join(" ")}`);
