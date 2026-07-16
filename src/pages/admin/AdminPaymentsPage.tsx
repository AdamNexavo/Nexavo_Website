import { getClients, upsertClient } from "@/lib/portal/storage";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceStatCard,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { markInvoicePaid } from "@/lib/portal/invoices";
import { applyClientPaymentReceived } from "@/lib/portal/helpers";
import {
  computeAdminDashboardStats,
  formatEuro,
  parseEuroAmount,
  getPaymentWithClient,
} from "@/lib/portal/admin-stats";

export default function AdminPaymentsPage() {
  const clients = getClients();
  const allPayments = getPaymentWithClient(clients);
  const stats = computeAdminDashboardStats(clients);
  const { toast } = useToast();

  const markPaid = (clientId: string, paymentId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const payments = client.payments.map((p) =>
      p.id === paymentId ? markInvoicePaid(p, client) : p,
    );
    upsertClient(applyClientPaymentReceived({ ...client, payments }));
    toast({ title: "Betaling gemarkeerd als betaald" });
    window.location.reload();
  };

  const pending = allPayments.filter((p) => p.status !== "paid");
  const paid = allPayments.filter((p) => p.status === "paid");
  const overdue = pending.filter(
    (p) => p.status === "overdue" || new Date(p.dueDate) < new Date(),
  );
  const totalPaid = paid.reduce((sum, p) => sum + parseEuroAmount(p.amount), 0);

  return (
    <div>
      <ReferencePageTitle
        title="Betalingen"
        subtitle="Factuurstatus, omzet en openstaande betalingen."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Omzet (betaald)" value={formatEuro(totalPaid)} trend="up" />
        <ReferenceStatCard label="Openstaand" value={formatEuro(stats.totalOpen)} sub={`${pending.length} facturen`} />
        <ReferenceStatCard label="Achterstallig" value={formatEuro(stats.totalOverdue)} sub={`${overdue.length} facturen`} trend={overdue.length > 0 ? "down" : "neutral"} />
        <ReferenceStatCard label="MRR onderhoud" value={formatEuro(stats.monthlyMaintenance)} sub="Recurring revenue" />
      </div>

      <ReferenceCard className="mb-5">
        <h3 className="mb-4 text-[15px] font-semibold text-[#EF4444]">
          Achterstallig ({overdue.length})
        </h3>
        {overdue.length === 0 ? (
          <p className="text-[13px] text-[#6B7280]">Geen achterstallige betalingen.</p>
        ) : (
          <div className="space-y-3">
            {overdue.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#FEE2E2] bg-[#FEF2F2] p-4">
                <div>
                  <Link to={`/admin/klanten/${p.clientId}`} className="font-medium text-[#7547F8] hover:underline">
                    {p.clientName}
                  </Link>
                  <p className="text-[13px] text-[#6B7280]">{p.description}</p>
                  <p className="text-[12px] text-[#EF4444]">
                    Vervallen {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-semibold text-[#EF4444]">{p.amount}</span>
                  <Button variant="outline" size="sm" onClick={() => markPaid(p.clientId, p.id)}>
                    Markeer betaald
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ReferenceCard>

      <ReferenceCard className="mb-5">
        <h3 className="mb-4 text-[15px] font-semibold">Openstaand ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-[13px] text-[#6B7280]">Geen openstaande betalingen.</p>
        ) : (
          <div className="space-y-3">
            {pending
              .filter((p) => !overdue.some((o) => o.id === p.id))
              .map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block p-4">
                  <div>
                    <Link to={`/admin/klanten/${p.clientId}`} className="font-medium text-[#7547F8] hover:underline">
                      {p.clientName}
                    </Link>
                    <p className="text-[13px] text-[#6B7280]">{p.description}</p>
                    <p className="text-[12px] text-[#9CA3AF]">
                      Vervaldatum: {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] font-semibold">{p.amount}</span>
                    <ReferenceBadge variant="purple">Open</ReferenceBadge>
                    <Button variant="outline" size="sm" onClick={() => markPaid(p.clientId, p.id)}>
                      Markeer betaald
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </ReferenceCard>

      <ReferenceCard>
        <h3 className="mb-4 text-[15px] font-semibold">Betaald ({paid.length})</h3>
        {paid.length === 0 ? (
          <p className="text-[13px] text-[#6B7280]">Nog geen betaalde facturen.</p>
        ) : (
          <div className="space-y-2">
            {paid.map((p) => (
              <div key={p.id} className="flex flex-wrap justify-between gap-2 rounded-[12px] border border-[#E2E0DB] px-4 py-3 text-[14px]">
                <span>
                  <Link to={`/admin/klanten/${p.clientId}`} className="font-medium text-[#111111] hover:text-[#7547F8]">
                    {p.clientName}
                  </Link>
                  {" — "}
                  {p.description}
                </span>
                <span className="font-semibold text-[#10B981]">{p.amount}</span>
              </div>
            ))}
          </div>
        )}
      </ReferenceCard>
    </div>
  );
}
