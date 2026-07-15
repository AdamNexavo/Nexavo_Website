import { getClients, saveClients } from "./storage";
import { migrateClient, type ClientAccount } from "./types";

export function getAllClients(): ClientAccount[] {
  const clients = getClients().map((c) => migrateClient(c as ClientAccount));
  saveClients(clients);
  return clients;
}

export function refreshClientStore(): ClientAccount[] {
  return getAllClients();
}
