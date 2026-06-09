/**
 * Mock data layer for the Take Me Pic web (landing + admin).
 * No backend — everything is static seed data. Structured so a real API
 * could replace these exports later. Deterministic (no Math.random at module
 * scope) so server/client renders match.
 */

const av = (n: number) => `https://i.pravatar.cc/300?img=${n}`;
const pic = (s: string) => `https://picsum.photos/seed/${s}/800/800`;

/* ----------------------------------------------------------------- USERS */
export type UserStatus = "active" | "pending" | "suspended" | "banned";
export type Verification = "verified" | "partial" | "none";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  country: string;
  languages: string[];
  avatar: string;
  cover?: string;
  bio: string;
  karma: number;
  rating: number;
  photosGiven: number;
  photosReceived: number;
  followers: number;
  following: number;
  spotsAdded: number;
  status: UserStatus;
  verification: Verification;
  premium: boolean;
  joined: string; // ISO date
  lastSeen: string;
  reports: number;
}

const FIRST = ["Claire", "Léo", "Inès", "Sami", "Marc", "Yasmine", "Thomas", "Nora", "Hugo", "Léa", "Antoine", "Camille", "Mehdi", "Sofia", "Lucas", "Émma", "Karim", "Julie", "Pablo", "Aya", "Noah", "Chloé", "Youssef", "Manon"];
const LAST = ["Bernard", "Margaux", "Rahmouni", "Belkacem", "Olivier", "Karam", "Dubois", "Lefèvre", "Moreau", "Da Silva", "Cohen", "Nakamura", "Rossi", "Andersen", "Costa", "Haddad", "Petit", "Garcia", "Mendes", "Klein"];
const CITIES = [["Paris", "🇫🇷"], ["Lisbonne", "🇵🇹"], ["Marrakech", "🇲🇦"], ["Barcelone", "🇪🇸"], ["Rome", "🇮🇹"], ["Tokyo", "🇯🇵"], ["Lyon", "🇫🇷"], ["Berlin", "🇩🇪"], ["Amsterdam", "🇳🇱"], ["Istanbul", "🇹🇷"]];
const LANGS = ["🇫🇷", "🇬🇧", "🇪🇸", "🇵🇹", "🇮🇹", "🇲🇦", "🇩🇪", "🇯🇵"];
const STATUSES: UserStatus[] = ["active", "active", "active", "active", "pending", "active", "suspended", "active", "banned", "active"];
const VERIF: Verification[] = ["verified", "verified", "partial", "verified", "none", "partial", "verified", "none"];
const BIOS = [
  "photographe amateure, fan de lumières du matin ☼",
  "Photographe de rue depuis 10 ans. Toujours partant pour un beau cadre !",
  "Je collectionne les couchers de soleil ✿",
  "Lumière, rues, sourires.",
  "Voyageur du dimanche.",
  "En quête du cadre parfait, un café à la main.",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Round to one decimal — avoids float noise like 4.3999999999999995. */
const round1 = (n: number) => Math.round(n * 10) / 10;

export const users: AdminUser[] = Array.from({ length: 48 }, (_, i) => {
  const fn = FIRST[i % FIRST.length];
  const ln = LAST[(i * 3) % LAST.length];
  const [city, flag] = CITIES[i % CITIES.length];
  const langs = [LANGS[i % LANGS.length], LANGS[(i + 2) % LANGS.length], flag].filter((v, idx, arr) => arr.indexOf(v) === idx);
  const karma = 120 + ((i * 137) % 3300);
  const month = pad((i % 12) + 1);
  const day = pad(((i * 7) % 27) + 1);
  return {
    id: `u${i + 1}`,
    firstName: fn,
    lastName: ln,
    username: `@${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@gmail.com`,
    phone: `+33 6 ${pad(10 + (i % 80))} ${pad((i * 3) % 100)} ${pad((i * 7) % 100)}`,
    age: 22 + (i % 26),
    city,
    country: flag,
    languages: langs,
    avatar: av((i % 70) + 1),
    cover: pic(`cover${i}`),
    bio: BIOS[i % BIOS.length],
    karma,
    rating: round1(4 + ((i % 10) / 10)),
    photosGiven: (i * 11) % 220,
    photosReceived: (i * 7) % 140,
    followers: (i * 53) % 3000,
    following: (i * 17) % 600,
    spotsAdded: (i * 3) % 28,
    status: STATUSES[i % STATUSES.length],
    verification: VERIF[i % VERIF.length],
    premium: i % 4 === 0,
    joined: `2024-${month}-${day}`,
    lastSeen: i % 5 === 0 ? "il y a 2 min" : i % 3 === 0 ? "il y a 1 h" : "hier",
    reports: i % 9 === 0 ? (i % 3) + 1 : 0,
  };
});

export const getUser = (id: string) => users.find((u) => u.id === id) ?? users[0];

/* -------------------------------------------------------------- SESSIONS */
export type SessionStatus = "completed" | "active" | "cancelled" | "pending";
export interface PhotoSession {
  id: string;
  helpRequestId: number;
  requester: AdminUser;
  photographer: AdminUser;
  spot: string;
  city: string;
  status: SessionStatus;
  date: string;
  durationMin: number;
  photos: number;
  karmaAwarded: number;
  rating?: number;
}
export const sessions: PhotoSession[] = Array.from({ length: 36 }, (_, i) => {
  const r = users[(i * 2) % users.length];
  const p = users[(i * 3 + 1) % users.length];
  const st: SessionStatus[] = ["completed", "completed", "active", "completed", "cancelled", "pending"];
  return {
    id: `s${1000 + i}`,
    helpRequestId: 1000 + i,
    requester: r,
    photographer: p,
    spot: ["Pont des Arts", "Place des Vosges", "Jemaa el-Fna", "Alfama", "Sagrada Família", "Shibuya"][i % 6],
    city: r.city,
    status: st[i % st.length],
    date: `2026-05-${pad((i % 27) + 1)}`,
    durationMin: 6 + (i % 20),
    photos: 3 + (i % 12),
    karmaAwarded: 12 + (i % 12),
    rating: i % 5 === 0 ? undefined : round1(4 + ((i % 10) / 10)),
  };
});
export const getSession = (id: string) => sessions.find((s) => s.id === id) ?? sessions[0];

/* ----------------------------------------------------------------- POSTS */
export interface CommunityPost {
  id: string;
  author: AdminUser;
  city: string;
  image: string;
  caption: string;
  hearts: number;
  comments: number;
  status: "published" | "flagged" | "removed";
  date: string;
}
export const posts: CommunityPost[] = Array.from({ length: 30 }, (_, i) => ({
  id: `p${i + 1}`,
  author: users[(i * 5) % users.length],
  city: CITIES[i % CITIES.length][0],
  image: pic(`post${i}`),
  caption: [
    "Coucher de soleil magique sur la place 🌅",
    "Le meilleur angle est sur la terrasse du café.",
    "Heure dorée garantie ✿",
    "Lumière incroyable ce matin ☼",
    "Plan large avec la façade derrière 📸",
  ][i % 5],
  hearts: 40 + ((i * 87) % 2000),
  comments: (i * 7) % 80,
  status: i % 11 === 0 ? "flagged" : i % 17 === 0 ? "removed" : "published",
  date: `2026-05-${pad((i % 27) + 1)}`,
}));
export const getPost = (id: string) => posts.find((p) => p.id === id) ?? posts[0];

/* ----------------------------------------------------------------- SPOTS */
export interface PhotoSpot {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  bestTime: string;
  category: "coucher" | "lever" | "portrait" | "archi";
  hero: string;
  status: "approved" | "pending" | "rejected";
  addedBy: AdminUser;
  visits: number;
}
const SPOT_NAMES = ["Pont des Arts", "Place des Vosges", "Jemaa el-Fna", "Miradouro do Monte", "Sagrada Família", "Galeries Lafayette", "Tour de Belém", "Trastevere", "Shibuya Crossing", "Parc Güell", "Montmartre", "Ponte Vecchio"];

/** Real city centres (lat, lng) so spots can be placed on a real map. */
export const CITY_COORDS: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lisbonne: [38.7223, -9.1393],
  Marrakech: [31.6295, -7.9811],
  Barcelone: [41.3874, 2.1686],
  Rome: [41.9028, 12.4964],
  Tokyo: [35.6762, 139.6503],
  Lyon: [45.764, 4.8357],
  Berlin: [52.52, 13.405],
  Amsterdam: [52.3676, 4.9041],
  Istanbul: [41.0082, 28.9784],
};

export const spots: PhotoSpot[] = Array.from({ length: 28 }, (_, i) => {
  const cats: PhotoSpot["category"][] = ["coucher", "lever", "portrait", "archi"];
  const [city, flag] = CITIES[i % CITIES.length];
  const [baseLat, baseLng] = CITY_COORDS[city] ?? [48.8566, 2.3522];
  // Deterministic jitter so multiple spots in one city don't stack exactly.
  const lat = baseLat + (((i * 37) % 60) - 30) / 1000;
  const lng = baseLng + (((i * 53) % 60) - 30) / 1000;
  return {
    id: `spot${i + 1}`,
    name: SPOT_NAMES[i % SPOT_NAMES.length] + (i >= SPOT_NAMES.length ? ` ${Math.floor(i / SPOT_NAMES.length) + 1}` : ""),
    city,
    country: flag,
    lat,
    lng,
    rating: round1(4.3 + ((i % 7) / 10)),
    reviews: 30 + ((i * 41) % 400),
    bestTime: ["19H", "7H", "Midi", "Heure dorée"][i % 4],
    category: cats[i % cats.length],
    hero: pic(`spot${i}`),
    status: i % 9 === 0 ? "pending" : i % 13 === 0 ? "rejected" : "approved",
    addedBy: users[(i * 4) % users.length],
    visits: 50 + ((i * 63) % 800),
  };
});
export const getSpot = (id: string) => spots.find((s) => s.id === id) ?? spots[0];

/* --------------------------------------------------------------- REPORTS */
export interface Report {
  id: string;
  type: "user" | "post" | "comment" | "spot";
  reason: string;
  reporter: AdminUser;
  target: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  severity: "low" | "medium" | "high";
  date: string;
}
export const reports: Report[] = Array.from({ length: 24 }, (_, i) => {
  const reasons = ["Contenu inapproprié", "Comportement déplacé", "Spam", "Faux profil", "Photo volée", "Harcèlement"];
  const st: Report["status"][] = ["open", "reviewing", "resolved", "dismissed", "open"];
  const sev: Report["severity"][] = ["low", "medium", "high"];
  return {
    id: `r${i + 1}`,
    type: (["user", "post", "comment", "spot"] as const)[i % 4],
    reason: reasons[i % reasons.length],
    reporter: users[(i * 6) % users.length],
    target: users[(i * 5 + 2) % users.length].username,
    status: st[i % st.length],
    severity: sev[i % sev.length],
    date: `2026-05-${pad((i % 27) + 1)}`,
  };
});
export const getReport = (id: string) => reports.find((r) => r.id === id) ?? reports[0];

/* -------------------------------------------------------------- PAYMENTS */
export interface Payment {
  id: string;
  user: AdminUser;
  type: "abonnement" | "réservation" | "remboursement";
  amount: number;
  currency: "€";
  method: "Visa" | "Mastercard" | "Apple Pay";
  status: "réussi" | "en attente" | "échoué" | "remboursé";
  date: string;
}
export const payments: Payment[] = Array.from({ length: 40 }, (_, i) => {
  const types: Payment["type"][] = ["abonnement", "réservation", "abonnement", "réservation", "remboursement"];
  const methods: Payment["method"][] = ["Visa", "Mastercard", "Apple Pay"];
  const st: Payment["status"][] = ["réussi", "réussi", "réussi", "en attente", "échoué", "remboursé"];
  const t = types[i % types.length];
  return {
    id: `pay_${4000 + i}`,
    user: users[(i * 3) % users.length],
    type: t,
    amount: t === "abonnement" ? (i % 3 === 0 ? 39.99 : 4.99) : t === "remboursement" ? -36 : 18 + (i % 4) * 12,
    currency: "€",
    method: methods[i % methods.length],
    status: st[i % st.length],
    date: `2026-05-${pad((i % 27) + 1)}`,
  };
});
export const getPayment = (id: string) => payments.find((p) => p.id === id) ?? payments[0];

/* ----------------------------------------------------------- SUBSCRIPTIONS */
export interface Subscription {
  id: string;
  user: AdminUser;
  plan: "Mensuel" | "Annuel";
  price: number;
  status: "actif" | "en essai" | "annulé" | "expiré";
  started: string;
  renews: string;
}
export const subscriptions: Subscription[] = users
  .filter((u) => u.premium)
  .map((u, i) => ({
    id: `sub_${500 + i}`,
    user: u,
    plan: i % 2 === 0 ? "Annuel" : "Mensuel",
    price: i % 2 === 0 ? 39.99 : 4.99,
    status: (["actif", "actif", "en essai", "annulé", "expiré"] as const)[i % 5],
    started: `2025-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
    renews: `2026-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
  }));

/* ---------------------------------------------------------------- BOOKINGS */
export interface Booking {
  id: string;
  user: AdminUser;
  experience: string;
  city: string;
  amount: number;
  status: "confirmée" | "en attente" | "annulée";
  date: string;
}
export const bookings: Booking[] = Array.from({ length: 22 }, (_, i) => ({
  id: `bk_${700 + i}`,
  user: users[(i * 5) % users.length],
  experience: ["Tram 28, visite guidée", "Atelier photo argentique", "Balade Alfama au lever", "Tour des toits de Paris", "Médina au coucher"][i % 5],
  city: CITIES[i % CITIES.length][0],
  amount: 18 + (i % 5) * 12,
  status: (["confirmée", "confirmée", "en attente", "annulée"] as const)[i % 4],
  date: `2026-06-${pad((i % 27) + 1)}`,
}));
export const getBooking = (id: string) => bookings.find((b) => b.id === id) ?? bookings[0];

/* ------------------------------------------------------------ NOTIFICATIONS */
export interface AdminNotification {
  id: string;
  kind: "karma" | "request" | "community" | "badge" | "spot" | "report" | "payment";
  body: string;
  meta?: string;
  time: string;
  avatar?: string;
}
export const adminNotifications: AdminNotification[] = [
  { id: "n1", kind: "report", body: "Nouveau signalement à examiner — Photo volée", meta: "haute priorité", time: "il y a 4 min", avatar: av(12) },
  { id: "n2", kind: "payment", body: "Paiement échoué — Léo M. (39,99 €)", time: "il y a 18 min", avatar: av(12) },
  { id: "n3", kind: "spot", body: "3 spots en attente de validation", time: "il y a 1 h" },
  { id: "n4", kind: "community", body: "Publication signalée par 4 utilisateurs", time: "il y a 2 h", avatar: av(22) },
  { id: "n5", kind: "badge", body: "Nouveau Top 3 % cette semaine — Paris", time: "hier" },
];

/* ----------------------------------------------------------------- BADGES */
export interface Badge {
  id: string;
  name: string;
  description: string;
  holders: number;
  rarity: "commun" | "rare" | "légendaire";
  emoji: string;
}
export const badges: Badge[] = [
  { id: "b1", name: "Premier déclic", description: "Première photo prise pour quelqu'un", holders: 12400, rarity: "commun", emoji: "📸" },
  { id: "b2", name: "Bonne étoile", description: "Note moyenne de 4,8 ★ sur 50 photos", holders: 3200, rarity: "rare", emoji: "⭐" },
  { id: "b3", name: "Œil de lynx", description: "100 photos prises", holders: 1800, rarity: "rare", emoji: "🦅" },
  { id: "b4", name: "Lève-tôt", description: "10 photos au lever du soleil", holders: 940, rarity: "rare", emoji: "🌅" },
  { id: "b5", name: "Globe-trotteur", description: "Photos prises dans 5 pays", holders: 420, rarity: "légendaire", emoji: "🌍" },
  { id: "b6", name: "Cœur d'or", description: "Top 1 % d'entraide mondiale", holders: 88, rarity: "légendaire", emoji: "💛" },
];

/* ------------------------------------------------------- LEADERBOARD (Stars) */
export const leaderboard = [...users]
  .sort((a, b) => b.karma - a.karma)
  .slice(0, 20)
  .map((u, i) => ({ rank: i + 1, user: u, score: u.karma }));

/* -------------------------------------------------------------- ANALYTICS */
export const analytics = {
  kpis: {
    users: 48230,
    usersDelta: "+12,4 %",
    sessions: 18420,
    sessionsDelta: "+8,1 %",
    photos: 142300,
    photosDelta: "+18,9 %",
    revenue: 64200,
    revenueDelta: "+5,3 %",
    premium: 4120,
    premiumDelta: "+21,0 %",
    karma: 2840000,
    karmaDelta: "+9,7 %",
  },
  // monthly series (Jan→déc 2026, partial)
  growth: [
    { m: "jan", users: 21000, sessions: 6400, revenue: 32000 },
    { m: "fév", users: 24800, sessions: 7800, revenue: 38000 },
    { m: "mar", users: 29500, sessions: 9600, revenue: 44000 },
    { m: "avr", users: 35200, sessions: 12200, revenue: 51000 },
    { m: "mai", users: 41800, sessions: 15100, revenue: 58000 },
    { m: "juin", users: 48230, sessions: 18420, revenue: 64200 },
  ],
  byCity: [
    { city: "Paris", value: 14200 },
    { city: "Lisbonne", value: 8900 },
    { city: "Barcelone", value: 7400 },
    { city: "Rome", value: 6100 },
    { city: "Marrakech", value: 5200 },
    { city: "Tokyo", value: 3900 },
    { city: "Autres", value: 2530 },
  ],
  engagement: [
    { day: "lun", value: 62 },
    { day: "mar", value: 70 },
    { day: "mer", value: 68 },
    { day: "jeu", value: 74 },
    { day: "ven", value: 88 },
    { day: "sam", value: 96 },
    { day: "dim", value: 90 },
  ],
  retention: [
    { week: "S1", value: 100 },
    { week: "S2", value: 68 },
    { week: "S3", value: 54 },
    { week: "S4", value: 47 },
    { week: "S6", value: 41 },
    { week: "S8", value: 38 },
    { week: "S12", value: 34 },
  ],
  revenueSplit: [
    { name: "Abonnements annuels", value: 38000 },
    { name: "Abonnements mensuels", value: 16000 },
    { name: "Réservations", value: 10200 },
  ],
};

/* ---------------------------------------------------------------- SUPPORT */
export interface Ticket {
  id: string;
  subject: string;
  user: AdminUser;
  category: "compte" | "paiement" | "sécurité" | "technique" | "autre";
  priority: "basse" | "normale" | "haute";
  status: "ouvert" | "en cours" | "résolu";
  updated: string;
}
export const tickets: Ticket[] = Array.from({ length: 26 }, (_, i) => ({
  id: `t${300 + i}`,
  subject: ["Je n'arrive pas à me connecter", "Remboursement abonnement", "Signaler un utilisateur", "Photo non reçue", "Changer mon e-mail", "Bug sur la carte"][i % 6],
  user: users[(i * 7) % users.length],
  category: (["compte", "paiement", "sécurité", "technique", "autre"] as const)[i % 5],
  priority: (["basse", "normale", "haute"] as const)[i % 3],
  status: (["ouvert", "en cours", "résolu"] as const)[i % 3],
  updated: i % 3 === 0 ? "il y a 12 min" : i % 2 === 0 ? "il y a 3 h" : "hier",
}));
export const getTicket = (id: string) => tickets.find((t) => t.id === id) ?? tickets[0];

/* -------------------------------------------------------------- AUDIT LOG */
export const auditLog = Array.from({ length: 40 }, (_, i) => ({
  id: `log${i}`,
  actor: ["Claire B.", "système", "Marc O.", "Inès R."][i % 4],
  action: ["a validé un spot", "a suspendu un compte", "a remboursé un paiement", "a supprimé une publication", "a modifié un rôle", "a résolu un signalement"][i % 6],
  target: users[(i * 3) % users.length].username,
  ip: `92.168.${i % 255}.${(i * 7) % 255}`,
  time: `2026-05-${pad((i % 27) + 1)} ${pad(8 + (i % 12))}:${pad((i * 5) % 60)}`,
}));

/* ------------------------------------------------------- CONTENT (manual) */
export interface Guide {
  id: string;
  number: string;
  title: string;
  excerpt: string;
  color: "gold" | "blue" | "green" | "sunset";
  status: "publié" | "brouillon";
  views: number;
}
export const guides: Guide[] = [
  { id: "g1", number: "01", title: "La règle des tiers", excerpt: "Place le sujet sur une ligne de force, pas au centre.", color: "gold", status: "publié", views: 24000 },
  { id: "g2", number: "02", title: "Lignes directrices", excerpt: "Routes, murs, horizon — laisse l'œil voyager.", color: "blue", status: "publié", views: 18200 },
  { id: "g3", number: "03", title: "Espace négatif", excerpt: "Laisse respirer. Le vide raconte aussi.", color: "green", status: "publié", views: 15600 },
  { id: "g4", number: "04", title: "Heure dorée", excerpt: "30 min après lever, avant coucher. Magie garantie ☼", color: "sunset", status: "publié", views: 31000 },
  { id: "g5", number: "05", title: "Cadrage de groupe", excerpt: "Aligne tout le monde sur la ligne du bas.", color: "gold", status: "brouillon", views: 0 },
  { id: "g6", number: "06", title: "Contre-jour maîtrisé", excerpt: "Expose pour les visages, garde le halo.", color: "blue", status: "brouillon", views: 0 },
];
export const getGuide = (id: string) => guides.find((g) => g.id === id) ?? guides[0];

/* ----------------------------------------------------------- BLOG / STORIES */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMin: number;
  cover: string;
}
export const blogPosts: BlogPost[] = [
  { slug: "plus-jamais-selfie-rate", title: "Plus jamais un selfie raté : le manifeste", excerpt: "Pourquoi on a construit une appli où les voyageurs se photographient.", category: "Histoire", author: "Claire Bernard", date: "12 mai 2026", readMin: 5, cover: pic("blog1") },
  { slug: "10-spots-paris", title: "10 spots photo secrets à Paris", excerpt: "Les meilleurs angles, loin de la foule, choisis par la communauté.", category: "Spots", author: "Léo Margaux", date: "8 mai 2026", readMin: 7, cover: pic("blog2") },
  { slug: "lumiere-doree", title: "Comprendre la lumière dorée", excerpt: "L'heure magique, expliquée simplement, avec des exemples.", category: "Technique", author: "Inès Rahmouni", date: "2 mai 2026", readMin: 6, cover: pic("blog3") },
  { slug: "voyager-leger", title: "Voyager léger et photographier mieux", excerpt: "Pourquoi votre téléphone suffit (presque) toujours.", category: "Voyage", author: "Sami Belkacem", date: "28 avr. 2026", readMin: 4, cover: pic("blog4") },
  { slug: "karma-communaute", title: "Le karma, ou l'économie de l'entraide", excerpt: "Comment un système de points crée une vraie communauté.", category: "Produit", author: "Marc Olivier", date: "20 avr. 2026", readMin: 8, cover: pic("blog5") },
  { slug: "securite-voyage", title: "Voyager en sécurité avec TMP", excerpt: "GPS éphémère, vérification, mode famille : nos garde-fous.", category: "Sécurité", author: "Yasmine Karam", date: "14 avr. 2026", readMin: 5, cover: pic("blog6") },
  { slug: "lisbonne-jour", title: "Une journée parfaite à Lisbonne", excerpt: "Notre itinéraire photo de l'aube au coucher, testé pour vous.", category: "Itinéraire", author: "Sami Belkacem", date: "6 avr. 2026", readMin: 9, cover: pic("blog7") },
  { slug: "portrait-inconnu", title: "L'art du portrait par un inconnu", excerpt: "Comment guider quelqu'un pour qu'il vous prenne parfaitement.", category: "Technique", author: "Inès Rahmouni", date: "30 mars 2026", readMin: 6, cover: pic("blog8") },
];
export const getBlogPost = (slug: string) => blogPosts.find((b) => b.slug === slug) ?? blogPosts[0];

export interface Story {
  slug: string;
  name: string;
  city: string;
  quote: string;
  avatar: string;
  cover: string;
}
export const stories: Story[] = [
  { slug: "claire-paris", name: "Claire", city: "Paris", quote: "J'ai enfin de vraies photos de moi en voyage, pas juste des bras tendus.", avatar: av(47), cover: pic("story1") },
  { slug: "leo-lisbonne", name: "Léo", city: "Lisbonne", quote: "Prendre des photos pour les autres m'a fait rencontrer mes meilleurs amis de voyage.", avatar: av(12), cover: pic("story2") },
  { slug: "ines-marrakech", name: "Inès", city: "Marrakech", quote: "La communauté connaît les meilleurs spots avant tout le monde.", avatar: av(22), cover: pic("story3") },
  { slug: "famille-bernard", name: "Les Bernard", city: "Lisbonne", quote: "Le mode famille nous a rassurés avec les enfants en vadrouille.", avatar: av(8), cover: pic("story4") },
];
export const getStory = (slug: string) => stories.find((s) => s.slug === slug) ?? stories[0];

/* --------------------------------------------------------------- CAREERS */
export interface Job {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
}
export const jobs: Job[] = [
  { slug: "senior-mobile", title: "Ingénieur·e Mobile Senior (React Native)", team: "Produit", location: "Paris / Remote", type: "CDI" },
  { slug: "product-designer", title: "Product Designer", team: "Design", location: "Paris", type: "CDI" },
  { slug: "community-lead", title: "Responsable Communauté", team: "Communauté", location: "Remote", type: "CDI" },
  { slug: "backend-engineer", title: "Ingénieur·e Backend", team: "Produit", location: "Lisbonne / Remote", type: "CDI" },
  { slug: "growth-marketer", title: "Growth Marketer", team: "Marketing", location: "Paris", type: "CDI" },
  { slug: "trust-safety", title: "Spécialiste Confiance & Sécurité", team: "Opérations", location: "Remote", type: "CDI" },
];
export const getJob = (slug: string) => jobs.find((j) => j.slug === slug) ?? jobs[0];

/* ----------------------------------------------------------------- PRESS */
export interface PressRelease {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}
export const press: PressRelease[] = [
  { slug: "levee-de-fonds", title: "Take Me Pic lève 8 M€ pour réinventer la photo de voyage", date: "15 mai 2026", excerpt: "Un tour de table mené par des investisseurs européens du voyage." },
  { slug: "million-photos", title: "1 million de photos prises entre voyageurs", date: "2 avr. 2026", excerpt: "Une étape symbolique pour la communauté, un an après le lancement." },
  { slug: "lancement", title: "Take Me Pic, l'appli qui met fin aux selfies ratés", date: "10 janv. 2026", excerpt: "Disponible dès aujourd'hui sur l'App Store." },
];
export const getPress = (slug: string) => press.find((p) => p.slug === slug) ?? press[0];

/* ------------------------------------------------------------- HELP CENTER */
export interface HelpArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}
export const helpArticles: HelpArticle[] = [
  { slug: "creer-compte", title: "Créer un compte et le vérifier", category: "Démarrer", excerpt: "Email, téléphone et pièce d'identité pour un profil de confiance." },
  { slug: "trouver-photographe", title: "Trouver quelqu'un pour ma photo", category: "Démarrer", excerpt: "Utiliser la carte du quartier et envoyer un pli." },
  { slug: "devenir-disponible", title: "Me rendre disponible pour aider", category: "Démarrer", excerpt: "Activer le mode « je veux bien aider » et gagner du karma." },
  { slug: "gerer-karma", title: "Comprendre et gagner du karma", category: "Compte", excerpt: "Comment les points fonctionnent et à quoi ils servent." },
  { slug: "confidentialite-gps", title: "Le partage de ma position", category: "Sécurité", excerpt: "Le GPS n'est partagé que pendant une session active." },
  { slug: "signaler-bloquer", title: "Signaler ou bloquer quelqu'un", category: "Sécurité", excerpt: "Garder la communauté sûre et bienveillante." },
  { slug: "abonnement-premium", title: "Gérer mon abonnement Première classe", category: "Paiements", excerpt: "Changer de formule, annuler, demander un remboursement." },
  { slug: "mode-famille", title: "Activer le mode famille", category: "Sécurité", excerpt: "Voir où sont les vôtres, en toute sérénité." },
];
export const getHelpArticle = (slug: string) => helpArticles.find((a) => a.slug === slug) ?? helpArticles[0];

export const helpCategories = [
  { slug: "getting-started", title: "Démarrer", emoji: "🧭", count: 12 },
  { slug: "account", title: "Compte & profil", emoji: "📓", count: 9 },
  { slug: "safety", title: "Sécurité & confiance", emoji: "🛡️", count: 14 },
  { slug: "payments", title: "Paiements & Premium", emoji: "🎫", count: 8 },
];

/* ----------------------------------------------------------------- TEAM */
export const team = [
  { name: "Claire Bernard", role: "CEO & cofondatrice", avatar: av(47) },
  { name: "Léo Margaux", role: "CTO & cofondateur", avatar: av(12) },
  { name: "Inès Rahmouni", role: "Head of Community", avatar: av(22) },
  { name: "Sami Belkacem", role: "Lead Designer", avatar: av(33) },
  { name: "Marc Olivier", role: "Head of Growth", avatar: av(51) },
  { name: "Yasmine Karam", role: "Trust & Safety", avatar: av(44) },
];

/* ----------------------------------------------------------------- PRICING */
export const plans = [
  {
    id: "free",
    name: "Carnet",
    price: "Gratuit",
    period: "",
    tagline: "pour commencer le voyage",
    features: ["Trouver quelqu'un à proximité", "Prendre des photos pour les autres", "Gagner du karma", "Galerie de session chiffrée 24 h", "Accès à la communauté"],
    cta: "télécharger",
    highlight: false,
  },
  {
    id: "monthly",
    name: "Première classe — mensuel",
    price: "4,99 €",
    period: "/ mois",
    tagline: "le confort, sans engagement",
    features: ["Tout le plan Carnet", "Profil mis en avant — 3× plus de matchs", "Spots secrets, hors guide", "2× karma par session", "Aucune publicité", "Galerie illimitée"],
    cta: "essai 7 jours gratuits",
    highlight: false,
  },
  {
    id: "annual",
    name: "Première classe — annuel",
    price: "39,99 €",
    period: "/ an",
    tagline: "le meilleur prix · -33 %",
    features: ["Tout le plan mensuel", "2 mois offerts", "Badge ambassadeur", "Support prioritaire", "Accès anticipé aux nouveautés"],
    cta: "essai 7 jours gratuits",
    highlight: true,
  },
];

/* --------------------------------------------------------------- HELPERS */
export const fmtNum = (n: number) => n.toLocaleString("fr-FR");
export const fmtEur = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
