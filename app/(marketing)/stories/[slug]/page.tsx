"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import { ArrowLeft, Download, Quote, MapPin, Camera, Heart } from "lucide-react";
import { Breadcrumb, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Polaroid,
  Stamp,
  Tape,
  Avatar,
  Button,
  Badge,
  SectionHeading,
  useToast,
} from "@/components/ui";
import { getStory, stories } from "@/lib/data";

/* ---- Rich narrative prose keyed by slug ---- */
const STORY_NARRATIVES: Record<
  string,
  {
    lead: string;
    h2: string;
    body1: string;
    pullQuote: string;
    h3: string;
    body2: string;
    closing: string;
    photos: string[];
    stats: Array<{ label: string; value: string }>;
  }
> = {
  "claire-paris": {
    lead: "Claire n'a jamais eu confiance en ses selfies. Depuis ses 20 ans, ses photos de voyage se résument à des bras tendus flous, des contre-jours ratés, et des visages coupés par le bord d'un écran. Tout a changé un mardi matin de novembre, devant le Sacré-Cœur.",
    h2: "La rencontre sur les marches",
    body1:
      "Ce jour-là, Claire cherchait quelqu'un pour lui prendre une photo devant le panorama de Paris. Elle hésitait — demander à un inconnu, ça ne se fait pas, non ? Elle a ouvert Take Me Pic. En trente secondes, un message : Sami, photographe amateur, disponible à 200 mètres. Cinq minutes plus tard, il était là. Il a pris sept photos, toutes merveilleuses. La huitième est devenue sa photo de profil pendant deux ans.",
    pullQuote:
      "« Pour la première fois depuis des années, j'avais une vraie photo de moi en voyage. Pas un bras, pas un trépied — une rencontre. »",
    h3: "Ce qu'elle a appris à donner",
    body2:
      "Claire raconte que le vrai changement n'est pas venu du fait de recevoir des photos. C'est quand elle a commencé à en prendre pour les autres. À Lisbonne, l'été suivant, elle a passé une matinée entière à aider des touristes perdus devant le tram 28. Elle a découvert le meilleur angle pour la façade bleue de Santa Luzia. Elle a mangé le meilleur pastel de nata de sa vie, recommandé par une Américaine qu'elle venait d'aider. Le karma, ce n'est pas que des points.",
    closing:
      "Aujourd'hui, Claire est dans le top 5 % des membres Take Me Pic à Paris. Elle a aidé 187 personnes à avoir de belles photos d'elles-mêmes. Et chaque fois qu'elle ouvre l'app, elle espère un peu croiser quelqu'un qui a autant besoin d'elle qu'elle avait besoin de Sami, ce mardi matin de novembre.",
    photos: ["story1", "blog1", "blog2"],
    stats: [
      { label: "photos reçues", value: "34" },
      { label: "photos données", value: "187" },
      { label: "karma accumulé", value: "2 840" },
      { label: "villes visitées avec TMP", value: "6" },
    ],
  },
  "leo-lisbonne": {
    lead: "Léo est parti à Lisbonne en solo pour la première fois à 26 ans. Il avait prévu de ne parler à personne, de manger seul, de marcher des heures en silence. Il est rentré avec quatre nouveaux amis, une invitation à Séville, et des photos qu'il n'aurait jamais pu prendre seul.",
    h2: "L'économie de l'entraide en action",
    body1:
      "La première session de Léo à Lisbonne a duré dix minutes. Il cherchait quelqu'un pour le photographier devant le Miradouro da Graça. Il a trouvé Marco, un Brésilien en escale de 48 heures. Marco a pris les photos, puis a demandé si Léo connaissait un bon restaurant portugais. Léo ne connaissait pas, mais il connaissait quelqu'un qui connaissait quelqu'un. Ils ont dîné ensemble. Ils se parlent encore.",
    pullQuote:
      "« Prendre des photos pour les autres ne m'a pas juste donné du karma. Ça m'a donné les meilleurs souvenirs de voyage de ma vie. »",
    h3: "La chaîne qui se perpétue",
    body2:
      "Ce que Léo a compris à Lisbonne, c'est que l'acte de photographier quelqu'un crée une dette émotionnelle positive. La personne que vous avez aidée veut vous rendre service d'une autre façon. Elle vous invite à son café préféré. Elle vous montre le chemin vers la plage secrète. Elle partage sa table. Take Me Pic n'a pas inventé la solidarité entre voyageurs — mais il lui a donné un cadre, une confiance, une raison de s'approcher.",
    closing:
      "Léo revient à Lisbonne chaque printemps maintenant. Il dit que c'est la seule ville où il se sent chez lui sans y habiter. Il attribue ça à Take Me Pic, et à toutes les personnes que l'app lui a permis de croiser.",
    photos: ["story2", "blog7", "blog3"],
    stats: [
      { label: "sessions complétées", value: "52" },
      { label: "amis rencontrés via TMP", value: "4" },
      { label: "pays photographiés", value: "8" },
      { label: "karma total", value: "3 120" },
    ],
  },
  "ines-marrakech": {
    lead: "Inès pensait connaître Marrakech. Elle y était allée trois fois avec sa famille, toujours dans les mêmes rues, les mêmes souks, les mêmes restaurants recommandés par les guides. La quatrième fois, elle a ouvert Take Me Pic — et découvert une ville qu'elle ne connaissait pas du tout.",
    h2: "Les spots que les guides oublient",
    body1:
      "La communauté TMP à Marrakech compte 5 200 membres actifs. Ensemble, ils ont référencé 140 spots photo dans la ville — dont 80 % ne figurent dans aucun guide imprimé. La fontaine du palais El Badi à 6h du matin. La terrasse d'un riad anonyme dans l'ancien mellah, inaccessible sans passer par une porte verte que seuls les habitants connaissent. La ruelle derrière le souk des teinturiers, entre 15h et 16h, quand la lumière entre en oblique.",
    pullQuote:
      "« La communauté me connaît mieux que les guides. Elle sait où je dois aller, à quelle heure, et quel angle utiliser. »",
    h3: "Partager pour ne pas perdre",
    body2:
      "Inès a commencé à ajouter ses propres spots à la carte. D'abord hésitante — ces endroits ne méritaient-ils pas de rester secrets ? Puis elle a réalisé que partager ne détruisait pas la magie. Au contraire : plus les membres sont nombreux à fréquenter un spot, plus ils le protègent, plus ils veillent à ne pas le surexposer. La communauté autorégule. Les meilleurs spots restent accessibles aux initiés.",
    closing:
      "Inès est aujourd'hui ambassadrice Take Me Pic à Marrakech. Elle organise des walks photo mensuels pour les membres de passage. Elle a publié 34 spots sur la carte communautaire. Et elle dit que chaque fois qu'elle aide un inconnu à photographier quelque chose de beau, elle a l'impression de lui donner un morceau de sa ville.",
    photos: ["story3", "blog5", "blog6"],
    stats: [
      { label: "spots ajoutés", value: "34" },
      { label: "membres aidés", value: "98" },
      { label: "walks organisés", value: "12" },
      { label: "karma", value: "4 210" },
    ],
  },
  "famille-bernard": {
    lead: "Quand les Bernard ont décidé de partir à Lisbonne avec leurs trois enfants (8, 11 et 14 ans), la grande question n'était pas l'itinéraire — c'était la sécurité. Comment rester soudé dans une ville inconnue, avec des ados qui voulaient explorer seuls ?",
    h2: "Le mode famille qui rassure",
    body1:
      "Le mode famille de Take Me Pic permet à chaque membre du groupe de partager sa position en temps réel avec les autres — pendant la durée du voyage uniquement. Aucune donnée conservée après. Aucune surveillance permanente. Juste la certitude, quand le plus grand part explorer Alfama avec ses écouteurs, que son icône est bien sur la carte. La liberté encadrée, disent les Bernard. Le juste équilibre entre aventure et sécurité.",
    pullQuote:
      "« Le mode famille nous a rassurés sans brider les enfants. Ils pouvaient explorer. Nous pouvions souffler. C'est rare, comme équilibre. »",
    h3: "Des souvenirs que la famille peut voir",
    body2:
      "Le bonus inattendu : les enfants sont devenus de vrais photographes. Emma (14 ans) a aidé six touristes à se prendre en photo devant le tram 28. Théo (11 ans) a découvert qu'il adorait prendre des photos de rue — et en a fait 200 en deux jours. La galerie de famille, partagée en fin de voyage, était à couper le souffle. Pas un seul selfie raté. Que des moments vrais, capturés par les uns pour les autres.",
    closing:
      "Les Bernard reviennent à Lisbonne l'été prochain. Emma veut faire une vraie session photo au Miradouro das Portas do Sol. Théo veut explorer le quartier de Mouraria avec son appareil. Et les parents veulent juste — pour la première fois — être tous les cinq dans la même photo.",
    photos: ["story4", "blog4", "blog7"],
    stats: [
      { label: "sessions en famille", value: "8" },
      { label: "photos partagées", value: "214" },
      { label: "membres du groupe", value: "5" },
      { label: "villes avec mode famille", value: "3" },
    ],
  },
};

function getNarrative(slug: string) {
  return STORY_NARRATIVES[slug] ?? STORY_NARRATIVES["claire-paris"];
}

export default function StoryPage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const story = getStory(slug);
  const narrative = getNarrative(story.slug);
  const toast = useToast();

  const otherStories = stories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <>
      {/* Magazine cover hero */}
      <div className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${story.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

        {/* Stamp */}
        <div className="absolute top-8 right-8 hidden md:block animate-stamp-in">
          <Stamp color="gold" size={84} fontSize={9} rotate={8}>{`TMP\n★\nSTORY`}</Stamp>
        </div>

        {/* Tape accent */}
        <div className="absolute top-0 left-1/4">
          <Tape color="blue" width={70} rotate={1} />
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 max-w-7xl mx-auto">
          <div className="flex items-end gap-6">
            <Avatar src={story.avatar} size={80} ring className="shrink-0 mb-1" />
            <div>
              <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.12em] text-paper-warm/70 mb-1 flex items-center gap-2">
                <MapPin size={11} />
                {story.city}
              </div>
              <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(32px,5vw,58px)] tracking-[-0.03em] leading-tight text-paper-warm">
                {story.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <Breadcrumb
          items={[
            { href: "/stories", label: t("Témoignages") },
            { label: story.name },
          ]}
        />

        <div className="mt-10 grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Narrative column */}
          <div>
            {/* Big pull quote opener */}
            <div className="relative mb-12 bg-paper-warm border-[1.5px] border-gold-deep rounded-[4px] p-8 shadow-gold overflow-hidden">
              <div className="absolute -top-4 -left-4 opacity-20">
                <Quote size={64} className="text-gold-deep" />
              </div>
              <p className="font-[family-name:var(--font-serif)] italic text-[clamp(20px,2.5vw,28px)] leading-[1.5] text-ink relative z-10">
                {story.quote}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar src={story.avatar} size={36} />
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-semibold text-sm">
                    {story.name}
                  </div>
                  <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-widest">
                    {story.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Lead */}
            <p className="font-[family-name:var(--font-serif)] text-[18px] leading-[1.75] text-ink mb-8">
              {narrative.lead}
            </p>

            {/* Section 1 */}
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[22px] tracking-tight mb-4 mt-10">
              {narrative.h2}
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink mb-6">
              {narrative.body1}
            </p>

            {/* Polaroid row */}
            <div className="flex flex-wrap gap-6 my-12 items-end">
              <div className="relative">
                <Tape color="cream" width={55} rotate={-3} className="absolute -top-3 left-1/2 -translate-x-1/2" />
                <Polaroid
                  src={story.cover}
                  caption={story.city}
                  width={180}
                  height={180}
                  tilt={-3}
                  captionSize={16}
                />
              </div>
              {narrative.photos.slice(1, 3).map((ph, i) => (
                <div key={ph} className="relative">
                  <Tape
                    color={i === 0 ? "blue" : "red"}
                    width={50}
                    rotate={i % 2 === 0 ? 4 : -2}
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  />
                  <Polaroid
                    src={`https://picsum.photos/seed/${ph}/800/800`}
                    caption={story.name}
                    width={160}
                    height={160}
                    tilt={i % 2 === 0 ? 2 : -2}
                    captionSize={14}
                  />
                </div>
              ))}
            </div>

            {/* Pull quote inline */}
            <blockquote className="relative my-10 pl-6 border-l-[3px] border-gold-deep">
              <div className="absolute -left-3 -top-1 font-[family-name:var(--font-hand)] text-5xl text-gold-deep/30 leading-none select-none">
                "
              </div>
              <p className="font-[family-name:var(--font-serif)] italic text-[19px] leading-[1.6] text-ink-faded">
                {narrative.pullQuote}
              </p>
            </blockquote>

            {/* Section 2 */}
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[20px] tracking-tight mb-4 mt-10">
              {narrative.h3}
            </h3>
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink mb-6">
              {narrative.body2}
            </p>

            {/* Closing */}
            <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.75] text-ink-faded italic border-l-2 border-dashed border-[var(--ink-line)] pl-5 mt-8">
              {narrative.closing}
            </p>

            {/* CTA row */}
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/download">
                <Button variant="gold" size="md" icon={<Download size={16} />}>
                  {t("télécharger l'app")}
                </Button>
              </Link>
              <Link href="/stories">
                <Button variant="paper" size="md" icon={<ArrowLeft size={16} />}>
                  {t("autres témoignages")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile card */}
            <PaperCard shadow="gold" className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Tape color="cream" width={45} rotate={-3} className="absolute -top-3 left-1/2 -translate-x-1/2" />
                  <Polaroid
                    src={story.avatar}
                    caption={story.name}
                    width={130}
                    height={130}
                    tilt={-2}
                    captionSize={16}
                  />
                </div>
                <div className="flex items-center gap-1.5 font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-widest mt-2">
                  <MapPin size={11} />
                  {story.city}
                </div>
                <Badge tone="gold" className="mt-3">
                  {t("membre TMP")}
                </Badge>
              </div>
            </PaperCard>

            {/* Stats card */}
            <PaperCard shadow="soft" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-4">
                {t("en chiffres")}
              </div>
              <div className="space-y-3">
                {narrative.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between py-2 border-b border-dashed border-[var(--ink-line)] last:border-0"
                  >
                    <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded uppercase tracking-wide">
                      {stat.label}
                    </span>
                    <span className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-ink">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </PaperCard>

            {/* Like / share */}
            <PaperCard shadow="soft" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-4">
                {t("cette histoire vous touche ?")}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="paper"
                  size="sm"
                  full
                  icon={<Heart size={14} />}
                  onClick={() => toast.push(t("Merci pour votre soutien ✦"), "ok")}
                >
                  {t("j'aime cette histoire")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  full
                  icon={<Camera size={14} />}
                  onClick={() => toast.push(t("Lien pour partager copié !"), "ok")}
                >
                  {t("partager")}
                </Button>
              </div>
            </PaperCard>

            {/* Back link */}
            <div className="text-center">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] text-sm text-ink-faded hover:text-ink transition"
              >
                <ArrowLeft size={14} />
                {t("tous les témoignages")}
              </Link>
            </div>
          </aside>
        </div>

        {/* Other stories section */}
        {otherStories.length > 0 && (
          <section className="mt-20">
            <div className="divider-dashed mb-10" />
            <SectionHeading
              eyebrow={t("d'autres voyageurs")}
              title={t("Ils ont aussi quelque chose à raconter")}
              className="mb-8"
            />

            <div className="grid sm:grid-cols-3 gap-6 stagger">
              {otherStories.map((s, i) => (
                <Link key={s.slug} href={`/stories/${s.slug}`} className="block group">
                  <PaperCard
                    shadow="soft"
                    tilt={[-1, 1, -2][i % 3]}
                    className="overflow-visible hover:shadow-gold transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Cover thumb */}
                    <div className="relative h-40 overflow-hidden rounded-t-[3px]">
                      <div
                        className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${s.cover})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                      {/* Tape */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                        <Tape color="cream" width={45} rotate={i % 2 === 0 ? -3 : 2} />
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-5 bg-card flex gap-3 items-start">
                      <Avatar src={s.avatar} size={36} ring className="shrink-0 mt-0.5" />
                      <div>
                        <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">
                          {s.name}
                        </div>
                        <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-widest">
                          {s.city}
                        </div>
                        <p className="font-[family-name:var(--font-serif)] italic text-[13px] text-ink-faded leading-relaxed mt-1.5">
                          &ldquo;{s.quote.substring(0, 65)}…&rdquo;
                        </p>
                      </div>
                    </div>
                  </PaperCard>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <CtaBand />
    </>
  );
}
