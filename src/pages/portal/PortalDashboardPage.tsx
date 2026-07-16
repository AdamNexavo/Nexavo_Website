import { useMemo } from "react";
import {
  Building2,
  Image,
  Target,
  Link2,
  Package,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  ReferenceGreeting,
  ReferenceTaskList,
  ReferenceCard,
  ReferenceBadge,
  type ReferenceTask,
} from "@/components/portal/reference/ReferenceUI";
import {
  getPortalTasks,
  getIntakeProgress,
  isClientLive,
  allIntakeStepsComplete,
  getClientPreviewUrl,
  getClientReferenceNumber,
  hasPendingPackage,
} from "@/lib/portal/helpers";
import { getClientPreviewHref } from "@/lib/portal/invoices";
import { getProcessingPayments } from "@/lib/portal/billing";
import { countClientOpenRequests } from "@/lib/portal/applications";
import {
  PortalProgressBar,
  PortalLockedSection,
  PortalPreviewSiteCard,
} from "@/components/portal/PortalUI";
import { WebsitePreviewSkeleton } from "@/components/portal/WebsitePreviewSkeleton";

const TASK_ICONS: Record<string, React.ReactNode> = {
  company: <Building2 className="h-3.5 w-3.5" />,
  media: <Image className="h-3.5 w-3.5" />,
  wishes: <Target className="h-3.5 w-3.5" />,
  integrations: <Link2 className="h-3.5 w-3.5" />,
  package: <Package className="h-3.5 w-3.5" />,
  billing: <Receipt className="h-3.5 w-3.5" />,
  payment: <CreditCard className="h-3.5 w-3.5" />,
};

function formatDate() {
  return new Date().toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PortalDashboardPage() {
  const { client } = usePortalAuth();

  const tasks = useMemo(() => (client ? getPortalTasks(client) : []), [client]);
  const intakeProgress = useMemo(() => (client ? getIntakeProgress(client) : null), [client]);

  if (!client) return null;

  const live = isClientLive(client);
  const intakeProgressPercent = intakeProgress?.percent ?? 0;
  const progress = intakeProgress?.label ?? "0/7";
  const intakeFullyComplete = allIntakeStepsComplete(client) && client.onboarding.completed;
  const previewUrl = getClientPreviewUrl(client);
  const previewHref = getClientPreviewHref(client);
  const openIntegrations = countClientOpenRequests(client);
  const openPayments = getProcessingPayments(client).length;
  const clientRef = getClientReferenceNumber(client);
  const packageLabel = hasPendingPackage(client)
    ? "Nog kiezen"
    : `${client.package.planName}${client.package.maintenanceName ? ` · ${client.package.maintenanceName}` : ""}`;
  const domainLabel =
    client.onboarding.company.desiredDomain?.replace(/^https?:\/\//, "") ||
    client.websiteUrl?.replace(/^https?:\/\//, "") ||
    "Nog niet ingevuld";

  const nextTask = tasks.find((t) => !t.done);

  const referenceTasks: ReferenceTask[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    stepLabel: task.stepLabel,
    href: task.href,
    done: task.done,
    status: task.status,
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#6B7280]">
        {TASK_ICONS[task.id]}
      </span>
    ),
  }));

  if (live) {
    const liveHref = getClientPreviewHref(client);
    return (
      <div>
        <ReferenceGreeting name={client.user.firstName} date={formatDate()} />
        <PortalPreviewSiteCard
          url={previewUrl}
          previewHref={liveHref ?? (client.websiteUrl ? (client.websiteUrl.startsWith("http") ? client.websiteUrl : `https://${client.websiteUrl}`) : null)}
          buildPercent={100}
          phase="Live"
          steps={client.progress.steps}
          status="Live"
          footer="Je website is online. Bekijk statistieken via Website in het menu."
        />
        <div className="mt-5">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/portal/website">Naar website & statistieken</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReferenceGreeting name={client.user.firstName} date={formatDate()} />

      {intakeFullyComplete && (
        <ReferenceCard className="border-[#10B981]/25 bg-[#ECFDF5]/40 py-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-[#10B981]" strokeWidth={1.5} />
          <h2 className="mt-4 text-[20px] font-semibold text-[#111111]">Wij gaan aan de slag!</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#6B7280]">
            Bedankt — we hebben je intake ontvangen. Volg de voortgang hieronder of dien een ticket in bij vragen.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild variant="default" className="rounded-full">
              <Link to="/portal/tickets">Wijziging doorgeven via ticket</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/portal/stap/bedrijfsgegevens">Intake aanpassen</Link>
            </Button>
          </div>
        </ReferenceCard>
      )}

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr] lg:items-stretch">
          <ReferenceTaskList
            title={
              intakeFullyComplete
                ? "Pas je intake aan per stap — klik om een onderdeel te wijzigen."
                : "Rond de volgende stappen af om je website te activeren."
            }
            progress={progress}
            tasks={referenceTasks}
          />

          <div className="flex flex-col justify-between gap-4">
            <ReferenceCard muted className="flex flex-1 flex-col !p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#7547F8]" strokeWidth={1.75} />
                  <h2 className="text-[14px] font-semibold text-[#111111]">Welkom in je klantportaal</h2>
                </div>
                {!intakeFullyComplete && (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">Intake</p>
                    <p className="text-[13px] font-semibold text-[#7547F8]">{intakeProgressPercent}%</p>
                  </div>
                )}
              </div>
              {!intakeFullyComplete && (
                <div className="mb-3">
                  <PortalProgressBar
                    percent={intakeProgressPercent}
                    trackClassName="bg-white border border-[#E2E0DB]"
                  />
                </div>
              )}
              <p className="text-[13px] leading-relaxed text-[#6B7280]">
                Rond je intake af, lever media en websitewensen aan, volg betalingen en dien supportvragen in —
                alles op één plek.
              </p>
              <ul className="mt-3 flex flex-1 flex-col justify-end space-y-2 text-[13px]">
                <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                  <span className="text-[#6B7280]">Stappen voltooid</span>
                  <span className="font-medium text-[#7547F8]">{progress}</span>
                </li>
                <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                  <span className="text-[#6B7280]">Pakket</span>
                  {hasPendingPackage(client) ? (
                    <Link to="/portal/stap/pakket" className="font-medium text-[#7547F8] hover:underline">
                      Pakket kiezen
                    </Link>
                  ) : (
                    <span className="font-medium text-[#111111]">{packageLabel}</span>
                  )}
                </li>
                <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                  <span className="text-[#6B7280]">Website fase</span>
                  <span className="font-medium text-[#111111]">{client.progress.phase}</span>
                </li>
                <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                  <span className="text-[#6B7280]">Gewenst domein</span>
                  <span className="truncate font-medium text-[#111111]">{domainLabel}</span>
                </li>
                <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                  <span className="text-[#6B7280]">Klantnummer</span>
                  <span className="font-medium text-[#111111]">{clientRef}</span>
                </li>
              </ul>
            </ReferenceCard>

            <ReferenceCard className="!p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                <h3 className="text-[13px] font-semibold text-[#111111]">Acties & updates</h3>
              </div>
              <ul className="mt-3 space-y-2 text-[13px]">
                {nextTask && (
                  <li className="flex items-start justify-between gap-2 rounded-[10px] border border-[#FED7AA]/60 bg-white px-3 py-2">
                    <span className="text-[#6B7280]">Volgende stap</span>
                    <Link to={nextTask.href} className="font-medium text-[#7547F8] hover:underline">
                      {nextTask.title}
                    </Link>
                  </li>
                )}
                {client.progress.lastUpdate && (
                  <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                    <span className="text-[#6B7280]">Laatste update</span>
                    <span className="font-medium text-[#111111]">
                      {new Date(client.progress.lastUpdate).toLocaleDateString("nl-NL")}
                    </span>
                  </li>
                )}
                {openIntegrations > 0 && (
                  <li className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2">
                    <span className="text-[#6B7280]">Openstaande aanvraag</span>
                    <Link to="/portal/koppelingen" className="inline-flex items-center gap-1 font-medium text-[#7547F8]">
                      {openIntegrations} koppeling(en) <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                )}
                {openPayments > 0 && (
                  <li className="flex items-center justify-between gap-2 rounded-[10px] border border-[#FED7AA]/50 bg-white px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-[#6B7280]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                      Openstaande betaling
                    </span>
                    <Link to="/portal/betaling" className="font-medium text-[#7547F8] hover:underline">
                      Bekijken
                    </Link>
                  </li>
                )}
              </ul>
            </ReferenceCard>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr] lg:items-stretch">
          <WebsitePreviewSkeleton client={client} />

          <PortalLockedSection
            title="Statistieken"
            subtitle="Bezoekers, conversies en grafieken"
            locked={!live}
            lockMessage="Beschikbaar zodra je website live staat"
            className="h-full"
          >
            <p className="text-[13px] text-[#6B7280]">
              Op de website-pagina vind je grafieken, trends en prestaties zodra je site live is.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
              <Link to="/portal/website">Naar website & statistieken</Link>
            </Button>
          </PortalLockedSection>
        </div>
      </div>
    </div>
  );
}
