"use client";

import { useState } from "react";
import {
  Save,
  LogOut,
  Eye,
  EyeOff,
  Camera,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Polaroid,
  Avatar,
  Input,
  Select,
  Toggle,
  Badge,
  Stamp,
  Tape,
  useToast,
} from "@/components/ui";
import { team } from "@/lib/data";

/* ── Claire B. is always users[0] in team ─────────────────────────── */
const CLAIRE = team[0]; // { name: "Claire Bernard", role: "CEO & cofondatrice", avatar: av(47) }

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AdminProfilePage() {
  const { push } = useToast();

  // Profile fields
  const [firstName, setFirstName] = useState("Claire");
  const [lastName, setLastName] = useState("Bernard");
  const [email, setEmail] = useState("claire.bernard@takemepic.app");
  const [phone, setPhone] = useState("+33 6 12 34 56 78");
  const [bio, setBio] = useState("CEO & cofondatrice — photographe amateure, fan de lumières du matin ☼");
  const [lang, setLang] = useState("fr");

  // Password change
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFA, setTwoFA] = useState(true);

  function handleSaveProfile() {
    push("Profil enregistré avec succès ✓", "ok");
  }

  function handleSavePassword() {
    if (!currentPwd || !newPwd || !confirmPwd) {
      push("Veuillez remplir tous les champs", "err");
      return;
    }
    if (newPwd !== confirmPwd) {
      push("Les mots de passe ne correspondent pas", "err");
      return;
    }
    if (newPwd.length < 8) {
      push("Le mot de passe doit comporter au moins 8 caractères", "err");
      return;
    }
    push("Mot de passe modifié ✓", "ok");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  }

  function handleLogout() {
    push("Déconnexion en cours… À bientôt, Claire ! 👋", "info");
  }

  return (
    <AdminPage
      title="Mon profil"
      eyebrow="compte admin ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Mon profil" },
      ]}
      actions={
        <Button
          variant="danger"
          size="sm"
          icon={<LogOut size={14} />}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: avatar + identity ── */}
        <div className="space-y-5">
          {/* Polaroid card */}
          <PaperCard shadow="gold" className="p-6 relative overflow-hidden text-center">
            <Tape color="cream" rotate={-3} className="absolute -top-1 left-1/2 -translate-x-1/2" />
            <div className="flex justify-center mb-4">
              <Polaroid
                src={CLAIRE.avatar}
                caption="Claire B."
                width={160}
                tilt={-2}
                captionSize={18}
              />
            </div>
            <div className="relative z-10">
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl">
                {firstName} {lastName}
              </h2>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mt-0.5">
                {CLAIRE.role}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge tone="red" dot>Admin</Badge>
                <Badge tone="green">Vérifié</Badge>
              </div>
            </div>
            <Stamp color="gold" shape="octagon" size={56} rotate={12} fontSize={8} className="absolute bottom-3 right-3 opacity-25">
              CEO
            </Stamp>
          </PaperCard>

          {/* Quick stats */}
          <PaperCard shadow="soft" className="p-4">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">Activité récente</div>
            <div className="space-y-2.5">
              {[
                { label: "Dernière connexion", value: "il y a 12 min" },
                { label: "Membre depuis", value: "Janvier 2026" },
                { label: "Sessions révoquées", value: "0" },
                { label: "Actions this week", value: "47" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">{label}</span>
                  <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{value}</span>
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Change avatar */}
          <Button
            variant="paper"
            size="sm"
            full
            icon={<Camera size={14} />}
            onClick={() => push("Changement de photo (démo) ✓", "info")}
          >
            Changer la photo
          </Button>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal info */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Informations personnelles</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Modifier le profil</h2>
              </div>
              <Avatar src={CLAIRE.avatar} size={48} ring online />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Nom de famille"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Input
                label="Adresse e-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Téléphone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Biographie"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <Select
                label="Langue préférée"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="fr">Français 🇫🇷</option>
                <option value="en">English 🇬🇧</option>
                <option value="ar">العربية 🇲🇦</option>
              </Select>
            </div>

            <div className="flex justify-end mt-2">
              <Button variant="gold" size="sm" icon={<Save size={14} />} onClick={handleSaveProfile}>
                Enregistrer le profil
              </Button>
            </div>
          </PaperCard>

          {/* Password */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={16} className="text-stamp-blue" />
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Sécurité</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Changer le mot de passe</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <div className="sm:col-span-2 relative">
                <Input
                  label="Mot de passe actuel"
                  type={showPwd ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-10 text-ink-faded hover:text-ink transition cursor-pointer"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Input
                label="Nouveau mot de passe"
                type={showPwd ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Confirmer le nouveau mot de passe"
                type={showPwd ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end mt-2">
              <Button variant="paper" size="sm" icon={<Shield size={14} />} onClick={handleSavePassword}>
                Modifier le mot de passe
              </Button>
            </div>
          </PaperCard>

          {/* Preferences */}
          <PaperCard shadow="soft" className="p-6">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-4">Préférences</div>
            <div className="space-y-0">
              {[
                {
                  icon: <Moon size={15} className="text-stamp-blue" />,
                  label: "Mode sombre",
                  sub: "Interface en thème sombre",
                  state: darkMode,
                  set: setDarkMode,
                },
                {
                  icon: <Sun size={15} className="text-gold-deep" />,
                  label: "Vue compacte",
                  sub: "Réduire l'espacement dans les tableaux",
                  state: compactView,
                  set: setCompactView,
                },
                {
                  icon: <Bell size={15} className="text-stamp-green" />,
                  label: "Notifications e-mail",
                  sub: "Recevoir les alertes par e-mail",
                  state: emailNotifs,
                  set: setEmailNotifs,
                },
                {
                  icon: <Bell size={15} className="text-sunset" />,
                  label: "Notifications push",
                  sub: "Recevoir les alertes en temps réel",
                  state: pushNotifs,
                  set: setPushNotifs,
                },
                {
                  icon: <Shield size={15} className="text-stamp-red" />,
                  label: "Double authentification (2FA)",
                  sub: "Obligatoire pour les administrateurs",
                  state: twoFA,
                  set: setTwoFA,
                },
                {
                  icon: <Globe size={15} className="text-stamp-blue" />,
                  label: "Analytics anonymisées",
                  sub: "Partager des données d'usage anonymes",
                  state: true,
                  set: () => push("Paramètre mis à jour ✓", "ok"),
                },
              ].map(({ icon, label, sub, state, set }, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between py-3.5 ${
                    i < arr.length - 1 ? "border-b border-[var(--ink-line)]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5">{icon}</span>
                    <div>
                      <p className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{label}</p>
                      <p className="font-[family-name:var(--font-serif)] text-[11px] text-ink-faded mt-0.5">{sub}</p>
                    </div>
                  </div>
                  <Toggle checked={state} onChange={set} />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="gold"
                size="sm"
                icon={<Save size={14} />}
                onClick={() => push("Préférences enregistrées ✓", "ok")}
              >
                Enregistrer les préférences
              </Button>
            </div>
          </PaperCard>

          {/* Danger zone */}
          <PaperCard shadow="soft" className="p-6 border-stamp-red/30">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-stamp-red mb-4">
              Zone de déconnexion
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">Se déconnecter de tous les appareils</p>
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                  Révoque toutes vos sessions actives sauf celle-ci
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<LogOut size={14} />}
                onClick={() => push("Toutes les autres sessions ont été révoquées ✓", "ok")}
              >
                Déconnecter partout
              </Button>
            </div>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
