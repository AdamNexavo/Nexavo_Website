import { Link } from "react-router-dom";
import { DarkFooterBackground } from "@/components/ui/nex-backgrounds";
import { Separator } from "@/components/ui/separator";
import { NexavoLogo } from "@/components/layout/NexavoLogo";

const footerColumns = [
  {
    title: "Pagina's",
    links: [
      { label: "Homepage", href: "/" },
      { label: "Prijzen", href: "/pricing" },
    ],
  },
  {
    title: "Ontdek",
    links: [
      { label: "Diensten", href: "/diensten" },
      { label: "Projecten", href: "/projecten" },
      { label: "Koppelingen", href: "/integraties" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Kennisbank", href: "/kennisbank" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Voorwaarden", href: "/voorwaarden" },
    ],
  },
];

const FooterLink = ({ href, label }: { href: string; label: string }) => {
  const className =
    "text-sm text-white/55 hover:text-white/90 transition-colors leading-relaxed";

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="relative bg-[#09090B] text-white overflow-hidden border-t border-white/[0.06]">
      <DarkFooterBackground />
      <div className="relative z-10 container max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-10 mb-16 md:mb-20">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:pr-12">
            <Link to="/" className="inline-flex items-center mb-6" aria-label="Nexavo home">
              <NexavoLogo variant="hero" className="h-7" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Professionele websites en automatiseringen die jouw bedrijf laten groeien.
              Wij regelen alles. Jij focust op ondernemen.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-5">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/[0.08] mb-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Nexavo. Alle rechten voorbehouden.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/35">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">
              Privacy
            </Link>
            <Link to="/voorwaarden" className="hover:text-white/70 transition-colors">
              Voorwaarden
            </Link>
            <p className="text-xs text-white/40">
              Website ontwikkeld door{" "}
              <Link to="/" className="text-white/65 hover:text-white/90 transition-colors">
                Nexavo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
