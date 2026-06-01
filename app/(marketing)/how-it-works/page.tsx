"use client";

import Link from "next/link";
import {
  Camera,
  MapPin,
  Heart,
  Smartphone,
  ShieldCheck,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import {
  PaperCard,
  Stamp,
  Tape,
  SectionHeading,
  Button,
  Chip,
} from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { useT } from "@/i18n/I18nProvider";

/* ------------------------------------------------------------------ */
/* Local sub-components                                                 */
/* ------------------------------------------------------------------ */

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  body: string;
  stampColor: "red" | "blue" | "green" | "gold" | "ink";
  tilt: number;
}

interface Faq {
  q: string;
  a: string;
}

function FaqItem({ q, a }: Faq) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <PaperCard shadow="soft" className="p-5 cursor-pointer" border>
      <button
        className="w-full flex items-start justify-between gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-[family-name:var(--font-serif)] font-bold text-[17px] leading-snug">
          {t(q)}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-ink-faded mt-0.5" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-ink-faded mt-0.5" />
        )}
      </button>
      {open && (
        <p className="mt-3 font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed animate-fade-up">
          {t(a)}
        </p>
      )}
    </PaperCard>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */

export default function HowItWorksPage() {
  const t = useT();

  const STEPS: Step[] = [
    {
      number: "01",
      icon: <Smartphone size={36} />,
      title: t("Télécharger l'appli"),
      sub: t("App Store · Google Play"),
      body: t("En 30 secondes, crée ton profil voyageur. Ajoute ta ville, tes langues, une petite bio. La vérification par téléphone garantit une communauté de vraies personnes."),
      stampColor: "gold",
      tilt: -1.5,
    },
    {
      number: "02",
      icon: <MapPin size={36} />,
      title: t("Ouvrir la carte"),
      sub: t("Autour de toi, en temps réel"),
      body: t("Chaque voyageur disponible apparaît sur la carte du quartier. Tu vois leur note, leurs photos de profil, leur distance et leur langue. Le GPS n'est partagé que le temps d'une session."),
      stampColor: "blue",
      tilt: 1,
    },
    {
      number: "03",
      icon: <MessageCircle size={36} />,
      title: t("Envoyer un pli"),
      sub: t("Une demande chaleureuse"),
      body: t("Glisse une demande — un « pli » dans notre univers carnet de voyage. Précise le spot, l'heure, et ce que tu voudrais comme photo. L'autre voyageur accepte ou décline en toute liberté."),
      stampColor: "red",
      tilt: -0.8,
    },
    {
      number: "04",
      icon: <Camera size={36} />,
      title: t("Se retrouver & shooter"),
      sub: t("L'instant magique"),
      body: t("Vous vous retrouvez au spot convenu. Quelques poses guidées par l'IA si besoin, et voilà — de vraies photos de toi en voyage, prises par quelqu'un qui comprend l'angle."),
      stampColor: "green",
      tilt: 1.2,
    },
    {
      number: "05",
      icon: <Heart size={36} />,
      title: t("Partager & gagner du karma"),
      sub: t("L'entraide a de la valeur"),
      body: t("Les photos sont chiffrées dans ta galerie 24 h, puis les tiennes pour toujours. Chaque photo prise pour quelqu'un te rapporte du karma — la monnaie de l'entraide sur TMP."),
      stampColor: "gold",
      tilt: -1,
    },
    {
      number: "06",
      icon: <Star size={36} />,
      title: t("Laisser un avis"),
      sub: t("Pour la communauté"),
      body: t("Après chaque session, laisse une note et un petit mot. Ça aide les prochains voyageurs à choisir, et ça récompense les photographes stars. Le karma s'accumule, les badges aussi."),
      stampColor: "blue",
      tilt: 0.5,
    },
  ];

  const FAQS: Faq[] = [
    {
      q: "C'est gratuit ?",
      a: "Oui, complètement. Trouver un photographe voyageur, prendre des photos pour les autres, gagner du karma — tout ça est gratuit. Le plan Première classe (4,99 €/mois) ajoute des fonctionnalités bonus comme les spots secrets et le double karma.",
    },
    {
      q: "Et si l'autre personne ne se présente pas ?",
      a: "Ça arrive rarement, mais le système de karma décourage les absences. Si quelqu'un annule sans prévenir, son karma baisse et il peut se retrouver en bas du classement. Tu peux aussi évaluer négativement une no-show.",
    },
    {
      q: "Comment fonctionne la sécurité ?",
      a: "Tous les profils sont vérifiés par numéro de téléphone. La localisation GPS n'est partagée que pendant une session active. Le bouton SOS envoie ta position à un contact de confiance. Le mode famille permet à tes proches de voir où tu es.",
    },
    {
      q: "Et ma vie privée ?",
      a: "On ne revend aucune donnée. Les photos de session sont chiffrées de bout en bout. Tu contrôles toujours qui peut te contacter. Notre politique de confidentialité est disponible sur ce site.",
    },
    {
      q: "Il faut être bon photographe ?",
      a: "Pas du tout ! L'assistant IA te guide avec des suggestions de cadrage et de poses. La plupart des utilisateurs filment avec leur téléphone. Le secret, c'est d'être bienveillant, pas professionnel.",
    },
  ];

  const safetyItems = [
    {
      icon: <ShieldCheck size={24} />,
      label: t("Vérification réelle"),
      desc: t("Téléphone + pièce d'identité optionnelle. Chaque profil est une vraie personne."),
    },
    {
      icon: <MapPin size={24} />,
      label: t("GPS éphémère"),
      desc: t("Ta position n'est visible que le temps d'une session active, jamais en dehors."),
    },
    {
      icon: <Star size={24} />,
      label: t("Karma & évaluations"),
      desc: t("Chaque utilisateur est noté. Les mauvaises conduites sont vite visibles."),
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("simple comme bonjour")}
        title={t("Comment ça marche")}
        highlight={t("vraiment")}
        sub={t("Six étapes pour passer du selfie raté à la plus belle photo de ton voyage. Aucun équipement requis — juste ton téléphone et l'envie d'une bonne photo.")}
        stamp={`GUIDE\n★\nTMP`}
      />

      {/* ============================================================ JOURNEY */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="relative">
          {/* Vertical dashed line */}
          <div
            className="absolute left-[32px] top-0 bottom-0 w-[1.5px] border-l-[1.5px] border-dashed border-[var(--ink-line)] hidden md:block"
            style={{ zIndex: 0 }}
          />

          <div className="flex flex-col gap-10 stagger">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative md:pl-20">
                {/* Number stamp on the vertical line */}
                <div className="hidden md:block absolute left-0 top-4 z-10">
                  <Stamp
                    color={step.stampColor}
                    shape="circle"
                    size={62}
                    fontSize={18}
                    rotate={i % 2 === 0 ? -4 : 5}
                  >
                    {step.number}
                  </Stamp>
                </div>

                <PaperCard shadow="soft" tilt={step.tilt} className="p-7">
                  {/* Mobile number */}
                  <div className="md:hidden mb-4 flex items-center gap-3">
                    <Stamp
                      color={step.stampColor}
                      shape="circle"
                      size={44}
                      fontSize={14}
                      rotate={0}
                    >
                      {step.number}
                    </Stamp>
                    <Chip color="ink" variant="dashed" size="sm" mono>
                      {step.sub}
                    </Chip>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="shrink-0 text-gold-deep">{step.icon}</div>
                    <div className="flex-1">
                      <div className="hidden md:flex items-center gap-3 mb-2">
                        <Chip color="ink" variant="dashed" size="sm" mono>
                          {step.sub}
                        </Chip>
                      </div>
                      <h2 className="font-[family-name:var(--font-serif)] font-bold text-[22px] leading-tight mb-3">
                        {step.title}
                      </h2>
                      <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </PaperCard>

                {/* Tape decoration every other step */}
                {i % 2 === 0 && (
                  <div className="absolute -bottom-4 right-4 z-20 hidden md:block">
                    <Tape
                      color={i % 3 === 0 ? "cream" : "blue"}
                      width={50}
                      height={18}
                      rotate={i % 2 === 0 ? -6 : 4}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA mid-page */}
        <div className="mt-14 text-center">
          <Link href="/download">
            <Button variant="gold" size="lg" icon={<Smartphone size={18} />}>
              {t("essayer maintenant — c'est gratuit")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ SAFETY BAND */}
      <section className="bg-paper-warm border-y-[1.5px] border-[var(--ink-line)] paper">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="shrink-0">
              <Stamp color="green" size={100} fontSize={9} rotate={-8} shape="octagon">
                {`SÉCURISÉ\n★\n100 %`}
              </Stamp>
            </div>
            <div className="flex-1 grid sm:grid-cols-3 gap-6 stagger">
              {safetyItems.map(({ icon, label, desc }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="text-stamp-green shrink-0">{icon}</div>
                  <div>
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1">
                      {label}
                    </div>
                    <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <SectionHeading
          eyebrow={t("questions fréquentes")}
          title={t("Tout ce que tu veux savoir")}
          highlight={t("avant de commencer")}
          center
          className="mb-12"
        />
        <div className="flex flex-col gap-4 stagger">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/help">
            <Button variant="ghost" trailing={<ArrowRight size={15} />}>
              {t("voir l'aide complète")}
            </Button>
          </Link>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
