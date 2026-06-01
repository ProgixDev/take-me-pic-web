"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Eye, BookOpen, FileText } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Button,
  Chip,
  StatCard,
  Tabs,
  useToast,
} from "@/components/ui";
import { guides, helpArticles, blogPosts, fmtNum } from "@/lib/data";

type ContentTab = "secrets" | "aide" | "articles";

// Synthesize some how-to entries
const howToEntries = [
  { id: "h1", title: "Comment envoyer une demande de photo", category: "Démarrer", status: "publié" as const, views: 32100, updated: "12 mai 2026" },
  { id: "h2", title: "Gérer mes disponibilités sur la carte", category: "Profil", status: "publié" as const, views: 18400, updated: "8 mai 2026" },
  { id: "h3", title: "Partager ma galerie de session", category: "Photos", status: "publié" as const, views: 14700, updated: "5 mai 2026" },
  { id: "h4", title: "Signaler un comportement inapproprié", category: "Sécurité", status: "publié" as const, views: 9600, updated: "1 mai 2026" },
  { id: "h5", title: "Activer le mode famille pour un proche", category: "Sécurité", status: "brouillon" as const, views: 0, updated: "28 avr. 2026" },
  { id: "h6", title: "Comprendre mon score de karma", category: "Compte", status: "publié" as const, views: 22300, updated: "22 avr. 2026" },
  { id: "h7", title: "Annuler ou modifier une réservation", category: "Paiements", status: "publié" as const, views: 7800, updated: "15 avr. 2026" },
  { id: "h8", title: "Passer en mode Première classe", category: "Premium", status: "brouillon" as const, views: 0, updated: "10 avr. 2026" },
];

const CATEGORY_COLORS: Record<string, "gold" | "blue" | "green" | "neutral" | "red"> = {
  "Démarrer": "green",
  "Profil": "blue",
  "Photos": "gold",
  "Sécurité": "red",
  "Compte": "blue",
  "Paiements": "gold",
  "Premium": "gold",
  "Technique": "blue",
  "Histoire": "neutral",
  "Spots": "green",
  "Voyage": "blue",
  "Produit": "gold",
  "Itinéraire": "green",
};

export default function GuidesLibraryPage() {
  const toast = useToast();
  const [tab, setTab] = useState<ContentTab>("secrets");
  const [statusFilter, setStatusFilter] = useState<"tous" | "publié" | "brouillon">("tous");

  const filteredGuides = useMemo(() => {
    if (statusFilter === "tous") return guides;
    return guides.filter((g) => g.status === statusFilter);
  }, [statusFilter]);

  const filteredHowTo = useMemo(() => {
    if (statusFilter === "tous") return howToEntries;
    return howToEntries.filter((h) => h.status === statusFilter);
  }, [statusFilter]);

  const filteredBlog = useMemo(() => {
    return blogPosts;
  }, []);

  const totalContent = guides.length + howToEntries.length + blogPosts.length;
  const totalPublished = guides.filter((g) => g.status === "publié").length
    + howToEntries.filter((h) => h.status === "publié").length
    + blogPosts.length;
  const totalViews = guides.reduce((a, g) => a + g.views, 0)
    + howToEntries.reduce((a, h) => a + h.views, 0);

  return (
    <AdminPage
      title="Bibliothèque de contenu"
      eyebrow="guides & articles"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/content", label: "Contenu" },
        { label: "Guides" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => toast.push("Éditeur de contenu — ouverture.", "info")}
        >
          Nouveau contenu
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Contenus total" value={totalContent} tone="ink" icon={<BookOpen size={18} />} />
        <StatCard label="Publiés" value={totalPublished} tone="green" icon={<Eye size={18} />} />
        <StatCard label="Vues cumulées" value={fmtNum(totalViews)} delta="+11,2 %" tone="gold" />
        <StatCard label="Articles blog" value={blogPosts.length} tone="blue" icon={<FileText size={18} />} />
      </div>

      {/* Tab switcher */}
      <Tabs
        tabs={[
          { key: "secrets", label: `Secrets photo (${guides.length})` },
          { key: "aide", label: `Centre d'aide (${howToEntries.length})` },
          { key: "articles", label: `Blog (${blogPosts.length})` },
        ]}
        value={tab}
        onChange={(k) => setTab(k as ContentTab)}
        className="mb-4"
      />

      {/* Status filter (not for blog) */}
      {tab !== "articles" && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
            Statut :
          </span>
          {(["tous", "publié", "brouillon"] as const).map((s) => (
            <Chip
              key={s}
              color={statusFilter === s ? "ink" : s === "brouillon" ? "gold" : "ink"}
              variant={statusFilter === s ? "filled" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "tous" ? "Tous" : s === "publié" ? "Publiés" : "Brouillons"}
            </Chip>
          ))}
        </div>
      )}

      {/* Tab: Secrets photo */}
      {tab === "secrets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuides.map((guide) => (
            <PaperCard key={guide.id} shadow="soft" className="p-4 hover:shadow-ink transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded">
                    #{guide.number}
                  </span>
                  <Badge tone={guide.status === "publié" ? "green" : "neutral"} dot>
                    {guide.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit2 size={13} />}
                  onClick={() => toast.push(`Édition du secret « ${guide.title} ».`, "info")}
                >
                  Modifier
                </Button>
              </div>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1">
                {guide.title}
              </h3>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-3">
                {guide.excerpt}
              </p>
              {guide.status === "publié" && (
                <div className="flex items-center gap-1 font-[family-name:var(--font-type)] text-[11px] text-gold-deep">
                  <Eye size={12} />
                  {fmtNum(guide.views)} vues
                </div>
              )}
            </PaperCard>
          ))}
        </div>
      )}

      {/* Tab: Centre d'aide */}
      {tab === "aide" && (
        <div className="space-y-3">
          {filteredHowTo.map((article) => (
            <PaperCard key={article.id} shadow="soft" className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={CATEGORY_COLORS[article.category] ?? "neutral"}>
                      {article.category}
                    </Badge>
                    <Badge tone={article.status === "publié" ? "green" : "neutral"} dot>
                      {article.status}
                    </Badge>
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] font-semibold text-[15px] mb-0.5 truncate">
                    {article.title}
                  </h3>
                  <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                    Mis à jour le {article.updated}
                    {article.status === "publié" && (
                      <> · <Eye size={11} className="inline -mt-0.5" /> {fmtNum(article.views)} vues</>
                    )}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={13} />}
                    onClick={() => toast.push(`Édition de l'article « ${article.title} ».`, "info")}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </PaperCard>
          ))}
        </div>
      )}

      {/* Tab: Blog */}
      {tab === "articles" && (
        <div className="space-y-3">
          {filteredBlog.map((post) => (
            <PaperCard key={post.slug} shadow="soft" className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={post.cover}
                  alt=""
                  className="w-16 h-16 object-cover rounded-[4px] border-[1.5px] border-ink shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={CATEGORY_COLORS[post.category] ?? "neutral"}>
                      {post.category}
                    </Badge>
                    <Badge tone="green" dot>publié</Badge>
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] font-semibold text-[15px] mb-0.5 truncate">
                    {post.title}
                  </h3>
                  <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                    {post.author} · {post.date} · {post.readMin} min de lecture
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit2 size={13} />}
                  onClick={() => toast.push(`Édition de l'article « ${post.title} ».`, "info")}
                >
                  Modifier
                </Button>
              </div>
            </PaperCard>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
