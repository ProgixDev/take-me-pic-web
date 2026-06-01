"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronRight,
  Send,
  Paperclip,
} from "lucide-react";
import {
  PaperCard,
  Stamp,
  Badge,
  Tape,
  Button,
  Modal,
  Input,
  Textarea,
  useToast,
} from "@/components/ui";
import { Breadcrumb } from "@/components/marketing/MarketingBits";
import { getJob } from "@/lib/data";

const TEAM_TONE: Record<string, "neutral" | "green" | "red" | "blue" | "gold" | "sunset"> = {
  Produit: "blue",
  Design: "gold",
  Communauté: "green",
  Marketing: "sunset",
  Opérations: "neutral",
};

// Per-job enriched content
const JOB_DETAILS: Record<
  string,
  {
    intro: string;
    responsabilites: string[];
    profil: string[];
    avantages: string[];
    stack?: string[];
  }
> = {
  "senior-mobile": {
    intro:
      "Tu seras la cheville ouvrière de l'expérience mobile. L'appli, c'est le cœur de TMP — une session de photo commence et finit sur mobile. On cherche quelqu'un qui sait qu'un component bien conçu vaut mille réunions.",
    responsabilites: [
      "Concevoir et implémenter des fonctionnalités React Native pour iOS & Android",
      "Optimiser les performances — start-up time, animations, carte temps réel",
      "Travailler avec le designer pour donner vie à l'esthétique carnet-de-voyage",
      "Participer aux astreintes sur les incidents critiques (rare mais prévu)",
      "Mentorer les dev juniors et co-définir les standards de code",
    ],
    profil: [
      "5+ ans d'expérience en développement mobile (React Native ou natif)",
      "Maîtrise des patterns de navigation et state management (Zustand, Jotai…)",
      "Sensibilité aux performances UI (Reanimated, Skia, Hermes)",
      "Expérience avec des systèmes GPS en temps réel, un plus",
      "Français courant — l'équipe est francophone",
    ],
    avantages: [
      "Mac M3 Max de ton choix, dès le premier jour",
      "Budget voyage 1 000 €/an pour tester l'appli",
      "Semaine de 4 jours — le vendredi est à toi",
      "Remote total ou bureau Paris 11e",
      "BSPCE dès l'arrivée",
    ],
    stack: ["React Native", "TypeScript", "Reanimated", "Supabase", "Expo"],
  },
  "product-designer": {
    intro:
      "Tu es le/la gardien·ne de l'esthétique carnet-de-voyage. Chaque écran doit sentir le papier chaud et la lumière dorée. On cherche quelqu'un qui pense en systèmes mais ressent en polaroïds.",
    responsabilites: [
      "Concevoir des expériences de A à Z : discovery → wireframe → prototype → specs",
      "Maintenir et faire évoluer le Design System (tokens, composants, patterns)",
      "Collaborer étroitement avec les devs pour une implémentation fidèle",
      "Conduire des tests utilisateurs réguliers avec de vrais voyageurs",
      "Produire des specs accessibles (a11y) sans perdre l'âme visuelle",
    ],
    profil: [
      "Portfolio solide montrant du travail mobile soigné",
      "Maîtrise de Figma (variables, auto-layout, component library)",
      "Expérience avec des Design Systems à l'échelle d'un produit",
      "Sensibilité typographique et passion pour les détails visuels",
      "Curiosité pour la psychologie du voyage et des utilisateurs nomades",
    ],
    avantages: [
      "iPads et Pencil offerts pour les prototypes papier",
      "Budget voyage 1 000 €/an",
      "Semaine de 4 jours",
      "Accès à Figma, Principle, et tous les outils premium",
      "BSPCE",
    ],
    stack: ["Figma", "Principle", "Maze", "Zeplin"],
  },
  "community-lead": {
    intro:
      "Tu seras la voix et le cœur de notre communauté. 48 000 voyageurs à animer, fédérer, inspirer. On cherche quelqu'un qui a déjà vécu dans des auberges de jeunesse et connaît les vraies connexions humaines.",
    responsabilites: [
      "Animer la communauté sur tous les canaux (app, Discord, Instagram, TikTok)",
      "Identifier et chouchouter les ambassadeurs locaux dans 20+ villes",
      "Produire des contenus inspirants : stories de voyage, guides photo, témoignages",
      "Organiser des meetups photo dans les grandes villes européennes",
      "Être la liaison entre les utilisateurs et l'équipe Produit",
    ],
    profil: [
      "Expérience de community management dans une app mobile ou plateforme sociale",
      "Storytelling naturel — tu sais écrire une légende Instagram qui donne envie",
      "Multilinguisme apprécié (FR / EN / ES / PT)",
      "Passion du voyage documentée (carnet, blog, compte Insta)",
      "À l'aise avec les données d'engagement pour mesurer l'impact",
    ],
    avantages: [
      "Budget voyage 1 000 €/an — tu dois aller dans les villes partenaires",
      "Remote total",
      "Semaine de 4 jours",
      "Budget création de contenu (photo, vidéo)",
      "BSPCE",
    ],
  },
  "backend-engineer": {
    intro:
      "Tu construis l'infrastructure invisible qui permet à deux inconnus de se croiser au bon moment, au bon endroit. GPS, matchmaking, karma, galeries chiffrées — tout passe par toi.",
    responsabilites: [
      "Concevoir et maintenir les APIs REST et WebSocket (Supabase / Postgres)",
      "Optimiser les requêtes géospatiales (PostGIS) pour la carte temps réel",
      "Implémenter le système de karma et les calculs de matching",
      "Garantir la sécurité des données (RGPD, chiffrement des galeries)",
      "Contribuer à l'architecture des Edge Functions (Deno / Vercel)",
    ],
    profil: [
      "4+ ans d'expérience backend (Node.js / TypeScript fortement préféré)",
      "Bonne maîtrise de PostgreSQL — indexes, RLS, triggers",
      "Expérience avec Supabase ou un BaaS similaire, un plus",
      "Sensibilité sécurité et RGPD",
      "Capacité à estimer correctement la complexité d'un ticket",
    ],
    avantages: [
      "Mac offert",
      "Budget voyage 1 000 €/an",
      "Semaine de 4 jours",
      "Remote ou Lisbonne / Paris",
      "BSPCE",
    ],
    stack: ["TypeScript", "Node.js", "Supabase", "PostgreSQL", "PostGIS", "Redis"],
  },
  "growth-marketer": {
    intro:
      "Tu feras grandir TMP sans acheter notre croissance. Bouche-à-oreille, SEO, partenariats voyage, campagnes créatives — tu aimes construire des moteurs durables, pas des feux de paille.",
    responsabilites: [
      "Définir et exécuter la stratégie d'acquisition organique (SEO, ASO, contenu)",
      "Gérer les partenariats avec des créateurs voyage et des agences tourisme",
      "Construire les tunnels de conversion et itérer sur les landing pages",
      "Suivre les KPIs (CAC, LTV, retention) et les présenter en board mensuel",
      "Coordonner les campagnes avec le community lead et le designer",
    ],
    profil: [
      "Expérience growth marketing dans une startup mobile ou travel",
      "À l'aise avec les outils d'analyse (Mixpanel, Amplitude, Looker)",
      "Sensibilité créative — tu sais reconnaître un bon brief",
      "Curiosité pour les mécaniques virales et le referral",
      "Français natif, anglais courant",
    ],
    avantages: [
      "Budget expérimentation illimité (dans la raison)",
      "Budget voyage 1 000 €/an",
      "Semaine de 4 jours",
      "Bureau Paris 11e ou remote",
      "BSPCE",
    ],
  },
  "trust-safety": {
    intro:
      "Tu es le bouclier de la communauté. Fraude, harcèlement, faux profils, contenu inapproprié — tu construis les systèmes et les processus pour que TMP reste un espace sûr et bienveillant.",
    responsabilites: [
      "Gérer la file de modération et les escalades critiques",
      "Développer les politiques de confiance & sécurité en collaboration avec le légal",
      "Construire des outils automatiques de détection (ML, règles, signaux)",
      "Former l'équipe support à la gestion des cas sensibles",
      "Collaborer avec les régulateurs et associations de protection des voyageurs",
    ],
    profil: [
      "Expérience en Trust & Safety dans une plateforme communautaire",
      "Rigueur analytique : à l'aise avec SQL pour extraire des signaux d'abus",
      "Résilience émotionnelle face à des contenus difficiles",
      "Connaissance des législations RGPD et DSA",
      "Empathie forte pour les victimes et les utilisateurs vulnérables",
    ],
    avantages: [
      "Soutien psychologique offert (sessions avec thérapeute partenaire)",
      "Budget voyage 1 000 €/an",
      "Semaine de 4 jours",
      "Remote total",
      "BSPCE",
    ],
  },
};

const DEFAULT_DETAILS = {
  intro: "Un poste clé dans notre équipe en pleine croissance.",
  responsabilites: [
    "Contribuer à la mission de TMP",
    "Travailler en collaboration étroite avec toute l'équipe",
    "Itérer vite et apprendre encore plus vite",
  ],
  profil: [
    "Passionné·e par le voyage et la photographie",
    "À l'aise dans un environnement startup",
    "Communicant·e clair et bienveillant·e",
  ],
  avantages: [
    "Budget voyage 1 000 €/an",
    "Semaine de 4 jours",
    "Remote ou Paris",
    "BSPCE",
  ],
};

export default function CareerDetailPage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const job = getJob(slug);
  const details = JOB_DETAILS[slug] ?? DEFAULT_DETAILS;

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fileNote, setFileNote] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast.push(t("Merci de remplir ton nom et ton e-mail."), "err");
      return;
    }
    toast.push(t("Candidature envoyée ! On revient vers toi sous 5 jours. ✈️"), "ok");
    setModalOpen(false);
    setName("");
    setEmail("");
    setMessage("");
    setFileNote("");
  };

  return (
    <>
      {/* ── Header band ── */}
      <section className="relative paper bg-paper-warm border-b-[1.5px] border-[var(--ink-line)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 relative">
          <div className="hidden md:block absolute right-8 top-10">
            <Stamp color="green" size={100} fontSize={9} rotate={10}>
              {t("POSTULER\nMAINT.\n★")}
            </Stamp>
          </div>

          <Breadcrumb
            items={[
              { href: "/", label: t("Accueil") },
              { href: "/careers", label: t("Carrières") },
              { label: job.title },
            ]}
          />

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <Badge tone={TEAM_TONE[job.team] ?? "neutral"} dot>
              {job.team}
            </Badge>
            <Badge tone="neutral">
              <Briefcase size={11} className="mr-1" />
              {job.type}
            </Badge>
            <Badge tone="neutral">
              <MapPin size={11} className="mr-1" />
              {job.location}
            </Badge>
            <Badge tone="blue">
              <Clock size={11} className="mr-1" />
              {t("Temps plein")}
            </Badge>
          </div>

          <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,5vw,52px)] tracking-[-0.03em] leading-[1.05] max-w-3xl mt-4">
            {job.title}
          </h1>

          <p className="font-[family-name:var(--font-serif)] text-ink-faded mt-4 max-w-2xl leading-relaxed text-lg">
            {details.intro}
          </p>

          <div className="mt-8">
            <Button
              variant="gold"
              size="lg"
              icon={<Send size={17} />}
              onClick={() => setModalOpen(true)}
            >
              {t("Postuler maintenant")}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Responsabilités */}
            <PaperCard shadow="soft" className="p-7 relative">
              <div className="absolute -top-3 left-8">
                <Tape color="cream" width={48} height={20} rotate={-5} />
              </div>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-tight mb-5">
                {t("Tes responsabilités")}
              </h2>
              <ul className="space-y-3">
                {details.responsabilites.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={17}
                      className="text-stamp-green shrink-0 mt-0.5"
                    />
                    <span className="font-[family-name:var(--font-serif)] text-[15px] leading-snug">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </PaperCard>

            {/* Profil */}
            <PaperCard shadow="soft" className="p-7 relative">
              <div className="absolute -top-3 right-8">
                <Tape color="blue" width={48} height={20} rotate={5} />
              </div>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-tight mb-5">
                {t("Le profil qu'on cherche")}
              </h2>
              <ul className="space-y-3">
                {details.profil.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight
                      size={16}
                      className="text-gold-deep shrink-0 mt-0.5"
                    />
                    <span className="font-[family-name:var(--font-serif)] text-[15px] leading-snug">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </PaperCard>

            {/* Stack */}
            {details.stack && (
              <PaperCard shadow="soft" className="p-7">
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-tight mb-5">
                  {t("Stack & outils")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {details.stack.map((s) => (
                    <span
                      key={s}
                      className="font-[family-name:var(--font-type)] text-[12px] border-[1.5px] border-ink rounded-[4px] px-2.5 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </PaperCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avantages */}
            <PaperCard shadow="gold" tilt={1} className="p-6 relative">
              <div className="absolute -top-3 left-6">
                <Tape color="cream" width={44} height={18} rotate={-5} />
              </div>
              <div className="absolute -right-3 -top-5">
                <Stamp color="gold" size={60} fontSize={8} rotate={12}>
                  {t("AVANTAGES\n★")}
                </Stamp>
              </div>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl tracking-tight mb-4">
                {t("Ce qu'on offre")}
              </h3>
              <ul className="space-y-3">
                {details.avantages.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-gold-deep mt-0.5">✦</span>
                    <span className="font-[family-name:var(--font-serif)] text-[14px] leading-snug">
                      {a}
                    </span>
                  </li>
                ))}
              </ul>
            </PaperCard>

            {/* CTA card */}
            <PaperCard shadow="ink" className="p-6 bg-ink text-paper-warm">
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-light -rotate-1 mb-2">
                {t("prêt·e ?")}
              </div>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-3">
                {t("Rejoins l'équipe.")}
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-paper-warm/70 text-[14px] mb-5 leading-relaxed">
                {t("Envoie ta candidature — on répond sous 5 jours ouvrés, toujours.")}
              </p>
              <Button
                variant="gold"
                full
                icon={<Send size={15} />}
                onClick={() => setModalOpen(true)}
              >
                {t("Postuler")}
              </Button>
              <div className="mt-3 text-center">
                <Link
                  href="/careers"
                  className="font-[family-name:var(--font-serif)] text-[13px] text-paper-warm/60 hover:text-paper-warm transition"
                >
                  {t("← Voir toutes les offres")}
                </Link>
              </div>
            </PaperCard>

            {/* Location info */}
            <PaperCard shadow="soft" className="p-5">
              <div className="flex items-center gap-2 text-ink-faded mb-2">
                <MapPin size={14} />
                <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-wider">
                  {t("Lieu")}
                </span>
              </div>
              <p className="font-[family-name:var(--font-serif)] font-semibold">
                {job.location}
              </p>
            </PaperCard>
          </div>
        </div>
      </section>

      {/* ── Application Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("Postuler — {{jobTitle}}", { jobTitle: job.title })}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              {t("Annuler")}
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={<Send size={14} />}
              onClick={handleSubmit}
            >
              {t("Envoyer ma candidature")}
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] mb-4">
            {t("Dis-nous qui tu es en quelques lignes. On lit chaque candidature personnellement.")}
          </p>

          <div className="grid sm:grid-cols-2 gap-0">
            <Input
              label={t("Ton prénom & nom")}
              placeholder="Claire Bernard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label={t("Ton e-mail")}
              type="email"
              placeholder="claire@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Textarea
            label={t("Pourquoi TMP ?")}
            placeholder={t("Raconte-nous ce qui te donne envie de nous rejoindre, en quelques phrases sincères…")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />

          <div className="border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] p-4 bg-paper-warm/50">
            <div className="flex items-center gap-2 text-ink-faded mb-2">
              <Paperclip size={15} />
              <span className="font-[family-name:var(--font-hand)] text-lg">
                {t("Lien vers ton portfolio / LinkedIn (optionnel)")}
              </span>
            </div>
            <input
              type="url"
              placeholder="https://portfolio.claire.design"
              value={fileNote}
              onChange={(e) => setFileNote(e.target.value)}
              className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] text-[14px] text-ink outline-none focus:shadow-ink-sm transition"
            />
          </div>

          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-3">
            {t("Tes données sont traitées uniquement pour le recrutement, conformément au RGPD.")}
          </p>
        </div>
      </Modal>
    </>
  );
}
