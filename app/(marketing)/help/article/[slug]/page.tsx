"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, ArrowLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/marketing/MarketingBits";
import { PaperCard, Badge, Chip, Button, Stamp, useToast } from "@/components/ui";
import { getHelpArticle, helpArticles } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

/* ── Inline rich article content keyed by slug ───────────────────────── */
const ARTICLE_BODIES: Record<string, { intro: string; steps: string[]; note?: string; warning?: string }> = {
  "creer-compte": {
    intro:
      "Créer un compte Take Me Pic ne prend que quelques minutes. Voici comment procéder depuis l'application mobile.",
    steps: [
      "Téléchargez l'application sur l'App Store ou Google Play et lancez-la.",
      "Appuyez sur « Créer un compte » et renseignez votre adresse e-mail et un mot de passe sécurisé.",
      "Un code à 6 chiffres vous est envoyé par SMS sur votre numéro de téléphone — saisissez-le pour valider.",
      "Ajoutez une photo de profil et quelques mots sur vous. Un bon profil multiplie par 3 vos chances de trouver un photographe.",
      "Pour le badge « Profil vérifié », photographiez votre pièce d'identité. La vérification prend moins de 24 h.",
    ],
    note:
      "Votre pièce d'identité est analysée par notre prestataire certifié puis immédiatement supprimée. Nous ne conservons que le statut de vérification.",
  },
  "trouver-photographe": {
    intro:
      "L'application vous montre, en temps réel, les membres disponibles autour de vous. Voici comment envoyer votre premier pli.",
    steps: [
      "Ouvrez la carte depuis l'onglet principal. Les icônes dorées représentent les membres disponibles.",
      "Appuyez sur un profil pour consulter sa note, ses photos et ses langues.",
      "Appuyez sur « Envoyer un pli » et choisissez le spot ou décrivez la photo souhaitée.",
      "Le membre reçoit une notification instantanée. En moyenne, la réponse arrive en moins de 4 minutes.",
      "Rendez-vous au spot convenu et profitez ! La session est automatiquement enregistrée.",
    ],
    note: "Si personne n'est disponible immédiatement, vous pouvez planifier une session pour plus tard.",
  },
  "devenir-disponible": {
    intro:
      "Aider les autres photographes est le cœur de Take Me Pic. Voici comment activer votre disponibilité et commencer à gagner du karma.",
    steps: [
      "Depuis votre profil, activez le bouton « Je suis disponible pour aider ».",
      "Choisissez votre rayon d'action : 200 m, 500 m ou 1 km.",
      "Votre icône apparaît sur la carte des autres membres dans ce périmètre.",
      "À chaque pli accepté, vous recevez une notification et le détail du spot souhaité.",
      "Après la session, les deux parties évaluent la rencontre — les bonnes notes font monter votre karma plus vite.",
    ],
    note:
      "Votre position GPS n'est partagée que pendant une session active, jamais en arrière-plan.",
  },
  "gerer-karma": {
    intro:
      "Le karma est la monnaie d'échange de la communauté. Il récompense l'entraide et donne accès à des avantages exclusifs.",
    steps: [
      "Vous gagnez du karma chaque fois que vous prenez une photo pour quelqu'un : 10 points de base + un bonus selon la note reçue.",
      "Aider lors de l'heure dorée (30 min avant le coucher ou après le lever du soleil) double les points.",
      "Vous dépensez du karma lorsque vous faites appel à quelqu'un pour une photo. Le coût varie selon la durée.",
      "Les membres Premium « Première classe » gagnent 2× plus de karma à chaque session.",
      "Consultez votre tableau de bord karma depuis Profil → Karma pour voir votre historique complet.",
    ],
    warning:
      "Le karma ne peut pas être acheté ni transféré — il reflète uniquement votre contribution à la communauté.",
  },
  "confidentialite-gps": {
    intro:
      "Votre vie privée est notre priorité. Voici exactement comment fonctionne le partage de position dans Take Me Pic.",
    steps: [
      "La localisation n'est jamais active en arrière-plan. Elle est demandée uniquement quand vous ouvrez la carte.",
      "Votre position exacte n'est jamais partagée : les autres membres ne voient qu'une zone approximative (rayon 200 m).",
      "Pendant une session active, votre position est partagée en temps réel avec votre partenaire de session uniquement.",
      "À la fin de la session (ou après 30 min sans activité), le partage s'arrête automatiquement.",
      "Vous pouvez désactiver complètement la géolocalisation dans Réglages → Confidentialité → Position.",
    ],
    note:
      "Toutes les données de localisation sont chiffrées en transit (TLS 1.3) et ne sont jamais vendues à des tiers.",
  },
  "signaler-bloquer": {
    intro:
      "La communauté Take Me Pic repose sur la bienveillance. Voici comment nous aider à maintenir un espace sûr.",
    steps: [
      "Pour signaler un contenu, appuyez sur les trois points (⋯) en haut à droite d'un profil ou d'une publication.",
      "Choisissez la raison du signalement : contenu inapproprié, spam, comportement déplacé ou autre.",
      "Notre équipe Confiance & Sécurité examine chaque signalement sous 24 h.",
      "Pour bloquer quelqu'un, allez sur son profil → Bloquer. Cette personne ne pourra plus vous contacter ni voir votre profil.",
      "Vous pouvez consulter et gérer vos blocages depuis Réglages → Confidentialité → Comptes bloqués.",
    ],
    warning:
      "En cas d'urgence ou de danger immédiat, contactez les services d'urgence (15, 17, 18) avant tout.",
  },
  "abonnement-premium": {
    intro:
      "L'abonnement Première classe débloque le meilleur de Take Me Pic. Voici comment le gérer en toute simplicité.",
    steps: [
      "Depuis Profil → Abonnement, choisissez entre le mensuel (4,99 €) et l'annuel (39,99 €, -33 %).",
      "L'essai de 7 jours est gratuit et ne débite que si vous ne résiliez pas avant la fin.",
      "Pour changer de formule, appuyez sur « Modifier mon abonnement » — le changement prend effet au prochain renouvellement.",
      "Pour annuler, appuyez sur « Résilier l'abonnement ». Vous gardez l'accès Premium jusqu'à la fin de la période en cours.",
      "Pour un remboursement (dans les 14 jours suivant le premier achat), contactez le support avec votre reçu.",
    ],
    note: "Les abonnements sont gérés via l'App Store ou Google Play. Les remboursements suivent leurs politiques respectives.",
  },
  "mode-famille": {
    intro:
      "Le mode famille vous permet de suivre vos proches (enfants, personnes âgées) sur la carte, avec leur accord.",
    steps: [
      "Depuis Réglages → Famille, appuyez sur « Inviter un proche » et saisissez son adresse e-mail.",
      "Votre proche reçoit une invitation et doit l'accepter depuis son application.",
      "Une fois acceptée, leur position apparaît sur votre carte avec un badge famille distinctif.",
      "Chaque membre du groupe peut voir les autres et recevoir une notification s'ils quittent une zone prédéfinie.",
      "N'importe qui peut quitter le groupe famille à tout moment depuis Réglages → Famille → Quitter le groupe.",
    ],
    note:
      "Le mode famille respecte les mêmes règles de confidentialité GPS que le reste de l'application : la position est partagée en temps réel uniquement lorsque la personne a l'app ouverte.",
  },
};

/* ── Utility: get related articles (same category, excluding current) ── */
function getRelated(slug: string, category: string): typeof helpArticles {
  return helpArticles.filter((a) => a.category === category && a.slug !== slug).slice(0, 3);
}

export default function HelpArticlePage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const { push } = useToast();

  const article = getHelpArticle(slug);
  const body = ARTICLE_BODIES[slug] ?? ARTICLE_BODIES[article.slug] ?? {
    intro: article.excerpt,
    steps: [
      "Ouvrez l'application et accédez à la section concernée.",
      "Suivez les instructions à l'écran.",
      "En cas de doute, n'hésitez pas à contacter notre support.",
    ],
  };

  const related = getRelated(slug, article.category);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  function handleVote(v: "up" | "down") {
    if (vote === v) return;
    setVote(v);
    push(
      v === "up"
        ? t("Merci pour votre retour ! 🙏")
        : t("Merci — nous allons améliorer cet article."),
      v === "up" ? "ok" : "info"
    );
  }

  // Category → badge tone
  const TONE_MAP: Record<string, "gold" | "blue" | "green" | "neutral"> = {
    Démarrer: "green",
    Compte: "gold",
    Sécurité: "blue",
    Paiements: "gold",
  };
  const badgeTone = TONE_MAP[article.category] ?? "neutral";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { href: "/", label: t("Accueil") },
            { href: "/help", label: t("Centre d'aide") },
            { href: `/help/${article.category.toLowerCase()}`, label: article.category },
            { label: article.title },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Article body */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge tone={badgeTone} dot>
                {article.category}
              </Badge>
              <div className="flex items-center gap-1.5 font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-[0.08em]">
                <Clock size={11} />
                {t("Lecture 3 min")}
              </div>
            </div>
            <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(26px,4vw,40px)] tracking-[-0.02em] leading-tight text-ink mb-4">
              {article.title}
            </h1>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[15px] leading-relaxed">
              {body.intro}
            </p>
          </div>

          {/* Steps */}
          <PaperCard shadow="ink" className="p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={16} className="text-gold-deep" />
              <h2 className="font-[family-name:var(--font-hand)] text-xl text-gold-deep">
                {t("Étapes à suivre")}
              </h2>
            </div>
            <ol className="space-y-4">
              {body.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-ink text-paper-warm font-[family-name:var(--font-type)] text-[12px] flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </PaperCard>

          {/* Note callout */}
          {body.note && (
            <PaperCard shadow="gold" className="p-5 mb-6 border-gold-deep/40">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">💡</span>
                <p className="font-[family-name:var(--font-serif)] italic text-[14px] text-ink leading-relaxed">
                  {body.note}
                </p>
              </div>
            </PaperCard>
          )}

          {/* Warning callout */}
          {body.warning && (
            <PaperCard shadow="red" className="p-5 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">⚠️</span>
                <p className="font-[family-name:var(--font-serif)] italic text-[14px] text-ink leading-relaxed">
                  {body.warning}
                </p>
              </div>
            </PaperCard>
          )}

          {/* Was this article helpful? */}
          <PaperCard shadow="soft" className="p-6 mt-8">
            <h3 className="font-[family-name:var(--font-hand)] text-xl text-ink mb-5 -rotate-1">
              {t("Cet article vous a-t-il aidé ?")}
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={vote === "up" ? "gold" : "paper"}
                size="sm"
                icon={<ThumbsUp size={16} />}
                onClick={() => handleVote("up")}
                disabled={vote !== null && vote !== "up"}
              >
                {t("Oui, merci !")}
              </Button>
              <Button
                variant={vote === "down" ? "ink" : "ghost"}
                size="sm"
                icon={<ThumbsDown size={16} />}
                onClick={() => handleVote("down")}
                disabled={vote !== null && vote !== "down"}
              >
                {t("Pas vraiment")}
              </Button>

              {vote === "down" && (
                <div className="w-full mt-3 pt-3 border-t-[1.5px] border-dashed border-[var(--ink-line)]">
                  <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-2">
                    {t("Désolé de ne pas avoir répondu à votre question.")}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-gold-deep hover:text-ink transition"
                  >
                    {t("Contacter le support")}
                    <ChevronRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </PaperCard>

          {/* Back link */}
          <div className="mt-6">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-[14px] text-ink-faded hover:text-ink transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              {t("Retour au centre d'aide")}
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Stamp */}
          <div className="flex justify-center py-2">
            <Stamp color="green" shape="circle" size={88} fontSize={9} rotate={-12}>
              {`AIDE\n★\nCENTRE`}
            </Stamp>
          </div>

          {/* Category filter */}
          <PaperCard shadow="soft" className="p-5">
            <h4 className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-3">
              {t("Rubrique")}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="gold" variant="filled" size="sm">
                {article.category}
              </Chip>
            </div>
          </PaperCard>

          {/* Related articles */}
          {related.length > 0 && (
            <PaperCard shadow="soft" className="p-5">
              <h4 className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-4">
                {t("Articles liés")}
              </h4>
              <ul className="space-y-3">
                {related.map((rel) => (
                  <li key={rel.slug}>
                    <Link
                      href={`/help/article/${rel.slug}`}
                      className="flex items-start gap-2.5 group"
                    >
                      <BookOpen
                        size={13}
                        className="text-gold-deep shrink-0 mt-0.5"
                      />
                      <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink group-hover:text-gold-deep transition leading-snug">
                        {rel.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </PaperCard>
          )}

          {/* Contact block */}
          <PaperCard shadow="none" border className="p-5 text-center">
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-3">
              {t("Vous avez besoin d'une aide personnalisée ?")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-gold-deep hover:text-ink transition"
            >
              {t("Écrire au support")}
              <ChevronRight size={13} />
            </Link>
          </PaperCard>
        </aside>
      </div>
    </div>
  );
}
