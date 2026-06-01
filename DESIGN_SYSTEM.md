# Take Me Pic Web — build brief for page authors

You are building pages for the **Take Me Pic** web app (marketing site + admin
console) in `/Users/achrafarabi/Dev/Take/web`. Next.js 16 (App Router, Turbopack),
React 19, TypeScript, Tailwind v4. Aesthetic = **carnet de voyage** (vintage
travel journal): warm paper, wax stamps, polaroids, gold accents, French copy.

## NON-NEGOTIABLE RULES
1. **French UI copy** everywhere (the app is French-first). Keep it warm and playful.
2. **Reuse the shared components — never reinvent.** Import from `@/components/ui`,
   `@/components/admin/AdminPage`, `@/components/marketing/MarketingBits`.
3. **Mock data only** from `@/lib/data`. No backend, no fetch, no Supabase.
4. **Next.js 16 dynamic routes:** make interactive pages `"use client"` and read
   route params with `useParams()` / `useSearchParams()` from `next/navigation`.
   Do NOT destructure async `params`/`searchParams` props. Example:
   ```tsx
   "use client";
   import { useParams } from "next/navigation";
   export default function Page() { const { id } = useParams<{ id: string }>(); ... }
   ```
5. **Every button/list/modal must work** (client state). No dead `href="#"`. Use
   `<Link>` from `next/link` for navigation, `useState` for modals/tabs/filters,
   and `useToast().push("...")` for actions like save/delete/ban.
6. Colors via Tailwind tokens only: `bg-paper bg-paper-warm bg-card bg-polaroid
   bg-ink text-ink text-ink-faded text-gold-deep bg-gold-light bg-stamp-red
   bg-stamp-blue bg-stamp-green bg-sunset bg-bg-1`. Fonts via
   the arbitrary class font-[family-name_var(--font-NAME)] where NAME is exactly
   one of serif / hand / type / mono (pick one, never combine).
   Utility classes: `.paper` (grain), `.squiggle`, `.shadow-ink`, `.shadow-ink-sm`,
   `.shadow-gold`, `.shadow-soft`, `.map-hand`, `.stagger`, `.animate-fade-up`.
7. Icons: `lucide-react`. Charts: `recharts` (admin analytics only).

## SHARED COMPONENT API (import { X } from "@/components/ui")
- `Button` — props: variant `ink|gold|paper|ghost|danger`, size `sm|md|lg`, full, icon, trailing.
- `PaperCard` — props: shadow `ink|gold|red|blue|soft|none`, tilt (deg), border.
- `Stamp` — children (string, supports \n), color `red|blue|green|gold|ink|white`,
  shape `circle|rect|octagon`, size, rotate, fontSize.
- `Polaroid` — src, caption, width, height, tilt, captionSize, dark.
- `Chip` — color `ink|gold|red|blue|green`, variant `outline|filled|dashed`, size, mono, onClick.
- `Badge` — tone `neutral|green|red|blue|gold|sunset`, dot. (status pills for tables)
- `Modal` — open, onClose, title, footer, size `sm|md|lg|xl`. Controlled by `useState`.
- `Ticket` — children, dark, notch. (perforated ticket/boarding-pass look)
- `Tape` — color `cream|red|blue`, width, height, rotate. (decorative)
- `Avatar` — src, size, online, ring.
- `DataTable<T>` — props: columns `Column<T>[]`, rows, onRowClick, searchable,
  searchPlaceholder, pageSize, empty. Column = { key, header, cell?(row), sortValue?(row), align? }.
- `StatCard` — label, value, delta (e.g. "+12 %"), icon, tone.
- `SectionHeading` — eyebrow, title, highlight, sub, center.
- `Tabs` — tabs `{key,label}[]`, value, onChange. (controlled)
- `Toggle` / `ToggleField` — switch (ToggleField self-manages state).
- `Input` / `Textarea` / `Select` — label prop; styled form fields.
- `useToast()` → `.push(msg, "ok"|"info"|"err")`.

## MARKETING helpers (import from "@/components/marketing/MarketingBits")
- `PageHero` — eyebrow, title, highlight, sub, stamp.
- `Breadcrumb` — items `{href?,label}[]`.
- `CtaBand` — drop-in bottom call-to-action band.
Marketing pages live in `app/(marketing)/...` and automatically get the site
header + footer from the group layout. Wrap page content in
`<div className="mx-auto max-w-7xl px-5 py-12">`.

## ADMIN helper (import { AdminPage } from "@/components/admin/AdminPage")
- `AdminPage` — title, eyebrow, breadcrumb `{href?,label}[]`, actions (node), children.
Admin pages live in `app/admin/...` and get the sidebar + topbar from the group
layout. Start every admin page with `<AdminPage title=... breadcrumb=...>`.

## DATA (import from "@/lib/data")
users, getUser(id); sessions, getSession(id); posts, getPost(id); spots, getSpot(id);
reports, getReport(id); payments, getPayment(id); subscriptions; bookings, getBooking(id);
adminNotifications; badges; leaderboard; analytics (kpis, growth, byCity, engagement,
retention, revenueSplit); tickets, getTicket(id); auditLog; guides, getGuide(id);
blogPosts, getBlogPost(slug); stories, getStory(slug); jobs, getJob(slug);
press, getPress(slug); helpArticles, getHelpArticle(slug), helpCategories; team;
plans; fmtNum(n); fmtEur(n). Types: AdminUser, PhotoSession, CommunityPost, PhotoSpot,
Report, Payment, Subscription, Booking, Ticket, Guide, BlogPost, Story, Job, etc.

## QUALITY BAR
Pixel-faithful to the carnet aesthetic. Generous spacing, stamps/tape/polaroids used
tastefully. Every page must `next build` cleanly: valid TSX, all imports resolve,
no unused-but-typed errors that break build. Prefer `"use client"` for any page with
interactivity (most of them).
