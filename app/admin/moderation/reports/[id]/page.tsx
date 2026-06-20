import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { ReportDetailClient } from "@/components/admin/moderation/ReportDetailClient";
import { getReportDetailReadModel } from "@/lib/admin/moderation";
import { getUserDetailReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reportId = Number(id);
  const result = await getReportDetailReadModel(reportId);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Signalement"
        eyebrow="examen du signalement"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/moderation", label: "Modération" },
          { href: "/admin/moderation/reports", label: "Signalements" },
          { label: "Détail" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  const report = result.data;
  const targetResult = report.reportedUserId
    ? await getUserDetailReadModel(report.reportedUserId)
    : null;
  const target = targetResult && targetResult.kind === "ok" ? targetResult.data : null;

  return <ReportDetailClient report={report} target={target} />;
}
