import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { useToast } from "@/hooks/use-toast";
import { PortalAuthShell } from "@/components/portal/PortalAuthShell";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@nexavo.works");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin, isAdmin } = usePortalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginAsAdmin(email, password);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Inloggen mislukt", description: result.error, variant: "destructive" });
      return;
    }
    navigate("/admin");
  };

  return (
    <PortalAuthShell
      label="Admin console"
      title="Nexavo beheer"
      subtitle="Beheer klanten, aanvragen, tickets en betalingen vanuit één plek."
      variant="admin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-[#0B0B0D]">E-mailadres</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 h-11 rounded-[12px] border-black/[0.12]" />
        </div>
        <div>
          <Label className="text-[#0B0B0D]">Wachtwoord</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5 h-11 rounded-[12px] border-black/[0.12]" />
        </div>
        <Button type="submit" className="h-11 w-full rounded-[12px] bg-[#7547F8] hover:bg-[#6840E0]" disabled={loading}>
          {loading ? "Bezig..." : "Inloggen"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-[#6B7280]">
        <Link to="/" className="hover:text-[#0B0B0D]">← Terug naar website</Link>
      </p>
    </PortalAuthShell>
  );
}
