import { usePortalAuth } from "@/context/PortalAuthContext";
import { ReferencePageTitle } from "@/components/portal/reference/ReferenceUI";
import { WebsiteStatsPanel } from "@/components/portal/WebsiteStatsPanel";

export default function PortalWebsitePage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  return (
    <div className="space-y-6">
      <ReferencePageTitle
        title="Website"
        subtitle="Statistieken en prestaties van je website."
      />

      <WebsiteStatsPanel client={client} showPreview={false} />
    </div>
  );
}
