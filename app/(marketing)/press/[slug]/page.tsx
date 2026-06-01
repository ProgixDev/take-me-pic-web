"use client";

import { useParams } from "next/navigation";
import { PageHero, Breadcrumb } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { press, getPress } from "@/lib/data";
import { Download, ArrowLeft, Calendar, FileText, Share2, Mail } from "lucide-react";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";

const FULL_RELEASES: Record<string, { body: string[]; tags: string[] }> = {
  "levee-de-fonds": {
    tags: ["Financement", "Croissance", "Europe"],
    body: [
      "Take Me Pic, la plateforme qui connecte les voyageurs pour qu'ils se photographient mutuellement, annonce aujourd'hui avoir finalisé une levée de fonds de 8 millions d'euros. Ce tour de table, mené par le fonds européen Voyage Ventures aux côtés de Partech et de plusieurs business angels du secteur des loisirs et de la technologie, marque une étape décisive dans le développement de la jeune pousse parisienne.",
      "Fondée en janvier 2026 par Claire Bernard et Léo Margaux, Take Me Pic a atteint en moins de six mois le million de photos échangées entre voyageurs sur sa plateforme. L'application, disponible sur iOS et Android, repose sur un modèle d'entraide communautaire : les voyageurs se prennent mutuellement en photo, accumulent du karma, et accèdent en échange à des avantages exclusifs.",
      "« Cette levée de fonds nous permet d'accélérer notre développement international, d'investir dans la sécurité et la confiance, et de recruter les 20 talents qui nous rejoindront d'ici la fin de l'année », déclare Claire Bernard, CEO et cofondatrice. « Nous sommes convaincus que la photo de voyage est un besoin universel que nous pouvons résoudre de manière communautaire et éthique. »",
      "Les fonds seront notamment alloués au renforcement des équipes produit et communauté, à l'expansion dans cinq nouveaux marchés (Espagne, Italie, Royaume-Uni, Allemagne, Portugal), et au développement de nouvelles fonctionnalités autour du mode famille et des spots photo exclusifs.",
      "Take Me Pic revendique aujourd'hui 48 230 utilisateurs actifs dans 42 pays, avec un Net Promoter Score de 72 et une note de 4,8 étoiles sur l'App Store. La plateforme génère déjà des revenus récurrents via son abonnement Première classe, souscrit par 8,5 % de la base utilisateurs.",
      "Pour plus d'informations ou pour planifier un entretien avec les fondateurs, contactez notre service presse : presse@takemepic.app",
    ],
  },
  "million-photos": {
    tags: ["Communauté", "Jalon", "Croissance"],
    body: [
      "Take Me Pic a franchi aujourd'hui le cap symbolique d'un million de photos échangées entre voyageurs sur sa plateforme. Exactement un an après le lancement de l'application, cette étape illustre la vitalité d'une communauté qui a su réinventer la photographie de voyage.",
      "Ce million de clichés représente des dizaines de milliers de rencontres impromptues entre voyageurs de 42 pays différents. Des portraits devant la Tour Eiffel, des couchers de soleil à Lisbonne, des scènes de vie à Marrakech — autant de moments capturés grâce à l'entraide entre inconnus.",
      "« Un million de photos, c'est un million de moments où quelqu'un a dit oui à un étranger qui lui demandait de l'aide », se réjouit Inès Rahmouni, Head of Community. « C'est la preuve que les voyageurs se font confiance, et que notre pari sur la bienveillance humaine était fondé. »",
      "Les données montrent que 78 % des utilisateurs qui reçoivent une photo deviennent eux-mêmes photographes volontaires dans les 7 jours suivants. Cette mécanique vertueuse est au cœur du modèle Take Me Pic : chacun donne ce qu'il reçoit.",
      "Pour marquer cette occasion, Take Me Pic lance une édition limitée du badge « Témoin du Million », décerné aux 1 000 utilisateurs les plus actifs lors de cette semaine anniversaire. Le badge est visible sur le profil et confère un statut particulier dans la communauté.",
    ],
  },
  "lancement": {
    tags: ["Lancement", "Produit", "App Store"],
    body: [
      "Take Me Pic est disponible dès aujourd'hui en téléchargement gratuit sur l'App Store et le Google Play Store. L'application, conçue et développée à Paris, répond à un problème universel rencontré par des millions de voyageurs : comment avoir de vraies belles photos de soi en voyage, sans selfie-bâton et sans se fier au hasard ?",
      "Le fonctionnement est simple et ingénieux : l'application géolocalise en temps réel les voyageurs à proximité qui sont disponibles pour s'entraider. Un voyageur qui souhaite être pris en photo envoie un « pli » (une demande discrète et non intrusive) aux personnes à portée. Celles qui acceptent reçoivent du karma, la monnaie d'entraide de la plateforme.",
      "« Nous avons tous vécu cette frustration : rentrer d'un voyage sans une seule vraie photo de nous », explique Claire Bernard, CEO et cofondatrice. « Avec Take Me Pic, nous transformons cette frustration en une opportunité de rencontre. Les gens qui voyagent sont naturellement ouverts et bienveillants. »",
      "L'application embarque plusieurs fonctionnalités de sécurité pensées dès la conception : vérification d'identité optionnelle, GPS éphémère (jamais stocké après la session), mode famille pour les parents avec enfants, et un système de notes bidirectionnel qui garantit la confiance.",
      "Take Me Pic est disponible en français, anglais, espagnol et portugais. La version 1.0 propose la géolocalisation de proximité, la galerie de session chiffrée 24 h, le système de karma, et la cartographie des spots photo recommandés par la communauté. Les prochaines versions introduiront les guides photo intégrés et les expériences organisées.",
      "L'application est gratuite dans sa version Carnet. Un abonnement Première classe, à partir de 4,99 €/mois, offre des avantages supplémentaires dont un essai de 7 jours offert.",
    ],
  },
};

const DEFAULT_BODY = [
  "Take Me Pic est une plateforme communautaire qui connecte les voyageurs du monde entier pour qu'ils se photographient mutuellement. Fondée en janvier 2026 à Paris, l'application repose sur un système d'entraide basé sur le karma.",
  "Pour plus d'informations, contactez notre service presse à l'adresse presse@takemepic.app.",
];

export default function PressReleasePage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const toast = useToast();
  const article = getPress(slug);
  const content = FULL_RELEASES[slug] ?? { body: DEFAULT_BODY, tags: ["Actualités"] };
  const related = press.filter((p) => p.slug !== slug);

  function handleKitDownload() {
    toast.push(t("Téléchargement du kit presse lancé (PDF + médias, 38 Mo)…"), "ok");
  }

  function handleShare() {
    toast.push(t("Lien copié dans le presse-papiers !"), "ok");
  }

  return (
    <div>
      <div className="bg-paper-warm border-b border-dashed border-[var(--ink-line)]">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <Breadcrumb
            items={[
              { href: "/", label: t("Accueil") },
              { href: "/press", label: t("Presse") },
              { label: article.title },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex gap-10 items-start">
          {/* Corps de l'article */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge tone="green" dot>{t("Communiqué officiel")}</Badge>
                {content.tags.map((tag) => (
                  <Chip key={tag} color="gold" variant="outline" size="sm">{tag}</Chip>
                ))}
              </div>
              <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-0.02em] mb-4">
                {article.title}
              </h1>
              <p className="font-[family-name:var(--font-serif)] text-xl text-ink-faded leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-ink-faded font-[family-name:var(--font-type)]">
                  <Calendar size={13} />
                  {article.date}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-faded font-[family-name:var(--font-type)]">
                  <FileText size={13} />
                  {t("Take Me Pic SAS — Communiqué de presse")}
                </div>
              </div>
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 border-t border-dashed border-[var(--ink-line)]" />
              <Stamp color="red" size={52} fontSize={8} rotate={-5}>{t("PRESSE\n★")}</Stamp>
              <div className="flex-1 border-t border-dashed border-[var(--ink-line)]" />
            </div>

            {/* Corps du texte */}
            <div className="font-[family-name:var(--font-serif)] text-ink leading-relaxed space-y-5">
              {content.body.map((para, i) => (
                <p key={i} className={i === 0 ? "text-lg font-medium" : ""}>
                  {para}
                </p>
              ))}
            </div>

            {/* Section contact presse */}
            <div className="mt-10 p-5 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded">
              <p className="font-semibold font-[family-name:var(--font-serif)] mb-1">{t("Contact presse")}</p>
              <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)]">
                {t("Pour toute demande d'interview, d'informations complémentaires ou de visuels :")}
              </p>
              <a href="mailto:presse@takemepic.app" className="text-gold-deep font-semibold underline text-sm">
                presse@takemepic.app
              </a>
              <p className="text-xs text-ink-faded mt-1 font-[family-name:var(--font-type)]">
                {t("Réponse garantie sous 2 h ouvrées")}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3 flex-wrap">
              <Button
                variant="gold"
                icon={<Download size={16} />}
                onClick={handleKitDownload}
              >
                {t("Télécharger le kit presse")}
              </Button>
              <Button
                variant="ghost"
                icon={<Share2 size={16} />}
                onClick={handleShare}
              >
                {t("Partager ce communiqué")}
              </Button>
              <Button
                variant="ghost"
                icon={<Mail size={16} />}
                onClick={() => toast.push(t("Formulaire de contact presse ouvert."), "info")}
              >
                {t("Contacter la presse")}
              </Button>
            </div>

            {/* Retour */}
            <div className="mt-8 pt-8 border-t border-dashed border-[var(--ink-line)]">
              <Link href="/press">
                <Button variant="ghost" icon={<ArrowLeft size={16} />}>
                  {t("Retour à l'espace presse")}
                </Button>
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 space-y-5">
            {/* Kit presse */}
            <PaperCard shadow="gold" className="p-5">
              <h3 className="font-[family-name:var(--font-serif)] font-bold mb-3">{t("Kit presse 2026")}</h3>
              <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)] mb-4">
                {t("Logos, photos haute résolution, dossier complet.")}
              </p>
              <Button
                variant="gold"
                full
                size="sm"
                icon={<Download size={14} />}
                onClick={handleKitDownload}
              >
                {t("Télécharger (38 Mo)")}
              </Button>
            </PaperCard>

            {/* Autres communiqués */}
            {related.length > 0 && (
              <PaperCard shadow="soft" className="p-5">
                <h3 className="font-[family-name:var(--font-serif)] font-bold mb-4">
                  {t("Autres communiqués")}
                </h3>
                <div className="space-y-3">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/press/${p.slug}`} className="group block">
                      <p className="text-sm font-[family-name:var(--font-serif)] group-hover:text-gold-deep transition font-medium">
                        {p.title}
                      </p>
                      <p className="text-xs text-ink-faded font-[family-name:var(--font-type)] mt-0.5">
                        {p.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </PaperCard>
            )}

            {/* Chiffres clés */}
            <PaperCard shadow="soft" className="p-5">
              <h3 className="font-[family-name:var(--font-serif)] font-bold mb-4">
                {t("Chiffres clés")}
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: t("Utilisateurs"), value: "48 230" },
                  { label: t("Photos"), value: "1 M+" },
                  { label: t("Pays"), value: "42" },
                  { label: t("Levée"), value: "8 M€" },
                ].map((kpi) => (
                  <div key={kpi.label} className="flex justify-between text-sm">
                    <span className="text-ink-faded font-[family-name:var(--font-serif)]">{kpi.label}</span>
                    <span className="font-bold font-[family-name:var(--font-serif)]">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </PaperCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
