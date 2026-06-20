import { AdminPage } from "@/components/admin/AdminPage";
import { AdminQueryState } from "@/components/admin/QueryState";
import { Avatar, Badge, PaperCard } from "@/components/ui";
import { getStaffSession, type StaffRole } from "@/lib/admin/auth";
import { getStaffRoster, getUserDetailReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<StaffRole, string> = {
  moderator: "Modérateur",
  admin: "Administrateur",
  super_admin: "Super administrateur",
};

const ROLE_TONE: Record<StaffRole, "neutral" | "gold" | "red"> = {
  moderator: "neutral",
  admin: "gold",
  super_admin: "red",
};

export default async function ProfilePage() {
  const session = await getStaffSession();

  if (session.kind !== "staff") {
    return (
      <AdminQueryState
        title="Mon profil"
        eyebrow="compte staff"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Profil" }]}
        message={session.kind === "unauthenticated" ? "Session expirée — reconnecte-toi." : "Accès réservé au staff."}
      />
    );
  }

  const [detailResult, rosterResult] = await Promise.all([
    getUserDetailReadModel(session.userId),
    getStaffRoster(),
  ]);

  const detail = detailResult.kind === "ok" ? detailResult.data : null;
  const roster = rosterResult.kind === "ok" ? rosterResult.data : [];
  const name = detail ? [detail.firstName, detail.lastName].filter(Boolean).join(" ").trim() || detail.username : (session.email ?? "Staff");

  return (
    <AdminPage title="Mon profil" eyebrow="compte staff" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Profil" }]}>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Identity */}
        <PaperCard shadow="gold" className="p-6 flex items-center gap-4">
          <Avatar src={detail?.avatarUrl ?? undefined} size={64} ring />
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-serif)] font-bold text-xl">{name}</p>
            {session.email && <p className="font-[family-name:var(--font-hand)] text-base text-ink-faded">{session.email}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {session.roles.map((r) => (
                <Badge key={r} tone={ROLE_TONE[r]} dot>{ROLE_LABEL[r]}</Badge>
              ))}
            </div>
          </div>
        </PaperCard>

        {/* Staff roster */}
        <PaperCard shadow="ink" className="p-5">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Équipe ({roster.length})</h2>
          {roster.length === 0 ? (
            <p className="font-[family-name:var(--font-hand)] text-ink-faded py-4 text-center">Aucun autre membre du staff.</p>
          ) : (
            <ul className="divide-y divide-[var(--ink-line)]">
              {roster.map((m) => {
                const mName = m.profile ? [m.profile.firstName, m.profile.lastName].filter(Boolean).join(" ").trim() || m.profile.username : m.userId;
                return (
                  <li key={`${m.userId}-${m.role}`} className="py-3 flex items-center gap-3">
                    <Avatar src={m.profile?.avatarUrl ?? undefined} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-serif)] font-semibold">{mName}</div>
                      {m.profile?.username && <div className="font-[family-name:var(--font-hand)] text-[15px] text-ink-faded">{m.profile.username}</div>}
                    </div>
                    <Badge tone={ROLE_TONE[m.role]} dot>{ROLE_LABEL[m.role]}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </PaperCard>

        <p className="text-center font-[family-name:var(--font-serif)] italic text-[12px] text-ink-faded">
          Identifiants et sessions sont gérés via Supabase Auth.
        </p>
      </div>
    </AdminPage>
  );
}
