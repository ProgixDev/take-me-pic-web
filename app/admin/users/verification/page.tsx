"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Stamp,
  Tape,
  Toggle,
  useToast,
} from "@/components/ui";
import { users, AdminUser } from "@/lib/data";

// Only users that are not fully verified
const pending = users.filter((u) => u.verification !== "verified").slice(0, 14);

interface CheckRow {
  label: string;
  icon: React.ReactNode;
  ok: boolean;
}

function buildChecks(user: AdminUser): CheckRow[] {
  const idx = users.indexOf(user);
  return [
    { label: "Adresse e-mail confirmée", icon: <Mail size={14} />, ok: true },
    { label: "Numéro de téléphone vérifié", icon: <Phone size={14} />, ok: idx % 3 !== 2 },
    { label: "Pièce d'identité soumise", icon: <FileText size={14} />, ok: user.verification === "partial" },
    { label: "Selfie de validation", icon: <User size={14} />, ok: user.verification === "partial" && idx % 2 === 0 },
  ];
}

export default function VerificationQueuePage() {
  const toast = useToast();
  const [queue, setQueue] = useState<AdminUser[]>(pending);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, Record<string, boolean>>>({});

  const getToggle = (userId: string, key: string, defaultVal: boolean) =>
    toggleStates[userId]?.[key] ?? defaultVal;

  const setToggle = (userId: string, key: string, val: boolean) => {
    setToggleStates((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] ?? {}), [key]: val },
    }));
  };

  const handleApprove = () => {
    if (!selected) return;
    setQueue((q) => q.filter((u) => u.id !== selected.id));
    toast.push(`${selected.firstName} ${selected.lastName} est maintenant vérifié·e.`, "ok");
    setApproveOpen(false);
    setSelected(null);
  };

  const handleReject = () => {
    if (!selected) return;
    setQueue((q) => q.filter((u) => u.id !== selected.id));
    toast.push(`Demande de ${selected.firstName} rejetée.`, "err");
    setRejectOpen(false);
    setSelected(null);
  };

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
          {queue.length} en attente
        </Badge>
      }
    >
      {queue.length === 0 ? (
        <PaperCard shadow="soft" className="p-10 text-center">
          <div className="flex justify-center mb-4">
            <Stamp color="green" shape="circle" size={72} rotate={-5}>
              {"tout\nvérifié !"}
            </Stamp>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-lg">
            La file de vérification est vide. Bravo l&apos;équipe !
          </p>
        </PaperCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {queue.map((user) => {
            const checks = buildChecks(user);
            const allOk = checks.every((c) => c.ok);
            return (
              <PaperCard key={user.id} shadow="ink" className="p-5 relative overflow-hidden">
                {/* Decorative tape */}
                <div className="absolute top-0 right-4">
                  <Tape color="cream" rotate={3} width={64} height={20} />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={user.avatar} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] font-bold text-[15px] leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
                      {user.username}
                    </p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                      {user.email} · {user.city}
                    </p>
                  </div>
                  <Badge tone={user.verification === "partial" ? "gold" : "neutral"} dot>
                    {user.verification === "partial" ? "partiel" : "aucune"}
                  </Badge>
                </div>

                {/* ID document placeholder */}
                <div className="bg-paper-warm/70 border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] h-24 flex items-center justify-center mb-4">
                  {user.verification === "partial" ? (
                    <div className="text-center">
                      <FileText size={28} className="text-ink-faded mx-auto mb-1" />
                      <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                        Document soumis · en cours d&apos;examen
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText size={28} className="text-ink-faded/40 mx-auto mb-1" />
                      <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded/60">
                        Aucun document soumis
                      </p>
                    </div>
                  )}
                </div>

                {/* Check rows */}
                <div className="space-y-2.5 mb-4">
                  {checks.map((c, i) => {
                    const toggled = getToggle(user.id, `check${i}`, c.ok);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 bg-paper-warm/40 rounded-[4px]"
                      >
                        <span className="text-ink-faded">{c.icon}</span>
                        <span className="font-[family-name:var(--font-serif)] text-[13px] flex-1">
                          {c.label}
                        </span>
                        <span className={toggled ? "text-stamp-green" : "text-stamp-red"}>
                          {toggled ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                        </span>
                        <Toggle
                          checked={toggled}
                          onChange={(v) => setToggle(user.id, `check${i}`, v)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-dashed border-[var(--ink-line)]">
                  <Button
                    variant="danger"
                    size="sm"
                    full
                    icon={<ShieldX size={14} />}
                    onClick={() => {
                      setSelected(user);
                      setRejectOpen(true);
                    }}
                  >
                    Rejeter
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    full
                    icon={<ShieldCheck size={14} />}
                    onClick={() => {
                      setSelected(user);
                      setApproveOpen(true);
                    }}
                  >
                    Approuver
                  </Button>
                </div>
              </PaperCard>
            );
          })}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        title="Approuver la vérification ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setApproveOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<ShieldCheck size={14} />} onClick={handleApprove}>
              Approuver
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          Le profil de{" "}
          <strong>
            {selected?.firstName} {selected?.lastName}
          </strong>{" "}
          sera marqué comme <strong>vérifié</strong> et le badge de confiance sera affiché publiquement.
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Rejeter cette demande ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setRejectOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" size="sm" icon={<ShieldX size={14} />} onClick={handleReject}>
              Rejeter
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          La demande de vérification de{" "}
          <strong>
            {selected?.firstName} {selected?.lastName}
          </strong>{" "}
          sera rejetée. Un e-mail d&apos;explication sera envoyé automatiquement.
        </p>
      </Modal>
    </AdminPage>
  );
}
