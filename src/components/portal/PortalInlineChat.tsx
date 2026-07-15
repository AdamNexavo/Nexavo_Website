import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createAssistantMessage,
  createUserMessage,
  sendChatMessage,
  WELCOME_MESSAGE,
  type ChatMessage,
} from "@/lib/chatbot/chatService";
import { suggestedQuestions } from "@/lib/chatbot/knowledge";
import { ROUTES } from "@/lib/routes";

function formatMessage(content: string) {
  return content.split("\n").map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ));
}

export function PortalInlineChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createAssistantMessage(WELCOME_MESSAGE),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = createUserMessage(text.trim());
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const reply = await sendChatMessage([...messages, userMsg]);
      setMessages((m) => [...m, createAssistantMessage(reply)]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[480px] flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.10)]">
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#FAFAFA] px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7547F8] text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-[#0B0B0D]">Nexavo assistent</p>
          <p className="text-[12px] text-[#6B7280]">Stel je vraag — we helpen je direct</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
                msg.role === "user"
                  ? "rounded-br-md bg-[#7547F8] text-white"
                  : "rounded-bl-md border border-black/[0.06] bg-[#F5F4F2] text-[#0B0B0D]",
              )}
            >
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <p className="text-[13px] text-[#9CA3AF]">Nexavo is aan het typen…</p>
        )}
      </div>

      <div className="border-t border-black/[0.06] p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedQuestions.slice(0, 3).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full bg-[#F5F4F2] px-3 py-1.5 text-[12px] text-[#6B7280] hover:bg-[#EBEBEA]"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Typ je vraag…"
            rows={2}
            className="flex-1 resize-none rounded-[16px] border border-black/[0.08] bg-[#FAFAFA] px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7547F8]/30"
          />
          <Button
            type="button"
            onClick={() => send(input)}
            disabled={isLoading || !input.trim()}
            className="shrink-0 rounded-full bg-[#7547F8] hover:bg-[#6840E0]"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-3 text-center text-[12px] text-[#9CA3AF]">
          Meer antwoorden?{" "}
          <Link to={ROUTES.kennisbank} className="font-medium text-[#7547F8] hover:underline">
            Bekijk de kennisbank
          </Link>
        </p>
      </div>
    </div>
  );
}
