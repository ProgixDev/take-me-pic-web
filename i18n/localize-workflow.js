export const meta = {
  name: 'localize-marketing',
  description: 'Wrap visible French strings in t() across public marketing pages and emit en/es/ar translations',
  phases: [{ title: 'Localize', detail: 'one agent per page/component' }],
}

// Absolute paths of the public marketing files to localize.
const FILES = [
  "app/(marketing)/about/page.tsx",
  "app/(marketing)/about/story/page.tsx",
  "app/(marketing)/about/team/page.tsx",
  "app/(marketing)/about/values/page.tsx",
  "app/(marketing)/ambassadors/page.tsx",
  "app/(marketing)/blog/[slug]/page.tsx",
  "app/(marketing)/blog/page.tsx",
  "app/(marketing)/careers/[slug]/page.tsx",
  "app/(marketing)/careers/page.tsx",
  "app/(marketing)/community-guidelines/page.tsx",
  "app/(marketing)/contact/page.tsx",
  "app/(marketing)/download/page.tsx",
  "app/(marketing)/features/ai-helper/page.tsx",
  "app/(marketing)/features/community/page.tsx",
  "app/(marketing)/features/discover/page.tsx",
  "app/(marketing)/features/family/page.tsx",
  "app/(marketing)/features/itinerary/page.tsx",
  "app/(marketing)/features/karma/page.tsx",
  "app/(marketing)/features/page.tsx",
  "app/(marketing)/features/premium/page.tsx",
  "app/(marketing)/features/safety/page.tsx",
  "app/(marketing)/features/spots/page.tsx",
  "app/(marketing)/help/[category]/page.tsx",
  "app/(marketing)/help/article/[slug]/page.tsx",
  "app/(marketing)/help/page.tsx",
  "app/(marketing)/how-it-works/page.tsx",
  "app/(marketing)/legal/cookies/page.tsx",
  "app/(marketing)/legal/gdpr/page.tsx",
  "app/(marketing)/legal/privacy/page.tsx",
  "app/(marketing)/legal/terms/page.tsx",
  "app/(marketing)/login/page.tsx",
  "app/(marketing)/page.tsx",
  "app/(marketing)/partners/page.tsx",
  "app/(marketing)/press/[slug]/page.tsx",
  "app/(marketing)/press/page.tsx",
  "app/(marketing)/pricing/page.tsx",
  "app/(marketing)/sitemap-page/page.tsx",
  "app/(marketing)/spots-vitrine/page.tsx",
  "app/(marketing)/status/page.tsx",
  "app/(marketing)/stories/[slug]/page.tsx",
  "app/(marketing)/stories/page.tsx",
  "components/marketing/MarketingBits.tsx",
]

const ROOT = "/Users/achrafarabi/Dev/Take/web"

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    file: { type: "string" },
    wrapped: { type: "number", description: "count of strings wrapped in t()" },
    fragmentWritten: { type: "boolean" },
    notes: { type: "string", description: "anything skipped or noteworthy, one line" },
  },
  required: ["file", "wrapped", "fragmentWritten", "notes"],
}

function slug(file) {
  return file
    .replace("app/(marketing)/", "")
    .replace("components/marketing/", "cmp-")
    .replace(/\.tsx$/, "")
    .replace(/[\/\[\]]/g, "-")
}

function prompt(file) {
  const abs = `${ROOT}/${file}`
  const fragment = `${ROOT}/i18n/fragments/${slug(file)}.json`
  return `You are localizing ONE file of a Next.js (app router) marketing site for "Take Me Pic", a travel-photography app. The site's source language is FRENCH. We localize by wrapping every user-visible French string in a translator call \`t("…")\`, then providing en/es/ar translations.

TARGET FILE: ${abs}

## Step 1 — Read the file.

## Step 2 — Edit the file to wrap visible French UI text in t().

Rules for WHAT to wrap (user-visible display text only):
- JSX text nodes (text between tags).
- String-valued display props: title, subtitle, sub, eyebrow, highlight, label, caption, heading, desc, description, placeholder, cta, alt, aria-label, and similar.
- Items of arrays that are clearly display copy (e.g. a list of feature titles/descriptions rendered to the page).

Do NOT wrap (leave exactly as-is):
- className, href, src, id, keys, ref names, color/variant/tone/shape enum values, icon component names, font-family strings like "var(--font-serif)".
- Numbers, dates, prices, brand name "Take Me Pic", URLs, emails.
- Anything already inside a t(...) call.
- Text rendered from data fields (e.g. \`{post.title}\`, \`{spot.name}\`, \`story.body\`) — that is dynamic content, skip it. Only wrap STATIC literals written in the JSX.

How to wrap:
- Simple text:  \`Les spots\`  →  \`{t("Les spots")}\`  (in JSX), or for a prop  \`title="Les spots"\`  →  \`title={t("Les spots")}\`.
- Use DOUBLE quotes for the t() key. French strings often contain apostrophes (’ or ') — that's fine inside double quotes. If the French string itself contains a double quote, use single quotes for the t() argument or escape it.
- Template literals with interpolation: \`{\`${'${'}n} spots validés\`}\` → \`{t("{{n}} spots validés", { n })}\`. The key uses {{name}} placeholders; pass the values as the second arg. If a template is too complex to convert safely, leave it unwrapped and mention it in notes.
- Keep punctuation, symbols and emojis (★ ✦ ☼ 🌅 → etc.) inside the wrapped string exactly as they appear.

Wiring:
- Ensure the file starts with \`"use client";\` (add it as the very first line if missing — required for the t() hook).
- Add \`import { useT } from "@/i18n/I18nProvider";\` with the other imports (once).
- Inside EACH component function that renders wrapped text, add \`const t = useT();\` as the first statement of the function body (once per component). Top-level page component AND any sub-components defined in the file that render wrapped text each need their own \`const t = useT();\`.
- Keep the diff minimal and the TSX valid. Do not reformat unrelated code.

## Step 3 — Write a translation fragment.

Write a JSON file to EXACTLY this path: ${fragment}
Content: a JSON array of objects, one per DISTINCT French string you wrapped, each shaped:
  { "fr": "<the exact French key you passed to t()>", "en": "<English>", "es": "<Spanish>", "ar": "<Arabic>" }

Translation guidance:
- Tone: warm, friendly, travel "carnet de voyage" vibe — match the playful French.
- Keep {{placeholders}}, symbols and emojis identical across all languages.
- Arabic is real Modern Standard Arabic (the site renders it RTL). Do not transliterate; translate properly. Keep Latin brand names/numbers as-is.
- The "fr" value MUST be byte-for-byte identical to the key you used in t() (same apostrophe character, same punctuation), so the runtime lookup matches.
- Do NOT include strings you did not wrap.

If the file has NO wrappable French UI text, make no code edits and write an empty array [] to the fragment path.

Return the structured result (file, wrapped count, fragmentWritten, notes).`
}

phase('Localize')
const results = await parallel(
  FILES.map((file) => () =>
    agent(prompt(file), {
      label: slug(file),
      phase: 'Localize',
      schema: SCHEMA,
      model: 'sonnet',
    })
  )
)

const ok = results.filter(Boolean)
const totalWrapped = ok.reduce((n, r) => n + (r.wrapped || 0), 0)
log(`Localized ${ok.length}/${FILES.length} files · ${totalWrapped} strings wrapped`)

return {
  files: ok.length,
  totalWrapped,
  perFile: ok.map((r) => ({ file: r.file, wrapped: r.wrapped, fragment: r.fragmentWritten, notes: r.notes })),
}
