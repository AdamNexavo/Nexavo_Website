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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  ReferenceGreeting,
  ReferenceTaskList,
  ReferenceCard,
  type ReferenceTask,
} from "@/components/portal/reference/ReferenceUI";
import {
  getPortalTasks,
  getPortalTaskProgress,
  isClientLive,
  getIntakeProgressPercent,
  allIntakeStepsComplete,
  getClientPreviewUrl,
} from "@/lib/portal/helpers";
import { getClientPreviewHref } from "@/lib/portal/invoices";
import {
  PortalProgressBar,
  PortalLockedSection,
  PortalPreviewSiteCard,
} from "@/components/portal/PortalUI";

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
  const progress = client ? getPortalTaskProgress(client) : "0/7";

  if (!client) return null;

  const live = isClientLive(client);

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

  const intakeProgressPercent = getIntakeProgressPercent(client);
  const intakeFullyComplete = allIntakeStepsComplete(client) && client.onboarding.completed;
  const buildPercent = client.progress.percent;

  const previewUrl = getClientPreviewUrl(client);
  const previewHref = getClientPreviewHref(client);

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
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <ReferenceGreeting name={client.user.firstName} date={formatDate()} />
        {!intakeFullyComplete ? (
          <div className="w-full min-w-[180px] max-w-[220px] shrink-0">
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="font-medium text-[#6B7280]">Intake</span>
              <span className="font-semibold text-[#7547F8]">{intakeProgressPercent}%</span>
            </div>
            <PortalProgressBar percent={intakeProgressPercent} />
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-[12px] font-medium text-[#10B981]">
            <CheckCircle2 className="h-4 w-4" />
            Intake voltooid
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-5">
          {intakeFullyComplete && (
            <ReferenceCard className="border-[#10B981]/25 bg-[#ECFDF5]/40 py-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-[#10B981]" strokeWidth={1.5} />
              <h2 className="mt-4 text-[20px] font-semibold text-[#111111]">Wij gaan aan de slag!</h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#6B7280]">
                Bedankt — we hebben je intake ontvangen. We nemen zo snel mogelijk contact met je op. Heb je in de
                tussentijd nog vragen of wijzigingen? Laat het ons nu weten.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild variant="default">
                  <Link to="/portal/tickets">Wijziging doorgeven via ticket</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/portal/stap/bedrijfsgegevens">Intake aanpassen</Link>
                </Button>
              </div>
            </ReferenceCard>
          )}

          {!intakeFullyComplete && (
            <ReferenceTaskList
              title="Rond de volgende stappen af om je website te activeren."
              progress={progress}
              tasks={referenceTasks}
            />
          )}

          {intakeFullyComplete && (
            <ReferenceTaskList
              title="Pas je intake aan per stap — klik om een onderdeel te wijzigen."
              progress={progress}
              tasks={referenceTasks}
            />
          )}

          <PortalPreviewSiteCard
            url={previewUrl}
            previewHref={previewHref}
            buildPercent={buildPercent}
            phase={client.progress.phase}
            steps={client.progress.steps}
            status={intakeFullyComplete ? "In bouw" : "In voorbereiding"}
            footer={
              previewHref
                ? undefined
                : "Zodra je preview klaarstaat, verschijnt hier een link om live mee te kijken."
            }
          />

          <PortalLockedSection
            title="Statistieken"
            subtitle="Bezoekers, conversies en grafieken"
            locked={!live}
            lockMessage="Beschikbaar zodra je website live staat"
          >
            <p className="text-[13px] text-[#6B7280]">
              Op de website-pagina vind je grafieken, trends en prestaties zodra je site live is.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
              <Link to="/portal/website">Naar website & statistieken</Link>
            </Button>
          </PortalLockedSection>
        </div>

        <div className="space-y-5">
          <ReferenceCard muted>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7547F8]" strokeWidth={1.75} />
              <h2 className="text-[14px] font-semibold text-[#111111]">Welkom in je klantportaal</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-[#6B7280]">
              Klik op een stap om naar de bijbehorende pagina te gaan. Je hoeft het portaal niet te verlaten.
            </p>
          </ReferenceCard>
        </div>
      </div>
    </div>
  );
}
