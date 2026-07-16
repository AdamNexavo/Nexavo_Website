/** Internal app routes — always use these instead of absolute URLs for in-app navigation. */
export const ROUTES = {
  home: "/",
  contact: "/contact",
  pricing: "/pricing",
  pakketten: "/pakketten",
  diensten: "/diensten",
  projecten: "/projecten",
  integraties: "/integraties",
  kennisbank: "/kennisbank",
  privacy: "/privacy",
  voorwaarden: "/voorwaarden",
  portal: {
    login: "/portal/login",
    register: "/portal/register",
    dashboard: "/portal",
    website: "/portal/website",
    koppelingen: "/portal/koppelingen",
    facturatie: "/portal/facturatie",
    betaling: "/portal/betaling",
    klantenservice: "/portal/klantenservice",
    profiel: "/portal/profiel",
    pakketten: "/portal/pakketten",
    taken: "/portal/taken",
    boekingskalender: "/portal/boekingskalender",
    reviews: "/portal/reviews",
  },
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    klanten: "/admin/klanten",
    uitnodigingen: "/admin/uitnodigingen",
    aanvragen: "/admin/aanvragen",
    tickets: "/admin/tickets",
    betalingen: "/admin/betalingen",
    mail: "/admin/mail",
  },
} as const;

export function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}
