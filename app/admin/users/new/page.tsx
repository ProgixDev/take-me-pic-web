"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  PaperCard,
  Stamp,
  useToast,
} from "@/components/ui";

export default function NewUserPage() {
  const toast = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"active" | "pending">("pending");
  const [verification, setVerification] = useState<"verified" | "partial" | "none">("none");
  const [premium, setPremium] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      toast.push("Prénom et e-mail sont obligatoires.", "err");
      return;
    }
    setCreated(true);
    toast.push(`Compte créé pour ${firstName} ${lastName || ""}. Un e-mail d'invitation a été envoyé.`, "ok");
  };

  if (created) {
    return (
      <AdminPage
        title="Utilisateur créé"
        eyebrow="c'est fait !"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/users", label: "Utilisateurs" },
          { label: "Nouveau" },
        ]}
      >
        <div className="max-w-md mx-auto text-center py-16 flex flex-col items-center gap-6">
          <Stamp color="green" shape="circle" size={96} rotate={-6} fontSize={11}>
            {"compte\ncréé !"}
          </Stamp>
          <div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl mb-2">
              Invitation envoyée
            </h2>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded">
              {firstName} {lastName} recevra un e-mail pour finaliser son inscription.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/users">
              <Button variant="gold" size="md">
                Voir tous les utilisateurs
              </Button>
            </Link>
            <Button
              variant="paper"
              size="md"
              onClick={() => {
                setCreated(false);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setCity("");
                setBio("");
                setStatus("pending");
                setVerification("none");
                setPremium(false);
              }}
            >
              Créer un autre
            </Button>
          </div>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Nouvel utilisateur"
      eyebrow="inviter un voyageur"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { label: "Nouveau" },
      ]}
      actions={
        <Link href="/admin/users">
          <Button variant="paper" size="sm">
            ← Annuler
          </Button>
        </Link>
      }
    >
      <form onSubmit={handleCreate} className="max-w-2xl mx-auto space-y-6">
        {/* Info block */}
        <PaperCard shadow="soft" className="p-4 flex items-start gap-3 bg-gold-light/10">
          <span className="text-2xl mt-0.5">✉️</span>
          <div>
            <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
              Invitation par e-mail
            </p>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mt-0.5">
              Le compte sera créé en mode <em>en attente</em>. L&apos;utilisateur·ice recevra un lien
              pour définir son mot de passe et compléter son profil.
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
              label="Prénom *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              required
            />
            <Input
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom de famille"
            />
            <Input
              label="E-mail *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@exemple.com"
              required
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
              placeholder="Paris, Lisbonne, Tokyo…"
              className="sm:col-span-2"
            />
          </div>
          <Textarea
            label="Bio (facultatif)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Quelques mots sur ce voyageur pour personnaliser son profil…"
            rows={3}
          />
        </PaperCard>

        {/* Status & Access */}
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4 border-b border-dashed border-[var(--ink-line)] pb-2">
            Accès & statut
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select
              label="Statut initial"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "pending")}
            >
              <option value="pending">En attente</option>
              <option value="active">Actif immédiatement</option>
            </Select>
            <Select
              label="Niveau de vérification"
              value={verification}
              onChange={(e) => setVerification(e.target.value as typeof verification)}
            >
              <option value="none">Aucune</option>
              <option value="partial">Partiel</option>
              <option value="verified">Vérifié</option>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-2 p-4 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-[var(--ink-line)]">
            <div>
              <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                Activer Première classe (Premium)
              </p>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-0.5">
                Accès complet sans facturation — utile pour les testeurs ou partenaires
              </p>
            </div>
            <Toggle checked={premium} onChange={setPremium} />
          </div>
        </PaperCard>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/users">
            <Button variant="paper" size="md">
              Annuler
            </Button>
          </Link>
          <Button variant="gold" size="md" icon={<UserPlus size={15} />} type="submit">
            Créer & inviter
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}
