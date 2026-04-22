"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, RefreshCw, ArrowRight, Tag, ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { DEAL_SECTIONS, dealItemToProduct, type DealSection } from "@/data/deals";
import type { Product } from "@/data/products";

export default function DealsClient() {
  const t = useTranslations("deals");
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(itemId: string, product: Parameters<typeof addItem>[0]) {
    addItem(product, 1);
    setAddedId(itemId);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <div className="bg-stone-900 pt-24 pb-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px"
        }} />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className="text-red-400" />
            <p className="text-red-400 text-xs font-bold tracking-widest uppercase">Larry Inver Wholesale Foods</p>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {t("heading")}
          </h1>
          <p className="text-stone-400 max-w-2xl text-sm leading-relaxed">{t("subheading")}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="tel:+12156275323"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors shadow-lg"
            >
              <Phone size={14} />
              (215) 627-5323
            </a>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-stone-300 rounded-full text-sm">
              <RefreshCw size={13} />
              Updated weekly
            </div>
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white rounded-full text-sm transition-colors"
            >
              Order Online <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Section filter pills */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection(null)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
              activeSection === null ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            All
          </button>
          {DEAL_SECTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => setActiveSection(s.title === activeSection ? null : s.title)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                activeSection === s.title ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              <span>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
        {DEAL_SECTIONS
          .filter((s) => activeSection === null || s.title === activeSection)
          .map((section, i) => (
            <SectionCard
              key={section.title}
              section={section}
              index={i}
              addedId={addedId}
              onAdd={handleAdd}
            />
          ))}

        {/* Disclaimer + CTA */}
        <div className="rounded-3xl bg-stone-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Pick Up at 939 N. 2nd Street, Philadelphia, PA 19123
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">{t("note")}</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="tel:+12156275323"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors"
            >
              <Phone size={14} /> {t("callToOrder")}
            </a>
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-colors"
            >
              Order Online <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
  section, index, addedId, onAdd,
}: {
  section: DealSection;
  index: number;
  addedId: string | null;
  onAdd: (id: string, product: Product) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${section.color} text-white`}>
        <span className="text-3xl drop-shadow">{section.icon}</span>
        <div className="flex-1">
          <h2 className="font-serif text-xl font-bold">{section.title}</h2>
          <p className="text-white/70 text-xs">{section.items.length} items this week</p>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-stone-50">
        {section.items.map((item, idx) => {
          const product = dealItemToProduct(item, section, idx);
          const isAdded = addedId === product.id;
          const isMarket = item.price === "Market";
          return (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 leading-snug">
                  {item.name}
                  {item.hot && (
                    <span className="ml-1.5 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Hot
                    </span>
                  )}
                </p>
                {item.note && (
                  <p className="text-xs text-stone-400 mt-0.5">{item.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isMarket ? (
                  <span className="text-xs font-semibold text-red-500 italic whitespace-nowrap">Call for Price</span>
                ) : (
                  <span className="text-sm font-bold text-stone-900 whitespace-nowrap">
                    {item.price}
                    <span className="text-xs font-normal text-stone-400 ml-0.5">{item.unit}</span>
                  </span>
                )}
                <button
                  onClick={() => onAdd(product.id, product)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0",
                    isAdded ? "bg-green-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                  )}
                >
                  {isAdded ? <><Check size={11} /> Added!</> : <><ShoppingCart size={11} /> Add</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
