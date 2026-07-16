import { getClients, saveClients, isRemotePortalStorage } from "./storage";
import { migrateClient, type ClientAccount } from "./types";
import { migratePaymentRecord } from "./invoices";
import { syncClientBilling } from "./billing";
import { ensureDemoAccounts } from "./demo-seed";

export function getAllClients(): ClientAccount[] {
  if (!isRemotePortalStorage()) {
    ensureDemoAccounts();
  }
  const clients = getClients()
    .map((c) => migrateClient(c as ClientAccount))
    .map((c) => syncClientBilling(c))
    .map((c) => ({
      ...c,
      payments: c.payments.map((p) => migratePaymentRecord(p, c)),
    }));
  saveClients(clients);
  return clients;
}

export function refreshClientStore(): ClientAccount[] {
  return getAllClients();
}
