import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { useToast } from "@/hooks/use-toast";
import { PortalAuthShell } from "@/components/portal/PortalAuthShell";
import { getInvites } from "@/lib/portal/storage";

export default function PortalRegisterPage() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token") ?? "";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register, isClient } = usePortalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isClient) navigate("/portal/website", { replace: true });
  }, [isClient, navigate]);

  useEffect(() => {
    if (!inviteToken) return;
    const invite = getInvites().find((i) => i.token === inviteToken && !i.used);
    if (invite) {
      setForm((prev) => ({
        ...prev,
        email: invite.email,
        companyName: invite.companyName,
      }));
    }
  }, [inviteToken]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Wachtwoorden komen niet overeen", variant: "destructive" });
      return;
    }
    if (form.password.length < 8) {
      toast({ title: "Wachtwoord moet minimaal 8 tekens zijn", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await register({ ...form, inviteToken: inviteToken || undefined });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Registratie mislukt", description: result.error, variant: "destructive" });
      return;
    }
    navigate("/portal/website");
  };

  return (
    <PortalAuthShell
      label="Klantportaal"
      title="Account aanmaken"
      subtitle={inviteToken ? "Je bent uitgenodigd door Nexavo. Maak je account aan en start je intake." : "Registreer je account om je website-intake te starten."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Voornaam</Label>
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
          </div>
          <div>
            <Label>Achternaam</Label>
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
          </div>
        </div>
        <div>
          <Label>Bedrijfsnaam</Label>
          <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
        </div>
        <div>
          <Label>E-mailadres</Label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Wachtwoord</Label>
            <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
          </div>
          <div>
            <Label>Bevestig</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="mt-1.5 h-11 rounded-[12px]" />
          </div>
        </div>
        <Button type="submit" className="h-11 w-full rounded-[12px] bg-[#7547F8] hover:bg-[#6840E0]" disabled={loading}>
          {loading ? "Bezig..." : "Account aanmaken"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-[#6B7280]">
        Al een account? <Link to="/portal/login" className="font-medium text-[#7547F8] hover:underline">Inloggen</Link>
      </p>
    </PortalAuthShell>
  );
}
