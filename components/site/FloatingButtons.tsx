"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What products do you recommend for dry skin?",
  "Are your products fragrance-free?",
  "How long does shipping take to Pakistan?",
  "What's in the Glow Serum?",
];

const WHATSAPP_FALLBACK = "923008662833";

export default function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false);
  const [waNumber, setWaNumber] = useState(WHATSAPP_FALLBACK);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! 👋 I'm the Sleet Care AI assistant. Ask me about our skincare products, ingredients, or your routine!" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load WhatsApp number from DB
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d?.contact_whatsapp) setWaNumber(d.contact_whatsapp); })
      .catch(() => {});
  }, []);

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi! I'd like to enquire about Sleet Care skincare products.")}`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setThinking(true);

    try {
      // Build message history for API (exclude initial greeting from history)
      const history = updatedMessages
        .filter((m) => !(m.role === "assistant" && m.text.startsWith("Hi! 👋")))
        .map((m) => ({ role: m.role, content: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, {
        role: "assistant",
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact us at hello@sleetcare.com",
      }]);
    } finally {
      setThinking(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* ── Floating buttons ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* WhatsApp button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative w-14 h-14 rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none border border-white/10">
            Chat on WhatsApp
          </span>
        </a>

        {/* AI Chat button */}
        <button
          onClick={() => setChatOpen((o) => !o)}
          aria-label="AI Assistant"
          className={`group relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            chatOpen
              ? "bg-slate-800 border-2 border-sky-400/50 shadow-sky-500/20"
              : "bg-gradient-to-br from-sky-500 to-purple-600 shadow-sky-500/30 hover:scale-110"
          }`}
        >
          {chatOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute inset-0 rounded-full bg-sky-400/30 animate-ping" />
              <span className="absolute right-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none border border-white/10">
                AI Assistant
              </span>
            </>
          )}
        </button>
      </div>

      {/* ── Chat window ── */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-slate-900 animate-fade-up">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-600 to-purple-600">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">Sleet Care AI</div>
              <div className="text-[10px] text-sky-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Skincare assistant · Instant replies
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-sky-500 text-white rounded-br-sm"
                      : "bg-slate-800 text-slate-200 rounded-bl-sm border border-white/5"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-slate-800 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only on first message */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:border-sky-400/50 hover:text-sky-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-slate-900/80 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about skincare, ingredients, shipping..."
              disabled={thinking}
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/50 transition disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
            >
              {thinking ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
