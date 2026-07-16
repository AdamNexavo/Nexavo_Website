import {
  buildContextFromChunks,
  retrieveForConversation,
} from "./retrieve";
import { generateLocalResponse } from "./localChat";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const API_URL = "/api/chat";

let aiAvailable: boolean | null = null;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isAiModeActive(): boolean {
  return aiAvailable === true;
}

async function checkAiAvailability(): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "ping" }] }),
    });
    aiAvailable = response.ok;
    return response.ok;
  } catch {
    aiAvailable = false;
    return false;
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  onDelta?: (text: string) => void,
): Promise<string> {
  const conversation = messages.map(({ role, content }) => ({ role, content }));
  const context = buildContextFromChunks(retrieveForConversation(conversation, 12));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        messages: conversation,
        context,
      }),
    });

    if (!response.ok) {
      aiAvailable = false;
      throw new Error(`API ${response.status}`);
    }

    aiAvailable = true;
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("text/event-stream") && response.body && onDelta) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload) as { delta?: string };
            if (parsed.delta) {
              full += parsed.delta;
              onDelta(full);
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }

      const trimmed = full.trim();
      if (trimmed) return trimmed;
      return streamLocalFallback(conversation, onDelta);
    }

    const data = (await response.json()) as { message?: string };
    const reply = data.message?.trim();
    if (reply) return reply;
    return streamLocalFallback(conversation, onDelta);
  } catch {
    return streamLocalFallback(conversation, onDelta);
  }
}

function streamLocalFallback(
  conversation: { role: "user" | "assistant"; content: string }[],
  onDelta?: (text: string) => void,
): string {
  const reply = generateLocalResponse(conversation);
  if (onDelta) {
    const words = reply.split(" ");
    let partial = "";
    for (let i = 0; i < words.length; i++) {
      partial += (i === 0 ? "" : " ") + words[i];
      onDelta(partial);
    }
  }
  return reply;
}

export function createUserMessage(content: string): ChatMessage {
  return { id: createId(), role: "user", content };
}

export function createAssistantMessage(content: string): ChatMessage {
  return { id: createId(), role: "assistant", content };
}

export const WELCOME_MESSAGE =
  "Hoi! Goed dat je er bent. Waar kan ik je mee helpen? Wil je meer weten over pakketten, onderhoud, automatiseringen, of welk pakket het beste bij jouw bedrijf past?";

export const PORTAL_WELCOME_MESSAGE =
  "Hoi! Ik help je met vragen over je project, intake, facturatie en het klantportaal. Voor wijzigingen aan je website raden we aan een supportticket te openen — dan pakken we het persoonlijk op.";

export const PORTAL_SUGGESTED_QUESTIONS = [
  "Hoe dien ik een wijziging in?",
  "Waar vind ik mijn facturen?",
  "Wat is de status van mijn website?",
];

export { checkAiAvailability };
