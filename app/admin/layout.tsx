import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { getStaffSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staffSession = await getStaffSession();

  if (staffSession.kind !== "staff") {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
