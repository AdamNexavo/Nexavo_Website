import { knowledgeChunks, type KnowledgeChunk } from "./knowledge";

const STOP_WORDS = new Set([
  "de", "het", "een", "en", "van", "in", "op", "is", "te", "voor", "met", "aan",
  "dat", "die", "ik", "je", "jij", "we", "wij", "kan", "kunnen", "wat", "hoe",
  "waar", "wie", "welk", "welke", "zijn", "er", "ook", "nog", "maar", "of", "als",
  "bij", "naar", "om", "uit", "tot", "door", "over", "mijn", "jullie", "graag",
  "wil", "willen", "heb", "hebben", "dit", "deze", "the", "and", "a", "me", "mij",
]);

const SYNONYMS: Record<string, string[]> = {
  pakket: ["plan", "pakketten", "abonnement", "formule"],
  prijs: ["prijzen", "kosten", "tarief", "bedrag", "euro"],
  onderhoud: ["beheer", "hosting", "support", "beheren"],
  revisie: ["wijziging", "wijzigingen", "aanpassing", "aanpassen"],
  website: ["site", "webpagina", "online"],
  boeking: ["boekingen", "afspraak", "afspraken", "agenda", "calendly", "kalender"],
  review: ["reviews", "beoordeling", "beoordelingen", "reputatie"],
  chatbot: ["chat", "ai", "assistent", "bot"],
  snel: ["snelheid", "oplevering", "levertijd", "klaar", "live"],
  kapper: ["salon", "kappers", "haar", "barber"],
  gym: ["sportschool", "fitness", "personal", "trainer", "coach"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    expanded.add(token);
    for (const [key, synonyms] of Object.entries(SYNONYMS)) {
      if (token === key || synonyms.includes(token)) {
        expanded.add(key);
        synonyms.forEach((s) => expanded.add(s));
      }
    }
  }
  return [...expanded];
}

export type RetrievedChunk = KnowledgeChunk & { score: number };

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export function buildRetrievalQuery(messages: ConversationMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user").slice(-2);
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const parts = [
    ...userMessages.map((m) => m.content),
    lastAssistant ? lastAssistant.content.slice(0, 300) : "",
  ].filter(Boolean);

  return parts.join(" ");
}

export function retrieveKnowledge(query: string, limit = 10): RetrievedChunk[] {
  const queryTokens = expandTokens(tokenize(query));
  if (queryTokens.length === 0) return [];

  const scored = knowledgeChunks.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase();
    const haystackTokens = new Set(tokenize(haystack));

    let score = 0;
    for (const token of queryTokens) {
      if (haystack.includes(token)) score += 2;
      if (haystackTokens.has(token)) score += 3;
      if (chunk.title.toLowerCase().includes(token)) score += 5;
      for (const keyword of chunk.keywords) {
        if (keyword.toLowerCase().includes(token)) score += 3;
      }
    }

    const normalizedQuery = query.toLowerCase();
    if (chunk.title.toLowerCase().includes(normalizedQuery)) score += 10;
    if (chunk.content.toLowerCase().includes(normalizedQuery)) score += 5;

    return { ...chunk, score };
  });

  const seen = new Set<string>();
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}

export function retrieveForConversation(
  messages: ConversationMessage[],
  limit = 10,
): RetrievedChunk[] {
  const query = buildRetrievalQuery(messages);
  const results = retrieveKnowledge(query, limit);

  if (results.length > 0) return results;

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return lastUser ? retrieveKnowledge(lastUser.content, limit) : [];
}

export function buildContextFromChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map((chunk, index) => `[${index + 1}] ${chunk.title}\n${chunk.content}`)
    .join("\n\n");
}
