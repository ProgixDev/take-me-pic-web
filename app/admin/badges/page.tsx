"use client";

import { useState } from "react";
import { Plus, Pencil, Award, Users } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  Stamp,
  Chip,
  useToast,
} from "@/components/ui";
import { badges, fmtNum, type Badge as BadgeType } from "@/lib/data";

type Rarity = BadgeType["rarity"];

function rarityTone(r: Rarity): "green" | "blue" | "gold" {
  if (r === "légendaire") return "gold";
  if (r === "rare") return "blue";
  return "green";
}

interface BadgeForm {
  name: string;
  emoji: string;
  description: string;
  rarity: Rarity;
}

const EMPTY_FORM: BadgeForm = {
  name: "",
  emoji: "🏅",
  description: "",
  rarity: "commun",
};

export default function BadgesPage() {
  const { push } = useToast();
  const [localBadges, setLocalBadges] = useState<BadgeType[]>(badges);
  const [createOpen, setCreateOpen] = useState(false);
  const [editBadge, setEditBadge] = useState<BadgeType | null>(null);
  const [form, setForm] = useState<BadgeForm>(EMPTY_FORM);
  const [filterRarity, setFilterRarity] = useState<"tous" | Rarity>("tous");

  function openCreate() {
    setForm(EMPTY_FORM);
    setCreateOpen(true);
  }

  function openEdit(badge: BadgeType) {
    setEditBadge(badge);
    setForm({
      name: badge.name,
      emoji: badge.emoji,
      description: badge.description,
      rarity: badge.rarity,
    });
  }

  function handleCreate() {
    if (!form.name.trim()) {
      push("Le nom du badge est obligatoire.", "err");
      return;
    }
    const newBadge: BadgeType = {
      id: `b${localBadges.length + 1}`,
      name: form.name,
      emoji: form.emoji,
      description: form.description,
      rarity: form.rarity,
      holders: 0,
    };
    setLocalBadges((prev) => [...prev, newBadge]);
    push(`Badge "${form.name}" créé avec succès.`, "ok");
    setCreateOpen(false);
  }

  function handleEdit() {
    if (!editBadge) return;
    setLocalBadges((prev) =>
      prev.map((b) =>
        b.id === editBadge.id
          ? { ...b, ...form }
          : b
      )
    );
    push(`Badge "${form.name}" mis à jour.`, "ok");
    setEditBadge(null);
  }

  const filteredBadges = localBadges.filter(
    (b) => filterRarity === "tous" || b.rarity === filterRarity
  );

  const totalHolders = localBadges.reduce((s, b) => s + b.holders, 0);

  return (
    <AdminPage
      title="Gestion des badges"
      eyebrow="récompenses & distinctions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Badges" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={openCreate}>
          Créer un badge
        </Button>
      }
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total badges
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">
            {localBadges.length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Porteurs cumulés
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {fmtNum(totalHolders)}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Badges rares
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-blue">
            {localBadges.filter((b) => b.rarity === "rare").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm relative overflow-hidden">
          <Stamp color="gold" size={52} fontSize={7} rotate={8} className="absolute -right-1 top-0">
            {`RARE\n★`}
          </Stamp>
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Légendaires
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {localBadges.filter((b) => b.rarity === "légendaire").length}
          </div>
        </div>
      </div>

      {/* Rarity filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["tous", "commun", "rare", "légendaire"] as const).map((r) => (
          <Chip
            key={r}
            color={
              r === "légendaire"
                ? "gold"
                : r === "rare"
                ? "blue"
                : r === "commun"
                ? "green"
                : "ink"
            }
            variant={filterRarity === r ? "filled" : "outline"}
            size="sm"
            onClick={() => setFilterRarity(r)}
          >
            {r === "tous" ? "Tous" : r}
          </Chip>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <PaperCard key={badge.id} shadow="soft" className="p-5 relative group">
            {/* Edit button */}
            <button
              onClick={() => openEdit(badge)}
              className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-paper-2 border border-[var(--ink-line)] hover:bg-paper-warm cursor-pointer"
            >
              <Pencil size={12} />
            </button>

            <div className="text-4xl mb-3 text-center">{badge.emoji}</div>

            <div className="text-center mb-3">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1">
                {badge.name}
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded leading-snug">
                {badge.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-dashed border-[var(--ink-line)]">
              <Badge tone={rarityTone(badge.rarity)} className="text-[10px]">
                {badge.rarity}
              </Badge>
              <div className="flex items-center gap-1 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                <Users size={11} />
                {fmtNum(badge.holders)}
              </div>
            </div>
          </PaperCard>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-14 font-[family-name:var(--font-hand)] text-xl text-ink-faded">
          Aucun badge dans cette catégorie.
        </div>
      )}

      {/* Create Badge Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Créer un nouveau badge"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<Award size={14} />} onClick={handleCreate}>
              Créer le badge
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20">
              <Input
                label="Emoji"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                className="text-center text-2xl"
              />
            </div>
            <div className="flex-1">
              <Input
                label="Nom du badge"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex : Explorateur de l'aube"
              />
            </div>
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            placeholder="Condition pour obtenir ce badge…"
          />
          <Select
            label="Rareté"
            value={form.rarity}
            onChange={(e) =>
              setForm((f) => ({ ...f, rarity: e.target.value as Rarity }))
            }
          >
            <option value="commun">Commun</option>
            <option value="rare">Rare</option>
            <option value="légendaire">Légendaire</option>
          </Select>

          {/* Preview */}
          {form.name && (
            <div className="bg-paper-warm border border-dashed border-[var(--ink-line)] rounded-[4px] p-4 text-center">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-2">
                Aperçu
              </div>
              <div className="text-3xl mb-1">{form.emoji}</div>
              <div className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                {form.name}
              </div>
              {form.description && (
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-1">
                  {form.description}
                </p>
              )}
              <div className="mt-2">
                <Badge tone={rarityTone(form.rarity)} className="text-[10px]">
                  {form.rarity}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Badge Modal */}
      <Modal
        open={!!editBadge}
        onClose={() => setEditBadge(null)}
        title={`Modifier : ${editBadge?.name ?? ""}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditBadge(null)}>
              Annuler
            </Button>
            <Button variant="ink" size="sm" icon={<Pencil size={14} />} onClick={handleEdit}>
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20">
              <Input
                label="Emoji"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                className="text-center text-2xl"
              />
            </div>
            <div className="flex-1">
              <Input
                label="Nom du badge"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <Select
            label="Rareté"
            value={form.rarity}
            onChange={(e) =>
              setForm((f) => ({ ...f, rarity: e.target.value as Rarity }))
            }
          >
            <option value="commun">Commun</option>
            <option value="rare">Rare</option>
            <option value="légendaire">Légendaire</option>
          </Select>
        </div>
      </Modal>
    </AdminPage>
  );
}
