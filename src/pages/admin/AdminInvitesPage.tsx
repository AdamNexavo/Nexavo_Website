import { useState } from "react";
import { getInvites, upsertInvite, generateId, generateInviteToken } from "@/lib/portal/storage";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceInfoCallout,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { planLabels, type PlanId } from "@/data/pricing";
import { maintenancePackages } from "@/data/maintenance";
import { refInputClass, refLabelClass } from "@/components/portal/reference/ReferenceUI";

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState(getInvites());
  const [form, setForm] = useState({
    email: "",
    companyName: "",
    contactName: "",
    planId: "start" as PlanId,
    maintenanceId: "plus",
    noPackage: false,
  });
  const { toast } = useToast();

  const refresh = () => setInvites(getInvites());

  const createInvite = () => {
    if (!form.email || !form.companyName) {
      toast({ title: "Vul e-mail en bedrijfsnaam in", variant: "destructive" });
      return;
    }
    const maintenance = maintenancePackages.find((p) => p.id === form.maintenanceId);
    const token = generateInviteToken();
    upsertInvite({
      id: generateId(),
      email: form.email,
      companyName: form.companyName,
      planId: form.noPackage ? "none" : form.planId,
      planName: form.noPackage ? "Nog te kiezen" : planLabels[form.planId],
      maintenanceId: form.noPackage ? undefined : form.maintenanceId,
      maintenanceName: form.noPackage ? undefined : (maintenance?.name ?? "Plus Beheer"),
      noPackage: form.noPackage,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      used: false,
    });
    refresh();
    setForm({ email: "", companyName: "", contactName: "", planId: "start", maintenanceId: "plus", noPackage: false });
    toast({ title: "Uitnodiging aangemaakt" });
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/portal/register?token=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Registratielink gekopieerd" });
  };

  return (
    <div>
      <ReferencePageTitle
        title="Klanten uitnodigen"
        subtitle="Genereer een registratielink. Pakketkeuze is optioneel — klanten kunnen zelf kiezen in het portaal."
      />

      <ReferenceCard className="mb-6 space-y-5">
        <h3 className="text-[15px] font-semibold">Nieuwe uitnodiging</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={refLabelClass}>Contactpersoon</label>
            <Input
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="Jan de Vries"
              className={`mt-1.5 ${refInputClass}`}
            />
          </div>
          <div>
            <label className={refLabelClass}>E-mail</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="klant@bedrijf.nl"
              className={`mt-1.5 ${refInputClass}`}
            />
          </div>
          <div>
            <label className={refLabelClass}>Bedrijfsnaam</label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className={`mt-1.5 ${refInputClass}`}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block p-4">
          <Checkbox
            checked={form.noPackage}
            onCheckedChange={(v) => setForm({ ...form, noPackage: v === true })}
            className="mt-0.5"
          />
          <div>
            <p className="text-[13px] font-medium text-[#111111]">Klant kiest zelf pakket in portaal</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">
              Geen website- of onderhoudspakket vooraf koppelen. Na registratie kiest de klant via stap 5.
            </p>
          </div>
        </label>

        {!form.noPackage && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Websitepakket</Label>
              <select
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value as PlanId })}
                className="mt-1.5 flex h-10 w-full rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-3 text-[14px]"
              >
                {Object.entries(planLabels).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Onderhoudspakket</Label>
              <select
                value={form.maintenanceId}
                onChange={(e) => setForm({ ...form, maintenanceId: e.target.value })}
                className="mt-1.5 flex h-10 w-full rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-3 text-[14px]"
              >
                {maintenancePackages.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.price}/mnd</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <Button variant="brand" onClick={createInvite}>
          Uitnodiging aanmaken
        </Button>

        <ReferenceInfoCallout title="Tip">
          Kopieer de registratielink en stuur deze per e-mail. De link is 14 dagen geldig.
        </ReferenceInfoCallout>
      </ReferenceCard>

      <ReferenceCard>
        <h3 className="mb-4 text-[15px] font-semibold">Alle uitnodigingen</h3>
        {invites.length === 0 ? (
          <p className="text-[14px] text-[#6B7280]">Geen uitnodigingen.</p>
        ) : (
          <div className="space-y-3">
            {invites.map((i) => (
              <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block p-4">
                <div>
                  <p className="font-medium">{i.companyName}</p>
                  <p className="text-[13px] text-[#6B7280]">
                    {i.email}
                    {i.noPackage ? " · Klant kiest zelf pakket" : ` · ${i.planName}${i.maintenanceName ? ` · ${i.maintenanceName}` : ""}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ReferenceBadge variant={i.used ? "green" : "purple"}>
                    {i.used ? "Gebruikt" : "Open"}
                  </ReferenceBadge>
                  {!i.used && (
                    <Button variant="outline" size="sm" onClick={() => copyLink(i.token)}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Link kopiëren
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ReferenceCard>
    </div>
  );
}
