import { Link } from "react-router-dom";
import { Phone, Mail, BookOpen, MessageSquare, Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalPageHeader, PortalCard } from "@/components/portal/PortalUI";
import { PortalInlineChat } from "@/components/portal/PortalInlineChat";
import { contactInfo } from "@/data/contact";
import { ROUTES } from "@/lib/routes";
import { ReferenceCard } from "@/components/portal/reference/ReferenceUI";

const QUICK_LINKS = [
  {
    title: "Supporttickets",
    description: "Wijzigingen, vragen en meldingen",
    href: "/portal/tickets",
    icon: MessageSquare,
  },
  {
    title: "Kennisbank",
    description: "Antwoorden over intake, betaling en livegang",
    href: ROUTES.kennisbank,
    icon: BookOpen,
    external: true,
  },
  {
    title: "Facturatie",
    description: "Facturen, betalingen en pakket",
    href: "/portal/facturatie",
    icon: Receipt,
  },
];

export default function PortalKlantenservicePage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  const openTickets = client.tickets.filter((t) => t.status !== "done" && t.status !== "out_of_scope").length;

  return (
    <div>
      <PortalPageHeader
        title="Klantenservice"
        subtitle="Direct contact, snelle antwoorden via de assistent, of een ticket voor persoonlijk follow-up."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <ReferenceCard className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold text-[#111111]">Persoonlijk contact</h2>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            Bereikbaar {contactInfo.days}, {contactInfo.hours}.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${contactInfo.primaryPhone.replace(/[\s()]/g, "")}`}
              className="flex items-center gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] transition-colors hover:bg-[#FAFAFA]"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#7547F8]" />
              {contactInfo.primaryPhone}
            </a>
            <a
              href={`mailto:${contactInfo.email.support}`}
              className="flex items-center gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] transition-colors hover:bg-[#FAFAFA]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#7547F8]" />
              {contactInfo.email.support}
            </a>
          </div>
        </ReferenceCard>

        <ReferenceCard>
          <p className="text-[12px] text-[#9CA3AF]">Open tickets</p>
          <p className="text-[32px] font-semibold leading-none">{openTickets}</p>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full rounded-full">
            <Link to="/portal/tickets">Naar tickets</Link>
          </Button>
        </ReferenceCard>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group rounded-[16px] border border-[#E5E5E5] bg-[#F5F5F5] p-4 transition-colors hover:border-[#7547F8]/30"
          >
            <item.icon className="mb-2 h-5 w-5 text-[#7547F8]" strokeWidth={1.75} />
            <p className="text-[14px] font-semibold text-[#111111]">{item.title}</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">{item.description}</p>
            {item.external && (
              <ExternalLink className="mt-2 h-3.5 w-3.5 text-[#9CA3AF] opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </Link>
        ))}
      </div>

      <PortalCard>
        <h3 className="mb-1 text-[16px] font-semibold">Nexavo assistent</h3>
        <p className="mb-4 text-[13px] text-[#6B7280]">
          Stel een korte vraag — voor wijzigingen aan je website open je het beste een ticket.
        </p>
        <PortalInlineChat />
      </PortalCard>
    </div>
  );
}
