"use client";

import { useState } from "react";
import { useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { PageHero } from "@/components/marketing/MarketingBits";
import { PaperCard, Badge, Chip, SectionHeading, Stamp, useToast } from "@/components/ui";
import { useT } from "@/i18n/I18nProvider";

/* ── Types ─────────────────────────────────────────────── */
type ServiceStatus = "opérationnel" | "incident résolu" | "dégradé" | "panne";

interface ServiceComponent {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number; // last 90 days %
  emoji: string;
  incident?: {
    title: string;
    resolvedAt: string;
    duration: string;
    details: string;
  };
}

type SupabaseHealth =
  | {
      state: "checking";
    }
  | {
      state: "connected";
      latencyMs: number;
      projectUrl: string;
    }
  | {
      state: "error";
      message: string;
    };

/* ── Mock service data ──────────────────────────────────── */
const SERVICES: ServiceComponent[] = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Base de données, Auth, Storage et Realtime.",
    status: "opérationnel",
    uptime: 99.95,
    emoji: "⚡",
  },
  {
    id: "api",
    name: "API principale",
    description: "Endpoints REST pour l'application mobile et web.",
    status: "opérationnel",
    uptime: 99.97,
    emoji: "⚙️",
  },
  {
    id: "app-mobile",
    name: "Application mobile",
    description: "iOS & Android — sessions, carte, karma.",
    status: "opérationnel",
    uptime: 99.94,
    emoji: "📱",
  },
  {
    id: "carte",
    name: "Carte & géolocalisation",
    description: "Recherche de membres à proximité en temps réel.",
    status: "incident résolu",
    uptime: 99.71,
    emoji: "🗺️",
    incident: {
      title: "Latence élevée sur la carte — région EU-West",
      resolvedAt: "29 mai 2026, 14:37",
      duration: "43 minutes",
      details:
        "Une saturation temporaire sur nos serveurs de géolocalisation EU-West a causé des délais de 3–8 secondes sur l'affichage des membres disponibles. Le problème a été résolu par un basculement automatique vers EU-Central. Aucune donnée n'a été perdue.",
    },
  },
  {
    id: "paiements",
    name: "Paiements & abonnements",
    description: "Stripe, App Store, Google Play — achats et renouvellements.",
    status: "opérationnel",
    uptime: 99.99,
    emoji: "💳",
  },
  {
    id: "notifications",
    name: "Notifications push",
    description: "Alertes de session, messages, rappels karma.",
    status: "opérationnel",
    uptime: 99.88,
    emoji: "🔔",
  },
];

/* ── 90-day uptime bar data ─────────────────────────────── */
function generateUptimeBars(uptime: number): Array<"ok" | "incident" | "partial"> {
  return Array.from({ length: 90 }, (_, i) => {
    const roll = (i * 37 + uptime * 10) % 100;
    if (uptime >= 99.9) return roll < 2 ? "incident" : "ok";
    if (uptime >= 99.7) return roll < 8 ? (roll < 2 ? "incident" : "partial") : "ok";
    return roll < 12 ? (roll < 4 ? "incident" : "partial") : "ok";
  });
}

/* ── Status badge config ──────────────────────────────────  */
const STATUS_CONFIG: Record<
  ServiceStatus,
  { tone: "green" | "gold" | "red" | "sunset"; label: string; icon: React.ReactNode }
> = {
  "opérationnel": {
    tone: "green",
    label: "Opérationnel",
    icon: <CheckCircle size={13} />,
  },
  "incident résolu": {
    tone: "gold",
    label: "Incident résolu",
    icon: <AlertCircle size={13} />,
  },
  "dégradé": {
    tone: "sunset",
    label: "Dégradé",
    icon: <AlertCircle size={13} />,
  },
  "panne": {
    tone: "red",
    label: "Panne",
    icon: <AlertCircle size={13} />,
  },
};

/* ── Uptime bar color ───────────────────────────────────── */
function BarColor(state: "ok" | "incident" | "partial"): string {
  if (state === "ok") return "bg-stamp-green";
  if (state === "partial") return "bg-sunset";
  return "bg-stamp-red";
}

/* ── Sub-component: UptimeBar ───────────────────────────── */
function UptimeBar({ uptime, id }: { uptime: number; id: string }) {
  const t = useT();
  const bars = generateUptimeBars(uptime);
  return (
    <div className="flex items-end gap-[2px] h-6" title={t("{{uptime}}% uptime sur 90 jours", { uptime })}>
      {bars.map((state, i) => (
        <div
          key={`${id}-${i}`}
          className={`w-[3px] rounded-[1px] transition ${BarColor(state)}`}
          style={{ height: state === "ok" ? "100%" : state === "partial" ? "60%" : "30%" }}
        />
      ))}
    </div>
  );
}

/* ── Sub-component: ServiceRow ──────────────────────────── */
function ServiceRow({ svc }: { svc: ServiceComponent }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[svc.status];

  return (
    <div>
      <div
        className="flex items-center gap-4 py-4 cursor-pointer group"
        onClick={() => svc.incident && setOpen((v) => !v)}
      >
        {/* Emoji */}
        <span className="text-2xl w-8 text-center shrink-0">{svc.emoji}</span>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-[family-name:var(--font-serif)] font-semibold text-[15px] text-ink">
              {svc.name}
            </span>
            {svc.incident && (
              <div className="text-ink-faded">
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            )}
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] leading-snug">
            {svc.description}
          </p>
        </div>

        {/* Uptime % */}
        <div className="hidden sm:block shrink-0 text-right mr-2">
          <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-[0.08em]">
            {t("Uptime 90j")}
          </div>
          <div className="font-[family-name:var(--font-serif)] font-bold text-[14px] text-ink">
            {svc.uptime}%
          </div>
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          <Badge tone={cfg.tone} dot>
            {t(cfg.label)}
          </Badge>
        </div>
      </div>

      {/* Uptime bar */}
      <div className="ml-12 mb-3">
        <UptimeBar uptime={svc.uptime} id={svc.id} />
        <div className="flex justify-between mt-1 font-[family-name:var(--font-type)] text-[10px] text-ink-faded">
          <span>{t("il y a 90 jours")}</span>
          <span>{t("aujourd'hui")}</span>
        </div>
      </div>

      {/* Incident detail (expandable) */}
      {svc.incident && open && (
        <div className="ml-12 mb-4 animate-fade-up">
          <PaperCard shadow="gold" className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={15} className="text-gold-deep shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-[family-name:var(--font-serif)] font-semibold text-[14px] text-ink mb-1">
                  {svc.incident.title}
                </h5>
                <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] leading-relaxed mb-3">
                  {svc.incident.details}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Chip color="gold" variant="outline" size="sm" mono>
                    {t("Résolu :")} {svc.incident.resolvedAt}
                  </Chip>
                  <Chip color="ink" variant="outline" size="sm" mono>
                    {t("Durée :")} {svc.incident.duration}
                  </Chip>
                </div>
              </div>
            </div>
          </PaperCard>
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function StatusPage() {
  const t = useT();
  const { push } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth>({
    state: "checking",
  });

  async function refreshSupabaseHealth() {
    setSupabaseHealth({ state: "checking" });

    try {
      const response = await fetch("/api/health/supabase", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setSupabaseHealth({
          state: "error",
          message: data.error ?? `Supabase responded with status ${data.status ?? response.status}`,
        });
        return;
      }

      setSupabaseHealth({
        state: "connected",
        latencyMs: data.latencyMs,
        projectUrl: data.projectUrl,
      });
    } catch (error) {
      setSupabaseHealth({
        state: "error",
        message: error instanceof Error ? error.message : "Supabase health check failed",
      });
    }
  }

  useEffect(() => {
    void refreshSupabaseHealth();
  }, []);

  const allOk = SERVICES.every((s) => s.status === "opérationnel" || s.status === "incident résolu");
  const fullyOk = SERVICES.every((s) => s.status === "opérationnel");

  function handleRefresh() {
    setRefreshing(true);
    void refreshSupabaseHealth();
    setTimeout(() => {
      setRefreshing(false);
      push(t("État des services mis à jour."), "info");
    }, 900);
  }

  return (
    <>
      <PageHero
        eyebrow={t("tableau de bord")}
        title={t("État des services")}
        highlight="Take Me Pic"
        sub={t("Suivez en temps réel la disponibilité de nos infrastructures.")}
        stamp={"STATUS\n★\nLIVE"}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Overall banner */}
        <PaperCard
          shadow={fullyOk ? "soft" : "gold"}
          className={`p-6 mb-10 flex items-center gap-5 flex-wrap ${fullyOk ? "border-stamp-green/50" : "border-gold-deep/60"}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              fullyOk ? "bg-stamp-green/15" : "bg-gold-light/20"
            }`}
          >
            {fullyOk ? (
              <CheckCircle size={24} className="text-stamp-green" />
            ) : (
              <AlertCircle size={24} className="text-gold-deep" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl text-ink">
              {fullyOk
                ? t("Tous les systèmes sont opérationnels")
                : t("Tous les systèmes fonctionnent — incident résolu récemment")}
            </h2>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mt-0.5">
              {t("Dernière mise à jour : aujourd'hui à")}{" "}
              {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-ink-faded hover:text-ink transition px-3 py-2 rounded-[4px] border-[1.5px] border-[var(--ink-line)] hover:bg-paper-warm cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            {t("Actualiser")}
          </button>
        </PaperCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Services list */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <SectionHeading
                eyebrow={t("composants")}
                title={t("Services & infrastructures")}
              />
              <div className="flex gap-2 flex-wrap">
                <Chip color="green" variant="outline" size="sm">
                  {t("Opérationnel")}
                </Chip>
                <Chip color="gold" variant="outline" size="sm">
                  {t("Incident résolu")}
                </Chip>
                <Chip color="red" variant="outline" size="sm">
                  {t("Panne")}
                </Chip>
              </div>
            </div>

            <PaperCard shadow="ink" className="divide-y divide-[var(--ink-line)]">
              <div className="px-5">
                {SERVICES.map((svc) => (
                  <ServiceRow key={svc.id} svc={svc} />
                ))}
              </div>
            </PaperCard>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Global uptime summary */}
            <PaperCard
              shadow={supabaseHealth.state === "error" ? "gold" : "soft"}
              className="p-5"
            >
              <h4 className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4 -rotate-1">
                {t("Connexion Supabase")}
              </h4>
              {supabaseHealth.state === "checking" && (
                <div className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                  <RefreshCw size={13} className="animate-spin" />
                  {t("Vérification en cours")}
                </div>
              )}
              {supabaseHealth.state === "connected" && (
                <div className="space-y-3">
                  <Badge tone="green" dot>
                    {t("Connecté")}
                  </Badge>
                  <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-relaxed">
                    {t("Le web app atteint Supabase avec la clé publishable.")}
                  </p>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                    {supabaseHealth.latencyMs}ms · {supabaseHealth.projectUrl.replace(/^https?:\/\//, "")}
                  </div>
                </div>
              )}
              {supabaseHealth.state === "error" && (
                <div className="space-y-3">
                  <Badge tone="red" dot>
                    {t("Non connecté")}
                  </Badge>
                  <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-relaxed">
                    {supabaseHealth.message}
                  </p>
                </div>
              )}
            </PaperCard>

            {/* Global uptime summary */}
            <PaperCard shadow="soft" className="p-5">
              <h4 className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4 -rotate-1">
                {t("Disponibilité globale")}
              </h4>
              <div className="space-y-3">
                {SERVICES.map((svc) => (
                  <div key={svc.id} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{svc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink truncate">
                          {svc.name}
                        </span>
                        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded ml-2 shrink-0">
                          {svc.uptime}%
                        </span>
                      </div>
                      {/* Mini uptime bar */}
                      <div className="h-1.5 rounded-full bg-paper-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-stamp-green"
                          style={{ width: `${svc.uptime}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PaperCard>

            {/* Stamp decoration */}
            <div className="flex justify-center py-2">
              <Stamp color="green" shape="octagon" size={90} fontSize={9} rotate={-6}>
                {`99.9%\n★\nUPTIME`}
              </Stamp>
            </div>

            {/* Incident history */}
            <PaperCard shadow="soft" className="p-5">
              <h4 className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("Historique récent")}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <AlertCircle size={13} className="text-gold-deep shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink leading-snug">
                      {t("Latence carte EU-West — 29 mai 2026")}
                    </p>
                    <Badge tone="gold" className="mt-1">{t("Résolu en 43 min")}</Badge>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={13} className="text-stamp-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink leading-snug">
                      {t("Aucun incident — mai 2026")}
                    </p>
                    <Badge tone="green" className="mt-1">{t("Mois parfait")}</Badge>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={13} className="text-stamp-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink leading-snug">
                      {t("Maintenance planifiée — 15 avr. 2026")}
                    </p>
                    <Badge tone="neutral" className="mt-1">00:00–02:00 · OK</Badge>
                  </div>
                </li>
              </ul>
            </PaperCard>

            {/* Subscribe to updates */}
            <PaperCard shadow="none" border className="p-5 text-center">
              <div className="text-2xl mb-2">
                <Clock size={22} className="mx-auto text-gold-deep" />
              </div>
              <h5 className="font-[family-name:var(--font-serif)] font-bold text-[14px] text-ink mb-1">
                {t("Recevoir les alertes")}
              </h5>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mb-3">
                {t("Soyez notifié en cas d'incident ou de maintenance planifiée.")}
              </p>
              <button
                onClick={() => push(t("Vous êtes abonné aux alertes de statut. ✉️"), "ok")}
                className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-gold-deep hover:text-ink transition cursor-pointer"
              >
                {t("S'abonner aux mises à jour")}
              </button>
            </PaperCard>
          </aside>
        </div>

        {/* Legend */}
        <div className="mt-10 pt-8 border-t-[1.5px] border-dashed border-[var(--ink-line)]">
          <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded mb-3">
            {t("Légende — barres de disponibilité 90 jours")}
          </p>
          <div className="flex flex-wrap gap-5">
            {[
              { color: "bg-stamp-green", label: "Opérationnel" },
              { color: "bg-sunset", label: "Dégradé" },
              { color: "bg-stamp-red", label: "Panne" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-[2px] ${color}`} />
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                  {t(label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
