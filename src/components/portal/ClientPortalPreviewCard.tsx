import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { ClientAccount } from "@/lib/portal/types";
import { ReferenceWhiteCard, ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { getClientPreviewHref } from "@/lib/portal/invoices";

const PREVIEW_STATUS_LABELS = {
  concept: "Concept",
  ready: "Klaar om te bekijken",
  feedback_requested: "Feedback gevraagd",
  approved: "Goedgekeurd",
} as const;

export function ClientPortalPreviewCard({ client }: { client: ClientAccount }) {
  const preview = client.previewSettings;
  if (!preview?.enabled) return null;

  const href = preview.url
    ? preview.url.startsWith("http")
      ? preview.url
      : `https://${preview.url.replace(/^\/\//, "")}`
    : getClientPreviewHref(client);

  return (
    <ReferenceWhiteCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Website preview</p>
          <h3 className="mt-1 text-[18px] font-semibold text-[#111111]">
            {preview.title ?? "Preview van je website"}
          </h3>
          {preview.status && (
            <span className="mt-2 inline-block">
              <ReferenceBadge variant="purple">{PREVIEW_STATUS_LABELS[preview.status]}</ReferenceBadge>
            </span>
          )}
        </div>
        {href && (
          <Button asChild className="rounded-full bg-[#7547F8] hover:bg-[#6840E0]">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Bekijk preview
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
      {preview.description && (
        <p className="mt-3 text-[14px] leading-relaxed text-[#6B7280]">{preview.description}</p>
      )}
      {!href && (
        <p className="mt-3 text-[13px] text-[#9CA3AF]">
          Preview-URL wordt door Nexavo toegevoegd zodra deze klaarstaat.
        </p>
      )}
      <p className="mt-4 text-[12px] text-[#9CA3AF]">
        Meer details op <Link to="/portal/website" className="font-medium text-[#7547F8] hover:underline">Website</Link>.
      </p>
    </ReferenceWhiteCard>
  );
}
