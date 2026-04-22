"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle, X, Send, ShoppingCart, Bot } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS } from "@/data/products";
import { formatCurrency } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  chips?: SuggestionChip[];
};

type SuggestionChip = {
  label: string;
  productId: string;
};

function findProductChips(text: string): SuggestionChip[] {
  const lower = text.toLowerCase();
  const matched = PRODUCTS.filter((p) =>
    p.name.toLowerCase().split(" ").some((word) => lower.includes(word))
  ).slice(0, 3);
  return matched.map((p) => ({ label: `${p.name} — ${p.unitSize}`, productId: p.id }));
}

export default function AIAssistant() {
  const t = useTranslations("ai");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  const handleChipClick = (chip: SuggestionChip) => {
    const product = PRODUCTS.find((p) => p.id === chip.productId);
    if (!product) return;
    addItem(product, 1);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: `✅ Added **${product.name}** (${product.unitSize} — ${formatCurrency(product.price)}) to your cart! Anything else you need?`,
      },
    ]);
    if (!open) setUnread((n) => n + 1);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value);
          setMessages((m) => {
            const updated = [...m];
            updated[updated.length - 1] = { role: "assistant", content: full };
            return updated;
          });
        }
      }

      // Find product chips from the response
      const chips = findProductChips(full + " " + text);
      if (chips.length > 0) {
        setMessages((m) => {
          const updated = [...m];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            chips,
          };
          return updated;
        });
      }

      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("fallback") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col"
              style={{ height: "480px" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">LIW Assistant</p>
                    <p className="text-stone-400 text-xs">AI-powered ordering help</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-stone-400 hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-amber-500 text-white rounded-br-sm"
                            : "bg-white text-stone-700 rounded-bl-sm shadow-sm border border-stone-100"
                        }`}
                      >
                        {msg.content || (
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        )}
                      </div>

                      {/* Suggestion chips */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          {msg.chips.map((chip) => (
                            <button
                              key={chip.productId}
                              onClick={() => handleChipClick(chip)}
                              className="flex items-center gap-2 px-3 py-2 bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-700 rounded-xl text-xs font-medium text-left transition-all group"
                            >
                              <ShoppingCart size={12} className="shrink-0 group-hover:text-amber-600" />
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                      <span className="flex gap-1">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-stone-100 bg-white">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("placeholder")}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
                    aria-label={t("send")}
                  >
                    <Send size={15} />
                  </button>
                </form>
                <p className="text-center text-[10px] text-stone-300 mt-2">
                  Powered by AI · Philadelphia, PA
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fab button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center transition-colors relative"
          aria-label="Open AI assistant"
        >
          <AnimatePresence>
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </motion.button>
      </div>
    </>
  );
}
