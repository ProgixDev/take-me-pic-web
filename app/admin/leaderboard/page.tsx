"use client";

import { useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Avatar,
  Polaroid,
  Badge,
  Chip,
  PaperCard,
  Stamp,
  type Column,
} from "@/components/ui";
import { leaderboard, fmtNum } from "@/lib/data";

const CITIES = ["Toutes", ...Array.from(new Set(leaderboard.map((l) => l.user.city)))];

const podium = leaderboard.slice(0, 3);
const rest = leaderboard.slice(3);

interface LeaderRow {
  rank: number;
  user: typeof leaderboard[0]["user"];
  score: number;
}

export default function LeaderboardPage() {
  const [cityFilter, setCityFilter] = useState("Toutes");

  const filteredRest = rest.filter(
    (l) => cityFilter === "Toutes" || l.user.city === cityFilter
  );

  const columns: Column<LeaderRow>[] = [
    {
      key: "rank",
      header: "#",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] font-extrabold text-[18px] text-gold-deep">
          {r.rank}
        </span>
      ),
      sortValue: (r) => r.rank,
      align: "center",
    },
    {
      key: "user",
      header: "Voyageur",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Avatar src={r.user.avatar} size={36} ring />
          <div>
            <div className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
              {r.user.firstName} {r.user.lastName}
            </div>
            <div className="font-[family-name:var(--font-hand)] text-sm text-ink-faded">
              {r.user.username}
            </div>
          </div>
        </div>
      ),
      sortValue: (r) => r.user.lastName,
    },
    {
      key: "score",
      header: "Score karma",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] font-extrabold text-[16px] text-gold-deep">
          ⚡ {fmtNum(r.score)}
        </span>
      ),
      sortValue: (r) => r.score,
      align: "right",
    },
    {
      key: "city",
      header: "Ville",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          {r.user.country} {r.user.city}
        </span>
      ),
      sortValue: (r) => r.user.city,
    },
    {
      key: "photos",
      header: "Photos",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {r.user.photosGiven}
        </span>
      ),
      sortValue: (r) => r.user.photosGiven,
      align: "right",
    },
    {
      key: "rating",
      header: "Note",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          ★ {r.user.rating.toFixed(1)}
        </span>
      ),
      sortValue: (r) => r.user.rating,
      align: "right",
    },
  ];

  return (
    <AdminPage
      title="Tableau d'honneur"
      eyebrow="les meilleurs de la communauté ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Classement" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-gold-deep" />
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
            {leaderboard.length} voyageurs
          </span>
        </div>
      }
    >
      {/* Podium — top 3 */}
      <div className="mb-10">
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-6 flex items-center gap-2">
          <Medal size={20} className="text-gold-deep" />
          Podium d'or
        </h2>
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8">
          {/* 2nd place */}
          <div className="flex flex-col items-center gap-3 order-2 md:order-1">
            <Polaroid
              src={podium[1].user.avatar}
              caption={`${podium[1].user.firstName} ${podium[1].user.lastName}`}
              width={140}
              height={140}
              tilt={-3}
              captionSize={12}
            />
            <div className="text-center">
              <div className="text-3xl mb-1">🥈</div>
              <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                {podium[1].user.username}
              </div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-xl text-gold-deep">
                {fmtNum(podium[1].score)} pts
              </div>
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                {podium[1].user.city}
              </div>
            </div>
            <div className="w-24 h-16 bg-paper-2 border-[1.5px] border-ink rounded-t-[4px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-serif)] font-extrabold text-2xl text-ink-faded">2</span>
            </div>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center gap-3 order-1 md:order-2">
            <div className="relative">
              <Stamp color="gold" size={56} fontSize={8} rotate={-12} className="absolute -top-4 -right-6 z-10">
                {`N°1\n★★★`}
              </Stamp>
              <Polaroid
                src={podium[0].user.avatar}
                caption={`${podium[0].user.firstName} ${podium[0].user.lastName}`}
                width={168}
                height={168}
                tilt={2}
                captionSize={13}
              />
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">🥇</div>
              <div className="font-[family-name:var(--font-hand)] text-lg text-ink-faded">
                {podium[0].user.username}
              </div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-2xl text-gold-deep">
                {fmtNum(podium[0].score)} pts
              </div>
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                {podium[0].user.city}
              </div>
            </div>
            <div className="w-24 h-24 bg-gold-deep border-[1.5px] border-ink rounded-t-[4px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-paper-warm">1</span>
            </div>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center gap-3 order-3">
            <Polaroid
              src={podium[2].user.avatar}
              caption={`${podium[2].user.firstName} ${podium[2].user.lastName}`}
              width={130}
              height={130}
              tilt={4}
              captionSize={11}
            />
            <div className="text-center">
              <div className="text-3xl mb-1">🥉</div>
              <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                {podium[2].user.username}
              </div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-xl text-gold-deep">
                {fmtNum(podium[2].score)} pts
              </div>
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                {podium[2].user.city}
              </div>
            </div>
            <div className="w-24 h-12 bg-paper-2 border-[1.5px] border-ink rounded-t-[4px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-serif)] font-extrabold text-xl text-ink-faded">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* City filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CITIES.map((city) => (
          <Chip
            key={city}
            color="ink"
            variant={cityFilter === city ? "filled" : "outline"}
            size="sm"
            onClick={() => setCityFilter(city)}
          >
            {city}
          </Chip>
        ))}
      </div>

      {/* Rest of the leaderboard */}
      <PaperCard shadow="ink" className="overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-dashed border-[var(--ink-line)] bg-paper-2/60">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-base">
            Classement complet — rang 4 à {leaderboard.length}
          </h2>
        </div>
        <DataTable<LeaderRow>
          columns={columns}
          rows={filteredRest as LeaderRow[]}
          searchable
          searchPlaceholder="rechercher un voyageur…"
          pageSize={10}
          empty="Aucun voyageur dans cette ville."
        />
      </PaperCard>
    </AdminPage>
  );
}
