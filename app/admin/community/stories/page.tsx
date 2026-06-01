"use client";

import { useState } from "react";
import { Eye, X, Clock } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";
import { users, fmtNum } from "@/lib/data";

interface ActiveStory {
  id: string;
  user: { name: string; avatar: string; username: string };
  image: string;
  views: number;
  expiresIn: string; // text like "18h 24min"
  city: string;
  postedAt: string;
}

function computeExpiry(i: number): string {
  const h = 23 - (i % 23);
  const m = 59 - ((i * 7) % 59);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}min`;
}

const STORY_CAPTIONS = [
  "Lever de soleil 🌅",
  "Heure dorée ✿",
  "Ruelles secrètes",
  "Vue du sommet ☼",
  "Le café du matin",
  "Lumière rasante",
  "Terrasse panoramique",
  "Marché en couleurs",
  "Port au crépuscule",
  "Jardin botanique",
];

const STORY_CITIES = ["Paris", "Lisbonne", "Marrakech", "Barcelone", "Rome", "Tokyo", "Lyon", "Amsterdam"];

const initialStories: ActiveStory[] = Array.from({ length: 18 }, (_, i) => {
  const u = users[(i * 5 + 2) % users.length];
  return {
    id: `story-${i + 1}`,
    user: {
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.avatar,
      username: u.username,
    },
    image: `https://picsum.photos/seed/story_active${i}/400/600`,
    views: 20 + ((i * 137) % 800),
    expiresIn: computeExpiry(i),
    city: STORY_CITIES[i % STORY_CITIES.length],
    postedAt: `il y a ${1 + (i % 22)}h`,
  };
});

export default function StoriesPage() {
  const toast = useToast();
  const [stories, setStories] = useState(initialStories);

  const handleRemove = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
    toast.push("Story retirée de la plateforme.", "ok");
  };

  const totalViews = stories.reduce((acc, s) => acc + s.views, 0);
  const expiringCount = stories.filter((s) => s.expiresIn.startsWith("0") || parseInt(s.expiresIn) < 2).length;

  return (
    <AdminPage
      title="Stories actives"
      eyebrow="24 heures de lumière"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { label: "Stories" },
      ]}
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Stories actives"
          value={fmtNum(stories.length)}
          tone="ink"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Vues totales"
          value={fmtNum(totalViews)}
          delta="+14,8 %"
          tone="blue"
          icon={<Eye size={18} />}
        />
        <StatCard
          label="Expirent bientôt"
          value={expiringCount}
          tone="gold"
          icon={<Clock size={18} />}
        />
      </div>

      {/* Stories Grid — Polaroid style */}
      {stories.length === 0 ? (
        <div className="py-20 text-center font-[family-name:var(--font-hand)] text-2xl text-ink-faded">
          Aucune story active pour le moment ✿
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {stories.map((story, i) => (
            <StoryCard
              key={story.id}
              story={story}
              tilt={i % 3 === 0 ? -2 : i % 3 === 1 ? 1.5 : -1}
              onRemove={() => handleRemove(story.id)}
            />
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 p-4 bg-card border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded italic text-center">
          Les stories expirent automatiquement 24 h après leur publication.
          Utilisez « retirer » pour une suppression anticipée en cas de contenu inapproprié.
        </p>
      </div>
    </AdminPage>
  );
}

function StoryCard({
  story,
  tilt,
  onRemove,
}: {
  story: ActiveStory;
  tilt: number;
  onRemove: () => void;
}) {
  const isExpiringSoon = story.expiresIn.includes("min") || parseInt(story.expiresIn) <= 2;

  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Polaroid frame */}
      <div
        className="relative bg-polaroid shadow-polaroid p-[8px] pb-[36px] transition-transform duration-200 group-hover:scale-105"
        style={{ transform: `rotate(${tilt}deg)`, width: 140 }}
      >
        {/* Photo */}
        <div
          className="w-full bg-cover bg-center"
          style={{
            height: 160,
            backgroundImage: `url(${story.image})`,
          }}
        />

        {/* Expiry badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] ${
            isExpiringSoon
              ? "bg-stamp-red text-paper-warm"
              : "bg-ink/80 text-paper-warm"
          }`}
        >
          <Clock size={8} className="inline mr-0.5" />
          {story.expiresIn}
        </div>

        {/* Caption — author */}
        <div className="mt-2 text-center">
          <div className="font-[family-name:var(--font-hand)] text-[13px] text-ink leading-tight truncate">
            {story.user.name.split(" ")[0]}
          </div>
          <div className="font-[family-name:var(--font-type)] text-[9px] text-ink-faded truncate">
            {story.city}
          </div>
        </div>

        {/* Remove button — appears on hover */}
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-stamp-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
          title="Retirer la story"
        >
          <X size={12} className="text-paper-warm" />
        </button>
      </div>

      {/* Info below polaroid */}
      <div className="text-center">
        <div className="flex items-center gap-1 justify-center">
          <Avatar src={story.user.avatar} size={20} />
          <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded truncate max-w-[100px]">
            {story.user.username}
          </span>
        </div>
        <div className="flex items-center gap-1 justify-center mt-1">
          <Eye size={10} className="text-ink-faded" />
          <span className="font-[family-name:var(--font-serif)] text-[11px] font-bold">
            {fmtNum(story.views)}
          </span>
          <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded">vues</span>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={<X size={11} />}
          onClick={onRemove}
          className="mt-2 h-7 px-2.5 text-[11px]"
        >
          retirer
        </Button>
      </div>
    </div>
  );
}
