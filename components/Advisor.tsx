"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/translations";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function getWelcome(locale: Locale): string {
  if (locale === "en") {
    return `Hello! I'm Idan LaNadlan's AI advisor 🏠\n\nI can help you with:\n• **Purchase tax** calculations\n• **Mortgage limits** (LTV)\n• **Capital gains tax** & exemptions\n• **Steps of a real estate deal**\n• **Buyer costs** & fees\n\nWhat would you like to know?`;
  }
  if (locale === "fr") {
    return `Bonjour! Je suis le conseiller IA d'Idan LaNadlan 🏠\n\nJe peux vous aider avec:\n• Calcul de la **taxe d'achat**\n• **Limites de prêt** (LTV)\n• **Taxe sur la plus-value** & exonérations\n• **Étapes d'une transaction** immobilière\n• **Frais** pour l'acheteur\n\nQue souhaitez-vous savoir?`;
  }
  return `שלום! אני היועץ הנדל"ני של עידן לנדל"ן 🏠\n\nאני יכול לעזור לך עם:\n• חישוב **מס רכישה** לנכס\n• **מגבלות משכנתא** (LTV)\n• **מס שבח** ופטורים\n• **שלבי עסקת נדל"ן**\n• **עלויות נלוות** לרוכש\n\nמה תרצה לדעת?`;
}

export default function Advisor() {
  const { t, locale } = useLanguage();
  const ad = t.advisor;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const reset = () => setMessages([]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) throw new Error("network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: accumulated };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: ad.error,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const renderMessage = (text: string) => {
    return text
      .split(/(\*\*[^*]+\*\*)/g)
      .map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-gold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      );
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={ad.trigger_title}
        className={`fixed bottom-6 left-3 sm:left-6 z-50 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{
          background: "linear-gradient(135deg, #C9A96E, #a07840)",
          boxShadow: "0 4px 28px rgba(201, 169, 110, 0.45)",
        }}
      >
        <MessageCircle size={20} className="text-black shrink-0" />
        <div className="text-right leading-tight">
          <p className="text-black text-xs font-bold whitespace-nowrap">{ad.trigger_title}</p>
          <p className="text-black/70 text-[10px] whitespace-nowrap">{ad.trigger_subtitle}</p>
        </div>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-6 left-3 sm:left-6 z-50 w-[calc(100vw-24px)] sm:w-[360px] max-h-[75vh] sm:max-h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: "1px solid rgba(201, 169, 110, 0.3)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background: "linear-gradient(135deg, #0A0A0A 0%, #1a1510 100%)",
                borderBottom: "1px solid rgba(201, 169, 110, 0.2)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #a07840)" }}
                >
                  <MessageCircle size={15} className="text-black" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-cream leading-tight">{ad.title}</p>
                  <p className="text-[10px] text-gold leading-tight">Idan LaNadlan</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    aria-label={ad.reset_aria}
                    className="p-1.5 text-gray-light hover:text-gold rounded transition-colors"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label={ad.close_aria}
                  className="p-1.5 text-gray-light hover:text-cream rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ background: "#0e0e0e" }}
            >
              {/* Welcome bubble */}
              <div
                className="self-start max-w-[88%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(201,169,110,0.15)",
                  color: "#F5F5F0",
                }}
              >
                {renderMessage(getWelcome(locale))}
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "self-end rounded-br-sm text-black"
                      : "self-start rounded-tl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "#C9A96E" }
                      : {
                          background: "#1a1a1a",
                          border: "1px solid rgba(201,169,110,0.15)",
                          color: "#F5F5F0",
                        }
                  }
                >
                  {msg.role === "assistant"
                    ? renderMessage(msg.content || "…")
                    : msg.content}
                </div>
              ))}

              {loading && messages[messages.length - 1]?.content === "" && (
                <div
                  className="self-start flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(201,169,110,0.15)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gold opacity-70 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 shrink-0 flex items-end gap-2"
              style={{
                background: "#111",
                borderTop: "1px solid rgba(201,169,110,0.15)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={ad.input_placeholder}
                rows={1}
                disabled={loading}
                aria-label="הודעה ליועץ"
                className="flex-1 resize-none bg-transparent text-cream text-sm focus:outline-none py-1.5 leading-relaxed max-h-24 overflow-y-auto"
                style={{ direction: "rtl" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="שלח הודעה"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110 active:scale-95"
                style={{
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, #C9A96E, #a07840)"
                    : "rgba(201,169,110,0.15)",
                }}
              >
                <Send
                  size={14}
                  className={input.trim() && !loading ? "text-black" : "text-gold"}
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>
            </div>

            {/* Footer note */}
            <div
              className="px-4 py-2 text-center shrink-0"
              style={{
                background: "#0e0e0e",
                borderTop: "1px solid rgba(201,169,110,0.08)",
              }}
            >
              <p className="text-[10px] text-gray-light">
                {ad.disclaimer}{" "}
                <a
                  href="https://wa.me/972549791171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
