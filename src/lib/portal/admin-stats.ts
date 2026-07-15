import type { ClientAccount, PaymentRecord } from "./types";
import { getClientReferenceNumber, isClientLive, hasPendingPackage } from "./helpers";

export function parseEuroAmount(amount: string): number {
  const num = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
  return Number.isNaN(num) ? 0 : num;
}

export function formatEuro(amount: number): string {
  return `€${amount.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export type ClientCrmStatus = "onboarding" | "intake" | "build" | "live" | "overdue";

export function getClientCrmStatus(client: ClientAccount): ClientCrmStatus {
  const hasOverdue = client.payments.some(
    (p) => p.status === "overdue" || (p.status === "pending" && new Date(p.dueDate) < new Date()),
  );
  if (hasOverdue) return "overdue";
  if (isClientLive(client)) return "live";
  if (client.onboarding.completed) return "build";
  if (client.onboarding.termsAccepted || client.progress.percent > 0) return "intake";
  return "onboarding";
}

export const CRM_STATUS_LABELS: Record<ClientCrmStatus, string> = {
  onboarding: "Onboarding",
  intake: "Intake bezig",
  build: "In bouw",
  live: "Live",
  overdue: "Achterstallig",
};

export function computeAdminDashboardStats(clients: ClientAccount[]) {
  const allPayments = clients.flatMap((c) =>
    c.payments.map((p) => ({ ...p, clientId: c.id, clientName: c.companyName })),
  );
  const openTickets = clients.flatMap((c) =>
    c.tickets.filter((t) => t.status !== "done" && t.status !== "out_of_scope"),
  );
  const pendingPayments = allPayments.filter((p) => p.status !== "paid");
  const overduePayments = pendingPayments.filter(
    (p) => p.status === "overdue" || new Date(p.dueDate) < new Date(),
  );
  const paidPayments = allPayments.filter((p) => p.status === "paid");
  const completedIntakes = clients.filter((c) => c.onboarding.completed);
  const inBuild = clients.filter((c) => !isClientLive(c) && c.onboarding.completed);
  const liveClients = clients.filter((c) => isClientLive(c));

  const totalRevenue = paidPayments.reduce((sum, p) => sum + parseEuroAmount(p.amount), 0);
  const totalOpen = pendingPayments.reduce((sum, p) => sum + parseEuroAmount(p.amount), 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + parseEuroAmount(p.amount), 0);

  const monthlyMaintenance = clients.reduce((sum, c) => {
    if (hasPendingPackage(c) || !c.package.monthlyPrice || c.package.monthlyPrice === "—") return sum;
    return sum + parseEuroAmount(c.package.monthlyPrice);
  }, 0);

  const upcomingPayments = [...pendingPayments]
    .filter((p) => new Date(p.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return {
    clientCount: clients.length,
    completedIntakes: completedIntakes.length,
    openTickets: openTickets.length,
    pendingPayments: pendingPayments.length,
    overduePayments: overduePayments.length,
    totalRevenue,
    totalOpen,
    totalOverdue,
    monthlyMaintenance,
    inBuild: inBuild.length,
    liveClients: liveClients.length,
    upcomingPayments,
    overdueList: overduePayments.slice(0, 5),
  };
}

export function getPaymentWithClient(clients: ClientAccount[]) {
  return clients.flatMap((c) =>
    c.payments.map((p) => ({
      ...p,
      clientId: c.id,
      clientName: c.companyName,
      clientRef: getClientReferenceNumber(c),
    })),
  );
}

export function getTicketStats(clients: ClientAccount[]) {
  const all = clients.flatMap((c) => c.tickets);
  return {
    total: all.length,
    open: all.filter((t) => t.status !== "done" && t.status !== "out_of_scope").length,
    inProgress: all.filter((t) => t.status === "in_progress").length,
    done: all.filter((t) => t.status === "done").length,
    high: all.filter((t) => t.priority === "high").length,
  };
}

export function getApplicationStats(clients: ClientAccount[]) {
  const completed = clients.filter((c) => c.onboarding.completed);
  const thisMonth = completed.filter((c) => {
    if (!c.onboarding.submittedAt) return false;
    const d = new Date(c.onboarding.submittedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const paid = completed.filter((c) => c.payments.some((p) => p.status === "paid"));
  return {
    total: completed.length,
    thisMonth: thisMonth.length,
    awaitingPayment: completed.filter((c) => !c.payments.some((p) => p.status === "paid")).length,
    paid: paid.length,
  };
}

export function sortPaymentsByDue(payments: (PaymentRecord & { clientName?: string })[]) {
  return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
