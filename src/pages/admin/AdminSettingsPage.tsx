import { useState } from "react";
import {
  ReferenceCard,
  ReferencePageTitle,
  refInputClass,
  refLabelClass,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getAdminSettings,
  saveAdminSettings,
  DEFAULT_ADMIN_SETTINGS,
  type AdminSettings,
} from "@/lib/portal/admin-settings";

const PRESET_COLORS = [
  { label: "Nexavo paars", value: "#7547F8" },
  { label: "Donker", value: "#111111" },
  { label: "Blauw", value: "#2563EB" },
  { label: "Groen", value: "#059669" },
  { label: "Oranje", value: "#EA580C" },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());

  const save = () => {
    saveAdminSettings(settings);
    toast({ title: "Instellingen opgeslagen", description: "Herlaad de pagina om kleurwijzigingen te zien." });
  };

  const reset = () => {
    setSettings(DEFAULT_ADMIN_SETTINGS);
    saveAdminSettings(DEFAULT_ADMIN_SETTINGS);
    toast({ title: "Standaardinstellingen hersteld" });
  };

  return (
    <div>
      <ReferencePageTitle
        title="Instellingen"
        subtitle="Pas je admin-profiel en console-voorkeuren aan."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ReferenceCard className="space-y-4">
          <h3 className="text-[15px] font-semibold">Profiel</h3>
          <div>
            <label className={refLabelClass}>Weergavenaam</label>
            <Input
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              className={`mt-1.5 ${refInputClass}`}
            />
          </div>
          <div>
            <label className={refLabelClass}>Bedrijfslabel (sidebar)</label>
            <Input
              value={settings.companyLabel}
              onChange={(e) => setSettings({ ...settings, companyLabel: e.target.value })}
              className={`mt-1.5 ${refInputClass}`}
            />
          </div>
        </ReferenceCard>

        <ReferenceCard className="space-y-4">
          <h3 className="text-[15px] font-semibold">Accentkleur</h3>
          <p className="text-[13px] text-[#6B7280]">
            Kies een accentkleur voor de admin console. Dit wordt opgeslagen lokaal (demo).
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSettings({ ...settings, accentColor: c.value })}
                className="flex items-center gap-2 rounded-full border border-[#E2E0DB] px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-[#7547F8]/40"
                style={{
                  borderColor: settings.accentColor === c.value ? c.value : undefined,
                  backgroundColor: settings.accentColor === c.value ? `${c.value}15` : undefined,
                }}
              >
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.value }} />
                {c.label}
              </button>
            ))}
          </div>
          <div>
            <label className={refLabelClass}>Custom hex</label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded-[8px] border border-[#E2E0DB]"
              />
              <Input
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className={refInputClass}
              />
            </div>
          </div>
          <div
            className="rounded-[12px] p-4 text-white"
            style={{ backgroundColor: settings.accentColor }}
          >
            <p className="text-[13px] font-medium">Preview accentkleur</p>
            <p className="text-[12px] opacity-80">Knoppen en badges gebruiken deze kleur.</p>
          </div>
        </ReferenceCard>
      </div>

      <div className="mt-5 flex gap-3">
        <Button variant="brand" onClick={save}>
          Opslaan
        </Button>
        <Button variant="outline" onClick={reset}>
          Standaard herstellen
        </Button>
      </div>
    </div>
  );
}
