"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Gavel } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Badge, Avatar, Button, Modal, Stamp, Chip, useToast } from "@/components/ui";
import { resolveAppeal, type AppealDecision } from "@/lib/admin/moderation-actions";
import type { ModerationActionResult } from "@/lib/admin/moderation-actions";
import type { BanReadModel } from "@/lib/admin/moderation";

type View = "pending" | "accepted" | "rejected";

// appeal_status (open/reviewing/resolved/dismissed) → coarse UI view.
function viewOf(appealStatus: BanReadModel["appealStatus"]): View {
  if (appealStatus === "resolved") return "accepted";
  if (appealStatus === "dismissed") return "rejected";
  return "pending";
}

function failureMessage(result: Exclude<ModerationActionResult, { kind: "ok" }>): string {
  if (result.kind === "unauthenticated") return "Session expirée — reconnecte-toi.";
  if (result.kind === "unauthorized") return "Action réservée au staff.";
  return result.message;
}

function fullName(p: BanReadModel["user"]): string {
  if (!p) return "Utilisateur inconnu";
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || p.username;
}

export function AppealsClient({ appeals }: { appeals: BanReadModel[] }) {
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();
  // Optimistic per-ban view overrides after a decision.
  const [overrides, setOverrides] = useState<Record<number, View>>({});
  const [confirm, setConfirm] = useState<{ ban: BanReadModel; decision: AppealDecision } | null>(null);
  const [filter, setFilter] = useState<"tous" | View>("tous");

  const viewFor = (ban: BanReadModel): View => overrides[ban.id] ?? viewOf(ban.appealStatus);

  const counts = useMemo(() => {
    const c = { pending: 0, accepted: 0, rejected: 0 };
    for (const ban of appeals) c[viewFor(ban)] += 1;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appeals, overrides]);

  const filtered = appeals.filter((ban) => (filter === "tous" ? true : viewFor(ban) === filter));

  function handleConfirm() {
    if (!confirm) return;
    const { ban, decision } = confirm;
    setConfirm(null);
    startTransition(async () => {
      const result = await resolveAppeal(ban.id, decision);
      if (result.kind === "ok") {
        setOverrides((prev) => ({ ...prev, [ban.id]: decision === "accept" ? "accepted" : "rejected" }));
        push(
          decision === "accept"
            ? `Appel de ${fullName(ban.user)} accepté — compte rétabli.`
            : `Appel de ${fullName(ban.user)} rejeté.`,
          decision === "accept" ? "ok" : "info",
        );
      } else {
        push(failureMessage(result), "err");
      }
    });
  }

  return (
    <AdminPage
      title="Appels de bannissement"
      eyebrow="révision des sanctions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Appels" },
      ]}
      actions={
        counts.pending > 0 ? (
          <Badge tone="gold" dot>
            {counts.pending} en attente
          </Badge>
        ) : null
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {([
          { key: "pending", label: "En attente", value: counts.pending, cls: "text-gold-deep" },
          { key: "accepted", label: "Acceptés", value: counts.accepted, cls: "text-stamp-green" },
          { key: "rejected", label: "Rejetés", value: counts.rejected, cls: "text-stamp-red" },
        ] as const).map((s) => (
          <div key={s.key} className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
              {s.label}
            </div>
            <div className={`font-[family-name:var(--font-serif)] font-extrabold text-3xl ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: "tous", label: "Tous" },
          { key: "pending", label: "En attente" },
          { key: "accepted", label: "Acceptés" },
          { key: "rejected", label: "Rejetés" },
        ] as { key: "tous" | View; label: string }[]).map((opt) => (
          <Chip
            key={opt.key}
            color="ink"
            variant={filter === opt.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setFilter(opt.key)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      <div className="space-y-5">
        {filtered.length === 0 && (
          <div className="text-center py-12 font-[family-name:var(--font-hand)] text-xl text-ink-faded">
            Aucun appel dans cette catégorie.
          </div>
        )}
        {filtered.map((ban) => {
          const view = viewFor(ban);
          return (
            <PaperCard
              key={ban.id}
              shadow={view === "accepted" ? "gold" : view === "rejected" ? "red" : "ink"}
              className="p-5"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar src={ban.user?.avatarUrl ?? undefined} size={48} ring />
                  {view === "pending" && (
                    <Stamp color="gold" size={32} fontSize={6} rotate={10} className="absolute -top-2 -right-3">
                      {`APPEL`}
                    </Stamp>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-[family-name:var(--font-serif)] font-bold text-base">{fullName(ban.user)}</span>
                    {ban.user && (
                      <span className="font-[family-name:var(--font-hand)] text-base text-ink-faded">{ban.user.username}</span>
                    )}
                    <Badge tone={view === "pending" ? "gold" : view === "accepted" ? "green" : "red"} dot>
                      {view === "pending" ? "En attente" : view === "accepted" ? "Accepté" : "Rejeté"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                    <span>Banni le {new Date(ban.createdAt).toLocaleDateString("fr-FR")}</span>
                    <span>Motif : {ban.reason}</span>
                    {ban.user?.city && <span>{ban.user.city}</span>}
                  </div>

                  {view === "pending" ? (
                    <div className="flex gap-2.5">
                      <Button
                        variant="gold"
                        size="sm"
                        icon={<CheckCircle size={14} />}
                        disabled={isPending}
                        onClick={() => setConfirm({ ban, decision: "accept" })}
                      >
                        Accepter l&apos;appel
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircle size={14} />}
                        disabled={isPending}
                        onClick={() => setConfirm({ ban, decision: "reject" })}
                      >
                        Rejeter
                      </Button>
                      {ban.user && (
                        <Link href={`/admin/users/${ban.user.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir le profil →
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[13px] font-[family-name:var(--font-serif)] text-ink-faded">
                      <Gavel size={14} />
                      Décision prise —{" "}
                      <strong>{view === "accepted" ? "Compte rétabli" : "Appel rejeté"}</strong>
                    </div>
                  )}
                </div>
              </div>
            </PaperCard>
          );
        })}
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.decision === "accept" ? "Accepter l'appel" : "Rejeter l'appel"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
              Annuler
            </Button>
            <Button
              variant={confirm?.decision === "accept" ? "gold" : "danger"}
              size="sm"
              disabled={isPending}
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
          </>
        }
      >
        {confirm && (
          <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed">
            {confirm.decision === "accept"
              ? `En acceptant cet appel, le bannissement de ${fullName(confirm.ban.user)} est levé et le compte rétabli immédiatement.`
              : `En rejetant cet appel, la sanction de ${fullName(confirm.ban.user)} est maintenue.`}
          </p>
        )}
      </Modal>
    </AdminPage>
  );
}
