import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalPageHeader } from "@/components/portal/PortalUI";
import { WebsiteStatsPanel } from "@/components/portal/WebsiteStatsPanel";

export default function PortalWebsitePage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Website"
        subtitle="Statistieken, prestaties en preview van je website — alles op één plek."
      />
      <WebsiteStatsPanel client={client} showPreview />
    </div>
  );
}
