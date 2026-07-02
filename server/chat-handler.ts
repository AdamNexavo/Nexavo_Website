import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import { NEXAVO_SYSTEM_PROMPT } from "../src/lib/chatbot/systemPrompt";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

type ChatRequestBody = {
  messages: { role: "user" | "assistant"; content: string }[];
  context?: string;
};

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export async function handleChatRequest(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string,
) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  let body: ChatRequestBody;
  try {
    body = JSON.parse(await readBody(req)) as ChatRequestBody;
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  const systemContent = [
    NEXAVO_SYSTEM_PROMPT,
    body.context
      ? `\n=== AANVULLENDE CONTEXT (relevant voor dit gesprek) ===\n${body.context}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const openAiMessages = [
    { role: "system" as const, content: systemContent },
    ...(body.messages ?? [])
      .filter((m) => m.content.trim())
      .map((message) => ({
        role: message.role,
        content: message.content,
      })),
  ];

  const wantsStream = req.headers.accept?.includes("text/event-stream");

  const openAiResponse = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
      messages: openAiMessages,
      temperature: 0.65,
      max_tokens: 1200,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stream: wantsStream,
    }),
  });

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();
    sendJson(res, openAiResponse.status, {
      error: "OpenAI request failed",
      detail: errorText,
    });
    return;
  }

  if (wantsStream && openAiResponse.body) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = openAiResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

      for (const line of lines) {
        const payload = line.slice(6).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[];
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  const data = (await openAiResponse.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  sendJson(res, 200, {
    message: data.choices?.[0]?.message?.content?.trim() ?? "",
  });
}

export function createChatApiMiddleware(apiKey?: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (!req.url?.startsWith("/api/chat")) {
      next();
      return;
    }

    if (!apiKey) {
      sendJson(res, 503, { error: "OPENAI_API_KEY not configured" });
      return;
    }

    void handleChatRequest(req, res, apiKey).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      sendJson(res, 500, { error: message });
    });
  };
}
