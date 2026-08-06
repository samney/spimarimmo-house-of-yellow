import { requirePermission } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";

export const dynamic = "force-dynamic";

/* Notifications (ADM-036).

   No notification source is connected: delivery runs through `integration_jobs`
   and no provider is wired (blocker P-2). An empty state that says so is the
   honest render; a list of sample alerts would be a fabricated system state. */
export default async function NotificationsScreen() {
  const { denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Notifications" }]}
        title="Notifications"
        lede="Alertes opérationnelles : échecs de livraison, tâches en retard et publications planifiées."
      />

      <EmptyState
        title="Aucune notification"
        body="Aucune source de notification n’est connectée sur ce déploiement. La livraison passe par la file integration_jobs et aucun fournisseur n’est raccordé (blocage P-2)."
      />
    </>
  );
}
