export const meta = {
  name: "tmp-web-pages",
  description: "Build 110+ landing + admin pages for Take Me Pic web against the shared carnet design system",
  phases: [
    { title: "Landing", detail: "marketing site routes", model: "sonnet" },
    { title: "Admin", detail: "admin console routes", model: "sonnet" },
  ],
};

const BRIEF = `You are building pages for the Take Me Pic web app in /Users/achrafarabi/Dev/Take/web.
STEP 1 (required): Read /Users/achrafarabi/Dev/Take/web/DESIGN_SYSTEM.md IN FULL before writing anything. It documents every shared component, the data layer, the color/font tokens, and the hard rules.
STEP 2: Create EXACTLY the files listed below, each a complete, production-quality Next.js 16 page in the carnet-de-voyage aesthetic (warm paper, wax stamps, polaroids, gold accents), with French UI copy.
HARD RULES (repeat of the brief — do not violate):
- Reuse shared components from @/components/ui, @/components/admin/AdminPage, @/components/marketing/MarketingBits. Do NOT modify shared components, layouts, globals.css, or lib/data.ts. Only CREATE the page files listed (you may add small local sub-components inside the SAME file).
- Mock data only, imported from @/lib/data. No fetch, no backend.
- For dynamic routes ([id]/[slug]) make the page "use client" and read params via useParams() from next/navigation. Never destructure async params props.
- Every button, tab, filter, modal and list must actually work using React useState. Navigation uses <Link> from next/link. Use useToast().push("…") for create/save/delete/ban/approve actions. No href="#" dead links.
- Pages must compile: valid TSX, all imports resolve, no stray undefined identifiers.
- Make pages genuinely rich and substantial — real sections, real tables/cards populated from the mock data, realistic French content. Not stubs.
Return your result as the structured output: the list of file paths you created and a one-line note.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    files: { type: "array", items: { type: "string" } },
    notes: { type: "string" },
  },
  required: ["files", "notes"],
};

const clusters = [
  // ============================== LANDING ==============================
  {
    phase: "Landing",
    label: "landing:home+howto+features",
    spec: `Create:
1. app/(marketing)/page.tsx — THE HOME PAGE. "use client". A showstopper landing: big hero ("On se prend en photo ?" with a squiggle highlight on "en photo", subtitle, two CTAs to /download and /how-it-works, a tilted Polaroid cluster + a couple of Stamps + Tape as decoration). Then sections: (a) "comment ça marche" 3-step strip using PaperCards (trouver → demander → sourire) with lucide icons; (b) a "carte du quartier" teaser using a div with className="map-hand" + a few absolutely-positioned Avatar pins and a Stamp; (c) feature grid (4-6 PaperCards linking to /features/...); (d) karma/community band on bg-ink with stats from analytics.kpis (fmtNum); (e) testimonials row from stories (Polaroid + quote); (f) finish with <CtaBand/>. Use SectionHeading, stagger animations. Import data from @/lib/data.
2. app/(marketing)/how-it-works/page.tsx — PageHero + a numbered vertical journey (5-6 steps) each as a PaperCard with a Stamp number, lucide icon, French explanation; an FAQ-ish reassurance section; <CtaBand/>.
3. app/(marketing)/features/page.tsx — PageHero + grid of ALL features (discover, community, spots, karma, ai-helper, itinerary, family, premium, safety) as PaperCards each linking to /features/<slug> with icon + blurb; <CtaBand/>.
4. app/(marketing)/spots-vitrine/page.tsx — public spots showcase: PageHero + filter Chips (coucher/lever/portrait/archi, interactive useState filter) + responsive grid of spot cards built from spots data (Polaroid-style image, name, city, rating, category Badge). Each links to /help (public, no admin). Add a "map-hand" hero strip.`,
  },
  {
    phase: "Landing",
    label: "landing:feature-details",
    spec: `Create 9 feature detail pages, each: PageHero (eyebrow, title, highlight, sub, a relevant stamp), 2-3 alternating content rows (text + a Polaroid or map-hand/illustrative block), a "points forts" list with check icons in PaperCards, and <CtaBand/>. Keep French copy specific to each feature. Files:
1. app/(marketing)/features/discover/page.tsx — "La carte du quartier": trouver quelqu'un à proximité, pins, dispo toggle, +karma. Use a map-hand block with Avatar pins.
2. app/(marketing)/features/community/page.tsx — "Le carnet partagé": feed, likes, follow, stories.
3. app/(marketing)/features/spots/page.tsx — "Carte au trésor": spots, angles, conseils.
4. app/(marketing)/features/karma/page.tsx — "Le karma": gagner des points en aidant, badges (map over badges data), Tableau d'honneur teaser (leaderboard top 3 with Polaroids).
5. app/(marketing)/features/ai-helper/page.tsx — "L'œil bienveillant": IA de cadrage, suggestions, horizon.
6. app/(marketing)/features/itinerary/page.tsx — "Itinéraire du jour": parcours photo personnalisé, timeline.
7. app/(marketing)/features/family/page.tsx — "Album de famille": mode famille, sécurité enfants, carte partagée.
8. app/(marketing)/features/premium/page.tsx — "Première classe": avantages premium, link to /pricing, a gold boarding-pass styled Ticket.
9. app/(marketing)/features/safety/page.tsx — "Sécurité & confiance": vérification, GPS éphémère, signaler/bloquer, RGPD.`,
  },
  {
    phase: "Landing",
    label: "landing:pricing+download+auth",
    spec: `All "use client". Create:
1. app/(marketing)/pricing/page.tsx — PageHero + a monthly/annual Tabs toggle (useState) that swaps prices, three plan cards from plans data (highlight the recommended with shadow-gold + a -33% Stamp), feature lists with check icons, FAQ accordion (useState open/close), <CtaBand/>. Buttons push a toast.
2. app/(marketing)/download/page.tsx — PageHero, big phone-mockup-ish PaperCard with App Store / Google Play styled buttons (toast on click), a QR placeholder (styled div), feature bullets.
3. app/(marketing)/login/page.tsx — centered card on paper, Input email + password, Button (toast "Connexion simulée"), links to /signup and a "mot de passe oublié" modal (Modal). Decorative Stamp.
4. app/(marketing)/signup/page.tsx — multi-step feel (useState step 1→2), Inputs (prénom, email, téléphone), terms checkbox, "Recevoir le code" button → step 2 shows 4 code inputs, finish → toast. Passport-page styling with a Stamp.`,
  },
  {
    phase: "Landing",
    label: "landing:about+careers",
    spec: `Create:
1. app/(marketing)/about/page.tsx — PageHero, mission narrative, stats band (analytics.kpis), values teaser linking to /about/values, team teaser (map first 6 team with Polaroids) linking to /about/team, <CtaBand/>.
2. app/(marketing)/about/story/page.tsx — PageHero + a vertical timeline (founding → launch → 1M photos → seed round) using PaperCards + Stamps with years.
3. app/(marketing)/about/team/page.tsx — PageHero + responsive grid of ALL team members (Polaroid + name + role + Tape accents), plus an "on recrute" CTA linking to /careers.
4. app/(marketing)/about/values/page.tsx — PageHero + 4-6 value PaperCards (Humain d'abord, Confiance, Beauté du quotidien, Communauté…) with icons.
5. app/(marketing)/careers/page.tsx — "use client". PageHero + team/location filter Chips (useState) + list of jobs (from jobs data) as PaperCards linking to /careers/<slug>; a "pourquoi nous rejoindre" perks section.
6. app/(marketing)/careers/[slug]/page.tsx — "use client", useParams; getJob(slug); Breadcrumb, job title, team/location/type Badges, description (responsabilités / profil / avantages lists), an "postuler" Button that opens a Modal with an application form (Input name/email, Textarea, file note) and toast on submit.`,
  },
  {
    phase: "Landing",
    label: "landing:blog+stories",
    spec: `Create:
1. app/(marketing)/blog/page.tsx — "use client". PageHero("le carnet") + category filter Chips (derive categories from blogPosts, useState) + featured first post (large PaperCard) + responsive grid of remaining blogPosts (cover image, category Badge, title, excerpt, author·date·readMin) each linking to /blog/<slug>.
2. app/(marketing)/blog/[slug]/page.tsx — "use client", useParams; getBlogPost(slug); Breadcrumb, cover hero, title, author·date·readMin meta, rich article body (several <p>, a pull-quote styled block, a subheading or two — write real French prose relevant to the title), share buttons (toast), and a "à lire ensuite" row of 2-3 other posts.
3. app/(marketing)/stories/page.tsx — PageHero + grid of stories (Polaroid avatar + cover + quote) each linking to /stories/<slug>.
4. app/(marketing)/stories/[slug]/page.tsx — "use client", useParams; getStory(slug); a magazine-style profile: cover, name·city, big pull-quote, narrative paragraphs (French), Polaroids, and links back to /stories and /download.`,
  },
  {
    phase: "Landing",
    label: "landing:help+contact+status",
    spec: `Create:
1. app/(marketing)/help/page.tsx — "use client". Centre d'aide: PageHero with a search Input (useState filters helpArticles by title), category cards from helpCategories (emoji + count) linking to /help/<slug>, then a "articles populaires" list linking to /help/article/<slug>.
2. app/(marketing)/help/[category]/page.tsx — "use client", useParams; show category title from helpCategories (match slug) + the helpArticles in that category (or all if none match) as a list linking to /help/article/<slug>; Breadcrumb.
3. app/(marketing)/help/article/[slug]/page.tsx — "use client", useParams; getHelpArticle(slug); Breadcrumb, title, category Badge, a real French help article body with steps (ordered list in a PaperCard), a "cet article vous a-t-il aidé ?" 👍/👎 (useState + toast), related articles.
4. app/(marketing)/contact/page.tsx — "use client". PageHero + a two-column layout: contact form (Input name/email/subject Select, Textarea, send Button → toast + clears) and a sidebar with contact channels (email, presse, support) as PaperCards + a map-hand block.
5. app/(marketing)/status/page.tsx — "use client". État des services: overall "tous les systèmes opérationnels" banner (green), a list of components (API, App mobile, Carte, Paiements, Notifications) each with a Badge status + uptime %, and a 90-day uptime bar strip (small colored divs). One component shows "incident résolu".`,
  },
  {
    phase: "Landing",
    label: "landing:legal+press+misc",
    spec: `Create:
1. app/(marketing)/legal/terms/page.tsx — Conditions d'utilisation: PageHero + long structured legal-ish French text with numbered sections (use a left "sommaire" nav with anchor links + the article body). Wrap in max-w prose.
2. app/(marketing)/legal/privacy/page.tsx — Politique de confidentialité, same structure, sections on données collectées, GPS éphémère, conservation, droits.
3. app/(marketing)/legal/gdpr/page.tsx — RGPD: droits des utilisateurs (accès, rectification, effacement, portabilité), a "demander mes données" Button → toast, DPO contact.
4. app/(marketing)/legal/cookies/page.tsx — "use client". Politique cookies: table of cookie categories + Toggle switches for essentiels (locked on)/analytics/marketing, "enregistrer mes préférences" Button → toast.
5. app/(marketing)/community-guidelines/page.tsx — La charte: PageHero + do/don't cards, respect & bienveillance, sécurité, contenu.
6. app/(marketing)/sitemap-page/page.tsx — Plan du site: columns of <Link>s to every major route (marketing + a link to /admin), grouped.
7. app/(marketing)/partners/page.tsx — Partenaires: PageHero + logos grid (styled placeholder PaperCards), partnership tiers, a "devenir partenaire" Button → toast.
8. app/(marketing)/ambassadors/page.tsx — Programme ambassadeurs: perks, how to join, a form/Button → toast, leaderboard teaser.
9. app/(marketing)/press/page.tsx — Presse: PageHero + press kit download button (toast) + list of press releases (from press data) linking to /press/<slug> + media contact.
10. app/(marketing)/press/[slug]/page.tsx — "use client", useParams; getPress(slug); Breadcrumb, title, date, full French release body, "télécharger le kit presse" button (toast), back link.`,
  },

  // =============================== ADMIN ===============================
  {
    phase: "Admin",
    label: "admin:dashboard+analytics",
    spec: `All admin pages start with <AdminPage title=... eyebrow=... breadcrumb=... actions=...> and use mock data. Charts use recharts (ResponsiveContainer). Style charts with the palette: gold #b8893a, ink #2a1f1a, stamp-blue #2a4f76, stamp-green #3f6b3f, stamp-red #a8362e, sunset #d77032; chart surfaces on bg-card. Create:
1. app/admin/page.tsx — "use client". DASHBOARD: row of StatCards from analytics.kpis (users, sessions, photos, revenue, premium, karma with deltas), a big growth AreaChart/LineChart (analytics.growth), a "sessions par ville" BarChart (analytics.byCity), a "dernières activités" mini-feed from adminNotifications, and a "à traiter" panel linking to /admin/moderation, /admin/users/verification, /admin/spots/pending (counts). Quick actions buttons.
2. app/admin/analytics/page.tsx — "use client". Analytics overview: KPI StatCards + tabbed (Tabs useState) charts: croissance (growth line), revenus (revenueSplit pie), engagement (engagement bar). Date-range Chip selector (useState, cosmetic).
3. app/admin/analytics/users/page.tsx — user analytics: growth of users (AreaChart), new vs returning (BarChart from engagement), table of top cities (analytics.byCity) with bars.
4. app/admin/analytics/engagement/page.tsx — engagement: weekly bar (analytics.engagement), retention curve (LineChart analytics.retention), DAU/WAU StatCards.
5. app/admin/analytics/revenue/page.tsx — revenue: revenue line (growth.revenue), revenueSplit PieChart, MRR/ARR StatCards, recent payments mini-table (payments slice).
6. app/admin/analytics/geography/page.tsx — geography: byCity BarChart + a "map-hand" block with city Stamps placed around + a ranked city table.
7. app/admin/analytics/retention/page.tsx — retention: cohort-style table (build a small grid using retention values) + retention LineChart + churn StatCards.`,
  },
  {
    phase: "Admin",
    label: "admin:users+family",
    spec: `Create:
1. app/admin/users/page.tsx — "use client". Users list using DataTable<AdminUser> over users: columns avatar+name (Avatar + name + username), email, city, karma (sortValue), status (Badge), verification (Badge), reports. searchable. Row click → router.push to /admin/users/<id>. Toolbar with status filter Chips (useState) and an "exporter" + "inviter" Button (toast). Top StatCards (total, actifs, premium, signalés).
2. app/admin/users/[id]/page.tsx — "use client", useParams; getUser(id). Profile detail: cover + Polaroid avatar, name, Badges (status/verification/premium), stat strip (karma, photos given/received, followers, rating), bio, tabs (Tabs useState: activité / photos / signalements), action buttons: "suspendre", "vérifier", "envoyer un message", "supprimer" — suspend & delete open a confirm Modal then toast; link to /admin/users/<id>/edit. Breadcrumb.
3. app/admin/users/[id]/edit/page.tsx — "use client", useParams; getUser(id). Edit form: Inputs (prénom, nom, email, téléphone, ville), Select status & verification, Textarea bio, Toggle premium, "enregistrer" (toast) + "annuler" (Link back). Breadcrumb.
4. app/admin/users/verification/page.tsx — "use client". Verification queue: list of users with verification !== "verified" as PaperCards (id doc placeholder, email/phone/ID check rows with Toggle/Badges), "approuver"/"rejeter" buttons → confirm Modal → toast, remove from list (useState).
5. app/admin/users/new/page.tsx — "use client". Create-user form (same fields as edit) + "créer" → toast + Link to /admin/users.
6. app/admin/family/page.tsx — "use client". Family accounts: DataTable or card grid of family groups (synthesize ~8 groups from users: a "famille X" with 3-4 members, city, "mode famille" Badge), row → /admin/family/<id>.
7. app/admin/family/[id]/page.tsx — "use client", useParams. Family detail: group name, members list (Avatars + roles + "sécurisé" Badges), a map-hand block with member pins, settings Toggles (partage position, alertes), Breadcrumb.`,
  },
  {
    phase: "Admin",
    label: "admin:sessions+requests+bookings",
    spec: `Create:
1. app/admin/sessions/page.tsx — "use client". Sessions DataTable<PhotoSession> over sessions: id, requester (Avatar+name), photographer, spot, city, status Badge, photos, karmaAwarded, rating. searchable, status filter Chips. StatCards (total, actives, terminées, taux d'annulation). Row → /admin/sessions/<id>.
2. app/admin/sessions/[id]/page.tsx — "use client", useParams; getSession(id). Detail: timeline (demande → match → chat → session → galerie → note), requester & photographer PaperCards, a gallery strip of Polaroids (placeholder picsum), status Badge, karma awarded, "annuler la session"/"contacter" buttons (Modal/toast). Breadcrumb.
3. app/admin/requests/page.tsx — "use client". Photo requests DataTable (derive from sessions where status pending/active + synthesize a few): requester, photographer, distance, status, expires. Filter Chips. Row → /admin/requests/<id>.
4. app/admin/requests/[id]/page.tsx — "use client", useParams. Request detail: the "pli/postcard" message styled like the app (card with stamp), participants, location map-hand block, status, "forcer l'expiration"/"voir la session" buttons. Breadcrumb.
5. app/admin/bookings/page.tsx — "use client". Bookings DataTable<Booking> over bookings: id, user, experience, city, amount (fmtEur), status Badge, date. Filter Chips, StatCards (réservations, revenus, taux confirmation). Row → /admin/bookings/<id>.
6. app/admin/bookings/[id]/page.tsx — "use client", useParams; getBooking(id). Detail: a Ticket-styled booking pass (experience, city, date, amount), customer PaperCard, payment status, "rembourser"/"annuler" → confirm Modal → toast. Breadcrumb.`,
  },
  {
    phase: "Admin",
    label: "admin:community+spots",
    spec: `Create:
1. app/admin/community/posts/page.tsx — "use client". Posts moderation: toggle grid/table view (useState). Grid of post cards (image, author Avatar, caption, hearts/comments, status Badge) with quick "masquer"/"supprimer" (toast) + filter Chips (published/flagged/removed). Row/card → /admin/community/posts/<id>.
2. app/admin/community/posts/[id]/page.tsx — "use client", useParams; getPost(id). Detail: big image, author PaperCard, caption, engagement stats, a comments list (synthesize 4-5 French comments with Avatars), moderation actions ("approuver"/"masquer"/"supprimer" → confirm Modal → toast), status Badge. Breadcrumb.
3. app/admin/community/comments/page.tsx — "use client". Comments moderation DataTable (synthesize ~20 comments from users: author, excerpt, post, status, reports). Filter Chips, row actions approve/delete (toast).
4. app/admin/community/stories/page.tsx — "use client". Stories/24h: grid of active stories (Polaroids from users) with views count + expiry countdown text + "retirer" button (toast, removes via useState).
5. app/admin/spots/page.tsx — "use client". Spots DataTable<PhotoSpot> over spots: name, city+country, category Badge, rating, reviews, visits, status Badge, addedBy. searchable, category + status filter Chips. StatCards. Actions: "+ nouveau spot" → Link /admin/spots/new. Row → /admin/spots/<id>.
6. app/admin/spots/[id]/page.tsx — "use client", useParams; getSpot(id). Detail: hero image, name, rating/reviews/visits stat strip, category Badge, best time, addedBy PaperCard, "les meilleurs angles" Polaroid strip, conseils list, actions "modifier" (Link to edit) / "approuver"/"rejeter" (toast). Breadcrumb.
7. app/admin/spots/[id]/edit/page.tsx — "use client", useParams; getSpot(id). Edit form: Input name, Select city/category/status, Input bestTime, Textarea description, "enregistrer" toast. Breadcrumb.
8. app/admin/spots/new/page.tsx — "use client". New spot form (same fields) + "créer" toast + Link back.
9. app/admin/spots/pending/page.tsx — "use client". Approval queue: spots with status pending as review cards (image, name, addedBy, "approuver"/"rejeter" → toast, remove via useState).`,
  },
  {
    phase: "Admin",
    label: "admin:moderation+karma",
    spec: `Create:
1. app/admin/moderation/page.tsx — "use client". Moderation hub: StatCards (signalements ouverts, en cours, résolus, temps moyen), priority queue of reports (from reports, high severity first) as cards with reporter/target/reason/severity Badge + "examiner" Link to /admin/moderation/reports/<id>, quick links to blocked/appeals.
2. app/admin/moderation/reports/page.tsx — "use client". Reports DataTable<Report> over reports: id, type Badge, reason, reporter, target, severity Badge, status Badge, date. Filter Chips by status & severity. Row → /admin/moderation/reports/<id>.
3. app/admin/moderation/reports/[id]/page.tsx — "use client", useParams; getReport(id). Detail: report summary card, reported content/user preview PaperCard, reporter info, severity Badge, a decision panel with buttons "avertir"/"suspendre"/"supprimer le contenu"/"ignorer" → confirm Modal → toast + status change (useState), internal note Textarea. Breadcrumb.
4. app/admin/moderation/blocked/page.tsx — "use client". Blocked users DataTable (users with status banned/suspended): user, reason (synthesize), blocked date, "débloquer" button → confirm Modal → toast.
5. app/admin/moderation/appeals/page.tsx — "use client". Appeals queue: cards of users contesting a ban (synthesize 5-6), their message (Textarea readonly styled), "accepter l'appel"/"rejeter" → toast.
6. app/admin/karma/page.tsx — "use client". Karma overview: StatCards (karma total distribué, moyenne/session, top gagnant), a "karma par semaine" recharts line (use analytics.growth as proxy), the badges grid (from badges: emoji, name, description, holders fmtNum, rarity Badge) and link to /admin/karma/rules + /admin/badges + /admin/leaderboard.
7. app/admin/karma/rules/page.tsx — "use client". Karma rules editor: list of rules (prendre une photo = +12, être noté 5★ = +15, ajouter un spot = +8, etc.) each a row with an Input number + Toggle actif + "enregistrer" toast.
8. app/admin/leaderboard/page.tsx — "use client". Tableau d'honneur: a top-3 podium (Polaroids + medals styled) from leaderboard, then a DataTable of the rest (rank, user, score, city). City filter Chips.
9. app/admin/badges/page.tsx — "use client". Badges manager: grid of badge cards from badges with holders + rarity, "+ créer un badge" → Modal form → toast, edit pencil → toast.`,
  },
  {
    phase: "Admin",
    label: "admin:premium+payments",
    spec: `Create:
1. app/admin/premium/page.tsx — "use client". Subscriptions DataTable<Subscription> over subscriptions: user, plan Badge, price (fmtEur), status Badge, started, renews. Filter Chips by status. StatCards (abonnés actifs, en essai, MRR, taux de conversion). Row → /admin/premium/<id>.
2. app/admin/premium/[id]/page.tsx — "use client", useParams. Find subscription by id from subscriptions. Detail: subscriber PaperCard, plan/price/status, billing history mini-table (from payments filtered to that user or a synthesized list), actions "changer de formule"/"annuler l'abonnement"/"rembourser" → confirm Modal → toast. Breadcrumb.
3. app/admin/premium/plans/page.tsx — "use client". Plans editor: the 3 plans from @/lib/data 'plans' as editable PaperCards (Input price, Textarea features, Toggle actif), "enregistrer" toast. A small conversion funnel viz.
4. app/admin/payments/page.tsx — "use client". Payments DataTable<Payment> over payments: id, user, type Badge, amount (fmtEur, red if negative), method, status Badge, date. Filter Chips by status & type. StatCards (volume total, réussis, échoués, remboursés). Row → /admin/payments/<id>. "exporter" button toast.
5. app/admin/payments/[id]/page.tsx — "use client", useParams; getPayment(id). Detail: amount big, status Badge, a Ticket-style receipt (user, method, type, date, breakdown sous-total/service/total), customer card, actions "rembourser"/"renvoyer le reçu" → Modal/toast. Breadcrumb.
6. app/admin/payments/refunds/page.tsx — "use client". Refunds: DataTable of payments where type remboursement or status remboursé + a "nouveau remboursement" Modal (Select payment, Input amount, reason Textarea → toast). StatCards.
7. app/admin/payments/payouts/page.tsx — "use client". Payouts to photographers/partners: synthesize ~12 payout rows (beneficiary user, amount, status, date) in a DataTable, "lancer un virement" button → toast, StatCards (en attente, versé ce mois).`,
  },
  {
    phase: "Admin",
    label: "admin:content+notifs+support+audit",
    spec: `Create:
1. app/admin/content/manual/page.tsx — "use client". Le manuel (guides CMS): DataTable or card grid of guides (number Stamp, title, excerpt, status Badge, views fmtNum). "+ nouveau secret" → Link or Modal. Row → /admin/content/manual/<id>. Filter publié/brouillon Chips.
2. app/admin/content/manual/[id]/page.tsx — "use client", useParams; getGuide(id). Guide editor: Input title, Input number, Select color, Textarea body, Toggle publié, a live preview PaperCard styled like the app's manual card, "enregistrer" toast. Breadcrumb.
3. app/admin/content/guides/page.tsx — "use client". Broader guides/articles library: grid of help-style content (reuse guides + synthesize a few how-to entries) with status + views, edit buttons (toast).
4. app/admin/content/pages/page.tsx — "use client". Static pages CMS: table of marketing pages (Accueil, À propos, Tarifs, Charte, etc.) with last-updated + status + "modifier" (toast).
5. app/admin/notifications/page.tsx — "use client". Notifications center (admin): list adminNotifications as cards with kind icon + body + time + "marquer comme lu" (toast/useState), filter Chips by kind, link to /admin/notifications/new + /templates.
6. app/admin/notifications/new/page.tsx — "use client". Compose broadcast: Select audience (tous/premium/ville/inactifs), Input titre, Textarea message, Select canal (push/email/in-app), a live phone-ish preview PaperCard, "envoyer" → confirm Modal (shows estimated reach) → toast.
7. app/admin/notifications/templates/page.tsx — "use client". Templates: list of reusable notification templates (synthesize 6: bienvenue, demande reçue, karma gagné, spot validé, abonnement, sécurité) as cards with "modifier"/"dupliquer" (toast).
8. app/admin/support/page.tsx — "use client". Support tickets DataTable<Ticket> over tickets: id, subject, user, category Badge, priority Badge, status Badge, updated. Filter Chips. StatCards (ouverts, en cours, résolus, temps moyen). Row → /admin/support/<id>.
9. app/admin/support/[id]/page.tsx — "use client", useParams; getTicket(id). Ticket detail: a chat-style thread (synthesize a back-and-forth between user and support, styled like the app's note bubbles), ticket meta sidebar (Badges, assignee), a reply Textarea + "répondre" (toast appends to thread via useState), "résoudre"/"escalader" buttons. Breadcrumb.
10. app/admin/audit-log/page.tsx — "use client". Audit log DataTable over auditLog: actor, action, target, ip (mono), time. searchable, actor filter Chips, "exporter" toast.`,
  },
  {
    phase: "Admin",
    label: "admin:settings+profile",
    spec: `Create a cohesive settings suite. Each settings page should render a left sub-nav of the settings sections (links to the 9 settings routes, highlight current via usePathname) + the section content on the right, all inside <AdminPage>. Create:
1. app/admin/settings/page.tsx — "use client". Général: Inputs (nom de l'app, email support, fuseau), Toggles (mode maintenance, inscriptions ouvertes), Select langue par défaut, "enregistrer" toast.
2. app/admin/settings/security/page.tsx — "use client". Sécurité: 2FA Toggle, session timeout Select, password policy Toggles, a "sessions actives" table with "révoquer" buttons (toast), reset all sessions Button → confirm Modal.
3. app/admin/settings/roles/page.tsx — "use client". Rôles & permissions: table of roles (Admin, Modérateur, Support, Lecture seule) with a permissions matrix (checkboxes/Toggles per capability), "+ créer un rôle" Modal → toast.
4. app/admin/settings/team/page.tsx — "use client". Équipe admin: DataTable of admin members (synthesize from team data: name, email, role Badge, last active), "inviter un membre" Modal (Input email + Select role → toast), remove (confirm Modal → toast).
5. app/admin/settings/api-keys/page.tsx — "use client". Clés API: table of keys (name, masked key like sk_live_••••1234, created, last used), "générer une clé" Modal → shows new key + copy button (toast), revoke (confirm → toast).
6. app/admin/settings/integrations/page.tsx — "use client". Intégrations: cards for Stripe, Firebase, Twilio, Mailgun, Mapbox, Sentry each with a connected/disconnected Badge + Toggle + "configurer" (toast).
7. app/admin/settings/billing/page.tsx — "use client". Facturation (du compte entreprise): current plan card, payment method (Ticket-style card), invoices table (synthesize) with download (toast), usage StatCards.
8. app/admin/settings/notifications/page.tsx — "use client". Préférences de notif admin: list of event types (nouveau signalement, paiement échoué, nouvel utilisateur, spot à valider…) each with email/push/slack Toggles, "enregistrer" toast.
9. app/admin/settings/localization/page.tsx — "use client". Localisation: supported languages list (FR/EN/AR) with completion % bars + Toggle actif, default language Select, date/currency format Selects, RTL note for AR, "enregistrer" toast.
10. app/admin/profile/page.tsx — "use client". Admin's own profile (Claire B.): Polaroid avatar, edit Inputs (name, email), change password section, theme/preferences Toggles, "déconnexion" Button (toast), "enregistrer" toast. Breadcrumb.`,
  },
];

log(`Building ${clusters.length} route clusters across Landing + Admin…`);

const results = await parallel(
  clusters.map((c) => () =>
    agent(`${BRIEF}\n\n=== YOUR CLUSTER: ${c.label} ===\n${c.spec}`, {
      label: c.label,
      phase: c.phase,
      model: "sonnet",
      schema: SCHEMA,
    }).then((r) => ({ cluster: c.label, ...(r || {}) }))
  )
);

const ok = results.filter(Boolean);
const totalFiles = ok.reduce((n, r) => n + (r.files?.length || 0), 0);
log(`Done. ${ok.length}/${clusters.length} clusters completed, ${totalFiles} files written.`);

return {
  clusters: ok.map((r) => ({ cluster: r.cluster, count: r.files?.length || 0, notes: r.notes })),
  totalFiles,
};
