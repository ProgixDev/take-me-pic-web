"use client";

import { Heart, Shield, Sparkles, Globe2, Lightbulb, Users } from "lucide-react";
import { PaperCard, Stamp, Tape } from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { useT } from "@/i18n/I18nProvider";

interface Value {
  number: string;
  emoji: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  body: string;
  quote: string;
  stamp: { text: string; color: "red" | "blue" | "green" | "gold" | "ink" };
  tape: "cream" | "red" | "blue";
  tilt: number;
}

export default function ValuesPage() {
  const t = useT();

  const VALUES: Value[] = [
    {
      number: "01",
      emoji: "🤝",
      icon: <Heart size={28} />,
      title: t("Humain d'abord"),
      subtitle: t("La technologie au service des gens, jamais l'inverse."),
      body: t(
        "Chaque fonctionnalité que nous concevons commence par une vraie question : est-ce que ça rend la vie d'un voyageur plus belle ? Si la réponse n'est pas un « oui » franc, on repart à la case départ. Les meilleurs moments de voyage sont humains. Take Me Pic est là pour les faciliter, pas les remplacer."
      ),
      quote: t("« Une appli qui se souvient qu'en face, il y a un vrai voyageur. »"),
      stamp: { text: t("HUMAIN\n★\nD'ABORD"), color: "red" },
      tape: "cream",
      tilt: -1,
    },
    {
      number: "02",
      emoji: "🛡️",
      icon: <Shield size={28} />,
      title: t("Confiance"),
      subtitle: t("La sécurité n'est pas un add-on, c'est la fondation."),
      body: t(
        "GPS éphémère, vérification d'identité, mode famille, système de signalement instantané — on a construit TMP pour que chacun puisse lever les yeux de son téléphone et simplement profiter. La confiance, ça se gagne. On l'entretient à chaque mise à jour."
      ),
      quote: t("« Ta position n'est visible que pendant une session active. Jamais autrement. »"),
      stamp: { text: t("CONFIANCE\n★"), color: "blue" },
      tape: "blue",
      tilt: 1,
    },
    {
      number: "03",
      emoji: "✨",
      icon: <Sparkles size={28} />,
      title: t("Beauté du quotidien"),
      subtitle: t("Chaque rue est un décor. Chaque lumière, une occasion."),
      body: t(
        "On croit que la beauté n'est pas réservée aux photographes professionnels ni aux modèles. Elle est dans la façon dont la lumière frappe un mur à 7h du matin, dans le sourire d'une famille au coucher du soleil. Take Me Pic t'aide à capturer ces instants — même quand tu n'as qu'un téléphone et cinq minutes."
      ),
      quote: t("« Heure dorée garantie, partout dans le monde. »"),
      stamp: { text: t("BEAUTÉ\nDU\nQUOTID."), color: "gold" },
      tape: "cream",
      tilt: -1,
    },
    {
      number: "04",
      emoji: "🌍",
      icon: <Globe2 size={28} />,
      title: t("Communauté"),
      subtitle: t("L'entraide comme économie invisible."),
      body: t(
        "Le karma est notre monnaie. Quand tu prends une photo pour un inconnu, tu accumules des points qui t'ouvrent des portes : spots secrets, profil mis en avant, badges de reconnaissance. Ce cercle vertueux crée une vraie communauté mondiale — 48 000 membres qui s'aident, sans se connaître."
      ),
      quote: t("« Ce que tu donnes te revient. Toujours. »"),
      stamp: { text: t("COMMU\nNAUTÉ\n★"), color: "green" },
      tape: "blue",
      tilt: 1,
    },
    {
      number: "05",
      emoji: "💡",
      icon: <Lightbulb size={28} />,
      title: t("Curiosité"),
      subtitle: t("On apprend plus vite qu'on ne célèbre."),
      body: t(
        "On fait des erreurs. On itère vite. On coupe des fonctionnalités quand elles ne servent pas. La curiosité, c'est aussi savoir remettre en question ce qu'on a fait la veille. Notre culture : feedback radical, bienveillant, et permanent."
      ),
      quote: t("« Le meilleur angle est souvent celui qu'on n'avait pas prévu. »"),
      stamp: { text: t("CURIOSITÉ\n★"), color: "ink" },
      tape: "cream",
      tilt: -2,
    },
    {
      number: "06",
      emoji: "🌿",
      icon: <Users size={28} />,
      title: t("Responsabilité"),
      subtitle: t("Voyage léger, empreinte légère."),
      body: t(
        "Voyager plus n'est pas notre but. Voyager mieux, l'est. On soutient des associations de tourisme responsable, on met en avant les spots locaux plutôt que les monuments surpeuplés, et on réfléchit à l'impact environnemental de chaque serveur qu'on allume."
      ),
      quote: t("« La meilleure photo ne vaut pas un spot dégradé. »"),
      stamp: { text: t("RESPON\nSABILITÉ"), color: "green" },
      tape: "blue",
      tilt: 1,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("ce en quoi on croit")}
        title={t("Nos valeurs,")}
        highlight={t("écrites dans le carnet.")}
        sub={t("Six convictions qui guident chaque décision produit, chaque recrutement, chaque ligne de code.")}
        stamp={t("VALEURS\n★\nTMP")}
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {VALUES.map((v, i) => (
            <PaperCard
              key={v.title}
              shadow={i % 2 === 0 ? "soft" : "gold"}
              tilt={v.tilt}
              className="p-7 relative overflow-visible"
            >
              {/* Tape at top */}
              <div className="absolute -top-3 left-8">
                <Tape color={v.tape} width={50} height={20} rotate={v.tilt * -1.5} />
              </div>

              {/* Stamp */}
              <div className="absolute -right-3 -top-5 z-10">
                <Stamp
                  color={v.stamp.color}
                  size={72}
                  fontSize={8}
                  rotate={i % 2 === 0 ? 12 : -10}
                >
                  {v.stamp.text}
                </Stamp>
              </div>

              {/* Number + icon row */}
              <div className="flex items-center gap-4 mb-5">
                <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] px-2 py-1">
                  {v.number}
                </span>
                <span className="text-4xl">{v.emoji}</span>
                <span className="text-gold-deep">{v.icon}</span>
              </div>

              <h3 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-tight mb-1">
                {v.title}
              </h3>
              <p className="font-[family-name:var(--font-hand)] text-lg text-gold-deep -rotate-0.5 mb-4">
                {v.subtitle}
              </p>
              <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed text-[15px] mb-5">
                {v.body}
              </p>

              {/* Pull quote */}
              <blockquote className="border-l-[3px] border-gold-deep pl-4 font-[family-name:var(--font-serif)] italic text-[14px] text-ink-faded leading-snug">
                {v.quote}
              </blockquote>
            </PaperCard>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
