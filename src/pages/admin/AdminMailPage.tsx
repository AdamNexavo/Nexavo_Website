import { useState } from "react";
import { Mail, Eye } from "lucide-react";
import {
  ReferencePageTitle,
  ReferenceCard,
  ReferenceWhiteCard,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { MAIL_TEMPLATES, getDemoMailVars } from "@/lib/mail/templates";
import type { MailTemplateId } from "@/lib/mail/types";

export default function AdminMailPage() {
  const [active, setActive] = useState<MailTemplateId>("account_invitation");
  const vars = getDemoMailVars();
  const template = MAIL_TEMPLATES.find((t) => t.id === active)!;
  const rendered = template.render(vars);

  return (
    <div className="space-y-6">
      <ReferencePageTitle
        title="Mail automations"
        subtitle="Preview van Nexavo e-mailtemplates. Verzenden vereist RESEND_API_KEY in productie."
      />

      <ReferenceCard className="border-[#7547F8]/20 bg-[#EDE9FE]/20">
        <div className="flex gap-3">
          <Mail className="h-5 w-5 shrink-0 text-[#7547F8]" />
          <div className="text-[13px] text-[#6B7280]">
            <p className="font-medium text-[#111111]">Demo-modus actief zonder API-key</p>
            <p className="mt-1">
              Templates en triggers zijn klaar. Voeg <code className="rounded bg-white px-1">RESEND_API_KEY</code>,{" "}
              <code className="rounded bg-white px-1">MAIL_FROM=no-reply@nexavo.works</code> en optioneel{" "}
              <code className="rounded bg-white px-1">ADMIN_NOTIFICATION_EMAIL</code> toe in Vercel.
            </p>
          </div>
        </div>
      </ReferenceCard>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <ReferenceWhiteCard className="h-fit space-y-1 p-3">
          {MAIL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setActive(tpl.id)}
              className={`w-full rounded-[10px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                active === tpl.id ? "bg-[#EDE9FE] font-medium text-[#7547F8]" : "text-[#6B7280] hover:bg-[#FAFAF8]"
              }`}
            >
              {tpl.subject}
            </button>
          ))}
        </ReferenceWhiteCard>

        <div className="space-y-4">
          <ReferenceWhiteCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Onderwerp</p>
                <p className="mt-1 text-[16px] font-semibold">{rendered.subject}</p>
                <p className="mt-2 text-[13px] text-[#6B7280]">{template.description}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <a href={`data:text/html,${encodeURIComponent(rendered.html)}`} target="_blank" rel="noreferrer">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Open HTML
                </a>
              </Button>
            </div>
          </ReferenceWhiteCard>

          <ReferenceWhiteCard className="overflow-hidden p-0">
            <iframe
              title="mail-preview"
              srcDoc={rendered.html}
              className="h-[520px] w-full border-0 bg-[#F5F5F5]"
              sandbox=""
            />
          </ReferenceWhiteCard>
        </div>
      </div>
    </div>
  );
}
