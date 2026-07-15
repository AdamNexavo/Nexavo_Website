import { Link } from "react-router-dom";
import { Globe, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getAllClients } from "@/lib/portal/store";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceStatCard,
} from "@/components/portal/reference/ReferenceUI";
import { Input } from "@/components/ui/input";
import { getClientReferenceNumber } from "@/lib/portal/helpers";
import { getAllClientWebsites } from "@/lib/portal/websites";
import { cn } from "@/lib/utils";

const STATUS_LABELS = {
  draft: "Concept",
  preview: "Preview",
  live: "Live",
  archived: "Gearchiveerd",
} as const;

const STATUS_VARIANT = {
  draft: "default" as const,
  preview: "purple" as const,
  live: "green" as const,
  archived: "default" as const,
};

export default function AdminWebsitesPage() {
  const clients = getAllClients();
  const [search, setSearch] = useState("");

  const allSites = useMemo(
    () => getAllClientWebsites(clients, getClientReferenceNumber),
    [clients],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return allSites;
    const q = search.toLowerCase();
    return allSites.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.clientRef.toLowerCase().includes(q) ||
        s.url?.toLowerCase().includes(q) ||
        s.previewUrl?.toLowerCase().includes(q),
    );
  }, [allSites, search]);

  const liveCount = allSites.filter((s) => s.status === "live").length;
  const previewCount = allSites.filter((s) => s.status === "preview").length;

  return (
    <div>
      <ReferencePageTitle
        title="Websites"
        subtitle="Alle websites gekoppeld aan klanten — klik door naar statistieken en technische gegevens."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <ReferenceStatCard label="Totaal websites" value={String(allSites.length)} />
        <ReferenceStatCard label="Live" value={String(liveCount)} sub="Actief online" />
        <ReferenceStatCard label="In preview" value={String(previewCount)} sub="Bouwfase" />
      </div>

      <ReferenceCard className="mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op website, klant of domein..."
            className="rounded-full pl-10 bg-white"
          />
        </div>
      </ReferenceCard>

      {filtered.length === 0 ? (
        <ReferenceCard>
          <p className="text-[14px] text-[#6B7280]">
            Geen websites gevonden. Websites verschijnen zodra een klant een domein of URL heeft.
          </p>
        </ReferenceCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((site) => {
            const href = site.url?.startsWith("http") ? site.url : site.url ? `https://${site.url}` : site.previewUrl;
            return (
              <ReferenceCard
                key={`${site.clientId}-${site.id}`}
                className="transition-colors hover:border-[#7547F8]/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7547F8]">
                      <Globe className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#111111]">{site.name}</p>
                        {site.isPrimary && (
                          <span className="text-[10px] font-medium uppercase text-[#9CA3AF]">Primair</span>
                        )}
                        <ReferenceBadge variant={STATUS_VARIANT[site.status]}>
                          {STATUS_LABELS[site.status]}
                        </ReferenceBadge>
                      </div>
                      <Link
                        to={`/admin/klanten/${site.clientId}?tab=website`}
                        className="text-[13px] font-medium text-[#7547F8] hover:underline"
                      >
                        {site.clientName} · {site.clientRef}
                      </Link>
                      <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">
                        {site.url?.replace(/^https?:\/\//, "") ??
                          site.previewUrl?.replace(/^https?:\/\//, "") ??
                          "Nog geen URL"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {href && (
                      <a
                        href={href.startsWith("http") ? href : `https://${href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5",
                          "text-[12px] font-medium text-[#111111] hover:border-[#7547F8]/30",
                        )}
                      >
                        Open website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Link
                      to={`/admin/klanten/${site.clientId}?tab=website&site=${site.id}`}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full bg-[#7547F8] px-3 py-1.5",
                        "text-[12px] font-medium text-white hover:bg-[#6840E0]",
                      )}
                    >
                      Statistieken & details
                    </Link>
                  </div>
                </div>
              </ReferenceCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
