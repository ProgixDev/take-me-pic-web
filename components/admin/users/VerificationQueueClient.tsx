"use client";

import Link from "next/link";
import { Mail, Phone, BadgeCheck, CheckCircle2, XCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, PaperCard, Stamp, Tape } from "@/components/ui";
import type { VerificationQueueItem } from "@/lib/admin/users";

export function VerificationQueueClient({ queue }: { queue: VerificationQueueItem[] }) {
  return (
    <AdminPage
      title="File de vérification"
      eyebrow="confiance & identité"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { label: "Vérification" },
      ]}
      actions={
        <Badge tone={queue.length > 5 ? "red" : "gold"} dot>
          {queue.length} non vérifié{queue.length > 1 ? "s" : ""}
        </Badge>
      }
    >
      <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-5">
        Vue en lecture seule des états de vérification. L&apos;approbation manuelle arrivera avec une
        mutation auditée dédiée.
      </p>

      {queue.length === 0 ? (
        <PaperCard shadow="soft" className="p-10 text-center">
          <div className="flex justify-center mb-4">
            <Stamp color="green" shape="circle" size={72} rotate={-5}>
              {"tout\nvérifié !"}
            </Stamp>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-lg">
            Tous les profils sont vérifiés. Bravo l&apos;équipe !
          </p>
        </PaperCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {queue.map((user) => {
            const checks = [
              { label: "Adresse e-mail confirmée", icon: <Mail size={14} />, ok: user.emailVerified },
              { label: "Numéro de téléphone vérifié", icon: <Phone size={14} />, ok: user.phoneVerified },
              { label: "Profil vérifié", icon: <BadgeCheck size={14} />, ok: false },
            ];
            return (
              <PaperCard key={user.id} shadow="ink" className="p-5 relative overflow-hidden">
                <div className="absolute top-0 right-4">
                  <Tape color="cream" rotate={3} width={64} height={20} />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={user.avatarUrl ?? undefined} size={48} />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-[family-name:var(--font-serif)] font-bold text-[15px] leading-tight hover:underline"
                    >
                      {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                    </Link>
                    <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
                      {user.username}
                    </p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                      {user.city ?? "ville inconnue"} · membre depuis {user.memberSince}
                    </p>
                  </div>
                  <Badge tone={user.verification === "partial" ? "gold" : "neutral"} dot>
                    {user.verification === "partial" ? "partiel" : "aucune"}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-3 p-2 bg-paper-warm/40 rounded-[4px]">
                      <span className="text-ink-faded">{c.icon}</span>
                      <span className="font-[family-name:var(--font-serif)] text-[13px] flex-1">{c.label}</span>
                      <span className={c.ok ? "text-stamp-green" : "text-stamp-red"}>
                        {c.ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      </span>
                    </div>
                  ))}
                </div>
              </PaperCard>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}
