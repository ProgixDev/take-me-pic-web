"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Star, Eye, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Avatar,
  Badge,
  Chip,
  Button,
  StatCard,
} from "@/components/ui";
import { spots, PhotoSpot, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "approved" | "pending" | "rejected";
type CategoryFilter = "toutes" | "coucher" | "lever" | "portrait" | "archi";

const STATUS_TONE: Record<PhotoSpot["status"], "green" | "gold" | "red"> = {
  approved: "green",
  pending: "gold",
  rejected: "red",
};

const STATUS_LABEL: Record<PhotoSpot["status"], string> = {
  approved: "validé",
  pending: "en attente",
  rejected: "rejeté",
};

const CAT_LABEL: Record<PhotoSpot["category"], string> = {
  coucher: "Coucher ☀",
  lever: "Lever 🌅",
  portrait: "Portrait",
  archi: "Architecture",
};

const CAT_TONE: Record<PhotoSpot["category"], "gold" | "blue" | "green" | "red"> = {
  coucher: "gold",
  lever: "blue",
  portrait: "green",
  archi: "red",
};

export default function SpotsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("toutes");

  const filtered = useMemo(() => {
    let out = spots;
    if (statusFilter !== "tous") out = out.filter((s) => s.status === statusFilter);
    if (catFilter !== "toutes") out = out.filter((s) => s.category === catFilter);
    return out;
  }, [statusFilter, catFilter]);

  const total = spots.length;
  const approved = spots.filter((s) => s.status === "approved").length;
  const pending = spots.filter((s) => s.status === "pending").length;
  const avgRating = (spots.reduce((a, s) => a + s.rating, 0) / spots.length).toFixed(1);

  const columns: Column<PhotoSpot>[] = [
    {
      key: "name",
      header: "Spot",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[4px] bg-cover bg-center border border-ink/20 shrink-0"
            style={{ backgroundImage: `url(${row.hero})` }}
          />
          <div>
            <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px] leading-tight">
              {row.name}
            </div>
            <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
              {row.country} {row.city}
            </div>
          </div>
        </div>
      ),
      sortValue: (row) => row.name,
    },
    {
      key: "category",
      header: "Catégorie",
      cell: (row) => (
        <Badge tone={CAT_TONE[row.category]}>{CAT_LABEL[row.category]}</Badge>
      ),
      sortValue: (row) => row.category,
    },
    {
      key: "rating",
      header: "Note",
      align: "right",
      cell: (row) => (
        <span className="flex items-center justify-end gap-1 font-[family-name:var(--font-serif)] font-bold text-gold-deep">
          <Star size={12} fill="currentColor" />
          {row.rating.toFixed(1)}
        </span>
      ),
      sortValue: (row) => row.rating,
    },
    {
      key: "reviews",
      header: "Avis",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {fmtNum(row.reviews)}
        </span>
      ),
      sortValue: (row) => row.reviews,
    },
    {
      key: "visits",
      header: "Visites",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-bold text-[13px]">
          {fmtNum(row.visits)}
        </span>
      ),
      sortValue: (row) => row.visits,
    },
    {
      key: "bestTime",
      header: "Meilleure heure",
      cell: (row) => (
        <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[13px]">
          <Clock size={12} className="text-gold-deep" />
          {row.bestTime}
        </span>
      ),
      sortValue: (row) => row.bestTime,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status]} dot>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "addedBy",
      header: "Ajouté par",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.addedBy.avatar} size={28} />
          <span className="font-[family-name:var(--font-serif)] text-[12px] truncate max-w-[100px]">
            {row.addedBy.firstName} {row.addedBy.lastName}
          </span>
        </div>
      ),
      sortValue: (row) => `${row.addedBy.firstName} ${row.addedBy.lastName}`,
    },
  ];

  const statusChips: { key: StatusFilter; label: string; color: "ink" | "red" | "green" | "gold" }[] = [
    { key: "tous", label: "Tous", color: "ink" },
    { key: "approved", label: "Validés", color: "green" },
    { key: "pending", label: "En attente", color: "gold" },
    { key: "rejected", label: "Rejetés", color: "red" },
  ];

  const catChips: { key: CategoryFilter; label: string; color: "ink" | "gold" | "blue" | "green" | "red" }[] = [
    { key: "toutes", label: "Toutes", color: "ink" },
    { key: "coucher", label: "Coucher", color: "gold" },
    { key: "lever", label: "Lever", color: "blue" },
    { key: "portrait", label: "Portrait", color: "green" },
    { key: "archi", label: "Architecture", color: "red" },
  ];

  return (
    <AdminPage
      title="Spots photo"
      eyebrow="les meilleurs endroits"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Spots" }]}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/spots/pending">
            <Button variant="paper" size="sm" icon={<Clock size={14} />}>
              File d'attente ({pending})
            </Button>
          </Link>
          <Link href="/admin/spots/new">
            <Button variant="gold" size="sm" icon={<Plus size={14} />}>
              Nouveau spot
            </Button>
          </Link>
        </div>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Spots total"
          value={fmtNum(total)}
          tone="ink"
          icon={<MapPin size={18} />}
        />
        <StatCard
          label="Validés"
          value={fmtNum(approved)}
          delta="+6,2 %"
          tone="green"
          icon={<Eye size={18} />}
        />
        <StatCard
          label="En attente"
          value={fmtNum(pending)}
          tone="gold"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Note moyenne"
          value={avgRating}
          tone="gold"
          icon={<Star size={18} />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Statut :
        </span>
        {statusChips.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? f.color : "ink"}
            variant={statusFilter === f.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Catégorie :
        </span>
        {catChips.map((f) => (
          <Chip
            key={f.key}
            color={catFilter === f.key ? f.color : "ink"}
            variant={catFilter === f.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setCatFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <DataTable<PhotoSpot>
        columns={columns}
        rows={filtered as PhotoSpot[] & Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/spots/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par nom, ville…"
        pageSize={10}
        empty="Aucun spot ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
