"use client";

import { Apple, Smartphone, Wifi, Shield, Camera, Star, MapPin, Zap } from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  Button,
  PaperCard,
  Stamp,
  Tape,
  SectionHeading,
  Polaroid,
  useToast,
} from "@/components/ui";
import { useT } from "@/i18n/I18nProvider";

export default function DownloadPage() {
  const t = useT();
  const toast = useToast();

  const FEATURES = [
    {
      icon: <MapPin size={22} />,
      title: t("Trouve quelqu'un maintenant"),
      desc: t("Vois en temps réel qui est disponible autour de toi pour prendre ta photo."),
    },
    {
      icon: <Shield size={22} />,
      title: t("Profils vérifiés"),
      desc: t("Chaque utilisateur est vérifié : e-mail, téléphone, et identité pour les photographes."),
    },
    {
      icon: <Camera size={22} />,
      title: t("Galerie chiffrée 24 h"),
      desc: t("Tes photos t'appartiennent. La galerie de session expire automatiquement."),
    },
    {
      icon: <Star size={22} />,
      title: t("Système de karma"),
      desc: t("Plus tu aides, plus tu montes dans la communauté. L'entraide récompensée."),
    },
    {
      icon: <Wifi size={22} />,
      title: t("Spots secrets"),
      desc: t("Accède aux meilleurs angles de la ville, partagés uniquement par la communauté."),
    },
    {
      icon: <Zap size={22} />,
      title: t("Rapide comme un déclic"),
      desc: t("En moins de 30 secondes, tu as trouvé quelqu'un. On a chronométré."),
    },
  ];

  const SCREENSHOTS = [
    { src: "https://picsum.photos/seed/app1/400/800", caption: t("Carte & spots") },
    { src: "https://picsum.photos/seed/app2/400/800", caption: t("Profil karma") },
    { src: "https://picsum.photos/seed/app3/400/800", caption: t("Galerie session") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("disponible maintenant")}
        title={t("L'app qui change")}
        highlight={t("tes voyages")}
        sub={t("Télécharge Take Me Pic gratuitement et rejoint des milliers de voyageurs qui se photographient partout dans le monde.")}
        stamp={`APP\nSTORE\n★`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Main download card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 items-center">
          {/* Left: phone mockup */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Decorative tape */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Tape color="red" rotate={-3} width={80} height={26} />
              </div>

              <PaperCard
                shadow="gold"
                className="relative w-[280px] md:w-[320px] overflow-hidden"
                tilt={-2}
              >
                <div className="bg-ink rounded-t-[20px] rounded-b-[20px] mx-3 my-3 overflow-hidden">
                  {/* Phone status bar */}
                  <div className="bg-ink px-4 py-2 flex justify-between items-center">
                    <span className="text-paper-warm/60 font-[family-name:var(--font-mono)] text-[10px]">
                      9:41
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 bg-paper-warm/40 rounded-sm" />
                      <div className="w-1.5 h-1.5 bg-paper-warm/40 rounded-full" />
                    </div>
                  </div>

                  {/* App screen preview */}
                  <div className="relative bg-paper-warm aspect-[9/19.5]">
                    <img
                      src="https://picsum.photos/seed/appscreen/320/680"
                      alt={t("Aperçu de l'app")}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay UI elements */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/80" />
                    <div className="absolute bottom-6 left-4 right-4">
                      <div className="bg-card/90 backdrop-blur-sm rounded-[4px] p-3 border-[1.5px] border-ink">
                        <div className="font-[family-name:var(--font-hand)] text-base text-gold-deep mb-0.5">
                          {t("Claire est disponible !")}
                        </div>
                        <div className="font-[family-name:var(--font-serif)] text-xs text-ink">
                          {t("À 180 m · Photographe amateur")}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                          <div className="flex-1 bg-ink text-paper-warm text-center rounded py-1 font-[family-name:var(--font-serif)] text-xs font-semibold">
                            {t("Envoyer un pli")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PaperCard>

              {/* Floating stamp */}
              <div className="absolute -bottom-4 -right-4">
                <Stamp color="green" size={80} rotate={15} fontSize={9}>
                  {`GRATUIT\n★\nDÈS\nAUJOURD'HUI`}
                </Stamp>
              </div>
            </div>
          </div>

          {/* Right: download CTAs */}
          <div>
            <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1 mb-2">
              {t("choisir ta plateforme")}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl md:text-4xl tracking-[-0.02em] mb-4">
              {t("Disponible sur iOS & Android")}
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed mb-8">
              {t("Télécharge l'app gratuitement et commence à aider les voyageurs autour de toi — ou trouve quelqu'un pour ta prochaine belle photo.")}
            </p>

            {/* Store buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <PaperCard
                shadow="ink"
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:-translate-y-0.5 transition-transform"
                onClick={() => toast.push(t("Redirection vers l'App Store… 🍎"), "info")}
              >
                <Apple size={32} className="shrink-0" />
                <div>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                    {t("Télécharger sur")}
                  </div>
                  <div className="font-[family-name:var(--font-serif)] font-bold text-lg">
                    App Store
                  </div>
                </div>
              </PaperCard>

              <PaperCard
                shadow="ink"
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:-translate-y-0.5 transition-transform"
                onClick={() =>
                  toast.push(t("Redirection vers Google Play… 🤖"), "info")
                }
              >
                <Smartphone size={32} className="shrink-0" />
                <div>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                    {t("Disponible sur")}
                  </div>
                  <div className="font-[family-name:var(--font-serif)] font-bold text-lg">
                    Google Play
                  </div>
                </div>
              </PaperCard>
            </div>

            {/* QR Code placeholder */}
            <div className="flex items-start gap-5">
              <PaperCard
                shadow="soft"
                tilt={2}
                className="p-3 shrink-0 relative"
              >
                <div className="w-28 h-28 bg-ink rounded-[2px] grid grid-cols-7 grid-rows-7 gap-0.5 p-1.5">
                  {/* QR code visual simulation */}
                  {Array.from({ length: 49 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${
                        [
                          0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34,
                          35, 41, 42, 43, 44, 45, 46, 47, 48, 8, 15, 22, 29, 36,
                          10, 11, 17, 23, 25, 31, 37, 38, 40,
                        ].includes(i)
                          ? "bg-paper-warm"
                          : "bg-ink"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded">
                  {t("Scanner pour télécharger")}
                </div>
              </PaperCard>

              <div className="pt-2">
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-sm leading-relaxed">
                  {t("Scanne le QR code avec l'appareil photo de ton téléphone pour ouvrir directement la bonne boutique.")}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["iOS 16+", "Android 10+", t("Gratuit")].map((tag) => (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] border-[1.5px] border-dashed border-[var(--ink-soft)] rounded-[4px] px-2 py-0.5 text-ink-faded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots carousel */}
        <section className="mb-20">
          <SectionHeading
            eyebrow={t("un avant-goût")}
            title={t("Découvre l'app")}
            highlight={t("en images")}
            center
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {SCREENSHOTS.map((s, i) => (
              <Polaroid
                key={i}
                src={s.src}
                caption={s.caption}
                width={180}
                height={320}
                tilt={[-3, 1, -1][i]}
              />
            ))}
          </div>
        </section>

        {/* Feature bullets */}
        <section className="mb-20">
          <SectionHeading
            eyebrow={t("pourquoi nous choisir")}
            title={t("Tout ce dont tu as")}
            highlight={t("besoin pour voyager")}
            center
            className="mb-10"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <PaperCard
                key={i}
                shadow="soft"
                tilt={[-1, 0, 1, -1, 0, 1][i]}
                className="p-5"
              >
                <div className="w-10 h-10 rounded-[4px] bg-paper-warm border-[1.5px] border-ink flex items-center justify-center mb-4 text-ink">
                  {f.icon}
                </div>
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-2">
                  {f.title}
                </h3>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                  {f.desc}
                </p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* Stats band */}
        <section className="mb-20">
          <PaperCard shadow="gold" className="p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "48 230", label: t("voyageurs actifs") },
                { value: "142 000+", label: t("photos prises") },
                { value: "4,9 ★", label: t("note sur l'App Store") },
                { value: "62 villes", label: t("couvertes dans le monde") },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-[family-name:var(--font-serif)] font-bold text-3xl md:text-4xl tracking-[-0.03em] text-gold-deep">
                    {s.value}
                  </div>
                  <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </PaperCard>
        </section>

        {/* Final CTA */}
        <div className="text-center mb-8">
          <Button
            variant="gold"
            size="lg"
            icon={<Apple size={20} />}
            onClick={() => toast.push(t("Téléchargement en cours… 📲"), "ok")}
            className="mr-3"
          >
            App Store
          </Button>
          <Button
            variant="ink"
            size="lg"
            icon={<Smartphone size={20} />}
            onClick={() => toast.push(t("Redirection Google Play… 🤖"), "ok")}
          >
            Google Play
          </Button>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
