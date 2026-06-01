"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import {
  Clock,
  User,
  Share2,
  Link2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Send,
} from "lucide-react";
import { PageHero, Breadcrumb, CtaBand } from "@/components/marketing/MarketingBits";
import { PaperCard, Badge, Stamp, Tape, Polaroid, Button, SectionHeading, useToast } from "@/components/ui";
import { getBlogPost, blogPosts } from "@/lib/data";

const BADGE_TONES: Record<string, "neutral" | "green" | "red" | "blue" | "gold" | "sunset"> = {
  Histoire: "red",
  Spots: "green",
  Technique: "blue",
  Voyage: "gold",
  Produit: "neutral",
  Sécurité: "red",
  Itinéraire: "blue",
};

/* ---- Rich article body prose: fake paragraphs keyed by slug ---- */
const ARTICLE_BODIES: Record<
  string,
  { intro: string; pullQuote: string; h2: string; body2: string; h3: string; body3: string }
> = {
  "plus-jamais-selfie-rate": {
    intro:
      "C'était le 14 juillet, devant la tour Eiffel. Claire tendait son téléphone vers le ciel, le bras à l'horizontale, les yeux mi-clos contre le soleil. La photo qui en est sortie : floue, mal cadrée, et surtout sans la moindre âme. Elle a raconté cette scène à Léo, quelques jours plus tard, autour d'un café. Ce moment anodin est à l'origine de tout ce que vous utilisez aujourd'hui.",
    pullQuote:
      "« Il n'existait aucune app pour demander gentiment à un inconnu de nous photographier. On a décidé d'en construire une. »",
    h2: "L'idée derrière le karma",
    body2:
      "La grande question, au début, était celle de la confiance. Comment convaincre quelqu'un de donner son téléphone à un inconnu — ou inversement, d'accepter le téléphone d'un parfait étranger ? La réponse a émergé naturellement : le karma. Chaque photo prise pour quelqu'un crédite votre compte d'une monnaie communautaire. Vous donnez un peu de votre temps, vous recevez de la bienveillance. Un cercle vertueux, ancré dans la réalité des rencontres de voyage.",
    h3: "La suite ? Vous.",
    body3:
      "Aujourd'hui, des milliers de voyageurs se prennent mutuellement en photo à Paris, à Lisbonne, à Tokyo. Les plus belles images de voyage ne naissent plus d'un bras tendu ou d'un trépied planté sur un trottoir. Elles viennent d'un échange humain, d'un sourire partagé, d'un cadre suggéré par quelqu'un qui connaît l'endroit mieux que vous. C'est ça, Take Me Pic.",
  },
  "10-spots-paris": {
    intro:
      "Paris compte des millions de photos prises chaque jour. Et pourtant, la plupart montrent les mêmes angles : le Trocadéro bondé, la tour de face, le Louvre au petit matin. La communauté Take Me Pic a creusé plus loin, plus tôt le matin, plus tard le soir, pour dénicher dix spots qui ne figurent dans aucun guide touristique.",
    pullQuote:
      "« Le meilleur spot de Paris, c'est celui que la foule n'a pas encore découvert. Réveillez-vous avant elle. »",
    h2: "Cour de Rohan et impasse des Deux-Anges",
    body2:
      "Cachée entre le boulevard Saint-Germain et la rue de l'Ancienne-Comédie, la cour de Rohan forme un labyrinthe de petites cours médiévales quasi inconnues des touristes. À l'heure dorée, la lumière ricoche sur les vieilles pierres avec une douceur incomparable. Pour y accéder : la porte de bois sombre au numéro 4 de la cour du Commerce Saint-André. Elle est souvent ouverte.",
    h3: "Le pont de Bir-Hakeim, côté piliers",
    body3:
      "Tout le monde connaît le pont de Bir-Hakeim pour son panorama sur la tour Eiffel. Personne ne pense à glisser sous sa première arche, côté rive gauche, pour cadrer les piliers en perspective fuyante. Résultat : une photo architecturale éblouissante, sans un seul touriste dans le champ. À essayer absolument à 7h du matin, quand la lumière entre en biais depuis l'est.",
  },
  "lumiere-doree": {
    intro:
      "L'heure dorée. La magie dure en réalité entre 20 et 40 minutes — et encore moins en été sous des latitudes nordiques. Elle survient deux fois par jour : dans les trente minutes qui suivent le lever du soleil, et dans les trente minutes qui précèdent son coucher. Durant ces fenêtres brèves, la lumière voyage à travers une épaisseur d'atmosphère bien plus grande, filtrant les longueurs d'onde bleues et n'en laissant passer que l'orange et le jaune.",
    pullQuote:
      "« La lumière dorée ne se prépare pas — elle s'attend, les yeux ouverts, déjà en position. »",
    h2: "Pourquoi cette lumière change tout",
    body2:
      "Les ombres s'allongent, les textures s'affirment, les visages perdent leurs aspérités. Un mur de béton banal devient sculpture. Une place déserte se couvre d'une patine de film des années 70. C'est l'effet de la diffusion atmosphérique : à bas angle, les rayons rasent les surfaces au lieu de les bombarder verticalement. Chaque grain de sable, chaque aspérité d'une façade haussmannienne devient visible.",
    h3: "Comment préparer la session",
    body3:
      "Utilisez l'app The Photographer's Ephemeris pour calculer l'angle exact du soleil sur votre lieu de prise de vue. Repérez votre spot la veille, en milieu de journée, pour imaginer la direction de la lumière. Arrivez 15 minutes avant l'heure dorée : les premières minutes sont souvent les meilleures. Et si le ciel se couvre ? La lumière diffuse par temps nuageux est la deuxième plus belle lumière qui soit — molle, sans ombres dures, parfaite pour les portraits.",
  },
  default: {
    intro:
      "Le voyage, c'est avant tout une histoire d'yeux grands ouverts. On part pour voir, pour être vu autrement que dans sa routine quotidienne. Et la photo, dans ce contexte, n'est pas un caprice narcissique — c'est un acte de mémoire, une façon de dire « j'étais là, et c'était beau ». Depuis le lancement de Take Me Pic, des milliers d'histoires comme celle-ci se construisent chaque jour, entre inconnus devenus complices d'un cadre.",
    pullQuote:
      "« La meilleure photo de voyage est celle que vous n'avez pas prise vous-même — celle que quelqu'un d'autre a prise pour vous, avec votre propre regard dedans. »",
    h2: "Ce que la communauté nous apprend",
    body2:
      "Chaque semaine, des centaines de nouveaux spots sont ajoutés par la communauté. Des ruelles de Marrakech aux toits de Barcelone, les membres partagent non seulement des lieux mais des savoirs : à quelle heure la lumière entre dans cette cour ? De quel côté faut-il se placer pour éviter le contre-jour ? Quel truc pour faire paraître la façade plus grande ? Ce transfert de connaissance hyperlocal est impossible à trouver dans un guide imprimé.",
    h3: "L'avenir, c'est l'entraide",
    body3:
      "Nous croyons que la prochaine évolution de la photo de voyage ne viendra pas d'un meilleur capteur ou d'un algorithme d'IA plus puissant. Elle viendra des gens. D'une version amplifiée de ce qui se fait déjà spontanément entre voyageurs : « tu veux que je te prenne en photo ? » Take Me Pic ne réinvente pas ce geste — il lui donne une structure, une confiance, une récompense.",
  },
};

function getBody(slug: string) {
  return ARTICLE_BODIES[slug] ?? ARTICLE_BODIES.default;
}

export default function BlogPostPage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);
  const body = getBody(post.slug);
  const toast = useToast();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  function handleShare(via: string) {
    toast.push(t("Lien partagé via {{via}} !", { via }), "ok");
  }

  return (
    <>
      {/* Cover hero */}
      <div className="relative h-[45vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${post.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Stamp overlay */}
        <div className="absolute top-8 right-8 hidden md:block animate-stamp-in">
          <Stamp color="gold" size={88} fontSize={9} rotate={8}>
            {`${post.category}\n★\nTMP`}
          </Stamp>
        </div>

        {/* Tape on the image */}
        <div className="absolute top-0 left-1/3">
          <Tape color="cream" width={80} rotate={2} />
        </div>
      </div>

      {/* Article container */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { href: "/blog", label: t("Le carnet") },
            { label: post.title },
          ]}
        />

        <div className="mt-8 grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main article column */}
          <article>
            {/* Meta */}
            <div className="mb-4">
              <Badge tone={BADGE_TONES[post.category] ?? "neutral"}>{post.category}</Badge>
            </div>

            <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,4.5vw,52px)] tracking-[-0.03em] leading-[1.05] mb-6">
              {post.title}
            </h1>

            {/* Author + meta row */}
            <div className="flex flex-wrap items-center gap-5 pb-6 mb-8 border-b border-dashed border-[var(--ink-line)]">
              <div className="flex items-center gap-2 font-[family-name:var(--font-type)] text-sm text-ink-faded">
                <User size={14} />
                <span className="text-ink font-semibold">{post.author}</span>
              </div>
              <div className="flex items-center gap-2 font-[family-name:var(--font-type)] text-sm text-ink-faded">
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 font-[family-name:var(--font-type)] text-sm text-ink-faded">
                <Clock size={14} />
                <span>{post.readMin} {t("min de lecture")}</span>
              </div>
            </div>

            {/* Intro */}
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink mb-6">
              {body.intro}
            </p>

            {/* Pull quote */}
            <blockquote className="relative my-10 pl-6 border-l-[3px] border-gold-deep">
              <div className="absolute -left-4 -top-2 font-[family-name:var(--font-hand)] text-6xl text-gold-deep/30 leading-none select-none">
                "
              </div>
              <p className="font-[family-name:var(--font-serif)] italic text-[20px] leading-[1.55] text-ink-faded">
                {body.pullQuote}
              </p>
            </blockquote>

            {/* Section 2 */}
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[24px] tracking-tight mt-10 mb-4">
              {body.h2}
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink mb-6">
              {body.body2}
            </p>

            {/* Inline polaroid */}
            <div className="flex flex-wrap gap-6 my-10 justify-center">
              <Polaroid
                src={post.cover}
                caption={post.author}
                width={200}
                height={160}
                tilt={-3}
                captionSize={15}
              />
              <Polaroid
                src={`https://picsum.photos/seed/${post.slug}alt/800/800`}
                caption={post.date}
                width={200}
                height={160}
                tilt={2}
                captionSize={15}
              />
            </div>

            {/* Section 3 */}
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[20px] tracking-tight mt-8 mb-4">
              {body.h3}
            </h3>
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink mb-8">
              {body.body3}
            </p>

            {/* Closing excerpt */}
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink-faded italic">
              {post.excerpt} {t("— et c'est exactement pourquoi nous avons continué à construire.")}
            </p>

            {/* Divider */}
            <div className="divider-dashed my-10" />

            {/* Share buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-[family-name:var(--font-hand)] text-lg text-ink-faded">
                {t("partager —")}
              </span>
              <Button
                variant="paper"
                size="sm"
                icon={<Send size={14} />}
                onClick={() => handleShare("Twitter / X")}
              >
                Twitter
              </Button>
              <Button
                variant="paper"
                size="sm"
                icon={<ExternalLink size={14} />}
                onClick={() => handleShare("Facebook")}
              >
                Facebook
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Link2 size={14} />}
                onClick={() => {
                  handleShare("le presse-papiers");
                }}
              >
                {t("copier le lien")}
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author card */}
            <PaperCard shadow="soft" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-3">
                {t("l'auteur·e")}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-kraft flex items-center justify-center font-[family-name:var(--font-serif)] font-bold text-paper-warm text-base">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-semibold text-sm">
                    {post.author}
                  </div>
                  <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                    {t("Équipe Take Me Pic")}
                  </div>
                </div>
              </div>
              <p className="font-[family-name:var(--font-serif)] text-sm text-ink-faded leading-relaxed">
                {t("Passionné·e de photo de voyage et de communautés en ligne.")}
              </p>
            </PaperCard>

            {/* Share card */}
            <PaperCard shadow="soft" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-3">
                {t("partager")}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="paper"
                  size="sm"
                  full
                  icon={<Share2 size={14} />}
                  onClick={() => handleShare("les réseaux")}
                >
                  {t("partager l'article")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  full
                  icon={<Link2 size={14} />}
                  onClick={() => handleShare("le presse-papiers")}
                >
                  {t("copier le lien")}
                </Button>
              </div>
            </PaperCard>

            {/* Back to blog */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] text-sm text-ink-faded hover:text-ink transition"
              >
                <ArrowLeft size={14} />
                {t("retour au carnet")}
              </Link>
            </div>
          </aside>
        </div>

        {/* À lire ensuite */}
        <section className="mt-20">
          <div className="divider-dashed mb-10" />
          <SectionHeading
            eyebrow={t("à lire ensuite")}
            title={t("D'autres pages du carnet")}
            className="mb-8"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                <PaperCard shadow="soft" className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative h-36 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${p.cover})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5 bg-card">
                    <Badge tone={BADGE_TONES[p.category] ?? "neutral"} className="mb-2">
                      {p.category}
                    </Badge>
                    <h4 className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-2 group-hover:text-gold-deep transition-colors">
                      {p.title}
                    </h4>
                    <div className="flex items-center justify-between mt-3 font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                      <span>{p.date}</span>
                      <span className="flex items-center gap-1 text-gold-deep">
                        {p.readMin} min <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </PaperCard>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <CtaBand />
    </>
  );
}
