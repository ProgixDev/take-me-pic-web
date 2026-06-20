"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Eye, Clock, Trash2, Film } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Badge, Avatar, Button, StatCard, fmtNum, useToast } from "@/components/ui";
import { removeStory, type StoryActionResult } from "@/lib/admin/stories-actions";
import type { ActiveStory } from "@/lib/admin/stories";

function failureMessage(result: Exclude<StoryActionResult, { kind: "ok" }>): string {
  if (result.kind === "unauthenticated") return "Session expirée — reconnecte-toi.";
  if (result.kind === "unauthorized") return "Action réservée au staff.";
  return result.message;
}

function expiresInLabel(expiresAt: string): { text: string; soon: boolean } {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return { text: "expirée", soon: true };
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return { text: h === 0 ? `${m} min` : `${h}h ${m}min`, soon: ms < 2 * 3_600_000 };
}

function fullName(p: ActiveStory["user"]): string {
  if (!p) return "Utilisateur inconnu";
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || p.username;
}

export function StoriesClient({ stories: initial }: { stories: ActiveStory[] }) {
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState<Set<number>>(new Set());

  const stories = useMemo(() => initial.filter((s) => !removed.has(s.id)), [initial, removed]);

  const totalViews = stories.reduce((acc, s) => acc + s.viewCount, 0);
  const expiringCount = stories.filter((s) => expiresInLabel(s.expiresAt).soon).length;

  function handleRemove(story: ActiveStory) {
    startTransition(async () => {
      const result = await removeStory(story.id);
      if (result.kind === "ok") {
        setRemoved((prev) => new Set(prev).add(story.id));
        push("Story retirée de la plateforme.", "ok");
      } else {
        push(failureMessage(result), "err");
      }
    });
  }

  return (
    <AdminPage
      title="Stories actives"
      eyebrow="modération des stories ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { label: "Stories" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Stories actives" value={stories.length} icon={<Film size={16} />} />
        <StatCard label="Vues cumulées" value={fmtNum(totalViews)} icon={<Eye size={16} />} />
        <StatCard label="Expirent bientôt" value={expiringCount} tone="gold" icon={<Clock size={16} />} />
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 font-[family-name:var(--font-hand)] text-xl text-ink-faded">
          Aucune story active pour l&apos;instant.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((story) => {
            const exp = expiresInLabel(story.expiresAt);
            return (
              <PaperCard key={story.id} shadow="ink" className="overflow-hidden">
                <div className="relative aspect-[2/3] bg-paper-warm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image src={story.imageUrl} alt={story.caption ?? "story"} fill className="object-cover" unoptimized />
                  <div className="absolute top-2 left-2">
                    <Badge tone={exp.soon ? "red" : "neutral"} dot>
                      {exp.text}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar src={story.user?.avatarUrl ?? undefined} size={26} />
                    <div className="min-w-0">
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px] truncate">{fullName(story.user)}</div>
                      {story.city && <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded truncate">{story.city}</div>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded flex items-center gap-1">
                      <Eye size={12} /> {fmtNum(story.viewCount)}
                    </span>
                    <Button variant="danger" size="sm" icon={<Trash2 size={13} />} disabled={isPending} onClick={() => handleRemove(story)}>
                      Retirer
                    </Button>
                  </div>
                </div>
              </PaperCard>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center font-[family-name:var(--font-serif)] italic text-[12px] text-ink-faded">
        Les stories expirent automatiquement 24 h après leur publication.
      </p>
    </AdminPage>
  );
}
