"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, ShieldCheck } from "lucide-react";
import {
  Button,
  PaperCard,
  Stamp,
  Tape,
  Input,
  Modal,
  useToast,
} from "@/components/ui";
import { signInAdmin } from "@/lib/auth";
import { useT } from "@/i18n/I18nProvider";

export default function LoginPage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.push(t("Remplis tous les champs avant de continuer."), "err");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signInAdmin();
      toast.push(t("Connexion réussie — bienvenue dans la salle des cartes ✨"), "ok");
      router.push("/admin");
    }, 700);
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) {
      toast.push(t("Saisis ton adresse e-mail."), "err");
      return;
    }
    setForgotOpen(false);
    toast.push(t("Lien de réinitialisation envoyé à {{forgotEmail}} 📬", { forgotEmail }), "ok");
    setForgotEmail("");
  }

  return (
    <>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-5 py-16 bg-paper paper">
        <div className="relative w-full max-w-md">
          {/* Decorative elements */}
          <div className="absolute -top-6 left-0">
            <Tape color="cream" rotate={-5} width={70} height={24} />
          </div>
          <div className="absolute -top-6 right-8">
            <Tape color="red" rotate={4} width={50} height={22} />
          </div>
          <div className="absolute -top-8 right-0 z-10">
            <Stamp color="blue" size={88} rotate={-14} fontSize={8}>
              {t("ESPACE\nADMIN\n★")}
            </Stamp>
          </div>

          <PaperCard shadow="gold" className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="font-[family-name:var(--font-hand)] text-3xl text-gold-deep -rotate-1 mb-2">
                {t("salle des cartes")}
              </div>
              <h1 className="font-[family-name:var(--font-serif)] font-bold text-3xl tracking-[-0.02em]">
                {t("Espace administrateur")}
              </h1>
              <p className="font-[family-name:var(--font-serif)] text-ink-faded text-sm mt-2">
                {t("Réservé à l'équipe Take Me Pic. La console de pilotage t'attend.")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-1">
              <div className="relative">
                <Input
                  label={t("E-mail administrateur")}
                  type="email"
                  placeholder="admin@takemepic.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Mail
                  size={15}
                  className="absolute right-3 top-[42px] text-ink-faded pointer-events-none"
                />
              </div>

              <div className="relative">
                <Input
                  label={t("Mot de passe")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] text-ink-faded hover:text-ink transition cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword
                      ? t("Masquer le mot de passe")
                      : t("Afficher le mot de passe")
                  }
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-right pb-2">
                <button
                  type="button"
                  className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded hover:text-ink underline underline-offset-2 cursor-pointer transition"
                  onClick={() => setForgotOpen(true)}
                >
                  {t("Mot de passe oublié ?")}
                </button>
              </div>

              <Button
                variant="gold"
                full
                size="lg"
                type="submit"
                icon={<LogIn size={18} />}
                disabled={loading}
              >
                {loading ? t("Connexion…") : t("Se connecter")}
              </Button>
            </form>

            {/* Admin-only note (no public user accounts on the web) */}
            <div className="mt-6 flex items-start gap-2.5 rounded-[4px] border border-dashed border-[var(--ink-line)] bg-paper-warm/60 px-3.5 py-3">
              <ShieldCheck size={16} className="text-stamp-green mt-0.5 shrink-0" />
              <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                {t("Tu es voyageur ?")}{" "}
                <Link
                  href="/download"
                  className="text-ink font-semibold underline underline-offset-2 hover:text-gold-deep transition"
                >
                  {t("Télécharge l'app")}
                </Link>{" "}
                {t("— tout se passe sur ton téléphone. Cet espace est réservé à l'équipe.")}
              </p>
            </div>

            {/* Passport stamp decoration */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-3 opacity-40">
                <div className="h-px flex-1 w-16 border-t border-dashed border-ink-faded" />
                <Stamp color="ink" size={52} rotate={3} fontSize={8}>
                  {`TMP\n2026`}
                </Stamp>
                <div className="h-px flex-1 w-16 border-t border-dashed border-ink-faded" />
              </div>
            </div>
          </PaperCard>

          {/* Terms note */}
          <p className="text-center font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded mt-4">
            {t("Accès réservé · toute connexion est")}{" "}
            <Link
              href="/legal/privacy"
              className="underline hover:text-ink transition"
            >
              {t("journalisée")}
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot password modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title={t("Réinitialiser le mot de passe")}
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setForgotOpen(false)}
            >
              {t("Annuler")}
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleForgot as unknown as React.MouseEventHandler}
            >
              {t("Envoyer le lien")}
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] mb-5 leading-relaxed">
          {t("Saisis ton adresse e-mail. Si un compte existe, tu recevras un lien pour créer un nouveau mot de passe dans les prochaines minutes.")}
        </p>
        <form onSubmit={handleForgot}>
          <Input
            label={t("Adresse e-mail")}
            type="email"
            placeholder={t("toi@exemple.com")}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </form>
        <div className="flex justify-center mt-2">
          <Stamp color="blue" size={60} rotate={-8} fontSize={8}>
            {t("SÉCURISÉ\n✓")}
          </Stamp>
        </div>
      </Modal>
    </>
  );
}
