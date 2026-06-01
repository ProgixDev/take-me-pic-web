# Take Me Pic — Web (landing + admin)

The marketing site and admin console for Take Me Pic, in the same
**carnet-de-voyage** aesthetic as the mobile app (warm paper, wax stamps,
polaroids, gold accents, French-first copy). **107 routes**, fully clickable,
**no backend** — everything runs on the mock data layer.

## Stack
- **Next.js 16** (App Router, Turbopack by default) · React 19 · TypeScript
- **Tailwind v4** (CSS `@theme` tokens mirroring the app's `theme/tokens.ts`)
- Fonts via `next/font/google`: Fraunces, Caveat, Special Elite, DM Mono
- `lucide-react` icons · `recharts` for admin analytics

## Run
```bash
npm install      # .npmrc sets legacy-peer-deps for a transitive recharts/react-dom peer
npm run dev      # http://localhost:3000
npm run build    # production build (Turbopack)
npm run start
```

## Structure
```
app/
  (marketing)/        # 42 routes — public site (header + footer layout)
    page.tsx          # home
    how-it-works, features/* (10), pricing, download, login, signup,
    about/* (4), careers + careers/[slug], blog + blog/[slug],
    stories + stories/[slug], help + help/[category] + help/article/[slug],
    contact, status, legal/* (4), press + press/[slug], partners,
    ambassadors, community-guidelines, sitemap-page, spots-vitrine
  admin/              # 65 routes — console (sidebar + topbar layout)
    page.tsx          # dashboard
    analytics/* (7), users/* (5) + family/* (2), sessions/requests/bookings (6),
    community/* + spots/* (9), moderation/* + karma/badges/leaderboard (9),
    premium/* + payments/* (7), content/notifications/support/audit-log (10),
    settings/* (9) + profile

components/
  ui/                 # shared kit: Button, PaperCard, Stamp, Polaroid, Chip,
                      # Modal, Badge, Ticket, Tape, Avatar, DataTable, StatCard,
                      # SectionHeading, Tabs, Toggle, Input/Textarea/Select, Toast
  marketing/          # SiteHeader, SiteFooter, PageHero, Breadcrumb, CtaBand
  admin/              # AdminSidebar, AdminTopbar, AdminPage
lib/
  data.ts             # all mock data + types (users, sessions, posts, spots,
                      # reports, payments, subscriptions, bookings, tickets,
                      # auditLog, analytics, blog, stories, jobs, press, help…)
  cn.ts
app/globals.css       # carnet theme tokens, paper grain, stamp shadows, animations
DESIGN_SYSTEM.md      # the brief every page was built against
```

## Conventions
- Interactive pages are `"use client"`; dynamic routes read params with
  `useParams()` (Next 16 made `params` async — this avoids it).
- All actions (save / delete / ban / approve / send) are wired with React state
  and surface a toast via `useToast()`. Modals, tabs, filters, search, sort and
  pagination all work client-side over the mock data.
- To connect a real backend later, replace the exports in `lib/data.ts` with
  fetchers — pages import by name, so the change stays local.

## Notes
- `next build` is clean (one CSS optimizer artifact — a font token copied
  literally from the brief — was fixed).
- The illustrated maps are reproduced with the `.map-hand` CSS backdrop so map
  views keep the hand-drawn "carte au trésor" look without a real map provider.
- Entry to the admin console: `/admin`. Public site root: `/`.
