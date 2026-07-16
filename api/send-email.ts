import type { IncomingMessage, ServerResponse } from "node:http";

type SendBody = {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
};

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "no-reply@nexavo.works";

  let body: SendBody;
  try {
    body = JSON.parse(await readBody(req)) as SendBody;
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "Invalid JSON body" }));
    return;
  }

  if (!body.to || !body.subject || !body.html) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "to, subject and html are required" }));
    return;
  }

  if (!apiKey) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ok: true,
        mode: "demo",
        message:
          "RESEND_API_KEY ontbreekt — e-mail niet verzonden. Voeg RESEND_API_KEY toe in Vercel env vars.",
      }),
    );
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: body.from ?? from,
        to: [body.to],
        subject: body.subject,
        html: body.html,
        text: body.text,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      res.statusCode = response.status;
      res.end(JSON.stringify({ ok: false, error: data.message ?? "Resend API error" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, mode: "sent", id: data.id }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Send failed" }));
  }
}
