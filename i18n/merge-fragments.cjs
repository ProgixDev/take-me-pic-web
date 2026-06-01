#!/usr/bin/env node
/**
 * Merge i18n/fragments/*.json (produced by the localize workflow) into
 * i18n/dictionaries/translations.ts. New French keys are appended before the
 * closing brace; keys already present in translations.ts are skipped so the
 * hand-curated header/footer/map entries always win.
 *
 * Usage: node i18n/merge-fragments.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TRANS = path.join(ROOT, "i18n/dictionaries/translations.ts");
const FRAG_DIR = path.join(ROOT, "i18n/fragments");

const ts = fs.readFileSync(TRANS, "utf8");

// Collect fragment entries.
const files = fs.existsSync(FRAG_DIR)
  ? fs.readdirSync(FRAG_DIR).filter((f) => f.endsWith(".json"))
  : [];

/**
 * Tolerant fallback parser for fragments with unescaped inner quotes.
 * Fragments are uniformly formatted: objects with "fr"/"en"/"es"/"ar" string
 * fields, one field per line. We grab everything between the first `: "` and
 * the last `"` on the line, so inner quotes survive.
 */
function looseParse(text) {
  const out = [];
  let cur = null;
  const fieldRe = /^\s*"(fr|en|es|ar)"\s*:\s*"(.*)"\s*,?\s*$/;
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (t === "{") {
      cur = {};
      continue;
    }
    if (t.startsWith("}")) {
      if (cur && cur.fr) out.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;
    const m = fieldRe.exec(line);
    if (m) cur[m[1]] = m[2];
  }
  return out;
}

/** fr -> {en, es, ar} (first occurrence wins) */
const incoming = new Map();
let parsed = 0;
let bad = 0;
for (const f of files) {
  const p = path.join(FRAG_DIR, f);
  const raw = fs.readFileSync(p, "utf8");
  let arr;
  try {
    arr = JSON.parse(raw);
  } catch (e) {
    arr = looseParse(raw);
    if (arr.length) {
      console.warn(`~ recovered ${f} via loose parse (${arr.length} entries): ${e.message}`);
    } else {
      console.warn(`! could not parse ${f}: ${e.message}`);
      bad++;
      continue;
    }
  }
  if (!Array.isArray(arr)) continue;
  for (const e of arr) {
    if (!e || typeof e.fr !== "string" || !e.fr.trim()) continue;
    if (!incoming.has(e.fr)) {
      incoming.set(e.fr, {
        en: typeof e.en === "string" ? e.en : e.fr,
        es: typeof e.es === "string" ? e.es : e.fr,
        ar: typeof e.ar === "string" ? e.ar : e.fr,
      });
      parsed++;
    }
  }
}

// Which keys already exist in translations.ts? Match lines: `  "KEY": {`
const existing = new Set();
const keyRe = /^\s*("(?:[^"\\]|\\.)*")\s*:\s*\{/gm;
let m;
while ((m = keyRe.exec(ts))) {
  try {
    existing.add(JSON.parse(m[1]));
  } catch {
    /* ignore */
  }
}

// Build TS lines for genuinely-new keys.
const lines = [];
let added = 0;
let skipped = 0;
for (const [fr, v] of incoming) {
  if (existing.has(fr)) {
    skipped++;
    continue;
  }
  const k = JSON.stringify(fr);
  const en = JSON.stringify(v.en);
  const es = JSON.stringify(v.es);
  const ar = JSON.stringify(v.ar);
  lines.push(`  ${k}: { en: ${en}, es: ${es}, ar: ${ar} },`);
  added++;
}

if (!lines.length) {
  console.log(
    `No new keys. fragments=${files.length} parsedEntries=${parsed} existing=${existing.size} skipped=${skipped} bad=${bad}`
  );
  process.exit(0);
}

// Insert before the final closing brace of the object literal.
const marker = "\n};";
const idx = ts.lastIndexOf(marker);
if (idx === -1) {
  console.error("Could not find closing '};' in translations.ts");
  process.exit(1);
}

const block =
  "\n  // ---------------------------------------------------------------- Pages (auto-merged)\n" +
  lines.join("\n") +
  "\n";
const next = ts.slice(0, idx) + block + ts.slice(idx);
fs.writeFileSync(TRANS, next, "utf8");

console.log(
  `Merged. fragments=${files.length} parsedEntries=${parsed} added=${added} skipped(existing)=${skipped} bad=${bad}`
);
