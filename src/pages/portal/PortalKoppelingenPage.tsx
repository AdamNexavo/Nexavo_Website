import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  ReferencePageTitle,
  ReferenceModal,
  ReferenceCard,
} from "@/components/portal/reference/ReferenceUI";
import {
  integrations,
  integrationCategories,
  getIntegrationsByCategory,
  getCategoryLabel,
  type IntegrationCategoryId,
} from "@/data/integrations";
import { getIntegrationStatus } from "@/lib/portal/helpers";
import { getClientActiveIntegrations, getClientPendingIntegrations } from "@/lib/portal/integration-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertClient } from "@/lib/portal/storage";
import { useToast } from "@/hooks/use-toast";
import type { IntegrationRequest } from "@/lib/portal/types";
import type { ClientAccount } from "@/lib/portal/types";
import { PortalIntegrationAppCard } from "@/components/portal/PortalIntegrationAppCard";

type SortOption = "name-asc" | "name-desc" | "status";

export default function PortalKoppelingenPage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<IntegrationCategoryId>("agenda");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [requestName, setRequestName] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [useCase, setUseCase] = useState("");

  const categoryIntegrations = useMemo(() => {
    if (!client) return [];
    let list = getIntegrationsByCategory(activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.cardDescription.toLowerCase().includes(q),
      );
    }
    return sortIntegrations(list, sort, client);
  }, [activeCategory, search, sort, client]);

  const allFiltered = useMemo(() => {
    if (!client) return [];
    let list = integrations;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.cardDescription.toLowerCase().includes(q) ||
          getCategoryLabel(i.category).toLowerCase().includes(q),
      );
    }
    return sortIntegrations(list, sort, client);
  }, [search, sort, client]);

  if (!client) return null;

  const activeIntegrations = getClientActiveIntegrations(client);
  const pendingIntegrations = getClientPendingIntegrations(client);

  const submitRequest = () => {
    if (!requestName) return;
    const integrationStatuses = { ...client.integrationStatuses, [requestName]: "requested" as const };
    const integrationsList = client.onboarding.integrations.includes(requestName)
      ? client.onboarding.integrations
      : [...client.onboarding.integrations, requestName];
    const entry = integrations.find((i) => i.name === requestName);
    const request: IntegrationRequest = {
      integrationId: entry?.slug ?? requestName,
      name: requestName,
      note: useCase + (note ? `\n${note}` : ""),
      requestedAt: new Date().toISOString(),
    };
    upsertClient({
      ...client,
      onboarding: { ...client.onboarding, integrations: integrationsList },
      integrationStatuses,
      integrationRequests: [...(client.integrationRequests ?? []).filter((r) => r.name !== requestName), request],
    });
    refreshClient();
    setRequestName(null);
    setNote("");
    setUseCase("");
    toast({ title: "Aanvraag verstuurd", description: `We nemen contact op over ${requestName}.` });
  };

  return (
    <div>
      <ReferencePageTitle title="Koppelingen" subtitle="Koppel tools aan je website — zelfde catalogus als op nexavo.works." />

      <ReferenceCard className="mb-6">
        <h2 className="text-[15px] font-semibold text-[#111111]">Mijn koppelingen</h2>
        <p className="mt-0.5 text-[13px] text-[#6B7280]">
          Alleen goedgekeurde en actieve koppelingen verschijnen hier.
        </p>

        {activeIntegrations.length === 0 ? (
          <div className="mt-4 rounded-[14px] border border-dashed border-[#E2E0DB] bg-[#FAFAF8] px-4 py-6 text-center">
            <p className="text-[14px] font-medium text-[#111111]">Je hebt nog geen actieve koppelingen</p>
            <p className="mt-1 text-[13px] text-[#6B7280]">
              Bekijk ons aanbod hieronder en vraag een koppeling aan. Na goedkeuring door Nexavo verschijnt deze hier.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeIntegrations.map((item) => (
              <PortalIntegrationAppCard
                key={`mine-${item.slug}`}
                integration={item}
                compact
                status="active"
              />
            ))}
          </div>
        )}

        {pendingIntegrations.length > 0 && (
          <div className="mt-5 border-t border-[#E2E0DB] pt-4">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">In behandeling</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingIntegrations.map((item) => (
                <PortalIntegrationAppCard
                  key={`pending-${item.slug}`}
                  integration={item}
                  compact
                  status={getIntegrationStatus(client, item.name)}
                />
              ))}
            </div>
          </div>
        )}
      </ReferenceCard>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoeken..."
            className="h-9 rounded-full border-[#E2E0DB] bg-white pl-10 text-[13px]"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-9 appearance-none rounded-full border border-[#E2E0DB] bg-white py-2 pl-4 pr-10 text-[13px] font-medium"
          >
            <option value="name-asc">Naam A-Z</option>
            <option value="name-desc">Naam Z-A</option>
            <option value="status">Status</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside className="lg:w-52 shrink-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Categorieën
          </p>
          <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
            {integrationCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
                  activeCategory === category.id
                    ? "bg-[#F5F5F5] text-[#111111]"
                    : "text-[#6B7280] hover:bg-[#FAFAF8] hover:text-[#111111]",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            {getCategoryLabel(activeCategory)}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryIntegrations.map((item) => (
              <PortalIntegrationAppCard
                key={item.slug}
                integration={item}
                status={getIntegrationStatus(client, item.name)}
                onConnect={() => setRequestName(item.name)}
              />
            ))}
          </div>
          {categoryIntegrations.length === 0 && (
            <p className="py-8 text-center text-[13px] text-[#6B7280]">Geen koppelingen in deze categorie.</p>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-[#E2E0DB] pt-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
          Alle koppelingen
        </p>
        <h2 className="mb-5 text-[18px] font-semibold tracking-[-0.03em] text-[#111111]">
          Scroll door alle beschikbare tools
        </h2>
        <div className="relative rounded-[1.25rem] border border-[#E2E0DB] bg-white p-3 shadow-sm">
          <div className="max-h-[480px] overflow-y-auto pr-2 [scrollbar-width:thin]">
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
              {allFiltered.map((item) => (
                <PortalIntegrationAppCard
                  key={`all-${item.slug}`}
                  integration={item}
                  compact
                  status={getIntegrationStatus(client, item.name)}
                  onConnect={() => setRequestName(item.name)}
                />
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-x-3 bottom-3 h-14 rounded-b-[1rem] bg-gradient-to-t from-white to-transparent"
            aria-hidden
          />
        </div>
        <p className="mt-6 max-w-xl text-[13px] text-[#6B7280]">
          Staat jouw tool er niet tussen? Via Maatwerk koppelen we ook andere koppelingen op aanvraag.
        </p>
      </div>

      <ReferenceModal
        open={!!requestName}
        onOpenChange={(o) => !o && setRequestName(null)}
        title={`${requestName ?? ""} koppelen`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full border-[#E2E0DB]" onClick={() => setRequestName(null)}>
              Annuleren
            </Button>
            <Button className="rounded-full bg-[#7547F8]" onClick={submitRequest} disabled={!useCase.trim()}>
              Aanvraag versturen
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <Label>Waarvoor?</Label>
            <Input value={useCase} onChange={(e) => setUseCase(e.target.value)} className="mt-1.5 rounded-[12px] border-[#E2E0DB]" />
          </div>
          <div>
            <Label>Toelichting</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 rounded-[12px] border-[#E2E0DB]" />
          </div>
        </div>
      </ReferenceModal>
    </div>
  );
}

function sortIntegrations(
  list: typeof integrations,
  sort: SortOption,
  client: ClientAccount,
) {
  const copy = [...list];
  if (sort === "name-asc") copy.sort((a, b) => a.name.localeCompare(b.name, "nl"));
  else if (sort === "name-desc") copy.sort((a, b) => b.name.localeCompare(a.name, "nl"));
  else if (sort === "status") {
    const rank = (name: string) => {
      const s = getIntegrationStatus(client, name);
      if (s === "active") return 0;
      if (s === "in_progress") return 1;
      if (s === "requested") return 2;
      return 3;
    };
    copy.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, "nl"));
  }
  return copy;
}
