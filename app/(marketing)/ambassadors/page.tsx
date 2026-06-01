"use client";

import { useState } from "react";
import { useT } from "@/i18n/I18nProvider";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Badge, Avatar, Modal, Input, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui";
import { leaderboard } from "@/lib/data";
import { Star, Camera, Globe, Users, Medal, Crown, Zap, Gift, Send, Check } from "lucide-react";

const PERKS_DATA = [
  {
    icon: Crown,
    titleKey: "Badge ambassadeur exclusif",
    descKey: "Un badge doré visible sur votre profil et reconnu par toute la communauté.",
    color: "text-gold-deep",
  },
  {
    icon: Zap,
    titleKey: "Karma ×3",
    descKey: "Triplez votre karma lors de chaque session photo. Montez plus vite dans le classement.",
    color: "text-stamp-blue",
  },
  {
    icon: Gift,
    titleKey: "Accès Première classe offert",
    descKey: "Abonnement annuel Première classe entièrement offert tant que vous êtes ambassadeur.",
    color: "text-stamp-green",
  },
  {
    icon: Globe,
    titleKey: "Spots secrets en avant-première",
    descKey: "Accédez aux nouveaux spots avant leur publication officielle.",
    color: "text-stamp-red",
  },
  {
    icon: Users,
    titleKey: "Communauté privée",
    descKey: "Rejoignez le groupe Discord privé des ambassadeurs et les réunions mensuelles.",
    color: "text-gold-deep",
  },
  {
    icon: Camera,
    titleKey: "Kit photo offert",
    descKey: "Recevez un kit photo surprise (trépied, accessoires) à l'intégration du programme.",
    color: "text-stamp-blue",
  },
];

const STEPS_DATA = [
  {
    num: "01",
    titleKey: "Atteignez 500 karma",
    descKey: "Prenez des photos pour les autres voyageurs, contribuez à la communauté, ajoutez des spots.",
  },
  {
    num: "02",
    titleKey: "Maintenez 4,8 ★ de moyenne",
    descKey: "La qualité compte autant que la quantité. Chaque note vous rapproche du programme.",
  },
  {
    num: "03",
    titleKey: "Postulez ou soyez invité·e",
    descKey: "Remplissez le formulaire ci-dessous, ou attendez notre invitation automatique si vous êtes dans le Top 50.",
  },
  {
    num: "04",
    titleKey: "Entretien avec l'équipe",
    descKey: "Un échange de 20 minutes avec notre Head of Community pour vous accueillir officiellement.",
  },
];

type FormData = {
  name: string;
  username: string;
  city: string;
  karma: string;
  why: string;
};

export default function AmbassadorsPage() {
  const t = useT();
  const toast = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", username: "", city: "", karma: "", why: "" });
  const topAmbassadors = leaderboard.slice(0, 12);

  function handleSubmit() {
    if (!form.name || !form.username) {
      toast.push(t("Merci de renseigner votre nom et votre pseudonyme."), "err");
      return;
    }
    toast.push(t("Candidature de {{name}} envoyée ! Nous vous répondrons sous 7 jours.", { name: form.name }), "ok");
    setFormOpen(false);
    setForm({ name: "", username: "", city: "", karma: "", why: "" });
  }

  return (
    <div>
      <PageHero
        eyebrow={t("Programme")}
        title={t("Devenez")}
        highlight={t("ambassadeur")}
        sub={t("Les ambassadeurs Take Me Pic sont le cœur battant de la communauté. Ils incarnent nos valeurs, inspirent les autres voyageurs et ouvrent la voie.")}
        stamp={`AMB.\n★★★`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Hero chiffres */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Medal, value: "142", label: t("Ambassadeurs actifs"), color: "text-gold-deep" },
            { icon: Globe, value: "38", label: t("Pays représentés"), color: "text-stamp-blue" },
            { icon: Camera, value: "68 400", label: t("Photos par les ambassadeurs"), color: "text-stamp-green" },
            { icon: Star, value: "4,92 ★", label: t("Note moyenne"), color: "text-stamp-red" },
          ].map(({ icon: Icon, value, label, color }) => (
            <PaperCard key={label} shadow="soft" className="p-5 text-center">
              <Icon size={22} className={`${color} mx-auto mb-2`} />
              <p className="font-[family-name:var(--font-serif)] font-bold text-2xl">{value}</p>
              <p className="text-ink-faded text-sm font-[family-name:var(--font-type)]">{label}</p>
            </PaperCard>
          ))}
        </div>

        {/* Avantages */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1 mb-1">
                {t("ce que vous gagnez")}
              </div>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl">
                {t("Les avantages ambassadeurs")}
              </h2>
            </div>
            <Stamp color="gold" size={80} fontSize={9} rotate={8}>{`PERKS\n★★★`}</Stamp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS_DATA.map((perk) => {
              const Icon = perk.icon;
              return (
                <PaperCard key={perk.titleKey} shadow="soft" className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-paper-warm rounded shrink-0">
                      <Icon size={20} className={perk.color} />
                    </div>
                    <div>
                      <p className="font-semibold font-[family-name:var(--font-serif)] mb-1">{t(perk.titleKey)}</p>
                      <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)]">{t(perk.descKey)}</p>
                    </div>
                  </div>
                </PaperCard>
              );
            })}
          </div>
        </section>

        {/* Comment rejoindre */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-8">
            {t("Comment rejoindre le programme")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS_DATA.map((step) => (
              <PaperCard key={step.num} shadow="soft" className="p-5">
                <div className="font-[family-name:var(--font-hand)] text-4xl text-gold-deep mb-3 -rotate-1">
                  {step.num}
                </div>
                <h3 className="font-semibold font-[family-name:var(--font-serif)] mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)]">{t(step.descKey)}</p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* Critères d'éligibilité */}
        <section className="mb-16">
          <PaperCard shadow="gold" className="p-8 max-w-3xl">
            <div className="flex items-start gap-5">
              <div className="hidden sm:block">
                <Stamp color="gold" size={80} fontSize={9} rotate={-8}>{`CRITÈRES\n★`}</Stamp>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-4">
                  {t("Critères d'éligibilité")}
                </h3>
                <ul className="space-y-3">
                  {[
                    { ok: true, text: t("Au moins 500 points de karma") },
                    { ok: true, text: t("Note moyenne de 4,8 ★ ou plus") },
                    { ok: true, text: t("Au moins 50 photos prises pour d'autres voyageurs") },
                    { ok: true, text: t("Compte actif depuis au moins 3 mois") },
                    { ok: true, text: t("Aucune violation des CGU ou de la Charte") },
                    { ok: false, text: t("Aucune obligation de publications sur les réseaux sociaux") },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-[family-name:var(--font-serif)]">
                      <Check size={14} className={item.ok ? "text-stamp-green" : "text-gold-deep"} />
                      <span className={item.ok ? "" : "text-ink-faded italic"}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PaperCard>
        </section>

        {/* Candidature */}
        <section className="mb-16">
          <div className="flex items-start gap-8 flex-wrap">
            <div className="flex-1 min-w-64">
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-3">
                {t("Postuler maintenant")}
              </h2>
              <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-6 max-w-md">
                {t("Vous pensez correspondre au profil ? Envoyez votre candidature. Nous examinons toutes les demandes avec attention, généralement sous 7 jours.")}
              </p>
              <Button
                variant="gold"
                size="lg"
                icon={<Send size={16} />}
                onClick={() => setFormOpen(true)}
              >
                {t("Envoyer ma candidature")}
              </Button>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl">
              {t("Top photographes de la communauté")}
            </h2>
            <Chip color="gold" variant="outline">{t("Classement du mois")}</Chip>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topAmbassadors.map((entry) => (
              <PaperCard
                key={entry.user.id}
                shadow={entry.rank <= 3 ? "gold" : "soft"}
                className="p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar src={entry.user.avatar} size={40} />
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                        entry.rank === 1
                          ? "bg-gold-deep"
                          : entry.rank === 2
                          ? "bg-ink-faded"
                          : entry.rank === 3
                          ? "bg-stamp-red"
                          : "bg-ink"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold font-[family-name:var(--font-serif)] text-sm truncate">
                      {entry.user.firstName} {entry.user.lastName}
                    </p>
                    <p className="text-xs text-ink-faded font-[family-name:var(--font-type)]">
                      {entry.user.city} · {entry.score} karma
                    </p>
                    <div className="mt-1">
                      {entry.user.premium && (
                        <Badge tone="gold" dot>{t("Première classe")}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>
        </section>
      </div>

      {/* Modal candidature */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={t("Candidature ambassadeur")}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>{t("Annuler")}</Button>
            <Button variant="gold" icon={<Send size={16} />} onClick={handleSubmit}>
              {t("Envoyer ma candidature")}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 font-[family-name:var(--font-serif)]">
          <p className="text-ink-faded text-sm">
            {t("Répondez à quelques questions rapides. Notre équipe vous répondra sous 7 jours.")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("Prénom & nom *")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("Claire Bernard")}
            />
            <Input
              label={t("Pseudonyme TMP *")}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="@claire.bernard"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("Ville de résidence")}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder={t("Paris")}
            />
            <Input
              label={t("Karma actuel")}
              value={form.karma}
              onChange={(e) => setForm({ ...form, karma: e.target.value })}
              placeholder={t("ex. 850")}
            />
          </div>
          <Textarea
            label={t("Pourquoi souhaitez-vous devenir ambassadeur·rice ?")}
            value={form.why}
            onChange={(e) => setForm({ ...form, why: e.target.value })}
            placeholder={t("Partagez votre histoire avec Take Me Pic…")}
            rows={4}
          />
        </div>
      </Modal>

      <CtaBand />
    </div>
  );
}
