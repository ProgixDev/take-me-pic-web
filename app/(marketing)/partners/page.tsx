"use client";

import { useState } from "react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Badge, Modal, Input, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Globe, Star, Zap, Crown, Check, Send, Camera, Map, Users } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

const PARTNERS_DATA = [
  { id: 1, name: "Hostelworld", categoryKey: "Hébergement", logo: "HW", color: "bg-stamp-blue", since: "2025", status: "premium" as const },
  { id: 2, name: "GetYourGuide", categoryKey: "Expériences", logo: "GYG", color: "bg-stamp-green", since: "2025", status: "premium" as const },
  { id: 3, name: "Lonely Planet", categoryKey: "Guides voyage", logo: "LP", color: "bg-gold-deep", since: "2026", status: "standard" as const },
  { id: 4, name: "EF Languages", categoryKey: "Formation", logo: "EF", color: "bg-stamp-red", since: "2026", status: "standard" as const },
  { id: 5, name: "Decathlon", categoryKey: "Équipement", logo: "DC", color: "bg-stamp-blue", since: "2026", status: "standard" as const },
  { id: 6, name: "Canon Europe", categoryKey: "Photo & matériel", logo: "CN", color: "bg-ink", since: "2026", status: "premium" as const },
  { id: 7, name: "Airbnb Experiences", categoryKey: "Hébergement", logo: "AB", color: "bg-stamp-red", since: "2026", status: "standard" as const },
  { id: 8, name: "Fujifilm", categoryKey: "Photo & matériel", logo: "FJ", color: "bg-stamp-green", since: "2025", status: "standard" as const },
];

type FormData = {
  company: string;
  name: string;
  email: string;
  tier: string;
  message: string;
};

export default function PartnersPage() {
  const t = useT();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ company: "", name: "", email: "", tier: "", message: "" });

  const TIERS = [
    {
      id: "bronze",
      name: "Bronze",
      icon: Globe,
      color: "ink" as const,
      price: t("Gratuit"),
      desc: t("Pour les petites structures et les indépendants"),
      perks: [
        t("Logo sur la page Partenaires"),
        t("1 spot photo mis en avant / mois"),
        t("Accès aux statistiques de base"),
        t("Mention dans la newsletter mensuelle"),
      ],
    },
    {
      id: "silver",
      name: t("Argent"),
      icon: Star,
      color: "gold" as const,
      price: t("250 € / mois"),
      desc: t("Pour les agences et PME du secteur voyage"),
      perks: [
        t("Tout Bronze +"),
        t("5 spots photo mis en avant / mois"),
        t("Badge partenaire vérifié sur les profils"),
        t("Accès à l'API des spots"),
        t("Page partenaire dédiée"),
        t("Rapport mensuel d'audience"),
      ],
      highlight: true,
    },
    {
      id: "gold",
      name: t("Or"),
      icon: Crown,
      color: "gold" as const,
      price: t("Sur devis"),
      desc: t("Pour les grandes marques et partenariats stratégiques"),
      perks: [
        t("Tout Argent +"),
        t("Spots illimités + mise en avant prioritaire"),
        t("Intégration native dans l'application"),
        t("Campagnes co-brandées"),
        t("Accès exclusif aux données agrégées"),
        t("Account manager dédié"),
        t("Événements communautaires co-organisés"),
      ],
    },
  ];

  function handleSubmit() {
    if (!form.company || !form.email) {
      toast.push(t("Merci de renseigner au minimum votre entreprise et votre e-mail."), "err");
      return;
    }
    toast.push(t("Demande de partenariat envoyée ! Nous vous contacterons sous 48 h, {{name}}.", { name: form.name || t("cher partenaire") }), "ok");
    setModalOpen(false);
    setForm({ company: "", name: "", email: "", tier: "", message: "" });
  }

  return (
    <div>
      <PageHero
        eyebrow={t("Partenariats")}
        title={t("Construisons l'avenir du")}
        highlight={t("voyage photo")}
        sub={t("Rejoignez les marques qui font confiance à Take Me Pic pour toucher une communauté de 48 000 voyageurs passionnés de photographie dans le monde entier.")}
        stamp={`★\nPARTNER\n★`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Users, value: "48 230", label: t("Voyageurs actifs"), color: "text-gold-deep" },
            { icon: Globe, value: "42", label: t("Pays représentés"), color: "text-stamp-blue" },
            { icon: Camera, value: "1 M+", label: t("Photos partagées"), color: "text-stamp-green" },
            { icon: Map, value: "3 200", label: t("Spots validés"), color: "text-stamp-red" },
          ].map(({ icon: Icon, value, label, color }) => (
            <PaperCard key={label} shadow="soft" className="p-5 text-center">
              <Icon size={24} className={`${color} mx-auto mb-2`} />
              <p className="font-[family-name:var(--font-serif)] font-bold text-2xl">{value}</p>
              <p className="text-ink-faded text-sm font-[family-name:var(--font-type)]">{label}</p>
            </PaperCard>
          ))}
        </div>

        {/* Logos partenaires */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl">
              {t("Nos partenaires")}
            </h2>
            <div className="flex gap-2">
              <Chip color="gold" variant="outline" size="sm">{t("Premium")}</Chip>
              <Chip color="ink" variant="outline" size="sm">{t("Standard")}</Chip>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {PARTNERS_DATA.map((p) => (
              <PaperCard key={p.id} shadow="soft" className="p-5 text-center hover:shadow-gold transition cursor-pointer">
                <div className={`w-16 h-16 ${p.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-[family-name:var(--font-type)] font-bold text-sm">
                    {p.logo}
                  </span>
                </div>
                <p className="font-semibold font-[family-name:var(--font-serif)] text-sm">{p.name}</p>
                <p className="text-xs text-ink-faded font-[family-name:var(--font-type)] mb-2">{t(p.categoryKey)}</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge tone={p.status === "premium" ? "gold" : "neutral"} dot>
                    {p.status === "premium" ? t("Premium") : t("Standard")}
                  </Badge>
                  <span className="text-[10px] text-ink-faded">{t("depuis {{since}}", { since: p.since })}</span>
                </div>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* Offres de partenariat */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-3">
            {t("Formules de partenariat")}
          </h2>
          <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-8 max-w-2xl">
            {t("Chaque partenariat est unique. Choisissez la formule qui correspond à vos ambitions, ou contactez-nous pour un partenariat sur mesure.")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <PaperCard
                  key={tier.id}
                  shadow={tier.highlight ? "gold" : "soft"}
                  className={`p-6 flex flex-col ${tier.highlight ? "border-2 border-gold-deep" : ""}`}
                >
                  {tier.highlight && (
                    <div className="mb-3">
                      <Badge tone="gold" dot>{t("Le plus populaire")}</Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-paper-warm rounded">
                      <Icon size={18} className="text-gold-deep" />
                    </div>
                    <span className="font-[family-name:var(--font-serif)] font-bold text-lg">{tier.name}</span>
                  </div>
                  <p className="font-[family-name:var(--font-serif)] font-bold text-2xl mb-1">{tier.price}</p>
                  <p className="text-ink-faded text-sm mb-5 font-[family-name:var(--font-serif)]">{tier.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm font-[family-name:var(--font-serif)]">
                        <Check size={14} className="text-stamp-green shrink-0 mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.highlight ? "gold" : "ghost"}
                    full
                    onClick={() => {
                      setForm((f) => ({ ...f, tier: tier.name }));
                      setModalOpen(true);
                    }}
                  >
                    {t("Choisir {{name}}", { name: tier.name })}
                  </Button>
                </PaperCard>
              );
            })}
          </div>
        </section>

        {/* CTA partenariat */}
        <section className="mb-16">
          <PaperCard shadow="gold" className="p-8">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="hidden md:block">
                <Stamp color="gold" size={90} fontSize={9} rotate={10}>{`BECOME\nA\nPARTNER`}</Stamp>
              </div>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-2xl mb-2">
                  {t("Une idée de partenariat original ?")}
                </h3>
                <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-5 max-w-lg">
                  {t("Échanges de services, sponsoring d'événements, intégrations produit, collections capsule — nous sommes ouverts à toutes les idées créatives.")}
                </p>
                <Button
                  variant="gold"
                  size="lg"
                  icon={<Send size={16} />}
                  onClick={() => setModalOpen(true)}
                >
                  {t("Devenir partenaire")}
                </Button>
              </div>
            </div>
          </PaperCard>
        </section>

        {/* Modal demande */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={t("Demande de partenariat")}
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>{t("Annuler")}</Button>
              <Button variant="gold" icon={<Send size={16} />} onClick={handleSubmit}>
                {t("Envoyer ma demande")}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 font-[family-name:var(--font-serif)]">
            <p className="text-ink-faded text-sm">{t("Notre équipe partenariats vous contactera sous 48 h ouvrées.")}</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("Entreprise *")}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder={t("Take Me Pic SAS")}
              />
              <Input
                label={t("Votre nom")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Claire Bernard"
              />
            </div>
            <Input
              label={t("E-mail *")}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="claire@monentreprise.com"
            />
            <div>
              <label className="block text-sm font-semibold font-[family-name:var(--font-type)] uppercase tracking-wider mb-2">
                {t("Formule souhaitée")}
              </label>
              <select
                className="w-full border border-dashed border-[var(--ink-line)] rounded px-3 py-2 bg-paper font-[family-name:var(--font-serif)] text-sm"
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
              >
                <option value="">{t("— Choisissez une formule —")}</option>
                <option value="Bronze">{t("Bronze (Gratuit)")}</option>
                <option value="Argent">{t("Argent (250 € / mois)")}</option>
                <option value="Or">{t("Or (Sur devis)")}</option>
                <option value="Custom">{t("Partenariat personnalisé")}</option>
              </select>
            </div>
            <Textarea
              label={t("Votre message")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t("Décrivez votre projet de partenariat…")}
              rows={3}
            />
          </div>
        </Modal>
      </div>

      <CtaBand />
    </div>
  );
}
