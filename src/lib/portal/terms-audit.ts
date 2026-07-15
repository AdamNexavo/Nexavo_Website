import type { TermsAcceptanceAudit } from "./types";

export async function captureTermsAcceptance(): Promise<TermsAcceptanceAudit> {
  let ipAddress = "onbekend";
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = (await res.json()) as { ip?: string };
      if (data.ip) ipAddress = data.ip;
    }
  } catch {
    /* offline or blocked — fallback stays */
  }
  return {
    acceptedAt: new Date().toISOString(),
    ipAddress,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}
