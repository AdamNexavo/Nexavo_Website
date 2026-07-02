import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shouldShowCookieBanner } from "@/lib/cookie-consent";
import {
  createAssistantMessage,
  createUserMessage,
  sendChatMessage,
  WELCOME_MESSAGE,
  type ChatMessage,
} from "@/lib/chatbot/chatService";
import { suggestedQuestions } from "@/lib/chatbot/knowledge";

function formatMessage(content: string) {
  return content.split("\n").map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ));
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md border border-border/60",
        )}
      >
        {formatMessage(message.content)}
      </div>
    </div>
  );
}

export function NexavoChatbot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createAssistantMessage(WELCOME_MESSAGE),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncCookieBanner = () => setCookieBannerVisible(shouldShowCookieBanner());
    syncCookieBanner();

    const intervalId = window.setInterval(syncCookieBanner, 1000);
    window.addEventListener("storage", syncCookieBanner);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", syncCookieBanner);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const userMessage = createUserMessage(content);
    const assistantPlaceholder = createAssistantMessage("");
    const nextMessages = [...messages, userMessage];

    setMessages([...nextMessages, assistantPlaceholder]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const reply = await sendChatMessage(nextMessages, (partial) => {
        setMessages((current) => {
          const updated = [...current];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant") {
            updated[updated.length - 1] = { ...last, content: partial };
          }
          return updated;
        });
        scrollToBottom();
      });

      setMessages((current) => {
        const updated = [...current];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = { ...last, content: reply };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  if (!mounted) return null;

  const launcherBottomClass = cookieBannerVisible
    ? "bottom-[13.5rem] sm:bottom-[12.5rem]"
    : "bottom-5 sm:bottom-6";

  const panelBottomClass = cookieBannerVisible
    ? "bottom-[17.5rem] sm:bottom-[16.5rem]"
    : "bottom-24";

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed right-4 z-[120] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-[0_24px_64px_-24px_rgba(0,0,0,0.35)] sm:right-6",
              panelBottomClass,
            )}
            style={{ height: "min(520px, calc(100vh - 7rem))" }}
            role="dialog"
            aria-label="Nexavo chatassistent"
          >
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nexavo assistent</p>
                  <p className="text-xs text-muted-foreground">Vragen over pakketten & diensten</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
                aria-label="Chat sluiten"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-border/60 bg-muted px-3.5 py-2.5">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void handleSend(question)}
                      className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border/70 bg-background p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Stel je vraag..."
                  rows={1}
                  disabled={isLoading}
                  className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60"
                />
                <Button
                  type="button"
                  variant="brand"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Bericht versturen"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                AI-assistent op basis van Nexavo-kennis.{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  Liever persoonlijk contact?
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "fixed right-4 z-[120] flex items-center gap-2 rounded-full bg-primary pl-4 pr-5 text-primary-foreground shadow-[0_12px_40px_-12px_hsl(255_80%_60%_/_0.65)] transition-transform hover:scale-[1.02] sm:right-6",
          launcherBottomClass,
          open ? "h-14 w-14 justify-center p-0" : "h-14",
        )}
        aria-label={open ? "Chat sluiten" : "Open Nexavo chat"}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">Chat</span>
          </>
        )}
      </motion.button>
    </>,
    document.body,
  );
}
