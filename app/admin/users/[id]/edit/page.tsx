"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  PaperCard,
  Avatar,
  useToast,
} from "@/components/ui";
import { getUser } from "@/lib/data";

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const user = getUser(id);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [city, setCity] = useState(user.city);
  const [bio, setBio] = useState(user.bio);
  const [status, setStatus] = useState(user.status);
  const [verification, setVerification] = useState(user.verification);
  const [premium, setPremium] = useState(user.premium);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.push(`Profil de ${firstName} ${lastName} enregistré.`, "ok");
  };

  return (
    <AdminPage
      title={`Modifier — ${user.firstName} ${user.lastName}`}
      eyebrow="édition du profil"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { href: `/admin/users/${user.id}`, label: `${user.firstName} ${user.lastName}` },
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
          <Avatar src={user.avatar} size={56} ring={user.premium} />
          <div>
            <p className="font-[family-name:var(--font-serif)] font-bold text-lg">
              {user.firstName} {user.lastName}
            </p>
            <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded">
              {user.username} · membre depuis {user.joined}
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
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@mail.com"
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
              className="sm:col-span-2"
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

        {/* Status & Verification */}
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4 border-b border-dashed border-[var(--ink-line)] pb-2">
            Statut & Vérification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select
              label="Statut du compte"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
              <option value="banned">Banni</option>
            </Select>
            <Select
              label="Niveau de vérification"
              value={verification}
              onChange={(e) => setVerification(e.target.value as typeof verification)}
            >
              <option value="verified">Vérifié</option>
              <option value="partial">Partiel</option>
              <option value="none">Aucune</option>
            </Select>
          </div>

          {/* Premium toggle */}
          <div className="flex items-center justify-between mt-2 p-4 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-[var(--ink-line)]">
            <div>
              <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                Compte Première classe (Premium)
              </p>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-0.5">
                Accès à toutes les fonctionnalités premium sans facturation
              </p>
            </div>
            <Toggle checked={premium} onChange={setPremium} />
          </div>
        </PaperCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="paper" size="md">
              Annuler
            </Button>
          </Link>
          <Button variant="gold" size="md" icon={<Save size={15} />} type="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}
