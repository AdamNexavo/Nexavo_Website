import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { useToast } from "@/hooks/use-toast";
import { PortalAuthShell } from "@/components/portal/PortalAuthShell";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginAsAdmin, isClient, isAdmin } = usePortalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  useEffect(() => {
    if (isClient) navigate("/portal", { replace: true });
    else if (isAdmin) navigate("/admin", { replace: true });
  }, [isClient, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let result = await login(email, password);
    if (!result.ok && email.toLowerCase() === "admin@nexavo.works") {
      result = await loginAsAdmin(email, password);
      if (result.ok) {
        setLoading(false);
        navigate("/admin");
        return;
      }
    }
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Inloggen mislukt", description: result.error, variant: "destructive" });
      return;
    }
    navigate("/portal");
  };

  return (
    <PortalAuthShell
      label="Klantportaal"
      title="Welkom terug"
      subtitle="Log in om je website, voortgang en support te bekijken."
    >
      {registered && (
        <div className="mb-5 rounded-[14px] bg-[#ECFDF5] px-4 py-3 text-[14px] text-[#059669]">
          Account aangemaakt! Log nu in met je gegevens.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-[#0B0B0D]">E-mailadres</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jij@bedrijf.nl" required className="mt-1.5 h-11 rounded-[12px] border-black/[0.12]" />
        </div>
        <div>
          <Label className="text-[#0B0B0D]">Wachtwoord</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5 h-11 rounded-[12px] border-black/[0.12]" />
        </div>
        <Button type="submit" className="h-11 w-full rounded-[12px] bg-[#0B0B0D] hover:bg-[#0B0B0D]/90" disabled={loading}>
          {loading ? "Bezig..." : "Inloggen"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-[#6B7280]">
        Nog geen account? Je ontvangt een uitnodiging van Nexavo.{" "}
        <Link to="/portal/register" className="font-medium text-[#7547F8] hover:underline">Registreren</Link>
      </p>
    </PortalAuthShell>
  );
}
