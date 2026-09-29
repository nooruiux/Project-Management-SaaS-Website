// Width × engine pass/fail table from a responsive report (markdown).
//   node scripts/qa/table.mjs [responsive|responsive-local]
import { readFileSync } from "node:fs";
import { outPath } from "./lib.mjs";

const sub = process.argv[2] ?? "responsive";
const { url, at, results } = JSON.parse(readFileSync(outPath(sub, "report.json"), "utf8"));
const engines = [...new Set(results.map((r) => r.engine))];
const rows = new Map();
for (const r of results) {
  const key = r.label.replace(/@[\d.]+x$/, "");
  if (!rows.has(key)) rows.set(key, {});
  rows.get(key)[r.engine] = r.fails.length ? [...new Set(r.fails.map((f) => f.check))].join(", ") : "✅";
}
console.log(`${url} · ${at}\n`);
console.log(`| Cell | ${engines.join(" | ")} |\n|---|${engines.map(() => "---").join("|")}|`);
for (const [key, cells] of rows) console.log(`| ${key} | ${engines.map((e) => cells[e] ?? "—").join(" | ")} |`);
