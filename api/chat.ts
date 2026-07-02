import type { IncomingMessage, ServerResponse } from "node:http";
import { handleChatRequest } from "../server/chat-handler";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "OPENAI_API_KEY not configured" }));
    return;
  }

  await handleChatRequest(req, res, apiKey);
}
