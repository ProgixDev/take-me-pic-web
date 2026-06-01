"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  Button,
  PaperCard,
  Stamp,
  Tabs,
  SectionHeading,
  Tape,
  useToast,
} from "@/components/ui";
import { plans } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const FAQ = [
  {
    q: "Y a-t-il un engagement pour le plan mensuel ?",
    a: "Aucun. Tu peux annuler à tout moment depuis ton profil, sans frais ni délai de préavis.",
  },
  {
    q: "Comment fonctionne l'essai gratuit de 7 jours ?",
    a: "Aucune carte bancaire requise au démarrage. Si tu décides de continuer, tu es débité·e à la fin du 7e jour.",
  },
  {
    q: "Puis-je basculer d'un plan à l'autre ?",
    a: "Oui, à tout moment. Si tu passes au plan annuel en cours de mois, on calcule un prorata automatique.",
  },
  {
    q: "Que se passe-t-il si j'annule mon abonnement ?",
    a: "Tu gardes les avantages Première classe jusqu'à la fin de la période déjà payée. Tes photos et ton karma restent intacts.",
  },
  {
    q: "Le karma est-il préservé si je passe du plan gratuit au plan payant ?",
    a: "Absolument. Ton karma, tes badges et tes photos sont liés à ton compte, pas à ton plan.",
  },
  {
    q: "Comment est sécurisé le paiement ?",
    a: "Les paiements sont traités par Stripe. Nous ne stockons jamais tes informations bancaires.",
  },
];

function PricingCard({
  plan,
  billing,
}: {
  plan: (typeof plans)[0];
  billing: "monthly" | "annual";
}) {
  const t = useT();
  const toast = useToast();

  // For monthly billing toggle: show annualized monthly for annual plan
  const displayedPrice =
    billing === "annual" && plan.id === "monthly"
      ? "3,33 €"
      : billing === "monthly" && plan.id === "annual"
      ? "3,33 €"
      : plan.price;

  const displayedPeriod =
    billing === "annual" && plan.id === "monthly"
      ? t("/ mois (facturé 39,99 €/an)")
      : plan.period;

  return (
    <PaperCard
      shadow={plan.highlight ? "gold" : "soft"}
      className={`relative flex flex-col p-6 md:p-8 ${
        plan.highlight
          ? "ring-2 ring-gold-deep ring-offset-2 ring-offset-paper-warm"
          : ""
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-4 -right-4 z-10">
          <Stamp color="gold" size={90} rotate={12} fontSize={9}>
            {`-33 %\n★\nMEILLEUR\nPRIX`}
          </Stamp>
        </div>
      )}

      {plan.id === "free" && (
        <div className="absolute -top-3 -left-3">
          <Tape color="cream" rotate={-8} width={60} height={22} />
        </div>
      )}

      <div className="mb-4">
        <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep -rotate-1 mb-0.5">
          {plan.id === "free"
            ? t("pour les curieux")
            : plan.id === "annual"
            ? t("le meilleur choix")
            : t("sans engagement")}
        </div>
        <h3 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-[-0.02em]">
          {plan.id === "free"
            ? t("Carnet")
            : plan.id === "monthly"
            ? t("Première classe")
            : t("Première classe")}
        </h3>
        {plan.id !== "free" && (
          <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
            {plan.id === "monthly" ? t("Mensuel") : t("Annuel")}
          </div>
        )}
      </div>

      <div className="mb-6">
        <span className="font-[family-name:var(--font-serif)] font-bold text-4xl tracking-[-0.03em]">
          {plan.id === "free"
            ? t("Gratuit")
            : billing === "annual" && plan.id === "monthly"
            ? "3,33 €"
            : plan.price}
        </span>
        {plan.id !== "free" && (
          <span className="text-ink-faded font-[family-name:var(--font-serif)] text-sm ml-1">
            {billing === "annual" && plan.id === "monthly"
              ? t("/ mois (facturé 39,99 €/an)")
              : displayedPeriod}
          </span>
        )}
        {plan.id === "monthly" && billing === "annual" && (
          <div className="mt-1 font-[family-name:var(--font-hand)] text-sm text-stamp-green">
            {t("✓ 2 mois offerts !")}
          </div>
        )}
      </div>

      <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-sm mb-6">
        {plan.tagline}
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${
                plan.highlight ? "text-gold-deep" : "text-stamp-green"
              }`}
            />
            <span className="font-[family-name:var(--font-serif)] text-[14px] text-ink">
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.highlight ? "gold" : plan.id === "free" ? "paper" : "ink"}
        full
        size="lg"
        onClick={() =>
          toast.push(
            plan.id === "free"
              ? t("Téléchargement en cours… 📲")
              : t("Essai gratuit de 7 jours activé ! ✨"),
            "ok"
          )
        }
      >
        {plan.cta}
      </Button>

      {plan.id !== "free" && (
        <p className="text-center font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded mt-3">
          {t("Sans carte · Annulation libre")}
        </p>
      )}
    </PaperCard>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b-[1.5px] border-dashed border-[var(--ink-line)]">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-[family-name:var(--font-serif)] font-semibold text-[15px]">
          {q}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-ink-faded" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-ink-faded" />
        )}
      </button>
      {open && (
        <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] pb-5 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const t = useT();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const toast = useToast();

  const testimonials = [
    {
      quote: t("Passer en Première classe a littéralement triplé mes matchs. En deux jours j'avais des dizaines de demandes."),
      name: "Léo M.",
      city: t("Lisbonne"),
      avatar: "12",
    },
    {
      quote: t("Je ne savais pas si ça valait la peine de payer. Après l'essai gratuit, la question ne se posait plus."),
      name: "Claire B.",
      city: t("Paris"),
      avatar: "47",
    },
    {
      quote: t("Le karma doublé m'a permis d'accéder aux spots secrets en moins d'une semaine. Magique."),
      name: "Inès R.",
      city: t("Marrakech"),
      avatar: "22",
    },
  ];

  const faqItems = FAQ.map((item) => ({
    q: t(item.q as Parameters<typeof t>[0]),
    a: t(item.a as Parameters<typeof t>[0]),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("combien ça coûte ?")}
        title={t("Des tarifs simples,")}
        highlight={t("sans surprise")}
        sub={t("Commence gratuitement, passe en Première classe quand tu veux. Annule quand tu veux.")}
        stamp={`PREMIERE\nCLASSE\n★`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Billing toggle */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <Tabs
            tabs={[
              { key: "monthly", label: t("Mensuel") },
              { key: "annual", label: t("Annuel · -33 %") },
            ]}
            value={billing}
            onChange={(k) => setBilling(k as "monthly" | "annual")}
          />
          {billing === "annual" && (
            <div className="flex items-center gap-2 font-[family-name:var(--font-hand)] text-lg text-stamp-green animate-fade-up">
              <Sparkles size={16} />
              <span>{t("2 mois offerts — c'est notre meilleur tarif !")}</span>
            </div>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Feature comparison table */}
        <section className="mb-20">
          <SectionHeading
            eyebrow={t("tout comparer")}
            title={t("Ce qui est inclus")}
            highlight={t("dans chaque plan")}
            center
            className="mb-10"
          />

          <PaperCard shadow="soft" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-[family-name:var(--font-serif)]">
                <thead>
                  <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)] bg-paper-warm/50">
                    <th className="text-left px-5 py-4 font-semibold text-ink">
                      {t("Fonctionnalité")}
                    </th>
                    <th className="text-center px-5 py-4 font-semibold">
                      {t("Carnet")}
                    </th>
                    <th className="text-center px-5 py-4 font-semibold text-gold-deep">
                      {t("Première classe")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [t("Trouver un photographe à proximité"), true, true],
                    [t("Prendre des photos pour les autres"), true, true],
                    [t("Karma de base"), true, true],
                    [t("Galerie de session 24 h"), true, true],
                    [t("Accès communauté & spots publics"), true, true],
                    [t("Profil mis en avant (3× plus de matchs)"), false, true],
                    [t("Spots secrets hors guide"), false, true],
                    [t("Karma doublé par session"), false, true],
                    [t("Galerie illimitée"), false, true],
                    [t("Aucune publicité"), false, true],
                    [t("Badge ambassadeur"), false, true],
                    [t("Support prioritaire"), false, true],
                    [t("Accès anticipé aux nouveautés"), false, true],
                  ].map(([feature, carnet, premium], i) => (
                    <tr
                      key={i}
                      className="border-b border-dashed border-[var(--ink-line)]/40 hover:bg-paper-warm/30 transition"
                    >
                      <td className="px-5 py-3.5 text-ink">{feature as string}</td>
                      <td className="px-5 py-3.5 text-center">
                        {carnet ? (
                          <Check size={16} className="mx-auto text-stamp-green" />
                        ) : (
                          <span className="text-ink-faded opacity-30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {premium ? (
                          <Check size={16} className="mx-auto text-gold-deep" />
                        ) : (
                          <span className="text-ink-faded opacity-30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PaperCard>
        </section>

        {/* Social proof band */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <PaperCard
                key={i}
                shadow="soft"
                tilt={[-1, 0, 1][i]}
                className="p-6"
              >
                <div className="font-[family-name:var(--font-hand)] text-3xl text-gold-deep mb-2 leading-none">
                  "
                </div>
                <p className="font-[family-name:var(--font-serif)] italic text-ink text-[14px] leading-relaxed mb-4">
                  {item.quote}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/60?img=${item.avatar}`}
                    alt={item.name}
                    className="w-9 h-9 rounded-full border-[1.5px] border-ink object-cover"
                  />
                  <div>
                    <div className="font-[family-name:var(--font-serif)] font-semibold text-sm">
                      {item.name}
                    </div>
                    <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded">
                      {item.city}
                    </div>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 max-w-2xl mx-auto">
          <SectionHeading
            eyebrow={t("questions fréquentes")}
            title={t("Tu te poses des questions ?")}
            highlight={t("Nous aussi.")}
            center
            className="mb-10"
          />
          <PaperCard shadow="soft" className="px-6 py-2">
            {faqItems.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </PaperCard>
          <p className="text-center font-[family-name:var(--font-serif)] text-ink-faded text-sm mt-6">
            {t("Une autre question ?")}{" "}
            <Link
              href="/help"
              className="underline underline-offset-2 hover:text-ink transition"
            >
              {t("Consulte notre aide")}
            </Link>{" "}
            {t("ou")}{" "}
            <button
              className="underline underline-offset-2 hover:text-ink transition cursor-pointer"
              onClick={() =>
                toast.push(t("Message envoyé à notre équipe ! 📬"), "info")
              }
            >
              {t("écris-nous")}
            </button>
            .
          </p>
        </section>
      </div>

      <CtaBand />
    </>
  );
}
