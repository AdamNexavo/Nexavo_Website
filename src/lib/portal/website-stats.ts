import type { ClientAccount } from "./types";
import { isClientLive } from "./helpers";

export const DEMO_VISITOR_WEEK = [
  { day: "Ma", bezoekers: 32 },
  { day: "Di", bezoekers: 41 },
  { day: "Wo", bezoekers: 38 },
  { day: "Do", bezoekers: 52 },
  { day: "Vr", bezoekers: 48 },
  { day: "Za", bezoekers: 29 },
  { day: "Zo", bezoekers: 35 },
];

export const DEMO_PAGE_VIEWS = [
  { page: "Home", views: 420 },
  { page: "Diensten", views: 280 },
  { page: "Contact", views: 190 },
  { page: "Over ons", views: 120 },
];

export const DEMO_CONVERSION_ROWS = [
  { label: "Formulier ingevuld", pct: 68, color: "bg-[#7547F8]" },
  { label: "Telefoon geklikt", pct: 24, color: "bg-[#A78BFA]" },
  { label: "E-mail geklikt", pct: 18, color: "bg-[#C4B5FD]" },
];

export type WebsiteStatCard = {
  label: string;
  value: string;
  sub: string;
};

export function getWebsiteStatCards(_client: ClientAccount): WebsiteStatCard[] {
  return [
    { label: "Bezoekers", value: "248", sub: "Deze maand" },
    { label: "Paginaweergaven", value: "612", sub: "Deze maand" },
    { label: "Nieuwe reviews", value: "7", sub: "Deze maand" },
    { label: "Conversie", value: "4,2%", sub: "Formulier → lead" },
    { label: "Gem. sessieduur", value: "1:42", sub: "Minuten" },
  ];
}

export function isWebsiteStatsUnlocked(client: ClientAccount): boolean {
  return isClientLive(client);
}

export function getWeeklyVisitorTotal(): number {
  return DEMO_VISITOR_WEEK.reduce((sum, d) => sum + d.bezoekers, 0);
}
