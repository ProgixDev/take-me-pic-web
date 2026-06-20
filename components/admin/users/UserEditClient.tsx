"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Input,
  PaperCard,
  Textarea,
  useToast,
} from "@/components/ui";
import { updateUserProfile, type UserActionResult } from "@/lib/admin/users-actions";
import type { UserDetailModel } from "@/lib/admin/users";

const STATUS_LABEL: Record<UserDetailModel["status"], string> = {
  active: "Actif",
  suspended: "Suspendu",
  banned: "Banni",
};

const STATUS_TONE: Record<UserDetailModel["status"], "green" | "gold" | "red"> = {
  active: "green",
  suspended: "gold",
  banned: "red",
};

const VERIF_LABEL: Record<UserDetailModel["verification"], string> = {
  verified: "Vérifié",
  partial: "Partiel",
  none: "Aucune",
};

function failureMessage(result: Exclude<UserActionResult, { kind: "ok" }>): string {
  if (result.kind === "unauthenticated") return "Session expirée — reconnecte-toi.";
  if (result.kind === "unauthorized") return "Action réservée au staff.";
  return result.message;
}

export function UserEditClient({ user }: { user: UserDetailModel }) {
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      push("Le prénom est obligatoire.", "err");
      return;
    }
    startTransition(async () => {
      const result = await updateUserProfile({
        userId: user.id,
        firstName,
        lastName,
        bio,
        city,
        phone,
      });
      if (result.kind === "ok") {
        push(`Profil de ${firstName.trim()} enregistré.`, "ok");
      } else {
        push(failureMessage(result), "err");
      }
    });
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username;

  return (
    <AdminPage
      title={`Modifier — ${fullName}`}
      eyebrow="édition du profil"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { href: `/admin/users/${user.id}`, label: fullName },
        { label: "Modifier" },
      ]}
      actions={
        <Link href={`/admin/users/${user.id}`}>
          <Button variant="paper" size="sm">
            ← Retour au profil
          </Button>
        </Link>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-6">
        {/* User header */}
        <PaperCard shadow="soft" className="p-5 flex items-center gap-4">
          <Avatar src={user.avatarUrl ?? undefined} size={56} ring={user.isPremium} />
          <div>
            <p className="font-[family-name:var(--font-serif)] font-bold text-lg">{fullName}</p>
            <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded">
              {user.username} · membre depuis {user.memberSince}
            </p>
          </div>
        </PaperCard>

        {/* Identity */}
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4 border-b border-dashed border-[var(--ink-line)] pb-2">
            Identité
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Input
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
            />
            <Input
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom de famille"
            />
            <Input
              label="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 …"
            />
            <Input
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris, Lisbonne…"
            />
          </div>
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Quelques mots sur ce voyageur…"
            rows={3}
          />
        </PaperCard>

        {/* Status & Verification — read-only; managed on dedicated surfaces */}
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-1 border-b border-dashed border-[var(--ink-line)] pb-2">
            Statut & Vérification
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-2 mb-4">
            Ces états ne se modifient pas ici : ils sont gérés via la modération, la file
            de vérification et les abonnements.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                Statut du compte
              </p>
              <Badge tone={STATUS_TONE[user.status]} dot>
                {STATUS_LABEL[user.status]}
              </Badge>
            </div>
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                Vérification
              </p>
              <Badge tone={user.verification === "verified" ? "green" : user.verification === "partial" ? "gold" : "neutral"}>
                {VERIF_LABEL[user.verification]}
              </Badge>
            </div>
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                Premium
              </p>
              <Badge tone={user.isPremium ? "gold" : "neutral"}>
                {user.isPremium ? "Première classe" : "Standard"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/admin/users/${user.id}`}>
              <Button variant="paper" size="sm">Modération du compte</Button>
            </Link>
            <Link href="/admin/premium">
              <Button variant="paper" size="sm">Gérer le Premium</Button>
            </Link>
          </div>
        </PaperCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="paper" size="md">
              Annuler
            </Button>
          </Link>
          <Button variant="gold" size="md" icon={<Save size={15} />} type="submit" disabled={isPending}>
            {isPending ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}
