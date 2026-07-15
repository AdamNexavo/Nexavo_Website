import { Link } from "react-router-dom";
import { NexavoLogo } from "@/components/layout/NexavoLogo";
import { PortalBrowserPreview } from "@/components/portal/PortalUI";

type PortalAuthShellProps = {
  children: React.ReactNode;
  label?: string;
  title: string;
  subtitle: string;
  variant?: "client" | "admin";
};

export function PortalAuthShell({
  children,
  label,
  title,
  subtitle,
  variant = "client",
}: PortalAuthShellProps) {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <div className="pointer-events-none fixed inset-0 nex-bg-dots opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto grid min-h-screen max-w-[1200px] lg:grid-cols-2 lg:gap-8 lg:p-8">
        {/* Left: brand panel */}
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <Link to="/">
            <NexavoLogo className="h-7" />
          </Link>
          <div>
            {label && (
              <span className="mb-4 inline-flex rounded-full border border-black/[0.08] bg-[#F5F4F2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                {label}
              </span>
            )}
            <h1 className="max-w-md text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#0B0B0D]">
              {title}
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#6B7280]">
              {subtitle}
            </p>
            {variant === "client" && (
              <div className="mt-10 max-w-sm">
                <PortalBrowserPreview url="preview.jouwbedrijf.works" status="In voorbereiding" />
              </div>
            )}
          </div>
          <p className="text-[13px] text-[#9CA3AF]">© Nexavo · Professionele websites voor MKB</p>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center px-5 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex justify-center">
                <NexavoLogo className="h-7" />
              </Link>
              {label && (
                <span className="mt-6 inline-flex rounded-full border border-black/[0.08] bg-[#F5F4F2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  {label}
                </span>
              )}
              <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-[#0B0B0D]">{title}</h1>
              <p className="mt-2 text-[15px] text-[#6B7280]">{subtitle}</p>
            </div>
            <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.12)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
