import { Check, CheckCircle2, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalLabel, portalChoiceChipClass } from "@/components/portal/PortalUI";
import { ReferenceCard, ReferenceWhiteCard } from "@/components/portal/reference/ReferenceUI";
import {
  DESIRED_SECTIONS,
  PORTAL_ADDONS,
  PORTAL_INTEGRATIONS,
} from "@/lib/portal/constants";
import { contactInfo } from "@/data/contact";
import type { MaatwerkWishlist } from "@/lib/portal/types";

type MaatwerkWishlistPickerProps = {
  value: MaatwerkWishlist;
  onChange: (value: MaatwerkWishlist) => void;
};

function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function MaatwerkWishlistPicker({ value, onChange }: MaatwerkWishlistPickerProps) {
  const setPages = (pages: string[]) => onChange({ ...value, pages });
  const setIntegrations = (integrations: string[]) => onChange({ ...value, integrations });
  const setAddons = (addons: string[]) => onChange({ ...value, addons });

  return (
    <div className="space-y-4 border-t border-[#E2E0DB] pt-4">
      <div>
        <h4 className="text-[14px] font-semibold text-[#111111]">
          Wil je dat we alvast een idee hebben? Of wil je zelf alvast een idee hebben
        </h4>
        <p className="mt-1 text-[12px] text-[#6B7280]">
          Optioneel — selecteer wat je al in gedachten hebt. Zo kunnen we beter voorbereid contact opnemen.
        </p>
      </div>

      <ReferenceWhiteCard>
        <PortalLabel optional className="mb-2">
          Pagina&apos;s & secties
        </PortalLabel>
        <div className="flex flex-wrap gap-2">
          {DESIRED_SECTIONS.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setPages(toggleItem(value.pages, page))}
              className={portalChoiceChipClass(value.pages.includes(page))}
            >
              {page}
            </button>
          ))}
        </div>
      </ReferenceWhiteCard>

      <ReferenceWhiteCard>
        <PortalLabel optional className="mb-2">
          Koppelingen
        </PortalLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          {PORTAL_INTEGRATIONS.map((integration) => {
            const selected = value.integrations.includes(integration.name);
            return (
              <button
                key={integration.id}
                type="button"
                onClick={() => setIntegrations(toggleItem(value.integrations, integration.name))}
                className={cn(
                  "flex items-start gap-2.5 rounded-[10px] border bg-white px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-[#7547F8] ring-1 ring-[#7547F8]/15"
                    : "border-[#E2E0DB] hover:border-[#7547F8]/30",
                )}
              >
                {integration.logo ? (
                  <img
                    src={integration.logo}
                    alt=""
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-md object-contain"
                  />
                ) : (
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                      selected ? "border-[#7547F8] bg-[#7547F8] text-white" : "border-[#D1D5DB] bg-[#FAFAF8]",
                    )}
                  >
                    {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-[#111111]">{integration.name}</span>
                  <span className="block text-[11px] leading-snug text-[#6B7280]">{integration.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </ReferenceWhiteCard>

      <ReferenceWhiteCard>
        <PortalLabel optional className="mb-2">
          Add-ons & modules
        </PortalLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          {PORTAL_ADDONS.map((addon) => {
            const selected = value.addons.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => setAddons(toggleItem(value.addons, addon.id))}
                className={cn(
                  "flex items-start gap-2.5 rounded-[10px] border bg-white px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-[#7547F8] ring-1 ring-[#7547F8]/15"
                    : "border-[#E2E0DB] hover:border-[#7547F8]/30",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-[#7547F8] bg-[#7547F8] text-white" : "border-[#D1D5DB] bg-white",
                  )}
                >
                  {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-[#111111]">{addon.name}</span>
                  <span className="block text-[11px] leading-snug text-[#6B7280]">{addon.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </ReferenceWhiteCard>
    </div>
  );
}

export function getMaatwerkWishlistFromClient(client: {
  package: { maatwerkWishlist?: MaatwerkWishlist };
  onboarding: { desiredPages: string[]; integrations: string[] };
}): MaatwerkWishlist {
  return {
    pages: client.package.maatwerkWishlist?.pages ?? client.onboarding.desiredPages ?? [],
    integrations: client.package.maatwerkWishlist?.integrations ?? client.onboarding.integrations ?? [],
    addons: client.package.maatwerkWishlist?.addons ?? [],
  };
}

function WishlistSummary({ wishlist }: { wishlist: MaatwerkWishlist }) {
  const addonNames = wishlist.addons
    .map((id) => PORTAL_ADDONS.find((a) => a.id === id)?.name ?? id)
    .filter(Boolean);

  if (
    wishlist.pages.length === 0 &&
    wishlist.integrations.length === 0 &&
    addonNames.length === 0
  ) {
    return (
      <p className="text-[13px] text-[#6B7280]">
        Je hebt nog geen specifieke voorkeuren doorgegeven. We bespreken alles samen in het intakegesprek.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3 text-[13px]">
      <div className="rounded-[12px] bg-white p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Pagina&apos;s</p>
        <p className="mt-1 font-medium text-[#111111]">
          {wishlist.pages.length > 0 ? wishlist.pages.join(", ") : "—"}
        </p>
      </div>
      <div className="rounded-[12px] bg-white p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Koppelingen</p>
        <p className="mt-1 font-medium text-[#111111]">
          {wishlist.integrations.length > 0 ? wishlist.integrations.join(", ") : "—"}
        </p>
      </div>
      <div className="rounded-[12px] bg-white p-3 sm:col-span-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Add-ons</p>
        <p className="mt-1 font-medium text-[#111111]">
          {addonNames.length > 0 ? addonNames.join(", ") : "—"}
        </p>
      </div>
    </div>
  );
}

export function MaatwerkCompletionBlock({ wishlist }: { wishlist: MaatwerkWishlist }) {
  return (
    <ReferenceCard className="space-y-4 border-[#FDBA74]/50 bg-[#FFFBEB]/60">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFEDD5] text-[#EA580C]">
          <Clock3 className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#EA580C]">In behandeling</p>
          <h3 className="mt-0.5 text-[16px] font-semibold text-[#111111]">Je maatwerk-aanvraag is ontvangen</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">
            Bedankt voor je aanvraag. We nemen zo snel mogelijk contact met je op om alles samen in te delen: je
            wensen, modules, planning en een offerte op maat.
          </p>
        </div>
      </div>

      <ReferenceWhiteCard className="space-y-3">
        <h4 className="text-[13px] font-semibold text-[#111111]">Wat gebeurt er nu?</h4>
        <ul className="space-y-2 text-[13px] text-[#6B7280]">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" strokeWidth={2} />
            <span>Je aanvraag staat bij ons in behandeling.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" strokeWidth={2} />
            <span>De pakketstap blijft open totdat Nexavo je maatwerk-intake heeft afgerond.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" strokeWidth={2} />
            <span>Je kunt intussen verder met de volgende stappen van je intake.</span>
          </li>
        </ul>
      </ReferenceWhiteCard>

      <ReferenceWhiteCard className="space-y-3">
        <h4 className="text-[13px] font-semibold text-[#111111]">Jouw doorgegeven voorkeuren</h4>
        <WishlistSummary wishlist={wishlist} />
      </ReferenceWhiteCard>

      <p className="text-[13px] text-[#6B7280]">
        Vragen? Mail ons op{" "}
        <a href={`mailto:${contactInfo.primaryEmail}`} className="font-medium text-[#7547F8] hover:underline">
          {contactInfo.primaryEmail}
        </a>
        .
      </p>
    </ReferenceCard>
  );
}
